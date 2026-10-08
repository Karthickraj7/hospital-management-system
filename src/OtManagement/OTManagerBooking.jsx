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

import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import OTGoogleStyleCalendar from './OTCalendar/OTGoogleStyleCalendar';

function OTManagerBooking() {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
    const toast = useSelector((state) => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
    const location = useLocation();
    const { params } = location.state || {};

    console.log('Received params:', params);

  const navigate = useNavigate();
  const [patientsearch, setpatientsearch] = useState({
      Search: '',
    });
  const [formData, setFormData] = useState({
    reqDate:  new Date().toISOString().split("T")[0],
    reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    bookingType: "",
    specialization: "",
    surgeryName: "",
    OTName: "",
    doctorName: "",
    bookingDate: "",
    bookingTime: "",
    duration: "",
    operationType: "",
    priority: "",
    patientId: "",
    patientName: "",
    age: "",
    gender: "",
    uhidNo: "",
    Status:"Requested",
    Booking_Id : '',
    Statusedit : '',
    Reason : '',
    registrationid : '',
  });


  useEffect(() => {

    
  if(params){

    console.log(params);

    setFormData((prev)=>({

      ...prev,
      reqDate:  new Date().toISOString().split("T")[0],
      reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      bookingType: params?.BookingType,
      specialization: params?.Specializationid,
      surgeryName: params?.Surgeryid,
      OTName: params?.Theatreid,
      doctorName: params?.DoctorID,
      bookingDate: params?.BookingDate,
      bookingTime: params?.BookingTime,
      duration: params?.Duration,
      operationType: params?.OperationType,
      priority: params?.Priority,
      patientId: params?.PatientId,
      patientName: params?.PatientName,
      age: params?.Age,
      gender: params?.Gender,
      uhidNo: params?.UHIDNO,
      Status: params?.Status === "Admitted" ? "Requested" : params?.Status,
      Reason : params?.Reason,
      Booking_Id : params?.Booking_Id,
      emgregistrationid : params?.RegistrationId

      }));

  }


   
}, [params]);


  const [specialityData,setSpecilitydata] = useState([]);
  const [SurgeryData,setSurgeryData] = useState([]);
  const [TheatreData,setTheatreData] = useState([]);
  const [DoctorData,setDoctorData] = useState([]);
  const [Patientiddata,setPatientiddata] = useState([]);
  const [Theatrerequestdata,setTheatrerequestdata] = useState([]);
  const [load,setLoad] = useState(false);

   const [modalContent, setModalContent] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const [openModal3, setOpenModal3] = useState(false);
  

    const openModal1 = (content) => {
      setModalContent(content);
      setModalIsOpen(true);
      setOpenModal3(true);
    };


  // setFormData({

  //   reqDate:  new Date().toISOString().split("T")[0],
  //   reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  //   bookingType: "OP",
  //   specialization: "",
  //   surgeryName: "",
  //   OTName: "",
  //   doctorName: "",
  //   bookingDate: "",
  //   bookingTime: "",
  //   duration: "",
  //   operationType: "",
  //   priority: "",
  //   patientId: "",
  //   patientName: "",
  //   age: "",
  //   gender: "",
  //   uhidNo: "",
  //   Status:"Pending",
  //   id:''




  // });

  useEffect(() => {
    axios
      .get(`${UrlLink}Frontoffice/Patients_Management_Filter`)
      .then((res) => {
        setPatientiddata(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);


  

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
        .then((res) => setSpecilitydata(res.data))
        .catch((err) => console.log(err));
}, [UrlLink]);

useEffect(() => {
  axios.get(`${UrlLink}Masters/Surgeryname_Speciality_link?Speciality=${formData.specialization}`)
      .then((res) => setSurgeryData(res.data))
      .catch((err) => console.log(err));
}, [formData.specialization]);

useEffect(() => {
  axios.get(`${UrlLink}OT/Theatrename_all`)
      .then((res) => setTheatreData(res.data))
      .catch((err) => console.log(err));
}, [formData.specialization]);

useEffect(() => {
  axios.get(`${UrlLink}Masters/get_Doctor_Detials_link`)
      .then((res) => setDoctorData(res.data))
      .catch((err) => console.log(err));
}, [UrlLink]);

useEffect(() => {
  axios.get(`${UrlLink}OT/Theatre_booking_request_Outside_details`)
      .then((res) => setTheatrerequestdata(res.data))
      .catch((err) => console.log(err));
}, [UrlLink,load]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if(name == 'patientId'){

      setpatientsearch(
        {
          Search : value,
        }
        
      );

    }
    setFormData({ ...formData, [name]: value });
  };

  const handleEditOtMaster = (row) => {

    setFormData((prev)=>({

    ...prev,
    reqDate:  new Date().toISOString().split("T")[0],
    reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    id:row?.id,
    bookingType: row?.BookingType,
    specialization: row?.Specializationid,
    surgeryName: row?.Surgeryid,
    OTName: row?.Theatreid,
    doctorName: row?.DoctorID,
    bookingDate: row?.BookingDate,
    bookingTime: row?.BookingTime,
    duration: row?.Duration,
    operationType: row?.OperationType,
    priority: row?.Priority,
    patientId: row?.patientId,
    patientName: row?.PatientName,
    age: row?.Age,
    gender: row?.Gender,
    uhidNo: row?.UHIDNO,
    Status:"Requested"


    }));

  }


  const BookingColumns = [


    {key:"Sno",name:"S.NO",frozen: true},
    {key:"ReqDate",name:"Requested_Date"},
    {key:"ReqTime",name:"Requested_Time"},
    {key:"BookingType",name:"Booking_Type"},
    {key:"bookingdate",name:"Booking_Date"},
    {key:"BookingTime",name:"Booking_Time"},
    {key:"PatientName",name:"Patient_Name"},
    {key:"Status",name:"Status"},

    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
          <Button onClick={() => handleEditOtMaster(params.row)}>
              <EditIcon />
          </Button>
      ),
  }

  ];

  const HandlesearchPatient = (value) => {

    console.log(value);
    // const exist = FilterbyPatientId.find((f) => f.PatientId === value);
    // if (!exist) {
    //   const tdata = {
    //     message: "Please enter a valid Patient Id",
    //     type: "warn",
    //   };
    //   dispatchvalue({ type: "toast", value: tdata });
    // } else {

      axios
        .get(
          `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${value}`
        )
        .then((res) => {
          const resss = res.data;

          console.log("paaatttttttttt", res.data);

          if (resss.warn) {
            const tdata = {
              message: resss.warn,
              type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
            return;
          }

          console.log("Patient details:", resss);


         setFormData((prev)=>({
            ...prev,
              patientId: resss?.PatientId,
              patientName: `${resss?.FirstName}${resss?.MiddleName}${resss?.SurName}`,
              age: resss?.Age,
              gender: resss?.Gender,
              uhidNo: resss?.UHIDNo,
           
          }))
         })
        .catch((err) => console.log(err));
     };
  






  const handleSubmit = async () => {
    
    const data = {
      ...formData,
      created_by: userRecord?.username || ''
  };

  console.log(data,'data');
  
  axios.post(`${UrlLink}OT/Theatre_booking_request_details`, data)
  .then((res) => {

    const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                console.log(messageType);
                console.log(messageContent);
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });

    setFormData({
    reqDate:  new Date().toISOString().split("T")[0],
    reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    bookingType: "",
    specialization: "",
    surgeryName: "",
    OTName: "",
    doctorName: "",
    bookingDate: "",
    bookingTime: "",
    duration: "",
    operationType: "",
    priority: "",
    patientId: "",
    patientName: "",
    age: "",
    gender: "",
    uhidNo: "",
    id:''
    });
    setLoad((prev)=>!prev);
  })
  .catch((err) => console.log(err));

    // const OtQuelist = JSON.parse(localStorage.getItem("OtQuelist")) || [];
    // OtQuelist.push(formData);
    // localStorage.setItem("OtQuelist", JSON.stringify(OtQuelist));

    navigate("/Home/OTManagement");
    dispatchvalue({ type: "HrFolder", value: "OtQuelist"});
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };
  return (
    <div className="Main_container_app">
      <h4>
        OT Theater Booking
        <div style={{ float: 'right' }}>
          OT Available
          <FontAwesomeIcon icon={faCalendarDays} onClick={() => openModal1("calendar")} className="cal_icon" />
        </div>
      </h4>
      <br />
      <div className="RegisFormcon_1">

      <div className="RegisForm_1">
                    <label>
                    patientId <span>:</span>
                    </label>
                    <div className="Search_patient_icons">
                    <input
                     
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        list="PatientidList"

                    />

                    <datalist id="PatientidList">
                        {Array.isArray(Patientiddata) &&
                            Patientiddata.map((f, i) => (
                                <option key={i} value={f.PatientId}>{`${f.PhoneNo} | ${f.FirstName} `}</option>
                                
                            ))}
                    </datalist>
                    {patientsearch.Search && (
                      <span
                        onClick={() => HandlesearchPatient(patientsearch.Search)}
                      >
                        <PersonSearchIcon />
                      </span>
                    )}
                    </div>
      </div>        


      <div className="RegisForm_1">
                    <label>ReqDate<span>:</span></label>
                    <input
                        type="date"
                        name="reqDate"
                        
                        value={formData.reqDate}
                        onChange={handleChange}
                        required
                    />
      </div>
   
      <div className="RegisForm_1">
                    <label>ReqTime<span>:</span></label>
                    <input
                        type="time"
                        name="reqTime"
                        
                        value={formData.reqTime}
                        onChange={handleChange}
                        required
                    />
      </div>


      <div className="RegisForm_1">
                  <label>Booking Type<span>:</span></label>
                    <select name='bookingType' value={formData.bookingType} onChange={handleChange}> 

                    <option value="">select</option>
                    <option value="OP">OP</option>
                    <option value="IP">IP</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                   </select>
      </div>


      <div className="RegisForm_1">
                    <label>Specialization<span>:</span></label>
                    <select name="specialization" value={formData.specialization} onChange={handleChange} required>
                        <option value="">Select</option>
                        {Array.isArray(specialityData) && specialityData.map((block, index) => (
                            <option key={index} value={block.Speciality_Id}>{block.SpecialityName}</option>
                        ))}
                    </select>
      </div>

      <div className="RegisForm_1">
                    <label>surgery Name<span>:</span></label>
                    <select name="surgeryName" value={formData.surgeryName} onChange={handleChange} required>
                        <option value="">Select</option>
                        {Array.isArray(SurgeryData) && SurgeryData.map((block, index) => (
                            <option key={index} value={block.Surgery_Id}>{block.Surgery_Name}</option>
                        ))}
                    </select>
      </div>

      <div className="RegisForm_1">
                    <label>Theatre Name<span>:</span></label>
                    <select name="OTName" value={formData.OTName} onChange={handleChange} required>
                        <option value="">Select</option>
                        {Array.isArray(TheatreData) && TheatreData.map((block, index) => (
                            <option key={index} value={block.id}>{block.Theatrename}</option>
                        ))}
                    </select>
      </div>


                <div className="RegisForm_1">
                    <label>Doctor Name<span>:</span></label>
                    <select name="doctorName" value={formData.doctorName} onChange={handleChange} required>
                        <option value="">Select</option>
                        {Array.isArray(DoctorData) && DoctorData.map((block, index) => (
                            <option key={index} value={block.id}>{block.Name}</option>
                        ))}
                    </select>
                </div>

                <div className="RegisForm_1">
                    <label>Booking Date<span>:</span></label>
                    <input
                        type="date"
                        name="bookingDate"
                        
                        value={formData.bookingDate}
                        onChange={handleChange}
                        required
                    />
      </div>

      <div className="RegisForm_1">
                    <label>Booking Time<span>:</span></label>
                    <input
                        type="time"
                        name="bookingTime"
                        
                        value={formData.bookingTime}
                        onChange={handleChange}
                        required
                    />
      </div>

      <div className="RegisForm_1">
                    <label>Duration<span>:</span></label>
                    <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
      </div>

      

      <div className="RegisForm_1">
                  <label>Operation Type<span>:</span></label>
                    <select name='operationType' value={formData.operationType} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                    <option value="Complex">Complex</option>
                   </select>
      </div>

      <div className="RegisForm_1">
                  <label>priority<span>:</span></label>
                    <select name='priority' value={formData.priority} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                   </select>
      </div>


     

        <div className="RegisForm_1">
                    <label>patientName<span>:</span></label>
                    <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                    />
      </div>

      <div className="RegisForm_1">
                    <label>Age<span>:</span></label>
                    <input
                        type="text"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
      </div>

      

      <div className="RegisForm_1">
                    <label>Gender<span>:</span></label>
                    <select name="gender" onChange={handleChange} value={formData.gender} required>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                    </select>
                </div>

      <div className="RegisForm_1">
                    <label>UHIDNO<span>:</span></label>
                    <input
                        type="text"
                        name="uhidNo"
                        value={formData.uhidNo}
                        onChange={handleChange}
                        required
                    />
      </div>









      </div>

















      {/* <div className="RegisFormcon">
        
        {Object.keys(formData).map((field) => (
          <div className="RegisForm_1" key={field}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <span>:</span>
            </label>
            {field === 'gender' || field === 'bookingType' || field === 'priority' || field === 'operationType' ? (
              <select name={field} value={formData[field]} onChange={handleChange}>
                <option value="">Select</option>
                {field === 'gender' && (
                  <>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </>
                )}
                {field === 'bookingType' && (
                  <>
                    <option value="IP">IP</option>
                    <option value="OP">OP</option>
                    <option value="DayCare">Day Care</option>
                    <option value="Emergency">Emergency</option>
                    <option value="OutSide">OutSide</option>
                  </>
                )}
                {field === 'priority' && (
                  <>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </>
                )}
                {field === 'operationType' && (
                  <>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                    <option value="Complex">Complex</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type={
                  field.includes('Date')
                    ? 'date'
                    : field.includes('Time')
                      ? 'time'
                      : field === 'duration' || field === 'age' || field === 'patientId'
                        ? 'number'
                        : 'text'
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
      </div> */}
      <br />
      <div className="Main_container_Btn">
        <button onClick={handleSubmit}>
        {formData.id ? 'Update' : 'Save'}
        
        </button>

        
      </div>
      {/* <ReactGrid columns={BookingColumns} RowData={Theatrerequestdata} /> */}
      {openModal3 && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal3(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <OTGoogleStyleCalendar />
          </div>
        </div>
      )}


      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  )
}

export default OTManagerBooking
