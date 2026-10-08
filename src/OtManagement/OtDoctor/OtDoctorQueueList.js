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

function OtDoctorQueueList() {


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

    // { key: "Booking_Id", headerName: "Booking Id", width: 100 },
    { key: "PatientName", headerName: "Patient_Name", width: 100,
  //     renderCell: (params) => {
  //     let bgColor;
  //     if (params.row.Status === "Requested") {
  //         bgColor = "#e3ff7e"; // Background color for Inprogress
  //     }  else if (params.row.Status === "Canceled") {
  //         bgColor = "#f55e5e";
  //     }
  //     else if (params.row.Status === "Reschedule") {
  //         bgColor = "#c794dffd";
  //     }
  //     else if (params.row.Status === "Completed") {
  //         bgColor = "#88e76cfd";
  //     }
  //     else {
  //         bgColor = "transparent"; // Default background color
  //     }

  //     return (
  //         <div
  //             style={{
  //                 backgroundColor: bgColor,
  //                 width: "100%",
  //                 height: "100%",
  //                 display: "flex",
  //                 alignItems: "center",
  //                 justifyContent: "center",
  //                 color: "black", // Adjust text color for visibility
  //                 padding: "4px",
  //                 borderRadius: "4px",
  //                 fontWeight: "bold"
  //             }}
  //         >
  //             {params.row.PatientName}
  //         </div>
  //     );
  // }
    }, 
    { key: "SurgeryName", headerName: "Surgery Name", width: 130 },
    //{ key: "Surgeon_Name", headerName: "Surgeon Name", width: 130 },
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
    // {
    //   field: "Status",
    //   headerName: "Status",

    //   // renderCell: (params) => (
    //   //   <>
    //   //     <div className="actionv">
    //   //       <Button
    //   //         className="cell_btn"
    //   //         title="Pending"
    //   //         onClick={() => handleColorChange(params.row.id, "Pending")}
    //   //       >
    //   //         <PendingIcon />
    //   //       </Button>
    //   //       <Button
    //   //         className="cell_btn"
    //   //         title="Confirm"
    //   //         onClick={() => handleClickConfirm(params.row, "Confirm")}
    //   //       >
    //   //         <CheckCircleIcon />
    //   //       </Button>
    //   //     </div>
    //   //   </>
    //   // ),
    // },
    // {
    //   field: "Action",
    //   headerName: "Action",

    //   // renderCell: (params) => (
    //   //   <div className="actionv">
    //   //     <Button
    //   //       className="cell_btn"
    //   //       title="Cancel"
    //   //       onClick={() => handleIconCancelClick(params.row.id, "Cancel")}
    //   //     >
    //   //       <CancelIcon className="check_box_clrr_cancell" />
    //   //     </Button>
    //   //     <Button
    //   //       className="cell_btn"
    //   //       title="Reshedule"
    //   //       onClick={() => handleRescheduleClick(params.row, "Reshedule")}
    //   //     >
    //   //       <UpdateIcon className="check_box_clrr_cancell" />
    //   //     </Button>

    //   //     <Dialog open={openDialog} onClose={handleCloseDialog}>
    //   //       <DialogTitle>Cancel Request</DialogTitle>
    //   //       <DialogContent>
    //   //       <TextField 
    //   //         name = 'Reason'
    //   //         style={{ width: "500px", height: "80px" }}
    //   //         multiline
    //   //         row={25}
    //   //         onChange={(e) => setCancelReason(e.target.value)}
    //   //          />
    //   //       </DialogContent>
    //   //       <DialogActions>
    //   //         <Button onClick={handleCloseDialog} color="primary">
    //   //           Close
    //   //         </Button>
    //   //         <Button onClick={handleSaveCancelText} color="primary">
    //   //           Save
    //   //         </Button>
    //   //       </DialogActions>
    //   //     </Dialog>
    //   //   </div>
    //   // ),
    // },
  ];

  const Doctornotes = [
    { key: "Sno", headerName: "S.no", width: 100 },

    // { key: "Booking_Id", headerName: "Booking Id", width: 100 },
    { key: "PatientName", headerName: "Patient_Name", width: 100,
 
    }, 
    { key: "SurgeryName", headerName: "Surgery Name", width: 130 },
    //{ key: "Surgeon_Name", headerName: "Surgeon Name", width: 130 },
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
        <Button onClick={() => handleOtDoctornotes(params.row)}>
          <ArrowForwardIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
    // {
    //   field: "Status",
    //   headerName: "Status",

    //   // renderCell: (params) => (
    //   //   <>
    //   //     <div className="actionv">
    //   //       <Button
    //   //         className="cell_btn"
    //   //         title="Pending"
    //   //         onClick={() => handleColorChange(params.row.id, "Pending")}
    //   //       >
    //   //         <PendingIcon />
    //   //       </Button>
    //   //       <Button
    //   //         className="cell_btn"
    //   //         title="Confirm"
    //   //         onClick={() => handleClickConfirm(params.row, "Confirm")}
    //   //       >
    //   //         <CheckCircleIcon />
    //   //       </Button>
    //   //     </div>
    //   //   </>
    //   // ),
    // },
    // {
    //   field: "Action",
    //   headerName: "Action",

    //   // renderCell: (params) => (
    //   //   <div className="actionv">
    //   //     <Button
    //   //       className="cell_btn"
    //   //       title="Cancel"
    //   //       onClick={() => handleIconCancelClick(params.row.id, "Cancel")}
    //   //     >
    //   //       <CancelIcon className="check_box_clrr_cancell" />
    //   //     </Button>
    //   //     <Button
    //   //       className="cell_btn"
    //   //       title="Reshedule"
    //   //       onClick={() => handleRescheduleClick(params.row, "Reshedule")}
    //   //     >
    //   //       <UpdateIcon className="check_box_clrr_cancell" />
    //   //     </Button>

    //   //     <Dialog open={openDialog} onClose={handleCloseDialog}>
    //   //       <DialogTitle>Cancel Request</DialogTitle>
    //   //       <DialogContent>
    //   //       <TextField 
    //   //         name = 'Reason'
    //   //         style={{ width: "500px", height: "80px" }}
    //   //         multiline
    //   //         row={25}
    //   //         onChange={(e) => setCancelReason(e.target.value)}
    //   //          />
    //   //       </DialogContent>
    //   //       <DialogActions>
    //   //         <Button onClick={handleCloseDialog} color="primary">
    //   //           Close
    //   //         </Button>
    //   //         <Button onClick={handleSaveCancelText} color="primary">
    //   //           Save
    //   //         </Button>
    //   //       </DialogActions>
    //   //     </Dialog>
    //   //   </div>
    //   // ),
    // },
  ];




  const handleOtPatient = (params) => {

    console.log(params);

    // if(params.Status == 'Completed'){
    //   navigate('/OTCharges', { state: { params } });
    // }
    

    dispatchvalue({ type: 'OTPatientdata', value: params })

    navigate("/Home/OTManagement");
    dispatchvalue({ type: "HrFolder", value: "CrewDetails" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  //   const data = {
  //     ...params,
  //     Status : 'Completed'
  //   };

  // console.log('params',data)

  //   axios.post(`${UrlLink}Masters/OTCalendar_Booking_Status`, data)
  //   .then((res) => {
  //         console.log(res); 
  //   })
  //   .catch((err) => console.log(err));

};


const handleOtDoctornotes = (params) => {

  console.log(params);

  dispatchvalue({ type: 'OTPatientdata', value: params })

  navigate("/Home/OTManagement");
  dispatchvalue({ type: "HrFolder", value: "OtDoctorNavigation" });
  dispatchvalue({ type: "setPreviousFolder", value: null });
  dispatchvalue({ type: "showMenu", value: true });

};

//   const filteredData1 = userRecord.Patient_id
//   ? PatientData.filter((row) => row.id === userRecord.Patient_id)
//   : PatientData;

useEffect(() => {
  axios
    .get(`${UrlLink}OT/OTConfirmedpatient_details?status=${searchIPParams.status}&Doctorid=${userRecord?.Doctor}`)
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

// const handleSearchChange = (event) => {
//     const { id, value } = event.target;

//     if (id === "FirstName") {
//       setSearchQuery(value);
//     } else if (id === "PhoneNo") {
//       setSearchQuery1(value);
//     }
//   };

//   useEffect(() => {
//     console.log(PatientData);

//     const filteredData = PatientData.filter((row) => {
//       const lowerCaseSupplierName = row.firstName.toLowerCase();
//       const lowerCasePhoneNo = row.phone.toString();
//       const lowerCaseQuery = searchQuery.toLowerCase();
//       const lowerCaseQuery1 = searchQuery1.toLowerCase();


//       const matchesFirstName = lowerCaseSupplierName.includes(lowerCaseQuery);

   
//       const matchesPhoneNo = lowerCasePhoneNo.includes(lowerCaseQuery1);

//       return (
//         (matchesFirstName || !searchQuery) && (matchesPhoneNo || !searchQuery1)
//       );
//     });

//     setFilteredRows(filteredData);
//     setPage(0); 
//   }, [searchQuery, searchQuery1, PatientData]);

  return (
    <div className="appointment">
      <div className="h_head">   
        <h4>OT Doctor Oueue List</h4>
      </div>

      <div className="con_1 ">
                {/* <div className="chart_body_1_main_1_container"> */}
                <div className="chart_body_1_child_1 dww3" onClick={() => {setIsSelected('CREWCONFIRMATION')}}>
                    <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                        <Diversity1Icon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[0]?.todaypatients ?? "0"}</h3> */}
                        {/* <h3>20</h3> */}

                        {/* <h2>{todayCount}</h2> */}

                        </div>
                        <div className="chart_body_1_child_1_body_name">
                        CREW CONFIRMATION
                        </div>
                    </div>
                </div>
                
                <div className="chart_body_1_child_1 dww3" onClick={() => {setIsSelected('DOCTORNOTES')}}>
                    <div className="chart_body_1_child_1_body">
                        <div className="chart_body_1_child_1_body_icon">
                        <Diversity1Icon />
                        </div>
                        <div className="chart_body_1_child_1_body_count">
                        {/* <h3>{patientscount[1]?.monthpatients ?? "0"}</h3> */}
                        {/* <h3>30</h3> */}

                        {/* <h2>{monthlyCount}</h2> */}
                        </div>
                        <div className="chart_body_1_child_1_body_name">
                        DOCTOR NOTES
                        </div>
                    </div>
                </div>
                {/* </div> */}         
      </div>

      { isSelected === 'CREWCONFIRMATION' ?  (
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
                            <ReactGrid columns={coloumnss} RowData={Theatrerequestdata} />
                    </div>
                </>
            ) :
            
            isSelected  === 'DOCTORNOTES' ? (
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
              
          ) : null }


    </div>
  );
}

export default OtDoctorQueueList;






