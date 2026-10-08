import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const IP_BillingDischargeQueslist = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    
    console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');
    
    // const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Pending' });
    // const dispatchvalue = useDispatch();
    // const navigate = useNavigate()

    const [PatientDischargeData, setPatientDischargeData] = useState([])
    console.log(PatientDischargeData,'PatientDischargeData');
    
    
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);

    useEffect(() => {
        fetchData();
    }, [UrlLink]);

    // useEffect(() => {
    //     axios.get(`${UrlLink}Ip_Workbench/IP_DischargeRequest_Details_Link`)
    //         .then((res) => {
    //             const ress = res.data;
    //             console.log(ress, 'API Response');
    //             if (Array.isArray(ress)) {
    //                 setPatientDischargeData(ress);
    //             } else {
    //                 setPatientDischargeData([]);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }, [UrlLink]);

   
    const fetchData = () => {
        axios.get(`${UrlLink}Ip_Workbench/IP_DischargeRequest_Details_Link`)
            .then((res) => {
                const ress = res.data;
                console.log(ress, 'API Response');
                if (Array.isArray(ress)) {
                    const PIdList = [...new Set(ress.map((item) => item.PatientId))];
                    const PnameList = [...new Set(ress.map((item) => item.PatientName))];
                    const PIPNOList = [...new Set(ress.map((item) => item.RegistrationId))];
                    setPatientDischargeData(ress);

                    setPatientnamesearch(PnameList);
                    setPatientphonenoserach(PIPNOList);
                    setFilteredPatientData(PIdList);
                } else {
                    setPatientDischargeData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };


    // const handleCheckboxChange = (row) => {
    //     console.log("Row data:", row); 
    
    //     const newValue = !row.Billing; 
    //     const isConfirmed = window.confirm(`Is Patient Clear for Discharge Approval?`);
    
    //     if (isConfirmed) {
    //         console.log("Sending update request with:", {
    //             RegistrationId: row.RegistrationId,
    //             Billingvalue: newValue,
    //             BillingStatus:'Completed'
    //         });
    
    //         axios.post(`${UrlLink}Ip_Workbench/Update_DischargeRequest_Details`, {
    //             RegistrationId: row.RegistrationId,
    //             Billingvalue: newValue,
    //             BillingStatus:'Completed'
    //         })
    //         .then((res) => {
    //             if (res.data.success) {
    //                 // Update local state with the new value for the 'Billing' field
    //                 const updatedData = PatientDischargeData.map(item => {
    //                     if (item.RegistrationId === row.RegistrationId) {
    //                         return { ...item, Billing: newValue };
    //                     }
    //                     return item;
    //                 });
    //                 setPatientDischargeData(updatedData);
    //                 fetchData();
    //                 console.log("Updated data:", updatedData);
    //             } else {
    //                 console.error('Failed to update the value', res.data);
    //             }
    //         })
    //         .catch((err) => {
    //             console.error("Error updating data:", err);
    //         });
    //     }
    // };
    
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
                Billingvalue: field === 'Billing' ? newValue : row.Billing,
                // LabStatus: field === 'Lab' ? 'Completed' : row.LabStatus,
                // RadiologyStatus: field === 'Radiology' ? 'Completed' : row.RadiologyStatus,
                BillingStatus: field === 'Billing' ? 'Completed' : row.BillingStatus
            });
    
            axios.post(`${UrlLink}Ip_Workbench/Update_DischargeRequest_Details`, {
                RegistrationId: row.RegistrationId,
                // Labvalue: field === 'Lab' ? newValue : row.Lab,
                // Radiologyvalue: field === 'Radiology' ? newValue : row.Radiology,
                Billingvalue: field === 'Billing' ? newValue : row.Billing,
                // LabStatus: field === 'Lab' ? 'Completed' : row.LabStatus,
                // RadiologyStatus: field === 'Radiology' ? 'Completed' : row.RadiologyStatus,
                BillingStatus: field === 'Billing' ? 'Completed' : row.BillingStatus,
                // LabStatusCheckedBy: field === 'Lab' ? userRecord?.username : '',
                // RadiologyStatusCheckedBy: field === 'Radiology' ? userRecord?.username : '',
                BillingStatusCheckedBy: field === 'Billing' ? userRecord?.username : '',
                // PharmacyStatusCheckedBy: field === 'Pharmacy' ? userRecord?.username : '',

            
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
                                BillingStatus: field === 'Billing' ? 'Completed' : item.BillingStatus
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
      key: "CurrBillingDate",
      name: "CurrBillingDate",
      frozen:true
  },
  {
      key: "CurrBillingTime",
      name: "CurrBillingTime",
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
        key: "Billing",
        name: "Billing",
        renderCell: (params) => (
            // Check BillingStatus instead of RadiologyStatus
            params.row.BillingStatus === 'Cancelled' ? null :
            params.row.BillingStatus === 'Completed' ? null : (
              <CheckCircleOutlineIcon
                onClick={() => handleCheckboxChange(params.row, 'Billing')}
              />
            ) // Render only if BillingStatus is neither 'Cancelled' nor 'Completed'
        )
    },
    {
        key: "BillingStatus",
        name: "Status",
    },
   
   
]


const [Patientidsearch,setPatientidsearch] = useState([]);
  const [Patientnamesearch,setPatientnamesearch] = useState([]);
  const [Patientphonenoserach,setPatientphonenoserach] = useState([]);
  const [filteredPatientData, setFilteredPatientData] = useState([]);


const [SearchQueryfilter, setSearchQueryfilter] = useState({
      searchpname: '',
      searchIPNO:  '',
      searchpid:  '', 
    });

const handleSearchChangefilter = (e) => {
    const { name, value } = e.target;
    setSearchQueryfilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

useEffect(() => {
    const { searchpname, searchIPNO, searchpid } = SearchQueryfilter;

    const filteredData = PatientDischargeData.filter((item) => {
      const matchesPid = searchpid
        ? item.PatientId.toLowerCase().includes(searchpid.toLowerCase())
        : true;
      const matchesPname = searchpname
        ? item.PatientName.toLowerCase().includes(searchpname.toLowerCase())
        : true;
      const matchesIPNO = searchIPNO
    ? item.RegistrationId.toLowerCase().includes(searchIPNO.toLowerCase())
    : true;

      return matchesPid && matchesPname && matchesIPNO;
    });

    setFilteredPatientData(filteredData);
  }, [SearchQueryfilter, PatientDischargeData]);

  return (
    <>
    <div className="Main_container_app">
        <h3>Patient Discharge QueList</h3>


         <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
          <div className="RegisForm_1">
                <label>Patient Id<span>:</span></label>
                <input
                  type="text"
                  name="searchpid"
                  list="pids"
                  value={SearchQueryfilter.searchpid}
                  onChange={handleSearchChangefilter}
                />
                <datalist id="pids">
                  {Patientidsearch.map((opdr, index) => (
                    <option key={index} value={opdr} />
                  ))}
                </datalist>
        </div>

                     <div className="RegisForm_1">
                <label>Patient Name<span>:</span></label>
                <input
                  type="text"
                  name="searchpname"
                  list="pnames"
                  value={SearchQueryfilter.searchpname}
                  onChange={handleSearchChangefilter}
                />
                <datalist id="pnames">
                  {Patientnamesearch.map((opdr, index) => (
                    <option key={index} value={opdr} />
                  ))}
                </datalist>
              </div>

            <div className="RegisForm_1">
                <label>IP NO<span>:</span></label>
                <input
                  type="text"
                  name="searchIPNO"
                  list="pmobiles"
                  value={SearchQueryfilter.searchIPNO}
                  onChange={handleSearchChangefilter}
                />
                <datalist id="pmobiles">
                  {Patientphonenoserach.map((opdr, index) => (
                    <option key={index} value={opdr} />
                  ))}
                </datalist>
              </div>
              </div>
        
        {PatientDischargeData.length >= 0  &&
            <ReactGrid columns={PatientDischargeColumn} RowData={filteredPatientData} />
        }


        {/* {PatientDischargeData.length > 0 ? (
            <ReactGrid columns={PatientDischargeColumn} RowData={PatientDischargeData} />
        ) : (
            <p>No discharge data found or there was an error loading the data.</p>
        )} */}
    </div>
</>
  )
}

export default IP_BillingDischargeQueslist;









