import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import { SearchIcon } from "lucide-react";

function RadiologyReportsnew() {
  const [period, setPeriod] = useState("current");
  const [mode, setMode] = useState("list"); // list, doctor, deptwise
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [registerType, setRegisterType] = useState("All");
  const [doctorId, setDoctorId] = useState("all");
  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const [patientSearch, setPatientSearch] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [serviceStatus, setServiceStatus] = useState("All");

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);

  function formatDate(date) {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Status and Register Type Options
  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Request", label: "Request" },
    { value: "Paid", label: "Paid" },
    { value: "Due", label: "Due" },
    { value: "Analyzed", label: "Analyzed" },
    { value: "Completed", label: "Completed" },
  ];

  const registerTypeOptions = [
    { value: "All", label: "All" },
    { value: "OP", label: "OP" },
    { value: "IP", label: "IP" },
    { value: "WALK-IN", label: "WALK-IN" },
  ];

  const serviceStatusOptions = [
  { value: "All", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Analyzed", label: "Analyzed" },
  { value: "Completed", label: "Completed" },
  ];

  // Fetch Departments
  // useEffect(() => {
  //   const fetchDepartments = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${UrlLink}MCI/get_radiology_departments`
  //       );
  //       setDepartments(response.data || []);
  //     } catch (error) {
  //       console.error("Error fetching departments:", error);
  //     }
  //   };
  //   if (UrlLink) fetchDepartments();
  // }, [UrlLink]);
  useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${UrlLink}MCI/get_radiology_departments`);
      
      // Handle API response safely
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setDepartments(data);
      console.log("Departments API response:", response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]); // fallback on error
    }
  };

  if (UrlLink) fetchDepartments();
 }, [UrlLink]);


  // Fetch Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${UrlLink}MCI/get_radiology_doctors`);
        setDoctors(response.data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    if (UrlLink) fetchDoctors();
  }, [UrlLink]);

  // Main API call to fetch reports
  const fetchReportData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};

      // Date filters
      if (period === "current" && currentDate) {
        params.DateType = "current";
        params.CurrentDate = currentDate;
      } else if (period === "customize" && startDate && endDate) {
        params.FromDate = startDate;
        params.ToDate = endDate;
      } else if (period === "all") {
        params.DateType = "all";
      }

      // Other filters
      if (department && department !== "All") params.Department = department;
      // if (status && status !== "All") params.status = status;
      if (status && status !== "All") params.status  = status; // Capital 'S'
      if (serviceStatus && serviceStatus !== "All") params.Service_Status = serviceStatus;
      if (registerType && registerType !== "All")
        params.RegisterType = registerType;
      if (doctorId && doctorId !== "all") params.doctor_id = doctorId;
      if (patientSearch) params.patient_search = patientSearch;
      if (testSearch) params.test_search = testSearch;

      let response;

      // Use different APIs based on mode
      if (mode === "list") {
        response = await axios.get(`${UrlLink}MCI/get_radiology_patient_list`, {
          params,
        });
        setReportData(response.data.RadiologyList || []);
        setSummaryData(response.data.summary || {});
      } else if (mode === "doctor") {
        if (!doctorId || doctorId === "all") {
          setError("Please select a doctor for doctor-wise reports");
          setLoading(false);
          return;
        }
        response = await axios.get(
          `${UrlLink}MCI/get_radiology_doctor_wise_reports`,
          { params }
        );
        setReportData(response.data.reports || []);
        setSummaryData(response.data.summary || {});
      } else if (mode === "deptwise") {
        if (!department || department === "All") {
          setError("Please select a department for department summary");
          setLoading(false);
          return;
        }
        response = await axios.get(
          `${UrlLink}MCI/get_radiology_department_summary`,
          { params }
        );
        setReportData([]);
        setSummaryData(response.data || {});
      } else if (mode === "specialization") {
        response = await axios.get(
          `${UrlLink}MCI/specialization_department_get`,
          { params }
        );
         const data = response.data || {};
        setReportData(data.SpecializationCounts || []);
        setSummaryData(data.Summary || {});
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // Calculate totals based on status
  const [totalCounts, setTotalCounts] = useState({
    request: 0,
    paid: 0,
    due: 0,
    analyzed: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    if (mode === "list" && summaryData) {
      setTotalCounts({
        request: summaryData.request || 0,
        paid: summaryData.paid || 0,
        due: summaryData.due || 0,
        analyzed: summaryData.analyzed || 0,
        completed: summaryData.completed || 0,
        total: summaryData.total || 0,
      });
    } else if (mode === "doctor" && summaryData) {
      setTotalCounts({
        request: summaryData.request || 0,
        paid: summaryData.paid || 0,
        due: summaryData.due || 0,
        analyzed: 0,
        completed: summaryData.completed || 0,
        total: summaryData.total_reports || 0,
      });
    } else if (mode === "specialization" && summaryData) {
      setTotalCounts({
        request: summaryData.total_request || 0,
        paid: summaryData.total_paid || 0,
        due: summaryData.total_due || 0,
        analyzed: summaryData.total_analyzed || 0,
        completed: summaryData.total_completed || 0,
        total: summaryData.total_tests || 0,
      });
    }
  }, [summaryData, mode]);

  // Filter data based on search terms
  const filteredData = reportData.filter((item) => {
    const patientMatch =
      !patientSearch ||
      (item.PatientName &&
        item.PatientName.toLowerCase().includes(patientSearch.toLowerCase())) ||
      (item.PatientId &&
        item.PatientId.toLowerCase().includes(patientSearch.toLowerCase()));

    const testMatch =
      !testSearch ||
      (item.Testname &&
        item.Testname.toLowerCase().includes(testSearch.toLowerCase()));

    return patientMatch && testMatch;
  });

  // Export to Excel
  const exportToExcel = () => {
    let dataToExport = [];

    if (mode === "list") {
      dataToExport = filteredData.map((item) => ({
        SNo: item.Sno,
        PatientId: item.PatientId,
        PatientName: item.PatientName,
        PhoneNumber: item.PhoneNumber,
        RegisterType: item.RegisterType,
        Department: item.Deptname,
        TestName: item.Testname,
        Doctor: item.doctor_name,
        Status: item.Status,
        ServiceStatus: item.Service_Status,
        RequestId: item.request_id,
      }));
    } else if (mode === "deptwise" && summaryData.Countdetails) {
      dataToExport = summaryData.Countdetails.map((item, index) => ({
        SNo: index + 1,
        TestName: item.Testname,
        Count: item.Testcount,
      }));
    } else if (mode === "specialization" && reportData.length > 0) {
      // Create a flattened view for Excel export
      dataToExport = [];
      reportData.forEach((specialization) => {
        specialization.Departments.forEach((department) => {
          department.Tests.forEach((test) => {
            dataToExport.push({
              SNo: dataToExport.length + 1,
              Specialization: specialization.Specialization_Name,
              Department: department.Department_Name,
              TestName: test.Test_Name,
              TestCode: test.Test_Code,
              TestCount: test.Test_Count,
              RequestCount: test.Request_Count,
              PaidCount: test.Paid_Count,
              DueCount: test.Due_Count,
              AnalyzedCount: test.Analyzed_Count,
              CompletedCount: test.Completed_Count,
            });
          });
        });
      });
    }

    if (dataToExport.length === 0) {
      alert("No data to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RadiologyReport");
    XLSX.writeFile(wb, `RadiologyReport_${mode}_${period}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Radiology Reports - ${mode} - ${period}`, 14, 16);

    let tableColumn = [];
    let tableRows = [];

    if (mode === "list") {
      tableColumn = [
        "S.No",
        "Patient ID",
        "Patient Name",
        "Phone",
        "Type",
        "Department",
        "Test",
        "Doctor",
        "Status",
      ];
      tableRows = filteredData.map((item) => [
        item.Sno,
        item.PatientId,
        item.PatientName,
        item.PhoneNumber,
        item.RegisterType,
        item.Deptname,
        item.Testname,
        item.doctor_name,
        item.Status,
      ]);
    } else if (mode === "deptwise" && summaryData.Countdetails) {
      tableColumn = ["S.No", "Test Name", "Count"];
      tableRows = summaryData.Countdetails.map((item, index) => [
        index + 1,
        item.Testname,
        item.Testcount,
      ]);
    } else if (mode === "specialization" && reportData.length > 0) {
      tableColumn = [
        "S.No",
        "Specialization",
        "Department",
        "Test Name",
        "Test Count",
        "Request",
        "Paid",
        "Due",
        "Analyzed",
        "Completed",
      ];
      let sno = 1;
      reportData.forEach((specialization) => {
        specialization.Departments.forEach((department) => {
          department.Tests.forEach((test) => {
            tableRows.push([
              sno++,
              specialization.Specialization_Name,
              department.Department_Name,
              test.Test_Name,
              test.Test_Count,
              test.Request_Count,
              test.Paid_Count,
              test.Due_Count,
              test.Analyzed_Count,
              test.Completed_Count,
            ]);
          });
        });
      });
    }

    if (tableRows.length === 0) {
      alert("No data to export");
      return;
    }

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`RadiologyReport_${mode}_${period}.pdf`);
  };

  // Print Report
  const printReport = () => {
    const tableContent = document.getElementById("report-table").outerHTML;
    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Radiology Reports</title>
          <style>
            body { font-family: Arial; margin: 10px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Radiology Reports - ${mode} - ${period}</h2>
          <div>Total Reports: ${totalCounts.total}</div>
          <div>Request: ${totalCounts.request} | Paid: ${totalCounts.paid} | Due: ${totalCounts.due}</div>
          <div>Analyzed: ${totalCounts.analyzed} | Completed: ${totalCounts.completed}</div>
          ${tableContent}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.print();
    newWin.close();
  };

  // Styles
  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px",
  };
  const headerStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  };
  const filterContainer = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
  };
  const inputStyle = {
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "4px",
    width: "150px",
  };
  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  });
  const tableContainer = { overflowX: "auto" };
  const tableStyle = {
    minWidth: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
  };
  const thStyle = {
    border: "1px solid #ccc",
    padding: "4px",
    backgroundColor: "#f0f0f0",
    textAlign: "start",
    minWidth: "90px",
  };
  const tdStyle = {
    border: "1px solid #ccc",
    padding: "4px",
    textAlign: "start",
    fontSize: "12px",
    minWidth: "90px",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Radiology Reports</h2>

      {/* Report Mode Selection */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label style={{ fontWeight: "bold", marginRight: "20px" }}>
          Report Mode:
        </label>
        <label style={{ marginRight: "15px" }}>
          <input
            type="radio"
            name="mode"
            value="list"
            checked={mode === "list"}
            onChange={(e) => setMode(e.target.value)}
            style={{ marginRight: "5px" }}
          />
          Patient List
        </label>
        <label style={{ marginRight: "15px" }}>
          <input
            type="radio"
            name="mode"
            value="doctor"
            checked={mode === "doctor"}
            onChange={(e) => setMode(e.target.value)}
            style={{ marginRight: "5px" }}
          />
          Doctor Wise
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="deptwise"
            checked={mode === "deptwise"}
            onChange={(e) => setMode(e.target.value)}
            style={{ marginRight: "5px" }}
          />
          Department Summary
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="specialization"
            checked={mode === "specialization"}
            onChange={(e) => setMode(e.target.value)}
            style={{ marginRight: "5px" }}
          />
          Specialization Summary
        </label>
      </div>

      {/* Filters */}
      <div style={filterContainer}>
        <div>
          <label>Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={inputStyle}
          >
            <option value="current">Current Date</option>
            <option value="customize">Custom Range</option>
            <option value="all">All Records</option>
          </select>
        </div>

        {period === "current" && (
          <div>
            <label>Current Date:</label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        {period === "customize" && (
          <>
            <div>
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </>
        )}

        <div>
          <label>Department:</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Departments</option>
            {Array.isArray(departments) &&
              departments.map((dept) => (
                <option key={dept.Radiology_Id} value={dept.Radiology_Id}>
                  {dept.Radiology_Name}
                </option>
              ))}

          </select>
        </div>

        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add this after the Status filter */}
        <div>
          <label>Service Status:</label>
          <select
            value={serviceStatus}
            onChange={(e) => setServiceStatus(e.target.value)}
            style={inputStyle}
          >
            {serviceStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Register Type:</label>
          <select
            value={registerType}
            onChange={(e) => setRegisterType(e.target.value)}
            style={inputStyle}
          >
            {registerTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {(mode === "doctor" || mode === "list") && (
          <div>
            <label>Doctor:</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              style={inputStyle}
            >
              <option value="all">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                  {doctor.doctor_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === "list" && (
          <>
            <div>
              <label>Patient Search:</label>
              <input
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Patient name/ID"
                style={inputStyle}
              />
            </div>
            <div>
              <label>Test Search:</label>
              <input
                value={testSearch}
                onChange={(e) => setTestSearch(e.target.value)}
                placeholder="Test name"
                style={inputStyle}
              />
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "5px", alignItems: "flex-end" }}>
          <button onClick={fetchReportData} style={buttonStyle("#5e6a8a")}>
            <SearchIcon size={16} />
          </button>
          <button onClick={exportToExcel} style={buttonStyle("#649c79")}>
            Excel
          </button>
          <button onClick={exportToPDF} style={buttonStyle("#8f6262")}>
            PDF
          </button>
          <button onClick={printReport} style={buttonStyle("#947c52")}>
            Print
          </button>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      {/* Summary Counts for List Mode */}
      {mode === "list" && totalCounts.total > 0 && (
        <div
          style={{
            fontWeight: "bold",
            backgroundColor: "#e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            padding: "8px",
            marginBottom: "10px",
          }}
        >
          <span>Total: {totalCounts.total}</span>
          <span>Request: {totalCounts.request}</span>
          <span>Paid: {totalCounts.paid}</span>
          <span>Due: {totalCounts.due}</span>
          <span>Analyzed: {totalCounts.analyzed}</span>
          <span>Completed: {totalCounts.completed}</span>
        </div>
      )}

      {/* Summary Counts for Doctor Mode */}
      {mode === "doctor" && totalCounts.total > 0 && (
        <div
          style={{
            fontWeight: "bold",
            backgroundColor: "#e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            padding: "8px",
            marginBottom: "10px",
          }}
        >
          <span>Total Reports: {totalCounts.total}</span>
          <span>Completed: {totalCounts.completed}</span>
          <span>Pending: {totalCounts.total - totalCounts.completed}</span>
          <span>Request: {totalCounts.request}</span>
          <span>Paid: {totalCounts.paid}</span>
          <span>Due: {totalCounts.due}</span>
        </div>
      )}

      {/* Department Summary Counts */}
      {mode === "deptwise" && summaryData.TotalOP !== undefined && (
        <div
          style={{
            fontWeight: "bold",
            backgroundColor: "#e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            padding: "8px",
            marginBottom: "10px",
          }}
        >
          <span>Total OP: {summaryData.TotalOP}</span>
          <span>Total IP: {summaryData.TotalIP}</span>
          <span>
            Grand Total:{" "}
            {summaryData.TotalCount ||
              summaryData.TotalOP + summaryData.TotalIP}
          </span>
          {summaryData.DepartmentName && (
            <span>Department: {summaryData.DepartmentName}</span>
          )}
        </div>
      )}

      {/* Specialization Summary Counts */}
      {/* Specialization Summary Counts */}
      {mode === "specialization" && summaryData && (
        <div>
          <div style={{
            fontWeight: "bold",
            backgroundColor: "#e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            padding: "8px",
            marginBottom: "10px",
          }}>
            <span>Total Specializations: {summaryData.total_specializations || 0}</span>
            <span>Total Tests: {summaryData.total_tests || 0}</span>
            <span>Request: {summaryData.total_request || 0}</span>
            <span>Paid: {summaryData.total_paid || 0}</span>
            <span>Due: {summaryData.total_due || 0}</span>
            <span>Analyzed: {summaryData.total_analyzed || 0}</span>
            <span>Completed: {summaryData.total_completed || 0}</span>
          </div>

          {/* Specialization breakdown */}
          {reportData && reportData.length > 0 && (
            <div style={{
              marginBottom: "10px",
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ddd",
              padding: "10px",
            }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
                Specialization Summary:
              </h4>
              {reportData.map((spec, index) => (
                <div key={index} style={{
                  marginBottom: "8px",
                  padding: "5px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "3px",
                  fontSize: "12px",
                }}>
                  <div style={{ fontWeight: "bold", color: "#495057" }}>
                    {spec.Specialization_Name} ({spec.Total_Test_Count || 0} tests)
                  </div>
                  <div style={{ color: "#6c757d", marginLeft: "10px" }}>
                    Departments: {spec.Departments?.length || 0} | Request:{" "}
                    {spec.Total_Request_Count || 0} | Paid: {spec.Total_Paid_Count || 0} |
                    Due: {spec.Total_Due_Count || 0} | Completed:{" "}
                    {spec.Total_Completed_Count || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div style={tableContainer}>
        <table id="report-table" style={tableStyle}>
          <thead>
            <tr>
              {mode === "list" && (
                <>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Patient ID</th>
                  <th style={thStyle}>Patient Name</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Department</th>
                  <th style={thStyle}>Test Name</th>
                  <th style={thStyle}>Doctor</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Service Status</th>
                  <th style={thStyle}>Request ID</th>
                </>
              )}
              {mode === "doctor" && (
                <>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Request ID</th>
                  <th style={thStyle}>Patient ID</th>
                  <th style={thStyle}>Patient Name</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Test Name</th>
                  <th style={thStyle}>Department</th>
                  <th style={thStyle}>Register Type</th>
                  <th style={thStyle}>Doctor</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Report Date</th>
                </>
              )}
              {mode === "deptwise" && (
                <>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Test Name</th>
                  <th style={thStyle}>Count</th>
                </>
              )}
              {mode === "specialization" && (
                <>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Specialization</th>
                  <th style={thStyle}>Department</th>
                  <th style={thStyle}>Test Name</th>
                  <th style={thStyle}>Test Count</th>
                  <th style={thStyle}>Request</th>
                  <th style={thStyle}>Paid</th>
                  <th style={thStyle}>Due</th>
                  <th style={thStyle}>Analyzed</th>
                  <th style={thStyle}>Completed</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {/* List Mode Table */}
            {mode === "list" &&
              (filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{ textAlign: "center", padding: "8px" }}
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={`list-${index}`}>
                    <td style={tdStyle}>{item.Sno}</td>
                    <td style={tdStyle}>{item.PatientId}</td>
                    <td style={tdStyle}>{item.PatientName}</td>
                    <td style={tdStyle}>{item.PhoneNumber}</td>
                    <td style={tdStyle}>{item.RegisterType}</td>
                    <td style={tdStyle}>{item.Deptname}</td>
                    <td style={tdStyle}>{item.Testname}</td>
                    <td style={tdStyle}>{item.doctor_name}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color:
                          item.Status === "Completed"
                            ? "green"
                            : item.Status === "Paid"
                            ? "blue"
                            : item.Status === "Due"
                            ? "orange"
                            : "red",
                      }}
                    >
                      {item.Status}
                    </td>
                    <td style={tdStyle}>{item.Service_Status}</td>
                    <td style={tdStyle}>{item.request_id}</td>
                  </tr>
                ))
              ))}

            {/* Doctor Mode Table */}
            {mode === "doctor" &&
              (reportData.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{ textAlign: "center", padding: "8px" }}
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                reportData.map((item, index) => (
                  <tr key={`doctor-${index}`}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{item.request_id}</td>
                    <td style={tdStyle}>{item.PatientId}</td>
                    <td style={tdStyle}>{item.PatientName}</td>
                    <td style={tdStyle}>{item.PhoneNumber}</td>
                    <td style={tdStyle}>{item.Testname}</td>
                    <td style={tdStyle}>{item.Deptname}</td>
                    <td style={tdStyle}>{item.RegisterType}</td>
                    <td style={tdStyle}>{item.doctor_name}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color:
                          item.Status === "Completed"
                            ? "green"
                            : item.Status === "Paid"
                            ? "blue"
                            : item.Status === "Due"
                            ? "orange"
                            : "red",
                      }}
                    >
                      {item.Status}
                    </td>
                    <td style={tdStyle}>{item.report_date}</td>
                  </tr>
                ))
              ))}

            {/* Department Summary Table */}
            {mode === "deptwise" &&
              (summaryData.Countdetails?.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", padding: "8px" }}
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                summaryData.Countdetails?.map((item, index) => (
                  <tr key={`dept-${index}`}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{item.Testname}</td>
                    <td style={tdStyle}>{item.Testcount}</td>
                  </tr>
                ))
              ))}

            {/* Specialization Mode Table */}
            {/* Specialization Mode Table */}
            {/* Specialization Mode Table - with better error handling */}
            {mode === "specialization" && (
              <>
                {Array.isArray(reportData) && reportData.length > 0 ? (
                  reportData
                    .map((specialization, specIndex) => {
                      try {
                        if (!specialization || !Array.isArray(specialization.Departments)) {
                          return null;
                        }
                        
                        return specialization.Departments.map((department, deptIndex) => {
                          if (!department || !Array.isArray(department.Tests)) {
                            return null;
                          }
                          
                          return department.Tests.map((test, testIndex) => {
                            const rowIndex = specIndex * 100 + deptIndex * 10 + testIndex + 1;
                            
                            return (
                              <tr key={`spec-${rowIndex}`}>
                                <td style={tdStyle}>{rowIndex}</td>
                                <td style={{ ...tdStyle, fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                                  {specialization.Specialization_Name || "N/A"}
                                </td>
                                <td style={{ ...tdStyle, backgroundColor: "#e9ecef" }}>
                                  {department.Department_Name || "N/A"}
                                </td>
                                <td style={tdStyle}>{test.Test_Name || "N/A"}</td>
                                <td style={{ ...tdStyle, fontWeight: "bold", textAlign: "center" }}>
                                  {test.Test_Count || 0}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center", color: "#6c757d" }}>
                                  {test.Request_Count || 0}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center", color: "#007bff" }}>
                                  {test.Paid_Count || 0}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center", color: "#fd7e14" }}>
                                  {test.Due_Count || 0}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center", color: "#6f42c1" }}>
                                  {test.Analyzed_Count || 0}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center", color: "#28a745" }}>
                                  {test.Completed_Count || 0}
                                </td>
                              </tr>
                            );
                          });
                        });
                      } catch (error) {
                        console.error("Error rendering specialization row:", error);
                        return null;
                      }
                    })
                    .flat(2)
                    .filter(row => row !== null)
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center", padding: "8px" }}>
                      No data found
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RadiologyReportsnew;
