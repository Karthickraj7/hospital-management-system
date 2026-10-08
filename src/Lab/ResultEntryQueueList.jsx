import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer"

const ResultEntryQueueList = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const toast = useSelector((state) => state.userRecord?.toast);

  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [Filterdata, setFilterdata] = useState([]);
  const [SearchQuery, setSearchQuery] = useState('');
  const [searchOPParams, setsearchOPParams] = useState({ query: '', status: 'Pending',Billing_Status: "Completed",Service_Status: "Completed" ,queue_type: "resultentry"});
  const [Indivitual,setIndivitual] = useState([]);
  const [selectedrow,setSelectedRow] = useState(false);

  useEffect(() => {
    axios.get(`${UrlLink}OP/get_lab_request_details`, { params: searchOPParams })
      .then((res) => {
      
        const ress = res.data;
        console.log("456", ress);
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
  }, [UrlLink, searchOPParams]);

  useEffect(() => {
    if (SearchQuery !== '') {
      const lowerCaseQuery = SearchQuery.toLowerCase();

      const filteredData = PatientRegisterData.filter((row) => {
        const { PatientId, PhoneNumber, PatientName } = row;
        return (
          (PatientId && PatientId.toLowerCase().includes(lowerCaseQuery)) ||
          (PhoneNumber && PhoneNumber.toLowerCase().includes(lowerCaseQuery)) ||
          (PatientName && PatientName.toLowerCase().includes(lowerCaseQuery))
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

  const handleSearchChangeStatus = (e) => {
    const { name, value } = e.target

    setsearchOPParams({ ...searchOPParams, [name]: value });

  };
  const handleeditOPPatientRegister = (params) => {
    console.log("params56", params);
    if(params.Billing_Status==="Completed"){
      // dispatchvalue({ type: 'LabWorkbenchNavigation', value: { params } });
      // navigate('/Home/LabRequest');

      dispatchvalue({ type: 'ResultEntryNavigationdata', value: params })
      

      navigate('/Home/ResultEntryNavigation')
            dispatchvalue({ type: 'HrFolder', value:'ResultEntryNavigation'});
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });

    }
    else{
      const tdata = {
        message: 'There is No Action.',
        type: 'warn',
    };
    dispatchvalue({ type: 'toast', value: tdata });
    }


  };




  const [testcolumn, settestcolumn] = useState([]);
  
 


  useEffect(() => {
    let TestNameColumns = [
      {
        key: "id",
        name: "S.NO",
        frozen: true,
      },
      {
        key: "TestName",
        name: "Test Name",
         width:"380px"
      },
    ];



    console.log(searchOPParams)

    if (searchOPParams.status === 'Cancelled') {
      TestNameColumns.push({
        key: "Reason",
        name: "Reason",
      });
  

    }

    settestcolumn(TestNameColumns);
 
  }, [searchOPParams]);




  const PatientOPRegisterColumns = [
    {
      key: "id",
      name: "Request ID",
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
    {key:"RegisterType",
    name:"Register Type",
    },
    {
      key: "PhoneNumber",
      name: "PhoneNo",
    },
    {
      key: "DoctorShortName",
      name: "Doctor Name",
    },
    {
      key: "ArrowAction",
      name: "Action",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          key={`arrow-${params.row.id}`} // Key for individual cell
          onClick={() => handleeditOPPatientRegister(params?.row)}
        >
          <ArrowForwardIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];
  






  return (
    <div className="Main_container_app">
      <h3>Lab Queue List</h3>
      <div className="search_div_bar">
        <div className="search_div_bar_inp_1">
          <label>Search by<span>:</span></label>
          <input
            type="text"
            value={SearchQuery}
            placeholder='Patient ID or Name or PhoneNo '
            onChange={handleSearchChange}
          />
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
            <option value='Completed'>Completed</option>
            <option value='Cancelled'>Cancelled</option>
          </select>
        </div>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
      <ModelContainer />
      <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata}  getRowId={(row) => row.id}/>


      {selectedrow && (Indivitual.length > 0) && (
  <div className="loader" onClick={() => setSelectedRow(false)}>
    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
      <br />

      {Indivitual.length > 0 && (
        <div>
         <div className="common_center_tag">
                        <span>TestNames</span>
                    </div>
                    <br></br>
          <div className="Main_container_app">
          <ReactGrid columns={testcolumn} RowData={Indivitual} />
          </div>

        </div>
      )}

    </div>
  </div>
)}


    </div>
  );
};

export default ResultEntryQueueList;
