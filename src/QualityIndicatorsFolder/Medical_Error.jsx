import React, { useEffect, useState } from 'react';
import './MedicalErrorForm.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import Webcam from "react-webcam";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useDispatch } from 'react-redux';
import { useRef } from 'react';
import AddBoxIcon from "@mui/icons-material/AddBox";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import { ToastContainer, toast } from "react-toastify";


import DeleteIcon from "@mui/icons-material/Delete";

const MedicalErrorRegistration = ({ editId = null }) => {
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [facingMode, setFacingMode] = useState("user");
  const videoConstraints = { facingMode: facingMode };
   const [isImageCaptured1, setIsImageCaptured1] = useState(false);
   const webcamRef1 = useRef(null);
  const [deviceInfo, setDeviceInfo] = useState({
      device_type: null,
      os_type: null,
    });
  // State for the list of errors being added
  const [errorList, setErrorList] = useState([]);
  console.log('errorlist',errorList);
  
  const [showFile, setShowFile] = useState({ file1: false });
  const dispatch = useDispatch();
  // State for the current error being added
  const [currentError, setCurrentError] = useState({
    error_id: '',
    error_description: ''
  });
  
  const [patientId, setPatientId] = useState('');                             
  // Main form data state
  const [formData, setFormData] = useState({
    Patient_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    age: '',
    dob: '',
    gender: '',
    nationality: '',
    phone_no: '',
    email: '',
    doctor_name: '',
    doctor_id: '',
    date_time_of_error: '',
    medical_record_number: '',
    location: '',
    description_of_error: '',
    corrective_action_taken: '',
    recommendations_for_prevention: '',
    contributing_factors: '',
    personnel_involved: '',
    severity_of_error: '',
    outcome_for_patient: '',
    reporting_personnel: '',
    supervising_personnel: '',
    review_date: '',
    error_status: '',
    errorList: errorList || [],
    attachments: '',
  });


  console.log('formdata',formData);
  

  const [errorTypes, setErrorTypes] = useState([]);

  useEffect(() => {
    axios.get(`${UrlLink}QualityIndicators/get_medical_errors`)
      .then((res) => {
        if (res.data) {
          setErrorTypes(res.data);
        }
      })
      .catch((err) => console.error("Error fetching types:", err));
  }, []);

  const handleErrorTypeChange = (e) => {
    const selectedId = e.target.value;
    setCurrentError({
      ...currentError,
      error_id: selectedId
    });
  };

  const handleErrorDescriptionChange = (e) => {
    setCurrentError({
      ...currentError,
      error_description: e.target.value
    });
  };

  const fetchPatientData = async () => {
    if (!patientId) return alert('Enter Patient ID');
    try {
      const res = await axios.get(`${UrlLink}QualityIndicators/get_patient_details_for_QA?patient_id=${patientId}`);
      if (res.data.success) {
        const p = res.data.data;
        setFormData((prev) => ({
          ...prev,
          Patient_id: p.Patient_id || '',
          first_name: p.first_name || '',
          middle_name: p.middle_name || '',
          last_name: p.last_name || '',
          age: p.age || '',
          dob: p.dob || '',
          gender: p.gender || '',
          nationality: p.nationality || '',
          phone_no: p.phone_no || '',
          email: p.email || '',
          doctor_id: p.doctor_id || '',
          doctor_name: p.doctor_name || '',
        }));
      } else {
        alert('Patient not found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Something went wrong fetching patient data');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
  };

  const handleAddError = () => {
    if (currentError.error_id && currentError.error_description) {
      const selectedError = errorTypes.find(type => type.id === parseInt(currentError.error_id));
      
      const newError = {
        id: currentError.error_id,
        error_type: selectedError?.error_type || '',
        error_description: currentError.error_description,
        severity: selectedError?.severity || ''
      };
      
      setErrorList(prev => [...prev, newError]);
      
      // Clear the current error fields
      setCurrentError({
        error_id: '',
        error_description: ''
      });
      
      // Update the severity in the main form if this is the first error
      if (errorList.length === 0 && selectedError?.severity) {
        setFormData(prev => ({
          ...prev,
          severity_of_error: selectedError.severity
        }));
      }
    } else {
      alert('Please select an error type and enter a description.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const submissionData = {
      ...formData,
      error_list: errorList // Include the errorList here
    }
    // Prepare the data to send
    // const data = new FormData();
    
    // // Add all form data
    // for (let key in formData) {
    //   if (formData[key] !== null && formData[key] !== undefined) {
    //     data.append(key, formData[key]);
    //   }
    // }
    
    // Add the error list as JSON
    // data.append('error_list', JSON.stringify(errorList));
    
    try {
      if (editId) {
        await axios.put(`/api/medical-error-report/${editId}/`, submissionData);
        alert('Updated successfully');
      } else {
        await axios.post(`${UrlLink}QualityIndicators/create_medical_error_report`, submissionData);
       
        // Reset form
        setFormData({
          Patient_id: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          age: '',
          dob: '',
          gender: '',
          nationality: '',
          phone_no: '',
          email: '',
          doctor_name: '',
          doctor_id: '',
          date_time_of_error: '',
          medical_record_number: '',
          location: '',
          description_of_error: '',
          corrective_action_taken: '',
          recommendations_for_prevention: '',
          contributing_factors: '',
          personnel_involved: '',
          severity_of_error: '',
          outcome_for_patient: '',
          reporting_personnel: '',
          supervising_personnel: '',
          review_date: '',
          error_status: '',
          attachments: ''
        });
        setErrorList([]);

        alert('Submitted successfully');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Submission failed');
    }
  };

  const handleBack = () => navigate("/Home/QualityIndicatorsFolder");

  const handleClear = () => {
    if (window.confirm('Do you want to clear the form?')) {
      setFormData({
        Patient_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        age: '',
        dob: '',
        gender: '',
        nationality: '',
        phone_no: '',
        email: '',
        doctor_name: '',
        doctor_id: '',
        date_time_of_error: '',
        medical_record_number: '',
        location: '',
        description_of_error: '',
        corrective_action_taken: '',
        recommendations_for_prevention: '',
        contributing_factors: '',
        personnel_involved: '',
        severity_of_error: '',
        outcome_for_patient: '',
        reporting_personnel: '',
        supervising_personnel: '',
        review_date: '',
        error_status: '',
        attachments: ''
      });
      setErrorList([]);
      setCurrentError({
        error_id: '',
        error_description: ''
      });
    }
  };


  const Selectedfileview = (fileval) => {
    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: "image/jpg",
      };
      if (
        ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
          fileval?.split(",")[0]
        )
      ) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/jpeg",
        };
      } else if (fileval?.split(",")[0] === "data:image/png;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/png",
        };
      } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "application/pdf",
        };
      }

      dispatch({ type: "modelcon", value: tdata });
    } else {
      const tdata = {
        message: "There is no file to view.",
        type: "warn",
      };
      // dispatch({ type: "toast", value: tdata });
    }
  };

const handleinpchangeDocumentsForm = (e) => {
  const { name, files } = e.target;

  // Ensure that files exist and are not empty
  if (files && files.length > 0) {
    const formattedValue = files[0];

    // Optional: Add validation for file type and size
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]; // Example allowed types
    const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
    if (
      !allowedTypes.includes(formattedValue.type) ||
      formattedValue.type === ""
    ) {
      // Dispatch a warning toast or handle file type validation
      const tdata = {
        message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
        type: "warn",
      };
      // dispatch({ type: "toast", value: tdata });
    } else if (formattedValue.size > maxSize) {
      // Dispatch a warning toast or handle file size validation
      const tdata = {
        message: "File size exceeds the limit of 5MB.",
        type: "warn",
      };
      // dispatch({ type: "toast", value: tdata });
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(formattedValue);
    }
  } else {
    // Handle case where no file is selected
    const tdata = {
      message: "No file selected. Please choose a file to upload.",
      type: "warn",
    };
    // dispatch({ type: "toast", value: tdata });
  }
};
const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const handleCaptureImage1 = () => {
  if (webcamRef1.current && webcamRef1.current.getScreenshot) {
    const file = webcamRef1.current.getScreenshot();

    if (file && file.length > 0) {
      const formattedValue = dataURItoBlob(file);

      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024;

      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ""
      ) {
        const tdata = {
          message:
            "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
          type: "warn",
        };
        // dispatch({ type: "toast", value: tdata });
      } else if (formattedValue.size > maxSize) {
        const tdata = {
          message: "File size exceeds the limit of 5MB.",
          type: "warn",
        };
        // dispatch({ type: "toast", value: tdata });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prev) => ({
            ...prev,
            attachments: reader.result,
          }));
          setIsImageCaptured1(true);
        };
        reader.readAsDataURL(formattedValue);
      }
    } else {
      const tdata = {
        message:
          "Unable to capture the image. Please make sure the webcam is working.",
        type: "warn",
      };
      // dispatch({ type: "toast", value: tdata });
    }
  } else {
    console.error(
      "Webcam reference is null or getScreenshot is not available."
    );
  }
};


const switchCamera = () => {
  setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
};


const handleRecaptureImage1 = () => {
  setFormData((prev) => ({
    ...prev,
    attachments: null,
  }));
  setIsImageCaptured1(false);
};

  const handleDeleteMedicalError = (index) => {
    const updatedLeavesList = errorList.filter((_, i) => i !== index);
    setErrorList(updatedLeavesList);
  };


  return (
    <>

<div className="Main_container_app">

  
  <div className="common_center_tag">
    <span>{editId ? "Edit" : "Create"} Medical Error Report</span>
  </div>

  <div  className="RegisFormcon">
    {/* --- Patient Search --- */}
    <div className="Search_patient_icons" style={{alignContent:'center'}}>
      <div className="RegisForm_1" style={{ alignItems: 'center' }}>
        <label>Patient ID :</label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <PersonSearchIcon type="button" onClick={fetchPatientData} className="Main_container_BtnQA">Search</PersonSearchIcon>
      </div>
    </div>

    {/* --- Patient Info --- */}
    <div className="DivCenter_container">Patient Details</div>
    <div className="RegisFormcon">
      <div className="RegisForm_1">
        <label>Patient ID <span>:</span></label>
        <input type="text" name="Patient_id" value={formData.Patient_id} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>First Name <span>:</span></label>
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Middle Name <span>:</span></label>
        <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Last Name <span>:</span></label>
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Age <span>:</span></label>
        <input type="text" name="age" value={formData.age} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>DOB <span>:</span></label>
        <input type="text" name="dob" value={formData.dob} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Gender <span>:</span></label>
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Nationality <span>:</span></label>
        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Phone Number <span>:</span></label>
        <input type="text" name="phone_no" value={formData.phone_no} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Email <span>:</span></label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
    </div>

    {/* --- Doctor Info --- */}
    <div className="DivCenter_container">Doctor Information</div>
    <div className="RegisFormcon">
      <div className="RegisForm_1">
        <label>Doctor Name <span>:</span></label>
        <input type="text" name="doctor_name" value={formData.doctor_name} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Doctor ID <span>:</span></label>
        <input type="text" name="doctor_id" value={formData.doctor_id} onChange={handleChange} />
      </div>
    </div>

    {/* --- Error Info --- */}
    <div className="DivCenter_container">Medical Error Information</div>
    <div className="RegisFormcon">
      <div className="RegisForm_1">
        <label>Date & Time <span>:</span></label>
        <input type="datetime-local"  name="date_time_of_error" value={formData.date_time_of_error} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Medical Record Number <span>:</span></label>
        <input type="text" name="medical_record_number" value={formData.medical_record_number} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Location <span>:</span></label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
      </div>
    </div>

    {/* Error Type Selection */}
    <div className="RegisFormcon">
      <div className="RegisForm_1">
        <label>Error Type <span>:</span></label>
        <select
          name="error_id"
          value={currentError.error_id}
          onChange={handleErrorTypeChange}
        >
          <option value="">-- Select Error Type --</option>
          {errorTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.error_type}
            </option>
          ))}
        </select>
      </div>
      
      <div className="RegisForm_text">
        <label>Error Description <span>:</span></label>
        <textarea 
          name="error_description" 
          value={currentError.error_description} 
          onChange={handleErrorDescriptionChange}
          rows={3}
        ></textarea>
      </div>

  
       
           <AddBoxIcon onClick={handleAddError} />
      
    </div>

    {/* Table to display added Medical Errors */}

    <div className="RegisForm_text">
        {errorList.length > 0 && (
           <table
           className="selected-leave-table2"
           style={{
             tableLayout: "auto",
             width: "100%",
             borderCollapse: "collapse",
             fontFamily: "Nunito",
             fontSize: "13px",
           }}
         >
            <thead>
              <tr style={{ backgroundColor: "#E0E0E0" }}>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Medical Error Type</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Medical Error</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Severity</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {errorList.map((error, index) => (
                <tr key={index}  style={{ backgroundColor: "#F5F5F5" }}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{error.error_type}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{error.error_description}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{error.severity}</td>
                   <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                          <button
                                            onClick={() => handleDeleteMedicalError(index)}
                                            style={{ color: "red", cursor: "pointer" }}
                                          >
                                            <DeleteIcon className="check_box_clrr_cancell" />
                                          </button>
                                        </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>

    {/* --- Actions & Review --- */}
    <div className="DivCenter_container">Actions Taken & Outcome</div>
    <div className="RegisFormcon">
      <div className="RegisForm_text">
        <label>Description of Error <span>:</span></label>
        <textarea name="description_of_error" value={formData.description_of_error} onChange={handleChange}></textarea>
      </div>
      <div className="RegisForm_text">
        <label>Corrective Action Taken <span>:</span></label>
        <textarea name="corrective_action_taken" value={formData.corrective_action_taken} onChange={handleChange}></textarea>
      </div>
      <div className="RegisForm_text">
        <label>Recommendations for Prevention <span>:</span></label>
        <textarea name="recommendations_for_prevention" value={formData.recommendations_for_prevention} onChange={handleChange}></textarea>
      </div>
      <div className="RegisForm_text">
        <label>Contributing Factors <span>:</span></label>
        <textarea name="contributing_factors" value={formData.contributing_factors} onChange={handleChange}></textarea>
      </div>
      <div className="RegisForm_1">
        <label>Personnel Involved <span>:</span></label>
        <input type="text" name="personnel_involved" value={formData.personnel_involved} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Severity <span>:</span></label>
        <input type="text" name="severity_of_error" value={formData.severity_of_error} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Outcome for Patient <span>:</span></label>
        <input type="text" name="outcome_for_patient" value={formData.outcome_for_patient} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Reporting Personnel <span>:</span></label>
        <input type="text" name="reporting_personnel" value={formData.reporting_personnel} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Supervising Personnel <span>:</span></label>
        <input type="text" name="supervising_personnel" value={formData.supervising_personnel} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Review Date <span>:</span></label>
        <input type="date" name="review_date" value={formData.review_date} onChange={handleChange} />
      </div>
      <div className="RegisForm_1">
        <label>Error Status <span>:</span></label>
        
        <select name="error_status" id="error_status"value={formData.error_status} onChange={handleChange}>
          <option value="">Select</option>
<option value="On Process">On Process</option>
          <option value="cleared">Cleared</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>

    {/* --- Attachment --- */}
    <div className="RegisForm_1">
      <label>Photo <span>:</span></label>
      <div className="RegisterForm_2">
        <button
          onClick={() => setShowFile({ file1: true })}
          className="RegisterForm_1_btns choose_file_update"
        >
          <CameraAltIcon />
        </button>

        {showFile.file1 && (
          <div
            className="sideopen_showcamera_profile"
            onClick={() => setShowFile({ file1: false })}
          >
            <div
              className="newwProfiles newwPopupforreason"
              onClick={(e) => e.stopPropagation()}
            >
              {formData.Photo ? (
                <div>
                  <img
                    src={formData.Photo}
                    alt="Captured"
                    style={{ maxWidth: "75%", height: "auto" }}
                  />
                  <div className="Main_container_Btn">
                    <button onClick={handleRecaptureImage1}>Update Image</button>
                    <button onClick={() => setShowFile({ file1: false })}>Close</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <h3>Image</h3>
                  </div>
                  <div>
                    <Webcam
                      audio={false}
                      ref={webcamRef1}
                      screenshotFormat="image/jpeg"
                      mirrored={facingMode === "user"}
                      videoConstraints={videoConstraints}
                    />
                    {deviceInfo.device_type !== "mobile" && (
                      <button onClick={switchCamera}>
                        <CameraswitchIcon />
                      </button>
                    )}
                  </div>
                  <div className="Main_container_Btn">
                    <button onClick={handleCaptureImage1}>Capture</button>
                    <button onClick={() => setShowFile({ file1: false })}>Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="file"
          name="attachments"
          accept="image/jpeg, image/png, application/pdf"
          required
          id="attachments"
          autoComplete="off"
          onChange={handleinpchangeDocumentsForm}
          style={{ display: "none" }}
        />
        <div style={{ width: "87px", display: "flex", justifyContent: "flex-start", gap: "10px" }}>
          <label htmlFor="attachments" className="RegisterForm_1_btns choose_file_update">
            <PhotoCameraBackIcon />
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
          onClick={() => Selectedfileview(formData.attachments)}
          >
            <VisibilityIcon />
          </button>
          
        </div>

             
        

      </div>
    </div>
          <ToastContainer />
    
    <ModelContainer />

    <div className="Main_container_Btn" style={{ justifyContent: 'center', marginTop: '20px' }}>
      <button type="submit" onClick={handleSubmit}>Save</button>
      <button type="button" onClick={handleClear}>Clear</button>
    </div>
  </div>
  </div>
</>
   );
  
  };

 export default MedicalErrorRegistration;

