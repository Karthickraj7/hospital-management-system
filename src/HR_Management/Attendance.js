import React, { useState, useEffect } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import UploadIcon from '@mui/icons-material/Upload';
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";

import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const EmployeeAttendance = () => {
  const dispatchvalue = useDispatch();
  const toast = useSelector((state) => state.userRecord?.toast);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [date, setDate] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [intime, setInTime] = useState("");
  const [outtime, setOutTime] = useState("");
  const [SearchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [status, setstatus] = useState("");
  const [rolename, setRolename] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredRows.length / pageSize);

  const paginatedData = filteredRows.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

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

  const handleEditClick1 = (params) => {

    setOpenModal(true);
    setSelectedRowData(params);
  };

  const handlecalenderview = (params) => {
    console.log("params", params);
    dispatchvalue({ type: "employeeIdget", value: params.Employee_Id });

    navigate("/Home/EmployeeCalendar");
  };

  useEffect(() => {
    axios
      .get(
        `${UrlLink}HRmanagement/get_employee_personaldetails?location=${userRecord?.location}`
      )
      .then((response) => {
        const data = response.data;
        console.log(data);
        const Records = data?.map((userdata, index) => ({
          id: index + 1,
          employeeid: userdata.EmployeeID,
          employeephoto: userdata.EmployeePhoto,
          employeename: userdata.EmployeeName,
          phone: userdata.PhoneNumber,
          designation: userdata.Designation,
          location: userdata.Employee_Location,
          department: userdata.Department,
          date: new Date().toISOString().split("T")[0],
          createdby: userRecord?.username,
        }));
        setRows(Records);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord, UrlLink]);

  useEffect(() => {
    setSelectedRowData(rows);
  }, [rows]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}HRmanagement/getemployeetimedetails?EmployeeID=${selectedRowData?.employeeid}&Date=${selectedRowData?.date}`
      )
      .then((response) => {
        console.log(response);
        setInTime(response.data[0]?.In_Time || "");
        setOutTime(response.data[0]?.Out_Time || "");
        setstatus(response.data[0]?.Attendance_Status || "");
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedRowData, UrlLink]);

  const handleSubmission = async () => {

    try {
      if (status === "Present" && (!intime)) {
        dispatchvalue({ type: "toast", value: { message: "Intime required.", type: "warn" } });
        return;
      }
      // if (!status) {
      //   dispatchvalue({ type: "toast", value: { message: "Select Status.", type: "warn" } });
      //   return;
      // }
      console.log(selectedRowData);
      if (!selectedRowData.Employee_Id) {
        dispatchvalue({ type: "toast", value: { message: "Employee not Found.", type: "warn" } });
        return;
      }
      const submissionData = {
        sl_no: selectedRowData?.presentid || "",
        employeeid: selectedRowData?.Employee_Id,
        location: selectedRowData?.location,
        outtime: outtime,
        intime: intime,
        date: date,
        status: status,
        createdby: userRecord?.username,
        location: userRecord?.location
      };
      console.log("submissionData", submissionData);

      const response = await axios.post(`${UrlLink}HR_Management/insert_attendance_report`, submissionData);
      const reste = response.data;

      const typp = Object.keys(reste)[0];
      const mess = Object.values(reste)[0];
      const tdata = {
        message: mess,
        type: typp,
      };
      dispatchvalue({ type: "toast", value: tdata });
      setInTime("");
      setOutTime("");
      setOpenModal(false);
    } catch (error) {
      dispatchvalue({ type: "toast", value: { message: "Failed to submit attendance. Please try again.", type: "error" } });
      console.error("Error submitting data:", error);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    setDate(getCurrentDate());
  }, []);

  useEffect(() => {
    const lowerCaseQuery = SearchQuery.toLowerCase();
    const lowerCaseQuery1 = searchQuery1.toLowerCase();

    const filterRow = (row) => {
      // Ensure the row has necessary properties before accessing them
      if (row.employeename && row.designation) {
        const lowerCaseEmployeeName = row.employeename.toLowerCase();
        const lowerCaseDesignation = row.designation.toLowerCase();
        const nameMatches = lowerCaseEmployeeName.includes(lowerCaseQuery);
        const designationMatches =
          lowerCaseDesignation.includes(lowerCaseQuery1);

        if (!SearchQuery && !searchQuery1) {
          // If both search queries are empty, do not filter out any data
          return true;
        }

        return nameMatches && designationMatches;
      }
      return false;
    };

    const filteredData = rows.filter(filterRow);

    setFilteredRows(filteredData);
  }, [SearchQuery, searchQuery1, rows]);

  const [SelectedFile1, setSelectedFile1] = useState(null);

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
          `${UrlLink}HRmanagement/post_chirayuattendnace_csvfile`,
          formData1
        )
        .then((response) => {
          successMsg("Uploaded Successfully");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const successMsg = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      containerId: "toast-container-over-header",
      style: { marginTop: "50px" },
    });
  };

  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    designation: "",
  });

  const [Filterdata, setFilterdata] = useState([]);
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchChangeStatus = (e) => {
    const { name, value } = e.target;
    setsearchOPParams({ ...searchOPParams, [name]: value });
  };

  useEffect(() => {
    if (SearchQuery !== "") {
      const lowerCaseQuery = SearchQuery.toLowerCase();

      const filteredData = PatientRegisterData.filter((row) => {
        const { Employee_Id, EmployeeName, PhoneNo, Designation } = row;
        return (
          (Employee_Id && Employee_Id.toLowerCase().includes(lowerCaseQuery)) ||
          (PhoneNo && PhoneNo.toLowerCase().includes(lowerCaseQuery)) ||
          (EmployeeName &&
            EmployeeName.toLowerCase().includes(lowerCaseQuery)) ||
          (Designation && Designation.toLowerCase().includes(lowerCaseQuery))
        );
      });

      setFilterdata(filteredData);
    } else {
      setFilterdata(PatientRegisterData);
    }
  }, [SearchQuery, PatientRegisterData]);

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_AttendnanceManagement_Details`, {
        params: searchOPParams,
      })
      .then((res) => {
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
  }, [UrlLink, searchOPParams]);

  return (
    <div>
      <div className="Main_container_app">
        <h3>Daily Attendance</h3>

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
              placeholder="Name or Id or PhoneNo or Designation "
              value={SearchQuery} // Use the correct state variable here
              onChange={handleSearchChange} // Call the handler on input change
            />
          </div>
        </div>
        <div className="con_1 ">
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
              {/* Explicitly set value to an empty string */}
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
        <div className="con_1 ">
          <div className="RegisForm_1">
            <label>
              {" "}
              Upload CSV File <span>:</span>{" "}
            </label>

                   <div className="RegisterForm_2"> 
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              id="Servicechoose"
              required
              style={{ display: "none" }}
              onChange={handleFileChange1}
            />

<div
              style={{
                width: "120px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "20px",
              }}
            >
            <label
              htmlFor="Servicechoose"
              className="RegisterForm_1_btns choose_file_update"
            >
          <PhotoCameraBackIcon />
            </label>
            <button
              className="RegisterForm_1_btns choose_file_update"
              onClick={handleCsvupload1}
            >
         <UploadIcon />
            </button>
            </div>
            </div>
          </div>
        </div>
        <br />

        <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th id="slectbill_ins">Employee ID</th>
                <th id="slectbill_ins">Employee Name</th>
                <th id="slectbill_ins">Designation</th>
                <th id="slectbill_ins">Department</th>
                <th id="slectbill_ins">Status</th>
                <th id="slectbill_ins">Calender</th>
              </tr>
            </thead>
            <tbody>
              {Filterdata?.map((row, index) => (
                <tr key={row.id}>
                  <td>{row.Employee_Id}</td>
                  <td>{row.EmployeeName}</td>
                  <td>{row.Designation}</td>
                  <td>{row.Department}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleEditClick1(row)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => handlecalenderview(row)}
                      startIcon={<CalendarMonthIcon />}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
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
      </div>

      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <br />

            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label htmlFor="employeeid">
                  Employee ID<span>:</span>
                </label>
                <input
                  type="text"
                  id="employeeid"
                  name="employeeid"
                  value={selectedRowData?.Employee_Id}
                  disabled
                />
              </div>
            </div>
            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label htmlFor="employeename">
                  Employee Name<span>:</span>
                </label>
                <input
                  type="text"
                  id="employeename"
                  name="employeename"
                  value={selectedRowData?.EmployeeName}
                  disabled
                />
              </div>
            </div>
            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label htmlFor="employeename">
                  Date<span>:</span>
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={date}
                  disabled
                />
              </div>
            </div>
            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label htmlFor="status">
                  Status<span>:</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={selectedRowData?.PresentStatus || status}
                  onChange={(e) => {
                    setstatus(e.target.value);
                  }}
                >
                  <option value="">Select </option>
                  <option value="Present">Present</option>
                  <option value="On leave">On Leave</option>
                </select>
              </div>
            </div>
            {(selectedRowData.PresentStatus === "Present" || status === "Present") && (
              <>
                <div className="RegisFormcon">
                  <div className="RegisForm_1">
                    <label htmlFor="intime">
                      In Time<span>:</span>
                    </label>
                    <input
                      type="time"
                      name="intime"
                      value={selectedRowData?.presentintime || intime}
                      onChange={(e) => {
                        setInTime(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="RegisFormcon">
                  <div className="RegisForm_1 ">
                    <label htmlFor="outtime">
                      Out Time <span>:</span>
                    </label>
                    <input
                      type="time"
                      name="outtime"
                      id="outtime"
                      min={intime}
                      value={outtime}
                      onChange={(e) => {
                        setOutTime(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="Register_btn_con">
              <button
                className="RegisterForm_1_btns"
                onClick={handleSubmission}
              >
                Submit
              </button>
              <button
                className="RegisterForm_1_btns"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default EmployeeAttendance;
