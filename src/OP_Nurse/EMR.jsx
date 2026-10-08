import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import './EMR.css';

const EMR = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatch = useDispatch();

  const DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.DoctorWorkbenchNavigation);
  const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);

  const [openModal, setOpenModal] = useState(false);
  const [isGetData, setIsGetData] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gridData, setGridData] = useState([]);

  const [formData, setFormData] = useState({
    Id: null,
    KeyComplaint: "",
    ChiefComplaint: "",
    History: "",
    Examine: "",
    Diagnosis: "",
    ChooseDocument: null,
  });

  const GeneralEvaluationColumns = [
    { key: "id", name: "S.No", width: 60 },
    { key: "created_at", name: "Date", width: 100 },
    { key: "created_by", name: "Note By", width: 100 },
    { key: "KeyComplaint", name: "Key Complaint", width: 150 },
    { key: "ChiefComplaint", name: "Chief Complaint", width: 150 },
    { key: "History", name: "History", width: 150 },
    { key: "Examine", name: "Examination", width: 150 },
    { key: "Diagnosis", name: "Diagnosis", width: 200 },
    {
      key: "action",
      name: "VIEW",
      width: 120,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => handleView(row)} color="primary" title="View">
            <VisibilityIcon />
          </IconButton>
        
        </>
      ),
    },
     {
      key: "action",
      name: "EDIT",
      width: 120,
      renderCell: ({ row }) => (
        <>
        
          <IconButton onClick={() => handleEdit(row)} color="secondary" title="Edit">
            <EditIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const fetchData = useCallback(async () => {
    try {
      const registrationId = DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId;
      if (!registrationId) return;

      setIsLoading(true);
      const response = await axios.get(`${UrlLink}Workbench/workbench_emr_evaluation`, {
        params: { RegistrationId: registrationId },
      });

      const formatted = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
        KeyComplaint: item.KeyComplaint || "No entries",
        ChiefComplaint: item.ChiefComplaint || "No entries",
        History: item.History || "No entries",
        Examine: item.Examine || "No entries",
        Diagnosis: item.Diagnosis || "No entries",
        created_at: new Date(item.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));
      setGridData(formatted);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  }, [UrlLink, DoctorWorkbenchNavigation, IP_DoctorWorkbenchNavigation]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isGetData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file?.type)) return;
    if (file?.size > maxSize) return;

    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, ChooseDocument: reader.result }));
    reader.readAsDataURL(file);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  };

  const handleView = (data) => {
    setFormData({ ...data });
    setIsViewMode(true);
    // setOpenModal(true);
  };

  const handleEdit = (data) => {
    setFormData({ ...data });
    setIsViewMode(false);
    // setOpenModal(true);
  };

  const handleClear = () => {
    setFormData({
      Id: null,
      KeyComplaint: "",
      ChiefComplaint: "",
      History: "",
      Examine: "",
      Diagnosis: "",
      ChooseDocument: null,
    });
    setIsViewMode(false);
  };

  const handleSubmit = async () => {
    if (!formData.KeyComplaint || !formData.Diagnosis) return;

    try {
      const formDataObj = new FormData();
      formDataObj.append("KeyComplaint", formData.KeyComplaint);
      formDataObj.append("ChiefComplaint", formData.ChiefComplaint);
      formDataObj.append("History", formData.History);
      formDataObj.append("Examine", formData.Examine);
      formDataObj.append("Diagnosis", formData.Diagnosis);
      formDataObj.append("created_by", userRecord?.username || "");
      formDataObj.append("RegistrationId", DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId || "");

      if (formData.ChooseDocument && formData.ChooseDocument.startsWith("data:")) {
        const blob = dataURItoBlob(formData.ChooseDocument);
        formDataObj.append("ChooseDocument", blob, "upload.jpg");
      }

      if (formData.Id) {
        formDataObj.append("Id", formData.Id);
      }

      
      const response = await axios.post(`${UrlLink}Workbench/workbench_emr_evaluation`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        handleClear();
        setIsGetData((prev) => !prev);
      } else {
        console.error("Save failed:", response.data);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleFileView = (data) => {
    if (!data) return;

    if (data.startsWith("http")) {
      window.open(data, "_blank");
      return;
    }

    let type = data.split(",")[0];
    let fileType = "image/jpeg";
    if (type === "data:image/png;base64") fileType = "image/png";
    if (type === "data:application/pdf;base64") fileType = "application/pdf";

    dispatch({
      type: "modelcon",
      value: { Isopen: true, content: data, type: fileType },
    });
  };

  return (
    <>
      <br />
      <div className="venkat2000-container">
        <div className="venkat2000-header">
          <button className="venkat2000-button" style={{ backgroundColor: 'grey' }} onClick={() => setOpenModal(true)}>
            <VisibilityIcon />
          </button>
        </div>

      {openModal && (
  <div className="venkat2000-modal">
    <div className="venkat2000-modal-content">
      <div className="venkat2000-modal-header">
        <h3>Evaluation Records</h3>
        <button style={{padding:'8px',borderRadius:'5px'}}
          className="venkat2000-close-btn"
          onClick={() => setOpenModal(false)}
        >
        Close  ✕
        </button>
        <br />
      </div>
      <div className="venkat2000-modal-body">
        <ReactGrid columns={GeneralEvaluationColumns} RowData={gridData} />
      </div>
    </div>
  </div>
)}


        <h2>{isViewMode ? "EMR Summary" : "New Evaluation"}</h2>

        <div className="venkat2000-form">
          <label className="venkat2000-label">Primary Complaint <span>*</span></label>
          <input className="venkat2000-input" name="KeyComplaint" value={formData.KeyComplaint} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Chief Complaint</label>
          <input className="venkat2000-input" name="ChiefComplaint" value={formData.ChiefComplaint} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">History</label>
          <input className="venkat2000-input" name="History" value={formData.History} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Examination</label>
          <input className="venkat2000-input" name="Examine" value={formData.Examine} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Diagnosis <span>*</span></label>
          <textarea className="venkat2000-input" name="Diagnosis" rows="4" value={formData.Diagnosis} onChange={handleChange} readOnly={isViewMode} />

          <label className="venkat2000-label">Choose Document</label>
          <div className="venkat2000-file">
            <input type="file" id="ChooseDocument" name="ChooseDocument" className="hidden" onChange={handleFileChange} />
            <label htmlFor="ChooseDocument" className="venkat2000-icon"><PhotoCameraBackIcon /></label>
            <button className="venkat2000-icon" onClick={() => handleFileView(formData.ChooseDocument)}><VisibilityIcon /></button>
          </div>

          <br /><br />

          <div className="venkat2000-button">
            <button className="venkat2000-button" style={{ backgroundColor: 'grey' }} onClick={handleSubmit} disabled={isLoading || isViewMode}>
              {isViewMode ? "View Mode" : isLoading ? "Processing..." : formData.Id ? "Update" : "Submit"}
            </button>
            <button className="venkat2000-button" style={{ backgroundColor: 'grey' }} onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="venkat2000-grid">
          <ReactGrid columns={GeneralEvaluationColumns} RowData={gridData} />
        </div>

        <ModelContainer />
      </div>
    </>
  );
};

export default EMR;
