import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from 'react-router-dom';
import Diversity1Icon from "@mui/icons-material/Diversity1";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import './PatientLab.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoupeIcon from "@mui/icons-material/Loupe";

import AddCircleIcon from '@mui/icons-material/AddCircle';

// import Tooltip from '@mui/material/Tooltip';

import { Tooltip } from 'react-tooltip';

const PatientLablist = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);
    const navigate = useNavigate();
    const dispatchvalue = useDispatch();

    const [todayCount, setTodayCount] = useState(0);
    const [monthlyCount, setMonthlyCount] = useState(0);
    const [yearlyCount, setYearlyCount] = useState(0);
    
    const [PatientData, setPatientData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    

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
    

    useEffect(() => {
        const params = {};
    
        if (searchQuery?.trim()) {
            params.search = searchQuery.trim();
        } else {
            params.limit = 10; // Default limit if no search 
        }


        if (/^\d{10}$/.test(searchQuery)) {
            params.search = searchQuery; // ✅ Fix: use searchQuery directly for mobile number
        } else if (searchQuery.trim()) { // ✅ Fix: No need for searchQuery.query
            const nameParts = searchQuery.trim().split(" ");
            if (nameParts.length === 1) params.search = nameParts[0];
            if (nameParts.length === 2) params.search = nameParts[1];
            if (nameParts.length > 2) {
                params.search = nameParts.slice(1, -1).join(" ");
                params.search = nameParts[nameParts.length - 1];
            }
        }
    
        if (dateOption === 'custom') {
            if (fromDate && toDate) {
                params.fromDate = fromDate;
                params.toDate = toDate;
            } else {
                setPatientData([]); // Clear the data if both dates are not provided
                return;
            }
        } else if (dateOption === 'current') {
            if (CurrentDate){
                params.CurrentDate = CurrentDate;

            } else {
                setPatientData([]); 
                return;
            }
            
            
           
        } else if (dateOption === 'particular') {
            if (ParticularDate) {
                params.ParticularDate = ParticularDate;
                
            } else {
                setPatientData([]); // Clear data if no particular date is selected
                return;
            }
        }
    
        if (genderFilter) {
            params.gender = genderFilter;
        }
    
        console.log(params,'params');
        
        axios.get(`${UrlLink}Frontoffice/Patients_Management_Filter`, { params })
            .then((res) => {
                const data = res.data;
                console.log(data);
                
                if (Array.isArray(data)) {
                    setPatientData(data);
                } else {
                    setPatientData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    
    }, [UrlLink, searchQuery, genderFilter, dateOption, fromDate, toDate, ParticularDate,CurrentDate]);
    

    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/Patients_Counts`)
        .then((res) => {
            const { today_count, month_count, year_count } = res.data;
            setTodayCount(today_count);
            setMonthlyCount(month_count);
            setYearlyCount(year_count);
        })
        .catch((err) => {
            console.log('Error fetching counts:', err);
        });
    }, [UrlLink]);


    
    
    // useEffect(() => {
    //     axios.get(`${UrlLink}Frontoffice/Patients_Management_Filter`, {
    //         params: { search: searchQuery, gender: genderFilter }
    //     })
    //     .then((res) => {
    //         const data = res.data;
    
    //         if (Array.isArray(data)) {
    //             // Calculate today's date and the current month/year
    //             const today = new Date();
    //             const todayDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    //             const currentMonth = today.getMonth();
    //             const currentYear = today.getFullYear();
    
    //             // Calculate counts
    //             const todayPatients = data.filter(patient => patient.date === todayDate).length;
    //             const monthPatients = data.filter(patient => {
    //                 const patientDate = new Date(patient.date);
    //                 return patientDate.getMonth() === currentMonth && patientDate.getFullYear() === currentYear;
    //             }).length;
    //             const yearPatients = data.filter(patient => {
    //                 const patientDate = new Date(patient.date);
    //                 return patientDate.getFullYear() === currentYear;
    //             }).length;
    
    //             // Update state
    //             setTodayCount(todayPatients);
    //             setMonthlyCount(monthPatients);
    //             setYearlyCount(yearPatients);
    
    //             setPatientData(data);
    //         } else {
    //             setPatientData([]);
    //             setTodayCount(0);
    //             setMonthlyCount(0);
    //             setYearlyCount(0);
    //         }
    //     })
    //     .catch((err) => {
    //         console.log('Error:', err);
    //     });
    // }, [UrlLink, searchQuery, genderFilter]);
    

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGenderFilter(event.target.value);
    };


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
    

    const handlenewPatientRegister = () => {
        dispatchvalue({ type: "Registeredit", value: {} });
        dispatchvalue({ type: "HrFolder", value:"NewBasicRegistation"});
        navigate("/Home/FrontOfficeFolder");
      };

    const handlePatientProfile = (patient) => {
        console.log("row",patient)
        
            const { PatientId } = patient;
            
            // Dispatch the PatientId to the Redux store
            dispatchvalue({ type: 'PatientLablistId', value: { PatientId } });
            
            // Log the PatientId after dispatching
            const updatedPatientListId = { PatientId }; // Capture the PatientId
            console.log(updatedPatientListId, 'PatientId after dispatch');

            navigate('/Home/PatientLabProfile');
        dispatchvalue({ type: 'HrFolder', value:'PatientLabProfile'});
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });



        };

    const PatientOPRegisterColumns = [
        { key: "id", name: "ID", frozen: pagewidth > 500 },
        { key: "PatientId", name: "Patient Id", frozen: pagewidth > 500 },
        { key: "FullName", name: "Patient Name", width: 150, frozen: pagewidth > 500 },
        { key: "PhoneNo", name: "PhoneNo", frozen: pagewidth > 500 },
        { key: "Gender", name: "Gender" },
        { key: "Email", name: "Email" },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditPatientDetails(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },

        {
            key: "view-action", // Unique key for the view action
            name: "View",
            renderCell: (params) => (
                <>
                    <Button
                        key={`view-${params.row.id}`} // Unique key for the VisibilityIcon
                        className="cell_btn"
                        onClick={() => handlePatientProfile(params.row)}
                    >
                        <VisibilityIcon
                            key={`view-icon-${params.row.id}`} // Unique key for the icon
                            className="check_box_clrr_cancell"
                        />
                    </Button>
                </>
            ),
        },

       
    ];

    


    // const handleeditPatientDetails = (params) => {
    //     console.log('params',params)
    //     const { PatientId } = params;
    //     axios.get(`${UrlLink}Frontoffice/Patient_Master_List`, { params: { PatientId: PatientId} })
    //         .then((res) => {
    //             console.log(res);
    //             dispatchvalue({ type: 'PatientListId', value: { ...res.data } });
    //             navigate('/Home/PatientDetailsEdit');
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }


    const handleeditPatientDetails = (patient) => {
        console.log(patient, '1234567');
    
        const { PatientId } = patient;
        
        // Dispatch the PatientId to the Redux store
        dispatchvalue({ type: 'PatientLablistId', value: { PatientId } });
        
        // Log the PatientId after dispatching
        const updatedPatientListId = { PatientId }; // Capture the PatientId
        console.log(updatedPatientListId, 'PatientId after dispatch');
    
        // Navigate to the PatientDetailsEdit page
        dispatchvalue({ type: "HrFolder", value: "PatientDetailsEdit" });

        navigate('/Home/FrontOfficeFolder');

        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    };


    return (
        <>
            <div className="Main_container_app">
                <div className='DivCenter_container'>Patients List </div>
                
                <div className="con_1 ">
                    {/* <div className="chart_body_1_main_1_container"> */}
                    <div className="chart_body_1_child_1 dww3">
                        <div className="chart_body_1_child_1_body">
                            <div className="chart_body_1_child_1_body_icon">
                            <PersonAddAlt1Icon />
                            </div>
                            <div className="chart_body_1_child_1_body_count">
                            {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
                            {/* <h3>20</h3> */}
                            <h2>{todayCount}</h2>

                            </div>
                            <div className="chart_body_1_child_1_body_name">
                            Today Patients
                            </div>
                        </div>
                    </div>
                    
                    <div className="chart_body_1_child_1 dww3">
                        <div className="chart_body_1_child_1_body">
                            <div className="chart_body_1_child_1_body_icon">
                            <PersonIcon />
                            </div>
                            <div className="chart_body_1_child_1_body_count">
                            {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
                            {/* <h3>30</h3> */}
                            <h2>{monthlyCount}</h2>
                            </div>
                            <div className="chart_body_1_child_1_body_name">
                            Monthly Patients
                            </div>
                        </div>
                    </div>
                    {/* </div> */}

                   
                    <div className="chart_body_1_child_1 dww3">
                        <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                            <Diversity1Icon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                            {/* <h3>{patientscount[2]?.yearpatients ?? "0"}</h3> */}
                            {/* <h3>50</h3> */}
                            <h2>{yearlyCount}</h2>
                        </div>
                        <div className="chart_body_1_child_1_body_name">
                            Yearly Patients
                        </div>
                        </div>
                    </div>
                   
                </div>

                <div className="search_div_bar">
                   
                    <button
                        className="RegisterForm_1_btns choose_file_update"
                        onClick={handlenewPatientRegister}
                        data-tooltip-id="add-patient-tooltip"
                    >
                        <AddCircleIcon />
                    </button>
                  

                    <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />

                    <div className="RegisForm_1">
                        <label>Search here<span>:</span></label>
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder=' Aadhar or Name or PhoneNo or Patient ID '
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>Gender<span>:</span></label>
                        <select
                            value={genderFilter}
                            onChange={handleGenderChange}
                        >
                            <option value=''>Select</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
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
                            <option value="particular">Particular Date</option>
                        </select>

                        {dateOption === 'current' && (
                            <div className="RegisForm_1">
                                <input
                                type="date"
                                value={CurrentDate}
                                disabled
                                onChange={handleCurrentDateChange}
                                />
                            </div>
                        )}

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

                        {/* Particular Date Input */}
                        <br/>
                        {dateOption === 'particular' && (
                            <div className="RegisForm_1">
                                <label> Select Date <span>:</span> </label>
                                <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                            </div>
                        )}
                    </div>

                    
                    {/* <Tooltip title="New Patient Register" arrow>
                        <button
                            className="RegisterForm_1_btns choose_file_update"
                            onClick={handlenewPatientRegister}
                            title="New Patient Register"
                            >
                            <AddCircleIcon />
                           
                        </button>
                    </Tooltip> */}

                     {/* <LoupeIcon /> */}

                    


                </div>
                <ReactGrid columns={PatientOPRegisterColumns} RowData={PatientData} />
            </div>
        </>
    );
};

export default PatientLablist;
