
// // import React, { useRef, useState, useEffect } from "react";
// // import { useReactToPrint } from "react-to-print";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
// // import ToastAlert from "../../../OtherComponent/ToastContainer/ToastAlert"; // if you have one
// // import "./EmergencySummaryForm.css";

// // const EmergencySummaryForm = () => {
// //   const formRef = useRef();
// //   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
// //   const IP_DoctorWorkbenchNavigation = useSelector(
// //     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
// //   );

// //   const Patient_id = IP_DoctorWorkbenchNavigation?.PatientId;
// //   const Registration_Id = IP_DoctorWorkbenchNavigation?.Registration_Id;
// //   const Employeeid = IP_DoctorWorkbenchNavigation?.EmployeeId;
// //   const Created_by = IP_DoctorWorkbenchNavigation?.username || "Unknown";
// //   const PatientName = IP_DoctorWorkbenchNavigation?.PatientName || "";
// //   const PatientAge = IP_DoctorWorkbenchNavigation?.Age || "";
// //   const PatientGender = IP_DoctorWorkbenchNavigation?.Gender || "";

// //   const [formData, setFormData] = useState({
// //     Name: "",
// //     AgeSex: "",
// //     Date: "",
// //     InTime: "",
// //     OutTime: "",
// //     PR: "", BP: "", RR: "", SPO2: "", GRBS: "", GCS: "", TEMP: "",
// //     VitalsOnArrival: "",
// //     Diagnosis: "", History: "", Examination: "", Investigations: "", Medications: "",
// //     Consultations: "", DischargePlan: "",
// //     PR_Dis: "", BP_Dis: "", RR_Dis: "", SPO2_Dis: "", GRBS_Dis: "", GCS_Dis: "", TEMP_Dis: "",
// //     LamaName: "", LamaDate: "", LamaTime: "",
// //     PatientRelativeName: "", PatientRelationship: "", WitnessSignature: "", DoctorSignature: "",
// //   });

// //   const [tableData, setTableData] = useState([]);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [isViewMode, setIsViewMode] = useState(false);
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [deleteLoading, setDeleteLoading] = useState(false);
// //   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

// //   const handlePrint = useReactToPrint({
// //     content: () => formRef.current,
// //     documentTitle: `Emergency_Treatment_Summary_${Patient_id || "Patient"}`,
// //     pageStyle: `
// //       @page { size: A4; margin: 10mm; }
// //       @media print {
// //         body { -webkit-print-color-background: true; print-color-adjust: exact; }
// //         .print\\:hidden { display: none !important; }
// //       }
// //     `,
// //   });

// //   const GET_URL    = `${UrlLink}Ip_Workbench/get_treatment_summary/`;
// //   const POST_URL = `${UrlLink}Ip_Workbench/Treatment_summary_Details_Link`;


// //   const PUT_URL    = `${UrlLink}Ip_Workbench/update_treatment_summary/`;
// //   const DELETE_URL = `${UrlLink}Ip_Workbench/delete_treatment_summary/`;

// //   // Fixed: Properly split ISO date/time (handles 2025-04-01T10:30:00.000Z)
// //   const fetchList = async () => {
// //     if (!Patient_id || !UrlLink) return;

// //     try {
// //       setLoading(true);
// //       const res = await axios.get(`${GET_URL}${Patient_id}/`);
// //       const data = res.data?.data || [];

// //       const formatted = data.map((row, i) => {
// //         const iso = row.CreatedDate || "";
// //         const datePart = iso.split("T")[0] || "";
// //         const timePart = iso.split("T")[1]?.substring(0, 5) || ""; // HH:MM only

// //         return {
// //           ...row,
// //           sNo: i + 1,
// //           Date: datePart,
// //           InTime: timePart || row.InTime || "--",
// //           OutTime: row.OutTime || "--",
// //           Diagnosis: row.Diagnosis || "N/A",
// //         };
// //       });

// //       setTableData(formatted);
// //     } catch (err) {
// //       console.error("Fetch Error:", err);
// //     //  alert("Failed to load treatment summaries");
// //       setTableData([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (Patient_id && UrlLink) {
// //       fetchList();
// //     }
// //     // Auto-fill patient name and age/sex
// //     if (PatientName || PatientAge || PatientGender) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         Name: PatientName,
// //         AgeSex: `${PatientAge || ""} / ${PatientGender || ""}`.trim(),
// //       }));
// //     }
// //   }, [Patient_id, UrlLink, PatientName, PatientAge, PatientGender]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const cleanDateTimeForBackend = (data) => {
// //     const cleaned = { ...data };
// //     const emptyToNull = ["Date", "InTime", "OutTime", "LamaDate", "LamaTime"];
// //     emptyToNull.forEach((field) => {
// //       if (cleaned[field] === "") cleaned[field] = null;
// //     });
// //     return cleaned;
// //   };

// //   const handleSubmit = async () => {
// //     if (!Patient_id) return alert("No patient selected.");

// //     setLoading(true);
// //     const cleaned = cleanDateTimeForBackend(formData);

// //     try {
// //       const payload = {
// //         Patient_id,
// //         Registration_id: Registration_Id,
// //         Employeeid,
// //         Created_by,
// //         formData: cleaned,
// //       };

// //       const res = await axios.post(POST_URL, payload);
// //       alert(res.data?.message || "Saved successfully!");
// //       handleClear();
// //       fetchList();
// //     } catch (err) {
// //       alert("Save failed: " + (err.response?.data?.error || err.message));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleUpdate = async () => {
// //     if (!selectedRecord?.Id) return alert("No record selected");

// //     setLoading(true);
// //     const cleaned = cleanDateTimeForBackend(formData);

// //     try {
// //       await axios.put(`${PUT_URL}${selectedRecord.Id}/`, {
// //         formData: cleaned,
// //         UpdatedBy: Created_by,
// //       });
// //       alert("Updated successfully!");
// //       handleClear();
// //       fetchList();
// //     } catch (err) {
// //       alert("Update failed: " + (err.response?.data?.error || err.message));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const onView = (row) => {
// //     setSelectedRecord(row);
// //     setFormData({ ...row });
// //     setIsViewMode(true);
// //     setIsEditMode(false);
// //     formRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   const onEdit = (row) => {
// //     onView(row);
// //     setIsEditMode(true);
// //   };

// //   const handleClear = () => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       Date: "", InTime: "", OutTime: "",
// //       PR: "", BP: "", RR: "", SPO2: "", GRBS: "", GCS: "", TEMP: "",
// //       VitalsOnArrival: "", Diagnosis: "", History: "", Examination: "",
// //       Investigations: "", Medications: "", Consultations: "", DischargePlan: "",
// //       PR_Dis: "", BP_Dis: "", RR_Dis: "", SPO2_Dis: "", GRBS_Dis: "", GCS_Dis: "", TEMP_Dis: "",
// //       LamaName: "", LamaDate: "", LamaTime: "",
// //       PatientRelativeName: "", PatientRelationship: "", WitnessSignature: "", DoctorSignature: "",
// //     }));
// //     setSelectedRecord(null);
// //     setIsViewMode(false);
// //     setIsEditMode(false);
// //   };

// //   const openDeleteConfirm = (row) => {
// //     setSelectedRecord(row);
// //     setIsDeleteConfirmOpen(true);
// //   };

// //   const confirmDelete = async () => {
// //     if (!selectedRecord?.Id) return;

// //     setDeleteLoading(true);
// //     try {
// //       await axios.delete(`${DELETE_URL}${selectedRecord.Id}/`);
// //       alert("Deleted successfully");
// //       setIsDeleteConfirmOpen(false);
// //       handleClear();
// //       fetchList();
// //     } catch (err) {
// //       alert("Delete failed: " + (err.response?.data?.error || err.message));
// //     } finally {
// //       setDeleteLoading(false);
// //     }
// //   };

// //   // Fixed columns to match actual data keys
// //   const columns = [
// //     { key: "sNo", name: "S.No"},
// //     { key: "Date", name: "Date"},
// //      { key: "DoctorSignature", name: "Doctor Signature" },
    
    
// //     {
// //       key: "view",
// //       name: "View",
// //       renderCell: ({ row }) => (
// //   <button className="Min-junSeo-jun" onClick={() => onView(row)}>👁</button>
// // ),

// //     },
// // //      {
// // //       key: "edit",
// // //       name: "Edit",
// // //      renderCell: ({ row }) => (
// // //   <button className="Seo-junJi-ho" onClick={() => onEdit(row)}>✏️</button>
// // // ),
// // //     },
   
// //   ];

// //   const isFormReadOnly = isViewMode && !isEditMode;

// //   return (
// //     <div className="Woo-jinTae-hyun">
// //       <div ref={formRef} className="ho-Jae-hyun">
// //         {/* PAGE 1 */}
// //         <div className="Jae-hyun-Dong-hyun">
// //           <div className="hyun-Min-jae">
// //             <h1>KARUNA MEDICAL COLLEGE HOSPITAL</h1>
// //             <p>Vilayodi, Chittur, Palakkad - 678103</p>
// //             <p>9496962555 | 9496972556 | 9496972557</p>
// //           </div>

// //           <div className="ung-ho-Kyung-min">
// //             <h2>DEPARTMENT OF EMERGENCY MEDICINE</h2>
// //           </div>

// //           <h3 className="-min-Sang-hoon">TREATMENT SUMMARY</h3>

// //           <div className="-hoon-Jun-ho">
// //             <div><label>Name:</label> <input type="text" name="Name" value={formData.Name} onChange={handleChange} /></div>
// //             <div><label>Age & Sex:</label> <input type="text" name="AgeSex" value={formData.AgeSex} onChange={handleChange} /></div>
// //             <div><label>Date:</label> <input type="date" name="Date" value={formData.Date} onChange={handleChange} disabled={isFormReadOnly} /></div>
// //             <div><label>In Time:</label> <input type="time" name="InTime" value={formData.InTime} onChange={handleChange} disabled={isFormReadOnly} /></div>
// //             <div><label>Out Time:</label> <input type="time" name="OutTime" value={formData.OutTime} onChange={handleChange} disabled={isFormReadOnly} /></div>
// //           </div>

// //           {/* Rest of your form (unchanged structure, just cleaner) */}
// //           <h4 className="Kyung-min-Sang-hoon">VITALS ON ARRIVAL</h4>
// //           <table className="ang-hoon-Jun-ho">
// //             <thead>
// //               <tr>
// //                 {["PR", "BP", "RR", "SPO2", "GRBS", "GCS", "TEMP"].map((v) => (
// //                   <th key={v}>{v}</th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               <tr>
// //                 {["PR", "BP", "RR", "SPO2", "GRBS", "GCS", "TEMP"].map((field) => (
// //                   <td key={field}>
// //                     <input type="text" name={field} value={formData[field] || ""} onChange={handleChange} disabled={isFormReadOnly} />
// //                   </td>
// //                 ))}
// //               </tr>
// //             </tbody>
// //           </table>
          
// //           {[
// //             ["Diagnosis", "DIAGNOSIS"],
// //             ["History", "HISTORY"],
// //             ["Examination", "EXAMINATION"],
// //             ["Investigations", "INVESTIGATIONS"],
            
// //           ].map(([field, label]) => (
// //             <div key={field} className="Kyung-min-Sang-hoon">
// //               <h4>{label}</h4>
// //               <textarea rows="5" name={field} value={formData[field] || ""} onChange={handleChange} disabled={isFormReadOnly} />
// //             </div>
// //           ))}
       
// //  </div>

// //         {/* PAGE 2 - Similar structure */}
       
// //            {/* === PAGE 2 === */}
// //          <div className="Jae-hyun-Dong-hyun">
// //           {[
// //              ["Medications", "MEDICATIONS AND PROCEDURES DONE (IF ANY)"],
// //              ["Consultations", "CONSULTATIONS DONE (IF ANY)"],
// //              ["DischargePlan", "DISCHARGE / REFERRAL / LAMA"],
// //            ].map(([field, label]) => (
// //              <div key={field} className="Kyung-min-Sang-hoon">
// //                <h4>{label}</h4>
// //                <textarea rows="6" name={field} value={formData[field] || ""} onChange={handleChange} disabled={isFormReadOnly} />
// //              </div>
// //            ))}

// //            <div className="Kyung-min-Sang-hoon">
// //              <h4 className="oon-Jun-ho">VITALS ON DISCHARGE / REFERRAL / LAMA</h4>
// //              <table className="ang-hoon-Jun-ho">
// //                <thead>
// //                  <tr>
// //                    {["PR_Dis", "BP_Dis", "RR_Dis", "SPO2_Dis", "GRBS_Dis", "GCS_Dis", "TEMP_Dis"].map((v) => (
// //                      <th key={v}>{v.replace("_Dis", "")}</th>
// //                    ))}
// //                  </tr>
// //                </thead>
// //                <tbody>
// //                  <tr>
// //                    {["PR_Dis", "BP_Dis", "RR_Dis", "SPO2_Dis", "GRBS_Dis", "GCS_Dis", "TEMP_Dis"].map((field) => (
// //                      <td key={field}>
// //                        <input type="text" name={field} value={formData[field] || ""} onChange={handleChange} disabled={isFormReadOnly} />
// //                      </td>
// //                    ))}
// //                  </tr>
// //                </tbody>
// //              </table>
// //            </div>

// //            {/* <div className="lama-section">
// //              <h4>LEAVE AGAINST MEDICAL ADVICE (LAMA)</h4>
// //              <p className="form-text">
// //                ഞാൻ / ഞങ്ങൾ, രോഗിയായ{" "}
// //                <input
// //                  type="text"
// //                  className="inline-input"
// //                  name="LamaName"
// //                  value={formData.LamaName || ""}
// //                  onChange={handleChange}
// //                  disabled={isFormReadOnly}
// //                />{" "}
// //               കരുണ മെഡിക്കൽ കോളേജ് ആശുപത്രിയിൽ നിന്നും ഡോക്ടർമാരുടെയും ആശുപത്രിയുടെയും ഉപദേശത്തിന് വിരുദ്ധമായി, എന്റെ / ഞങ്ങളുടെ തന്നെ
// //                അഭ്യർത്ഥനപ്രകാരം ഡിസ്ചാർജ് ചെയ്യുന്നു / കൊണ്ടുപോകുന്നു. ഈതീരുമാനത്തിൽ നിന്ന് രോഗിയുടെ ജീവനിനും ആരോഗ്യത്തിനും ഉണ്ടാകാവുന്ന
// //                അപകടഫലങ്ങളെക്കുറിച്ച് ആശുപത്രി അധികൃതരും ഡോക്ടർമാരും വിശദമായി വിവരിച്ചിരിക്കുന്നു. എന്നിട്ടും, ഈ തീരുമാനം മൂലം ഉണ്ടാകാവുന്ന എല്ലാ
// //               അപകടങ്ങളും ഉത്തരവാദിത്വങ്ങളും ഞങ്ങൾ ഏറ്റെടുക്കുന്നു. മെഡിക്കൽ ഉപദേശത്തിന് വിരുദ്ധമായി ആശുപത്രി വിട്ടതിനു തികച്ചും ഞങ്ങൾ തന്നെയാണ്
// //               ഉത്തരവാദികൾ. അതിൽ നിന്നുണ്ടാകുന്ന യാതൊരു ഉത്തരവാദിത്വവും ആശുപത്രിയ്ക്കോ ഡോക്ടർമാർക്കോ ഉണ്ടാകില്ല.
          
// //                {/* Full Malayalam text continues... */}
// //              {/* </p>

// //              <div className="signature-fields">
// //                <div>
// //                  <label>Patient/Relative's Name:</label>
// //                  <input type="text" name="PatientRelativeName" value={formData.PatientRelativeName} onChange={handleChange} disabled={isFormReadOnly} />
// //                </div>
// //                <div>
// //                  <label>Relationship:</label>
// //                  <input type="text" name="PatientRelationship" value={formData.PatientRelationship} onChange={handleChange} disabled={isFormReadOnly} />
// //                </div>
// //                <div>
// //                  <label>Witness Name & Signature:</label>
// //                  <input type="text" name="WitnessSignature" value={formData.WitnessSignature} onChange={handleChange} disabled={isFormReadOnly} />
// //                </div> */}
// //              {/* </div> */}
// //            {/* </div>  */}

// //            <div className="-hoon-Jun-ho-Byung-ho">
// //              <p className="-hoon-Jun-ho-Byung-ho-label">Name & Signature of the Doctor</p>
// //              <div className="-hoon-Jun-ho-Byung-ho-row">
// //                <input
// //                  type="text"
// //                  name="DoctorSignature"
// //                  value={formData.DoctorSignature}
// //                  onChange={handleChange}
// //                  disabled={isFormReadOnly}
// //                  placeholder="Doctor's Name"
// //                />
// //              </div>
// //            </div>
// //         </div>
// //       </div>
        
// //       {/* Action Buttons */}
// //       <div className="Main_container_Btn"
// //       //  style={{ margin: "20px 0", textAlign: "center", gap: "10px", display: "flex", justifyContent: "center", flexWrap: "wrap" }}
// //        >
// //         {!isEditMode && !isViewMode ? (
// //           <>
// //             <button  onClick={handleSubmit} disabled={loading} 
// //     >
// //               {loading ? "Saving..." : "Submit"}
// //             </button>
// //             {/* <button className="print-button" onClick={handlePrint}>Print</button> */}
// //             <button  onClick={handleClear} >Clear</button>
// //           </>
// //         ) : isEditMode ? (
// //           <>
// //             <button  onClick={handleUpdate} disabled={loading}
// //     >
// //               {loading ? "Updating..." : "Update"}
// //             </button>
// //             <button  onClick={handleClear} >Cancel</button>
// //           </>
// //         ) : (
// //           <button  onClick={handleClear}>Close View</button>
// //         )}
        
// //         <button  onClick={handlePrint}  >Print</button>
  
// //       </div>

// //       {/* Grid */}
// //       <div style={{ marginTop: 30 }}>
// //         <h3>Treatment Summary Records</h3>
// //         {loading ? <p>Loading records...</p> : <ReactGrid columns={columns} RowData={tableData} />}
// //       </div>

// //       {/* Delete Confirmation Modal */}
     
// //     </div>
// //   );
// // };

// // export default EmergencySummaryForm;



// import React, { useRef, useState, useEffect } from "react";
// import { useReactToPrint } from "react-to-print";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
// import "./EmergencySummaryForm.css";
 
// const EmergencySummaryForm = () => {
//   const formRef = useRef();
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
 
//   // 🔥 TREATMENT RECORD PATTERN: Multiple selectors + fallbacks
//   const IPData = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
//   const DoctorData = useSelector((state) => state.Frontoffice?.DoctorWorkbenchNavigation);
 
//   // 🔥 TREATMENT RECORD PATTERN: Fallback logic
//   const Patient_id = IPData?.PatientId || DoctorData?.PatientId;
//   const Registration_Id = IPData?.Registration_Id || DoctorData?.Registration_Id;
//   const Employeeid = IPData?.EmployeeId || DoctorData?.EmployeeId;
//   const Created_by = IPData?.username || DoctorData?.username || "Unknown";
//   const PatientName = IPData?.PatientName || DoctorData?.PatientName || "";
//   const PatientAge = IPData?.Age || DoctorData?.Age || "";
//   const PatientGender = IPData?.Gender || DoctorData?.Gender || "";
 
//   // 🔥 INITIAL STATE with auto-fill (TreatmentRecord pattern)
//   const [formData, setFormData] = useState({
//     Name: PatientName, // 🔥 Auto-filled
//     AgeSex: `${PatientAge || ""} / ${PatientGender || ""}`.trim(), // 🔥 Auto-filled
//     Date: "",
//     InTime: "",
//     OutTime: "",
//     PR: "", BP: "", RR: "", SPO2: "", GRBS: "", GCS: "", TEMP: "",
//     VitalsOnArrival: "",
//     Diagnosis: "", History: "", Examination: "", Investigations: "", Medications: "",
//     Consultations: "", DischargePlan: "",
//     PR_Dis: "", BP_Dis: "", RR_Dis: "", SPO2_Dis: "", GRBS_Dis: "", GCS_Dis: "", TEMP_Dis: "",
//     LamaName: "", LamaDate: "", LamaTime: "",
//     PatientRelativeName: "", PatientRelationship: "", WitnessSignature: "", DoctorSignature: "",
//   });
 
//   const [tableData, setTableData] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [submitDisabled, setSubmitDisabled] = useState(false); // 🔥 Multiple submit protection
 

//   const adjustHeight = (e) => {
//     const textarea = e.target;
//     textarea.style.height = "auto";
//     const newHeight = Math.min(textarea.scrollHeight + 4, 200);
//     textarea.style.height = newHeight + "px";
//   };


//   const handlePrint = useReactToPrint({
//     content: () => formRef.current,
//     documentTitle: `Emergency_Treatment_Summary_${Patient_id || "Patient"}`,
//     pageStyle: `
//       @page { size: A4; margin: 10mm; }
//       @media print {
//         body { -webkit-print-color-background: true; print-color-adjust: exact; }
//         .print\\:hidden { display: none !important; }
//       }
//     `,
//   });
 
//   const GET_URL = `${UrlLink}Ip_Workbench/get_treatment_summary/`;
//   const POST_URL = `${UrlLink}Ip_Workbench/Treatment_summary_Details_Link`;
//   const PUT_URL = `${UrlLink}Ip_Workbench/update_treatment_summary/`;
//   const DELETE_URL = `${UrlLink}Ip_Workbench/delete_treatment_summary/`;
 
//   const fetchList = async () => {
//     if (!Patient_id || !UrlLink) return;
//     try {
//       setLoading(true);
//       const res = await axios.get(`${GET_URL}${Patient_id}/`);
//       const data = res.data?.data || [];
//       const formatted = data.map((row, i) => {
//         const iso = row.CreatedDate || "";
//         const datePart = iso.split("T")[0] || "";
//         const timePart = iso.split("T")[1]?.substring(0, 5) || "";
//         return {
//           ...row,
//           sNo: i + 1,
//           Date: datePart,
//           InTime: timePart || row.InTime || "--",
//           OutTime: row.OutTime || "--",
//           Diagnosis: row.Diagnosis || "N/A",
//         };
//       });
//       setTableData(formatted);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       alert("Failed to load treatment summaries");
//       setTableData([]);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   // 🔥 TREATMENT RECORD PATTERN: Auto-fill + clear on Patient_id change
//   useEffect(() => {
//     if (Patient_id) {
//       handleClear(); // 🔥 Reset form with new patient data
//       fetchList();
//     }
//   }, [Patient_id]);
 
//   // 🔥 Auto-fill patient info when it changes
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       Name: PatientName,
//       AgeSex: `${PatientAge || ""} / ${PatientGender || ""}`.trim(),
//     }));
//   }, [PatientName, PatientAge, PatientGender]);
 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
 
//   const cleanDateTimeForBackend = (data) => {
//     const cleaned = { ...data };
//     const emptyToNull = ["Date", "InTime", "OutTime", "LamaDate", "LamaTime"];
//     emptyToNull.forEach((field) => {
//       if (cleaned[field] === "") cleaned[field] = null;
//     });
//     return cleaned;
//   };
 
//   // 🔥 FIXED: Multiple submit protection (TreatmentRecord pattern)
//   const handleSubmit = async () => {
//     if (!Patient_id || loading || submitDisabled) return alert("No patient selected");
   
//     setSubmitDisabled(true); // 🔥 IMMEDIATE DISABLE
//     setLoading(true);
   
//     const cleaned = cleanDateTimeForBackend(formData);
//     try {
//       const payload = {
//         Patient_id,
//         Registration_id: Registration_Id,
//         Employeeid,
//         Created_by,
//         formData: cleaned,
//       };
//       const res = await axios.post(POST_URL, payload);
//       alert(res.data?.message || "Saved successfully!");
//       handleClear();
//       fetchList();
//     } catch (err) {
//       alert("Save failed: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(false);
//       setSubmitDisabled(false); // 🔥 RE-ENABLE
//     }
//   };
 
//   const handleUpdate = async () => {
//     if (!selectedRecord?.Id || loading || submitDisabled) return alert("No record selected");
   
//     setSubmitDisabled(true);
//     setLoading(true);
//     const cleaned = cleanDateTimeForBackend(formData);
//     try {
//       await axios.put(`${PUT_URL}${selectedRecord.Id}/`, {
//         formData: cleaned,
//         UpdatedBy: Created_by,
//       });
//       alert("Updated successfully!");
//       handleClear();
//       fetchList();
//     } catch (err) {
//       alert("Update failed: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(false);
//       setSubmitDisabled(false);
//     }
//   };
 
//   const onView = (row) => {
//     setSelectedRecord(row);
//     setFormData({ ...row });
//     setIsViewMode(true);
//     setIsEditMode(false);
//     setSubmitDisabled(false);
//     formRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
 
//   const onEdit = (row) => {
//     onView(row);
//     setIsEditMode(true);
//   };
 
//   // 🔥 TREATMENT RECORD PATTERN: clearForm with auto-fill reset
//   const handleClear = () => {
//     setFormData({
//       Name: PatientName, // 🔥 Auto-refill
//       AgeSex: `${PatientAge || ""} / ${PatientGender || ""}`.trim(), // 🔥 Auto-refill
//       Date: "", InTime: "", OutTime: "",
//       PR: "", BP: "", RR: "", SPO2: "", GRBS: "", GCS: "", TEMP: "",
//       VitalsOnArrival: "", Diagnosis: "", History: "", Examination: "",
//       Investigations: "", Medications: "", Consultations: "", DischargePlan: "",
//       PR_Dis: "", BP_Dis: "", RR_Dis: "", SPO2_Dis: "", GRBS_Dis: "", GCS_Dis: "", TEMP_Dis: "",
//       LamaName: "", LamaDate: "", LamaTime: "",
//       PatientRelativeName: "", PatientRelationship: "", WitnessSignature: "", DoctorSignature: "",
//     });
//     setSelectedRecord(null);
//     setIsViewMode(false);
//     setIsEditMode(false);
//     setSubmitDisabled(false);
//   };
 
//   const openDeleteConfirm = (row) => {
//     setSelectedRecord(row);
//     setIsDeleteConfirmOpen(true);
//   };
 
//   const confirmDelete = async () => {
//     if (!selectedRecord?.Id) return;
//     setDeleteLoading(true);
//     try {
//       await axios.delete(`${DELETE_URL}${selectedRecord.Id}/`);
//       alert("Deleted successfully");
//       setIsDeleteConfirmOpen(false);
//       handleClear();
//       fetchList();
//     } catch (err) {
//       alert("Delete failed: " + (err.response?.data?.error || err.message));
//     } finally {
//       setDeleteLoading(false);
//     }
//   };
 
//   // 🔥 UNCOMMENT & FIX: Edit column + Multiple submit protection
//   const columns = [
//     { key: "sNo", name: "S.No"},
//     { key: "Date", name: "Date"},
//     { key: "DoctorSignature", name: "Doctor Signature" },
//     {
//       key: "view",
//       name: "View",
//       renderCell: ({ row }) => (
//         <button className="Min-junSeo-jun" onClick={() => onView(row)}>👁</button>
//       ),
//     },
//     // {
//     //   key: "edit",
//     //   name: "Edit",
//     //   renderCell: ({ row }) => (
//     //     <button className="Seo-junJi-ho" onClick={() => onEdit(row)}>✏️</button>
//     //   ),
//     // },
//   ];
 
//   const isFormReadOnly = isViewMode && !isEditMode;
 
//   return (
//     <div className="Woo-jinTae-hyun">
//       <div ref={formRef} className="ho-Jae-hyun">
//         {/* PAGE 1 */}
//         <div className="Jae-hyun-Dong-hyun">
//           <div className="hyun-Min-jae">
//             <h1>KARUNA MEDICAL COLLEGE HOSPITAL</h1>
//             <p>Vilayodi, Chittur, Palakkad - 678103</p>
//             <p>9496962555 | 9496972556 | 9496972557</p>
//           </div>
//           <div className="ung-ho-Kyung-min">
//             <h2>DEPARTMENT OF EMERGENCY MEDICINE</h2>
//           </div>
//           <h3 className="-min-Sang-hoon">TREATMENT SUMMARY</h3>
//           <div className="-hoon-Jun-ho">
//             <div><label>Name:</label> <input type="text" name="Name" value={formData.Name} onChange={handleChange} disabled={isFormReadOnly} /></div>
//             <div><label>Age & Sex:</label> <input type="text" name="AgeSex" value={formData.AgeSex} onChange={handleChange} disabled={isFormReadOnly} /></div>
//             <div><label>Date:</label> <input type="date" name="Date" value={formData.Date} onChange={handleChange} disabled={isFormReadOnly} /></div>
//             <div><label>In Time:</label> <input type="time" name="InTime" value={formData.InTime} onChange={handleChange} disabled={isFormReadOnly} /></div>
//             <div><label>Out Time:</label> <input type="time" name="OutTime" value={formData.OutTime} onChange={handleChange} disabled={isFormReadOnly} /></div>
//           </div>
//           <h4 className="Kyung-min-Sang-hoon">VITALS ON ARRIVAL</h4>
//           <table className="ang-hoon-Jun-ho">
//             <thead><tr>{["PR", "BP", "RR", "SPO2", "GRBS", "GCS", "TEMP"].map((v) => <th key={v}>{v}</th>)}</tr></thead>
//             <tbody><tr>{["PR", "BP", "RR", "SPO2", "GRBS", "GCS", "TEMP"].map((field) => (
//               <td key={field}><input type="text" name={field} value={formData[field] || ""} onChange={handleChange} disabled={isFormReadOnly} /></td>
//             ))}</tr></tbody>
//           </table>
//           {[
//             ["Diagnosis", "DIAGNOSIS"], ["History", "HISTORY"], ["Examination", "EXAMINATION"], ["Investigations", "INVESTIGATIONS"],
//           ].map(([field, label]) => (
//             <div key={field} className="Kyung-min-Sang-hoon">
//               <h4>{label}</h4>
//               <textarea rows="5" name={field} value={formData[field] || ""} onChange={handleChange} disabled={isFormReadOnly} onInput={adjustHeight}/>
//             </div>
//           ))}
//         </div>
 
//         {/* PAGE 2 */}
//         <div className="Jae-hyun-Dong-hyun">
//           {[
//             ["Medications", "MEDICATIONS AND PROCEDURES DONE (IF ANY)"],
//             ["Consultations", "CONSULTATIONS DONE (IF ANY)"],
//             ["DischargePlan", "DISCHARGE / REFERRAL / LAMA"],
//           ].map(([field, label]) => (
//             <div key={field} className="Kyung-min-Sang-hoon">
//               <h4>{label}</h4>
//               <textarea rows="6" name={field} value={formData[field] || ""} onChange={handleChange} disabled={isFormReadOnly} onInput={adjustHeight} />
//             </div>
//           ))}
//           <div className="Kyung-min-Sang-hoon">
//             <h4 className="oon-Jun-ho">VITALS ON DISCHARGE / REFERRAL / LAMA</h4>
//             <table className="ang-hoon-Jun-ho">
//               <thead><tr>{["PR_Dis", "BP_Dis", "RR_Dis", "SPO2_Dis", "GRBS_Dis", "GCS_Dis", "TEMP_Dis"].map((v) => (
//                 <th key={v}>{v.replace("_Dis", "")}</th>
//               ))}</tr></thead>
//               <tbody><tr>{["PR_Dis", "BP_Dis", "RR_Dis", "SPO2_Dis", "GRBS_Dis", "GCS_Dis", "TEMP_Dis"].map((field) => (
//                 <td key={field}><input type="text" name={field} value={formData[field] || ""} onChange={handleChange} disabled={isFormReadOnly} /></td>
//               ))}</tr></tbody>
//             </table>
//           </div>
//           <div className="-hoon-Jun-ho-Byung-ho">
//             <p className="-hoon-Jun-ho-Byung-ho-label">Name & Signature of the Doctor</p>
//             <div className="-hoon-Jun-ho-Byung-ho-row">
//               <input type="text" name="DoctorSignature" value={formData.DoctorSignature} onChange={handleChange} disabled={isFormReadOnly} placeholder="Doctor's Name" />
//             </div>
//           </div>
//         </div>
//       </div>
 
//       {/* 🔥 FIXED BUTTONS: Multiple submit + TreatmentRecord pattern */}
//       <div className="Main_container_Btn">
//         {!isEditMode && !isViewMode ? (
//           <>
//             <button onClick={handleSubmit} disabled={loading || submitDisabled || !Patient_id}>
//               {loading ? "⏳ Saving..." : "Submit"}
//             </button>
//             <button onClick={handleClear}>Clear</button>
//           </>
//         ) : isEditMode ? (
//           <>
//             <button onClick={handleUpdate} disabled={loading || submitDisabled}>
//               {loading ? "⏳ Updating..." : "Update"}
//             </button>
//             <button onClick={handleClear}>Cancel</button>
//           </>
//         ) : (
//           <button onClick={handleClear}>Close View</button>
//         )}
//         <button onClick={handlePrint} disabled={loading}>Print</button>
//       </div>
 
//       <div style={{ marginTop: 30 }}>
//         <h3>Treatment Summary Records</h3>
//         {loading ? <p>Loading records...</p> : <ReactGrid columns={columns} RowData={tableData} />}
//       </div>
//     </div>
//   );
// };
 
// export default EmergencySummaryForm;


import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
import "./EmergencySummaryForm.css";
 
const EmergencySummaryForm = () => {
  const formRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
 
  // 🔥 TREATMENT RECORD PATTERN: Multiple selectors + fallbacks
  const IPData = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
  const DoctorData = useSelector((state) => state.Frontoffice?.DoctorWorkbenchNavigation);
 
  // 🔥 TREATMENT RECORD PATTERN: Fallback logic
  const Patient_id = IPData?.PatientId || DoctorData?.PatientId;
  const Registration_Id = IPData?.Registration_Id || DoctorData?.Registration_Id;
  const Employeeid = IPData?.EmployeeId || DoctorData?.EmployeeId;
  const Created_by = IPData?.username || DoctorData?.username || "Unknown";
  const PatientName = IPData?.PatientName || DoctorData?.PatientName || "";
  const PatientAge = IPData?.Age || DoctorData?.Age || "";
  const PatientGender = IPData?.Gender || DoctorData?.Gender || "";
 
  const [frozenData, setFrozenData] = useState({});
 
  // 🔥 INITIAL STATE with auto-fill (TreatmentRecord pattern)
  const [formData, setFormData] = useState({
    Name: PatientName, // 🔥 Auto-filled
    AgeSex: `${PatientAge || ""} / ${PatientGender || ""}`.trim(), // 🔥 Auto-filled
    Date: "",
    InTime: "",
    OutTime: "",
    PR: "", BP: "", RR: "", SPO2: "", GRBS: "", GCS: "", TEMP: "",
    VitalsOnArrival: "",
    Diagnosis: "", History: "", Examination: "", Investigations: "", Medications: "",
    Consultations: "", DischargePlan: "",
    PR_Dis: "", BP_Dis: "", RR_Dis: "", SPO2_Dis: "", GRBS_Dis: "", GCS_Dis: "", TEMP_Dis: "",
    LamaName: "", LamaDate: "", LamaTime: "",
    PatientRelativeName: "", PatientRelationship: "", WitnessSignature: "", DoctorSignature: "",
  });
 
  const [tableData, setTableData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false); // 🔥 Multiple submit protection
 
  const handlePrint = useReactToPrint({
    content: () => formRef.current,
    documentTitle: `Emergency_Treatment_Summary_${Patient_id || "Patient"}`,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print {
        body { -webkit-print-color-background: true; print-color-adjust: exact; }
        .print\\:hidden { display: none !important; }
      }
    `,
  });
 
  const GET_URL = `${UrlLink}Ip_Workbench/get_treatment_summary/`;
  const POST_URL = `${UrlLink}Ip_Workbench/Treatment_summary_Details_Link`;
  const PUT_URL = `${UrlLink}Ip_Workbench/update_treatment_summary/`;
  const DELETE_URL = `${UrlLink}Ip_Workbench/delete_treatment_summary/`;
 
  const fetchList = async () => {
    if (!Patient_id || !UrlLink) return;
    try {
      setLoading(true);
      const res = await axios.get(`${GET_URL}${Patient_id}/`);
      const data = res.data?.data || [];
      const formatted = data.map((row, i) => {
        const iso = row.CreatedDate || "";
        const datePart = iso.split("T")[0] || "";
        const timePart = iso.split("T")[1]?.substring(0, 5) || "";
        return {
          ...row,
          sNo: i + 1,
          Date: datePart,
          InTime: timePart || row.InTime || "--",
          OutTime: row.OutTime || "--",
          Diagnosis: row.Diagnosis || "",
        };
      });
      setTableData(formatted);
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Failed to load treatment summaries");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };
 
  // 🔥 TREATMENT RECORD PATTERN: Auto-fill + clear on Patient_id change
  useEffect(() => {
    if (Patient_id) {
      handleClear(); // 🔥 Reset form with new patient data
      fetchList();
    }
  }, [Patient_id]);
 
  // 🔥 Auto-fill patient info when it changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      Name: PatientName,
      AgeSex: `${PatientAge || ""} / ${PatientGender || ""}`.trim(),
    }));
  }, [PatientName, PatientAge, PatientGender]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const adjustHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight + 4, 200);
    textarea.style.height = newHeight + "px";
  };
 
  const cleanDateTimeForBackend = (data) => {
    const cleaned = { ...data };
    const emptyToNull = ["Date", "InTime", "OutTime", "LamaDate", "LamaTime"];
    emptyToNull.forEach((field) => {
      if (cleaned[field] === "") cleaned[field] = null;
    });
    return cleaned;
  };
 
 
 
  // 🔥 FIXED: Multiple submit protection (TreatmentRecord pattern)
  const handleSubmit = async () => {
    if (!Patient_id || loading || submitDisabled) return alert("No patient selected");
   
    setSubmitDisabled(true); // 🔥 IMMEDIATE DISABLE
    setLoading(true);
   
    const cleaned = cleanDateTimeForBackend(formData);
    try {
      const payload = {
        Patient_id,
        Registration_id: Registration_Id,
        Employeeid,
        Created_by,
        formData: cleaned,
      };
      const res = await axios.post(POST_URL, payload);
      alert(res.data?.message || "Saved successfully!");
      handleClear();
      fetchList();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setSubmitDisabled(false); // 🔥 RE-ENABLE
    }
  };
 
  const handleUpdate = async () => {
    if (!selectedRecord?.Id || loading || submitDisabled) return alert("No record selected");
   
    setSubmitDisabled(true);
    setLoading(true);
    const cleaned = cleanDateTimeForBackend(formData);
    try {
      await axios.put(`${PUT_URL}${selectedRecord.Id}/`, {
        formData: cleaned,
        UpdatedBy: Created_by,
      });
      alert("Updated successfully!");
      handleClear();
      fetchList();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  };
 
  const onView = (row) => {
    setSelectedRecord(row);
    setFormData({ ...row });
    setIsViewMode(true);
    setIsEditMode(false);
    setSubmitDisabled(false);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };
 
  const frozenLengthsRef = React.useRef({});
 
  const handleFreezeOnFocus = (name, value) => {
  if (frozenLengthsRef.current[name] == null) {
    frozenLengthsRef.current[name] = value.length;
  }
};
 
const handleAppendOnlyChange = (name) => (e) => {
  const newValue = e.target.value;
  const frozenLength = frozenLengthsRef.current[name] ?? 0;
 
  // If user tries to edit frozen part → ignore
  if (newValue.length < frozenLength) return;
 
  if (
    newValue.slice(0, frozenLength) !==
    formData[name].slice(0, frozenLength)
  ) {
    return;
  }
 
  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};
 
const forceCursorToEnd = (e) => {
  const len = e.target.value.length;
  requestAnimationFrame(() => {
    e.target.setSelectionRange(len, len);
  });
};
 
const preventEditKeys = (e) => {
  const blockedKeys = ["Backspace", "Delete"];
  if (blockedKeys.includes(e.key)) {
    e.preventDefault();
  }
 
  // Block Ctrl+A / Cmd+A
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
    e.preventDefault();
  }
};
 
const guardFrozenCursor = (name) => (e) => {
  const frozenLength = frozenLengthsRef.current[name] ?? 0;
  const pos = e.target.selectionStart;
 
  if (pos < frozenLength) {
    requestAnimationFrame(() => {
      e.target.setSelectionRange(
        e.target.value.length,
        e.target.value.length
      );
    });
  }
};
 
 
 
 
  // const onEdit = (row) => {
  //   onView(row);
  //   setIsEditMode(true);
  // };
 
  const onEdit = (row) => {
  setFrozenData({
    Diagnosis: row.Diagnosis || "",
    History: row.History || "",
    Examination: row.Examination || "",
    Investigations: row.Investigations || "",
    Medications: row.Medications || "",
    Consultations: row.Consultations || "",
    DischargePlan: row.DischargePlan || "",
  });
 
  setFormData({ ...row });
  setSelectedRecord(row);
  setIsViewMode(true);
  setIsEditMode(true);
};
 
const handleFrozenAppendChange = (e, field) => {
  const newValue = e.target.value;
  const frozenValue = frozenData[field] || "";
 
  // Allow only if frozen text is untouched
  if (newValue.startsWith(frozenValue)) {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  } else {
    // Force revert if user tries to edit old text
    setFormData((prev) => ({
      ...prev,
      [field]: frozenValue + newValue.slice(frozenValue.length),
    }));
  }
};
 
 
 
 
  // 🔥 TREATMENT RECORD PATTERN: clearForm with auto-fill reset
  const handleClear = () => {
    setFormData({
      Name: PatientName, // 🔥 Auto-refill
      AgeSex: `${PatientAge || ""} / ${PatientGender || ""}`.trim(), // 🔥 Auto-refill
      Date: "", InTime: "", OutTime: "",
      PR: "", BP: "", RR: "", SPO2: "", GRBS: "", GCS: "", TEMP: "",
      VitalsOnArrival: "", Diagnosis: "", History: "", Examination: "",
      Investigations: "", Medications: "", Consultations: "", DischargePlan: "",
      PR_Dis: "", BP_Dis: "", RR_Dis: "", SPO2_Dis: "", GRBS_Dis: "", GCS_Dis: "", TEMP_Dis: "",
      LamaName: "", LamaDate: "", LamaTime: "",
      PatientRelativeName: "", PatientRelationship: "", WitnessSignature: "", DoctorSignature: "",
    });
    setSelectedRecord(null);
    setIsViewMode(false);
    setIsEditMode(false);
    setSubmitDisabled(false);
  };
 
  const openDeleteConfirm = (row) => {
    setSelectedRecord(row);
    setIsDeleteConfirmOpen(true);
  };
 
  const confirmDelete = async () => {
    if (!selectedRecord?.Id) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${DELETE_URL}${selectedRecord.Id}/`);
      alert("Deleted successfully");
      setIsDeleteConfirmOpen(false);
      handleClear();
      fetchList();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.error || err.message));
    } finally {
      setDeleteLoading(false);
    }
  };
 
  // 🔥 UNCOMMENT & FIX: Edit column + Multiple submit protection
  const columns = [
    { key: "sNo", name: "S.No"},
    { key: "Date", name: "Date"},
    { key: "time", name: "Time" },
    { key: "DoctorSignature", name: "Doctor Signature" },
    {
      key: "view",
      name: "View",
      renderCell: ({ row }) => (
        <button className="Min-junSeo-jun" onClick={() => onView(row)}>👁</button>
      ),
    },
    {
      key: "edit",
      name: "Edit",
      renderCell: ({ row }) => (
        <button className="Seo-junJi-ho" onClick={() => onEdit(row)}>✏️</button>
      ),
    },
  ];
 
  const isFormReadOnly = isViewMode && !isEditMode;
 
  return (
    <div className="Woo-jinTae-hyun">
      <div ref={formRef} className="ho-Jae-hyun">
        {/* PAGE 1 */}
        <div className="Jae-hyun-Dong-hyun">
          <div className="hyun-Min-jae">
            <h1>KARUNA MEDICAL COLLEGE HOSPITAL</h1>
            <p>Vilayodi, Chittur, Palakkad - 678103</p>
            <p>9496962555 | 9496972556 | 9496972557</p>
          </div>
          <div className="ung-ho-Kyung-min">
            <h2>DEPARTMENT OF EMERGENCY MEDICINE</h2>
          </div>
          <h3 className="-min-Sang-hoon">TREATMENT SUMMARY</h3>
          <div className="-hoon-Jun-ho">
            <div><label>Name:</label> <input type="text" name="Name" value={formData.Name} onChange={handleChange} disabled={isFormReadOnly} /></div>
            <div><label>Age & Sex:</label> <input type="text" name="AgeSex" value={formData.AgeSex} onChange={handleChange} disabled={isFormReadOnly} /></div>
            <div><label>Date:</label> <input type="date" name="Date" value={formData.Date} onChange={handleChange} disabled={isFormReadOnly} /></div>
            <div><label>In Time:</label> <input type="time" name="InTime" value={formData.InTime} onChange={handleChange} disabled={isFormReadOnly} /></div>
            <div><label>Out Time:</label> <input type="time" name="OutTime" value={formData.OutTime} onChange={handleChange} disabled={isFormReadOnly} /></div>
          </div>
          <h4 className="Kyung-min-Sang-hoon">VITALS ON ARRIVAL</h4>
          <table className="ang-hoon-Jun-ho">
            <thead><tr>{["PR", "BP", "RR", "SPO2", "GRBS", "GCS", "TEMP"].map((v) => <th key={v}>{v}</th>)}</tr></thead>
            <tbody><tr>{["PR", "BP", "RR", "SPO2", "GRBS", "GCS", "TEMP"].map((field) => (
              <td key={field}>
              <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onFocus={() => handleFreezeOnFocus(field, formData[field] || "")}
                  onChange={handleAppendOnlyChange(field)}
                  onClick={forceCursorToEnd}
                  onKeyUp={forceCursorToEnd}
                />
          </td>
            ))}</tr></tbody>
          </table>
          {/* {[
            ["Diagnosis", "DIAGNOSIS"], ["History", "HISTORY"], ["Examination", "EXAMINATION"], ["Investigations", "INVESTIGATIONS"],
          ].map(([field, label]) => (
            <div key={field} className="Kyung-min-Sang-hoon">
              <h4>{label}</h4>
              <textarea rows="4" name={field} value={formData[field] || ""} onChange={handleChange}  onInput={adjustHeight}  disabled={isViewMode || isEditMode}/>
            </div>
          ))} */}
 
 
          {[
  ["Diagnosis", "DIAGNOSIS"],
  ["History", "HISTORY"],
  ["Examination", "EXAMINATION"],
  ["Investigations", "INVESTIGATIONS"],
].map(([field, label]) => (
  <div key={field} className="Kyung-min-Sang-hoon">
    <h4>{label}</h4>
    <textarea
      rows="4"
      name={field}
      value={formData[field] || ""}
      disabled={isFormReadOnly}
      onInput={adjustHeight}
      onChange={(e) =>
        isEditMode
          ? handleFrozenAppendChange(e, field)
          : handleChange(e)
      }
    />
  </div>
))}
 
        </div>
 
        {/* PAGE 2 */}
        <div className="Jae-hyun-Dong-hyun">
          {/* {[
            ["Medications", "MEDICATIONS AND PROCEDURES DONE (IF ANY)"],
            ["Consultations", "CONSULTATIONS DONE (IF ANY)"],
            ["DischargePlan", "DISCHARGE / REFERRAL / LAMA"],
          ].map(([field, label]) => (
            <div key={field} className="Kyung-min-Sang-hoon">
              <h4>{label}</h4>
              <textarea rows="6" name={field} value={formData[field] || ""} onChange={handleChange} onInput={adjustHeight} disabled={isViewMode || isEditMode}/>
             
            </div>
          ))} */}
 
          {[
  ["Medications", "MEDICATIONS AND PROCEDURES DONE (IF ANY)"],
  ["Consultations", "CONSULTATIONS DONE (IF ANY)"],
  ["DischargePlan", "DISCHARGE / REFERRAL / LAMA"],
].map(([field, label]) => (
  <div key={field} className="Kyung-min-Sang-hoon">
    <h4>{label}</h4>
    <textarea
      rows="6"
      name={field}
      value={formData[field] || ""}
      disabled={isFormReadOnly}
      onInput={adjustHeight}
      onChange={(e) =>
        isEditMode
          ? handleFrozenAppendChange(e, field)
          : handleChange(e)
      }
    />
  </div>
))}
 
 
         
          <div className="Kyung-min-Sang-hoon">
            <h4 className="oon-Jun-ho">VITALS ON DISCHARGE / REFERRAL / LAMA</h4>
            <table className="ang-hoon-Jun-ho">
  <thead>
    <tr>
      {["PR_Dis", "BP_Dis", "RR_Dis", "SPO2_Dis", "GRBS_Dis", "GCS_Dis", "TEMP_Dis"].map((v) => (
        <th key={v}>{v.replace("_Dis", "")}</th>
      ))}
    </tr>
  </thead>
 
  <tbody>
    <tr>
      {["PR_Dis", "BP_Dis", "RR_Dis", "SPO2_Dis", "GRBS_Dis", "GCS_Dis", "TEMP_Dis"].map((field) => (
        <td key={field}>
          <input
            type="text"
            name={field}
            value={formData[field] || ""}
            onFocus={() => handleFreezeOnFocus(field, formData[field] || "")}
            onChange={handleAppendOnlyChange(field)}
            onClick={forceCursorToEnd}
            onKeyUp={forceCursorToEnd}
          />
        </td>
      ))}
    </tr>
  </tbody>
</table>
 
          </div>
          <div className="-hoon-Jun-ho-Byung-ho">
            <p className="-hoon-Jun-ho-Byung-ho-label">Name & Signature of the Doctor</p>
            <div className="-hoon-Jun-ho-Byung-ho-row">
              {/* <input type="text" name="DoctorSignature" value={formData.DoctorSignature} onChange={handleChange} disabled={isFormReadOnly} placeholder="Doctor's Name" /> */}
              <input
                  type="text"
                  name="DoctorSignature"
                  value={formData.DoctorSignature || ""}
                  placeholder="Doctor's Name"
                  onFocus={() =>
                    handleFreezeOnFocus("DoctorSignature", formData.DoctorSignature || "")
                  }
                  onChange={handleAppendOnlyChange("DoctorSignature")}
                  onClick={guardFrozenCursor("DoctorSignature")}
                  onKeyUp={guardFrozenCursor("DoctorSignature")}
                />
 
            </div>
          </div>
        </div>
      </div>
 
      {/* 🔥 FIXED BUTTONS: Multiple submit + TreatmentRecord pattern */}
      <div className="Main_container_Btn">
        {!isEditMode && !isViewMode ? (
          <>
            <button onClick={handleSubmit} disabled={loading || submitDisabled || !Patient_id}>
              {loading ? "⏳ Saving..." : "Submit"}
            </button>
            <button onClick={handleClear}>Clear</button>
          </>
        ) : isEditMode ? (
          <>
            <button onClick={handleUpdate} disabled={loading || submitDisabled}>
              {loading ? "⏳ Updating..." : "Update"}
            </button>
            <button onClick={handleClear}>Cancel</button>
          </>
        ) : (
          <button onClick={handleClear}>Close View</button>
        )}
        <button onClick={handlePrint} disabled={loading}>Print</button>
      </div>
 
      <div style={{ marginTop: 30 }}>
        <h3>Treatment Summary Records</h3>
        {loading ? <p>Loading records...</p> : <ReactGrid columns={columns} RowData={tableData} />}
      </div>
    </div>
  );
};
 
export default EmergencySummaryForm;