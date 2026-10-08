import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const RegistrationByReferralReport = () => {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [PatientList,setPatientList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDept,setSearchDept] = useState('');
    const [searchDoct,setSearchDoct] = useState('');
    const [doctorData, setDoctordata] = useState([]);

  const [dateOption, setDateOption] = useState('current');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
      };

    const handleDeptChange = (e) => {
        setSearchDept(e.target.value);
      };

    const handleDoctChange = (e) => {
        setSearchDoct(e.target.value);
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

      


    const PatientListColumns = [
        {
            key: "id",
            name: "S.No",
            frozen: true
        },
        {
            key: "patientname",
            name: "Patient Name",
            frozen: true
        },
        {
          key: "PhoneNo",
          name: "Phone No",
          frozen: true
      },
        {
            key: "doctorname",
            name: "Doctor Name",
            frozen: true
        }
    ]
   useEffect(()=>{

    const params = searchQuery.trim()
      ? { search: searchQuery }
      : { limit: 10 };

    params.dept = searchDept;
    params.doct = searchDoct;

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
       axios.get(`${UrlLink}Frontoffice/get_referal_patient_report_details`,{ params })
      .then((res) => setPatientList(res.data))
      .catch(console.log);

   },[UrlLink,searchQuery,searchDept,dateOption,fromDate,toDate,searchDoct])
   console.log(PatientList,'patientlist');
  //  useEffect(() => {
  //   const params = searchQuery.trim()
  //     ? { search: searchQuery }
  //     : { limit: 10 }; // Default limit if no search query

  //     params.dept = searchDept;
  //     params.doct = searchDoct;
  
  //   // if (dateOption === 'custom') {
  //   //   if (fromDate && toDate) {
  //   //     params.fromDate = fromDate;
  //   //     params.toDate = toDate;
  //   //   } else {
  //   //     setPatientList([]); // Clear the data if both dates are not provided
  //   //     return;
  //   //   }
  //   // } else if (dateOption === 'current') {
  //   //   const today = new Date().toISOString().split('T')[0];
  //   //   params.fromDate = today;
  //   //   params.toDate = today;
  //   // }
  
  //   axios
  //     .get(`${UrlLink}Frontoffice/get_referal_patient_report_details`, { params }) // Pass `params` correctly
  //     .then((res) => setPatientList(res.data))
  //     .catch(console.log);
  // }, [searchQuery,searchDept, dateOption, fromDate, toDate, UrlLink]);


   useEffect(() => {
    axios.get(`${UrlLink}Frontoffice/get_referal_doctor_report_details`)
      .then((res) => {
        const ress = res.data;
        setDoctordata(ress);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])


  useEffect(() => {
    axios.get(`${UrlLink}Frontoffice/get_referal_doctor_by_dept?dept=${searchDept}`)
      .then((res) => {
        const ress = res.data;
        setDoctordata(ress);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [searchDept])

  return (
    <>
    <div className="Main_container_app">
    <h3> Referral Patient Report</h3>
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
                <label> Department <span>:</span> </label>
                <select 
                    value={searchDept} 
                    onChange={handleDeptChange}
                >
                    <option value="">All</option>
                    <option value="1">IP</option>
                    <option value="2">OP</option>
                    <option value="3">CASUALITY</option>
                    <option value="4">DIAGNOSIS</option>
                    <option value="5">Lab</option>
                </select>
            </div>

            <div className="RegisForm_1">
                <label> Doctor Name <span>:</span> </label>
                <select 
                    value={searchDoct} 
                    onChange={handleDoctChange}
                >
                
                    <option value=''>All</option>
              {
                
                doctorData.map((p,indx) => (
                  <option key={indx} value={p.Did}>{p.DoctorName}</option>
                ))
              }
                </select>

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

export default RegistrationByReferralReport;