import React from "react";
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";


const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: "Center",
        },
        root: {
          "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer":
            {
              textAlign: "center",
              display: "flex !important",
              justifyContent: "center !important",
            },
          "& .MuiDataGrid-window": {
            overflow: "hidden !important",
          },
        },
        cell: {
          borderTop: "0px !important",
          borderBottom: "1px solid  var(--ProjectColor) !important",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

function RequestToHrList() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const navigate = useNavigate();
  const dispatchvalue = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [statustype, setstatustype] = useState("Pending");
  const [departmentData, setDepartmentData] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [filteredRows, setfilteredRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [RejectReason, setRejectReason] = useState("");

  const handlePageChange = (params) => {
    setPage(params.page);
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const fetchDepartmentData = () => {
    axios
      .get(`${urllink}usercontrol/getDepartment`)
      .then((response) => {
        const data = response.data;
        console.log(data);

        setDepartmentData(data);
      })
      .catch((error) => {
        console.error("Error fetching Department data:", error);
      });
  };

  const handleApprove = (params) => {
    const confirmation = window.confirm("Are you sure Approve the Requirement");
    console.log(confirmation)
    if (confirmation) {
      console.log("Approve");
      const status = "Approved";
      const RequestID = params.row.RequestID;

      const datatosend = new FormData();

      datatosend.append("status", status);
      datatosend.append("RequestID", RequestID);
      datatosend.append("RejectReason", RejectReason);

      axios
        .post(
          `${urllink}HRmanagement/UpdateJobRequestStatus`,datatosend
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleReject = (params) => {
    setOpenModal(true);
    setSelectedRowData(params.row);

    console.log(params);
  };


  const handleProceed = (params) => {
    console.log(params)
    dispatchvalue({type: 'Jobapproveeddata',value: params.row})
    navigate('/Home/Mail-To-Consultancy')
  }

  const dynamicColumns = [
    { field: "RequestID", headerName: "Request ID", width: 100 },
    { field: "Department", headerName: "Department", width: 150 },
    // { field: "DepartmentManagerName", headerName: "Manager Name", width: 110 },
    {
      field: "DepartmentManagerEmployeeID",
      headerName: "DM EmployeeID",
      width: 130,
    },
    {
      field: "Role",
      headerName: "Role",
      width: 170,
    },
    { field: "No_of_Openings", headerName: "Openings", width: 110 },
    { field: "Enddate", headerName: "Deadline Date", width: 110 },
    { field: "Qualification", headerName: "Qualification", width: 120 },
    { field: "Experience", headerName: "Experience", width: 120 },
    { field: "Status", headerName: "Status", width: 120 },
    {
      field: "Action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <>
          {statustype === "Pending" && (
            <>
              <Button
                className="cell_btn"
                onClick={() => handleApprove(params)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    rowGap: "5px",
                  }}
                >
                  <CheckCircleOutlineIcon />
                  <p style={{ fontSize: "8px", color: "green" }}>Approved</p>
                </div>
              </Button>

              <Button className="cell_btn" onClick={() => handleReject(params)}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    rowGap: "5px",
                  }}
                >
                  <HighlightOffSharpIcon />
                  <p style={{ fontSize: "8px", color: "red" }}>Rejected</p>
                </div>
              </Button>
            </>
          )}
          {statustype === "Approved" && (
            <Button className="cell_btn"onClick={() => handleProceed(params)}>
              <ArrowForwardIcon />
            </Button>
          )}
        </>
      ),
    },
  ];

  const dynamicColumns1 = [
    { field: "RequestID", headerName: "Request ID", width: 100 },
    { field: "Department", headerName: "Department", width: 150 },
    // { field: "DepartmentManagerName", headerName: "Manager Name", width: 110 },
    {
      field: "DepartmentManagerEmployeeID",
      headerName: "DM EmployeeID",
      width: 130,
    },
    {
      field: "Role",
      headerName: "Role",
      width: 170,
    },
    { field: "No_of_Openings", headerName: "Openings", width: 110 },
    { field: "Enddate", headerName: "Deadline Date", width: 110 },
    { field: "Qualification", headerName: "Qualification", width: 120 },
    { field: "Experience", headerName: "Experience", width: 120 },
    { field: "Status", headerName: "Status", width: 120 },
    { field: "Reason", headerName: "Reason", width: 120 },
  ];

  const fetchgetjobrequest = () => {
    axios
      .get(`${urllink}HRmanagement/getJobrequest?statustype=${statustype}`)
      .then((response) => {
        console.log(response.data);

        const rowsWithIds = response.data.map((item, index) => ({
          id: item.RequestID,
          ...item,
        }));

        setRows(rowsWithIds);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchgetjobrequest(statustype);
  }, [statustype]);

  const handleSubmission = () => {
    const status = "Rejected";
    console.log(selectedRowData);

    const datatosend = new FormData();

    datatosend.append("status", status);
    datatosend.append("RejectReason", RejectReason);
    datatosend.append("RequestID", selectedRowData?.RequestID);

    axios
      .post(`${urllink}HRmanagement/UpdateJobRequestStatus`, datatosend)
      .then((response) => {
        console.log(response.data);
        setOpenModal(false)
        fetchgetjobrequest(statustype)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  

  const handleSearchChange = (event) => {
    const { id, value } = event.target;

    if (id === "Department") {
      setSearchQuery(value);
    } else if (id === "Manager") {
      setSearchQuery1(value);
    }
  };

  useEffect(() => {
    const filteredData = rows.filter((row) => {
      const lowerDepartment = row.Department.toLowerCase();
      const lowerCaseDepartmentManagerName =
        row.DepartmentManagerEmployeeID.toString().toLowerCase();

      const startsWithDepartment = lowerDepartment.startsWith(
        searchQuery.toLowerCase()
      );
      const startsDepartmentManagerName =
        lowerCaseDepartmentManagerName.startsWith(searchQuery1.toLowerCase());

      return (
        (startsWithDepartment || !searchQuery) &&
        (startsDepartmentManagerName || !searchQuery1)
      );
    });

    // If there is a search query, sort the data to bring the left-to-right matching rows to the top

    setfilteredRows(filteredData);
    setPage(0);
  }, [searchQuery, searchQuery1, rows]);

  return (
    <div className="appointment">
      <div className="h_head h_head_h_2">
        <h4> Request To HR List</h4>

        <div className="doctor_select_1 selt-dctr-nse vcxw2er">
          <label htmlFor="Calender"> Status :</label>
          <select
            className="Product_Master_div_select_opt"
            value={statustype}
            onChange={(e) => {
              setstatustype(e.target.value);
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="Department">
            Department<span>:</span>
          </label>
          <select
            type="text"
            id="Department"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Enter the Department"
          >
            <option value="">Select</option>
            {departmentData.map((department) => (
              <option
                key={department.Dept_id}
                value={department.Department_name}
              >
                {department.Department_name}
              </option>
            ))}
          </select>
        </div>
        <div className="inp_1">
          <label htmlFor="Manager">
            DM EmployeeID <span>:</span>
          </label>
          <input
            type="text"
            id="Manager"
            value={searchQuery1}
            onChange={handleSearchChange}
            placeholder="Enter EmployeeID"
          />
        </div>
      </div>

      <ThemeProvider theme={theme}>
        <div className=" grid_1">
          <DataGrid
            rows={filteredRows.slice(page * 10, (page + 1) * 10)} // Display only the current page's data
            columns={
              statustype === "Pending" || statustype === "Approved"
                ? dynamicColumns
                : dynamicColumns1
            } // Use dynamic columns here
            pageSize={10}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            onPageChange={handlePageChange}
            hideFooterPagination
            hideFooterSelectedRowCount
            className=" data_grid"
          />
          {/* Pagination controls */}
          {filteredRows.length > 10 && (
            <div className="grid_foot">
              <button
                onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                disabled={page === 0}
              >
                Previous
              </button>
              Page {page + 1} of {Math.ceil(filteredRows.length / 10)}
              <button
                onClick={() =>
                  setPage((prevPage) =>
                    Math.min(
                      prevPage + 1,
                      Math.ceil(filteredRows.length / 10) - 1
                    )
                  )
                }
                disabled={page === Math.ceil(filteredRows.length / 10) - 1}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </ThemeProvider>
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
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="requestid">
                  Request ID<span>:</span>
                </label>
                <input
                  type="text"
                  name="requestid"
                  value={selectedRowData?.RequestID}
                />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="department">
                  Department<span>:</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={selectedRowData?.Department}
                />
              </div>
            </div>

            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="role">
                  Role<span>:</span>
                </label>
                <input type="text" name="role" value={selectedRowData?.Role} />
              </div>
            </div>

            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1 ">
                <label htmlFor="openings">
                  Openings<span>:</span>
                </label>
                <input
                  type="text"
                  name="openings"
                  id="openings"
                  value={selectedRowData?.No_of_Openings}
                />
              </div>
            </div>

            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="Status">
                  Status <span>:</span>
                </label>
                <input name="Status" id="Status" value="Rejected" />
              </div>
            </div>
            <div className="RegisFormcon leavecon">
              <div className="RegisForm_1 leaveform_1">
                <label htmlFor="RejectReason">
                  Reject Reason <span>:</span>
                </label>
                <textarea
                  id="RejectReason"
                  name="RejectReason"
                  cols="25"
                  rows="3"
                  value={RejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                  }}
                ></textarea>
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
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestToHrList;
