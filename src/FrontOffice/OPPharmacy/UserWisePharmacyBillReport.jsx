import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import { SearchIcon } from "lucide-react";

function UserWisePharmacyBillReport() {
  const [period, setPeriod] = useState("daily");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All"); // 🔹 Status filter
  const [reportData, setReportData] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [userId, setUserId] = useState("all");
  const [doctorId, setdoctorId] = useState("all")
  const [patient, setPatient] = useState("")
  const [produ, setProdu] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  // Fetch Report Data
const fetchReportData = async () => {
  setLoading(true);
  setError("");
  try {
    const params = {};

    // Regular filters
    if (department && department !== "All") params.department = department;
    if (userId && userId !== "all") params.user_id = userId;
    if (doctorId && doctorId !== "all") params.doc_Id = doctorId;
    if (patient) params.patient = patient;
    if (produ) params.prod = produ;

    // Date / period filters
    if (period === "daily" && startDate) {
      params.type = "daily";
      params.start_date = startDate;
      params.end_date = startDate;
    } else if (period === "weekly" && startDate && endDate) {
      params.type = "weekly";
      params.start_date = startDate;
      params.end_date = endDate;
    } else if (period === "monthly" && month && year) {
      params.type = "monthly";
      params.month = month;
      params.year = year;
    }

    let data = [];

    if (status === "Refunded") {
      // For refunded bills, remove status from params if backend doesn't need it
      const refundedParams = { ...params }; 
      delete refundedParams.status; // avoid sending status to refunded API
      const response = await axios.get(
        `${UrlLink}DrugAdminstrations/get_refunded_pharmacy_bills`,
        { params: refundedParams }
      );
      data = Array.isArray(response.data) ? response.data : [];
    } else {
      // Include status for non-refunded bills
      if (status && status !== "All") params.status = status;

      const response = await axios.get(
        `${UrlLink}DrugAdminstrations/user_wise_pharmacy_bill_report`,
        { params }
      );
      data = Array.isArray(response.data) ? response.data : [];
    }

    // Set report data
    setReportData(data);

    // Extract unique users
    const uniqueUsers = [
      ...new Map(data.map((d) => [d.user, { id: d.user, name: d.user }])).values(),
    ];
    setUsers(uniqueUsers);

    // Extract unique doctors
    const allDoctors = data.flatMap(d => d.bills.map(bill => ({ id: bill.DoctorId, name: bill.Doctor })));
    const uniqueDoctors = [...new Map(allDoctors.map(d => [d.id, d])).values()];
    setDoctors(uniqueDoctors);

  } catch (err) {
    setError(err.response?.data?.error || "Error fetching report data");
  } finally {
    setLoading(false);
  }
};



  console.log("Count--------", doctorId);



  useEffect(() => {
    fetchReportData();
  }, []);


  const [totalPaid, setTotalPaid] = useState(0)
  const [totalDue, setTotalDue] = useState(0)
  const [totalPending, setTotalPending] = useState(0)
  useEffect(() => {
    // Totals by status
    const Paid = reportData.flatMap(r => r.bills).filter(b => b.Bill_Status === "Paid")
      .reduce((sum, b) => sum + parseFloat(b.Paid_Amount || 0), 0);
    setTotalPaid(Paid)
    const Due = reportData.flatMap(r => r.bills).filter(b => b.Bill_Status === "Due")
      .reduce((sum, b) => sum + parseFloat(b.Paid_Amount || 0), 0);
    setTotalDue(Due)
    const Pending = reportData.flatMap(r => r.bills).filter(b => b.Bill_Status === "Pending")
      .reduce((sum, b) => sum + parseFloat(b.Paid_Amount || 0), 0);
    setTotalPending(Pending)
  }, [reportData])

  // Export Excel
  const exportToExcel = () => {
    const rows = reportData.flatMap((r) =>
      r.bills.map((b) => ({
        Date: b.Billing_Date,
        User: r.user,
        Department: r.department,
        Invoice: b.Billing_Invoice_No,
        PatientId: b.PatientId,
        PatientName: b.PatientName,
        Phone: b.PhoneNo,
        Category: b.PatientCate,
        Doctor: b.Doctor,
        Speciality: b.Speciality,
        Status: b.Bill_Status,
        Amount: b.Paid_Amount,
      }))
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UserWiseReport");
    XLSX.writeFile(wb, `UserWisePharmacyBill_${period}.xlsx`);
  };

  // Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`User Wise Pharmacy Bill Report - ${period}`, 14, 16);
    const tableColumn = ["Date", "User", "Department", "Invoice", "PatientId","PatientName","Phone","Category","Doctor","Speciality", "Status", "Amount"];
    const tableRows = reportData.flatMap((r) =>
      r.bills.map((b) => [b.Billing_Date, r.user, r.department, b.Billing_Invoice_No,b.PatientId,b.PatientName,  b.PhoneNo, b.PatientCate, b.Doctor, b.Speciality, b.Bill_Status, b.Paid_Amount])
    );
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`UserWisePharmacyBill_${period}.pdf`);
  };

  // Print
  const printReport = () => {
    const tableContent = document.getElementById("report-table").outerHTML;
    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>User Wise Pharmacy Bill Report</title>
          <style>
            body { font-family: Arial; margin: 10px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>User Wise Pharmacy Bill Report - ${period}</h2>
          <div >Total Paid: ${totalPaid.toFixed(2)}</div>
          <div>Total Due: ${totalDue.toFixed(2)}</div>
          <div>Total Pending: ${totalPending.toFixed(2)}</div>
          ${tableContent}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.print();
    newWin.close();
  };

  // Styles
  const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "20px" };
  const headerStyle = { fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" };
  const filterContainer = { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px", justifyContent: "center" };
  const inputStyle = { border: "1px solid #ccc", padding: "5px", borderRadius: "4px", width: "150px" };
  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  });
  const tableContainer = { overflowX: "auto" };
  const tableStyle = { minWidth: "100%", borderCollapse: "collapse", border: "1px solid #ccc" };
  const thStyle = { border: "1px solid #ccc", padding: "4px", backgroundColor: "#f0f0f0", textAlign: "start", minWidth: "90px" };
  const tdStyle = { border: "1px solid #ccc", padding: "4px", textAlign: "start", fontSize: "12px", minWidth: "90px" };
const [totalRefund, setTotalRefund] = useState(0);

useEffect(() => {
  // Sum all total_amounts from each user to get the total refund
  const refundAmount = reportData.reduce((sum, user) => sum + (user.total_amount || 0), 0);
  setTotalRefund(refundAmount);
}, [reportData]);

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>User Wise Pharmacy Bill Report</h2>

      {/* Filters */}
      <div style={filterContainer}>
        <div>
          <label>User:</label>
          <select value={userId} onChange={(e) => setUserId(e.target.value)} style={inputStyle}>
            <option value="all">All Users</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        <div>
          <label>Doctors:</label>
          <select value={doctorId} onChange={(e) => setdoctorId(e.target.value)} style={inputStyle}>
            <option value="all">All Doctors</option>
            {doctors.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label>Patients:</label>
          <input value={patient} onChange={(e) => setPatient(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label>Product:</label>
          <input value={produ} onChange={(e) => setProdu(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label>Period:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} style={inputStyle}>
            <option value="all">All</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label>Department:</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle}>
            <option value="All">All</option>
            <option value="iPharmacy">IP Pharmacy</option>
            <option value="focPharmacy">FOC Pharmacy</option>
            <option value="oPharmacy"> OP Pharmacy</option>
          </select>
        </div>

        {/* 🔹 Status Filter */}
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        {/* Conditional Date Inputs */}
        {period === "daily" && <div><label>Date:</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} /></div>}
        {period === "weekly" && <>
          <div><label>Start Date:</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} /></div>
          <div><label>End Date:</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} /></div>
        </>}
        {period === "monthly" && <>
          <div><label>Month:</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle}>
              {[...Array(12).keys()].map(m => <option key={m + 1} value={m + 1}>{new Date(0, m).toLocaleString("default", { month: "long" })}</option>)}
            </select>
          </div>
          <div><label>Year:</label><input type="number" value={year} onChange={(e) => setYear(e.target.value)} style={inputStyle} /></div>
        </>}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "5px", alignItems: "flex-end" }}>
          <button onClick={fetchReportData} style={buttonStyle("#5e6a8a")}><SearchIcon size={16} /></button>
          <button onClick={exportToExcel} style={buttonStyle("#649c79")}>Excel</button>
          <button onClick={exportToPDF} style={buttonStyle("#8f6262")}>PDF</button>
          <button onClick={printReport} style={buttonStyle("#947c52")}>Print</button>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      {/* Totals */}
   <div style={{ fontWeight: "bold", backgroundColor: "#e0e0e0", display: "flex", justifyContent: "space-between", padding: "8px" }}>
  <span>Total Paid: {totalPaid.toFixed(2)}</span>
  <span>Total Due: {totalDue.toFixed(2)}</span>
  <span>Total Pending: {totalPending.toFixed(2)}</span>
  <span>Total Refund: {totalRefund.toFixed(2)}</span> {/* 🔹 New */}
</div>


      {/* Table */}
      <div style={tableContainer}>
        <table id="report-table" style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>User</th>
              {/* <th style={thStyle}>Department</th> */}
              <th style={thStyle}>Invoice</th>
              <th style={thStyle}>Patient Id</th>
              <th style={thStyle}>Patient Name</th>
              <th style={thStyle}>PhoneNo</th>
              <th style={thStyle}>Category</th>
              {/* <th style={thStyle}>SubCategory</th> */}
              <th style={thStyle}>Doctor</th>
              <th style={thStyle}>Speciality</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "8px" }}>No data found</td></tr>
            ) : (
              reportData.flatMap((r) =>
                r.bills
                  .filter(b => status === "All" || b.Bill_Status === status)
                  .map((b, idx) => (
                    <tr key={`${r.user}-${idx}`}>
                      <td style={tdStyle}>{b.Billing_Date}</td>
                      <td style={tdStyle}>{r.user}</td>
                      {/* <td style={tdStyle}>{r.department}</td> */}
                      <td style={tdStyle}>{b.Billing_Invoice_No}</td>
                      <td style={tdStyle}>{b.PatientId}</td>
                      <td style={tdStyle}>{b.PatientName}</td>
                      <td style={tdStyle}>{b.PhoneNo}</td>
                      <td style={tdStyle}>{b.Categoryname}</td>
                      {/* <td style={tdStyle}>{b.InsureType}</td> */}
                      <td style={tdStyle}>{b.Doctor}</td>
                      <td style={tdStyle}>{b.Speciality}</td>
                      <td style={{ ...tdStyle, color: b.Bill_Status === "Paid" ? "green" : b.Bill_Status === "Due" ? "orange" : "red" }}>
                        {b.Bill_Status}
                      </td>
                      <td style={tdStyle}>{b.Paid_Amount}</td>
                    </tr>
                  ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserWisePharmacyBillReport;
