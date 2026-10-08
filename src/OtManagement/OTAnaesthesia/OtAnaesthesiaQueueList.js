import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch ,useSelector} from "react-redux";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: "Center",
        },
        root: {
          "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer":
            {
              textAlign: "center",
              display: "flex !important",
              justifyContent: "center !important",
            },
          "& .MuiDataGrid-window": {
            overflow: "hidden !important",
          },
        },
        cell: {
          borderTop: "0px !important",
          borderBottom: "1px solid  var(--ProjectColor) !important",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

function OtAnaesthesiaQueueList() {

  const location = useLocation();
  const { params } = location.state || {};
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const toast = useSelector((state) => state.userRecord?.toast);
    const isSidebarOpen = useSelector((state) => state.userRecord?.SidebarToggle);

    const [Theatrerequestdata, setTheatrerequestdata] = useState([]);
    const [load,setload] = useState(false);
     const [SelectedWard, setSelectedWard] = useState('');

    const [searchIPParams, setsearchIPParams] = useState({
            query: '',
            status: 'Confirmed',       
            // SelectedWard : SelectedWard
        });

      // console.log(userRecord?.Doctor,'userrrrrrrrr');
      // console.log(userRecord,'userrrrrrrrr');
      // console.log(Theatrerequestdata,'userrrrrrrrr');

      const [isSelected, setIsSelected] = useState("OP");

        const handleOTSearchChange = (e) => {
          const { name, value } = e.target;
          console.log(name,value);

          setsearchIPParams({
            status : value,
          })
  
          
      };

      const handleotbookingrequest = (params) => {

        navigate('OTManageFolder/OT_Doctor', { state: { params }  });


      };
  
  
  const coloumnss = [
    { key: "Sno", headerName: "S.no", width: 100 },
    { key: "PatientName", headerName: "Patient_Name", width: 100,}, 
    { key: "SurgeryName", headerName: "Surgery Name", width: 130 },
    { key: "ReqDate", headerName: "Requested Date", width: 140 },
    { key: "ReqTime", headerName: "Requested Time", width: 140 },
    { key: "DoctorName", headerName: "Physician Name", width: 140 },
    { key: "bookingdate", headerName: "Booking Date", width: 150 },
    { key: "BookingTime", headerName: "Booking Time", width: 150 },
    { key: "BookingType", headerName: "Booking Type", width: 150 },
    { key: "Status", headerName: "Status", width: 150 },
    { key: "OperationType", headerName: "OperationType", width: 150 },
    { key: "Priority", headerName: "Priority", width: 150 },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={() => handleOtPatient(params.row)}>
          <ArrowForwardIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
    
  ];

  const Doctornotes = [
    { key: "Sno", headerName: "S.no", width: 100 },
    { key: "PatientName", headerName: "Patient_Name", width: 100, }, 
    { key: "SurgeryName", headerName: "Surgery Name", width: 130 },
    { key: "ReqDate", headerName: "Requested Date", width: 140 },
    { key: "ReqTime", headerName: "Requested Time", width: 140 },
    { key: "DoctorName", headerName: "Physician Name", width: 140 },
    { key: "bookingdate", headerName: "Booking Date", width: 150 },
    { key: "BookingTime", headerName: "Booking Time", width: 150 },
    { key: "BookingType", headerName: "Booking Type", width: 150 },
    { key: "Status", headerName: "Status", width: 150 },
    { key: "OperationType", headerName: "OperationType", width: 150 },
    { key: "Priority", headerName: "Priority", width: 150 },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={() => handleOtAnaesthenotes(params.row)}>
          <ArrowForwardIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
   
  ];

  const handleOtPatient = (params) => {

    dispatchvalue({ type: 'OTPatientdata', value: params })

    navigate("/Home/OTManagement");
    dispatchvalue({ type: "HrFolder", value: "CrewDetails" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  
};


const handleOtAnaesthenotes = (params) => {

  dispatchvalue({ type: 'OTPatientdata', value: params })

  navigate("/Home/OTManagement");
  dispatchvalue({ type: "HrFolder", value: "OT_Anaesthesia" });
  dispatchvalue({ type: "setPreviousFolder", value: null });
  dispatchvalue({ type: "showMenu", value: true });

};


useEffect(() => {
  axios
    .get(`${UrlLink}OT/OTConfirmedpatient_details_for_OtAnaesthesia?status=${searchIPParams.status}&Doctorid=${userRecord?.Doctor}`)
    .then((res) => setTheatrerequestdata(res.data))
    .catch((err) => console.log(err));
}, [UrlLink,load,searchIPParams.status]);

const [searchQuery, setSearchQuery] = useState("");
const [searchQuery1, setSearchQuery1] = useState("");
const [filteredRows, setFilteredRows] = useState([]);
const [page, setPage] = useState(0);

const pageSize = 10;
const showdown = filteredRows.length;
const totalPages = Math.ceil(filteredRows.length / 10);

const handlePageChange = (params) => {
  setPage(params.page);
};




  return (
    <div className="appointment">
      <div className="h_head">   
        <h4>OT Anaesthesia Oueue List</h4>
      </div>

      <div className="con_1 ">

      <>
                     <div className="search_div_bar">
                    <div className=" search_div_bar_inp_1">
                        <label htmlFor="">Search by
                            <span>:</span>
                        </label>
                        <input
                            type="text"
                            name='query'
                            value={searchIPParams.query}
                            placeholder='Search here ... '
                            onChange={handleOTSearchChange}
                        />
                    </div>
                    <div className="search_div_bar_inp_1">
                        <label htmlFor="">Status
                            <span>:</span>
                        </label>
                        <select
                            id=''
                            name='status'
                            value={searchIPParams.status}
                            onChange={handleOTSearchChange}
                        >   
                            <option value=''>Select</option>
                            <option value='Confirmed'>Confirmed</option>
                            <option value='Completed'>Completed</option>
                            
                        </select>
                    </div>

                     </div>
                    <div className='RegisFormcon_1 jjxjx_'>
                            <ReactGrid columns={Doctornotes} RowData={Theatrerequestdata} />
                    </div>
      </>







      </div>

      


    </div>
  );
}

export default OtAnaesthesiaQueueList





