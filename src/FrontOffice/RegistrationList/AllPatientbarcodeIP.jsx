import React, { useRef, useState, useEffect, useMemo } from "react";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";
import "./BarcodeHashwar.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaQrcode } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import QRCode from "react-qr-code";

const generateSampleData = (
  count,
  data,
  PatientDetails,
  fromPatientList = false,
  DoctorRoomData
) => {
  if (!data) return [];

  // ---------- Common helpers ----------
  const formatAddress = (data) => {
    const parts =
      [
        (data && data.DoorNo) || "",
        (data && data.Street) || "",
        (data && data.Area) || "",
        (data && data.City) || "",
        (data && data.District) || "",
        (data && data.State) || "",
      ]
        .filter(Boolean)
        .join(", ") + (data && data.Pincode ? ` - ${data.Pincode}` : "");
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
        date = new Date(dateString.replace(/-/g, "/")); // Polyfill for older date formats
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
        date = new Date(dateString.replace(/-/g, "/")); // Polyfill for older date formats
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

    console.log(date, "dateeeeeeeeeee", dateString, "dateString");

    // Format time part
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return `${formattedTime}`;
  };

  // ---------- Base data ----------
  const baseData = {
    PatientId: data.PatientId,
    RegistrationId: data.RegistrationId || data.registeridbarcode,
    name: data.PatientName,
    FatherName: data.fathername,
    SpouseName: data.SpouseName,
    age: data.Age,
    gender: data.Gender,
    WardName: data.WardName,
    phone: data.PhoneNo,
    doctorname: data.DoctorName,
    doctorRoom: data.RoomNo,
    address: formatAddress(data),
    date: formatDate(data.created_at),
    Time: formatDateTime(data.created_time),
    barcode: data.RegistrationId || data.PatientId,
  };

  console.log(baseData,"basedata");
  
 

  // ---------- For IP patients ----------
  return [baseData];
};

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

const AllPatienbarcodeIP = ({ rowData, PatientDetails, fromPatientList }) => {
  console.log(rowData, "ip---------");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [DoctorRoomData, setDoctorRoomData] = useState([]);
  const componentRef = useRef();
  //   const sampleData = generateSampleData(
  //     1,
  //     rowData,
  //     PatientDetails,
  //     fromPatientList,
  //     DoctorRoomData
  //   );

  const sampleData = useMemo(() => {
    return generateSampleData(
      1,
      rowData,
      PatientDetails,
      fromPatientList,
      DoctorRoomData
    );
  }, [rowData, PatientDetails, fromPatientList, DoctorRoomData]);

  console.log("rowData:", rowData);
  console.log("fromPatientList:", fromPatientList);
  console.log("PatientDetails:", PatientDetails);
  console.log("DoctorRoomData:", DoctorRoomData);

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
            <div
              style={{
                display: "flex",
                width: "100%",
                paddingLeft: "8px", // Move entire content slightly right
              }}
            >
              {/* Left Column - Patient Details */}
              <div
                style={{
                  width: "58%", // Slightly reduced width
                  paddingRight: "5px", // Add some padding to move content right
                }}
              >
                {/* Patient ID with dash after 6 digits and bigger last numbers */}
                <p
                  style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "10px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bolder",
                    }}
                  >
                    IP NO:<span>:</span>
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
                    <span
                      style={{
                        fontWeight: "bolder",
                        fontSize: "14px",
                      }}
                    >
                      {data.RegistrationId}
                    </span>
                    {/* <span
                      style={{
                        fontWeight: "900",
                        fontSize: "14px",
                        color: "#000",
                      }}
                    >
                      -{data.PatientId?.slice(6)}
                    </span> */}
                  </span>
                </p>

                {/* Name with increased size */}
                <p
                  style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "11px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bolder",
                    }}
                  >
                    NAME<span>:</span>
                  </span>
                  <span
                    style={{
                      fontWeight: "bolder",
                      width: "120px",
                      textAlign: "left",
                    }}
                  >
                    {data.name}
                  </span>
                </p>

                {data.FatherName && (
                  <p
                    style={{
                      margin: "1px 5px 0px 1px",
                      fontSize: "9px",
                      fontWeight: "normal",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "40px",
                        fontWeight: "bolder",
                      }}
                    >
                      Father<span>:</span>
                    </span>
                    <span
                      style={{
                        fontWeight: "bolder",
                        width: "120px",
                        textAlign: "left",
                      }}
                    >
                      {data.FatherName}
                    </span>
                  </p>
                )}

                {data.SpouseName && (
                  <p
                    style={{
                      margin: "1px 5px 0px 1px",
                      fontSize: "9px",
                      fontWeight: "normal",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "40px",
                        fontWeight: "bolder",
                      }}
                    >
                      Spouse<span>:</span>
                    </span>
                    <span
                      style={{
                        fontWeight: "bolder",
                        width: "120px",
                        textAlign: "left",
                      }}
                    >
                      {data.SpouseName}
                    </span>
                  </p>
                )}

                {/* Age */}
                <p
                  style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bolder",
                    }}
                  >
                    AGE<span>:</span>
                  </span>
                  <span
                    style={{
                      fontWeight: "bolder",
                      width: "60px",
                      textAlign: "left",
                    }}
                  >
                    {data.age} {data.gender}
                  </span>
                </p>

                {/* Phone Number */}
                <p
                  style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "40px",
                      fontWeight: "bolder",
                    }}
                  >
                    PH<span>:</span>
                  </span>
                  <span
                    style={{
                      fontWeight: "bolder",
                      width: "120px",
                      textAlign: "left",
                    }}
                  >
                    {data.phone}
                  </span>
                </p>
              </div>

              {/* Right Column */}
              <div
                style={{
                  width: "42%", // Increased width to fill space better
                  paddingLeft: "12px", // Move right column content more to the right
                }}
              >
                <p
                  style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "10px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "25px",
                      fontWeight: "bolder",
                    }}
                  >
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
                    <span
                      style={{
                        fontWeight: "bolder",
                        fontSize: "10px",
                      }}
                    >
                      {data.PatientId?.slice(0,3)}
                    </span>
                    <span
                      style={{
                        fontWeight: "900",
                        fontSize: "14px",
                        color: "#000",
                      }}
                    >
                      {data.PatientId?.slice(3,10)}
                    </span>
                  </span>
                </p>
                {/* Date */}
                <p
                  style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "32px",
                      fontWeight: "bolder",
                    }}
                  >
                    Date<span>:</span>
                  </span>
                  <span
                    style={{
                      fontWeight: "bolder",
                      width: "60px",
                      textAlign: "left",
                    }}
                  >
                    {data.date}
                  </span>
                </p>

                {/* Time */}
                <p
                  style={{
                    margin: "1px 5px 0px 1px",
                    fontSize: "9px",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "32px",
                      fontWeight: "bolder",
                    }}
                  >
                    Time<span>:</span>
                  </span>
                  <span
                    style={{
                      fontWeight: "bolder",
                      width: "60px",
                      textAlign: "left",
                    }}
                  >
                    {data.Time}
                  </span>
                </p>

                {/* OP/NO */}
                {data.opNo && (
                  <p
                    style={{
                      margin: "1px 5px 0px 1px",
                      fontSize: "9px",
                      fontWeight: "normal",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "35px",
                        fontWeight: "bolder",
                      }}
                    >
                      OP/NO<span>:</span>
                    </span>
                    <span
                      style={{
                        fontWeight: "bolder",
                        width: "70px",
                        textAlign: "left",
                      }}
                    >
                      {data.opNo}
                    </span>
                  </p>
                )}

                {/* Renewal Date */}
                {data.renewDate && (
                  <p
                    style={{
                      margin: "1px 5px 0px 1px",
                      fontSize: "9px",
                      fontWeight: "normal",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "48px",
                        fontWeight: "bolder",
                      }}
                    >
                      Renew Dt<span>:</span>
                    </span>
                    <span
                      style={{
                        fontWeight: "bolder",
                        width: "60px",
                        textAlign: "left",
                      }}
                    >
                      {data.renewDate}
                    </span>
                  </p>
                )}

                {data.ValidityDate && (
                  <p
                    style={{
                      margin: "1px 5px 0px 1px",
                      fontSize: "9px",
                      fontWeight: "normal",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "48px",
                        fontWeight: "bolder",
                      }}
                    >
                      Valid Dt<span>:</span>
                    </span>
                    <span
                      style={{
                        fontWeight: "bolder",
                        width: "60px",
                        textAlign: "left",
                      }}
                    >
                      {data.ValidityDate}
                    </span>
                  </p>
                )}

                {/* Room No */}
                {data.doctorRoom && (
                  <p
                    style={{
                      margin: "1px 5px 0px 1px",
                      fontSize: "9px",
                      fontWeight: "normal",
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // width: "48px",
                        fontWeight: "bolder",
                      }}
                    >
                      ROOM<span>:</span>
                    </span>
                    <span
                      style={{
                        fontWeight: "bolder",
                        width: "40px",
                        textAlign: "left",
                      }}
                    >
                      {data.WardName}
                    </span>
                  </p>
                )}

                {/* QR Code positioned at bottom */}
                {/* <div
                  style={{
                    marginTop: "auto",
                    textAlign: "center",
                    paddingTop: "5px",
                  }}
                >
                  <QRCode
                    value={data.barcode || "NOVALUE"}
                    size={28}
                    bgColor="transparent"
                    fgColor="black"
                    style={{ margin: "0px" }}
                  />
                </div> */}
              </div>
            </div>
            {/* Doctor Name */}
            {data.doctorname && (
              <p
                style={{
                  margin: "1px 5px 0px 7px",
                  fontSize: "9px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "40px",
                    fontWeight: "bolder",
                  }}
                >
                  Dr.<span>:</span>
                </span>
                <span
                  style={{
                    fontWeight: "bolder",
                    width: "120px",
                    textAlign: "left",
                  }}
                >
                  {data.doctorname}
                </span>
              </p>
            )}
            {/* Address */}
            {data.address && (
              <p
                style={{
                  margin: "1px 2px 3px 5px",
                  fontSize: "8px",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "3px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "40px",
                    fontWeight: "bolder",
                  }}
                >
                  ADD<span>:</span>
                </span>
                <span
                  style={{
                    width: "100%",
                    textAlign: "start",
                    fontSize: "8px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
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

export default AllPatienbarcodeIP;
