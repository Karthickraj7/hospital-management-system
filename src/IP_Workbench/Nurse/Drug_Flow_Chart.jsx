import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// --- Color and Status Mapping ---
const statusColors = {
  Pending: "#FF9800", // Orange
  Issued: "#4CAF50",   // Green
  Before: "#03A9F4",   // Light Blue
  Delay: "#F44336",    // Red
  NotIssued: "#797979", // Darker Grey
  stopped: "#6A1B9A", // Purple
  Unknown: "#607D8B",  // Blue-Grey
};

// --- Style Definitions ---
const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "32px auto",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
    color: "#333333",
    fontSize: "28px",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginBottom: "24px",
    paddingRight: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 123, 255, 0.3)",
  },
  printButton: {
    backgroundColor: "#6c757d",
  },
  chartWrapper: {
    width: "100%",
    height: "400px",
    marginBottom: "30px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: "20px",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  tableHeaderRow: {
    backgroundColor: "#eef2f7",
    color: "#333",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  th: {
    border: "1px solid #dcdcdc",
    padding: "12px 8px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #dcdcdc",
    padding: "10px 8px",
    verticalAlign: "middle",
  },
  // Tooltip Styles
  tooltipContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  tooltipTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '1px solid #eee',
    paddingBottom: '5px',
  },
  tooltipItem: {
    fontSize: '12px',
    marginBottom: '4px',
    color: '#555',
  },
  tooltipStatus: (color) => ({
    display: 'inline-block',
    fontWeight: '600',
    color: color,
  }),
};

// --- CRUCIAL PRINT CSS (Targeting Chart and Table) ---
const printStyles = `
  @media print {
    /* Hide all non-essential elements on the page */
    body * {
      visibility: hidden;
    }

    /* Make the content container and its children visible and repositioned */
    #print-area, #print-area * {
      visibility: visible;
    }
    
    /* Position content at the top left of the page for clean printing */
    #print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 0;
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    /* Remove background/border from chart/table for clean printing */
    #print-chart-wrapper, #print-table-wrapper {
        background-color: transparent !important;
        border: none !important;
    }
  }
`;

// --- Custom Tooltip Component ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataEntry = payload[0].payload;
    const rawItems = dataEntry.rawItems || [];
    const totalDosage = dataEntry.dosage;

    return (
      <div style={styles.tooltipContainer}>
        <p style={styles.tooltipTitle}>
          {label} (Total Dosage: {totalDosage})
        </p>
        {rawItems.length > 0 ? (
          rawItems.map((item, index) => (
            <div key={index} style={styles.tooltipItem}>
              &bull; **Route:** {item.Route || '-'}, **Dose:** {item.Dosage || '0'}, **Time:** {item.Complete_Time ? item.Complete_Time.split('.')[0] : '-'}
              , **Status:** <span style={styles.tooltipStatus(statusColors[item.Status] || statusColors.Unknown)}>{item.Status || 'N/A'}</span>
            </div>
          ))
        ) : (
          <p style={styles.tooltipItem}>No administration details available.</p>
        )}
      </div>
    );
  }
  return null;
};

// --- Main Component ---
const DrugDosePerformance = () => {
  const [data, setData] = useState([]);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const registrationId = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation?.RegistrationId
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!registrationId) return;
      try {
        const res = await fetch(
          `${UrlLink}DrugAdminstrations/get_booking_administrations`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Booking_Id: registrationId }),
          }
        );
        const jsonData = await res.json();
        setData(Array.isArray(jsonData) ? jsonData : []);
      } catch (err) {
        console.error("Error fetching drug administration data:", err);
        setData([]);
      }
    };
    fetchData();
  }, [registrationId, UrlLink]);

  // Aggregation logic for Chart (includes rawItems for tooltip)
  const chartData = Object.values(
    data.reduce((acc, item) => {
      const key = item.ItemName || item.ProductCode;
      const itemName = item.ItemName || item.ProductCode || 'N/A';

      if (!acc[key]) acc[key] = { ...item, ItemName: itemName, dosage: 0, rawItems: [] };
      
      acc[key].dosage += Number(item.Dosage || 0);
      acc[key].rawItems.push(item);
      acc[key].Status = item.Status; // Use the status of the last item for bar color

      return acc;
    }, {})
  ).sort((a, b) => b.dosage - a.dosage);

  const exportToExcel = () => {
    if (!data.length) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Drug Data");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Drug_Performance_${registrationId || 'N/A'}.xlsx`
    );
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    // Main print-targetable container
    <div  id="print-area"> 
      {/* Inject print-specific CSS rules */}
      <style>{printStyles}</style>

      <h2 style={styles.header}>💊 Drug Dose Performance</h2>
      
      {/* Button container (will be hidden during print) */}
      <div style={styles.buttonContainer}> 
        <button
          onClick={handlePrint}
          style={{ ...styles.button, ...styles.printButton }}
        >
          Print Chart & Table 🖨️
        </button>
        <button
          onClick={exportToExcel} 
          style={styles.button}
        >
          Export Full Data to Excel 📥
        </button>
      </div>

      {/* --- Bar Chart --- */}
      <div style={styles.chartWrapper} id="print-chart-wrapper"> 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
            <XAxis
              dataKey="ItemName"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis
              label={{ value: 'Total Dosage', angle: -90, position: 'insideLeft', fill: '#666' }}
              tick={{ fill: '#666' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              content={<CustomTooltip />} // Custom Tooltip for detailed hover
            />
            <Bar dataKey="dosage" minPointSize={3} radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={statusColors[entry.Status] || statusColors.Unknown}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* --- Data Table --- */}
   {/* --- Hospital Flow-Chart Style Printout --- */}
<h3 style={{ ...styles.header, fontSize: "22px", marginBottom: "15px", marginTop: "40px", borderBottom: "1px solid #e0e0e0" }}>
  Karuna Medical College Hospital – Drug Administration Chart
</h3>

<div id="flowchart-print-wrapper" style={{ border: "1px solid #000", padding: "10px", marginBottom: "40px" }}>
  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
    <thead>
      <tr>
        <th style={styles.th}>Drug Name</th>
        <th style={styles.th}>Route</th>
        <th style={styles.th}>Frequency</th>
        <th style={styles.th}>Doctor</th>
        <th style={styles.th}>Nurse</th>
        <th style={styles.th}>Date Started</th>
        <th style={styles.th}>Date Discontinued</th>
        {/* Make 10 date columns like in hospital sheet */}
        {[...Array(10)].map((_, i) => (
          <th key={i} style={styles.th}>Date</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.length > 0 ? (
        data.map((item, idx) => (
          <tr key={idx}>
            <td style={styles.td}>{item.ItemName || "-"}</td>
            <td style={styles.td}>{item.Route || "-"}</td>
            <td style={styles.td}>{item.Dosage || "-"}</td>
            <td style={styles.td}>{item.DoctorName || "-"}</td>
            <td style={styles.td}>{item.CapturedBy || "-"}</td>
            <td style={styles.td}>{item.Issued_Date || "-"}</td>
            <td style={styles.td}>{item.Complete_Date || "-"}</td>
            {[...Array(10)].map((_, i) => (
              <td key={i} style={styles.td}>
                {i === 0 ? (item.Complete_Time ? item.Complete_Time.split(".")[0] : "-") : ""}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="17" style={{ ...styles.td, textAlign: "center" }}>No data available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default DrugDosePerformance;