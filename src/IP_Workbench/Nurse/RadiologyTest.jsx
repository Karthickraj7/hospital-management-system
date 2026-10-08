
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import { FaTrash } from "react-icons/fa";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import Button from "@mui/material/Button";
// import ToggleButton from "@mui/material/ToggleButton";
// import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";

// const RadiologyTest = () => {
//     const [TestNames, setTestNames] = useState([]);
//     const [FilteredTestNames, setFilteredTestNames] = useState([]);
//     const [searchQuery, setsearchQuery] = useState([]);

//     const [completeArr, SetCompleteArr] = useState([]);

//     const [Takentest, setTakentest] = useState([]);

//     const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//     const userRecord = useSelector((state) => state.userRecord?.UserData);
//     const toast = useSelector((state) => state.userRecord?.toast);
//     const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);


//     console.log(IP_DoctorWorkbenchNavigation, 'DoctorWorkbenchNavigation');
//     const dispatchvalue = useDispatch();
//     const [type, setType] = useState("AddTest");
//     const handlePageChange = (event, newType) => {
//         if (newType !== null && newType !== type) {
//             setType(newType);
//         }
//     };

//     useEffect(() => {
//         axios
//             .get(`${UrlLink}Masters/Radiology_details_link_view`)
//             .then((res) => {
//                 const ress = res.data;
//                 setTestNames(ress);
//                 setFilteredTestNames(ress);
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }, [UrlLink]);

//     useEffect(() => {
//         if (IP_DoctorWorkbenchNavigation && IP_DoctorWorkbenchNavigation?.RegistrationId) {
//             axios
//                 .get(`${UrlLink}OP/get_radiology_test_name_for_IPPatient?RegistrationId=${IP_DoctorWorkbenchNavigation.RegistrationId}`)
//                 .then((res) => {
//                     setTakentest(res.data);
//                 })
//                 .catch((err) => {
//                     console.error(err);
//                 });
//         }
//     }, [IP_DoctorWorkbenchNavigation?.RegistrationId]);

//     const Takenradtest = [

//         {
//             key: "S_No",
//             name: "S.No",
//             frozen: true,
//         },
//         {
//             key: "ServiceType",
//             name: "Radiology Name",
//         },
//         {
//             key: "TestName",
//             name: "TestName",
//         },

//     ]





//     const [SubtestNo, setSubtestNo] = useState([]);

//     const handleSearchTest = (e) => {
//         const query = e.target.value.toLowerCase();
//         setsearchQuery(query);

//         if (!query) {
//             setFilteredTestNames(TestNames); // reset to full data
//             return;
//         }

//         const filteredlist = TestNames.map((dept) => {
//             const filteredTests = dept.TestNames?.filter(
//                 (test) =>
//                     test?.TestName?.toLowerCase().includes(query)
//             );

//             return {
//                 ...dept,
//                 TestNames: filteredTests,
//             };
//         }).filter((dept) => dept.TestNames.length > 0); // keep only those with matching tests

//         console.log("Filtered result:", filteredlist);
//         setFilteredTestNames(filteredlist);
//     };


//     const handleCheckboxSubtestNo = (
//         Curr_Amount,
//         testid,
//         TestName,
//         Radiologyid,
//         RadiologyName,
//         TestCode,
//     ) => {
//         const isChecked = SubtestNo.some((item) => item.TestCode === TestCode);
//         if (isChecked) {
//             const newCheckedState = SubtestNo.filter(
//                 (item) => item.TestCode !== TestCode
//             );
//             setSubtestNo(newCheckedState);
//         } else {
//             const newCheckedState = [
//                 ...SubtestNo,
//                 {
//                     Radiologyid,
//                     RadiologyName,
//                     testid,
//                     TestName,
//                     Curr_Amount,
//                     TestCode
//                 },
//             ];
//             setSubtestNo(newCheckedState);
//         }
//     };

//     const handleRemoveTestName = (row) => {
//         // Remove from SubtestNo (if applicable)
//         const newSubtestNoState = SubtestNo.filter(
//             (item) =>
//                 item.testid !== row.testid || item.Radiologyid !== row.Radiologyid
//         );
//         setSubtestNo(newSubtestNoState);
//     };


//     const IndivitualColumns = [
//         {
//             key: "id",
//             name: "S.No",
//             frozen: true,
//         },
//         {
//             key: "TestCode",
//             name: "Test Code",

//         },
//         {
//             key: "RadiologyName",
//             name: "Radiology Name",

//         },

//         {
//             key: "TestName",
//             name: "Test Name",
//         },
//         {
//             key: "Action",
//             name: "Action",
//             renderCell: (params) => (
//                 <Button
//                     className="cell_btn"
//                     onClick={() => handleRemoveTestName(params.row)}
//                 >
//                     <FaTrash className="check_box_clrr_cancell" />
//                 </Button>
//             ),
//         },
//     ];




//     const transformFavouriteData = (SubtestNo) => {
//         return SubtestNo.map((sutestno, ind) => ({
//             Radiologyid: sutestno.Radiologyid, // Correctly assign Radiologyid
//             RadiologyName: sutestno.RadiologyName,
//             TestCode: sutestno.TestCode,
//             TestName: sutestno.TestName,
//             testid: sutestno.testid, // Correctly assign testid
//             id: ind + 1, // Ensure unique key for each row
//         }));
//     };

//     const transformedFavouriteData1 = transformFavouriteData(SubtestNo);

//     const [RadiologyTest, setRadiologyTest] = useState({
//         RadiologyTestId: "",
//         SubtestNoArr: "",
//     });
//     const [IsRadilogyGet, setIsRadilogyGet] = useState(false);
//     const [no, setno] = useState([]);


//     const handleSubmitRadiologyTest = () => {
//         if (SubtestNo.length > 0) {
//             const data = {
//                 RadiologyTestId: RadiologyTest.RadiologyTestId,
//                 SubtestNoArr: SubtestNo,
//                 created_by: userRecord?.username || "",
//                 Register_Id: IP_DoctorWorkbenchNavigation?.RegistrationId,
//                 RegisterType: "IP",
//             };
//             console.log("data", data);
//             axios
//                 .post(`${UrlLink}OP/Radiology_Request_Detailslink`, data)
//                 .then((res) => {
//                     const resData = res.data;
//                     const type = Object.keys(resData)[0];
//                     const message = Object.values(resData)[0];
//                     const tdata = {
//                         message: message,
//                         type: type,
//                     };
//                     dispatchvalue({ type: "toast", value: tdata });
//                     setIsRadilogyGet((prev) => !prev);
//                     setRadiologyTest({
//                         RadiologyTestId: "",
//                         SubtestNoArr: [],
//                     });
//                     setSubtestNo([]);
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 });
//         } else {
//             const tdata = {
//                 message: "Please Select TestNames .",
//                 type: "warn",
//             };
//             dispatchvalue({ type: "toast", value: tdata });
//         }
//     };

//     useEffect(() => {
//         const params = {
//             Register_Id: IP_DoctorWorkbenchNavigation.pk,
//             RegisterType: "IP",
//         };
//         axios
//             .get(`${UrlLink}OP/Radiology_Request_Detailslink`, { params })
//             .then((res) => {
//                 const ress = res.data;
//                 console.log("response117655", ress);
//                 setno(ress?.IsSubTestNo);
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }, [IsRadilogyGet, UrlLink, IP_DoctorWorkbenchNavigation.RegistrationId]);



//     const noColumns = [
//         {
//             key: "id",
//             name: "S.No",
//             frozen: true,
//         },

//         {
//             key: "RadiologyName",
//             name: "Radiology Name",
//             width: 170,
//         },

//         {
//             key: "TestName",
//             name: "Test Name",
//         },
//     ];
//     useEffect(() => {
//         if (IP_DoctorWorkbenchNavigation?.pk) {
//             // Ensure pk exists
//             const params = {
//                 Register_Id: IP_DoctorWorkbenchNavigation.pk,
//                 RegisterType: "IP",
//             };

//             axios
//                 .get(`${UrlLink}OP/Radiology_Complete_Details_Link`, { params })
//                 .then((res) => {
//                     const ress = res.data;
//                     console.log("Response Data:", ress);
//                     SetCompleteArr(ress); // Update state with the response
//                 })
//                 .catch((err) => {
//                     console.error("Error fetching data:", err);
//                 });
//         }
//     }, [UrlLink, IP_DoctorWorkbenchNavigation?.pk]); // Add pk to the dependency array

//     const RadiologyColumns = [
//         {
//             key: "id",
//             name: "S.No",
//             frozen: true,
//         },

//         {
//             key: "RadiologistName",
//             name: "Radiologist Name",
//         },
//         {
//             key: "TechnicianName",
//             name: "Technician Name",
//         },
//         {
//             key: "RadiologyName",
//             name: "Radiology Name",
//         },
//         {
//             key: "TestName",
//             name: "TestName",
//         },

//         {
//             key: "Action",
//             name: "Action",
//             renderCell: (params) => (
//                 <Button
//                     key={params.row.id} // Assuming `id` is unique for each row
//                     className="cell_btn"
//                     onClick={() => handleViewComplete(params.row)}
//                 >
//                     <VisibilityIcon className="check_box_clrr_cancell" />
//                 </Button>
//             ),
//         },
//     ];

//     const [Radiology, setRadiology] = useState({
//         ReportDate: "",
//         ReportTime: "",
//         RadiologistName: "",
//         TechnicianName: "",
//         Report: "",
//     });
//     const [ChooseFile, setChooseFile] = useState({
//         ChooseFileOne: null,
//         ChooseFileTwo: null,
//         ChooseFileThree: null,
//     });
//     const [IsViewMode, setIsViewMode] = useState(false);
//     const Selectedfileview = (fileval) => {
//         console.log("fileval", fileval);
//         if (fileval) {
//             let tdata = {
//                 Isopen: false,
//                 content: null,
//                 type: "image/jpg",
//             };
//             if (
//                 ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
//                     fileval?.split(",")[0]
//                 )
//             ) {
//                 tdata = {
//                     Isopen: true,
//                     content: fileval,
//                     type: "image/jpeg",
//                 };
//             } else if (fileval?.split(",")[0] === "data:image/png;base64") {
//                 tdata = {
//                     Isopen: true,
//                     content: fileval,
//                     type: "image/png",
//                 };
//             } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
//                 tdata = {
//                     Isopen: true,
//                     content: fileval,
//                     type: "application/pdf",
//                 };
//             }

//             dispatchvalue({ type: "modelcon", value: tdata });
//         } else {
//             const tdata = {
//                 message: "There is no file to view.",
//                 type: "warn",
//             };
//             dispatchvalue({ type: "toast", value: tdata });
//         }
//     };
//     const formatLabel = (label) => {
//         if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
//             return label
//                 .replace(/([a-z])([A-Z])/g, "$1 $2")
//                 .replace(/^./, (str) => str.toUpperCase());
//         } else {
//             return label;
//         }
//     };
//     const handleClear = () => {
//         setRadiology({
//             ReportDate: "",
//             ReportTime: "",
//             RadiologistName: "",
//             TechnicianName: "",
//             Report: "",
//         });

//         setChooseFile({
//             ChooseFileOne: null,
//             ChooseFileTwo: null,
//             ChooseFileThree: null,
//         });
//     };

//     const handleViewComplete = (row) => {
//         setIsViewMode(true);
//         setRadiology({
//             ...row,
//             ReportDate: row.ReportDate || "",
//             ReportTime: row.ReportTime || "",
//             RadiologistName: row.RadiologistName || "",
//             TechnicianName: row.TechnicianName || "",
//             Report: row.Report || "",
//         });
//         setChooseFile({
//             ChooseFileOne: row.Report_fileone,
//             ChooseFileTwo: row.Report_filetwo,
//             ChooseFileThree: row.Report_filethree,
//         });

//     };



//     const showAllFilesInModel = () => {
//         const fileValues = Object.values(ChooseFile).filter(file => file); // Filter out null values

//         if (fileValues.length > 0) {
//             const tdata = {
//                 Isopen: true,
//                 content: fileValues, // Pass all files as an array
//                 type: "multiple", // Add a type to signify multiple files
//             };
//             dispatchvalue({ type: "modelcon", value: tdata }); // Dispatch to open modal
//         } else {
//             const tdata = {
//                 message: "There are no files to view.",
//                 type: "warn",
//             };
//             dispatchvalue({ type: "toast", value: tdata });
//         }
//     };


//     return (
//         <>
//             <br />

//             <div className="for">
//                 <div className="RegisFormcon">
//                     <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
//                         <ToggleButtonGroup
//                             value={type}
//                             exclusive
//                             onChange={handlePageChange}
//                             aria-label="Platform"
//                         >
//                             <ToggleButton
//                                 value="AddTest"
//                                 style={{
//                                     height: "30px",
//                                     width: "180px",
//                                     backgroundColor:
//                                         type === "AddTest"
//                                             ? "var(--selectbackgroundcolor)"
//                                             : "inherit",
//                                 }}
//                                 className="togglebutton_container"
//                             >
//                                 Add Test123
//                             </ToggleButton>
//                             <ToggleButton
//                                 value="ViewTest"
//                                 style={{
//                                     backgroundColor:
//                                         type === "ViewTest"
//                                             ? "var(--selectbackgroundcolor)"
//                                             : "inherit",
//                                     width: "180px",
//                                     height: "30px",
//                                 }}
//                                 className="togglebutton_container"
//                             >
//                                 View Test
//                             </ToggleButton>
//                         </ToggleButtonGroup>
//                     </div>

//                     {type === "AddTest" && (
//                         <>
//                             <div style={{ marginTop: '10px', marginLeft: '40%', display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
//                                 <label style={{ fontWeight: 'bold' }}>
//                                     Search Test :
//                                 </label>
//                                 <input
//                                     style={{ width: "150px", height: '22px', borderRadius: '5px', border: '1px solid grey' }}
//                                     type="text"
//                                     value={searchQuery}
//                                     onChange={(e) => handleSearchTest(e, 'name')}
//                                 />
//                             </div>
//                             <div style={{ width: '100%' }}>
//                                 {FilteredTestNames.map((item) => (
//                                     <div key={item.id}>
//                                         {/* Display RadiologyName */}
//                                         <div style={{ margin: '10px' }}>
//                                             <label
//                                                 htmlFor={item.id}
//                                                 style={{ fontSize: "20px", fontWeight: "bold" }}
//                                                 className="par_acc_lab"
//                                             >
//                                                 {item.RadiologyName}
//                                             </label>
//                                         </div>

//                                         <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
//                                             {/* Check if TestNames is not empty */}
//                                             {item.TestNames.length > 0 ? (
//                                                 item.TestNames.map((test) => (
//                                                     <div
//                                                         key={test.id}
//                                                         style={{ width: '180px', display: 'flex', marginLeft: "20px", marginTop: "5px", rowGap: '10px', columnGap: '10px' }}
//                                                     >
//                                                         {/* Checkbox for selecting test */}
//                                                         <input
//                                                             type="checkbox"
//                                                             id={test.id}
//                                                             onChange={() =>
//                                                                 handleCheckboxSubtestNo(
//                                                                     test.Curr_Amount,
//                                                                     test.id,
//                                                                     test.TestName,
//                                                                     item.id,
//                                                                     item.RadiologyName,
//                                                                     test.TestCode
//                                                                 )
//                                                             }
//                                                             checked={SubtestNo.some(
//                                                                 (checkedItem) =>
//                                                                     checkedItem.TestCode === test.TestCode
//                                                             )}
//                                                             style={{ marginRight: "10px" }}
//                                                         />
//                                                         <label htmlFor={test.id} className="chi_acc_lab">
//                                                             {test.TestName}
//                                                         </label>
//                                                     </div>
//                                                 ))
//                                             ) : (
//                                                 <p>No test available for this radiology.</p> // Handle case where no tests are available
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Display selected individual tests */}
//                             {transformedFavouriteData1.length > 0 && (
//                                 <>
//                                     <div className="common_center_tag">
//                                         <span>Selected Test Name</span>
//                                     </div>

//                                     <div className="RegisFormcon_1 jjxjx_">
//                                         <ReactGrid columns={IndivitualColumns} RowData={transformedFavouriteData1} />
//                                     </div>
//                                 </>
//                             )}

//                             {/* Display selected subtests */}

//                             {/* Save Button */}
//                             <div className="Main_container_Btn">
//                                 <button onClick={handleSubmitRadiologyTest}>Save</button>
//                             </div>

//                             <div className="RegisFormcon_1 jjxjx_">
//                                 {no?.length > 0 && (
//                                     <>
//                                         <ReactGrid columns={noColumns} RowData={no} />
//                                     </>
//                                 )}
//                             </div>

//                             <div className="RegisFormcon_1 jjxjx_">
//                                 <h3>Already Taken Test</h3>
//                                 {Takentest?.length > 0 && (
//                                     <>
//                                         <ReactGrid columns={Takenradtest} RowData={Takentest} />
//                                     </>
//                                 )}
//                             </div>
//                         </>
//                     )}

//                     {type === "ViewTest" && (
//                         <>
//                             <div className="RegisFormcon_1 jjxjx_">
//                                 {completeArr?.length > 0 && (

//                                     <ReactGrid columns={RadiologyColumns} RowData={completeArr} />

//                                 )}
//                             </div>

//                             {completeArr.length === 0 && (
//                                 <div className="DivCenter_container">
//                                     No Test was complete during the previous visit.
//                                 </div>
//                             )}
//                             <br></br>
//                             <div className="RegisFormcon_1">
//                                 <div className="RegisForm_1">
//                                     <label htmlFor="ReportDate">
//                                         Report Date <span>:</span>
//                                     </label>
//                                     <input
//                                         type="date"
//                                         id="ReportDate"
//                                         name="ReportDate"
//                                         value={Radiology.ReportDate}
//                                         readOnly={IsViewMode}
//                                     />
//                                 </div>
//                                 <div className="RegisForm_1">
//                                     <label htmlFor="ReportTime">
//                                         Report Time <span>:</span>
//                                     </label>
//                                     <input
//                                         type="time"
//                                         id="ReportTime"
//                                         name="ReportTime"
//                                         value={Radiology.ReportTime}
//                                         readOnly={IsViewMode}
//                                     />
//                                 </div>
//                                 <div className="RegisForm_1">
//                                     <label htmlFor="ReceiptNo">
//                                         Radiologist Name <span>:</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="RadiologistName"
//                                         name="RadiologistName"
//                                         value={Radiology.RadiologistName}
//                                         readOnly={IsViewMode}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="RegisForm_1">
//                                     <label htmlFor="ReportTime">
//                                         Technician Name <span>:</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="TechnicianName"
//                                         name="TechnicianName"
//                                         value={Radiology.TechnicianName}
//                                         readOnly={IsViewMode}
//                                     />
//                                 </div>

//                             </div>
//                             <div className="RegisFormcon_1">
//                                 {Object.keys(ChooseFile).map((field, indx) => (
//                                     <div className="RegisForm_1" key={indx}>
//                                         <label htmlFor={`${field}_${indx}_${field}`}>
//                                             {" "}
//                                             {formatLabel(field)} <span>:</span>{" "}
//                                         </label>

//                                         <div
//                                             style={{
//                                                 width: "150px",
//                                                 display: "flex",
//                                                 justifyContent: "space-around",
//                                             }}
//                                         >
//                                             <button
//                                                 className="fileviewbtn"
//                                                 onClick={() => Selectedfileview(ChooseFile[field])}
//                                             >
//                                                 view
//                                             </button>
//                                         </div>

//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="RegisFormcon_1">
//                                 <div className="RegisForm_1">
//                                     <label htmlFor="ReportTime">
//                                         View All <span>:</span>
//                                     </label>
//                                     <button
//                                         className="fileviewbtn"
//                                         onClick={showAllFilesInModel}
//                                     >
//                                         ViewAll
//                                     </button>
//                                 </div>
//                             </div>
//                             <br></br>
//                             <div className="Otdoctor_intra_Con_2 with_increse_85">
//                                 <label htmlFor="Report">
//                                     Report <span>:</span>
//                                 </label>
//                                 <textarea
//                                     type="text"
//                                     id="Report"
//                                     name="Report"
//                                     value={Radiology.Report}
//                                     readOnly={IsViewMode}
//                                     required
//                                 />
//                             </div>

//                             {IsViewMode && (
//                                 <div className="Main_container_Btn">
//                                     <button onClick={handleClear}>Clear</button>
//                                 </div>
//                             )}
//                         </>
//                     )}

//                     <ToastAlert Message={toast.message} Type={toast.type} />
//                     <ModelContainer />
//                 </div>
//             </div>
//         </>
//     );
// };

// export default RadiologyTest;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { FaTrash } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import ForwardIcon from "@mui/icons-material/Forward";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";

const RadiologyTest = () => {
  const [TestNames, setTestNames] = useState([]);
  const [FilteredTestNames, setFilteredTestNames] = useState([]);
  const [searchQuery, setsearchQuery] = useState([]);

  const [completeArr, SetCompleteArr] = useState([]);

  const [Takentest, setTakentest] = useState([]);
  const navigate = useNavigate();

  const [summa, setSumma] = useState([]);
  const [searchQueryDispatch, setSearchQueryDispatch] = useState("");
  const [searchQueryDispatch1, setSearchQueryDispatch1] = useState("");
  const [searchQueryDispatch2, setSearchQueryDispatch2] = useState("");
  const [searchQueryDispatch3, setSearchQueryDispatch3] = useState("");

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );

  console.log(
    IP_DoctorWorkbenchNavigation,
    "IP_DoctorWorkbenchNavigationuytuyyyyyuyyyyyyyyyy"
  );

  const dispatchvalue = useDispatch();
  const [type, setType] = useState("AddTest");
  const handlePageChange = (event, newType) => {
    if (newType !== null && newType !== type) {
      setType(newType);
    }
  };

  useEffect(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;

    if (RegistrationId) {
      axios
        .get(
          `${UrlLink}Radiology/Get_Dispatch_By_Patient?RegistrationId=${RegistrationId}&Type=IP`
        )

        .then((res) => {
          setSumma(res.data);
        })
        .catch((err) => {
          console.error("Error fetching dispatch data for patient", err);
        });
    }
  }, [IP_DoctorWorkbenchNavigation?.RegistrationId, UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Radiology_details_link_view`)
      .then((res) => {
        const ress = res.data;
        setTestNames(ress);
        setFilteredTestNames(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    if (
      IP_DoctorWorkbenchNavigation &&
      IP_DoctorWorkbenchNavigation?.RegistrationId
    ) {
      axios
        .get(
          `${UrlLink}OP/get_radiology_test_name_for_patient?RegistrationId=${IP_DoctorWorkbenchNavigation.RegistrationId}`
        )
        .then((res) => {
          setTakentest(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [IP_DoctorWorkbenchNavigation?.RegistrationId]);

  const Takenradtest = [
    {
      key: "S_No",
      name: "S.No",
      frozen: true,
    },
    {
      key: "ServiceType",
      name: "Radiology Name",
    },
    {
      key: "TestName",
      name: "TestName",
    },
  ];

  const handleSetPrint = (row) => {
    dispatchvalue({ type: "Capturesample", value: row });
    setTimeout(() => {
      navigate("/Home/Retro");
    }, 1000);
  };

  const dynamicColumns = [
    // { key: "id", name: "S.NO", width: 30 },
    { key: "FirstName", name: "Name", width: 100 },
    { key: "Age", name: "Age", width: 100 },
    { key: "Phone", name: "PhoneNO", width: 100 },
    { key: "TestName", name: "Test", width: 100 },
    { key: "BillingStatus", name: "Billing Status", width: 100 },
    { key: "RegisterType", name: "RegisterType", width: 100 },
    { key: "DoctorName", name: "Doctor", width: 100 },
    {
      key: "actions",
      name: "Options",
      width: 100,
      renderCell: ({ row }) => (
        <Button className="cell_btn" onClick={() => handleSetPrint(row)}>
          <ForwardIcon />
        </Button>
      ),
    },
  ];

  const filteredSumma = summa.filter((item) => {
    const matchesName = searchQueryDispatch
      ? item.FirstName?.toLowerCase().includes(
          searchQueryDispatch.toLowerCase()
        )
      : true;
    const matchesPhone = searchQueryDispatch1
      ? item.Phone?.toLowerCase().includes(searchQueryDispatch1.toLowerCase())
      : true;
    const matchesBarcode = searchQueryDispatch2
      ? item.TestName?.toLowerCase().includes(
          searchQueryDispatch2.toLowerCase()
        )
      : true;
    const matchesInvoice = searchQueryDispatch3
      ? item.BillingStatus?.toLowerCase().includes(
          searchQueryDispatch3.toLowerCase()
        )
      : true;
    return matchesName && matchesPhone && matchesBarcode && matchesInvoice;
  });

  const [SubtestNo, setSubtestNo] = useState([]);

  const handleSearchTest = (e) => {
    const query = e.target.value.toLowerCase();
    setsearchQuery(query);

    if (!query) {
      setFilteredTestNames(TestNames); // reset to full data
      return;
    }

    const filteredlist = TestNames.map((dept) => {
      const filteredTests = dept.TestNames?.filter((test) =>
        test?.TestName?.toLowerCase().includes(query)
      );

      return {
        ...dept,
        TestNames: filteredTests,
      };
    }).filter((dept) => dept.TestNames.length > 0); // keep only those with matching tests

    console.log("Filtered result:", filteredlist);
    setFilteredTestNames(filteredlist);
  };

  const handleCheckboxSubtestNo = (
    Curr_Amount,
    testid,
    TestName,
    Radiologyid,
    RadiologyName,
    TestCode
  ) => {
    const isChecked = SubtestNo.some((item) => item.TestCode === TestCode);
    if (isChecked) {
      const newCheckedState = SubtestNo.filter(
        (item) => item.TestCode !== TestCode
      );
      setSubtestNo(newCheckedState);
    } else {
      const newCheckedState = [
        ...SubtestNo,
        {
          Radiologyid,
          RadiologyName,
          testid,
          TestName,
          Curr_Amount,
          TestCode,
        },
      ];
      setSubtestNo(newCheckedState);
    }
  };

  const handleRemoveTestName = (row) => {
    // Remove from SubtestNo (if applicable)
    const newSubtestNoState = SubtestNo.filter(
      (item) =>
        item.testid !== row.testid || item.Radiologyid !== row.Radiologyid
    );
    setSubtestNo(newSubtestNoState);
  };

  const IndivitualColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },
    {
      key: "TestCode",
      name: "Test Code",
    },
    {
      key: "RadiologyName",
      name: "Radiology Name",
    },

    {
      key: "TestName",
      name: "Test Name",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleRemoveTestName(params.row)}
        >
          <FaTrash className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const transformFavouriteData = (SubtestNo) => {
    return SubtestNo.map((sutestno, ind) => ({
      Radiologyid: sutestno.Radiologyid, // Correctly assign Radiologyid
      RadiologyName: sutestno.RadiologyName,
      TestCode: sutestno.TestCode,
      TestName: sutestno.TestName,
      testid: sutestno.testid, // Correctly assign testid
      id: ind + 1, // Ensure unique key for each row
    }));
  };

  const transformedFavouriteData1 = transformFavouriteData(SubtestNo);

  const [RadiologyTest, setRadiologyTest] = useState({
    RadiologyTestId: "",
    SubtestNoArr: "",
  });
  const [IsRadilogyGet, setIsRadilogyGet] = useState(false);
  const [no, setno] = useState([]);

  const handleSubmitRadiologyTest = () => {
    if (SubtestNo.length > 0) {
      const data = {
        RadiologyTestId: RadiologyTest.RadiologyTestId,
        SubtestNoArr: SubtestNo,
        created_by: userRecord?.username || "",
        Register_Id: IP_DoctorWorkbenchNavigation?.RegistrationId,
        RegisterType: "IP",
        DoctorId: IP_DoctorWorkbenchNavigation?.DoctorId,
      };
      console.log("data", data);
      axios
        .post(`${UrlLink}OP/Radiology_Request_Detailslink`, data)
        .then((res) => {
          const resData = res.data;
          const type = Object.keys(resData)[0];
          const message = Object.values(resData)[0];
          const tdata = {
            message: message,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setIsRadilogyGet((prev) => !prev);
          setRadiologyTest({
            RadiologyTestId: "",
            SubtestNoArr: [],
          });
          setSubtestNo([]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const tdata = {
        message: "Please Select TestNames .",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  useEffect(() => {
    const params = {
      Register_Id: IP_DoctorWorkbenchNavigation.RegistrationId,
      RegisterType: "OP",
    };
    axios
      .get(`${UrlLink}OP/Radiology_Request_Detailslink`, { params })
      .then((res) => {
        const ress = res.data;
        console.log("response117655", ress);
        setno(ress?.IsSubTestNo);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsRadilogyGet, UrlLink, IP_DoctorWorkbenchNavigation.RegistrationId]);

  const noColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },

    {
      key: "RadiologyName",
      name: "Radiology Name",
      width: 170,
    },

    {
      key: "TestName",
      name: "Test Name",
    },
  ];
  useEffect(() => {
    if (IP_DoctorWorkbenchNavigation?.RegistrationId) {
      // Ensure pk exists
      const params = {
        Register_Id: IP_DoctorWorkbenchNavigation?.RegistrationId,
        RegisterType: "OP",
      };

      axios
        .get(`${UrlLink}OP/Radiology_Complete_Details_Link`, { params })
        .then((res) => {
          const ress = res.data;
          console.log("Response Data:", ress);
          SetCompleteArr(ress); // Update state with the response
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [UrlLink, IP_DoctorWorkbenchNavigation?.RegistrationId]); // Add pk to the dependency array

  const RadiologyColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },

    {
      key: "RadiologistName",
      name: "Radiologist Name",
    },
    {
      key: "TechnicianName",
      name: "Technician Name",
    },
    {
      key: "RadiologyName",
      name: "Radiology Name",
    },
    {
      key: "TestName",
      name: "TestName",
    },

    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button
          key={params.row.id} // Assuming `id` is unique for each row
          className="cell_btn"
          onClick={() => handleViewComplete(params.row)}
        >
          <VisibilityIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const [Radiology, setRadiology] = useState({
    ReportDate: "",
    ReportTime: "",
    RadiologistName: "",
    TechnicianName: "",
    Report: "",
  });
  const [ChooseFile, setChooseFile] = useState({
    ChooseFileOne: null,
    ChooseFileTwo: null,
    ChooseFileThree: null,
  });
  const [IsViewMode, setIsViewMode] = useState(false);

  const handleClear = () => {
    setRadiology({
      ReportDate: "",
      ReportTime: "",
      RadiologistName: "",
      TechnicianName: "",
      Report: "",
    });

    setChooseFile({
      ChooseFileOne: null,
      ChooseFileTwo: null,
      ChooseFileThree: null,
    });
  };

  const handleViewComplete = (row) => {
    setIsViewMode(true);
    setRadiology({
      ...row,
      ReportDate: row.ReportDate || "",
      ReportTime: row.ReportTime || "",
      RadiologistName: row.RadiologistName || "",
      TechnicianName: row.TechnicianName || "",
      Report: row.Report || "",
    });
    setChooseFile({
      ChooseFileOne: row.Report_fileone,
      ChooseFileTwo: row.Report_filetwo,
      ChooseFileThree: row.Report_filethree,
    });
  };

  const showAllFilesInModel = () => {
    const fileValues = Object.values(ChooseFile).filter((file) => file); // Filter out null values

    if (fileValues.length > 0) {
      const tdata = {
        Isopen: true,
        content: fileValues, // Pass all files as an array
        type: "multiple", // Add a type to signify multiple files
      };
      dispatchvalue({ type: "modelcon", value: tdata }); // Dispatch to open modal
    } else {
      const tdata = {
        message: "There are no files to view.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  return (
    <>
      <br />

      <div className="for">
        <div className="RegisFormcon">
          <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={handlePageChange}
              aria-label="Platform"
            >
              <ToggleButton
                value="AddTest"
                style={{
                  height: "30px",
                  width: "180px",
                  backgroundColor:
                    type === "AddTest"
                      ? "var(--selectbackgroundcolor)"
                      : "inherit",
                }}
                className="togglebutton_container"
              >
                Add Test
              </ToggleButton>
              <ToggleButton
                value="ViewTest"
                style={{
                  backgroundColor:
                    type === "ViewTest"
                      ? "var(--selectbackgroundcolor)"
                      : "inherit",
                  width: "180px",
                  height: "30px",
                }}
                className="togglebutton_container"
              >
                View Test
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {type === "AddTest" && (
            <>
              <div
                style={{
                  marginTop: "10px",
                  marginLeft: "40%",
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "10px",
                }}
              >
                <label style={{ fontWeight: "bold" }}>Search Test :</label>
                <input
                  style={{
                    width: "150px",
                    height: "22px",
                    borderRadius: "5px",
                    border: "1px solid grey",
                  }}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchTest(e, "name")}
                />
              </div>
              <div style={{ width: "100%" }}>
                {FilteredTestNames.map((item) => (
                  <div key={item.id}>
                    {/* Display RadiologyName */}
                    <div style={{ margin: "10px" }}>
                      <label
                        htmlFor={item.id}
                        style={{ fontSize: "20px", fontWeight: "bold" }}
                        className="par_acc_lab"
                      >
                        {item.RadiologyName}
                      </label>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Check if TestNames is not empty */}
                      {item.TestNames.length > 0 ? (
                        item.TestNames.map((test) => (
                          <div
                            key={test.id}
                            style={{
                              width: "180px",
                              display: "flex",
                              marginLeft: "20px",
                              marginTop: "5px",
                              rowGap: "10px",
                              columnGap: "10px",
                            }}
                          >
                            {/* Checkbox for selecting test */}
                            <input
                              type="checkbox"
                              id={test.id}
                              onChange={() =>
                                handleCheckboxSubtestNo(
                                  test.Curr_Amount,
                                  test.id,
                                  test.TestName,
                                  item.id,
                                  item.RadiologyName,
                                  test.TestCode
                                )
                              }
                              checked={SubtestNo.some(
                                (checkedItem) =>
                                  checkedItem.TestCode === test.TestCode
                              )}
                              style={{ marginRight: "10px" }}
                            />
                            <label htmlFor={test.id} className="chi_acc_lab">
                              {test.TestName}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p>No test available for this radiology.</p> // Handle case where no tests are available
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Display selected individual tests */}
              {transformedFavouriteData1.length > 0 && (
                <>
                  <div className="common_center_tag">
                    <span>Selected Test Name</span>
                  </div>

                  <div className="RegisFormcon_1 jjxjx_">
                    <ReactGrid
                      columns={IndivitualColumns}
                      RowData={transformedFavouriteData1}
                    />
                  </div>
                </>
              )}

              {/* Display selected subtests */}

              {/* Save Button */}
              <div className="Main_container_Btn">
                <button onClick={handleSubmitRadiologyTest}>Save</button>
              </div>

              <div className="RegisFormcon_1 jjxjx_">
                {no?.length > 0 && (
                  <>
                    <ReactGrid columns={noColumns} RowData={no} />
                  </>
                )}
              </div>

              <div className="RegisFormcon_1 jjxjx_">
                <h3>Already Taken Test</h3>
                {Takentest?.length > 0 && (
                  <>
                    <ReactGrid columns={Takenradtest} RowData={Takentest} />
                  </>
                )}
              </div>
            </>
          )}

          {type === "ViewTest" && (
            <>
                 <ReactGrid columns={dynamicColumns} RowData={filteredSumma} />
           
            </>
          )}

          <ToastAlert Message={toast.message} Type={toast.type} />
          <ModelContainer />
        </div>
      </div>
    </>
  );
};

export default RadiologyTest;

