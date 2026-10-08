// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// // import { createTheme, ThemeProvider } from "@mui/material/styles";
// // import { DataGrid } from "@mui/x-data-grid";
// import ToggleButton from "@mui/material/ToggleButton";
// import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// // import "../IPNurseflow/IpNurseVitals.css";
// import { ToastContainer, toast } from "react-toastify";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import { format, longFormatters } from "date-fns";
// import axios from "axios";
// import Tooltip from "@mui/material/Tooltip";
// import { Button } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import BlockIcon from "@mui/icons-material/Block";

// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import TextField from "@mui/material/TextField";

// function CancelDrugDialog({
//   open,
//   onClose,
//   onConfirm,
//   cancelsenddata,
//   setcancelsenddata,
// }) {
//   console.log(open, "ppiup");

//   const handleConfirm = () => {
//     // Call the onConfirm callback with the cancellation reason
//     onConfirm(cancelsenddata);
//     // Close the dialog
//     onClose();
//   };

//   const handleClose = () => {
//     setcancelsenddata(null);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Drug Stop Reason</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Drug Stop Reason"
//           multiline
//           rows={4}
//           variant="outlined"
//           fullWidth
//           value={cancelsenddata?.Reason}
//           onChange={(e) =>
//             setcancelsenddata((prev) => ({
//               ...prev,
//               Reason: e.target.value,
//             }))
//           }
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} color="primary">
//           Close
//         </Button>
//         <Button onClick={handleConfirm} color="primary">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// const Prescription = () => {
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const IP_DoctorWorkbenchNavigation = useSelector(
//     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
//   );
//   console.log(IP_DoctorWorkbenchNavigation, "IP_DoctorWorkbenchNavigation");
//   const [GenericName, setgenericName] = useState([]);
//   const [getdataa, setgetdataa] = useState(false);
//   const [ItemName, setItemName] = useState([]);
//   const [namecondition, setnamecondition] = useState(false);
//   const [Speciality, setSpeciality] = useState([]);
//   const [DoctorData, setDoctorData] = useState([]);
//   const [isEdit, setisEdit] = useState(false);
//   const [cancelsenddata, setcancelsenddata] = useState(null);
//   const [OpenDialog, setOpenDialog] = useState(false);
//   const [editid, seteditid] = useState("");
//   const [priscriptionid, setpriscriptionid] = useState();
//   const IpNurseQueSelectedRow = useSelector(
//     (state) => state.InPatients?.IpNurseQueSelectedRow
//   );
//   const dispatchvalue = useDispatch();
//   const toast = useSelector((state) => state.userRecord?.toast);

//   const [lastprescribed, setlastprescribed] = useState([]);
//   const [page, setPage] = useState(0);
//   const [page1, setPage1] = useState(0);
//   const pageSize = 10;
//   const [summa, setsumma] = useState([]);
//   const [summa1, setsumma1] = useState(null);
//   const showdown = summa.length;
//   const showdown1 = summa1?.medicinedata.length || 0;
//   const totalPages = Math.ceil(summa.length / 10);
//   const totalPages1 = Math.ceil(summa1?.medicinedata.length / 10);

//   console.log("summmmmaaaaa", summa1);

//   const handlePageChange = (params) => {
//     if (type === "Intake") {
//       setPage(params.page);
//     } else {
//       setPage1(params.page);
//     }
//   };
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

//   const blockInvalidChar = (e) =>
//     ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
//   const [type, setType] = useState("Intake");
//   const [BatchNo, setBatchNo] = useState("");
//   const [AddPriscribtion, setAddPriscribtion] = useState({
//     Department: "",
//     DoctorName: "",
//     GenericName: "",
//     MedicineCode: "",
//     MedicineName: "",
//     Dosage: "",
//     Route: "",
//     FrequencyMethod: "Regular",
//     FrequencyName: "",
//     FrequencyType: "",
//     Frequency: "",
//     FrequencyTime: "",
//     DurationType: "days",
//     AdminisDose: "",
//     Quantity: "",
//     Date: "",
//     Time: "",
//     Instruction: "",
//     Specialization: "",
//     Onbehalf: "No",
//     Prescribedby: "",
//     RouteSites: "",
//     IvSite: "",
//   });

//   console.log(AddPriscribtion);
//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Workbench/Medical_Stock_InsetLink_for_Prescription`)
//       .then((response) => {
//         console.log("11111111", response.data);
//         // Process the response data as needed
//         setgenericName(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching generic names:", error);
//         // Handle the error, e.g., show an error message to the user
//       });
//   }, [UrlLink, userRecord?.location]);
//   // useEffect(() => {
//   //   const selectedGenericName = AddPriscribtion.GenericName;

//   //   if (selectedGenericName) {
//   //     axios
//   //       .get(
//   //         `${UrlLink}Masters/getitemname_bygenericname?genericName=${selectedGenericName}&location=${userRecord?.location}`
//   //       )
//   //       .then((response) => {
//   //         console.log(response.data);
//   //         setItemName(response.data);
//   //         if(!response.data.length>0){
//   //           setAddPriscribtion((prev) => ({
//   //             ...prev,
//   //             MedicineName: '',
//   //             MedicineCode: '',
//   //             Dosage:'',
//   //             Route:'',
//   //           }));
//   //         }
//   //       })
//   //       .catch((error) => {
//   //         console.error("Error fetching item names:", error);
//   //       });
//   //   }
//   //   // setItemName([])
//   //   // setAddPriscribtion((prev) => ({
//   //   //   ...prev,
//   //   //   MedicineName: '',
//   //   //   MedicineCode: '',
//   //   //   Dosage:'',
//   //   //   Route:'',
//   //   // }));
//   // }, [AddPriscribtion.GenericName, userRecord?.location]);

//   const [selectedTimes, setSelectedTimes] = useState([]);

//   useEffect(() => {
//     if (AddPriscribtion.FrequencyName) {
//       const frequencytypeval = selectedTimes.find(
//         (p) => p.id === Number(AddPriscribtion.FrequencyName)
//       );
//       console.log("frequencytypeval", frequencytypeval);

//       setAddPriscribtion((prev) => ({
//         ...prev,
//         FrequencyTime: frequencytypeval?.FrequencyTime,
//         Frequency: frequencytypeval?.Frequency,
//         FrequencyType: frequencytypeval?.FrequencyType,
//       }));
//     }
//   }, [AddPriscribtion.FrequencyName, selectedTimes]);
//   const [getdatastate, setgetdatastate] = useState(false);

//   const handleCancelAppointment = () => {
//     const requiredfields = [...Object.keys(cancelsenddata)];
//     const existing = requiredfields.filter((field) => !cancelsenddata[field]);

//     if (existing.length > 0) {
//       alert(`Please fill the Required Fields for ${existing.join(",")}`);
//     } else {
//       const confirmation = window.confirm(
//         "Are you sure you want to Stop the Drug ?."
//       );
//       console.log(confirmation);

//       if (confirmation) {
//         axios
//           .post(
//             `${UrlLink}ipregistration/cancel_drug_administration`,
//             cancelsenddata
//           )
//           .then((response) => {
//             console.log(response.data);
//             setgetdataa(!getdataa);
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//         setOpenDialog(false);
//         setcancelsenddata(null);
//       } else {
//         setOpenDialog(false);
//         setcancelsenddata(null);
//       }
//     }
//   };

//   const handlestopDrug = (params) => {
//     const senddata = {
//       Booking_Id: IpNurseQueSelectedRow?.Booking_Id,
//       Prescibtion_Id: params?.Prescibtion_Id,
//       Reason: "",
//       Stopped_date: format(new Date(), "yyyy-MM-dd"),
//       Stopped_time: format(new Date(), "HH:mm:ss"),
//       CapturedBy: userRecord?.username,
//     };

//     setcancelsenddata(senddata);
//     setOpenDialog(true);
//     console.log("---------", senddata);
//   };

//   // const warnmessage = (warnmsg) => {
//   //   toast.warn(`${warnmsg}`, {
//   //     position: "top-center",
//   //     autoClose: 1000,
//   //     hideProgressBar: false,
//   //     closeOnClick: true,
//   //     pauseOnHover: true,
//   //     draggable: true,
//   //     progress: undefined,
//   //     theme: "dark",
//   //     style: { marginTop: "50px" },
//   //   });
//   // };
//   const handleInputChange = async (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setAddPriscribtion((prev) => ({
//         ...prev,
//         [name]: checked ? "Yes" : "", // Set value to "Yes" if checked, otherwise empty string
//       }));
//     } else {
    
//       console.log("44444444444", name, value);
//       if (name === "MedicineName") {
//         let condition = value.includes("|");
//         // Update state immediately
//         if (condition) {
//           const val1 = value.split("|");
//           let val2 = val1[0];
//           let val3 = val1[1];
//           let val4 = val1[2];
          
//           console.log('22222?????====',val1,val2,val3,val4);
          
          
//           setAddPriscribtion((prev) => ({
//             ...prev,
//             [name]: val3,
//             MedicineCode: val2,
//           }));
//           const check = ItemName.find(
//             (e) => String(e.ItemId) === String(val2) && e.Batch_No === val4
//           );
//           console.log("checcccc", check);
//           setBatchNo(check.Batch_No);
//           // setnamecondition(check);
//           try {
//             const response = await axios.get(
//               `${UrlLink}Workbench/Item_Types_Link?Itemid=${val2}`
//             );
//             const res = response.data;
//             console.log("33333", res);

//             if (res.length > 0) {
//               const firstItem = res[0]; // Take the first item or iterate through the array if needed
//               setAddPriscribtion((prev) => ({
//                 ...prev,
//                 Dosage: firstItem?.Dose, // Assuming Dose is available in each object in the array
//                 Route: firstItem?.ProductTypeName, // Assuming ProductTypeName is available
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
//         let condition = value.includes("-");
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
//               `${UrlLink}Workbench/Item_Names_Link_fordoctor?Genericnameid=${val2}&Location=${userRecord?.location}&Store_location=${3}`
//             );
//             const res = response?.data;
//             console.log("222222222", res);
//             setItemName(res); // Assuming you're setting an external state here
//             if (res.length > 0) {
//               const firstItem = res[0]; // Take the first item or iterate through the array if needed
//               setAddPriscribtion((prev) => ({
//                 ...prev,
//                 MedicineCode: firstItem?.ItemId, // Assuming Dose is available in each object in the array
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
//       } else if (name === "Department") {
//         console.log('Department1111', value);
        
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
//           [name]: value === "Yes" ? "Yes" : "No", // Set value to "Yes" or "No"
//         }));
//       } else {
//         setAddPriscribtion((prev) => ({
//           ...prev,
//           [name]: value,
//         }));
//       }
//     }

//     if (e.target.name === 'Instruction') {
//       adjustHeight(e);
//     }

//   };

//   const adjustHeight = (e) => {
//     e.target.style.height = "auto"; // Reset height to calculate scrollHeight
//     e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
//   };


//   useEffect(() => {
//     if (
//       AddPriscribtion?.Frequency &&
//       AddPriscribtion?.Duration &&
//       AddPriscribtion?.DurationType
//     ) {
//       // Split the Frequency string into an array
//       const frequency = AddPriscribtion?.Frequency.split("-");
//       // Calculate the sum of frequencies
//       const sum = frequency.reduce((acc, val) => acc + parseInt(val), 0);

//       let durationdata = 0;
//       // Adjust durationdata based on the DurationType
//       if (AddPriscribtion?.DurationType === "Weeks") {
//         durationdata = sum * 7;
//       } else if (AddPriscribtion?.DurationType === "Months") {
//         durationdata = sum * 30;
//       } else {
//         durationdata = sum * 1;
//       }
//       console.log("durationdata", durationdata);

//       let quantityData = 0;

//       if (AddPriscribtion?.Route === "Syrup") {
//         const dattt = durationdata * AddPriscribtion?.Duration;
//         console.log("dattt", dattt);
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
//           qnt = dosageValue * 1000; // Convert liters to milliliters
//           if (rrrr > dosageValue * 1000) {
//             qnt = rrrr / (dosageValue * 1000);
//           } else {
//             qnt = 1;
//           }
//         }

//         console.log("qnt", qnt);
//         console.log("rrrr", rrrr);
//         quantityData = Math.ceil(qnt);
//       } else {
//         // Calculate Quantity based on durationdata and Duration
//         quantityData = durationdata * AddPriscribtion.Duration;
//       }

//       console.log("Route", AddPriscribtion.Route);

//       // Update the state with the new Quantity value
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

//   const handlecleardata = () => {
//     setAddPriscribtion((prev) => ({
//       ...prev,
//       Department: "",
//       DoctorName: "",
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
//       Duration: "",
//       DurationType: "days",
//       AdminisDose: "",
//       Quantity: "",
//       Instruction: "",
//       Prescribedby: "",
//       Specialization: "",
//       Onbehalf: "No",
//       RouteSites: "",
//       IvSite: "",
//     }));
//   };
//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Masters/insert_frequency_masters`)
//       .then((response) => {
//         const data = response.data.map((p, index) => ({
//           ...p,
//           id: p.Frequency_Id,
//         }));
//         setSelectedTimes(data);
//         console.log(data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}DrugAdminstrations/get_prescription_master_code`)
//       .then((response) => {
//         console.log(response);
//         const data = response.data.nextInvoiceCode;
//         setpriscriptionid(data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   useEffect(() => {
//     axios
//       .get(
//         `${UrlLink}DrugAdminstrations/get_for_ip_drugs_doctor_show?Booking_id=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
//       )
//       .then((response) => {
//         const data = response.data;

//         console.log("data11111111", data);
//         // Function to convert time to AM/PM format
//         // Function to convert time to AM/PM format
//         const convertToAMPM = (time) => {
//           const numTime = parseInt(time);
//           return numTime >= 1 && numTime <= 11
//             ? numTime + " AM"
//             : numTime === 12
//             ? "12 PM"
//             : numTime - 12 + " PM";
//         };

//         // Extract unique times from FrequencyTime arrays and convert them to AM/PM format
//         const freqdata = [
//           ...new Set(
//             data.flatMap((p) =>
//               p.FrequencyIssued.flatMap((r) => r.FrequencyIssued)
//             )
//           ),
//         ]
//           .map((time) => convertToAMPM(time))
//           .sort((a, b) => {
//             // Extract AM/PM and numerical value from time string
//             const [aNum, aPeriod] = a.split(" ");
//             const [bNum, bPeriod] = b.split(" ");

//             // Compare periods (AM comes before PM)
//             if (aPeriod !== bPeriod) {
//               return aPeriod.localeCompare(bPeriod);
//             }

//             // If periods are the same, sort numerically
//             return parseInt(aNum) - parseInt(bNum);
//           });

//         console.log("freqdata", freqdata);

//         setsumma1({
//           frequencyTime: freqdata,
//           medicinedata: data.map((p, indx) => ({ ...p, id: indx + 1 })),
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [IpNurseQueSelectedRow?.Booking_Id, type]);
//   useEffect(() => {
//     const now = new Date();
//     const formattedTime = format(now, "HH:mm:ss");
//     const newdate = format(new Date(), "yyyy-MM-dd");
//     setAddPriscribtion((prev) => ({
//       ...prev,
//       Time: formattedTime,
//       Date: newdate,
//     }));
//   }, []);

//   const handleChange = (event) => {
//     setType(event.target.value);
//   };
//   const formatLabel = (label) => {
//     // Check if the label contains both uppercase and lowercase letters, and doesn't contain numbers
//     if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
//       return label
//         .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase letters
//         .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
//     } else {
//       return label;
//     }
//   };

//   const handleChangeedit = (params) => {
//     console.log("params/.............................", params);
//     const data = summa.find((p) => p.id === params.id);
//     setAddPriscribtion({
//       ...data,
//     });
//     setisEdit(true);
//     seteditid(params.id);
//   };

//   const handleChangeadd = (params) => {
//     console.log("params/.............................", params);
//     const data = lastprescribed.find((p) => p.id === params.id);
//     setAddPriscribtion({
//       ...data,
//       DurationType: "days",
//     });
//     // setisEdit()
//     seteditid(params.id);
//   };

//   const handleupdate = () => {
//     let requiredfields = [];
//     if (AddPriscribtion.FrequencyMethod === "Regular") {
//       requiredfields = [...Object.keys(AddPriscribtion)].filter(
//         (key) => key !== "Instruction"
//       );
//     } else {
//       requiredfields = [...Object.keys(AddPriscribtion)].filter(
//         (key) =>
//           ![
//             "Instruction",
//             "FrequencyType",
//             "Frequency",
//             "FrequencyTime",
//             "Duration",
//             "DurationType",
//           ].includes(key)
//       );
//     }

//     const exist = requiredfields.filter((field) => !AddPriscribtion[field]);

//     if (exist.length > 0) {
//       dispatchvalue({
//         type: "warn",
//         value: '`The following fields are required: ${exist.join(", ")}`',
//       });
//     } else {
//       const index = summa.findIndex((row) => row.id === editid);
//       if (index !== -1) {
//         const updatedRow = {
//           ...summa[index],
//           ...AddPriscribtion,
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

//   const lastprescrib = [
//     {
//       key: "id",
//       name: "S_No",
//       // width: 40,
//     },
//     ...(lastprescribed && lastprescribed.length > 0
//       ? Object.keys(lastprescribed[0])
//           .filter((p) => p !== "id")
//           .map((labelname, index) => {
//             const formattedLabel = formatLabel(labelname);
//             const labelWidth = getTextWidth(formattedLabel);

//             return {
//               key: labelname,
//               name: formattedLabel,
//               // width: ["Instruction", "Date", "Time"].includes(labelname)
//               //   ? labelWidth + 100
//               //   : labelWidth + 30,
//               valueGetter: (params) => {
//                 const value = params.row[labelname];
//                 return value ? value : "-";
//               },
//             };
//           })
//       : []),
//     {
//       key: "Action",
//       name: "Add",
//       // width: 120,
//       renderCell: (params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => handleChangeadd(params.row)}
//           >
//             <AddIcon className="check_box_clrr_add" />
//           </Button>
//         </>
//       ),
//     },
//     {
//       key: "Actions", // corrected the field name to match the header name
//       name: "Stop",
//       // width: 120,
//       renderCell: (params) => (
//         <>
//           {params.row.Status === "stopped" ? (
//             "stopped"
//           ) : (
//             <Button
//               className="cell_btn"
//               onClick={() => handlestopDrug(params.row)}
//             >
//               <BlockIcon className="check_box_clrr_5" />{" "}
//               {/* corrected the icon to StopIcon */}
//             </Button>
//           )}
//         </>
//       ),
//     },
//   ];

//   function getTextWidth(text) {
//     // Create a dummy element to measure text width
//     const dummyElement = document.createElement("span");
//     dummyElement.textContent = text;
//     dummyElement.style.visibility = "hidden";
//     dummyElement.style.whiteSpace = "nowrap";
//     document.body.appendChild(dummyElement);

//     // Get the width of the text
//     const width = dummyElement.offsetWidth;

//     // Remove the dummy element
//     document.body.removeChild(dummyElement);

//     return width;
//   }
//   const dynamicColumns = [
//     {
//       key: "id",
//       name: "S_No",
//     },
//     ...Object.keys(AddPriscribtion).map((labelname, index) => {
//       const formattedLabel = formatLabel(labelname);
//       const labelWidth = getTextWidth(formattedLabel);

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

//   const dynamicColumns1 = () => {
//     // Define static fields
//     const staticFields = [
//       { key: "id", name: "S_No" },
//       { key: "PrescribedDate", name: "Prescribed Date" },
//       { key: "IssuedDate", name: "Issued Date" },
//       { key: "Department", name: "Department" },
//       { key: "DoctorName", name: "Doctor Name" },
//       { key: "MedicineName", name: "Medicine Name" },
//       { key: "FrequencyMethod", name: "Frequency Method" },
//     ];

//     // Define CSS classes or inline styles for each status
//     const statusStyles = {
//       Pending: "check_box_clrr_1",
//       Issued: "check_box_clrr_1",
//       Before: "check_box_clrr_1",
//       Delay: "check_box_clrr_4",
//       NotIssued: "check_box_clrr_5",
//       stopped: "check_box_clrr_6",
//     };

//     // Check if summa1 and summa1?.frequencyTime are valid
//     let dynamicFields = [];
//     if (summa1 && Array.isArray(summa1?.frequencyTime)) {
//       dynamicFields = summa1.frequencyTime.map((labelname) => {
//         const formattedLabel = formatLabel(labelname);
//         return {
//           key: labelname,
//           name: formattedLabel,
//           renderCell: (params) => {
//             if (
//               ![
//                 "PrescribedDate",
//                 "IssuedDate",
//                 "Department",
//                 "DoctorName",
//                 "MedicineName",
//                 "FrequencyMethod",
//               ].includes(labelname.split(" ")[0])
//             ) {
//               const newwtime = labelname.split(" ");
//               let ttt = 0;
//               if (newwtime[1] === "PM") {
//                 ttt = +newwtime[0] + 12;
//               } else {
//                 ttt = +newwtime[0];
//               }
//               const med = params.row;
//               console.log("meddddddddd", med);

//               if (med.FrequencyIssued) {
//                 const statuses = {
//                   Pending: med.FrequencyIssued.some(
//                     (f) => f.Status === "Pending" && +f.FrequencyIssued === +ttt
//                   ),
//                   Issued: med.FrequencyIssued.some(
//                     (f) => f.Status === "Issued" && +f.FrequencyIssued === +ttt
//                   ),
//                   Before: med.FrequencyIssued.some(
//                     (f) => f.Status === "Before" && +f.FrequencyIssued === +ttt
//                   ),
//                   Delay: med.FrequencyIssued.some(
//                     (f) => f.Status === "Delay" && +f.FrequencyIssued === +ttt
//                   ),
//                   NotIssued: med.FrequencyIssued.some(
//                     (f) =>
//                       f.Status === "NotIssued" && +f.FrequencyIssued === +ttt
//                   ),
//                 };

//                 const showdata = med.FrequencyIssued.filter(
//                   (rr) => +rr.FrequencyIssued === +ttt
//                 ).map((p) => ({
//                   IssuedBy: p.CapturedBy,
//                   IssuedDate: p.Completed_Date,
//                   IssuedTime: p.Completed_Time,
//                   Remarks: p.Completed_Remarks,
//                 }));

//                 const dataone = showdata.length > 0 ? showdata[0] : null; // Check if dataone exists
//                 console.log("123123dataone", dataone);
//                 console.log("123123showdata", showdata);

//                 for (const [status, className] of Object.entries(
//                   statusStyles
//                 )) {
//                   if (statuses[status]) {
//                     return (
//                       <Tooltip
//                         title={
//                           dataone ? (
//                             <div>
//                               {Object.keys(dataone).map((field, indx) => (
//                                 <h4
//                                   key={indx}
//                                   style={{
//                                     padding: "3px",
//                                     display: "block",
//                                     fontSize: "11px",
//                                   }}
//                                 >
//                                   {field === "IssuedBy"
//                                     ? "stopped By"
//                                     : field === "IssuedDate"
//                                     ? "stopped Date"
//                                     : field === "IssuedTime"
//                                     ? "stopped Time"
//                                     : formatLabel(field)}{" "}
//                                   <span>:</span> {dataone[field]}
//                                 </h4>
//                               ))}
//                             </div>
//                           ) : (
//                             "No data available"
//                           )
//                         }
//                       >
//                         <span className={className}>{status}</span>
//                       </Tooltip>
//                     );
//                   }
//                 }
//                 return "-";
//               } else {
//                 return "-";
//               }
//             } else {
//               return params.value;
//             }
//           },
//         };
//       });
//     }

//     return [...staticFields, ...dynamicFields];
//   };

//   useEffect(() => {
//     axios
//       .get(
//         `${UrlLink}DrugAdminstrations/get_last_prescription_forIP?VisitID=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
//       )
//       .then((response) => {
//         console.log(response);
//         const data = response.data.map((p, index) => ({
//           ...p,
//           id: index + 1,
//         }));
//         console.log("laasssssssssssttttttttt", data);
//         setlastprescribed(data);
//         // setPrescriptionData(data)
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   const handlesubmitdata = () => {
//     let requiredfields = [];
//     if (AddPriscribtion.FrequencyMethod === "Regular") {
//       requiredfields = [...Object.keys(AddPriscribtion)].filter(
//         (key) =>
//           key !== "Instruction" &&
//           key !== "Prescribedby" &&
//           key !== "Onbehalf" &&
//           key !== "IvSite"
//       );
//     } else {
//       requiredfields = [...Object.keys(AddPriscribtion)].filter(
//         (key) =>
//           ![
//             "Instruction",
//             "FrequencyType",
//             "Frequency",
//             "FrequencyTime",
//             "Duration",
//             "DurationType",
//           ].includes(key)
//       );
//     }

//     const exist = requiredfields.filter((field) => !AddPriscribtion[field]);

//     if (exist.length > 0) {
//       alert(`The following fields are required: ${exist.join(", ")}`)
//     } else {
//       const senddata = {
//         ...AddPriscribtion,
//         BatchNo: BatchNo,
//         Location: userRecord?.location,
//         CapturedBy: userRecord?.username,
//         Booking_Id: IP_DoctorWorkbenchNavigation?.RegistrationId,
//         storelocation:3,
//       };
//       setsumma((prevSumma) => [...prevSumma, senddata]);
//       setgetdatastate(!getdatastate);
//       handlecleardata();
//     }
//   };

//   console.log("summa...............................", summa);
//   const submitalldata = () => {
//     if (summa.length > 0) {
//       axios
//         .post(
//           `${UrlLink}DrugAdminstrations/doctor_drug_prescription_link`,
//           summa
//         )
//         .then((response) => {
//           console.log("submitttttt", response.data);
//           // Loop through each prescription response
//           response.data.responses.forEach((res) => {
//             if (res.data) {
//               // Check if res.data is defined
//               const mess = Object.values(res.data)[0];
//               const typp = Object.keys(res.data)[0];
//               const tdata = {
//                 message: mess,
//                 typp: typp,
//               };
//               dispatchvalue({ type: "toast", value: tdata });
//             } else {
//               // Handle case where res.data is undefined or null
//               const tdata = {
//                 message: "Invalid response data.",
//                 typp: "error",
//               };
//               dispatchvalue({ type: "toast", value: tdata });
//             }
//           });
//           setsumma([]);
//         })
//         .catch((error) => {
//           console.log(error);
//           const tdata = {
//             message: "An error occurred during submission.",
//             typp: "error",
//           };
//           dispatchvalue({ type: "toast", value: tdata });
//         });
//     }
//   };

//   // useEffect(()=>{
//   //   console.log(ItemName,'=====');
//   //   let fiddata=ItemName?.find((p)=> String(AddPriscribtion.MedicineCode) === String(p.ItemCode) && String(AddPriscribtion.MedicineName) === String(p.ItemName))
//   //   console.log(fiddata,'------');
//   //   if(fiddata){
//   //     axios.get(`http://localhost:8000/Masters/getDose_By_Itemname?selectedItemname=${fiddata.ItemCode}&location=${userRecord?.location}`)
//   //     .then((res)=>{
//   //       console.log(res);
//   //       let data = res.data[0]
//   //       setAddPriscribtion((prev)=>({
//   //         ...prev,
//   //         Dosage:data.dose,
//   //         Route:data.Pack_type

//   //       }))
//   //     })
//   //     .catch((err)=>{
//   //       console.log(err);
//   //     })
//   //   }else{
//   //     setAddPriscribtion((prev)=>({
//   //       ...prev,
//   //       Dosage:'',
//   //       Route:''

//   //     }))
//   //   }

//   // },[ItemName,AddPriscribtion.MedicineCode,AddPriscribtion.MedicineName])

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Masters/Speciality_Detials_link`)
//       .then((response) => {
//         console.log("response", response);
//         let data = response.data;
//         setSpeciality(data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [AddPriscribtion.Department]);
//   useEffect(() => {
//     let data = Speciality.filter(
//       (p) => p.SpecialityName === AddPriscribtion.Specialization
//     );
//     console.log("data", data);

//     const fetchdat = async () => {
//       try {
//         const response = await axios.get(
//           `${UrlLink}Masters/get_Doctor_by_Speciality_Detials?Speciality=${AddPriscribtion.Specialization}`
//         );

//         setDoctorData(response.data);
//         console.log(response.data, "daaaaaaa");
//       } catch (error) {
//         setDoctorData([]);
//         console.error("Error fetching referral doctors:", error);
//       }
//     };
//     if (AddPriscribtion.Specialization) {
//       fetchdat();
//     }
//   }, [UrlLink, AddPriscribtion.Specialization]);

//   return (
//     <>
//       <div className="RegisFormcon_1">
//         <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
//           <ToggleButtonGroup
//             value={type}
//             exclusive
//             onChange={handleChange}
//             aria-label="Platform"
//           >
//             <ToggleButton
//               value="Intake"
//               style={{
//                 height: "30px",
//                 width: "180px",
//                 backgroundColor:
//                   type === "Intake"
//                     ? "var(--selectbackgroundcolor)"
//                     : "inherit",
//               }}
//               className="togglebutton_container"
//             >
//               Add Drugs
//             </ToggleButton>
//             <ToggleButton
//               value="Output"
//               style={{
//                 backgroundColor:
//                   type === "Output"
//                     ? "var(--selectbackgroundcolor)"
//                     : "inherit",
//                 width: "180px",
//                 height: "30px",
//               }}
//               className="togglebutton_container"
//             >
//               View Drugs
//             </ToggleButton>
//           </ToggleButtonGroup>
//         </div>

//         <br />

//         {type === "Intake" && (
//           <>

// <div className="RegisFormcon_1 jjxjx_">
//             {lastprescribed && lastprescribed.length > 0 && (
//                 <ReactGrid columns={lastprescrib} RowData={lastprescribed} />
//               )}
// </div>
//             <div className="RegisFormcon">
            
//               {/* {lastprescribed.length > 0 && <div className="IP_grid">
//                   <ThemeProvider theme={theme}>
//                     <div className="IP_grid_1">
//                       <DataGrid
//                         rows={lastprescribed.slice(
//                           page * pageSize,
//                           (page + 1) * pageSize
//                         )} // Display only the current page's data
//                         columns={lastprescrib} // Use dynamic columns here
//                         pageSize={10}
//                         initialState={{
//                           pagination: {
//                             paginationModel: {
//                               pageSize: 10,
//                             },
//                           },
//                         }}
//                         pageSizeOptions={[10]}
//                         onPageChange={handlePageChange}
//                         hideFooterPagination
//                         hideFooterSelectedRowCount
//                         className="Ip_data_grid"
//                       />
//                       {!showdown > 0 && !lastprescribed.length > 10 && (
//                         <div className="IP_grid_foot">
//                           <button
//                             onClick={() =>
//                               setPage((prevPage) => Math.max(prevPage - 1, 0))
//                             }
//                             disabled={page === 0}
//                           >
//                             Previous
//                           </button>
//                           Page {page + 1} of {totalPages}
//                           <button
//                             onClick={() =>
//                               setPage((prevPage) =>
//                                 Math.min(prevPage + 1, totalPages - 1)
//                               )
//                             }
//                             disabled={page === totalPages - 1}
//                           >
//                             Next
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </ThemeProvider>
//                   {showdown !== 0 && lastprescribed.length !== 0 && (
//                     <div className="IP_norecords">
//                       <span>No Records Found</span>
//                     </div>
//                   )}
//                 </div>
// } */}


//               <div className="RegisForm_1">
//                 <label>
//                   Department <span>:</span>
//                 </label>

//                 <select
//                   name="Department"
//                   value={AddPriscribtion.Department}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select</option>
//                   <option value="Primary">Primary</option>
//                   <option value="Duty">Duty</option>
//                   <option value="Special">Visiting</option>
//                 </select>
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Specialization Name <span>:</span>
//                 </label>

//                 <input
//                   type="text"
//                   name="Specialization"
//                   list="SpecializationList"
//                   // readOnly={AddPriscribtion.Specialization==='Primary'}
//                   value={AddPriscribtion.Specialization}
//                   onChange={handleInputChange}
//                 />
//                 <datalist id="SpecializationList">
//                   {Speciality?.map((row, index) => (
//                     <option key={index} value={row.id}>
//                       {row.SpecialityName}
//                     </option>
//                   ))}
//                 </datalist>
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Doctor Name <span>:</span>
//                 </label>

//                 <select
//                   type="text"
//                   name="DoctorName"
//                   list="IpDoctorNameList"
//                   // readOnly={AddPriscribtion.Department==='Primary'}
//                   value={AddPriscribtion.DoctorName}
//                   onChange={handleInputChange}
//                 >
//                   <option value="">Select</option>
//                   {DoctorData?.map((row, index) => (
//                     <option key={index} value={row.id}>
//                       {row.ShortName}{" "}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="RegisForm_1">
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
//                     ></option>
//                   ))}
//                 </datalist>
//               </div>
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
//                 />
//                 <datalist id="IpMedicineNameList">
//                   {Array.isArray(ItemName) &&
//                     ItemName?.map((row, index) => (
//                       <option
//                         key={index}
//                         value={`${row.ItemId}|${row.ItemName}|${row.Batch_No}`}
//                       >
//                         {`Bat.No : ${row.Batch_No} | Rs.${row.MRP} | Ava.Qty  : ${row.AvailableQuantity}`}
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
//                   // type="text"
//                   // readOnly
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
//                     // type="text"
//                     // readOnly
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
//                 >
//                   <option value="Regular">Regular</option>
//                   <option value="SOS">SOS</option>
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
//                   disabled={AddPriscribtion.FrequencyMethod === "SOS"}
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
//                   disabled={AddPriscribtion.FrequencyMethod === "SOS"}
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
//                   disabled={AddPriscribtion.FrequencyMethod === "SOS"}
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
//                   readOnly={AddPriscribtion.FrequencyMethod === "Regular"}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div className="RegisForm_1">
//                 <label>
//                   Date <span>:</span>
//                 </label>

//                 <input
//                   name="Date"
//                   type="date"
//                   value={AddPriscribtion.Date}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="RegisForm_1">
//                 <label>
//                   Time <span>:</span>
//                 </label>

//                 <input
//                   name="Time"
//                   type="time"
//                   value={AddPriscribtion.Time}
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
//                   checked={AddPriscribtion.Onbehalf === "Yes"} // Check if value is "yes"
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
//                     //  readOnly
//                     disabled={AddPriscribtion.Prescribedby === "SOS"}
//                     value={AddPriscribtion.Prescribedby}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               )}
        
//             </div>
// <br />

//             <div className="RegisFormcon extend_textarea_new">
//         <div className="RegisForm_1 extend_textarea_new"

//         >
//                 <label>
//                   Instructions <span>:</span>
//                 </label>

//                 <textarea
//                   name="Instruction"
//                   placeholder="Enter Instructions here ..."
//                   value={AddPriscribtion.Instruction}
//                   onChange={handleInputChange}
//                 />
//               </div>

// </div>

//             <br />

//             <div
//              className="Main_container_Btn"
//             >
//               <button
//                 className=""
//                 onClick={isEdit ? handleupdate : handlesubmitdata}
//               >
//                 {isEdit ? "Update" : "Add"}
//               </button>
//             </div>


            
//             {summa.length > 0 && (
//               <>
//               <div className='RegisFormcon_1 jjxjx_'>
//                 <ReactGrid columns={dynamicColumns} RowData={summa} />
//               </div>
//                 <div className="Main_container_Btn">
//                 <button onClick={submitalldata}>
//                   Submit
//                 </button>
//                 </div>
//               </>
//             )}
//           </>
//         )}

// <div className="RegisFormcon_1 jjxjx_">
//         {type === "Output" && (
//           <ReactGrid
//             columns={dynamicColumns1()}
//             RowData={summa1?.medicinedata}
//           />
//         )}
//         </div>

//         <ToastAlert Message={toast.message} Type={toast.type} />

//         <ToastContainer />
//         <CancelDrugDialog
//           open={OpenDialog}
//           onClose={() => setOpenDialog(false)}
//           onConfirm={handleCancelAppointment}
//           setcancelsenddata={setcancelsenddata}
//           cancelsenddata={cancelsenddata}
//         />
//       </div>
//     </>
//   );
// };

// export default Prescription;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { format } from "date-fns";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { ToastContainer } from "react-toastify";

function CancelDrugDialog({
  open,
  onClose,
  onConfirm,
  cancelsenddata,
  setcancelsenddata,
}) {
  const handleConfirm = () => {
    onConfirm(cancelsenddata);
    onClose();
  };

  const handleClose = () => {
    setcancelsenddata(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Drug Stop Reason</DialogTitle>
      <DialogContent>
        <TextField
          label="Drug Stop Reason"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={cancelsenddata?.Reason}
          onChange={(e) =>
            setcancelsenddata((prev) => ({
              ...prev,
              Reason: e.target.value,
            }))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Prescription = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const [GenericName, setgenericName] = useState([]);
  const [getdataa, setgetdataa] = useState(false);
  const [ItemName, setItemName] = useState([]);
  const [namecondition, setnamecondition] = useState(false);
  const [Speciality, setSpeciality] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [isEdit, setisEdit] = useState(false);
  const [cancelsenddata, setcancelsenddata] = useState(null);
  const [OpenDialog, setOpenDialog] = useState(false);
  const [editid, seteditid] = useState("");
  const [priscriptionid, setpriscriptionid] = useState();
  const IpNurseQueSelectedRow = useSelector(
    (state) => state.InPatients?.IpNurseQueSelectedRow
  );
  const dispatchvalue = useDispatch();
  const toast = useSelector((state) => state.userRecord?.toast);

  const [lastprescribed, setlastprescribed] = useState([]);
  const [page, setPage] = useState(0);
  const [page1, setPage1] = useState(0);
  const pageSize = 10;
  const [summa, setsumma] = useState([]);
  const [summa1, setsumma1] = useState(null);
  const showdown = summa.length;
  const showdown1 = summa1?.medicinedata.length || 0;
  const totalPages = Math.ceil(summa.length / 10);
  const totalPages1 = Math.ceil(summa1?.medicinedata.length / 10);

  const handlePageChange = (params) => {
    if (type === "Intake") {
      setPage(params.page);
    } else {
      setPage1(params.page);
    }
  };
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const [type, setType] = useState("Intake");
  const [BatchNo, setBatchNo] = useState("");
  const [AddPriscribtion, setAddPriscribtion] = useState({
    Department: "",
    DoctorName: "",
    // GenericName: "",
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
    AdminisDose: "",
    Quantity: "",
    Date: "",
    Time: "",
    Instruction: "",
    Specialization: "",
    Onbehalf: "No",
    Prescribedby: "",
    RouteSites: "Oral",
    IvSite: "",
  });

  // useEffect(() => {
  //   axios
  //     .get(`${UrlLink}Workbench/Medical_Stock_InsetLink_for_Prescription`)
  //     .then((response) => {
  //       setgenericName(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching generic names:", error);
  //     });
  // }, [UrlLink, userRecord?.location]);



  const [loading, setloading] = useState(false);


  useEffect(() => {
  const fetchData = async () => {
    try {
      setloading(true);
      console.log("load before fetch:", loading);

      const res = await axios.get(
        `${UrlLink}Workbench/Nurse_Item_Names_Link?Location=${userRecord?.location}`
      );
      setItemName(res.data);
    } catch (error) {
      console.error("Error fetching item names:", error);
    } finally {
      setloading(false);
      console.log("load set to false");
    }
  };

  if (userRecord?.location) {
    fetchData();
  }
}, [UrlLink, userRecord?.location]);





  const [selectedTimes, setSelectedTimes] = useState([]);

  useEffect(() => {
    if (AddPriscribtion.FrequencyName) {
      const frequencytypeval = selectedTimes.find(
        (p) => p.id === Number(AddPriscribtion.FrequencyName)
      );
      setAddPriscribtion((prev) => ({
        ...prev,
        FrequencyTime: frequencytypeval?.FrequencyTime,
        Frequency: frequencytypeval?.Frequency,
        FrequencyType: frequencytypeval?.FrequencyType,
      }));
    }
  }, [AddPriscribtion.FrequencyName, selectedTimes]);
  const [getdatastate, setgetdatastate] = useState(false);

  const handleCancelAppointment = () => {
    const requiredfields = [...Object.keys(cancelsenddata)];
    const existing = requiredfields.filter((field) => !cancelsenddata[field]);

    if (existing.length > 0) {
      alert(`Please fill the Required Fields for ${existing.join(",")}`);
    } else {
      const confirmation = window.confirm(
        "Are you sure you want to Stop the Drug ?."
      );
      if (confirmation) {
        axios
          .post(
            `${UrlLink}ipregistration/cancel_drug_administration`,
            cancelsenddata
          )
          .then((response) => {
            setgetdataa(!getdataa);
          })
          .catch((error) => {
            console.log(error);
          });
        setOpenDialog(false);
        setcancelsenddata(null);
      } else {
        setOpenDialog(false);
        setcancelsenddata(null);
      }
    }
  };

  const handlestopDrug = (params) => {
    const senddata = {
      Booking_Id: IpNurseQueSelectedRow?.Booking_Id,
      Prescibtion_Id: params?.Prescibtion_Id,
      Reason: "",
      Stopped_date: format(new Date(), "yyyy-MM-dd"),
      Stopped_time: format(new Date(), "HH:mm:ss"),
      CapturedBy: userRecord?.username,
    };

    setcancelsenddata(senddata);
    setOpenDialog(true);
  };

  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setAddPriscribtion((prev) => ({
        ...prev,
        [name]: checked ? "Yes" : "",
      }));
    } else {
      if (name === "MedicineName") {
        let condition = value.includes("|");
        if (condition) {
          const val1 = value.split("|");
          let val2 = val1[0]; // ItemId
          let val3 = val1[1]; // ItemName
          let val4 = val1[2]; // Batch_No

          setAddPriscribtion((prev) => ({
            ...prev,
            [name]: val3,
            MedicineCode: val2,
          }));
          const check = ItemName.find(
            (e) => String(e.ItemId) === String(val2) && e.Batch_No === val4
          );
          console.log("checcccc", check);
           setAddPriscribtion((prev) => ({
            ...prev,
            // GenericName: check?.GenericName || "",
          }));
          setBatchNo(check?.Batch_No || "");
          try {
            // Fetch item details directly based on ItemId
            const response = await axios.get(
              `${UrlLink}Workbench/Item_Types_Link?Itemid=${val2}`
            );
            const res = response.data;
            if (res.length > 0) {
              const firstItem = res[0];
              setAddPriscribtion((prev) => ({
                ...prev,
                Dosage: firstItem?.Dose || "",
                Route: firstItem?.ProductTypeName || "",
              }));
            } else {
              setAddPriscribtion((prev) => ({
                ...prev,
                Dosage: "",
                Route: "",
              }));
            }
          } catch (e) {
            console.log(e);
            setAddPriscribtion((prev) => ({
              ...prev,
              Dosage: "",
              Route: "",
            }));
          }
          // Fetch available items for the MedicineName dropdown
          try {
            const response = await axios.get(
              `${UrlLink}Workbench/Item_Names_Link_fordoctor?Location=${userRecord?.location}&Store_location=3`
            );
            const res = response?.data;
            setItemName(res);
          } catch (e) {
            console.log(e);
            setItemName([]);
          }
        } else {
          setAddPriscribtion((prev) => ({
            ...prev,
            [name]: value,
            MedicineCode: "",
            Dosage: "",
            Route: "",
          }));
          // Fetch all items when MedicineName is being typed or cleared
          try {
            const response = await axios.get(
              `${UrlLink}Workbench/Item_Names_Link_fordoctor?Location=${userRecord?.location}&Store_location=3`
            );
            const res = response?.data;
            setItemName(res);
          } catch (e) {
            console.log(e);
            setItemName([]);
          }
        }
      }  else if (name === "Department") {
        setAddPriscribtion((prev) => ({
          ...prev,
          [name]: value,
          Specialization:
            value === "Primary"
              ? IP_DoctorWorkbenchNavigation?.Specialization
              : "",
          DoctorName:
            value === "Primary" ? IP_DoctorWorkbenchNavigation?.DoctorId : "",
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

    if (name === "Instruction") {
      adjustHeight(e);
    }
  };

  const adjustHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

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
    AddPriscribtion?.FrequencyMethod,
    AddPriscribtion?.FrequencyType,
  ]);

  const handlecleardata = () => {
    setAddPriscribtion((prev) => ({
      ...prev,
      Department: "",
      DoctorName: "",
      // GenericName: "",
      MedicineCode: "",
      MedicineName: "",
      Dosage: "",
      Route: "",
      FrequencyMethod: "Regular",
      FrequencyName: "",
      FrequencyType: "",
      Frequency: "",
      FrequencyTime: "",
      Duration: "",
      DurationType: "days",
      AdminisDose: "",
      Quantity: "",
      Instruction: "",
      Prescribedby: "",
      Specialization: "",
      Onbehalf: "No",
      RouteSites: "Oral",
      IvSite: "",
    }));
  };

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
    axios
      .get(`${UrlLink}DrugAdminstrations/get_prescription_master_code`)
      .then((response) => {
        const data = response.data.nextInvoiceCode;
        setpriscriptionid(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}DrugAdminstrations/get_for_ip_drugs_doctor_show?Booking_id=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
      )
      .then((response) => {
        const data = response.data;
        const convertToAMPM = (time) => {
          const numTime = parseInt(time);
          return numTime >= 1 && numTime <= 11
            ? numTime + " AM"
            : numTime === 12
            ? "12 PM"
            : numTime - 12 + " PM";
        };

        const freqdata = [
          ...new Set(
            data.flatMap((p) =>
              p.FrequencyIssued.flatMap((r) => r.FrequencyIssued)
            )
          ),
        ]
          .map((time) => convertToAMPM(time))
          .sort((a, b) => {
            const [aNum, aPeriod] = a.split(" ");
            const [bNum, bPeriod] = b.split(" ");

            if (aPeriod !== bPeriod) {
              return aPeriod.localeCompare(bPeriod);
            }

            return parseInt(aNum) - parseInt(bNum);
          });

        setsumma1({
          frequencyTime: freqdata,
          medicinedata: data.map((p, indx) => ({ ...p, id: indx + 1 })),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [IpNurseQueSelectedRow?.Booking_Id, type]);

  useEffect(() => {
    const now = new Date();
    const formattedTime = format(now, "HH:mm:ss");
    const newdate = format(new Date(), "yyyy-MM-dd");
    setAddPriscribtion((prev) => ({
      ...prev,
      Time: formattedTime,
      Date: newdate,
    }));
  }, []);

  const handleChange = (event) => {
    setType(event.target.value);
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

  const handleChangeedit = (params) => {
    const data = summa.find((p) => p.id === params.id);
    setAddPriscribtion({
      ...data,
    });
    setisEdit(true);
    seteditid(params.id);
  };

  const handleChangeadd = (params) => {
    const data = lastprescribed.find((p) => p.id === params.id);
    setAddPriscribtion({
      ...data,
      DurationType: "days",
    });
    seteditid(params.id);
  };

  const handleupdate = () => {
    let requiredfields = [];
    if (AddPriscribtion.FrequencyMethod === "Regular") {
      requiredfields = [...Object.keys(AddPriscribtion)].filter(
        (key) => key !== "Instruction"
      );
    } else {
      requiredfields = [...Object.keys(AddPriscribtion)].filter(
        (key) =>
          ![
            "Instruction",
            "FrequencyType",
            "Frequency",
            "FrequencyTime",
            "Duration",
            "DurationType",
          ].includes(key)
      );
    }

    const exist = requiredfields.filter((field) => !AddPriscribtion[field]);

    if (exist.length > 0) {
      dispatchvalue({
        type: "warn",
        value: `The following fields are required: ${exist.join(", ")}`,
      });
    } else {
      const index = summa.findIndex((row) => row.id === editid);
      if (index !== -1) {
        const updatedRow = {
          ...summa[index],
          ...AddPriscribtion,
        };
        const data = [...summa];
        data[index] = updatedRow;
        setsumma(data);
        handlecleardata();
        setisEdit(false);
      } else {
        console.error("Row with id", editid, "not found.");
      }
    }
  };

  const lastprescrib = [
    {
      key: "id",
      name: "S_No",
    },
    ...(lastprescribed && lastprescribed.length > 0
      ? Object.keys(lastprescribed[0])
          .filter((p) => p !== "id")
          .map((labelname, index) => {
            const formattedLabel = formatLabel(labelname);
            const labelWidth = getTextWidth(formattedLabel);

            return {
              key: labelname,
              name: formattedLabel,
              valueGetter: (params) => {
                const value = params.row[labelname];
                return value ? value : "-";
              },
            };
          })
      : []),
    {
      key: "Action",
      name: "Add",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleChangeadd(params.row)}
          >
            <AddIcon className="check_box_clrr_add" />
          </Button>
        </>
      ),
    },
    {
      key: "Actions",
      name: "Stop",
      renderCell: (params) => (
        <>
          {params.row.Status === "stopped" ? (
            "stopped"
          ) : (
            <Button
              className="cell_btn"
              onClick={() => handlestopDrug(params.row)}
            >
              <BlockIcon className="check_box_clrr_5" />
            </Button>
          )}
        </>
      ),
    },
  ];

  function getTextWidth(text) {
    const dummyElement = document.createElement("span");
    dummyElement.textContent = text;
    dummyElement.style.visibility = "hidden";
    dummyElement.style.whiteSpace = "nowrap";
    document.body.appendChild(dummyElement);

    const width = dummyElement.offsetWidth;
    document.body.removeChild(dummyElement);

    return width;
  }

  const dynamicColumns = [
    {
      key: "id",
      name: "S_No",
    },
    ...Object.keys(AddPriscribtion).map((labelname, index) => {
      const formattedLabel = formatLabel(labelname);
      const labelWidth = getTextWidth(formattedLabel);

      return {
        key: labelname,
        name: formattedLabel,
      };
    }),
    {
      key: "Action",
      name: "Edit",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleChangeedit(params.row)}
          >
            <EditIcon />
          </Button>
        </>
      ),
    },
  ];

  const dynamicColumns1 = () => {
    const staticFields = [
      { key: "id", name: "S_No" },
      { key: "PrescribedDate", name: "Prescribed Date" },
      { key: "IssuedDate", name: "Issued Date" },
      // { key: "Department", name: "Department" },
      // { key: "DoctorName", name: "Doctor Name" },
      { key: "MedicineName", name: "Medicine Name" },
      { key: "FrequencyMethod", name: "Frequency Method" },
    ];

    const statusStyles = {
      Pending: "check_box_clrr_1",
      Issued: "check_box_clrr_3",
      Before: "check_box_clrr_2",
      Delay: "check_box_clrr_4",
      NotIssued: "check_box_clrr_5",
      stopped: "check_box_clrr_6",
    };
 
    let dynamicFields = [];
    if (summa1 && Array.isArray(summa1?.frequencyTime)) {
      dynamicFields = summa1.frequencyTime.map((labelname) => {
        const formattedLabel = formatLabel(labelname);
        return {
          key: labelname,
          name: formattedLabel,
          renderCell: (params) => {
            if (
              ![
                "PrescribedDate",
                "IssuedDate",
                "Department",
                "DoctorName",
                "MedicineName",
                "FrequencyMethod",
              ].includes(labelname.split(" ")[0])
            ) {
              const newwtime = labelname.split(" ");
              let ttt = 0;
              if (newwtime[1] === "PM") {
                ttt = +newwtime[0] + 12;
              } else {
                ttt = +newwtime[0];
              }
              const med = params.row;

              if (med.FrequencyIssued) {
                const statuses = {
                  Pending: med.FrequencyIssued.some(
                    (f) => f.Status === "Pending" && +f.FrequencyIssued === +ttt
                  ),
                  Issued: med.FrequencyIssued.some(
                    (f) => f.Status === "Issued" && +f.FrequencyIssued === +ttt
                  ),
                  Before: med.FrequencyIssued.some(
                    (f) => f.Status === "Before" && +f.FrequencyIssued === +ttt
                  ),
                  Delay: med.FrequencyIssued.some(
                    (f) => f.Status === "Delay" && +f.FrequencyIssued === +ttt
                  ),
                  NotIssued: med.FrequencyIssued.some(
                    (f) =>
                      f.Status === "NotIssued" && +f.FrequencyIssued === +ttt
                  ),
                   NotIssued: med.FrequencyIssued.some(
                    (f) =>
                      f.Status === "NotIssued" && +f.FrequencyIssued === +ttt
                  ),
                };

                const showdata = med.FrequencyIssued.filter(
                  (rr) => +rr.FrequencyIssued === +ttt
                ).map((p) => ({
                  IssuedBy: p.CapturedBy,
                  IssuedDate: p.Completed_Date,
                  IssuedTime: p.Completed_Time,
                  Remarks: p.Completed_Remarks,
                }));

                const dataone = showdata.length > 0 ? showdata[0] : null;
                for (const [status, className] of Object.entries(statusStyles)) {
                  if (statuses[status]) {
                    return (
                      <Tooltip
                        title={
                          dataone ? (
                            <div>
                              {Object.keys(dataone).map((field, indx) => (
                                <h4
                                  key={indx}
                                  style={{
                                    padding: "3px",
                                    display: "block",
                                    fontSize: "11px",
                                  }}
                                >
                                  {field === "IssuedBy"
                                    ? "stopped By"
                                    : field === "IssuedDate"
                                    ? "stopped Date"
                                    : field === "IssuedTime"
                                    ? "stopped Time"
                                    : formatLabel(field)}{" "}
                                  <span>:</span> {dataone[field]}
                                </h4>
                              ))}
                            </div>
                          ) : (
                            "No data available"
                          )
                        }
                      >
                        <span className={className}>{status}</span>
                      </Tooltip>
                    );
                  }
                }
                return "-";
              } else {
                return "-";
              }
            } else {
              return params.value;
            }
          },
        };
      });
    }

    return [...staticFields, ...dynamicFields];
  };

  useEffect(() => {
    axios
      .get(
        `${UrlLink}DrugAdminstrations/get_last_prescription_forIP?VisitID=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
      )
      .then((response) => {
        const data = response.data.map((p, index) => ({
          ...p,
          id: index + 1,
        }));
        setlastprescribed(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlesubmitdata = () => {
    let requiredfields = [];
    if (AddPriscribtion.FrequencyMethod === "Regular") {
      requiredfields = [...Object.keys(AddPriscribtion)].filter(
        (key) =>
          key !== "Instruction" &&
          key !== "Prescribedby" &&
          key !== "Onbehalf" &&
          key !== "IvSite" &&
          key !== "Dosage"
      );
    } else {
      requiredfields = [...Object.keys(AddPriscribtion)].filter(
        (key) =>
          ![
            "Instruction",
            "FrequencyType",
            "Frequency",
            "FrequencyTime",
            "Duration",
            "DurationType",
             "Dosage",
          ].includes(key)
      );
    }

    const exist = requiredfields.filter((field) => !AddPriscribtion[field]);

    if (exist.length > 0) {
      alert(`The following fields are required: ${exist.join(", ")}`);
    } else {
      const senddata = {
        ...AddPriscribtion,
        BatchNo: BatchNo,
        Location: userRecord?.location,
        CapturedBy: userRecord?.username,
        Booking_Id: IP_DoctorWorkbenchNavigation?.RegistrationId,
        storelocation: 3,
      };
      setsumma((prevSumma) => [...prevSumma, senddata]);
      setgetdatastate(!getdatastate);
      handlecleardata();
    }
  };

  const submitalldata = () => {
    if (summa.length > 0) {
      axios
        .post(
          `${UrlLink}DrugAdminstrations/doctor_drug_prescription_link`,
          summa
        )
        .then((response) => {
          response.data.responses.forEach((res) => {
            if (res.data) {
              const mess = Object.values(res.data)[0];
              const typp = Object.keys(res.data)[0];
              const tdata = {
                message: mess,
                typp: typp,
              };
              dispatchvalue({ type: "toast", value: tdata });
            } else {
              const tdata = {
                message: "Invalid response data.",
                typp: "error",
              };
              dispatchvalue({ type: "toast", value: tdata });
            }
          });
          setsumma([]);
        })
        .catch((error) => {
          console.log(error);
          const tdata = {
            message: "An error occurred during submission.",
            typp: "error",
          };
          dispatchvalue({ type: "toast", value: tdata });
        });
    }
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((response) => {
        let data = response.data;
        setSpeciality(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [AddPriscribtion.Department]);

  useEffect(() => {
    let data = Speciality.filter(
      (p) => p.SpecialityName === AddPriscribtion.Specialization
    );

    const fetchdat = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Masters/get_Doctor_by_Speciality_Detials?Speciality=${AddPriscribtion.Specialization}`
        );
        setDoctorData(response.data);
      } catch (error) {
        setDoctorData([]);
        console.error("Error fetching referral doctors:", error);
      }
    };
    if (AddPriscribtion.Specialization) {
      fetchdat();
    }
  }, [UrlLink, AddPriscribtion.Specialization]);

  return (
    <>
      <div className="RegisFormcon_1">
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton
              value="Intake"
              style={{
                height: "30px",
                width: "180px",
                backgroundColor:
                  type === "Intake"
                    ? "var(--selectbackgroundcolor)"
                    : "inherit",
              }}
              className="togglebutton_container"
            >
              Add Drugs
            </ToggleButton>
            <ToggleButton
              value="Output"
              style={{
                backgroundColor:
                  type === "Output"
                    ? "var(--selectbackgroundcolor)"
                    : "inherit",
                width: "180px",
                height: "30px",
              }}
              className="togglebutton_container"
            >
              View Drugs
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <br />

        {type === "Intake" && (
          <>
            <div className="RegisFormcon_1 jjxjx_">
              {lastprescribed && lastprescribed.length > 0 && (
                <ReactGrid columns={lastprescrib} RowData={lastprescribed} />
              )}
            </div>
            <div className="RegisFormcon">
              <div className="RegisForm_1">
                <label>
                  Department <span>:</span>
                </label>
                <select
                  name="Department"
                  value={AddPriscribtion.Department}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="Primary">Primary</option>
                  <option value="Duty">Duty</option>
                  <option value="Special">Visiting</option>
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Specialization Name <span>:</span>
                </label>
                <input
                  type="text"
                  name="Specialization"
                  list="SpecializationList"
                  value={AddPriscribtion.Specialization}
                  onChange={handleInputChange}
                />
                <datalist id="SpecializationList">
                  {Speciality?.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.SpecialityName}
                    </option>
                  ))}
                </datalist>
              </div>
              <div className="RegisForm_1">
                <label>
                  Doctor Name <span>:</span>
                </label>
                <select
                  name="DoctorName"
                  value={AddPriscribtion.DoctorName}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {DoctorData?.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.ShortName}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className="RegisForm_1">
                <label>
                  Generic Name <span>:</span>
                </label>
                <input
                  type="text"
                  name="GenericName"
                  list="IpGenericNameList"
                  value={AddPriscribtion.GenericName}
                  onChange={handleInputChange}
                />
                <datalist id="IpGenericNameList">
                  {GenericName?.map((row, index) => (
                    <option
                      key={index}
                      value={`${row.id}-${row.Generic_Name}`}
                    ></option>
                  ))}
                </datalist>
              </div> */}
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
                  placeholder={loading ? "Loading...": "Choose Medicin"}
                />
                <datalist id="IpMedicineNameList">
                  {Array.isArray(ItemName) &&
                    ItemName?.map((row, index) => (
                      <option
                        key={index}
                        value={`${row.ItemId}|${row.ItemName}|${row.Batch_No}`}
                      >
                        {`Bat.No : ${row.Batch_No} | Rs.${row.MRP} | Ava.Qty  : ${row.AvailableQuantity}`}
                      </option>
                    ))}
                </datalist>
              </div>
              {/* <div className="RegisForm_1">
                <label>
                  Dose <span>:</span>
                </label>
                <input
                  name="Dosage"
                  type="text"
                  readOnly
                  value={AddPriscribtion.Dosage}
                  onChange={handleInputChange}
                />
              </div> */}
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
              {/* <div className="RegisForm_1">
                <label>
                  Route <span>:</span>
                </label>
                <select
                  name="RouteSites"
                  value={AddPriscribtion.RouteSites}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="IV-Direct"> IV-Direct</option>
                  <option value="IV-Infusion"> IV-Infusion</option>
                  <option value="Intramuscular">Intramuscular</option>
                  <option value="Subcutaneous">Subcutaneous</option>
                  <option value="Sublingual">Sublingual </option>
                  <option value="Rectal">Rectal</option>
                  <option value="Oral">Oral</option>
                  <option value="Inhalational">Inhalational</option>
                  <option value="Nasal">Nasal</option>
                </select>
              </div> */}
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
                    <option value="Femoral vein"> Femoral vein</option>
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
                >
                  <option value="Regular">Regular</option>
                  {/* <option value="SOS">SOS</option> */}
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
                  disabled={AddPriscribtion.FrequencyMethod === "SOS"}
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
                  disabled={AddPriscribtion.FrequencyMethod === "SOS"}
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
                  disabled={AddPriscribtion.FrequencyMethod === "SOS"}
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
                  style={{ width: "20px" }}
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
                  readOnly={AddPriscribtion.FrequencyMethod === "Regular"}
                  onChange={handleInputChange}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Date <span>:</span>
                </label>
                <input
                  name="Date"
                  type="date"
                  value={AddPriscribtion.Date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Time <span>:</span>
                </label>
                <input
                  name="Time"
                  type="time"
                  value={AddPriscribtion.Time}
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
                    disabled={AddPriscribtion.Prescribedby === "SOS"}
                    value={AddPriscribtion.Prescribedby}
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
                  placeholder="Enter Instructions here ..."
                  value={AddPriscribtion.Instruction}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <br />
            <div className="Main_container_Btn">
              <button
                className=""
                onClick={isEdit ? handleupdate : handlesubmitdata}
              >
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
            {summa.length > 0 && (
              <>
                <div className="RegisFormcon_1 jjxjx_">
                  <ReactGrid columns={dynamicColumns} RowData={summa} />
                </div>
                <div className="Main_container_Btn">
                  <button onClick={submitalldata}>Submit</button>
                </div>
              </>
            )}
          </>
        )}
        <div className="RegisFormcon_1 jjxjx_">
          {type === "Output" && (
            <ReactGrid
              columns={dynamicColumns1()}
              RowData={summa1?.medicinedata}
            />
          )}
        </div>
        <ToastAlert Message={toast.message} Type={toast.type} />
        <ToastContainer />
        <CancelDrugDialog
          open={OpenDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleCancelAppointment}
          setcancelsenddata={setcancelsenddata}
          cancelsenddata={cancelsenddata}
        />
      </div>
    </>
  );
};

export default Prescription;