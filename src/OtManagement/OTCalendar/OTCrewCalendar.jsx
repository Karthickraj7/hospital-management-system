import React, { useState ,useEffect} from "react";
import { Plus, ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import "./OTCalendar.css";
import ReactDOM from "react-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";




const OTCrewCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("month");
  
    const [selectedDay, setSelectedDay] = useState(null);
  
    const [showTimelineModal, setShowTimelineModal] = useState(false);
  
  
    
    const [Theatredata,setTheatredata] = useState([]);
    const [Doctordata,setDoctordata] = useState([]);
    const [SelectedTheater,setSelectedTheater] = useState('');
    const [availableotdata,setavailableotdata] = useState([]);
    const [BookedDates,setBookedDates] = useState([]);

    const [Selectedcrewname,setSelectedcrewname] = useState('');
  const [SelectedDoctor,setSelectedDoctor] = useState('');
  
  
  
  
  
  
  
  
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  
  
    // Updated events with more details
    const [events, setEvents] = useState([]);
  
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
  
    const getTimeSlots = () => {
      const slots = [];
      for (let i = 0; i < 24; i++) {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const ampm = i < 12 ? "AM" : "PM";
        slots.push(`${hour.toString().padStart(2, "0")}:00 ${ampm}`);
      }
      return slots;
    };

    const formatDateToISOString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
   
  
    // Function to check if a day has any bookings
    const getDayStatus = (date) => {
      if (!date) return null;
      const dateStr = formatDateToISOString(date); // Local date string
      const dayEvents = events.filter((event) => event.bdate === dateStr);
      return dayEvents.length > 0 ? "booked" : "available";
    };
    // Function to get background color for the day
    const getDayColor = (status) => {
      return status === "booked" ? "bg-red-100" : "bg-green-100";
    };
  
    // Function to convert time to minutes since midnight
    const timeToMinutes = (time) => {
  
      console.log(time,'time');
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":");
      hours = parseInt(hours);
      minutes = parseInt(minutes);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
  
    const renderTimelineView = (dayEvents) => {
      const slots = getTimeSlots();
  
      console.log(slots,'slots');
  
      return (
        <div className="timeline-view">
          {slots.map((slot, index) => {
            // Convert current slot time to minutes for comparison
            const slotStartMinutes = index * 60;
            const slotEndMinutes = (index + 1) * 60;
  
            // Get events that overlap with this hour slot
            const hourEvents = dayEvents.filter((event) => {
              const eventStartMinutes = timeToMinutes(event.stime);
              const eventEndMinutes = timeToMinutes(event.etime);
  
              console.log(eventStartMinutes,'eventStartMinutes');
              console.log(eventEndMinutes,'eventStartMinutes');
  
              console.log(slotStartMinutes,'eventStartMinutes');
              console.log(slotEndMinutes,'eventStartMinutes');
  
              // Check if event overlaps with current hour slot
              return (
                eventStartMinutes < slotEndMinutes &&
                eventEndMinutes > slotStartMinutes
              );
            });
  
  
            console.log(hourEvents,'hourEvents');
  
            return (
              <div
                key={index}
                className="flex items-center p-2 border-b"
                style={{ gap: "20px" }}
              >
                <div className="w-24 flex-shrink-0 text-sm text-gray-600">
                  {slot}
                </div>
                <div className="flex-grow">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-red-100 p-2 rounded-md mb-1 flex"
                  //    style={{ width: "100%", backgroundColor: "red" }}
                    >
                      <div className="font-medium text-sm">
                        {" "}
                        {event.stime} - {event.etime} - 
                         {event.patientname} , {event.operationtype} (
                        {event.priority})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    };
  
    const sortEvents = (events) => {
      return events.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      });
    };
  
    const renderTimelineViewAll = () => {
      const sortedEvents = sortEvents(events);
      return (
        <div className="timeline-view-all">
          <h3 className="text-lg font-semibold mb-4">All Booked Patients</h3>
          <div className="max-h-96 overflow-y-auto">
            {sortedEvents.map((event) => (
              <div key={event.id} className="bg-red-100 p-2 rounded-md mb-2" style={{marginBottom:'5px'}}>
                <div className="font-medium text-sm">
                  {new Date(event.bdate).toLocaleDateString("default", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })} {" "}
                  - {event.stime} to {event.etime}
                </div>
                <div className="text-xs opacity-75">
                  {event.patientname} - {event.operationtype} ({event.priority})
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
  
  
  
  
    const renderMonthView = () => (
       <div className="grid grid-cols-mnth gap-1">
         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((daywise) => (
           <div key={daywise} className="text-center text-sm font-medium-mew-OT py-2">
             {daywise}
           </div>
         ))}
    
         {getDaysInMonth().map((date, index) => {
           const dayStatus = date ? getDayStatus(date) : null;
           const bgColor = date ? getDayColor(dayStatus) : "";
    
           return (
             <div
               key={index}
               className={`min-h-24 p-1 border border-gray-100 ${
                 date ? `cursor-pointer ${bgColor}` : ""
               }`}
               onClick={() => {
                 if (date) {
                   setSelectedDay(date);
                   const dateStr = formatDateToISOString(date); // Local date string
                   const dayEvents = events.filter(
                     (event) => event.bdate === dateStr
                   );
    
                   const timePickerModal = (
                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={() => {
                       const modal = document.querySelector(".fixed");
                       if (modal) modal.remove();
                     }}>
                       <div className="bg-white rounded-lg p-6 max-w-md-mnth" onClick={(e) => e.stopPropagation()}>
                         <h3 className="text-lg font-semibold mb-4 efwf_hg">
                           {dayStatus === "booked" ? "Bookings" : "Available Slots"}
                         </h3>
                         <div className="max-h-96 overflow-y-auto">
                           {dayStatus === "booked" ? (
                             renderTimelineView(dayEvents)
                           ) : (
                             <div className="text-center py-4">
                               <p>N/A - Available for booking</p>
                             </div>
                           )}
                         </div>
                         <br />
    
                         <div className="mt-4 flex justify-end">
                           <button
                             className="px-4 py-2 border rounded hover:bg-gray-50"
                             onClick={(e) => {
                               e.stopPropagation();
                               const modal = document.querySelector(".fixed");
                               if (modal) modal.remove();
                             }}
                           >
                             Close
                           </button>
                         </div>
                       </div>
                     </div>
                   );
    
                   const modalContainer = document.createElement("div");
                   document.body.appendChild(modalContainer);
                   ReactDOM.render(timePickerModal, modalContainer);
                 }
               }}
             >
               {date && (
                 <>
                   <div className="text-sm p-1">{date.getDate()}</div>
                   <div className="space-y-1">
                     {dayStatus === "available" ? (
                       <div className="text-xs opacity-75">
                         N/A - Available
                       </div>
                     ) : (
                       events
                         .filter(
                           (event) => event.bdate === formatDateToISOString(date)
                         )
                         .map((event) => (
                           <div
                             key={event.id}
                             className="bg-red-200 p-1 rounded text-xs shadow-sm"
                           >
                             <div className="font-semibold">
                               {event.stime} - {event.etime}
                             </div>
                             <div className="text-xs opacity-75">
                               {event.patientname} {event.operationtype} (
                               {event.priority})
                             </div>
                           </div>
                         ))
                     )}
                   </div>
                 </>
               )}
             </div>
           );
         })}
       </div>
     );
   
  
  
    useEffect(() => {
      axios
        .get(`${UrlLink}OT/get_Theatre_name_for_OT_Calendar`)
        .then((res) => setTheatredata(res.data))
        .catch((err) => console.log(err));
    }, [UrlLink]);
  
  
    const handleTheatreChange = (e) => {
     // const month = currentMonth.getMonth() + 1; // Months are 0-indexed
     // const year = currentMonth.getFullYear();
      setSelectedTheater(e.target.value);
     // fetchFilteredData(e.target.value, month, year);
    };
  
  
    // useEffect(() => {
    //   axios
    //     .get(`${UrlLink}OT/get_ot_availability?id=${SelectedTheater}`)
    //     .then((res) => {
    //       console.log(res.data);
    //       setEvents(res.data);
    //       // const dates = data.map((entry) => entry.bdate); 
    //       // console.log(dates,'premkumar');        // Extract the 'bdate' from API response
    //       // setBookedDates(dates); // Set the booked dates in state
    //     })
        
    //     .catch((err) => console.log(err));
    // }, [UrlLink,SelectedTheater]);


    useEffect(() => {
        axios
          .get(`${UrlLink}OT/Surgeon_list_for_calendar?categoryname=${Selectedcrewname}`)
          .then((res) => setDoctordata(res.data))
          .catch((err) => console.log(err));
      }, [Selectedcrewname]);


      useEffect(() => {
        axios
          .get(`${UrlLink}OT/get_ot_doctor_availability?docid=${SelectedDoctor}&desname=${Selectedcrewname}`)
          .then((res) => {
            console.log(res.data);
            const data = res.data;
            setEvents(res.data);
            const dates = data.map((entry) => entry.bdate); 
            console.log(dates,'premkumar');        // Extract the 'bdate' from API response
            setBookedDates(dates); // Set the booked dates in state
          })
          
          .catch((err) => console.log(err));
      }, [UrlLink,SelectedDoctor]);
      

    const handlecrewChange = (e) => {
      //  const month = currentMonth.getMonth() + 1; // Months are 0-indexed
       // const year = currentMonth.getFullYear();
        setSelectedcrewname(e.target.value);
        setSelectedDoctor("");
       // fetchFilteredData(e.target.value, month, year);
      };
    
      const handleDoctorChange = (e) => {
       // const month = currentMonth.getMonth() + 1; // Months are 0-indexed
       // const year = currentMonth.getFullYear();
        setSelectedDoctor(e.target.value);
       // fetchFilteredData(e.target.value, month, year);
      };
    
  
    return (
      <div className="edwueyu_08i">
        <div className="mx-auto p-4 max-w-6xl-OT">
          <div className="flex items-center justify-between mb-6 mb-6-OT">
            <div className="flex items-center gap-4">
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
  
            <div className="ftftrwfs_8y ftftrwfs_8y-OT">
             

              <div className="wdiuwq_cdj8">
                <label>
                Select Crew name<span>:</span>
                </label>
                <select
                    onChange={(e) => handlecrewChange(e)}
                    value={Selectedcrewname}
                  >
                    <option value="">Select</option>
        
                  <option value="SURGEON">SURGEON</option>
                  {/* <option value="JUNIORSURGEON">JUNIOR SURGEON</option> */}
                  <option value="ANAESTHESIOLOGIST">ANAESTHESIOLOGIST</option>
                  <option value="NURSE">NURSE</option>
                  {/* <option value="CIRCULATINGNURSE">CIRCULATINGNURSE</option> */}
                  <option value="TECHNICIAN">TECHNICIAN</option>
                  <option value="HELPER">HELPER</option>
                  </select>
              </div>


              <div className="wdiuwq_cdj8">
                <label>
                Select Doctor <span>:</span>
                </label>
                <select
                    onChange={(e) => handleDoctorChange(e)}
                    value={SelectedDoctor}
                  >
                    <option value="">Select</option>
                    {Array.isArray(Doctordata) &&
                      Doctordata.map((p, indx) => (
                        <option value={p.id} key={indx}>
                          {p.Doctorname}
                        </option>
                      ))}
                  </select>
              </div>



            </div>
            <div className="flex gap-2">
              {["month"].map((view) => (
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
  
  <div className="flex gap-2">
              <button
                onClick={() => setShowTimelineModal(true)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
              >
                Timeline
              </button>
            </div>
  
            </div>
          </div>
  
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 max-w-6xl-OT">
              {currentView === "month" && renderMonthView()}
            </div>
          </div>
        </div>
  
        {showTimelineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"                 onClick={() => setShowTimelineModal(false)}
  >
            <div className="bg-white rounded-lg p-6  max-w-md-mnth" onClick={(e) => e.stopPropagation()}>
              {renderTimelineViewAll()}
  
              <br />
  
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                  onClick={() => setShowTimelineModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
  
      </div>
    );
  };

export default OTCrewCalendar