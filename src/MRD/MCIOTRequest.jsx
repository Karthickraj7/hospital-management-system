import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import axios from "axios";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import PrintIcon from "@mui/icons-material/Print";
import GetAppIcon from "@mui/icons-material/GetApp";
import * as XLSX from "xlsx";
// import OTGoogleStyleCalendar from './OTCalendar/OTGoogleStyleCalendar';
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LoupeIcon from "@mui/icons-material/Loupe";

const MCIOTRequest = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const OTPatientdata = useSelector(
    (state) => state.Frontoffice?.OTPatientdata
  );
  console.log(OTPatientdata, "OTPatientdata");
  const location = useLocation();
  const state = location.state || {};
  const params = state.params || {};
  const Updateoption = state.Editoption || false;

  const [viewType, setViewType] = useState("OriginalOTRequest");

  const [Editoption, setEditoption] = useState(true);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reqDate: new Date().toISOString().split("T")[0],
    reqTime: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    bookingType: "IP",
    specialization: "" || OTPatientdata?.Specializationid,
    surgeryName: "",
    OTName: "" || OTPatientdata?.Theatreid,
    doctorName: "" || OTPatientdata?.DoctorID,
    bookingDate: OTPatientdata?.BookingDate
      ? new Date(OTPatientdata.BookingDate).toISOString().split("T")[0] // YYYY-MM-DD
      : "",
    BookingTime: OTPatientdata?.BookingTime
      ? OTPatientdata.BookingTime.slice(0, 5) // HH:MM
      : "",
    duration: OTPatientdata?.Duration || 0,
    operationType: OTPatientdata?.OperationType || "Major",
    OperationMode: "PROCEDURE" || OTPatientdata?.OperationMode,
    priority: OTPatientdata?.Priority || "High",
    patientId:
      IP_DoctorWorkbenchNavigation?.PatientId || OTPatientdata?.patientId || "",
    patientName:
      IP_DoctorWorkbenchNavigation?.PatientName ||
      OTPatientdata?.PatientName ||
      "",
    age: IP_DoctorWorkbenchNavigation?.Age || OTPatientdata?.Age || "",
    gender: IP_DoctorWorkbenchNavigation?.Gender || OTPatientdata?.Gender || "",
    uhidNo: IP_DoctorWorkbenchNavigation?.UHID || OTPatientdata?.UHIDNO || "",
    Status: OTPatientdata?.Status || "Requested",
    Booking_Id: "" || OTPatientdata?.Booking_Id,
    RegistrationId:
      IP_DoctorWorkbenchNavigation?.RegistrationId ||
      OTPatientdata?.RegistrationId ||
      "",
    Reason: OTPatientdata?.Reason || "",

    Diagnosis: OTPatientdata?.Diagnosis || "",
    Surgeon: OTPatientdata?.Surgeon || [],
    Anaesthetist: OTPatientdata?.Anaesthetist || [],
    ScrubNurse: OTPatientdata?.ScrubNurse || [],
    Type: OTPatientdata?.Type || "",
  });

  console.log(formData, "formDataaaaa");

  const [surgeonInput, setSurgeonInput] = useState("");
  const [anaesthetistInput, setAnaesthetistInput] = useState("");
  const [scrubInput, setScrubInput] = useState("");

  const handleAddSurgeon = () => {
    if (!surgeonInput) return;

    setFormData((prev) => ({
      ...prev,
      Surgeon: [...prev.Surgeon, surgeonInput],
    }));

    setSurgeonInput(""); // clear input so datalist works
  };

  const handleAddAnaesthetist = () => {
    if (!anaesthetistInput) return;

    setFormData((prev) => ({
      ...prev,
      Anaesthetist: [...prev.Anaesthetist, anaesthetistInput],
    }));

    setAnaesthetistInput("");
  };

  const handleAddScrubNurse = () => {
    if (!scrubInput) return;

    setFormData((prev) => ({
      ...prev,
      ScrubNurse: [...prev.ScrubNurse, scrubInput],
    }));

    setScrubInput("");
  };

  const handleRemoveSurgeon = (index) => {
    setFormData((prev) => ({
      ...prev,
      Surgeon: prev.Surgeon.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveAnaesthetist = (index) => {
    setFormData((prev) => ({
      ...prev,
      Anaesthetist: prev.Anaesthetist.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveScrubNurse = (index) => {
    setFormData((prev) => ({
      ...prev,
      ScrubNurse: prev.ScrubNurse.filter((_, i) => i !== index),
    }));
  };

  const [typedSurgeryName, setTypedSurgeryName] = useState("");

  const [specialityData, setSpecilitydata] = useState([]);
  const [SurgeryData, setSurgeryData] = useState([]);
  const [TheatreData, setTheatreData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [EmployeeData, setEmployeeData] = useState([]);

  const [Patientiddata, setPatientiddata] = useState([]);
  const [Theatrerequestdata, setTheatrerequestdata] = useState([]);
  const [load, setLoad] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);

  const openModal1 = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
    setOpenModal3(true);
  };

  console.log(Theatrerequestdata, "Theatrerequestdata");

  useEffect(() => {
    if (formData.surgeryName && SurgeryData.length > 0) {
      const matched = SurgeryData.find(
        (item) =>
          (formData.OperationMode === "SURGERY"
            ? item.Surgery_Id
            : item.Procedure_Id) === formData.surgeryName
      );
      if (matched) {
        setTypedSurgeryName(
          formData.OperationMode === "SURGERY"
            ? matched.Surgery_Name
            : matched.Procedure_Name
        );
      }
    }
  }, [formData.surgeryName, formData.OperationMode, SurgeryData]);

  // useEffect(() => {
  //   if (params) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       reqDate: new Date().toISOString().split("T")[0],
  //       reqTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  //       Booking_Id: params?.Booking_Id || "",
  //       bookingType: "IP",
  //       specialization: params?.Specializationid || "",
  //       surgeryName: params?.Surgeryid || "",
  //       OTName: params?.Theatreid || "",
  //       doctorName: params?.DoctorID || "",
  //       bookingDate: params?.BookingDate || "",
  //       BookingTime: params?.BookingTime || "",
  //       duration: params?.Duration || "",
  //       operationType: params?.OperationType || "",
  //       operationMode: params?.Operation_Mode || "",
  //       priority: params?.Priority || "",
  //       patientId: params?.patientId || "",
  //       patientName: params?.PatientName || "",
  //       age: params?.Age || "",
  //       gender: params?.Gender || "",
  //       uhidNo: params?.UHIDNO || "",
  //       Status: params?.Status || "Requested",
  //       RegistrationId: params?.RegistrationId || ""
  //     }));
  //   }
  // }, [params]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
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
  }, [formData.specialization, formData.OperationMode]);

  useEffect(() => {
    // Find the OTPatientdata object matching the RegistrationId

    if (OTPatientdata?.OperationMode) {
      let newSurgeryName = "";
      if (OTPatientdata.OperationMode === "SURGERY") {
        newSurgeryName = OTPatientdata.Surgeryid || "";
      } else if (OTPatientdata.OperationMode === "PROCEDURE") {
        newSurgeryName = OTPatientdata.Procedureid || "";
      }

      setFormData((prev) => ({
        ...prev,
        surgeryName: newSurgeryName,
      }));
    }
  }, [OTPatientdata]);

  useEffect(() => {
    axios
      .get(`${UrlLink}OT/Theatrename_all`)
      .then((res) => setTheatreData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_Doctor_Detials_link`)
      .then((res) => setDoctorData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_Employee_by_PatientCategory`)
      .then((res) => setEmployeeData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultipleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlemultipledoctor = (row) => {};

  const handleEditOtMaster = (row) => {
    setFormData((prev) => ({
      ...prev,
      reqDate: new Date().toISOString().split("T")[0],
      reqTime: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      id: row?.id || "",
      Booking_Id: row?.Booking_Id || "",
      bookingType: "IP",
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
      patientId: row?.Patientid || "",
      patientName: row?.PatientName || "",
      age: row?.Age || "",
      gender: row?.Gender || "",
      uhidNo: row?.UHIDNO || "",
      Status: row?.Status || "Requested",
      RegistrationId: row?.RegistrationId || "",
    }));
  };

  const BookingColumns = [
    { key: "Sno", name: "S.NO", frozen: true },
    { key: "Duration", name: "Duration" },
    // { key: "ReqTime", name: "Requested_Time" },
    { key: "BookingType", name: "Booking_Type" },
    { key: "bookingdate", name: "Booking_Date" },
    // { key: "BookingTime", name: "Booking_Time" },
    { key: "PatientName", name: "Patient_Name" },
    { key: "Specialization_name", name: "Speciality" },
    { key: "ProcedureName", name: "ProcedureName" },
    {key:"Surgeon",name:"Surgeon"},
     {key:"Anaesthetist",name:"Anaesthetist"},
      {key:"ScrubNurse",name:"ScrubNurse"},

    // {
    //   key: "Action",
    //   name: "Action",
    //   renderCell: (params) => (
    //     <Button onClick={() => handleEditOtMaster(params.row)}>
    //       <EditIcon />
    //     </Button>
    //   ),
    // }
  ];

  const handleSubmit = async () => {
    const requiredFields = [
      "specialization",
      "OperationMode",
      "OTName",
      "doctorName",
      "bookingDate",
      "BookingTime",
      "patientId",
      "patientName",
      "age",
      "gender",
      "surgeryName",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      dispatchvalue({
        type: "toast",
        value: {
          message: `Please fill in: ${missingFields.join(", ")}`,
          type: "warn",
        },
      });
      return;
    }

    const data = {
      ...formData,
      created_by: userRecord?.username || "",
    };

    console.log(data, "data123");

    try {
      const res = await axios.post(
        `${UrlLink}MCI/MCI_Theatre_booking_request_details_Link`,
        data
      );
      const response = res.data;
      const messageType = Object.keys(response)[0];
      const messageContent = Object.values(response)[0];
      dispatchvalue({
        type: "toast",
        value: { message: messageContent, type: messageType },
      });

      setLoad((prev) => !prev);
      setFormData({
        reqDate: new Date().toISOString().split("T")[0],
        reqTime: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        bookingType: "IP",
        specialization: "",
        surgeryName: "",
        OTName: "",
        doctorName: "",
        bookingDate: "",
        BookingTime: "",
        duration: "",
        operationType: "Major",
        OperationMode: "PROCEDURE",
        priority: "High",
        patientId: "",
        patientName: "",
        age: "",
        gender: "",
        uhidNo: "",
        Status: "Requested",
        Booking_Id: "",
        RegistrationId: "",

        Diagnosis: "",
        Surgeon: [],
        Anaesthetist: [],
        ScrubNurse: [],
        Type: "",
      });

      dispatchvalue({ type: "OTPatientdata", value: {} });

      //  setViewType("OTQuelist")
    } catch (err) {
      console.error(err);
      dispatchvalue({
        type: "toast",
        value: { message: "Failed to submit request", type: "error" },
      });
    }
  };

  const handleOrgSubmit = async () => {
    const requiredFields = [
      "specialization",
      "OperationMode",
      "OTName",
      "doctorName",
      "bookingDate",
      "BookingTime",
      "patientId",
      "patientName",
      "age",
      "gender",
      "surgeryName",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      dispatchvalue({
        type: "toast",
        value: {
          message: `Please fill in: ${missingFields.join(", ")}`,
          type: "warn",
        },
      });
      return;
    }

    const data = {
      ...formData,
      created_by: userRecord?.username || "",
    };

    console.log(data, "data123");

    try {
      const res = await axios.post(
        `${UrlLink}MCI/MCI_Theatre_booking_request_details_Link_for_Org_OT`,
        data
      );
      const response = res.data;
      const messageType = Object.keys(response)[0];
      const messageContent = Object.values(response)[0];
      dispatchvalue({
        type: "toast",
        value: { message: messageContent, type: messageType },
      });

      setLoad((prev) => !prev);
      setFormData({
        reqDate: new Date().toISOString().split("T")[0],
        reqTime: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        bookingType: "IP",
        specialization: "",
        surgeryName: "",
        OTName: "",
        doctorName: "",
        bookingDate: "",
        BookingTime: "",
        duration: "",
        operationType: "Major",
        OperationMode: "PROCEDURE",
        priority: "High",
        patientId: "",
        patientName: "",
        age: "",
        gender: "",
        uhidNo: "",
        Status: "Requested",
        Booking_Id: "",
        RegistrationId: "",

        Diagnosis: "",
        Surgeon: [],
        Anaesthetist: [],
        ScrubNurse: [],
        Type: "",
      });

      dispatchvalue({ type: "OTPatientdata", value: {} });

      //  setViewType("OTQuelist")
    } catch (err) {
      console.error(err);
      dispatchvalue({
        type: "toast",
        value: { message: "Failed to submit request", type: "error" },
      });
    }
  };


  const handleOriginalOPSubmit = async () => {
    const requiredFields = [
      "specialization",
      "OperationMode",
      "OTName",
      "doctorName",
      "bookingDate",
      "BookingTime",
      "patientId",
      "patientName",
      "age",
      "gender",
      "surgeryName",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      dispatchvalue({
        type: "toast",
        value: {
          message: `Please fill in: ${missingFields.join(", ")}`,
          type: "warn",
        },
      });
      return;
    }

    const data = {
      ...formData,
      created_by: userRecord?.username || "",
    };

    console.log(data, "data123");

    try {
      const res = await axios.post(
        `${UrlLink}MCI/MCI_Theatre_booking_request_details_Link_for_Org_OP_OT`,
        data
      );
      const response = res.data;
      const messageType = Object.keys(response)[0];
      const messageContent = Object.values(response)[0];
      dispatchvalue({
        type: "toast",
        value: { message: messageContent, type: messageType },
      });

      setLoad((prev) => !prev);
      setFormData({
        reqDate: new Date().toISOString().split("T")[0],
        reqTime: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        bookingType: "IP",
        specialization: "",
        surgeryName: "",
        OTName: "",
        doctorName: "",
        bookingDate: "",
        BookingTime: "",
        duration: "",
        operationType: "Major",
        OperationMode: "PROCEDURE",
        priority: "High",
        patientId: "",
        patientName: "",
        age: "",
        gender: "",
        uhidNo: "",
        Status: "Requested",
        Booking_Id: "",
        RegistrationId: "",

        Diagnosis: "",
        Surgeon: [],
        Anaesthetist: [],
        ScrubNurse: [],
        Type: "",
      });

      dispatchvalue({ type: "OTPatientdata", value: {} });

      //  setViewType("OTQuelist")
    } catch (err) {
      console.error(err);
      dispatchvalue({
        type: "toast",
        value: { message: "Failed to submit request", type: "error" },
      });
    }
  };

  const handleDummyOPSubmit = async () => {
    const requiredFields = [
      "specialization",
      "OperationMode",
      "OTName",
      "doctorName",
      "bookingDate",
      "BookingTime",
      "patientId",
      "patientName",
      "age",
      "gender",
      "surgeryName",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      dispatchvalue({
        type: "toast",
        value: {
          message: `Please fill in: ${missingFields.join(", ")}`,
          type: "warn",
        },
      });
      return;
    }

    const data = {
      ...formData,
      created_by: userRecord?.username || "",
    };

    console.log(data, "data123");

    try {
      const res = await axios.post(
        `${UrlLink}MCI/MCI_Theatre_booking_request_details_Link_for_Dummy_OP_OT`,
        data
      );
      const response = res.data;
      const messageType = Object.keys(response)[0];
      const messageContent = Object.values(response)[0];
      dispatchvalue({
        type: "toast",
        value: { message: messageContent, type: messageType },
      });

      setLoad((prev) => !prev);
      setFormData({
        reqDate: new Date().toISOString().split("T")[0],
        reqTime: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        bookingType: "IP",
        specialization: "",
        surgeryName: "",
        OTName: "",
        doctorName: "",
        bookingDate: "",
        BookingTime: "",
        duration: "",
        operationType: "Major",
        OperationMode: "PROCEDURE",
        priority: "High",
        patientId: "",
        patientName: "",
        age: "",
        gender: "",
        uhidNo: "",
        Status: "Requested",
        Booking_Id: "",
        RegistrationId: "",

        Diagnosis: "",
        Surgeon: [],
        Anaesthetist: [],
        ScrubNurse: [],
        Type: "",
      });

      dispatchvalue({ type: "OTPatientdata", value: {} });

      //  setViewType("OTQuelist")
    } catch (err) {
      console.error(err);
      dispatchvalue({
        type: "toast",
        value: { message: "Failed to submit request", type: "error" },
      });
    }
  };

  

  const [Patientarr, setPatientarr] = useState([]);
  const [OrgPatientarr, setOrgPatientarr] = useState([]);
  const [OPPatientarr, setOPPatientarr] = useState([]);
  const [OPorgPatientarr, setOPorgPatientarr] = useState([]);

  const [patientsearch, setpatientsearch] = useState({
    Search: "",
    RegistrationId: "",
  });

  console.log(patientsearch, "patientsearch");

  useEffect(() => {
    console.log("get pppppppppppppppppp");

    if (viewType !== "DummyOTRequest") return;

    const postdata = {
      patientsearch: patientsearch.Search || "",
    };

    console.log("PosttttDDDD", postdata);

    axios
      .get(`${UrlLink}MCI/Filter_FakeIPPatient_by_Multiple_Criteria`, {
        params: postdata,
      })
      .then((res) => {
        const data = res.data;
        console.log("08642", data);
        setPatientarr(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [UrlLink, patientsearch, viewType]);

  useEffect(() => {
    console.log("get pppppppppppppppppp");

    if (viewType !== "OriginalOTRequest") return;

    const postdata = {
      patientsearch: patientsearch.Search || "",
    };

    console.log("PosttttDDDD", postdata);

    axios
      .get(
        `${UrlLink}MCI/Filter_FakeIPPatient_by_Multiple_Criteria_for_org_OT`,
        {
          params: postdata,
        }
      )
      .then((res) => {
        const data = res.data;
        console.log("08642", data);
        setOrgPatientarr(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [UrlLink, patientsearch, viewType]);

  useEffect(() => {
    console.log("get pppppppppppppppppp");

    if (viewType !== "DummyOPOTRequest") return;

    const postdata = {
      patientsearch: patientsearch.Search || "",
    };

    console.log("PosttttDDDD", postdata);

    axios
      .get(`${UrlLink}MCI/MCI_Patients_Management_Filter_OPVisitEntry`, {
        params: postdata,
      })
      .then((res) => {
        const data = res.data;
        console.log("08642", data);
        setOPPatientarr(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [UrlLink, patientsearch, viewType]);

  useEffect(() => {
    console.log("get pppppppppppppppppp");

    if (viewType !== "OriginalOPOTRequest") return;

    const postdata = {
      patientsearch: patientsearch.Search || "",
    };

    console.log("PosttttDDDD", postdata);

    axios
      .get(`${UrlLink}MCI/MCI_Patients_Management_Filter_org_OT_Entry`, {
        params: postdata,
      })
      .then((res) => {
        const data = res.data;
        console.log("08642", data);
        setOPorgPatientarr(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [UrlLink, patientsearch, viewType]);

  const HandlesearchPatient = (value) => {
    console.log("HandlesearchPatient", value);

    const exist = Patientarr.find((f) => f.PatientId === value);

    console.log(exist, "exist");
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      axios
        .get(
          `${UrlLink}MCI/get_MCI_Patient_Details_by_patientId?PatientId=${value}`
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

          setFormData((prev) => ({
            ...prev,
            patientId: resss.PatientId,
            patientName: [resss.FirstName, resss.MiddleName, resss.LastName]
              .filter(Boolean)
              .join(" "),
            age: resss.Age,
            gender: resss.Gender,
            RegistrationId: patientsearch.RegistrationId,
          }));
        })
        .catch((err) => console.log(err));
    }
  };

  const HandleorgsearchPatient = (value) => {
    console.log("HandlesearchPatient", value);

    const exist = OrgPatientarr.find((f) => f.PatientId === value);

    console.log(exist, "exist");
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      axios
        .get(
          `${UrlLink}MCI/get_MCI_Patient_Details_by_patientId_for_OT?PatientId=${value}`
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

          setFormData((prev) => ({
            ...prev,
            patientId: resss.PatientId,
            patientName: [resss.FirstName, resss.MiddleName, resss.LastName]
              .filter(Boolean)
              .join(" "),
            age: resss.Age,
            gender: resss.Gender,
            RegistrationId: patientsearch.RegistrationId,
          }));
        })
        .catch((err) => console.log(err));
    }
  };

  const HandlesearchOPPatient = (value) => {
    console.log("HandlesearchPatient", value);

    const exist = OPPatientarr.find((f) => f.PatientId === value);

    console.log(exist, "exist");
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      axios
        .get(
          `${UrlLink}MCI/get_MCI_Patient_Details_by_patientId?PatientId=${value}`
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

          setFormData((prev) => ({
            ...prev,
            patientId: resss.PatientId,
            patientName: [resss.FirstName, resss.MiddleName, resss.LastName]
              .filter(Boolean)
              .join(" "),
            age: resss.Age,
            gender: resss.Gender,
            RegistrationId: patientsearch.RegistrationId,
          }));
        })
        .catch((err) => console.log(err));
    }
  };

  const HandleorgsearchOPPatient = (value) => {
    console.log("HandlesearchPatient", value);

    const exist = OPorgPatientarr.find((f) => f.PatientId === value);

    console.log(exist, "exist");
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      axios
        .get(
          `${UrlLink}MCI/get_MCI_Patient_Details_by_patientId_for_OT?PatientId=${value}`
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

          setFormData((prev) => ({
            ...prev,
            patientId: resss.PatientId,
            patientName: [resss.FirstName, resss.MiddleName, resss.LastName]
              .filter(Boolean)
              .join(" "),
            age: resss.Age,
            gender: resss.Gender,
            RegistrationId: patientsearch.RegistrationId,
          }));
        })
        .catch((err) => console.log(err));
    }
  };

  const HandleSearchchange = (e) => {
    const { name, value } = e.target;

    // Add null check for Patientarr
    const matched = Patientarr?.find((item) => item.PatientId === value);

    console.log(matched?.RegistrationId, "matchedddd");

    setpatientsearch((prev) => ({
      ...prev,
      [name]: value,
      RegistrationId: matched?.RegistrationId || "",
    }));
  };



  const OriginalOPHandleSearchchange = (e) => {
    const { name, value } = e.target;

    // Add null check for Patientarr
    const matched = OPorgPatientarr?.find((item) => item.PatientId === value);

    console.log(matched?.RegistrationId, "matchedddd");

    setpatientsearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));

  const [searchOptions, setSearchOptions] = useState({
    DateType: "Current",
    CurrentDate: formatDate(new Date()),
    FromDate: "",
    ToDate: "",
    SearchbyFirstName: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "Paid",
    BillType: "",
  });

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === "SearchbyPhoneNumber") {
      if (value.length <= 10) {
        setSearchOptions((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "DateType") {
      if (value === "Current") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: TodayDate,
          FromDate: "",
          ToDate: "",
        }));
      } else if (value === "Customize") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
        }));
      } else if (value === "All") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
          FromDate: "",
          ToDate: "",
        }));
      }
    } else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const params = {
      ...searchOptions,
    };

    axios
      .get(`${UrlLink}/MCI/MCI_Theatre_booking_request_details_Link?`, {
        params,
      })
      .then((res) => {
        setTheatrerequestdata(res.data || []);
        // Check if res.data is an array and has elements
        if (Array.isArray(res.data) && res.data.length > 0) {
          console.log("editeeeee");
          setEditoption(false);
        } else {
          console.log("editeeeee123");
          setEditoption(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching theatre request data:", err);
        setTheatrerequestdata([]);
      });
  }, [searchOptions, viewType]);

  // Print functionality
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const printDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const printDay = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    const printTime = new Date().toLocaleTimeString();

    const tableContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>OT List - Karuna Medical College</title>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Times New Roman', Times, serif;
          margin: 30px;
          padding: 0;
          color: #000;
        }
        .header {
          text-align: center;
          margin-bottom: 25px;
        }
        .hospital-name {
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .report-title {
          font-size: 18px;
          font-weight: bold;
          margin: 8px 0;
        }
        .print-info {
          text-align: right;
          font-size: 12px;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          font-size: 11px;
        }
        th, td {
          border: 1px solid #000;
          text-align: center;
          vertical-align: middle;
          padding: 6px 4px;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
          height: 90px;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
        td {
          height: 55px;
        }
        /* Horizontal headers (first 6 columns) */
        th:nth-child(-n+6),
        td:nth-child(-n+6) {
          writing-mode: horizontal-tb;
          transform: none;
          height: auto;
        }
        th:nth-child(1), th:nth-child(2) { width: 5%; }
        th:nth-child(3) { width: 12%; }
        th:nth-child(4) { width: 8%; }
        th:nth-child(5) { width: 12%; }
        th:nth-child(6) { width: 15%; }
        .footer {
          margin-top: 40px;
          text-align: right;
          font-size: 12px;
        }
        @media print {
          body { margin: 10mm; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="hospital-name">KARUNA MEDICAL COLLEGE HOSPITAL, VILAYODI, CHITTUR, PALAKKAD. OT LIST</div>
        <div class="report-title">${printDate}, ${printDay.toUpperCase()}</div>
      </div>

      <div class="print-info">
        Printed on: ${printDate} ${printTime} | Printed by: ${
      userRecord?.username || "User"
    }
      </div>

      <table>
        <thead>
          <tr>
            <th>SL NO</th>
            <th>IP/OP</th>
            <th>NAME OF PATIENT</th>
            <th>AGE /SEX</th>
            <th>DIAGNOSIS</th>
            <th>NAME OF OPERATION</th>
            <th>NAME OF SURGEON</th>
            <th>NAME OF ANAESTHETIST</th>
            <th>SCRUB NURSE</th>
            <th>DURATION</th>
            <th>TYPE</th>
          </tr>
        </thead>
        <tbody>
          ${(Theatrerequestdata || [])
            .map(
              (row, index) => `
            <tr>
              <td>${row.Sno || index + 1}</td>
              <td>${row.RegistrationId || ""} / ${row.patientId || ""}</td>
              <td>${row.PatientName || ""}</td>
              <td>${row.Age || ""} / ${row.Gender === "Male" ? "M" : "F"}</td>
              <td>${row.Diagnosis || "-"}</td>
              <td>${row.ProcedureName || row.SurgeryName || "-"}</td>
              <td>${
                Array.isArray(row.Surgeon)
                  ? row.Surgeon.join(", ")
                  : row.Surgeon || "-"
              }</td>
              <td>${
                Array.isArray(row.Anaesthetist)
                  ? row.Anaesthetist.join(", ")
                  : row.Anaesthetist || "-"
              }</td>
              <td>${
                Array.isArray(row.ScrubNurse)
                  ? row.ScrubNurse.join(", ")
                  : row.ScrubNurse || "-"
              }</td>
              <td>${(row.Duration || "").replace(";", " - ").trim()}</td>
              <td>${row.OperationType === "Major" ? "GA" : "LA"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        Total Cases: ${
          (Theatrerequestdata || []).length
        } | Printed on ${new Date().toLocaleString()}
      </div>
    </body>
    </html>
  `;

    printWindow.document.write(tableContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Excel export functionality
  const exportToExcel = () => {
    // Prepare data for Excel
    const excelData = (Theatrerequestdata || []).map((row, index) => {
      const excelRow = {};
      BookingColumns.forEach((col) => {
        excelRow[col.name] = row[col.key] || "";
      });
      return excelRow;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OT Queue List");

    // Generate Excel file
    const fileName = `OT_Queue_List_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="Main_container_app">
      <h4>
        Theater Booking
        {/* <div style={{ float: 'right' }}>
          OT Available
          <FontAwesomeIcon icon={faCalendarDays} onClick={() => openModal1("calendar")} className="cal_icon" />
        </div> */}
      </h4>
      <br />

      <div className="RegisterTypecon">
        <div className="RegisterType">
          {[
            "OriginalOTRequest",
            "DummyOTRequest",
            "OriginalOPOTRequest",
            "DummyOPOTRequest",
            "OTQuelist",
          ].map((p, ind) => (
            <div className="registertypeval" key={ind + "key"}>
              <input
                type="radio"
                id={p}
                name="view_type"
                checked={viewType === p}
                onChange={() => setViewType(p)}
                value={p}
              />
              <label htmlFor={p}>
                {{
                  OTRequest: "OT Request",
                  OTQuelist: "OT Quelist",
                }[p] || p}
              </label>
            </div>
          ))}
        </div>
      </div>
      <br />

      {viewType === "DummyOTRequest" && (
        <>
          <div className="RegisForm_12">
            <label>
              Patient Search <span>:</span>
            </label>
            <div className="Search_patient_icons">
              <input
                name="Search"
                list="PatientList"
                onChange={HandleSearchchange}
              />
              <datalist id="PatientList">
                {(Patientarr || []).length > 0 &&
                  (Patientarr || []).map((item, index) => (
                    <option key={index} value={item.PatientId || ""}>
                      {" "}
                      {item.FirstName || item.RegistrationId || ""}{" "}
                      {item.PhoneNo || ""}
                    </option>
                  ))}
              </datalist>

              {patientsearch.Search && (
                <span onClick={() => HandlesearchPatient(patientsearch.Search)}>
                  <PersonSearchIcon />
                </span>
              )}
            </div>
          </div>

          <br />

          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                ReqDate<span>:</span>
              </label>
              <input
                type="date"
                name="reqDate"
                // disabled={!Editoption}
                value={formData.reqDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                ReqTime<span>:</span>
              </label>
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
              <label>
                Booking Type<span>:</span>
              </label>
              <select
                name="bookingType"
                // disabled={!Editoption}
                value={formData.bookingType}
                onChange={handleChange}
              >
                <option value="IP">IP</option>
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Operation Mode<span>:</span>
              </label>
              <select
                name="OperationMode"
                // disabled={!Editoption}
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
              <label>
                Specialization<span>:</span>
              </label>
              <select
                name="specialization"
                // disabled={!Editoption}
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(specialityData) &&
                  specialityData.map((block, index) => (
                    <option key={index} value={block.Speciality_Id}>
                      {block.SpecialityName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="RegisForm_1">
              <label>
                {formData.OperationMode === "SURGERY"
                  ? "Surgery Name"
                  : "Procedure Name"}
                <span>:</span>
              </label>

              <input
                type="text"
                name="surgeryName"
                // disabled={!Editoption || !formData.OperationMode || !formData.specialization}
                value={typedSurgeryName}
                onChange={(e) => {
                  const value = e.target.value;
                  setTypedSurgeryName(value);

                  const selectedOption = SurgeryData.find(
                    (item) =>
                      (formData.OperationMode === "SURGERY"
                        ? item.Surgery_Name
                        : item.Procedure_Name) === value
                  );

                  setFormData((prev) => ({
                    ...prev,
                    surgeryName: selectedOption
                      ? formData.OperationMode === "SURGERY"
                        ? selectedOption.Surgery_Id
                        : selectedOption.Procedure_Id
                      : "", // reset if not found
                  }));
                }}
                list="SurgeryProcedureList"
                required
              />

              <datalist id="SurgeryProcedureList">
                {Array.isArray(SurgeryData) &&
                  SurgeryData.map((item, index) => (
                    <option
                      key={index}
                      value={
                        formData.OperationMode === "SURGERY"
                          ? item.Surgery_Name
                          : item.Procedure_Name
                      }
                    />
                  ))}
              </datalist>
            </div>

            <div className="RegisForm_1">
              <label>
                Theatre Name<span>:</span>
              </label>
              <select
                name="OTName"
                // disabled={!Editoption}
                value={formData.OTName}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(TheatreData) &&
                  TheatreData.map((block, index) => (
                    <option key={index} value={block.id}>
                      {block.Theatrename}
                    </option>
                  ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Doctor Name<span>:</span>
              </label>
              <select
                name="doctorName"
                // disabled={!Editoption}
                value={formData.doctorName}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(DoctorData) &&
                  DoctorData.map((block, index) => (
                    <option key={index} value={block.id}>
                      {block.Name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Booking Date<span>:</span>
              </label>
              <input
                type="date"
                name="bookingDate"
                // disabled={!Editoption}
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Booking Time<span>:</span>
              </label>
              <input
                type="time"
                name="BookingTime"
                // disabled={!Editoption}
                value={formData.BookingTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Duration<span>:</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                // disabled={!Editoption}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Operation Type<span>:</span>
              </label>
              <select
                name="operationType"
                // disabled={!Editoption}
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
              <label>
                Priority<span>:</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                // disabled={!Editoption}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                PatientId<span>:</span>
              </label>
              <input
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                // disabled={!Editoption}
                list="PatientidList"
              />
              <datalist id="PatientidList">
                {Array.isArray(Patientiddata) &&
                  Patientiddata.map((f, i) => <option key={i} value={f.id} />)}
              </datalist>
            </div>
            <div className="RegisForm_1">
              <label>
                PatientName<span>:</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                // disabled={!Editoption}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Age<span>:</span>
              </label>
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
              <label>
                Gender<span>:</span>
              </label>
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
              <label>
                UHIDNO<span>:</span>
              </label>
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
          <br />

          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                Diagnosis<span>:</span>
              </label>
              <input
                type="text"
                name="Diagnosis"
                // disabled={!Editoption}
                value={formData.Diagnosis}
                onChange={handleChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Type<span>:</span>
              </label>
              <input
                type="text"
                name="Type"
                // disabled={!Editoption}
                value={formData.Type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Surgeon<span>:</span>
              </label>
              <input
                type="text"
                list="doctorList"
                name="Type"
                // disabled={!Editoption}
                value={surgeonInput} // controlled by formData
                onChange={(e) => setSurgeonInput(e.target.value)}
                required
              />

              <datalist id="doctorList">
                {(DoctorData || []).map((row, indx) => (
                  <option key={indx} value={row.Name} />
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddSurgeon}
              >
                <LoupeIcon />
              </button>
            </div>

            <div className="RegisForm_1">
              <label>
                Anaesthetist<span>:</span>
              </label>
              <input
                type="text"
                list="AnaesthetistList"
                name="Type"
                // disabled={!Editoption}
                value={anaesthetistInput}
                onChange={(e) => setAnaesthetistInput(e.target.value)}
                required
              />

              <datalist id="AnaesthetistList">
                {(DoctorData || []).map((row, indx) => (
                  <option key={indx} value={row.Name}>
                    {row.Name}
                  </option>
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddAnaesthetist}
              >
                <LoupeIcon />
              </button>
            </div>

            <div className="RegisForm_1">
              <label>
                ScrubNurse<span>:</span>
              </label>
              <input
                type="text"
                list="ScrubNurseList"
                name="Type"
                // disabled={!Editoption}
                value={scrubInput}
                onChange={(e) => setScrubInput(e.target.value)}
                required
              />

              <datalist id="ScrubNurseList">
                {(EmployeeData || []).map((row, indx) => (
                  <option key={indx} value={row.Name}>
                    {row.Name}
                  </option>
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddScrubNurse}
              >
                <LoupeIcon />
              </button>
            </div>
          </div>

          <div className="team-members-display" style={{ marginTop: "24px" }}>
            <h4
              style={{
                margin: "0 0 16px 0",
                color: "#333",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Selected Team Members
            </h4>

            {/* Surgeon */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Surgeon
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.Surgeon || []).length > 0 ? (
                  (formData.Surgeon || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #bbdefb",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveSurgeon(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#d32f2f",
                            fontSize: "18px",
                            cursor: "pointer",
                            padding: "0",
                            marginLeft: "4px",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No surgeon selected
                  </span>
                )}
              </div>
            </div>

            {/* Anaesthetist */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Anaesthetist
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.Anaesthetist || []).length > 0 ? (
                  (formData.Anaesthetist || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #c8e6c9",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveAnaesthetist(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#c62828",
                            fontSize: "18px",
                            cursor: "pointer",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No anaesthetist selected
                  </span>
                )}
              </div>
            </div>

            {/* Scrub Nurse */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Scrub Nurse
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.ScrubNurse || []).length > 0 ? (
                  (formData.ScrubNurse || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#fff3e0",
                        color: "#ef6c00",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #ffe0b2",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveScrubNurse(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#d84315",
                            fontSize: "18px",
                            cursor: "pointer",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No scrub nurse selected
                  </span>
                )}
              </div>
            </div>
          </div>

          <br />
          <div className="Main_container_Btn">
            <button
              // disabled={!Editoption}
              onClick={handleSubmit}
            >
              {formData.Booking_Id ? "Update" : "Save"}
            </button>
          </div>
        </>
      )}

      {viewType === "OriginalOTRequest" && (
        <>
          <div className="RegisForm_12">
            <label>
              Patient Search <span>:</span>
            </label>
            <div className="Search_patient_icons">
              <input
                name="Search"
                list="PatientList"
                onChange={HandleSearchchange}
              />
              <datalist id="PatientList">
                {(OrgPatientarr || []).length > 0 &&
                  (OrgPatientarr || []).map((item, index) => (
                    <option key={index} value={item.PatientId || ""}>
                      {" "}
                      {item.FirstName || item.RegistrationId || ""}{" "}
                      {item.PhoneNo || ""}
                    </option>
                  ))}
              </datalist>

              {patientsearch.Search && (
                <span
                  onClick={() => HandleorgsearchPatient(patientsearch.Search)}
                >
                  <PersonSearchIcon />
                </span>
              )}
            </div>
          </div>

          <br />

          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                ReqDate<span>:</span>
              </label>
              <input
                type="date"
                name="reqDate"
                // disabled={!Editoption}
                value={formData.reqDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                ReqTime<span>:</span>
              </label>
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
              <label>
                Booking Type<span>:</span>
              </label>
              <select
                name="bookingType"
                // disabled={!Editoption}
                value={formData.bookingType}
                onChange={handleChange}
              >
                <option value="IP">IP</option>
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Operation Mode<span>:</span>
              </label>
              <select
                name="OperationMode"
                // disabled={!Editoption}
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
              <label>
                Specialization<span>:</span>
              </label>
              <select
                name="specialization"
                // disabled={!Editoption}
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(specialityData) &&
                  specialityData.map((block, index) => (
                    <option key={index} value={block.Speciality_Id}>
                      {block.SpecialityName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="RegisForm_1">
              <label>
                {formData.OperationMode === "SURGERY"
                  ? "Surgery Name"
                  : "Procedure Name"}
                <span>:</span>
              </label>

              <input
                type="text"
                name="surgeryName"
                // disabled={!Editoption || !formData.OperationMode || !formData.specialization}
                value={typedSurgeryName}
                onChange={(e) => {
                  const value = e.target.value;
                  setTypedSurgeryName(value);

                  const selectedOption = SurgeryData.find(
                    (item) =>
                      (formData.OperationMode === "SURGERY"
                        ? item.Surgery_Name
                        : item.Procedure_Name) === value
                  );

                  setFormData((prev) => ({
                    ...prev,
                    surgeryName: selectedOption
                      ? formData.OperationMode === "SURGERY"
                        ? selectedOption.Surgery_Id
                        : selectedOption.Procedure_Id
                      : "", // reset if not found
                  }));
                }}
                list="SurgeryProcedureList"
                required
              />

              <datalist id="SurgeryProcedureList">
                {Array.isArray(SurgeryData) &&
                  SurgeryData.map((item, index) => (
                    <option
                      key={index}
                      value={
                        formData.OperationMode === "SURGERY"
                          ? item.Surgery_Name
                          : item.Procedure_Name
                      }
                    />
                  ))}
              </datalist>
            </div>

            <div className="RegisForm_1">
              <label>
                Theatre Name<span>:</span>
              </label>
              <select
                name="OTName"
                // disabled={!Editoption}
                value={formData.OTName}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(TheatreData) &&
                  TheatreData.map((block, index) => (
                    <option key={index} value={block.id}>
                      {block.Theatrename}
                    </option>
                  ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Doctor Name<span>:</span>
              </label>
              <select
                name="doctorName"
                // disabled={!Editoption}
                value={formData.doctorName}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(DoctorData) &&
                  DoctorData.map((block, index) => (
                    <option key={index} value={block.id}>
                      {block.Name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Booking Date<span>:</span>
              </label>
              <input
                type="date"
                name="bookingDate"
                // disabled={!Editoption}
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Booking Time<span>:</span>
              </label>
              <input
                type="time"
                name="BookingTime"
                // disabled={!Editoption}
                value={formData.BookingTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Duration<span>:</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                // disabled={!Editoption}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Operation Type<span>:</span>
              </label>
              <select
                name="operationType"
                // disabled={!Editoption}
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
              <label>
                Priority<span>:</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                // disabled={!Editoption}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                PatientId<span>:</span>
              </label>
              <input
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                // disabled={!Editoption}
                list="PatientidList"
              />
              <datalist id="PatientidList">
                {Array.isArray(Patientiddata) &&
                  Patientiddata.map((f, i) => <option key={i} value={f.id} />)}
              </datalist>
            </div>
            <div className="RegisForm_1">
              <label>
                PatientName<span>:</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                // disabled={!Editoption}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Age<span>:</span>
              </label>
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
              <label>
                Gender<span>:</span>
              </label>
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
              <label>
                UHIDNO<span>:</span>
              </label>
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
          <br />

          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                Diagnosis<span>:</span>
              </label>
              <input
                type="text"
                name="Diagnosis"
                // disabled={!Editoption}
                value={formData.Diagnosis}
                onChange={handleChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Type<span>:</span>
              </label>
              <input
                type="text"
                name="Type"
                // disabled={!Editoption}
                value={formData.Type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Surgeon<span>:</span>
              </label>
              <input
                type="text"
                list="doctorList"
                name="Type"
                // disabled={!Editoption}
                value={surgeonInput} // controlled by formData
                onChange={(e) => setSurgeonInput(e.target.value)}
                required
              />

              <datalist id="doctorList">
                {(DoctorData || []).map((row, indx) => (
                  <option key={indx} value={row.Name} />
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddSurgeon}
              >
                <LoupeIcon />
              </button>
            </div>

            <div className="RegisForm_1">
              <label>
                Anaesthetist<span>:</span>
              </label>
              <input
                type="text"
                list="AnaesthetistList"
                name="Type"
                // disabled={!Editoption}
                value={anaesthetistInput}
                onChange={(e) => setAnaesthetistInput(e.target.value)}
                required
              />

              <datalist id="AnaesthetistList">
                {(DoctorData || []).map((row, indx) => (
                  <option key={indx} value={row.Name}>
                    {row.Name}
                  </option>
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddAnaesthetist}
              >
                <LoupeIcon />
              </button>
            </div>

            <div className="RegisForm_1">
              <label>
                ScrubNurse<span>:</span>
              </label>
              <input
                type="text"
                list="ScrubNurseList"
                name="Type"
                // disabled={!Editoption}
                value={scrubInput}
                onChange={(e) => setScrubInput(e.target.value)}
                required
              />

              <datalist id="ScrubNurseList">
                {(EmployeeData || []).map((row, indx) => (
                  <option key={indx} value={row.Name}>
                    {row.Name}
                  </option>
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddScrubNurse}
              >
                <LoupeIcon />
              </button>
            </div>
          </div>

          <div className="team-members-display" style={{ marginTop: "24px" }}>
            <h4
              style={{
                margin: "0 0 16px 0",
                color: "#333",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Selected Team Members
            </h4>

            {/* Surgeon */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Surgeon
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.Surgeon || []).length > 0 ? (
                  (formData.Surgeon || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #bbdefb",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveSurgeon(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#d32f2f",
                            fontSize: "18px",
                            cursor: "pointer",
                            padding: "0",
                            marginLeft: "4px",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No surgeon selected
                  </span>
                )}
              </div>
            </div>

            {/* Anaesthetist */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Anaesthetist
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.Anaesthetist || []).length > 0 ? (
                  (formData.Anaesthetist || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #c8e6c9",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveAnaesthetist(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#c62828",
                            fontSize: "18px",
                            cursor: "pointer",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No anaesthetist selected
                  </span>
                )}
              </div>
            </div>

            {/* Scrub Nurse */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Scrub Nurse
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.ScrubNurse || []).length > 0 ? (
                  (formData.ScrubNurse || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#fff3e0",
                        color: "#ef6c00",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #ffe0b2",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveScrubNurse(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#d84315",
                            fontSize: "18px",
                            cursor: "pointer",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No scrub nurse selected
                  </span>
                )}
              </div>
            </div>
          </div>

          <br />
          <div className="Main_container_Btn">
            <button
              // disabled={!Editoption}
              onClick={handleOrgSubmit}
            >
              {formData.Booking_Id ? "Update" : "Save"}
            </button>
          </div>
        </>
      )}

      {viewType === "OriginalOPOTRequest" && (
        <>
          <div className="RegisForm_12">
            <label>
              Patient Search <span>:</span>
            </label>
            <div className="Search_patient_icons">
              <input
                name="Search"
                list="PatientList"
                onChange={OriginalOPHandleSearchchange}
              />
              <datalist id="PatientList">
                {(OPorgPatientarr || []).length > 0 &&
                  (OPorgPatientarr || []).map((item, index) => (
                    <option key={index} value={item.PatientId || ""}>
                      {" "}
                      {item.FirstName || ""}{" "}
                      {item.PhoneNo || ""}
                    </option>
                  ))}
              </datalist>

              {patientsearch.Search && (
                <span
                  onClick={() => HandleorgsearchOPPatient(patientsearch.Search)}
                >
                  <PersonSearchIcon />
                </span>
              )}
            </div>
          </div>

          <br />

          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                ReqDate<span>:</span>
              </label>
              <input
                type="date"
                name="reqDate"
                // disabled={!Editoption}
                value={formData.reqDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                ReqTime<span>:</span>
              </label>
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
              <label>
                Booking Type<span>:</span>
              </label>
              <select
                name="bookingType"
                // disabled={!Editoption}
                value={formData.bookingType}
                onChange={handleChange}
              >
                <option value="IP">IP</option>
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Operation Mode<span>:</span>
              </label>
              <select
                name="OperationMode"
                // disabled={!Editoption}
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
              <label>
                Specialization<span>:</span>
              </label>
              <select
                name="specialization"
                // disabled={!Editoption}
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(specialityData) &&
                  specialityData.map((block, index) => (
                    <option key={index} value={block.Speciality_Id}>
                      {block.SpecialityName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="RegisForm_1">
              <label>
                {formData.OperationMode === "SURGERY"
                  ? "Surgery Name"
                  : "Procedure Name"}
                <span>:</span>
              </label>

              <input
                type="text"
                name="surgeryName"
                // disabled={!Editoption || !formData.OperationMode || !formData.specialization}
                value={typedSurgeryName}
                onChange={(e) => {
                  const value = e.target.value;
                  setTypedSurgeryName(value);

                  const selectedOption = SurgeryData.find(
                    (item) =>
                      (formData.OperationMode === "SURGERY"
                        ? item.Surgery_Name
                        : item.Procedure_Name) === value
                  );

                  setFormData((prev) => ({
                    ...prev,
                    surgeryName: selectedOption
                      ? formData.OperationMode === "SURGERY"
                        ? selectedOption.Surgery_Id
                        : selectedOption.Procedure_Id
                      : "", // reset if not found
                  }));
                }}
                list="SurgeryProcedureList"
                required
              />

              <datalist id="SurgeryProcedureList">
                {Array.isArray(SurgeryData) &&
                  SurgeryData.map((item, index) => (
                    <option
                      key={index}
                      value={
                        formData.OperationMode === "SURGERY"
                          ? item.Surgery_Name
                          : item.Procedure_Name
                      }
                    />
                  ))}
              </datalist>
            </div>

            <div className="RegisForm_1">
              <label>
                Theatre Name<span>:</span>
              </label>
              <select
                name="OTName"
                // disabled={!Editoption}
                value={formData.OTName}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(TheatreData) &&
                  TheatreData.map((block, index) => (
                    <option key={index} value={block.id}>
                      {block.Theatrename}
                    </option>
                  ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Doctor Name<span>:</span>
              </label>
              <select
                name="doctorName"
                // disabled={!Editoption}
                value={formData.doctorName}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(DoctorData) &&
                  DoctorData.map((block, index) => (
                    <option key={index} value={block.id}>
                      {block.Name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Booking Date<span>:</span>
              </label>
              <input
                type="date"
                name="bookingDate"
                // disabled={!Editoption}
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Booking Time<span>:</span>
              </label>
              <input
                type="time"
                name="BookingTime"
                // disabled={!Editoption}
                value={formData.BookingTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Duration<span>:</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                // disabled={!Editoption}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Operation Type<span>:</span>
              </label>
              <select
                name="operationType"
                // disabled={!Editoption}
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
              <label>
                Priority<span>:</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                // disabled={!Editoption}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                PatientId<span>:</span>
              </label>
              <input
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                // disabled={!Editoption}
                list="PatientidList"
              />
              <datalist id="PatientidList">
                {Array.isArray(Patientiddata) &&
                  Patientiddata.map((f, i) => <option key={i} value={f.id} />)}
              </datalist>
            </div>
            <div className="RegisForm_1">
              <label>
                PatientName<span>:</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                // disabled={!Editoption}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Age<span>:</span>
              </label>
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
              <label>
                Gender<span>:</span>
              </label>
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
              <label>
                UHIDNO<span>:</span>
              </label>
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
          <br />

          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                Diagnosis<span>:</span>
              </label>
              <input
                type="text"
                name="Diagnosis"
                // disabled={!Editoption}
                value={formData.Diagnosis}
                onChange={handleChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Type<span>:</span>
              </label>
              <input
                type="text"
                name="Type"
                // disabled={!Editoption}
                value={formData.Type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Surgeon<span>:</span>
              </label>
              <input
                type="text"
                list="doctorList"
                name="Type"
                // disabled={!Editoption}
                value={surgeonInput} // controlled by formData
                onChange={(e) => setSurgeonInput(e.target.value)}
                required
              />

              <datalist id="doctorList">
                {(DoctorData || []).map((row, indx) => (
                  <option key={indx} value={row.Name} />
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddSurgeon}
              >
                <LoupeIcon />
              </button>
            </div>

            <div className="RegisForm_1">
              <label>
                Anaesthetist<span>:</span>
              </label>
              <input
                type="text"
                list="AnaesthetistList"
                name="Type"
                // disabled={!Editoption}
                value={anaesthetistInput}
                onChange={(e) => setAnaesthetistInput(e.target.value)}
                required
              />

              <datalist id="AnaesthetistList">
                {(DoctorData || []).map((row, indx) => (
                  <option key={indx} value={row.Name}>
                    {row.Name}
                  </option>
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddAnaesthetist}
              >
                <LoupeIcon />
              </button>
            </div>

            <div className="RegisForm_1">
              <label>
                ScrubNurse<span>:</span>
              </label>
              <input
                type="text"
                list="ScrubNurseList"
                name="Type"
                // disabled={!Editoption}
                value={scrubInput}
                onChange={(e) => setScrubInput(e.target.value)}
                required
              />

              <datalist id="ScrubNurseList">
                {(EmployeeData || []).map((row, indx) => (
                  <option key={indx} value={row.Name}>
                    {row.Name}
                  </option>
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddScrubNurse}
              >
                <LoupeIcon />
              </button>
            </div>
          </div>

          <div className="team-members-display" style={{ marginTop: "24px" }}>
            <h4
              style={{
                margin: "0 0 16px 0",
                color: "#333",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Selected Team Members
            </h4>

            {/* Surgeon */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Surgeon
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.Surgeon || []).length > 0 ? (
                  (formData.Surgeon || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #bbdefb",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveSurgeon(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#d32f2f",
                            fontSize: "18px",
                            cursor: "pointer",
                            padding: "0",
                            marginLeft: "4px",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No surgeon selected
                  </span>
                )}
              </div>
            </div>

            {/* Anaesthetist */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Anaesthetist
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.Anaesthetist || []).length > 0 ? (
                  (formData.Anaesthetist || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #c8e6c9",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveAnaesthetist(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#c62828",
                            fontSize: "18px",
                            cursor: "pointer",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No anaesthetist selected
                  </span>
                )}
              </div>
            </div>

            {/* Scrub Nurse */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Scrub Nurse
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.ScrubNurse || []).length > 0 ? (
                  (formData.ScrubNurse || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#fff3e0",
                        color: "#ef6c00",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #ffe0b2",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveScrubNurse(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#d84315",
                            fontSize: "18px",
                            cursor: "pointer",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No scrub nurse selected
                  </span>
                )}
              </div>
            </div>
          </div>

          <br />
          <div className="Main_container_Btn">
            <button
              // disabled={!Editoption}
              onClick={handleOriginalOPSubmit}
            >
              {formData.Booking_Id ? "Update" : "Save"}
            </button>
          </div>
        </>
      )}

      {viewType === "DummyOPOTRequest" && (
        <>
          <div className="RegisForm_12">
            <label>
              Patient Search <span>:</span>
            </label>
            <div className="Search_patient_icons">
              <input
                name="Search"
                list="PatientList"
                onChange={HandleSearchchange}
              />
              <datalist id="PatientList">
                {(OPPatientarr || []).length > 0 &&
                  (OPPatientarr || []).map((item, index) => (
                    <option key={index} value={item.PatientId || ""}>
                      {" "}
                      {item.FirstName ||  ""}{" "}
                      {item.PhoneNo || ""}
                    </option>
                  ))}
              </datalist>

              {patientsearch.Search && (
                <span
                  onClick={() => HandlesearchOPPatient(patientsearch.Search)}
                >
                  <PersonSearchIcon />
                </span>
              )}
            </div>
          </div>

          <br />

          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                ReqDate<span>:</span>
              </label>
              <input
                type="date"
                name="reqDate"
                // disabled={!Editoption}
                value={formData.reqDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                ReqTime<span>:</span>
              </label>
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
              <label>
                Booking Type<span>:</span>
              </label>
              <select
                name="bookingType"
                // disabled={!Editoption}
                value={formData.bookingType}
                onChange={handleChange}
              >
                <option value="IP">IP</option>
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Operation Mode<span>:</span>
              </label>
              <select
                name="OperationMode"
                // disabled={!Editoption}
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
              <label>
                Specialization<span>:</span>
              </label>
              <select
                name="specialization"
                // disabled={!Editoption}
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(specialityData) &&
                  specialityData.map((block, index) => (
                    <option key={index} value={block.Speciality_Id}>
                      {block.SpecialityName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="RegisForm_1">
              <label>
                {formData.OperationMode === "SURGERY"
                  ? "Surgery Name"
                  : "Procedure Name"}
                <span>:</span>
              </label>

              <input
                type="text"
                name="surgeryName"
                // disabled={!Editoption || !formData.OperationMode || !formData.specialization}
                value={typedSurgeryName}
                onChange={(e) => {
                  const value = e.target.value;
                  setTypedSurgeryName(value);

                  const selectedOption = SurgeryData.find(
                    (item) =>
                      (formData.OperationMode === "SURGERY"
                        ? item.Surgery_Name
                        : item.Procedure_Name) === value
                  );

                  setFormData((prev) => ({
                    ...prev,
                    surgeryName: selectedOption
                      ? formData.OperationMode === "SURGERY"
                        ? selectedOption.Surgery_Id
                        : selectedOption.Procedure_Id
                      : "", // reset if not found
                  }));
                }}
                list="SurgeryProcedureList"
                required
              />

              <datalist id="SurgeryProcedureList">
                {Array.isArray(SurgeryData) &&
                  SurgeryData.map((item, index) => (
                    <option
                      key={index}
                      value={
                        formData.OperationMode === "SURGERY"
                          ? item.Surgery_Name
                          : item.Procedure_Name
                      }
                    />
                  ))}
              </datalist>
            </div>

            <div className="RegisForm_1">
              <label>
                Theatre Name<span>:</span>
              </label>
              <select
                name="OTName"
                // disabled={!Editoption}
                value={formData.OTName}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(TheatreData) &&
                  TheatreData.map((block, index) => (
                    <option key={index} value={block.id}>
                      {block.Theatrename}
                    </option>
                  ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Doctor Name<span>:</span>
              </label>
              <select
                name="doctorName"
                // disabled={!Editoption}
                value={formData.doctorName}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {Array.isArray(DoctorData) &&
                  DoctorData.map((block, index) => (
                    <option key={index} value={block.id}>
                      {block.Name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Booking Date<span>:</span>
              </label>
              <input
                type="date"
                name="bookingDate"
                // disabled={!Editoption}
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Booking Time<span>:</span>
              </label>
              <input
                type="time"
                name="BookingTime"
                // disabled={!Editoption}
                value={formData.BookingTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Duration<span>:</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                // disabled={!Editoption}
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Operation Type<span>:</span>
              </label>
              <select
                name="operationType"
                // disabled={!Editoption}
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
              <label>
                Priority<span>:</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                // disabled={!Editoption}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                PatientId<span>:</span>
              </label>
              <input
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                // disabled={!Editoption}
                list="PatientidList"
              />
              <datalist id="PatientidList">
                {Array.isArray(Patientiddata) &&
                  Patientiddata.map((f, i) => <option key={i} value={f.id} />)}
              </datalist>
            </div>
            <div className="RegisForm_1">
              <label>
                PatientName<span>:</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                // disabled={!Editoption}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Age<span>:</span>
              </label>
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
              <label>
                Gender<span>:</span>
              </label>
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
              <label>
                UHIDNO<span>:</span>
              </label>
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
          <br />

          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                Diagnosis<span>:</span>
              </label>
              <input
                type="text"
                name="Diagnosis"
                // disabled={!Editoption}
                value={formData.Diagnosis}
                onChange={handleChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Type<span>:</span>
              </label>
              <input
                type="text"
                name="Type"
                // disabled={!Editoption}
                value={formData.Type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Surgeon<span>:</span>
              </label>
              <input
                type="text"
                list="doctorList"
                name="Type"
                // disabled={!Editoption}
                value={surgeonInput} // controlled by formData
                onChange={(e) => setSurgeonInput(e.target.value)}
                required
              />

              <datalist id="doctorList">
                {(DoctorData || []).map((row, indx) => (
                  <option key={indx} value={row.Name} />
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddSurgeon}
              >
                <LoupeIcon />
              </button>
            </div>

            <div className="RegisForm_1">
              <label>
                Anaesthetist<span>:</span>
              </label>
              <input
                type="text"
                list="AnaesthetistList"
                name="Type"
                // disabled={!Editoption}
                value={anaesthetistInput}
                onChange={(e) => setAnaesthetistInput(e.target.value)}
                required
              />

              <datalist id="AnaesthetistList">
                {(DoctorData || []).map((row, indx) => (
                  <option key={indx} value={row.Name}>
                    {row.Name}
                  </option>
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddAnaesthetist}
              >
                <LoupeIcon />
              </button>
            </div>

            <div className="RegisForm_1">
              <label>
                ScrubNurse<span>:</span>
              </label>
              <input
                type="text"
                list="ScrubNurseList"
                name="Type"
                // disabled={!Editoption}
                value={scrubInput}
                onChange={(e) => setScrubInput(e.target.value)}
                required
              />

              <datalist id="ScrubNurseList">
                {(EmployeeData || []).map((row, indx) => (
                  <option key={indx} value={row.Name}>
                    {row.Name}
                  </option>
                ))}
              </datalist>

              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={handleAddScrubNurse}
              >
                <LoupeIcon />
              </button>
            </div>
          </div>

          <div className="team-members-display" style={{ marginTop: "24px" }}>
            <h4
              style={{
                margin: "0 0 16px 0",
                color: "#333",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Selected Team Members
            </h4>

            {/* Surgeon */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Surgeon
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.Surgeon || []).length > 0 ? (
                  (formData.Surgeon || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #bbdefb",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveSurgeon(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#d32f2f",
                            fontSize: "18px",
                            cursor: "pointer",
                            padding: "0",
                            marginLeft: "4px",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No surgeon selected
                  </span>
                )}
              </div>
            </div>

            {/* Anaesthetist */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Anaesthetist
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.Anaesthetist || []).length > 0 ? (
                  (formData.Anaesthetist || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #c8e6c9",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveAnaesthetist(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#c62828",
                            fontSize: "18px",
                            cursor: "pointer",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No anaesthetist selected
                  </span>
                )}
              </div>
            </div>

            {/* Scrub Nurse */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                Scrub Nurse
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(formData.ScrubNurse || []).length > 0 ? (
                  (formData.ScrubNurse || []).map((doc, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#fff3e0",
                        color: "#ef6c00",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #ffe0b2",
                      }}
                    >
                      {doc}
                      {
                        <button
                          onClick={() => handleRemoveScrubNurse(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#d84315",
                            fontSize: "18px",
                            cursor: "pointer",
                            lineHeight: "1",
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      }
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    No scrub nurse selected
                  </span>
                )}
              </div>
            </div>
          </div>

          <br />
          <div className="Main_container_Btn">
            <button
              // disabled={!Editoption}
              onClick={handleDummyOPSubmit}
            >
              {formData.Booking_Id ? "Update" : "Save"}
            </button>
          </div>
        </>
      )}

      {viewType === "OTQuelist" && (
        <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
          <div className="RegisForm_1">
            <label>
              Date Type<span>:</span>
            </label>
            <select
              name="DateType"
              value={searchOptions.DateType}
              onChange={HandleOnchangeSearch}
            >
              <option value="Current">Current Date</option>
              <option value="Customize">Customize</option>
            </select>
          </div>

          {searchOptions.DateType === "Current" && (
            <div className="RegisForm_1">
              <label>
                Current Date<span>:</span>
              </label>
              <input
                type="date"
                name="CurrentDate"
                value={searchOptions.CurrentDate}
                onChange={HandleOnchangeSearch}
                readOnly
              />
            </div>
          )}

          {searchOptions.DateType === "Customize" && (
            <>
              <div className="RegisForm_1">
                <label>
                  From Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="FromDate"
                  value={searchOptions.FromDate}
                  onChange={HandleOnchangeSearch}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  To Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="ToDate"
                  value={searchOptions.ToDate}
                  onChange={HandleOnchangeSearch}
                  min={searchOptions.FromDate}
                />
              </div>
            </>
          )}

          <div
            className="Main_container_Btn"
            style={{ marginBottom: "15px", display: "flex", gap: "10px" }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={Theatrerequestdata.length === 0}
            >
              Print
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<GetAppIcon />}
              onClick={exportToExcel}
              disabled={Theatrerequestdata.length === 0}
            >
              Excel
            </Button>
          </div>

          <ReactGrid columns={BookingColumns} RowData={Theatrerequestdata} />

          <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
      )}

      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default MCIOTRequest;
