// import React, { useRef } from "react";
// import Barcode from "react-barcode";
// import ReactToPrint from "react-to-print";
// import './Radbarcode.css';

// const generateSampleData = (count, data, PatientDetails) => {

//     console.log(data,'data32432');
//     console.log(PatientDetails,'PatientDetails123');

//     const calculateRenewDate = (created_at) => {
//     console.log(created_at, 'created_at');

//     if (!created_at) return "Invalid Date";

//     let baseDate;

//     // Case 1: Format is 'DD-MM-YY'
//     if (/^\d{2}-\d{2}-\d{2}$/.test(created_at)) {
//       const [day, month, year] = created_at.split("-");
//       const formattedDate = `20${year}-${month}-${day}`; // Convert to ISO-like
//       baseDate = new Date(formattedDate);
//     } 
//     // Case 2: Format is ISO string
//     else if (!isNaN(Date.parse(created_at))) {
//       baseDate = new Date(created_at);
//     } 
//     // Fallback
//     else {
//       console.error("Unrecognized date format:", created_at);
//       return "Invalid Date";
//     }

//     if (isNaN(baseDate)) {
//       console.error("Invalid Date 'baseDate'");
//       return "Invalid Date";
//     }

//     const renewDate = new Date(baseDate);
//     renewDate.setDate(baseDate.getDate() + 5);

//     const formatted = `${String(renewDate.getDate()).padStart(2, "0")}.${String(renewDate.getMonth() + 1).padStart(2, "0")}.${renewDate.getFullYear()}`;
    
//     console.log(baseDate, 'baseDate');
//     console.log(renewDate, 'renewDate');
//     console.log(formatted, 'barcodeeeeeeee');

//     return formatted;
//   };


//   const formatAddress = (data) => {
//     const parts = `${[
//       data.DoorNo,
//       data.Street,
//       data.Area,
//       data.City,
//       data.District,
//       data.State,
//       // data.Country,
//     ].filter(Boolean).join(", ")}${data.Pincode ? ` - ${data.Pincode}` : ''}`;
  
//     return parts;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Invalid Date";

//     let date;

//     // Case 1: Format is 'DD-MM-YY'
//     if (/^\d{2}-\d{2}-\d{2}$/.test(dateString)) {
//       const [day, month, year] = dateString.split("-");
//       const formatted = `20${year}-${month}-${day}`; // Convert to ISO-like
//       date = new Date(formatted);
//     } 
//     // Case 2: ISO string or valid full date
//     else if (!isNaN(Date.parse(dateString))) {
//       date = new Date(dateString);
//     } 
//     // Fallback
//     else {
//       console.error("Unrecognized date format:", dateString);
//       return "Invalid Date";
//     }

//     if (isNaN(date)) {
//       console.error("Invalid Date:", dateString);
//       return "Invalid Date";
//     }

//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();

//     return `${day}-${month}-${year}`;
//   };


//   const baseData = {
//     opNo: data.registeridbarcode,
//     date: formatDate(data.createdat),
//     name: data.PatientName,
//     FatherName: data.fathername,
//     SpouseName: data.SpouseName,
//     age: data.Age,
//     gender: data.Gender,
//     address: formatAddress(data),
//     phone: data.PhoneNo,
//     renewDate: calculateRenewDate(data.createdat),
//     barcode: data.PatientId,
//     PatientId: data.PatientId,
//   };
  
//   console.log(baseData,'777777777878');

//   const result = [];


//   result.push({ ...baseData, department: "RADIOLOGY" });

//   console.log(result,'result11111');


//   return result;
// };


// const printBarcodeStyles = `
// @page {
//   size: 8cm 4cm !important;
//   margin: 0 !important;
//   padding: 0 !important;
// }

// @media print {
//  .print-container-barHash  {
//     width: 8cm;
//     height: 4cm;
//     margin: 0;
//     padding: 0;
//   }

//   .barcode-label-barHash {
//     width: 8cm !important;
//     height: 4cm !important;
//     page-break-after: always !important;
//     page-break-inside: avoid !important;
//     break-inside: avoid !important;
//     display: block !important;
//     overflow: visible !important;
//     margin: 0 !important;
//     padding: 5px !important;
//     background-color: transparent !important;
//   }
  
//   .barcode-label-barHash:last-child {
//     page-break-after: auto !important;
//   }
// }
// `;
// const OPBarcode = ({ rowData, PatientDetails }) => {

//   console.log(rowData,'rowData---------');
//   console.log(PatientDetails,'PatientDetails------------');

//   const componentRef = useRef();
//   const sampleData = generateSampleData(1, rowData, PatientDetails);
  
//   console.log("Barcodes to print:", sampleData);

//   return (
//     <div>
//       <div ref={componentRef} className="print-container-barHash ">
//         {sampleData.map((data, index) => (
//           <div
//             key={index}
//             className="barcode-label-barHash"
//             style={{
//               backgroundColor: "#e6f0f5",
//               width: "8cm",
//               height: "4cm",
//               padding: "5px",
//               borderRadius: "8px",
//               fontFamily: "Arial, sans-serif",
//               marginBottom: "10px", // Adds spacing in preview (won't affect print)
//             }}
//           >
//             <div style={{ display: "flex", width: "100%" }}>
//               {/* Left Column */}
//               <div style={{ flex: "1", textAlign: "left" }}>
//                 <p
//                   style={{
//                     margin: "1px 0",
//                     fontSize: "10px",
//                     fontWeight: "normal",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "5px",
//                     marginRight: "5px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "40px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     OP NO <span>:</span>
//                   </span>
//                   <span style={{ fontWeight: "bold", width: "120px" }}>{data.opNo}</span>
//                 </p>
//                 <p
//                   style={{
//                     margin: "1px 0",
//                     fontSize: "10px",
//                     fontWeight: "normal",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "5px",
//                     marginRight: "5px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "40px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     NAME <span>:</span>
//                   </span>
//                   <span style={{ fontWeight: "bold", width: "120px" }}>{data.name}</span>
//                 </p>

//                 {(data.FatherName || data.SpouseName) && (
//                   <p
//                     style={{
//                       margin: "1px 0",
//                       fontSize: "10px",
//                       fontWeight: "normal",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "5px",
//                       marginRight: "5px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         width: "40px",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {data.FatherName ? "Father" : "Spouse"} <span>:</span>
//                     </span>
//                     <span style={{ fontWeight: "bold", width: "120px" }}>
//                       {data.FatherName || data.SpouseName || ""}
//                     </span>
//                   </p>
//                 )}

//               {/* {data.department && (
//               <div style={{ display: "flex", width: "100%", marginTop: "1px" }}>
//                 <div style={{ flex: "1", textAlign: "left" }}>
//                   <p
//                     style={{
//                       margin: "1px 0",
//                       fontSize: "10px",
//                       fontWeight: "normal",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "5px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         width: "40px",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       DEPT<span>:</span>
//                     </span>
//                     <span style={{ fontWeight: "bold", width: "120px" }}>{data.department}</span>
//                   </p>
//                 </div>
//               </div>
//             )} */}

              
//               </div>

//               {/* Right Column */}
//               <div style={{ flex: "1", textAlign: "left" }}>
//                 {/* <p
//                   style={{
//                     margin: "1px 0",
//                     fontSize: "10px",
//                     fontWeight: "normal",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "5px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "60px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Renew Dt<span>:</span>
//                   </span>
//                   {data.renewDate}
//                 </p> */}
//                 <p
//                   style={{
//                     margin: "1px 0",
//                     fontSize: "10px",
//                     fontWeight: "normal",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "5px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "40px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     PH <span>:</span>
//                   </span>
//                   {data.phone}
//                 </p>

//                 <p
//                   style={{
//                     margin: "1px 0",
//                     fontSize: "10px",
//                     fontWeight: "normal",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "5px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "40px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Date<span>:</span>
//                   </span>
//                   {data.date}
//                 </p>
//                 <p
//                   style={{
//                     margin: "1px 0",
//                     fontSize: "10px",
//                     fontWeight: "normal",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "5px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "40px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     AGE <span>:</span>
//                   </span>
//                   {data.age} {data.gender}
//                 </p>
//               </div>
//             </div>

//             {/* Department (conditionally rendered) */}
         
// <p
//                   style={{
//                     margin: "1px 0",
//                     marginBottom:'3px',
//                     fontSize: "10px",
//                     fontWeight: "normal",
//                     display: "flex",
//                     alignItems: "flex-start",
//                     gap: "5px",
//                     marginRight: "5px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "47px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     ADD<span>:</span>
//                   </span>
//                   <span style={{  width: "100%" ,textAlign:'start',fontSize:'9.4px'}}>{data.address}</span>
//                 </p>


//             <div style={{ textAlign: "center" }}>
//               <Barcode
//                 value={data.barcode || "NOVALUE"}
//                 lineColor="Black"
//                 height={30}
//                 width={1}
//                 fontSize={10}
//                 displayValue={false}
//                 margin={0}
//               />
//               <p style={{ fontSize: "10px", margin: "1px 0 0 0" }}>
//                 Patient ID: {data.PatientId}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <ReactToPrint
//         trigger={() => (
//           <div style={{ textAlign: "center", marginTop: "15px" }}>
//             <button
//               style={{
//                 padding: "8px 20px",
//                 backgroundColor: "#3498db",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               Print
//             </button>
//           </div>
//         )}
//         content={() => componentRef.current}
//         pageStyle={printBarcodeStyles}
//       />
//     </div>
//   );
// };

// export default OPBarcode



import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaQrcode } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import QRCode from "react-qr-code";
import axios from "axios"; // Also add axios since you're using it
import ReactToPrint from "react-to-print"; // Add this import if not already imported

const generateSampleData = (count, data, PatientDetails, fromPatientList = false, DoctorRoomData) => {
   
  console.log(PatientDetails,'PatientDetailssfthfytf')
  
  const calculateRenewDate = (created_at) => {
    console.log(created_at, 'created_at');
    if (!created_at) return "Invalid Date";

    let baseDate;
    // Case 1: Format is 'DD-MM-YY'
    if (/^\d{2}-\d{2}-\d{2}$/.test(created_at)) {
      const [day, month, year] = created_at.split("-");
      const formattedDate = `20${year}-${month}-${day}`; // Convert to ISO-like
      baseDate = new Date(formattedDate);
    } 
    // Case 2: Format is ISO string
    else if (!isNaN(Date.parse(created_at))) {
      baseDate = new Date(created_at);
    } 
    // Fallback with safe parsing
    else {
      try {
        baseDate = new Date(created_at.replace(/-/g, '/')); // Polyfill for older date formats
      } catch (e) {
        console.error("Unrecognized date format:", created_at);
        return "Invalid Date";
      }
    }

    if (isNaN(baseDate.getTime())) {
      console.error("Invalid Date 'baseDate'");
      return "Invalid Date";
    }

    const renewDate = new Date(baseDate);
    renewDate.setDate(baseDate.getDate() + 9);

    const formatted = `${String(renewDate.getDate()).padStart(2, "0")}.${String(renewDate.getMonth() + 1).padStart(2, "0")}.${renewDate.getFullYear()}`;
    
    console.log(baseDate, 'baseDate');
    console.log(renewDate, 'renewDate');
    console.log(formatted, 'barcodeeeeeeee');

    return formatted;
  };

  const formatAddress = (data) => {
    const parts = [
      data && data.DoorNo || '',
      data && data.Street || '',
      data && data.Area || '',
      data && data.City || '',
      data && data.District || '',
      data && data.State || '',
    ].filter(Boolean).join(", ") + (data && data.Pincode ? ` - ${data.Pincode}` : '');
    return parts;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";

    let date;
    // Case 1: Format is 'DD-MM-YY'
    if (/^\d{2}-\d{2}-\d{2}$/.test(dateString)) {
      const [day, month, year] = dateString.split("-");
      const formatted = `20${year}-${month}-${day}`; // Convert to ISO-like
      date = new Date(formatted);
    } 
    // Case 2: ISO string or valid full date
    else if (!isNaN(Date.parse(dateString))) {
      date = new Date(dateString);
    } 
    // Fallback with safe parsing
    else {
      try {
        date = new Date(dateString.replace(/-/g, '/')); // Polyfill for older date formats
      } catch (e) {
        console.error("Unrecognized date format:", dateString);
        return "Invalid Date";
      }
    }

    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", dateString);
      return "Invalid Date";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (dateString) => {
  if (!dateString) return "Invalid Date";

  let date;
  // Case 1: Format is 'DD-MM-YY'
  if (/^\d{2}-\d{2}-\d{2}$/.test(dateString)) {
    const [day, month, year] = dateString.split("-");
    const formatted = `20${year}-${month}-${day}`; // Convert to ISO-like
    date = new Date(formatted);
  } 
  // Case 2: ISO string or valid full date
  else if (!isNaN(Date.parse(dateString))) {
    date = new Date(dateString);
  } 
  // Fallback with safe parsing
  else {
    try {
      date = new Date(dateString.replace(/-/g, '/')); // Polyfill for older date formats
    } catch (e) {
      console.error("Unrecognized date format:", dateString);
      return "Invalid Date";
    }
  }

  if (isNaN(date.getTime())) {
    console.error("Invalid Date:", dateString);
    return "Invalid Date";
  }

  // Format date part
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  console.log(date,'dateeeeeeeeeee',dateString,'dateString')

  // Format time part
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  return `${formattedTime}`;
};


  const baseData = {
    opNo: data.registeridbarcode,
    date: data.created_at,
    // Time : formatDateTime(data.created_time),
    name: data.PatientName,
    FatherName: data.fathername,
    SpouseName: data.SpouseName,
    age: data.Age,
    gender: data.Gender,
    address: formatAddress(data),
    phone: data.PhoneNo,
    barcode: data.PatientId,
    PatientId: data.PatientId,
  };

  console.log(baseData,'baseData')

  const result = [];

  // if (fromPatientList) {
  //   // ONLY show the first general barcode if from Patientlist.jsx
  //   result.push({
  //     ...baseData,
  //     opNo: "",
  //     renewDate: "",
  //     department: "",
  //     doctorname: "",
  //     renewDate : "",
  //     ValidityDate : "",
  //   });
  //   return result;
  // }

  if (baseData && Object.keys(baseData).length > 0) {
    result.push({ ...baseData, department: "", doctorname: "", opNo: "", renewDate: "",ValidityDate : "" });
  }

  // // Find a doctor in DoctorRoomData that matches any DoctorId in Multiple_Doc
  // const doctorRoomMatch = (data && data.Multiple_Doc || []).find(doc =>
  //   DoctorRoomData.some(room => room.DoctorID === doc.DoctorId)
  // );

  // const uniqueDepartments = [
  //   ...new Map((data && data.Multiple_Doc || []).map(doc => [doc.Specilization, doc])).values()
  // ];

  // if (uniqueDepartments.length >= 1) {
  //   uniqueDepartments.forEach((doc) => {
  //     const matchedRoom = DoctorRoomData.find(room => room.DoctorID === doc.DoctorId);
  //     result.push({ ...baseData, department: doc.Specilization, doctorname: doc.DoctorName,renewDate : doc.RenewDate,ValidityDate : doc.ValidityDate, doctorRoom: matchedRoom && matchedRoom.countername || "" });
  //   });
  // }

  // const matchedRoom = DoctorRoomData.find(room => room.DoctorID === data.DoctorId);
  // if (data.CasualitySpecilization && data.CasualityDoctorName) {
  //   result.push({ ...baseData, department: data.CasualitySpecilization, doctorname: data.CasualityDoctorName, doctorRoom: matchedRoom && matchedRoom.countername || "" });
  // }

  return result;
};

// Adjusted print styles for Windows 7/Chrome 109 compatibility
const printBarcodeStyles = `
@page {
  size: 80mm 40mm !important; /* Use mm for precision in older browsers */
  margin: 0 !important;
  padding: 0 !important;
}

@media print {
  .print-container-barHash {
    width: 80mm !important;
    height: 40mm !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .barcode-label-barHash {
    width: 80mm !important;
    height: 40mm !important;
    page-break-after: always !important;
    page-break-inside: avoid !important;
    display: block !important;
    overflow: hidden !important; /* Prevent overflow issues in older Chrome */
    margin: 0 !important;
    padding: 5px !important;
    background-color: transparent !important;
    box-sizing: border-box !important;
  }

  .barcode-label-barHash:last-child {
    page-break-after: avoid !important; /* Avoid extra blank pages */
  }
}
`;


const OPBarcode = ({ rowData, PatientDetails, fromPatientList }) => {
  console.log(rowData, "rowData---------");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [DoctorRoomData, setDoctorRoomData] = useState([]);
  const componentRef = useRef();
  const sampleData = generateSampleData(
    1,
    rowData,
    PatientDetails,
    fromPatientList,
    DoctorRoomData
  );

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  console.log("Barcodes to print:", sampleData);
  console.log("DoctorRoomData", DoctorRoomData);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Doctor_Room_Mapping_Details`)
      .then((res) => {
        const ress = res.data;
        setDoctorRoomData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  return (
    <div>
      <div ref={componentRef} className="print-container-barHash">
        {sampleData.map((data, index) => (
          <div
            key={index}
            className="barcode-label-barHash"
            style={{
              backgroundColor: "rgb(230, 240, 245)",
              width: "80mm",
              height: "40mm",
              padding: "5px",
              borderRadius: "8px",
              fontFamily: "Arial, sans-serif",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ 
              display: "flex", 
              width: "100%", 
              paddingLeft: "8px" // Move entire content slightly right
            }}>
              {/* Left Column - Patient Details */}
              <div style={{ 
                width: "61%", // Slightly reduced width
                paddingRight: "5px" // Add some padding to move content right
              }}>
                {/* Patient ID with dash after 6 digits and bigger last numbers */}
                <p style={{
                  margin: "1px 5px 0px 1px",
                  fontSize: "10px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}>
                  <span style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "40px",
                    fontWeight: "bolder",
                  }}>
                    P.ID<span>:</span>
                  </span>
                  <span
  style={{
    fontWeight: "bolder",
    width: "70px",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "2px",
  }}
>
  {(() => {
    const pid = data.PatientId || "";
    let prefix = "";
    let highlight = "";

    console.log('before pid outside',pid)

    if (pid.includes("-")) {
      // --- New Format: YY-Continuation ---
      const [year, cont] = pid.split("-");
      prefix = year + "-";
      highlight = cont; // continuation part
    } else{
      // --- Old Format: YYMMDD + Continuation ---

      console.log('before pid',pid)
      prefix = pid.slice(0, 6) + '-'; 
      console.log(prefix,'prefix before')
      highlight = pid.slice(6); 
      console.log(highlight,'highlight before')
    }
    // else {
    //   // fallback (if unknown format)
    //   highlight = pid;
    // }

    return (
      <>
        <span
          style={{
            fontWeight: "bolder",
            fontSize: "12px",
          }}
        >
          {prefix}
        </span>
        <span
          style={{
            fontWeight: "900",
            fontSize: "13px",
            color: "#000",
          }}
        >
          {highlight}
        </span>
      </>
    );
  })()}
</span>

                </p>

                {/* Name with increased size */}
                <p style={{
                  margin: "1px 5px 0px 1px",
                  fontSize: "11px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}>
                  <span style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "40px",
                    fontWeight: "bolder",
                  }}>
                    NAME<span>:</span>
                  </span>
                  <span style={{
                    fontWeight: "bolder",
                    width: "120px",
                    textAlign: "left",
                  }}>
                    {data.name}
                  </span>
                </p>

                {data.FatherName && (
                  <p style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}>
                    <span style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bolder",
                    }}>
                      Father<span>:</span>
                    </span>
                    <span style={{
                      fontWeight: "bolder",
                      width: "120px",
                      textAlign: "left",
                    }}>
                      {data.FatherName}
                    </span>
                  </p>
                )}

                {data.SpouseName && (
                  <p style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}>
                    <span style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bolder",
                    }}>
                      Spouse<span>:</span>
                    </span>
                    <span style={{
                      fontWeight: "bolder",
                      width: "120px",
                      textAlign: "left",
                    }}>
                      {data.SpouseName}
                    </span>
                  </p>
                )}

                {/* Age */}
                <p style={{
                  margin: "1px 5px 0px 1px",
                  fontSize: "9px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}>
                  <span style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "40px",
                    fontWeight: "bolder",
                  }}>
                    AGE<span>:</span>
                  </span>
                  <span style={{
                    fontWeight: "bolder",
                    width: "60px",
                    textAlign: "left",
                  }}>
                    {data.age} {data.gender}
                  </span>
                </p>

                {/* Phone Number */}
                <p style={{
                  margin: "1px 5px 0px 1px",
                  fontSize: "9px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}>
                  <span style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "40px",
                    fontWeight: "bolder",
                  }}>
                    PH<span>:</span>
                  </span>
                  <span style={{
                    fontWeight: "bolder",
                    width: "120px",
                    textAlign: "left",
                  }}>
                    {data.phone}
                  </span>
                </p>

                {/* Doctor Name */}
                {data.doctorname && (
                  <p style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}>
                    <span style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bolder",
                    }}>
                      Dr.<span>:</span>
                    </span>
                    <span style={{
                      fontWeight: "bolder",
                      width: "120px",
                      textAlign: "left",
                    }}>
                      {data.doctorname}
                    </span>
                  </p>
                )}

               
              </div>

              {/* Right Column */}
              <div style={{ 
                width: "42%", // Increased width to fill space better
                paddingLeft: "12px" // Move right column content more to the right
              }}>
                {/* Date */}
                <p style={{
                  margin: "1px 5px 0px 1px",
                  fontSize: "9px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}>
                  <span style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "32px",
                    fontWeight: "bolder",
                  }}>
                    Date<span>:</span>
                  </span>
                  <span style={{
                    fontWeight: "bolder",
                    width: "60px",
                    textAlign: "left",
                  }}>
                    {data.date}
                  </span>
                </p>

                {/* Time */}
                {/* <p style={{
                  margin: "1px 5px 0px 1px",
                  fontSize: "9px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}>
                  <span style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "32px",
                    fontWeight: "bolder",
                  }}>
                    Time<span>:</span>
                  </span>
                  <span style={{
                    fontWeight: "bolder",
                    width: "60px",
                    textAlign: "left",
                  }}>
                    {data.Time}
                  </span>
                </p> */}

                {/* OP/NO */}
                {data.opNo && (
                  <p style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}>
                    <span style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "35px",
                      fontWeight: "bolder",
                    }}>
                      OP/NO<span>:</span>
                    </span>
                    <span style={{
                      fontWeight: "bolder",
                      width: "70px",
                      textAlign: "left",
                    }}>
                      {data.opNo}
                    </span>
                  </p>
                )}

                {/* Renewal Date */}
                {data.renewDate && (
                  <p style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}>
                    <span style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "48px",
                      fontWeight: "bolder",
                    }}>
                      Renew Dt<span>:</span>
                    </span>
                    <span style={{
                      fontWeight: "bolder",
                      width: "60px",
                      textAlign: "left",
                    }}>
                      {data.renewDate}
                    </span>
                  </p>
                )}

                {data.ValidityDate && (
                  <p style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}>
                    <span style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "48px",
                      fontWeight: "bolder",
                    }}>
                      Valid Dt<span>:</span>
                    </span>
                    <span style={{
                      fontWeight: "bolder",
                      width: "60px",
                      textAlign: "left",
                    }}>
                      {data.ValidityDate}
                    </span>
                  </p>
                )}    

                {/* Room No */}
                {data.doctorRoom && (
                  <p style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}>
                    <span style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "48px",
                      fontWeight: "bolder",
                    }}>
                      ROOM<span>:</span>
                    </span>
                    <span style={{
                      fontWeight: "bolder",
                      width: "40px",
                      textAlign: "left",
                    }}>
                      {data.doctorRoom}
                    </span>
                  </p>
                )}

                {/* QR Code positioned at bottom */}
                <div style={{ 
                  marginTop: "auto", 
                  textAlign: "center",
                  paddingTop: "5px" 
                }}>
                  <QRCode
                    value={data.barcode || "NOVALUE"}
                    size={28}
                    bgColor="transparent"
                    fgColor="black"
                    style={{ margin: "0px" }}
                  />
                </div>
              </div>
            </div>
             {/* Address */}
                {data.address && (
                  <p style={{
                    margin: "1px 2px 3px 1px",
                    fontSize: "8px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "3px",
                  }}>
                    <span style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "40px",
                      fontWeight: "bolder",
                    }}>
                      ADD<span>:</span>
                    </span>
                    <span style={{
                      width: "100%",
                      textAlign: "start",
                      fontSize: "8px",
                      fontWeight: "bold",
                      color : "black"
                    }}>
                      {data.address}
                    </span>
                  </p>
                )}
          </div>
        ))}
      </div>

      <ReactToPrint
        trigger={() => (
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <button
              style={{
                padding: "8px 20px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Print
            </button>
          </div>
        )}
        content={() => componentRef.current}
        pageStyle={printBarcodeStyles}
      />
    </div>
  );
};



export default OPBarcode;


