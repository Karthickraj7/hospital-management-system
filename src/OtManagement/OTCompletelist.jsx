import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import axios from "axios";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { useLocation } from "react-router-dom";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function OTCompletelist() {

        const UrlLink = useSelector(state => state.userRecord?.UrlLink);
        const userRecord = useSelector(state => state.userRecord?.UserData);
        const toast = useSelector((state) => state.userRecord?.toast);
        const dispatchvalue = useDispatch();
        const location = useLocation();
        const navigate = useNavigate();
        const { params } = location.state || {};

        const [OTCompleteddata, setOTCompleteddata] = useState([]);
        const [load,setload] = useState(false);

        useEffect(() => {
          axios
            .get(`${UrlLink}OT/OTCompletepatient_details`)
            .then((res) => setOTCompleteddata(res.data))
            .catch((err) => console.log(err));
        }, [UrlLink,load]);

        const handleotbilling = (params) => {

          // console.log(params);
          // navigate('/OtCharges', { state: { params } });

          dispatchvalue({ type: 'OTPatientdata', value: params })

          navigate("/Home/OTManagement");
          dispatchvalue({ type: "HrFolder", value: "OtCharges" });
          dispatchvalue({ type: "setPreviousFolder", value: null });
          dispatchvalue({ type: "showMenu", value: true });
          
          
          
        };

        const coloumnss = [
          { key: "id", headerName: "Id", width: 100 },
      
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
              <Button onClick={() => handleotbilling(params.row)}>
                <ArrowForwardIcon />
              </Button>
            ),
          },
         
        ];
      

  return (<>
    <div>OTCompletelist</div>

    <div className='RegisFormcon_1 jjxjx_'>
        <ReactGrid columns={coloumnss} RowData={OTCompleteddata} />
    </div>









    </>
  )
}

export default OTCompletelist