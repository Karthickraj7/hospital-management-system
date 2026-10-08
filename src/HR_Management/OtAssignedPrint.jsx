import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { PrinterIcon } from "lucide-react";

const OtAssignedTable = () => {
  const [otData, setOtData] = useState([]);
  
  // Initialize filterDate with today's date
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const [filterDate, setFilterDate] = useState(`${yyyy}-${mm}-${dd}`);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [status, setStatus] = useState("");

  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const tableRef = useRef();

  const fetchOTData = async () => {
    try {
      const response = await axios.get(`${urllink}HR_Management/OtAssignedDatas`);
      setOtData(response.data.assigned_OTs || []);
    } catch (error) {
      console.error("Error fetching OT data:", error);
    }
  };

  useEffect(() => {
    fetchOTData();
  }, []);

  // Filtered data based on all filters
  const filteredData = otData.filter((ot) => {
    // Date filter
    const formattedOtDate = ot.Shift_Date
      ? ot.Shift_Date.split("-").reverse().join("-") // dd-mm-yyyy -> yyyy-mm-dd
      : "";
    const matchesDate = filterDate ? formattedOtDate === filterDate : true;

    // Employee Name filter
    const matchesName = employeeName
      ? ot.Employee_Name.toLowerCase().includes(employeeName.toLowerCase())
      : true;

    // Employee ID filter
    const matchesID = employeeID
      ? ot.Employee_ID.toString().includes(employeeID)
      : true;

    // Status filter
    const matchesStatus = status
      ? ot.Status.toLowerCase().includes(status.toLowerCase())
      : true;

    return matchesDate && matchesName && matchesID && matchesStatus;
  });

  const handlePrint = () => {
    const printContent = tableRef.current.cloneNode(true);
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Assigned OT Records</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; -webkit-print-color-adjust: exact; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; page-break-inside: auto; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12pt; }
            th { background-color: #000; color: #fff; }
            tr:nth-child(even) { background-color: #ccc; }
            tr:nth-child(odd) { background-color: #eee; }
            @media print { button { display: none; } tr { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          <h2>Assigned Overtime Records</h2>
        </body>
      </html>
    `);

    printWindow.document.body.appendChild(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", overflowX: "auto" }}>
      <h2>Assigned Overtime Records</h2>
      <br />

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ borderRadius: "5px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          style={{ borderRadius: "5px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          style={{ borderRadius: "5px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ borderRadius: "5px", padding: "5px" }}
        />
        <button
          onClick={() => {
            setFilterDate("");
            setEmployeeName("");
            setEmployeeID("");
            setStatus("");
          }}
          style={{ backgroundColor: "grey", color: "white", borderRadius: "5px", padding: "5px 10px" }}
        >
          Clear
        </button>
      </div>

      <button
        onClick={handlePrint}
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          backgroundColor: "rgb(132 174 183)",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <PrinterIcon />
      </button>

      <div style={{ overflowX: "auto" }}>
        <table ref={tableRef} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "rgb(132 174 183)", color: "white" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "rgb(132 174 183)", color: "white" }}>EMP ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "rgb(132 174 183)", color: "white" }}>EMP Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "rgb(132 174 183)", color: "white" }}>Shift Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "rgb(132 174 183)", color: "white" }}>Start Time</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "rgb(132 174 183)", color: "white" }}>End Time</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "rgb(132 174 183)", color: "white", textAlign: "right" }}>Hours</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "rgb(132 174 183)", color: "white" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((ot) => (
                <tr key={ot.OT_ID}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{ot.OT_ID}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{ot.Employee_ID}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{ot.Employee_Name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{ot.Shift_Date}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{ot.StartTime}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{ot.EndTime}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{ot.Hours}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{ot.Status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "12px" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OtAssignedTable;
