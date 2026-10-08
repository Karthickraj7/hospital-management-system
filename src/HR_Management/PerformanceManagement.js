// import React, { useState, useEffect } from "react";

// import axios from "axios";

// import { useSelector } from "react-redux";


// const PerformanceManagement = () => {

//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchQuery1, setSearchQuery1] = useState("");
//   const [searchQuery2, setSearchQuery2] = useState("");
//   const [rows, setRows] = useState([]);
//   const [FilteredRows, setFilteredRows] = useState([])
//   const urllink = useSelector((state) => state.userRecord?.UrlLink);


//   const handleSearchChange = (event) => {
//     const { id, value } = event.target;

//     if (id === "employeeName") {
//       setSearchQuery(value);
//     } else if (id === "designation") {
//       setSearchQuery1(value);
//     } else if (id === "date") {
//       setSearchQuery2(value);
//     }
//   };



//   useEffect(() => {
//     const location = userRecord.location;
//     axios
//       .get(
//         `${urllink}HR_Management/get_employeeperformance?location=${location}`
//       )
//       .then((response) => {
//         const data = response.data;
//         console.log(data);
//         setRows(data);

//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [userRecord, urllink]);



//   useEffect(() => {
//     const filteredData = rows.filter((row) => {
//       const lowercaseEmployeeName = row.EmployeeName ? row.EmployeeName.toLowerCase() : "";
//       const lowerCaseDesignation = row.Designation ? row.Designation.toString() : "";
//       const lowercasedate = row.date ? row.date.toString() : "";

//       const startsWithEmployeeName = lowercaseEmployeeName.startsWith(searchQuery.toLowerCase());
//       const startsWithDesignation = lowerCaseDesignation.startsWith(searchQuery1.toLowerCase());
//       const startsWithDate = lowercasedate.startsWith(searchQuery2.toLowerCase());

//       return (
//         (startsWithEmployeeName || !searchQuery) &&
//         (startsWithDesignation || !searchQuery1) &&
//         (startsWithDate || !searchQuery2)
//       );
//     });

//     setFilteredRows(filteredData);
//   }, [searchQuery, searchQuery1, searchQuery2, rows]);



//   return (

//     <div className="appointment">
//       <div className="h_head">
//         <h4>Performance Management </h4>
//       </div>


//       <div className="con_1 ">
//         <div className="inp_1">
//           <label htmlFor="employeeName">Employee Name <span>:</span></label>
//           <input
//             type="text"
//             id="employeeName"
//             name="employeeName"
//             placeholder="Enter Employee Name"
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <div className="inp_1">
//           <label htmlFor="designation">Designation <span>:</span></label>
//           <select
//             name="designation"
//             className="new-custom-input-phone vital_select"
//             id="designation"
//             value={searchQuery1}
//             onChange={handleSearchChange}
//           >
//             <option value="alldesignation"> Select</option>
//             <option value="doctor">Doctor</option>
//             <option value="Nurse"> Nurse</option>
//             <option value="frontoffice">Front Office </option>
//           </select>
//         </div>
//       </div>
//       <div className="con_1 ">
//         <div className="inp_1">
//           <label htmlFor="date">Date <span>:</span></label>
//           <input
//             type="date"
//             id="date"
//             name="date"
//             value={searchQuery2}
//             onChange={handleSearchChange}
//           />
//         </div>

//       </div>
//       <div className="Selected-table-container">
//         <table className="selected-medicine-table2">
//           <thead>
//             <tr>
//               <th>Sl.No</th>
//               <th>Employee ID</th>
//               <th>Employee Name</th>
//               <th>Designation</th>
//               <th>Date</th>
//               <th>Hike Type</th>
//               <th>Allowance Name</th>
//               <th>Previous Allowance</th>
//               <th>Previous Allowance Amount</th>
//               <th>New Allowance</th>
//               <th>New Allowance Amount</th>
//               <th>Final Allowance Amount</th>
//               <th>Remarks</th>
//               <th>Approved By</th>
//             </tr>
//           </thead>
//           <tbody>
//             {FilteredRows.map((row) => (
//               <tr key={row.EmployeeID}>
//                 <td>{row.Sl_No}</td>
//                 <td>{row.EmployeeID}</td>
//                 <td>{row.EmployeeName}</td>
//                 <td>{row.Designation}</td>
//                 <td>{row.date}</td>
//                 <td>{row.HikeType}</td>
//                 <td>{row.AllowanceName}</td>
//                 <td>{row.PreviousAllowance}</td>
//                 <td>{row.PreviousAllowanceAmount ? row.PreviousAllowanceAmount.toFixed(2) : ''}</td>
//                 <td>{row.NewAllowance}</td>
//                 <td>{row.NewAllowanceAmount ? row.NewAllowanceAmount.toFixed(2) : ''}</td>
//                 <td>{row.FinalAllowanceAmount ? row.FinalAllowanceAmount.toFixed(2) : ''}</td>
//                 <td>{row.Remarks}</td>
//                 <td>{row.ApprovedBy}</td>
//               </tr>
//             ))}

//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// };

// export default PerformanceManagement;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const PerformanceManagement = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [rows, setRows] = useState([]);
  const [FilteredRows, setFilteredRows] = useState([]);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const handleSearchChange = (event) => {
    const { id, value } = event.target;

    if (id === "employeeName") {
      setSearchQuery(value);
    } else if (id === "designation") {
      setSearchQuery1(value);
    } else if (id === "date") {
      setSearchQuery2(value);
    }
  };

  useEffect(() => {
    const location = userRecord.location;
    axios
      .get(`${urllink}HR_Management/get_employeeperformance?location=${location}`)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setRows(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userRecord, urllink]);

  useEffect(() => {
    const filteredData = rows.filter((row) => {
      const lowercaseEmployeeName = row.EmployeeName ? row.EmployeeName.toLowerCase() : "";
      const lowerCaseDesignation = row.Designation ? row.Designation.toString() : "";
      const lowercasedate = row.date ? row.date.toString() : "";
      const startsWithEmployeeName = lowercaseEmployeeName.startsWith(searchQuery.toLowerCase());
      const startsWithDesignation =
        searchQuery1 === "alldesignation" || lowerCaseDesignation.startsWith(searchQuery1.toLowerCase());
      const startsWithDate = lowercasedate.startsWith(searchQuery2);

      return (
        (startsWithEmployeeName || !searchQuery) &&
        (startsWithDesignation || !searchQuery1) &&
        (startsWithDate || !searchQuery2)
      );
    });

    setFilteredRows(filteredData);
  }, [searchQuery, searchQuery1, searchQuery2, rows]);

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Performance Management </h4>
      </div>

      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="employeeName">Employee Name <span>:</span></label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            placeholder="Enter Employee Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="inp_1">
          <label htmlFor="designation">Designation <span>:</span></label>
          <select
            name="designation"
            className="new-custom-input-phone vital_select"
            id="designation"
            value={searchQuery1}
            onChange={handleSearchChange}
          >
            <option value="alldesignation">Select</option>
            <option value="doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="frontoffice">Front Office</option>
          </select>
        </div>
      </div>
      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="date">Date <span>:</span></label>
          <input
            type="date"
            id="date"
            name="date"
            value={searchQuery2}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Designation</th>
              <th>Date</th>
              <th>Hike Type</th>
              <th>Allowance Name</th>
              <th>Previous Allowance</th>
              <th>Previous Allowance Amount</th>
              <th>New Allowance</th>
              <th>New Allowance Amount</th>
              <th>Final Allowance Amount</th>
              <th>Remarks</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody>
            {FilteredRows.map((row) => (
              <tr key={row.EmployeeID}>
                <td>{row.Sl_No}</td>
                <td>{row.EmployeeID}</td>
                <td>{row.EmployeeName}</td>
                <td>{row.Designation}</td>
                <td>{row.date}</td>
                <td>{row.HikeType}</td>
                <td>{row.AllowanceName}</td>
                <td>{row.PreviousAllowance}</td>
                <td>{row.PreviousAllowanceAmount ? row.PreviousAllowanceAmount.toFixed(2) : ""}</td>
                <td>{row.NewAllowance}</td>
                <td>{row.NewAllowanceAmount ? row.NewAllowanceAmount.toFixed(2) : ""}</td>
                <td>{row.FinalAllowanceAmount ? row.FinalAllowanceAmount.toFixed(2) : ""}</td>
                <td>{row.Remarks}</td>
                <td>{row.ApprovedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceManagement;
