import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPrint } from 'react-icons/fa';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import Tooltip from '@mui/material/Tooltip';

// ✅ FIX P7: Debounce hook to prevent API spam
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const Patienttestlist = () => {
  const dispatchvalue = useDispatch();
  const today = new Date().toISOString().slice(0, 10);

  // Raw search state (updates immediately on keystroke)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchQuery3, setSearchQuery3] = useState('');
  const [searchQuery4, setSearchQuery4] = useState('currentdate');
  const [searchQuery5, setSearchQuery5] = useState(today);
  const [searchQuery6, setSearchQuery6] = useState('');
  const [searchQuery7, setSearchQuery7] = useState('');
  const [searchQuery8, setSearchQuery8] = useState('');

  // ✅ FIX P6: Status filter now sent to backend (no client filtering)
  const [statusFilter, setStatusFilter] = useState('');

  const [viewtest, setViewtest] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [expandedTest, setExpandedTest] = useState(null);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const [filteredRows, setFilteredRows] = useState([]);
  const urllink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusCount, setStatusCount] = useState({});
  const [loading, setLoading] = useState(false);

  const toast = useSelector((state) => state.userRecord?.toast);

  const PageSize = 10;

  const statusColors = {
    captureSample: '#FFD700',
    labTechnician: '#FFA500',
    seniorTechnician: '#1E90FF',
    pathologist: '#800080',
    completed: '#008000',
  };

  // ✅ FIX P7: Debounced values (wait 400ms after user stops typing)
  const dName = useDebounce(searchQuery);
  const dPhone = useDebounce(searchQuery1);
  const dBarcode = useDebounce(searchQuery2);
  const dInvoice = useDebounce(searchQuery3);
  const dDate = useDebounce(searchQuery5);
  const dFrom = useDebounce(searchQuery6);
  const dTo = useDebounce(searchQuery7);

  const department = Array.isArray(userRecord?.Lab_Department)
    ? userRecord.Lab_Department.filter(Boolean).join(',')
    : '';

  // ✅ FIX P9: Single useEffect for BOTH patient list + status count
  useEffect(() => {
    if (!urllink || !userRecord?.location) return;

    const offset = page * PageSize;
    setLoading(true);

    // ✅ Request 1: Patient list (with ALL filters including statusFilter)
    const listPromise = axios.get(`${urllink}Lab/get_patienttestlist`, {
      params: {
        Location: userRecord?.location,
        limit: PageSize,
        offset,
        patient_name: dName,
        phone: dPhone,
        barcode: dBarcode,
        invoice: dInvoice,
        departments: department,
        dateType: searchQuery4,
        date: dDate,
        from: dFrom,
        to: dTo,
        patient: searchQuery8,
        status_filter: statusFilter,  // ✅ Sent to backend!
      },
    });

    // ✅ Request 2: Status counts (separate, lighter query)
    const countPromise = axios.get(`${urllink}Lab/get_status_count`, {
      params: {
        Location: userRecord?.location,
        departments: department,
        dateType: searchQuery4,
        date: dDate,
        from: dFrom,
        to: dTo,
      },
    });

    // ✅ Fire both in parallel, not sequential!
    Promise.all([listPromise, countPromise])
      .then(([listRes, countRes]) => {
        // ✅ FIX P6: NO CLIENT-SIDE FILTERING! Backend already filtered
        const data = listRes.data.data.map((row, index) => ({ 
          id: index, 
          ...row 
        }));
        
        // Sort by invoice number (descending)
        data.sort((a, b) => {
          const A = parseInt((a.Billing_Invoice || '').replace(/\D/g, ''), 10) || 0;
          const B = parseInt((b.Billing_Invoice || '').replace(/\D/g, ''), 10) || 0;
          return B - A;
        });

        setFilteredRows(data);
        setTotalPages(Math.ceil(listRes.data.total_records / PageSize));
        setStatusCount(countRes.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setFilteredRows([]);
        setTotalPages(0);
        setLoading(false);
      });
  }, [
    urllink,
    userRecord?.location,
    department,
    page,
    dName,      // ✅ Debounced (400ms delay)
    dPhone,     // ✅ Debounced
    dBarcode,   // ✅ Debounced
    dInvoice,   // ✅ Debounced
    searchQuery4,
    dDate,      // ✅ Debounced
    dFrom,      // ✅ Debounced
    dTo,        // ✅ Debounced
    searchQuery8,
    statusFilter,  // ✅ FIX P8: Status filter triggers re-fetch (backend filters)
  ]);

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    setPage(0); // Reset to first page on filter change
    if (type === 'name') setSearchQuery(value);
    else if (type === 'phone') setSearchQuery1(value);
    else if (type === 'barcode') setSearchQuery2(value);
    else if (type === 'invoice') setSearchQuery3(value);
    else if (type === 'dateType') setSearchQuery4(value);
    else if (type === 'date') setSearchQuery5(value);
    else if (type === 'fromdate') setSearchQuery6(value);
    else if (type === 'todate') setSearchQuery7(value);
    else if (type === 'PatientType') setSearchQuery8(value);
  };

  const handleBarcodeReprint = (params) => {
    dispatchvalue({ type: 'PrintBarcode', value: params });
    dispatchvalue({ type: 'setActiveFolder', value: 'BarcodePrint' });
  };

  const handleviewtest = (params) => {
    const testData = params?.Test_Names.map((test, index) => ({
      id: index,
      testname: test.Test_Name,
      subTests: test.SubTests || [],
      department: test.department,
    }));
    setViewtest(testData);
    setExpandedTest(null);
    setOpenModal(true);
  };

  const toggleSubTests = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };

  const handlePress = (params) => {
    const Access = userRecord.AccessTwo.split(',');
    let key = '', page = '';
    if (params.row.Service_Status === 'Pending') { key = 'L12-1'; page = 'Phelobotomist'; }
    else if (params.row.Analysis_Status === 'Pending') { key = 'L12-2'; page = 'LabTechnician'; }
    else if (params.row.Verify_Status === 'Pending') { key = 'L12-3'; page = 'SrTechnician'; }
    else if (params.row.Approve_Status === 'Pending') { key = 'L12-4'; page = 'Pathologist'; }
    else { key = 'L12-5'; page = 'Dispatch'; }

    if (Access.includes(key)) {
      dispatchvalue({ type: 'setPreviousFolder', value: 'Patienttestlist' });
      dispatchvalue({ type: 'setActiveFolder', value: page });
      dispatchvalue({ type: 'searchLab', value: { name: params.row.Patient_Name, date: params.row.CreatedAt } });
    } else {
      dispatchvalue({ type: 'toast', value: { message: 'Access Denied', type: 'warn' } });
    }
  };

  const getStatusColor = (row) => {
    if (row.Service_Status === 'Pending') return statusColors.captureSample;
    if (row.Analysis_Status === 'Pending') return statusColors.labTechnician;
    if (row.Verify_Status === 'Pending') return statusColors.seniorTechnician;
    if (row.Approve_Status === 'Pending') return statusColors.pathologist;
    return statusColors.completed;
  };

  const handleStatusClick = (status) => {
    // ✅ Toggle filter (click same status to clear)
    setStatusFilter(status === statusFilter ? '' : status);
    setPage(0);
  };

  const dynamicColumns = [
    { key: 'CreatedAt', name: 'Date', width: 70, frozen: true },
    { key: 'Billing_Invoice', name: 'OP/IP No', width: 140, frozen: true },
    { key: 'Barcode', name: 'Sample Barcode', width: 70, frozen: true },
    { key: 'Patient_Id', name: 'Patient Id', width: 70, frozen: true },
    { key: 'Visit_Id', name: 'Visit ID', width: 70 },
    { key: 'Patient_Name', name: 'Patient Name', width: 90 },
    { key: 'Age', name: 'Age', width: 50 },
    { key: 'Phone', name: 'Phone No', width: 80 },
    {
      key: 'Status',
      name: 'Status',
      width: 100,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getStatusColor(params.row),
            color: '#fff',
            textAlign: 'center',
            padding: '4px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => handlePress(params)}
        >
          {params.row.Service_Status !== 'Completed' ? 'Capture Sample'
            : params.row.Analysis_Status !== 'Completed' ? 'Lab Technician'
            : params.row.Verify_Status !== 'Completed' ? 'Senior Technician'
            : params.row.Approve_Status !== 'Completed' ? 'Pathologist'
            : 'Completed'}
        </div>
      ),
    },
    {
      key: 'Test_Names_dept',
      name: 'Departments',
      width: 90,
      renderCell: (params) => {
        const testNames = Array.isArray(params.row?.Test_Names) ? params.row.Test_Names : [];
        const depts = Array.from(new Set(testNames.map(t => t.department || 'Unknown')));
        return (
          <>
            {depts.length > 0
              ? depts.map(d => <div key={d} style={{ fontSize: '10px' }}>{d}</div>)
              : <div>No department</div>}
          </>
        );
      },
    },
    {
      key: 'Test_Names_view',
      name: 'View Tests',
      width: 70,
      renderCell: (params) => (
        <Button
          onClick={() => handleviewtest(params.row)}
          startIcon={<VisibilityIcon />}
          sx={{
            color: 'var(--ProjectColor)',
            '&:hover': { color: 'var(--ProjectColorhover)' }
          }}
        />
      ),
    },
    {
      key: 'Barcode_Reprint',
      name: 'Barcode Reprint',
      width: 120,
      renderCell: (params) => (
        <Button
          className="cell_btn"
          style={{ height: '35px' }}
          onClick={() => handleBarcodeReprint(params.row)}
        >
          <FaPrint />
        </Button>
      ),
    },
  ];

  return (
    <div className="appointment">
      <ToastAlert Message={toast.message} Type={toast.type} />

      {/* Status summary tiles */}
      <div style={{ width: '70% !important' }}>
        <table className="responsive-table-M007" style={{ width: '70% !important' }}>
          <thead>
            <tr>
              <th colSpan={6} style={{ textAlign: 'center' }}>Patient Queue Waiting At</th>
            </tr>
            <tr>
              {[
                { label: 'Total Patients', key: 'total', bg: '#ca1f3cff' },
                { label: 'Sample Capture', key: 'collection', bg: '#FFD700' },
                { label: 'Lab Technician', key: 'analysis', bg: '#FFA500' },
                { label: 'Senior Technician', key: 'verify', bg: '#1E90FF' },
                { label: 'Pathologist', key: 'approve', bg: '#800080' },
                { label: 'Dispatched', key: 'completed', bg: '#008000' },
              ].map(({ label, key, bg }) => (
                <td key={key}>
                  <div
                    style={{
                      backgroundColor: bg,
                      outline: statusFilter === key ? '3px solid #000' : 'none',
                      color: '#fff',
                      textAlign: 'center',
                      padding: '4px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleStatusClick(key)}
                  >
                    {label}
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{statusCount.total}</td>
              <td>{statusCount.collection}</td>
              <td>{statusCount.analysis}</td>
              <td>{statusCount.verify}</td>
              <td>{statusCount.approve}</td>
              <td>{statusCount.completed}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="h_head"><h3>Patient Request List</h3></div>

      <div className="con_1">
        <div className="inp_1">
          <label>Patient Name :</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e, 'name')}
            placeholder="Enter the Patient Name"
          />
        </div>
        <div className="inp_1">
          <label>Phone :</label>
          <input
            type="text"
            value={searchQuery1}
            onChange={(e) => handleSearchChange(e, 'phone')}
            placeholder="Enter the Phone Number"
          />
        </div>
        <div className="inp_1">
          <label>Barcode</label>
          <input
            type="text"
            value={searchQuery2}
            onChange={(e) => handleSearchChange(e, 'barcode')}
            placeholder="Enter Barcode Number"
          />
        </div>
        <div className="inp_1">
          <label>OP/IP No</label>
          <input
            type="text"
            value={searchQuery3}
            onChange={(e) => handleSearchChange(e, 'invoice')}
            placeholder="Enter Invoice Number"
          />
        </div>
        <div className="inp_1">
          <label>Patient Type</label>
          <select
            value={searchQuery8}
            onChange={(e) => handleSearchChange(e, 'PatientType')}
          >
            <option value="All">All</option>
            <option value="IP">IP</option>
            <option value="OP">OP</option>
          </select>
        </div>
        <div className="inp_1">
          <label>Date Type</label>
          <select
            value={searchQuery4}
            onChange={(e) => handleSearchChange(e, 'dateType')}
            style={{ width: '165px' }}
          >
            <option value="currentdate">Current</option>
            <option value="customdate">Custom Date</option>
          </select>
        </div>
        {searchQuery4 === 'currentdate' ? (
          <div className="inp_1">
            <label>Date</label>
            <input
              type="date"
              value={searchQuery5}
              onChange={(e) => handleSearchChange(e, 'date')}
            />
          </div>
        ) : (
          <div className="inp_1" style={{ gap: '5px' }}>
            <span style={{ color: 'black', fontSize: '13px', fontWeight: 'bold' }}>
              From{' '}
            </span>
            <input
              type="date"
              value={searchQuery6}
              onChange={(e) => handleSearchChange(e, 'fromdate')}
            />
            <span style={{ color: 'black', fontSize: '13px', fontWeight: 'bold' }}>
              {' '}To{' '}
            </span>
            <input
              type="date"
              value={searchQuery7}
              onChange={(e) => handleSearchChange(e, 'todate')}
            />
          </div>
        )}
      </div>

      <div className="grid_1">
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '8px',
            color: 'var(--ProjectColor)',
            fontWeight: 'bold'
          }}>
            Loading…
          </div>
        )}
        <ReactGrid
          columns={dynamicColumns}
          RowData={filteredRows}
          hidePagination={true}
          className="data_grid"
        />
        <div className="pagination-controls">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="pagination-button"
          >
            <ArrowBackIosNewIcon />
          </button>
          Page {page + 1} of {totalPages || 1}
          <button
            onClick={() => setPage(p => p + 1 < totalPages ? p + 1 : p)}
            disabled={page + 1 >= totalPages}
            className="pagination-button"
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
      </div>

      {openModal && (
        <div
          className={isSidebarOpen ? 'sideopen_showcamera_profile' : 'showcamera_profile'}
          onClick={() => setOpenModal(false)}
        >
          <div
            className="newwProfiles newwPopupforreason uwagduaguleaveauto"
            onClick={(e) => e.stopPropagation()}
          >
            <br />
            <div className="appointment">
              <div className="h_head"><h4>Tests</h4></div>
              <div className="Main_container_app">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: '8px', width: '70px' }}>
                        S.No
                      </th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', width: '250px' }}>
                        Test Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewtest.map((test) => (
                      <React.Fragment key={test.id}>
                        <tr>
                          <td style={{
                            border: '1px solid #ddd',
                            padding: '8px',
                            textAlign: 'center'
                          }}>
                            {test.id + 1}
                          </td>
                          <td style={{
                            border: '1px solid #ddd',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <span>{test.testname || 'Unnamed Test'}</span>
                            {test.subTests.length > 0 && (
                              <Button
                                onClick={() => toggleSubTests(test.id)}
                                sx={{ minWidth: '30px', padding: '0', marginLeft: '8px' }}
                              >
                                {expandedTest === test.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </Button>
                            )}
                          </td>
                        </tr>
                        {expandedTest === test.id && test.subTests.map((subTest, idx) => (
                          <tr key={idx}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}></td>
                            <td style={{
                              border: '1px solid #ddd',
                              padding: '8px',
                              paddingLeft: '28px'
                            }}>
                              {subTest.test_name}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="Register_btn_con">
              <button className="RegisterForm_1_btns" onClick={() => setOpenModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patienttestlist;
// import * as React from 'react';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaPrint } from 'react-icons/fa';
// import Button from '@mui/material/Button';
// import { useSelector, useDispatch } from 'react-redux';
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import Tooltip from '@mui/material/Tooltip';

// // ── Debounce hook ─────────────────────────────────────────────────────────────
// function useDebounce(value, delay = 400) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debounced;
// }

// const Patienttestlist = () => {
//   const dispatchvalue = useDispatch();
//   const today = new Date().toISOString().slice(0, 10);

//   // ── Raw search state ─────────────────────────────────────────────────────────
//   const [searchQuery,  setSearchQuery]  = useState('');
//   const [searchQuery1, setSearchQuery1] = useState('');
//   const [searchQuery2, setSearchQuery2] = useState('');
//   const [searchQuery3, setSearchQuery3] = useState('');
//   const [searchQuery4, setSearchQuery4] = useState('currentdate');
//   const [searchQuery5, setSearchQuery5] = useState(today);
//   const [searchQuery6, setSearchQuery6] = useState('');
//   const [searchQuery7, setSearchQuery7] = useState('');
//   const [searchQuery8, setSearchQuery8] = useState('');

//   // FIX P6: statusFilter now sent to backend — no client-side filtering
//   const [statusFilter, setStatusFilter] = useState('');

//   const [viewtest,      setViewtest]      = useState([]);
//   const [openModal,     setOpenModal]     = useState(false);
//   const [expandedTest,  setExpandedTest]  = useState(null);
//   const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
//   const [filteredRows,  setFilteredRows]  = useState([]);
//   const urllink    = useSelector(state => state.userRecord?.UrlLink);
//   const userRecord = useSelector(state => state.userRecord?.UserData);
//   const [page,          setPage]          = useState(0);
//   const [totalPages,    setTotalPages]    = useState(0);
//   const [statusCount,   setStatusCount]   = useState({});
//   const [loading,       setLoading]       = useState(false);

//   const toast = useSelector((state) => state.userRecord?.toast);

//   const PageSize = 10;

//   const statusColors = {
//     captureSample:    '#FFD700',
//     labTechnician:    '#FFA500',
//     seniorTechnician: '#1E90FF',
//     pathologist:      '#800080',
//     completed:        '#008000',
//   };

//   // ── Debounced text searches ──────────────────────────────────────────────────
//   // FIX P7: no per-keystroke API calls
//   const dName    = useDebounce(searchQuery);
//   const dPhone   = useDebounce(searchQuery1);
//   const dBarcode = useDebounce(searchQuery2);
//   const dInvoice = useDebounce(searchQuery3);
//   const dDate    = useDebounce(searchQuery5);
//   const dFrom    = useDebounce(searchQuery6);
//   const dTo      = useDebounce(searchQuery7);

//   const department = Array.isArray(userRecord?.Lab_Department)
//     ? userRecord.Lab_Department.filter(Boolean).join(',')
//     : '';

//   // ── FIX P9: combine patient list + status count into ONE useEffect ───────────
//   // Both fire together. Patient list uses all filters; count uses date filters only.
//   useEffect(() => {
//     if (!urllink || !userRecord?.location) return;

//     const offset = page * PageSize;
//     setLoading(true);

//     // Request 1: patient list (with all filters including statusFilter sent to backend)
//     const listPromise = axios.get(`${urllink}Lab/get_patienttestlist`, {
//       params: {
//         Location:     userRecord?.location,
//         limit:        PageSize,
//         offset,
//         patient_name: dName,
//         phone:        dPhone,
//         barcode:      dBarcode,
//         invoice:      dInvoice,
//         departments:  department,
//         dateType:     searchQuery4,
//         date:         dDate,
//         from:         dFrom,
//         to:           dTo,
//         patient:      searchQuery8,
//         // FIX P6: pass statusFilter to backend so pagination is correct
//         status_filter: statusFilter,
//       },
//     });

//     // Request 2: status counts (date/dept only — not affected by text search)
//     const countPromise = axios.get(`${urllink}Lab/get_status_count`, {
//       params: {
//         Location:    userRecord?.location,
//         departments: department,
//         dateType:    searchQuery4,
//         date:        dDate,
//         from:        dFrom,
//         to:          dTo,
//       },
//     });

//     // Fire both in parallel — FIX P9: not two sequential/separate useEffects
//     Promise.all([listPromise, countPromise])
//       .then(([listRes, countRes]) => {
//         const data = listRes.data.data.map((row, index) => ({ id: index, ...row }));
//         data.sort((a, b) => {
//           const A = parseInt((a.Billing_Invoice || '').replace(/\D/g, ''), 10) || 0;
//           const B = parseInt((b.Billing_Invoice || '').replace(/\D/g, ''), 10) || 0;
//           return B - A;
//         });
//         setFilteredRows(data);
//         setTotalPages(Math.ceil(listRes.data.total_records / PageSize));
//         setStatusCount(countRes.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         setFilteredRows([]);
//         setTotalPages(0);
//         setLoading(false);
//       });
//   }, [
//     urllink, userRecord?.location, department,
//     page,
//     dName, dPhone, dBarcode, dInvoice,
//     searchQuery4, dDate, dFrom, dTo,
//     searchQuery8,
//     statusFilter,   // FIX P8: statusFilter triggers re-fetch (backend), not client filter
//   ]);

//   const handleSearchChange = (event, type) => {
//     const value = event.target.value;
//     setPage(0); // reset on filter change
//     if (type === 'name')        setSearchQuery(value);
//     else if (type === 'phone')  setSearchQuery1(value);
//     else if (type === 'barcode')setSearchQuery2(value);
//     else if (type === 'invoice')setSearchQuery3(value);
//     else if (type === 'dateType')setSearchQuery4(value);
//     else if (type === 'date')   setSearchQuery5(value);
//     else if (type === 'fromdate')setSearchQuery6(value);
//     else if (type === 'todate') setSearchQuery7(value);
//     else if (type === 'PatientType')setSearchQuery8(value);
//   };

//   const handleBarcodeReprint = (params) => {
//     dispatchvalue({ type: 'PrintBarcode',    value: params });
//     dispatchvalue({ type: 'setActiveFolder', value: 'BarcodePrint' });
//   };

//   const handleviewtest = (params) => {
//     const testData = params?.Test_Names.map((test, index) => ({
//       id: index,
//       testname: test.Test_Name,
//       subTests: test.SubTests || [],
//       department: test.department,
//     }));
//     setViewtest(testData);
//     setExpandedTest(null);
//     setOpenModal(true);
//   };

//   const toggleSubTests = (testId) => {
//     setExpandedTest(expandedTest === testId ? null : testId);
//   };

//   const handlePress = (params) => {
//     const Access = userRecord.AccessTwo.split(',');
//     let key = '', page = '';
//     if (params.row.Service_Status === 'Pending')       { key = 'L12-1'; page = 'Phelobotomist'; }
//     else if (params.row.Analysis_Status === 'Pending') { key = 'L12-2'; page = 'LabTechnician'; }
//     else if (params.row.Verify_Status === 'Pending')   { key = 'L12-3'; page = 'SrTechnician'; }
//     else if (params.row.Approve_Status === 'Pending')  { key = 'L12-4'; page = 'Pathologist'; }
//     else                                               { key = 'L12-5'; page = 'Dispatch'; }

//     if (Access.includes(key)) {
//       dispatchvalue({ type: 'setPreviousFolder', value: 'Patienttestlist' });
//       dispatchvalue({ type: 'setActiveFolder',   value: page });
//       dispatchvalue({ type: 'searchLab',         value: { name: params.row.Patient_Name, date: params.row.CreatedAt } });
//     } else {
//       dispatchvalue({ type: 'toast', value: { message: 'Access Denied', type: 'warn' } });
//     }
//   };

//   const getStatusColor = (row) => {
//     if (row.Service_Status === 'Pending')  return statusColors.captureSample;
//     if (row.Analysis_Status === 'Pending') return statusColors.labTechnician;
//     if (row.Verify_Status === 'Pending')   return statusColors.seniorTechnician;
//     if (row.Approve_Status === 'Pending')  return statusColors.pathologist;
//     return statusColors.completed;
//   };

//   const handleStatusClick = (status) => {
//     setStatusFilter(status === statusFilter ? '' : status); // toggle off if same
//     setPage(0);
//   };

//   const dynamicColumns = [
//     { key: 'CreatedAt',       name: 'Date',           width: 70,  frozen: true },
//     { key: 'Billing_Invoice', name: 'OP/IP No',       width: 140, frozen: true },
//     { key: 'Barcode',         name: 'Sample Barcode', width: 70,  frozen: true },
//     { key: 'Patient_Id',      name: 'Patient Id',     width: 70,  frozen: true },
//     { key: 'Visit_Id',        name: 'Visit ID',       width: 70 },
//     { key: 'Patient_Name',    name: 'Patient Name',   width: 90 },
//     { key: 'Age',             name: 'Age',            width: 50 },
//     { key: 'Phone',           name: 'Phone No',       width: 80 },
//     {
//       key: 'Status',
//       name: 'Status',
//       width: 100,
//       renderCell: (params) => (
//         <div
//           style={{ backgroundColor: getStatusColor(params.row), color: '#fff', textAlign: 'center', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
//           onClick={() => handlePress(params)}
//         >
//           {params.row.Service_Status !== 'Completed' ? 'Capture Sample'
//             : params.row.Analysis_Status !== 'Completed' ? 'Lab Technician'
//             : params.row.Verify_Status !== 'Completed'  ? 'Senior Technician'
//             : params.row.Approve_Status !== 'Completed' ? 'Pathologist'
//             : 'Completed'}
//         </div>
//       ),
//     },
//     {
//       key: 'Test_Names_dept',
//       name: 'Departments',
//       width: 90,
//       renderCell: (params) => {
//         const testNames = Array.isArray(params.row?.Test_Names) ? params.row.Test_Names : [];
//         const depts = Array.from(new Set(testNames.map(t => t.department || 'Unknown')));
//         return (
//           <>
//             {depts.length > 0
//               ? depts.map(d => <div key={d} style={{ fontSize: '10px' }}>{d}</div>)
//               : <div>No department</div>}
//           </>
//         );
//       },
//     },
//     {
//       key: 'Test_Names_view',
//       name: 'View Tests',
//       width: 70,
//       renderCell: (params) => (
//         <Button
//           onClick={() => handleviewtest(params.row)}
//           startIcon={<VisibilityIcon />}
//           sx={{ color: 'var(--ProjectColor)', '&:hover': { color: 'var(--ProjectColorhover)' } }}
//         />
//       ),
//     },
//     {
//       key: 'Barcode_Reprint',
//       name: 'Barcode Reprint',
//       width: 120,
//       renderCell: (params) => (
//         <Button className="cell_btn" style={{ height: '35px' }} onClick={() => handleBarcodeReprint(params.row)}>
//           <FaPrint />
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div className="appointment">
//       <ToastAlert Message={toast.message} Type={toast.type} />

//       {/* Status summary tiles */}
//       <div style={{ width: '70% !important' }}>
//         <table className="responsive-table-M007" style={{ width: '70% !important' }}>
//           <thead>
//             <tr>
//               <th colSpan={6} style={{ textAlign: 'center' }}>Patient Queue Waiting At</th>
//             </tr>
//             <tr>
//               {[
//                 { label: 'Total Patients',   key: 'total',      bg: '#ca1f3cff' },
//                 { label: 'Sample Capture',   key: 'collection', bg: '#FFD700'   },
//                 { label: 'Lab Technician',   key: 'analysis',   bg: '#FFA500'   },
//                 { label: 'Senior Technician',key: 'verify',     bg: '#1E90FF'   },
//                 { label: 'Pathologist',      key: 'approve',    bg: '#800080'   },
//                 { label: 'Dispatched',       key: 'completed',  bg: '#008000'   },
//               ].map(({ label, key, bg }) => (
//                 <td key={key}>
//                   <div
//                     style={{
//                       backgroundColor: bg,
//                       outline: statusFilter === key ? '3px solid #000' : 'none',
//                       color: '#fff', textAlign: 'center', padding: '4px',
//                       borderRadius: '4px', cursor: 'pointer',
//                     }}
//                     onClick={() => handleStatusClick(key)}
//                   >
//                     {label}
//                   </div>
//                 </td>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>{statusCount.total}</td>
//               <td>{statusCount.collection}</td>
//               <td>{statusCount.analysis}</td>
//               <td>{statusCount.verify}</td>
//               <td>{statusCount.approve}</td>
//               <td>{statusCount.completed}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <div className="h_head"><h3>Patient Request List</h3></div>

//       <div className="con_1">
//         <div className="inp_1">
//           <label>Patient Name :</label>
//           <input type="text" value={searchQuery}  onChange={(e) => handleSearchChange(e, 'name')}    placeholder="Enter the Patient Name" />
//         </div>
//         <div className="inp_1">
//           <label>Phone :</label>
//           <input type="text" value={searchQuery1} onChange={(e) => handleSearchChange(e, 'phone')}   placeholder="Enter the Phone Number" />
//         </div>
//         <div className="inp_1">
//           <label>Barcode</label>
//           <input type="text" value={searchQuery2} onChange={(e) => handleSearchChange(e, 'barcode')} placeholder="Enter Barcode Number" />
//         </div>
//         <div className="inp_1">
//           <label>OP/IP No</label>
//           <input type="text" value={searchQuery3} onChange={(e) => handleSearchChange(e, 'invoice')} placeholder="Enter Invoice Number" />
//         </div>
//         <div className="inp_1">
//           <label>Patient Type</label>
//           <select value={searchQuery8} onChange={(e) => handleSearchChange(e, 'PatientType')}>
//             <option value="All">All</option>
//             <option value="IP">IP</option>
//             <option value="OP">OP</option>
//           </select>
//         </div>
//         <div className="inp_1">
//           <label>Date Type</label>
//           <select value={searchQuery4} onChange={(e) => handleSearchChange(e, 'dateType')} style={{ width: '165px' }}>
//             <option value="currentdate">Current</option>
//             <option value="customdate">Custom Date</option>
//           </select>
//         </div>
//         {searchQuery4 === 'currentdate' ? (
//           <div className="inp_1">
//             <label>Date</label>
//             <input type="date" value={searchQuery5} onChange={(e) => handleSearchChange(e, 'date')} />
//           </div>
//         ) : (
//           <div className="inp_1" style={{ gap: '5px' }}>
//             <span style={{ color: 'black', fontSize: '13px', fontWeight: 'bold' }}>From </span>
//             <input type="date" value={searchQuery6} onChange={(e) => handleSearchChange(e, 'fromdate')} />
//             <span style={{ color: 'black', fontSize: '13px', fontWeight: 'bold' }}> To </span>
//             <input type="date" value={searchQuery7} onChange={(e) => handleSearchChange(e, 'todate')} />
//           </div>
//         )}
//       </div>

//       <div className="grid_1">
//         {loading && (
//           <div style={{ textAlign: 'center', padding: '8px', color: 'var(--ProjectColor)', fontWeight: 'bold' }}>
//             Loading…
//           </div>
//         )}
//         <ReactGrid columns={dynamicColumns} RowData={filteredRows} hidePagination={true} className="data_grid" />
//         <div className="pagination-controls">
//           <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0} className="pagination-button">
//             <ArrowBackIosNewIcon />
//           </button>
//           Page {page + 1} of {totalPages || 1}
//           <button onClick={() => setPage(p => p + 1 < totalPages ? p + 1 : p)} disabled={page + 1 >= totalPages} className="pagination-button">
//             <ArrowForwardIosIcon />
//           </button>
//         </div>
//       </div>

//       {openModal && (
//         <div className={isSidebarOpen ? 'sideopen_showcamera_profile' : 'showcamera_profile'} onClick={() => setOpenModal(false)}>
//           <div className="newwProfiles newwPopupforreason uwagduaguleaveauto" onClick={(e) => e.stopPropagation()}>
//             <br />
//             <div className="appointment">
//               <div className="h_head"><h4>Tests</h4></div>
//               <div className="Main_container_app">
//                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                   <thead>
//                     <tr>
//                       <th style={{ border: '1px solid #ddd', padding: '8px', width: '70px' }}>S.No</th>
//                       <th style={{ border: '1px solid #ddd', padding: '8px', width: '250px' }}>Test Name</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {viewtest.map((test) => (
//                       <React.Fragment key={test.id}>
//                         <tr>
//                           <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{test.id + 1}</td>
//                           <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', alignItems: 'center' }}>
//                             <span>{test.testname || 'Unnamed Test'}</span>
//                             {test.subTests.length > 0 && (
//                               <Button onClick={() => toggleSubTests(test.id)} sx={{ minWidth: '30px', padding: '0', marginLeft: '8px' }}>
//                                 {expandedTest === test.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                               </Button>
//                             )}
//                           </td>
//                         </tr>
//                         {expandedTest === test.id && test.subTests.map((subTest, idx) => (
//                           <tr key={idx}>
//                             <td style={{ border: '1px solid #ddd', padding: '8px' }}></td>
//                             <td style={{ border: '1px solid #ddd', padding: '8px', paddingLeft: '28px' }}>{subTest.test_name}</td>
//                           </tr>
//                         ))}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             <div className="Register_btn_con">
//               <button className="RegisterForm_1_btns" onClick={() => setOpenModal(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Patienttestlist;
