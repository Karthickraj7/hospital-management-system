import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import axios from "axios";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import OTGoogleStyleCalendar from './OTCalendar/OTGoogleStyleCalendar';

const New_theater_booking = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const toast = useSelector((state) => state.userRecord?.toast);
  const OTPatientdata = useSelector((state) => state.Frontoffice?.OTPatientdata);
  console.log(OTPatientdata,'OTPatientdata')
  const EmgOTPatientdata = useSelector((state) => state.Frontoffice?.EmgOTPatientdata);
  console.log(EmgOTPatientdata,'EmgOTPatientdata')

  
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { params } = location.state || {};

  const [Editoption, setEditoption] = useState(true);
  const [formData, setFormData] = useState({
    reqDate: new Date().toISOString().split("T")[0],
    reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    bookingType: "EMERGENCY",
    specialization: "" || OTPatientdata?.Specializationid,
    surgeryName: "",
    OTName: "" || OTPatientdata?.Theatreid,
    doctorName: "" || OTPatientdata?.DoctorID,
    bookingDate: "" || OTPatientdata?.BookingDate,
    BookingTime: "" || OTPatientdata?.BookingTime,
    duration: "" || OTPatientdata?.Duration,
    operationType: "" || OTPatientdata?.OperationType,
    OperationMode: "" || OTPatientdata?.OperationMode,
    priority: "" || OTPatientdata?.Priority,
    patientId: "" || OTPatientdata?.patientId || EmgOTPatientdata?.PatientId,
    patientName: "" || OTPatientdata?.PatientName || EmgOTPatientdata?.PatientName,
    age: "" || OTPatientdata?.Age,
    gender: "" || OTPatientdata?.Gender || EmgOTPatientdata?.Gender,
    uhidNo: "" || OTPatientdata?.UHIDNO,
    Status: OTPatientdata?.Status || "Requested",
    Booking_Id: '' || OTPatientdata?.Booking_Id,
    RegistrationId: '' || OTPatientdata?.RegistrationId || EmgOTPatientdata?.RegistrationId,
    Reason: '' || OTPatientdata?.Reason
  });

  const [specialityData, setSpecilitydata] = useState([]);
  const [SurgeryData, setSurgeryData] = useState([]);
  const [TheatreData, setTheatreData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [Patientiddata, setPatientiddata] = useState([]);
  const [Theatrerequestdata, setTheatrerequestdata] = useState([]);
  const [load, setLoad] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);

  const openModal1 = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
    setOpenModal3(true);
  };

  useEffect(() => {
    if (params) {
      setFormData((prev) => ({
        ...prev,
        reqDate: new Date().toISOString().split("T")[0],
        reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        bookingType: "EMERGENCY",
        specialization: params?.Specializationid || "",
        surgeryName: params?.Surgeryid || "",
        OTName: params?.Theatreid || "",
        doctorName: params?.DoctorID || "",
        bookingDate: params?.BookingDate || "",
        BookingTime: params?.BookingTime || "",
        duration: params?.Duration || "",
        operationType: params?.OperationType || "",
        OperationMode: params?.Operation_Mode || "",
        priority: params?.Priority || "",
        patientId: params?.PatientId || "",
        patientName: params?.PatientName || "",
        age: params?.Age || "",
        gender: params?.Gender || "",
        uhidNo: params?.UHIDNO || "",
        Status: params?.Status === "Admitted" ? "Requested" : params?.Status || "Requested",
        Booking_Id: params?.Booking_Id || "",
        RegistrationId: params?.RegistrationId || "",
        Reason: params?.Reason || ""
      }));
    }
  }, [params]);

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => setSpecilitydata(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    if (formData.specialization && formData.OperationMode) {
      const endpoint =
        formData.OperationMode === "SURGERY"
          ? `${UrlLink}OT/Surgeryname_Speciality_link`
          : `${UrlLink}OT/Procedurename_Speciality_link`;
      axios
        .get(`${endpoint}?Speciality=${formData.specialization}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setSurgeryData(res.data);
          } else {
            setSurgeryData([]);
            console.warn(res.data.warn || "No data returned");
          }
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setSurgeryData([]);
        });
    } else {
      setSurgeryData([]);
    }
  }, [formData.specialization, formData.OperationMode, UrlLink]);

  useEffect(() => {
    if (OTPatientdata?.OperationMode) {
      let newSurgeryName = "";
      if (OTPatientdata.OperationMode === "SURGERY") {
        newSurgeryName = OTPatientdata.Surgeryid || "";
      } else if (OTPatientdata.OperationMode === "PROCEDURE") {
        newSurgeryName = OTPatientdata.Procedureid || "";
      }
      setFormData((prev) => ({
        ...prev,
        surgeryName: newSurgeryName
      }));
    }
  }, [OTPatientdata]);

  useEffect(() => {
    axios.get(`${UrlLink}OT/Theatrename_all`)
      .then((res) => setTheatreData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios.get(`${UrlLink}Masters/get_Doctor_Detials_link`)
      .then((res) => setDoctorData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    if (OTPatientdata?.Editoption === true) {
      return;
    }
    const registrationId = params?.RegistrationId;
    if (registrationId && UrlLink) {
      axios
        .get(`${UrlLink}/OT/Theatre_booking_request_detail_by_Patient?RegistrationId=${registrationId}`)
        .then((res) => {
          setTheatrerequestdata(res.data);
          if (Array.isArray(res.data) && res.data.length > 0) {
            setEditoption(false);
          } else {
            setEditoption(true);
          }
        })
        .catch((err) => {
          console.error('Error fetching theatre request data:', err);
        });
    }
  }, [UrlLink, params?.RegistrationId, OTPatientdata?.Editoption]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditOtMaster = (row) => {
    setFormData((prev) => ({
      ...prev,
      reqDate: new Date().toISOString().split("T")[0],
      reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      id: row?.id || "",
      Booking_Id: row?.Booking_Id || "",
      bookingType: "EMERGENCY",
      specialization: row?.Specializationid || "",
      surgeryName: row?.Surgeryid || "",
      OTName: row?.Theatreid || "",
      doctorName: row?.DoctorID || "",
      bookingDate: row?.BookingDate || "",
      BookingTime: row?.BookingTime || "",
      duration: row?.Duration || "",
      operationType: row?.OperationType || "",
      OperationMode: row?.Operation_Mode || "",
      priority: row?.Priority || "",
      patientId: row?.patientId || "",
      patientName: row?.PatientName || "",
      age: row?.Age || "",
      gender: row?.Gender || "",
      uhidNo: row?.UHIDNO || "",
      Status: row?.Status || "Requested",
      RegistrationId: row?.RegistrationId || "",
      Reason: row?.Reason || ""
    }));
    setEditoption(true);
  };

  const BookingColumns = [
    { key: "Sno", name: "S.NO", frozen: true },
    { key: "ReqDate", name: "Requested_Date" },
    { key: "ReqTime", name: "Requested_Time" },
    { key: "BookingType", name: "Booking_Type" },
    { key: "bookingdate", name: "Booking_Date" },
    { key: "BookingTime", name: "Booking_Time" },
    { key: "PatientName", name: "Patient_Name" },
    { key: "Status", name: "Status" },
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

  const handleSubmit = async () => {
    const requiredFields = [
      'specialization', 'OperationMode', 'surgeryName', 'OTName', 'doctorName',
      'bookingDate', 'BookingTime'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      dispatchvalue({
        type: 'toast',
        value: { message: `Please fill in: ${missingFields.join(', ')}`, type: 'warn' },
      });
      return;
    }

    const data = {
      ...formData,
      created_by: userRecord?.username || ''
    };

    try {
      const res = await axios.post(`${UrlLink}OT/Theatre_booking_request_details`, data);
      const response = res.data;
      const messageType = Object.keys(response)[0];
      const messageContent = Object.values(response)[0];
      dispatchvalue({
        type: 'toast',
        value: { message: messageContent, type: messageType },
      });

      setLoad((prev) => !prev);
      setFormData({
        reqDate: new Date().toISOString().split("T")[0],
        reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        bookingType: "EMERGENCY",
        specialization: "",
        surgeryName: "",
        OTName: "",
        doctorName: "",
        bookingDate: "",
        BookingTime: "",
        duration: "",
        operationType: "",
        OperationMode: "",
        priority: "",
        patientId: "",
        patientName: "",
        age: "",
        gender: "",
        uhidNo: "",
        Status: "Requested",
        Booking_Id: "",
        RegistrationId: "",
        Reason: ""
      });

      dispatchvalue({ type: "OTPatientdata", value: {} });
      navigate("/Home/OTManagement");
      dispatchvalue({ type: "HrFolder", value: "OtQuelist" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    } catch (err) {
      console.error(err);
      dispatchvalue({
        type: 'toast',
        value: { message: 'Failed to submit request', type: 'error' },
      });
    }
  };

  return (
    <div className="Main_container_app">
      <h4>
        Theater Booking
        <div style={{ float: 'right' }}>
          OT Available
          <FontAwesomeIcon icon={faCalendarDays} onClick={() => openModal1("calendar")} className="cal_icon" />
        </div>
      </h4>
      <br />
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>ReqDate<span>:</span></label>
          <input
            type="date"
            name="reqDate"
            disabled={!Editoption}
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
            disabled={!Editoption}
            value={formData.reqTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>Booking Type<span>:</span></label>
          <select
            name='bookingType'
            disabled={!Editoption}
            value={formData.bookingType}
            onChange={handleChange}
          >
            <option value="EMERGENCY">EMERGENCY</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label>Operation Mode<span>:</span></label>
          <select
            name="OperationMode"
            disabled={!Editoption}
            value={formData.OperationMode}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="SURGERY">SURGERY</option>
            <option value="PROCEDURE">PROCEDURE</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label>Specialization<span>:</span></label>
          <select
            name="specialization"
            disabled={!Editoption}
            value={formData.specialization}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {Array.isArray(specialityData) && specialityData.map((block, index) => (
              <option key={index} value={block.Speciality_Id}>{block.SpecialityName}</option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label>{formData.OperationMode === "SURGERY" ? "Surgery Name" : "Procedure Name"}<span>:</span></label>
          <input
            type="text"
            name="surgeryName"
            disabled={!Editoption || !formData.OperationMode || !formData.specialization}
            value={
              SurgeryData.find(item => 
                (formData.OperationMode === "SURGERY" ? item.Surgery_Id : item.Procedure_Id) === formData.surgeryName
              )?.[formData.OperationMode === "SURGERY" ? "Surgery_Name" : "Procedure_Name"] || ""
            }
            onChange={(e) => {
              const selectedOption = SurgeryData.find(
                (item) =>
                  (formData.OperationMode === "SURGERY" ? item.Surgery_Name : item.Procedure_Name) === e.target.value
              );
              setFormData((prev) => ({
                ...prev,
                surgeryName: selectedOption
                  ? (formData.OperationMode === "SURGERY" ? selectedOption.Surgery_Id : selectedOption.Procedure_Id)
                  : ""
              }));
            }}
            list="SurgeryProcedureList"
            required
          />
          <datalist id="SurgeryProcedureList">
            {Array.isArray(SurgeryData) && SurgeryData.map((item, index) => (
              <option
                key={index}
                value={formData.OperationMode === "SURGERY" ? item.Surgery_Name : item.Procedure_Name}
              />
            ))}
          </datalist>
        </div>
        <div className="RegisForm_1">
          <label>Theatre Name<span>:</span></label>
          <select
            name="OTName"
            disabled={!Editoption}
            value={formData.OTName}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {Array.isArray(TheatreData) && TheatreData.map((block, index) => (
              <option key={index} value={block.id}>{block.Theatrename}</option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label>Doctor Name<span>:</span></label>
          <select
            name="doctorName"
            disabled={!Editoption}
            value={formData.doctorName}
            onChange={handleChange}
            required
          >
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
            disabled={!Editoption}
            value={formData.bookingDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>Booking Time<span>:</span></label>
          <input
            type="time"
            name="BookingTime"
            disabled={!Editoption}
            value={formData.BookingTime}
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
            disabled={!Editoption}
            onChange={handleChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>Operation Type<span>:</span></label>
          <select
            name='operationType'
            disabled={!Editoption}
            value={formData.operationType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Major">Major</option>
            <option value="Minor">Minor</option>
            <option value="Complex">Complex</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label>Priority<span>:</span></label>
          <select
            name='priority'
            value={formData.priority}
            disabled={!Editoption}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label>PatientId<span>:</span></label>
          <input
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            disabled={!Editoption}
            list="PatientidList"
          />
          <datalist id="PatientidList">
            {Array.isArray(Patientiddata) &&
              Patientiddata.map((f, i) => (
                <option key={i} value={f.id} />
              ))}
          </datalist>
        </div>
        <div className="RegisForm_1">
          <label>PatientName<span>:</span></label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            disabled={!Editoption}
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
            disabled={!Editoption}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label>Gender<span>:</span></label>
          <select
            name="gender"
            onChange={handleChange}
            value={formData.gender}
            disabled={!Editoption}
            required
          >
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
            disabled={!Editoption}
          />
        </div>
      </div>
      <br />
      <div className="Main_container_Btn">
        <button 
          disabled={!Editoption}
          onClick={handleSubmit}>
          {formData.Booking_Id ? 'Update' : 'Save'}
        </button>
      </div>
      <ReactGrid columns={BookingColumns} RowData={Theatrerequestdata} />
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
  );
};

export default New_theater_booking;