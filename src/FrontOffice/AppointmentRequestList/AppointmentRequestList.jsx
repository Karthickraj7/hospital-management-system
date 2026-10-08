import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { differenceInYears } from "date-fns";
import { useNavigate } from "react-router-dom";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { handleKeyDownPhoneNo } from "../../OtherComponent/OtherFunctions";
import { handleKeyDownTextRegistration } from "../../OtherComponent/OtherFunctions";
import axios from "axios";
import Months from "./Months";
import { useLocation } from "react-router-dom";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const AppointmentRequestList = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  // const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);

  const UserRecord = useSelector((state) => state.userRecord?.UserData);

  const isSidebarOpen = useSelector((state) => state.userRecord?.SidebarToggle);
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");

  const [SelectedLocations, setSelectedLocations] = useState(
    UserData?.location
  );
  const prevSelectedTimeRef = useRef();

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };
  // Function to format date as MM/DD/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [AppointmentRequestList, setAppointmentRequestList] = useState({
    AppointmentID: "",
    Title: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    Specialization: "",
    DoctorName: "",
    RequestDate: "",
    RequestTime: "",
    AppointmentType: "",
    VisitPurpose: "",
    ReferredBy: "",
  });
  const [ReScheduleEdit, setReScheduleEdit] = useState({
    RadioOption: "Date",
    RequestDate: "",
    ChangingReason: "",
    Specialization: "",
    DoctorName: "",
  });
  const [ReScheduleId, setReScheduleId] = useState("");
  const [RescheduleDocId, setRescheduleDocId] = useState("");

  const [selectedType, setSelectedType] = useState("Request");
  const [postdata, setPostData] = useState(null);

  const [AppointmentID, setAppointmentID] = useState(null);
  const [AppointmentRequestData, setAppointmentRequestData] = useState([]);
  console.log(AppointmentRequestData, "AppointmentRequestData");

  const [DoctorNameData, setDoctorNameData] = useState([]);
  const [SpecializationData, setSpecializationData] = useState([]);
  const [TitleNameData, setTitleNameData] = useState([]);

  const [AppointmentRequestGet, setAppointmentRequestGet] = useState(false);
  const [selectedpatientsforreschedule, setselectedpatientsforreschedule] =
    useState([]);
  const [CancelReason, setCancelReason] = useState("");
  const [CancelAppID, setCancelAppID] = useState("");
  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);
  const [RegPatientId, setRegPatientId] = useState(null);

  console.log(FilterbyPatientId, "FilterbyPatientId");
  console.log(RegPatientId, "RegPatientId");

  const [errors, setErrors] = useState({});
  const [selectedTime, setSelectedTime] = useState("");
  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  const [selectedDate, setselectedDate] = useState(TodayDate); // Set initial state to today's date
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [speciality, setSpeciality] = useState(null);
  const [doctorName, setDoctorName] = useState(null);
  const [DoctorDayData, setDoctorDayData] = useState([]);
  const [ReferralDoctorData, setReferralDoctorData] = useState([]);

  const [openModal2, setOpenModal2] = useState(false);
  const [OpenModalCancel, setOpenModalCancel] = useState(false);
  const [ShowModalReschedule, setShowModalReschedule] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [searchOptions, setSearchOptions] = useState({
    SearchbyDate: TodayDate,
    SearchbyFirstName: "",
    SearchbyPhoneNumber: "",
    SearchSpecialization: "",
    SearchDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "PENDING",
  });

  const handleSelectAll = (has) => {
    const checkboxesstoring = has.target.checkboxesstoring;
    // console.log(checkboxesstoring, "dsfnsdfsdaf1111");

    const updatedcheckboxes = AppointmentRequestData.map((has) => ({
      ...has,
      checked: !has.checked,
    }));
    setAppointmentRequestData(updatedcheckboxes);
    // console.log(updatedcheckboxes, "heleooeleo22222");
  };

  const handleRescheduleSelectedPatients = () => {
    const selectedpatients = AppointmentRequestData.filter(
      (has) => has.checked
    );
    if (selectedpatients === 0) {
      alert("Please select atleast one patient");
      return;
    }
    setShowModalReschedule(true);
    setselectedpatientsforreschedule(selectedpatients);
  };

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;

    console.log("90909", name, value);

    if (name === "SearchbyPhoneNumber") {
      if (value.length <= 10) {
        setSearchOptions((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  console.log("premkumar");
  useEffect(() => {
    console.log(location, "location");
    console.log("Premkumar");
    if (location.state) {
      const {
        patientid,
        patient_name,
        PhoneNo,
        Email,
        Doctorname,
        Followup_Date,
        title,
        fname,
        mname,
        lname,
        followupdate,
        VisitPurpose,
      } = location.state;

      setAppointmentRequestList({
        AppointmentID: "",
        Title: title,
        FirstName: fname,
        Specialization: "",
        MiddleName: mname,
        LastName: lname,
        PhoneNumber: PhoneNo,
        Email: Email,
        DoctorName: Doctorname,
        RequestDate: followupdate,
        AppointmentType: "",
        RequestTime: "",
        VisitPurpose: "followup", // Assuming VisitPurpose is always "FollowUp" for this case
      });
    }
  }, [location]);

  const HandleOnchange = (e) => {
    const { name, value, pattern } = e.target;
    const formattedValue = ["FirstName", "MiddleName", "LastName"].includes(
      name
    )
      ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      : value;

    const validateTimeFormat = (time) => {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d(\.\d{1,6})?)?$/;
      return timeRegex.test(time);
    };
    // Check length for specific fields
    if (
      ["FirstName", "MiddleName", "AliasName"].includes(name) &&
      value.length > 30
    ) {
      const tdata = {
        message: `${name} should not exceed 30 characters.`,
        type: "warn", // Ensure 'warn' is a valid type for your toast system
      };
      dispatchvalue({ type: "toast", value: tdata });
      return; // Exit early to prevent state update
    }

    if (name === "DOB") {
      let newDate = new Date();

      let oldDate = new Date(value);
      let age = differenceInYears(newDate, oldDate);
      setAppointmentRequestList((prevFormData) => ({
        ...prevFormData,
        [name]: formattedValue,
        Age: age,
      }));
    } else if (name === "PhoneNumber") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");

        if (convert.length <= 10) {
          setAppointmentRequestList((prev) => ({
            ...prev,
            [name]: convert[1].trim(),
            // PatientId: convert[0].trim(),
            FirstName: convert[0].trim(),
          }));
        }
      } else {
        if (formattedValue.length <= 10) {
          setAppointmentRequestList((prev) => ({
            ...prev,
            [name]: formattedValue,
          }));
        }
      }
    } else if (name === "FirstName") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");

        setAppointmentRequestList((prev) => ({
          ...prev,
          [name]: convert[0].trim(),
          // PatientId: convert[0].trim(),
          PhoneNumber: convert[1].trim(),
        }));
      } else {
        setAppointmentRequestList((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    } else if (name === "RequestTime") {
      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      setSelectedTime(formattedValue);

      if (!validateTimeFormat(formattedValue)) {
        const tdata = {
          message: "Invalid time format. Use HH:MM or HH:MM:SS.",
          type: "error",
        };
        dispatchvalue({ type: "toast", value: tdata });
        return; // Exit early if time format is invalid
      }
    } else if (name === "RequestDate") {
      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      setselectedDate(formattedValue);
    } else if (name === "DoctorName") {
      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      setSelectedDoctor(formattedValue);
      setDoctorName(formattedValue);
    } else if (name === "Specialization") {
      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      setSpeciality(formattedValue); // Update the selected speciality state
    } else {
      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
    const validateField = (value, pattern) => {
      if (!value) {
        return "Required";
      }
      if (pattern && !new RegExp(pattern).test(value)) {
        return "Invalid";
      } else {
        return "Valid";
      }
    };

    const error = validateField(value, pattern);
    console.log(error, "error");

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setAppointmentRequestList((prevData) => ({
        ...prevData,
        Title: "",
        FirstName: "",
        MiddleName: "",
        LastName: "",
        PhoneNumber: "",
        Email: "",
        Specialization: "",
        DoctorName: "",
        RequestTime: "",
        AppointmentType: "",
        VisitPurpose: "",
        ReferredBy: "",
      }));
    }

    console.log(value);
  };

  useEffect(() => {
    const today = formatDate(new Date());
    console.log("TodayDatee", today);

    if (!AppointmentRequestList.RequestDate) {
      setAppointmentRequestList((prev) => ({
        ...prev,
        RequestDate: today,
      }));
      // setselectedDate(today); // Set selectedDate to today's date
      console.log("RequestDate was empty, setting to today:", today);
    }

    setTodayDate(today);
  }, [AppointmentRequestList.RequestDate]);

  useEffect(() => {
    const postdata = {
      PhoneNo: AppointmentRequestList.PhoneNumber,
      FirstName: AppointmentRequestList.FirstName,
      DoctorId: AppointmentRequestList.DoctorID,
      patientsearch : searchQuery,

      // PatientId: AppointmentRequestList.PatientId,
    };
    axios
      .get(`${UrlLink}Frontoffice/Filter_Patients_using_Multiple_Criteria`, {
        params: postdata,
      })
      .then((res) => {
        const data = res.data;
        console.log(data, "dataaaaaaaaa");

        setFilterbyPatientId(data);
        // setRegPatientId(data.PatientId,'yyyyyyyyyyyyyyyyyyyyy');
        axios
          .get(`${UrlLink}Frontoffice/get_patient_visit_details`, {
            params: postdata,
          })
          .then((res) => {
            const visit = res.data?.VisitPurpose;
            setAppointmentRequestList((prev) => ({
              ...prev,
              VisitPurpose: visit,
            }));
            if (UserData && UserData.location) {
              setSelectedLocations(UserData.location);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    UrlLink,
    AppointmentRequestList.PhoneNumber,
    AppointmentRequestList.FirstName,
    AppointmentRequestList.DoctorID,
    searchQuery
  ]);

  // const HandlesearchPatient = (value) => {
  //   const exist = FilterbyPatientId.find((f) => f.PatientId === value);
  //   if (!exist) {
  //     const tdata = {
  //       message: "Please enter a valid Patient Id",
  //       type: "warn",
  //     };
  //     dispatchvalue({ type: "toast", value: tdata });

  //     console.log(tdata,'tdata');

  //   } else {
  //     axios
  //       .get(
  //         `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${value}`
  //       )
  //       .then((res) => {
  //         const resss = res.data;
  //         console.log("paaatttttttttt", res.data);

  //         setAppointmentRequestList((prev) => ({
  //           ...prev,
  //           // PatientId: resss.PatientId,
  //           Title: resss.Title,
  //           FirstName: resss.FirstName,
  //           MiddleName: resss.MiddleName,
  //           LastName: resss.LastName,
  //           PhoneNumber: resss.PhoneNumber,
  //           Email: resss.Email,

  //         }))
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  //   const HandlesearchPatient = () => {
  //     console.log("Search triggered for:", searchQuery);

  //     const queryParts = searchQuery.toLowerCase().split(" ").filter(Boolean);

  //     const patient = FilterbyPatientId.find(patient => {
  //         const firstName = patient.FirstName.toLowerCase();
  //         const middleName = patient.MiddleName?.toLowerCase() || '';
  //         const surName = patient.SurName?.toLowerCase() || '';

  //         return queryParts.every(part =>
  //             firstName.includes(part) ||
  //             middleName.includes(part) ||
  //             surName.includes(part) ||
  //             patient.PatientId === searchQuery ||
  //             String(patient.PhoneNo) === searchQuery
  //         );
  //     });

  //     if (patient) {
  //         // setSelectedPatient(patient);

  //         axios.get(`${UrlLink}Frontoffice/get_Patient_Details_by_patientId`, {
  //             params: {
  //                 PatientId: patient.PatientId
  //             }
  //         })
  //         .then((res) => {
  //             const data = res.data;
  //             console.log(data, 'Patient Data');

  //             setAppointmentRequestList((prev) => ({
  //                 ...prev,
  //                 Title: data.Title,
  //                 FirstName: data.FirstName,
  //                 MiddleName: data.MiddleName,
  //                 LastName: data.SurName,
  //                 PhoneNumber: data.PhoneNo,
  //                 Email: data.Email,

  //                 // PatientName: `${data.FirstName} ${data.MiddleName || ''} ${data.SurName || ''}`.trim(),
  //                 // PatientId: data.PatientId,
  //                 // MobileNo: data.PhoneNo,
  //                 // Gender: data.Gender,
  //                 // Age: data.Age,
  //                 // AadharNo: data.UniqueIdType === 'Aadhar' ? data.UniqueIdNo : '',
  //                 // PatientAddress: `${data.DoorNo || ''} ${data.Street || ''}, ${data.Area || ''}, ${data.City || ''}, ${data.State || ''}, ${data.Country || ''} - ${data.Pincode || ''}`,

  //               }));

  //             setRegPatientId(data);
  //             // setRegPatientId({ PatientId: data.PatientId },'yyyyyyyyyyyyyyyyyyyyy');
  //             const postdata = {
  //               PatientId: data.PatientId,
  //               PhoneNo: data.PhoneNo,
  //               FirstName: data.FirstName,
  //               // DoctorId: data.DoctorID,
  //               DoctorId: AppointmentRequestList.DoctorName,
  //               Speciality: AppointmentRequestList.Specialization,
  //             };

  //             console.log(postdata,'postdata');

  //             axios
  //               .get(`${UrlLink}Frontoffice/get_patient_visit_details`, {
  //                 params: postdata,
  //               })
  //               .then((res) => {
  //                 const visit = res.data?.VisitPurpose;
  //                 console.log(visit,'visitttttttttt');

  //                 setAppointmentRequestList((prev) => ({
  //                   ...prev,
  //                   VisitPurpose: visit,
  //                 }));
  //                 if (UserData && UserData.location) {
  //                   setSelectedLocations(UserData.location);
  //                 }
  //               })
  //               .catch((err) => {
  //                 console.log(err);
  //               });
  //         })
  //         .catch((err) => {
  //             console.error("Error fetching patient details:", err);
  //         });
  //     } else {
  //         console.warn("No patient found for the search query:", searchQuery);
  //         // setSelectedPatient(null);
  //     }
  // };

  const HandlesearchPatient = () => {
    console.log("Search triggered for:", searchQuery);

    const queryParts = searchQuery.toLowerCase().split(" ").filter(Boolean);

    const patient = FilterbyPatientId.find((patient) => {
      const firstName = patient.FirstName.toLowerCase();
      const middleName = patient.MiddleName?.toLowerCase() || "";
      const surName = patient.SurName?.toLowerCase() || "";

      return queryParts.every(
        (part) =>
          firstName.includes(part) ||
          middleName.includes(part) ||
          surName.includes(part) ||
          patient.PatientId === searchQuery ||
          String(patient.PhoneNo) === searchQuery
      );
    });

    if (patient) {
      axios
        .get(`${UrlLink}Frontoffice/get_Patient_Details_by_patientId`, {
          params: { PatientId: patient.PatientId },
        })
        .then((res) => {
          const data = res.data;
          console.log(data, "Patient Data");

          console.log(data?.warn, "warn");
          if (data?.warn) {
            console.log("Warning Message Found:", data.warn);
            const tdata = {
              message: data.warn,
              type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
          }
          setAppointmentRequestList((prev) => ({
            ...prev,
            Title: data.Title,
            FirstName: data.FirstName,
            MiddleName: data.MiddleName,
            LastName: data.SurName,
            PhoneNumber: data.PhoneNo,
            Email: data.Email,
          }));

          setRegPatientId(data);

          const newPostData = {
            PatientId: data.PatientId,
            PhoneNo: data.PhoneNo,
            FirstName: data.FirstName,
          };

          console.log(newPostData, "postdata");
          setPostData(newPostData); // Set postdata to trigger the useEffect
        })
        .catch((err) => {
          console.error("Error fetching patient details:", err);
        });
    } else {
      console.warn("No patient found for the search query:", searchQuery);
    }
  };

  useEffect(() => {
    if (postdata && doctorName && speciality) {
      const data = {
        ...postdata,
        DoctorId: doctorName,
        Speciality: speciality,
      };
      console.log("Updated postdata with doctor and speciality:", data);
      axios
        .get(`${UrlLink}Frontoffice/get_patient_visit_details`, {
          params: data,
        })
        .then((res) => {
          const visit = res.data?.VisitPurpose;
          console.log(visit, "visitttttttttt");

          setAppointmentRequestList((prev) => ({
            ...prev,
            VisitPurpose: visit,
          }));

          if (UserData && UserData.location) {
            setSelectedLocations(UserData.location);
          }
        })
        .catch((err) => {
          console.error("Error fetching visit details:", err);
        });
    }
  }, [postdata, doctorName, speciality, UserData]);

  useEffect(() => {
    if (UserData && UserData.location && selectedDoctor && selectedDate) {
      axios
        .get(`${UrlLink}Frontoffice/calender_modal_display_data_by_day`, {
          params: {
            DoctorId: selectedDoctor,
            LocationId: UserData.location,
            Date: selectedDate,
          },
        })
        .then((response) => {
          const res = response.data;
          setDoctorDayData(res);
        })
        .catch((err) => {
          console.error("Error fetching filtered data:", err);
        });
    }
  }, [UrlLink, UserData.location, selectedDate, selectedDoctor]);

  // useEffect(() => {
  //   if (UserData && UserData.location && selectedDoctor && selectedDate) {
  //     axios
  //       .get(`${UrlLink}Frontoffice/calender_modal_display_data_by_day`, {
  //         params: {
  //           DoctorId: selectedDoctor,
  //           LocationId: UserData.location,
  //           Date: RequestDate,
  //         },
  //       })
  //       .then((response) => {
  //         const res = response.data;
  //         setDoctorDayData(res);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching filtered data:", err);
  //       });
  //   }
  // }, [UrlLink, UserData.location, RequestDate, selectedDoctor]);

  useEffect(() => {
    let doctor_schedule = DoctorDayData?.schedule?.[0];
    console.log("RequestDateeeandTimww", doctor_schedule);

    const prevSelectedTime = prevSelectedTimeRef.current;
    console.log("RequestDateeeandTimww", prevSelectedTime);

    // Update the previous selected time reference
    prevSelectedTimeRef.current = selectedTime;

    // If selectedTime hasn't changed, do nothing
    if (prevSelectedTime === selectedTime) {
      console.log("time is not changes");
    }
    if (
      doctor_schedule?.working === "yes" &&
      doctor_schedule?.shift === "Single" &&
      selectedTime
    ) {
      const startTime = doctor_schedule.starting_time;
      const endTime = doctor_schedule.ending_time;

      console.log("RequestDateee", startTime, endTime);

      // Convert times to Date objects
      const startTimeDate = new Date(`1970-01-01T${startTime}Z`);
      const endTimeDate = new Date(`1970-01-01T${endTime}Z`);
      const selectedTimeDate = new Date(`1970-01-01T${selectedTime}Z`); // Assuming selectedTime is in "HH:mm:ss" format

      // Check if selectedTime is within the range
      if (
        selectedTimeDate >= startTimeDate &&
        selectedTimeDate <= endTimeDate
      ) {
        const tdata = {
          message: `The Doctor is Available in the Selected Requested Time`,
          type: "success",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const tdata = {
          message: `The Doctor is not Available in the Selected Requested Time, Available in ${startTime} to ${endTime}`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else if (
      doctor_schedule?.working === "yes" &&
      doctor_schedule?.shift === "Double" &&
      selectedTime
    ) {
      const startTime_f = doctor_schedule.starting_time_f;
      const endTime_f = doctor_schedule.ending_time_f;
      const startTime_a = doctor_schedule.starting_time_a;
      const endTime_a = doctor_schedule.ending_time_a;

      // Convert times to Date objects
      const startTimeDate_f = new Date(`1970-01-01T${startTime_f}Z`);
      const endTimeDate_f = new Date(`1970-01-01T${endTime_f}Z`);
      const startTimeDate_a = new Date(`1970-01-01T${startTime_a}Z`);
      const endTimeDate_a = new Date(`1970-01-01T${endTime_a}Z`);
      const selectedTimeDate = new Date(`1970-01-01T${selectedTime}Z`); // Assuming selectedTime is in "HH:mm:ss" format
      if (
        (selectedTimeDate >= startTimeDate_f &&
          selectedTimeDate <= endTimeDate_f) ||
        (selectedTimeDate >= startTimeDate_a &&
          selectedTimeDate <= endTimeDate_a)
      ) {
        const tdata = {
          message: `The Doctor is Available in the Selected Requested Time`,
          type: "success",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const tdata = {
          message: `The Doctor is not Available in the Selected Requested Time, Available in FN : ${startTime_f} to ${endTime_f} or AN  ${startTime_a} to ${endTime_a}`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else if (doctor_schedule?.working === "no") {
      const tdata = {
        message: `The Doctor is not Available in the Selected Date`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  }, [DoctorDayData, selectedTime, dispatchvalue]);

  // Utility function to apply conditional row styling
  const getRowStyle = (row) =>
    row.ReScheduled === "Yes" ? { color: "blue" } : {};

  // Define the columns without the UserRegister column
  const baseAppointmentRequestColumns = [
    {
      key: "id",
      name: "Appointment ID",
      frozen: true,
      renderCell: (params) => (
        <span style={getRowStyle(params.row)}>{params.row.id}</span>
      ),
    },
    {
      key: "FirstName",
      name: "First Name",
      frozen: true,
      renderCell: (params) => (
        <span style={getRowStyle(params.row)}>{params.row.FirstName}</span>
      ),
    },
    // {
    //   key: "MiddleName",
    //   name: "Middle Name",
    //   renderCell: (params) => (
    //     <span style={getRowStyle(params.row)}>{params.row.MiddleName}</span>
    //   ),
    // },
    // {
    //   key: "LastName",
    //   name: "Last Name",
    //   renderCell: (params) => (
    //     <span style={getRowStyle(params.row)}>{params.row.LastName}</span>
    //   ),
    // },
    {
      key: "PhoneNumber",
      name: "Phone Number",
      frozen: true,
      renderCell: (params) => (
        <span style={getRowStyle(params.row)}>{params.row.PhoneNumber}</span>
      ),
    },
    // {
    //   key: "Email",
    //   name: "Email",
    //   renderCell: (params) => (
    //     <span style={getRowStyle(params.row)}>{params.row.Email}</span>
    //   ),
    // },
    {
      key: "RequestDate",
      name: "Request Date",
      renderCell: (params) => (
        <span style={getRowStyle(params.row)}>{params.row.RequestDate}</span>
      ),
    },
    {
      key: "RequestTime",
      name: "Request Time",
      renderCell: (params) => (
        <span style={getRowStyle(params.row)}>{params.row.RequestTime}</span>
      ),
    },
    // {
    //   key: "AppointmentType",
    //   name: "Appointment Type",
    //   renderCell: (params) => (
    //     <span style={getRowStyle(params.row)}>
    //       {params.row.AppointmentType}
    //     </span>
    //   ),
    // },
    {
      key: "VisitPurpose",
      name: "Appointment Purpose",
      renderCell: (params) => (
        <span style={getRowStyle(params.row)}>{params.row.VisitPurpose}</span>
      ),
    },
    // {
    //   key: "SpecializationName",
    //   name: "Specialization",
    //   renderCell: (params) => (
    //     <span style={getRowStyle(params.row)}>
    //       {params.row.SpecializationName}
    //     </span>
    //   ),
    // },
    {
      key: "DoctorName",
      name: "Doctor Name",
      renderCell: (params) => (
        <span style={getRowStyle(params.row)}>{params.row.DoctorName}</span>
      ),
    },
  ];

  // Add the UserRegister column conditionally if searchStatus is PENDING
  const AppointmentRequestColumns =
    searchOptions.SearchStatus === "PENDING"
      ? [
          ...baseAppointmentRequestColumns,
          {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
              <Button
                className="cell_btn"
                onClick={() => handleeditAppointmentRequest(params.row)}
              >
                <EditIcon className="check_box_clrr_cancell" />
              </Button>
            ),
          },
          // {
          //   key: "Reshedule",
          //   name: "Re-Schedule",
          //   renderCell: (params) => (
          //     <Button
          //       className="cell_btn"
          //       onClick={() => handleAppointmentReschedule(params.row)}
          //     >
          //       <UpdateIcon className="check_box_clrr_cancell" />
          //     </Button>
          //   ),
          // },
          // {
          //   key:"checkbox",
          //   name:"checkbox",
          //   renderCell:(params) => () => (
          //     <input
          //       type="checkbox"
          //       checked={params.row.checked}
          //       onchange={() => handleCheckboxChange(params.row.id)}
          //       onClick={() => handleCheckboxChange(params.row.id)}
          //     />
          //   )
          // },
          // {
          //   key: "checkbox",
          //   name: "Checkbox",
          //   renderCell: (params) => (
          //     <input
          //       type="checkbox"
          //       checked={params.row.checked}
          //       onChange={() => handleCheckboxChange(params.row.id)}
          //     />
          //   ),
          // },
          {
            key: "checkbox",
            name: (
              <input
                type="checkbox" // this is the "Select All" checkbox in the column header
                onChange={handleSelectAll}
                checked={
                  AppointmentRequestData.length > 0 &&
                  AppointmentRequestData.every((row) => row.checked)
                }
              />
            ),
            renderCell: (params) => (
              <input
                type="checkbox" // this is the checkbox for each individual row
                checked={params.row.checked}
                onChange={() => handleCheckboxChange(params.row.id)}
              />
            ),
          },

          {
            key: "Cancel",
            name: "Cancel",
            renderCell: (params) => (
              <Button
                className="cell_btn"
                onClick={() => handleCancelAppointmentRequest(params.row)}
              >
                <CancelIcon className="check_box_clrr_cancell" />
              </Button>
            ),
          },
          {
            key: "UserRegister",
            name: "Action",
            renderCell: (params) => (
              <Button
                className="cell_btn"
                onClick={() => handleAppRegister(params.row)}
              >
                <ArrowForwardIcon className="check_box_clrr_cancell" />
              </Button>
            ),
          },
        ]
      : searchOptions.SearchStatus === "CANCELLED"
      ? [
          ...baseAppointmentRequestColumns,
          {
            key: "cancelReason",
            name: "Cancel Reason",
            renderCell: (params) => (
              <span style={getRowStyle(params.row)}>
                {params.row.cancelReason}
              </span>
            ),
          },
        ]
      : baseAppointmentRequestColumns;

  const handleeditAppointmentRequest = (params) => {
    setSelectedType("Request");
    const { id, DoctorID, SpecializationId, ...rest } = params;

    setAppointmentRequestList((prev) => ({
      ...prev,
      AppointmentID: id,
      DoctorName: DoctorID,
      Specialization: SpecializationId, // Ensure this is populated with the Specialization ID or Name correctly
      Title: rest.TitleId,
      FirstName: rest.FirstName,
      MiddleName: rest.MiddleName,
      LastName: rest.LastName,
      PhoneNumber: rest.PhoneNumber,
      Email: rest.Email,
      RequestDate: rest.RequestDate,
      AppointmentType: rest.AppointmentType,
      RequestTime: rest.RequestTime,
      VisitPurpose: rest.VisitPurpose,
      ReferredBy: rest.referaldoctorid,
    }));
    setSelectedDoctor(DoctorID);
  };

  const handleCheckboxChange = (params) => {
    const updatedData = AppointmentRequestData.map((row) => {
      if (row.id === params) {
        return {
          ...row,
          checked: !row.checked,
        };
      }
      return row;
    });
    setAppointmentRequestData(updatedData);
  };

  const handleCancelAppointmentRequest = (params) => {
    console.log("cancelAppp", params);
    setCancelAppID(params.id);
    setOpenModalCancel(true);
  };

  // const handleAppointmentReschedule = (params) => {
  //   setShowModalReschedule(true);
  //   setReScheduleId(params.id);
  //   setRescheduleDocId(params.DoctorID);
  // };

  const handleAppRegister = (params) => {
    console.log("paraaammaaaa", params);

    if (params.FirstName && params.PhoneNumber) {
      axios
        .get(
          `${UrlLink}Frontoffice/get_appointment_check?FirstName=${params.FirstName}&PhoneNo=${params.PhoneNumber}`
        )
        .then((res) => {
          const data = res.data;
          console.log("Dataaa", data);
          if (data.success === "OP") {
            dispatchvalue({
              type: "Registeredit",
              value: {
                appconversion: true,
                Type: "OP",
                ...params,
                ...RegPatientId,
                ...AppointmentRequestData,
              },
              // value: { appconversion: true, Type: "OP",...params, PatientId : RegPatientId?.PatientId || null },
            });
            dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
            navigate("/Home/FrontOfficeFolder");
            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });
          } else if (data.success === "Master") {
            dispatchvalue({
              type: "Registeredit",
              value: { appconversion: true, Type: "OP", ...params },
            });
            dispatchvalue({ type: "HrFolder", value: "NewBasicRegistation" });
            navigate("/Home/FrontOfficeFolder");
            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });
          }
        });
    }
    console.log("params", params);
  };

  const handleCancelReason = () => {
    const updatedApp = {
      AppointmentID: CancelAppID,
      CancelReason: CancelReason,
      CreatedBy: UserData?.username,
    };
    axios
      .post(`${UrlLink}Frontoffice/Appointment_Request_Cancel`, updatedApp)
      .then((response) => {
        const resData = response.data;
        const mess = Object.values(resData)[0];
        const typp = Object.keys(resData)[0];
        console.log("submit data:", response.data);
        console.log("submit data:", resData);
        const tdata = {
          message: mess,
          type: typp,
        };

        dispatchvalue({ type: "toast", value: tdata });
        setCancelReason("");
        setCancelAppID("");
        handleCloseModal();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const handleDateChange = (e) => {
  //   const { name, value } = e.target;
  //   setReScheduleEdit((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  //   // setRequestDate(value)

  //   // if (ReScheduleEdit.RequestDate) {
  //   //   let doctor_schedule = DoctorDayData?.schedule?.[0];
  //   //   console.log("RequestResc", doctor_schedule);

  //   // }
  // };

  const handleDocChange = (e) => {
    const { name, value } = e.target;
    if (ReScheduleEdit.RadioOption === "Date" && name === "RequestDate") {
      setReScheduleEdit((prev) => ({
        ...prev,
        [name]: value,
      }));
      const FilteredAppData = AppointmentRequestData.filter(
        (row) => row.id === ReScheduleId
      );
      console.log("FilteredApp", FilteredAppData);
      axios
        .get(`${UrlLink}Frontoffice/calender_modal_display_data_by_day`, {
          params: {
            DoctorId: FilteredAppData?.[0]?.DoctorID,
            LocationId: UserData.location,
            Date: value,
          },
        })
        .then((response) => {
          const res = response.data;
          setDoctorDayData(res);
          console.log("DocccccData", res);
        })
        .catch((err) => {
          console.error("Error fetching filtered data:", err);
        });
    }
    if (ReScheduleEdit.RadioOption === "Doctor") {
      const FilteredAppData = AppointmentRequestData.filter(
        (row) => row.id === ReScheduleId
      );
      console.log("FilteredApp", FilteredAppData);
      setReScheduleEdit((prev) => ({
        ...prev,
        [name]: value,
      }));
      axios
        .get(`${UrlLink}Frontoffice/calender_modal_display_data_by_day`, {
          params: {
            DoctorId: value,
            LocationId: UserData.location,
            Date: FilteredAppData?.[0]?.RequestDate,
          },
        })
        .then((response) => {
          const res = response.data;
          console.log("DocccccData", res);

          if (res?.schedule?.[0]?.working === "no") {
            const tdata = {
              message: `The Doctor is not Available in the Requested Date`,
              type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
          }
        })
        .catch((err) => {
          console.error("Error fetching filtered data:", err);
        });
    }
  };

  // const handleReschedule = () => {
  //   const updatedReschedule = {
  //     ...ReScheduleEdit,
  //     AppointmentId: ReScheduleId,
  //     CreatedBy: UserData?.username,
  //   };
  //   axios
  //     .post(
  //       `${UrlLink}Frontoffice/Appointment_Reschedule_List`,
  //       updatedReschedule
  //     )
  //     .then((response) => {
  //       const ress = response.data;
  //       const mess = Object.values(ress)[0];
  //       const typp = Object.keys(ress)[0];
  //       console.log("submit data", ress);
  //       console.log("submit data", updatedReschedule);

  //       const tdata = {
  //         message: mess,
  //         type: typp,
  //       };
  //       dispatchvalue({ type: "toast", value: tdata });
  //       setReScheduleEdit({
  //         RadioOption: "Date",
  //         RequestDate: "",
  //         CancelReason: "",
  //         Specialization: "",
  //         DoctorName: "",
  //       });
  //       handleCloseModal();
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  const handleReschedule = () => {
    if (
      !selectedpatientsforreschedule ||
      selectedpatientsforreschedule.length === 0
    ) {
      alert("No patients selected for reschedule.");
      return;
    }

    console.log(
      "selectedpatientsforreschedule----0???",
      selectedpatientsforreschedule
    );

    selectedpatientsforreschedule.forEach((patient) => {
      const updatedReschedule = {
        ...ReScheduleEdit,
        AppointmentId: patient.id,
        CreatedBy: UserData?.username,
      };

      console.log("meee-----0000", updatedReschedule);

      axios
        .post(
          `${UrlLink}Frontoffice/Appointment_Reschedule_List`,
          updatedReschedule
        )
        .then((response) => {
          const ress = response.data;
          const mess = Object.values(ress)[0];
          const typp = Object.keys(ress)[0];

          dispatchvalue({
            type: "toast",
            value: {
              message: mess,
              type: typp,
            },
          });
        })
        .catch((e) => {
          console.error("Reschedule error for ID:", patient.id, e);
        });
    });

    // Reset and close modal after all requests
    setReScheduleEdit({
      RadioOption: "Date",
      RequestDate: "",
      CancelReason: "",
      Specialization: "",
      DoctorName: "",
    });
    handleCloseModal();
  };

  const handleAppointmentRequestSubmit = () => {
    // const exist = Object.keys(AppointmentRequestList)
    //   .filter((p) => p !== "AppointmentID", p !== "AppointmentID")
    //   .filter((p) => !AppointmentRequestList[p]);
    const updatedAppointmentRequest = {
      ...AppointmentRequestList,
      Location: UserRecord?.location,
      CreatedBy: UserRecord?.username,
      PatientId: RegPatientId?.PatientId || null,
      RequestTime: AppointmentRequestList.RequestTime || "00:00",
    };
    console.log("submit datauppp:", updatedAppointmentRequest);

    axios
      .post(
        `${UrlLink}Frontoffice/Appointment_Request_List_Link`,
        updatedAppointmentRequest
      )
      .then((response) => {
        const resData = response.data;
        const mess = Object.values(resData)[0];
        const typp = Object.keys(resData)[0];
        console.log("submit data:", response.data);
        console.log("submit data:", resData);
        const tdata = {
          message: mess,
          type: typp,
        };

        dispatchvalue({ type: "toast", value: tdata });
        setAppointmentRequestGet((prev) => !prev);
        setAppointmentRequestList({
          AppointmentID: "",
          Title: "",
          FirstName: "",
          MiddleName: "",
          LastName: "",
          PhoneNumber: "",
          Email: "",
          Specialization: "",
          DoctorName: "",
          RequestDate: "",
          RequestTime: "",
          AppointmentType: "",
          VisitPurpose: "",
          ReferredBy: "",
        });
        setselectedDate("");
        setSelectedTime("");
        setSearchQuery("");
        setErrors({});
        fetchAppointmentIDCount();
        // dispatchvalue({ type: "HrFolder", value: "PatientRegisterList" });

        // navigate("/Home/FrontOfficeFolder");
        // dispatchvalue({ type: "setPreviousFolder", value: null });
        // dispatchvalue({ type: "showMenu", value: true });

        // GoogleStyleCalendar
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (searchOptions) {
      axios
        .get(`${UrlLink}Frontoffice/get_all_appointments`, {
          params: searchOptions,
        })
        .then((response) => {
          const ress = response.data;
          console.log("111111111111111111111");

          console.log("Response data1111111111111:", ress);
          setAppointmentRequestData(ress);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [
    searchOptions,
    UrlLink,
    AppointmentRequestGet,
    // CancelReason,
    // ReScheduleEdit,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          // specializationResponse,
          referralDoctorResponse,
        ] = await Promise.all([
          // axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
          axios.get(`${UrlLink}Masters/get_referral_doctor_Name_Detials`),
        ]);

        // setSpecializationData(
        //   Array.isArray(specializationResponse.data)
        //     ? specializationResponse.data
        //     : []
        // )
        setReferralDoctorData(
          Array.isArray(referralDoctorResponse.data)
            ? referralDoctorResponse.data
            : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [UrlLink]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specializationResponse] = await Promise.all([
          axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
        ]);
        setSpecializationData(specializationResponse.data);
        console.log(specializationResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Title_Master_link`)
      .then((res) => {
        const ress = res.data;
        console.log("1111", ress);
        setTitleNameData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    if (
      (AppointmentRequestList?.Specialization ||
        searchOptions?.SearchSpecialization) &&
      UrlLink
    ) {
      let Specialization =
        AppointmentRequestList?.Specialization ||
        searchOptions.SearchSpecialization;

      axios
        .get(
          `${UrlLink}Masters/get_Doctor_by_Speciality_Detials?Speciality=${Specialization}`
        )
        .then((reponse) => {
          let data = reponse.data;

          if (data && Array.isArray(data) && data.length !== 0) {
            setDoctorNameData(data);
          }

          console.log("llllll", data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setDoctorNameData([]);
    }
  }, [
    UrlLink,
    AppointmentRequestList?.Specialization,
    searchOptions?.SearchSpecialization,
  ]);

  useEffect(() => {
    if (ReScheduleEdit?.Specialization && UrlLink) {
      axios
        .get(
          `${UrlLink}Masters/get_Doctor_by_Speciality_Detials?Speciality=${ReScheduleEdit.Specialization}`
        )
        .then((reponse) => {
          let data = reponse.data;
          setDoctorNameData(data);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, ReScheduleEdit.Specialization]);

  const fetchAppointmentIDCount = useCallback(() => {
    axios
      .get(`${UrlLink}Frontoffice/appointment_request_count_today`)
      .then((response) => {
        const count = response.data.count;
        setAppointmentID(count);
      })
      .catch((error) => {
        console.error("Error fetching appointment ID count:", error);
      });
  }, [UrlLink, AppointmentID]);
  useEffect(() => {
    fetchAppointmentIDCount();
  }, [fetchAppointmentIDCount, AppointmentID]);

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
    setOpenModal2(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setOpenModalCancel(false);
    setShowModalReschedule(false);
    setReScheduleEdit({
      RadioOption: "Date",
      RequestDate: "",
      ChangingReason: "",
      Specialization: "",
      DoctorName: "",
    });
  };

  const handleSelectChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <>
      <div className="Main_container_app">
        <div className="RegisterTypecon  navchange">
          <div className="RegisterType">
            {["Request", "List"].map((p, ind) => (
              <div className="registertypeval" key={ind + "key"}>
                <input
                  type="radio"
                  id={p}
                  name="appointment_type"
                  checked={selectedType === p}
                  onChange={handleSelectChange}
                  value={p}
                />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </div>
        </div>

        {selectedType === "Request" ? (
          <>
            <h3 style={{ display: "flex", justifyContent: "space-between" }}>
              Request No {AppointmentID}
              <Button
                className="cell_btn"
                onClick={() => openModal("calendar")}
              >
                <CalendarMonthIcon />
              </Button>
            </h3>
            <br />

            <div className="RegisFormcon" id="RegisFormcon_11">
              <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                  <label>
                    {" "}
                    Search Here <span>:</span>{" "}
                  </label>
                  <input
                    list="patients" // Link input to the datalist
                    type="text"
                    placeholder="Enter PatientId, PatientName, or Phone Number"
                    value={searchQuery}
                    onChange={handleChange} // Update the search query
                    onKeyDown={(e) =>
                      e.key === "Enter" && HandlesearchPatient()
                    } // Trigger search on Enter
                  />
                  <datalist id="patients">
                    {" "}
                    {/* Add an id to link with the input */}
                    {FilterbyPatientId.map((row, indx) => (
                      <option key={indx} value={row.FirstName}>
                        {`${row.PatientId} |${row.PhoneNo} | ${row.FirstName} | ${row.MiddleName} | ${row.SurName}`}{" "}
                        {/* Display PhoneNo and FirstName */}
                      </option>
                    ))}
                  </datalist>

                  <span>
                    <PersonSearchIcon onClick={HandlesearchPatient} />{" "}
                    {/* Call the search function on icon click */}
                  </span>
                </div>
              </div>

              {Object.keys(AppointmentRequestList)
                .filter(
                  (fields) =>
                    fields !== "AppointmentID" && fields !== "DoctorID"
                )
                .map((field, index) => (
                  <div className="RegisForm_1" key={index}>
                    <label htmlFor={`${field}_${index}`}>
                      {field === "VisutPurpose"
                        ? "Visit Type"
                        : formatLabel(field)}
                      <span>:</span>
                    </label>
                    {[
                      "Title",
                      "AppointmentType",
                      "Specialization",
                      "DoctorName",
                      "ReferredBy",
                    ].includes(field) ? (
                      <select
                        id={`${field}_${index}`}
                        name={field}
                        value={AppointmentRequestList[field]}
                        onChange={HandleOnchange}
                      >
                        <option value="">Select</option>
                        {field === "Title" &&
                          TitleNameData.map((row, indx) => (
                            <option key={indx} value={row.id}>
                              {row.Title}
                            </option>
                          ))}
                        {field === "AppointmentType" &&
                          ["Call", "Walk In"].map((row, indx) => (
                            <option key={indx} value={row}>
                              {row}
                            </option>
                          ))}
                        {/* {field === "VisitPurpose" &&
                      ["NewConsultation", "FollowUp"].map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))} */}
                        {field === "Specialization" &&
                          SpecializationData.filter(
                            (p) => p.Status === "Active"
                          ).map((p, indx) => (
                            <option key={indx} value={p.id}>
                              {p.SpecialityName}
                            </option>
                          ))}
                        {field === "DoctorName" &&
                          Array.isArray(DoctorNameData) &&
                          DoctorNameData.map((p, indx) => (
                            <option key={indx} value={p.id}>
                              {p.ShortName}
                            </option>
                          ))}
                        {field === "ReferredBy" &&
                          Array.isArray(ReferralDoctorData) &&
                          ReferralDoctorData.map((row, indx) => (
                            <option key={indx} value={row.id}>
                              {row.ShortName}
                            </option>
                          ))}
                      </select>
                    ) : [
                        "FirstName",
                        "MiddleName",
                        "LastName",
                        "PhoneNumber",
                        "VisitPurpose",
                        "Email",
                      ].includes(field) ? (
                      <div className="Search_patient_icons">
                        <input
                          id={`${field}_${index}`}
                          type={"text"}
                          list={`${field}_iddd`}
                          autoComplete="off"
                          name={field}
                          pattern={
                            field === "Email"
                              ? "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                              : field === "PhoneNumber"
                              ? "\\d{10}"
                              : "[A-Za-z]+"
                          }
                          className={
                            errors[field] === "Invalid"
                              ? "invalid"
                              : errors[field] === "Valid"
                              ? "valid"
                              : ""
                          }
                          onKeyDown={(e) =>
                            field === "PhoneNumber" &&
                            ![
                              "0",
                              "1",
                              "2",
                              "3",
                              "4",
                              "5",
                              "6",
                              "7",
                              "8",
                              "9",
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                              "Tab",
                            ].includes(e.key) &&
                            e.preventDefault()
                          }
                          value={AppointmentRequestList[field]}
                          onChange={HandleOnchange}
                          readOnly={field === "VisitPurpose"}
                        />
                        <datalist id={`${field}_iddd`}>
                          {field === "PhoneNumber" &&
                            FilterbyPatientId.map((row, indx) => (
                              <option
                                key={indx}
                                value={`${row.FirstName} | ${row.PhoneNo}`}
                              />
                            ))}
                          {field === "FirstName" &&
                            FilterbyPatientId.map((row, indx) => (
                              <option
                                key={indx}
                                value={` ${row.FirstName} | ${row.PhoneNo}`}
                              />
                            ))}
                        </datalist>
                        {/* <span
                          onClick={() => HandlesearchPatient()}
                        >
                          <PersonSearchIcon />
                        </span> */}
                      </div>
                    ) : (
                      <input
                        id={`${field}_${index}`}
                        autoComplete="off"
                        type={field === "RequestDate" ? "date" : "time"}
                        name={field}
                        value={AppointmentRequestList[field]}
                        onKeyDown={
                          ["FirstName", "MiddleName", "LastName"].includes(
                            field
                          )
                            ? handleKeyDownTextRegistration
                            : field === "PhoneNumber"
                            ? handleKeyDownPhoneNo
                            : null
                        }
                        onChange={HandleOnchange}
                      />
                    )}
                  </div>
                ))}
            </div>
            <br />
            <div className="Main_container_Btn">
              <button onClick={handleAppointmentRequestSubmit}>
                {AppointmentRequestList.AppointmentID ? "Update" : "Add"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>Appointment Request List</h3>
            <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
              <div className="RegisForm_1">
                <label htmlFor="input">
                  Current Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="SearchbyDate"
                  value={searchOptions.SearchbyDate}
                  onChange={HandleOnchangeSearch}
                />
              </div>

              <div className="RegisForm_1">
                <label htmlFor="input">
                  First Name<span>:</span>
                </label>
                <input
                  type="text"
                  name="SearchbyFirstName"
                  value={searchOptions.SearchbyFirstName}
                  onChange={HandleOnchangeSearch}
                />
              </div>

              <div className="RegisForm_1">
                <label htmlFor="input">
                  Phone Number<span>:</span>
                </label>
                <input
                  type="number"
                  name="SearchbyPhoneNumber"
                  value={searchOptions.SearchbyPhoneNumber}
                  onChange={HandleOnchangeSearch}
                />
              </div>

              <div className="RegisForm_1">
                <label htmlFor="input">
                  Specialization<span>:</span>
                </label>
                <select
                  name="SearchSpecialization"
                  value={searchOptions.SearchSpecialization}
                  onChange={HandleOnchangeSearch}
                >
                  <option value="">Select</option>

                  {SpecializationData.filter((p) => p.Status === "Active").map(
                    (p, indx) => (
                      <option key={indx} value={p.id}>
                        {p.SpecialityName}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="RegisForm_1">
                <label htmlFor="input">
                  Doctor<span>:</span>
                </label>
                <select
                  name="SearchDoctor"
                  value={searchOptions.SearchDoctor}
                  onChange={HandleOnchangeSearch}
                >
                  <option value="">Select</option>

                  {DoctorNameData &&
                    Array.isArray(DoctorNameData) &&
                    DoctorNameData.map((p, indx) => (
                      <option key={indx + "key"} value={p.id}>
                        {p.ShortName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="RegisForm_1">
                <label htmlFor="input">
                  Time Order By<span>:</span>
                </label>
                <select
                  name="SearchTimeOrderby"
                  value={searchOptions.SearchTimeOrderby}
                  onChange={HandleOnchangeSearch}
                >
                  <option value="">Select</option>
                  <option value="Order">Order</option>
                  <option value="Disorder">Disorder</option>
                </select>
              </div>

              <div className="RegisForm_1">
                <label htmlFor="input">
                  Status<span>:</span>
                </label>
                <select
                  name="SearchStatus"
                  value={searchOptions.SearchStatus}
                  onChange={HandleOnchangeSearch}
                >
                  <option value="PENDING">Pending</option>
                  <option value="REGISTERED">Registered</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div
                className="RescheduleBtnWrapper"
                style={{ marginTop: "10px" }}
              >
                <Button
                  className="cell_btn"
                  onClick={handleRescheduleSelectedPatients}
                >
                  <UpdateIcon className="check_box_clrr_cancell" />
                  Re-Schedule
                </Button>
              </div>
            </div>

            <br />

            {AppointmentRequestData.length >= 0 && (
              <ReactGrid
                columns={AppointmentRequestColumns}
                RowData={AppointmentRequestData}
              />
            )}
          </>
        )}
      </div>
      {openModal2 && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal2(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <Months />
          </div>
        </div>
      )}
      {OpenModalCancel && (
        <div className="modal-container" onClick={handleCloseModal}>
          <div
            className="App_Cancel_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3> Appointment Cancel Reason</h3>
            <textarea
              name="CancelReason"
              id={CancelReason}
              label="Cancellation Reason"
              value={CancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="Main_container_Btn button">
              <button onClick={handleCancelReason}>Save</button>
            </div>
          </div>
        </div>
      )}
      {ShowModalReschedule && (
        <>
          <div className="modal-container" onClick={handleCloseModal}>
            <div className="Doc_Cal_modal" onClick={(e) => e.stopPropagation()}>
              <h3>Appointment Re-Shedule</h3>
              <div className="Doc_Cal_modal_radio">
                <label htmlFor={`${ReScheduleEdit.RadioOption}_radio_Date`}>
                  <input
                    type="radio"
                    id={`${ReScheduleEdit.RadioOption}_radio_Date`}
                    name={ReScheduleEdit.RadioOption}
                    value="Date"
                    onChange={(e) =>
                      setReScheduleEdit((prev) => ({
                        ...prev,
                        RadioOption: "Date",
                        // Clear fields related to Doctor option
                        Specialization: "",
                        DoctorName: "",
                        ChangingReason: "",
                      }))
                    }
                    checked={ReScheduleEdit.RadioOption === "Date"}
                  />
                  Date
                </label>
                <label htmlFor={`${ReScheduleEdit.RadioOption}_radio_Doctor`}>
                  <input
                    type="radio"
                    id={`${ReScheduleEdit.RadioOption}_radio_Doctor`}
                    name={ReScheduleEdit.RadioOption}
                    value="Doctor"
                    onChange={(e) =>
                      setReScheduleEdit((prev) => ({
                        ...prev,
                        RadioOption: "Doctor",
                        // Clear fields related to Date option
                        RequestDate: "",
                        ChangingReason: "",
                      }))
                    }
                    checked={ReScheduleEdit.RadioOption === "Doctor"}
                  />
                  Doctor
                </label>
              </div>
              {ReScheduleEdit.RadioOption === "Date" && (
                <>
                  <div className="RegisForm_1">
                    <label htmlFor="RequestDate">
                      Request Date<span>:</span>
                    </label>
                    <input
                      name="RequestDate"
                      id="RequestDate"
                      value={ReScheduleEdit.RequestDate}
                      type="date"
                      onChange={handleDocChange}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="RequestDate">
                      Changing Reason<span>:</span>
                    </label>
                    <textarea
                      name="CancelReason"
                      id={ReScheduleEdit.ChangingReason}
                      label="Cancellation Reason"
                      value={ReScheduleEdit.ChangingReason}
                      onChange={(e) =>
                        setReScheduleEdit((prev) => ({
                          ...prev,
                          ChangingReason: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}
              {ReScheduleEdit.RadioOption === "Doctor" && (
                <>
                  <div className="RegisForm_1">
                    <label htmlFor="RequestDate">
                      Specialization<span>:</span>
                    </label>
                    <select
                      name="Specialization"
                      id="Specialization"
                      value={ReScheduleEdit.Specialization}
                      onChange={handleDocChange}
                    >
                      <option value="">Select</option>
                      {SpecializationData.filter(
                        (p) => p.Status === "Active"
                      ).map((p, indx) => (
                        <option key={indx} value={p.id}>
                          {p.SpecialityName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="RequestDate">
                      Doctor Name<span>:</span>
                    </label>
                    <select
                      name="DoctorName"
                      id="DoctorName"
                      value={ReScheduleEdit.DoctorName}
                      onChange={handleDocChange}
                    >
                      <option value="">Select</option>
                      {Array.isArray(DoctorNameData) &&
                        DoctorNameData.filter(
                          (p) => p.id !== RescheduleDocId
                        ).map((p, indx) => (
                          <option key={indx} value={p.id}>
                            {p.ShortName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="RequestDate">
                      Changing Reason<span>:</span>
                    </label>
                    <textarea
                      name="CancelReason"
                      id={ReScheduleEdit.ChangingReason}
                      label="Cancellation Reason"
                      value={ReScheduleEdit.ChangingReason}
                      onChange={(e) =>
                        setReScheduleEdit((prev) => ({
                          ...prev,
                          ChangingReason: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}
              <div className="Main_container_Btn button">
                <button onClick={handleReschedule}>Save</button>
              </div>
            </div>
          </div>
          <button onClick={handleCloseModal} className="booked_app_btn">
            <HighlightOffIcon />
          </button>
        </>
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default AppointmentRequestList;
