import React, { useState } from "react";
import axios from "axios";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import "./Inventoryreport.css"
import * as XLSX from 'xlsx';
const Inventoryreport = () => {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [selectedMonthName, setSelectedMonthName] = useState("");
  const currentYear = new Date().getFullYear(); // Get the current year
  const [SearchformData, setSearchformData] = useState({
      month: "",
      year: "",
  });
  const [filteredRows, setFilteredRows] = useState([]);
  const [totalinfoss, settotalinfoss] = useState([]);
  const [supplierinfo, setsupplierinfo] = useState([]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchformData((prev) => ({
      ...prev,
      [name]: value, 
    }));
    if (name === "month") {
      const monthName = new Date(0, value - 1).toLocaleString("en", {
        month: "long",
      });
      setSelectedMonthName(monthName);
    }
    
  };
  const yearToUse = SearchformData.year || currentYear;
  const handletoSearch = () => {
    const Month= SearchformData.month
    const year = SearchformData.year
    axios
      .get(`${urllink}quickstockreceive/getinventoryreport?month=${Month}&year=${year}`,)
      .then((response) => {
        const Data = response.data;
       
        if (!Data.stockinfo || Data.stockinfo.length === 0) {
          // No data found
          alert("No data found.");
          setFilteredRows([]); // Clear existing data
          settotalinfoss(null); // Clear total info
          setsupplierinfo([]); // Clear supplier info
        } else {
          // Data found
          setFilteredRows(Data.stockinfo);
          settotalinfoss(Data.totalinfo[0]);
          setsupplierinfo(Data.supplierinfo);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
  
    // First table headers - restructured to match the Excel format
    const mainTableHeaders = [
      [`Month of ${selectedMonthName} - ${yearToUse}`],
      [
        '',                           // Item Name column
        'OPENING BALANCE', '', '',    // Opening Balance columns
        'PURCHASE', '', '', '', '', '',  // Purchase columns
        'USED VALUE', '', '',         // Used Value columns
        'CLOSING BALANCE', '', ''     // Closing Balance columns
      ],
      [
        'Item Name',
        'Balance Qty', 'CPT', 'Balance Value',
        'Quantity', 'Dis.Price', 'GST', 'Gst.Pri', 'CPT', 'Value',
        'Quantity', 'CPT', 'Value',
        'Quantity', 'CPT', 'Value'
      ]
    ];
  
    // Format main table data
    const mainTableData = filteredRows.map(item => [
      item.itemname,
      item.opening_Quantity,
      item.opening_Cpt,
      item.opening_balanceqtyvalue,
      item.purchasevalQuantity,
      item.purchasediscount,
      Number(item.purchasegst || 0).toFixed(2),
      item.purchasegstprice,
      item.purchasetotal_Amount,
      Number(item.purchasediscountprice || 0).toFixed(2),
      item.usedQuantity,
      item.usedCpt,
      Number(item.usedvalue|| 0).toFixed(2),
      item.closingQuantity,
      item.closingcpt,
      item.closingtotalvalue
    ]);
  
    // Add totals row
    const totalsRow = [
      'Opening Balance Total:',
      '', '',
      Number(totalinfoss?.openingbalance_total || 0).toFixed(2),
      'Purchase Total:',
      '', '', '', '',
      Number(totalinfoss?.grand_total || 0).toFixed(2),
      'Used Value Total:',
      '',
      Number(totalinfoss?.grand_total_used_value || 0).toFixed(2),
      'Closing Balance Total:',
      '',
      Number(totalinfoss?.closingbalance_total || 0).toFixed(2)
    ];
  
    // Add empty rows for spacing between tables
    const emptyRows = [
      Array(16).fill(''),
      Array(16).fill('')
    ];
  
    // Supplier table headers
    const supplierTableHeaders = [
      ['Supplier Name', 'Price', 'Rec.Date', 'Due date', ...Array(12).fill('')]
    ];
  
    // Format supplier data
    const supplierTableData = supplierinfo.map(item => [
      item.suppliername,
      item.price,
      item.billdate,
      item.duedate,
      ...Array(12).fill('')
    ]);
  
    // Add supplier total
    const supplierTotalRow = [
      'Supplier Total:',
      Number(totalinfoss?.suppliertotal || 0).toFixed(2),
      '',
      '',
      ...Array(12).fill('')
    ];
  
    // Combine all data
    const allData = [
      ...mainTableHeaders,
      ...mainTableData,
      totalsRow,
      ...emptyRows,
      ...supplierTableHeaders,
      ...supplierTableData,
      supplierTotalRow
    ];
  
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(allData);
  
    // Calculate rows for different sections
    const supplierTableStartRow = mainTableHeaders.length + mainTableData.length + 1 + emptyRows.length;
  
    // Apply column merges for header sections
    ws['!merges'] = [
      // Month header merge
      { s: { r: 0, c: 0 }, e: { r: 0, c: 15 } },
      // Opening Balance merge
      { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
      // Purchase merge
      { s: { r: 1, c: 4 }, e: { r: 1, c: 9 } },
      // Used Value merge
      { s: { r: 1, c: 10 }, e: { r: 1, c: 12 } },
      // Closing Balance merge
      { s: { r: 1, c: 13 }, e: { r: 1, c: 15 } }
    ];
  
    // Apply styles
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 0; R <= range.e.r; R++) {
      for (let C = 0; C <= range.e.c; C++) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell_address]) continue;
  
        // Determine if cell is in header or total rows
        const isMainTableHeader = R < 3;
        const isMainTableTotal = R === mainTableHeaders.length + mainTableData.length;
        const isSupplierTableHeader = R === supplierTableStartRow;
        const isSupplierTableTotal = R === range.e.r;
        const isHeaderOrTotal = isMainTableHeader || isMainTableTotal || 
                               isSupplierTableHeader || isSupplierTableTotal;
  
        // Add cell styling
        ws[cell_address].s = {
          font: { 
            bold: isHeaderOrTotal
          },
          alignment: { 
            horizontal: 'center', 
            vertical: 'center'
          },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          },
          fill: isMainTableHeader ? {
            fgColor: { rgb: 'FFFFFF00' }, // Yellow background for headers
            patternType: 'solid'
          } : undefined
        };
      }
    }
  
    // Set column widths
    ws['!cols'] = Array(16).fill({ width: 15 });
  
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Report");
  
    // Save file
    XLSX.writeFile(wb, `Inventory_Report_${selectedMonthName}_${yearToUse}.xlsx`);
  };

  
 

  

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Inventory Report</h4>
      </div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="month">
            Select Month <span>:</span>
          </label>
          <select
            name="month"
            value={SearchformData.month}
            onChange={handleChange}
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
            onChange={handleChange}
          >
            <option value="">--Select Year--</option>
            {Array.from({ length: 10 }, (_, index) => {
              const year = new Date().getFullYear() - index;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handletoSearch}>
          Search
        </button>

        <button className="RegisterForm_1_btns" onClick={exportToExcel}>
          Export To Excel
        </button>
      </div>
      <div className="invcontainer">
      <div className="iiiioucon">
        <table className="eetable">
          <thead>
            <tr>
            <th className="monthHeader">Month of {`${selectedMonthName} -  ${yearToUse}`}</th>
              <th colSpan="3" className="secHead">OPENING BALANCE</th>
              <th colSpan="6" className="secHead">PURCHASE</th>
              <th colSpan="3" className="secHead">USED VALUE</th>
              <th colSpan="3" className="secHead">CLOSING BALANCE</th>
            </tr>
            <tr>
              <th className="comnHea">Item Name</th>

              <th className="comnHea">Balance Qty</th>
              <th className="comnHea">CPT</th>
              <th className="comnHea">Qty Value</th>

              <th className="comnHea">Quantity</th>
              <th className="comnHea">Discount</th>
              <th className="comnHea">Dis.Price</th>
              <th className="comnHea">GST</th>
              <th className="comnHea">Gst.Pri</th>
              <th className="comnHea">CPT</th>

              <th className="comnHea">Quantity</th>
              <th className="comnHea">CPT</th>
              <th className="comnHea">Value</th>
              <th className="comnHea">Quantity</th>
              <th className="comnHea">CPT</th>
              <th className="comnHea">Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((item, index) => (
               <React.Fragment key={index}>
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}>
                {console.log(item,"asdffdssdas")}
                
                <td className="rree">{item.itemname}</td>

                <td className="rac">{item.opening_Quantity}</td>
                <td className="rac">{item.opening_Cpt}</td>
                <td className="rac">{item.opening_balanceqtyvalue}</td>
                

                <td className="rac">{item.purchasevalQuantity}</td>
                <td className="rac">{item.purchasediscount}</td>
                <td className="rac">
    {Number(item.purchasediscountprice || 0).toFixed(2)}
</td>
                <td className="rac">{item.purchasegst}</td>
                <td className="rac">{item.purchasegstprice}</td>
                <td className="cenACll">{item.purchasetotal_Amount}</td>

                <td className="rac">{Number(item.usedQuantity || 0).toFixed(2)}</td>
                <td className="rac">{item.usedCpt}</td>
                <td className="rac">{Number(item.usedvalue|| 0).toFixed(2)}</td>

                <td className="rac">{Number(item.closingQuantity || 0).toFixed(2)}</td>
                <td className="rac">{item.closingcpt}</td>
                <td className="rac">{Number(item.closingtotalvalue || 0).toFixed(2)}</td>
                
              </tr>
              {index === filteredRows.length - 1 && totalinfoss && (
                    <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                      <td colSpan={3} className="rree">
                        Opening Balance Total:
                      </td>
                      <td className="rac">
                        {Number(totalinfoss.openingbalance_total || 0).toFixed(2)}
                      </td>
                     
                      <td colSpan={5} className="rree">
                        purchase Total:
                      </td>
                      <td className="rac">
                        {Number(totalinfoss.grand_total || 0).toFixed(2)}
                      </td>
                      <td colSpan={2} className="rree">
                        Used value Total:
                      </td>
                      <td className="rac">
                        {Number(totalinfoss.grand_total_used_value || 0).toFixed(2)}
                      </td>
                      <td colSpan={2} className="rree">
                        Closing balance total:
                      </td>
                      <td className="rac">
                        {Number(totalinfoss.closingbalance_total || 0).toFixed(2)}
                      </td>
                    </tr>
                  )}
              
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
       <br></br>     
      <div className="iiiioucon">
        <table className="eetable">
          <thead>
            <tr>
              <th className="secHead">Supplier Name</th>
              <th className="secHead">Price</th>
              <th className="secHead">Rec.Date</th>
              <th  className="secHead">Due date</th>
            </tr>
          </thead>
          <tbody>
            {supplierinfo.map((item, index) => (
               <React.Fragment key={index}>
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}>
                
                
                <td className="rree">{item.suppliername}</td>

                <td className="rac">{item.price}</td>
                <td className="rac">{item.billdate}</td>
                <td className="rac">{item.duedate}</td>
              
              </tr>
              {index === supplierinfo.length - 1 && totalinfoss && (
                    <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                      <td colSpan={1} className="rree">
                        Supplier Total:
                      </td>
                      <td className="rac">
                        {Number(totalinfoss.suppliertotal || 0).toFixed(2)}
                      </td>
                    </tr>
                  )}
              
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      
     
    </div>
  );
}

export default Inventoryreport;
