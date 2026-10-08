// import { useEffect, useState } from "react";
// import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const OP_Doctor_PayOut = () => {
//   const [selectedType, setSelectedType] = useState("inhouse");
//   const [selectedService, setSelectedService] = useState("Consultation"); // 👈 to switch between Consultation / Radiology
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

//   const [consultationData, setConsultationData] = useState([]);
//   const [radiologyData, setRadiologyData] = useState([]);
//   const [LabData, setLabData] = useState([]);

//   const columns = [
//     { key: 'id', name: 'S.No', frozen: true },
//     { key: 'doctor_Type', name: 'Type', frozen: true },
//     { key: 'Doctor_id', name: 'Doctor Id', frozen: true },
//     { key: 'Doctor_name', name: 'Doctor Name', frozen: true },
//     { key: 'service', name: 'Service', frozen: true },
//     { key: 'Total_transactions', name: 'Transactions', frozen: true },
//     { key: 'Total_profit', name: 'Total Profit', frozen: true },
//   ];

//   const fetchConsultationData = async () => {
//     try {
//       const res = await axios.get(`${UrlLink}DoctorPayOut/Get_doctor_payout_details_consultaion`);
//       const processed = res.data.data.map((item, index) => ({ id: index + 1, ...item }));
//       setConsultationData(processed);
//     } catch (error) {
//       console.error("Error fetching consultation data", error);
//     }
//   };

//   const fetchRadiologyData = async () => {
//     try {
//       const res = await axios.get(`${UrlLink}DoctorPayOut/Get_doctor_payout_details_Radiology`);
//       const processed = res.data.data.map((item, index) => ({ id: index + 1, ...item }));
//       setRadiologyData(processed);
//     } catch (error) {
//       console.error("Error fetching radiology data", error);
//     }
//   };

//   const fetchLabData = async () => {
//     try {
//       const res = await axios.get(`${UrlLink}DoctorPayOut/Get_doctor_payout_details_Lab`);
//       const processed = res.data.data.map((item, index) => ({ id: index + 1, ...item }));
//       setLabData(processed);
//     } catch (error) {
//       console.error("Error fetching radiology data", error);
//     }
//   };

//   useEffect(() => {
//     if (UrlLink) {
//       fetchConsultationData();
//       fetchRadiologyData();
//       fetchLabData();
//     }
//   }, [UrlLink]);

//   // 🔁 Choose correct dataset based on selected service
//   const currentData =
//   selectedService === "Consultation"
//     ? consultationData
//     : selectedService === "Radiology"
//     ? radiologyData
//     : selectedService == "Lab"? 
//     LabData:[...consultationData,...radiologyData,...LabData];


//   // 🔍 Filter by doctor type (inhouse/referral/visiting)
//  const filteredData = currentData.filter(
//   item => item.doctor_Type?.toLowerCase() === selectedType
// );


//   return (
//     <div className="Main_container_app">
//       <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
//         <label >Services  <span>:</span></label>
//         <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
//           <option value="All">All</option>
//           <option value="Consultation">Consultation</option>
//           <option value="Radiology">Radiology</option>
//           <option value="Lab">Lab</option>
//         </select>

//         {["inhouse", "referral", "visiting","Total_amount_Per_Doctor"].map(type => (
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
//       </div>
// <br />
// <br />


//       <ReactGrid columns={columns} RowData={filteredData} />
//     </div>
//   );
// };

// export default OP_Doctor_PayOut;
import { useEffect, useState } from "react";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import axios from "axios";
import { useSelector } from "react-redux";

const OP_Doctor_PayOut = () => {
  const [selectedType, setSelectedType] = useState("inhouse");
  const [selectedService, setSelectedService] = useState("Consultation"); // Consultation / Radiology / Lab / All
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [consultationData, setConsultationData] = useState([]);
  const [radiologyData, setRadiologyData] = useState([]);
  const [LabData, setLabData] = useState([]);

  const columns = [
    { key: "id", name: "S.No", frozen: true },
    { key: "doctor_Type", name: "Type", frozen: true },
    { key: "Doctor_id", name: "Doctor Id", frozen: true },
    { key: "Doctor_name", name: "Doctor Name", frozen: true },
    { key: "service", name: "Service", frozen: true },
    { key: "Total_transactions", name: "Transactions", frozen: true },
    { key: "Total_profit", name: "Total Profit", frozen: true },
  ];

  const fetchConsultationData = async () => {
    try {
      const res = await axios.get(
        `${UrlLink}DoctorPayOut/Get_doctor_payout_details_consultaion`
      );
      const processed = res.data.data.map((item, index) => ({
        id: index + 1,
        ...item,
        service: "Consultation",
      }));
      setConsultationData(processed);
    } catch (error) {
      console.error("Error fetching consultation data", error);
    }
  };

  const fetchRadiologyData = async () => {
    try {
      const res = await axios.get(
        `${UrlLink}DoctorPayOut/Get_doctor_payout_details_Radiology`
      );
      const processed = res.data.data.map((item, index) => ({
        id: index + 1,
        ...item,
        service: "Radiology",
      }));
      setRadiologyData(processed);
    } catch (error) {
      console.error("Error fetching radiology data", error);
    }
  };

  const fetchLabData = async () => {
    try {
      const res = await axios.get(
        `${UrlLink}DoctorPayOut/Get_doctor_payout_details_Lab`
      );
      const processed = res.data.data.map((item, index) => ({
        id: index + 1,
        ...item,
        service: "Lab",
      }));
      setLabData(processed);
    } catch (error) {
      console.error("Error fetching lab data", error);
    }
  };

  useEffect(() => {
    if (UrlLink) {
      fetchConsultationData();
      fetchRadiologyData();
      fetchLabData();
    }
  }, [UrlLink]);

  const combineTotalProfitByDoctor = () => {
    const allData = [...consultationData, ...radiologyData, ...LabData];
    const doctorMap = {};

    allData.forEach((item) => {
      const key = `${item.Doctor_id}_${item.doctor_Type}`;
      if (!doctorMap[key]) {
        doctorMap[key] = {
          Doctor_id: item.Doctor_id,
          doctor_Type: item.doctor_Type,
          Doctor_name: item.Doctor_name,
          Total_profit: parseFloat(item.Total_profit) || 0,
          Total_transactions: parseInt(item.Total_transactions) || 0,
          service: "Total (All)",
        };
      } else {
        doctorMap[key].Total_profit += parseFloat(item.Total_profit) || 0;
        doctorMap[key].Total_transactions += parseInt(item.Total_transactions) || 0;
      }
    });

    return Object.values(doctorMap).map((item, index) => ({
      id: index + 1,
      ...item,
    }));
  };

  // Select data based on service type
  let currentData = [];
  if (selectedService === "Consultation") {
    currentData = consultationData;
  } else if (selectedService === "Radiology") {
    currentData = radiologyData;
  } else if (selectedService === "Lab") {
    currentData = LabData;
  } else {
    currentData = [...consultationData, ...radiologyData, ...LabData];
  }

  // Apply filter based on doctor type
  let filteredData = [];
  if (selectedType === "Total_amount_Per_Doctor") {
    filteredData = combineTotalProfitByDoctor();
  } else {
    filteredData = currentData.filter(
      (item) => item.doctor_Type?.toLowerCase() === selectedType
    );
  }

  return (
    <div className="Main_container_app">
      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <label>Services <span>:</span></label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Consultation">Consultation</option>
          <option value="Radiology">Radiology</option>
          <option value="Lab">Lab</option>
        </select>

        {["inhouse", "referral", "visiting", "Total_amount_Per_Doctor"].map(
          (type) => (
            <label
              key={type}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <input
                type="radio"
                value={type}
                checked={selectedType === type}
                onChange={(e) => setSelectedType(e.target.value)}
              />
              {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
            </label>
          )
        )}
      </div>

      <br />
      <br />

      <ReactGrid columns={columns} RowData={filteredData} />
    </div>
  );
};

export default OP_Doctor_PayOut;
