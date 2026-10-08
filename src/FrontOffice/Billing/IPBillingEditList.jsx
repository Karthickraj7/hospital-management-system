import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Button from "@mui/material/Button";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from "@mui/icons-material/Loupe";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const IPBillingEditList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    // Function to format date as MM/DD/YYYY
    const formatDate = (date) => {
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };
    const [Filterdata, setFilterdata] = useState([])
    const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
    const [SearchQuery, setSearchQuery] = useState({
        searchBy: "",
        Status: "Pending"
    })
    const [searchOptions, setSearchOptions] = useState({
        // SearchbyDate: TodayDate,
        DateType: 'Current',
        CurrentDate: TodayDate,
        FromDate: '',
        ToDate: '',
        SearchbyFirstName: '',
        SearchbyPhoneNumber: '',
        SearchTimeOrderby: '',
        SearchStatus: 'Paid'
    })


    const HandleOnchangeSearch = (e) => {

        const { name, value } = e.target;

        console.log('90909', name, value);

        if (name === 'SearchbyPhoneNumber') {
            if (value.length <= 10) {
                setSearchOptions((prev) => ({
                    ...prev,
                    [name]: value,
                }))
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
            }))
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/IPBilling_Link`, {
            params: searchOptions
        })
            .then((res) => {
                const ress = res.data;

                if (Array.isArray(ress)) {
                    console.log('dataaaa', ress);

                    setFilterdata(ress);
                } else {
                    setFilterdata([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink, searchOptions, UserData?.location]);


    const handleSearchChange = (e) => {
        const { name, value } = e.target
        setSearchQuery((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handlenewDocRegister = () => {
        dispatchvalue({ type: 'OPBillingData', value: { type: 'OP' } })
        dispatchvalue({ type: 'IPBillingData', value: {} })
        // navigate('/Home/OverAllQuickBilling')
        navigate("/Home/CashierFolder");
        dispatchvalue({ type: "HrFolder", value: "OverAllQuickBilling" });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    }
    const HandleMovedatatobill = (params) => {
        dispatchvalue({ type: 'OPBillingData', value: {} })
        dispatchvalue({ type: 'IPBillingData', value: params })
        // navigate('/Home/QuickBilling')

        navigate("/Home/CashierFolder");
        dispatchvalue({ type: "HrFolder", value: "IPEditBilling" });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    }

    const PatientOPRegisterColumns = [
        {
            key: "id",
            name: "ID",
        },
        {
            key: "Date",
            name: "Date",
        },
        {
            key: "PatientId",
            name: "Patient Id",
        },
        {
            key: "Patient_Name",
            name: "Patient Name",
        },
        {
            key: "PhoneNo",
            name: "PhoneNumber",
        },
        {
            key: "Doctor_ShortName",
            name: "Doctor Name",

        },
        {
            key: 'PatientCategory',
            name: 'Patient Category',
        },
        {
            key: 'Net_Amount',
            name: 'Net Amount',
        },
        {
            key: 'PaidAmount',
            name: 'Paid Amount',
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => {
                return params.row.Status === 'Paid' ? (
                    <Button
                        className="cell_btn"
                        onClick={() => HandleMovedatatobill(params.row)}
                    >
                        <ArrowForwardIcon className="check_box_clrr_cancell" />
                    </Button>
                ) : 'No Action'
            },
        },
    ]
    return (

        <>
            <div className="Main_container_app">

                <h3>IP Billing Edit List</h3>
                <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>


                    <div className="RegisForm_1">
                        <label>Date Type<span>:</span></label>
                        <select
                            name='DateType'
                            value={searchOptions.DateType}
                            onChange={HandleOnchangeSearch}
                        >
                            <option value='All'>All</option>
                            <option value='Current'>Current Date</option>
                            <option value='Customize'>Customize</option>
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

                    <div className="RegisForm_1" >
                        <label htmlFor="input">
                            First Name<span>:</span>
                        </label>
                        <input
                            type="text"
                            name="SearchbyFirstName"
                            value={searchOptions.SearchbyFirstName}
                            onChange={HandleOnchangeSearch}
                        />
                    </div>

                    <div className="RegisForm_1" >
                        <label htmlFor="input">
                            Phone Number<span>:</span>
                        </label>
                        <input
                            type="number"
                            name="SearchbyPhoneNumber"
                            value={searchOptions.SearchbyPhoneNumber}
                            onChange={HandleOnchangeSearch}
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label htmlFor="input">
                            Time Order By<span>:</span>
                        </label>
                        <select
                            name="SearchTimeOrderby"
                            value={searchOptions.SearchTimeOrderby}
                            onChange={HandleOnchangeSearch}
                        >
                            <option value="">Select</option>
                            <option value='Order'>Order</option>
                            <option value='Disorder'>Disorder</option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label htmlFor="input">
                            Status<span>:</span>
                        </label>
                        <select
                            name="SearchStatus"
                            value={searchOptions.SearchStatus}
                            onChange={HandleOnchangeSearch}
                        >
                            <option value="Paid">Paid</option>
                            <option value="REGISTERED">Registered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                </div>

                <br />

                {Filterdata.length >= 0 && (
                    <ReactGrid
                        columns={PatientOPRegisterColumns}
                        RowData={Filterdata}
                    />
                )}
            </div>
        </>
    )
}

export default IPBillingEditList;