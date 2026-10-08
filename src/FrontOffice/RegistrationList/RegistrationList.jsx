// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Button from "@mui/material/Button";
// import EditIcon from "@mui/icons-material/Edit";
// // import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import { useNavigate } from "react-router-dom";
// import LoupeIcon from "@mui/icons-material/Loupe";
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import { Tooltip } from 'react-tooltip';
// import TokenPatient from "./TokenPatient";
// import AllPatienbarcode from "./AllPatientbarcode";
// import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
// import PersonIcon from "@mui/icons-material/Person";
// import Diversity1Icon from "@mui/icons-material/Diversity1";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import RadiologyBarcode from "./RadiologyBarcode";
// import AllPatienbarcodeIP from "./AllPatientbarcodeIP";



// const RegistrationList = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   // const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();
//   const [PatientRegisterData, setPatientRegisterData] = useState([]);
//   const [filteredOPlist,setfilteredOPlist] = useState([]);
//   const [filteredIPlist,setfilteredIPlist] = useState([]);
//   console.log(PatientRegisterData,'PatientRegisterData')
//   const [PatientIPRegisterData, setPatientIPRegisterData] = useState([]);
//   const [PatientCasualityRegisterData, setPatientCasualityRegisterData] = useState([]);
//   const [PatientEmergencyRegisterData, setPatientEmergencyRegisterData] = useState([]);
//   const [PatientDiagnosisRegisterData, setPatientDiagnosisRegisterData] = useState([]);
//   const [PatientLaboratoryRegisterData, setPatientLaboratoryRegisterData] = useState([]);
//   const UserData = useSelector(state => state.userRecord?.UserData)

//   const [selectedRowData, setSelectedRowData] = useState(null);

//   const [selectedType, setSelectedType] = useState("OP");

//   const [TodayOPCount, setTodayOPCount] = useState(0);
//   const [MonthlyOPcount, setMonthlyOPcount] = useState(0);
//   const [YearlyOPcount, setYearlyOPcount] = useState(0);

//   const [TodayRadiologyCount, setTodayRadiologyCount] = useState(0);
//   const [MonthlyRadiologycount, setMonthlyRadiologycount] = useState(0);
//   const [YearlyRadiologycount, setYearlyRadiologycount] = useState(0);

//   const [TodayLabCount, setTodayLabCount] = useState(0);
//   const [MonthlyLabcount, setMonthlyLabcount] = useState(0);
//   const [YearlyLabcount, setYearlyLabcount] = useState(0);

//   const [TodayAdmittedIPcount, setTodayAdmittedIPcount] = useState(0);
//   const [MonthlyAdmittedIPcount, setMonthlyAdmittedIPcount] = useState(0);
//   const [YearlyAdmittedIPcount, setYearlyAdmittedIPcount] = useState(0);
//   const [TodayDischargedIPcount, setTodayDischargedIPcount] = useState(0);
//   const [MonthlyDischargedIPcount, setMonthlyDischargedIPcount] = useState(0);
//   const [YearlyDischargedIPcount, setYearlyDischargedIPcount] = useState(0);
 
//   const [TodayAdmittedEmgcount, setTodayAdmittedEmgcount] = useState(0);
//   const [MonthlyAdmittedEmgcount, setMonthlyAdmittedEmgcount] = useState(0);
//   const [YearlyAdmittedEmgcount, setYearlyAdmittedEmgcount] = useState(0);
//   const [TodayDischargedEmgcount, setTodayDischargedEmgcount] = useState(0);
//   const [MonthlyDischargedEmgcount, setMonthlyDischargedEmgcount] = useState(0);
//   const [YearlyDischargedEmgcount, setYearlyDischargedEmgcount] = useState(0);


//   const [UserList,setUserList] = useState([]);

//   const handleOpenModal = (modalType, rowData) => {

//     console.log(modalType,'modalType')
//     setOpenModal(modalType);
//     setSelectedRowData(rowData);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(null);
//     setSelectedRowData(null);
//   };

//   const [openModal, setOpenModal] = useState(false);

//   const [labModal,setlabModal] = useState(false);
//   const [IPModal,setIPModal] = useState(false)
 
//   const handleCloseLabModal = () => {
//     setlabModal(null);
   
//   };

//   const handleCloseIPModal = () => {
//     setIPModal(null);
//     setSelectedRowData(null);
   
//   };

//    const handleIPOpenModal = (modalType, rowData) => {

//     setIPModal(modalType);
//     setSelectedRowData(rowData);
//   };

  
 
//   const [viewtest, setViewtest] = useState([]);
//   console.log(viewtest,'viewtest')
//   const [expandedTest, setExpandedTest] = useState(null);
 
//   const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
//   const toggleSubTests = (testId) => {
//     setExpandedTest(expandedTest === testId ? null : testId);
//   };
//   const [OpDateOption, setOpDateOption] = useState('current');
//   const [dateOption, setDateOption] = useState('current');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [ParticularDate, setParticularDate] = useState('');
//   const [CurrentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

//   useEffect(() => {
//     if (dateOption === 'current') {
//       setCurrentDate(new Date().toISOString().split('T')[0]); // Auto-set today
//     }
//   }, [dateOption]);
//   console.log(PatientRegisterData, 'PatientRegisterData');
//   console.log(PatientEmergencyRegisterData, 'PatientEmergencyRegisterData');


//   const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '', VisitPurpose: 'OP', User:UserData?.username || ''});

//   const [searchIPParams, setsearchIPParams] = useState({
//     query: '',
//     status: 'Admitted',
//     type: 'IP',
//     DoctorId: UserData?.Doctor || '',
//     User:UserData?.username || ''
//     // SelectedWard : SelectedWard
//   });

//   const [searchCasualityParams, setsearchCasualityParams] = useState({
//     query: "",
//     status: 'Admitted',
//     DoctorId: UserData?.Doctor,

//   });

//   const [searchEmergencyParams, setsearchEmergencyParams] = useState({
//     query: "",
//     status: 'Admitted',
//     DoctorId: UserData?.Doctor || '',
//     User:UserData?.username || ''
//   });
//   const [searchDiagnosisParams, setsearchDiagnosisParams] = useState({
//     query: "",
//     status: "Registered",
//     User:UserData?.username || ''
//   });
//   const [searchLaboratoryParams, setsearchLaboratoryParams] = useState({
//     query: "",
//     status: "Registered",
//     User:UserData?.username || ''
//   });


//     useEffect(() => {
//         axios
//           .get(`${UrlLink}Masters/UserRegister_Detials_link`)
//           .then((res) => setUserList(res.data))
//           .catch((err) => console.log(err));
//       }, [UrlLink]);



//   useEffect(() => {
//   if (selectedType !== "OP") return;  // ✅ Run only for OP

//   const params = {};

//   console.log(params, "params11111111111111");

//   if (!searchOPParams?.query || typeof searchOPParams.query !== "string") {
//     searchOPParams.query = ""; // Default empty string
//   }

//   if (searchOPParams.query?.trim()) {
//     params.query = searchOPParams.query.trim();
//   }

//   if (/^\d{10}$/.test(searchOPParams.query)) {
//     params.query = searchOPParams.query; // for mobile number
//   } else if (searchOPParams.query.trim()) {
//     const nameParts = searchOPParams.query.trim().split(" ");
//     if (nameParts.length === 1) params.query = nameParts[0];
//     if (nameParts.length === 2) params.query = nameParts[1];
//     if (nameParts.length > 2) {
//       params.query = nameParts[nameParts.length - 1]; // ✅ last name only
//     }
//   }

//   if (searchOPParams?.status) params.status = searchOPParams.status;
//   if (searchOPParams?.User) params.User = searchOPParams.User;
//   if (searchOPParams?.VisitPurpose) params.VisitPurpose = searchOPParams.VisitPurpose;
//   if (searchOPParams.DoctorId) params.DoctorId = searchOPParams.DoctorId;

//   if (OpDateOption === "custom") {
//     if (fromDate && toDate) {
//       params.fromDate = fromDate;
//       params.toDate = toDate;
//     } else {
//       setPatientRegisterData([]);
//       return;
//     }
//   } else if (OpDateOption === "current") {
//     if (CurrentDate) {
//       params.CurrentDate = CurrentDate;
//     } else {
//       setPatientRegisterData([]);
//       return;
//     }
//   } else if (OpDateOption === "particular") {
//     if (ParticularDate) {
//       params.ParticularDate = ParticularDate;
//     } else {
//       setPatientRegisterData([]);
//       return;
//     }
//   }

//   console.log(params, "params22222222222222222");

//   axios
//     .get(`${UrlLink}Frontoffice/Total_OP_patients_List`, { params })
//     .then((res) => {
//       const TodayOPCount = res.data.today_total_OP_count;
//       const MonthlyOPcount = res.data.monthly_total_OP_count;
//       const YearlyOPcount = res.data.yearly_total_OP_count;

//       const ress = res.data.appointments || [];

//       setTodayOPCount(TodayOPCount);
//       setMonthlyOPcount(MonthlyOPcount);
//       setYearlyOPcount(YearlyOPcount);

//       const processedData = ress.map((patient) => ({
//         ...patient,
//         Specilization: patient.Multiple_Doc?.map((doc) => doc.Specilization).join(", ") || "",
//         VisitType: patient.Multiple_Doc?.map((doc) => doc.VisitType).join(", ") || "",
//         DoctorName: patient.Multiple_Doc?.map((doc) => doc.DoctorName).join(", ") || "",
//         Complaint: patient.Multiple_Doc?.map((doc) => doc.Complaint).filter(Boolean).join(", ") || "",
//       }));

//       setPatientRegisterData(processedData);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }, [
//   selectedType, // ✅ must include this
//   UrlLink,
//   searchOPParams,
//   UserData,
//   dateOption,
//   OpDateOption,
//   fromDate,
//   toDate,
//   ParticularDate,
//   CurrentDate,
//   ]);



//   const handleTodayPatientsClick = () => {
//     const today = new Date().toISOString().split('T')[0];
//     setDateOption('current');
//     setOpDateOption('current');
//     setCurrentDate(today);
//   };

  
//   // Helper function to format date as YYYY-MM-DD
//   const formatDate = (date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const d = String(date.getDate()).padStart(2, '0');
//     return `${y}-${m}-${d}`;
//   };


//   const handleTodayIPadmittedPatientsClick = () => {
//     const today = new Date().toISOString().split('T')[0];
//     setDateOption('current');
//     setCurrentDate(today);
//     setsearchIPParams({status: 'Admitted'})
//   };

//   const handleTodayIPdischargedPatientsClick = () => {
//     const today = new Date().toISOString().split('T')[0];
//     setDateOption('current');
//     setCurrentDate(today);
//     setsearchIPParams({status: 'Completed'})
//   };

//   const handleTodayEmgadmittedPatientsClick = () => {
//     const today = new Date().toISOString().split('T')[0];
//     setDateOption('current');
//     setCurrentDate(today);
//     setsearchEmergencyParams({status: 'Admitted'})
//   };

//   const handleTodayEmgdischargedPatientsClick = () => {
//     const today = new Date().toISOString().split('T')[0];
//     setDateOption('current');
//     setCurrentDate(today);
//     setsearchEmergencyParams({status: 'Completed'})
//   };


//   const handleMonthlyPatientsClick = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth(); // 0-based (0 = Jan)

//   const firstDay = formatDate(new Date(year, month, 1));
//   const lastDay = formatDate(new Date(year, month + 1, 0));

//   console.log("Monthly filter from:", firstDay, "to:", lastDay);

//   setDateOption('custom');
//   setOpDateOption('custom');
//   setFromDate(firstDay);
//   setToDate(lastDay);
// };

//   const handleMonthlyIPadmittedPatientsClick = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth(); // 0-based (0 = Jan)

//   const firstDay = formatDate(new Date(year, month, 1));
//   const lastDay = formatDate(new Date(year, month + 1, 0));

//   console.log("Monthly filter from:", firstDay, "to:", lastDay);

//   setDateOption('custom');
//   setFromDate(firstDay);
//   setToDate(lastDay);
//   setsearchIPParams({status: 'Admitted'})

// };

//   const handleMonthlyIPdischargedPatientsClick = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth(); // 0-based (0 = Jan)

//   const firstDay = formatDate(new Date(year, month, 1));
//   const lastDay = formatDate(new Date(year, month + 1, 0));

//   console.log("Monthly filter from:", firstDay, "to:", lastDay);

//   setDateOption('custom');
//   setFromDate(firstDay);
//   setToDate(lastDay);
//   setsearchIPParams({status: 'Completed'})

// };

//   const handleMonthlyEmgadmittedPatientsClick = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth(); // 0-based (0 = Jan)

//   const firstDay = formatDate(new Date(year, month, 1));
//   const lastDay = formatDate(new Date(year, month + 1, 0));

//   console.log("Monthly filter from:", firstDay, "to:", lastDay);

//   setDateOption('custom');
//   setFromDate(firstDay);
//   setToDate(lastDay);
//   setsearchEmergencyParams({status: 'Admitted'})

// };

//   const handleMonthlyEmgdischargedPatientsClick = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth(); // 0-based (0 = Jan)

//   const firstDay = formatDate(new Date(year, month, 1));
//   const lastDay = formatDate(new Date(year, month + 1, 0));

//   console.log("Monthly filter from:", firstDay, "to:", lastDay);

//   setDateOption('custom');
//   setFromDate(firstDay);
//   setToDate(lastDay);
//   setsearchEmergencyParams({status: 'Completed'})

// };


// const handleYearlyPatientsClick = (year) => {
//   const now = new Date();
//   const safeYear = typeof year === "number" ? year : now.getFullYear();

//   try {
//     const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
//     const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

//     console.log("Yearly filter from:", firstDay, "to:", lastDay);

//     setDateOption('custom');
//     setOpDateOption('custom');
//     setFromDate(firstDay);
//     setToDate(lastDay);
    
//   } catch (error) {
//     console.error("Invalid date in handleYearlyPatientsClick:", error);
//   }
// };

// const handleYearlyIPadmittedPatientsClick = (year) => {
//   const now = new Date();
//   const safeYear = typeof year === "number" ? year : now.getFullYear();

//   try {
//     const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
//     const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

//     console.log("Yearly filter from:", firstDay, "to:", lastDay);

//     setDateOption('custom');
//     setFromDate(firstDay);
//     setToDate(lastDay);
//     setsearchIPParams({status: 'Admitted'})

//   } catch (error) {
//     console.error("Invalid date in handleYearlyPatientsClick:", error);
//   }
// };

// const handleYearlyIPdischargedPatientsClick = (year) => {
//   const now = new Date();
//   const safeYear = typeof year === "number" ? year : now.getFullYear();

//   try {
//     const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
//     const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

//     console.log("Yearly filter from:", firstDay, "to:", lastDay);

//     setDateOption('custom');
//     setFromDate(firstDay);
//     setToDate(lastDay);
//     setsearchIPParams({status: 'Completed'})

//   } catch (error) {
//     console.error("Invalid date in handleYearlyPatientsClick:", error);
//   }
// };

// const handleYearlyEmgadmittedPatientsClick = (year) => {
//   const now = new Date();
//   const safeYear = typeof year === "number" ? year : now.getFullYear();

//   try {
//     const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
//     const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

//     console.log("Yearly filter from:", firstDay, "to:", lastDay);

//     setDateOption('custom');
//     setFromDate(firstDay);
//     setToDate(lastDay);
//     setsearchEmergencyParams({status: 'Admitted'})

//   } catch (error) {
//     console.error("Invalid date in handleYearlyPatientsClick:", error);
//   }
// };

// const handleYearlyEmgdischargedPatientsClick = (year) => {
//   const now = new Date();
//   const safeYear = typeof year === "number" ? year : now.getFullYear();

//   try {
//     const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
//     const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

//     console.log("Yearly filter from:", firstDay, "to:", lastDay);

//     setDateOption('custom');
//     setFromDate(firstDay);
//     setToDate(lastDay);
//     setsearchEmergencyParams({status: 'Completed'})

//   } catch (error) {
//     console.error("Invalid date in handleYearlyPatientsClick:", error);
//   }
// };





//   useEffect(() => {

//     if (selectedType !== "IP") return;


//     const params = {};

//     console.log(searchIPParams, 'searchIPParams');


//     if (!searchIPParams?.query || typeof searchIPParams.query !== "string") {
//       searchIPParams.query = "";
//     }


//     if (searchIPParams.query?.trim()) {
//       params.query = searchIPParams.query.trim();  // ✅ Use searchOPParams.query
//     } else {
//       params.limit = 10; // Default limit if no search query
//     }





//     if (/^\d{10}$/.test(searchIPParams.query)) {
//       params.query = searchIPParams.query; //for mobile number
//     } else if (searchIPParams.query.trim()) { // for firstname ,middle name and lastame
//       const nameParts = searchIPParams.query.trim().split(" ");
//       if (nameParts.length === 1) params.query = nameParts[0];
//       if (nameParts.length === 2) params.query = nameParts[1];
//       if (nameParts.length > 2) {
//         params.query = nameParts.slice(1, -1).join(" ");
//         params.query = nameParts[nameParts.length - 1];
//       }
//     }

//     // if (searchIPParams?.status) {
//     //   params.status = searchIPParams.status;
//     // }

//     if (searchIPParams?.status && searchIPParams.status !== "") {
//       params.status = searchIPParams.status;
//     }
//     if (searchIPParams?.User) {
//       params.User = searchIPParams.User;
//     }

//     if (searchIPParams.type) {
//       params.type = searchIPParams.type;
//     }

//     if (searchIPParams.DoctorId) {
//       params.DoctorId = searchIPParams.DoctorId;
//     }



//     if (dateOption === 'custom') {
//       if (fromDate && toDate) {
//         params.fromDate = fromDate;
//         params.toDate = toDate;
//       } else {
//         setPatientIPRegisterData([]); // Clear the data if both dates are not provided
//         return;
//       }
//     } else if (dateOption === 'current') {
//       if (CurrentDate) {
//         params.CurrentDate = CurrentDate;

//       } else {
//         setPatientIPRegisterData([]);
//         return;
//       }



//     } else if (dateOption === 'particular') {
//       if (ParticularDate) {
//         params.ParticularDate = ParticularDate;

//       } else {
//         setPatientIPRegisterData([]); // Clear data if no particular date is selected
//         return;
//       }
//     }

//     console.log(params, 'params333333333');


//     axios
//       .get(`${UrlLink}Frontoffice/Total_IP_Patients_List`, {
//         params
//       })
//       .then((res) => {
//         console.log("API Response:", res.data);
//         const ress = res.data.appointments;

//         const todayAdmittedIPcount = res.data.today_Admitted_IP_count;
//         const monthlyAdmittedIPcount = res.data.monthly_Admitted_IP_count;
//         const yearlyAdmittedIPcount = res.data.yearly_Admitted_IP_count;
//         const todayDischargedIPcount = res.data.today_Discharged_IP_count;
//         const monthlyDischargedIPcount = res.data.monthly_Discharged_IP_count;
//         const yearlyDischargedIPcount = res.data.yearly_Discharged_IP_count;
        
//         setTodayAdmittedIPcount(todayAdmittedIPcount);
//         setMonthlyAdmittedIPcount(monthlyAdmittedIPcount);
//         setYearlyAdmittedIPcount(yearlyAdmittedIPcount);
//         setTodayDischargedIPcount(todayDischargedIPcount);
//         setMonthlyDischargedIPcount(monthlyDischargedIPcount);
//         setYearlyDischargedIPcount(yearlyDischargedIPcount);



//         if (Array.isArray(ress)) {
//           setPatientIPRegisterData(ress);
//           console.log(ress);
//         } else {
//           setPatientIPRegisterData([]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink, searchIPParams, UserData, dateOption, fromDate, toDate, ParticularDate, CurrentDate]);



//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Frontoffice/get_patient_casuality_details`, {
//         params: searchCasualityParams,
//       })
//       .then((res) => {
//         console.log("Casualityyyy", res.data);
//         const ress = res.data;
//         if (Array.isArray(ress)) {
//           setPatientCasualityRegisterData(ress);
//           console.log(ress);
//         } else {
//           setPatientCasualityRegisterData([]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink, searchCasualityParams]);

//   useEffect(() => {


//     if (selectedType !== "EMERGENCY") return;

//     const params = {};

//     if (!searchEmergencyParams?.query || typeof searchEmergencyParams.query !== "string") {
//       searchEmergencyParams.query = ""; // Default empty string
//     }



//     if (searchEmergencyParams.query?.trim()) {
//       params.query = searchEmergencyParams.query.trim();  // ✅ Use searchOPParams.query
//     } else {
//       params.limit = 10; // Default limit if no search query
//     }

//     if (/^\d{10}$/.test(searchEmergencyParams.query)) {
//       params.query = searchEmergencyParams.query; //for mobile number
//     } else if (searchEmergencyParams.query.trim()) { // for firstname ,middle name and lastame
//       const nameParts = searchEmergencyParams.query.trim().split(" ");
//       if (nameParts.length === 1) params.query = nameParts[0];
//       if (nameParts.length === 2) params.query = nameParts[1];
//       if (nameParts.length > 2) {
//         params.query = nameParts.slice(1, -1).join(" ");
//         params.query = nameParts[nameParts.length - 1];
//       }
//     }

//     // if (searchEmergencyParams.status) {
//     //   params.status = searchEmergencyParams.status;
//     // }

//     if (searchEmergencyParams?.status && searchEmergencyParams.status !== "") {
//       params.status = searchEmergencyParams.status;
//     }

//     if (searchEmergencyParams.DoctorId) {
//       params.DoctorId = searchEmergencyParams.DoctorId;
//     }
//     if (searchEmergencyParams.User) {
//       params.User = searchEmergencyParams.User;
//     }

//     if (dateOption === 'custom') {
//       if (fromDate && toDate) {
//         params.fromDate = fromDate;
//         params.toDate = toDate;
//       } else {
//         setPatientEmergencyRegisterData([]); // Clear the data if both dates are not provided
//         return;
//       }
//     } else if (dateOption === 'current') {
//       if (CurrentDate) {
//         params.CurrentDate = CurrentDate;

//       } else {
//         setPatientEmergencyRegisterData([]);
//         return;
//       }



//     } else if (dateOption === 'particular') {
//       if (ParticularDate) {
//         params.ParticularDate = ParticularDate;

//       } else {
//         setPatientEmergencyRegisterData([]); // Clear data if no particular date is selected
//         return;
//       }
//     }

//     console.log(params, 'params4444444444444');


//     axios
//       .get(`${UrlLink}Frontoffice/Total_Emergency_patients_List`, {
//         params
//       })
//       .then((res) => {
//         console.log("Emergencyyyyyyy", res.data);
//         const ress = res.data.appointments;
//         // const ress = res.data.appointments;
//         console.log("Emeryyyyyy", ress);

//         const todayAdmittedEmgcount = res.data.today_Admitted_Emg_count;
//         const monthlyAdmittedEmgcount = res.data.monthly_Admitted_Emg_count;
//         const yearlyAdmittedEmgcount = res.data.yearly_Admitted_Emg_count;
//         const todayDischargedEmgcount = res.data.today_Discharged_Emg_count;
//         const monthlyDischargedEmgcount = res.data.monthly_Discharged_Emg_count;
//         const yearlyDischargedEmgcount = res.data.yearly_Discharged_Emg_count;
        

//         setTodayAdmittedEmgcount(todayAdmittedEmgcount);
//         setMonthlyAdmittedEmgcount(monthlyAdmittedEmgcount);
//         setYearlyAdmittedEmgcount(yearlyAdmittedEmgcount);
//         setTodayDischargedEmgcount(todayDischargedEmgcount);
//         setMonthlyDischargedEmgcount(monthlyDischargedEmgcount);
//         setYearlyDischargedEmgcount(yearlyDischargedEmgcount);

//         if (Array.isArray(ress)) {
//           setPatientEmergencyRegisterData(ress);
//           console.log(ress);
//         } else {
//           setPatientEmergencyRegisterData([]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink, searchEmergencyParams, UserData, dateOption, fromDate, toDate, ParticularDate, CurrentDate]);

//   useEffect(() => {

//       if (selectedType !== "RADIOLOGY") return;  // ✅ Run only for OP


//     const datasearch = {
//       ...searchDiagnosisParams,
//       fromDate,
//       toDate,
//       ParticularDate,
//       CurrentDate,
//       dateOption
//     }
//     axios
//       .get(`${UrlLink}Frontoffice/get_diagnosis_patient_appointment_details`, {
//         params: datasearch,
//       })
//       .then((res) => {
//         console.log("API Response:", res.data);
//         const ress = res.data.appointments;
//         if (Array.isArray(ress)) {
//           setPatientDiagnosisRegisterData(ress);
//           setTodayRadiologyCount(res.data.today_total_Rad_count);
//           setMonthlyRadiologycount(res.data.monthly_total_Rad_count);
//           setYearlyRadiologycount(res.data.yearly_total_Rad_count);
//           console.log(ress);
//         } else {
//           setPatientDiagnosisRegisterData([]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink, searchDiagnosisParams,selectedType,dateOption, fromDate, toDate, ParticularDate,CurrentDate]);
 
//   useEffect(() => {

//   if (selectedType !== "LABORATORY") return;  // ✅ Run only for OP
//     const datasearch = {
//       ...searchLaboratoryParams,
//       fromDate,
//       toDate,
//       ParticularDate,
//       CurrentDate
//     }
//     axios
//       .get(`${UrlLink}Frontoffice/get_lab_patient_appointment_details`, {
//         params: datasearch,
//       })
//       .then((res) => {
//         console.log("API Response:", res.data);
//         const ress = res.data.appointments;
//         if (Array.isArray(ress)) {
//           setPatientLaboratoryRegisterData(ress);
//           setTodayLabCount(res.data.today_total_Lab_count);
//           setMonthlyLabcount(res.data.monthly_total_Lab_count);
//           setYearlyLabcount(res.data.yearly_total_Lab_count);
//           console.log(ress);
//         } else {
//           setPatientLaboratoryRegisterData([]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink, searchLaboratoryParams,selectedType,dateOption, fromDate, toDate, ParticularDate,CurrentDate]);

//   const PatientOPRegisterColumns = [
//     {
//       key: "id",
//       name: "ID",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientId",
//       name: "Patient Id",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientName",
//       name: "Patient Name",
//       width: 150,
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PhoneNo",
//       name: "PhoneNo",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     // {
//     //   key: "AppointmentId",
//     //   name: "Appointment Id",
//     // },
//     // {
//     //   key: "VisitId",
//     //   name: "Visit Id",
//     // },
    
//     // {
//     //   key: "isRefferal",
//     //   name: "isRefferal",
//     // },
//     {
//       key: "Status",
//       name: "Status",
//     },
//      {
//       key: "VisitType",
//       name: "VisitType",
//     },
    
//     {
//       key: "Specilization",
//       name: "Specilization",
//     },
//     {
//       key: "DoctorName",
//       name: "Doctor Name",
//     },
//     {
//       key:"PatientCategory",
//       name:"PatientCategory"
//     },
//     {
//       key:"created_by",
//       name:"createdby"
//     },
//     {
//       key: "Token",
//       name: "Token",
//       renderCell: (params) => (
//         <>
//           <div className="weudygwe_uy8iu">
//             <Button onClick={() => handleOpenModal1("TokenCard", params.row)}>
//               Token
//             </Button>
//           </div>

//         </>
//       ),
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <>

//           <Button
//             className="cell_btn"
//             onClick={() => {

//               if (UserData?.Edit) {
//                 handleeditOPPatientRegister(params.row)
//               } else {
//                 handleRestrictedAction();
//               }

//             }
//             }
//           >
//             <EditIcon className="check_box_clrr_cancell" />
//           </Button>
//         </>
//       ),
//     },

//     {
//       key: "Barcode",
//       name: "Barcode",
//       renderCell: (params) =>
//       (
//         <div className="weudygwe_uy8iu">
//           <Button onClick={() => handleOpenModal("Barcode", params.row)}>
//             Barcode
//           </Button>
//         </div>
//       ),

//     },

//   ];


//   const getModalContent = () => {
//     if (!selectedRowData) return null;
//     const New = true;
//     switch (openModal) {
//       case 'Barcode':
//         return <AllPatienbarcode rowData={selectedRowData} newpatient={New} />;
      
//       default:
//         return null;
//     }
//   };


//   const getIPModalContent = () => {
//       if (!selectedRowData) return null;
//       const New = true;
//       switch (IPModal) {
//         case 'IpBarcode':
//           // return <AllPatienbarcod rowData={selectedRowData} newpatient={New} />;
//                   return <AllPatienbarcodeIP rowData={selectedRowData} newpatient={New} />;
  
//         default:
//           return null;
//       }
//     };



//   const PatientIPRegisterColumns = [
//     {
//       key: "id",
//       name: "ID",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientId",
//       name: "Patient Id",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "RegistrationId",
//       name: "IP.No",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "RoomNo",
//       name: "Room No",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientName",
//       name: "Patient Name",
//       width: 150,
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PhoneNo",
//       name: "PhoneNo",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     // {
//     //   key: "AppointmentId",
//     //   name: "Appointment Id",
//     // },

//     {
//       key: "isRefferal",
//       name: "isRefferal",
//     },
//     {
//       key: "Status",
//       name: "Status",
//     },
//     {
//       key: "Specilization",
//       name: "Specilization",
//     },
//     {
//       key: "DoctorName",
//       name: "Doctor Name",
//     },
//     {
//       key:"created_by",
//       name:"createdby"
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => {
//               if (UserData?.Edit) {
//                 handleeditIPPatientRegister(params.row)
//               } else {
//                 handleRestrictedAction();
//               }
//             }
//             }
//           >
//             <EditIcon className="check_box_clrr_cancell" />
//           </Button>
//         </>
//       ),
//     },

//     {
//       key: "Barcode",
//       name: "Barcode",
//       renderCell: (params) =>
//       (
//         <div className="weudygwe_uy8iu">
//           <Button onClick={() => handleIPOpenModal("IpBarcode", params.row)}>
//             Barcode
//           </Button>         
//         </div>
//       ),
//     },

//   ];



//   //   const getModalContentip = () => {
//   //   if (!selectedRowData) return null;
//   //   const New = true;
//   //   switch (openModal) {
//   //     case 'IpBarcode':
//   //       return <AllPatienbarcodeIP rowData={selectedRowData} newpatient={New} />;
//   //     default:
//   //       return null;
//   //   }
//   // };






//   const PatientCasualityRegisterColumns = [
//     {
//       key: "id",
//       name: "ID",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientId",
//       name: "Patient Id",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientName",
//       name: "Patient Name",
//       width: 150,
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PhoneNo",
//       name: "PhoneNo",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "VisitId",
//       name: "Visit Id",
//     },
//     {
//       key: "Complaint",
//       name: "Complaint",
//     },
//     {
//       key: "isMLC",
//       name: "isMLC",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "Flagging",
//       name: "Flagging",
//     },
//     {
//       key: "isRefferal",
//       name: "isRefferal",
//     },
//     {
//       key: "Status",
//       name: "Status",
//     },
//     {
//       key: "Specilization",
//       name: "Specilization",
//     },
//     {
//       key: "DoctorName",
//       name: "Doctor Name",
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => handleeditCasualityPatientRegister(params.row)}
//           >
//             <EditIcon className="check_box_clrr_cancell" />
//           </Button>
//         </>
//       ),
//     },
//     {
//       key: "Barcode",
//       name: "Barcode",
//       renderCell: (params) =>
//       (
//         <div className="weudygwe_uy8iu">
//           <Button onClick={() => handleOpenModal("Barcode", params.row)}>
//             Barcode
//           </Button>
//         </div>
//       ),

//     },
//   ];


//   const PatientEmergencyRegisterColumns = [
//     {
//       key: "id",
//       name: "ID",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientId",
//       name: "Patient Id",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientName",
//       name: "Patient Name",
//       width: 150,
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PhoneNo",
//       name: "PhoneNo",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "VisitId",
//       name: "Visit Id",
//     },
    
//     {
//       key: "isRefferal",
//       name: "isRefferal",
//     },
//     {
//       key: "Status",
//       name: "Status",
//     },
//     {
//       key: "Specilization",
//       name: "Specilization",
//     },
//     {
//       key: "DoctorName",
//       name: "Doctor Name",
//     },
//     {
//       key:"created_by",
//       name:"createdby"
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => {
//               if (UserData?.Edit) {
//                 handleeditEmergencyPatientRegister(params.row)
//               } else {
//                 handleRestrictedAction();
//               }
//             }}
//           >
//             <EditIcon className="check_box_clrr_cancell" />
//           </Button>
//         </>
//       ),
//     },
//     {
//       key: "Barcode",
//       name: "Barcode",
//       renderCell: (params) =>
//       (
//         <div className="weudygwe_uy8iu">
//           <Button onClick={() => handleOpenModal("Barcode", params.row)}>
//             Barcode
//           </Button>
//         </div>
//       ),

//     },
//   ];

//   const PatientDiagnosisRegisterColumns = [
//     {
//       key: "id",
//       name: "ID",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientId",
//       name: "Patient Id",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientName",
//       name: "Patient Name",
//       width: 150,
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PhoneNo",
//       name: "PhoneNo",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "VisitId",
//       name: "Visit Id",
//     },
//     {
//       key: "isRefferal",
//       name: "isRefferal",
//     },
//     {
//       key: "Status",
//       name: "Status",
//     },
//     {
//       key:"created_by",
//       name:"createdby"
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => {
//               if (UserData?.Edit) {
//                 handleeditDiagnosisPatientRegister(params.row)
//               } else {
//                 handleRestrictedAction();
//               }
//             }
//             }
//           >
//             <EditIcon className="check_box_clrr_cancell" />
//           </Button>
//         </>
//       ),
//     },
//     {
//       key: "Barcode",
//       name: "Barcode",
//       renderCell: (params) =>
//       (
//         <div className="weudygwe_uy8iu">
//           <Button onClick={() => handleOpenModal("Barcode", params.row)}>
//             Barcode
//           </Button>
//         </div>
//       ),

//     },
//   ];
//  const PatientLaboratoryRegisterColumns = [
//     {
//       key: "id",
//       name: "ID",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientId",
//       name: "Patient Id",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PatientName",
//       name: "Patient Name",
//       width: 150,
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "PhoneNo",
//       name: "PhoneNo",
//       frozen: pagewidth > 500 ? true : false,
//     },
//     {
//       key: "isRefferal",
//       name: "isRefferal",
//     },
//     {
//       key: "Status",
//       name: "Status",
//     },
//     {
//       key: "Bill_Status",
//       name: "Bill_Status"
//     },
//     {
//       key:"created_by",
//       name:"createdby"
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => {
//               if (UserData?.Edit) {
//                 handleeditLaboratoryPatientRegister(params.row)
//               } else {
//                 handleRestrictedAction();
//               }
//             }}
//           >
//             <EditIcon className="check_box_clrr_cancell" />
//           </Button>
//         </>
//       ),
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => {
//               if (UserData?.Read) {
//                 console.log(params.row.testlist,'paramssss')                
//                 setViewtest(params.row.testlist)
//                 setlabModal(true);
//               } else {
//                 handleRestrictedAction();
//               }
//             }}
//           >
//             <VisibilityIcon className="check_box_clrr_cancell" />
//           </Button>
//         </>
//       ),
//     },
//     {
//       key: "Barcode",
//       name: "Barcode",
//       renderCell: (params) =>
//       (
//         <div className="weudygwe_uy8iu">
//           <Button onClick={() => handleOpenModal("Barcode", params.row)}>
//             Barcode
//           </Button>
//         </div>
//       ),
 
//     },
//   ];
 


//   const [openModal1, setOpenModal1] = useState(false);

//   const [modalContent, setModalContent] = useState("");

//   const handleOpenModal1 = (modalType, rowData) => {
//     setOpenModal1(modalType);
//     setSelectedRowData(rowData);
//   };


//   const handleCloseModal1 = () => {
//     setOpenModal1(null);
//     setSelectedRowData(null);
//   };



//  const handleDateOptionChange = (e) => {
//     setDateOption(e.target.value);
//     setOpDateOption(e.target.value);

//     // Reset date states when changing the selection
//     if (e.target.value === 'current') {
//       console.log(e.target.value,'e.target.value');
      
//       setFromDate('');
//       setToDate('');
//       setParticularDate('');
//       setsearchOPParams({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
//       setsearchIPParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || ''})
//       setsearchEmergencyParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
//     } else if (e.target.value === 'custom') {
//       setParticularDate('');
//       setCurrentDate('');
//       setsearchOPParams({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
//       setsearchIPParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
//       setsearchEmergencyParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
//     } else if (e.target.value === 'particular') {
//       setFromDate('');
//       setToDate('');
//       setCurrentDate('');
//       setsearchOPParams({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
//       setsearchIPParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
//       setsearchEmergencyParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
//     }
//      else if (e.target.value === 'all') {
//       setFromDate('');
//       setToDate('');
//       setCurrentDate('');
//       setParticularDate('');
//       setsearchOPParams({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '' , User:UserData?.username || ''})
//       setsearchIPParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '' , User:UserData?.username || ''})
//       setsearchEmergencyParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '' , User:UserData?.username || ''})
//     }
//   };

//   const handleCurrentDateChange = (e) => {
//     setCurrentDate(e.target.value);
//   };


//   const handleFromDateChange = (e) => {
//     setFromDate(e.target.value);
//   };

//   const handleToDateChange = (e) => {
//     setToDate(e.target.value);
//   };

//   const handleParticularDateChange = (e) => {
//     setParticularDate(e.target.value);
//   };


//   const handlenewPatientRegister = () => {
//     dispatchvalue({ type: "Registeredit", value: {} });
//     dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
//     navigate("/Home/FrontOfficeFolder");
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   };
//   const handlenewIPPatientRegister = () => {
//     dispatchvalue({ type: "Registeredit", value: {} });
//     dispatchvalue({ type: "HrFolder", value: "IPRegistration" });
//     navigate("/Home/FrontOfficeFolder");
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   };

//   const handleNewEmergencyPatientRegister = () => {
//     dispatchvalue({ type: "Registeredit", value: {} });
//     dispatchvalue({ type: "HrFolder", value: "PatientRegistration" });
//     navigate("/Home/FrontOfficeFolder");
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   };

//   const handleRestrictedAction = () => {
//     alert("You do not have permission to perform this action.");
//   };


//   const handleeditOPPatientRegister = (params) => {
//     // Destructure the id and PatientId from the params object
//     const { PatientId, VisitId, ...rest } = params;

//     // Log the entire params object for debugging purposes
//     console.log("paraaaammmmmsss", params);

//     dispatchvalue({ type: "ReferalDocPatient", value: {} });
    
//     // Dispatch an action to update the Redux store with the selected PatientId
//     dispatchvalue({
//       type: "Registeredit",
//       value: { ...params, Department: 'OP' },
//       // value: { PatientId: PatientId, VisitId: VisitId, Type: "OP", ...rest },
//     });

//     dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
//     navigate("/Home/FrontOfficeFolder");
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });

//     // Navigate to the registration page for editing the patient's details
//     // navigate("/Home/Registration");
//   };


//   const handleeditIPPatientRegister = (params) => {
//     // Destructure the id and PatientId from the params object
//     const { PatientId, ...rest } = params;

//     // Log the entire params object for debugging purposes
//     console.log("Ipppppppppp", params);

//     // Dispatch an action to update the Redux store with the selected PatientId
//     dispatchvalue({
//       type: "Registeredit",
//       value: { ...params, Department: 'IP', Nav: true },
//       // value: { PatientId: PatientId, Type: "IP", ...rest },
//     });

//     dispatchvalue({ type: "HrFolder", value: "IPRegistration" });
//     navigate("/Home/FrontOfficeFolder");
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });


//   };


//   const handleeditEmergencyPatientRegister = (params) => {
//     // Destructure the id and PatientId from the params object
//     const { PatientId, ...rest } = params;

//     // Log the entire params object for debugging purposes
//     console.log("Emergenccccccccy", params);

//     // Dispatch an action to update the Redux store with the selected PatientId
//     dispatchvalue({
//       type: "Registeredit",
//       value: params,
//       // value: { PatientId: PatientId, Type: "IP", ...rest },
//     });

//     dispatchvalue({ type: "HrFolder", value: "EmergencyPatientRoomRegistration" });
//     navigate("/Home/FrontOfficeFolder");
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });

//   };

//   const handleeditCasualityPatientRegister = (params) => {
//     const { PatientId, ...rest } = params;

//     console.log("Casualityyyyyyy", params);

//     dispatchvalue({
//       type: "Registeredit",
//       value: { PatientId: PatientId, Type: "Casuality", ...rest },
//     });

//     navigate("/Home/Registration");
//   };






//   const handleeditDiagnosisPatientRegister = (params) => {
//     const { PatientId, ...rest } = params;
 
//     console.log("Diagnosissssssss", params);
 
//     dispatchvalue({
//       type: "Registeredit",
//       value: { ...params, Department: 'RADIOLOGY' },
     
//     });
 
//     dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
//     navigate("/Home/FrontOfficeFolder");
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   };
 
//   const handleeditLaboratoryPatientRegister = (params) => {
//     // Destructure the id and PatientId from the params object
//     const { PatientId, ...rest } = params;
 
//     console.log("laboratoryyyyyyyy", params);
 
//     dispatchvalue({
//       type: "Registeredit",
//       value: { ...params, Department: 'LAB' },
//     });
 
//     dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
//     navigate("/Home/FrontOfficeFolder");
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   };

//   const handleSearchChange = (table, e) => {
//     if (table === "OP") {
//       setsearchOPParams({ ...searchOPParams, query: e.target.value });
//     } else if (table === "IP") {
//       setsearchIPParams({ ...searchIPParams, query: e.target.value });
//     } else if (table === "Casuality") {
//       setsearchCasualityParams({
//         ...searchCasualityParams,
//         query: e.target.value,
//       });
//     } else if (table === "Emergency") {
//       setsearchEmergencyParams({
//         ...searchEmergencyParams,
//         query: e.target.value,
//       });
//     } else if (table === "Diagnosis") {
//       setsearchDiagnosisParams({
//         ...searchDiagnosisParams,
//         query: e.target.value,
//       });
//     } else if (table === "Laboratory") {
//       setsearchLaboratoryParams({
//         ...searchLaboratoryParams,
//         query: e.target.value,
//       });
//     }
//   };



//   const handleStatusChange = (table, e) => {
//     console.log("Status selected:", e.target.value);
//     if (table === "OP") {
//       setsearchOPParams({ ...searchOPParams, status: e.target.value });
//     } else if (table === "IP") {
//       setsearchIPParams({ ...searchIPParams, status: e.target.value });
//     } else if (table === "Casuality") {
//       setsearchCasualityParams({ ...searchCasualityParams, status: e.target.value });
//     } else if (table === "Emergency") {
//       setsearchEmergencyParams({ ...searchEmergencyParams, status: e.target.value });
//     }
//     else if (table === "RADIOLOGY") {
//       setsearchDiagnosisParams({
//         ...searchDiagnosisParams, status: e.target.value
//       });
//     } else if (table === "Laboratory") {
//       setsearchLaboratoryParams({
//         ...searchLaboratoryParams, status: e.target.value,
//       });
//     }
//   };


//   useEffect(() => {
//     if (UserData?.username) {
//       setsearchOPParams((prev) => ({
//         ...prev,
//         User: UserData?.username,
//       }));
//       setsearchIPParams((prev) => ({
//         ...prev,
//         User: UserData?.username,
//       }));
//       setsearchEmergencyParams((prev) => ({
//         ...prev,
//         User: UserData?.username,
//       }));
//       setsearchDiagnosisParams((prev) => ({
//         ...prev,
//         User: UserData?.username,
//       }));
//       setsearchLaboratoryParams((prev) => ({
//         ...prev,
//         User: UserData?.username,
//       }));
//     }
//   }, [UserData]);


//   const handleUserChange = (event) => {
//     const { name, value } = event.target;

//     setsearchOPParams((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setsearchIPParams((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setsearchEmergencyParams((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setsearchDiagnosisParams((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setsearchLaboratoryParams((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };




  

//   const handleSelectChange = (event) => {
//     setSelectedType(event.target.value);
//     setDateOption('all');
//     setOpDateOption('current');
//     setCurrentDate(new Date().toISOString().split('T')[0]);
//     setFromDate('');
//     setToDate('');
//     setParticularDate('');
//     setsearchOPParams({ status: 'Registered',User: UserData?.username })
//     setsearchIPParams({ status: 'Admitted',User: UserData?.username })
//     setsearchEmergencyParams({ status: 'Admitted',User: UserData?.username })
//     setsearchDiagnosisParams({status: 'Registered',User: UserData?.username })
//     setsearchLaboratoryParams({status: 'Registered',User: UserData?.username })

//   };

// const getModalRadContent = () => {
 
//     if (!selectedRowData) return null;
//     const New = true;
//     switch (openModal) {
//       case 'Barcode':
//         // return <RadiologyBarcode rowData={selectedRowData} newpatient={New}/>;
//            return <RadiologyBarcode rowData={selectedRowData} newpatient={New}/>;
//       case 'BarcodeIP':
//         // return <RadiologyBarcode rowData={selectedRowData} newpatient={New}/>;
//            return <RadiologyBarcode rowData={selectedRowData} newpatient={New}/>;

//       default:
//         return null;
//     }
 
//   }

//   const [SearchQueryfilter, setSearchQueryfilter] = useState({
//         username : '',
//         VisitType : '',

//       });

//   const handleSearchChangefilter = (e) => {
//     const { name, value } = e.target;
//     setSearchQueryfilter((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };


//   useEffect(() => {
//     const { username ,VisitType} = SearchQueryfilter;

//     const filteredData = PatientRegisterData.filter((item) => {
//       const matchesUser = username
//         ? item.created_by.toLowerCase().includes(username.toLowerCase())
//         : true;

//       const matchVisitType = VisitType

//         ? item.VisitType.toLowerCase().includes(VisitType.toLowerCase())
//         : true;

//       return matchesUser && matchVisitType;
//     });

//     console.log(filteredData,'filteredData')

//     setfilteredOPlist(filteredData); 
//   }, [SearchQueryfilter, PatientRegisterData]);


//   const [SearchQueryIPfilter, setSearchQueryIPfilter] = useState({
//         username : '',
//         VisitType : '',

//       });

//   const handleSearchChangeIPfilter = (e) => {
//     const { name, value } = e.target;
//     setSearchQueryIPfilter((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };


//   useEffect(() => {
//     const { username} = SearchQueryIPfilter;

//     const filteredData = PatientIPRegisterData.filter((item) => {
//       const matchesUser = username
//         ? item.created_by.toLowerCase().includes(username.toLowerCase())
//         : true;

//       return matchesUser;
//     });

//     console.log(filteredData,'filteredData')

//     setfilteredIPlist(filteredData); 
//   }, [SearchQueryIPfilter, PatientIPRegisterData]);


//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Patient Register List</h3>

//         <div className="RegisterTypecon  navchange">
//           <div className="RegisterType">
//             {["OP", "IP", "EMERGENCY", "RADIOLOGY", "LABORATORY"].map(
//               (p, ind) => (
//                 <div className="registertypeval" key={ind + "key"}>
//                   <input
//                     type="radio"
//                     id={p}
//                     name="appointment_type"
//                     checked={selectedType === p}
//                     // checked={InsuranceClientForm === p}
//                     onChange={handleSelectChange}
//                     value={p}
//                   />
//                   <label htmlFor={p}>{p}</label>
//                 </div>
//               )
//             )}
//           </div>
//         </div>

//         <div className="content " style={{ width: "100%" }}>
          
          
//           {selectedType === "OP" && (
//             <>

//               <div className="DivCenter_container">OP Patient Details </div>

//               <div className="con_1 ">
//                 <div className="chart_body_1_child_1 dww3" onClick={handleTodayPatientsClick} style={{ cursor: "pointer" }}>
//                   <div className="chart_body_1_child_1_body">
//                       <div className="chart_body_1_child_1_body_icon">
//                       <PersonAddAlt1Icon />
//                       </div>
//                       <div className="chart_body_1_child_1_body_count">
//                       {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
//                       {/* <h3>20</h3> */}
//                       <h2>{TodayOPCount}</h2>

//                       </div>
//                       <div className="chart_body_1_child_1_body_name">
//                       Today Patients
//                       </div>
//                   </div>
//                 </div>
                
//                 <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                         <div className="chart_body_1_child_1_body_icon">
//                         <PersonIcon />
//                         </div>
//                         <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
//                         {/* <h3>30</h3> */}
//                         <h2>{MonthlyOPcount}</h2>
//                         </div>
//                         <div className="chart_body_1_child_1_body_name">
//                         Monthly Patients
//                         </div>
//                     </div>
//                 </div>
                
//                 <div className="chart_body_1_child_1 dww3" onClick={handleYearlyPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                     <div className="chart_body_1_child_1_body_icon">
//                         <Diversity1Icon />
//                     </div>
//                     <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                         {/* <h3>50</h3> */}
//                         <h2>{YearlyOPcount}</h2>
//                     </div>
//                     <div className="chart_body_1_child_1_body_name">
//                         Yearly Patients
//                     </div>
//                     </div>
//                 </div>
                
//               </div>

//               <div className="op-content">
                  
                
                
//                 <div className="search_div_bar">

//                   <button
//                     className="RegisterForm_1_btns choose_file_update"
//                     onClick={handlenewPatientRegister}
//                     data-tooltip-id="add-patient-tooltip"
//                   >
//                     <AddCircleIcon />
//                   </button>
//                   <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />


//                     <div className="search_div_bar_inp_1">
//                       <label> {" "} Date <span>:</span>{" "} </label>
//                       <select value={OpDateOption} onChange={handleDateOptionChange}
//                       >
//                         <option value="all">All</option>
//                         <option value="current">Current Date</option>
//                         <option value="custom">Custom Date</option>
//                         <option value="particular">Particular Date</option>
//                       </select>
//                     </div>

//                     {OpDateOption === 'current' && (
//                       <div className="search_div_bar_inp_1">
//                         <label>
//                           {" "}
//                           Current Date <span>:</span>{" "}
//                         </label>
//                         <input
//                           type="date"
//                           value={CurrentDate}
//                           disabled
//                           onChange={handleCurrentDateChange}
//                         />
//                       </div>
//                     )}

//                     {OpDateOption === 'custom' && (
//                       <>
//                         <div className="search_div_bar_inp_1">
//                           <label> {" "}From  <span>:</span> {" "}</label>

//                           <input
//                             type="date"
//                             placeholder="From Date"
//                             value={fromDate}
//                             onChange={handleFromDateChange}
//                           />

//                         </div> 
//                         <div className="search_div_bar_inp_1">

//                           <label> To  <span>:</span> </label>

//                           <input
//                             type="date"
//                             placeholder="To Date"
//                             value={toDate}
//                             onChange={handleToDateChange}
//                           />
//                         </div>
//                       </>
                    
//                     )}

                  
//                     <br />
//                     {OpDateOption === 'particular' && (
//                       <div className="search_div_bar_inp_1">
//                         <label>{" "} Select Date <span>:</span> {" "}</label>
//                         <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
//                       </div>
//                     )}

//                     <div className=" search_div_bar_inp_1">
//                       <label htmlFor="">
//                         Search by
//                         <span>:</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={searchOPParams.query}
//                         placeholder="Patient ID or Name or PhoneNo "
//                         onChange={(e) => handleSearchChange("OP", e)}
//                       />
//                     </div>

//                     <div className=" search_div_bar_inp_1">
//                       <label htmlFor="">
//                         Status
//                         <span>:</span>
//                       </label>
//                       <select
//                         id=""
//                         name="status"
//                         value={searchOPParams.status}
//                         onChange={(e) => handleStatusChange("OP", e)}
//                       >
//                         <option value="">Select</option>
//                         <option value="Registered">Registered</option>
//                         <option value="Paid">Paid</option>
//                         <option value="Due">Due</option>
//                         <option value="Completed">Completed</option>
//                       </select>
//                     </div>

//                     {/* <div className="search_div_bar_inp_1">
//                       <label htmlFor="userInput">
//                         User
//                         <span>:</span>
//                       </label>
//                       <input
//                         list="userOptions"
//                         id="userInput"
//                         name="User"
//                         value={searchOPParams.User}
//                         onChange={handleUserChange}
//                       />
//                       <datalist id="userOptions">
//                         {Array.from(
//                           new Set(PatientRegisterData?.map((item) => item.created_by))
//                         ).map((user, index) => (
//                           <option key={index} value={user} />
//                         ))}
//                       </datalist>
//                     </div> */}

//                     <div className="RegisForm_1">
//                       <label>
//                         User Name <span>:</span>
//                       </label>
//                       <input
//                         list="usernames"
//                         name="username"
//                         value={SearchQueryfilter.username}
//                         onChange={handleSearchChangefilter}
//                       />
//                       <datalist id="usernames">
//                         {Array.isArray(UserList) &&
//                           UserList.map((user, index) => (
//                             <option key={index} value={user.UserName} />
//                           ))}
//                       </datalist>
//                     </div>

//                     <div className="RegisForm_1">
//                       <label>
//                         VisitType<span>:</span>
//                       </label>
//                       <input
//                         list="VisitTypes"
//                         name="VisitType"
//                         value={SearchQueryfilter.VisitType}
//                         onChange={handleSearchChangefilter}
//                       />
//                       <datalist id="VisitTypes">
                        
//                             <option value='NewConsultation' />
//                             <option value='FollowUp No Fee' />
//                              <option value='FollowUp With Fee' />
                         
//                       </datalist>
//                     </div>

                    

//                   {/* <button
//                     className="search_div_bar_btn_1"
//                     onClick={handlenewPatientRegister}
//                     title="New Patient Register"
//                   >
//                     <LoupeIcon />
//                   </button> */}

//                 </div>
//                 <ReactGrid
//                   columns={PatientOPRegisterColumns}
//                   RowData={filteredOPlist}
//                 />
//               </div>
//              </>
           
          
//           )}

//           {selectedType === "IP" && (
//             <>
//               <div className="DivCenter_container">IP Patient Details </div>

//               <div className="con_1 ">
//                 <div className="chart_body_1_child_1 dww3" onClick={handleTodayIPadmittedPatientsClick} style={{ cursor: "pointer" }}>
//                   <div className="chart_body_1_child_1_body">
//                       <div className="chart_body_1_child_1_body_icon">
//                       <PersonAddAlt1Icon />
//                       </div>
//                       <div className="chart_body_1_child_1_body_count">
//                       {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
//                       {/* <h3>20</h3> */}
//                       <h2>{TodayAdmittedIPcount}</h2>

//                       </div>
//                       <div className="chart_body_1_child_1_body_name">
//                       Today Admitted 
//                       </div>
//                   </div>
//                 </div>
//                 <div className="chart_body_1_child_1 dww3" onClick={handleTodayIPdischargedPatientsClick} style={{ cursor: "pointer" }}>
//                   <div className="chart_body_1_child_1_body">
//                       <div className="chart_body_1_child_1_body_icon">
//                       <PersonAddAlt1Icon />
//                       </div>
//                       <div className="chart_body_1_child_1_body_count">
//                       {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
//                       {/* <h3>20</h3> */}
//                       <h2>{TodayDischargedIPcount}</h2>

//                       </div>
//                       <div className="chart_body_1_child_1_body_name">
//                       Today Discharged 
//                       </div>
//                   </div>
//                 </div>
                
//                 <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyIPadmittedPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                         <div className="chart_body_1_child_1_body_icon">
//                         <PersonIcon />
//                         </div>
//                         <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
//                         {/* <h3>30</h3> */}
//                         <h2>{MonthlyAdmittedIPcount}</h2>
//                         </div>
//                         <div className="chart_body_1_child_1_body_name">
//                         Monthly Admitted 
//                         </div>
//                     </div>
//                 </div>

//                 <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyIPdischargedPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                         <div className="chart_body_1_child_1_body_icon">
//                         <PersonIcon />
//                         </div>
//                         <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
//                         {/* <h3>30</h3> */}
//                         <h2>{MonthlyDischargedIPcount}</h2>
//                         </div>
//                         <div className="chart_body_1_child_1_body_name">
//                         Monthly Discharged 
//                         </div>
//                     </div>
//                 </div>
                
//                 <div className="chart_body_1_child_1 dww3" onClick={handleYearlyIPadmittedPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                     <div className="chart_body_1_child_1_body_icon">
//                         <Diversity1Icon />
//                     </div>
//                     <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                         {/* <h3>50</h3> */}
//                         <h2>{YearlyAdmittedIPcount}</h2>
//                     </div>
//                     <div className="chart_body_1_child_1_body_name">
//                         Yearly Admitted 
//                     </div>
//                     </div>
//                 </div>
//                 <div className="chart_body_1_child_1 dww3" onClick={handleYearlyIPdischargedPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                     <div className="chart_body_1_child_1_body_icon">
//                         <Diversity1Icon />
//                     </div>
//                     <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                         {/* <h3>50</h3> */}
//                         <h2>{YearlyDischargedIPcount}</h2>
//                     </div>
//                     <div className="chart_body_1_child_1_body_name">
//                         Yearly Discharged 
//                     </div>
//                     </div>
//                 </div>
                
//               </div>

//               <div className="ip-content">
//                 <div className="search_div_bar">
//                   <button
//                     className="RegisterForm_1_btns choose_file_update"
//                     onClick={handlenewIPPatientRegister}
//                     data-tooltip-id="add-patient-tooltip"
//                   >
//                     <AddCircleIcon />
//                   </button>


//                   <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />


//                   <div className="search_div_bar_inp_1">
//                     <label>{" "} Date <span>:</span>{" "}</label>
//                     <select value={dateOption} onChange={handleDateOptionChange}
//                     >
//                       <option value="all">All</option>
//                       <option value="current">Current Date</option>
//                       <option value="custom">Custom Date</option>
//                       <option value="particular">Particular Date</option>
//                     </select>
//                   </div>

//                     {dateOption === 'current' && (
                      
//                       <div className="search_div_bar_inp_1">
//                         <label>
//                           {" "}
//                           Current Date <span>:</span>{" "}
//                         </label>
//                         <input
//                           type="date"
//                           value={CurrentDate}
//                           disabled
//                           onChange={handleCurrentDateChange}
//                         />
//                       </div>
//                     )}

//                     {dateOption === 'custom' && (
//                       <>

//                         <div className="search_div_bar_inp_1">
//                           <label>{" "}
//                             From  <span>:</span>{" "}
//                           </label>

//                           <input
//                             type="date"
//                             placeholder="From Date"
//                             value={fromDate}
//                             onChange={handleFromDateChange}
//                           />
//                         </div>

//                         <div className="search_div_bar_inp_1">
//                           <label> {" "} 
//                             To  <span>:</span> {" "} </label>

//                           <input
//                             type="date"
//                             placeholder="To Date"
//                             value={toDate}
//                             onChange={handleToDateChange}
//                           />
//                         </div>
                        
                    
//                       </>
                      
//                     )}

                    
//                     <br />
//                     {dateOption === 'particular' && (
//                       <div className="search_div_bar_inp_1">
//                         <label> {" "}Select Date <span>:</span>{" "} </label>
//                         <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
//                       </div>
//                     )}

//                     <div className=" search_div_bar_inp_1">
//                       <label htmlFor="">
//                         Search by
//                         <span>:</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={searchIPParams.query}
//                         placeholder="Patient ID or Name or PhoneNo "
//                         onChange={(e) => handleSearchChange("IP", e)}
//                       />
//                     </div>

//                     <div className="RegisForm_1">
//                       <label>
//                         User Name <span>:</span>
//                       </label>
//                       <input
//                         list="usernames"
//                         name="username"
//                         value={SearchQueryIPfilter.username}
//                         onChange={handleSearchChangeIPfilter}
//                       />
//                       <datalist id="usernames">
//                         {Array.isArray(UserList) &&
//                           UserList.map((user, index) => (
//                             <option key={index} value={user.UserName} />
//                           ))}
//                       </datalist>
//                     </div>

                  
//                     <div className="search_div_bar_inp_1">
//                       <label htmlFor="">
//                         Status
//                         <span>:</span>
//                       </label>
//                       <select
//                         id=""
//                         name="status"
//                         value={searchIPParams.status}
//                         onChange={(e) => handleStatusChange("IP", e)}
//                       >
//                         <option value="">Select</option>
//                         <option value="Pending">Pending</option>
//                         <option value="Admitted">Admitted</option>
//                         <option value="Completed">Completed</option>
//                       </select>
//                     </div>

//                     {/* <div className="search_div_bar_inp_1">
//                       <label htmlFor="userInput">
//                         User
//                         <span>:</span>
//                       </label>
//                       <input
//                         list="userOptions"
//                         id="userInput"
//                         name="User"
//                         value={searchIPParams.User}
//                         onChange={handleUserChange}
//                       />
//                       <datalist id="userOptions">
//                         {Array.from(
//                           new Set(PatientIPRegisterData?.map((item) => item.created_by))
//                         ).map((user, index) => (
//                           <option key={index} value={user} />
//                         ))}
//                       </datalist>
//                     </div> */}
                  

//                   {/* <button
//                     className="search_div_bar_btn_1"
//                     onClick={handlenewIPPatientRegister}
//                     title="New Patient Register"
//                   >
//                     <LoupeIcon />
//                   </button> */}
//                 </div>
//                 <ReactGrid
//                   columns={PatientIPRegisterColumns}
//                   RowData={filteredIPlist}
//                 />
//               </div>
//             </>
            
//           )}

//           {/* {selectedType === "CASUALITY" && (
//             <div className="casuality-content">
//               <div className="DivCenter_container">
//                 Casuality Patient Details{" "}
//               </div>
//               <div className="search_div_bar">
//                 <div className=" search_div_bar_inp_1">
//                   <label htmlFor="">
//                     Search by
//                     <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={searchCasualityParams.query}
//                     placeholder="Patient ID or Name or PhoneNo "
//                     onChange={(e) => handleSearchChange("Casuality", e)}
//                   />
//                 </div>
//                 <div className=" RegisForm_1">
//                   <label htmlFor="">
//                     Status
//                     <span>:</span>
//                   </label>
//                   <select
//                     id=""
//                     name="status"
//                     value={searchCasualityParams.status}
//                     onChange={(e) => handleStatusChange("Casuality", e)}
//                   >
//                     <option value="">Select</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Completed">Completed</option>
//                   </select>
//                 </div>
//                 <button
//                   className="search_div_bar_btn_1"
//                   onClick={handlenewPatientRegister}
//                   title="New Patient Register"
//                 >
//                   <LoupeIcon />
//                 </button>
//               </div>
//               <ReactGrid
//                 columns={PatientCasualityRegisterColumns}
//                 RowData={PatientCasualityRegisterData}
//               />
//             </div>
//           )} */}

//           {selectedType === "EMERGENCY" && (
//             <>
//               <div className="DivCenter_container">Emergency Patient Details{" "}</div>

//                 <div className="con_1 ">
//                   <div className="chart_body_1_child_1 dww3" onClick={handleTodayEmgadmittedPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                         <div className="chart_body_1_child_1_body_icon">
//                         <PersonAddAlt1Icon />
//                         </div>
//                         <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
//                         {/* <h3>20</h3> */}
//                         <h2>{TodayAdmittedEmgcount}</h2>

//                         </div>
//                         <div className="chart_body_1_child_1_body_name">
//                         Today Admitted 
//                         </div>
//                     </div>
//                   </div>
//                   <div className="chart_body_1_child_1 dww3" onClick={handleTodayEmgdischargedPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                         <div className="chart_body_1_child_1_body_icon">
//                         <PersonAddAlt1Icon />
//                         </div>
//                         <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
//                         {/* <h3>20</h3> */}
//                         <h2>{TodayDischargedEmgcount}</h2>

//                         </div>
//                         <div className="chart_body_1_child_1_body_name">
//                         Today Discharged 
//                         </div>
//                     </div>
//                   </div>
                  
//                   <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyEmgadmittedPatientsClick} style={{ cursor: "pointer" }}>
//                       <div className="chart_body_1_child_1_body">
//                           <div className="chart_body_1_child_1_body_icon">
//                           <PersonIcon />
//                           </div>
//                           <div className="chart_body_1_child_1_body_count">
//                           {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
//                           {/* <h3>30</h3> */}
//                           <h2>{MonthlyAdmittedEmgcount}</h2>
//                           </div>
//                           <div className="chart_body_1_child_1_body_name">
//                           Monthly Admitted 
//                           </div>
//                       </div>
//                   </div>

//                   <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyEmgdischargedPatientsClick} style={{ cursor: "pointer" }}>
//                       <div className="chart_body_1_child_1_body">
//                           <div className="chart_body_1_child_1_body_icon">
//                           <PersonIcon />
//                           </div>
//                           <div className="chart_body_1_child_1_body_count">
//                           {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
//                           {/* <h3>30</h3> */}
//                           <h2>{MonthlyDischargedEmgcount}</h2>
//                           </div>
//                           <div className="chart_body_1_child_1_body_name">
//                           Monthly Discharged 
//                           </div>
//                       </div>
//                   </div>
                  
//                   <div className="chart_body_1_child_1 dww3" onClick={handleYearlyEmgadmittedPatientsClick} style={{ cursor: "pointer" }}>
//                       <div className="chart_body_1_child_1_body">
//                       <div className="chart_body_1_child_1_body_icon">
//                           <Diversity1Icon />
//                       </div>
//                       <div className="chart_body_1_child_1_body_count">
//                           {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                           {/* <h3>50</h3> */}
//                           <h2>{YearlyAdmittedEmgcount}</h2>
//                       </div>
//                       <div className="chart_body_1_child_1_body_name">
//                           Yearly Admitted 
//                       </div>
//                       </div>
//                   </div>
//                   <div className="chart_body_1_child_1 dww3" onClick={handleYearlyEmgdischargedPatientsClick} style={{ cursor: "pointer" }}>
//                       <div className="chart_body_1_child_1_body">
//                       <div className="chart_body_1_child_1_body_icon">
//                           <Diversity1Icon />
//                       </div>
//                       <div className="chart_body_1_child_1_body_count">
//                           {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                           {/* <h3>50</h3> */}
//                           <h2>{YearlyDischargedEmgcount}</h2>
//                       </div>
//                       <div className="chart_body_1_child_1_body_name">
//                           Yearly Discharged 
//                       </div>
//                       </div>
//                   </div>
                
//                 </div>
//               <div className="casuality-content">
//                 <div className="search_div_bar">

//                   <button
//                     className="RegisterForm_1_btns choose_file_update"
//                     onClick={handleNewEmergencyPatientRegister}
//                     data-tooltip-id="add-patient-tooltip"
//                   >
//                     <AddCircleIcon />
//                   </button>


//                   <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />

//                   <div className="search_div_bar_inp_1">
//                     <label> {" "}Date <span>:</span>{" "} </label>
//                     <select
//                       value={dateOption}
//                       onChange={handleDateOptionChange}
//                     >
//                       <option value="all">All</option>
//                       <option value="current">Current Date</option>
//                       <option value="custom">Custom Date</option>
//                       <option value="particular">Particular Date</option>
//                     </select>
//                   </div>

//                   {dateOption === 'current' && (
//                     <div className="search_div_bar_inp_1">
//                       <input
//                         type="date"
//                         value={CurrentDate}
//                         disabled
//                         onChange={handleCurrentDateChange}
//                       />
//                     </div>
//                   )}

//                   {dateOption === 'custom' && (
//                     <>
//                       <div className="search_div_bar_inp_1">
//                         <label> From  <span>:</span> </label>

//                         <input
//                           type="date"
//                           placeholder="From Date"
//                           value={fromDate}
//                           onChange={handleFromDateChange}
//                         />
                        
//                       </div>
//                       <div className="search_div_bar_inp_1">
//                         <label> To  <span>:</span> </label>

//                         <input
//                           type="date"
//                           placeholder="To Date"
//                           value={toDate}
//                           onChange={handleToDateChange}
//                         />
//                       </div>
//                     </>
                  
                    
//                   )}

//                   {/* Particular Date Input */}
//                   <br />
//                   {dateOption === 'particular' && (
//                     <div className="search_div_bar_inp_1">
//                       <label> Select Date <span>:</span> </label>
//                       <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
//                     </div>
//                   )}
                  

//                   <div className=" search_div_bar_inp_1">
//                     <label htmlFor="">
//                       Search by
//                       <span>:</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={searchEmergencyParams.query}
//                       placeholder="Patient ID or Name or PhoneNo "
//                       onChange={(e) => handleSearchChange("Emergency", e)}
//                     />
//                   </div>

//                   <div className=" search_div_bar_inp_1">
//                     <label htmlFor="">
//                       Status
//                       <span>:</span>
//                     </label>
//                     <select
//                       id=""
//                       name="status"
//                       value={searchEmergencyParams.status}
//                       onChange={(e) => handleStatusChange("Emergency", e)}
//                     >
//                       <option value="">Select</option>
//                       <option value="Admitted">Admitted</option>
//                       <option value="Completed">Completed</option>
//                     </select>
//                   </div>

//                   <div className="search_div_bar_inp_1">
//                       <label htmlFor="userInput">
//                         User
//                         <span>:</span>
//                       </label>
//                       <input
//                         list="userOptions"
//                         id="userInput"
//                         name="User"
//                         value={searchEmergencyParams.User}
//                         onChange={handleUserChange}
//                       />
//                       <datalist id="userOptions">
//                         {Array.from(
//                           new Set(PatientEmergencyRegisterData?.map((item) => item.created_by))
//                         ).map((user, index) => (
//                           <option key={index} value={user} />
//                         ))}
//                       </datalist>
//                     </div>

                



//                   {/* <button
//                     className="search_div_bar_btn_1"
//                     onClick={handleNewEmergencyPatientRegister}
//                     title="New Patient Register"
//                   >
//                     <LoupeIcon />
//                   </button> */}
//                 </div>
//                 <ReactGrid
//                   columns={PatientEmergencyRegisterColumns}
//                   RowData={PatientEmergencyRegisterData}
//                 />
//               </div>
//             </>
            
//           )}

//           {selectedType === "RADIOLOGY" && (
//             <div className="diagnosis-content">
//               <div className="DivCenter_container">
//                 RADIOLOGY Patient Details{" "}
//               </div>

//                <div className="con_1 ">
//                 <div className="chart_body_1_child_1 dww3" onClick={handleTodayPatientsClick} style={{ cursor: "pointer" }}>
//                   <div className="chart_body_1_child_1_body">
//                       <div className="chart_body_1_child_1_body_icon">
//                       <PersonAddAlt1Icon />
//                       </div>
//                       <div className="chart_body_1_child_1_body_count">
//                       {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
//                       {/* <h3>20</h3> */}
//                       <h2>{TodayRadiologyCount}</h2>

//                       </div>
//                       <div className="chart_body_1_child_1_body_name">
//                       Today Patients
//                       </div>
//                   </div>
//                 </div>
                
//                 <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                         <div className="chart_body_1_child_1_body_icon">
//                         <PersonIcon />
//                         </div>
//                         <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
//                         {/* <h3>30</h3> */}
//                         <h2>{MonthlyRadiologycount}</h2>
//                         </div>
//                         <div className="chart_body_1_child_1_body_name">
//                         Monthly Patients
//                         </div>
//                     </div>
//                 </div>
                
//                 <div className="chart_body_1_child_1 dww3" onClick={handleYearlyPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                     <div className="chart_body_1_child_1_body_icon">
//                         <Diversity1Icon />
//                     </div>
//                     <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                         {/* <h3>50</h3> */}
//                         <h2>{YearlyRadiologycount}</h2>
//                     </div>
//                     <div className="chart_body_1_child_1_body_name">
//                         Yearly Patients
//                     </div>
//                     </div>
//                 </div>
                
//               </div>

//               <div className="search_div_bar">

//                 <button
//                   className="RegisterForm_1_btns choose_file_update"
//                   onClick={handlenewPatientRegister}
//                   data-tooltip-id="add-patient-tooltip"
//                 >
//                   <AddCircleIcon />
//                 </button>

//                 <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />

//                 <div className="search_div_bar_inp_1">
//                       <label> {" "} Date <span>:</span>{" "} </label>
//                       <select value={dateOption} onChange={handleDateOptionChange}
//                       >
//                         <option value="all">All</option>
//                         <option value="current">Current Date</option>
//                         <option value="custom">Custom Date</option>
//                         <option value="particular">Particular Date</option>
//                       </select>
//                     </div>

//                     {dateOption === 'current' && (
//                       <div className="search_div_bar_inp_1">
//                         <label>
//                           {" "}
//                           Current Date <span>:</span>{" "}
//                         </label>
//                         <input
//                           type="date"
//                           value={CurrentDate}
//                           disabled
//                           onChange={handleCurrentDateChange}
//                         />
//                       </div>
//                     )}

//                     {dateOption === 'custom' && (
//                       <>
//                         <div className="search_div_bar_inp_1">
//                           <label> {" "}From  <span>:</span> {" "}</label>

//                           <input
//                             type="date"
//                             placeholder="From Date"
//                             value={fromDate}
//                             onChange={handleFromDateChange}
//                           />

//                         </div> 
//                         <div className="search_div_bar_inp_1">

//                           <label> To  <span>:</span> </label>

//                           <input
//                             type="date"
//                             placeholder="To Date"
//                             value={toDate}
//                             onChange={handleToDateChange}
//                           />
//                         </div>
//                       </>
                    
//                     )}

                  
//                     <br />
//                     {dateOption === 'particular' && (
//                       <div className="search_div_bar_inp_1">
//                         <label>{" "} Select Date <span>:</span> {" "}</label>
//                         <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
//                       </div>
//                     )}

//                 <div className=" search_div_bar_inp_1">
//                   <label htmlFor="">
//                     Search by
//                     <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={searchDiagnosisParams.query}
//                     placeholder="Patient ID or Name or PhoneNo "
//                     onChange={(e) => handleSearchChange("RADIOLOGY", e)}
//                   />
//                 </div>

//                 <div className=" search_div_bar_inp_1">
//                   <label htmlFor="">
//                     Status
//                     <span>:</span>
//                   </label>
//                   <select
//                     id=""
//                     name="status"
//                     value={searchDiagnosisParams.status}
//                     onChange={(e) => handleStatusChange("RADIOLOGY", e)}
//                   >
//                     <option value="">Select</option>
//                     <option value="Registered">Registered</option>
//                     <option value="Completed">Completed</option>
//                   </select>
//                 </div>

//                  <div className="search_div_bar_inp_1">
//                     <label htmlFor="userInput">
//                       User
//                       <span>:</span>
//                     </label>
//                     <input
//                       list="userOptions"
//                       id="userInput"
//                       name="User"
//                       value={searchDiagnosisParams.User}
//                       onChange={handleUserChange}
//                     />
//                     <datalist id="userOptions">
//                       {Array.from(
//                         new Set(PatientDiagnosisRegisterData?.map((item) => item.created_by))
//                       ).map((user, index) => (
//                         <option key={index} value={user} />
//                       ))}
//                     </datalist>
//                   </div>

//                 {/* <button
//                   className="search_div_bar_btn_1"
//                   onClick={handlenewPatientRegister}
//                   title="New Patient Register"
//                 >
//                   <LoupeIcon />
//                 </button> */}
//               </div>
//               <ReactGrid
//                 columns={PatientDiagnosisRegisterColumns}
//                 RowData={PatientDiagnosisRegisterData}
//               />
//             </div>
//           )}

//           {selectedType === "LABORATORY" && (
//             <div className="laboratory-content">
//               <div className="DivCenter_container">
//                 Laboratory Patient Details{" "}
//               </div>


//                <div className="con_1 ">
//                 <div className="chart_body_1_child_1 dww3" onClick={handleTodayPatientsClick} style={{ cursor: "pointer" }}>
//                   <div className="chart_body_1_child_1_body">
//                       <div className="chart_body_1_child_1_body_icon">
//                       <PersonAddAlt1Icon />
//                       </div>
//                       <div className="chart_body_1_child_1_body_count">
//                       {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
//                       {/* <h3>20</h3> */}
//                       <h2>{TodayLabCount}</h2>

//                       </div>
//                       <div className="chart_body_1_child_1_body_name">
//                       Today Patients
//                       </div>
//                   </div>
//                 </div>
                
//                 <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                         <div className="chart_body_1_child_1_body_icon">
//                         <PersonIcon />
//                         </div>
//                         <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
//                         {/* <h3>30</h3> */}
//                         <h2>{MonthlyLabcount}</h2>
//                         </div>
//                         <div className="chart_body_1_child_1_body_name">
//                         Monthly Patients
//                         </div>
//                     </div>
//                 </div>
                
//                 <div className="chart_body_1_child_1 dww3" onClick={handleYearlyPatientsClick} style={{ cursor: "pointer" }}>
//                     <div className="chart_body_1_child_1_body">
//                     <div className="chart_body_1_child_1_body_icon">
//                         <Diversity1Icon />
//                     </div>
//                     <div className="chart_body_1_child_1_body_count">
//                         {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
//                         {/* <h3>50</h3> */}
//                         <h2>{YearlyLabcount}</h2>
//                     </div>
//                     <div className="chart_body_1_child_1_body_name">
//                         Yearly Patients
//                     </div>
//                     </div>
//                 </div>
                
//               </div>







//               <div className="search_div_bar">

//                 <button
//                   className="RegisterForm_1_btns choose_file_update"
//                   onClick={handlenewPatientRegister}
//                   data-tooltip-id="add-patient-tooltip"
//                 >
//                   <AddCircleIcon />
//                 </button>

//                 <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />

//                 <div className="search_div_bar_inp_1">
//                       <label> {" "} Date <span>:</span>{" "} </label>
//                       <select value={dateOption} onChange={handleDateOptionChange}
//                       >
//                         <option value="all">All</option>
//                         <option value="current">Current Date</option>
//                         <option value="custom">Custom Date</option>
//                         <option value="particular">Particular Date</option>
//                       </select>
//                     </div>

//                     {dateOption === 'current' && (
//                       <div className="search_div_bar_inp_1">
//                         <label>
//                           {" "}
//                           Current Date <span>:</span>{" "}
//                         </label>
//                         <input
//                           type="date"
//                           value={CurrentDate}
//                           disabled
//                           onChange={handleCurrentDateChange}
//                         />
//                       </div>
//                     )}

//                     {dateOption === 'custom' && (
//                       <>
//                         <div className="search_div_bar_inp_1">
//                           <label> {" "}From  <span>:</span> {" "}</label>

//                           <input
//                             type="date"
//                             placeholder="From Date"
//                             value={fromDate}
//                             onChange={handleFromDateChange}
//                           />

//                         </div> 
//                         <div className="search_div_bar_inp_1">

//                           <label> To  <span>:</span> </label>

//                           <input
//                             type="date"
//                             placeholder="To Date"
//                             value={toDate}
//                             onChange={handleToDateChange}
//                           />
//                         </div>
//                       </>
                    
//                     )}

                  
//                     <br />
//                     {dateOption === 'particular' && (
//                       <div className="search_div_bar_inp_1">
//                         <label>{" "} Select Date <span>:</span> {" "}</label>
//                         <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
//                       </div>
//                     )}

//                 <div className=" search_div_bar_inp_1">
//                   <label htmlFor="">
//                     Search by
//                     <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={searchLaboratoryParams.query}
//                     placeholder="Patient ID or Name or PhoneNo "
//                     onChange={(e) => handleSearchChange("Laboratory", e)}
//                   />
//                 </div>

//                 <div className=" search_div_bar_inp_1">
//                   <label htmlFor="">
//                     Status
//                     <span>:</span>
//                   </label>
//                   <select
//                     id=""
//                     name="status"
//                     value={searchLaboratoryParams.status}
//                     onChange={(e) => handleStatusChange("Laboratory", e)}
//                   >
//                     <option value="">Select</option>
//                     <option value="Registered">Registered</option>
//                     <option value="Paid">Paid</option>
//                     <option value="Completed">Completed</option>
//                   </select>
//                 </div>

//                 <div className="search_div_bar_inp_1">
//                   <label htmlFor="userInput">
//                     User
//                     <span>:</span>
//                   </label>
//                   <input
//                     list="userOptions"
//                     id="userInput"
//                     name="User"
//                     value={searchLaboratoryParams.User}
//                     onChange={handleUserChange}
//                   />
//                   <datalist id="userOptions">
//                     {Array.from(
//                       new Set(PatientLaboratoryRegisterData?.map((item) => item.created_by))
//                     ).map((user, index) => (
//                       <option key={index} value={user} />
//                     ))}
//                   </datalist>
//                 </div>

//                 {/* <button
//                   className="search_div_bar_btn_1"
//                   onClick={handlenewPatientRegister}
//                   title="New Patient Register"
//                 >
//                   <LoupeIcon />
//                 </button> */}
//               </div>
//               <ReactGrid
//                 columns={PatientLaboratoryRegisterColumns}
//                 RowData={PatientLaboratoryRegisterData}
//               />
//             </div>
//           )}

         
//         </div>
//       </div>
//       <ToastAlert Message={toast.message} Type={toast.type} />


//       {openModal1 && (
//         <div className="sideopen_showcamera_profile" onClick={handleCloseModal1}>
//           <div className="newwProfiles" onClick={(e) => e.stopPropagation()}>
//             <h2>{openModal1}</h2>

//             <TokenPatient rowData={selectedRowData} />

//             <div className="Main_container_Btn">
//               <button onClick={handleCloseModal1}>Close</button>
//             </div> </div>
//         </div>
//       )}

//       {openModal && (
//         <div className="sideopen_showcamera_profile" onClick={handleCloseModal}>
//           <div
//             className="newwProfiles"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2>{openModal}</h2>
//             {getModalContent()}
//             <div className="Main_container_Btn">
//               <button onClick={handleCloseModal}>Close</button>
//             </div>{" "}
//           </div>
//         </div>
//       )}

//       {IPModal && (
//         <div className="sideopen_showcamera_profile" onClick={handleCloseIPModal}>
//           <div
//             className="newwProfiles"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2>{IPModal}</h2>
//             {getIPModalContent()}
//             <div className="Main_container_Btn">
//               <button onClick={handleCloseIPModal}>Close</button>
//             </div>{" "}
//           </div>
//         </div>
//       )}

//       {/* {openModal && (
//         <div className="sideopen_showcamera_profile" onClick={handleCloseModal}>
//           <div
//             className="newwProfiles"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2>{openModal}</h2>
//             {getModalContentip()}
//             <div className="Main_container_Btn">
//               <button onClick={handleCloseModal}>Close</button>
//             </div>{" "}
//           </div>
//         </div>
//       )} */}




//       {labModal && (
//               <div
//                 className={isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"}
//                 onClick={() => setlabModal(false)}
//               >
//                 <div
//                   className="newwProfiles newwPopupforreason uwagduaguleaveauto"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <br />
//                   <div className="appointment">
//                     <div className="h_head">
//                       <h4>Tests</h4>
//                     </div>
//                     <div className="Main_container_app">
//                       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                         <thead>
//                           <tr>
//                             <th style={{ border: '1px solid #ddd', padding: '8px', width: '70px' }}>S.No</th>
//                             <th style={{ border: '1px solid #ddd', padding: '8px', width: '250px' }}>Test Name</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {Array.isArray(viewtest) &&
//                             viewtest.map((test) => (
//                               <React.Fragment key={test.itemid}>
//                                 <tr>
//                                   <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
//                                     {test.id}
//                                   </td>
//                                   <td style={{ border: "1px solid #ddd", padding: "8px", display: "flex", alignItems: "center" }}>
//                                     <span>{test.Name || "Unnamed Test"}</span>
//                                     {/* {test.subTests?.length > 0 && (
//                                       <Button
//                                         onClick={() => toggleSubTests(test.itemid)}
//                                         sx={{ minWidth: "30px", padding: "0", marginLeft: "8px" }}
//                                       >
//                                         {expandedTest === test.itemid ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                                       </Button>
//                                     )} */}
//                                   </td>
//                                 </tr>
//                                 {/* {expandedTest === test.itemid &&
//                                   test.subTests?.length > 0 &&
//                                   test.subTests.map((subTest, idx) => (
//                                     <tr key={`${test.itemid}_${idx}`}>
//                                       <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
//                                       <td style={{ border: "1px solid #ddd", padding: "8px", paddingLeft: "28px" }}>
//                                         {subTest.test_name} {subTest.test_code ? `(Code: ${subTest.test_code})` : ""}
//                                       </td>
//                                     </tr>
//                                   ))} */}
//                               </React.Fragment>
//                             ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                   <div className="Register_btn_con">
//                     <button className="RegisterForm_1_btns" onClick={() => setlabModal(false)}>
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
 

//     </>
//   );
// };
// export default RegistrationList;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import LoupeIcon from "@mui/icons-material/Loupe";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Tooltip } from 'react-tooltip';
import TokenPatient from "./TokenPatient";
import AllPatienbarcode from "./AllPatientbarcode";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonIcon from "@mui/icons-material/Person";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RadiologyBarcode from "./RadiologyBarcode";
import AllPatienbarcodeIP from "./AllPatientbarcodeIP";



const RegistrationList = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  // const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [filteredOPlist,setfilteredOPlist] = useState([]);
  const [filteredIPlist,setfilteredIPlist] = useState([]);
  console.log(PatientRegisterData,'PatientRegisterData')
  const [PatientIPRegisterData, setPatientIPRegisterData] = useState([]);
  const [PatientCasualityRegisterData, setPatientCasualityRegisterData] = useState([]);
  const [PatientEmergencyRegisterData, setPatientEmergencyRegisterData] = useState([]);
  const [PatientDiagnosisRegisterData, setPatientDiagnosisRegisterData] = useState([]);
  const [PatientLaboratoryRegisterData, setPatientLaboratoryRegisterData] = useState([]);
  const UserData = useSelector(state => state.userRecord?.UserData)

  const [selectedRowData, setSelectedRowData] = useState(null);

  const [selectedType, setSelectedType] = useState("OP");

  const [TodayOPCount, setTodayOPCount] = useState(0);
  const [MonthlyOPcount, setMonthlyOPcount] = useState(0);
  const [YearlyOPcount, setYearlyOPcount] = useState(0);

  const [TodayRadiologyCount, setTodayRadiologyCount] = useState(0);
  const [MonthlyRadiologycount, setMonthlyRadiologycount] = useState(0);
  const [YearlyRadiologycount, setYearlyRadiologycount] = useState(0);

  const [TodayLabCount, setTodayLabCount] = useState(0);
  const [MonthlyLabcount, setMonthlyLabcount] = useState(0);
  const [YearlyLabcount, setYearlyLabcount] = useState(0);

  const [TodayAdmittedIPcount, setTodayAdmittedIPcount] = useState(0);
  const [MonthlyAdmittedIPcount, setMonthlyAdmittedIPcount] = useState(0);
  const [YearlyAdmittedIPcount, setYearlyAdmittedIPcount] = useState(0);
  const [TodayDischargedIPcount, setTodayDischargedIPcount] = useState(0);
  const [MonthlyDischargedIPcount, setMonthlyDischargedIPcount] = useState(0);
  const [YearlyDischargedIPcount, setYearlyDischargedIPcount] = useState(0);
 
  const [TodayAdmittedEmgcount, setTodayAdmittedEmgcount] = useState(0);
  const [MonthlyAdmittedEmgcount, setMonthlyAdmittedEmgcount] = useState(0);
  const [YearlyAdmittedEmgcount, setYearlyAdmittedEmgcount] = useState(0);
  const [TodayDischargedEmgcount, setTodayDischargedEmgcount] = useState(0);
  const [MonthlyDischargedEmgcount, setMonthlyDischargedEmgcount] = useState(0);
  const [YearlyDischargedEmgcount, setYearlyDischargedEmgcount] = useState(0);


  const [UserList,setUserList] = useState([]);

  const handleOpenModal = (modalType, rowData) => {

    console.log(modalType,'modalType')
    setOpenModal(modalType);
    setSelectedRowData(rowData);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setSelectedRowData(null);
  };

  const [openModal, setOpenModal] = useState(false);

  const [labModal,setlabModal] = useState(false);
  const [IPModal,setIPModal] = useState(false)
 
  const handleCloseLabModal = () => {
    setlabModal(null);
   
  };

  const handleCloseIPModal = () => {
    setIPModal(null);
    setSelectedRowData(null);
   
  };

   const handleIPOpenModal = (modalType, rowData) => {

    setIPModal(modalType);
    setSelectedRowData(rowData);
  };

  
 
  const [viewtest, setViewtest] = useState([]);
  console.log(viewtest,'viewtest')
  const [expandedTest, setExpandedTest] = useState(null);
 
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const toggleSubTests = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };
  const [OpDateOption, setOpDateOption] = useState('current');
  const [dateOption, setDateOption] = useState('current');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [ParticularDate, setParticularDate] = useState('');
  const [CurrentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (dateOption === 'current') {
      setCurrentDate(new Date().toISOString().split('T')[0]); // Auto-set today
    }
  }, [dateOption]);
  console.log(PatientRegisterData, 'PatientRegisterData');
  console.log(PatientEmergencyRegisterData, 'PatientEmergencyRegisterData');


  const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '', VisitPurpose: 'OP', User:UserData?.username || ''});

  const [searchIPParams, setsearchIPParams] = useState({
    query: '',
    status: 'Admitted',
    type: 'IP',
    DoctorId: UserData?.Doctor || '',
    User:UserData?.username || ''
    // SelectedWard : SelectedWard
  });

  const [searchCasualityParams, setsearchCasualityParams] = useState({
    query: "",
    status: 'Admitted',
    DoctorId: UserData?.Doctor,

  });

  const [searchEmergencyParams, setsearchEmergencyParams] = useState({
    query: "",
    status: 'Admitted',
    DoctorId: UserData?.Doctor || '',
    User:UserData?.username || ''
  });
  const [searchDiagnosisParams, setsearchDiagnosisParams] = useState({
    query: "",
    status: "Registered",
    User:UserData?.username || ''
  });
  const [searchLaboratoryParams, setsearchLaboratoryParams] = useState({
    query: "",
    status: "Registered",
    User:UserData?.username || ''
  });


    useEffect(() => {
        axios
          .get(`${UrlLink}Masters/UserRegister_Detials_link`)
          .then((res) => setUserList(res.data))
          .catch((err) => console.log(err));
      }, [UrlLink]);



  useEffect(() => {
  if (selectedType !== "OP") return;  // ✅ Run only for OP

  const params = {};

  console.log(params, "params11111111111111");

  if (!searchOPParams?.query || typeof searchOPParams.query !== "string") {
    searchOPParams.query = ""; // Default empty string
  }

  if (searchOPParams.query?.trim()) {
    params.query = searchOPParams.query.trim();
  }

  if (/^\d{10}$/.test(searchOPParams.query)) {
    params.query = searchOPParams.query; // for mobile number
  } else if (searchOPParams.query.trim()) {
    const nameParts = searchOPParams.query.trim().split(" ");
    if (nameParts.length === 1) params.query = nameParts[0];
    if (nameParts.length === 2) params.query = nameParts[1];
    if (nameParts.length > 2) {
      params.query = nameParts[nameParts.length - 1]; // ✅ last name only
    }
  }

  if (searchOPParams?.status) params.status = searchOPParams.status;
  if (searchOPParams?.User) params.User = searchOPParams.User;
  if (searchOPParams?.VisitPurpose) params.VisitPurpose = searchOPParams.VisitPurpose;
  if (searchOPParams.DoctorId) params.DoctorId = searchOPParams.DoctorId;

  if (OpDateOption === "custom") {
    if (fromDate && toDate) {
      params.fromDate = fromDate;
      params.toDate = toDate;
    } else {
      setPatientRegisterData([]);
      return;
    }
  } else if (OpDateOption === "current") {
    if (CurrentDate) {
      params.CurrentDate = CurrentDate;
    } else {
      setPatientRegisterData([]);
      return;
    }
  } else if (OpDateOption === "particular") {
    if (ParticularDate) {
      params.ParticularDate = ParticularDate;
    } else {
      setPatientRegisterData([]);
      return;
    }
  }

  console.log(params, "params22222222222222222");

  axios
    .get(`${UrlLink}Frontoffice/Total_OP_patients_List`, { params })
    .then((res) => {
      const TodayOPCount = res.data.today_total_OP_count;
      const MonthlyOPcount = res.data.monthly_total_OP_count;
      const YearlyOPcount = res.data.yearly_total_OP_count;

      const ress = res.data.appointments || [];

      setTodayOPCount(TodayOPCount);
      setMonthlyOPcount(MonthlyOPcount);
      setYearlyOPcount(YearlyOPcount);

      const processedData = ress.map((patient) => ({
        ...patient,
        Specilization: patient.Multiple_Doc?.map((doc) => doc.Specilization).join(", ") || "",
        VisitType: patient.Multiple_Doc?.map((doc) => doc.VisitType).join(", ") || "",
        DoctorName: patient.Multiple_Doc?.map((doc) => doc.DoctorName).join(", ") || "",
        Complaint: patient.Multiple_Doc?.map((doc) => doc.Complaint).filter(Boolean).join(", ") || "",
      }));

      setPatientRegisterData(processedData);
    })
    .catch((err) => {
      console.log(err);
    });
}, [
  selectedType, // ✅ must include this
  UrlLink,
  searchOPParams,
  UserData,
  dateOption,
  OpDateOption,
  fromDate,
  toDate,
  ParticularDate,
  CurrentDate,
  ]);



  const handleTodayPatientsClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateOption('current');
    setOpDateOption('current');
    setCurrentDate(today);
  };

  
  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };


  const handleTodayIPadmittedPatientsClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateOption('current');
    setCurrentDate(today);
    setsearchIPParams({status: 'Admitted'})
  };

  const handleTodayIPdischargedPatientsClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateOption('current');
    setCurrentDate(today);
    setsearchIPParams({status: 'Completed'})
  };

  const handleTodayEmgadmittedPatientsClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateOption('current');
    setCurrentDate(today);
    setsearchEmergencyParams({status: 'Admitted'})
  };

  const handleTodayEmgdischargedPatientsClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateOption('current');
    setCurrentDate(today);
    setsearchEmergencyParams({status: 'Completed'})
  };


  const handleMonthlyPatientsClick = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based (0 = Jan)

  const firstDay = formatDate(new Date(year, month, 1));
  const lastDay = formatDate(new Date(year, month + 1, 0));

  console.log("Monthly filter from:", firstDay, "to:", lastDay);

  setDateOption('custom');
  setOpDateOption('custom');
  setFromDate(firstDay);
  setToDate(lastDay);
};

  const handleMonthlyIPadmittedPatientsClick = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based (0 = Jan)

  const firstDay = formatDate(new Date(year, month, 1));
  const lastDay = formatDate(new Date(year, month + 1, 0));

  console.log("Monthly filter from:", firstDay, "to:", lastDay);

  setDateOption('custom');
  setFromDate(firstDay);
  setToDate(lastDay);
  setsearchIPParams({status: 'Admitted'})

};

  const handleMonthlyIPdischargedPatientsClick = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based (0 = Jan)

  const firstDay = formatDate(new Date(year, month, 1));
  const lastDay = formatDate(new Date(year, month + 1, 0));

  console.log("Monthly filter from:", firstDay, "to:", lastDay);

  setDateOption('custom');
  setFromDate(firstDay);
  setToDate(lastDay);
  setsearchIPParams({status: 'Completed'})

};

  const handleMonthlyEmgadmittedPatientsClick = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based (0 = Jan)

  const firstDay = formatDate(new Date(year, month, 1));
  const lastDay = formatDate(new Date(year, month + 1, 0));

  console.log("Monthly filter from:", firstDay, "to:", lastDay);

  setDateOption('custom');
  setFromDate(firstDay);
  setToDate(lastDay);
  setsearchEmergencyParams({status: 'Admitted'})

};

  const handleMonthlyEmgdischargedPatientsClick = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based (0 = Jan)

  const firstDay = formatDate(new Date(year, month, 1));
  const lastDay = formatDate(new Date(year, month + 1, 0));

  console.log("Monthly filter from:", firstDay, "to:", lastDay);

  setDateOption('custom');
  setFromDate(firstDay);
  setToDate(lastDay);
  setsearchEmergencyParams({status: 'Completed'})

};


const handleYearlyPatientsClick = (year) => {
  const now = new Date();
  const safeYear = typeof year === "number" ? year : now.getFullYear();

  try {
    const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
    const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

    console.log("Yearly filter from:", firstDay, "to:", lastDay);

    setDateOption('custom');
    setOpDateOption('custom');
    setFromDate(firstDay);
    setToDate(lastDay);
    
  } catch (error) {
    console.error("Invalid date in handleYearlyPatientsClick:", error);
  }
};

const handleYearlyIPadmittedPatientsClick = (year) => {
  const now = new Date();
  const safeYear = typeof year === "number" ? year : now.getFullYear();

  try {
    const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
    const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

    console.log("Yearly filter from:", firstDay, "to:", lastDay);

    setDateOption('custom');
    setFromDate(firstDay);
    setToDate(lastDay);
    setsearchIPParams({status: 'Admitted'})

  } catch (error) {
    console.error("Invalid date in handleYearlyPatientsClick:", error);
  }
};

const handleYearlyIPdischargedPatientsClick = (year) => {
  const now = new Date();
  const safeYear = typeof year === "number" ? year : now.getFullYear();

  try {
    const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
    const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

    console.log("Yearly filter from:", firstDay, "to:", lastDay);

    setDateOption('custom');
    setFromDate(firstDay);
    setToDate(lastDay);
    setsearchIPParams({status: 'Completed'})

  } catch (error) {
    console.error("Invalid date in handleYearlyPatientsClick:", error);
  }
};

const handleYearlyEmgadmittedPatientsClick = (year) => {
  const now = new Date();
  const safeYear = typeof year === "number" ? year : now.getFullYear();

  try {
    const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
    const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

    console.log("Yearly filter from:", firstDay, "to:", lastDay);

    setDateOption('custom');
    setFromDate(firstDay);
    setToDate(lastDay);
    setsearchEmergencyParams({status: 'Admitted'})

  } catch (error) {
    console.error("Invalid date in handleYearlyPatientsClick:", error);
  }
};

const handleYearlyEmgdischargedPatientsClick = (year) => {
  const now = new Date();
  const safeYear = typeof year === "number" ? year : now.getFullYear();

  try {
    const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
    const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

    console.log("Yearly filter from:", firstDay, "to:", lastDay);

    setDateOption('custom');
    setFromDate(firstDay);
    setToDate(lastDay);
    setsearchEmergencyParams({status: 'Completed'})

  } catch (error) {
    console.error("Invalid date in handleYearlyPatientsClick:", error);
  }
};





  useEffect(() => {

    if (selectedType !== "IP") return;


    const params = {};

    console.log(searchIPParams, 'searchIPParams');


    if (!searchIPParams?.query || typeof searchIPParams.query !== "string") {
      searchIPParams.query = "";
    }


    if (searchIPParams.query?.trim()) {
      params.query = searchIPParams.query.trim();  // ✅ Use searchOPParams.query
    } else {
      params.limit = 10; // Default limit if no search query
    }





    if (/^\d{10}$/.test(searchIPParams.query)) {
      params.query = searchIPParams.query; //for mobile number
    } else if (searchIPParams.query.trim()) { // for firstname ,middle name and lastame
      const nameParts = searchIPParams.query.trim().split(" ");
      if (nameParts.length === 1) params.query = nameParts[0];
      if (nameParts.length === 2) params.query = nameParts[1];
      if (nameParts.length > 2) {
        params.query = nameParts.slice(1, -1).join(" ");
        params.query = nameParts[nameParts.length - 1];
      }
    }

    // if (searchIPParams?.status) {
    //   params.status = searchIPParams.status;
    // }

    if (searchIPParams?.status && searchIPParams.status !== "") {
      params.status = searchIPParams.status;
    }
    if (searchIPParams?.User) {
      params.User = searchIPParams.User;
    }

    if (searchIPParams.type) {
      params.type = searchIPParams.type;
    }

    if (searchIPParams.DoctorId) {
      params.DoctorId = searchIPParams.DoctorId;
    }



    if (dateOption === 'custom') {
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      } else {
        setPatientIPRegisterData([]); // Clear the data if both dates are not provided
        return;
      }
    } else if (dateOption === 'current') {
      if (CurrentDate) {
        params.CurrentDate = CurrentDate;

      } else {
        setPatientIPRegisterData([]);
        return;
      }



    } else if (dateOption === 'particular') {
      if (ParticularDate) {
        params.ParticularDate = ParticularDate;

      } else {
        setPatientIPRegisterData([]); // Clear data if no particular date is selected
        return;
      }
    }

    console.log(params, 'params333333333');


    axios
      .get(`${UrlLink}Frontoffice/Total_IP_Patients_List`, {
        params
      })
      .then((res) => {
        console.log("API Response:", res.data);
        const ress = res.data.appointments;

        const todayAdmittedIPcount = res.data.today_Admitted_IP_count;
        const monthlyAdmittedIPcount = res.data.monthly_Admitted_IP_count;
        const yearlyAdmittedIPcount = res.data.yearly_Admitted_IP_count;
        const todayDischargedIPcount = res.data.today_Discharged_IP_count;
        const monthlyDischargedIPcount = res.data.monthly_Discharged_IP_count;
        const yearlyDischargedIPcount = res.data.yearly_Discharged_IP_count;
        
        setTodayAdmittedIPcount(todayAdmittedIPcount);
        setMonthlyAdmittedIPcount(monthlyAdmittedIPcount);
        setYearlyAdmittedIPcount(yearlyAdmittedIPcount);
        setTodayDischargedIPcount(todayDischargedIPcount);
        setMonthlyDischargedIPcount(monthlyDischargedIPcount);
        setYearlyDischargedIPcount(yearlyDischargedIPcount);



        if (Array.isArray(ress)) {
          setPatientIPRegisterData(ress);
          console.log(ress);
        } else {
          setPatientIPRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchIPParams, UserData, dateOption, fromDate, toDate, ParticularDate, CurrentDate]);



  useEffect(() => {
    axios
      .get(`${UrlLink}Frontoffice/get_patient_casuality_details`, {
        params: searchCasualityParams,
      })
      .then((res) => {
        console.log("Casualityyyy", res.data);
        const ress = res.data;
        if (Array.isArray(ress)) {
          setPatientCasualityRegisterData(ress);
          console.log(ress);
        } else {
          setPatientCasualityRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchCasualityParams]);

  useEffect(() => {


    if (selectedType !== "EMERGENCY") return;

    const params = {};

    if (!searchEmergencyParams?.query || typeof searchEmergencyParams.query !== "string") {
      searchEmergencyParams.query = ""; // Default empty string
    }



    if (searchEmergencyParams.query?.trim()) {
      params.query = searchEmergencyParams.query.trim();  // ✅ Use searchOPParams.query
    } else {
      params.limit = 10; // Default limit if no search query
    }

    if (/^\d{10}$/.test(searchEmergencyParams.query)) {
      params.query = searchEmergencyParams.query; //for mobile number
    } else if (searchEmergencyParams.query.trim()) { // for firstname ,middle name and lastame
      const nameParts = searchEmergencyParams.query.trim().split(" ");
      if (nameParts.length === 1) params.query = nameParts[0];
      if (nameParts.length === 2) params.query = nameParts[1];
      if (nameParts.length > 2) {
        params.query = nameParts.slice(1, -1).join(" ");
        params.query = nameParts[nameParts.length - 1];
      }
    }

    // if (searchEmergencyParams.status) {
    //   params.status = searchEmergencyParams.status;
    // }

    if (searchEmergencyParams?.status && searchEmergencyParams.status !== "") {
      params.status = searchEmergencyParams.status;
    }

    if (searchEmergencyParams.DoctorId) {
      params.DoctorId = searchEmergencyParams.DoctorId;
    }
    if (searchEmergencyParams.User) {
      params.User = searchEmergencyParams.User;
    }

    if (dateOption === 'custom') {
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      } else {
        setPatientEmergencyRegisterData([]); // Clear the data if both dates are not provided
        return;
      }
    } else if (dateOption === 'current') {
      if (CurrentDate) {
        params.CurrentDate = CurrentDate;

      } else {
        setPatientEmergencyRegisterData([]);
        return;
      }



    } else if (dateOption === 'particular') {
      if (ParticularDate) {
        params.ParticularDate = ParticularDate;

      } else {
        setPatientEmergencyRegisterData([]); // Clear data if no particular date is selected
        return;
      }
    }

    console.log(params, 'params4444444444444');


    axios
      .get(`${UrlLink}Frontoffice/Total_Emergency_patients_List`, {
        params
      })
      .then((res) => {
        console.log("Emergencyyyyyyy", res.data);
        const ress = res.data.appointments;
        // const ress = res.data.appointments;
        console.log("Emeryyyyyy", ress);

        const todayAdmittedEmgcount = res.data.today_Admitted_Emg_count;
        const monthlyAdmittedEmgcount = res.data.monthly_Admitted_Emg_count;
        const yearlyAdmittedEmgcount = res.data.yearly_Admitted_Emg_count;
        const todayDischargedEmgcount = res.data.today_Discharged_Emg_count;
        const monthlyDischargedEmgcount = res.data.monthly_Discharged_Emg_count;
        const yearlyDischargedEmgcount = res.data.yearly_Discharged_Emg_count;
        

        setTodayAdmittedEmgcount(todayAdmittedEmgcount);
        setMonthlyAdmittedEmgcount(monthlyAdmittedEmgcount);
        setYearlyAdmittedEmgcount(yearlyAdmittedEmgcount);
        setTodayDischargedEmgcount(todayDischargedEmgcount);
        setMonthlyDischargedEmgcount(monthlyDischargedEmgcount);
        setYearlyDischargedEmgcount(yearlyDischargedEmgcount);

        if (Array.isArray(ress)) {
          setPatientEmergencyRegisterData(ress);
          console.log(ress);
        } else {
          setPatientEmergencyRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchEmergencyParams, UserData, dateOption, fromDate, toDate, ParticularDate, CurrentDate]);

  useEffect(() => {

      if (selectedType !== "RADIOLOGY") return;  // ✅ Run only for OP


    const datasearch = {
      ...searchDiagnosisParams,
      fromDate,
      toDate,
      ParticularDate,
      CurrentDate,
      dateOption
    }
    axios
      .get(`${UrlLink}Frontoffice/get_diagnosis_patient_appointment_details`, {
        params: datasearch,
      })
      .then((res) => {
        console.log("API Response:", res.data);
        const ress = res.data.appointments;
        if (Array.isArray(ress)) {
          setPatientDiagnosisRegisterData(ress);
          setTodayRadiologyCount(res.data.today_total_Rad_count);
          setMonthlyRadiologycount(res.data.monthly_total_Rad_count);
          setYearlyRadiologycount(res.data.yearly_total_Rad_count);
          console.log(ress);
        } else {
          setPatientDiagnosisRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchDiagnosisParams,selectedType,dateOption, fromDate, toDate, ParticularDate,CurrentDate]);
 
  useEffect(() => {

  if (selectedType !== "LABORATORY") return;  // ✅ Run only for OP
    const datasearch = {
      ...searchLaboratoryParams,
      fromDate,
      toDate,
      ParticularDate,
      CurrentDate
    }
    axios
      .get(`${UrlLink}Frontoffice/get_lab_patient_appointment_details`, {
        params: datasearch,
      })
      .then((res) => {
        console.log("API Response:", res.data);
        const ress = res.data.appointments;
        if (Array.isArray(ress)) {
          setPatientLaboratoryRegisterData(ress);
          setTodayLabCount(res.data.today_total_Lab_count);
          setMonthlyLabcount(res.data.monthly_total_Lab_count);
          setYearlyLabcount(res.data.yearly_total_Lab_count);
          console.log(ress);
        } else {
          setPatientLaboratoryRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchLaboratoryParams,selectedType,dateOption, fromDate, toDate, ParticularDate,CurrentDate]);

  const PatientOPRegisterColumns = [
    {
      key: "id",
      name: "ID",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "Age",
      name: "Age",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
      frozen: pagewidth > 500 ? true : false,
    },
    // {
    //   key: "AppointmentId",
    //   name: "Appointment Id",
    // },
    // {
    //   key: "VisitId",
    //   name: "Visit Id",
    // },
    
    // {
    //   key: "isRefferal",
    //   name: "isRefferal",
    // },
    {
      key: "Status",
      name: "Status",
    },
     {
      key: "VisitType",
      name: "VisitType",
    },
    
    {
      key: "Specilization",
      name: "Specilization",
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
    },
    {
      key:"PatientCategory",
      name:"PatientCategory"
    },
    {
      key:"created_by",
      name:"createdby"
    },
    {
      key: "Token",
      name: "Token",
      renderCell: (params) => (
        <>
          <div className="weudygwe_uy8iu">
            <Button onClick={() => handleOpenModal1("TokenCard", params.row)}>
              Token
            </Button>
          </div>

        </>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>

          <Button
            className="cell_btn"
            onClick={() => {

              if (UserData?.Edit) {
                handleeditOPPatientRegister(params.row)
              } else {
                handleRestrictedAction();
              }

            }
            }
          >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },

    {
      key: "Barcode",
      name: "Barcode",
      renderCell: (params) =>
      (
        <div className="weudygwe_uy8iu">
          <Button onClick={() => handleOpenModal("Barcode", params.row)}>
            Barcode
          </Button>
        </div>
      ),

    },

  ];


  const getModalContent = () => {
    if (!selectedRowData) return null;
    const New = true;
    switch (openModal) {
      case 'Barcode':
        return <AllPatienbarcode rowData={selectedRowData} newpatient={New} />;
      
      default:
        return null;
    }
  };


  const getIPModalContent = () => {
      if (!selectedRowData) return null;
      const New = true;
      switch (IPModal) {
        case 'IpBarcode':
          // return <AllPatienbarcod rowData={selectedRowData} newpatient={New} />;
                  return <AllPatienbarcodeIP rowData={selectedRowData} newpatient={New} />;
  
        default:
          return null;
      }
    };



  const PatientIPRegisterColumns = [
    {
      key: "id",
      name: "ID",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "RegistrationId",
      name: "IP.No",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "RoomNo",
      name: "Room No",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
      {
      key: "Age",
      name: "Age",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
      frozen: pagewidth > 500 ? true : false,
    },
    // {
    //   key: "AppointmentId",
    //   name: "Appointment Id",
    // },

    {
      key: "isRefferal",
      name: "isRefferal",
    },
    {
      key: "Status",
      name: "Status",
    },
    {
      key: "Specilization",
      name: "Specilization",
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
    },
    {
      key:"created_by",
      name:"createdby"
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => {
              if (UserData?.Edit) {
                handleeditIPPatientRegister(params.row)
              } else {
                handleRestrictedAction();
              }
            }
            }
          >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },

    {
      key: "Barcode",
      name: "Barcode",
      renderCell: (params) =>
      (
        <div className="weudygwe_uy8iu">
          <Button onClick={() => handleIPOpenModal("IpBarcode", params.row)}>
            Barcode
          </Button>         
        </div>
      ),
    },

  ];



  //   const getModalContentip = () => {
  //   if (!selectedRowData) return null;
  //   const New = true;
  //   switch (openModal) {
  //     case 'IpBarcode':
  //       return <AllPatienbarcodeIP rowData={selectedRowData} newpatient={New} />;
  //     default:
  //       return null;
  //   }
  // };






  const PatientCasualityRegisterColumns = [
    {
      key: "id",
      name: "ID",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "VisitId",
      name: "Visit Id",
    },
    {
      key: "Complaint",
      name: "Complaint",
    },
    {
      key: "isMLC",
      name: "isMLC",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "Flagging",
      name: "Flagging",
    },
    {
      key: "isRefferal",
      name: "isRefferal",
    },
    {
      key: "Status",
      name: "Status",
    },
    {
      key: "Specilization",
      name: "Specilization",
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleeditCasualityPatientRegister(params.row)}
          >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
    {
      key: "Barcode",
      name: "Barcode",
      renderCell: (params) =>
      (
        <div className="weudygwe_uy8iu">
          <Button onClick={() => handleOpenModal("Barcode", params.row)}>
            Barcode
          </Button>
        </div>
      ),

    },
  ];


  const PatientEmergencyRegisterColumns = [
    {
      key: "id",
      name: "ID",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "VisitId",
      name: "Visit Id",
    },
    
    {
      key: "isRefferal",
      name: "isRefferal",
    },
    {
      key: "Status",
      name: "Status",
    },
    {
      key: "Specilization",
      name: "Specilization",
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
    },
    {
      key:"created_by",
      name:"createdby"
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => {
              if (UserData?.Edit) {
                handleeditEmergencyPatientRegister(params.row)
              } else {
                handleRestrictedAction();
              }
            }}
          >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
    {
      key: "Barcode",
      name: "Barcode",
      renderCell: (params) =>
      (
        <div className="weudygwe_uy8iu">
          <Button onClick={() => handleOpenModal("Barcode", params.row)}>
            Barcode
          </Button>
        </div>
      ),

    },
  ];

  const PatientDiagnosisRegisterColumns = [
    {
      key: "id",
      name: "ID",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "VisitId",
      name: "Visit Id",
    },
    {
      key: "isRefferal",
      name: "isRefferal",
    },
    {
      key: "Status",
      name: "Status",
    },
    {
      key:"created_by",
      name:"createdby"
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => {
              if (UserData?.Edit) {
                handleeditDiagnosisPatientRegister(params.row)
              } else {
                handleRestrictedAction();
              }
            }
            }
          >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
    {
      key: "Barcode",
      name: "Barcode",
      renderCell: (params) =>
      (
        <div className="weudygwe_uy8iu">
          <Button onClick={() => handleOpenModal("Barcode", params.row)}>
            Barcode
          </Button>
        </div>
      ),

    },
  ];
 const PatientLaboratoryRegisterColumns = [
    {
      key: "id",
      name: "ID",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "isRefferal",
      name: "isRefferal",
    },
    {
      key: "Status",
      name: "Status",
    },
    {
      key: "Bill_Status",
      name: "Bill_Status"
    },
    {
      key:"created_by",
      name:"createdby"
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => {
              if (UserData?.Edit) {
                handleeditLaboratoryPatientRegister(params.row)
              } else {
                handleRestrictedAction();
              }
            }}
          >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => {
              if (UserData?.Read) {
                console.log(params.row.testlist,'paramssss')                
                setViewtest(params.row.testlist)
                setlabModal(true);
              } else {
                handleRestrictedAction();
              }
            }}
          >
            <VisibilityIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
    {
      key: "Barcode",
      name: "Barcode",
      renderCell: (params) =>
      (
        <div className="weudygwe_uy8iu">
          <Button onClick={() => handleOpenModal("Barcode", params.row)}>
            Barcode
          </Button>
        </div>
      ),
 
    },
  ];
 


  const [openModal1, setOpenModal1] = useState(false);

  const [modalContent, setModalContent] = useState("");

  const handleOpenModal1 = (modalType, rowData) => {
    setOpenModal1(modalType);
    setSelectedRowData(rowData);
  };


  const handleCloseModal1 = () => {
    setOpenModal1(null);
    setSelectedRowData(null);
  };



 const handleDateOptionChange = (e) => {
    setDateOption(e.target.value);
    setOpDateOption(e.target.value);

    // Reset date states when changing the selection
    if (e.target.value === 'current') {
      console.log(e.target.value,'e.target.value');
      
      setFromDate('');
      setToDate('');
      setParticularDate('');
      setsearchOPParams({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
      setsearchIPParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || ''})
      setsearchEmergencyParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
    } else if (e.target.value === 'custom') {
      setParticularDate('');
      setCurrentDate('');
      setsearchOPParams({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
      setsearchIPParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
      setsearchEmergencyParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
    } else if (e.target.value === 'particular') {
      setFromDate('');
      setToDate('');
      setCurrentDate('');
      setsearchOPParams({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
      setsearchIPParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
      setsearchEmergencyParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '', User:UserData?.username || '' })
    }
     else if (e.target.value === 'all') {
      setFromDate('');
      setToDate('');
      setCurrentDate('');
      setParticularDate('');
      setsearchOPParams({ query: '', status: 'Registered', DoctorId: UserData?.Doctor || '' , User:UserData?.username || ''})
      setsearchIPParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '' , User:UserData?.username || ''})
      setsearchEmergencyParams({ query: '', status: 'Admitted', DoctorId: UserData?.Doctor || '' , User:UserData?.username || ''})
    }
  };

  const handleCurrentDateChange = (e) => {
    setCurrentDate(e.target.value);
  };


  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleParticularDateChange = (e) => {
    setParticularDate(e.target.value);
  };


  const handlenewPatientRegister = () => {
    dispatchvalue({ type: "Registeredit", value: {} });
    dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
    navigate("/Home/FrontOfficeFolder");
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };
  const handlenewIPPatientRegister = () => {
    dispatchvalue({ type: "Registeredit", value: {} });
    dispatchvalue({ type: "HrFolder", value: "IPRegistration" });
    navigate("/Home/FrontOfficeFolder");
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const handleNewEmergencyPatientRegister = () => {
    dispatchvalue({ type: "Registeredit", value: {} });
    dispatchvalue({ type: "HrFolder", value: "PatientRegistration" });
    navigate("/Home/FrontOfficeFolder");
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const handleRestrictedAction = () => {
    alert("You do not have permission to perform this action.");
  };


  const handleeditOPPatientRegister = (params) => {
    // Destructure the id and PatientId from the params object
    const { PatientId, VisitId, ...rest } = params;

    // Log the entire params object for debugging purposes
    console.log("paraaaammmmmsss", params);

    dispatchvalue({ type: "ReferalDocPatient", value: {} });
    
    // Dispatch an action to update the Redux store with the selected PatientId
    dispatchvalue({
      type: "Registeredit",
      value: { ...params, Department: 'OP' },
      // value: { PatientId: PatientId, VisitId: VisitId, Type: "OP", ...rest },
    });

    dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
    navigate("/Home/FrontOfficeFolder");
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });

    // Navigate to the registration page for editing the patient's details
    // navigate("/Home/Registration");
  };


  const handleeditIPPatientRegister = (params) => {
    // Destructure the id and PatientId from the params object
    const { PatientId, ...rest } = params;

    // Log the entire params object for debugging purposes
    console.log("Ipppppppppp", params);

    // Dispatch an action to update the Redux store with the selected PatientId
    dispatchvalue({
      type: "Registeredit",
      value: { ...params, Department: 'IP', Nav: true },
      // value: { PatientId: PatientId, Type: "IP", ...rest },
    });

    dispatchvalue({ type: "HrFolder", value: "IPRegistration" });
    navigate("/Home/FrontOfficeFolder");
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });


  };


  const handleeditEmergencyPatientRegister = (params) => {
    // Destructure the id and PatientId from the params object
    const { PatientId, ...rest } = params;

    // Log the entire params object for debugging purposes
    console.log("Emergenccccccccy", params);

    // Dispatch an action to update the Redux store with the selected PatientId
    dispatchvalue({
      type: "Registeredit",
      value: params,
      // value: { PatientId: PatientId, Type: "IP", ...rest },
    });

    dispatchvalue({ type: "HrFolder", value: "EmergencyPatientRoomRegistration" });
    navigate("/Home/FrontOfficeFolder");
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });

  };

  const handleeditCasualityPatientRegister = (params) => {
    const { PatientId, ...rest } = params;

    console.log("Casualityyyyyyy", params);

    dispatchvalue({
      type: "Registeredit",
      value: { PatientId: PatientId, Type: "Casuality", ...rest },
    });

    navigate("/Home/Registration");
  };






  const handleeditDiagnosisPatientRegister = (params) => {
    const { PatientId, ...rest } = params;
 
    console.log("Diagnosissssssss", params);
 
    dispatchvalue({
      type: "Registeredit",
      value: { ...params, Department: 'RADIOLOGY' },
     
    });
 
    dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
    navigate("/Home/FrontOfficeFolder");
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };
 
  const handleeditLaboratoryPatientRegister = (params) => {
    // Destructure the id and PatientId from the params object
    const { PatientId, ...rest } = params;
 
    console.log("laboratoryyyyyyyy", params);
 
    dispatchvalue({
      type: "Registeredit",
      value: { ...params, Department: 'LAB' },
    });
 
    dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
    navigate("/Home/FrontOfficeFolder");
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const handleSearchChange = (table, e) => {
    if (table === "OP") {
      setsearchOPParams({ ...searchOPParams, query: e.target.value });
    } else if (table === "IP") {
      setsearchIPParams({ ...searchIPParams, query: e.target.value });
    } else if (table === "Casuality") {
      setsearchCasualityParams({
        ...searchCasualityParams,
        query: e.target.value,
      });
    } else if (table === "Emergency") {
      setsearchEmergencyParams({
        ...searchEmergencyParams,
        query: e.target.value,
      });
    } else if (table === "Diagnosis") {
      setsearchDiagnosisParams({
        ...searchDiagnosisParams,
        query: e.target.value,
      });
    } else if (table === "Laboratory") {
      setsearchLaboratoryParams({
        ...searchLaboratoryParams,
        query: e.target.value,
      });
    }
  };



  const handleStatusChange = (table, e) => {
    console.log("Status selected:", e.target.value);
    if (table === "OP") {
      setsearchOPParams({ ...searchOPParams, status: e.target.value });
    } else if (table === "IP") {
      setsearchIPParams({ ...searchIPParams, status: e.target.value });
    } else if (table === "Casuality") {
      setsearchCasualityParams({ ...searchCasualityParams, status: e.target.value });
    } else if (table === "Emergency") {
      setsearchEmergencyParams({ ...searchEmergencyParams, status: e.target.value });
    }
    else if (table === "RADIOLOGY") {
      setsearchDiagnosisParams({
        ...searchDiagnosisParams, status: e.target.value
      });
    } else if (table === "Laboratory") {
      setsearchLaboratoryParams({
        ...searchLaboratoryParams, status: e.target.value,
      });
    }
  };


  useEffect(() => {
    if (UserData?.username) {
      setsearchOPParams((prev) => ({
        ...prev,
        User: UserData?.username,
      }));
      setsearchIPParams((prev) => ({
        ...prev,
        User: UserData?.username,
      }));
      setsearchEmergencyParams((prev) => ({
        ...prev,
        User: UserData?.username,
      }));
      setsearchDiagnosisParams((prev) => ({
        ...prev,
        User: UserData?.username,
      }));
      setsearchLaboratoryParams((prev) => ({
        ...prev,
        User: UserData?.username,
      }));
    }
  }, [UserData]);


  const handleUserChange = (event) => {
    const { name, value } = event.target;

    setsearchOPParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    setsearchIPParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    setsearchEmergencyParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    setsearchDiagnosisParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    setsearchLaboratoryParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };




  

  const handleSelectChange = (event) => {
    setSelectedType(event.target.value);
    setDateOption('all');
    setOpDateOption('current');
    setCurrentDate(new Date().toISOString().split('T')[0]);
    setFromDate('');
    setToDate('');
    setParticularDate('');
    setsearchOPParams({ status: 'Registered',User: UserData?.username })
    setsearchIPParams({ status: 'Admitted',User: UserData?.username })
    setsearchEmergencyParams({ status: 'Admitted',User: UserData?.username })
    setsearchDiagnosisParams({status: 'Registered',User: UserData?.username })
    setsearchLaboratoryParams({status: 'Registered',User: UserData?.username })

  };

const getModalRadContent = () => {
 
    if (!selectedRowData) return null;
    const New = true;
    switch (openModal) {
      case 'Barcode':
        // return <RadiologyBarcode rowData={selectedRowData} newpatient={New}/>;
           return <RadiologyBarcode rowData={selectedRowData} newpatient={New}/>;
      case 'BarcodeIP':
        // return <RadiologyBarcode rowData={selectedRowData} newpatient={New}/>;
           return <RadiologyBarcode rowData={selectedRowData} newpatient={New}/>;

      default:
        return null;
    }
 
  }

  const [SearchQueryfilter, setSearchQueryfilter] = useState({
        username : '',
        VisitType : '',

      });

  const handleSearchChangefilter = (e) => {
    const { name, value } = e.target;
    setSearchQueryfilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  useEffect(() => {
    const { username ,VisitType} = SearchQueryfilter;

    const filteredData = PatientRegisterData.filter((item) => {
      const matchesUser = username
        ? item.created_by.toLowerCase().includes(username.toLowerCase())
        : true;

      const matchVisitType = VisitType

        ? item.VisitType.toLowerCase().includes(VisitType.toLowerCase())
        : true;

      return matchesUser && matchVisitType;
    });

    console.log(filteredData,'filteredData')

    setfilteredOPlist(filteredData); 
  }, [SearchQueryfilter, PatientRegisterData]);


  const [SearchQueryIPfilter, setSearchQueryIPfilter] = useState({
        username : '',
        VisitType : '',

      });

  const handleSearchChangeIPfilter = (e) => {
    const { name, value } = e.target;
    setSearchQueryIPfilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  useEffect(() => {
    const { username} = SearchQueryIPfilter;

    const filteredData = PatientIPRegisterData.filter((item) => {
      const matchesUser = username
        ? item.created_by.toLowerCase().includes(username.toLowerCase())
        : true;

      return matchesUser;
    });

    console.log(filteredData,'filteredData')

    setfilteredIPlist(filteredData); 
  }, [SearchQueryIPfilter, PatientIPRegisterData]);


  return (
    <>
      <div className="Main_container_app">
        <h3>Patient Register List</h3>

        <div className="RegisterTypecon  navchange">
          <div className="RegisterType">
            {["OP", "IP", "EMERGENCY", "RADIOLOGY", "LABORATORY"].map(
              (p, ind) => (
                <div className="registertypeval" key={ind + "key"}>
                  <input
                    type="radio"
                    id={p}
                    name="appointment_type"
                    checked={selectedType === p}
                    // checked={InsuranceClientForm === p}
                    onChange={handleSelectChange}
                    value={p}
                  />
                  <label htmlFor={p}>{p}</label>
                </div>
              )
            )}
          </div>
        </div>

        <div className="content " style={{ width: "100%" }}>
          
          
          {selectedType === "OP" && (
            <>

              <div className="DivCenter_container">OP Patient Details </div>

              <div className="con_1 ">
                <div className="chart_body_1_child_1 dww3" onClick={handleTodayPatientsClick} style={{ cursor: "pointer" }}>
                  <div className="chart_body_1_child_1_body">
                      <div className="chart_body_1_child_1_body_icon">
                      <PersonAddAlt1Icon />
                      </div>
                      <div className="chart_body_1_child_1_body_count">
                      {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
                      {/* <h3>20</h3> */}
                      <h2>{TodayOPCount}</h2>

                      </div>
                      <div className="chart_body_1_child_1_body_name">
                      Today Patients
                      </div>
                  </div>
                </div>
                
                <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                        <PersonIcon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
                        {/* <h3>30</h3> */}
                        <h2>{MonthlyOPcount}</h2>
                        </div>
                        <div className="chart_body_1_child_1_body_name">
                        Monthly Patients
                        </div>
                    </div>
                </div>
                
                <div className="chart_body_1_child_1 dww3" onClick={handleYearlyPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                    <div className="chart_body_1_child_1_body_icon">
                        <Diversity1Icon />
                    </div>
                    <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
                        {/* <h3>50</h3> */}
                        <h2>{YearlyOPcount}</h2>
                    </div>
                    <div className="chart_body_1_child_1_body_name">
                        Yearly Patients
                    </div>
                    </div>
                </div>
                
              </div>

              <div className="op-content">
                  
                
                
                <div className="search_div_bar">

                  <button
                    className="RegisterForm_1_btns choose_file_update"
                    onClick={handlenewPatientRegister}
                    data-tooltip-id="add-patient-tooltip"
                  >
                    <AddCircleIcon />
                  </button>
                  <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />


                    <div className="search_div_bar_inp_1">
                      <label> {" "} Date <span>:</span>{" "} </label>
                      <select value={OpDateOption} onChange={handleDateOptionChange}
                      >
                        <option value="all">All</option>
                        <option value="current">Current Date</option>
                        <option value="custom">Custom Date</option>
                        <option value="particular">Particular Date</option>
                      </select>
                    </div>

                    {OpDateOption === 'current' && (
                      <div className="search_div_bar_inp_1">
                        <label>
                          {" "}
                          Current Date <span>:</span>{" "}
                        </label>
                        <input
                          type="date"
                          value={CurrentDate}
                          disabled
                          onChange={handleCurrentDateChange}
                        />
                      </div>
                    )}

                    {OpDateOption === 'custom' && (
                      <>
                        <div className="search_div_bar_inp_1">
                          <label> {" "}From  <span>:</span> {" "}</label>

                          <input
                            type="date"
                            placeholder="From Date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                          />

                        </div> 
                        <div className="search_div_bar_inp_1">

                          <label> To  <span>:</span> </label>

                          <input
                            type="date"
                            placeholder="To Date"
                            value={toDate}
                            onChange={handleToDateChange}
                          />
                        </div>
                      </>
                    
                    )}

                  
                    <br />
                    {OpDateOption === 'particular' && (
                      <div className="search_div_bar_inp_1">
                        <label>{" "} Select Date <span>:</span> {" "}</label>
                        <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                      </div>
                    )}

                    <div className=" search_div_bar_inp_1">
                      <label htmlFor="">
                        Search by
                        <span>:</span>
                      </label>
                      <input
                        type="text"
                        value={searchOPParams.query}
                        placeholder="Patient ID or Name or PhoneNo "
                        onChange={(e) => handleSearchChange("OP", e)}
                      />
                    </div>

                    <div className=" search_div_bar_inp_1">
                      <label htmlFor="">
                        Status
                        <span>:</span>
                      </label>
                      <select
                        id=""
                        name="status"
                        value={searchOPParams.status}
                        onChange={(e) => handleStatusChange("OP", e)}
                      >
                        <option value="">Select</option>
                        <option value="Registered">Registered</option>
                        <option value="Paid">Paid</option>
                        <option value="Due">Due</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* <div className="search_div_bar_inp_1">
                      <label htmlFor="userInput">
                        User
                        <span>:</span>
                      </label>
                      <input
                        list="userOptions"
                        id="userInput"
                        name="User"
                        value={searchOPParams.User}
                        onChange={handleUserChange}
                      />
                      <datalist id="userOptions">
                        {Array.from(
                          new Set(PatientRegisterData?.map((item) => item.created_by))
                        ).map((user, index) => (
                          <option key={index} value={user} />
                        ))}
                      </datalist>
                    </div> */}

                    <div className="RegisForm_1">
                      <label>
                        User Name <span>:</span>
                      </label>
                      <input
                        list="usernames"
                        name="username"
                        value={SearchQueryfilter.username}
                        onChange={handleSearchChangefilter}
                      />
                      <datalist id="usernames">
                        {Array.isArray(UserList) &&
                          UserList.map((user, index) => (
                            <option key={index} value={user.UserName} />
                          ))}
                      </datalist>
                    </div>

                    <div className="RegisForm_1">
                      <label>
                        VisitType<span>:</span>
                      </label>
                      <input
                        list="VisitTypes"
                        name="VisitType"
                        value={SearchQueryfilter.VisitType}
                        onChange={handleSearchChangefilter}
                      />
                      <datalist id="VisitTypes">
                        
                            <option value='NewConsultation' />
                            <option value='FollowUp No Fee' />
                             <option value='FollowUp With Fee' />
                         
                      </datalist>
                    </div>

                    

                  {/* <button
                    className="search_div_bar_btn_1"
                    onClick={handlenewPatientRegister}
                    title="New Patient Register"
                  >
                    <LoupeIcon />
                  </button> */}

                </div>
                <ReactGrid
                  columns={PatientOPRegisterColumns}
                  RowData={filteredOPlist}
                />
              </div>
             </>
           
          
          )}

          {selectedType === "IP" && (
            <>
              <div className="DivCenter_container">IP Patient Details </div>

              <div className="con_1 ">
                <div className="chart_body_1_child_1 dww3" onClick={handleTodayIPadmittedPatientsClick} style={{ cursor: "pointer" }}>
                  <div className="chart_body_1_child_1_body">
                      <div className="chart_body_1_child_1_body_icon">
                      <PersonAddAlt1Icon />
                      </div>
                      <div className="chart_body_1_child_1_body_count">
                      {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
                      {/* <h3>20</h3> */}
                      <h2>{TodayAdmittedIPcount}</h2>

                      </div>
                      <div className="chart_body_1_child_1_body_name">
                      Today Admitted 
                      </div>
                  </div>
                </div>
                <div className="chart_body_1_child_1 dww3" onClick={handleTodayIPdischargedPatientsClick} style={{ cursor: "pointer" }}>
                  <div className="chart_body_1_child_1_body">
                      <div className="chart_body_1_child_1_body_icon">
                      <PersonAddAlt1Icon />
                      </div>
                      <div className="chart_body_1_child_1_body_count">
                      {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
                      {/* <h3>20</h3> */}
                      <h2>{TodayDischargedIPcount}</h2>

                      </div>
                      <div className="chart_body_1_child_1_body_name">
                      Today Discharged 
                      </div>
                  </div>
                </div>
                
                <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyIPadmittedPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                        <PersonIcon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
                        {/* <h3>30</h3> */}
                        <h2>{MonthlyAdmittedIPcount}</h2>
                        </div>
                        <div className="chart_body_1_child_1_body_name">
                        Monthly Admitted 
                        </div>
                    </div>
                </div>

                <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyIPdischargedPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                        <PersonIcon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
                        {/* <h3>30</h3> */}
                        <h2>{MonthlyDischargedIPcount}</h2>
                        </div>
                        <div className="chart_body_1_child_1_body_name">
                        Monthly Discharged 
                        </div>
                    </div>
                </div>
                
                <div className="chart_body_1_child_1 dww3" onClick={handleYearlyIPadmittedPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                    <div className="chart_body_1_child_1_body_icon">
                        <Diversity1Icon />
                    </div>
                    <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
                        {/* <h3>50</h3> */}
                        <h2>{YearlyAdmittedIPcount}</h2>
                    </div>
                    <div className="chart_body_1_child_1_body_name">
                        Yearly Admitted 
                    </div>
                    </div>
                </div>
                <div className="chart_body_1_child_1 dww3" onClick={handleYearlyIPdischargedPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                    <div className="chart_body_1_child_1_body_icon">
                        <Diversity1Icon />
                    </div>
                    <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
                        {/* <h3>50</h3> */}
                        <h2>{YearlyDischargedIPcount}</h2>
                    </div>
                    <div className="chart_body_1_child_1_body_name">
                        Yearly Discharged 
                    </div>
                    </div>
                </div>
                
              </div>

              <div className="ip-content">
                <div className="search_div_bar">
                  <button
                    className="RegisterForm_1_btns choose_file_update"
                    onClick={handlenewIPPatientRegister}
                    data-tooltip-id="add-patient-tooltip"
                  >
                    <AddCircleIcon />
                  </button>


                  <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />


                  <div className="search_div_bar_inp_1">
                    <label>{" "} Date <span>:</span>{" "}</label>
                    <select value={dateOption} onChange={handleDateOptionChange}
                    >
                      <option value="all">All</option>
                      <option value="current">Current Date</option>
                      <option value="custom">Custom Date</option>
                      <option value="particular">Particular Date</option>
                    </select>
                  </div>

                    {dateOption === 'current' && (
                      
                      <div className="search_div_bar_inp_1">
                        <label>
                          {" "}
                          Current Date <span>:</span>{" "}
                        </label>
                        <input
                          type="date"
                          value={CurrentDate}
                          disabled
                          onChange={handleCurrentDateChange}
                        />
                      </div>
                    )}

                    {dateOption === 'custom' && (
                      <>

                        <div className="search_div_bar_inp_1">
                          <label>{" "}
                            From  <span>:</span>{" "}
                          </label>

                          <input
                            type="date"
                            placeholder="From Date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                          />
                        </div>

                        <div className="search_div_bar_inp_1">
                          <label> {" "} 
                            To  <span>:</span> {" "} </label>

                          <input
                            type="date"
                            placeholder="To Date"
                            value={toDate}
                            onChange={handleToDateChange}
                          />
                        </div>
                        
                    
                      </>
                      
                    )}

                    
                    <br />
                    {dateOption === 'particular' && (
                      <div className="search_div_bar_inp_1">
                        <label> {" "}Select Date <span>:</span>{" "} </label>
                        <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                      </div>
                    )}

                    <div className=" search_div_bar_inp_1">
                      <label htmlFor="">
                        Search by
                        <span>:</span>
                      </label>
                      <input
                        type="text"
                        value={searchIPParams.query}
                        placeholder="Patient ID or Name or PhoneNo "
                        onChange={(e) => handleSearchChange("IP", e)}
                      />
                    </div>

                    <div className="RegisForm_1">
                      <label>
                        User Name <span>:</span>
                      </label>
                      <input
                        list="usernames"
                        name="username"
                        value={SearchQueryIPfilter.username}
                        onChange={handleSearchChangeIPfilter}
                      />
                      <datalist id="usernames">
                        {Array.isArray(UserList) &&
                          UserList.map((user, index) => (
                            <option key={index} value={user.UserName} />
                          ))}
                      </datalist>
                    </div>

                  
                    <div className="search_div_bar_inp_1">
                      <label htmlFor="">
                        Status
                        <span>:</span>
                      </label>
                      <select
                        id=""
                        name="status"
                        value={searchIPParams.status}
                        onChange={(e) => handleStatusChange("IP", e)}
                      >
                        <option value="">Select</option>
                        <option value="Pending">Pending</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* <div className="search_div_bar_inp_1">
                      <label htmlFor="userInput">
                        User
                        <span>:</span>
                      </label>
                      <input
                        list="userOptions"
                        id="userInput"
                        name="User"
                        value={searchIPParams.User}
                        onChange={handleUserChange}
                      />
                      <datalist id="userOptions">
                        {Array.from(
                          new Set(PatientIPRegisterData?.map((item) => item.created_by))
                        ).map((user, index) => (
                          <option key={index} value={user} />
                        ))}
                      </datalist>
                    </div> */}
                  

                  {/* <button
                    className="search_div_bar_btn_1"
                    onClick={handlenewIPPatientRegister}
                    title="New Patient Register"
                  >
                    <LoupeIcon />
                  </button> */}
                </div>
                <ReactGrid
                  columns={PatientIPRegisterColumns}
                  RowData={filteredIPlist}
                />
              </div>
            </>
            
          )}

          {/* {selectedType === "CASUALITY" && (
            <div className="casuality-content">
              <div className="DivCenter_container">
                Casuality Patient Details{" "}
              </div>
              <div className="search_div_bar">
                <div className=" search_div_bar_inp_1">
                  <label htmlFor="">
                    Search by
                    <span>:</span>
                  </label>
                  <input
                    type="text"
                    value={searchCasualityParams.query}
                    placeholder="Patient ID or Name or PhoneNo "
                    onChange={(e) => handleSearchChange("Casuality", e)}
                  />
                </div>
                <div className=" RegisForm_1">
                  <label htmlFor="">
                    Status
                    <span>:</span>
                  </label>
                  <select
                    id=""
                    name="status"
                    value={searchCasualityParams.status}
                    onChange={(e) => handleStatusChange("Casuality", e)}
                  >
                    <option value="">Select</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <button
                  className="search_div_bar_btn_1"
                  onClick={handlenewPatientRegister}
                  title="New Patient Register"
                >
                  <LoupeIcon />
                </button>
              </div>
              <ReactGrid
                columns={PatientCasualityRegisterColumns}
                RowData={PatientCasualityRegisterData}
              />
            </div>
          )} */}

          {selectedType === "EMERGENCY" && (
            <>
              <div className="DivCenter_container">Emergency Patient Details{" "}</div>

                <div className="con_1 ">
                  <div className="chart_body_1_child_1 dww3" onClick={handleTodayEmgadmittedPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                        <PersonAddAlt1Icon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
                        {/* <h3>20</h3> */}
                        <h2>{TodayAdmittedEmgcount}</h2>

                        </div>
                        <div className="chart_body_1_child_1_body_name">
                        Today Admitted 
                        </div>
                    </div>
                  </div>
                  <div className="chart_body_1_child_1 dww3" onClick={handleTodayEmgdischargedPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                        <PersonAddAlt1Icon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
                        {/* <h3>20</h3> */}
                        <h2>{TodayDischargedEmgcount}</h2>

                        </div>
                        <div className="chart_body_1_child_1_body_name">
                        Today Discharged 
                        </div>
                    </div>
                  </div>
                  
                  <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyEmgadmittedPatientsClick} style={{ cursor: "pointer" }}>
                      <div className="chart_body_1_child_1_body">
                          <div className="chart_body_1_child_1_body_icon">
                          <PersonIcon />
                          </div>
                          <div className="chart_body_1_child_1_body_count">
                          {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
                          {/* <h3>30</h3> */}
                          <h2>{MonthlyAdmittedEmgcount}</h2>
                          </div>
                          <div className="chart_body_1_child_1_body_name">
                          Monthly Admitted 
                          </div>
                      </div>
                  </div>

                  <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyEmgdischargedPatientsClick} style={{ cursor: "pointer" }}>
                      <div className="chart_body_1_child_1_body">
                          <div className="chart_body_1_child_1_body_icon">
                          <PersonIcon />
                          </div>
                          <div className="chart_body_1_child_1_body_count">
                          {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
                          {/* <h3>30</h3> */}
                          <h2>{MonthlyDischargedEmgcount}</h2>
                          </div>
                          <div className="chart_body_1_child_1_body_name">
                          Monthly Discharged 
                          </div>
                      </div>
                  </div>
                  
                  <div className="chart_body_1_child_1 dww3" onClick={handleYearlyEmgadmittedPatientsClick} style={{ cursor: "pointer" }}>
                      <div className="chart_body_1_child_1_body">
                      <div className="chart_body_1_child_1_body_icon">
                          <Diversity1Icon />
                      </div>
                      <div className="chart_body_1_child_1_body_count">
                          {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
                          {/* <h3>50</h3> */}
                          <h2>{YearlyAdmittedEmgcount}</h2>
                      </div>
                      <div className="chart_body_1_child_1_body_name">
                          Yearly Admitted 
                      </div>
                      </div>
                  </div>
                  <div className="chart_body_1_child_1 dww3" onClick={handleYearlyEmgdischargedPatientsClick} style={{ cursor: "pointer" }}>
                      <div className="chart_body_1_child_1_body">
                      <div className="chart_body_1_child_1_body_icon">
                          <Diversity1Icon />
                      </div>
                      <div className="chart_body_1_child_1_body_count">
                          {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
                          {/* <h3>50</h3> */}
                          <h2>{YearlyDischargedEmgcount}</h2>
                      </div>
                      <div className="chart_body_1_child_1_body_name">
                          Yearly Discharged 
                      </div>
                      </div>
                  </div>
                
                </div>
              <div className="casuality-content">
                <div className="search_div_bar">

                  <button
                    className="RegisterForm_1_btns choose_file_update"
                    onClick={handleNewEmergencyPatientRegister}
                    data-tooltip-id="add-patient-tooltip"
                  >
                    <AddCircleIcon />
                  </button>


                  <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />

                  <div className="search_div_bar_inp_1">
                    <label> {" "}Date <span>:</span>{" "} </label>
                    <select
                      value={dateOption}
                      onChange={handleDateOptionChange}
                    >
                      <option value="all">All</option>
                      <option value="current">Current Date</option>
                      <option value="custom">Custom Date</option>
                      <option value="particular">Particular Date</option>
                    </select>
                  </div>

                  {dateOption === 'current' && (
                    <div className="search_div_bar_inp_1">
                      <input
                        type="date"
                        value={CurrentDate}
                        disabled
                        onChange={handleCurrentDateChange}
                      />
                    </div>
                  )}

                  {dateOption === 'custom' && (
                    <>
                      <div className="search_div_bar_inp_1">
                        <label> From  <span>:</span> </label>

                        <input
                          type="date"
                          placeholder="From Date"
                          value={fromDate}
                          onChange={handleFromDateChange}
                        />
                        
                      </div>
                      <div className="search_div_bar_inp_1">
                        <label> To  <span>:</span> </label>

                        <input
                          type="date"
                          placeholder="To Date"
                          value={toDate}
                          onChange={handleToDateChange}
                        />
                      </div>
                    </>
                  
                    
                  )}

                  {/* Particular Date Input */}
                  <br />
                  {dateOption === 'particular' && (
                    <div className="search_div_bar_inp_1">
                      <label> Select Date <span>:</span> </label>
                      <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                    </div>
                  )}
                  

                  <div className=" search_div_bar_inp_1">
                    <label htmlFor="">
                      Search by
                      <span>:</span>
                    </label>
                    <input
                      type="text"
                      value={searchEmergencyParams.query}
                      placeholder="Patient ID or Name or PhoneNo "
                      onChange={(e) => handleSearchChange("Emergency", e)}
                    />
                  </div>

                  <div className=" search_div_bar_inp_1">
                    <label htmlFor="">
                      Status
                      <span>:</span>
                    </label>
                    <select
                      id=""
                      name="status"
                      value={searchEmergencyParams.status}
                      onChange={(e) => handleStatusChange("Emergency", e)}
                    >
                      <option value="">Select</option>
                      <option value="Admitted">Admitted</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="search_div_bar_inp_1">
                      <label htmlFor="userInput">
                        User
                        <span>:</span>
                      </label>
                      <input
                        list="userOptions"
                        id="userInput"
                        name="User"
                        value={searchEmergencyParams.User}
                        onChange={handleUserChange}
                      />
                      <datalist id="userOptions">
                        {Array.from(
                          new Set(PatientEmergencyRegisterData?.map((item) => item.created_by))
                        ).map((user, index) => (
                          <option key={index} value={user} />
                        ))}
                      </datalist>
                    </div>

                



                  {/* <button
                    className="search_div_bar_btn_1"
                    onClick={handleNewEmergencyPatientRegister}
                    title="New Patient Register"
                  >
                    <LoupeIcon />
                  </button> */}
                </div>
                <ReactGrid
                  columns={PatientEmergencyRegisterColumns}
                  RowData={PatientEmergencyRegisterData}
                />
              </div>
            </>
            
          )}

          {selectedType === "RADIOLOGY" && (
            <div className="diagnosis-content">
              <div className="DivCenter_container">
                RADIOLOGY Patient Details{" "}
              </div>

               <div className="con_1 ">
                <div className="chart_body_1_child_1 dww3" onClick={handleTodayPatientsClick} style={{ cursor: "pointer" }}>
                  <div className="chart_body_1_child_1_body">
                      <div className="chart_body_1_child_1_body_icon">
                      <PersonAddAlt1Icon />
                      </div>
                      <div className="chart_body_1_child_1_body_count">
                      {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
                      {/* <h3>20</h3> */}
                      <h2>{TodayRadiologyCount}</h2>

                      </div>
                      <div className="chart_body_1_child_1_body_name">
                      Today Patients
                      </div>
                  </div>
                </div>
                
                <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                        <PersonIcon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
                        {/* <h3>30</h3> */}
                        <h2>{MonthlyRadiologycount}</h2>
                        </div>
                        <div className="chart_body_1_child_1_body_name">
                        Monthly Patients
                        </div>
                    </div>
                </div>
                
                <div className="chart_body_1_child_1 dww3" onClick={handleYearlyPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                    <div className="chart_body_1_child_1_body_icon">
                        <Diversity1Icon />
                    </div>
                    <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
                        {/* <h3>50</h3> */}
                        <h2>{YearlyRadiologycount}</h2>
                    </div>
                    <div className="chart_body_1_child_1_body_name">
                        Yearly Patients
                    </div>
                    </div>
                </div>
                
              </div>

              <div className="search_div_bar">

                <button
                  className="RegisterForm_1_btns choose_file_update"
                  onClick={handlenewPatientRegister}
                  data-tooltip-id="add-patient-tooltip"
                >
                  <AddCircleIcon />
                </button>

                <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />

                <div className="search_div_bar_inp_1">
                      <label> {" "} Date <span>:</span>{" "} </label>
                      <select value={dateOption} onChange={handleDateOptionChange}
                      >
                        <option value="all">All</option>
                        <option value="current">Current Date</option>
                        <option value="custom">Custom Date</option>
                        <option value="particular">Particular Date</option>
                      </select>
                    </div>

                    {dateOption === 'current' && (
                      <div className="search_div_bar_inp_1">
                        <label>
                          {" "}
                          Current Date <span>:</span>{" "}
                        </label>
                        <input
                          type="date"
                          value={CurrentDate}
                          disabled
                          onChange={handleCurrentDateChange}
                        />
                      </div>
                    )}

                    {dateOption === 'custom' && (
                      <>
                        <div className="search_div_bar_inp_1">
                          <label> {" "}From  <span>:</span> {" "}</label>

                          <input
                            type="date"
                            placeholder="From Date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                          />

                        </div> 
                        <div className="search_div_bar_inp_1">

                          <label> To  <span>:</span> </label>

                          <input
                            type="date"
                            placeholder="To Date"
                            value={toDate}
                            onChange={handleToDateChange}
                          />
                        </div>
                      </>
                    
                    )}

                  
                    <br />
                    {dateOption === 'particular' && (
                      <div className="search_div_bar_inp_1">
                        <label>{" "} Select Date <span>:</span> {" "}</label>
                        <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                      </div>
                    )}

                <div className=" search_div_bar_inp_1">
                  <label htmlFor="">
                    Search by
                    <span>:</span>
                  </label>
                  <input
                    type="text"
                    value={searchDiagnosisParams.query}
                    placeholder="Patient ID or Name or PhoneNo "
                    onChange={(e) => handleSearchChange("RADIOLOGY", e)}
                  />
                </div>

                <div className=" search_div_bar_inp_1">
                  <label htmlFor="">
                    Status
                    <span>:</span>
                  </label>
                  <select
                    id=""
                    name="status"
                    value={searchDiagnosisParams.status}
                    onChange={(e) => handleStatusChange("RADIOLOGY", e)}
                  >
                    <option value="">Select</option>
                    <option value="Registered">Registered</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                 <div className="search_div_bar_inp_1">
                    <label htmlFor="userInput">
                      User
                      <span>:</span>
                    </label>
                    <input
                      list="userOptions"
                      id="userInput"
                      name="User"
                      value={searchDiagnosisParams.User}
                      onChange={handleUserChange}
                    />
                    <datalist id="userOptions">
                      {Array.from(
                        new Set(PatientDiagnosisRegisterData?.map((item) => item.created_by))
                      ).map((user, index) => (
                        <option key={index} value={user} />
                      ))}
                    </datalist>
                  </div>

                {/* <button
                  className="search_div_bar_btn_1"
                  onClick={handlenewPatientRegister}
                  title="New Patient Register"
                >
                  <LoupeIcon />
                </button> */}
              </div>
              <ReactGrid
                columns={PatientDiagnosisRegisterColumns}
                RowData={PatientDiagnosisRegisterData}
              />
            </div>
          )}

          {selectedType === "LABORATORY" && (
            <div className="laboratory-content">
              <div className="DivCenter_container">
                Laboratory Patient Details{" "}
              </div>


               <div className="con_1 ">
                <div className="chart_body_1_child_1 dww3" onClick={handleTodayPatientsClick} style={{ cursor: "pointer" }}>
                  <div className="chart_body_1_child_1_body">
                      <div className="chart_body_1_child_1_body_icon">
                      <PersonAddAlt1Icon />
                      </div>
                      <div className="chart_body_1_child_1_body_count">
                      {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
                      {/* <h3>20</h3> */}
                      <h2>{TodayLabCount}</h2>

                      </div>
                      <div className="chart_body_1_child_1_body_name">
                      Today Patients
                      </div>
                  </div>
                </div>
                
                <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                        <PersonIcon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
                        {/* <h3>30</h3> */}
                        <h2>{MonthlyLabcount}</h2>
                        </div>
                        <div className="chart_body_1_child_1_body_name">
                        Monthly Patients
                        </div>
                    </div>
                </div>
                
                <div className="chart_body_1_child_1 dww3" onClick={handleYearlyPatientsClick} style={{ cursor: "pointer" }}>
                    <div className="chart_body_1_child_1_body">
                    <div className="chart_body_1_child_1_body_icon">
                        <Diversity1Icon />
                    </div>
                    <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
                        {/* <h3>50</h3> */}
                        <h2>{YearlyLabcount}</h2>
                    </div>
                    <div className="chart_body_1_child_1_body_name">
                        Yearly Patients
                    </div>
                    </div>
                </div>
                
              </div>







              <div className="search_div_bar">

                <button
                  className="RegisterForm_1_btns choose_file_update"
                  onClick={handlenewPatientRegister}
                  data-tooltip-id="add-patient-tooltip"
                >
                  <AddCircleIcon />
                </button>

                <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />

                <div className="search_div_bar_inp_1">
                      <label> {" "} Date <span>:</span>{" "} </label>
                      <select value={dateOption} onChange={handleDateOptionChange}
                      >
                        <option value="all">All</option>
                        <option value="current">Current Date</option>
                        <option value="custom">Custom Date</option>
                        <option value="particular">Particular Date</option>
                      </select>
                    </div>

                    {dateOption === 'current' && (
                      <div className="search_div_bar_inp_1">
                        <label>
                          {" "}
                          Current Date <span>:</span>{" "}
                        </label>
                        <input
                          type="date"
                          value={CurrentDate}
                          disabled
                          onChange={handleCurrentDateChange}
                        />
                      </div>
                    )}

                    {dateOption === 'custom' && (
                      <>
                        <div className="search_div_bar_inp_1">
                          <label> {" "}From  <span>:</span> {" "}</label>

                          <input
                            type="date"
                            placeholder="From Date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                          />

                        </div> 
                        <div className="search_div_bar_inp_1">

                          <label> To  <span>:</span> </label>

                          <input
                            type="date"
                            placeholder="To Date"
                            value={toDate}
                            onChange={handleToDateChange}
                          />
                        </div>
                      </>
                    
                    )}

                  
                    <br />
                    {dateOption === 'particular' && (
                      <div className="search_div_bar_inp_1">
                        <label>{" "} Select Date <span>:</span> {" "}</label>
                        <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                      </div>
                    )}

                <div className=" search_div_bar_inp_1">
                  <label htmlFor="">
                    Search by
                    <span>:</span>
                  </label>
                  <input
                    type="text"
                    value={searchLaboratoryParams.query}
                    placeholder="Patient ID or Name or PhoneNo "
                    onChange={(e) => handleSearchChange("Laboratory", e)}
                  />
                </div>

                <div className=" search_div_bar_inp_1">
                  <label htmlFor="">
                    Status
                    <span>:</span>
                  </label>
                  <select
                    id=""
                    name="status"
                    value={searchLaboratoryParams.status}
                    onChange={(e) => handleStatusChange("Laboratory", e)}
                  >
                    <option value="">Select</option>
                    <option value="Registered">Registered</option>
                    <option value="Paid">Paid</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="search_div_bar_inp_1">
                  <label htmlFor="userInput">
                    User
                    <span>:</span>
                  </label>
                  <input
                    list="userOptions"
                    id="userInput"
                    name="User"
                    value={searchLaboratoryParams.User}
                    onChange={handleUserChange}
                  />
                  <datalist id="userOptions">
                    {Array.from(
                      new Set(PatientLaboratoryRegisterData?.map((item) => item.created_by))
                    ).map((user, index) => (
                      <option key={index} value={user} />
                    ))}
                  </datalist>
                </div>

                {/* <button
                  className="search_div_bar_btn_1"
                  onClick={handlenewPatientRegister}
                  title="New Patient Register"
                >
                  <LoupeIcon />
                </button> */}
              </div>
              <ReactGrid
                columns={PatientLaboratoryRegisterColumns}
                RowData={PatientLaboratoryRegisterData}
              />
            </div>
          )}

         
        </div>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />


      {openModal1 && (
        <div className="sideopen_showcamera_profile" onClick={handleCloseModal1}>
          <div className="newwProfiles" onClick={(e) => e.stopPropagation()}>
            <h2>{openModal1}</h2>

            <TokenPatient rowData={selectedRowData} />

            <div className="Main_container_Btn">
              <button onClick={handleCloseModal1}>Close</button>
            </div> </div>
        </div>
      )}

      {openModal && (
        <div className="sideopen_showcamera_profile" onClick={handleCloseModal}>
          <div
            className="newwProfiles"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{openModal}</h2>
            {getModalContent()}
            <div className="Main_container_Btn">
              <button onClick={handleCloseModal}>Close</button>
            </div>{" "}
          </div>
        </div>
      )}

      {IPModal && (
        <div className="sideopen_showcamera_profile" onClick={handleCloseIPModal}>
          <div
            className="newwProfiles"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{IPModal}</h2>
            {getIPModalContent()}
            <div className="Main_container_Btn">
              <button onClick={handleCloseIPModal}>Close</button>
            </div>{" "}
          </div>
        </div>
      )}

      {/* {openModal && (
        <div className="sideopen_showcamera_profile" onClick={handleCloseModal}>
          <div
            className="newwProfiles"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{openModal}</h2>
            {getModalContentip()}
            <div className="Main_container_Btn">
              <button onClick={handleCloseModal}>Close</button>
            </div>{" "}
          </div>
        </div>
      )} */}




      {labModal && (
              <div
                className={isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"}
                onClick={() => setlabModal(false)}
              >
                <div
                  className="newwProfiles newwPopupforreason uwagduaguleaveauto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <br />
                  <div className="appointment">
                    <div className="h_head">
                      <h4>Tests</h4>
                    </div>
                    <div className="Main_container_app">
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', width: '70px' }}>S.No</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', width: '250px' }}>Test Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(viewtest) &&
                            viewtest.map((test) => (
                              <React.Fragment key={test.itemid}>
                                <tr>
                                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    {test.id}
                                  </td>
                                  <td style={{ border: "1px solid #ddd", padding: "8px", display: "flex", alignItems: "center" }}>
                                    <span>{test.Name || "Unnamed Test"}</span>
                                    {/* {test.subTests?.length > 0 && (
                                      <Button
                                        onClick={() => toggleSubTests(test.itemid)}
                                        sx={{ minWidth: "30px", padding: "0", marginLeft: "8px" }}
                                      >
                                        {expandedTest === test.itemid ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                      </Button>
                                    )} */}
                                  </td>
                                </tr>
                                {/* {expandedTest === test.itemid &&
                                  test.subTests?.length > 0 &&
                                  test.subTests.map((subTest, idx) => (
                                    <tr key={`${test.itemid}_${idx}`}>
                                      <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
                                      <td style={{ border: "1px solid #ddd", padding: "8px", paddingLeft: "28px" }}>
                                        {subTest.test_name} {subTest.test_code ? `(Code: ${subTest.test_code})` : ""}
                                      </td>
                                    </tr>
                                  ))} */}
                              </React.Fragment>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="Register_btn_con">
                    <button className="RegisterForm_1_btns" onClick={() => setlabModal(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
 

    </>
  );
};
export default RegistrationList;
