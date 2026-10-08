import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { formatunderscoreLabel } from "../../OtherComponent/OtherFunctions";
import * as XLSX from "xlsx";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import { PawPrintIcon } from "lucide-react";
const StockMaintenanceList = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatch = useDispatch();

  // search filters
  const [searchQuery, setSearchQuery] = useState({
    ItemName: "",
    Category: "",
    SubCategory: "",
    GenericName: "",
    CompanyName: "",
    HSNCode: "",
    Department: "",
    Doctorname: "",
    DrugSegment: "",
    Batch_No: "",
    Expiry_Status: "",
    IsNurseStation: "",
    Store_location: "",
    Nurse_location: "",
    price_range: "",
    expiry_within_days: "",
  });

  const [dataArray, setDataArray] = useState([]);
  const [columnConfig, setColumnConfig] = useState([]);

  // helper to extract nested fields
  const getNestedValue = (obj, key) => {
    return key.split("__").reduce((o, k) => (o ? o[k] : ""), obj);
  };

  // fetch API data with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get(`${UrlLink}Inventory/Stock_Maintenance_List`, { params: searchQuery })
        .then((res) => setDataArray(res.data.results || []))
        .catch((err) => console.error(err));
    }, 500);

    return () => clearTimeout(timer);
  }, [UrlLink, searchQuery]);

  // configure columns
  useEffect(() => {
    const fields = [
      "Product_Detials__ItemName",
      "Product_Detials__ProductCategory__ProductCategory_Name",
      "Product_Detials__HSNCode",
      "Product_Detials__SubCategory__SubCategoryName",
      "Product_Detials__GenericName__GenericName",
      "Product_Detials__CompanyName__CompanyName",
      "Batch_No",
      "Sellable_price",
      "AvailableQuantity",
      "Expiry_Status",
      "Store_location",
      "Created_at",
      "Update_at",
    ];

    const cols = [
      { key: "id", name: "S.No" },
      ...fields.map((f) => ({
        key: f,
        name: formatunderscoreLabel(f),
      })),
    ];

    setColumnConfig(cols);
  }, []);

  // Excel export
const exportToExcel = () => {
  const exportData = dataArray.map((row, idx) => {
    let obj = { "S.No": idx + 1 };
    columnConfig.slice(1).forEach((col) => {
      obj[col.name] = row[col.key] ?? "";
    });
    return obj;
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "StockMaintenance");
  XLSX.writeFile(wb, "StockMaintenance.xlsx");
};


  // Print grid data
const handlePrint = () => {
  const tableWindow = window.open("", "_blank");

  const tableHtml = `
    <html>
      <head>
        <title>Stock Maintenance List</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 5px; text-align: left; }
        </style>
      </head>
      <body>
        <h3>Stock Maintenance List</h3>
        <table>
          <thead>
            <tr>
              ${columnConfig.map((col) => `<th>${col.name}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${dataArray
              .map(
                (row, idx) =>
                  `<tr>
                    ${columnConfig
                      .map((col, i) =>
                        i === 0
                          ? `<td>${idx + 1}</td>` // S.No
                          : `<td>${row[col.key] ?? ""}</td>` // Access directly
                      )
                      .join("")}
                  </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
  tableWindow.document.write(tableHtml);
  tableWindow.document.close();
  tableWindow.print();
};

  return (
    <div className="Main_container_app">
      <h3>Stock Maintenance List</h3>

      {/* Search Filters */}
      <div className="RegisFormcon_1">
        {Object.keys(searchQuery).map((f, i) => (
          <div className="RegisForm_1" key={i}>
            <label htmlFor={f}>
              {f} <span>:</span>
            </label>
            {f === "price_range" ? (
              <select
                id={f}
                name={f}
                value={searchQuery[f]}
                onChange={(e) => setSearchQuery((prev) => ({ ...prev, [f]: e.target.value }))}
              >
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <input
                type="text"
                id={f}
                name={f}
                value={searchQuery[f]}
                onChange={(e) => setSearchQuery((prev) => ({ ...prev, [f]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>

      {/* Export & Print Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={exportToExcel}><BrowserUpdatedIcon  /></button>
       
      </div>

      {/* Grid */}
      <ReactGrid columns={columnConfig} RowData={dataArray} />

      {/* Toast */}
      <ToastAlert Message={toast?.message || ""} Type={toast?.type || ""} />
    </div>
  );
};

export default StockMaintenanceList;
