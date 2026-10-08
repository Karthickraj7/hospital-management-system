import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import './NewRoomAvail.css';

const PatientProfileFromBed = () => {
  const [selectedMenu, setSelectedMenu] = useState('Vitals');
  const [patientDetails, setPatientDetails] = useState(null);
  const [admissionDetails, setAdmissionDetails] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [gridData, setGridData] = useState([]);
  const [allergyData, setAllergyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAllergyModal, setOpenAllergyModal] = useState(false);
  const [showFlaggingTooltip, setShowFlaggingTooltip] = useState(false);

  const [intakeDetailsData, setIntakeDetailsData] = useState([]);
  const [outputDetailsData, setOutputDetailsData] = useState([]);
  const [balanceDetailsData, setBalanceDetailsData] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientData = useSelector((state) => state.userRecord?.PatientProfileData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
console.log("IP_DoctorWorkbenchNavigation AllDatas:",IP_DoctorWorkbenchNavigation);

  const menuItems = [
    'Vitals', 'Allergy', 'Assessment', 'Input Output Chart', 'ProgressNote',
    'Request', 'DrugAdministration', 'IPM', 'IP_ConsentForms',
    'IP_NursePreoperativeChecklist', 'IP_NursePreOPins', 'Surgical History',
    'MLC', 'Discharge',
  ];

  useEffect(() => {
    if (!IP_DoctorWorkbenchNavigation || Object.keys(IP_DoctorWorkbenchNavigation).length === 0) {
      navigate('/Home/IP_NurseQuelist');
    }
  }, [IP_DoctorWorkbenchNavigation, navigate]);

  useEffect(() => {
    console.log('Redux state:', { IP_DoctorWorkbenchNavigation, UrlLink });
  }, [IP_DoctorWorkbenchNavigation, UrlLink]);

  useEffect(() => {
    if (patientData) setPatientDetails(patientData);
    return () => dispatch({ type: 'PatientProfileData', value: null });
  }, [patientData, dispatch]);

  // Admissions
  useEffect(() => {
    const registrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    if (registrationId && registrationId !== 'N/A' && UrlLink) {
      const fetchSupplementaryData = async () => {
        try {
          const admissionRes = await axios.get(`${UrlLink}Frontoffice/get_AdmissionDetails`, {
            params: { RegistrationId: registrationId },
          });
          setAdmissionDetails(Array.isArray(admissionRes.data) ? admissionRes.data : []);

          const roomRes = await axios.get(
            `${UrlLink}Frontoffice/get_ip_roomdetials_for_bedtransfer_details?RegistrationId=${registrationId}`
          );
          setRoomDetails(roomRes.data);

          const allergyRes = await axios.get(`${UrlLink}Ip_Workbench/IP_Allergy_Details_Link`, {
            params: {
              RegistrationId: registrationId,
              DepartmentType: IP_DoctorWorkbenchNavigation?.RequestType || 'Nurse',
            },
          });
          setAllergyData(Array.isArray(allergyRes.data) ? allergyRes.data : []);
          setError(null);
        } catch (err) {
          console.error('Error fetching supplementary data:', err);
          setError('Failed to fetch supplementary data');
        }
      };
      fetchSupplementaryData();
    }
  }, [IP_DoctorWorkbenchNavigation, UrlLink]);

  // Vitals
  useEffect(() => {
    if (selectedMenu !== 'Vitals') return;

    const patientId = IP_DoctorWorkbenchNavigation?.PatientId;
    const departmentType = 'IP';
    if (!patientId || !UrlLink) {
      setError('Missing required parameters');
      setLoading(false);
      return;
    }

    const fetchVitalData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${UrlLink}Ip_Workbench/IP_Vitals_By_PatientId`, {
          params: { PatientId: patientId, DepartmentType: departmentType, Type: 'Nurse' },
        });
        const vitalData = res.data.vital_details || [];
        const formattedData = vitalData.map((vital) => ({
          id: vital.id || 'N/A',
          Date: vital.Date || '',
          Time: vital.Time || '',
          Temperature: vital.Temperature || '',
          PulseRate: vital.Pulse_Rate || '',
          SPO2: vital.SPO2 || '',
          HeartRate: vital.Heart_Rate || '',
          RespiratoryRate: vital.Respiratory_Rate || '',
          SBP: vital.SBP || '',
          DBP: vital.DBP || '',
          Height: vital.Height || '',
          Weight: vital.Weight || '',
          BMI: vital.BMI || '',
          WC: vital.WC || '',
          HC: vital.HC || '',
          BSL: vital.BSL || '',
          Painscore: vital.Painscore || '',
          temperature_status: vital.Temperature_Status || null,
          pulserate_status: vital.Pulse_Rate_Status || null,
          spo2_status: vital.SPO2_Status || null,
          heartrate_status: vital.Heart_Rate_Status || null,
          respiratoryrate_status: vital.Respiratory_Status || null,
          sbp_status: vital.SBP_Status || null,
          dbp_status: vital.DBP_Status || null,
        }));
        setGridData(formattedData);
        setError(vitalData.length === 0 ? 'No vital signs recorded' : null);
      } catch (err) {
        setError(`Failed to fetch vital signs: ${err.message}`);
        setGridData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVitalData();
  }, [UrlLink, IP_DoctorWorkbenchNavigation, selectedMenu]);


  // Allergy
useEffect(() => {
    if (selectedMenu !== 'Allergy') return;
    const patientId = IP_DoctorWorkbenchNavigation?.PatientId;
    const departmentType = 'IP';
    if (!patientId || !UrlLink) {
      setError('Missing required parameters');
      return;
    }

    setLoading(true);
    axios
      .get(`${UrlLink}Ip_Workbench/IP_Allergy_By_PatientId`, {
        params: { PatientId: patientId, DepartmentType: departmentType },
      })
      .then((res) => {
        const allergyGridData = Array.isArray(res.data.allergy_details) ? res.data.allergy_details : [];
        setGridData(allergyGridData);
        setError(allergyGridData.length === 0 ? 'No allergy data available' : null);
      })
      .catch((err) => {
        setError(`Failed to fetch allergies: ${err.message}`);
      })
      .finally(() => setLoading(false));
}, [UrlLink, IP_DoctorWorkbenchNavigation, selectedMenu]);

  // Input Output Chart
  useEffect(() => {
    if (selectedMenu !== 'Input Output Chart') return;

    const registrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    console.log('IP_IO_Balance_Details_Get params:', {
      RegistrationId: registrationId,
      DepartmentType: departmentType,
    });

    if (!registrationId || !UrlLink) {
      setError('Missing required parameters for Input/Output Chart');
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${UrlLink}Ip_Workbench/IP_IO_Balance_Details_Get`, {
        params: {
          RegistrationId: registrationId,
          DepartmentType: departmentType,
        },
      })
      .then((res) => {
        const { intake_details, output_details, balance_details } = res.data;
        console.log('IP_IO_Balance_Details_Get Response:', res.data);

        setIntakeDetailsData(intake_details || []);
        setOutputDetailsData(output_details || []);
        setBalanceDetailsData(balance_details || []);
        setError(null);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
        console.error('Error fetching Input/Output data:', errorMessage);
        setError(`Failed to fetch Input/Output data: ${errorMessage}`);
        setIntakeDetailsData([]);
        setOutputDetailsData([]);
        setBalanceDetailsData([]);
      })
      .finally(() => setLoading(false));
  }, [UrlLink, IP_DoctorWorkbenchNavigation, selectedMenu]);

  // Progress Notes
  useEffect(() => {
    if (selectedMenu !== 'ProgressNote') return;

    const registrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    console.log(registrationId,'registrationId');
    console.log(departmentType,'departmentType');


    if (!registrationId || !UrlLink) {
      setError('Missing required parameters for Progress Notes');
      setLoading(false);
      return;
    }

    const fetchProgressNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${UrlLink}Ip_Workbench/IP_ProgressNotes_Details_Link`, {
          params: {
            RegistrationId: registrationId,
            DepartmentType: departmentType,
            // Type: 'Nurse',
          },
        });
        const progressNotesData = res.data || [];
        console.log("progressNotesData:",progressNotesData);
        
        setGridData(progressNotesData);
        setError(progressNotesData.length === 0 ? 'No progress notes recorded' : null);
      } catch (err) {
        setError(`Failed to fetch progress notes: ${err.message}`);
        setGridData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProgressNotes();
  }, [UrlLink, IP_DoctorWorkbenchNavigation, selectedMenu]);

  const vitalFields = {
    Temperature: { unit: '°F', label: 'Temperature' },
    PulseRate: { unit: 'bpm', label: 'Pulse Rate' },
    SPO2: { unit: '%', label: 'SpO2' },
    HeartRate: { unit: 'bpm', label: 'Heart Rate' },
    RespiratoryRate: { unit: 'breaths/min', label: 'Respiratory Rate' },
    SBP: { unit: 'mmHg', label: 'Systolic BP' },
    DBP: { unit: 'mmHg', label: 'Diastolic BP' },
    Height: { unit: 'cm', label: 'Height' },
    Weight: { unit: 'kg', label: 'Weight' },
    BMI: { unit: 'kg/m²', label: 'BMI' },
    WC: { unit: 'cm', label: 'Waist Circumference' },
    HC: { unit: 'cm', label: 'Hip Circumference' },
    BSL: { unit: 'mg/dL', label: 'Blood Sugar Level' },
    Painscore: { unit: '', label: 'Pain Score' },
  };

  const getInitials = (name) => {
    if (!name || name === 'N/A') return 'N/A';
    const names = name.trim().split(' ').filter(Boolean);
    return names.length > 1 ? names[0][0] + names[1][0] : names[0][0] || 'N/A';
  };

  const Vitals = () => (
    <div className="vitals-container">
      <div className="vitals-header">
        <h2 className="vitals-title">Patient Vital Signs</h2>
        <div className="vitals-gradient" />
      </div>
      <div className="vitals-content">
        {loading ? (
          <div className="loading-animation">
            <div className="spinner" />Loading...
          </div>
        ) : error ? (
          <div className="error-display">
            <span className="error-icon">⚠️</span>{error}
          </div>
        ) : gridData.length > 0 ? (
          <div className="vitals-cards">
            {gridData.map((vital) => (
              <div key={vital.id} className="vital-card">
                <div className="vital-card-header">
                  <span className="record-id">Record #{vital.id}</span>
                  <span className="record-timestamp">
                    {vital.Date && vital.Time ? `${vital.Date} ${vital.Time}` : 'N/A'}
                  </span>
                </div>
                <div className="vital-card-body">
                  {Object.entries(vitalFields).map(([field, { unit, label }]) => (
                    vital[field] &&
                    vital[field] !== '' && (
                      <div key={field} className="vital-item">
                        <span className="vital-label">{label}</span>
                        <div className="vital-value-wrapper">
                          <span className="vital-value">
                            {vital[field]}
                            <span className="vital-unit">{unit}</span>
                          </span>
                          {vital[`${field.toLowerCase()}_status`] !== null && (
                            <span className="vital-status">
                              {vital[`${field.toLowerCase()}_status`] === 0
                                ? 'Normal'
                                : vital[`${field.toLowerCase()}_status`] === 1
                                ? 'Abnormal'
                                : vital[`${field.toLowerCase()}_status`] === 2
                                ? 'Warning'
                                : 'Critical'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no_data_mugesh">No vital signs available.</div>
        )}
      </div>
    </div>
  );

  const Allergy = () => (
    <div className="allergy-container">
      <div className="allergy-header">
        <h2 className="allergy-title">Patient Allergies</h2>
        <div className="allergy-gradient" />
      </div>
      <div className="allergy-content">
        {loading ? (
          <div className="loading-animation">
            <div className="spinner" />Loading...
          </div>
        ) : error ? (
          <div className="error-display">
            <span className="error-icon">⚠️</span>{error}
          </div>
        ) : gridData.length > 0 ? (
          <div className="allergy-cards">
            {gridData.map((allergy) => (
              <div key={allergy.id} className="allergy-card">
                <div className="allergy-card-header">
                  <span className="record-id">Record #{allergy.id}</span>
                  <span className="record-timestamp">
                    {allergy.Date && allergy.Time ? `${allergy.Date} ${allergy.Time}` : 'N/A'}
                  </span>
                </div>
                <div className="allergy-card-body">
                  <div className="allergy-item">
                    <span className="allergy-label">Doctor Name</span>
                    <span className="allergy-value">{allergy.PrimaryDoctorName || 'N/A'}</span>
                  </div>
                  <div className="allergy-item">
                    <span className="allergy-label">Allergy Type</span>
                    <span className="allergy-value">{allergy.AllergyType || 'N/A'}</span>
                  </div>
                  <div className="allergy-item">
                    <span className="allergy-label">Allergent</span>
                    <span className="allergy-value">{allergy.Allergent || 'N/A'}</span>
                  </div>
                  <div className="allergy-item">
                    <span className="allergy-label">Reaction</span>
                    <span className="allergy-value">{allergy.Reaction || 'N/A'}</span>
                  </div>
                  <div className="allergy-item">
                    <span className="allergy-label">Remarks</span>
                    <span className="allergy-value">{allergy.Remarks || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no_data_mugesh">No allergies available.</div>
        )}
      </div>
    </div>
  );

  const AllergyModal = () => (
    <div className="modal" onClick={() => setOpenAllergyModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setOpenAllergyModal(false)}>
          ×
        </button>
        <h3>Allergies</h3>
        <p>{allergyData?.map((a) => a.Allergent).join(', ') || 'No allergies recorded'}</p>
      </div>
    </div>
  );

  const Input_Output_Chart = () => {
    const processedIntakeData = intakeDetailsData?.length
      ? intakeDetailsData.map((row, index) => ({
          ...row,
          id: index + 1,
          DateTime: `${row.Date || ''} ${row.Time || ''}`.trim() || 'N/A',
          Measurement: `${row.Measurement1 || ''} ${row.MeasurementType1 || ''}`.trim() || 'N/A',
        }))
      : [];

    const processedOutputData = outputDetailsData?.length
      ? outputDetailsData.map((row, index) => ({
          ...row,
          id: index + 1,
          DateTime: `${row.Date || ''} ${row.Time || ''}`.trim() || 'N/A',
          Measurement: `${row.Measurement2 || ''} ${row.MeasurementType2 || ''}`.trim() || 'N/A',
        }))
      : [];

    const processedBalanceData = balanceDetailsData?.length
      ? balanceDetailsData.map((row, index) => ({
          ...row,
          id: index + 1,
          DateTime: `${row.Date || ''} ${row.Time || ''}`.trim() || 'N/A',
        }))
      : [];

    const tableContainerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '10px',
      marginTop: '20px',
      flexWrap: 'wrap',
    };

    const tableWrapperStyle = {
      flex: '1',
      minWidth: '400px',
      maxHeight: '400px',
      overflowY: 'auto',
    };

    const tableStyle = {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px',
    };

    const thStyle = {
      backgroundColor: '#f2f2f2',
      padding: '8px',
      border: '1px solid #ddd',
      textAlign: 'left',
      position: 'sticky',
      top: 0,
      whiteSpace: 'nowrap',
      zIndex: 1,
    };

    const tdStyle = {
      padding: '6px',
      border: '1px solid #ddd',
      textAlign: 'left',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '150px',
    };

    const handleViewChart = (row) => {
      console.log('Viewing chart for:', row);
      // Add your chart viewing logic here
    };

    return (
      <div className="io-chart-container">
        <h2 className="chart-title">Input/Output Balance Dashboard</h2>
        <div style={tableContainerStyle}>
          {loading ? (
            <div className="loading-animation" style={{ width: '100%', textAlign: 'center' }}>
              <div className="spinner" />Loading...
            </div>
          ) : error ? (
            <div className="error-display" style={{ width: '100%', textAlign: 'center' }}>
              <span className="error-icon">⚠️</span>{error}
            </div>
          ) : !processedIntakeData.length && !processedOutputData.length && !processedBalanceData.length ? (
            <div className="no_data_mugesh" style={{ width: '100%', textAlign: 'center' }}>
              No input/output data available.
            </div>
          ) : (
            <>
              {processedIntakeData.length > 0 && (
                <div style={tableWrapperStyle}>
                  <h3>Intake Details</h3>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>S.No</th>
                        <th style={thStyle}>Date & Time</th>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>Mode</th>
                        <th style={thStyle}>Measurement</th>
                        <th style={thStyle}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedIntakeData.map((row) => (
                        <tr key={row.id}>
                          <td style={tdStyle}>{row.id}</td>
                          <td style={tdStyle}>{row.DateTime}</td>
                          <td style={tdStyle}>{row.IntakeType || 'N/A'}</td>
                          <td style={tdStyle}>{row.IntakeMode || 'N/A'}</td>
                          <td style={tdStyle}>{row.Measurement}</td>
                          <td style={tdStyle}>{row.Duration || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {processedOutputData.length > 0 && (
                <div style={tableWrapperStyle}>
                  <h3>Output Details</h3>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>S.No</th>
                        <th style={thStyle}>Date & Time</th>
                        <th style={thStyle}>Output Type</th>
                        <th style={thStyle}>Measurement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedOutputData.map((row) => (
                        <tr key={row.id}>
                          <td style={tdStyle}>{row.id}</td>
                          <td style={tdStyle}>{row.DateTime}</td>
                          <td style={tdStyle}>{row.OutputType || 'N/A'}</td>
                          <td style={tdStyle}>{row.Measurement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {processedBalanceData.length > 0 && (
                <div style={tableWrapperStyle}>
                  <h3>Balance Details</h3>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>S.No</th>
                        <th style={thStyle}>Date & Time</th>
                        <th style={thStyle}>Doctor</th>
                        <th style={thStyle}>Input</th>
                        <th style={thStyle}>Output</th>
                        <th style={thStyle}>Balance</th>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedBalanceData.map((row) => (
                        <tr key={row.id}>
                          <td style={tdStyle}>{row.id}</td>
                          <td style={tdStyle}>{row.DateTime}</td>
                          <td style={tdStyle}>{row.PrimaryDoctorName || 'N/A'}</td>
                          <td style={tdStyle}>{row.totalInputDay || '0'}</td>
                          <td style={tdStyle}>{row.totalOutputDay || '0'}</td>
                          <td style={tdStyle}>{row.balance || '0'}</td>
                          <td style={tdStyle}>{row.balanceType || 'N/A'}</td>
                          <td style={tdStyle}>
                            <VisibilityIcon
                              style={{ cursor: 'pointer', color: '#1976d2' }}
                              onClick={() => handleViewChart(row)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const ProgressNote = () => {
    const tableStyle = {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px',
      marginTop: '20px',
    };

    const thStyle = {
      backgroundColor: '#f2f2f2',
      padding: '8px',
      border: '1px solid #ddd',
      textAlign: 'left',
      position: 'sticky',
      top: 0,
      whiteSpace: 'nowrap',
      zIndex: 1,
    };

    const tdStyle = {
      padding: '6px',
      border: '1px solid #ddd',
      textAlign: 'left',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '150px',
    };

    const buttonStyle = {
      padding: '5px 10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    };

    const handleViewDetails = (row) => {
      console.log('Viewing details for:', row);
      // Add logic to view more details if needed (e.g., open a modal)
    };

    return (
      <div className="progress-note-container">
        <div className="progress-note-header">
          <h2 className="progress-note-title">Progress Notes</h2>
          <div className="progress-note-gradient" />
        </div>
        <div className="progress-note-content">
          {loading ? (
            <div className="loading-animation">
              <div className="spinner" />Loading...
            </div>
          ) : error ? (
            <div className="error-display">
              <span className="error-icon">⚠️</span>{error}
            </div>
          ) : gridData.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>ProgressNotes</th>
                  <th style={thStyle}>TreatmentNotes</th>
                  <th style={thStyle}>Remarks</th>
                  <th style={thStyle}>AdverseEvents</th>
                  <th style={thStyle}>Color Flag</th>
                  <th style={thStyle}>View</th>
                </tr>
              </thead>
              <tbody>
                {gridData.map((row, index) => (
                  <tr key={row.id || index}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{row.Date || 'N/A'}</td>
                    <td style={tdStyle}>{row.Time || 'N/A'}</td>
                    <td style={tdStyle}>{row.Type || 'N/A'}</td>
                    <td style={tdStyle}>{row.ProgressNotes || 'N/A'}</td>
                    <td style={tdStyle}>{row.TreatmentNotes || 'N/A'}</td>
                    <td style={tdStyle}>{row.Remarks || 'N/A'}</td>
                    <td style={tdStyle}>{row.AdverseEvents || 'N/A'}</td>
                    <td style={tdStyle}>{row.colorFlag || 'N/A'}</td>
                    <td style={tdStyle}>
                      <button style={buttonStyle} onClick={() => handleViewDetails(row)}>
                        Closed
                      </button>
                      <VisibilityIcon
                        style={{ marginLeft: '10px', cursor: 'pointer', color: '#1976d2' }}
                        onClick={() => handleViewDetails(row)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no_data_mugesh">No progress notes available.</div>
          )}
        </div>
      </div>
    );
  };

  const PlaceholderComponent = ({ title, message }) => (
    <div className="placeholder-container">
      <h2 className="vitals-title">{title}</h2>
      <div className="vitals-gradient" />
      <div className="no_data_mugesh">{message}</div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'Vitals':
        return <Vitals />;
      case 'Allergy':
        return <Allergy />;
      case 'Assessment':
        return <PlaceholderComponent title="Patient Assessment" message="No assessment data available." />;
      case 'Input Output Chart':
        return <Input_Output_Chart />;

      case 'ProgressNote':
        return <ProgressNote />;

      case 'Request':
        return <PlaceholderComponent title="Patient Requests" message="No requests available." />;
      case 'DrugAdministration':
        return <PlaceholderComponent title="Drug Administration" message="No records available." />;
      case 'IPM':
        return <PlaceholderComponent title="IPM" message="No IPM data available." />;
      case 'IP_ConsentForms':
        return <PlaceholderComponent title="IP Consent Forms" message="No consent forms available." />;
      case 'IP_NursePreoperativeChecklist':
        return <PlaceholderComponent title="IP Nurse Preoperative Checklist" message="No checklist available." />;
      case 'IP_NursePreOPins':
        return <PlaceholderComponent title="IP Nurse PreOP Instructions" message="No instructions available." />;
      case 'Surgical History':
        return <PlaceholderComponent title="Surgical History" message="No surgical history available." />;
      case 'MLC':
        return <PlaceholderComponent title="MLC" message="No MLC data available." />;
      case 'Discharge':
        return <PlaceholderComponent title="Discharge Information" message="No discharge information available." />;
      default:
        return <Vitals />;
    }
  };

  return (
    <div className="Main_container_app">
      <h3 style={{ margin: '20px 0', color: '#2c3e50' }}>Patient Data</h3>
      <div className="Patent_profile_left_profileContiner">
        <div style={{ width: '65%', display: 'flex', justifyContent: 'center' }}>
          <div className="Patent_profile_left_profileContiner_img">
            {/* Profile image placeholder */}
          </div>
        </div>
        <div className="Patent_profile_left_profileContiner_data">
          <div className="RegisFormcon_1">
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="PatientID">Patient ID <span>:</span></label>
              <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                {IP_DoctorWorkbenchNavigation?.PatientId || patientDetails?.PatientId || 'N/A'}
              </span>
            </div>
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="PatientName">Patient Name <span>:</span></label>
              <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                {IP_DoctorWorkbenchNavigation?.PatientName || patientDetails?.PatientName || 'N/A'}
              </span>
            </div>
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="AgeGender">Age / Gender <span>:</span></label>
              <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                {IP_DoctorWorkbenchNavigation?.Age || patientDetails?.Age || 'N/A'} /{' '}
                {IP_DoctorWorkbenchNavigation?.Gender || patientDetails?.Gender || 'N/A'}
              </span>
            </div>
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="BloodGroup">Blood Group <span>:</span></label>
              <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                {IP_DoctorWorkbenchNavigation?.BloodGroup || patientDetails?.BloodGroup || 'N/A'}
              </span>
            </div>
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="RegistrationIdBedNo">IP No / Bed No <span>:</span></label>
              <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                {IP_DoctorWorkbenchNavigation?.RegistrationId || patientDetails?.RegistrationId || 'N/A'} /{' '}
                {IP_DoctorWorkbenchNavigation?.BedNo || patientDetails?.BedNo || 'N/A'}
              </span>
            </div>
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="DoctorName">Doctor Name <span>:</span></label>
              <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                {IP_DoctorWorkbenchNavigation?.DoctorName || patientDetails?.DoctorName || 'N/A'}
              </span>
            </div>
            {admissionDetails.length > 0 && (
              <div className="RegisForm_1 dctr_wrbvh_pice666">
                <label htmlFor="AdmissionPurpose">POA <span>:</span></label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                  {admissionDetails[0]?.AdmissionPurpose || IP_DoctorWorkbenchNavigation?.AdmissionPurpose || 'N/A'}
                </span>
              </div>
            )}
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="AdmitDate">DOA <span>:</span></label>
              <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                {IP_DoctorWorkbenchNavigation?.Admitdate || patientDetails?.AdmitDate || 'N/A'}
              </span>
            </div>
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="PatientCategory">Patient Category <span>:</span></label>
              <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                {IP_DoctorWorkbenchNavigation?.PatientCategory || patientDetails?.PatientCategory || 'N/A'}
              </span>
            </div>
            {['Insurance', 'Client'].includes(IP_DoctorWorkbenchNavigation?.PatientCategory) && (
              <div className="RegisForm_1 dctr_wrbvh_pice666">
                <label htmlFor="InsuranceNameClientName">
                  {IP_DoctorWorkbenchNavigation?.PatientCategory === 'Insurance' ? 'Insurance Name' : 'Client Name'}{' '}
                  <span>:</span>
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                  {IP_DoctorWorkbenchNavigation?.PatientCategoryName ||
                    patientDetails?.PatientCategoryName ||
                    'N/A'}
                </span>
              </div>
            )}
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="IsMLC">MLC <span>:</span></label>
              <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66">
                {IP_DoctorWorkbenchNavigation?.IsMLC || patientDetails?.IsMLC || 'N/A'}
              </span>
            </div>
            {allergyData.length > 0 && (
              <div className="RegisForm_1 dctr_wrbvh_pice666">
                <label htmlFor="Allergies">Allergies <span>:</span></label>
                <button
                  onClick={() => setOpenAllergyModal(true)}
                  style={{ marginLeft: '5px', padding: '2px 8px' }}
                >
                  View
                </button>
              </div>
            )}
            <div className="RegisForm_1 dctr_wrbvh_pice666">
              <label htmlFor="Flagging">Flagging <span>:</span></label>
              <span
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  backgroundColor: IP_DoctorWorkbenchNavigation?.FlaggingColour || 'green',
                  marginLeft: '5px',
                  position: 'relative',
                }}
                onMouseEnter={() => setShowFlaggingTooltip(true)}
                onMouseLeave={() => setShowFlaggingTooltip(false)}
              >
                {showFlaggingTooltip && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-25px',
                      left: '0',
                      background: 'rgba(0,0,0,0.8)',
                      color: '#fff',
                      padding: '2px 5px',
                      borderRadius: '3px',
                    }}
                  >
                    {IP_DoctorWorkbenchNavigation?.Flagging || 'No flagging data'}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {openAllergyModal && <AllergyModal />}

      <div className="Patient_Profile_Continer">
        <div className="Patent_profile_left">
          <div className="Patent_profile_left_menu">
            {menuItems.map((menuItem) => (
              <span
                key={menuItem}
                className={`menu-item ${selectedMenu === menuItem ? 'active' : ''}`}
                onClick={() => setSelectedMenu(menuItem)}
              >
                {menuItem}
                <ArrowForwardIosIcon style={{ fontSize: '12px', marginLeft: '5px' }} />
              </span>
            ))}
          </div>
        </div>
        <div className="Patent_profile_center">{renderContent()}</div>
        <div className="Patent_profile_right">Patient profile right</div>
      </div>
    </div>
  );
};

export default PatientProfileFromBed;