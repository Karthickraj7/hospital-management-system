import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import { TextField } from "@mui/material";


const Drug_issue = () => {

   const [search, setSearch] = useState("");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [patients, setPatients] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [printRegId, setPrintRegId] = useState(null);

  const receiptRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: "DrugIssueReceipt",
  });
const [clinicDetails, setClinicDetails] = useState({
  ClinicName: "",
  ClinicAddress: "",
  ClinicCity: "",
  ClinicState: "",
  ClinicCode: "",
  ClinicMobileNo: "",
  ClinicLandLineNo: "",
  ClinicMailID: "",
  ClinicGST: "",
});


useEffect(() => {
  axios
    .get(`${UrlLink}Masters/Clinic_Detials_link`)
    .then((response) => {
      const clinicData = response.data[0];
      if (clinicData) {
        const addressComponents = [clinicData.Area].filter(Boolean);

        setClinicDetails({
          ClinicName: clinicData.Clinic_Name || "Clinic",
          ClinicAddress: addressComponents.join(", "),
          ClinicGST: clinicData.GSTNo || "",
          ClinicCity: clinicData.City || "",
          ClinicState: clinicData.State || "",
          ClinicCode: clinicData.Pincode || "",
          ClinicMobileNo: clinicData.PhoneNo || "",
          ClinicLandLineNo: clinicData.LandlineNo || "",
          ClinicMailID: clinicData.Mail || "",
        });

        // If you want to show logo too
        // if (clinicData.Clinic_Logo) {
        //   setClinicLogo(`data:image/png;base64,${clinicData.Clinic_Logo}`);
        // }
      }
    })
    .catch((error) => {
      console.error("Error fetching clinic details:", error);
    });
}, [UrlLink]);


  useEffect(() => {
    fetchrequest();
  }, []);

  const fetchrequest = async () => {
    try {
      const res = await axios.get(
        `${UrlLink}DrugAdminstrations/get_pending_centralstore_prescriptions`
      );
      setPatients(res.data || []);
    } catch (e) {
      alert(`Error occurred: ${e.message}`);
    }
  };

  const handleApprove = async (regId, prescription) => {
    try {
      await axios.post(`${UrlLink}DrugAdminstrations/issue_drug_from_ctrl`, {
        Prescription_Id: prescription.Prescription_Id,
        Status: "issued",
        IssuedBy: userRecord?.username,
      });

      alert("Prescription approved.");
      fetchrequest();
    } catch (e) {
      alert(`Approve failed: ${e.message}`);
    }
  };

   const filteredPatients = patients.filter(
    (p) =>
      p.Patient_Name.toLowerCase().includes(search.toLowerCase()) ||
      p.Registration_Id.toString().includes(search)
  );


  return (
    <>
      <div style={{ padding: "10px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
          Drug Issue Acknowledgement
        </h3>

        {/* 🔍 Search Bar */}
        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          <TextField
            label="Search Patient"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Main Patients Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead style={{ background: "#f5f5f5" }}>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Reg. ID</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Patient Name</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Room No</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Bed No</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Ward Name</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Floor Name</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Block Name</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Location_Name</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>View</th>
                <th style={{ border: "1px solid #ccc", padding: "6px" }}>Print</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "center" }}>
                    {p.Registration_Id}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}>{p.Patient_Name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}>{p.Room_ID}</td>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}>{p.Bed_No}</td>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}>{p.Ward_Name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}>{p.Floor_Name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}>{p.Block_Name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "6px" }}>{p.Location_Name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "center" }}>
                    <IconButton
                      onClick={() =>
                        setExpanded(expanded === p.Registration_Id ? null : p.Registration_Id)
                      }
                    >
                      {expanded === p.Registration_Id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "center" }}>
                    {p.Prescriptions?.some((pr) => pr.Status?.toLowerCase() === "issued") && (
                      <Button
                        variant="contained"
                        color="grey"
                        size="small"
                        onClick={() => {
                          setPrintRegId(p.Registration_Id);
                          setTimeout(() => handlePrint(), 200);
                        }}
                      >
                        <PrintIcon fontSize="small" /> Print
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expanded prescriptions */}
        {expanded && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              background: "#fafafa",
            }}
          >
            <h4>
              Prescriptions for Reg ID:{" "}
              <span style={{ color: "#1976d2" }}>{expanded}</span>
            </h4>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead style={{ background: "#eee" }}>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Prescription ID
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Medicine
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Generic
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Qty
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Expiry Date
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Expiry Status
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Batch No
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Status
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Approve
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .find((p) => p.Registration_Id === expanded)
                    ?.Prescriptions.map((pr, i) => (
                      <tr key={i}>
                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                          {pr.Prescription_Id}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                          {pr.MedicineName}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                          {pr.GenericName}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                          {pr.Quantity}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                          {pr.Expiry_Date}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                          {pr.Expiry_Status}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                          {pr.Batch_No}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                          {pr.Status}
                        </td>
                        <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                          {pr.Status === "Pending" ? (
                            <Button
                              variant="outlined"
                              color="warning"
                              size="small"
                              onClick={() => handleApprove(expanded, pr)}
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </Button>
                          ) : (
                            <span style={{ color: "green" }}>Approved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

     
<div style={{ display: "none" }}>
<div
  ref={receiptRef}
  style={{
    width: "148mm", // A5 width
    margin: "0 auto",   // ✅ centers horizontally
    padding: "12px",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    color: "#000",
    lineHeight: "1.4",
    textAlign: "center", // ✅ ensures overall center
  }}
>

  {printRegId && (
    <>
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          borderBottom: "2px solid #000",
          paddingBottom: "6px",
          marginBottom: "10px",
        }}
      >
        <img
          src="/images/ChirayuLogo.jpg"
          alt="Clinic Logo"
          style={{ maxHeight: "50px", marginBottom: "6px" }}
        />
        <div style={{ fontSize: "11px" }}>
          <b style={{ fontSize: "14px" }}>{clinicDetails.ClinicName}</b><br />
          {clinicDetails.ClinicAddress}, {clinicDetails.ClinicCity},{" "}
          {clinicDetails.ClinicState} - {clinicDetails.ClinicCode}<br />
          <b>Mob:</b> {clinicDetails.ClinicMobileNo},{" "}
          <b>Ph:</b> {clinicDetails.ClinicLandLineNo}<br />
          <b>Email:</b> {clinicDetails.ClinicMailID} |{" "}
          <b>GST:</b> {clinicDetails.ClinicGST}
        </div>
      </div>

      {/* Title */}
      <h3 style={{ textAlign: "center", margin: "8px 0" }}>Drug Issue Receipt</h3>

      {/* Patient Info */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <p><b>Registration ID:</b> {printRegId}</p>
        <p>
          <b>Patient:</b>{" "}
          {patients.find((p) => p.Registration_Id === printRegId)?.Patient_Name}
        </p>
        <p><b>Date:</b> {new Date().toLocaleString()}</p>
      </div>

      {/* Prescription Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          marginTop: "10px",
        }}
      >
        <thead style={{ background: "#f2f2f2" }}>
          <tr>
            <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Prescription</th>
            <th style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>Medicine</th>
            <th style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>Generic</th>
            <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Qty</th>
            <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Expiry Status</th>
            <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Expiry Date</th>
            <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Batch No</th>
          </tr>
        </thead>
        <tbody>
          {patients
            .find((p) => p.Registration_Id === printRegId)
            ?.Prescriptions.filter((pr) => pr.Status?.toLowerCase() === "issued")
            .map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{item.Prescription_Id}</td>
                <td style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>{item.MedicineName}</td>
                <td style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>{item.GenericName}</td>
                <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{item.Quantity}</td>
                <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{item.Expiry_Status}</td>
                <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{item.Expiry_Date}</td>
                <td style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>{item.Batch_No}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ marginTop: "20px", fontSize: "12px", textAlign: "center" }}>
        <p><b>Issued By:</b> {userRecord?.username}</p>
        <p style={{ marginTop: "10px" }}><b>Thank you!</b></p>
      </div>
    </>
  )}
</div>

</div>


   
    </>
  );
};

export default Drug_issue;
