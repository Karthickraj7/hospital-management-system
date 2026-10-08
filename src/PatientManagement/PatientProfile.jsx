import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Patient.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid'
import ForwardIcon from "@mui/icons-material/Forward";
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import ReactPaginate from 'react-paginate';
import DispatchList from './LabDispatchList';
const ITEMS_PER_PAGE = 10;

// Custom hook for fetching data with retry logic
const useFetchPatientData = (url, params, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  

  const fetchWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, { params });
        return response.data;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    if (!url || !Object.values(params).every(Boolean)) return;
    setLoading(true);
    fetchWithRetry()
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((err) => {
        console.error(`Error fetching from ${url}:`, err);
        setError(`Failed to fetch data: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [...dependencies, url, ...Object.values(params)]);

  return { data, loading, error };
};

// Reusable DataTable component
const DataTable = ({ columns, data, loading, error, onRowAction }) => (
  <TableContainer className="data-table">
    <Table aria-label="data table">
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.key} className="data-table-header">
              {col.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="data-table-data">
              Loading...
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="data-table-data">
              Error: {error}
            </TableCell>
          </TableRow>
        ) : data.length > 0 ? (
          data.map((row, index) => (
            <TableRow key={index} className="data-table-row">
              {columns.map((col) => (
                <TableCell key={col.key} className="data-table-data">
                  {col.render ? col.render(row) : row[col.key] || 'N/A'}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="data-table-data">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const PatientProfile = () => {
  const [selectedMenu, setSelectedMenu] = useState('home');
  const [patientDetails, setPatientDetails] = useState(null);
  const [familyMembersData, setFamilyMembersData] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [registrationDetails, setRegistrationDetails] = useState([]);
  const [showViewContent, setShowViewContent] = useState(false);
  const [viewData, setViewData] = useState({});
  const [vitalData, setVitalData] = useState(null);
  const [progressNotesData, setProgressNotesData] = useState(null);
  const [billingData, setBillingData] = useState([]);
  const [labReportData, setLabReportData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [ledgerDetails, setLedgerDetails] = useState([]);
  const [radiologyData, setRadiologyData] = useState([]);
  const [therapyOrders, setTherapyOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [ancData, setAncData] = useState([]);
  const [ifCardData, setIfCardData] = useState([]);
  const [page, setPage] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false); // Added for loading state
  const [summa, setSumma] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const PatientListId = useSelector((state) => state.Frontoffice?.PatientListId);
  // const PatientVisitId = useSelector((state) => state.Frontoffice?.Visit_Id);
  const RegistrationID = useSelector((state) => state.Frontoffice?.registrationId);
  const employeeId = useSelector((state) => state.userRecord?.employeeId || 'default_employee_id');
  const DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.DoctorWorkbenchNavigation || {});
  const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation || {});
  const workbenchformData = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation || {});
  console.log(PatientListId,'patient-list-id');
  // console.log(PatientVisitId,'patient-visit-id');
  
  // Menu handlers
  const handleHomeView = () => setSelectedMenu('home');
  const handleAppointments = () => setSelectedMenu('appointments');
  const handleOP = () => setSelectedMenu('OP');
  const handleIP = () => setSelectedMenu('IP');
  const handleLAB = () => {
    setSelectedMenu('LAB');
    // <DispatchList />
  };
  const handleRadiology = () => setSelectedMenu('Radiology');
  const handleInvoice = () => setSelectedMenu('patientLedger');
  const handleBilling = () => setSelectedMenu('Billing');
  const handleTheropyRecords = () => setSelectedMenu('therapyRecords');
  const handleForms = () => setSelectedMenu('FormsIVFANS');

  // Redirect if no PatientListId
  useEffect(() => {
    if (!PatientListId?.PatientId) {
      navigate('/Home/PatientList');
    }
  }, [PatientListId, navigate]);

  // Reset page on menu change
  useEffect(() => {
    setPage(1);
  }, [selectedMenu]);

  // Fetch patient data and family members
  const { data: patientData, loading: patientLoading, error: patientError } = useFetchPatientData(
    `${UrlLink}Frontoffice/Patient_Master_List`,
    { PatientId: PatientListId?.PatientId },
    [UrlLink, PatientListId?.PatientId]
  );

  useEffect(() => {
    if (patientData) {
      setPatientDetails({
        PatientId: patientData.PatientId || '',
        PhoneNo: patientData.PhoneNo || '',
        FirstName: patientData.FirstName || '',
        Gender: patientData.Gender || '',
        DOB: patientData.DOB || '',
        Age: patientData.Age || '',
        Street: patientData.Street || '',
        City: patientData.City || '',
        State: patientData.State || '',
        Country: patientData.Country || '',
      });
      setProfilePhoto(patientData.Photo || null);
    }
  }, [patientData]);

  const { data: familyData, error: familyError } = useFetchPatientData(
    `${UrlLink}Frontoffice/get_family_members/${PatientListId?.PatientId}/`,
    {},
    [UrlLink, PatientListId?.PatientId]
  );

  useEffect(() => {
    setFamilyMembersData(Array.isArray(familyData) ? familyData : []);
  }, [familyData]);

  // Fetch OP registration data
  const { data: registrationData, loading: registrationLoading, error: registrationError } = useFetchPatientData(
    `${UrlLink}Frontoffice/patient_registration_count`,
    { PatientId: PatientListId?.PatientId },
    [UrlLink, PatientListId?.PatientId]
  );

  useEffect(() => {
    if (registrationData) {
      setRegistrationCount(registrationData.TotalRegistrations || 0);
      setRegistrationDetails(Array.isArray(registrationData.RegistrationDetails) ? registrationData.RegistrationDetails : []);
    }
  }, [registrationData]);

  // Fetch view data for OP details
  const fetchViewData = useCallback(async (registration) => {
    const { Registration_Id, VisitId, AppointmentId, pk } = registration;
    const PatientId = PatientListId?.PatientId;

    if (!Registration_Id || !VisitId || !PatientId) {
      console.error('Missing registration details:', { Registration_Id, VisitId, PatientId });
      alert('Error: Missing registration details.');
      return;
    }

    try {
      const params = { RegistrationId: Registration_Id, VisitId, PatientId };
      const endpointMap = {
        refer: `${UrlLink}Workbench/Refer_DoctorOpd_Details_CaseSheet`,
        generalEval: `${UrlLink}Workbench/Workbench_GeneralEvaluation_Details_CaseSheet`,
        prescription: `${UrlLink}Workbench/Workbench_Prescription_Details_CaseSheet`,
        vitals: `${UrlLink}Workbench/Workbench_Vitals_Details_CaseSheet`,
        lab: `${UrlLink}Workbench/Workbench_Lab_Details_CaseSheet`,
        radiology: `${UrlLink}Workbench/Workbench_Radiology_Details_CaseSheet`,
        advice: `${UrlLink}Workbench/Worbench_Advice_Details_CaseSheet`,
        review: `${UrlLink}Workbench/Worbench_Review_Details_CaseSheet`,
      };

      const fetchPromises = Object.entries(endpointMap).map(async ([key, url]) => {
        try {
          const response = await axios.get(url, { params });
          return response.data && Array.isArray(response.data) && response.data.length > 0
            ? { key, data: response.data }
            : null;
        } catch (err) {
          console.error(`Error fetching ${key}:`, err);
          return null;
        }
      });

      const results = (await Promise.all(fetchPromises)).filter(Boolean);
      const newViewData = {
        patient: {
          ...registration,
          PatientId,
          FirstName: patientDetails?.FirstName,
          Age: patientDetails?.Age,
          Gender: patientDetails?.Gender,
        },
        ...Object.fromEntries(results.map(({ key, data }) => [key, data])),
      };
      setViewData(newViewData);
      setShowViewContent(true);
      console.log('fetchViewData success, viewData:', newViewData); // Debug log
    } catch (err) {
      console.error('Failed to fetch detailed view data:', err);
      alert('Failed to fetch patient data. Please try again.');
    }
  }, [UrlLink, PatientListId?.PatientId, patientDetails]);

  // Handle print functionality
  const handlePrint = useCallback((registration) => {
    console.log('handlePrint called with registration:', registration); // Debug log
    setIsPrinting(true);
    fetchViewData(registration)
      .then(() => {
        // Delay to ensure DOM is updated
        setTimeout(() => {
          const printContent = document.querySelector('.neww-profiles');
          console.log('printContent found:', !!printContent); // Debug log
          if (printContent) {
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
              console.error('Failed to open print window. Check pop-up blocker.');
              alert('Failed to open print window. Please allow pop-ups and try again.');
              setIsPrinting(false);
              return;
            }
            printWindow.document.write(`
              <html>
                <head>
                  <title>Print Patient Visit Details</title>
                  <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .print-header { text-align: center; margin-bottom: 20px; }
                    .patient-visit-header, .case-sheet-header { text-align: center; }
                    .patient-details-text { margin: 10px 0; }
                    .divider-line { border-top: 1px solid #ccc; margin: 20px 0; }
                    .dshcyts-8i-section { margin-bottom: 20px; }
                    .vitals-header, .prescription-header, .lab-header, .radiology-header, .advice-header, .review-header {
                      font-size: 1.2em; margin-bottom: 10px;
                    }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f0f0f0; }
                    .no-visit-data { text-align: center; color: #888; }
                    @media print {
                      body { margin: 0; }
                      .close-popup-btn { display: none; }
                    }
                  </style>
                </head>
                <body>
                  ${printContent.innerHTML}
                </body>
              </html>
            `);
            printWindow.document.close();
            console.log('Print window created, triggering print...'); // Debug log
            printWindow.print();
            printWindow.onafterprint = () => printWindow.close();
            setIsPrinting(false);
          } else {
            console.error('Print content (.neww-profiles) not found in DOM.');
            alert('Error: Print content not found. Please ensure the patient details are loaded and try again.');
            setIsPrinting(false);
          }
        }, 500); // 500ms delay for DOM update
      })
      .catch((err) => {
        console.error('Error in fetchViewData:', err);
        alert('Failed to fetch patient data for printing. Please try again.');
        setIsPrinting(false);
      });
  }, [fetchViewData]);

  // Fetch IP data
  useEffect(() => {
    if (!PatientListId?.PatientId || !UrlLink) return;

    const fetchIPData = async () => {
      try {
        const [vitalsRes, progressRes] = await Promise.all([
          axios.get(`${UrlLink}Ip_Workbench/get_ip_vitals_by_patient`, {
            params: { PatientId: PatientListId.PatientId, DepartmentType: 'IP' },
          }),
          axios.get(`${UrlLink}Ip_Workbench/IP_ProgressNotes_Details_Link`, {
            params: { PatientId: PatientListId.PatientId, DepartmentType: 'IP' },
          }).catch(() => ({ data: [] })),
        ]);

        const newVitalData = vitalsRes.data?.vital_details?.reduce((acc, entry) => {
          const dateKey = entry.Date;
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(entry);
          return acc;
        }, {}) || {};

        const newProgressData = progressRes.data?.reduce((acc, entry) => {
          const dateKey = entry.Date;
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(entry);
          return acc;
        }, {}) || {};

        setVitalData(newVitalData);
        setProgressNotesData(newProgressData);
      } catch (err) {
        console.error('Error fetching IP data:', err);
        setVitalData({});
        setProgressNotesData({});
      }
    };

    fetchIPData();
  }, [UrlLink, PatientListId?.PatientId]);

  const sortedDates = Object.keys({ ...vitalData, ...progressNotesData }).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('-').map(Number);
    const [dayB, monthB, yearB] = b.split('-').map(Number);
    const dateA = new Date(`20${yearA}`, monthA - 1, dayA);
    const dateB = new Date(`20${yearB}`, monthB - 1, dayB);
    return dateB - dateA;
  });

  const vitalList = [
    'Temperature', 'PulseRate', 'SPO2', 'HeartRate', 'RespiratoryRate',
    'SBP', 'DBP', 'Height', 'Weight', 'BMI',
  ];

  // Fetch radiology data
  const { data: radiologyDataRes, loading: radiologyLoading, error: radiologyError } = useFetchPatientData(
    `${UrlLink}OP/Radiology_Request_Detailslink`,
    { Register_Id: IP_DoctorWorkbenchNavigation.RegistrationId, RegisterType: 'IP', Employeeid: employeeId },
    [UrlLink, IP_DoctorWorkbenchNavigation.RegistrationId, employeeId]
  );

  useEffect(() => {
    setRadiologyData(Array.isArray(radiologyDataRes?.IsSubTestNo) ? radiologyDataRes.IsSubTestNo : []);
  }, [radiologyDataRes]);

  // Fetch therapy orders
  const { data: therapyData, loading: therapyLoading, error: therapyError } = useFetchPatientData(
    `${UrlLink}Ip_Workbench/Insert_Ip_Procedure_Order`,
    { Patientid: workbenchformData.PatientId, Visitid: workbenchformData.VisitId },
    [UrlLink, workbenchformData.PatientId, workbenchformData.VisitId]
  );

  useEffect(() => {
    setTherapyOrders(Array.isArray(therapyData) ? therapyData : []);
  }, [therapyData]);

  // Fetch ANC/IF data
  const { data: ancIfData, loading: ancIfLoading, error: ancIfError } = useFetchPatientData(
    `${UrlLink}Workbench/Workbench_ANC_Card_Details`,
    { RegistrationId: DoctorWorkbenchNavigation?.pk },
    [UrlLink, DoctorWorkbenchNavigation?.pk]
  );

  const { data: ifCardDataRes, loading: ifCardLoading, error: ifCardError } = useFetchPatientData(
    `${UrlLink}Workbench/Workbench_IFCard_Details`,
    { RegistrationId: DoctorWorkbenchNavigation?.pk },
    [UrlLink, DoctorWorkbenchNavigation?.pk]
  );

  useEffect(() => {
    setAncData(Array.isArray(ancIfData) ? ancIfData : []);
    setIfCardData(Array.isArray(ifCardDataRes) ? ifCardDataRes : []);
  }, [ancIfData, ifCardDataRes]);

  // Fetch appointments
  const { data: appointmentsData, loading: appointmentsLoading, error: appointmentsError } = useFetchPatientData(
    `${UrlLink}Frontoffice/OpREgeg_appointment_Detiles`,
    { PatientId: PatientListId?.PatientId },
    [UrlLink, PatientListId?.PatientId]
  );

  useEffect(() => {
    setAppointments(Array.isArray(appointmentsData?.appointments) ? appointmentsData.appointments : []);
  }, [appointmentsData]);

  // Fetch billing data
  const { data: billingDataRes, loading: billingLoading, error: billingError } = useFetchPatientData(
    `${UrlLink}Masters/labreports`,
    { PatientId: PatientListId?.PatientId,selectedMenu: 'BillingHistory' },
    [UrlLink, PatientListId?.PatientId, selectedMenu]
  );

  useEffect(() => {
    if (selectedMenu === 'Billing') {
      setBillingData(Array.isArray(billingDataRes) ? billingDataRes : []);
    }
  }, [billingDataRes, selectedMenu]);

  // Fetch lab reports
  const { data: labReportDataRes, loading: labReportLoading, error: labReportError } = useFetchPatientData(
    `${UrlLink}Masters/labreports`,
    { PatientId: PatientListId?.PatientId, selectedMenu: 'TestReport' },
    [UrlLink, PatientListId?.PatientId, selectedMenu]
  );

  useEffect(() => {
    if (selectedMenu === 'LAB') {
      setLabReportData(Array.isArray(labReportDataRes) ? labReportDataRes : []);
    }
  }, [labReportDataRes, selectedMenu]);

  // Fetch ledger data
  const { data: ledgerData, loading: ledgerLoading, error: ledgerError } = useFetchPatientData(
    PatientListId?.PatientId
      ? `${UrlLink}Frontoffice/Patient_Overall_Ledger_Details`
      : `${UrlLink}Frontoffice/Registration_Overall_Ledger_Details`,
    PatientListId?.PatientId
      ? { PatientId: PatientListId.PatientId }
      : { RegistrationId: registrationDetails[0]?.Registration_Id },
    [UrlLink, PatientListId?.PatientId, registrationDetails]
  );

  useEffect(() => {
    setLedgerDetails(Array.isArray(ledgerData) ? ledgerData : []);
  }, [ledgerData]);

  useEffect(() => {
    console.log("PatientListId:", PatientListId);
    console.log("UrlLink:", UrlLink);
 
    // Clear previous data to avoid accumulation
    setSumma([]);
    setLoading(true);
 
    const fetchRadiologyData = async () => {
      let allData = [];
 
      try {
        // Fetch OP radiology data
        console.log("Fetching OP radiology data...");
        const opResponse = await axios.get(
          `${UrlLink}Radiology/Get_for_Patient_master?PatientId=${
            PatientListId?.PatientId || ""
          }&Type=OP`
        );
        console.log("OP Radiology Response:", opResponse.data);
        if (Array.isArray(opResponse.data)) {
          allData = [...allData, ...opResponse.data];
        }
 
        // Fetch IP radiology data
        console.log("Fetching IP radiology data...");
        const ipResponse = await axios.get(
          `${UrlLink}Radiology/Get_for_Patient_master?PatientId=${
            PatientListId?.PatientId || ""
          }&Type=IP`
        );
        console.log("IP Radiology Response:", ipResponse.data);
        if (Array.isArray(ipResponse.data)) {
          allData = [...allData, ...ipResponse.data];
        }
 
        setSumma(allData);
        setError(null);
      } catch (err) {
        console.error("Error fetching radiology data:", err);
        setError("Failed to fetch radiology data");
        setSumma([]);
      } finally {
        setLoading(false);
      }
    };
 
    fetchRadiologyData();
  }, [UrlLink, PatientListId?.PatientId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Pagination handler
  const handlePageChange = ({ selected }) => setPage(selected + 1);
  const paginatedData = (data) => data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSetPrint = (row) => {
    dispatchvalue({ type: "Capturesample", value: row });
    setTimeout(() => {
      navigate("/Home/Retro");
    }, 1000);
  };

  const dynamicColumns = [
    { key: "FirstName", name: "Name", width: 100 },
    { key: "Age", name: "Age", width: 100 },
    { key: "Phone", name: "PhoneNO", width: 100 },
    { key: "TestName", name: "Test", width: 100 },
    { key: "BillingStatus", name: "Billing Status", width: 100 },
    { key: "RegisterType", name: "RegisterType", width: 100 },
    { key: "DoctorName", name: "Doctor", width: 100 },
    {
      key: "actions",
      name: "Report",
      width: 100,
      renderCell: ({ row }) => (
        <Button className="cell_btn" onClick={() => handleSetPrint(row)}>
          <ForwardIcon />
        </Button>
      ),
    },
  ];



  /* Component Views */
  const HomeView = () => (
    <div className="patient-profile-wrapper">
      <div className="patient-profile-containerr">
        <div className="mugesh_profile_pationtss">
          <div className="mugesh_profile_pationts_con">
            <div className="profile-layout">
              <div className="mugesh_profile_photo">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Patient Profile" className="profile-photo" />
                ) : (
                  <div className="no-photo">No Photo</div>
                )}
              </div>
              <div className="patient-details">
                <div className="patient-details-grid">
                  <p><span className="label">Patient ID:</span> <strong>{patientDetails?.PatientId || 'N/A'}</strong></p>
                  <p><span className="label">Name:</span> <strong>{patientDetails?.FirstName || 'N/A'}</strong></p>
                  <p><span className="label">Phone:</span> <strong>{patientDetails?.PhoneNo || 'N/A'}</strong></p>
                  <p><span className="label">Gender:</span> <strong>{patientDetails?.Gender || 'N/A'}</strong></p>
                  <p><span className="label">DOB:</span> <strong>{patientDetails?.DOB || 'N/A'}</strong></p>
                  <p><span className="label">Age:</span> <strong>{patientDetails?.Age || 'N/A'}</strong></p>
                  <p className="address-field">
                    <span className="label">Address:</span>{' '}
                    <strong>
                      {patientDetails?.Street || patientDetails?.City || patientDetails?.State || patientDetails?.Country
                        ? `${patientDetails.Street || ''}, ${patientDetails.City || ''}, ${patientDetails.State || ''}, ${patientDetails.Country || ''}`
                        : 'N/A'}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="family-members-containerr">
          <div className="family-members-titlee">Family Members</div>
          {familyMembersData.length > 0 ? (
            <div className="family-members-list">
              {familyMembersData.map((member) => (
                <div key={member.id} className="family-member-card">
                  <p><span className="label">Name:</span> <strong>{member.name || 'N/A'}</strong></p>
                  <p><span className="label">Mobile:</span> <strong>{member.mobileNumber || 'N/A'}</strong></p>
                  <p><span className="label">Status:</span> <strong>{member.status || 'N/A'}</strong></p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-family-members">No family members found.</p>
          )}
        </div>
      </div>
    </div>
  );

  const AppointmentsView = () => (
    <div className="appointments-wrapper">
      <h2 className="appointments-title">Appointments</h2>
      {appointmentsLoading ? (
        <div className="appointments-loading">Loading...</div>
      ) : appointmentsError ? (
        <div className="appointments-error">Error: {appointmentsError}</div>
      ) : appointments.length > 0 ? (
        <div className="appointments-grid">
          {paginatedData(appointments).map((appt, idx) => (
            <div key={idx} className="appointment-cardd">
              <div className="appointment-header">
                <span>Appointment #{(page - 1) * ITEMS_PER_PAGE + idx + 1}</span>
              </div>
              <div className="appointment-content">
                <p><strong>Date:</strong> {appt.RequestDate || 'N/A'}</p>
                <p><strong>Time:</strong> {appt.RequestTime || 'N/A'}</p>
                <p><strong>Doctor:</strong> {appt.DoctorName || 'N/A'}</p>
                <p><strong>Purpose:</strong> {appt.VisitPurpose || 'N/A'}</p>
                <p><strong>Specialization:</strong> {appt.SpecializationName || 'N/A'}</p>
              </div>
            </div>
          ))}
          <ReactPaginate
            pageCount={Math.ceil(appointments.length / ITEMS_PER_PAGE)}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
      ) : (
        <p className="no-appointments">No appointments found</p>
      )}
    </div>
  );

  const OPView = () => {
    const columns = [
      { key: 'Registration_Id', label: 'Registration ID' },
      { key: 'VisitId', label: 'Visit ID' },
      { key: 'AppointmentId', label: 'Appointment ID' },
      { key: 'Status', label: 'Status' },
      { key: 'VisitPurpose', label: 'Visit Purpose' },
      { key: 'created_at', label: 'Created At', render: (row) => new Date(row.created_at).toLocaleString() },
      {
        key: 'action',
        label: 'Action',
        render: (row) => (
          <Button
            onClick={() => fetchViewData(row)}
            aria-label={`View details for registration ${row.Registration_Id}`}
          >
            <VisibilityIcon />
          </Button>
        ),
      },
      {
        key: 'print',
        label: 'Print',
        render: (row) => (
          <Button
            onClick={() => handlePrint(row)}
            aria-label={`Print details for registration ${row.Registration_Id}`}
            disabled={isPrinting}
          >
            <PrintIcon />
          </Button>
        ),
      },
    ];

    return (
      <div className="op-view-container">
        <h2 className="op-view-header">OP Registrations</h2>
        <DataTable
          columns={columns}
          data={paginatedData(registrationDetails)}
          loading={registrationLoading}
          error={registrationError}
        />
        <ReactPaginate
          pageCount={Math.ceil(registrationDetails.length / ITEMS_PER_PAGE)}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
        />
        {showViewContent && (
          <div className="sideopen-showcamera-profile" onClick={() => setShowViewContent(false)}>
            <div className="neww-profiles neww-popup-for-reason" onClick={(e) => e.stopPropagation()}>
              <Button
                className="close-popup-btn"
                onClick={() => setShowViewContent(false)}
                aria-label="Close popup"
              >
                Close
              </Button>
              <div className="wdqwtyxghs0-content">
                <h2 className="patient-visit-header">Patient Visit Details</h2>
                <h2 className="case-sheet-header">Case Sheet</h2>
                <p className="patient-details-text">
                  <span className="patient-name">{viewData.patient?.FirstName || 'N/A'}</span> (PatientId: <span className="patient-id">{viewData.patient?.PatientId || 'N/A'}</span>) Age: <span className="patient-age">{viewData.patient?.Age || 'N/A'}</span>, Gender: <span className="patient-gender">{viewData.patient?.Gender || 'N/A'}</span>
                  {viewData.generalEval?.length > 0 && (
                    <>
                      , was presented with <span className="patient-complaint">{viewData.generalEval[0]?.KeyComplaint || 'N/A'}</span> with the following history of <span className="patient-history">{viewData.generalEval[0]?.History || 'N/A'}</span> Upon examination <span className="patient-history">{viewData.generalEval[0]?.Examine || 'N/A'}</span> and diagnosed with <span className="patient-history">{viewData.generalEval[0]?.Diagnosis || 'N/A'}</span>
                    </>
                  )}
                </p>
                <div className="divider-line"></div>
                {viewData.vitals?.length > 0 && (
                  <div className="dshcyts-8i-section">
                    <h3 className="vitals-header">Vitals</h3>
                    <DataTable
                      columns={[
                        { key: 'Temperature', label: 'Temperature' },
                        { key: 'SBP', label: 'SBP' },
                        { key: 'DBP', label: 'DBP' },
                        { key: 'PulseRate', label: 'Pulse Rate' },
                        { key: 'Height', label: 'Height' },
                        { key: 'Weight', label: 'Weight' },
                        { key: 'BMI', label: 'BMI' },
                        { key: 'SPO2', label: 'SPO2' },
                        { key: 'Date', label: 'Date' },
                        { key: 'Time', label: 'Time' },
                      ]}
                      data={viewData.vitals}
                    />
                  </div>
                )}
                {viewData.prescription?.length > 0 && (
                  <div className="dshcyts-8i-section">
                    <h3 className="prescription-header">Prescription</h3>
                    <DataTable
                      columns={[
                        { key: 'ItemName', label: 'Item Name' },
                        { key: 'ItemType', label: 'Item Type' },
                        { key: 'Dosage', label: 'Dosage' },
                        { key: 'Route', label: 'Route' },
                        { key: 'FrequencyType', label: 'Frequency Type' },
                        { key: 'Frequency', label: 'Frequency', render: (row) => row.Frequency || row.Frequencys || 'N/A' },
                        { key: 'Duration', label: 'Duration', render: (row) => `${row.DurationNumber || ''} ${row.DurationUnit || ''}` },
                        { key: 'Qty', label: 'Qty' },
                        { key: 'Instruction', label: 'Instruction' },
                      ]}
                      data={viewData.prescription}
                    />
                  </div>
                )}
                {viewData.lab?.length > 0 && (
                  <div className="dshcyts-8i-section">
                    <h3 className="lab-header">Lab Tests</h3>
                    <DataTable
                      columns={[{ key: 'TestName', label: 'Test Name' }]}
                      data={viewData.lab}
                    />
                  </div>
                )}
                {viewData.radiology?.length > 0 && (
                  <div className="dshcyts-8i-section">
                    <h3 className="radiology-header">Radiology</h3>
                    <DataTable
                      columns={[
                        { key: 'RadiologyName', label: 'Radiology Department' },
                        { key: 'TestName', label: 'Test Name' },
                      ]}
                      data={viewData.radiology}
                    />
                  </div>
                )}
                {viewData.advice?.length > 0 && (
                  <div className="dshcyts-8i-section">
                    <h3 className="advice-header">Advice</h3>
                    <DataTable
                      columns={[{ key: 'Advice', label: 'Advice', render: (row) => row.Advice || 'No advice available' }]}
                      data={viewData.advice}
                    />
                  </div>
                )}
                {viewData.review?.length > 0 && (
                  <div className="dshcyts-8i-section">
                    <h3 className="review-header">Review</h3>
                    <DataTable
                      columns={[
                        {
                          key: 'Review',
                          label: 'Review',
                          render: (row) => row.NoOfDays ? `Next Review Date: ${row.Date} (${row.NoOfDays} Day(s))` : 'No review details available',
                        },
                      ]}
                      data={viewData.review}
                    />
                  </div>
                )}
                {![
                  viewData.vitals?.length,
                  viewData.prescription?.length,
                  viewData.lab?.length,
                  viewData.radiology?.length,
                  viewData.advice?.length,
                  viewData.review?.length,
                ].some((len) => len > 0) && (
                  <p className="no-visit-data">No detailed visit data available for this registration.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const IPView = () => (
    <div className="ip-view-container">
      {sortedDates.length > 0 ? (
        sortedDates.map((date, index) => (
          <div key={index} className="ip-date-section">
            <h2 className="ip-date-header">{date}</h2>
            {vitalData[date]?.length > 0 && (
              <div className="ip-selected-table-container">
                <h3 className="ip-vitals-header">Vitals</h3>
                <DataTable
                  columns={[
                    { key: 'Time', label: 'Time (Type)', render: (row) => `${row.Time} (${row.Type})` },
                    ...vitalList.map((vital) => ({ key: vital, label: vital })),
                  ]}
                  data={vitalData[date]}
                />
              </div>
            )}
            {progressNotesData[date]?.length > 0 && (
              <div className="ip-progress-notes">
                <h3 className="ip-progress-notes-header">Progress Notes</h3>
                <ul className="ip-notes-list">
                  {progressNotesData[date].map((note, i) => (
                    <li key={i} className="ip-notes-item">
                      <strong className="ip-notes-label">Time:</strong> <span className="ip-notes-value">{note.Time} ({note.Type})</span><br />
                      <strong className="ip-notes-label">Progress Notes:</strong> <span className="ip-notes-value">{note.ProgressNotes || 'N/A'}</span><br />
                      <strong className="ip-notes-label">Treatment Notes:</strong> <span className="ip-notes-value">{note.TreatmentNotes || 'N/A'}</span><br />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="ip-no-data">No IP data available for this patient</p>
      )}
    </div>
  );

  const LABView = () => {
    const columns = [
      { key: 'index', label: 'S.No', render: (_, index) => (page - 1) * ITEMS_PER_PAGE + index + 1 },
      { key: 'Billing_Invoice_No', label: 'Billing Invoice No' },
      { key: 'RegisterType', label: 'Register Type' },
      {
        key: 'Report',
        label: 'Report',
        render: (row) => (
          row.Status === 'Completed' ? (
            <Button
              onClick={() => setSelectedReport(row.Report)}
              aria-label={`View report for invoice ${row.Billing_Invoice_No}`}
            >
              <VisibilityIcon />
            </Button>
          ) : (
            <span>Not Ready</span>
          )
        ),
      },
    ];

    return (
      <div className="lab-test-reports">
        <DataTable
          columns={columns}
          data={paginatedData(labReportData)}
          loading={labReportLoading}
          error={labReportError}
        />
        <ReactPaginate
          pageCount={Math.ceil(labReportData.length / ITEMS_PER_PAGE)}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
        />
        {selectedReport && (
          <div className="overlay1" onClick={() => setSelectedReport(null)}>
            <div className="openModal1" onClick={(e) => e.stopPropagation()}>
              <Button
                onClick={() => setSelectedReport(null)}
                aria-label="Close lab report"
              >
                Close
              </Button>
              <iframe
                src={selectedReport}
                title="Lab Report"
                style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const RadiologyView = () => {
    return (
      <div className="radiology-container">
        <h2>Radiology</h2>
        {loading ? (
          <div>Loading...</div>
        ) : summa.length > 0 ? (
          <ReactGrid columns={dynamicColumns} RowData={summa} />
        ) : (
          <p>No radiology data available.</p>
        )}
      </div>
    );
  };

  const PatientLedgerView = () => {
    const columns = [
      { key: 'Date', label: 'Date' },
      { key: 'RegistrationId', label: 'Registration ID' },
      { key: 'Service_Type', label: 'Description' },
      {
        key: 'Debit',
        label: 'Debit(₹)',
        render: (row) => (row.Debit?.includes('Dr') ? parseFloat(row.Debit)?.toFixed(2) || 0 : 0),
      },
      {
        key: 'Credit',
        label: 'Credit(₹)',
        render: (row) => (row.Credit?.includes('Cr') ? parseFloat(row.Credit)?.toFixed(2) || 0 : 0),
      },
      {
        key: 'Balance',
        label: 'Balance(₹)',
        render: (row) => (row.Balance?.includes('Dr') ? parseFloat(row.Balance)?.toFixed(2) || 0 : 0),
      },
    ];

    return (
      <div>
        <div className="common_center_tag">
          <span>PatientID: {patientDetails?.PatientId}</span>
          <span>Patient Name: {patientDetails?.FirstName}</span>
        </div>
        <div className="doctor_schedule_table_wrapper_sri_2">
          <DataTable
            columns={columns}
            data={paginatedData(ledgerDetails)}
            loading={ledgerLoading}
            error={ledgerError}
          />
          <ReactPaginate
            pageCount={Math.ceil(ledgerDetails.length / ITEMS_PER_PAGE)}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
      </div>
    );
  };

  const Billing = () => (
    <div className="lab-container" style={{ maxHeight: '100%', height: '80%', overflow: 'auto' }}>
      <div className="LabProfile-billing-container">
        {billingLoading ? (
          <div>Loading...</div>
        ) : billingError ? (
          <div>Error: {billingError}</div>
        ) : billingData.length > 0 ? (
          paginatedData(billingData).map((billing, index) => (
            <div key={index} className="LabProfile-billing-card">
              <div className="LabProfile-billing-card-header">
                <div>
                  <div className="LabProfile-invoice-number">
                    Invoice: {billing.Billing_Invoice_No}
                  </div>
                  <div className="LabProfile-billing-date">
                    Date: {formatDate(billing.Billing_Date)}
                  </div>
                </div>
                <div className="LabProfile-billing-status">{billing.Bill_Status}</div>
              </div>
              <div className="LabProfile-billing-grid">
                <div className="LabProfile-billing-section">
                  <h3 className="LabProfile-section-title">Patient Information</h3>
                  <div className="LabProfile-detail-row">
                    <span className="LabProfile-detail-label">Patient ID:</span>
                    <span className="LabProfile-detail-value">{billing.Patient_Id}</span>
                  </div>
                  <div className="LabProfile-detail-row">
                    <span className="LabProfile-detail-label">Doctor ID:</span>
                    <span className="LabProfile-detail-value">{billing.Doctor_Id}</span>
                  </div>
                  <div className="LabProfile-detail-row">
                    <span className="LabProfile-detail-label">Visit ID:</span>
                    <span className="LabProfile-detail-value">{billing.Visit_Id}</span>
                  </div>
                </div>
                <div className="LabProfile-billing-section">
                  <h3 className="LabProfile-section-title">Order Details</h3>
                  <div className="LabProfile-detail-row">
                    <span className="LabProfile-detail-label">Total Items:</span>
                    <span className="LabProfile-detail-value">{billing.Total_Items}</span>
                  </div>
                  <div className="LabProfile-detail-row">
                    <span className="LabProfile-detail-label">Total Qty:</span>
                    <span className="LabProfile-detail-value">{billing.Total_Qty}</span>
                  </div>
                  <div className="LabProfile-detail-row">
                    <span className="LabProfile-detail-label">Created by:</span>
                    <span className="LabProfile-detail-value">{billing.created_by}</span>
                  </div>
                  <div className="LabProfile-detail-row">
                    <span className="LabProfile-detail-label">Created at:</span>
                    <span className="LabProfile-detail-value">{new Date(billing.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="LabProfile-billing-totals">
                <div className="LabProfile-detail-row">
                  <span className="LabProfile-detail-label">Net Amount:</span>
                  <span className="total-amount">₹{parseFloat(billing.Net_Amount).toFixed(2)}</span>
                </div>
                <div className="LabProfile-detail-row">
                  <span className="LabProfile-detail-label">Paid Amount:</span>
                  <span className="paid-amount">₹{parseFloat(billing.Paid_Amount).toFixed(2)}</span>
                </div>
                <div className="LabProfile-detail-row">
                  <span className="LabProfile-detail-label">Balance:</span>
                  <span className={billing.Balance_Amount === '0.00' ? 'balance-zero' : 'balance-due'}>
                    ₹{parseFloat(billing.Balance_Amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="LabProfile-no-data">No billing is available.</div>
        )}
        <ReactPaginate
          pageCount={Math.ceil(billingData.length / ITEMS_PER_PAGE)}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </div>
  );

  const TherapyRecordsView = () => (
    <div className="therapy-records-wrapper">
      <h2 className="therapy-title">Therapy Records</h2>
      {therapyLoading ? (
        <div className="therapy-loading">Loading...</div>
      ) : therapyError ? (
        <div className="therapy-error">Error: {therapyError}</div>
      ) : therapyOrders.length > 0 ? (
        <div className="therapy-orders-grid">
          {paginatedData(therapyOrders).map((order, idx) => (
            <div key={idx} className="therapy-order-card">
              <div className="therapy-card-header">
                <span>Order #{order.orderid}</span>
              </div>
              <div className="therapy-card-content">
                <p><strong>Therapy:</strong> {order.Therapy_Name}</p>
                <p><strong>Status:</strong> <span className={`status-tag ${order.Status.toLowerCase()}`}>{order.Status}</span></p>
              </div>
            </div>
          ))}
          <ReactPaginate
            pageCount={Math.ceil(therapyOrders.length / ITEMS_PER_PAGE)}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
      ) : (
        <div className="therapy-no-data">No therapy records available</div>
      )}
    </div>
  );

  const FormsIVFANSView = () => (
    <div className="forms-ivf-ans-wrapper">
      <h2 className="forms-title">IVF & ANC Records</h2>
      {ancIfLoading || ifCardLoading ? (
        <div className="forms-loading">Loading...</div>
      ) : ancIfError || ifCardError ? (
        <div className="forms-error">Error: {ancIfError || ifCardError}</div>
      ) : (
        <div className="forms-content">
          <div>
            <h3 className="section-title">ANC Cards</h3>
            {ancData.length > 0 ? (
              <div className="anc-cards-grid">
                {paginatedData(ancData).map((anc, idx) => (
                  <div key={idx} className="anc-card">
                    <div className="card-header">
                      <span>ANC #{(page - 1) * ITEMS_PER_PAGE + idx + 1}</span>
                    </div>
                    <div className="card-content">
                      <p><strong>Registration ID:</strong> {anc.RegistrationId}</p>
                      <p><strong>Husband:</strong> {anc.husbandName}</p>
                    </div>
                  </div>
                ))}
                <ReactPaginate
                  pageCount={Math.ceil(ancData.length / ITEMS_PER_PAGE)}
                  onPageChange={handlePageChange}
                  containerClassName="pagination"
                  activeClassName="active"
                />
              </div>
            ) : (
              <p>No ANC data</p>
            )}
          </div>
          <div>
            <h3 className="section-title">IF Cards</h3>
            {ifCardData.length > 0 ? (
              <div className="ifcard-grid">
                {paginatedData(ifCardData).map((ifc, idx) => (
                  <div key={idx} className="ifcard-card">
                    <div className="card-header">
                      <span>IF #{(page - 1) * ITEMS_PER_PAGE + idx + 1}</span>
                    </div>
                    <div className="card-content">
                      <p><strong>Registration ID:</strong> {ifc.RegistrationId}</p>
                      <p><strong>Husband:</strong> {ifc.husbandName}</p>
                    </div>
                  </div>
                ))}
                <ReactPaginate
                  pageCount={Math.ceil(ifCardData.length / ITEMS_PER_PAGE)}
                  onPageChange={handlePageChange}
                  containerClassName="pagination"
                  activeClassName="active"
                />
              </div>
            ) : (
              <p>No IF data</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'home': return <HomeView />;
      case 'appointments': return <AppointmentsView />;
      case 'OP': return <OPView />;
      case 'IP': return <IPView />;
      case 'LAB': return <DispatchList patientId={PatientListId?.PatientId}/>;
      case 'Radiology': return <RadiologyView />;
      case 'patientLedger': return <PatientLedgerView />;
      case 'Billing': return <Billing />;
      case 'therapyRecords': return <TherapyRecordsView />;
      case 'FormsIVFANS': return <FormsIVFANSView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="Main_container_app">
      <h3>Patient Profile</h3>
      <div className="main_container_mugesh">
        <div className="mugesh_left_siede_divvv">
          <div className="menu_mugesh">
            <div className="menus_mugesh">
              <Button onClick={handleHomeView} aria-label="View Home">Home <ArrowForwardIosIcon /></Button>
              <Button onClick={handleAppointments} aria-label="View Appointments">Appointments <ArrowForwardIosIcon /></Button>
              <Button onClick={handleOP} aria-label="View OP">OP <ArrowForwardIosIcon /></Button>
              <Button onClick={handleIP} aria-label="View IP">IP <ArrowForwardIosIcon /></Button>
              <Button onClick={handleLAB} aria-label="View LAB">LAB <ArrowForwardIosIcon /></Button>
              <Button onClick={handleRadiology} aria-label="View Radiology">Radiology <ArrowForwardIosIcon /></Button>
              <Button onClick={handleInvoice} aria-label="View Patient Ledger">Patient Ledger <ArrowForwardIosIcon /></Button>
              <Button onClick={handleBilling} aria-label="View Patient Billing">Patient Billing <ArrowForwardIosIcon /></Button>
              <Button onClick={handleTheropyRecords} aria-label="View Therapy Records">Therapy Records <ArrowForwardIosIcon /></Button>
              <Button onClick={handleForms} aria-label="View Forms IVF/ANS">Forms IVF/ANS <ArrowForwardIosIcon /></Button>
            </div>
          </div>
        </div>
        <div className="mugesh_continer_viwee">{renderContent()}</div>
      </div>
    </div>
  );
};

export default PatientProfile;