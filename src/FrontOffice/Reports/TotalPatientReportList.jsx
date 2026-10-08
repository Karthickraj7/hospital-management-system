import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const TotalPatientReportList = () => {


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [PatientList,setPatientList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchPurpose,setSearchPurpose] = useState('');

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
      };

    const handlevisitChange = (e) => {
        setSearchPurpose(e.target.value);
      };

      


    const PatientListColumns = [
        {
            key: "id",
            name: "S.No",
            frozen: true
        },
        {
            key: "PatientName",
            name: "Patient Name",
            frozen: true
        },
        {
            key: "gender",
            name: "Gender",
            frozen: true
        },
        {
            key: "phoneno",
            name: "Phone No",
            frozen: true
        },
     
    ]
   useEffect(()=>{

    const params = searchQuery.trim()
      ? { search: searchQuery }
      : { limit: 10 };

    params.VisitPurpose = searchPurpose;

       axios.get(`${UrlLink}Frontoffice/get_total_patient_report_details`,{ params })
      .then((res) => setPatientList(res.data))
      .catch(console.log);

   },[UrlLink,searchQuery,searchPurpose])
    
  

  return (
    <>
    <div className="Main_container_app">
    <h3>Total Patient Report  List</h3>
    <div className="RegisFormcon_1" style={{marginTop:'10px'}}>
    <div className="RegisFormcon_1">
             <div className="RegisForm_1">
                <label> Search Here <span>:</span> </label>
                <input
                type="text"
                placeholder='Enter PatientId, PatientName'
                value={searchQuery}
                onChange={handleChange}
                />
            </div>

            <div className="RegisForm_1">
                <label> VisitPurpose <span>:</span> </label>
                <select 
                    value={searchPurpose} 
                    onChange={handlevisitChange}
                >
                    <option value="">select</option>
                    <option value="NewConsultation">New Consultaion</option>
                    <option value="FollowUp">Follow up </option>
                    <option value="WALK-IN">WALK-IN </option>
                </select>
            </div>
            </div>
      
    
            <div className='RegisFormcon_1 jjxjx_'>
            <ReactGrid columns={PatientListColumns} RowData={PatientList} /> 
          
          </div>
          
    </div>
   </div>
    </>
  )
}

export default TotalPatientReportList;
