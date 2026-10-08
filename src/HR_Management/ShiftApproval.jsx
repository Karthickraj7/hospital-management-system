import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Visibility from "@mui/icons-material/Visibility";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import "./EmployeeDutyManagement.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import PlaylistAddTwoToneIcon from "@mui/icons-material/PlaylistAddTwoTone";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Required for select event
import PlaylistRemoveTwoToneIcon from "@mui/icons-material/PlaylistRemoveTwoTone";
import PreviewIcon from "@mui/icons-material/Preview";
import AddTaskIcon from "@mui/icons-material/AddTask";

function ShiftApproval() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatch = useDispatch();
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [Filterdata, setFilterdata] = useState([]);
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    designation: "",
  });
  const [SearchQuery, setSearchQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [rolename, setRolename] = useState([]);
  const [openRow, setOpenRow] = useState(null); // Store the currently open row
  const [expandedDepartment, setExpandedDepartment] = useState(null);
  const [bulkAssign, setBulkAssign] = useState(false); // For bulk assignment mode

  const [bulkApprove, setBulkApprove] = useState(false);
  const [bulkChange, setBulkChange] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [selectedEmployees, setSelectedEmployees] = useState([]); // To track selected employees
  const [openModal1, setOpenModal1] = useState(false);
  const [currentshifts, setcurrentshifts] = useState([]);
  const [OpenDepartmentShiftDetailsModal, setOpenDepartmentShiftDetailsModal] =
    useState(false);
  const [selecteddept, setselecteddept] = useState({});
  const [AssignedDeprtmentShifts, setAssignedDeprtmentShifts] = useState([]);
  const [CheckedEmployees, setCheckedEmployees] = useState([]);
  const [actionType, setActionType] = useState(""); // To track "Approval" or "Change"
  const [editShiftId, setEditShiftId] = useState(null);
  const [MasterShifts, setMasterShifts] = useState([]);
  const [enddate, setenddate] = useState("");
  const [startdate, setstartdate] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [shiftDetails, setShiftDetails] = useState([]);

  const handleSelectEmployee = (shiftId) => {
    if (CheckedEmployees.includes(shiftId)) {
      setCheckedEmployees(CheckedEmployees.filter((id) => id !== shiftId));
    } else {
      setCheckedEmployees([...CheckedEmployees, shiftId]);
    }
  };

  const handleChange1 = (field, value, row) => {
    console.log(value);
    const updatedShifts = [...AssignedDeprtmentShifts];
    const shiftIndex = updatedShifts.findIndex(
      (shift) => shift.Employee_Shift_Id === row.Employee_Shift_Id
    );
    console.log(row);
    console.log(updatedShifts);
    const newshift = updatedShifts.filter(
      (p) => p.Employee_Shift_Id === row.Employee_Shift_Id
    );

    const newshiftidget = MasterShifts.filter((p) => p.ShiftName === value)[0];
    console.log(newshiftidget);

    console.log(newshift[0]);
    if (newshift) {
      updatedShifts[shiftIndex][field] = value; // Update the shift details
      updatedShifts[shiftIndex].isShiftChanged = true;
      updatedShifts[shiftIndex]["NewShiftId"] = newshiftidget.ShiftId;
    }
    console.log(updatedShifts);
    setAssignedDeprtmentShifts(updatedShifts);
  };

  const handleEditClick = () => {};

  const handleSubmit = () => {
    const sendData = AssignedDeprtmentShifts.map((shift) => {
      const data = { Employee_Shift_Id: shift.Employee_Shift_Id };

      // If the ShiftName was changed, include the new ShiftId
      if (shift.isShiftChanged) {
        data.NewShiftId = shift.NewShiftId; // Include the NewShiftId for unchanged employees
        data.ShiftDate = shift.ShiftDate; // Include the NewShiftId for unchanged employees
        data.Employee_ID = shift.Employee_ID;
      }
      data.Status = "Approved";
      return data;
    });

    axios
      .post(`${UrlLink}HR_Management/Bulk_ShiftApprove`, sendData)
      .then((res) => {
        console.log(res);
        const rest = res.data;
        console.log(rest);
        const type = Object.keys(rest)[0];
        const mess = Object.values(rest)[0];
        dispatch({ type: "toast", value: { message: mess, type } });
        setTimeout(() => {
          setOpenDepartmentShiftDetailsModal(false);
        }, 500);
      })
      .catch((err) => console.log(err));

    // Post data
    console.log(sendData);
  };

  const handleAssignBulkShifts = () => {
    setOpenModal1(true);
    setcurrentshifts(selectedEmployees[0]?.Shifts);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedEmployees([]);
    } else {
      setCheckedEmployees(
        AssignedDeprtmentShifts.map((shift) => shift.Employee_Shift_Id)
      );
    }
    setSelectAll(!selectAll);
  };

  const handleBulkAssignToggle = (event, type) => {
    const isBulkSelected = event.target.value === "yes";

    if (type === "Approve") {
      setBulkApprove(isBulkSelected);
      setBulkChange(false);
    } else if (type === "Change") {
      setBulkChange(isBulkSelected);
      setBulkApprove(false);
    }

    setActionType(isBulkSelected ? type : "");
    if (!isBulkSelected) {
      setCheckedEmployees([]); // Clear selection if "No" is checked
      setSelectAll(false);
    }
  };

  const toggleRow = (departmentId, departmentName) => {
    if (openRow === departmentId) {
      // If already expanded, collapse it
      setOpenRow(null);
      setExpandedDepartment(null);
    } else {
      // Expand the new department, replacing the previous one
      setOpenRow(departmentId);
      setExpandedDepartment({ id: departmentId, name: departmentName });
    }
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_Designation_Details`)
      .then((response) => {
        setRolename(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UrlLink]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchChangeStatus = (e) => {
    const { name, value } = e.target;
    setsearchOPParams({ ...searchOPParams, [name]: value });
  };

  useEffect(() => {
    const datatosend = {
      ...searchOPParams,
      QueueType: "ShiftApproval",
    };
    axios
      .get(`${UrlLink}HR_Management/Employee_DutyManagement_Details`, {
        params: datatosend,
      })
      .then((res) => {
        console.log(res);
        const ress = res.data;

        if (Array.isArray(ress)) {
          setPatientRegisterData(ress);
          setFilterdata(ress);
        } else {
          setPatientRegisterData([]);
          setFilterdata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchOPParams, refresh]);

  const handleCloseModal1 = () => {
    setOpenModal1(false);
    setstartdate("");
    setenddate("");
    setWeekDates([]);
    setShiftDetails({
      intime: "",
      outtime: "",
      Shiftstartdate: "",
      Shiftenddate: "",
      Status: "Active",
      shiftName: "",
    });
  };

  const handleviewDepartmentShifts = (row) => {
    console.log(row);
    setAssignedDeprtmentShifts(row?.DepartmentAssignShift);
    setselecteddept(row);
    setOpenDepartmentShiftDetailsModal(true);
    setMasterShifts(row.Employees[0].Shifts);
  };

  const handleShiftSubmit1 = async () => {
    console.log(bulkAssign);
    if (bulkAssign) {
      const shiftDataArray = weekDates.map((date) => ({
        ShiftDate: date, // the date string
        Shift_Id: shiftDetails[date] || "",
        Create_by: userRecord?.username,
        Status: "Pending",
      }));

      const newdata = {
        shiftdata: shiftDataArray,
        selectedEmployees,
        bulkAssign,
        Create_by: userRecord?.username || "",
        Location_Name: userRecord?.location || "",
        openRow,
        Status: "Pending",
      };
      console.log(newdata);
      axios
        .post(`${UrlLink}HR_Management/DutyAssign_IndEmployee`, newdata)
        .then((res) => {
          if (res.data.errors) {
            const errorMessages = res.data.errors
              .map((error) =>
                Object.entries(error).map(([key, value]) => `${key}: ${value}`)
              )
              .join("\n");
            dispatch({
              type: "toast",
              value: { message: errorMessages, type: "warn" },
            });
          } else {
            dispatch({
              type: "toast",
              value: {
                message: "All shifts added successfully",
                type: "success",
              },
            });
          }
        })
        .catch((err) => console.error(err));
    } else {
      const shiftDataArray = weekDates.map((date) => ({
        ShiftDate: date, // the date string
        Shift_Id: shiftDetails[date] || "",
        Create_by: userRecord?.username,
        Status: "Active",
      }));
      console.log(selectedRowData);
      console.log(shiftDataArray);
      const postData = {
        Employee: selectedRowData?.Employee_Id, // or selectedRowData?.id, based on your data structure
        shiftdata: shiftDataArray,
        Location_Name: userRecord?.location,
        Create_by: userRecord?.username,
        Status: "Active",
        bulkAssign: false,
      };

      console.log(postData);
      axios
        .post(`${UrlLink}HR_Management/DutyAssign_IndEmployee`, postData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const EmployeeListColumns = (
    employeeList,
    selectedEmployees,
    setSelectedEmployees
  ) => [
    ...(bulkAssign
      ? [
          {
            key: "select",
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="checkbox"
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    setSelectedEmployees(() => {
                      if (isChecked) {
                        return employeeList; // Select all employees
                      } else {
                        return []; // Deselect all employees
                      }
                    });
                  }}
                  checked={
                    selectedEmployees.length === employeeList.length &&
                    employeeList.length > 0
                  }
                />
              </div>
            ),
            width: 50,
            renderCell: (params) => {
              const { Employee_ID } = params.row;
              const isChecked = selectedEmployees.some(
                (emp) => emp.Employee_ID === Employee_ID
              );

              const handleCheckboxChange = (event) => {
                setSelectedEmployees((prev) => {
                  if (event.target.checked) {
                    return [...prev, params.row];
                  } else {
                    return prev.filter(
                      (emp) => emp.Employee_ID !== Employee_ID
                    );
                  }
                });
              };

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </div>
              );
            },
          },
        ]
      : []),
    { key: "id", name: "S.No" },
    { key: "Employee_ID", name: "Employee Id" },
    { key: "EmployeeName", name: "Employee Name" },
    { key: "PhoneNo", name: "Phone No" },
    { key: "Designation", name: "Designation" },
    { key: "Department", name: "Department" },
    {
      key: "Action",
      name: "Action",
      width: 180,
      renderCell: (params) => {
        // Get the current date in YYYY-MM-DD format
        const currentDate = format(new Date(), "yyyy-MM-dd");
        console.log("currentDate", currentDate);

        const isCurrentDateInRange =
          params.row.FromDate &&
          params.row.ToDate &&
          currentDate >= params.row.FromDate &&
          currentDate <= params.row.ToDate;

        const isCurrentDateInShiftRange =
          params.row.shift_start &&
          params.row.shift_end &&
          currentDate >= params.row.shift_start &&
          currentDate <= params.row.shift_end;

        const isCurrentDateAttendance =
          params.row.Date && currentDate >= params.row.Date;

        // Determine the transformedStatus based on the condition
        let transformedStatus = "";
        if (isCurrentDateInRange && params.row.Status === "Approved") {
          transformedStatus = "OnLeave";
        } else if (isCurrentDateInShiftRange && params.row.Statuss !== "") {
          transformedStatus = params.row.Statuss;
        } else if (
          isCurrentDateAttendance &&
          params.row.StatusAttendance !== ""
        ) {
          transformedStatus = params.row.StatusAttendance;
        }

        // Condition to hide icons and show Status (OnLeave or WeekOff)
        const shouldHideIcons =
          (isCurrentDateInRange ||
            isCurrentDateInShiftRange ||
            isCurrentDateAttendance) &&
          transformedStatus !== "";

        return (
          <div style={{ display: "flex" }}>
            {shouldHideIcons ? (
              <span>{transformedStatus}</span>
            ) : (
              <>
                <Button
                  className="cell_btn"
                  // onClick={() => handleShowCompleteDetails(params.row)}
                >
                  <AddTaskIcon className="check_box_clrr_cancell" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const DepartmentShiftDataColumn = [
    ...(bulkApprove || bulkChange
      ? [
          {
            key: "checkbox",
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </div>
            ),
            renderCell: (params) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                }}
              >
                <input
                  type="checkbox"
                  checked={CheckedEmployees.includes(
                    params.row.Employee_Shift_Id
                  )}
                  onChange={() =>
                    handleSelectEmployee(params.row.Employee_Shift_Id)
                  }
                />
              </div>
            ),
            width: 50,
          },
        ]
      : []),
    { key: "Employee_Shift_Id", name: "S.No", frozen: true },
    { key: "FullName", name: "Employee Name", frozen: true },
    { key: "ShiftDate", name: "Shift Start Date", frozen: true },
    {
      key: "ShiftName",
      name: "Shift Name",
      renderCell: (params) =>
        bulkApprove ? (
          <select
            style={{
              width: "120px",
              border: "1px solid var(--ProjectColor)",
              borderRadius: "5px",
              padding: "5px",
              backgroundColor: "var(--selectbackgroundcolor)",
            }}
            value={params.row.ShiftName}
            onChange={(e) =>
              handleChange1("ShiftName", e.target.value, params.row)
            }
          >
            <option value="">Select a Shift</option>
            {MasterShifts.map((shift) => (
              <option key={shift.ShiftId} value={shift.ShiftName}>
                {shift.ShiftName}
              </option>
            ))}
          </select>
        ) : (
          params.row.ShiftName
        ),
    },
    {
      key: "ShiftTime",
      name: "Shift Time",
      renderCell: (params) => {
        const selectedShift = MasterShifts.find(
          (shift) => shift.ShiftName === params.row.ShiftName
        );
        const shiftTime = selectedShift
          ? `${selectedShift.StartTime} - ${selectedShift.EndTime}`
          : params.row.ShiftTime;
        return shiftTime;
      },
      width: 100,
    },
    {
      key: "ShiftStatus",
      name: "Status",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          style={{
            border: "none",
            backgroundColor: "transparent",
            padding: "3px",
            fontSize: "12px",
          }}
          // onClick={() => handlestatus(params.row)}
        >
          {params.row.ShiftStatus}
        </Button>
      ),
    },
    {
      key: "Action",
      name: "Actions",
      children: [
        {
          key: "Edit",
          name: "Edit",
          renderCell: (params) =>
            editShiftId === params.row.ShiftId ? (
              <div
                style={{
                  display: "flex",
                  width: "70px",
                  flexDirection: "column",
                }}
              >
                <div>
                  <Button
                    className="update_btn"
                    // onClick={() => handleUpdate(params.row.ShiftId)}
                  >
                    Update
                  </Button>
                </div>
                <div>
                  <Button
                    className="cancel_btn"
                    // onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <Button
                    className="edit_btn"
                    onClick={() =>
                      handleEditClick(
                        params.row.ShiftId,
                        params.row.StartTime,
                        params.row.EndTime,
                        params.row.ShiftName,
                        params.row.ShiftHours,
                        params.row.DayOff
                      )
                    }
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ),
        },
        {
          key: "Action",
          name: "Approve",
          renderCell: (params) => (
            <Button
              className="edit_btn"
              style={{
                border: "none",
                backgroundColor: "transparent",
                padding: "3px",
              }}
              // onClick={() => handlestatus(params.row)}
            >
              Approve
            </Button>
          ),
        },
      ],
    },
  ];

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    if (name === "startdate") setstartdate(value);
    if (name === "enddate") setenddate(value);

    if (name === "startdate" || name === "enddate") {
      const start = new Date(name === "startdate" ? value : startdate);
      const end = new Date(name === "enddate" ? value : enddate);

      if (start && end) {
        const timeDifference = end - start;
        const dayDifference = timeDifference / (1000 * 60 * 60 * 24) + 1; // Include both start and end

        if (dayDifference === 7) {
          let dates = [];
          let currentDate = new Date(start);
          while (currentDate <= end) {
            dates.push(currentDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
            currentDate.setDate(currentDate.getDate() + 1);
          }
          setWeekDates(dates);
        } else {
          alert("Please select exactly 7 days (one full week).");
          setWeekDates([]);
        }
      }
    }
  };

  const handleShiftChange1 = (date, selectedShiftId) => {
    setShiftDetails((prevDetails) => ({
      ...prevDetails,
      [date]: selectedShiftId,
    }));
  };

  return (
    <div className="Main_container_app">
      <h3>Shift Approval</h3>

      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="input">
            Search by <span>:</span>
          </label>
          <input
            style={{
              width: "370px",
            }}
            type="text"
            name="employeeName"
            placeholder="Name or Id or PhoneNo or Designation"
            value={SearchQuery}
            onChange={handleSearchChange}
            autoComplete="off"
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="designation">
            Designation <span>:</span>
          </label>
          <select
            id="designation"
            name="designation"
            value={searchOPParams.designation}
            onChange={handleSearchChangeStatus}
            className="new-custom-input-phone wei32j"
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
      <div className="NewTest_Master_grid_M_head_M">
        <TableContainer className="NewTest_Master_grid_M">
          <Table className="dehduwhd_o8i">
            <TableHead>
              <TableRow>
                {/* <TableCell width={10} /> */}
                <TableCell width={50}>S.No</TableCell>
                <TableCell width={400}>Department</TableCell>
                <TableCell width={300}>Assigned Active Shifts</TableCell>
                <TableCell width={150}>Employee Counts</TableCell>
                <TableCell width={50}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(Filterdata) &&
                Filterdata.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      style={{
                        backgroundColor:
                          index % 2 === 1
                            ? "var(--selectbackgroundcolor)"
                            : "white",
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.Department_Name}</TableCell>
                      <TableCell>
                        <Button
                          className="cell_btn"
                          onClick={() => handleviewDepartmentShifts(row)}
                        >
                          <Visibility className="check_box_clrr_cancell" />
                        </Button>
                      </TableCell>
                      <TableCell>{row.Employee_Count}</TableCell>
                      <TableCell>
                        <span
                          aria-label="expand row"
                          onClick={() =>
                            toggleRow(row.Department_Id, row.Department_Name)
                          }
                        >
                          {openRow === row.Department_Id ? (
                            <PlaylistRemoveTwoToneIcon />
                          ) : (
                            <PlaylistAddTwoToneIcon />
                          )}
                        </span>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openRow === row.Department_Id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <div className="Main_container_app">
                              <br />
                              {/* <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  fontFamily: "Nunito",
                                }}
                              >
                                <div style={{ width: "120px" }}>
                                  <label>
                                    Bulk Shift Assign
                                    <span
                                      style={{
                                        display: "flex",
                                        marginLeft: "15px",
                                      }}
                                    >
                                      :
                                    </span>
                                  </label>
                                </div>
                                <input
                                  type="radio"
                                  name={`bulkAssign-${row.Department_Id}`}
                                  value="yes"
                                  checked={bulkAssign}
                                  onChange={handleBulkAssignToggle}
                                />
                                Yes
                                <input
                                  type="radio"
                                  name={`bulkAssign-${row.Department_Id}`}
                                  value="no"
                                  checked={!bulkAssign}
                                  onChange={handleBulkAssignToggle}
                                />
                                No
                              </div> */}
                              <ReactGrid
                                columns={EmployeeListColumns(
                                  row.Employees,
                                  selectedEmployees,
                                  setSelectedEmployees
                                )}
                                RowData={row?.Employees}
                              />
                              {/* {bulkAssign && (
                                <button
                                  onClick={handleAssignBulkShifts}
                                  className="RegisterForm_1_btns"
                                >
                                  Assign Shift
                                </button>
                              )} */}
                            </div>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {openModal1 && (
        <div className="loader" onClick={handleCloseModal1}>
          <div className="cardModel" onClick={(e) => e.stopPropagation()}>
            <div className="Main_container_app">
              <h3>Shift Assign</h3>
              <br />
              <div className="RegisFormcon">
                <div className="RegisForm_1">
                  <label htmlFor="startdate">
                    Start Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    id="startdate"
                    name="startdate"
                    value={startdate}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="RegisForm_1">
                  <label htmlFor="enddate">
                    End Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    id="enddate"
                    name="enddate"
                    value={enddate}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <br />
              {weekDates.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "90%",
                      fontSize: "12px",
                      border: "1px solid black",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          Select Shift
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekDates.map((date, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                              textAlign: "center",
                            }}
                          >
                            {date}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                              textAlign: "center",
                            }}
                          >
                            <select
                              style={{
                                width: "100%",
                              }}
                              name={`shift-${date}`}
                              value={shiftDetails[date] || ""}
                              onChange={(e) =>
                                handleShiftChange1(date, e.target.value)
                              }
                            >
                              <option value="">Select Shift</option>
                              {Array.isArray(currentshifts) &&
                                currentshifts.map((shift, idx) => (
                                  <option key={idx} value={shift.ShiftId}>
                                    {shift.ShiftName}
                                  </option>
                                ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={handleShiftSubmit1}
                >
                  Submit
                </button>
                <button
                  className="RegisterForm_1_btns"
                  onClick={handleCloseModal1}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {OpenDepartmentShiftDetailsModal && (
        <div
          className="loader"
          onClick={() => setOpenDepartmentShiftDetailsModal(false)}
        >
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Main_container_app">
              <h3>Shifts Approval - {selecteddept?.Department_Name}</h3>
              <br />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  fontFamily: "Nunito",
                }}
              >
                <div style={{ width: "170px" }}>
                  <label>
                    Bulk Shift Change & Approve <span>:</span>
                  </label>
                </div>
                <input
                  type="radio"
                  name={`bulkApprove-${selecteddept.Department_Id}`}
                  value="yes"
                  checked={bulkApprove}
                  onChange={(e) => handleBulkAssignToggle(e, "Approve")}
                />{" "}
                Yes
                <input
                  type="radio"
                  name={`bulkApprove-${selecteddept.Department_Id}`}
                  value="no"
                  checked={!bulkApprove}
                  onChange={(e) => handleBulkAssignToggle(e, "Approve")}
                />{" "}
                No
              </div>
              {(bulkApprove || bulkChange) && CheckedEmployees.length > 0 && (
                <div className="Main_container_Btn">
                  <button onClick={handleSubmit}> Approve</button>
                </div>
              )}
              <br />
              <div>
                {Array.isArray(AssignedDeprtmentShifts) &&
                AssignedDeprtmentShifts.length > 0 ? (
                  <ReactGrid
                    columns={DepartmentShiftDataColumn}
                    RowData={AssignedDeprtmentShifts}
                  />
                ) : (
                  <div>No active shift details for the Department</div>
                )}
              </div>
              <br />
            </div>
          </div>
        </div>
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
}

export default ShiftApproval;
