
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import { useSelector } from "react-redux";
// import { StepIcon } from "@mui/material";
// const OpeningClosingBalance = () => {
//   const [inventory, setInventory] = useState([]);
//   // Extend filter state
// const [filters, setFilters] = useState({
//   day: "",
//   month: "",
//   year: "",
//   product: "",
//   store: "",
//    from_date: "",
//   to_date: "",
// });

//   const [loading, setLoading] = useState(false);
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
// const getCurrentDate = () => {
//   const today = new Date();
//   const day = String(today.getDate()).padStart(2, '0');
//   const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
//   const year = today.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// const currentDate = getCurrentDate();
// console.log("Current Date:", currentDate); // e.g., "30-07-2025"

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filters.from_date) params.append("from_date", filters.from_date);
// if (filters.to_date) params.append("to_date", filters.to_date);
//       if (filters.day) params.append("day", filters.day);
//       if (filters.month) params.append("month", filters.month);
//       if (filters.year) params.append("year", filters.year);
//       if (filters.product) params.append("product", filters.product);
// if (filters.store) params.append("store", filters.store);

//       const response = await axios.get(
//         `${UrlLink}Inventory/Opening_Balance_Closing_Balance?${params.toString()}`
//       );
//       setInventory(Array.isArray(response.data)? response.data:[]);
//     } catch (err) {
//       console.error("Error fetching inventory balance:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const columns = [
//     { key: "S.No", name: "S.No", width: 80 },
//     { key: "product", name: "Product", width: 200 },
//     { key: "batch_no", name: "Batch No", width: 150 },
//     { key: "store", name: "Store", width: 200 },
//     { key: "date", name: "Date", width: 130 },
//     { key: "opening_balance", name: "Opening Balance", width: 150 },
//     { key: "closing_balance", name: "Closing Balance", width: 150 },
//     { key: "created_at", name: "Created At", width: 180 },
//   ];

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(inventory);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "InventoryBalance");
//     XLSX.writeFile(workbook, "InventoryBalance.xlsx");
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <br />
//       <h2>Inventory Opening & Closing Balance</h2>
//  <br />
    
     
//       {/* Filters */}
//       <div style={{ marginBottom: "10px" }}>
//         <input
//   type="date"
//   placeholder="From Date"
//   value={filters.from_date}
//   onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
//   style={{ marginRight: "10px", borderRadius: "8px", padding: "4px 12px",  backgroundColor:"lightgrey" }}
// />
// <input
//   type="date"
//   placeholder="To Date"
//   value={filters.to_date}
//   onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
//   style={{ marginRight: "10px", borderRadius: "8px", padding: "4px 12px" ,  backgroundColor:"lightgrey"}}
// />
// <input
//   type="text"
//   placeholder="Product"
//   value={filters.product}
//   onChange={(e) => setFilters({ ...filters, product: e.target.value })}
//   style={{ marginRight: "10px", borderRadius: "8px", padding: "4px 12px",  backgroundColor:"lightgrey" }}
// />
//         <input
//           type="number"
//           placeholder="Day"
//           value={filters.day}
//           onChange={(e) => setFilters({ ...filters, day: e.target.value })}
//           style={{ marginRight: "10px" ,borderRadius:"8px",padding: "4px 12px" ,  backgroundColor:"lightgrey"}}
//         />
//         <input
//           type="number"
//           placeholder="Month"
//           value={filters.month}
//           onChange={(e) => setFilters({ ...filters, month: e.target.value })}
//           style={{ marginRight: "10px" ,borderRadius:"8px",padding: "4px 12px",  backgroundColor:"lightgrey" }}
//         />
//         <input
//           type="number"
//           placeholder="Year"
//           value={filters.year}
//           onChange={(e) => setFilters({ ...filters, year: e.target.value })}
//            style={{ marginRight: "10px" ,borderRadius:"8px",padding: "4px 12px" ,  backgroundColor:"lightgrey"}}
//         />
       
// <br />
// <br />
// <input
//   type="text"
//   placeholder="Store"
//   value={filters.store}
//   onChange={(e) => setFilters({ ...filters, store: e.target.value })}
//   style={{ marginRight: "10px", borderRadius: "8px",padding: "4px 12px",  backgroundColor:"lightgrey"  }}
// />

     
//       </div>
// <br />
//       {/* Export Button */}
//       <button
//         onClick={exportToExcel}
//         style={{
//           padding: "8px 16px",
//           marginBottom: "15px",
//           backgroundColor: "#5b5e61ff",
//           color: "#fff",
//           border: "none",
//           borderRadius: "8px",
//           cursor: "pointer",
//         }}
//       >
//         Export to Excel
//       </button>
//  {/* <br /> */}
//       <br />
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <ReactGrid columns={columns} RowData={inventory} />
//       )}
//     </div>
//   );
// };

// export default OpeningClosingBalance;


import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { useSelector } from "react-redux";
// --- NEW IMPORT ---
import PrintIcon from "@mui/icons-material/Print";

const OpeningClosingBalance = () => {
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const [inventory, setInventory] = useState([]);
  const getIsoDate = () => {
    const t = new Date();
    return t.toISOString().split("T")[0];
  };

  const [filters, setFilters] = useState({
    day: "",
    month: "",
    year: "",
    product: "",
    store: UserData?.ActivePharmacyStoreName,
    from_date: getIsoDate(),
    to_date: getIsoDate(), // Set to_date to today by default as well
  });

  const [dateMode, setDateMode] = useState("current");
  const [loading, setLoading] = useState(false);
  // --- NEW STATE for printing ---
  const [isPrinting, setIsPrinting] = useState(false);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.from_date) params.append("from_date", filters.from_date);
      if (filters.to_date) params.append("to_date", filters.to_date);
      if (filters.day) params.append("day", filters.day);
      if (filters.month) params.append("month", filters.month);
      if (filters.year) params.append("year", filters.year);
      if (filters.product) params.append("product", filters.product);
      if (filters.store) params.append("store", filters.store);

      const response = await axios.get(
        `${UrlLink}Inventory/Opening_Balance_Closing_Balance?${params.toString()}`
      );
      setInventory(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching inventory balance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const columns = [
    { key: "S.No", name: "S.No", width: 80 },
    { key: "product", name: "Product", width: 200 },
    { key: "batch_no", name: "Batch No", width: 150 },
    { key: "store", name: "Store", width: 200 },
    { key: "date", name: "Date", width: 130 },
    { key: "opening_balance", name: "Opening Balance", width: 150 },
    { key: "closing_balance", name: "Closing Balance", width: 150 },
    { key: "created_at", name: "Created At", width: 180 },
  ];

  const exportToExcel = () => {
    if (!inventory || inventory.length === 0) {
      alert("No data to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(inventory);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "InventoryBalance");
    XLSX.writeFile(workbook, "InventoryBalance.xlsx");
  };

  // --- NEW PRINT FUNCTION ---
  // const handlePrint = () => {
  //   if (isPrinting || !inventory || inventory.length === 0) {
  //     if (!isPrinting) alert("No data to print.");
  //     return;
  //   }
  //   setIsPrinting(true);

  //   // Build a summary of the active filters for the report header
  //   let filterSummary = "";
  //   if (dateMode === "current") {
  //     filterSummary += `<p><strong>Date:</strong> Current (${getIsoDate()})</p>`;
  //   } else if (dateMode === "custom" && filters.from_date) {
  //     filterSummary += `<p><strong>Date Range:</strong> ${
  //       filters.from_date
  //     } to ${filters.to_date || "N/A"}</p>`;
  //   } else {
  //     filterSummary += `<p><strong>Date:</strong> All</p>`;
  //   }
  //   if (filters.product)
  //     filterSummary += `<p><strong>Product:</strong> ${filters.product}</p>`;
  //   if (filters.store)
  //     filterSummary += `<p><strong>Store:</strong> ${filters.store}</p>`;
  //   if (filters.day || filters.month || filters.year) {
  //     filterSummary += `<p><strong>Specific Period:</strong> Day: ${
  //       filters.day || "N/A"
  //     }, Month: ${filters.month || "N/A"}, Year: ${filters.year || "N/A"}</p>`;
  //   }

  //   // Build the HTML table from the inventory data
  //   const tableHeaders = `<tr>${columns
  //     .map((c) => `<th>${c.name}</th>`)
  //     .join("")}</tr>`;
  //   const tableRows = inventory
  //     .map(
  //       (item) => `
  //           <tr>
  //               <td>${item["S.No"] || ""}</td>
  //               <td>${item.product || ""}</td>
  //               <td>${item.batch_no || ""}</td>
  //               <td>${item.store || ""}</td>
  //               <td>${
  //                 item.date
  //                   ? new Date(item.date).toLocaleDateString("en-GB")
  //                   : ""
  //               }</td>
  //               <td>${item.opening_balance || 0}</td>
  //               <td>${item.closing_balance || 0}</td>
  //               <td>${
  //                 item.created_at
  //                   ? new Date(item.created_at).toLocaleString("en-GB")
  //                   : ""
  //               }</td>
  //           </tr>
  //       `
  //     )
  //     .join("");

  //   const reportHTML = `
  //           <html>
  //               <head>
  //                   <title>Inventory Balance Report</title>
  //                   <style>
  //                       body { font-family: Arial, sans-serif; margin: 20px; }
  //                       h1, h2 { text-align: center; }
  //                       .filter-summary { border: 1px solid #ccc; padding: 10px; margin-bottom: 20px; border-radius: 8px;}
  //                       table { width: 100%; border-collapse: collapse; font-size: 11px; }
  //                       th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
  //                       th { background-color: #f2f2f2; }
  //                       @page { size: A4 landscape; margin: 20mm; }
  //                   </style>
  //               </head>
  //               <body>
  //                   <h1>Inventory Opening & Closing Balance</h1>
  //                   <div class="filter-summary">
  //                       <h2>Report Filters</h2>
  //                       ${filterSummary}
  //                   </div>
  //                   <table>
  //                       <thead>${tableHeaders}</thead>
  //                       <tbody>${tableRows}</tbody>
  //                   </table>
  //               </body>
  //           </html>
  //       `;

  //   const newWin = window.open("", "_blank");
  //   newWin.document.write(reportHTML);
  //   newWin.document.close();
  //   setTimeout(() => {
  //     newWin.focus();
  //     newWin.print();
  //     newWin.close();
  //     setIsPrinting(false);
  //   }, 500);
  // };

  const handlePrint = () => {
    if (isPrinting || !inventory || inventory.length === 0) {
      if (!isPrinting) alert("No data to print.");
      return;
    }
    setIsPrinting(true);

    // Build a summary of the active filters for the report header
    let filterSummary = "";
    if (dateMode === "current") {
      filterSummary += `<p><strong>Date:</strong> Current (${getIsoDate()})</p>`;
    } else if (dateMode === "custom" && filters.from_date) {
      filterSummary += `<p><strong>Date Range:</strong> ${
        filters.from_date
      } to ${filters.to_date || "N/A"}</p>`;
    } else {
      filterSummary += `<p><strong>Date:</strong> All</p>`;
    }
    if (filters.product)
      filterSummary += `<p><strong>Product:</strong> ${filters.product}</p>`;
    if (filters.store)
      filterSummary += `<p><strong>Store:</strong> ${filters.store}</p>`;
    if (filters.day || filters.month || filters.year) {
      filterSummary += `<p><strong>Specific Period:</strong> Day: ${
        filters.day || "N/A"
      }, Month: ${filters.month || "N/A"}, Year: ${filters.year || "N/A"}</p>`;
    }

    // Filter out the 'Created At' column for printing
    const printColumns = columns.filter((col) => col.key !== "created_at");

    // Build the HTML table headers and rows from the filtered data
    const tableHeaders = `<tr>${printColumns
      .map((c) => `<th>${c.name}</th>`)
      .join("")}</tr>`;
    const tableRows = inventory
      .map(
        (item) => `
        <tr>
            <td>${item["S.No"] || ""}</td>
            <td>${item.product || ""}</td>
            <td>${item.batch_no || ""}</td>
            <td>${item.store || ""}</td>
            <td>${
              item.date ? new Date(item.date).toLocaleDateString("en-GB") : ""
            }</td>
            <td>${item.opening_balance || 0}</td>
            <td>${item.closing_balance || 0}</td>
        </tr>
    `
      )
      .join("");

    const reportHTML = `
        <html>
            <head>
                <title>Inventory Balance Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1, h2 { text-align: center; }
                    .filter-summary { border: 1px solid #ccc; padding: 10px; margin-bottom: 20px; border-radius: 8px;}
                    table { width: 100%; border-collapse: collapse; font-size: 11px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    /* Set page to A4 Portrait */
                    @page { size: A4 portrait; margin: 20mm; }
                </style>
            </head>
            <body>
                <h1>Inventory Opening & Closing Balance</h1>
                <div class="filter-summary">
                    <h2>Report Filters</h2>
                    ${filterSummary}
                </div>
                <table>
                    <thead>${tableHeaders}</thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </body>
        </html>
    `;

    const newWin = window.open("", "_blank");
    newWin.document.write(reportHTML);
    newWin.document.close();
    setTimeout(() => {
      newWin.focus();
      newWin.print();
      newWin.close();
      setIsPrinting(false);
    }, 500);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inventory Opening & Closing Balance</h2>
      <br />
      {/* Filters */}
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="date"
          value={filters.from_date}
          onChange={(e) => {
            setFilters({ ...filters, from_date: e.target.value });
            setDateMode("custom");
          }}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="date"
          value={filters.to_date}
          onChange={(e) => {
            setFilters({ ...filters, to_date: e.target.value });
            setDateMode("custom");
          }}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={dateMode}
          onChange={(e) => {
            const value = e.target.value;
            setDateMode(value);
            if (value === "all") {
              setFilters({ ...filters, from_date: "", to_date: "" });
            } else if (value === "current") {
              const today = getIsoDate();
              setFilters({ ...filters, from_date: today, to_date: today });
            }
          }}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="current">Current Date</option>
          <option value="all">All Dates</option>
          <option value="custom" disabled>
            Custom Range
          </option>
        </select>
        <input
          type="text"
          placeholder="Product"
          value={filters.product}
          onChange={(e) => setFilters({ ...filters, product: e.target.value })}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          placeholder="Store"
          value={filters.store}
          onChange={(e) => setFilters({ ...filters, store: e.target.value })}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          placeholder="Day"
          value={filters.day}
          onChange={(e) => setFilters({ ...filters, day: e.target.value })}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "80px",
          }}
        />
        <input
          type="number"
          placeholder="Month"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "80px",
          }}
        />
        <input
          type="number"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "100px",
          }}
        />
      </div>
      <br />
      {/* Action Buttons */}
      <div>
        <button
          onClick={exportToExcel}
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            backgroundColor: "#1e6e42",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Export to Excel
        </button>
        {/* --- NEW PRINT BUTTON --- */}
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {isPrinting ? (
            "Printing..."
          ) : (
            <PrintIcon style={{ verticalAlign: "middle" }} />
          )}{" "}
          Print
        </button>
      </div>

      <br />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ReactGrid columns={columns} RowData={inventory} />
      )}
    </div>
  );
};

export default OpeningClosingBalance;

