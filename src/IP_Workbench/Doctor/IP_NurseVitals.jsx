import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { IconButton, Button } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

const IP_Vitals = () => {
  const dispatch = useDispatch();
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);
  const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [openChart, setOpenChart] = useState(false);
  const [Type, setType] = useState("Vital");
  const [gridData, setGridData] = useState([]);
  const [newVitalData, setNewVitalData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [IsGetData, setIsGetData] = useState(false);
  const [chartRendered, setChartRendered] = useState(false);

  const chartInstanceRef = useRef(null);

  // Define color styles and status labels based on the chart
  const colorStyles = {
    Normal: "green",
    BelowNormal: "orange",
    AboveNormal: "yellow",
    Panic: "red",
  };

  const statusLabels = {
    0: "Normal",
    1: "Below Normal",
    2: "Above Normal",
    3: "Panic",
  };

  const getColorByStatus = (status) => {
    if (status === 0) return colorStyles.Normal;
    if (status === 1) return colorStyles.BelowNormal;
    if (status === 2) return colorStyles.AboveNormal;
    if (status === 3) return colorStyles.Panic;
    return "";
  };

  const renderColorBox = (status) => {
    if (!status) return null;
    return (
      <div
        style={{
          width: '90px',
          height: '40px',
          backgroundColor: colorStyles[status],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#fff',
        }}
      >
        {status}
      </div>
    );
  };

  // Placeholder for Pulse Rate status (since not in chart)
  const getPulseRateStatus = (pulseRate) => {
    const value = parseFloat(pulseRate);
    if (isNaN(value)) return 0;
    if (value >= 60 && value <= 100) return 0; // Normal
    if (value < 60) return 1; // Below Normal
    if (value > 100 && value <= 120) return 2; // Above Normal
    if (value > 120) return 3; // Panic
    return 0;
  };

  // Pain Score status (custom range)
  const getPainScoreStatus = (painScore) => {
    const value = parseFloat(painScore);
    if (isNaN(value)) return 0;
    if (value >= 0 && value <= 3) return 0; // Normal
    if (value >= 4 && value <= 5) return 1; // Below Normal
    if (value >= 6 && value <= 7) return 2; // Above Normal
    if (value >= 8 && value <= 10) return 3; // Panic
    return 0;
  };

  // Fetch existing vital data
  useEffect(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (RegistrationId && DepartmentType) {
      axios.get(`${UrlLink}Ip_Workbench/IP_Vitals_Form_Details_Link`, {
        params: {
          RegistrationId: RegistrationId,
          DepartmentType: DepartmentType,
          Type: 'Nurse'
        }
      })
        .then((res) => {
          const data = res.data;
          if (data && Array.isArray(data.vital_details)) {
            // Map Painscore to PainScore for consistency
            const mappedData = data.vital_details.map((item) => ({
              ...item,
              PainScore: item.Painscore || item.PainScore,
            }));
            setGridData(mappedData);
          } else if (data.error) {
            dispatch({
              type: "toast",
              value: { message: data.error, type: "error" },
            });
            setGridData([]);
          } else {
            dispatch({
              type: "toast",
              value: { message: "Unexpected response from server", type: "error" },
            });
            setGridData([]);
          }
        })
        .catch((err) => {
          const errorMessage = err.response?.data?.error || "Failed to fetch vital details";
          dispatch({
            type: "toast",
            value: { message: errorMessage, type: "error" },
          });
          setGridData([]);
        });
    } else {
      dispatch({
        type: "toast",
        value: { message: "Registration ID or Department Type is missing", type: "error" },
      });
      setGridData([]);
    }
  }, [UrlLink, IP_DoctorWorkbenchNavigation, IsGetData]);

  // Function to get current date and time in the format DD-MM-YY HH:MM
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getFullYear()).slice(-2)}`;
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return { date, time };
  };

  // Add a new blank column to the table
  const handleAddVitals = () => {
    const { date, time } = getCurrentDateTime();
    const newColumn = {
      Date: date,
      Time: time,
      Temperature: '',
      PulseRate: '',
      SPO2: '',
      HeartRate: '',
      RespiratoryRate: '',
      SBP: '',
      DBP: '',
      Height: '',
      Weight: '',
      BMI: '',
      PainScore: '',
      isNew: true
    };
    setNewVitalData([...newVitalData, newColumn]);
    setIsEditing(true);
  };

  // Handle input change in the table
  const handleInputChange = (index, field, value) => {
    const updatedData = [...newVitalData];

    // Allow empty input or partial numeric input for all fields
    if (value === '' || value === '.') {
      updatedData[index][field] = value;
      setNewVitalData(updatedData);
      return;
    }

    // Validate numeric fields (except Temperature)
    if (['PulseRate', 'SPO2', 'HeartRate', 'RespiratoryRate', 'SBP', 'DBP', 'Height', 'Weight', 'BMI'].includes(field)) {
      // Check if the input is a valid number or partial number (e.g., "98.", "90")
      if (!/^\d*\.?\d*$/.test(value)) {
        dispatch({
          type: "toast",
          value: { message: `${field} must be a valid number`, type: "error" },
        });
        return;
      }

      // Validate range for complete numbers (not partial inputs like "9" or "98.")
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        if (['PulseRate', 'SPO2', 'HeartRate', 'RespiratoryRate', 'SBP', 'DBP', 'Height', 'Weight'].includes(field) && !/^\d{0,3}(\.\d{0,1})?$/.test(value)) {
          dispatch({
            type: "toast",
            value: { message: "Only numbers up to 3 digits with one decimal place are allowed.", type: "warn" },
          });
          return;
        }
      }
    }

    // Validate PainScore
    if (field === 'PainScore') {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue) && (parsedValue < 0 || parsedValue > 10)) {
        dispatch({
          type: "toast",
          value: { message: "Pain Score must be between 0 and 10", type: "error" },
        });
        return;
      }
      if (value && !/^\d{0,2}$/.test(value)) {
        dispatch({
          type: "toast",
          value: { message: "Pain Score must be a valid number between 0 and 10", type: "error" },
        });
        return;
      }
    }

    // No range validation for Temperature during input
    if (field === 'Temperature') {
      // Only check if the input is a valid number or partial number
      if (!/^\d*\.?\d*$/.test(value)) {
        dispatch({
          type: "toast",
          value: { message: "Temperature must be a valid number", type: "error" },
        });
        return;
      }
    }

    updatedData[index][field] = value;

    // Recalculate BMI if Height or Weight changes
    if (field === 'Height' || field === 'Weight') {
      const height = parseFloat(updatedData[index].Height) / 100;
      const weight = parseFloat(updatedData[index].Weight);
      if (height && weight) {
        updatedData[index].BMI = (weight / (height * height)).toFixed(2);
      } else {
        updatedData[index].BMI = '';
      }
    }

    setNewVitalData(updatedData);
  };

  // Save the new vital data
  const handleSave = () => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (!RegistrationId || !DepartmentType) {
      dispatch({ type: 'toast', value: { message: 'Registration ID or Department Type is missing', type: 'error' } });
      return;
    }

    // Validate all fields before saving
    for (const vital of newVitalData) {
      if (vital.Temperature) {
        const temp = parseFloat(vital.Temperature);
        if (isNaN(temp) || temp < 90 || temp > 110) {
          dispatch({
            type: 'toast',
            value: { message: 'Temperature must be a valid number between 90°F and 110°F', type: 'error' },
          });
          return;
        }
      }
      if (vital.PainScore) {
        const painScore = parseFloat(vital.PainScore);
        if (isNaN(painScore) || painScore < 0 || painScore > 10) {
          dispatch({
            type: 'toast',
            value: { message: 'Pain Score must be a valid number between 0 and 10', type: 'error' },
          });
          return;
        }
      }
      // Add similar validations for other numeric fields if needed
    }

    const formattedData = newVitalData.map(vital => ({
      Temperature: vital.Temperature || null,
      PulseRate: vital.PulseRate || null,
      SPO2: vital.SPO2 || null,
      HeartRate: vital.HeartRate || null,
      RespiratoryRate: vital.RespiratoryRate || null,
      SBP: vital.SBP || null,
      DBP: vital.DBP || null,
      Height: vital.Height || null,
      Weight: vital.Weight || null,
      BMI: vital.BMI || null,
      Painscore: vital.PainScore || null,
      RegistrationId,
      DepartmentType,
      Createdby: userRecord?.username,
      Type: 'Nurse',
      Date: vital.Date,
      Time: vital.Time
    }));

    axios.post(`${UrlLink}Ip_Workbench/IP_Vitals_Form_Details_Link`, formattedData[0])
      .then((res) => {
        const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
        dispatch({ type: 'toast', value: { message, type } });
        setNewVitalData([]);
        setIsEditing(false);
        setIsGetData(prev => !prev);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.error || "Failed to save vitals";
        dispatch({ type: 'toast', value: { message: errorMessage, type: 'error' } });
      });
  };

  // Cancel editing
  const handleCancel = () => {
    setNewVitalData([]);
    setIsEditing(false);
  };

  const ChartView = useCallback(() => {
    setChartRendered(false);
    setOpenChart(true);
  }, []);

  const renderChart = useCallback(() => {
    const ctx = document.getElementById('tempChart')?.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found for tempChart');
      setChartRendered(false);
      return;
    }

    const validData = gridData.filter(entry =>
      entry.Temperature !== null && !isNaN(parseFloat(entry.Temperature))
    );

    if (validData.length === 0) {
      console.warn('No valid temperature data to display');
      setChartRendered(false);
      return;
    }

    // Convert Fahrenheit to Celsius for display
    const labels = validData.map(entry => `${entry.Date} ${entry.Time}`);
    const temperatures = validData.map(entry => ((parseFloat(entry.Temperature) - 32) * 5 / 9).toFixed(1));
    const statuses = validData.map(entry => entry.temperature_status);

    const normalMin = 32.3; // Celsius
    const normalMax = 37.7; // Celsius

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    try {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Body Temperature (°C)',
            data: temperatures,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: statuses.map(status => getColorByStatus(status))
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Temperature (°C)'
              },
              min: Math.min(...temperatures) - 0.5,
              max: Math.max(...temperatures) + 0.5,
              ticks: {
                stepSize: 0.5
              },
              grid: {
                color: (context) => {
                  if (context.tick.value === normalMin || context.tick.value === normalMax) {
                    return 'rgba(255, 0, 0, 0.5)';
                  }
                  return 'rgba(0, 0, 0, 0.1)';
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date & Time'
              },
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const temp = context.raw;
                  const status = statusLabels[statuses[context.dataIndex]] || 'Unknown';
                  return `Temp: ${temp}°C (${status})`;
                }
              }
            },
            annotation: {
              annotations: {
                normalMin: {
                  type: 'line',
                  yMin: normalMin,
                  yMax: normalMin,
                  borderColor: 'red',
                  borderWidth: 1,
                  borderDash: [6, 6],
                  label: {
                    content: 'Normal Min (32.3°C)',
                    enabled: true,
                    position: 'right'
                  }
                },
                normalMax: {
                  type: 'line',
                  yMin: normalMax,
                  yMax: normalMax,
                  borderColor: 'red',
                  borderWidth: 1,
                  borderDash: [6, 6],
                  label: {
                    content: 'Normal Max (37.7°C)',
                    enabled: true,
                    position: 'right'
                  }
                }
              }
            }
          },
          elements: {
            line: {
              cubicInterpolationMode: 'monotone'
            }
          }
        }
      });

      setChartRendered(true);
    } catch (error) {
      console.error('Error creating chart:', error);
      setChartRendered(false);
    }
  }, [gridData]);

  useEffect(() => {
    if (openChart) {
      const timer = setTimeout(() => {
        renderChart();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [openChart, renderChart]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  const columns = [
    {
      key: 'sbp_status',
      name: 'BP (SBP/DBP)',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(params.row.sbp_status),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px'
          }}
        >
          {`${params.row.SBP || "-"}/${params.row.DBP || "-"}`} ({statusLabels[params.row.sbp_status] || "Unknown"})
        </div>
      )
    },
    {
      key: 'heartrate_status',
      name: 'Heart Rate',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(params.row.heartrate_status),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px'
          }}
        >
          {params.row.HeartRate || "-"} ({statusLabels[params.row.heartrate_status] || "Unknown"})
        </div>
      )
    },
    {
      key: 'RespiratoryStatus',
      name: 'Respiratory',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(params.row.RespiratoryStatus),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px'
          }}
        >
          {params.row.RespiratoryRate || "-"} ({statusLabels[params.row.RespiratoryStatus] || "Unknown"})
        </div>
      )
    },
    {
      key: 'spo2_status',
      name: 'SPO2',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(params.row.spo2_status),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px'
          }}
        >
          {params.row.SPO2 || "-"} ({statusLabels[params.row.spo2_status] || "Unknown"})
        </div>
      )
    },
    {
      key: 'temperature_status',
      name: 'Temperature',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(params.row.temperature_status),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px'
          }}
        >
          {params.row.Temperature || "-"} ({statusLabels[params.row.temperature_status] || "Unknown"})
        </div>
      )
    },
    {
      key: 'PainScore',
      name: 'Pain Score',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(getPainScoreStatus(params.row.PainScore)),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px'
          }}
        >
          {params.row.PainScore || "-"} ({statusLabels[getPainScoreStatus(params.row.PainScore)] || "Unknown"})
        </div>
      )
    },
    {
      key: 'PulseRate',
      name: 'Pulse Rate',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(getPulseRateStatus(params.row.PulseRate)),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px'
          }}
        >
          {params.row.PulseRate || "-"} ({statusLabels[getPulseRateStatus(params.row.PulseRate)] || "Unknown"})
        </div>
      )
    },
  ];

  const calculateTotalScore = (row) => {
    const fields = [
      row.sbp_status,
      row.heartrate_status,
      row.RespiratoryStatus,
      row.spo2_status,
      row.temperature_status,
      row.PulseRate ? getPulseRateStatus(row.PulseRate) : 0,
      row.PainScore ? getPainScoreStatus(row.PainScore) : 0,
    ];
    return fields.reduce((total, field) => total + (field !== null && field !== undefined ? field : 0), 0);
  };

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDifference = today.getMonth() - dobDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  };

  const dob = IP_DoctorWorkbenchNavigation?.DOB;
  const age = dob ? calculateAge(dob) : null;

  const getScoreCategory = (score, age) => {
    if (age >= 16) {
      if (score >= 0 && score <= 4) return 'Low';
      else if (score >= 5 && score <= 6) return 'Medium';
      else if (score >= 7 && score <= 21) return 'High';
      else return 'Unknown';
    } else {
      if (score >= 0 && score <= 2) return 'Low';
      else if (score >= 3 && score <= 5) return 'Medium';
      else if (score >= 6 && score <= 12) return 'High';
      else return 'Unknown';
    }
  };

  const totalScore = gridData.length > 0 ? calculateTotalScore(gridData[gridData.length - 1]) : 0;
  const scoreCategory = age !== null ? getScoreCategory(totalScore, age) : 'Unknown';

  // Combine existing grid data with new vital data for display
  const combinedData = [...gridData, ...newVitalData];

  return (
    <div className="RegisFormcon_1">
      <div className="vitals-container">
        {Type === "Vital" && (
          <div>
            <div className="past_present_pl efef_iuwd">
              <h5>All Vitals</h5>
              <div className="cwsu_6yw">
                <Button
                  className="cell_btn"
                  style={{
                    backgroundColor: "skyblue",
                    width: "110px",
                    fontSize: "13px",
                  }}
                  onClick={handleAddVitals}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      cursor: "pointer",
                      alignItems: "center",
                      fontSize: '11px',
                      gap: "3px",
                      justifyContent: "center",
                    }}
                  >
                    <AddIcon style={{ fontSize: "17px" }} />
                    Add Vitals
                  </div>
                </Button>
                <Button
                  className="cell_btn"
                  style={{
                    backgroundColor: "skyblue",
                    width: "110px",
                    fontSize: "13px",
                  }}
                  onClick={ChartView}
                >
                  Temp Chart
                </Button>
              </div>
            </div>

            <Dialog
              open={openChart}
              onClose={() => setOpenChart(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                style: {
                  height: '80vh',
                  minHeight: '500px'
                }
              }}
            >
              <DialogTitle>
                Temperature Trend
                <IconButton
                  aria-label="close"
                  onClick={() => setOpenChart(false)}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent style={{ position: 'relative', height: 'calc(100% - 64px)' }}>
                {gridData.length > 0 ? (
                  <>
                    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                      <canvas id="tempChart" style={{ width: '100%', height: '100%' }} />
                    </div>
                    {!chartRendered && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}>
                        <p>Loading chart...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <p>No temperature data available to display the chart.</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Vitals Table */}
            <div className="Selected-table-container">
              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th>Vital Name</th>
                    {combinedData.map((entry, index) => (
                      <th key={index}>{entry.Date} {entry.Time}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "BP (SBP/DBP)", key: "SBP", combine: true },
                    { name: "Heart Rate", key: "HeartRate" },
                    { name: "Respiratory Rate", key: "RespiratoryRate" },
                    { name: "SPO2", key: "SPO2" },
                    { name: "Temperature", key: "Temperature" },
                    { name: "Pain Score", key: "PainScore" },
                    { name: "Pulse Rate", key: "PulseRate" },
                  ].map((vital, vitalIndex) => (
                    <tr key={vitalIndex}>
                      <td>{vital.name}</td>
                      {combinedData.map((entry, index) => (
                        <td key={index}>
                          {entry.isNew ? (
                            <input
                              type="text"
                              value={
                                vital.combine
                                  ? `${entry.SBP || ""}/${entry.DBP || ""}`
                                  : entry[vital.key] || ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (vital.combine) {
                                  const [sbp, dbp] = value.split("/");
                                  // Validate 3 digits for both SBP and DBP
                                  if (
                                    (sbp === "" || /^[0-9]{0,3}$/.test(sbp)) &&
                                    (dbp === "" || /^[0-9]{0,3}$/.test(dbp))
                                  ) {
                                    handleInputChange(
                                      index - gridData.length,
                                      "SBP",
                                      sbp || ""
                                    );
                                    handleInputChange(
                                      index - gridData.length,
                                      "DBP",
                                      dbp || ""
                                    );
                                  }
                                } else {
                                  // Validate 3 digits for other vitals
                                  if (value === "" || /^[0-9]{0,3}$/.test(value)) {
                                    handleInputChange(
                                      index - gridData.length,
                                      vital.key,
                                      value
                                    );
                                  }
                                }
                              }}
                              style={{ width: "100px" }}
                            />
                          ) : vital.combine ? (
                            `${entry.SBP || "-"}/${entry.DBP || "-"} (${statusLabels[entry.sbp_status] || "Unknown"
                            })`
                          ) : (
                            `${entry[vital.key] || "-"} (${statusLabels[
                            entry[`${vital.key.toLowerCase()}_status`] !== undefined
                              ? entry[`${vital.key.toLowerCase()}_status`]
                              : vital.key === "PulseRate"
                                ? getPulseRateStatus(entry.PulseRate)
                                : vital.key === "PainScore"
                                  ? getPainScoreStatus(entry.PainScore)
                                  : "Unknown"
                            ] || "Unknown"
                            })`
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <br />

            {/* EWS Score and Color Boxes */}
            {gridData.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: '10px' }}>
                  {renderColorBox("Normal")}
                  {renderColorBox("BelowNormal")}
                  {renderColorBox("AboveNormal")}
                  {renderColorBox("Panic")}
                </div>
                <ReactGrid columns={columns} RowData={gridData} />
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40%', textAlign: 'center', marginTop: '20px' }}>
              <h2>EWS Score: {totalScore} ({scoreCategory})</h2>
            </div>

            {/* Height, Weight, BMI Table */}
            <div className="Selected-table-container">
              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th>Vital Name</th>
                    {combinedData.map((entry, index) => (
                      <th key={index}>{entry.Date} {entry.Time}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Height', key: 'Height' },
                    { name: 'Weight', key: 'Weight' },
                    { name: 'BMI', key: 'BMI' },
                  ].map((vital, vitalIndex) => (
                    <tr key={vitalIndex}>
                      <td>{vital.name}</td>
                      {combinedData.map((entry, index) => (
                        <td key={index}>
                          {entry.isNew ? (
                            <input
                              type="text"
                              value={entry[vital.key] || ''}
                              onChange={(e) => handleInputChange(index - gridData.length, vital.key, e.target.value)}
                              style={{ width: '100px' }}
                            />
                          ) : (
                            entry[vital.key] || '-'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Save and Cancel Buttons */}
            {isEditing && (
              <div className="Main_container_Btn" style={{ marginTop: '20px' }}>
                <Button onClick={handleSave} variant="contained" color="primary">
                  Save
                </Button>
                <Button onClick={handleCancel} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default IP_Vitals;

