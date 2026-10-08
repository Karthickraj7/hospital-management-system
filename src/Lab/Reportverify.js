import React, { useState, useEffect } from "react";
// import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import axios from "axios";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch } from "react-redux";
import { TbDelta } from "react-icons/tb";
import {
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  XAxis,
  Legend,
} from "recharts";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

function Reportverify({ filteredTests }) {
  const [testDetails, setTestDetails] = useState([]);
  const [dataline, setdataline] = useState([]);
  const [showmodel, setshowmodel] = useState(false);
  const [page, setPage] = useState(0);
  const [content, setcontent] = useState("");
  const [openpreview, setopenpreview] = useState(false);
  const [openpreview1, setopenpreview1] = useState(false);
  const [culturevalue, setculturevalue] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: "",
    ClinicGST: "",
    ClinicAddress: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    ClinicLandLineNo: "",
    ClinicMailID: "",
    InvoiceNo: "",
  });
  const [report, setreport] = useState({
    Collected: "",
    Received: "",
    Reported: "",
    Head: "",
    Detail: "",
  });
  const [summa, setsumma] = useState([]);
  const [patinetbillingbarcode, setpatinetbillingbarcode] = useState("");
  const [department, setDepartment] = useState([]);
  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  console.log("capturedatas", capturedatas);
  const ResultEntryNavigationdata = useSelector(
    (state) => state.Frontoffice?.ResultEntryNavigationdata
  );
  console.log(ResultEntryNavigationdata);
  useEffect(() => {
    if (
      ResultEntryNavigationdata &&
      Object.keys(ResultEntryNavigationdata).length > 0
    ) {
      const updatedTestDetails = (
        ResultEntryNavigationdata?.Verify_FilteredTests || []
      ).map((item) => {
        return {
          ...item,
          Verify_Status: "Verified",
        };
      });

      setTestDetails(updatedTestDetails);
      setDepartment(ResultEntryNavigationdata?.filterdepartment || null);
    }
  }, [ResultEntryNavigationdata]);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const isedited = useSelector((state) => state.userRecord?.iseditedsenior);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const senioredit = useSelector((state) => state.userRecord?.senioreditdoc);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const pageSize = 10;
  const totalPages = Math.ceil(culturevalue.length / pageSize);
  const showdown = culturevalue.length;

  const dynamicColumns = [
    { field: "id", headerName: "S.No", width: 150 },

    { field: "antibiotic", headerName: "Antibiotic Name", width: 150 },
    { field: "Sensitivetype", headerName: "Sensitive Type", width: 150 },
    { field: "Oraganism", headerName: "Oraganism", width: 150 },
  ];

  useEffect(() => {
    axios
      .get(`${urllink}usercontrol/getClinic?location=ALL`)
      .then((response) => {
        // console.log(response.data)
        const data = response.data[0];
        console.log(data);
        if (data) {
          setClinicDetials((prev) => ({
            ...prev,
            ClinicAddress: data.door_no + "," + data.area + "," + data.street,
            ClinicGST: data.Gst_no,
            ClinicCity: data.city,
            ClinicState: data.state,
            ClinicCode: data.pincode,
            ClinicMobileNo: data.phone_no,
            ClinicLandLineNo: data.landline_no,
            ClinicMailID: data.email,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${urllink}usercontrol/getAccountsetting`)
      .then((response) => {
        // console.log(response.data.Data)
        const data = response.data;
        if (data) {
          setClinicDetials((prev) => ({
            ...prev,
            ClinicName: data.clinicName,
            ClinicLogo: `data:image/png;base64,${data.clinicLogo}`,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        `${urllink}Billing/get_billing_patient_barcode?Patientid=${capturedatas?.Patient_Id}&Patientname=${capturedatas?.Patient_Name}`
      )
      .then((response) => {
        console.log(response);
        setpatinetbillingbarcode(response.data.Patient_Barcode);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    urllink,
    capturedatas?.Barcode_id,
    capturedatas?.Patient_Id,
    capturedatas?.Patient_Name,
  ]);

  const handleStatusChange = (index, newValue, depart) => {
    const updatedTestDetails = [...testDetails];
    let updateddetail = updatedTestDetails.filter(
      (i) => i.SubDepartment_Code === depart
    );
    updateddetail[index].Verify_Status = newValue;
    setTestDetails(updatedTestDetails);
  };

  const handleverifydata = () => {
    const postdata = {
      ...ResultEntryNavigationdata,
      SelectedTest: testDetails,
      user_id: userRecord?.user_id,
      PageType: "ReportVerify",
    };

    console.log(postdata);
    axios
      .post(`${urllink}OP/POST_Lab_Data`, postdata)

      .then((response) => {
        console.log(response);
        dispatchvalue({ type: "Navigationlab", value: "" });
        navigate("/Home/ResultEntryNavigation");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handletrendview = (testname) => {
    axios
      .get(
        `${urllink}Phelobotomist/gettrendsfortest?patientname=${capturedatas.Patient_Name}&test=${testname}`
      )
      .then((response) => {
        console.log(response.data);
        let data = response.data;
        setdataline(data);
        setOpenModel(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const culturetests = testDetails.some((item) => item.Culturetest === 'Yes');
  const reportnogrowth = testDetails.some((p) => p.Report_Type === "NoGrowth");
  const reportot = testDetails.some((p) => p.Report_Type === "Ot");

  const handleshowculturetest = () => {
    axios
      .get(
        `${urllink}Phelobotomist/get_for_culture_report_completion?Billinginvoice=${capturedatas?.Billing_Invoice}&Visitid=${capturedatas?.Visit_Id}`
      )
      .then((response) => {
        console.log(response);
        const data = response.data.map((p, index) => ({
          id: index + 1,
          ...p,
        }));
        setculturevalue(data);
        setshowmodel(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("testDetails...................", testDetails);

  const handleChange = (Test_Code, value) => {
    // prompt("You are changing the Capture Value");

    let updatedDetail = [...testDetails];
    let testData = updatedDetail.find((p) => p.Test_Code === Test_Code);

    if (testData) {
      testData.Result_Value = value;
      setTestDetails(updatedDetail); // Assuming testDetails is your state variable
    }
  };

  // const ishistopathology = testDetails.some((item) => item.department === 'HISTOPATHOLOGY')

  const handlepdfpreview = () => {
    // Accumulate content data
    if (isedited === "Edited") {
      setcontent(senioredit);
      setopenpreview(!openpreview);
    } else {
      const accumulatedContent = testDetails
        .filter((item) => item.department === "HISTOPATHOLOGY")
        .map((item) => item.Content)
        .join("\n"); // Assuming item.Content contains strings

      // Update content state
      setcontent(accumulatedContent);

      // Toggle openpreview state
      setopenpreview(!openpreview);
    }
  };

  const handlepdfpreview1 = () => {
    // Accumulate content data
    if (isedited === "Edited") {
      setcontent(senioredit);
      setopenpreview1(!openpreview1);
    } else {
      const accumulatedContent = testDetails
        .filter((item) => item.department === "MICROBIOLOGY")
        .map((item) => item.Content)
        .join("\n"); // Assuming item.Content contains strings

      // Update content state
      setcontent(accumulatedContent);
      // Toggle openpreview state
      setopenpreview1(!openpreview1);
    }
  };

  // console.log(content);

  // useEffect(() => {
  //   let testname = testDetails[0]?.testname;
  //   axios
  //     .get(
  //       `${urllink}Phelobotomist/get_for_preview_examinations?Testname=${testname}&Visitid=${capturedatas?.Visit_Id}&patientid=1&Billinginvoice=${capturedatas?.Billing_Invoice}`
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       const groupsData = response.data;
  //       console.log("groupsData", groupsData);
  //       let latestCollectedDate = new Date(0);
  //       let latestReceivedDate = new Date(0);
  //       let latestReportedDate = new Date(0);

  //       groupsData.forEach((group) => {
  //         const analyseResultDate = new Date(
  //           group.Updated_At.Sample_Capture_in_Phelobotomist
  //         );
  //         const analyseSeniorDate = group.Updated_At.AnalyseInvestigationSenior;
  //         const approvePathologistDate = new Date(
  //           group.Updated_At.Approve_Test_Pathologist
  //         );

  //         if (analyseResultDate > latestCollectedDate) {
  //           latestCollectedDate = analyseResultDate;
  //         }

  //         if (analyseSeniorDate > latestReceivedDate) {
  //           latestReceivedDate = analyseSeniorDate;
  //         }

  //         if (approvePathologistDate > latestReportedDate) {
  //           latestReportedDate = approvePathologistDate;
  //         }
  //       });

  //       const formatDateAndTime = (date) => {
  //         let d = new Date(date),
  //           day = "" + d.getDate(),
  //           month = "" + (d.getMonth() + 1),
  //           year = d.getFullYear(),
  //           hours = "" + d.getHours(),
  //           minutes = "" + d.getMinutes();

  //         if (day.length < 2) day = "0" + day;
  //         if (month.length < 2) month = "0" + month;
  //         if (hours.length < 2) hours = "0" + hours;
  //         if (minutes.length < 2) minutes = "0" + minutes;

  //         return (
  //           [day, month, year].join("/") + " " + [hours, minutes].join(":")
  //         );
  //       };

  //       setreport((prev) => ({
  //         ...prev,
  //         Collected: formatDateAndTime(latestCollectedDate),
  //         Received: formatDateAndTime(latestReceivedDate),
  //         Reported: formatDateAndTime(latestReportedDate),
  //       }));

  //       const reportsData = groupsData.map((group) => {
  //         return {
  //           method: group.Method,
  //           Department: group.Department,
  //           groupName: group.Group_Name,
  //           Tests: group.Tests.map((test) => ({
  //             Test_Name: test.Test_Name || "",
  //             Method_Name: test.Method_Name || "",
  //             Department: test.Department || "",
  //             Sample: test.Specimen || "",
  //             Samplepicture: test.Samplepic
  //               ? `data:image/jpeg;base64,${test.Samplepic}`
  //               : null,
  //             Content: test.EditContent || "",
  //           })),
  //         };
  //       });

  //       setsumma(reportsData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, [
  //   testDetails,
  //   urllink,
  //   capturedatas?.Visit_Id,
  //   capturedatas?.Billing_Invoice,
  // ]);

  const handleeditdocs = () => {
    dispatchvalue({ type: "foreditcontent", value: content });
    navigate("/Home/SrLabreportpreview");
    // setisedited('Edited')
  };

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${urllink}Billing/get_for_pending_result_department?invoice=${capturedatas?.Billing_Invoice}`
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       setDepartment(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [capturedatas?.Billing_Invoice, urllink]);
  // console.log('summaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa,', testDetails);

  return (
    <>
      {console.log(department)}
      {Array.isArray(department) &&
        department.map((dept, deptIndex) => (
          <div key={deptIndex}>
            <h3>{dept.value}</h3>
            <div className="samplecapture_component">
              <div className="Selected-table-container">
                {testDetails.some(
                  (p) =>
                    p.SubDepartment_Code === dept.key && p.Culturetest === "Yes"
                ) && (
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th>Test Name</th>
                        <th>Specimen</th>
                        {!reportnogrowth && !reportot && <th>Colony Count</th>}
                        {!reportnogrowth && !reportot && (
                          <th>Capture Oraganism</th>
                        )}
                        {!reportnogrowth && !reportot && <th>Antibiotic</th>}
                        {reportot && <th>Preview</th>}
                        <th>Status</th>
                        <th>Verification</th>
                      </tr>
                    </thead>

                    <tbody>
                      {testDetails
                        .filter(
                          (p) =>
                            p.department === dept && p.Culturetest === "Yes"
                        )
                        .map((detail, index) => (
                          <tr key={index}>
                            <td>{detail.testname}</td>
                            <td>{detail.Sample_Specimen}</td>

                            {!reportnogrowth && !reportot && (
                              <>
                                <td>{detail.colony_count}</td>

                                <td>{detail.Capture_Oragnism}</td>
                              </>
                            )}

                            {!reportnogrowth && !reportot && (
                              <td>
                                <span onClick={handleshowculturetest}>
                                  <VisibilityIcon />
                                </span>
                              </td>
                            )}

                            {reportot && (
                              <td>
                                <span>
                                  <VisibilityIcon onClick={handlepdfpreview1} />
                                </span>
                              </td>
                            )}
                            <td>{detail.Status}</td>
                            <td>
                              <select
                                name="status"
                                id="status"
                                className="Capture_Status_select"
                                value={detail.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    index,
                                    e.target.value,
                                    dept
                                  )
                                }
                              >
                                <option value="Verified">Verified</option>
                                <option value="Approved">Approved</option>
                                <option value="Retest">Retest</option>
                                <option value="Recollect">Recollect</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                {dept.value !== "HISTOPATHOLOGY" &&
                  !testDetails.some(
                    (p) =>
                      p.SubDepartment_Code === dept.key &&
                      p.Culturetest === "Yes"
                  ) && (
                    <table className="selected-medicine-table2 xshxshshsx_j_table">
                      <thead>
                        <tr>
                          <th>Test Name</th>
                          <th>Specimen</th>

                          <th>Capture Value</th>
                          <th>Reference Range</th>
                          <th>Indicator</th>
                          <th>Remarks</th>
                          <th>Status</th>
                          <th>Verification</th>
                          <th>Trends</th>
                        </tr>
                      </thead>

                      <tbody>
                        {testDetails
                          .filter((p) => p.SubDepartment_Code === dept.key)
                          .map((detail, index) => {
                            return (
                              <tr key={index}>
                                <td>{detail.Test_Name}</td>
                                <td>{detail.Specimen_Name}</td>
                                <td>
                                  <input
                                    type="text"
                                    className="Capture_Status_select1"
                                    value={detail.Result_Value}
                                    style={{
                                      width: "180px",
                                      border: "1px solid var(--ProjectColor)",
                                      borderRadius: "5px",
                                      padding: "5px",
                                    }}
                                    onChange={(e) =>
                                      handleChange(
                                        detail.Test_Code,
                                        e.target.value,
                                        dept.key
                                      )
                                    }
                                  />
                                </td>
                                {detail.reference !== "Yes" ? (
                                  <td>
                                    {detail?.referencedata}
                                    {detail?.UOM}
                                  </td>
                                ) : (
                                  <td>
                                    {/* <div
                                    style={{
                                      width: "90px",
                                      textAlign: "start",
                                    }}
                                  > */}
                                    {detail?.paniclow} - {detail?.panichigh}{" "}
                                    {detail?.UOM}
                                    {/* </div> */}
                                  </td>
                                )}

                                <td>
                                  <span>
                                    {detail.Input_Pattern_Type === "Numeric" &&
                                      ((parseInt(detail.Result_Value) >=
                                        parseInt(detail.panichigh) && (
                                        <span
                                          className="indicator"
                                          style={{ color: "red" }}
                                        >
                                          <TiArrowUpThick />
                                        </span>
                                      )) ||
                                        (parseInt(detail.Result_Value) <=
                                          parseInt(detail.paniclow) && (
                                          <span
                                            className="indicatorlow"
                                            style={{ color: "blue" }}
                                          >
                                            <TiArrowDownThick />
                                          </span>
                                        )) || (
                                          <p
                                            style={{
                                              backgroundColor: "transparent",
                                              color: "green",
                                            }}
                                          >
                                            Normal
                                          </p>
                                        ))}
                                    {detail.Input_Pattern_Type === "" &&
                                      detail.Result_Value}
                                  </span>
                                </td>

                                <td>
                                  <div style={{ width: "100px" }}>
                                    {detail.Remarks}
                                  </div>
                                </td>
                                <td>{detail.Service_Status}</td>
                                <td>
                                  <select
                                    name="Verify_Status"
                                    id="Verify_Status"
                                    className="Capture_Status_select"
                                    value={detail.Verify_Status}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        index,
                                        e.target.value,
                                        dept.key
                                      )
                                    }
                                  >
                                    <option value="Verified">Verified</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Retest">Retest</option>
                                    <option value="Recollect">Recollect</option>
                                  </select>
                                </td>
                                <td>
                                  <span
                                    className="trends"
                                    onClick={() =>
                                      handletrendview(detail.Test_Code)
                                    }
                                  >
                                    <TbDelta />
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  )}
                {dept.value === "HISTOPATHOLOGY" && (
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th>Test Name</th>
                        <th>Specimen</th>

                        <th>Preview</th>
                        <th>Status</th>
                        <th>Verification</th>
                        {/* {
                       !hasRecollect?(
                       <th>Reflex</th>
                       ):null
                    }
                   */}
                        <th>Trends</th>
                      </tr>
                    </thead>

                    <tbody>
                      {testDetails
                        .filter((p) => p.Department_Code === dept.key)
                        .map((detail, index) => (
                          <tr key={index}>
                            <td>{detail.testname}</td>
                            <td>{detail.Sample_Specimen}</td>

                            <td>
                              <span>
                                <VisibilityIcon onClick={handlepdfpreview} />
                              </span>
                            </td>
                            <td>{detail.Status}</td>
                            <td>
                              {detail.Status === "Retest" ? (
                                "Retest"
                              ) : (
                                <select
                                  name="status"
                                  id="status"
                                  className="Capture_Status_select"
                                  value={detail.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      index,
                                      e.target.value,
                                      dept.key
                                    )
                                  }
                                >
                                  {/* <option value="">Select Status</option> */}
                                  <option value="Verified">Verified</option>
                                  <option value="Approved">Approved</option>

                                  <option value="Retest">Retest</option>
                                  <option value="Recollect">Recollect</option>
                                </select>
                              )}
                            </td>
                            <td>
                              <span
                                className="trends"
                                onClick={() =>
                                  handletrendview(detail.Test_Code)
                                }
                              >
                                <TbDelta />
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ))}

      {openModel && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModel(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="">
              <LineChart
                width={380}
                height={200}
                data={dataline}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                className="chart_linechart"
                style={{ width: "100%", height: "100%" }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="visit" />
                <YAxis className="yaxis_linechart" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="data"
                  name="Delta Values"
                  stroke="var(--ProjectColor)"
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </div>

            <div className="Register_btn_con regster_btn_contsai">
              <button
                className="RegisterForm_1_btns"
                onClick={() => setOpenModel(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showmodel && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setshowmodel(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid_1">
              <ThemeProvider theme={theme}>
                <DataGrid
                  rows={culturevalue.slice(
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
                {showdown > 0 && culturevalue.length > pageSize && (
                  <div className="grid_foot">
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
              <br />
              {
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h3 style={{ color: "red" }}>Notes</h3>:{" "}
                  <p>{testDetails[0].Notes}</p>
                </div>
              }
              {culturevalue.length === 0 && (
                <div className="IP_norecords">
                  <span>No Records Found</span>
                </div>
              )}
            </div>

            <div className="Register_btn_con regster_btn_contsai">
              <button
                className="RegisterForm_1_btns"
                onClick={() => setshowmodel(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {openpreview && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setopenpreview(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Report_master_preview" id={`reactprintcontent`}>
              <div className="Report_master report_preview">
                <div className="New_billlling_invoice_head new_report_con">
                  <div className="new_billing_logo_con">
                    <img src={ClinicDetials.ClinicLogo} alt="Medical logo" />
                  </div>
                  <div className="new_billing_address_1 ">
                    <span>{ClinicDetials.ClinicName}</span>
                    <div>
                      <span>{ClinicDetials.ClinicAddress},</span>
                      <span>
                        {ClinicDetials.ClinicCity +
                          "," +
                          ClinicDetials.ClinicState +
                          "," +
                          ClinicDetials.ClinicCode}
                      </span>
                    </div>
                    <div>
                      <span>{ClinicDetials.ClinicMobileNo + " , "}</span>
                      <span>{ClinicDetials.ClinicLandLineNo + " , "}</span>
                      <span>{ClinicDetials.ClinicMailID}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="Register_btn_con"
                  style={{ color: "var(--labelcolor)", fontWeight: 600 }}
                >
                  Test Report
                </div>
                <div className="new_billing_address new_report_address">
                  <div className="new_billing_address_2">
                    {
                      <div className="Register_btn_con_barcode">
                        <div id="get_imagecontent_1">
                          <Barcode
                            value={patinetbillingbarcode || ""}
                            lineColor="black"
                            height={40}
                            width={1.2}
                            displayValue={true}
                            fontSize={12}
                          />
                        </div>
                      </div>
                    }
                    <div className="new_billing_div">
                      <label>
                        Patient Name <span>:</span>
                      </label>
                      <span>{capturedatas.Patient_Name}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Visit ID <span>:</span>
                      </label>
                      <span>{capturedatas.Visit_Id}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Age/Gender <span>:</span>
                      </label>
                      <span>
                        {capturedatas.Age}/{capturedatas.Gender}
                      </span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Phone <span>:</span>
                      </label>
                      <span>{capturedatas.Phone}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Reference Doctor <span>:</span>
                      </label>
                      <span>{capturedatas.Refering_Doctor}</span>
                    </div>
                  </div>
                  <div className="new_billing_address_2">
                    {
                      <div className="Register_btn_con_barcode">
                        <div id="get_imagecontent_2">
                          <Barcode
                            value={capturedatas.Barcode || ""}
                            lineColor="black"
                            height={40}
                            width={1.2}
                            displayValue={true}
                            fontSize={12}
                          />
                        </div>
                      </div>
                    }
                    <div className="new_billing_div">
                      <label>
                        Invoice No <span>:</span>
                      </label>
                      <span>{capturedatas.Billing_Invoice}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Collected <span>:</span>
                      </label>
                      <span>{report.Collected}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Received <span>:</span>
                      </label>
                      <span>{report.Received}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Reported <span>:</span>
                      </label>
                      <span>{report.Reported}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        {" "}
                        Barcode<span>:</span>
                      </label>
                      <span>{capturedatas.Barcode}</span>
                    </div>
                  </div>
                </div>

                {summa
                  .filter((p) => p.Department === "HISTOPATHOLOGY")
                  .map((group, index) => (
                    <table className="report_table report_table_for_micro ">
                      <tbody className="print_body Selected-table-container">
                        <div key={index}>
                          {console.log(group)}
                          <h3>{group.groupName}</h3>

                          <div className="completed_report_1111">
                            <div className="completed_report gghbuy_o9">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  width: "100%",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: group.Tests[0]?.Content,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <br />
                      </tbody>

                      <div className="Add_items_Purchase_Master">
                        <span> - End of Report - </span>
                      </div>
                    </table>
                  ))}
              </div>

              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setopenpreview(false)}
                >
                  Close
                </button>
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => handleeditdocs()}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openpreview1 && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setopenpreview1(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Report_master_preview" id={`reactprintcontent`}>
              <div className="Report_master report_preview">
                <div className="New_billlling_invoice_head new_report_con">
                  <div className="new_billing_logo_con">
                    <img src={ClinicDetials.ClinicLogo} alt="Medical logo" />
                  </div>
                  <div className="new_billing_address_1 ">
                    <span>{ClinicDetials.ClinicName}</span>
                    <div>
                      <span>{ClinicDetials.ClinicAddress},</span>
                      <span>
                        {ClinicDetials.ClinicCity +
                          "," +
                          ClinicDetials.ClinicState +
                          "," +
                          ClinicDetials.ClinicCode}
                      </span>
                    </div>
                    <div>
                      <span>{ClinicDetials.ClinicMobileNo + " , "}</span>
                      <span>{ClinicDetials.ClinicLandLineNo + " , "}</span>
                      <span>{ClinicDetials.ClinicMailID}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="Register_btn_con"
                  style={{ color: "var(--labelcolor)", fontWeight: 600 }}
                >
                  Test Report
                </div>
                <div className="new_billing_address new_report_address">
                  <div className="new_billing_address_2">
                    {
                      <div className="Register_btn_con_barcode">
                        <div id="get_imagecontent_1">
                          <Barcode
                            value={patinetbillingbarcode || ""}
                            lineColor="black"
                            height={40}
                            width={1.2}
                            displayValue={true}
                            fontSize={12}
                          />
                        </div>
                      </div>
                    }
                    <div className="new_billing_div">
                      <label>
                        Patient Name <span>:</span>
                      </label>
                      <span>{capturedatas.Patient_Name}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Visit ID <span>:</span>
                      </label>
                      <span>{capturedatas.Visit_Id}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Age/Gender <span>:</span>
                      </label>
                      <span>
                        {capturedatas.Age}/{capturedatas.Gender}
                      </span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Phone <span>:</span>
                      </label>
                      <span>{capturedatas.Phone}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Reference Doctor <span>:</span>
                      </label>
                      <span>{capturedatas.Refering_Doctor}</span>
                    </div>
                  </div>
                  <div className="new_billing_address_2">
                    {
                      <div className="Register_btn_con_barcode">
                        <div id="get_imagecontent_2">
                          <Barcode
                            value={capturedatas.Barcode || ""}
                            lineColor="black"
                            height={40}
                            width={1.2}
                            displayValue={true}
                            fontSize={12}
                          />
                        </div>
                      </div>
                    }
                    <div className="new_billing_div">
                      <label>
                        Invoice No <span>:</span>
                      </label>
                      <span>{capturedatas.Billing_Invoice}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Collected <span>:</span>
                      </label>
                      <span>{report.Collected}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Received <span>:</span>
                      </label>
                      <span>{report.Received}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Reported <span>:</span>
                      </label>
                      <span>{report.Reported}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        {" "}
                        Barcode<span>:</span>
                      </label>
                      <span>{capturedatas.Barcode}</span>
                    </div>
                  </div>
                </div>

                {summa
                  .filter((p) => p.Department === "MICROBIOLOGY")
                  .map((group, index) => (
                    <table
                      className="report_table report_table_for_micro"
                      key={index}
                    >
                      <tbody className="print_body Selected-table-container">
                        <tr>
                          <td>
                            <h3>{group.groupName}</h3>

                            <div className="completed_report_1111">
                              <div className="completed_report completed_report04948 gghbuy_o9">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "100%",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: group.Tests[0]?.Content,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ))}
              </div>

              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setopenpreview1(false)}
                >
                  Close
                </button>
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => handleeditdocs()}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleverifydata}>
          Save
        </button>
      </div>
    </>
  );
}

export default Reportverify;
