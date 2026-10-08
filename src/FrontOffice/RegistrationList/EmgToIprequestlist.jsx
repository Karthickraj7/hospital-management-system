import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';

const EmgToIprequestlist = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const UserData = useSelector(state => state.userRecord?.UserData)
    
    const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Pending' });
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    const [PatientRegisterData, setPatientRegisterData] = useState([])
    
    console.log(PatientRegisterData,'PatientRegisterData');
    
    
    
    useEffect(() => {
        
        axios.get(`${UrlLink}Ip_Workbench/insert_Emg_To_IP_convertion`, { params: searchOPParams })
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

    }, [UrlLink, searchOPParams]);

    const handleIpPatientRegister = (params) => {
        console.log('params', params)
        dispatchvalue({ type: 'EmgToIpConnect', value: { Type: 'IP', conversion: true, ...params ,Department: 'IP'} });
        navigate('/Home/FrontOfficeFolder')
        dispatchvalue({ type: 'HrFolder', value:'IPRegistration'});
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });
    }


    const handleRestrictedAction = () => {
        alert("You do not have permission to perform this action.");
    };
    

    const PatientIPRegisterColumns = [
        {
            key: "id",
            name: "S.No",
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
            key: "Age",
            name: "Age",
        },
        {
            key: "Status",
            name: "Status",
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                params.row.Status === 'Pending' ?
                    <>
                        <Button
                            className="cell_btn"
                            onClick={() => {
                                if (UserData?.Create){
                                    handleIpPatientRegister(params.row)
                                } else {
                                    handleRestrictedAction();
                                }
                            }
                            }
                        >
                            <ArrowForwardIcon className="check_box_clrr_cancell" />
                        </Button>
                    </>
                    : 'No Action'
            ),
        },
    ]


    return (
        <>
            <div className="Main_container_app">
                <h3>Ip Request Que List</h3>
                {/* <div className='DivCenter_container'>OP Patient Details </div> */}
                <div className="search_div_bar">

                    <div className=" RegisForm_1">
                        <label htmlFor="">Status
                            <span>:</span>
                        </label>
                        <select
                            id=''
                            name='status'
                            value={searchOPParams.status}
                            onChange={(e) => setsearchOPParams((prev) => ({
                                ...prev,
                                status: e.target.value
                            }))}
                        >
                            {/* <option value=''>Select</option> */}
                            <option value='Pending'>Pending</option>
                            <option value='Completed'>Completed</option>
                        </select>
                    </div>


                </div>
                <ReactGrid columns={PatientIPRegisterColumns} RowData={PatientRegisterData} />
            </div>
        </>
    )
}

export default EmgToIprequestlist;