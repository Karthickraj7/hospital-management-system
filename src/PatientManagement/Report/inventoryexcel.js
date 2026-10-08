import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./inventoryex.css";
import { useSelector } from "react-redux";
import { IoIosAddCircle } from "react-icons/io";
import { TiDelete } from "react-icons/ti";

// Utility function to convert camelCase to snake_case
const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// Helper function to format input display value (for editable fields)
const formatDisplayValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "0"; // Show "0" for undefined, null, or empty string
  }
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return "0"; // Show "0" if the value is not a number
  }
  return numValue.toString(); // Return the raw value as a string for input fields
};

// Helper function to format display value with toFixed(2) for table and export
const formatDisplayFixed = (value) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return "0.00"; // Show "0.00" if the value is not a number
  }
  return numValue.toFixed(2); // Display with 2 decimal places
};

function Excelfilereport() {
  const [inventory, setInventory] = useState([]);
  const [editedInventory, setEditedInventory] = useState({});
  const [supplierinfo, setSupplierInfo] = useState([]);
  const [totalinfoss, setTotalInfoss] = useState({ suppliertotal: 0 });
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [hasFetched, setHasFetched] = useState(false);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [SearchformData, setSearchformData] = useState({
    month: "",
    year: "",
  });

  // Initialize with one empty row on component mount
  useEffect(() => {
    if (inventory.length === 0) {
      addNewRow();
    }
  }, []);

  // Fetch inventory and supplier data from the backend
  const fetchInventory = async (selectedMonth, selectedYear) => {
    try {
      const response = await axios.get(
        `${urllink}quickstockreceive/manage_inventory?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = response.data;
      console.log("Fetched data:", data);

      let mappedInventory = (data.stockinfo || []).map((item) => ({
        id: item.id,
        item_code: item.item_code || null,
        month: item.month,
        year: item.year,
        itemname: item.itemname || "",
        opening_Quantity: item.opening_quantity !== null ? item.opening_quantity : "",
        opening_Cpt: item.opening_cpt !== null ? item.opening_cpt : "",
        opening_balanceqtyvalue: 0, // Will be calculated
        grndate: item.grndate || null,
        purchasevalQuantity: item.purchaseval_quantity !== null ? item.purchaseval_quantity : "",
        purchasediscount: item.purchasediscount !== null ? item.purchasediscount : "",
        purchasegst: item.purchasegst !== null ? item.purchasegst : "",
        purchasegstprice: 0, // Will be calculated
        purchasevalCpt: 0, // Will be calculated
        purchasetotal_Amount: 0, // Will be calculated
        usedQuantity: item.used_quantity !== null ? item.used_quantity : "",
        usedCpt: 0, // Will be calculated
        usedvalue: 0, // Will be calculated
        closingQuantity: 0, // Will be calculated
        closingcpt: 0, // Will be calculated
        closingtotalvalue: 0, // Will be calculated
      }));

      // Recalculate dependent fields for each item
      mappedInventory = mappedInventory.map((item) => calculateDependentFields(item));

      setInventory(mappedInventory);
      setSupplierInfo(data.supplierinfo || []);
      setTotalInfoss(data.totalinfoss || { suppliertotal: 0 });
      setEditedInventory({});
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setInventory([]);
      setSupplierInfo([]);
      setTotalInfoss({ suppliertotal: 0 });
    }
  };

  // Handle changes in the search form
  const handleSearchFormChange = (e) => {
    const { name, value } = e.target;
    setSearchformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search button click
  const handletoSearch = () => {
    const selectedMonth = SearchformData.month || month;
    const selectedYear = SearchformData.year || year;
    setMonth(parseInt(selectedMonth));
    setYear(parseInt(selectedYear));
    fetchInventory(selectedMonth, selectedYear);
  };

  // Function to calculate dependent fields (using raw numbers, no rounding)
  const calculateDependentFields = (item) => {
    const purchasevalQuantity = parseFloat(item.purchasevalQuantity || 0);
    const openingQuantity = parseFloat(item.opening_Quantity || 0);
    const usedQuantity = parseFloat(item.usedQuantity || 0);
    const purchasediscount = parseFloat(item.purchasediscount || 0); // Base price before tax
    const purchasegst = parseFloat(item.purchasegst || 0); // GST percentage

    let purchasegstprice = 0; // Total cost including GST
    let purchasevalCpt = 0; // Cost per unit
    let openingCpt = parseFloat(item.opening_Cpt || 0);
    let usedCpt = 0;
    let closingcpt = 0;

    // Calculate purchasegstprice (total cost with GST)
    if (purchasediscount > 0) {
      purchasegstprice = purchasediscount + (purchasediscount * purchasegst);
    }

    // Calculate purchasevalCpt (cost per unit)
    if (purchasevalQuantity > 0 && purchasegstprice > 0) {
      purchasevalCpt = purchasegstprice / purchasevalQuantity;
    } else if (purchasevalQuantity === 0 && openingCpt > 0) {
      purchasevalCpt = openingCpt; // Fallback to opening CPT if no purchase quantity
    }

    // Propagate CPT values
    if (purchasevalCpt > 0) {
      openingCpt = purchasevalCpt; // Update opening CPT if purchase data exists
      usedCpt = purchasevalCpt;
      closingcpt = purchasevalCpt;
    } else if (openingCpt > 0) {
      purchasevalCpt = openingCpt; // Use opening CPT as fallback
      usedCpt = openingCpt;
      closingcpt = openingCpt;
    }

    // Calculate dependent values (using raw numbers)
    const purchasetotal_Amount = purchasevalQuantity * purchasevalCpt;
    const opening_balanceqtyvalue = openingQuantity * openingCpt;
    const usedvalue = usedQuantity * usedCpt;
    const closingQuantity = openingQuantity + purchasevalQuantity - usedQuantity;
    const closingtotalvalue = closingQuantity * closingcpt;

    return {
      ...item,
      purchasegstprice,
      purchasevalCpt,
      opening_Cpt: openingCpt,
      usedCpt,
      closingcpt,
      purchasetotal_Amount,
      opening_balanceqtyvalue,
      usedvalue,
      closingQuantity,
      closingtotalvalue,
    };
  };

  // Function to handle changes in input fields
  const handleChange = (e, index, field) => {
    const { value } = e.target;
    const newInventory = [...inventory];
    if (index >= newInventory.length) {
      newInventory.push({
        item_code: null,
        month: month,
        year: year,
        itemname: "",
        opening_Quantity: "",
        opening_Cpt: "",
        opening_balanceqtyvalue: 0,
        grndate: null,
        purchasevalQuantity: "",
        purchasediscount: "",
        purchasegst: "",
        purchasegstprice: 0,
        purchasevalCpt: 0,
        purchasetotal_Amount: 0,
        usedQuantity: "",
        usedCpt: 0,
        usedvalue: 0,
        closingQuantity: 0,
        closingcpt: 0,
        closingtotalvalue: 0,
      });
    }

    newInventory[index] = {
      ...newInventory[index],
      [field]: value,
    };

    // Recalculate dependent fields after any change
    newInventory[index] = calculateDependentFields(newInventory[index]);

    setInventory(newInventory);
    setEditedInventory((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  // Function to save changes to the backend
  const handleUpdate = async () => {
    const recordsToUpdate = inventory.map((item) => {
      const data = {
        id: item.id,
        item_code: item.item_code,
        month: month,
        year: year,
        itemname: item.itemname,
        opening_quantity: item.opening_Quantity, // Send raw value
        opening_cpt: item.opening_Cpt, // Send raw value
        opening_balanceqtyvalue: item.opening_balanceqtyvalue, // Send raw value
        grndate: item.grndate,
        purchaseval_quantity: item.purchasevalQuantity, // Send raw value
        purchase_discount: item.purchasediscount, // Send raw value (corrected key name)
        purchase_gst: item.purchasegst, // Send raw value
        purchasegstprice: item.purchasegstprice, // Send raw value
        purchaseval_cpt: item.purchasevalCpt, // Send raw value
        purchasetotal_amount: item.purchasetotal_Amount, // Send raw value
        used_quantity: item.usedQuantity, // Send raw value
        used_cpt: item.usedCpt, // Send raw value
        usedvalue: item.usedvalue, // Send raw value
        closing_quantity: item.closingQuantity, // Send raw value
        closingcpt: item.closingcpt, // Send raw value
        closingtotalvalue: item.closingtotalvalue, // Send raw value
      };
  
      const snakeCaseData = {};
      Object.keys(data).forEach((key) => {
        snakeCaseData[camelToSnake(key)] = data[key];
      });
  
      return snakeCaseData;
    });
  
    try {
      console.log("Data being sent to backend:", recordsToUpdate);
      const response = await axios.post(`${urllink}quickstockreceive/updateinventory`, recordsToUpdate);
      console.log("Backend response:", response.data);
      setEditedInventory({});
      fetchInventory(month, year);
    } catch (error) {
      console.error("Error updating inventory data:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    }
  };

  // Function to add a new row after a specific index
  const addNewRow = (index = -1) => {
    const newRow = {
      item_code: null,
      month: month,
      year: year,
      itemname: "",
      opening_Quantity: "",
      opening_Cpt: "",
      opening_balanceqtyvalue: 0,
      grndate: null,
      purchasevalQuantity: "",
      purchasediscount: "",
      purchasegst: "",
      purchasegstprice: 0,
      purchasevalCpt: 0,
      purchasetotal_Amount: 0,
      usedQuantity: "",
      usedCpt: 0,
      usedvalue: 0,
      closingQuantity: 0,
      closingcpt: 0,
      closingtotalvalue: 0,
    };

    if (index === -1) {
      setInventory([...inventory, newRow]);
    } else {
      const newInventory = [...inventory];
      newInventory.splice(index + 1, 0, newRow);
      setInventory(newInventory);
    }
  };

  // Function to remove a row
  const removeRow = (index) => {
    if (inventory.length === 1) {
      return;
    }
    const newInventory = inventory.filter((_, i) => i !== index);
    setInventory(newInventory);

    const newEditedInventory = { ...editedInventory };
    delete newEditedInventory[index];
    setEditedInventory(newEditedInventory);
  };

  // Function to export table data to Excel
  const exportToExcel = () => {
    const inventoryWorksheetData = [
      [
        "",
        "Item Name",
        "Opening Quantity",
        "Opening CPT",
        "Opening Value",
        "Purchase Quantity",
        "Purchase Discount",
        "Purchase GST",
        "Purchase GST Price",
        "Purchase CPT",
        "Purchase Value",
        "Used Quantity",
        "Used CPT",
        "Used Value",
        "Closing Quantity",
        "Closing CPT",
        "Closing Value",
        "",
      ],
      ...inventory.map((item) => [
        "",
        item.itemname,
        formatDisplayValue(item.opening_Quantity),
        formatDisplayValue(item.opening_Cpt),
        formatDisplayFixed(item.opening_balanceqtyvalue), // Display with 2 decimal places
        formatDisplayValue(item.purchasevalQuantity),
        formatDisplayValue(item.purchasediscount),
        formatDisplayValue(item.purchasegst),
        formatDisplayFixed(item.purchasegstprice), // Display with 2 decimal places
        formatDisplayFixed(item.purchasevalCpt), // Display with 2 decimal places
        formatDisplayFixed(item.purchasetotal_Amount), // Display with 2 decimal places
        formatDisplayValue(item.usedQuantity),
        formatDisplayFixed(item.usedCpt), // Display with 2 decimal places
        formatDisplayFixed(item.usedvalue), // Display with 2 decimal places
        formatDisplayFixed(item.closingQuantity), // Display with 2 decimal places
        formatDisplayFixed(item.closingcpt), // Display with 2 decimal places
        formatDisplayFixed(item.closingtotalvalue), // Display with 2 decimal places
        "",
      ]),
      [
        "Totals:",
        "",
        "",
        "",
        formatDisplayFixed(totals.opening_balanceqtyvalue), // Display with 2 decimal places
        "",
        "",
        "",
        "",
        "",
        formatDisplayFixed(totals.purchasetotal_Amount), // Display with 2 decimal places
        "",
        "",
        formatDisplayFixed(totals.usedvalue), // Display with 2 decimal places
        "",
        "",
        formatDisplayFixed(totals.closingtotalvalue), // Display with 2 decimal places
        "",
      ],
    ];

    const supplierWorksheetData = [
      ["Supplier Name", "Price", "Rec. Date", "Due Date"],
      ...supplierinfo.map((item) => [
        item.suppliername || "N/A",
        formatDisplayFixed(item.price), // Display with 2 decimal places
        item.billdate || "N/A",
        item.duedate || "N/A",
      ]),
      [
        "Supplier Total:",
        "",
        "",
        formatDisplayFixed(totalinfoss.suppliertotal), // Display with 2 decimal places
      ],
    ];

    const combinedWorksheetData = [
      ...inventoryWorksheetData,
      [],
      ...supplierWorksheetData,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(combinedWorksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");
    XLSX.writeFile(workbook, `Inventory_Report_${month}_${year}.xlsx`);
  };

  // Calculate totals for specific columns (using raw numbers, no rounding)
  const calculateTotals = () => {
    return inventory.reduce(
      (totals, item) => {
        totals.opening_balanceqtyvalue += parseFloat(item.opening_balanceqtyvalue) || 0;
        totals.purchasetotal_Amount += parseFloat(item.purchasetotal_Amount) || 0;
        totals.usedvalue += parseFloat(item.usedvalue) || 0;
        totals.closingtotalvalue += parseFloat(item.closingtotalvalue) || 0;
        return totals;
      },
      {
        opening_balanceqtyvalue: 0,
        purchasetotal_Amount: 0,
        usedvalue: 0,
        closingtotalvalue: 0,
      }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="excelfile-container appointment">
      <h1 className="excelfile-title">Month of {month}/{year}</h1>
      <div className="excelfile-controls">
        <div className="RegisFormcon">
          <div className="RegisForm_1">
            <label htmlFor="month">
              Select Month <span>:</span>
            </label>
            <select
              name="month"
              value={SearchformData.month}
              onChange={handleSearchFormChange}
            >
              <option value="">--Select Month--</option>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index + 1}>
                  {new Date(0, index).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>

            <label htmlFor="year">
              Select Year <span>:</span>
            </label>
            <select
              name="year"
              value={SearchformData.year}
              onChange={handleSearchFormChange}
            >
              <option value="">--Select Year--</option>
              {Array.from({ length: 10 }, (_, index) => {
                const yearOption = new Date().getFullYear() - index;
                return (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handletoSearch}>
          Search
        </button>
        <button className="RegisterForm_1_btns" onClick={exportToExcel}>
          Export To Excel
        </button>
        <button className="RegisterForm_1_btns" onClick={handleUpdate}>
          Update
        </button>
      </div>
      <div className="excelfile-table-wrapper">
        <table className="excelfile-table">
          <thead>
            <tr>
              <th></th>
              <th>Item Name</th>
              <th>Opening Quantity</th>
              <th>Opening CPT</th>
              <th>Opening Value</th>
              <th>Purchase Quantity</th>
              <th>Purchase Discount</th>
              <th>Purchase GST</th>
              <th>Purchase GST Price</th>
              <th>Purchase CPT</th>
              <th>Purchase Value</th>
              <th>Used Quantity</th>
              <th>Used CPT</th>
              <th>Used Value</th>
              <th>Closing Quantity</th>
              <th>Closing CPT</th>
              <th>Closing Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index}>
                <td>
                  <button
                    className="add-row-btn"
                    onClick={() => addNewRow(index)}
                    title="Add Row"
                  >
                    <IoIosAddCircle />
                  </button>
                </td>
                <td>
                  <input
                    type="text"
                    value={item.itemname || ""}
                    onChange={(e) => handleChange(e, index, "itemname")}
                    className="excelfile-input"
                    title={item.itemname || ""}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayValue(item.opening_Quantity)}
                    onChange={(e) => handleChange(e, index, "opening_Quantity")}
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayValue(item.opening_Cpt)}
                    onChange={(e) => handleChange(e, index, "opening_Cpt")}
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayFixed(item.opening_balanceqtyvalue)} // Display with 2 decimal places
                    readOnly
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayValue(item.purchasevalQuantity)}
                    onChange={(e) => handleChange(e, index, "purchasevalQuantity")}
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayValue(item.purchasediscount)}
                    onChange={(e) => handleChange(e, index, "purchasediscount")}
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayValue(item.purchasegst)}
                    onChange={(e) => handleChange(e, index, "purchasegst")}
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayFixed(item.purchasegstprice)} // Display with 2 decimal places
                    readOnly
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayFixed(item.purchasevalCpt)} // Display with 2 decimal places
                    readOnly
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayFixed(item.purchasetotal_Amount)} // Display with 2 decimal places
                    readOnly
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayValue(item.usedQuantity)}
                    onChange={(e) => handleChange(e, index, "usedQuantity")}
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayFixed(item.usedCpt)} // Display with 2 decimal places
                    readOnly
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayFixed(item.usedvalue)} // Display with 2 decimal places
                    readOnly
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayFixed(item.closingQuantity)} // Display with 2 decimal places
                    readOnly
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayFixed(item.closingcpt)} // Display with 2 decimal places
                    readOnly
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formatDisplayFixed(item.closingtotalvalue)} // Display with 2 decimal places
                    readOnly
                    className="excelfile-input"
                  />
                </td>
                <td>
                  <button
                    className="remove-row-btn"
                    onClick={() => removeRow(index)}
                    title="Remove Row"
                  >
                    <TiDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
              <td colSpan={4}>Totals:</td>
              <td>{formatDisplayFixed(totals.opening_balanceqtyvalue)}</td> {/* Display with 2 decimal places */}
              <td colSpan={5}></td>
              <td>{formatDisplayFixed(totals.purchasetotal_Amount)}</td> {/* Display with 2 decimal places */}
              <td colSpan={2}></td>
              <td>{formatDisplayFixed(totals.usedvalue)}</td> {/* Display with 2 decimal places */}
              <td colSpan={2}></td>
              <td>{formatDisplayFixed(totals.closingtotalvalue)}</td> {/* Display with 2 decimal places */}
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <br />
      <div className="iiiioucon">
        <table className="eetable">
          <thead>
            <tr>
              <th className="secHead">Supplier Name</th>
              <th className="secHead">Price</th>
              <th className="secHead">Rec. Date</th>
              <th className="secHead">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {supplierinfo.map((item, index) => (
              <React.Fragment key={index}>
                <tr
                  key={index}
                  style={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff" }}
                >
                  <td className="rree">{item.suppliername || "N/A"}</td>
                  <td className="rac">{formatDisplayFixed(item.price)}</td> {/* Display with 2 decimal places */}
                  <td className="rac">{item.billdate || "N/A"}</td>
                  <td className="rac">{item.duedate || "N/A"}</td>
                </tr>
                {index === supplierinfo.length - 1 && totalinfoss && (
                  <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    <td colSpan={1} className="rree">
                      Supplier Total:
                    </td>
                    <td className="rac">
                      {formatDisplayFixed(totalinfoss.suppliertotal)} {/* Display with 2 decimal places */}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Excelfilereport;