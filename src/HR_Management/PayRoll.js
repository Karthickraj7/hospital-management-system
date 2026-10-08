import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";





const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
        },
        root: {
          "& .MuiDataGrid-window": {
            overflow: "hidden !important",
          },
        },
        cell: {
          borderTop: "0px !important",
          borderBottom: "1px solid  var(--ProjectColor) !important",
        },
      },
    },
  },
});

const PayRoll = () => {

  const dispatchvalue = useDispatch();
  const userRecord = useSelector(state => state.userRecord?.UserData)
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [rows, setRows] = useState([]);
  const [rolename, setRolename] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedData = filteredRows.slice(page * pageSize, (page + 1) * pageSize);
  const [fromdate, setfromdate] = useState('')
  const [todate, settodate] = useState('')



  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_Designation_Details`)
      .then((response) => {
        console.log(response.data);
        setRolename(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UrlLink]);



  useEffect(() => {
    if (fromdate && todate) {

      axios.get(`${UrlLink}HR_Management/getforemployeepayrolllist`, {
        params: {
          location: userRecord?.location,
          fromdate,
          todate
        }
      })
        .then((response) => {
          console.log(response.data);
          setRows(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

  }, [userRecord?.location, fromdate, todate]);

  const navigate = useNavigate();

  const handleList = (params) => {
    console.log(params)

    const employeeid = params.EmployeeID
    const location = params.Location
    // axios.get(`${UrlLink}HRmanagement/for_Employee_Payslip?employeeid=${employeeid}&location=${location}&fromdate=${fromdate}&todate=${todate}`)
    //   .then((response) => {
    //     console.log(response.data)
    //     dispatchvalue({ type: 'employeedata', value: (response.data) })
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
    const updatedRowWithEditMode = { ...params, fromdate: fromdate };
    console.log(updatedRowWithEditMode)

    dispatchvalue({ type: "EmployeePaySlipData", value: updatedRowWithEditMode });

    navigate("/Home/PaySlip");
  };


  const handleSearchChange = (event) => {
    const { id, value } = event.target;

    if (id === "FirstName") {
      setSearchQuery(value);
    } else if (id === "PhoneNo") {
      setSearchQuery1(value);
    } else if (id === "designation") {
      console.log(value)
      setSearchQuery2(value);
    }
  };

  useEffect(() => {
    if (Array.isArray(rows) && rows) {
      const filteredData = Array.isArray(rows) ? rows.filter((row) => {
        const lowerCaseSupplierName = row?.EmployeeName?.toLowerCase();
        const lowerCasePhoneNo = row?.Contact_Number?.toString();
        // const lowerCaseDesignation = row?.Designation?.toLowerCase();

        const matchesFirstName = lowerCaseSupplierName?.includes(
          searchQuery.toLowerCase()
        );
        const matchesPhoneNo = lowerCasePhoneNo?.includes(
          searchQuery1.toLowerCase()
        );

        // const matchesDesignation = lowerCaseDesignation.includes(
        //   searchQuery2.toLowerCase()
        // );


        return (
          (matchesFirstName || !searchQuery) &&
          (matchesPhoneNo || !searchQuery1) 
          // &&
          // (matchesDesignation || !searchQuery2)
        );
      }) : [];

      setFilteredRows(filteredData);
    }

  }, [searchQuery, searchQuery1, rows]);


  const handleExportToExcel = () => {
    if (filteredRows.length !== 0) {
      const columns = [
        { dataKey: 'EmployeeID', header: 'Employee ID' },
        { dataKey: 'Location', header: 'Branch Name' },
        { dataKey: 'EmployeeName', header: 'Employee Name' },
        { dataKey: 'Designation', header: 'Designation' },
        { dataKey: 'PhoneNumber', header: 'Phone Number' },
        { dataKey: 'net_salary', header: 'Net Salary' },
        { dataKey: 'AccountName', header: 'Account Name' },
        { dataKey: 'AccountNumber', header: 'Account Number' },
        { dataKey: 'BankName', header: 'Bank Name' },
        { dataKey: 'Branch', header: 'Branch' },
        { dataKey: 'IFSCCode', header: 'IFSC Code' },
        { dataKey: 'PanNumber', header: 'PAN Number' }
      ];

      const header = columns.map(col => col.header);
      const csv = [
        '\ufeff' + header.join(","), // BOM + header row
        ...filteredRows.map(row => columns.map(col => row[col.dataKey]).join(",")),
      ].join("\r\n");

      var data = new Blob([csv], { type: "text/csv" });
      // saveAs(data, "EmployeePayrollReport.csv");
    } else {
      alert('No Data to Save');
    }
  };


  // const handleExportToPDF = () => {
  //   if (filteredRows.length !== 0) {
  //     const columns = [
  //       { dataKey: 'EmployeeID', header: 'Employee ID' },
  //       { dataKey: 'EmployeeName', header: 'Name' },
  //       { dataKey: 'PhoneNumber', header: 'Phone No' },
  //       { dataKey: 'net_salary', header: 'Net Salary' },
  //       { dataKey: 'AccountName', header: 'Account Name' },
  //       { dataKey: 'AccountNumber', header: 'A/C No' },
  //       { dataKey: 'BankName', header: 'Bank Name' },
  //       { dataKey: 'Branch', header: 'Branch' },
  //       { dataKey: 'IFSCCode', header: 'IFSC Code' },
  //       { dataKey: 'PanNumber', header: 'PAN Number' }
  //     ];

  //     const doc = new jsPDF({ orientation: 'landscape' });

  //     // Title
  //     doc.setFontSize(18);
  //     doc.text("Employee Payroll Report", 14, 22);

  //     // Calculate the total sum of net_salary
  //     const totalNetSalary = filteredRows.reduce((sum, row) => {
  //       return sum + (row.net_salary ? parseFloat(row.net_salary) : 0);
  //     }, 0);

  //     // Define autoTable options
  //     const autoTableOptions = {
  //       startY: 30,
  //       head: [columns.map(col => col.header)],
  //       body: [
  //         ...filteredRows.map(row => columns.map(col => row[col.dataKey] != null ? row[col.dataKey].toString() : '')),
  //         columns.map((col, index) => index === 3 ? `Total: ${totalNetSalary.toFixed(2)}` : '') // Add the total row
  //       ],
  //       theme: 'grid',
  //       styles: { fontSize: 10 },
  //       headStyles: { fillColor: [0, 0, 0] },
  //       columnStyles: columns.reduce((styles, col, index) => {
  //         styles[index] = { cellWidth: 'auto' };
  //         return styles;
  //       }, {})
  //     };

  //     // Create table
  //     doc.autoTable(autoTableOptions);

  //     // Convert to Blob and use saveAs
  //     const blob = doc.output('blob');
  //     saveAs(blob, "EmployeePayrollReport.pdf");
  //   } else {
  //     alert('No Data to Save');
  //   }
  // };



  const handleExportToPDF = () => {
    if (filteredRows.length !== 0) {
      const columns = [
        { dataKey: 'EmployeeID', header: 'Employee ID' },
        { dataKey: 'Location', header: 'Branch Name' },
        { dataKey: 'EmployeeName', header: 'Employee Name' },
        { dataKey: 'Designation', header: 'Designation' },
        { dataKey: 'PhoneNumber', header: 'Phone Number' },
        { dataKey: 'net_salary', header: 'Net Salary' },
        { dataKey: 'AccountName', header: 'Account Name' },
        { dataKey: 'AccountNumber', header: 'Account Number' },
        { dataKey: 'BankName', header: 'Bank Name' },
        { dataKey: 'Branch', header: 'Branch' },
        { dataKey: 'IFSCCode', header: 'IFSC Code' },
        { dataKey: 'PanNumber', header: 'PAN Number' }
      ];

      const doc = new jsPDF({ orientation: 'landscape' });

      // Title
      doc.setFontSize(18);
      doc.text("Payment History", 14, 22);

      // Calculate the total sum of net_salary

      // Define autoTable options
      const autoTableOptions = {
        startY: 30,
        head: [columns.map(col => col.header)],
        body: [
          ...filteredRows.map(row => columns.map(col => row[col.dataKey] != null ? row[col.dataKey].toString() : '')),

        ],
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 0, 0] },
        columnStyles: columns.reduce((styles, col, index) => {
          styles[index] = { cellWidth: 'auto' };
          return styles;
        }, {})
      };

      // Create table
      doc.autoTable(autoTableOptions);

      // Convert to Blob and use saveAs
      const blob = doc.output('blob');
      // saveAs(blob, `Paymenthistory4${getCurrentDate()}.pdf`);
    } else {
      alert('No Data to Save');
    }
  };


  const getCurrentDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate(); // Get day (1-31)
    const monthIndex = currentDate.getMonth(); // Get month index (0-11)
    const year = currentDate.getFullYear(); // Get full year (YYYY)

    // Convert month index to month name
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[monthIndex];

    // Format the date as desired
    const formattedDate = `${day} ${month}, ${year}`;

    return formattedDate;
  }



  const handleExportToPDFMonthlyReport = () => {
    if (filteredRows.length !== 0) {
      const columns = [
        { dataKey: 'EmployeeID', header: 'Employee ID' },
        { dataKey: 'EmployeeName', header: 'Name' },
        { dataKey: 'PhoneNumber', header: 'Phone No' },
        { dataKey: 'net_salary', header: 'Net Salary' }
      ];

      const doc = new jsPDF({ orientation: 'landscape' });

      // Title
      doc.setFontSize(18);
      doc.text(`Employee Payroll Report -  ${getCurrentDate()}`, 14, 22);

      // Calculate the total sum of net_salary
      const totalNetSalary = filteredRows.reduce((sum, row) => {
        return sum + (row.net_salary ? parseFloat(row.net_salary) : 0);
      }, 0);

      // Define autoTable options
      const autoTableOptions = {
        startY: 30,
        head: [columns.map(col => col.header)],
        body: [
          ...filteredRows.map(row => columns.map(col => row[col.dataKey] != null ? row[col.dataKey].toString() : '')),
          columns.map((col, index) => index === 3 ? { content: `Total: ${totalNetSalary.toFixed(2)}`, styles: { fontStyle: 'bold', fontSize: 14 } } : '') // Add the total row with bold style and increased font size
        ],
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0] },
        columnStyles: columns.reduce((styles, col, index) => {
          styles[index] = { cellWidth: 'auto' };
          return styles;
        }, {})
      };

      // Create table
      doc.autoTable(autoTableOptions);

      // Convert to Blob and use saveAs
      const blob = doc.output('blob');
      // saveAs(blob, "EmployeePayrollReport.pdf");
    } else {
      alert('No Data to Save');
    }
  };

  const handleonchange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'FromDate') {
      setfromdate(value)
    } else if (name === 'ToDate') {
      settodate(value)
    }

  }

  return (
    <div>
      <div className="appointment">
        <div className="h_head">
          <h4>Pay Roll</h4>
        </div>

        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Employee Name <span>:</span>
            </label>
            <input
              type="text"
              id="FirstName"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter the First Name"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">
              Phone No <span>:</span>
            </label>
            <input
              type="number"
              id="PhoneNo"
              value={searchQuery1}
              onChange={handleSearchChange}
              placeholder="Enter the Phone No"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">
              Designation <span>:</span>
            </label>
            <select
              name="designation"
              id="designation"
              value={searchQuery2}
              onChange={handleSearchChange}
              className="new-custom-input-phone vital_select"
              required
            >
              <option value="">Select</option>
              {Array.isArray(rolename) && rolename.length > 0 ? (
                rolename.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.Designation}
                  </option>
                ))
              ) : (
                <option disabled>No Option</option>
              )}
            </select>
          </div>
        </div>

        {/* <div className='PrintExelPdf'>
          
        </div> */}
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="FromDate">
              From Date<span>:</span>
            </label>
            <input
              type="date"
              id="FromDate"
              name="FromDate"
              onChange={handleonchange}
            />
          </div>
          <div className="inp_1">
            <label htmlFor="ToDate">
              To Date<span>:</span>
            </label>
            <input
              type="date"
              id="ToDate"
              name="ToDate"
              onChange={handleonchange}
            />
          </div>
        </div>
        <div className='PrintExelPdf'>
          <button onClick={handleExportToExcel}>Save Exel</button> or
          <button onClick={handleExportToPDF}>Save Pdf</button> or
          <button onClick={handleExportToPDFMonthlyReport}>Monthly Report</button>
        </div>
        <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th id="slectbill_ins">Employee ID</th>
                <th id="slectbill_ins">Employee Photo</th>
                <th id="slectbill_ins">Employee Name</th>
                <th id="slectbill_ins">Designation</th>
                <th id="slectbill_ins">Salary</th>
                <th id="slectbill_ins">Paid Status</th>
                <th id="slectbill_ins">Pay Slip & Approve</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.length > 0 && paginatedData?.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.Employee_ID}</td>
                  <td>{<img src={leave.Photo || leave.CaptureImage}
                    alt={leave.EmployeeName}
                    style={{ height: '50px', width: '50px', borderRadius: '100px' }}
                  />}</td>
                  <td>{leave.EmployeeName}</td>
                  <td>{leave.Designation}</td>
                  <td>{leave.SalaryType === "Stipend" ? leave.StipendAmount : leave.Net_salary}</td>
                  <td>{leave.PayslipStatus1}</td>
                  {(leave.PayslipStatus1 === 'Pending') && (
                    <td>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleList(leave)}
                        startIcon={<ArrowForwardIcon />}
                      >
                      </Button>
                    </td>
                  )}
                  {(leave.Paid_Status === 'Paid') && (
                    <td>
                      Completed
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        {totalPages > 1 && (
          <div className="grid_foot">
            <button
              onClick={() =>
                setPage((prevPage) => Math.max(prevPage - 1, 0))
              }
              disabled={page === 0}
            >
              Previous
            </button>
            Page {page + 1} of {totalPages}
            <button
              onClick={() =>
                setPage((prevPage) =>
                  Math.min(prevPage + 1, totalPages - 1)
                )
              }
              disabled={page === totalPages - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default PayRoll;

