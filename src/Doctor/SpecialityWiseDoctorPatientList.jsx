import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Diversity1Icon from "@mui/icons-material/Diversity1";
import '../PatientManagement/Patient.css';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';

const SpecialityWiseDoctorPatientList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const navigate = useNavigate();
    const dispatchvalue = useDispatch();
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);
    const UserData = useSelector(state => state.userRecord?.UserData)
    console.log(UserData,'UserData');
    
    const [SpecialityData, setSpecialityData] = useState([]);
   console.log(SpecialityData,'SpecialityData');
   
   
    const [selectedSpecialityId, setSelectedSpecialityId] = useState(null);
    console.log(selectedSpecialityId,'selectedSpecialityId');
    
    const [DoctorNames, setDoctorNames] = useState([]);
    const [PatientRegisterData, setPatientRegisterData] = useState([]);
    console.log(PatientRegisterData,'PatientRegisterData');
   
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [searchOPParams, setsearchOPParams] = useState({ query: '', DoctorId:UserData?.Doctor || "", SpecialityId: UserData?.Specialization || "",status: 'Registered'});

   
    // Fetch Speciality Data
    useEffect(() => {
        axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
            .then((res) => {
                const ress = res.data;
                setSpecialityData(ress);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink]);


    const filteredSpecialityData = UserData?.Specialization
    ? SpecialityData.filter((item) => item.Speciality_Id === UserData.Specialization)
    : SpecialityData;

    console.log(filteredSpecialityData,'filteredSpecialityData');
    

    // Fetch Doctors Based on Selected Specialty
    useEffect(() => {
        if (selectedSpecialityId) {
            axios.get(`${UrlLink}Masters/get_All_DoctorNames_with_specialitySpecific`, {
                params: { SpecialityId: selectedSpecialityId }
            })
                .then((res) => {
                    const ress = res.data;
                    setDoctorNames(ress);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setDoctorNames([]);
        }
    }, [UrlLink, selectedSpecialityId]);


//it get only patient list.............filters firstname,middlename,surname, patientid,phoneno,doctorid,status

    // Fetch Patient Queue List Based on Search Parameters
    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/get_OP_patient_Filter_SpecialityWise`, { params: searchOPParams })
            .then((res) => {
                const ress = res.data;
                setPatientRegisterData(Array.isArray(ress) ? ress : []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink, searchOPParams]);

    const handleSpecialitySelection = (id) => {
        console.log(id,'iddddddddddddd');
        
        setSelectedSpecialityId(id);
        setsearchOPParams({ ...searchOPParams, SpecialityId: id, DoctorId: "",status: 'Registered' }); // Reset search params for DoctorId
        setSelectedDoctor(""); // Clear selected doctor
        setPatientRegisterData([]); // Clear patient queue list
    };
    

    const handleDoctorSelection = (e) => {
        setSelectedDoctor(e.target.value);
        setsearchOPParams({ ...searchOPParams, DoctorId: e.target.value });
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setsearchOPParams({ ...searchOPParams, [name]: value });
    };

    // const handleEditPatientRegister = (params) => {
    //     const { RegistrationId } = params;
    //     axios.get(`${UrlLink}OP/get_workbenchquelist_doctor`, { params: { RegistrationId, Type: 'OP' } })
    //         .then((res) => {
    //             console.log(res.data,'tttttttttttttttttttttts');
    //             if(res.data && Object.keys(res.data).length!==0){

    //             dispatchvalue({ type: 'SpecialityWise_DoctorWorkbenchNavigation', value: res.data });
    //             console.log('hhhhhhhhhhhhhhhhh',res.data)
    //             navigate('/Home/DoctorWorkbenchNavigation');
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };


    const handleEditPatientRegister = (params) => {
        console.log('params',params)
        const { RegistrationId,DoctorId } = params;
        axios.get(`${UrlLink}OP/Get_Workbenchquelist_For_Doctor_Speciality`, { params: { RegistrationId: RegistrationId,DoctorId: DoctorId, Type: 'OP' } })
            .then((res) => {
                console.log(res,'spppppppppeccccccccccc');
                dispatchvalue({ type: 'SpecialityWise_DoctorWorkbenchNavigation', value: { ...res.data } });
                dispatchvalue({type:'DoctorWorkbenchNavigation', value: {}})
                
                navigate('/Home/DoctorWorkbenchNavigation');
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const PatientOPRegisterColumns = [
        { key: "id", name: "S.No", frozen: pagewidth > 500 },
        { key: "PatientId", name: "Patient Id", frozen: pagewidth > 500 },
        { key: "PatientName", name: "Patient Name", width: 200, frozen: true },
        { key: "Age", name: "Age" },
        { key: "Gender", name: "Gender" },
        { key: "PhoneNo", name: "PhoneNo" },
        { key: "Complaint", name: "Complaint" },
        { key: "Specilization", name: "Specialization" },
        { key: "DoctorName", name: "Doctor Name" },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => handleEditPatientRegister(params.row)}>
                    <ArrowForwardIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        },
    ];

    return (
        <>
            <div className="Main_container_app">
                <div className="DivCenter_container">Patients List</div>

                {/* Speciality Selection */}
                <div className="con_1">
                    {filteredSpecialityData.map((item) => (
                        <div
                            key={item.id}
                            className={`chart_body_1_child_1 dww3 ${item.id === selectedSpecialityId ? 'selected' : ''}`}
                            onClick={() => handleSpecialitySelection(item.id)}
                        >
                            <div className="chart_body_1_child_1_body">
                                <div className="chart_body_1_child_1_body_icon">
                                    <Diversity1Icon />
                                </div>
                                <div className="chart_body_1_child_1_body_name">
                                    {item.SpecialityName}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search and Filter Section */}
                <div className="search_div_bar">
                    <div className="search_div_bar_inp_1">
                        <label htmlFor="query">Search by<span>:</span></label>
                        <input
                            type="text"
                            name="query"
                            value={searchOPParams.query}
                            placeholder="Search here..."
                            onChange={handleSearchChange}
                        />
                    </div>
                    {UserData.Doctor ? (
                        // Display the doctor's name as read-only if UserData.Doctor exists
                        <div className="search_div_bar_inp_1">
                            <label htmlFor="doctor">
                                Doctor Name<span>:</span>
                            </label>
                            <input
                                type="text"
                                id="doctor"
                                name="Doctor"
                                value={UserData.DoctorName || "Doctor name not available"}
                                readOnly
                            />
                        </div>
                    ) : (
                        // Show a dropdown to select a doctor if UserData.Doctor does not exist
                        <div className="search_div_bar_inp_1">
                            <label htmlFor="doctor">
                                Doctor Name<span>:</span>
                            </label>
                            <select
                                id="doctor"
                                name="Doctor"
                                value={selectedDoctor}
                                onChange={handleDoctorSelection}
                            >
                                <option value="">Select</option>
                                {DoctorNames?.length > 0 ? (
                                    DoctorNames.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.ShortName}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>
                                        No doctors available
                                    </option>
                                )}
                            </select>
                        </div>
                    )}

                    
                </div>

                {/* Patient Queue List */}
                {filteredSpecialityData && filteredSpecialityData.length > 0 ? (
                    <ReactGrid columns={PatientOPRegisterColumns} RowData={PatientRegisterData} />
                ) : (
                    <div className="no-patient-message">
                        <p>Please select a specialization or doctor to view the patient queue.</p>
                    </div>
                )}

                
                </div>
        </>
    );
};

export default SpecialityWiseDoctorPatientList;
