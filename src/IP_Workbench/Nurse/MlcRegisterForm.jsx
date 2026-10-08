import React, { useState, useEffect,useRef} from 'react'
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './jeeva.css';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from "react-signature-canvas"; // Import SignatureCanvas
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';


const MlcRegisterForm = () => {

    const [gridData, setGridData] = useState([]);
    const [HospitalData, setHospitalData] = useState([]);
    const [HospitalDetailedData, setHospitalDetailedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isContentReady, setIsContentReady] = useState(false);
    const [pdfBlob, setPdfBlob] = useState(null);
    const printContentRef = useRef(null);
    const signatureRef = useRef(null);
    const [formattedDate, setFormattedDate] = useState('');
   
    const moSignatureRef = useRef(null);
    const consultantSignatureRef = useRef(null);


    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation || {});
    console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');
    

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
   
    useEffect(() => {
        const currDate = IP_DoctorWorkbenchNavigation?.CurrDate;
        if (currDate) {
            const [day, month, year] = currDate.split('-');
            const formatted = `20${year}-${month}-${day}`; // Assuming the year is in the 2000s
            setFormattedDate(formatted);
        }
    }, [IP_DoctorWorkbenchNavigation]);

    useEffect(() => {

        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;
  
        
        if (RegistrationId) {
          axios.get(`${UrlLink}Ip_Workbench/IP_Mlc_Details_Link`,{
            params:{
              RegistrationId: RegistrationId,
              DepartmentType: departmentType,
              
  
            }})
              .then((res) => {
                  const ress = res.data
                  console.log(ress)
                  setGridData(ress)
      
              })
              .catch((err) => {
                  console.log(err);
              })
        }
      }, [UrlLink,IP_DoctorWorkbenchNavigation])
    
    // Check if content is ready for printing
    useEffect(() => {
      const printContent = document.getElementById("reactprintcontent");
      setIsContentReady(!!printContent);
    }, [gridData]); // Depend on gridData to check if content has updated
  
    // Print functionality
    const handlePrint = useReactToPrint({
      content: () => document.getElementById("reactprintcontent"),
    //   content: () => printContentRef.current,
      onBeforePrint: () => {
        console.log("Before");
        if (!isContentReady) {
          // Content is not ready, prevent printing
          throw new Error("Content is not ready for printing");
        }
      },
      onAfterPrint: async () => {
        console.log("After");
        const printdata = document.getElementById("reactprintcontent");
        console.log("printdata", printdata);
        try {
            if (printdata) {
                const contentWidth = printdata.offsetWidth;
                const contentHeight = printdata.offsetHeight;
                const pdf = new jsPDF("p", "px", [contentWidth, contentHeight]); // Define a PDF instance with 'portrait' orientation and 'A4' size
            // const pdf = new jsPDF("p", "px", [printContentRef.current.offsetWidth, printContentRef.current.offsetHeight]);
                pdf.html(printdata, {
                callback: () => {
                const generatedPdfBlob = pdf.output("blob");
                setPdfBlob(generatedPdfBlob);
                console.log("PDF generated successfully", generatedPdfBlob);
                },
            });
        } else {
            throw new Error("Unable to get the target element");
          }
        } catch (error) {
          console.error("Error generating PDF:", error);
        }
      },
    });
  
    // Clear signature functionality
    
    // const clearSignature = () => {
    //   signatureRef.current.clear();
    // };
  
    const clearSignature = (ref) => {
        ref.current.clear();
    };

    const saveSignature = (ref) => {
        const signatureData = ref.current.toDataURL();
        console.log("Signature saved:", signatureData);
        // You can send `signatureData` to your backend or store it as needed
    };

    // Log save signature (implement your save logic as needed)
    // const saveSignature = () => {
    //     const signatureData = signatureRef.current.toDataURL();
    //   console.log("Signature saved");
    // };
  
    // Handle changes in form inputs
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormattedDate(e.target.value);
      // Logic to handle changes in the form inputs (you need to implement this)
    };
    useEffect(() => {
        axios
        .get(`${UrlLink}/Masters/Hospital_Detials_link`)
        .then((res) => {
            const ress = res.data;
            console.log(res);
            setHospitalData(ress);
        })
        .catch((err) => {
            console.log(err);
        });
        
      }, [ UrlLink]);

    useEffect(() => {
        axios
        .get(`${UrlLink}/Masters/Clinic_Detials_link`)
        .then((res) => {
            const ress = res.data;
            console.log(res);
            setHospitalDetailedData(ress);
        })
        .catch((err) => {
            console.log(err);
        });
        
      }, [ UrlLink]);
    
    


  return (
    <>
      <div className="Main_container_app case_sheet_consent " id="reactprintcontent" >
        <br />
        <div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', alignItems: 'center' }}>
            <h2>MLC Register Format</h2><br />

          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', alignItems: 'center' }}>
            <h2>{HospitalData.hospitalName} </h2>
            <h5>
                {HospitalDetailedData?.[0]?.DoorNo} {HospitalDetailedData?.[0]?.Street}, {HospitalDetailedData?.[0]?.Area}, {HospitalDetailedData?.[0]?.City}, {HospitalDetailedData?.[0]?.State} - {HospitalDetailedData?.[0]?.Pincode}
            </h5>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', alignItems: 'center' }}>
            <h5>YOUR ONLY DEFENCE, IN THE COURT OF LAW, IS YOUR RECORDS, SO THEY MUST BE UP-TO-DATE</h5>
          </div>
        </div>

        <div className="RegisFormcon_consent_consent">


          <div className="RegisForm_1_consent_consent">
            <label htmlFor="MlcNo">
              M.L.C. NO<span>:</span>
            </label>
            <input
              type="text"
              id="MlcNo"
              name="MlcNo"
              value={gridData?.[0]?.MlcNo}
              onChange={handleChange}
              required
            />

          </div>

          <div className="RegisForm_1_consent_consent">
            <label htmlFor="IndoorOpdNo">
              INDOOR/O.P.D.No<span>:</span>
            </label>
            <input
              type="text"
              id="IndoorOpdNo"
              name="IndoorOpdNo"
              value={IP_DoctorWorkbenchNavigation?.RegistrationId}
              onChange={handleChange}
              required
            />

          </div>

          <div className="RegisForm_1_consent_consent">
            <label htmlFor="ExamineDate">
              Examination Date<span>:</span>
            </label>
            <input
              type="date"
              id="ExamineDate"
              name="ExamineDate"
              value={gridData?.[0]?.ExaminationDate}
              onChange={handleChange}
              required
            />

          </div>

          <div className="RegisForm_1_consent_consent">
            <label htmlFor="ExamineTime">
              Examination Time<span>:</span>
            </label>
            <input
              type="time"
              id="ExamineTime"
              name="ExamineTime"
              value={gridData?.[0]?.ExaminationTime}
              onChange={handleChange}
              required
            />

          </div>

        </div>



        <div className="RegisFormcon_consent_consent">
          <div className="RegisForm_1_consent_consent">
            <label htmlFor="Name">
              Name <span>:</span>
            </label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={IP_DoctorWorkbenchNavigation.PatientName}
              onChange={handleChange}
              required
            // style={{width: '100px'}}
            />
          </div>

          <div className="RegisForm_1_consent_consent">
            <label htmlFor="Age">
              Age<span>:</span>
            </label>
            <input
              type="text"
              id="Age"
              name="Age"
              value={IP_DoctorWorkbenchNavigation.Age}
              onChange={handleChange}
              required
            // style={{width: '100px'}}

            />
          </div>
          <div className="RegisForm_1_consent_consent">
                <label>
                    Gender <span>:</span>
                </label>
                <div className="RegisForm_1_consent_consent_radiooo_head35r">
                    <div className="RegisForm_1_consent_consent_radiooo female4d">
                    <input
                        className="consent_consent_radiooo_inputt"
                        type="radio"
                        id="male"
                        name="gender"
                        value="Male"
                        checked={IP_DoctorWorkbenchNavigation?.Gender === "Male"}
                        onChange={handleChange}
                    />
                    <label htmlFor="male"> Male </label>
                    </div>
                    <div className="RegisForm_1_consent_consent_radiooo female4eed">
                    <input
                        className="consent_consent_radiooo_inputt"
                        type="radio"
                        id="female"
                        name="gender"
                        value="Female"
                        checked={IP_DoctorWorkbenchNavigation?.Gender === "Female"}
                        onChange={handleChange}
                    />
                    <label htmlFor="female"> Female </label>
                    </div>
                    <div className="RegisForm_1_consent_consent_radiooo transgender98">
                    <input
                        type="radio"
                        id="transgender"
                        name="gender"
                        value="Transgender"
                        className="consent_consent_radiooo_inputt"
                        checked={IP_DoctorWorkbenchNavigation?.Gender === "Transgender"}
                        onChange={handleChange}
                    />
                    <label htmlFor="transgender"> Transgender </label>
                    </div>
                </div>
            </div>

        </div>

        <div className="RegisFormcon_consent_consent" style={{ textAlign: 'left' }}>

          <div className="RegisForm_1_consent_consent">
            <label>
              Address <span>:</span>
            </label>
            <textarea
              name="Address"
              value={IP_DoctorWorkbenchNavigation.Address}
              onChange={handleChange}
              required
            ></textarea>
          </div>


        </div>

        <div className="RegisFormcon_consent_consent">
          <div className="RegisForm_1_consent_consent" >
            <label htmlFor="Referred">
              By whom brought/referred(Name & Address) <span>:</span>
            </label>
            <textarea
              name="Referred"
              value={gridData?.[0]?.InformedBroughtBy}
              onChange={handleChange}
              required
            ></textarea>

          </div>
        </div>

        <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent">
                <label htmlFor="Identification">
                    Identification Marks <span>:</span>
                </label>
                <textarea
                    name="Identification"
                    value={ `1.${gridData?.[0]?.IdentificationMarkOne || ''} \n2.${gridData?.[0]?.IdentificationMarkTwo || ''}`}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
        </div>


        <div className="RegisFormcon_consent_consent">
          <div className="RegisForm_1_consent_consent" >
            <label htmlFor="LhtiOfPatient">
              L.H.T.I. of the Patient <span>:</span>
            </label>
            <textarea
              name="LhtiOfPatient"
              value={gridData.LhtiOfPatient}
              onChange={handleChange}
              required
            ></textarea>

          </div>
        </div>


        <div className="RegisFormcon_consent_consent">
          <div className="RegisForm_1_consent_consent" >
            <label htmlFor="HistoryAndAlleged">
              History and alleged cause of injury <span>:</span>
            </label>
            <textarea
              name="HistoryAndAlleged"
              value={gridData?.[0]?.InjuryType}
              onChange={handleChange}
              required
            ></textarea>

          </div>
        </div>

        <div className="RegisFormcon_consent_consent">
          <div className="RegisForm_1_consent_consent" >
            <label htmlFor="DetailsOfInjuries">
              Details of Injuries / Clinical Features <span>:</span>
            </label>
            <textarea
              name="DetailsOfInjuries"
              value={gridData?.[0]?.InjuryDetails}
              onChange={handleChange}
              required
            ></textarea>

          </div>
        </div>

        <div className="RegisFormcon_consent_consent">
          <div className="RegisForm_1_consent_consent" >
            <label htmlFor="RadiologicalInvestigation">
              Radiological Investigations <span>:</span>
            </label>
            <textarea
              name="RadiologicalInvestigation"
              value={gridData?.[0]?.InvestigationDetails}
              onChange={handleChange}
              required
            ></textarea>

          </div>
        </div>

        <div className="RegisFormcon_consent_consent">
          <div className="RegisForm_1_consent_consent" >
            <label htmlFor="FinalDiagnosis">
              Final Diagnosis<span>:</span>
            </label>
            <textarea
              name="FinalDiagnosis"
              value={gridData?.[0]?.FinalDiagnosis}
              onChange={handleChange}
              required
            ></textarea>

          </div>
        </div>

        {/* Design align */}
        <br />
        <h4
          style={{ display: 'flex', justifyContent: 'center', padding: '10px', alignItems: 'center' }}>
          Date of Admission
        </h4>

        <div className="edewdce dssxxsssa">
          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="DateOfAdmission">
                Admission Date<span>:</span>
              </label>
              <input
                type="date"
                id="DateOfAdmission"
                name="DateOfAdmission"
                value={formattedDate}

                // value={IP_DoctorWorkbenchNavigation?.CurrDate}
                onChange={handleChange}
                required
              />

            </div>
          </div>

          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="AdDate">
                Date<span>:</span>
              </label>
              <input
                type="date"
                id="AdDate"
                name="AdDate"
                value={gridData.AdDate}
                onChange={handleChange}
                required
              />

            </div>
          </div>

          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="AdTime">
                Time<span>:</span>
              </label>
              <input
                type="time"
                id="AdTime"
                name="AdTime"
                value={gridData.AdTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="PoliceStation">
                Police Station<span>:</span>
              </label>
              <input
                type="text"
                id="PoliceStation"
                name="PoliceStation"
                value={gridData?.[0]?.PoliceStationName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="ConstableName">
                Constable's Name<span>:</span>
              </label>
              <input
                type="text"
                id="ConstableName"
                name="ConstableName"
                value={gridData.ConstableName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="BuckleNo">
                Buckle No<span>:</span>
              </label>
              <input
                type="text"
                id="BuckleNo"
                name="BuckleNo"
                value={gridData.BuckleNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <br />

          <div className="jwhyw66w4">
            <div className="sigCanvas2_head11 uwytywe6262309" style={{ justifyContent: 'center' }} >
                <div className="" >
                <div>
                    <SignatureCanvas
                    ref={signatureRef}
                    penColor="black"
                    canvasProps={{
                        width: 190,
                        height: 100,
                        className: "sigCanvas2",
                    }}
                    />
                </div>
                <h5
                    style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>Signature of MO</h5>

                <div className="Register_btn_con">
                    <button className="RegisterForm_1_btns" onClick={() => clearSignature(signatureRef)}>
                    Clear
                    </button>
                    <button className="RegisterForm_1_btns" onClick={() => saveSignature(signatureRef)}>
                    Save
                    </button>
                </div>

                </div>


            </div>
          </div>
        </div>




        {/* End */}

        {/*start Align Right Side */}
<br />
        <h4
          style={{ display: 'flex', justifyContent: 'center', padding: '10px', alignItems: 'center' }}>
          Date of Discharge
        </h4>
        <div className="edewdce">
          <div className="RegisFormcon_consent_consent ">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="DateOfDischarge">
                Date of Discharge<span>:</span>
              </label>
              <input
                type="date"
                id="DateOfDischarge"
                name="DateOfDischarge"
                value={formattedDate}
                // value={IP_DoctorWorkbenchNavigation?.CurrDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="DisDate">
                Date<span>:</span>
              </label>
              <input
                type="date"
                id="DisDate"
                name="DisDate"
                value={gridData.DisDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="DisTime">
                Time<span>:</span>
              </label>
              <input
                type="time"
                id="DisTime"
                name="DisTime"
                value={gridData.DisTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="DisPoliceStation">
                Police Station<span>:</span>
              </label>
              <input
                type="text"
                id="DisPoliceStation"
                name="DisPoliceStation"
                value={gridData?.[0]?.PoliceStationName}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="DisConstable">
                Constable's Name<span>:</span>
              </label>
              <input
                type="text"
                id="DisConstable"
                name="DisConstable"
                value={gridData.DisConstable}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="DisBuckleNo">
                Buckle No<span>:</span>
              </label>
              <input
                type="text"
                id="DisBuckleNo"
                name="DisBuckleNo"
                value={gridData.DisBuckleNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>
<br />
        <div className="jwhyw66w4">
          <div className="sigCanvas2_head11 uwytywe6262309" >
            <div className="" >
              <div>
                <SignatureCanvas
                  ref={moSignatureRef}
                  penColor="black"
                  canvasProps={{
                    width: 190,
                    height: 100,
                    className: "sigCanvas2",
                  }}
                />
              </div>
              <h5 style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>Signature of MO</h5>

              <div className="Register_btn_con">
                <button className="RegisterForm_1_btns" onClick={() => clearSignature(moSignatureRef)}>
                  Clear
                </button>
                <button className="RegisterForm_1_btns" onClick={() => saveSignature(moSignatureRef)}>
                  Save
                </button>
              </div>

            </div>


          </div>

          <div className="sigCanvas2_head11 uwytywe6262309" >
            <div className="" >
              <div>
                <SignatureCanvas
                  ref={consultantSignatureRef}
                  penColor="black"
                  canvasProps={{
                    width: 190,
                    height: 100,
                    className: "sigCanvas2",
                  }}
                />
              </div>
              <h5 style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>Signature of Consultant</h5>

              <div className="Register_btn_con">
                <button className="RegisterForm_1_btns" onClick={() => clearSignature(consultantSignatureRef)}>
                  Clear
                </button>
                <button className="RegisterForm_1_btns" onClick={() => saveSignature(consultantSignatureRef)}>
                  Save
                </button>
              </div>

            </div>


          </div>

          </div>

          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="ConName">
                Name<span>:</span>
              </label>
              <input
                type="text"
                id="ConName"
                name="ConName"
                value={gridData.ConName}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          <div className="RegisFormcon_consent_consent">
            <div className="RegisForm_1_consent_consent" >
              <label htmlFor="ConRegNo">
                Reg.No<span>:</span>
              </label>
              <input
                type="text"
                id="ConRegNo"
                name="ConRegNo"
                value={gridData.ConRegNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

        </div>



        <div className="Register_btn_con">
          <button
            className="RegisterForm_1_btns printgr5"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
        <br />
      </div>
    </>
  )
}

export default MlcRegisterForm;