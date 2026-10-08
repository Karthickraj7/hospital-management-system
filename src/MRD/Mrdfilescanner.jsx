// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import "./MRD.css";

// function Mrdscanner() {
//   const [patientData, setPatientData] = useState([]);
//   const [scannedBarcode, setScannedBarcode] = useState("");
//   const [departments, setDepartments] = useState([]);
//   const [getmrddetails, setgetmrddetails] = useState([]);
//   const [shouldRefreshData, setShouldRefreshData] = useState(false);
//   const [expandedPatientId, setExpandedPatientId] = useState(null); // For dropdown toggle
//   const [searchTerm, setSearchTerm] = useState(""); // New state for search
//   const [filteredData, setFilteredData] = useState([]); // New state for filtered data
//   const [currentpage, setcurrentpage] = useState(1);
//   const patientsperpage = 10;
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const UserData = useSelector((state) => state.userRecord?.UserData);

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const response = await axios.get(
//           `${UrlLink}Frontoffice/Register_Patients_Details`,
//           { params: { status: "" } }
//         );
//         const data = response.data;
//         const arrayData = Array.isArray(data) ? data : [];
//         setPatientData(arrayData);
//         setFilteredData(arrayData); // Initialize filtered data with all data
//       } catch (error) {
//         console.error("Error fetching patient data:", error);
//         setPatientData([]);
//         setFilteredData([]);
//       }
//     };
//     fetchPatients();
//   }, [UrlLink, shouldRefreshData]);

//   // Search functionality
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredData(patientData);
//       return;
//     }

//     const searchValue = searchTerm.toLowerCase().trim();
//     const filtered = patientData.filter((patient) => {
//       return (
//         patient.PatientId?.toString().toLowerCase().includes(searchValue) ||
//         patient.FirstName?.toLowerCase().includes(searchValue) ||
//         patient.current_location?.toLowerCase().includes(searchValue) ||
//         patient.status?.toLowerCase().includes(searchValue)
//       );
//     });
//     setFilteredData(filtered);
//   }, [searchTerm, patientData]);

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await axios.get(
//           `${UrlLink}Masters/Department_Detials_link`
//         );
//         const data = response.data;
//         setDepartments(Array.isArray(data) ? data.filter((dept) => dept.Status === "Active") : []);
//       } catch (error) {
//         console.error("Error fetching department details:", error);
//         setDepartments([]);
//       }
//     };
//     fetchDepartments();
//   }, [UrlLink]);

//   const fetchdata = async () => {
//     try {
//       const res = await axios.get(`${UrlLink}MRD/Mrd_Scanner`);
//       const mrdDetails = res.data;
//       setgetmrddetails(mrdDetails);

//       setPatientData((prevPatientData) =>
//         prevPatientData.map((patient) => {
//           const match = mrdDetails.find((detail) => detail.Patient_Id === patient.PatientId);
//           if (match) {
//             return {
//               ...patient,
//               current_location: match.Current_Location,
//               status: match.Status,
//               latest_history: match.latest_history,
//               full_history: match.full_history,
//             };
//           }
//           return {
//             ...patient,
//             current_location: patient.current_location || "MRD",
//             status: patient.status || "Checked In",
//             latest_history: null,
//             full_history: [],
//           };
//         })
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchdata();
//   }, []);

//   const currentDepartmentId = UserData?.Emp_DepartmentId?.[0] || "";
//   const currentDepartment = departments.find(
//     (dept) => dept.id === currentDepartmentId
//   )?.DepartmentName;

//   const handleBarcodeScan = async (event) => {
//     if (event.key === "Enter" && scannedBarcode) {
//       const patientId = scannedBarcode.trim();
//       const patient = patientData.find((p) => p.PatientId === patientId);

//       if (!patient) {
//         console.error("Patient not found");
//         alert("Patient not found");
//         return;
//       }

//       const newStatus =
//         patient.current_location === "MRD" && currentDepartment !== "MRD"
//           ? "Checked Out"
//           : "Checked In";

//       const finaldata = {
//         userid: UserData?.user_id,
//         PatientId: patient.PatientId,
//         History: patient.full_history || [], // Send full history
//         departments: currentDepartmentId,
//         newStatus: newStatus,
//       };

//       try {
//         const response = await axios.post(`${UrlLink}MRD/Mrd_Scanner`, finaldata);
//         if (response.status === 200) {
//           console.log("Patient data updated successfully:", response.data);
//           setShouldRefreshData((prev) => !prev);
//           setTimeout(() => {
//             fetchdata();
//           }, 300);
//         }
//       } catch (err) {
//         console.error("Error updating patient data:", err);
//         alert("Error updating patient data");
//       }

//       setScannedBarcode("");
//     }
//   };

//   const toggleHistoryDropdown = (patientId) => {
//     setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
//   };

//   return (
//     <div className="app-container">
//       <div className="content-wrapper">
//         <h1 className="main-header">MRD Patient File Tracking</h1>

//         <div className="unified-container">
//           <div className="scanner-row">
//             <label htmlFor="barcode-input">Scan Patient Barcode: </label>
//             <input
//               id="barcode-input"
//               type="text"
//               value={scannedBarcode}
//               onChange={(e) => setScannedBarcode(e.target.value)}
//               onKeyDown={handleBarcodeScan}
//               placeholder="Scan or type Patient ID"
//               className="barcode-input"
//             />
//             <button
//               className="submit-button"
//               onClick={() => handleBarcodeScan({ key: "Enter" })}
//             >
//               Submit
//             </button>

//             <span className="department-label">
//               Department: {currentDepartment}
//             </span>

//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search patients..."
//               className="search-input"
//             />
//           </div>

//           <h5 className="grid-title">Patient File Queue</h5>
//           <div className="patient-grid">
//             <div className="grid-header">
//               <div className="grid-cell header-cell">Patient ID</div>
//               <div className="grid-cell header-cell">First Name</div>
//               <div className="grid-cell header-cell">Current Location</div>
//               <div className="grid-cell header-cell">Status</div>
//               <div className="grid-cell header-cell">Latest History</div>
//             </div>
//             <div className="grid-body">
//               {filteredData.map((patient) => (
//                 <div key={patient.PatientId} className="grid-row">
//                   <div className="grid-cell">{patient.PatientId}</div>
//                   <div className="grid-cell">{patient.FirstName}</div>
//                   <div className="grid-cell">{patient.current_location}</div>
//                   <div className="grid-cell">
//                     <span
//                       className={`status-badge ${
//                         patient.status === "Checked In"
//                           ? "checked-in"
//                           : "checked-out"
//                       }`}
//                       onClick={() => {
//                         setScannedBarcode(patient.PatientId);
//                       }}
//                       style={{ cursor: "Pointer" }}
//                     >
//                       {patient.status}
//                     </span>
//                   </div>
//                   <div className="grid-cell">
//                     <div className="history-container">
//                       <span
//                         onClick={() => toggleHistoryDropdown(patient.PatientId)}
//                         style={{ cursor: "pointer", color: "#007bff" }}
//                       >
//                         {patient.latest_history
//                           ? `${patient.latest_history.departments} - ${patient.latest_history.timestamp}`
//                           : "No history"}
//                       </span>
//                       {expandedPatientId === patient.PatientId && patient.full_history && patient.full_history.length > 0 && (
//                         <div
//                           className="history-dropdown"
//                           style={{
//                             position: "absolute",
//                             backgroundColor: "white",
//                             border: "1px solid #ccc",
//                             borderRadius: "4px",
//                             padding: "5px",
//                             zIndex: 1000,
//                             maxHeight: "200px",
//                             overflowY: "auto",
//                           }}
//                         >
//                           {patient.full_history.map((entry, index) => (
//                             <div
//                               key={index}
//                               style={{
//                                 padding: "5px",
//                                 borderBottom: index < patient.full_history.length - 1 ? "1px solid #eee" : "none"
//                               }}
//                             >
//                               {entry.departments} - {entry.timestamp}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Mrdscanner;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./MRD.css";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Mrdscanner() {
  const [patientData, setPatientData] = useState([]);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [departments, setDepartments] = useState([]);
  const [getmrddetails, setgetmrddetails] = useState([]);
  const [shouldRefreshData, setShouldRefreshData] = useState(false);
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const patientsPerPage = 10; // Limit to 10 patients per page

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Frontoffice/Register_Patients_Details`,
          { params: { status: "" } }
        );
        const data = response.data;
        const arrayData = Array.isArray(data) ? data : [];
        setPatientData(arrayData);
        setFilteredData(arrayData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setPatientData([]);
        setFilteredData([]);
      }
    };
    fetchPatients();
  }, [UrlLink, shouldRefreshData]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(patientData);
      return;
    }

    const searchValue = searchTerm.toLowerCase().trim();
    const filtered = patientData.filter((patient) => {
      return (
        patient.PatientId?.toString().toLowerCase().includes(searchValue) ||
        patient.FirstName?.toLowerCase().includes(searchValue) ||
        patient.current_location?.toLowerCase().includes(searchValue) ||
        patient.status?.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, patientData]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Masters/Department_Detials_link`
        );
        const data = response.data;
        setDepartments(
          Array.isArray(data)
            ? data.filter((dept) => dept.Status === "Active")
            : []
        );
      } catch (error) {
        console.error("Error fetching department details:", error);
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, [UrlLink]);

  const fetchdata = async () => {
    try {
      const res = await axios.get(`${UrlLink}MRD/Mrd_Scanner`);
      const mrdDetails = res.data;
      setgetmrddetails(mrdDetails);

      setPatientData((prevPatientData) =>
        prevPatientData.map((patient) => {
          const match = mrdDetails.find(
            (detail) => detail.Patient_Id === patient.PatientId
          );
          if (match) {
            return {
              ...patient,
              current_location: match.Current_Location,
              status: match.Status,
              latest_history: match.latest_history,
              full_history: match.full_history,
            };
          }
          return {
            ...patient,
            current_location: patient.current_location || "MRD",
            status: patient.status || "Checked In",
            latest_history: null,
            full_history: [],
          };
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const currentDepartmentId = UserData?.Emp_DepartmentId?.[0] || "";
  const currentDepartment = departments.find(
    (dept) => dept.id === currentDepartmentId
  )?.DepartmentName;

  const handleBarcodeScan = async (event) => {
    if (event.key === "Enter" && scannedBarcode) {
      const patientId = scannedBarcode.trim();
      const patient = patientData.find((p) => p.PatientId === patientId);

      console.log(patient,'patient')

      if (!patient) {
        console.error("Patient not found");
        alert("Patient not found");
        return;
      }

      console.log(patient.Status,'Status')

      const newStatus = patient.status === "Checked In" ? "Checked Out" : "Checked In";
        // patient.current_location === "MRD" && currentDepartment !== "MRD"
        //   ? "Checked Out"
        //   : "Checked In";

      const finaldata = {
        userid: UserData?.user_id,
        PatientId: patient.PatientId,
        History: patient.full_history || [],
        departments: currentDepartmentId,
        newStatus: newStatus,
      };

      console.log(finaldata,'finaldataaaa')

      try {
        const response = await axios.post(
          `${UrlLink}MRD/Mrd_Scanner`,
          finaldata
        );
        if (response.status === 200) {
          console.log("Patient data updated successfully:", response.data);
          setShouldRefreshData((prev) => !prev);
          setTimeout(() => {
            fetchdata();
          }, 300);
        }
      } catch (err) {
        console.error("Error updating patient data:", err);
        alert("Error updating patient data");
      }

      setScannedBarcode("");
    }
  };

  const toggleHistoryDropdown = (patientId) => {
    setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
  };

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredData.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredData.length / patientsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="main-header">MRD Patient File Tracking</h1>

        <div className="unified-container">
          <div className="scanner-row">
            <label htmlFor="barcode-input">Scan Patient Barcode: </label>
            <input
              id="barcode-input"
              type="text"
              value={scannedBarcode}
              onChange={(e) => setScannedBarcode(e.target.value)}
              onKeyDown={handleBarcodeScan}
              placeholder="Scan or type Patient ID"
              className="barcode-input"
            />
            <button
              className="submit-button"
              onClick={() => handleBarcodeScan({ key: "Enter" })}
            >
              Submit
            </button>

            <span className="department-label">
              Department: {currentDepartment}
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients..."
              className="search-input"
            />
          </div>

          <h5 className="grid-title">Patient File Queue</h5>
          <div className="patient-grid">
            <div className="grid-header">
              <div className="grid-cell header-cell">Patient ID</div>
              <div className="grid-cell header-cell">First Name</div>
              <div className="grid-cell header-cell">Current Location</div>
              <div className="grid-cell header-cell">Status</div>
              <div className="grid-cell header-cell">Latest History</div>
            </div>
            <div className="grid-body">
              {currentPatients.map((patient) => (
                <div key={patient.PatientId} className="grid-row">
                  <div className="grid-cell">{patient.PatientId}</div>
                  <div className="grid-cell">{patient.FirstName}</div>
                  <div className="grid-cell">{patient.current_location}</div>
                  <div className="grid-cell">
                    <span
                      className={`status-badge ${
                        patient.status === "Checked In"
                          ? "checked-in"
                          : "checked-out"
                      }`}
                      onClick={() => {
                        setScannedBarcode(patient.PatientId);
                      }}
                      style={{ cursor: "Pointer" }}
                    >
                      {patient.status}
                    </span>
                  </div>
                  <div className="grid-cell">
                    <div className="history-container">
                      <span
                        onClick={() => toggleHistoryDropdown(patient.PatientId)}
                        style={{ cursor: "pointer", color: "#007bff" }}
                      >
                        {patient.latest_history
                          ? `${patient.latest_history.Status}-${patient.latest_history.departments} - ${patient.latest_history.timestamp}`
                          : "No history"}
                      </span>
                      {expandedPatientId === patient.PatientId &&
                        patient.full_history &&
                        patient.full_history.length > 0 && (
                          <div
                            className="history-dropdown"
                            style={{
                              position: "absolute",
                              backgroundColor: "white",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "5px",
                              zIndex: 1000,
                              maxHeight: "200px",
                              overflowY: "auto",
                            }}
                          >
                            {patient.full_history.map((entry, index) => (
                              <div
                                key={index}
                                style={{
                                  padding: "5px",
                                  borderBottom:
                                    index < patient.full_history.length - 1
                                      ? "1px solid #eee"
                                      : "none",
                                }}
                              >
                                {entry.Status} - {entry.departments} - {entry.timestamp}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div
            className="pagination"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{
                margin: "0 10px",
                padding: "5px 15px",
                borderRadius: "50%",
                border: "1px solid #ccc",
                backgroundColor: currentPage === 1 ? "#ddd" : "#fff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowBackIosNewIcon />
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{
                margin: "0 10px",
                padding: "5px 15px",
                borderRadius: "50%",
                border: "1px solid #ccc",
                backgroundColor: currentPage === totalPages ? "#ddd" : "#fff",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
             <ArrowForwardIosIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mrdscanner;
