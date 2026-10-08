

// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import PrintIcon from "@mui/icons-material/Print";
// import { useReactToPrint } from "react-to-print";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";

// const RadiologyReports = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const UserData = useSelector((state) => state.userRecord?.UserData);
//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();
//   const componentRef = useRef();

//   const formatDate = (date) => {
//     const d = new Date(date);
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const day = d.getDate().toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   // Fetch test-wise counts (summary)
//   const fetchTestwiseCounts = async () => {
//     try {
//       let deptNames = [];
//       if (selectedDepartments.length > 0) {
//         deptNames = RadiologyDept.filter((d) => selectedDepartments.includes(d.id.toString()))
//           .map((d) => d.RadiologyName);
//       }

//       const params = {
//         DateType: searchOptions.DateType,
//         CurrentDate: searchOptions.CurrentDate,
//         FromDate: searchOptions.FromDate,
//         ToDate: searchOptions.ToDate,
//       };
//       if (deptNames.length > 0) {
//         deptNames.forEach((name, idx) => {
//           params[`DepartmentName[${idx}]`] = name;
//         });
//       }

//       const res = await axios.get(`${UrlLink}MCI/Radiology_testwise_counts`, { params });
//       const rows = Array.isArray(res.data?.rows) ? res.data.rows : [];
//       setTestSummaryRows(rows);
//       setTestSummaryTotal(res.data?.total || 0);
//       setTestSummaryDept(deptNames.join(', '));
//     } catch (e) {
//       console.log(e);
//       setTestSummaryRows([]);
//       setTestSummaryTotal(0);
//       setTestSummaryDept("");
//     }
//   };

//   const [TodayDate, setTodayDate] = useState(formatDate(new Date()));

//   const [searchOptions, setSearchOptions] = useState({
//     DateType: "Current",
//     CurrentDate: formatDate(new Date()),
//     FromDate: "",
//     ToDate: "",
//     userid: UserData?.username,
//   });

//   const [OpenModal, setOpenModal] = useState(false);
//   const [AllRadiologyData, setAllRadiologyData] = useState([]);
//   const [Filterdata, setFilterdata] = useState([]);
//   const [RadiologyDept, setRadiologyDept] = useState([]);
//   const [countinfo, setcountinfo] = useState("");
//   const [selectedDepartments, setSelectedDepartments] = useState([]);
//   const [selectedStatuses, setSelectedStatuses] = useState([]);
//   const [selectedRegisterTypes, setSelectedRegisterTypes] = useState([]);
//   const [selectedDoctors, setSelectedDoctors] = useState([]);
//   const [DoctorsList, setDoctorsList] = useState([]);

  


  

//   const statusOptions = [
//     { value: "Request", label: "Request" },
//     { value: "Paid", label: "Paid" },
//     { value: "Due", label: "Due" },
//     { value: "Analyzed", label: "Analyzed" },
//     { value: "Completed", label: "Completed" },
//   ];

//   const registerTypeOptions = [
//     { value: "OP", label: "OP" },
//     { value: "IP", label: "IP" },
//     { value: "WALK-IN", label: "WALK-IN" },
//   ];

//   const openModal = () => setOpenModal(true);
//   const closeModal = () => setOpenModal(false);

//   const HandleOnchangeSearch = (e) => {
//     const { name, value } = e.target;

//     if (name === "DateType") {
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
//       } else if (value === "All") {
//         setSearchOptions((prev) => ({
//           ...prev,
//           DateType: value,
//           CurrentDate: "",
//           FromDate: "",
//           ToDate: "",
//         }));
//       }
//     } else {
//       setSearchOptions((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleDepartmentChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSelectedDepartments((prev) => [...prev, value]);
//     } else {
//       setSelectedDepartments((prev) => prev.filter((dept) => dept !== value));
//     }
//   };

//   const handleStatusChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSelectedStatuses((prev) => [...prev, value]);
//     } else {
//       setSelectedStatuses((prev) => prev.filter((status) => status !== value));
//     }
//   };

//   const handleRegisterTypeChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSelectedRegisterTypes((prev) => [...prev, value]);
//     } else {
//       setSelectedRegisterTypes((prev) => prev.filter((type) => type !== value));
//     }
//   };

//   const handleDoctorChange = (e) => {
//     const { value, checked } = e.target;
//     if (!value) return;

//     if (checked) {
//       setSelectedDoctors((prev) => [...prev, value]);
//     } else {
//       setSelectedDoctors((prev) => prev.filter((doctor) => doctor !== value));
//     }
//   };

//   const handleSelectAllDepartments = (e) => {
//     if (e.target.checked) {
//       setSelectedDepartments(RadiologyDept.map((dept) => dept.id.toString()));
//     } else {
//       setSelectedDepartments([]);
//     }
//   };

//   const handleSelectAllStatuses = (e) => {
//     if (e.target.checked) {
//       setSelectedStatuses(statusOptions.map((status) => status.value));
//     } else {
//       setSelectedStatuses([]);
//     }
//   };

//   const handleSelectAllRegisterTypes = (e) => {
//     if (e.target.checked) {
//       setSelectedRegisterTypes(registerTypeOptions.map((type) => type.value));
//     } else {
//       setSelectedRegisterTypes([]);
//     }
//   };

//   const handleSelectAllDoctors = (e) => {
//     if (e.target.checked) {
//       setSelectedDoctors(
//         DoctorsList.filter((doctor) => doctor.id).map((doctor) =>
//           doctor.id.toString()
//         )
//       );
//     } else {
//       setSelectedDoctors([]);
//     }
//   };

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     onAfterPrint: () => {
//       setOpenModal(false);
//     },
//   });

//   // Test-wise summary state
//   const [testSummaryRows, setTestSummaryRows] = useState([]);
//   const [testSummaryTotal, setTestSummaryTotal] = useState(0);
//   const [testSummaryDept, setTestSummaryDept] = useState("");

//   // Fetch Radiology Departments
//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Masters/Radiology_Names_link`)
//       .then((res) => {
//         const ress = res.data;
//         setRadiologyDept(ress);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink]);

//   // Fetch Doctors List
//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Masters/get_Doctor_Detials_link`, {})
//       .then((res) => {
//         const allDoctors = res.data;

//         const radiologyDoctors = allDoctors.filter((doctor) => {
//           const department = (doctor.Department || "").toUpperCase();
//           return department.includes("RADIOLOGY") && doctor.id;
//         });

//         setDoctorsList(radiologyDoctors);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink]);

//   // Fetch All Radiology Reports Data
//   const fetchAllRadiologyData = async () => {
//     try {
//       const params = {
//         DateType: searchOptions.DateType,
//         CurrentDate: searchOptions.CurrentDate,
//         FromDate: searchOptions.FromDate,
//         ToDate: searchOptions.ToDate,
//       };

//       const allDataPromises = [];

//       // If doctors are selected, fetch doctor-wise reports
//       if (selectedDoctors.length > 0) {
//         for (const doctorId of selectedDoctors) {
//           allDataPromises.push(
//             axios.get(`${UrlLink}Radiology/radiology_doctor_wise_report`, {
//               params: { doctor_id: doctorId },
//             })
//           );
//         }
//       } else {
//         // Original logic for status-based fetching
//         if (selectedStatuses.length === 0) {
//           for (const status of statusOptions) {
//             allDataPromises.push(
//               axios.get(`${UrlLink}MCI/Radiology_reports_for_original`, {
//                 params: { ...params, status: status.value },
//               })
//             );
//           }
//         } else {
//           for (const status of selectedStatuses) {
//             allDataPromises.push(
//               axios.get(`${UrlLink}MCI/Radiology_reports_for_original`, {
//                 params: { ...params, status: status },
//               })
//             );
//           }
//         }
//       }

//       const responses = await Promise.all(allDataPromises);

//       // Combine all data from different API calls
//       const combinedData = [];
//       responses.forEach((response) => {
//         if (response.data) {
//           if (Array.isArray(response.data.reports)) {
//             // Doctor-wise API response
//             const doctorReports = response.data.reports.map((report) => ({
//               PatientId: report.request_id || "",
//               PatientName: report.patientname || "",
//               RegisterType: report.register_type || "",
//               PhoneNumber: report.patient_phone || "",
//               doctor_name: report.doctor_name || "",
//               Deptname: report.department || "",
//               Testname: report.test_name || "",
//               Status: report.status || "",
//               ReportDate: report.report_date || "",
//             }));
//             combinedData.push(...doctorReports);
//           } else if (Array.isArray(response.data.RadiologyList)) {
//             // Original API response
//             combinedData.push(...response.data.RadiologyList);
//           }
//         }
//       });

//       // Remove duplicates
//       const uniqueData = combinedData.filter(
//         (item, index, self) =>
//           index ===
//           self.findIndex(
//             (t) =>
//               t.PatientId === item.PatientId &&
//               t.Deptname === item.Deptname &&
//               t.Testname === item.Testname
//           )
//       );

//       setAllRadiologyData(uniqueData);
//     } catch (error) {
//       console.error("Error fetching radiology data:", error);
//       setAllRadiologyData([]);
//     }
//   };

//   // Apply client-side filtering - FIXED VERSION
//   const applyClientSideFilters = () => {
//     let filteredData = [...AllRadiologyData];

//     // Filter by Register Types
//     if (selectedRegisterTypes.length > 0) {
//       filteredData = filteredData.filter((item) =>
//         selectedRegisterTypes.includes(item.RegisterType)
//       );
//     }

//     // Filter by departments
//     if (selectedDepartments.length > 0) {
//       const selectedDeptNames = RadiologyDept
//         .filter((dept) => selectedDepartments.includes(dept.id.toString()))
//         .map((dept) => dept.RadiologyName);

//       filteredData = filteredData.filter((item) =>
//         selectedDeptNames.includes(item.Deptname)
//       );
//     }

//     // Filter by Status (for doctor-wise reports when doctors are selected)
//     if (selectedStatuses.length > 0 && selectedDoctors.length > 0) {
//       filteredData = filteredData.filter((item) =>
//         selectedStatuses.includes(item.Status)
//       );
//     }

//     // Add serial numbers
//     filteredData = filteredData.map((item, index) => ({
//       ...item,
//       Sno: index + 1,
//     }));

//     setFilterdata(filteredData);
//     setcountinfo(filteredData.length);
//   };

//   // Fetch data when search options or selected filters change
//   useEffect(() => {
//     fetchAllRadiologyData();
//     fetchTestwiseCounts();
//   }, [UrlLink, searchOptions, selectedStatuses, selectedDoctors]);

//   // Apply filters when data or selected filters change  
//   useEffect(() => {
//     applyClientSideFilters();
//   }, [AllRadiologyData, selectedDepartments, selectedRegisterTypes, selectedStatuses]);

//   const getDateDisplay = () => {
//     if (searchOptions.DateType === "Current") {
//       return `Current Date: ${searchOptions.CurrentDate}`;
//     } else if (searchOptions.DateType === "Customize") {
//       return `From: ${searchOptions.FromDate} To: ${searchOptions.ToDate}`;
//     } else {
//       return "All Records";
//     }
//   };

//   const getSelectedDepartmentNames = () => {
//     return RadiologyDept
//       .filter((dept) => selectedDepartments.includes(dept.id.toString()))
//       .map((dept) => dept.RadiologyName);
//   };

//   const getSelectedDoctorNames = () => {
//     return DoctorsList
//       .filter((doctor) => doctor.id && selectedDoctors.includes(doctor.id.toString()))
//       .map((doctor) => {
//         const doctorName = doctor.Name && doctor.Name.trim()
//           ? doctor.Name.trim()
//           : (doctor.ShortName && doctor.ShortName !== "Dr. null" && doctor.ShortName.trim())
//             ? doctor.ShortName.trim()
//             : "Unknown Doctor";
//         return doctorName;
//       });
//   };

//   const clearAllFilters = () => {
//     setSelectedDepartments([]);
//     setSelectedStatuses([]);
//     setSelectedRegisterTypes([]);
//     setSelectedDoctors([]);
//   };

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Radiology Reports</h3>

//         <div className="search_div_bar" style={{ width: '100%' }}>
//           <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
//             <div className="RegisForm_1">
//               <label>Date Type<span>:</span></label>
//             <select
//                 name='DateType'
//               value={searchOptions.DateType}
//               onChange={HandleOnchangeSearch}
//             >
//                 <option value='Current'>Current Date</option>
//                 <option value='Customize'>Customize</option>
//                 <option value='All'>All</option>
//             </select>
//           </div>

//             {searchOptions.DateType === 'Current' && (
//               <div className="RegisForm_1">
//                 <label>Current Date<span>:</span></label>
//                 <input
//                   type='date'
//                   name='CurrentDate'
//                   value={searchOptions.CurrentDate}
//                   onChange={HandleOnchangeSearch}
//                   readOnly
//                 />
//               </div>
//             )}

//             {searchOptions.DateType === 'Customize' && (
//               <>
//                 <div className="RegisForm_1">
//                   <label>From Date<span>:</span></label>
//                 <input
//                     type='date'
//                     name='FromDate'
//                   value={searchOptions.FromDate}
//                   onChange={HandleOnchangeSearch}
//                 />
//               </div>
//                 <div className="RegisForm_1">
//                   <label>To Date<span>:</span></label>
//                 <input
//                     type='date'
//                     name='ToDate'
//                   value={searchOptions.ToDate}
//                   onChange={HandleOnchangeSearch}
//                     min={searchOptions.FromDate}
//                 />
//               </div>
//             </>
//           )}

//             <div className="RegisForm_1">
//           <button onClick={clearAllFilters} className="clear_filters_btn">
//             Clear All Filters
//           </button>
//             </div>
//           </div>
//         </div>

//         <div className="Main_container_app">
//           <h3>Department</h3>
//           <div style={{ display: 'flex', flexWrap: 'wrap', placeItems: 'center', gap: '15px', padding: '0px 15px' }}>
//             <div>
//               <label style={{ gap: '15px', padding: '10px' }}>
//               <input
//                 type="checkbox"
//                   checked={Array.isArray(RadiologyDept) && RadiologyDept.length > 0 && selectedDepartments.length === RadiologyDept.length}
//                 onChange={handleSelectAllDepartments}
//               />
//               Select All
//             </label>
//           </div>
//             {RadiologyDept.map((dept) => (
//               <div key={dept.id}>
//                 <label htmlFor={`dept-${dept.id}`} style={{ gap: '15px', padding: '10px' }}>
//                 <input
//                   type="checkbox"
//                     id={`dept-${dept.id}`}
//                   value={dept.id}
//                   checked={selectedDepartments.includes(dept.id.toString())}
//                   onChange={handleDepartmentChange}
//                 />
//                 {dept.RadiologyName}
//               </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="Main_container_app">
//           <h3>Status</h3>
//           <div style={{ display: 'flex', flexWrap: 'wrap', placeItems: 'center', gap: '15px', padding: '0px 15px' }}>
//             <div>
//               <label style={{ gap: '15px', padding: '10px' }}>
//               <input
//                 type="checkbox"
//                 checked={selectedStatuses.length === statusOptions.length}
//                 onChange={handleSelectAllStatuses}
//               />
//               Select All
//             </label>
//           </div>
//             {statusOptions.map((status) => (
//               <div key={status.value}>
//                 <label htmlFor={`status-${status.value}`} style={{ gap: '15px', padding: '10px' }}>
//                 <input
//                   type="checkbox"
//                     id={`status-${status.value}`}
//                   value={status.value}
//                   checked={selectedStatuses.includes(status.value)}
//                   onChange={handleStatusChange}
//                 />
//                 {status.label}
//               </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="Main_container_app">
//           <h3>Register Type</h3>
//           <div style={{ display: 'flex', flexWrap: 'wrap', placeItems: 'center', gap: '15px', padding: '0px 15px' }}>
//             <div>
//               <label style={{ gap: '15px', padding: '10px' }}>
//               <input
//                 type="checkbox"
//                   checked={selectedRegisterTypes.length === registerTypeOptions.length}
//                 onChange={handleSelectAllRegisterTypes}
//               />
//               Select All
//             </label>
//           </div>
//             {registerTypeOptions.map((type) => (
//               <div key={type.value}>
//                 <label htmlFor={`rtype-${type.value}`} style={{ gap: '15px', padding: '10px' }}>
//                 <input
//                   type="checkbox"
//                     id={`rtype-${type.value}`}
//                   value={type.value}
//                   checked={selectedRegisterTypes.includes(type.value)}
//                   onChange={handleRegisterTypeChange}
//                 />
//                 {type.label}
//               </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="Main_container_app">
//           <h3>Doctors</h3>
//           <div style={{ display: 'flex', flexWrap: 'wrap', placeItems: 'center', gap: '15px', padding: '0px 15px' }}>
//             <div>
//               <label style={{ gap: '15px', padding: '10px' }}>
//               <input
//                 type="checkbox"
//                   checked={selectedDoctors.length === DoctorsList.length && DoctorsList.length > 0}
//                 onChange={handleSelectAllDoctors}
//               />
//               Select All
//             </label>
//           </div>
//             {DoctorsList.map((doctor) => {
//               const doctorName = doctor.Name && doctor.Name.trim()
//                 ? doctor.Name.trim()
//                 : (doctor.ShortName && doctor.ShortName !== 'Dr. null' && doctor.ShortName.trim())
//                   ? doctor.ShortName.trim()
//                   : 'Unknown Doctor';

//               return (
//                 <div key={doctor.id || Math.random()}>
//                   <label htmlFor={`doc-${doctor.id || 'na'}`} style={{ gap: '15px', padding: '10px' }}>
//                   <input
//                     type="checkbox"
//                       id={`doc-${doctor.id || 'na'}`}
//                       value={doctor.id || ''}
//                       checked={doctor.id ? selectedDoctors.includes(doctor.id.toString()) : false}
//                     onChange={handleDoctorChange}
//                   />
//                   {doctorName}
//                 </label>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="Main_container_Btn">
//           <button onClick={openModal}>
//             <PrintIcon />
//             Print
//           </button>
//         </div>

//         {/* Test-wise Summary Table */}
//         <div style={{ marginTop: '20px' }}>
//           <h3>
//             {testSummaryDept ? `TOTAL CASE LIST - ${testSummaryDept}` : 'TOTAL CASE LIST'}
//           </h3>
//           <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
//                 <th style={{ border: '1px solid #ddd', padding: '8px', width: '60px' }}>SL</th>
//                 <th style={{ border: '1px solid #ddd', padding: '8px' }}>PART OF SCAN</th>
//                 <th style={{ border: '1px solid #ddd', padding: '8px', width: '120px', textAlign: 'right' }}>COUNT</th>
//               </tr>
//             </thead>
//             <tbody>
//               {testSummaryRows.map((row, idx) => (
//                 <tr key={row.test_code || idx}>
//                   <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.test_name}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{row.count}</td>
//                 </tr>
//               ))}
//               <tr style={{ fontWeight: 'bold' }}>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }} colSpan={2}>TOTAL TESTS</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{testSummaryTotal}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div className="data_summary">
//           <p>
//             Total Records: <strong>{countinfo}</strong>
//           </p>
//           <p>{getDateDisplay()}</p>
//           {selectedDepartments.length > 0 && (
//             <p>
//               Selected Departments:{" "}
//               <strong>{getSelectedDepartmentNames().join(", ")}</strong>
//             </p>
//           )}
//           {selectedStatuses.length > 0 && (
//             <p>
//               Selected Statuses: <strong>{selectedStatuses.join(", ")}</strong>
//             </p>
//           )}
//           {selectedRegisterTypes.length > 0 && (
//             <p>
//               Selected Register Types:{" "}
//               <strong>{selectedRegisterTypes.join(", ")}</strong>
//             </p>
//           )}
//           {selectedDoctors.length > 0 && (
//             <p>
//               Selected Doctors: <strong>{getSelectedDoctorNames().join(", ")}</strong>
//             </p>
//           )}
//         </div>

//         {/* {Filterdata.length > 0 && (
//           <ReactGrid
//             columns={PatientRadiologyColumns}
//             RowData={Filterdata}
//           />
//         )} */}
//       </div>

//       {/* Print Modal */}
//       {OpenModal && (
//         <div className="loader" onClick={closeModal}>
//           <div className="cardModel" onClick={(e) => e.stopPropagation()}>
//             <div ref={componentRef} style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
//               <div className="Register_btn_con added_Register_btn_con">
//                 <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint}>
//                   Print
//                 </button>
//                 <button className="RegisterForm_1_btns jwedu6_99" onClick={closeModal}>
//                   Close
//               </button>
//             </div>

//               <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                   <thead>
//                     <tr>
//                       <td colSpan="9" style={{ border: "none", textAlign: "center" }}>
//                         <div>
//                           <h2 style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>KARUNA MEDICAL COLLEGE HOSPITAL</h2>
//                           <h1 style={{ margin: "0", fontSize: "18px", fontWeight: 600, color: "black" }}>Vilayodi, Chittur , Palakkad</h1>
//                           <p style={{ margin: "5px 0", fontSize: "14px" }}>
//                             <strong>Report Generated On:</strong> {formatDate(new Date())}
//                             {" | "}
//                       <strong>Generated By:</strong> {UserData?.username}
//                             {" | "}
//                       <strong>{getDateDisplay()}</strong>
//                             {" | "}
//                       <strong>Total Records:</strong> {countinfo}
//                     </p>
//                   </div>
//                       </td>
//                     </tr>
//                     <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold", fontSize: "12px" }}>
//                       <th style={{ border: "1px solid #000", padding: "6px" }}>S.No</th>
//                       <th style={{ border: "1px solid #000", padding: "6px" }}>Request ID</th>
//                       <th style={{ border: "1px solid #000", padding: "6px" }}>Patient Name</th>
//                       <th style={{ border: "1px solid #000", padding: "6px" }}>Register Type</th>
//                       <th style={{ border: "1px solid #000", padding: "6px" }}>Phone No</th>
//                       <th style={{ border: "1px solid #000", padding: "6px" }}>Doctor Name</th>
//                       <th style={{ border: "1px solid #000", padding: "6px" }}>Department</th>
//                       <th style={{ border: "1px solid #000", padding: "6px" }}>Test Name</th>
//                       <th style={{ border: "1px solid #000", padding: "6px" }}>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Filterdata.map((row, index) => (
//                       <tr key={index} style={{ fontSize: "10px" }}>
//                         <td style={{ padding: "6px", textAlign: "center" }}>{row.Sno}</td>
//                         <td style={{ padding: "6px", textAlign: "center" }}>{row.PatientId}</td>
//                         <td style={{ padding: "6px" }}>{row.PatientName || '-'}</td>
//                         <td style={{ padding: "6px", textAlign: "center" }}>{row.RegisterType}</td>
//                         <td style={{ padding: "6px", textAlign: "center" }}>{row.PhoneNumber || '-'}</td>
//                         <td style={{ padding: "6px" }}>{row.doctor_name}</td>
//                         <td style={{ padding: "6px" }}>{row.Deptname}</td>
//                         <td style={{ padding: "6px" }}>{row.Testname}</td>
//                         <td style={{ padding: "6px", textAlign: "center" }}>{row.Status || '-'}</td>
//                       </tr>
//                     ))}
//                     <tr style={{ fontWeight: "bold", fontSize: "12px" }}>
//                       <td colSpan="8" style={{ borderTop: "1px solid #000", padding: "6px", textAlign: "right" }}>Total Records</td>
//                       <td style={{ borderTop: "1px solid #000", padding: "6px", textAlign: "center" }}>{countinfo}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .filter_actions {
//           margin: 10px 0;
//         }

//         .clear_filters_btn {
//           padding: 8px 16px;
//           background-color: #dc3545;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }

//         .clear_filters_btn:hover {
//           background-color: #c82333;
//         }

//         .filter_section {
//           margin: 20px 0;
//           padding: 15px;
//           border: 1px solid #ddd;
//           border-radius: 5px;
//           background-color: #f9f9f9;
//         }

//         .filter_header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//         }

//         .filter_header h4 {
//           margin: 0;
//           color: #333;
//         }

//         .select_all_label {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           font-weight: bold;
//           color: #2c5aa0;
//           cursor: pointer;
//         }

//         .checkbox_container {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 15px;
//         }

//         .checkbox_label {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           font-size: 14px;
//           cursor: pointer;
//         }

//         .checkbox_label input[type="checkbox"] {
//           margin-right: 5px;
//         }

//         .data_summary {
//           padding: 10px;
//           background-color: #e8f4f8;
//           border-radius: 5px;
//           margin: 10px 0;
//         }

//         .data_summary p {
//           margin: 5px 0;
//         }

//         .modal_overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }

//         .modal_content {
//           background: white;
//           border-radius: 8px;
//           width: 90%;
//           max-width: 1200px;
//           max-height: 90%;
//           overflow-y: auto;
//         }

//         .modal_header {
//           padding: 20px;
//           border-bottom: 1px solid #ddd;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .modal_close {
//           background: none;
//           border: none;
//           font-size: 24px;
//           cursor: pointer;
//         }

//         .modal_body {
//           padding: 20px;
//         }

//         .print_content {
//           font-family: Arial, sans-serif;
//         }

//         .print_header {
//           text-align: center;
//           margin-bottom: 20px;
//         }

//         .print_header h2 {
//           margin: 0 0 10px 0;
//           color: #2c5aa0;
//         }

//         .print_header h3 {
//           margin: 0 0 15px 0;
//           color: #333;
//         }

//         .print_info {
//           text-align: left;
//           margin: 15px 0;
//         }

//         .print_info p {
//           margin: 5px 0;
//         }

//         .print_table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 20px 0;
//         }

//         .print_table th,
//         .print_table td {
//           border: 1px solid #ddd;
//           padding: 8px;
//           text-align: left;
//         }

//         .print_table th {
//           background-color: #f2f2f2;
//           font-weight: bold;
//         }

//         .print_footer {
//           margin-top: 20px;
//           text-align: center;
//         }

//         .modal_footer {
//           padding: 20px;
//           border-top: 1px solid #ddd;
//           display: flex;
//           justify-content: flex-end;
//           gap: 10px;
//         }

//         .print_btn,
//         .cancel_btn {
//           padding: 10px 20px;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }

//         .print_btn {
//           background-color: #2c5aa0;
//           color: white;
//         }

//         .cancel_btn {
//           background-color: #6c757d;
//           color: white;
//         }

//         @media print {
//           .modal_header,
//           .modal_footer {
//             display: none;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default RadiologyReports;



import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import * as XLSX from "xlsx";

const RadiologyReports = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();
  const summaryRef = useRef(); // New ref for summary-only printing

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  const [searchOptions, setSearchOptions] = useState({
    DateType: "Current",
    CurrentDate: formatDate(new Date()),
    FromDate: "",
    ToDate: "",
    userid: UserData?.username,
  });
  const [OpenModal, setOpenModal] = useState(false);
  const [AllRadiologyData, setAllRadiologyData] = useState([]);
  const [Filterdata, setFilterdata] = useState([]);
  const [RadiologyDept, setRadiologyDept] = useState([]);
  const [countinfo, setcountinfo] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedRegisterTypes, setSelectedRegisterTypes] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [DoctorsList, setDoctorsList] = useState([]);
  const [printMode, setPrintMode] = useState("detailed"); // New state for print mode

  const statusOptions = [
    { value: "Request", label: "Request" },
    { value: "Paid", label: "Paid" },
    { value: "Due", label: "Due" },
    { value: "Analyzed", label: "Analyzed" },
    { value: "Completed", label: "Completed" },
  ];
  const registerTypeOptions = [
    { value: "OP", label: "OP" },
    { value: "IP", label: "IP" },
    { value: "WALK-IN", label: "WALK-IN" },
  ];

  const openModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === "DateType") {
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
      } else if (value === "All") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
          FromDate: "",
          ToDate: "",
        }));
      }
    } else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  //excel function
  const handleExportToExcel = () => {
    if (Filterdata.length === 0 && testSummaryRows.length === 0) {
      alert("No data to export");
      return;
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Detailed Report Sheet
    if (Filterdata.length > 0) {
      const detailedData = Filterdata.map((item) => ({
        "S.No": item.Sno,
        "Request ID": item.request_id,
        "Patient ID": item.PatientId,
        "Patient Name": item.PatientName || "-",
        "Register Type": item.RegisterType,
        "Phone No": item.PhoneNumber || "-",
        "Doctor Name": item.doctor_name,
        Department: item.Deptname,
        "Test Name": item.Testname,
        Status: item.Status || "-",
      }));

      const detailedWs = XLSX.utils.json_to_sheet(detailedData);
      XLSX.utils.book_append_sheet(wb, detailedWs, "Detailed Report");
    }

    // Summary Report Sheet
    if (testSummaryRows.length > 0) {
      const summaryData = testSummaryRows.map((item, index) => ({
        SL: index + 1,
        "PART OF SCAN": item.Testname,
        COUNT: item.Testcount,
      }));

      // Add total row
      XLSX.utils.sheet_add_aoa(
        summaryData,
        [["TOTAL TESTS", "", testSummaryTotal]],
        { origin: -1 }
      );

      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary Report");
    }

    // Generate filename with timestamp
    const fileName = `Radiology_Reports_${formatDate(new Date())}.xlsx`;

    // Download the file
    XLSX.writeFile(wb, fileName);
  };

  const handleDepartmentChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedDepartments((prev) => [...prev, value]);
    } else {
      setSelectedDepartments((prev) => prev.filter((dept) => dept !== value));
    }
  };
  const handleStatusChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedStatuses((prev) => [...prev, value]);
    } else {
      setSelectedStatuses((prev) => prev.filter((status) => status !== value));
    }
  };
  const handleRegisterTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRegisterTypes((prev) => [...prev, value]);
    } else {
      setSelectedRegisterTypes((prev) => prev.filter((type) => type !== value));
    }
  };
  const handleDoctorChange = (e) => {
    const { value, checked } = e.target;
    if (!value) return;
    if (checked) {
      setSelectedDoctors((prev) => [...prev, value]);
    } else {
      setSelectedDoctors((prev) => prev.filter((doctor) => doctor !== value));
    }
  };

  const handleSelectAllDepartments = (e) => {
    if (e.target.checked) {
      setSelectedDepartments(RadiologyDept.map((dept) => dept.id.toString()));
    } else {
      setSelectedDepartments([]);
    }
  };
  const handleSelectAllStatuses = (e) => {
    if (e.target.checked) {
      setSelectedStatuses(statusOptions.map((status) => status.value));
    } else {
      setSelectedStatuses([]);
    }
  };
  const handleSelectAllRegisterTypes = (e) => {
    if (e.target.checked) {
      setSelectedRegisterTypes(registerTypeOptions.map((type) => type.value));
    } else {
      setSelectedRegisterTypes([]);
    }
  };
  const handleSelectAllDoctors = (e) => {
    if (e.target.checked) {
      setSelectedDoctors(
        DoctorsList.filter((doctor) => doctor.id).map((doctor) =>
          doctor.id.toString()
        )
      );
    } else {
      setSelectedDoctors([]);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setOpenModal(false);
    },
  });

  const handleSummaryPrint = useReactToPrint({
    content: () => summaryRef.current,
    onAfterPrint: () => {
      setOpenModal(false);
    },
  });

  // Test-wise summary state
  const [testSummaryRows, setTestSummaryRows] = useState([]);
  const [testSummaryTotal, setTestSummaryTotal] = useState(0);
  const [testSummaryDept, setTestSummaryDept] = useState("");

  // Fetch Radiology Departments
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Radiology_Names_link`)
      .then((res) => {
        const ress = res.data;
        setRadiologyDept(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  // Fetch Doctors List
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_Doctor_Detials_link`, {})
      .then((res) => {
        const allDoctors = res.data;
        const radiologyDoctors = allDoctors.filter((doctor) => {
          const department = (doctor.Department || "").toUpperCase();
          return department.includes("RADIOLOGY") && doctor.id;
        });
        setDoctorsList(radiologyDoctors);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  // ------ ONLY ONE GET API FOR ALL FILTERS ------
  const fetchRadiologyReportsAPI = async (params, mode = "list") => {
    try {
      // Convert arrays to comma-separated strings for the API
      const apiParams = {
        ...params,
        mode,
        // Convert arrays to comma-separated strings
        Department: Array.isArray(params.Department)
          ? params.Department.join(",")
          : params.Department,
        status: Array.isArray(params.status)
          ? params.status.join(",")
          : params.status,
        RegisterType: Array.isArray(params.RegisterType)
          ? params.RegisterType.join(",")
          : params.RegisterType,
        doctor_id: Array.isArray(params.doctor_id)
          ? params.doctor_id.join(",")
          : params.doctor_id,
      };

      const response = await axios.get(`${UrlLink}MCI/get_radiology_reports`, {
        params: apiParams,
      });
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Patient & doctor mode
  const fetchAllRadiologyData = async () => {
    const params = {
      DateType: searchOptions.DateType,
      CurrentDate: searchOptions.CurrentDate,
      FromDate: searchOptions.FromDate,
      ToDate: searchOptions.ToDate,
    };

    // Send all selected values, not just the first one
    if (selectedDepartments.length) params.Department = selectedDepartments;
    if (selectedStatuses.length) params.status = selectedStatuses;
    if (selectedRegisterTypes.length)
      params.RegisterType = selectedRegisterTypes;
    if (selectedDoctors.length) params.doctor_id = selectedDoctors;

    // Use doctor mode if doctor selected
    const mode = selectedDoctors.length ? "doctor" : "list";
    const result = await fetchRadiologyReportsAPI(params, mode);

    if (mode === "doctor") {
      setAllRadiologyData(result?.reports || []);
      setcountinfo(result?.summary?.total_reports || 0);
    } else {
      setAllRadiologyData(result?.RadiologyList || []);
      setcountinfo(result?.Totalcount || 0);
    }
  };

  // Department mode for summary
  const fetchTestwiseCounts = async () => {
    if (!selectedDepartments.length) {
      setTestSummaryRows([]);
      setTestSummaryTotal(0);
      setTestSummaryDept("");
      return;
    }

    const params = {
      DateType: searchOptions.DateType,
      CurrentDate: searchOptions.CurrentDate,
      FromDate: searchOptions.FromDate,
      ToDate: searchOptions.ToDate,
      Department: selectedDepartments, // Send all selected departments
    };

    const result = await fetchRadiologyReportsAPI(params, "deptwise");
    setTestSummaryRows(result?.Countdetails || []);
    setTestSummaryTotal((result?.TotalOP || 0) + (result?.TotalIP || 0));
    setTestSummaryDept(selectedDepartments.join(", "));
  };

  useEffect(() => {
    fetchAllRadiologyData();
    fetchTestwiseCounts();
  }, [
    UrlLink,
    searchOptions,
    selectedDepartments,
    selectedStatuses,
    selectedRegisterTypes,
    selectedDoctors,
  ]);

  // Client-side filtering if needed (optional, most filter is now server-side)
  useEffect(() => {
    let filteredData = [...AllRadiologyData];

    // Apply client-side filtering only if needed
    // Most filtering should be done server-side now

    // Serial numbers
    filteredData = filteredData.map((item, index) => ({
      ...item,
      Sno: index + 1,
    }));

    setFilterdata(filteredData);
    setcountinfo(filteredData.length);
  }, [AllRadiologyData]);

  // Display helpers
  const getDateDisplay = () => {
    if (searchOptions.DateType === "Current") {
      return `Current Date: ${searchOptions.CurrentDate}`;
    } else if (searchOptions.DateType === "Customize") {
      return `From: ${searchOptions.FromDate} To: ${searchOptions.ToDate}`;
    } else {
      return "All Records";
    }
  };

  const getSelectedDepartmentNames = () => {
    return RadiologyDept.filter((dept) =>
      selectedDepartments.includes(dept.id.toString())
    ).map((dept) => dept.RadiologyName);
  };

  const getSelectedDoctorNames = () => {
    return DoctorsList.filter(
      (doctor) => doctor.id && selectedDoctors.includes(doctor.id.toString())
    ).map((doctor) => {
      const doctorName =
        doctor.Name && doctor.Name.trim()
          ? doctor.Name.trim()
          : doctor.ShortName &&
            doctor.ShortName !== "Dr. null" &&
            doctor.ShortName.trim()
          ? doctor.ShortName.trim()
          : "Unknown Doctor";
      return doctorName;
    });
  };

  const clearAllFilters = () => {
    setSelectedDepartments([]);
    setSelectedStatuses([]);
    setSelectedRegisterTypes([]);
    setSelectedDoctors([]);
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Radiology Reports</h3>

        <div className="search_div_bar" style={{ width: "100%" }}>
          <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
            <div className="RegisForm_1">
              <label>
                Date Type<span>:</span>
              </label>
              <select
                name="DateType"
                value={searchOptions.DateType}
                onChange={HandleOnchangeSearch}
              >
                <option value="Current">Current Date</option>
                <option value="Customize">Customize</option>
                <option value="All">All</option>
              </select>
            </div>

            {searchOptions.DateType === "Current" && (
              <div className="RegisForm_1">
                <label>
                  Current Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="CurrentDate"
                  value={searchOptions.CurrentDate}
                  onChange={HandleOnchangeSearch}
                  readOnly
                />
              </div>
            )}

            {searchOptions.DateType === "Customize" && (
              <>
                <div className="RegisForm_1">
                  <label>
                    From Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="FromDate"
                    value={searchOptions.FromDate}
                    onChange={HandleOnchangeSearch}
                  />
                </div>
                <div className="RegisForm_1">
                  <label>
                    To Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="ToDate"
                    value={searchOptions.ToDate}
                    onChange={HandleOnchangeSearch}
                    min={searchOptions.FromDate}
                  />
                </div>
              </>
            )}

            <div className="RegisForm_1">
              <button onClick={clearAllFilters} className="clear_filters_btn">
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        <div className="Main_container_app">
          <h3>Department</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              placeItems: "center",
              gap: "15px",
              padding: "0px 15px",
            }}
          >
            <div>
              <label style={{ gap: "15px", padding: "10px" }}>
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(RadiologyDept) &&
                    RadiologyDept.length > 0 &&
                    selectedDepartments.length === RadiologyDept.length
                  }
                  onChange={handleSelectAllDepartments}
                />
                Select All
              </label>
            </div>
            {RadiologyDept.map((dept) => (
              <div key={dept.id}>
                <label
                  htmlFor={`dept-${dept.id}`}
                  style={{ gap: "15px", padding: "10px" }}
                >
                  <input
                    type="checkbox"
                    id={`dept-${dept.id}`}
                    value={dept.id}
                    checked={selectedDepartments.includes(dept.id.toString())}
                    onChange={handleDepartmentChange}
                  />
                  {dept.RadiologyName}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="Main_container_app">
          <h3>Status</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              placeItems: "center",
              gap: "15px",
              padding: "0px 15px",
            }}
          >
            <div>
              <label style={{ gap: "15px", padding: "10px" }}>
                <input
                  type="checkbox"
                  checked={selectedStatuses.length === statusOptions.length}
                  onChange={handleSelectAllStatuses}
                />
                Select All
              </label>
            </div>
            {statusOptions.map((status) => (
              <div key={status.value}>
                <label
                  htmlFor={`status-${status.value}`}
                  style={{ gap: "15px", padding: "10px" }}
                >
                  <input
                    type="checkbox"
                    id={`status-${status.value}`}
                    value={status.value}
                    checked={selectedStatuses.includes(status.value)}
                    onChange={handleStatusChange}
                  />
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="Main_container_app">
          <h3>Register Type</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              placeItems: "center",
              gap: "15px",
              padding: "0px 15px",
            }}
          >
            <div>
              <label style={{ gap: "15px", padding: "10px" }}>
                <input
                  type="checkbox"
                  checked={
                    selectedRegisterTypes.length === registerTypeOptions.length
                  }
                  onChange={handleSelectAllRegisterTypes}
                />
                Select All
              </label>
            </div>
            {registerTypeOptions.map((type) => (
              <div key={type.value}>
                <label
                  htmlFor={`rtype-${type.value}`}
                  style={{ gap: "15px", padding: "10px" }}
                >
                  <input
                    type="checkbox"
                    id={`rtype-${type.value}`}
                    value={type.value}
                    checked={selectedRegisterTypes.includes(type.value)}
                    onChange={handleRegisterTypeChange}
                  />
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="Main_container_app">
          <h3>Doctors</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              placeItems: "center",
              gap: "15px",
              padding: "0px 15px",
            }}
          >
            <div>
              <label style={{ gap: "15px", padding: "10px" }}>
                <input
                  type="checkbox"
                  checked={
                    selectedDoctors.length === DoctorsList.length &&
                    DoctorsList.length > 0
                  }
                  onChange={handleSelectAllDoctors}
                />
                Select All
              </label>
            </div>
            {DoctorsList.map((doctor) => {
              const doctorName =
                doctor.Name && doctor.Name.trim()
                  ? doctor.Name.trim()
                  : doctor.ShortName &&
                    doctor.ShortName !== "Dr. null" &&
                    doctor.ShortName.trim()
                  ? doctor.ShortName.trim()
                  : "Unknown Doctor";

              return (
                <div key={doctor.id || Math.random()}>
                  <label
                    htmlFor={`doc-${doctor.id || "na"}`}
                    style={{ gap: "15px", padding: "10px" }}
                  >
                    <input
                      type="checkbox"
                      id={`doc-${doctor.id || "na"}`}
                      value={doctor.id || ""}
                      checked={
                        doctor.id
                          ? selectedDoctors.includes(doctor.id.toString())
                          : false
                      }
                      onChange={handleDoctorChange}
                    />
                    {doctorName}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Print Mode Selection */}
        <div className="Main_container_app">
          <h3>Print Mode</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              placeItems: "center",
              gap: "15px",
              padding: "0px 15px",
            }}
          >
            <div>
              <label style={{ gap: "15px", padding: "10px" }}>
                <input
                  type="radio"
                  name="printMode"
                  value="detailed"
                  checked={printMode === "detailed"}
                  onChange={() => setPrintMode("detailed")}
                />
                Detailed Report
              </label>
            </div>
            <div>
              <label style={{ gap: "15px", padding: "10px" }}>
                <input
                  type="radio"
                  name="printMode"
                  value="summary"
                  checked={printMode === "summary"}
                  onChange={() => setPrintMode("summary")}
                />
                Summary Only
              </label>
            </div>
          </div>
        </div>

        <div className="Main_container_Btn">
          <button onClick={openModal}>
            <PrintIcon />
            Print
          </button>
          <button onClick={handleExportToExcel} style={{ marginLeft: "10px" }}>
            Export to Excel
          </button>
        </div>

        {/* Test-wise Summary Table */}
        <div style={{ marginTop: "20px" }}>
          <h3>
            {testSummaryDept
              ? `TOTAL CASE LIST - ${testSummaryDept}`
              : "TOTAL CASE LIST"}
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    width: "60px",
                  }}
                >
                  SL
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  PART OF SCAN
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    width: "120px",
                    textAlign: "right",
                  }}
                >
                  COUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {testSummaryRows.map((row, idx) => (
                <tr key={row.test_code || idx}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {row.Testname}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "right",
                    }}
                  >
                    {row.Testcount}
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold" }}>
                <td
                  style={{ border: "1px solid #ddd", padding: "8px" }}
                  colSpan={2}
                >
                  TOTAL TESTS
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "right",
                  }}
                >
                  {testSummaryTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="data_summary">
          <p>
            Total Records: <strong>{countinfo}</strong>
          </p>
          <p>{getDateDisplay()}</p>
          {selectedDepartments.length > 0 && (
            <p>
              Selected Departments:{" "}
              <strong>{getSelectedDepartmentNames().join(", ")}</strong>
            </p>
          )}
          {selectedStatuses.length > 0 && (
            <p>
              Selected Statuses: <strong>{selectedStatuses.join(", ")}</strong>
            </p>
          )}
          {selectedRegisterTypes.length > 0 && (
            <p>
              Selected Register Types:{" "}
              <strong>{selectedRegisterTypes.join(", ")}</strong>
            </p>
          )}
          {selectedDoctors.length > 0 && (
            <p>
              Selected Doctors:{" "}
              <strong>{getSelectedDoctorNames().join(", ")}</strong>
            </p>
          )}
        </div>

        {/* {Filterdata.length > 0 && (
          <ReactGrid
            columns={PatientRadiologyColumns}
            RowData={Filterdata}
          />
        )} */}
      </div>

      {/* Print Modal */}
      {OpenModal && (
        <div className="loader" onClick={closeModal}>
          <div className="cardModel" onClick={(e) => e.stopPropagation()}>
            <div className="print_mode_selection">
              <label>
                <input
                  type="radio"
                  name="printMode"
                  value="detailed"
                  checked={printMode === "detailed"}
                  onChange={() => setPrintMode("detailed")}
                />
                Detailed Report
              </label>
              <label>
                <input
                  type="radio"
                  name="printMode"
                  value="summary"
                  checked={printMode === "summary"}
                  onChange={() => setPrintMode("summary")}
                />
                Summary Only
              </label>
            </div>

            <div className="Register_btn_con added_Register_btn_con">
              <button
                className="RegisterForm_1_btns jwedu6_99"
                onClick={
                  printMode === "detailed" ? handlePrint : handleSummaryPrint
                }
              >
                Print
              </button>
              <button
                className="RegisterForm_1_btns jwedu6_99"
                onClick={closeModal}
              >
                Close
              </button>
            </div>

            {/* Detailed Report (Patient Details) */}
            {printMode === "detailed" && (
              <div
                ref={componentRef}
                style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <td
                          colSpan="9"
                          style={{ border: "none", textAlign: "center" }}
                        >
                          <div>
                            <h2
                              style={{
                                margin: "0",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              KARUNA MEDICAL COLLEGE HOSPITAL
                            </h2>
                            <h1
                              style={{
                                margin: "0",
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "black",
                              }}
                            >
                              Vilayodi, Chittur , Palakkad
                            </h1>
                            <p style={{ margin: "5px 0", fontSize: "14px" }}>
                              <strong>Report Generated On:</strong>{" "}
                              {formatDate(new Date())}
                              {" | "}
                              <strong>Generated By:</strong>{" "}
                              {UserData?.username}
                              {" | "}
                              <strong>{getDateDisplay()}</strong>
                              {" | "}
                              <strong>Total Records:</strong> {countinfo}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr
                        style={{
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          S.No
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          Request ID
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          Patient ID
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          Patient Name
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          Register Type
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          Phone No
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          Doctor Name
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          Department
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          Test Name
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Filterdata.map((row, index) => (
                        <tr key={index} style={{ fontSize: "10px" }}>
                          <td style={{ padding: "6px", textAlign: "center" }}>
                            {row.Sno}
                          </td>
                          <td style={{ padding: "6px", textAlign: "center" }}>
                            {row.request_id}
                          </td>
                          <td style={{ padding: "6px", textAlign: "center" }}>
                            {row.PatientId}
                          </td>
                          <td style={{ padding: "6px" }}>
                            {row.PatientName || "-"}
                          </td>
                          <td style={{ padding: "6px", textAlign: "center" }}>
                            {row.RegisterType}
                          </td>
                          <td style={{ padding: "6px", textAlign: "center" }}>
                            {row.PhoneNumber || "-"}
                          </td>
                          <td style={{ padding: "6px" }}>{row.doctor_name}</td>
                          <td style={{ padding: "6px" }}>{row.Deptname}</td>
                          <td style={{ padding: "6px" }}>{row.Testname}</td>
                          <td style={{ padding: "6px", textAlign: "center" }}>
                            {row.Status || "-"}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: "bold", fontSize: "12px" }}>
                        <td
                          colSpan="8"
                          style={{
                            borderTop: "1px solid #000",
                            padding: "6px",
                            textAlign: "right",
                          }}
                        >
                          Total Records
                        </td>
                        <td
                          style={{
                            borderTop: "1px solid #000",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        >
                          {countinfo}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary Only View */}
            {printMode === "summary" && (
              <div
                ref={summaryRef}
                style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <td
                          colSpan="3"
                          style={{ border: "none", textAlign: "center" }}
                        >
                          <div>
                            <h2
                              style={{
                                margin: "0",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              KARUNA MEDICAL COLLEGE HOSPITAL
                            </h2>
                            <h1
                              style={{
                                margin: "0",
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "black",
                              }}
                            >
                              Vilayodi, Chittur , Palakkad
                            </h1>
                            <p style={{ margin: "5px 0", fontSize: "14px" }}>
                              <strong>Report Generated On:</strong>{" "}
                              {formatDate(new Date())}
                              {" | "}
                              <strong>Generated By:</strong>{" "}
                              {UserData?.username}
                              {" | "}
                              <strong>{getDateDisplay()}</strong>
                              {selectedDepartments.length > 0 && (
                                <>
                                  {" | "}
                                  <strong>Department:</strong>{" "}
                                  {getSelectedDepartmentNames().join(", ")}
                                </>
                              )}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr
                        style={{
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "6px",
                            width: "60px",
                          }}
                        >
                          SL
                        </th>
                        <th
                          style={{ border: "1px solid #000", padding: "6px" }}
                        >
                          PART OF SCAN
                        </th>
                        <th
                          style={{
                            border: "1px solid #000",
                            padding: "6px",
                            width: "120px",
                            textAlign: "right",
                          }}
                        >
                          COUNT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {testSummaryRows.map((row, idx) => (
                        <tr key={row.test_code || idx}>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          >
                            {idx + 1}
                          </td>
                          <td
                            style={{ border: "1px solid #000", padding: "6px" }}
                          >
                            {row.Testname}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: "6px",
                              textAlign: "right",
                            }}
                          >
                            {row.Testcount}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: "bold", fontSize: "12px" }}>
                        <td
                          style={{ border: "1px solid #000", padding: "6px" }}
                          colSpan={2}
                        >
                          TOTAL TESTS
                        </td>
                        <td
                          style={{
                            border: "1px solid #000",
                            padding: "6px",
                            textAlign: "right",
                          }}
                        >
                          {testSummaryTotal}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .Main_container_Btn {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }

        .Main_container_Btn button {
          padding: 10px 15px;
          background-color: #2c5aa0;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
        }

        .Main_container_Btn button:hover {
          background-color: #1e3f73;
        }
      `}</style>

      <style jsx>{`
        .print_mode_selection {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }

        .print_mode_selection label {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        .filter_actions {
          margin: 10px 0;
        }

        .clear_filters_btn {
          padding: 8px 16px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .clear_filters_btn:hover {
          background-color: #c82333;
        }

        .filter_section {
          margin: 20px 0;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }

        .filter_header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .filter_header h4 {
          margin: 0;
          color: #333;
        }

        .select_all_label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: bold;
          color: #2c5aa0;
          cursor: pointer;
        }

        .checkbox_container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .checkbox_label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          cursor: pointer;
        }

        .checkbox_label input[type="checkbox"] {
          margin-right: 5px;
        }

        .data_summary {
          padding: 10px;
          background-color: #e8f4f8;
          border-radius: 5px;
          margin: 10px 0;
        }

        .data_summary p {
          margin: 5px 0;
        }

        .modal_overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal_content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 1200px;
          max-height: 90%;
          overflow-y: auto;
        }

        .modal_header {
          padding: 20px;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal_close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .modal_body {
          padding: 20px;
        }

        .print_content {
          font-family: Arial, sans-serif;
        }

        .print_header {
          text-align: center;
          margin-bottom: 20px;
        }

        .print_header h2 {
          margin: 0 0 10px 0;
          color: #2c5aa0;
        }

        .print_header h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .print_info {
          text-align: left;
          margin: 15px 0;
        }

        .print_info p {
          margin: 5px 0;
        }

        .print_table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        .print_table th,
        .print_table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        .print_table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }

        .print_footer {
          margin-top: 20px;
          text-align: center;
        }

        .modal_footer {
          padding: 20px;
          border-top: 1px solid #ddd;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .print_btn,
        .cancel_btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .print_btn {
          background-color: #2c5aa0;
          color: white;
        }

        .cancel_btn {
          background-color: #6c757d;
          color: white;
        }

        @media print {
          .modal_header,
          .modal_footer,
          .print_mode_selection {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default RadiologyReports;

