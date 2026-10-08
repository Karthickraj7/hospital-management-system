
// // import React, { useRef, useState, useEffect } from "react";
// // import { useReactToPrint } from "react-to-print";
// // import bodyImage from "../../../Assets/body2.jpg";
// // import "./ExaminationForm.css";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
// // import ToastAlert from "../../../OtherComponent/ToastContainer/ToastAlert";


// // const RenderExaminationForm = () => {


// //   const [form, setForm] = useState({
// //   POCUS: "",
// //   CCT: "",
// //   PCT: "",
// //   LOGROLL: "",
// //   Front: "",
// //   Back: "",
// //   ProvisionalDiagnosis: "",
// //   Investigations: "",  // Keep this (capital I)
// // });

// //   const formRef = useRef();
// //   const canvasRef = useRef();
// //   const [drawing, setDrawing] = useState(false);

// //   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
// //   // const Patient_id = useSelector((state) => state.userRecord?.Patient_id);
// //   const Created_by = useSelector((state) => state.userRecord?.username);
// //   // const Patient_id = useSelector((state) => state.userRecord?.Patient_id);


// //   const IP_DoctorWorkbenchNavigation = useSelector(
// //       (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
// //     );

// //   const Patient_id = useSelector(
// //   (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation?.PatientId
// //    );


// //   console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation')
// //   // const [Patient_id, setPatient_id] = useState(null);


// //   const [tableData, setTableData] = useState([]);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [isViewMode, setIsViewMode] = useState(false);
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [loading, setLoading] = useState(false);

  

// //   const handlePrint = useReactToPrint({
// //     content: () => formRef.current,
// //     documentTitle: "Examination_Form",
// //   });



// // const fetchList = async () => {
// //   if (!Patient_id || !UrlLink) return;

// //   try {
// //     setLoading(true);

// //     const res = await axios.get(
// //       `${UrlLink}Ip_Workbench/get_examination_forms/${Patient_id}/`
// //     );

// //     const data = res.data?.data || [];

// //     setTableData(
// //       data.map((row, index) => ({
// //         ...row,
// //         sNo: index + 1,
// //         date: row.CreatedDate?.split("T")[0] || "--",
// //         time: row.CreatedDate?.split("T")[1]?.substring(0, 5) || "--",
// //       }))
// //     );
// //   } catch (error) {
// //     console.error("Fetch Error:", error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };



// // useEffect(() => {
// //   if (Patient_id && UrlLink) {
// //     fetchList();
// //   }
// // }, [Patient_id, UrlLink]);




// // useEffect(() => {
// //   console.log("Patient ID:", Patient_id);
// //   console.log("UrlLink:", UrlLink);
// // }, [Patient_id, UrlLink]);



// //   /* ---------------- SUBMIT ---------------- */
// //   const handleSubmit = async () => {
// //     setLoading(true);
// //     try {
      
// //      await axios.post(`${UrlLink}Ip_Workbench/examination_form_Details_Link`, {
      
// //       POCUS: form.POCUS,
// //       CCT: form.CCT,
// //       PCT: form.PCT,
// //       LOGROLL: form.LOGROLL,
// //       Front: form.Front,
// //       Back: form.Back,
// //       ProvisionalDiagnosis: form.ProvisionalDiagnosis,
// //       Investigations: form.Investigations,
// //       LocalExaminationImage: getCanvasImage(),
// //       Patient_id : IP_DoctorWorkbenchNavigation?.PatientId

// // });
// //       alert("Submitted Successfully");
// //       handleClear();
// //       fetchList();
// //     } catch {
// //       alert("Save Failed!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ------------------ VIEW / EDIT / UPDATE ------------------




// // const handleView = (row) => {
// //   setSelectedRecord(row);

// //   setForm({
// //     POCUS: row.POCUS || "",
// //     CCT: row.CCT || "",
// //     PCT: row.PCT || "",
// //     LOGROLL: row.LOGROLL || "",
// //     Front: row.Front || "",
// //     Back: row.Back || "",
// //     ProvisionalDiagnosis: row.ProvisionalDiagnosis || "",
// //     Investigations: row.Investigations || "",
// //   });

// //   // CLEAR first
// //   clearCanvas();

// //   if (row.LocalExaminationImage && canvasRef.current) {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext("2d");

// //     const img = new Image();
// //     img.onload = () => {
// //       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
// //     };
// //     img.src = row.LocalExaminationImage;
// //   }

// //   setIsViewMode(true);
// //   setIsEditMode(false);
// // };

  
// // const handleEdit = (row) => {
// //   handleView(row);
// //   setIsEditMode(true);
// //   setIsViewMode(false);
// //   formRef.current?.scrollIntoView({ behavior: "smooth" });
// // };



// //  /* ---------------- UPDATE ---------------- */


// //   const handleUpdate = async () => {
// //   if (!selectedRecord?.id) {
// //     alert("No record selected");
// //     return;
// //   }

// //   setLoading(true);
// //   try {
// //     const canvasImage = getCanvasImage();

// //     await axios.patch(
// //       `${UrlLink}Ip_Workbench/update_examination_forms/${selectedRecord.id}/`,
// //       {
// //         ...form,
// //         LocalExaminationImage:
// //           canvasImage && canvasImage.length > 100
// //             ? canvasImage
// //             : selectedRecord.LocalExaminationImage, // KEEP OLD
// //       }
// //     );

// //     alert("Updated Successfully");
// //     handleClear();
// //     fetchList();
// //   } catch (err) {
// //     console.error(err);
// //     alert("Update Failed");
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// //   const handleClear = () => {
// //     setForm({
// //       POCUS: "",
// //       CCT: "",
// //       PCT: "",
// //       LOGROLL: "",
// //       Front: "",
// //       Back: "",
// //       ProvisionalDiagnosis: "",
// //       Investigations: "",
      
// //     });
// //     clearCanvas();
// //     setSelectedRecord(null);
// //     setIsEditMode(false);
// //   };


// // //   function getCanvasImage() {
// // //   const canvas = canvasRef.current;
// // //   if (!canvas) return "";
// // //   return canvas.toDataURL("image/png");
// // // }


// // const getCanvasImage = () => {
// //   if (!canvasRef.current) return "";
// //   return canvasRef.current.toDataURL("image/png");
// // };

// //   // ------------------ GRID COLUMNS ------------------
// //   const columns = [
// //     { key: "sNo", name: "S.No" },

    
// //     { key: "date", name: "Date" },
// //     { key: "time", name: "Time" },
// //     {
// //       key: "view",
// //       name: "View",
// //       renderCell: ({ row }) => (
// //         <button className="view-btn" onClick={() => handleView(row)}>
// //           👁
// //         </button>
// //       ),
// //     },
// //     // {
// //     //   key: "edit",
// //     //   name: "Edit",
// //     //   renderCell: ({ row }) => (
// //     //     <button className="edit-btn" onClick={() => handleEdit(row)}>
// //     //       ✏️
// //     //     </button>
// //     //   ),
// //     // },
// //   ];

// //   // ------------------ TEXTAREA HANDLING ------------------
// //   const handleChange = (e) => {
// //     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// //   };

// //   const adjustHeight = (e) => {
// //   const textarea = e.target;
// //   textarea.style.height = "auto";
// //   const newHeight = Math.min(textarea.scrollHeight + 4, 200); // max 200px
// //   textarea.style.height = newHeight + "px";
// // };

// //   // ------------------ CANVAS DRAWING ------------------
// //   const startDrawing = (e) => {
// //     const canvas = canvasRef.current;
// //     if (!canvas || canvas.width === 0) return;

// //     const ctx = canvas.getContext("2d");
// //     ctx.strokeStyle = "#ff0000";
// //     ctx.lineWidth = 2;

// //     const x = e.nativeEvent.offsetX;
// //     const y = e.nativeEvent.offsetY;

// //     ctx.beginPath();
// //     ctx.moveTo(x, y);

// //     setDrawing(true);
// //   };

// //   const draw = (e) => {
// //     if (!drawing) return;
// //     const canvas = canvasRef.current;

// //     const ctx = canvas.getContext("2d");
// //     const x = e.nativeEvent.offsetX;
// //     const y = e.nativeEvent.offsetY;

// //     ctx.lineTo(x, y);
// //     ctx.stroke();
// //   };

// //   const stopDrawing = () => setDrawing(false);

// //   // const clearCanvas = () => {
// //   //   const canvas = canvasRef.current;
// //   //   const ctx = canvas.getContext("2d");
// //   //   ctx.clearRect(0, 0, canvas.width, canvas.height);
// //   // };

// //   const clearCanvas = () => {
// //   const canvas = canvasRef.current;
// //   const ctx = canvas.getContext("2d");

// //   ctx.clearRect(0, 0, canvas.width, canvas.height);
// // };



// // useEffect(() => {
// //   const canvas = canvasRef.current;
// //   const img = document.querySelector(".body-image");

// //   if (!canvas || !img) return;

// //   const setSize = () => {
// //     if (!img.complete) return;
// //     canvas.width = img.naturalWidth;
// //     canvas.height = img.naturalHeight;
// //   };

// //   img.onload = setSize;
// //   setSize();
// // }, []);


// //   // ------------------ MAKE CANVAS MATCH IMAGE SIZE ------------------
// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     const container = canvas.parentElement;
// //     const img = container.querySelector("img");

// //     const adjust = () => {
// //       if (!img.complete) return;
// //       canvas.width = img.clientWidth;
// //       canvas.height = img.clientHeight;
// //     };

// //     img.onload = adjust;
// //     adjust();

// //     window.addEventListener("resize", adjust);
// //     return () => window.removeEventListener("resize", adjust);
// //   }, []);

// //   // ------------------ PRINT FIX (MERGE CANVAS + IMAGE) ------------------
// //   const preparePrint = () => {
// //     const canvas = canvasRef.current;
// //     const img = document.querySelector(".body-image");
// //     if (!canvas || !img) return;

// //     const tempCanvas = document.createElement("canvas");
// //     tempCanvas.width = img.clientWidth;
// //     tempCanvas.height = img.clientHeight;

// //     const ctx = tempCanvas.getContext("2d");

// //     const baseImg = new Image();
// //     baseImg.src = bodyImage;

// //     baseImg.onload = () => {
// //       ctx.drawImage(baseImg, 0, 0, tempCanvas.width, tempCanvas.height);
// //       ctx.drawImage(canvas, 0, 0);

// //       const merged = tempCanvas.toDataURL("image/png");
// //       img.src = merged;

// //       setTimeout(() => {
// //         handlePrint();
// //       }, 300);

// //       setTimeout(() => {
// //         img.src = bodyImage;
// //       }, 1000);
// //     };
// //   };


  
// //   const isFormReadOnly = isViewMode && !isEditMode;

// //   // ------------------ UI ------------------
// //   return (
// //     <div className="form-container">
// //       {/* MAIN FORM */}
// //       <div ref={formRef} className="a4-page">
// //         {/* ------------ POCUS ------------ */}
// //         <div className="section">
// //           <div className="section-title">POCUS</div>
// //           <div className="field-row">
// //                   <textarea
// //   name="POCUS"
// //   value={form.POCUS}
// //   onChange={handleChange}
// // />


// //             <div className="pocus-right">
// //               <p>CCT: <input
// //   name="CCT"
// //   value={form.CCT}
// //   onChange={handleChange}
// // /></p>
// //               <p>PCT: <input
// //   name="PCT"
// //   value={form.PCT}
// //   onChange={handleChange}
// // /></p>
// //               <p>LOG ROLL: <input
// //   name="LOGROLL"
// //   value={form.LOGROLL}
// //   onChange={handleChange}
// // /></p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* ------------ LOCAL EXAMINATION ------------ */}
// //         <div className="section">
// //           <div className="section-title">LOCAL EXAMINATION</div>

// //           <div className="exam-center single">
// //             <div className="body-container single">
// //               <img src={bodyImage} alt="Body" className="body-image" />

// //               <canvas
// //                 ref={canvasRef}
// //                 className="draw-layer"
// //                 onMouseDown={startDrawing}
// //                 onMouseMove={draw}
// //                 onMouseUp={stopDrawing}
// //                 onMouseLeave={stopDrawing}
// //               ></canvas>
// //             </div>
// //           </div>
// //         </div>

// //         {/* FRONT & BACK */}
// //         <div className="past-and-general">
// //           <div className="past-left">
// //             <div className="section-mini-title">Front</div>
// //             <textarea
// //               name="Front"
// //               value={form.Front}
// //               onChange={handleChange}
// //               onInput={adjustHeight}
// //             />
// //           </div>

// //           <div className="past-right">
// //             <div className="section-mini-title">Back</div>
// //             <textarea
// //               name="Back"
// //               value={form.Back}
// //               onChange={handleChange}
// //               onInput={adjustHeight}
// //             />
// //           </div>
// //         </div>

// //         {/* PROVISIONAL DIAGNOSIS */}
// //         <div className="section">
// //           <div className="section-title">PROVISIONAL DIAGNOSIS</div>
// //           <textarea className="large-textarea" placeholder="Enter Provisional Diagnosis..." name="ProvisionalDiagnosis"
// //               value={form.ProvisionalDiagnosis}
// //               onChange={handleChange}
// //               onInput={adjustHeight} />
// //         </div>

// //         {/* INVESTIGATION */}
// //         <div className="section">
// //           <div className="section-title">INVESTIGATION</div>
// //           <textarea className="large-textarea" placeholder="Enter Investigations..." name="Investigations"
// //               value={form.Investigations}
// //               onChange={handleChange}
// //               onInput={adjustHeight}/>
// //         </div>
// //       </div>
// // <br />


// // <div className="Main_container_Btn">
// //   <button onClick={preparePrint}>Print</button>

// //   {!isEditMode ? (
// //     <button onClick={handleSubmit} disabled={loading}>
// //       Submit
// //     </button>
// //   ) : (
// //     <>
// //       <button onClick={handleUpdate} disabled={loading}>
// //         ✔ Update
// //       </button>

// //       <button onClick={clearCanvas}>
// //         🧹 Clear Drawing
// //       </button>
// //     </>
// //   )}
// // </div>

// //       <ReactGrid columns={columns} RowData={tableData} />
// //     </div>
// //   );
// // }

// // export default RenderExaminationForm;










// import React, { useRef, useState, useEffect } from "react";
// import { useReactToPrint } from "react-to-print";
// import bodyImage from "../../../Assets/body2.jpg";
// import "./ExaminationForm.css";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
// import ToastAlert from "../../../OtherComponent/ToastContainer/ToastAlert";

// const RenderExaminationForm = () => {
//   const [form, setForm] = useState({
//     POCUS: "",
//     CCT: "",
//     PCT: "",
//     LOGROLL: "",
//     Front: "",
//     Back: "",
//     ProvisionalDiagnosis: "",
//     Investigations: "",
//   });

//   const formRef = useRef();
//   const canvasRef = useRef();
//   const [drawing, setDrawing] = useState(false);

//   // 🔥 FIXED: Proper Patient_id fallback (like TreatmentRecord)
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const Created_by = useSelector((state) => state.userRecord?.username);
  
//   const IP_DoctorWorkbenchNavigation = useSelector(
//     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
//   );
//   const DoctorWorkbenchNavigation = useSelector(
//     (state) => state.Frontoffice?.DoctorWorkbenchNavigation
//   );

//   // ✅ FIXED: Patient_id fallback from BOTH sources
//   const Patient_id = IP_DoctorWorkbenchNavigation?.PatientId || 
//                     DoctorWorkbenchNavigation?.PatientId;

//   const [tableData, setTableData] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handlePrint = useReactToPrint({
//     content: () => formRef.current,
//     documentTitle: "Examination_Form",
//   });

//   // ✅ FIXED: Fetch with proper Patient_id check
//   const fetchList = async () => {
//     if (!Patient_id || !UrlLink) {
//       console.log("Missing Patient_id or UrlLink:", { Patient_id, UrlLink });
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("Fetching for Patient_id:", Patient_id);
      
//       const res = await axios.get(
//         `${UrlLink}Ip_Workbench/get_examination_forms/${Patient_id}/`
//       );

//       const data = res.data?.data || [];
//       console.log("Fetched", data.length, "records");

//       setTableData(
//         data.map((row, index) => ({
//           ...row,
//           sNo: index + 1,
//           date: row.CreatedDate?.split("T")[0] || "--",
//           time: row.CreatedDate?.split("T")[1]?.substring(0, 5) || "--",
//         }))
//       );
//     } catch (error) {
//       console.error("Fetch Error:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIXED: useEffect dependencies
//   useEffect(() => {
//     console.log("Patient_id changed:", Patient_id, "UrlLink:", UrlLink);
//     if (Patient_id && UrlLink) {
//       fetchList();
//     } else {
//       setTableData([]);
//     }
//   }, [Patient_id, UrlLink]);


// // // try




//   // 🔥 FIXED: Submit - EXACT TreatmentRecord pattern
//   const handleSubmit = async () => {
//     if (!Patient_id) {
//       alert("No patient selected");
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log("Submitting for Patient_id:", Patient_id);
      
//       const canvasImage = getCanvasImage();
//       console.log("Canvas image:", canvasImage ? "exists" : "empty");

//       const payload = {
//         POCUS: form.POCUS || "",
//         CCT: form.CCT || "",
//         PCT: form.PCT || "",
//         LOGROLL: form.LOGROLL || "",
//         Front: form.Front || "",
//         Back: form.Back || "",
//         ProvisionalDiagnosis: form.ProvisionalDiagnosis || "",
//         Investigations: form.Investigations || "",
//         LocalExaminationImage: canvasImage || "",
//         Patient_id: Patient_id,        // ✅ FIXED: Use consistent Patient_id
//         Created_by: Created_by || "Unknown"
//       };

//       console.log("Submit payload:", payload);
//       console.log("Submit URL:", `${UrlLink}Ip_Workbench/examination_form_Details_Link`);

//       // ✅ FIXED: NO trailing slash (matches Django URL)
//       await axios.post(`${UrlLink}Ip_Workbench/examination_form_Details_Link`, payload);
      
//       alert("✅ Submitted Successfully");
//       handleClear();
//       fetchList();
//     } catch (error) {
//       console.error("Submit Error:", error.response?.data || error.message);
//       console.error("Status:", error.response?.status);
//       alert(`❌ Save Failed! Status: ${error.response?.status || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleView = (row) => {
//     setSelectedRecord(row);
//     setForm({
//       POCUS: row.POCUS || "",
//       CCT: row.CCT || "",
//       PCT: row.PCT || "",
//       LOGROLL: row.LOGROLL || "",
//       Front: row.Front || "",
//       Back: row.Back || "",
//       ProvisionalDiagnosis: row.ProvisionalDiagnosis || "",
//       Investigations: row.Investigations || "",
//     });

//     clearCanvas();

//     if (row.LocalExaminationImage && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       const img = new Image();
//       img.onload = () => {
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//       };
//       img.src = row.LocalExaminationImage;
//     }

//     setIsViewMode(true);
//     setIsEditMode(false);
//     formRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleEdit = (row) => {
//     handleView(row);
//     setIsEditMode(true);
//     setIsViewMode(false);
//   };

//   const handleUpdate = async () => {
//     if (!selectedRecord?.id) {
//       alert("No record selected");
//       return;
//     }

//     setLoading(true);
//     try {
//       const canvasImage = getCanvasImage();
//       const payload = {
//         ...form,
//         LocalExaminationImage: canvasImage && canvasImage.length > 100
//           ? canvasImage
//           : selectedRecord.LocalExaminationImage,
//         UpdatedBy: Created_by
//       };

//       await axios.patch(
//         `${UrlLink}Ip_Workbench/update_examination_forms/${selectedRecord.id}/`,
//         payload
//       );

//       alert("✅ Updated Successfully");
//       handleClear();
//       fetchList();
//     } catch (error) {
//       console.error("Update Error:", error.response?.data || error.message);
//       alert("❌ Update Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setForm({
//       POCUS: "",
//       CCT: "",
//       PCT: "",
//       LOGROLL: "",
//       Front: "",
//       Back: "",
//       ProvisionalDiagnosis: "",
//       Investigations: "",
//     });
//     clearCanvas();
//     setSelectedRecord(null);
//     setIsViewMode(false);
//     setIsEditMode(false);
//   };

//   const getCanvasImage = () => {
//     if (!canvasRef.current) return "";
//     return canvasRef.current.toDataURL("image/png");
//   };

//   const columns = [
//     { key: "sNo", name: "S.No" },
//     { key: "date", name: "Date" },
//     { key: "time", name: "Time" },
//     {
//       key: "actions",
//       name: "Actions",
//       renderCell: ({ row }) => (
//         <>
//           <button className="view-btn" onClick={() => handleView(row)} style={{marginRight: '5px'}}>
//             👁
//           </button>
//           {/* <button className="edit-btn" onClick={() => handleEdit(row)}>
//             ✏️
//           </button> */}
//         </>
//       ),
//     },
//   ];

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const adjustHeight = (e) => {
//     const textarea = e.target;
//     textarea.style.height = "auto";
//     const newHeight = Math.min(textarea.scrollHeight + 4, 200);
//     textarea.style.height = newHeight + "px";
//   };

//   // Canvas drawing
//   const startDrawing = (e) => {
//     const canvas = canvasRef.current;
//     if (!canvas || canvas.width === 0) return;

//     const ctx = canvas.getContext("2d");
//     ctx.strokeStyle = "#ff0000";
//     ctx.lineWidth = 2;
//     const x = e.nativeEvent.offsetX;
//     const y = e.nativeEvent.offsetY;
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     setDrawing(true);
//   };

//   const draw = (e) => {
//     if (!drawing) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const x = e.nativeEvent.offsetX;
//     const y = e.nativeEvent.offsetY;
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => setDrawing(false);

//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//     }
//   };

//   // Canvas resize effects
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const img = document.querySelector(".body-image");
//     if (!canvas || !img) return;

//     const setSize = () => {
//       if (!img.complete) return;
//       canvas.width = img.naturalWidth;
//       canvas.height = img.naturalHeight;
//     };
//     img.onload = setSize;
//     setSize();
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const container = canvas.parentElement;
//     const img = container.querySelector("img");

//     const adjust = () => {
//       if (!img?.complete || !canvas) return;
//       canvas.width = img.clientWidth;
//       canvas.height = img.clientHeight;
//     };

//     img.onload = adjust;
//     adjust();
//     window.addEventListener("resize", adjust);
//     return () => window.removeEventListener("resize", adjust);
//   }, []);

//   const preparePrint = () => {
//     const canvas = canvasRef.current;
//     const img = document.querySelector(".body-image");
//     if (!canvas || !img) return;

//     const tempCanvas = document.createElement("canvas");
//     tempCanvas.width = img.clientWidth;
//     tempCanvas.height = img.clientHeight;
//     const ctx = tempCanvas.getContext("2d");

//     const baseImg = new Image();
//     baseImg.src = bodyImage;
//     baseImg.onload = () => {
//       ctx.drawImage(baseImg, 0, 0, tempCanvas.width, tempCanvas.height);
//       ctx.drawImage(canvas, 0, 0);
//       const merged = tempCanvas.toDataURL("image/png");
//       img.src = merged;
//       setTimeout(() => handlePrint(), 300);
//       setTimeout(() => img.src = bodyImage, 1000);
//     };
//   };

//   const isFormReadOnly = isViewMode && !isEditMode;

//   return (
//     <div className="form-container">
//       <div ref={formRef} className="a4-page">
//         {/* POCUS */}
//         <div className="section">
//           <div className="section-title">POCUS</div>
//           <div className="field-row">
//             <textarea
//               name="POCUS"
//               value={form.POCUS}
//               onChange={handleChange}
//               readOnly={isFormReadOnly}
//               onInput={adjustHeight}
//             />
//             <div className="pocus-right">
//               <p>CCT: <input
//                 name="CCT"
//                 value={form.CCT}
//                 onChange={handleChange}
//                 readOnly={isFormReadOnly}
//               /></p>
//               <p>PCT: <input
//                 name="PCT"
//                 value={form.PCT}
//                 onChange={handleChange}
//                 readOnly={isFormReadOnly}
//               /></p>
//               <p>LOG ROLL: <input
//                 name="LOGROLL"
//                 value={form.LOGROLL}
//                 onChange={handleChange}
//                 readOnly={isFormReadOnly}
//               /></p>
//             </div>
//           </div>
//         </div>

//         {/* LOCAL EXAMINATION */}
//         <div className="section">
//           <div className="section-title">LOCAL EXAMINATION</div>
//           <div className="exam-center single">
//             <div className="body-container single">
//               <img src={bodyImage} alt="Body" className="body-image" />
//               <canvas
//                 ref={canvasRef}
//                 className="draw-layer"
//                 onMouseDown={isFormReadOnly ? undefined : startDrawing}
//                 onMouseMove={isFormReadOnly ? undefined : draw}
//                 onMouseUp={isFormReadOnly ? undefined : stopDrawing}
//                 onMouseLeave={isFormReadOnly ? undefined : stopDrawing}
//               />
//             </div>
//           </div>
//         </div>

//         {/* FRONT & BACK */}
//         <div className="past-and-general">
//           <div className="past-left">
//             <div className="section-mini-title">Front</div>
//             <textarea
//               name="Front"
//               value={form.Front}
//               onChange={handleChange}
//               onInput={adjustHeight}
//               readOnly={isFormReadOnly}
//             />
//           </div>
//           <div className="past-right">
//             <div className="section-mini-title">Back</div>
//             <textarea
//               name="Back"
//               value={form.Back}
//               onChange={handleChange}
//               onInput={adjustHeight}
//               readOnly={isFormReadOnly}
//             />
//           </div>
//         </div>

//         {/* PROVISIONAL DIAGNOSIS */}
//         <div className="section">
//           <div className="section-title">PROVISIONAL DIAGNOSIS</div>
//           <textarea 
//             className="large-textarea" 
//             placeholder="Enter Provisional Diagnosis..."
//             name="ProvisionalDiagnosis"
//             value={form.ProvisionalDiagnosis}
//             onChange={handleChange}
//             onInput={adjustHeight}
//             readOnly={isFormReadOnly}
//           />
//         </div>

//         {/* INVESTIGATION */}
//         <div className="section">
//           <div className="section-title">INVESTIGATION</div>
//           <textarea 
//             className="large-textarea" 
//             placeholder="Enter Investigations..."
//             name="Investigations"
//             value={form.Investigations}
//             onChange={handleChange}
//             onInput={adjustHeight}
//             readOnly={isFormReadOnly}
//           />
//         </div>
//       </div>

//       <br />

//       <div className="Main_container_Btn">
//         <button onClick={preparePrint}>Print</button>

//         {!isEditMode ? (
//           <button onClick={handleSubmit} disabled={loading || !Patient_id}>
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         ) : (
//           <>
//             <button onClick={handleUpdate} disabled={loading}>
//               {loading ? "Updating..." : "✔ Update"}
//             </button>
//             <button onClick={clearCanvas}>🧹 Clear Drawing</button>
//             <button onClick={handleClear}>Clear Form</button>
//           </>
//         )}
//         <button onClick={handleClear}>Clear</button>
//       </div>

//       <ReactGrid columns={columns} RowData={tableData} />
//     </div>
//   );
// };

// export default RenderExaminationForm;



import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import bodyImage from "../../../Assets/body2.jpg";
import "./ExaminationForm.css";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../../OtherComponent/ToastContainer/ToastAlert";
 
const RenderExaminationForm = () => {
  const [form, setForm] = useState({
    POCUS: "",
    CCT: "",
    PCT: "",
    LOGROLL: "",
    Front: "",
    Back: "",
    ProvisionalDiagnosis: "",
    Investigations: "",
  });
 
  const formRef = useRef();
  const canvasRef = useRef();
  const [drawing, setDrawing] = useState(false);
 
  // 🔥 FIXED: Proper Patient_id fallback (like TreatmentRecord)
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const Created_by = useSelector((state) => state.userRecord?.username);
 
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );
 
  // ✅ FIXED: Patient_id fallback from BOTH sources
  const Patient_id = IP_DoctorWorkbenchNavigation?.PatientId ||
                    DoctorWorkbenchNavigation?.PatientId;
 
  const [tableData, setTableData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const handlePrint = useReactToPrint({
    content: () => formRef.current,
    documentTitle: "Examination_Form",
  });
 
  // ✅ FIXED: Fetch with proper Patient_id check
  const fetchList = async () => {
    if (!Patient_id || !UrlLink) {
      console.log("Missing Patient_id or UrlLink:", { Patient_id, UrlLink });
      return;
    }
 
    try {
      setLoading(true);
      console.log("Fetching for Patient_id:", Patient_id);
     
      const res = await axios.get(
        `${UrlLink}Ip_Workbench/get_examination_forms/${Patient_id}/`
      );
 
      const data = res.data?.data || [];
      console.log("Fetched", data.length, "records");
 
      setTableData(
        data.map((row, index) => ({
          ...row,
          sNo: index + 1,
          date: row.CreatedDate?.split("T")[0] || "--",
          time: row.CreatedDate?.split("T")[1]?.substring(0, 5) || "--",
        }))
      );
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
 
  // ✅ FIXED: useEffect dependencies
  useEffect(() => {
    console.log("Patient_id changed:", Patient_id, "UrlLink:", UrlLink);
    if (Patient_id && UrlLink) {
      fetchList();
    } else {
      setTableData([]);
    }
  }, [Patient_id, UrlLink]);
 
 
// // try
 
 
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
    form[name].slice(0, frozenLength)
  ) {
    return;
  }
 
  setForm((prev) => ({
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
 
 
 
  // 🔥 FIXED: Submit - EXACT TreatmentRecord pattern
  const handleSubmit = async () => {
    if (!Patient_id) {
      alert("No patient selected");
      return;
    }
 
    setLoading(true);
    try {
      console.log("Submitting for Patient_id:", Patient_id);
     
      const canvasImage = getCanvasImage();
      console.log("Canvas image:", canvasImage ? "exists" : "empty");
 
      const payload = {
        POCUS: form.POCUS || "",
        CCT: form.CCT || "",
        PCT: form.PCT || "",
        LOGROLL: form.LOGROLL || "",
        Front: form.Front || "",
        Back: form.Back || "",
        ProvisionalDiagnosis: form.ProvisionalDiagnosis || "",
        Investigations: form.Investigations || "",
        LocalExaminationImage: canvasImage || "",
        Patient_id: Patient_id,        // ✅ FIXED: Use consistent Patient_id
        Created_by: Created_by || "Unknown"
      };
 
      console.log("Submit payload:", payload);
      console.log("Submit URL:", `${UrlLink}Ip_Workbench/examination_form_Details_Link`);
 
      // ✅ FIXED: NO trailing slash (matches Django URL)
      await axios.post(`${UrlLink}Ip_Workbench/examination_form_Details_Link`, payload);
     
      alert("✅ Submitted Successfully");
      handleClear();
      fetchList();
    } catch (error) {
      console.error("Submit Error:", error.response?.data || error.message);
      console.error("Status:", error.response?.status);
      alert(`❌ Save Failed! Status: ${error.response?.status || error.message}`);
    } finally {
      setLoading(false);
    }
  };
 
  const handleView = (row) => {
    setSelectedRecord(row);
    setForm({
      POCUS: row.POCUS || "",
      CCT: row.CCT || "",
      PCT: row.PCT || "",
      LOGROLL: row.LOGROLL || "",
      Front: row.Front || "",
      Back: row.Back || "",
      ProvisionalDiagnosis: row.ProvisionalDiagnosis || "",
      Investigations: row.Investigations || "",
    });
 
    clearCanvas();
 
    if (row.LocalExaminationImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = row.LocalExaminationImage;
    }
 
    setIsViewMode(true);
    setIsEditMode(false);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };
 
  const handleEdit = (row) => {
    handleView(row);
    setIsEditMode(true);
    setIsViewMode(false);
  };
 
  const handleUpdate = async () => {
    if (!selectedRecord?.id) {
      alert("No record selected");
      return;
    }
 
    setLoading(true);
    try {
      const canvasImage = getCanvasImage();
      const payload = {
        ...form,
        LocalExaminationImage: canvasImage && canvasImage.length > 100
          ? canvasImage
          : selectedRecord.LocalExaminationImage,
        UpdatedBy: Created_by
      };
 
      await axios.patch(
        `${UrlLink}Ip_Workbench/update_examination_forms/${selectedRecord.id}/`,
        payload
      );
 
      alert("✅ Updated Successfully");
      handleClear();
      fetchList();
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      alert("❌ Update Failed");
    } finally {
      setLoading(false);
    }
  };
 
  const handleClear = () => {
    setForm({
      POCUS: "",
      CCT: "",
      PCT: "",
      LOGROLL: "",
      Front: "",
      Back: "",
      ProvisionalDiagnosis: "",
      Investigations: "",
    });
    clearCanvas();
    setSelectedRecord(null);
    setIsViewMode(false);
    setIsEditMode(false);
  };
 
  const getCanvasImage = () => {
    if (!canvasRef.current) return "";
    return canvasRef.current.toDataURL("image/png");
  };
 
  const columns = [
    { key: "sNo", name: "S.No" },
    { key: "date", name: "Date" },
    { key: "time", name: "Time" },
   
     {
      key: "View",
      name: "View",
      renderCell: ({ row }) => <button onClick={() => handleView(row)}>👁</button>,
    },
 
    {
    key: "Edit",
    name: "Edit",
    renderCell: ({ row }) => (
      <button onClick={() => handleEdit(row)}>✏️</button>
    ),
  },
  ];
 
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
 
  const adjustHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight + 4, 200);
    textarea.style.height = newHeight + "px";
  };
 
  // Canvas drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) return;
 
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };
 
  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
 
  const stopDrawing = () => setDrawing(false);
 
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
 
  // Canvas resize effects
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = document.querySelector(".body-image");
    if (!canvas || !img) return;
 
    const setSize = () => {
      if (!img.complete) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    };
    img.onload = setSize;
    setSize();
  }, []);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const img = container.querySelector("img");
 
    const adjust = () => {
      if (!img?.complete || !canvas) return;
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
    };
 
    img.onload = adjust;
    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, []);
 
  const preparePrint = () => {
    const canvas = canvasRef.current;
    const img = document.querySelector(".body-image");
    if (!canvas || !img) return;
 
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = img.clientWidth;
    tempCanvas.height = img.clientHeight;
    const ctx = tempCanvas.getContext("2d");
 
    const baseImg = new Image();
    baseImg.src = bodyImage;
    baseImg.onload = () => {
      ctx.drawImage(baseImg, 0, 0, tempCanvas.width, tempCanvas.height);
      ctx.drawImage(canvas, 0, 0);
      const merged = tempCanvas.toDataURL("image/png");
      img.src = merged;
      setTimeout(() => handlePrint(), 300);
      setTimeout(() => img.src = bodyImage, 1000);
    };
  };
 
  const isFormReadOnly = isViewMode && !isEditMode;
 
  return (
    <div className="form-container">
      <div ref={formRef} className="a4-page">
        {/* POCUS */}
        <div className="section">
          <div className="section-title">POCUS</div>
          <div className="field-row">
            <textarea
              name="POCUS"
              value={form.POCUS}
              onChange={handleChange}
              readOnly={isFormReadOnly}
              onInput={adjustHeight}
            />
            <div className="pocus-right">
              <p>CCT: <input
                name="CCT"
                value={form.CCT}
                onChange={handleChange}
                readOnly={isFormReadOnly}
              /></p>
              <p>PCT: <input
                name="PCT"
                value={form.PCT}
                onChange={handleChange}
                readOnly={isFormReadOnly}
              /></p>
              <p>LOG ROLL: <input
                name="LOGROLL"
                value={form.LOGROLL}
                onChange={handleChange}
                readOnly={isFormReadOnly}
              /></p>
            </div>
          </div>
        </div>
 
        {/* LOCAL EXAMINATION */}
        <div className="section">
          <div className="section-title">LOCAL EXAMINATION</div>
          <div className="exam-center single">
            <div className="body-container single">
              <img src={bodyImage} alt="Body" className="body-image" />
              <canvas
                ref={canvasRef}
                className="draw-layer"
                onMouseDown={isFormReadOnly ? undefined : startDrawing}
                onMouseMove={isFormReadOnly ? undefined : draw}
                onMouseUp={isFormReadOnly ? undefined : stopDrawing}
                onMouseLeave={isFormReadOnly ? undefined : stopDrawing}
              />
            </div>
          </div>
        </div>
 
        {/* FRONT & BACK */}
        <div className="past-and-general">
          <div className="past-left">
            <div className="section-mini-title">Front</div>
            <textarea
              name="Front"
              value={form.Front}
              onChange={handleChange}
              onInput={adjustHeight}
              readOnly={isFormReadOnly}
            />
 
          </div>
          <div className="past-right">
            <div className="section-mini-title">Back</div>
            <textarea
              name="Back"
              value={form.Back}
              onInput={adjustHeight}            
              onFocus={() => handleFreezeOnFocus("Back", form.Back)}
              onChange={handleAppendOnlyChange("Back")}
              onClick={forceCursorToEnd}
              onKeyUp={forceCursorToEnd}
            />
          </div>
        </div>
 
        {/* PROVISIONAL DIAGNOSIS */}
        <div className="section">
          <div className="section-title">PROVISIONAL DIAGNOSIS</div>
          <textarea
            className="large-textarea"
            placeholder="Enter Provisional Diagnosis..."
            name="ProvisionalDiagnosis"
            value={form.ProvisionalDiagnosis}
            onInput={adjustHeight}            
            onFocus={() => handleFreezeOnFocus("ProvisionalDiagnosis", form.ProvisionalDiagnosis)}
            onChange={handleAppendOnlyChange("ProvisionalDiagnosis")}
            onClick={forceCursorToEnd}
            onKeyUp={forceCursorToEnd}
          />
        </div>
 
        {/* INVESTIGATION */}
        <div className="section">
          <div className="section-title">INVESTIGATION</div>
          <textarea
            className="large-textarea"
            placeholder="Enter Investigations..."
            name="Investigations"
            value={form.Investigations}            
            onInput={adjustHeight}
            onFocus={() => handleFreezeOnFocus("Investigations", form.Investigations)}
              onChange={handleAppendOnlyChange("Investigations")}
              onClick={forceCursorToEnd}
              onKeyUp={forceCursorToEnd}
          />
        </div>
      </div>
 
      <br />
 
      <div className="Main_container_Btn">
        <button onClick={preparePrint}>Print</button>
 
        {!isEditMode ? (
          <button onClick={handleSubmit} disabled={loading || !Patient_id}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <>
            <button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "✔ Update"}
            </button>
            <button onClick={clearCanvas}>🧹 Clear Drawing</button>
            <button onClick={handleClear}>Clear Form</button>
          </>
        )}
        <button onClick={handleClear}>Clear</button>
      </div>
 
      <ReactGrid columns={columns} RowData={tableData} />
    </div>
  );
};
 
export default RenderExaminationForm;