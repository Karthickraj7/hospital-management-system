import React, { useRef } from "react";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";
import './Radbarcode.css';

const generateSampleData = (count, data, PatientDetails) => {

    console.log(data,'data32432');
    console.log(PatientDetails,'PatientDetails123');

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
    // Fallback
    else {
      console.error("Unrecognized date format:", created_at);
      return "Invalid Date";
    }

    if (isNaN(baseDate)) {
      console.error("Invalid Date 'baseDate'");
      return "Invalid Date";
    }

    const renewDate = new Date(baseDate);
    renewDate.setDate(baseDate.getDate() + 5);

    const formatted = `${String(renewDate.getDate()).padStart(2, "0")}.${String(renewDate.getMonth() + 1).padStart(2, "0")}.${renewDate.getFullYear()}`;
    
    console.log(baseDate, 'baseDate');
    console.log(renewDate, 'renewDate');
    console.log(formatted, 'barcodeeeeeeee');

    return formatted;
  };


  const formatAddress = (data) => {
    const parts = `${[
      data.DoorNo,
      data.Street,
      data.Area,
      data.City,
      data.District,
      data.State,
      // data.Country,
    ].filter(Boolean).join(", ")}${data.Pincode ? ` - ${data.Pincode}` : ''}`;
  
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
    // Fallback
    else {
      console.error("Unrecognized date format:", dateString);
      return "Invalid Date";
    }

    if (isNaN(date)) {
      console.error("Invalid Date:", dateString);
      return "Invalid Date";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };


  const baseData = {
    opNo: data.registeridbarcode,
    date: formatDate(data.createdate),
    name: data.PatientName,
    FatherName: data.fathername,
    SpouseName: data.SpouseName,
    age: data.Age,
    gender: data.Gender,
    address: formatAddress(data),
    phone: data.PhoneNo,
    renewDate: calculateRenewDate(data.createdate),
    barcode: data.PatientId,
    PatientId: data.PatientId,
  };

  console.log(baseData,'777777777878');

  const result = [];


  result.push({ ...baseData, department: "RADIOLOGY" });

  console.log(result,'result11111');
  

//   const uniqueDepartments = [
//     ...new Set((data?.Multiple_Doc || []).map((doc) => doc.Specilization)),
//   ].filter(Boolean); // Filter out any empty values
  
//   if (uniqueDepartments.length >= 1) {
//     uniqueDepartments.forEach((dept) => {
//       result.push({ ...baseData, department: dept });
//     });
//   }

  return result;
};

// Improved print styles for more reliable printing
const printBarcodeStyles = `
@page {
  size: 8cm 4cm !important;
  margin: 0 !important;
  padding: 0 !important;
}

@media print {
 .print-container-barHash  {
    width: 8cm;
    height: 4cm;
    margin: 0;
    padding: 0;
  }

  .barcode-label-barHash {
    width: 8cm !important;
    height: 4cm !important;
    page-break-after: always !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    display: block !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 5px !important;
    background-color: transparent !important;
  }
  
  .barcode-label-barHash:last-child {
    page-break-after: auto !important;
  }
}
`;

const RadiologyBarcode = ({ rowData, PatientDetails }) => {

  console.log(rowData,'rowData---------');
  console.log(PatientDetails,'PatientDetails------------');

  const componentRef = useRef();
  const sampleData = generateSampleData(1, rowData, PatientDetails);
  
  console.log("Barcodes to print:", sampleData);

  return (
    <div>
      <div ref={componentRef} className="print-container-barHash ">
        {sampleData.map((data, index) => (
          <div
            key={index}
            className="barcode-label-barHash"
            style={{
              backgroundColor: "#e6f0f5",
              width: "8cm",
              height: "4cm",
              padding: "5px",
              borderRadius: "8px",
              fontFamily: "Arial, sans-serif",
              marginBottom: "10px", // Adds spacing in preview (won't affect print)
            }}
          >
            <div style={{ display: "flex", width: "100%" }}>
              {/* Left Column */}
              <div style={{ flex: "1", textAlign: "left" }}>
                <p
                  style={{
                    margin: "1px 0",
                    fontSize: "10px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginRight: "5px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    OP NO <span>:</span>
                  </span>
                  <span style={{ fontWeight: "bold", width: "120px" }}>{data.opNo}</span>
                </p>
                <p
                  style={{
                    margin: "1px 0",
                    fontSize: "10px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginRight: "5px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    NAME <span>:</span>
                  </span>
                  <span style={{ fontWeight: "bold", width: "120px" }}>{data.name}</span>
                </p>

                {(data.FatherName || data.SpouseName) && (
                  <p
                    style={{
                      margin: "1px 0",
                      fontSize: "10px",
                      fontWeight: "normal",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginRight: "5px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "40px",
                        fontWeight: "bold",
                      }}
                    >
                      {data.FatherName ? "Father" : "Spouse"} <span>:</span>
                    </span>
                    <span style={{ fontWeight: "bold", width: "120px" }}>
                      {data.FatherName || data.SpouseName || ""}
                    </span>
                  </p>
                )}

              {/* {data.department && (
              <div style={{ display: "flex", width: "100%", marginTop: "1px" }}>
                <div style={{ flex: "1", textAlign: "left" }}>
                  <p
                    style={{
                      margin: "1px 0",
                      fontSize: "10px",
                      fontWeight: "normal",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "40px",
                        fontWeight: "bold",
                      }}
                    >
                      DEPT<span>:</span>
                    </span>
                    <span style={{ fontWeight: "bold", width: "120px" }}>{data.department}</span>
                  </p>
                </div>
              </div>
            )} */}

              
              </div>

              {/* Right Column */}
              <div style={{ flex: "1", textAlign: "left" }}>
                <p
                  style={{
                    margin: "1px 0",
                    fontSize: "10px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "60px",
                      fontWeight: "bold",
                    }}
                  >
                    Renew Dt<span>:</span>
                  </span>
                  {data.renewDate}
                </p>
                <p
                  style={{
                    margin: "1px 0",
                    fontSize: "10px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    PH <span>:</span>
                  </span>
                  {data.phone}
                </p>

                <p
                  style={{
                    margin: "1px 0",
                    fontSize: "10px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    Date<span>:</span>
                  </span>
                  {data.date}
                </p>
                <p
                  style={{
                    margin: "1px 0",
                    fontSize: "10px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    AGE <span>:</span>
                  </span>
                  {data.age} {data.gender}
                </p>
              </div>
            </div>

            {/* Department (conditionally rendered) */}
         
<p
                  style={{
                    margin: "1px 0",
                    marginBottom:'3px',
                    fontSize: "10px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "5px",
                    marginRight: "5px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "47px",
                      fontWeight: "bold",
                    }}
                  >
                    ADD<span>:</span>
                  </span>
                  <span style={{  width: "100%" ,textAlign:'start',fontSize:'9.4px'}}>{data.address}</span>
                </p>


            <div style={{ textAlign: "center" }}>
              <Barcode
                value={data.barcode || "NOVALUE"}
                lineColor="Black"
                height={30}
                width={1}
                fontSize={10}
                displayValue={false}
                margin={0}
              />
              <p style={{ fontSize: "10px", margin: "1px 0 0 0" }}>
                Patient ID: {data.PatientId}
              </p>
            </div>
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

export default RadiologyBarcode