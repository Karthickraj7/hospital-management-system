// import * as React from "react";
// import { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { useNavigate } from "react-router-dom";
// import Button from "@mui/material/Button";
// // import "./PatientQueueList.css";
// import "./OtQuelist.css";

// // import "../OPD_Reception/op_patients.css";
// import SearchIcon from "@mui/icons-material/Search";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import axios from "axios";
// import { useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import SingleBedIcon from "@mui/icons-material/SingleBed";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
// import EditIcon from "@mui/icons-material/Edit";
// import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
// import PendingIcon from "@mui/icons-material/Pending";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import UpdateIcon from "@mui/icons-material/Update";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
// } from "@mui/material";
// import OTGoogleStyleCalendar from "./OTCalendar/OTGoogleStyleCalendar";
// import Diversity1Icon from "@mui/icons-material/Diversity1";



// const theme = createTheme({
//   components: {
//     MuiDataGrid: {
//       styleOverrides: {
//         columnHeader: {
//           backgroundColor: "var(--ProjectColor)",
//           textAlign: "Center",
//         },
//         root: {
//           "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer":
//             {
//               textAlign: "center",
//               display: "flex !important",
//               justifyContent: "center !important",
//             },
//           "& .MuiDataGrid-window": {
//             overflow: "hidden !important",
//           },
//         },
//         cell: {
//           borderTop: "0px !important",
//           borderBottom: "1px solid  var(--ProjectColor) !important",
//           display: "flex",
//           justifyContent: "center",
//         },
//       },
//     },
//   },
// });

// const OtQuelist = () => {
//   const dispatchvalue = useDispatch();
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [PatientRegisterData, setPatientRegisterData] = useState("");
//   const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const [otData, setOtData] = useState([]);
//   const [otData1, setOtData1] = useState([]);

//   const navigate = useNavigate();
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const [rows, setRows] = useState([]);
//   const [ApprovedDate, setApprovedDate] = useState("");
//   const [Approvedtime, setApprovedtime] = useState("");
//   // const [filteredRows,setFilteredRows]=useState([]);
//   const [Doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setselectedDoctor] = useState("all");
//   const [Location, setLocation] = useState([]);
//   const [selectedLocation, setselectedLocation] = useState("all");
//   const [Building, setBuilding] = useState([]);
//   const [selectedBuilding, setselectedBuilding] = useState("all");
//   const [Block, setBlock] = useState([]);
//   const [selectedBlock, setselectedBlock] = useState("all");
//   const [Floor, setFloor] = useState([]);
//   const [selectedFloor, setselectedFloor] = useState("all");
//   const [page, setPage] = useState(0);
//   const pageSize = 10;
//   const showdown = rows.length;
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [PatientFirstName, setPatientFirstName] = useState("");
//   const [PatientPhoneNo, setPatientPhoneNo] = useState("");
//   const [columns, setcolumn] = useState([]);
// const [Theatrerequestdata, setTheatrerequestdata] = useState([]);

// // const [Theatrerequestdata, setTheatrerequestdata] = useState(() => {
// //   const samplePatients = [
// //     "Mr. SIVAN",
// //     "Mr. ANANDHAKRISHNAN",
// //     "Mr. KRISHNANKUTTY",
// //     "Mrs. VASANTHAKUMARI",
// //     "Mr. AKASH M",
// //     "Mr. BASHEER",
// //     "Mrs. SUBAIDHA",
// //     "Mrs. PREMA",
// //     "Mr. RAJESH",
// //     "Mrs. DEVI",
// //   ];

// //   const sampleProcedures = [
// //     "CATARACT SURGERY",
// //     "APPENDECTOMY",
// //     "HERNIA REPAIR",
// //     "TONSILLECTOMY",
// //     "TOTAL KNEE REPLACEMENT",
// //     "HYSTERECTOMY",
// //     "CHOLECYSTECTOMY",
// //     "CORTICAL MASTOIDECTOMY",
// //     "TYMPANOPLASTY",
// //     "HYDROCELE REPAIR",
// //   ];

// //   const sampleDoctors = ["DR.SWAMINATHAN", "DR.DIBIN", "DR.SUKANYA","DR.SALEEM","DR.VAISHNAVI","DR.MALLIKESHWARA"];

// //   const priorities = ["Low", "Medium", "High"];
// //   const statusList = ["Confirmed", "Requested", "Pending"];

// //   const arr = [];
// //   for (let i = 0; i < 1357; i++) {
// //     arr.push({
// //       Sno: i + 1,
// //       PatientName: samplePatients[i % samplePatients.length],
// //       SurgeryName: i % 2 === 0 ? "Major" : "Minor",
// //       ProcedureName: sampleProcedures[i % sampleProcedures.length],
// //       ReqDate: "2025-10-14",
// //       ReqTime: `${String(8 + (i % 12)).padStart(2, "0")}:${String((i * 5) % 60).padStart(2, "0")}:00`,
// //       DoctorName: sampleDoctors[i % sampleDoctors.length],
// //       bookingdate: "2025-10-14",
// //       BookingTime: `${String(9 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00`,
// //       BookingType: "IP",
// //       Status: statusList[i % statusList.length],
// //       OperationType: i % 2 === 0 ? "SURGERY" : "PROCEDURE",
// //       Priority: priorities[i % priorities.length],
// //     });
// //   }
// //   return arr;
// // });

//   const OtQuelist = JSON.parse(localStorage.getItem("OtQuelist")) || [];
//   const [openCancelModal, setOpenCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");
//   const [ResheduleReason,setResheduleReason] = useState("");
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [confirmData, setConfirmData] = useState("");

//   const [locationData, setLocationData] = useState([]);
//   const [buildingName, setBuildingName] = useState([]);
//   const [blockName, setBlockName] = useState([]);
//   const [floorData, setFloorData] = useState([]);
//   const [Ward_by_floor, setWard_by_floor] = useState([]);
//   const [RoomdataColumns, setRoomdataColumns] = useState([]);
//   const [otMasterData, setOtMasterData] = useState([]);

//   const [rescheduledata,setrescheduledata] = useState([]);
  
//   const [chosenid,setchosenid] = useState("");
//   const [Resid,setResid] = useState("");
//   const [load,setload] = useState(false);

//   const [modalContent, setModalContent] = useState("");
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [openModal2, setOpenModal2] = useState(false);
//   const [openModal3, setOpenModal3] = useState(false);

//   const [Roomdata, setRoomdata] = useState({
//     Building: "",
//     Block: "",
//     Floor: "",
//     Ward: "",
//   });
//   console.log(Roomdata, "Roomdata");

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleCalenderView = () => {
//     navigate("/Home/OT_Calender");
//   };

//   const [otMaster, setOtMaster] = useState({
//     Location: "",
//     Building: "",
//     Block: "",
//     FloorName: "",
//   });

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Masters/Location_Detials_link`)
//       .then((res) => setLocationData(res.data))
//       .catch((err) => console.log(err));
//   }, [UrlLink]);

//   useEffect(() => {
//     axios
//       .get(
//         `${UrlLink}Masters/get_Floor_Data_by_Building_block_loc?Block=${otMaster.Block}`
//       )
//       .then((res) => setFloorData(res.data))
//       .catch((err) => console.log(err));
//   }, [UrlLink, otMaster.Block]);

//   useEffect(() => {
//     axios
//       .get(
//         `${UrlLink}Masters/get_building_Data_by_location?Location=${otMaster.Location}`
//       )
//       .then((res) => setBuildingName(res.data))
//       .catch((err) => console.log(err));
//   }, [UrlLink, otMaster.Location]);

//   useEffect(() => {
//     axios
//       .get(
//         `${UrlLink}Masters/get_block_Data_by_Building?Building=${otMaster.Building}`
//       )
//       .then((res) => setBlockName(res.data))
//       .catch((err) => console.log(err));
//   }, [UrlLink, otMaster.Building]);

//   useEffect(() => {
//     console.log(Roomdata.Building, "Roomdata.Building");
//     const data = {
//       location: userRecord?.location,
//       Floor: otMaster.FloorName,
//     };
//     axios
//       .get(`${UrlLink}OT/room_filter_by_floor`, { params: data })
//       .then((response) => {
//         const data = response.data;
//         console.log(data, "datadatadata");
//         setWard_by_floor(data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [otMaster.FloorName]);

//   // useEffect(() => {
//   //   console.log(Roomdata.Building, "Roomdata.Building");
//   //   const data = {
//   //     location: userRecord?.location,
//   //     Floor: Roomdata.Floor,
//   //   };

//   // //   axios
//   // //     .get(`${UrlLink}Masters/get_bed_details_by_ward`, { params: data })
//   // //     .then((response) => {
//   // //       const data = response.data;
//   // //       setWard_by_floor(data);
//   // //     })
//   // //     .catch((error) => {
//   // //       console.log(error);
//   // //     });
//   // // }, [Roomdata.Floor]);

//   const handleInputChange = (e) => {
//     const { name, type, value, checked, options, multiple } = e.target;

//     setOtMaster((prevState) => ({
//       ...prevState,
//       [name]: multiple
//         ? Array.from(options)
//             .filter((option) => option.selected)
//             .map((option) => option.value)
//         : type === "checkbox"
//         ? checked
//         : value,
//     }));
//     if (name === "Building") {
//       setRoomdata((prev) => ({
//         ...prev,
//         [name]: value,
//         Block: "",
//         Floor: "",
//         Ward: "",
//       }));
//     } else if (name === "Block") {
//       setRoomdata((prev) => ({
//         ...prev,
//         [name]: value,
//         Floor: "",
//         Ward: "",
//       }));
//     } else if (name === "Floor") {
//       setRoomdata((prev) => ({
//         ...prev,
//         [name]: value,
//         Ward: "",
//       }));
//       setWard_by_floor([]);
//       setRoomdataColumns([]);
//     }
//   };

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}OT/Theatre_booking_request_details?PhoneNo=${PatientPhoneNo}&Fname=${PatientFirstName}`)
//       .then((res) => setTheatrerequestdata(res.data))
//       .catch((err) => console.log(err));
//   }, [UrlLink,load,PatientPhoneNo,PatientFirstName]);

//   React.useEffect(() => {
//     fetchOtRequestData();
//   }, []);

//   const fetchOtRequestData = () => {
//     axios
//       .get("http://127.0.0.1:8000/ipregistration/get_Ot_Request")
//       .then((response) => {
//         const data = response.data;
//         console.log("orrequestdata", data);

//         setOtData([
//           ...data.map((row, index) => ({
//             id: index + 1,
//             ...row,
//           })),
//         ]);
//       })
//       .catch((error) => {
//         console.log("error fetching otrequest data:", error);
//       });
//   };

//   const handleotbookingrequest = (params) => {
//     console.log(params);
//     console.log(params.BookingType);

//     if(params.BookingType == 'OP'){

//       dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });
//       navigate("/Home/OTManagement");
//       dispatchvalue({ type: "HrFolder", value: "Op_otrequest" });
//       dispatchvalue({ type: "setPreviousFolder", value: null });
//       dispatchvalue({ type: "showMenu", value: true });

//       // navigate("/Op_otrequest", { state: { params, Editoption: true }  });
//     }

//     else if(params.BookingType == 'IP'){
//       dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });

//       navigate("/Home/OTManagement");
//       dispatchvalue({ type: "HrFolder", value: "Ip_ot_request" });
//       dispatchvalue({ type: "setPreviousFolder", value: null });
//       dispatchvalue({ type: "showMenu", value: true });
//     }

//     else if(params.BookingType == 'EMERGENCY'){

//       dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });


//       navigate("/Home/OTManagement");
//       dispatchvalue({ type: "HrFolder", value: "New_theater_booking" });
//       dispatchvalue({ type: "setPreviousFolder", value: null });
//       dispatchvalue({ type: "showMenu", value: true });
//       // navigate("/New_theater_booking", { state: { params, Editoption: true }  });
//     }

    
    
//   };


//   const [SearchCasualityParams, setSearchCasualityParams] = useState({
//     query: "",
//     status: "Confirm",
//     type: "Casuality",
//   });

//   const handleClickConfirm = (params) => {
//     console.log(params,'PARAMS');

//     const data = {
//       ...params,
//       Booking_Id : params.Booking_Id,
//       Status : 'Confirmed',
//       'Statusedit' : true,
      

//     };

//     console.log(data);
//     axios.post(`${UrlLink}OT/Theatre_booking_request_details`, data)
//     .then((res) => {
    
//      const response = res.data;
//                  const messageType = Object.keys(response)[0];
//                  const messageContent = Object.values(response)[0];
//                  console.log(messageType);
//                  console.log(messageContent);
//                  dispatchvalue({
//                      type: 'toast',
//                      value: { message: messageContent, type: messageType },
//                  });
//                  setload((prev)=>!prev);
//                })
//     .catch((err) => console.log(err));





//     navigate('/SurgicalTeam', { state: { params } });
//   }
//   const handleRescheduleClick = (params) => {

//     console.log(params,'PARAMSMSSSSSSSSSSS');
//     setrescheduledata(params);
//     setOpenModal2(true);
    
    
//   };

//   const [openDialog, setOpenDialog] = useState(false);
//   const [cancelText, setCancelText] = useState("");

//   const handleIconCancelClick = (id) => {

//     console.log(id);
//     setchosenid(id);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleSaveCancelText = () => {
//     const data = {
//    'Booking_Id' : chosenid,
//    'Status' : 'Canceled',
//    'Statusedit' : true,
//    'Reason' : cancelReason
//  };

//  console.log(data);

//  axios.post(`${UrlLink}OT/Theatre_booking_request_details`, data)
// .then((res) => {

//  const response = res.data;
//              const messageType = Object.keys(response)[0];
//              const messageContent = Object.values(response)[0];
//              console.log(messageType);
//              console.log(messageContent);
//              dispatchvalue({
//                  type: 'toast',
//                  value: { message: messageContent, type: messageType },
//              });
//              setload((prev)=>!prev);
//            })
// .catch((err) => console.log(err));
 
//  console.log("Cancel Text:", cancelText);
//  setOpenDialog(false);
// };

// const handleressave = () => {

//   const params = {
//     ...rescheduledata,
//     Status : 'Reschedule',
//     'Statusedit' : true,
//     'Reason' : ResheduleReason
//   };
//   console.log(params,'finalllll');


//   if(params.BookingType == 'OP'){

//     // navigate("/Op_otrequest", { state: { params }  });

//       dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });

//       navigate("/Home/OTManagement");
//       dispatchvalue({ type: "HrFolder", value: "Op_otrequest" });
//       dispatchvalue({ type: "setPreviousFolder", value: null });
//       dispatchvalue({ type: "showMenu", value: true });
//   }

//   else if(params.BookingType == 'IP'){

//       dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });

//       navigate("/Home/OTManagement");
//       dispatchvalue({ type: "HrFolder", value: "Ip_ot_request" });
//       dispatchvalue({ type: "setPreviousFolder", value: null });
//       dispatchvalue({ type: "showMenu", value: true });
//     // navigate("/Ip_otrequest", { state: { params }  });
//   }

//   else if(params.BookingType == 'EMERGENCY'){

//     dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });

//       navigate("/Home/OTManagement");
//       dispatchvalue({ type: "HrFolder", value: "New_theater_booking" });
//       dispatchvalue({ type: "setPreviousFolder", value: null });
//       dispatchvalue({ type: "showMenu", value: true });
//     // navigate("/New_theater_booking", { state: { params }  });
//   }

// };


//   const handleNavigateOTTheater = (params) => {
//     dispatchvalue({ type: "submissionData", value: params.row });
//     navigate("/Home/OT-Management");
//   };

//   const coloumnss = [
//     { key: "Sno", headerName: "S.no", width: 100 },

//     // { key: "Booking_Id", headerName: "Booking Id", width: 100 },
//     { key: "PatientName", headerName: "Patient_Name", width: 100,
//       renderCell: (params) => {
//       let bgColor;
//       if (params.row.Status === "Requested") {
//           bgColor = "#e3ff7e"; // Background color for Inprogress
//       }  else if (params.row.Status === "Canceled") {
//           bgColor = "#f55e5e";
//       }
//       else if (params.row.Status === "Reschedule") {
//           bgColor = "#c794dffd";
//       }
//       else if (params.row.Status === "Confirmed") {
//         bgColor = "#6225e6";
//       }
//       else if (params.row.Status === "Completed") {
//           bgColor = "#88e76cfd";
//       }
//       else if (params.row.Status === "ByDoctor") {
//         bgColor = "#86FCDD";
//      }
//       else {
//           bgColor = "transparent"; // Default background color
//       }

//       return (
//           <div
//               style={{
//                   backgroundColor: bgColor,
//                   width: "100%",
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "black", // Adjust text color for visibility
//                   padding: "4px",
//                   borderRadius: "4px",
//                   fontWeight: "bold"
//               }}
//           >
//               {params.row.PatientName}
//           </div>
//       );
//   }
//     }, 


//     { key: "SurgeryName", headerName: "Surgery Name", width: 130 },
//     { key: "ProcedureName", headerName: "Procedure Name", width: 130 },

//     //{ key: "Surgeon_Name", headerName: "Surgeon Name", width: 130 },
//     { key: "ReqDate", headerName: "Requested Date", width: 140 },
//     { key: "ReqTime", headerName: "Requested Time", width: 140 },
//     { key: "DoctorName", headerName: "Physician Name", width: 140 },
//     { key: "bookingdate", headerName: "Booking Date", width: 150 },
//     { key: "BookingTime", headerName: "Booking Time", width: 150 },
//     { key: "BookingType", headerName: "Booking Type", width: 150 },
//     { key: "Status", headerName: "Status", width: 150 },
//     { key: "OperationType", headerName: "OperationType", width: 150 },
//     { key: "Priority", headerName: "Priority", width: 150 },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <Button onClick={() => handleotbookingrequest(params.row)}
//         disabled={
//                params.row.Status === 'Confirmed' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                 }
//         style={{
//                   opacity:
//                   params.row.Status === 'Confirmed' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? 0.5
//                       : 1,
//                   cursor:
//                      params.row.Status === 'Confirmed' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? "not-allowed"
//                       : "pointer",
//                   // backgroundColor:
//                   //    params.row.Status === 'InProgress' || params.row.Status === 'CheckOut' ||  params.row.Status === 'Cancelled'
//                   //     ? "#ccc"
//                   //     : "#e3ff7e",
//                 }}>
//           <EditIcon />
//         </Button>
//       ),
//     },
//     {
//       field: "Status",
//       headerName: "Status",

//       renderCell: (params) => (
//         <>
//           <div className="actionv" style={{ gap: "5px" }}>
//             <Button
//               className="cell_btn"
//               title="Pending"
//               onClick={() => handleColorChange(params.row.id, "Pending")}
//               disabled={
//                params.row.Status === 'Confirmed' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                 }
//                style={{
//                   opacity:
//                   params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? 0.5
//                       : 1,
//                   cursor:
//                      params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? "not-allowed"
//                       : "pointer",
//                       backgroundColor:
//                      params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? "#ccc"
//                       : "#e3ff7e",
                  
//                 }}
//             >
//               <PendingIcon />
//             </Button>
//             <Button
//               className="cell_btn"
//               title="Confirm"
//               onClick={() => handleClickConfirm(params.row, "Confirm")}
//               disabled={
//                  params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                 }
//               style={{
//                   opacity:
//                   params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? 0.5
//                       : 1,
//                   cursor:
//                      params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? "not-allowed"
//                       : "pointer",
//                   backgroundColor:
//                      params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? "#ccc"
//                       : "#6225e6",
//                 }}
//             >
//               <CheckCircleIcon />
//             </Button>
//           </div>
//         </>
//       ),
//     },
//     {
//       field: "Action",
//       headerName: "Action",

//       renderCell: (params) => (
//         <div className="actionv">
//           <Button
//             className="cell_btn"
//             title="Cancel"
//             onClick={() => handleIconCancelClick(params.row.Booking_Id, "Cancel")}
//             disabled={
//                params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                 }
//             style={{
//                   opacity:
//                   params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? 0.5
//                       : 1,
//                   cursor:
//                      params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? "not-allowed"
//                       : "pointer",
//                   backgroundColor:
//                      params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? "#ccc"
//                       : "#f55e5e",
//                 }}
//           >
//             <CancelIcon className="check_box_clrr_cancell" />
//           </Button>
//           <Button
//             className="cell_btn"
//             title="Reshedule"
//             onClick={() => handleRescheduleClick(params.row, "Reshedule")}
//                 disabled={
//                 params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                 }
//             style={{
//                   opacity:
//                   params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? 0.5
//                       : 1,
//                   cursor:
//                      params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? "not-allowed"
//                       : "pointer",
//                   backgroundColor:
//                      params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
//                       ? "#ccc"
//                       : "#c794dffd",
//                 }}
//           >
//             <UpdateIcon className="check_box_clrr_cancell" />
//           </Button>

//           <Dialog open={openDialog} onClose={handleCloseDialog}>
//             <DialogTitle>Cancel Request</DialogTitle>
//             <DialogContent>
//             <TextField 
//               name = 'Reason'
//               style={{ width: "500px", height: "80px" }}
//               multiline
//               row={25}
//               onChange={(e) => setCancelReason(e.target.value)}
//                />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseDialog} color="primary">
//                 Close
//               </Button>
//               <Button onClick={handleSaveCancelText} color="primary">
//                 Save
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </div>
//       ),
//     },
//   ];

//   const handlePageChange = (params) => {
//     setPage(params.page);
//   };

//   const openModal1 = (content) => {
//     setModalContent(content);
//     setModalIsOpen(true);
//     setOpenModal3(true);
//   };

//   const handleColorChange = (id, color, status) => {
//     setOtData((prevRows) =>
//       prevRows.map((row) =>
//         row.id === id ? { ...row, Status: status, bgColour: color } : row
//       )
//     );
//     const updatedData = {
//       id,
//       Status: status,
//     };
//     axios
//       .post(
//         `http://127.0.0.1:8000/ipregistration/update_Ot_Queuelist`,
//         updatedData
//       )
//       .then((response) => {
//         console.log("Status updated successfully:", response.data);
//       })
//       .catch((error) => {
//         console.log("Error updating status:", error);
//       });
//   };

//   const handleCancelClick = (params) => {
//     setSelectedRow(params.row);
//     setOpenCancelModal(true);
//   };


//   const handleSubmitCancelReason = () => {
//     if (cancelReason) {
//       setOtData((prevRows) =>
//         prevRows.map((row) =>
//           row.id === selectedRow.id
//             ? { ...row, Status: "Cancelled", cancelReason }
//             : row
//         )
//       );
//       setOpenCancelModal(false);
//     }
//   };
//   const totalPages = Math.ceil(rows.length / 10);

//   return (
//     <>
//       <div className="appointment">
//         <div className="h_head neww_1">
//           <h3>Operation Theatre Queue List</h3>

//           <div className="doctor_select_1 selt-dctr-nse form-row-inline"></div>
//           <div className="Main_container_app">
//             <h4>
//               OT Quelist{" "}
//               <div
//                 style={{
//                   float: "right",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 ICU/CCU Available
//                 <SingleBedIcon sx={{ fontSize: 35 }} onClick={openModal} />
//               </div>
//               <div
//                 style={{
//                   float: "right",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 OT Calendar
//                 <div style={{ float: "right" }}>
                          
//                           <FontAwesomeIcon icon={faCalendarDays} onClick={() => openModal1("calendar")} className="cal_icon" />
//                 </div>
                
//               </div>
//             </h4>
//             <br />

//             {isModalOpen && (
//               <div
//                 className="modal"
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   zIndex: 9999,
//                 }}
//               >
//                 <div
//                   className="modal-content"
//                   style={{
//                     backgroundColor: "white",
//                     padding: "20px",
//                     borderRadius: "10px",
//                     width: "100%",
//                     height: "70%",
//                     maxWidth: "1000px",
//                     maxHeight: "700px",
//                   }}
//                 >
//                   <span className="close-btn" onClick={closeModal}>
//                     &times;
//                   </span>
//                   <div className="RegisFormcon_1">
//                     <div className="RegisForm_1">
//                       <label>
//                         Location<span>:</span>
//                       </label>
//                       {console.log(otMaster, "otMaster")}
//                       <select
//                         name="Location"
//                         value={otMaster.Location}
//                         onChange={handleInputChange}
//                         required
//                       >
//                         <option value="">Select</option>
//                         {locationData.map((loc, index) => (
//                           <option key={index} value={loc.id}>
//                             {loc.locationName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="RegisForm_1">
//                       <label>
//                         Building<span>:</span>
//                       </label>
//                       <select
//                         name="Building"
//                         value={otMaster.Building}
//                         onChange={handleInputChange}
//                         required
//                       >
//                         <option value="">Select</option>
//                         {Array.isArray(buildingName) &&
//                           buildingName.map((building, index) => (
//                             <option key={index} value={building.id}>
//                               {building.BuildingName}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                     <div className="RegisForm_1">
//                       <label>
//                         Block<span>:</span>
//                       </label>
//                       <select
//                         name="Block"
//                         value={otMaster.Block}
//                         onChange={handleInputChange}
//                         required
//                       >
//                         <option value="">Select</option>
//                         {Array.isArray(blockName) &&
//                           blockName.map((block, index) => (
//                             <option key={index} value={block.id}>
//                               {block.BlockName}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                     <div className="RegisForm_1">
//                       <label>
//                         Floor Name<span>:</span>
//                       </label>
//                       <select
//                         name="FloorName"
//                         value={otMaster.FloorName}
//                         onChange={handleInputChange}
//                         required
//                       >
//                         <option value="">Select</option>
//                         {Array.isArray(floorData) &&
//                           floorData.map((floor, index) => (
//                             <option key={index} value={floor.id}>
//                               {floor.FloorName}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                   </div>
//                   <div className="Selected-table-container">
//                     <table className="selected-medicine-table2">
//                       <thead>
//                         <tr>
//                           <th>Ward Name</th>
//                           <th>Room No</th>
//                           <th>Beds</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//   {Array.isArray(Ward_by_floor) &&
//     Ward_by_floor.map((room, index) => (
//       <tr key={index}>
//         <td>{room.Ward_Name}</td>
//         <td>{room.RoomNo || "-"}</td>
//         <td>
//           {room.beds.map((bed, idx) => (
//             <span
//               key={idx}
//               style={{
//                 display: "inline-block",
//                 backgroundColor: "#8EFF8E", // assuming all are available since status is not given
//                 color: "black",
//                 borderRadius: "50%",
//                 width: "20px",
//                 height: "20px",
//                 textAlign: "center",
//                 margin: "2px",
//                 lineHeight: "20px",
//               }}
//             >
//               {bed}
//             </span>
//           ))}
//         </td>
//       </tr>
//     ))}
// </tbody>

//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <form>
//           <div className="con_1 ">
//             <div className="action_color_block">
//               <span style={{ backgroundColor: "#e3ff7e" }}>Requested </span>
//               <span style={{ backgroundColor: "#6225e6" }}>Confirmed </span>
//               <span style={{ backgroundColor: "#f55e5e" }}>Cancel</span>
//               <span style={{ backgroundColor: "#c794dffd" }}>Reshedule</span>
//               <span style={{ backgroundColor: "#88e76cfd" }}>Completed </span>
          
              
//             </div>

//             <div className="inp_1">
//               <label htmlFor="input">First Name :</label>
//               <input
//                 type="text"
//                 id="FirstName"
//                 value={PatientFirstName}
//                 onChange={(e) => setPatientFirstName(e.target.value)}
//                 placeholder="Enter the First Name"
//               />
//             </div>
//             <div className="inp_1">
//               <label htmlFor="input">Phone No :</label>
//               <input
//                 type="text"
//                 id="PhoneNo"
//                 value={PatientPhoneNo}
//                 onChange={(e) => setPatientPhoneNo(e.target.value)}
//                 placeholder="Enter the Phone No"
//               />
//             </div>
//             <button className="btn_1" type="submit">
//               <SearchIcon />
//             </button>
//           </div>
//         </form>

//         {openModal2 && (
//         <div
//           className="sideopen_showcamera_profile"
//           onClick={() => setOpenModal2(false)}
//         >
//           <div
//             className="newwProfiles newwPopupforreason"
//             onClick={(e) => e.stopPropagation()}
//           >
//              <label>
//             Reason <span>:</span>
//           </label>
//           <input
//             id="Reason"
//             name="Reason"
//             value={ResheduleReason}
//             onChange={(e) => setResheduleReason(e.target.value)}
           
//           />
//             <br />
//             <div className="Main_container_Btn">
//             <button
//                onClick={handleressave} // Close the grid
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setOpenModal2(false)} // Close the grid
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//         {/* <ThemeProvider theme={theme}>
//           <div className=" grid_1">
//             <DataGrid
//               rows={rows.slice(page * pageSize, (page + 1) * pageSize)}
//               columns={columns}
//               pageSize={100}
//               initialState={{
//                 pagination: {
//                   paginationModel: {
//                     pageSize: 10,
//                   },
//                 },
//               }}
//               pageSizeOptions={[10]}
//               onPageChange={handlePageChange}
//               hideFooterPagination
//               hideFooterSelectedRowCount
//               className=" data_grid"
//             />
//             {showdown > 0 && rows.length > 10 && (
//               <div className="grid_foot">
//                 <button
//                   onClick={() =>
//                     setPage((prevPage) => Math.max(prevPage - 1, 0))
//                   }
//                   disabled={page === 0}
//                 >
//                   Previous
//                 </button>
//                 Page {page + 1} of {totalPages}
//                 <button
//                   onClick={() =>
//                     setPage((prevPage) =>
//                       Math.min(prevPage + 1, totalPages - 1)
//                     )
//                   }
//                   disabled={page === totalPages - 1}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </ThemeProvider> */}

//         {/* <ThemeProvider theme={theme}>
//           <div className="IP_grid_1">
//             <DataGrid
//               rows={otData.slice(page * pageSize, (page + 1) * pageSize)}
//               pageSize={10}
//               columns={coloumnss} // You need to define your dynamic columns here
//               onPageChange={handlePageChange}
//               hideFooterPagination
//               hideFooterSelectedRowCount
//               className="Ip_data_grid"
//             />
//             {showdown > 0 && otData.length > 10 && (
//               <div className="IP_grid_foot">
//                 <button
//                   onClick={() =>
//                     setPage((prevPage) => Math.max(prevPage - 1, 0))
//                   }
//                   disabled={page === 0}
//                 >
//                   Previous
//                 </button>
//                 Page {page + 1} of {totalPages}
//                 <button
//                   onClick={() =>
//                     setPage((prevPage) =>
//                       Math.min(prevPage + 1, totalPages - 1)
//                     )
//                   }
//                   disabled={page === totalPages - 1}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </ThemeProvider>

//         {rows.length === 0 && (
//           <div className="norecords">
//             <span>No Records Found</span>
//           </div>
//         )}
//       </div>
//       {openModal && (
//         <div
//           className={
//             isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
//           }
//           onClick={() => {
//             setOpenModal(false);
//           }}
//         >
//           <div
//             className="newwProfiles newwPopupforreason"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="RegisFormcon leavecon">
//               <div className="RegisForm_1 leaveform_1">
//                 <label htmlFor="bookingid">
//                   Booking ID<span>:</span>
//                 </label>
//                 <input
//                   type="input"
//                   name="bookingid"
//                   value={otData1.Booking_Id}
//                   readOnly
//                 />
//               </div>
//             </div>
//             <div className="RegisFormcon leavecon">
//               <div className="RegisForm_1 leaveform_1">
//                 <label htmlFor="ApprovedDate">
//                   Approved Date<span>:</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="Approveddate"
//                   value={ApprovedDate}
//                   onChange={(e) => {
//                     setApprovedDate(e.target.value);
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="RegisFormcon leavecon">
//               <div className="RegisForm_1 leaveform_1">
//                 <label htmlFor="Approvedtime">
//                   Approved Time<span>:</span>
//                 </label>
//                 <input
//                   type="time"
//                   name="Approvedtime"
//                   value={Approvedtime}
//                   onChange={(e) => {
//                     setApprovedtime(e.target.value);
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="Register_btn_con regster_btn_contsai">
//               <button
//                 className="RegisterForm_1_btns"
//                 onClick={handleSubmission}
//               >
//                 Submit
//               </button>
//               <button
//                 className="RegisterForm_1_btns"
//                 onClick={() => setOpenModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}

//                     <div className="DivCenter_container">OT List</div>
//                     <div><b>Monthly</b></div>
// <div className="con_1 ">

                      
//                       <div className="chart_body_1_child_1 dww3" st style={{ cursor: "pointer" }}>
//                           <div className="chart_body_1_child_1_body">
//                           <div className="chart_body_1_child_1_body_icon">
//                               <Diversity1Icon />
//                           </div>
//                           <div className="chart_body_1_child_1_body_count">
//                               {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                               {/* <h3>50</h3> */}
//                               <h2>{'62'}</h2>
//                           </div>
//                           <div className="chart_body_1_child_1_body_name">
//                              Total Surgery
//                           </div>
//                           </div>
//                       </div>
//                       <div className="chart_body_1_child_1 dww3"  style={{ cursor: "pointer" }}>
//                           <div className="chart_body_1_child_1_body">
//                           <div className="chart_body_1_child_1_body_icon">
//                               <Diversity1Icon />
//                           </div>
//                           <div className="chart_body_1_child_1_body_count">
//                               {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                               {/* <h3>50</h3> */}
//                               <h2>{'28'}</h2>
//                           </div>
//                           <div className="chart_body_1_child_1_body_name">
//                               Major Surgery
//                           </div>
//                           </div>
//                       </div>
//                       <div className="chart_body_1_child_1 dww3"  style={{ cursor: "pointer" }}>
//                           <div className="chart_body_1_child_1_body">
//                           <div className="chart_body_1_child_1_body_icon">
//                               <Diversity1Icon />
//                           </div>
//                           <div className="chart_body_1_child_1_body_count">
//                               {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                               {/* <h3>50</h3> */}
//                               <h2>{34}</h2>
//                           </div>
//                           <div className="chart_body_1_child_1_body_name">
//                               Minor Surgery
//                           </div>
//                           </div>
//                       </div>

// </div>

        




//       <div className='RegisFormcon_1 jjxjx_'>
//         <ReactGrid columns={coloumnss} RowData={Theatrerequestdata} />
//       </div>

//       {openModal3 && (
//         <div
//           className={
//             isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
//           }
//           onClick={() => {
//             setOpenModal3(false);
//           }}
//         >
//           <div
//             className="newwProfiles newwPopupforreason"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <OTGoogleStyleCalendar />
//           </div>
//         </div>
//       )}

      


//         <ToastAlert Message={toast.message} Type={toast.type} />
//       </div>
//     </>
//   );
// };

// export default OtQuelist;







import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
// import "./PatientQueueList.css";
import "./OtQuelist.css";

// import "../OPD_Reception/op_patients.css";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import OTGoogleStyleCalendar from "./OTCalendar/OTGoogleStyleCalendar";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';


const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: "Center",
        },
        root: {
          "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer":
            {
              textAlign: "center",
              display: "flex !important",
              justifyContent: "center !important",
            },
          "& .MuiDataGrid-window": {
            overflow: "hidden !important",
          },
        },
        cell: {
          borderTop: "0px !important",
          borderBottom: "1px solid  var(--ProjectColor) !important",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

const OtQuelist = () => {
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [PatientRegisterData, setPatientRegisterData] = useState("");
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [otData, setOtData] = useState([]);
  const [otData1, setOtData1] = useState([]);

  const navigate = useNavigate();
  const toast = useSelector((state) => state.userRecord?.toast);
  const [rows, setRows] = useState([]);
  const [ApprovedDate, setApprovedDate] = useState("");
  const [Approvedtime, setApprovedtime] = useState("");
  // const [filteredRows,setFilteredRows]=useState([]);
  const [Doctors, setDoctors] = useState([]);
  const [selectedDoctor, setselectedDoctor] = useState("all");
  const [Location, setLocation] = useState([]);
  const [selectedLocation, setselectedLocation] = useState("all");
  const [Building, setBuilding] = useState([]);
  const [selectedBuilding, setselectedBuilding] = useState("all");
  const [Block, setBlock] = useState([]);
  const [selectedBlock, setselectedBlock] = useState("all");
  const [Floor, setFloor] = useState([]);
  const [selectedFloor, setselectedFloor] = useState("all");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const showdown = rows.length;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [PatientFirstName, setPatientFirstName] = useState("");
  const [PatientPhoneNo, setPatientPhoneNo] = useState("");
  const [columns, setcolumn] = useState([]);
  const [Theatrerequestdata, setTheatrerequestdata] = useState([]);

  const OtQuelist = JSON.parse(localStorage.getItem("OtQuelist")) || [];
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [ResheduleReason,setResheduleReason] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [confirmData, setConfirmData] = useState("");

  const [locationData, setLocationData] = useState([]);
  const [buildingName, setBuildingName] = useState([]);
  const [blockName, setBlockName] = useState([]);
  const [floorData, setFloorData] = useState([]);
  const [Ward_by_floor, setWard_by_floor] = useState([]);
  const [RoomdataColumns, setRoomdataColumns] = useState([]);
  const [otMasterData, setOtMasterData] = useState([]);

  const [rescheduledata,setrescheduledata] = useState([]);
  
  const [chosenid,setchosenid] = useState("");
  const [Resid,setResid] = useState("");
  const [load,setload] = useState(false);

  const [modalContent, setModalContent] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);

  const [Roomdata, setRoomdata] = useState({
    Building: "",
    Block: "",
    Floor: "",
    Ward: "",
  });
  console.log(Roomdata, "Roomdata");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCalenderView = () => {
    navigate("/Home/OT_Calender");
  };

  const [otMaster, setOtMaster] = useState({
    Location: "",
    Building: "",
    Block: "",
    FloorName: "",
  });


  const formatDate = (date) => {
              const d = new Date(date);
              const month = (d.getMonth() + 1).toString().padStart(2, "0");
              const day = d.getDate().toString().padStart(2, "0");
              const year = d.getFullYear();
              return `${year}-${month}-${day}`;
            };
          
          
             const [searchOptions, setSearchOptions] = useState({
                DateType: "Current",
                CurrentDate: formatDate(new Date()),
                FromDate: "",
                ToDate: "",
                ParticularDate : "",
                SearchbyFirstName: "",
                
              });
          
              const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  
             const HandleOnchangeSearch = (e) => {
              const { name, value } = e.target;
              if (name === "SearchbyPhoneNumber") {
              if (value.length <= 10) {
                  setSearchOptions((prev) => ({
                  ...prev,
                  [name]: value,
                  }));
              }
              } 
              else if (name === "DateType") {
              if (value === "Current") {
                  setSearchOptions((prev) => ({
                  ...prev,
                  DateType: value,
                  CurrentDate: TodayDate,
                  FromDate: "",
                  ToDate: "",
                  }));
              }
              else if (value === "Customize") {
                  setSearchOptions((prev) => ({
                  ...prev,
                  DateType: value,
                  CurrentDate: "",
                  }));
              }
  
              else if (value === "Particular") {
                  setSearchOptions((prev) => ({
                  ...prev,
                  DateType: value,
                  CurrentDate: "",
                  FromDate: "",
                  ToDate: "",
                  }));
              }
              
              else if (value === "All") {
                  setSearchOptions((prev) => ({
                  ...prev,
                  DateType: value,
                  CurrentDate: "",
                  FromDate: "",
                  ToDate: "",
                  }));
              }
              } 
              
              else {
              setSearchOptions((prev) => ({
                  ...prev,
                  [name]: value,
              }));
              }
          };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => setLocationData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Masters/get_Floor_Data_by_Building_block_loc?Block=${otMaster.Block}`
      )
      .then((res) => setFloorData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink, otMaster.Block]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Masters/get_building_Data_by_location?Location=${otMaster.Location}`
      )
      .then((res) => setBuildingName(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink, otMaster.Location]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Masters/get_block_Data_by_Building?Building=${otMaster.Building}`
      )
      .then((res) => setBlockName(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink, otMaster.Building]);

  useEffect(() => {
    console.log(Roomdata.Building, "Roomdata.Building");
    const data = {
      location: userRecord?.location,
      Floor: otMaster.FloorName,
    };
    axios
      .get(`${UrlLink}OT/room_filter_by_floor`, { params: data })
      .then((response) => {
        const data = response.data;
        console.log(data, "datadatadata");
        setWard_by_floor(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [otMaster.FloorName]);

  // useEffect(() => {
  //   console.log(Roomdata.Building, "Roomdata.Building");
  //   const data = {
  //     location: userRecord?.location,
  //     Floor: Roomdata.Floor,
  //   };

  // //   axios
  // //     .get(`${UrlLink}Masters/get_bed_details_by_ward`, { params: data })
  // //     .then((response) => {
  // //       const data = response.data;
  // //       setWard_by_floor(data);
  // //     })
  // //     .catch((error) => {
  // //       console.log(error);
  // //     });
  // // }, [Roomdata.Floor]);

  const handleInputChange = (e) => {
    const { name, type, value, checked, options, multiple } = e.target;

    setOtMaster((prevState) => ({
      ...prevState,
      [name]: multiple
        ? Array.from(options)
            .filter((option) => option.selected)
            .map((option) => option.value)
        : type === "checkbox"
        ? checked
        : value,
    }));
    if (name === "Building") {
      setRoomdata((prev) => ({
        ...prev,
        [name]: value,
        Block: "",
        Floor: "",
        Ward: "",
      }));
    } else if (name === "Block") {
      setRoomdata((prev) => ({
        ...prev,
        [name]: value,
        Floor: "",
        Ward: "",
      }));
    } else if (name === "Floor") {
      setRoomdata((prev) => ({
        ...prev,
        [name]: value,
        Ward: "",
      }));
      setWard_by_floor([]);
      setRoomdataColumns([]);
    }
  };

  useEffect(() => {
  const controller = new AbortController(); // create AbortController
  const { signal } = controller;

  const params = {
    ...searchOptions, // ✅ Use the latest searchOptions
  };

  axios
    .get(`${UrlLink}OT/Theatre_booking_request_details`, {
      params,
      signal, // ✅ attach abort signal
    })
    .then((res) => setTheatrerequestdata(res.data))
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
      } else {
        console.log("Error fetching theatre request data:", err);
      }
    });

  return () => {
    controller.abort();
  };
}, [UrlLink, load, searchOptions]);


  React.useEffect(() => {
    fetchOtRequestData();
  }, []);

  const fetchOtRequestData = () => {
    axios
      .get(`${UrlLink}ipregistration/get_Ot_Request`)
      .then((response) => {
        const data = response.data;
        console.log("orrequestdata", data);

        setOtData([
          ...data.map((row, index) => ({
            id: index + 1,
            ...row,
          })),
        ]);
      })
      .catch((error) => {
        console.log("error fetching otrequest data:", error);
      });
  };

  const handleotbookingrequest = (params) => {
    console.log(params);
    console.log(params.BookingType);

    if(params.BookingType == 'OP'){

      dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });
      navigate("/Home/OTManagement");
      dispatchvalue({ type: "HrFolder", value: "Op_otrequest" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });

      // navigate("/Op_otrequest", { state: { params, Editoption: true }  });
    }

    else if(params.BookingType == 'IP'){
      dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });

      navigate("/Home/OTManagement");
      dispatchvalue({ type: "HrFolder", value: "Ip_ot_request" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    }

    else if(params.BookingType == 'EMERGENCY'){

      dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });


      navigate("/Home/OTManagement");
      dispatchvalue({ type: "HrFolder", value: "New_theater_booking" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
      // navigate("/New_theater_booking", { state: { params, Editoption: true }  });
    }

    
    
  };


  const [SearchCasualityParams, setSearchCasualityParams] = useState({
    query: "",
    status: "Confirm",
    type: "Casuality",
  });

  const handleClickConfirm = (params) => {
    console.log(params,'PARAMS');

    const data = {
      ...params,
      Booking_Id : params.Booking_Id,
      Status : 'Confirmed',
      'Statusedit' : true,
      

    };

    console.log(data);
    axios.post(`${UrlLink}OT/Theatre_booking_request_details`, data)
    .then((res) => {
    
     const response = res.data;
                 const messageType = Object.keys(response)[0];
                 const messageContent = Object.values(response)[0];
                 console.log(messageType);
                 console.log(messageContent);
                 dispatchvalue({
                     type: 'toast',
                     value: { message: messageContent, type: messageType },
                 });
                 setload((prev)=>!prev);
               })
    .catch((err) => console.log(err));





    navigate('/SurgicalTeam', { state: { params } });
  }
  const handleRescheduleClick = (params) => {

    console.log(params,'PARAMSMSSSSSSSSSSS');
    setrescheduledata(params);
    setOpenModal2(true);
    
    
  };

  const handleCompleteClick = (id) => {

    setchosenid(id);
    setOpenDialogcomplete(true);
    
    
  };

   const handleCloseDialogcomplete = () => {
    setOpenDialogcomplete(false);
  };


  const handleSaveComplete = () => {
    const data = {
     'Booking_Id' : chosenid,
     'Status' : 'Completed',
     'CompletedBy' : userRecord?.username,
 };

 console.log(data);

 axios.post(`${UrlLink}OT/Booking_Complete_Link`, data)
.then((res) => {

 const response = res.data;
             const messageType = Object.keys(response)[0];
             const messageContent = Object.values(response)[0];
             console.log(messageType);
             console.log(messageContent);
             dispatchvalue({
                 type: 'toast',
                 value: { message: messageContent, type: messageType },
             });
             setload((prev)=>!prev);
           })
.catch((err) => console.log(err));
 
 console.log("Cancel Text:", cancelText);
 setOpenDialogcomplete(false);
};

  const [openDialogcomplete, setOpenDialogcomplete] = useState(false);
  const [cancelTextcomplete, setCancelTextcomplete] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [cancelText, setCancelText] = useState("");

  const handleIconCancelClick = (id) => {

    console.log(id);
    setchosenid(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveCancelText = () => {
    const data = {
   'Booking_Id' : chosenid,
   'Status' : 'Canceled',
   'Statusedit' : true,
   'Reason' : cancelReason
 };

 console.log(data);

 axios.post(`${UrlLink}OT/Theatre_booking_request_details`, data)
.then((res) => {

 const response = res.data;
             const messageType = Object.keys(response)[0];
             const messageContent = Object.values(response)[0];
             console.log(messageType);
             console.log(messageContent);
             dispatchvalue({
                 type: 'toast',
                 value: { message: messageContent, type: messageType },
             });
             setload((prev)=>!prev);
           })
.catch((err) => console.log(err));
 
 console.log("Cancel Text:", cancelText);
 setOpenDialog(false);
};








const handleressave = () => {

  const params = {
    ...rescheduledata,
    Status : 'Reschedule',
    'Statusedit' : true,
    'Reason' : ResheduleReason
  };
  console.log(params,'finalllll');


  if(params.BookingType == 'OP'){

    // navigate("/Op_otrequest", { state: { params }  });

      dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });

      navigate("/Home/OTManagement");
      dispatchvalue({ type: "HrFolder", value: "Op_otrequest" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
  }

  else if(params.BookingType == 'IP'){

      dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });

      navigate("/Home/OTManagement");
      dispatchvalue({ type: "HrFolder", value: "Ip_ot_request" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    // navigate("/Ip_otrequest", { state: { params }  });
  }

  else if(params.BookingType == 'EMERGENCY'){

    dispatchvalue({ type: "OTPatientdata", value:{ ...params, Editoption: true } });

      navigate("/Home/OTManagement");
      dispatchvalue({ type: "HrFolder", value: "New_theater_booking" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    // navigate("/New_theater_booking", { state: { params }  });
  }

};


  const handleNavigateOTTheater = (params) => {
    dispatchvalue({ type: "submissionData", value: params.row });
    navigate("/Home/OT-Management");
  };

  const coloumnss = [
    { key: "Sno", headerName: "S.no", width: 100 },

    // { key: "Booking_Id", headerName: "Booking Id", width: 100 },
    { key: "PatientName", headerName: "Patient_Name", width: 100,
      renderCell: (params) => {
      let bgColor;
      if (params.row.Status === "Requested") {
          bgColor = "#e3ff7e"; // Background color for Inprogress
      }  else if (params.row.Status === "Canceled") {
          bgColor = "#f55e5e";
      }
      else if (params.row.Status === "Reschedule") {
          bgColor = "#c794dffd";
      }
      else if (params.row.Status === "Confirmed") {
        bgColor = "#6225e6";
      }
      else if (params.row.Status === "Completed") {
          bgColor = "#88e76cfd";
      }
      else if (params.row.Status === "ByDoctor") {
        bgColor = "#86FCDD";
     }
      else {
          bgColor = "transparent"; // Default background color
      }

      return (
          <div
              style={{
                  backgroundColor: bgColor,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black", // Adjust text color for visibility
                  padding: "4px",
                  borderRadius: "4px",
                  fontWeight: "bold"
              }}
          >
              {params.row.PatientName}
          </div>
      );
  }
    }, 


    // { key: "SurgeryName", headerName: "Surgery Name", width: 130 },
    { key: "ProcedureName", headerName: "Procedure Name", width: 130 },

    //{ key: "Surgeon_Name", headerName: "Surgeon Name", width: 130 },
    { key: "ReqDate", headerName: "Requested Date", width: 140 },
    { key: "ReqTime", headerName: "Requested Time", width: 140 },
    { key: "DoctorName", headerName: "Physician Name", width: 140 },
    { key: "bookingdate", headerName: "Booking Date", width: 150 },
    { key: "BookingTime", headerName: "Booking Time", width: 150 },
    { key: "BookingType", headerName: "Booking Type", width: 150 },
    { key: "Status", headerName: "Status", width: 150 },
    { key: "OperationType", headerName: "OperationType", width: 150 },
    { key: "Priority", headerName: "Priority", width: 150 },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={() => handleotbookingrequest(params.row)}
        disabled={
               params.row.Status === 'Confirmed' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                }
        style={{
                  opacity:
                  params.row.Status === 'Confirmed' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? 0.5
                      : 1,
                  cursor:
                     params.row.Status === 'Confirmed' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "not-allowed"
                      : "pointer",
                  // backgroundColor:
                  //    params.row.Status === 'InProgress' || params.row.Status === 'CheckOut' ||  params.row.Status === 'Cancelled'
                  //     ? "#ccc"
                  //     : "#e3ff7e",
                }}>
          <EditIcon />
        </Button>
      ),
    },
    {
      field: "Status",
      headerName: "Status",

      renderCell: (params) => (
        <>
          <div className="actionv" style={{ gap: "5px" }}>
            <Button
              className="cell_btn"
              title="Pending"
              onClick={() => handleColorChange(params.row.id, "Pending")}
              disabled={
               params.row.Status === 'Confirmed' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                }
               style={{
                  opacity:
                  params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? 0.5
                      : 1,
                  cursor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "not-allowed"
                      : "pointer",
                      backgroundColor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "#ccc"
                      : "#e3ff7e",
                  
                }}
            >
              <PendingIcon />
            </Button>
            <Button
              className="cell_btn"
              title="Confirm"
              onClick={() => handleClickConfirm(params.row, "Confirm")}
              disabled={
                 params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                }
              style={{
                  opacity:
                  params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? 0.5
                      : 1,
                  cursor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "not-allowed"
                      : "pointer",
                  backgroundColor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "#ccc"
                      : "#6225e6",
                }}
            >
              <CheckCircleIcon />
            </Button>
          </div>
        </>
      ),
    },
    {
      field: "Action",
      headerName: "Action",

      renderCell: (params) => (
        <div className="actionv">
          <Button
            className="cell_btn"
            title="Cancel"
            onClick={() => handleIconCancelClick(params.row.Booking_Id, "Cancel")}
            disabled={
               params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                }
            style={{
                  opacity:
                  params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? 0.5
                      : 1,
                  cursor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "not-allowed"
                      : "pointer",
                  backgroundColor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "#ccc"
                      : "#f55e5e",
                }}
          >
            <CancelIcon className="check_box_clrr_cancell" />
          </Button>
          <Button
            className="cell_btn"
            title="Reshedule"
            onClick={() => handleRescheduleClick(params.row, "Reshedule")}
                disabled={
                params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                }
            style={{
                  opacity:
                  params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? 0.5
                      : 1,
                  cursor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "not-allowed"
                      : "pointer",
                  backgroundColor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "#ccc"
                      : "#c794dffd",
                }}
          >
            <UpdateIcon className="check_box_clrr_cancell" />
          </Button>
          <Button
            className="cell_btn"
            title="Complete"
            onClick={() => handleCompleteClick(params.row.Booking_Id, "Completed")}
                disabled={
                params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                }
            style={{
                  opacity:
                  params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? 0.5
                      : 1,
                  cursor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "not-allowed"
                      : "pointer",
                  backgroundColor:
                     params.row.Status === 'InProgress' || params.row.Status === 'Completed' ||  params.row.Status === 'Cancelled'
                      ? "#ccc"
                      : "#c794dffd",
                }}
          >
            <ThumbUpIcon className="check_box_clrr_cancell" />
          </Button>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Cancel Request</DialogTitle>
            <DialogContent>
            <TextField 
              name = 'Reason'
              style={{ width: "500px", height: "80px" }}
              multiline
              row={25}
              onChange={(e) => setCancelReason(e.target.value)}
               />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
              <Button onClick={handleSaveCancelText} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openDialogcomplete} onClose={handleCloseDialogcomplete}>
            <DialogTitle>Complete Confirmation</DialogTitle>
            <DialogActions>
              <Button onClick={handleCloseDialogcomplete} color="primary">
                Close
              </Button>
              <Button onClick={handleSaveComplete} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>







        </div>
      ),
    },



  ];

  const handlePageChange = (params) => {
    setPage(params.page);
  };

  const openModal1 = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
    setOpenModal3(true);
  };

  const handleColorChange = (id, color, status) => {
    setOtData((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, Status: status, bgColour: color } : row
      )
    );
    const updatedData = {
      id,
      Status: status,
    };
    axios
      .post(
        `${UrlLink}ipregistration/update_Ot_Queuelist`,
        updatedData
      )
      .then((response) => {
        console.log("Status updated successfully:", response.data);
      })
      .catch((error) => {
        console.log("Error updating status:", error);
      });
  };

  const handleCancelClick = (params) => {
    setSelectedRow(params.row);
    setOpenCancelModal(true);
  };


  const handleSubmitCancelReason = () => {
    if (cancelReason) {
      setOtData((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedRow.id
            ? { ...row, Status: "Cancelled", cancelReason }
            : row
        )
      );
      setOpenCancelModal(false);
    }
  };
  const totalPages = Math.ceil(rows.length / 10);

  return (
    <>
      <div className="appointment">
        <div className="h_head neww_1">
          <h3>Operation Theatre Queue List</h3>

          <div className="doctor_select_1 selt-dctr-nse form-row-inline"></div>
          <div className="Main_container_app">
            <h4>
              OT Quelist{" "}
              <div
                style={{
                  float: "right",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                ICU/CCU Available
                <SingleBedIcon sx={{ fontSize: 35 }} onClick={openModal} />
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                OT Calendar
                <div style={{ float: "right" }}>
                          
                          <FontAwesomeIcon icon={faCalendarDays} onClick={() => openModal1("calendar")} className="cal_icon" />
                </div>
                
              </div>
            </h4>
            <br />

            {isModalOpen && (
              <div
                className="modal"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999,
                }}
              >
                <div
                  className="modal-content"
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "100%",
                    height: "70%",
                    maxWidth: "1000px",
                    maxHeight: "700px",
                  }}
                >
                  <span className="close-btn" onClick={closeModal}>
                    &times;
                  </span>
                  <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                      <label>
                        Location<span>:</span>
                      </label>
                      {console.log(otMaster, "otMaster")}
                      <select
                        name="Location"
                        value={otMaster.Location}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        {locationData.map((loc, index) => (
                          <option key={index} value={loc.id}>
                            {loc.locationName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="RegisForm_1">
                      <label>
                        Building<span>:</span>
                      </label>
                      <select
                        name="Building"
                        value={otMaster.Building}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        {Array.isArray(buildingName) &&
                          buildingName.map((building, index) => (
                            <option key={index} value={building.id}>
                              {building.BuildingName}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="RegisForm_1">
                      <label>
                        Block<span>:</span>
                      </label>
                      <select
                        name="Block"
                        value={otMaster.Block}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        {Array.isArray(blockName) &&
                          blockName.map((block, index) => (
                            <option key={index} value={block.id}>
                              {block.BlockName}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="RegisForm_1">
                      <label>
                        Floor Name<span>:</span>
                      </label>
                      <select
                        name="FloorName"
                        value={otMaster.FloorName}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select</option>
                        {Array.isArray(floorData) &&
                          floorData.map((floor, index) => (
                            <option key={index} value={floor.id}>
                              {floor.FloorName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th>Ward Name</th>
                          <th>Room No</th>
                          <th>Beds</th>
                        </tr>
                      </thead>
                      <tbody>
  {Array.isArray(Ward_by_floor) &&
    Ward_by_floor.map((room, index) => (
      <tr key={index}>
        <td>{room.Ward_Name}</td>
        <td>{room.RoomNo || "-"}</td>
        <td>
          {room.beds.map((bed, idx) => (
            <span
              key={idx}
              style={{
                display: "inline-block",
                backgroundColor: "#8EFF8E", // assuming all are available since status is not given
                color: "black",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                textAlign: "center",
                margin: "2px",
                lineHeight: "20px",
              }}
            >
              {bed}
            </span>
          ))}
        </td>
      </tr>
    ))}
</tbody>

                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <form>
          <div className="con_1 ">
            <div className="action_color_block">
              <span style={{ backgroundColor: "#e3ff7e" }}>Requested </span>
              <span style={{ backgroundColor: "#6225e6" }}>Confirmed </span>
              <span style={{ backgroundColor: "#f55e5e" }}>Cancel</span>
              <span style={{ backgroundColor: "#c794dffd" }}>Reshedule</span>
              <span style={{ backgroundColor: "#88e76cfd" }}>Completed </span>
          
              
            </div>

            {/* <div className="inp_1">
              <label htmlFor="input">First Name :</label>
              <input
                type="text"
                id="FirstName"
                value={PatientFirstName}
                onChange={(e) => setPatientFirstName(e.target.value)}
                placeholder="Enter the First Name"
              />
            </div>
            <div className="inp_1">
              <label htmlFor="input">Phone No :</label>
              <input
                type="text"
                id="PhoneNo"
                value={PatientPhoneNo}
                onChange={(e) => setPatientPhoneNo(e.target.value)}
                placeholder="Enter the Phone No"
              />
            </div>
            <button className="btn_1" type="submit">
              <SearchIcon />
            </button> */}
          </div>
        </form>

        {openModal2 && (
        <div
          className="sideopen_showcamera_profile"
          onClick={() => setOpenModal2(false)}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
             <label>
            Reason <span>:</span>
          </label>
          <input
            id="Reason"
            name="Reason"
            value={ResheduleReason}
            onChange={(e) => setResheduleReason(e.target.value)}
           
          />
            <br />
            <div className="Main_container_Btn">
            <button
               onClick={handleressave} // Close the grid
              >
                Save
              </button>
              <button
                onClick={() => setOpenModal2(false)} // Close the grid
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

        {/* <ThemeProvider theme={theme}>
          <div className=" grid_1">
            <DataGrid
              rows={rows.slice(page * pageSize, (page + 1) * pageSize)}
              columns={columns}
              pageSize={100}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              onPageChange={handlePageChange}
              hideFooterPagination
              hideFooterSelectedRowCount
              className=" data_grid"
            />
            {showdown > 0 && rows.length > 10 && (
              <div className="grid_foot">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 0))
                  }
                  disabled={page === 0}
                >
                  Previous
                </button>
                Page {page + 1} of {totalPages}
                <button
                  onClick={() =>
                    setPage((prevPage) =>
                      Math.min(prevPage + 1, totalPages - 1)
                    )
                  }
                  disabled={page === totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </ThemeProvider> */}

        {/* <ThemeProvider theme={theme}>
          <div className="IP_grid_1">
            <DataGrid
              rows={otData.slice(page * pageSize, (page + 1) * pageSize)}
              pageSize={10}
              columns={coloumnss} // You need to define your dynamic columns here
              onPageChange={handlePageChange}
              hideFooterPagination
              hideFooterSelectedRowCount
              className="Ip_data_grid"
            />
            {showdown > 0 && otData.length > 10 && (
              <div className="IP_grid_foot">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 0))
                  }
                  disabled={page === 0}
                >
                  Previous
                </button>
                Page {page + 1} of {totalPages}
                <button
                  onClick={() =>
                    setPage((prevPage) =>
                      Math.min(prevPage + 1, totalPages - 1)
                    )
                  }
                  disabled={page === totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </ThemeProvider>

        {rows.length === 0 && (
          <div className="norecords">
            <span>No Records Found</span>
          </div>
        )}
      </div>
      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="bookingid">
                  Booking ID<span>:</span>
                </label>
                <input
                  type="input"
                  name="bookingid"
                  value={otData1.Booking_Id}
                  readOnly
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="ApprovedDate">
                  Approved Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="Approveddate"
                  value={ApprovedDate}
                  onChange={(e) => {
                    setApprovedDate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="Approvedtime">
                  Approved Time<span>:</span>
                </label>
                <input
                  type="time"
                  name="Approvedtime"
                  value={Approvedtime}
                  onChange={(e) => {
                    setApprovedtime(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="Register_btn_con regster_btn_contsai">
              <button
                className="RegisterForm_1_btns"
                onClick={handleSubmission}
              >
                Submit
              </button>
              <button
                className="RegisterForm_1_btns"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}


      <br />

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
                <option value="Particular">Particular</option>
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

            {searchOptions.DateType === "Particular" && (
              <>
                <div className="RegisForm_1">
                  <label>
                    Particular Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="ParticularDate"
                    value={searchOptions.ParticularDate}
                    onChange={HandleOnchangeSearch}
                  />
                </div>
                
              </>
            )}


            <div className="RegisForm_1">
              <label>
                Search <span>:</span>
              </label>
              <input
                type='text'
                name="SearchbyFirstName"
                value={searchOptions.SearchbyFirstName}
                onChange={HandleOnchangeSearch}
              >
                
              </input>
            </div>

        </div>

        <br />


      <div className='RegisFormcon_1 jjxjx_'>
        <ReactGrid columns={coloumnss} RowData={Theatrerequestdata} />
      </div>

      {openModal3 && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal3(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <OTGoogleStyleCalendar />
          </div>
        </div>
      )}

      


        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default OtQuelist;

