
import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import axios from "axios";
import "./GeneralStaffPrint.css";
const PrintContent = React.forwardRef((props, ref) => {


  return (
    <div ref={ref} id="reactprintcontent"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: '100%',
        width: "100%",
      }}
    >
      {props.children}
    </div>
  );
});

const GeneralStaffUndertaking = () => {
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const componentRef = useRef();

  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: "",
    ClinicAddress: "",
    ClinicMobileNo: "",
    ClinicLandlineNo: "",
    ClinicMailID: "",
    ClinicWebsite: "",
  });

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    joinDate: "",
    place: "",
    date: "",
    signature: "",
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setIsPrintButtonVisible(true);
    },
  });

  const printDocument = () => {
    setIsPrintButtonVisible(false);
    setTimeout(() => {
      handlePrint();
    }, 800);
  };

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
          const addressComponents = [
            clinicData.DoorNo,
            clinicData.Street,
            clinicData.Area,
            clinicData.City,
            clinicData.State,
            clinicData.Country,
            clinicData.Pincode,
          ].filter((component) => component && component.trim() !== "");

          const formattedAddress = addressComponents.length > 0
            ? addressComponents.join(", ")
            : "N/A";

          setClinicDetials((prev) => ({
            ...prev,
            ClinicAddress: formattedAddress,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            ClinicLandlineNo: clinicData.LandlineNo || prev.ClinicLandlineNo,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
            ClinicWebsite: clinicData.Website || prev.ClinicWebsite || "N/A",
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching clinic details:", error);
      });
  }, [UrlLink]);

  const renderUndertakingDocument = (isEditable) => (
    <div>
      <div className="undertaking-header">
        <div className="undertaking-logo-section">
          <div className="undertaking-logo">
            {/* Replace hardcoded logo icon with fetched logo image */}
            <img
              src={ClinicDetials.ClinicLogo || "/placeholder-logo.png"}
              alt="Hospital Logo"
              className="undertaking-logo-icon"
            />
            <div className="undertaking-logo-text">
              {/* Split ClinicName into title and subtitle if possible, or use as-is */}
              <span className="undertaking-logo-title">
                {ClinicDetials.ClinicName ? ClinicDetials.ClinicName.split(" ")[0] : "N/A"}
              </span>
              <span className="undertaking-logo-subtitle">
                {ClinicDetials.ClinicName ? ClinicDetials.ClinicName.split(" ").slice(1).join(" ") : ""}
              </span>
              <span className="undertaking-logo-tagline">enhancing lives</span>
            </div>
          </div>

          <div className="undertaking-hospital-details">
            <h1 className="undertaking-hospital-name">
              {ClinicDetials.ClinicName || "N/A"}
            </h1>
            <p className="undertaking-hospital-address">
              {ClinicDetials.ClinicAddress || "N/A"}
            </p>
            <p className="undertaking-hospital-contact">
              {ClinicDetials.ClinicMobileNo ? `Ph: ${ClinicDetials.ClinicMobileNo}` : "Ph: N/A"}
              {ClinicDetials.ClinicLandlineNo ? ` | Landline: ${ClinicDetials.ClinicLandlineNo}` : ""}
            </p>
            <p className="undertaking-hospital-email">
              email: {ClinicDetials.ClinicMailID || "N/A"}
            </p>
           
          </div>
        </div>

        <div className="undertaking-separator"></div>

        <div className="undertaking-title-section">
          <h2 className="undertaking-title">
            IMPORTANT INFORMATION FOR THE NEW MEMBER OF
            <br />
            {ClinicDetials.ClinicName || "N/A"}
          </h2>
          <div className="undertaking-subtitle-box">
            <h3 className="undertaking-subtitle">
              UNDERTAKING LETTER BY THE GENERAL STAFF
            </h3>
          </div>
        </div>
        <div className="undertaking-form-header">
          <p className="undertaking-form-intro">
            I, Mr. / Ms. / Mrs. / Dr. {
              isEditable ?
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="edewdwe_jj"
                  style={{ border: "none", borderBottom: "1px dotted #000", outline: "none", width: "200px" }}
                /> :
                <input type="text" className="edewdwe_jj"
                  value={formData.name} ></input>
            } joined as {
              isEditable ?
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="edewdwe_jj"

                  style={{ border: "none", borderBottom: "1px dotted #000", outline: "none", width: "150px" }}
                /> :
                <input type="text"
                  className="edewdwe_jj"
                  value={formData.position}
                ></input>
            } in the {
              isEditable ?
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="edewdwe_jj"

                  style={{ border: "none", borderBottom: "1px dotted #000", outline: "none", width: "180px" }}
                /> :
                <input type="text"
                  value={formData.department}

                  className="edewdwe_jj"
                ></input>
            } department on {
              isEditable ?
                <input
                  type="text"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="edewdwe_jj"

                  style={{ border: "none", borderBottom: "1px dotted #000", outline: "none", width: "150px" }}
                /> :
                <input type="text"
                  value={formData.joinDate}

                  className="edewdwe_jj"
                ></input>
            }. I have been informed by the H.R. Department about all the service conditions. I have also read and clarified the following information and hence my undertaking.
          </p>
        </div>

        <div className="undertaking-rules-section">
          <ol className="undertaking-rules-list">
            <li className="undertaking-rule-item undertaking-rule-item1">
              That I will abide by all the policies, protocols and general service rules of the hospital.
            </li>
            <li className="undertaking-rule-item undertaking-rule-item2">
              That I will attend my duties on time and avoid any late coming as I understood that I am working
              in Hospital and any late coming will hamper the patient services.
            </li>
            <li className="undertaking-rule-item undertaking-rule-item3">
              That I will not be absent from my duties without obtaining leave sanction from my Head of the
              Department and prior information. I understand my un authorised absenteeism will cause work
              dislocation and inconvenience at the department.
            </li>
            <li className="undertaking-rule-item undertaking-rule-item4">
              That I will give one / two month's prior information before leaving the organization by way of
              resignation. I also understand that if I failI to give one / two month's notice due to my personal
              reasons and urgency. I agree to pay one / two month's Salary in lieu of notice period.
              Depending on the grounds for resignation, notice period can be waived or reduced at the
              discretion of the management
            </li>
            <li className="undertaking-rule-item undertaking-rule-item5">
              That I will wear uniform if applicable and Identity Card always on duty.
            </li>
            <li className="undertaking-rule-item undertaking-rule-item6">
              That I will use only service entry and exit while attending my duties.
            </li>
            <li className="undertaking-rule-item undertaking-rule-item7">
              That I will follow all the rules and regulations pertaining to leave, extra duty and other related
              service conditions as per the company policy.
            </li>
            <li className="undertaking-rule-item undertaking-rule-item8">
              That I will intimate the change of my residential / local contact address from time to time to the
              H.R. Department as part of updation of my records and to contact me at times of urgency.
            </li>
            <li className="undertaking-rule-item undertaking-rule-item9">
              That I will maintain utmost grooming standards and dressing codes of the hospital : clean
              shaven, trim hair cut (for males) / properly tied hair (for ladies) at all times.
            </li>
            <li className="undertaking-rule-item undertaking-rule-item10">
              That I will hand over the identity card and other belongings ( if issued ) of the organization at the
              time of leaving the services or pay the cost of the same. If loss happens due to my negligence.
            </li>
            <li className="undertaking-rule-item undertaking-rule-item11">
              That I will submit the no-dues certificate before my full and final settlement at the time of
              relieving.
            </li>
          </ol>
        </div>

        <div className="undertaking-signature-section">
          <div className="undertaking-signature-row">
            <div className="undertaking-field">
              <label className="undertaking-field-label">Place <span>:</span> </label>
              {isEditable ?
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  style={{ border: "none", borderBottom: "1px dotted #000", outline: "none", width: "150px" }}
                /> :
                <span className="undertaking-field-value">{formData.place}</span>
              }
            </div>
            <div className="undertaking-field">
              <label className="undertaking-field-label">Signature <span>:</span> </label>
              {isEditable ?
                <input
                  type="text"
                  name="signature"
                  value={formData.signature}
                  onChange={handleChange}
                  style={{ border: "none", borderBottom: "1px dotted #000", outline: "none", width: "150px" }}
                /> :
                <span className="undertaking-field-value">{formData.signature}</span>
              }
            </div>
          </div>
          <div className="undertaking-signature-row">
            <div className="undertaking-field">
              <label className="undertaking-field-label">Date <span>:</span> </label>
              {isEditable ?
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={{ border: "none", borderBottom: "1px dotted #000", outline: "none", width: "150px" }}
                /> :
                <span className="undertaking-field-value">{formData.date}</span>
              }
            </div>
            <div className="undertaking-field">
              <label className="undertaking-field-label">Name<span>:</span> </label>
              {isEditable ?
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ border: "none", borderBottom: "1px dotted #000", outline: "none", width: "150px" }}
                /> :
                <span className="undertaking-field-value">{formData.name}</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isPrintButtonVisible ? (
        <>
          <div className="undertaking-document" ref={componentRef}>
            {renderUndertakingDocument(true)}
          </div>

          <div className="staff-undertaking-container">
            <div className="undertaking-print-button">
              <button onClick={printDocument}>Print</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <PrintContent
            ref={componentRef}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {renderUndertakingDocument(false)}
          </PrintContent>
        </>
      )}
    </>
  );
};

export default GeneralStaffUndertaking;
