import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector ,useDispatch} from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { format } from 'date-fns';
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useNavigate } from 'react-router-dom';
// import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';

const BirthRegister = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const UserData = useSelector((state) => state.userRecord?.UserData);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    console.log(userRecord,'userRecord');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [FilterbyPatientId, setFilterbyPatientId] = useState([]);
    console.log(FilterbyPatientId,'FilterbyPatientId');
    
    
    const [ReligionData, setReligionData] = useState([]);
    const [CastData, setCastData] = useState([]);

    // const [BirthData, setBirthData] = useState([]);
    // console.log(BirthData,'BirthData');
    
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [PatientRegisterData, setPatientRegisterData] = useState([])

    console.log(PatientRegisterData);
    
    const [RegisformdataBirth, setRegisformdataBirth] = useState({
        AgeAtTimeOfMarriage: '', 
        AgeAtTimeOfDelivery: '',
        PatientId: '',
        MotherName: '',
        FatherName: '',
        TypeOfDelivery: '',
        Gravida: '',
        DeliveryDate: '',
        DeliveryTime: '',
        GenderOfFetus: '',
        WeightOfFetus: '',
        BloodGroup: '',
        Cast: '',
        Relegion: '',
        MotherEducationBusiness: '',
        HusbandEducationBusiness: '',
        AddressOfMotherAtTimeOfDelivery: '',
        PermanentAddress: '',
        PregnancyPeriod: '',
        // Department: '',
        CreatedBy: '',
        Location: ''
    });

   

    useEffect(() => {
        setRegisformdataBirth((prev) => ({
            ...prev,
            DeliveryDate: format(new Date(), 'yyyy-MM-dd'),
            CreatedBy: userRecord?.username,
            Location: userRecord?.location,
            // Department:IP_DoctorWorkbenchNavigation?.RequestType,

        }));
    }, [userRecord])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegisformdataBirth((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/get_ip_registration_before_handover_details`)
            .then((res) => {
                const ress = res.data;
                console.log(ress);
                
                if (Array.isArray(ress)) {
                    setPatientRegisterData(ress);
                } else {
                    setPatientRegisterData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink])


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Relegion_Master_link`)
            .then((res) => {
                const ress = res.data;
                console.log(ress);
                setReligionData(ress);
               
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink])

   

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Cast_Master_link`)
            .then((res) => {
                const ress = res.data;
                console.log(ress);
                setCastData(ress);
               
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink])

    useEffect(() => {
        if (!searchQuery) {
            setFilterbyPatientId([]); // Clear filtered patients if no search query
            return;
        }

        const searchParams = {};
        const trimmedQuery = searchQuery.trim();

        if (/^[6-9]\d{9}$/.test(trimmedQuery)) {
            searchParams.PhoneNo = trimmedQuery;
        } else if (/^\d+$/.test(trimmedQuery)) {
            searchParams.PatientId = trimmedQuery;
        } else if (trimmedQuery) {
            const nameParts = trimmedQuery.split(" ");
            if (nameParts.length > 0) {
                searchParams.FirstName = nameParts[0];
            }
            if (nameParts.length > 2) {
                searchParams.MiddleName = nameParts.slice(1, nameParts.length - 1).join(" ");
                searchParams.SurName = nameParts[nameParts.length - 1];
            } else if (nameParts.length === 2) {
                searchParams.MiddleName = nameParts[1];
            }
        }

        console.log('Search Parameters:', searchParams);


        axios.get(`${UrlLink}Frontoffice/Filter_Patients_using_Multiple_Criteria`, { params: searchParams })
            .then((res) => {
                const data = res.data;
                console.log(data);
                
                if (data.length > 0) {
                    setFilterbyPatientId(data);
                } else {
                    setFilterbyPatientId([]); // Clear patient list if no match
                }
            })
            .catch((err) => {
                console.error('Error filtering patients:', err);
            });
    }, [searchQuery, UrlLink]);

    const HandlesearchPatient = () => {
        const queryParts = searchQuery.toLowerCase().split(" ").filter(Boolean);

        const patient = FilterbyPatientId.find((patient) => {
            const firstName = patient.FirstName.toLowerCase();
            const middleName = patient.MiddleName?.toLowerCase() || '';
            const surName = patient.SurName?.toLowerCase() || '';

            return queryParts.every(
                (part) =>
                    firstName.includes(part) ||
                    middleName.includes(part) ||
                    surName.includes(part) ||
                    patient.PatientId === searchQuery ||
                    String(patient.PhoneNo) === searchQuery
            );
        });
        console.log(patient,'patient');
        

        if (patient) {
            setSelectedPatient(patient);

            axios.get(`${UrlLink}Frontoffice/get_Patient_Details_by_patientId`, {
                params: { PatientId: patient.PatientId },
            })
                .then((res) => {
                    const data = res.data;
                    console.log(res.data,'5555555555');
                    
                    setRegisformdataBirth({
                        ...RegisformdataBirth,
                        MotherName: `${data.FirstName} ${data.MiddleName || ''} ${data.SurName || ''}`.trim(),
                        PatientId: data.PatientId,
                        AgeAtTimeOfDelivery: data.Age,
                        PermanentAddress: `${data.DoorNo || ''} ${data.Street || ''}, ${data.Area || ''}, ${data.City || ''}, ${data.State || ''}, ${data.Country || ''} - ${data.Pincode || ''}`,
                        MotherEducationBusiness: data.Occupation,
                    });
                })
                .catch((err) => {
                    console.error("Error fetching patient details:", err);
                });
        } else {
            setSelectedPatient(null); // Clear selected patient if not found
        }
    };

    const handleRestrictedAction = () => {
        alert("You do not have permission to perform this action.");
    };

    const handleSave = () => {
        // Ensure there is data in both FilterbyPatientId and PatientRegisterData
        if (FilterbyPatientId.length > 0 && PatientRegisterData.length > 0) {
            // Find the first matching patient based on PatientId
            const filteredPatient = FilterbyPatientId[0]; // Assuming only the first filtered patient is needed
            
            // Find the matching patient in PatientRegisterData
            const matchedPatient = PatientRegisterData.find(
                registerPatient => registerPatient.PatientId === filteredPatient.PatientId
            );
    
            if (matchedPatient) {
                // Use the RegistrationId from the matched patient
                const registrationId = matchedPatient.RegistrationId;
    
                // Build the data object with the single RegistrationId
                const SendData = {
                    ...RegisformdataBirth,
                    RegistrationId: registrationId, // Use the matched registration ID
                };
    
                console.log(registrationId, 'RegistrationId');
                console.log(SendData, 'SendData');
    
                // Send the data via axios POST request
                axios.post(`${UrlLink}Ip_Workbench/insert_birth_register`, SendData)
                    .then((res) => {
                        const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
    
                        dispatch({ type: 'toast', value: { message, type } });
                        navigate('/Home/BirthRegisterList');
    
                        // Reset form after successful registration
                        setRegisformdataBirth({
                            AgeAtTimeOfMarriage: '',
                            AgeAtTimeOfDelivery: '',
                            PatientId: '',
                            MotherName: '',
                            FatherName: '',
                            TypeOfDelivery: '',
                            Gravida: '',
                            DeliveryDate: '',
                            DeliveryTime: '',
                            GenderOfFetus: '',
                            WeightOfFetus: '',
                            AddressOfMotherAtTimeOfDelivery: '',
                            PermanentAddress: '',
                            MotherEducationBusiness: '',
                            HusbandEducationBusiness: '',
                            Cast: '',
                            Relegion: '',
                            BloodGroup: '',
                            PregnancyPeriod: '',
                           
                            CreatedBy: '',
                            Location: ''
                        });
                        // BirthData();
                        toast.success('Birth registration saved successfully!');
                    })
                    .catch((err) => {
                        console.error('Error saving birth registration:', err);
                        toast.error('Failed to save registration. Please try again.');
                    });
            } else {
                console.error('No matching RegistrationId found');
                toast.error('No matching patient found for registration.');
            }
        } else {
            console.error('Missing patient data for matching');
            toast.error('Cannot proceed with saving. Patient data is missing.');
        }
    };

    const handleSaveClick = () => {
        if (UserData?.Create) {
            handleSave(); // Proceed with form submission
        } else {
          handleRestrictedAction();// Show alert for unauthorized users
        }
    };
      
    
    // useEffect(() => {
        
    //     axios.get(`${UrlLink}Ip_Workbench/get_birth_register`)
    //         .then((res) => {
    //             console.log(res.data);
    //             setBirthData(res.data,'7777777777');  // Save the response in state
    //         })
    //         .catch((err) => {
    //             console.error("Error fetching birth register data:", err);
    //         });
    // }, [UrlLink]);
    
    

    const formatLabel = (label) => {
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase());
        }
        return label;
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (!value.trim()) {
            setRegisformdataBirth((prev) => ({
                ...prev,
                MotherName: '',
                PatientId: '',
                AgeAtTimeOfDelivery: '',
                PermanentAddress: '',
                MotherEducationBusiness: '',
            }));
        }
    };

    return (
        <div className="RegisFormcon_1">
            <div className="common_center_tag">
                <span>Birth Registration</span>
            </div>

            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label> Search Here <span>:</span> </label>
                    <input
                        list="patients"
                        type="text"
                        placeholder="Enter PatientId, PatientName, or Phone Number"
                        value={searchQuery}
                        onChange={handleChange}
                        onKeyDown={(e) => e.key === 'Enter' && HandlesearchPatient()}
                    />
                    <datalist id="patients">
                        {FilterbyPatientId.map((row, indx) => (
                            <option key={indx} value={row.PatientId}>
                                {`${row.PatientId} | ${row.PhoneNo} | ${row.FirstName} ${row.MiddleName} ${row.SurName}`}
                            </option>
                        ))}
                    </datalist>
                    <PersonSearchIcon onClick={HandlesearchPatient} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="RegisFormcon">
                    {Object.keys(RegisformdataBirth).filter((p) => !['CreatedBy', 'Location'].includes(p)).map((field, indx) => (
                        <div className="RegisForm_1" key={indx}>
                            <label>{formatLabel(field)}<span>:</span> </label>
                            {field === 'TypeOfDelivery' || field === 'GenderOfFetus' || field === 'BloodGroup' || field === 'Relegion' || field === 'Cast' ? (
                                <select
                                    name={field}
                                    value={RegisformdataBirth[field]}
                                    onChange={handleInputChange}
                                >
                                    <option value=''>Select</option>
                                    {field === 'TypeOfDelivery' && ['Normal', 'LSCS', 'Vacuum', 'Others'].map((option, indx) => (
                                        <option value={option} key={indx}>{option}</option>
                                    ))}
                                    {field === 'GenderOfFetus' && ['Male', 'Female'].map((option, indx) => (
                                        <option value={option} key={indx}>{option}</option>
                                    ))}
                                    {field === 'BloodGroup' && ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((option, indx) => (
                                        <option value={option} key={indx}>{option}</option>
                                    ))}
                                    {field === "Relegion" &&
                                    ReligionData?.map((row, indx) => (
                                        <option key={indx} value={row.religion}>
                                        {row.religion}
                                        </option>
                                    ))}
                                    {field === "Cast" &&
                                    CastData?.map((row, indx) => (
                                        <option key={indx} value={row.Cast}>
                                        {row.Cast}
                                        </option>
                                    ))}
                                </select>
                            ) : ['AddressOfMotherAtTimeOfDelivery', 'PermanentAddress'].includes(field) ? (
                                <textarea
                                    name={field}
                                    value={RegisformdataBirth[field]}
                                    onChange={handleInputChange}
                                    style={{ width: '300px'}}
                                    className='edjuwydrt56w ee33223'
                                />
                            ) : ['AgeAtTimeOfDelivery','AgeAtTimeOfMarriage', 'WeightOfFetus'].includes(field) ? (
                                <input
                                    type="number"
                                    name={field}
                                    value={RegisformdataBirth[field]}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <input
                                    type={field === 'DeliveryDate' ? "date" : field === 'DeliveryTime' ? 'time' : 'text'}
                                    name={field}
                                    value={RegisformdataBirth[field]}
                                    onChange={handleInputChange}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="Register_btn_con">
            <button
                onClick={handleSaveClick}
                className={`px-4 py-2 rounded ${
                    UserData?.Create
                    ? "bg-blue-500 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                >
                Save
                </button>
            </div>


            {/* <div className="Register_btn_con">
                <button className='RegisterForm_1_btns' onClick={handleSave}>Save</button>
            </div> */}

            <ToastContainer />
        </div>
    );
}

export default BirthRegister;

