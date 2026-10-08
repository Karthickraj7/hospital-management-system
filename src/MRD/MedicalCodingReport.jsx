// // // --- FULL CODE STARTS HERE (NO LOGIC DISTURBED, ONLY FIXED WHERE NEEDED) ---
// // import React, { useEffect, useRef, useState } from "react";
// // import axios from "axios";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// // import PrintIcon from '@mui/icons-material/Print';
// // import { useReactToPrint } from "react-to-print";

// // const MedicalCodingReport = () => {
// //   const UrlLink = useSelector(state => state.userRecord?.UrlLink);
// //   const UserData = useSelector((state) => state.userRecord?.UserData);
// //   const dispatchvalue = useDispatch();
// //   const navigate = useNavigate();
// //   const componentRef = useRef();

// //   const API_URL = "http://127.0.0.1:8000/MRD/MedicalCodingReport";

// //   const formatDate = (date) => {
// //     const d = new Date(date);
// //     const month = (d.getMonth() + 1).toString().padStart(2, "0");
// //     const day = d.getDate().toString().padStart(2, "0");
// //     const year = d.getFullYear();
// //     return `${year}-${month}-${day}`;
// //   };

// //   const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
// //   const [viewType, setViewType] = useState("DiagnoseWise");

// //   // API Data state
// //   const [ReportData, setReportData] = useState([]);

// //   // Modal state
// //   const [OpenModal, setOpenModal] = useState(false);
  
// //   const openModal = () => {
// //     if (!UserData?.username) {
// //       console.log("❌ User not loaded yet!");
// //       return;
// //     }
// //     fetchReport();     // FIX: Now UserData exists before calling
// //     setOpenModal(true);
// //   };

// //   const closeModal = () => setOpenModal(false);

// //   // Search options
// //   const [searchOptions, setSearchOptions] = useState({
// //     DateType: 'Current',
// //     CurrentDate: formatDate(new Date()),
// //     FromDate: '',
// //     ToDate: '',
// //     userid: "",
// //   });

// //   // FIX: Update searchOptions.userid AFTER UserData loads
// //   useEffect(() => {
// //     if (UserData?.username) {
// //       setSearchOptions(prev => ({
// //         ...prev,
// //         userid: UserData.username,
// //       }));
// //     }
// //   }, [UserData]);

// //   const HandleOnchangeSearch = (e) => {
// //     const { name, value } = e.target;

// //     if (name === 'DateType') {
// //       if (value === 'Current') {
// //         setSearchOptions((prev) => ({
// //           ...prev,
// //           DateType: value,
// //           CurrentDate: TodayDate,
// //           FromDate: '',
// //           ToDate: '',
// //         }));
// //       } else if (value === 'Customize') {
// //         setSearchOptions((prev) => ({
// //           ...prev,
// //           DateType: value,
// //           CurrentDate: '',
// //         }));
// //       }
// //     } else {
// //       setSearchOptions((prev) => ({
// //         ...prev,
// //         [name]: value,
// //       }));
// //     }
// //   };

// //   // Fetch API using Axios
// //   const fetchReport = async () => {
// //     try {
// //       const params = {
// //         DateType: searchOptions.DateType,
// //         CurrentDate: searchOptions.CurrentDate,
// //         FromDate: searchOptions.FromDate,
// //         ToDate: searchOptions.ToDate,
// //         userid: searchOptions.userid
// //       };

// //       console.log("📡 API Params Sent:", params);

// //       const response = await axios.get(API_URL, { params });

// //       console.log("📥 API Response:", response.data);

// //       if (response.data?.Status === "Success") {
// //         setReportData(response.data?.data || []);
// //       } else {
// //         setReportData([]);
// //       }

// //     } catch (error) {
// //       console.error("API ERROR:", error);
// //       setReportData([]);
// //     }
// //   };

// //   const handlePrint = useReactToPrint({
// //     content: () => componentRef.current,
// //   });

// //   const handlePrintClose = () => {
// //     setOpenModal(false);
// //   };
// // const MedicalCodingPrint = () => {
// //     return (
// //       <div
// //         ref={componentRef}
// //         style={{
// //           fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// //           padding: '20px',
// //           maxWidth: '1200px',
// //           margin: '0 auto',
// //         }}
// //       >
// //         <div
// //           className="Register_btn_con added_Register_btn_con"
// //           style={{
// //             marginBottom: '20px',
// //             display: 'flex',
// //             gap: '10px',
// //             justifyContent: 'flex-end',
// //           }}
// //         >
// //           <button
// //             className="RegisterForm_1_btns jwedu6_99"
// //             onClick={handlePrint}
// //             style={{
// //               padding: '8px 16px',
// //               backgroundColor: '#3498db',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '4px',
// //               cursor: 'pointer',
// //               fontWeight: '500',
// //               transition: 'background-color 0.3s',
// //             }}
// //           >
// //             Print Report
// //           </button>

// //           <button
// //             className="RegisterForm_1_btns jwedu6_99"
// //             onClick={handlePrintClose}
// //             style={{
// //               padding: '8px 16px',
// //               backgroundColor: '#e74c3c',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '4px',
// //               cursor: 'pointer',
// //               fontWeight: '500',
// //               transition: 'background-color 0.3s',
// //             }}
// //           >
// //             Close
// //           </button>
// //         </div>

// //         <div
// //           style={{
// //             display: 'flex',
// //             flexDirection: 'column',
// //             minHeight: '100vh',
// //             backgroundColor: 'white',
// //             boxShadow: '0 0 20px rgba(0,0,0,0.1)',
// //             borderRadius: '8px',
// //             padding: '20px',
// //           }}
// //         >
// //           <table
// //             style={{
// //               width: '100%',
// //               borderCollapse: 'collapse',
// //               border: '1px solid #dee2e6',
// //               marginBottom: '20px',
// //             }}
// //           >
// //             <thead>
// //               <tr>
// //                 <td
// //                   colSpan="11"
// //                   style={{
// //                     border: 'none',
// //                     textAlign: 'center',
// //                     padding: '15px 0',
// //                     backgroundColor: '#f8f9fa',
// //                   }}
// //                 >
// //                   <div>
// //                     <h2
// //                       style={{
// //                         margin: '0',
// //                         fontSize: '24px',
// //                         fontWeight: 'bold',
// //                         color: '#2c3e50',
// //                         letterSpacing: '0.5px',
// //                       }}
// //                     >
// //                       KARUNA MEDICAL COLLEGE HOSPITAL
// //                     </h2>
// //                     <h1
// //                       style={{
// //                         margin: '5px 0 0',
// //                         fontSize: '18px',
// //                         fontWeight: '500',
// //                         color: '#7f8c8d',
// //                         letterSpacing: '0.3px',
// //                       }}
// //                     >
// //                       Vilayodi, Chittur, Palakkad
// //                     </h1>
// //                     <p
// //                       style={{
// //                         margin: '10px 0 0',
// //                         fontSize: '14px',
// //                         color: '#34495e',
// //                         fontWeight: '500',
// //                       }}
// //                     >
// //                       {searchOptions.DateType === 'Current'
// //                         ? `Report Date: ${searchOptions.CurrentDate}`
// //                         : `Report From: ${searchOptions.FromDate} To: ${searchOptions.ToDate}`}
// //                     </p>
// //                     <h3
// //                       style={{
// //                         margin: '10px 0 0',
// //                         fontSize: '16px',
// //                         color: '#2c3e50',
// //                         fontWeight: '600',
// //                       }}
// //                     >
// //                       DIAGNOSE WISE CODING REPORT
// //                     </h3>
// //                   </div>
// //                 </td>
// //               </tr>

// //               <tr
// //                 style={{
// //                   fontWeight: 'bold',
// //                   fontSize: '12px',
// //                   backgroundColor: '#3498db',
// //                   color: 'white',
// //                 }}
// //               >
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   S.No
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   Patient Id
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   Patient Name
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   Diagnosis Code
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   Diagnosis Description
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   Revenue
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   Age
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                  Gender
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   Speciality
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   Discharge Date
// //                 </th>
// //                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
// //                   Admission Date
// //                 </th>
                
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {ReportData.length === 0 ? (
// //                 <tr>
// //                   <td colSpan="11" style={{ textAlign: 'center', padding: '20px', border: '1px solid #dee2e6' }}>
// //                     No Records Found
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 ReportData.map((item, index) => (
// //                   <tr
// //                     key={index}
// //                     style={{
// //                       fontSize: '11px',
// //                       backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
// //                     }}
// //                   >
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {index + 1}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item.Patient_Id}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item.Patient_Name}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item.ICDCode}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item.Code_Description}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item.Diagnosis}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item.age}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item.gender}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item.speciality}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item["discharge date"]}
// //                     </td>
// //                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
// //                       {item["Admission date"]}
// //                     </td>
                    
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>

// //           <div
// //             style={{
// //               marginTop: '20px',
// //               padding: '15px',
// //               backgroundColor: '#f8f9fa',
// //               borderLeft: '4px solid #3498db',
// //               borderRadius: '4px',
// //             }}
// //           >
// //             <p
// //               style={{
// //                 margin: '0',
// //                 fontSize: '12px',
// //                 color: '#7f8c8d',
// //                 lineHeight: '1.5',
// //               }}
// //             >
// //               <strong>Note:</strong> This report includes medical coding details with diagnosis codes, patient information, and status.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };
// //   return (
// //     <>
// //       <div className="Main_container_app">
// //         <h3>Medical Coding Report</h3>

// //         {/* View Type */}
// //         <div className="RegisterTypecon">
// //           <div className="RegisterType">
// //             {["DiagnoseWise", "DepartmentWise"].map((p, ind) => (
// //               <div className="registertypeval" key={ind + "key"}>
// //                 <input type="radio" id={p} checked={viewType === p} onChange={() => setViewType(p)} />
// //                 <label htmlFor={p}>{p}</label>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         <div className="search_div_bar" style={{ width: "100%" }}>
// //           <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
            
// //             {/* Date Type */}
// //             <div className="RegisForm_1">
// //               <label>Date Type<span>:</span></label>
// //               <select name="DateType" value={searchOptions.DateType} onChange={HandleOnchangeSearch}>
// //                 <option value="Current">Current Date</option>
// //                 <option value="Customize">Customize</option>
// //               </select>
// //             </div>

// //             {searchOptions.DateType === "Current" && (
// //               <div className="RegisForm_1">
// //                 <label>Current Date<span>:</span></label>
// //                 <input type="date" readOnly value={searchOptions.CurrentDate} />
// //               </div>
// //             )}

// //             {searchOptions.DateType === "Customize" && (
// //               <>
// //                 <div className="RegisForm_1">
// //                   <label>From Date<span>:</span></label>
// //                   <input type="date" name="FromDate" value={searchOptions.FromDate} onChange={HandleOnchangeSearch} />
// //                 </div>

// //                 <div className="RegisForm_1">
// //                   <label>To Date<span>:</span></label>
// //                   <input type="date" name="ToDate" value={searchOptions.ToDate} onChange={HandleOnchangeSearch} />
// //                 </div>
// //               </>
// //             )}

// //             {/* Print Button */}
// //             <div className="RegisForm_1" style={{ justifyContent: "space-evenly" }}>
// //               <label>Print<span>:</span></label>
// //               <button style={{ width: "60px", height: "60px" }} onClick={openModal}>
// //                 <PrintIcon style={{ fontSize: "32px" }} />
// //               </button>
// //             </div>

// //           </div>
// //         </div>
// //       </div>

// //       {/* Print Modal */}
// //       {OpenModal && (
// //         <div className="loader" onClick={closeModal}>
// //           <div className="cardModel" onClick={(e) => e.stopPropagation()}>
// //             <MedicalCodingPrint />
// //           </div>
// //         </div>
// //       )}

// //     </>
// //   );
// // };

// // export default MedicalCodingReport;



// // --- FULL CODE STARTS HERE (NO LOGIC DISTURBED, ONLY FIXED WHERE NEEDED) ---
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import PrintIcon from '@mui/icons-material/Print';
// import { useReactToPrint } from "react-to-print";

// const MedicalCodingReport = () => {
//   const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//   const UserData = useSelector((state) => state.userRecord?.UserData);
//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();
//   const componentRef = useRef();

//   const API_URL = "http://127.0.0.1:8000/MRD/MedicalCodingReport";

//   const formatDate = (date) => {
//     const d = new Date(date);
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const day = d.getDate().toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
//   const [viewType, setViewType] = useState("DiagnoseWise");

//   // API Data state
//   const [ReportData, setReportData] = useState([]);
//   const [DepartmentWiseData, setDepartmentWiseData] = useState({});

//   // Modal state
//   const [OpenModal, setOpenModal] = useState(false);
  
//   const openModal = () => {
//     if (!UserData?.username) {
//       console.log("❌ User not loaded yet!");
//       return;
//     }
//     fetchReport();     // FIX: Now UserData exists before calling
//     setOpenModal(true);
//   };

//   const closeModal = () => setOpenModal(false);

//   // Search options
//   const [searchOptions, setSearchOptions] = useState({
//     DateType: 'Current',
//     CurrentDate: formatDate(new Date()),
//     FromDate: '',
//     ToDate: '',
//     userid: "",
//   });

//   // FIX: Update searchOptions.userid AFTER UserData loads
//   useEffect(() => {
//     if (UserData?.username) {
//       setSearchOptions(prev => ({
//         ...prev,
//         userid: UserData.username,
//       }));
//     }
//   }, [UserData]);

//   const HandleOnchangeSearch = (e) => {
//     const { name, value } = e.target;

//     if (name === 'DateType') {
//       if (value === 'Current') {
//         setSearchOptions((prev) => ({
//           ...prev,
//           DateType: value,
//           CurrentDate: TodayDate,
//           FromDate: '',
//           ToDate: '',
//         }));
//       } else if (value === 'Customize') {
//         setSearchOptions((prev) => ({
//           ...prev,
//           DateType: value,
//           CurrentDate: '',
//         }));
//       }
//     } else {
//       setSearchOptions((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   // Process data for DepartmentWise view
//   const processDepartmentWiseData = (data) => {
//     const departmentMap = {};
    
//     data.forEach((item) => {
//       const department = item.speciality || "Unknown Department";
      
//       if (!departmentMap[department]) {
//         departmentMap[department] = {
//           department: department,
//           totalPatients: 0,
//           patients: []
//         };
//       }
      
//       departmentMap[department].totalPatients += 1;
//       departmentMap[department].patients.push(item);
//     });
    
//     return departmentMap;
//   };

//   // Fetch API using Axios
//   const fetchReport = async () => {
//     try {
//       const params = {
//         DateType: searchOptions.DateType,
//         CurrentDate: searchOptions.CurrentDate,
//         FromDate: searchOptions.FromDate,
//         ToDate: searchOptions.ToDate,
//         userid: searchOptions.userid
//       };

//       console.log("📡 API Params Sent:", params);

//       const response = await axios.get(API_URL, { params });

//       console.log("📥 API Response:", response.data);

//       if (response.data?.Status === "Success") {
//         const data = response.data?.data || [];
//         setReportData(data);
        
//         // Process data for DepartmentWise view
//         if (viewType === "DepartmentWise") {
//           const processedData = processDepartmentWiseData(data);
//           setDepartmentWiseData(processedData);
//         } else {
//           setDepartmentWiseData({});
//         }
//       } else {
//         setReportData([]);
//         setDepartmentWiseData({});
//       }

//     } catch (error) {
//       console.error("API ERROR:", error);
//       setReportData([]);
//       setDepartmentWiseData({});
//     }
//   };

//   // Re-fetch when viewType changes
//   useEffect(() => {
//     if (ReportData.length > 0) {
//       if (viewType === "DepartmentWise") {
//         const processedData = processDepartmentWiseData(ReportData);
//         setDepartmentWiseData(processedData);
//       }
//     }
//   }, [viewType]);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const handlePrintClose = () => {
//     setOpenModal(false);
//   };

//   // Department Wise Print Component
//   const DepartmentWisePrint = () => {
//     const departments = Object.values(DepartmentWiseData);
    
//     return (
//       <div
//         ref={componentRef}
//         style={{
//           fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//           padding: '20px',
//           maxWidth: '1200px',
//           margin: '0 auto',
//         }}
//       >
//         <div
//           className="Register_btn_con added_Register_btn_con"
//           style={{
//             marginBottom: '20px',
//             display: 'flex',
//             gap: '10px',
//             justifyContent: 'flex-end',
//           }}
//         >
//           <button
//             className="RegisterForm_1_btns jwedu6_99"
//             onClick={handlePrint}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#3498db',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontWeight: '500',
//               transition: 'background-color 0.3s',
//             }}
//           >
//             Print Report
//           </button>

//           <button
//             className="RegisterForm_1_btns jwedu6_99"
//             onClick={handlePrintClose}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#e74c3c',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontWeight: '500',
//               transition: 'background-color 0.3s',
//             }}
//           >
//             Close
//           </button>
//         </div>

//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             minHeight: '100vh',
//             backgroundColor: 'white',
//             boxShadow: '0 0 20px rgba(0,0,0,0.1)',
//             borderRadius: '8px',
//             padding: '20px',
//           }}
//         >
//           <table
//             style={{
//               width: '100%',
//               borderCollapse: 'collapse',
//               border: '1px solid #dee2e6',
//               marginBottom: '20px',
//             }}
//           >
//             <thead>
//               <tr>
//                 <td
//                   colSpan="11"
//                   style={{
//                     border: 'none',
//                     textAlign: 'center',
//                     padding: '15px 0',
//                     backgroundColor: '#f8f9fa',
//                   }}
//                 >
//                   <div>
//                     <h2
//                       style={{
//                         margin: '0',
//                         fontSize: '24px',
//                         fontWeight: 'bold',
//                         color: '#2c3e50',
//                         letterSpacing: '0.5px',
//                       }}
//                     >
//                       KARUNA MEDICAL COLLEGE HOSPITAL
//                     </h2>
//                     <h1
//                       style={{
//                         margin: '5px 0 0',
//                         fontSize: '18px',
//                         fontWeight: '500',
//                         color: '#7f8c8d',
//                         letterSpacing: '0.3px',
//                       }}
//                     >
//                       Vilayodi, Chittur, Palakkad
//                     </h1>
//                     <p
//                       style={{
//                         margin: '10px 0 0',
//                         fontSize: '14px',
//                         color: '#34495e',
//                         fontWeight: '500',
//                       }}
//                     >
//                       {searchOptions.DateType === 'Current'
//                         ? `Report Date: ${searchOptions.CurrentDate}`
//                         : `Report From: ${searchOptions.FromDate} To: ${searchOptions.ToDate}`}
//                     </p>
//                     <h3
//                       style={{
//                         margin: '10px 0 0',
//                         fontSize: '16px',
//                         color: '#2c3e50',
//                         fontWeight: '600',
//                       }}
//                     >
//                       DEPARTMENT WISE CODING REPORT
//                     </h3>
//                   </div>
//                 </td>
//               </tr>
//             </thead>
//           </table>

//           {departments.length === 0 ? (
//             <div style={{ textAlign: 'center', padding: '40px', border: '1px solid #dee2e6' }}>
//               No Records Found
//             </div>
//           ) : (
//             departments.map((dept, deptIndex) => (
//               <div key={deptIndex} style={{ marginBottom: '30px' }}>
//                 {/* Department Header */}
//                 <div style={{
//                   backgroundColor: '#3498db',
//                   color: 'white',
//                   padding: '10px 15px',
//                   borderRadius: '4px 4px 0 0',
//                   marginBottom: '0',
//                 }}>
//                   <h4 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>
//                     {dept.department} - Total Patients: {dept.totalPatients}
//                   </h4>
//                 </div>

//                 {/* Patients Table */}
//                 <table
//                   style={{
//                     width: '100%',
//                     borderCollapse: 'collapse',
//                     border: '1px solid #dee2e6',
//                     marginBottom: '20px',
//                   }}
//                 >
//                   <thead>
//                     <tr
//                       style={{
//                         fontWeight: 'bold',
//                         fontSize: '12px',
//                         backgroundColor: '#ecf0f1',
//                         color: '#2c3e50',
//                       }}
//                     >
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         S.No
//                       </th>
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         Patient Id
//                       </th>
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         Patient Name
//                       </th>
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         Diagnosis Code
//                       </th>
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         Diagnosis Description
//                       </th>
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         Revenue
//                       </th>
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         Age
//                       </th>
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         Gender
//                       </th>
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         Discharge Date
//                       </th>
//                       <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                         Admission Date
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {dept.patients.map((patient, patientIndex) => (
//                       <tr
//                         key={patientIndex}
//                         style={{
//                           fontSize: '11px',
//                           backgroundColor: patientIndex % 2 === 0 ? '#f8f9fa' : 'white',
//                         }}
//                       >
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patientIndex + 1}
//                         </td>
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patient.Patient_Id}
//                         </td>
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patient.Patient_Name}
//                         </td>
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patient.ICDCode}
//                         </td>
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patient.Code_Description}
//                         </td>
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patient.Diagnosis}
//                         </td>
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patient.age}
//                         </td>
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patient.gender}
//                         </td>
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patient["discharge date"]}
//                         </td>
//                         <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                           {patient["Admission date"]}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ))
//           )}

//           <div
//             style={{
//               marginTop: '20px',
//               padding: '15px',
//               backgroundColor: '#f8f9fa',
//               borderLeft: '4px solid #3498db',
//               borderRadius: '4px',
//             }}
//           >
//             <p
//               style={{
//                 margin: '0',
//                 fontSize: '12px',
//                 color: '#7f8c8d',
//                 lineHeight: '1.5',
//               }}
//             >
//               <strong>Note:</strong> This report shows department-wise medical coding details grouped by speciality with patient information.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Diagnose Wise Print Component (existing one)
//   const DiagnoseWisePrint = () => {
//     return (
//       <div
//         ref={componentRef}
//         style={{
//           fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//           padding: '20px',
//           maxWidth: '1200px',
//           margin: '0 auto',
//         }}
//       >
//         <div
//           className="Register_btn_con added_Register_btn_con"
//           style={{
//             marginBottom: '20px',
//             display: 'flex',
//             gap: '10px',
//             justifyContent: 'flex-end',
//           }}
//         >
//           <button
//             className="RegisterForm_1_btns jwedu6_99"
//             onClick={handlePrint}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#3498db',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontWeight: '500',
//               transition: 'background-color 0.3s',
//             }}
//           >
//             Print Report
//           </button>

//           <button
//             className="RegisterForm_1_btns jwedu6_99"
//             onClick={handlePrintClose}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#e74c3c',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontWeight: '500',
//               transition: 'background-color 0.3s',
//             }}
//           >
//             Close
//           </button>
//         </div>

//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             minHeight: '100vh',
//             backgroundColor: 'white',
//             boxShadow: '0 0 20px rgba(0,0,0,0.1)',
//             borderRadius: '8px',
//             padding: '20px',
//           }}
//         >
//           <table
//             style={{
//               width: '100%',
//               borderCollapse: 'collapse',
//               border: '1px solid #dee2e6',
//               marginBottom: '20px',
//             }}
//           >
//             <thead>
//               <tr>
//                 <td
//                   colSpan="11"
//                   style={{
//                     border: 'none',
//                     textAlign: 'center',
//                     padding: '15px 0',
//                     backgroundColor: '#f8f9fa',
//                   }}
//                 >
//                   <div>
//                     <h2
//                       style={{
//                         margin: '0',
//                         fontSize: '24px',
//                         fontWeight: 'bold',
//                         color: '#2c3e50',
//                         letterSpacing: '0.5px',
//                       }}
//                     >
//                       KARUNA MEDICAL COLLEGE HOSPITAL
//                     </h2>
//                     <h1
//                       style={{
//                         margin: '5px 0 0',
//                         fontSize: '18px',
//                         fontWeight: '500',
//                         color: '#7f8c8d',
//                         letterSpacing: '0.3px',
//                       }}
//                     >
//                       Vilayodi, Chittur, Palakkad
//                     </h1>
//                     <p
//                       style={{
//                         margin: '10px 0 0',
//                         fontSize: '14px',
//                         color: '#34495e',
//                         fontWeight: '500',
//                       }}
//                     >
//                       {searchOptions.DateType === 'Current'
//                         ? `Report Date: ${searchOptions.CurrentDate}`
//                         : `Report From: ${searchOptions.FromDate} To: ${searchOptions.ToDate}`}
//                     </p>
//                     <h3
//                       style={{
//                         margin: '10px 0 0',
//                         fontSize: '16px',
//                         color: '#2c3e50',
//                         fontWeight: '600',
//                       }}
//                     >
//                       DIAGNOSE WISE CODING REPORT
//                     </h3>
//                   </div>
//                 </td>
//               </tr>

//               <tr
//                 style={{
//                   fontWeight: 'bold',
//                   fontSize: '12px',
//                   backgroundColor: '#3498db',
//                   color: 'white',
//                 }}
//               >
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   S.No
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Patient Id
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Patient Name
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Diagnosis Code
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Diagnosis Description
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Revenue
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Age
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Gender
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Speciality
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Discharge Date
//                 </th>
//                 <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
//                   Admission Date
//                 </th>
                
//               </tr>
//             </thead>

//             <tbody>
//               {ReportData.length === 0 ? (
//                 <tr>
//                   <td colSpan="11" style={{ textAlign: 'center', padding: '20px', border: '1px solid #dee2e6' }}>
//                     No Records Found
//                   </td>
//                 </tr>
//               ) : (
//                 ReportData.map((item, index) => (
//                   <tr
//                     key={index}
//                     style={{
//                       fontSize: '11px',
//                       backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
//                     }}
//                   >
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {index + 1}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item.Patient_Id}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item.Patient_Name}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item.ICDCode}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item.Code_Description}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item.Diagnosis}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item.age}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item.gender}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item.speciality}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item["discharge date"]}
//                     </td>
//                     <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
//                       {item["Admission date"]}
//                     </td>
                    
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           <div
//             style={{
//               marginTop: '20px',
//               padding: '15px',
//               backgroundColor: '#f8f9fa',
//               borderLeft: '4px solid #3498db',
//               borderRadius: '4px',
//             }}
//           >
//             <p
//               style={{
//                 margin: '0',
//                 fontSize: '12px',
//                 color: '#7f8c8d',
//                 lineHeight: '1.5',
//               }}
//             >
//               <strong>Note:</strong> This report includes medical coding details with diagnosis codes, patient information, and status.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Medical Coding Report</h3>

//         {/* View Type */}
//         <div className="RegisterTypecon">
//           <div className="RegisterType">
//             {["DiagnoseWise", "DepartmentWise"].map((p, ind) => (
//               <div className="registertypeval" key={ind + "key"}>
//                 <input type="radio" id={p} checked={viewType === p} onChange={() => setViewType(p)} />
//                 <label htmlFor={p}>{p}</label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="search_div_bar" style={{ width: "100%" }}>
//           <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
            
//             {/* Date Type */}
//             <div className="RegisForm_1">
//               <label>Date Type<span>:</span></label>
//               <select name="DateType" value={searchOptions.DateType} onChange={HandleOnchangeSearch}>
//                 <option value="Current">Current Date</option>
//                 <option value="Customize">Customize</option>
//               </select>
//             </div>

//             {searchOptions.DateType === "Current" && (
//               <div className="RegisForm_1">
//                 <label>Current Date<span>:</span></label>
//                 <input type="date" readOnly value={searchOptions.CurrentDate} />
//               </div>
//             )}

//             {searchOptions.DateType === "Customize" && (
//               <>
//                 <div className="RegisForm_1">
//                   <label>From Date<span>:</span></label>
//                   <input type="date" name="FromDate" value={searchOptions.FromDate} onChange={HandleOnchangeSearch} />
//                 </div>

//                 <div className="RegisForm_1">
//                   <label>To Date<span>:</span></label>
//                   <input type="date" name="ToDate" value={searchOptions.ToDate} onChange={HandleOnchangeSearch} />
//                 </div>
//               </>
//             )}

//             {/* Print Button */}
//             <div className="RegisForm_1" style={{ justifyContent: "space-evenly" }}>
//               <label>Print<span>:</span></label>
//               <button style={{ width: "60px", height: "60px" }} onClick={openModal}>
//                 <PrintIcon style={{ fontSize: "32px" }} />
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* Print Modal */}
//       {OpenModal && (
//         <div className="loader" onClick={closeModal}>
//           <div className="cardModel" onClick={(e) => e.stopPropagation()}>
//             {viewType === "DiagnoseWise" ? (
//               <DiagnoseWisePrint />
//             ) : (
//               <DepartmentWisePrint />
//             )}
//           </div>
//         </div>
//       )}

//     </>
//   );
// };
 

// export default MedicalCodingReport;


import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from "react-to-print";

const MedicalCodingReport = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();

  const API_URL = "http://127.0.0.1:8000/MRD/MedicalCodingReport";

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  const [viewType, setViewType] = useState("DiagnoseWise");

  // API Data state
  const [ReportData, setReportData] = useState([]);
  const [DepartmentWiseData, setDepartmentWiseData] = useState({});
  
  // Department/Speciality data
  const [SpecialityData, setSpecialityData] = useState([]);
  const [SelectedSpecialities, setSelectedSpecialities] = useState([]);
  const [printBySpeciality, setPrintBySpeciality] = useState(false);

  // Search state for print modal

  // Modal state
  const [OpenModal, setOpenModal] = useState(false);
  
  // Search options
  const [searchOptions, setSearchOptions] = useState({
    DateType: 'Current',
    CurrentDate: formatDate(new Date()),
    FromDate: '',
    ToDate: '',
    userid: "",
  });

  // =================== DEPARTMENT/Speciality Functions ===================
  // Fetch Speciality Data on component mount
  useEffect(() => {
    axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => {
        const ress = res.data;
        setSpecialityData(Array.isArray(ress) ? ress : []);
      })
      .catch((err) => {
        console.log(err);
        setSpecialityData([]);
      });
  }, [UrlLink]);

  // Update printBySpeciality when SelectedSpecialities changes
  useEffect(() => {
    setPrintBySpeciality(SelectedSpecialities.length > 0);
  }, [SelectedSpecialities]);

  // Handle individual speciality checkbox change
  const handleCheckboxChangeSpeciality = (event, speciality) => {
    const { checked } = event.target;

    setSelectedSpecialities((prev) => {
      if (checked) {
        if (!prev.some(p => p.Speciality_Id === speciality.Speciality_Id)) {
          return [...prev, speciality];
        }
        return prev;
      } else {
        return prev.filter(p => p.Speciality_Id !== speciality.Speciality_Id);
      }
    });
  };

  // Handle "Select All" for specialities
  const handleSelectAllSpecialities = (event) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedSpecialities(
        Array.isArray(SpecialityData) ? SpecialityData.slice() : []
      );
    } else {
      setSelectedSpecialities([]);
    }
  };

  // Check if a speciality is selected
  const isSpecialityChecked = (speciality) => {
    return SelectedSpecialities.some(
      (item) => `${item.SpecialityName} | ${item.Speciality_Id}` === `${speciality.SpecialityName} | ${speciality.Speciality_Id}`
    );
  };

  // Filter report data by selected specialities
  const filterDataBySpecialities = (data) => {
    if (SelectedSpecialities.length === 0) {
      return data;
    }
    
    const selectedSpecialityIds = SelectedSpecialities.map(s => s.Speciality_Id.toString());
    const selectedSpecialityNames = SelectedSpecialities.map(s => s.SpecialityName.toLowerCase());
    
    return data.filter(item => {
      // Check if speciality matches by ID or name
      const itemSpeciality = item.speciality || "";
      return (
        selectedSpecialityIds.some(id => itemSpeciality.includes(id)) ||
        selectedSpecialityNames.some(name => itemSpeciality.toLowerCase().includes(name))
      );
    });
  };

  // Filter data by search term
  
  // =================== END DEPARTMENT Functions ===================

  // FIX: Update searchOptions.userid AFTER UserData loads
  useEffect(() => {
    if (UserData?.username) {
      setSearchOptions(prev => ({
        ...prev,
        userid: UserData.username,
      }));
    }
  }, [UserData]);

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;

    if (name === 'DateType') {
      if (value === 'Current') {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: TodayDate,
          FromDate: '',
          ToDate: '',
        }));
      } else if (value === 'Customize') {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: '',
        }));
      }
    } else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Process data for DepartmentWise view
  const processDepartmentWiseData = (data) => {
    const departmentMap = {};
    
    data.forEach((item) => {
      const department = item.speciality || "Unknown Department";
      
      if (!departmentMap[department]) {
        departmentMap[department] = {
          department: department,
          totalPatients: 0,
          patients: []
        };
      }
      
      departmentMap[department].totalPatients += 1;
      departmentMap[department].patients.push(item);
    });
    
    return departmentMap;
  };

  // Fetch API using Axios
  const fetchReport = async () => {
    try {
      const params = {
        DateType: searchOptions.DateType,
        CurrentDate: searchOptions.CurrentDate,
        FromDate: searchOptions.FromDate,
        ToDate: searchOptions.ToDate,
        userid: searchOptions.userid
      };

      console.log("📡 API Params Sent:", params);

      const response = await axios.get(`${UrlLink}MRD/MedicalCodingReport`, { params });

      console.log("📥 API Response:", response.data);

      if (response.data?.Status === "Success") {
        const data = response.data?.data || [];
        // Apply speciality filter if any selected
        const filteredData = filterDataBySpecialities(data);
        setReportData(filteredData);
        
        // Process data for DepartmentWise view
        if (viewType === "DepartmentWise") {
          const processedData = processDepartmentWiseData(filteredData);
          setDepartmentWiseData(processedData);
        } else {
          setDepartmentWiseData({});
        }
      } else {
        setReportData([]);
        setDepartmentWiseData({});
      }

    } catch (error) {
      console.error("API ERROR:", error);
      setReportData([]);
      setDepartmentWiseData({});
    }
  };

  // Open modal and fetch report
  const openModal = () => {
    if (!UserData?.username) {
      console.log("❌ User not loaded yet!");
      return;
    }
    fetchReport();     // FIX: Now UserData exists before calling
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  // Re-fetch when viewType or specialities change
  useEffect(() => {
    if (ReportData.length > 0) {
      const filteredData = filterDataBySpecialities(ReportData);
      if (viewType === "DepartmentWise") {
        const processedData = processDepartmentWiseData(filteredData);
        setDepartmentWiseData(processedData);
      }
      setReportData(filteredData);
    }
  }, [viewType, SelectedSpecialities]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrintClose = () => {
    setOpenModal(false);
  };

  const DepartmentWisePrint = () => {

    const [searchTerm, setSearchTerm] = useState("");

    const filterDataBySearch = (data) => {
    if (!searchTerm.trim()) {
      return data;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter(item => {
      return (
        (item.Patient_Id && item.Patient_Id.toString().toLowerCase().includes(searchLower)) ||
        (item.Patient_Name && item.Patient_Name.toLowerCase().includes(searchLower)) ||
        (item.ICDCode && item.ICDCode.toLowerCase().includes(searchLower)) ||
        (item.Code_Description && item.Code_Description.toLowerCase().includes(searchLower)) ||
        (item.speciality && item.speciality.toLowerCase().includes(searchLower)) ||
        (item.gender && item.gender.toLowerCase().includes(searchLower)) ||
        (item.age && item.age.toString().includes(searchLower)) ||
        (item.Diagnosis && item.Diagnosis.toString().toLowerCase().includes(searchLower)) ||
        (item["discharge date"] && item["discharge date"].toLowerCase().includes(searchLower)) ||
        (item["Admission date"] && item["Admission date"].toLowerCase().includes(searchLower))
      );
    });
    };

    const filteredData = filterDataBySearch(ReportData);

    // Filter data by search term
    const filteredDepartmentWiseData = Object.values(DepartmentWiseData).map(dept => ({
      ...dept,
      patients: filterDataBySearch(dept.patients)
    })).filter(dept => dept.patients.length > 0);
    
    const departments = filteredDepartmentWiseData;
    const totalFilteredPatients = departments.reduce((sum, dept) => sum + dept.patients.length, 0);
    const totalAllPatients = Object.values(DepartmentWiseData).reduce((sum, dept) => sum + dept.patients.length, 0);
    
    return (
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <style>
          {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
        `}
        </style>

        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by Patient ID, Name, Diagnosis Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="results-info">
            Showing {totalFilteredPatients} of {totalAllPatients} records
            {searchTerm && (
              <span> for "<strong>{searchTerm}</strong>"</span>
            )}
          </div>

          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          )}
        </div>

        <div
          className="Register_btn_con added_Register_btn_con"
          style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrint}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.3s',
            }}
          >
            Print Report
          </button>

          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrintClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.3s',
            }}
          >
            Close
          </button>
        </div>

        <div className="print-container report-container" ref={componentRef}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #dee2e6',
              marginBottom: '20px',
            }}
          >
            <thead>
              <tr>
                <td
                  colSpan="11"
                  style={{
                    border: 'none',
                    textAlign: 'center',
                    padding: '15px 0',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: '0',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        letterSpacing: '0.5px',
                      }}
                    >
                      KARUNA MEDICAL COLLEGE HOSPITAL
                    </h2>
                    <h1
                      style={{
                        margin: '5px 0 0',
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#7f8c8d',
                        letterSpacing: '0.3px',
                      }}
                    >
                      Vilayodi, Chittur, Palakkad
                    </h1>
                    <p
                      style={{
                        margin: '10px 0 0',
                        fontSize: '14px',
                        color: '#34495e',
                        fontWeight: '500',
                      }}
                    >
                      {searchOptions.DateType === 'Current'
                        ? `Report Date: ${searchOptions.CurrentDate}`
                        : `Report From: ${searchOptions.FromDate} To: ${searchOptions.ToDate}`}
                    </p>
                    {SelectedSpecialities.length > 0 && (
                      <p style={{
                        margin: '5px 0 0',
                        fontSize: '12px',
                        color: '#3498db',
                        fontWeight: '500',
                      }}>
                        Filtered by: {SelectedSpecialities.map(s => s.SpecialityName).join(', ')}
                      </p>
                    )}
                    {searchTerm && (
                      <p style={{
                        margin: '5px 0 0',
                        fontSize: '12px',
                        color: '#ef4444',
                        fontStyle: 'italic',
                      }}>
                        Filtered results for: "{searchTerm}"
                      </p>
                    )}
                    <h3
                      style={{
                        margin: '10px 0 0',
                        fontSize: '16px',
                        color: '#2c3e50',
                        fontWeight: '600',
                      }}
                    >
                      DEPARTMENT WISE CODING REPORT
                    </h3>
                  </div>
                </td>
              </tr>
            </thead>
          </table>

          {departments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', border: '1px solid #dee2e6' }}>
              {searchTerm ? `No records found for "${searchTerm}"` : 'No Records Found'}
            </div>
          ) : (
            departments.map((dept, deptIndex) => (
              <div key={deptIndex} style={{ marginBottom: '30px' }}>
                {/* Department Header */}
                <div style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '4px 4px 0 0',
                  marginBottom: '0',
                }}>
                  <h4 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>
                    {dept.department} - Total Patients: {dept.totalPatients} (Showing: {dept.patients.length})
                  </h4>
                </div>

                {/* Patients Table */}
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #dee2e6',
                    marginBottom: '20px',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        fontWeight: 'bold',
                        fontSize: '12px',
                        backgroundColor: '#ecf0f1',
                        color: '#2c3e50',
                      }}
                    >
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        S.No
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        Patient Id
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        Patient Name
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        Diagnosis Code
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        Diagnosis Description
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        Revenue
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        Age
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        Gender
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        Discharge Date
                      </th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                        Admission Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {dept.patients.map((patient, patientIndex) => (
                      <tr
                        key={patientIndex}
                        style={{
                          fontSize: '11px',
                          backgroundColor: patientIndex % 2 === 0 ? '#f8f9fa' : 'white',
                        }}
                      >
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patientIndex + 1}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patient.Patient_Id}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patient.Patient_Name}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patient.ICDCode}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patient.Code_Description}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patient.Diagnosis}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patient.age}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patient.gender}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patient["discharge date"]}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                          {patient["Admission date"]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}

          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #3498db',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> This report shows department-wise medical coding details grouped by speciality with patient information.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const DiagnoseWisePrint = () => {
     
        const [searchTerm, setSearchTerm] = useState("");


    const filterDataBySearch = (data) => {
    if (!searchTerm.trim()) {
      return data;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter(item => {
      return (
        (item.Patient_Id && item.Patient_Id.toString().toLowerCase().includes(searchLower)) ||
        (item.Patient_Name && item.Patient_Name.toLowerCase().includes(searchLower)) ||
        (item.ICDCode && item.ICDCode.toLowerCase().includes(searchLower)) ||
        (item.Code_Description && item.Code_Description.toLowerCase().includes(searchLower)) ||
        (item.speciality && item.speciality.toLowerCase().includes(searchLower)) ||
        (item.gender && item.gender.toLowerCase().includes(searchLower)) ||
        (item.age && item.age.toString().includes(searchLower)) ||
        (item.Diagnosis && item.Diagnosis.toString().toLowerCase().includes(searchLower)) ||
        (item["discharge date"] && item["discharge date"].toLowerCase().includes(searchLower)) ||
        (item["Admission date"] && item["Admission date"].toLowerCase().includes(searchLower))
      );
    });
    };

    const filteredData = filterDataBySearch(ReportData);


    
    return (
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <style>
          {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
        `}
        </style>

        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by Patient ID, Name, Diagnosis Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="results-info">
            Showing {filteredData.length} of {ReportData.length} records
            {searchTerm && (
              <span> for "<strong>{searchTerm}</strong>"</span>
            )}
          </div>

          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          )}
        </div>

        <div
          className="Register_btn_con added_Register_btn_con"
          style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrint}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.3s',
            }}
          >
            Print Report
          </button>

          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrintClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.3s',
            }}
          >
            Close
          </button>
        </div>

        <div className="print-container report-container" ref={componentRef}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #dee2e6',
              marginBottom: '20px',
            }}
          >
            <thead>
              <tr>
                <td
                  colSpan="11"
                  style={{
                    border: 'none',
                    textAlign: 'center',
                    padding: '15px 0',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: '0',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        letterSpacing: '0.5px',
                      }}
                    >
                      KARUNA MEDICAL COLLEGE HOSPITAL
                    </h2>
                    <h1
                      style={{
                        margin: '5px 0 0',
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#7f8c8d',
                        letterSpacing: '0.3px',
                      }}
                    >
                      Vilayodi, Chittur, Palakkad
                    </h1>
                    <p
                      style={{
                        margin: '10px 0 0',
                        fontSize: '14px',
                        color: '#34495e',
                        fontWeight: '500',
                      }}
                    >
                      {searchOptions.DateType === 'Current'
                        ? `Report Date: ${searchOptions.CurrentDate}`
                        : `Report From: ${searchOptions.FromDate} To: ${searchOptions.ToDate}`}
                    </p>
                    {SelectedSpecialities.length > 0 && (
                      <p style={{
                        margin: '5px 0 0',
                        fontSize: '12px',
                        color: '#3498db',
                        fontWeight: '500',
                      }}>
                        Filtered by: {SelectedSpecialities.map(s => s.SpecialityName).join(', ')}
                      </p>
                    )}
                    {searchTerm && (
                      <p style={{
                        margin: '5px 0 0',
                        fontSize: '12px',
                        color: '#ef4444',
                        fontStyle: 'italic',
                      }}>
                        Filtered results for: "{searchTerm}"
                      </p>
                    )}
                    <h3
                      style={{
                        margin: '10px 0 0',
                        fontSize: '16px',
                        color: '#2c3e50',
                        fontWeight: '600',
                      }}
                    >
                      DIAGNOSE WISE CODING REPORT
                    </h3>
                  </div>
                </td>
              </tr>

              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: '#3498db',
                  color: 'white',
                }}
              >
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  S.No
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Patient Id
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Patient Name
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Diagnosis Code
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Diagnosis Description
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Revenue
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Age
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Gender
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Speciality
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Discharge Date
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Admission Date
                </th>
                
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '20px', border: '1px solid #dee2e6' }}>
                    {searchTerm ? `No records found for "${searchTerm}"` : 'No Records Found'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      fontSize: '11px',
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    }}
                  >
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item.Patient_Id}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item.Patient_Name}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item.ICDCode}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item.Code_Description}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item.Diagnosis}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item.age}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item.gender}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item.speciality}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item["discharge date"]}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {item["Admission date"]}
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #3498db',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> This report includes medical coding details with diagnosis codes, patient information, and status.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Medical Coding Report</h3>

        {/* View Type */}
        <div className="RegisterTypecon">
          <div className="RegisterType">
            {["DiagnoseWise", "DepartmentWise"].map((p, ind) => (
              <div className="registertypeval" key={ind + "key"}>
                <input type="radio" id={p} checked={viewType === p} onChange={() => setViewType(p)} />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </div>
        </div>

        <br />

        {/* ---------- Search Options (Date) ---------- */}
        <div className="search_div_bar" style={{ width: "100%" }}>
          <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
            
            {/* Date Type */}
            <div className="RegisForm_1">
              <label>Date Type<span>:</span></label>
              <select name="DateType" value={searchOptions.DateType} onChange={HandleOnchangeSearch}>
                <option value="Current">Current Date</option>
                <option value="Customize">Customize</option>
              </select>
            </div>

            {searchOptions.DateType === "Current" && (
              <div className="RegisForm_1">
                <label>Current Date<span>:</span></label>
                <input type="date" readOnly value={searchOptions.CurrentDate} />
              </div>
            )}

            {searchOptions.DateType === "Customize" && (
              <>
                <div className="RegisForm_1">
                  <label>From Date<span>:</span></label>
                  <input type="date" name="FromDate" value={searchOptions.FromDate} onChange={HandleOnchangeSearch} />
                </div>

                <div className="RegisForm_1">
                  <label>To Date<span>:</span></label>
                  <input type="date" name="ToDate" value={searchOptions.ToDate} onChange={HandleOnchangeSearch} />
                </div>
              </>
            )}

            {/* Print Button */}
            <div className="RegisForm_1" style={{ justifyContent: "space-evenly" }}>
              <label>Print<span>:</span></label>
              <button style={{ width: "60px", height: "60px" }} onClick={openModal}>
                <PrintIcon style={{ fontSize: "32px" }} />
              </button>
            </div>

          </div>
        </div>

        {/* ---------- Department/Speciality Filter Section (Similar to MCIPatientReports) ---------- */}
        <div className="Main_container_app">
          <h3>Department</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "15px",
              padding: "0px 15px",
            }}
          >
            <div>
              <label style={{ gap: "15px", padding: "10px" }}>
                <input
                  type="checkbox"
                  id="select-all-specialities"
                  checked={
                    Array.isArray(SpecialityData) &&
                    SpecialityData.length > 0 &&
                    SelectedSpecialities.length === SpecialityData.length
                  }
                  onChange={handleSelectAllSpecialities}
                />
                Select All
              </label>
            </div>

            {Array.isArray(SpecialityData) && SpecialityData.length > 0 ? (
              SpecialityData.map((speciality, index) => (
                <div key={index}>
                  <label
                    htmlFor={`speciality-${index}`}
                    style={{ gap: "15px", padding: "10px" }}
                  >
                    <input
                      type="checkbox"
                      name="specialityArray"
                      id={`speciality-${index}`}
                      value={`${speciality.SpecialityName} | ${speciality.Speciality_Id}`}
                      checked={isSpecialityChecked(speciality)}
                      onChange={(e) => handleCheckboxChangeSpeciality(e, speciality)}
                    />
                    {speciality.SpecialityName}
                  </label>
                </div>
              ))
            ) : (
              <div className="Add_items_Purchase_Master">
                <span>No Department Found</span>
              </div>
            )}
          </div>
        </div>

        <br />
      </div>

      {/* Print Modal */}
      {OpenModal && (
        <div className="loader" onClick={closeModal}>
          <div className="cardModel" onClick={(e) => e.stopPropagation()}>
            {viewType === "DiagnoseWise" ? (
              <DiagnoseWisePrint />
            ) : (
              <DepartmentWisePrint />
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default MedicalCodingReport;


