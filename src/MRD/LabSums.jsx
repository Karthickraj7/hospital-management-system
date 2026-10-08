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
import PrintIcon from "@mui/icons-material/Print";
import logo from "../Assets/kmc.jpeg";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import DonatChat from "../OtherComponent/ReactGrid/DonatChat";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import ForwardIcon from "@mui/icons-material/Forward";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { a } from "@react-spring/web";
import UploadIcon from '@mui/icons-material/Upload';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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

const LabSums = () => {
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
  const [SelectedTest, setSelectedTest] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Test_Code: "",
  });

  const [addPatient, setAddPatient] = useState({
    date: today,
    time: "",
    department: "",
    patientId: "",
    patientName: "",
    tests: [],
  });

  const [patientFiles, setPatientFiles] = useState({}); // Store files by patient ID
  const [isUploading, setIsUploading] = useState(false);
  const [patientType, setpatientType] = useState("OP")


  console.log(addPatient, 'addPatientttttttttttt')


  const [summa, setsumma] = useState([]);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);

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
  const [openModal, setOpenModal] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [test, setTest] = useState([]);
  const [patient, setPatient] = useState({});

  const [show, setshow] = useState(false);
  const [loading, setloading] = useState(false);
  const [batman, notBatman] = useState(false);
  const altPressCount = useRef(0); // keeps track of how many times Alt was pressed
  const timeoutRef = useRef(null); // reset counter after some delay

  const [openModal1, setOpenModal1] = useState(false);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const [checkedtestdata, setcheckedtestdata] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  const [editTest, setEditTest] = useState(false);
  const [newTest, setNewTest] = useState("");
  const [specializationData, setSpecializationData] = useState([]);
  const [newTestList, setNewTestList] = useState([]);

  const handleCheckboxChange = (testCode) => {
    setSelectedTests(
      (prev) =>
        prev.includes(testCode)
          ? prev.filter((code) => code !== testCode) // Uncheck test
          : [...prev, testCode] // Check test
    );
  };

  //  const handleopenedit = (row) => {
  //   setPatient(row)
  //   setOpenModal(true)
  //   setTest([{
  //     id: 1,
  //     Test_Name: row.test,
  //     Dept_Name: row.dept,
  //   }])

  // }

  const handleopenedit = (row) => {
    setPatient(row);
    setOpenModal(true);

    // Map through all tests to create proper structure
    const testData =
      row.test?.map((testItem, index) => ({
        id: index + 1,
        Test_Name: testItem?.testName || "",
        TestCode: testItem?.testCode || "",
      })) || [];

    setTest(testData);
  };

  const PrintNavigate = () => {
    const newCheckedTestData = {
      ...checkedtestdata,
      AllTest: selectedTests,
    };

    if (selectedTests?.length === 0) {
      alert("Please select at least one test to continue.");
    } else {
      dispatch({ type: "Capturesample", value: newCheckedTestData });
      dispatch({ type: "HrFolder", value: "labReport" });
      dispatch({ type: "setPreviousFolder", value: "LabTestCount" });
    }
  };

  const dispatch = useDispatch();


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

  // --- UPDATED FILE UPLOAD FUNCTIONS ---

  // 1. Function to handle file upload for specific patient
  const handleFileUpload = async (file, patientId) => {
    if (!file || !patientId) return;

    setIsUploading(true);

    // Convert file to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64File = await toBase64(file);

      // Create a unique key for this patient's file
      const fileKey = `labPatientFile_${patientId}`;

      // Store file with patient ID
      setPatientFiles(prev => ({
        ...prev,
        [patientId]: {
          base64: base64File,
          name: file.name,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          patientId: patientId
        }
      }));

      // Also store in localStorage for persistence
      localStorage.setItem(fileKey, JSON.stringify({
        base64: base64File,
        name: file.name,
        type: file.type,
        patientId: patientId
      }));

      // Show success toast
      const tdata = {
        message: `File uploaded for patient ${patientId}`,
        type: "success",
      };
      dispatch({ type: "toast", value: tdata });

    } catch (error) {
      console.error("Error uploading file:", error);
      const tdata = {
        message: "Failed to upload file. Please try again.",
        type: "error",
      };
      dispatch({ type: "toast", value: tdata });
    } finally {
      setIsUploading(false);
    }
  };

  // 2. Function to view uploaded file for specific patient
  const handleViewFile = (patientId) => {
    const fileInfo = patientFiles[patientId];

    if (!fileInfo || !fileInfo.base64) {
      alert("No file uploaded for this patient.");
      return;
    }

    const fileData = fileInfo.base64;

    // For PDF files
    if (fileData.includes("data:application/pdf")) {
      let actualBase64 = fileData;
      if (fileData.startsWith("data:application/pdf;base64,")) {
        actualBase64 = fileData.split(",")[1];
      }

      const byteCharacters = atob(actualBase64);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL, '_blank');

    } else if (fileData.includes("data:image/")) {
      // For images
      const byteCharacters = atob(fileData.split(',')[1]);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileInfo.type });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      // For other files, download
      const byteCharacters = atob(fileData.split(',')[1]);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileInfo.type });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileInfo.name || `patient_${patientId}_document`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }
  };

  // 3. Function to remove uploaded file for specific patient
  const handleRemoveFile = (patientId) => {
    setPatientFiles(prev => {
      const updated = { ...prev };
      delete updated[patientId];
      return updated;
    });

    // Remove from localStorage
    localStorage.removeItem(`labPatientFile_${patientId}`);

    const tdata = {
      message: "File removed successfully",
      type: "info",
    };
    dispatch({ type: "toast", value: tdata });
  };

  // 4. Load saved files on component mount
  useEffect(() => {
    const loadedFiles = {};

    // Load all patient files from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('labPatientFile_')) {
        try {
          const fileData = JSON.parse(localStorage.getItem(key));
          const patientId = fileData.patientId || key.replace('labPatientFile_', '');
          loadedFiles[patientId] = fileData;
        } catch (error) {
          console.error(`Error loading file ${key}:`, error);
        }
      }
    }

    setPatientFiles(loadedFiles);
  }, []);

  // 5. Cleanup URLs on component unmount (optional)
  useEffect(() => {
    return () => {
      // If you need to clean up blob URLs, you can do it here
      Object.values(patientFiles).forEach(file => {
        // Note: We're not creating blob URLs until viewing
      });
    };
  }, [patientFiles]);


  const fetchsummary = useCallback(() => {
    setsumma([]);
    setloading(true);
    const offset = page * pageSize;

    const isSearchCleared =
      !searchQuery && !searchQuery1 && !searchQuery2 && !searchQuery3;

    const deptcode = subDep?.filter(
      (d) => d.SubDepartment_Name === searchQuery6
    );
    const dept = deptcode[0]?.SubDepartment_Code || "";

    const testcode = TestNameList.filter((t) => t.name === searchQuery);
    const test =
      testcode[0]?.Test_Code ||
      testcode[0]?.group_code ||
      testcode[0]?.package_code ||
      "";

    if (
      (searchQuery6 !== "" &&
        searchQuery6 !== deptcode[0]?.SubDepartment_Name) ||
      (searchQuery !== "" && searchQuery !== testcode[0]?.name)
    ) {
      return;
    }

    axios
      .get(
        `${urllink}Lab/Get_Test_Count_Data?Location=${userRecord?.location}&limit=${pageSize}&offset=${offset}&testName=${test}&date=${searchQuery1}&dateType=${searchQuery2}&testType=${searchQuery3}&patient=${searchQuery4}&from=${from}&to=${to}&patientName=${searchQuery5}&dept=${dept}&batman=${batman}`
      )
      .then((response) => {
        const totalrecords = response.data.total_records;
        const Oprecords = response.data.OP_records;
        const Iprecords = response.data.IP_records;
        let SpecData = response.data.specializationData || [];
        const chat = [
          { name: "IP", value: Number(Iprecords), color: "#1E90FF" },
          { name: "OP", value: Number(Oprecords), color: "#008000" },
          // { name: "All", value: Number(totalrecords),color: "#008000", },
        ];
        const data = response.data.test_data;
        let Dept = response.data.deptData;
        Dept = Dept.filter((c) => c.opcount !== 0 && c.ipcount !== 0);
        SpecData = SpecData.filter((c) => c.opcount !== 0 || c.ipcount !== 0);
        setDeptData(Dept);
        setTotalPages(0);
        setsumma(data);
        setTestCount(totalrecords);
        setOpCount(Oprecords);
        setIpCount(Iprecords);
        setChat(chat);
        setTotalPages(Math.ceil(totalrecords / pageSize));
        setloading(false);
        setSpecializationData(SpecData);
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

  useEffect(() => {
    fetchsummary();
  }, [fetchsummary]);

  useEffect(() => {
    axios
      .get(`${urllink}Lab/test_and_group_forpackage`)
      .then((res) => {
        setTestNameList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get(
        `${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`
      )
      .then((response) => {
        const data = response.data;
        setSetDep(data);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });
  }, [urllink]);
  console.log("heeeeee")
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


  const handleSampleCapture = (row) => {

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

    // setalltest(setdefaultcheck);
    setSelectedTests(setdefaultcheck);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // const handleAddPatient = (e) => {
  //   console.log()
  //   setAddPatient({
  //     ...addPatient,
  //     [e.target.name]: e.target.value
  //   });
  // };

  const handleAddPatient = (e) => {
    const { name, value } = e.target;
    setAddPatient({
      ...addPatient,
      [name]: value,
    });
  };


  const handleAddTest = () => {
    if (!formData.Name) return;

    const exists = SelectedTest.some(
      (test) => test.Name === formData.Name
    );

    if (exists) return;

    const test = TestNameList.find((t) => t.name === formData.Name);

    setSelectedTest((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        Name: formData.Name,
        Code: test.Test_Code ||
          test.group_code ||
          test.package_code ||
          ""
      },
    ]);

    setFormData({ Name: "", Test_Code: "" });
  };
  const handleDelete = (row) => {
    setSelectedTest((prev) =>
      prev.filter((test) => test.id !== row.id)
    );
  };


  const Testlistcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    {
      key: "Name",
      name: "Name",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row)}>
          <DeleteIcon />
        </Button>
      ),
    },
  ];


  // const dynamicColumns = [
  //   { key: "Sno", headerName: "S No", frozen: true, width: 40 },
  //   {
  //     key: "date",
  //     headerName: "Bill Date",
  //     width: 300,
  //   },
  //   { key: "patientType", headerName: "Patient Type", width: 100 },
  //   { key: "patientid", headerName: "Patient ID", width: 100 },
  //   { key: "opipid", headerName: "OP/IP No", width: 100 },
  //   { key: "patientName", headerName: "Patient Name", width: 300 },
  //   // { key: "Phone", headerName: "Phone", width: 250 },
  //   { key: "Specialization", headerName: "Specialization", width: 250 },

  //   // { key: "Test_Name", headerName: "Test Name", width: 250 },
  //   {
  //     key: "Test_Names",
  //     name: "Tests",
  //     width: 150,
  //     renderCell: (params) => {
  //       // Ensure test array exists
  //       const tests = Array.isArray(params?.row?.test) ? params?.row?.test : [];

  //       // Map each test to a single display string
  //       const testData = tests.map(
  //         (t) => t?.testName || t?.groupName || t?.packageName || "Unknown"
  //       );

  //       // Remove duplicates
  //       const uniqueTestData = Array.from(new Set(testData));

  //       return (
  //         <>
  //           {uniqueTestData?.length > 0 ? (
  //             uniqueTestData?.map((d, index) => (
  //               <div key={index} style={{ fontSize: "10px" }}>
  //                 {d}
  //               </div>
  //             ))
  //           ) : (
  //             <div>No test</div>
  //           )}
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     key: "actions",
  //     headerName: "Report",
  //     width: 100,
  //     renderCell: ({ row }) => (
  //       <>
  //         <Button className="cell_btn" onClick={() => handleSampleCapture(row)}>
  //           <PrintIcon />
  //         </Button>
  //         {searchQuery3 === "PatientS" && (
  //           <Button className="cell_btn" onClick={() => handleopenedit(row)}>
  //             <EditIcon />
  //           </Button>
  //         )}
  //       </>
  //     ),
  //   },
  //   // {
  //   //   key: "Test_Method",
  //   //   headerName: "Test Type",
  //   //   width: 250,
  //   //   renderCell: (params) => params.row.Test_Method?.toString().toUpperCase()
  //   // },
  //   // { key: "Service_Status", headerName: "Collection Status", width: 100 },
  //   // { key: "Analysis_Status", headerName: "Report Entry Status", width: 100 },
  //   // { key: "Verify_Status", headerName: "Verify Status", width: 100 },
  //   // { key: "Approve_Status", headerName: "Approve Status", width: 100 },
  //   // {
  //   //   key: 'status', // Ensure this matches the key in your data
  //   //   headerName: 'Status',
  //   //   width: 100,
  //   //   renderCell: (params) => {
  //   //     // Handle possibly undefined Service_Statuses
  //   //     const serviceStatuses = params.row.Service_Status || [];
  //   //     return (
  //   //       <Tooltip title={
  //   //         <>
  //   //           {/* <div>Capture Status : {serviceStatuses[0].Capture}</div> */}
  //   //           <div>Analaysis Status : {params.row.Analysis_Status}</div>
  //   //           <div>Verified Status : {params.row.Verify_Status}</div>
  //   //           <div>Approve Status : {params.row.Approve_Status}</div>
  //   //         </>
  //   //       } arrow>
  //   //         <span>{params.row.status}</span>
  //   //       </Tooltip>
  //   //     );
  //   //   },
  //   // },
  //   // {
  //   //   key: "Status",
  //   //   name: "Status",
  //   //   width: 100,
  //   //   renderCell: (params) => (
  //   //     <div
  //   //       style={{
  //   //         backgroundColor: getStatusColor(params.row),
  //   //         color: '#fff',
  //   //         textAlign: 'center',
  //   //         padding: '4px',
  //   //         borderRadius: '4px',
  //   //       }}
  //   //     >
  //   //       {params.row.Service_Status === "Pending" ? "Capture Sample" :
  //   //         params.row.Analysis_Status === "Pending" ? "Lab Technician" :
  //   //           params.row.Verify_Status === "Pending" ? "Senior Technician" :
  //   //             params.row.Approve_Status === "Pending" ? "Pathologist" : "Completed"}
  //   //     </div>
  //   //   ),
  //   // },
  // ];



  const dynamicColumns = [
    { key: "Sno", headerName: "S No", frozen: true, width: 40 },
    {
      key: "date",
      headerName: "Bill Date",
      width: 300,
    },
    { key: "patientType", headerName: "Patient Type", width: 100 },
    { key: "patientid", headerName: "Patient ID", width: 100 },
    // { key: "opipid", headerName: "OP/IP No", width: 100 },
    { key: "patientName", headerName: "Patient Name", width: 300 },
    { key: "Specialization", headerName: "Specialization", width: 250 },
    {
      key: "Test_Names",
      name: "Tests",
      width: 150,
      renderCell: (params) => {
        const tests = Array.isArray(params?.row?.test) ? params?.row?.test : [];
        const testData = tests.map(
          (t) => t?.testName || t?.groupName || t?.packageName || "Unknown"
        );
        const uniqueTestData = Array.from(new Set(testData));

        return (
          <>
            {uniqueTestData?.length > 0 ? (
              uniqueTestData?.map((d, index) => (
                <div key={index} style={{ fontSize: "10px" }}>
                  {d}
                </div>
              ))
            ) : (
              <div>No test</div>
            )}
          </>
        );
      },
    },
    {
      key: "actions",
      headerName: searchQuery3 === "PatientS" ? "Actions" : "Report",
      width: searchQuery3 === "PatientS" ? 250 : 100, // Increased width for extra buttons
      renderCell: ({ row }) => {
        const patientId = row.patientid;
        const hasFile = patientFiles[patientId];

        return (
          <div style={{ display: "flex", gap: "5px" }}>
            <Button
              className="cell_btn"
              onClick={() => handleSampleCapture(row)}
              title="Print Report"
            >
              <PrintIcon />
            </Button>

            {searchQuery3 === "PatientS" && (
              <>
                <Button
                  className="cell_btn"
                  onClick={() => handleopenedit(row)}
                  title="Edit"
                >
                  <EditIcon />
                </Button>

                {/* File Upload for PatientS */}
                <Button className="cell_btn" title="Upload File" disabled={isUploading}>
                  <input
                    type="file"
                    id={`file-upload-${patientId}`}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                    style={{
                      display: 'none',
                      position: 'absolute',
                      width: '30px',
                      height: '30px',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], patientId);
                      }
                    }}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor={`file-upload-${patientId}`}
                    style={{
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <UploadIcon />
                  </label>
                </Button>

                {/* View Uploaded File - Only show if this patient has a file */}
                {hasFile && (
                  <Button
                    className="cell_btn"
                    onClick={() => handleViewFile(patientId)}
                    title={`View ${hasFile.name}`}
                  >
                    <VisibilityIcon />
                  </Button>
                )}

                {/* Remove File Button - Only show if this patient has a file */}
                {hasFile && (
                  <Button
                    className="cell_btn"
                    onClick={() => handleRemoveFile(patientId)}
                    title="Remove File"
                    style={{ color: '#ff4444' }}
                  >
                    <DeleteIcon />
                  </Button>
                )}
              </>
            )}
          </div>
        );
      },
    },
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

  const dynamicColumns1 = [
    { key: "id", headerName: "S No", width: 100 },
    // { key: "Dept_Name", headerName: "Department", width: 250 },
    {
      key: "Test_Name",
      headerName: "Test Name",
      width: 250,
      renderCell: ({ row }) => (
        <>
          {editTest === row.TestCode && editTest !== "" ? (
            <>
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
                    <option key={index} value={item.name}>
                      {item.Test_Code}
                    </option>
                  ))}
              </datalist>
            </>
          ) : (
            row.Test_Name
          )}
        </>
      ),
    },
    {
      key: "action",
      headerName: "Change",
      width: 250,
      renderCell: ({ row }) => (
        <>
          <Button className="cell_btn" onClick={() => handleEdit(row)}>
            <EditIcon />
          </Button>
          <Button className="cell_btn" onClick={() => handlenewTest(row)}>
            <CheckCircleOutlineIcon />
          </Button>
        </>
      ),
    },
  ];

  const handleEdit = (row) => {
    setEditTest(row.TestCode);

    const testData = newTestList.filter((t) => t.TestCode !== row.TestCode);
    setNewTestList([...testData, row]);
  };

  const handlenewTest = (row) => {
    const tdata = TestNameList?.find((t) => t.name === newTest);

    const newRow = {
      ...row,
      oldTestCode: row.TestCode,
      oldTestName: row.Test_Name,
      Test_Name: tdata?.name,
      TestCode: tdata?.Test_Code,
      TestMethod: tdata?.testmethod,
    };

    const updatedList = newTestList.map((item) =>
      item.TestCode === row.TestCode ? newRow : item
    );
    const table = test.filter((t) => t.TestCode !== row.TestCode);
    setTest([...table, newRow]);
    setNewTestList(updatedList);
    setNewTest("");
    setEditTest("");
  };

  const handleChangeTest = () => {
    console.log("update_________");
    
    if (test.length !== 0) {
      console.log("inside If________");
      
      const postData = {
        tests: newTestList,
        reqId: patient.request,
        patientId: patient.patientid,
      };
      axios
        .post(`${urllink}MRD/Change_Mrd_MCI_Lab_Test`, postData)
        .then((response) => {
          const data = response.data;
          fetchsummary();
          setTest([]);
          setNewTestList([]);
          setOpenModal(false);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };


  const [newPatient, setNewPatient] = useState("");
  const [specialDept, setSpecialDept] = useState([]);


  useEffect(() => {
    if (addPatient?.department === "") {
      return;
    }
    const specality = specialDept?.find((d) => d.SpecialityName === addPatient?.department);
    axios.get(`${urllink}MRD/Add_Manual_Mrd_Lab?department=${specality?.Speciality_Id}&type=${patientType}`)
      .then((response) => {
        const data = response.data;
        console.log("Add_Manual_Mrd_Lab", data.data);

        setNewPatient(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }, [urllink, addPatient?.department, patientType]);

  useEffect(() => {
    axios.get(`${urllink}Masters/Speciality_Detials_link`)
      .then((response) => {
        const data = response.data;
        setSpecialDept(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [])

  const handleAddNewPatient = () => {
    const pats = newPatient?.find((p) => {
      if (p.Type === "OP") {
        return String(p.No) === String(addPatient.patientId);
      }
      if (p.Type === "IP") {
        return String(p.No) === String(addPatient.patientId);
      }
      return false;
    });

    console.log(pats, "Patients");


    const postData = {
      date: addPatient?.date,
      time: addPatient?.time,
      PatientId: pats?.PatientId,
      Register_No: pats?.No,
      tests: SelectedTest,
      createdby: userRecord?.username,
      location: userRecord?.location,
      type: patientType,
    }

    axios.post(`${urllink}MRD/Add_Manual_Mrd_Lab`, postData)
      .then((response) => {
        const data = response.data;
        fetchsummary();
        setAddPatient({
          date: today,
          department: "",
          patientId: "",
          patientName: "",
          tests: [],
        });
        setSelectedTest([]);
        const tdata = {
          message: data.message,
          type: data.type,
        };
        dispatch({ type: "toast", value: data });
        setOpenModal3(false)
      }
      )
      .catch((error) => {
        console.error("Error:", error);
        const tdata = {
          message: error,
          type: "error",
        };
        dispatch({ type: "toast", value: tdata });
      });
  };

  const dynamicColumns3 = [
    { key: "specialization_name", headerName: "Specialization", width: 200 },
    { key: "opcount", headerName: "OP", width: 100 },
    { key: "ipcount", headerName: "IP", width: 100 },
    {
      key: "total",
      headerName: "Total",
      width: 100,
      renderCell: (params) => {
        const total = params?.row?.opcount + params?.row?.ipcount || 0;
        return <div>{total}</div>;
      },
    },
  ];



  return (
    <div className="appointment">
      <div className="h_head">
        <h3>Lab Test Data(M)</h3>
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
                <option key={index} value={row.SubDepartment_Name} />
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
                <option key={index} value={item.name}>
                  {item.Test_Code}
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
        {/* {searchQuery3 === "PatientS" &&
          <button
            className="RegisterForm_1_btns"
          >
            <AddCircleOutlineIcon />
          </button>
        } */}
        {searchQuery3 === "PatientS" && (
          <button
            className="RegisterForm_1_btns"
            onClick={() => setOpenModal3(true)} // ← Add this line
          >
            <AddCircleOutlineIcon />
          </button>
        )}
      </div>

      <div className="h_head">
        <h3>Lab Test Counts</h3>
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
          <ToggleButton value="Specialization"
            style={{
              backgroundColor:
                type === "Department"
                  ? "var(--selectbackgroundcolor)"
                  : "inherit",
              width: "180px",
              height: "30px",
            }}>Specialization
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
        ) : type === "Department" ? (
          <ReactGrid
            columns={dynamicColumns2}
            RowData={deptData}
            load={loading}
            className="data_grid"
          />
        ) : (
          <ReactGrid
            columns={dynamicColumns3}
            RowData={specializationData}
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
        <div className="count-container" ref={componentRef}>
          {type === "Patient" ? (
            <table className="count-dabba">
              <thead className="count-thead">
                <tr>
                  <td colSpan="8" className="count-header">
                    <div className="padda_potti">
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
                {/* <div className="kattam"> */}
                <tr>
                  <th className="count-th">S.No</th>
                  <th className="count-th">Date</th>
                  <th className="count-th">Patient ID</th>
                  {/* <th className="count-th">IP/OP No</th> */}
                  <th className="count-th">Patient Name</th>
                  {/* <th>Phone</th> */}
                  <th className="count-th">Test Name</th>
                  {/* <th>Amount</th> */}
                </tr>
                {/* </div> */}
              </thead>
              <tbody>
                {summa?.length > 0 ? (
                  summa.map((row, rowIndex) =>
                    row.test.map((t, testIndex) => (
                      <tr key={`${row.Sno}-${testIndex}`}>
                        {/* Only show patient info on the first test row */}
                        {testIndex === 0 && (
                          <>
                            <td rowSpan={row.test.length} className="count-td">
                              {rowIndex + 1}
                            </td>
                            <td
                              rowSpan={row.test.length}
                              className="count-td parusu"
                            >
                              {row.date}
                            </td>
                            <td rowSpan={row.test.length} className="count-td">
                              {row.patientid}
                            </td>
                            {/* <td rowSpan={row.test.length} className="count-td">
                              {row.opipid}
                            </td> */}
                            <td
                              rowSpan={row.test.length}
                              className="count-td align-left"
                            >
                              {row.patientName}
                            </td>
                          </>
                        )}
                        {/* Test info */}
                        <td className="count-td align-left">{t.testName}</td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan="8" className="no-records">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // <table className="count-dabba">
            //   <thead className="count-thead">
            //     <tr>
            //       <td colSpan="8" className="count-header">
            //         <div className="padda_potti">
            //           <div>
            //             <img src={logo} className="paddam" />
            //           </div>
            //           <div className="paruu">
            //             <h2 className="thalaipu">
            //               KARUNA MEDICAL COLLEGE HOSPITAL
            //             </h2>
            //             <h3>Vilayodi, Chittur, Palakkad</h3>
            //           </div>
            //         </div>
            //       </td>
            //     </tr>
            //     {/* <div className="kattam"> */}
            //     <tr>
            //       <th className="count-th">Department</th>
            //       <th className="count-th">OP</th>
            //       <th className="count-th">IP</th>
            //       <th className="count-th">Total</th>
            //     </tr>
            //     {/* </div> */}
            //   </thead>
            //   <tbody>
            //     {deptData?.length > 0 ? (
            //       deptData.map((row, rowIndex) =>
            //           <tr key={`${rowIndex}`}>
            //                 <td className="count-td parusu">{row.dept_name}</td>
            //                 <td className="count-td">{row.opcount}</td>
            //                 <td className="count-td">{row.ipcount}</td>
            //                 <td className="count-td align-left">{row.ipcount + row.opipid}</td>
            //           </tr>
            //       )
            //     ) : (
            //       <tr>
            //         <td colSpan="8" className="no-records">
            //           No records found
            //         </td>
            //       </tr>
            //     )}
            //   </tbody>
            // </table>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
                fontFamily: "Arial, sans-serif",
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
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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

      {openModal3 && (
        <div
          className={isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"}
          onClick={() => setOpenModal3(false)}
        >
          <div
            className="newwProfiles newwPopupforreason uwagduaguleaveauto foradvanceview"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="appointment">
              <div className="h_head">
                <h4>Add Patient Test</h4>
              </div>

              <div className="con_1">
                <div className="RegisForm_1">
                  <label>Date</label>
                  <input
                    name="date"
                    value={addPatient?.date || ""}
                    onChange={(e) => handleAddPatient(e)}
                    type="date"
                  />
                </div>
                <div className="RegisForm_1">
                  <label>Time</label>
                  <input
                    name="time"
                    value={addPatient?.time || ""}
                    onChange={(e) => handleAddPatient(e)}
                    type="time"
                  />
                </div>

                <div className="inp_1">
                  <label htmlFor="input">Patient Type</label>
                  <select
                    value={patientType}
                    onChange={(e) => setpatientType(e.target.value)}
                  >
                    <option value={"OP"}>OP</option>
                    <option value={"IP"}>IP</option>
                  </select>
                </div>

                <div className="RegisForm_1">
                  <label htmlFor="department">Department</label>
                  <input
                    name="department"
                    value={addPatient?.department || ""}
                    onChange={(e) => handleAddPatient(e)}
                    placeholder="Enter Department"
                    type="text"
                    id="department"
                    list="deptList"
                  />
                  <datalist id="deptList">
                    {Array.isArray(specialDept) &&
                      specialDept?.map((row, index) => (
                        <option key={index} value={row.SpecialityName} />
                      ))}
                  </datalist>
                </div>

                <div className="RegisForm_1">
                  <label htmlFor="patientId">Patient ID</label>
                  <input
                    name="patientId"
                    value={addPatient?.patientId || ""}
                    onChange={(e) => handleAddPatient(e)}
                    placeholder="Enter Patient ID"
                    type="text"
                    id="patientId"
                    list="patientList"
                  />
                  <datalist id="patientList">
                    {Array.isArray(newPatient) &&
                      newPatient
                        .map((row, index) => (
                          <option key={index} value={row.No}>
                            {row.PatientId} | {row.FirstName} | {row.Age}
                          </option>
                        ))}
                  </datalist>
                </div>


                <div className="RegisForm_1">
                  <label>Test Name <span>:</span></label>
                  <input
                    name="Name"
                    list="testOptions"
                    value={formData?.Name || ""}
                    onChange={handleInputChange}
                    placeholder="Select Test"
                  />
                  <datalist id="testOptions">
                    {Array.isArray(TestNameList) && TestNameList.map((item, index) => (
                      <option
                        key={index}
                        value={item.name || item.Name || ""}
                      />
                    ))}
                  </datalist>
                  <button onClick={handleAddTest}>
                    <PlaylistAddIcon />
                  </button>
                </div>

              </div>
              <ReactGrid
                columns={Testlistcolumns}
                RowData={SelectedTest}
              />


              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setOpenModal3(false)}
                >
                  Close
                </button>
                <button
                  className="RegisterForm_1_btns"
                  onClick={handleAddNewPatient}
                >
                  Submit
                </button>
              </div>
            </div>
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
                      checkedtestdata?.test?.length > 0 &&
                      selectedTests.length === checkedtestdata.test.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Select all
                        setSelectedTests(
                          checkedtestdata.test.map((test) => test.testCode)
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
                {checkedtestdata?.test?.map((test, index) => (
                  <div
                    className="test-item"
                    key={test.testCode}
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
                      id={test.testCode}
                      value={test.testCode}
                      checked={selectedTests.includes(test.testCode)} // Controlled checkbox
                      onChange={() => handleCheckboxChange(test.testCode)}
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      htmlFor={test.testCode}
                      className="RegisForm_1"
                      style={{
                        fontSize: "18px !important",
                        width: "300px",
                        cursor: "pointer",
                      }}
                    >
                      {test.testName}
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
                onClick={() => {
                  setOpenModal(false);
                }}
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

export default LabSums;


