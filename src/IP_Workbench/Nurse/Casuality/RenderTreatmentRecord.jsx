
// // import React, { useRef, useState, useEffect } from "react";
// // import { useReactToPrint } from "react-to-print";
// // import "./RenderTreatmentRecord.css";
// // import { useSelector } from "react-redux";
// // import axios from "axios";
// // import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";

// // /* -------------------- Helpers -------------------- */
// // const cleanDateTimeForBackend = (form) => {
// //   const copy = { ...form };

// //   if (copy.DateTime) {
// //     copy.DateTime = copy.DateTime.replace("T", " ") + ":00";
// //   }

// //   return copy;
// // };

// // const adjustHeight = (e) => {
// //   e.target.style.height = "auto";
// //   e.target.style.height = e.target.scrollHeight + "px";
// // };

// // /* -------------------- Component -------------------- */
// // const RenderTreatmentRecord = () => {
// //   const formRef = useRef();

// //   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
// //   const IPData = useSelector(
// //     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
// //   );

// //   const Patient_id = IPData?.PatientId;
// //   const Created_by = IPData?.username || "Unknown";
// //   const PatientName = IPData?.PatientName || "";
// //   const PatientAge = IPData?.Age || "";
// //   const PatientGender = IPData?.Gender || "";

// //   /* -------------------- STATE -------------------- */
// //   const [formData, setFormData] = useState({
// //     DateTime: "",
// //     Name: "",
// //     UHID: "",
// //     Age: "",
// //     Gender: "",
// //     BroughtBy: "",
// //     IDMark1: "",
// //     IDMark2: "",
// //     MLC: false,
// //     NONMLC: false,
// //     AirwayPatency: "",
// //     AirwaySecretion: "",
// //     BreathingWOB: "",
// //     RR: "",
// //     SpO2: "",
// //     AE: "",
// //     HR: "",
// //     BP: "",
// //     PeripheralPulses: "",
// //     GCS: "",
// //     Pupils: "",
// //     GRBS: "",
// //     Temp: "",
// //     ExposureOthers: "",
// //     ChiefSymptoms: "",
// //     Allergies: "",
// //     LastMeal: "",
// //     PastHistoryandMedications: "",
// //     GeneralExamination: "",
// //     RS: "",
// //     CVS: "",
// //   ABDPELVIS: "",
// //     CNS: "",
// //   });

// //   const [tableData, setTableData] = useState([]);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [isViewMode, setIsViewMode] = useState(false);
// //   const [isEditMode, setIsEditMode] = useState(false);

// //   const POST_URL = `${UrlLink}Ip_Workbench/treatment_record_Details_Link/`;
// //   const GET_URL = `${UrlLink}Ip_Workbench/get_treatment_record/`;
// //   const UPDATE_URL = `${UrlLink}Ip_Workbench/update_treatment_record/`;

// //   /* -------------------- Handlers -------------------- */
// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   const clearForm = () => {
// //     setFormData({
// //       DateTime: new Date().toISOString().slice(0, 16),
// //       Name: PatientName,
// //       Age: PatientAge,
// //       Gender: PatientGender,
// //       UHID: "",
// //       BroughtBy: "",
// //       IDMark1: "",
// //       IDMark2: "",
// //       MLC: false,
// //       NONMLC: false,
// //       AirwayPatency: "",
// //       AirwaySecretion: "",
// //       BreathingWOB: "",
// //       RR: "",
// //       SpO2: "",
// //       AE: "",
// //       HR: "",
// //       BP: "",
// //       PeripheralPulses: "",
// //       GCS: "",
// //       Pupils: "",
// //       GRBS: "",
// //       Temp: "",
// //       ExposureOthers: "",
// //       ChiefSymptoms: "",
// //       Allergies: "",
// //       LastMeal: "",
// //       PastHistoryandMedications: "",
// //       GeneralExamination: "",
// //       RS: "",
// //       CVS: "",
// //       ABDPELVIS: "",
// //       CNS: "",
// //     });
// //     setSelectedRecord(null);
// //     setIsViewMode(false);
// //     setIsEditMode(false);
// //   };

// //   /* -------------------- API Calls -------------------- */
// // const fetchList = async () => {
// //   if (!Patient_id) return;

// //   try {
// //     setLoading(true);

// //     const res = await axios.get(`${GET_URL}${Patient_id}/`);
// //     const rows = res.data?.data || [];

// //     const mappedRows = rows.map((row) => ({
// //       id: row.id,
// //       Name: row.Name,
// //       DateTime: row.DateTime,
// //       Date: row.DateTime ? row.DateTime.split("T")[0] : "",
// //       rawData: row, // 👈 IMPORTANT
// //     }));

// //     setTableData(mappedRows);
// //   } catch (err) {
// //     console.error(err);
// //     setTableData([]);
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// // const handleSubmit = async () => {
// //   if (!Patient_id) return alert("No patient selected");

// //   try {
// //     setLoading(true);

// //     const payload = cleanDateTimeForBackend({
// //       ...formData,
// //       Patient_id,
// //       Created_by,
// //     });

// //     await axios.post(POST_URL, payload);

// //     alert("Saved successfully");

// //     await fetchList(); // 🔥 THIS updates grid
// //     clearForm();
// //   } catch (err) {
// //     console.error(err);
// //     alert("Save failed");
// //   } finally {
// //     setLoading(false);
// //   }
// // };


 
// //   const handleUpdate = async () => {
// //   if (!selectedRecord?.id) return;

// //   try {
// //     setLoading(true);
// //     const cleaned = cleanDateTimeForBackend(formData);

// //     await axios.put(`${UPDATE_URL}${selectedRecord.id}/`, {
// //       ...cleaned,
// //       UpdatedBy: Created_by,
// //     });

// //     alert("Updated successfully!");
// //     clearForm();
// //     fetchList();
// //   } catch (err) {
// //     alert("Update failed");
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// // const onView = (row) => {
// //   setFormData({
// //     ...row.rawData,
// //     DateTime: row.rawData.DateTime?.slice(0, 16),
// //   });

// //   setSelectedRecord(row.rawData);
// //   setIsViewMode(true);
// //   setIsEditMode(false);

// //   formRef.current?.scrollIntoView({ behavior: "smooth" });
// // };

// // const onEdit = (row) => {
// //   onView(row);
// //   setIsEditMode(true);
// // };


// //   useEffect(() => {
// //     if (Patient_id) {
// //       clearForm();
// //       fetchList();
// //     }
// //   }, [Patient_id]);

// //   const handlePrint = useReactToPrint({
// //     content: () => formRef.current,
// //   });

// //   /* -------------------- Grid -------------------- */
// // const columns = [
// //   { key: "Name", name: "Name" },
// //   { key: "Date", name: "Date" },
// //   {
// //     key: "View",
// //     name: "View",
// //     renderCell: ({ row }) => (
// //       <button onClick={() => onView(row)}>👁</button>
// //     ),
// //   },
// //   // {
// //   //   key: "Edit",
// //   //   name: "Edit",
// //   //   renderCell: ({ row }) => (
// //   //     <button onClick={() => onEdit(row)}>✏️</button>
// //   //   ),
// //   // },
// // ];



// //     return (
// //     <div className="treatment-wrapper">
// //       <div ref={formRef} className="treatment-form exact-sheet" aria-label="Emergency Treatment Record">
// //         {/* Top header with curved blue shape */}
// //         <div className="sheet-top">
// //           <div className="logo-circle" aria-hidden />
// //           <div className="header-text">
// //             <div className="hospital-left" style={{color: "#0077b8"}}> <h1>KARUNA MEDICAL COLLEGE HOSPITAL</h1></div>
// //             <div className="hospital-left" style={{  alignItems:"center" }}><p>Vilayodi, Chittur, Palakkad - 678 103  / 9496962555 | 9496972555 | 9496982555</p>
// //             <p ></p></div>
// //           </div>
// //           <div className="header-right-phones">
// //             {/* <div>9496962555</div>
// //             <div>9496972555</div>
// //             <div>9496982555</div> */}
// //           </div>
// //           <div className="blue-curved" aria-hidden />
// //         </div>
// // <hr />
// //         <div className="sheet-title">EMERGENCY DEPARTMENT INITIAL ASSESSMENT & TREATMENT RECORD</div>

// //         {/* Top info row */}
// //         <div className="top-row">
// //           <div className="top-left">
// //             <label>Date & Time :
// //               <input type="datetime-local" name="DateTime" value={formData.DateTime} onChange={handleChange} />
// //             </label>
// //           </div>

// //           <div className="top-mid">
// //             <label>Name :
// //               <input name="Name" value={formData.Name} onChange={handleChange} />
// //             </label>
// //           </div>

// //           <div className="top-mid">
// //             <label>Age :
// //               <input name="Age" value={formData.Age} onChange={handleChange} />
// //             </label>
// //           </div>

// //           <div className="top-mid">
// //             <label>Gender : M/F/O
// //               <input name="Gender" value={formData.Gender} onChange={handleChange} placeholder="" />
// //             </label>
// //           </div>

// //           <div className="top-right">
// //             <label>UHID NO :
// //               <input name="UHID" value={formData.UHID} onChange={handleChange} />
// //             </label>
// //           </div>
// //         </div>

// //         {/* MLC / NON MLC and ID marks */}
// //         <div className="mlc-row">
// //           <div className="mlc-left">
// //             <label>
// //   <input
// //     type="checkbox"
// //     name="MLC"
// //     checked={formData.MLC}
// //     onChange={handleChange}
// //   />{" "}
// //   MLC
// // </label>

// // <label>
// //   <input
// //     type="checkbox"
// //     name="NONMLC"
// //     checked={formData.NONMLC}
// //     onChange={handleChange}
// //   />{" "}
// //   NON MLC
// // </label>
// //            </div>

// //           <div className="mlc-center">
// //             <div className="id-mark-title">ID MARK :</div>
// //             <div className="id-mark-fields">
// //               <input name="IDMark1" value={formData.IDMark1} onChange={handleChange} placeholder="1)" />
// //               <input name="IDMark2" value={formData.IDMark2} onChange={handleChange} placeholder="2)" />
// //             </div>
// //           </div>
// // <br />
// //           <div className="mlc-right">
// //             <label>Brought By: <input name="BroughtBy" value={formData.BroughtBy} onChange={handleChange} /></label>
// //           </div>
// //         </div>

// //         {/* Primary survey block with exact three-line layout mimic */}
// //         <div className="primary-block">
// //           <div className="primary-title">Primary Survey</div>

// //           <div className="primary-grid-lines">

// //             <div className="primary-row">
// //               <div className="primary-label"><label>AIRWAY:<input name="AIRWAY" value={formData.AIRWAY} onChange={handleChange} /></label></div>
// //               <div className="primary-sub">
// //                 <label>Patency:<input name="AirwayPatency" value={formData.AirwayPatency} onChange={handleChange} /></label>
// //               </div>
// //               <div className="primary-sub">
// //                 <label>Secretion:<input name="AirwaySecretion" value={formData.AirwaySecretion} onChange={handleChange} /></label>
// //               </div>
// //             </div>

// //             <div className="primary-row">
// //               <div className="primary-label"><label>BREATHING:<input name="BREATHING" value={formData.BREATHING} onChange={handleChange} /></label></div>
// //               <div className="primary-sub">
// //                 <label>WOB:<input name="BreathingWOB" value={formData.BreathingWOB} onChange={handleChange} /></label>
// //                 <label>RR:<input name="RR" value={formData.RR} onChange={handleChange} /></label>
// //               </div>
// //               <div className="primary-sub">
// //                 <label>SpO2:<input name="SpO2" value={formData.SpO2} onChange={handleChange} /></label>
// //                 <label>AE:<input name="AE" value={formData.AE} onChange={handleChange} /></label>
// //               </div>
// //             </div>

// //             <div className="primary-row">
// //               <div className="primary-label"><label>CIRCULATION:<input name="CIRCULATION" value={formData.CIRCULATION} onChange={handleChange} /></label></div>
// //               <div className="primary-sub">
// //                 {/* <label>HR:<input name="HR" value={form.HR} onChange={handleChange} /></label>
// //                 <label>BP:<input name="BP" value={form.BP} onChange={handleChange} /></label> */}

// //                 <label>HR:<input name="HR" value={formData.HR} onChange={handleChange} /></label>
// // <label>BP:<input name="BP" value={formData.BP} onChange={handleChange} /></label>
// //               </div>
// //               <div className="primary-sub">
// //                 {/* <label>Peripheral pulses:<input name="PeripheralPulses" value={form.PeripheralPulses} onChange={handleChange} /></label> */}
              
// //               <label>Peripheral pulses:
// //   <input name="PeripheralPulses" value={formData.PeripheralPulses} onChange={handleChange} />
// // </label>
// //               </div>
// //             </div>

// //             <div className="primary-row">
// //               <div className="primary-label"><label>DISABILITY:<input name="DISABILITY" value={formData.DISABILITY} onChange={handleChange} /></label></div>
// //               <div className="primary-sub">
// //                 {/* <label>GCS:<input name="GCS" value={form.GCS} onChange={handleChange} /></label>
// //                 <label>Pupils:<input name="Pupils" value={form.Pupils} onChange={handleChange} /></label> */}

// //                 <label>GCS:<input name="GCS" value={formData.GCS} onChange={handleChange} /></label>
// //                 <label>Pupils:<input name="Pupils" value={formData.Pupils} onChange={handleChange} /></label>

// //               </div>
// //               <div className="primary-sub">
// //                 {/* <label>GRBS:<input name="GRBS" value={form.GRBS} onChange={handleChange} /></label> */}
// //               <label>GRBS:<input name="GRBS" value={formData.GRBS} onChange={handleChange} /></label>
              
// //               </div>
// //             </div>

// //             <div className="primary-row">
// //               <div className="primary-label"><label>EXPOSURE:<input name="EXPOSURE" value={formData.EXPOSURE} onChange={handleChange} /></label></div>
// //               <div className="primary-sub">
// //                 {/* <label>Temp:<input name="Temp" value={form.Temp} onChange={handleChange} /></label> */}
// //                 <label>Temp:<input name="Temp" value={formData.Temp} onChange={handleChange} /></label>
// //       </div>
// //               <div className="primary-sub">
// //                 {/* <label>Others:<input name="ExposureOthers" value={form.ExposureOthers} onChange={handleChange} /></label> */}
// //              <label>Others:<input name="ExposureOthers" value={formData.ExposureOthers} onChange={handleChange} /></label>

        
// //               </div>
// //             </div>

// //           </div>
// //         </div>

// //         {/* Secondary Survey large Chief Symptoms box */}
// //         <div className="secondary-block">
// //           <div className="secondary-title">Secondary Survey</div>

// //           <div className="chief-box">
// //             <div className="chief-title">Chief Symptoms :</div>
// //            <textarea name="ChiefSymptoms" rows="8" value={formData.ChiefSymptoms} onChange={(e) => {handleChange(e);
// //            adjustHeight(e);}} />
// //           </div>
// // <br />
// // <br />
// // <br />
// // <br />
// // <br /><br />
// //           <div className="allergies-line">
// //             <label>Allergies : <input name="Allergies" value={formData.Allergies} onChange={handleChange} /></label>
// //             <label>Last Meal : <input name="LastMeal" value={formData.LastMeal} onChange={handleChange} /></label>
// //             <label className="lmp">LMP : <input name="LMP" value={formData.LMP || ""} onChange={handleChange} /></label>
// //           </div>

// //           <div className="past-and-general">
// //             <div className="past-left">
// //               <div className="section-mini-title">Past History and Medications</div>
// //               <textarea name="PastHistoryandMedications" value={formData.PastHistoryandMedications} onChange={handleChange} onInput={adjustHeight} />
// //             </div>
// //             <div className="past-right">
// //               <div className="section-mini-title">General Examination</div>
              
// //               <textarea name="GeneralExamination" value={formData.GeneralExamination} onChange={handleChange} onInput={adjustHeight} />
             
// //             </div>
// //           </div>

// //           <div className="systemic-title">SYSTEMIC EXAMINATION</div>

// //           <div className="systemic-grid">
// //             <div className="sys-col">
// //               <div className="sys-head">RS</div>
// //               <textarea name="RS" value={formData.RS} onChange={handleChange} onInput={adjustHeight} />
// //             </div>
// //             <div className="sys-col">
// //               <div className="sys-head">CVS</div>
// //               <textarea name="CVS" value={formData.CVS} onChange={handleChange} onInput={adjustHeight} />
// //             </div>
// //             <div className="sys-col">
// //               <div className="sys-head">ABD/PELVIS</div>
// //               <textarea name="ABDPELVIS" value={formData.ABDPELVIS} onChange={handleChange} onInput={adjustHeight} />
// //             </div>
// //             <div className="sys-col">
// //               <div className="sys-head">CNS</div>
// //               <textarea name="CNS" value={formData.CNS} onChange={handleChange} onInput={adjustHeight} />
// //             </div>
// //           </div>

// //         </div>
// //       </div>

      
// //         <div className="Main_container_Btn">
// //           {!isViewMode && (
// //             <button onClick={handleSubmit} disabled={loading}>
// //               {loading ? "Saving..." : "Submit"}
// //             </button>
// //           )}

// //           {isEditMode && (
// //             <button onClick={handleUpdate} disabled={loading} >
// //               {loading ? "Updating..." : "Update"}
// //             </button>
// //           )}

// //           <button onClick={clearForm} >Clear</button>
// //           <button onClick={handlePrint} >Print</button>
// //         </div>
      

// //       <h3 style={{ marginTop: "30px" }}>Treatment Records</h3>
// //       <ReactGrid columns={columns} RowData={tableData} />

// //     </div>
// //   );
// // };

// // export default RenderTreatmentRecord;







// // // DUBLICATE
// import React, { useRef, useState, useEffect } from "react";
// import { useReactToPrint } from "react-to-print";
// import "./RenderTreatmentRecord.css";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";

// /* -------------------- Helpers -------------------- */
// const cleanDateTimeForBackend = (form) => {
//   const copy = { ...form };
//   if (copy.DateTime) {
//     copy.DateTime = copy.DateTime.replace("T", " ") + ":00";
//   }
//   return copy;
// };

// const adjustHeight = (e) => {
//   e.target.style.height = "auto";
//   e.target.style.height = e.target.scrollHeight + "px";
// };

// /* -------------------- Component -------------------- */
// const RenderTreatmentRecord = () => {
//   const formRef = useRef();

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

//   // ✅ Keep your senior selector + add fallback selector
//   const IPData = useSelector(
//     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
//   );
//   const DoctorData = useSelector(
//     (state) => state.Frontoffice?.DoctorWorkbenchNavigation
//   );

//   // ✅ Fallback: IP or Doctor workbench
//   const Patient_id = IPData?.PatientId || DoctorData?.PatientId;
//   const Created_by = IPData?.username || DoctorData?.username || "Unknown";
//   const PatientName = IPData?.PatientName || DoctorData?.PatientName || "";
//   const PatientAge = IPData?.Age || DoctorData?.Age || "";
//   const PatientGender = IPData?.Gender || DoctorData?.Gender || "";

// //   /* -------------------- STATE -------------------- */
//   const [formData, setFormData] = useState({
//     // ✅ Initialize properly (datetime-local expects "YYYY-MM-DDTHH:mm")
//     DateTime: new Date().toISOString().slice(0, 16),

//     Name: PatientName,
//     UHID: "",
//     Age: PatientAge,
//     Gender: PatientGender,
//     BroughtBy: "",
//     IDMark1: "",
//     IDMark2: "",
//     MLC: false,
//     NONMLC: false,

//     // ✅ These were referenced in JSX but missing from state
//     AIRWAY: "",
//     BREATHING: "",
//     CIRCULATION: "",
//     DISABILITY: "",
//     EXPOSURE: "",
//     LMP: "",

//     AirwayPatency: "",
//     AirwaySecretion: "",
//     BreathingWOB: "",
//     RR: "",
//     SpO2: "",
//     AE: "",
//     HR: "",
//     BP: "",
//     PeripheralPulses: "",
//     GCS: "",
//     Pupils: "",
//     GRBS: "",
//     Temp: "",
//     ExposureOthers: "",
//     ChiefSymptoms: "",
//     Allergies: "",
//     LastMeal: "",
//     PastHistoryandMedications: "",
//     GeneralExamination: "",
//     RS: "",
//     CVS: "",
//     ABDPELVIS: "",
//     CNS: "",
//   });

//   const [tableData, setTableData] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);

//   const POST_URL = `${UrlLink}Ip_Workbench/treatment_record_Details_Link/`;
//   const GET_URL = `${UrlLink}Ip_Workbench/get_treatment_record/`;
//   const UPDATE_URL = `${UrlLink}Ip_Workbench/update_treatment_record/`;

//   /* -------------------- Handlers -------------------- */
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const clearForm = () => {
//     setFormData((prev) => ({
//       ...prev,
//       DateTime: new Date().toISOString().slice(0, 16),
//       Name: PatientName,
//       Age: PatientAge,
//       Gender: PatientGender,
//       UHID: "",
//       BroughtBy: "",
//       IDMark1: "",
//       IDMark2: "",
//       MLC: false,
//       NONMLC: false,

//       AIRWAY: "",
//       BREATHING: "",
//       CIRCULATION: "",
//       DISABILITY: "",
//       EXPOSURE: "",
//       LMP: "",

//       AirwayPatency: "",
//       AirwaySecretion: "",
//       BreathingWOB: "",
//       RR: "",
//       SpO2: "",
//       AE: "",
//       HR: "",
//       BP: "",
//       PeripheralPulses: "",
//       GCS: "",
//       Pupils: "",
//       GRBS: "",
//       Temp: "",
//       ExposureOthers: "",
//       ChiefSymptoms: "",
//       Allergies: "",
//       LastMeal: "",
//       PastHistoryandMedications: "",
//       GeneralExamination: "",
//       RS: "",
//       CVS: "",
//       ABDPELVIS: "",
//       CNS: "",
//     }));

//     setSelectedRecord(null);
//     setIsViewMode(false);
//     setIsEditMode(false);
//   };

// //   /* -------------------- API Calls -------------------- */
//   const fetchList = async () => {
//     if (!Patient_id) return;

//     try {
//       setLoading(true);
//       const res = await axios.get(`${GET_URL}${Patient_id}/`);
//       const rows = res.data?.data || [];

//       const mappedRows = rows.map((row) => ({
//         id: row.id,
//         Name: row.Name,
//         DateTime: row.DateTime,
//         Date: row.DateTime ? row.DateTime.split("T")[0] : "",
//         rawData: row,
//       }));

//       setTableData(mappedRows);
//     } catch (err) {
//       console.error(err);
//       setTableData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!Patient_id) return alert("No patient selected");

//     try {
//       setLoading(true);
//       const payload = cleanDateTimeForBackend({
//         ...formData,
//         Patient_id,
//         Created_by,
//       });

//       await axios.post(POST_URL, payload);

//       alert("Saved successfully");
//       await fetchList();
//       clearForm();
//     } catch (err) {
//       console.error(err);
//       alert("Save failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!selectedRecord?.id) return;

//     try {
//       setLoading(true);
//       const cleaned = cleanDateTimeForBackend(formData);

//       await axios.put(`${UPDATE_URL}${selectedRecord.id}/`, {
//         ...cleaned,
//         UpdatedBy: Created_by,
//       });

//       alert("Updated successfully!");
//       clearForm();
//       fetchList();
//     } catch (err) {
//       alert("Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onView = (row) => {
//     setFormData({
//       ...row.rawData,

//       // ✅ For datetime-local input
//       DateTime: row.rawData.DateTime?.slice(0, 16) || new Date().toISOString().slice(0, 16),

//       // ✅ Ensure these exist even if backend doesn't send them
//       AIRWAY: row.rawData.AIRWAY || "",
//       BREATHING: row.rawData.BREATHING || "",
//       CIRCULATION: row.rawData.CIRCULATION || "",
//       DISABILITY: row.rawData.DISABILITY || "",
//       EXPOSURE: row.rawData.EXPOSURE || "",
//       LMP: row.rawData.LMP || "",
//     });

//     setSelectedRecord(row.rawData);
//     setIsViewMode(true);
//     setIsEditMode(false);

//     formRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // optional
//   // const onEdit = (row) => {
//   //   onView(row);
//   //   setIsEditMode(true);
//   // };

//   useEffect(() => {
//     if (Patient_id) {
//       clearForm();
//       fetchList();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [Patient_id]);

//   const handlePrint = useReactToPrint({
//     content: () => formRef.current, // correct usage [web:11]
//   });

//   /* -------------------- Grid -------------------- */
//   const columns = [
//     { key: "Name", name: "Name" },
//     { key: "Date", name: "Date" },
//     {
//       key: "View",
//       name: "View",
//       renderCell: ({ row }) => <button onClick={() => onView(row)}>👁</button>,
//     },
//   ];

//   return (
//     <div className="treatment-wrapper">
//       <div
//         ref={formRef}
//         className="treatment-form exact-sheet"
//         aria-label="Emergency Treatment Record"
//       >
//         {/* Top header with curved blue shape */}
//         <div className="sheet-top">
//           <div className="logo-circle" aria-hidden />
//           <div className="header-text">
//             <div className="hospital-left" style={{ color: "#0077b8" }}>
//               <h1>KARUNA MEDICAL COLLEGE HOSPITAL</h1>
//             </div>
//             <div className="hospital-left" style={{ alignItems: "center" }}>
//               <p>
//                 Vilayodi, Chittur, Palakkad - 678 103 / 9496962555 | 9496972555 |
//                 9496982555
//               </p>
//               <p></p>
//             </div>
//           </div>
//           <div className="header-right-phones"></div>
//           <div className="blue-curved" aria-hidden />
//         </div>

//         <hr />
//         <div className="sheet-title">
//           EMERGENCY DEPARTMENT INITIAL ASSESSMENT & TREATMENT RECORD
//         </div>

//         {/* Top info row */}
//         <div className="top-row">
//           <div className="top-left">
//             <label>
//               Date & Time :
//               <input
//                 type="datetime-local"
//                 name="DateTime"
//                 value={formData.DateTime}
//                 onChange={handleChange}
//               />
//             </label>
//           </div>

//           <div className="top-mid">
//             <label>
//               Name :
//               <input name="Name" value={formData.Name} onChange={handleChange} />
//             </label>
//           </div>

//           <div className="top-mid">
//             <label>
//               Age :
//               <input name="Age" value={formData.Age} onChange={handleChange} />
//             </label>
//           </div>

//           <div className="top-mid">
//             <label>
//               Gender : M/F/O
//               <input
//                 name="Gender"
//                 value={formData.Gender}
//                 onChange={handleChange}
//                 placeholder=""
//               />
//             </label>
//           </div>

//           <div className="top-right">
//             <label>
//               UHID NO :
//               <input name="UHID" value={formData.UHID} onChange={handleChange} />
//             </label>
//           </div>
//         </div>

//         {/* MLC / NON MLC and ID marks */}
//         <div className="mlc-row">
//           <div className="mlc-left">
//             <label>
//               <input
//                 type="checkbox"
//                 name="MLC"
//                 checked={formData.MLC}
//                 onChange={handleChange}
//               />{" "}
//               MLC
//             </label>

//             <label>
//               <input
//                 type="checkbox"
//                 name="NONMLC"
//                 checked={formData.NONMLC}
//                 onChange={handleChange}
//               />{" "}
//               NON MLC
//             </label>
//           </div>

//           <div className="mlc-center">
//             <div className="id-mark-title">ID MARK :</div>
//             <div className="id-mark-fields">
//               <input
//                 name="IDMark1"
//                 value={formData.IDMark1}
//                 onChange={handleChange}
//                 placeholder="1)"
//               />
//               <input
//                 name="IDMark2"
//                 value={formData.IDMark2}
//                 onChange={handleChange}
//                 placeholder="2)"
//               />
//             </div>
//           </div>

//           <br />

//           <div className="mlc-right">
//             <label>
//               Brought By:{" "}
//               <input
//                 name="BroughtBy"
//                 value={formData.BroughtBy}
//                 onChange={handleChange}
//               />
//             </label>
//           </div>
//         </div>

//         {/* Primary survey */}
//         <div className="primary-block">
//           <div className="primary-title">Primary Survey</div>

//           <div className="primary-grid-lines">
//             <div className="primary-row">
//               <div className="primary-label">
//                 <label>
//                   AIRWAY:
//                   <input
//                     name="AIRWAY"
//                     value={formData.AIRWAY}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   Patency:
//                   <input
//                     name="AirwayPatency"
//                     value={formData.AirwayPatency}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   Secretion:
//                   <input
//                     name="AirwaySecretion"
//                     value={formData.AirwaySecretion}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="primary-row">
//               <div className="primary-label">
//                 <label>
//                   BREATHING:
//                   <input
//                     name="BREATHING"
//                     value={formData.BREATHING}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   WOB:
//                   <input
//                     name="BreathingWOB"
//                     value={formData.BreathingWOB}
//                     onChange={handleChange}
//                   />
//                 </label>
//                 <label>
//                   RR:
//                   <input name="RR" value={formData.RR} onChange={handleChange} />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   SpO2:
//                   <input
//                     name="SpO2"
//                     value={formData.SpO2}
//                     onChange={handleChange}
//                   />
//                 </label>
//                 <label>
//                   AE:
//                   <input name="AE" value={formData.AE} onChange={handleChange} />
//                 </label>
//               </div>
//             </div>

//             <div className="primary-row">
//               <div className="primary-label">
//                 <label>
//                   CIRCULATION:
//                   <input
//                     name="CIRCULATION"
//                     value={formData.CIRCULATION}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   HR:
//                   <input name="HR" value={formData.HR} onChange={handleChange} />
//                 </label>
//                 <label>
//                   BP:
//                   <input name="BP" value={formData.BP} onChange={handleChange} />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   Peripheral pulses:
//                   <input
//                     name="PeripheralPulses"
//                     value={formData.PeripheralPulses}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="primary-row">
//               <div className="primary-label">
//                 <label>
//                   DISABILITY:
//                   <input
//                     name="DISABILITY"
//                     value={formData.DISABILITY}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   GCS:
//                   <input
//                     name="GCS"
//                     value={formData.GCS}
//                     onChange={handleChange}
//                   />
//                 </label>
//                 <label>
//                   Pupils:
//                   <input
//                     name="Pupils"
//                     value={formData.Pupils}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   GRBS:
//                   <input
//                     name="GRBS"
//                     value={formData.GRBS}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="primary-row">
//               <div className="primary-label">
//                 <label>
//                   EXPOSURE:
//                   <input
//                     name="EXPOSURE"
//                     value={formData.EXPOSURE}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   Temp:
//                   <input
//                     name="Temp"
//                     value={formData.Temp}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//               <div className="primary-sub">
//                 <label>
//                   Others:
//                   <input
//                     name="ExposureOthers"
//                     value={formData.ExposureOthers}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Secondary Survey */}
//         <div className="secondary-block">
//           <div className="secondary-title">Secondary Survey</div>

//           <div className="chief-box">
//             <div className="chief-title">Chief Symptoms :</div>
//             <textarea
//               name="ChiefSymptoms"
//               rows="8"
//               value={formData.ChiefSymptoms}
//               onChange={(e) => {
//                 handleChange(e);
//                 adjustHeight(e);
//               }}
//             />
//           </div>

//           <br />
//           <br />
//           <br />
//           <br />
//           <br />
//           <br />

//           <div className="allergies-line">
//             <label>
//               Allergies :{" "}
//               <input
//                 name="Allergies"
//                 value={formData.Allergies}
//                 onChange={handleChange}
//               />
//             </label>
//             <label>
//               Last Meal :{" "}
//               <input
//                 name="LastMeal"
//                 value={formData.LastMeal}
//                 onChange={handleChange}
//               />
//             </label>
//             <label className="lmp">
//               LMP :{" "}
//               <input name="LMP" value={formData.LMP} onChange={handleChange} />
//             </label>
//           </div>

//           <div className="past-and-general">
//             <div className="past-left">
//               <div className="section-mini-title">Past History and Medications</div>
//               <textarea
//                 name="PastHistoryandMedications"
//                 value={formData.PastHistoryandMedications}
//                 onChange={handleChange}
//                 onInput={adjustHeight}
//               />
//             </div>
//             <div className="past-right">
//               <div className="section-mini-title">General Examination</div>
//               <textarea
//                 name="GeneralExamination"
//                 value={formData.GeneralExamination}
//                 onChange={handleChange}
//                 onInput={adjustHeight}
//               />
//             </div>
//           </div>

//           <div className="systemic-title">SYSTEMIC EXAMINATION</div>

//           <div className="systemic-grid">
//             <div className="sys-col">
//               <div className="sys-head">RS</div>
//               <textarea
//                 name="RS"
//                 value={formData.RS}
//                 onChange={handleChange}
//                 onInput={adjustHeight}
//               />
//             </div>
//             <div className="sys-col">
//               <div className="sys-head">CVS</div>
//               <textarea
//                 name="CVS"
//                 value={formData.CVS}
//                 onChange={handleChange}
//                 onInput={adjustHeight}
//               />
//             </div>
//             <div className="sys-col">
//               <div className="sys-head">ABD/PELVIS</div>
//               <textarea
//                 name="ABDPELVIS"
//                 value={formData.ABDPELVIS}
//                 onChange={handleChange}
//                 onInput={adjustHeight}
//               />
//             </div>
//             <div className="sys-col">
//               <div className="sys-head">CNS</div>
//               <textarea
//                 name="CNS"
//                 value={formData.CNS}
//                 onChange={handleChange}
//                 onInput={adjustHeight}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="Main_container_Btn">
//         {!isViewMode && (
//           <button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Saving..." : "Submit"}
//           </button>
//         )}

//         {isEditMode && (
//           <button onClick={handleUpdate} disabled={loading}>
//             {loading ? "Updating..." : "Update"}
//           </button>
//         )}

//         <button onClick={clearForm}>Clear</button>
//         <button onClick={handlePrint}>Print</button>
//       </div>

//       <h3 style={{ marginTop: "30px" }}>Treatment Records</h3>
//       <ReactGrid columns={columns} RowData={tableData} />
//     </div>
//   );
// };

// export default RenderTreatmentRecord;





// // DUBLICATE
import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import "./RenderTreatmentRecord.css";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";

/* -------------------- Helpers -------------------- */
const cleanDateTimeForBackend = (form) => {
  const copy = { ...form };
  if (copy.DateTime) {
    copy.DateTime = copy.DateTime.replace("T", " ") + ":00";
  }
  return copy;
};

const adjustHeight = (e) => {
  e.target.style.height = "auto";
  e.target.style.height = e.target.scrollHeight + "px";
};

/* -------------------- Component -------------------- */
const RenderTreatmentRecord = () => {
  const formRef = useRef();

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  // ✅ Keep your senior selector + add fallback selector
  const IPData = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const DoctorData = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );

  // ✅ Fallback: IP or Doctor workbench
  const Patient_id = IPData?.PatientId || DoctorData?.PatientId;
  const Created_by = IPData?.username || DoctorData?.username || "Unknown";
  const PatientName = IPData?.PatientName || DoctorData?.PatientName || "";
  const PatientAge = IPData?.Age || DoctorData?.Age || "";
  const PatientGender = IPData?.Gender || DoctorData?.Gender || "";

//   /* -------------------- STATE -------------------- */
  // const [formData, setFormData] = useState({
  //   // ✅ Initialize properly (datetime-local expects "YYYY-MM-DDTHH:mm")
  //   DateTime: new Date().toISOString().slice(0, 16),

  //   Name: PatientName,
  //   UHID: "",
  //   Age: PatientAge,
  //   Gender: PatientGender,
  //   BroughtBy: "",
  //   IDMark1: "",
  //   IDMark2: "",
  //   MLC: false,
  //   NONMLC: false,

  //   // ✅ These were referenced in JSX but missing from state
  //   AIRWAY: "",
  //   BREATHING: "",
  //   CIRCULATION: "",
  //   DISABILITY: "",
  //   EXPOSURE: "",
  //   LMP: "",

  //   AirwayPatency: "",
  //   AirwaySecretion: "",
  //   BreathingWOB: "",
  //   RR: "",
  //   SpO2: "",
  //   AE: "",
  //   HR: "",
  //   BP: "",
  //   PeripheralPulses: "",
  //   GCS: "",
  //   Pupils: "",
  //   GRBS: "",
  //   Temp: "",
  //   ExposureOthers: "",
  //   ChiefSymptoms: "",
  //   Allergies: "",
  //   LastMeal: "",
  //   PastHistoryandMedications: "",
  //   GeneralExamination: "",
  //   RS: "",
  //   CVS: "",
  //   ABDPELVIS: "",
  //   CNS: "",
  // });

  const [formData, setFormData] = useState({
  DateTime: "",
  Name: "",
  UHID: "",
  Age: "",
  Gender: "",
  BroughtBy: "",
  IDMark1: "",
  IDMark2: "",
  MLC: false,
  NONMLC: false,

  // 🔴 THESE WERE MISSING (CRASH FIX)
  AIRWAY: "",
  BREATHING: "",
  CIRCULATION: "",
  DISABILITY: "",
  EXPOSURE: "",

  AirwayPatency: "",
  AirwaySecretion: "",
  BreathingWOB: "",
  RR: "",
  SpO2: "",
  AE: "",
  HR: "",
  BP: "",
  PeripheralPulses: "",
  GCS: "",
  Pupils: "",
  GRBS: "",
  Temp: "",
  ExposureOthers: "",

  ChiefSymptoms: "",
  Allergies: "",
  LastMeal: "",

  // 🔴 THIS WAS USED BUT NOT DEFINED
  LMP: "",

  PastHistoryandMedications: "",
  GeneralExamination: "",
  RS: "",
  CVS: "",
  ABDPELVIS: "",
  CNS: "",
});

  const [tableData, setTableData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const POST_URL = `${UrlLink}Ip_Workbench/treatment_record_Details_Link/`;
  const GET_URL = `${UrlLink}Ip_Workbench/get_treatment_record/`;
  const UPDATE_URL = `${UrlLink}Ip_Workbench/update_treatment_record/`;

  /* -------------------- Handlers -------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearForm = () => {
    setFormData((prev) => ({
      ...prev,
      DateTime: new Date().toISOString().slice(0, 16),
      Name: PatientName,
      Age: PatientAge,
      Gender: PatientGender,
      UHID: "",
      BroughtBy: "",
      IDMark1: "",
      IDMark2: "",
      MLC: false,
      NONMLC: false,

      AIRWAY: "",
      BREATHING: "",
      CIRCULATION: "",
      DISABILITY: "",
      EXPOSURE: "",
      LMP: "",

      AirwayPatency: "",
      AirwaySecretion: "",
      BreathingWOB: "",
      RR: "",
      SpO2: "",
      AE: "",
      HR: "",
      BP: "",
      PeripheralPulses: "",
      GCS: "",
      Pupils: "",
      GRBS: "",
      Temp: "",
      ExposureOthers: "",
      ChiefSymptoms: "",
      Allergies: "",
      LastMeal: "",
      PastHistoryandMedications: "",
      GeneralExamination: "",
      RS: "",
      CVS: "",
      ABDPELVIS: "",
      CNS: "",
    }));

    setSelectedRecord(null);
    setIsViewMode(false);
    setIsEditMode(false);
  };

//   /* -------------------- API Calls -------------------- */
  const fetchList = async () => {
    if (!Patient_id) return;

    try {
      setLoading(true);
      const res = await axios.get(`${GET_URL}${Patient_id}/`);
      const rows = res.data?.data || [];

      const mappedRows = rows.map((row) => ({
        id: row.id,
        Name: row.Name,
        DateTime: row.DateTime,
        Date: row.DateTime ? row.DateTime.split("T")[0] : "",
        rawData: row,
      }));

      setTableData(mappedRows);
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!Patient_id) return alert("No patient selected");

    try {
      setLoading(true);
      const payload = cleanDateTimeForBackend({
        ...formData,
        Patient_id,
        Created_by,
      });

      await axios.post(POST_URL, payload);

      alert("Saved successfully");
      await fetchList();
      clearForm();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

//EXTRA
useEffect(() => {
  const beforePrint = () => {
    document.querySelectorAll("textarea").forEach((ta) => {
      ta.style.height = ta.scrollHeight + "px";
      ta.style.overflow = "visible";
    });
  };

  const afterPrint = () => {
    document.querySelectorAll("textarea").forEach((ta) => {
      ta.style.height = "";
      ta.style.overflow = "";
    });
  };

  window.addEventListener("beforeprint", beforePrint);
  window.addEventListener("afterprint", afterPrint);

  return () => {
    window.removeEventListener("beforeprint", beforePrint);
    window.removeEventListener("afterprint", afterPrint);
  };
}, []);
  // const handleUpdate = async () => {
  //   if (!selectedRecord?.id) return;

  //   try {
  //     setLoading(true);
  //     const cleaned = cleanDateTimeForBackend(formData);

  //     await axios.put(`${UPDATE_URL}${selectedRecord.id}/`, {
  //       ...cleaned,
  //       UpdatedBy: Created_by,
  //     });

  //     alert("Updated successfully!");
  //     clearForm();
  //     fetchList();
  //   } catch (err) {
  //     alert("Update failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const handleUpdate = async () => {
  if (!selectedRecord?.id) return;

  try {
    setLoading(true);

    const mergedData = {
      ...formData,
      ChiefSymptoms:
        formData.ChiefSymptoms +
        (editNotes.ChiefSymptoms_New
          ? `\n\n[${Created_by} | ${new Date().toLocaleString()}]\n${editNotes.ChiefSymptoms_New}`
          : ""),
    };

    await axios.put(`${UPDATE_URL}${selectedRecord.id}/`, {
      ...cleanDateTimeForBackend(mergedData),
      // UpdatedBy: Created_by,
    });

    alert("Updated successfully");
    clearForm();
    fetchList();
  } catch (err) {
    alert("Update failed");
  } finally {
    setLoading(false);
  }
};



  const [editNotes, setEditNotes] = useState({
  ChiefSymptoms_New: "",
  PastHistory_New: "",
  GeneralExamination_New: "",
  RS_New: "",
  CVS_New: "",
  ABDPELVIS_New: "",
  CNS_New: "",
});


  const onView = (row) => {
    setFormData({
      ...row.rawData,

      // ✅ For datetime-local input
      DateTime: row.rawData.DateTime?.slice(0, 16) || new Date().toISOString().slice(0, 16),

      // ✅ Ensure these exist even if backend doesn't send them
      AIRWAY: row.rawData.AIRWAY || "",
      BREATHING: row.rawData.BREATHING || "",
      CIRCULATION: row.rawData.CIRCULATION || "",
      DISABILITY: row.rawData.DISABILITY || "",
      EXPOSURE: row.rawData.EXPOSURE || "",
      LMP: row.rawData.LMP || "",
    });

    setSelectedRecord(row.rawData);
    setIsViewMode(true);
    setIsEditMode(false);

    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // optional
  // const onEdit = (row) => {
  //   onView(row);
  //   setIsEditMode(true);
  // };

  const onEdit = (row) => {
  onView(row);          // load data into form
  setFrozenMLC(row.MLC === true);
  setFrozenNONMLC(row.NONMLC === true); // 🔒 freeze if already checked
  setIsEditMode(true);  // enable Update button
  setIsViewMode(false); // optional but cleaner
};

const [frozenNONMLC, setFrozenNONMLC] = useState(false);
const [frozenMLC, setFrozenMLC] = useState(false);
const [originalFormData, setOriginalFormData] = useState({});
const [frozenFields, setFrozenFields] = useState({});
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




  useEffect(() => {
    if (Patient_id) {
      clearForm();
      fetchList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Patient_id]);


useEffect(() => {
  if (!isViewMode) return;

  // wait for DOM to paint
  requestAnimationFrame(() => {
    const textareas = document.querySelectorAll(
      ".treatment-form textarea"
    );

    textareas.forEach((ta) => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    });
  });
}, [formData, isViewMode]);





  
  const handlePrint = useReactToPrint({
    content: () => formRef.current, // correct usage [web:11]
  });

  /* -------------------- Grid -------------------- */
  const columns = [
    { key: "Name", name: "Name" },
    { key: "Date", name: "Date" },
    {
      key: "View",
      name: "View",
      renderCell: ({ row }) => <button onClick={() => onView(row)}>👁</button>,
    },

    {
    key: "Edit",
    name: "Edit",
    renderCell: ({ row }) => (
      <button onClick={() => onEdit(row)}>✏️</button>
    ),
  },
  ];

  return (
    <div className="treatment-wrapper">
      <div
        ref={formRef}
        className="treatment-form exact-sheet"
        aria-label="Emergency Treatment Record"
      >
        {/* Top header with curved blue shape */}
        <div className="sheet-top">
          <div className="logo-circle" aria-hidden />
          <div className="header-text">
            <div className="hospital-left" style={{ color: "#0077b8" }}>
              <h1>KARUNA MEDICAL COLLEGE HOSPITAL</h1>
            </div>
            <div className="hospital-left" style={{ alignItems: "center" }}>
              <p>
                Vilayodi, Chittur, Palakkad - 678 103 / 9496962555 | 9496972555 |
                9496982555
              </p>
              <p></p>
            </div>
          </div>
          <div className="header-right-phones"></div>
          <div className="blue-curved" aria-hidden />
        </div>

        <hr />
        <div className="sheet-title">
          EMERGENCY DEPARTMENT INITIAL ASSESSMENT & TREATMENT RECORD
        </div>

        {/* Top info row */}
        <div className="top-row">
          <div className="top-left">
            <label>
              Date & Time :
              <input
                type="datetime-local"
                name="DateTime"
                value={formData.DateTime}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="top-mid">
            <label>
              Name :
              <input name="Name" value={formData.Name} onChange={handleChange} />
            </label>
          </div>

          <div className="top-mid">
            <label>
              Age :
              <input name="Age" value={formData.Age} onChange={handleChange} />
            </label>
          </div>

          <div className="top-mid">
            <label>
              Gender : M/F/O
              <input
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                placeholder=""
              />
            </label>
          </div>

          <div className="top-right">
            <label>
              UHID NO :
              <input name="UHID" value={formData.UHID} onChange={handleChange} />
            </label>
          </div>
        </div>

        {/* MLC / NON MLC and ID marks */}
        <div className="mlc-row">
          <div className="mlc-left">
            <label>
              <input
                type="checkbox"
                name="MLC"
                checked={formData.MLC}
                onChange={handleChange}
              />{" "}
              MLC
            </label>
            

            <label>
              <input
                type="checkbox"
                name="NONMLC"
                checked={formData.NONMLC}
                onChange={handleChange}
              />{" "}
              NON MLC
            </label>

           

          </div>

          <div className="mlc-center">
            <div className="id-mark-title">ID MARK :</div>
            <div className="id-mark-fields">
              <input
                name="IDMark1"
                value={formData.IDMark1}
                onChange={handleChange}
                placeholder="1)"
              />
              
              <input
                name="IDMark2"
                value={formData.IDMark2}
                onChange={handleChange}
                placeholder="2)"
              />

              
            </div>
          </div>

          <br />

          <div className="mlc-right">
            <label>
              Brought By:{" "}
              <input
                name="BroughtBy"
                value={formData.BroughtBy}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        {/* Primary survey */}
        <div className="primary-block">
          <div className="primary-title">Primary Survey</div>

          <div className="primary-grid-lines">
            <div className="primary-row">
              <div className="primary-label">
                <label>
                  AIRWAY:
                  {/* <input
                    name="AIRWAY"
                    value={formData.AIRWAY}
                    onChange={handleChange}
                  /> */}
                 <input
                    name="AIRWAY"
                    value={formData.AIRWAY}
                    onFocus={() => handleFreezeOnFocus("AIRWAY", formData.AIRWAY)}
                    onChange={handleAppendOnlyChange("AIRWAY")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />


                </label>
              </div>
              <div className="primary-sub">
                <label>
                  Patency:
                  {/* <input
                    name="Patency"
                    value={formData.Patency}
                    onChange={handleChange}
                  /> */}
                  <input
                    name="AirwayPatency"
                    value={formData.Patency}
                    onFocus={() => handleFreezeOnFocus("AirwayPatency", formData.AirwayPatency)}
                    onChange={handleAppendOnlyChange("AirwayPatency")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
              <div className="primary-sub">
                <label>
                  Secretion:
                  {/* <input
                    name="AirwaySecretion"
                    value={formData.AirwaySecretion}
                    onChange={handleChange}
                  /> */}
                  <input
                    name="AirwaySecretion"
                    value={formData.AirwaySecretion}
                    onFocus={() => handleFreezeOnFocus("AirwaySecretion", formData.AirwaySecretion)}
                    onChange={handleAppendOnlyChange("AirwaySecretion")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
            </div>

            <div className="primary-row">
              <div className="primary-label">
                <label>
                  BREATHING:
                  {/* <input
                    name="BREATHING"
                    value={formData.BREATHING}
                    onChange={handleChange}
                  /> */}
                  <input
                    name="BREATHING"
                    value={formData.BREATHING}
                    onFocus={() => handleFreezeOnFocus("BREATHING", formData.BREATHING)}
                    onChange={handleAppendOnlyChange("BREATHING")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
              <div className="primary-sub">
                <label>
                  WOB:
                  {/* <input
                    name="BreathingWOB"
                    value={formData.BreathingWOB}
                    onChange={handleChange}
                  /> */}
                  <input
                    name="BreathingWOB"
                    value={formData.BreathingWOB}
                    onFocus={() => handleFreezeOnFocus("BreathingWOB", formData.BreathingWOB)}
                    onChange={handleAppendOnlyChange("BreathingWOB")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
                <label>
                  RR:
                  {/* <input name="RR" value={formData.RR} onChange={handleChange} /> */}
                   <input
                    name="RR"
                    value={formData.RR}
                    onFocus={() => handleFreezeOnFocus("RR", formData.RR)}
                    onChange={handleAppendOnlyChange("RR")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
              <div className="primary-sub">
                <label>
                  SpO2:
                  {/* <input
                    name="SpO2"
                    value={formData.SpO2}
                    onChange={handleChange}
                  /> */}
                   <input
                    name="SpO2"
                    value={formData.SpO2}
                    onFocus={() => handleFreezeOnFocus("SpO2", formData.SpO2)}
                    onChange={handleAppendOnlyChange("SpO2")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
                <label>
                  AE:
                  {/* <input name="AE" value={formData.AE} onChange={handleChange} /> */}
                  <input
                    name="AE"
                    value={formData.AE}
                    onFocus={() => handleFreezeOnFocus("AE", formData.AE)}
                    onChange={handleAppendOnlyChange("AE")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
            </div>

            <div className="primary-row">
              <div className="primary-label">
                <label>
                  CIRCULATION:
                  {/* <input
                    name="CIRCULATION"
                    value={formData.CIRCULATION}
                    onChange={handleChange}
                  /> */}
                  <input
                    name="CIRCULATION"
                    value={formData.CIRCULATION}
                    onFocus={() => handleFreezeOnFocus("CIRCULATION", formData.CIRCULATION)}
                    onChange={handleAppendOnlyChange("CIRCULATION")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
              <div className="primary-sub">
                <label>
                  HR:
                  {/* <input name="HR" value={formData.HR} onChange={handleChange} /> */}
                  <input
                    name="HR"
                    value={formData.HR}
                    onFocus={() => handleFreezeOnFocus("HR", formData.HR)}
                    onChange={handleAppendOnlyChange("HR")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
                <label>
                  BP:
                  {/* <input name="BP" value={formData.BP} onChange={handleChange} /> */}

                  <input
                    name="BP"
                    value={formData.BP}
                    onFocus={() => handleFreezeOnFocus("BP", formData.BP)}
                    onChange={handleAppendOnlyChange("BP")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
              <div className="primary-sub">
                <label>
                  Peripheral pulses:
                  {/* <input
                    name="PeripheralPulses"
                    value={formData.PeripheralPulses}
                    onChange={handleChange}
                  /> */}
                  <input
                    name="PeripheralPulses"
                    value={formData.PeripheralPulses}
                    onFocus={() => handleFreezeOnFocus("PeripheralPulses", formData.PeripheralPulses)}
                    onChange={handleAppendOnlyChange("PeripheralPulses")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
            </div>

            <div className="primary-row">
              <div className="primary-label">
                <label>
                  DISABILITY:
                  {/* <input
                    name="DISABILITY"
                    value={formData.DISABILITY}
                    onChange={handleChange}
                  /> */}

                   <input
                    name="DISABILITY"
                    value={formData.DISABILITY}
                    onFocus={() => handleFreezeOnFocus("DISABILITY", formData.DISABILITY)}
                    onChange={handleAppendOnlyChange("DISABILITY")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
              <div className="primary-sub">
                <label>
                  GCS:
                  {/* <input
                    name="GCS"
                    value={formData.GCS}
                    onChange={handleChange}
                  /> */}
                  <input
                    name="GCS"
                    value={formData.GCS}
                    onFocus={() => handleFreezeOnFocus("GCS", formData.GCS)}
                    onChange={handleAppendOnlyChange("GCS")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
                <label>
                  Pupils:
                  {/* <input
                    name="Pupils"
                    value={formData.Pupils}
                    onChange={handleChange}
                  /> */}

                  <input
                    name="Pupils"
                    value={formData.Pupils}
                    onFocus={() => handleFreezeOnFocus("Pupils", formData.Pupils)}
                    onChange={handleAppendOnlyChange("Pupils")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
              <div className="primary-sub">
                <label>
                  GRBS:
                  {/* <input
                    name="GRBS"
                    value={formData.GRBS}
                    onChange={handleChange}
                  /> */}
                   <input
                    name="GRBS"
                    value={formData.GRBS}
                    onFocus={() => handleFreezeOnFocus("GRBS", formData.GRBS)}
                    onChange={handleAppendOnlyChange("GRBS")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
            </div>

            <div className="primary-row">
              <div className="primary-label">
                <label>
                  EXPOSURE:
                  {/* <input
                    name="EXPOSURE"
                    value={formData.EXPOSURE}
                    onChange={handleChange}
                  /> */}
                   <input
                    name="EXPOSURE"
                    value={formData.EXPOSURE}
                    onFocus={() => handleFreezeOnFocus("EXPOSURE", formData.EXPOSURE)}
                    onChange={handleAppendOnlyChange("EXPOSURE")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
              <div className="primary-sub">
                <label>
                  Temp:
                  {/* <input
                    name="Temp"
                    value={formData.Temp}
                    onChange={handleChange}
                  /> */}

                  <input
                    name="Temp"
                    value={formData.Temp}
                    onFocus={() => handleFreezeOnFocus("Temp", formData.Temp)}
                    onChange={handleAppendOnlyChange("Temp")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
              <div className="primary-sub">
                <label>
                  Others:
                  {/* <input
                    name="ExposureOthers"
                    value={formData.ExposureOthers}
                    onChange={handleChange}
                  /> */}

                  <input
                    name="TempExposureOthers"
                    value={formData.ExposureOthers}
                    onFocus={() => handleFreezeOnFocus("ExposureOthers", formData.Temp)}
                    onChange={handleAppendOnlyChange("ExposureOthers")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Survey */}
        <div className="secondary-block">
          <div className="secondary-title">Secondary Survey</div>

          <div className="chief-box">
            <div className="chief-title">Chief Symptoms :</div>
            <textarea
              name="ChiefSymptoms"
              rows="4"
              value={formData.ChiefSymptoms}
              disabled={isViewMode || isEditMode}
              onChange={(e) => {
                handleChange(e);
                adjustHeight(e);
              }}
            />

            {/* OLD – READ ONLY */}
            {/* <textarea
              value={formData.ChiefSymptoms}
              readOnly
              className="readonly-textarea"
            /> */}

            {/* NEW – APPEND ONLY */}
            {isEditMode && (
              <textarea
                placeholder="Add new notes..."
                value={editNotes.ChiefSymptoms_New}
                onChange={(e) =>
                  setEditNotes((prev) => ({
                    ...prev,
                    ChiefSymptoms_New: e.target.value,
                  }))
                }
              />
            )}
          </div>

          
          {/* <br />
           */}

          <div className="allergies-line">
            <label>
              Allergies :{" "}
              {/* <input
                name="Allergies"
                value={formData.Allergies}
                onChange={handleChange}
              /> */}
              <input
                    name="Allergies"
                    value={formData.Allergies}
                    onFocus={() => handleFreezeOnFocus("Allergies", formData.Allergies)}
                    onChange={handleAppendOnlyChange("Allergies")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
            </label>
            <label>
              Last Meal :{" "}
              {/* <input
                name="LastMeal"
                value={formData.LastMeal}
                onChange={handleChange}
              /> */}
               <input
                    name="LastMeal"
                    value={formData.LastMeal}
                    onFocus={() => handleFreezeOnFocus("LastMeal", formData.LastMeal)}
                    onChange={handleAppendOnlyChange("LastMeal")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
            </label>
            <label className="lmp">
              LMP :{" "}
              {/* <input name="LMP" value={formData.LMP} onChange={handleChange} /> */}
             <input
                    name="LMP"
                    value={formData.LMP}
                    onFocus={() => handleFreezeOnFocus("LMP", formData.LMP)}
                    onChange={handleAppendOnlyChange("LMP")}
                    onClick={forceCursorToEnd}
                    onKeyUp={forceCursorToEnd}
                  />
            
            </label>
          </div>

          <div className="past-and-general">
            <div className="past-left">
              <div className="section-mini-title">Past History and Medications</div>
              <textarea
                name="PastHistoryandMedications"
                value={formData.PastHistoryandMedications}
                onFocus={() => handleFreezeOnFocus("PastHistoryandMedications", formData.PastHistoryandMedications)}
                onChange={handleAppendOnlyChange("PastHistoryandMedications")}
                // onChange={handleChange}
                onInput={adjustHeight}
                onClick={forceCursorToEnd}
                onKeyUp={forceCursorToEnd}
              />
            </div>
            <div className="past-right">
              <div className="section-mini-title">General Examination</div>
              <textarea
                name="GeneralExamination"
                value={formData.GeneralExamination}              
                onFocus={() => handleFreezeOnFocus("GeneralExamination", formData.GeneralExamination)}
                onChange={handleAppendOnlyChange("GeneralExamination")}
                onInput={adjustHeight}
                onClick={forceCursorToEnd}
                onKeyUp={forceCursorToEnd}
              />
             
            </div>
          </div>

          <div className="systemic-title">SYSTEMIC EXAMINATION</div>

          <div className="systemic-grid">
            <div className="sys-col">
              <div className="sys-head">RS</div>
              <textarea
                name="RS"
                value={formData.RS}
                onFocus={() => handleFreezeOnFocus("RS", formData.RS)}
                onChange={handleAppendOnlyChange("RS")}
                onInput={adjustHeight}
                onClick={forceCursorToEnd}
                onKeyUp={forceCursorToEnd}
              />
            </div>
            <div className="sys-col">
              <div className="sys-head">CVS</div>
              <textarea
                name="CVS"
                value={formData.CVS}
                onFocus={() => handleFreezeOnFocus("CVS", formData.CVS)}
                onChange={handleAppendOnlyChange("CVS")}
                onInput={adjustHeight}
                onClick={forceCursorToEnd}
                onKeyUp={forceCursorToEnd}
              />
            </div>
            <div className="sys-col">
              <div className="sys-head">ABD/PELVIS</div>
              <textarea
                name="ABDPELVIS"
                value={formData.ABDPELVIS}
                onFocus={() => handleFreezeOnFocus("ABDPELVIS", formData.ABDPELVIS)}
                onChange={handleAppendOnlyChange("ABDPELVIS")}
                onInput={adjustHeight}
                onClick={forceCursorToEnd}
                onKeyUp={forceCursorToEnd}

              />
            </div>
            <div className="sys-col">
              <div className="sys-head">CNS</div>
              <textarea
                name="CNS"
                value={formData.CNS}
                onFocus={() => handleFreezeOnFocus("CNS", formData.CNS)}
                onChange={handleAppendOnlyChange("CNS")}
                onInput={adjustHeight}
                onClick={forceCursorToEnd}
                onKeyUp={forceCursorToEnd}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="Main_container_Btn">
        {!isViewMode && (
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>
        )}

        {isEditMode && (
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        )}

        <button onClick={clearForm}>Clear</button>
        <button onClick={handlePrint}>Print</button>
      </div>

      <h3 style={{ marginTop: "30px" }}>Treatment Records</h3>
      <ReactGrid columns={columns} RowData={tableData} />
    </div>
  );
};

export default RenderTreatmentRecord;