import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './QA.css';

function OPDQAIndicator() {
    const [userdata, setUserdata] = useState([]);
    const [userdata2, setUserdata2] = useState([]);
    const navigate = useNavigate();
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [page, setPage] = useState("raise");
    const [satisfactionCounts, setSatisfactionCounts] = useState({});
    const [satisfactionCounts2, setSatisfactionCounts2] = useState({});
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



    const columns = [
      
        { key: 'LabReportsVsClinicalDiagnosis', label: 'Lab Reports vs Clinical Diagnosis' },
        { key: 'AdverseDrugReactions', label: 'Adverse Drug Reactions' },
        { key: 'HighRiskDrugReactions', label: 'High-Risk Drug Reactions' },
        { key: 'ErrorProneAbbreviations', label: 'Error-Prone Abbreviations' },
        { key: 'WrongPatientIdentificationErrors', label: 'Wrong Patient Identification Errors' },
        { key: 'HandHygieneCompliance', label: 'Hand Hygiene Compliance' },
      ];

      const columns2 = [
       
        { key: 'PrescriptionCompliance', label: 'Prescription Compliance' },
        { key: 'PatientFallRate', label: 'Patient Fall Rate' },
        { key: 'PressureUlcerRate', label: 'Pressure Ulcer Rate' },
        { key: 'OutPatientSatisfaction', label: 'Out-Patient Satisfaction' },
        { key: 'NearMisses', label: 'Near Misses' },
        { key: 'NeedlestickInjuries', label: 'Needlestick Injuries' },
        { key: 'RecordsMissingICDCodes', label: 'Records Missing ICD Codes' }
      ];
      const buildFilterParams = () => {
        let filters = {
            search: searchQuery,
            dateOption,
        };
    
        if (dateOption === 'current') {
            filters.date = CurrentDate;
        } else if (dateOption === 'custom') {
            filters.fromDate = fromDate;
            filters.toDate = toDate;
        } else if (dateOption === 'particular') {
            filters.date = ParticularDate;
        }
    
        return filters;
    };
    
      

    useEffect(() => {
        const filters = buildFilterParams();
    
        axios.post(`${UrlLink}QualityIndicators/get_patient_details_OP_for_QA`, filters)
            .then(res => {
                if (res.data && Array.isArray(res.data.data)) {
                    setUserdata(res.data.data);
                    calculateSatisfactionCounts(res.data.data);
                }
            })
            .catch(error => {
                console.error('API Error:', error);
            });
    }, [UrlLink, searchQuery, dateOption, fromDate, toDate, ParticularDate, CurrentDate]);
    

    useEffect(() => {
        const filters = buildFilterParams();
    
        axios.post(`${UrlLink}QualityIndicators/get_patient_details_OP_for_QA_2`, filters)
            .then(res => {
                if (res.data && Array.isArray(res.data.data)) {
                    // ✅ Ensure all checkbox values are proper booleans
                    const normalized = res.data.data.map(item => {
                        const normalizedItem = { ...item };
                        columns2.forEach(col => {
                            normalizedItem[col.key] = Boolean(item[col.key]) === true;
                        });
                        return normalizedItem;
                    });
    
                    setUserdata2(normalized);
                    calculateSatisfactionCounts2(normalized);
                }
            })
            .catch(error => {
                console.error('API Error:', error);
            });
    }, [UrlLink, searchQuery, dateOption, fromDate, toDate, ParticularDate, CurrentDate]);
    
    

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

    const handleBack = () => navigate("/Home/QualityIndicatorsFolder");


       // Toggle checkbox state
       const toggleCheckbox = (RegistrationId, columnKey) => {
        const updatedData = userdata.map(row => {
            if (row.Registration_Id === RegistrationId) {
                // Toggle the satisfaction state for this specific column and employee
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        setUserdata(updatedData);
        calculateSatisfactionCounts(updatedData);
    };
    const toggleCheckbox2 = (RegistrationId, columnKey) => {
        const updatedData = userdata2.map(row => {
            if (row.Registration_Id === RegistrationId) {
                // Toggle the satisfaction state for this specific column and employee
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        setUserdata2(updatedData);
        calculateSatisfactionCounts2(updatedData);
    };

    // Determine column status (satisfied, unsatisfied, or moderate)
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
                            <input type="radio" name="page" id='raise' value={'raise'} onChange={(e) => setPage(e.target.value)} checked={page === 'raise'} />
                            <label htmlFor='raise'>Page 1</label>
                        </div>
                        <div className="registertypeval" style={{ marginLeft: "30px" }}>
                            <input type="radio" name="page" id='issue' value={'issue'} onChange={(e) => setPage(e.target.value)} checked={page === 'issue'} />
                            <label htmlFor='issue'>Page 2</label>
                        </div>
                    </div>
                </div>
                {page === "raise" ? (
                    <>
                        <table className="qa-indicator-table">
                            <thead>
                                <tr>
                                    <th>Registration ID</th>
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
                                {userdata.length > 0 ? (
                                    userdata.map((row) => (
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
                {page === "issue" ? (
                    <>
                        <table className="qa-indicator-table">
                            <thead>
                                <tr>
                                    <th>Registration ID</th>
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
                                                            checked={row[col.key] || false}
                                                            onChange={() => toggleCheckbox2(row.Registration_Id, col.key)}
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns2.length + 1}>No data available</td>
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

export default OPDQAIndicator;
