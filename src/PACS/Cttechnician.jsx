import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import axios from 'axios';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonIcon from "@mui/icons-material/Person";
import PACSWorkflow from './PACSWorkflow';   // ← NEW


const Cttechnician = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [Filterdata, setFilterdata] = useState([]);
  const [SearchQuery, setSearchQuery] = useState('');
  const [searchOPParams, setsearchOPParams] = useState({
    query: '',
    status: 'Paid',
    Employeeid: userRecord?.Employeeid,
    Dept: userRecord?.Emp_DepartmentId,
    User: userRecord?.username || ''
  });

  const [dateOption, setDateOption] = useState('current');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [ParticularDate, setParticularDate] = useState('');
  const [CurrentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [filtercount, setfiltercount] = useState('');
  const [Totalcount, setTotalcount] = useState('');

  // ── PACS state ────────────────────────────────────────────────
  const [showPACS, setShowPACS] = useState(false);
  const [pacsPatient, setPacsPatient] = useState(null);

  useEffect(() => {
    if (dateOption === 'current') setCurrentDate(new Date().toISOString().split('T')[0]);
  }, [dateOption]);

  const handleCurrentDateChange = (e) => setCurrentDate(e.target.value);
  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);
  const handleParticularDateChange = (e) => setParticularDate(e.target.value);

  const handleDateOptionChange = (e) => {
    setDateOption(e.target.value);
    if (e.target.value === 'current') { setFromDate(''); setToDate(''); setParticularDate(''); }
    else if (e.target.value === 'custom') { setParticularDate(''); setCurrentDate(''); }
    else if (e.target.value === 'particular') { setFromDate(''); setToDate(''); setCurrentDate(''); }
    else if (e.target.value === 'all') { setFromDate(''); setToDate(''); setCurrentDate(''); setParticularDate(''); }
  };

  const handleSearchChangeStatus = (e) => {
    const { name, value } = e.target;
    setsearchOPParams({ ...searchOPParams, [name]: value });
  };

  // Main data fetch
  useEffect(() => {
    const params = { ...searchOPParams, dateOption, fromDate, toDate, ParticularDate, CurrentDate };

    axios.get(`${UrlLink}MCI/Radiology_filterwise_count_original_Deptwise`, { params })
      .then((res) => { setTotalcount(res.data.totalcount); setfiltercount(res.data.filtercount); })
      .catch((err) => console.log(err));

    axios.get(`${UrlLink}OP/Radiology_Queuelist_link`, { params })
      .then((res) => {
        const ress = res.data;
        if (Array.isArray(ress)) { setPatientRegisterData(ress); setFilterdata(ress); }
        else { setPatientRegisterData([]); setFilterdata([]); }
      })
      .catch((err) => console.log(err));
  }, [UrlLink, searchOPParams, CurrentDate, ParticularDate, dateOption, fromDate, toDate]);

  useEffect(() => {
    if (SearchQuery !== '') {
      const q = SearchQuery.toLowerCase();
      setFilterdata(PatientRegisterData.filter(({ PatientId, PhoneNumber, PatientName, Aadhar }) =>
        (PatientId && PatientId.toLowerCase().includes(q)) ||
        (PhoneNumber && PhoneNumber.toLowerCase().includes(q)) ||
        (PatientName && PatientName.toLowerCase().includes(q)) ||
        (Aadhar && Aadhar)
      ));
    } else {
      setFilterdata(PatientRegisterData);
    }
  }, [SearchQuery, PatientRegisterData]);

  // ── Handlers ─────────────────────────────────────────────────

  const handleReportEntry = (params) => {
    if (params.Status === "Request") {
      dispatch({ type: 'toast', value: { message: 'Billing not yet Completed', type: 'warn' } });
    } else if (
      (params.Status === "Paid" && params.service_Status === "Pending") ||
      (params.Status === "Due" && params.service_Status === "Pending")
    ) {
      dispatch({ type: 'RadiologyWorkbenchNavigation', value: { params } });
      navigate('/Home/RadiologyReportEntry');
    } else {
      dispatch({ type: 'toast', value: { message: 'There is No Action.', type: 'warn' } });
    }
  };

  /** Open PACS viewer for CT modality */
  const handleOpenPACS = (row) => {
    setPacsPatient(row);
    setShowPACS(true);
  };

  // ── Columns ──────────────────────────────────────────────────

  const PatientOPRegisterColumns = [
    { key: "id", name: "S.No" },
    { key: "PatientId", name: "Patient Id" },
    { key: "PatientName", name: "Patient Name", width: 220 },
    { key: "RegisterType", name: "Register Type", width: 130 },
    { key: "PhoneNumber", name: "PhoneNo", width: 120 },
    { key: "doctor_name", name: "Doctor Name", width: 140 },
    {
      key: "Action",
      name: "Action",
      width: 160,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: 4 }}>
          {/* Existing report entry */}
          <Button
            className="cell_btn"
            onClick={() => handleReportEntry(params?.row)}
            title="Report Entry"
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>

          {/* ── NEW: PACS Viewer ── */}
          <Button
            className="cell_btn"
            onClick={() => handleOpenPACS(params?.row)}
            title="View CT PACS Images"
            style={{
              backgroundColor: '#e67e22',
              color: 'white',
              minWidth: 36,
              padding: '4px 8px',
              borderRadius: 4
            }}
          >
            <MedicalServicesIcon style={{ fontSize: 18 }} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="Main_container_app">
      <h3>CT QueueList</h3>

      {/* Stats */}
      <div className="con_1">
        <div className="chart_body_1_child_1 dww3" style={{ cursor: "pointer" }}>
          <div className="chart_body_1_child_1_body">
            <div className="chart_body_1_child_1_body_icon"><PersonAddAlt1Icon /></div>
            <div className="chart_body_1_child_1_body_count"><h2>{filtercount}</h2></div>
            <div className="chart_body_1_child_1_body_name">Counts</div>
          </div>
        </div>
        <div className="chart_body_1_child_1 dww3" style={{ cursor: "pointer" }}>
          <div className="chart_body_1_child_1_body">
            <div className="chart_body_1_child_1_body_icon"><PersonIcon /></div>
            <div className="chart_body_1_child_1_body_count"><h2>{Totalcount}</h2></div>
            <div className="chart_body_1_child_1_body_name">Total Counts</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="search_div_bar">
        <div className="search_div_bar_inp_1">
          <label>Date <span>:</span></label>
          <select value={dateOption} onChange={handleDateOptionChange}>
            <option value="current">Current Date</option>
            <option value="custom">Custom Date</option>
            <option value="particular">Particular Date</option>
          </select>

          {dateOption === 'current' && (
            <div className="search_div_bar_inp_1">
              <label>Current Date <span>:</span></label>
              <input type="date" value={CurrentDate} onChange={handleCurrentDateChange} />
            </div>
          )}
          {dateOption === 'custom' && (
            <>
              <div className="search_div_bar_inp_1">
                <label>From <span>:</span></label>
                <input type="date" value={fromDate} onChange={handleFromDateChange} />
              </div>
              <div className="search_div_bar_inp_1">
                <label>To <span>:</span></label>
                <input type="date" value={toDate} onChange={handleToDateChange} />
              </div>
            </>
          )}
          {dateOption === 'particular' && (
            <div className="search_div_bar_inp_1">
              <label>Select Date <span>:</span></label>
              <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
            </div>
          )}
        </div>

        <div className="RegisForm_1">
          <label>Status <span>:</span></label>
          <select name='status' value={searchOPParams.status} onChange={handleSearchChangeStatus}>
            <option value=''>Select</option>
            <option value='Request'>Request</option>
            <option value='Paid'>Paid</option>
            <option value='Due'>Due</option>
            <option value='Analyzed'>Analyzed</option>
            <option value='Completed'>Completed</option>
          </select>
        </div>
      </div>

      <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata} />
      <ToastAlert Message={toast.message} Type={toast.type} />

      {/* ── PACS Viewer Modal ── */}
      {showPACS && pacsPatient && (
        <PACSWorkflow
          patient={pacsPatient}
          modality="CT"
          onClose={() => { setShowPACS(false); setPacsPatient(null); }}
        />
      )}
    </div>
  );
};

export default Cttechnician;
