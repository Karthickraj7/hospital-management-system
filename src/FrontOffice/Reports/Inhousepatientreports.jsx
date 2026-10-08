import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

function Inhousepatientreports() {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [DoctorList, setDoctorList] = useState([]);
    const [Department, setDepartment] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDept, setSearchDept] = useState('');
    const [Doctor_rel_patient, setDoctor_rel_patient] = useState([]);
    
    // 3-2-25
    const [dateOption, setDateOption] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchdoct, setsearchdoct] = useState('');


    console.log(searchQuery)
    console.log(searchDept)
    console.log(typeof(searchDept))
   

    // Fetch the doctor list and department list on component mount
    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/get_inhouse_doctor_list`)
            .then((res) => {
                setDoctorList(res.data);
            })
            .catch((err) => console.log(err));
    }, [UrlLink]);

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Department_Detials_link`)
            .then((res) => setDepartment(res.data))
            .catch((err) => console.log(err));
    }, [UrlLink]);
    
       
      

    // Fetch patients related to the selected doctor or by date range
    useEffect(() => {
        const fetchPatients = () => {
            // Construct the query parameters
            const params = {
                searchDept : searchDept || '',
                doctorid: searchdoct || '',
                fromDate: dateOption === 'custom' ? fromDate : '', // Include date if custom selected
                toDate: dateOption === 'custom' ? toDate : '', // Include date if custom selected
                currentDate: dateOption === 'current' ? new Date().toISOString().split('T')[0] : '',
                searchQuery : searchQuery || '', // Send current date if "current" is selected
               
                
            };
    
            axios.get(`${UrlLink}Frontoffice/get_inhouse_doctor_related_patient_list`, { params })
                .then((res) => {
                    setDoctor_rel_patient(res.data);
                })
                .catch((err) => console.log(err));
        };
    
        // Fetch patients when the doctor ID, date range, or URL changes
        fetchPatients();
    }, [UrlLink, searchdoct, searchDept ,dateOption, fromDate, toDate,searchQuery]);
    

    const handleDateOptionChange = (e) => {
       

        setDateOption(e.target.value);
     
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

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDeptChange = (e) => {
        setSearchDept(e.target.value);
    };

    const handleDoctChange = (e) => {
        setsearchdoct(e.target.value);
    };

    const DoctorListColumns = [
        { key: "patientid", name: "S.No", frozen: true },

        { key: "patientname", name: "Name", frozen: true },

        { key: "phoneno", name: "Phone No", frozen: true },

        { key: "gender", name: "Gender", frozen: true },
        
        { key: "age", name: "Age", frozen: true }
    ];

    return (
        <>
            <div className="Main_container_app">
                <h3> Inhouse Patient Reports</h3>
                <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
                    <div className="RegisForm_1">
                        <label>Search Here <span>:</span></label>
                        <input
                            type="text"
                            placeholder='Enter Patient_id, PatientName'
                            value={searchQuery}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>In-house Doctor<span>:</span></label>
                        <select name='Doctor' value={searchdoct} onChange={handleDoctChange}>
                            <option value="">Select</option>
                            {DoctorList.map((val, idx) => (
                                <option key={idx} value={val.id}>{val.Doctorname}</option>
                            ))}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Department<span>:</span></label>
                        <select name='Department' value={searchDept} onChange={handleDeptChange}>
                            <option value="">Select</option>
                            {Department.map((val, idx) => (
                                <option key={idx} value={val.DepartmentName}>{val.DepartmentName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Date<span>:</span></label>
                        <select value={dateOption} onChange={handleDateOptionChange}>
                            <option value="select">All</option>
                            <option value="current">Current Date</option>
                            <option value="custom">Custom Date</option>
                        </select>
                        {dateOption === 'custom' && (
                            <div className="RegisForm_1">
                                <label>From<span>:</span></label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={handleFromDateChange}
                                />
                                <label>To<span>:</span></label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={handleToDateChange}
                                />
                            </div>
                        )}
                    </div>

                    <ReactGrid columns={DoctorListColumns} RowData={Doctor_rel_patient} />
                </div>
            </div>
        </>
    );
}

export default Inhousepatientreports;
