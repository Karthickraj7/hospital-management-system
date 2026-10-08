// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import Button from '@mui/material/Button';
// import ForwardIcon from '@mui/icons-material/Forward';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// import Tooltip from '@mui/material/Tooltip';
// import Modal from 'react-modal';
// import { GiProgression } from 'react-icons/gi';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// const theme = createTheme({
//   components: {
//     MuiDataGrid: {
//       styleOverrides: {
//         columnHeader: {
//           backgroundColor: 'var(--ProjectColor)',
//           textAlign: 'center',
//           color: 'var(--header-text-color)',
//         },
//         root: {
//           '& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer': {
//             textAlign: 'center',
//             display: 'flex !important',
//             justifyContent: 'center !important',
//           },
//           '& .MuiDataGrid-window': {
//             overflow: 'hidden !important',
//           },
//         },
//         cell: {
//           borderTop: '0px !important',
//           borderBottom: '1px solid var(--ProjectColor) !important',
//           display: 'flex',
//           justifyContent: 'center',
//         },
//       },
//     },
//   },
// });

// const getColorName = (value, min, max) => {
//   const percentage = ((value - min) / (max - min)) * 100;
//   if (percentage <= 20) return 'Panic';
//   if (percentage <= 40) return 'Abnormal - Y';
//   if (percentage <= 60) return 'Normal';
//   if (percentage <= 80) return 'Abnormal - O';
//   return 'Panic';
// };

// const DispatchList = ({ patientId }) => {
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [page, setPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState(''); // Patient Name
//   const [searchQuery1, setSearchQuery1] = useState(''); // UHID
//   const [searchQuery2, setSearchQuery2] = useState(''); // Barcode
//   const [searchQuery3, setSearchQuery3] = useState(''); // OP/IP No
//   const [summa, setSumma] = useState([]);
//   const [filteredRows, setFilteredRows] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [testdetails, setTestdetails] = useState([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [modalContent, setModalContent] = useState('');
//   const [printpapaer, setPrintpapaer] = useState('RDL');
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [smartreport, setSmartreport] = useState([]);
//   const [signperson, setSignperson] = useState('');
//   const pageSize = 10;
//   const urllink = useSelector((state) => state.userRecord?.UrlLink);
//   const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

//   dispatch({ type: 'printpapaer', value: printpapaer });

//   const yourStyles = {
//     position: 'absolute',
//     inset: '100px',
//     border: '1px solid rgb(204, 204, 204)',
//     background: 'rgb(97 90 90 / 75%)',
//     overflow: 'auto',
//     borderRadius: '4px',
//     outline: 'none',
//     padding: '0px',
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setModalContent('');
//   };

//   useEffect(() => {
//     console.log('patientId received:', patientId); // Debug log
//     const offset = page * pageSize;
//     const isSearchCleared = !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
//     const departmentCodes = userRecord?.Lab_Department?.join(',') || '';

//     if (isSearchCleared || patientId) {
//       const params = {
//         Location: userRecord?.location,
//         limit: pageSize,
//         offset: offset,
//         Refering_Hospital: userRecord?.Refering_Hospital || 'All',
//         Department: departmentCodes,
//       };
//       if (patientId) {
//         params.Patient_Id = patientId; // Filter by Patient_Id
//       }

//       axios
//         .get(`${urllink}Lab/get_patient_request_capture_data_for_dispatch`, { params })
//         .then((response) => {
//           console.log('Dispatch API Response:', response.data); // Debug log
//           const totalRecords = response.data.total_records || 0;
//           let data = response.data.patients_data.map((row, index) => ({
//             id: index + 1 + offset,
//             ...row,
//             status: 'Status',
//           }));
//           // Ensure only matching Patient_Id is shown
//           if (patientId) {
//             data = data.filter(row => row.Patient_Id === patientId);
//           }
//           data.sort((a, b) => {
//             const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
//             const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
//             return invoiceB - invoiceA;
//           });
//           setFilteredRows([]);
//           setSumma(data);
//           setTotalPages(Math.ceil(totalRecords / pageSize));
//         })
//         .catch((error) => {
//           console.error('Error fetching data:', error);
//           setSumma([]);
//           setTotalPages(0);
//         });
//     } else {
//       fetchSearchData(offset);
//     }
//   }, [urllink, userRecord?.location, userRecord?.Lab_Department, userRecord?.Refering_Hospital, page, pageSize, searchQuery, searchQuery1, searchQuery2, searchQuery3, patientId]);

//   const fetchSearchData = async (offset) => {
//     try {
//       const params = {
//         name: searchQuery,
//         uhid: searchQuery1, // UHID search
//         barcode: searchQuery2,
//         invoice: searchQuery3,
//         Refering_Hospital: userRecord?.Refering_Hospital,
//         Location: userRecord?.location,
//         limit: pageSize,
//         offset: offset,
//       };
//       if (patientId) {
//         params.Patient_Id = patientId; // Filter by Patient_Id
//       }

//       const response = await axios.get(`${urllink}Lab/dispatchsearch`, { params });
//       console.log('Search API Response:', response.data); // Debug log
//       const totalRecords = response.data.total_records || 0;
//       let data = response.data.patients_data.map((row, index) => ({
//         id: index + 1 + offset,
//         ...row,
//         status: 'Status',
//       }));
//       // Ensure only matching Patient_Id is shown
//       if (patientId) {
//         data = data.filter(row => row.Patient_Id === patientId);
//       }
//       data.sort((a, b) => {
//         const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
//         const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
//         return invoiceB - invoiceA;
//       });
//       setSumma([]);
//       setFilteredRows(data);
//       setTotalPages(Math.ceil(totalRecords / pageSize));
//     } catch (error) {
//       console.error('Error fetching search data:', error);
//       setFilteredRows([]);
//       setTotalPages(0);
//     }
//   };

//   const handleSearchChange = (e, key) => {
//     const value = e.target.value;
//     if (key === 'name') setSearchQuery(value);
//     if (key === 'phone') setSearchQuery1(value); // UHID search
//     if (key === 'barcode') setSearchQuery2(value);
//     if (key === 'invoice') setSearchQuery3(value);
//     setPage(0); // Reset to first page on search
//   };

//   const handleSampleCapture = (row) => {
//     console.log('handleSampleCapture row:', row);
//     let billinvoicee = row.Billing_Invoice.startsWith('OP');

//     if (billinvoicee) {
//       axios
//         .get(`${urllink}Lab/get_for_due_reports?Billing_Invoice=${row.Billing_Invoice}`)
//         .then((response) => {
//           const res = response.data;
//           if (res.status === 'due') {
//             alert(res.message);
//             return;
//           }
//           continueSampleCapture(row);
//         })
//         .catch((error) => {
//           console.error('Error fetching bill status:', error);
//           setLoading(false);
//         });
//     } else {
//       continueSampleCapture(row);
//     }
//   };

//   const continueSampleCapture = (row) => {
//     setLoading(true);
//     if (printpapaer) {
//       dispatch({ type: 'Capturesample', value: row });
//       dispatch({ type: 'showPrint', value: false });
//       setTimeout(() => {
//         setLoading(false);
//         dispatch({ type: 'setPreviousFolder', value: 'DispatchList' });
//         dispatch({ type: 'HrFolder', value: 'Reports' });
//         if (!patientId) {
//           navigate('/Home/Retro'); // Navigate only in standalone context
//         }
//       }, 1000);
//     }
//   };

//   const handlesmartreport = (row) => {
//     axios
//       .get(`${urllink}Lab/get_data_for_smart_report`, {
//         params: {
//           invoice: row.Billing_Invoice,
//           Patient_Id: row.Patient_Id, // Use Patient_Id
//           Visitid: row.Visit_Id,
//         },
//       })
//       .then((response) => {
//         let data = response.data;
//         if (response.error || data.length === 0) {
//           setOpenModal(false);
//         } else {
//           setOpenModal(true);
//           setSmartreport(data);
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   const handlechoosep_paper = (e) => {
//     const { value } = e.target;
//     setPrintpapaer(value);
//     dispatch({ type: 'printpapaer', value: value });
//   };

//   const handleview = (params) => {
//     setTestdetails(params);
//     setOpenModal((prev) => !prev);
//   };

//   const dynamicColumns = [
//     { key: 'Patient_Id', headerName: 'Patient Id', width: 100 },
//     { key: 'Barcode', headerName: 'Sample Id', width: 100 },
//     { key: 'Billing_Invoice', headerName: 'Invoice', width: 100 },
//     { key: 'Visit_Id', headerName: 'Visit Id', width: 70 },
//     { key: 'UpdatedAt', headerName: 'Date', width: 100 },
//     { key: 'Patient_Name', headerName: 'Patient Name', width: 150 },
//     { key: 'Age', headerName: 'Age', width: 80 },
//     {
//       key: 'actions',
//       headerName: 'Options',
//       width: 100,
//       renderCell: ({ row }) => (
//         <Button className="cell_btn" onClick={() => handleSampleCapture(row)}>
//           <ForwardIcon />
//         </Button>
//       ),
//     },
//     {
//       key: 'view',
//       headerName: 'View',
//       width: 100,
//       renderCell: ({ row }) => (
//         <Button className="cell_btn" onClick={() => handleview(row.TestDetails)}>
//           <VisibilityIcon />
//         </Button>
//       ),
//     },
//     { key: 'Gender', headerName: 'Gender', width: 100 },
//     { key: 'Phone', headerName: 'Phone', width: 120 },
//     { key: 'Refering_Doctor', headerName: 'Reference Doctor', width: 130 },
//     {
//       key: 'status',
//       headerName: 'Status',
//       width: 100,
//       renderCell: ({ row }) => {
//         const serviceStatuses = row.Service_Statuses || [];
//         return (
//           <Tooltip
//             title={
//               <>
//                 <div>Capture Status: {serviceStatuses[0]?.Capture || 'N/A'}</div>
//                 <div>Analysis Status: {serviceStatuses[0]?.Analaysis || 'N/A'}</div>
//                 <div>Verified Status: {serviceStatuses[0]?.Verify || 'N/A'}</div>
//                 <div>Approve Status: {serviceStatuses[0]?.Approve || 'N/A'}</div>
//               </>
//             }
//             arrow
//           >
//             <span>{row.status}</span>
//           </Tooltip>
//         );
//       },
//     },
//   ];

//   const dynamicColumns1 = [
//     { key: 'id', headerName: 'S No', width: 100 },
//     { key: 'Test_Name', headerName: 'Test Name', width: 250 },
//     { key: 'Service_Status', headerName: 'Collection Status', width: 100 },
//     { key: 'Analysis_Status', headerName: 'Report Entry Status', width: 100 },
//     { key: 'Verify_Status', headerName: 'Verify Status', width: 100 },
//     { key: 'Approve_Status', headerName: 'Approve Status', width: 100 },
//   ];

//   return (
//     <div className="appointment">
//       <div className="h_head">
//         <h3>Dispatch Que List</h3>
//       </div>
//       {!patientId && (
//         <div className="con_1">
//           <div className="inp_1">
//             <label htmlFor="input">Patient Name:</label>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => handleSearchChange(e, 'name')}
//               placeholder="Enter the Patient Name"
//             />
//           </div>
//           <div className="inp_1">
//             <label htmlFor="input">UHID:</label>
//             <input
//               type="text"
//               value={searchQuery1}
//               onChange={(e) => handleSearchChange(e, 'phone')}
//               placeholder="Enter the UHID Number"
//             />
//           </div>
//           <div className="inp_1">
//             <label htmlFor="input">Barcode</label>
//             <input
//               id="input"
//               type="text"
//               value={searchQuery2}
//               onChange={(e) => handleSearchChange(e, 'barcode')}
//               placeholder="Enter Barcode Number"
//             />
//           </div>
//           <div className="inp_1">
//             <label htmlFor="input">OP/IP No</label>
//             <input
//               id="input"
//               type="text"
//               value={searchQuery3}
//               onChange={(e) => handleSearchChange(e, 'invoice')}
//               placeholder="Enter OP/IP Number"
//             />
//           </div>
//         </div>
//       )}
//       <div className="grid_1">
//         <ReactGrid
//           RowData={filteredRows.length > 0 ? filteredRows : summa}
//           columns={dynamicColumns}
//           hidePagination={true}
//           className="data_grid"
//         />
//         <div className="pagination-controls">
//           <button
//             onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
//             disabled={page === 0}
//             className="pagination-button"
//           >
//             <ArrowBackIosNewIcon />
//           </button>
//           Page {page + 1} of {totalPages}
//           <button
//             onClick={() => setPage((prevPage) => (prevPage + 1 < totalPages ? prevPage + 1 : prevPage))}
//             disabled={page + 1 >= totalPages}
//             className="pagination-button"
//           >
//             <ArrowForwardIosIcon />
//           </button>
//         </div>
//         {summa.length === 0 && filteredRows.length === 0 && (
//           <div className="IP_norecords">
//             <span>{patientId ? 'No dispatch records found for this patient' : 'No Records Found'}</span>
//           </div>
//         )}
//       </div>
//       <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ content: { ...yourStyles } }}>
//         <div className="pdf_img_show">
//           <iframe
//             title="PDF Viewer"
//             src={modalContent}
//             style={{
//               width: '100%',
//               height: '435px',
//               border: '1px solid rgba(0, 0, 0, 0.5)',
//             }}
//           />
//           <div className="jhuhhjh">
//             <Button style={{ color: 'white' }} className="clse_pdf_img" onClick={closeModal}>
//               <HighlightOffIcon
//                 style={{
//                   fontSize: '40px',
//                   backgroundColor: 'var(--ProjectColor)',
//                   borderRadius: '40px',
//                 }}
//               />
//             </Button>
//           </div>
//         </div>
//       </Modal>
//       {openModal && (
//         <div className={isSidebarOpen ? 'sideopen_showcamera_profile' : 'showcamera_profile'}>
//           <div className="newwProfiles newwPopupforreason">
//             <div className="grid_1">
//               <ThemeProvider theme={theme}>
//                 <ReactGrid RowData={testdetails} columns={dynamicColumns1} className="data_grid" />
//               </ThemeProvider>
//             </div>
//             <div className="Register_btn_con">
//               <button className="RegisterForm_1_btns" onClick={() => setOpenModal(false)}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
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

// export default DispatchList;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ForwardIcon from '@mui/icons-material/Forward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Tooltip from '@mui/material/Tooltip';
import Modal from 'react-modal';
import { GiProgression } from 'react-icons/gi';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: 'var(--ProjectColor)',
          textAlign: 'center',
          color: 'var(--header-text-color)',
        },
        root: {
          '& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer': {
            textAlign: 'center',
            display: 'flex !important',
            justifyContent: 'center !important',
          },
          '& .MuiDataGrid-window': {
            overflow: 'hidden !important',
          },
        },
        cell: {
          borderTop: '0px !important',
          borderBottom: '1px solid var(--ProjectColor) !important',
          display: 'flex',
          justifyContent: 'center',
        },
      },
    },
  },
});

const getColorName = (value, min, max) => {
  const percentage = ((value - min) / (max - min)) * 100;
  if (percentage <= 20) return 'Panic';
  if (percentage <= 40) return 'Abnormal - Y';
  if (percentage <= 60) return 'Normal';
  if (percentage <= 80) return 'Abnormal - O';
  return 'Panic';
};

const DispatchList = ({ patientId }) => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // Patient Name
  const [searchQuery1, setSearchQuery1] = useState(''); // UHID
  const [searchQuery2, setSearchQuery2] = useState(''); // Barcode
  const [searchQuery3, setSearchQuery3] = useState(''); // OP/IP No
  const [summa, setSumma] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [testdetails, setTestdetails] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [printpapaer, setPrintpapaer] = useState('RDL');
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [smartreport, setSmartreport] = useState([]);
  const [signperson, setSignperson] = useState('');
  const pageSize = 10;
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  dispatch({ type: 'printpapaer', value: printpapaer });

  const yourStyles = {
    position: 'absolute',
    inset: '100px',
    border: '1px solid rgb(204, 204, 204)',
    background: 'rgb(97 90 90 / 75%)',
    overflow: 'auto',
    borderRadius: '4px',
    outline: 'none',
    padding: '0px',
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent('');
  };

  useEffect(() => {
    console.log('patientId received:', patientId); // Debug log
    const offset = page * pageSize;
    const isSearchCleared = !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
    const departmentCodes = userRecord?.Lab_Department?.join(',') || '';

    if (isSearchCleared || patientId) {
      const params = {
        Location: userRecord?.location,
        limit: pageSize,
        offset: offset,
        Refering_Hospital: userRecord?.Refering_Hospital || 'All',
        Department: departmentCodes,
      };
      if (patientId) {
        params.Patient_Id = patientId; // Filter by Patient_Id
      }

      axios
        .get(`${urllink}Lab/get_patient_request_capture_data_for_dispatch`, { params })
        .then((response) => {
          console.log('Dispatch API Response:', response.data); // Debug log
          const totalRecords = response.data.total_records || 0;
          let data = response.data.patients_data.map((row, index) => ({
            id: index + 1 + offset,
            ...row,
            status: 'Status',
          }));
          if (patientId) {
            data = data.filter(row => row.Patient_Id === patientId);
          }
          data.sort((a, b) => {
            const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
            const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
            return invoiceB - invoiceA;
          });
          setFilteredRows([]);
          setSumma(data);
          setTotalPages(Math.ceil(totalRecords / pageSize));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setSumma([]);
          setTotalPages(0);
        });
    } else {
      fetchSearchData(offset);
    }
  }, [urllink, userRecord?.location, userRecord?.Lab_Department, userRecord?.Refering_Hospital, page, pageSize, searchQuery, searchQuery1, searchQuery2, searchQuery3, patientId]);

  const fetchSearchData = async (offset) => {
    try {
      const params = {
        name: searchQuery,
        uhid: searchQuery1,
        barcode: searchQuery2,
        invoice: searchQuery3,
        Refering_Hospital: userRecord?.Refering_Hospital,
        Location: userRecord?.location,
        limit: pageSize,
        offset: offset,
      };
      if (patientId) {
        params.Patient_Id = patientId;
      }

      const response = await axios.get(`${urllink}Lab/dispatchsearch`, { params });
      console.log('Search API Response:', response.data); // Debug log
      const totalRecords = response.data.total_records || 0;
      let data = response.data.patients_data.map((row, index) => ({
        id: index + 1 + offset,
        ...row,
        status: 'Status',
      }));
      if (patientId) {
        data = data.filter(row => row.Patient_Id === patientId);
      }
      data.sort((a, b) => {
        const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
        const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
        return invoiceB - invoiceA;
      });
      setSumma([]);
      setFilteredRows(data);
      setTotalPages(Math.ceil(totalRecords / pageSize));
    } catch (error) {
      console.error('Error fetching search data:', error);
      setFilteredRows([]);
      setTotalPages(0);
    }
  };

  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    if (key === 'name') setSearchQuery(value);
    if (key === 'phone') setSearchQuery1(value);
    if (key === 'barcode') setSearchQuery2(value);
    if (key === 'invoice') setSearchQuery3(value);
    setPage(0);
  };

  const handleSampleCapture = (row) => {
    console.log('handleSampleCapture row:', row);
    let billinvoicee = row.Billing_Invoice.startsWith('OP');

    if (billinvoicee) {
      axios
        .get(`${urllink}Lab/get_for_due_reports?Billing_Invoice=${row.Billing_Invoice}`)
        .then((response) => {
          const res = response.data;
          if (res.status === 'due') {
            alert(res.message);
            return;
          }
          continueSampleCapture(row);
        })
        .catch((error) => {
          console.error('Error fetching bill status:', error);
          setLoading(false);
        });
    } else {
      continueSampleCapture(row);
    }
  };

  const continueSampleCapture = (row) => {
    setLoading(true);
    if (printpapaer) {
      dispatch({ type: 'Capturesample', value: row });
      dispatch({ type: 'showPrint', value: false });
      if (patientId) {
        // Fetch and display report in modal for PatientProfile context
        axios
          .get(`${urllink}Lab/get_data_for_smart_report`, {
            params: {
              invoice: row.Billing_Invoice,
              Patient_Id: row.Patient_Id,
              Visitid: row.Visit_Id,
              print_type: printpapaer, // Include printpapaer (e.g., 'RDL')
            },
          })
          .then((response) => {
            setLoading(false);
            let data = response.data;
            if (response.error || !data || data.length === 0) {
              alert('No report data available');
              setModalIsOpen(false);
            } else {
              // Assuming data is a URL or PDF content for the report
              setModalContent(data.report_url || data); // Adjust based on actual response
              setModalIsOpen(true);
            }
          })
          .catch((error) => {
            console.error('Error fetching report data:', error);
            setLoading(false);
            alert('Failed to load report');
          });
      } else {
        // Standalone context: navigate to /Home/Retro
        setTimeout(() => {
          setLoading(false);
          dispatch({ type: 'setPreviousFolder', value: 'DispatchList' });
          dispatch({ type: 'HrFolder', value: 'Reports' });
          navigate('/Home/Retro');
        }, 1000);
      }
    }
  };

  const handlesmartreport = (row) => {
    axios
      .get(`${urllink}Lab/get_data_for_smart_report`, {
        params: {
          invoice: row.Billing_Invoice,
          Patient_Id: row.Patient_Id,
          Visitid: row.Visit_Id,
          print_type: printpapaer,
        },
      })
      .then((response) => {
        let data = response.data;
        if (response.error || !data || data.length === 0) {
          setOpenModal(false);
        } else {
          setSmartreport(data);
          setOpenModal(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlechoosep_paper = (e) => {
    const { value } = e.target;
    setPrintpapaer(value);
    dispatch({ type: 'printpapaer', value: value });
  };

  const handleview = (params) => {
    setTestdetails(params);
    setOpenModal((prev) => !prev);
  };

  const dynamicColumns = [
    { key: 'Patient_Id', headerName: 'Patient Id', width: 100 },
    { key: 'Barcode', headerName: 'Sample Id', width: 100 },
    { key: 'Billing_Invoice', headerName: 'Invoice', width: 100 },
    { key: 'Visit_Id', headerName: 'Visit Id', width: 70 },
    { key: 'UpdatedAt', headerName: 'Date', width: 100 },
    { key: 'Patient_Name', headerName: 'Patient Name', width: 150 },
    { key: 'Age', headerName: 'Age', width: 80 },
    {
      key: 'actions',
      headerName: 'Options',
      width: 100,
      renderCell: ({ row }) => (
        <Button className="cell_btn" onClick={() => handleSampleCapture(row)}>
          <ForwardIcon />
        </Button>
      ),
    },
    {
      key: 'view',
      headerName: 'View',
      width: 100,
      renderCell: ({ row }) => (
        <Button className="cell_btn" onClick={() => handleview(row.TestDetails)}>
          <VisibilityIcon />
        </Button>
      ),
    },
    { key: 'Gender', headerName: 'Gender', width: 100 },
    { key: 'Phone', headerName: 'Phone', width: 120 },
    { key: 'Refering_Doctor', headerName: 'Reference Doctor', width: 130 },
    {
      key: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: ({ row }) => {
        const serviceStatuses = row.Service_Statuses || [];
        return (
          <Tooltip
            title={
              <>
                <div>Capture Status: {serviceStatuses[0]?.Capture || 'N/A'}</div>
                <div>Analysis Status: {serviceStatuses[0]?.Analaysis || 'N/A'}</div>
                <div>Verified Status: {serviceStatuses[0]?.Verify || 'N/A'}</div>
                <div>Approve Status: {serviceStatuses[0]?.Approve || 'N/A'}</div>
              </>
            }
            arrow
          >
            <span>{row.status}</span>
          </Tooltip>
        );
      },
    },
  ];

  const dynamicColumns1 = [
    { key: 'id', headerName: 'S No', width: 100 },
    { key: 'Test_Name', headerName: 'Test Name', width: 250 },
    { key: 'Service_Status', headerName: 'Collection Status', width: 100 },
    { key: 'Analysis_Status', headerName: 'Report Entry Status', width: 100 },
    { key: 'Verify_Status', headerName: 'Verify Status', width: 100 },
    { key: 'Approve_Status', headerName: 'Approve Status', width: 100 },
  ];

  return (
    <div className="appointment">
      <div className="h_head">
        <h3>Dispatch Que List</h3>
      </div>
      {!patientId && (
        <div className="con_1">
          <div className="inp_1">
            <label htmlFor="input">Patient Name:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e, 'name')}
              placeholder="Enter the Patient Name"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">UHID:</label>
            <input
              type="text"
              value={searchQuery1}
              onChange={(e) => handleSearchChange(e, 'phone')}
              placeholder="Enter the UHID Number"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">Barcode</label>
            <input
              id="input"
              type="text"
              value={searchQuery2}
              onChange={(e) => handleSearchChange(e, 'barcode')}
              placeholder="Enter Barcode Number"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">OP/IP No</label>
            <input
              id="input"
              type="text"
              value={searchQuery3}
              onChange={(e) => handleSearchChange(e, 'invoice')}
              placeholder="Enter OP/IP Number"
            />
          </div>
        </div>
      )}
      <div className="grid_1">
        <ReactGrid
          RowData={filteredRows.length > 0 ? filteredRows : summa}
          columns={dynamicColumns}
          hidePagination={true}
          className="data_grid"
        />
        <div className="pagination-controls">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
            disabled={page === 0}
            className="pagination-button"
          >
            <ArrowBackIosNewIcon />
          </button>
          Page {page + 1} of {totalPages}
          <button
            onClick={() => setPage((prevPage) => (prevPage + 1 < totalPages ? prevPage + 1 : prevPage))}
            disabled={page + 1 >= totalPages}
            className="pagination-button"
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
        {summa.length === 0 && filteredRows.length === 0 && (
          <div className="IP_norecords">
            <span>{patientId ? 'No dispatch records found for this patient' : 'No Records Found'}</span>
          </div>
        )}
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ content: { ...yourStyles } }}>
        <div className="pdf_img_show">
          <iframe
            title="PDF Viewer"
            src={modalContent}
            style={{
              width: '100%',
              height: '435px',
              border: '1px solid rgba(0, 0, 0, 0.5)',
            }}
          />
          <div className="jhuhhjh">
            <Button style={{ color: 'white' }} className="clse_pdf_img" onClick={closeModal}>
              <HighlightOffIcon
                style={{
                  fontSize: '40px',
                  backgroundColor: 'var(--ProjectColor)',
                  borderRadius: '40px',
                }}
              />
            </Button>
          </div>
        </div>
      </Modal>
      {openModal && (
        <div className={isSidebarOpen ? 'sideopen_showcamera_profile' : 'showcamera_profile'}>
          <div className="newwProfiles newwPopupforreason">
            <div className="grid_1">
              <ThemeProvider theme={theme}>
                <ReactGrid RowData={testdetails} columns={dynamicColumns1} className="data_grid" />
              </ThemeProvider>
            </div>
            <div className="Register_btn_con">
              <button className="RegisterForm_1_btns" onClick={() => setOpenModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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

export default DispatchList;