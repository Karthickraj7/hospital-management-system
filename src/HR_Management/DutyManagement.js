import React, { useState, useEffect, useCallback } from "react";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
// import { saveAs } from "file-saver";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import jsPDF from "jspdf";
// import "jspdf-autotable";

// const theme = createTheme({
//   components: {
//     MuiDataGrid: {
//       styleOverrides: {
//         columnHeader: {
//           backgroundColor: "var(--ProjectColor)",
//         },
//         root: {
//           "& .MuiDataGrid-window": {
//             overflow: "hidden !important",
//           },
//         },
//         cell: {
//           borderTop: "0px !important",
//           borderBottom: "1px solid  var(--ProjectColor) !important",
//         },
//       },
//     },
//   },
// });

const DutyManagement = () => {
  // const dispatchvalue = useDispatch();

  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const [rows, setRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  // const [department, setdepartment] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [intime, setInTime] = useState("");
  const [outtime, setOutTime] = useState("");
  const [shiftstartdate, setshiftstartdate] = useState("");
  const [shiftenddate, setshiftenddate] = useState("");
  const [Status, setStatus] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [SelectedFile1, setSelectedFile1] = useState(null);
  const [rolename, setRolename] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [weekoffdata, setweekoffdata] = useState([]);
  const totalPages = Math.ceil(filteredRows.length / pageSize);

  const paginatedData = filteredRows?.slice(
    page * pageSize,
    (page + 1) * pageSize
  );
  const sortedData = [...paginatedData].sort((a, b) =>
    a.EmployeeID.localeCompare(b.EmployeeID)
  );

  const [dutyrostermasterdata, setdutyrostermasterdata] = useState([]);
  const [ShiftName, setShiftName] = useState("");
  const [OpenModal1, setOpenModal1] = useState(false);
  // const [LeaveCount, setLeaveCount] = useState([]);
  const [prevleavedetails, setprevleavedetails] = useState([]);
  const [SelectedRowData1, setSelectedRowData1] = useState(null);
  const [openModal2, setOpenModal2] = useState(false);
  const [selectedshift, setselectedshift] = useState([]);
  const [openModal3, setOpenModal3] = useState(false);
  const [shiftdata, setshiftdata] = useState([]);
  const [week, setWeek] = useState("");
  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");
  const [dutyrosterdataforreport, setdutyrosterdataforreport] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getStartAndEndOfWeek = (year, week) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay(); // Get the day of the week of Jan 1
    const startOfWeek = new Date(
      year,
      0,
      1 + (week - 1) * 7 - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    );

    // Add 6 days to get the end of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek),
    };
  };

  console.log(week);

  const handleExportToExcel = () => {
    axios
      .get(
        `${urllink}HRmanagement/get_shiftdetails_forreport?startdate=${startdate}&enddate=${enddate}&location=${userRecord?.location}`
      )
      .then((res) => {
        console.log(res);

        const { day_names, employee_shifts } = res.data;

        // Extract dates and day names for headers
        const dates = Object.keys(day_names);
        const headers = dates.map((date) => `${date} (${day_names[date]})`);

        // Prepare CSV columns
        const columns = ["SNo", "EmployeeID", "Staff", ...headers];

        // Prepare CSV rows
        let csvRows = [];
        let serialNo = 1;

        // Iterate over each employee and their shifts
        for (const [employeeId, shifts] of Object.entries(employee_shifts)) {
          // Initialize row with serial number, employee ID, and employee name
          const row = [serialNo++, employeeId];
          const shiftMap = {};
          let employeeName = "";

          // Populate the shiftMap with shift details and extract the employee name
          shifts.forEach((shift) => {
            shiftMap[
              shift.Date
            ] = `${shift.ShiftName} (${shift.Shift_StartTime}-${shift.Shift_EndTime})`;
            employeeName = shift.EmployeeName; // EmployeeName should be the same for all shifts
          });

          // Add employee name to the row
          row.push(employeeName);

          // Add shift details to the row for each date header
          dates.forEach((date) => {
            row.push(shiftMap[date] || ""); // Add shift details or empty string if not available
          });

          csvRows.push(row);
        }

        // Create CSV content
        const header = columns.join(",");
        const csvContent = [
          "\ufeff" + header, // BOM + header row
          ...csvRows.map((row) => row.join(",")),
        ].join("\r\n");

        // Create Blob and save CSV file
        const blob = new Blob([csvContent], { type: "text/csv" });
        // saveAs(blob, "WeeklyShiftDetails.csv");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    axios
      .get(
        `${urllink}HRmanagement/getallshiftforreport?location=${userRecord?.location}`
      )
      .then((res) => {
        console.log(res);
        setdutyrosterdataforreport(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userRecord]);

  const handleExportToPDF = () => {
    axios
      .get(
        `${urllink}HRmanagement/get_shiftdetails_forreport?startdate=${startdate}&enddate=${enddate}&location=${userRecord?.location}`
      )
      .then((res) => {
        console.log(res);
  
        const { day_names, employee_shifts } = res.data;
  
        // Extract dates and day names for headers
        const dates = Object.keys(day_names);
        const headers = dates.map((date) => `${day_names[date]} (${date})`);
  
        // Prepare PDF columns
        const columns = ["SNo", "EmployeeID", "EmployeeName", ...headers];
        const rows = [];
  
        // Prepare PDF rows
        let serialNo = 1;
  
        // Convert employee_shifts object to an array and sort by EmployeeID
        const sortedEmployeeShifts = Object.entries(employee_shifts).sort(([idA], [idB]) => idA.localeCompare(idB));
  
        // Iterate over each employee and their shifts
        for (const [employeeId, shifts] of sortedEmployeeShifts) {
          const row = [serialNo++, employeeId];
          const shiftMap = {};
          let employeeName = "";
  
          shifts.forEach((shift) => {
            shiftMap[
              shift.Date
            ] = `${shift.ShiftName} (${shift.Shift_StartTime}-${shift.Shift_EndTime})`;
            employeeName = shift.EmployeeName;
          });
  
          row.push(employeeName);
  
          dates.forEach((date) => {
            const shiftForDate = shiftMap[date] || "";
            row.push(shiftForDate);
          });
  
          rows.push(row);
        }
  
        // Create a PDF document with landscape orientation
        const doc = new jsPDF("l", "mm", "a4");
  
        // Add table to PDF
        doc.autoTable({
          head: [columns],
          body: rows,
          startY: 20,
          margin: { horizontal: 10 },
          theme: "striped",
          styles: {
            fontSize: 9, // Font size for table
            cellPadding: 4,
          },
          headStyles: {
            fillColor: [227, 189, 255], // Light blue color
            textColor: [0, 0, 0],
          },
          didParseCell: function (data) {
            // Debug log to check cell text
            console.log('Cell text:', data.cell.text);
            // Apply background color if the cell contains "Week OFF"
            if (data.column.index > 2 && data.cell.text.includes("Week OFF (-)")) {
              data.cell.styles.fillColor = [255, 217, 217]; // Red background color
              // data.cell.styles.textColor = [255, 0, 0]; // White text color
            }
          },
          didDrawPage: function (data) {
            // Add title to each page
            doc.text(
              `Weekly Shift Details - ${startdate} To ${enddate}`,
              14,
              11
            );
  
            // Define footer content
            const shiftDetails = dutyrosterdataforreport
              .map((shift) => `${shift.ShiftShortcutName} : ${shift.ShiftTime}`)
              .join(" , ");
  
            // Split shift details into chunks of 7 shifts per row
            const shiftDetailArray = shiftDetails.split(" , ");
            const lines = [];
            for (let i = 0; i < shiftDetailArray.length; i += 7) {
              lines.push(shiftDetailArray.slice(i, i + 7).join(" , "));
            }
  
            // Increase font size only for footer
            doc.setFontSize(9); // Font size for footer
            doc.setTextColor(100);
            doc.setFont("helvetica", "bold"); // Set font to bold
  
            // Calculate vertical position of the footer
            const pageHeight = doc.internal.pageSize.height;
            const footerHeight = 5; // Height for each line of footer text
            const startY = pageHeight - footerHeight * lines.length - 2; // Adjust for margin
  
            // Add footer lines to the bottom of the page
            lines.forEach((line, index) => {
              doc.text(line, 1, startY + index * footerHeight);
            });
          },
        });
  
        // Save the PDF
        doc.save("WeeklyShiftDetails.pdf");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  
  
  

  useEffect(() => {
    axios
      .get(`${urllink}HRmanagement/getRole_all`)
      .then((response) => {
        setRolename(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.location, urllink]);

  const handleEditClick1 = (params) => {
    console.log(params);
    setOpenModal(true);
    setSelectedRowData(params);

    if (params.shifttime) {
      const parts = params?.shifttime?.split("to");

      // Extract the start time and end time
      const startTime = parts[0].trim(); // "08:00 AM"
      const endTime = parts[1].trim(); // "04:00 PM"

      // Convert start time to 24-hour format
      const startDate = new Date(`2000-01-01 ${startTime}`);
      const startHour24 = startDate.getHours();
      const startMinute = startDate.getMinutes();
      const Intime = `${startHour24
        .toString()
        .padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;

      // Convert end time to 24-hour format
      const endDate = new Date(`2000-01-01 ${endTime}`);
      const endHour24 = endDate.getHours();
      const endMinute = endDate.getMinutes();
      const Outtime = `${endHour24
        .toString()
        .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

      setshiftstartdate(params.Shift_StartDate);
      setshiftenddate(params.shiftenddate);
      setShiftName(params.ShiftName);
      setInTime(Intime);
      setOutTime(Outtime);
    }
  };

  const fetchemployeedutydata = useCallback(() => {
    axios
      .get(
        `${urllink}HRmanagement/get_employee_personaldetails_forduty?location=${userRecord?.location}`
      )
      .then((response) => {
        const data = response.data;
        console.log(data);

        setRows(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord, urllink]);

  React.useState(() => {
    fetchemployeedutydata();
  }, []);

  useEffect(() => {
    setSelectedRowData(rows);
  }, [rows]);

  const handleSubmission = () => {
    const apiUrl = `${urllink}HRmanagement/insert_Shift_Details`;

    const submissionData = {
      employeeid: selectedRowData.EmployeeID,
      employeename: selectedRowData.EmployeeName,
      location: selectedRowData.Locations,
      department: selectedRowData.Department,
      designation: selectedRowData.Designation,
      outtime: outtime,
      intime: intime,
      shiftstartdate: shiftstartdate,
      shiftenddate: shiftenddate,
      createdby: userRecord?.username,
      branchlocation: userRecord?.location,
      Status: Status,
      ShiftName: ShiftName,
    };

    const formData1 = new FormData();
    console.log("submissionData", submissionData);

    // Append data to FormData object
    Object.keys(submissionData).forEach((key) => {
      formData1.append(key, submissionData[key]);
    });

    axios
      .post(apiUrl, formData1, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        handleclosemodal1();
        // setShiftName('');
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
    setOpenModal(false);
    navigate("/Home/Duty-Management");
  };

  useEffect(() => {
    if (Array.isArray(rows)) {
        const filteredData = rows.filter((row) => {
            const lowerEmployeeName = row.EmployeeName.toLowerCase();
            const lowerCaseDesignation = row.Designation.toLowerCase();
            const lowerCaseEmployeeID = row.EmployeeID.toLowerCase();

            const matchesEmployeeName = lowerEmployeeName.includes(
                searchQuery.toLowerCase()
            );

            const matchesemployeeid = lowerCaseEmployeeID.includes(
                searchQuery2.toLowerCase()
            );
            const matchesdegination = lowerCaseDesignation.includes(
                searchQuery1.toLowerCase()
            );

            return (
                (matchesEmployeeName || !searchQuery) &&
                (matchesemployeeid || !searchQuery2) &&
                (matchesdegination || !searchQuery1)
            );
        });

        setFilteredRows(filteredData);
    } else {
        console.error("rows is not an array or is undefined");
        setFilteredRows([]); // Set to an empty array or handle as needed
    }
}, [searchQuery1, searchQuery2, rows, searchQuery]);


  const handleFileChange1 = (event) => {
    setSelectedFile1(null);
    console.log(event.target.files[0]);
    setSelectedFile1(event.target.files[0]);
  };

  const handleCsvupload1 = () => {
    console.log(SelectedFile1);
    const formData1 = new FormData();
    formData1.append("file", SelectedFile1);
    formData1.append("CreatedBy", userRecord?.username);
    formData1.append("location", userRecord?.location);

    if (SelectedFile1) {
      axios
        .post(
          `${urllink}HRmanagement/post_chirayuattendnace_csvfile`,
          formData1
        )
        .then((response) => {})
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    axios
      .get(
        `${urllink}HRmanagement/getDutyRosterMasterData?location=${userRecord?.location}`
      )
      .then((response) => {
        console.log(response.data);
        setdutyrostermasterdata(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.location, urllink]);

  const handleShiftNameChange = (e) => {
    const selectedShiftName = e.target.value;
    const selectedShift = dutyrostermasterdata.find(
      (shift) => shift.ShiftName === selectedShiftName
    );
    setShiftName(selectedShiftName);
    if (selectedShift) {
      setInTime(selectedShift.StartTime);
      setOutTime(selectedShift.EndTime);
    } else {
      setInTime("");
      setOutTime("");
    }
  };

  const handleViewClick = (params) => {
    console.log(params);
    setSelectedRowData1(params);
    setOpenModal1(true);
    if (params.Status === "On Leave") {
      axios
        .get(
          `${urllink}HRmanagement/get_all_leave_register_by_employeeid?location=${params.Locations}&EmployeeID=${params.EmployeeID}`
        )
        .then((response) => {
          const data = response.data;
          console.log("data", data);
          setprevleavedetails(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (params.Status === "WeekOff") {
      axios
        .get(
          `${urllink}HRmanagement/get_weekoff_days?location=${params.Locations}&EmployeeID=${params.EmployeeID}`
        )
        .then((response) => {
          const data = response.data;
          console.log("data", data);
          setweekoffdata(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleviewshiftdetails = (params) => {
    fetchemployeedutydata();
    console.log(params);
    setselectedshift(params.shift_details);
    setOpenModal2(true);
  };

  const handlechangeshift = useCallback(
    (employeeID, location) => {
      console.log(employeeID, location);

      // Perform GET request to retrieve shift details
      axios
        .get(
          `${urllink}HRmanagement/Get_shift_details_for_HR?employeeid=${employeeID}&location=${location}`
        )
        .then((res) => {
          setshiftdata(res.data);
          setOpenModal3(true);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [urllink] // Only urllink is needed here
  );

  const handlestatus = (params) => {
    const confirm = window.confirm("Are you sure complte the Shift");

    if (confirm) {
      console.log(params);
      let newstatus;
      if (params.Status === "Active") {
        newstatus = "Completed";
      } else if (params.Status === "Completed") {
        newstatus = "Active";
      } else if (params.Status === "WeekOff") {
        newstatus = "Weekoff ( Completed )";
      }

      axios
        .post(
          `${urllink}HRmanagement/updateshiftstatusdata?EmployeeID=${params.EmployeeID}&Shift_StartDate=${params.Shift_StartDate}&Shift_EndDate=${params.Shift_EndDate}&newstatus=${newstatus}`
        )
        .then((res) => {
          console.log(res);
          handlechangeshift(res.data.EmployeeID, userRecord?.location);
          setOpenModal3(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleclosemodal1 = () => {
    setOpenModal(false);
    setShiftName("");
    setInTime("");
    setOutTime("");
    setshiftstartdate("");
    setshiftenddate("");
  };

  const handleclosemodel3 = () => {
    setOpenModal3(false);
    fetchemployeedutydata();
  };
  const handleDateChange = (e) => {
    const { value } = e.target;
    if (value) {
      setWeek(value);
      const [year, weekNumber] = value.split("-W");
      const { start, end } = getStartAndEndOfWeek(
        year,
        parseInt(weekNumber, 10)
      );

      console.log(`Start of week: ${start}`);
      console.log(`End of week: ${end}`);

      setstartdate(start);
      setenddate(end);
    }
  };
  return (
    <div>
      <div className="appointment">
        <div className="h_head">
          <h4>Duty Management</h4>
        </div>

        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Employee Name <span>:</span>
            </label>
            <input
              type="text"
              id="date"
              name="employeeName"
              placeholder="Enter Employee Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">
              Designation <span>:</span>
            </label>
            <select
              name="designation"
              value={searchQuery1}
              onChange={(e) => setSearchQuery1(e.target.value)}
              className="new-custom-input-phone vital_select"
              required
            >
              <option value="">Select </option>
              {rolename && rolename.length > 0 ? (
                rolename.map((role) => (
                  <option key={role.role_id} value={role.role_name}>
                    {role.role_name}
                  </option>
                ))
              ) : (
                <option disabled>No roles available</option>
              )}
            </select>
          </div>
        </div>
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Employee ID<span>:</span>
            </label>
            <input
              type="text"
              id="employeeID"
              name="employeeID"
              placeholder="Enter Employee ID"
              value={searchQuery2}
              onChange={(e) => setSearchQuery2(e.target.value)}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              {" "}
              Upload CSV File <span>:</span>{" "}
            </label>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              id="Servicechoose"
              required
              style={{ display: "none" }}
              onChange={handleFileChange1}
            />
            <label
              htmlFor="Servicechoose"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
            <button
              className="RegisterForm_1_btns choose_file_update"
              onClick={handleCsvupload1}
            >
              Upload
            </button>
          </div>
        </div>

        <div className="con_1">
          <div className="inp_1">
            <label htmlFor="week">
              Select Week<span>:</span>
            </label>
            <input
              type="week"
              id="week"
              name="week"
              value={week}
              onChange={handleDateChange}
            />
          </div>
          {/* <div className="inp_1">
            <label htmlFor="todate">
              To Date<span>:</span>
            </label>
            <input
              type="date"
              id="todate"
              name="todate"
              value={todate}
              onChange={handledatechange}
            />
          </div> */}
        </div>

        <div className="PrintExelPdf">
          <button onClick={handleExportToExcel}>Save Exel</button>
        </div>
        <div className="PrintExelPdf">
          <button onClick={handleExportToPDF}>Save Pdf</button>
        </div>
      </div>

      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th id="slectbill_ins">Employee ID</th>
              <th id="slectbill_ins">Employee Name</th>
              <th id="slectbill_ins">Designation</th>
              <th id="slectbill_ins">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedData &&
              sortedData.map((row) => {
                // const isOnLeave = row.leave_status === "On Leave";

                return (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor:
                        row.status === "Active" ? "#93ff788f" : "transparent", // Green background if Active
                      color: row.status === "Active" ? "white" : "black", // White text if Active
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    <td>{row.EmployeeID}</td>
                    <td>{row.EmployeeName}</td>
                    <td>{row.Designation}</td>
                    <td
                      style={{
                        backgroundColor:
                          row.leave_status === "On Leave"
                            ? "rgb(255 166 166 / 56%)"
                            : "transparent", // Green background if Active
                        color: row.status === "Active" ? "white" : "black", // White text if Active
                        padding: "4px",
                        borderRadius: "4px",
                      }}
                    >
                      {row.leave_status != "On Leave" ? (
                        <>
                          <Button
                            className="cell_btn"
                            onClick={() => handleEditClick1(row)}
                          >
                            <EditIcon className="check_box_clrr_cancell" />
                          </Button>
                          <Button
                            className="cell_btn"
                            onClick={() =>
                              handlechangeshift(
                                row.EmployeeID,
                                userRecord?.location
                              )
                            }
                          >
                            <PublishedWithChangesIcon className="check_box_clrr_cancell" />
                          </Button>
                          <Button
                            className="cell_btn"
                            onClick={() => handleviewshiftdetails(row)}
                          >
                            <VisibilityIcon className="check_box_clrr_cancell" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="cell_btn"
                            onClick={() => handleviewshiftdetails(row)}
                          >
                            <span
                              style={{
                                padding: "5px",
                                display: "flex",
                                gap: "15px",
                              }}
                            >
                              On Leave{" "}
                              <VisibilityIcon className="check_box_clrr_cancell" />
                            </span>{" "}
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="grid_foot">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          Page {page + 1} of {totalPages}
          <button
            onClick={() =>
              setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))
            }
            disabled={page === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={handleclosemodal1}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="ShiftName">
                  Shift Name<span>:</span>
                </label>
                <select
                  type="text"
                  name="ShiftName"
                  value={ShiftName}
                  onChange={handleShiftNameChange}
                >
                  <option value="">Select</option>
                  {dutyrostermasterdata.map((shift, index) => (
                    <option key={index} value={shift.ShiftName}>
                      {shift.ShiftName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="intime">
                  From Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={shiftstartdate}
                  onChange={(e) => {
                    setshiftstartdate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="intime">
                  To Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={shiftenddate}
                  onChange={(e) => {
                    setshiftenddate(e.target.value);
                  }}
                />
              </div>
            </div>

            {ShiftName && (
              <>
                <div className="RegisFormcon leavecon">
                  <div className="RegisForm_1 leaveform_1">
                    <label htmlFor="intime">
                      In Time<span>:</span>
                    </label>
                    <input
                      type="time"
                      name="intime"
                      value={intime}
                      onChange={(e) => {
                        setInTime(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="RegisFormcon leavecon">
                  <div className="RegisForm_1 leaveform_1 ">
                    <label htmlFor="outtime">
                      Out Time <span>:</span>
                    </label>
                    <input
                      type="time"
                      name="outtime"
                      id="outtime"
                      value={outtime}
                      onChange={(e) => {
                        setOutTime(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="Status">
                  Status <span>:</span>
                </label>
                <select
                  name="Status"
                  id="Status"
                  value={Status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  <option value="Active">Active</option>
                  <option value="WeekOff">Week Off</option>
                  <option value="On leave">On leave</option>
                  <option value="Follow-up Duty">Follow-up Duty</option>
                </select>
              </div>
            </div>

            <div className="Register_btn_con regster_btn_contsai">
              <button
                className="RegisterForm_1_btns"
                onClick={handleSubmission}
              >
                Submit
              </button>
              <button
                className="RegisterForm_1_btns"
                onClick={handleclosemodal1}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {console.log(SelectedRowData1)}

      {OpenModal1 && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal1(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason foradvanceview"
            onClick={(e) => e.stopPropagation()}
          >
            {SelectedRowData1?.Status === "WeekOff" ? (
              <>
                <div className="Add_items_Purchase_Master">
                  <span>Week Off Details</span>
                </div>
                <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th id="slectbill_ins">From Date</th>
                        <th id="slectbill_ins">To Date</th>
                        <th id="slectbill_ins">Days</th>
                        <th id="slectbill_ins">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekoffdata.length > 0 &&
                        weekoffdata.map((leave, index) => (
                          <tr key={index}>
                            <td>{leave.Shift_StartDate}</td>
                            <td>{leave.Shift_EndDate}</td>
                            <td>{leave.NumOfDays || "-"}</td>
                            <td>{leave.Status}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="Add_items_Purchase_Master">
                  <span>Leave Details</span>
                </div>
                <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th id="slectbill_ins">Leave Type</th>
                        <th id="slectbill_ins">From Date</th>
                        <th id="slectbill_ins">To Date</th>
                        <th id="slectbill_ins">Days</th>
                        <th id="slectbill_ins">Reason</th>
                        <th id="slectbill_ins">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prevleavedetails.length > 0 &&
                        prevleavedetails.map((leave, index) => (
                          <tr key={index}>
                            <td>{leave.LeaveType}</td>
                            <td>{leave.FromDate}</td>
                            <td>{leave.ToDate}</td>
                            <td>{leave.days}</td>
                            <td>{leave.Reason}</td>
                            <td>{leave.status}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <button
              className="RegisterForm_1_btns"
              onClick={() => setOpenModal1(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {openModal2 && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal2(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason foradvanceview"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Add_items_Purchase_Master">
              <span>Shift Details</span>
            </div>
            <div className="Selected-table-container">
              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th id="slectbill_ins">Shift Start Date</th>
                    <th id="slectbill_ins">Shift End Date</th>
                    <th id="slectbill_ins">Shift Name</th>
                    <th id="slectbill_ins">Shift Timing</th>
                    <th id="slectbill_ins">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedshift.length > 0 &&
                    selectedshift.map((leave, index) => (
                      <tr key={index}>
                        <td>{leave.Shift_StartDate}</td>
                        <td>{leave.Shift_EndDate}</td>
                        <td>{leave.ShiftName || "-"}</td>
                        <td>{leave.shifttime || "-"}</td>
                        <td>{leave.Status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <br />
            <button
              className="RegisterForm_1_btns"
              onClick={() => setOpenModal2(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {openModal3 && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={handleclosemodel3}
        >
          <div
            className="newwProfiles newwPopupforreason uwagduaguleaveauto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Add_items_Purchase_Master">
              <span>Shift Details</span>
            </div>
            <div className="Selected-table-container">
              <table className="selected-medicine-table2">
                <thead>
                  <tr>
                    <th id="slectbill_ins">Shift Start Date</th>
                    <th id="slectbill_ins">Shift End Date</th>
                    <th id="slectbill_ins">Shift Name</th>
                    <th id="slectbill_ins">Shift Timing</th>
                    <th id="slectbill_ins">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log(shiftdata)}
                  {shiftdata.length > 0 &&
                    shiftdata.map((leave, index) => {
                      const status = leave.Status;
                      const cellStyle = {
                        backgroundColor:
                          status === "Active"
                            ? "rgba(147, 255, 120, 0.56)"
                            : "transparent" || status === "WeekOff"
                            ? "#ffc0c0"
                            : "transparent",
                        color:
                          status === "Active"
                            ? "white"
                            : "black" || status === "WeekOff"
                            ? "white"
                            : "black",
                        padding: "8px",
                        borderRadius: "4px",
                        textAlign: "center",
                        border: "none",
                      };

                      return (
                        <tr key={index}>
                          <td>{leave.Shift_StartDate}</td>
                          <td>{leave.Shift_EndDate}</td>
                          <td>{leave.ShiftName || "-"}</td>
                          <td>{leave.shifttime || "-"}</td>
                          <td style={cellStyle}>
                            {status !== "Completed" &&
                            status !== "Weekoff ( Completed )" ? (
                              <button
                                className="cell_btn"
                                onClick={() => handlestatus(leave)}
                                style={{
                                  border: "none",
                                  backgroundColor: "transparent",
                                  padding: "3px",
                                }}
                              >
                                {status}
                              </button>
                            ) : (
                              <span>{status}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <br />
            <button className="RegisterForm_1_btns" onClick={handleclosemodel3}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DutyManagement;

