import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { IconButton, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Chart, registerables, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

const IP_Vitals = () => {
  const dispatch = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  // const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
  const TherapistWorkbenchNavigation = useSelector((state) => state.Frontoffice?.TherapistWorkbenchNavigation);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [openChart, setOpenChart] = useState(false);
  const [openPastVitalsModal, setOpenPastVitalsModal] = useState(false);
  const [pastVitalsData, setPastVitalsData] = useState([]);
  const [Type, setType] = useState('Vital');
  const [gridData, setGridData] = useState([]);
  const [newVitalData, setNewVitalData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isGetData, setIsGetData] = useState(false);
  const [chartRendered, setChartRendered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const chartInstanceRef = useRef(null);

  const colorStyles = {
    Normal: '#4CAF50', // Green
    BelowNormal: '#FF9800', // Orange
    AboveNormal: '#FFEB3B', // Yellow
    Panic: '#F44336', // Red
  };

  const statusLabels = {
    0: 'Normal',
    1: 'Below Normal',
    2: 'Above Normal',
    3: 'Panic',
  };

  const getColorByStatus = (status) => {
    if (status === 0) return colorStyles.Normal;
    if (status === 1) return colorStyles.BelowNormal;
    if (status === 2) return colorStyles.AboveNormal;
    if (status === 3) return colorStyles.Panic;
    return colorStyles.Normal; // Default to Normal for invalid status
  };

  const renderColorBox = (status) => {
    if (!status) return null;
    return (
      <div
        style={{
          width: '120px',
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
          color: status === 'AboveNormal' ? '#000' : '#fff',
        }}
      >
        {statusLabels[status] || status}
      </div>
    );
  };

  // Age-based vital sign evaluation functions
  const calculateAge = (dob) => {
    if (!dob) return null;
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDifference = today.getMonth() - dobDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  };

  const getAgeGroup = (age) => {
    if (age === null || age === undefined) return 'Adult';
    if (age < 1) return 'Newborn';
    if (age < 2) return 'Infant';
    if (age < 4) return 'Toddler';
    if (age < 6) return 'Preschool';
    if (age < 13) return 'SchoolAge';
    if (age < 19) return 'Adolescent';
    return 'Adult';
  };

  const evaluateVitalStatus = (value, ranges) => {
    if (value === null || value === undefined || value === '') return 0; // Default to Normal for empty values
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0; // Default to Normal for invalid values

    // Check panic thresholds first
    if (ranges.panicLow && numValue <= ranges.panicLow) return 3; // Panic (Low)
    if (ranges.panicHigh && numValue >= ranges.panicHigh) return 3; // Panic (High)

    // Check normal range
    if (ranges.normalLow && ranges.normalHigh && numValue >= ranges.normalLow && numValue <= ranges.normalHigh) {
      return 0; // Normal
    }

    // Values outside normal range but not in panic
    if (ranges.normalLow && numValue < ranges.normalLow) return 1; // Below Normal
    if (ranges.normalHigh && numValue > ranges.normalHigh) return 2; // Above Normal

    // Fallback for incomplete ranges
    return 0; // Default to Normal
  };

  const getVitalRanges = (ageGroup, vitalType) => {
    const ranges = {
      Newborn: {
        Temperature: { normalLow: 97.7, normalHigh: 99.5, panicHigh: 100.4 },
        PulseRate: { normalLow: 100, normalHigh: 160, panicHigh: 180 },
        HeartRate: { normalLow: 100, normalHigh: 160, panicHigh: 180 },
        RespiratoryRate: { normalLow: 30, normalHigh: 60, panicHigh: 70 },
        SBP: { normalLow: 60, normalHigh: 85, panicHigh: 90 },
        DBP: { normalLow: 45, normalHigh: 55, panicHigh: 60 },
        SPO2: { normalLow: 95, panicLow: 90 },
      },
      Infant: {
        Temperature: { normalLow: 97.7, normalHigh: 99.5, panicHigh: 100.4 },
        PulseRate: { normalLow: 100, normalHigh: 150, panicHigh: 170 },
        HeartRate: { normalLow: 100, normalHigh: 150, panicHigh: 170 },
        RespiratoryRate: { normalLow: 30, normalHigh: 60, panicHigh: 70 },
        SBP: { normalLow: 80, normalHigh: 100, panicHigh: 110 },
        DBP: { normalLow: 55, normalHigh: 65, panicHigh: 70 },
        SPO2: { normalLow: 95, panicLow: 90 },
      },
      Toddler: {
        Temperature: { normalLow: 97.7, normalHigh: 99.5, panicHigh: 100.4 },
        PulseRate: { normalLow: 80, normalHigh: 130, panicHigh: 150 },
        HeartRate: { normalLow: 80, normalHigh: 130, panicHigh: 150 },
        RespiratoryRate: { normalLow: 24, normalHigh: 40, panicHigh: 50 },
        SBP: { normalLow: 90, normalHigh: 105, panicHigh: 110 },
        DBP: { normalLow: 55, normalHigh: 70, panicHigh: 75 },
        SPO2: { normalLow: 95, panicLow: 90 },
      },
      Preschool: {
        Temperature: { normalLow: 97.7, normalHigh: 99.5, panicHigh: 100.4 },
        PulseRate: { normalLow: 80, normalHigh: 120, panicHigh: 140 },
        HeartRate: { normalLow: 80, normalHigh: 120, panicHigh: 140 },
        RespiratoryRate: { normalLow: 22, normalHigh: 34, panicHigh: 40 },
        SBP: { normalLow: 95, normalHigh: 107, panicHigh: 115 },
        DBP: { normalLow: 60, normalHigh: 71, panicHigh: 75 },
        SPO2: { normalLow: 95, panicLow: 90 },
      },
      SchoolAge: {
        Temperature: { normalLow: 97.7, normalHigh: 99.5, panicHigh: 100.4 },
        PulseRate: { normalLow: 70, normalHigh: 110, panicHigh: 130 },
        HeartRate: { normalLow: 70, normalHigh: 110, panicHigh: 130 },
        RespiratoryRate: { normalLow: 18, normalHigh: 30, panicHigh: 35 },
        SBP: { normalLow: 95, normalHigh: 119, panicHigh: 125 },
        DBP: { normalLow: 60, normalHigh: 76, panicHigh: 80 },
        SPO2: { normalLow: 95, panicLow: 90 },
      },
      Adolescent: {
        Temperature: { normalLow: 97.7, normalHigh: 99.5, panicHigh: 100.4 },
        PulseRate: { normalLow: 60, normalHigh: 100, panicHigh: 120 },
        HeartRate: { normalLow: 60, normalHigh: 100, panicHigh: 120 },
        RespiratoryRate: { normalLow: 12, normalHigh: 20, panicHigh: 25 },
        SBP: { normalLow: 110, normalHigh: 124, panicHigh: 130 },
        DBP: { normalLow: 70, normalHigh: 79, panicHigh: 85 },
        SPO2: { normalLow: 95, panicLow: 90 },
      },
      Adult: {
        Temperature: { normalLow: 97.8, normalHigh: 99.1, panicHigh: 100.4 },
        PulseRate: { normalLow: 60, normalHigh: 100, panicHigh: 120 },
        HeartRate: { normalLow: 60, normalHigh: 100, panicHigh: 120 },
        RespiratoryRate: { normalLow: 12, normalHigh: 20, panicHigh: 24 },
        SBP: { normalLow: 90, normalHigh: 120, panicHigh: 140 },
        DBP: { normalLow: 60, normalHigh: 80, panicHigh: 90 },
        SPO2: { normalLow: 95, panicLow: 90 },
      }
    };

    return ranges[ageGroup]?.[vitalType] || { normalLow: 0, normalHigh: 100, panicHigh: 120 };
  };

  const getVitalStatus = (vitalType, value, ageGroup) => {
    const ranges = getVitalRanges(ageGroup, vitalType);
    return evaluateVitalStatus(value, ranges);
  };

  const getPainScoreStatus = (painScore) => {
    const value = parseFloat(painScore);
    if (isNaN(value) || value === null || value === undefined) return 0; // Default to Normal
    if (value >= 0 && value <= 2) return 0; // Normal
    if (value >= 3 && value <= 5) return 1; // Below Normal (medium for pain)
    if (value >= 6 && value <= 7) return 2; // Above Normal (high for pain)
    if (value >= 8 && value <= 10) return 3; // Panic (severe for pain)
    return 0; // Default to Normal for out-of-range values
  };

  const validateTemperature = (value, isComplete = false) => {
    if (value === '' || value === '.') {
      return { isValid: true, message: '' };
    }
    if (!/^\d*(\.\d{0,1})?$/.test(value)) {
      return {
        isValid: false,
        message: 'Temperature must be a number with up to one decimal place',
      };
    }
    if (isComplete) {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue) || parsedValue < 90 || parsedValue > 110) {
        return {
          isValid: false,
          message: 'Temperature must be between 90°F and 110°F',
        };
      }
    }
    return { isValid: true, message: '' };
  };

  // Process vital data with age-based evaluation
  const processVitalData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    const dob = TherapistWorkbenchNavigation?.DOB;
    const age = calculateAge(dob);
    const ageGroup = getAgeGroup(age);

    return data.map(item => {
      const temperature = item.Temperature;
      const pulseRate = item.PulseRate;
      const heartRate = item.HeartRate;
      const respiratoryRate = item.RespiratoryRate;
      const sbp = item.SBP;
      const dbp = item.DBP;
      const spo2 = item.SPO2;
      const painScore = item.PainScore || item.Painscore;

      return {
        ...item,
        temperature_status: getVitalStatus('Temperature', temperature, ageGroup),
        pulse_rate_status: getVitalStatus('PulseRate', pulseRate, ageGroup),
        heartrate_status: getVitalStatus('HeartRate', heartRate, ageGroup),
        RespiratoryStatus: getVitalStatus('RespiratoryRate', respiratoryRate, ageGroup),
        sbp_status: getVitalStatus('SBP', sbp, ageGroup),
        dbp_status: getVitalStatus('DBP', dbp, ageGroup),
        spo2_status: getVitalStatus('SPO2', spo2, ageGroup),
        pain_score_status: getPainScoreStatus(painScore),
      };
    });
  };

  useEffect(() => {
      const RegistrationId =  TherapistWorkbenchNavigation?.Registration_Id;

    const DepartmentType = TherapistWorkbenchNavigation?.RegisterType;
    if (RegistrationId && DepartmentType) {
      setIsLoading(true);
      axios
        .get(`${UrlLink}Ip_Workbench/IP_Vitals_Form_Details_Link`, {
          params: {
            RegistrationId: RegistrationId,
            DepartmentType: DepartmentType,
            Type: 'Nurse',
          },
        })
        .then((res) => {
          const data = res.data;
          if (data && Array.isArray(data.vital_details)) {
            const mappedData = data.vital_details.map((item) => ({
              ...item,
              PainScore: item.Painscore || item.PainScore,
            }));
            const currentDate = new Date();
            const formattedCurrentDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(
              currentDate.getMonth() + 1
            ).padStart(2, '0')}-${String(currentDate.getFullYear()).slice(-2)}`;
            const filteredData = mappedData.filter((item) => item.Date === formattedCurrentDate);
            setGridData(processVitalData(filteredData));
          } else if (data.error) {
            dispatch({
              type: 'toast',
              value: { message: data.error, type: 'error' },
            });
            setGridData([]);
          } else {
            dispatch({
              type: 'toast',
              value: { message: 'Unexpected response from server', type: 'error' },
            });
            setGridData([]);
          }
        })
        .catch((err) => {
          const errorMessage = err.response?.data?.error || 'Failed to fetch vital details';
          dispatch({
            type: 'toast',
            value: { message: errorMessage, type: 'error' },
          });
          setGridData([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      dispatch({
        type: 'toast',
        value: { message: 'Registration ID or Department Type is missing', type: 'error' },
      });
      setGridData([]);
      setIsLoading(false);
    }
  }, [UrlLink, TherapistWorkbenchNavigation, isGetData, dispatch]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getFullYear()
    ).slice(-2)}`;
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return { date, time };
  };

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
      isNew: true,
    };
    setNewVitalData([...newVitalData, newColumn]);
    setIsEditing(true);
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...newVitalData];
    const updatedErrors = { ...errors };
    if (field === 'Temperature') {
      const { isValid, message } = validateTemperature(value, false);
      if (!isValid) {
        updatedErrors[`${field}_${index}`] = message;
        dispatch({
          type: 'toast',
          value: { message, type: 'error' },
        });
        setErrors(updatedErrors);
        return;
      } else {
        delete updatedErrors[`${field}_${index}`];
      }
    } else if (['PulseRate', 'SPO2', 'HeartRate', 'RespiratoryRate', 'SBP', 'DBP', 'Height', 'Weight'].includes(field)) {
      if (value !== '' && !/^\d{0,3}(\.\d{0,1})?$/.test(value)) {
        updatedErrors[`${field}_${index}`] = `${field} must be up to 3 digits with one optional decimal place`;
        dispatch({
          type: 'toast',
          value: {
            message: `${field} must be up to 3 digits with one optional decimal place`,
            type: 'error',
          },
        });
        setErrors(updatedErrors);
        return;
      } else {
        delete updatedErrors[`${field}_${index}`];
      }
    } else if (field === 'PainScore') {
      const parsedValue = parseFloat(value);
      if (value !== '' && !/^\d{0,2}$/.test(value)) {
        updatedErrors[`${field}_${index}`] = 'Pain Score must be a number between 0 and 10';
        dispatch({
          type: 'toast',
          value: { message: 'Pain Score must be a number between 0 and 10', type: 'error' },
        });
        setErrors(updatedErrors);
        return;
      }
      if (!isNaN(parsedValue) && (parsedValue < 0 || parsedValue > 10)) {
        updatedErrors[`${field}_${index}`] = 'Pain Score must be between 0 and 10';
        dispatch({
          type: 'toast',
          value: { message: 'Pain Score must be between 0 and 10', type: 'error' },
        });
        setErrors(updatedErrors);
        return;
      } else {
        delete updatedErrors[`${field}_${index}`];
      }
    }
    updatedData[index][field] = value;
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
    setErrors(updatedErrors);
  };

  const handleInputBlur = (index, field, value) => {
    const updatedErrors = { ...errors };
    if (field === 'Temperature') {
      const { isValid, message } = validateTemperature(value, true);
      if (!isValid) {
        updatedErrors[`${field}_${index}`] = message;
        dispatch({
          type: 'toast',
          value: { message, type: 'error' },
        });
      } else {
        delete updatedErrors[`${field}_${index}`];
      }
    }
    setErrors(updatedErrors);
  };

  const handleSave = () => {
    const RegistrationId =  TherapistWorkbenchNavigation?.Registration_Id;
    const DepartmentType = TherapistWorkbenchNavigation?.RegisterType;
    if (!RegistrationId || !DepartmentType) {
      dispatch({ type: 'toast', value: { message: 'Registration ID or Department Type is missing', type: 'error' } });
      return;
    }
    const updatedErrors = { ...errors };
    let hasError = false;
    for (const [index, vital] of newVitalData.entries()) {
      if (vital.Temperature) {
        const { isValid, message } = validateTemperature(vital.Temperature, true);
        if (!isValid) {
          updatedErrors[`Temperature_${index}`] = message;
          dispatch({
            type: 'toast',
            value: { message, type: 'error' },
          });
          hasError = true;
        }
      }
      if (vital.PainScore) {
        const painScore = parseFloat(vital.PainScore);
        if (isNaN(painScore) || painScore < 0 || painScore > 10) {
          updatedErrors[`PainScore_${index}`] = 'Pain Score must be a valid number between 0 and 10';
          dispatch({
            type: 'toast',
            value: { message: 'Pain Score must be a valid number between 0 and 10', type: 'error' },
          });
          hasError = true;
        }
      }
    }
    if (hasError) {
      setErrors(updatedErrors);
      return;
    }
    const formattedData = newVitalData.map((vital) => ({
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
      Time: vital.Time,
    }));
    axios
      .post(`${UrlLink}Ip_Workbench/IP_Vitals_Form_Details_Link`, formattedData[0])
      .then((res) => {
        const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
        dispatch({ type: 'toast', value: { message, type } });
        setNewVitalData([]);
        setIsEditing(false);
        setIsGetData((prev) => !prev);
        setErrors({});
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.error || 'Failed to save vitals';
        dispatch({ type: 'toast', value: { message: errorMessage, type: 'error' } });
      });
  };

  const handleCancel = () => {
    setNewVitalData([]);
    setIsEditing(false);
    setErrors({});
  };

  const ChartView = useCallback(() => {
    setChartRendered(false);
    setOpenChart(true);
  }, []);

  const chartData = useMemo(() => {
    console.time('ChartDataProcessing');
    const validData = gridData.filter(
      (entry) => entry.Temperature !== null && !isNaN(parseFloat(entry.Temperature))
    );
    if (validData.length === 0) {
      console.warn('No valid temperature data to display');
      return { validData: [], labels: [], temperatures: [], statuses: [] };
    }
    const limitedData = validData.slice(-20);
    const labels = limitedData.map((entry) => `${entry.Date} ${entry.Time}`);
    const temperatures = limitedData.map((entry) => parseFloat(entry.Temperature).toFixed(1));
    const statuses = limitedData.map((entry) => entry.temperature_status);
    console.timeEnd('ChartDataProcessing');
    return { validData: limitedData, labels, temperatures, statuses };
  }, [gridData]);

  const renderChart = useCallback(() => {
    console.time('ChartRendering');
    const ctx = document.getElementById('tempChart')?.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found for tempChart');
      setChartRendered(false);
      console.timeEnd('ChartRendering');
      return;
    }
    if (chartData.validData.length === 0) {
      setChartRendered(false);
      console.timeEnd('ChartRendering');
      return;
    }
    const dob = TherapistWorkbenchNavigation?.DOB;
    const age = calculateAge(dob);
    const ageGroup = getAgeGroup(age);
    const tempRanges = getVitalRanges(ageGroup, 'Temperature');
    const normalMin = tempRanges?.normalLow || 97.8;
    const normalMax = tempRanges?.normalHigh || 99.1;
    const panicThreshold = tempRanges?.panicHigh || 100.4;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    try {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Body Temperature (°F)',
              data: chartData.temperatures,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: chartData.statuses.map((status) => getColorByStatus(status)),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Temperature (°F)',
              },
              min: Math.min(...chartData.temperatures) - 0.5,
              max: Math.max(...chartData.temperatures) + 0.5,
              ticks: {
                stepSize: 0.5,
                maxTicksLimit: 10,
              },
              grid: {
                color: (context) => {
                  if (
                    context.tick.value === normalMin ||
                    context.tick.value === normalMax ||
                    context.tick.value === panicThreshold
                  ) {
                    return 'rgba(255, 0, 0, 0.5)';
                  }
                  return 'rgba(0, 0, 0, 0.1)';
                },
              },
            },
            x: {
              title: {
                display: true,
                text: 'Date & Time',
              },
              grid: {
                display: false,
              },
              ticks: {
                maxTicksLimit: 10,
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const temp = context.raw;
                  const status = statusLabels[chartData.statuses[context.dataIndex]] || 'Normal';
                  return `Temp: ${temp}°F (${status})`;
                },
              },
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
                    content: `Normal Min (${normalMin}°F)`,
                    enabled: chartData.validData.length <= 10,
                    position: 'right',
                  },
                },
                normalMax: {
                  type: 'line',
                  yMin: normalMax,
                  yMax: normalMax,
                  borderColor: 'red',
                  borderWidth: 1,
                  borderDash: [6, 6],
                  label: {
                    content: `Normal Max (${normalMax}°F)`,
                    enabled: chartData.validData.length <= 10,
                    position: 'right',
                  },
                },
                panicThreshold: {
                  type: 'line',
                  yMin: panicThreshold,
                  yMax: panicThreshold,
                  borderColor: 'darkred',
                  borderWidth: 1,
                  borderDash: [6, 6],
                  label: {
                    content: `Panic Threshold (${panicThreshold}°F)`,
                    enabled: chartData.validData.length <= 10,
                    position: 'right',
                  },
                },
              },
            },
          },
          elements: {
            line: {
              cubicInterpolationMode: 'monotone',
            },
          },
        },
      });
      setChartRendered(true);
    } catch (error) {
      console.error('Error creating chart:', error);
      setChartRendered(false);
    }
    console.timeEnd('ChartRendering');
  }, [chartData, TherapistWorkbenchNavigation]);

  useEffect(() => {
    if (openChart) {
      const canvas = document.getElementById('tempChart');
      if (canvas) {
        renderChart();
      } else {
        console.warn('Canvas not ready, delaying chart render');
        const timer = setTimeout(renderChart, 100);
        return () => clearTimeout(timer);
      }
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
      key: 'DateTime',
      name: 'Date & Time',
      renderCell: (params) => (
        <div
          style={{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            padding: '5px',
          }}
        >
          {`${params.row.Date} ${params.row.Time}`}
        </div>
      ),
    },
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
            color: params.row.sbp_status === 2 ? '#000' : '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px',
          }}
        >
          {`${params.row.SBP || '-'} / ${params.row.DBP || '-'}`} ({statusLabels[params.row.sbp_status] || 'Normal'})
        </div>
      ),
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
            color: params.row.heartrate_status === 2 ? '#000' : '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px',
          }}
        >
          {params.row.HeartRate || '-'} ({statusLabels[params.row.heartrate_status] || 'Normal'})
        </div>
      ),
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
            color: params.row.RespiratoryStatus === 2 ? '#000' : '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px',
          }}
        >
          {params.row.RespiratoryRate || '-'} ({statusLabels[params.row.RespiratoryStatus] || 'Normal'})
        </div>
      ),
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
            color: params.row.spo2_status === 2 ? '#000' : '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px',
          }}
        >
          {params.row.SPO2 || '-'} ({statusLabels[params.row.spo2_status] || 'Normal'})
        </div>
      ),
    },
    {
      key: 'temperature_status',
      name: 'Temperature (°F)',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(params.row.temperature_status),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: params.row.temperature_status === 2 ? '#000' : '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px',
          }}
        >
          {params.row.Temperature ? `${params.row.Temperature}°F` : '-'} ({statusLabels[params.row.temperature_status] || 'Normal'})
        </div>
      ),
    },
    {
      key: 'pain_score_status',
      name: 'Pain Score',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(params.row.pain_score_status),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: params.row.pain_score_status === 2 ? '#000' : '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px',
          }}
        >
          {params.row.PainScore || '-'} ({statusLabels[params.row.pain_score_status] || 'Normal'})
        </div>
      ),
    },
    {
      key: 'pulse_rate_status',
      name: 'Pulse Rate',
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: getColorByStatus(params.row.pulse_rate_status),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            color: params.row.pulse_rate_status === 2 ? '#000' : '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '5px',
          }}
        >
          {params.row.PulseRate || '-'} ({statusLabels[params.row.pulse_rate_status] || 'Normal'})
        </div>
      ),
    },
  ];

  const calculateTotalScore = (row) => {
    const fields = [
      row.sbp_status,
      row.heartrate_status,
      row.RespiratoryStatus,
      row.spo2_status,
      row.temperature_status,
      row.pulse_rate_status,
      row.pain_score_status,
    ];
    return fields.reduce((total, field) => total + (field !== null && field !== undefined ? field : 0), 0);
  };

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

  const dob = TherapistWorkbenchNavigation?.DOB;
  const age = dob ? calculateAge(dob) : null;
  const totalScore = gridData.length > 0 ? calculateTotalScore(gridData[gridData.length - 1]) : 0;
  const scoreCategory = age !== null ? getScoreCategory(totalScore, age) : 'Unknown';

  const combinedData = [...gridData, ...newVitalData];

  const PastView = useCallback(() => {
    const RegistrationId = TherapistWorkbenchNavigation?.Registration_Id;
    const DepartmentType = TherapistWorkbenchNavigation?.RegisterType;
    if (!RegistrationId || !DepartmentType) {
      dispatch({
        type: 'toast',
        value: { message: 'Registration ID or Department Type is missing', type: 'error' },
      });
      return;
    }
    setIsLoading(true);
    axios
      .get(`${UrlLink}Ip_Workbench/IP_Vitals_Form_Details_Link`, {
        params: {
          RegistrationId: RegistrationId,
          DepartmentType: DepartmentType,
          Type: 'Nurse',
          pastOnly: true,
        },
      })
      .then((res) => {
        const data = res.data;
        if (data && Array.isArray(data.vital_details)) {
          const mappedData = data.vital_details.map((item) => ({
            ...item,
            PainScore: item.Painscore || item.PainScore,
          }));
          setPastVitalsData(processVitalData(mappedData));
          setOpenPastVitalsModal(true);
        } else if (data.error) {
          dispatch({
            type: 'toast',
            value: { message: data.error, type: 'error' },
          });
          setPastVitalsData([]);
        } else {
          dispatch({
            type: 'toast',
            value: { message: 'Unexpected response from server', type: 'error' },
          });
          setPastVitalsData([]);
        }
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.error || 'Failed to fetch past vitals';
        dispatch({
          type: 'toast',
          value: { message: errorMessage, type: 'error' },
        });
        setPastVitalsData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [UrlLink, TherapistWorkbenchNavigation, dispatch]);

  return (
    <div className="RegisFormcon_1">
      <div className="vitals-container">
        {Type === 'Vital' && (
          <div>
            <div className="past_present_pl efef_iuwd">
              <h5>All Vitals</h5>
              <div className="cwsu_6yw">
                <Button
                  className="cell_btn"
                  style={{
                    backgroundColor: 'skyblue',
                    width: '110px',
                    fontSize: '13px',
                  }}
                  onClick={handleAddVitals}
                  disabled={isLoading}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      cursor: 'pointer',
                      alignItems: 'center',
                      fontSize: '11px',
                      gap: '3px',
                      justifyContent: 'center',
                    }}
                  >
                    <AddIcon style={{ fontSize: '17px' }} />
                    Add Vitals
                  </div>
                </Button>
                <Button
                  className="cell_btn"
                  style={{
                    backgroundColor: 'skyblue',
                    width: '110px',
                    fontSize: '13px',
                  }}
                  onClick={ChartView}
                  disabled={isLoading}
                >
                  Temp Chart
                </Button>
                <Button
                  className="cell_btn"
                  style={{
                    backgroundColor: 'skyblue',
                    width: '110px',
                    fontSize: '13px',
                  }}
                  onClick={PastView}
                  disabled={isLoading}
                >
                  Past Vitals
                </Button>
              </div>
            </div>
            <Dialog
              open={openPastVitalsModal}
              onClose={() => setOpenPastVitalsModal(false)}
              maxWidth="lg"
              fullWidth
              PaperProps={{
                style: {
                  height: '80vh',
                  minHeight: '500px',
                },
              }}
            >
              <DialogTitle>
                Past Vitals
                <IconButton
                  aria-label="close"
                  onClick={() => setOpenPastVitalsModal(false)}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                {isLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : pastVitalsData.length > 0 ? (
                  <div style={{ marginTop: '20px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      {renderColorBox('Normal')}
                      {renderColorBox('BelowNormal')}
                      {renderColorBox('AboveNormal')}
                      {renderColorBox('Panic')}
                    </div>
                    <ReactGrid columns={columns} RowData={pastVitalsData} />
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <p>No past vitals data available.</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Dialog
              open={openChart}
              onClose={() => setOpenChart(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                style: {
                  height: '80vh',
                  minHeight: '500px',
                },
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
                {chartData.validData.length > 0 ? (
                  <>
                    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                      <canvas id="tempChart" style={{ width: '100%', height: '100%' }} />
                    </div>
                    {!chartRendered && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center',
                        }}
                      >
                        <CircularProgress />
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <p>No temperature data available to display the chart.</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            {isLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '50vh',
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th>Vital Name</th>
                        {combinedData.map((entry, index) => (
                          <th key={index}>
                            {entry.Date} {entry.Time}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'BP (SBP/DBP)', key: 'SBP', combine: true },
                        { name: 'Heart Rate', key: 'HeartRate' },
                        { name: 'Respiratory Rate', key: 'RespiratoryRate' },
                        { name: 'SPO2', key: 'SPO2' },
                        { name: 'Temperature (°F)', key: 'Temperature' },
                        { name: 'Pain Score', key: 'PainScore' },
                        { name: 'Pulse Rate', key: 'PulseRate' },
                      ].map((vital, vitalIndex) => (
                        <tr key={vitalIndex}>
                          <td>{vital.name}</td>
                          {combinedData.map((entry, index) => {
                            const statusKey = vital.combine
                              ? 'sbp_status'
                              : vital.key === 'PainScore'
                              ? 'pain_score_status'
                              : vital.key === 'PulseRate'
                              ? 'pulse_rate_status'
                              : `${vital.key.toLowerCase()}_status`;
                            return (
                              <td key={index}>
                                {entry.isNew ? (
                                  <div style={{ position: 'relative' }}>
                                    <input
                                      type="text"
                                      value={
                                        vital.combine
                                          ? `${entry.SBP || ''}/${entry.DBP || ''}`
                                          : entry[vital.key] || ''
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (vital.combine) {
                                          const [sbp, dbp] = value.split('/');
                                          if (
                                            (sbp === '' || /^\d{0,3}(\.\d{0,1})?$/.test(sbp)) &&
                                            (dbp === '' || /^\d{0,3}(\.\d{0,1})?$/.test(dbp))
                                          ) {
                                            handleInputChange(index - gridData.length, 'SBP', sbp || '');
                                            handleInputChange(index - gridData.length, 'DBP', dbp || '');
                                          }
                                        } else {
                                          handleInputChange(index - gridData.length, vital.key, value);
                                        }
                                      }}
                                      onBlur={(e) =>
                                        handleInputBlur(index - gridData.length, vital.key, e.target.value)
                                      }
                                      style={{
                                        width: '100px',
                                        border: errors[`${vital.key}_${index - gridData.length}`]
                                          ? '2px solid red'
                                          : '1px solid #ccc',
                                        padding: '2px',
                                      }}
                                      placeholder={
                                        vital.key === 'Temperature' ? '°F' : vital.combine ? 'SBP/DBP' : ''
                                      }
                                      maxLength={
                                        vital.combine ? 7 :
                                        vital.key === 'Temperature' ? 5 :
                                        vital.key === 'PainScore' ? 2 : 3
                                      }
                                    />
                                    {errors[`${vital.key}_${index - gridData.length}`] && (
                                      <span
                                        style={{
                                          color: 'red',
                                          fontSize: '12px',
                                          position: 'absolute',
                                          bottom: '-20px',
                                          left: '0',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {errors[`${vital.key}_${index - gridData.length}`]}
                                      </span>
                                    )}
                                  </div>
                                ) : vital.combine ? (
                                  `${entry.SBP || '-'} / ${entry.DBP || '-'} (${
                                    statusLabels[entry.sbp_status] || 'Normal'
                                  })`
                                ) : (
                                  `${
                                    vital.key === 'Temperature' && entry[vital.key]
                                      ? `${entry[vital.key]}°F`
                                      : entry[vital.key] || '-'
                                  } (${statusLabels[entry[statusKey]] || 'Normal'})`
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <br />
                {gridData.length > 0 ? (
                  <div style={{ marginTop: '20px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      {renderColorBox('Normal')}
                      {renderColorBox('BelowNormal')}
                      {renderColorBox('AboveNormal')}
                      {renderColorBox('Panic')}
                    </div>
                    <ReactGrid columns={columns} RowData={gridData} />
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '20px',
                    }}
                  >
                    <p>No vital data available for today.</p>
                  </div>
                )}
                
                <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th>Vital Name</th>
                        {combinedData.map((entry, index) => (
                          <th key={index}>
                            {entry.Date} {entry.Time}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Height (cm)', key: 'Height' },
                        { name: 'Weight (kg)', key: 'Weight' },
                        { name: 'BMI', key: 'BMI' },
                      ].map((vital, vitalIndex) => (
                        <tr key={vitalIndex}>
                          <td>{vital.name}</td>
                          {combinedData.map((entry, index) => (
                            <td key={index}>
                              {entry.isNew ? (
                                <div style={{ position: 'relative' }}>
                                  <input
                                    type="text"
                                    value={entry[vital.key] || ''}
                                    onChange={(e) =>
                                      handleInputChange(index - gridData.length, vital.key, e.target.value)
                                    }
                                    onBlur={(e) =>
                                      handleInputBlur(index - gridData.length, vital.key, e.target.value)
                                    }
                                    style={{
                                      width: '100px',
                                      border: errors[`${vital.key}_${index - gridData.length}`]
                                        ? '2px solid red'
                                        : '1px solid #ccc',
                                      padding: '2px',
                                    }}
                                    placeholder={
                                      vital.key === 'Height' ? 'cm' : vital.key === 'Weight' ? 'kg' : ''
                                    }
                                    maxLength={vital.key === 'BMI' ? 5 : 3}
                                  />
                                  {errors[`${vital.key}_${index - gridData.length}`] && (
                                    <span
                                      style={{
                                        color: 'red',
                                        fontSize: '12px',
                                        position: 'absolute',
                                        bottom: '-20px',
                                        left: '0',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {errors[`${vital.key}_${index - gridData.length}`]}
                                    </span>
                                  )}
                                </div>
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
                {isEditing && (
                  <div className="Main_container_Btn" style={{ marginTop: '20px' }}>
                    <Button onClick={handleSave} variant="contained" color="primary" disabled={isLoading}>
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="contained"
                      color="secondary"
                      style={{ marginLeft: '10px' }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default IP_Vitals;