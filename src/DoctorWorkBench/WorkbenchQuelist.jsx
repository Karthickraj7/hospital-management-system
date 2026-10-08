import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';


const WorkbenchQuelist = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Pending' });
    const [searchDoctorParams, setsearchDoctorParams] = useState({Doctor:'' });
    console.log("123",searchDoctorParams);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    const [PatientRegisterData, setPatientRegisterData] = useState([]);
    const [DoctorNames, setDoctorNames] = useState([]);
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);
    const userRecord = useSelector((state) => state.userRecord?.UserData);



    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/get_patient_appointment_details_withoutcancelled`, {
            params: { ...searchOPParams, location: userRecord?.location }
        })
        .then((res) => {
            const ress = res.data;
            console.log("23", ress);
            if (Array.isArray(ress)) {
                setPatientRegisterData(ress);
            } else {
                setPatientRegisterData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink, searchOPParams, userRecord?.location]);
    
    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/get_patient_appointment_details_specifydoctor`, { params: searchDoctorParams })
            .then((res) => {
                const ress = res.data;
                if (Array.isArray(ress)) {
                    setPatientRegisterData(ress);
                } 
                else {
                    setPatientRegisterData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink, searchDoctorParams]);


    useEffect(() => {
        axios.get(`${UrlLink}Masters/get_All_DoctorNames`)
            .then((res) => {
                const ress = res.data;
                console.log("DoctorsNames",ress);
                if (Array.isArray(ress)) {
                    setDoctorNames(ress);
                } else {
                    setDoctorNames([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink]);

    const handleeditOPPatientRegister = (params) => {
        console.log('params',params)
        const { RegistrationId } = params;
        axios.get(`${UrlLink}OP/get_workbenchquelist_doctor`, { params: { RegistrationId: RegistrationId, Type: 'OP' } })
            .then((res) => {
                console.log(res);
                dispatchvalue({ type: 'DoctorWorkbenchNavigation', value: { ...res.data } });
                navigate('/Home/DoctorWorkbenchNavigation');
            })
            .catch((err) => {
                console.log(err);
            })



    }


    const handleSearchChange = (e) => {
        const { name, value } = e.target

        setsearchOPParams({ ...searchOPParams, [name]: value });


    };

    const handleDoctorSearch = (e) => {
        const { name, value } = e.target;
        console.log("Selected Doctor ID:", value);
      
        // Update searchDoctorParams state with the selected doctor ID
        setsearchDoctorParams({ ...searchDoctorParams, [name]: value });
      
      };

    const PatientOPRegisterColumns = [
        {
            key: "id",
            name: "S.No",
            frozen: pagewidth > 500 ? true : false
        },
        {
            key: "FlaggingColour",
            name: "Flagging Colour",
            frozen: true,

            renderCell: (params) => (
                <div
                    style={{
                        backgroundColor: params.row.FlaggingColour || "transparent",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFF", // Adjust text color for visibility
                        padding: "4px",
                        borderRadius: "4px",
                        fontWeight: "bold"
                    }}
                >
                    {params.row.Flagging ? params.row.Flagging : "N/A"}
                </div>
            ),
        },
        {
            key: "PatientId",
            name: "Patient Id",
            frozen: pagewidth > 500 ? true : false
        },
        {
            key: "PatientName",
            name: "Patient Name",
            width: 200,
            frozen:  true 
        },
        {
            key: "Age",
            name: "Age",
        },
        {
            key: "Gender",
            name: "Gender",
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
            key: "VisitId",
            name: "VisitId",
        },
        // {
        //     key: "isMLC",
        //     name: "isMLC",
            
        // },
        {
            key: "isRefferal",
            name: "isRefferal",
        },
        {
            key: "Status",
            name: "Status",
        },
        // {
        //     key: "Specilization",
        //     name: "Specilization",
        // },
        // {
        //     key: "DoctorName",
        //     name: "Doctor Name",
        // },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditOPPatientRegister(params.row)}
                    >
                        <ArrowForwardIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },
    ]

    return (
        <>
            <div className="Main_container_app">
                <h3>Doctor Que List</h3>
                {/* <div className='DivCenter_container'>OP Patient Details </div> */}
                <div className="search_div_bar">
                    <div className="search_div_bar_inp_1">
                        <label htmlFor="">Search by
                            <span>:</span>
                        </label>
                        <input
                            type="text"
                            name='query'
                            value={searchOPParams.query}
                            placeholder='Search here... '
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="RegisFormcon">
                        <label>Status <span>:</span></label>
                        <div
                            style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "150px",
                            }}
                        >
                            <label style={{ width: "auto" }} htmlFor="status_yes">
                            <input
                                required
                                id="status_yes"
                                type="radio"
                                name="status"
                                value="Pending"
                                style={{ width: "15px" }}
                                checked={searchOPParams.status === "Pending"}
                                onChange={handleSearchChange}
                            />
                            Pending
                            </label>
                            <label style={{ width: "auto" }} htmlFor="status_no">
                            <input
                                required
                                id="status_no"
                                type="radio"
                                name="status"
                                value="Completed"
                                style={{ width: "15px" }}
                                checked={searchOPParams.status === "Completed"}
                                onChange={handleSearchChange}
                            />
                            Completed
                            </label>
                        </div>
                    </div>
                    {/* <div className="search_div_bar_inp_1">
                        <label htmlFor="">Status
                            <span>:</span>
                        </label>
                        <select
                            id=''
                            name='status'
                            value={searchOPParams.status}
                            onChange={handleSearchChange}
                        >
                            <option value='Pending'>Pending</option>
                            <option value='Completed'>Completed</option>
                        </select>
                    </div> */}
                    <div className="search_div_bar_inp_1">
  <label htmlFor="doctor">Doctor Name<span>:</span></label>
  <select
    id=''
    name='Doctor'
    value={searchDoctorParams.Doctor}
    onChange={handleDoctorSearch}
  >
    <option value="">Select</option> {/* Default option */}
    {DoctorNames.map((doctor, index) => (
      <option key={index} value={doctor.id}>
        {doctor.ShortName}
      </option>
    ))}
  </select>
</div>



                </div>
                <ReactGrid columns={PatientOPRegisterColumns} RowData={PatientRegisterData} />
            
            </div>
        </>
    )
}

export default WorkbenchQuelist




