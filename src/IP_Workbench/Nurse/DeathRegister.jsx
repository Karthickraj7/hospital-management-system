import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector,useDispatch } from "react-redux";
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
 
import { ToastContainer, toast } from "react-toastify";
import { format } from 'date-fns';
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
 
import { useNavigate } from 'react-router-dom';
 
const DeathRegister = () => {
 
    const dispatch = useDispatch();
 
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const [searchQuery, setSearchQuery] = useState('');
    const [FilterbyPatientId, setFilterbyPatientId] = useState([]);
    const UserData = useSelector((state) => state.userRecord?.UserData);
   
    const [IpPatientRegisterData, setIpPatientRegisterData] = useState([])
    const [CasualityPatientRegisterData, setCasualityPatientRegisterData] = useState([])
 
    const [RegisformdataDeath, setRegisformdataDeath] = useState({
        FormNo: '',
        DateOfDeath: '',
        PatientId: '',
        PatientName: '',
        Gender: '',
        Age: '',
        AadharNo: '',
        TimeOfDeath: '',
        PlaceOfDeath: '',
        CauseOfDeath: '',
        PatientMotherName: '',
        PatientFatherName: '',
        PatientHusbandOrWife: '',
        MobileNo: '',
        FirstBloodRelativeName: '',
        RelationshipWithPatient: '',
        PatientAddress: '',
        CreatedBy: '',
        Location: ''
    })
 
    const [selectedPatient, setSelectedPatient] = useState(null);
 
    useEffect(() => {
        setRegisformdataDeath((prev) => ({
            ...prev,
            DateOfDeath: format(new Date(), 'yyyy-MM-dd'),
            CreatedBy: userRecord?.username,
           
            // Department:IP_DoctorWorkbenchNavigation?.RequestType,
 
        }));
        console.log(userRecord);
    }, [userRecord]);
 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
       
        if (name === 'MobileNo') {
            if (value.length <= 10) {
                setRegisformdataDeath((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setRegisformdataDeath((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
 
 
    useEffect(() => {
        if (!searchQuery) {
            setFilterbyPatientId([]);
            return;
        }
   
        const searchParams = {};
 
        if (searchQuery.match(/^\d{10}$/)) {
            searchParams.PhoneNo = searchQuery;
        } else if (searchQuery.trim().length > 0) {
            if (searchQuery.startsWith("CHI")) {
                searchParams.PatientId = searchQuery;
            } else {
                const nameParts = searchQuery.trim().split(" ");
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
        }
 
        console.log('Search Parameters:', searchParams);
 
        axios.get(`${UrlLink}Frontoffice/Filter_Patients_using_Multiple_Criteria`, {
            params: searchParams
        })
        .then((res) => {
            const data = res.data;
            console.log('API Response:', data);
            if (data.length > 0) {
                setFilterbyPatientId(data);
                console.log('Patients found for the given search query:', searchQuery, data);
            } else {
                console.warn('No patients found for the given search query:', searchQuery);
                setFilterbyPatientId([]);
            }
        })
        .catch((err) => {
            console.error('Error occurred while filtering patients:', err);
        });
    }, [searchQuery, UrlLink]);
 
    const HandlesearchPatient = () => {
        console.log("Search triggered for:", searchQuery);
       
        const queryParts = searchQuery.toLowerCase().split(" ").filter(Boolean);
   
        const patient = FilterbyPatientId.find(patient => {
            const firstName = patient.FirstName.toLowerCase();
            const middleName = patient.MiddleName?.toLowerCase() || '';
            const surName = patient.SurName?.toLowerCase() || '';
   
            return queryParts.every(part =>
                firstName.includes(part) ||
                middleName.includes(part) ||
                surName.includes(part) ||
                patient.PatientId === searchQuery ||
                String(patient.PhoneNo) === searchQuery
            );
        });
   
        if (patient) {
            setSelectedPatient(patient);
   
            axios.get(`${UrlLink}Frontoffice/get_Patient_Details_by_patientId`, {
                params: {
                    PatientId: patient.PatientId
                }
            })
            .then((res) => {
                const data = res.data;
                console.log(data, 'Patient Data');
               
                setRegisformdataDeath({
                    ...RegisformdataDeath,
                    PatientName: `${data.FirstName} ${data.MiddleName || ''} ${data.SurName || ''}`.trim(),
                    PatientId: data.PatientId,
                    MobileNo: data.PhoneNo,
                    Gender: data.Gender,
                    Age: data.Age,
                    AadharNo: data.UniqueIdType === 'Aadhar' ? data.UniqueIdNo : '',
                    PatientAddress: `${data.DoorNo || ''} ${data.Street || ''}, ${data.Area || ''}, ${data.City || ''}, ${data.State || ''}, ${data.Country || ''} - ${data.Pincode || ''}`,
                });
            })
            .catch((err) => {
                console.error("Error fetching patient details:", err);
            });
        } else {
            console.warn("No patient found for the search query:", searchQuery);
            setSelectedPatient(null);
        }
    };
 
    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/get_ip_registration_before_handover_details`)
            .then((res) => {
                const ress = res.data;
                console.log(ress,'IP');
               
                if (Array.isArray(ress)) {
                    setIpPatientRegisterData(ress);
                } else {
                    setIpPatientRegisterData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink])
 
    useEffect(() => {
        axios.get(`${UrlLink}Frontoffice/get_patient_casuality_details`)
            .then((res) => {
                const ress = res.data;
                console.log(ress,'Casuality');
               
                if (Array.isArray(ress)) {
                    setCasualityPatientRegisterData(ress);
                } else {
                    setCasualityPatientRegisterData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink])
 
    const handleRestrictedAction = () => {
        alert("You do not have permission to perform this action.");
    };
 
    const handleSave = () => {
        if (
            FilterbyPatientId.length > 0 &&
            (IpPatientRegisterData.length > 0 || CasualityPatientRegisterData.length > 0)
        ) {
            const filteredPatient = FilterbyPatientId[0];
   
            // Find patient in either IpPatientRegisterData or CasualityPatientRegisterData
            const matchedPatient = IpPatientRegisterData.find(
                IpPatient => IpPatient.PatientId === filteredPatient.PatientId
            ) || CasualityPatientRegisterData.find(
                CasualityPatient => CasualityPatient.PatientId === filteredPatient.PatientId
            );
   
            if (matchedPatient) {
                // Use the RegistrationId from the matched patient
                const registrationId = matchedPatient.RegistrationId;
   
                const SendData = {
                    ...RegisformdataDeath,
                    RegistrationId: registrationId,
                    Location: userRecord?.location,
               
                };
   
                console.log(SendData, 'SendData');
   
                axios.post(`${UrlLink}Ip_Workbench/insert_death_register`, SendData)
                    .then((res) => {
                        const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
   
                        dispatch({ type: 'toast', value: { message, type } });
   
                        // Navigate to list page after successful registration
                        // navigate('/Home/BirthDeathRegisterList');
   
                        // Reset form data
                        setRegisformdataDeath({
                            FormNo: '',
                            DateOfDeath: '',
                            PatientId: '',
                            PatientName: '',
                            PatientAddress: '',
                            PatientMotherName: '',
                            PatientFatherName: '',
                            PatientHusbandOrWife: '',
                            Gender: '',
                            Age: '',
                            AadharNo: '',
                            FirstBloodRelativeName: '',
                            MobileNo: '',
                            RelationshipWithPatient: '',
                            PlaceOfDeath: '',
                            CauseOfDeath: '',
                            TimeOfDeath: '',
                           
                        });
                        toast.success('Death registration saved successfully!');
 
                    })
                    .catch((err) => {
                        console.error('Error occurred during registration:', err);
                        toast.error('Failed to save registration. Please try again.');
 
                    });
            }  
        }
    };
 
    const handleSaveClick = () => {
        if (UserData?.Create) {
            handleSave(); // Proceed with form submission
        } else {
          handleRestrictedAction();// Show alert for unauthorized users
        }
    };
   
 
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
 
        if (value.trim() === '') {
            setRegisformdataDeath(prevData => ({
                ...prevData,
                PatientName: '',
                PatientId: '',
                MobileNo: '',
                Gender: '',
                Age: '',
                AadharNo: '',
                PatientAddress: '',
            }));
        }
 
        console.log(value);
    };
 
    const formatLabel = (label) => {
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase());
        }
        return label;
    };
 
 
  return (
    <>
        <div className="RegisFormcon_1">
            <div className="common_center_tag">
                <span> Death Registration</span>
            </div>
           
            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label> Search Here <span>:</span> </label>
                    <input
                        list="patients" // Link input to the datalist
                        type="text"
                        placeholder="Enter PatientId, PatientName, or Phone Number"
                        value={searchQuery}
                        onChange={handleChange} // Update the search query
                        onKeyDown={(e) => e.key === 'Enter' && HandlesearchPatient()} // Trigger search on Enter
                    />
                    <datalist id="patients"> {/* Add an id to link with the input */}
                        {FilterbyPatientId.map((row, indx) => (
                            <option key={indx} value={row.FirstName}>
                                {`${row.PatientId} |${row.PhoneNo} | ${row.FirstName} | ${row.MiddleName} | ${row.SurName}`}  {/* Display PhoneNo and FirstName */}
                            </option>
                        ))}
                    </datalist>
 
                    <span>
                        <PersonSearchIcon onClick={HandlesearchPatient} /> {/* Call the search function on icon click */}
                    </span>
                </div>
            </div>
 
            <br/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} id='cupboard'>
                <div className="RegisFormcon ">
                    {Object.keys(RegisformdataDeath).filter((p) => !['CreatedBy', 'Location'].includes(p)).map((field, indx) => (
                        <div className="RegisForm_1" key={indx}>
                            <label>
                                {field === 'PatientHusbandOrWife' ? 'Patient Husband / Wife Name'
                                : field === 'PatientMotherName' ? 'MotherName'
                                : field === 'PatientFatherName' ? 'FatherName'
                                : field === 'FirstBloodRelativeName' ? 'First Blood Relation'
                                : formatLabel(field)}<span>:</span></label>
 
                            {/* <label>{formatLabel(field)}<span>:</span> </label> */}
 
                            {
                                field === 'Gender' ||
                                field === 'BloodGroup'
                                ?
                                    <select
                                        name={field}
                                        required
                                        value={RegisformdataDeath[field]}
                                        onChange={handleInputChange}
                                    >
                                        <option value=''>Select</option>
                                        {field === 'Gender' && ['Male', 'Female'].map((p, indx) => (
                                            <option value={p} key={indx}>{p}</option>
                                        ))}
                                        {field === 'BloodGroup' &&
                                            ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((p, indx) => (
                                                <option value={p} key={indx}>{p}</option>
                                            ))}
                                    </select>
                                    : ['PatientAddress'].includes(field) ?
                                        <textarea
                                            name={field}
                                            required
                                            placeholder='Maximum 250 letters'
                                            value={RegisformdataDeath[field]}
                                            onChange={handleInputChange}
                                        />
                                        : ['Age', 'AadharNo', 'MobileNo'].includes(field) ?
                                            <input
                                                type="number"
                                                name={field}
                                                required
                                                value={RegisformdataDeath[field]}
                                                onChange={handleInputChange}
                                            />
                                            :
                                            <input
                                                type={field === 'DateOfDeath' ? "date" : 'text'}
                                                name={field}
                                                required
                                                value={RegisformdataDeath[field]}
                                                onChange={handleInputChange}
                                            />
                            }
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
                // disabled={!UserData?.Create}
                >
                Save
            </button>
            </div>
            {/* <div className="Register_btn_con">
                <button className='RegisterForm_1_btns' onClick={handleSave}>Save</button>
            </div> */}
        </div>
    </>
 
  )
}
 
export default DeathRegister;
 