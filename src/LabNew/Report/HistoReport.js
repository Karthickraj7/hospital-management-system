import React from "react";
import './Histo.css';

const MedicalReport = () => {
  return (
    <div className="report-box">
      <h2 className="report-header">KARUNA MEDICAL COLLEGE HOSPITAL</h2>
      <p className="report-subheader">CHITTUR, PALAKKAD, KERALA – PH: 221791, 221792, 221793</p>

      <h3 className="section-title">Clinical Details</h3>
      <div className="row">
        <label>Details:</label>
        <input defaultValue="Routine screening" />
      </div>

      <h3 className="section-title">Specimen</h3>
      <div className="row">
        <label>Type:</label>
        <input defaultValue="Conventional Pap" />
      </div>
      <div className="row">
        <label>Adequacy:</label>
        <input defaultValue="Adequate [2 slides]" />
      </div>

      <h3 className="section-title">Interpretation</h3>
      <div className="row">
        <label>Findings:</label>
        <input defaultValue="Moderate inflammation" />
      </div>
      <div className="row">
        <label>Conclusion:</label>
        <input defaultValue="Negative for intraepithelial lesion or malignancy" />
      </div>

      <h3 className="section-title">Doctor's Remarks</h3>
      <div className="row">
        <label>Note:</label>
        <textarea defaultValue="Cervical cytology is a screening test. Regular follow-up recommended." />
      </div>

      <div className="footer">
        <p>Dr. Shahseena Abdulla – Assistant Professor</p>
        <p>Dr. Karpagam Janardhan – Professor</p>
        <p>Checked By: Mrs. Sharmila. R (Technician)</p>
      </div>

      <p className="end-note">* End of Report *</p>
    </div>
  );
};

export default MedicalReport;
