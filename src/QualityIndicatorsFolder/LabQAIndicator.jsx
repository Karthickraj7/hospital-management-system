import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './QA.css';

function LabQAIndicator() {
    const navigate = useNavigate();
    const [userdata, setUserdata] = useState([]);
    const [userdata2, setUserdata2] = useState([]);
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
        
        { key: 'LabReportingErrorRates', label: 'Reporting error rates (per 1000) in laboratory' },
        { key: 'LabRedosPercentage', label: 'Percentage of re-dos in laboratory' },
        { key: 'LabReportsVsClinicalDiagnosis', label: 'Percentage of lab reports co-relating with clinical diagnosis' },
        { key: 'LabSafetyPrecautionAdherence', label: 'Percentage of adherence to safety precautions by employees working in labs' },
        { key: 'ErrorProneAbbreviations', label: 'Percentage of medical records with error-prone abbreviations' },
        { key: 'HandHygieneCompliance', label: 'Hand Hygiene Compliance' }
      ];

      const columns2 = [
        
        { key: 'PatientFallRate', label: 'Patient fall rate per 1000 patient days' },
        { key: 'NearMissesPercentage', label: 'Percentage of near misses' },
        { key: 'NeedlestickInjuryRate', label: 'Needlestick injury rate' },
        { key: 'IncompleteConsentRecords', label: 'Percentage of medical records having incomplete and improper consent' },
      ];
      
      

      useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                let query = '';
                
                if (dateOption === 'current' && CurrentDate) {
                    query += `&date=${CurrentDate}`;
                } else if (dateOption === 'custom' && fromDate && toDate) {
                    query += `&from=${fromDate}&to=${toDate}`;
                } else if (dateOption === 'particular' && ParticularDate) {
                    query += `&date=${ParticularDate}`;
                }
    
                if (searchQuery.trim()) {
                    query += `&search=${encodeURIComponent(searchQuery.trim())}`;
                }
    
                const res1 = await axios.get(`${UrlLink}QualityIndicators/get_lab_quality_metrics?${query}`);
                const res2 = await axios.get(`${UrlLink}QualityIndicators/get_lab_quality_metrics_2?${query}`);
    
                if (Array.isArray(res1.data?.data)) {
                    setUserdata(res1.data.data);
                    calculateSatisfactionCounts(res1.data.data);
                }
    
                if (Array.isArray(res2.data?.data)) {
                    setUserdata2(res2.data.data);
                    calculateSatisfactionCounts2(res2.data.data);
                }
            } catch (error) {
                console.error("Error fetching filtered data", error);
            }
        };
    
        fetchFilteredData();
    }, [dateOption, fromDate, toDate, ParticularDate, CurrentDate, searchQuery, UrlLink]);
    
    
 // Calculate satisfaction counts for each column
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
     const toggleCheckbox = (RequestId, columnKey) => {
        const updatedData = userdata.map(row => {
            if (row.Request_Id === RequestId) {
                // Toggle the satisfaction state for this specific column and employee
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        setUserdata(updatedData);
        calculateSatisfactionCounts(updatedData);
    };
    const toggleCheckbox2 = (RequestId, columnKey) => {
        const updatedData = userdata2.map(row => {
            if (row.Request_Id === RequestId) {
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
                                    <th>LAB Request ID</th>
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
                                        <tr key={row.Request_Id}>
                                            <td>{row.Request_Id}</td>
                                            {columns.map(col => (
                                                <td key={`${row.Request_Id}-${col.key}`}>
                                                    <div className='checkbox-container'>
                                                        <input 
                                                            type='checkbox' 
                                                            className='custom-checkboxvenki'
                                                            checked={row[col.key] || false}
                                                            onChange={() => toggleCheckbox(row.Request_Id, col.key)}
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
                                    <th>LAB Request ID</th>
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
                                        <tr key={row.Request_Id}>
                                            <td>{row.Request_Id}</td>
                                            {columns2.map(col => (
                                                <td key={`${row.Request_Id}-${col.key}`}>
                                                    <div className='checkbox-container'>
                                                        <input 
                                                            type='checkbox' 
                                                            className='custom-checkboxvenki'
                                                            checked={row[col.key] || false}
                                                            onChange={() => toggleCheckbox2(row.Request_Id, col.key)}
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

export default LabQAIndicator;
