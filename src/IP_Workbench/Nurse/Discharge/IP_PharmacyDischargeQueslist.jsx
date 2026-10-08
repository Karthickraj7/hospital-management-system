import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const IP_PharmacyDischargeQueslist = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    
    console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');
     
    const [PatientDischargeData, setPatientDischargeData] = useState([])
    console.log(PatientDischargeData,'PatientDischargeData');
    
    
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);

    useEffect(() => {
        fetchData();
    }, [UrlLink]);


    const fetchData = () => {
        axios.get(`${UrlLink}Ip_Workbench/IP_DischargeRequest_Details_Link`)
        .then((res) => {
            const ress = res.data;
            console.log(ress, 'API Response');
            if (Array.isArray(ress)) {
                setPatientDischargeData(ress);
            } else {
                setPatientDischargeData([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };


      const handleCheckboxChange = (row, field) => {
        // Determine the new value for the field
        const newValue = !row[field]; 
    
        // Confirm the change with the user
        const isConfirmed = window.confirm(`Is Patient Clear for Discharge Approval?`);
    
        if (isConfirmed) {
            console.log("Sending update request with:", {
                RegistrationId: row.RegistrationId,
                // Labvalue: field === 'Lab' ? newValue : row.Lab,
                // Radiologyvalue: field === 'Radiology' ? newValue : row.Radiology,
                // Billingvalue: field === 'Billing' ? newValue : row.Billing,
                Pharmacyvalue: field === 'Pharmacy' ? newValue : row.Pharmacy,
                // LabStatus: field === 'Lab' ? 'Completed' : row.LabStatus,
                // RadiologyStatus: field === 'Radiology' ? 'Completed' : row.RadiologyStatus,
                // BillingStatus: field === 'Billing' ? 'Completed' : row.BillingStatus,
                PharmacyStatus: field === 'Pharmacy' ? 'Completed' : row.PharmacyStatus
            });
    
            axios.post(`${UrlLink}Ip_Workbench/Update_DischargeRequest_Details`, {
                RegistrationId: row.RegistrationId,
                // Labvalue: field === 'Lab' ? newValue : row.Lab,
                // Radiologyvalue: field === 'Radiology' ? newValue : row.Radiology,
                // Billingvalue: field === 'Billing' ? newValue : row.Billing,
                Pharmacyvalue: field === 'Pharmacy' ? newValue : row.Pharmacy,
                // LabStatus: field === 'Lab' ? 'Completed' : row.LabStatus,
                // RadiologyStatus: field === 'Radiology' ? 'Completed' : row.RadiologyStatus,
                // BillingStatus: field === 'Billing' ? 'Completed' : row.BillingStatus,
                PharmacyStatus: field === 'Pharmacy' ? 'Completed' : row.PharmacyStatus,
                // LabStatusCheckedBy: field === 'Lab' ? userRecord?.username : '',
                // RadiologyStatusCheckedBy: field === 'Radiology' ? userRecord?.username : '',
                // BillingStatusCheckedBy: field === 'Billing' ? userRecord?.username : '',
                PharmacyStatusCheckedBy: field === 'Pharmacy' ? userRecord?.username : '',

            })
            .then((res) => {
                if (res.data.success) {
                    // Update local state with the new value
                    const updatedData = PatientDischargeData.map(item => {
                        if (item.RegistrationId === row.RegistrationId) {
                            return { 
                                ...item, 
                                [field]: newValue,
                                // LabStatus: field === 'Lab' ? 'Completed' : item.LabStatus,
                                // RadiologyStatus: field === 'Radiology' ? 'Completed' : item.RadiologyStatus,
                                // BillingStatus: field === 'Billing' ? 'Completed' : item.BillingStatus,
                                PharmacyStatus: field === 'Pharmacy' ? 'Completed' : item.PharmacyStatus
                            };
                        }
                        return item;
                    });
                    setPatientDischargeData(updatedData);
                    fetchData(); // Refetch data after update
                    console.log("Updated data:", updatedData);
                } else {
                    console.error('Failed to update the value', res.data);
                }
            })
            .catch((err) => {
                console.error("Error updating data:", err);
            });
        }
    };

    
    const PatientDischargeColumn = [
    {
        key: "id",
        name: "S.No",
        frozen: pagewidth > 500 ? true : false
    },
    {
        key: "CurrPharmacyDate",
        name: "CurrPharmacyDate",
        frozen:true
    },
    {
        key: "CurrPharmacyTime",
        name: "CurrPharmacyTime",
        frozen:true
    },
    {
        key: "RegistrationId",
        name: "Registration Id",
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
        key: "Pharmacy",
        name: "Pharmacy",
        renderCell: (params) => (
            params.row.PharmacyStatus === 'Cancelled' ?  null : params.row.PharmacyStatus === 'Completed' ?  null : (
              <CheckCircleOutlineIcon
                onClick={() => handleCheckboxChange(params.row, 'Pharmacy')}
              />
            ) // Don't render anything if status is not 'Pending'
          )
    },
    {
        key: "PharmacyStatus",
        name: "Status",
    },
    // {
    //     key: "Radiology",
    //     name: "Radiology",
    //     renderCell: (row) => (
    //         <input
    //             type="checkbox"
    //             checked={row.Radiology}
    //             onChange={() => handleCheckboxChange(row, 'Radiology')}
    //         />
    //     )
    // },
    // {
    //     key: "Billing",
    //     name: "Billing",
    //     renderCell: (row) => (
    //         <input
    //             type="checkbox"
    //             checked={row.Billing}
    //             onChange={() => handleCheckboxChange(row, 'Billing')}
    //         />
    //     )
    // },

   
]

    

  return (
    <>
    <div className="Main_container_app">
        <h3>Patient Discharge QueList</h3>
        
        {PatientDischargeData.length >= 0  &&
            <ReactGrid columns={PatientDischargeColumn} RowData={PatientDischargeData} />
        }

    </div>
</>
  )
}

export default IP_PharmacyDischargeQueslist;