import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector,useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { format } from 'date-fns';
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import { useNavigate } from 'react-router-dom';

const BirthDeathRegister = () => {
    const successMsg = (Message) => {
        toast.success(`${Message}`, {
            position: "top-center",
            autoClose: 100,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            style: { marginTop: "50px" },
        });
    };
    const userwarn = (warningMessage) => {
        toast.warn(`${warningMessage}`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            style: { marginTop: "50px" },
        });
    };



    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    console.log(userRecord,'userRecord');
    
    const navigate=useNavigate()
    const dispatchvalue = useDispatch();

    const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
    
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    
    console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');
    
    const [searchQuery, setSearchQuery] = useState('');
    console.log(searchQuery,'searchQuery');
    
    const [FilterbyPatientId, setFilterbyPatientId] = useState([]);
    
    console.log(FilterbyPatientId,'FilterbyPatientId');
    const [selectedPatient, setSelectedPatient] = useState(null);
    
    const [AppointmentRegisType, setAppointmentRegisType] = useState('Birth')
    
    
    const [RegisformdataBirth, setRegisformdataBirth] = useState({
        AgeAtTimeOfMaraige: '',
        AgeAtTimeOfDelivey: '',
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
        BloodGroup: '',
        PregnancyPeriod: '',
        Department: '',
        CreatedBy: '',
        Location: ''
    })



    const [RegisformdataDeath, setRegisformdataDeath] = useState({
        FormNo: '',
        DateOfDeath: '',
        PatientId: '',
        PatientName: '',
        PatientAddress: '',
        Gender: '',
        Age: '',
        AadharNo: '',
        FirstBloodRelativeName: '',
        MobileNo: '',
        RelationWithPatient: '',
        CauseOfDeath: '',
        TimeOfDeath: '',
        Department: '',
        CreatedBy: '',
        Location: ''
    })


    useEffect(() => {
        setRegisformdataBirth((prev) => ({
            ...prev,
            DeliveryDate: format(new Date(), 'yyyy-MM-dd'),
            // Location: userRecord?.location,
            CreatedBy: userRecord?.username
        }))
        setRegisformdataDeath((prev) => ({
            ...prev,
            DateOfDeath: format(new Date(), 'yyyy-MM-dd'),
            // Location: userRecord?.location,
            CreatedBy: userRecord?.username
        }))
        console.log(userRecord)
    }, [userRecord])


    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        console.log(name, value, type);

        if (AppointmentRegisType === 'Birth') {
            setRegisformdataBirth((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            if(name==='MobileNo'){
                if(value.length<=10){
                    setRegisformdataDeath((prev) => ({
                        ...prev,
                        [name]: value,
                    }));
                }
            }else{
                setRegisformdataDeath((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
            
        }


    };

    
    

    // useEffect(() => {
    //     if (!searchQuery) return; // Avoid calling API for empty search
    
    //     // Prepare search parameters based on the input
    //     const searchParams = {};
    
    //     // Check if the query is a PhoneNo (assuming a 10-digit number)
    //     if (searchQuery.match(/^\d{10}$/)) {
    //         searchParams.PhoneNo = searchQuery; // Treat as PhoneNo if it's 10 digits
    //     } else if (searchQuery.trim().length > 0) {
    //         // Assume search query is a Patient ID or Name
    //         if (searchQuery.startsWith("CHI")) {  // Check if it's a Patient ID
    //             searchParams.PatientId = searchQuery; 
    //         } else {
    //             // If the query is not a number, treat it as a name
    //             const nameParts = searchQuery.trim().split(" ");
    //             if (nameParts.length > 0) {
    //                 searchParams.FirstName = nameParts[0]; // Always set FirstName
    //             }
    //             if (nameParts.length > 2) {
    //                 searchParams.MiddleName = nameParts.slice(1, nameParts.length - 1).join(" "); // Join middle names if applicable
    //             }
    //             if (nameParts.length > 1) {
    //                 searchParams.SurName = nameParts[nameParts.length - 1]; // Last part is SurName
    //             }
    //         }
    //     }
    
    //     console.log('Search Parameters:', searchParams); // Log search parameters
    
    //     // Make the API call with the search parameters
    //     axios.get(`${UrlLink}Frontoffice/Filter_Patients_using_Multiple_Criteria`, {
    //         params: searchParams
    //     })
    //     .then((res) => {
    //         const data = res.data;
    //         console.log('API Response:', data); // Log API response
    //         if (data.length > 0) {
    //             setFilterbyPatientId(data); // Store the filtered patients
    //             console.log('Patients found for the given search query:', searchQuery, data);
    //         } else {
    //             console.warn('No patients found for the given search query:', searchQuery);
    //             setFilterbyPatientId([]); // Clear patient list if no match
    //         }
    //     })
    //     .catch((err) => {
    //         console.error('Error occurred while filtering patients:', err);
    //     });
    // }, [searchQuery, UrlLink]);
    
    useEffect(() => {
        if (!searchQuery) {
            // Clear any specific state you want when the searchQuery is empty
            setFilterbyPatientId([]); // Clear the filtered patient list when searchQuery is empty
            return; // Avoid calling API for empty search
        }
    
        // Prepare search parameters based on the input
        const searchParams = {};
    
        // Check if the query is a PhoneNo (assuming a 10-digit number)
        if (searchQuery.match(/^\d{10}$/)) {
            searchParams.PhoneNo = searchQuery; // Treat as PhoneNo if it's 10 digits
        } else if (searchQuery.trim().length > 0) {
            // Assume search query is a Patient ID or Name
            if (searchQuery.startsWith("CHI")) {  // Check if it's a Patient ID
                searchParams.PatientId = searchQuery;
            } else {
                // If the query is not a number, treat it as a name
                const nameParts = searchQuery.trim().split(" ");
                if (nameParts.length > 0) {
                    searchParams.FirstName = nameParts[0]; // Always set FirstName
                }
    
                // if (nameParts.length >= 1) {
                    
                //     searchParams.MiddleName = nameParts.slice(1, nameParts.length - 1).join(" ");
                // }
                // else 
                // {
                //     searchParams.SurName = nameParts[nameParts.length - 1];
                // }


                if (nameParts.length === 2) {
                    
                    searchParams.MiddleName = nameParts[1]
                    
                    // searchParams.SurName = nameParts[nameParts.length - 1]; // Last part is SurName
                }
                // else{

                //     searchParams.SurName = nameParts[nameParts.length - 1]; // Last part is SurName

                //     // searchParams.SurName = nameParts[1]; // Last part is SurName

                //     // searchParams.MiddleName = nameParts.slice(1, nameParts.length - 1).join(" "); // Join middle names if applicable

                // }
    
                // If there are more than 2 name parts, assume the last one is the Surname and the rest as MiddleName
                if (nameParts.length > 2) {
                    searchParams.MiddleName = nameParts.slice(1, nameParts.length - 1).join(" "); // Join middle names if applicable
                    searchParams.SurName = nameParts[nameParts.length - 1]; // Last part is SurName
                }
            }
        }
    
        console.log('Search Parameters:', searchParams); // Log search parameters
    
        // Make the API call with the search parameters
        axios.get(`${UrlLink}Frontoffice/Filter_Patients_using_Multiple_Criteria`, {
            params: searchParams
        })
        .then((res) => {
            const data = res.data;
            console.log('API Response:', data); // Log API response
            if (data.length > 0) {
                setFilterbyPatientId(data); // Store the filtered patients
                console.log('Patients found for the given search query:', searchQuery, data);
            } else {
                console.warn('No patients found for the given search query:', searchQuery);
                setFilterbyPatientId([]); // Clear patient list if no match
            }
        })
        .catch((err) => {
            console.error('Error occurred while filtering patients:', err);
        });
    }, [searchQuery, UrlLink]);
    


    const HandlesearchPatient = () => {
        console.log("Search triggered for:", searchQuery);
         
        
       
        // Split the search query into name parts and filter out empty values
        const queryParts = searchQuery.toLowerCase().split(" ").filter(Boolean);
    
        // Find the patient based on the search query (case-insensitive, partial matching)
        const patient = FilterbyPatientId.find(patient => {
            // Convert patient names to lowercase for case-insensitive comparison
            const firstName = patient.FirstName.toLowerCase();
            const middleName = patient.MiddleName?.toLowerCase() || '';
            const surName = patient.SurName?.toLowerCase() || '';
    
            // Check if each query part matches any part of the patient's name
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
    
            // Fetch additional patient details using PatientId
            axios.get(`${UrlLink}Frontoffice/get_Patient_Details_by_patientId`, {
                params: {
                    PatientId: patient.PatientId // Use the found patient's ID
                }
            })
            .then((res) => {
                const data = res.data;
                console.log(data, 'Patient Data');
    
                // Map the fetched data to the form fields based on the appointment type
                if (AppointmentRegisType === 'Birth') {
                    setRegisformdataBirth({
                        ...RegisformdataBirth,
                        MotherName: `${data.FirstName} ${data.MiddleName || ''} ${data.SurName || ''}`.trim(),
                        PatientId: data.PatientId,
                        AgeAtTimeOfDelivey: data.Age, 
                        PermanentAddress: `${data.DoorNo || ''} ${data.Street || ''}, ${data.Area || ''}, ${data.City || ''}, ${data.State || ''}, ${data.Country || ''} - ${data.Pincode || ''}`,
                        MotherEducationBusiness: data.Occupation, // Assuming mother's occupation
                    });
                } else {
                    setRegisformdataDeath({
                        ...RegisformdataDeath,
                        PatientName: `${data.FirstName} ${data.MiddleName || ''} ${data.SurName || ''}`.trim(),
                        PatientId: data.PatientId,
                        MobileNo: data.PhoneNo,
                        Gender: data.Gender,       // Map gender for death
                        Age: data.Age,             // Use the age for death
                        AadharNo: data.UniqueIdType === 'Aadhar' ? data.UniqueIdNo : '', // Use Aadhar number if type matches
                        PatientAddress: `${data.DoorNo || ''} ${data.Street || ''}, ${data.Area || ''}, ${data.City || ''}, ${data.State || ''}, ${data.Country || ''} - ${data.Pincode || ''}`,
                    });
                } 
            })
            .catch((err) => {
                console.error("Error fetching patient details:", err);
            });
        } else {
            console.warn("No patient found for the search query:", searchQuery);
            setSelectedPatient(null); // Clear selected patient if not found
        }
    };
    
    
    
    
    


    
    const handleSave = () => {
        // Select the form data based on the type of registration (Birth or Death)
        const formData = AppointmentRegisType === 'Birth' ? RegisformdataBirth : RegisformdataDeath;
    
        // Filter out fields that are not empty
        const filledFields = Object.keys(formData).filter((field) => formData[field]);
    
        console.log(filledFields, 'Filled fields');
    
        const SendData = {
            // Createdby: userRecord?.username,
            ...formData,
        };
    
        console.log(SendData, 'SendData');
    
        // API endpoint based on the type of registration
        const endpoint = AppointmentRegisType === 'Birth' ? 'insert_birth_register' : 'insert_death_register';
    
        axios.post(`${UrlLink}Ip_Workbench/${endpoint}`, SendData)
            .then((res) => {
                // Navigate to list page after successful registration
                // navigate('/Home/BirthDeathRegisterList');
    
                // Reset form data for Birth or Death based on the type
                if (AppointmentRegisType === 'Birth') {
                    setRegisformdataBirth({
                        AgeAtTimeOfMaraige: '',
                        AgeAtTimeOfDelivey: '',
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
                        BloodGroup: '',
                        PregnancyPeriod: '',
                        PatientId: ''
                    });
                } else {
                    setRegisformdataDeath({
                        FormNo: '',
                        DateOfDeath: '',
                        PatientId: '',
                        PatientName: '',
                        PatientAddress: '',
                        Gender: '',
                        Age: '',
                        AadharNo: '',
                        FirstBloodRelativeName: '',
                        MobileNo: '',
                        RelationWithPatient: '',
                        CauseOfDeath: '',
                        TimeOfDeath: '',
                        Department: ''
                    });
                }
            })
            .catch((err) => {
                // Log and handle the error appropriately
                console.error('Error occurred during registration:', err);
            });
    };
    
    
    const formatLabel = (label) => {
        // Check if the label contains both uppercase and lowercase letters, and doesn't contain numbers
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase letters
                .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
        } else {
            return label;
        }
    };
    
   


    const handleChange = (e) => {
        const value = e.target.value; // Get the current input value
        setSearchQuery(value); // Update the search query state
    
        // Clear registration data fields only if the search input is empty
        if (value.trim() === '') {
            // Clear specific fetched data fields based on AppointmentRegisType
            if (AppointmentRegisType === 'Birth') {
                setRegisformdataBirth(prevData => ({
                    ...prevData,
                    MotherName: '',
                    PatientId: '',
                    AgeAtTimeOfDelivey: '',
                    PermanentAddress: '',
                    MotherEducationBusiness: '', // Assuming mother's occupation
                }));
            } else {
                setRegisformdataDeath(prevData => ({
                    ...prevData,
                    PatientName: '',
                    PatientId: '',
                    MobileNo: '',
                    Gender: '', // Map gender for death
                    Age: '', // Use the age for death
                    AadharNo: '', // Use Aadhar number if type matches
                    PatientAddress: '',
                }));
            }
        }
    
        console.log(value); // Log the current input value for debugging
    };
    


    

    return (
        <>
            <div className="appointment">
                <div className="h_head">
                    <h4>Birth / Death Registration</h4>
                </div>
                <div className="RegisterTypecon">
                    <div className="RegisterType">
                        {["Birth", "Death"].map((p, ind) => (
                            <div className="registertypeval" key={ind}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={AppointmentRegisType === p}
                                    onChange={(e) => setAppointmentRegisType(e.target.value)}
                                    value={p}
                                />
                                <label htmlFor={p}>
                                    {p === "Birth"
                                        ? "Birth Register "
                                        : "Death Register "
                                    }
                                </label>
                            </div>
                            
                        ))}
                    </div>
                </div>
                <br />
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
                    <div className="RegisFormcon " >
                        {Object.keys(AppointmentRegisType === 'Birth' ? RegisformdataBirth : RegisformdataDeath).filter((p) => !['CreatedBy', 'Location','Department'].includes(p)).map((field, indx) => (
                            <div className="RegisForm_1" key={indx}>
                                <label>{formatLabel(field)}<span>:</span> </label>

                                {
                                    field === 'TypeOfDelivery' ||
                                    field==='GenderOfFetus' ||
                                    field==='Gender' ||
                                    field==='BloodGroup'
                                    ?
                                        <select
                                            name={field}
                                            required
                                            value={AppointmentRegisType === 'Birth' ? RegisformdataBirth[field] : RegisformdataDeath[field]}
                                            onChange={handleInputChange}
                                        >
                                            <option value=''>Select</option>
                                            {field==='TypeOfDelivery'&&['Normal', 'LSCS', 'Vaccum', 'Others'].map((p, indx) => (
                                                <option value={p} key={indx}>{p}</option>
                                            ))}
                                            {field==='GenderOfFetus'&&['Male', 'Female'].map((p, indx) => (
                                                <option value={p} key={indx}>{p}</option>
                                            ))}
                                            {field==='Gender'&&['Male', 'Female'].map((p, indx) => (
                                                <option value={p} key={indx}>{p}</option>
                                            ))}
                                             {field==='BloodGroup'&&
                                             ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((p, indx) => (
                                                <option value={p} key={indx}>{p}</option>
                                            ))}
                                        </select>
                                        : ['AddressOfMotherAtTimeOfDelivery', 'PermanentAddress', 'PatientAddress'].includes(field) ?
                                            <textarea
                                                name={field}
                                                required
                                                placeholder='Maximum 250 letters'
                                                value={AppointmentRegisType === 'Birth' ? RegisformdataBirth[field] : RegisformdataDeath[field]}
                                                onChange={handleInputChange}
                                            />
                                            :['AgeAtTimeOfMaraige','AgeAtTimeOfDelivey','WeightOfFetus','Age','AadharNo','MobileNo'].includes(field)?
                                            <input
                                                type="number"
                                                onKeyDown={blockInvalidChar}
                                                name={field}
                                                required
                                                value={AppointmentRegisType === 'Birth' ? RegisformdataBirth[field] : RegisformdataDeath[field]}
                                                onChange={handleInputChange}

                                            />
                                            :

                                            <input
                                                type={field==='DeliveryDate'||field==='DateOfDeath'?"date":field==='DeliveryTime'||field==='TimeOfDeath'?'time':'text'}
                                                name={field}
                                                required
                                                value={AppointmentRegisType === 'Birth' ? RegisformdataBirth[field] : RegisformdataDeath[field]}
                                                onChange={handleInputChange}

                                            />
                                }
                            </div>
                        ))}
                    </div>
                </div>
                <div className="Register_btn_con">
                        <button className='RegisterForm_1_btns' onClick={handleSave}>Save</button>
                    </div>
            </div>
        </>
    )

}

export default BirthDeathRegister;