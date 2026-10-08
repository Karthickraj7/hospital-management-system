import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from "@mui/icons-material/Loupe";


const BirthRegisterList = () => {
    const dispatch = useDispatch();

    const UserData = useSelector((state) => state.userRecord?.UserData);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const [BirthData, setBirthData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();


    const BirthRegisterListColumns = [
        { key: 'id', name: 'S.No', frozen: true },
        { key: 'AgeAtTimeOfMarriage', name: 'AgeAtTimeOfMarriage',width: 200},
        { key: 'AgeAtTimeOfDelivery', name: 'AgeAtTimeOfDelivery',width: 200},
        { key: 'ChildId', name: 'ChildId'},
        { key: 'MotherName', name: 'Mother Name',width: 150, },
        { key: 'FatherName', name: 'Father Name' },
        { key: 'TypeOfDelivery', name: 'Type Of Delivery',width: 200},
        { key: 'Gravida', name: 'Gravida' },
        { key: 'DeliveryDate', name: 'Delivery Date' },
        { key: 'DeliveryTime', name: 'Delivery Time' },
        { key: 'GenderOfFetus', name: 'Gender Of Fetus' ,width: 150,},
        { key: 'WeightOfFetus', name: 'Weight Of Fetus',width: 150, },
        { key: 'AddressOfMotherAtTimeOfDelivery', name: 'Current Address',width: 150, },
        { key: 'PermanentAddress', name: 'Permanent Address',width: 150,},
        { key: 'MotherEducationBusiness', name: 'Mother Education  & Business',width: 250,},
        { key: 'HusbandEducationBusiness', name: 'Husband Education & Business',width: 250,},
        { key: 'Cast', name: 'Cast' },
        { key: 'Relegion', name: 'Relegion' },
        { key: 'BloodGroup', name: 'BloodGroup' },
        { key: 'PregnancyPeriod', name: 'Pregnancy Period' },
        { key: 'Department', name: 'Department' },
        { key: 'Createdby', name: 'CreatedBy' },
        { key: 'PrimaryDoctorName', name: 'Doctor Name', frozen: true },
        { key: 'CurrDate', name: 'Date', frozen: true },
        { key: 'CurrTime', name: 'Time', frozen: true },

     
        
    ];

    

    // useEffect(() => {
    //     if (!searchQuery) {
    //         setBirthData([]);
    //         return;
    //     }
    //     const searchParams = {};

    //     if (searchQuery.startsWith("CHI")) {
    //         searchParams.PatientId = searchQuery; // Assuming PatientId starts with 'CHI'
    //     } else {
    //         searchParams.MotherName = searchQuery;
    //     }
        
    //     axios.get(`${UrlLink}Ip_Workbench/get_birth_register`,{params: searchParams})
    //         .then((res) => {
    //             console.log(res.data);
    //             setBirthData(res.data,'7777777777');  // Save the response in state
    //         })
    //         .catch((err) => {
    //             console.error("Error fetching birth register data:", err);
    //         });
    // }, [UrlLink,searchQuery]);

    const handleRestrictedAction = () => {
        alert("You do not have permission to perform this action.");
      };
    

    useEffect(() => {
        
        
        axios.get(`${UrlLink}Ip_Workbench/get_birth_register`,{params: {search: searchQuery}})
            .then((res) => {
                console.log(res.data);
                setBirthData(res.data,'7777777777');  // Save the response in state
            })
            .catch((err) => {
                console.error("Error fetching birth register data:", err);
            });
    }, [UrlLink,searchQuery]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Navigate to Birth/Death Register form
    const handleAdminofcform = () => {
        navigate('/Home/BirthRegister');
    };

    

  return (
    <>
        <div className="Main_container_app">
            <div className="RegisFormcon_1">
            <div className="common_center_tag">
                <span>Birth List</span>
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

                <div className='RegisFormcon_1 jjxjx_'>
                    {BirthData.length >= 0 && (
                        <ReactGrid columns={BirthRegisterListColumns} RowData={BirthData} />
                    )}
                </div>

            </div>
        </div>
    </>
  )
}

export default BirthRegisterList;