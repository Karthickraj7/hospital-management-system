import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';

const IP_NurseInputOutputChart = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);

  const dispatch = useDispatch();

  const [IntakeData, setIntakeData] = useState({
    IntakeType: "",
    IntakeMode: "",
    Site: "",
    Measurement1: "",
    MeasurementType1: "ml",
    Duration: "",
    DurationType: "hours",
    Remarks1: "",
  });

  const [OutputData, setOutputData] = useState({
    OutputType: "",
    Measurement2: "",
    MeasurementType2: "ml",
    Remarks2: "",
  });

  const [BalanceData, setBalanceData] = useState({
    totalInputDay: "",
    totalOutputDay: "",
    balance: "",
    balanceType: "",
  });

  const [measurementArr, setMeasurementArr] = useState([]);
  const [intakeModeArr, setIntakeModeArr] = useState([]);
  const [intakeTypeArr, setIntakeTypeArr] = useState([]);
  const [intakeDetailsData, setIntakeDetailsData] = useState([]);
  const [outputDetailsData, setOutputDetailsData] = useState([]);
  const [balanceDetailsData, setBalanceDetailsData] = useState([]);
  const [IsGetData, setIsGetData] = useState(false);
  const [openChart, setOpenChart] = useState(false);
  const [chartDate, setChartDate] = useState("");

  const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const getTodayDate = () => {
    const today = new Date();
    const year = String(today.getFullYear()).slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const processedIntakeData = intakeDetailsData.reduce((acc, row, index) => {
    const dateTime = `${row.Date || ''} ${row.Time || ''}`;
    const date = row.Date || '';
    if (!acc[date]) acc[date] = [];
    acc[date].push({
      ...row,
      id: acc[date].length + 1,
      DateTime: dateTime,
      Measurement: `${row.Measurement1 || ''} ${row.MeasurementType1 || ''}`.trim(),
    });
    return acc;
  }, {});

  const processedOutputData = outputDetailsData.reduce((acc, row, index) => {
    const dateTime = `${row.Date || ''} ${row.Time || ''}`;
    const date = row.Date || '';
    if (!acc[date]) acc[date] = [];
    acc[date].push({
      ...row,
      id: acc[date].length + 1,
      DateTime: dateTime,
      Measurement: `${row.Measurement2 || ''} ${row.MeasurementType2 || ''}`.trim(),
    });
    return acc;
  }, {});

  const processedBalanceData = balanceDetailsData.reduce((acc, row, index) => {
    const dateTime = `${row.Date || ''} ${row.Time || ''}`;
    const date = row.Date || '';
    if (!acc[date]) acc[date] = [];
    acc[date].push({
      ...row,
      id: acc[date].length + 1,
      DateTime: dateTime,
      index,
    });
    return acc;
  }, {});

  const updateBalanceFromInputs = (selectedDate = getTodayDate()) => {
    const totalIntakeFromDetails = intakeDetailsData
      .filter(
        (item) =>
          item.Date === selectedDate &&
          item.MeasurementType1.toLowerCase() === "ml" &&
          !isNaN(Number(item.Measurement1))
      )
      .reduce((sum, item) => sum + Number(item.Measurement1), 0);

    const totalOutputFromDetails = outputDetailsData
      .filter(
        (item) =>
          item.Date === selectedDate &&
          item.MeasurementType2.toLowerCase() === "ml" &&
          !isNaN(Number(item.Measurement2))
      )
      .reduce((sum, item) => sum + Number(item.Measurement2), 0);

    const currentIntake =
      IntakeData.Measurement1 &&
      IntakeData.MeasurementType1.toLowerCase() === "ml" &&
      !isNaN(Number(IntakeData.Measurement1)) &&
      selectedDate === getTodayDate()
        ? Number(IntakeData.Measurement1)
        : 0;
    const currentOutput =
      OutputData.Measurement2 &&
      OutputData.MeasurementType2.toLowerCase() === "ml" &&
      !isNaN(Number(OutputData.Measurement2)) &&
      selectedDate === getTodayDate()
        ? Number(OutputData.Measurement2)
        : 0;

    const newTotalInput = totalIntakeFromDetails + currentIntake;
    const newTotalOutput = totalOutputFromDetails + currentOutput;
    const newBalance = newTotalInput - newTotalOutput;

    let newBalanceType = "";
    if (newBalance > 0) {
      newBalanceType = "Positive";
    } else if (newBalance < 0) {
      newBalanceType = "Negative";
    }

    return {
      totalInputDay: newTotalInput || "",
      totalOutputDay: newTotalOutput || "",
      balance: newBalance || "",
      balanceType: newBalanceType,
    };
  };

  useEffect(() => {
    setBalanceData(updateBalanceFromInputs());
  }, [
    IntakeData.Measurement1,
    IntakeData.MeasurementType1,
    OutputData.Measurement2,
    OutputData.MeasurementType2,
    intakeDetailsData,
    outputDetailsData,
  ]);

  const getChartData = (selectedDate) => {
    const events = [];

    intakeDetailsData
      .filter(item => item.Date === selectedDate && item.MeasurementType1.toLowerCase() === "ml")
      .forEach(item => {
        events.push({
          type: 'Intake',
          time: item.Time,
          value: Number(item.Measurement1 || 0),
          details: item.IntakeType,
        });
      });

    outputDetailsData
      .filter(item => item.Date === selectedDate && item.MeasurementType2.toLowerCase() === "ml")
      .forEach(item => {
        events.push({
          type: 'Output',
          time: item.Time,
          value: Number(item.Measurement2 || 0),
          details: item.OutputType,
        });
      });

    if (selectedDate === getTodayDate()) {
      if (IntakeData.Measurement1 && IntakeData.MeasurementType1.toLowerCase() === "ml") {
        const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
        events.push({
          type: 'Intake',
          time: currentTime,
          value: Number(IntakeData.Measurement1),
          details: IntakeData.IntakeType,
        });
      }

      if (OutputData.Measurement2 && OutputData.MeasurementType2.toLowerCase() === "ml") {
        const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
        events.push({
          type: 'Output',
          time: currentTime,
          value: Number(OutputData.Measurement2),
          details: OutputData.OutputType,
        });
      }
    }

    events.sort((a, b) => a.time.localeCompare(b.time));

    const data = events.reduce((acc, event) => {
      const existing = acc.find(item => item.time === event.time);
      if (existing) {
        existing[event.type] = event.value;
        existing[`${event.type}Details`] = event.details;
      } else {
        acc.push({
          time: event.time,
          Intake: event.type === 'Intake' ? event.value : 0,
          Output: event.type === 'Output' ? event.value : 0,
          IntakeDetails: event.type === 'Intake' ? event.details : '',
          OutputDetails: event.type === 'Output' ? event.details : '',
        });
      }
      return acc;
    }, []);

    data.forEach((item, i) => {
      const intakeSum = data.slice(0, i + 1).reduce((sum, d) => sum + d.Intake, 0);
      const outputSum = data.slice(0, i + 1).reduce((sum, d) => sum + d.Output, 0);
      item.Balance = intakeSum - outputSum;
    });

    return data;
  };

  const ChartComponent = () => {
    const chartData = getChartData(chartDate);
    const balanceForDate = updateBalanceFromInputs(chartDate);
    const chartRef = useRef(null);

    const handleExportChart = () => {
      if (chartRef.current) {
        html2canvas(chartRef.current).then((canvas) => {
          const link = document.createElement('a');
          link.download = `Fluid_Balance_${chartDate}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      }
    };

    return (
      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div ref={chartRef} role="region" aria-label={`Fluid Balance Chart for ${chartDate}`}>
          <h3 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '10px' }}>
            Fluid Balance - {chartDate} (Input: {balanceForDate.totalInputDay} ml, Output: {balanceForDate.totalOutputDay} ml, Balance: {balanceForDate.balance} ml)
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ angle: -45, textAnchor: 'end', fontSize: 12 }} height={60} />
              <YAxis
                label={{ value: 'Volume (ml)', angle: -90, position: 'insideLeft', offset: -5 }}
                domain={['auto', 'auto']}
                allowDataOverflow={true}
              />
              <Tooltip
                formatter={(value, name, props) => {
                  const details = props.payload[`${name}Details`];
                  return details ? `${value} ml (${details})` : `${value} ml`;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="Intake"
                stackId="1"
                stroke="#1E90FF"
                fill="#1E90FF"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="Output"
                stackId="1"
                stroke="#FF4500"
                fill="#FF4500"
                fillOpacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="Balance"
                stroke="#32CD32"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#333' }} aria-hidden="true">
            <p>Summary for {chartDate}:</p>
            <ul>
              <li>Total Input: {balanceForDate.totalInputDay} ml</li>
              <li>Total Output: {balanceForDate.totalOutputDay} ml</li>
              <li>Balance: {balanceForDate.balance} ml ({balanceForDate.balanceType})</li>
            </ul>
          </div>
        </div>
        <button
          onClick={handleExportChart}
          style={{
            marginTop: '15px',
            marginRight: '10px',
            float: 'right',
            padding: '8px 16px',
            backgroundColor: '#32CD32',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Export Chart
        </button>
      </div>
    );
  };

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get(`${UrlLink}Masters/Measurement_Master_link`);
        setMeasurementArr(response.data);
      } catch (error) {
        console.error('Error fetching measurements:', error);
      }
    };

    const fetchIntakeModes = async () => {
      try {
        const response = await axios.get(`${UrlLink}Masters/IntakeMode_Master_link`);
        setIntakeModeArr(response.data);
      } catch (error) {
        console.error('Error fetching intake modes:', error);
      }
    };

    const fetchIntakeTypes = async () => {
      try {
        const response = await axios.get(`${UrlLink}Masters/IntakeType_Master_link`);
        setIntakeTypeArr(response.data);
      } catch (error) {
        console.error('Error fetching intake types:', error);
      }
    };

    fetchMeasurements();
    fetchIntakeModes();
    fetchIntakeTypes();
  }, [UrlLink]);

  useEffect(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (RegistrationId) {
      axios
        .get(`${UrlLink}Ip_Workbench/IP_InputOutputBalance_Details_Link`, {
          params: { RegistrationId, DepartmentType: departmentType },
        })
        .then((res) => {
          const { intake_details, output_details, balance_details } = res.data;
          console.log('Fetched Data:', res.data);
          setIntakeDetailsData(intake_details || []);
          setOutputDetailsData(output_details || []);
          setBalanceDetailsData(balance_details || []);
        })
        .catch((err) => {
          console.error('Error fetching details:', err);
        });
    }
  }, [IsGetData, UrlLink, IP_DoctorWorkbenchNavigation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["IntakeType", "IntakeMode", "Site", "Measurement1", "MeasurementType1", "Duration", "DurationType", "Remarks1"].includes(name)) {
      setIntakeData((prev) => ({ ...prev, [name]: value }));
    } else if (["OutputType", "Measurement2", "MeasurementType2", "Remarks2"].includes(name)) {
      setOutputData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClear = () => {
    setIntakeData({
      IntakeType: "",
      IntakeMode: "",
      Site: "",
      Measurement1: "",
      MeasurementType1: "ml",
      Duration: "",
      DurationType: "hours",
      Remarks1: "",
    });
    setOutputData({
      OutputType: "",
      Measurement2: "",
      MeasurementType2: "ml",
      Remarks2: "",
    });
  };

  const handleSubmit = () => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (!RegistrationId) {
      dispatch({ type: 'toast', value: { message: 'Registration ID is missing', type: 'error' } });
      return;
    }

    const currentDate = getTodayDate();
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    let hasError = false;
    const sendData = {
      RegistrationId,
      DepartmentType,
      Createdby: userRecord?.username,
      Date: currentDate,
      Time: currentTime,
    };

    if (IntakeData.IntakeType && IntakeData.Measurement1) {
      sendData.Intake = { ...IntakeData, Inserttype: 'Intake' };
    } else if (IntakeData.IntakeType || IntakeData.Measurement1) {
      dispatch({ type: 'toast', value: { message: 'Please fill both Intake Type and Measurement', type: 'error' } });
      hasError = true;
    }

    if (OutputData.OutputType && OutputData.Measurement2) {
      sendData.Output = { ...OutputData, Inserttype: 'Output' };
    } else if (OutputData.OutputType || OutputData.Measurement2) {
      dispatch({ type: 'toast', value: { message: 'Please fill both Output Type and Measurement', type: 'error' } });
      hasError = true;
    }

    if (!sendData.Intake && !sendData.Output) {
      dispatch({ type: 'toast', value: { message: 'Please fill at least one section (Intake or Output)', type: 'error' } });
      return;
    }

    if (hasError) return;

    sendData.Balance = {
      Inserttype: 'Balance',
      totalInputDay: BalanceData.totalInputDay || "",
      totalOutputDay: BalanceData.totalOutputDay || "",
      balance: BalanceData.balance || "",
      balanceType: BalanceData.balanceType || "",
    };

    axios
      .post(`${UrlLink}Ip_Workbench/IP_InputOutputBalance_Details_Link`, sendData)
      .then((res) => {
        const { success, error } = res.data;
        if (success) {
          dispatch({ type: 'toast', value: { message: success, type: 'success' } });
          if (sendData.Intake) {
            setIntakeDetailsData(prev => [...prev, { ...sendData.Intake, Date: currentDate, Time: currentTime }]);
          }
          if (sendData.Output) {
            setOutputDetailsData(prev => [...prev, { ...sendData.Output, Date: currentDate, Time: currentTime }]);
          }
          const existingBalanceIndex = balanceDetailsData.findIndex(
            item => item.Date === currentDate
          );
          const newBalanceEntry = {
            ...sendData.Balance,
            Date: currentDate,
            Time: currentTime,
            PrimaryDoctorName: userRecord?.username
          };
          if (existingBalanceIndex !== -1) {
            setBalanceDetailsData(prev => {
              const updated = [...prev];
              updated[existingBalanceIndex] = newBalanceEntry;
              return updated;
            });
          } else {
            setBalanceDetailsData(prev => [...prev, newBalanceEntry]);
          }
          setIsGetData(prev => !prev);
          handleClear();
        } else {
          dispatch({ type: 'toast', value: { message: error || 'Failed to submit data', type: 'error' } });
        }
      })
      .catch((err) => {
        console.error('POST error:', err);
        dispatch({ type: 'toast', value: { message: 'Failed to submit data', type: 'error' } });
      });
  };

  const handleViewChart = (date) => {
    setChartDate(date);
    setOpenChart(true);
  };

  const handleCloseChart = () => {
    setOpenChart(false);
    setChartDate("");
  };

  const sectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  };

  const columnStyle = {
    flex: '1',
    minWidth: '300px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const tableContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px',
  };

  const dateGroupStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    flexWrap: 'wrap',
  };

  const tableWrapperStyle = {
    flex: '1',
    minWidth: '400px',
    maxWidth: '450px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  };

  const thStyle = {
    backgroundColor: '#f2f2f2',
    padding: '2px',
    border: '1px solid #ddd',
    textAlign: 'left',
    position: 'sticky',
    top: 0,
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '4px',
    border: '1px solid #ddd',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    zIndex: 1000,
    maxWidth: '700px',
    width: '90%',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
  };

  const allDates = [
    ...new Set([
      ...Object.keys(processedIntakeData),
      ...Object.keys(processedOutputData),
      ...Object.keys(processedBalanceData),
    ]),
  ].sort().reverse();

  return (
    <>
      <br />
      <div className="RegisFormcon_1">
        <div style={sectionStyle}>
          <div style={columnStyle}>
            <h3>Intake</h3>
            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label>Intake Type <span>:</span></label>
                <select name="IntakeType" value={IntakeData.IntakeType} onChange={handleInputChange}>
                  <option value="">Select</option>
                  {intakeTypeArr.map((item) => (
                    <option key={item.id} value={item.IntakeTypeName}>{item.IntakeTypeName}</option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>Intake Mode <span>:</span></label>
                <select name="IntakeMode" value={IntakeData.IntakeMode} onChange={handleInputChange}>
                  <option value="">Select</option>
                  {intakeModeArr.map((item) => (
                    <option key={item.id} value={item.IntakeModeName}>{item.IntakeModeName}</option>
                  ))}
                </select>
              </div>
              {IntakeData.IntakeMode === "IV" && (
                <div className="RegisForm_1">
                  <label>Site <span>:</span></label>
                  <select name="Site" value={IntakeData.Site} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="External Jugular">External Jugular</option>
                    <option value="Subclavian">Subclavian</option>
                    <option value="Femoral vein">Femoral vein</option>
                    <option value="Dorsal Venous Network of Hand">Dorsal Venous Network of Hand</option>
                    <option value="Radial vein">Radial vein</option>
                    <option value="Median Cubital vein">Median Cubital vein</option>
                    <option value="Cephalic vein">Cephalic vein</option>
                    <option value="Dorsal Venous Network of Leg">Dorsal Venous Network of Leg</option>
                    <option value="Saphaneous vein">Saphaneous vein</option>
                    <option value="Superficial Temporal vein">Superficial Temporal vein</option>
                  </select>
                </div>
              )}
              <div className="RegisForm_1">
                <label>Duration <span>:</span></label>
                <input
                  name="Duration"
                  type="number"
                  onKeyDown={blockInvalidChar}
                  value={IntakeData.Duration}
                  onChange={handleInputChange}
                />
                <select name="DurationType" style={{ width: "110px" }} value={IntakeData.DurationType} onChange={handleInputChange}>
                  <option value="hours">hours</option>
                  <option value="minutes">minutes</option>
                </select>
              </div>
              <div className="RegisForm_1">
                <label>Measurement <span>:</span></label>
                <input
                  name="Measurement1"
                  type="number"
                  onKeyDown={blockInvalidChar}
                  value={IntakeData.Measurement1}
                  onChange={handleInputChange}
                />
                <select name="MeasurementType1" style={{ width: "110px" }} value={IntakeData.MeasurementType1} onChange={handleInputChange}>
                  <option value="">Select</option>
                  {measurementArr.map((item) => (
                    <option key={item.id} value={item.MeasurementName}>{item.MeasurementName}</option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>Remarks <span>:</span></label>
                <textarea name="Remarks1" value={IntakeData.Remarks1} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div style={columnStyle}>
            <h3>Output</h3>
            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label>Output Type <span>:</span></label>
                <select name="OutputType" value={OutputData.OutputType} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Vomit">Vomit</option>
                  <option value="Urine">Urine</option>
                  <option value="Stools">Stools</option>
                  <option value="Surgical Site Drainage">Surgical Site Drainage</option>
                  <option value="Gastric">Gastric</option>
                  <option value="Lab sample">Lab sample</option>
                  <option value="Insensible loss">Insensible loss</option>
                  <option value="Sweating">Sweating</option>
                  <option value="Oozing">Oozing</option>
                  <option value="Bleeding">Bleeding</option>
                </select>
              </div>
              <div className="RegisForm_1">
                <label>Measurement <span>:</span></label>
                <input
                  name="Measurement2"
                  type="number"
                  onKeyDown={blockInvalidChar}
                  value={OutputData.Measurement2}
                  onChange={handleInputChange}
                />
                <select name="MeasurementType2" style={{ width: "110px" }} value={OutputData.MeasurementType2} onChange={handleInputChange}>
                  <option value="">Select</option>
                  {measurementArr.map((item) => (
                    <option key={item.id} value={item.MeasurementName}>{item.MeasurementName}</option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>Remarks <span>:</span></label>
                <textarea name="Remarks2" value={OutputData.Remarks2} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div style={columnStyle}>
            <h3>Balance (Today)</h3>
            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label>Total Input Today (ml) <span>:</span></label>
                <input
                  name="totalInputDay"
                  type="number"
                  onKeyDown={blockInvalidChar}
                  style={{ width: "140px" }}
                  value={BalanceData.totalInputDay}
                  readOnly
                  title="Cumulative total of today's intakes"
                />
              </div>
              <div className="RegisForm_1">
                <label>Total Output Today (ml) <span>:</span></label>
                <input
                  name="totalOutputDay"
                  type="number"
                  onKeyDown={blockInvalidChar}
                  style={{ width: "140px" }}
                  value={BalanceData.totalOutputDay}
                  readOnly
                  title="Cumulative total of today's outputs"
                />
              </div>
              <div className="RegisForm_1">
                <label>Balance <span>:</span></label>
                <input
                  name="balance"
                  type="number"
                  onKeyDown={blockInvalidChar}
                  style={{ width: "140px" }}
                  value={BalanceData.balance}
                  readOnly
                  title="Today's Total Input - Total Output"
                />
              </div>
              <div className="RegisForm_1">
                <label>Balance Type <span>:</span></label>
                <select name="balanceType" value={BalanceData.balanceType} readOnly disabled>
                  <option value="">Select</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="Main_container_Btn" style={{ textAlign: 'center', margin: '20px 0' }}>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleClear}>Clear</button>
        </div>

        <div style={tableContainerStyle}>
          {allDates.map((date) => (
            <div key={date} style={dateGroupStyle}>
              {processedIntakeData[date] && processedIntakeData[date].length > 0 && (
                <div style={tableWrapperStyle}>
                  <h3>Intake Details - {date}</h3>
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
                      {processedIntakeData[date].map((row) => (
                        <tr key={row.id}>
                          <td style={tdStyle}>{row.id}</td>
                          <td style={tdStyle}>{row.DateTime}</td>
                          <td style={tdStyle}>{row.IntakeType}</td>
                          <td style={tdStyle}>{row.IntakeMode}</td>
                          <td style={tdStyle}>{row.Measurement}</td>
                          <td style={tdStyle}>{row.Duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {processedOutputData[date] && processedOutputData[date].length > 0 && (
                <div style={tableWrapperStyle}>
                  <h3>Output Details - {date}</h3>
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
                      {processedOutputData[date].map((row) => (
                        <tr key={row.id}>
                          <td style={tdStyle}>{row.id}</td>
                          <td style={tdStyle}>{row.DateTime}</td>
                          <td style={tdStyle}>{row.OutputType}</td>
                          <td style={tdStyle}>{row.Measurement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {processedBalanceData[date] && processedBalanceData[date].length > 0 && (
                <div style={tableWrapperStyle}>
                  <h3>Balance Details - {date}</h3>
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
                      {processedBalanceData[date].map((row, index) => (
                        <tr key={row.id}>
                          <td style={tdStyle}>{row.id}</td>
                          <td style={tdStyle}>{row.DateTime}</td>
                          <td style={tdStyle}>{row.PrimaryDoctorName}</td>
                          <td style={tdStyle}>{row.totalInputDay}</td>
                          <td style={tdStyle}>{row.totalOutputDay}</td>
                          <td style={tdStyle}>{row.balance}</td>
                          <td style={tdStyle}>{row.balanceType}</td>
                          <td style={tdStyle}>
                            {index === processedBalanceData[date].length - 1 && (
                              <VisibilityIcon
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleViewChart(date)}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {openChart && (
          <>
            <div style={overlayStyle} onClick={handleCloseChart}></div>
            <div style={popupStyle}>
              <ChartComponent />
              <button
                onClick={handleCloseChart}
                style={{
                  marginTop: '15px',
                  float: 'right',
                  padding: '8px 16px',
                  backgroundColor: '#FF4500',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default IP_NurseInputOutputChart;









