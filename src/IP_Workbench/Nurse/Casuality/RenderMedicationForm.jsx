
// // import React, { useRef, useState, useEffect } from "react";
// // import { useReactToPrint } from "react-to-print";
// // import "./MedicationForm.css";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";

// // const RenderMedicationForm = () => {
// //   const formRef = useRef();

// //    /* ---------------- AUTO RESIZE TEXTAREA ---------------- */
// //   const autoResize = (e) => {
// //     const textarea = e.target;
// //     textarea.style.height = "auto";
// //     textarea.style.height = textarea.scrollHeight + "px";
// //   };


// //   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
// //   const Created_by = useSelector((state) => state.userRecord?.username);

// //   const IP_DoctorWorkbenchNavigation = useSelector(
// //     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
// //   );

// //   // const Patient_id = IP_DoctorWorkbenchNavigation?.PatientId;
// //   const Patient_id = useSelector(
// //    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation?.PatientId
// //     );
 
// //   const Registration_id = IP_DoctorWorkbenchNavigation?.RegistrationId;

// //   console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation')
// //   /* ---------------- EMPTY ROW ---------------- */
// //   const emptyRow = {
// //     datetime: "",
// //     drug: "",
// //     dose: "",
// //     route: "",
// //     frequency: "",
// //     admin_time: "",
// //     doctor: "",
// //     nurse: "",
// //   };

// //   /* ---------------- FORM STATE ---------------- */
// //   const [form, setForm] = useState({
// //     records: Array.from({ length: 12 }).map(() => ({ ...emptyRow })),
// //     datetime: "",
// //     drug: "",
// //     dose: "",
// //     route: "",
// //     frequency: "",
// //     admin_time: "",
// //     doctor: "",
// //     nurse: "",
// //     consultation: ["", "", "", ""],
// //     final_diagnosis: "",
// //     admission: false,
// //     discharge: false,
// //     referral: false,
// //     lama: false,
// //     transfer_time: "",
// //     hr: "",
// //     bp: "",
// //     spo2: "",
// //     gcs: "",
// //     condition_during: "",
// //     prepared_by: Created_by || "",
// //   });

// //   const [tableData, setTableData] = useState([]);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [isViewMode, setIsViewMode] = useState(false);
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   /* ---------------- PRINT ---------------- */
// //   const handlePrint = useReactToPrint({
// //     content: () => formRef.current,
// //     documentTitle: "Medication_Record",
// //   });

// //   /* ---------------- FETCH LIST ---------------- */
  

// // const fetchList = async () => {
// //   if (!Patient_id || !UrlLink) return;

// //   try {
// //     setLoading(true);

// //     const res = await axios.get(
// //       `${UrlLink}Ip_Workbench/get_medication_forms/${Patient_id}/`
// //     );

// //     // ✅ BACKEND RETURNS ARRAY DIRECTLY
// //     const rawData = Array.isArray(res.data) ? res.data : [];

// //     setTableData(
// //       rawData.map((row, index) => {
// //         const [date, time] = row.CreatedDate?.includes(" ")
// //           ? row.CreatedDate.split(" ")
// //           : ["--", "--"];

// //         return {
// //           ...row,
// //           sNo: index + 1,
// //           date: date,
// //           time: time || "--",
// //         };
// //       })
// //     );

// //   } catch (err) {
// //     console.error("Fetch Error:", err);
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// // useEffect(() => {
// //   console.log("Table Data:", tableData);
// // }, [tableData]);

// // useEffect(() => {
// //   if (Patient_id && UrlLink) {
// //     fetchList();
// //   }
// // }, [Patient_id, UrlLink]);

// // useEffect(() => {
// //   console.log("Patient ID:", Patient_id);
// //   console.log("UrlLink:", UrlLink);
// // }, [Patient_id, UrlLink]);

// //   /* ---------------- ROW HANDLING ---------------- */
// //   const updateRow = (index, key, value) => {
// //     setForm((prev) => {
// //       const records = [...prev.records];
// //       records[index] = { ...records[index], [key]: value };
// //       return { ...prev, records };
// //     });
// //   };

// //   const addRow = () =>
// //     setForm((prev) => ({
// //       ...prev,
// //       records: [...prev.records, { ...emptyRow }],
// //     }));

// //   const removeRow = () =>
// //     setForm((prev) => ({
// //       ...prev,
// //       records: prev.records.length > 1 ? prev.records.slice(0, -1) : prev.records,
// //     }));

// //   /* ---------------- SUBMIT ---------------- */
// //   const handleSubmit = async () => {
// //     const validRows = form.records.filter((r) =>
// //       Object.values(r).some((v) => v)
// //     );

// //     // if (!validRows.length) {
// //     //   alert("❌ Please fill at least one medication record");
// //     //   return;
// //     // }

// //     setLoading(true);
// //     try {
// //       await axios.post(
// //         `${UrlLink}Ip_Workbench/Medication_Record_Details_Link`,
// //         {
// //           Patient_id,
// //           registration_id: Registration_id,
// //           created_by: Created_by,
// //           ...form,
// //           records: validRows,
// //         }
// //       );

// //       alert("✔ Submitted Successfully");
// //       handleClear();
// //       fetchList();
// //     } catch (err) {
// //       alert("❌ Save Failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------------- VIEW ---------------- */


// //   const handleView = (row) => {
// //   setSelectedRecord(row);

// //   setForm({
// //     records: [
// //       {
// //         datetime: row.datetime || "",
// //         drug: row.drug || "",
// //         dose: row.dose || "",
// //         route: row.route || "",
// //         frequency: row.frequency || "",
// //         admin_time: row.admin_time || "",
// //         doctor: row.doctor || "",
// //         nurse: row.nurse || "",
// //       },
// //     ],
// //     consultation: row.consultation || ["", "", "", ""],
// //     // final_diagnosis: row.final_diagnosis || "",
// //     final_diagnosis: row.final_diagnosis || "",
// //     admission: row.admission || false,
// //     discharge: row.discharge || false,
// //     referral: row.referral || false,
// //     lama: row.lama || false,
// //     transfer_time: row.transfer_time || "",
// //     hr: row.hr || "",
// //     bp: row.bp || "",
// //     spo2: row.spo2 || "",
// //     gcs: row.gcs || "",
// //     // condition_during: row.condition_during || "",
// //     condition_during: row.condition_during || "",
// //     prepared_by: row.prepared_by || "",
// //   });

// //   setIsViewMode(true);
// //   setIsEditMode(false);

// //   // scroll to form
// //   formRef.current?.scrollIntoView({ behavior: "smooth" });
// // };


// //   /* ---------------- EDIT ---------------- */
// //   const handleEdit = (row) => {
// //     handleView(row);
// //     setIsEditMode(true);
// //     setIsViewMode(false);
// //   };

// //   /* ---------------- UPDATE ---------------- */
// //   const handleUpdate = async () => {
// //     if (!selectedRecord?.id) return;

// //     setLoading(true);
// //     try {
// //       await axios.put(
// //         `${UrlLink}Ip_Workbench/update_Medication_Record/${selectedRecord.id}/`,
// //         {
// //           Patient_id,
// //           registration_id: Registration_id,
// //           created_by: Created_by,
// //           ...form,
// //         }
// //       );

// //       alert("✔ Updated Successfully");
// //       handleClear();
// //       fetchList();
// //     } catch {
// //       alert("❌ Update Failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------------- CLEAR ---------------- */
// //   const handleClear = () => {
// //     setForm({
// //       records: Array.from({ length: 12 }).map(() => ({ ...emptyRow })),
// //       consultation: ["", "", "", ""],
// //       final_diagnosis: "",
// //       admission: false,
// //       discharge: false,
// //       referral: false,
// //       lama: false,
// //       transfer_time: "",
// //       hr: "",
// //       bp: "",
// //       spo2: "",
// //       gcs: "",
// //       condition_during: "",
// //       prepared_by: Created_by || "",
// //     });
// //     setSelectedRecord(null);
// //     setIsViewMode(false);
// //     setIsEditMode(false);
// //   };

// //   const isReadOnly = isViewMode && !isEditMode;

// //   /* ---------------- GRID ---------------- */
// //   const columns = [
// //     { key: "sNo", name: "S.No" },
// //     { key: "date", name: "Date" },
// //     { key: "time", name: "Time" },
// //     {
// //       key: "view",
// //       name: "View",
// //       renderCell: ({ row }) => (
// //         <button className="view-btn" onClick={() => handleView(row)}>👁</button>
// //       ),
// //     },
// //     // {
// //     //   key: "edit",
// //     //   name: "Edit",
// //     //   renderCell: ({ row }) => (
// //     //     <button className="edit-btn" onClick={() => handleEdit(row)}>✏️</button>
// //     //   ),
// //     // },
// //   ];

// //   /* ---------------- UI ---------------- */
// //   return (
// //     <div className="med-root">
// //       <div className="med-form-wrap" ref={formRef}>
// //         <h2 className="med-main-title">MEDICATIONS</h2>

// //         {/* MEDICATION TABLE */}
// //         <table className="med-table">
// //           <thead>
// //             <tr>
// //               <th>Date & Time</th>
// //               <th>Drug</th>
// //               <th>Dose</th>
// //               <th>Route</th>
// //               <th>Frequency</th>
// //               <th>Admin Time</th>
// //               <th>Doctor</th>
// //               <th>Nurse</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {form.records.map((row, i) => (
// //               <tr key={i}>
// //                 <td><input type="datetime-local" value={row.datetime} onChange={e => updateRow(i, "datetime", e.target.value)} disabled={isReadOnly} /></td>
// //                 <td><input value={row.drug} onChange={e => updateRow(i, "drug", e.target.value)} disabled={isReadOnly} /></td>
// //                 <td><input value={row.dose} onChange={e => updateRow(i, "dose", e.target.value)} disabled={isReadOnly} /></td>
// //                 <td><input value={row.route} onChange={e => updateRow(i, "route", e.target.value)} disabled={isReadOnly} /></td>
// //                 <td><input value={row.frequency} onChange={e => updateRow(i, "frequency", e.target.value)} disabled={isReadOnly} /></td>
// //                 <td><input type="time" value={row.admin_time} onChange={e => updateRow(i, "admin_time", e.target.value)} disabled={isReadOnly} /></td>
// //                 <td><input value={row.doctor} onChange={e => updateRow(i, "doctor", e.target.value)} disabled={isReadOnly} /></td>
// //                 <td><input value={row.nurse} onChange={e => updateRow(i, "nurse", e.target.value)} disabled={isReadOnly} /></td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //         {/* CONSULTATION */}
// //         <div className="med-section">
// //           <label className="med-section-title">Consultation & Informed Time</label>
// //           {form.consultation.map((c, i) => (
// //             <div key={i}>{i + 1})
// //                <input value={c} disabled={isReadOnly}
// //                 onChange={e => {
// //                   const arr = [...form.consultation];
// //                   arr[i] = e.target.value;
// //                   setForm({ ...form, consultation: arr });
// //                 }} />
               

// //             </div>
// //           ))}
// //         </div>

// //         {/* FINAL DIAGNOSIS */}
// //         <div className="med-section">
// //           <label className="med-section-title">FINAL DIAGNOSIS</label>
// //           {/* <textarea className="med-large-area" rows={5} value={form.final_diagnosis} disabled={isReadOnly}
// //             onChange={e => setForm({ ...form, final_diagnosis: e.target.value })} /> */}
// //             <textarea
// //   value={form.final_diagnosis}
// //   onChange={e => setForm({ ...form, final_diagnosis: e.target.value })}
// //   onInput={autoResize}
// //   rows={2}
// //   style={{ overflow: "hidden", resize: "none" }}
// // />

// //         </div>

// //         {/* STATUS */}
// //         <div className="med-check-section">
// //           {["admission", "discharge", "referral", "lama"].map(key => (
// //             <label key={key}>
// //               <input type="checkbox" checked={form[key]} disabled={isReadOnly}
// //                 onChange={e => setForm({ ...form, [key]: e.target.checked })} />
// //               {key.toUpperCase()}
// //             </label>
// //           ))}
// //           <span>
// //             Transfer Time:
// //             <input type="time" value={form.transfer_time} disabled={isReadOnly}
// //               onChange={e => setForm({ ...form, transfer_time: e.target.value })} />
// //           </span>
// //         </div>

// //         {/* VITALS */}
// //         <div className="med-transfers">
// //           {["hr", "bp", "spo2", "gcs"].map(v => (
// //             <div key={v}>
// //               {v.toUpperCase()}:
// //               <input value={form[v]} disabled={isReadOnly}
// //                 onChange={e => setForm({ ...form, [v]: e.target.value })} />
// //             </div>
// //           ))}
// //         </div>

// //         {/* CONDITION */}
// //         <div className="med-section">
// //           <label className="med-section-title">CONDITION DURING TRANSFER</label>
// //           {/* <textarea className="med-large-area" rows={5} value={form.condition_during} disabled={isReadOnly}
// //             onChange={e => setForm({ ...form, condition_during: e.target.value })} /> */}
// //             <textarea
// //   value={form.condition_during}
// //   onChange={e => setForm({ ...form, condition_during: e.target.value })}
// //   onInput={autoResize}
// //   rows={2}
// //   style={{ overflow: "hidden", resize: "none" }}
// // />

// //         </div>
// //       </div>

// //       {/* ACTIONS */}
// //       <div className="Main_container_Btn">
// //         <button onClick={handlePrint}> Print</button>

// //         {!isEditMode ? (
// //           <button onClick={handleSubmit} disabled={loading}> Submit</button>
// //         ) : (
// //           <>
// //             <button onClick={handleUpdate} disabled={loading}>✔ Update</button>
// //             <button onClick={handleClear}>Cancel</button>
// //           </>
// //         )}

// //         <button onClick={addRow}>＋ Row</button>
// //         <button onClick={removeRow}>－ Row</button>
// //       </div>

// //       <ReactGrid columns={columns} RowData={tableData} />
// //     </div>
// //   );
// // };

// // export default RenderMedicationForm;









// import React, { useRef, useState, useEffect, useCallback } from "react";
// import { useReactToPrint } from "react-to-print";
// import "./MedicationForm.css";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";

// const RenderMedicationForm = () => {
//   const formRef = useRef();
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const Created_by = useSelector((state) => state.userRecord?.username || "Unknown");

//   // 🔥 SAFE SELECTORS
//   const IP_DoctorWorkbenchNavigation = useSelector(
//     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
//   );
//   const DoctorWorkbenchNavigation = useSelector(
//     (state) => state.Frontoffice?.DoctorWorkbenchNavigation
//   );

//   const Patient_id = IP_DoctorWorkbenchNavigation?.PatientId || 
//                     DoctorWorkbenchNavigation?.PatientId || null;
//   const Registration_id = IP_DoctorWorkbenchNavigation?.RegistrationId || 
//                          DoctorWorkbenchNavigation?.RegistrationId ||
//                          IP_DoctorWorkbenchNavigation?.Registration_Id || 
//                          DoctorWorkbenchNavigation?.Registration_Id || null;

//   console.log("🔥 Patient_id:", Patient_id);
//   console.log("🔥 UrlLink:", UrlLink);

//   // 🔥 EMPTY ROW DEFINITION
//   const emptyRow = {
//     datetime: "",
//     drug: "",
//     dose: "",
//     route: "",
//     frequency: "",
//     admin_time: "",
//     doctor: "",
//     nurse: "",
//   };

//   // 🔥 STATES
//   const [tableData, setTableData] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [submitDisabled, setSubmitDisabled] = useState(false);

//   const [formData, setFormData] = useState({
//     records: [emptyRow],
//     consultation: ["", "", "", ""],
//     final_diagnosis: "",
//     admission: false,
//     discharge: false,
//     referral: false,
//     lama: false,
//     transfer_time: "",
//     hr: "",
//     bp: "",
//     spo2: "",
//     gcs: "",
//     condition_during: "",
//     prepared_by: Created_by,
//   });

//   const adjustHeight = (e) => {
//     const textarea = e.target;
//     textarea.style.height = "auto";
//     const newHeight = Math.min(textarea.scrollHeight + 4, 200);
//     textarea.style.height = newHeight + "px";
//   };


//   // 🔥 PRINT
//   const handlePrint = useReactToPrint({
//     content: () => formRef.current,
//     documentTitle: `Medication_Record_${Patient_id || "Patient"}`,
//   });

//   // 🔥 FIXED FETCH - Groups records by submission time
//   const fetchList = useCallback(async () => {
//     if (!Patient_id || !UrlLink) return;

//     try {
//       setLoading(true);
//       const response = await axios.get(`${UrlLink}Ip_Workbench/get_medication_forms/${Patient_id}/`);
//       const rawData = Array.isArray(response.data) ? response.data : [];

//       console.log("🔥 Raw API data:", rawData);

//       // 🔥 GROUP RECORDS BY SAME CREATION TIME (same submission)
//       const submissions = new Map();
      
//       rawData.forEach(record => {
//         // Extract time key (date + time up to minutes)
//         const createdDate = record.CreatedDate || "";
//         const timeKey = createdDate.includes("T") 
//           ? createdDate.split("T")[0] + " " + createdDate.split("T")[1]?.substring(0, 16)
//           : createdDate.substring(0, 16); // YYYY-MM-DD HH:MM
        
//         if (!submissions.has(timeKey)) {
//           submissions.set(timeKey, []);
//         }
//         submissions.get(timeKey).push(record);
//       });

//       // Convert grouped data to display format
//       const groupedRecords = Array.from(submissions.entries()).map(([timeKey, records], index) => {
//         const firstRecord = records[0];
//         const datePart = timeKey.split(' ')[0];
//         const timePart = timeKey.split(' ')[1]?.substring(0, 5) || '--';
        
//         return {
//           groupId: timeKey,
//           id: firstRecord.id,  // Use first record ID for operations
//           records: records,    // ALL rows from this submission
//           count: records.length,
//           sNo: index + 1,
//           Date: datePart,
//           Time: timePart,
//           Patient_id: firstRecord.Patient_id,
//           consultation: firstRecord.consultation,
//           final_diagnosis: firstRecord.final_diagnosis,
//           admission: firstRecord.admission,
//           discharge: firstRecord.discharge,
//           referral: firstRecord.referral,
//           lama: firstRecord.lama,
//           transfer_time: firstRecord.transfer_time,
//           hr: firstRecord.hr,
//           bp: firstRecord.bp,
//           spo2: firstRecord.spo2,
//           gcs: firstRecord.gcs,
//           condition_during: firstRecord.condition_during,
//           prepared_by: firstRecord.prepared_by,
//         };
//       });

//       console.log("🔥 Grouped records:", groupedRecords);
//       setTableData(groupedRecords);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       setTableData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [Patient_id, UrlLink]);

//   useEffect(() => {
//     if (Patient_id && UrlLink) {
//       handleClear();
//       fetchList();
//     }
//   }, [Patient_id, UrlLink, fetchList]);

//   // 🔥 ROW OPERATIONS
//   const addRow = () => {
//     setFormData(prev => ({
//       ...prev,
//       records: [...prev.records, { ...emptyRow }]
//     }));
//   };

//   const removeRow = () => {
//     setFormData(prev => {
//       if (prev.records.length <= 1) return prev;
//       return {
//         ...prev,
//         records: prev.records.slice(0, -1)
//       };
//     });
//   };

//   const updateRow = (index, key, value) => {
//     setFormData(prev => {
//       if (!prev.records[index]) return prev;
//       const records = [...prev.records];
//       records[index] = { ...records[index], [key]: value || "" };
//       return { ...prev, records };
//     });
//   };

//   const updateField = (key, value) => {
//     setFormData(prev => ({ 
//       ...prev, 
//       [key]: value === undefined || value === null ? "" : value 
//     }));
//   };

//   const updateConsultation = (index, value) => {
//     setFormData(prev => {
//       const consultation = [...(prev.consultation || ["", "", "", ""])];
//       consultation[index] = value || "";
//       return { ...prev, consultation };
//     });
//   };

//   // 🔥 SUBMIT - Send ALL rows (backend creates multiple records)
//   const handleSubmit = async () => {
//     if (!Patient_id || loading || submitDisabled) {
//       alert("Please select a patient first");
//       return;
//     }

//     const validRows = formData.records.filter(row => 
//       Object.values(row).some(val => val && String(val).trim() !== "")
//     );

//     if (!validRows.length) {
//       alert("Please fill at least one medication row");
//       return;
//     }

//     setSubmitDisabled(true);
//     setLoading(true);

//     try {
//       const payload = {
//         Patient_id,
//         registration_id: Registration_id,
//         created_by: Created_by,
//         records: validRows, // 🔥 Backend creates 1 record per row
//         consultation: formData.consultation,
//         final_diagnosis: formData.final_diagnosis,
//         admission: formData.admission,
//         discharge: formData.discharge,
//         referral: formData.referral,
//         lama: formData.lama,
//         transfer_time: formData.transfer_time,
//         hr: formData.hr,
//         bp: formData.bp,
//         spo2: formData.spo2,
//         gcs: formData.gcs,
//         condition_during: formData.condition_during,
//         prepared_by: Created_by,
//       };

//       console.log("🔥 Submitting", validRows.length, "rows");
      
//       await axios.post(`${UrlLink}Ip_Workbench/Medication_Record_Details_Link`, payload);
//       alert(`✔ Saved ${validRows.length} medication${validRows.length > 1 ? 's' : ''}`);
//       handleClear();
//       fetchList();
//     } catch (error) {
//       console.error("Submit Error:", error);
//       alert(`❌ Save failed: ${error.response?.data?.error || error.message}`);
//     } finally {
//       setLoading(false);
//       setSubmitDisabled(false);
//     }
//   };

//   // 🔥 FIXED VIEW - Shows ALL rows from group
//   const handleView = (row) => {
//     if (!row) return;

//     setSelectedRecord(row);
    
//     setFormData({
//       records: row.records || [emptyRow],  // 🔥 ALL rows from this submission
//       consultation: Array.isArray(row.consultation) ? row.consultation : ["", "", "", ""],
//       final_diagnosis: row.final_diagnosis || "",
//       admission: Boolean(row.admission),
//       discharge: Boolean(row.discharge),
//       referral: Boolean(row.referral),
//       lama: Boolean(row.lama),
//       transfer_time: row.transfer_time || "",
//       hr: row.hr || "",
//       bp: row.bp || "",
//       spo2: row.spo2 || "",
//       gcs: row.gcs || "",
//       condition_during: row.condition_during || "",
//       prepared_by: row.prepared_by || Created_by,
//     });
//     setIsViewMode(true);
//     setIsEditMode(false);
//   };

//   const handleEdit = (row) => {
//     handleView(row);
//     setIsEditMode(true);
//     setIsViewMode(false);
//   };

//   // 🔥 UPDATE - Updates first record in group (form fields)
//   const handleUpdate = async () => {
//     if (!selectedRecord?.id) {
//       alert("No record selected for update");
//       return;
//     }

//     setSubmitDisabled(true);
//     setLoading(true);

//     try {
//       // Update first record in group with form fields
//       await axios.put(`${UrlLink}Ip_Workbench/update_Medication_Record/${selectedRecord.id}/`, {
//         Patient_id,
//         registration_id: Registration_id,
//         created_by: Created_by,
//         // Send first row as individual record for medication update
//         datetime: formData.records[0]?.datetime || "",
//         drug: formData.records[0]?.drug || "",
//         dose: formData.records[0]?.dose || "",
//         route: formData.records[0]?.route || "",
//         frequency: formData.records[0]?.frequency || "",
//         admin_time: formData.records[0]?.admin_time || "",
//         doctor: formData.records[0]?.doctor || "",
//         nurse: formData.records[0]?.nurse || "",
//         consultation: formData.consultation,
//         final_diagnosis: formData.final_diagnosis,
//         admission: formData.admission,
//         discharge: formData.discharge,
//         referral: formData.referral,
//         lama: formData.lama,
//         transfer_time: formData.transfer_time,
//         hr: formData.hr,
//         bp: formData.bp,
//         spo2: formData.spo2,
//         gcs: formData.gcs,
//         condition_during: formData.condition_during,
//         prepared_by: Created_by,
//       });
      
//       alert("✔ Updated successfully");
//       handleClear();
//       fetchList();
//     } catch (error) {
//       console.error("Update Error:", error);
//       alert(`❌ Update failed: ${error.response?.data?.error || error.message}`);
//     } finally {
//       setLoading(false);
//       setSubmitDisabled(false);
//     }
//   };

//   const handleClear = () => {
//     setFormData({
//       records: [emptyRow],
//       consultation: ["", "", "", ""],
//       final_diagnosis: "",
//       admission: false,
//       discharge: false,
//       referral: false,
//       lama: false,
//       transfer_time: "",
//       hr: "",
//       bp: "",
//       spo2: "",
//       gcs: "",
//       condition_during: "",
//       prepared_by: Created_by,
//     });
//     setSelectedRecord(null);
//     setIsViewMode(false);
//     setIsEditMode(false);
//     setSubmitDisabled(false);
//   };

//   const isFormReadOnly = isViewMode && !isEditMode;

//   // 🔥 FIXED COLUMNS - Shows row count
//   const columns = [
//     { key: "sNo", name: "S.No" },
//     { key: "Date", name: "Date" },
//     { key: "Time", name: "Time" },
//     // {
//     //   key: "count", 
//     //   name: "Rows", 
//     //   renderCell: ({ row }) => (
//     //     <strong style={{ color: '#007bff' }}>
//     //       {row.count} meds
//     //     </strong>
//     //   ),
//     // },
//     {
//       key: "view",
//       name: "View",
//       renderCell: ({ row }) => (
//         <button 
//           className="view-btn" 
//           onClick={() => handleView(row)}
//           disabled={loading}
//           style={{ padding: '5px 10px' }}
//         >
//           👁
//         </button>
//       ),
//     },
//     // {
//     //   key: "edit",
//     //   name: "Edit",
//     //   renderCell: ({ row }) => (
//     //     <button 
//     //       className="edit-btn" 
//     //       onClick={() => handleEdit(row)}
//     //       disabled={loading}
//     //       style={{ padding: '5px 10px' }}
//     //     >
//     //       ✏️
//     //     </button>
//     //   ),
//     // },
//   ];

//   return (
//     <div className="med-root">
//       {/* 🔥 FORM CONTAINER */}
//       <div ref={formRef} className="med-form-wrap">
//         <h2 className="med-main-title">MEDICATION RECORD</h2>

//         {/* 🔥 MEDICATION TABLE - MULTIPLE ROWS ✅ */}
//         <table className="med-table">
//           <thead>
//             <tr>
//               <th>Date & Time</th>
//               <th>Drug</th>
//               <th>Dose</th>
//               <th>Route</th>
//               <th>Frequency</th>
//               <th>Admin Time</th>
//               <th>Doctor</th>
//               <th>Nurse</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.records.map((row, index) => (
//               <tr key={index}>
//                 <td>
//                   <input 
//                     type="datetime-local" 
//                     value={row.datetime || ""} 
//                     onChange={(e) => updateRow(index, "datetime", e.target.value)} 
//                     disabled={isFormReadOnly || loading} 
//                   />
//                 </td>
//                 <td>
//                   <input 
//                     value={row.drug || ""} 
//                     onChange={(e) => updateRow(index, "drug", e.target.value)} 
//                     disabled={isFormReadOnly || loading} 
//                   />
//                 </td>
//                 <td>
//                   <input 
//                     value={row.dose || ""} 
//                     onChange={(e) => updateRow(index, "dose", e.target.value)} 
//                     disabled={isFormReadOnly || loading} 
//                   />
//                 </td>
//                 <td>
//                   <input 
//                     value={row.route || ""} 
//                     onChange={(e) => updateRow(index, "route", e.target.value)} 
//                     disabled={isFormReadOnly || loading} 
//                   />
//                 </td>
//                 <td>
//                   <input 
//                     value={row.frequency || ""} 
//                     onChange={(e) => updateRow(index, "frequency", e.target.value)} 
//                     disabled={isFormReadOnly || loading} 
//                   />
//                 </td>
//                 <td>
//                   <input 
//                     type="time" 
//                     value={row.admin_time || ""} 
//                     onChange={(e) => updateRow(index, "admin_time", e.target.value)} 
//                     disabled={isFormReadOnly || loading} 
//                   />
//                 </td>
//                 <td>
//                   <input 
//                     value={row.doctor || ""} 
//                     onChange={(e) => updateRow(index, "doctor", e.target.value)} 
//                     disabled={isFormReadOnly || loading} 
//                   />
//                 </td>
//                 <td>
//                   <input 
//                     value={row.nurse || ""} 
//                     onChange={(e) => updateRow(index, "nurse", e.target.value)} 
//                     disabled={isFormReadOnly || loading} 
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* 🔥 ROW CONTROLS */}
//         {!isFormReadOnly && !loading && (
//           <div style={{ margin: '10px 0', display: 'flex', gap: '10px' }}>
//             <button onClick={addRow} className="btn-add-row" disabled={loading}>
//               ＋ Add Row
//             </button>
//             {formData.records.length > 1 && (
//               <button onClick={removeRow} className="btn-remove-row" disabled={loading}>
//                 － Remove Row
//               </button>
//             )}
//           </div>
//         )}

//         {/* ALL OTHER FIELDS - UNCHANGED */}
//         <div className="med-section">
//           <label className="med-section-title">Consultation & Informed Time</label>
//           {(formData.consultation || ["", "", "", ""]).map((consult, index) => (
//             <div key={index} style={{ marginBottom: '8px' }}>
//               <strong>{index + 1}.</strong>{' '}
//               <input 
//                 value={consult || ""} 
//                 disabled={isFormReadOnly || loading}
//                 onChange={(e) => updateConsultation(index, e.target.value)}
//                 style={{ width: '70%', marginLeft: '5px' }}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="med-section">
//           <label className="med-section-title">FINAL DIAGNOSIS</label>
//           <textarea 
//             value={formData.final_diagnosis || ""} 
//             disabled={isFormReadOnly || loading}
//             onChange={(e) => updateField("final_diagnosis", e.target.value)}
//             rows={7} 
//             style={{ width: '100%', resize: 'vertical' }}
//             onInput={adjustHeight}
//           />
//         </div>

//         <div className="med-check-section">
//           {["admission", "discharge", "referral", "lama"].map(key => (
//             <label key={key}>
//               <input 
//                 type="checkbox" 
//                 checked={Boolean(formData[key])} 
//                 disabled={isFormReadOnly || loading}
//                 onChange={(e) => updateField(key, e.target.checked)} 
//               />
//               {key.toUpperCase()}
//             </label>
//           ))}
//           <div style={{ marginTop: '10px' }}>
//             Transfer Time: 
//             <input 
//               type="time" 
//               value={formData.transfer_time || ""} 
//               disabled={isFormReadOnly || loading}
//               onChange={(e) => updateField("transfer_time", e.target.value)} 
//             />
//           </div>
//         </div>

//         <div className="med-vitals-section" style={{ margin: '15px 0' }}>
//           {["hr", "bp", "spo2", "gcs"].map(vital => (
//             <div key={vital} style={{ marginRight: '20px', display: 'inline-block' }}>
//               <label>{vital.toUpperCase()}:</label>
//               <input 
//                 value={formData[vital] || ""} 
//                 disabled={isFormReadOnly || loading}
//                 onChange={(e) => updateField(vital, e.target.value)}
//                 style={{ width: '70px', marginLeft: '5px' }}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="med-section">
//           <label className="med-section-title">CONDITION DURING TRANSFER</label>
//           <textarea 
//             value={formData.condition_during || ""} 
//             disabled={isFormReadOnly || loading}
//             onChange={(e) => updateField("condition_during", e.target.value)}
//             rows={7} 
//             style={{ width: '100%', resize: 'vertical' }}
//             onInput={adjustHeight}
//           />
//         </div>

//         {/* <div className="med-section">
//           <label>Prepared by:</label>
//           <input 
//             value={formData.prepared_by || Created_by} 
//             disabled 
//             style={{ width: '250px', marginLeft: '10px' }}
//           />
//         </div> */}
//       </div>

//       {/* BUTTONS */}
//       {/* <div className="Main_container_Btn" style={{ margin: '20px 0' }}>
//         {!isEditMode && !isViewMode ? (
//           <>
//             <button 
//               onClick={handleSubmit} 
//               disabled={loading || submitDisabled || !Patient_id}
//             >
//               {loading ? "⏳ Saving..." : `Submit ${formData.records.filter(r => 
//                 Object.values(r).some(v => v && String(v).trim() !== ""))?.length || 0} rows as 1 record`}
//             </button>
//             <button onClick={handleClear} disabled={loading}>Clear</button>
//           </>
//         ) : isEditMode ? (
//           <>
//             <button 
//               onClick={handleUpdate} 
//               disabled={loading || submitDisabled}
//             >
//               {loading ? "⏳ Updating..." : "Update"}
//             </button>
//             <button onClick={handleClear} disabled={loading}>Cancel</button>
//           </>
//         ) : (
//           <button onClick={handleClear} disabled={loading}>Close View</button>
//         )}
//         <button onClick={handlePrint} disabled={loading}>Print</button> */}

//          <div className="Main_container_Btn">
//         <button onClick={handlePrint}> Print</button>

//         {!isEditMode ? (
//           <button onClick={handleSubmit} disabled={loading}> Submit</button>
//         ) : (
//           <>
//             <button onClick={handleUpdate} disabled={loading}>✔ Update</button>
//             <button onClick={handleClear}>Cancel</button>
//           </>
//         )}
//       </div>

//       {/* RECORDS GRID */}
//       <div style={{ marginTop: '30px' }}>
//         <h3>Medication Records ({tableData.length})</h3>
//         {loading ? (
//           <p>Loading records...</p>
//         ) : tableData.length === 0 ? (
//           <p>No medication records found</p>
//         ) : (
//           <ReactGrid columns={columns} RowData={tableData} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default RenderMedicationForm;





import React, { useRef, useState, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import "./MedicationForm.css";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";

const RenderMedicationForm = () => {
  const formRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const Created_by = useSelector((state) => state.userRecord?.username || "Unknown");

  // 🔥 SAFE SELECTORS
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );

  const Patient_id = IP_DoctorWorkbenchNavigation?.PatientId || 
                    DoctorWorkbenchNavigation?.PatientId || null;
  const Registration_id = IP_DoctorWorkbenchNavigation?.RegistrationId || 
                         DoctorWorkbenchNavigation?.RegistrationId ||
                         IP_DoctorWorkbenchNavigation?.Registration_Id || 
                         DoctorWorkbenchNavigation?.Registration_Id || null;

  console.log("🔥 Patient_id:", Patient_id);
  console.log("🔥 UrlLink:", UrlLink);

  // 🔥 EMPTY ROW DEFINITION
  const emptyRow = {
    datetime: "",
    drug: "",
    dose: "",
    route: "",
    frequency: "",
    admin_time: "",
    doctor: "",
    nurse: "",
  };

  // 🔥 STATES
  const [tableData, setTableData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [originalFormData, setOriginalFormData] = useState(null);
  const isEditAppendMode = isEditMode && originalFormData;
  // const isOldRow = Boolean(originalFormData?.records?.[index]);


  const [formData, setFormData] = useState({
    records: [emptyRow],
    consultation: ["", "", "", ""],
    final_diagnosis: "",
    admission: false,
    discharge: false,
    referral: false,
    lama: false,
    transfer_time: "",
    hr: "",
    bp: "",
    spo2: "",
    gcs: "",
    condition_during: "",
    prepared_by: Created_by,
  });

   const adjustHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight + 4, 200);
    textarea.style.height = newHeight + "px";
  };

  // 🔥 PRINT
  const handlePrint = useReactToPrint({
    content: () => formRef.current,
    documentTitle: `Medication_Record_${Patient_id || "Patient"}`,
  });

  // 🔥 FIXED FETCH - Groups records by submission time
  const fetchList = useCallback(async () => {
    if (!Patient_id || !UrlLink) return;

    try {
      setLoading(true);
      const response = await axios.get(`${UrlLink}Ip_Workbench/get_medication_forms/${Patient_id}/`);
      const rawData = Array.isArray(response.data) ? response.data : [];

      console.log("🔥 Raw API data:", rawData);

      // 🔥 GROUP RECORDS BY SAME CREATION TIME (same submission)
      const submissions = new Map();
      
      rawData.forEach(record => {
        // Extract time key (date + time up to minutes)
        const createdDate = record.CreatedDate || "";
        const timeKey = createdDate.includes("T") 
          ? createdDate.split("T")[0] + " " + createdDate.split("T")[1]?.substring(0, 16)
          : createdDate.substring(0, 16); // YYYY-MM-DD HH:MM
        
        if (!submissions.has(timeKey)) {
          submissions.set(timeKey, []);
        }
        submissions.get(timeKey).push(record);
      });

      // Convert grouped data to display format
      const groupedRecords = Array.from(submissions.entries()).map(([timeKey, records], index) => {
        const firstRecord = records[0];
        const datePart = timeKey.split(' ')[0];
        const timePart = timeKey.split(' ')[1]?.substring(0, 5) || '--';
        
        return {
          groupId: timeKey,
          id: firstRecord.id,  // Use first record ID for operations
          records: records,    // ALL rows from this submission
          count: records.length,
          sNo: index + 1,
          Date: datePart,
          Time: timePart,
          Patient_id: firstRecord.Patient_id,
          consultation: firstRecord.consultation,
          final_diagnosis: firstRecord.final_diagnosis,
          admission: firstRecord.admission,
          discharge: firstRecord.discharge,
          referral: firstRecord.referral,
          lama: firstRecord.lama,
          transfer_time: firstRecord.transfer_time,
          hr: firstRecord.hr,
          bp: firstRecord.bp,
          spo2: firstRecord.spo2,
          gcs: firstRecord.gcs,
          condition_during: firstRecord.condition_during,
          prepared_by: firstRecord.prepared_by,
        };
      });

      console.log("🔥 Grouped records:", groupedRecords);
      setTableData(groupedRecords);
    } catch (error) {
      console.error("Fetch Error:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [Patient_id, UrlLink]);

  useEffect(() => {
    if (Patient_id && UrlLink) {
      handleClear();
      fetchList();
    }
  }, [Patient_id, UrlLink, fetchList]);

  // 🔥 ROW OPERATIONS
  const addRow = () => {
    setFormData(prev => ({
      ...prev,
      records: [...prev.records, { ...emptyRow }]
    }));
  };

  const removeRow = () => {
    setFormData(prev => {
      if (prev.records.length <= 1) return prev;
      return {
        ...prev,
        records: prev.records.slice(0, -1)
      };
    });
  };

  const updateRow = (index, key, value) => {
    setFormData(prev => {
      if (!prev.records[index]) return prev;
      const records = [...prev.records];
      records[index] = { ...records[index], [key]: value || "" };
      return { ...prev, records };
    });
  };

  const updateField = (key, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [key]: value === undefined || value === null ? "" : value 
    }));
  };

  const updateConsultation = (index, value) => {
    setFormData(prev => {
      const consultation = [...(prev.consultation || ["", "", "", ""])];
      consultation[index] = value || "";
      return { ...prev, consultation };
    });
  };

  // 🔥 SUBMIT - Send ALL rows (backend creates multiple records)
  const handleSubmit = async () => {
    if (!Patient_id || loading || submitDisabled) {
      alert("Please select a patient first");
      return;
    }

    const validRows = formData.records.filter(row => 
      Object.values(row).some(val => val && String(val).trim() !== "")
    );

    if (!validRows.length) {
      alert("Please fill at least one medication row");
      return;
    }

    setSubmitDisabled(true);
    setLoading(true);

    try {
      const payload = {
        Patient_id,
        registration_id: Registration_id,
        created_by: Created_by,
        records: validRows, // 🔥 Backend creates 1 record per row
        consultation: formData.consultation,
        final_diagnosis: formData.final_diagnosis,
        admission: formData.admission,
        discharge: formData.discharge,
        referral: formData.referral,
        lama: formData.lama,
        transfer_time: formData.transfer_time,
        hr: formData.hr,
        bp: formData.bp,
        spo2: formData.spo2,
        gcs: formData.gcs,
        condition_during: formData.condition_during,
        prepared_by: Created_by,
      };

      console.log("🔥 Submitting", validRows.length, "rows");
      
      await axios.post(`${UrlLink}Ip_Workbench/Medication_Record_Details_Link`, payload);
      alert(`✔ Saved ${validRows.length} medication${validRows.length > 1 ? 's' : ''}`);
      handleClear();
      fetchList();
    } catch (error) {
      console.error("Submit Error:", error);
      alert(`❌ Save failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  };

  // 🔥 FIXED VIEW - Shows ALL rows from group
  const handleView = (row) => {
    if (!row) return;

    setSelectedRecord(row);
    
    setFormData({
      records: row.records || [emptyRow],  // 🔥 ALL rows from this submission
      consultation: Array.isArray(row.consultation) ? row.consultation : ["", "", "", ""],
      final_diagnosis: row.final_diagnosis || "",
      admission: Boolean(row.admission),
      discharge: Boolean(row.discharge),
      referral: Boolean(row.referral),
      lama: Boolean(row.lama),
      transfer_time: row.transfer_time || "",
      hr: row.hr || "",
      bp: row.bp || "",
      spo2: row.spo2 || "",
      gcs: row.gcs || "",
      condition_during: row.condition_during || "",
      prepared_by: row.prepared_by || Created_by,
    });
    setIsViewMode(true);
    setIsEditMode(false);
  };

  // const handleEdit = (row) => {
  //   handleView(row);
  //   setIsEditMode(true);
  //   setIsViewMode(false);
  // };

  const handleEdit = (row) => {
  handleView(row);

  // 🔒 store original snapshot
  setOriginalFormData(JSON.parse(JSON.stringify({
    records: row.records || [],
    consultation: row.consultation || [],
    final_diagnosis: row.final_diagnosis || "",
    condition_during: row.condition_during || ""
  })));

  setIsEditMode(true);
  setIsViewMode(false);
};

const allowAppendOnly = (oldValue, newValue) => {
  if (!oldValue) return true;
  return newValue.startsWith(oldValue);
};




  // 🔥 UPDATE - Updates first record in group (form fields)
  const handleUpdate = async () => {
    if (!selectedRecord?.id) {
      alert("No record selected for update");
      return;
    }

    setSubmitDisabled(true);
    setLoading(true);

    try {
      // Update first record in group with form fields
      await axios.put(`${UrlLink}Ip_Workbench/update_Medication_Record/${selectedRecord.id}/`, {
        Patient_id,
        registration_id: Registration_id,
        created_by: Created_by,
        // Send first row as individual record for medication update
        datetime: formData.records[0]?.datetime || "",
        drug: formData.records[0]?.drug || "",
        dose: formData.records[0]?.dose || "",
        route: formData.records[0]?.route || "",
        frequency: formData.records[0]?.frequency || "",
        admin_time: formData.records[0]?.admin_time || "",
        doctor: formData.records[0]?.doctor || "",
        nurse: formData.records[0]?.nurse || "",
        consultation: formData.consultation,
        final_diagnosis: formData.final_diagnosis,
        admission: formData.admission,
        discharge: formData.discharge,
        referral: formData.referral,
        lama: formData.lama,
        transfer_time: formData.transfer_time,
        hr: formData.hr,
        bp: formData.bp,
        spo2: formData.spo2,
        gcs: formData.gcs,
        condition_during: formData.condition_during,
        prepared_by: Created_by,
      });
      
      alert("✔ Updated successfully");
      handleClear();
      fetchList();
    } catch (error) {
      console.error("Update Error:", error);
      alert(`❌ Update failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  };

  const handleClear = () => {
    setFormData({
      records: [emptyRow],
      consultation: ["", "", "", ""],
      final_diagnosis: "",
      admission: false,
      discharge: false,
      referral: false,
      lama: false,
      transfer_time: "",
      hr: "",
      bp: "",
      spo2: "",
      gcs: "",
      condition_during: "",
      prepared_by: Created_by,
    });
    setSelectedRecord(null);
    setIsViewMode(false);
    setIsEditMode(false);
    setSubmitDisabled(false);
  };

  const isFormReadOnly = isViewMode && !isEditMode;

  // 🔥 FIXED COLUMNS - Shows row count
  const columns = [
    { key: "sNo", name: "S.No" },
    { key: "Date", name: "Date" },
    { key: "Time", name: "Time" },
    // {
    //   key: "count", 
    //   name: "Rows", 
    //   renderCell: ({ row }) => (
    //     <strong style={{ color: '#007bff' }}>
    //       {row.count} meds
    //     </strong>
    //   ),
    // },
    {
      key: "view",
      name: "View",
      renderCell: ({ row }) => (
        <button 
          className="view-btn" 
          onClick={() => handleView(row)}
          disabled={loading}
          style={{ padding: '5px 10px' }}
        >
          👁
        </button>
      ),
    },
    {
      key: "edit",
      name: "Edit",
      renderCell: ({ row }) => (
        <button 
          className="edit-btn" 
          onClick={() => handleEdit(row)}
          disabled={loading}
          style={{ padding: '5px 10px' }}
        >
          ✏️
        </button>
      ),
    },
  ];

  return (
    <div className="med-root">
      {/* 🔥 FORM CONTAINER */}
      <div ref={formRef} className="med-form-wrap">
        <h2 className="med-main-title">MEDICATION RECORD</h2>

        {/* 🔥 MEDICATION TABLE - MULTIPLE ROWS ✅ */}
        <table className="med-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Drug</th>
              <th>Dose</th>
              <th>Route</th>
              <th>Frequency</th>
              <th>Admin Time</th>
              <th>Doctor</th>
              <th>Nurse</th>
            </tr>
          </thead>
          <tbody>
            {formData.records.map((row, index) => {
  const isOldRow = Boolean(originalFormData?.records?.[index]);

  return (
    <tr key={index}>
      <td>
        <input
          type="datetime-local"
          value={row.datetime || ""}
          onChange={(e) => updateRow(index, "datetime", e.target.value)}
          disabled={
            isFormReadOnly ||
            loading ||
            (isEditMode && originalFormData?.records?.[index]?.datetime)
          }
        />
      </td>

      <td>
        <input
          value={row.drug || ""}
          disabled={isFormReadOnly || loading || isOldRow}
          onChange={(e) => updateRow(index, "drug", e.target.value)}
        />
      </td>

      <td>
        <input
          value={row.dose || ""}
          disabled={isFormReadOnly || loading || isOldRow}
          onChange={(e) => updateRow(index, "dose", e.target.value)}
        />
      </td>

      <td>
        <input
          value={row.route || ""}
          disabled={isFormReadOnly || loading || isOldRow}
          onChange={(e) => updateRow(index, "route", e.target.value)}
        />
      </td>

      <td>
        <input
          value={row.frequency || ""}
          disabled={isFormReadOnly || loading || isOldRow}
          onChange={(e) => updateRow(index, "frequency", e.target.value)}
        />
      </td>

      <td>
        <input
          type="time"
          value={row.admin_time || ""}
          onChange={(e) => updateRow(index, "admin_time", e.target.value)}
          disabled={
            isFormReadOnly ||
            loading ||
            (isEditMode && originalFormData?.records?.[index]?.admin_time)
          }
        />
      </td>

      <td>
        <input
          value={row.doctor || ""}
          disabled={isFormReadOnly || loading || isOldRow}
          onChange={(e) => updateRow(index, "doctor", e.target.value)}
        />
      </td>

      <td>
        <input
          value={row.nurse || ""}
          disabled={isFormReadOnly || loading || isOldRow}
          onChange={(e) => updateRow(index, "nurse", e.target.value)}
        />
      </td>
    </tr>
  );
})}

          </tbody>
        </table>

        {/* 🔥 ROW CONTROLS */}
        {!isFormReadOnly && !loading && (
          <div style={{ margin: '10px 0', display: 'flex', gap: '10px' }}>
            <button onClick={addRow} className="btn-add-row" disabled={loading}>
              ＋ Add Row
            </button>
            {formData.records.length > 1 && (
              <button onClick={removeRow} className="btn-remove-row" disabled={loading}>
                － Remove Row
              </button>
            )}
          </div>
        )}

        {/* ALL OTHER FIELDS - UNCHANGED */}
      <div className="med-section">
  <label className="med-section-title">Consultation & Informed Time</label>

  {(formData.consultation || ["", "", "", ""]).map((consult, index) => {
    const oldValue = originalFormData?.consultation?.[index] || "";

    return (
      <div key={index} style={{ marginBottom: "8px" }}>
        <strong>{index + 1}.</strong>{" "}
        <input
          value={consult || ""}
          disabled={isFormReadOnly || loading}
          style={{ width: "70%", marginLeft: "5px" }}

          onChange={(e) => {
            const newValue = e.target.value;

            // ✅ allow append-only edits
            if (!isEditMode || newValue.startsWith(oldValue)) {
              updateConsultation(index, newValue);
            }
          }}

          onKeyDown={(e) => {
            const cursorPos = e.target.selectionStart;

            // 🔒 block deleting OLD text
            if (
              (e.key === "Backspace" && cursorPos <= oldValue.length) ||
              (e.key === "Delete" && cursorPos < oldValue.length)
            ) {
              e.preventDefault();
            }
          }}

          onFocus={(e) => {
            // cursor always starts at end
            const len = e.target.value.length;
            e.target.setSelectionRange(len, len);
          }}

          onClick={(e) => {
            const len = e.target.value.length;
            e.target.setSelectionRange(len, len);
          }}
        />
      </div>
    );
  })}
</div>


        <div className="med-section">
          <label className="med-section-title">FINAL DIAGNOSIS</label>
          {/* <textarea 
            value={formData.final_diagnosis || ""} 
            disabled={isFormReadOnly || loading}
            onChange={(e) => updateField("final_diagnosis", e.target.value)}
            rows={3} 
            style={{ width: '100%', resize: 'vertical' }}
            onInput={adjustHeight} 
          /> */}

          <textarea
  value={formData.final_diagnosis}
  disabled={isFormReadOnly || loading}
  onChange={(e) => {
    const newValue = e.target.value;
    const oldValue = originalFormData?.final_diagnosis || "";

    if (!isEditMode || allowAppendOnly(oldValue, newValue)) {
      updateField("final_diagnosis", newValue);
    }
  }}
  onFocus={(e) => {
    // force cursor to end
    const len = e.target.value.length;
    e.target.setSelectionRange(len, len);
  }}
/>

        </div>

       <div className="med-check-section">
{["admission", "discharge", "referral", "lama"].map((key) => {
  const wasSavedChecked = Boolean(originalFormData?.[key]);
  const isCurrentlyChecked = Boolean(formData[key]);

  return (
    <label key={key}>
      <input
        type="checkbox"
        checked={isCurrentlyChecked}
        disabled={
          isFormReadOnly ||
          loading ||
          (isEditMode && (wasSavedChecked || isCurrentlyChecked)) // 🔒 freeze only if saved or just checked
        }
        onChange={(e) => {
          const newChecked = e.target.checked;

          // 🛡️ freeze only after checking
          if (isEditMode && wasSavedChecked) return; // cannot uncheck saved-true
          if (isEditMode && newChecked && !wasSavedChecked) {
            // mark new check as frozen by updating formData
            updateField(key, true);
          } else {
            updateField(key, newChecked);
          }
        }}
      />
      {key.toUpperCase()}
    </label>
  );
})}




<div style={{ marginTop: "10px" }}>
  Transfer Time:
  <input
    type="time"
    value={
      // 🔒 always show original value in edit mode
      isEditMode && originalFormData?.transfer_time
        ? originalFormData.transfer_time
        : formData.transfer_time || ""
    }
    disabled={
      isFormReadOnly ||
      loading ||
      isEditMode // 🔒 completely freeze in edit mode
    }
    onChange={(e) => {
      // ✅ only allowed when NOT editing
      if (isEditMode) return;
      updateField("transfer_time", e.target.value);
    }}
  />
</div>


</div>


        <div className="med-vitals-section" style={{ margin: "15px 0" }}>
  {["hr", "bp", "spo2", "gcs"].map((vital) => {
    const oldValue = originalFormData?.[vital] || "";
    const currentValue = formData[vital] || oldValue;

    return (
      <div
        key={vital}
        style={{ marginRight: "20px", display: "inline-block" }}
      >
        <label>{vital.toUpperCase()}:</label>

        <input
          value={currentValue}
          disabled={isFormReadOnly || loading}
          style={{ width: "70px", marginLeft: "5px" }}

          onChange={(e) => {
            const newValue = e.target.value;

            // 🔒 HARD FREEZE old text
            if (newValue.length < oldValue.length) return;
            if (!newValue.startsWith(oldValue)) return;

            updateField(vital, newValue);
          }}

          onKeyDown={(e) => {
            const cursor = e.target.selectionStart;

            // ❌ prevent deleting old text
            if (
              (e.key === "Backspace" && cursor <= oldValue.length) ||
              (e.key === "Delete" && cursor < oldValue.length)
            ) {
              e.preventDefault();
            }
          }}

          onPaste={(e) => {
            e.preventDefault();

            const paste = e.clipboardData.getData("text");
            const newValue = oldValue + paste;

            updateField(vital, newValue);
          }}

          onFocus={(e) => {
            e.target.setSelectionRange(oldValue.length, oldValue.length);
          }}

          onClick={(e) => {
            e.target.setSelectionRange(oldValue.length, oldValue.length);
          }}
        />
      </div>
    );
  })}
</div>


        <div className="med-section">
          <label className="med-section-title">CONDITION DURING TRANSFER</label>
          {/* <textarea 
            value={formData.condition_during || ""} 
            disabled={isFormReadOnly || loading}
            onChange={(e) => updateField("condition_during", e.target.value)}
            rows={3} 
            style={{ width: '100%', resize: 'vertical' }}
            onInput={adjustHeight} 
          /> */}

          <textarea
  value={formData.condition_during || ""}
  disabled={isFormReadOnly || loading}
  rows={3}
  style={{ width: "100%", resize: "vertical" }}
  onChange={(e) => {
    const newValue = e.target.value;
    const oldValue = originalFormData?.condition_during || "";

    if (!isEditMode || allowAppendOnly(oldValue, newValue)) {
      updateField("condition_during", newValue);
    }
  }}
  onFocus={(e) => {
    // 🔒 force cursor to end
    const len = e.target.value.length;
    e.target.setSelectionRange(len, len);
  }}
  onInput={adjustHeight}
/>

        </div>

        {/* <div className="med-section">
          <label>Prepared by:</label>
          <input 
            value={formData.prepared_by || Created_by} 
            disabled 
            style={{ width: '250px', marginLeft: '10px' }}
          />
        </div> */}
      </div>

      {/* BUTTONS */}
      {/* <div className="Main_container_Btn" style={{ margin: '20px 0' }}>
        {!isEditMode && !isViewMode ? (
          <>
            <button 
              onClick={handleSubmit} 
              disabled={loading || submitDisabled || !Patient_id}
            >
              {loading ? "⏳ Saving..." : `Submit ${formData.records.filter(r => 
                Object.values(r).some(v => v && String(v).trim() !== ""))?.length || 0} rows as 1 record`}
            </button>
            <button onClick={handleClear} disabled={loading}>Clear</button>
          </>
        ) : isEditMode ? (
          <>
            <button 
              onClick={handleUpdate} 
              disabled={loading || submitDisabled}
            >
              {loading ? "⏳ Updating..." : "Update"}
            </button>
            <button onClick={handleClear} disabled={loading}>Cancel</button>
          </>
        ) : (
          <button onClick={handleClear} disabled={loading}>Close View</button>
        )}
        <button onClick={handlePrint} disabled={loading}>Print</button> */}

         <div className="Main_container_Btn">
        <button onClick={handlePrint}> Print</button>

        {!isEditMode ? (
          <button onClick={handleSubmit} disabled={loading}> Submit</button>
        ) : (
          <>
            <button onClick={handleUpdate} disabled={loading}>✔ Update</button>
            <button onClick={handleClear}>Cancel</button>
          </>
        )}
      </div>

      {/* RECORDS GRID */}
      <div style={{ marginTop: '30px' }}>
        <h3>Medication Records ({tableData.length})</h3>
        {loading ? (
          <p>Loading records...</p>
        ) : tableData.length === 0 ? (
          <p>No medication records found</p>
        ) : (
          <ReactGrid columns={columns} RowData={tableData} />
        )}
      </div>
    </div>
  );
};

export default RenderMedicationForm;