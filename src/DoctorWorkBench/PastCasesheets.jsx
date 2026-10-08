// import React, { useState, useEffect } from "react";
// import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
// import { IconButton } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import PrintIcon from "@mui/icons-material/Print";
// import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
// import { ToastContainer, toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import axios from 'axios';
// import { Modal, Box, Typography, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

// const PastCasesheets = () => {
//     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//     const toast = useSelector(state => state.userRecord?.toast);
//     const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.DoctorWorkbenchNavigation);
//     const userRecord = useSelector((state) => state.userRecord?.UserData);
//     const dispatch = useDispatch();

//     const formatDate = (date) => {
//         const d = new Date(date);
//         const month = (d.getMonth() + 1).toString().padStart(2, "0");
//         const day = d.getDate().toString().padStart(2, "0");
//         const year = d.getFullYear();
//         return `${year}-${month}-${day}`;
//     };

//     const [DocInfo, setDocInfo] = useState({
//         DoctorId: DoctorWorkbenchNavigation?.DoctorId || '',
//         DoctorName: DoctorWorkbenchNavigation?.DoctorName || ''
//     });

//     const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
//     const [CasesheetDatas, setCasesheetDatas] = useState([]);

//     // Add missing state variables
//     const [selectedCasesheet, setSelectedCasesheet] = useState(null);
//     const [modalMode, setModalMode] = useState('view');
//     const [openModal, setOpenModal] = useState(false);

//     const [DocList, setDocList] = useState([]);

//     useEffect(() => {
//         axios.get(`${UrlLink}Masters/get_Doctor_Detials_link`)
//             .then((res) => setDocList(res.data))
//             .catch((err) => console.log(err));
//     }, [UrlLink]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name === 'DoctorName') {
//             if (value.includes('|')) {
//                 const [id, name] = value.split('|');
//                 setDocInfo({
//                     DoctorId: id,
//                     DoctorName: name
//                 });
//             } else {
//                 setDocInfo({
//                     ...DocInfo,
//                     DoctorName: value,
//                     DoctorId: ''
//                 });
//             }
//         }
//     };

//     const [searchOptions, setSearchOptions] = useState({
//         DateType: "All",
//         CurrentDate: formatDate(new Date()),
//         FromDate: "",
//         ToDate: "",
//         ParticularDate: "",
//         PatientId: DoctorWorkbenchNavigation?.PatientId
//     });

//     const HandleOnchangeSearch = (e) => {
//         const { name, value } = e.target;
//         if (name === "SearchbyPhoneNumber") {
//             if (value.length <= 10) {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     [name]: value,
//                 }));
//             }
//         } else if (name === "DateType") {
//             if (value === "Current") {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     DateType: value,
//                     CurrentDate: TodayDate,
//                     FromDate: "",
//                     ToDate: "",
//                 }));
//             } else if (value === "Customize") {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     DateType: value,
//                     CurrentDate: "",
//                 }));
//             } else if (value === "Particular") {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     DateType: value,
//                     FromDate: "",
//                     ToDate: "",
//                 }));
//             } else if (value === "All") {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     DateType: value,
//                     CurrentDate: "",
//                     FromDate: "",
//                     ToDate: "",
//                 }));
//             }
//         } else {
//             setSearchOptions((prev) => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
//     };

//     useEffect(() => {
//         const params = {
//             ...searchOptions,
//             ...DocInfo,
//         };

//         axios.get(`${UrlLink}Workbench/get_past_casesheets_details_for_doctor`, { params })
//             .then((res) => {
//                 console.log('Casesheet Data:', res.data); // Log response for debugging
//                 if (Array.isArray(res.data.casesheets)) {
//                     setCasesheetDatas(res.data.casesheets);
//                 } else {
//                     setCasesheetDatas([]);
//                 }
//             })
//             .catch((err) => console.log(err));
//     }, [UrlLink, searchOptions, DocInfo]);

//     const handleViewCasesheet = (row) => {
//         setSelectedCasesheet(row);
//         setModalMode('view');
//         setOpenModal(true);
//     };

//     const handlePrintCasesheet = (row) => {
//         setSelectedCasesheet(row);
//         setModalMode('print');
//         setOpenModal(true);
//         setTimeout(() => {
//             window.print();
//         }, 500);
//     };

//     const handleCloseModal = () => {
//         setOpenModal(false);
//         setSelectedCasesheet(null);
//     };

//     const renderCasesheetContent = () => {
//         if (!selectedCasesheet) return null;

//         return (
//             <Box sx={{ p: 2 }}>
//                 <Typography variant="h6">Casesheet: {selectedCasesheet.Registration_Id}</Typography>
//                 <Typography>Doctor: {selectedCasesheet.DoctorName} ({selectedCasesheet.Speciality})</Typography>

//                 {/* Vitals Section */}
//                 {selectedCasesheet.vitals && selectedCasesheet.vitals.length > 0 && (
//                     <>
//                         <Typography variant="subtitle1" sx={{ mt: 2 }}>Vitals</Typography>
//                         <TableContainer component={Paper}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Temperature</TableCell>
//                                         <TableCell>Pulse Rate</TableCell>
//                                         <TableCell>SPO2</TableCell>
//                                         <TableCell>Heart Rate</TableCell>
//                                         <TableCell>Respiratory Rate</TableCell>
//                                         <TableCell>SBP</TableCell>
//                                         <TableCell>DBP</TableCell>
//                                         <TableCell>Height</TableCell>
//                                         <TableCell>Weight</TableCell>
//                                         <TableCell>BMI</TableCell>
//                                         <TableCell>Pain Score</TableCell>
//                                         <TableCell>Date</TableCell>
//                                         <TableCell>Time</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {selectedCasesheet.vitals.map((vital, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{vital.Temperature}</TableCell>
//                                             <TableCell>{vital.PulseRate}</TableCell>
//                                             <TableCell>{vital.SPO2}</TableCell>
//                                             <TableCell>{vital.HeartRate}</TableCell>
//                                             <TableCell>{vital.RespiratoryRate}</TableCell>
//                                             <TableCell>{vital.SBP}</TableCell>
//                                             <TableCell>{vital.DBP}</TableCell>
//                                             <TableCell>{vital.Height}</TableCell>
//                                             <TableCell>{vital.Weight}</TableCell>
//                                             <TableCell>{vital.BMI}</TableCell>
//                                             <TableCell>{vital.Painscore}</TableCell>
//                                             <TableCell>{vital.Date}</TableCell>
//                                             <TableCell>{vital.Time}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </>
//                 )}

//                 {/* Evaluations Section */}
//                 {selectedCasesheet.evaluations && selectedCasesheet.evaluations.length > 0 && (
//                     <>
//                         <Typography variant="subtitle1" sx={{ mt: 2 }}>Evaluations</Typography>
//                         {selectedCasesheet.evaluations.map((evalItem, index) => (
//                             <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
//                                 <Typography><strong>Key Complaint:</strong> {evalItem.KeyComplaint}</Typography>
//                                 <Typography><strong>Chief Complaint:</strong> {evalItem.cheifComplaint}</Typography>
//                                 <Typography><strong>History:</strong> {evalItem.History}</Typography>
//                                 <Typography><strong>Examination:</strong> {evalItem.Examine}</Typography>
//                                 <Typography><strong>Diagnosis:</strong> {evalItem.Diagnosis}</Typography>
//                                 <Typography><strong>Date:</strong> {evalItem.Date}</Typography>
//                                 <Typography><strong>Time:</strong> {evalItem.Time}</Typography>
//                             </Box>
//                         ))}
//                     </>
//                 )}

//                 {/* Radiology Section */}
//                 {selectedCasesheet.radiology && selectedCasesheet.radiology.length > 0 && (
//                     <>
//                         <Typography variant="subtitle1" sx={{ mt: 2 }}>Radiology</Typography>
//                         <TableContainer component={Paper}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>ID</TableCell>
//                                         <TableCell>Radiology Name</TableCell>
//                                         <TableCell>Test Name</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {selectedCasesheet.radiology.map((rad, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{rad.id}</TableCell>
//                                             <TableCell>{rad.RadiologyName}</TableCell>
//                                             <TableCell>{rad.TestName}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </>
//                 )}

//                 {/* Lab Requests Section */}
//                 {selectedCasesheet.lab_requests && selectedCasesheet.lab_requests.length > 0 && (
//                     <>
//                         <Typography variant="subtitle1" sx={{ mt: 2 }}>Lab Requests</Typography>
//                         <TableContainer component={Paper}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>ID</TableCell>
//                                         <TableCell>Test Name</TableCell>
//                                         {/* <TableCell>Department</TableCell> */}
//                                         <TableCell>Sub Department</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {selectedCasesheet.lab_requests.map((lab, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{lab.id}</TableCell>
//                                             <TableCell>{lab.TestName || lab.PackageName || lab.GroupName}</TableCell>
//                                             {/* <TableCell>{lab.Department}</TableCell> */}
//                                             <TableCell>{lab.SubDepartment}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </>
//                 )}

//                 {/* Prescriptions Section */}
//                 {selectedCasesheet.prescriptions && selectedCasesheet.prescriptions.length > 0 && (
//                     <>
//                         <Typography variant="subtitle1" sx={{ mt: 2 }}>Prescriptions</Typography>
//                         <TableContainer component={Paper}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Item Name</TableCell>
//                                         <TableCell>Item Type</TableCell>
//                                         <TableCell>Frequency</TableCell>
//                                         <TableCell>Route</TableCell>
//                                         <TableCell>Duration</TableCell>
//                                         <TableCell>Quantity</TableCell>
//                                         <TableCell>Instruction</TableCell>
//                                         <TableCell>Date</TableCell>
//                                         <TableCell>Time</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {selectedCasesheet.prescriptions.map((pres, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{pres.ItemName}</TableCell>
//                                             <TableCell>{pres.ItemType}</TableCell>
//                                             <TableCell>{pres.Frequency}</TableCell>
//                                             <TableCell>{pres.Route}</TableCell>
//                                             <TableCell>{pres.DurationNumber} {pres.DurationUnit}</TableCell>
//                                             <TableCell>{pres.Qty}</TableCell>
//                                             <TableCell>{pres.Instruction}</TableCell>
//                                             <TableCell>{pres.Date}</TableCell>
//                                             <TableCell>{pres.Time}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </>
//                 )}
//             </Box>
//         );
//     };

//     const CasesheetColumns = [
//         { key: "Registration_Id", name: "OPNo", frozen: true },
//         { key: "DoctorName", name: "DoctorName" },
//         { key: "Speciality", name: "Speciality" },
//         {
//             key: "Action",
//             name: "Action",
//             renderCell: (params) => (
//                 <div style={{ display: "flex", gap: "8px" }}>
//                     <VisibilityIcon
//                         onClick={() => handleViewCasesheet(params.row)}
//                         style={{ cursor: "pointer" }}
//                     />
//                     <PrintIcon
//                         onClick={() => handlePrintCasesheet(params.row)}
//                         style={{ cursor: "pointer" }}
//                     />
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <div className="Main_container_app">
//             <h3>Past Casesheets</h3>
//             <div className="RegisFormcon_1">
//                 <div className="RegisForm_1">
//                     <label>Doctor Name<span>:</span></label>
//                     <input
//                         type="text"
//                         name="DoctorName"
//                         value={DocInfo.DoctorName}
//                         onChange={handleInputChange}
//                         autoComplete='off'
//                         list="Docids"
//                     />
//                     <datalist id="Docids">
//                         {DocList.map((row, index) => (
//                             <option key={index} value={`${row.id}|${row.Name}`}>
//                                 {row.Name}
//                             </option>
//                         ))}
//                     </datalist>
//                 </div>

//                 <div className="RegisForm_1">
//                     <label>
//                         Date Type<span>:</span>
//                     </label>
//                     <select
//                         name="DateType"
//                         value={searchOptions.DateType}
//                         onChange={HandleOnchangeSearch}
//                     >
//                         <option value="All">All</option>
//                         <option value="Current">Current Date</option>
//                         <option value="Customize">Customize</option>
//                         <option value="Particular">Particular</option>
//                     </select>
//                 </div>

//                 {searchOptions.DateType === "Current" && (
//                     <div className="RegisForm_1">
//                         <label>
//                             Current Date<span>:</span>
//                         </label>
//                         <input
//                             type="date"
//                             name="CurrentDate"
//                             value={searchOptions.CurrentDate}
//                             onChange={HandleOnchangeSearch}
//                             readOnly
//                         />
//                     </div>
//                 )}

//                 {searchOptions.DateType === "Particular" && (
//                     <div className="RegisForm_1">
//                         <label>
//                             Particular Date<span>:</span>
//                         </label>
//                         <input
//                             type="date"
//                             name="ParticularDate"
//                             value={searchOptions.ParticularDate}
//                             onChange={HandleOnchangeSearch}
//                         />
//                     </div>
//                 )}

//                 {searchOptions.DateType === "Customize" && (
//                     <>
//                         <div className="RegisForm_1">
//                             <label>
//                                 From Date<span>:</span>
//                             </label>
//                             <input
//                                 type="date"
//                                 name="FromDate"
//                                 value={searchOptions.FromDate}
//                                 onChange={HandleOnchangeSearch}
//                             />
//                         </div>
//                         <div className="RegisForm_1">
//                             <label>
//                                 To Date<span>:</span>
//                             </label>
//                             <input
//                                 type="date"
//                                 name="ToDate"
//                                 value={searchOptions.ToDate}
//                                 onChange={HandleOnchangeSearch}
//                                 min={searchOptions.FromDate}
//                             />
//                         </div>
//                     </>
//                 )}

//                 <ReactGrid columns={CasesheetColumns} RowData={CasesheetDatas} />

//                 <Modal
//                     open={openModal}
//                     onClose={handleCloseModal}
//                     aria-labelledby="casesheet-modal"
//                 >
//                     <Box sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         width: modalMode === 'print' ? '80%' : '60%',
//                         bgcolor: 'background.paper',
//                         boxShadow: 24,
//                         p: 4,
//                         maxHeight: '90vh',
//                         overflowY: 'auto',
//                     }}>
//                         {renderCasesheetContent()}
//                         <Button onClick={handleCloseModal} sx={{ mt: 2 }}>Close</Button>
//                         {modalMode === 'print' && <Button onClick={() => window.print()} sx={{ mt: 2, ml: 2 }}>Print</Button>}
//                     </Box>
//                 </Modal>
//             </div>
//         </div>
//     );
// };

// export default PastCasesheets;



// import React, { useState, useEffect } from "react";
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   Typography, 
//   Grid, 
//   TextField, 
//   Select, 
//   MenuItem, 
//   FormControl, 
//   InputLabel,
//   Box,
//   Chip,
//   Divider,
//   Paper,
//   Table,
//   TableContainer,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Modal,
//   Button,
//   IconButton,
//   Tooltip,
//   Avatar,
//   Badge,
//   Stack,
//   Container
// } from '@mui/material';
// import {
//   Visibility as VisibilityIcon,
//   Print as PrintIcon,
//   LocalHospital as HospitalIcon,
//   Person as PersonIcon,
//   CalendarToday as CalendarIcon,
//   Search as SearchIcon,
//   Close as CloseIcon,
//   Assignment as AssignmentIcon,
//   MonitorHeart as VitalsIcon,
//   Science as LabIcon,
//   LocalPharmacy as PharmacyIcon,
//   MedicalServices as MedicalIcon
// } from '@mui/icons-material';

// // Mock data and functions to simulate the Redux store and API calls
// const mockCasesheetData = [
//   {
//     Registration_Id: "OP001",
//     DoctorName: "Dr. John Smith",
//     Speciality: "Cardiology",
//     Date: "2025-09-15",
//     vitals: [
//       {
//         Temperature: "98.6°F",
//         PulseRate: "72",
//         SPO2: "98%",
//         HeartRate: "72",
//         RespiratoryRate: "16",
//         SBP: "120",
//         DBP: "80",
//         Height: "5'8\"",
//         Weight: "70kg",
//         BMI: "22.5",
//         Painscore: "2",
//         Date: "2025-09-15",
//         Time: "10:30 AM"
//       }
//     ],
//     evaluations: [
//       {
//         KeyComplaint: "Chest pain",
//         cheifComplaint: "Patient complains of mild chest discomfort",
//         History: "No previous cardiac issues",
//         Examine: "Heart sounds normal, no murmurs",
//         Diagnosis: "Non-specific chest pain",
//         Date: "2025-09-15",
//         Time: "10:35 AM"
//       }
//     ],
//     prescriptions: [
//       {
//         ItemName: "Aspirin",
//         ItemType: "Tablet",
//         Frequency: "Once daily",
//         Route: "Oral",
//         DurationNumber: "7",
//         DurationUnit: "days",
//         Qty: "7",
//         Instruction: "Take after meals",
//         Date: "2025-09-15",
//         Time: "10:40 AM"
//       }
//     ]
//   },
//   {
//     Registration_Id: "OP002",
//     DoctorName: "Dr. Sarah Johnson",
//     Speciality: "Pediatrics",
//     Date: "2025-09-14"
//   }
// ];

// const PastCasesheets = () => {
//   const [DocInfo, setDocInfo] = useState({
//     DoctorId: '',
//     DoctorName: ''
//   });

//   const [searchOptions, setSearchOptions] = useState({
//     DateType: "All",
//     CurrentDate: new Date().toISOString().split('T')[0],
//     FromDate: "",
//     ToDate: "",
//     ParticularDate: "",
//     PatientId: ""
//   });

//   const [CasesheetDatas, setCasesheetDatas] = useState(mockCasesheetData);
//   const [selectedCasesheet, setSelectedCasesheet] = useState(null);
//   const [modalMode, setModalMode] = useState('view');
//   const [openModal, setOpenModal] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setDocInfo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const HandleOnchangeSearch = (e) => {
//     const { name, value } = e.target;
//     setSearchOptions(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleViewCasesheet = (row) => {
//     setSelectedCasesheet(row);
//     setModalMode('view');
//     setOpenModal(true);
//   };

//   const handlePrintCasesheet = (row) => {
//     setSelectedCasesheet(row);
//     setModalMode('print');
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedCasesheet(null);
//   };

//   const renderSearchFilters = () => (
//     <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//       <CardHeader 
//         title={
//           <Box display="flex" alignItems="center" gap={1}>
//             <SearchIcon color="primary" />
//             <Typography variant="h6" fontWeight="600">
//               Search Filters
//             </Typography>
//           </Box>
//         }
//         sx={{ pb: 1 }}
//       />
//       <CardContent>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={4}>
//             <TextField
//               fullWidth
//               label="Doctor Name"
//               name="DoctorName"
//               value={DocInfo.DoctorName}
//               onChange={handleInputChange}
//               variant="outlined"
//               InputProps={{
//                 startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
//               }}
//             />
//           </Grid>
          
//           <Grid item xs={12} md={4}>
//             <FormControl fullWidth variant="outlined">
//               <InputLabel>Date Type</InputLabel>
//               <Select
//                 name="DateType"
//                 value={searchOptions.DateType}
//                 onChange={HandleOnchangeSearch}
//                 label="Date Type"
//                 startAdornment={<CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />}
//               >
//                 <MenuItem value="All">All Dates</MenuItem>
//                 <MenuItem value="Current">Current Date</MenuItem>
//                 <MenuItem value="Customize">Date Range</MenuItem>
//                 <MenuItem value="Particular">Specific Date</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           {searchOptions.DateType === "Current" && (
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 label="Current Date"
//                 name="CurrentDate"
//                 value={searchOptions.CurrentDate}
//                 onChange={HandleOnchangeSearch}
//                 variant="outlined"
//                 InputLabelProps={{ shrink: true }}
//                 disabled
//               />
//             </Grid>
//           )}

//           {searchOptions.DateType === "Particular" && (
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 label="Select Date"
//                 name="ParticularDate"
//                 value={searchOptions.ParticularDate}
//                 onChange={HandleOnchangeSearch}
//                 variant="outlined"
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//           )}

//           {searchOptions.DateType === "Customize" && (
//             <>
//               <Grid item xs={12} md={3}>
//                 <TextField
//                   fullWidth
//                   type="date"
//                   label="From Date"
//                   name="FromDate"
//                   value={searchOptions.FromDate}
//                   onChange={HandleOnchangeSearch}
//                   variant="outlined"
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <TextField
//                   fullWidth
//                   type="date"
//                   label="To Date"
//                   name="ToDate"
//                   value={searchOptions.ToDate}
//                   onChange={HandleOnchangeSearch}
//                   variant="outlined"
//                   InputLabelProps={{ shrink: true }}
//                   inputProps={{ min: searchOptions.FromDate }}
//                 />
//               </Grid>
//             </>
//           )}
//         </Grid>
//       </CardContent>
//     </Card>
//   );

//   const renderCasesheetCards = () => (
//     <Grid container spacing={3}>
//       {CasesheetDatas.map((casesheet, index) => (
//         <Grid item xs={12} md={6} lg={4} key={index}>
//           <Card 
//             sx={{ 
//               height: '100%',
//               borderRadius: 3,
//               boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//               transition: 'all 0.3s ease',
//               '&:hover': {
//                 transform: 'translateY(-4px)',
//                 boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
//               }
//             }}
//           >
//             <CardHeader
//               avatar={
//                 <Avatar sx={{ bgcolor: 'primary.main' }}>
//                   <AssignmentIcon />
//                 </Avatar>
//               }
//               title={
//                 <Typography variant="h6" fontWeight="600" color="primary">
//                   {casesheet.Registration_Id}
//                 </Typography>
//               }
//               subheader={
//                 <Chip 
//                   label={casesheet.Date || 'N/A'} 
//                   size="small" 
//                   color="secondary"
//                   icon={<CalendarIcon />}
//                 />
//               }
//             />
            
//             <CardContent sx={{ pt: 0 }}>
//               <Stack spacing={2}>
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <PersonIcon color="action" fontSize="small" />
//                   <Typography variant="body2" fontWeight="500">
//                     {casesheet.DoctorName}
//                   </Typography>
//                 </Box>
                
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <HospitalIcon color="action" fontSize="small" />
//                   <Chip 
//                     label={casesheet.Speciality} 
//                     size="small"
//                     variant="outlined"
//                     color="primary"
//                   />
//                 </Box>
                
//                 <Divider />
                
//                 <Box display="flex" justifyContent="space-between" alignItems="center">
//                   <Typography variant="caption" color="text.secondary">
//                     Actions
//                   </Typography>
//                   <Box display="flex" gap={1}>
//                     <Tooltip title="View Details">
//                       <IconButton 
//                         color="primary"
//                         onClick={() => handleViewCasesheet(casesheet)}
//                         sx={{ 
//                           bgcolor: 'primary.50',
//                           '&:hover': { bgcolor: 'primary.100' }
//                         }}
//                       >
//                         <VisibilityIcon fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Print">
//                       <IconButton 
//                         color="secondary"
//                         onClick={() => handlePrintCasesheet(casesheet)}
//                         sx={{ 
//                           bgcolor: 'secondary.50',
//                           '&:hover': { bgcolor: 'secondary.100' }
//                         }}
//                       >
//                         <PrintIcon fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );

//   const renderSectionWithIcon = (icon, title, content) => (
//     <Card sx={{ mb: 3, borderRadius: 2 }}>
//       <CardHeader
//         avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{icon}</Avatar>}
//         title={<Typography variant="h6" fontWeight="600">{title}</Typography>}
//       />
//       <CardContent>
//         {content}
//       </CardContent>
//     </Card>
//   );

//   const renderCasesheetContent = () => {
//     if (!selectedCasesheet) return null;

//     return (
//       <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
//         {/* Header */}
//         <Box mb={3}>
//           <Typography variant="h4" fontWeight="700" color="primary" gutterBottom>
//             Casesheet Details
//           </Typography>
//           <Box display="flex" gap={2} flexWrap="wrap">
//             <Chip 
//               label={`OP No: ${selectedCasesheet.Registration_Id}`}
//               color="primary"
//               variant="filled"
//             />
//             <Chip 
//               label={`Doctor: ${selectedCasesheet.DoctorName}`}
//               color="secondary"
//               variant="outlined"
//             />
//             <Chip 
//               label={selectedCasesheet.Speciality}
//               color="info"
//               variant="outlined"
//             />
//           </Box>
//         </Box>

//         {/* Vitals Section */}
//         {selectedCasesheet.vitals && selectedCasesheet.vitals.length > 0 && 
//           renderSectionWithIcon(
//             <VitalsIcon />,
//             "Vital Signs",
//             <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
//               <Table>
//                 <TableHead sx={{ bgcolor: 'grey.50' }}>
//                   <TableRow>
//                     <TableCell fontWeight="600">Temperature</TableCell>
//                     <TableCell fontWeight="600">Pulse Rate</TableCell>
//                     <TableCell fontWeight="600">SPO2</TableCell>
//                     <TableCell fontWeight="600">Blood Pressure</TableCell>
//                     <TableCell fontWeight="600">Height/Weight</TableCell>
//                     <TableCell fontWeight="600">BMI</TableCell>
//                     <TableCell fontWeight="600">Pain Score</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {selectedCasesheet.vitals.map((vital, index) => (
//                     <TableRow key={index} hover>
//                       <TableCell>{vital.Temperature}</TableCell>
//                       <TableCell>{vital.PulseRate}</TableCell>
//                       <TableCell>
//                         <Chip label={vital.SPO2} size="small" color="success" />
//                       </TableCell>
//                       <TableCell>{vital.SBP}/{vital.DBP}</TableCell>
//                       <TableCell>{vital.Height}, {vital.Weight}</TableCell>
//                       <TableCell>
//                         <Chip label={vital.BMI} size="small" color="info" />
//                       </TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={vital.Painscore} 
//                           size="small" 
//                           color={vital.Painscore <= 3 ? "success" : vital.Painscore <= 6 ? "warning" : "error"}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )
//         }

//         {/* Evaluations Section */}
//         {selectedCasesheet.evaluations && selectedCasesheet.evaluations.length > 0 &&
//           renderSectionWithIcon(
//             <MedicalIcon />,
//             "Medical Evaluation",
//             <Stack spacing={2}>
//               {selectedCasesheet.evaluations.map((evalItem, index) => (
//                 <Paper key={index} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} md={6}>
//                       <Typography variant="subtitle2" color="primary" gutterBottom>
//                         Key Complaint
//                       </Typography>
//                       <Typography variant="body2" mb={2}>
//                         {evalItem.KeyComplaint}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <Typography variant="subtitle2" color="primary" gutterBottom>
//                         Chief Complaint
//                       </Typography>
//                       <Typography variant="body2" mb={2}>
//                         {evalItem.cheifComplaint}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Typography variant="subtitle2" color="primary" gutterBottom>
//                         History & Examination
//                       </Typography>
//                       <Typography variant="body2" mb={1}>
//                         <strong>History:</strong> {evalItem.History}
//                       </Typography>
//                       <Typography variant="body2" mb={1}>
//                         <strong>Examination:</strong> {evalItem.Examine}
//                       </Typography>
//                       <Typography variant="body2">
//                         <strong>Diagnosis:</strong> {evalItem.Diagnosis}
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Paper>
//               ))}
//             </Stack>
//           )
//         }

//         {/* Prescriptions Section */}
//         {selectedCasesheet.prescriptions && selectedCasesheet.prescriptions.length > 0 &&
//           renderSectionWithIcon(
//             <PharmacyIcon />,
//             "Prescriptions",
//             <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
//               <Table>
//                 <TableHead sx={{ bgcolor: 'grey.50' }}>
//                   <TableRow>
//                     <TableCell fontWeight="600">Medicine</TableCell>
//                     <TableCell fontWeight="600">Frequency</TableCell>
//                     <TableCell fontWeight="600">Duration</TableCell>
//                     <TableCell fontWeight="600">Instructions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {selectedCasesheet.prescriptions.map((pres, index) => (
//                     <TableRow key={index} hover>
//                       <TableCell>
//                         <Box>
//                           <Typography variant="body2" fontWeight="600">
//                             {pres.ItemName}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {pres.ItemType} - {pres.Route}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Chip label={pres.Frequency} size="small" color="primary" variant="outlined" />
//                       </TableCell>
//                       <TableCell>
//                         {pres.DurationNumber} {pres.DurationUnit}
//                       </TableCell>
//                       <TableCell>{pres.Instruction}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )
//         }
//       </Box>
//     );
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 3 }}>
//       {/* Page Header */}
//       <Box mb={4}>
//         <Typography 
//           variant="h3" 
//           fontWeight="700" 
//           color="primary"
//           gutterBottom
//           sx={{ 
//             background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent'
//           }}
//         >
//           Past Casesheets
//         </Typography>
//         <Typography variant="subtitle1" color="text.secondary">
//           View and manage historical patient casesheets
//         </Typography>
//       </Box>

//       {/* Search Filters */}
//       {renderSearchFilters()}

//       {/* Results */}
//       <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//         <CardHeader
//           title={
//             <Box display="flex" alignItems="center" gap={1}>
//               <AssignmentIcon color="primary" />
//               <Typography variant="h6" fontWeight="600">
//                 Casesheet Records
//               </Typography>
//               <Badge badgeContent={CasesheetDatas.length} color="primary" />
//             </Box>
//           }
//         />
//         <CardContent>
//           {CasesheetDatas.length > 0 ? renderCasesheetCards() : (
//             <Box textAlign="center" py={4}>
//               <AssignmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
//               <Typography variant="h6" color="text.secondary">
//                 No casesheets found
//               </Typography>
//               <Typography variant="body2" color="text.disabled">
//                 Try adjusting your search filters
//               </Typography>
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* Modal */}
//       <Modal
//         open={openModal}
//         onClose={handleCloseModal}
//         aria-labelledby="casesheet-modal"
//       >
//         <Box sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: modalMode === 'print' ? '90%' : '80%',
//           bgcolor: 'background.paper',
//           borderRadius: 3,
//           boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
//           p: 4,
//           maxHeight: '90vh',
//           overflowY: 'auto',
//         }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//             <Typography variant="h5" fontWeight="600" color="primary">
//               Casesheet Details
//             </Typography>
//             <IconButton onClick={handleCloseModal} size="small">
//               <CloseIcon />
//             </IconButton>
//           </Box>
          
//           {renderCasesheetContent()}
          
//           <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
//             <Button onClick={handleCloseModal} variant="outlined">
//               Close
//             </Button>
//             {modalMode === 'print' && (
//               <Button 
//                 onClick={() => window.print()} 
//                 variant="contained"
//                 startIcon={<PrintIcon />}
//               >
//                 Print
//               </Button>
//             )}
//           </Box>
//         </Box>
//       </Modal>
//     </Container>
//   );
// };

// export default PastCasesheets;



// deepseek

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Table,
//   TableContainer,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
//   Modal,
//   Grid,
//   Card,
//   CardContent,
//   CardHeader,
//   TextField,
//   MenuItem,
//   InputAdornment,
//   Chip,
//   Divider,
//   IconButton,
//   Tooltip,
//   AppBar,
//   Tabs,
//   Tab
// } from '@mui/material';
// import {
//   Visibility as VisibilityIcon,
//   Print as PrintIcon,
//   Search as SearchIcon,
//   DateRange as DateRangeIcon,
//   Person as PersonIcon
// } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
// import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
// import { useDispatch, useSelector } from "react-redux";
// import axios from 'axios';

// // Styled components for better UI
// const StyledCard = styled(Card)(({ theme }) => ({
//   borderRadius: '12px',
//   boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//   marginBottom: theme.spacing(3),
// }));

// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   borderRadius: '8px',
//   marginTop: theme.spacing(2),
//   '& .MuiTableHead-root': {
//     backgroundColor: theme.palette.primary.light,
//     '& .MuiTableCell-root': {
//       color: theme.palette.common.white,
//       fontWeight: 'bold',
//     }
//   }
// }));

// const SearchSection = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(3),
//   backgroundColor: theme.palette.grey[50],
//   borderRadius: '12px',
//   marginBottom: theme.spacing(3),
// }));

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// }

// const PastCasesheets = () => {
//     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//     const toast = useSelector(state => state.userRecord?.toast);
//     const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.DoctorWorkbenchNavigation);
//     const userRecord = useSelector((state) => state.userRecord?.UserData);
//     const dispatch = useDispatch();

//     const formatDate = (date) => {
//         const d = new Date(date);
//         const month = (d.getMonth() + 1).toString().padStart(2, "0");
//         const day = d.getDate().toString().padStart(2, "0");
//         const year = d.getFullYear();
//         return `${year}-${month}-${day}`;
//     };

//     const [DocInfo, setDocInfo] = useState({
//         DoctorId: DoctorWorkbenchNavigation?.DoctorId || '',
//         DoctorName: DoctorWorkbenchNavigation?.DoctorName || ''
//     });

//     const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
//     const [CasesheetDatas, setCasesheetDatas] = useState([]);
//     const [selectedCasesheet, setSelectedCasesheet] = useState(null);
//     const [modalMode, setModalMode] = useState('view');
//     const [openModal, setOpenModal] = useState(false);
//     const [DocList, setDocList] = useState([]);
//     const [tabValue, setTabValue] = useState(0);

//     useEffect(() => {
//         axios.get(`${UrlLink}Masters/get_Doctor_Detials_link`)
//             .then((res) => setDocList(res.data))
//             .catch((err) => console.log(err));
//     }, [UrlLink]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name === 'DoctorName') {
//             if (value.includes('|')) {
//                 const [id, name] = value.split('|');
//                 setDocInfo({
//                     DoctorId: id,
//                     DoctorName: name
//                 });
//             } else {
//                 setDocInfo({
//                     ...DocInfo,
//                     DoctorName: value,
//                     DoctorId: ''
//                 });
//             }
//         }
//     };

//     const [searchOptions, setSearchOptions] = useState({
//         DateType: "All",
//         CurrentDate: formatDate(new Date()),
//         FromDate: "",
//         ToDate: "",
//         ParticularDate: "",
//         PatientId: DoctorWorkbenchNavigation?.PatientId
//     });

//     const HandleOnchangeSearch = (e) => {
//         const { name, value } = e.target;
//         if (name === "SearchbyPhoneNumber") {
//             if (value.length <= 10) {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     [name]: value,
//                 }));
//             }
//         } else if (name === "DateType") {
//             if (value === "Current") {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     DateType: value,
//                     CurrentDate: TodayDate,
//                     FromDate: "",
//                     ToDate: "",
//                 }));
//             } else if (value === "Customize") {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     DateType: value,
//                     CurrentDate: "",
//                 }));
//             } else if (value === "Particular") {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     DateType: value,
//                     FromDate: "",
//                     ToDate: "",
//                 }));
//             } else if (value === "All") {
//                 setSearchOptions((prev) => ({
//                     ...prev,
//                     DateType: value,
//                     CurrentDate: "",
//                     FromDate: "",
//                     ToDate: "",
//                 }));
//             }
//         } else {
//             setSearchOptions((prev) => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
//     };

//     useEffect(() => {
//         const params = {
//             ...searchOptions,
//             ...DocInfo,
//         };

//         axios.get(`${UrlLink}Workbench/get_past_casesheets_details_for_doctor`, { params })
//             .then((res) => {
//                 console.log('Casesheet Data:', res.data);
//                 if (Array.isArray(res.data.casesheets)) {
//                     setCasesheetDatas(res.data.casesheets);
//                 } else {
//                     setCasesheetDatas([]);
//                 }
//             })
//             .catch((err) => console.log(err));
//     }, [UrlLink, searchOptions, DocInfo]);

//     const handleViewCasesheet = (row) => {
//         setSelectedCasesheet(row);
//         setModalMode('view');
//         setOpenModal(true);
//         setTabValue(0);
//     };

//     const handlePrintCasesheet = (row) => {
//         setSelectedCasesheet(row);
//         setModalMode('print');
//         setOpenModal(true);
//         setTimeout(() => {
//             window.print();
//         }, 500);
//     };

//     const handleCloseModal = () => {
//         setOpenModal(false);
//         setSelectedCasesheet(null);
//     };

//     const handleTabChange = (event, newValue) => {
//         setTabValue(newValue);
//     };

//     const renderCasesheetContent = () => {
//         if (!selectedCasesheet) return null;

//         return (
//             <Box sx={{ p: 2 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                     <Typography variant="h4" color="primary" fontWeight="bold">
//                         Casesheet Details
//                     </Typography>
//                     <Chip 
//                         label={`OP No: ${selectedCasesheet.Registration_Id}`} 
//                         color="primary" 
//                         variant="outlined"
//                     />
//                 </Box>

//                 <Box sx={{ mb: 3, p: 2, backgroundColor: 'primary.light', color: 'white', borderRadius: 1 }}>
//                     <Typography variant="h6">Patient Information</Typography>
//                     <Typography>Doctor: {selectedCasesheet.DoctorName} ({selectedCasesheet.Speciality})</Typography>
//                 </Box>

//                 <AppBar position="static" color="default" sx={{ mb: 2 }}>
//                     <Tabs
//                         value={tabValue}
//                         onChange={handleTabChange}
//                         indicatorColor="primary"
//                         textColor="primary"
//                         variant="scrollable"
//                         scrollButtons="auto"
//                     >
//                         <Tab label="Vitals" />
//                         <Tab label="Evaluations" />
//                         <Tab label="Radiology" />
//                         <Tab label="Lab Requests" />
//                         <Tab label="Prescriptions" />
//                     </Tabs>
//                 </AppBar>

//                 {/* Vitals Section */}
//                 <TabPanel value={tabValue} index={0}>
//                     {selectedCasesheet.vitals && selectedCasesheet.vitals.length > 0 ? (
//                         <StyledTableContainer component={Paper}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Temperature</TableCell>
//                                         <TableCell>Pulse Rate</TableCell>
//                                         <TableCell>SPO2</TableCell>
//                                         <TableCell>Heart Rate</TableCell>
//                                         <TableCell>Respiratory Rate</TableCell>
//                                         <TableCell>SBP</TableCell>
//                                         <TableCell>DBP</TableCell>
//                                         <TableCell>Height</TableCell>
//                                         <TableCell>Weight</TableCell>
//                                         <TableCell>BMI</TableCell>
//                                         <TableCell>Pain Score</TableCell>
//                                         <TableCell>Date</TableCell>
//                                         <TableCell>Time</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {selectedCasesheet.vitals.map((vital, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{vital.Temperature}</TableCell>
//                                             <TableCell>{vital.PulseRate}</TableCell>
//                                             <TableCell>{vital.SPO2}</TableCell>
//                                             <TableCell>{vital.HeartRate}</TableCell>
//                                             <TableCell>{vital.RespiratoryRate}</TableCell>
//                                             <TableCell>{vital.SBP}</TableCell>
//                                             <TableCell>{vital.DBP}</TableCell>
//                                             <TableCell>{vital.Height}</TableCell>
//                                             <TableCell>{vital.Weight}</TableCell>
//                                             <TableCell>{vital.BMI}</TableCell>
//                                             <TableCell>{vital.Painscore}</TableCell>
//                                             <TableCell>{vital.Date}</TableCell>
//                                             <TableCell>{vital.Time}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </StyledTableContainer>
//                     ) : (
//                         <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
//                             No vitals recorded for this casesheet.
//                         </Typography>
//                     )}
//                 </TabPanel>

//                 {/* Evaluations Section */}
//                 <TabPanel value={tabValue} index={1}>
//                     {selectedCasesheet.evaluations && selectedCasesheet.evaluations.length > 0 ? (
//                         <Grid container spacing={2}>
//                             {selectedCasesheet.evaluations.map((evalItem, index) => (
//                                 <Grid item xs={12} key={index}>
//                                     <Card variant="outlined">
//                                         <CardContent>
//                                             <Typography variant="h6" gutterBottom color="primary">
//                                                 Evaluation #{index + 1}
//                                             </Typography>
//                                             <Grid container spacing={2}>
//                                                 <Grid item xs={12} md={6}>
//                                                     <Typography><strong>Key Complaint:</strong> {evalItem.KeyComplaint}</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={12} md={6}>
//                                                     <Typography><strong>Chief Complaint:</strong> {evalItem.cheifComplaint}</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={12}>
//                                                     <Typography><strong>History:</strong> {evalItem.History}</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={12}>
//                                                     <Typography><strong>Examination:</strong> {evalItem.Examine}</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={12}>
//                                                     <Typography><strong>Diagnosis:</strong> {evalItem.Diagnosis}</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={12} md={6}>
//                                                     <Typography><strong>Date:</strong> {evalItem.Date}</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={12} md={6}>
//                                                     <Typography><strong>Time:</strong> {evalItem.Time}</Typography>
//                                                 </Grid>
//                                             </Grid>
//                                         </CardContent>
//                                     </Card>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     ) : (
//                         <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
//                             No evaluations recorded for this casesheet.
//                         </Typography>
//                     )}
//                 </TabPanel>

//                 {/* Other sections would follow the same pattern */}
//                 {/* Remaining sections (Radiology, Lab Requests, Prescriptions) would be implemented similarly */}
                
//             </Box>
//         );
//     };

//     const CasesheetColumns = [
//         { key: "Registration_Id", name: "OP No", frozen: true, width: 120 },
//         { key: "DoctorName", name: "Doctor Name", width: 200 },
//         { key: "Speciality", name: "Speciality", width: 150 },
//         { key: "Date", name: "Date", width: 120 },
//         { key: "Time", name: "Time", width: 100 },
//         {
//             key: "Action",
//             name: "Actions",
//             width: 120,
//             renderCell: (params) => (
//                 <Box sx={{ display: "flex", gap: 1 }}>
//                     <Tooltip title="View Casesheet">
//                         <IconButton
//                             color="primary"
//                             onClick={() => handleViewCasesheet(params.row)}
//                         >
//                             <VisibilityIcon />
//                         </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Print Casesheet">
//                         <IconButton
//                             color="secondary"
//                             onClick={() => handlePrintCasesheet(params.row)}
//                         >
//                             <PrintIcon />
//                         </IconButton>
//                     </Tooltip>
//                 </Box>
//             ),
//         },
//     ];

//     return (
//         <Box sx={{ p: 3 }}>
//             <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
//                 Past Casesheets
//             </Typography>

//             <StyledCard>
//                 <CardHeader title="Search Filters" titleTypographyProps={{ variant: 'h6' }} />
//                 <CardContent>
//                     <Grid container spacing={3}>
//                         <Grid item xs={12} md={6}>
//                             <TextField
//                                 fullWidth
//                                 label="Doctor Name"
//                                 name="DoctorName"
//                                 value={DocInfo.DoctorName}
//                                 onChange={handleInputChange}
//                                 autoComplete='off'
//                                 select
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <PersonIcon color="action" />
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             >
//                                 {DocList.map((row, index) => (
//                                     <MenuItem key={index} value={`${row.id}|${row.Name}`}>
//                                         {row.Name}
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>

//                         <Grid item xs={12} md={6}>
//                             <TextField
//                                 fullWidth
//                                 label="Date Type"
//                                 name="DateType"
//                                 value={searchOptions.DateType}
//                                 onChange={HandleOnchangeSearch}
//                                 select
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <DateRangeIcon color="action" />
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             >
//                                 <MenuItem value="All">All</MenuItem>
//                                 <MenuItem value="Current">Current Date</MenuItem>
//                                 <MenuItem value="Customize">Custom Range</MenuItem>
//                                 <MenuItem value="Particular">Particular Date</MenuItem>
//                             </TextField>
//                         </Grid>

//                         {searchOptions.DateType === "Current" && (
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Current Date"
//                                     name="CurrentDate"
//                                     value={searchOptions.CurrentDate}
//                                     onChange={HandleOnchangeSearch}
//                                     type="date"
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>
//                         )}

//                         {searchOptions.DateType === "Particular" && (
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Particular Date"
//                                     name="ParticularDate"
//                                     value={searchOptions.ParticularDate}
//                                     onChange={HandleOnchangeSearch}
//                                     type="date"
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>
//                         )}

//                         {searchOptions.DateType === "Customize" && (
//                             <>
//                                 <Grid item xs={12} md={6}>
//                                     <TextField
//                                         fullWidth
//                                         label="From Date"
//                                         name="FromDate"
//                                         value={searchOptions.FromDate}
//                                         onChange={HandleOnchangeSearch}
//                                         type="date"
//                                         InputLabelProps={{ shrink: true }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12} md={6}>
//                                     <TextField
//                                         fullWidth
//                                         label="To Date"
//                                         name="ToDate"
//                                         value={searchOptions.ToDate}
//                                         onChange={HandleOnchangeSearch}
//                                         type="date"
//                                         InputLabelProps={{ shrink: true }}
//                                         inputProps={{ min: searchOptions.FromDate }}
//                                     />
//                                 </Grid>
//                             </>
//                         )}

//                         <Grid item xs={12}>
//                             <Button
//                                 variant="contained"
//                                 startIcon={<SearchIcon />}
//                                 sx={{ mr: 2 }}
//                             >
//                                 Search
//                             </Button>
//                             <Button variant="outlined">
//                                 Clear
//                             </Button>
//                         </Grid>
//                     </Grid>
//                 </CardContent>
//             </StyledCard>

//             <StyledCard>
//                 <CardHeader 
//                     title="Casesheet Results" 
//                     titleTypographyProps={{ variant: 'h6' }}
//                     action={
//                         <Chip 
//                             label={`${CasesheetDatas.length} Records Found`} 
//                             color="primary" 
//                             variant="outlined" 
//                         />
//                     }
//                 />
//                 <CardContent>
//                     <ReactGrid 
//                         columns={CasesheetColumns} 
//                         RowData={CasesheetDatas} 
//                         height={400}
//                     />
//                 </CardContent>
//             </StyledCard>

//             <Modal
//                 open={openModal}
//                 onClose={handleCloseModal}
//                 aria-labelledby="casesheet-modal"
//             >
//                 <Box sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: modalMode === 'print' ? '90%' : '85%',
//                     bgcolor: 'background.paper',
//                     boxShadow: 24,
//                     borderRadius: 2,
//                     maxHeight: '90vh',
//                     overflowY: 'auto',
//                 }}>
//                     {renderCasesheetContent()}
//                     <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: 1, borderColor: 'divider' }}>
//                         <Button onClick={handleCloseModal} variant="outlined" sx={{ mr: 2 }}>
//                             Close
//                         </Button>
//                         {modalMode === 'view' && (
//                             <Button 
//                                 onClick={() => {
//                                     setModalMode('print');
//                                     setTimeout(() => window.print(), 500);
//                                 }} 
//                                 variant="contained"
//                                 startIcon={<PrintIcon />}
//                             >
//                                 Print
//                             </Button>
//                         )}
//                     </Box>
//                 </Box>
//             </Modal>
//         </Box>
//     );
// };

// export default PastCasesheets;




// grok

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Divider,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  Stack,
  Container,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  MonitorHeart as VitalsIcon,
  Science as LabIcon,
  LocalPharmacy as PharmacyIcon,
  MedicalServices as MedicalIcon,
} from "@mui/icons-material";

const PastCasesheets = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatch = useDispatch();

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [DocInfo, setDocInfo] = useState({
    DoctorId: DoctorWorkbenchNavigation?.DoctorId || "",
    DoctorName: DoctorWorkbenchNavigation?.DoctorName || "",
  });
  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  const [CasesheetDatas, setCasesheetDatas] = useState([]);
  const [selectedCasesheet, setSelectedCasesheet] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [openModal, setOpenModal] = useState(false);
  const [DocList, setDocList] = useState([]);

  const [searchOptions, setSearchOptions] = useState({
    DateType: "All",
    CurrentDate: formatDate(new Date()),
    FromDate: "",
    ToDate: "",
    ParticularDate: "",
    PatientId: DoctorWorkbenchNavigation?.PatientId || "",
  });

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_Doctor_Detials_link`)
      .then((res) => setDocList(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    const params = {
      ...searchOptions,
      ...DocInfo,
    };
    axios
      .get(`${UrlLink}Workbench/get_past_casesheets_details_for_doctor`, {
        params,
      })
      .then((res) => {
        console.log("Casesheet Data:", res.data);
        if (Array.isArray(res.data.casesheets)) {
          setCasesheetDatas(res.data.casesheets);
        } else {
          setCasesheetDatas([]);
        }
      })
      .catch((err) => console.log(err));
  }, [UrlLink, searchOptions, DocInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "DoctorName") {
      if (value.includes("|")) {
        const [id, name] = value.split("|");
        setDocInfo({
          DoctorId: id,
          DoctorName: name,
        });
      } else {
        setDocInfo({
          ...DocInfo,
          DoctorName: value,
          DoctorId: "",
        });
      }
    }
  };

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === "SearchbyPhoneNumber") {
      if (value.length <= 10) {
        setSearchOptions((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
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
      } else if (value === "Particular") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          FromDate: "",
          ToDate: "",
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

  const handleViewCasesheet = (row) => {
    setSelectedCasesheet(row);
    setModalMode("view");
    setOpenModal(true);
  };

  const handlePrintCasesheet = (row) => {
    setSelectedCasesheet(row);
    setModalMode("print");
    setOpenModal(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCasesheet(null);
  };

  const renderSearchFilters = () => (
    <Card
      sx={{ mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <SearchIcon color="primary" />
            <Typography variant="h6" fontWeight="600">
              Search Filters
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Doctor Name"
              name="DoctorName"
              value={DocInfo.DoctorName}
              onChange={handleInputChange}
              variant="outlined"
              autoComplete="off"
              inputProps={{ list: "Docids" }}
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
            <datalist id="Docids">
              {DocList.map((row, index) => (
                <option key={index} value={`${row.id}|${row.Name}`}>
                  {row.Name}
                </option>
              ))}
            </datalist>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Date Type</InputLabel>
              <Select
                name="DateType"
                value={searchOptions.DateType}
                onChange={HandleOnchangeSearch}
                label="Date Type"
                startAdornment={
                  <CalendarIcon sx={{ mr: 1, color: "text.secondary" }} />
                }
              >
                <MenuItem value="All">All Dates</MenuItem>
                <MenuItem value="Current">Current Date</MenuItem>
                <MenuItem value="Customize">Date Range</MenuItem>
                <MenuItem value="Particular">Specific Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {searchOptions.DateType === "Current" && (
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Current Date"
                name="CurrentDate"
                value={searchOptions.CurrentDate}
                onChange={HandleOnchangeSearch}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </Grid>
          )}
          {searchOptions.DateType === "Particular" && (
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Select Date"
                name="ParticularDate"
                value={searchOptions.ParticularDate}
                onChange={HandleOnchangeSearch}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}
          {searchOptions.DateType === "Customize" && (
            <>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  name="FromDate"
                  value={searchOptions.FromDate}
                  onChange={HandleOnchangeSearch}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  name="ToDate"
                  value={searchOptions.ToDate}
                  onChange={HandleOnchangeSearch}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: searchOptions.FromDate }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderCasesheetCards = () => (
    <Grid container spacing={3}>
      {CasesheetDatas.map((casesheet, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <AssignmentIcon />
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight="600" color="primary">
                  {casesheet.Registration_Id}
                </Typography>
              }
              subheader={
                <Chip
                  label={casesheet.OPDate || "N/A"}
                  size="small"
                  color="secondary"
                  icon={<CalendarIcon />}
                />
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="action" fontSize="small" />
                  <Typography variant="body2" fontWeight="500">
                    {casesheet.DoctorName}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <HospitalIcon color="action" fontSize="small" />
                  <Chip
                    label={casesheet.Speciality}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>
                <Divider />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" color="text.secondary">
                    Actions
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewCasesheet(casesheet)}
                        sx={{
                          bgcolor: "primary.50",
                          "&:hover": { bgcolor: "primary.100" },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Print">
                      <IconButton
                        color="secondary"
                        onClick={() => handlePrintCasesheet(casesheet)}
                        sx={{
                          bgcolor: "secondary.50",
                          "&:hover": { bgcolor: "secondary.100" },
                        }}
                      >
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </Tooltip> */}
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderSectionWithIcon = (icon, title, content) => (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: "primary.main" }}>{icon}</Avatar>}
        title={<Typography variant="h6" fontWeight="600">{title}</Typography>}
      />
      <CardContent>{content}</CardContent>
    </Card>
  );

  const renderCasesheetContent = () => {
    if (!selectedCasesheet) return null;

    return (
      <Box sx={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Box mb={3}>
          <Typography
            variant="h4"
            fontWeight="700"
            color="primary"
            gutterBottom
          >
            Casesheet Details
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip
              label={`OP No: ${selectedCasesheet.Registration_Id}`}
              color="primary"
              variant="filled"
            />
            <Chip
              label={`Doctor: ${selectedCasesheet.DoctorName}`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={selectedCasesheet.Speciality}
              color="info"
              variant="outlined"
            />
          </Box>
        </Box>

        {selectedCasesheet.vitals && selectedCasesheet.vitals.length > 0 && (
          renderSectionWithIcon(
            <VitalsIcon />,
            "Vital Signs",
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell fontWeight="600">Temperature</TableCell>
                    <TableCell fontWeight="600">Pulse Rate</TableCell>
                    <TableCell fontWeight="600">SPO2</TableCell>
                    <TableCell fontWeight="600">Blood Pressure</TableCell>
                    <TableCell fontWeight="600">Height/Weight</TableCell>
                    <TableCell fontWeight="600">BMI</TableCell>
                    <TableCell fontWeight="600">Pain Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedCasesheet.vitals.map((vital, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{vital.Temperature}</TableCell>
                      <TableCell>{vital.PulseRate}</TableCell>
                      <TableCell>
                        <Chip
                          label={vital.SPO2}
                          size="small"
                          color="success"
                        />
                      </TableCell>
                      <TableCell>
                        {vital.SBP}/{vital.DBP}
                      </TableCell>
                      <TableCell>
                        {vital.Height}, {vital.Weight}
                      </TableCell>
                      <TableCell>
                        <Chip label={vital.BMI} size="small" color="info" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={vital.Painscore}
                          size="small"
                          color={
                            vital.Painscore <= 3
                              ? "success"
                              : vital.Painscore <= 6
                              ? "warning"
                              : "error"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}

        {selectedCasesheet.evaluations &&
          selectedCasesheet.evaluations.length > 0 && (
            renderSectionWithIcon(
              <MedicalIcon />,
              "Medical Evaluation",
              <Stack spacing={2}>
                {selectedCasesheet.evaluations.map((evalItem, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          gutterBottom
                        >
                          Key Complaint
                        </Typography>
                        <Typography variant="body2" mb={2}>
                          {evalItem.KeyComplaint}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          gutterBottom
                        >
                          Chief Complaint
                        </Typography>
                        <Typography variant="body2" mb={2}>
                          {evalItem.cheifComplaint}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          gutterBottom
                        >
                          History & Examination
                        </Typography>
                        <Typography variant="body2" mb={1}>
                          <strong>History:</strong> {evalItem.History}
                        </Typography>
                        <Typography variant="body2" mb={1}>
                          <strong>Examination:</strong> {evalItem.Examine}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Diagnosis:</strong> {evalItem.Diagnosis}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            )
          )}

        {selectedCasesheet.radiology && selectedCasesheet.radiology.length > 0 && (
          renderSectionWithIcon(
            <LabIcon />,
            "Radiology",
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell fontWeight="600">ID</TableCell>
                    <TableCell fontWeight="600">Radiology Name</TableCell>
                    <TableCell fontWeight="600">Test Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedCasesheet.radiology.map((rad, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{rad.id}</TableCell>
                      <TableCell>{rad.RadiologyName}</TableCell>
                      <TableCell>{rad.TestName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}

        {selectedCasesheet.lab_requests &&
          selectedCasesheet.lab_requests.length > 0 && (
            renderSectionWithIcon(
              <LabIcon />,
              "Lab Requests",
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <Table>
                  <TableHead sx={{ bgcolor: "grey.50" }}>
                    <TableRow>
                      <TableCell fontWeight="600">ID</TableCell>
                      <TableCell fontWeight="600">Test Name</TableCell>
                      <TableCell fontWeight="600">Sub Department</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedCasesheet.lab_requests.map((lab, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{lab.id}</TableCell>
                        <TableCell>
                          {lab.TestName || lab.PackageName || lab.GroupName}
                        </TableCell>
                        <TableCell>{lab.SubDepartment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}

        {selectedCasesheet.prescriptions &&
          selectedCasesheet.prescriptions.length > 0 && (
            renderSectionWithIcon(
              <PharmacyIcon />,
              "Prescriptions",
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <Table>
                  <TableHead sx={{ bgcolor: "grey.50" }}>
                    <TableRow>
                      <TableCell fontWeight="600">Medicine</TableCell>
                      <TableCell fontWeight="600">Frequency</TableCell>
                      <TableCell fontWeight="600">Duration</TableCell>
                      <TableCell fontWeight="600">Instructions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedCasesheet.prescriptions.map((pres, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {pres.ItemName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {pres.ItemType} - {pres.Route}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={pres.Frequency}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {pres.DurationNumber} {pres.DurationUnit}
                        </TableCell>
                        <TableCell>{pres.Instruction}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box mb={4}>
        <Typography
          variant="h3"
          fontWeight="700"
          gutterBottom
          sx={{
            background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Past Casesheets
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and manage historical patient casesheets
        </Typography>
      </Box>

      {renderSearchFilters()}

      <Card
        sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      >
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <AssignmentIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                Casesheet Records
              </Typography>
            </Box>
          }
        />
        <CardContent>
          {CasesheetDatas.length > 0 ? (
            renderCasesheetCards()
          ) : (
            <Box textAlign="center" py={4}>
              <AssignmentIcon
                sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No casesheets found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Try adjusting your search filters
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="casesheet-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: modalMode === "print" ? "90%" : "80%",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" fontWeight="600" color="primary">
              Casesheet Details
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {renderCasesheetContent()}
          <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
            <Button onClick={handleCloseModal} variant="outlined">
              Close
            </Button>
            {modalMode === "print" && (
              <Button
                onClick={() => window.print()}
                variant="contained"
                startIcon={<PrintIcon />}
              >
                Print
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default PastCasesheets;


















