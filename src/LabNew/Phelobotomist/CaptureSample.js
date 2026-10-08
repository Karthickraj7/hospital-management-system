import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
// import { Helmet } from 'react-helmet';
// import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
// import './Neww.css';
import Button from "@mui/material/Button";
import ForwadIcon from "@mui/icons-material/Forward";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import  faForward  from '@fortawesome/free-solid-svg-icons';
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
// import { IoIosPrint } from "react-icons/io";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid2";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: "Center",
          color: "var(--header-text-color)",
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

const CaptureSample = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  // console.log("userRecord", userRecord);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const today = new Date().toISOString().slice(0, 10);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchQuery3, setSearchQuery3] = useState("");
  const [searchQuery4, setSearchQuery4] = useState("currentdate");
  const [searchQuery5, setSearchQuery5] = useState(today);
  const [searchQuery6, setSearchQuery6] = useState('');
  const [searchQuery7, setSearchQuery7] = useState('');

  const [summa, setsumma] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const dispatchvalue = useDispatch();
  const [totalPages, setTotalPages] = useState(0); // New state for total pages
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);

  const pageSize = 10;
  //   const totalPages = Math.ceil(filteredRows.length / pageSize);
  const showdown = filteredRows.length;

  const [openModal, setOpenModal] = useState(false);
  const [testdetails, setTestdetails] = useState({});
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const [selectedtest, setSelectedtest] = useState({});
  const SelectedData = useSelector((state) => state.userRecord?.SelectedData);
  const [bulk, setBulk] = useState([]);

  const get = useSelector((state) => state.userRecord?.navigateLab);





  const fetchData = useCallback(() => {
    const offset = page * pageSize;
    const departmentCodes = userRecord?.Lab_Department?.join(","); // Convert array to comma-separated string

    const isSearchCleared =
      !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
    // if (isSearchCleared) {
    axios
      .get(
        `${urllink}Lab/getcapturelist?Location=${userRecord?.location}&limit=${pageSize}&offset=${offset}&Department=${departmentCodes}&name=${searchQuery}&id=${searchQuery1}&barcode=${searchQuery2}&invoice=${searchQuery3}&dateType=${searchQuery4}&date=${searchQuery5}&from=${searchQuery6}&to=${searchQuery7}`
      )
      .then((response) => {
        console.log(response.data);
        const totalrecords = response.data.total_records;
        const data = response.data.patients_data.map((row, index) => ({
          id: index + 1, // Assuming you want a sequential ID
          ...row,
          status: "Status",
        }));
        data.sort((a, b) => {
          const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ""), 10);
          const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ""), 10);
          return invoiceB - invoiceA;
        });
        setFilteredRows([]);
        setTotalPages(0);
        setsumma(data);
        setTotalPages(Math.ceil(totalrecords / pageSize));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    // } 
    // else {
    //   console.log("Performing search...");
    //   // Perform search
    //   fetchSearchData();
    // }
  }, [
    urllink,
    userRecord,
    userRecord?.Department,
    page,
    searchQuery,
    searchQuery1,
    searchQuery2,
    searchQuery3,
    searchQuery5,
    searchQuery6,
    searchQuery7
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // const fetchSearchData = async () => {
  //   try {
  //     // Check if at least one search query is provided
  //     if (
  //       !searchQuery &&
  //       !searchQuery1 &&
  //       !searchQuery2 &&
  //       !searchQuery3 &&
  //       !searchQuery4
  //     ) {
  //       return; // Stop execution if no input is given
  //     }

  //     const response = await axios.get(
  //       `${urllink}Lab/getsearchdataforphelobotomist`,
  //       {
  //         params: {
  //           name: searchQuery,
  //           patientid: searchQuery1,
  //           barcode: searchQuery2,
  //           invoice: searchQuery3,
  //           Location: userRecord.userRecord?.location,
  //           Department: userRecord?.Department,
  //           SubDepartment_Name: searchQuery4,
  //         },
  //       }
  //     );
  //     const totalrecords = response.data.total_records;
  //     const data = response.data.patients_data.map((row, index) => ({
  //       id: index + 1, // Assuming Patient_Id is the unique identifier
  //       ...row,
  //       status: "Status",
  //     }));

  //     data.sort((a, b) => {
  //       const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ""), 10);
  //       const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ""), 10);
  //       return invoiceB - invoiceA;
  //     });
  //     setsumma([]);
  //     setTotalPages(0);
  //     setFilteredRows(data); // Set filtered search results into filteredRows
  //     setTotalPages(Math.ceil(totalrecords / pageSize));
  //   } catch (error) {
  //     console.error("Error fetching search data:", error);
  //   }
  // };

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    }
    if (type === "patientid") {
      setSearchQuery1(value);
    }
    if (type === "barcode") {
      setSearchQuery2(value);
    }
    if (type === "invoice") {
      setSearchQuery3(value);
    }
    // if (type === "departmentsearch") {
    //   setSearchQuery4(value);
    // }
    if (type === "dateType") setSearchQuery4(value);
    if (type === "date") setSearchQuery5(value);
    if (type === "fromdate") setSearchQuery6(value);
    if (type === "todate") setSearchQuery7(value);


  };

  // const handleSampleCapture = (params) => {
  //   console.log(params);
  //   const data = params;
  //   dispatchvalue({ type: "Capturesample", value: data });
  //   if (data.Bill_status === "Paid" || "Due") {
  //     dispatchvalue({ type: "HrFolder", value: "phelobotomistnavigation" });
  //   }
  // };


  const handleSampleCapture = (params) => {
    console.log("params---------", params);

    let billinvoicee = params?.Billing_Invoice
    if (billinvoicee) {
      axios
        .get(`${urllink}Lab/get_for_due_reports?Billing_Invoice=${billinvoicee}`)
        .then((response) => {
          const res = response.data;
          console.log("BIll Status-------", res);

          if (res.status === "Pending") {
            const tdata = {
              message: res.message,
              type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
            return;
          }
          else {
            console.log(params);
            const data = params;
            dispatchvalue({ type: "Capturesample", value: data });
            if (data.Bill_status === "Paid" || "Due") {
              dispatchvalue({ type: "HrFolder", value: "phelobotomistnavigation" });
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching bill status:", error);
        });
    }
  };

  const dynamicColumns = [
    { key: "Barcode", headerName: "Sample Barcode", width: 150 },

    { key: "Billing_Invoice", headerName: "OP/IP No", width: 150 },
    { key: "billdept", headerName: "Dept", width: 150 },
    { key: "Patient_Id", headerName: "Patient Id", width: 80 },
    { key: "UpdatedAt", headerName: "Date", width: 100 },
    { key: "Patient_Name", headerName: "Patient Name", width: 150 },
    { key: "Age", headerName: "Age", width: 80 },
    { key: "Gender", headerName: "Gender", width: 100 },

    {
      key: "actions",
      headerName: "Options",
      width: 100,
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleSampleCapture(params.row)}
          >
            <ForwadIcon />
          </Button>
        </>
      ),
    },
    {
      key: "view",
      headerName: "View",
      width: 100,
      renderCell: ({ row }) => (
        <Button className="cell_btn" onClick={() => handleview(row)}>
          <VisibilityIcon />
        </Button>
      ),
    },

    { key: "Phone", headerName: "Phone", width: 120 },
    // { key: 'Patient_Group', headerName: 'Patient Group', width: 150 },
    { key: "Refering_Doctor", headerName: "Reference Doctor", width: 120 },
    // { key: 'Test_Name', headerName: 'Test Name', width: 150 },
    { key: "TestCount", headerName: "Test Count", width: 100 },

    {
      key: "status", // Ensure this matches the key in your data
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        // Handle possibly undefined Service_Statuses
        const serviceStatuses = params.row.Service_Statuses || [];
        return (
          <Tooltip
            title={
              <>
                {serviceStatuses.map((item, index) => (
                  <div key={index}>
                    {item.testname}: {item.status}
                  </div>
                ))}
              </>
            }
            arrow
          >
            <span>{params.row.status}</span>
          </Tooltip>
        );
      },
    },
  ];

  const handleview = (params) => {
    const data = params.Service_Statuses.filter(
      (item) => item.status !== "Completed"
    );
    params.Service_Statuses = data;
    console.log("Selected Test Data:", data);
    setTestdetails(params);
    setSelectedtest(params);
    setOpenModal((prev) => !prev);
  };

  const [updataedStatus, setUpdatedStatuses] = useState([]);

  // const handleCheckboxChange = (item, test, event) => {
  //   const exists = test?.Service_Statuses?.some(
  //     (i) => i.testname === item.testname
  //   );
  //   console.log("Exists",event);
  //   if (exists && event) {
  //     const updatedStatuses = test.Service_Statuses.filter(
  //       (j) => j.testname === item.testname
  //     );
  //     setUpdatedStatuses((prev) => [...prev, updatedStatuses]);
  //     console.log("Updated Statuses", updataedStatus);
  //   } else if (exists && !event) {
  //    const updatedStatuses = updataedStatus.filter(
  //       (j) => j.testname !== item.testname
  //     );
  //     setUpdatedStatuses(updatedStatuses);
  //     console.log("Updated Statuses after unchecking", updataedStatus);
  //   }
  //   const updatedTest = {
  //     ...test,
  //     Service_Statuses: updataedStatus,
  //   };
  //   setTestdetails((prev) => ({
  //     ...prev,
  //     Service_Statuses: updataedStatus,
  //   }));

  //   const updatedSelectedData = bulk.map((data) =>
  //     data.Barcode === updatedTest.Barcode ? updatedTest : data
  //   );
  //   setBulk(updatedSelectedData);
  //   dispatchvalue({ type: "SelectedData", value: updatedSelectedData });
  //   console.log("Updated Service_Statuses:", updatedTest);
  // };

  const handleCheckboxChange = (item, test, checked) => {
    // Safely get existing list or empty
    const currentStatuses = test?.Service_Statuses || [];

    let updatedStatuses = [];

    const exists = currentStatuses.some((i) => i.testname === item.testname);

    if (checked && !exists) {
      // Add if not already present
      updatedStatuses = [...currentStatuses, item];
    } else if (!checked && exists) {
      // Remove if present
      updatedStatuses = currentStatuses.filter(
        (i) => i.testname !== item.testname
      );
    } else {
      // No change
      updatedStatuses = currentStatuses;
    }

    // Update the local test
    const updatedTest = {
      ...test,
      Service_Statuses: updatedStatuses,
    };

    // Update testdetails state
    setTestdetails(updatedTest);

    // Update bulk data
    if (bulk.length === 0) {
      setBulk([updatedTest]);
    } else {
      const existingIndex = bulk.findIndex(
        (data) => data.Barcode === updatedTest.Barcode
      );
      if (existingIndex === -1) {
        setBulk((prev) => [...prev, updatedTest]);
      } else {
        setBulk((prev) =>
          prev.map((data, index) =>
            index === existingIndex ? updatedTest : data
          )
        );
      }
    }

    console.log("Updated Bulk Data:", bulk);
    // Update redux store
    dispatchvalue({ type: "SelectedData", value: bulk });

    console.log("Updated Service_Statuses:", updatedTest.Service_Statuses);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setTestdetails((prev) => ({
        ...prev,
        Service_Statuses: selectedtest.Service_Statuses,
      }));
      const updatedSelectedData = bulk.map((data) =>
        data.Barcode === testdetails.Barcode ? testdetails : data
      );
      setBulk(updatedSelectedData);
    } else {
      setTestdetails((prev) => ({
        ...prev,
        Service_Statuses: [],
      }));
      const updatedSelectedData = bulk.filter(
        (data) => data.Barcode !== testdetails.Barcode
      );
      setBulk(updatedSelectedData);
    }
  };
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    // console.log("winter is coming...");

    if (testdetails?.Service_Statuses && selectedtest?.Service_Statuses) {
      // console.log("inside out");
      setAllSelected(
        testdetails.Service_Statuses.length ===
        selectedtest.Service_Statuses.length
      );
    }
    const final = SelectedData.filter(
      (data) => !bulk.some((item) => item.Barcode === data.Barcode)
    );
    // console.log("------Final Selected Data-----", final);

    setBulk((prev) => [...prev, ...final]);
    console.log("------Updated Bulk-----", bulk);
    // console.log(
    //   "allSelected:",
    //   allSelected,
    //   "| total:",
    //   testdetails.Service_Statuses?.length,
    //   "| selected:",
    //   selectedtest?.Service_Statuses?.length
    // );
  }, [selectedtest, testdetails, SelectedData]);

  const handleSubmitSelected = () => {

    const filtered = bulk.filter(
      (item) => item.Service_Statuses && item.Service_Statuses.length > 0
    );
    // console.log("------Filtered Tests-----", filtered);

    if (filtered.length > 0) {
      const collect = window.confirm("Collected all samples are submiting...");
      if (collect) {
        const submitData = {
          data: filtered,
          location: userRecord.location,
          createdBy: userRecord.Employeename,
        };
        axios
          .post(`${urllink}Lab/insertBulkSampleCapture`, submitData)
          .then((res) => {
            console.log(res.data, 'cccccccccc');
            fetchData();
            setBulk([]);
            dispatchvalue({ type: "SelectedData", value: [] });
            const tdata = {
              message: "Samples Collected Successfully",
              type: 'success',
            };
            console.log(tdata, 'tdata')
            dispatchvalue({ type: "toast", value: tdata });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else alert("0 Samples Collected...");
  };

  // console.log("------Test Data-----", testdetails);

  // console.log("------Bulk-----", bulk);

  // console.log("------Selected Data-----", SelectedData);

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h3 style={{ color: "white" }}>Sample Collection List</h3>
        </div>
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">Patient Name </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e, "name")}
              placeholder="Enter the Patient Name"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">patient ID</label>
            <input
              type="text"
              value={searchQuery1}
              onChange={(e) => handleSearchChange(e, "patientid")}
              placeholder="Enter patientid"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">Barcode</label>
            <input
              id="input"
              type="text"
              value={searchQuery2}
              onChange={(e) => handleSearchChange(e, "barcode")}
              placeholder="Enter Barcode Number"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">OP/IP No</label>
            <input
              id="input"
              type="text"
              value={searchQuery3}
              onChange={(e) => handleSearchChange(e, "invoice")}
              placeholder="Enter Invoice Number"
            />
          </div>
          <div className="inp_1">
            <label htmlFor="input">Date Type</label>
            <select
              value={searchQuery4}
              onChange={(e) => handleSearchChange(e, "dateType")}
              style={{ width: "165px", }}
            >
              <option value={"currentdate"}>Current</option>
              <option value={"customdate"}>Custom Date</option>

            </select>
          </div>
          {searchQuery4 === "currentdate" ?
            (<div className="inp_1">
              <label htmlFor="input">Date</label>
              <input
                id="input"
                type="date"
                value={searchQuery5}
                onChange={(e) => handleSearchChange(e, 'date')}
                placeholder='Enter Invoice Number'
              />
            </div>) :
            (
              <>
                <div className="inp_1" style={{ gap: "5px", }}>
                  <span style={{ color: "black", fontSize: "13px", fontWeight: "bold" }}>From </span>
                  <input
                    id="input"
                    type="date"
                    value={searchQuery6}
                    onChange={(e) => handleSearchChange(e, 'fromdate')}
                    placeholder='From Date'
                  />
                  <span style={{ color: "black", fontSize: "13px", fontWeight: "bold" }}> To </span>
                  <input
                    id="input"
                    type="date"
                    value={searchQuery7}
                    onChange={(e) => handleSearchChange(e, 'todate')}
                    placeholder='To Date'
                  />
                </div>
              </>)
          }


        </div>
        <div className="grid_1">
          <ReactGrid
            RowData={filteredRows.length > 0 ? filteredRows : summa}
            columns={dynamicColumns}
            hidePagination={true}
            className="data_grid"
            submit={handleSubmitSelected}
          />

          <div className="pagination-controls">
            <button
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
              disabled={page === 0}
              className="pagination-button"
            >
              <ArrowBackIosNewIcon />
            </button>
            Page {page + 1} of {totalPages}
            <button
              onClick={() =>
                setPage((prevPage) =>
                  prevPage + 1 < totalPages ? prevPage + 1 : prevPage
                )
              }
              disabled={page + 1 >= totalPages}
              className="pagination-button"
            >
              <ArrowForwardIosIcon />
            </button>
          </div>
          {summa.length === 0 && filteredRows.length === 0 && (
            <div className="IP_norecords">
              <span>No Records Found</span>
            </div>
          )}
        </div>
      </div>
      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
        >
          <div className="newwProfiles newwPopupforreason">
            <div className="grid_1">
              <ThemeProvider theme={theme}>
                {/* <ReactGrid RowData={testdetails} columns={dynamicColumns1} className="data_grid" /> */}
                <table className="responsive-table-M007">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>Test Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedtest.Service_Statuses.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={testdetails?.Service_Statuses?.some(
                              (i) => i.testname === item.testname
                            )}
                            // checked={testdetails.Service_Statuses.some(
                            //   (i) => i.testname === item.testname
                            // )}
                            onChange={(e) =>
                              handleCheckboxChange(
                                item,
                                testdetails,
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td>{item.testname}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ThemeProvider>
            </div>
            <div className="Register_btn_con">
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
    </>
  );
};

export default CaptureSample;
