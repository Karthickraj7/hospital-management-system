import { Plus, ChevronLeft, ChevronRight, Edit, Trash, Check, ArrowRight ,CalendarClock} from "lucide-react";
import "./Calendar.css";
import ReactDOM from "react-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {useMemo, useState, useEffect, useCallback, useRef } from "react";

import { handleKeyDownText } from '../../OtherComponent/OtherFunctions'
import { handleKeyDownPhoneNo } from '../../OtherComponent/OtherFunctions'

import { handleKeyDownTextRegistration } from '../../OtherComponent/OtherFunctions'

import { Clock } from "lucide-react";

import PersonSearchIcon from '@mui/icons-material/PersonSearch'

import { useLocation } from "react-router-dom";

import dayjs from "dayjs";

const GoogleStyleCalendar = () => {

//----------------jeeva---------------

  
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector(state => state.userRecord?.UserData)
  const toast = useSelector((state) => state.userRecord?.toast);
  const UserRecord = useSelector((state) => state.userRecord?.UserData);
  const [searchQuery, setSearchQuery] = useState('');
  
  const prevSelectedTimeRef = useRef();


  const formatDate = date => {
    const d = new Date(date)
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const year = d.getFullYear()
    return `${year}-${month}-${day}`
  }


  
  const [AppointmentRequestList, setAppointmentRequestList] = useState({
    AppointmentID:"",
    Title: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    RequestTime: "",

    PhoneNumber: "",
    Age: "",
    Gender: "",
    Email: "",
    Specialization: "",

    DoctorName: "",
    AppointmentType: "",

    ReferredBy: "",
    VisitType: "NewConsultation",
    VisitPurpose: "",
    // remarks: "",

    lastVisitDate: "",
    advisedReviewDate: "",
    reviewedBy: "",
    advisedInstructions: "",

    dueAmount: "",
    lastBookedBy: "",
  });

  
  const [ReScheduleEdit, setReScheduleEdit] = useState({
    RadioOption: "Date",
    RequestDate: "",
    RequestTime: "",
    ChangingReason: "",
    Specialization: "",
    DoctorName: "",
  });

  const [SearchSpecialityDoctor, setSearchSpecialityDoctor] = useState({
      
    Specialization: "",
    DoctorName: "",
    
    
  });

  console.log(SearchSpecialityDoctor,'SearchSpecialityDoctor');
  

  const [ReScheduleId, setReScheduleId] = useState("");
  console.log(ReScheduleId,'ReScheduleId');
  
  const [RescheduleDocId, setRescheduleDocId] = useState("");

  console.log(RescheduleDocId,'RescheduleDocId');
  

  const [SpecializationData, setSpecializationData] = useState([]);
  const [DoctorData, setDoctorData] = useState([])
  const [DoctorAvailableMonthWiseData, setDoctorAvailableMonthWiseData] = useState([])
  
  console.log(DoctorData,'DoctorData-----------1');
  console.log(DoctorAvailableMonthWiseData,'DoctorAvailableMonthWiseData-----------1');
  
  const [TitleNameData, setTitleNameData] = useState([]);

  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);
  console.log(FilterbyPatientId,'FilterbyPatientId---------1');
  
  const [SearchPatientQuery, setSearchPatientQuery] = useState('');
  const [allPatients, setAllPatients] = useState([]);
  const [FilterbyPatientStatus, setFilterbyPatientStatus] = useState([]);
  console.log(FilterbyPatientStatus,'FilterbyPatientStatus---------1');
  
  const [FilteredAppointmentId, setFilteredAppointmentId] = useState("");
  const [RegPatientId, setRegPatientId] = useState(null);
  console.log(RegPatientId,'RegPatientId----------1');

  const [postdata, setPostData] = useState(null);
  console.log(postdata,'postdata-----------1');


  
  const [selectedTime, setSelectedTime] = useState("");
  const [SelectedMonth, setSelectedMonth] = useState("");
  const [SelectedYear, setSelectedYear] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [DateForDoctor, setDateForDoctor] = useState("");
  console.log(DateForDoctor,'DateForDoctor');
  console.log(SelectedMonth,'SelectedMonth');
  console.log(SelectedYear,'SelectedYear');
  
  const [currentView, setCurrentView] = useState("month");
 
  const [deletePatientName, setDeletePatientName] = useState(null);


  console.log(currentDate,'currentDate');
  console.log(currentView,'currentView');

  const today = new Date();
  const formattedToday = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
  
  console.log(formattedToday,'formattedToday');
  
  // const formattedToday = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [speciality, setSpeciality] = useState(null);
  const [doctorName, setDoctorName] = useState(null);

  const [timeSlots, setTimeSlots] = useState([]);
  const [defaultTimeSlots, setDefaultTimeSlots] = useState([]);
  const [SelectedDoctorSchedule, setSelectedDoctorSchedule] = useState([]);
 
  const [SelectedFollowupDate, setSelectedFollowupDate] = useState("");

  console.log(timeSlots,'timeSlots---------');
  console.log(defaultTimeSlots,'defaultTimeSlots---------');
  console.log(SelectedDoctorSchedule,'SelectedDoctorSchedule-------');
  console.log(SelectedFollowupDate,'SelectedFollowupDate-------');
  


  const [DoctorDayData, setDoctorDayData] = useState([]);
  console.log(DoctorDayData,'DoctorDayData----------1')
  const [ReferralDoctorData, setReferralDoctorData] = useState([]);
  const [scheduleView, setScheduleView] = useState("today"); // Add this new state
  const [activeTab, setActiveTab] = useState("Pending"); // Default: Schedule
  const [appointmentList, setAppointmentList] = useState([]); // Store all appointments
  const [RescheduleAppointmentList, setRescheduleAppointmentList] = useState([]); // Store all appointments
  
  console.log(appointmentList,'appointmentList');
  console.log(RescheduleAppointmentList,'RescheduleAppointmentList');
  console.log(RescheduleAppointmentList,'RescheduleAppointmentList');
  
  const [AppointmentRequestData, setAppointmentRequestData] = useState({});
  const [AppointmentRescheduleRequestData, setAppointmentRescheduleRequestData] = useState({});
  const [FollowUpPatientData, setFollowUpPatientData] = useState({});
  const [TotalOPPatient, setTotalOPPatient] = useState([]);
  const [FollowUpPatientRegisterId, setFollowUpPatientRegisterId] = useState("");
 
  const [TodayOPCount, setTodayOPCount] = useState(0);
  const [MonthlyOPcount, setMonthlyOPcount] = useState(0);
  const [YearlyOPcount, setYearlyOPcount] = useState(0);
  
  console.log(FollowUpPatientData,'FollowUpPatientData');
  console.log(FollowUpPatientRegisterId,'FollowUpPatientRegisterId');
  console.log(AppointmentRequestData,'AppointmentRequestData');
  console.log(AppointmentRescheduleRequestData,'AppointmentRescheduleRequestData');
  
  const [selectedDay, setSelectedDay] = useState(null);
  console.log(selectedDay,'selectedDay-------------1');
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [errors, setErrors] = useState({});
  console.log(selectedTimeSlot,'selectedTimeSlot');
  const [isEditingTime, setIsEditingTime] = useState(false); // Toggle input type
  const [timePeriod, setTimePeriod] = useState("AM"); // AM/PM selection
  const [selectedTimeSlotRaw, setSelectedTimeSlotRaw] = useState("");
  console.log(FilteredAppointmentId,'FilteredAppointmentId----------1');
  console.log(DoctorData,'DoctorData');
  const [IsGetData, setIsGetData] = useState(false);
  const [IsGetData1, setIsGetData1] = useState(false);
  const [IsGetData2, setIsGetData2] = useState(false);
  const [IsGetAppointmentData, setIsGetAppointmentData] = useState(false);
  const [DeleteAppointmentData, setDeleteAppointmentData] = useState(false);
  const [DeleteAppointmentInCalanderData, setDeleteAppointmentInCalanderData] = useState(false);

  console.log(AppointmentRequestData,'AppointmentRequestData');
  console.log(AppointmentRescheduleRequestData,'AppointmentRescheduleRequestData');
  console.log(SearchSpecialityDoctor,'SearchSpecialityDoctor');

  const [events, setEvents] = useState([]);

  const [showEventForm, setShowEventForm] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  console.log(deleteEventId,'deleteEventId');
  
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [ShowResecheduleForm, setShowResecheduleForm] = useState(false);


  const convertTo12HourFormat = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };



  
  // const HandleOnchange = (e) => {
  //   const { name, value } = e.target;
  //   console.log("HandleOnchange:", name, value);
  
  //   setSearchSpecialityDoctor((prev) => ({
  //     ...prev,
  //     [name]: value.trim(),
  //   }));
  
  //   if (name === "Specialization") {
  //     setSearchSpecialityDoctor((prev) => ({
  //       ...prev,
  //       DoctorName: "",
  //     }));
  
  //     setSelectedDoctor("");
  //     setDoctorName("");
  //     setSelectedDoctorSchedule([]);
  //     setTimeSlots(getTimeSlots());
  
  //     if (!value.trim()) {
  //       setDoctorData([]);
  //     }
  //   }
  
  //   if (name === "DoctorName") {
  //     const selectedDoctor = DoctorData.find((doc) => doc.doctor_id === value);
  
  //     if (selectedDoctor && selectedDoctor.schedule.length > 0) {
  //       const schedule = selectedDoctor.schedule[0];
  
  //       const start = schedule.starting_time;
  //       const end = schedule.ending_time;
  
  //       console.log("Doctor Available From:", start, "To:", end);
  
  //       const filteredSlots = getTimeSlots().filter((time) => {
  //         return isTimeWithinRange(time, start, end);
  //       });
  
  //       setSelectedDoctorSchedule(schedule);
  //       setTimeSlots(filteredSlots);
  //     } else {
  //       setTimeSlots(getTimeSlots());
  //     }
  //   }
  // };
  


  // const HandleOnchange = (e) => {
  //   const { name, value } = e.target;
  //   console.log("HandleOnchange:", name, value);
  
  //   setSearchSpecialityDoctor((prev) => ({
  //     ...prev,
  //     [name]: value.trim(),
  //   }));

  //   // setAppointmentRequestList((prev) => ({
  //   //   ...prev,
  //   //   [name]: prev[name] ? prev[name] : value,
  //   // }));


  //   setAppointmentRequestList((prev) => ({
  //     ...prev,
  //     [name]: prev[name] || value,
  //   }));
  
  //   if (name === "Specialization") {
  //     setSearchSpecialityDoctor((prev) => ({
  //       ...prev,
  //       DoctorName: "", // Reset DoctorName when Specialization changes
  //     }));

  //     setAppointmentRequestList((prev) => ({
  //       ...prev,
  //       DoctorName: "", // Reset in the form as well
  //     }));
  
  //     setSelectedDoctor("");
  //     setDoctorName("");
  //     setSelectedDoctorSchedule([]); // Clear schedule
  //     setTimeSlots(defaultTimeSlots); // Reset to full time slots
  
  //     if (!value.trim()) {
  //       setDoctorData([]); // Clear doctor data if no specialization is selected
  //     }
  //   }
  
  //   if (name === "DoctorName") {
  //     const selectedDoctor = DoctorData.find((doc) => doc.doctor_id === value);
  
  //     if (selectedDoctor && selectedDoctor.schedule.length > 0) {
  //       const schedule = selectedDoctor.schedule[0];
  
  //       const start = convertTo12HourFormat(schedule.starting_time); // e.g., "10:00 AM"
  //       const end = convertTo12HourFormat(schedule.ending_time); // e.g., "10:00 PM"
  
  //       console.log("Doctor Available From:", start, "To:", end);
  
  //       // Ensure correct filtering of slots between start and end time
  //       const filteredSlots = defaultTimeSlots.filter((time) => {
  //         return (
  //           convertTo24HourFormat(time) >= convertTo24HourFormat(start) &&
  //           convertTo24HourFormat(time) <= convertTo24HourFormat(end)
  //         );
  //       });
  
  //       setSelectedDoctorSchedule(schedule);
  //       setTimeSlots(filteredSlots);
  //     } else {
  //       setTimeSlots(defaultTimeSlots); // Reset to full slots if doctor is not selected
  //     }
  //   }
  // };

  const HandleOnchange = (e) => {
    const { name, value } = e.target;
    console.log("Changed:", name, value);
  
    setAppointmentRequestList((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  
    setSearchSpecialityDoctor((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  
    // Handle Specialization Change
    if (name === "Specialization") {
      handleSpecializationChange(value);
    }
  
    // Handle Doctor Change
    if (name === "DoctorName") {
      handleDoctorChange(value);
    }
  };
  

  const resetDoctorSchedule = () => {
    setDoctorScheduleMap({})
    setSelectedDoctor("");
    setSelectedDoctorSchedule([]);
    setTimeSlots(defaultTimeSlots);
  };


  // ✅ Handles Specialization Selection
  const handleSpecializationChange = (specializationId) => {
    if (!specializationId) {
      setDoctorData([]); // Clear doctor list if no specialization is selected
      setAppointmentRequestList((prev) => ({
        ...prev,
        DoctorName: "",
      }));
      setSearchSpecialityDoctor((prev) => ({
        ...prev,
        DoctorName: "",
      }));
      resetDoctorSchedule();
      return;
    }
  
    // Fetch doctors for the selected specialization
    console.log(DoctorData,'DoctorData-j');
    
    const filteredDoctors = DoctorData.filter(
      (doc) => doc.specialization_id === specializationId
    );

    console.log(filteredDoctors,'filteredDoctors-j');
  
    setDoctorData(filteredDoctors);
    
    // Reset selected doctor
    setAppointmentRequestList((prev) => ({
      ...prev,
      DoctorName: "",
      Specialization: specializationId,
    }));
    setSearchSpecialityDoctor((prev) => ({
      ...prev,
      DoctorName: "",
    }));
  
    resetDoctorSchedule();

    // setSelectedDoctor("");
    // setSelectedDoctorSchedule([]);
    // setTimeSlots(defaultTimeSlots);

  };
  
  // ✅ Handles Doctor Selection & Available Time Slots

  // const handleDoctorChange = (doctorId) => {
  //   if (!doctorId) {
  //     setSelectedDoctorSchedule([]);
  //     setTimeSlots(defaultTimeSlots);
  //     return;
  //   }
  
  //   const selectedDoctor = DoctorData.find((doc) => doc.doctor_id === doctorId);
  
  //   if (selectedDoctor && selectedDoctor.schedule.length > 0) {
  //     const schedule = selectedDoctor.schedule[0];
  
  //     const start = convertTo12HourFormat(schedule.starting_time);
  //     const end = convertTo12HourFormat(schedule.ending_time);
  
  //     console.log("Doctor Available From:", start, "To:", end);
  
  //     // Filter available time slots
  //     const filteredSlots = defaultTimeSlots.filter((time) => {
  //       return (
  //         convertTo24HourFormat(time) >= convertTo24HourFormat(start) &&
  //         convertTo24HourFormat(time) <= convertTo24HourFormat(end)
  //       );
  //     });
  
  //     setSelectedDoctorSchedule(schedule);
  //     setTimeSlots(filteredSlots);
  //   } else {
  //     setSelectedDoctorSchedule([]);
  //     setTimeSlots(defaultTimeSlots);
  //   }
  // };
  

  const handleDoctorChange = (doctorId) => {
    if (!doctorId) {

      resetDoctorSchedule();
      // setSelectedDoctorSchedule([]);
      // setTimeSlots(defaultTimeSlots);
      return;
    }

    const selectedDoctor = DoctorData.find((doc) => doc.doctor_id === doctorId);

    if (selectedDoctor && selectedDoctor.schedule.length > 0) {
      // Find the first working schedule
      const schedule = selectedDoctor.schedule.find(s => s.working === "yes");

      if (!schedule) {
        console.warn("No working schedule found for doctor.");
        resetDoctorSchedule();
        
        // setSelectedDoctorSchedule([]);
        // setTimeSlots(defaultTimeSlots);
        return;
      }

      let startTimes = [];
      let endTimes = [];

      if (schedule.shift === "Double") {
        // Use both forenoon and afternoon if present
        if (schedule.starting_time_f && schedule.ending_time_f) {
          startTimes.push(convertTo24HourFormat(schedule.starting_time_f));
          endTimes.push(convertTo24HourFormat(schedule.ending_time_f));
        }
        if (schedule.starting_time_a && schedule.ending_time_a) {
          startTimes.push(convertTo24HourFormat(schedule.starting_time_a));
          endTimes.push(convertTo24HourFormat(schedule.ending_time_a));
        }
      } else {
        // Single shift
        if (schedule.starting_time && schedule.ending_time) {
          startTimes.push(convertTo24HourFormat(schedule.starting_time));
          endTimes.push(convertTo24HourFormat(schedule.ending_time));
        }
      }

      if (startTimes.length === 0 || endTimes.length === 0) {
        console.warn("No valid time found in schedule.");
        resetDoctorSchedule();
        // setSelectedDoctorSchedule([]);
        // setTimeSlots(defaultTimeSlots);
        return;
      }

      // Build flat filtered slot list
      const filteredSlots = defaultTimeSlots.filter((time) => {
        const time24 = convertTo24HourFormat(time);
        return startTimes.some((start, index) => {
          return time24 >= start && time24 <= endTimes[index];
        });
      });

      setSelectedDoctorSchedule(schedule);
      setTimeSlots(filteredSlots);
      setSelectedDoctor(doctorId); //added
      console.log("Doctor Available From:", startTimes, "To:", endTimes);
    } else {
      resetDoctorSchedule();

      // setSelectedDoctorSchedule([]);
      // setTimeSlots(defaultTimeSlots);
    }
  };

  
  // Helper function to convert 12-hour time to 24-hour format for accurate comparisons
  // const convertTo24HourFormat = (time) => {
  //   const [hour, minutePart] = time.split(":");
  //   const [minute, period] = minutePart.split(" ");
  //   let hour24 = parseInt(hour, 10);
  
  //   if (period === "PM" && hour24 !== 12) {
  //     hour24 += 12;
  //   }
  //   if (period === "AM" && hour24 === 12) {
  //     hour24 = 0;
  //   }
  
  //   return `${hour24.toString().padStart(2, "0")}:${minute}`;
  // };
  


  const isTimeWithinRange = (time, start, end) => {
    const parseTime = (t) => {
      if (!t) return null; // Handle undefined/null cases
  
      // If time has AM/PM, use regex; otherwise, assume 24-hour format
      let match = t.match(/(\d+):(\d+) (\w+)/);
      
      if (match) {
        // Handle 12-hour format (e.g., "02:30 PM")
        let [hour, minute, ampm] = match.slice(1);
        let hours = parseInt(hour, 10);
        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        return new Date(0, 0, 0, hours, parseInt(minute, 10));
      } else {
        // Handle 24-hour format (e.g., "14:00")
        let parts = t.split(":");
        if (parts.length < 2) return null;
        return new Date(0, 0, 0, parseInt(parts[0], 10), parseInt(parts[1], 10));
      }
    };
  
    const timeObj = parseTime(time);
    const startObj = parseTime(start);
    const endObj = parseTime(end);
  
    if (!timeObj || !startObj || !endObj) return false; // Prevent errors
  
    return timeObj >= startObj && timeObj <= endObj;
  };
  
  

  const HandlesearchPatient = () => {
    console.log("Search triggered for:", searchQuery);
  
    const queryParts = searchQuery.toLowerCase().split(" ").filter(Boolean);
  
    const patient = FilterbyPatientId.find(patient => {
        const firstName = patient.FirstName.toLowerCase();
        const middleName = patient.MiddleName?.toLowerCase() || '';
        const surName = patient.SurName?.toLowerCase() || '';
  
        return queryParts.every(part =>
            firstName.includes(part) ||
            middleName.includes(part) ||
            surName.includes(part) ||
            patient.PatientId === searchQuery ||
            String(patient.PhoneNo) === searchQuery
        );
    });
  
    console.log(patient,'patient');
    
  
    if (patient) {
        axios.get(`${UrlLink}Frontoffice/get_Patient_Details_by_patientId`, {
            params: { PatientId: patient.PatientId }
        })
        .then((res) => {
            const data = res.data;
            console.log(data, 'Patient Data');
            
            console.log(data?.warn, 'warn');
            if (data?.warn) {
              console.log("Warning Message Found:", data.warn);
              const tdata = {
                message: data.warn,
                type: "warn",
              };
              dispatchvalue({ type: "toast", value: tdata });
             
            }
            console.log('fffff----');
            setAppointmentRequestList((prev) => ({
                
                
                ...prev,
                Title: data.Title,
                FirstName: data.FirstName,
                MiddleName: data.MiddleName,
                LastName: data.SurName,
                PhoneNumber: data.PhoneNo,
                Email: data.Email,
                Age: data.Age,
                Gender: data.Gender,
                Email: data.Email,
            }));
  
            setRegPatientId(data);
  
            const newPostData = {
                PatientId: data.PatientId,
                PhoneNo: data.PhoneNo,
                FirstName: data.FirstName,
                
            };
  
            console.log(newPostData, 'postdata');
            setPostData(newPostData); // Set postdata to trigger the useEffect
        })
        .catch((err) => {
            console.error("Error fetching patient details:", err);
        });

        axios.get(`${UrlLink}Frontoffice/get_Patient_Previous_Visit_Details`, {
          params: { 
            PatientId: patient.PatientId,
            FirstName: patient.FirstName,
            PhoneNumber: patient.PhoneNo
          }
        })
        .then((res) => {
          const data = res.data;
          console.log(data, 'Previous Visit Data');

          if (data?.warn) {
              console.log("Warning Message Found:", data.warn);
              dispatchvalue({ type: "toast", value: { message: data.warn, type: "warn" } });
          }

          // Convert "DD-MM-YYYY" to "YYYY-MM-DD" for <input type="date">
          const formattedDate = data.lastVisitDate 
              ? data.lastVisitDate.split('-').reverse().join('-')  // Converts "17-03-2025" → "2025-03-17"
              : '';
          // const formattedDate1 = data.AdvisedReviewDate 
          //     ? data.AdvisedReviewDate.split('-').reverse().join('-')  // Converts "17-03-2025" → "2025-03-17"
          //     : '';

          setAppointmentRequestList((prev) => ({
              ...prev,
              lastVisitDate: formattedDate,  // ✅ Use YYYY-MM-DD format for the input field
              // reviewedBy: data.DoctorName || 'Unknown',
              reviewedBy: data.created_by || '',
              advisedReviewDate:data.AdvisedReviewDate,
              advisedInstructions:data.AdvisedInstructions,
              lastBookedBy:data.lastBookedBy,
          }));

          setSelectedFollowupDate(data.AdvisedReviewDate);

          

          
      })
      .catch((err) => {
          console.error("Error fetching patient details:", err);
      });



    } else {
        console.warn("No patient found for the search query:", searchQuery);
    }
  };
  
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  
    if (value.trim() === '') {
      setAppointmentRequestList(prevData => ({
            ...prevData,
            Title: '',
            FirstName: '',
            MiddleName: '',
            LastName: '',
            RequestTime: "",
            PhoneNumber: '',
            Age: "",
            Gender: "",
            Email: '',
            Specialization: '',
            DoctorName: '',
            AppointmentType: '',
            ReferredBy:'',
            VisitType: 'NewConsultation',
            VisitPurpose:'',
            lastVisitDate:'',
            reviewedBy:'',
            advisedReviewDate:'',
            advisedInstructions:'',
            lastBookedBy:'',
            
        }));
    }
  
    console.log(value);
  };


  useEffect(() => {
      const postdata = {
       
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
         
        })
        .catch((err) => {
          console.log(err);
        });
    }, [
      
      searchQuery
    ]);
  
  

const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchPatientQuery(value);

  // if (!value.trim()) {
  //   // Reset fields when search is empty
  //   setRegisterData(prev => ({
  //     ...prev,
  //     ABHA: '',
  //     FirstName: '',
  //     Gender: '',
  //     DOB: '',
  //     Age: '',
  //     Email: '',
  //     PermanentPincode: '',
  //     PermanentArea: '',
  //     PermanentCity: '',
  //     PermanentDistrict: '',
  //     PermanentState: '',
  //   }));
  // }
};


useEffect(() => {
  const regular = appointmentList.map((p) => ({
    PhoneNo: p.PhoneNumber,
    FirstName: p.FirstName,
    MiddleName: p.MiddleName,
    LastName: p.LastName,
    Fullname: p.Fullname,
    Gender: p.Gender,
    Status: p.Status,
    AppointmentId: p.AppointmentId,
    Source: "Appointment"
  }));

  const rescheduled = RescheduleAppointmentList.map((p) => ({
    PhoneNo: p.PhoneNumber,
    FirstName: p.FirstName,
    MiddleName: p.MiddleName,
    LastName: p.LastName,
    Fullname: p.Fullname,
    Gender: p.Gender,
    Status: p.Status,
    AppointmentId: p.AppointmentId,
    Source: "Reschedule"
  }));

  const followups = FollowUpPatientData.followup_patients?.map((p) => ({
    PhoneNo: p.PhoneNo,
    FirstName: p.FirstName,
    MiddleName: p.MiddleName,
    LastName: p.LastName,
    Fullname: p.Fullname,
    Gender: p.Gender,
    Status: "Followup",
    AppointmentId: p.AppointmentId,
    Source: "Followup"
  })) || [];

  const combined = [...regular, ...rescheduled, ...followups];
  console.log(combined,'combined');

  // Optional: Deduplicate based on phone number
  const uniquePatients = Array.from(new Map(combined.map(p => [p.PhoneNo, p])).values());
  console.log(uniquePatients,'uniquePatients');

  setAllPatients(combined);

}, [appointmentList, RescheduleAppointmentList, FollowUpPatientData]);


useEffect(() => {
  if (SearchPatientQuery.trim() === "") {
    setFilterbyPatientStatus([]);
    return;
  }

  const filtered = allPatients.filter(p =>
    p.PhoneNo?.includes(SearchPatientQuery) ||
    p.FirstName?.toLowerCase().includes(SearchPatientQuery.toLowerCase())
  );

  setFilterbyPatientStatus(filtered);
}, [SearchPatientQuery, allPatients]);



const HandleSearchPatientWithStatus = () => {
  console.log("Search triggered for:", SearchPatientQuery);

  // const query = searchQuery.toLowerCase().trim();
  // if (!query) {
  //   console.warn("Empty search query");
   
  //   const tdata = {
  //     message: 'Empty search query',
  //     type: 'warn', 
  //   };

  //   dispatchvalue({ type: "toast", value: tdata });

  //   return;
  // }

  // const filteredPatients = FilterbyPatientId.filter(patient => 
  //   patient.FirstName.toLowerCase().includes(query) || 
  //   String(patient.PhoneNo) === query
  // );

  // if (filteredPatients.length > 0) {
  //   const patient = filteredPatients[0]; // Take the first match
  //   console.log("Patient Found:", patient);

  //   axios.get(`${UrlLink}Frontoffice/ABHA_card_get`, { params: { Mobile_No: patient.PhoneNo } })
  //     .then(res => {

  //       if (!res.data.length) {
  //         console.warn("No ABHA data found!");
        
  //         const tdata = {
  //           message: 'No ABHA data found!',
  //           type: 'warn',
  //         };
        
  //         dispatchvalue({ type: "toast", value: tdata });
        
  //         return;
  //       }

  //       const response = res.data[0]; // Assuming first record is the relevant one
  //       console.log("ABHA Data:", response);

  //       const dob = response.dayOfBirth;
  //       const currentdate = new Date();
  //       const selectedDate = new Date(dob);

  //       // Calculate age
  //       const years = differenceInYears(currentdate, selectedDate);
  //       const months = differenceInMonths(currentdate, selectedDate) % 12;
  //       const days = differenceInDays(currentdate, addMonths(addYears(selectedDate, years), months));

  //       const genderMap = { F: "Female", M: "Male", T: "Transgender", O: "Other" };

  //       setRegisterData(prev => ({
  //         ...prev,
  //         ABHA: response.ABHANumber,
  //         FirstName: response.name,
  //         Gender: genderMap[response.gender] || response.gender,
  //         DOB: dob,
  //         Age: `${years} Y, ${months} M, ${days} D`,
  //         Email: response.email,
  //         PermanentAddress: response.address,
  //         PermanentPincode: response.pincode,
  //         PermanentArea: response.townName,
  //         PermanentCity: response.subdistrictName,
  //         PermanentDistrict: response.subdistrictName,
  //         PermanentState: response.stateName,
  //       }));
  //     })
  //     .catch(err => console.error("ABHA API error:", err));
  // } else {
  //   console.warn("No patient found for:", searchQuery);
  // }


};


  const HandleFieldOnchange = (e) => {
    const { name, value, pattern } = e.target;
  
    console.log(name, "nnnnnnnnnnnn");
    console.log(value, "vvvvvvvvvvvvvvvvv");


    setSearchSpecialityDoctor((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  
    const formattedValue = ["FirstName", "MiddleName", "LastName"].includes(name)
      ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      : value;
  
    console.log(formattedValue, "formattedValue");
  
    const formatTo12Hour = (time) => {
      if (!time) return "";
      let [hours, minutes] = time.split(":").map(Number);
      let period = hours >= 12 ? "PM" : "AM";
  
      if (hours > 12) hours -= 12;
      if (hours === 0) hours = 12;
  
      return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };
  
    // Check length for specific fields
    if (["FirstName", "MiddleName", "AliasName"].includes(name) && value.length > 30) {
      const tdata = {
        message: `${name} should not exceed 30 characters.`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }
  
    if (name === "PhoneNumber") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");
        if (convert.length <= 10) {
          setAppointmentRequestList((prev) => ({
            ...prev,
            [name]: convert[1].trim(),
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
          PhoneNumber: convert[1].trim(),
        }));
      } else {
        setAppointmentRequestList((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    } else if (name === "Title"){
      // Find the title based on ID
      const selectedTitle = TitleNameData.find((title) => title.id === parseInt(value));
      console.log(selectedTitle,'selectedTitle-----------1');
      
      if (selectedTitle) {
        const titleName = selectedTitle.Title; // Extract title name
  
        // Determine gender based on Title
        const genderValue = ["Miss", "Ms", "Mrs"].includes(titleName)
        ? "Female"
        : ["Mr", "Master"].includes(titleName)
        ? "Male"
        // : ["Transgender"].includes(titleName)
        // ? "TransGender"
        : ["Dr", "Baby","Transgender"].includes(titleName)
        ? "Unspecified" // or keep it as "" if needed
        : "";

  
        setAppointmentRequestList((prev) => ({
          ...prev,
          [name]: formattedValue, // Store ID as value
          Gender: genderValue || prev.Gender,
        }));
      }

    } else if (name === "Gender") {
      const titleOptions = TitleNameData.filter((title) => {
        if (formattedValue === "Female") return ["Miss", "Ms", "Mrs"].includes(title.Title);
        if (formattedValue === "Male") return ["Mr", "Master"].includes(title.Title);
        if (formattedValue === "TransGender") return ["Transgender", "Baby", "Dr"].includes(title.Title);
        return false;
      });

  
      const isTitleValid = titleOptions.some((title) => title.id === AppointmentRequestList.Title);

      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: value,
        Title: isTitleValid ? prev.Title : "", // Keep title if valid, else reset
      }));
    }
    
    else if (name === "RequestTime") {
      setSelectedTimeSlotRaw(value);
      const formattedTime = formatTo12Hour(value);
      setSelectedTimeSlot(formattedTime);
      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: formattedTime,
      }));
      setSelectedTime(formattedTime);
      setSelectedTimeSlot(formattedTime);
    } else if (name === "Specialization") {
      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: formattedValue,
        DoctorName: "", // Reset DoctorName when Specialization changes
      }));
      handleSpecializationChange(value);
      setSpeciality(formattedValue);
      setSelectedDoctor("");
      setDoctorName("");
      
      if (!formattedValue.trim()) {
        setDoctorData([]); // Clear DoctorData when Specialization is cleared
      }
    } else if (name === "DoctorName") {
      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      handleDoctorChange(value);
      setSelectedDoctor(formattedValue);
      setDoctorName(formattedValue);
    } else {
      setAppointmentRequestList((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
  
    const validateField = (value, pattern) => {
      if (!value) return "Required";
      if (pattern && !new RegExp(pattern).test(value)) return "Invalid";
      return "Valid";
    };
  
    const error = validateField(value, pattern);
    console.log(error, "error");
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  




//----------------jeeva---------------





  useEffect(() => {

    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => setSpecializationData(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);


  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Title_Master_link`)
      .then((res) => {
        const ress = res.data;
        console.log('1111', ress);
        setTitleNameData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);


  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_referral_doctor_Name_Detials`)
      .then((res) => {
        const ress = res.data;
        console.log('1111', ress);
        setReferralDoctorData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);


  console.log(events,'events');



  // useEffect(() => {
  //   console.log(AppointmentRequestData,'AppointmentRequestData1111111111');
    
  //   if (AppointmentRequestData?.appointments && Array.isArray(AppointmentRequestData?.appointments) && AppointmentRequestData?.appointments?.length > 0) {
  //     const AppointmentRequestLists = AppointmentRequestData.appointments.map((appointment, index) => ({
  //       id: appointment.id,
  //       AppointmentId: appointment.AppointmentId,
  //       patientName: appointment.FirstName,
  //       visitType: "Type", 
  //       tokenNo: appointment.tokenNo || (index + 1).toString(), 
  //       date: appointment.RequestDate || "", 
  //       time: appointment.RequestTime ? appointment.RequestTime : "00:00", 
  //       status: appointment.Status,
  //       color: appointment.Status?.trim() === "PENDING" ? "bg-red-200" :
  //             appointment.Status?.trim() === "Rescheduled" ? "bg-blue-200" :
  //             appointment.Status?.trim() === "Arrived" ? "bg-violet-200" :
  //             "bg-green-200", // Default color
  //       specialization: appointment.SpecializationId,
  //       DoctorName: appointment.DoctorName,
  //       doctorId: String(appointment.DoctorID)
  //     }));
  //     console.log("Mapped Events:", AppointmentRequestLists);

  //     setEvents(AppointmentRequestLists);

  //   }
  // }, [deleteEventId,
  //   IsGetData,
  //   IsGetData1,
  //   IsGetAppointmentData,
  //   AppointmentRequestData,
  //   DeleteAppointmentData,
  //   DeleteAppointmentInCalanderData,
  //   IsGetAppointmentData,
  //   deletePatientName]
  // );
 


  useEffect(() => {
    console.log(AppointmentRequestData, 'AppointmentRequestData1111111111');
    console.log(FollowUpPatientData, 'FollowUpPatientData');

    let eventsList = [];

    // Process AppointmentRequestData if available
    if (AppointmentRequestData?.appointments && Array.isArray(AppointmentRequestData.appointments) && AppointmentRequestData.appointments.length > 0) {
        const AppointmentRequestLists = AppointmentRequestData.appointments.map((appointment, index) => ({
            id: appointment.id,
            AppointmentId: appointment.AppointmentId,
            patientName: appointment.FirstName,
            visitType: "Type",
            tokenNo: appointment.tokenNo || (index + 1).toString(),
            date: appointment.RequestDate || "",
            time: appointment.RequestTime ? appointment.RequestTime : "00:00",
            status: appointment.Status,
            color: appointment.Status?.trim() === "PENDING" ? "bg-red-200" :
                appointment.Status?.trim() === "Rescheduled" ? "bg-orange-200" :
                appointment.Status?.trim() === "Arrived" ? "bg-yellow-200" :
                "bg-green-200", // Default color
            specialization: appointment.SpecializationId,
            DoctorName: appointment.DoctorName,
            doctorId: String(appointment.DoctorID),
        }));

        eventsList = [...AppointmentRequestLists];
    }

    // Process FollowUpPatientData if available
    if (FollowUpPatientData?.followup_patients && Array.isArray(FollowUpPatientData?.followup_patients) && FollowUpPatientData?.followup_patients.length > 0) {
        const followUpEvents = FollowUpPatientData.followup_patients.map((follow, index) => {
            // Convert date format
            const [day, month, year] = follow.FollowupDate.split('-');
            const formattedDate = `${year}-${month}-${day}`;

            return {
                // id: `followup-${follow.id}-${index}`, // Ensure unique ID
                id: follow.id, // Ensure unique ID
                AppointmentId: follow.AppointmentId || "",
                patientName: follow.FirstName || "Unknown",
                visitType: "FollowUp",
                tokenNo: "-",
                date: formattedDate, // Use converted date format
                time: "00:00", // Default time for follow-up
                status: "FollowUp",
                color: "bg-violet-200", // Assign a color for follow-up
                specialization: follow.SpecializationId || "",
                DoctorName: follow.DoctorName || "",
                doctorId: String(follow.DoctorID || ""),
            };
        });

        // Spread followUpEvents into eventsList to avoid nested arrays
        eventsList = [...eventsList, ...followUpEvents];
    }

    console.log("Final Events List Length:", eventsList.length);
    console.log("Final Events List:", eventsList);
    setEvents(eventsList);

}, [
    deleteEventId,
    IsGetData,
    IsGetData1,
    IsGetAppointmentData,
    AppointmentRequestData,
    DeleteAppointmentData,
    DeleteAppointmentInCalanderData,
    FollowUpPatientData, // Add FollowUpPatientData dependency
    deletePatientName
]);



  console.log("jjjjjjj------",AppointmentRequestList?.Specialization);

  console.log(SearchSpecialityDoctor?.Specialization,'eeeeee------------');
  
  
  // useEffect(() => {
  // console.log("aaaaaaaaaaaa-----",AppointmentRequestList?.Specialization);
    
  
  //   // Fetch doctors only if specialization is selected
  //   if (SearchSpecialityDoctor?.Specialization || AppointmentRequestList?.Specialization || ReScheduleEdit?.Specialization) {
  //     const postdata = {
  //       LocationId: UserData?.location,
  //       // Date: formatDate(selectedDay),
        
  //       Date: formatDate(selectedDay || DateForDoctor|| currentDate),
  //       // Date: formatDate(new Date()),
  //       Speciality: SearchSpecialityDoctor?.Specialization || AppointmentRequestList?.Specialization || ReScheduleEdit?.Specialization,
  //       Department: "OP",
  //     };
  
  //     console.log("Fetching Doctors", postdata);
  
  //     axios
  //       .get(`${UrlLink}Frontoffice/get_available_doctor_by_speciality`, { params: postdata })
  //       .then((response) => {
  //         let data = response.data;

  //         console.log(data,'data');
          
  
  //         if (Array.isArray(data) && data.length > 0) {
  //           setDoctorData(data);
  //         } else {
  //           setDoctorData([]); // No doctors found
  //         }
  //       })
  //       .catch((error) => {
  //         setDoctorData([]);
  //         console.error("Error fetching referral doctors:", error);
  //       });
  //   } else {
  //     setDoctorData([]); // Reset DoctorData when no specialization is selected
  //   }
  // }, [
  //   UrlLink,
  //   UserData.location,
  //   SearchSpecialityDoctor?.Specialization,
  //   AppointmentRequestList?.Specialization,
  //   ReScheduleEdit?.Specialization,
  // ]);
  

  useEffect(() => {
    const specialization =
      SearchSpecialityDoctor?.Specialization ||
      AppointmentRequestList?.Specialization ||
      ReScheduleEdit?.Specialization;

    if (specialization) {
      const params = {
        LocationId: UserData?.location,
        Speciality: specialization,
        Department: "OP",
      };

      if (currentView === "day") {
        const date = formatDate(selectedDay || DateForDoctor || currentDate);
        params.CurrentDate = date; // Use dynamic date
      } else if (currentView === "week") {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // params.startDate = startOfWeek.toISOString().split("T")[0];
        params.startDate = startOfWeek.toISOString().split("T")[0];
        params.endDate = endOfWeek.toISOString().split("T")[0];
      } else if (currentView === "month") {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        params.startDate = startOfMonth.toLocaleDateString("en-CA");
        params.endDate = endOfMonth.toLocaleDateString("en-CA");
      }

      console.log("Fetching Doctors with params:", params);

      axios
        .get(`${UrlLink}Frontoffice/get_available_doctor_by_speciality_For_Calander`, {
          params: params,
        })
        .then((response) => {
          const data = response.data;

          if (Array.isArray(data) && data.length > 0) {
            setDoctorData(data);
          } else {
            setDoctorData([]);
          }
        })
        .catch((error) => {
          setDoctorData([]);
          console.error("Error fetching referral doctors:", error);
        });
    } else {
      setDoctorData([]);
    }
  }, [
    UrlLink,
    UserData?.location,
    SearchSpecialityDoctor?.Specialization,
    AppointmentRequestList?.Specialization,
    ReScheduleEdit?.Specialization,
    currentView,
    currentDate,
    selectedDay,
    DateForDoctor,
  ]);

  function getDayNameFromDate(date) {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }


  console.log("DoctorData:", DoctorData);
  console.log("DoctorData.Department:", DoctorData?.Department);


useEffect(() => {
    
  console.log("iiiiiiiiiiiiiii------");
  
    // Fetch doctors only if specialization is selected
    if (SearchSpecialityDoctor?.Specialization || AppointmentRequestList?.Specialization || ReScheduleEdit?.Specialization) {
      const departmentList = Array.isArray(DoctorData)
        ? DoctorData[0]?.Department
        : DoctorData?.Department;
            
      const postdata = {
        LocationId: UserData?.location,
        month: SelectedMonth,
        year: SelectedYear,
        // Date: formatDate(selectedDay),
        Date: formatDate(selectedDay || DateForDoctor|| currentDate),
        // Date: formatDate(new Date()),
        Speciality: SearchSpecialityDoctor?.Specialization || AppointmentRequestList?.Specialization || ReScheduleEdit?.Specialization,
        DoctorId: SearchSpecialityDoctor?.DoctorName || AppointmentRequestList?.DoctorName || ReScheduleEdit?.DoctorName,
        // Department:"OP",
        // Department: JSON.stringify(departmentList || []),

        // Department:DoctorData.Department,
        // Department: DoctorData?.Department?.join(','),
        // Department: DoctorData?.Department ? JSON.stringify(DoctorData.Department) : '',


      };
  
      console.log("monthbyfilterDoctor", postdata);
  
      axios
        .get(`${UrlLink}Masters/doctor_calender_details_view_by_doctorId_locationId_SpecialityId`, { params: postdata })
        .then((response) => {
          let data = response.data;

          console.log(data,'DoctorAvailableMonthWiseData');
          setDoctorAvailableMonthWiseData(data);
          
        })
        .catch((error) => {
          
          console.error("Error fetching referral doctors:", error);
        });
    } 
  }, [
    UrlLink,
    UserData.location,
    SearchSpecialityDoctor?.Specialization,
    AppointmentRequestList?.Specialization,
    ReScheduleEdit?.Specialization,
    SearchSpecialityDoctor?.DoctorName,
    AppointmentRequestList?.DoctorName,
    ReScheduleEdit?.DoctorName,
    currentDate,
    SelectedMonth,
    SelectedYear,
  ]);
  

  // const doctorScheduleMap = useMemo(() => {
  //   const map = {};
  //   DoctorAvailableMonthWiseData?.forEach((entry) => {
  //     map[entry.date] = entry;
  //   });
  //   return map;
  // }, [DoctorAvailableMonthWiseData]);



const [doctorScheduleMap, setDoctorScheduleMap] = useState({});

console.log(doctorScheduleMap,'doctorScheduleMap');


useEffect(() => {
  const map = {};

  console.log(DoctorAvailableMonthWiseData,'DoctorAvailableMonthWiseData---j');
  
  const schedule = DoctorAvailableMonthWiseData?.schedule;
  console.log('aaaaaaaaaa');
  
  console.log(schedule, 'schedule-----j');

  if (Array.isArray(schedule)) {
    schedule.forEach((entry) => {
      if (!map[entry.date]) {
        map[entry.date] = { date: entry.date, schedules: [] };
      }
      map[entry.date].schedules.push(entry);
    });
  } else {
    console.warn('Schedule is not an array:', schedule);
  }

  console.log(map, 'map-----1');
  setDoctorScheduleMap(map); // update state with mapped schedule
}, [DoctorAvailableMonthWiseData]);






// useEffect(() => {

//   const params = { status: ["PENDING", "REGISTERED","Arrived","OpRegistered"] };

//   if (currentView === "day") {
//     params.CurrentDate = currentDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
//   } 
//   else if (currentView === "week") {
//     const startOfWeek = new Date(currentDate);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the start of the week (Sunday)

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to end of the week (Saturday)

//     params.startDate = startOfWeek.toISOString().split("T")[0];
//     params.endDate = endOfWeek.toISOString().split("T")[0];
//   } 
//   else if (currentView === "month") {
//     const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the month
//     const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month

//     params.startDate = startOfMonth.toISOString().split("T")[0];
//     params.endDate = endOfMonth.toISOString().split("T")[0];

    
//   }

//   // Add filters if applicable
//   if (SearchSpecialityDoctor.Specialization) {
//     params.Specialization = SearchSpecialityDoctor.Specialization;
//   }
//   if (SearchSpecialityDoctor.DoctorName) {
//     params.DoctorName = SearchSpecialityDoctor.DoctorName;
//   }

//   console.log(params, "params"); // Debugging

//   // Fetch data from API
//   axios
//     .get(`${UrlLink}Frontoffice/fetch_all_appointment_pending_data`, { params })
//     .then((response) => {
//       console.log("Response data----------299:", response.data);
//       const ress = response.data
//       if (Object.keys(ress).length > 0) {
//         setAppointmentRequestData(ress);
//         setAppointmentList(ress.appointments || []);
       

//       }
//     })
//     .catch((error) => {
//       console.log("Error fetching appointments:", error);
//     });

// }, [IsGetData,IsGetData1,IsGetAppointmentData,DeleteAppointmentData,UrlLink,currentView, currentDate, SearchSpecialityDoctor.Specialization, SearchSpecialityDoctor.DoctorName]);


useEffect(() => {
 
  // const params = new URLSearchParams();
  const params = { status: ["PENDING", "REGISTERED","Arrived","OpRegistered"] };
 
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
 
  const startOfMonth = formatDate1(new Date(year, month, 1));
  const endOfMonth = formatDate1(new Date(year, month + 1, 0));
 
  // params.CurrentDate = currentDate.toISOString().split("T")[0];
 
 
  if (currentView === "day") {
    params.CurrentDate = currentDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  }
  else if (currentView === "week") {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the start of the week (Sunday)
 
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to end of the week (Saturday)
 
    params.startDate = startOfWeek.toISOString().split("T")[0];
    params.endDate = endOfWeek.toISOString().split("T")[0];
  }
  else if (currentView === "month") {
    // const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the month
    // const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month
 
    // params.startDate = startOfMonth.toISOString().split("T")[0];
    // params.endDate = endOfMonth.toISOString().split("T")[0];
 
    params.startDate = startOfMonth;
    params.endDate = endOfMonth;
   
  }

  // params.append("status", "PENDING");
  // params.append("status", "REGISTERED");
  // params.append("status", "Arrived");
  // params.append("status", "OpRegistered");
 
  // Add filters if applicable
  if (SearchSpecialityDoctor.Specialization) {
    params.Specialization = SearchSpecialityDoctor.Specialization;
  }
  if (SearchSpecialityDoctor.DoctorName) {
    params.DoctorName = SearchSpecialityDoctor.DoctorName;
  }
 
  console.log(params, "params----i"); // Debugging
 
  // Fetch data from API
  axios
    // .get(`${UrlLink}Frontoffice/fetch_all_appointment_pending_data?${params.toString()}`)
    .get(`${UrlLink}Frontoffice/fetch_all_appointment_pending_data`, { params })
    .then((response) => {
      console.log("Response data----------299", response.data);
      const ress = response.data
      if (Object.keys(ress).length > 0) {
        setAppointmentRequestData(ress);
        setAppointmentList(ress.appointments || []);
       
 
      }
    })
    .catch((error) => {
      console.log("Error fetching appointments:", error);
    });
 
}, [IsGetData,IsGetData1,IsGetAppointmentData,DeleteAppointmentData,UrlLink,currentView, currentDate, SearchSpecialityDoctor.Specialization, SearchSpecialityDoctor.DoctorName,activeTab]);



// useEffect(() => {
//   const params = new URLSearchParams();

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();

//   const startOfMonth = formatDate1(new Date(year, month, 1));
//   const endOfMonth = formatDate1(new Date(year, month + 1, 0));

//   params.append("CurrentDate", currentDate.toISOString().split("T")[0]);

//   if (currentView === "day") {
//     params.set("CurrentDate", currentDate.toISOString().split("T")[0]);
//   } else if (currentView === "week") {
//     const startOfWeek = new Date(currentDate);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(endOfWeek.getDate() + 6);

//     params.append("startDate", startOfWeek.toISOString().split("T")[0]);
//     params.append("endDate", endOfWeek.toISOString().split("T")[0]);
//   } else if (currentView === "month") {
//     params.append("startDate", startOfMonth);
//     params.append("endDate", endOfMonth);
//   }

//   // Multiple status values
//   params.append("status", "PENDING");
//   params.append("status", "REGISTERED");
//   params.append("status", "Arrived");
//   params.append("status", "OpRegistered");

//   // Add filters properly
//     if (SearchSpecialityDoctor.Specialization && SearchSpecialityDoctor.Specialization !== "") {
//       params.append("Specialization", SearchSpecialityDoctor.Specialization);
//     }
//     if (SearchSpecialityDoctor.DoctorName && SearchSpecialityDoctor.DoctorName !== "") {
//       params.append("DoctorName", SearchSpecialityDoctor.DoctorName);
//     }


//   console.log(params.toString(), "params");

//   axios
//     .get(`${UrlLink}Frontoffice/fetch_all_appointment_pending_data?${params.toString()}`)
//     .then((response) => {
//       console.log("Response data----------299", response.data);
//       const ress = response.data;
//       if (Object.keys(ress).length > 0) {
//         setAppointmentRequestData(ress);
//         setAppointmentList(ress.appointments || []);
//       }
//     })
//     .catch((error) => {
//       console.log("Error fetching appointments:", error);
//     });

// }, [
//   IsGetData,
//   IsGetData1,
//   IsGetAppointmentData,
//   DeleteAppointmentData,
//   UrlLink,
//   currentView,
//   currentDate,
//   SearchSpecialityDoctor.Specialization,
//   SearchSpecialityDoctor.DoctorName,
//   activeTab
// ]);


// useEffect(() => {
//   const params = { status: "Reschedule" };

//   if (currentView === "day") {
//     params.CurrentDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
//   } 
//   else if (currentView === "week") {
//     const startOfWeek = new Date(currentDate);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Saturday

//     params.startDate = startOfWeek.toISOString().split("T")[0];
//     params.endDate = endOfWeek.toISOString().split("T")[0];
//   } 
//   else if (currentView === "month") {
//     const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of month
//     const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of month

//     params.startDate = startOfMonth.toISOString().split("T")[0];
//     params.endDate = endOfMonth.toISOString().split("T")[0];
//   } 
//   else {
//     setAppointmentRescheduleRequestData({});
//     // setAppointmentRescheduleRequestData([]); // Reset data if the view is not valid
//     return; // Stop execution to prevent unnecessary API calls
//   }

//   // Apply additional filters
//   if (SearchSpecialityDoctor.Specialization) {
//     params.Specialization = SearchSpecialityDoctor.Specialization;
//   }
//   if (SearchSpecialityDoctor.DoctorName) {
//     params.DoctorName = SearchSpecialityDoctor.DoctorName;
//   }

//   console.log(params, "params"); // Debugging

//   // Fetch data from API
//   axios
//     .get(`${UrlLink}Frontoffice/fetch_all_Reschedule_appointment_pending_data`, { params })
//     .then((response) => {
//       console.log("Response:", response.data);
//       const ress = response.data
//       if (Object.keys(ress).length > 0) {
//         setAppointmentRescheduleRequestData(ress);
//         setRescheduleAppointmentList(ress.appointments || []);

//       }

//     })
//     .catch((error) => {
//       console.error("Error fetching rescheduled appointments:", error);
//     });

// }, [IsGetData,IsGetData1,IsGetAppointmentData,DeleteAppointmentData,UrlLink, currentView, currentDate, SearchSpecialityDoctor.Specialization, SearchSpecialityDoctor.DoctorName]);

// Status


useEffect(() => {
  const params = { status: "Reschedule" };
 
 
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
 
  const startOfMonth = formatDate1(new Date(year, month, 1));
  const endOfMonth = formatDate1(new Date(year, month + 1, 0));
 
 
  if (currentView === "day") {
    params.CurrentDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  }
  else if (currentView === "week") {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday
 
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Saturday
 
    params.startDate = startOfWeek.toISOString().split("T")[0];
    params.endDate = endOfWeek.toISOString().split("T")[0];
  }
  else if (currentView === "month") {
    // const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of month
    // const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of month
 
    // params.startDate = startOfMonth.toISOString().split("T")[0];
    // params.endDate = endOfMonth.toISOString().split("T")[0];
 
 
    params.startDate = startOfMonth;
    params.endDate = endOfMonth;
  }
  else {
    setAppointmentRescheduleRequestData({});
    // setAppointmentRescheduleRequestData([]); // Reset data if the view is not valid
    return; // Stop execution to prevent unnecessary API calls
  }
 
  // Apply additional filters
  if (SearchSpecialityDoctor.Specialization) {
    params.Specialization = SearchSpecialityDoctor.Specialization;
  }
  if (SearchSpecialityDoctor.DoctorName) {
    params.DoctorName = SearchSpecialityDoctor.DoctorName;
  }
 
  console.log(params, "params"); // Debugging
 
  // Fetch data from API
  axios
    .get(`${UrlLink}Frontoffice/fetch_all_Reschedule_appointment_pending_data`, { params })
    .then((response) => {
      console.log("Response:", response.data);
      const ress = response.data
      if (Object.keys(ress).length > 0) {
        setAppointmentRescheduleRequestData(ress);
        setRescheduleAppointmentList(ress.appointments || []);
 
      }
 
    })
    .catch((error) => {
      console.error("Error fetching rescheduled appointments:", error);
    });
 
}, [IsGetData,IsGetData1,IsGetAppointmentData,DeleteAppointmentData,UrlLink, currentView, currentDate, SearchSpecialityDoctor.Specialization, SearchSpecialityDoctor.DoctorName,activeTab]);
 

useEffect(() => {

  const params = {status: true};

  if (currentView === "day") {
    params.CurrentDate = currentDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  } 
  else if (currentView === "week") {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the start of the week (Sunday)

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to end of the week (Saturday)

    params.startDate = startOfWeek.toISOString().split("T")[0];
    params.endDate = endOfWeek.toISOString().split("T")[0];
  } 
  else if (currentView === "month") {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month

    params.startDate = startOfMonth.toISOString().split("T")[0];
    params.endDate = endOfMonth.toISOString().split("T")[0];

  }
  console.log(params, "params"); // Debugging

  // Fetch data from API
  axios
    .get(`${UrlLink}Frontoffice/get_Patient_Previous_Visit_Details_Duplicate`, { params })
    .then((response) => {
      console.log("Response data---------:", response.data);
      const ress = response.data
      if (Object.keys(ress).length > 0) {
        setFollowUpPatientData(ress);
        // setFollowUpPatientRegisterId(ress?.followup_patients?.Registration_Id);
        // setAppointmentList(ress.appointments || []);
       

      }
    })
    .catch((error) => {
      console.log("Error fetching appointments:", error);
    });

},[UrlLink,currentView, currentDate]);

//------------------ Total Registered Patients

const formatDate1 = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// useEffect(() => {

//   const params = {};

//   if (currentView === "day") {

//     params.CurrentDate = currentDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD

//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth(); // 0-based (0 = Jan)

//     const startOfMonth = formatDate1(new Date(year, month, 1)); // First day of the month
//     const endOfMonth = formatDate1(new Date(year, month + 1, 0)); // Last day of the month

//     params.startDate = startOfMonth;
//     params.endDate = endOfMonth;

//   } 

//   else if (currentView === "week") {
//     const startOfWeek = new Date(currentDate);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the start of the week (Sunday)


//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to end of the week (Saturday)

//     params.startDate = startOfWeek.toISOString().split("T")[0];
//     params.endDate = endOfWeek.toISOString().split("T")[0];
//   } 

//   else if (currentView === "month") {

//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth(); // 0-based (0 = Jan)

//     params.CurrentDate = currentDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD

//     const startOfMonth = formatDate1(new Date(year, month, 1)); // First day of the month
//     const endOfMonth = formatDate1(new Date(year, month + 1, 0)); // Last day of the month

//     params.startDate = startOfMonth;
//     params.endDate = endOfMonth;


//   }

//   // Add filters if applicable
//   if (SearchSpecialityDoctor.Specialization) {
//     params.Specialization = SearchSpecialityDoctor.Specialization;
//   }
//   if (SearchSpecialityDoctor.DoctorName) {
//     params.DoctorName = SearchSpecialityDoctor.DoctorName;
//   }

//   console.log(params, "params"); // Debugging

//   // Fetch data from API
//   axios
//     .get(`${UrlLink}Frontoffice/Total_OP_Patient_with_Multiple_Doc_List`, { params })
//     .then((response) => {
//       console.log("Response data---------:", response);
//       const ress = response.data.appointments
//       const TodayOPCount = response.data.today_total_OP_count
//       const MonthlyOPcount = response.data.monthly_total_OP_count
//       const YearlyOPcount = response.data.yearly_total_OP_count

//       setTodayOPCount(TodayOPCount)
//       setMonthlyOPcount(MonthlyOPcount)
//       setYearlyOPcount(YearlyOPcount)
//       setTotalOPPatient(ress);
    
//     })
//     .catch((error) => {
//       console.log("Error fetching appointments:", error);
//     });

// },[UrlLink,currentView, currentDate, SearchSpecialityDoctor]);




useEffect(() => {
  const params = {};

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = formatDate1(new Date(year, month, 1));
  const endOfMonth = formatDate1(new Date(year, month + 1, 0));

  params.CurrentDate = currentDate.toISOString().split("T")[0];

  if (currentView === "day") {
    params.startDate = startOfMonth;
    params.endDate = endOfMonth;
  } else if (currentView === "week") {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    params.startDate = startOfWeek.toISOString().split("T")[0];
    params.endDate = endOfWeek.toISOString().split("T")[0];
  } else if (currentView === "month") {
    params.startDate = startOfMonth;
    params.endDate = endOfMonth;
  }

  if (SearchSpecialityDoctor.Specialization) {
    params.Specialization = SearchSpecialityDoctor.Specialization;
  }

  if (SearchSpecialityDoctor.DoctorName) {
    params.DoctorName = SearchSpecialityDoctor.DoctorName;
  }

  console.log(params,'params------l');
  

  axios
    .get(`${UrlLink}Frontoffice/Total_OP_Patient_with_Multiple_Doc_List`, { params })
    .then((response) => {
      const ress = response.data.appointments;
      setTodayOPCount(response.data.today_total_OP_count);
      setMonthlyOPcount(response.data.monthly_total_OP_count);
      setYearlyOPcount(response.data.yearly_total_OP_count);
      setTotalOPPatient(ress);
    })
    .catch((error) => {
      console.log("Error fetching appointments:", error);
    });
}, [UrlLink, currentView, currentDate, SearchSpecialityDoctor]);


useEffect(() => {
  const postdata = {
    PhoneNo: AppointmentRequestList.PhoneNumber,
    FirstName: AppointmentRequestList.FirstName,
    MiddleName: AppointmentRequestList.MiddleName,
    SurName: AppointmentRequestList.LastName,
  };

  const dataaaa = {
    ...postdata,
    DoctorId: doctorName, 
    Speciality: speciality,
  }

  axios
    .get(`${UrlLink}Frontoffice/Filter_IP_Patients_With_Completed_Status`, {
      params: postdata,
    })
    .then((res) => {
      const data = res.data;
      console.log(data,'dataaaaaaaaa');
      
      setFilterbyPatientId(data);

    })
    .catch((err) => {
      console.log(err);
    });
}, [
  UrlLink,
  AppointmentRequestList.PhoneNumber,
  AppointmentRequestList.FirstName,
  AppointmentRequestList.MiddleName,
  AppointmentRequestList.LastName,
 
  
]);




useEffect(() => {

  console.log(selectedDay,'selectedDay----------1');
  console.log(selectedDoctor,'selectedDoctor--------1');
  

  if (UserData && UserData.location && selectedDoctor && selectedDay) {

    const formattedDate = dayjs(selectedDay).format("YYYY-MM-DD");
    // const formattedDate = new Date(selectedDay).toLocaleDateString('en-CA');

    // const formattedDate = new Date(selectedDay).toISOString().split("T")[0];
    
    console.log(formattedDate,'formattedDate-------1');
    

    axios
      .get(`${UrlLink}Frontoffice/calender_modal_display_data_by_day`, {
        params: {
          DoctorId: selectedDoctor,
          LocationId: UserData.location,
          Date: formattedDate,
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
}, [UrlLink, UserData.location, selectedDay, selectedDoctor]);




useEffect(() => {
  let doctor_schedule = DoctorDayData?.schedule?.[0];
  console.log("RequestDateeeandTimww-------------1", doctor_schedule);

  const prevSelectedTime = prevSelectedTimeRef.current;
  console.log("RequestDateeeandTimww", prevSelectedTime);

  // Update the previous selected time reference
  prevSelectedTimeRef.current = selectedTimeSlotRaw;
  // prevSelectedTimeRef.current = selectedTime;

  // If selectedTime hasn't changed, do nothing
  if (prevSelectedTime === selectedTimeSlotRaw) {
    console.log("time is not changes");
  }
  // if (prevSelectedTime === selectedTime) {
  //   console.log("time is not changes");
  // }


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
        message: `The Doctor Available in ${startTime} to ${endTime}`,
        type: "success",
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
        message: `The Doctor Available in FN : ${startTime_f} to ${endTime_f} or AN  ${startTime_a} to ${endTime_a}`,
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
}, [DoctorDayData, selectedTime,selectedTimeSlotRaw, dispatchvalue]);


useEffect(() => {

  console.log(postdata,'11111111111--------');
  console.log(doctorName,'222222--------');
  console.log(speciality,'33333------------');
  
   
  if (postdata && doctorName && speciality) {
    const data = {
      ...postdata,
      DoctorId: doctorName, 
      Speciality: speciality,
    }
    console.log('Updated postdata with doctor and speciality------------------1', data);
    axios
      .get(`${UrlLink}Frontoffice/get_patient_visit_details`, { params: data })
      .then((res) => {
          const visit = res.data?.VisitPurpose;
          console.log(visit, 'visitttttt-----------------1');

          setAppointmentRequestList((prev) => ({
              ...prev,
              VisitType: visit,
          }));

          // if (UserData && UserData.location) {
          //     setSelectedLocations(UserData.location);
          // }
      })
      .catch((err) => {
          console.error("Error fetching visit details:", err);
      });
  }
}, [postdata,doctorName, speciality, UserData]);




  // useEffect(() => {
  //   if (!selectedTimeSlot) {
  //     const defaultTime = "12:00 PM"; 
  //     setSelectedTimeSlot(defaultTime);
  //   }
  // }, [selectedTimeSlot]);

  const formatTo12Hour = (time) => {
    if (!time) return "";
    let [hours, minutes] = time.split(":").map(Number);
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

 
  
  const convertTo24Hour = (time) => {
    if (!time) return "";
    let [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
  
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };



 



//----------------jeeva----------------------



 
  const clseShowEventForm = () => {
    setShowEventForm(false);
    setAppointmentRequestList({
      Title: "",
      FirstName: "",
      MiddleName: "",
      LastName: "",
      RequestTime: "",

      PhoneNumber: "",
      Age: "",
      Gender: "",
      Email: "",
      Specialization: "",
      DoctorName: "",
      AppointmentType: "",

      ReferredBy: "",
      VisitType: "NewConsultation",
      VisitPurpose:"",
      // remarks: "",

      lastVisitDate: "",
      advisedReviewDate: "",
      reviewedBy: "",
      advisedInstructions: "",

      dueAmount: "",
      lastBookedBy: "",
    });
    setSearchQuery("");

    setSearchSpecialityDoctor({
      Specialization: "", // ✅ Reset Specialization in SearchSpecialityDoctor
      DoctorName: "", // ✅ Reset Doctor Name in SearchSpecialityDoctor
    });

    setTimeSlots(getTimeSlots());
    setDoctorAvailableMonthWiseData([]);

    


  };


  const convertTo24HourFormat = (time12h) => {
    if (!time12h) return "00:00"; // Default value if time is empty
  
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
  
    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
  
    return `${hours}:${minutes}`; // Returns in HH:MM format
  };



  console.log(selectedDay,'selectedDay');


 

  const formatDateToYYYYMMDD = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return ""; // Handle invalid date
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};


  const handleAppointmentRequestSubmit = (e) => {
    e.preventDefault();

    
   

    const AppointmentRequestListData = {
      ...AppointmentRequestList,
      AppointmentID:FilteredAppointmentId,
      Registration_Id:FollowUpPatientRegisterId || "",
      Location: UserRecord?.location,
      CreatedBy: UserRecord?.username,
      PatientId: RegPatientId?.PatientId || null,
      RequestTime: convertTo24HourFormat(selectedTimeSlot), 
      RequestDate: selectedDay ? formatDateToYYYYMMDD(selectedDay) : "", 

      // RequestDate: formatDateToYYYYMMDD(selectedDay),
      
      
      // RequestTime: convertTo24HourFormat(AppointmentRequestList.RequestTime), // Convert time format
      // RequestDate: selectedDay ? selectedDay.toISOString().split("T")[0] : "",
      // VisitPurpose:''

    };
  
    console.log(AppointmentRequestListData, "1-------------Data");
  
    axios
      .post(`${UrlLink}Frontoffice/Appointment_Request_List_Link`, AppointmentRequestListData)
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
        setIsGetData((prev) => !prev);
        setFilteredAppointmentId("")
      })
      .catch((error) => {
        console.log(error);
      });
  
    setShowEventForm(false);
    setAppointmentRequestList({
      Title: "",
      FirstName: "",
      MiddleName: "",
      LastName: "",
      RequestTime: "",
  
      PhoneNumber: "",
      Age: "",
      Gender: "",
      Email: "",
      Specialization: "",
  
      DoctorName: "",
      AppointmentType: "",
  
      ReferredBy: "",
      VisitType: "NewConsultation",
      VisitPurpose: "",
  
      lastVisitDate: "",
      advisedReviewDate: "",
      reviewedBy: "",
      advisedInstructions: "",
  
      dueAmount: "",
      lastBookedBy: "",
    });
    setSelectedTime("");
  };


  // const handleEditEvent = (event) => {
  //   console.log("Edit Event Triggered:", event);
  //   setShowEventForm(true);
    
  //   // const formattedDate = event.RequestDate ? formatDateToDDMMYYYY(event.RequestDate) : null;
    
  //   const formattedDate = event.RequestDate ? new Date(event.RequestDate) : null;
  //   // const formattedDate = event.RequestDate ? new Date(event.RequestDate + "T00:00:00") : null;

  //   setFilteredAppointmentId(event.id)

  //   console.log(formattedDate,'formattedDate');
    
  //   setSelectedDay(formattedDate);
  //   setSelectedTimeSlot(event.RequestTime);
  //   // setSelectedTimeSlot(event.RequestTime || "");
  //   setAppointmentRequestList((prev) => ({
  //       ...prev,
  //       AppointmentID: event.id || "",
  //       Title: event.TitleId || "",  
  //       FirstName: event.FirstName || "",
  //       MiddleName: event.MiddleName || "",
  //       LastName: event.LastName || "",
  //       RequestTime:event.RequestTime || "",
  //       PhoneNumber: event.PhoneNumber || "",
  //       Age: event.Age || "",
  //       Gender: event.Gender || "",
  //       Email: event.Email || "",
  //       Specialization: event.SpecializationId || "",
  //       DoctorName: event.DoctorID || "",
  //       AppointmentType: event.AppointmentType || "",
  //       ReferredBy: event.Referredid || "",
  //       VisitPurpose: event.VisitPurpose,  // Default if empty
        
        
  //   }));
  // };



  const handleEditEvent = (event) => {
    console.log("Edit Event Triggered:", event);
    setShowEventForm(true);

    console.log(event.RequestDate,'event.RequestDate---------1');
    

   
    // ✅ Convert RequestDate from API (YYYY-MM-DD) to Date object
    // const formattedDate = event.RequestDate ? new Date(event.RequestDate) : null;

    let formattedDate = null;
    if (event.RequestDate) {
        const [day, month, year] = event.RequestDate.split("-"); // Split "07-03-2025"
        formattedDate = new Date(`${year}-${month}-${day}`); // Convert to "2025-03-07"
    }
    console.log(formattedDate, "formattedDate");

    setFilteredAppointmentId(event.AppointmentId);

    setSelectedDay(formattedDate);
    setSelectedTimeSlot(event.RequestTime);

    setAppointmentRequestList((prev) => ({
        ...prev,
        AppointmentID: event.id || "",
        Title: event.TitleId || "",
        FirstName: event.FirstName || "",
        MiddleName: event.MiddleName || "",
        LastName: event.LastName || "",
        RequestTime: event.RequestTime || "",
        PhoneNumber: event.PhoneNumber || "",
        Age: event.Age || "",
        Gender: event.Gender || "",
        Email: event.Email || "",
        Specialization: event.SpecializationId || "",
        DoctorName: event.DoctorID || "",
        AppointmentType: event.AppointmentType || "",
        ReferredBy: event.Referredid || "",
        VisitType: event.VisitType,
        VisitPurpose: event.VisitPurpose,
    }));
};


  const handleShowEvent = (event) => {
    console.log(event,'event------Followup');

    setSearchQuery(event?.FirstName)
    setFollowUpPatientRegisterId(event?.Registration_Id)

    const [day, month, year] = event?.FollowupDate.split('-');
    const formattedDate = new Date(`${year}-${month}-${day}`);

    setSelectedDay(formattedDate); // Store as a Date object

    setSelectedTimeSlot(formatTo12Hour(selectedTimeSlotRaw))
    
    setShowEventForm(true);
  }


  const handleArrived = (event) => {
    console.log("Event Triggered for Status Update:", event);

    const appointmentId = event.AppointmentId; // Ensure Appointment ID is present

    const AppointmentRequestListData = {
      AppointmentID: appointmentId,  // ✅ Use event.id directly
      Status: "Arrived",  // ✅ Update only the Status field
      Location: UserRecord?.location, // Optional: Keep if needed for tracking
    };

    console.log("Updating Status:", AppointmentRequestListData);

    axios
      .post(`${UrlLink}Frontoffice/Appointment_Status_Update_Link`, AppointmentRequestListData)
      .then((response) => {
        const resData = response.data;
        console.log("Response Data:", resData);

        const message = Object.values(resData)[0];
        const type = Object.keys(resData)[0];

        const toastData = { message, type };
        dispatchvalue({ type: "toast", value: toastData });

        setIsGetData((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };


  const handleResechedule=(event)=>{
    console.log(event,'event-------------wwww');
    setShowResecheduleForm(true);
    setReScheduleId(event.AppointmentId);
    setRescheduleDocId(event.DoctorID)
  }

  console.log(appointmentList,'appointmentList');


  const handleDocChange = (e) => {
    const { name, value } = e.target;

    console.log(`Change Event: Name=${name}, Value=${value}`);


    if (ReScheduleEdit.RadioOption === 'Date') {
      setReScheduleEdit((prev) => ({
        ...prev,
        [name]: value,
      }));

      console.log(appointmentList,'appointmentList');
      
      // const FilteredAppData = appointmentList.find((row) => row.id === ReScheduleId)
      const FilteredAppData =
        appointmentList?.find((row) => row.id === ReScheduleId) ||
        RescheduleAppointmentList?.find((row) => row.id === ReScheduleId);

      console.log('FilteredApp', FilteredAppData);
      
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
          console.log('DocccccData', res);

        })
        .catch((err) => {
          console.error("Error fetching filtered data:", err);
        });
    }
    if (ReScheduleEdit.RadioOption === 'Doctor') {
      // const FilteredAppData = appointmentList.filter((row) => row.id === ReScheduleId)
      
      const FilteredAppData =
        appointmentList?.find((row) => row.id === ReScheduleId) ||
        RescheduleAppointmentList?.find((row) => row.id === ReScheduleId);

      console.log('FilteredApp', FilteredAppData);

      console.log(value,'value-----------1');
      
      setReScheduleEdit((prev) => ({
        ...prev,
        [name]: value,
      }));

      const formatDateToISO = (dateStr) => {
        const [day, month, year] = dateStr.split("-"); // Split "DD-MM-YYYY"
        return `${year}-${month}-${day}`; // Convert to "YYYY-MM-DD"
      };


      // const formatDateToISO = (dateStr) => {
      //   if (!dateStr || !dateStr.includes("-")) return "";
      //   const [day, month, year] = dateStr.split("-");
      //   return `${year}-${month}-${day}`;
      // };

      // const Dataaas = {
        
      // }

      // console.log(Dataaas,'Dataaas---------------1');
      

      axios
        .get(`${UrlLink}Frontoffice/calender_modal_display_data_by_day`, {
          params: {
            DoctorId: value,
            LocationId: UserData.location,
            Date: formatDateToISO(FilteredAppData?.RequestDate),
            // Date: formatDateToISO(FilteredAppData?.[0]?.RequestDate),
          },
        })
        .then((response) => {
          const res = response.data;
          console.log('DocccccData', res);

          if (res?.schedule?.[0]?.working === 'no') {
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

  const handleCloseModal = () => {
    // setModalIsOpen(false);
    // setOpenModalCancel(false);
    setShowResecheduleForm(false);
    setReScheduleEdit({
      RadioOption: "Date",
      RequestDate: "",
      ChangingReason: "",
      Specialization: "",
      DoctorName: "",
    });
  };


  const handleRescheduleSubmit = () => {
    

    const updatedReschedule = {
        ...ReScheduleEdit,
        AppointmentId: ReScheduleId,
        CreatedBy: UserData?.username,
        // RequestDate: formatDateToYMD(ReScheduleEdit.RequestDate) // ✅ Ensure correct format
        // RequestDate: formatDateToYMD(ReScheduleEdit.RequestDate) // ✅ Ensure correct format
    };

    console.log(updatedReschedule, 'updatedReschedule------1');

    axios
        .post(`${UrlLink}Frontoffice/Appointment_Reschedule_List`, updatedReschedule)
        .then((response) => {
            const ress = response.data;
            const mess = Object.values(ress)[0];
            const typp = Object.keys(ress)[0];
            console.log("submit data", ress);
            console.log("submit data", updatedReschedule);

            const tdata = { message: mess, type: typp };
            dispatchvalue({ type: "toast", value: tdata });
            // setIsGetData2((prev) => !prev);

            setIsGetAppointmentData((prev) => !prev);
            setIsGetData1((prev) => !prev);
            setReScheduleEdit({
                RadioOption: "Date",
                RequestDate: "", // ✅ Clear after submission
                RequestTime: "",
                ChangingReason: "",
                Specialization: "",
                DoctorName: "",
            });

            handleCloseModal();
        })
        .catch((e) => {
            console.log(e);
        });
};


  const handleArrowAction=()=>{
  console.log("");
  }

  const handleDeleteClick = (event) => {
    console.log(event,'event------------1');
    
    setDeleteEventId(event.AppointmentId);
    setDeletePatientName(event.patientName);
    setShowDeleteConfirmation(true);
  };



  // const handleDeleteEvent = () => {
  //   setEvents(events.filter((event) => event.id !== deleteEventId));
  //   setShowDeleteConfirmation(false);
  //   setDeletePatientName(null);
  // };

  const handleDeleteEvent = () => {
    const appointment_id = deleteEventId;

    axios
        .delete(`${UrlLink}Frontoffice/Delete_Appointment/`, {
          params: { appointment_id: appointment_id },  // 👈 sent as query parameter
        })  // ✅ Added `/` before ID
        .then((response) => {
            console.log(response.data.message, 'Appointment deleted successfully'); 

            setEvents(events.filter((event) => event.id !== deleteEventId));
            setShowDeleteConfirmation(false);
            setDeletePatientName(null);

            const tdata = { message: "Appointment deleted successfully", type: "success" };
            dispatchvalue({ type: "toast", value: tdata });
            setDeleteAppointmentData((prev) => !prev);
            setDeleteAppointmentInCalanderData((prev) => !prev);

            
          })
        .catch((error) => {
            console.error("Error deleting appointment:", error);

            const tdata = { message: "Failed to delete appointment", type: "error" };
            dispatchvalue({ type: "toast", value: tdata });
        });
};


  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteEventId(null);
  };


  const handleAppRegister = (event) => {
    console.log('paraaammaaaa',event);
    
    if (event.FirstName && event.PhoneNumber) {
      axios.get(`${UrlLink}Frontoffice/get_appointment_check?FirstName=${event.FirstName}&PhoneNo=${event.PhoneNumber}`)
        .then((res) => {
          const data = res.data;
          console.log('Dataaa', data);
          if (data.success === 'OP') {
            dispatchvalue({
              type: "Registeredit",
              value: { appconversion: true, Type: "OP",...event, ...RegPatientId , ...AppointmentRequestData,AppointmentId:event.id},
              // value: { appconversion: true, Type: "OP",...params, PatientId : RegPatientId?.PatientId || null },
            });
            dispatchvalue({ type: "HrFolder", value: "OPVisitEntry" });
            navigate("/Home/FrontOfficeFolder");
            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });
    
          }
          else if (data.success === 'Master') {
            dispatchvalue({
              type: "Registeredit",
              value: { appconversion: true, Type: "OP", ...event,AppointmentToRegistrationId:event.id },
            });
            dispatchvalue({ type: "HrFolder", value: "NewBasicRegistation" });
            navigate("/Home/FrontOfficeFolder");
            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });
    
          }
        })
    }
    console.log("event-----------------------", event);
  };

  const getWeekDays = () => {
    const weekDays = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      weekDays.push(date);
    }

    return weekDays;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const ampm = i < 12 ? "AM" : "PM";
      slots.push(`${hour.toString().padStart(2, "0")}:00 ${ampm}`);
    }
    return slots;
  };



  useEffect(() => {
    const slots = getTimeSlots();
    setTimeSlots(slots);
    setDefaultTimeSlots(slots); // Store full slots for reference
  }, []);



  
  
  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);

    // Convert to 24-hour format for internal use
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {

      hours = 0;
    }

    return { hours, minutes, period };
  };

  const formatTime = (timeStr) => {
    const { hours, minutes, period } = parseTime(timeStr);
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${period}`;
  };

  
 
  const getDaysInWeek = () => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  };

const getDaysInMonth = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  console.log(year, 'year');
  console.log(monthNames[month], 'month name');
  console.log(month + 1, 'user-friendly month number');
  console.log(month, 'raw JS month (0-based)');

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  console.log(days,'days');
  
  return days;
  
};







  const getViewTitle = () => {
    const options = { month: "long", year: "numeric" };
    if (currentView === "day") {
      return currentDate.toLocaleDateString("default", {
        ...options,
        day: "numeric",
      });
    } else if (currentView === "week") {
      const weekDays = getDaysInWeek();
      const start = weekDays[0].toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      });
      const end = weekDays[6].toLocaleDateString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${start} - ${end}`;
    }
    return currentDate.toLocaleDateString("default", options);
  };


//   const handlePrevious = () => {
//   setCurrentDate((prevDate) => {
//     const newDate = new Date(prevDate);

//     if (currentView === "month") {
//       newDate.setMonth(newDate.getMonth() - 1);
//     } else if (currentView === "week") {
//       newDate.setDate(newDate.getDate() - 7);
//     } else {
//       newDate.setDate(newDate.getDate() - 1);
//     }

//     setDateForDoctor(newDate);
//     console.log(newDate, 'handlePrevious -> newDate');
//     return newDate;
//   });
//   console.log(currentDate, 'currentDate----');

// };





// const handleNext = () => {
//   setCurrentDate((prevDate) => {
//     const newDate = new Date(prevDate);

//     if (currentView === "month") {
//       newDate.setMonth(newDate.getMonth() + 1);
//     } else if (currentView === "week") {
//       newDate.setDate(newDate.getDate() + 7);
//     } else {
//       newDate.setDate(newDate.getDate() + 1);
//     }

//     setDateForDoctor(newDate);
//     console.log(newDate, 'handleNext -> newDate');
//     return newDate;
//   });
// };


  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    
    if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
    setDateForDoctor(newDate);

    console.log(newDate,'newDate----1');

  };


  const handleNext = () => {
    const newDate = new Date(currentDate);
    
    if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
    setDateForDoctor(newDate);

    console.log(newDate,'newDate----2');

  };

  useEffect(() => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based

  setSelectedMonth(month + 1); // human-friendly month number
  setSelectedYear(year);
  console.log(currentDate, '✅ currentDate has been updated');

}, [currentDate]);


  



  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#ff9999"; // Soft Red (More noticeable than #ffcccc)
      case "Rescheduled":
        return "#ffcc80"; // Warm Peach (More visible than #ffd699)
      case "Arrived":
        return "#ffff99"; // Soft Yellow (More readable than #ffffcc)
      case "REGISTERED":
        return "#ffb3c6"; // Soft Pink (Slightly deeper than #ffdae0)
      case "FollowUp":
        return "#cc99ff"; // Violet (Soft Lavender)
      default:
        return "#99e699"; // Fresh Green (More visible than #b3e6b3)
    }
  };

   
  




  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
  
    // Check if date is in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr; // Already correct format
    }
  
    // Check if date is in DD-MM-YYYY format
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
    }
  
    return null; // Invalid format
  };

  
  const renderDayView = () => {
    const rowHeight = 40;
    console.log(events, "events------------");
  
    const eventsByTimeSlot = events
      .filter((event) => event.date && normalizeDate(event.date) === currentDate.toISOString().split("T")[0])
      .reduce((acc, event) => {
        const { hours } = parseTime(event.time);
        const eventKey = hours === 0 ? "all-day" : hours;
        if (!acc[eventKey]) acc[eventKey] = [];
        acc[eventKey].push(event);
        return acc;
      }, {});
  
    console.log("Events by time slot:", eventsByTimeSlot);
  
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimePosition = (currentHour + currentMinute / 60) * 30; // 30px per hour
    
    console.log(currentHour,'currentHour--------');
    console.log(currentMinute,'currentMinute--------');
    console.log(currentTimePosition,'currentTimePosition--------');
    
    const isToday =
      currentDate.getDate() === now.getDate() &&
      currentDate.getMonth() === now.getMonth() &&
      currentDate.getFullYear() === now.getFullYear();
   
      console.log(isToday,'isToday-----');
    
    return (
      <div className="grid grid-cols-[100px_1fr] gap-1">
        {/* Time Labels Column */}
        <div className="time-column">
          {timeSlots.length ? (
            timeSlots.map((time) => (
              <div
                key={time}
                className="text-sm text-gray-500"
                style={{ height: `${rowHeight}px`, display: "flex", alignItems: "center", paddingLeft: "8px" }}
              >
                {time}
              </div>
            ))
          ) : (
            <div>No available slots</div>
          )}
        </div>
  
        {/* Events Grid */}
        <div className="events-column">
          {/* All-Day Events */}
          {eventsByTimeSlot["all-day"]?.length > 0 && (
            <div className="all-day-events bg-gray-100 p-2 rounded mb-2">
              {/* <h4 className="text-sm font-bold">All-Day Events</h4> */}
              {eventsByTimeSlot["all-day"].map((event) => (
                <div
                  key={event.id}
                  className={`p-2 rounded text-sm truncate ${event.color || "bg-gray-200"}`}
                  style={{ 
                    width: "250px",
                    display: "block",
                    marginRight: "5px",

                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    backgroundColor: getStatusColor(event.status) || "#f0f0f0",
                   }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEvent(event.id);
                  }}
                >
                  <strong>{event.patientName}</strong> - {event.status} 
                </div>
              ))}
            </div>
          )}
  
          {/* Time-Slot-Based Events */}
          {timeSlots.map((slot) => {
            const slotHours = parseTime(slot)?.hours;
            return (
              <div
                key={slot}
                className="time-slot-row"
                style={{
                  height: `${rowHeight}px`,
                  borderBottom: "1px solid #f0f0f0",
                  padding: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => {
                  setSelectedDay(currentDate);
                  setSelectedTimeSlot(slot);
                  if (UserData?.Create) {
                    setShowEventForm(true);

                  } else {
                    setShowEventForm(false);

                  }
                  
                }}
              >
                {eventsByTimeSlot[slotHours]?.map((event) => (
                  <div
                    key={event.id}
                    className={`flex-133 p-2 rounded text-sm truncate ${event.color || "bg-gray-200"}`}
                    style={{
                      width: "250px",
                      backgroundColor: getStatusColor(event.status) || "#f0f0f0",
                      display: "block",
                      marginRight: "5px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event.id);
                    }}
                  >
                    {formatTime(event.time)} - <strong>{event.patientName}</strong> - {event.status}
                  </div>
                ))}
              </div>
            );
          })}
  
          {/* Current Time Indicator */}
          {/* {isToday && <div className="current-time-line" style={{ top: `${currentTimePosition}px` }} />} */}
        </div>
      </div>
    );
  };
  
 
    const renderWeekView = () => {
      const weekDays = getWeekDays(); // Get the week days
      const timeSlots = getTimeSlots(); // Get the available time slots
    
      // Convert date format to YYYY-MM-DD for proper matching
      const formatDateToISO = (dateStr) => {
        if (!dateStr) return "";
    
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 4) return dateStr; // Already YYYY-MM-DD
          return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert DD-MM-YYYY → YYYY-MM-DD
        }
        return dateStr;
      };
    
      return (
        <div className="week-calendar-week1">
          {/* Header Row for Days */}
          <div className="header-week-cal">
            <div className="time-column"></div>
            {weekDays.map((day, index) => (
              <div key={index} className="day-header-week-cal">
                {day.toLocaleDateString("default", { weekday: "short", day: "numeric" })}
              </div>
            ))}
          </div>
    
          {/* Body with Time Slots */}
          <div className="body-wwe-cal">
            {timeSlots.map((slot, i) => (
              <div key={i} className="time-row-week-cal">
                <div className="time-label-week-cal">{slot}</div>
    
                {weekDays.map((day, j) => {
                  const dayISO = day.toISOString().split("T")[0]; // Convert current day to ISO format
    
                  console.log("Checking for events on:", dayISO);
    
                  // 🔍 Filter Events for this Day and Time Slot (Including "PENDING" patients)
                  const dayEvents = events.filter((event) => {
                    const eventDateISO = formatDateToISO(event.date);
                    const eventTime = parseTime(event.time);
                    const slotTime = parseTime(slot);
    
                    console.log(
                      "Event:", event.patientName,
                      "Date:", eventDateISO,
                      "Matches Calendar Day:", eventDateISO === dayISO,
                      "Event Time:", event.time,
                      "Matches Slot:", eventTime.hours === slotTime.hours && eventTime.minutes === slotTime.minutes
                    );
    
                    return (
                      eventDateISO === dayISO &&
                      (eventTime.hours === slotTime.hours && eventTime.minutes === slotTime.minutes)
                    );
                  });
    
                  return (
                    <div
                      key={j}
                      className="time-slot-week-cal"
                      onClick={() => {
                        setSelectedDay(day);
                        setSelectedTimeSlot(slot);
                        if (UserData?.Create){
                          setShowEventForm(true);
                        } else {
                          setShowEventForm(false);
                        }

                      }}
                    >
                      {/* Render Events inside the slot */}
                      {dayEvents.map((event, k) => (
                        <div
                          key={k}
                          className="event-week-cal"
                          style={{
                            backgroundColor: getStatusColor(event.status),
                            padding: "4px",
                            borderRadius: "4px",
                            marginBottom: "4px",
                          }}
                        >
                          <strong>
                            {formatTime(event.time)} - {event.patientName} - {event.status}
                          </strong>
                          <br />
                          <span className="text-xs text-gray-700">
                            <strong>{event.DoctorName || ""}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    
  
  



    const formatDateToISO = (dateStr) => {
      if (!dateStr) return "";
      
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        // If already in YYYY-MM-DD, return as is
        if (parts[0].length === 4) return dateStr;
        
        // Convert from DD-MM-YYYY to YYYY-MM-DD
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    };
    
    
    
    const renderMonthView = () => {
      return (
        <div className="grid grid-cols-mnth gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium py-2">
              {day}
            </div>
          ))}

          {getDaysInMonth().map((date, index) => {
            console.log(date,'date-j');
            
            // const isoDate = date?.toISOString().split("T")[0];
            const isoDate = date?.toLocaleDateString("en-CA");
            console.log(isoDate,'isoDate');
            
            const scheduleEntry = doctorScheduleMap[isoDate];
            console.log(scheduleEntry,'scheduleEntry');
            const primarySchedule = scheduleEntry?.schedules?.[0]?.schedules?.[0];
            

            // const handleDayClick = () => {
            //   if (date) {
            //     console.log("Day clicked:", date);
            //     setSelectedDay(date);
            //     setShowEventForm(!!UserData?.Create);
            //   }
            // };

            // const handleDayClick = () => {
            //   if (date) {
            //     console.log("Day clicked:", date);
            //     setSelectedDay(date);

            //     const isAvailable = primarySchedule?.working === "yes";
            //     const hasPermission = !!UserData?.Create;

            //     if (isAvailable && hasPermission) {
            //       setShowEventForm(true);
            //     } else {
            //       console.log("Form not shown. Reason:", {
            //         isAvailable,
            //         hasPermission
            //       });
            //     }
            //   }
            // };

            const handleDayClick = () => {
              if (!date) return;

              const today = new Date();
              today.setHours(0, 0, 0, 0); // Set to start of the day for accurate comparison

              const selected = new Date(date);
              selected.setHours(0, 0, 0, 0); // Also normalize selected date

              const isFutureOrToday = selected >= today;

              setSelectedDay(date);

              const isAvailable = primarySchedule?.working === "yes";
              const hasPermission = !!UserData?.Create;

              if (isAvailable && hasPermission && isFutureOrToday) {
                setShowEventForm(true);
              } else {
                setShowEventForm(false); // Hide the form if it's a past date or not available
                console.log("Form not shown. Reason:", {
                  isAvailable,
                  hasPermission,
                  isFutureOrToday,
                });
              }
            };


            const getAvailabilityStatus = (schedule) => {
              if (schedule?.working === "yes") return "Available";
              if (schedule?.working === "no" && schedule?.leave_remarks) return "Leave";
              return "Not Available";
            };

            const getOPDTiming = (schedule) => {
              if (!schedule) return null;
              if (schedule.shift === "Single") {
                return schedule.total_working_hours_s;
              }

              if (schedule.shift === "Double") {
                return schedule.total_working_hours; 
              }
              return null;
            };

            

            // Tooltip content
            const shift = primarySchedule?.shift;
            const isDouble = shift === "Double";
            const shiftChanged = primarySchedule?.changed === "yes";
            const leaveRemarks = primarySchedule?.leave_remarks;
            const startingTime = primarySchedule?.starting_time;
            const endingTime = primarySchedule?.ending_time;

            const tooltipText = primarySchedule
              ? `Shift: ${shift}\n` +
                (shiftChanged 
                  ? leaveRemarks
                  ? `Remarks: ${leaveRemarks}`
                  
                  : shiftChanged && shift === "Double" 
                  ? `Forenoon: ${primarySchedule.starting_time_f || "--"} - ${primarySchedule.ending_time_f || "--"}\nAfternoon: ${primarySchedule.starting_time_a || "--"} - ${primarySchedule.ending_time_a || "--"}`
                  : `Changed Timing: ${startingTime || "--"} - ${endingTime || "--"}`
                  
                  : isDouble
                  ? `Forenoon: ${primarySchedule.starting_time_f || "--"} - ${primarySchedule.ending_time_f || "--"}\nAfternoon: ${primarySchedule.starting_time_a || "--"} - ${primarySchedule.ending_time_a || "--"}`
                  : `Timing: ${primarySchedule.starting_time || "--"} - ${primarySchedule.ending_time || "--"}`) +
                  `\nTotal Working Hours: ${primarySchedule.total_working_hours_s || primarySchedule.working_hours_s || primarySchedule.total_working_hours ||  "--"}`

              : "";

              // Primary schedule (first one per date)
              const primaryStatus = getAvailabilityStatus(primarySchedule);
              
              console.log(primaryStatus ,'primaryStatus');
              
              // const backgroundColorClass =
              // primaryStatus === "Leave"
              //   ? "bg-red-100"
              //   : shiftChanged
              //   ? "bg-yellow-100"
              //   : shift === "Double"
              //   ? "bg-blue-100"
              //   : primaryStatus === "Available"
              //   ? "bg-green-100"
              //   : "";

              const backgroundColorClass =
              primaryStatus === "Leave"
                ? "bg-red-100"
                : primaryStatus === "Available"
                ? shiftChanged
                  ? "bg-orange-300 border border-orange-600 text-orange-900"
                  : shift === "Double"
                  ? "bg-blue-300"
                  : "bg-green-100"
                : "bg-gray-400"; // fallback for "Not Available"

              console.log({ primaryStatus, shift, shiftChanged, backgroundColorClass },'wwwww-j');


              const backgroundColorStyle = {
                backgroundColor: "#f0f0f0", 
                ...(
                  primarySchedule && {
                    backgroundColor:
                      primaryStatus === "Leave"
                        ? "#fdecea"
                        : primaryStatus === "Available"
                        ? shiftChanged && leaveRemarks
                          ? "#ffe5b4" // light orange
                          : shiftChanged && shift === "Double"
                          ? "#d0e2ff" // light blue
                          : "#e6f4ea" // light green
                        : "#eeeeee", // light gray for Not Available
                    border: shiftChanged && leaveRemarks ? "1px solid #ffa500" : "1px solid #cccccc",
                    color: shiftChanged && leaveRemarks ? "#cc7000" : "inherit",
                  }
                )
              };

             

            return (
              <div
                key={index}
                title={tooltipText}
                // className={`min-h-24 p-1 border text-xs border-gray-50 ${
                //   date ? "hover:bg-gray-50 cursor-pointer" : ""
                // } ${backgroundColorClass}`}

                className={`min-h-24 p-1 border text-xs border-gray-200 ${date ? "hover:bg-gray-100 cursor-pointer" : ""}`}
                style={backgroundColorStyle}

                onClick={handleDayClick}
              >
                {date && (
                  <>
                    <div className="text-sm p-1">{date.getDate()}</div>

                    {(scheduleEntry?.schedules?.[0]?.schedules || []).map(
                      (schedule, i) => (
                        <div key={i} className="mb-1 pb-1">
                          <div
                            className="text-[10px] font-bold px-1 rounded"
                            style={{
                              color:
                                getAvailabilityStatus(schedule) === "Available"
                                  ? "#0f9d58"
                                  : getAvailabilityStatus(schedule) === "Leave"
                                  ? "#f4b400"
                                  : "#db4437",
                              backgroundColor:
                                getAvailabilityStatus(schedule) === "Available"
                                  ? "#e6f4ea"
                                  : getAvailabilityStatus(schedule) === "Leave"
                                  ? "#fff8e1"
                                  : "#fdecea",
                            }}
                          >
                            Status: {getAvailabilityStatus(schedule)}
                          </div>



                          {getOPDTiming(schedule) && (
                            <div className="text-[10px]">
                              OPD: {getOPDTiming(schedule)}
                            </div>
                          )}

                          {schedule.leave_remarks && (
                            <div className="text-[10px] text-red-500">
                              Remarks: {schedule.leave_remarks}
                            </div>
                          )}
                        </div>
                      )
                    )}

                    {/* Events ---Show Patient name and time on that date box in month view */} 

                    {/* <div className="space-y-1">
                      {events
                        .filter((event) => {
                          const eventDateISO = formatDateToISO(event.date);
                          const selectedDateISO = new Date(
                            date.getTime() - date.getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .split("T")[0];
                          return eventDateISO === selectedDateISO;
                        })
                        .map((event) => (
                          <div
                            key={event.id}
                            className="p-1 rounded text-xs truncate"
                            style={{
                              backgroundColor: getStatusColor(event.status),
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event.id);
                            }}
                          >
                            {event.time === "00:00" ? "12:00 AM" : event.time} -{" "}
                            {event.patientName}
                          </div>
                        ))}
                    </div> */}
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    };








    // const renderMonthView = () => (
    //   <div className="grid grid-cols-mnth gap-1">
    //     {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
    //       <div key={day} className="text-center text-sm font-medium py-2">
    //         {day}
    //       </div>
    //     ))}
    
    //     {getDaysInMonth().map((date, index) => (
    //       <div
    //         key={index}
    //         className={`min-h-24 p-1 border border-gray-100 ${date ? "hover:bg-gray-50 cursor-pointer" : ""}`}
    //         onClick={() => {
    //           if (date) {
    //             setSelectedDay(date);
    //             if (UserData?.Create){
    //               setShowEventForm(true);
    //             } else {
    //               setShowEventForm(false);
    //             }
    //           }
    //         }}
    //       >
    //         {date && (
    //           <>
    //             <div className="text-sm p-1">{date.getDate()}</div>
    //             <div className="space-y-1">
    //               {events
    //                 .filter((event) => {
    //                   const eventDateISO = formatDateToISO(event.date);
    
    //                   const selectedDateISO = new Date(
    //                     date.getTime() - date.getTimezoneOffset() * 60000
    //                   ).toISOString().split("T")[0];
    
    //                   console.log(
    //                     `Event: ${event.patientName} - Event Date: ${eventDateISO} - Calendar Date: ${selectedDateISO}`,
    //                     "📅 Debug Month View"
    //                   );
    
    //                   return eventDateISO === selectedDateISO;
    //                 })
    //                 .map((event) => (
    //                   <div
    //                     key={event.id}
    //                     className="p-1 rounded text-xs truncate"
    //                     style={{ backgroundColor: getStatusColor(event.status) }}
    //                     onClick={(e) => {
    //                       e.stopPropagation();
    //                       handleEditEvent(event.id);
    //                     }}
    //                   >
    //                     {event.time === "00:00" ? "12:00 AM" : event.time} - {event.patientName}
    //                   </div>
    //                 ))}
    //             </div>
    //           </>
    //         )}
    //       </div>
    //     ))}


    //   </div>
    // );
    



  const renderSchedule = () => {
    console.log("Rendering schedule...",appointmentList);
  
    // Filter Pending Appointments (excluding Rescheduled)
    const filteredPendingEvents = appointmentList.filter((event) => {
      if (!event?.Status) return false;
      return event.Status.toUpperCase() === "PENDING"; 
    });
    const filteredArrivedEvents = appointmentList.filter((event) => {
      if (!event?.Status) return false;
      const [day, month, year] = event.RequestDate.split("-");
      const formattedRequestDate = `${year}-${month}-${day}`;
      // && formattedRequestDate === currentDate.toISOString().split("T")[0]
      return event.Status.toUpperCase() === "ARRIVED"; 
    });
  
    // Filter Registered Appointments
    const filteredRegisteredEvents = appointmentList.filter((event) => {
      if (!event?.Status) return false;
      return event.Status.toUpperCase() === "REGISTERED"; 
    });

    // const filteredOPRegisteredEvents = appointmentList.filter((event) => {
    //   if (!event?.Status) return false;
    //   return event.Status.toUpperCase() === "OPREGISTERED"; 
    //   console.log(event.Status.toUpperCase() === "OPREGISTERED",'11---------------');
      
    // });


    const filteredOPRegisteredEvents = appointmentList.filter((event) => {
      if (!event?.Status) return false; // Ensure Status exists
  
      const statusUpper = event.Status.toUpperCase();
      console.log(statusUpper === "OPREGISTERED", "11---------------", statusUpper);
  
      return statusUpper === "OPREGISTERED"; 
    });

    


  
  
    // Filter Rescheduled Appointments separately
    const filteredRescheduleEvents = RescheduleAppointmentList.filter((event) => {
      if (!event?.Status) return false;
      return event.Status.toUpperCase() === "RESCHEDULE";
    });
  
    console.log("Filtered Pending Events:", filteredPendingEvents);
    console.log("Filtered Registered Events:", filteredRegisteredEvents);
    console.log("Filtered Rescheduled Events:", filteredRescheduleEvents);
    console.log("Filtered Arrived Events:", filteredArrivedEvents);
    console.log("Filtered OP Registered Events:", filteredOPRegisteredEvents);
  
    return (
      <div>
        {/* Tabs for selecting appointment type */}
        <div className="shadow_new_0_head">
          <div className="shadow_new_0" onClick={() => setActiveTab("Pending")}>
            <h1 style={{ color: "red"}}>
              {AppointmentRequestData.pending_count || 0}
            </h1>
            <h5 style={{ color: "red"}}>Pending</h5>
          </div>

          

          <div className="shadow_new_0" onClick={() => setActiveTab("Arrived")}>
            <h1 style={{ color: "#FFD700"}}> 
              {AppointmentRequestData.Arrived_count || 0}
            </h1>
            <h5 style={{ color: "#FFD700"}}>Arrived</h5>
          </div>

          <div className="shadow_new_0" onClick={() => setActiveTab("Rescheduled")}>
            <h1 style={{ color: "#FFA500" }}>
              {AppointmentRescheduleRequestData.Reschedule_count || 0}
            </h1>
            <h5 style={{ color: "#FFA500" }}>Rescheduled</h5>
          </div>

          <div className="shadow_new_0" onClick={() => setActiveTab("Registered")}>
            <h1 style={{ color: "#FF1493" }}>
              {AppointmentRequestData.registered_count || 0}
            </h1>
            <h5 style={{ color: "#FF1493" }}>Registered</h5>
          </div>

          <div className="shadow_new_0" onClick={() => setActiveTab("OpRegistered")}>
            <h1 style={{ color: "#006400" }}>
              {AppointmentRequestData.OpRegistered_count || 0}
            </h1>
            <h5 style={{ color: "#006400" }}>OP Count</h5>
          </div>
          
          {/* <div className="shadow_new_0" onClick={() => setActiveTab("Followup")}>
            <h1 style={{ color: "#9400D3" }}>
              {FollowUpPatientData.followup_count || 0}
            </h1>
            <h5 style={{ color: "#9400D3" }}>Followup Count</h5>
          </div> */}

          <div className="shadow_new_0" onClick={() => setActiveTab("Followup")}>
            <h1 style={{ color: "#9400D3" }}>
              {FollowUpPatientData?.followup_patients?.filter((p) => p.Status === true).length || 0}
            </h1>
            <h5 style={{ color: "#9400D3" }}>Followup Count</h5>
          </div>

          <div className="shadow_new_0" onClick={() => setActiveTab("TodayOPPatient")}>
            <h1 style={{ color: "#4169E1" }}>
              {TodayOPCount}
            </h1>
            <h5 style={{ color: "#4169E1" }}>Today OP Patient</h5>
          </div>

          <div className="shadow_new_0" onClick={() => setActiveTab("MonthlyOPPatient")}>
            <h1 style={{ color: "#FF6347" }}>
              {MonthlyOPcount}
            </h1>
            <h5 style={{ color: "#FF6347" }}>Monthly OP Patient</h5>
          </div>

          {/* <div className="shadow_new_0" onClick={() => setActiveTab("YearlyOPPatient")}>
            <h1 style={{ color: "#9400D6" }}>
              {YearlyOPcount}
            </h1>
            <h5 style={{ color: "#9400D3" }}>Total Registered</h5>
          </div> */}

          <div className="shadow_new_0" onClick={() => setActiveTab("YearlyOPPatient")}>
            <h1 style={{ color: "#00BFFF" }}>
              {YearlyOPcount}
            </h1>
            <h5 style={{ color: "#00BFFF" }}>Yearly OP Patient</h5>
          </div>

          
        </div>

        <br />

        {/* Search Patient Here */}

        <div className="RegisFormcon" id="RegisFormcon_11">
          <div className="RegisForm_1">
              <label> Search Here <span>:</span> </label>
              <input
                list="patients" 
                type="text"
                value={SearchPatientQuery}
                onChange={handleSearchChange} 
                onKeyDown={(e) => e.key === 'Enter' && HandleSearchPatientWithStatus()} 
              />
              <datalist id="patients"> 
                  {FilterbyPatientStatus.map((row, indx) => (
                      <option key={indx} value={row.PhoneNo}>
                          {`${row.PhoneNo} | ${row.FirstName} | ${row.Status}`}
                          {/* {`${row.PhoneNo} | ${row.FirstName} `}   */}
                      </option>
                  ))}
              </datalist>
  
              <span>
                  <PersonSearchIcon onClick={HandleSearchPatientWithStatus} /> 
              </span>
          </div>
        </div> 
        <br />
        {/* Schedule toggle */}
        <div className="schedule-toggle mt-4 mb-4">
          
          <div className="flex items-center space-x-4 ertwet_ygyty">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radioe"
                name="scheduleView"
                value="today"
                checked={scheduleView === "today"}
                onChange={(e) => setScheduleView(e.target.value)}
              />
              <span className="ml-2w">Today's Schedule</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radioe"
                name="scheduleView"
                value="overall"
                checked={scheduleView === "overall"}
                onChange={(e) => setScheduleView(e.target.value)}
              />
              <span className="ml-2w">Overall Schedule</span>
            </label>
          </div>
        </div>
  
        {/* Display Pending Appointments */}
        {activeTab === "Pending" && filteredPendingEvents.length > 0 && (
          <div className="rgtrg_jhj">
            <h4>Pending Patients</h4>
            <br/>
            <div className="space-y-4">

              {filteredPendingEvents
              .filter((event) => {
              if (!SearchPatientQuery) return true; // Show all if no query
              const phoneMatch = event.PhoneNumber?.includes(SearchPatientQuery);
              const nameMatch = event.Fullname?.toLowerCase().includes(SearchPatientQuery.toLowerCase());
              return phoneMatch || nameMatch;
              })
              .map((event) => (
                <div key={event.id} className="flex fdsfe items-center border-b py-2">
                  <div>
                    
                    <div className="dyusyude_8">
                      <strong>Patient Name<span>:</span></strong>
                      <h4>{event.Fullname}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Scheduled at<span>:</span></strong>
                      <h4>{event.RequestTime}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>DoctorName<span>:</span></strong>
                      <h4>{event.DoctorName}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Phone<span>:</span></strong>
                      <h4>{event.PhoneNumber}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Date<span>:</span></strong>
                      <h4>{event.RequestDate}</h4>
                    </div>

                     {/* {scheduleView === "overall" && (
                      <div className="dyusyude_8">
                        <strong>Date<span>:</span></strong>
                        <h4>{event.RequestDate}</h4>
                      </div>
                    )}  */}

                    {/* <div className="dyusyude_8">
                      <strong>Status<span>:</span></strong>
                      <h4 style={{ color: "red" }}>{event.Status}</h4>
                    </div> */}

                    <div className="flex gap-2" style={{justifyContent:'space-between'}}>
                    
                    {UserData?.Edit ? (
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    ) : (
                      <button disabled className="text-gray-400 cursor-not-allowed">
                        <Edit className="h-4 w-4" />
                      </button>
                    )}

                    {UserData?.Edit ? (
                      <button
                        onClick={() => handleArrived(event)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : (
                      <button disabled className="text-gray-400 cursor-not-allowed">
                        <Check className="h-4 w-4" />
                      </button>
                    )}

                      {UserData?.Edit ? (
                        <button
                        onClick={() =>
                          handleResechedule(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <CalendarClock  className="h-4 w-4" />
                      </button>

                      ) : (
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <CalendarClock className="h-4 w-4" />
                        </button>
                      )}
                      


                      {UserData?.Delete ? (
                        <button
                          onClick={() =>
                            handleDeleteClick(event)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      ):(
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <Trash className="h-4 w-4" />
                        </button>
                      )
                      }
                      
                    
                      {/* <button
                        onClick={() =>{
                          
                          handleAppRegister(event)
                          // handleArrowAction(event)
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button> */}
                    </div>


                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === "Arrived" && filteredArrivedEvents.length > 0 && (
          <div className="rgtrg_jhj">
            <h4>Arrived Patients</h4>
            <br/>
            <div className="space-y-4">

              {filteredArrivedEvents
              .filter((event) => {
                if (!SearchPatientQuery) return true; // Show all if no query
                const phoneMatch = event.PhoneNumber?.includes(SearchPatientQuery);
                const nameMatch = event.Fullname?.toLowerCase().includes(SearchPatientQuery.toLowerCase());
                return phoneMatch || nameMatch;
              })
              .map((event) => {
                
                return(
                  <div key={event.id} className="flex fdsfe items-center border-b py-2">
                    <div>
                      
                      <div className="dyusyude_8">
                        <strong>Patient Name<span>:</span></strong>
                        <h4>{event.Fullname}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>Scheduled at<span>:</span></strong>
                        <h4>{event.RequestTime}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>DoctorName<span>:</span></strong>
                        <h4>{event.DoctorName}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>Phone<span>:</span></strong>
                        <h4>{event.PhoneNumber}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>Date<span>:</span></strong>
                        <h4>{event.RequestDate}</h4>
                      </div>

                      {/* {scheduleView === "overall" && (
                        <div className="dyusyude_8">
                          <strong>Date<span>:</span></strong>
                          <h4>{event.RequestDate}</h4>
                        </div>
                      )} */}

                      {/* <div className="dyusyude_8">
                        <strong>Status<span>:</span></strong>
                        <h4 style={{ color: "violet" }}>{event.Status}</h4>
                      </div> */}
                      <div className="flex gap-2" style={{justifyContent:'space-between'}}>
                        {UserData?.Edit ? (
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-500 hover:text-blue-700"
                            >
                            <Edit className="h-4 w-4" />
                          </button>
                          ):(
                            <button disabled className="text-gray-400 cursor-not-allowed">
                              <Edit className="h-4 w-4" />
                            </button>
                        )}

                        {UserData?.Edit ? (
                          <button
                            onClick={() =>
                              handleResechedule(event)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <CalendarClock  className="h-4 w-4" />
                          </button>
                          ):(
                            <button disabled className="text-gray-400 cursor-not-allowed">
                              <CalendarClock className="h-4 w-4" />
                            </button>
                        )}


                        {UserData?.Delete ? (
                          <button
                            onClick={() =>
                              handleDeleteClick(event)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        ):(
                          <button disabled className="text-gray-400 cursor-not-allowed">
                            <Trash className="h-4 w-4" />
                          </button>
                        )}

                        {UserData?.Create ? (
                          <button
                            onClick={() =>{
                              handleAppRegister(event)
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        ):(
                          <button disabled className="text-gray-400 cursor-not-allowed">
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}

                      </div>
                    </div>
                  </div>

                )
                
              })}
            </div>
          </div>
        )}


        {/* Display Rescheduled Appointments */}
        {activeTab === "Rescheduled" && filteredRescheduleEvents.length > 0 && (
          <div className="rgtrg_jhj mt-6">
            <h4>Appointment Rescheduled Patients</h4>
            <br/>
            <div className="space-y-4">
              {filteredRescheduleEvents
              .filter((event) => {
                if (!SearchPatientQuery) return true; // Show all if no query
                const phoneMatch = event.PhoneNumber?.includes(SearchPatientQuery);
                const nameMatch = event.Fullname?.toLowerCase().includes(SearchPatientQuery.toLowerCase());
                return phoneMatch || nameMatch;
              })
              .map((event) => (
                <div key={event.id} className="flex fdsfe items-center border-b py-2">
                  <div>
                    <div className="dyusyude_8">
                      <strong>Patient Name<span>:</span></strong>
                      <h4>{event.Fullname}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Rescheduled at<span>:</span></strong>
                      <h4>{event.RequestTime}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>DoctorName<span>:</span></strong>
                      <h4>{event.DoctorName}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Phone<span>:</span></strong>
                      <h4>{event.PhoneNumber}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Date<span>:</span></strong>
                      <h4>{event.RequestDate}</h4>
                    </div>

                    {/* {scheduleView === "overall" && (
                      <div className="dyusyude_8">
                        <strong>New Date<span>:</span></strong>
                        <h4>{event.RequestDate}</h4>
                      </div>
                    )} */}
                    {/* <div className="dyusyude_8">
                      <strong>Status<span>:</span></strong>
                      <h4 style={{ color: "blue" }}>{event.Status}</h4>
                    </div> */}

                    <div className="flex gap-2" style={{justifyContent:'space-between'}}>
                      {UserData?.Edit ? (
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      ) : (
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <Edit className="h-4 w-4" />
                        </button>
                      )}

                      {UserData?.Edit ? (
                        <button
                        onClick={() =>
                          handleResechedule(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <CalendarClock  className="h-4 w-4" />
                      </button>

                      ) : (
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <CalendarClock className="h-4 w-4" />
                        </button>
                      )}

                      {UserData?.Delete ? (
                        <button
                          onClick={() =>
                            handleDeleteClick(event)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      ):(
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <Trash className="h-4 w-4" />
                        </button>
                      )}

                      {UserData?.Edit ? (
                        <button
                          onClick={() => handleArrived(event)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      ) : (
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <Check className="h-4 w-4" />
                        </button>
                      )}



                    {/* <button
                      onClick={() =>
                        handleArrowAction(event)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button> */}
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Display Registered Appointments */}
        {activeTab === "Registered" && filteredRegisteredEvents.length > 0 && (
          <div className="rgtrg_jhj">
            <h4>Appointment to Registered Patients</h4>
            <br/>
            <div className="space-y-4">
              {filteredRegisteredEvents
              .filter((event) => {
                if (!SearchPatientQuery) return true; // Show all if no query
                const phoneMatch = event.PhoneNumber?.includes(SearchPatientQuery);
                const nameMatch = event.Fullname?.toLowerCase().includes(SearchPatientQuery.toLowerCase());
                return phoneMatch || nameMatch;
              })
              .map((event) => (
                <div key={event.id} className="flex fdsfe items-center border-b py-2">
                  <div>
                    <div className="dyusyude_8">
                      <strong>Patient Name<span>:</span></strong>
                      <h4>{event.Fullname}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Scheduled at<span>:</span></strong>
                      <h4>{event.RequestTime}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>DoctorName<span>:</span></strong>
                      <h4>{event.DoctorName}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Phone<span>:</span></strong>
                      <h4>{event.PhoneNumber}</h4>
                    </div>
                    {/* {scheduleView === "overall" && (
                      <div className="dyusyude_8">
                        <strong>Date<span>:</span></strong>
                        <h4>{event.RequestDate}</h4>
                      </div>
                    )} */}
                    {/* <div className="dyusyude_8">
                      <strong>Status<span>:</span></strong>
                      <h4 style={{ color: "green" }}>{event.Status}</h4>
                    </div> */}
                    
                    {/* <div className="flex gap-2">
                    
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleResechedule(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <CalendarClock  className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteClick(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleArrived(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleAppRegister(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>


                    </div> */}

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === "OpRegistered" && filteredOPRegisteredEvents.length > 0 && (
          <div className="rgtrg_jhj">
            <h4> Appointment to OP Registered Patients</h4>
            <br/>
            <div className="space-y-4">
              {filteredOPRegisteredEvents
              .filter((event) => {
                if (!SearchPatientQuery) return true; // Show all if no query
                const phoneMatch = event.PhoneNumber?.includes(SearchPatientQuery);
                const nameMatch = event.Fullname?.toLowerCase().includes(SearchPatientQuery.toLowerCase());
                return phoneMatch || nameMatch;
              })
              .map((event) => (
                <div key={event.id} className="flex fdsfe items-center border-b py-2">
                  <div>
                    <div className="dyusyude_8">
                      <strong>Patient Name<span>:</span></strong>
                      <h4>{event.Fullname}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Scheduled at<span>:</span></strong>
                      <h4>{event.RequestTime}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>DoctorName<span>:</span></strong>
                      <h4>{event.DoctorName}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Phone<span>:</span></strong>
                      <h4>{event.PhoneNumber}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Date<span>:</span></strong>
                      <h4>{event.RequestDate}</h4>
                    </div>
                    {/* {scheduleView === "overall" && (
                      <div className="dyusyude_8">
                        <strong>Date<span>:</span></strong>
                        <h4>{event.RequestDate}</h4>
                      </div>
                    )} */}
                    {/* <div className="dyusyude_8">
                      <strong>Status<span>:</span></strong>
                      <h4 style={{ color: "green" }}>{event.Status}</h4>
                    </div> */}

                    {/* <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleResechedule(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <CalendarClock  className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteClick(event.id, event.patientName)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleArrived(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleArrowAction(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div> */}

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === "Followup" && FollowUpPatientData.followup_patients.length > 0 && (
          <div className="rgtrg_jhj">
            <h4>OP Registered Follow-Up Patients</h4>
            <br/>
            <div className="space-y-4">
              {FollowUpPatientData.followup_patients
            
              .filter((event) => {
                const hasStatus = event.Status === true;

                if (!SearchPatientQuery) return hasStatus; // Only show if Status is true

                const phoneMatch = event.PhoneNumber?.includes(SearchPatientQuery);  // note: PhoneNo, not PhoneNumber
                const nameMatch = event.Fullname?.toLowerCase().includes(SearchPatientQuery.toLowerCase());

                return hasStatus && (phoneMatch || nameMatch);
              })

              .map((event) => (
                <div key={event.id} className="flex fdsfe items-center border-b py-2">
                  <div>
                    <div className="dyusyude_8">
                      <strong>Patient Name<span>:</span></strong>
                      <h4>{event.PatientName}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Scheduled at<span>:</span></strong>
                      <h4>{event.FollowupDate}</h4>
                    </div>
                    {/* <div className="dyusyude_8">
                      <strong>DoctorName<span>:</span></strong>
                      <h4>{event.DoctorName}</h4>
                    </div> */}
                    <div className="dyusyude_8">
                      <strong>Phone<span>:</span></strong>
                      <h4>{event.PhoneNo}</h4>
                    </div>
                    {/* {scheduleView === "overall" && (
                      <div className="dyusyude_8">
                        <strong>Date<span>:</span></strong>
                        <h4>{event.RequestDate}</h4>
                      </div>
                    )} */}
                    {/* <div className="dyusyude_8">
                      <strong>Status<span>:</span></strong>
                      <h4 style={{ color: "green" }}>{event.Status}</h4>
                    </div> */}

                    <div className="flex gap-2" style={{justifyContent:'space-between'}}>
                      {UserData?.Create ? (
                        <button
                          onClick={() => handleShowEvent(event)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <EventRepeatIcon className="h-4 w-4" />
                        </button>
                      ):(
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <EventRepeatIcon className="h-4 w-4" />
                        </button>
                      )}
                      
                      
                      {/* <button
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleArrived(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Check className="h-4 w-4" />
                      </button> */}
                      
                      {UserData?.Edit ? (
                        <button
                        onClick={() =>
                          handleResechedule(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <CalendarClock  className="h-4 w-4" />
                      </button>

                      ) : (
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <CalendarClock className="h-4 w-4" />
                        </button>
                      )}

                      {UserData?.Delete ? (
                        <button
                          onClick={() =>
                            handleDeleteClick(event)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      ):(
                        <button disabled className="text-gray-400 cursor-not-allowed">
                          <Trash className="h-4 w-4" />
                        </button>
                      )
                      }
                    
                      {/* <button
                        onClick={() =>{
                          
                          handleAppRegister(event)
                          // handleArrowAction(event)
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button> */}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       
        {activeTab === "TodayOPPatient" && Array.isArray(TotalOPPatient) && TotalOPPatient.length > 0 && (
          <div className="rgtrg_jhj">
            <h4> Today OP Patients </h4>
            <br/>
            <div className="space-y-4">
              {TotalOPPatient
              .filter((event) => {
                const eventDate = event.RequestDate; // Already in DD-MM-YYYY format
                const isToday = eventDate === formattedToday;

                if (!isToday) return false;

                if (!SearchPatientQuery) return true;

                const phoneMatch = event.PhoneNo?.includes(SearchPatientQuery);
                const nameMatch = event.PatientName?.toLowerCase().includes(SearchPatientQuery.toLowerCase());

                return phoneMatch || nameMatch;
              })
              .map((event) => (
                <div key={event.id} className="flex fdsfe items-center border-b py-2">
                  <div>
                    <div className="dyusyude_8">
                      <strong>Patient Name<span>:</span></strong>
                      <h4>{event.PatientName}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Scheduled at<span>:</span></strong>
                      <h4>{event.RequestTime}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>DoctorName<span>:</span></strong>
                      <h4>{event.DoctorName}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Phone<span>:</span></strong>
                      <h4>{event.PhoneNo}</h4>
                    </div>
                    <div className="dyusyude_8">
                      <strong>Date<span>:</span></strong>
                      <h4>{event.RequestDate}</h4>
                    </div>
                    {/* {scheduleView === "overall" && (
                      <div className="dyusyude_8">
                        <strong>Date<span>:</span></strong>
                        <h4>{event.RequestDate}</h4>
                      </div>
                    )} */}
                    {/* <div className="dyusyude_8">
                      <strong>Status<span>:</span></strong>
                      <h4 style={{ color: "green" }}>{event.Status}</h4>
                    </div> */}

                    {/* <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleResechedule(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <CalendarClock  className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteClick(event.id, event.patientName)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleArrived(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleArrowAction(event)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div> */}

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "MonthlyOPPatient" && Array.isArray(TotalOPPatient) && TotalOPPatient.length > 0 && (
          <div className="rgtrg_jhj">
            <h4>Monthly OP Patients</h4>
            <br />
            <div className="space-y-4">
              {TotalOPPatient
                .filter((event) => {
                  const [day, month, year] = event.RequestDate.split("-").map(Number);
                  const eventDate = new Date(year, month - 1, day);
                 
                  const [fdDay, fdMonth, fdYear] = formattedToday.split("-").map(Number);
                  const formattedTodayDate = new Date(fdYear, fdMonth - 1, fdDay);

                  const isThisMonth =
                    eventDate.getMonth() === formattedTodayDate.getMonth() &&
                    eventDate.getFullYear() === formattedTodayDate.getFullYear();

                  if (!isThisMonth) return false;

                  if (!SearchPatientQuery) return true;

                  const normalizedName = event.PatientName?.replace(/\s+/g, " ").trim().toLowerCase();
                  const search = SearchPatientQuery.trim().toLowerCase();

                  const phoneMatch = event.PhoneNo?.includes(search);
                  const nameMatch = normalizedName?.includes(search);

                  return phoneMatch || nameMatch;
                })
                .sort((a, b) => {
                  const [dayA, monthA, yearA] = a.RequestDate.split("-").map(Number);
                  const [dayB, monthB, yearB] = b.RequestDate.split("-").map(Number);
                  return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
                })
                .map((event) => (
                  <div key={event.id} className="flex fdsfe items-center border-b py-2">
                    <div>
                      <div className="dyusyude_8">
                        <strong>Patient Name<span>:</span></strong>
                        <h4>{event.PatientName}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>Scheduled at<span>:</span></strong>
                        <h4>{event.RequestTime}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>DoctorName<span>:</span></strong>
                        <h4>{event.DoctorName}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>Phone<span>:</span></strong>
                        <h4>{event.PhoneNo}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>Date<span>:</span></strong>
                        <h4>{event.RequestDate}</h4>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "YearlyOPPatient" && Array.isArray(TotalOPPatient) && TotalOPPatient.length > 0 && (
          <div className="rgtrg_jhj">
            <h4>Yearly OP Patients</h4>
            <br />
            <div className="space-y-4">
              {TotalOPPatient
                .filter((event) => {
                  const eventYear = parseInt(event.RequestDate.split("-")[2]); // "DD-MM-YYYY" → get year

                  const currentYear = parseInt(formattedToday.split("-")[2]); // same format

                  if (eventYear !== currentYear) return false;

                  if (!SearchPatientQuery) return true;

                  const normalizedName = event.PatientName?.replace(/\s+/g, " ").trim().toLowerCase();
                  const search = SearchPatientQuery.trim().toLowerCase();

                  return (
                    event.PhoneNo?.includes(search) ||
                    normalizedName.includes(search)
                  );
                })
                .map((event) => (
                  <div key={event.id} className="flex fdsfe items-center border-b py-2">
                    <div>
                      <div className="dyusyude_8">
                        <strong>Patient Name<span>:</span></strong>
                        <h4>{event.PatientName}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>Scheduled at<span>:</span></strong>
                        <h4>{event.RequestTime}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>DoctorName<span>:</span></strong>
                        <h4>{event.DoctorName}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>Phone<span>:</span></strong>
                        <h4>{event.PhoneNo}</h4>
                      </div>
                      <div className="dyusyude_8">
                        <strong>Date<span>:</span></strong>
                        <h4>{event.RequestDate}</h4>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}





      </div>
    );

  };
  





  return (
    <div className="edwueyu_08i">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* <button
              onClick={() => setShowEventForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              Create
            </button> */}
            <div className="flex items-center gap-2 efwf_hg">
              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="text-xl font-semibold">{getViewTitle()}</h2>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="ftftrwfs_8y">
          
            <div className="wdiuwq_cdj8">
              <label htmlFor="input">
                Speciality<span>:</span>
              </label>
              <select
                name="Specialization"
                value={SearchSpecialityDoctor.Specialization}
                onChange={HandleOnchange}
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

            <div className="wdiuwq_cdj8">
              <label htmlFor="input">
                Doctor Name<span>:</span>
              </label>

              {/* <select
                name="DoctorName"
                value={SearchSpecialityDoctor.DoctorName}
                onChange={HandleOnchange}
              >
                <option value="">Select</option>

                {DoctorData &&
                  Array.isArray(DoctorData) &&
                  DoctorData.length !== 0 &&
                  [...new Map(
                    DoctorData
                      .filter(p => p.schedule?.[0]?.working === 'yes')
                      .map(obj => [obj.doctor_id, obj])
                  ).values()]
                    // .sort((a, b) => a.doctor_name.localeCompare(b.doctor_name)) // optional
                    .map((row, indx) => (
                      <option key={indx} value={row.doctor_id}>
                        {row.doctor_name}
                      </option>
                    ))
                }

              </select> */}

              <select
                name="DoctorName"
                value={SearchSpecialityDoctor.DoctorName}
                onChange={HandleOnchange}
              >
                <option value="">Select</option>

                {DoctorData && Array.isArray(DoctorData) && DoctorData.length !== 0 && DoctorData?.filter(
                  p => p.schedule?.some(s => s.working === 'yes')
                  // p => p.schedule?.[0]?.working === 'yes'
                ).map((row, indx) => (
                  <option key={indx} value={row.doctor_id}>
                    {row.doctor_name}
                  </option>
                ))}

              </select>

            </div>

          </div>


          <div className="flex gap-2">
            {["day", "week", "month"].map((view) => (
              

              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 rounded ${
                  currentView === view
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            {currentView === "month" && renderMonthView()}
            {currentView === "week" && renderWeekView()}
            {currentView === "day" && renderDayView()}
          </div>
        </div>

        {showEventForm && (

          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowEventForm(false)}
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-md "
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold weferg_w">Appointment</h3>
              <div className="event-form">
                <h3>
                  Schedule Event for{" "}
                  {selectedDay
                      ? selectedDay.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Select a Day"} {" "}
                    at {selectedTimeSlot}
                </h3>

                <div className="patient-form-123vvv4">
                    <div className="patient-form-123-div werwefgtP_gyt">
                        <label> Search Here <span>:</span> </label>
                        <input
                            list="patients" // Link input to the datalist
                            type="text"
                            placeholder="Enter PatientId, PatientName, or Phone Numberrrrrr"
                            value={searchQuery}
                            onChange={handleChange} // Update the search query
                            onKeyDown={(e) => e.key === 'Enter' && HandlesearchPatient()} // Trigger search on Enter
                        />
                        <datalist id="patients"> {/* Add an id to link with the input */}
                            {FilterbyPatientId.map((row, indx) => (
                                <option key={indx} value={row.PatientId}>
                                    {`${row.PatientId} |${row.PhoneNo} | ${row.FirstName} | ${row.MiddleName} | ${row.SurName}`}  {/* Display PhoneNo and FirstName */}
                                </option>
                            ))}
                        </datalist>

                        <span>
                            <PersonSearchIcon onClick={HandlesearchPatient} /> {/* Call the search function on icon click */}
                        </span>
                    </div>
                </div>

                <form className="patient-form-123" onSubmit={handleAppointmentRequestSubmit}>
                  <div className="patient-form-12344">
                    <div>
                      {" "}
                      <div className="patient-form-123-div">
                       
                        <label>
                          Title<span>:</span>
                        </label>
                        <select
                          value={AppointmentRequestList.Title}
                          name="Title"
                          autoComplete="off"
                          onChange={HandleFieldOnchange}
                        >
                          <option value="">Select</option>
                          {TitleNameData.map((row, indx) => (
                            <option key={indx} value={row.id}>
                              {row.Title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="patient-form-123-div">
                        <label>
                          First Name<span>:</span>
                        </label>
                        <input
                          type="text"
                          name="FirstName"
                          autoComplete="off"
                          value={AppointmentRequestList.FirstName}
                          onKeyDown={handleKeyDownTextRegistration}
                          onChange={HandleFieldOnchange}
                        />
                      </div>

                      <div className="patient-form-123-div">
                        <label>
                          Middle Name<span>:</span>
                        </label>
                        <input
                          type="text"
                          name="MiddleName"
                          autoComplete="off"
                          value={AppointmentRequestList.MiddleName}
                          onKeyDown={handleKeyDownTextRegistration}
                          onChange={HandleFieldOnchange}
                        />
                      </div>

                      <div className="patient-form-123-div">
                        <label>
                          Last Name<span>:</span>
                        </label>
                        <input
                          type="text"
                          name="LastName"
                          autoComplete="off"
                          value={AppointmentRequestList.LastName}
                          onKeyDown={handleKeyDownTextRegistration}
                          onChange={HandleFieldOnchange}
                        />
                      </div>

                      <div className="patient-form-123-div">
                        <label>
                          Time<span>:</span>{" "}
                        </label>
                        {console.log(selectedTimeSlot,'jjjjjjjjjjjjselectedTimeSlot')}
                        {console.log(selectedTimeSlotRaw,'aaaaaaaaaaaaaaaaaaaaaaaaa')}

                        <input
                         
                          type={isEditingTime ? "time" : "text"}
                          className="border rounded-lg p-2 w-32 text-center focus:outline-none"
                          name="RequestTime"
                          value={isEditingTime ? selectedTimeSlotRaw : selectedTimeSlot}
                          // value={selectedTimeSlot} // Displays time in 12-hour format (e.g., "2:38 PM")
                          onFocus={() => {
                            setIsEditingTime(true)
                            setSelectedTimeSlotRaw(convertTo24Hour(selectedTimeSlot));
                          }}
                            
                          onBlur={() => {
                            setIsEditingTime(false)
                            setSelectedTimeSlot(formatTo12Hour(selectedTimeSlotRaw))
                          }} 
                          onChange={HandleFieldOnchange} // Handle input change
                          required
                        />

                        {/* AM/PM Dropdown */}

                        {/* {selectedTimeSlot ? ( // Only render when selectedTimeSlot is available
                          <select
                            className="border rounded-lg p-2 w-40 bg-white focus:outline-none"
                            value={selectedTimeSlot}
                            onChange={HandleFieldOnchange}
                            onFocus={() => setIsEditingTime(true)}
                            onBlur={() => setIsEditingTime(false)}
                          >
                            {generateTimeOptions().map((time, index) => (
                              <option key={index} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        ): (
                          <p>Select a time</p> // Show message if no time is selected
                        )} */}

                        {/* Clock Icon */}
                        {/* <Clock className="w-5 h-5 text-gray-500" /> */}
                      </div>



                      <div className="patient-form-123-div">
                        <label>
                          Mobile No<span>:</span>{" "}
                        </label>
                        <input
                          type="text"
                          name="PhoneNumber"
                          autoComplete="off"
                          value={AppointmentRequestList.PhoneNumber}
                          onChange={HandleFieldOnchange}
                          onKeyDown={handleKeyDownPhoneNo}
                          
                        />
                        
                      </div>


                      <div className="patient-form-123-div">
                        <label>
                          Age<span>:</span>
                        </label>
                        <input
                          type="number"
                          name="Age"
                          autoComplete="off"
                          value={AppointmentRequestList.Age}
                          onChange={HandleFieldOnchange}
                        />
                      </div>
                      <div className="patient-form-123-div">
                        <label>
                          Gender<span>:</span>
                        </label>
                        <select
                          name="Gender"
                          
                          value={AppointmentRequestList.Gender}
                          onChange={HandleFieldOnchange}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="TransGender">TransGender</option>
                        </select>
                      </div>
                      <div className="patient-form-123-div">
                        <label>
                          E-Mail ID<span>:</span>{" "}
                        </label>
                        <input
                          type="email"
                          autoComplete="off"
                          value={AppointmentRequestList.Email}
                          name="Email"
                          onChange={HandleFieldOnchange}
                          
                        />
                      </div>

                      <div className="patient-form-123-div">
                        <label>
                          Specialization <span>:</span>{" "}
                        </label>
                        <select
                          value={AppointmentRequestList.Specialization}
                          name="Specialization"
                          onChange={HandleFieldOnchange}
                          
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

                      <div className="patient-form-123-div">
                        <label>
                          Doctor Name<span>:</span>{" "}
                        </label>
                        <select
                          name="DoctorName"
                          value={AppointmentRequestList.DoctorName}
                          onChange={HandleFieldOnchange}
                        >
                          <option value="">Select</option>

                          {/* {DoctorData && Array.isArray(DoctorData) && DoctorData.length !== 0 && DoctorData?.filter(
                            p => p.schedule?.[0]?.working === 'yes'
                          ).map((row, indx) => (
                            <option key={indx} value={row.doctor_id}>
                              {row.doctor_name}
                            </option>
                          ))} */}


                          {/* {DoctorData.map((row, indx) => (
                            <option key={indx} value={row.doctor_id}>
                              {row.doctor_name}
                            </option>
                          ))} */}


                          {
                            DoctorData &&
                            DoctorData.filter((doc) =>
                              doc.schedule?.some(
                                (sch) =>
                                  getDayNameFromDate(selectedDay) === sch.days &&
                                  sch.working === "yes"
                              )
                            ).map((row, indx) => (
                              <option key={indx} value={row.doctor_id}>
                                {row.doctor_name}
                              </option>
                            ))
                          }

                        </select>

                      </div>

                      <div className="patient-form-123-div">
                        <label>
                          Appoinment Type <span>:</span>{" "}
                        </label>
                        <select
                          name="AppointmentType"
                          value={AppointmentRequestList.AppointmentType}
                          onChange={HandleFieldOnchange}

                          
                        >
                          <option value="">Select</option>
                          
                          {["Call", "Walk In"].map((row, indx) => (
                            <option key={indx} value={row}>
                              {row}
                            </option>
                          ))}
                        
                        
                        </select>
                      </div>
                      
                      {/* <div className="patient-form-123-div">
                        <label>
                          Referring Doctor<span>:</span>{" "}
                        </label>
                        <select
                          name="ReferredBy"
                          value={AppointmentRequestList.ReferredBy}
                          onChange={HandleFieldOnchange}
                          
                        >
                          <option value="">Select</option>

                          {Array.isArray(ReferralDoctorData) &&
                            ReferralDoctorData.map((row, indx) => (
                              <option key={indx} value={row.id}>
                                {row.Name}
                              </option>
                            ))}
                        </select>
                      </div> */}

                      <div className="patient-form-123-div">
                        <label>
                          Referring Doctor<span>:</span>{" "}
                        </label>

                        <input
                          list="referring-doctor-list"
                          name="ReferredBy"
                          value={AppointmentRequestList.ReferredBy}
                          onChange={HandleFieldOnchange}
                          placeholder="Select or type Doctor Name"
                        />

                        <datalist id="referring-doctor-list">
                          {Array.isArray(ReferralDoctorData) &&
                            ReferralDoctorData.map((row, indx) => (
                              <option key={indx} value={row.id}>
                                {row.Name}
                              </option>
                            ))}
                        </datalist>
                      </div>

                      <div className="patient-form-123-div">
                        <label>
                          Visit Type<span>:</span>{" "}
                        </label>
                        <input
                          name="VisitType"
                          value={AppointmentRequestList.VisitType}
                          onChange={HandleFieldOnchange}
                          readOnly
                        />
                      </div>

                      <div className="patient-form-123-div">
                        <label>
                          Visit Purpose<span>:</span>{" "}
                        </label>
                        <select
                          name="VisitPurpose"
                          value={AppointmentRequestList.VisitPurpose}
                          onChange={HandleFieldOnchange}
                          
                        >
                          <option value="">Select</option>
                          <option value="Consultant">Consultant</option>
                          <option value="OTBooking">OT Booking</option>

                          
                        </select>
                      </div>

                      {/* <div className="patient-form-123-div">
                        <label>
                          Remarks<span>:</span>
                        </label>
                        <input
                          type="text"
                          value={AppointmentRequestList.remarks}
                          onChange={(e) =>
                            setAppointmentRequestList({
                              ...AppointmentRequestList,
                              remarks: e.target.value,
                            })
                          }
                        />
                      </div> */}


                    </div>

                    <div>
                      <div className="previous-visit-details">
                        <h3>Previous Visit Details</h3>
                        <br />
                        <div className="patient-form-123-div">
                          <label>
                            Last Visit Date<span>:</span>
                          </label>
                          <input
                            type="date"
                            readOnly
                            value={AppointmentRequestList.lastVisitDate}
                            onChange={(e) =>
                              setAppointmentRequestList({
                                ...AppointmentRequestList,
                                lastVisitDate: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="patient-form-123-div">
                          <label>
                            Advised Review Date<span>:</span>
                          </label>
                          <input
                            type="date"
                            readOnly
                            value={AppointmentRequestList.advisedReviewDate}
                            onChange={(e) =>
                              setAppointmentRequestList({
                                ...AppointmentRequestList,
                                advisedReviewDate: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="patient-form-123-div">
                          <label>
                            Reviewed By<span>:</span>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={AppointmentRequestList.reviewedBy}
                            onChange={(e) =>
                              setAppointmentRequestList({
                                ...AppointmentRequestList,
                                reviewedBy: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="patient-form-123-div">
                          <label>
                            Advised Instructions<span>:</span>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={AppointmentRequestList.advisedInstructions}
                            onChange={(e) =>
                              setAppointmentRequestList({
                                ...AppointmentRequestList,
                                advisedInstructions: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* <div className="patient-form-123-div">
                          <label>
                            Due Amount<span>:</span>
                          </label>
                          <input
                            type="number"
                            value={AppointmentRequestList.dueAmount}
                            onChange={(e) =>
                              setAppointmentRequestList({
                                ...AppointmentRequestList,
                                dueAmount: e.target.value,
                              })
                            }
                          />
                        </div> */}

                        <div className="patient-form-123-div">
                          <label>
                            Last Booked By<span>:</span>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={AppointmentRequestList.lastBookedBy}
                            onChange={(e) =>
                              setAppointmentRequestList({
                                ...AppointmentRequestList,
                                lastBookedBy: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="button-group">
                    <button onClick={handleAppointmentRequestSubmit} type="submit">{AppointmentRequestList.AppointmentID ? 'Update' : 'Submit'}</button>
                    <button type="button" onClick={clseShowEventForm}>
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {ShowResecheduleForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowResecheduleForm(false)}
          >
            {/* <div
              className="bg-white rounded-lg p-6 w-full max-w-md "
              onClick={(e) => e.stopPropagation()}
            >
            ShowResecheduleForm

            </div> */}

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
                        // Specialization: "",
                        // DoctorName: "",
                        // ChangingReason: "",
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
                        // RequestDate: "",
                        // ChangingReason: "",
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
                    <label htmlFor="RequestTime">
                      Request Time<span>:</span>
                    </label>
                    <input
                      name="RequestTime"
                      id="RequestTime"
                      value={ReScheduleEdit.RequestTime}
                      type="time"
                      onChange={handleDocChange}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="ChangingReason">
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
                    <label htmlFor="Specialization">
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
                    <label htmlFor="DoctorName">
                      Doctor Name<span>:</span>
                    </label>
                    <select
                      name="DoctorName"
                      id="DoctorName"
                      value={ReScheduleEdit.DoctorName}
                      onChange={handleDocChange}
                    >
                      <option value="">Select</option>
                     
                     
                     {/* {Array.isArray(DoctorData) &&
                        DoctorData.filter((p) => p.id !== RescheduleDocId).map((p, indx) => (
                          <option key={indx} value={p.id}>
                            {p.doctor_name}
                          </option>
                        ))}  */}

                     
                      {DoctorData && Array.isArray(DoctorData) && DoctorData.length !== 0 && DoctorData?.filter(
                          p => p.schedule?.[0]?.working === 'yes'&& p.doctor_id !==RescheduleDocId
                        ).map((row, indx) => (
                          <option key={indx} value={row.doctor_id}>
                            {row.doctor_name}
                          </option>
                      ))} 

                      
                      
                




                    </select>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="ChangingReason">
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
                <button onClick={handleRescheduleSubmit}>Save</button>
              </div>
            </div>




          </div>
        )}
      </div>

      <div className="suifyuwe_kd9"
      style={{
        maxHeight: "650px", // or height: "400px"
        overflowY: "auto", // enables vertical scroll
        paddingRight: "10px", // optional: avoids scroll bar overlap
      }}
      >
        <div className="flex items-center justify-between mb-6 wrwef_9">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
            }}
          >
            <h2>Schedule </h2>
            <CalendarMonthIcon style={{ fontSize: "35px" }} />
          </div>
        </div>

        {renderSchedule()}
      </div>

      {showDeleteConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowDeleteConfirmation(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md max-w-md-22"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this Patient ?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}


      <ToastAlert Message={toast.message} Type={toast.type} />

    </div>
  );
};

export default GoogleStyleCalendar;
