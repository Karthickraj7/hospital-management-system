import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

function AttendanceReport() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const FetchAttendance = async () => {
    try {
      let url = `${UrlLink}/HR_Management/get_employee_attendance?`;
      if (employeeId) url += `employee_id=${employeeId}&`;
      if (month) url += `month=${month}&`;
      if (year) url += `year=${year}&`;

      const res = await axios.get(url);
      setAttendanceData(res.data.attendance || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    FetchAttendance();
  }, [month, year, employeeId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop().toLowerCase();
      if (!["csv", "xlsx", "xls"].includes(ext)) {
        alert("Only CSV, XLSX, or XLS files are allowed.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("created_by", "Admin");

    try {
      setUploading(true);
      const res = await axios.post(
        `${UrlLink}/HR_Management/upload_attendance`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert(res.data.message || "Attendance uploaded successfully ✅");
      setFile(null);
      FetchAttendance();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.error ||
          "Upload failed. Please check your file format."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "1200px", margin: "0 auto" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
        Upload Attendance (CSV/XLSX/XLS)
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          id="Servicechoose"
          required
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <label
          htmlFor="Servicechoose"
          title="Choose File"
          style={{ cursor: "pointer", padding: "8px 12px", border: "1px solid #ccc", borderRadius: "5px", background: "#f9f9f9" }}
        >
          <PhotoCameraBackIcon />
        </label>

        <button
          onClick={handleUpload}
          disabled={uploading}
          title="Upload File"
          style={{ cursor: "pointer", padding: "8px 12px", border: "1px solid #007bff", borderRadius: "5px", background: "#7fb1ad", color: "#fff" }}
        >
          <DriveFolderUploadIcon />
          {uploading ? " Uploading..." : " Upload"}
        </button>
      </div>

      {file && <p style={{ marginTop: "8px", fontSize: "14px" }}>📂 Selected: {file.name}</p>}

      {/* Filters Section */}
      <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-start" }}>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "5px" }}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "5px" }}
        >
          <option value="">All Years</option>
          {[2023, 2024, 2025, 2026].map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "5px" }}
        />

        <button
          onClick={FetchAttendance}
          style={{ cursor: "pointer", padding: "6px 12px", border: "1px solid green", borderRadius: "5px", background: "rgb(236 184 241)", color: "white" }}
        >
          Filter
        </button>
      </div>

      {/* Attendance Table */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
          Employee Attendance Records
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead style={{ background: "#f0f0f0" }}>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>ID</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Employee</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Date</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>In Time</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Out Time</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Working Hours</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Status</th>
               
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Created By</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((row, index) => (
                  <tr key={index} style={{ background: index % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ border: "1px solid #ccc", padding: "6px" }}>{row.Attendance_Id}</td>
                    <td style={{ border: "1px solid #ccc", padding: "6px" }}>{row.Employee_Name || "-"}</td>
                    <td style={{ border: "1px solid #ccc", padding: "6px" }}>{row.Date || "-"}</td>
                    <td style={{ border: "1px solid #ccc", padding: "6px" }}>{row.In_Time || "-"}</td>
                    <td style={{ border: "1px solid #ccc", padding: "6px" }}>{row.Out_Time || "-"}</td>
                    <td style={{ border: "1px solid #ccc", padding: "6px" }}>{row.Working_Hours || "-"}</td>
                    <td style={{ border: "1px solid #ccc", padding: "6px" }}>{row.Attendance_Status || "-"}</td>
              
                    <td style={{ border: "1px solid #ccc", padding: "6px" }}>{row.CreatedBy || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "10px", color: "#666" }}>
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;
