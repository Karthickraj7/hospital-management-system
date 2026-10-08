// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
// import EditIcon from "@mui/icons-material/Edit";
// import DocumentEditor from "../Masters/RadiologyMaster/DocumentEditor";
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@mui/material';

// const RadiologyDoctor = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [queueList, setQueueList] = useState([]);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [editorVisible, setEditorVisible] = useState(false);
//   const [selectedDocId, setSelectedDocId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch completed reports awaiting doctor approval
//   const fetchQueueList = () => {
//     setLoading(true);
//     axios.get(`${UrlLink}OP/Radiology_Complete_Details_Link`)
//       .then((res) => {
//         // Format the data to match the desired queue list order
//         const formattedData = res.data.map(item => ({
//           id: item.id,
//           PatientID: item.Registeration_Id,
//           PatientName: item.PatientName || 'N/A',
//           RadiologyName: item.RadiologyName || item.subdepartment || 'N/A',
//           TestName: item.TestName || 'N/A',
//           DoctorName: item.RadiologistName || 'N/A',
//           Report: item.Report || 'N/A',
//           ReportDate: item.ReportDate || 'N/A',
//           ReportContent: item.htmlcontent || '',
//           Radiology_CompleteId: item.Radiology_CompleteId || ''
//         }));
//         setQueueList(formattedData);
//       })
//       .catch((err) => {
//         console.error("Error fetching queue list:", err);
//         const tdata = {
//           message: "Error loading reports queue",
//           type: "error",
//         };
//         dispatch({ type: "toast", value: tdata });
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchQueueList();
//   }, [UrlLink]);

//   const columns = [
//     {
//       key: "id",
//       name: "S.No",
//       width: "80px",
//     },
//     {
//       key: "PatientID",
//       name: "Patient ID",
//       width: "120px",
//     },
//     {
//       key: "PatientName",
//       name: "Patient Name",
//       width: "150px",
//     },
//     {
//       key: "RadiologyName",
//       name: "Radiology Name",
//       width: "150px",
//     },
//     {
//       key: "TestName",
//       name: "Test Name",
//       width: "180px",
//     },
//     {
//       key: "DoctorName",
//       name: "Doctor Name",
//       width: "150px",
//     },
//     {
//       key: "ReportDate",
//       name: "Report Date",
//       width: "120px",
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <Button
//           className="cell_btn"
//           onClick={() => handleEditReport(params.row)}
//         >
//           <EditIcon className="check_box_clrr_cancell" />
//         </Button>
//       ),
//     },
//   ];

//   const handleEditReport = (row) => {
//     setSelectedReport(row);
//     if (row.ReportContent) {
//       setSelectedDocId(row.Radiology_CompleteId);
//       setEditorVisible(true);
//     } else {
//       const tdata = {
//         message: "No report content available to edit",
//         type: "warn",
//       };
//       dispatch({ type: "toast", value: tdata });
//     }
//   };

//   const handleApproveReport = (reportId) => {
//     if (!reportId) return;
    
//     axios.post(`${UrlLink}OP/Approve_Radiology_Report`, { reportId })
//       .then((res) => {
//         const tdata = {
//           message: "Report approved successfully",
//           type: "success",
//         };
//         dispatch({ type: "toast", value: tdata });
//         fetchQueueList(); // Refresh the queue
//       })
//       .catch((err) => {
//         console.error("Error approving report:", err);
//         const tdata = {
//           message: "Error approving report",
//           type: "error",
//         };
//         dispatch({ type: "toast", value: tdata });
//       });
//   };

//   const handleOnCloseEditor = (saved = false) => {
//     setEditorVisible(false);
//     setSelectedDocId(null);
//     if (saved) {
//       fetchQueueList(); // Refresh if changes were saved
//     }
//   };

//   return (
//     <div className="RegisFormcon_1">
//       <div className="common_center_tag">
//         <span>Reports Awaiting Doctor Approval</span>
//       </div>
      
//       {loading ? (
//         <div className="loading-spinner">Loading reports...</div>
//       ) : queueList.length > 0 ? (
//         <>
//           <ReactGrid 
//             columns={columns} 
//             RowData={queueList} 
//             style={{ marginTop: '20px' }}
//           />
          
//           {selectedReport && (
//             <div className="report-actions" style={{ marginTop: '20px' }}>
//               <Button 
//                 variant="contained" 
//                 color="primary"
//                 onClick={() => handleApproveReport(selectedReport.Radiology_CompleteId)}
//                 style={{ marginRight: '10px' }}
//               >
//                 Approve Report
//               </Button>
//               <Button 
//                 variant="outlined"
//                 onClick={() => setSelectedReport(null)}
//               >
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="no-reports">No reports awaiting approval</div>
//       )}

//       {editorVisible && (
//         <DocumentEditor
//           visible={editorVisible}
//           onClose={handleOnCloseEditor}
//           documentId={selectedDocId}
//         />
//       )}

//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </div>
//   );
// };

// export default RadiologyDoctor;


// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
// import EditIcon from "@mui/icons-material/Edit";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import DocumentEditor from "../Masters/RadiologyMaster/DocumentEditor";
// import { Button, Chip, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const RadiologyDoctor = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [queueList, setQueueList] = useState([]);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [editorVisible, setEditorVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState('Completed'); // 'pending', 'approved', 'all'

//   // Fetch reports based on filter
//   const fetchReports = () => {     
//     setLoading(true);
//     axios.get(`${UrlLink}OP/Radiology_Complete_Details_Link`)
//       .then((res) => {
//         // Process data to match required order
//         const processedData = res.data.map(item => ({
//           id: item.id,
//           PatientID: item.OP_Register_Id?.Registration_Id || 
//                     item.IP_Register_Id?.Registration_Id || 
//                     item.Casuality_Register_Id?.Registration_Id || 'N/A',
//           PatientName: item.OP_Register_Id?.PatientId?.First_Name || 
//                       item.IP_Register_Id?.PatientId?.First_Name || 
//                       item.Casuality_Register_Id?.PatientId?.First_Name || 'N/A',
//           RadiologyName: item.RadiologyName || item.department?.Radiology_Name || 'N/A',
//           TestName: item.TestName || 'N/A',
//           SubTestName: item.SubTestName || 'N/A',
//           DoctorName: item.RadiologistName || 'N/A',
//           ReportDate: item.ReportDate || new Date().toISOString(),
//           ReportTime: item.ReportTime || 'N/A',
//           Status: item.Status || 'Completed',
//           ReportContent: item.html_content || item.Report || '',
//           Radiology_CompleteId: item.Radiology_CompleteId,
//           fileName: item.fileName || 'Report',
//           doctorId: item.doctorId,
//           Report: item.Report,
//           ReportFiles: [
//             item.Report_fileone,
//             item.Report_filetwo,
//             item.Report_filethree
//           ].filter(Boolean)
//         }));

//         // Filter based on status
//         let filteredData = processedData;
//         if (filter === 'Completed') {
//           filteredData = processedData.filter(item => item.Status === 'Completed');
//         } else if (filter === 'approved') {
//           filteredData = processedData.filter(item => item.Status === 'APPROVED');
//         }

//         setQueueList(filteredData);
//       })
//       .catch(err => {
//         console.error("Error fetching reports:", err);
//         const tdata = {
//           message: "Error loading reports queue",
//           type: "error",
//         };
//         dispatch({ type: "toast", value: tdata });
//       })
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [UrlLink, filter]);

//   const handleEditReport = (row) => {
//     setSelectedReport(row);
//     if (row.ReportContent) {
//       setEditorVisible(true);
//     } else {
//       const tdata = {
//         message: "No report content available to edit",
//         type: "warn",
//       };
//       dispatch({ type: "toast", value: tdata });
//     }
//   };

//   const handleApproveReport = (reportId) => {
//     if (!reportId) return;
    
//     axios.post(`${UrlLink}OP/Approve_Radiology_Report`, { 
//       reportId,
//       approvedBy: userRecord.username 
//     })
//       .then((res) => {
//         const tdata = {
//           message: "Report approved successfully",
//           type: "success",
//         };
//         dispatch({ type: "toast", value: tdata });
//         fetchReports(); // Refresh the list
//       })
//       .catch((err) => {
//         console.error("Error approving report:", err);
//         const tdata = {
//           message: "Error approving report",
//           type: "error",
//         };
//         dispatch({ type: "toast", value: tdata });
//       });
//   };

//   const handleSaveReport = (updatedContent) => {
//     if (!selectedReport) return;
    
//     axios.put(`${UrlLink}OP/Radiology_Complete_Details_Link`, {
//       Radiology_CompleteId: selectedReport.Radiology_CompleteId,
//       Report: updatedContent,
//       htmlcontent: updatedContent,
//       created_by: userRecord.username
//     })
//       .then((res) => {
//         const tdata = {
//           message: "Report updated successfully",
//           type: "success",
//         };
//         dispatch({ type: "toast", value: tdata });
//         fetchReports(); // Refresh the list
//         setEditorVisible(false);
//       })
//       .catch((err) => {
//         console.error("Error saving report:", err);
//         const tdata = {
//           message: "Error saving report",
//           type: "error",
//         };
//         dispatch({ type: "toast", value: tdata });
//       });
//   };

//   const columns = [
//     {
//       key: "id",
//       name: "S.No",
//       width: "80px",
//     },
//     {
//       key: "PatientID",
//       name: "Patient ID",
//       width: "120px",
//     },
//     {
//       key: "PatientName",
//       name: "Patient Name",
//       width: "150px",
//     },
//     {
//       key: "RadiologyName",
//       name: "Radiology Name",
//       width: "150px",
//     },
//     {
//       key: "TestName",
//       name: "Test Name",
//       width: "180px",
//       renderCell: (params) => (
//         <div>
//           {params.row.TestName}
//           {params.row.SubTestName && (
//             <Typography variant="caption" display="block">
//               ({params.row.SubTestName})
//             </Typography>
//           )}
//         </div>
//       ),
//     },
//     {
//       key: "DoctorName",
//       name: "Doctor Name",
//       width: "150px",
//     },
//     {
//       key: "ReportDate",
//       name: "Report Date",
//       width: "120px",
//       renderCell: (params) => (
//         <div>
//           {new Date(params.row.ReportDate).toLocaleDateString()}
//           <Typography variant="caption" display="block">
//             {params.row.ReportTime}
//           </Typography>
//         </div>
//       ),
//     },
//     {
//       key: "Status",
//       name: "Status",
//       width: "120px",
//       renderCell: (params) => (
//         <Chip 
//           label={params.row.Status} 
//           color={params.row.Status === 'APPROVED' ? 'success' : 'warning'}
//           size="small"
//         />
//       ),
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => (
//         <div style={{ display: 'flex', gap: '8px' }}>
//           <Button
//             variant="outlined"
//             size="small"
//             onClick={() => handleEditReport(params.row)}
//             startIcon={<EditIcon />}
//           >
//             Edit
//           </Button>
//           {params.row.Status !== 'APPROVED' && (
//             <Button
//               variant="contained"
//               color="success"
//               size="small"
//               onClick={() => handleApproveReport(params.row.Radiology_CompleteId)}
//               startIcon={<CheckCircleIcon />}
//             >
//               Approve
//             </Button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="RegisFormcon_1">
//       <div className="common_center_tag">
//         <Typography variant="h5" gutterBottom>
//           Radiology Reports for Doctor Verification
//         </Typography>
        
//         <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
//           <Button 
//             variant={filter === 'pending' ? 'contained' : 'outlined'}
//             onClick={() => setFilter('pending')}
//           >
//             Pending Approval
//           </Button>
//           <Button 
//             variant={filter === 'approved' ? 'contained' : 'outlined'}
//             onClick={() => setFilter('approved')}
//           >
//             Approved Reports
//           </Button>
//           <Button 
//             variant={filter === 'all' ? 'contained' : 'outlined'}
//             onClick={() => setFilter('all')}
//           >
//             All Reports
//           </Button>
//         </div>
//       </div>
      
//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <Typography>Loading reports...</Typography>
//         </div>
//       ) : queueList.length > 0 ? (
//         <ReactGrid 
//           columns={columns} 
//           RowData={queueList} 
//           style={{ marginTop: '20px' }}
//         />
//       ) : (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <Typography>No reports found for the selected filter</Typography>
//         </div>
//       )}

//       {editorVisible && selectedReport && (
//         <DocumentEditor
//           visible={editorVisible}
//           onClose={() => setEditorVisible(false)}
//           documentId={selectedReport.Radiology_CompleteId}
//           onSave={handleSaveReport}
//           initialContent={selectedReport.ReportContent}
//         />
//       )}

//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </div>
//   );
// };

// export default RadiologyDoctor;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
// import EditIcon from "@mui/icons-material/Edit";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import DocumentEditor from "../Masters/RadiologyMaster/DocumentEditor";
// import { Button, Chip, Typography, TextField, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const RadiologyDoctor = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [queueList, setQueueList] = useState([]);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [editorVisible, setEditorVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [employeeId, setEmployeeId] = useState('');

//   // Fetch reports based on filters
//   const fetchReports = () => {     
//     setLoading(true);
//     axios.get(`${UrlLink}OP/Radiology_Queuelist_link_for_All_doctor`, {
//       params: {
//         query: searchQuery,
//         status: statusFilter,
//         Employeeid: employeeId || userRecord?.Employeeid
//       }
//     })
//     .then((res) => {
//       // Process data to match required order
//       const processedData = res.data.map(item => ({
//         id: item.id,
//         PatientId: item.PatientId || 'N/A', // Fix key
//         PatientName: item.PatientName || 'N/A',
//         RegisterType: item.RegisterType || 'N/A', // Add this
//         PhoneNumber: item.PhoneNumber || 'N/A',
//         DoctorShortName: item.DoctorName || item.RadiologistName || 'N/A',
//         age: item.age,
//         gender: item.gender,
//         Status: item.Status || 'N/A',
//         isCompleted: item.isCompleted,
//       }));

//       setQueueList(processedData);
//     })
//     .catch(err => {
//       console.error("Error fetching reports:", err);
//       const tdata = {
//         message: err.response?.data?.error || "Error loading reports queue",
//         type: "error",
//       };
//       dispatch({ type: "toast", value: tdata });
//     })
//     .finally(() => setLoading(false));
//   };

//   const handleeditOPPatientRegister = (params) => {
//   if(params.Status==="Request"){
//     const tdata = {
//           message: 'Billing not yet Completed',
//           type: 'warn',
//       };
//       dispatch({ type: 'toast', value: tdata });
//   }
//     dispatch({ type: 'RadiologyWorkbenchNavigation', value: { params } });
//     //navigate('/Home/RadiologyRequest');
//     navigate('/Home/RadiologyReport');
//  };

//   useEffect(() => {
//     fetchReports();
//   }, [statusFilter, searchQuery]);


//   // const columns = [
//   //   {
//   //     key: "id",
//   //     name: "S.No",
//   //     width: "80px",
//   //   },
//   //   {
//   //     key: "PatientID",
//   //     name: "Patient ID",
//   //     width: "120px",
//   //   },
//   //   {
//   //     key: "PatientName",
//   //     name: "Patient Name",
//   //     width: "150px",
//   //     renderCell: (params) => (
//   //       <div>
//   //         {params.row.PatientName}
//   //         <Typography variant="caption" display="block">
//   //           {params.row.age}/{params.row.gender}
//   //         </Typography>
//   //         <Typography variant="caption" display="block">
//   //           {params.row.PhoneNumber}
//   //         </Typography>
//   //       </div>
//   //     ),
//   //   },
//   //   {
//   //     key: "RadiologyName",
//   //     name: "Radiology Name",
//   //     width: "150px",
//   //   },
//   //   {
//   //     key: "TestName",
//   //     name: "Test Name",
//   //     width: "180px",
//   //   },
//   //   {
//   //     key: "DoctorName",
//   //     name: "Doctor Name",
//   //     width: "150px",
//   //   },
//   //   {
//   //     key: "ReportDate",
//   //     name: "Report Date",
//   //     width: "120px",
//   //     renderCell: (params) => (
//   //       <div>
//   //         {new Date(params.row.ReportDate).toLocaleDateString()}
//   //       </div>
//   //     ),
//   //   },
//   //   {
//   //     key: "Status",
//   //     name: "Status",
//   //     width: "120px",
//   //     renderCell: (params) => (
//   //       <Chip 
//   //         label={params.row.Status} 
//   //         color={
//   //           params.row.Status === 'APPROVED' ? 'success' : 
//   //           params.row.Status === 'Completed' ? 'primary' : 'warning'
//   //         }
//   //         size="small"
//   //       />
//   //     ),
//   //   },
   
//   // ];

//   const columns = [
//     {
//       key: "id",
//       name: "S.No",
//     },
//     {
//       key: "PatientId",
//       name: "Patient Id",
//     },
//     {
//       key: "PatientName",
//       name: "Patient Name",
//       width:280,
//     },
//     {
//       key: "RegisterType",
//       name: "Register Type ",
//       width: 150,
//     },
//     {
//       key: "PhoneNumber",
//       name: "PhoneNo",
//       width: 120,
//     },
//     {
//       key: "DoctorShortName",
//       name: "Doctor Name",
//       width: 120,
//     },
//     {
//       key: "Action",
//       name: "Action",
//       width: 110,
//       renderCell: (params) => (
//         <Button
//           className="cell_btn"
//           onClick={() => handleeditOPPatientRegister(params?.row)}
//         >
//           <ArrowForwardIcon className="check_box_clrr_cancell" />
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div className="RegisFormcon_1">
//       <div className="common_center_tag">
//         <Typography variant="h5" gutterBottom>
//           Radiology Reports Queue
//         </Typography>
        
//         <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//           <TextField
//             label="Search Patients"
//             variant="outlined"
//             size="small"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{ width: 300 }}
//           />
          
//           <TextField
//             select
//             label="Status"
//             variant="outlined"
//             size="small"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             sx={{ width: 200 }}
//           >
//             <option value="Completed">Completed</option>
//             <option value="APPROVED">Approved</option>
//             <option value="Pending">Pending</option>
//             <option value="Due">Due</option>
//             <option value="">All Statuses</option>
//           </TextField>
//         </Box>
//       </div>
      
//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <Typography>Loading reports...</Typography>
//         </div>
//       ) : queueList.length > 0 ? (
//         <ReactGrid 
//           columns={columns} 
//           RowData={queueList} 
//           style={{ marginTop: '20px' }}
//         />
//       ) : (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <Typography>No reports found matching your criteria</Typography>
//         </div>
//       )}

//       {editorVisible && selectedReport && (
//         <DocumentEditor
//           visible={editorVisible}
//           onClose={() => setEditorVisible(false)}
//           documentId={selectedReport.Radiology_CompleteId}         
//           initialContent={selectedReport.ReportContent}
//         />
//       )}

//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </div>
//   );
// };

// export default RadiologyDoctor;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DocumentEditor from "../Masters/RadiologyMaster/DocumentEditor";
import { Button, Chip, Typography, TextField, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RadiologyDoctor = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const reporthtmlcont = useSelector((state) => state.userRecord?.radiologyhtmlcon);
  // console.log(reporthtmlcont,'reporthtmlcont')

  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [queueList, setQueueList] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editorVisible, setEditorVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [requestid, setrequestid] = useState('');
  const [test,  settest] = useState('');
  const [selectedRow, setSelectedRow] = useState({});

  // Fetch reports based on filters
  const fetchReports = () => {     
    setLoading(true);
    axios.get(`${UrlLink}OP/Radiology_Queuelist_link_for_All_doctor`, {
      params: {
        query: searchQuery,
        status: statusFilter,
        Employeeid: employeeId || userRecord?.Employeeid,
        radiologistid : userRecord?.Doctor

      }
    })
    .then((res) => {
      // Process data to match required order
      const processedData = res.data.map(item => ({
        id: item.id,
        PatientId: item.PatientId || 'N/A',
        PatientName: item.PatientName || 'N/A',
        RegisterType: item.RegisterType || 'N/A',
        PhoneNumber: item.PhoneNumber || 'N/A',
        DoctorShortName: item.DoctorName || item.RadiologistName || 'N/A',
        age: item.age,
        gender: item.gender,
        Status: item.Status || 'N/A',
        isCompleted: item.isCompleted,
        ReportContent: item.Report || '',
        Radiology_CompleteId: item.Radiology_CompleteId || null,
        TestCode : item.TestCode,
        SubTestCode : item.SubTestCode,
        TestName : item.TestName,
        Radiology_RequestId : item.Radiology_RequestId,
        Registeration_Id: item.RegistrationId || '',
      }));

      setQueueList(processedData);
    })
    .catch(err => {
      console.error("Error fetching reports:", err);
      const tdata = {
        message: err.response?.data?.error || "Error loading reports queue",
        type: "error",
      };
      dispatch({ type: "toast", value: tdata });
    })
    .finally(() => setLoading(false));
  };

   const handleOnCloseEditor = () => {
    setEditorVisible(false);
    setSelectedDocId(null);
  };

  const handleeditOPPatientRegister = (params) => {
    if(params.Status === "Request"){
      const tdata = {
            message: 'Billing not yet Completed',
            type: 'warn',
        };
        dispatch({ type: 'toast', value: tdata });
    }
    dispatch({ type: 'RadiologyWorkbenchNavigation', value: { params } });
    navigate('/Home/RadiologyReport');
  };

  const handleViewReport = (params) => {
    setSelectedReport(params);
    console.log(params,'htmlcontent')
    setrequestid(params.Radiology_RequestId)
    settest(params.SubTestCode)
    setSelectedDocId(params.id);

    // axios.get(`${UrlLink}Radiology/get_radiology_reports_queue?&TestCode=${params.TestCode}&SubTestCode=${params.SubTestCode}&Radiology_RequestId=${params.Radiology_RequestId}`)
    // .then((res)=>{
    //   const data = res.data
    //   setSelectedDocId(data.DoctorId);
    //   setEditorVisible(true);
    //   dispatch({ type: "radiologyhtmlcon", value: true });
    // })
    // .catch((e)=>{
      
    //   const tdata = {
    //     message: e.response?.data?.error || "Error approving report",
    //     type: "error",
    //   };
    //   dispatch({ type: "toast", value: tdata });

    // })
    // setSelectedReport(params);
    setEditorVisible(true);
  };

  const handleApproveReport = (report) => {
    if (('Are you sure you want to approve this report?')) return;
    
    setLoading(true);
    axios.post(`${UrlLink}OP/Approve_Radiology_Report`, {
      reportId: report.id,
      approvedBy: userRecord?.Employeeid,
      patientId: report.PatientId,
      reportName: report.TestName || report.RadiologyName
    })
    .then(() => {
      const tdata = {
        message: 'Report approved successfully',
        type: 'success',
      };
      dispatch({ type: 'toast', value: tdata });
      fetchReports(); // Refresh the list
    })
    .catch(err => {
      console.error("Error approving report:", err);
      const tdata = {
        message: err.response?.data?.error || "Error approving report",
        type: "error",
      };
      dispatch({ type: "toast", value: tdata });
    })
    .finally(() => setLoading(false));
  };

  const handleSaveReport = (params) => {
    if(!reporthtmlcont && !selectedReport) {
      const tdata = {
        message: "No report content available to save",
        type: "warn",
      };
      dispatch({ type: "toast", value: tdata });
      return;

    }
    
    const submitData = {
      ...params,
      ...reporthtmlcont,
      created_by: userRecord?.username,
      from: 'doctor',
    }

    if (Object.keys(reporthtmlcont).length > 0) {
    axios
          .post(`${UrlLink}OP/Radiology_Complete_Details_Link`, submitData)
          .then((res) => {
            const tdata = {
              message: "Report submitted successfully",
              type: "success",
            };
            dispatch({ type: "toast", value: tdata });
            fetchReports(); 
          })
          .catch((err) => {
            console.error(err);
            const tdata = {
              message: "Error submitting report. Please try again.",
              type: "error",
            };
            dispatch({ type: "toast", value: tdata });
          });
        } else {
          const tdata = {
            message: "Check and Save the Report to Approve",
            type: "warn",
          };
          dispatch({ type: "toast", value: tdata });
        }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, searchQuery]);

  const columns = [
    {
      key: "id",
      name: "S.No",
      width: 80,
    },
    {
      key: "TestName",
      name: "Test Name",
      width: 120,
    },
    {
      key: "PatientId",
      name: "Patient ID",
      width: 120,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.row.PatientName}
          <Typography variant="caption" display="block">
            {params.row.age}/{params.row.gender}
          </Typography>
        </div>
      ),
    },
    {
      key: "RegisterType",
      name: "Register Type",
      width: 120,
    },
    {
      key: "PhoneNumber",
      name: "Phone No",
      width: 120,
    },
    {
      key: "DoctorShortName",
      name: "Doctor",
      width: 150,
    },
    {
      key: "Status",
      name: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.row.Status} 
          color={
            params.row.Status === 'Completed' ? 'success' : 
            params.row.Status === 'APPROVED' ? 'primary' : 'warning'
          }
          size="small"
        />
      ),
    },
    {
      key: 'View',
      name: 'View',
       width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* View Button */}
          <IconButton
            color="info"
            onClick={() => handleViewReport(params.row)}
            size="small"
            title="View Report"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          </Box>
          )
    },
        {
      key: "Action",
      name: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* View Button */}
          {/* <IconButton
            color="info"
            onClick={() => handleViewReport(params.row)}
            size="small"
            title="View Report"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton> */}

          {/* Approve Button */}
          <IconButton
            color="success"
            onClick={() => handleSaveReport(params.row)}
            disabled={params.row.Status === 'Completed' || params.row.Status === 'APPROVED'}
            size="small"
            title="Approve Report"
          >
            <CheckCircleIcon fontSize="small" />
          </IconButton>

          {/* Forward Button
          <IconButton
            color="primary"
            onClick={() => handleeditOPPatientRegister(params.row)}
            size="small"
            title="Edit Report"
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton> */}
        </Box>
      ),
    },
  ];

  return (
    <div className="RegisFormcon_1">
      <div className="common_center_tag">
        <Typography variant="h5" gutterBottom>
          Radiology Reports Queue
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Search Patients"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
          />
          
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ width: 200 }}
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="APPROVED">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Due">Due</option>
          </TextField>
        </Box>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Typography>Loading reports...</Typography>
        </div>
      ) : queueList.length > 0 ? (
        <ReactGrid 
          columns={columns} 
          RowData={queueList} 
          style={{ marginTop: '20px' }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Typography>No reports found matching your criteria</Typography>
        </div>
      )}

       {editorVisible && (
              <DocumentEditor
                visible={editorVisible}
                onClose={handleOnCloseEditor}
                documentId={selectedDocId}
                from = {'doctor'}
                requestid={requestid}
                test={test}
              />
            )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default RadiologyDoctor;