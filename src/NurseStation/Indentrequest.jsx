import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
// import './Patient.css';
import "../PatientManagement/Patient.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BedTransferRequest from "../IP_Workbench/Nurse/BedTransferRequest";
import BedtransferRecieve from "../IP_Workbench/Nurse/BedtransferRecieve";
import ServiceProcedureRequest from "../IP_Workbench/Nurse/ServiceProcedureRequest";
import IP_ReferAndInchargeDoctor from "../IP_Workbench/Nurse/ServiceRequest/IP_ReferAndInchargeDoctor";
import Consultation from "../IP_Workbench/Nurse/Consultation";
import LabTest from "../IP_Workbench/Nurse/Labtest";
import Ip_ot_request from "../OtManagement/Ip_ot_request";
import LeninRequest from "../IP_Workbench/Nurse/LeninRequest";
import IP_NurseDrugRequest from "../IP_Workbench/Nurse/IP_NurseDrugRequest";
import RadiologyTest from "../IP_Workbench/Nurse/RadiologyTest";

const TotalNursePatientList = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
  const navigate = useNavigate();
  const dispatchvalue = useDispatch();

  const [IpPatientCount, setIpPatientCount] = useState(0);
  const [OpPatientCount, setOpPatientCount] = useState(0);
  const [CasualityPatientCount, setCasualityPatientCount] = useState(0);
  const [WardPatientCount, setWardPatientCount] = useState(0);
  const [selectedValues, setSelectedValues] = useState({});
  const [openmodule, setopenmodule] = useState(false);
  const [selectedrow, setselectedrow] = useState({});

  const [Flag, setFlag] = useState(0);

  console.log(Flag, "Flaggggggg");

  // ------------OP-----------------------

  const UserData = useSelector((state) => state.userRecord?.UserData);

  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    status: "Registered",
  });
  const [searchDoctorParams, setsearchDoctorParams] = useState({
    Doctor: "",
    DoctorId: UserData?.Doctor,
  });
  console.log("searchOPParamsaaaaaaaaaaaaaa", searchOPParams);
  console.log("123", searchDoctorParams);
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [DoctorNames, setDoctorNames] = useState([]);

  const [isSelected, setIsSelected] = useState("IP");

  const [showTooltip, setShowTooltip] = useState(null);
  const [hoveredFlagIndex, setHoveredFlagIndex] = useState(null);

  const [dateOption, setDateOption] = useState("current");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ParticularDate, setParticularDate] = useState("");
  const [CurrentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (dateOption === "current") {
      setCurrentDate(new Date().toISOString().split("T")[0]); // Auto-set today
    }
  }, [dateOption]);

  // const [showTooltip, setShowTooltip] = useState(false);

  // const [isIPSelected, setIsIPSelected] = useState(false);

  // const handleOPClick = () => setIsOPSelected(1);
  // const handleIPClick = () => setIsIPSelected(true);

  // ------------IP-----------------------

  const [searchIPParams, setsearchIPParams] = useState({
    query: "",
    status: "Admitted",
    type: "IP",
    // SelectedWard : SelectedWard
  });

  console.log(searchIPParams, "searchIPParams");

  const [IpPatientRegisterData, setIpPatientRegisterData] = useState([]);
  const [WardGet, setWardGet] = useState([]);

  const [SelectedWard, setSelectedWard] = useState("");
  console.log(SelectedWard, "SelectedWard");

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_All_DoctorNames`)
      .then((res) => {
        const ress = res.data;
        console.log("DoctorsNames", ress);
        if (Array.isArray(ress)) {
          setDoctorNames(ress);
        } else {
          setDoctorNames([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const handleDepartmentOptionChange = (department) => {
    setIsSelected(department);
    setDateOption("current");
    setCurrentDate(new Date().toISOString().split("T")[0]);
    setFromDate("");
    setToDate("");
    setParticularDate("");
    setsearchDoctorParams({
      Doctor: "",
      DoctorId: UserData?.Doctor,
    });
  };

  const handleDateOptionChange = (e) => {
    setDateOption(e.target.value);

    // Reset date states when changing the selection
    if (e.target.value === "current") {
      setFromDate("");
      setToDate("");
      setParticularDate("");
      // setsearchDoctorParams('')

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");

      setsearchIPParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
    } else if (e.target.value === "custom") {
      setParticularDate("");
      setCurrentDate("");
      // setsearchDoctorParams('')

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");

      setsearchIPParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
    } else if (e.target.value === "particular") {
      setFromDate("");
      setToDate("");
      setCurrentDate("");
      // setsearchDoctorParams('')

      setsearchDoctorParams({
        Doctor: "",
        DoctorId: UserData?.Doctor,
      });

      setSelectedWard("");
      setsearchOPParams({
        query: "",
        status: "Registered",
        DoctorId: UserData?.Doctor || "",
      });
      setsearchIPParams({
        query: "",
        status: "Admitted",
        DoctorId: UserData?.Doctor || "",
      });
    }
  };

  const handleCurrentDateChange = (e) => {
    setCurrentDate(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleParticularDateChange = (e) => {
    setParticularDate(e.target.value);
  };

  const handleDropdownChange = (event, params) => {
    console.log(params);

    const selectedValue = event.target.value;
    if (selectedValue) {
      let name;
      if (selectedValue === "BTRequest") {
        name = "BTRequest";
      } else if (selectedValue === "BTRecieve") {
        name = "BTRecieve";
      } else if (selectedValue === "ServiceRequest") {
        name = "ServiceRequest";
      } else if (selectedValue === "ReferAndInchargeDoctor") {
        name = "ReferAndInchargeDoctor";
      } else if (selectedValue === "Consultation") {
        name = "Consultation";
      } else if (selectedValue === "Radiology") {
        name = "Radiology";
      } else if (selectedValue == "Lab") {
        name = "Lab";
      } else if (selectedValue == "OTRequest") {
        name = "OTRequest";
      } else if (selectedValue == "DrugRequest") {
        name = "DrugRequest";
      } else if (selectedValue == "LeninRequest") {
        name = "LeninRequest";
      }
      setSelectedValues((prev) => ({
        ...prev, // Preserve existing selections
        [params.row.RegistrationId]: selectedValue,
        labelname: name,
        key: selectedValue,
      }));

      setselectedrow(params.row);
      const RegistrationId = params.row.RegistrationId;
      axios
        .get(`${UrlLink}OP/get_workbenchquelist_doctor`, {
          params: { RegistrationId, Type: "IP" },
        })
        .then((res) => {
          console.log(res);
          dispatchvalue({
            type: "IP_DoctorWorkbenchNavigation",
            value: { ...res.data, ...params, RequestType: "IP" },
          });
        })
        .catch((err) => {
          console.log(err);
        });

      setTimeout(() => {
        setopenmodule(true);
      }, 500);
    } else {
      setSelectedValues({});
      setopenmodule(false);
      setselectedrow({});
    }
  };

  // ------------IP-----------------------

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Ward_Detials_link`)
      .then((res) => {
        const ress = res.data;
        console.log("Roommmmmmmmm", ress);
        if (Array.isArray(ress)) {
          setWardGet(ress);
        } else {
          setWardGet([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    const params = {};
    console.log(dateOption, "dateOption");

    if (searchIPParams.query.trim()) {
      params.query = searchIPParams.query;
    } else {
      params.limit = 10; // Default limit if no search query
    }

    console.log("uuuuuuuuuuuuu");

    if (searchIPParams.status) {
      params.status = searchIPParams.status;
    } else {
      setPatientRegisterData([]);
      return;
    }

    console.log("iiiiiiiiiii");

    // if (searchIPParams.type){
    //     params.type = searchIPParams.type
    // }  else {
    //     setPatientRegisterData([]);
    //     return;
    // }
    console.log("oooooooooo");

    if (dateOption === "custom") {
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      } else {
        setIpPatientRegisterData([]);
        return;
      }

      console.log("ssssssssssss");
    } else if (dateOption === "current") {
      if (CurrentDate) {
        params.CurrentDate = CurrentDate;
      } else {
        setIpPatientRegisterData([]);
        return;
      }

      console.log("rrrrrrrrrrr");
    } else if (dateOption === "particular") {
      if (ParticularDate) {
        params.ParticularDate = ParticularDate;
      } else {
        setIpPatientRegisterData([]); // Clear data if no particular date is selected
        return;
      }
    }
    console.log("wwwwwwwwwwwww");

    console.log(params, "params");

    axios
      .get(
        `${UrlLink}Frontoffice/get_ip_Patient_registration_details_for_workbench`,
        { params }
      )
      .then((res) => {
        const ress = res.data;
        console.log("IPpppppppppppppp", ress);
        if (Array.isArray(ress)) {
          setIpPatientRegisterData(ress);
        } else {
          setIpPatientRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    UrlLink,
    searchIPParams,
    dateOption,
    fromDate,
    toDate,
    ParticularDate,
    CurrentDate,
  ]);

  const handleeditIPPatientRegister = (params, type) => {
    console.log("params", params);
    const { RegistrationId } = params;

    const requestType = type || searchIPParams.type; // Use selected type or fallback to default

    axios
      .get(`${UrlLink}OP/get_workbenchquelist_doctor`, {
        params: { RegistrationId, Type: requestType },
      })
      .then((res) => {
        console.log(res);
        dispatchvalue({
          type: "IP_DoctorWorkbenchNavigation",
          value: { ...res.data, ...params, RequestType: requestType },
        });
        navigate("/Home/Nurse");
        dispatchvalue({
          type: "HrFolder",
          value: "IP_NurseWorkbenchNavigation",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleIPSearchChange = (e) => {
    const { name, value } = e.target;

    setsearchIPParams({ ...searchIPParams, [name]: value });
    if (name === "Ward") {
      setSelectedWard(value);
    }
  };

  const PatientIPRegisterColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "FlaggingColour",
      name: "Flagging Colour",
      frozen: true,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: params.row.FlaggingColour || "transparent",
            width: "20px",
            height: "20px",
            cursor: "pointer",
            position: "relative",
          }}
          onMouseEnter={() => setShowTooltip(params.row.id)} // Show tooltip for this row
          onMouseLeave={() => setShowTooltip(null)} // Hide tooltip
        >
          {/* <h4>{params.row.Flagging ? params.row.Flagging : "N/A"}</h4> */}

          {/* Conditional rendering of the tooltip */}
          {showTooltip === params.row.id && (
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#d2cdd4",
                color: "#000",
                padding: "5px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {params.row.Flagging ? params.row.Flagging : "N/A"}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "PatientId",
      name: "Patient Id",
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 200,
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: "Age",
      name: "Age",
    },
    {
      key: "Gender",
      name: "Gender",
    },

    // {
    //     key: "WardName",
    //     name: "WardName",
    //     width :200,
    // },

    {
      key: "PhoneNo",
      name: "PhoneNo",
    },

    {
      key: "Complaint",
      name: "Complaint",
    },
    // {
    //     key: "isMLC",
    //     name: "isMLC",

    // },
    // {
    //     key: "isRefferal",
    //     name: "isRefferal",
    // },
    // {
    //     key: "Status",
    //     name: "Status",
    // },
    // {
    //     key: "Specilization",
    //     name: "Specilization",
    // },
    // {
    //     key: "DoctorName",
    //     name: "Doctor Name",
    // },
    {
      key: "Action",
      name: "Action",
      // renderCell: (params) =>
      //   params.row.Status === "Admitted" || params.row.Status === "Pending" ? (
      //     <Button
      //       className="cell_btn"
      //       onClick={() =>
      //         handleeditIPPatientRegister(params.row, searchIPParams.type)
      //       } // Use selected type
      //     >
      //       <ArrowForwardIcon className="check_box_clrr_cancell" />
      //     </Button>
      //   ) : (
      //     "-"
      //   ),
      renderCell: (params) => (
        <div className="actionv" style={{ gap: "5px" }}>
          {console.log(params)}
          <select
            className="cell_dropdown"
            value={selectedValues[params.row.RegistrationId] || ""} // Select value based on row ID
            onChange={(e) => handleDropdownChange(e, params)}
          >
            <option value="">Select Action</option>
            <option value="BTRequest">BT Request</option>
            <option value="BTRecieve">BT Recieve / cancel</option>
            <option value="ServiceRequest">Service Request</option>
            <option value="ReferAndInchargeDoctor">
              ReferAndInchargeDoctor
            </option>
            <option value="Consultation">Consultation</option>
            <option value="Radiology">Radiology</option>
            <option value="Lab">Lab</option>
            <option value="OTRequest">OT Request</option>
            <option value="DrugRequest">Drug Request</option>
            <option value="LeninRequest">Lenin Request</option>
          </select>
        </div>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Flagg_color_Detials_link`)
      .then((res) => setFlag(res?.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  return (
    <>
      <div className="Main_container_app">
        <div className="DivCenter_container">Patients List </div>

        {/*------------- Patient Counts --------------------- */}

        {isSelected === "IP" ? (
          <>
            <div className="search_div_bar">
              <div className="search_div_bar_inp_1">
                <label>
                  {" "}
                  Date <span>:</span>{" "}
                </label>
                <select value={dateOption} onChange={handleDateOptionChange}>
                  <option value="current">Current Date</option>
                  <option value="custom">Custom Date</option>
                  <option value="particular">Particular Date</option>
                </select>
              </div>

              {dateOption === "current" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Current Date <span>:</span>{" "}
                  </label>

                  <input
                    type="date"
                    value={CurrentDate}
                    disabled
                    onChange={handleCurrentDateChange}
                  />
                </div>
              )}

              {dateOption === "custom" && (
                <>
                  {" "}
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      From <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="From Date"
                      value={fromDate}
                      onChange={handleFromDateChange}
                    />
                  </div>
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      To <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="To Date"
                      value={toDate}
                      onChange={handleToDateChange}
                    />
                  </div>
                </>
              )}

              {/* Particular Date Input */}
              {dateOption === "particular" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Select Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={ParticularDate}
                    onChange={handleParticularDateChange}
                  />
                </div>
              )}

              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Search by
                  <span>:</span>
                </label>
                <input
                  type="text"
                  name="query"
                  value={searchIPParams.query}
                  placeholder="Search here ... "
                  onChange={handleIPSearchChange}
                />
              </div>

              <div className="search_div_bar_inp_1">
                <label htmlFor="">
                  Status
                  <span>:</span>
                </label>
                <select
                  id=""
                  name="status"
                  value={searchIPParams.status}
                  onChange={handleIPSearchChange}
                >
                  {/* <option value=''>Select</option> */}
                  {/* <option value='Pending'>Pending</option> */}
                  <option value="Admitted">Admitted</option>
                  <option value="Cancelled">Cancelled</option>
                  {/* <option value='Pending'>Pending</option>
                            <option value='Completed'>Completed</option> */}
                </select>
              </div>

              <div className="search_div_bar_inp_1">
                <label>
                  {" "}
                  Ward Type <span>:</span>{" "}
                </label>
                <select
                  name="Ward"
                  required
                  value={SelectedWard}
                  onChange={handleIPSearchChange}
                >
                  <option value="">Select Ward</option>
                  {/* Exclude ICU and CCU wards */}
                  {WardGet.filter(
                    (ward) =>
                      ward.Status === "Active" &&
                      ward.WardName !== "ICU" &&
                      ward.WardName !== "CCU" &&
                      ward.WardName !== "CASUALITY"
                  ).map((ward, indx) => (
                    <option key={indx} value={ward.WardName}>
                      {ward.WardName}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div className="search_div_bar_inp_1">
                        <label>Type<span>:</span></label>
                        <select value={searchIPParams.type} onChange={handleIPTypeChange}>
                            <option value="IP">IP</option>
                            <option value="Casuality">Casuality</option>
                        </select>
                    </div> */}
            </div>

            {/* <ReactGrid columns={PatientIPRegisterColumns} RowData={IpPatientRegisterData} /> */}

            <ReactGrid
              columns={PatientIPRegisterColumns}
              RowData={IpPatientRegisterData.filter(
                (patient) =>
                  // Filter by SelectedWard and exclude ICU and CCU wards
                  (SelectedWard ? patient.WardName === SelectedWard : true) &&
                  patient.WardName !== "ICU" &&
                  patient.WardName !== "CCU"
              )}
            />
          </>
        ) : null}

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "70px",
              flexWrap: "wrap",
            }}
          >
            {Array.isArray(Flag) &&
              Flag?.map((flag, indx) => (
                <div
                  key={indx}
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: flag.FlaggColor,
                    border: "1px solid black",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredFlagIndex(indx)}
                  onMouseLeave={() => setHoveredFlagIndex(null)}
                >
                  {hoveredFlagIndex === indx && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-25px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#d2cdd4",
                        color: "#000",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {flag.FlaggName || "No flagging data"}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
        {openmodule && (
          <div
            className="overlay1"
            onClick={() => {
              setopenmodule(false);
              setSelectedValues({});
            }}
          >
            <div className="openModal1" onClick={(e) => e.stopPropagation()}>
              <div>
                {selectedValues.key === "BTRequest" && <BedTransferRequest />}
                {selectedValues.key === "BTRecieve" && <BedtransferRecieve />}
                {selectedValues.key === "ServiceRequest" && (
                  <ServiceProcedureRequest />
                )}
                {selectedValues.key === "ReferAndInchargeDoctor" && (
                  <IP_ReferAndInchargeDoctor />
                )}
                {selectedValues.key === "Consultation" && <Consultation />}
                {selectedValues.key === "Radiology" && <RadiologyTest />}
                {selectedValues.key === "Lab" && <LabTest />}
                {selectedValues.key === "OTRequest" && <Ip_ot_request />}
                {selectedValues.key === "DrugRequest" && (
                  <IP_NurseDrugRequest />
                )}
                {selectedValues.key === "LeninRequest" && <LeninRequest />}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TotalNursePatientList;
