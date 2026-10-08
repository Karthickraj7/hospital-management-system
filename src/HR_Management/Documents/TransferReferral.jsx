// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import axios from "axios";
// import DeleteIcon from "@mui/icons-material/Delete";
// import "./StaffPersonalRecCheckList.css";
// import { useReactToPrint } from "react-to-print";
// import './TransferReferral.css';

// const PrintContent = React.forwardRef((props, ref) => {
//   return (
//     <div
//       ref={ref}
//       id="reactprintcontent"
//       style={{
//         display: "flex",
//         alignItems: "flex-start",
//         justifyContent: "flex-start",
//         height: "100%",
//         width: "100%",
//       }}
//     >
//       {props.children}
//     </div>
//   );
// });

// function TransferReferral() {
//   const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
//   const componentRef = useRef();
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);

//   const [formData, setFormData] = useState({
//   s: "",
//   });

//   const [ClinicDetials, setClinicDetials] = useState({
//     ClinicLogo: null,
//     ClinicName: "SILVERLINE SPECIALITY HOSPITAL",
//     ClinicAddress: "C-23, 4th Cross, Thillainagar, Trichy - 18",
//     ClinicGST: "",
//     ClinicCity: "",
//     ClinicState: "",
//     ClinicCode: "",
//     ClinicMobileNo: "",
//     DrugLicenseNumber: "",
//     ClinicMailID: "",
//   });

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Masters/Hospital_Detials_link`)
//       .then((response) => {
//         if (response.data) {
//           setClinicDetials((prev) => ({
//             ...prev,
//             ClinicName: response.data.hospitalName || prev.ClinicName,
//             ClinicLogo: response.data.hospitalLogo,
//           }));
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });

//     axios
//       .get(`${UrlLink}Masters/Clinic_Detials_link`)
//       .then((response) => {
//         const clinicData = response.data[0];
//         if (clinicData) {
//           const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(
//             (component) => component
//           );

//           setClinicDetials((prev) => ({
//             ...prev,
//             ClinicAddress: addressComponents.join(", ") || prev.ClinicAddress,
//             ClinicGST: clinicData.GSTNo || prev.ClinicGST,
//             ClinicCity: clinicData.City || prev.ClinicCity,
//             ClinicState: clinicData.State || prev.ClinicState,
//             ClinicCode: clinicData.Pincode || prev.ClinicCode,
//             ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
//             DrugLicenseNumber:
//               clinicData.DrugLicenseNumber || prev.DrugLicenseNumber,
//             ClinicMailID: clinicData.Mail || prev.ClinicMailID,
//           }));
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, [userRecord?.location, UrlLink]);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     onBeforePrint: () => {
//       console.log("Preparing to print...");
//     },
//     onAfterPrint: () => {
//       console.log("Print complete.");
//       setIsPrintButtonVisible(true);
//     },
//   });

//   const triggerPrint = () => {
//     setIsPrintButtonVisible(false);
//     setTimeout(() => {
//       if (componentRef.current) {
//         handlePrint();
//       } else {
//         console.error("Print component reference not found");
//         setIsPrintButtonVisible(true);
//       }
//     }, 500);
//   };


//   useEffect(() => {
//     if (!isPrintButtonVisible) {
//       setTimeout(() => {
//         handlePrint();
//       }, 500);

//     } 
//   }, [isPrintButtonVisible]);



//   const forPrintPurchaseData = () => {
//     return (
//    <>

//    </>
//     );
//   };

//   return (
//     <>
//       {isPrintButtonVisible ? (
//       <>
// <div className="transfer-referral-form-1">
//       <div className="form-header-1">
//         <h2 className="hospital-name-1">Chirayu Hospital</h2>
//         <p className="hospital-address-1">Salvi Stop, Ratnagiri</p>
//         <h3 className="form-title-1">TRANSFER/ REFERRAL LETTER</h3>
//       </div>

//       <div className="form-section-132">
//         <div className="row-1">
//           <div className="field-group-123 patient-details-123">
//             <label className="label-1">Patient Name:-</label>
//           </div>
//           <div className="field-group-123 age-sex-1">
//             <label className="label-1">Age/Sex:-</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 consultant-1">
//             <label className="label-1">Admitting Consultant:-</label>
//           </div>
//           <div className="field-group-123 mrn-1">
//             <label className="label-1">MRN No.</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 emergency-1">
//             <label className="label-1">Emergency/Routine</label>
//           </div>
//           <div className="field-group-123 mlc-1">
//             <label className="label-1">MLC No.</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <label className="label-1 to-label-1">To,</label>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 hospital-name-field-1">
//             <label className="label-1">Hospital Name-</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 address-field-1">
//             <label className="label-1">Address-</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 admitted-history-1">
//             <label className="label-1">Admitted with History of</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 complaints-1">
//             <label className="label-1">Complaints of:</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 comorbidities-1">
//             <label className="label-1">Comorbidities-</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 past-history-1">
//             <label className="label-1">Past Medi/Surgical history</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 diagnosis-1">
//             <label className="label-1">Diagnosis:</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 treatment-1">
//             <label className="label-1">Treatment Given</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 purpose-1">
//             <label className="label-1">Purpose of Transfer/ Referral:</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 transfer-with-1">
//             <label className="label-1">---to Transfer with :</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 transport-mode-1">
//             <p className="transport-text-1">
//               Cardiac Ambulance with Medical Supervision/Non-cardiac Ambulance-with or without
//               Oxygen/Private Vehicle/ Other means of Transport (Due risks & consequences during travelling
//               explained)
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Second page */}
//       <div className="form-section-2">
//         <div className="row-1">
//           <div className="field-group-123 shifting-time-1">
//             <label className="label-1">At the time of Shifting-</label>
//             <div className="date-time-1">
//               <span className="date-label-1">Date:</span>
//               <span className="time-label-1">Time:</span>
//             </div>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 vitals-row-1">
//             <div className="vital-box-1">
//               <label className="vital-label-1">O/E:</label>
//             </div>
//             <div className="vital-box-1">
//               <label className="vital-label-1">P-</label>
//               <span className="unit-1">min</span>
//             </div>
//             <div className="vital-box-1">
//               <label className="vital-label-1">BP-</label>
//               <span className="unit-1">mm of Hg</span>
//             </div>
//             <div className="vital-box-1">
//               <label className="vital-label-1">SPO2-</label>
//               <span className="unit-1">%with</span>
//             </div>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 examination-row-1">
//             <div className="exam-box-1">
//               <label className="exam-label-1">S/E:RS</label>
//             </div>
//             <div className="exam-box-1">
//               <label className="exam-label-1">CVS-</label>
//             </div>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 examination-row-1">
//             <div className="exam-box-1">
//               <label className="exam-label-1">CNS-</label>
//             </div>
//             <div className="exam-box-1">
//               <label className="exam-label-1">P/A-</label>
//             </div>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 devices-1">
//             <label className="label-1">Foley's/RT/ETT/Trach/'T' piece/venti/drain/ICD/Veinflow</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 consent-1">
//             <label className="label-1">Informed consent</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 signature-1">
//             <label className="label-1">Relative's Sign-</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 rel-name-1">
//             <label className="label-1">Name-</label>
//           </div>
//         </div>

//         <div className="row-1">
//           <div className="field-group-123 relation-1">
//             <label className="label-1">Relation-</label>
//           </div>
//         </div>
//       </div>
//       <div className="Main_container_Btn">
//             <button onClick={triggerPrint}>Print</button>
//           </div>
//     </div>
//       </>
//       ) : (
//         <>
//           <PrintContent
//             ref={componentRef}
//             style={{
//               display: "flex",
//               justifyContent: "center",
//             }}
//           >
//             {forPrintPurchaseData()}
//           </PrintContent>
//         </>
//       )}
//     </>
//   );
// }

// export default TransferReferral;
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import "./StaffPersonalRecCheckList.css";
import { useReactToPrint } from "react-to-print";
import './TransferReferral.css';

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

function TransferReferral() {
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const componentRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [formData, setFormData] = useState({
    patientName: "",
    ageSex: "",
    admittingConsultant: "",
    mrnNo: "",
    emergencyRoutine: "",
    mlcNo: "",
    hospitalName: "",
    address: "",
    admittedHistory: "",
    complaints: "",
    comorbidities: "",
    pastHistory: "",
    diagnosis: "",
    treatmentGiven: "",
    purposeOfTransfer: "",
    transferWith: "",
    transportMode: "",
    shiftingDate: "",
    shiftingTime: "",
    pulse: "",
    bp: "",
    spo2: "",
    rs: "",
    cvs: "",
    cns: "",
    pa: "",
    devices: "",
    consent: "",
    relativeSign: "",
    relativeName: "",
    relation: ""
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
    axios
      .get(`${UrlLink}Masters/Hospital_Detials_link`)
      .then((response) => {
        if (response.data) {
          setClinicDetials((prev) => ({
            ...prev,
            ClinicName: response.data.hospitalName || prev.ClinicName,
            ClinicLogo: response.data.hospitalLogo,
          }));
        }
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(
            (component) => component
          );

          setClinicDetials((prev) => ({
            ...prev,
            ClinicAddress: addressComponents.join(", ") || prev.ClinicAddress,
            ClinicGST: clinicData.GSTNo || prev.ClinicGST,
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicState: clinicData.State || prev.ClinicState,
            ClinicCode: clinicData.Pincode || prev.ClinicCode,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            DrugLicenseNumber:
              clinicData.DrugLicenseNumber || prev.DrugLicenseNumber,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
          }));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.location, UrlLink]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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

  const forPrintPurchaseData = () => {
    return (
      <div className="transfer-referral-form-1">
        <div className="form-header-1">
          <h2 className="hospital-name-1">Chirayu Hospital</h2>
          <p className="hospital-address-1">Salvi Stop, Ratnagiri</p>
          <h3 className="form-title-1">TRANSFER/ REFERRAL LETTER</h3>
        </div>

        <div className="form-section-132">
          <div className="row-1">
            <div className="field-group-123 patient-details-123">
              <label className="label-1">Patient Name:-</label>
              <span>{formData.patientName}</span>
            </div>
            <div className="field-group-123 age-sex-1">
              <label className="label-1">Age/Sex:-</label>
              <span>{formData.ageSex}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 consultant-1">
              <label className="label-1">Admitting Consultant:-</label>
              <span>{formData.admittingConsultant}</span>
            </div>
            <div className="field-group-123 mrn-1">
              <label className="label-1">MRN No.</label>
              <span>{formData.mrnNo}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 emergency-1">
              <label className="label-1">Emergency/Routine</label>
              <span>{formData.emergencyRoutine}</span>
            </div>
            <div className="field-group-123 mlc-1">
              <label className="label-1">MLC No.</label>
              <span>{formData.mlcNo}</span>
            </div>
          </div>

          <div className="row-1">
            <label className="label-1 to-label-1">To,</label>
          </div>

          <div className="row-1">
            <div className="field-group-123 hospital-name-field-1">
              <label className="label-1">Hospital Name-</label>
              <span>{formData.hospitalName}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 address-field-1">
              <label className="label-1">Address-</label>
              <span>{formData.address}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 admitted-history-1">
              <label className="label-1">Admitted with History of</label>
              <span>{formData.admittedHistory}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 complaints-1">
              <label className="label-1">Complaints of:</label>
              <span>{formData.complaints}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 comorbidities-1">
              <label className="label-1">Comorbidities-</label>
              <span>{formData.comorbidities}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 past-history-1">
              <label className="label-1">Past Medi/Surgical history</label>
              <span>{formData.pastHistory}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 diagnosis-1">
              <label className="label-1">Diagnosis:</label>
              <span>{formData.diagnosis}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 treatment-1">
              <label className="label-1">Treatment Given</label>
              <span>{formData.treatmentGiven}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 purpose-1">
              <label className="label-1">Purpose of Transfer/ Referral:</label>
              <span>{formData.purposeOfTransfer}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 transfer-with-1">
              <label className="label-1">---to Transfer with :</label>
              <span>{formData.transferWith}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 transport-mode-1">
              <p className="transport-text-1">
                Cardiac Ambulance with Medical Supervision/Non-cardiac Ambulance-with or without
                Oxygen/Private Vehicle/ Other means of Transport (Due risks & consequences during travelling
                explained)
              </p>
            </div>
          </div>
        </div>

        {/* Second page */}
        <div className="form-section-2">
          <div className="row-1">
            <div className="field-group-123 shifting-time-1">
              <label className="label-1">At the time of Shifting-</label>
              <div className="date-time-1">
                <span className="date-label-1">Date: {formData.shiftingDate}</span>
                <span className="time-label-1">Time: {formData.shiftingTime}</span>
              </div>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-1234 vitals-row-1">
              <div className="vital-box-1">
                <label className="vital-label-1">O/E:</label>
              </div>
              <div className="vital-box-1">
                <label className="vital-label-1">P-</label>
                <span>{formData.pulse}</span>
                <span className="unit-1">min</span>
              </div>
              <div className="vital-box-1">
                <label className="vital-label-1">BP-</label>
                <span>{formData.bp}</span>
                <span className="unit-1">mm of Hg</span>
              </div>
              <div className="vital-box-1">
                <label className="vital-label-1">SPO2-</label>
                <span>{formData.spo2}</span>
                <span className="unit-1">%with</span>
              </div>
            </div>
          </div>


          <div className="row-1">
            <div className="field-group-123 examination-row-1">
              <div className="exam-box-1">
                <label className="exam-label-1">S/E:RS</label>
                <span>{formData.rs}</span>
              </div>
              <div className="exam-box-1">
                <label className="exam-label-1">CVS-</label>
                <span>{formData.cvs}</span>
              </div>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 examination-row-1">
              <div className="exam-box-1">
                <label className="exam-label-1">CNS-</label>
                <span>{formData.cns}</span>
              </div>
              <div className="exam-box-1">
                <label className="exam-label-1">P/A-</label>
                <span>{formData.pa}</span>
              </div>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 devices-1">
              <label className="label-1">Foley's/RT/ETT/Trach/'T' piece/venti/drain/ICD/Veinflow</label>
              <span>{formData.devices}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 consent-1">
              <label className="label-1">Informed consent</label>
              <span>{formData.consent}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 signature-1">
              <label className="label-1">Relative's Sign-</label>
              <span>{formData.relativeSign}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 rel-name-1">
              <label className="label-1">Name-</label>
              <span>{formData.relativeName}</span>
            </div>
          </div>

          <div className="row-1">
            <div className="field-group-123 relation-1">
              <label className="label-1">Relation-</label>
              <span>{formData.relation}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isPrintButtonVisible ? (
        <>
          <div className="transfer-referral-form-1">
            <div className="form-header-1">
              <h2 className="hospital-name-1">Chirayu Hospital</h2>
              <p className="hospital-address-1">Salvi Stop, Ratnagiri</p>
              <h3 className="form-title-1">TRANSFER/ REFERRAL LETTER</h3>
            </div>

            <div className="form-section-132">
              <div className="row-1">
                <div className="field-group-123 patient-details-123">
                  <label className="label-1">Patient Name<span>:</span></label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
                <div className="field-group-123 age-sex-1">
                  <label className="label-1">Age/Sex<span>:</span></label>
                  <input
                    type="text"
                    name="ageSex"
                    value={formData.ageSex}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 consultant-1">
                  <label className="label-1">Admitting Consultant<span>:</span></label>
                  <input
                    type="text"
                    name="admittingConsultant"
                    value={formData.admittingConsultant}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
                <div className="field-group-123 mrn-1">
                  <label className="label-1">MRN No<span>:</span></label>
                  <input
                    type="text"
                    name="mrnNo"
                    value={formData.mrnNo}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 emergency-1">
                  <label className="label-1">Emergency/Routine<span>:</span></label>
                  <input
                    type="text"
                    name="emergencyRoutine"
                    value={formData.emergencyRoutine}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
                <div className="field-group-123 mlc-1">
                  <label className="label-1">MLC No<span>:</span></label>
                  <input
                    type="text"
                    name="mlcNo"
                    value={formData.mlcNo}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <label className="label-1 to-label-1">To,</label>
              </div>

              <div className="row-1">
                <div className="field-group-123 hospital-name-field-1">
                  <label className="label-1">Hospital Name<span>:</span></label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 address-field-1">
                  <label className="label-1">Address<span>:</span></label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 admitted-history-1">
                  <label className="label-1">Admitted with History of</label>
                  <input
                    type="text"
                    name="admittedHistory"
                    value={formData.admittedHistory}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 complaints-1">
                  <label className="label-1">Complaints of<span>:</span></label>
                  <input
                    type="text"
                    name="complaints"
                    value={formData.complaints}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 comorbidities-1">
                  <label className="label-1">Comorbidities<span>:</span></label>
                  <input
                    type="text"
                    name="comorbidities"
                    value={formData.comorbidities}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 past-history-1">
                  <label className="label-1">Past Medi/Surgical history<span>:</span></label>
                  <input
                    type="text"
                    name="pastHistory"
                    value={formData.pastHistory}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 diagnosis-1">
                  <label className="label-1">Diagnosis<span>:</span></label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 treatment-1">
                  <label className="label-1">Treatment Given<span>:</span></label>
                  <input
                    type="text"
                    name="treatmentGiven"
                    value={formData.treatmentGiven}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 purpose-1">
                  <label className="label-1">Purpose of Transfer/ Referral<span>:</span></label>
                  <input
                    type="text"
                    name="purposeOfTransfer"
                    value={formData.purposeOfTransfer}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 transfer-with-1">
                  <label className="label-1">---to Transfer with <span>:</span></label>
                  <input
                    type="text"
                    name="transferWith"
                    value={formData.transferWith}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 transport-mode-1">
                  <p className="transport-text-1">
                    Cardiac Ambulance with Medical Supervision/Non-cardiac Ambulance-with or without
                    Oxygen/Private Vehicle/ Other means of Transport (Due risks & consequences during travelling
                    explained)
                  </p>
                </div>
              </div>
            </div>

            {/* Second page */}
            <div className="form-section-2">
              <div className="row-1">
                <div className="field-group-123 shifting-time-1">
                  <label className="label-1">At the time of Shifting-</label>
                  <div className="date-time-1">
                    <span className="date-label-1">Date<span>:</span></span>
                    <input
                      type="text"
                      name="shiftingDate"
                      value={formData.shiftingDate}
                      onChange={handleInputChange}
                      className="input-field-1"
                      style={{ width: "100px" }}
                    />
                    <span className="time-label-1">Time<span>:</span></span>
                    <input
                      type="text"
                      name="shiftingTime"
                      value={formData.shiftingTime}
                      onChange={handleInputChange}
                      className="input-field-1"
                      style={{ width: "100px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-1234 vitals-row-1">
                  <div className="vital-box-1">
                    <label className="vital-label-1">O/E<span>:</span></label>
                  </div>
                  <div className="vital-box-1">
                    <label className="vital-label-1">P-</label>
                    <input
                      type="text"
                      name="pulse"
                      value={formData.pulse}
                      onChange={handleInputChange}
                      className="input-field-1"
                      style={{ width: "50px" }}
                    />
                    <span className="unit-1">min</span>
                  </div>
                  <div className="vital-box-1">
                    <label className="vital-label-1">BP-</label>
                    <input
                      type="text"
                      name="bp"
                      value={formData.bp}
                      onChange={handleInputChange}
                      className="input-field-1"
                      style={{ width: "80px" }}
                    />
                    <span className="unit-1">mm of Hg</span>
                  </div>
                  <div className="vital-box-1">
                    <label className="vital-label-1">SPO2-</label>
                    <input
                      type="text"
                      name="spo2"
                      value={formData.spo2}
                      onChange={handleInputChange}
                      className="input-field-1"
                      style={{ width: "50px" }}
                    />
                    <span className="unit-1">%with</span>
                  </div>
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 examination-row-1">
                  <div className="exam-box-1">
                    <label className="exam-label-1">S/E:RS</label>
                    <input
                      type="text"
                      name="rs"
                      value={formData.rs}
                      onChange={handleInputChange}
                      className="input-field-1"
                    />
                  </div>
                  <div className="exam-box-1">
                    <label className="exam-label-1">CVS-</label>
                    <input
                      type="text"
                      name="cvs"
                      value={formData.cvs}
                      onChange={handleInputChange}
                      className="input-field-1"
                    />
                  </div>
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 examination-row-1">
                  <div className="exam-box-1">
                    <label className="exam-label-1">CNS-</label>
                    <input
                      type="text"
                      name="cns"
                      value={formData.cns}
                      onChange={handleInputChange}
                      className="input-field-1"
                    />
                  </div>
                  <div className="exam-box-1">
                    <label className="exam-label-1">P/A-</label>
                    <input
                      type="text"
                      name="pa"
                      value={formData.pa}
                      onChange={handleInputChange}
                      className="input-field-1"
                    />
                  </div>
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 devices-1">
                  <label className="label-1">Foley's/RT/ETT/Trach/'T' piece/venti/drain/ICD/Veinflow</label>
                  <input
                    type="text"
                    name="devices"
                    value={formData.devices}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 consent-1">
                  <label className="label-1">Informed consent</label>
                  <input
                    type="text"
                    name="consent"
                    value={formData.consent}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 signature-1">
                  <label className="label-1">Relative's Sign-</label>
                  <input
                    type="text"
                    name="relativeSign"
                    value={formData.relativeSign}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 rel-name-1">
                  <label className="label-1">Name-</label>
                  <input
                    type="text"
                    name="relativeName"
                    value={formData.relativeName}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>

              <div className="row-1">
                <div className="field-group-123 relation-1">
                  <label className="label-1">Relation-</label>
                  <input
                    type="text"
                    name="relation"
                    value={formData.relation}
                    onChange={handleInputChange}
                    className="input-field-1"
                  />
                </div>
              </div>
            </div>
            <div className="Main_container_Btn">
              <button onClick={triggerPrint}>Print</button>
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
            {forPrintPurchaseData()}
          </PrintContent>
        </>
      )}
    </>
  );
}

export default TransferReferral;
