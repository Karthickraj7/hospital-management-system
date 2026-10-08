// =========otreports===============

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";

const ReferalTheatrelist = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [bookingValue, setBookingValue] = useState([]);
  const [searchstatus, setSearchstatus] = useState("");

  const [dateOption, setDateOption] = useState("current");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Function to handle status change
  const handleStatusChange = (e) => {
    setSearchstatus(e.target.value);
  };

  const TheatreListColumns = [
    { key: "sno", name: "S.No", frozen: true },
    { key: "Patientid", name: "Patient ID", frozen: true },
    { key: "PatientName", name: "Patient Name", frozen: true },
    { key: "SurgeryName", name: "Surgery Name", frozen: true },
    { key: "BookingType", name: "Booking Type", frozen: true },
    { key: "BookingDate", name: "Booking Date", frozen: true },
    { key: "BookingTime", name: "Booking Time", frozen: true },
    { key: "OperationType", name: "Operation Type", frozen: true },
    { key: "Gender", name: "Gender", frozen: true },
    { key: "Age", name: "Age", frozen: true },
    { key: "requestdate", name: "Request Date", frozen: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let params = { status: searchstatus || "all" };

        if (dateOption === "custom") {
          if (fromDate && toDate) {
            params.request_from_date = fromDate;
            params.request_to_date = toDate;
          } else {
            return; // Don't fetch if both dates are missing
          }
        } else if (dateOption === "current") {
          const today = new Date().toISOString().split("T")[0];
          params.request_from_date = today;
          params.request_to_date = today;
        }

        const response = await axios.get(
          `${UrlLink}Masters/Theatre_booking_request_detail_by_status`,
          { params }
        );
        setBookingValue(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [UrlLink, dateOption, fromDate, toDate, searchstatus]);

  return (
    <div className="Main_container_app">
      <h3>Theatre Booking List</h3>

      <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
        <div className="RegisForm_1">
          <label>
            Status <span>:</span>{" "}
          </label>
          <select value={searchstatus} onChange={handleStatusChange}>
            <option value="">Select</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="Canceled">Canceled</option>
            <option value="reschedule">Reschedule</option>
          </select>

          <label>
            Date <span>:</span>{" "}
          </label>
          <select value={dateOption} onChange={(e) => setDateOption(e.target.value)}>
            <option value="current">Current Date</option>
            <option value="custom">Custom Date</option>
          </select>

          {dateOption === "custom" && (
            <div className="RegisForm_1">
              <label>
                From <span>:</span>{" "}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <label>
                To <span>:</span>{" "}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Grid component */}
        <ReactGrid columns={TheatreListColumns} RowData={bookingValue} />
      </div>
    </div>
  );
};

export default ReferalTheatrelist;









// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';


// const ReferalTheatrelist = () => {


//     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//     const [bookingValue,SetbookingValue] = useState([]);

//     // const [searchQuery, setSearchQuery] = useState('');
//     const [searchDept,setSearchDept] = useState('');



//     // const handleChange = (e) => {
//     //     setSearchQuery(e.target.value);
//     //   };

//     const handleStatusChange = (e) => {
//         setSearchDept(e.target.value);
//       };

      


//     const TheatreListColumns = [
//         {
//             key: "sno",
//             name: "sno",
//             frozen: true
//         },
//         {
//             key: "Patientid",
//             name: "Patient id",
//             frozen: true
//         },
//         {
//             key: "PatientName",
//             name: "Patient Name",
//             frozen: true
//         },
//         {
//             key: "SurgeryName",
//             name: "SurgeryName",
//             frozen: true
//         },
//         {
//             key: "BookingType",
//             name: "Booking Type",
//             frozen: true
//         },
//         {
//             key: "BookingDate",
//             name: "Booking Date",
//             frozen: true
//         },
//         {
//             key: "BookingTime",
//             name: "BookingTime",
//             frozen: true
//         },
//         {
//             key: "OperationType",
//             name: "OperationType",
//             frozen: true
//         },
//         {
//             key: "Gender",
//             name: "Gender",
//             frozen: true
//         },
//         {
//             key: "Age",
//             name: "Age",
//             frozen: true
//         },
//         // {
//         //     key: "TahsilName",
//         //     name: "Tahsil Name",
//         //     frozen: true
//         // },
//         // {
//         //     key: "VillageName",
//         //     name: "Village Name",
//         //     frozen: true
//         // }
//     ]
//    useEffect(()=>{

//     const params = searchQuery.trim()
//       ? { search: searchQuery }
//       : { limit: 10 };

//     params.dept = searchDept;

//     console.log(searchDept,"kkkk");
//     console.log(searchQuery,"llll");





//        axios.get(`${UrlLink}Masters/Theatre_booking_request_detail_by_status`,{ searchDept })
//       .then((res) => SetbookingValue(res.data))
//       .catch(console.log);

//    },[UrlLink,searchQuery,searchDept])
    
  

//   return (
//     <>
//     <div className="Main_container_app">
//     <h3>Referal Doctor List</h3>
//     <div className="RegisFormcon_1" style={{marginTop:'10px'}}>
//     <div className="RegisFormcon_1">
//             <div className="RegisForm_1">
//                 <label> Search Here <span>:</span> </label>
//                 <input
//                 type="text"
//                 placeholder='Enter DoctorId, DoctorName, or CasesheetNo'
//                 value={searchQuery}
//                 onChange={handleChange}
//                 />
//             </div>

//             <div className="RegisForm_1">
//                 <label> Status <span>:</span> </label>
//                 <select 
//                     value={searchDept} 
//                     onChange={handleStatusChange(e)}
//                 >
//                     <option value="">select</option>
//                     <option value="pending">pending</option>
//                     <option value="completed">completed</option>
//                     <option value="successful">successful</option>
//                     <option value="reschedule">reschedule</option>
//                 </select>
//             </div>
//             </div>
      
    
       
//             <ReactGrid columns={TheatreListColumns} RowData={bookingValue} />
          
          
//     </div>
//    </div>
//     </>
//   )
// }
// 000000000000000000
// export default ReferalTheatrelist

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";

// const ReferalTheatrelist = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [bookingValue, setBookingValue] = useState([]);
//   const [searchstatus, setSearchstatus] = useState(""); // Status filter

//   const [dateOption, setDateOption] = useState('current');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   console.log(searchstatus);
//   // Function to handle status change
//   const handleStatusChange = (e) => {
//     setSearchstatus(e.target.value);
//   };

//   const TheatreListColumns = [
//     { key: "sno", name: "S.No", frozen: true },
//     { key: "Patientid", name: "Patient ID", frozen: true },
//     { key: "PatientName", name: "Patient Name", frozen: true },
//     { key: "SurgeryName", name: "Surgery Name", frozen: true },
//     { key: "BookingType", name: "Booking Type", frozen: true },
//     { key: "BookingDate", name: "Booking Date", frozen: true },
//     { key: "BookingTime", name: "Booking Time", frozen: true },
//     { key: "OperationType", name: "Operation Type", frozen: true },
//     { key: "Gender", name: "Gender", frozen: true },
//     { key: "Age", name: "Age", frozen: true },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${UrlLink}Masters/Theatre_booking_request_detail_by_status`, {
//           params: { status: searchstatus || "all" }, // Default to "all"
//         });
//         setBookingValue(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     // =========
//     if (dateOption === 'custom') {
//       if (fromDate && toDate) {
//         params.fromDate = fromDate;
//         params.toDate = toDate;
//       } else {
//         // setPatientList([]); // Clear the data if both dates are not provided
//         return;
//       }
//     } else if (dateOption === 'current') {
//       const today = new Date().toISOString().split('T')[0];
//       console.log(today);
//       params.fromDate = today;
//       params.toDate = today;
//     }

//     fetchData();
//   }, [UrlLink,dateOption, fromDate, toDate, searchstatus]); // Removed unnecessary dependencies

//   const handleDateOptionChange = (e) => {
//     setDateOption(e.target.value);
//     // Clear the dates if switching back to "Current Date"
//     if (e.target.value === 'current') {
//       setFromDate('');
//       setToDate('');
//     }
//   };

//   const handleFromDateChange = (e) => {
//     setFromDate(e.target.value);
//   };

//   const handleToDateChange = (e) => {
//     setToDate(e.target.value);
//   };
  
  
//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Theatre Booking List</h3>

//         <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
//           <div className="RegisFormcon_1">
//             <div className="RegisForm_1">
//               <label> Status <span>:</span> </label>
//               <select value={searchstatus} onChange={handleStatusChange}>
//                 <option value="">Select</option>
//                 <option value="pending">Pending</option>
//                 <option value="completed">Completed</option>
//                 <option value="Canceled">Canceled</option>
//                 <option value="reschedule">Reschedule</option>
//               </select>

//               <label> Date <span>:</span> </label>
//                 <select 
//                     value={dateOption} 
//                     onChange={handleDateOptionChange}
//                 >
//                     <option value="current">Current Date</option>
//                     <option value="custom">Custom Date</option>
//                 </select>

//                 {dateOption === 'custom' && (
//                     <div className="RegisForm_1">
//                     <label> From  <span>:</span> </label>

//                     <input
//                         type="date"
//                         placeholder="From Date"
//                         value={fromDate}
//                         onChange={handleFromDateChange}
//                     />
//                     <label> To  <span>:</span> </label>

//                     <input
//                         type="date"
//                         placeholder="To Date"
//                         value={toDate}
//                         onChange={handleToDateChange}
//                     />
//                       </div>
//                 )}
//                </div>
//           </div>

//           {/* Grid component */}
//           <ReactGrid columns={TheatreListColumns} RowData={bookingValue} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default ReferalTheatrelist;



// ============---------------

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";

// const ReferalTheatrelist = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [bookingValue, setBookingValue] = useState([]);
//   const [searchstatus, setSearchstatus] = useState(""); // Status filter

//   const [dateOption, setDateOption] = useState("current");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // Function to handle status change
//   const handleStatusChange = (e) => {
//     setSearchstatus(e.target.value);
//   };

//   const TheatreListColumns = [
//     { key: "sno", name: "S.No", frozen: true },
//     { key: "Patientid", name: "Patient ID", frozen: true },
//     { key: "PatientName", name: "Patient Name", frozen: true },
//     { key: "SurgeryName", name: "Surgery Name", frozen: true },
//     { key: "BookingType", name: "Booking Type", frozen: true },
//     { key: "BookingDate", name: "Booking Date", frozen: true },
//     { key: "BookingTime", name: "Booking Time", frozen: true },
//     { key: "OperationType", name: "Operation Type", frozen: true },
//     { key: "Gender", name: "Gender", frozen: true },
//     { key: "Age", name: "Age", frozen: true },
//     { key: "requestdate", name: "Request Date", frozen: true },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let params = { status: searchstatus || "all" };

//         if (dateOption === "custom") {
//           if (fromDate && toDate) {
//             params.fromDate = fromDate;
//             params.toDate = toDate;
//           } else {
//             return; // Don't fetch if dates are missing
//           }
//         } else if (dateOption === "current") {
//           const today = new Date().toISOString().split("T")[0];
//           params.fromDate = today;
//           params.toDate = today;
//         }

//         const response = await axios.get(
//           `${UrlLink}Masters/Theatre_booking_request_detail_by_status`,
//           { params }
//         );
//         setBookingValue(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [UrlLink, dateOption, fromDate, toDate, searchstatus]);

//   return (
//     <div className="Main_container_app">
//       <h3>Theatre Booking List</h3>

//       <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
//         <div className="RegisForm_1">
//           <label>
//             Status <span>:</span>{" "}
//           </label>
//           <select value={searchstatus} onChange={handleStatusChange}>
//             <option value="">Select</option>
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//             <option value="Canceled">Canceled</option>
//             <option value="reschedule">Reschedule</option>
//           </select>

//           <label>
//             Date <span>:</span>{" "}
//           </label>
//           <select value={dateOption} onChange={(e) => setDateOption(e.target.value)}>
//             <option value="current">Current Date</option>
//             <option value="custom">Custom Date</option>
//           </select>

//           {dateOption === "custom" && (
//             <div className="RegisForm_1">
//               <label>
//                 From <span>:</span>{" "}
//               </label>
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />

//               <label>
//                 To <span>:</span>{" "}
//               </label>
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>
//           )}
//         </div>

//         {/* Grid component */}
//         <ReactGrid columns={TheatreListColumns} RowData={bookingValue} />
//       </div>
//     </div>
//   );
// };

// export default ReferalTheatrelist;



// =============================================

