import { React, useState, useRef, useEffect } from "react";
// import "./Registration.css";
import Accordion from "@mui/material/Accordion";
import { FaUser, FaVial } from "react-icons/fa";
// import "./CaptureGroup.css";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import Webcam from "react-webcam";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Helmet } from "react-helmet";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
// import axios from "axios";
// import './Neww.css';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Barcode from "react-barcode";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "#54d854bf",
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
          borderBottom: "1px solid  #54d854bf !important",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

const SampleCapture = ({ isSidebarOpen, registerdata, forpatienteedit }) => {

  const [rowData, setRowData] = useState({});
  // const [FormData1,setFormData1] = useState([])
  // setFormData1(registerdata.formData)
  const navigate = useNavigate();
  // const webcamRef = useRef(null);
  const webcamRef1 = useRef(null);
  const webcamRef2 = useRef(null);
  // const webcamRef3 = useRef(null);
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


  const [rowData1, setRowData1] = useState({});

  const capturedata = useSelector((state)=>state.userRecord?.Samplecapture)
  console.log(capturedata)


  // const [isImageCaptured3, setIsImageCaptured3] = useState(false);

  const [hide, setHide] = useState(false);

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredRows1, setFilteredRows1] = useState([]);

  const pageSize = 10;
  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const showdown = filteredRows.length;

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


  const handleInputChange1 = (id, field, value, testname) => {
    console.log(`Updating row ${id}, field ${field}, with value ${value}`);
    
    setRowData1(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
        // Assuming testname doesn't change, we can just copy it from the previous state
        testname,
      },
    }));
  };
  

  const [summa, setsumma] = useState({capturedata})

  useEffect(() => {
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
          patient_name:capturedata.Patient_Name,
          Billing_Invoice: capturedata.Billing_Invoice,
          barcodedata : capturedata.Barcode_id

          
          // You don't need to explicitly include the 'actions' field here
        }));
        setFilteredRows(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [capturedata.Billing_Invoice]); // Ensure this effect is run once on component mount
  


  const handlefunction =()=>{
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
        patient_name:capturedata.Patient_Name,
        Billing_Invoice: capturedata.Billing_Invoice
        
        // You don't need to explicitly include the 'actions' field here
      }));
      setFilteredRows1(data);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
  }
   

  console.log(filteredRows)
  
  const dynamicColumns = [
    { field: "id", headerName: "Test Items ", width: 250 },
    { field: "Specimen_Name", headerName: "Sample/Specimen", width: 250 },
    { field: "Container_Name", headerName: "Container", width: 260 },
    { field: 'action', headerName: 'Barcode', width: 250,height:150,
      // Ensure renderCell can use the current row's data
      renderCell: (params) => (
        <>
          {/* Call renderBarcodeSection with current row's barcode data */}
          {renderBarcodeSection(params.row.barcodedata)} {/* Adjusted to match your data structure */}
        </>
      ),
    },
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
              onChange={(e) => handleInputChange(params.id, 'process', e.target.value,params.row.testname)}
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
              onChange={(e) => handleInputChange(params.id, 'remarks', e.target.value,params.row.testname)}
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
    { field: "Specimen_Name", headerName: "Sample/Specimen", width: 200 },
    { field: "Container_Name", headerName: "Method", width: 150 },
    { field: "paniclow", headerName: "Panic Low", width: 150 },
    { field: "panichigh", headerName: "Panic High", width: 150 },
    {
      field: "capturevalue",
      headerName: "Capture Value",
      width: 240,
      renderCell: (params) => (
        <>
          <input
            type="number"
            name="capturevalue"
            id ="capturevalue"
            value={rowData1[params.id]?.capturevalue}
            onChange={(e) => handleInputChange1(params.id, 'capturevalue', e.target.value, params.row.testname)}
          />
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Remark",
      width: 250,
      renderCell: (params) => (
        <>
          <div className="RegisForm_1">
            <textarea
              id="reportremarks"
              name="reportremarks"
              className="custom-textarea"
              value={rowData1[params.id]?.reportremarks}
              onChange={(e) => handleInputChange1(params.id, 'reportremarks', e.target.value, params.row.testname)}
            ></textarea>
          </div>
        </>
      ),
    },
  ];
  

  const renderBarcodeSection = (barcodeValue) => {
    return (
      <div className="bar-code">
        <div className='barcodeheader'>
          {/* Conditional rendering based on the existence of barcodeValue */}
        </div>
        <Barcode value={barcodeValue || ''} lineColor="black" height={50} width={1.5} />
      </div>
    );
  };




    const handleSubmitAnalyseReport = ()=>{
      console.log(filteredRows);
      const postdata ={ 
        ...rowData,
        Billing_Invoice: capturedata.Billing_Invoice
      }
   


axios.post(`${urllink}Phelobotomist/updatereportsamplestatus`,postdata)
.then((response)=>{
  console.log(response)
  handlefunction()
  setHide(true)
})
.catch((error)=>{
  console.log(error)
})
}

const handlereportsubmit=()=>{
  const recorddata = {
    filteredRows,
    ...rowData1
  }

  console.log(recorddata)
if(rowData1.length!=0){
      axios.post(`${urllink}Phelobotomist/insert_analyse_investigation_result`,recorddata)
  .then((response)=>{
    console.log(response)
  })
  .catch((error)=>{
    console.log(error)
})
}
}


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
            <div className="grid_1">
              <ThemeProvider theme={theme}>
                <DataGrid
                  rows={filteredRows.slice(
                    page * pageSize,
                    (page + 1) * pageSize
                  )}
                  columns={dynamicFields}
                  pageSize={pageSize}
                  pageSizeOptions={[pageSize]}
                  onPageChange={(newPage) => setPage(newPage)}
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  className="data_grid"
                />
                {showdown > 0 && filteredRows.length > pageSize && (
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
              {filteredRows.length === 0 && (
                <div className="IP_norecords">
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
            Sample Capture
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className="grid_1">
              <ThemeProvider theme={theme}>
                <DataGrid
                  rows={filteredRows.slice(
                    page * pageSize,
                    (page + 1) * pageSize
                  )}
                  columns={dynamicColumns}
                  pageSize={pageSize}
                  pageSizeOptions={[pageSize]}
                  onPageChange={(newPage) => setPage(newPage)}
                  hideFooterPagination
                  hideFooterSelectedRowCount
                  className="data_grid"
                />
                {showdown > 0 && filteredRows.length > pageSize && (
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
              {filteredRows.length === 0 && (
                <div className="IP_norecords">
                  <span>No Records Found</span>
                </div>
              )}
            </div>
            <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleSubmitAnalyseReport}>
          Save
        </button>
      </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      {/* <div>bharathi</div> */}

      {hide?  <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "45%", flexShrink: 0 }} id="panel1bh-header">
            Analyse-Investigation Result{" "}
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
                  columns={dynamicTables}
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
              {filteredRows.length === 0 && (
                <div className="IP_norecords">
                  <span>No Records Found</span>
                </div>
              )}
            </div>

            <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlereportsubmit}>
          Save
        </button>
      </div>
          </Typography>
        </AccordionDetails>
      </Accordion>:null}

      
    </div>
  );
};
export default SampleCapture;



