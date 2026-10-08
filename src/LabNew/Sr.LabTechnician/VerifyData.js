import { React, useState, useRef, useEffect } from "react";
// import "./Registration.css";
import Accordion from "@mui/material/Accordion";
import { FaUser, FaVial } from "react-icons/fa";
// import "./VerifyData.css";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import Webcam from "react-webcam";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { Helmet } from 'react-helmet';
import SearchIcon from '@mui/icons-material/Search';
// import axios from "axios";
// import './Neww.css';
import Button from '@mui/material/Button';
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from "react-redux";
import BarcodeGenerator from "../Barcode/Barcode";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "#54d854bf",
          textAlign: 'Center',
        },
        root: {
          "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer": {
            textAlign: 'center',
            display: 'flex !important',
            justifyContent: 'center !important'
          },
          "& .MuiDataGrid-window": {
            overflow: "hidden !important",
          },
        },
        cell: {
          borderTop: "0px !important",
          borderBottom: "1px solid  #54d854bf !important",
          display: 'flex',
          justifyContent: 'center'
        },
      },
    },
  },
});


const VerifyData = (isSidebarOpen) => {



  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  // const [showCamera, setShowCamera] = useState(false);
  const [userRecord, setUserRecord] = useState([]);
  console.log(userRecord);
  useEffect(() => {
    const userRecord = localStorage.getItem("token");

    if (userRecord) {
      const decodedToken = (token) => {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = atob(payloadBase64);
        return JSON.parse(decodedPayload);
      };
      const decodedTokenData = decodedToken(userRecord);
      console.log("decodedTokenData", decodedTokenData);
      setUserRecord(decodedTokenData);
    }
  }, []);


  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [summa, setsumma] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredRows1, setFilteredRows1] = useState([]);
  const [rowData, setRowData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState([])
  const [status, setStatus] = useState("");
  const [oldStatus, setOldStatus] = useState("");
  const [reason, setReason] = useState("");
  const [showsudden, setshowsudden] = useState(false);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const showdown = filteredRows.length;
  // -------------------------------------
  const capturedata = useSelector((state) => state.userRecord?.Samplecapture)
  console.log('capturedata', capturedata)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  const handleInputChange = (id, field, value, testname) => {

    setRowData({
      ...rowData,
      [id]: {
        ...rowData[id],
        [field]: value,
        testname,
      },

    });
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
  };
  const handleReasonChange = (e) => {
    const newReason = e.target.value;
    setReason(newReason);
  };




  useEffect(() => {
    // axios.get(`${urllink}Billing/getcompletedsample?Billinginvoice=${capturedata.Billing_Invoice}`)
    //   .then((response) => {
    //     console.log(response.data)
    //     const data = response.data.map((item, index) => ({
    //       id: index + 1, // Assigning a unique id based on the item index
    //       testcode: item.Test_Code,
    //       testname: item.Test_Name,
    //       testnames: item.Test_Name,
    //       Captured_Unit: item.Captured_Unit,
    //       Container_Name: item.Container_Name,
    //       Specimen_Name: item.Specimen_Name,
    //       UpdateAt: capturedata.UpdatedAt,
    //       paniclow: item.PanicLow,
    //       panichigh: item.PanicHigh,
    //       patient_name: capturedata.Patient_Name,
    //       Billing_Invoice: capturedata.Billing_Invoice

    //       // You don't need to explicitly include the 'actions' field here
    //     }));
    //     setFilteredRows(data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data: ", error);
    //   });
    axios.get(`${urllink}Phelobotomist/get_record_from_lab_techy?Billinginvoice=${capturedata.Billing_Invoice}`)
      .then((response) => {
        console.log(response.data)
        const data = response.data.map((item, index) => ({
          id: index + 1, // Assigning a unique id based on the item index
          // testcode: item.Test_Code,
          testname: item.Test,
          // testnames: item.Test_Name,
          Capture_Value: item.Capture_Value,
          Patient_Name: item.Patient_Name,
          Sample_Specimen: item.Sample_Specimen,
          UpdateAt: capturedata.UpdatedAt,
          paniclow: item.Panic_Low,
          panichigh: item.Panic_High,
          Remarks: item.Remarks,
          Billing_Invoice: item.Billing_invoice

          // You don't need to explicitly include the 'actions' field here
        }));
        setFilteredRows1(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

 

  const dynamicColumns = [
    { field: "id", headerName: "Test Items ", width: 250 },
    { field: "Specimen_Name", headerName: "Sample/Specimen", width: 250 },
    { field: "Container_Name", headerName: "Container", width: 260 },
    { field: "Captured_Unit", headerName: "Captured Unit", width: 280 },
    {
      field: "sample",
      headerName: "Sample Processing",
      width: 250,
      renderCell: (params) => (
        <>
          <div className="RegisForm_1">
            <select
              name="process"
              id="process"
              value={rowData[params.id]?.process || ''}
              onChange={(e) => handleInputChange(params.id, 'process', e.target.value, params.row.testname)}
            >
              <option value="">select</option>
              <option value="Approved">Approved</option>
              <option value="Reject">Reject</option>
            </select>
          </div>
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Remarks",
      width: 250,
      renderCell: (params) => (
        <>
          <div className="RegisForm_1">
            <textarea
              id="remarks"
              name="remarks"
              className='custom-textarea'
              value={rowData[params.id]?.remarks || ''}
              onChange={(e) => handleInputChange(params.id, 'remarks', e.target.value, params.row.testname)}
            ></textarea>
          </div>
        </>
      ),
    },
  ];

  const dynamicFields = [
    { field: "UpdateAt", headerName: "Test Date", width: 250 },
    { field: "testmethod", headerName: "Test Mode", width: 250 },
    { field: "testcode", headerName: "Test No", width: 250 },
    { field: "testname", headerName: "Test Title", width: 260 },
    { field: "testnames", headerName: "Particular", width: 280 },

  ];
  const dynamicTables = [
    { field: "id", headerName: "Test Items", width: 150 },
    { field: "testname", headerName: "Sample/Specimen", width: 200 },
    { field: "Sample_Specimen", headerName: "Method", width: 150 },
    { field: "paniclow", headerName: "Panic Low", width: 150 },
    { field: "panichigh", headerName: "Panic High", width: 150 },
    { field: "Capture_Value", headerName: "Capture Value", width: 150 },
    { field: "Remarks", headerName: "Remarks", width: 150 },

  ];


  const dynamicInputs = [
    { field: "id", headerName: "Test Items", width: 150 },
    { field: "testname", headerName: "Sample/Specimen", width: 200 },
    { field: "Sample_Specimen", headerName: "Method", width: 150 },
    { field: "paniclow", headerName: "Panic Low", width: 150 },
    { field: "panichigh", headerName: "Panic High", width: 150 },
    { field: "Capture_Value", headerName: "Capture Value", width: 150 },
    { field: "Remarks", headerName: "Remarks", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
          </Button>
        </>
      ),
    },
  ];



  const handleEditClick = (params) => {
    console.log("bharathi", params);
    setOpenModal(true);
    setSelectedRowData(params);
    
    // setOldStatus(params.status);
    // setStatus(params.status);
  };


  console.log(selectedRowData);
  const handlefunction = () => {
    axios.get(`${urllink}Billing/getcompletedsample?Billinginvoice=${capturedata.Billing_Invoice}`)
      .then((response) => {
        console.log(response.data)
        const data = response.data.map((item, index) => ({
          id: index + 1, // Assigning a unique id based on the item index
          testcode: item.Test_Code,
          testname: item.Test_Name,
          testnames: item.Test_Name,
          Captured_Unit: item.Captured_Unit,
          Container_Name: item.Container_Name,
          Specimen_Name: item.Specimen_Name,
          UpdateAt: capturedata.UpdatedAt,
          paniclow: item.PanicLow,
          panichigh: item.PanicHigh,
          patient_name: capturedata.Patient_Name,
          Billing_Invoice: capturedata.Billing_Invoice

          // You don't need to explicitly include the 'actions' field here
        }));
        setFilteredRows1(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  const handleSubmit = () => {
    
    const postData = {
      ...selectedRowData,
      visitid: capturedata.Visit_Id,
      status: status,
      reason: reason
    };


    console.log(postData)

    axios
      .post(
        `${urllink}Billing/insert_approve_status`,
        postData
      )
      .then((response) => {
        console.log(response);
        setOpenModal(false);
        setshowsudden(!showsudden);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Accordion
        expanded={
          expanded !== "panel2" &&
          expanded !== "panel3" &&
          expanded !== "panel4" &&
          expanded !== "panel5"

        }
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
        >
          <Typography sx={{ width: "45%", flexShrink: 0 }} id="panel1bh-header">
            Patient Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className="appointment">
              <div className="h_head icon_flx_bilg5">
                <h4>
                  <PersonIcon />
                </h4>{" "}
                <h4>Basic Information</h4>
              </div>
              <br />
              <div className="RegisFormcon">
                <div className="RegisForm_1">
                  <label htmlFor="ptName">
                    Patient Name<span>:</span>
                  </label>
                  <input
                    type="text"
                    id="ptName"
                    name="ptName"
                    pattern="[A-Za-z ]+"
                    title="Only letters and spaces are allowed"
                    placeholder="Enter your PT Name"
                    readOnly
                    value={capturedata.Patient_Name}
                  />
                </div>

                <div className="RegisForm_1">
                  <label htmlFor="age">
                    Age<span>:</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    placeholder="Enter your Age"
                    readOnly
                    value={capturedata.Age}
                  />
                </div>
                <div className="RegisForm_1">
                  <label htmlFor="address">
                    Address<span>:</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    className="inventory_textarea"
                    placeholder="Enter your Address"
                    readOnly
                    value={capturedata.Address}
                  ></textarea>
                </div>
              </div>

              <div className="RegisFormcon">
                <div className="RegisForm_1">
                  <label htmlFor="city">
                    Gender<span>:</span>
                  </label>
                  <input
                    type="text"
                    id="Gender"
                    name="Gender"
                    pattern="[A-Za-z ]+"
                    title="Only letters and spaces are allowed"
                    placeholder="Enter your City"
                    readOnly
                    value={capturedata.Gender}
                  />
                </div>
                <div className="RegisForm_1">
                  <label htmlFor="doctorSelect">
                    Phone(WhatsApp)<span>:</span>
                  </label>
                  <input
                    type="number"
                    id="phone(whatsapp)"
                    name="phone(whatsapp)"
                    pattern="[A-Za-z ]+"
                    title="Only letters and spaces are allowed"
                    placeholder="Phone(whatsapp)"
                    readOnly
                    value={capturedata.Phone}
                  />
                </div>
                <div className="RegisForm_1">
                  <label htmlFor="group">
                    Group<span>:</span>
                  </label>
                  <input
                    type="text"
                    id="group"
                    name="group"
                    pattern="[A-Za-z ]+"
                    title="Only letters and spaces are allowed"
                    placeholder="Enter your group"
                    readOnly
                    value={capturedata.Patient_Group}
                  />
                </div>
              </div>
              <br />

              <div className="appointment">
                <div className="h_head">
                  <h4>Test information</h4>
                </div>
                <div className="RegisFormcon">

                  <div className="RegisForm_1">
                    <label htmlFor="doctorName">
                      Doctor Name<span>:</span>
                    </label>
                    <input
                      type="text"
                      id="doctorName"
                      name="doctorName"
                      pattern="[A-Za-z ]+"
                      title="Only letters and spaces are allowed"
                      placeholder="Enter doctorName"
                      readOnly
                      value={capturedata.Refering_Doctor}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="phlebotomist">
                      Phlebotomist type<span>:</span>
                    </label>
                    <input
                      type="text"
                      id="phlebotomist"
                      name="phlebotomist"
                      pattern="[A-Za-z ]+"
                      title="Only letters and spaces are allowed"
                      placeholder="Enter Phlebotomist"
                      readOnly
                      value={capturedata.Phlebotomist_Type}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="phlebotomist">
                      Phlebotomist Name<span>:</span>
                    </label>
                    <input
                      type="text"
                      id="phlebotomist"
                      name="phlebotomist"
                      pattern="[A-Za-z ]+"
                      title="Only letters and spaces are allowed"
                      placeholder="Enter Phlebotomist"
                      readOnly
                      value={capturedata.Phlebotomist_Name}
                    />
                  </div>
                </div>
                <div className="RegisFormcon">

                  <div className="RegisForm_1">
                    <label htmlFor="lab">
                      Test Name<span>:</span>
                    </label>
                    <input
                      type="text"
                      id="lab"
                      name="Lab"
                      pattern="[A-Za-z ]+"
                      title="Only letters and spaces are allowed"
                      placeholder="Enter Test"
                      readOnly
                      value={capturedata.Test_Name}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="testCount">
                      Test Value<span>:</span>
                    </label>
                    <input
                      type="text"
                      id="testCount"
                      name="testCount"
                      pattern="[A-Za-z ]+"
                      title="Only letters and spaces are allowed"
                      placeholder="Enter testCount"
                      readOnly
                      value={capturedata.Test_value}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "45%", flexShrink: 0 }} id="panel1bh-header">
            Test information{" "}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className='grid_1'>
              <ThemeProvider theme={theme}>
                <DataGrid
                  rows={filteredRows.slice(page * pageSize, (page + 1) * pageSize)}
                  columns={dynamicFields}
                  pageSize={pageSize}
                  pageSizeOptions={[pageSize]}
                  onPageChange={(newPage) => setPage(newPage)}
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  className='data_grid'
                />
                {showdown > 0 && filteredRows.length > pageSize && (
                  <div className='IP_grid_foot'>
                    <button
                      onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                      disabled={page === 0}
                    >
                      Previous
                    </button>
                    Page {page + 1} of {totalPages}
                    <button
                      onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))}
                      disabled={page === totalPages - 1}
                    >
                      Next
                    </button>
                  </div>
                )}
              </ThemeProvider>
              {filteredRows.length === 0 && (
                <div className='IP_norecords'>
                  <span>No Records Found</span>
                </div>
              )}
            </div>


          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "45%", flexShrink: 0 }} id="panel1bh-header">
            Sample Collection Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className='grid_1'>
              <ThemeProvider theme={theme}>
                <DataGrid
                  rows={filteredRows.slice(page * pageSize, (page + 1) * pageSize)}
                  columns={dynamicColumns}
                  pageSize={pageSize}
                  pageSizeOptions={[pageSize]}
                  onPageChange={(newPage) => setPage(newPage)}
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  className='data_grid'
                />
                {showdown > 0 && filteredRows.length > pageSize && (
                  <div className='IP_grid_foot'>
                    <button
                      onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                      disabled={page === 0}
                    >
                      Previous
                    </button>
                    Page {page + 1} of {totalPages}
                    <button
                      onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))}
                      disabled={page === totalPages - 1}
                    >
                      Next
                    </button>
                  </div>
                )}
              </ThemeProvider>
              {filteredRows.length === 0 && (
                <div className='IP_norecords'>
                  <span>No Records Found</span>
                </div>
              )}
            </div>


          </Typography>
        </AccordionDetails>
      </Accordion>
      {/* <div>bharathi</div> */}

      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "45%", flexShrink: 0 }} id="panel1bh-header">
            Analyse- Result (From Lab Tech){" "}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className='grid_1'>
              <ThemeProvider theme={theme}>
                <DataGrid
                  rows={filteredRows1.slice(page * pageSize, (page + 1) * pageSize)}
                  columns={dynamicTables}
                  pageSize={pageSize}
                  pageSizeOptions={[pageSize]}
                  onPageChange={(newPage) => setPage(newPage)}
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  className='data_grid'
                />
                {showdown > 0 && filteredRows1.length > pageSize && (
                  <div className='IP_grid_foot'>
                    <button
                      onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                      disabled={page === 0}
                    >
                      Previous
                    </button>
                    Page {page + 1} of {totalPages}
                    <button
                      onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))}
                      disabled={page === totalPages - 1}
                    >
                      Next
                    </button>
                  </div>
                )}
              </ThemeProvider>
              {filteredRows1.length === 0 && (
                <div className='IP_norecords'>
                  <span>No Records Found</span>
                </div>
              )}
            </div>


          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "45%", flexShrink: 0 }} id="panel1bh-header">
            Analyse-Investigation (Sr.Lab Tech){" "}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className="grid_1">
              <ThemeProvider theme={theme}>
                <DataGrid
                  rows={filteredRows1.slice(
                    page * pageSize,
                    (page + 1) * pageSize
                  )}
                  columns={dynamicInputs}
                  pageSize={pageSize}
                  pageSizeOptions={[pageSize]}
                  onPageChange={(newPage) => setPage(newPage)}
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  className="data_grid"
                />
                {showdown > 0 && filteredRows1.length > pageSize && (
                  <div className="IP_grid_foot">
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
              </ThemeProvider>
              {filteredRows1.length === 0 && (
                <div className="IP_norecords">
                  <span>No Records Found</span>
                </div>
              )}

              {openModal && (
                <div
                  className={
                    isSidebarOpen
                      ? "sideopen_showcamera_profile"
                      : "showcamera_profile"
                  }
                  onClick={() => {
                    setOpenModal(false);
                  }}
                >
                  <div
                    className="newwProfiles newwProfiles1122"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="editcont">
                      <div className="RegisFormcon leavecon1">
                        <div className="RegisForm_1 leaveform_11">
                          <label htmlFor="issued">
                            Status<span>:</span>
                          </label>
                          <select
                            name="approval"
                            id="approval"
                            value={status}
                            onChange={handleStatusChange}
                          >
                            <option value="">Select</option>
                            {oldStatus !== "Approved" && (
                              <option value="Approved">Approved</option>
                            )}
                            {oldStatus !== "Not Approved" && (
                              <option value="Not Approved">Not Approved</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* {status === "Not Approved" && ( */}
                    <div className="RegisFormcon leavecon1">
                      <div className="RegisForm_1 leaveform_11 ">
                        <label htmlFor="reason">
                          Reason <span>:</span>
                        </label>
                        <textarea
                          type="text"
                          name="reason"
                          id="reason"
                          onChange={handleReasonChange}
                        ></textarea>
                      </div>
                    </div>
                    {/* )} */}
                    <div className="Register_btn_con regster_btn_contsai">
                      <button
                        className="RegisterForm_1_btns"
                        onClick={handleSubmit}
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
          </Typography>
        </AccordionDetails>
      </Accordion>

      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns">
          Register

        </button>
      </div>

    </div>
  );
};
export default VerifyData;


