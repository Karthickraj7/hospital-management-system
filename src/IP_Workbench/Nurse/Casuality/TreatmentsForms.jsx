
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
import RenderSummaryForm from "./RenderSummaryForm";
import RenderTreatmentRecord from "./RenderTreatmentRecord";
import RenderExaminationForm from "./RenderExaminationForm";
import RenderMedicationForm from "./RenderMedicationForm";
import RenderProceduresForm from "./RenderProceduresForm";
import "./TreatmentsForms.css"; // ✅ Import CSS file

function TreatmentsForms() {
  // 🟡 Initially, no form is shown until a button is clicked
  const [activeTab, setActiveTab] = useState("");
  const [gridData, setGridData] = useState([]);
  const dispatch = useDispatch();

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );

  // ✅ Unified form data structure
  const [formData, setFormData] = useState({
    Summary: {
      name: "",
      ageSex: "",
      date: "",
      inTime: "",
      outTime: "",
      pr: "",
      bp: "",
      rr: "",
      spo2: "",
      crbs: "",
      ccs: "",
      temp: "",
      vitalsOnArrival: "",
      diagnosis: "",
      history: "",
      examination: "",
      investigations: "",
    },
    TreatmentRecord: "",
    Examination: "",
    Medication: "",
    Procedures: "",
  });

  // ✅ Grid Columns
  const PatientTimeColumns = [
    { key: "FormType", name: "Form Type" },
    { key: "Content", name: "Details" },
    { key: "CreatedBy", name: "Created By" },
    { key: "CreatedDate", name: "Created Date" },
    {
      key: "actions",
      name: "Actions",
      renderCell: (params) => (
        <div className="react-grid-actions">
          <button onClick={() => handleView(params.row)}>View</button>
          <button onClick={() => handlePrint(params.row.FormType)}>Print</button>
        </div>
      ),
    },
  ];

  // ✅ Fetch Grid Data
  const fetchGridData = useCallback(() => {
    if (!IP_DoctorWorkbenchNavigation?.PatientId || !UrlLink) return;
    axios
      .get(
        `${UrlLink}Ip_Workbench/get_saved_forms/${IP_DoctorWorkbenchNavigation?.PatientId}`
      )
      .then((res) => setGridData(res.data || []))
      .catch((err) => console.error("Error loading saved data:", err));
  }, [UrlLink, IP_DoctorWorkbenchNavigation?.PatientId]);

  useEffect(() => {
    fetchGridData();
  }, [fetchGridData]);

  // ✅ Save handler
  const handleSave = (formName) => {
    let content = "";

    if (formName === "Summary") {
      content = JSON.stringify(formData.Summary);
    } else {
      content = formData[formName];
    }

    const postdata = {
      Patient_id: IP_DoctorWorkbenchNavigation?.PatientId,
      Registration_id: IP_DoctorWorkbenchNavigation?.pk,
      Created_by: userRecord?.username,
      Employeeid: userRecord?.Employeeid,
      FormType: formName,
      Content: content,
    };

    axios
      .post(`${UrlLink}Ip_Workbench/save_form_data`, postdata)
      .then(() => {
        fetchGridData();
        dispatch({
          type: "toast",
          value: {
            message: `${formName.replace(/([A-Z])/g, " $1")} saved successfully`,
            type: "success",
          },
        });
      })
      .catch((err) => {
        console.error("Error saving form:", err);
        dispatch({
          type: "toast",
          value: {
            message: `Failed to save ${formName.replace(/([A-Z])/g, " $1")}`,
            type: "error",
          },
        });
      });
  };

  // ✅ Print handler
  const handlePrint = (formName) => {
    window.print();
    dispatch({
      type: "toast",
      value: {
        message: `${formName.replace(/([A-Z])/g, " $1")} printed successfully`,
        type: "success",
      },
    });
  };

  // ✅ View handler
  const handleView = (row) => {
    const formType = row.FormType;
    setActiveTab(formType + "Form");

    if (formType === "Summary") {
      try {
        const summaryData = JSON.parse(row.Content);
        setFormData((prev) => ({ ...prev, Summary: summaryData }));
      } catch (error) {
        console.error("Error parsing Summary data:", error);
      }
    } else {
      setFormData((prev) => ({ ...prev, [formType]: row.Content }));
    }

    dispatch({
      type: "toast",
      value: {
        message: `${formType.replace(/([A-Z])/g, " $1")} loaded for viewing`,
        type: "info",
      },
    });
  };

  // ✅ Render forms only when a button is clicked
  const renderFormSection = () => {
    switch (activeTab) {
      case "SummaryForm":
        return (
          <RenderSummaryForm
            formData={formData.Summary}
            setFormData={setFormData}
            onSave={() => handleSave("Summary")}
            onPrint={() => handlePrint("Summary")}
          />
        );
      case "TreatmentRecord":
        return (
          <RenderTreatmentRecord
            formData={formData.TreatmentRecord}
            setFormData={setFormData}
            onSave={() => handleSave("TreatmentRecord")}
            onPrint={() => handlePrint("TreatmentRecord")}
          />
        );
      case "ExaminationForm":
        return (
          <RenderExaminationForm
            formData={formData.Examination}
            setFormData={setFormData}
            onSave={() => handleSave("Examination")}
            onPrint={() => handlePrint("Examination")}
          />
        );
      case "MedicationForm":
        return (
          <RenderMedicationForm
            formData={formData.Medication}
            setFormData={setFormData}
            onSave={() => handleSave("Medication")}
            onPrint={() => handlePrint("Medication")}
          />
        );
      case "ProceduresForm":
        return (
          <RenderProceduresForm
            formData={formData.Procedures}
            setFormData={setFormData}
            onSave={() => handleSave("Procedures")}
            onPrint={() => handlePrint("Procedures")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="new-patient-registration-form">
        {/* ✅ Tab Buttons */}
        <div className="new-navigationwww">
          {[
            { key: "SummaryForm", label: "Summary Form" },
            { key: "TreatmentRecord", label: "Treatment Record" },
            { key: "ExaminationForm", label: "Examination Form" },
            { key: "MedicationForm", label: "Medication Form" },
            { key: "ProceduresForm", label: "Procedures Form" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ✅ Only show form after a button is clicked */}
        {activeTab ? (
          <div className="form-section">{renderFormSection()}</div>
        ) : (
          <div className="placeholder-text">Please select a form to begin.</div>
        )}

        {/* ✅ Saved Forms Grid */}
        {gridData?.length > 0 && (
          <div className="mt-4">
            <h4>Saved Forms</h4>
            <ReactGrid columns={PatientTimeColumns} RowData={gridData} />
          </div>
        )}
      </div>

      {/* ✅ Toast */}
      <ToastAlert Message={toast?.message} Type={toast?.type} />
    </>
  );
}

export default TreatmentsForms;


