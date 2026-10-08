import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { FaTrash } from "react-icons/fa";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ForwadIcon from "@mui/icons-material/Forward";
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ReportDocview from "../LabNew/Report/ReportDocview";
import { useNavigate } from "react-router-dom";


const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: 'Center',
          color: "var(--header-text-color)",
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
          borderBottom: "1px solid  var(--ProjectColor) !important",
          display: 'flex',
          justifyContent: 'center'
        },
      },
    },
  },
});



const LabTest = () => {
  const navigate = useNavigate()

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("labtest-------------", userRecord);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );
  console.log(DoctorWorkbenchNavigation);
  const [type, setType] = useState("Addtest");
  console.log(UrlLink);
  const [Department, setDepartment] = useState([]);
  const [MainDepartment, setMainDepartment] = useState([]);
  const [TestNameList, setTestNameList] = useState([]);
  const [filteredTestList, setFilteredTestList] = useState([]);
  const [SelectedTest, setSelectedTest] = useState([]);
  console.log(SelectedTest);
  const [testType, setTestType] = useState("Individual");
  const [ProfileData, setProfileData] = useState([]);
  const [SelectedGroupTestList, setSelectedGroupTestList] = useState([]);
  const [isViewTests, setisViewTests] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [openModal2, setOpenModal2] = useState(false);

  const openModal = () => {
    setOpenModal2(true);
  };

  const handleCloseModal1 = () => {
    setOpenModal2(false);

  };




  const [formData, setFormData] = useState({
    SubDepartment_Code: "",
    SubDepartment_Name: "",
    Name: "",
    Test_Code: "",
    testType: testType,
    Remarks: "",
    Group_Code: "",
    Group_Name: "",
    GroupList: null,
    Department_Name: "",
    Department_Code: "",
    created_by: userRecord?.username,
    location: userRecord?.location,
  });

  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");


  console.log(formData);

  const handlePageChange = (event, newType) => {
    if (newType !== null && newType !== type) {
      setType(newType);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const value1 = e.target.value.split("|").map((val) => val.trim());
    const value2 = value1[0];
    const Type = value1[1];

    console.log(value1, value2, Type);

    let SubDepartment_Code;
    let Test_Code;
    let Group_Code;
    let GroupList;
    let Department_Code;
    let Package_Code;

    // if (name === "SubDepartment_Name") {
    //   const selectedDepartment = Department?.find(
    //     (item) => item.SubDepartment_Name === value
    //   );
    //   SubDepartment_Code = selectedDepartment?.SubDepartment_Code;
    // }

    if (Type === "Individual") {
      console.log("premmmmm");
      setTestType(Type);

      const selectedTest = TestNameList?.find(
        (item) => item.Name?.trim().toLowerCase() === value2?.trim().toLowerCase()
      );
      Test_Code = selectedTest?.Code;

      console.log(Test_Code, "Test_Code");
    } else if (Type === "Group") {
      console.log("premmmmm");
      setTestType(Type);

      const selectedTest = TestNameList?.find(
        (item) => item.Name?.trim().toLowerCase() === value2?.trim().toLowerCase()
      );
      Group_Code = selectedTest?.Code;

      console.log(Group_Code, "Test_Code");
    } else if (Type === "Offers") {
      console.log("Gokul...");
      setTestType(Type);

      const selectedTest = TestNameList?.find(
        (item) => item.Name?.trim().toLowerCase() === value2?.trim().toLowerCase()
      );
      Package_Code = selectedTest?.Code;

      console.log(Package_Code, "Test_Code");
    }

    // if (name === "Group_Name") {
    //   const selectedProfile = ProfileData?.find(
    //     (item) => item.Group_Name === value
    //   );
    //   Group_Code = selectedProfile?.Group_Code;
    //   GroupList = selectedProfile?.GroupList;
    // }
    // if (name === "Department_Name") {
    //   const selectedDepartment = MainDepartment?.find(
    //     (item) => item.Department_Name === value
    //   );
    //   console.log(selectedDepartment);
    //   Department_Code = selectedDepartment?.Department_Code;
    // }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value2,
      SubDepartment_Code: SubDepartment_Code || prevData.SubDepartment_Code,
      Test_Code: Test_Code || prevData.Test_Code,
      Group_Code: Group_Code || prevData.Group_Code,
      GroupList: GroupList,
      Department_Code: Department_Code || prevData.Department_Code,
      Package_Code: Package_Code || prevData.Package_Code,
    }));
  };

  const handleAddTest = () => {
    console.log(formData, 'PlaylistAddIcon');
    console.log(SelectedTest, 'PlaylistAddIcon');

    if (formData.Test_Code === "" && formData.Group_Code === "" && formData.Package_Code === "") {

      console.log("testtttttttt");
      const tdata = {
        message: "Test Name are required",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    if (formData) {
      const isTestCodeExists = SelectedTest.some(
        (test) => test.Code === formData?.Test_Code
      );

      const isgroupCodeExists = SelectedTest.some(
        (test) => test.Code === formData?.Group_Code
      );

      const ispkgCodeExists = SelectedTest.some(
        (test) => test.Code === formData?.Package_Code
      );

      console.log(isTestCodeExists, 'isTestCodeExists')

      if (isTestCodeExists) {
        const mess =
          " This Test already exists in Selected Test : " +
          SelectedTest.find((test) => test.Code === formData?.Test_Code).Name;

        const tdata = {
          message: mess,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setFormData((prev) => ({
          ...prev,
          Name: "",
          Test_Code: "",
        }));
      }

      else if (isgroupCodeExists) {

        const mess =
          " This Test already exists in Selected Test : " +
          SelectedTest.find((test) => test.Code === formData?.Group_Code).Name;

        const tdata = {
          message: mess,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setFormData((prev) => ({
          ...prev,
          Name: "",
          Group_Code: "",
        }));

      }

      else if (ispkgCodeExists) {

        const mess =
          " This Test already exists in Selected Test : " +
          SelectedTest.find((test) => test.Code === formData?.Package_Code).Name;

        const tdata = {
          message: mess,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setFormData((prev) => ({
          ...prev,
          Name: "",
          Package_Code: "",
        }));

      }


      else {
        const newvalues = {
          id: SelectedTest.length + 1,
          SubDepartment_Code: formData.SubDepartment_Code,
          SubDepartment_Name: formData?.SubDepartment_Name,
          Name: testType === "Individual" ? formData?.Name : formData?.Name,
          Code:
            testType === "Individual"
              ? formData?.Test_Code
              : testType === "Group"
                ? formData?.Group_Code
                : formData?.Package_Code,
          testType: testType,
          GroupList: formData?.GroupList,
          Department_Name: formData?.Department_Name,
          Department_Code: formData?.Department_Code,
        };
        console.log(newvalues, 'newvaluessssssssss');
        setSelectedTest((prev) => [...prev, newvalues]);
        // const tdata = {
        //   message: "Added Successfully",
        //   type: "success",
        // };
        // dispatchvalue({ type: "toast", value: tdata });
        setFormData((prev) => ({
          ...prev,
          Name: "",
          Test_Code: "",
          Remarks: "",
          Group_Code: "",
          Group_Name: "",
          GroupList: null,
          Package_Code: "",

        }));
      }
    } else {
      const tdata = {
        message: "Select Test",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };



  const handleDelete = (index) => {

    console.log(index, 'index')
    const updatedTests = SelectedTest.filter(
      (test) => test.Code !== index.Code
    );
    setSelectedTest(updatedTests);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;

    const value1 = value.split("|").map(val => val.trim());
    const value2 = value1[0];
    const Type = value1[1];

    console.log(value1, value2, Type);

    let SubDepartment_Code;
    let Test_Code;
    let Group_Code;
    let GroupList;
    let Department_Code;

    if (Type === 'Individual') {
      console.log('Handling Individual Test');
      const selectedTest = TestNameList?.find(item => item.Name === value2);
      Test_Code = selectedTest?.Code;
      console.log(Test_Code, 'Test_Code');
    } else if (Type === 'Group') {
      console.log('Handling Group Test');
      setTestType(Type);
      const selectedTest = TestNameList?.find(item => item.Name === value2);
      Group_Code = selectedTest?.Code;
      console.log(Group_Code, 'Group_Code');
    }

    // Update formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value2,
      SubDepartment_Code: SubDepartment_Code || prevData.SubDepartment_Code,
      Test_Code: Test_Code || prevData.Test_Code,
      Group_Code: Group_Code || prevData.Group_Code,
      GroupList: GroupList,
      Department_Code: Department_Code || prevData.Department_Code,
    }));

    // Handling checkbox selection
    if (checked) {
      // Prevent duplicate selection
      const isTestCodeExists = SelectedTest.some(
        (test) => test.Code === (Type === "Individual" ? Test_Code : Group_Code)
      );

      if (isTestCodeExists) {
        const mess = "This Test already exists in Selected Test: " +
          SelectedTest.find(test => test.Code === (Type === "Individual" ? Test_Code : Group_Code)).Name;

        const tdata = { message: mess, type: "warn" };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const newvalues = {
          id: SelectedTest.length + 1,
          SubDepartment_Code: formData.SubDepartment_Code,
          SubDepartment_Name: formData?.SubDepartment_Name,
          Name: Type === "Individual" ? value2 : formData?.Group_Name,
          Code: Type === "Individual" ? Test_Code : Group_Code,
          testType: Type,
          GroupList: formData?.GroupList,
          Department_Name: formData?.Department_Name,
          Department_Code: formData?.Department_Code,
        };

        console.log("Adding:", newvalues);
        setSelectedTest((prev) => [...prev, newvalues]);

        // const tdata = { message: "Added Successfully", type: "success" };
        // dispatchvalue({ type: "toast", value: tdata });
      }
    } else {
      // Removing the deselected checkbox test
      setSelectedTest(prev => prev.filter(test => test.Code !== (Type === "Individual" ? Test_Code : Group_Code)));
      console.log("Removed:", value2);
    }
  };


  const isChecked = (test) => {
    return SelectedTest.some((t) => t.Code === test.Code);
  };


  const handleView = (row) => {
    console.log(row);
    setSelectedGroupTestList(row?.GroupList);
    setisViewTests(true);
  };

  const Testlistcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },

    // {
    //   key: "testType",
    //   name: "Test Type",
    //   frozen: true,
    // },
    {
      key: "Name",
      name: "Name",
      frozen: true,
    },
    // {
    //   key: "View",
    //   name: "View",
    //   renderCell: (params) =>
    //     params.row.testType !== "Individual" ? (
    //       <Button onClick={() => handleView(params.row)}>
    //         <VisibilityIcon />
    //       </Button>
    //     ) : (
    //       "-"
    //     ),
    // },

    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row)}>
          <DeleteIcon />
        </Button>
      ),
    },
  ];

  const GroupTestlistcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "test_name",
      name: "Name",
      frozen: true,
    },
  ];

  useEffect(() => {

  }, [UrlLink, DoctorWorkbenchNavigation?.Gender, formData?.SubDepartment_Code]);


  const handleSubmitSelectedTest = () => {
    if (SelectedTest) {
      const data = {
        LabQueueId: formData.LabQueueId,
        created_by: userRecord?.username || "",
        Register_Id: DoctorWorkbenchNavigation?.RegistrationId || DoctorWorkbenchNavigation?.pk,
        RegisterType: "OP",
        SelectedTest: SelectedTest,
        location: formData?.location,
        Remarks: formData?.Remarks,
        DoctorId: DoctorWorkbenchNavigation?.DoctorId

      };
      // console.log();

      console.log("data", data);
      axios
        .post(`${UrlLink}OP/Lab_Request_Detailslink`, data)
        .then((res) => {
          const resData = res.data;
          setSelectedTest([])
          const type = Object.keys(resData)[0];
          const message = Object.values(resData)[0];
          const tdata = {
            message: message,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          //  setSelectedTest([]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const tdata = {
        message: "Please Select TestNames Or Favourites Names.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  useEffect(() => {


    axios
      .get(`${UrlLink}Frontoffice/Walk_in_patient_labtestname_details`)
      .then((response) => {
        setTestNameList(response.data);
        setFilteredTestList(response.data);
      })
      .catch((error) => {
        console.error(error); // Properly log the error
      });


  }, [UrlLink]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setsearchQuery(query);

    if (!query) {
      setFilteredTestList(TestNameList); // Reset to full list if empty
      return;
    }

    const filteredList = TestNameList.filter((test) =>
      test.Name.toLowerCase().includes(query)
    );

    setFilteredTestList(filteredList);
  };


  // useEffect(() => {
  //   const fetchPDF = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${UrlLink}OP/ReportData?Request_Id=${DoctorWorkbenchNavigation?.LabRequestId}`,
  //         {
  //           responseType: "arraybuffer", // Use arraybuffer to work with pdf-lib
  //         }
  //       );

  //       // Load the PDF data into pdf-lib
  //       const pdfDoc = response.data;

  //       const modifiedPdfUrl = URL.createObjectURL(
  //         new Blob([pdfDoc], { type: "application/pdf" })
  //       );

  //       setPdfUrl(modifiedPdfUrl); // Set the URL to the modified PDF
  //     } catch (error) {
  //       console.error("Error fetching or editing PDF:", error);
  //     }
  //   };

  //   fetchPDF();
  // }, [UrlLink, DoctorWorkbenchNavigation]);



  const [testdetails, settestdetails] = useState([]);
  const [openModel, setOpenModel] = useState(false);

  const pageSize = 10;
  const [summa, setsumma] = useState([]);
  const [showReport, setshowReport] = useState(false);


  useEffect(() => {
    const offset = 0;

    console.log("----Form-----", DoctorWorkbenchNavigation);

    // Fetch default data
    axios.get(`${UrlLink}Lab/getfor_op_and_iplist?Location=${userRecord?.location}&patientId=${DoctorWorkbenchNavigation?.PatientId}&limit=${pageSize}&offset=${offset}&Location=${userRecord?.location}`)
      .then((response) => {
        console.log(response.data.patients_data);
        const totalrecords = response.data.total_records;
        const data = response.data.patients_data.map((row, index) => ({
          id: index + 1,
          ...row,
          status: "Status"
        }));
        data.sort((a, b) => {
          const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ''), 10);
          const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ''), 10);
          return invoiceB - invoiceA;
        });

        const data1 = data.filter((item) => item.Patient_Id === DoctorWorkbenchNavigation.PatientId);
        setsumma(data1);
        dispatchvalue({ type: 'printpapaer', value: "RDL" });
        dispatchvalue({ type: 'showPrint', value: true });
        console.log(data1, '----------data1-------')
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [UrlLink, userRecord?.location, , DoctorWorkbenchNavigation.PatientId, type]);


  const handleSampleCapture = (params) => {
    console.log(params)
    const data = params
    console.log("-----Data-----", data)
    dispatchvalue({ type: 'Capturesample', value: data });
    setTimeout(() => {
      setshowReport(true)
      setOpenModel(true)
      navigate('/Home/CompleteReports')
    }, 1000);
  };

  const handleview2 = (params) => {
    console.log('params', params);

    settestdetails(params)
    setOpenModel(prev => (
      !prev
    ))
  }


  const dynamicColumns = [
    { key: 'Patient_Id', headerName: 'Patient Id', width: 100 },

    { key: 'Billing_Invoice', headerName: 'IP No', width: 100 },
    { key: 'Visit_Id', headerName: 'Visit Id', width: 70 },
    { key: 'UpdatedAt', headerName: 'Date', width: 100 },
    { key: 'UpdatedAtTime', headerName: 'Time', width: 100 },

    {
      key: 'actions',
      headerName: 'Options',
      width: 100,
      renderCell: (params) => (
        <>
          <Button className='cell_btn' onClick={() => handleSampleCapture(params.row)}>
            <ForwadIcon />
          </Button>
        </>
      ),
    },
    {
      key: 'view',
      headerName: 'View',
      width: 100,
      renderCell: (params) => (
        <>
          <Button className='cell_btn' onClick={() => handleview2(params.row.TestDetails)}>
            <VisibilityIcon />
          </Button>
        </>
      ),
    },
    {
      key: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        const serviceStatuses = params.row.Service_Statuses || [];
        return (
          <Tooltip title={
            <>
              <div>Capture Status : {serviceStatuses[0].Capture}</div>
              <div>Analaysis Status : {serviceStatuses[0].Analaysis}</div>
              <div>Verified Status : {serviceStatuses[0].Verify}</div>
              <div>Approve Status : {serviceStatuses[0].Approve}</div>
            </>
          } arrow>
            <span>{params.row.status}</span>
          </Tooltip>
        );
      },
    },
  ];

  const dynamicColumns1 = [
    { key: 'id', headerName: 'S No', width: 100 },
    { key: 'Test_Name', headerName: 'Test Name', width: 250 },
    { key: 'Service_Status', headerName: 'Collection Status', width: 100 },
    { key: 'Analysis_Status', headerName: 'Report Entry Status', width: 100 },
    { key: 'Verify_Status', headerName: 'Verify Status', width: 100 },
    { key: 'Approve_Status', headerName: 'Approve Status', width: 100 },
  ]







  return (
    <>
      <div className="for" style={{ width: "100%" }}>
        <br />
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handlePageChange}
            aria-label="Platform"
          >
            <ToggleButton
              value="Addtest"
              style={{
                height: "30px",
                width: "180px",
                backgroundColor:
                  type === "Addtest"
                    ? "var(--selectbackgroundcolor)"
                    : "inherit",
              }}
              className="togglebutton_container"
            >
              Add Test
            </ToggleButton>
            <ToggleButton
              value="ViewReport"
              style={{
                backgroundColor:
                  type === "ViewReport"
                    ? "var(--selectbackgroundcolor)"
                    : "inherit",
                width: "180px",
                height: "30px",
              }}
              className="togglebutton_container"
            >
              View Report
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <br></br>
        <br></br>
        {type === "Addtest" && (
          <>
            <div className="RegisFormcon_1">

              <div className="RegisForm_1">
                <label className="" htmlFor="TestName">
                  Test Name <span className="mandatory"></span>
                  <span>:</span>
                </label>

                <input
                  id="TestName"
                  name="Name"
                  list="browsers1"
                  onChange={handleInputChange}
                  value={formData?.Name}
                  required
                  autoComplete="off"
                  placeholder={
                    Array.isArray(TestNameList) && TestNameList.length > 0
                      ? "Select Test"
                      : "No Test available"
                  }
                  disabled={
                    Array.isArray(TestNameList) && TestNameList.length === 0
                  }
                />
                <datalist id="browsers1">
                  {TestNameList && TestNameList.length > 0 ? (
                    TestNameList.map((item) => (
                      <option key={item.Code} value={`${item.Name} | ${item.Type}`}>
                        {item.Name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No tests available
                    </option>
                  )}
                </datalist>
              </div>

              <button onClick={handleAddTest}>
                <PlaylistAddIcon />
              </button>

              <div className="RegisForm_1">

                <Button onClick={() => openModal()}>
                  <VisibilityIcon />
                </Button>
              </div>

              {Array.isArray(SelectedTest) && SelectedTest.length > 0 && (
                <div className="Main_container_app">
                  <ReactGrid columns={Testlistcolumns} RowData={SelectedTest} />
                </div>
              )}

              {Array.isArray(SelectedTest) && SelectedTest.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div className="RegisForm_1">
                    <label>
                      Remarks<span>:</span>
                    </label>
                    <textarea
                      name="Remarks"
                      value={formData.Remarks}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}


            </div>
          </>
        )}


        {openModal2 && (
          <div className="loader" onClick={handleCloseModal1}>
            <div className="cardModel" onClick={(e) => e.stopPropagation()}>
              <div className="Main_container_app">
                <h3>Test Names</h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    placeItems: "center",
                    gap: "15px",
                    padding: "0px 15px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <div className="con_1">
                      <div className="inp_1">
                        <label htmlFor="input">
                          Test Name <span>:</span>
                        </label>
                        <input
                          type="text"
                          value={searchQuery}
                          placeholder="Enter Test Name"
                          onChange={(e) => handleSearchChange(e, "name")}
                        />
                      </div>
                    </div>
                  </div>

                  {Array.isArray(filteredTestList) && filteredTestList.length > 0 ? (
                    filteredTestList.map((test, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`test-${index}`}
                          style={{
                            gap: "15px",
                            padding: "10px",
                          }}
                        >
                          <input
                            type="checkbox"
                            name="testArray"
                            id={`test-${index}`}
                            value={`${test.Name} | ${test.Type}`}
                            checked={isChecked(test)}
                            onChange={(e) => handleCheckboxChange(e, test)}
                          />
                          {test.Name}
                        </label>
                        <span>{test.Amount}</span>
                      </div>
                    ))
                  ) : (
                    <div className="Add_items_Purchase_Master">
                      <span>No Test Found</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* {type === "ViewReport" && (
          <>
            {pdfUrl ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <iframe
                  style={{
                    height: "400px",
                    width: "800px",
                    backgroundColor: "#f0f0f0",
                    border: "none",
                  }}
                  src={pdfUrl}
                />
              </div>
            ) : (
              <>
                <span>Report is Not Ready</span>
              </>
            )}
          </>
        )} */}
        {type === "ViewReport" && (
          <>
            <ReactGrid
              columns={dynamicColumns}
              RowData={summa} />

            {openModel && (
              <div
                className={
                  "showcamera_profile"
                }
              >
                <div className="newwProfiles newwPopupforreason">
                  {showReport ? (
                    <ReportDocview />
                  ) :
                    <div className='grid_1'>
                      <ThemeProvider theme={theme}>
                        <ReactGrid
                          RowData={testdetails}
                          columns={dynamicColumns1}
                          className='data_grid'
                        />

                      </ThemeProvider>
                    </div>
                  }
                  <div className="Register_btn_con">
                    <button
                      className="RegisterForm_1_btns"
                      onClick={() => { setOpenModel(false); setshowReport(false); }}
                    >
                      close
                    </button>
                  </div>
                </div>
              </div>
            )}

          </>

        )}


      </div>

      {isViewTests && (
        <div className="loader" onClick={() => setisViewTests(false)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DivCenter_container">View Test</div>

            <ReactGrid
              columns={GroupTestlistcolumns}
              RowData={SelectedGroupTestList}
            />
            <div className="Main_container_Btn">
              <button onClick={() => setisViewTests(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="Main_container_Btn">
        <button onClick={handleSubmitSelectedTest}>
          {/* {indivitualChecked.length > 0 ? "Save" : "Update"} */}
          save
        </button>
      </div>
      <ModelContainer />

      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default LabTest;
