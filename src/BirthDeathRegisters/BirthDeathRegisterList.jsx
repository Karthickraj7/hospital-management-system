import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Birthdeathregister.css';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid'; // Assuming ReactGrid is a custom component


export default function BirthDeathRegisterList() {

    const dispatchvalue = useDispatch();
    const navigate = useNavigate();

    const isSidebarOpen = useSelector(state => state.userRecord?.isSidebarOpen);
    const userRecord = useSelector(state => state.userRecord?.UserData);

    const [AppointmentRegisType, setAppointmentRegisType] = useState('Birth');
    const [searchQuery, setSearchQuery] = useState('');
    const [summa, setSumma] = useState([]);
    const [BthDethRegisterData, setBthDethRegisterData] = useState([]);
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);


    // Fetch the birth or death register based on AppointmentRegisType
    useEffect(() => {
        if (AppointmentRegisType) {
            axios.get(`http://127.0.0.1:8000/ipregistration/${AppointmentRegisType === 'Birth' ? 'get_birth_register' : 'get_death_register'}`)
                .then((response) => {
                    const data = response.data;
                    console.log('Data fetched:', data);
                    setSumma(data);
                    setBthDethRegisterData(data.map((row, index) => ({
                        id: row.S_No,
                        ...row
                    })));
                })
                .catch((error) => {
                    console.error('Error fetching register data:', error);
                });
        }
    }, [AppointmentRegisType]);

    // Filter the rows based on search query
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filteredData = summa.filter((row) => {
            const lowerCasePatientId = row.PatientId.toLowerCase();
            return lowerCasePatientId.includes(lowerCaseQuery);
        });
        setBthDethRegisterData(filteredData);
    }, [searchQuery, summa]);

    // Format the column headers to be more readable
    const formatLabel = (label) => {
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };

    // Get the width of text to dynamically adjust column width
    function getTextWidth(text) {
        const dummyElement = document.createElement("span");
        dummyElement.textContent = text;
        dummyElement.style.visibility = "hidden";
        dummyElement.style.whiteSpace = "nowrap";
        document.body.appendChild(dummyElement);
        const width = dummyElement.offsetWidth;
        document.body.removeChild(dummyElement);
        return width;
    }

    // Define dynamic columns for the grid based on the register type (Birth/Death)
    const dynamicColumns = () => {
        if (AppointmentRegisType === 'Birth') {
            return [
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
                    key: "MotherName",
                    name: "Mother Name",
                    width: 150,
                    frozen: pagewidth > 500 ? true : false
                },
                {
                    key: "FatherName",
                    name: "Father Name",
                },
                {
                    key: "TypeOfDelivery",
                    name: "Type Of Delivery",
                    width: 150,
                },
                {
                    key: "Gravida",
                    name: "Gravida",
                },
                {
                    key: "DeliveryDate",
                    name: "Delivery Date",
                },
                {
                    key: "DeliveryTime",
                    name: "Delivery Time",
                },
                {
                    key: "GenderOfFetus",
                    name: "Gender Of Fetus",
                    width: 150,

                },
                {
                    key: "WeightOfFetus",
                    name: "Weight Of Fetus",
                    width: 150,

                },
                {
                    key: "AddressOfMotherAtTimeOfDelivery",
                    name: "Current Address",
                    width: 150,

                },
                {
                    key: "PermanentAddress",
                    name: "Permanent Address",
                    width: 150,

                },
                {
                    key: "MotherEducationBusiness",
                    name: "Mother's Education/Business",
                    width: 250,

                },
                {
                    key: "HusbandEducationBusiness",
                    name: "Husband's Education/Business",
                    width: 250,

                },
                {
                    key: "Cast",
                    name: "Cast",
                },
                {
                    key: "BloodGroup",
                    name: "Blood Group",
                },
                {
                    key: "PregnancyPeriod",
                    name: "Pregnancy Period",
                    width: 150,

                },
                {
                    key: "Department",
                    name: "Department",
                },
                {
                    key: "CreatedBy",
                    name: "Created By",
                },
                {
                    key: "Location",
                    name: "Location",
                },
                {
                    key: "CreatedAt",
                    name: "Created At",
                },
            ];
        } else {
            return [
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
                    key: "PatientAddress",
                    name: "Patient Address",
                    width: 150,

                },
                {
                    key: "DateOfDeath",
                    name: "Date Of Death",
                },
                {
                    key: "Gender",
                    name: "Gender",
                },
                {
                    key: "Age",
                    name: "Age",
                },
                {
                    key: "AadharNo",
                    name: "Aadhar No",
                },
                {
                    key: "FirstBloodRelativeName",
                    name: "First Blood Relative Name",
                    width: 250,

                },
                {
                    key: "MobileNo",
                    name: "Mobile No",
                },
                {
                    key: "RelationWithPatient",
                    name: "Relation With Patient",
                    width: 250,

                },
                {
                    key: "CauseOfDeath",
                    name: "Cause Of Death",
                    width: 150,

                },
                {
                    key: "TimeOfDeath",
                    name: "Time Of Death",
                },
                {
                    key: "Department",
                    name: "Department",
                },
                {
                    key: "CreatedBy",
                    name: "Created By",
                },
                {
                    key: "Location",
                    name: "Location",
                },
                {
                    key: "CreatedAt",
                    name: "Created At",
                },
            ];
        }
    };
    
    
    

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Navigate to Birth/Death Register form
    const handleAdminofcform = () => {
        navigate('/Home/BirthDeathRegister');
    };

    return (
        <div className="Main_container_app">
            <div className="RegisFormcon_1">
                <div className="h_head">
                    <h4>Birth / Death List</h4>
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
                                    {p === "Birth" ? "Birth Register " : "Death Register "}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="con_1 ">
                    <div className="inp_1">
                        <label htmlFor="input">Patient Id <span>:</span></label>
                        <input type="text" value={searchQuery} onChange={handleSearchChange} />
                    </div>

                    <button
                        className="btn_1"
                        onClick={() => handleAdminofcform()}
                        title="New Register"
                    >
                        <LoupeIcon />
                    </button>
                </div>

                <ReactGrid
                    columns={dynamicColumns()}
                    RowData={BthDethRegisterData}
                />

            </div>
        </div>
    );
}
