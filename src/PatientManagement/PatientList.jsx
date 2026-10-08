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
import './Patient.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoupeIcon from "@mui/icons-material/Loupe";

import AddCircleIcon from '@mui/icons-material/AddCircle';

// import Tooltip from '@mui/material/Tooltip';

import { Tooltip } from 'react-tooltip';
import SmartCard from "../FrontOffice/Registration/SmartCard";
import AllPatienbarcode from '../FrontOffice/RegistrationList/AllPatientbarcode';
// import SmartCard from "../SmartCard";

const PatientList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const UserData = useSelector(state => state.userRecord?.UserData)
    
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);
    const navigate = useNavigate();
    const dispatchvalue = useDispatch();

    const [todayCount, setTodayCount] = useState(0);
    const [monthlyCount, setMonthlyCount] = useState(0);
    const [yearlyCount, setYearlyCount] = useState(0);
    
    const [PatientData, setPatientData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [AbhaYesOrNo, setAbhaYesOrNo] = useState('');
    console.log(AbhaYesOrNo,'AbhaYesOrNo');
    
    const [genderFilter, setGenderFilter] = useState('');

    const [dateOption, setDateOption] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [ParticularDate, setParticularDate] = useState('');
    const [CurrentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
    const [selectedrow, setselectedrow] = useState(false);
    const [smartCardDetailes, setSmartCardDetailes] = useState({});
    
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    console.log(selectedRowData,'selectedRowData');
    


    const handleOpenModal = (modalType, rowData) => {

        setOpenModal(modalType);
        setSelectedRowData(rowData);
    };

    const handleCloseModal = () => {
        setOpenModal(null);
        setSelectedRowData(null);
    };


    useEffect(() => {
        if (dateOption === 'current') {
            setCurrentDate(new Date().toISOString().split('T')[0]); // Auto-set today
        }
    }, [dateOption]);
    

    useEffect(() => {
    const controller = new AbortController(); 
    const signal = controller.signal; 

    const params = {};

    if (searchQuery?.trim()) {
        params.search = searchQuery.trim();
    } else {
        params.limit = 10; // Default limit if no search
    }

    if (/^\d{10}$/.test(searchQuery)) {
        params.search = searchQuery; // Use searchQuery directly for mobile number
    } else if (searchQuery.trim()) {
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
            setPatientData([]);
            return;
        }
    } else if (dateOption === 'current') {
        if (CurrentDate) {
            params.CurrentDate = CurrentDate;
        } else {
            setPatientData([]);
            return;
        }
    } else if (dateOption === 'particular') {
        if (ParticularDate) {
            params.ParticularDate = ParticularDate;
        } else {
            setPatientData([]);
            return;
        }
    }

    if (genderFilter) {
        params.gender = genderFilter;
    }

    if (AbhaYesOrNo) {
        params.Abha = AbhaYesOrNo;
    }

    console.log(params, 'params');

    axios.get(`${UrlLink}Frontoffice/Total_Patients_Count`, { 
        params,
        signal // Pass the AbortController signal to axios
    })
        .then((res) => {
            const { patients, counts } = res.data;

            if (Array.isArray(patients)) {
                setPatientData(patients);
            } else {
                setPatientData([]);
            }

            if (counts) {
                setTodayCount(counts.today_count || 0);
                setMonthlyCount(counts.month_count || 0);
                setYearlyCount(counts.year_count || 0);
            }
        })
        .catch((err) => {
            if (err.name === 'AbortError') {
                console.log('Request canceled:', err.message);
            } else {
                console.log('Error:', err);
            }
        });

    // Cleanup: Abort the request when the component unmounts or dependencies change
    return () => {
        controller.abort();
    };
}, [UrlLink, searchQuery, genderFilter, AbhaYesOrNo, dateOption, fromDate, toDate, ParticularDate, CurrentDate]);
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
    const handleAbhaChange = (event) => {
        setAbhaYesOrNo(event.target.value);
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
         else if (e.target.value === 'all') {
            setFromDate('');
            setToDate('');
            setCurrentDate('');
            setParticularDate('');

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

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };


    const handleTodayPatientsClick = () => {
        const today = new Date().toISOString().split('T')[0];
        setDateOption('current');
        setCurrentDate(today);
    };

    const handleMonthlyPatientsClick = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-based (0 = Jan)

        const firstDay = formatDate(new Date(year, month, 1));
        const lastDay = formatDate(new Date(year, month + 1, 0));

        console.log("Monthly filter from:", firstDay, "to:", lastDay);

        setDateOption('custom');
        setFromDate(firstDay);
        setToDate(lastDay);
    };

    const handleYearlyPatientsClick = (year) => {
        const now = new Date();
        const safeYear = typeof year === "number" ? year : now.getFullYear();

        try {
            const firstDay = formatDate(new Date(safeYear, 0, 1));     // Jan 1
            const lastDay = formatDate(new Date(safeYear, 11, 31));    // Dec 31

            console.log("Yearly filter from:", firstDay, "to:", lastDay);

            setDateOption('custom');
            setFromDate(firstDay);
            setToDate(lastDay);
            
        } catch (error) {
            console.error("Invalid date in handleYearlyPatientsClick:", error);
        }
    };  

    const handlePatientProfile = (patient) => {
        console.log("row",patient)
        
            const { PatientId } = patient;
            
            // Dispatch the PatientId to the Redux store
            dispatchvalue({ type: 'PatientListId', value: { PatientId } });
            
            // Log the PatientId after dispatching
            const updatedPatientListId = { PatientId }; // Capture the PatientId
            console.log(updatedPatientListId, 'PatientId after dispatch');

            navigate('/Home/FrontOfficeFolder');
        dispatchvalue({ type: 'HrFolder', value:'PatientProfile'});
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });



        };

    const handleRestrictedAction = () => {
        alert("You do not have permission to perform this action.");
    };

    const SmartCardView = (row) => {
    console.log('zzzzzzzzzz', row);

    if (row) {
        setselectedrow(true);
        setSmartCardDetailes({ ...row, PrintCount: 1 });
    }
    };
    

    const PatientOPRegisterColumns = [
        { key: "id", name: "ID", frozen: pagewidth > 500 },
        { key: "CurrDate", name: "date" },
        { key: "PatientId", name: "Patient Id", frozen: pagewidth > 500 },
        { key: "ABHA", name: "ABHA", frozen: pagewidth > 500 },        
        { key: "FullName", name: "Patient Name", width: 150, frozen: pagewidth > 500 },
        { key: "PhoneNo", name: "PhoneNo", frozen: pagewidth > 500 },
        { key: "Gender", name: "Gender" },
        
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => {
                            if (UserData?.Edit) {
                                handleeditPatientDetails(params.row)
                              } else {
                                handleRestrictedAction();
                              }
                        }}
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
                        onClick={() => {
                            if (UserData?.Read) {
                                handlePatientProfile(params.row)
                            } else {
                                handleRestrictedAction();
                            }
                        }}
                    >
                        <VisibilityIcon
                            key={`view-icon-${params.row.id}`} // Unique key for the icon
                            className="check_box_clrr_cancell"
                        />
                    </Button>
                </>
            ),
        },

        {
            key: "Smartcard",
            name: "Smartcard",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => {
                            if (UserData?.Read) {
                                SmartCardView(params.row)
                              } else {
                                SmartCardView();
                              }
                        }}
                    >
                        SmartCard
                    </Button>

                    
                   
                </>
            ),
        },

        {
            key: "Barcode",
            name: "Barcode",
            renderCell: (params) =>
            (
                <div className="weudygwe_uy8iu">
                <Button onClick={() => handleOpenModal("Barcode", params.row)}>
                    Barcode
                </Button>
                </div>
            ),

        },


       
    ];


    const getModalContent = () => {
        if (!selectedRowData) return null;
        // const New = true;
        switch (openModal) {
        case 'Barcode':
            return <AllPatienbarcode rowData={selectedRowData} fromPatientList={true} />;
        default:
            return null;
        }
    };
    


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
        dispatchvalue({ type: 'PatientListId', value: { PatientId } });
        
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
                    <div className="chart_body_1_child_1 dww3" onClick={handleTodayPatientsClick} style={{ cursor: "pointer" }}>
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
                    
                    <div className="chart_body_1_child_1 dww3" onClick={handleMonthlyPatientsClick} style={{ cursor: "pointer" }}>
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

                   
                    <div className="chart_body_1_child_1 dww3" onClick={handleYearlyPatientsClick} style={{ cursor: "pointer" }}>
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
                    onClick={() => UserData?.Create ? handlenewPatientRegister() : handleRestrictedAction()}
                    data-tooltip-id="add-patient-tooltip"
                >
                    <AddCircleIcon />
                </button>

                  

                    <Tooltip id="add-patient-tooltip" place="top" content="New Patient Register" />

                    <div className="search_div_bar">
                        <div className="search_div_bar_inp_1">
                            <label>
                                {" "}
                                Date <span>:</span>{" "}
                            </label>
                            <select value={dateOption} onChange={handleDateOptionChange}>
                                <option value="all">All</option>
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

                        {dateOption === 'custom' && (
                            <>
                                <div className="search_div_bar_inp_1">
                                    <label>{" "} From  <span>:</span> {" "}</label>

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
                        <br/>
                        {dateOption === 'particular' && (
                            <div className="search_div_bar_inp_1">
                                <label> Select Date <span>:</span> </label>
                                <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                            </div>
                        )}


                    </div>

                    <div className="search_div_bar_inp_1">
                        <label htmlFor="">Search here<span>:</span></label>
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder=' Aadhar or Name or PhoneNo or Patient ID '
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="search_div_bar_inp_1">
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
                    <div className="search_div_bar_inp_1">
                        <label>
                        ABHA <span>:</span>
                        </label>
                        <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "13px",
                            width: "120px",
                        }}
                        >
                        <label style={{ width: "auto" }} htmlFor="abha_yes">
                            <input
                            required
                            id="abha_yes"
                            type="radio"
                            name="abha"
                            value="Yes"
                            style={{ width: "15px" }}
                            checked={AbhaYesOrNo === "Yes"}
                            onChange={handleAbhaChange}
                            />
                            Yes
                        </label>
                        <label style={{ width: "auto" }} htmlFor="abha_no">
                            <input
                            required
                            id="abha_no"
                            type="radio"
                            name="abha"
                            value="No"
                            style={{ width: "15px" }}
                            checked={AbhaYesOrNo === "No"}
                            onChange={handleAbhaChange}
                            />
                            No
                        </label>
                        
                        </div>
                    </div>


                    {/* <div className="RegisForm_1">
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

                        <br/>
                        {dateOption === 'particular' && (
                            <div className="RegisForm_1">
                                <label> Select Date <span>:</span> </label>
                                <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                            </div>
                        )}
                    </div> */}

                    
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
                    {selectedrow && (
                        <div className="loader_001" onClick={() => setselectedrow(false)}>
                          <div
                            className="loader_register_roomshow_002"
                            onClick={(e) => e.stopPropagation()}
                          >
                      
                      <SmartCard rowData={smartCardDetailes} />
                
                
                            <br />
                
                
                          
                          </div>
                        </div>
                    )}

                    {openModal && (
                        <div className="sideopen_showcamera_profile" onClick={handleCloseModal}>
                        <div
                            className="newwProfiles"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>{openModal}</h2>
                            {getModalContent()}
                            <div className="Main_container_Btn">
                            <button onClick={handleCloseModal}>Close</button>
                            </div>{" "}
                        </div>
                        </div>
                    )}
                <ReactGrid columns={PatientOPRegisterColumns} RowData={PatientData} />
            </div>
        </>
    );
};

export default PatientList;
