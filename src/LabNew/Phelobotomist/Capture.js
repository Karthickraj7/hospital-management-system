import { React, useState, useRef, useEffect } from "react";
// import "./Registration.css";
import Accordion from "@mui/material/Accordion";
import { FaUser, FaVial } from "react-icons/fa";
import "./CaptureGroup.css";
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
// import axios from "axios";
// import './Neww.css';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import Barcode from "react-barcode";
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
          borderBottom: "1px solid  #54d854bf !important",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

const Capture = () => {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);


  const [ formdata, setformdata] = useState({
    patientId:'',
    patientname: '',
    age:'',
    address:'',
    gender: '',
    Phone:'',
    group:'',
    drname:'',
    phlebotomisttype:'',
    Phlebotomistname:'',
    // testname:'',
    testvalue:'',
    updateat:'',
    barcodeid:''
  })


  const navigate = useNavigate();

  // const captureborcodedata = useSelector((state) => state.userRecord?.barcodedata);

 
  const [expanded, setExpanded] = useState(false);
  // const [capturedata, setcapturedata] = useState([])
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
 
  const [filteredRows, setFilteredRows] = useState([]);
  const [remark, setremark] = useState()
  const pageSize = 10;
  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const showdown = filteredRows.length;
  // -------------------------------------
  // const [facingMode, setFacingMode] = useState("user");
  
  const capturedatas = useSelector((state)=>state.userRecord?.Samplecapture)
  console.log(capturedatas)
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [summa, setsumma] = useState()


//   const renderBarcodeSection = () => {
//     return (
//         <div className="bar-code">
//             <div className='barcodeheader'>
//                 {/* <div className='patientdata'><p>Name:</p> {barcodedata?.Patient_Name}</div> */}
//                 {/* <div className='patientdata'><p>Age: </p>{barcodedata?.Age}</div> */}
                
//             </div>
//             <Barcode value={captureborcodedata || ''} lineColor="black" height={50} width={1.5} />
//             {/* <div className='patientdata'> {barcodedata?.UpdatedAt}</div> */}
//         </div>
//     );
// };


useEffect(() => {
  setFilteredRows(prevRows =>
    prevRows.map(row => ({
      ...row,
      barcodedata: formdata.barcodeid,
      UpdateAt: formdata.updateat,

       // Adds or updates the barcodedata property
    }))
  );
}, [formdata.barcodeid, formdata.updateat]); // Re-run this effect when formdata.barcodeid changes

  useEffect(() => {
  
   


if(capturedatas){
 
  axios.get(`${urllink}Billing/getcapturelistforprofile?Billinginvoice=${capturedatas}`)
  .then((response) => {
    console.log(response.data)
      const data = response.data.map((row , index) => ({
          id: index + 1, // Assuming you want to use Patient_Id as id
          ...row,
          // status : "Status"
      }));
      // setcapturedata(data);
      setformdata({
        patientname: data[0].Patient_Name,
        age: data[0].Age,
        address:data[0].Address,
        gender: data[0].Gender,
        Phone:  data[0].Phone,
        group: data[0].Patient_Group,
        drname:  data[0].Refering_Doctor,
        phlebotomisttype: data[0].Phlebotomist_Type,
        Phlebotomistname:data[0].Phlebotomist_Name,
        // testname:'',
        testvalue: data[0].Test_value,
        updateat : data[0].UpdatedAt,
        barcodeid : data[0].Billing_Id,
        patientId: data[0].Patient_Id
        })
      console.log(data)
      
  })
  .catch((error) => {
      console.error('Error fetching data:', error);
  });
  axios.get(`${urllink}Billing/getcapturetestdata?Billinginvoice=${capturedatas}`)
  .then((response) => {
    console.log(response);
    const testdata = response.data
    const data = testdata.map((item, index) => ({
      id: index + 1, // Assigning a unique id based on the item index
      testcode: item.Test_Code,
      testname: item.Test_Name,
      testnames: item.Test_Name,
      Captured_Unit: item.Captured_Unit,
      Container_Name: item.Container_Name,
      Specimen_Name: item.Specimen_Name, 
      Test_Method: item.Test_Method,
      UpdateAt: formdata.updateat,

      barcodedata: formdata.barcodeid
      // You don't need to explicitly include the 'actions' field here
    }));
    setFilteredRows(data);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });
}
  }, [capturedatas]); // Ensure this effect is run once on component mount
  

  console.log("capturedata",filteredRows)
// console.log(summa)





  const dynamicColumns = [
    { field: "id", headerName: "Test Items ", width: 250, height:50 },
    { field: 'action', headerName: 'Barcode', width: 250,height:150,

      renderCell: (params) => (
        <>
        
          {renderBarcodeSection(params.row.barcodedata)} 
        </>
      ),
    },
    { field: "Specimen_Name", headerName: "Sample/Specimen", width: 250, height:50 },
    { field: "Container_Name", headerName: "Container", width: 260, height:50 },
    { field: "Captured_Unit", headerName: "Captured Unit", width: 280, height:50 },
    {
      field: "actions",
      headerName: "Remarks",
      width: 250,    
      height:50,
      renderCell: () => (
        <>
           <div className="RegisForm_1">
           <textarea id="remarks" name="remarks" className='custom-textarea' onChange={(e)=>{setremark(e.target.value)}} ></textarea>
                    
                    
                </div>
        </>
      ),
    },
  ];


  const dynamicFields = [
    { field: "UpdateAt", headerName: "Test Date", width: 250 ,height:150},
    { field: "Test_Method", headerName: "Test Mode", width: 250,height:150 },
    { field: 'action', headerName: 'Barcode', width: 250,height:150,

      renderCell: (params) => (
        <>
  
          {renderBarcodeSection(params.row.barcodedata)} 
        </>
      ),
    },
    { field: "testcode", headerName: "Test No", width: 250 },
    { field: "testname", headerName: "Test Title", width: 260 },
    { field: "testnames", headerName: "Particular", width: 280 },
  ];
  
  // Adjusted renderBarcodeSection to accept barcode data as a parameter
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
 
 
console.log(filteredRows)

  const handlesamplesave =()=>{
 
    const postdata = filteredRows.map(row => ({
      ...row,
      remark: remark, 
      Billing_invoice: capturedatas,
      patientid: formdata.patientId,
      patientname: formdata.patientname
    }));
    

    console.log(postdata)

    axios.post(`${urllink}Phelobotomist/insersamplecapture`, postdata)
    .then((response)=>{
      console.log(response.data)

    })
    .catch((error)=>{
      console.log(error)
    })
    axios.post(`${urllink}Phelobotomist/updatesamplestatus`, {
      Billinginvoice : capturedatas
    })
    .then((response)=>{
      console.log(response)
      navigate('/Home/Lab')
    })
    .catch((error)=>{
      console.log(error)
    })

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
                    value={formdata?.patientname || ''}
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
                    value={formdata?.age|| ''}
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
                    value={formdata?.address|| ''}
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
                    value={formdata.gender}
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
                    value={formdata.Phone}
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
                    value={formdata.group}
                  />
                </div>
              </div>
              {/* <br /> */}

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
                      value={formdata.drname}
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
                      value={formdata.phlebotomisttype}
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
                      value={formdata.Phlebotomistname}
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
                      // value={capturedata[0].Test_Name}
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
                      value={formdata.testvalue}
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
          </Typography>
        </AccordionDetails>
      </Accordion>
     

      <div className="Register_btn_con">
        <button  className="RegisterForm_1_btns" onClick={handlesamplesave}>
        Save
        </button>
      </div>
    </div>
  );
};
export default Capture;
