import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientLab.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
const PatientLabProfile = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [patientDetails, setPatientDetails] = useState(null);
  const [familyMembersData, setFamilyMembersData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [CommonData, setCommonData] = useState([]);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [openRow, setOpenRow] = useState(null); // Store the currently open row

  const PatientLablistId = useSelector(
    (state) => state.Frontoffice?.PatientLablistId
  );

  const navigate = useNavigate();

  const EmployeeRegisterColumns = [
    {
      key: "Test_Code",
      name: "Test Code",
      filter: true,
      type: "input-text",
      frozen: true,
      // width:300
    },
    {
      key: "Service_Status",
      name: "Service Status",
      filter: true,
      frozen: true,
    },
    {
      key: "Analysis_Status",
      name: "Analysis Status",
      frozen: true,
    },
    {
      key: "Verify_Status",
      name: "Verify Status",
      frozen: true,
    },
    {
      key: "Approve_Status",
      name: "Approve Status",
      frozen: true,
    },
  ];

  // useEffect(() => {
  //   if (PatientLablistId?.PatientId && UrlLink) {
  //     axios
  //       .get(`${UrlLink}Masters/labreports`, {
  //         params: { PatientId: PatientLablistId.PatientId },
  //       })
  //       .then((res) => {
  //         setLabtestdata(res.data);
  //       })
  //       .catch((err) => console.error("Error fetching test reports:", err));
  //   }
  // }, [PatientLablistId, UrlLink]);

  // Menu handlers
  const handleHomeView = () => setSelectedMenu("home");

  const handleLAB = (e) => {
    console.log(e);
    axios
      .get(`${UrlLink}Masters/labreports`, {
        params: {
          PatientId: PatientLablistId.PatientId,
          selectedMenu: e,
        },
      })
      .then((res) => {
        console.log(res);
        setSelectedMenu(e);
        setCommonData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Redirect if no PatientLablistId
  useEffect(() => {
    if (!PatientLablistId || Object.keys(PatientLablistId).length === 0) {
      navigate("/Home/PatientLabProfile");
    }
  }, [PatientLablistId, navigate]);

  // Fetch patient data
  useEffect(() => {
    const PatientId = PatientLablistId?.PatientId;
    if (PatientId && UrlLink) {
      setLoading(true);
      axios
        .get(`${UrlLink}Frontoffice/Patient_Master_List`, {
          params: { PatientId },
        })
        .then((res) => {
          const data = res.data;
          if (data) {
            const updatedDetails = {
              PatientId: data.PatientId || "",
              PhoneNo: data.PhoneNo || "",
              FirstName: data.FirstName || "",
              Gender: data.Gender || "",
              DOB: data.DOB || "",
              Age: data.Age || "",
              Street: data.Street || "",
              City: data.City || "",
              State: data.State || "",
              Country: data.Country || "",
            };
            setPatientDetails(updatedDetails);
            setProfilePhoto(data.Photo || null);
            fetchFamilyMembers(PatientId);
          }
        })
        .catch((err) => {
          console.error("Error fetching patient data:", err);
          setError("Failed to fetch patient details");
        })
        .finally(() => setLoading(false));
    }
  }, [PatientLablistId, UrlLink]);

  // Fetch family members
  const fetchFamilyMembers = async (primaryPatientId) => {
    if (!primaryPatientId) return;
    try {
      const response = await axios.get(
        `${UrlLink}Frontoffice/get_family_members/${primaryPatientId}/`
      );
      setFamilyMembersData(response.data);
    } catch (err) {
      console.error("Error fetching family members:", err);
    }
  };

  const handleViewProfile = () => setShowDetails(!showDetails);

  const toggleRow = (subDepartmentId) => {
    // Toggle only one row at a time
    setOpenRow((prevOpenRow) =>
      prevOpenRow === subDepartmentId ? null : subDepartmentId
    );
  };

  const HomeView = () => (
    <div className="patient-profile-wrapper">
      {/* Patient Profile Card */}
      <div className="patient-profile-container">
        <div className="mugesh_profile_pationts">
          <div className="mugesh_profile_pationts_con">
            <div className="mugesh_profile_photo">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Patient Profile"
                  className="profile-photo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/path/to/default/image.png";
                  }}
                />
              ) : (
                <div className="no-photo">No Photo Available</div>
              )}
            </div>
            <div className="patient-details">
              <p>
                <span className="label">Name:</span>{" "}
                <strong>
                  {patientDetails?.FirstName || "No Name Available"}
                </strong>
              </p>
              <p>
                <span className="label">Phone:</span>{" "}
                <strong>{patientDetails?.PhoneNo || "No Phone"}</strong>
              </p>
            </div>
            <button
              className="patient-details_button"
              onClick={handleViewProfile}
            >
              {showDetails ? "Hide Profile" : "View Profile"}
              <ArrowForwardIosIcon
                style={{
                  fontSize: "16px",
                  transform: showDetails ? "rotate(180deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Detailed Patient Info and Family Members - Shown only when showDetails is true */}
        {showDetails && patientDetails && (
          <>
            <div className="detailed-card">
              <div className="detailed-content">
                <div className="patient-details-boxes">
                  <div className="detail-box">
                    <span className="label">Patient ID</span>
                    <strong>{patientDetails.PatientId || "N/A"}</strong>
                  </div>
                  <div className="detail-box">
                    <span className="label">Name</span>
                    <strong>{patientDetails.FirstName || "N/A"}</strong>
                  </div>
                  <div className="detail-box">
                    <span className="label">Phone</span>
                    <strong>{patientDetails.PhoneNo || "N/A"}</strong>
                  </div>
                  <div className="detail-box">
                    <span className="label">Gender</span>
                    <strong>{patientDetails.Gender || "N/A"}</strong>
                  </div>
                  <div className="detail-box">
                    <span className="label">DOB</span>
                    <strong>{patientDetails.DOB || "N/A"}</strong>
                  </div>
                  <div className="detail-box">
                    <span className="label">Age</span>
                    <strong>{patientDetails.Age || "N/A"}</strong>
                  </div>
                  <div className="detail-box address-box">
                    <span className="label">Address</span>
                    <strong>
                      {patientDetails.Street ||
                      patientDetails.City ||
                      patientDetails.State ||
                      patientDetails.Country
                        ? `${patientDetails.Street || ""}, ${
                            patientDetails.City || ""
                          }, ${patientDetails.State || ""}, ${
                            patientDetails.Country || ""
                          }`
                        : "N/A"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Members Card */}
            <div className="family-members-container">
              <h3 className="family-members-title">Family Members</h3>
              {familyMembersData.length > 0 ? (
                <div className="family-members-list">
                  {familyMembersData.map((member) => (
                    <div key={member.id} className="family-member-card">
                      <div className="family-member-details">
                        <p>
                          <span className="label">Name:</span>{" "}
                          <strong>{member.name || "N/A"}</strong>
                        </p>
                        <p>
                          <span className="label">Mobile:</span>{" "}
                          <strong>{member.mobileNumber || "N/A"}</strong>
                        </p>
                        <p>
                          <span className="label">Status:</span>{" "}
                          <strong>{member.status || "N/A"}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-family-members">No family members found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleEdit = (row) => {
    setSelectedReport(row);
    console.log("Editing Report:", row);
  };

  const handleView = (row) => {
    console.log(row);

    setSelectedReport(row.Report);
    console.log("Viewing Report:", row);
  };

  // lab
  const TestReport = () => (
    <>
      <div className="lab-test-reports">
        {/* <h2>Lab Test Report</h2> */}
        <div className="NewTest_Master_grid_M_head_M">
          <TableContainer className="NewTest_Master_grid_M">
            <Table className="dehduwhd_o8i">
              <TableHead>
                <TableRow>
                  <TableCell width={50}>S.No</TableCell>
                  <TableCell width={400}>Billing_Invoice_No</TableCell>
                  <TableCell width={100}>RegisterType</TableCell>

                  <TableCell width={100}>Report</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(CommonData) &&
                  CommonData.map((row, index) => (
                    <React.Fragment key={index}>
                      <TableRow
                        style={{
                          backgroundColor:
                            index % 2 === 1
                              ? "var(--selectbackgroundcolor)"
                              : "white",
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.Billing_Invoice_No}</TableCell>

                        <TableCell>{row.RegisterType}</TableCell>

                        <TableCell>
                          {row?.Status === "Completed" ? (
                            <Button onClick={() => handleView(row)}>
                              <VisibilityIcon />
                            </Button>
                          ) : (
                            <span>Not Ready</span>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      {selectedReport && (
        <div
          className="overlay1"
          onClick={() => {
            setSelectedReport(false);
          }}
        >
          <div className="openModal1" onClick={(e) => e.stopPropagation()}>
            <div
              className="Main_container_Btn button"
              style={{
                justifyContent: "right",
              }}
            >
              <button onClick={() => setSelectedReport(null)}>Close</button>
            </div>
            <iframe
              src={selectedReport}
              style={{
                width: "100%",
                height: "500px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>
      )}
    </>
  );

  const TestRequest = () => (
    <div className="lab-container">
      <h2>TestRequest</h2>
      <div className="NewTest_Master_grid_M_head_M">
        <TableContainer className="NewTest_Master_grid_M">
          <Table className="dehduwhd_o8i">
            <TableHead>
              <TableRow>
                <TableCell width={50}>S.No</TableCell>
                <TableCell width={400}>Billing_Invoice_No</TableCell>
                <TableCell width={100}>RegisterType</TableCell>

                <TableCell width={100}>Items</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(CommonData) &&
                CommonData.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      style={{
                        backgroundColor:
                          index % 2 === 1
                            ? "var(--selectbackgroundcolor)"
                            : "white",
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.Billing_Invoice_No}</TableCell>

                      <TableCell>{row.RegisterType}</TableCell>
                      <TableCell>
                        <span
                          aria-label="expand row"
                          // size="small"
                          className="newmasterbseiuhfuisehbutton"
                          onClick={() => toggleRow(row.Request_Id)}
                        >
                          {openRow === row.Request_Id ? (
                            <ArrowForwardIosIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )}
                        </span>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openRow === row.Request_Id} // Only expand the row that matches the openRow
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <div className="Main_container_app">
                              <ReactGrid
                                columns={EmployeeRegisterColumns}
                                RowData={row?.ItemDetails}
                              />
                            </div>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );

  const BillingHistory = () => (
    <>
      <div
        className="lab-container"
        style={{
          maxHeight: "100%",
          height: "80%",
          overflow: "auto",
        }}
      >
        <div className="LabProfile-billing-container">
          {Array.isArray(CommonData) && CommonData.length > 0 ? (
            Array.isArray(CommonData) &&
            CommonData.map((billing, index) => (
              <>
                <div key={index} className="LabProfile-billing-card">
                  <div className="LabProfile-billing-card-header">
                    <div>
                      <div className="LabProfile-invoice-number">
                        Invoice: {billing.Billing_Invoice_No}
                      </div>
                      <div className="LabProfile-billing-date">
                        Date: {formatDate(billing.Billing_Date)}
                      </div>
                    </div>
                    <div className="LabProfile-billing-status">
                      {billing.Bill_Status}
                    </div>
                  </div>

                  <div className="LabProfile-billing-grid">
                    <div className="LabProfile-billing-section">
                      <h3 className="LabProfile-section-title">
                        Patient Information
                      </h3>
                      <div className="LabProfile-detail-row">
                        <span className="LabProfile-detail-label">
                          Patient ID:
                        </span>
                        <span className="LabProfile-detail-value">
                          {billing.Patient_Id}
                        </span>
                      </div>
                      <div className="LabProfile-detail-row">
                        <span className="LabProfile-detail-label">
                          Doctor ID:
                        </span>
                        <span className="LabProfile-detail-value">
                          {billing.Doctor_Id}
                        </span>
                      </div>
                      <div className="LabProfile-detail-row">
                        <span className="LabProfile-detail-label">
                          Visit ID:
                        </span>
                        <span className="LabProfile-detail-value">
                          {billing.Visit_Id}
                        </span>
                      </div>
                    </div>

                    <div className="LabProfile-billing-section">
                      <h3 className="LabProfile-section-title">
                        Order Details
                      </h3>
                      <div className="LabProfile-detail-row">
                        <span className="LabProfile-detail-label">
                          Total Items:
                        </span>
                        <span className="LabProfile-detail-value">
                          {billing.Total_Items}
                        </span>
                      </div>
                      <div className="LabProfile-detail-row">
                        <span className="LabProfile-detail-label">
                          Total Qty:
                        </span>
                        <span className="LabProfile-detail-value">
                          {billing.Total_Qty}
                        </span>
                      </div>
                      <div className="LabProfile-detail-row">
                        <span className="LabProfile-detail-label">
                          Created by:
                        </span>
                        <span className="LabProfile-detail-value">
                          {billing.created_by}
                        </span>
                      </div>
                      <div className="LabProfile-detail-row">
                        <span className="LabProfile-detail-label">
                          Created at:
                        </span>
                        <span className="LabProfile-detail-value">
                          {new Date(billing.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="LabProfile-billing-totals">
                    <div className="LabProfile-detail-row">
                      <span className="LabProfile-detail-label">
                        Net Amount:
                      </span>
                      <span className="total-amount">
                        ₹{parseFloat(billing.Net_Amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="LabProfile-detail-row">
                      <span className="LabProfile-detail-label">
                        Paid Amount:
                      </span>
                      <span className="paid-amount">
                        ₹{parseFloat(billing.Paid_Amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="LabProfile-detail-row">
                      <span className="LabProfile-detail-label">Balance:</span>
                      <span
                        className={
                          billing.Balance_Amount === "0.00"
                            ? "balance-zero"
                            : "balance-due"
                        }
                      >
                        ₹{parseFloat(billing.Balance_Amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ))
          ) : (
            <div className="LabProfile-no-data">
              No billing history available.
            </div>
          )}
        </div>
      </div>
    </>
  );

  // ------------------------------------------------------------------------------------------------
  const renderContent = () => {
    switch (selectedMenu) {
      case "home":
        return <HomeView />;
      case "TestReport":
        return <TestReport />;
      case "TestRequest":
        return <TestRequest />;
      case "BillingHistory":
        return <BillingHistory />;

      default:
        return <HomeView />;
    }
  };

  return (
    <div className="Main_container_app">
      <h3>Patient Lab Profile</h3>
      <div className="main_container_mugesh">
        <div className="mugesh_left_siede_div">
          <div className="menu_mugesh">
            <div className="menus_mugesh">
              <button
                className={`but ${selectedMenu === "home" ? "active" : ""}`}
                onClick={handleHomeView}
              >
                Home <ArrowForwardIosIcon />
              </button>
              <button
                className={`but ${
                  selectedMenu === "TestRequest" ? "active" : ""
                }`}
                onClick={() => handleLAB("TestRequest")}
              >
                TEST REQUEST <ArrowForwardIosIcon />
              </button>
              <button
                className={`but ${
                  selectedMenu === "BillingHistory" ? "active" : ""
                }`}
                onClick={() => handleLAB("BillingHistory")}
              >
                BILLING HISTORY <ArrowForwardIosIcon />
              </button>
              <button
                className={`but ${
                  selectedMenu === "TestReport" ? "active" : ""
                }`}
                onClick={() => handleLAB("TestReport")}
              >
                TEST REPORT <ArrowForwardIosIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="mugesh_continer_viwe">{renderContent()}</div>
      </div>
    </div>
  );
};

const styles = {
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
  },
};

export default PatientLabProfile;
