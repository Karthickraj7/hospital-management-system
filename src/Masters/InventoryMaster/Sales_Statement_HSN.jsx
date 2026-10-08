

import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";

const Sales_Statement_HSN = () => {
  const [gstReport, setGstReport] = useState({
    "5%": {},
    "18%": {},
    "0%": {}
  });

  const [grandTotals, setGrandTotals] = useState({});
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [loading, setLoading] = useState(false);
// FILTER STATES
const [filters, setFilters] = useState({
  product: "",
  batch: "",
  gst: "",
  start_date: "",
  end_date: "",
  month: "",
  year: "",
  quarter: ""
});

const loadHSNReport = async () => {
  setLoading(true);
  try {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      )
    ).toString();

    const res = await axios.get(`${UrlLink}Inventory/HSN_Sales_Report?${query}`);
    setGstReport(res.data.GST_Report);
    setGrandTotals(res.data.grand_totals);
  } catch (err) {
    console.error("HSN Report Load Error", err);
  }
  setLoading(false);
};

  useEffect(() => {
    loadHSNReport();
  }, []);

  // ----------------- EXPORT EXCEL -----------------
 const exportExcel = () => {
  const wb = XLSX.utils.book_new();

  Object.keys(gstReport).forEach((gstKey) => {
    const wsData = [];

    // -------- Title Like PDF --------
    wsData.push([`${gstKey} GST ITEMS`]);
    wsData.push([]); // empty row

    wsData.push(["HSN", "Item Name", "Product Type", "Qty", "Taxable", "CGST", "SGST", "GST Total", "CESS"]);

    gstReport[gstKey]?.items?.forEach((item) => {
      wsData.push([
        item.HSN,
        item.itemName,
        item.product_type,
        item.qty,
        item.taxable,
        item.CGST,
        item.SGST,
        (item.CGST + item.SGST).toFixed(2),
        0.0
      ]);
    });

    wsData.push([]);
    wsData.push([`Total Summary for ${gstKey}`]);
    wsData.push(["Total Qty", gstReport[gstKey].total_qty]);
    wsData.push(["Total Taxable", gstReport[gstKey].total_taxable]);
    wsData.push(["Total CGST", gstReport[gstKey].total_cgst]);
    wsData.push(["Total SGST", gstReport[gstKey].total_sgst]);
    wsData.push(["Total GST", gstReport[gstKey].total_gst]);
    wsData.push(["Total CESS", "0.00"]);
    wsData.push([]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, `${gstKey} GST`);
  });

  XLSX.writeFile(wb, "Sales_Return_HSN_Report.xlsx");
};


  // ----------------- EXPORT PDF -----------------
const exportPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Sales Return HSN Report", 14, 16);

  let startY = 25;

  Object.keys(gstReport).forEach((gstKey) => {
    doc.setFontSize(12);
    doc.text(`${gstKey} Summary`, 14, startY);

    // Item rows only (NO TOTAL ROWS here)
    const tableBody = gstReport[gstKey].items.map((i) => [
      i.HSN,
      i.itemName,
      i.product_type,
      i.qty,
      i.taxable,
      i.CGST,
      i.SGST,
      (i.CGST + i.SGST).toFixed(2),
      "0.00"
    ]);

    doc.autoTable({
      startY: startY + 5,
      head: [["HSN", "Item", "Type", "Qty", "Taxable", "CGST", "SGST", "GST", "CESS"]],
      body: tableBody,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [230, 230, 230] },
    });

    let y = doc.lastAutoTable.finalY + 6;

    // TOTALS (outside table — no lines)
    doc.setFontSize(11);
    doc.text(`Total Qty          : ${gstReport[gstKey].total_qty}`, 14, y); y += 6;
    doc.text(`Total Taxable      : ${gstReport[gstKey].total_taxable}`, 14, y); y += 6;
    doc.text(`Total CGST         : ${gstReport[gstKey].total_cgst}`, 14, y); y += 6;
    doc.text(`Total SGST         : ${gstReport[gstKey].total_sgst}`, 14, y); y += 6;
    doc.text(`Total GST          : ${gstReport[gstKey].total_gst}`, 14, y); y += 6;
    doc.text(`Total CESS         : 0.00`, 14, y);

    startY = y + 12;
  });

  doc.save("Sales_Return_HSN_Report.pdf");
};


  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Sales Return HSN Report
      </h2>

<div style={filterBarStyle}>
  <input
    style={inputStyle}
    type="text"
    placeholder="Product"
    value={filters.product}
    onChange={(e) => setFilters({ ...filters, product: e.target.value })}
  />

  <input
    style={inputStyle}
    type="text"
    placeholder="Batch"
    value={filters.batch}
    onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
  />

  <select
    style={inputStyle}
    value={filters.gst}
    onChange={(e) => setFilters({ ...filters, gst: e.target.value })}
  >
    <option value="">GST</option>
    <option value="0">0%</option>
    <option value="5">5%</option>
    <option value="12">12%</option>
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
      <option key={i+1} value={i+1}>{i+1}</option>
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
<div style={{
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  justifyContent: "center",
  marginBottom: "20px"
}}>
  <button onClick={loadHSNReport} style={buttonStyle}>Search</button>
  <button onClick={exportExcel} style={buttonStyle}>Excel</button>
  <button onClick={exportPDF} style={buttonStyle}>PDF</button>
  <button 
    onClick={() => { 
      setFilters({
        product: "", batch: "", gst: "", 
        start_date: "", end_date: "",
        month: "", year: "", quarter: ""
      });
      loadHSNReport();
    }} 
    style={{ ...buttonStyle, background: "#7f8c8d" }}
  >
    Reset
  </button>
</div>


      <br />

      {/* ------------ GST CATEGORY TABLES ------------ */}
      {["5%", "18%", "0%"].map((gst) => (
        <div key={gst} style={{ marginBottom: "40px" }}>
          <h3 style={{ background: "#34495e", color: "#fff", padding: "10px" }}>
            {gst} GST ITEMS
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>HSN</th>
                <th style={th}>Item Name</th>
                <th style={th}>Product Type</th>
                <th style={th}>Qty</th>
                <th style={th}>Taxable</th>
                <th style={th}>CGST</th>
                <th style={th}>SGST</th>
                <th style={th}>GST Total</th>
                <th style={th}>CESS</th>
              </tr>
            </thead>

            <tbody>
              {gstReport[gst]?.items?.map((item, index) => (
                <tr key={index}>
                  <td style={td}>{item.HSN}</td>
                  <td style={td}>{item.itemName}</td>
                  <td style={td}>{item.product_type}</td>
                  <td style={td}>{item.qty}</td>
                  <td style={td}>{item.taxable}</td>
                  <td style={td}>{item.CGST}</td>
                  <td style={td}>{item.SGST}</td>
                  <td style={td}>{(item.CGST + item.SGST).toFixed(2)}</td>
                  <td style={td}>0.0</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr style={{ background: "#ddd", fontWeight: "bold" }}>
                <td style={td} colSpan="3">TOTAL</td>
                <td style={td}>{gstReport[gst].total_qty}</td>
                <td style={td}>{gstReport[gst].total_taxable}</td>
                <td style={td}>{gstReport[gst].total_cgst}</td>
                <td style={td}>{gstReport[gst].total_sgst}</td>
                <td style={td}>{gstReport[gst].total_gst}</td>
                <td style={td}>0.0</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}

      {/* ------------ GRAND TOTALS ------------ */}
      <h3 style={{ textAlign: "center", marginTop: "40px" }}>GRAND TOTALS</h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Total Qty</th>
            <th style={th}>Total Taxable</th>
            <th style={th}>Total CGST</th>
            <th style={th}>Total SGST</th>
            <th style={th}>Total GST</th>
            <th style={th}>Total with GST</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ background: "#eee", fontWeight: "bold" }}>
            <td style={td}>{grandTotals.grand_qty}</td>
            <td style={td}>{grandTotals.grand_taxable}</td>
            <td style={td}>{grandTotals.grand_cgst}</td>
            <td style={td}>{grandTotals.grand_sgst}</td>
            <td style={td}>{grandTotals.grand_gst}</td>
            <td style={td}>{grandTotals.grand_with_gst}</td>
          </tr>
        </tbody>
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

const filterBarStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginBottom: "20px",
};

const inputStyle = {
//   padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  width: "100%",
  fontSize: "14px",
};


export default Sales_Statement_HSN;
