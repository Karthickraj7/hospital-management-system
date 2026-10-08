import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonIcon from "@mui/icons-material/Person";


const XRayTechnician = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);

      const toast = useSelector((state) => state.userRecord?.toast);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
const [Filterdata, setFilterdata] = useState([]);
const [SearchQuery, setSearchQuery] = useState('');
const [searchOPParams, setsearchOPParams] = useState({ 
    query: '',
    status: 'Paid',
    Employeeid : userRecord?.Employeeid,
        Dept : userRecord?.Emp_DepartmentId,
        User:userRecord?.username || ''

   });

  const [dateOption, setDateOption] = useState('current');
         const [fromDate, setFromDate] = useState('');
         const [toDate, setToDate] = useState('');
         const [ParticularDate, setParticularDate] = useState('');
         const [CurrentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
       
         const [filtercount,setfiltercount] = useState('');
         const [Totalcount,setTotalcount] = useState('');
  
           useEffect(() => {
               if (dateOption === 'current') {
                 setCurrentDate(new Date().toISOString().split('T')[0]); // Auto-set today
               }
             }, [dateOption]);
         
           const handleCurrentDateChange = (e) => {
             setCurrentDate(e.target.value);
           };
         
           const handleFromDateChange = (e) => {
             setFromDate(e.target.value);
           };
         
           const handleToDateChange = (e) => {
             setToDate(e.target.value);
           };
         
           const handleParticularDateChange = (e) => {
             setParticularDate(e.target.value);
           };
         
           const handleDateOptionChange = (e) => {
             setDateOption(e.target.value);
         
             // Reset date states when changing the selection
             if (e.target.value === 'current') {
               setFromDate('');
               setToDate('');
               setParticularDate('');
             } else if (e.target.value === 'custom') {
               setParticularDate('');
               setCurrentDate('');
             } else if (e.target.value === 'particular') {
               setFromDate('');
               setToDate('');
               setCurrentDate('');
             }
              else if (e.target.value === 'all') {
               setFromDate('');
               setToDate('');
               setCurrentDate('');
               setParticularDate('');
             }
           };


const handleSearchChangeStatus = (e) => {
  const { name, value } = e.target

  setsearchOPParams({ ...searchOPParams, [name]: value });

};

useEffect(() => {

     const params = {
    ...searchOPParams,
    dateOption,
    fromDate,
    toDate,
    ParticularDate,
    CurrentDate,
  };

  axios
      .get(`${UrlLink}MCI/Radiology_filterwise_count_original_Deptwise`, { params })
      .then((res) => {
        const ress = res.data;
        console.log("567", ress);
        setTotalcount(ress.totalcount);
        setfiltercount(ress.filtercount);
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(`${UrlLink}OP/Radiology_Queuelist_link`,{ params })
      .then((res) => {
        const ress = res.data;
        console.log("567",ress);
        if (Array.isArray(ress)) {
          setPatientRegisterData(ress);
          setFilterdata(ress);
        } else {
          setPatientRegisterData([]);
          setFilterdata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });




  }, [UrlLink,searchOPParams,CurrentDate,ParticularDate,dateOption,fromDate,toDate]);


useEffect(() => {
  if (SearchQuery !== '') {
    const lowerCaseQuery = SearchQuery.toLowerCase();

    const filteredData = PatientRegisterData.filter((row) => {
      const { PatientId, PhoneNumber, PatientName,Aadhar} = row;
      return (
        (PatientId && PatientId.toLowerCase().includes(lowerCaseQuery)) ||
        (PhoneNumber && PhoneNumber.toLowerCase().includes(lowerCaseQuery)) ||
        (PatientName && PatientName.toLowerCase().includes(lowerCaseQuery)) ||
        (Aadhar && Aadhar)

      );
    });

    setFilterdata(filteredData);
  } else {
    setFilterdata(PatientRegisterData);
  }
}, [SearchQuery, PatientRegisterData]);

const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
};


const handleeditOPPatientRegister = (params) => {
  if(params.Status==="Request"){
    const tdata = {
          message: 'Billing not yet Completed',
          type: 'warn',
      };
      dispatch({ type: 'toast', value: tdata });
  }



else if((params.Status==="Paid" && params.service_Status === "Pending" )|| (params.Status ==="Due" && params.service_Status === "Pending" )){
    dispatch({ type: 'RadiologyWorkbenchNavigation', value: { params } });
    //navigate('/Home/RadiologyRequest');
    navigate('/Home/RadiologyReportEntry');


  }
  else{
    const tdata = {
      message: 'There is No Action.',
      type: 'warn',
  };
  dispatch({ type: 'toast', value: tdata });
}
};


const PatientOPRegisterColumns = [
  {
    key: "id",
    name: "S.No",
  },
  {
    key: "PatientId",
    name: "Patient Id",
  },
  {
    key: "PatientName",
    name: "Patient Name",
    width:280,
  },
  {
    key: "RegisterType",
    name: "Register Type ",
    width: 150,
  },
  {
    key: "Status",
    name: "Billing Status ",
    width: 150,
  },
  {
    key: "PhoneNumber",
    name: "PhoneNo",
    width: 120,
  },
  {
    key: "doctor_name",
    name: "Doctor Name",
    width: 120,
  },
  {
    key: "Action",
    name: "Action",
    width: 110,
    renderCell: (params) => (
      <Button
        className="cell_btn"
        onClick={() => handleeditOPPatientRegister(params?.row)}
      >
        <ArrowForwardIcon className="check_box_clrr_cancell" />
      </Button>
    ),
  },
];

return (
  <div className="Main_container_app">
  <h3>XRAY QueueList</h3>
<div className="con_1 ">
          <div className="chart_body_1_child_1 dww3"  style={{ cursor: "pointer" }}>
                    
            <div className="chart_body_1_child_1_body">
                <div className="chart_body_1_child_1_body_icon">
                <PersonAddAlt1Icon />
                </div>
                <div className="chart_body_1_child_1_body_count">
            
                <h2>{filtercount}</h2>

                </div>
                <div className="chart_body_1_child_1_body_name">
                Counts
                </div>
            </div>
          </div>
                    
          <div className="chart_body_1_child_1 dww3"  style={{ cursor: "pointer" }}>
              <div className="chart_body_1_child_1_body">
                  <div className="chart_body_1_child_1_body_icon">
                  <PersonIcon />
                  </div>
                  <div className="chart_body_1_child_1_body_count">

                  <h2>{Totalcount}</h2>
                  </div>
                  <div className="chart_body_1_child_1_body_name">
                  Total Counts
                  </div>
              </div>
          </div>
    </div>

    <div className="search_div_bar">
      {/* <div className="search_div_bar_inp_1">
        <label>Search by<span>:</span></label>
        <input
          type="text"
          value={SearchQuery}
          placeholder='Patient ID or Name or PhoneNo '
          onChange={handleSearchChange}
        />
      </div> */}

      <div className="search_div_bar_inp_1">
          <label> {" "} Date <span>:</span>{" "} </label>
                      <select value={dateOption} onChange={handleDateOptionChange}
                      >
                        {/* <option value="all">All</option> */}
                        <option value="current">Current Date</option>
                        <option value="custom">Custom Date</option>
                        <option value="particular">Particular Date</option>
                      </select>

                      {dateOption === 'current' && (
                      <div className="search_div_bar_inp_1">
                        <label>
                          {" "}
                          Current Date <span>:</span>{" "}
                        </label>
                        <input
                          type="date"
                          value={CurrentDate}
                          // disabled
                          onChange={handleCurrentDateChange}
                        />
                      </div>
                    )}

                    {dateOption === 'custom' && (
                      <>
                        <div className="search_div_bar_inp_1">
                          <label> {" "}From  <span>:</span> {" "}</label>

                          <input
                            type="date"
                            placeholder="From Date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                          />

                        </div> 
                        <div className="search_div_bar_inp_1">

                          <label> To  <span>:</span> </label>

                          <input
                            type="date"
                            placeholder="To Date"
                            value={toDate}
                            onChange={handleToDateChange}
                          />
                        </div>
                      </>
                    
                    )}

                  
                    <br />
                    {dateOption === 'particular' && (
                      <div className="search_div_bar_inp_1">
                        <label>{" "} Select Date <span>:</span> {" "}</label>
                        <input type="date" value={ParticularDate} onChange={handleParticularDateChange} />
                      </div>
                    )}
      </div>

      
      <div className=" RegisForm_1">
          <label htmlFor="">Status
            <span>:</span>
          </label>
          <select
            id=''
            name='status'
            value={searchOPParams.status}
            onChange={handleSearchChangeStatus}
          >
            <option value=''>Select</option>
            <option value='Request'>Request</option>
            <option value='Paid'>Paid</option>
            <option value='Due'>Due</option>
            <option value='Analyzed'>Analyzed</option>
            <option value='Completed'>Completed</option>
          </select>
      </div>
    </div>
  <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata} />
  <ToastAlert Message={toast.message} Type={toast.type} />

</div>
)
}

export default XRayTechnician
