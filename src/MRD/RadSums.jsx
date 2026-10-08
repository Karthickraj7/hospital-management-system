import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import "../LabNew/Dispatch/testcount.css";
import PrintIcon from '@mui/icons-material/Print';
import logo from "../Assets/kmc.jpeg";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import DonatChat from "../OtherComponent/ReactGrid/DonatChat";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import ForwardIcon from "@mui/icons-material/Forward";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import { PDFDocument, rgb } from 'pdf-lib';


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



const RadSums = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [searchQuery1, setSearchQuery1] = useState(today);
  const [searchQuery2, setSearchQuery2] = useState("date");
  const [searchQuery3, setSearchQuery3] = useState("");
  const [searchQuery4, setSearchQuery4] = useState("All");
  const [searchQuery5, setSearchQuery5] = useState("");
  const [searchQuery6, setSearchQuery6] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [input, setInput] = useState("date");

  const [summa, setsumma] = useState([]);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [totalPages, setTotalPages] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [OpCount, setOpCount] = useState(0);
  const [IpCount, setIpCount] = useState(0);
  const [TestNameList, setTestNameList] = useState([]);
  const [subDep, setSetDep] = useState([]);
  const [chats, setChat] = useState([]);

  const [show, setshow] = useState(false);
  const [loading, setloading] = useState(false);
  const [batman, notBatman] = useState(false);
  const altPressCount = useRef(0); // keeps track of how many times Alt was pressed
  const timeoutRef = useRef(null); // reset counter after some delay

  const [openModal1, setOpenModal1] = useState(false);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const [checkedtestdata, setcheckedtestdata] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [test, setTest] = useState([])
  const [testdetails, settestdetails] = useState([])
  const [newDept, setNewDept] = useState("")
  const [newTest, setNewTest] = useState("")
  const [patient, setPatient] = useState({})
  const handleCheckboxChange = (testCode) => {
    setSelectedTests(
      (prev) =>
        prev.includes(testCode)
          ? prev.filter((code) => code !== testCode) // Uncheck test
          : [...prev, testCode] // Check test
    );
  };
 console.log("dddddddddddddddddd")
  const PrintNavigate = () => {

    const newCheckedTestData = {
      ...checkedtestdata,
      AllTest: selectedTests,
    };
    console.log("print----", selectedTests);

    if (selectedTests?.length === 0) {
      alert("Please select at least one test to continue.");
    } else {
      dispatch({ type: "Capturesample", value: newCheckedTestData });
      dispatch({ type: "HrFolder", value: "labReport" });
      dispatch({ type: "setPreviousFolder", value: "LabTestCount" });
    }
  };

  const dispatch = useDispatch();

  console.log("altpress----------", altPressCount);

  const [type, setType] = useState("Patient");
  const [deptData, setDeptData] = useState([]);
  const handlePageChange = (event, newType) => {
    if (newType !== null && newType !== type) {
      setType(newType);
    }
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      setshow(true);
    },
    onAfterPrint: async () => {
      setshow(false);
    },
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Detect Ctrl + Shift + B
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        notBatman((prev) => !prev); // toggle Batman mode
        console.log("🔑 Ctrl + Shift + B pressed → Toggle Batman!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    if (key === "name") setSearchQuery(value);
    if (key === "date") setSearchQuery1(value);

    if (key === "dateType") {
      setSearchQuery2(value);

      if (value.includes("month")) {
        setInput("month");
      } else {
        setInput("date");
      }

      const todays = new Date().toISOString().slice(0, 10);
      const today = new Date();
      const fullDate = today.toISOString().split("T")[0];
      const currentMonth = fullDate.slice(0, 7);

      if (value === "date") {
        setSearchQuery1(todays);
      } else if (value === "month") {
        setSearchQuery1(currentMonth);
      }
    }

    if (key === "testType") setSearchQuery3(value);
    if (key === "PatientType") setSearchQuery4(value);
    if (key === "from") setFrom(value);
    if (key === "to") setTo(value);
    if (key === "patient") setSearchQuery5(value);
    if (key === "dept") setSearchQuery6(value);
  };

 const fetchsummary = useCallback(() => {
    setsumma([]);
    setloading(true);
    const offset = page * pageSize;

    const isSearchCleared =
      !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;
    console.log("Search Cleared:", isSearchCleared);

    const deptcode = subDep?.filter(
      (d) => d.RadiologyName === searchQuery6
    );
    const dept = deptcode[0]?.id || "";

    const testcode = TestNameList.filter((t) => t.TestName === searchQuery);
    const test = testcode[0]?.TestCode || "";

    if (
      (searchQuery6 !== "" &&
        searchQuery6 !== deptcode[0]?.RadiologyName) ||
      (searchQuery !== "" && searchQuery !== testcode[0]?.TestName)
    ) {
      return;
    }

    console.log("Fetching default data...");
    axios
      .get(
        `${urllink}Radiology/Radiology_Data_Summarys?Location=${userRecord?.location}&limit=${pageSize}&offset=${offset}&testName=${test}&date=${searchQuery1}&dateType=${searchQuery2}&testType=${searchQuery3}&patient=${searchQuery4}&from=${from}&to=${to}&patientName=${searchQuery5}&dept=${dept}&batman=${batman}`
      )
      .then((response) => {
        //   console.log(response.data.test_data);
        const totalrecords = response.data.total_records;
        const Oprecords = response.data.OP_records;
        const Iprecords = response.data.IP_records;
        const chat = [
          { name: "IP", value: Number(Iprecords), color: "#1E90FF" },
          { name: "OP", value: Number(Oprecords), color: "#008000" },
          // { name: "All", value: Number(totalrecords),color: "#008000", },
        ];
        const data = response.data.test_data;
        let Dept = response.data.deptData;
        Dept = Dept.filter((c) => c.opcount !== 0 && c.ipcount !== 0);
        setDeptData(Dept);
        setTotalPages(0);
        setsumma(data);
        setTestCount(totalrecords);
        setOpCount(Oprecords);
        setIpCount(Iprecords);
        setChat(chat);
        setTotalPages(Math.ceil(totalrecords / pageSize));
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        console.error("Error fetching data:", error);
      });
  }, [
    urllink,
    userRecord?.location,
    page,
    searchQuery,
    searchQuery1,
    searchQuery3,
    searchQuery4,
    searchQuery5,
    searchQuery6,
    from,
    to,
  ]);

  useEffect(()=>{
    fetchsummary();
  },[fetchsummary])
  useEffect(() => {
    axios
      .get(`${urllink}Masters/Radiology_details_link?department=${newDept}`)
      .then((res) => {
        console.log(res);
        setTestNameList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get(
        `${urllink}Masters/Radiology_Names_link`
      )
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        setSetDep(data);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });
  }, [urllink, newDept]);

  console.log('dept=================', newDept);


  // const dynamicColumns = [
  //   { key: "id", headerName: "S No", width: 100 },
  //   { key: "Billing_Invoice", headerName: "Invoice", width: 100 },
  //   { key: "Test_Name", headerName: "Test Name", width: 250 },
  //   { key: "Test_Method", headerName: "Test Type", width: 250 },
  //   { key: "Service_Status", headerName: "Collection Status", width: 100 },
  //   { key: "Analysis_Status", headerName: "Report Entry Status", width: 100 },
  //   { key: "Verify_Status", headerName: "Verify Status", width: 100 },
  //   { key: "Approve_Status", headerName: "Approve Status", width: 100 },
  // ];

  const statusColors = {
    captureSample: "#FFD700", // Yellow for Service_Status (Pending)
    labTechnician: "#FFA500", // Orange for Analysis_Status (Pending)
    seniorTechnician: "#1E90FF", // Blue for Verify_Status (Pending)
    pathologist: "#800080", // Purple for Approve_Status (Pending)
    completed: "#008000", // Green for all completed
  };

  const getStatusColor = (row) => {
    if (row.Service_Status === "Pending") return statusColors.captureSample;
    if (row.Analysis_Status === "Pending") return statusColors.labTechnician;
    if (row.Verify_Status === "Pending") return statusColors.seniorTechnician;
    if (row.Approve_Status === "Pending") return statusColors.pathologist;
    return statusColors.completed;
  };

  console.log("Data-----------", selectedTests, checkedtestdata);

  const handleSampleCapture = (row) => {
    console.log("asdadsd--11---", row);

    const captureD = {
      Age: row.Age,
      AllTest: "",
      Barcode: "",
      Billing_Invoice: row.opipid,
      Gender: row.Gender,
      Item_Count: "",
      Patient_Id: row.patientid,
      Patient_Name: row.patientName,
      Phone: row.Phone,
      Refering_Doctor: "Self",
      Visit_Id: "",
      RequestId: row.request,
      date: row.CreatedAt,
      test: row.test,
      Barcode: row.opipid,
      Frequest: row.remark,
    };

    setcheckedtestdata(captureD);
    setOpenModal1(true);
    const setdefaultcheck = row?.test?.map((t) => t.testCode);
    console.log("test-----", setdefaultcheck);

    // setalltest(setdefaultcheck);
    setSelectedTests(setdefaultcheck);
  };

  const handleopenedit = (row) => {
    setPatient(row)
    setOpenModal(true)
    setTest([{
      id: 1,
      Test_Name: row.test,
      Dept_Name: row.dept,
    }])

  }

  const handlenewTest = () => {
    const tdata = TestNameList?.find((t) => t.TestName === newTest)
    setTest([{
      id: 1,
      Test_Name: tdata?.TestName,
      Dept_Name: tdata?.RadiologyName,
      Test_Code: tdata?.TestCode,
      RadiologyId: tdata?.RadiologyId,
    }]);
    setNewDept("");
    setNewTest("");
  }

  const handleChangeTest = () => {
    if (test.length === 1) {
      const postData = {
        Test_Name: test[0]?.Test_Name || "",
        Dept_Name: test[0]?.Dept_Name || "",
        Test_Code: test[0]?.Test_Code || "",
        RadiologyId: test[0]?.RadiologyId || "",
        reqId: patient.request,
        patientId: patient.patientid,
      }
      axios.post(`${urllink}MRD/Change_Mrd_MCI_Test`, postData)
        .then((response) => {
          const data = response.data;
          console.log("data", data);
          fetchsummary();
          setNewDept("");
          setNewTest("");
          setTest([])
          setOpenModal(false)
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  const handleDelete = async (row) => {
  console.log('Delete row:', row);
  
  const confirmDelete = window.confirm(
    `Are you sure you want to delete this record?\nPatient: ${row.patientName}\nTest: ${row.test}`
  );

  if (!confirmDelete) return;

  try {
    setloading(true);

    // Payload must match backend expectations
    const payload = {
      Radiology_RequestId: row.request,  // This is the ID from your row data
      Canceledby: userRecord?.username || "system",
    };

    console.log("Delete payload:", payload);

    // Call the correct endpoint
    await axios.post(`${urllink}Radiology/delete_mci_radiology_request`, payload);

    // Show success message
    alert("Record deleted successfully");
    
    // Refresh the data
    fetchsummary();

  } catch (error) {
    console.error('Error deleting record:', error);
    
    // Show specific error message from backend
    const errorMsg = error.response?.data?.message || 
                     error.message || 
                     "Delete failed. Please try again.";
    alert(`Delete failed: ${errorMsg}`);
    
  } finally {
    setloading(false);
  }
};



  // const dynamicColumns = [
  //   { key: "Sno", headerName: "S No", frozen: true, width: 40 },
  //   {
  //     key: "date",
  //     headerName: "Bill Date",
  //     width: 300,
  //   },
  //   { key: "patientid", headerName: "Patient ID", width: 100 },
  //   { key: "patientType", headerName: "Patient Type", width: 100 },
  //   { key: "patientName", headerName: "Patient Name", width: 300 },
  //   { key: "specialization", headerName: "specialization", width: 100 },
  //   { key: "Age", headerName: "Age", width: 250 },
  //   { key: "dept", headerName: "Department", width: 250 },
  //   { key: "Phone", headerName: "Phone", width: 250 },
  //   { key: "test", headerName: "Tests", width: 250 },
    
  //   {
  //     key: "actions",
  //     headerName: "Report",
  //     width: 100,
  //     renderCell: ({ row }) => (
  //       <>
  //         <Button className="cell_btn" onClick={() => handleviewTestReport(row)}>
  //           <PrintIcon />
  //         </Button>
  //         {searchQuery3 === "PatientS" &&
  //           <Button className="cell_btn" onClick={() => handleopenedit(row)}>
  //             <EditIcon />
  //           </Button>
  //         }
  //       </>
  //     ),
  //   },

  // ];


  const dynamicColumns = [
  { key: "Sno", headerName: "S No", frozen: true, width: 40 },
  {
    key: "date",
    headerName: "Bill Date",
    width: 300,
  },
  { key: "patientid", headerName: "Patient ID", width: 100 },
  { key: "patientType", headerName: "Patient Type", width: 100 },
  { key: "patientName", headerName: "Patient Name", width: 300 },
  { key: "specialization", headerName: "specialization", width: 100 },
  { key: "Age", headerName: "Age", width: 250 },
  { key: "dept", headerName: "Department", width: 250 },
  { key: "Phone", headerName: "Phone", width: 250 },
  { key: "test", headerName: "Tests", width: 250 },
  
  {
    key: "actions",
    headerName: "Actions",
    width: 150, // Increased width to accommodate both buttons
    renderCell: ({ row }) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button 
          className="cell_btn" 
          onClick={() => handleviewTestReport(row)}
          variant="contained"
          size="small"
          color="primary"
        >
          <PrintIcon />
        </Button>
        {searchQuery3 === "PatientS" && (
          <>
            <Button 
              className="cell_btn" 
              onClick={() => handleopenedit(row)}
              variant="contained"
              size="small"
              color="secondary"
            >
              <EditIcon />
            </Button>
            <IconButton
              onClick={() => handleDelete(row)}
              title="Delete"
              size="small"
              sx={{ 
                color: "#d32f2f",
                backgroundColor: '#ffebee',
                '&:hover': { backgroundColor: '#ffcdd2' }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </div>
    ),
  },
 ];


  const dynamicColumns1 = [
    { key: "id", headerName: "S No", width: 100 },
    { key: "Dept_Name", headerName: "Department", width: 250 },
    { key: "Test_Name", headerName: "Test Name", width: 250 },
  ];

  const dynamicColumns2 = [
    { key: "dept_name", headerName: "Department", frozen: true, width: 40 },
    { key: "opcount", headerName: "OP", frozen: true, width: 40 },
    { key: "ipcount", headerName: "IP", frozen: true, width: 40 },
    {
      key: "total",
      name: "Total",
      width: 150,
      renderCell: (params) => {
        // Sum all costs safely
        const total = params?.row?.opcount + params?.row?.ipcount || 0;

        return (
          <div>{total}</div> // display as 2 decimal points
        );
      },
    },
  ];


  const [testReportData, setTestReportData] = useState(null);

 const handleOpenPDF = async (base64PDF, patientInfo) => {
  if (!base64PDF) {
    alert("No report available.");
    return;
  }

  try {
    // Clean base64 (ensure we correctly handle the format)
    let actualBase64 = base64PDF;
    if (actualBase64.startsWith("data:application/pdf;base64,")) {
      actualBase64 = actualBase64.split(",")[1];
    }

    // Convert base64 to Uint8Array
    const existingPdfBytes = Uint8Array.from(atob(actualBase64), (c) => c.charCodeAt(0));
    
    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Embed font
    const font = await pdfDoc.embedFont("Helvetica");

    // Get the first page (most reports have patient info on page 1)
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Define patient info to overlay
    const { patientName, Age, Gender, patientid } = patientInfo;

    // Text options
    const textOptions = {
      font,
      size: 12,
      color: rgb(0, 0, 0), // black
    };

    // Coordinates might need adjustment. Fine-tune them for your PDF.
    const x = 70; // Adjust based on your PDF template
    const yName = 750;  // Adjust this for Name
    const yAge = 730;   // Adjust this for Age
    const yGender = 730; // Adjust this for Gender
    const yPatientId = 710; // Adjust this for Patient ID

    // Example: Replace Name
    firstPage.drawText(patientName || '', {
      x,
      y: yName,
      ...textOptions,
    });

    // Example: Replace Age
    firstPage.drawText(Age ? `${Age} yrs` : '', {
      x,
      y: yAge,
      ...textOptions,
    });

    // Example: Replace Gender
    firstPage.drawText(Gender || '', {
      x: 200, // Adjust if necessary
      y: yGender,
      ...textOptions,
    });

    // Example: Replace Patient ID
    firstPage.drawText(patientid || '', {
      x,
      y: yPatientId,
      ...textOptions,
    });

    // Optional: Cover old text with white rectangles (to hide original data)
    const coverOldText = (x, y, width = 200, height = 15) => {
      firstPage.drawRectangle({
        x,
        y: y - 5,  // Y needs to be adjusted based on text height
        width,
        height,
        color: rgb(1, 1, 1), // white
        opacity: 1,
      });
    };

    // Cover old text before drawing new
    coverOldText(x, yName);  // name
    coverOldText(x, yAge);   // age
    coverOldText(200, yGender); // gender
    coverOldText(x, yPatientId);  // patient id

    // Then draw new text on top
    // (repeat drawText calls after covering)

    // Save modified PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const blobURL = URL.createObjectURL(blob);

    // Open in new window
    const pdfWindow = window.open(blobURL);
    if (!pdfWindow) {
      alert("Popup blocked. Please allow popups.");
    }
  } catch (error) {
    console.error("Error modifying PDF:", error);
    alert("Failed to modify PDF report.");
  }
};

const handleviewTestReport = async (row) => {
  try {
    console.log(row, 'rowwwwwwwwwwwww');
 
    const Testcode = row?.Testcode;
 
    const patientInfo = {
      patientName: row?.patientName,
      Age: row?.Age,
      Gender: row?.Gender,
      patientid: row?.patientid,
      date: row?.date,  
      doctor:row?.doctor,
      test:row?.test
    };
 
    if (!Testcode) {
      console.warn('No Testcode found in row');
      setTestReportData(null);
      return;
    }
 
    const payload = {
      Testcode,
      ...patientInfo,
    };
 
    console.log("Payload for report fetch:", payload);
 
    const url = `${urllink}Radiology/get_original_patient_report_for_dummy_link`;
 
    const response = await axios.get(url, {
      params: payload,
    });
 
    const data = response?.data;
 
    if (Array.isArray(data) && data.length > 0) {
      setTestReportData(data[0]);
 
      handleOpenPDF(data[0]?.File, patientInfo);
    } else {
      console.warn('No report data found');
      setTestReportData(null);
    }
 
  } catch (error) {
    console.error('Error fetching test report:', error);
    setTestReportData(null);
  }
};
 
 


 


  return (
    <div className="appointment">
      <div className="h_head">
        <h3>Radiology Test Data</h3>
      </div>
      <div className="con_1 ">
        <div className="inp_1" style={{ gap: "5px" }}>
          {/* <label htmlFor="input">Date</label> */}
          <select
            name="dateType"
            value={searchQuery2}
            onChange={(e) => handleSearchChange(e, "dateType")}
            style={{ width: "120px" }}
          >
            <option value={"date"}>Date</option>
            <option value={"customdate"}>Custom Date</option>
            <option value={"month"}>Month</option>
            <option value={"custommonth"}>Custom Month</option>
          </select>
          {searchQuery2 === "date" || searchQuery2 === "month" ? (
            <input
              id="input"
              type={input}
              value={searchQuery1}
              onChange={(e) => handleSearchChange(e, "date")}
              placeholder="Enter Invoice Number"
            />
          ) : (
            <div>
              <div style={{ display: "inline-block" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "40px",
                    color: "black",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  From{" "}
                </span>
                <input
                  id="input"
                  type={input}
                  value={from}
                  onChange={(e) => handleSearchChange(e, "from")}
                  placeholder="From Date"
                />
              </div>
              <div style={{ display: "inline-block" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "40px",
                    color: "black",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  To{" "}
                </span>
                <input
                  id="input"
                  type={input}
                  value={to}
                  onChange={(e) => handleSearchChange(e, "to")}
                  placeholder="To Date"
                />
              </div>
            </div>
          )}
        </div>

        <div className="inp_1">
          <label htmlFor="input">Department</label>
          <input
            value={searchQuery6}
            onChange={(e) => handleSearchChange(e, "dept")}
            placeholder="Enter Department"
            type="text"
            id="dept"
            name="dept"
            list="subdepList"
            className=""
            required
            autoComplete="Off"
          />
          <datalist id="subdepList">
            {Array.isArray(subDep) &&
              subDep?.map((row, index) => (
                <option key={index} value={row.RadiologyName} />
              ))}
          </datalist>
        </div>

        <div className="inp_1">
          <label htmlFor="input">Test Name</label>
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e, "name")}
            placeholder="Enter Test Name"
            type="text"
            id="testname"
            name="testname"
            list="testnamelist"
            className=""
            required
            autoComplete="Off"
          />
          <datalist id="testnamelist">
            {Array.isArray(TestNameList) &&
              TestNameList?.map((item, index) => (
                <option key={index} value={item.TestName}>
                  {item.TestCode}
                </option>
              ))}
          </datalist>
        </div>

        {batman && (
          <div className="inp_1">
            <label htmlFor="input">Method</label>
            <select
              value={searchQuery3}
              onChange={(e) => handleSearchChange(e, "testType")}
            >
              <option value={""}>All</option>
              <option value={"Patient"}>Patient</option>
              <option value={"PatientS"}>PatientS</option>
            </select>
          </div>
        )}

        <div className="inp_1">
          <label htmlFor="input">Patient Type</label>
          <select
            value={searchQuery4}
            onChange={(e) => handleSearchChange(e, "PatientType")}
          >
            <option value={"All"}>All</option>
            <option value={"IP"}>IP</option>
            <option value={"OP"}>OP</option>
          </select>
        </div>

        <div className="inp_1">
          <label htmlFor="input">Patient Name</label>
          <input
            name="patient"
            type="text"
            value={searchQuery5}
            onChange={(e) => handleSearchChange(e, "patient")}
            placeholder="Enter Patient Name/Id"
          />
        </div>
      </div>
      <div className="h_head">
        <h3>Radiology Test Counts</h3>
      </div>

      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="input">Test Count :</label>
          <input
            type="text"
            value={testCount}
            onChange={(e) => handleSearchChange(e, "count")}
            readOnly
          />
        </div>
        {searchQuery4 === "All" && (
          <>
            <div className="inp_1">
              <label htmlFor="input">OP Test Count :</label>
              <input
                type="text"
                value={OpCount}
                onChange={(e) => handleSearchChange(e, "count")}
                readOnly
              />
            </div>
            <div className="inp_1">
              <label htmlFor="input">IP Test Count :</label>
              <input
                type="text"
                value={IpCount}
                onChange={(e) => handleSearchChange(e, "count")}
                readOnly
              />
            </div>
          </>
        )}
      </div>
      <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handlePageChange}
          aria-label="Platform"
        >
          <ToggleButton
            value="Patient"
            style={{
              height: "30px",
              width: "180px",
              backgroundColor:
                type === "Patient" ? "var(--selectbackgroundcolor)" : "inherit",
            }}
            className="togglebutton_container"
          >
            Patient
          </ToggleButton>
          <ToggleButton
            value="Department"
            style={{
              backgroundColor:
                type === "Department"
                  ? "var(--selectbackgroundcolor)"
                  : "inherit",
              width: "180px",
              height: "30px",
            }}
            className="togglebutton_container"
          >
            Department
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {/* <div className="I_Love_Donat"> */}
      {/* <DonatChat data={chats} /> */}
      {/* </div> */}
      {/* <div className='grid_1'>
        <ReactGrid
          RowData={summa}
          columns={dynamicColumns}
          className="data_grid"
        />

        {summa.length === 0 && (
          <div className="IP_norecords">
            <span>No Records Found</span>
          </div>
        )}
      </div> */}

      <div className="grid_1">
        {type === "Patient" ? (
          <ReactGrid
            columns={dynamicColumns}
            RowData={summa}
            load={loading}
            className="data_grid"
          />
        ) : (
          <ReactGrid
            columns={dynamicColumns2}
            RowData={deptData}
            load={loading}
            className="data_grid"
          />
        )}
      </div>
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlePrint}>
          Print
        </button>
      </div>
      <div className="lab_Test_Reprot">
        <div className="count-container" ref={componentRef} style={{ marginLeft: "-40px", width: "105%" }}>
          {type === "Patient" ? (
            <table className="count-dabba" style={{ marginLeft: "20px", width: "95%" }}>
              <thead className="count-thead">
                <tr>
                  <td colSpan="9" className="count-header" style={{ paddingLeft: "20px" }}>
                    <div className="padda_potti" style={{ paddingLeft: "20px" }}>
                      <div>
                        <img src={logo} className="paddam" />
                      </div>
                      <div className="paruu">
                        <h2 className="thalaipu">
                          KARUNA MEDICAL COLLEGE HOSPITAL
                        </h2>
                        <h3>Vilayodi, Chittur, Palakkad</h3>
                      </div>
                    </div>
                  </td>
                </tr>
                
                {/* REORDERED COLUMNS AS SPECIFIED WITH DATE AFTER S.No */}
                <tr>
                  <th className="count-th">S.No</th>
                  <th className="count-th">Date</th>
                  <th className="count-th">Patient ID</th>
                  <th className="count-th">Patient Type</th>
                  <th className="count-th">Patient Name</th>
                  <th className="count-th">specialization</th>
                  <th className="count-th">Age</th>
                  <th className="count-th">Department</th>
                  <th className="count-th">Test Name</th>
                </tr>
              </thead>
              <tbody>
                {summa?.length > 0 ? (
                  summa?.map((row, rowIndex) => (
                    <tr key={`${row.Sno}-${rowIndex}`}>
                      <td className="count-td">
                        {rowIndex + 1}
                      </td>
                      <td className="count-td parusu">
                        {row.date}
                      </td>
                      <td className="count-td">
                        {row.patientid}
                      </td>
                      <td className="count-td">
                        {row.patientType}
                      </td>
                      <td className="count-td align-left">
                        {row.patientName}
                      </td>
                      <td className="count-td">
                        {row.specialization}
                      </td>
                      <td className="count-td align-left">
                        {row.Age}
                      </td>
                      <td className="count-td align-left">
                        {row.dept}
                      </td>
                      <td className="count-td align-left">
                        {row.test}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-records">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // Department table with similar adjustments
            <table 
              style={{
                width: "95%",
                borderCollapse: "collapse",
                marginTop: "20px",
                fontFamily: "Arial, sans-serif",
                marginLeft: "20px"
              }}
            >
              <thead>
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      border: "1px solid #444",
                      backgroundColor: "#fff",
                      paddingLeft: "20px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: "20px"
                      }}
                    >
                      <div>
                        <img
                          src={logo}
                          alt="Hospital Logo"
                          style={{ height: "60px", marginRight: "10px" }}
                        />
                      </div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: "20px" }}>
                          KARUNA MEDICAL COLLEGE HOSPITAL
                        </h2>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: "normal",
                          }}
                        >
                          Vilayodi, Chittur, Palakkad
                        </h3>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={{ border: "1px solid #444", padding: "8px" }}>
                    Department
                  </th>
                  <th style={{ border: "1px solid #444", padding: "8px" }}>
                    OP
                  </th>
                  <th style={{ border: "1px solid #444", padding: "8px" }}>
                    IP
                  </th>
                  <th style={{ border: "1px solid #444", padding: "8px" }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {deptData?.length > 0 ? (
                  deptData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td
                        style={{
                          border: "1px solid #444",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {row.dept_name}
                      </td>
                      <td
                        style={{
                          border: "1px solid #444",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.opcount}
                      </td>
                      <td
                        style={{
                          border: "1px solid #444",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {row.ipcount}
                      </td>
                      <td
                        style={{
                          border: "1px solid #444",
                          padding: "8px",
                          textAlign: "right",
                        }}
                      >
                        {row.opcount + row.ipcount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        border: "1px solid #444",
                        padding: "12px",
                        textAlign: "center",
                        color: "#888",
                      }}
                    >
                      No records found
                    </td>
                  </tr>
                )}
                <tr style={{ fontWeight: "bold", backgroundColor: "#e6e6e6" }}>
                  <td
                    style={{
                      border: "1px solid #444",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Total
                  </td>
                  <td
                    style={{
                      border: "1px solid #444",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {deptData.reduce((sum, row) => sum + row.opcount, 0)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #444",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {deptData.reduce((sum, row) => sum + row.ipcount, 0)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #444",
                      padding: "8px",
                      textAlign: "right",
                    }}
                  >
                    {deptData.reduce(
                      (sum, row) => sum + row.opcount + row.ipcount,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
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
            <div className="con_1 ">
              <div className="RegisForm_1">
                <label htmlFor="input">Department</label>
                <input
                  value={newDept}
                  onChange={(e) => { setNewDept(e.target.value) }}
                  placeholder="Enter Department"
                  type="text"
                  id="dept"
                  name="dept"
                  list="subdepList"
                  className=""
                  required
                  autoComplete="Off"
                />
                <datalist id="subdepList">
                  {Array.isArray(subDep) &&
                    subDep?.map((row, index) => (
                      <option key={index} value={row.RadiologyName} />
                    ))}
                </datalist>
              </div>

              <div className="RegisForm_1">
                <label htmlFor="input">Test Name</label>
                <input
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  placeholder="Enter Test Name"
                  type="text"
                  id="testname"
                  name="testname"
                  list="testnamelist"
                  className=""
                  required
                  autoComplete="Off"
                />
                <datalist id="testnamelist">
                  {Array.isArray(TestNameList) &&
                    TestNameList?.map((item, index) => (
                      <option key={index} value={item.TestName}>
                        {item.TestCode}
                      </option>
                    ))}
                </datalist>
              </div>


              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={handlenewTest}
                >
                  <AddIcon />
                </button>
              </div>


            </div>

            <div className="grid_1">
              <ThemeProvider theme={theme}>
                <ReactGrid
                  RowData={test}
                  columns={dynamicColumns1}
                  className="data_grid"
                />
              </ThemeProvider>
            </div>
            <div className="Register_btn_con">
              <button
                className="RegisterForm_1_btns"
                onClick={handleChangeTest}
              >
                Submit
              </button>
              <button
                className="RegisterForm_1_btns"
                onClick={() => { setOpenModal(false); setNewDept('') }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadSums;
