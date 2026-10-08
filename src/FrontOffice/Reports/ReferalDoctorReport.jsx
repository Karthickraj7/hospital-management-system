import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';


const ReferalDoctorReport = () => {


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [DoctorList,setDoctorList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDept,setSearchDept] = useState('');

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
      };

    const handleDeptChange = (e) => {
        setSearchDept(e.target.value);
      };

      


    const DoctorListColumns = [
        {
            key: "id",
            name: "S.No",
            frozen: true
        },
        {
            key: "DoctorName",
            name: "Doctor Name",
            frozen: true
        },
        {
            key: "PhoneNo",
            name: "Phone No",
            frozen: true
        },
        {
            key: "RouteName",
            name: "Route Name",
            frozen: true
        },
        // {
        //     key: "TahsilName",
        //     name: "Tahsil Name",
        //     frozen: true
        // },
        // {
        //     key: "VillageName",
        //     name: "Village Name",
        //     frozen: true
        // }
    ]
   useEffect(()=>{

    const params = searchQuery.trim()
      ? { search: searchQuery }
      : { limit: 10 };

    params.dept = searchDept;

    console.log(searchDept,"kkkk");
    console.log(searchQuery,"llll");





       axios.get(`${UrlLink}Frontoffice/get_referal_doctor_report_details`,{ params })
      .then((res) => setDoctorList(res.data))
      .catch(console.log);

   },[UrlLink,searchQuery,searchDept])
    
  

  return (
    <>
    <div className="Main_container_app">
    <h3>Referal Doctor List</h3>
    <div className="RegisFormcon_1" style={{marginTop:'10px'}}>
    <div className="RegisFormcon_1">
            <div className="RegisForm_1">
                <label> Search Here <span>:</span> </label>
                <input
                type="text"
                placeholder='Enter DoctorId, DoctorName, or CasesheetNo'
                value={searchQuery}
                onChange={handleChange}
                />
            </div>

            <div className="RegisForm_1">
                <label> Department <span>:</span> </label>
                <select 
                    value={searchDept} 
                    onChange={handleDeptChange}
                >
                    <option value="">select</option>
                    <option value="1">IP</option>
                    <option value="2">OP</option>
                </select>
            </div>
            </div>
      
    
            <div className='RegisFormcon_1 jjxjx_'>
            <ReactGrid columns={DoctorListColumns} RowData={DoctorList} />
          
          </div>
    </div>
   </div>
    </>
  )
}

export default ReferalDoctorReport
