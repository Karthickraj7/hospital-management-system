import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import "./StaffPersonalRecCheckList.css";
import { useReactToPrint } from "react-to-print";

const PrintContent = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      id="reactprintcontent"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        height: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </div>
  );
});

function StaffPersonalRecCheckList() {
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const componentRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeNo: "",
    department: "",
    designation: "",
    dateOfJoining: "",

    // Application Forms
    resume: false,
    photos: false,
    interviewRatingScale: false,
    offerLetter: false,
    appointmentLetter: false,
    employeesJoiningReport: false,
    applicationForEmployment: false,
    generalRules: false,
    jobDescription: false,
    criminalAntecedentsForm: false,
    annualHealthCheckupReports: false,
    esiForm1: false,
    pfForm11: false,
    form2: false,

    // Proofs
    voterIdPhotocopy: false,
    aadharCardPhotocopy: false,
    bankPassbookPhotocopy: false,

    // Others
    computerCourseCertificates: false,
    trainingCourseCertificates: false,

    // Previous Employer Details
    experienceLetter: false,

    // Mark Sheets
    sslc: false,
    hsc: false,
    ug: false,
    pg: false,
    nursing: false,
    ccDegreeCertificate: false,
    otherMarkSheets: false,

    // Original Certificates Status
    originalCertificatesStatus: "",
  });

  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: "SILVERLINE SPECIALITY HOSPITAL",
    ClinicAddress: "C-23, 4th Cross, Thillainagar, Trichy - 18",
    ClinicGST: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    DrugLicenseNumber: "",
    ClinicMailID: "",
  });

  useEffect(() => {
    // Fetch hospital details
    axios
      .get(`${UrlLink}Masters/Hospital_Detials_link`)
      .then((response) => {
        if (response.data) {
          const logoBase64 = response.data.hospitalLogo;
          const formattedLogo = logoBase64?.startsWith("data:image")
            ? logoBase64
            : `data:image/jpeg;base64,${logoBase64}`; // Format base64 logo

          setClinicDetials((prev) => ({
            ...prev,
            ClinicName: response.data.hospitalName || prev.ClinicName,
            ClinicLogo: formattedLogo || prev.ClinicLogo,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching hospital details:", error);
      });

    // Fetch clinic details
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          // Construct full address with all relevant fields
          const addressComponents = [
            clinicData.DoorNo,
            clinicData.Street,
            clinicData.Area,
            clinicData.City,
            clinicData.State,
            clinicData.Country,
            clinicData.Pincode,
          ].filter((component) => component && component.trim() !== ""); // Remove empty or whitespace-only components

          const formattedAddress = addressComponents.length > 0
            ? addressComponents.join(", ")
            : "N/A"; // Fallback to "N/A" if no valid components

          setClinicDetials((prev) => ({
            ...prev,
            ClinicAddress: formattedAddress,
            ClinicGST: clinicData.GSTNo || prev.ClinicGST,
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicState: clinicData.State || prev.ClinicState,
            ClinicCode: clinicData.Pincode || prev.ClinicCode,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            DrugLicenseNumber: clinicData.DrugLicenseNumber || prev.DrugLicenseNumber,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching clinic details:", error);
      });
  }, [UrlLink]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      console.log("Preparing to print...");
    },
    onAfterPrint: () => {
      console.log("Print complete.");
      setIsPrintButtonVisible(true);
    },
  });

  const triggerPrint = () => {
    setIsPrintButtonVisible(false);
    setTimeout(() => {
      if (componentRef.current) {
        handlePrint();
      } else {
        console.error("Print component reference not found");
        setIsPrintButtonVisible(true);
      }
    }, 500);
  };

  useEffect(() => {
    if (!isPrintButtonVisible) {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
  }, [isPrintButtonVisible]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const forPrintPurchaseData = () => {
    return (
      <div ref={componentRef} className="staff-personal-record-checklist-print">
        <div className="checklist-header">
          <h2>{ClinicDetials.ClinicName ? `${ClinicDetials.ClinicName} CHECKLIST` : "N/A"}</h2>
          <p>{ClinicDetials.ClinicAddress || "N/A"}</p>
          <h3>STAFF PERSONAL RECORD CHECKLIST</h3>
        </div>

        <div className="personal-details-section">
          <div className="detail-row">
            <div className="detail-field">
              <label>
                Employee Name<span>:</span>
              </label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
              />
            </div>

          </div>

          <div className="detail-row">

            <div className="detail-field">
              <label>
                Employee No<span>:</span>
              </label>
              <input
                type="text"
                name="employeeNo"
                value={formData.employeeNo}
              />
            </div>
          </div>


          <div className="detail-row">
            <div className="detail-field">
              <label>
                Department<span>:</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
              />
            </div>

          </div>
          <div className="detail-row">
            <div className="detail-field">
              <label>
                Designation<span>:</span>
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
              />
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-field">
              <label>
                Date of Joining<span>:</span>
              </label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
              />
            </div>
          </div>
        </div>

        <div className="checklist-grid">
          <div className="checklist-section">
            <h4>Application Forms</h4>
            {[
              "resume",
              "photos",
              "interviewRatingScale",
              "offerLetter",
              "appointmentLetter",
              "employeesJoiningReport",
              "applicationForEmployment",
              "generalRules",
              "jobDescription",
              "criminalAntecedentsForm",
              "annualHealthCheckupReports",
              "esiForm1",
              "pfForm11",
              "form2",
            ].map((field) => (
              <div key={field} className="checklist-item">
                <input
                  type="checkbox"
                  name={field}
                  checked={formData[field]}
                  onChange={handleInputChange}
                />
                <span>
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, function (str) {
                      return str.toUpperCase();
                    })}
                </span>
              </div>
            ))}
          </div>

          <div className="checklist-section">
            <h4>Proofs</h4>
            {[
              "voterIdPhotocopy",
              "aadharCardPhotocopy",
              "bankPassbookPhotocopy",
            ].map((field) => (
              <div key={field} className="checklist-item">
                <input
                  type="checkbox"
                  name={field}
                  checked={formData[field]}
                  onChange={handleInputChange}
                />
                <span>
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, function (str) {
                      return str.toUpperCase();
                    })}
                </span>
              </div>
            ))}
          </div>

          <div className="checklist-section">
            <h4>Others</h4>
            {["computerCourseCertificates", "trainingCourseCertificates"].map(
              (field) => (
                <div key={field} className="checklist-item">
                  <input
                    type="checkbox"
                    name={field}
                    checked={formData[field]}
                    onChange={handleInputChange}
                  />
                  <span>
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, function (str) {
                        return str.toUpperCase();
                      })}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="checklist-section">
            <h4>Previous Employer Details</h4>
            <div className="checklist-item">
              <input
                type="checkbox"
                name="experienceLetter"
                checked={formData.experienceLetter}
                onChange={handleInputChange}
              />
              <span>Experience Letter</span>
            </div>
          </div>

          <div className="checklist-section">
            <h4>Mark Sheets</h4>
            {[
              "sslc",
              "hsc",
              "ug",
              "pg",
              "nursing",
              "ccDegreeCertificate",
              "otherMarkSheets",
            ].map((field) => (
              <div key={field} className="checklist-item">
                <input
                  type="checkbox"
                  name={field}
                  checked={formData[field]}
                  onChange={handleInputChange}
                />
                <span>
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, function (str) {
                      return str.toUpperCase();
                    })}
                </span>
              </div>
            ))}
          </div>

          <div className="checklist-section">
            <h4>Original Certificates Status</h4>
            <textarea
              name="originalCertificatesStatus"
              value={formData.originalCertificatesStatus}
              onChange={handleInputChange}
              className="original-certificates-textarea"
            />
          </div>
        </div>

        <div className="signature-section">
          <div className="signature-field">Employee Sign</div>
          <div className="signature-field">HR Sign</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isPrintButtonVisible ? (
        <div className="staff-personal-record-checklist-print">
          <div className="checklist-header">
            <h2>{ClinicDetials.ClinicName ? `${ClinicDetials.ClinicName} CHECKLIST` : "N/A"}</h2>
            <p>{ClinicDetials.ClinicAddress || "N/A"}</p>
            <h3>STAFF PERSONAL RECORD CHECKLIST</h3>
          </div>

          <div className="personal-details-section">
            <div className="detail-row">
              <div className="detail-field">
                <label>
                  Employee Name<span>:</span>
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                />
              </div>

            </div>

            <div className="detail-row">

              <div className="detail-field">
                <label>
                  Employee No<span>:</span>
                </label>
                <input
                  type="text"
                  name="employeeNo"
                  value={formData.employeeNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>


            <div className="detail-row">
              <div className="detail-field">
                <label>
                  Department<span>:</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>

            </div>
            <div className="detail-row">
              <div className="detail-field">
                <label>
                  Designation<span>:</span>
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-field">
                <label>
                  Date of Joining<span>:</span>
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="checklist-grid">
            <div className="checklist-section">
              <h4>Application Forms</h4>
              {[
                "resume",
                "photos",
                "interviewRatingScale",
                "offerLetter",
                "appointmentLetter",
                "employeesJoiningReport",
                "applicationForEmployment",
                "generalRules",
                "jobDescription",
                "criminalAntecedentsForm",
                "annualHealthCheckupReports",
                "esiForm1",
                "pfForm11",
                "form2",
              ].map((field) => (
                <div key={field} className="checklist-item">
                  <input
                    type="checkbox"
                    name={field}
                    checked={formData[field]}
                    onChange={handleInputChange}
                  />
                  <span>
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, function (str) {
                        return str.toUpperCase();
                      })}
                  </span>
                </div>
              ))}
            </div>

            <div className="checklist-section">
              <h4>Proofs</h4>
              {[
                "voterIdPhotocopy",
                "aadharCardPhotocopy",
                "bankPassbookPhotocopy",
              ].map((field) => (
                <div key={field} className="checklist-item">
                  <input
                    type="checkbox"
                    name={field}
                    checked={formData[field]}
                    onChange={handleInputChange}
                  />
                  <span>
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, function (str) {
                        return str.toUpperCase();
                      })}
                  </span>
                </div>
              ))}
            </div>

            <div className="checklist-section">
              <h4>Others</h4>
              {["computerCourseCertificates", "trainingCourseCertificates"].map(
                (field) => (
                  <div key={field} className="checklist-item">
                    <input
                      type="checkbox"
                      name={field}
                      checked={formData[field]}
                      onChange={handleInputChange}
                    />
                    <span>
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, function (str) {
                          return str.toUpperCase();
                        })}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="checklist-section">
              <h4>Previous Employer Details</h4>
              <div className="checklist-item">
                <input
                  type="checkbox"
                  name="experienceLetter"
                  checked={formData.experienceLetter}
                  onChange={handleInputChange}
                />
                <span>Experience Letter</span>
              </div>
            </div>

            <div className="checklist-section">
              <h4>Mark Sheets</h4>
              {[
                "sslc",
                "hsc",
                "ug",
                "pg",
                "nursing",
                "ccDegreeCertificate",
                "otherMarkSheets",
              ].map((field) => (
                <div key={field} className="checklist-item">
                  <input
                    type="checkbox"
                    name={field}
                    checked={formData[field]}
                    onChange={handleInputChange}
                  />
                  <span>
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, function (str) {
                        return str.toUpperCase();
                      })}
                  </span>
                </div>
              ))}
            </div>

            <div className="checklist-section">
              <h4>Original Certificates Status</h4>
              <textarea
                name="originalCertificatesStatus"
                value={formData.originalCertificatesStatus}
                onChange={handleInputChange}
                className="original-certificates-textarea"
              />
            </div>
          </div>

          <div className="signature-section">
            <div className="signature-field">Employee Sign</div>
            <div className="signature-field">HR Sign</div>
          </div>

          <div className="Main_container_Btn">
            <button onClick={triggerPrint}>Print</button>
          </div>
        </div>
      ) : (
        <>
          <PrintContent
            ref={componentRef}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {forPrintPurchaseData()}
          </PrintContent>
        </>
      )}
    </>
  );
}

export default StaffPersonalRecCheckList;


