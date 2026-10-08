// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import EditIcon from "@mui/icons-material/Edit";
// import Button from "@mui/material/Button";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import { format } from "date-fns";
// import { formatunderscoreLabel } from "../../OtherComponent/OtherFunctions";
// import { ImCancelCircle } from "react-icons/im";

// const IP_NurseDrugRequest = () => {
//   const [DrugForm, setDrugForm] = useState("Request");
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [DrugData, setDrugData] = useState([]);
//   const [DrugDataGet, setDrugDataGet] = useState([]);
//   const [Drug, setDrug] = useState({
//     OrderType: "",
//     Quantity: "",
//     RequestType: "",
//     RequestQuantity: "",
//   });
//   const [getdata, setgetdata] = useState(false);
//   const [totalquantity, settotalquantity] = useState(0);
//   const [frequencytime, setfrequencytime] = useState(0);
//   const [newIssuedQuantity, setnewIssuedQuantity] = useState(0);
//   const [Booking_Id, setBooking_Id] = useState(null);
//   const [Prescription_Id, setPrescription_Id] = useState(0);
//   const IP_DoctorWorkbenchNavigation = useSelector(
//     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
//   );
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const UserData = useSelector((state) => state.userRecord?.UserData);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const dispatchvalue = useDispatch();

//   const [AddPriscribtion, setAddPriscribtion] = useState({
//     // GenericName: "",
//     MedicineCode: "",
//     MedicineName: "",
   
//     // Route: "",
//     FrequencyMethod: "Regular",
//     FrequencyName: "",
//     FrequencyType: "",
//     Frequency: "",
//     FrequencyTime: "",
//     DurationType: "days",
//     AdminisDose: "",
//     Quantity: "",
//     Instruction: "",
//     Onbehalf: "No",
//     Prescribedby: "",
//     RouteSites: "",
//     IvSite: "",
//   });
//   const [GenericName, setgenericName] = useState([]);
//   const [namecondition, setnamecondition] = useState(false);
//   const [ItemName, setItemName] = useState([]);
//   const [idCounter, setIdCounter] = useState(1);
//   const [Speciality, setSpeciality] = useState([]);
//   const [DoctorData, setDoctorData] = useState([]);
//   const [isEdit, setisEdit] = useState(false);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const [selectedTimes, setSelectedTimes] = useState([]);
//   const [getdatastate, setgetdatastate] = useState(false);
//   const [editid, seteditid] = useState("");
//   const [isChecked, setisChecked] = useState(false);
//   const [BatchNo, setBatchNo] = useState("");
//   const [lastprescribed, setlastprescribed] = useState([]);
//   const [page, setPage] = useState(0);
//   const [page1, setPage1] = useState(0);
//   const pageSize = 10;
//   const [summa, setsumma] = useState([]);
//   const [summa1, setsumma1] = useState(null);

//   const blockInvalidChar = (e) =>
//     ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

//   const formatLabel = (label) => {
//     if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
//       return label
//         .replace(/([a-z])([A-Z])/g, "$1 $2")
//         .replace(/^./, (str) => str.toUpperCase());
//     } else {
//       return label;
//     }
//   };

//   const handlecleardata = () => {
//     setAddPriscribtion((prev) => ({
//       ...prev,
//       GenericName: "",
//       MedicineCode: "",
//       MedicineName: "",
//       Dosage: "",
//       Route: "",
//       FrequencyMethod: "Regular",
//       FrequencyName: "",
//       FrequencyType: "",
//       Frequency: "",
//       FrequencyTime: "",
//       DurationType: "days",
//       AdminisDose: "",
//       Quantity: "",
//       Instruction: "",
//       Onbehalf: "No",
//       Prescribedby: "",
//       RouteSites: "",
//       IvSite: "",
//     }));
//   };

//   useEffect(() => {

  //     if (DrugForm === "Request") {
//       axios
//         .get(
//           `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_link?Registration_Id=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
//         )
//         .then((res) => {
//           setDrugDataGet(res.data);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } else if (DrugForm === "Approved") {
//       axios
//         .get(
//           `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_Completed?Registration_Id=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
//         )
//         .then((res) => {
//           setDrugDataGet(res.data);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [
//     UrlLink,
//     IP_DoctorWorkbenchNavigation?.RegistrationId,
//     Drug,
//     summa,
//     DrugForm,
//     isChecked,
//   ]);

//   const Servicecolumns = [
//     {
//       key: "id",
//       name: "S.No",
//     },
//     {
//       key: "Billing_Id",
//       name: "Billing Id",
//     },
//     {
//       key: "Department",
//       name: "Department",
//     },
//     {
//       key: "DoctorName",
//       name: "DoctorName",
//     },
//     {
//       key: "GenericName",
//       name: "Generic Name",
//     },
//     {
//       key: "MedicineCode",
//       name: "Medicine Code",
//     },
//     {
//       key: "ProductCode",
//       name: "Medicine Name",
//     },
//     {
//       key: "Dosage",
//       name: "Dosage",
//     },
//     {
//       key: "Route",
//       name: "Route",
//     },
//     {
//       key: "Quantity",
//       name: "Quantity",
//     },
//     {
//       key: "CapturedBy",
//       name: "Captured By",
//     },
//     {
//       key: "View",
//       name: "View",
//       renderCell: (params) => (
//         <Button
//           key={params.row}
//           className="cell_btn"
//           onClick={() => handleDrugRequest(params.row)}
//         >
//           <EditIcon className="check_box_clrr_cancell" />
//         </Button>
//       ),
//     },
//   ];

//   const dynamicColumns1 = [
//     { key: "id", name: "S.No" },
//     { key: "Billing_Id", name: "Booking ID" },
//     { key: "Prescription_Id", name: "Prescription ID" },
//     { key: "Department", name: "Department" },
//     { key: "DoctorName", name: "Doctor Name" },
//     { key: "GenericName", name: "Generic Name" },
//     { key: "MedicineCode", name: "Medicine Code" },
//     { key: "ProductCode", name: "Medicine Name" },
//     { key: "Dosage", name: "Dosage" },
//     { key: "Route", name: "Route" },
//     { key: "RecievedQuantity", name: "Recived Quantity" },
//     {
//       key: "Action",
//       name: "View",
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => handleStatusChange(params.row)}
//           >
//             <CheckCircleOutlineIcon />
//           </Button>
//         </>
//       ),
//     },
//     {
//       key: "Actions",
//       name: "Cancel",
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => handleStatusChange1(params.row)}
//           >
//             <ImCancelCircle />
//           </Button>
//         </>
//       ),
//     },
//   ];

//   const handleStatusChange = (row) => {
//     axios
//       .post(
//         `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_Recieved`,
//         row
//       )
//       .then((response) => {
//         const mess = Object.values(response.data)[0];
//         const typp = Object.keys(response.data)[0];

//         const tdata = {
//           message: mess,
//           type: typp,
//         };
//         dispatchvalue({ type: "toast", value: tdata });
//         setisChecked(!isChecked);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   const handleStatusChange1 = (row) => {
//     console.log("row.......................", row);
//   };

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Workbench/Medical_Stock_InsetLink_for_Prescription`)
//       .then((response) => {
//         setgenericName(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching generic names:", error);
//       });
//   }, [UrlLink, userRecord?.location]);

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Masters/insert_frequency_masters`)
//       .then((response) => {
//         const data = response.data.map((p, index) => ({
//           ...p,
//           id: p.Frequency_Id,
//         }));
//         setSelectedTimes(data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   const HandleOnchange = (e) => {
//     const { name, value } = e.target;

//     if (name === "RequestType") {
//       setDrug((prevDrug) => ({
//         ...prevDrug,
//         [name]: value,
//       }));

//       let newIssuedQuantity = 0;
//       if (
//         Drug.RequestType === "Daily" &&
//         selectedRow.MedicalCat !== "NON MEDICAL"
//       ) {
//         const Frequency = frequencytime.split(",");
//         const Frequencyitem = Frequency.length;

//         newIssuedQuantity = Frequencyitem;
//         setnewIssuedQuantity(newIssuedQuantity);
//         setDrug((prev) => ({
//           ...prev,
//           RequestQuantity: newIssuedQuantity,
//         }));
//       } else if (
//         Drug.RequestType === "Total" &&
//         selectedRow.MedicalCat !== "NON MEDICAL"
//       ) {
//         newIssuedQuantity = totalquantity;
//         setnewIssuedQuantity(newIssuedQuantity);
//         setDrug((prev) => ({
//           ...prev,
//           RequestQuantity: newIssuedQuantity,
//         }));
//       }
//     } else {
//       setDrug((prevDrug) => ({
//         ...prevDrug,
//         [name]: value,
//       }));
//     }
//   };

//   useEffect(() => {
//     let newIssuedQuantity = 0;
//     if (
//       Drug.RequestType === "Daily" &&
//       selectedRow.MedicalCat !== "NON MEDICAL"
//     ) {
//       const Frequency = frequencytime.split(",");
//       const Frequencyitem = Frequency.length;

//       newIssuedQuantity = Frequencyitem;
//       setnewIssuedQuantity(newIssuedQuantity);
//       setDrug((prev) => ({
//         ...prev,
//         RequestQuantity: newIssuedQuantity,
//       }));
//     } else if (
//       Drug.RequestType === "Total" &&
//       selectedRow.MedicalCat !== "NON MEDICAL"
//     ) {
//       newIssuedQuantity = totalquantity;
//       setnewIssuedQuantity(newIssuedQuantity);
//       setDrug((prev) => ({
//         ...prev,
//         RequestQuantity: newIssuedQuantity,
//       }));
//     }
//   }, [UrlLink, frequencytime, totalquantity, Drug.RequestType]);

//   useEffect(() => {
//     if (AddPriscribtion.FrequencyName) {
//       const frequencytypeval = selectedTimes.find(
//         (p) => p.id === Number(AddPriscribtion.FrequencyName)
//       );

//       setAddPriscribtion((prev) => ({
//         ...prev,
//         FrequencyTime: frequencytypeval?.FrequencyTime,
//         Frequency: frequencytypeval?.Frequency,
//         FrequencyType: frequencytypeval?.FrequencyType,
//       }));
//     }
//   }, [AddPriscribtion.FrequencyName, selectedTimes]);

//   useEffect(() => {
//     if (
//       AddPriscribtion?.Frequency &&
//       AddPriscribtion?.Duration &&
//       AddPriscribtion?.DurationType
//     ) {
//       const frequency = AddPriscribtion?.Frequency.split("-");
//       const sum = frequency.reduce((acc, val) => acc + parseInt(val), 0);

//       let durationdata = 0;
//       if (AddPriscribtion?.DurationType === "Weeks") {
//         durationdata = sum * 7;
//       } else if (AddPriscribtion?.DurationType === "Months") {
//         durationdata = sum * 30;
//       } else {
//         durationdata = sum * 1;
//       }

//       let quantityData = 0;

//       if (AddPriscribtion?.Route === "Syrup") {
//         const dattt = durationdata * AddPriscribtion?.Duration;
//         const rrrr = dattt * AddPriscribtion?.AdminisDose;
//         let qnt = 0;
//         const dosageSplit = AddPriscribtion?.Dosage.split(" ");
//         const dosageValue = parseFloat(dosageSplit[0]);
//         const dosageUnit = dosageSplit[1];
//         if (dosageUnit === "ml") {
//           if (rrrr > dosageValue) {
//             qnt = rrrr / dosageValue;
//           } else {
//             qnt = 1;
//           }
//         } else if (dosageUnit === "l") {
//           qnt = dosageValue * 1000;
//           if (rrrr > dosageValue * 1000) {
//             qnt = rrrr / (dosageValue * 1000);
//           } else {
//             qnt = 1;
//           }
//         }

//         quantityData = Math.ceil(qnt);
//       } else {
//         if (durationdata !== 0) {
//           quantityData = durationdata * AddPriscribtion.Duration;
//         } else {
//           quantityData = durationdata;
//         }
//       }

//       setAddPriscribtion((prev) => ({
//         ...prev,
//         Quantity: quantityData,
//       }));
//     }
//   }, [
//     AddPriscribtion?.Frequency,
//     AddPriscribtion?.Duration,
//     AddPriscribtion?.DurationType,
//     AddPriscribtion?.AdminisDose,
//     AddPriscribtion?.Route,
//     AddPriscribtion?.Dosage,
//     AddPriscribtion?.FrequencyMethod,
//     AddPriscribtion?.FrequencyType,
//   ]);

//   const handleDrugRequest = (row) => {
//     setSelectedRow(row);
//     setBooking_Id(row.Billing_Id);
//     settotalquantity(row.Quantity);
//     setfrequencytime(row.FrequencyTime);
//     setPrescription_Id(row.Prescription_Id);
//     setDrug((prev) => ({
//       ...prev,
//       OrderType: "",
//       Quantity: "",
//       RequestType: "",
//       RequestQuantity: "",
//     }));
//   };

//   useEffect(() => {
//     if (IP_DoctorWorkbenchNavigation.DoctorName && AddPriscribtion.Onbehalf === "Yes") {
//       setAddPriscribtion((prevState) => ({
//         ...prevState,
//         Prescribedby: IP_DoctorWorkbenchNavigation.DoctorName
//       }));
//     }
//   }, [IP_DoctorWorkbenchNavigation.DoctorName, AddPriscribtion.Onbehalf]);

//   const handleInputChange = async (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setAddPriscribtion((prev) => ({
//         ...prev,
//         [name]: checked ? "Yes" : "",
//       }));
//     } else {
//       let condition = value.includes("-");
//       if (name === "MedicineName") {
//         if (condition) {
//           const val1 = value.split("-");
//           let val2 = val1[0];
//           let val3 = val1[1];
//           setAddPriscribtion((prev) => ({
//             ...prev,
//             [name]: val3,
//             MedicineCode: val2,
//           }));
//           const check = ItemName.find((e) => String(e.ItemId) === String(val2));
//           setBatchNo(check.Batch_No);
//           setnamecondition(check);

//           try {
//             const response = await axios.get(
//               `${UrlLink}Workbench/Item_Types_Link?Itemid=${val2}`
//             );
//             const res = response.data;

//             if (res.length > 0) {
//               const firstItem = res[0];
//               setAddPriscribtion((prev) => ({
//                 ...prev,
//                 Dosage: firstItem?.Dose,
//                 Route: firstItem?.ProductTypeName,
//               }));
//             }
//           } catch (e) {
//             console.log(e);
//           }
//         } else {
//           setAddPriscribtion((prev) => ({
//             ...prev,
//             [name]: value,
//           }));
//         }
//       } else if (name === "GenericName") {
//         if (condition) {
//           const val1 = value.split("-");
//           let val2 = val1[0];
//           let val3 = val1[1];
//           setAddPriscribtion((prev) => ({
//             ...prev,
//             [name]: val3,
//           }));
//           try {
//             const response = await axios.get(
//               `${UrlLink}Workbench/Nurse_Item_Names_Link?Genericnameid=${val2}&Location=${userRecord?.location}`
//             );
//             const res = response?.data;
//             setItemName(res);
//           } catch (e) {
//             console.log(e);
//           }
//         } else {
//           setAddPriscribtion((prev) => ({
//             ...prev,
//             [name]: value,
//           }));
          
//           // If GenericName is empty, fetch all items
//           if (!value) {
//             try {
//               const response = await axios.get(
//                 `${UrlLink}Workbench/Nurse_Item_Names_Link?Genericnameid=&Location=${userRecord?.location}`
//               );
//               const res = response?.data;
//               setItemName(res);
//             } catch (e) {
//               console.log(e);
//             }
//           }
//         }
//       } else if (name === "Department") {
//         setAddPriscribtion((prev) => ({
//           ...prev,
//           [name]: value,
//           Specialization:
//             value === "Primary"
//               ? IP_DoctorWorkbenchNavigation?.Specialization
//               : "",
//           DoctorName:
//             value === "Primary" ? IP_DoctorWorkbenchNavigation?.DoctorId : "",
//         }));
//       } else if (name === "Onbehalf") {
//         setAddPriscribtion((prev) => ({
//           ...prev,
//           [name]: value === "Yes" ? "Yes" : "No",
//         }));
//       } else {
//         setAddPriscribtion((prev) => ({
//           ...prev,
//           [name]: value,
//         }));
//       }
//     }

//     adjustHeight(e);
//   };

//   const adjustHeight = (e) => {
//     e.target.style.height = "auto";
//     e.target.style.height = `${e.target.scrollHeight}px`;
//   };

//   const handlesubmitdata = () => {
//     let requiredfields = [];
//     if (namecondition.Category === "NON MEDICAL") {
//       requiredfields = [...Object.keys(AddPriscribtion)].filter(
//         (key) =>
//           ![
//             "Dosage",
//             "AdminisDose",
//             "Instruction",
//             "FrequencyMethod",
//             "FrequencyName",
//             "FrequencyType",
//             "Frequency",
//             "FrequencyTime",
//             "Duration",
//             "DurationType",
//             "IvSite",
//           ].includes(key)
//       );
//     } else {
//       requiredfields = [...Object.keys(AddPriscribtion)].filter(
//         (key) =>
//           ![
//             "Dosage",
//             "AdminisDose",
//             "Instruction",
//             "FrequencyType",
//             "Frequency",
//             "FrequencyTime",
//             "Duration",
//             "DurationType",
//             "IvSite",
//           ].includes(key)
//       );
//     }

//     const exist = requiredfields.filter((field) => !AddPriscribtion[field]);

//     if (exist.length > 0) {
//       const tdata = {
//         message: `Please provide ${exist.join(",")}.`,
//         type: "warn",
//       };
//       dispatchvalue({ type: "toast", value: tdata });
//     } else {
//       const senddata = {
//         serialNo: idCounter,
//         ...AddPriscribtion,
//         BatchNo: BatchNo,
//         StoreLocation: 3,
//         Location: userRecord?.location,
//         CapturedBy: userRecord?.username,
//         Billing_Id: IP_DoctorWorkbenchNavigation?.RegistrationId,
//         Medical_Category: namecondition.Category,
//       };
//       setsumma((prevSumma) => [...prevSumma, senddata]);
//       setIdCounter(idCounter + 1);
//       setgetdatastate(!getdatastate);
//       handlecleardata();
//     }
//   };

//   const handleupdate = () => {
//     let requiredfields = [];
//     if (namecondition.Category === "NON MEDICAL") {
//       requiredfields = [...Object.keys(AddPriscribtion)].filter(
//         (key) =>
//           ![
//             "Dosage",
//             "AdminisDose",
//             "Instruction",
//             "FrequencyMethod",
//             "FrequencyName",
//             "FrequencyType",
//             "Frequency",
//             "FrequencyTime",
//             "Duration",
//             "DurationType",
//             "IvSite",
//           ].includes(key)
//       );
//     } else {
//       requiredfields = [...Object.keys(AddPriscribtion)].filter(
//         (key) =>
//           ![
//             "Dosage",
//             "AdminisDose",
//             "Instruction",
//             "FrequencyType",
//             "Frequency",
//             "FrequencyTime",
//             "Duration",
//             "DurationType",
//             "IvSite",
//           ].includes(key)
//       );
//     }

//     const exist = requiredfields.filter((field) => !AddPriscribtion[field]);

//     if (exist.length > 0) {
//       const tdata = {
//         message: `Please provide ${exist.join(",")}.`,
//         type: "warn",
//       };
//       dispatchvalue({ type: "toast", value: tdata });
//     } else {
//       const index = summa.findIndex((row) => row.id === editid);
//       if (index !== -1) {
//         const updatedRow = {
//           ...summa[index],
//           ...AddPriscribtion,
//           Location: userRecord?.location,
//           CapturedBy: userRecord?.username,
//           Medical_Category: namecondition.Category,
//         };

//         const data = [...summa];
//         data[index] = updatedRow;
//         setsumma(data);
//         handlecleardata();
//         setisEdit(false);
//       } else {
//         console.error("Row with id", editid, "not found.");
//       }
//     }
//   };

//   const dynamicColumns = [
//     {
//       key: "serialNo",
//       name: "S_No",
//     },
//     ...Object.keys(AddPriscribtion).map((labelname, index) => {
//       const formattedLabel = formatLabel(labelname);

//       return {
//         key: labelname,
//         name: formattedLabel,
//       };
//     }),
//     {
//       key: "Action",
//       name: "Edit",
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => handleChangeedit(params.row)}
//           >
//             <EditIcon />
//           </Button>
//         </>
//       ),
//     },
//   ];

//   const handleChangeedit = (params) => {
//     const data = summa.find((p) => p.id === params?.id);

//     if (data) {
//       setAddPriscribtion((prev) => ({
//         ...prev,
//         ...data,
//       }));
//       setisEdit(true);
//       seteditid(params?.id);
//     } else {
//       console.error("No matching data found for the given id:", params?.id);
//     }
//   };

//   const handleAddRequest = () => {
//     let requiredfields = [];
//     requiredfields = [...Object.keys(Drug)].filter((key) =>
//       ["OrderType", "RequestType", "RequestQuantity"].includes(key)
//     );
//     const exist = requiredfields.filter((field) => !Drug[field]);
//     if (exist.length > 0) {
//       const tdata = {
//         message: `Please provide ${exist.join(",")}.`,
//         type: "warn",
//       };
//       dispatchvalue({ type: "toast", value: tdata });
//     } else {
//       const postdata = {
//         OrderType: Drug.OrderType,
//         Quantity: totalquantity,
//         RequestType: Drug.RequestType,
//         RequestQuantity: Drug.RequestQuantity,
//         Booking_Id: Booking_Id,
//         Prescription_Id: Prescription_Id,
//         MedicalCat: selectedRow.MedicalCat,
//       };

//       if (Drug.RequestQuantity > 0) {
//         axios
//           .post(
//             `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_Add_link`,
//             postdata
//           )
//           .then((response) => {
//             const message = Object.values(response.data)[0];
//             const type = Object.keys(response.data)[0];

//             const tdata = {
//               mess: message,
//               typp: type,
//             };
//             dispatchvalue({ type: "toast", value: tdata });
//             setDrug({
//               OrderType: "",
//               Quantity: "",
//               RequestType: "",
//               RequestQuantity: "",
//             });
//             setSelectedRow(null);
//           })
//           .catch((e) => {
//             console.log(e);
//           });
//       }
//     }
//   };

//   const submitalldata = () => {
//     if (summa.length > 0) {
//       axios
//         .post(
//           `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_update_link`,
//           summa
//         )
//         .then((response) => {
//           const mess = Object.values(response.data)[0];
//           const type = Object.keys(response.data)[0];
//           const tdata = {
//             message: mess,
//             typp: type,
//           };
//           dispatchvalue({ type: "toast", value: tdata });
//           setsumma([]);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   };

//   useEffect(() => {
//     // Fetch all items when component mounts
//     const fetchAllItems = async () => {
//       try {
//         const response = await axios.get(
//           `${UrlLink}Workbench/Nurse_Item_Names_Link?Genericnameid=&Location=${2}`
//         );
//         const res = response?.data;
//         setItemName(res);
//       } catch (e) {
//         console.log(e);
//       }
//     };
    
//     fetchAllItems();
//   }, [UrlLink, userRecord?.location]);

//   return (
//     <>
//       <div className="new-patient-registration-form">
//         <div className="RegisterTypecon" style={{ padding: "10px 0px" }}>
//           <div className="RegisterType">
//             {["Request", "Approved"].map((p, ind) => (
//               <div className="registertypeval" key={ind + "key"}>
//                 <input
//                   type="radio"
//                   id={p}
//                   name="appointment_type"
//                   checked={DrugForm === p}
//                   onChange={(e) => {
//                     setDrugForm(e.target.value);
//                   }}
//                   value={p}
//                 />
//                 <label htmlFor={p}>{p}</label>
//               </div>
//             ))}
//           </div>
//         </div>
//         {DrugForm === "Request" && (
//           <>
//             <div className="RegisFormcon">
//               {/* <div className="RegisForm_1">
//                 <label>
//                   Generic Name <span>:</span>
//                 </label>

//                 <input
//                   type="text"
//                   name="GenericName"
//                   list="IpGenericNameList"
//                   value={AddPriscribtion.GenericName}
//                   onChange={handleInputChange}
//                 />
//                 <datalist id="IpGenericNameList">
//                   {GenericName?.map((row, index) => (
//                     <option
//                       key={index}
//                       value={`${row.id}-${row.Generic_Name}`}
//                     >
//                       {row.Generic_Name}
//                     </option>
//                   ))}
//                 </datalist>
//               </div> */}
//               <div className="RegisForm_1">
//                 <label>
//                   Medicine Name <span>:</span>
//                 </label>

//                 <input
//                   type="text"
//                   name="MedicineName"
//                   list="IpMedicineNameList"
//                   value={AddPriscribtion.MedicineName}
//                   onChange={handleInputChange}
//                   placeholder="Type to see available medicines"
//                 />
//                 <datalist id="IpMedicineNameList">
//                   {Array.isArray(ItemName) &&
//                     ItemName.map((row, index) => (
//                       <option
//                         key={index}
//                         value={`${row.ItemId}-${row.ItemName}`}
//                       >
//                         {`${row.ItemName} | Bat.No: ${row.Batch_No} | Rs.${row.MRP} | Qty: ${row.AvailableQuantity}`}
//                       </option>
//                     ))}
//                 </datalist>
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Dose <span>:</span>
//                 </label>

//                 <input
//                   name="Dosage"
//                   type="text"
//                   readOnly
//                   value={AddPriscribtion.Dosage}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Drug Type <span>:</span>
//                 </label>

//                 <input
//                   name="Route"
//                   type="text"
//                   readOnly
//                   value={AddPriscribtion.Route}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Route <span>:</span>
//                 </label>

//                 <select
//                   name="RouteSites"
//                   value={AddPriscribtion.RouteSites}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select</option>
//                   <option value="IV-Direct"> IV-Direct</option>
//                   <option value="IV-Infusion"> IV-Infusion</option>
//                   <option value="Intramuscular">Intramuscular</option>
//                   <option value="Subcutaneous">Subcutaneous</option>
//                   <option value="Sublingual">Sublingual </option>
//                   <option value="Rectal">Rectal</option>
//                   <option value="Oral">Oral</option>
//                   <option value="Inhalational">Inhalational</option>
//                   <option value="Nasal">Nasal</option>
//                 </select>
//               </div>
//               {(AddPriscribtion.RouteSites === "IV-Direct" ||
//                 AddPriscribtion.RouteSites === "IV-Infusion") && (
//                 <div className="RegisForm_1">
//                   <label>
//                     IV Site <span>:</span>
//                   </label>

//                   <select
//                     name="IvSite"
//                     value={AddPriscribtion.IvSite}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select</option>
//                     <option value="External Jugular">External Jugular</option>
//                     <option value="Subclavian vein">Subclavian vein</option>
//                     <option value="Femoral vein"> Femoral vein</option>
//                     <option value="Dorsal Venous Network of Hand">
//                       Dorsal Venous Network of Hand
//                     </option>
//                     <option value="Radial vein">Radial vein</option>
//                     <option value="Median Cubital vein">
//                       Median Cubital vein
//                     </option>
//                     <option value="Cephalic vein">Cephalic vein</option>
//                     <option value="Dorsal Venous Network of Leg">
//                       Dorsal Venous Network of Leg
//                     </option>
//                     <option value="Saphaneous vein">Saphaneous vein</option>
//                     <option value="Superficial Temporal vein">
//                       Superficial Temporal vein
//                     </option>
//                   </select>
//                 </div>
//               )}
//               <div className="RegisForm_1">
//                 <label>
//                   Freq Method <span>:</span>
//                 </label>

//                 <select
//                   name="FrequencyMethod"
//                   value={AddPriscribtion.FrequencyMethod}
//                   onChange={handleInputChange}
//                   disabled={namecondition.Category === "NON MEDICAL"}
//                 >
//                   <option value="Regular">Regular</option>
//                   {/* <option value="SOS">SOS</option> */}
//                 </select>
//               </div>

//               <div className="RegisForm_1">
//                 <label>
//                   Frequency Name <span>:</span>
//                 </label>

//                 <select
//                   name="FrequencyName"
//                   value={AddPriscribtion.FrequencyName}
//                   onChange={handleInputChange}
//                   disabled={namecondition.Category === "NON MEDICAL"}
//                 >
//                   <option value="">Select</option>
//                   {selectedTimes.map((fields, index) => (
//                     <option value={fields.Frequency_Id} key={index}>
//                       {fields.FrequencyName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Frequency Type <span>:</span>
//                 </label>

//                 <input
//                   name="FrequencyType"
//                   value={AddPriscribtion.FrequencyType}
//                   disabled={
//                     AddPriscribtion.FrequencyMethod === "SOS" ||
//                     namecondition.Category === "NON MEDICAL"
//                   }
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Frequency <span>:</span>
//                 </label>

//                 <input
//                   name="Frequency"
//                   value={AddPriscribtion.Frequency}
//                   disabled={
//                     AddPriscribtion.FrequencyMethod === "SOS" ||
//                     namecondition.Category === "NON MEDICAL"
//                   }
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Frequency Time <span>:</span>
//                 </label>

//                 <input
//                   name="FrequencyTime"
//                   type="text"
//                   readOnly
//                   disabled={
//                     AddPriscribtion.FrequencyMethod === "SOS" ||
//                     namecondition.Category === "NON MEDICAL"
//                   }
//                   value={AddPriscribtion.FrequencyTime}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Duration <span>:</span>
//                 </label>

//                 <input
//                   name="Duration"
//                   type="number"
//                   onKeyDown={blockInvalidChar}
//                   style={{ width: "20px" }}
//                   disabled={AddPriscribtion.FrequencyMethod === "SOS"}
//                   value={AddPriscribtion.Duration}
//                   onChange={handleInputChange}
//                 />
//                 <select
//                   name="DurationType"
//                   style={{ width: "110px" }}
//                   value={AddPriscribtion.DurationType}
//                   onChange={handleInputChange}
//                   disabled={AddPriscribtion.FrequencyMethod === "SOS"}
//                 >
//                   <option value="days">days</option>
//                   <option value="Weeks">weeks</option>
//                   <option value="Months">Months</option>
//                 </select>
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Adminis Dose <span>:</span>
//                 </label>

//                 <input
//                   name="AdminisDose"
//                   type="number"
//                   onKeyDown={blockInvalidChar}
//                   value={AddPriscribtion.AdminisDose}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Quantity <span>:</span>
//                 </label>

//                 <input
//                   name="Quantity"
//                   type="number"
//                   onKeyDown={blockInvalidChar}
//                   value={AddPriscribtion.Quantity}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   On Behalf Of<span>:</span>
//                 </label>
//                 <input
//                   name="Onbehalf"
//                   type="checkbox"
//                   checked={AddPriscribtion.Onbehalf === "Yes"}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               {AddPriscribtion.Onbehalf === "Yes" && (
//                 <div className="RegisForm_1">
//                   <label>
//                     Prescribed By <span>:</span>
//                   </label>

//                   <input
//                     name="Prescribedby"
//                     type="text"
//                     disabled={AddPriscribtion.Prescribedby === "SOS"}
//                     value={AddPriscribtion.Prescribedby || IP_DoctorWorkbenchNavigation.DoctorName}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               )}

//               {/* <div className="RegisForm_1">
//             <label>
//               Reason <span>:</span>
//             </label>

//             <textarea
//               name="Reason"
//               value={AddPriscribtion.Reason}
//               onChange={handleInputChange}
//             /> */}
//               {/* </div> */}
//               </div>

//               <br />

//               <div className="RegisFormcon extend_textarea_new">
//               <div className="RegisForm_1 extend_textarea_new">
//                 <label>
//                   Instructions <span>:</span>
//                 </label>

//                 <textarea
//                   name="Instruction"
//                   value={AddPriscribtion.Instruction}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               </div>



//               <div className="Main_container_Btn">
//                 <button
//                   // className="btn-add"
//                   onClick={isEdit ? handleupdate : handlesubmitdata}
//                 >
//                   {isEdit ? "Update" : "Add"}
//                 </button>
//               </div>
        
//             {summa.length > 0 && (
//               <>
//                 <ReactGrid columns={dynamicColumns} RowData={summa} />
//                 <button className="btn-add" onClick={submitalldata}>
//                   Submit
//                 </button>
//               </>
//             )}
//             <br />
//             <ReactGrid columns={Servicecolumns} RowData={DrugDataGet} />
//             <br />
//             {selectedRow && (
//               <div>
//                 <div className="RegisFormcon" id="RegisFormcon_11">
//                   {Object.keys(Drug).map((field, ind) => (
//                     <div className="RegisForm_1" key={ind}>
//                       <label htmlFor={`${field}_${ind}`}>
//                         {formatLabel(field)}
//                         <span>:</span>
//                       </label>
//                       {["OrderType", "RequestType"].includes(field) ? (
//                         <select
//                           id={`${field}_${ind}`}
//                           name={field}
//                           value={Drug[field]}
//                           onChange={HandleOnchange}
//                         >
//                           <option value="">Select</option>
//                           {field === "OrderType" &&
//                           // [
//                           //   "OutSource",
//                           //   "IP_Pharmacy",
//                           //   "CentralStore",
//                           //   "WardStore",
//                           //   "InventoryStore",
//                           // ]
//                             [
//                               "IP_Pharmacy",
//                               "OP_Pharmacy",
//                               "FOC_Pharmacy",
//                               "OUT_Source",
//                               "OWN_Medicine",
//                             ].map((f, i) => (
//                               <option key={i} value={f}>
//                                 {formatunderscoreLabel(f)}
//                               </option>
//                             ))}
//                           {field === "RequestType" &&
//                           // ["Daily", "Total"]
//                             ["Total","Daily"].map((f, i) => (
//                               <option key={i} value={f}>
//                                 {f}
//                               </option>
//                             ))}
//                         </select>
//                       ) : (
//                         <input
//                           type="text"
//                           id={`${field}_${ind}`}
//                           name={field}
//                           value={
//                             field === "RequestQuantity" &&
//                             selectedRow.MedicalCat === "MEDICAL"
//                               ? newIssuedQuantity
//                               : field === "RequestQuantity" &&
//                                 selectedRow.MedicalCat !== "MEDICAL"
//                               ? Drug.RequestQuantity
//                               : totalquantity || ""
//                           }
//                           onChange={HandleOnchange}
//                           // readOnly={field === "RequestQuantity" && selectedRow.MedicalCat === "NON MEDICAL"}
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="Main_container_Btn">
//                   <button onClick={handleAddRequest}>Add</button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//         {DrugForm === "Approved" && (
//           <ReactGrid columns={dynamicColumns1} RowData={DrugDataGet} />
//         )}
//       </div>

//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </>
//   );
// };

// export default IP_NurseDrugRequest;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { format } from "date-fns";
import { formatunderscoreLabel } from "../../OtherComponent/OtherFunctions";
import { ImCancelCircle } from "react-icons/im";

const IP_NurseDrugRequest = () => {
  const [DrugForm, setDrugForm] = useState("Request");
  const [selectedRow, setSelectedRow] = useState(null);
  const [DrugData, setDrugData] = useState([]);
  const [DrugDataGet, setDrugDataGet] = useState([]);
  const [Drug, setDrug] = useState({
    OrderType: "",
    Quantity: "",
    RequestType: "",
    RequestQuantity: "",
  });
  const [getdata, setgetdata] = useState(false);
  const [totalquantity, settotalquantity] = useState(0);
  const [frequencytime, setfrequencytime] = useState(0);
  const [newIssuedQuantity, setnewIssuedQuantity] = useState(0);
  const [Booking_Id, setBooking_Id] = useState(null);
  const [Prescription_Id, setPrescription_Id] = useState(0);
  
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();

  // Initialize with proper structure
  const initialPrescriptionState = {
    id: null,
    GenericName: "",
    MedicineCode: "",
    MedicineName: "",
    Dosage: "",
    Route: "",
    FrequencyMethod: "Regular",
    FrequencyName: "",
    FrequencyType: "",
    Frequency: "",
    FrequencyTime: "",
    DurationType: "days",
    Duration: "",
    AdminisDose: "",
    Quantity: "",
    Instruction: "",
    Onbehalf: "No",
    Prescribedby: "",
    RouteSites: "Oral",
    IvSite: "",
  };

  const [AddPriscribtion, setAddPriscribtion] = useState(initialPrescriptionState);
  const [GenericName, setgenericName] = useState([]);
  const [namecondition, setnamecondition] = useState(false);
  const [ItemName, setItemName] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  const [Speciality, setSpeciality] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [isEdit, setisEdit] = useState(false);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [getdatastate, setgetdatastate] = useState(false);
  const [editid, seteditid] = useState("");
  const [isChecked, setisChecked] = useState(false);
  const [BatchNo, setBatchNo] = useState("");
  const [lastprescribed, setlastprescribed] = useState([]);
  const [page, setPage] = useState(0);
  const [page1, setPage1] = useState(0);
  const pageSize = 10;
  const [summa, setsumma] = useState([]);
  const [summa1, setsumma1] = useState(null);
  const [loading, setloading] = useState(false);

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  // Reset form function
  const resetForm = () => {
    setAddPriscribtion({ ...initialPrescriptionState });
    setnamecondition(false);
    setBatchNo("");
    setisEdit(false);
    seteditid("");
  };

  const handlecleardata = () => {
    resetForm();
  };

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  useEffect(() => {
    if (DrugForm === "Request") {
      axios
        .get(
          `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_link?Registration_Id=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
        )
        .then((res) => {
          console.log("1111111111", Array.isArray(res.data)?res.data : []);
          setDrugDataGet(Array.isArray(res.data)?res.data : []);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (DrugForm === "Approved") {
      axios
        .get(
          `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_Completed?Registration_Id=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
        )
        .then((res) => {
          console.log("2222222222", res.data);
          setDrugDataGet(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    UrlLink,
    IP_DoctorWorkbenchNavigation?.RegistrationId,
    Drug,
    summa,
    DrugForm,
    isChecked,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const res = await axios.get(
          `${UrlLink}Workbench/Nurse_Item_Names_Link?Location=${userRecord?.location}`
        );
        setItemName(res.data);
      } catch (error) {
        console.error("Error fetching item names:", error);
      } finally {
        setloading(false);
      }
    };

    if (userRecord?.location) {
      fetchData();
    }
  }, [UrlLink, userRecord?.location]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/insert_frequency_masters`)
      .then((response) => {
        const data = response.data.map((p, index) => ({
          ...p,
          id: p.Frequency_Id,
        }));
        setSelectedTimes(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (AddPriscribtion.FrequencyName) {
      const frequencytypeval = selectedTimes.find(
        (p) => p.id === Number(AddPriscribtion.FrequencyName)
      );
      setAddPriscribtion((prev) => ({
        ...prev,
        FrequencyTime: frequencytypeval?.FrequencyTime || "",
        Frequency: frequencytypeval?.Frequency || "",
        FrequencyType: frequencytypeval?.FrequencyType || "",
      }));
    }
  }, [AddPriscribtion.FrequencyName, selectedTimes]);

  useEffect(() => {
    if (
      AddPriscribtion?.Frequency &&
      AddPriscribtion?.Duration &&
      AddPriscribtion?.DurationType
    ) {
      const frequency = AddPriscribtion?.Frequency.split("-");
      const sum = frequency.reduce((acc, val) => acc + parseInt(val), 0);

      let durationdata = 0;
      if (AddPriscribtion?.DurationType === "Weeks") {
        durationdata = sum * 7;
      } else if (AddPriscribtion?.DurationType === "Months") {
        durationdata = sum * 30;
      } else {
        durationdata = sum * 1;
      }

      let quantityData = 0;

      if (AddPriscribtion?.Route === "Syrup") {
        const dattt = durationdata * AddPriscribtion?.Duration;
        const rrrr = dattt * AddPriscribtion?.AdminisDose;
        let qnt = 0;
        const dosageSplit = AddPriscribtion?.Dosage.split(" ");
        const dosageValue = parseFloat(dosageSplit[0]);
        const dosageUnit = dosageSplit[1];
        
        if (dosageUnit === "ml") {
          if (rrrr > dosageValue) {
            qnt = rrrr / dosageValue;
          } else {
            qnt = 1;
          }
        } else if (dosageUnit === "l") {
          qnt = dosageValue * 1000;
          if (rrrr > dosageValue * 1000) {
            qnt = rrrr / (dosageValue * 1000);
          } else {
            qnt = 1;
          }
        }
        quantityData = Math.ceil(qnt);
      } else {
        quantityData = durationdata * AddPriscribtion.Duration;
      }

      setAddPriscribtion((prev) => ({
        ...prev,
        Quantity: quantityData,
      }));
    }
  }, [
    AddPriscribtion?.Frequency,
    AddPriscribtion?.Duration,
    AddPriscribtion?.DurationType,
    AddPriscribtion?.AdminisDose,
    AddPriscribtion?.Route,
    AddPriscribtion?.Dosage,
  ]);

  useEffect(() => {
    if (IP_DoctorWorkbenchNavigation.DoctorName && AddPriscribtion.Onbehalf === "Yes") {
      setAddPriscribtion((prevState) => ({
        ...prevState,
        Prescribedby: IP_DoctorWorkbenchNavigation.DoctorName
      }));
    }
  }, [IP_DoctorWorkbenchNavigation.DoctorName, AddPriscribtion.Onbehalf]);

  const HandleOnchange = (e) => {
    const { name, value } = e.target;

    if (name === "RequestType") {
      setDrug((prevDrug) => ({
        ...prevDrug,
        [name]: value,
      }));

      let newIssuedQuantity = 0;
      if (Drug.RequestType === "Daily" && selectedRow?.MedicalCat !== "NON MEDICAL") {
        const Frequency = frequencytime.split(",");
        const Frequencyitem = Frequency.length;
        newIssuedQuantity = Frequencyitem;
        setnewIssuedQuantity(newIssuedQuantity);
        setDrug((prev) => ({
          ...prev,
          RequestQuantity: newIssuedQuantity,
        }));
      } else if (Drug.RequestType === "Total" && selectedRow?.MedicalCat !== "NON MEDICAL") {
        newIssuedQuantity = totalquantity;
        setnewIssuedQuantity(newIssuedQuantity);
        setDrug((prev) => ({
          ...prev,
          RequestQuantity: newIssuedQuantity,
        }));
      }
    } else {
      setDrug((prevDrug) => ({
        ...prevDrug,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    let newIssuedQuantity = 0;
    if (Drug.RequestType === "Daily" && selectedRow?.MedicalCat !== "NON MEDICAL") {
      const Frequency = frequencytime.split(",");
      const Frequencyitem = Frequency.length;
      newIssuedQuantity = Frequencyitem;
      setnewIssuedQuantity(newIssuedQuantity);
      setDrug((prev) => ({
        ...prev,
        RequestQuantity: newIssuedQuantity,
      }));
    } else if (Drug.RequestType === "Total" && selectedRow?.MedicalCat !== "NON MEDICAL") {
      newIssuedQuantity = totalquantity;
      setnewIssuedQuantity(newIssuedQuantity);
      setDrug((prev) => ({
        ...prev,
        RequestQuantity: newIssuedQuantity,
      }));
    }
  }, [frequencytime, totalquantity, Drug.RequestType, selectedRow]);

  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setAddPriscribtion((prev) => ({
        ...prev,
        [name]: checked ? "Yes" : "No",
      }));
    } else {
      let condition = value.includes("-");
      
      if (name === "MedicineName") {
        if (condition) {
          const val1 = value.split("-");
          let val2 = val1[0];
          let val3 = val1[1];
          
          try {
            const check = ItemName.find((e) => String(e.ItemId) === String(val2));
            
            setAddPriscribtion((prev) => ({
              ...prev,
              [name]: val3,
              MedicineCode: val2,
              GenericName: check?.GenericName || "",
              Dosage: check?.Dose || "",
              Route: check?.ProductTypeName || "",
            }));
            
            setBatchNo(check?.Batch_No || "");
            setnamecondition(check || false);

            if (val2) {
              try {
                const response = await axios.get(
                  `${UrlLink}Workbench/Item_Types_Link?Itemid=${val2}`
                );
                const res = response.data;
                if (res.length > 0) {
                  const firstItem = res[0];
                  setAddPriscribtion((prev) => ({
                    ...prev,
                    Dosage: firstItem?.Dose || prev.Dosage,
                    Route: firstItem?.ProductTypeName || prev.Route,
                  }));
                }
              } catch (e) {
                console.log(e);
              }
            }
          } catch (error) {
            console.error("Error processing medicine selection:", error);
          }
        } else {
          setAddPriscribtion((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      } else if (name === "GenericName") {
        if (condition) {
          const val1 = value.split("-");
          let val2 = val1[0];
          let val3 = val1[1];
          setAddPriscribtion((prev) => ({
            ...prev,
            [name]: val3,
          }));
        } else {
          setAddPriscribtion((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      } else if (name === "Department") {
        setAddPriscribtion((prev) => ({
          ...prev,
          [name]: value,
          Specialization: value === "Primary" ? IP_DoctorWorkbenchNavigation?.Specialization : "",
          DoctorName: value === "Primary" ? IP_DoctorWorkbenchNavigation?.DoctorId : "",
        }));
      } else if (name === "Onbehalf") {
        setAddPriscribtion((prev) => ({
          ...prev,
          [name]: value === "Yes" ? "Yes" : "No",
        }));
      } else {
        setAddPriscribtion((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
    adjustHeight(e);
  };

  const adjustHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const Servicecolumns = [
    {
      key: "id",
      name: "S.No",
    },
    {
      key: "Billing_Id",
      name: "Billing Id",
    },
    {
      key: "Department",
      name: "Department",
    },
    {
      key: "DoctorName",
      name: "DoctorName",
    },
    {
      key: "GenericName",
      name: "Generic Name",
    },
    {
      key: "MedicineCode",
      name: "Medicine Code",
    },
    {
      key: "ProductCode",
      name: "Medicine Name",
    },
    {
      key: "Dosage",
      name: "Dosage",
    },
    {
      key: "Route",
      name: "Route",
    },
    {
      key: "Quantity",
      name: "Quantity",
    },
    {
      key: "CapturedBy",
      name: "Captured By",
    },
    {
      key: "View",
      name: "View",
      renderCell: (params) => (
        <Button
          key={params.row}
          className="cell_btn"
          onClick={() => handleDrugRequest(params.row)}
        >
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const dynamicColumns1 = [
    { key: "id", name: "S.No" },
    { key: "Billing_Id", name: "Booking ID" },
    { key: "Prescription_Id", name: "Prescription ID" },
    { key: "Department", name: "Department" },
    { key: "DoctorName", name: "Doctor Name" },
    { key: "GenericName", name: "Generic Name" },
    { key: "MedicineCode", name: "Medicine Code" },
    { key: "ProductCode", name: "Medicine Name" },
    { key: "Dosage", name: "Dosage" },
    { key: "Route", name: "Route" },
    { key: "RecievedQuantity", name: "Recived Quantity" },
    {
      key: "Action",
      name: "View",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleStatusChange(params.row)}
        >
          <CheckCircleOutlineIcon />
        </Button>
      ),
    },
    {
      key: "Actions",
      name: "Cancel",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleStatusChange1(params.row)}
        >
          <ImCancelCircle />
        </Button>
      ),
    },
  ];

  const handleStatusChange = (row) => {
    axios
      .post(
        `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_Recieved`,
        row
      )
      .then((response) => {
        const mess = Object.values(response.data)[0];
        const typp = Object.keys(response.data)[0];
        const tdata = {
          message: mess,
          type: typp,
        };
        dispatchvalue({ type: "toast", value: tdata });
        setisChecked(!isChecked);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleStatusChange1 = (row) => {
    console.log("Cancel row:", row);
  };

  const handleDrugRequest = (row) => {
    setSelectedRow(row);
    setBooking_Id(row.Billing_Id);
    settotalquantity(row.Quantity);
    setfrequencytime(row.FrequencyTime);
    setPrescription_Id(row.Prescription_Id);
    setDrug({
      OrderType: "",
      Quantity: "",
      RequestType: "",
      RequestQuantity: "",
    });
  };

  const handlesubmitdata = () => {
    let requiredfields = [];
    if (namecondition.Category === "NON MEDICAL") {
      requiredfields = [...Object.keys(AddPriscribtion)].filter(
        (key) =>
          ![
            "Dosage",
            "AdminisDose",
            "Instruction",
            "FrequencyMethod",
            "FrequencyName",
            "FrequencyType",
            "Frequency",
            "FrequencyTime",
            "Duration",
            "DurationType",
            "IvSite",
            "id"
          ].includes(key)
      );
    } else {
      requiredfields = [...Object.keys(AddPriscribtion)].filter(
        (key) =>
          ![
            "Dosage",
            "AdminisDose",
            "Instruction",
            "FrequencyType",
            "Frequency",
            "FrequencyTime",
            "Duration",
            "DurationType",
            "IvSite",
            "id"
          ].includes(key)
      );
    }

    const exist = requiredfields.filter(
  (field) =>
    field !== "GenericName" &&
    !AddPriscribtion[field] &&
    AddPriscribtion[field] !== 0
);


    if (exist.length > 0) {
      const tdata = {
        message: `Please provide ${exist.join(",")}.`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      const senddata = {
        ...AddPriscribtion,
        id: idCounter, // Use counter for new entries
        serialNo: idCounter,
        BatchNo: BatchNo,
        StoreLocation: 3,
        Location: userRecord?.location,
        CapturedBy: userRecord?.username,
        Billing_Id: IP_DoctorWorkbenchNavigation?.RegistrationId,
        Medical_Category: namecondition.Category,
      };
      
      setsumma((prevSumma) => [...prevSumma, senddata]);
      setIdCounter(idCounter + 1);
      resetForm(); // Use reset instead of handlecleardata
    }
  };


  

  const handleupdate = () => {
    let requiredfields = [];
    if (namecondition.Category === "NON MEDICAL") {
      requiredfields = [...Object.keys(AddPriscribtion)].filter(
        (key) =>
          ![
            "Dosage",
            "AdminisDose",
            "Instruction",
            "FrequencyMethod",
            "FrequencyName",
            "FrequencyType",
            "Frequency",
            "FrequencyTime",
            "Duration",
            "DurationType",
            "IvSite",
            "id"
          ].includes(key)
      );
    } else {
      requiredfields = [...Object.keys(AddPriscribtion)].filter(
        (key) =>
          ![
            "Dosage",
            "AdminisDose",
            "Instruction",
            "FrequencyType",
            "Frequency",
            "FrequencyTime",
            "Duration",
            "DurationType",
            "IvSite",
            "id"
          ].includes(key)
      );
    }

    const exist = requiredfields.filter((field) => !AddPriscribtion[field] && AddPriscribtion[field] !== 0);

    if (exist.length > 0) {
      const tdata = {
        message: `Please provide ${exist.join(",")}.`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      const index = summa.findIndex((row) => row.id === editid);
      if (index !== -1) {
        const updatedRow = {
          ...summa[index],
          ...AddPriscribtion,
          Location: userRecord?.location,
          CapturedBy: userRecord?.username,
          Medical_Category: namecondition.Category,
        };

        const data = [...summa];
        data[index] = updatedRow;
        setsumma(data);
        resetForm();
      } else {
        console.error("Row with id", editid, "not found.");
        const tdata = {
          message: "Row not found for editing.",
          type: "error",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    }
  };

  const dynamicColumns = [
    {
      key: "serialNo",
      name: "S_No",
    },
    ...Object.keys(initialPrescriptionState)
      .filter(key => key !== 'id')
      .map((labelname) => {
        const formattedLabel = formatLabel(labelname);
        return {
          key: labelname,
          name: formattedLabel,
        };
      }),
    {
      key: "Action",
      name: "Edit",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleChangeedit(params.row)}
        >
          <EditIcon />
        </Button>
      ),
    },
  ];

  const handleChangeedit = (params) => {
    const data = summa.find((p) => p.id === params?.id);
    
    if (data) {
      setAddPriscribtion({
        ...data,
        id: data.id // Preserve the ID for editing
      });
      setisEdit(true);
      seteditid(params?.id);
      setnamecondition(data.Medical_Category ? { Category: data.Medical_Category } : false);
    } else {
      console.error("No matching data found for the given id:", params?.id);
      const tdata = {
        message: "Data not found for editing.",
        type: "error",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const handleAddRequest = () => {
    let requiredfields = [];
    requiredfields = [...Object.keys(Drug)].filter((key) =>
      ["OrderType", "RequestType", "RequestQuantity"].includes(key)
    );
    const exist = requiredfields.filter((field) => !Drug[field]);
    if (exist.length > 0) {
      const tdata = {
        message: `Please provide ${exist.join(",")}.`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      const postdata = {
        OrderType: Drug.OrderType,
        Quantity: totalquantity,
        RequestType: Drug.RequestType,
        RequestQuantity: Drug.RequestQuantity,
        Booking_Id: Booking_Id,
        Prescription_Id: Prescription_Id,
        MedicalCat: selectedRow.MedicalCat,
      };

      if (Drug.RequestQuantity > 0) {
        axios
          .post(
            `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_Add_link`,
            postdata
          )
          .then((response) => {
            const message = Object.values(response.data)[0];
            const type = Object.keys(response.data)[0];
            const tdata = {
              mess: message,
              typp: type,
            };
            dispatchvalue({ type: "toast", value: tdata });
            setDrug({
              OrderType: "",
              Quantity: "",
              RequestType: "",
              RequestQuantity: "",
            });
            setSelectedRow(null);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  };

const submitalldata = () => {
  if (summa.length > 0) {
    axios
      .post(
        `${UrlLink}DrugAdminstrations/Nurse_drug_prescription_update_link`,
        summa
      )
      .then((response) => {
        const { error, message, results } = response.data;

        // Choose toast type based on backend response
        const tdata = {
          message: message || "Response received.",
          type: error ? "error" : "success",
        };

        dispatchvalue({ type: "toast", value: tdata });

        // Optionally, show detailed messages in console for debugging
        console.log("Prescription Results:", results);

        // Reset only if all successful
        if (!error) {
          setsumma([]);
          setIdCounter(1);
        }
      })
      .catch((error) => {
        console.error("Prescription submit failed:", error);
        const tdata = {
          message: "Server error while submitting prescriptions.",
          type: "error",
        };
        dispatchvalue({ type: "toast", value: tdata });
      });
  } else {
    const tdata = {
      message: "No data to submit.",
      type: "warn",
    };
    dispatchvalue({ type: "toast", value: tdata });
  }
};


  return (
    <>
      <div className="new-patient-registration-form">
        <div className="RegisterTypecon" style={{ padding: "10px 0px" }}>
          <div className="RegisterType">
            {["Request", "Approved"].map((p, ind) => (
              <div className="registertypeval" key={ind + "key"}>
                <input
                  type="radio"
                  id={p}
                  name="appointment_type"
                  checked={DrugForm === p}
                  onChange={(e) => {
                    setDrugForm(e.target.value);
                  }}
                  value={p}
                />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </div>
        </div>
        {DrugForm === "Request" && (
          <>
            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label>
                  Medicine Name <span>:</span>
                </label>
                <input
                  type="text"
                  name="MedicineName"
                  list="IpMedicineNameList"
                  value={AddPriscribtion.MedicineName}
                  onChange={handleInputChange}
                  placeholder={loading ? "Loading..." : "Choose Medicine"}
                />
                <datalist id="IpMedicineNameList">
                  {Array.isArray(ItemName) &&
                    ItemName?.map((row, index) => (
                      <option
                        key={index}
                        value={`${row.ItemId}-${row.ItemName} | Bat.No : ${row.Batch_No} | Rs.${row.MRP} | Ava.Qty  : ${row.AvailableQuantity}`}
                      />
                    ))}
                </datalist>
              </div>
              <div className="RegisForm_1">
                <label>
                  Drug Type <span>:</span>
                </label>
                <input
                  name="Route"
                  type="text"
                  readOnly
                  value={AddPriscribtion.Route}
                  onChange={handleInputChange}
                />
              </div>
              {(AddPriscribtion.RouteSites === "IV-Direct" ||
                AddPriscribtion.RouteSites === "IV-Infusion") && (
                <div className="RegisForm_1">
                  <label>
                    IV Site <span>:</span>
                  </label>
                  <select
                    name="IvSite"
                    value={AddPriscribtion.IvSite}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="External Jugular">External Jugular</option>
                    <option value="Subclavian vein">Subclavian vein</option>
                    <option value="Femoral vein">Femoral vein</option>
                    <option value="Dorsal Venous Network of Hand">
                      Dorsal Venous Network of Hand
                    </option>
                    <option value="Radial vein">Radial vein</option>
                    <option value="Median Cubital vein">
                      Median Cubital vein
                    </option>
                    <option value="Cephalic vein">Cephalic vein</option>
                    <option value="Dorsal Venous Network of Leg">
                      Dorsal Venous Network of Leg
                    </option>
                    <option value="Saphaneous vein">Saphaneous vein</option>
                    <option value="Superficial Temporal vein">
                      Superficial Temporal vein
                    </option>
                  </select>
                </div>
              )}
              <div className="RegisForm_1">
                <label>
                  Freq Method <span>:</span>
                </label>
                <select
                  name="FrequencyMethod"
                  value={AddPriscribtion.FrequencyMethod}
                  onChange={handleInputChange}
                  disabled={namecondition.Category === "NON MEDICAL"}
                >
                  <option value="Regular">Regular</option>
                </select>
              </div>

              <div className="RegisForm_1">
                <label>
                  Frequency Name <span>:</span>
                </label>
                <select
                  name="FrequencyName"
                  value={AddPriscribtion.FrequencyName}
                  onChange={handleInputChange}
                  disabled={namecondition.Category === "NON MEDICAL"}
                >
                  <option value="">Select</option>
                  {selectedTimes.map((fields, index) => (
                    <option value={fields.Frequency_Id} key={index}>
                      {fields.FrequencyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Frequency Type <span>:</span>
                </label>
                <input
                  name="FrequencyType"
                  value={AddPriscribtion.FrequencyType}
                  disabled={
                    AddPriscribtion.FrequencyMethod === "SOS" ||
                    namecondition.Category === "NON MEDICAL"
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Frequency <span>:</span>
                </label>
                <input
                  name="Frequency"
                  value={AddPriscribtion.Frequency}
                  disabled={
                    AddPriscribtion.FrequencyMethod === "SOS" ||
                    namecondition.Category === "NON MEDICAL"
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Frequency Time <span>:</span>
                </label>
                <input
                  name="FrequencyTime"
                  type="text"
                  readOnly
                  disabled={
                    AddPriscribtion.FrequencyMethod === "SOS" ||
                    namecondition.Category === "NON MEDICAL"
                  }
                  value={AddPriscribtion.FrequencyTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Duration <span>:</span>
                </label>
                <input
                  name="Duration"
                  type="number"
                  onKeyDown={blockInvalidChar}
                  style={{ width: "60px" }}
                  disabled={AddPriscribtion.FrequencyMethod === "SOS"}
                  value={AddPriscribtion.Duration}
                  onChange={handleInputChange}
                />
                <select
                  name="DurationType"
                  style={{ width: "110px" }}
                  value={AddPriscribtion.DurationType}
                  onChange={handleInputChange}
                  disabled={AddPriscribtion.FrequencyMethod === "SOS"}
                >
                  <option value="days">days</option>
                  <option value="Weeks">weeks</option>
                  <option value="Months">Months</option>
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Adminis Dose <span>:</span>
                </label>
                <input
                  name="AdminisDose"
                  type="number"
                  onKeyDown={blockInvalidChar}
                  value={AddPriscribtion.AdminisDose}
                  onChange={handleInputChange}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Quantity <span>:</span>
                </label>
                <input
                  name="Quantity"
                  type="number"
                  onKeyDown={blockInvalidChar}
                  value={AddPriscribtion.Quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  On Behalf Of<span>:</span>
                </label>
                <input
                  name="Onbehalf"
                  type="checkbox"
                  checked={AddPriscribtion.Onbehalf === "Yes"}
                  onChange={handleInputChange}
                />
              </div>

              {AddPriscribtion.Onbehalf === "Yes" && (
                <div className="RegisForm_1">
                  <label>
                    Prescribed By <span>:</span>
                  </label>
                  <input
                    name="Prescribedby"
                    type="text"
                    value={AddPriscribtion.Prescribedby || IP_DoctorWorkbenchNavigation.DoctorName}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>

            <br />

            <div className="RegisFormcon extend_textarea_new">
              <div className="RegisForm_1 extend_textarea_new">
                <label>
                  Instructions <span>:</span>
                </label>
                <textarea
                  name="Instruction"
                  value={AddPriscribtion.Instruction}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="Main_container_Btn">
              <button
                onClick={isEdit ? handleupdate : handlesubmitdata}
              >
                {isEdit ? "Update" : "Add"}
              </button>
              {isEdit && (
                <button
                  onClick={resetForm}
                  style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}
                >
                  Cancel
                </button>
              )}
            </div>
        
            {summa.length > 0 && (
              <>
                <ReactGrid columns={dynamicColumns} RowData={summa} />
                <button className="btn-add" onClick={submitalldata}>
                  Submit All
                </button>
              </>
            )}
            <br />
            <ReactGrid columns={Servicecolumns} RowData={DrugDataGet} />
            <br />
            {selectedRow && (
              <div>
                <div className="RegisFormcon" id="RegisFormcon_11">
                  {Object.keys(Drug).map((field, ind) => (
                    <div className="RegisForm_1" key={ind}>
                      <label htmlFor={`${field}_${ind}`}>
                        {formatLabel(field)}
                        <span>:</span>
                      </label>
                      {["OrderType", "RequestType"].includes(field) ? (
                        <select
                          id={`${field}_${ind}`}
                          name={field}
                          value={Drug[field]}
                          onChange={HandleOnchange}
                        >
                          <option value="">Select</option>
                          {field === "OrderType" &&
                            [
                              "IP_Pharmacy",
                              "OP_Pharmacy",
                              "FOC_Pharmacy",
                              "OUT_Source",
                              "OWN_Medicine",
                            ].map((f, i) => (
                              <option key={i} value={f}>
                                {formatunderscoreLabel(f)}
                              </option>
                            ))}
                          {field === "RequestType" &&
                            ["Total","Daily"].map((f, i) => (
                              <option key={i} value={f}>
                                {f}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          id={`${field}_${ind}`}
                          name={field}
                          value={
                            field === "RequestQuantity" &&
                            selectedRow.MedicalCat === "MEDICAL"
                              ? newIssuedQuantity
                              : field === "RequestQuantity" &&
                                selectedRow.MedicalCat !== "MEDICAL"
                              ? Drug.RequestQuantity
                              : totalquantity || ""
                          }
                          onChange={HandleOnchange}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="Main_container_Btn">
                  <button onClick={handleAddRequest}>Add Request</button>
                </div>
              </div>
            )}
          </>
        )}
        {DrugForm === "Approved" && (
          <ReactGrid columns={dynamicColumns1} RowData={DrugDataGet} />
        )}
      </div>

      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default IP_NurseDrugRequest;