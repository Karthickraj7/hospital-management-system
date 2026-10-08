// import * as React from 'react';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaPrint } from 'react-icons/fa';
// import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";


// const RadPatienttestlist = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const dispatchvalue = useDispatch();

//   const today = new Date().toISOString().slice(0, 10);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchQuery1, setSearchQuery1] = useState('');
//   const [searchQuery2, setSearchQuery2] = useState('');
//   const [searchQuery3, setSearchQuery3] = useState('');
//   const [searchQuery4, setSearchQuery4] = useState('currentdate');
//   const [searchQuery5, setSearchQuery5] = useState(today);
//   const [searchQuery6, setSearchQuery6] = useState('');
//   const [searchQuery7, setSearchQuery7] = useState('');
//   const [searchQuery8, setSearchQuery8] = useState('');


//   const [viewtest, setViewtest] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [expandedTest, setExpandedTest] = useState(null);
//   const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
//   const [filteredRows, setFilteredRows] = useState([]);
//   const urllink = useSelector(state => state.userRecord?.UrlLink);
//   const userRecord = useSelector(state => state.userRecord?.UserData);
//   const PageSize = 10;
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [file, setFile] = useState(null);

//   console.log("Record---------->>>>", userRecord)

//   const toast = useSelector((state) => state.userRecord?.toast);

//   // Define status colors
//   const statusColors = {
//     captureSample: '#FFA500', // Yellow for Service_Status (Pending)
//     labTechnician: '#1E90FF', // Orange for Analysis_Status (Pending)
//     seniorTechnician: '#008000', // Blue for Verify_Status (Pending)
//     pathologist: '#800080', // Purple for Approve_Status (Pending)
//     completed: '#da1212ff', // Green for all completed
//   };

//   useEffect(() => {
//     // const offset = page * PageSize;
//     // const limit = PageSize;
//     var department = []
//     // const Access = (userRecord?.AccessTwo || "").split(",")
//     let Access = []
//     if (userRecord?.Emp_DepartmentName?.length === 0) {
//       Access = userRecord?.Department;
//     } else {
//       Access = userRecord?.Emp_DepartmentName;
//     }


//     if (Access?.includes("MRI")) {
//       console.log("MRI")
//       department.push("2");
//     }
//     if (Access?.includes("CT")) {
//       console.log("CT")
//       department.push("1");
//     }
//     if (Access?.includes("XRAY")) {
//       console.log("XRAY")
//       department.push("3");
//     }
//     if (Access?.includes("USG")) {
//       console.log("USG")
//       department.push("4");
//     }
//     // if (Access.includes("M13-7")) {
//     //   console.log("Doctor")
//     //   department = ["1", "2", "3", "4"]
//     // }

//     console.log("REsponce------------>>", department);

//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${urllink}Radiology/get_patienttestlist`, {
//           params: {
//             Location: userRecord?.location,
//             patient_name: searchQuery,
//             patientid: searchQuery1,
//             barcode: searchQuery2,
//             invoice: searchQuery3,
//             departments: JSON.stringify(department),
//             dateType: searchQuery4,
//             date: searchQuery5,
//             from: searchQuery6,
//             to: searchQuery7,
//             status: searchQuery8,
//           },
//         });
//         const data = response.data;
//         const sortedData = data.sort((a, b) => a.id - b.id);
//         setFilteredRows(sortedData)

//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setFilteredRows([]);
//         setTotalPages(0);
//       }
//     };
//     fetchData();
//   }, [urllink, userRecord, page, dispatchvalue, searchQuery, searchQuery1, searchQuery2, searchQuery3, searchQuery5, searchQuery6, searchQuery7, searchQuery8]);



//   console.log("REsponce------------>>", filteredRows);


//   const handleSearchChange = (event, type) => {
//     const value = event.target.value;
//     if (type === 'name') setSearchQuery(value);
//     else if (type === 'phone') setSearchQuery1(value);
//     else if (type === 'barcode') setSearchQuery2(value);
//     else if (type === 'invoice') setSearchQuery3(value);
//     else if (type === "dateType") setSearchQuery4(value);
//     else if (type === "date") setSearchQuery5(value);
//     else if (type === "fromdate") setSearchQuery6(value);
//     else if (type === "todate") setSearchQuery7(value);
//     else if (type === "status") setSearchQuery8(value);
//   };

//   const handleBarcodeReprint = (params) => {
//     console.log(params)
//     dispatchvalue({ type: 'PrintBarcode', value: params })
//     dispatchvalue({ type: "setActiveFolder", value: "BarcodePrint" });
//   }

//   const handleviewtest = (params) => {
//     console.log("Params:", params);
//     const testData = params?.Test_Names.map((test, index) => ({
//       id: index,
//       testname: test.Test_Name,
//       subTests: test.SubTests || [],
//     }));
//     console.log("Test Data for Modal:", testData);
//     setViewtest(testData);
//     setExpandedTest(null);
//     setOpenModal(true);
//   };

//   const toggleSubTests = (testId) => {
//     setExpandedTest(expandedTest === testId ? null : testId);
//   };


//   const handleOpenPDF = (base64PDF) => {
//     if (!base64PDF) {
//       alert("No report available.");
//       return;
//     }

//     // Remove prefix if exists
//     let actualBase64 = base64PDF;
//     if (actualBase64.startsWith("data:application/pdf;base64,")) {
//       actualBase64 = actualBase64.split(",")[1];
//     }

//     // Convert base64 -> binary
//     const byteCharacters = atob(actualBase64);
//     const byteNumbers = Array.from(byteCharacters, (char) =>
//       char.charCodeAt(0)
//     );
//     const byteArray = new Uint8Array(byteNumbers);

//     // Create blob and open
//     const blob = new Blob([byteArray], { type: "application/pdf" });
//     const blobURL = URL.createObjectURL(blob);
//     const pdfWindow = window.open(blobURL);
//     if (!pdfWindow) {
//       alert("Popup blocked. Please allow popups for this site.");
//     }
//   };



//   // const handlePress = (params) => {
//   //   console.log("Params--------", params.row)
//   //   const Access = userRecord.AccessTwo.split(",")
//   //   console.log(typeof (Access))

//   //   var page = ""

//   //   if (params.row.Service_Status === "Pending") {
//   //     if (['M13-5', 'M13-4', 'M13-3', 'M13-2'].some((code) => Access.includes(code))) {
//   //       page = "ReportCapture"
//   //     } else {
//   //       const tdata = {
//   //         message: "Report In Progress...",
//   //         type: "warn",
//   //       };
//   //       dispatchvalue({ type: "toast", value: tdata });
//   //     }
//   //   } else if (params.row.Service_Status === "Analyzd") {
//   //     if (Access.includes("M13-7")) {
//   //       page = "ReportVerify"
//   //     }
//   //     else {
//   //       const tdata = {
//   //         message: "Report Not Verifyed...",
//   //         type: "warn",
//   //       };
//   //       dispatchvalue({ type: "toast", value: tdata });

//   //     }
//   //   } else if (params.row.Service_Status === "Completed") {
//   //     if (params.row.File) {
//   //       handleOpenPDF(params.row.File)
//   //     } else {
//   //       page = ""
//   //       dispatchvalue({ type: "setActiveFolder", value: "PrintPaper" });
//   //       dispatchvalue({ type: "RadData", value: params.row });
//   //     }
//   //   }



//   //   if (page !== "") {
//   //     dispatchvalue({ type: "RadData", value: params.row });
//   //     dispatchvalue({ type: "setPreviousFolder", value: "PatientList" });
//   //     dispatchvalue({ type: "setActiveFolder", value: "NavigateRad" });
//   //     dispatchvalue({ type: "activeTab", value: page });
//   //   }


//   // }

//   const handlePress = (params) => {
//     console.log("Params--------", params.row)
 
//     if (params.row.Status === "Request") {
//       const tdata = {
//       message: "Billing not yet completed.",
//       type: "warn",
//       };
//       dispatchvalue({ type: "toast", value: tdata });
//       return;
//      }
//         const Access = userRecord.AccessTwo.split(",")
//      console.log(typeof (Access))
 
//      var page = ""
 
//      if (params.row.Service_Status === "Pending") {
//       if (['M13-5', 'M13-4', 'M13-3', 'M13-2'].some((code) => Access.includes(code))) {
//         page = "ReportCapture"
//       } else {
//         const tdata = {
//           message: "Report In Progress...",
//           type: "warn",
//         };
//         dispatchvalue({ type: "toast", value: tdata });
//       }
//      } else if (params.row.Service_Status === "Analyzd") {
//       if (Access.includes("M13-7")) {
//         page = "ReportVerify"
//       }
//       else {
//         const tdata = {
//           message: "Report Not Verifyed...",
//           type: "warn",
//         };
//         dispatchvalue({ type: "toast", value: tdata });
 
//       }
//      } else if (params.row.Service_Status === "Completed") {
//       if (params.row.File) {
//         handleOpenPDF(params.row.File)
//       } else {
//         page = ""
//         dispatchvalue({ type: "setActiveFolder", value: "PrintPaper" });
//         dispatchvalue({ type: "RadData", value: params.row });
//       }
//     }
 
//     if (page !== "") {
//       dispatchvalue({ type: "RadData", value: params.row });
//       dispatchvalue({ type: "setPreviousFolder", value: "PatientList" });
//       dispatchvalue({ type: "setActiveFolder", value: "NavigateRad" });
//       dispatchvalue({ type: "activeTab", value: page });
//     }  
 
//   }


//   const getStatusColor = (row) => {
//     console.log("color----------", row.Service_Status);

//     if (row.Service_Status === "Pending") return statusColors.captureSample;
//     if (row.Service_Status === "Analyzd") return statusColors.labTechnician;
//     if (row.Service_Status === "Completed") return statusColors.seniorTechnician;
//     return statusColors.completed;
//   };

//   const dynamicColumns = [
//     { key: "id", name: "S.NO", width: 70, frozen: true },
//     { key: "CreatedAt", name: "Date", width: 70, frozen: true },
//     {
//       key: "invoice",
//       name: "Invoice",
//       frozen: true,
//       width: 140,
//     },
//     { key: "Patient_Id", name: "Patient Id", frozen: true, width: 70 },
//     { key: "Visit_Id", name: "Visit ID", width: 70 },
//     { key: "Patient_Name", name: "Patient Name", width: 90 },
//     { key: "Age", name: "Age", width: 50 },
//     { key: "Phone", name: "Phone No", width: 80 },
//     { key: "subDepartment", name: "Department", width: 80 },
//     {
//       key: "TestName",
//       name: "Test",
//       width: 70,
//     },
//     {
//       key: "Status",
//       name: "Status",
//       width: 100,
//       renderCell: (params) => (
//         <div
//           style={{
//             backgroundColor: getStatusColor(params.row),
//             color: '#fff',
//             textAlign: 'center',
//             padding: '4px',
//             borderRadius: '4px',
//             cursor: "pointer",
//           }}
//           onClick={() => handlePress(params)}
//         >
//           {params.row.Service_Status === "Pending" ? "In Technician" :
//             params.row.Service_Status === "Analyzd" ? "In Radiologist" :
//               params.row.Service_Status === "Completed" ? "In Dispatch" : "Somthing"}
//         </div>
//       ),
//     },

//   ];

//   return (
//     <div className="appointment">
//       <ToastAlert Message={toast.message} Type={toast.type} />
//       <div className="h_head">
//         <h3>Patient Request List</h3>
//       </div>
//       <div className="con_1">
//         <div className="inp_1">
//           <label htmlFor="input">Patient Name :</label>
//           <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e, 'name')} placeholder='Enter the Patient Name' />
//         </div>
//         <div className="inp_1">
//           <label htmlFor="input">Patient ID :</label>
//           <input type="text" value={searchQuery1} onChange={(e) => handleSearchChange(e, 'phone')} placeholder='Enter the Phone Number' />
//         </div>
//         <div className="inp_1">
//           <label htmlFor="input">Phone</label>
//           <input
//             id="input"
//             type="text"
//             value={searchQuery2}
//             onChange={(e) => handleSearchChange(e, 'barcode')}
//             placeholder='Enter Barcode Number'
//           />
//         </div>
//         <div className="inp_1">
//           <label htmlFor="input">Invoice No</label>
//           <input
//             id="input"
//             type="text"
//             value={searchQuery3}
//             onChange={(e) => handleSearchChange(e, 'invoice')}
//             placeholder='Enter Invoice Number'
//           />
//         </div>
//         <div className="inp_1" style={{ gap: "10px", }}>
//           <select
//             name="dateType"
//             value={searchQuery4}
//             onChange={(e) => handleSearchChange(e, "dateType")}
//             style={{ width: "120px", }}
//           >
//             <option value={"currentdate"}>Date</option>
//             <option value={"customdate"}>Custom Date</option>
//           </select>

//           {searchQuery4 === "currentdate" ?
//             (
//               <>
//                 <input
//                   id="input"
//                   type="date"
//                   value={searchQuery5}
//                   onChange={(e) => handleSearchChange(e, 'date')}
//                   placeholder='Enter Invoice Number'
//                 />
//               </>
//             ) :
//             (
//               <div>
//                 <div style={{ display: "inline-block", }}>
//                   <span style={{ display: "inline-block", width: "40px", color: "black", fontSize: "13px", fontWeight: "bold" }}>From </span>
//                   <input
//                     id="input"
//                     type="date"
//                     value={searchQuery6}
//                     onChange={(e) => handleSearchChange(e, 'fromdate')}
//                     placeholder='From Date'
//                   />
//                 </div>
//                 <div style={{ display: "inline-block", }}>
//                   <span style={{ display: "inline-block", width: "40px", color: "black", fontSize: "13px", fontWeight: "bold" }}> To </span>
//                   <input
//                     id="input"
//                     type="date"
//                     value={searchQuery7}
//                     onChange={(e) => handleSearchChange(e, 'todate')}
//                     placeholder='To Date'
//                   />
//                 </div>
//               </div>)
//           }

//         </div>




//         <div className="inp_1">
//           <label htmlFor="input">Status</label>
//           <select
//             value={searchQuery8}
//             onChange={(e) => handleSearchChange(e, "status")}
//             style={{ width: "165px", }}
//           >
//             <option value={""}>ALL</option>
//             <option value={"Pending"}>Pending</option>
//             <option value={"Analyzd"}>Analyzd</option>
//             <option value={"Completed"}>Completed</option>

//           </select>
//         </div>


//       </div>

//       <div className='grid_1'>
//         <ReactGrid columns={dynamicColumns} RowData={filteredRows} />
//       </div>

//       {loading && (
//         <div className="spinner-overlay">
//           <div className="spinner">
//             <div className="rect1"></div>
//             <div className="rect2"></div>
//             <div className="rect3"></div>
//             <div className="rect4"></div>
//             <div className="rect5"></div>
//           </div>
//         </div>
//       )}

//     </div>

//   );
// };

// export default RadPatienttestlist;


import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPrint } from 'react-icons/fa';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';



const RadPatienttestlist = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatchvalue = useDispatch();

  const today = new Date().toISOString().slice(0, 10);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchQuery3, setSearchQuery3] = useState('');
  const [searchQuery4, setSearchQuery4] = useState('currentdate');
  const [searchQuery5, setSearchQuery5] = useState(today);
  const [searchQuery6, setSearchQuery6] = useState('');
  const [searchQuery7, setSearchQuery7] = useState('');
  const [searchQuery8, setSearchQuery8] = useState('');


  const [viewtest, setViewtest] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [expandedTest, setExpandedTest] = useState(null);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const [filteredRows, setFilteredRows] = useState([]);
  const urllink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const PageSize = 10;
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [file, setFile] = useState(null);

  console.log("Record---------->>>>", userRecord)

  const toast = useSelector((state) => state.userRecord?.toast);

  // Define status colors
  const statusColors = {
    captureSample: '#FFA500', // Yellow for Service_Status (Pending)
    labTechnician: '#1E90FF', // Orange for Analysis_Status (Pending)
    seniorTechnician: '#008000', // Blue for Verify_Status (Pending)
    pathologist: '#800080', // Purple for Approve_Status (Pending)
    completed: '#da1212ff', // Green for all completed
  };

  useEffect(() => {
    // const offset = page * PageSize;
    // const limit = PageSize;
    var department = []
    // const Access = (userRecord?.AccessTwo || "").split(",")
    let Access = []
    if (userRecord?.Emp_DepartmentName?.length === 0) {
      Access = userRecord?.Department;
    } else {
      Access = userRecord?.Emp_DepartmentName;
    }

    console.log(userRecord,"userrecord")


    if (Access?.includes("MRI")) {
      console.log("MRI")
      department.push("2");
    }
    if (Access?.includes("CT")) {
      console.log("CT")
      department.push("1");
    }
    if (Access?.includes("XRAY")) {
      console.log("XRAY")
      department.push("3");
    }
    if (Access?.includes("USG")) {
      console.log("USG")
      department.push("4");
    }
    // if (Access.includes("M13-7")) {
    //   console.log("Doctor")
    //   department = ["1", "2", "3", "4"]
    // }

    console.log("REsponce------------>>", department);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${urllink}Radiology/get_patienttestlist`, {
          params: {
            Location: userRecord?.location,
            patient_name: searchQuery,
            patientid: searchQuery1,
            barcode: searchQuery2,
            invoice: searchQuery3,
            departments: JSON.stringify(department),
            dateType: searchQuery4,
            date: searchQuery5,
            from: searchQuery6,
            to: searchQuery7,
            status: searchQuery8,
          },
        });
        const data = response.data;
        const sortedData = data.sort((a, b) => a.id - b.id);
        setFilteredRows(sortedData)

      } catch (error) {
        console.error('Error fetching data:', error);
        setFilteredRows([]);
        setTotalPages(0);
      }
    };
    fetchData();
  }, [urllink, userRecord, page, dispatchvalue, searchQuery, searchQuery1, searchQuery2, searchQuery3, searchQuery5, searchQuery6, searchQuery7, searchQuery8]);


  console.log("REsponce------------>>", filteredRows);


  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === 'name') setSearchQuery(value);
    else if (type === 'phone') setSearchQuery1(value);
    else if (type === 'barcode') setSearchQuery2(value);
    else if (type === 'invoice') setSearchQuery3(value);
    else if (type === "dateType") setSearchQuery4(value);
    else if (type === "date") setSearchQuery5(value);
    else if (type === "fromdate") setSearchQuery6(value);
    else if (type === "todate") setSearchQuery7(value);
    else if (type === "status") setSearchQuery8(value);
  };

  const handleBarcodeReprint = (params) => {
    console.log(params)
    dispatchvalue({ type: 'PrintBarcode', value: params })
    dispatchvalue({ type: "setActiveFolder", value: "BarcodePrint" });
  }

  const handleviewtest = (params) => {
    console.log("Params:", params);
    const testData = params?.Test_Names.map((test, index) => ({
      id: index,
      testname: test.Test_Name,
      subTests: test.SubTests || [],
    }));
    console.log("Test Data for Modal:", testData);
    setViewtest(testData);
    setExpandedTest(null);
    setOpenModal(true);
  };

  const toggleSubTests = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };


  const handleOpenPDF = (base64PDF) => {
    if (!base64PDF) {
      alert("No report available.");
      return;
    }

    // Remove prefix if exists
    let actualBase64 = base64PDF;
    if (actualBase64.startsWith("data:application/pdf;base64,")) {
      actualBase64 = actualBase64.split(",")[1];
    }

    // Convert base64 -> binary
    const byteCharacters = atob(actualBase64);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);

    // Create blob and open
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobURL = URL.createObjectURL(blob);
    const pdfWindow = window.open(blobURL);
    if (!pdfWindow) {
      alert("Popup blocked. Please allow popups for this site.");
    }
  };



  // const handlePress = (params) => {
  //   console.log("Params--------", params.row)
  //   const Access = userRecord.AccessTwo.split(",")
  //   console.log(typeof (Access))

  //   var page = ""

  //   if (params.row.Service_Status === "Pending") {
  //     if (['M13-5', 'M13-4', 'M13-3', 'M13-2'].some((code) => Access.includes(code))) {
  //       page = "ReportCapture"
  //     } else {
  //       const tdata = {
  //         message: "Report In Progress...",
  //         type: "warn",
  //       };
  //       dispatchvalue({ type: "toast", value: tdata });
  //     }
  //   } else if (params.row.Service_Status === "Analyzd") {
  //     if (Access.includes("M13-7")) {
  //       page = "ReportVerify"
  //     }
  //     else {
  //       const tdata = {
  //         message: "Report Not Verifyed...",
  //         type: "warn",
  //       };
  //       dispatchvalue({ type: "toast", value: tdata });

  //     }
  //   } else if (params.row.Service_Status === "Completed") {
  //     if (params.row.File) {
  //       handleOpenPDF(params.row.File)
  //     } else {
  //       page = ""
  //       dispatchvalue({ type: "setActiveFolder", value: "PrintPaper" });
  //       dispatchvalue({ type: "RadData", value: params.row });
  //     }
  //   }



  //   if (page !== "") {
  //     dispatchvalue({ type: "RadData", value: params.row });
  //     dispatchvalue({ type: "setPreviousFolder", value: "PatientList" });
  //     dispatchvalue({ type: "setActiveFolder", value: "NavigateRad" });
  //     dispatchvalue({ type: "activeTab", value: page });
  //   }


  // }

  const handlePress = (params) => {
    console.log("Params--------", params.row)
 
    if (params.row.Status === "Request") {
      const tdata = {
      message: "Billing not yet completed.",
      type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
     }
        const Access = userRecord.AccessTwo.split(",")
     console.log(typeof (Access))
 
     var page = ""
 
     if (params.row.Service_Status === "Pending") {
      if (['M13-5', 'M13-4', 'M13-3', 'M13-2'].some((code) => Access.includes(code))) {
        page = "ReportCapture"
      } else {
        const tdata = {
          message: "Report In Progress...",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
     } else if (params.row.Service_Status === "Analyzd") {
      if (Access.includes("M13-7")) {
        page = "ReportVerify"
      }
      else {
        const tdata = {
          message: "Report Not Verifyed...",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
 
      }
     } else if (params.row.Service_Status === "Completed") {
      if (params.row.File) {
        handleOpenPDF(params.row.File)
      } else {
        page = ""
        dispatchvalue({ type: "setActiveFolder", value: "PrintPaper" });
        dispatchvalue({ type: "RadData", value: params.row });
      }
    }
 
    if (page !== "") {
      dispatchvalue({ type: "RadData", value: params.row });
      dispatchvalue({ type: "setPreviousFolder", value: "PatientList" });
      dispatchvalue({ type: "setActiveFolder", value: "NavigateRad" });
      dispatchvalue({ type: "activeTab", value: page });
    }  
 
  }


  const getStatusColor = (row) => {
    console.log("color----------", row.Service_Status);

    if (row.Service_Status === "Pending") return statusColors.captureSample;
    if (row.Service_Status === "Analyzd") return statusColors.labTechnician;
    if (row.Service_Status === "Completed") return statusColors.seniorTechnician;
    return statusColors.completed;
  };


  const handleRestrictedAction = () => {
    alert("You do not have permission to perform this action.");
  };


  const handleSaveClick = (row) => {
    if (userRecord?.Delete) {
      handleDelete(row); // Proceed with form submission
    } else {
      handleRestrictedAction();// Show alert for unauthorized users
    }
  };






  const handleDelete = async (row) => {

    console.log(row.Radiology_RequestId,'rowwwwwwwwwwwwwwwww')
  const confirmDelete = window.confirm(
    `Are you sure you want to delete this record?\nPatient: ${row.Patient_Name}`
  );

  if (!confirmDelete) return;

  try {
    setLoading(true);

    const payload = {
      Radiology_RequestId: row.Radiology_RequestId,
      Canceledby: userRecord?.username || "system",
    }

    await axios.post(`${urllink}Radiology/delete_patienttest`, payload );

    dispatchvalue({
      type: "toast",
      value: { message: "Deleted successfully", type: "success" },
    });

    setFilteredRows(prev => prev.filter(r => r.id !== row.id));

  } catch (error) {
    dispatchvalue({
      type: "toast",
      value: { message: "Delete failed", type: "error" },
    });
  } finally {
    setLoading(false);
  }
 };


 const handleCriticalIntimation = async (row) => {

    console.log(row.Radiology_RequestId,'rowwwwwwwwwwwwwwwww')

    if (row.IsCritical){
      
    }

  const confirmDelete = window.confirm(
    `Are you sure you want to Notify Critical this record?\nPatient: ${row.Patient_Name}`
  );

  if (!confirmDelete) return;

  try {
    setLoading(true);

    const payload = {
      Radiology_RequestId: row.Radiology_RequestId,
      Canceledby: userRecord?.username || "system",
    }

    await axios.post(`${urllink}Radiology/Notify_Critical_patienttest`, payload );

    dispatchvalue({
      type: "toast",
      value: { message: "Notified successfully", type: "success" },
    });

    setFilteredRows(prev => prev.filter(r => r.id !== row.id));

  } catch (error) {
    dispatchvalue({
      type: "toast",
      value: { message: "Delete failed", type: "error" },
    });
  } finally {
    setLoading(false);
  }
 };





  const dynamicColumns = [
    { key: "id", name: "S.NO", width: 70, frozen: true },
    { key: "CreatedAt", name: "Date", width: 70, frozen: true },
    {
      key: "invoice",
      name: "Invoice",
      frozen: true,
      width: 140,
    },
    { key: "Patient_Id", name: "Patient Id", frozen: true, width: 70 },
    { key: "Visit_Id", name: "Visit ID", width: 70 },
    { key: "Patient_Name", name: "Patient Name", width: 90 },
    { key: "Age", name: "Age", width: 50 },
    { key: "Phone", name: "Phone No", width: 80 },
    { key: "subDepartment", name: "Department", width: 80 },
    {
      key: "TestName",
      name: "Test",
      width: 70,
    },
    {
      key: "Status",
      name: "Status",
      width: 100,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getStatusColor(params.row),
            color: '#fff',
            textAlign: 'center',
            padding: '4px',
            borderRadius: '4px',
            cursor: "pointer",
          }}
          onClick={() => handlePress(params)}
        >
          {params.row.Service_Status === "Pending" ? "In Technician" :
            params.row.Service_Status === "Analyzd" ? "In Radiologist" :
              params.row.Service_Status === "Completed" ? "In Dispatch" : "Somthing"}
        </div>
      ),
    },
    {
      key: "Delete",
      name: "Delete",
      width: 60,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleSaveClick(params.row)}
          title="Delete"
          disabled={params.row.Service_Status === "Completed"} // optional
        >
          <DeleteIcon sx={{ color: "#d32f2f" }} />
        </IconButton>
      ),
    },
    {
      key: "Critical Intimation",
      name: "Critical Intimation",
      width: 60,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleCriticalIntimation(params.row)}
          title="Delete"
          disabled={params.row.Service_Status === "Completed"} // optional
        >
          <ReportGmailerrorredIcon sx={{ color: "#d32f2f" }} />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="appointment">
      <ToastAlert Message={toast.message} Type={toast.type} />
      <div className="h_head">
        <h3>Patient Request List</h3>
      </div>
      <div className="con_1">
        <div className="inp_1">
          <label htmlFor="input">Patient Name :</label>
          <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e, 'name')} placeholder='Enter the Patient Name' />
        </div>
        <div className="inp_1">
          <label htmlFor="input">Patient ID :</label>
          <input type="text" value={searchQuery1} onChange={(e) => handleSearchChange(e, 'phone')} placeholder='Enter the Phone Number' />
        </div>
        <div className="inp_1">
          <label htmlFor="input">Phone</label>
          <input
            id="input"
            type="text"
            value={searchQuery2}
            onChange={(e) => handleSearchChange(e, 'barcode')}
            placeholder='Enter Barcode Number'
          />
        </div>
        <div className="inp_1">
          <label htmlFor="input">Invoice No</label>
          <input
            id="input"
            type="text"
            value={searchQuery3}
            onChange={(e) => handleSearchChange(e, 'invoice')}
            placeholder='Enter Invoice Number'
          />
        </div>
        <div className="inp_1" style={{ gap: "10px", }}>
          <select
            name="dateType"
            value={searchQuery4}
            onChange={(e) => handleSearchChange(e, "dateType")}
            style={{ width: "120px", }}
          >
            <option value={"currentdate"}>Date</option>
            <option value={"customdate"}>Custom Date</option>
          </select>

          {searchQuery4 === "currentdate" ?
            (
              <>
                <input
                  id="input"
                  type="date"
                  value={searchQuery5}
                  onChange={(e) => handleSearchChange(e, 'date')}
                  placeholder='Enter Invoice Number'
                />
              </>
            ) :
            (
              <div>
                <div style={{ display: "inline-block", }}>
                  <span style={{ display: "inline-block", width: "40px", color: "black", fontSize: "13px", fontWeight: "bold" }}>From </span>
                  <input
                    id="input"
                    type="date"
                    value={searchQuery6}
                    onChange={(e) => handleSearchChange(e, 'fromdate')}
                    placeholder='From Date'
                  />
                </div>
                <div style={{ display: "inline-block", }}>
                  <span style={{ display: "inline-block", width: "40px", color: "black", fontSize: "13px", fontWeight: "bold" }}> To </span>
                  <input
                    id="input"
                    type="date"
                    value={searchQuery7}
                    onChange={(e) => handleSearchChange(e, 'todate')}
                    placeholder='To Date'
                  />
                </div>
              </div>)
          }

        </div>




        <div className="inp_1">
          <label htmlFor="input">Status</label>
          <select
            value={searchQuery8}
            onChange={(e) => handleSearchChange(e, "status")}
            style={{ width: "165px", }}
          >
            <option value={""}>ALL</option>
            <option value={"Pending"}>Pending</option>
            <option value={"Analyzd"}>Analyzd</option>
            <option value={"Completed"}>Completed</option>

          </select>
        </div>


      </div>

      <div className='grid_1'>
        <ReactGrid columns={dynamicColumns} RowData={filteredRows} />
      </div>

      {loading && (
        <div className="spinner-overlay">
          <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
          </div>
        </div>
      )}

    </div>

  );
};

export default RadPatienttestlist;
