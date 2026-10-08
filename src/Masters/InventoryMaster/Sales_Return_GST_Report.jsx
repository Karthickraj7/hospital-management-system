import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";

const Sales_Return_GST_Report = () => {
  const [refundData, setRefundData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    voucher: "",
    patient: "",
    gst: "",
    start_date: "",
    end_date: "",
    month: "",
    year: "",
    quarter: ""
  });

  const [totals, setTotals] = useState({
    "5%": { amount: 0, gst: 0 },
    "18%": { amount: 0, gst: 0 },
    "0%": { amount: 0, gst: 0 },
    grand_total_amount: 0,
    grand_total_gst: 0,
    grand_total_with_gst: 0
  });

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  // -------------------- Fetch Refund Report with Filters --------------------
  const fetchRefundReport = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        )
      ).toString();

      const res = await axios.get(`${UrlLink}Inventory/GST_Refund_Report?${query}`);
      setRefundData(res.data.refunds || []);
      setTotals(res.data.totals || {});
    } catch (err) {
      console.log("Refund GST Load Error", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRefundReport();
  }, []);

  // -------------------- Export Excel --------------------
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const excelData = [];

    excelData.push([
      "Voucher No",
      "Patient",
      "Date",
      "Amount",
      "5% GST",
      "Amount",
      "18% GST",
      "Amount",
      "0% GST",
      "Total Refund"
    ]);

    refundData.forEach((r) => {
      excelData.push([
        r.voucher_no,
        r.patient_name,
        r.billing_date,
        r.gst_5?.amount,
        r.gst_5?.gst,
        r.gst_18?.amount,
        r.gst_18?.gst,
        r.gst_0?.amount,
        r.gst_0?.gst,
        r.total_refund
      ]);
    });

    excelData.push([]);
    excelData.push([
      "TOTAL",
      "",
      "",
      totals["5%"]?.amount,
      totals["5%"]?.gst,
      totals["18%"]?.amount,
      totals["18%"]?.gst,
      totals["0%"]?.amount,
      totals["0%"]?.gst,
      totals.grand_total_with_gst
    ]);

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Refund GST Report");
    XLSX.writeFile(wb, "Refund_GST_Report.xlsx");
  };

  // -------------------- Export PDF --------------------
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("GST Refund Report", 14, 16);

    const rows = refundData.map((r) => [
      r.voucher_no,
      r.patient_name,
      r.billing_date,
      r.gst_5.amount,
      r.gst_5.gst,
      r.gst_18.amount,
      r.gst_18.gst,
      r.gst_0.amount,
      r.gst_0.gst,
      r.total_refund
    ]);

    doc.autoTable({
      head: [
        [
          "Voucher", "Patient", "Date", "Amt", "5% GST",
          "Amt", "18% GST", "Amt", "0% GST", "Refund Amt"
        ],
      ],
      body: rows,
      startY: 25,
    });

    doc.text(`Total Amount: ${totals.grand_total_amount}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total GST: ${totals.grand_total_gst}`, 14, doc.lastAutoTable.finalY + 17);
    doc.text(`Grand Total: ${totals.grand_total_with_gst}`, 14, doc.lastAutoTable.finalY + 24);

    doc.save("Refund_GST_Report.pdf");
  };

  // -------------------- STYLES --------------------
  const filterBarStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "20px"
  };

  const inputStyle = {
    // padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
    fontSize: "14px"
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Refund GST Report
      </h2>

      {/* -------------------- FILTERS -------------------- */}
      <div style={filterBarStyle}>
        <input
          style={inputStyle}
          type="text"
          placeholder="Voucher No"
          value={filters.voucher}
          onChange={(e) => setFilters({ ...filters, voucher: e.target.value })}
        />

        <input
          style={inputStyle}
          type="text"
          placeholder="Patient Name"
          value={filters.patient}
          onChange={(e) => setFilters({ ...filters, patient: e.target.value })}
        />

        <select
          style={inputStyle}
          value={filters.gst}
          onChange={(e) => setFilters({ ...filters, gst: e.target.value })}
        >
          <option value="">GST%</option>
          <option value="0">0%</option>
          <option value="5">5%</option>
          <option value="18">18%</option>
        </select>

        <input
          style={inputStyle}
          type="date"
          value={filters.start_date}
          onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
        />

        <input
          style={inputStyle}
          type="date"
          value={filters.end_date}
          onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
        />

        <select
          style={inputStyle}
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        >
          <option value="">Month</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <input
          style={inputStyle}
          type="number"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />

        <select
          style={inputStyle}
          value={filters.quarter}
          onChange={(e) => setFilters({ ...filters, quarter: e.target.value })}
        >
          <option value="">Quarter</option>
          <option value="1">Q1 (Jan–Mar)</option>
          <option value="2">Q2 (Apr–Jun)</option>
          <option value="3">Q3 (Jul–Sep)</option>
          <option value="4">Q4 (Oct–Dec)</option>
        </select>
      </div>

      {/* -------------------- BUTTONS -------------------- */}
      <div style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        <button onClick={fetchRefundReport} style={buttonStyle}>Search</button>
        <button onClick={exportToExcel} style={buttonStyle}>Excel</button>
        <button onClick={exportToPDF} style={buttonStyle}>PDF</button>
        <button
          onClick={() => {
            setFilters({
              voucher: "", patient: "", gst: "",
              start_date: "", end_date: "",
              month: "", year: "", quarter: ""
            });
            fetchRefundReport();
          }}
          style={{ ...buttonStyle, background: "#7f8c8d" }}
        >
          Reset
        </button>
      </div>

      {/* -------------------- TABLE -------------------- */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Voucher</th>
            <th style={th}>Patient</th>
            <th style={th}>Date</th>
            <th style={th}>Amount</th>
            <th style={th}>5% GST</th>
            <th style={th}>Amount</th>
            <th style={th}>18% GST</th>
            <th style={th}>Amount</th>
            <th style={th}>0% GST</th>
            <th style={th}>Refund Amount</th>
          </tr>
        </thead>

        <tbody>
          {refundData.map((r, i) => (
            <tr key={i}>
              <td style={td}>{r.voucher_no}</td>
              <td style={td}>{r.patient_name}</td>
              <td style={td}>{r.billing_date}</td>
              <td style={td}>{r.gst_5.amount}</td>
              <td style={td}>{r.gst_5.gst}</td>
              <td style={td}>{r.gst_18.amount}</td>
              <td style={td}>{r.gst_18.gst}</td>
              <td style={td}>{r.gst_0.amount}</td>
              <td style={td}>{r.gst_0.gst}</td>
              <td style={td}>{r.total_refund}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr style={{ background: "#ddd", fontWeight: "bold" }}>
            <td style={td} colSpan="3">TOTAL</td>
            <td style={td}>{totals["5%"].amount}</td>
            <td style={td}>{totals["5%"].gst}</td>
            <td style={td}>{totals["18%"].amount}</td>
            <td style={td}>{totals["18%"].gst}</td>
            <td style={td}>{totals["0%"].amount}</td>
            <td style={td}>{totals["0%"].gst}</td>
            <td style={td}>{totals.grand_total_with_gst}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const th = { border: "1px solid #ccc", padding: "8px", background: "#f0f0f0" };
const td = { border: "1px solid #ccc", padding: "8px" };

const buttonStyle = {
  padding: "8px 15px",
  background: "#34495e",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Sales_Return_GST_Report;
