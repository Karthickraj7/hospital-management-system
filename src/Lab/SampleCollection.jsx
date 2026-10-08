import React, { useState, useEffect } from "react";
// import Barcode from 'react-barcode';
import { useSelector } from "react-redux";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import { MdPhonelinkRing } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TbDelta } from "react-icons/tb";
import { GiDrippingTube } from "react-icons/gi";
// import "./CaptureGroup.css";
import {
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  XAxis,
  Legend,
} from "recharts";
import { useDispatch } from "react-redux";
import Select from "react-select";

function SampleCollection() {
  const [testDetails, setTestDetails] = useState([]);
  const capturedatas = useSelector(
    (state) => state.Frontoffice?.SampleCollectionqueueData
  );
  console.log(capturedatas);
  // const [visitid, setvisitid] = useState([])
  const [dataline, setdataline] = useState([]);
  const [location, setlocation] = useState([]);
  // const [transferlocation,settransferlocation] = useState('')
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [externallab, setexternallab] = useState([]);
  // const [value, setvalue] = useState([]);
  const [save, setsave] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const navigate = useNavigate();
  const dispatchvalue = useDispatch();
  console.log("capturedatas", capturedatas);

  const [LabRemarksdata, setLabRemarksdata] = useState([]);

  const remarksOptions =
    Array.isArray(LabRemarksdata) &&
    LabRemarksdata.map((remark) => ({
      value: remark.LabRemarks,
      label: remark.LabRemarks,
    }));

  const handleInputChangeRemarks = (detail, selectedOptions) => {
    // Find the test detail using the testcode
    const updatedTestDetails = testDetails.map((testDetail) => {
      if (testDetail.testcode === detail.testcode) {
        // If selectedOptions is not null, map through the selected remarks and join them with spaces
        const selectedRemarks = selectedOptions
          ? selectedOptions.map((option) => option.value).join(".")
          : "";

        // Update the Remarks field with the selected remarks

        return {
          ...testDetail,
          Remarks: selectedRemarks,
        };
      }
      return testDetail;
    });

    // Update the state or do further processing as needed
    setTestDetails(updatedTestDetails);
  };

  useEffect(() => {
    axios
      .get(`${urllink}usercontrol/getsetLabRemarksdata`)
      .then((response) => {
        const data = response.data;
        setLabRemarksdata(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]);

  useEffect(() => {
    axios
      .get(`${urllink}Phelobotomist/get_outsourced_lab_details`)
      .then((response) => {
        const data = response.data;
        setexternallab(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, []);

  //   useEffect(() => {
  //     axios
  //       .get(
  //         `${urllink}Billing/getcapturetestdata?Billinginvoice=${capturedatas?.Billing_Invoice}&gender=${capturedatas?.Gender}&age=${capturedatas?.Age}&timeperiod=${capturedatas?.Time_Period}`
  //       )
  //       .then((response) => {
  //         console.log("response===============", response);
  //         const data = response.data.map((item, index) => ({
  //           id: index + 1,
  //           testcode: item.Test_Code,
  //           testname: item.Test_Name,
  //           Captured_Unit: item.Captured_Unit,
  //           Container_Name: item.Container_Name,
  //           Specimen_Name: item.Specimen_Name,
  //           Test_Method: item.Test_Method,
  //           uom: item.UOM,
  //           department: item.Department,
  //           status: "Completed",
  //           medicalRemark: item.MedicalRemarks,
  //           technicalRemark: item.TechnicalRemarks,
  //           transferlocation: "",
  //           Remarks: "",
  //           Outsourcelab: "",
  //           sub_department_code: item.sub_department_code
  //         }));
  //         setTestDetails(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data: ", error);
  //       });
  //   }, [capturedatas, urllink]);

  useEffect(() => {
    if (capturedatas && Object.keys(capturedatas).length > 0) {
      setTestDetails(capturedatas?.TestDetails);
      //   setFilteredDepartments(ResultEntryNavigationdata?.filterdepartment)
    }
  }, [capturedatas]);

  const handleStatusChange = (index, newValue) => {
    console.log(index, newValue);
    const updatedTestDetails = [...testDetails];
    updatedTestDetails[index].Service_Status = newValue;
    setTestDetails(updatedTestDetails);
  };

  const handlelocationChange = (index, newValue) => {
    const updatedTestDetails = [...testDetails];
    updatedTestDetails[index].transferlocation = newValue;
    setTestDetails(updatedTestDetails);
  };

  const handlelabChange = (index, newValue) => {
    const updatedTestDetails = [...testDetails];
    updatedTestDetails[index].Outsourcelab = newValue;
    setTestDetails(updatedTestDetails);
  };

  // const handleRemarksChange = (index, newValue, type) => {
  //   const updatedTestDetails = [...testDetails];
  //   if (type === "technical") {
  //     updatedTestDetails[index].technicalRemark = newValue;
  //   } else if (type === "medical") {
  //     updatedTestDetails[index].medicalRemark = newValue;
  //   }
  //   setTestDetails(updatedTestDetails);
  // };

  const handleNewRemarkToggle = (index, isChecked, type) => {
    const updatedTestDetails = [...testDetails];
    if (type === "technical") {
      updatedTestDetails[index].isTechnicalNewRemark = isChecked;
      updatedTestDetails[index].newTechnicalRemark = "";
    } else {
      updatedTestDetails[index].isMedicalNewRemark = isChecked;
      updatedTestDetails[index].newMedicalRemark = "";
    }
    setTestDetails(updatedTestDetails);
  };

  const handleNewRemarkChange = (index, value, type) => {
    const updatedTestDetails = [...testDetails];
    if (type === "technical") {
      updatedTestDetails[index].newTechnicalRemark = value;
    } else {
      updatedTestDetails[index].newMedicalRemark = value;
    }
    setTestDetails(updatedTestDetails);
  };

  const handleSelectedRemarkChange = (index, value, type) => {
    const updatedTestDetails = [...testDetails];
    if (type === "technical") {
      updatedTestDetails[index].newTechnicalRemark = value;
    } else {
      updatedTestDetails[index].newMedicalRemark = value;
    }
    setTestDetails(updatedTestDetails);
  };
  console.log(testDetails);
  const handlesamplesave = () => {
    const isEveryTestValidated = testDetails.every(
      (detail) => detail.status !== ""
    );
    if (!isEveryTestValidated) {
      alert(
        "Please ensure every test has a status selected and required remarks filled."
      );
      return;
    }
    console.log(testDetails);
    const postdata = {
      ...capturedatas,
      SelectedTest: testDetails,
      user_id: userRecord?.user_id,
      PageType: "SampleCollection",
    };

    console.log(postdata);

    axios
      .post(`${urllink}OP/POST_Lab_Data`, postdata)
      .then((response) => {
        console.log(response.data);
        navigate("/Home/ResultEntryNavigation");
      })
      .catch((error) => {
        console.log(error);
      });

    // axios
    //   .post(`${urllink}Phelobotomist/updatesamplestatus`, {
    //     Billinginvoice: capturedatas.Billing_Invoice,
    //   })
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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

  console.log(testDetails);
  const hasTransfer = testDetails.some(
    (detail) => detail.status === "Transfer"
  );

  const hasoutsource = testDetails.some(
    (detail) => detail.status === "Outsource"
  );

  useEffect(() => {
    if (Object.keys(capturedatas).length === 0) {
      navigate("/Home/ResultEntryNavigation");
    }
  });

  const handlebarcodeprint = () => {
    dispatchvalue({ type: "PrintBarcode", value: capturedatas });
    setsave(!save);
    navigate("/Home/BarcodePrint");
  };

  useEffect(() => {
    axios
      .get(`${urllink}usercontrol/getLocation_for_sampletransfer`)
      .then((response) => {
        console.log(response);
        setlocation(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [urllink]);

  return (
    <>
      <div className="Main_container_app">
        <h4>
          Sample Collection Form
          <button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "transparent",
              border: "1px solid black",
              borderRadius: "10px",
              padding: "3px",
            }}
            onClick={handlebarcodeprint}
          >
            Print Barcode
          </button>
        </h4>

        <div className="patientdetails_lab">
          <div className="patientdata">
            <label className="phelobotomist_head">
              <span className="logo_profile">
                <CgProfile />
              </span>
              Patient Name<span>:</span>
            </label>
            <span>{capturedatas?.Patient_Name}</span>
          </div>

          <div className="patientdata">
            <label className="phelobotomist_head">
              <span className="logo_profile">
                <SlCalender />
              </span>
              Date <span>:</span>
            </label>
            <span>{capturedatas?.UpdatedAt}</span>
          </div>

          <div className="patientdata">
            <label className="phelobotomist_head">
              <span className="logo_profile">
                <MdPhonelinkRing />
              </span>
              Phone <span>:</span>
            </label>
            <span>{capturedatas?.Phone}</span>
          </div>

          <div className="patientdata">
            <img src={capturedatas?.Sample_Barcode_Image} alt="barcode" />
          </div>
        </div>

        <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Test Method</th>
                <th>Containers</th>
                <th>Specimens</th>
                <th>Capture / Unit</th>
                <th>Status</th>
                {/* <th>Remarks</th> */}
                <th>Graph</th>
                {console.log(hasTransfer)}
                {hasTransfer && <th>Location</th>}
                {hasoutsource && <th>Outsource Lab</th>}
              </tr>
            </thead>
            <tbody>
              {console.log(testDetails)}
              {Array.isArray(testDetails) && testDetails
                .sort((a, b) => a.Item_Id - b.Item_Id)
                .map((detail, index) => {
                  // const filteredRemarksOptions = LabRemarksdata && Array.isArray(LabRemarksdata) && LabRemarksdata.length > 0 && LabRemarksdata.filter(
                  //   (remark) =>
                  //     remark.DepartmentCode === detail.sub_department_code
                  // ).map((remark) => ({
                  //   value: remark.LabRemarks,
                  //   label: remark.LabRemarks,
                  // }));

                  return (
                    <tr key={index}>
                      <td>
                        {detail?.type === "group"
                          ? detail.SelectItemName
                          : detail?.Test_Name}
                      </td>
                      <td>{detail.Method_Name}</td>
                      <td>
                        {detail.Container_Name}
                        <span className="containernamesvg">
                          <GiDrippingTube />
                        </span>
                      </td>
                      <td>{detail.Specimen_Name}</td>
                      <td>
                        {detail.Captured_Unit}
                        {detail.Captured_Unit_UOM}
                      </td>
                      <td>
                        <select
                          name="status"
                          id="status"
                          className="Capture_Status_select"
                          value={detail.Service_Status}
                          onChange={(e) =>
                            handleStatusChange(index, e.target.value)
                          }
                        >
                          <option value="Completed">Collected</option>
                          <option value="Pending">Pending</option>
                          <option value="Outsource">Outsource</option>
                          <option value="Transfer">Transfer</option>
                        </select>
                      </td>
                      {/* <td>
                        <div style={{ width: "350px" }}>
                          <Select
                            id="Remarks"
                            name="Remarks"
                            style={{ width: "100px" }}
                            value={filteredRemarksOptions.filter((option) =>
                              detail.Remarks.includes(option.value)
                            )}
                            onChange={(selectedOptions) =>
                              handleInputChangeRemarks(detail, selectedOptions)
                            }
                            options={Array.from(
                              new Map(
                                filteredRemarksOptions.map((item) => [
                                  item.value,
                                  item,
                                ])
                              ).values()
                            )}
                            isMulti
                            classNamePrefix="react-select"
                            placeholder="Select Remarks"
                          />
                        </div>
                      </td> */}
                      <td>
                        <span
                          className="trends"
                          onClick={() => handletrendview(detail.testcode)}
                        >
                          <TbDelta />
                        </span>
                      </td>
                      {detail.Service_Status === "Transfer" && (
                        <td>
                          <input
                            type="type"
                            list="organismlist"
                            value={detail.transferlocation}
                            className="Capture_Status_select1"
                            onChange={(e) =>
                              handlelocationChange(index, e.target.value)
                            }
                          />
                          <datalist id="organismlist">
                            {Array.isArray(location) &&  location.length > 0 && location
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
                      {detail.Service_Status === "Outsource" && (
                        <td>
                          <input
                            type="type"
                            list="organismlist1"
                            value={detail.Outsourcelab}
                            className="Capture_Status_select1"
                            onChange={(e) =>
                              handlelabChange(index, e.target.value)
                            }
                          />
                          <datalist id="organismlist1">
                            {Array.isArray(externallab) && externallab.map((p, i) => (
                              <option key={i} value={p.Lab_Name}>
                                {p.Lab_Name}
                              </option>
                            ))}
                          </datalist>
                        </td>
                      )}
                    </tr>
                  );
                })}
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
              isSidebarOpen
                ? "sideopen_showcamera_profile"
                : "showcamera_profile"
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
      </div>
    </>
  );
}

export default SampleCollection;

