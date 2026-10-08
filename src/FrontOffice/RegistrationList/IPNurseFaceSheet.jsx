import React, { useState, useEffect, useRef, useCallback } from "react";
import './IPNurseFaceSheet.css';
import { useDispatch, useSelector } from "react-redux";

import { useReactToPrint } from "react-to-print";
import { TextField } from "@mui/material";

const PrintContent = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} id="reactprintcontent">
      {props.children}
    </div>
  );
});

const IPNurseFaceSheet = ({rowData}) => {
      const printRef = useRef();
      console.log(rowData,'rowData----1');
      console.log(rowData?.PatientId,'rowDataPatientId----1');
      console.log(rowData?.AdmissionPurpose,'AdmissionPurpose----1');
      const addressRef = useRef();
      const [printAddress, setPrintAddress] = useState("");

      const componentRef = useRef();
      const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);

        const handlePrint2 = useReactToPrint({
          content: () => componentRef.current,
      
          onAfterPrint: async () => {
            // Additional action after printing, if needed
          },
        });
      const Submitalldata = () => {
        setIsPrintButtonVisible(false);
        const address = addressRef.current?.value;
        setPrintAddress(address);
        console.log("Typed Address:", address);
        setTimeout(() => {
          handlePrint2();
          setIsPrintButtonVisible(true); // Resetting print button visibility
        }, 800);
    
    
      };

  return (

    <>
      {isPrintButtonVisible ? (
        <>
          <div className="face-sheet-container">
            <div className="header_FaceSheet">
              <h2 className="title_FaceSheet">FACE SHEET</h2>
              {/* <div className="logo_FaceSheet">
                <img src="/api/placeholder/150/50" alt="Sukraa Logo" />
              </div> */}
            </div>

            <table className="registration-table_FaceSheet">
              <tbody>
                <tr>
                  <td className="label_FaceSheet">Registration No</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.PatientId}</td>
                  <td className="label_FaceSheet">IPD No</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.RegistrationId}</td>
                </tr>
                <tr>
                  <td className="label_FaceSheet">Admission Date</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.AdmissionDate}</td>
                  <td className="label_FaceSheet">Admission Time</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.AdmissionTime}</td>
                </tr>
              </tbody>
            </table>

            <h3 className="section-title">Patient Details</h3>

            <table className="patient-details-table_FaceSheet">
              <tbody>
                <tr>
                  <td className="label_FaceSheet">Patient Name</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.PatientName}</td>
                  <td className="label_FaceSheet">Patient Category</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.PatientCategory}</td>
                </tr>
                <tr>
                  <td className="label_FaceSheet">Age / Gender</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Age}/{rowData?.Gender}</td>
                  <td className="label_FaceSheet">Ward</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.WardName}</td>
                </tr>
                <tr>
                  <td className="label_FaceSheet">FatherName</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Fathername}</td>
                  <td className="label_FaceSheet">SpouseName</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Spousename}</td>
                </tr>
                <tr>
                  <td className="label_FaceSheet">Address</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Address}</td>
                  <td className="label_FaceSheet">Class</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.PatientType}</td>
                </tr>
                <tr>
                <td className="label_FaceSheet">Nationality</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Nationality}</td>
                  <td className="label_FaceSheet">Type of Admission</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.AdmissionPurpose}</td>
                </tr>
                <tr>
                <td className="label_FaceSheet">Marital Status</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.MaritalStatus}</td>
                  <td className="label_FaceSheet">Admitting Diagnosis</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Complaint}</td>
                </tr>
            
                <tr>
                  <td className="label_FaceSheet">Phone / Mobile No</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.PhoneNo}</td>
                  <td className="label_FaceSheet">Allergies</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet"></td>
                </tr>
                <tr>
                  <td className="label_FaceSheet">Occupation</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Occupation}</td>
                  <td className="label_FaceSheet">Date of Discharge</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet"></td>
                </tr>
                <tr>
                  <td className="label_FaceSheet">Code Status</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">Full / DNR / DNI</td>
                  <td className="label_FaceSheet">Final Diagnosis</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet"></td>
                </tr>
                <tr>
        <td className="label_FaceSheet" colSpan="1">Others</td>
        <td className="colon_FaceSheet">:</td>
        <td className="value_FaceSheet" colSpan="4"></td>
      </tr>
      <tr>
        <td className="label_FaceSheet" colSpan="1">Plan of Management</td>
        <td className="colon_FaceSheet">:</td>
        <td className="value_FaceSheet" colSpan="4"></td>
      </tr>
      <tr>
        <td className="label_FaceSheet" colSpan="1">Chemo Schedule</td>
        <td className="colon_FaceSheet">:</td>
        <td className="value_FaceSheet" colSpan="4"></td>
      </tr>
      <tr>
        <td className="label_FaceSheet" colSpan="1">No of Days of Stay</td>
        <td className="colon_FaceSheet">:</td>
        <td className="value_FaceSheet" colSpan="4"></td>
      </tr>
      <tr>
        <td className="label_FaceSheet" colSpan="1">Provisional Package Amount</td>
        <td className="colon_FaceSheet">:</td>
        <td className="value_FaceSheet" colSpan="4"></td>
      </tr>
      <tr>
        <td className="label_FaceSheet" colSpan="1">Additional Remarks</td>
        <td className="colon_FaceSheet">:</td>
        <td className="value_FaceSheet" colSpan="4"></td>
      </tr>
              </tbody>
            </table>

            <h3 className="section-title-FaceSheet">EMERGENCY CONTACT INFORMATION</h3>
            <table className="emergency-contact-table">
              <tbody>
                <tr>
                  <td className="label_FaceSheet">Name</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.NextToKinName}</td>
                  <td className="label_FaceSheet">Relationship</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Relation}</td>
                </tr>
                <tr>
                  <td className="label_FaceSheet">Address</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">
                    <textarea
                      type="text"
                      ref={addressRef}
                      // value={formData.address}
                      // onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="form-control"
                    />
                  </td>
                  <td className="label_FaceSheet">Contact No</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.RelativePhoneNo}</td>
                </tr>
              </tbody>
            </table>
      <br />
            <table className="doctor-info-table">
              <tbody>
                <tr>
                  <td className="label_FaceSheet">Admitted Under C/O</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.PrimaryDoctor || rowData?.DoctorName}</td>
                  <td className="label_FaceSheet">Department</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Specialization}</td>
                </tr>
                <tr>
                  <td className="label_FaceSheet">Referring Doctor / Hospital</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet" colSpan='4'>{rowData?.ReferredBy}</td>
                  
                </tr>
              </tbody>
            </table>

            <h3 className="section-title-FaceSheet ">ADMISSION CONSENT</h3>
            <div className="consent-text">
              <p>1. I agree to admit myself/my patient <strong>{rowData?.PatientName}</strong> in this hospital and agree in performing medical procedures (e.g. Medicine administration, investigation, diagnosis, assessment, would dressing & other necessary treatment) with or without sedation that may be required during the course of treatment. 2. I agree to give consent to the hospital and its physicians, medical staff, registered nurses, other staff and medical & the nursing students to provide and perform procedure. 3. I agree to be solely responsible for myself/my patient and shall not claim/accuse to the hospital and hospital staffs for any unforeseen circumstances, events and complications during the patient treatment. 4. I/My patient do not have any valuables to declare.</p>
              <p className="non-english-text">१. म /मेरो {rowData?.PatientName} लाई यस अस्पतालमा भर्ना भई आवश्यक चिकित्सा प्रक्रिया जस्तै रक्तसंचार, मरमपट्टि र टाँका सम्बन्धि तथा अन्य उपचार प्रक्रियाका लागि आवश्यकता अनुसार बेहोस गराई वा नगराई गर्न/गराउन सहमत छु। २. यस अस्पतालको चिकित्सक, चिकित्सक टोली, नर्स, अन्य कर्मचारी, चिकित्सक एवं नर्सिंग छात्र /छात्राहरुलाई उपचार प्रक्रिया प्रदान गर्न मेरो/मेरो बिरामीको लागि सहमति छु। ३. म/मेरो बिरामीको उपचार प्रक्रियाको क्रममा कुनै अनियन्त्रित घटना घटेपरेका अवस्था अड्कउको खण्डमा त्यसको जिम्मेवारी स्वयं लिनेछु र यस अस्पतालमा कार्यरत कर्मचारी उपर कुनै प्रकारको दावि परासारोप र जुनसु चासुर गर्ने छैन भनि सहमति जनाउँछु। ४. म/मेरो बिरामी संग कुन मुल्यवान समामान छैन भनि जानकारी गर्दछु।</p>
            </div>

            <div className="signature-section">
              <div className="signature-block">
                <table>
                  <tbody>
                    <tr>
                      <td className="label_FaceSheet">Name</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.NextToKinName}</td>
                    </tr>
                    <tr>
                      <td className="label_FaceSheet">Relation</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.Relation}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="signature-line">
                  <p>Signature of Patient / Patient's relative</p>
                  <p>Contact No : {rowData?.RelativePhoneNo}

                  </p>

                </div>
                {/* <div className="contact-line">
                </div> */}
              </div>
            </div>

            <table className="doctor-info-table">
              <thead>
                  <tr>
                      <th className="section-heading">Duty Medical Officer/Registrar</th>
                      <th className="section-heading">Consultant</th>
                  </tr>

              </thead>
              <tbody>
                {/* <tr>
                  <td ></td>
                  <td className="section-heading"></td>
                </tr> */}
                <tr>
                  <td className="label_FaceSheet">Full Name : {rowData?.DrInchargeAtTimeOfAdmission}</td>
                  
                  <td className="label_FaceSheet">Full Name :</td>
                </tr>
                <tr>
                  <td className="form-field">Signature :</td>
                  <td className="form-field">Signature :</td>
                </tr>
              </tbody>
            </table>

            <h3 className="section-title-FaceSheet">MEDICO LEGAL CASE</h3>
            <table className="medico-legal-table">
              <tbody>
                <tr>
                  <td className="label_FaceSheet">Informed by</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet"></td>
                  <td className="label_FaceSheet">Officer Name</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet"></td>
                </tr>
                <tr>
                  <td className="label_FaceSheet">Police Station Location</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet" colSpan="4"></td>
                </tr>
              </tbody>
            </table>
          </div>


          {isPrintButtonVisible && (
              <div className="Main_container_Btn">
              
                <button onClick={Submitalldata}>Print</button>
              </div>
            )}

          <br/>
          <br/>

        </>

      ) : (
          <>


            <PrintContent
              ref={componentRef}
              // key={pageIndex}
              style={{
                // marginTop: "50px",
                display: "flex",
                justifyContent: "center",
              }}
            >

              <div className="face-sheet-container">
                <div className="header_FaceSheet">
                  <h2 className="title_FaceSheet">FACE SHEET</h2>
                  {/* <div className="logo_FaceSheet">
                    <img src="/api/placeholder/150/50" alt="Sukraa Logo" />
                  </div> */}
                </div>

                <table className="registration-table_FaceSheet">
                  <tbody>
                    <tr>
                      <td className="label_FaceSheet">Registration No</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.PatientId}</td>
                      <td className="label_FaceSheet">IPD No</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.RegistrationId}</td>
                    </tr>
                    <tr>
                      <td className="label_FaceSheet">Admission Date</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.AdmissionDate}</td>
                      <td className="label_FaceSheet">Admission Time</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.AdmissionTime}</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="section-title">Patient Details</h3>

                <table className="patient-details-table_FaceSheet">
                  <tbody>
                    <tr>
                      <td className="label_FaceSheet">Patient Name</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.PatientName}</td>
                      <td className="label_FaceSheet">Patient Category</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.PatientCategory}</td>
                    </tr>
                    <tr>
                      <td className="label_FaceSheet">Age / Gender</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.Age}/ {rowData?.Gender}</td>
                      <td className="label_FaceSheet">Ward</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.WardName}</td>
                    </tr>
                    <tr>
                  <td className="label_FaceSheet">FatherName</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Fathername}</td>
                  <td className="label_FaceSheet">SpouseName</td>
                  <td className="colon_FaceSheet">:</td>
                  <td className="value_FaceSheet">{rowData?.Spousename}</td>
                </tr>
                    <tr>
                      <td className="label_FaceSheet">Address</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.Address}</td>
                      <td className="label_FaceSheet">Class</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.PatientType}</td>
                    </tr>
                    <tr>
                    <td className="label_FaceSheet">Nationality</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.Nationality}</td>
                      <td className="label_FaceSheet">Type of Admission</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.AdmissionPurpose}</td>
                    </tr>
                    <tr>
                    <td className="label_FaceSheet">Marital Status</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.MaritalStatus}</td>
                      <td className="label_FaceSheet">Admitting Diagnosis</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.Complaint}</td>
                    </tr>
                
                    <tr>
                      <td className="label_FaceSheet">Phone / Mobile No</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.PhoneNo}</td>
                      <td className="label_FaceSheet">Allergies</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet"></td>
                    </tr>
                    <tr>
                      <td className="label_FaceSheet">Occupation</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.Occupation}</td>
                      <td className="label_FaceSheet">Date of Discharge</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet"></td>
                    </tr>
                    <tr>
                      <td className="label_FaceSheet">Code Status</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">Full / DNR / DNI</td>
                      <td className="label_FaceSheet">Final Diagnosis</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet"></td>
                    </tr>
                    <tr>
            <td className="label_FaceSheet" colSpan="1">Others</td>
            <td className="colon_FaceSheet">:</td>
            <td className="value_FaceSheet" colSpan="4"></td>
          </tr>
          <tr>
            <td className="label_FaceSheet" colSpan="1">Plan of Management</td>
            <td className="colon_FaceSheet">:</td>
            <td className="value_FaceSheet" colSpan="4"></td>
          </tr>
          <tr>
            <td className="label_FaceSheet" colSpan="1">Chemo Schedule</td>
            <td className="colon_FaceSheet">:</td>
            <td className="value_FaceSheet" colSpan="4"></td>
          </tr>
          <tr>
            <td className="label_FaceSheet" colSpan="1">No of Days of Stay</td>
            <td className="colon_FaceSheet">:</td>
            <td className="value_FaceSheet" colSpan="4"></td>
          </tr>
          <tr>
            <td className="label_FaceSheet" colSpan="1">Provisional Package Amount</td>
            <td className="colon_FaceSheet">:</td>
            <td className="value_FaceSheet" colSpan="4"></td>
          </tr>
          <tr>
            <td className="label_FaceSheet" colSpan="1">Additional Remarks</td>
            <td className="colon_FaceSheet">:</td>
            <td className="value_FaceSheet" colSpan="4"></td>
          </tr>
                  </tbody>
                </table>

                <h3 className="section-title-FaceSheet">EMERGENCY CONTACT INFORMATION</h3>
                <table className="emergency-contact-table">
                  <tbody>
                    <tr>
                      <td className="label_FaceSheet">Name</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.NextToKinName}</td>
                      <td className="label_FaceSheet">Relationship</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.Relation}</td>
                    </tr>
                    <tr>
                      <td className="label_FaceSheet">Address</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{printAddress}</td>
                      <td className="label_FaceSheet">Contact No</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.RelativePhoneNo}</td>
                    </tr>
                  </tbody>
                </table>
          <br />
                <table className="doctor-info-table">
                  <tbody>
                    <tr>
                      <td className="label_FaceSheet">Admitted Under C/O</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.PrimaryDoctor || rowData?.DoctorName}</td>
                      <td className="label_FaceSheet">Department</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet">{rowData?.Specialization}</td>
                    </tr>
                    <tr>
                      <td className="label_FaceSheet">Referring Doctor / Hospital</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet" colSpan='4'>{rowData?.ReferredBy}</td>
                      
                    </tr>
                  </tbody>
                </table>

                <h3 className="section-title-FaceSheet ">ADMISSION CONSENT</h3>
                <div className="consent-text">
                  <p>1. I agree to admit myself/my patient <strong>{rowData?.PatientName}</strong> in this hospital and agree in performing medical procedures (e.g. Medicine administration, investigation, diagnosis, assessment, would dressing & other necessary treatment) with or without sedation that may be required during the course of treatment. 2. I agree to give consent to the hospital and its physicians, medical staff, registered nurses, other staff and medical & the nursing students to provide and perform procedure. 3. I agree to be solely responsible for myself/my patient and shall not claim/accuse to the hospital and hospital staffs for any unforeseen circumstances, events and complications during the patient treatment. 4. I/My patient do not have any valuables to declare.</p>
                  <p className="non-english-text">१. म /मेरो {rowData?.PatientName} लाई यस अस्पतालमा भर्ना भई आवश्यक चिकित्सा प्रक्रिया जस्तै रक्तसंचार, मरमपट्टि र टाँका सम्बन्धि तथा अन्य उपचार प्रक्रियाका लागि आवश्यकता अनुसार बेहोस गराई वा नगराई गर्न/गराउन सहमत छु। २. यस अस्पतालको चिकित्सक, चिकित्सक टोली, नर्स, अन्य कर्मचारी, चिकित्सक एवं नर्सिंग छात्र /छात्राहरुलाई उपचार प्रक्रिया प्रदान गर्न मेरो/मेरो बिरामीको लागि सहमति छु। ३. म/मेरो बिरामीको उपचार प्रक्रियाको क्रममा कुनै अनियन्त्रित घटना घटेपरेका अवस्था अड्कउको खण्डमा त्यसको जिम्मेवारी स्वयं लिनेछु र यस अस्पतालमा कार्यरत कर्मचारी उपर कुनै प्रकारको दावि परासारोप र जुनसु चासुर गर्ने छैन भनि सहमति जनाउँछु। ४. म/मेरो बिरामी संग कुन मुल्यवान समामान छैन भनि जानकारी गर्दछु।</p>
                </div>

                <div className="signature-section">
                  <div className="signature-block">
                    <table>
                      <tbody>
                        <tr>
                          <td className="label_FaceSheet">Name</td>
                          <td className="colon_FaceSheet">:</td>
                          <td className="value_FaceSheet">{rowData?.NextToKinName}</td>
                        </tr>
                        <tr>
                          <td className="label_FaceSheet">Relation</td>
                          <td className="colon_FaceSheet">:</td>
                          <td className="value_FaceSheet">{rowData?.Relation}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="signature-line">
                      <p>Signature of Patient / Patient's relative</p>
                      <p>Contact No : {rowData?.RelativePhoneNo}</p>

                    </div>
                    {/* <div className="contact-line">
                    </div> */}
                  </div>
                </div>

                <table className="doctor-info-table">
                  <thead>
                      <tr>
                          <th className="section-heading">Duty Medical Officer/Registrar</th>
                          <th className="section-heading">Consultant</th>
                      </tr>

                  </thead>
                  <tbody>
                    {/* <tr>
                      <td ></td>
                      <td className="section-heading"></td>
                    </tr> */}
                    <tr>
                      <td className="label_FaceSheet">Full Name : {rowData?.DrInchargeAtTimeOfAdmission}</td>
                      
                      <td className="label_FaceSheet">Full Name :</td>
                    </tr>
                    <tr>
                      <td className="form-field">Signature :</td>
                      <td className="form-field">Signature :</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="section-title-FaceSheet">MEDICO LEGAL CASE</h3>
                <table className="medico-legal-table">
                  <tbody>
                    <tr>
                      <td className="label_FaceSheet">Informed by</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet"></td>
                      <td className="label_FaceSheet">Officer Name</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet"></td>
                    </tr>
                    <tr>
                      <td className="label_FaceSheet">Police Station Location</td>
                      <td className="colon_FaceSheet">:</td>
                      <td className="value_FaceSheet" colSpan="4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </PrintContent>
            </>
          )}
          </> 
        );
}

export default IPNurseFaceSheet;