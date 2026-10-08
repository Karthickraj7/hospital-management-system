// import { useEffect, useState } from "react";
// import axios from "axios";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
// import { useSelector } from "react-redux";

// const IP_Doctor_Payout = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [selectedType, setSelectedType] = useState("all");
//   const [selectedService, setSelectedService] = useState("all");
//   const [doctorPayoutData, setDoctorPayoutData] = useState([]);

//   const columns = [
//     { key: 'id', name: 'S.No', frozen: true },
//     { key: 'Doctor_ID', name: 'Doctor Id', frozen: true },
//     { key: 'Doctor_Name', name: 'Doctor Name', frozen: true },
//     { key: 'Service_Type', name: 'Service Type', frozen: true },
//     { key: 'Total_Transactions', name: 'Transactions', frozen: true },
//     { key: 'Total_Amount', name: 'Total Amount', frozen: true },
//     { key: 'Contribution_Percentage', name: 'Contribution %', frozen: true },
//     { key: 'Doctor_Earning', name: 'Doctor Earning', frozen: true },
//   ];

//   const fetchDoctorPayout = async () => {
//     try {
//       const res = await axios.get(`${UrlLink}DoctorPayOut/get_ip_doctor_service_type_summary`);
//       const processed = res.data.data.map((item, index) => ({
//         id: index + 1,
//         ...item
//       }));
//       setDoctorPayoutData(processed);
//     } catch (error) {
//       console.error("Failed to fetch doctor payout summary", error);
//     }
//   };

//   useEffect(() => {
//     if (UrlLink) {
//       fetchDoctorPayout();
//     }
//   }, [UrlLink]);

//   // 🔍 Apply filters: doctor_Type and service_type
//   const filteredData = doctorPayoutData.filter((item) => {
//     const typeMatch = selectedType === "all" || item.doctor_Type?.toLowerCase() === selectedType;
//     const serviceMatch = selectedService === "all" || item.Service_Type?.toUpperCase() === selectedService;
//     return typeMatch && serviceMatch;
//   });

//   return (
//     <div className="Main_container_app">
//       <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
//         {/* Doctor Type Radio */}
//         {["inhouse", "referral", "visiting", "all"].map((type) => (
//           <label key={type} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//             <input
//               type="radio"
//               value={type}
//               checked={selectedType === type}
//               onChange={(e) => setSelectedType(e.target.value)}
//             />
//             {type.charAt(0).toUpperCase() + type.slice(1)}
//           </label>
//         ))}

//         {/* Service Type Dropdown */}
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <label>Service Type:</label>
//           <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
//             <option value="all">All</option>
//             <option value="LAB">LAB</option>
//             <option value="RADIOLOGY">RADIOLOGY</option>
//             <option value="CONSULTATION">CONSULTATION</option>
//             <option value="ICU">ICU</option>
//             <option value="OT">OT</option>
//             <option value="ROOM CHARGES">ROOM CHARGES</option>
//             {/* Add more service types if needed */}
//           </select>
//         </div>
//       </div>

//       <ReactGrid columns={columns} RowData={filteredData} />
//     </div>
//   );
// };

// export default IP_Doctor_Payout;
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import { useSelector } from "react-redux";

const IP_Doctor_Payout = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [doctorPayoutData, setDoctorPayoutData] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const columns = [
    { key: 'id', name: 'S.No', frozen: true },
    { key: 'Doctor_ID', name: 'Doctor Id', frozen: true },
    { key: 'Doctor_Name', name: 'Doctor Name', frozen: true },
    { key: 'Service_Type', name: 'Service Type', frozen: true },
    { key: 'Total_Transactions', name: 'Transactions', frozen: true },
    { key: 'Total_Amount', name: 'Total Amount', frozen: true },
    { key: 'Contribution_Percentage', name: 'Contribution %', frozen: true },
    { key: 'Doctor_Earning', name: 'Doctor Earning', frozen: true },
  ];

  const fetchDoctorPayout = async () => {
    try {
      const res = await axios.get(`${UrlLink}DoctorPayOut/get_ip_doctor_service_type_summary`);
      const processed = res.data.data.map((item, index) => ({
        id: index + 1,
        ...item
      }));
      setDoctorPayoutData(processed);
    } catch (error) {
      console.error("Failed to fetch doctor payout summary", error);
    }
  };

  useEffect(() => {
    if (UrlLink) {
      fetchDoctorPayout();
    }
  }, [UrlLink]);

  const filteredData = doctorPayoutData.filter((item) => {
    const typeMatch = selectedType === "all" || item.doctor_Type?.toLowerCase() === selectedType;
    const serviceMatch = selectedService === "all" || item.Service_Type?.toUpperCase() === selectedService;
    return typeMatch && serviceMatch;
  });

  const contributionSummary = useMemo(() => {
    const summary = {};
    filteredData.forEach((item) => {
      const doctorId = item.Doctor_ID;
      if (!summary[doctorId]) {
        summary[doctorId] = {
          Doctor_ID: doctorId,
          Doctor_Name: item.Doctor_Name,
          Total_Contribution: 0,
        };
      }
      summary[doctorId].Total_Contribution += Number(item.Doctor_Earning || 0);
    });
    return Object.values(summary);
  }, [filteredData]);

  return (
    <div className="Main_container_app">
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
        {/* Doctor Type Radio */}
        {["inhouse", "referral", "visiting", "all"].map((type) => (
          <label key={type} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="radio"
              value={type}
              checked={selectedType === type}
              onChange={(e) => setSelectedType(e.target.value)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}

        {/* Service Type Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Service Type:</label>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            <option value="all">All</option>
            <option value="LAB">LAB</option>
            <option value="RADIOLOGY">RADIOLOGY</option>
            <option value="CONSULTATION">CONSULTATION</option>
            <option value="ICU">ICU</option>
            <option value="OT">OT</option>
            <option value="ROOM CHARGES">ROOM CHARGES</option>
          </select>
        </div>

        {/* Show Summary Button */}
        <button style={{padding:'10px', borderRadius:'12px'}} onClick={() => setShowSummary(!showSummary)}>
          {showSummary ? "Hide" : "Show"} Contribution Summary
        </button>
      </div>

      <ReactGrid columns={columns} RowData={filteredData} />

      {showSummary && (
        <div style={{ marginTop: "20px" }}>
          <h3>Doctor Contribution Summary</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
                <th>Total Contribution (₹)</th>
              </tr>
            </thead>
            <tbody>
              {contributionSummary.map((doctor) => (
                <tr key={doctor.Doctor_ID}>
                  <td>{doctor.Doctor_ID}</td>
                  <td>{doctor.Doctor_Name}</td>
                  <td>{doctor.Total_Contribution.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IP_Doctor_Payout;
