import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Oncology = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const dispatch = useDispatch();
    const [PatientRegisterData, setPatientRegisterData] = useState([]);
    const [Filterdata, setFilterdata] = useState([]);
    const navigate = useNavigate()
    const [SearchQuery, setSearchQuery] = useState('');
    const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Request' });
    const handleSearchChangeStatus = (e) => {
        const { name, value } = e.target

        setsearchOPParams({ ...searchOPParams, [name]: value });

    };

    useEffect(() => {
    axios.get(`${UrlLink}OP/get_therapy_requests_Oncology`, { params: searchOPParams })
        .then((res) => {
            const ress = res.data.results;  // FIXED: get the array from results
            console.log("567", ress);
            setPatientRegisterData(Array.isArray(ress) ? ress : []);
            setFilterdata(Array.isArray(ress) ? ress : []);
        })
        .catch((err) => {
            console.log(err);
        });
}, [UrlLink, searchOPParams]);


    console.log(PatientRegisterData,'Patient REgisterdata...')
    console.log(Filterdata,'Patient Filterdata...')

    useEffect(() => {
        if (SearchQuery !== '') {
            const lowerCaseQuery = SearchQuery.toLowerCase();

            const filteredData = PatientRegisterData.filter((row) => {
                const { PatientId, PhoneNumber, PatientName } = row;
                return (
                    (PatientId && PatientId.toLowerCase().includes(lowerCaseQuery)) ||
                    (PhoneNumber && PhoneNumber.toLowerCase().includes(lowerCaseQuery)) ||
                    (PatientName && PatientName.toLowerCase().includes(lowerCaseQuery))
                );
            });

            setFilterdata(filteredData);
        } else {
            setFilterdata(PatientRegisterData);
        }
    }, [SearchQuery, PatientRegisterData]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleeditOPPatientRegister = (params) => {
            console.log(params, 'soksoksoksosko');
            
            dispatch({ type: 'TherapistWorkbenchNavigation', value: {...params } });
            navigate('/Home/TherapistNavigation')
        
    };
    const PatientOPRegisterColumns = [
        {
            key: "Request_Id",
            name: 'Request Id',
            frozen: true
        },
        {
            key: "RegisterType",
            name: 'Patient Category',
            frozen: true
        },
        {
            key: "Registration_Id",
            name: "Register_Id",
        },
           {
            key: "PatientName",
            name: "Patient Name",
        },
         {
            key: "PatientId",
            name: "Patient Id",
        },
        {
            key: "Therapy_Name",
            name: "Therapy Name",
            width: 250,
        },
        {
            key: "Phone_no",
            name: "PhoneNo",
            width: 160,
        },
        {
            key: "Doctor_Name",
            name: "Doctor Name",
            width: 120,
        },
        {
            key: "Action",
            name: "Action",
            width: 110,
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleeditOPPatientRegister(params?.row)}
                >
                    <ArrowForwardIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        },
    ];
    return (
        <div className="Main_container_app">
            <h3>Oncology PatientQue List</h3>
            <div className="search_div_bar">
                <div className="search_div_bar_inp_1">
                    <label>Search by<span>:</span></label>
                    <input
                        type="text"
                        value={SearchQuery}
                        placeholder='Patient ID or Name or PhoneNo '
                        onChange={handleSearchChange}
                    />
                </div>
                {/* <div className=" RegisForm_1">
                    <label htmlFor="">Status
                        <span>:</span>
                    </label>
                    <select
                        id=''
                        name='status'
                        value={searchOPParams.status}
                        onChange={handleSearchChangeStatus}
                    >
                        <option value=''>Select</option>
                        <option value='Confirmed'>Confirmed</option>
                        <option value='NotConfirmed'>Not Confirmed</option>
                    </select>
                </div> */}
            </div>
            <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata} />
        </div>
    )
}

export default Oncology;





