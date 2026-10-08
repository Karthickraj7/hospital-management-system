import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';


const OpReferalDoctorPatient = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const UserData = useSelector(state => state.userRecord?.UserData)
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    const [PatientRegisterData, setPatientRegisterData] = useState([])
    const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Pending' });
    const [dateOption, setDateOption] = useState('all');
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
        
        if (!searchOPParams?.query || typeof searchOPParams.query !== "string") {
        searchOPParams.query = ""; // Default empty string
        }

        if (searchOPParams.query?.trim()) {
            params.query = searchOPParams.query.trim();  // ✅ Use searchOPParams.query
        }

        if (searchOPParams?.status) {
            params.status = searchOPParams.status;
        }

        if (/^\d{10}$/.test(searchOPParams.query)) {
        params.query = searchOPParams.query; //for mobile number
        } else if (searchOPParams.query.trim()) { // for firstname ,middle name and lastame
            const nameParts = searchOPParams.query.trim().split(" ");
            if (nameParts.length === 1) params.query = nameParts[0];
            if (nameParts.length === 2) params.query = nameParts[1];
            if (nameParts.length > 2) {
                params.query = nameParts.slice(1, -1).join(" ");
                params.query = nameParts[nameParts.length - 1];
            }
        }

        if (dateOption === 'custom') {
            if (fromDate && toDate) {
                params.fromDate = fromDate;
                params.toDate = toDate;
            } else {
            setPatientRegisterData([]); // Clear the data if both dates are not provided
                return;
            }
        } 
        else if (dateOption === 'current') {
            if (CurrentDate){
                params.CurrentDate = CurrentDate;

            } else {
                setPatientRegisterData([]); 
                return;
            }
        } else if (dateOption === 'particular') {
            if (ParticularDate) {
                params.ParticularDate = ParticularDate;
                
            } else {
            setPatientRegisterData([]); // Clear data if no particular date is selected
                return;
            }
        }



        axios.get(`${UrlLink}Frontoffice/get_OP_Referal_Doctor_PatientList`,{params})
            .then((res) => {
                const ress = res.data;
                if (Array.isArray(ress)) {
                    setPatientRegisterData(ress);

                } else {
                    setPatientRegisterData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });

    }, [UrlLink,
        searchOPParams,
        dateOption,
        fromDate,
        toDate,
        CurrentDate,
        ParticularDate
    ]);

    
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


    const handleeditOPPatientRegister = (params) => {
        console.log('params', params)
        dispatchvalue({ type: 'ReferalDocPatient', value: { Type: 'OP', conversion: true, ...params } });
        navigate('/Home/FrontOfficeFolder')
        dispatchvalue({ type: 'HrFolder', value:'OPVisitEntry'});
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });


    }

     const handleCurrentDateChange = (e) => {
        setCurrentDate(e.target.value);
    };


    const handleFromDateChange = (e) => {
        console.log(e.target.value,'From');
        
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e) => {
        console.log(e.target.value,'To');
        
        setToDate(e.target.value);
    };

    const handleParticularDateChange = (e) => {
        setParticularDate(e.target.value);
    };

    const handleSearchChange = (e) => {
        // setsearchOPParams({ ...searchOPParams, query: e.target.value });

        setsearchOPParams(prev => ({ ...prev, query: e.target.value }));
    };


    const handleStatusChange = (e) => {
        setsearchOPParams(prev => ({ ...prev, status: e.target.value }));
    };

    const handleRestrictedAction = () => {
        alert("You do not have permission to perform this action.");
    };


    const PatientOPRegisterColumns = [
        {
            key: "id",
            name: "S.No",
        },
        {
            key: "PatientId",
            name: "Patient Id",
        },
        {
            key: "PatientName",
            name: "Patient Name",
        },

        {
            key: "Age",
            name: "Age",
        },
        {
            key: "Referal Doctor Name",
            name: "DoctorName",
        },
        {
            key: "Status",
            name: "Status",
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
               
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => {
                            if (UserData?.Create){
                                handleeditOPPatientRegister(params.row)

                            } else {
                                handleRestrictedAction();
                            }

                        }}
                    >
                        <ArrowForwardIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
                    
            ),
        },

        // {
        //     key: "Action",
        //     name: "Action",
        //     renderCell: (params) => (
        //         params.row.Status === 'Pending' ?
        //             <>
        //                 <Button
        //                     className="cell_btn"
        //                     onClick={() => {
        //                         if (UserData?.Create){
        //                             handleeditOPPatientRegister(params.row)

        //                         } else {
        //                             handleRestrictedAction();
        //                         }

        //                     }}
        //                 >
        //                     <ArrowForwardIcon className="check_box_clrr_cancell" />
        //                 </Button>
        //             </>
        //             : 'No Action'
        //     ),
        // },
    ]

  return (
    <>
        <div className="Main_container_app">
            <h3>Op Referal Doctor Que List</h3>

            <div className="search_div_bar">

                <div className="search_div_bar_inp_1">
                    <label>{" "} Date <span>:</span>{" "}</label>
                    <select value={dateOption} onChange={handleDateOptionChange}
                    >
                    <option value="all">All</option>
                    <option value="current">Current Date</option>
                    <option value="custom">Custom Date</option>
                    <option value="particular">Particular Date</option>
                    </select>
                </div>

                {dateOption === 'current' && (
                    
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
                        <label>{" "}
                        From  <span>:</span>{" "}
                        </label>

                        <input
                        type="date"
                        placeholder="From Date"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        />
                    </div>

                    <div className="search_div_bar_inp_1">
                        <label> {" "} 
                        To  <span>:</span> {" "} </label>

                        <input
                        type="date"
                        placeholder="To Date"
                        value={toDate}
                        onChange={handleToDateChange}
                        />
                    </div>
                    
                
                    </>
                    
                )}

                <br />
                {dateOption === 'particular' && (
                    <div className="search_div_bar_inp_1">
                    <label> {" "}Select Date <span>:</span>{" "} </label>
                    <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                    </div>
                )}


                <div className=" search_div_bar_inp_1">
                    <label htmlFor="">
                    Search by
                    <span>:</span>
                    </label>
                    <input
                    type="text"
                    value={searchOPParams.query}
                    placeholder="Patient ID or Name or PhoneNo "
                    onChange={handleSearchChange}
                    />
                </div>

                
                <div className=" search_div_bar_inp_1">
                    <label htmlFor="">Status
                        <span>:</span>
                    </label>
                    <select
                        id=''
                        name='status'
                        value={searchOPParams.status}
                        onChange={handleStatusChange}
                        // onChange={(e) => setsearchOPParams((prev) => ({
                        //     ...prev,
                        //     status: e.target.value
                        // }))}
                    >
                        {/* <option value=''>Select</option> */}
                        <option value='Pending'>Pending</option>
                        <option value='Registered'>Registered</option>
                    </select>
                </div>


            </div>
        
            


            <ReactGrid columns={PatientOPRegisterColumns} RowData={PatientRegisterData} />
        </div>
    </>
  )
}

export default OpReferalDoctorPatient;
