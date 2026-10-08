import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import axios from "axios";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const Opfollowup = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [Filterdata, setFilterdata] = useState([]);
  const [SearchQuery, setSearchQuery] = useState("");
  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    status: "Request",
  });

  const [open, setOpen] = useState(false); // Modal state
  const [selectedRow, setSelectedRow] = useState(null); // Selected row data
  const [status, setStatus] = useState(""); // Status dropdown value
  const [reason, setReason] = useState(""); // Reason input value
  const [reload,setreload] = useState('');
  const [searchDept,setSearchDept] = useState('');
  
  const [searchDate,setSearchDate] = useState('');
 
  const handleStatusToggle = (row) => {
    setSelectedRow(row);
    setStatus(""); // Reset status
    setReason(""); // Reset reason
    setOpen(true);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
};
const handleDateChange = (e) => {
    setSearchDate(e.target.value);
  };

const handleSearchChangeStatus = (e) => {
    const { name, value } = e.target

    setsearchOPParams({ ...searchOPParams, [name]: value });

};

useEffect(()=>{

    const params = SearchQuery.trim()
      ? { search: SearchQuery }
      : { limit: 10 };

    params.date = searchDate;

       axios.get(`${UrlLink}Workbench/get_OPD_General_Advice_FollowUp_by_filter`,{ params })
       .then((res) => setFilterdata(res.data))
      .catch(console.log);

   },[SearchQuery,searchDate,reload])



  const handleClose = () => {
    setOpen(false);
  };
  const handleeditOPFollowupRegister = (params) => {
            
            navigate('/Home/AppointmentRequestList', { state: params });
        };
        

  const handleSubmit = () => {
    if (status === "Not Confirmed" && reason.trim() === "") {
      alert("Please provide a reason for not confirming.");
      return;
    }

    const payload = {
      status: status === "Confirm" ? "confirm" : "pending",
      reason: status === "Not Confirmed" ? reason : null,
    };
    if(selectedRow.Department=='OP'){
        console.log(selectedRow.Department);
    axios
      .post(
        `${UrlLink}Workbench/get_OPD_General_Advice_FollowUp?id=${selectedRow.registerid}&status=${payload.status}&reviewid=${selectedRow.reviewid}&reason=${payload.reason}`,
        payload
      )
      .then((res) => {
        console.log(res);
        console.log(payload);
        setreload('reload');
        setOpen(false);
      })
      .catch((err) => console.log(err));
  }
  else if(selectedRow.Department=='IP'){
    console.log(selectedRow.Department);
    axios
    .post(
      `${UrlLink}Workbench/get_IP_General_Advice_FollowUp?id=${selectedRow.registerid}&status=${payload.status}&reviewid=${selectedRow.reviewid}&reason=${payload.reason}`,
      payload
    )
    .then((res) => {
      console.log(res);
      console.log(payload);
      setreload('reload');
      setOpen(false);
    })
    .catch((err) => console.log(err));
}

  };

  const PatientOPRegisterColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },
    {
      key: "patientid",
      name: "Patient Id",
    },
    {
      key: "patient_name",
      name: "Patient Name",
      width: 250,
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
      width: 160,
    },
    {
      key: "Email",
      name: "Email",
      width: 160,
    },
    {
      key: "Doctorname",
      name: "Doctor Name",
      width: 120,
    },
    {
      key: "Followup_Date",
      name: "Followup Date",
      width: 120,
    },
    {
        key: "Department",
        name: "Department",
        width: 120,
      },
    {
        key: "reason",
        name: "Reason",
        width: 120,
      },
    {
      key: "status",
      name: "Status",
      width: 120,
      renderCell: (params) => (
        <Button
          className="status-btn"
          onClick={() => handleStatusToggle(params.row)}
        >
          {params.row.status === "pending" ? "Pending" : "Confirm"}
        </Button>
      ),
    },
    {
                    key: "Action",
                    name: "Action",
                    width: 110,
                    renderCell: (params) => (
                        <Button
                            className="cell_btn"
                            onClick={() => handleeditOPFollowupRegister(params?.row)}
                        >
                            <ArrowForwardIcon className="check_box_clrr_cancell" />
                        </Button>
                    ),
                },
  ];

  return (
    <div className="Main_container_app">
      <h3>FOLLOWUP</h3>
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
                <label htmlFor="">Date
                    <span>:</span>
                </label>
                <input type="date"
                value={searchDate} 
                onChange={handleDateChange}></input>
            </div>
        </div>
      <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata} />
      {/* Custom Popup */}
      {open && (
        <div className="custom-popup">
          <div className="popup-container">
            <h3>Update Status</h3>
            <div className="popup-content">
              <div className="popup-field">
                <label>Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="popup-select"
                >
                  <option value="">Select</option>
                  <option value="Confirm">Confirm</option>
                  <option value="Not Confirmed">Not Confirmed</option>
                </select>
              </div>
              {status === "Not Confirmed" && (
                <div className="popup-field">
                  <label>Reason:</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="popup-textarea"
                    placeholder="Provide reason for not confirming"
                  ></textarea>
                </div>
              )}
            </div>
            <div className="popup-actions">
              <button onClick={handleClose} className="popup-button cancel">
                Cancel
              </button>
              <button onClick={handleSubmit} className="popup-button confirm">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opfollowup;



