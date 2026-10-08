import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
// import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const PatientRegistrationSummary = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const [searchQuery, setSearchQuery] = useState('');

  const [PatientList, setPatientList] = useState([]);

  const [dateOption, setDateOption] = useState('current');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  

  const PatientListColumns = [
    {
        key: "id",
        name: "S.No",
        frozen: true
    },
    {
        key: "PatientId",
        name: "Patient Id",
        frozen: true
    },
   
    {
        key: "PatientName",
        name: "Patient Name",
        frozen: true
    },
    
    {
        key: "Age",
        name: "Age",
    },
    {
        key: "Gender",
        name: "Gender",
    },

   
    
]

useEffect(() => {
  const params = searchQuery.trim()
    ? { search: searchQuery }
    : { limit: 10 }; // Default limit if no search query

  if (dateOption === 'custom') {
    if (fromDate && toDate) {
      params.fromDate = fromDate;
      params.toDate = toDate;
    } else {
      setPatientList([]); // Clear the data if both dates are not provided
      return;
    }
  } else if (dateOption === 'current') {
    const today = new Date().toISOString().split('T')[0];
    params.fromDate = today;
    params.toDate = today;
  }

  axios
    .get(`${UrlLink}Frontoffice/get_Patient_Registration_Summary_Details`, { params }) // Pass `params` correctly
    .then((res) => setPatientList(res.data))
    .catch(console.log);
}, [searchQuery, dateOption, fromDate, toDate, UrlLink]);




  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateOptionChange = (e) => {
    setDateOption(e.target.value);
    // Clear the dates if switching back to "Current Date"
    if (e.target.value === 'current') {
      setFromDate('');
      setToDate('');
    }
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };



  return (
    <>
      <div className="Main_container_app">
      <h3>Patient Registration Summary</h3>
        <div className="RegisFormcon_1" style={{marginTop:'10px'}}>
        <div className="RegisFormcon_1">
            <div className="RegisForm_1">
                <label> Search Here <span>:</span> </label>
                <input
                type="text"
                placeholder='Enter PatientId, PatientName, or CasesheetNo'
                value={searchQuery}
                onChange={handleChange}
                />
            </div>

            <div className="RegisForm_1">
                <label> Date <span>:</span> </label>
                <select 
                    value={dateOption} 
                    onChange={handleDateOptionChange}
                >
                    <option value="current">Current Date</option>
                    <option value="custom">Custom Date</option>
                </select>
                {dateOption === 'custom' && (
                    <div className="RegisForm_1">
                    <label> From  <span>:</span> </label>

                    <input
                        type="date"
                        placeholder="From Date"
                        value={fromDate}
                        onChange={handleFromDateChange}
                    />
                    <label> To  <span>:</span> </label>

                    <input
                        type="date"
                        placeholder="To Date"
                        value={toDate}
                        onChange={handleToDateChange}
                    />
                    </div>
                )}
            </div>
        </div>
        
        <div className='RegisFormcon_1 jjxjx_'>
            <ReactGrid columns={PatientListColumns} RowData={PatientList} />
          
            </div>
       </div>
      </div>
      
    </>
  )
}

export default PatientRegistrationSummary;
























