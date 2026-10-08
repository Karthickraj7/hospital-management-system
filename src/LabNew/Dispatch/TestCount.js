// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import Tooltip from "@mui/material/Tooltip";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import { format } from "date-fns";
// import { useReactToPrint } from "react-to-print";
// import { useRef } from "react";
// import "./testcount.css";

// import logo from "../../Assets/kmc.jpeg";
// import ToggleButton from "@mui/material/ToggleButton";
// import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// import DonatChat from "../../OtherComponent/ReactGrid/DonatChat";

// const TestCount = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const today = new Date().toISOString().slice(0, 10);
//   const [searchQuery1, setSearchQuery1] = useState(today);
//   const [searchQuery2, setSearchQuery2] = useState("date");
//   const [searchQuery3, setSearchQuery3] = useState("");
//   const [searchQuery4, setSearchQuery4] = useState("All");
//   const [searchQuery5, setSearchQuery5] = useState("");
//   const [searchQuery6, setSearchQuery6] = useState("");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [input, setInput] = useState("date");

//   const [summa, setsumma] = useState([]);
//   const urllink = useSelector((state) => state.userRecord?.UrlLink);
//   const navigate = useNavigate();
//   const [page, setPage] = useState(0);
//   const pageSize = 10;
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const [totalPages, setTotalPages] = useState(0);
//   const [testCount, setTestCount] = useState(0);
//   const [OpCount, setOpCount] = useState(0);
//   const [IpCount, setIpCount] = useState(0);
//   const [TestNameList, setTestNameList] = useState([]);
//   const [subDep, setSetDep] = useState([]);
//   const [chats, setChat] = useState([]);

//   const [show, setshow] = useState(false);
//   const [loading, setloading] = useState(false);
//   const [batman, notBatman] = useState(false);
//   const altPressCount = useRef(0); // keeps track of how many times Alt was pressed
//   const timeoutRef = useRef(null); // reset counter after some delay

//   console.log("altpress----------", altPressCount);

//   const [type, setType] = useState("Patient");
//   const [deptData, setDeptData] = useState([]);
//   const handlePageChange = (event, newType) => {
//     if (newType !== null && newType !== type) {
//       setType(newType);
//     }
//   };

//   const componentRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     onBeforePrint: () => {
//       setshow(true);
//     },
//     onAfterPrint: async () => {
//       setshow(false);
//     },
//   });

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       // Detect Ctrl + Shift + B
//       if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "b") {
//         event.preventDefault();
//         notBatman((prev) => !prev); // toggle Batman mode
//         console.log("🔑 Ctrl + Shift + B pressed → Toggle Batman!");
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   const handleSearchChange = (e, key) => {
//     const value = e.target.value;
//     if (key === "name") setSearchQuery(value);
//     if (key === "date") setSearchQuery1(value);

//     if (key === "dateType") {
//       setSearchQuery2(value);

//       if (value.includes("month")) {
//         setInput("month");
//       } else {
//         setInput("date");
//       }

//       const todays = new Date().toISOString().slice(0, 10);
//       const today = new Date();
//       const fullDate = today.toISOString().split("T")[0];
//       const currentMonth = fullDate.slice(0, 7);

//       if (value === "date") {
//         setSearchQuery1(todays);
//       } else if (value === "month") {
//         setSearchQuery1(currentMonth);
//       }
//     }

//     if (key === "testType") setSearchQuery3(value);
//     if (key === "PatientType") setSearchQuery4(value);
//     if (key === "from") setFrom(value);
//     if (key === "to") setTo(value);
//     if (key === "patient") setSearchQuery5(value);
//     if (key === "dept") setSearchQuery6(value);
//   };

//   useEffect(() => {
//     setsumma([]);
//     setloading(true);
//     const offset = page * pageSize;

//     const isSearchCleared =
//       !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
//     console.log("Search Cleared:", isSearchCleared);

//     const deptcode = subDep?.filter(
//       (d) => d.SubDepartment_Name === searchQuery6
//     );
//     const dept = deptcode[0]?.SubDepartment_Code || "";

//     const testcode = TestNameList.filter((t) => t.name === searchQuery);
//     const test =
//       testcode[0]?.Test_Code ||
//       testcode[0]?.group_code ||
//       testcode[0]?.package_code ||
//       "";

//     if (
//       (searchQuery6 !== "" &&
//         searchQuery6 !== deptcode[0]?.SubDepartment_Name) ||
//       (searchQuery !== "" && searchQuery !== testcode[0]?.name)
//     ) {
//       return;
//     }

//     console.log("Fetching default data...");
//     axios
//       .get(
//         `${urllink}Lab/Get_Test_Count_Data?Location=${userRecord?.location}&limit=${pageSize}&offset=${offset}&testName=${test}&date=${searchQuery1}&dateType=${searchQuery2}&testType=${searchQuery3}&patient=${searchQuery4}&from=${from}&to=${to}&patientName=${searchQuery5}&dept=${dept}&batman=${batman}`
//       )
//       .then((response) => {
//         //   console.log(response.data.test_data);
//         const totalrecords = response.data.total_records;
//         const Oprecords = response.data.OP_records;
//         const Iprecords = response.data.IP_records;
//         const chat = [
//           { name: "IP", value: Number(Iprecords), color: "#1E90FF" },
//           { name: "OP", value: Number(Oprecords), color: "#008000" },
//           // { name: "All", value: Number(totalrecords),color: "#008000", },
//         ];
//         const data = response.data.test_data;
//         let Dept = response.data.deptData;
//         Dept = Dept.filter((c) => c.opcount !== 0 && c.ipcount !== 0);
//         setDeptData(Dept);
//         setTotalPages(0);
//         setsumma(data);
//         setTestCount(totalrecords);
//         setOpCount(Oprecords);
//         setIpCount(Iprecords);
//         setChat(chat);
//         setTotalPages(Math.ceil(totalrecords / pageSize));
//         setloading(false);
//       })
//       .catch((error) => {
//         setloading(false);
//         console.error("Error fetching data:", error);
//       });
//   }, [
//     urllink,
//     userRecord?.location,
//     page,
//     searchQuery,
//     searchQuery1,
//     searchQuery3,
//     searchQuery4,
//     searchQuery5,
//     searchQuery6,
//     from,
//     to,
//   ]);

//   useEffect(() => {
//     axios
//       .get(`${urllink}Lab/test_and_group_forpackage`)
//       .then((res) => {
//         console.log(res);
//         setTestNameList(res.data);
//       })
//       .catch((err) => {
//         console.error(err);
//       });

//     axios
//       .get(
//         `${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`
//       )
//       .then((response) => {
//         const data = response.data;
//         console.log("data", data);
//         setSetDep(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching SubDepartment data:", error);
//       });
//   }, [urllink]);

//   // const dynamicColumns = [
//   //   { key: "id", headerName: "S No", width: 100 },
//   //   { key: "Billing_Invoice", headerName: "Invoice", width: 100 },
//   //   { key: "Test_Name", headerName: "Test Name", width: 250 },
//   //   { key: "Test_Method", headerName: "Test Type", width: 250 },
//   //   { key: "Service_Status", headerName: "Collection Status", width: 100 },
//   //   { key: "Analysis_Status", headerName: "Report Entry Status", width: 100 },
//   //   { key: "Verify_Status", headerName: "Verify Status", width: 100 },
//   //   { key: "Approve_Status", headerName: "Approve Status", width: 100 },
//   // ];

//   const statusColors = {
//     captureSample: "#FFD700", // Yellow for Service_Status (Pending)
//     labTechnician: "#FFA500", // Orange for Analysis_Status (Pending)
//     seniorTechnician: "#1E90FF", // Blue for Verify_Status (Pending)
//     pathologist: "#800080", // Purple for Approve_Status (Pending)
//     completed: "#008000", // Green for all completed
//   };

//   const getStatusColor = (row) => {
//     if (row.Service_Status === "Pending") return statusColors.captureSample;
//     if (row.Analysis_Status === "Pending") return statusColors.labTechnician;
//     if (row.Verify_Status === "Pending") return statusColors.seniorTechnician;
//     if (row.Approve_Status === "Pending") return statusColors.pathologist;
//     return statusColors.completed;
//   };

//   console.log("Data-----------", summa);

//   const dynamicColumns = [
//     { key: "Sno", headerName: "S No", frozen: true, width: 40 },
//     {
//       key: "date",
//       headerName: "Bill Date",
//       width: 300,
//     },
//     { key: "patientType", headerName: "Patient Type", width: 100 },
//     { key: "patientid", headerName: "Patient ID", width: 100 },
//     { key: "opipid", headerName: "OP/IP No", width: 100 },
//     { key: "patientName", headerName: "Patient Name", width: 300 },
//     { key: "Phone", headerName: "Department", width: 250 },
//     // { key: "Test_Name", headerName: "Test Name", width: 250 },
//     {
//       key: "Test_Names",
//       name: "Tests",
//       width: 150,
//       renderCell: (params) => {
//         // Ensure test array exists
//         const tests = Array.isArray(params?.row?.test) ? params?.row?.test : [];

//         // Map each test to a single display string
//         const testData = tests.map(
//           (t) => t?.testName || t?.groupName || t?.packageName || "Unknown"
//         );

//         // Remove duplicates
//         const uniqueTestData = Array.from(new Set(testData));

//         return (
//           <>
//             {uniqueTestData?.length > 0 ? (
//               uniqueTestData?.map((d, index) => (
//                 <div key={index} style={{ fontSize: "10px" }}>
//                   {d}
//                 </div>
//               ))
//             ) : (
//               <div>No test</div>
//             )}
//           </>
//         );
//       },
//     },
//     {
//       key: "test",
//       name: "Cost",
//       width: 150,
//       renderCell: (params) => {
//         const tests = Array.isArray(params?.row?.test) ? params?.row?.test : [];

//         // Sum all costs safely
//         const totalCost = tests?.reduce(
//           (sum, t) => sum + Number(t?.cost || 0),
//           0
//         );

//         return (
//           <div>{totalCost.toFixed(2)}</div> // display as 2 decimal points
//         );
//       },
//     },

//     // {
//     //   key: "Test_Method",
//     //   headerName: "Test Type",
//     //   width: 250,
//     //   renderCell: (params) => params.row.Test_Method?.toString().toUpperCase()
//     // },
//     // { key: "Service_Status", headerName: "Collection Status", width: 100 },
//     // { key: "Analysis_Status", headerName: "Report Entry Status", width: 100 },
//     // { key: "Verify_Status", headerName: "Verify Status", width: 100 },
//     // { key: "Approve_Status", headerName: "Approve Status", width: 100 },
//     // {
//     //   key: 'status', // Ensure this matches the key in your data
//     //   headerName: 'Status',
//     //   width: 100,
//     //   renderCell: (params) => {
//     //     // Handle possibly undefined Service_Statuses
//     //     const serviceStatuses = params.row.Service_Status || [];
//     //     return (
//     //       <Tooltip title={
//     //         <>
//     //           {console.log("-----Haii------", params)}
//     //           {/* <div>Capture Status : {serviceStatuses[0].Capture}</div> */}
//     //           <div>Analaysis Status : {params.row.Analysis_Status}</div>
//     //           <div>Verified Status : {params.row.Verify_Status}</div>
//     //           <div>Approve Status : {params.row.Approve_Status}</div>
//     //         </>
//     //       } arrow>
//     //         <span>{params.row.status}</span>
//     //       </Tooltip>
//     //     );
//     //   },
//     // },
//     // {
//     //   key: "Status",
//     //   name: "Status",
//     //   width: 100,
//     //   renderCell: (params) => (
//     //     <div
//     //       style={{
//     //         backgroundColor: getStatusColor(params.row),
//     //         color: '#fff',
//     //         textAlign: 'center',
//     //         padding: '4px',
//     //         borderRadius: '4px',
//     //       }}
//     //     >
//     //       {params.row.Service_Status === "Pending" ? "Capture Sample" :
//     //         params.row.Analysis_Status === "Pending" ? "Lab Technician" :
//     //           params.row.Verify_Status === "Pending" ? "Senior Technician" :
//     //             params.row.Approve_Status === "Pending" ? "Pathologist" : "Completed"}
//     //     </div>
//     //   ),
//     // },
//   ];

//   const dynamicColumns2 = [
//     { key: "dept_name", headerName: "Department", frozen: true, width: 40 },
//     { key: "opcount", headerName: "OP", frozen: true, width: 40 },
//     { key: "ipcount", headerName: "IP", frozen: true, width: 40 },
//     {
//       key: "total",
//       name: "Total",
//       width: 150,
//       renderCell: (params) => {
//         // Sum all costs safely
//         const total = params?.row?.opcount + params?.row?.ipcount || 0;

//         return (
//           <div>{total}</div> // display as 2 decimal points
//         );
//       },
//     },
//   ];

//   return (
//     <div className="appointment">
//       <div className="h_head">
//         <h3>Lab Test Data</h3>
//       </div>
//       <div className="con_1 ">
//         <div className="inp_1" style={{ gap: "5px" }}>
//           {/* <label htmlFor="input">Date</label> */}
//           <select
//             name="dateType"
//             value={searchQuery2}
//             onChange={(e) => handleSearchChange(e, "dateType")}
//             style={{ width: "120px" }}
//           >
//             <option value={"date"}>Date</option>
//             <option value={"customdate"}>Custom Date</option>
//             <option value={"month"}>Month</option>
//             <option value={"custommonth"}>Custom Month</option>
//           </select>
//           {searchQuery2 === "date" || searchQuery2 === "month" ? (
//             <input
//               id="input"
//               type={input}
//               value={searchQuery1}
//               onChange={(e) => handleSearchChange(e, "date")}
//               placeholder="Enter Invoice Number"
//             />
//           ) : (
//             <div>
//               <div style={{ display: "inline-block" }}>
//                 <span
//                   style={{
//                     display: "inline-block",
//                     width: "40px",
//                     color: "black",
//                     fontSize: "13px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   From{" "}
//                 </span>
//                 <input
//                   id="input"
//                   type={input}
//                   value={from}
//                   onChange={(e) => handleSearchChange(e, "from")}
//                   placeholder="From Date"
//                 />
//               </div>
//               <div style={{ display: "inline-block" }}>
//                 <span
//                   style={{
//                     display: "inline-block",
//                     width: "40px",
//                     color: "black",
//                     fontSize: "13px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {" "}
//                   To{" "}
//                 </span>
//                 <input
//                   id="input"
//                   type={input}
//                   value={to}
//                   onChange={(e) => handleSearchChange(e, "to")}
//                   placeholder="To Date"
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="inp_1">
//           <label htmlFor="input">Department</label>
//           <input
//             value={searchQuery6}
//             onChange={(e) => handleSearchChange(e, "dept")}
//             placeholder="Enter Department"
//             type="text"
//             id="dept"
//             name="dept"
//             list="subdepList"
//             className=""
//             required
//             autoComplete="Off"
//           />
//           <datalist id="subdepList">
//             {Array.isArray(subDep) &&
//               subDep?.map((row, index) => (
//                 <option key={index} value={row.SubDepartment_Name} />
//               ))}
//           </datalist>
//         </div>

//         <div className="inp_1">
//           <label htmlFor="input">Test Name</label>
//           <input
//             value={searchQuery}
//             onChange={(e) => handleSearchChange(e, "name")}
//             placeholder="Enter Test Name"
//             type="text"
//             id="testname"
//             name="testname"
//             list="testnamelist"
//             className=""
//             required
//             autoComplete="Off"
//           />
//           <datalist id="testnamelist">
//             {Array.isArray(TestNameList) &&
//               TestNameList?.map((item, index) => (
//                 <option key={index} value={item.name}>
//                   {item.Test_Code}
//                 </option>
//               ))}
//           </datalist>
//         </div>

//         {batman && (
//           <div className="inp_1">
//             <label htmlFor="input">Method</label>
//             <select
//               value={searchQuery3}
//               onChange={(e) => handleSearchChange(e, "testType")}
//             >
//               <option value={""}>All</option>
//               <option value={"Patient"}>Patient</option>
//               <option value={"PatientS"}>PatientS</option>
//             </select>
//           </div>
//         )}

//         <div className="inp_1">
//           <label htmlFor="input">Patient Type</label>
//           <select
//             value={searchQuery4}
//             onChange={(e) => handleSearchChange(e, "PatientType")}
//           >
//             <option value={"All"}>All</option>
//             <option value={"IP"}>IP</option>
//             <option value={"OP"}>OP</option>
//           </select>
//         </div>

//         <div className="inp_1">
//           <label htmlFor="input">Patient Name</label>
//           <input
//             name="patient"
//             type="text"
//             value={searchQuery5}
//             onChange={(e) => handleSearchChange(e, "patient")}
//             placeholder="Enter Patient Name/Id"
//           />
//         </div>
//       </div>
//       <div className="h_head">
//         <h3>Lab Test Counts</h3>
//       </div>

//       <div className="con_1 ">
//         <div className="inp_1">
//           <label htmlFor="input">Test Count :</label>
//           <input
//             type="text"
//             value={testCount}
//             onChange={(e) => handleSearchChange(e, "count")}
//             readOnly
//           />
//         </div>
//         {searchQuery4 === "All" && (
//           <>
//             <div className="inp_1">
//               <label htmlFor="input">OP Test Count :</label>
//               <input
//                 type="text"
//                 value={OpCount}
//                 onChange={(e) => handleSearchChange(e, "count")}
//                 readOnly
//               />
//             </div>
//             <div className="inp_1">
//               <label htmlFor="input">IP Test Count :</label>
//               <input
//                 type="text"
//                 value={IpCount}
//                 onChange={(e) => handleSearchChange(e, "count")}
//                 readOnly
//               />
//             </div>
//           </>
//         )}
//       </div>
//       <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
//         <ToggleButtonGroup
//           value={type}
//           exclusive
//           onChange={handlePageChange}
//           aria-label="Platform"
//         >
//           <ToggleButton
//             value="Patient"
//             style={{
//               height: "30px",
//               width: "180px",
//               backgroundColor:
//                 type === "Patient" ? "var(--selectbackgroundcolor)" : "inherit",
//             }}
//             className="togglebutton_container"
//           >
//             Patient
//           </ToggleButton>
//           <ToggleButton
//             value="Department"
//             style={{
//               backgroundColor:
//                 type === "Department"
//                   ? "var(--selectbackgroundcolor)"
//                   : "inherit",
//               width: "180px",
//               height: "30px",
//             }}
//             className="togglebutton_container"
//           >
//             Department
//           </ToggleButton>
//         </ToggleButtonGroup>
//       </div>
//       {/* <div className="I_Love_Donat"> */}
//       {/* <DonatChat data={chats} /> */}
//       {/* </div> */}
//       {/* <div className='grid_1'>
//         <ReactGrid
//           RowData={summa}
//           columns={dynamicColumns}
//           className="data_grid"
//         />

//         {summa.length === 0 && (
//           <div className="IP_norecords">
//             <span>No Records Found</span>
//           </div>
//         )}
//       </div> */}

//       <div className="grid_1">
//         {type === "Patient" ? (
//           <ReactGrid
//             columns={dynamicColumns}
//             RowData={summa}
//             load={loading}
//             className="data_grid"
//           />
//         ) : (
//           <ReactGrid
//             columns={dynamicColumns2}
//             RowData={deptData}
//             load={loading}
//             className="data_grid"
//           />
//         )}
//       </div>
//       <div className="Register_btn_con">
//         <button className="RegisterForm_1_btns" onClick={handlePrint}>
//           Print
//         </button>
//       </div>
//       <div className="lab_Test_Reprot">
//         <div className="count-container" ref={componentRef}>
//           {type === "Patient" ? (
//             <table className="count-dabba">
//               <thead className="count-thead">
//                 <tr>
//                   <td colSpan="8" className="count-header">
//                     <div className="padda_potti">
//                       <div>
//                         <img src={logo} className="paddam" />
//                       </div>
//                       <div className="paruu">
//                         <h2 className="thalaipu">
//                           KARUNA MEDICAL COLLEGE HOSPITAL
//                         </h2>
//                         <h3>Vilayodi, Chittur, Palakkad</h3>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//                 {/* <div className="kattam"> */}
//                 <tr>
//                   <th className="count-th">S.No</th>
//                   <th className="count-th">Date</th>
//                   <th className="count-th">Patient ID</th>
//                   <th className="count-th">IP/OP No</th>
//                   <th className="count-th">Patient Name</th>
//                   {/* <th>Phone</th> */}
//                   <th className="count-th">Test Name</th>
//                   {/* <th>Amount</th> */}
//                 </tr>
//                 {/* </div> */}
//               </thead>
//               <tbody>
//                 {summa?.length > 0 ? (
//                   summa.map((row, rowIndex) =>
//                     row.test.map((t, testIndex) => (
//                       <tr key={`${row.Sno}-${testIndex}`}>
//                         {/* Only show patient info on the first test row */}
//                         {testIndex === 0 && (
//                           <>
//                             <td rowSpan={row.test.length} className="count-td">
//                               {rowIndex + 1}
//                             </td>
//                             <td
//                               rowSpan={row.test.length}
//                               className="count-td parusu"
//                             >
//                               {row.date}
//                             </td>
//                             <td rowSpan={row.test.length} className="count-td">
//                               {row.patientid}
//                             </td>
//                             <td rowSpan={row.test.length} className="count-td">
//                               {row.opipid}
//                             </td>
//                             <td
//                               rowSpan={row.test.length}
//                               className="count-td align-left"
//                             >
//                               {row.patientName}
//                             </td>
//                           </>
//                         )}
//                         {/* Test info */}
//                         <td className="count-td align-left">{t.testName}</td>
//                       </tr>
//                     ))
//                   )
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="no-records">
//                       No records found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           ) : (
//             // <table className="count-dabba">
//             //   <thead className="count-thead">
//             //     <tr>
//             //       <td colSpan="8" className="count-header">
//             //         <div className="padda_potti">
//             //           <div>
//             //             <img src={logo} className="paddam" />
//             //           </div>
//             //           <div className="paruu">
//             //             <h2 className="thalaipu">
//             //               KARUNA MEDICAL COLLEGE HOSPITAL
//             //             </h2>
//             //             <h3>Vilayodi, Chittur, Palakkad</h3>
//             //           </div>
//             //         </div>
//             //       </td>
//             //     </tr>
//             //     {/* <div className="kattam"> */}
//             //     <tr>
//             //       <th className="count-th">Department</th>
//             //       <th className="count-th">OP</th>
//             //       <th className="count-th">IP</th>
//             //       <th className="count-th">Total</th>
//             //     </tr>
//             //     {/* </div> */}
//             //   </thead>
//             //   <tbody>
//             //     {deptData?.length > 0 ? (
//             //       deptData.map((row, rowIndex) =>
//             //           <tr key={`${rowIndex}`}>
//             //                 <td className="count-td parusu">{row.dept_name}</td>
//             //                 <td className="count-td">{row.opcount}</td>
//             //                 <td className="count-td">{row.ipcount}</td>
//             //                 <td className="count-td align-left">{row.ipcount + row.opipid}</td>
//             //           </tr>
//             //       )
//             //     ) : (
//             //       <tr>
//             //         <td colSpan="8" className="no-records">
//             //           No records found
//             //         </td>
//             //       </tr>
//             //     )}
//             //   </tbody>
//             // </table>

//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 marginTop: "20px",
//                 fontFamily: "Arial, sans-serif",
//               }}
//             >
//               <thead>
//                 <tr>
//                   <td
//                     colSpan="8"
//                     style={{
//                       textAlign: "center",
//                       border: "1px solid #444",
//                       backgroundColor: "#fff",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <div>
//                         <img
//                           src={logo}
//                           alt="Hospital Logo"
//                           style={{ height: "60px", marginRight: "10px" }}
//                         />
//                       </div>
//                       <div>
//                         <h2 style={{ margin: 0, fontSize: "20px" }}>
//                           KARUNA MEDICAL COLLEGE HOSPITAL
//                         </h2>
//                         <h3
//                           style={{
//                             margin: 0,
//                             fontSize: "14px",
//                             fontWeight: "normal",
//                           }}
//                         >
//                           Vilayodi, Chittur, Palakkad
//                         </h3>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr style={{ backgroundColor: "#f2f2f2" }}>
//                   <th style={{ border: "1px solid #444", padding: "8px" }}>
//                     Department
//                   </th>
//                   <th style={{ border: "1px solid #444", padding: "8px" }}>
//                     OP
//                   </th>
//                   <th style={{ border: "1px solid #444", padding: "8px" }}>
//                     IP
//                   </th>
//                   <th style={{ border: "1px solid #444", padding: "8px" }}>
//                     Total
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {deptData?.length > 0 ? (
//                   deptData.map((row, rowIndex) => (
//                     <tr key={rowIndex}>
//                       <td
//                         style={{
//                           border: "1px solid #444",
//                           padding: "8px",
//                           textAlign: "left",
//                         }}
//                       >
//                         {row.dept_name}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid #444",
//                           padding: "8px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {row.opcount}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid #444",
//                           padding: "8px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {row.ipcount}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid #444",
//                           padding: "8px",
//                           textAlign: "right",
//                         }}
//                       >
//                         {row.opcount + row.ipcount}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="8"
//                       style={{
//                         border: "1px solid #444",
//                         padding: "12px",
//                         textAlign: "center",
//                         color: "#888",
//                       }}
//                     >
//                       No records found
//                     </td>
//                   </tr>
//                 )}
//                 <tr style={{ fontWeight: "bold", backgroundColor: "#e6e6e6" }}>
//                   <td
//                     style={{
//                       border: "1px solid #444",
//                       padding: "8px",
//                       textAlign: "left",
//                     }}
//                   >
//                     Total
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #444",
//                       padding: "8px",
//                       textAlign: "center",
//                     }}
//                   >
//                     {deptData.reduce((sum, row) => sum + row.opcount, 0)}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #444",
//                       padding: "8px",
//                       textAlign: "center",
//                     }}
//                   >
//                     {deptData.reduce((sum, row) => sum + row.ipcount, 0)}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #444",
//                       padding: "8px",
//                       textAlign: "right",
//                     }}
//                   >
//                     {deptData.reduce(
//                       (sum, row) => sum + row.opcount + row.ipcount,
//                       0
//                     )}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestCount;




import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import "./testcount.css";

import logo from "../../Assets/kmc.jpeg";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import DonatChat from "../../OtherComponent/ReactGrid/DonatChat";

const TestCount = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [searchQuery1, setSearchQuery1] = useState(today);
  const [searchQuery2, setSearchQuery2] = useState("date");
  const [searchQuery3, setSearchQuery3] = useState("");
  const [searchQuery4, setSearchQuery4] = useState("All");
  const [searchQuery5, setSearchQuery5] = useState("");
  const [searchQuery6, setSearchQuery6] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [input, setInput] = useState("date");

  const [summa, setsumma] = useState([]);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [totalPages, setTotalPages] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [OpCount, setOpCount] = useState(0);
  const [IpCount, setIpCount] = useState(0);
  const [TestNameList, setTestNameList] = useState([]);
  const [subDep, setSetDep] = useState([]);
  const [chats, setChat] = useState([]);

  const [show, setshow] = useState(false);
  const [loading, setloading] = useState(false);
  const [batman, notBatman] = useState(false);
  const altPressCount = useRef(0); // keeps track of how many times Alt was pressed
  const timeoutRef = useRef(null); // reset counter after some delay

  console.log("altpress----------", altPressCount);

  const [type, setType] = useState("Patient");
  const [deptData, setDeptData] = useState([]);
  const [specializationData, setSpecializationData] = useState([]);
  const handlePageChange = (event, newType) => {
    if (newType !== null && newType !== type) {
      setType(newType);
    }
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      setshow(true);
    },
    onAfterPrint: async () => {
      setshow(false);
    },
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Detect Ctrl + Shift + B
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        notBatman((prev) => !prev); // toggle Batman mode
        console.log("🔑 Ctrl + Shift + B pressed → Toggle Batman!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    if (key === "name") setSearchQuery(value);
    if (key === "date") setSearchQuery1(value);

    if (key === "dateType") {
      setSearchQuery2(value);

      if (value.includes("month")) {
        setInput("month");
      } else {
        setInput("date");
      }

      const todays = new Date().toISOString().slice(0, 10);
      const today = new Date();
      const fullDate = today.toISOString().split("T")[0];
      const currentMonth = fullDate.slice(0, 7);

      if (value === "date") {
        setSearchQuery1(todays);
      } else if (value === "month") {
        setSearchQuery1(currentMonth);
      }
    }

    if (key === "testType") setSearchQuery3(value);
    if (key === "PatientType") setSearchQuery4(value);
    if (key === "from") setFrom(value);
    if (key === "to") setTo(value);
    if (key === "patient") setSearchQuery5(value);
    if (key === "dept") setSearchQuery6(value);
  };

  useEffect(() => {
    setsumma([]);
    setloading(true);
    const offset = page * pageSize;

    const isSearchCleared =
      !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
    console.log("Search Cleared:", isSearchCleared);

    const deptcode = subDep?.filter(
      (d) => d.SubDepartment_Name === searchQuery6
    );
    const dept = deptcode[0]?.SubDepartment_Code || "";

    const testcode = TestNameList.filter((t) => t.name === searchQuery);
    const test =
      testcode[0]?.Test_Code ||
      testcode[0]?.group_code ||
      testcode[0]?.package_code ||
      "";

    if (
      (searchQuery6 !== "" &&
        searchQuery6 !== deptcode[0]?.SubDepartment_Name) ||
      (searchQuery !== "" && searchQuery !== testcode[0]?.name)
    ) {
      return;
    }

    console.log("Fetching default data...");
    axios
      .get(
        `${urllink}Lab/Get_Test_Count_Data?Location=${userRecord?.location}&limit=${pageSize}&offset=${offset}&testName=${test}&date=${searchQuery1}&dateType=${searchQuery2}&testType=${searchQuery3}&patient=${searchQuery4}&from=${from}&to=${to}&patientName=${searchQuery5}&dept=${dept}&batman=${batman}`
      )
      .then((response) => {
        //   console.log(response.data.test_data);
        const totalrecords = response.data.total_records;
        const Oprecords = response.data.OP_records;
        const Iprecords = response.data.IP_records;
        let SpecData = response.data.specializationData || [];
        const chat = [
          { name: "IP", value: Number(Iprecords), color: "#1E90FF" },
          { name: "OP", value: Number(Oprecords), color: "#008000" },
          // { name: "All", value: Number(totalrecords),color: "#008000", },
        ];
        const data = response.data.test_data;
        let Dept = response.data.deptData;
        Dept = Dept.filter((c) => c.opcount !== 0 && c.ipcount !== 0);
        SpecData = SpecData.filter((c) => c.opcount !== 0 || c.ipcount !== 0);

        setDeptData(Dept);
        setTotalPages(0);
        setsumma(data);
        setTestCount(totalrecords);
        setOpCount(Oprecords);
        setIpCount(Iprecords);
        setChat(chat);
        setTotalPages(Math.ceil(totalrecords / pageSize));
        setloading(false);
        setSpecializationData(SpecData);
      })
      .catch((error) => {
        setloading(false);
        console.error("Error fetching data:", error);
      });
  }, [
    urllink,
    userRecord?.location,
    page,
    searchQuery,
    searchQuery1,
    searchQuery3,
    searchQuery4,
    searchQuery5,
    searchQuery6,
    from,
    to,
  ]);

  useEffect(() => {
    axios
      .get(`${urllink}Lab/test_and_group_forpackage`)
      .then((res) => {
        console.log(res);
        setTestNameList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get(
        `${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`
      )
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        setSetDep(data);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });
  }, [urllink]);

  // const dynamicColumns = [
  //   { key: "id", headerName: "S No", width: 100 },
  //   { key: "Billing_Invoice", headerName: "Invoice", width: 100 },
  //   { key: "Test_Name", headerName: "Test Name", width: 250 },
  //   { key: "Test_Method", headerName: "Test Type", width: 250 },
  //   { key: "Service_Status", headerName: "Collection Status", width: 100 },
  //   { key: "Analysis_Status", headerName: "Report Entry Status", width: 100 },
  //   { key: "Verify_Status", headerName: "Verify Status", width: 100 },
  //   { key: "Approve_Status", headerName: "Approve Status", width: 100 },
  // ];

  const statusColors = {
    captureSample: "#FFD700", // Yellow for Service_Status (Pending)
    labTechnician: "#FFA500", // Orange for Analysis_Status (Pending)
    seniorTechnician: "#1E90FF", // Blue for Verify_Status (Pending)
    pathologist: "#800080", // Purple for Approve_Status (Pending)
    completed: "#008000", // Green for all completed
  };

  const getStatusColor = (row) => {
    if (row.Service_Status === "Pending") return statusColors.captureSample;
    if (row.Analysis_Status === "Pending") return statusColors.labTechnician;
    if (row.Verify_Status === "Pending") return statusColors.seniorTechnician;
    if (row.Approve_Status === "Pending") return statusColors.pathologist;
    return statusColors.completed;
  };

  console.log("Data-----------", summa);

  const dynamicColumns = [
    { key: "Sno", headerName: "S No", frozen: true, width: 40 },
    {
      key: "date",
      headerName: "Bill Date",
      width: 300,
    },
    { key: "patientType", headerName: "Patient Type", width: 100 },
    { key: "patientid", headerName: "Patient ID", width: 100 },
    { key: "opipid", headerName: "OP/IP No", width: 100 },
    { key: "patientName", headerName: "Patient Name", width: 300 },
    { key: "Specialization", headerName: "Specialization", width: 250 },
    // { key: "Test_Name", headerName: "Test Name", width: 250 },
    {
      key: "Test_Names",
      name: "Tests",
      width: 150,
      renderCell: (params) => {
        // Ensure test array exists
        const tests = Array.isArray(params?.row?.test) ? params?.row?.test : [];

        // Map each test to a single display string
        const testData = tests.map(
          (t) => t?.testName || t?.groupName || t?.packageName || "Unknown"
        );

        // Remove duplicates
        const uniqueTestData = Array.from(new Set(testData));

        return (
          <>
            {uniqueTestData?.length > 0 ? (
              uniqueTestData?.map((d, index) => (
                <div key={index} style={{ fontSize: "10px" }}>
                  {d}
                </div>
              ))
            ) : (
              <div>No test</div>
            )}
          </>
        );
      },
    },
    {
      key: "test",
      name: "Cost",
      width: 150,
      renderCell: (params) => {
        const tests = Array.isArray(params?.row?.test) ? params?.row?.test : [];

        // Sum all costs safely
        const totalCost = tests?.reduce(
          (sum, t) => sum + Number(t?.cost || 0),
          0
        );

        return (
          <div>{totalCost.toFixed(2)}</div> // display as 2 decimal points
        );
      },
    },

    // {
    //   key: "Test_Method",
    //   headerName: "Test Type",
    //   width: 250,
    //   renderCell: (params) => params.row.Test_Method?.toString().toUpperCase()
    // },
    // { key: "Service_Status", headerName: "Collection Status", width: 100 },
    // { key: "Analysis_Status", headerName: "Report Entry Status", width: 100 },
    // { key: "Verify_Status", headerName: "Verify Status", width: 100 },
    // { key: "Approve_Status", headerName: "Approve Status", width: 100 },
    // {
    //   key: 'status', // Ensure this matches the key in your data
    //   headerName: 'Status',
    //   width: 100,
    //   renderCell: (params) => {
    //     // Handle possibly undefined Service_Statuses
    //     const serviceStatuses = params.row.Service_Status || [];
    //     return (
    //       <Tooltip title={
    //         <>
    //           {console.log("-----Haii------", params)}
    //           {/* <div>Capture Status : {serviceStatuses[0].Capture}</div> */}
    //           <div>Analaysis Status : {params.row.Analysis_Status}</div>
    //           <div>Verified Status : {params.row.Verify_Status}</div>
    //           <div>Approve Status : {params.row.Approve_Status}</div>
    //         </>
    //       } arrow>
    //         <span>{params.row.status}</span>
    //       </Tooltip>
    //     );
    //   },
    // },
    // {
    //   key: "Status",
    //   name: "Status",
    //   width: 100,
    //   renderCell: (params) => (
    //     <div
    //       style={{
    //         backgroundColor: getStatusColor(params.row),
    //         color: '#fff',
    //         textAlign: 'center',
    //         padding: '4px',
    //         borderRadius: '4px',
    //       }}
    //     >
    //       {params.row.Service_Status === "Pending" ? "Capture Sample" :
    //         params.row.Analysis_Status === "Pending" ? "Lab Technician" :
    //           params.row.Verify_Status === "Pending" ? "Senior Technician" :
    //             params.row.Approve_Status === "Pending" ? "Pathologist" : "Completed"}
    //     </div>
    //   ),
    // },
  ];

  const dynamicColumns2 = [
    { key: "dept_name", headerName: "Department", frozen: true, width: 40 },
    { key: "opcount", headerName: "OP", frozen: true, width: 40 },
    { key: "ipcount", headerName: "IP", frozen: true, width: 40 },
    {
      key: "total",
      name: "Total",
      width: 150,
      renderCell: (params) => {
        // Sum all costs safely
        const total = params?.row?.opcount + params?.row?.ipcount || 0;

        return (
          <div>{total}</div> // display as 2 decimal points
        );
      },
    },
  ];

  const dynamicColumns3 = [
  { key: "specialization_name", headerName: "Specialization", width: 200 },
  { key: "opcount", headerName: "OP", width: 100 },
  { key: "ipcount", headerName: "IP", width: 100 },
  {
    key: "total",
    headerName: "Total",
    width: 100,
    renderCell: (params) => {
      const total = params?.row?.opcount + params?.row?.ipcount || 0;
      return <div>{total}</div>;
    },
  },
 ];

  return (
    <div className="appointment">
      <div className="h_head">
        <h3>Lab Test Data</h3>
      </div>
      <div className="con_1 ">
        <div className="inp_1" style={{ gap: "5px" }}>
          {/* <label htmlFor="input">Date</label> */}
          <select
            name="dateType"
            value={searchQuery2}
            onChange={(e) => handleSearchChange(e, "dateType")}
            style={{ width: "120px" }}
          >
            <option value={"date"}>Date</option>
            <option value={"customdate"}>Custom Date</option>
            <option value={"month"}>Month</option>
            <option value={"custommonth"}>Custom Month</option>
          </select>
          {searchQuery2 === "date" || searchQuery2 === "month" ? (
            <input
              id="input"
              type={input}
              value={searchQuery1}
              onChange={(e) => handleSearchChange(e, "date")}
              placeholder="Enter Invoice Number"
            />
          ) : (
            <div>
              <div style={{ display: "inline-block" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "40px",
                    color: "black",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  From{" "}
                </span>
                <input
                  id="input"
                  type={input}
                  value={from}
                  onChange={(e) => handleSearchChange(e, "from")}
                  placeholder="From Date"
                />
              </div>
              <div style={{ display: "inline-block" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "40px",
                    color: "black",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  To{" "}
                </span>
                <input
                  id="input"
                  type={input}
                  value={to}
                  onChange={(e) => handleSearchChange(e, "to")}
                  placeholder="To Date"
                />
              </div>
            </div>
          )}
        </div>

        <div className="inp_1">
          <label htmlFor="input">Department</label>
          <input
            value={searchQuery6}
            onChange={(e) => handleSearchChange(e, "dept")}
            placeholder="Enter Department"
            type="text"
            id="dept"
            name="dept"
            list="subdepList"
            className=""
            required
            autoComplete="Off"
          />
          <datalist id="subdepList">
            {Array.isArray(subDep) &&
              subDep?.map((row, index) => (
                <option key={index} value={row.SubDepartment_Name} />
              ))}
          </datalist>
        </div>

        <div className="inp_1">
          <label htmlFor="input">Test Name</label>
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e, "name")}
            placeholder="Enter Test Name"
            type="text"
            id="testname"
            name="testname"
            list="testnamelist"
            className=""
            required
            autoComplete="Off"
          />
          <datalist id="testnamelist">
            {Array.isArray(TestNameList) &&
              TestNameList?.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.Test_Code}
                </option>
              ))}
          </datalist>
        </div>

        {batman && (
          <div className="inp_1">
            <label htmlFor="input">Method</label>
            <select
              value={searchQuery3}
              onChange={(e) => handleSearchChange(e, "testType")}
            >
              <option value={""}>All</option>
              <option value={"Patient"}>Patient</option>
              <option value={"PatientS"}>PatientS</option>
            </select>
          </div>
        )}

        <div className="inp_1">
          <label htmlFor="input">Patient Type</label>
          <select
            value={searchQuery4}
            onChange={(e) => handleSearchChange(e, "PatientType")}
          >
            <option value={"All"}>All</option>
            <option value={"IP"}>IP</option>
            <option value={"OP"}>OP</option>
          </select>
        </div>

        <div className="inp_1">
          <label htmlFor="input">Patient Name</label>
          <input
            name="patient"
            type="text"
            value={searchQuery5}
            onChange={(e) => handleSearchChange(e, "patient")}
            placeholder="Enter Patient Name/Id"
          />
        </div>
      </div>
      <div className="h_head">
        <h3>Lab Test Counts</h3>
      </div>

      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="input">Test Count :</label>
          <input
            type="text"
            value={testCount}
            onChange={(e) => handleSearchChange(e, "count")}
            readOnly
          />
        </div>
        {searchQuery4 === "All" && (
          <>
            <div className="inp_1">
              <label htmlFor="input">OP Test Count :</label>
              <input
                type="text"
                value={OpCount}
                onChange={(e) => handleSearchChange(e, "count")}
                readOnly
              />
            </div>
            <div className="inp_1">
              <label htmlFor="input">IP Test Count :</label>
              <input
                type="text"
                value={IpCount}
                onChange={(e) => handleSearchChange(e, "count")}
                readOnly
              />
            </div>
          </>
        )}
      </div>
      <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handlePageChange}
          aria-label="Platform"
        >
          <ToggleButton
            value="Patient"
            style={{
              height: "30px",
              width: "180px",
              backgroundColor:
                type === "Patient" ? "var(--selectbackgroundcolor)" : "inherit",
            }}
            className="togglebutton_container"
          >
            Patient
          </ToggleButton>

          <ToggleButton
            value="Department"
            style={{
              backgroundColor:
                type === "Department"
                  ? "var(--selectbackgroundcolor)"
                  : "inherit",
              width: "180px",
              height: "30px",
            }}
            className="togglebutton_container"
          >
            Department
          </ToggleButton>
          <ToggleButton value="Specialization"
          style={{
              backgroundColor:
                type === "Department"
                  ? "var(--selectbackgroundcolor)"
                  : "inherit",
              width: "180px",
              height: "30px",
            }}>Specialization
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {/* <div className="I_Love_Donat"> */}
      {/* <DonatChat data={chats} /> */}
      {/* </div> */}
      {/* <div className='grid_1'>
        <ReactGrid
          RowData={summa}
          columns={dynamicColumns}
          className="data_grid"
        />

        {summa.length === 0 && (
          <div className="IP_norecords">
            <span>No Records Found</span>
          </div>
        )}
      </div> */}

      {/* <div className="grid_1">
        {type === "Patient" ? (
          <ReactGrid
            columns={dynamicColumns}
            RowData={summa}
            load={loading}
            className="data_grid"
          />
        ) : (
          <ReactGrid
            columns={dynamicColumns2}
            RowData={deptData}
            load={loading}
            className="data_grid"
          />
        )}
      </div> */}
      <div className="grid_1">
        {type === "Patient" ? (
          <ReactGrid
            columns={dynamicColumns}
            RowData={summa}
            load={loading}
            className="data_grid"
          />
        ) : type === "Department" ? (
          <ReactGrid
            columns={dynamicColumns2}
            RowData={deptData}
            load={loading}
            className="data_grid"
          />
        ) : (
          <ReactGrid
            columns={dynamicColumns3}
            RowData={specializationData}
            load={loading}
            className="data_grid"
          />
        )}
      </div>
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlePrint}>
          Print
        </button>
      </div>
      <div className="lab_Test_Reprot">
       <div className="count-container" ref={componentRef}>
  {type === "Patient" ? (
    <table className="count-dabba">
      <thead className="count-thead">
        <tr>
          <td colSpan="8" className="count-header">
            <div className="padda_potti">
              <div>
                <img src={logo} className="paddam" />
              </div>
              <div className="paruu">
                <h2 className="thalaipu">
                  KARUNA MEDICAL COLLEGE HOSPITAL
                </h2>
                <h3>Vilayodi, Chittur, Palakkad</h3>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th className="count-th">S.No</th>
          <th className="count-th">Date</th>
          <th className="count-th">Patient ID</th>
          <th className="count-th">IP/OP No</th>
          <th className="count-th">Patient Name</th>
          <th className="count-th">Test Name</th>
        </tr>
      </thead>
      <tbody>
        {summa?.length > 0 ? (
          summa.map((row, rowIndex) =>
            row.test.map((t, testIndex) => (
              <tr key={`${row.Sno}-${testIndex}`}>
                {testIndex === 0 && (
                  <>
                    <td rowSpan={row.test.length} className="count-td">
                      {rowIndex + 1}
                    </td>
                    <td rowSpan={row.test.length} className="count-td parusu">
                      {row.date}
                    </td>
                    <td rowSpan={row.test.length} className="count-td">
                      {row.patientid}
                    </td>
                    <td rowSpan={row.test.length} className="count-td">
                      {row.opipid}
                    </td>
                    <td rowSpan={row.test.length} className="count-td align-left">
                      {row.patientName}
                    </td>
                  </>
                )}
                <td className="count-td align-left">{t.testName}</td>
              </tr>
            ))
          )
        ) : (
          <tr>
            <td colSpan="8" className="no-records">
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  ) : type === "Department" ? (
    <table className="count-dabba">
      <thead className="count-thead">
        <tr>
          <td colSpan="4" className="count-header">
            <div className="padda_potti">
              <div>
                <img src={logo} className="paddam" />
              </div>
              <div className="paruu">
                <h2 className="thalaipu">
                  KARUNA MEDICAL COLLEGE HOSPITAL
                </h2>
                <h3>Vilayodi, Chittur, Palakkad</h3>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th className="count-th">Department</th>
          <th className="count-th">OP</th>
          <th className="count-th">IP</th>
          <th className="count-th">Total</th>
        </tr>
      </thead>
      <tbody>
        {deptData?.length > 0 ? (
          deptData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="count-td parusu">{row.dept_name}</td>
              <td className="count-td">{row.opcount}</td>
              <td className="count-td">{row.ipcount}</td>
              <td className="count-td">{row.opcount + row.ipcount}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="no-records">
              No records found
            </td>
          </tr>
        )}
        <tr style={{ fontWeight: "bold", backgroundColor: "#e6e6e6" }}>
          <td className="count-td">Total</td>
          <td className="count-td">
            {deptData.reduce((sum, row) => sum + row.opcount, 0)}
          </td>
          <td className="count-td">
            {deptData.reduce((sum, row) => sum + row.ipcount, 0)}
          </td>
          <td className="count-td">
            {deptData.reduce(
              (sum, row) => sum + row.opcount + row.ipcount,
              0
            )}
          </td>
        </tr>
      </tbody>
    </table>
  ) : (
    <table className="count-dabba">
      <thead className="count-thead">
        <tr>
          <td colSpan="4" className="count-header">
            <div className="padda_potti">
              <div>
                <img src={logo} className="paddam" />
              </div>
              <div className="paruu">
                <h2 className="thalaipu">
                  KARUNA MEDICAL COLLEGE HOSPITAL
                </h2>
                <h3>Vilayodi, Chittur, Palakkad</h3>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th className="count-th">Specialization</th>
          <th className="count-th">OP</th>
          <th className="count-th">IP</th>
          <th className="count-th">Total</th>
        </tr>
      </thead>
      <tbody>
        {specializationData?.length > 0 ? (
          specializationData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="count-td parusu">{row.specialization_name}</td>
              <td className="count-td">{row.opcount}</td>
              <td className="count-td">{row.ipcount}</td>
              <td className="count-td">{row.opcount + row.ipcount}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="no-records">
              No records found
            </td>
          </tr>
        )}
        <tr style={{ fontWeight: "bold", backgroundColor: "#e6e6e6" }}>
          <td className="count-td">Total</td>
          <td className="count-td">
            {specializationData.reduce((sum, row) => sum + row.opcount, 0)}
          </td>
          <td className="count-td">
            {specializationData.reduce((sum, row) => sum + row.ipcount, 0)}
          </td>
          <td className="count-td">
            {specializationData.reduce(
              (sum, row) => sum + row.opcount + row.ipcount,
              0
            )}
          </td>
        </tr>
      </tbody>
    </table>
  )}
</div>
      </div>
    </div>
  );
};

export default TestCount;



