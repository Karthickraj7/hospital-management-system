import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Dialog, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NewPayroll = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [employees, setEmployees] = useState([]);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedMonth || !selectedYear) return;
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get(
          `${UrlLink}HR_Management/get_employee_monthwise_payment`,
          { params: { month: selectedMonth, year: selectedYear } }
        );
        setEmployees(data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, [selectedMonth, selectedYear, UrlLink]);

  // Extract all unique departments
  const allDepartments = [...new Set(employees.flatMap(emp => emp.Departments))].sort();

  // Filter employees by search and department
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment ? emp.Departments.includes(selectedDepartment) : true;
    return matchesSearch && matchesDept;
  });

  const formatSalary = (amount) =>
    amount ? (amount >= 100000 ? (amount / 100000).toFixed(1) + " Lakhs" : amount.toLocaleString()) : 0;

  const ExportToPdf = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const tableColumn = ["Employee","Month","Basic Salary","Earned Salary","PF","PT","TDS","Net Payable","Status","Department"];
    const rows = filteredEmployees.map(emp => [
      emp.EmployeeName, emp.Month, emp.BasicSalary, emp.EarnedSalary, emp.PF, emp.PT, emp.TDS, emp.NetPayable, emp.Status || "Pending", emp.Departments.join(", ")
    ]);
    doc.autoTable({ head: [tableColumn], body: rows, startY: 20, theme: "grid" });
    doc.save("PayRollReport.pdf");
  };

  const ExportToExcel = () => {
    const worksheetData = [
      ["Employee","Month","Basic Salary","Earned Salary","PF","PT","TDS","Net Payable","Status","Department"],
      ...filteredEmployees.map(emp => [
        emp.EmployeeName, emp.Month, emp.BasicSalary, emp.EarnedSalary, emp.PF, emp.PT, emp.TDS, emp.NetPayable, emp.Status || "Pending", emp.Departments.join(", ")
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Report");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "PayRollReport.xlsx");
  };

  const GenerateSlip = (employee) => {
    dispatch({ type: "EmployeePaySlipData", value: employee });
    navigate("/Home/PaySlip");
  };

  // Modern styles
  const styles = {
    container: {
      maxWidth: "1300px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Roboto', sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "25px",
      fontSize: "2rem",
      fontWeight: 700,
      color: "#2c3e50",
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    },
    filters: {
      display: "flex",
      flexWrap: "wrap",
      gap: "15px",
      marginBottom: "20px",
      justifyContent: "center",
      alignItems: "center",
    },
    select: {
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      background: "#f0f4f7",
      color: "#2c3e50",
      transition: "0.3s",
    },
    exportBtn: {
      padding: "8px 20px",
      borderRadius: "8px",
      border: "none",
      background: "linear-gradient(45deg, #b4adbb25, #1e1e1fff)",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
      transition: "0.3s",
    },
    searchInput: {
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      flexGrow: 1,
      minWidth: "50px",
      maxWidth: "220px",
      outline: "none",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    },
    card: {
      borderRadius: "12px",
      padding: "18px",
      background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition: "0.3s",
    },
    actionBtn: {
      padding: "5px 10px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#1abc9c",
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "0.3s",
    },
    noData: { textAlign: "center", marginTop: "30px", color: "#7f8c8d", fontSize: "1rem" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Employee Payroll Dashboard</h2>

      <div style={styles.filters}>
        <select  onChange={e => setSelectedMonth(e.target.value)}>
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select  onChange={e => setSelectedYear(e.target.value)}>
          <option value="">Select Year</option>
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select  onChange={e => setSelectedDepartment(e.target.value)} value={selectedDepartment}>
          <option value="">All Departments</option>
          {allDepartments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by employee name"
          style={styles.searchInput}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <button style={styles.exportBtn} onClick={() => setSwapDialogOpen(true)}>Export</button>
      </div>

      {/* Grid cards for responsive display */}
      <div style={styles.cardGrid}>
        {filteredEmployees.map(emp => (
          <div
            key={emp.Employee_ID}
            style={styles.card}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <p><strong>Employee:</strong> {emp.EmployeeName}</p>
            <p><strong>Department:</strong> {emp.Departments.join(", ")}</p>
            <p><strong>Month:</strong> {emp.Month}</p>
            <p><strong>Salary:</strong> ₹{emp.Salary}</p>
            <p><strong>Basic Salary:</strong> ₹{emp.BasicSalary}</p>
            <p><strong>Earned Salary:</strong> ₹{emp.earnings}</p>
            <p><strong>Allowance:</strong> ₹{emp.Allowance}</p>
            <p><strong>PF:</strong> ₹{emp.PfForEmployee_Amount}, <strong>PT:</strong> ₹{emp.ProfessionalTax}, <strong>TDS:</strong> ₹{emp.TDS_Amount}</p>
            <p><strong>Net Payable:</strong> ₹{formatSalary(emp.NetSalary)}</p>
            <p><strong>Status:</strong> {emp.Status || "Pending"}</p>
            <button style={{ ...styles.actionBtn, marginTop: "8px" }} onClick={() => GenerateSlip(emp)}>
              <ReceiptIcon fontSize="small" style={{ marginRight: "5px" }} /> Generate Slip
            </button>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && <p style={styles.noData}>No data found</p>}

      <Dialog open={swapDialogOpen} onClose={() => setSwapDialogOpen(false)} maxWidth="sm">
        <DialogActions style={{ justifyContent: "center", padding: "20px" }}>
          <Button variant="contained" onClick={ExportToPdf} style={{ margin: "0 10px" }}>PDF</Button>
          <Button variant="contained" onClick={ExportToExcel} style={{ margin: "0 10px" }}>Excel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewPayroll;
