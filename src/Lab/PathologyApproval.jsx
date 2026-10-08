import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbDelta } from "react-icons/tb";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";

function PathologyApproval() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const [department, setDepartment] = useState([]);
  const [testDetails, setTestDetails] = useState([]);

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
        ResultEntryNavigationdata?.Approve_FilteredTests || []
      ).map((item) => {
        return {
          ...item,
          Approve_Status: "Approved",
        };
      });

      setTestDetails(updatedTestDetails);
      setDepartment(ResultEntryNavigationdata?.filterdepartment);
    }
  }, [ResultEntryNavigationdata]);
console.log(testDetails)
  const handleChange = (Test_Code, value) => {
    let updatedDetail = [...testDetails];
    let testData = updatedDetail.find((p) => p.Test_Code === Test_Code);

    if (testData) {
      testData.Result_Value = value;
      setTestDetails(updatedDetail);
    }
  };

  const handleStatusChange = (testCode, newValue, depart) => {
    const updatedTestDetails = [...testDetails];

    const testDetailIndex = updatedTestDetails.findIndex(
      (test) =>
        test.Test_Code === testCode && test.SubDepartment_Code === depart
    );

    if (testDetailIndex !== -1) {
      updatedTestDetails[testDetailIndex].Approve_Status = newValue;
      setTestDetails(updatedTestDetails);
    }
  };

  const handletrendview = (testname) => {
    axios
      .get(
        `${urllink}Phelobotomist/gettrendsfortest?patientname=${ResultEntryNavigationdata.Patient_Name}&test=${testname}`
      )
      .then((response) => {
        console.log(response.data);
        let data = response.data;
        // setdataline(data);
        // setOpenModel(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const hanldeApproveData = () => {
    const postdata = {
      ...ResultEntryNavigationdata,
      SelectedTest: testDetails,
      user_id: userRecord?.user_id,
      PageType: "ReportApprove",
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

  return (
    <>
      {Array.isArray(department) &&
        department.map((dept, deptIndex) => (
          <div key={deptIndex}>
            <h3>{dept.value}</h3>
            <div className="samplecapture_component">
              <div className="Selected-table-container">
                {dept.value !== "HISTOPATHOLOGY" &&
                  testDetails.some(
                    (p) =>
                      p.SubDepartment_Code === dept.key &&
                      p.Culturetest === "No"
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
                          {/* <th>Status</th> */}
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
                                    {detail?.paniclow} - {detail?.panichigh}{" "}
                                    {detail?.UOM}
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
                                {/* <td>{detail.Service_Status}</td> */}
                                <td>
                                  <select
                                    name="Approve_Status"
                                    id="Approve_Status"
                                    className="Capture_Status_select"
                                    value={detail.Approve_Status}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        detail.Test_Code,
                                        e.target.value,
                                        dept.key
                                      )
                                    }
                                  >
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
              </div>
            </div>
            <div className="Register_btn_con">
              <button
                className="RegisterForm_1_btns"
                onClick={hanldeApproveData}
              >
                Save
              </button>
            </div>
          </div>
        ))}
    </>
  );
}

export default PathologyApproval;
