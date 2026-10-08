import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckBox } from '@mui/icons-material';
import './QA.css';  // Import the external CSS

function OTQAIndicator() {
    const [userdata, setUserdata] = useState([]);
    const navigate = useNavigate();
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [page, setPage] = useState("raise")
    const [satisfactionCounts, setSatisfactionCounts] = useState({});
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
 
        { key: 'AnaesthesiaPlanModification', label: 'Percentage of modification of anaesthesia plan' },
        { key: 'UnplannedVentilationAfterAnaesthesia', label: 'Percentage of unplanned ventilation following anaesthesia' },
        { key: 'ReschedulingOfSurgeries', label: 'Percentage of re-scheduling of surgeries' },
        { key: 'SurgicalSafetyCompliance', label: 'Compliance rate to surgical safety practices' },
        { key: 'ProphylacticAntibioticTimeframe', label: 'Percentage of cases who received prophylactic antibiotic within specified time-frame' },
        { key: 'TransfusionReactions', label: 'Percentage of transfusion reactions' },
        { key: 'IncompleteImproperConsentRecords', label: 'Percentage of medical records having incomplete and improper consent' }
      ];
      
      useEffect(() => {
        const fetchData = async () => {
            try {
                let query = '';
    
                // Build query based on date option
                if (dateOption === 'current' && CurrentDate) {
                    query += `date=${CurrentDate}`;
                } else if (dateOption === 'custom' && fromDate && toDate) {
                    query += `from=${fromDate}&to=${toDate}`;
                } else if (dateOption === 'particular' && ParticularDate) {
                    query += `date=${ParticularDate}`;
                }
    
                // Append search query if present
                if (searchQuery.trim()) {
                    query += (query ? '&' : '') + `search=${encodeURIComponent(searchQuery)}`;
                }
    
                const response = await fetch(`${UrlLink}QualityIndicators/get_all_OT_patient_for_QA?${query}`);
                const data = await response.json();
    
                if (response.ok) {
                    setUserdata(data.data);
                    calculateSatisfactionCounts(data.data);
                } else {
                    console.error("Error fetching data: ", data.error);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
    
        fetchData();
    }, [UrlLink, dateOption, fromDate, toDate, ParticularDate, CurrentDate, searchQuery]);
    

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
    const handleBack = () => {
        navigate("/Home/QualityIndicatorsFolder");
    };

      // Toggle checkbox state
      const toggleCheckbox = (BookingId, columnKey) => {
        const updatedData = userdata.map(row => {
            if (row.Booking_Id === BookingId) {
                // Toggle the satisfaction state for this specific column and employee
                return { ...row, [columnKey]: !row[columnKey] };
            }
            return row;
        });

        setUserdata(updatedData);
        calculateSatisfactionCounts(updatedData);
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
<select value={dateOption} onChange={handleDateOptionChange} style={{backgroundColor:'white'}} >
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
         
                {/* {page === "raise" ? ( */}
                    <>
                        <table className="qa-indicator-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
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
                                        <tr key={row.Booking_Id}>
                                            <td>{row.Booking_Id}</td>
                                            {columns.map(col => (
                                                <td key={`${row.Booking_Id}-${col.key}`}>
                                                    <div className='checkbox-container'>
                                                        <input 
                                                            type='checkbox' 
                                                            className='custom-checkboxvenki'
                                                            checked={row[col.key] || false}
                                                            onChange={() => toggleCheckbox(row.Booking_Id, col.key)}
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
                {/* ) : ( */}
                    {/* <></> */}
                {/* )} */}






            </div>
        </>
    );
}

export default OTQAIndicator;

