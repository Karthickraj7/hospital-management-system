import React, { useState, useEffect, useRef, useCallback } from "react";
import "./AppointmentCalender.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { differenceInMinutes, parse } from "date-fns";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

const Months = () => {

  const dispatch = useDispatch();

  const toast = useSelector((state) => state.userRecord?.toast);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const [TotalAppointmentCount, setTotalAppointmentCount] = useState([]);
  
  const [RequestTotalCount, setRequestTotalCount] = useState([]);
  const [calendarDays, setCalendarDays] = useState([]);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);

  const [SelectedDoctor, setSelectedDoctor] = useState('');
  const [DoctorsArray, setDoctorsArray] = useState([]);
  
  const clickTimeoutRef = useRef(null);
  
  const [selectedAvailableCells, setSelectedAvailableCells] = useState([]);
  const [selectedNotAvailableCells, setSelectedNotAvailableCells] = useState([]);

  const [StatusforsinleDate,setStatusforsinleDate]=useState('')


  useEffect(() => {
    axios
      .get(`${UrlLink}Frontoffice/Get_OP_Doctor_For_appointment`)
      .then((res) => {
        const ress = res.data;
        
          console.log('ress----------',ress);
          if (ress && Array.isArray(ress) && ress.length !==0){
            setDoctorsArray(ress);
        }   
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);


  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      const prevMonthDate = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth() - 1,
        1
      );

      return prevMonthDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const nextMonthDate = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
        1
      );
      return nextMonthDate;
    });
  };

  useEffect(() => {
    const daysInMonth = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
      const startingDay = new Date(year, month, 1).getDay();
      const daysArray = [];

      for (let i = 0; i < startingDay; i++) {
        daysArray.push(null);
      }

      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        // Manually format the date string to avoid timezone issues
        const dateString = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;
        // console.log("DateeeeSSSSS", dateString);

        let appointment_count = RequestTotalCount[dateString] || 0;
        // console.log("countttiddddd", appointment_count);
        daysArray.push({
          date,
          appointment_count,
        });
      }
      return daysArray;
    };

    const updateCalenderDays = () => {
      const days = daysInMonth();
      setCalendarDays(days);
    };
    updateCalenderDays();
  }, [currentMonth, SelectedDoctor, RequestTotalCount]);



  // useEffect(() => {
  //   const fetchAppointmentData = async () => {
  //     try {
  //       // Replace with your actual API endpoint and parameters
        

  //       // Process the data to store doctor details and appointment counts
  //       const processedDoctors = data.map((doctor) => {
  //         return {
  //           doctor_id: doctor.doctor_id,
  //           doctor_name: doctor.doctor_name,
  //           doctor_specialization: doctor.doctor_specialization,
  //           daily_appointment_counts: doctor.daily_appointment_counts,
  //         };
  //       });
  //       console.log("Prroooocccc", processedDoctors);
  //       console.log("PrrooooccccCheck", processedDoctors?.[0]?.doctor_name);

  //       setTotalAppointmentCount(processedDoctors);
  //     } catch (error) {
  //       console.error("Error fetching appointment data:", error);
  //     }
  //   };

  //   fetchAppointmentData();
  // }, [UrlLink, currentMonth,SelectedDoctor,UserData.location]);



  const Get_Patient_List =useCallback((day_status,formattedDate)=>{    
    axios.get(`${UrlLink}Frontoffice/daily_appointment_patient_list`,
     {
       params: {
         LocationId: UserData.location,
         SelectedDoctor:SelectedDoctor,
         Daystatus:day_status,
         formattedDate:formattedDate,
       },
     }
   )
   .then((res)=>{
    const data = res.data;
    console.log("countdataaaa", data);
    if(data && Object.values(data).length!==0){
    setTotalAppointmentCount(data);
    }
    else{
    setTotalAppointmentCount([]);
    }

   })
   .catch((err)=>{
    console.log(err);    
   })

  
 },[SelectedDoctor,UserData.location])

 



  const handleDayClick = (day,day_status) => {
    const dayName = day.date.toLocaleString("en-US", { weekday: "long" });
    const dayOfMonth = String(day.date.getDate()).padStart(2, "0");
    const month = String(day.date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = day.date.getFullYear();
    const formattedDate = `${year}-${month}-${dayOfMonth}`; // This should match the JSON format
    console.log("Clicked day:", dayName);
    console.log("Clicked_date:", formattedDate);
    clearTimeout(clickTimeoutRef.current);
    

    clickTimeoutRef.current = setTimeout(() => {
      Get_Patient_List(day_status,formattedDate)
      setStatusforsinleDate(day_status)
      setShowModal(true);
    }, 300);
  };








  

  useEffect(() => {
    const fetchAppointmentRequestData = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Frontoffice/daily_appointment_counts_all_doctors`,
          {
            params: {
              LocationId: UserData.location,
              Searchdate:SelectedDoctor,
              SelectedDoctor: SelectedDoctor
            },
          }
        );
        const data = response.data;
        setRequestTotalCount(data);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
        // Optionally set error state for user feedback
      }
    };
  
    fetchAppointmentRequestData();
  }, [UrlLink, currentMonth, SelectedDoctor, UserData.location]);
  




 





 

  const handleCloseModal = () => {
    setShowModal(false);
  };



  const formatDate = (dateString) => {
    // Remove leading slash if present
    dateString = dateString.startsWith("/") ? dateString.slice(1) : dateString;

    // Convert the string to a Date object
    const date = new Date(dateString);

    // Extract year, month, and day from the Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, "0");

    // Format the date as "YYYY-MM-DD"
    return `${year}-${month}-${day}`;
  };
  // Sort and format the selected dates
  const sortedFormattedAvailDates = selectedAvailableCells
    .map(formatDate)
    .sort((a, b) => new Date(a) - new Date(b));
  const sortedFormattedNotAvailDates = selectedNotAvailableCells
    .map(formatDate)
    .sort((a, b) => new Date(a) - new Date(b));

  // Determine the display format
  const displayAvailDateRange =
    sortedFormattedAvailDates.length > 1
      ? `${sortedFormattedAvailDates[0]} to ${
          sortedFormattedAvailDates[sortedFormattedAvailDates.length - 1]
        }`
      : sortedFormattedAvailDates[0];
  const displayNotAvailDateRange =
    sortedFormattedNotAvailDates.length > 1
      ? `${sortedFormattedNotAvailDates[0]} to ${
          sortedFormattedNotAvailDates[sortedFormattedNotAvailDates.length - 1]
        }`
      : sortedFormattedNotAvailDates[0];

  // console.log("Formatted Avail Date Range:", displayAvailDateRange); // Outputs "07/08/2024 to 09/08/2024"
  // console.log("Formatted NA Date Range:", displayNotAvailDateRange); // Outputs "07/08/2024 to 09/08/2024"
  const formattedSelectedAvailableCells =
    selectedAvailableCells.map(formatDate);
  const formattedselectedNotAvailableCells =
    selectedNotAvailableCells.map(formatDate);

  // console.log(
  //   "formattedSelectedAvailableCells",
  //   formattedSelectedAvailableCells
  // );
  // console.log(
  //   "formattedselectedNotAvailableCells",
  //   formattedselectedNotAvailableCells
  // );

  // Handle keydown event


const  Appointmentcolumn =[

  {
    key:'id',
    name:'S.No',    
  },
  {
    key:'PatientName',
    name:'Patient Name',    
  },
  {
    key:'PhoneNumber',
    name:'Phone Number',    
  },
  {
    key:'AppointmentType',
    name:'Appointment Type',    
  },
  {
    key:'RequestTime',
    name:'Request Time',    
  },
  {
    key:'VisitPurpose',
    name:'Visit Purpose',    
  },

]



const  Registercolumn =[

  {
    key:'id',
    name:'S.No',    
  },
  {
    key:'PatientName',
    name:'Patient Name',    
  },
  {
    key:'PhoneNumber',
    name:'Phone Number',    
  },
  {
    key:'AppointmentSlot',
    name:'Appointment Slot',    
  },
  {
    key:'VisitPurpose',
    name:'Visit Purpose',    
  },

]




  

  const handleCellClick = (e, day) => {
    e.preventDefault();
    console.log("righttttt clickeedd");

    const cellKey = day.date.toDateString(); 
    const dayName = day.date.toLocaleString("en-US", { weekday: "long" }); 

    setSelectedNotAvailableCells([]);
    setSelectedAvailableCells(
      (prevSelected) =>
        prevSelected.includes(cellKey)
          ? prevSelected.filter((cell) => cell !== cellKey) 
          : [...prevSelected, cellKey]
    );
  };
  const renderCalendar = () => {
    let rows = [];
    let cells = [];

   
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    calendarDays.forEach((day, index) => {
      if (index % 7 === 0) {
        rows.push(cells);
        cells = [];
      }

      if (day) {
        const isSunday = day.date.getDay() === 0;
        const isToday = day.date.getTime() === today.getTime(); // Check if the date is today
        const isBeforeToday = day.date.getTime() < today.getTime(); // Check if the date is before today
        const isSelectedAvailable = selectedAvailableCells.includes(
          day.date.toDateString()
        );
        const isSelectedNotAvailable = selectedNotAvailableCells.includes(
          day.date.toDateString()
        );

        cells.push(
          <td
            key={index}
            className={`cal_flex ${
              isSelectedAvailable
                ? "selected_available"
                : isSelectedNotAvailable
                ? "selected_not_available"
                : ""
            }
            ${isToday ? "today_date" : ""}`}
            onContextMenu={(e) => handleCellClick(e, day)}
          >
            <div
              className="day"
            >
              <span
                className={`date ${isSunday ? "calendar_date_sunday" : ""}`}
              >
                {day.date.getDate()}
              </span>
              <div className="calendar_app">
                <div className="appointment_body_1">
                  <div className="appointment_data_1">
                    <div>
                      <span onClick={() => handleDayClick(day,'Total')} >Requested</span>
                      <span> :</span>
                    </div>
                    <span className="appointment_count_1">
                      {day.appointment_count.Total || 0} 
                    </span>
                  </div>

                  <div className="appointment_data_1">
                    <div>
                      <span onClick={() => handleDayClick(day,'PENDING')}>Pending</span>
                      <span> :</span>
                    </div>
                    <span className="appointment_count_1">
                      {day.appointment_count.Pending || 0} 
                    </span>
                  </div>

                  <div className="appointment_data_1">
                    <div>
                      <span  onClick={() => handleDayClick(day,'REGISTERED')} >Registered</span>
                      <span> :</span>
                    </div>
                    <span className="appointment_count_1">
                      {day.appointment_count.Registered || 0} 
                    </span>
                  </div>

                  <div className="appointment_data_1">
                    <div>
                      <span  onClick={() => handleDayClick(day,'CANCELLED')} >Canceled</span>
                      <span> :</span>
                    </div>
                    <span className="appointment_count_1">
                      {day.appointment_count.Canceled || 0} 
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
        <div className="calender_table_overall">
          <div className="calender_table">
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

                <label htmlFor="names">
                  Select Doctor <span>:</span>
                </label>
                <select
                  className="calender_table_locations_select"
                  name="Doctor Location"
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  value={SelectedDoctor}
                >
                  <option value=''>Select</option>
                  {DoctorsArray.map((p, indx) => (
                    
                    <option value={p.id} key={indx}>
                      {p.ShortName}
                    </option>
                  ))}
                 
                </select>
         

            </div>
            <table>
              <thead>
                <tr>
                  <th className="calender_month_sunday">Sun</th>
                  <th className="calender_table_head">Mon</th>
                  <th className="calender_table_head">Tue</th>
                  <th className="calender_table_head">Wed</th>
                  <th className="calender_table_head">Thu</th>
                  <th className="calender_table_head">Fri</th>
                  <th className="calender_table_head">Sat</th>
                </tr>
              </thead>
              <tbody className="calender_table_body">
                {rows
                  .filter((f, i) => f)
                  .map((row, index) => (
                    <tr key={index}>{row}</tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="calendar-container">
        {renderCalendar()}


        {showModal && TotalAppointmentCount && Object.values(TotalAppointmentCount).length !== 0 && (
          <div className="loader" onClick={() => setShowModal(false)}>
            
            <div className="loader_register_roomshow"   onClick={(e) => e.stopPropagation()}>
            <br/>
            {
              TotalAppointmentCount.map((ele,ind)=>{
                return(
                  <React.Fragment key={ind+'key'}>

                <div className="common_center_tag">
                    <span>{ele.DoctorName}</span>
                </div>

                <br/>
                <br/>
                <ReactGrid columns={ StatusforsinleDate === 'REGISTERED' ? Registercolumn : Appointmentcolumn} RowData={ele.Appointments} />
                <br/>
                </React.Fragment>
                )
              })
            }

            </div>            
            
            
          </div>
        )}

      
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default Months;
