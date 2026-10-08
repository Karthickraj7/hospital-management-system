import React, { useState, useEffect } from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import axios from "axios";
import { format } from "date-fns";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSelector } from "react-redux";

const EmployeeCalendar = () => {
  const employeeIdget = useSelector((state) => state.userRecord?.employeeIdget);
  console.log("employeeIdget",employeeIdget);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [holidays, setHolidays] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal3, setShowModal3] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}HR_Management/attendance_report?location=${userRecord?.location}&EmployeeID=${employeeIdget}`
      )
      .then((response) => {
        console.log("calendat",response.data);
        setAttendance(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [employeeIdget, userRecord, UrlLink]);

  useEffect(() => {
    // Function to fetch holidays
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(`${UrlLink}HR_Management/holiday`);
        console.log("Holidays fetched:", response.data);
        setHolidays(response.data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    // Call the fetch function
    fetchHolidays();
  }, [UrlLink]);

  const handlePreviousMonth = () => {
    setCurrentMonth(
      (prevMonth) =>
        new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prevMonth) =>
        new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1)
    );
  };

  const getStartingDayOfMonth = () => {
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    return firstDay.getDay();
  };

  const daysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const startingDay = getStartingDayOfMonth();
    const daysArray = [];

    for (let i = 0; i < startingDay; i++) {
      daysArray.push(null);
    }

    for (let day = 1; day <= lastDay; day++) {
      console.log("1234",attendance)
      const date = new Date(year, month, day);
      const formattedDate = format(date, "dd-MM-yyyy");
      console.log("loose",formattedDate)
      const attendanceData =
      Array.isArray(attendance) && attendance.find((item) => item?.Date === formattedDate) || {
        In_Time: "N/A",
        Out_Time: "N/A",
        Working_Hours: "N/A",
      };
    

      daysArray.push({
        date,
        attendance: attendanceData,
      });
    }

    return daysArray;
  };

  const renderCalendar = () => {
    const days = daysInMonth();
    let rows = [];
    let cells = [];

    days.forEach((day, index) => {
      if (index % 7 === 0 && cells.length > 0) {
        rows.push(cells);
        cells = [];
      }

      if (day) {
        console.log("day",day);
        let isHolidayClass = "";
        let holidayName = "";

        if (day.date) {
          const formattedDate = format(day.date, "yyyy-MM-dd");
          console.log("formattedDate456",formattedDate);
          const isHoliday = holidays[formattedDate];
          isHolidayClass = isHoliday ? "holiday" : "";
          holidayName = isHoliday ? holidays[formattedDate] : "";
        }

        cells.push(
          <td key={index} className={`cal_flex ${isHolidayClass}`}>
            <div className="day">
              <span className="date">{day.date.getDate()}</span>
              {/* {console.log(day)} */}
              {holidayName && <div className="holiday-name" style={{ color: 'red' }}>{holidayName}</div>}
              <div className="calendar_app">
                <div className="appointment_body_1">
                  <div className="appointment_data_1" title="intime">
                    <div>
                      <span>In Time</span>
                      <span>:</span>
                    </div>
                    <span className="appointment_count_1">
                      {day.attendance.In_Time || "N/A"}
                    </span>
                  </div>
                  <div className="appointment_data_1" title="Request">
                    <div>
                      <span>Out Time</span>
                      <span>:</span>
                    </div>
                    <span className="appointment_count_1">
                      {day.attendance.Out_Time || "N/A"}
                    </span>
                  </div>
                  <div className="appointment_data_1" title="Request">
                    <div>
                      <span>Work Time</span>
                      <span>:</span>
                    </div>
                    <span className="appointment_count_1">
                      {day.attendance.Working_Hours || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        );
      } else {
        cells.push(<td key={index} className="cal_flex empty-cell"></td>);
      }
    });

    rows.push(cells);

    return (
      <>
        <div className="total_calendar total-emp-cald-con">
          <div className="h_head">
            <h4>Employee Calendar</h4>
          </div>
          <div className="calendar emple-calndr-with">
            <div className="cal_mon_1">
              <button onClick={handlePreviousMonth}>
                <KeyboardDoubleArrowLeftIcon />
              </button>
              <h3>
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button onClick={handleNextMonth}>
                <KeyboardDoubleArrowRightIcon />
              </button>
            </div>
            <div className="select_items_appointment">
              <div className="doctor_select appoint_booked_count gap-fr-emplcldr">
                <div className="crt-the-emlclnd-wth">
                  <label htmlFor="employeeId">Employee ID :</label>
                  <input type="text" name="employeeId" value={employeeIdget} readOnly />
                </div>
              </div>
            </div>
          </div>
          <div className="calender_table_overall">
            <div className="calender_table">
              <table>
                <thead>
                  <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                  </tr>
                </thead>
                <tbody>
                  {rows?.map((row, index) => (
                    <tr key={index}>{row}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  };

  const handleCloseModal = () => {
    setShowModal3(false);
  };

  return (
    <div className="calendar-container">
      {renderCalendar()}

    {showModal3 && (
        <div className="modal-container" onClick={handleCloseModal}>
          <div className="App_Cal_modal" onClick={(e) => e.stopPropagation()}>
            <h3>Leave Details</h3>
            <div>
              <p>
                {/* <strong>In Time:</strong> {selectedAttendanceDetails.in_time} */}
              </p>
              <p>
                {/* <strong>Out Time:</strong> {selectedAttendanceDetails.out_time} */}
              </p>
              <p>
                {/* <strong>Reason:</strong> {selectedAttendanceDetails.reason} */}
              </p>
            </div>
            <button onClick={handleCloseModal} className="booked_app_btn">
              <HighlightOffIcon />
            </button>
          </div>
        </div>
      )} 
    </div>
  );
};

export default EmployeeCalendar;
