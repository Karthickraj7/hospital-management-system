import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';


const IP_WorkbenchQuelist = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [searchIPParams, setsearchIPParams] = useState({
         query: '',
         status: 'Admitted',
         type: 'IP' 
         });
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    const [IpPatientRegisterData, setIpPatientRegisterData] = useState([])
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);


    // useEffect(() => {
    //     axios.get(`${UrlLink}Frontoffice/get_ip_registration_before_handover_details`, { params: searchIPParams })
    //         .then((res) => {
    //             const ress = res.data;
    //             if (Array.isArray(ress)) {
    //                 setIpPatientRegisterData(ress);
    //             } else {
    //                 setIpPatientRegisterData([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }, [UrlLink, searchIPParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;

                // Fetch IP data or Casuality data based on the 'type' in searchIPParams
                if (searchIPParams.type === 'IP') {
                    response = await axios.get(`${UrlLink}Frontoffice/get_ip_registration_before_handover_details`, { params: searchIPParams });
                } else if (searchIPParams.type === 'Casuality') {
                    response = await axios.get(`${UrlLink}Frontoffice/get_patient_casuality_details`, { params: searchIPParams });
                }

                const data = response.data;

                // Check if the response is an array
                if (Array.isArray(data)) {
                    setIpPatientRegisterData(data);
                } else {
                    setIpPatientRegisterData([]);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [UrlLink, searchIPParams]); 

    const handleIIPTypeChange = (e) => {
        const newType = e.target.value;
        // Determine the new status based on the selected type
        const newStatus = newType === 'Casuality' ? 'Pending' : 'Admitted';

        // Update both type and status in state
        setsearchIPParams({ ...searchIPParams, type: newType, status: newStatus });
    };



    // const handleeditIPPatientRegister = (params) => {
    //     console.log('params',params)
    //     const { RegistrationId } = params;
      
    //         axios.get(`${UrlLink}OP/get_workbenchquelist_doctor`, { params: { RegistrationId: RegistrationId, Type: 'IP' } })
    //         .then((res) => {
    //             console.log(res);

    //             dispatchvalue({ type: 'IP_DoctorWorkbenchNavigation', value: res.data});
    //             navigate('/Home/IP_DoctorWorkbenchNavigation');
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })


    // }

    const handleeditIPPatientRegister = (params, type) => {
        console.log('params', params);
        const { RegistrationId } = params;

        const requestType = type || searchIPParams.type; // Use selected type or fallback to default

        axios.get(`${UrlLink}OP/get_workbenchquelist_doctor`, { params: { RegistrationId, Type: requestType } })
            .then((res) => {
                console.log(res);
                dispatchvalue({ type: 'IP_DoctorWorkbenchNavigation', value: { ...res.data, ...params,RequestType:requestType } });
                navigate('/Home/WardManagementFolder');
                dispatchvalue({ type: 'HrFolder', value:'IP_DoctorWorkbenchNavigation'});
                dispatchvalue({ type: "setPreviousFolder", value: null }); 
                dispatchvalue({ type: "showMenu", value: true });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    


    const handleIPSearchChange = (e) => {
        const { name, value } = e.target

        setsearchIPParams({ ...searchIPParams, [name]: value });

    };

    const PatientIPRegisterColumns = [
        {
            key: "id",
            name: "S.No",
            frozen: pagewidth > 500 ? true : false
        },
        {
            key: "PatientId",
            name: "Patient Id",
            frozen: pagewidth > 500 ? true : false
        },
        {
            key: "PatientName",
            name: "Patient Name",
            width: 150,
            frozen: pagewidth > 500 ? true : false
        },
        {
            key: "PhoneNo",
            name: "PhoneNo",
        },
       
        {
            key: "Complaint",
            name: "Complaint",
        },
        {
            key: "isMLC",
            name: "isMLC",
            frozen: pagewidth > 500 ? true : false
        },
        {
            key: "isRefferal",
            name: "isRefferal",
        },
        {
            key: "Status",
            name: "Status",
        },
        {
            key: "Specilization",
            name: "Specilization",
        },
        {
            key: "DoctorName",
            name: "Doctor Name",
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                (params.row.Status === 'Admitted' || params.row.Status === 'Pending') ? (
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditIPPatientRegister(params.row, searchIPParams.type)} // Use selected type
                    >
                        <ArrowForwardIcon className="check_box_clrr_cancell" />
                    </Button>
                ) : (
                    '-'
                )
            ),
        }
    ]

    return (
        <>
            <div className="Main_container_app">
                <h3>Doctor Que List</h3>
                {/* <div className='DivCenter_container'>OP Patient Details </div> */}
                <div className="search_div_bar">
                    <div className=" search_div_bar_inp_1">
                        <label htmlFor="">Search by
                            <span>:</span>
                        </label>
                        <input
                            type="text"
                            name='query'
                            value={searchIPParams.query}
                            placeholder='Search here ... '
                            onChange={handleIPSearchChange}
                        />
                    </div>
                    <div className="search_div_bar_inp_1">
                        <label htmlFor="">Status
                            <span>:</span>
                        </label>
                        <select
                            id=''
                            name='status'
                            value={searchIPParams.status}
                            onChange={handleIPSearchChange}
                        >
                            {/* <option value=''>Select</option> */}
                            {/* <option value='Pending'>Pending</option> */}
                            <option value='Admitted'>Admitted</option>
                            <option value='Cancelled'>Cancelled</option>
                            <option value='Pending'>Pending</option>
                            <option value='Completed'>Completed</option>
                        </select>
                    </div>

                    <div className="search_div_bar_inp_1">
                        <label>Type<span>:</span></label>
                        <select value={searchIPParams.type} onChange={handleIIPTypeChange}>
                            <option value="IP">IP</option>
                            <option value="Casuality">Casuality</option>
                        </select>
                    </div>


                </div>
                <ReactGrid columns={PatientIPRegisterColumns} RowData={IpPatientRegisterData} />
            
            </div>
        </>
    )
}

export default IP_WorkbenchQuelist