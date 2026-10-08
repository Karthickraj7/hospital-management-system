import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";

const Sales_Statement = () => {
  const [billData, setBillData] = useState([]);
 const [totals, setTotals] = useState({
  gst_5: { amount: 0, gst: 0 },
  gst_18: { amount: 0, gst: 0 },
  gst_0: { amount: 0, gst: 0 },
  grand_total_amount: 0,
  grand_total_gst: 0,
  grand_total_net: 0
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    product: "",
    batch: "",
    gst: "",
    startDate: "",
    endDate: "",
    month: "",
    year: "",
    quarter: "",
  });

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const fetchGSTReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${UrlLink}Inventory/GST_Sales_Report`, {
        params: filters,
      });

      setBillData(res.data.bills || []);
      setTotals(res.data.totals || {});
    } catch (err) {
      setError("Failed loading report");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGSTReport();
  }, [filters]);

  // ----------------- EXPORT TO EXCEL -----------------
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const excelData = [];

    excelData.push([
      "Invoice",
      "Patient Name",
      "Bill Date",
      "Amount",
      "5% GST",
      "Amount",
      "18% GST",
      "Amount",
      "0% GST",
      "Net Amount",
    ]);

    billData.forEach((b) => {
      excelData.push([
        b.invoice_no,
        b.patient_name,
        b.bill_date,
        b.gst_5.amount,
        b.gst_5.gst,
        b.gst_18.amount,
        b.gst_18.gst,
        b.gst_0.amount,
        b.gst_0.gst,
        b.net_amount,
      ]);
    });

    // Add Grand Totals
    excelData.push([]);
    excelData.push([
      "TOTAL",
      "",
      "",
      totals.gst_5?.amount,
      totals.gst_5?.gst,
      totals.gst_18?.amount,
      totals.gst_18?.gst,
      totals.gst_0?.amount,
      totals.gst_0?.gst,
      totals.grand_total_net,
    ]);

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Bill GST Report");
    XLSX.writeFile(wb, "GST_Bill_Report.xlsx");
  };

  // ----------------- EXPORT PDF -----------------
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("GST Bill-Wise Report", 14, 16);

    const rows = billData.map((b) => [
      b.invoice_no,
      b.patient_name,
      b.bill_date,
      b.gst_5.amount,
      b.gst_5.gst,
      b.gst_18.amount,
      b.gst_18.gst,
      b.gst_0.amount,
      b.gst_0.gst,
      b.net_amount,
    ]);

    doc.autoTable({
      head: [
        [
          "Invoice",
          "Patient",
          "Date",
          "Amt",
          "5% GST",
          "Amt",
          "18% GST",
          "Amt",
          "0% GST",
          "Net Amt",
        ],
      ],
      body: rows,
      startY: 25,
    });

    // Add totals
    doc.text(`Grand Total Amount: ${totals.grand_total_amount}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Grand Total GST: ${totals.grand_total_gst}`, 14, doc.lastAutoTable.finalY + 17);
    doc.text(`Grand Net Total: ${totals.grand_total_net}`, 14, doc.lastAutoTable.finalY + 24);

    doc.save("GST_Bill_Report.pdf");
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Bill Wise GST Report
      </h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <input name="product" placeholder="Product" onChange={handleFilterChange} style={inputStyle} />
        <input name="gst" placeholder="GST %" onChange={handleFilterChange} style={inputStyle} />
        <input type="date" name="startDate" onChange={handleFilterChange} style={inputStyle} />
        <input type="date" name="endDate" onChange={handleFilterChange} style={inputStyle} />

        <button onClick={fetchGSTReport} style={buttonStyle}>Refresh</button>
        <button onClick={exportToExcel} style={buttonStyle}>Excel</button>
        <button onClick={exportToPDF} style={buttonStyle}>PDF</button>
      </div>

      <br />

      {/* TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Invoice</th>
            <th style={th}>Patient</th>
            <th style={th}>Date</th>
            <th style={th}> Amount</th>
            <th style={th}>5% GST</th>
            <th style={th}> Amount</th>
            <th style={th}>18% GST</th>
            <th style={th}>Amount</th>
            <th style={th}>0% GST</th>
            <th style={th}>Net Amount</th>
          </tr>
        </thead>

        <tbody>
          {billData.map((b, i) => (
            <tr key={i}>
              <td style={td}>{b.invoice_no}</td>
              <td style={td}>{b.patient_name}</td>
              <td style={td}>{b.bill_date}</td>
              <td style={td}>{b.gst_5.amount}</td>
              <td style={td}>{b.gst_5.gst}</td>
              <td style={td}>{b.gst_18.amount}</td>
              <td style={td}>{b.gst_18.gst}</td>
              <td style={td}>{b.gst_0.amount}</td>
              <td style={td}>{b.gst_0.gst}</td>
              <td style={td}>{b.net_amount}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr style={{ background: "#ddd", fontWeight: "bold" }}>
            <td style={td} colSpan="3">TOTAL</td>
            <td style={td}>{totals.gst_5?.amount}</td>
            <td style={td}>{totals.gst_5?.gst}</td>
            <td style={td}>{totals.gst_18?.amount}</td>
            <td style={td}>{totals.gst_18?.gst}</td>
            <td style={td}>{totals.gst_0?.amount}</td>
            <td style={td}>{totals.gst_0?.gst}</td>
            <td style={td}>{totals.grand_total_net}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const th = { border: "1px solid #ccc", padding: "8px", background: "#f0f0f0" };
const td = { border: "1px solid #ccc", padding: "8px" };

const inputStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  width: "150px"
};

const buttonStyle = {
  padding: "8px 15px",
  background: "#34495e",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Sales_Statement;
