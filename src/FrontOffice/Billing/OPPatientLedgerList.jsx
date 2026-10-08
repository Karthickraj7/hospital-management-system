import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const PatientLedgerList = () => {
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const [LocationData, setLocationData] = useState([]);
    // Function to format date as MM/DD/YYYY
    const formatDate = (date) => {
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };
    const formatLabel = (label) => {
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };
    const [MasterOptions, setMasterOptions] = useState('PatientLedger')
    const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
    const [searchOptions, setSearchOptions] = useState({
        DateType: 'Current',
        CurrentDate: TodayDate,
        FromDate: '',
        ToDate: '',
        // Paymentmode:'',
        SearchbyFirstName: '',
        SearchbySpeciality: '',
        SearchbyDoctor: '',
        SearchTimeOrderby: '',
        SearchStatus: 'Pending'
    })
    const [Filterdata, setFilterdata] = useState([])
    const [PatientData, setPatientData] = useState([]);
    const [RegistrationData, setRegistrationData] = useState([]);
    

    const cleardata = () => {
        setSearchOptions({
            DateType: 'Current',
            CurrentDate: TodayDate,
            FromDate: '',
            ToDate: '',
            // Paymentmode:'',
            SearchbyFirstName: '',
            SearchbySpeciality: '',
            SearchbyDoctor: '',
            SearchTimeOrderby: '',
            SearchStatus: 'Pending'
        })
    }

    useEffect(()=>{
        axios.get(`${UrlLink}Frontoffice/Patients_Management_Filter_for_ledger`, {params: { ...searchOptions }})
            .then((res) => {
                const data = res.data;
                if (Array.isArray(data)) {
                    setPatientData(data);
                } else {
                    setPatientData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    },[UrlLink,searchOptions])
    useEffect(()=>{
        axios.get(`${UrlLink}Frontoffice/Registration_Management_Filter_for_ledger`, {params: { ...searchOptions }})
            .then((res) => {
                const data = res.data;
                if (Array.isArray(data)) {
                    setRegistrationData(data);
                } else {
                    setRegistrationData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    },[UrlLink,searchOptions])


    const HandleOnchangeSearch = (e) => {
        const { name, value } = e.target;

        console.log(`Updating ${name} with value:`, value);

        if (name === 'SearchbyPhoneNumber') {
            if (value.length <= 10) {
                setSearchOptions((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
        else if (name === 'DateType') {
            if (value === 'Current') {
                setSearchOptions((prev) => ({
                    ...prev,
                    DateType: value,
                    CurrentDate: TodayDate, // Ensure TodayDate is properly defined
                    FromDate: '',
                    ToDate: '',
                }));
            }
            else if (value === 'Customize') {
                setSearchOptions((prev) => ({
                    ...prev,
                    DateType: value,
                    CurrentDate: '',
                }));
            }
            else if (value === 'All') {
                setSearchOptions((prev) => ({
                    ...prev,
                    DateType: value,
                    CurrentDate: '', 
                    FromDate: '',
                    ToDate: '',
                }));
            }
        }
        else {
            setSearchOptions((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const RoomColumns = [
        { key: "id", name: "ID", },
        { key: "PatientId", name: "Patient Id", },
        { key: "FullName", name: "Patient Name", width: 150,},
        { key: "PhoneNo", name: "PhoneNo", },
        { key: "Gender", name: "Gender" },
        { key: "Email", name: "Email" },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => {
                return (
                    <Button
                        className="cell_btn"
                    onClick={() => handlePatientLedger(params.row)}
                    >
                        <ArrowForwardIcon className="check_box_clrr_cancell" />
                    </Button>
                )
            },
        },
    ]
    const RegColumns = [
        { key: "id", name: "ID", },
        { key: "PatientId", name: "Patient Id", },
        { key: "RegistrationId", name: "Registration Id", },
        { key: "FullName", name: "Patient Name", width: 150,},
        { key: "PhoneNo", name: "PhoneNo", },
        { key: "Gender", name: "Gender" },
        { key: "Email", name: "Email" },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => {
                return (
                    <Button
                        className="cell_btn"
                    onClick={() => handleRegistrationLedger(params.row)}
                    >
                        <ArrowForwardIcon className="check_box_clrr_cancell" />
                    </Button>
                )
            },
        },
    ]

    const handlePatientLedger =(params) =>{
        const {PatientId} = params;

        dispatchvalue({ type: 'PatientLedger', value: params });
        navigate('/Home/CashierFolder');
        dispatchvalue({ type: 'HrFolder', value: 'PatientLedgerOP' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });

    }
    const handleRegistrationLedger =(params) =>{
        const {PatientId} = params;
        dispatchvalue({ type: 'PatientLedger', value: {} });
        dispatchvalue({ type: 'RegistrationLedger', value: params });
        navigate('/Home/CashierFolder');
        dispatchvalue({ type: 'HrFolder', value: 'PatientLedgerOP' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });

    }

    return (
        <>
            <div className="Main_container_app">
                <h3>OP Patient Ledger</h3>
                <div className="RegisterTypecon">
                    <div className="RegisterType">
                        {["PatientLedger", "RegistrationLedger"].map((p, ind) => (
                            <div className="registertypeval" key={ind}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={MasterOptions === p}
                                    onChange={(e) => {
                                        setMasterOptions(e.target.value)
                                        cleardata()
                                    }}
                                    value={p}
                                />
                                <label htmlFor={p}>
                                    {p}
                                </label>
                            </div>
                        ))}
                    </div>

                </div>
                {
                    MasterOptions === 'PatientLedger' && (
                        <>
                            <div className="search_div_bar">
                                <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
                                    <div className="RegisForm_1">
                                        <label>Date Type<span>:</span></label>
                                        <select
                                            name="DateType"
                                            value={searchOptions.DateType}
                                            onChange={HandleOnchangeSearch}
                                        >
                                            <option value='All'>All</option>
                                            <option value="Current">Current Date</option>
                                            <option value="Customize">Customize</option>
                                        </select>
                                    </div>

                                    {searchOptions.DateType === 'Current' && (
                                        <div className="RegisForm_1">
                                            <label>Current Date<span>:</span></label>
                                            <input
                                                type='date'
                                                name='CurrentDate'
                                                value={searchOptions.CurrentDate}
                                                onChange={HandleOnchangeSearch}
                                                readOnly
                                            />

                                        </div>
                                    )}
                                
                                    {searchOptions.DateType === 'Customize' && (
                                        <>
                                            <div className="RegisForm_1">
                                                <label>From Date<span>:</span></label>
                                                <input
                                                    type='date'
                                                    name='FromDate'
                                                    value={searchOptions.FromDate}
                                                    onChange={HandleOnchangeSearch}
                                                />

                                            </div>

                                            <div className="RegisForm_1">
                                                <label>To Date<span>:</span></label>
                                                <input
                                                    type='date'
                                                    name='ToDate'
                                                    value={searchOptions.ToDate}
                                                    onChange={HandleOnchangeSearch}
                                                    min={searchOptions.FromDate}
                                                />

                                            </div>
                                        </>
                                    )}

                                    <div className="RegisForm_1">
                                        <label htmlFor="input">Name/PhoneNo<span>:</span></label>
                                        <input
                                            type="text"
                                            name="SearchbyFirstName"
                                            value={searchOptions.SearchbyFirstName}
                                            onChange={HandleOnchangeSearch}
                                        />
                                    </div>

                                    <div className="RegisForm_1">
                                        <label htmlFor="input">Status<span>:</span></label>
                                        <select
                                            name="SearchStatus"
                                            value={searchOptions.SearchStatus}
                                            onChange={HandleOnchangeSearch}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Due">Due</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>

                                </div>

                                {/* Table with Patient Data */}
                                <ReactGrid columns={RoomColumns} RowData={PatientData} />
                            </div>

                            {/* Toast Notification */}
                            <ToastAlert Message={toast.message} Type={toast.type} />

                        </>
                    )
                }
                {
                    MasterOptions === 'RegistrationLedger' && (
                        <>
                            <div className="search_div_bar">
                                <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
                                    <div className="RegisForm_1">
                                        <label>Date Type<span>:</span></label>
                                        <select
                                            name="DateType"
                                            value={searchOptions.DateType}
                                            onChange={HandleOnchangeSearch}
                                        >
                                            <option value='All'>All</option>
                                            <option value="Current">Current Date</option>
                                            <option value="Customize">Customize</option>
                                        </select>
                                    </div>

                                    {searchOptions.DateType === 'Current' && (
                                        <div className="RegisForm_1">
                                            <label>Current Date<span>:</span></label>
                                            <input
                                                type='date'
                                                name='CurrentDate'
                                                value={searchOptions.CurrentDate}
                                                onChange={HandleOnchangeSearch}
                                                readOnly
                                            />

                                        </div>
                                    )}
                                        
                                    {searchOptions.DateType === 'Customize' && (
                                        <>
                                            <div className="RegisForm_1">
                                                <label>From Date<span>:</span></label>
                                                <input
                                                    type='date'
                                                    name='FromDate'
                                                    value={searchOptions.FromDate}
                                                    onChange={HandleOnchangeSearch}
                                                />

                                            </div>

                                            <div className="RegisForm_1">
                                                <label>To Date<span>:</span></label>
                                                <input
                                                    type='date'
                                                    name='ToDate'
                                                    value={searchOptions.ToDate}
                                                    onChange={HandleOnchangeSearch}
                                                    min={searchOptions.FromDate}
                                                />

                                            </div>
                                        </>
                                    )} 

                                    <div className="RegisForm_1">
                                        <label htmlFor="input">Name/PhoneNo<span>:</span></label>
                                        <input
                                            type="text"
                                            name="SearchbyFirstName"
                                            value={searchOptions.SearchbyFirstName}
                                            onChange={HandleOnchangeSearch}
                                        />
                                    </div>

                                    <div className="RegisForm_1">
                                        <label htmlFor="input">Registration Type<span>:</span></label>
                                        <select
                                            name="SearchStatus"
                                            value={searchOptions.SearchStatus}
                                            onChange={HandleOnchangeSearch}
                                        >
                                            <option value="">Select</option>
                                            <option value="OP">OP</option>
                                            <option value="IP">IP</option>
                                            {/* <option value="Due">Due</option> */}
                                            {/* <option value="CANCELLED">Cancelled</option> */}
                                        </select>
                                    </div>

                                </div>

                                {/* Table with Patient Data */}
                                <ReactGrid columns={RegColumns} RowData={RegistrationData} />
                            </div>

                            {/* Toast Notification */}
                            <ToastAlert Message={toast.message} Type={toast.type} />
                        </>
                    )
                }
                <br />
            </div>
        </>
    )
}

export default PatientLedgerList;