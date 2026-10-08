import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from "@mui/icons-material/Loupe";



const DeathRegisterList = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const [DeathData, setDeathData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const UserData = useSelector((state) => state.userRecord?.UserData);


    const DeathRegisterListColumns = [
        { key: 'id', name: 'S.No', frozen: true },
        { key: 'FormNo', name: 'FormNo'},
        { key: 'DateOfDeath', name: 'DateOfDeath'},
        { key: 'PatientName', name: 'PatientName'},
        { key: 'PatientMotherName', name: 'PatientMotherName'},
        { key: 'PatientFatherName', name: 'PatientFatherName'},
        { key: 'PatientHusbandOrWife', name: 'PatientHusbandOrWife'},
        { key: 'Gender', name: 'Gender'},
        { key: 'Age', name: 'Age' },
        { key: 'AadharNo', name: 'AadharNo'},
        { key: 'FirstBloodRelativeName', name: 'FirstBloodRelativeName' },
        { key: 'RelationWithPatient', name: 'RelationWithPatient' },
        { key: 'CauseOfDeath', name: 'CauseOfDeath' },
        { key: 'TimeOfDeath', name: 'TimeOfDeath'},        
        { key: 'Department', name: 'Department' },
        { key: 'Createdby', name: 'CreatedBy' },
        { key: 'PrimaryDoctorName', name: 'Doctor Name', frozen: true },
        { key: 'CurrDate', name: 'Date', frozen: true },
        { key: 'CurrTime', name: 'Time', frozen: true },
  
    ];


    useEffect(() => {
        axios.get(`${UrlLink}Ip_Workbench/get_death_register`,{params: {search: searchQuery}})
            .then((res) => {
                console.log(res.data);
                setDeathData(res.data,'7777777777');  // Save the response in state
            })
            .catch((err) => {
                console.error("Error fetching birth register data:", err);
            });
    }, [UrlLink,searchQuery]);

    const handleRestrictedAction = () => {
        alert("You do not have permission to perform this action.");
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Navigate to Birth/Death Register form
    const handleAdminofcform = () => {
        navigate('/Home/DeathRegister');
    };






  return (
    <>
        <div className="Main_container_app">
            <div className="RegisFormcon_1">
            <div className="common_center_tag">
                <span>Death List</span>
            </div>
                
                <div className="RegisFormcon_1 ">
                    <div className="RegisForm_1">
                        <label htmlFor="input">Search Here<span>:</span></label>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Enter PatientId, PatientName"
                        />
                    </div>

                    <button
                        className="btn_1"
                        title="New Register"
                        onClick={() => {
                            if(UserData?.Create){
                                handleAdminofcform()
                            } else {
                                handleRestrictedAction();
                            }

                        }}
                        
                    >
                        <LoupeIcon />
                    </button>
                </div>

                {/* <ReactGrid
                    columns={BirthRegisterListColumns}
                    RowData={BirthData}
                /> */}

                {DeathData.length >= 0 && (
                    <ReactGrid columns={DeathRegisterListColumns} RowData={DeathData} />
                )}

            </div>
        </div>
    </>
  )
}

export default DeathRegisterList;















