import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import { MdPhonelinkRing } from "react-icons/md";
import { TbDelta } from "react-icons/tb";
import { GiDrippingTube } from "react-icons/gi";
import "./CaptureGroup.css";
// import './Navigation.css';
import ArrowDropDownOutlined from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlined from "@mui/icons-material/ArrowDropUpOutlined";
import {
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  XAxis,
  Legend,
} from "recharts";
import bgImg2 from "../../Assets/bgImg2.jpg";

function Navigationple() {
  const [testDetails, setTestDetails] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedGroupRows, setExpandedGroupRows] = useState({});
  const [expandedSubtestRows, setExpandedSubtestRows] = useState({});
  const [dataline, setDataline] = useState([]);
  const [location, setLocation] = useState([]);
  const [openModel, setOpenModel] = useState(false);

  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("capturedatas", capturedatas);

  useEffect(() => {
    if (capturedatas?.Billing_Invoice) {
      const departmentCodes = userRecord?.Lab_Department?.join(','); // Convert array to comma-separated string
      axios
        .get(
          `${urllink}Lab/get_for_sample_test_data?Billinginvoice=${capturedatas.Billing_Invoice}&gender=${capturedatas.Gender}&age=${capturedatas.Age}&timeperiod=${capturedatas.Time_Period}&Department=${departmentCodes}`
        )
        .then((response) => {
          console.log("response===============", response.data);
          const updatedData = response.data.map((detail) => {
            // Handle different types of top-level items
            if (detail.PackageName) {
              return {
                ...detail,
                Groups: detail.Groups.map((group) => ({
                  ...group,
                  Tests: group.Tests.map((test) => ({
                    ...test,
                    status: test.status || "Collected",
                    technicalRemark: test.technicalRemark || "",
                    medicalRemark: test.medicalRemark || "",
                    transferlocation: test.transferlocation || "",
                  })),
                })),
                Tests: detail.Tests.map((test) => ({
                  ...test,
                  status: test.status || "Collected",
                  technicalRemark: test.technicalRemark || "",
                  medicalRemark: test.medicalRemark || "",
                  transferlocation: test.transferlocation || "",
                })),
              };
            } else if (detail.GroupName) {
              return {
                ...detail,
                Tests: detail.Tests.map((test) => ({
                  ...test,
                  status: test.status || "Collected",
                  technicalRemark: test.technicalRemark || "",
                  medicalRemark: test.medicalRemark || "",
                  transferlocation: test.transferlocation || "",
                })),
              };
            } else {
              return {
                ...detail,
                status: detail.status || "Collected",
                technicalRemark: detail.technicalRemark || "",
                medicalRemark: detail.medicalRemark || "",
                transferlocation: detail.transferlocation || "",
                SubTests: detail.SubTests || [],
              };
            }
          });
          setTestDetails(updatedData);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  }, [capturedatas, urllink]);

  useEffect(() => {
    axios
      .get(`${urllink}Lab/getlocation_for_sampletransfer`)
      .then((response) => {
        console.log(response);
        setLocation(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [urllink]);

  useEffect(() => {
    if (Object.keys(capturedatas).length === 0) {
      // navigate("/Home/CaptureSamplelist");
      dispatch({ type: "setActiveFolder", value: "Phelobotomist" });
    }
  }, [capturedatas, navigate]);

  const toggleRow = (index) =>
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  const toggleGroupRow = (offerIndex, groupIndex) =>
    setExpandedGroupRows((prev) => ({
      ...prev,
      [`${offerIndex}-${groupIndex}`]: !prev[`${offerIndex}-${groupIndex}`],
    }));
  const toggleSubtestRow = (offerIndex, groupIndex, testIndex) =>
    setExpandedSubtestRows((prev) => ({
      ...prev,
      [`${offerIndex}-${groupIndex}-${testIndex}`]:
        !prev[`${offerIndex}-${groupIndex}-${testIndex}`],
    }));

  const handleStatusChange = (topIndex, groupIndex, testIndex, value) => {
    setTestDetails((prev) => {
      const newDetails = [...prev];
      const detail = newDetails[topIndex];
      if (detail.PackageName) {
        if (groupIndex === undefined) {
          newDetails[topIndex].Tests[testIndex].status = value;
        } else {
          newDetails[topIndex].Groups[groupIndex].Tests[testIndex].status =
            value;
        }
      } else if (detail.GroupName) {
        newDetails[topIndex].Tests[testIndex].status = value;
      } else {
        newDetails[topIndex].status = value;
      }
      return newDetails;
    });
  };

  const handleRemarksChange = (
    topIndex,
    groupIndex,
    testIndex,
    value,
    type
  ) => {
    setTestDetails((prev) => {
      const newDetails = [...prev];
      const detail = newDetails[topIndex];
      const key = type === "technical" ? "technicalRemark" : "medicalRemark";
      if (detail.PackageName) {
        if (groupIndex === undefined) {
          newDetails[topIndex].Tests[testIndex][key] = value;
        } else {
          newDetails[topIndex].Groups[groupIndex].Tests[testIndex][key] = value;
        }
      } else if (detail.GroupName) {
        newDetails[topIndex].Tests[testIndex][key] = value;
      } else {
        newDetails[topIndex][key] = value;
      }
      return newDetails;
    });
  };

  const handlelocationChange = (topIndex, groupIndex, testIndex, value) => {
    setTestDetails((prev) => {
      const newDetails = [...prev];
      const detail = newDetails[topIndex];
      if (detail.PackageName) {
        if (groupIndex === undefined) {
          newDetails[topIndex].Tests[testIndex].transferlocation = value;
        } else {
          newDetails[topIndex].Groups[groupIndex].Tests[
            testIndex
          ].transferlocation = value;
        }
      } else if (detail.GroupName) {
        newDetails[topIndex].Tests[testIndex].transferlocation = value;
      } else {
        newDetails[topIndex].transferlocation = value;
      }
      return newDetails;
    });
  };

  const handlesamplesave = () => {
    // Flatten testDetails into a list of all tests (including subtests)
    const allTests = testDetails.flatMap((detail) => {
      if (detail.PackageName) {
        // Package: Include tests from Groups and standalone Tests, along with their SubTests
        const groupTests = detail.Groups.flatMap((group) =>
          group.Tests.flatMap((test) => [test, ...(test.SubTests || [])])
        );
        const standaloneTests = detail.Tests.flatMap((test) => [
          test,
          ...(test.SubTests || []),
        ]);
        return [...groupTests, ...standaloneTests];
      } else if (detail.GroupName) {
        // Group: Include all tests under the group, along with their SubTests
        return detail.Tests.flatMap((test) => [test, ...(test.SubTests || [])]);
      } else {
        // Individual Test: Include the test itself and its subtests
        return [detail, ...(detail.SubTests || [])];
      }
    });

    // Prepare postdata matching backend expectations
    const postdata = allTests.map((test) => ({
      patientid: capturedatas?.Patient_Id,
      patientname: capturedatas?.Patient_Name,
      testname: test.Test_Name,
      testcode: test.Test_Code,
      Captured_Unit: test.Captured_Unit || "",
      medicalRemark: test.medicalRemark || "",
      technicalRemark: test.technicalRemark || "",
      Billing_invoice: capturedatas?.Billing_Invoice,
      status: test.status,
      transferlocation: test.transferlocation || null,
      uom: test.UOM || "",
      location: userRecord?.location,
      createdby: userRecord?.username,
      visit_id: capturedatas?.Visit_Id,
      sampleid: capturedatas?.Barcode,
      Specimen_Name: test.Specimen_Name || "",
      Sub_Department: test.Sub_Department || "",
      Age: capturedatas?.Age,
      Gender: capturedatas?.Gender,
      dob: capturedatas?.dob || null,
    }));

    console.log("postdata:", postdata);

    axios
      .post(`${urllink}Lab/insersamplecapture`, postdata)
      .then((response) => {
        console.log(response.data);
      
        dispatch({ type: "setActiveFolder", value: "Phelobotomist" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handletrendview = (testcode) => {
    // Changed parameter to testcode
    axios
      .get(
        `${urllink}Lab/gettrendsfortest?patientname=${capturedatas.Patient_Name}&test=${testcode}`
      ) // Use testcode here
      .then((response) => {
        console.log(response.data);
        setDataline(response.data);
        setOpenModel(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlebarcodeprint = () => {
    dispatch({ type: "PrintBarcode", value: capturedatas });
    dispatch({ type: "setActiveFolder", value: "BarcodePrint" });
  };

  const hasTransfer = testDetails.some((detail) => {
    if (detail.PackageName) {
      // Package case: Check Tests and Groups
      return (
        detail.Tests?.some((test) => test.status === "Transfer") ||
        false ||
        detail.Groups?.some((group) =>
          group.Tests.some((test) => test.status === "Transfer")
        ) ||
        false
      );
    } else if (detail.GroupName) {
      // Group case: Check Tests only
      return detail.Tests?.some((test) => test.status === "Transfer") || false;
    } else {
      // Individual test case: Check status directly
      return detail.status === "Transfer";
    }
  });

  return (
    <>
      <div className="new-patient-registration-form">
        <div className="h_head">
          <h3>Sample Collection Form</h3>
          <button className="barcodeprintbtn" onClick={handlebarcodeprint}>
            Print Barcode
          </button>
        </div>

        {/* <div className="patientdetails_lab">
          <div className='patientdata'>
            <label className='phelobotomist_head'><span className='logo_profile'><CgProfile /></span>Patient Name<span>:</span></label>
            <span>{capturedatas?.Patient_Name}</span>
          </div>
          <div className='patientdata'>
            <label className='phelobotomist_head'><span className='logo_profile'><SlCalender /></span>Date<span>:</span></label>
            <span>{capturedatas?.UpdatedAt}</span>
          </div>
          <div className='patientdata'>
            <label className='phelobotomist_head'><span className='logo_profile'><MdPhonelinkRing /></span>Phone<span>:</span></label>
            <span>{capturedatas?.Phone}</span>
          </div>
          <div className='patientdata'>
            <img src={capturedatas?.Sample_Barcode_Image} alt='barcode'/>
          </div>

        </div> */}

       
               <div className="dctr_info_up_head">
                 <div className="RegisFormcon ">
                   <div className="dctr_info_up_head22">
                     <img src={bgImg2} alt="Default Patient Photo" />
       
                     <label>Profile</label>
                   </div>
                 </div>
       
                 <div className="RegisFormcon_1">
                   <div className="RegisFormcon_1">
                     <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                       <label htmlFor="PatientID">
                         Patient ID <span>:</span>
                       </label>
                       <span
                         className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                         htmlFor="PatientID"
                       >
                         {capturedatas?.Patient_Id}
                       </span>
                     </div>
                     <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                       <label htmlFor="PatientID">
                         Sample ID <span>:</span>
                       </label>
                       <span
                         className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                         htmlFor="PatientID"
                       >
                         {capturedatas?.Barcode}
                       </span>
                     </div>
       
                     <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                       <label htmlFor="PatientName">
                         Patient Name <span>:</span>{" "}
                       </label>
                       <span
                         className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                         htmlFor="PatientName"
                       >
                         {capturedatas?.Patient_Name}
                       </span>
                     </div>
                     <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                       <label htmlFor="AgeGender">
                         Age / Gender <span>:</span>{" "}
                       </label>
                       <span
                         className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                         htmlFor="Age"
                       >
                         {capturedatas?.Age} / {capturedatas?.Gender}
                       </span>
                     </div>
       
                     <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                       <label htmlFor="DoctorName">
                         Doctor Name <span>:</span>{" "}
                       </label>
                       <span
                         className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                         htmlFor="DoctorName"
                       >
                         {capturedatas?.Refering_Doctor}
                       </span>
                     </div>
       
                     <div className="RegisForm_1 dctr_wrbvh_pice666">
                       <label htmlFor="PatientCategory">
                         Patient Category <span>:</span>
                       </label>
                       <span
                         className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                         htmlFor="PatientCategory"
                       >
                         {capturedatas?.Patient_Group}
                       </span>
                     </div>
                   </div>
                 </div>
               </div>
       
      </div>

      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Test Code</th>
              <th>Test Method</th>
              <th>Containers</th>
              {!testDetails.some((detail) =>
                (detail.Tests || [])
                  .concat((detail.Groups || []).flatMap((g) => g.Tests || []))
                  .some((test) => test?.Sub_Department === "MICROBIOLOGY")
              ) && <th>Specimen</th>}
              <th>Capture / Unit</th>
              <th>Status</th>
              {/* <th>
                Remarks
                <table className="remarktable">
                  <tbody>
                    <tr>
                      <th>Technical</th>
                      <th>Medical</th>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th>Graph</th> */}
              {hasTransfer && <th>Location</th>}
            </tr>
          </thead>
          <tbody>
            {testDetails.map((detail, topIndex) => (
              <React.Fragment key={topIndex}>
                {/* Top-Level Row: Package, Group, or Individual Test */}
                <tr>
                  <td>
                    {detail.PackageName || detail.GroupName || detail.Test_Name}
                    {(detail.Groups?.length > 0 ||
                      detail.Tests?.length > 0 ||
                      detail.SubTests?.length > 0) && (
                      <div
                        className="expandicon"
                        style={{
                          cursor: "pointer",
                          marginLeft: "5px",
                          display: "inline-flex",
                        }}
                        onClick={() => toggleRow(topIndex)}
                      >
                        {expandedRows[topIndex] ? (
                          <ArrowDropUpOutlined />
                        ) : (
                          <ArrowDropDownOutlined />
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {detail.PackageCode ||
                      detail.GroupCode ||
                      detail.Test_Code ||
                      "None"}
                  </td>
                  <td>
                    {detail.PackageName
                      ? detail.Tests[0]?.Test_Method || "Package"
                      : detail.GroupName
                      ? detail.Tests[0]?.Test_Method || "Group"
                      : detail.Test_Method || "Individual"}
                  </td>
                  <td>
                    {detail.Tests?.[0]?.Container_Name ||
                      detail.Container_Name ||
                      "-"}
                    <span className="containernamesvg">
                      <GiDrippingTube />
                    </span>
                  </td>
                  {!testDetails.some((d) =>
                    (d.Tests || [])
                      .concat((d.Groups || []).flatMap((g) => g.Tests || []))
                      .some((t) => t?.Sub_Department === "MICROBIOLOGY")
                  ) && (
                    <td>
                      {detail.Tests?.[0]?.Specimen_Name ||
                        detail.Specimen_Name ||
                        "-"}
                    </td>
                  )}
                  <td>
                    {detail.Tests?.[0]?.Captured_Unit ||
                      detail.Captured_Unit ||
                      "-"}
                    {detail.Tests?.[0]?.UOM || detail.UOM || ""}
                  </td>
                  <td>
                    <select
                      name="status"
                      id="status"
                      className="Capture_Status_select"
                      value={
                        detail.Tests?.[0]?.status ||
                        detail.status ||
                        "Collected"
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          topIndex,
                          undefined,
                          0,
                          e.target.value
                        )
                      }
                    >
                      <option value="Completed">Collected</option>
                      <option value="Pending">Pending</option>
                      <option value="Transfer">Transfer</option>
                    </select>
                  </td>
                  {/* <td>
                    <table className="remarktable">
                      <tbody>
                        <tr>
                          <td>
                            <textarea
                              cols="20"
                              rows="1"
                              className="table_textarea"
                              value={
                                detail.Tests?.[0]?.technicalRemark ||
                                detail.technicalRemark ||
                                ""
                              }
                              onChange={(e) =>
                                handleRemarksChange(
                                  topIndex,
                                  undefined,
                                  0,
                                  e.target.value,
                                  "technical"
                                )
                              }
                            ></textarea>
                          </td>
                          <td>
                            <textarea
                              cols="20"
                              rows="1"
                              className="table_textarea"
                              value={
                                detail.Tests?.[0]?.medicalRemark ||
                                detail.medicalRemark ||
                                ""
                              }
                              onChange={(e) =>
                                handleRemarksChange(
                                  topIndex,
                                  undefined,
                                  0,
                                  e.target.value,
                                  "medical"
                                )
                              }
                            ></textarea>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td>
                    <span
                      className="trends"
                      onClick={() =>
                        handletrendview(
                          detail.Tests?.[0]?.Test_Code || detail.Test_Code
                        )
                      }
                    >
                      <TbDelta />
                    </span>
                  </td> */}
                  {hasTransfer &&
                    (detail.Tests?.[0]?.status || detail.status) ===
                      "Transfer" && (
                      <td>
                        <input
                          type="text"
                          list="organismlist"
                          value={
                            detail.Tests?.[0]?.transferlocation ||
                            detail.transferlocation ||
                            ""
                          }
                          className="Capture_Status_select1"
                          onChange={(e) =>
                            handlelocationChange(
                              topIndex,
                              undefined,
                              0,
                              e.target.value
                            )
                          }
                        />
                        <datalist id="organismlist">
                          {location
                            ?.filter(
                              (p) => p.location_name !== userRecord?.location
                            )
                            .map((p, i) => (
                              <option key={i} value={p.location_name}>
                                {p.location_name}
                              </option>
                            ))}
                        </datalist>
                      </td>
                    )}
                </tr>

                {/* Expandable Content */}
                {expandedRows[topIndex] && (
                  <>
                    {/* Groups under Package */}
                    {detail.PackageName &&
                      detail.Groups?.map((group, groupIndex) => (
                        <React.Fragment key={`${topIndex}-${groupIndex}`}>
                          <tr className="sub-row">
                            <td>
                              {group.GroupName}
                              {group.Tests.length > 0 && (
                                <div
                                  className="expandicon"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "5px",
                                    display: "inline-flex",
                                  }}
                                  onClick={() =>
                                    toggleGroupRow(topIndex, groupIndex)
                                  }
                                >
                                  {expandedGroupRows[
                                    `${topIndex}-${groupIndex}`
                                  ] ? (
                                    <ArrowDropUpOutlined />
                                  ) : (
                                    <ArrowDropDownOutlined />
                                  )}
                                </div>
                              )}
                            </td>
                            <td>{group.GroupCode}</td>
                            <td>{group.Tests[0]?.Test_Method || "Group"}</td>
                            <td>
                              {group.Tests[0]?.Container_Name || "-"}
                              <span className="containernamesvg">
                                <GiDrippingTube />
                              </span>
                            </td>
                            {!testDetails.some((d) =>
                              (d.Tests || [])
                                .concat(
                                  (d.Groups || []).flatMap((g) => g.Tests || [])
                                )
                                .some(
                                  (t) => t?.Sub_Department === "MICROBIOLOGY"
                                )
                            ) && (
                              <td>{group.Tests[0]?.Specimen_Name || "-"}</td>
                            )}
                            <td>
                              {group.Tests[0]?.Captured_Unit || "-"}
                              {group.Tests[0]?.UOM || ""}
                            </td>
                            <td>
                              <select
                                name="status"
                                id="status"
                                className="Capture_Status_select"
                                value={group.Tests[0]?.status || "Collected"}
                                onChange={(e) =>
                                  handleStatusChange(
                                    topIndex,
                                    groupIndex,
                                    0,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Completed">Collected</option>
                                <option value="Pending">Pending</option>
                                <option value="Transfer">Transfer</option>
                              </select>
                            </td>
                            {/* <td>
                              <table className="remarktable">
                                <tbody>
                                  <tr>
                                    <td>
                                      <textarea
                                        cols="20"
                                        rows="1"
                                        className="table_textarea"
                                        value={
                                          group.Tests[0]?.technicalRemark || ""
                                        }
                                        onChange={(e) =>
                                          handleRemarksChange(
                                            topIndex,
                                            groupIndex,
                                            0,
                                            e.target.value,
                                            "technical"
                                          )
                                        }
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        cols="20"
                                        rows="1"
                                        className="table_textarea"
                                        value={
                                          group.Tests[0]?.medicalRemark || ""
                                        }
                                        onChange={(e) =>
                                          handleRemarksChange(
                                            topIndex,
                                            groupIndex,
                                            0,
                                            e.target.value,
                                            "medical"
                                          )
                                        }
                                      ></textarea>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td> */}
                            <td>
                              <span
                                className="trends"
                                onClick={() =>
                                  handletrendview(group.Tests[0]?.Test_Code)
                                }
                              >
                                <TbDelta />
                              </span>
                            </td>
                            {hasTransfer &&
                              group.Tests[0]?.status === "Transfer" && (
                                <td>
                                  <input
                                    type="text"
                                    list="organismlist"
                                    value={
                                      group.Tests[0]?.transferlocation || ""
                                    }
                                    className="Capture_Status_select1"
                                    onChange={(e) =>
                                      handlelocationChange(
                                        topIndex,
                                        groupIndex,
                                        0,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <datalist id="organismlist">
                                    {location
                                      ?.filter(
                                        (p) =>
                                          p.location_name !==
                                          userRecord?.location
                                      )
                                      .map((p, i) => (
                                        <option key={i} value={p.location_name}>
                                          {p.location_name}
                                        </option>
                                      ))}
                                  </datalist>
                                </td>
                              )}
                          </tr>

                          {/* Tests under Group */}
                          {expandedGroupRows[`${topIndex}-${groupIndex}`] &&
                            group.Tests.map((test, testIndex) => (
                              <React.Fragment
                                key={`${topIndex}-${groupIndex}-${testIndex}`}
                              >
                                <tr className="sub-sub-row">
                                  <td>
                                    {test.Test_Name}
                                    {test.SubTests.length > 0 && (
                                      <div
                                        className="expandicon"
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: "5px",
                                          display: "inline-flex",
                                        }}
                                        onClick={() =>
                                          toggleSubtestRow(
                                            topIndex,
                                            groupIndex,
                                            testIndex
                                          )
                                        }
                                      >
                                        {expandedSubtestRows[
                                          `${topIndex}-${groupIndex}-${testIndex}`
                                        ] ? (
                                          <ArrowDropUpOutlined />
                                        ) : (
                                          <ArrowDropDownOutlined />
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td>{test.Test_Code}</td>
                                  <td>{test.Test_Method}</td>
                                  <td>
                                    {test.Container_Name || "-"}
                                    <span className="containernamesvg">
                                      <GiDrippingTube />
                                    </span>
                                  </td>
                                  {!testDetails.some((d) =>
                                    (d.Tests || [])
                                      .concat(
                                        (d.Groups || []).flatMap(
                                          (g) => g.Tests || []
                                        )
                                      )
                                      .some(
                                        (t) =>
                                          t?.Sub_Department === "MICROBIOLOGY"
                                      )
                                  ) && <td>{test.Specimen_Name || "-"}</td>}
                                  <td>
                                    {test.Captured_Unit || "-"}
                                    {test.UOM || ""}
                                  </td>
                                  <td>
                                    <select
                                      name="status"
                                      id="status"
                                      className="Capture_Status_select"
                                      value={test.status || "Collected"}
                                      onChange={(e) =>
                                        handleStatusChange(
                                          topIndex,
                                          groupIndex,
                                          testIndex,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="Completed">
                                        Collected
                                      </option>
                                      <option value="Pending">Pending</option>
                                      <option value="Transfer">Transfer</option>
                                    </select>
                                  </td>
                                  {/* <td>
                                    <table className="remarktable">
                                      <tbody>
                                        <tr>
                                          <td>
                                            <textarea
                                              cols="20"
                                              rows="1"
                                              className="table_textarea"
                                              value={test.technicalRemark || ""}
                                              onChange={(e) =>
                                                handleRemarksChange(
                                                  topIndex,
                                                  groupIndex,
                                                  testIndex,
                                                  e.target.value,
                                                  "technical"
                                                )
                                              }
                                            ></textarea>
                                          </td>
                                          <td>
                                            <textarea
                                              cols="20"
                                              rows="1"
                                              className="table_textarea"
                                              value={test.medicalRemark || ""}
                                              onChange={(e) =>
                                                handleRemarksChange(
                                                  topIndex,
                                                  groupIndex,
                                                  testIndex,
                                                  e.target.value,
                                                  "medical"
                                                )
                                              }
                                            ></textarea>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td> */}
                                  
                                  <td>
                                    <span
                                      className="trends"
                                      onClick={() =>
                                        handletrendview(test.Test_Code)
                                      }
                                    >
                                      <TbDelta />
                                    </span>
                                  </td>
                                  {hasTransfer &&
                                    test.status === "Transfer" && (
                                      <td>
                                        <input
                                          type="text"
                                          list="organismlist"
                                          value={test.transferlocation || ""}
                                          className="Capture_Status_select1"
                                          onChange={(e) =>
                                            handlelocationChange(
                                              topIndex,
                                              groupIndex,
                                              testIndex,
                                              e.target.value
                                            )
                                          }
                                        />
                                        <datalist id="organismlist">
                                          {location
                                            ?.filter(
                                              (p) =>
                                                p.location_name !==
                                                userRecord?.location
                                            )
                                            .map((p, i) => (
                                              <option
                                                key={i}
                                                value={p.location_name}
                                              >
                                                {p.location_name}
                                              </option>
                                            ))}
                                        </datalist>
                                      </td>
                                    )}
                                </tr>

                                {/* Subtests under Test */}
                                {expandedSubtestRows[
                                  `${topIndex}-${groupIndex}-${testIndex}`
                                ] &&
                                  test.SubTests.map((subtest, subtestIndex) => (
                                    <tr
                                      key={`${topIndex}-${groupIndex}-${testIndex}-${subtestIndex}`}
                                      className="sub-sub-sub-row"
                                    >
                                      <td>{subtest.Test_Name}</td>
                                      <td>{subtest.Test_Code}</td>
                                      <td>{test.Test_Method} (Subtest)</td>
                                      <td>
                                        {subtest.Container_Name || "-"}
                                        <span className="containernamesvg">
                                          <GiDrippingTube />
                                        </span>
                                      </td>
                                      {!testDetails.some((d) =>
                                        (d.Tests || [])
                                          .concat(
                                            (d.Groups || []).flatMap(
                                              (g) => g.Tests || []
                                            )
                                          )
                                          .some(
                                            (t) =>
                                              t?.Sub_Department ===
                                              "MICROBIOLOGY"
                                          )
                                      ) && (
                                        <td>{subtest.Specimen_Name || "-"}</td>
                                      )}
                                      <td>
                                        {subtest.Captured_Unit || "-"}
                                        {subtest.UOM || ""}
                                      </td>
                                      <td>
                                        <select
                                          name="status"
                                          id="status"
                                          className="Capture_Status_select"
                                          value={
                                            subtest.status ||
                                            test.status ||
                                            "Collected"
                                          }
                                          onChange={(e) =>
                                            handleStatusChange(
                                              topIndex,
                                              groupIndex,
                                              testIndex,
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="Completed">
                                            Collected
                                          </option>
                                          <option value="Pending">
                                            Pending
                                          </option>
                                          <option value="Transfer">
                                            Transfer
                                          </option>
                                        </select>
                                      </td>
                                      <td>
                                        <table className="remarktable">
                                          <tbody>
                                            <tr>
                                              <td>
                                                <textarea
                                                  cols="20"
                                                  rows="1"
                                                  className="table_textarea"
                                                  value={
                                                    subtest.technicalRemark ||
                                                    test.technicalRemark ||
                                                    ""
                                                  }
                                                  onChange={(e) =>
                                                    handleRemarksChange(
                                                      topIndex,
                                                      groupIndex,
                                                      testIndex,
                                                      e.target.value,
                                                      "technical"
                                                    )
                                                  }
                                                ></textarea>
                                              </td>
                                              <td>
                                                <textarea
                                                  cols="20"
                                                  rows="1"
                                                  className="table_textarea"
                                                  value={
                                                    subtest.medicalRemark ||
                                                    test.medicalRemark ||
                                                    ""
                                                  }
                                                  onChange={(e) =>
                                                    handleRemarksChange(
                                                      topIndex,
                                                      groupIndex,
                                                      testIndex,
                                                      e.target.value,
                                                      "medical"
                                                    )
                                                  }
                                                ></textarea>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td>
                                        <span
                                          className="trends"
                                          onClick={() =>
                                            handletrendview(subtest.Test_Code)
                                          }
                                        >
                                          <TbDelta />
                                        </span>
                                      </td>
                                      {hasTransfer &&
                                        (subtest.status || test.status) ===
                                          "Transfer" && (
                                          <td>
                                            <input
                                              type="text"
                                              list="organismlist"
                                              value={
                                                subtest.transferlocation ||
                                                test.transferlocation ||
                                                ""
                                              }
                                              className="Capture_Status_select1"
                                              onChange={(e) =>
                                                handlelocationChange(
                                                  topIndex,
                                                  groupIndex,
                                                  testIndex,
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <datalist id="organismlist">
                                              {location
                                                ?.filter(
                                                  (p) =>
                                                    p.location_name !==
                                                    userRecord?.location
                                                )
                                                .map((p, i) => (
                                                  <option
                                                    key={i}
                                                    value={p.location_name}
                                                  >
                                                    {p.location_name}
                                                  </option>
                                                ))}
                                            </datalist>
                                          </td>
                                        )}
                                    </tr>
                                  ))}
                              </React.Fragment>
                            ))}
                        </React.Fragment>
                      ))}

                    {/* Tests under Package or Group */}
                    {(detail.PackageName || detail.GroupName) &&
                      detail.Tests?.map((test, testIndex) => (
                        <React.Fragment key={`${topIndex}-${testIndex}`}>
                          <tr className="sub-row">
                            <td>
                              {test.Test_Name}
                              {test.SubTests.length > 0 && (
                                <div
                                  className="expandicon"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "5px",
                                    display: "inline-flex",
                                  }}
                                  onClick={() =>
                                    toggleSubtestRow(
                                      topIndex,
                                      undefined,
                                      testIndex
                                    )
                                  }
                                >
                                  {expandedSubtestRows[
                                    `${topIndex}-undefined-${testIndex}`
                                  ] ? (
                                    <ArrowDropUpOutlined />
                                  ) : (
                                    <ArrowDropDownOutlined />
                                  )}
                                </div>
                              )}
                            </td>
                            <td>{test.Test_Code}</td>
                            <td>{test.Test_Method}</td>
                            <td>
                              {test.Container_Name || "-"}
                              <span className="containernamesvg">
                                <GiDrippingTube />
                              </span>
                            </td>
                            {!testDetails.some((d) =>
                              (d.Tests || [])
                                .concat(
                                  (d.Groups || []).flatMap((g) => g.Tests || [])
                                )
                                .some(
                                  (t) => t?.Sub_Department === "MICROBIOLOGY"
                                )
                            ) && <td>{test.Specimen_Name || "-"}</td>}
                            <td>
                              {test.Captured_Unit || "-"}
                              {test.UOM || ""}
                            </td>
                            <td>
                              <select
                                name="status"
                                id="status"
                                className="Capture_Status_select"
                                value={test.status || "Collected"}
                                onChange={(e) =>
                                  handleStatusChange(
                                    topIndex,
                                    undefined,
                                    testIndex,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Completed">Collected</option>
                                <option value="Pending">Pending</option>
                                <option value="Transfer">Transfer</option>
                              </select>
                            </td>
                            <td>
                              <table className="remarktable">
                                <tbody>
                                  <tr>
                                    <td>
                                      <textarea
                                        cols="20"
                                        rows="1"
                                        className="table_textarea"
                                        value={test.technicalRemark || ""}
                                        onChange={(e) =>
                                          handleRemarksChange(
                                            topIndex,
                                            undefined,
                                            testIndex,
                                            e.target.value,
                                            "technical"
                                          )
                                        }
                                      ></textarea>
                                    </td>
                                    <td>
                                      <textarea
                                        cols="20"
                                        rows="1"
                                        className="table_textarea"
                                        value={test.medicalRemark || ""}
                                        onChange={(e) =>
                                          handleRemarksChange(
                                            topIndex,
                                            undefined,
                                            testIndex,
                                            e.target.value,
                                            "medical"
                                          )
                                        }
                                      ></textarea>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td>
                              <span
                                className="trends"
                                onClick={() => handletrendview(test.Test_Code)}
                              >
                                <TbDelta />
                              </span>
                            </td>
                            {hasTransfer && test.status === "Transfer" && (
                              <td>
                                <input
                                  type="text"
                                  list="organismlist"
                                  value={test.transferlocation || ""}
                                  className="Capture_Status_select1"
                                  onChange={(e) =>
                                    handlelocationChange(
                                      topIndex,
                                      undefined,
                                      testIndex,
                                      e.target.value
                                    )
                                  }
                                />
                                <datalist id="organismlist">
                                  {location
                                    ?.filter(
                                      (p) =>
                                        p.location_name !== userRecord?.location
                                    )
                                    .map((p, i) => (
                                      <option key={i} value={p.location_name}>
                                        {p.location_name}
                                      </option>
                                    ))}
                                </datalist>
                              </td>
                            )}
                          </tr>

                          {/* Subtests under Test */}
                          {expandedSubtestRows[
                            `${topIndex}-undefined-${testIndex}`
                          ] &&
                            test.SubTests.map((subtest, subtestIndex) => (
                              <tr
                                key={`${topIndex}-undefined-${testIndex}-${subtestIndex}`}
                                className="sub-sub-row"
                              >
                                <td>{subtest.Test_Name}</td>
                                <td>{subtest.Test_Code}</td>
                                <td>{test.Test_Method} (Subtest)</td>
                                <td>
                                  {subtest.Container_Name || "-"}
                                  <span className="containernamesvg">
                                    <GiDrippingTube />
                                  </span>
                                </td>
                                {!testDetails.some((d) =>
                                  (d.Tests || [])
                                    .concat(
                                      (d.Groups || []).flatMap(
                                        (g) => g.Tests || []
                                      )
                                    )
                                    .some(
                                      (t) =>
                                        t?.Sub_Department === "MICROBIOLOGY"
                                    )
                                ) && <td>{subtest.Specimen_Name || "-"}</td>}
                                <td>
                                  {subtest.Captured_Unit || "-"}
                                  {subtest.UOM || ""}
                                </td>
                                <td>
                                  <select
                                    name="status"
                                    id="status"
                                    className="Capture_Status_select"
                                    value={
                                      subtest.status ||
                                      test.status ||
                                      "Collected"
                                    }
                                    onChange={(e) =>
                                      handleStatusChange(
                                        topIndex,
                                        undefined,
                                        testIndex,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="Completed">Collected</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Transfer">Transfer</option>
                                  </select>
                                </td>
                                <td>
                                  <table className="remarktable">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <textarea
                                            cols="20"
                                            rows="1"
                                            className="table_textarea"
                                            value={
                                              subtest.technicalRemark ||
                                              test.technicalRemark ||
                                              ""
                                            }
                                            onChange={(e) =>
                                              handleRemarksChange(
                                                topIndex,
                                                undefined,
                                                testIndex,
                                                e.target.value,
                                                "technical"
                                              )
                                            }
                                          ></textarea>
                                        </td>
                                        <td>
                                          <textarea
                                            cols="20"
                                            rows="1"
                                            className="table_textarea"
                                            value={
                                              subtest.medicalRemark ||
                                              test.medicalRemark ||
                                              ""
                                            }
                                            onChange={(e) =>
                                              handleRemarksChange(
                                                topIndex,
                                                undefined,
                                                testIndex,
                                                e.target.value,
                                                "medical"
                                              )
                                            }
                                          ></textarea>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td>
                                  <span
                                    className="trends"
                                    onClick={() =>
                                      handletrendview(subtest.Test_Code)
                                    }
                                  >
                                    <TbDelta />
                                  </span>
                                </td>
                                {hasTransfer &&
                                  (subtest.status || test.status) ===
                                    "Transfer" && (
                                    <td>
                                      <input
                                        type="text"
                                        list="organismlist"
                                        value={
                                          subtest.transferlocation ||
                                          test.transferlocation ||
                                          ""
                                        }
                                        className="Capture_Status_select1"
                                        onChange={(e) =>
                                          handlelocationChange(
                                            topIndex,
                                            undefined,
                                            testIndex,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <datalist id="organismlist">
                                        {location
                                          ?.filter(
                                            (p) =>
                                              p.location_name !==
                                              userRecord?.location
                                          )
                                          .map((p, i) => (
                                            <option
                                              key={i}
                                              value={p.location_name}
                                            >
                                              {p.location_name}
                                            </option>
                                          ))}
                                      </datalist>
                                    </td>
                                  )}
                              </tr>
                            ))}
                        </React.Fragment>
                      ))}

                    {/* Subtests under Individual Test */}
                    {!(detail.PackageName || detail.GroupName) &&
                      detail.SubTests?.map((subtest, subtestIndex) => (
                        <tr
                          key={`${topIndex}-undefined-0-${subtestIndex}`}
                          className="sub-row"
                        >
                          <td>{subtest.Test_Name}</td>
                          <td>{subtest.Test_Code}</td>
                          <td>{detail.Test_Method} (Subtest)</td>
                          <td>
                            {subtest.Container_Name || "-"}
                            <span className="containernamesvg">
                              <GiDrippingTube />
                            </span>
                          </td>
                          {!testDetails.some((d) =>
                            (d.Tests || [])
                              .concat(
                                (d.Groups || []).flatMap((g) => g.Tests || [])
                              )
                              .some((t) => t?.Sub_Department === "MICROBIOLOGY")
                          ) && <td>{subtest.Specimen_Name || "-"}</td>}
                          <td>
                            {subtest.Captured_Unit || "-"}
                            {subtest.UOM || ""}
                          </td>
                          <td>
                            <select
                              name="status"
                              id="status"
                              className="Capture_Status_select"
                              value={
                                subtest.status || detail.status || "Collected"
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  topIndex,
                                  undefined,
                                  0,
                                  e.target.value
                                )
                              }
                            >
                              <option value="Completed">Collected</option>
                              <option value="Pending">Pending</option>
                              <option value="Transfer">Transfer</option>
                            </select>
                          </td>
                          <td>
                            <table className="remarktable">
                              <tbody>
                                <tr>
                                  <td>
                                    <textarea
                                      cols="20"
                                      rows="1"
                                      className="table_textarea"
                                      value={
                                        subtest.technicalRemark ||
                                        detail.technicalRemark ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleRemarksChange(
                                          topIndex,
                                          undefined,
                                          0,
                                          e.target.value,
                                          "technical"
                                        )
                                      }
                                    ></textarea>
                                  </td>
                                  <td>
                                    <textarea
                                      cols="20"
                                      rows="1"
                                      className="table_textarea"
                                      value={
                                        subtest.medicalRemark ||
                                        detail.medicalRemark ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleRemarksChange(
                                          topIndex,
                                          undefined,
                                          0,
                                          e.target.value,
                                          "medical"
                                        )
                                      }
                                    ></textarea>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td>
                            <span
                              className="trends"
                              onClick={() => handletrendview(subtest.Test_Code)}
                            >
                              <TbDelta />
                            </span>
                          </td>
                          {hasTransfer &&
                            (subtest.status || detail.status) ===
                              "Transfer" && (
                              <td>
                                <input
                                  type="text"
                                  list="organismlist"
                                  value={
                                    subtest.transferlocation ||
                                    detail.transferlocation ||
                                    ""
                                  }
                                  className="Capture_Status_select1"
                                  onChange={(e) =>
                                    handlelocationChange(
                                      topIndex,
                                      undefined,
                                      0,
                                      e.target.value
                                    )
                                  }
                                />
                                <datalist id="organismlist">
                                  {location
                                    ?.filter(
                                      (p) =>
                                        p.location_name !== userRecord?.location
                                    )
                                    .map((p, i) => (
                                      <option key={i} value={p.location_name}>
                                        {p.location_name}
                                      </option>
                                    ))}
                                </datalist>
                              </td>
                            )}
                        </tr>
                      ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlesamplesave}>
          Save
        </button>
      </div>

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
    </>
  );
}

export default Navigationple;
