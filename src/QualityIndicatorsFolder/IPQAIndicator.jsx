import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckBox } from '@mui/icons-material';
import './QA.css';  // Import the external CSS

function IPQAIndicator() {
    const [userdata, setUserdata] = useState([]);
    const [userdata1, setUserdata1] = useState([]);
    const [userdata2, setUserdata2] = useState([]);
    const [userdata3, setUserdata3] = useState([]);
    const [userdata4, setUserdata4] = useState([]);
    const [userdata5, setUserdata5] = useState([]);
    const navigate = useNavigate();
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [page, setPage] = useState("raise")
    // const [totalTimeDifference, setTotalTimeDifference] = useState(0); // State to track sum of TimeDifferenceInMinutes
    const [totalTime, setTotalTime] = useState(0);
    const [totalTime0, setTotalTime0] = useState(0);
    const [totalTime1, setTotalTime1] = useState(0);
    const [totalTime2, setTotalTime2] = useState(0);
    const [totalTime3, setTotalTime3] = useState(0);
    const [totalTime4, setTotalTime4] = useState(0);
    const [totalTime5, setTotalTime5] = useState(0);
    const [averageTime, setAverageTime] = useState(0);
    const [checkboxCount, setCheckboxCount] = useState(0);
    const [checkboxCount0, setCheckboxCount0] = useState(0);
    const [checkboxCount1, setCheckboxCount1] = useState(0);
    const [checkboxCount2, setCheckboxCount2] = useState(0);
    const [checkboxCount3, setCheckboxCount3] = useState(0);
    const [checkboxCount4, setCheckboxCount4] = useState(0);
    const [checkboxCount5, setCheckboxCount5] = useState(0);
       const [satisfactionCounts, setSatisfactionCounts] = useState({});
       const [satisfactionCounts0, setSatisfactionCounts0] = useState({});
       const [satisfactionCounts2, setSatisfactionCounts2] = useState({});
       const [satisfactionCounts3, setSatisfactionCounts3] = useState({});
       const [satisfactionCounts4, setSatisfactionCounts4] = useState({});
       const [satisfactionCounts5, setSatisfactionCounts5] = useState({});
         const [searchQuery, setSearchQuery] = useState('');
         const [dateOption, setDateOption] = useState('current');
         const [fromDate, setFromDate] = useState('');
         const [toDate, setToDate] = useState('');
         const [ParticularDate, setParticularDate] = useState('');
         const [CurrentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);


           useEffect(() => {
                 if (dateOption === 'current') {
                     setCurrentDate(new Date().toISOString().split('T')[0]); // Auto-set today
                 }
             }, [dateOption]);
             

         const handleDateOptionChange = (e) => {
            setDateOption(e.target.value);
        
            // Reset date states when changing the selection
            if (e.target.value === 'current') {
                setFromDate('');
                setToDate('');
                setParticularDate('');
            } else if (e.target.value === 'custom') {
                setParticularDate('');
                setCurrentDate('');
            } else if (e.target.value === 'particular') {
                setFromDate('');
                setToDate('');
                setCurrentDate('');
            }
        };
        const handleCurrentDateChange = (e) => {
            setCurrentDate(e.target.value);
        };
    
    
        const handleFromDateChange = (e) => {
            setFromDate(e.target.value);
        };
        
        const handleToDateChange = (e) => {
            setToDate(e.target.value);
        };
        
        const handleParticularDateChange = (e) => {
            setParticularDate(e.target.value);
        };

        const handleSearchChange = (event) => {
            setSearchQuery(event.target.value);
        };
       const columns0 = [
    
        { key: 'assessment_time_status', label: 'Assessment Time Status' },
        { key: 'initial_assessment_completion_rate', label: 'Initial Assessment Completion rate within Timeframe' },
        { key: 'avg_time_initial_assessment', label: 'Average time taken for initial assessment of patients coming to emergency' },
        { key: 'emergency_assessment_completion_rate', label: "Emergency patients' initial assessment completion rate within timeframe" },
       
      ];
        const columns = [
            { key: 'Ventilator-associated-pneumonia-(VAP)-rate', label: 'Ventilator associated pneumonia (VAP) rate' },
            { key: 'Central-line-catheter-associated-blood-stream-infection-(CA-BSI)-rate', label: 'Central line catheter associated blood stream infection (CA-BSI) rate' },
            { key: 'Surgical-site-infection-(SSI)-rate', label: 'Surgical site infection (SSI) rate' },
            { key: 'Net-mortality-rate', label: 'Net mortality rate' },
            { key: 'Re-intubation-rate', label: 'Re-intubation rate' },
            { key: 'Error-rates-during-shift-hand-overs', label: 'Error rates during shift hand-overs' },
        ];
        const columns2 = [
            { key: 'LabReportsVsClinicalDiagnosis', label: 'Percentage of lab reports co-relating with clinical diagnosis' },
            { key: 'AdverseDrugReactions', label: 'Percentage of adverse drug reactions' },
            { key: 'HighRiskDrugReactions', label: 'Percentage of adverse drug reaction due to high-risk medicine' },
            { key: 'ErrorProneAbbreviations', label: 'Percentage of medical records with error-prone abbreviations' },
            { key: 'ProphylacticAntibioticCompliance', label: 'Percentage of cases who received prophylactic antibiotic within specified time-frame' },
            { key: 'TransfusionReactions', label: 'Percentage of transfusion reactions' },
          ];
          const columns3 = [
            { key: 'WrongPatientIdentification', label: 'Percentage of medical error due to wrong identification of patient' },
            { key: 'HandHygieneCompliance', label: 'Hand hygiene compliance rate' },
            { key: 'CapitalPrescriptionCompliance', label: 'Compliance rate to medication prescription in capitals' },
            { key: 'PatientFallRate', label: 'Patient fall rate per 1000 patient days' },
            { key: 'PressureUlcerRate', label: 'Hospital-associated pressure ulcer rate' },
            { key: 'BedOccupancyRate', label: 'Bed Occupancy Rate' }
          ]; 
          const columns4 = [
            { key: 'AverageLengthOfStay', label: 'Average Length of Stay (ALOS)' },
            { key: 'WardNursePatientRatio', label: 'Nurse patient ratio for wards' },
            { key: 'ICUNursePatientRatio', label: 'Nurse patient ratio for ICU' },
            { key: 'InPatientSatisfactionIndex', label: 'In-patient satisfaction index' },
            { key: 'AverageWaitingTime', label: 'Average waiting time for services' },
            { key: 'AverageDischargeTime', label: 'Average discharge time' }
          ];
          const columns5 = [
            { key: 'NearMissesPercentage', label: 'Percentage of near misses' },
            { key: 'NeedlestickInjuryRate', label: 'Needlestick injury rate' },
            { key: 'MissingDischargeSummary', label: 'Percentage of medical records not having discharge summary' },
            { key: 'MissingICDCodes', label: 'Percentage of medical records not having ICD codes' },
            { key: 'ImproperConsentRecords', label: 'Percentage of medical records having incomplete and improper consent' },
            { key: 'CarePlanDocumentationRate', label: "In-patients' care plan documentation and clinician countersign rate" },
            { key: 'NutritionalScreeningRate', label: "In-patients' nutritional screening completion rate" }
          ];
    useEffect(() => {
        if (userdata.length > 0) {
            const totalValidEntries = userdata.filter(row => row.AverageTimeInMinutes !== null).length;
            const totalAvgTime = userdata.reduce((sum, row) => sum + (Number(row.AverageTimeInMinutes) || 0), 0);
            setAverageTime(totalValidEntries > 0 ? totalAvgTime / totalValidEntries : 0);
        }
    }, [userdata]);
    const calculateSatisfactionCounts = (data) => {
        const counts = {};
        
        columns.forEach(column => {
            counts[column.key] = {
                satisfied: 0,
                unsatisfied: 0
            };
            
            // Count satisfied and unsatisfied for this column
            data.forEach(row => {
                if (row[column.key]) {
                    counts[column.key].satisfied++;
                } else {  
                    counts[column.key].unsatisfied++;
                }
            });
        });
        
        setSatisfactionCounts(counts);
    };

    const calculateSatisfactionCounts0 = (data) => {
        const counts = {};
        
        columns0.forEach(column => {
            counts[column.key] = {
                satisfied: 0,
                unsatisfied: 0
            };
            
            // Count satisfied and unsatisfied for this column
            data.forEach(row => {
                if (row[column.key]) {
                    counts[column.key].satisfied++;
                } else {  
                    counts[column.key].unsatisfied++;
                }
            });
        });
        
        setSatisfactionCounts0(counts);
    };

    const calculateSatisfactionCounts2 = (data) => {
        const counts = {};
        
        columns2.forEach(column => {
            counts[column.key] = {
                satisfied: 0,
                unsatisfied: 0
            };
            
            // Count satisfied and unsatisfied for this column
            data.forEach(row => {
                if (row[column.key]) {
                    counts[column.key].satisfied++;
                } else {  
                    counts[column.key].unsatisfied++;
                }
            });
        });
        
        setSatisfactionCounts2(counts);
    };
    
    const calculateSatisfactionCounts3 = (data) => {
        const counts = {};
        
        columns3.forEach(column => {
            counts[column.key] = {
                satisfied: 0,
                unsatisfied: 0
            };
            
            // Count satisfied and unsatisfied for this column
            data.forEach(row => {
                if (row[column.key]) {
                    counts[column.key].satisfied++;
                } else {  
                    counts[column.key].unsatisfied++;
                }
            });
        });
        
        setSatisfactionCounts3(counts);
    };
    const calculateSatisfactionCounts4 = (data) => {
        const counts = {};
        
        columns4.forEach(column => {
            counts[column.key] = {
                satisfied: 0,
                unsatisfied: 0
            };
            
            // Count satisfied and unsatisfied for this column
            data.forEach(row => {
                if (row[column.key]) {
                    counts[column.key].satisfied++;
                } else {  
                    counts[column.key].unsatisfied++;
                }
            });
        });
        
        setSatisfactionCounts4(counts);
    };

    const calculateSatisfactionCounts5 = (data) => {
        const counts = {};
        
        columns5.forEach(column => {
            counts[column.key] = {
                satisfied: 0,
                unsatisfied: 0
            };
            
            // Count satisfied and unsatisfied for this column
            data.forEach(row => {
                if (row[column.key]) {
                    counts[column.key].satisfied++;
                } else {  
                    counts[column.key].unsatisfied++;
                }
            });
        });
        
        setSatisfactionCounts5(counts);
    };


    const apiConfigs = [
        { url: "QualityIndicators/get_all_patients_time_comparison", setData: setUserdata, columns: columns0, setCounts: setSatisfactionCounts0  },
        { url: "QualityIndicators/get_IP_patients_fro_QA_1", setData: setUserdata1, columns: columns, setCounts: setSatisfactionCounts },
        { url: "QualityIndicators/get_IP_patients_fro_QA_2", setData: setUserdata2, columns: columns2, setCounts: setSatisfactionCounts2 },
        { url: "QualityIndicators/get_IP_patients_fro_QA_3", setData: setUserdata3, columns: columns3, setCounts: setSatisfactionCounts3 },
        { url: "QualityIndicators/get_IP_patients_fro_QA_4", setData: setUserdata4, columns: columns4, setCounts: setSatisfactionCounts4 },
        { url: "QualityIndicators/get_IP_patients_fro_QA_5", setData: setUserdata5, columns: columns5, setCounts: setSatisfactionCounts5 },
    ];
    
    const fetchAndSetData = async (url, setData, columns, setCounts) => {
        try {
            const params = new URLSearchParams();
    
            if (dateOption === 'current') {
                params.append('date', CurrentDate);
            } else if (dateOption === 'custom') {
                if (fromDate) params.append('fromDate', fromDate);
                if (toDate) params.append('toDate', toDate);
            } else if (dateOption === 'particular') {
                if (ParticularDate) params.append('date', ParticularDate);
            }
    
            if (searchQuery) {
                params.append('search', searchQuery);
            }
    
            const response = await fetch(`${UrlLink}${url}?${params.toString()}`);
            const result = await response.json();
    
            if (response.ok) {
                const data = result.data || result;
                setData(data);
                calculateSatisfactionCountsGeneric(data, columns, setCounts);
            } else {
                console.error("Error fetching data:", result.error);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    const calculateSatisfactionCountsGeneric = (data, columns, setCounts) => {
        const counts = {};
    
        columns.forEach(column => {
            counts[column.key] = {
                satisfied: 0,
                unsatisfied: 0
            };
    
            data.forEach(row => {
                if (row[column.key]) {
                    counts[column.key].satisfied++;
                } else {
                    counts[column.key].unsatisfied++;
                }
            });
        });
    
        setCounts(counts);
    };

    
    useEffect(() => {
        apiConfigs.forEach(config => {
            fetchAndSetData(config.url, config.setData, config.columns, config.setCounts);
        });
    }, [UrlLink, dateOption, fromDate, toDate, ParticularDate, CurrentDate, searchQuery]);
    
    
    
    const handleBack = () => {
        navigate("/Home/QualityIndicatorsFolder");
    };

    const handleCheckboxChange = (event, timeDifference) => {
        const isChecked = event.target.checked;
        setCheckboxCount(prevCount => isChecked ? prevCount + 1 : prevCount - 1);
        const timeValue = Number(timeDifference) || 0; // Convert to number, handle NaN
    
        setTotalTime(prevTotal => isChecked ? prevTotal + timeValue : prevTotal - timeValue);
    };
    
    const totalExpectedTime = checkboxCount * averageTime;
    const percentage = totalExpectedTime > 0 ? ((totalTime / totalExpectedTime) * 100).toFixed(2) : 0;
      
    const conclusion = percentage > 100 ? 'UnSatisfied' : 'Satisfied' ; 
    console.log('averge time ',averageTime);    
    
    console.log('timedifferrenv',totalTime);
    console.log('check box count',checkboxCount);
    console.log('total ex',totalExpectedTime)
    console.log('percentage ',percentage)

    const toggleCheckbox = (registrationId, columnKey) => {
        const updatedData = userdata1.map(row => {
            if (row.Registration_Id === registrationId) {
                // Toggle the satisfaction state for this specific column
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        // Find the affected row to update time calculations
        const affectedRow = updatedData.find(row => row.Registration_Id === registrationId);
        const isNowChecked = affectedRow ? affectedRow[columnKey] : false;
        const timeValue = affectedRow ? (Number(affectedRow.TimeDifferenceInMinutes) || 0) : 0;
        
        // Update checkbox count and total time
        setCheckboxCount1(prevCount => isNowChecked ? prevCount + 1 : prevCount - 1);
        setTotalTime1(prevTotal => isNowChecked ? prevTotal + timeValue : prevTotal - timeValue);
        
        // Update state with new data
        setUserdata1(updatedData);
        calculateSatisfactionCounts(updatedData);
    };
    const toggleCheckbox0 = (registrationId, columnKey) => {
        const updatedData = userdata.map(row => {
            if (row.Registration_Id === registrationId) {
                // Toggle the satisfaction state for this specific column
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        // Find the affected row to update time calculations
        const affectedRow = updatedData.find(row => row.Registration_Id === registrationId);
        const isNowChecked = affectedRow ? affectedRow[columnKey] : false;
        const timeValue = affectedRow ? (Number(affectedRow.TimeDifferenceInMinutes) || 0) : 0;
        
        // Update checkbox count and total time
        setCheckboxCount0(prevCount => isNowChecked ? prevCount + 1 : prevCount - 1);
        setTotalTime0(prevTotal => isNowChecked ? prevTotal + timeValue : prevTotal - timeValue);
        
        // Update state with new data
        setUserdata(updatedData);
        calculateSatisfactionCounts0(updatedData);
    };

    const toggleCheckbox2 = (registrationId, columnKey) => {
        const updatedData = userdata2.map(row => {
            if (row.Registration_Id === registrationId) {
                // Toggle the satisfaction state for this specific column
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        // Find the affected row to update time calculations
        const affectedRow = updatedData.find(row => row.Registration_Id === registrationId);
        const isNowChecked = affectedRow ? affectedRow[columnKey] : false;
        const timeValue = affectedRow ? (Number(affectedRow.TimeDifferenceInMinutes) || 0) : 0;
        
        // Update checkbox count and total time
        setCheckboxCount2(prevCount => isNowChecked ? prevCount + 1 : prevCount - 1);
        setTotalTime2(prevTotal => isNowChecked ? prevTotal + timeValue : prevTotal - timeValue);
        
        // Update state with new data
        setUserdata2(updatedData);
        calculateSatisfactionCounts2(updatedData);
    };

    const toggleCheckbox3 = (registrationId, columnKey) => {
        const updatedData = userdata3.map(row => {
            if (row.Registration_Id === registrationId) {
                // Toggle the satisfaction state for this specific column
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        // Find the affected row to update time calculations
        const affectedRow = updatedData.find(row => row.Registration_Id === registrationId);
        const isNowChecked = affectedRow ? affectedRow[columnKey] : false;
        const timeValue = affectedRow ? (Number(affectedRow.TimeDifferenceInMinutes) || 0) : 0;
        
        // Update checkbox count and total time
        setCheckboxCount3(prevCount => isNowChecked ? prevCount + 1 : prevCount - 1);
        setTotalTime3(prevTotal => isNowChecked ? prevTotal + timeValue : prevTotal - timeValue);
        
        // Update state with new data
        setUserdata3(updatedData);
        calculateSatisfactionCounts3(updatedData);
    };

    
    const toggleCheckbox4 = (registrationId, columnKey) => {
        const updatedData = userdata4.map(row => {
            if (row.Registration_Id === registrationId) {
                // Toggle the satisfaction state for this specific column
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        // Find the affected row to update time calculations
        const affectedRow = updatedData.find(row => row.Registration_Id === registrationId);
        const isNowChecked = affectedRow ? affectedRow[columnKey] : false;
        const timeValue = affectedRow ? (Number(affectedRow.TimeDifferenceInMinutes) || 0) : 0;
        
        // Update checkbox count and total time
        setCheckboxCount4(prevCount => isNowChecked ? prevCount + 1 : prevCount - 1);
        setTotalTime4(prevTotal => isNowChecked ? prevTotal + timeValue : prevTotal - timeValue);
        
        // Update state with new data
        setUserdata4(updatedData);
        calculateSatisfactionCounts4(updatedData);
    };
    const toggleCheckbox5 = (registrationId, columnKey) => {
        const updatedData = userdata5.map(row => {
            if (row.Registration_Id === registrationId) {
                // Toggle the satisfaction state for this specific column
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        // Find the affected row to update time calculations
        const affectedRow = updatedData.find(row => row.Registration_Id === registrationId);
        const isNowChecked = affectedRow ? affectedRow[columnKey] : false;
        const timeValue = affectedRow ? (Number(affectedRow.TimeDifferenceInMinutes) || 0) : 0;
        
        // Update checkbox count and total time
        setCheckboxCount5(prevCount => isNowChecked ? prevCount + 1 : prevCount - 1);
        setTotalTime5(prevTotal => isNowChecked ? prevTotal + timeValue : prevTotal - timeValue);
        
        // Update state with new data
        setUserdata5(updatedData);
        calculateSatisfactionCounts5(updatedData);
    };

    const getColumnStatus = (columnKey) => {
        const count = satisfactionCounts[columnKey];
        if (!count) return { status: 'UNSATISFIED', color: '#ffcccc' };
        
        if (count.satisfied > count.unsatisfied) {
            return { status: 'SATISFIED', color: '#cceeff' };
        } else if (count.satisfied < count.unsatisfied) {
            return { status: 'UNSATISFIED', color: '#ffcccc' };
        } else {
            return { status: 'MODERATE', color: '#ffffcc' }; // Yellow for moderate/equal
        }
    };

    const getColumnStatus0 = (columnKey) => {
        const count = satisfactionCounts0[columnKey];
        if (!count) return { status: 'UNSATISFIED', color: '#ffcccc' };
        
        if (count.satisfied > count.unsatisfied) {
            return { status: 'SATISFIED', color: '#cceeff' };
        } else if (count.satisfied < count.unsatisfied) {
            return { status: 'UNSATISFIED', color: '#ffcccc' };
        } else {
            return { status: 'MODERATE', color: '#ffffcc' }; // Yellow for moderate/equal
        }
    };
    const getColumnStatus2 = (columnKey) => {
        const count = satisfactionCounts2[columnKey];
        if (!count) return { status: 'UNSATISFIED', color: '#ffcccc' };
        
        if (count.satisfied > count.unsatisfied) {
            return { status: 'SATISFIED', color: '#cceeff' };
        } else if (count.satisfied < count.unsatisfied) {
            return { status: 'UNSATISFIED', color: '#ffcccc' };
        } else {
            return { status: 'MODERATE', color: '#ffffcc' }; // Yellow for moderate/equal
        }
    };
    const getColumnStatus3 = (columnKey) => {
        const count = satisfactionCounts3[columnKey];
        if (!count) return { status: 'UNSATISFIED', color: '#ffcccc' };
        
        if (count.satisfied > count.unsatisfied) {
            return { status: 'SATISFIED', color: '#cceeff' };
        } else if (count.satisfied < count.unsatisfied) {
            return { status: 'UNSATISFIED', color: '#ffcccc' };
        } else {
            return { status: 'MODERATE', color: '#ffffcc' }; // Yellow for moderate/equal
        }
    };

    const getColumnStatus4 = (columnKey) => {
        const count = satisfactionCounts4[columnKey];
        if (!count) return { status: 'UNSATISFIED', color: '#ffcccc' };
        
        if (count.satisfied > count.unsatisfied) {
            return { status: 'SATISFIED', color: '#cceeff' };
        } else if (count.satisfied < count.unsatisfied) {
            return { status: 'UNSATISFIED', color: '#ffcccc' };
        } else {
            return { status: 'MODERATE', color: '#ffffcc' }; // Yellow for moderate/equal
        }
    };

    const getColumnStatus5 = (columnKey) => {
        const count = satisfactionCounts5[columnKey];
        if (!count) return { status: 'UNSATISFIED', color: '#ffcccc' };
        
        if (count.satisfied > count.unsatisfied) {
            return { status: 'SATISFIED', color: '#cceeff' };
        } else if (count.satisfied < count.unsatisfied) {
            return { status: 'UNSATISFIED', color: '#ffcccc' };
        } else {
            return { status: 'MODERATE', color: '#ffffcc' }; // Yellow for moderate/equal
        }
    };

    return (
        <>
      
            <div className="Main_container_app">
                <>

                <div className="search_div_bar">
              <div className="search_div_bar_inp_1">
                <label>
                  {" "}
                  Date <span>:</span>{" "}
                </label>
                <select value={dateOption} onChange={handleDateOptionChange} style={{backgroundColor:'white'}}>
                  <option value="current">Current Date</option>
                  <option value="custom">Custom Date</option>
                  <option value="particular">Particular Date</option>
                </select>
              </div>

              {dateOption === "current" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Current Date <span>:</span>{" "}
                  </label>
                  <input
                  
                    type="date"
                    value={CurrentDate}
                    disabled
                    onChange={handleCurrentDateChange}
                  />
                </div>
              )}

              {dateOption === "custom" && (
                <>
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      From <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="From Date"
                      value={fromDate}
                      onChange={handleFromDateChange} 
                    />
                  </div>

                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      To <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="To Date"
                      value={toDate}
                      onChange={handleToDateChange} 
                    />
                  </div>
                </>
              )}

              {/* Particular Date Input */}
              <br />
              {dateOption === "particular" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Select Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={ParticularDate}
                    onChange={handleParticularDateChange} 
                  />
                </div>
              )}

              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Search by
                  <span>:</span>
                </label>
                <input 
                  type="text"
                  name="query"
                  value={searchQuery}
                  placeholder="Search here... "
                  onChange={handleSearchChange}
                />
              </div>
              </div>
                </>
               


                    
            <div className="RegisterTypecon" style={{ margin: '20px' }}>
                    <div className="RegisterTypecon navchange" style={{padding:'5px',borderRadius:'30px'}}>

                        <div className="registertypeval">
                            <input type="radio" name="page" id='raise' value={'raise'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'raise'} />
                            <label htmlFor='raise'>
                                Page 1
                            </label>
                        </div>  

                        <div className="registertypeval" style={{ marginLeft: "30px", }}>
                            <input type="radio" name="page" id='issue' value={'issue'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'issue'} />
                            <label htmlFor='issue'>
                                Page 2
                            </label>
                        </div>

                        <div className="registertypeval" style={{ marginLeft: "30px", }}>
                            <input type="radio" name="page" id='request' value={'request'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'request'} />
                            <label htmlFor='request'>
                            Page 3
                            </label>
                        </div>

                        
                        <div className="registertypeval" style={{ marginLeft: "30px", }}>
                            <input type="radio" id='set' name="page" value={'set'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'set'} />
                            <label htmlFor='set'>
                            Page 4
                            </label>
                        </div>

                        <div className="registertypeval" style={{ marginLeft: "30px", }}>
                            <input type="radio" id='drop' name="page" value={'drop'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'drop'} />
                            <label htmlFor='drop'>
                            Page 5
                            </label>
                        </div>
                        <div className="registertypeval" style={{ marginLeft: "30px", }}>
                            <input type="radio" id='deep' name="page" value={'deep'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'deep'} />
                            <label htmlFor='deep'>
                            Page 6
                            </label>
                        </div>

                    </div>
                </div>
                {page === "raise" ? (
                    <>
                        <table className="qa-indicator-table">
                            <thead>
                                <tr>
                                    <th>Registeration ID</th>
                                    {columns0.map(col => {
                                        const count = satisfactionCounts0[col.key] || { satisfied: 0, unsatisfied: 0 };
                                        const { status, color } = getColumnStatus0(col.key);
                                        
                                        return (
                                            <th key={col.key}>
                                                <div>
                                                    {col.label}
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '5px', 
                                                        backgroundColor: color,
                                                        borderRadius: '4px',
                                                        fontSize: '12px'
                                                    }}>
                                                        <div><strong>Satisfied:</strong> {count.satisfied}</div>
                                                        <div><strong>Unsatisfied:</strong> {count.unsatisfied}</div>
                                                        <div style={{ 
                                                            marginTop: '5px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            Status: {status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {userdata.length > 0 ? (
                                    userdata.map((row) => (
                                        <tr key={row.Registration_Id}>
                                            <td>{row.Registration_Id}</td>
                                            {columns0.map(col => (
                                                <td key={`${row.Registration_Id}-${col.key}`}>
                                                    <div className='checkbox-container'>
                                                        <input 
                                                            type='checkbox' 
                                                            className='custom-checkboxvenki'
                                                            checked={row[col.key] || false}
                                                            onChange={() => toggleCheckbox0(row.Registration_Id, col.key)}
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns0.length + 1}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <></>
                )}





{page === "issue" ? (
                    <>
                        <table className="qa-indicator-table">
                            <thead>
                                <tr>
                                    <th>Registeration ID</th>
                                    {columns.map(col => {
                                        const count = satisfactionCounts[col.key] || { satisfied: 0, unsatisfied: 0 };
                                        const { status, color } = getColumnStatus(col.key);
                                        
                                        return (
                                            <th key={col.key}>
                                                <div>
                                                    {col.label}
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '5px', 
                                                        backgroundColor: color,
                                                        borderRadius: '4px',
                                                        fontSize: '12px'
                                                    }}>
                                                        <div><strong>Satisfied:</strong> {count.satisfied}</div>
                                                        <div><strong>Unsatisfied:</strong> {count.unsatisfied}</div>
                                                        <div style={{ 
                                                            marginTop: '5px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            Status: {status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {userdata1.length > 0 ? (
                                    userdata1.map((row) => (
                                        <tr key={row.Registration_Id}>
                                            <td>{row.Registration_Id}</td>
                                            {columns.map(col => (
                                                <td key={`${row.Registration_Id}-${col.key}`}>
                                                    <div className='checkbox-container'>
                                                        <input 
                                                            type='checkbox' 
                                                            className='custom-checkboxvenki'
                                                            checked={row[col.key] || false}
                                                            onChange={() => toggleCheckbox(row.Registration_Id, col.key)}
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + 1}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <></>
                )}

{page === "request" ? (
                    <>
                        <table className="qa-indicator-table">
                            <thead>
                                <tr>
                                    <th>Registeration ID</th>
                                    {columns2.map(col => {
                                        const count = satisfactionCounts2[col.key] || { satisfied: 0, unsatisfied: 0 };
                                        const { status, color } = getColumnStatus2(col.key);
                                        
                                        return (
                                            <th key={col.key}>
                                                <div>
                                                    {col.label}
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '5px', 
                                                        backgroundColor: color,
                                                        borderRadius: '4px',
                                                        fontSize: '12px'
                                                    }}>
                                                        <div><strong>Satisfied:</strong> {count.satisfied}</div>
                                                        <div><strong>Unsatisfied:</strong> {count.unsatisfied}</div>
                                                        <div style={{ 
                                                            marginTop: '5px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            Status: {status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {userdata2.length > 0 ? (
                                    userdata2.map((row) => (
                                        <tr key={row.Registration_Id}>
                                            <td>{row.Registration_Id}</td>
                                            {columns2.map(col => (
                                                <td key={`${row.Registration_Id}-${col.key}`}>
                                                    <div className='checkbox-container'>
                                                        <input 
                                                            type='checkbox' 
                                                            className='custom-checkboxvenki'
                                                            checked={row[col.key] || false }
                                                            onChange={() => toggleCheckbox2(row.Registration_Id, col.key)}
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + 1}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <></>
                )}


{page === "set" ? (
                    <>
                        <table className="qa-indicator-table">
                            <thead>
                                <tr>
                                    <th>Registeration ID</th>
                                    {columns3.map(col => {
                                        const count = satisfactionCounts3[col.key] || { satisfied: 0, unsatisfied: 0 };
                                        const { status, color } = getColumnStatus3(col.key);
                                        
                                        return (
                                            <th key={col.key}>
                                                <div>
                                                    {col.label}
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '5px', 
                                                        backgroundColor: color,
                                                        borderRadius: '4px',
                                                        fontSize: '12px'
                                                    }}>
                                                        <div><strong>Satisfied:</strong> {count.satisfied}</div>
                                                        <div><strong>Unsatisfied:</strong> {count.unsatisfied}</div>
                                                        <div style={{ 
                                                            marginTop: '5px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            Status: {status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {userdata3.length > 0 ? (
                                    userdata3.map((row) => (
                                        <tr key={row.Registration_Id}>
                                            <td>{row.Registration_Id}</td>
                                            {columns3.map(col => (
                                                <td key={`${row.Registration_Id}-${col.key}`}>
                                                    <div className='checkbox-container'>
                                                        <input 
                                                            type='checkbox' 
                                                            className='custom-checkboxvenki'
                                                            checked={row[col.key] || false }
                                                            onChange={() => toggleCheckbox3(row.Registration_Id, col.key)}
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + 1}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <></>
                )}




{page === "drop" ? (
                    <>
                        <table className="qa-indicator-table">
                            <thead>
                                <tr>
                                    <th>Registeration ID</th>
                                    {columns4.map(col => {
                                        const count = satisfactionCounts4[col.key] || { satisfied: 0, unsatisfied: 0 };
                                        const { status, color } = getColumnStatus4(col.key);
                                        
                                        return (
                                            <th key={col.key}>
                                                <div>
                                                    {col.label}
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '5px', 
                                                        backgroundColor: color,
                                                        borderRadius: '4px',
                                                        fontSize: '12px'
                                                    }}>
                                                        <div><strong>Satisfied:</strong> {count.satisfied}</div>
                                                        <div><strong>Unsatisfied:</strong> {count.unsatisfied}</div>
                                                        <div style={{ 
                                                            marginTop: '5px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            Status: {status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {userdata4.length > 0 ? (
                                    userdata4.map((row) => (
                                        <tr key={row.Registration_Id}>
                                            <td>{row.Registration_Id}</td>
                                            {columns4.map(col => (
                                                <td key={`${row.Registration_Id}-${col.key}`}>
                                                    <div className='checkbox-container'>
                                                        <input 
                                                            type='checkbox' 
                                                            className='custom-checkboxvenki'
                                                            checked={row[col.key] || false }
                                                            onChange={() => toggleCheckbox4(row.Registration_Id, col.key)}
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + 1}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <></>
                )}


{page === "deep" ? (
                    <>
                        <table className="qa-indicator-table">
                            <thead>
                                <tr>
                                    <th>Registeration ID</th>
                                    {columns5.map(col => {
                                        const count = satisfactionCounts5[col.key] || { satisfied: 0, unsatisfied: 0 };
                                        const { status, color } = getColumnStatus5(col.key);
                                        
                                        return (
                                            <th key={col.key}>
                                                <div>
                                                    {col.label}
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '5px', 
                                                        backgroundColor: color,
                                                        borderRadius: '4px',
                                                        fontSize: '12px'
                                                    }}>
                                                        <div><strong>Satisfied:</strong> {count.satisfied}</div>
                                                        <div><strong>Unsatisfied:</strong> {count.unsatisfied}</div>
                                                        <div style={{ 
                                                            marginTop: '5px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            Status: {status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {userdata5.length > 0 ? (
                                    userdata5.map((row) => (
                                        <tr key={row.Registration_Id}>
                                            <td>{row.Registration_Id}</td>
                                            {columns5.map(col => (
                                                <td key={`${row.Registration_Id}-${col.key}`}>
                                                    <div className='checkbox-container'>
                                                        <input 
                                                            type='checkbox' 
                                                            className='custom-checkboxvenki'
                                                            checked={row[col.key] || false }
                                                            onChange={() => toggleCheckbox5(row.Registration_Id, col.key)}
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns5.length + 1}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}

export default IPQAIndicator;
