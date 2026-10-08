import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";

const Sales_Return_HSN_Report = () => {
  const [gstReport, setGstReport] = useState({
    "5%": {},
    "18%": {},
    "0%": {},
  });
  const [grandTotals, setGrandTotals] = useState({});
  const [loading, setLoading] = useState(false);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  // Filter states
  const [filters, setFilters] = useState({
    hsn: "",
    itemName: "",
    productType: "",
    gst: "",
    startDate: "",
    endDate: "",
  });

  // Fetch report with filters
  const loadHSNReport = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`${UrlLink}Inventory/Sales_Return_HSN_Report?${query}`);
      setGstReport(res.data.GST_Report);
      setGrandTotals(res.data.grand_totals);
    } catch (err) {
      console.error("HSN Report Load Error", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHSNReport();
  }, [filters]);

  // ----------------- EXPORT EXCEL -----------------
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    Object.keys(gstReport).forEach((gstKey) => {
      const wsData = [];

      wsData.push([
        "HSN",
        "Item Name",
        "Product Type",
        "Qty",
        "Taxable",
        "CGST",
        "SGST",
        "GST Total",
        "CESS",
      ]);

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
          0.0,
        ]);
      });

      wsData.push([]);
      wsData.push(["Total Qty", gstReport[gstKey].total_qty]);
      wsData.push(["Total Taxable", gstReport[gstKey].total_taxable]);
      wsData.push(["Total CGST", gstReport[gstKey].total_cgst]);
      wsData.push(["Total SGST", gstReport[gstKey].total_sgst]);
      wsData.push(["Total GST", gstReport[gstKey].total_gst]);
      wsData.push(["Total CESS", 0.0]);

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
        "0.00",
      ]);

      doc.autoTable({
        startY: startY + 5,
        head: [
          [
            "HSN",
            "Item",
            "Type",
            "Qty",
            "Taxable",
            "CGST",
            "SGST",
            "GST",
            "CESS",
          ],
        ],
        body: tableBody,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [230, 230, 230] },
      });

      let y = doc.lastAutoTable.finalY + 6;

      // TOTALS (outside table — no lines)
      doc.setFontSize(11);
      doc.text(`Total Qty          : ${gstReport[gstKey].total_qty}`, 14, y);
      y += 6;
      doc.text(`Total Taxable      : ${gstReport[gstKey].total_taxable}`, 14, y);
      y += 6;
      doc.text(`Total CGST         : ${gstReport[gstKey].total_cgst}`, 14, y);
      y += 6;
      doc.text(`Total SGST         : ${gstReport[gstKey].total_sgst}`, 14, y);
      y += 6;
      doc.text(`Total GST          : ${gstReport[gstKey].total_gst}`, 14, y);
      y += 6;
      doc.text(`Total CESS         : 0.00`, 14, y);

      startY = y + 12;
    });

    doc.save("Sales_Return_HSN_Report.pdf");
  };

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Sales Return HSN Report
      </h2>

      {/* Filter Section */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          name="hsn"
          placeholder="HSN"
          value={filters.hsn}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          value={filters.itemName}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="productType"
          placeholder="Product Type"
          value={filters.productType}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <select
          name="gst"
          value={filters.gst}
          onChange={handleFilterChange}
          style={inputStyle}
        >
          <option value="">Select GST</option>
          <option value="5">5%</option>
          <option value="18">18%</option>
          <option value="0">0%</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <button onClick={loadHSNReport} style={buttonStyle}>Apply Filters</button>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
        <button onClick={exportExcel} style={buttonStyle}>Export to Excel</button>
        <button onClick={exportPDF} style={buttonStyle}>Export to PDF</button>
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
const inputStyle = {
  padding: "6px 10px",
  margin: "5px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  width: "150px",
};
const buttonStyle = {
  padding: "8px 15px",
  background: "#34495e",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Sales_Return_HSN_Report;
