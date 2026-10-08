    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useSelector } from 'react-redux';
    import axios from 'axios';
    import './QA.css';

    function RadiologyQAIndicator () {
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
            
            { key: 'reporting_error_rate', name: 'Reporting error rates (per 1000) in laboratory' },
            { key: 'redo_percentage', name: 'Percentage of re-dos in laboratory' },
            { key: 'clinical_correlation', name: 'Percentage of lab reports co-relating with clinical diagnosis' },
            { key: 'safety_adherence', name: 'Percentage of adherence to safety precautions by employees working in labs' },
            { key: 'abbreviation_errors', name: 'Percentage of medical records with error-prone abbreviations' },
            { key: 'hand_hygiene', name: 'Hand Hygiene Compliance' },
          ];
          
          const columns2 = [
            // { key: 'registration_id', name: 'Registration ID' },
            { key: 'patient_fall_rate', name: 'Patient fall rate per 1000 patient days' },
            { key: 'near_miss_percentage', name: 'Percentage of near misses' },
            { key: 'needlestick_injury_rate', name: 'Needlestick injury rate' },
            { key: 'incomplete_consent_percentage', name: 'Percentage of medical records having incomplete and improper consent' },
          ];
          
          useEffect(() => {
            const getFilteredData = () => {
                let url = `${UrlLink}QualityIndicators/get_Radiology_quality_metrics?`;
        
                // Add the date filters to the URL query string
                if (dateOption === 'custom') {
                    if (fromDate && toDate) {
                        url += `from=${fromDate}&to=${toDate}`;
                    }
                } else if (dateOption === 'particular') {
                    if (ParticularDate) {
                        url += `date=${ParticularDate}`;
                    }
                }
        
                // Handle current date (if necessary, you can add current date filter)
                if (dateOption === 'current') {
                    url += `currentDate=${CurrentDate}`;
                }
        
                if (searchQuery) {
                    url += `&search=${searchQuery}`;
                }
        
                // Fetch filtered data
                axios.get(url)
                    .then(res => {
                        console.log('API Response:', res.data); // Debugging
                        if (res.data && Array.isArray(res.data.data)) {
                            setUserdata(res.data.data); // Correcting data assignment
                            calculateSatisfactionCounts(res.data.data);
                        } else {
                            console.error('Unexpected API response format:', res.data);
                        }
                    })
                    .catch(error => {
                        console.error('API Error:', error);
                    });
            };
        
            getFilteredData();
        }, [UrlLink, fromDate, toDate, ParticularDate, dateOption, searchQuery]);
        useEffect(() => {
            const getFilteredData = () => {
                let url = `${UrlLink}QualityIndicators/get_Radiology_quality_metrics_2?`;
        
                // Add the date filters to the URL query string
                if (dateOption === 'custom') {
                    if (fromDate && toDate) {
                        url += `from=${fromDate}&to=${toDate}`;
                    }
                } else if (dateOption === 'particular') {
                    if (ParticularDate) {
                        url += `date=${ParticularDate}`;
                    }
                }
        
                // Handle current date (if necessary, you can add current date filter)
                if (dateOption === 'current') {
                    url += `currentDate=${CurrentDate}`;
                }
        
                if (searchQuery) {
                    url += `&search=${searchQuery}`;
                }
        
                // Fetch filtered data
                axios.get(url)
                    .then(res => {
                        console.log('API Response:', res.data); // Debugging
                        if (res.data && Array.isArray(res.data.data)) {
                            setUserdata2(res.data.data); // Correcting data assignment
                            calculateSatisfactionCounts2(res.data.data);
                        } else {
                            console.error('Unexpected API response format:', res.data);
                        }
                    })
                    .catch(error => {
                        console.error('API Error:', error);
                    });
            };
        
            getFilteredData();
        }, [UrlLink, fromDate, toDate, ParticularDate, dateOption, searchQuery]);
        
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


// Calculate satisfaction counts for each column
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
    const toggleCheckbox = (employeeId, columnKey) => {
        const updatedData = userdata.map(row => {
            if (row.Request_Id === employeeId) {
                // Toggle the satisfaction state for this specific column and employee
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        setUserdata(updatedData);
        calculateSatisfactionCounts(updatedData);
    };

      // Toggle checkbox state
      const toggleCheckbox2 = (employeeId, columnKey) => {
        const updatedData = userdata2.map(row => {
            if (row.Request_Id === employeeId) {
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
                                <input type="radio" id='raise' name="page" value={'raise'} onChange={(e) => setPage(e.target.value)} checked={page === 'raise'} />
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
                                    <th>Request ID</th>
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
                                    <th>Request ID</th>
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

    export default RadiologyQAIndicator;
