import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ForwardIcon from "@mui/icons-material/Forward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Tooltip from "@mui/material/Tooltip";
import Modal from "react-modal";
import { GiProgression } from "react-icons/gi";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import LoopIcon from "@mui/icons-material/Loop";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: "center",
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
          borderBottom: "1px solid var(--ProjectColor) !important",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

const getColorName = (value, min, max) => {
  const percentage = ((value - min) / (max - min)) * 100;
  if (percentage <= 20) return "Panic";
  if (percentage <= 40) return "Abnormal - Y";
  if (percentage <= 60) return "Normal";
  if (percentage <= 80) return "Abnormal - O";
  return "Panic";
};

const DispatchList = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const today = new Date().toISOString().slice(0, 10);

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchQuery3, setSearchQuery3] = useState("");
  const [searchQuery4, setSearchQuery4] = useState("currentdate");
  const [searchQuery5, setSearchQuery5] = useState(today);
  const [searchQuery6, setSearchQuery6] = useState("");
  const [searchQuery7, setSearchQuery7] = useState("");

  const [summa, setSumma] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  // const [labdoctordata, setLabdoctordata] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [view, setView] = useState(false);
  const [testdetails, setTestdetails] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [printpapaer, setPrintpapaer] = useState("RDL");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [smartreport, setSmartreport] = useState([]);
  const [signperson, setSignperson] = useState("");
  const pageSize = 10;
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const [checkedtestdata, setcheckedtestdata] = useState([]);
  const [alltest, setalltest] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [openModal1, setOpenModal1] = useState(false);
  const toast = useSelector((state) => state.userRecord?.toast);

  const [queData, setQueData] = useState({});

  dispatch({ type: "printpapaer", value: printpapaer });

  console.log("------------apt_apt----------", isSidebarOpen);
  const get = useSelector((state) => state.userRecord?.searchLab);

  useEffect(() => {
    console.log("GET--------------->>>", get);
    if (get.name !== "" || get.date !== "") {
      const [day, month, year] = get.date.split("-");
      const formatted = `${year}-${month}-${day}`; // yyyy-MM-dd
      setSearchQuery5(formatted);
      setSearchQuery(get.name);
    }
  }, [get]);

  const yourStyles = {
    position: "absolute",
    inset: "100px",
    border: "1px solid rgb(204, 204, 204)",
    background: "rgb(97 90 90 / 75%)",
    overflow: "auto",
    borderRadius: "4px",
    outline: "none",
    padding: "0px",
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent("");
  };

  useEffect(() => {

    try{
    setLoading(true)

    
    const offset = page * pageSize;
    const isSearchCleared =
      !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
    const departmentCodes = userRecord?.Lab_Department?.join(",") || "";

    // if (isSearchCleared) {
    axios
      .get(`${urllink}Lab/get_patient_request_capture_data_for_dispatch`, {
        params: {
          Location: userRecord?.location,
          limit: pageSize,
          offset: offset,
          Refering_Hospital: userRecord?.Refering_Hospital || "All",
          Department: departmentCodes,
          name: searchQuery,
          patientid: searchQuery1,
          barcode: searchQuery2,
          invoice: searchQuery3,
          dateType: searchQuery4,
          date: searchQuery5,
          from: searchQuery6,
          to: searchQuery7,
        },
      })
      .then((response) => {
        const totalRecords = response.data.total_records;
        const data = response.data.patients_data.map((row, index) => ({
          id: index + 1 + offset, // Ensure unique IDs across pages
          ...row,
          status: "Status",
        }));
        data.sort((a, b) => {
          const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ""), 10);
          const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ""), 10);
          return invoiceB - invoiceA;
        });
        setFilteredRows([]);
        setSumma(data);
        setTotalPages(Math.ceil(totalRecords / pageSize));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });}catch{
        console.log("Error");
        
      }finally{setLoading(false)}
      
    // } else {
    //   fetchSearchData();
    // }
  }, [
    urllink,
    userRecord?.location,
    userRecord?.Lab_Department,
    userRecord?.Refering_Hospital,
    page,
    pageSize,
    searchQuery,
    searchQuery1,
    searchQuery2,
    searchQuery3,
    searchQuery5,
    searchQuery6,
    searchQuery7,
  ]);

  // const fetchSearchData = async (offset) => {
  //   try {
  //     const response = await axios.get(`${urllink}Lab/dispatchsearch`, {
  //       params: {
  //         name: searchQuery,
  //         patientid: searchQuery1,
  //         barcode: searchQuery2,
  //         invoice: searchQuery3,
  //         Refering_Hospital: userRecord.Refering_Hospital,
  //         Location: userRecord?.location,
  //         limit: pageSize,
  //         offset: offset,
  //       },
  //     });
  //     const totalRecords = response.data.total_records;
  //     const data = response.data.patients_data.map((row, index) => ({
  //       id: index + 1 + offset,
  //       ...row,
  //       status: 'Status',
  //     }));
  //     data.sort((a, b) => {
  //       const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
  //       const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
  //       return invoiceB - invoiceA;
  //     });
  //     setSumma([]);
  //     setFilteredRows(data);
  //     setTotalPages(Math.ceil(totalRecords / pageSize));
  //   } catch (error) {
  //     console.error('Error fetching search data:', error);
  //     setFilteredRows([]);
  //     setTotalPages(0);
  //   }
  // };

  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    if (key === "name") setSearchQuery(value);
    if (key === "phone") setSearchQuery1(value);
    if (key === "barcode") setSearchQuery2(value);
    if (key === "invoice") setSearchQuery3(value);
    if (key === "dateType") setSearchQuery4(value);
    if (key === "date") setSearchQuery5(value);
    if (key === "fromdate") setSearchQuery6(value);
    if (key === "todate") setSearchQuery7(value);
    setPage(0); // Reset to first page on search
  };

  const handleSampleCapture = (row) => {
    console.log("asdadsd", row);

    let billinvoicee = row?.Billing_Invoice;
    if (billinvoicee) {
      axios
        .get(
          `${urllink}Lab/get_for_due_reports?Billing_Invoice=${row.Billing_Invoice}`
        )
        .then((response) => {
          const res = response.data;
          console.log("BIll Status-------", res);

          if (res.status === "Pending") {
            // alert(res.message);
            const tdata = {
              message: res.message,
              type: "warn",
            };
            dispatch({ type: "toast", value: tdata });
            return;
          }
          console.log("FullDATa-------", row);
          setcheckedtestdata(row);
          setOpenModal1(true);
          const setdefaultcheck = row?.TestDetails.map(
            (test) => test.Test_Code
          );
          setalltest(setdefaultcheck);
          setSelectedTests(setdefaultcheck);
          console.log("code-----", selectedTests);
        })
        .catch((error) => {
          console.error("Error fetching bill status:", error);
          setLoading(false); // optional fail-safe
        });
    } else {
      // If not an OP bill, continue as normal
      // continueSampleCapture(row);

      setcheckedtestdata(row);
      console.log("Else-----");
      setOpenModal1(true);
      const setdefaultcheck = row?.TestDetails.map((test) => test.Test_Code);
      setalltest(setdefaultcheck);
      setSelectedTests(setdefaultcheck);
    }
  };

  const handleCheckboxChange = (testCode) => {
    setSelectedTests(
      (prev) =>
        prev.includes(testCode)
          ? prev.filter((code) => code !== testCode) // Uncheck test
          : [...prev, testCode] // Check test
    );
  };
  // console.log("selectedTest-----", selectedTests);

  const PrintNavigate = () => {
    const datattosend = checkedtestdata.TestDetails.filter((test) =>
      selectedTests.includes(test.Test_Code)
    );
    const newCheckedTestData = {
      ...checkedtestdata,
      TestDetails: datattosend,
      AllTest: selectedTests,
    };
    console.log("print----", selectedTests);

    if (selectedTests.length === 0) {
      alert("Please select at least one test to continue.");
    } else if (newCheckedTestData.TestDetails.length > 0) {
      continueSampleCapture(newCheckedTestData);
    }
  };

  // 👇 Move dispatch logic into a separate reusable function
  const continueSampleCapture = (row) => {
    setLoading(true);

    if (printpapaer) {
      dispatch({ type: "Capturesample", value: row });
      dispatch({ type: "showPrint", value: false });

      setTimeout(() => {
        setLoading(false);
        dispatch({ type: "setPreviousFolder", value: "DispatchList" });
        dispatch({ type: "HrFolder", value: "Reports" });
      }, 1000);
    }
  };

  const handlesmartreport = (row) => {
    axios
      .get(`${urllink}Lab/get_data_for_smart_report`, {
        params: {
          invoice: row.Billing_Invoice,
          Patientid: row.Patient_Id,
          Visitid: row.Visit_Id,
        },
      })
      .then((response) => {
        let data = response.data;
        if (response.error || data.length === 0) {
          setOpenModal(false);
        } else {
          setOpenModal(true);
          setSmartreport(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // const handlechoosesign = (e, row) => {
  //   const selectedValue = e.target.value;
  //   const id = selectedValue.split('|')[1]?.trim();
  //   const selectedDoctor = labdoctordata.find((doc) => doc.id === id);
  //   if (selectedDoctor) {
  //     setSignperson(selectedDoctor.id);
  //     const doctdata = {
  //       id: selectedDoctor.id,
  //       Name: selectedDoctor.Name,
  //       ShortName: selectedDoctor.ShortName,
  //       Designation: selectedDoctor.Designation,
  //       Qualification: selectedDoctor.Qualification,
  //       State_RegistrationNumber: selectedDoctor.State_RegistrationNumber,
  //     };
  //     dispatch({
  //       type: 'SignPerson',
  //       value: { doctdata },
  //     });
  //   }
  // };

  const handlechoosep_paper = (e) => {
    const { value } = e.target;
    setPrintpapaer(value);
    dispatch({ type: "printpapaer", value: value });
  };

  const handleview = (params) => {
    setTestdetails(params);
    setOpenModal((prev) => !prev);
  };

  const handleAddmore = (params) => {
    console.log("Loop----------", params);
    console.log("Que-----------", queData);
    const Access = userRecord?.AccessTwo.split(",");
    if (!Access.includes("L12-4")) {
      const tdata = {
        message: `Access Denied`,
        type: "warn",
      };
      dispatch({ type: "toast", value: tdata });
      return;
    }
    const sendData = {
      patients_data: queData,
      test_data: params,
      created: userRecord?.username,
    };

    const add = window.confirm("Do you want to repeat the test?");
    if (add) {
      axios
        .post(`${urllink}Lab/repeat_the_same_test`, sendData)
        .then((res) => {
          const data = res.data;
          const tdata = {
            message: data.Status || data.Error || "Something Wrong...",
            type: data.Status ? "success" : "warn",
          };
          dispatch({ type: "toast", value: tdata });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const dynamicColumns = [
    { key: "Barcode", headerName: "Sample Barcode", width: 100 },
    { key: "Billing_Invoice", headerName: "OP/IP No", width: 100 },
    { key: "Visit_Id", headerName: "Visit Id", width: 70 },
    { key: "UpdatedAt", headerName: "Date", width: 100 },
    { key: "Patient_Name", headerName: "Patient Name", width: 150 },
    { key: "Age", headerName: "Age", width: 80 },
    {
      key: "actions",
      headerName: "Options",
      width: 100,
      renderCell: ({ row }) => (
        <Button className="cell_btn" onClick={() => handleSampleCapture(row)}>
          <ForwardIcon />
        </Button>
      ),
    },
    {
      key: "view",
      headerName: "View",
      width: 100,
      renderCell: ({ row }) => (
        <Button
          className="cell_btn"
          onClick={() =>{setQueData(row); handleview(row.TestDetails)}}
        >
          <VisibilityIcon />
        </Button>
      ),
    },
    { key: "Gender", headerName: "Gender", width: 100 },
    { key: "Phone", headerName: "Phone", width: 120 },
    { key: "Refering_Doctor", headerName: "Reference Doctor", width: 130 },

    {
      key: "status",
      headerName: "Status",
      width: 100,
      renderCell: ({ row }) => {
        const serviceStatuses = row.Service_Statuses || [];
        return (
          <Tooltip
            title={
              <>
                <div>
                  Capture Status: {serviceStatuses[0]?.Capture || "N/A"}
                </div>
                <div>
                  Analysis Status: {serviceStatuses[0]?.Analaysis || "N/A"}
                </div>
                <div>
                  Verified Status: {serviceStatuses[0]?.Verify || "N/A"}
                </div>
                <div>
                  Approve Status: {serviceStatuses[0]?.Approve || "N/A"}
                </div>
              </>
            }
            arrow
          >
            <span>{row.status}</span>
          </Tooltip>
        );
      },
    },
  ];

  const dynamicColumns1 = [
    { key: "id", headerName: "S No", width: 100 },
    { key: "Test_Name", headerName: "Test Name", width: 250 },
    { key: "Service_Status", headerName: "Collection Status", width: 100 },
    { key: "Analysis_Status", headerName: "Report Entry Status", width: 100 },
    { key: "Verify_Status", headerName: "Verify Status", width: 100 },
    { key: "Approve_Status", headerName: "Approve Status", width: 100 },
    {
      key: "actions",
      headerName: "Repeat Test",
      width: 100,
      renderCell: ({ row }) => (
        <Button className="cell_btn" onClick={() => handleAddmore(row)}>
          <LoopIcon />
        </Button>
      ),
    },
  ];

  return (
    <div className="appointment">
      <ToastAlert Message={toast.message} Type={toast.type} />

      <div className="h_head">
        <h3>Dispatch Que List</h3>
      </div>
      <div className="con_1">
        <div className="inp_1">
          <label htmlFor="input">Patient Name</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e, "name")}
            placeholder="Enter Patient Name"
          />
        </div>
        <div className="inp_1">
          <label htmlFor="input">Patient ID</label>
          <input
            type="text"
            value={searchQuery1}
            onChange={(e) => handleSearchChange(e, "phone")}
            placeholder="Enter Patient ID"
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
            placeholder="Enter OP/IP Number"
          />
        </div>
        <div className="inp_1">
          <label htmlFor="input">Date Type</label>
          <select
            value={searchQuery4}
            onChange={(e) => handleSearchChange(e, "dateType")}
            style={{ width: "165px" }}
          >
            <option value={"currentdate"}>Current</option>
            <option value={"customdate"}>Custom Date</option>
          </select>
        </div>
        {searchQuery4 === "currentdate" ? (
          <div className="inp_1">
            <label htmlFor="input">Date</label>
            <input
              id="input"
              type="date"
              value={searchQuery5}
              onChange={(e) => handleSearchChange(e, "date")}
              placeholder="Enter Invoice Number"
            />
          </div>
        ) : (
          <>
            <div className="inp_1" style={{ gap: "5px" }}>
              <span
                style={{ color: "black", fontSize: "13px", fontWeight: "bold" }}
              >
                From{" "}
              </span>
              <input
                id="input"
                type="date"
                value={searchQuery6}
                onChange={(e) => handleSearchChange(e, "fromdate")}
                placeholder="From Date"
              />
              <span
                style={{ color: "black", fontSize: "13px", fontWeight: "bold" }}
              >
                {" "}
                To{" "}
              </span>
              <input
                id="input"
                type="date"
                value={searchQuery7}
                onChange={(e) => handleSearchChange(e, "todate")}
                placeholder="To Date"
              />
            </div>
          </>
        )}
      </div>
      <div className="grid_1">
        <ReactGrid
          RowData={filteredRows.length > 0 ? filteredRows : summa}
          columns={dynamicColumns}
          hidePagination={true}
          className="data_grid"
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ content: { ...yourStyles } }}
      >
        <div className="pdf_img_show">
          <iframe
            title="PDF Viewer"
            src={modalContent}
            style={{
              width: "100%",
              height: "435px",
              border: "1px solid rgba(0, 0, 0, 0.5)",
            }}
          />
          <div className="jhuhhjh">
            <Button
              style={{ color: "white" }}
              className="clse_pdf_img"
              onClick={closeModal}
            >
              <HighlightOffIcon
                style={{
                  fontSize: "40px",
                  backgroundColor: "var(--ProjectColor)",
                  borderRadius: "40px",
                }}
              />
            </Button>
          </div>
        </div>
      </Modal>
      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
        >
          <div className="newwProfiles newwPopupforreason">
            <div className="grid_1">
              <ThemeProvider theme={theme}>
                <ReactGrid
                  RowData={testdetails}
                  columns={dynamicColumns1}
                  className="data_grid"
                />
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
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
          </div>
        </div>
      )}
      {openModal1 && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal1(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason uwagduaguleaveauto foradvanceview"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="appointment">
              <div className="h_head">
                <h4>Items to Check</h4>
              </div>

              <div
                className="test-details-container"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <div
                  className="test-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px !important",
                    justifyContent: "space-evenly",
                    gap: "10px",
                    marginBottom: "10px",
                    wordWrap: "break-word",
                  }}
                >
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={
                      checkedtestdata?.TestDetails?.length > 0 &&
                      selectedTests.length ===
                        checkedtestdata.TestDetails.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Select all
                        setSelectedTests(
                          checkedtestdata.TestDetails.map(
                            (test) => test.Test_Code
                          )
                        );
                      } else {
                        // Unselect all
                        setSelectedTests([]);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    htmlFor="select-all"
                    className="RegisForm_1"
                    style={{
                      fontSize: "18px !important",
                      cursor: "pointer",
                      width: "300px",
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ALL
                  </label>
                </div>
                {checkedtestdata?.TestDetails?.map((test, index) => (
                  <div
                    className="test-item"
                    key={test.Test_Code}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "18px !important",
                      justifyContent: "space-evenly",
                      gap: "10px",
                      marginBottom: "10px",
                      wordWrap: "break-word",
                    }}
                  >
                    <input
                      type="checkbox"
                      id={test.Test_Code}
                      value={test.Test_Code}
                      checked={selectedTests.includes(test.Test_Code)} // Controlled checkbox
                      onChange={() => handleCheckboxChange(test.Test_Code)}
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      htmlFor={test.Test_Code}
                      className="RegisForm_1"
                      style={{
                        fontSize: "18px !important",
                        width: "300px",
                        cursor: "pointer",
                      }}
                    >
                      {test.Test_Name}
                    </label>
                  </div>
                ))}
              </div>

              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setOpenModal1(false)}
                >
                  Close
                </button>
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => PrintNavigate(false)}
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchList;
