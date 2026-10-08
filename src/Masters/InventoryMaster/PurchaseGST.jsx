import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";

const GST_Purchase_Report = () => {
  const fmt = (v) => Number(v || 0).toFixed(2);

  const [billRows, setBillRows] = useState([]);
  const [filters, setFilters] = useState({
    supplier: "",
    product: "",
    hsn: "",
    gst: "",
    start_date: "",
    end_date: "",
  });

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  // ====================================================
  // FETCH REPORT
  // ====================================================
  const [loading, setLoading] = useState();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${UrlLink}Inventory/GST_Purchase_Report_GST`, {
        params: filters,
      });

      let rows = res.data.data || [];

      const finalRows = rows.map((r) => ({
        bill_no: r.Bill_No,
        bill_date: r.Bill_Date,
        supplier: r.Supplier_Name,

        gst0: {
          tax: Number(r["0%_Amount"] || 0),
          gst: Number(r["0%_GST"] || 0),
        },

        gst5: {
          tax: Number(r["5%_Amount"] || 0),
          gst: Number(r["5%_GST"] || 0),
        },

      

        gst18: {
          tax: Number(r["18%_Amount"] || 0),
          gst: Number(r["18%_GST"] || 0),
        },

        net: Number(r.Net_Amount),
      }));

      setBillRows(finalRows);
      console.log("Final table rows:", finalRows);
    } catch (err) {
      console.log("Fetch error =>", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [filters]);

  // ====================================================
  // EXPORT EXCEL
  // ====================================================
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const sheet = [
      [
        "Bill No", "Bill Date", "Supplier",
        "0% Amount", "0% GST",
        "5% Amount", "5% GST",
      
        "18% Amount", "18% GST",
        "Net Total"
      ],
    ];

    billRows.forEach((r) => {
      sheet.push([
        r.bill_no,
        r.bill_date,
        r.supplier,

        fmt(r.gst0.tax),
        fmt(r.gst0.gst),

        fmt(r.gst5.tax),
        fmt(r.gst5.gst),



        fmt(r.gst18.tax),
        fmt(r.gst18.gst),

        fmt(r.net),
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheet);
    XLSX.utils.book_append_sheet(wb, ws, "GST Purchase");
    XLSX.writeFile(wb, "GST_Purchase_Report.xlsx");
  };

  // ====================================================
  // EXPORT PDF
  // ====================================================
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("GST Purchase Report", 14, 12);

    const tableData = billRows.map((r) => [
      r.bill_no,
      r.bill_date,
      r.supplier,

      fmt(r.gst0.tax),
      fmt(r.gst0.gst),

      fmt(r.gst5.tax),
      fmt(r.gst5.gst),

  

      fmt(r.gst18.tax),
      fmt(r.gst18.gst),

      fmt(r.net),
    ]);

    doc.autoTable({
      head: [
        [
          "Bill No", "Bill Date", "Supplier",
          "0% Amount", "0% GST",
          "5% Amount", "5% GST",
        
          "18% Amount", "18% GST",
          "Net"
        ],
      ],
      body: tableData,
      startY: 18,
      styles: { fontSize: 8 },
    });

    doc.save("GST_Purchase_Report.pdf");
  };

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // ====================================================
  // UI
  // ====================================================
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>GST Purchase Report</h2>

      {/* FILTER UI */}
      <div style={filterBox}>
        {["supplier", "product", "gst"].map((f) => (
          <input
            key={f}
            name={f}
            placeholder={f.toUpperCase()}
            onChange={handleFilterChange}
            style={inputStyle}
          />
        ))}

        <input type="date" name="start_date" onChange={handleFilterChange} style={inputStyle} />
        <input type="date" name="end_date" onChange={handleFilterChange} style={inputStyle} />

        <button style={buttonStyle} onClick={fetchReport}>Search</button>
        <button style={excelBtn} onClick={exportToExcel}>Excel</button>
        <button style={pdfBtn} onClick={exportToPDF}>PDF</button>
      </div>

      {/* TABLE */}
      <table style={table}>
        <thead>
          <tr>
            {[
              "Bill No", "Bill Date", "Supplier",
              "0% Amount", "0% GST",
              "5% Amount", "5% GST",
       
              "18% Amount", "18% GST",
              "Net",
            ].map((h) => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {billRows.length === 0 && (
            <tr>
              <td colSpan="12" style={noData}>No records found</td>
            </tr>
          )}

          {billRows.map((r, i) => (
            <tr key={i}>
              <td style={td}>{r.bill_no}</td>
              <td style={td}>{r.bill_date}</td>
              <td style={td}>{r.supplier}</td>

              <td style={td}>{fmt(r.gst0.tax)}</td>
              <td style={td}>{fmt(r.gst0.gst)}</td>

              <td style={td}>{fmt(r.gst5.tax)}</td>
              <td style={td}>{fmt(r.gst5.gst)}</td>

        

              <td style={td}>{fmt(r.gst18.tax)}</td>
              <td style={td}>{fmt(r.gst18.gst)}</td>

              <td style={td}>{fmt(r.net)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ====================== STYLES ======================
const filterBox = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "15px",
};

const inputStyle = {
  padding: "7px",
  border: "1px solid #bbb",
  borderRadius: "4px",
  minWidth: "140px",
};

const buttonStyle = {
  padding: "8px 14px",
  background: "#34495e",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const excelBtn = { ...buttonStyle, background: "#1abc9c" };
const pdfBtn = { ...buttonStyle, background: "#e74c3c" };

const table = { width: "100%", borderCollapse: "collapse", marginTop: "15px" };
const th = { border: "1px solid #ccc", padding: "8px", background: "#f3f3f3" };
const td = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
const noData = { padding: "10px", textAlign: "center", color: "gray" };

export default GST_Purchase_Report;
