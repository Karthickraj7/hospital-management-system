
// // import React, { useRef, useState, useEffect } from "react";
// // import { useReactToPrint } from "react-to-print";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
// // import "./ProcedureForm.css";

// // const RenderProcedureForm = () => {
// //   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
// //   const IP_DoctorWorkbenchNavigation = useSelector(
// //     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
// //   );

// //   const base = UrlLink?.endsWith("/") ? UrlLink : UrlLink + "/";

// //   const formRef = useRef();
// //   const [tableData, setTableData] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const [ProcedureDetails, setProcedureDetails] = useState("");
// //   const [DoctorSignature, setDoctorSignature] = useState("");
// //   const [selectedRecord, setSelectedRecord] = useState(null);

// //   const [isViewMode, setIsViewMode] = useState(false);
// //   const [isEditMode, setIsEditMode] = useState(false);

// //   const Patient_id = IP_DoctorWorkbenchNavigation?.PatientId;
// //   const Created_by = IP_DoctorWorkbenchNavigation?.username;




// //   const handlePrint = useReactToPrint({
// //     content: () => formRef.current,
// //     documentTitle: "Procedure_Form",
// //   });

// //   const fetchTableData = async () => {
// //     if (!Patient_id || !UrlLink) return;
// //     try {
// //       const res = await axios.get(
// //         `${UrlLink}Ip_Workbench/get_procedure_forms/${Patient_id}/`
// //       );
// //       const formatted = res.data.map((item, index) => {
// //         const [date = "", time = ""] = (item.CreatedDate || "").split(" ");
// //         return { ...item, sNo: index + 1, date, time };
// //       });
// //       setTableData(formatted);
// //     } catch (err) {
// //       console.error("Fetch Error:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchTableData();
// //   }, [Patient_id, UrlLink]);

// //   const handleSubmit = async () => {
// //     if (!ProcedureDetails || !DoctorSignature)
// //       return alert("Enter all fields!");

// //     setLoading(true);
// //     try {
// //       await axios.post(`${UrlLink}Ip_Workbench/procedures_form_Details_Link`, {
// //         Patient_id,
// //         ProcedureDetails,
// //         DoctorSignature,
// //         Created_by,
// //       });
// //       alert("Saved Successfully");
// //       handleClear();
// //       fetchTableData();
// //     } catch {
// //       alert("Save Failed!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleView = (row) => {
// //     setSelectedRecord(row);
// //     setProcedureDetails(row.ProcedureDetails);
// //     setDoctorSignature(row.DoctorSignature);
// //     setIsViewMode(true);
// //     setIsEditMode(false);
// //     formRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   const handleEdit = (row) => {
// //     setSelectedRecord(row);
// //     setProcedureDetails(row.ProcedureDetails);
// //     setDoctorSignature(row.DoctorSignature);
// //     setIsEditMode(true);
// //     setIsViewMode(false);
// //     formRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };


// // const handleUpdate = async () => {
// //   if (!selectedRecord || !ProcedureDetails || !DoctorSignature) {
// //     return alert("Please fill all fields");
// //   }

// //   try {
// //     console.log("Updating Record ID:", selectedRecord.id);

// //    await axios.patch(
// //   `${base}Ip_Workbench/update_procedure_form/${selectedRecord.id}/`,
// //   { ProcedureDetails, DoctorSignature, Created_by }
// // );

// //     alert("Updated Successfully!");
// //     handleClear();
// //     fetchTableData();

// //   } catch (err) {
// //     console.log("FULL ERROR:", err);
// //     console.log("BACKEND MESSAGE:", err.response?.data);
// //     console.log("STATUS:", err.response?.status);

// //     alert("Update Failed: " + JSON.stringify(err.response?.data));
// //   }
// // };


// //   const handleClear = () => {
// //     setSelectedRecord(null);
// //     setProcedureDetails("");
// //     setDoctorSignature("");
// //     setIsViewMode(false);
// //     setIsEditMode(false);
// //   };

// //   const columns = [
// //     { key: "sNo", name: "S.No" },
// //     { key: "date", name: "Date" },
// //     { key: "time", name: "Time" },
// //     { key: "DoctorSignature", name: "Doctor Signature" },
    
    
    
// //     {
// //       key: "view",
// //       name: "View",
// //       renderCell: ({ row }) => (
// //         <button className="Min-junSeo-jun" onClick={() => handleView(row)}>👁</button>
// //       ),
// //     },
// //     // {
// //     //   key: "edit",
// //     //   name: "Edit",
// //     //   renderCell: ({ row }) => (
// //     //     <button className="Seo-junJi-ho" onClick={() => handleEdit(row)}>✏️</button>
// //     //   ),
// //     // },
// //   ];

// //   return (
// //     <div className="Ji-hoJun-seo">
// //       <div ref={formRef} className="Jun-seoDo-yun">
// //         <div className="Hyun-woo">PROCEDURES DONE IF ANY :</div>

// //         <textarea
// //           className="Ji-hun-sec"
// //           placeholder="Enter procedure details"
// //           value={ProcedureDetails}
// //           disabled={isViewMode}
// //           onChange={(e) => setProcedureDetails(e.target.value)}
// //         />

// //         <input
// //           className="Ji-hunSeung-min"
// //           placeholder="Doctor Signature"
// //           value={DoctorSignature}
// //           disabled={isViewMode}
// //           onChange={(e) => setDoctorSignature(e.target.value)}
// //         />
// //       </div>
// // <br />
// //       <div className="Main_container_Btn">
// //         {!isViewMode && !isEditMode && (
// //           <button disabled={loading}  onClick={handleSubmit}>
// //             {loading ? "Saving..." : "Submit"}
// //           </button>
// //         )}

// //         {isEditMode && (
// //           <button onClick={handleUpdate}>Update</button>
// //         )}

// //         {(isEditMode || isViewMode) && (
// //           <button onClick={handleClear}>Cancel</button>
// //         )}

// //         <button onClick={handlePrint}>Print</button>
// //       </div>

// //       <br />

// //       <ReactGrid columns={columns} RowData={tableData} />
// //     </div>
// //   );
// // };

// // export default RenderProcedureForm;





// import React, { useRef, useState, useEffect } from "react";
// import { useReactToPrint } from "react-to-print";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
// import "./ProcedureForm.css";
 
// const RenderProcedureForm = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const IP_DoctorWorkbenchNavigation = useSelector(
//     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
//   );
//   const DoctorWorkbenchNavigation = useSelector(
//     (state) => state.Frontoffice?.DoctorWorkbenchNavigation
//   )
 
//   const base = UrlLink?.endsWith("/") ? UrlLink : UrlLink + "/";
 
//   const formRef = useRef();
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(false);
 
//   const [ProcedureDetails, setProcedureDetails] = useState("");
//   const [DoctorSignature, setDoctorSignature] = useState("");
//   const [selectedRecord, setSelectedRecord] = useState(null);
 
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
 
//   const Patient_id = IP_DoctorWorkbenchNavigation?.PatientId || DoctorWorkbenchNavigation?.PatientId;
//   const Created_by = IP_DoctorWorkbenchNavigation?.username || DoctorWorkbenchNavigation?.username;
 
//   const handlePrint = useReactToPrint({
//     content: () => formRef.current,
//     documentTitle: "Procedure_Form",
//   });
 
//   const fetchTableData = async () => {
//     if (!Patient_id || !UrlLink) return;
//     try {
//       const res = await axios.get(
//         `${UrlLink}Ip_Workbench/get_procedure_forms/${Patient_id}/`
//       );
//       const formatted = res.data.map((item, index) => {
//         const [date = "", time = ""] = (item.CreatedDate || "").split(" ");
//         return { ...item, sNo: index + 1, date, time };
//       });
//       setTableData(formatted);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     }
//   };
 
//   useEffect(() => {
//     fetchTableData();
//   }, [Patient_id, UrlLink]);
 
//   const handleSubmit = async () => {
//     if (!ProcedureDetails || !DoctorSignature)
//       return alert("Enter all fields!");
 
//     setLoading(true);
//     try {
//       await axios.post(`${UrlLink}Ip_Workbench/procedures_form_Details_Link`, {
//         Patient_id,
//         ProcedureDetails,
//         DoctorSignature,
//         Created_by,
//       });
//       alert("Saved Successfully");
//       handleClear();
//       fetchTableData();
//     } catch {
//       alert("Save Failed!");
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const handleView = (row) => {
//     setSelectedRecord(row);
//     setProcedureDetails(row.ProcedureDetails);
//     setDoctorSignature(row.DoctorSignature);
//     setIsViewMode(true);
//     setIsEditMode(false);
//     formRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
 
//   const handleEdit = (row) => {
//     setSelectedRecord(row);
//     setProcedureDetails(row.ProcedureDetails);
//     setDoctorSignature(row.DoctorSignature);
//     setIsEditMode(true);
//     setIsViewMode(false);
//     formRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
 
 
// const handleUpdate = async () => {
//   if (!selectedRecord || !ProcedureDetails || !DoctorSignature) {
//     return alert("Please fill all fields");
//   }
 
//   try {
//     console.log("Updating Record ID:", selectedRecord.id);
 
//    await axios.patch(
//   `${base}Ip_Workbench/update_procedure_form/${selectedRecord.id}/`,
//   { ProcedureDetails, DoctorSignature, Created_by }
// );
 
//     alert("Updated Successfully!");
//     handleClear();
//     fetchTableData();
 
//   } catch (err) {
//     console.log("FULL ERROR:", err);
//     console.log("BACKEND MESSAGE:", err.response?.data);
//     console.log("STATUS:", err.response?.status);
 
//     alert("Update Failed: " + JSON.stringify(err.response?.data));
//   }
// };
 
 
//   const handleClear = () => {
//     setSelectedRecord(null);
//     setProcedureDetails("");
//     setDoctorSignature("");
//     setIsViewMode(false);
//     setIsEditMode(false);
//   };
 
//   const columns = [
//     { key: "sNo", name: "S.No" },
//     { key: "date", name: "Date" },
//     { key: "time", name: "Time" },
//     { key: "DoctorSignature", name: "Doctor Signature" },
   
   
   
//     {
//       key: "view",
//       name: "View",
//       renderCell: ({ row }) => (
//         <button className="Min-junSeo-jun" onClick={() => handleView(row)}>👁</button>
//       ),
//     },
//     // {
//     //   key: "edit",
//     //   name: "Edit",
//     //   renderCell: ({ row }) => (
//     //     <button className="Seo-junJi-ho" onClick={() => handleEdit(row)}>✏️</button>
//     //   ),
//     // },
//   ];
 
//   return (
//     <div className="Ji-hoJun-seo">
//       <div ref={formRef} className="Jun-seoDo-yun">
//         <div className="Hyun-woo">PROCEDURES DONE IF ANY :</div>
 
//         <textarea
//           className="Ji-hun-sec"
//           placeholder="Enter procedure details"
//           value={ProcedureDetails}
//           disabled={isViewMode}
//           onChange={(e) => setProcedureDetails(e.target.value)}
//         />
 
//         <input
//           className="Ji-hunSeung-min"
//           placeholder="Doctor Signature"
//           value={DoctorSignature}
//           disabled={isViewMode}
//           onChange={(e) => setDoctorSignature(e.target.value)}
//         />
//       </div>
// <br />
//       <div className="Main_container_Btn">
//         {!isViewMode && !isEditMode && (
//           <button disabled={loading}  onClick={handleSubmit}>
//             {loading ? "Saving..." : "Submit"}
//           </button>
//         )}
 
//         {isEditMode && (
//           <button onClick={handleUpdate}>Update</button>
//         )}
 
//         {(isEditMode || isViewMode) && (
//           <button onClick={handleClear}>Cancel</button>
//         )}
 
//         <button onClick={handlePrint}>Print</button>
//       </div>
 
//       <br />
 
//       <ReactGrid columns={columns} RowData={tableData} />
//     </div>
//   );
// };
 
// export default RenderProcedureForm;
 
 



import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactGrid from "../../../OtherComponent/ReactGrid/ReactGrid";
import "./ProcedureForm.css";

const RenderProcedureForm = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  )

  const base = UrlLink?.endsWith("/") ? UrlLink : UrlLink + "/";

  const formRef = useRef();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ProcedureDetails, setProcedureDetails] = useState("");
  // const [DoctorSignature, setDoctorSignature] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newProcedureDetails, setNewProcedureDetails] = useState("");

  const Patient_id = IP_DoctorWorkbenchNavigation?.PatientId || DoctorWorkbenchNavigation?.PatientId;
  const Created_by = IP_DoctorWorkbenchNavigation?.username || DoctorWorkbenchNavigation?.username;

  const handlePrint = useReactToPrint({
    content: () => formRef.current,
    documentTitle: "Procedure_Form",
  });

  const fetchTableData = async () => {
    if (!Patient_id || !UrlLink) return;
    try {
      const res = await axios.get(
        `${UrlLink}Ip_Workbench/get_procedure_forms/${Patient_id}/`
      );
      const formatted = res.data.map((item, index) => {
        const [date = "", time = ""] = (item.CreatedDate || "").split(" ");
        return { ...item, sNo: index + 1, date, time };
      });
      setTableData(formatted);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [Patient_id, UrlLink]);

  const handleSubmit = async () => {
    if (!ProcedureDetails || !DoctorSignature)
      return alert("Enter all fields!");

    setLoading(true);
    try {
      await axios.post(`${UrlLink}Ip_Workbench/procedures_form_Details_Link`, {
        Patient_id,
        ProcedureDetails,
        DoctorSignature,
        Created_by,
      });
      alert("Saved Successfully");
      handleClear();
      fetchTableData();
    } catch {
      alert("Save Failed!");
    } finally {
      setLoading(false);
    }
  };

    const [DoctorSignature, setDoctorSignature] = useState("");
    const [frozenValue, setFrozenValue] = useState("");

  const handleView = (row) => {
    setSelectedRecord(row);
    setProcedureDetails(row.ProcedureDetails);
    setDoctorSignature(row.DoctorSignature);
    setIsViewMode(true);
    setIsEditMode(false);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEdit = (row) => {
    setSelectedRecord(row);
    setProcedureDetails(row.ProcedureDetails);
    setDoctorSignature(row.DoctorSignature);
    setIsEditMode(true);
    setIsViewMode(false);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };


// const handleUpdate = async () => {
//   if (!selectedRecord || !ProcedureDetails || !DoctorSignature) {
//     return alert("Please fill all fields");
//   }

//   try {
//     console.log("Updating Record ID:", selectedRecord.id);

//    await axios.patch(
//   `${base}Ip_Workbench/update_procedure_form/${selectedRecord.id}/`,
//   { ProcedureDetails, DoctorSignature, Created_by }
// );

//     alert("Updated Successfully!");
//     handleClear();
//     fetchTableData();

//   } catch (err) {
//     console.log("FULL ERROR:", err);
//     console.log("BACKEND MESSAGE:", err.response?.data);
//     console.log("STATUS:", err.response?.status);

//     alert("Update Failed: " + JSON.stringify(err.response?.data));
//   }
// };
const handleUpdate = async () => {
  if (!selectedRecord || !newProcedureDetails || !DoctorSignature) {
    return alert("Please add new notes");
  }

  const now = new Date();
  const formattedTime = now.toLocaleString();

  const updatedText =
    `${ProcedureDetails}\n\n--- Edited on ${formattedTime} ---\n${newProcedureDetails}`;

  try {
    await axios.patch(
      `${base}Ip_Workbench/update_procedure_form/${selectedRecord.id}/`,
      {
        ProcedureDetails: updatedText,
        DoctorSignature,
        Created_by,
      }
    );

    alert("Updated Successfully!");
    handleClear();
    fetchTableData();

  } catch (err) {
    alert("Update Failed");
  }
};


  // const handleClear = () => {
  //   setSelectedRecord(null);
  //   setProcedureDetails("");
  //   setDoctorSignature("");
  //   setIsViewMode(false);
  //   setIsEditMode(false);
  // };

  const handleClear = () => {
  setSelectedRecord(null);
  setProcedureDetails("");
  setNewProcedureDetails("");
  setDoctorSignature("");
  setIsViewMode(false);
  setIsEditMode(false);
};


  const columns = [
    { key: "sNo", name: "S.No" },
    { key: "date", name: "Date" },
    { key: "time", name: "Time" },
    { key: "DoctorSignature", name: "Doctor Signature" },
    
    
    
    {
      key: "view",
      name: "View",
      renderCell: ({ row }) => (
        <button className="Min-junSeo-jun" onClick={() => handleView(row)}>👁</button>
      ),
    },
    {
      key: "edit",
      name: "Edit",
      renderCell: ({ row }) => (
        <button className="Seo-junJi-ho" onClick={() => handleEdit(row)}>✏️</button>
      ),
    },
  ];

  return (
    <div className="Ji-hoJun-seo">
      <div ref={formRef} className="Jun-seoDo-yun">
        <div className="Hyun-woo">PROCEDURES DONE IF ANY :</div>

        <textarea
          className="Ji-hun-sec"
          placeholder="Enter procedure details"
          value={ProcedureDetails}
          // disabled={isViewMode}
          disabled={isViewMode || isEditMode}
          onChange={(e) => setProcedureDetails(e.target.value)}
        />
        {isEditMode && (
          <textarea
            className="Ji-hun-sec"
            placeholder="Add new procedure notes..."
            value={newProcedureDetails}
            onChange={(e) => setNewProcedureDetails(e.target.value)}
          />
        )}


       <input
  className="Ji-hunSeung-min"
  placeholder="Doctor Signature"
  value={DoctorSignature}
  disabled={isViewMode}
  onFocus={() => {
    // freeze whatever exists when editing starts
    setFrozenValue(DoctorSignature);
  }}
  onChange={(e) => {
    const newValue = e.target.value;

    // 🔒 prevent changing/deleting previous text
    if (newValue.startsWith(frozenValue)) {
      setDoctorSignature(newValue);
    }
  }}
/>

        
      </div>
<br />
      <div className="Main_container_Btn">
        {!isViewMode && !isEditMode && (
          <button disabled={loading}  onClick={handleSubmit}>
            {loading ? "Saving..." : "Submit"}
          </button>
        )}

        {isEditMode && (
          <button onClick={handleUpdate}>Update</button>
        )}

        {(isEditMode || isViewMode) && (
          <button onClick={handleClear}>Cancel</button>
        )}

        <button onClick={handlePrint}>Print</button>
      </div>

      <br />

      <ReactGrid columns={columns} RowData={tableData} />
    </div>
  );
};

export default RenderProcedureForm;