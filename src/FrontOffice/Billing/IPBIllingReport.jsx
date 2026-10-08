import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Button from "@mui/material/Button";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from "@mui/icons-material/Loupe";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const IPBillingReport = () => {
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
    const [TotalAmount, setTotalAmount] = useState([])
    const [PaymentType, setPaymentType] = useState([])

    const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
    const [SearchQuery, setSearchQuery] = useState({
        searchBy: "",
        Status: "Pending"
    })
    const [searchOptions, setSearchOptions] = useState({
        DateType: '',
        CurrentDate: "",
        FromDate: '',
        ToDate: '',
        SearchbyFirstName: '',
        SearchbySpeciality: '',
        SearchbyDoctor: '',
        SearchTimeOrderby: '',
        SearchStatus: 'Paid'
    })

    const [EmployeeRegisterData, setEmployeeRegisterData] = useState([])
    const [SpecializationData, setSpecializationData] = useState([]);
    const [DoctorData, setDoctorData] = useState([]);
    const [DoctorRateData, setDoctorRateData] = useState([]);
    const [ReferralDoctorData, setReferralDoctorData] = useState([]);
    const [EmployeeData, setEmployeeData] = useState([]);
    const [DoctorIdData, setDoctorIdData] = useState([]);
    const [FlaggData, setFlaggData] = useState([]);
    const [ReligionData, setReligionData] = useState([]);
    const [AllDoctorData, setAllDoctorData] = useState([]);
    const [InsuranceData, setInsuranceData] = useState([]);
    const [ClientData, setClientData] = useState([]);
    const [DonationData, setDonationData] = useState([]);




    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/IP_Billing_Report`, {
            params: searchOptions
        })
            .then((res) => {
                const ress = res.data;
                console.log('dataaaa', ress);

                setFilterdata(ress?.billing_data);
                setTotalAmount(parseFloat(ress?.total_paid_amount).toFixed(2))
                setPaymentType(ress?.payment_totals_by_type)
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

    useEffect(() => {
        if (searchOptions.DateType === 'Current') {
            // const today = new Date();
            const d = new Date();
            const month = (d.getMonth() + 1).toString().padStart(2, "0");
            const day = d.getDate().toString().padStart(2, "0");
            const year = d.getFullYear();
            // return `${year}-${month}-${day}`;
            // const currentDate = today.toISOString().split('T')[0];

            setSearchOptions((prev) => ({
                ...prev,
                CurrentDate: `${year}-${month}-${day}`
            }))
        }

    }, [searchOptions.DateType])


    useEffect(() => {
        const fetchdat = async () => {
            const postdata = {
                LocationId: UserData?.location,
                Date: formatDate(new Date()),
                Speciality: searchOptions.SearchbySpeciality,
                Department: 2,
            }
            console.log('Doctrrrrr', postdata)

            try {
                const response = await axios.get(
                    `${UrlLink}Frontoffice/get_available_doctor_by_speciality`,
                    { params: postdata }
                )

                setDoctorData(response.data)
                console.log('doccccc', response.data)
            } catch (error) {
                setDoctorData([])
                console.error('Error fetching referral doctors:', error)
            }
        }
        if (searchOptions.SearchbySpeciality) {
            fetchdat()
        }
    }, [UrlLink, UserData.location, searchOptions.SearchbySpeciality])

    useEffect(() => {
        axios.get(`${UrlLink}HR_Management/get_username_details`)
            .then((res) => {
                const ress = res.data
                console.log(ress, 'userrrr');
                setEmployeeRegisterData(ress)


            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    specializationResponse,
                    referralDoctorResponse,
                    EmployeeResponse,
                    DoctorResponse,
                    FlaggData,
                    ReligionData,
                    AllDoctorData,
                    Insurancedata,
                    ClientData,
                    DonationData,
                ] = await Promise.all([
                    axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
                    axios.get(`${UrlLink}Masters/get_referral_doctor_Name_Detials`),
                    axios.get(`${UrlLink}Frontoffice/get_Employee_by_PatientCategory`),
                    axios.get(`${UrlLink}Frontoffice/get_DoctorId_by_PatientCategory`),
                    axios.get(`${UrlLink}Masters/Flagg_color_Detials_link`),
                    axios.get(`${UrlLink}Masters/Relegion_Master_link`),
                    axios.get(`${UrlLink}Masters/get_All_doctor_Name_Detials`),
                    axios.get(`${UrlLink}Masters/get_insurance_data_registration`),
                    axios.get(`${UrlLink}Masters/get_client_data_registration`),
                    axios.get(`${UrlLink}Masters/get_donation_data_registration`),
                ]);

                console.log("spppeeecccc", specializationResponse, AllDoctorData, DoctorResponse);

                setSpecializationData(
                    Array.isArray(specializationResponse.data)
                        ? specializationResponse.data
                        : []
                );
                setReferralDoctorData(
                    Array.isArray(referralDoctorResponse.data)
                        ? referralDoctorResponse.data
                        : []
                );
                setEmployeeData(
                    Array.isArray(EmployeeResponse.data) ? EmployeeResponse.data : []
                );
                setDoctorIdData(
                    Array.isArray(DoctorResponse.data) ? DoctorResponse.data : []
                );
                setFlaggData(Array.isArray(FlaggData.data) ? FlaggData.data : []);
                setReligionData(
                    Array.isArray(ReligionData.data) ? ReligionData.data : []
                );
                setAllDoctorData(
                    Array.isArray(AllDoctorData.data) ? AllDoctorData.data : []
                );
                setInsuranceData(
                    Array.isArray(Insurancedata.data) ? Insurancedata.data : []
                );
                setClientData(Array.isArray(ClientData.data) ? ClientData.data : []);
                setDonationData(
                    Array.isArray(DonationData.data) ? DonationData.data : []
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [UrlLink]);


    // useEffect(() => {
    //     if (searchOptions.DateType === 'Current') {
    //         const today = new Date();            
    //         const currentDate = today.toISOString().split('T')[0];

    //         setSearchOptions((prev) => ({
    //             ...prev,
    //             CurrentDate: currentDate
    //         }))
    //     } else {
    //         setSearchOptions((prev) => ({
    //             ...prev,
    //             CurrentDate: ''
    //         }))
    //     }

    // }, [searchOptions.DateType])

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
        dispatchvalue({ type: 'OPBillingData', value: params })
        dispatchvalue({ type: 'IPBillingData', value: {} })
        // navigate('/Home/QuickBilling')

        navigate("/Home/CashierFolder");
        dispatchvalue({ type: "HrFolder", value: "QuickBilling" });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    }

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
            if (value === '') {
                setSearchOptions((prev) => ({
                    ...prev,
                    DateType: value,
                    CurrentDate: '',
                    FromDate: '',
                    ToDate: '',
                }));
            }
            else if (value === 'Current') {
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
        }
        else {
            setSearchOptions((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const PatientOPRegisterColumns = [
        {
            key: "id",
            name: "ID",
        },
        {
            key: "Billing_Date",
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
            name: "Phone Number",
        },
        {
            key: "Doctor_Name",
            name: "Doctor Name",
        },
        {
            key: "PatientCategory",
            name: "Patient Category",
        },
        {
            key: "Net_Amount",
            name: "Net Amount",
        },
        {
            key: "PaidAmount",
            name: "Paid Amount",
        },
        {
            key: "PaidNetAmount",
            name: "Paid Net Amount",
        },
        {
            key: "Cash_Amount",
            name: "Cash",
            renderCell: (params) => {
                const cashPayment = params.row.Payment_Details.find((p) => p.Payment_Type === "Cash");
                return cashPayment ? `₹${cashPayment.Amount}` : "-";
            },
        },
        {
            key: "Card_Amount",
            name: "Card",
            renderCell: (params) => {
                const cardPayment = params.row.Payment_Details.find((p) => p.Payment_Type === "Card");
                return cardPayment ? `₹${cardPayment.Amount}` : "-";
            },
        },
        {
            key: "Card_Type",
            name: "Card Type",
            renderCell: (params) => {
                const cardPayment = params.row.Payment_Details.find((p) => p.Payment_Type === "Card");
                return cardPayment ? cardPayment.Card_Type : "-";
            },
        },
        {
            key: "TransactionId",
            name: "Transaction ID",
            renderCell: (params) => {
                const cardPayment = params.row.Payment_Details.find((p) => p.Payment_Type === "Card");
                return cardPayment ? cardPayment.TransactionId || "-" : "-";
            },
        },
        {
            key: "Transaction_Amount",
            name: "Transaction Fees",
            renderCell: (params) => {
                const cardPayment = params.row.Payment_Details.find((p) => p.Payment_Type === "Card");
                return cardPayment ? `${cardPayment.Transaction_Amount}%` : "-";
            },
        },
        {
            key: "OnlinePayment",
            name: "Online Payment",
            renderCell: (params) => {
                const cardPayment = params.row.Payment_Details.find((p) => p.Payment_Type === "OnlinePayment");
                return cardPayment ? `${cardPayment.Amount}%` : "-";
            },
        },
        {
            key: "Cheque",
            name: "Cheque",
            renderCell: (params) => {
                const cardPayment = params.row.Payment_Details.find((p) => p.Payment_Type === "Cheque");
                return cardPayment ? `${cardPayment.Amount}%` : "-";
            },
        },
        // {
        //     key: "Action",
        //     name: "Action",
        //     renderCell: (params) => {
        //         return params.row.Bill_Status === "Paid" ? (
        //             <Button className="cell_btn" onClick={() => HandleMovedatatobill(params.row)}>
        //                 <ArrowForwardIcon className="check_box_clrr_cancell" />
        //             </Button>
        //         ) : "No Action";
        //     },
        // },
    ];



    return (

        <>
            <div className="Main_container_app">

                <h3>IP Billing Report</h3>
                <div className="search_div_bar" style={{ width: '100%' }}>

                    <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>

                        <div className="RegisForm_1">
                            <label>Date Type<span>:</span></label>
                            <select
                                name='DateType'
                                value={searchOptions.DateType}
                                onChange={HandleOnchangeSearch}
                            >
                                <option value=''>Select</option>
                                <option value='Current'>Current Date</option>
                                <option value='Customize'>Customize</option>
                            </select>
                        </div>

                        {searchOptions.DateType === 'Current' ?
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
                            :
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
                        }

                        <div className="RegisForm_1">
                            <label htmlFor="input">
                                User<span>:</span>
                            </label>
                            <input
                                type="text"
                                list="user_list"
                                name="SearchbyFirstName"
                                value={searchOptions.SearchbyFirstName}
                                onChange={HandleOnchangeSearch}
                                autoComplete="off"
                            />
                            <datalist id="user_list">
                                {EmployeeRegisterData?.length > 0 &&
                                    EmployeeRegisterData.map((row, ind) => (
                                        <option key={ind} value={row.username}>{row.username}</option>
                                    ))
                                }
                            </datalist>
                        </div>


                        <div className="RegisForm_1" >
                            <label htmlFor="input">
                                Speciality<span>:</span>
                            </label>
                            <select
                                name="SearchbySpeciality"
                                value={searchOptions.SearchbySpeciality}
                                onChange={HandleOnchangeSearch}
                            >
                                <option value=''>Select</option>
                                {
                                    SpecializationData.map((f, ind) => (
                                        <option key={ind} value={f.Speciality_Id}>{f.SpecialityName}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="RegisForm_1" >
                            <label htmlFor="input">
                                Doctor<span>:</span>
                            </label>
                            <select
                                name="SearchbyDoctor"
                                value={searchOptions.SearchbyDoctor}
                                onChange={HandleOnchangeSearch}
                            >
                                <option value=''>Select</option>
                                {
                                    DoctorData.map((f, ind) => (
                                        <option key={ind} value={f.doctor_id}>{f.doctor_name}</option>
                                    ))
                                }
                            </select>
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

                    <ReactGrid
                        columns={PatientOPRegisterColumns}
                        RowData={Filterdata}
                    />

                </div>
            </div>
            <div style={{ marginLeft: "55%" }}>
                <div className="RegisForm_1">
                    <label>Total<span>:</span></label>
                    {TotalAmount}
                </div>
            </div>
            <div style={{ marginLeft: "55%" }}>
                {
                    Object.entries(PaymentType).map(([key, value], ind) => (
                        <div className="RegisForm_1">
                            <label key={ind}>{key}<span>:</span></label>
                            <span>{parseFloat(value).toFixed(2)}</span>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default IPBillingReport;