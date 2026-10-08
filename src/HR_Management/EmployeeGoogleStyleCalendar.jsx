import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
  CodeSquareIcon,
} from "lucide-react";
import "../HR_Management/EmployeeNewCalendar.css";
import "../FrontOffice/CalendarNew/Calendar.css";
import ReactDOM from "react-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { format } from "date-fns";
import TimePicker from "../OtherComponent/TimePickerComponent/TimePicker";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import profileimg from "../Assets/profileimg.jpeg";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import Button from "@mui/material/Button";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const EmployeeGoogleStyleCalendar = () => {
  // const EmployeeCalendarData = useSelector(
  //   (state) => state.Frontoffice?.EmployeeCalendarData
  // );


   const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();

  const [FinalData, setFinalData] = useState({});
  const [InTime, setInTime] = useState("");
  const [OutTime, setOutTime] = useState("");
  console.log(InTime);
  console.log(OutTime);
  const [commonData, setcommonData] = useState([]);
  const [WeekDays, setWeekDays] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("");
  const [deletePatientName, setDeletePatientName] = useState(null);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [AttendanceStatus, setAttendanceStatus] = useState("");
  const [events, setEvents] = useState([]);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log(userRecord,'userRecord');
  const [holidays, setHolidays] = useState([]);
  const [selecteddatedata, setselecteddatedata] = useState({});
  console.log(selecteddatedata);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [AllEmployeeData, setAllEmployeeData] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [SearchEmployee, setSearchEmployee] = useState("");
  const [employeeview, setemployeeview] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
    const [shiftDetails, setShiftDetails] = useState([]);
    const [currentshifts, setcurrentshifts] = useState([]);
  const [reportenddate, setreportenddate] = useState("");
    const [reportstartdate, setreportstartdate] = useState("");
      const [bulkAssign, setBulkAssign] = useState(false); 
      const [selectedEmployees, setSelectedEmployees] = useState([]);
      const [openRow, setOpenRow] = useState(null); 
      const [selectedRowData, setSelectedRowData] = useState(null);
      const dispatch = useDispatch();



      console.log(AllEmployeeData,'AllEmployeeData');

 const handleViewChange = (view) => {
    if (view !== currentView) {
      setCurrentView(view);
    }
  };

 

 const handleShiftChange1 = (date, selectedShiftId) => {
    setShiftDetails((prevDetails) => ({
      ...prevDetails,
      [date]: selectedShiftId,
    }));
  };

  const [shiftAssigned, setShiftAssigned] = useState(false);

 const handleCheckboxChange = (e) => {
    setShiftAssigned(e.target.checked);
    setShowEventForm(true);
  };

  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");
  const [weekDates, setWeekDates] = useState([]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    if (name === "startdate") setstartdate(value);
    if (name === "enddate") setenddate(value);
    if (name === "reportstartdate") setreportstartdate(value);
    if (name === "reportenddate") setreportenddate(value);

    if (name === "startdate" || name === "enddate") {
      const start = new Date(name === "startdate" ? value : startdate);
      const end = new Date(name === "enddate" ? value : enddate);

      if (start && end) {
        const timeDifference = end - start;
        const dayDifference = timeDifference / (1000 * 60 * 60 * 24) + 1; // Include both start and end

        if (dayDifference === 7) {
          let dates = [];
          let currentDate = new Date(start);
          while (currentDate <= end) {
            dates.push(currentDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
            currentDate.setDate(currentDate.getDate() + 1);
          }
          setWeekDates(dates);
        } else {
          alert("Please select exactly 7 days (one full week).");
          setWeekDates([]);
        }
      }
    }
  };
 

  const handleCloseModal1 = () => {
    setShowEventForm(false);
    setstartdate("");
    setenddate("");
    setWeekDates([]);
    setShiftDetails({
      intime: "",
      outtime: "",
      Shiftstartdate: "",
      Shiftenddate: "",
      Status: "Active",
      shiftName: "",
    });
  };


  const handleShiftSubmit1 = async () => {
    console.log(bulkAssign);
    if (bulkAssign) {
      const shiftDataArray = weekDates.map((date) => ({
        ShiftDate: date, // the date string
        Shift_Id: shiftDetails[date] || "",
        Create_by: userRecord?.username,
        Status: "Pending",
      }));

      // if (shiftDetails.Shiftstartdate && shiftDetails.Shiftenddate) {
      const newdata = {
        shiftdata: shiftDataArray,
        selectedEmployees,
        bulkAssign,
        Create_by: userRecord?.username || "",
        Location_Name: userRecord?.location || "",
        openRow,
        Status: "Pending",
      };
      console.log(newdata);
      axios
        .post(`${UrlLink}HR_Management/DutyAssign_IndEmployee`, newdata)
        .then((res) => {
          if (res.data.errors) {
            const errorMessages = res.data.errors
              .map((error) =>
                Object.entries(error).map(([key, value]) => `${key}: ${value}`)
              )
              .join("\n");
            dispatch({
              type: "toast",
              value: { message: errorMessages, type: "warn" },
            });
          } else {
            dispatch({
              type: "toast",
              value: {
                message: "All shifts added successfully",
                type: "success",
              },
            });
          }
        })
        .catch((err) => console.error(err));
    } else {
      const shiftDataArray = weekDates.map((date) => ({
        ShiftDate: date, // the date string
        Shift_Id: shiftDetails[date] || "",
        Create_by: userRecord?.username,
        Status: "Active",
      }));
      console.log(selectedRowData);
      console.log(shiftDataArray);
      const postData = {
        Employee: selectedRowData?.Employee_Id, // or selectedRowData?.id, based on your data structure
        shiftdata: shiftDataArray,
        Location_Name: userRecord?.location,
        Create_by: userRecord?.username,
        Status: "Active",
        bulkAssign: false,
      };

      console.log(postData);
      axios
        .post(`${UrlLink}HR_Management/DutyAssign_IndEmployee`, postData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const getButtonClass = (section) =>
    `shadow_new_0 NewforEmployeeshadow ${
      activeSection === section ? "active-button" : ""
    }`;

  const handlebackclick = () => {
    setCurrentView("");
    setemployeeview(false);
  };

  const getViewTitle = () => {
    const options = { month: "long", year: "numeric" };
    if (currentView === "daywise") {
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

  const handleMouseEnter = (date, data, event) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Calculate position considering scroll
    const top = rect.top + scrollTop;
    const left = rect.right + scrollLeft;

    // Check if popup would go off-screen
    const popupWidth = 250; // approximate popup width
    const windowWidth = window.innerWidth;

    // If popup would go off right edge, show it on the left side instead
    const finalLeft =
      left + popupWidth > windowWidth
        ? rect.left - popupWidth + scrollLeft
        : left;

    setPopupPosition({
      top: top - 30, // Slightly above the cell
      left: finalLeft + 20, // Slightly offset from the cell
    });
    setHoveredDate(date);
    setPopupData(data);
  };
  const handleMouseLeave = () => {
    setHoveredDate(null);
    setPopupData(null);
  };

  console.log(FinalData);

  const handleEmployeeClick = (employee) => {
    console.log(employee);
    setFinalData(employee);
    setCurrentView("month");
    setemployeeview(true);
  };

  useEffect(() => {
    // Fetch government holidays from API
    axios
      .get(`${UrlLink}HR_Management/Get_GovtHolidays`)
      .then((response) => setHolidays(response.data))
      .catch((error) => console.error("Error fetching holidays:", error));
  }, [UrlLink]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${UrlLink}HR_Management/HOD_MappedEmployee_Details_For_Calendar?hodid=${userRecord?.Employeeid}&SearchEmployee=${SearchEmployee}&is_Employee=${userRecord?.is_Employee}&is_HOD=${userRecord?.is_HOD}&is_HR=${userRecord?.is_HR}&is_admin=${userRecord?.is_admin}&Employeeid=${userRecord?.Employeeid}`
        );
        console.log(res,'resssssssss');
        setAllEmployeeData(res.data);
        
        // Hide welcome message after 3 seconds
        const timer = setTimeout(() => {
          setShowWelcome(false);
        }, 3000);
  
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
  
    fetchData();
  }, [userRecord?.Employeeid, SearchEmployee]);
  

  const handleSearchEmployeeChange = (e) => {
    const { name, value } = e.target;
    if (name == "SearchEmployee") {
      setSearchEmployee(value);
    }
  };

  const [selectedDay, setSelectedDay] = useState(null);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [newEvent, setNewEvent] = useState({
    patientName: "",
    mobileNo: "",
    ageGender: "",
    address: "",
    location: "",
    email: "",
    referringDoctor: "",
    billingMode: "",
    dateTime: "",
    visitPurpose: "",
    remarks: "",
    color: "#000000",
  });
  const [scheduleView, setScheduleView] = useState("today"); // Add this new state

  const [showEventForm, setShowEventForm] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selecteddateattendance, setselecteddateattendance] = useState(null);
  const [type, settype] = useState("");
  console.log(selecteddateattendance);

  const clseShowEventForm = () => {
    setShowEventForm(false);
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
    console.log(timeStr);

    const { hours, minutes, period } = parseTime(timeStr);
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${period}`;
  };

  const handleEditEvent = (id) => {
    const eventToEdit = events.find((event) => event.id === id);
    // Set the event to be edited in the form
    console.log(eventToEdit);
    setNewEvent({
      ...eventToEdit, // Pre-populate form with existing event details
    });
    setShowEventForm(true); // Show the event editing form
  };

  const handleDeleteClick = (id, patientName) => {
    setDeleteEventId(id);
    setDeletePatientName(patientName);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteEvent = () => {
    // Delete the event and update the state
    setEvents(events.filter((event) => event.id !== deleteEventId));
    setShowDeleteConfirmation(false); // Close the delete confirmation dialog
    setDeletePatientName(null); // Reset the state
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteEventId(null);
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
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

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
  };

  const handlesave = () => {
    const newsenddata = {
      Employee: FinalData.Employee_ID,
      In_Time: InTime,
      Out_Time: OutTime,
      Date: new Date().toISOString().split("T")[0],
      Attendance_Status: AttendanceStatus,
      Location: userRecord?.location,
      CreatedBy: userRecord?.username,
    };
    console.log(newsenddata);
    axios
      .post(`${UrlLink}HR_Management/Insert_DailyAttendance`, newsenddata)
      .then((res) => {
        console.log(res);
        const resres = res.data;
        let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
        setShowEventForm(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const hanldeShiftDetails = (e, type) => {
    let finaldatedata1 = getViewTitle();
    if (type) {
      setActiveSection(type);
      settype(type);
    }

    axios
      .get(
        `${UrlLink}HR_Management/GET_Employee_All_Data_ForCalendar?Type=${type}&Employee_ID=${
          FinalData?.Employee_ID
        }&currentDate=${encodeURIComponent(
          finaldatedata1
        )}&currentView=${currentView}`
      )
      .then((response) => {
        console.log(response);
        setcommonData(response.data);
      })
      .catch((error) => console.error("Error fetching holidays:", error));
    // }
  };

  const renderDayView = () => {
    console.log(currentDate.toISOString().split("T")[0]);

    const eventsByHour =
      Array.isArray(commonData) &&
      commonData
        .filter(
          (event) => event.ShiftDate === currentDate.toISOString().split("T")[0]
        )
        .reduce((acc, event) => {
          const { hours } = parseTime(event.Time);
          if (!acc[hours]) acc[hours] = [];
          acc[hours].push(event);
          return acc;
        }, {});

    // Get current time to show time indicator (optional)
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimePosition = (currentHour + currentMinute / 60) * 30; // 30px per hour

    const isToday =
      currentDate.getDate() === now.getDate() &&
      currentDate.getMonth() === now.getMonth() &&
      currentDate.getFullYear() === now.getFullYear();

    return (
      <div className="day-view-container">
        {/* Time labels column */}
        <div className="time-column">
          {getTimeSlots().map((time, index) => (
            <div
              key={time}
              className="time-label"
              style={{ top: `${index * 30}px` }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Events grid */}
        <div className="events-column">
          {getTimeSlots().map((slot, index) => (
            <div
              key={slot}
              className="time-row"
              style={{ top: `${index * 30}px` }}
              onClick={() => {
                setSelectedDay(currentDate);
                setSelectedTimeSlot(slot);
                setShowEventForm(true);
              }}
            >
              {eventsByHour[index] &&
                eventsByHour[index].map((event) => (
                  <div
                    key={event.id}
                    className="gfgh_huk flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event.id);
                    }}
                  >
                    <div>
                      <h5 className="font-medium">{event?.ShiftName}</h5>
                      <h6>
                        {!event.DisplayStartTime ? "END TIME" : "START TIME"}
                      </h6>
                      <span
                        style={{
                          color:
                            event?.Status === "Completed"
                              ? "green"
                              : event?.Status === "Approved"
                              ? "orange"
                              : "red",
                        }}
                      >
                        {event?.Status === "Completed"
                          ? "Granted"
                          : event?.Status === "Approved"
                          ? "Approved"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ))}

          {/* Current time indicator (only show for today) */}
          {isToday && (
            <div
              className="current-time-line"
              style={{ top: `${currentTimePosition}px` }}
            />
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const timeSlots = getTimeSlots();

    return (
      <div className="week-calendar-week1">
        <div className="header-week-cal">
          <div className="time-column"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="day-header-week-cal">
              {console.log(day.toISOString().split("T")[0])}
              {day.toLocaleDateString("default", {
                weekday: "short",
                day: "numeric",
              })}
            </div>
          ))}
        </div>

        <div className="body-wwe-cal">
          {timeSlots.map((slot, i) => (
            <div key={i} className="time-row-week-cal">
              <div className="time-label-week-cal">{slot}</div>

              {weekDays.map((day, j) => {
                let shiftInfo, Leaveinfo, AdvanceInfo, AttendanceInfo;

                if (type === "Shift") {
                  shiftInfo = commonData;
                } else if (type === "Leave") {
                  Leaveinfo = commonData;
                } else if (type === "Advance") {
                  AdvanceInfo = commonData;
                } else if (type === "Attendance") {
                  AttendanceInfo = commonData;
                }
                return (
                  <div
                    key={j}
                    className="time-slot-week-cal"
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedTimeSlot(slot);
                      setShowEventForm(true); // Show the form when a time slot is clicked
                    }}
                  >
                    {AttendanceInfo ? (
                      <>
                        {Array.isArray(commonData) &&
                          commonData.length > 0 &&
                          commonData.map(
                            (event, k) =>
                              day.toISOString().split("T")[0] ===
                                event.Date && (
                                <>
                                  {slot === event.In_TimeWithPeriod && (
                                    <div
                                      key={k}
                                      className={`event-week-cal ${event.color}`}
                                    >
                                      <div>
                                        <h3>
                                          IN TIME ({event.In_TimeWithPeriod}){" "}
                                        </h3>
                                        <span
                                          style={{
                                            color:
                                              event?.Attendance_Status ===
                                              "Present"
                                                ? "green"
                                                : "red",
                                            fontSize: "15px",
                                          }}
                                        >
                                          {event?.Attendance_Status ===
                                          "Present"
                                            ? "Granted"
                                            : "Pending"}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {slot === event.Out_TimeWithPeriod ? (
                                    <div
                                      key={k}
                                      className={`event-week-cal ${event.color}`}
                                    >
                                      <div>
                                        <h3>
                                          OUT TIME ({event.Out_TimeWithPeriod}){" "}
                                        </h3>
                                        <span
                                          style={{
                                            color:
                                              event?.Attendance_Status ===
                                              "Present"
                                                ? "green"
                                                : "red",
                                            fontSize: "15px",
                                          }}
                                        >
                                          {event?.Attendance_Status ===
                                          "Present"
                                            ? "Granted"
                                            : "Pending"}
                                        </span>
                                      </div>
                                    </div>
                                  ) : null}
                                </>
                              )
                          )}
                      </>
                    ) : shiftInfo ? (
                      <>
                        {Array.isArray(commonData) &&
                          commonData.length > 0 &&
                          commonData.map(
                            (event, k) =>
                              day.toISOString().split("T")[0] ===
                                event.ShiftDate && (
                                <>
                                  {slot === event.DisplayStartTime && (
                                    <div
                                      key={k}
                                      className={`event-week-cal ${event.color}`}
                                    >
                                      <div>
                                        <h3>{event?.ShiftName}</h3>
                                        <h4>
                                          START TIME ({event.DisplayStartTime}){" "}
                                        </h4>
                                        <span
                                          style={{
                                            color:
                                              event?.Status === "Completed"
                                                ? "green"
                                                : event?.Status === "Approved"
                                                ? "orange"
                                                : "red",

                                            fontSize: "15px",
                                          }}
                                        >
                                          {event?.Status === "Completed"
                                            ? "Granted"
                                            : event?.Status === "Approved"
                                            ? "Approved"
                                            : "Pending"}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {slot === event.DisplayEndTime && (
                                    <div
                                      key={k}
                                      className={`event-week-cal ${event.color}`}
                                    >
                                      <div>
                                        <h3>{event?.ShiftName}</h3>
                                        <h4>
                                          END TIME ({event.DisplayEndTime}){" "}
                                        </h4>
                                        <span
                                          style={{
                                            color:
                                              event?.Status === "Completed"
                                                ? "green"
                                                : event?.Status === "Approved"
                                                ? "orange"
                                                : "red",
                                            fontSize: "15px",
                                          }}
                                        >
                                          {event?.Status === "Completed"
                                            ? "Granted"
                                            : event?.Status === "Approved"
                                            ? "Approved"
                                            : "Pending"}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )
                          )}
                      </>
                    ) : AdvanceInfo ? (
                      <>
                        {Array.isArray(commonData) &&
                          commonData.length > 0 &&
                          commonData.map(
                            (event, k) =>
                              day.toISOString().split("T")[0] ===
                                event.Request_Date && (
                                <>
                                  {slot === event.RequestTime && (
                                    <div
                                      key={k}
                                      className={`event-week-cal ${event.color}`}
                                    >
                                      <div>
                                        <h3>
                                          {event?.Request_Amount} - (Requested )
                                        </h3>
                                        <span
                                          style={{
                                            color:
                                              event?.Status === "Approved" &&
                                              event?.Installment_Status ===
                                                "Pending"
                                                ? "orange"
                                                : event?.Status ===
                                                    "Approved" &&
                                                  event?.Installment_Status ===
                                                    "Completed"
                                                ? "green"
                                                : "red",

                                            fontSize: "15px",
                                          }}
                                        >
                                          {event?.Status === "Approved" &&
                                          event?.Installment_Status ===
                                            "Pending"
                                            ? event?.Status
                                            : event?.Status === "Approved" &&
                                              event?.Installment_Status ===
                                                "Completed"
                                            ? "Cleared"
                                            : "Pending"}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {slot === event.ApprovedTime && (
                                    <div
                                      key={k}
                                      className={`event-week-cal ${event.color}`}
                                    >
                                      <div>
                                        <h3>
                                          {event?.Request_Amount} - (Approved
                                          Amount)
                                        </h3>
                                        <span
                                          style={{
                                            color:
                                              event?.Status === "Approved" &&
                                              event?.Installment_Status ===
                                                "Pending"
                                                ? "orange"
                                                : event?.Status ===
                                                    "Approved" &&
                                                  event?.Installment_Status ===
                                                    "Completed"
                                                ? "green"
                                                : "red",

                                            fontSize: "15px",
                                          }}
                                        >
                                          {event?.Status === "Approved" &&
                                          event?.Installment_Status ===
                                            "Pending"
                                            ? event?.Status
                                            : event?.Status === "Approved" &&
                                              event?.Installment_Status ===
                                                "Completed"
                                            ? "Cleared"
                                            : "Pending"}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )
                          )}
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today’s date for accurate comparison

    return (
      <div className="grid grid-cols-mnth gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((daywise) => (
          <div key={daywise} className="text-center text-sm font-medium py-2">
            {daywise}
          </div>
        ))}

        {getDaysInMonth().map((date, index) => {
          if (!date) return <div key={index} className="min-h-24 p-1"></div>;

          const formattedDate = format(date, "yyyy-MM-dd");

          let shiftInfo, Leaveinfo, AdvanceInfo;

          if (type === "Shift") {
            shiftInfo =
              Array.isArray(commonData) &&
              commonData.find((a) => a.ShiftDate === formattedDate);
          } else if (type === "Leave") {
            Leaveinfo =
              Array.isArray(commonData) &&
              commonData.find(
                (a) => formattedDate >= a.FromDate && formattedDate <= a.ToDate
              );
          } else if (type === "Advance") {
            AdvanceInfo =
              Array.isArray(commonData) &&
              commonData.find((a) => a.ApprovedDate == formattedDate);
          }

          const attendance =
            Array.isArray(commonData) &&
            commonData.find((a) => a.Date === formattedDate);

          return (
            <div
              key={index}
              className={`calendar-day ${
                date > today && !Leaveinfo && !shiftInfo
                  ? "future-day"
                  : "clickable-day"
              } 
              ${
                date.getTime() === today.getTime()
                  ? "EmployeeCalendarToday"
                  : ""
              }`}
              onClick={() => {
                if (date.getTime() === today.getTime()) {
                  setShowEventForm(true);
                }
              }}
              onMouseEnter={(event) =>
                (Leaveinfo || shiftInfo || AdvanceInfo) &&
                handleMouseEnter(
                  formattedDate,
                  { Leaveinfo, shiftInfo, AdvanceInfo },
                  event
                )
              }
              onMouseLeave={handleMouseLeave}
            >
              <div className="text-sm p-1">{date.getDate()}</div>

              {/* Show Leave Data if Exists */}
              {Leaveinfo ? (
                <div className="shift-details">
                  <h4>{Leaveinfo.Leave_Type.toUpperCase() || "N/A"} LEAVE</h4>

                  <h4
                    style={{
                      color: Leaveinfo.Status === "Approved" ? "green" : "red",
                    }}
                  >
                    {Leaveinfo?.Status
                      ? Leaveinfo.Status === "Approved"
                        ? "Granted"
                        : "Awaiting Approval"
                      : "No Status"}
                  </h4>
                </div>
              ) : shiftInfo ? (
                <div className="shift-details">
                  <h4>{shiftInfo.ShiftName.toUpperCase() || "N/A"}</h4>
                  <h4
                    style={{
                      color:
                        shiftInfo.Status === "Approved" ||
                        shiftInfo.Status === "Completed"
                          ? "green"
                          : "red",
                    }}
                  >
                    {shiftInfo?.Status
                      ? shiftInfo.Status === "Approved"
                        ? "Granted"
                        : shiftInfo.Status === "Completed"
                        ? "Completed"
                        : "Awaiting Approval"
                      : "No Status"}
                  </h4>
                </div>
              ) : AdvanceInfo ? (
                <div className="shift-details">
                  <div className="attendance-row">
                    <div className="attendance-label">
                      Amount
                      <span
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "right",
                        }}
                      >
                        :
                      </span>
                    </div>
                    <div className="attendance-value">
                      {AdvanceInfo.Request_Amount || "N/A"}
                    </div>
                  </div>
                  <h4
                    style={{
                      color:
                        AdvanceInfo.Installment_Status === "Pending"
                          ? "red"
                          : "green",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {AdvanceInfo.Installment_Status === "Pending"
                      ? "Awaiting Approval"
                      : `${AdvanceInfo.Installment_Status}`}
                  </h4>
                </div>
              ) : (
                <div className="attendance-details">
                  <div className="attendance-row">
                    <div className="attendance-label">
                      In
                      <span
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "right",
                        }}
                      >
                        :
                      </span>
                    </div>
                    <div className="attendance-value">
                      {attendance?.In_TimeWithPeriod || "N/A"}
                    </div>
                  </div>
                  <div className="attendance-row">
                    <div className="attendance-label">
                      Out
                      <span
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "right",
                        }}
                      >
                        :
                      </span>
                    </div>
                    <div className="attendance-value">
                      {attendance?.Out_TimeWithPeriod || "N/A"}
                    </div>
                  </div>
                  <div className="attendance-row">
                    <div className="attendance-label">
                      WH
                      <span
                        style={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "right",
                        }}
                      >
                        :
                      </span>
                    </div>
                    <div className="attendance-value">
                      {attendance?.Working_Hours || 0}
                    </div>
                  </div>
                </div>
              )}
              {hoveredDate && popupData && (
                <div
                  className="fixed bg-white shadow-lg p-2 border rounded-md text-sm"
                  style={{
                    top: `${popupPosition.top}px`,
                    left: `${popupPosition.left}px`,
                    zIndex: 1000,
                    minWidth: "200px",
                    maxWidth: "300px",
                    border: "1px solid lightgrey",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  {/* Popup content remains the same */}
                  {popupData.Leaveinfo ? (
                    <>
                      {popupData?.Leaveinfo.Status === "Approved" ? (
                        <h4
                          style={{
                            fontWeight: "bold !important",
                            color: "black",
                            borderBottom: "1px solid black",
                            width: "100%",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {popupData.Leaveinfo.CreatedBy.toUpperCase()}{" "}
                          (APPROVER)
                        </h4>
                      ) : (
                        <h4
                          style={{
                            fontWeight: "bold !important",
                            color: "black",
                            borderBottom: "1px solid black",
                            width: "100%",
                            textAlign: "center",
                            padding: "5px",
                          }}
                        >
                          {hoveredDate}
                        </h4>
                      )}
                      <div
                        className="attendance-details"
                        style={{
                          color: "black",
                          fontWeight: "500",
                          marginTop: "10px",
                        }}
                      >
                        <div className="attendance-row">
                          <div className="attendance-label">
                            Reason
                            <span className="flex w-full items-center justify-end">
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.Leaveinfo.Reason}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : popupData.shiftInfo ? (
                    <>
                      <div
                        className="attendance-details"
                        style={{
                          color: "black",
                          fontWeight: "500",
                        }}
                      >
                        <h3
                          style={{
                            fontWeight: "bold !important",
                            color: "black",
                            borderBottom: "1px solid black",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {hoveredDate}
                        </h3>
                        <div className="attendance-row">
                          <div className="attendance-label">
                            Shift
                            <span
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "right",
                              }}
                            >
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.shiftInfo.ShiftName || "N/A"}
                          </div>
                        </div>
                        <div className="attendance-row">
                          <div className="attendance-label">
                            Start
                            <span
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "right",
                              }}
                            >
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.shiftInfo.DisplayStartTime || "N/A"}
                          </div>
                        </div>
                        <div className="attendance-row">
                          <div className="attendance-label">
                            End
                            <span
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "right",
                              }}
                            >
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.shiftInfo.DisplayEndTime || "N/A"}
                          </div>
                        </div>
                        <div className="attendance-row">
                          <div className="attendance-label">
                            Status
                            <span
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "right",
                              }}
                            >
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.shiftInfo.Status || "N/A"}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : popupData.AdvanceInfo ? (
                    <>
                      <div
                        className="attendance-details"
                        style={{
                          color: "black",
                          fontWeight: "500",
                        }}
                      >
                        <h3
                          style={{
                            fontWeight: "bold !important",
                            color: "black",
                            borderBottom: "1px solid black",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {hoveredDate}
                        </h3>
                        <div className="attendance-row">
                          <div className="attendance-label">
                            Amount
                            <span
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "right",
                              }}
                            >
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.AdvanceInfo.Request_Amount || "N/A"}
                          </div>
                        </div>
                        <div className="attendance-row">
                          <div className="attendance-label">
                            Due
                            <span
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "right",
                              }}
                            >
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.AdvanceInfo.AmountDeduct_PerMonth ||
                              "N/A"}{" "}
                            (Per Month)
                          </div>
                        </div>
                        <div className="attendance-row">
                          <div className="attendance-label">
                            Paid / Due
                            <span
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "right",
                              }}
                            >
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.AdvanceInfo.No_of_MonthPaid || 0} /{" "}
                            {popupData.AdvanceInfo.Repayment_Due || 0} (Months)
                          </div>
                        </div>
                        <div className="attendance-row">
                          <div className="attendance-label">
                            Paid Amount
                            <span
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "right",
                              }}
                            >
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.AdvanceInfo.PaidAmount || 0}
                          </div>
                        </div>
                        <div className="attendance-row">
                          <div className="attendance-label">
                            Issuever Name
                            <span
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "right",
                              }}
                            >
                              :
                            </span>
                          </div>
                          <div className="attendance-value">
                            {popupData.AdvanceInfo.Issuever_Name || "N/A"}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSchedule = () => {
    const scheduleEvents =
      scheduleView === "today"
        ? events.filter(
            (event) => event.date === currentDate.toISOString().split("T")[0]
          )
        : [...events].sort((a, b) => {
            // Sort by date first, then by time
            const dateCompare = new Date(a.date) - new Date(b.date);
            if (dateCompare !== 0) return dateCompare;

            const timeA = parseTime(a.time);
            const timeB = parseTime(b.time);
            return (
              timeA.hours * 60 +
              parseInt(timeA.minutes) -
              (timeB.hours * 60 + parseInt(timeB.minutes))
            );
          });

    return (
      <div
        className=""
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "5px",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="shadow_new_0_head_head45">
          <div className="shadow_new_0_head">
            <div
              className={getButtonClass("Attendance")}
              style={{
                cursor: !employeeview ? "not-allowed" : "pointer",
              }}
              disabled={!employeeview}
              onClick={(e) => hanldeShiftDetails(e, "Attendance")}
            >
              <div className="newicon-shadow-employee">
                <EventRepeatIcon sx={{ fontSize: 35 }} />{" "}
                <span style={{}}>Attendance</span>
              </div>
            </div>

            <div
              className={getButtonClass("Shift")}
              style={{
                cursor: !employeeview ? "not-allowed" : "pointer",
              }}
              disabled={!employeeview}
              onClick={(e) => hanldeShiftDetails(e, "Shift")}
            >
              <div className="newicon-shadow-employee">
                <AccessTimeIcon sx={{ fontSize: 35 }} />
                <span style={{}}>Shift</span>
              </div>
            </div>
          </div>

          <div className="shadow_new_0_head">
            <div
              className={getButtonClass("Leave")}
              style={{
                cursor: !employeeview ? "not-allowed" : "pointer",
              }}
              disabled={!employeeview}
              onClick={(e) => hanldeShiftDetails(e, "Leave")}
            >
              <div className="newicon-shadow-employee">
                <PersonOffIcon sx={{ fontSize: 35 }} />
                <span style={{}}>Leave</span>
              </div>
            </div>
            <div
              className={getButtonClass("Advance")}
              style={{
                cursor: !employeeview ? "not-allowed" : "pointer",
              }}
              disabled={!employeeview}
              onClick={(e) => hanldeShiftDetails(e, "Advance")}
            >
              <div className="newicon-shadow-employee">
                <PaymentIcon sx={{ fontSize: 35 }} />
                <span style={{}}>Advance</span>
              </div>
            </div>
          </div>

          <div className="shadow_new_0_head">
            <div
              className={getButtonClass("Circular")}
              style={{
                cursor: !employeeview ? "not-allowed" : "pointer",
              }}
              disabled={!employeeview}
              onClick={(e) => hanldeShiftDetails(e, "Circular")}
            >
              <div className="newicon-shadow-employee">
                <PaymentIcon sx={{ fontSize: 35 }} />
                <span style={{}}>Circular</span>
              </div>
            </div>
          </div>
        </div>

        {/* {Array.isArray(commonData) && commonData.length === 0 ? ( */}
          <div>
            {/* <h3>No Data for {type}</h3> */}
            {activeSection === "Shift" && (
              <div className="RegisForm_1">
                <label>Shift Assign</label>
                <span>:</span>
                <input
                  type="checkbox"
                  name="ShiftAssign"
                  id="ShiftAssign"
                  checked={shiftAssigned}
                  onChange={handleCheckboxChange}
                />
              </div>
            )}
          </div>
       
      </div>
    );
  };

  console.log(FinalData);

  return (
    <div className="edwueyu_08i">
      <div
        className="max-w-6xl mx-auto p-4"
        style={{
          width: "100%",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* <button
              onClick={() => setShowEventForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              Create
            </button> */}
            <div className="flex items-center gap-2">
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
          <div className="flex gap-2">
            <button
              onClick={handlebackclick}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5px",
                gap: "5px",
                borderRadius: "5px",
              }}
            >
              <ReplyOutlinedIcon />
              <span>BACK</span>
            </button>
          </div>
          {employeeview ? (
            <h3> {FinalData?.EmployeeName.toUpperCase()}</h3>
          ) : (
            <div className="ftftrwfs_8y">
              <div className="wdiuwq_cdj8 wdiuwq_cdj8_HR">
                <label htmlFor="SearchEmployee">
                  Search Employee<span>:</span>
                </label>
                <input
                  type="text"
                  name="SearchEmployee"
                  id="SearchEmployee"
                  list="AllEmployeeData"
                  value={SearchEmployee}
                  onChange={handleSearchEmployeeChange}
                  autoComplete="off"
                  placeholder="Search By Name, Phone, ID, Designation,...."
                />
                <style>
                  {`#SearchEmployee::placeholder {
                    color: white;
                  }`}
                </style>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {["daywise", "week", "month"].map((view) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={`px-4 py-2 rounded ${
                  currentView === view
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
                style={{
                  cursor: !employeeview ? "not-allowed" : "pointer",
                }}
                disabled={!employeeview}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          {currentView ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4">
                {currentView === "month" && renderMonthView()}
                {currentView === "week" && renderWeekView()}
                {currentView === "daywise" && renderDayView()}
              </div>
            </div>
          ) : (
            <div className="container-new-hr-cal">
              {showWelcome ? (
                <div className="welcome-messagedd">
                  {/* <h1>
                    Welcome, HR! <span className="wave-emoji">👋</span> ✨
                  </h1> */}
                  <h1>Your calendar is ready to shine! 📅</h1>
                </div>
              ) : (
                <div className="employee-grid">
                  {Array.isArray(AllEmployeeData) &&
                  AllEmployeeData.length > 0 ? (
                    AllEmployeeData.map((employee) => (
                      <div
                        key={employee.EmployeeID}
                        className="employee-card"
                        onClick={() => handleEmployeeClick(employee)}
                      >
                        <img
                          src={employee.Photo || profileimg}
                          alt={employee.EmployeeName}
                          className="employee-photo"
                        />
                        <p className="employee-name">{employee.EmployeeName}</p>
                      </div>
                    ))
                  ) : (
                    <h1>No Employees for Your Search {SearchEmployee}</h1>
                  )}
                </div>
              )}
              <style>
                {`
               
              `}
              </style>
            </div>
          )}
        </div>

        {showEventForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowEventForm(false)}
          >
            {" "}
            {activeSection === "Attendance" && (
              <div
                className="bg-white rounded-lg p-6 w-full max-w-md ForNew-Employee"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="event-form">
                  <h3>
                    Attendance of{" "}
                    {selectedDay
                      ? selectedDay.toLocaleDateString()
                      : "Select a Day"}{" "}
                    {selectedTimeSlot} - ({FinalData?.Employee_ID})
                  </h3>
                  <br />
                  <div className="patient-form-123 patient-form-123_hr">
                    <div className="patient-form-123-div">
                      <label>
                        EmployeeName<span>:</span>{" "}
                      </label>
                      <p
                        style={{
                          fontSize: "13px",
                        }}
                      >
                        {FinalData?.EmployeeName}
                      </p>
                    </div>
                    <div className="patient-form-123-div">
                      <label>
                        Designation<span>:</span>{" "}
                      </label>
                      <p
                        style={{
                          fontSize: "13px",
                        }}
                      >
                        {FinalData?.Designation}
                      </p>
                    </div>

                    <div className="patient-form-123-div">
                      <label>
                        Department<span>:</span>{" "}
                      </label>
                      <p>{FinalData?.Department}</p>
                    </div>

                    <div className="patient-form-123-div">
                      <label>
                        Date<span>:</span>{" "}
                      </label>
                      <p
                        style={{
                          fontSize: "13px",
                        }}
                      >
                        {new Date().toISOString().split("T")[0]}
                      </p>
                    </div>
                    <div className="patient-form-123-div">
                      <label htmlFor="AttendanceStatus">
                        Attendance Status<span>:</span>
                      </label>
                      <select
                        value={AttendanceStatus}
                        name="AttendanceStatus"
                        onChange={(e) =>
                          setAttendanceStatus(e.target.value)
                        }
                        style={{
                          width: "130px",
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                    {!selecteddatedata?.In_TimeWithPeriod ? (
                      <div className="patient-form-123-div">
                        <label htmlFor="intime">
                          In Time<span>:</span>
                        </label>
                        <TimePicker
                          value={InTime}
                          onChange={(time) => setInTime(time)}
                        />
                      </div>
                    ) : (
                      <div className="patient-form-123-div">
                        <label htmlFor="intime">
                          In Time<span>:</span>
                        </label>
                        <span>{selecteddatedata?.In_TimeWithPeriod}</span>
                      </div>
                    )}

                    {!selecteddatedata?.Out_TimePeriod ? (
                      <div className="patient-form-123-div">
                        <label htmlFor="outtime">
                          Out Time<span>:</span>
                        </label>
                        <TimePicker
                          value={OutTime}
                          onChange={(time) => setOutTime(time)}
                        />
                      </div>
                    ) : (
                      <div className="patient-form-123-div">
                        <label htmlFor="intime">
                          Out Time<span>:</span>
                        </label>
                        <span>{selecteddatedata?.Out_TimePeriod}</span>
                      </div>
                    )}

                    <div className="button-group">
                      <button type="submit" onClick={handlesave}>
                        Save
                      </button>
                      <button type="button" onClick={clseShowEventForm}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "Shift" && shiftAssigned && (
              <div
                className="bg-white rounded-lg p-6 w-full max-w-md ForNew-Employee"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="Main_container_app">
                  <h3>
                    Shift Assign{" "}
                    {selectedDay
                      ? selectedDay.toLocaleDateString()
                      : "Select a Day"}{" "}
                    {selectedTimeSlot} - ({FinalData?.Employee_ID})
                  </h3>
                  <br />
                  <div className="RegisFormcon">
                    <div className="RegisForm_1">
                      <label htmlFor="startdate">
                        Start Date<span>:</span>
                      </label>
                      <input
                        type="date"
                        id="startdate"
                        name="startdate"
                        value={startdate}
                        onChange={handleDateChange}
                      />
                    </div>
                    <div className="RegisForm_1">
                      <label htmlFor="enddate">
                        End Date<span>:</span>
                      </label>
                      <input
                        type="date"
                        id="enddate"
                        name="enddate"
                        value={enddate}
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>
                  <br />
                  {weekDates.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <table
                        style={{
                          borderCollapse: "collapse",
                          width: "90%",
                          fontSize: "12px",
                          border: "1px solid black",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid black",
                                padding: "5px",
                              }}
                            >
                              Date
                            </th>
                            <th
                              style={{
                                border: "1px solid black",
                                padding: "5px",
                              }}
                            >
                              Select Shift
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {weekDates.map((date, index) => (
                            <tr key={index}>
                              <td
                                style={{
                                  border: "1px solid black",
                                  padding: "5px",
                                  textAlign: "center",
                                }}
                              >
                                {date}
                              </td>
                              <td
                                style={{
                                  border: "1px solid black",
                                  padding: "5px",
                                  textAlign: "center",
                                }}
                              >
                                <select
                                  style={{
                                    width: "100%",
                                  }}
                                  name={`shift-${date}`}
                                  value={shiftDetails[date] || ""}
                                  onChange={(e) =>
                                    handleShiftChange1(date, e.target.value)
                                  }
                                >
                                  <option value="">Select Shift</option>
                                  {Array.isArray(currentshifts) &&
                                    currentshifts.map((shift, idx) => (
                                      <option key={idx} value={shift.ShiftId}>
                                        {shift.ShiftName}
                                      </option>
                                    ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="Register_btn_con regster_btn_contsai">
                    <button
                      className="RegisterForm_1_btns"
                      onClick={handleShiftSubmit1}
                    >
                      Submit
                    </button>
                    <button
                      className="RegisterForm_1_btns"
                      onClick={handleCloseModal1}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="suifyuwe_kd9 suifyuwe_kd9_NewHR">
        <div className="flex items-center justify-between mb-6">
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
              }}
            >
              {/* <AccountCircleOutlinedIcon sx={{color: 'white'}}
                style={{ fontSize: "50px", color: "white !important" }}
              /> */}
              <h1
                style={{
                  fontSize: "25px",
                  borderBottom: "1px solid black",
                  width: "100%",
                }}
              >
                Employee Actions{" "}
              </h1>
              <br />
            </div>
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

export default EmployeeGoogleStyleCalendar;
