import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import ArrowDropUpOutlined from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlined from '@mui/icons-material/ArrowDropDownOutlined';
import { useNavigate } from "react-router-dom";
import Patienttestlist from './Patienttestlist';

function Samplecapture() {
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedGroupRows, setExpandedGroupRows] = useState({});
  const [expandedSubtestRows, setExpandedSubtestRows] = useState({});

  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();

  useEffect(() => {
    if (capturedatas && userRecord) {
      const departmentCodes = userRecord?.Lab_Department?.join(',');
      axios
        .get(
          `${urllink}Lab/getgroupcost?Billinginvoice=${capturedatas.Billing_Invoice}&gender=${capturedatas.Gender}&age=${capturedatas?.Age}&timeperiod=${capturedatas?.Time_Period}&Department=${departmentCodes}&Location=${userRecord?.location}`
        )
        .then((response) => {
          const updatedData = response.data?.map((detail) => {
            if (detail.PackageName) {
              return {
                ...detail,
                status: detail.status || "Received", // Package-level status
                Groups: detail.Groups.map((group) => ({
                  ...group,
                  status: group.status || "Received", // Group-level status
                  Tests: group.Tests.map((test) => ({
                    ...test,
                    status: test.status || "Received", // Test-level status
                    transferlocation: test.transferlocation || "",
                  })),
                })),
                Tests: detail.Tests.map((test) => ({
                  ...test,
                  status: test.status || "Received", // Test-level status
                  transferlocation: test.transferlocation || "",
                })),
              };
            } else if (detail.GroupName) {
              return {
                ...detail,
                status: detail.status || "Received", // Group-level status
                Tests: detail.Tests.map((test) => ({
                  ...test,
                  status: test.status || "Received", // Test-level status
                  transferlocation: test.transferlocation || "",
                })),
              };
            } else {
              return {
                ...detail,
                status: detail.status || "Received", // Test-level status
                transferlocation: detail.transferlocation || "",
                SubTests: detail.SubTests?.map((subTest) => ({
                  ...subTest,
                  status: subTest.status || "Received", // SubTest-level status
                })) || [],
              };
            }
          });
          console.log("Updated Data:", updatedData);
          setTestDetails(updatedData);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  }, [capturedatas, urllink, userRecord]);

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

  const handleStatusChange = (topIndex, groupIndex, testIndex, value, isPackageLevel = false, isGroupLevel = false) => {
    setTestDetails((prev) => {
      const newDetails = [...prev];
      const detail = newDetails[topIndex];

      if (isPackageLevel && detail.PackageName) {
        newDetails[topIndex].status = value;
        newDetails[topIndex].Tests = detail.Tests.map((test) => ({
          ...test,
          status: value,
        }));
        newDetails[topIndex].Groups = detail.Groups.map((group) => ({
          ...group,
          status: value,
          Tests: group.Tests.map((test) => ({
            ...test,
            status: value,
            SubTests: test.SubTests?.map((subTest) => ({
              ...subTest,
              status: value,
            })) || [],
          })),
        }));
      } else if (isGroupLevel && detail.PackageName && groupIndex !== undefined) {
        newDetails[topIndex].Groups[groupIndex].status = value;
        newDetails[topIndex].Groups[groupIndex].Tests = detail.Groups[groupIndex].Tests.map((test) => ({
          ...test,
          status: value,
          SubTests: test.SubTests?.map((subTest) => ({
            ...subTest,
            status: value,
          })) || [],
        }));
      } else if (detail.PackageName) {
        if (groupIndex === undefined) {
          newDetails[topIndex].Tests[testIndex].status = value;
        } else {
          newDetails[topIndex].Groups[groupIndex].Tests[testIndex].status = value;
        }
      } else if (detail.GroupName) {
        if (isGroupLevel) {
          newDetails[topIndex].status = value;
          newDetails[topIndex].Tests = detail.Tests.map((test) => ({
            ...test,
            status: value,
            SubTests: test.SubTests?.map((subTest) => ({
              ...subTest,
              status: value,
            })) || [],
          }));
        } else {
          newDetails[topIndex].Tests[testIndex].status = value;
        }
      } else {
        newDetails[topIndex].status = value;
        newDetails[topIndex].SubTests = detail.SubTests?.map((subTest) => ({
          ...subTest,
          status: value,
        })) || [];
      }
      return newDetails;
    });
  };

  const hasRecollect = testDetails.some((detail) => {
    if (detail.PackageName) {
      return (
        detail.status === "Recollect" ||
        detail.Tests.some((test) => test.status === "Recollect") ||
        detail.Groups.some((group) =>
          group.status === "Recollect" || group.Tests.some((test) => test.status === "Recollect")
        )
      );
    } else if (detail.GroupName) {
      return (
        detail.status === "Recollect" ||
        detail.Tests.some((test) => test.status === "Recollect")
      );
    }
    return detail.status === "Recollect";
  });

  const handleSubmitAnalyseReport = () => {
    const isValid = testDetails.every((detail) => {
      if (detail.PackageName) {
        const packageTestsValid = detail.Tests.every((test) => test.status);
        const groupTestsValid = detail.Groups.every((group) =>
          group.Tests.every((test) => test.status)
        );
        return detail.status && packageTestsValid && groupTestsValid;
      } else if (detail.GroupName) {
        return detail.status && detail.Tests.every((test) => test.status);
      }
      return detail.status;
    });

    if (!isValid) {
      alert("Please ensure all tests have a status.");
      return;
    }

    const postdata = {
      testDetails,
      Billing_Invoice: capturedatas.Billing_Invoice,
    };

    console.log("Post Data:", postdata);

    axios
      .post(`${urllink}Lab/updatereportsamplestatus`, postdata)
      .then((response) => {
        alert("Submitted Successfully");
        // dispatchvalue({ type: "Navigationlab", value: "Reportentry" });
                    dispatchvalue({ type: 'HrFolder', value: 'LabTechnician' });

      })
      .catch((error) => {
        console.error("Error submitting data: ", error);
      });
  };

  return (
    <div className="new-patient-registration-form">
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Capture/Unit</th>
              <th>Received Status</th>
            </tr>
          </thead>
          <tbody>

            {testDetails.map((detail, topIndex) => (
              <React.Fragment key={topIndex}>
                {detail.PackageName && (
                  <tr className="wertyyyy">
                    <td colSpan={2}>
                      {detail.PackageName}
                      {(detail.Groups?.length > 0 || detail.Tests?.length > 0) && (
                        <div
                          className="expandicon"
                          style={{ cursor: "pointer", marginLeft: "5px", display: "inline-flex" }}
                          onClick={() => toggleRow(topIndex)}
                        >
                          {expandedRows[topIndex] ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        name="package-status"
                        id={`package-status-${topIndex}`}
                        className="Capture_Status_select"
                        value={detail.status || "Received"}
                        onChange={(e) =>
                          handleStatusChange(topIndex, undefined, undefined, e.target.value, true)
                        }
                      >
                        <option value="Received">Received</option>
                        <option value="Recollect">Recollect</option>
                      </select>
                    </td>
                  </tr>
                )}
                {detail.PackageName && expandedRows[topIndex] && detail.Tests?.map((test, testIndex) => (
                  <tr key={`package-test-${testIndex}`}>
                    <td>{test.Test_Name}</td>
                    <td>{test.Captured_Unit || "-"} {test.UOM || ""}</td>
                    <td>
                      <select
                        name="status"
                        id={`status-${topIndex}-${testIndex}`}
                        className="Capture_Status_select"
                        value={test.status || "Received"}
                        onChange={(e) =>
                          handleStatusChange(topIndex, undefined, testIndex, e.target.value)
                        }
                      >
                        <option value="Received">Received</option>
                        <option value="Recollect">Recollect</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {detail.PackageName && expandedRows[topIndex] && detail.Groups?.map((group, groupIndex) => (
                  <React.Fragment key={`group-${groupIndex}`}>
                    <tr className="">
                      <td colSpan={2}>
                        {group.GroupName}
                        {group.Tests?.length > 0 && (
                          <div
                            className="expandicon"
                            style={{ cursor: "pointer", marginLeft: "5px", display: "inline-flex" }}
                            onClick={() => toggleGroupRow(topIndex, groupIndex)}
                          >
                            {expandedGroupRows[`${topIndex}-${groupIndex}`] ? (
                              <ArrowDropUpOutlined />
                            ) : (
                              <ArrowDropDownOutlined />
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <select
                          name="group-status"
                          id={`group-status-${topIndex}-${groupIndex}`}
                          className="Capture_Status_select"
                          value={group.status || "Received"}
                          onChange={(e) =>
                            handleStatusChange(topIndex, groupIndex, undefined, e.target.value, false, true)
                          }
                        >
                          <option value="Received">Received</option>
                          <option value="Recollect">Recollect</option>
                        </select>
                      </td>
                    </tr>
                    {expandedGroupRows[`${topIndex}-${groupIndex}`] && group.Tests.map((test, testIndex) => (
                      <React.Fragment key={`group-test-${testIndex}`}>
                        <tr>
                          <td>
                            {test.Test_Name}
                            {test.SubTests?.length > 0 && (
                              <div
                                className="expandicon"
                                style={{ cursor: "pointer", marginLeft: "5px", display: "inline-flex" }}
                                onClick={() => toggleSubtestRow(topIndex, groupIndex, testIndex)}
                              >
                                {expandedSubtestRows[`${topIndex}-${groupIndex}-${testIndex}`] ? (
                                  <ArrowDropUpOutlined />
                                ) : (
                                  <ArrowDropDownOutlined />
                                )}
                              </div>
                            )}
                          </td>
                          <td>{test.Captured_Unit || "-"} {test.UOM || ""}</td>
                          <td>
                            <select
                              name="status"
                              id={`status-${topIndex}-${groupIndex}-${testIndex}`}
                              className="Capture_Status_select"
                              value={test.status || "Received"}
                              onChange={(e) =>
                                handleStatusChange(topIndex, groupIndex, testIndex, e.target.value)
                              }
                            >
                              <option value="Received">Received</option>
                              <option value="Recollect">Recollect</option>
                            </select>
                          </td>
                        </tr>
                        {expandedSubtestRows[`${topIndex}-${groupIndex}-${testIndex}`] && test.SubTests?.map((subTest, subIndex) => (
                          <tr key={`subtest-${subIndex}`}>
                            <td style={{ paddingLeft: "20px" }}>{subTest.Test_Name}</td>
                            <td>{subTest.UOM || ""}</td>
                            <td>{subTest.status || "-"}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
                {detail.GroupName && !detail.PackageName && (
                  <React.Fragment>
                    <tr className="wertyyyy">
                      <td colSpan={2}>
                        {detail.GroupName}
                        {detail.Tests?.length > 0 && (
                          <div
                            className="expandicon"
                            style={{ cursor: "pointer", marginLeft: "5px", display: "inline-flex" }}
                            onClick={() => toggleRow(topIndex)}
                          >
                            {expandedRows[topIndex] ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}
                          </div>
                        )}
                      </td>
                      <td>
                        <select
                          name="group-status"
                          id={`group-status-${topIndex}`}
                          className="Capture_Status_select"
                          value={detail.status || "Received"}
                          onChange={(e) =>
                            handleStatusChange(topIndex, undefined, undefined, e.target.value, false, true)
                          }
                        >
                          <option value="Received">Received</option>
                          <option value="Recollect">Recollect</option>
                        </select>
                      </td>
                    </tr>
                    {expandedRows[topIndex] && detail.Tests?.map((test, testIndex) => (
                      <React.Fragment key={`group-test-${testIndex}`}>
                        <tr>
                          <td>
                            {test.Test_Name}
                            {test.SubTests?.length > 0 && (
                              <div
                                className="expandicon"
                                style={{ cursor: "pointer", marginLeft: "5px", display: "inline-flex" }}
                                onClick={() => toggleSubtestRow(topIndex, 0, testIndex)}
                              >
                                {expandedSubtestRows[`${topIndex}-0-${testIndex}`] ? (
                                  <ArrowDropUpOutlined />
                                ) : (
                                  <ArrowDropDownOutlined />
                                )}
                              </div>
                            )}
                          </td>
                          <td>{test.Captured_Unit || "-"} {test.UOM || ""}</td>
                          <td>
                            <select
                              name="status"
                              id={`status-${topIndex}-${testIndex}`}
                              className="Capture_Status_select"
                              value={test.status || "Received"}
                              onChange={(e) =>
                                handleStatusChange(topIndex, undefined, testIndex, e.target.value)
                              }
                            >
                              <option value="Received">Received</option>
                              <option value="Recollect">Recollect</option>
                            </select>
                          </td>
                        </tr>
                        {expandedSubtestRows[`${topIndex}-0-${testIndex}`] && test.SubTests?.map((subTest, subIndex) => (
                          <tr key={`subtest-${subIndex}`}>
                            <td style={{ paddingLeft: "20px" }}>{subTest.Test_Name}</td>
                            <td>{subTest.UOM || ""}</td>
                            <td>{subTest.status || "-"}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                )}
                {!detail.PackageName && !detail.GroupName && (
                  <React.Fragment>
                    <tr>
                      <td>
                        {detail.Test_Name}
                        {detail.SubTests?.length > 0 && (
                          <div
                            className="expandicon"
                            style={{ cursor: "pointer", marginLeft: "5px", display: "inline-flex" }}
                            onClick={() => toggleRow(topIndex)}
                          >
                            {expandedRows[topIndex] ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}
                          </div>
                        )}
                      </td>
                      <td>{detail.Captured_Unit || "-"} {detail.UOM || ""}</td>
                      <td>
                        <select
                          name="status"
                          id={`status-${topIndex}`}
                          className="Capture_Status_select"
                          value={detail.status || "Received"}
                          onChange={(e) =>
                            handleStatusChange(topIndex, undefined, undefined, e.target.value)
                          }
                        >
                          <option value="Received">Received</option>
                          <option value="Recollect">Recollect</option>
                        </select>
                      </td>
                    </tr>
                    {expandedRows[topIndex] && detail.SubTests?.map((subTest, subIndex) => (
                      <tr key={`subtest-${subIndex}`}>
                        <td style={{ paddingLeft: "20px" }}>{subTest.Test_Name}</td>
                        <td>{subTest.UOM || ""}</td>
                        <td>{subTest.status || "-"}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {testDetails.length === 0 ?
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <p style={{ color: "red" }}> This Test Not in Your Department</p>

            {/* <button
              className="RegisterForm_1_btns  Rhugt_report"
              onClick={() => {<Patienttestlist />}}
            >
              Back
            </button> */}
          </div>
        </> : (
          <div className="Register_btn_con">
            <button className="RegisterForm_1_btns" onClick={handleSubmitAnalyseReport}>
              Save
            </button>
          </div>
        )}


    </div>
  );
}

export default Samplecapture;