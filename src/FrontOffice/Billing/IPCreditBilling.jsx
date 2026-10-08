// import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
// import debounce from "lodash.debounce";
// import {
//   differenceInYears,
//   format,
//   startOfYear,
//   subYears,
//   isBefore,
// } from "date-fns";

// // import Chirayuulogo from "../../Assets/Chirayuulogo.png";
// import axios from "axios";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import "../../App.css";
// import { handleKeyDownPhoneNo } from "../../OtherComponent/OtherFunctions";
// import { handleKeyDownTextRegistration } from "../../OtherComponent/OtherFunctions";
// import { useReactToPrint } from "react-to-print";
// import { NumberToWords } from "../../OtherComponent/OtherFunctions";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditNoteIcon from "@mui/icons-material/EditNote";

// const IPCreditBilling = () => {


//     const dispatchvalue = useDispatch();
//       const navigate = useNavigate();
    
//       const abortControllerRef = useRef(null);
    
    
//       const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
//       const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
    
//       const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//       const UserData = useSelector((state) => state.userRecord?.UserData);

//        const toast = useSelector((state) => state.userRecord?.toast);
//         const [errors, setErrors] = useState({});
      
//         const IP_BillingData = useSelector(
//           (state) => state.Frontoffice?.IPBillingData
//         );

//     console.log('IP_BillingData',IP_BillingData)

//     const componentRef = useRef();
//       const currentDate = new Date();
//       const Formdate = format(currentDate, "yyyy-MM-dd");
//       const FormTime = format(currentDate, "hh:mm:ss a");

//     const [ClinicDetials, setClinicDetials] = useState({
//         Clogo: ClinicDetails?.Clogo,
//         Cname: ClinicDetails?.Cname,
//         ClinicGST: "",
//         ClinicAddress: "",
//         ClinicCity: "",
//         ClinicState: "",
//         ClinicCode: "",
//         ClinicMobileNo: "",
//         ClinicLandLineNo: "",
//         ClinicMailID: "",
//       });
    
//       useEffect(() => {
//         axios
//           .get(`${UrlLink}Masters/Clinic_Detials_link`)
//           .then((response) => {
//             const clinicData = response.data[0];
    
//             if (clinicData) {
//               const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(
//                 (component) => component
//               );
    
//               setClinicDetials((prev) => ({
//                 ...prev,
//                 ClinicAddress: addressComponents.join(", "),
//                 ClinicGST: clinicData.GSTNo || prev.ClinicGST,
//                 ClinicCity: clinicData.City || prev.ClinicCity,
//                 ClinicState: clinicData.State || prev.ClinicState,
//                 ClinicCode: clinicData.Pincode || prev.ClinicCode,
//                 ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
//                 ClinicLandLineNo: clinicData.LandlineNo || prev.ClinicLandLineNo,
//                 ClinicMailID: clinicData.Mail || prev.ClinicMailID,
//               }));
//               // if (clinicData.Clinic_Logo) {
//               //   setClinic_Logo(`data:image/png;base64,${clinicData.Clinic_Logo}`);
//               // }
//             }
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//       }, [UserData?.location, UrlLink]);

//     const blockInvalidChar = (e) =>
//     ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

//       const [discountMasterData, setDiscountMasterData] = useState([]);
//         const [AppointmentRegisType, setAppointmentRegisType] = useState("IP");
      
//         const [InsuranceAmount, setInsuranceAmount] = useState([]);
//         const [ClientAmount, setClientAmount] = useState([]);
      
//         const [InsuranceBalance, setInsuranceBalance] = useState("");
    
// const [isEdit, setIsEdit] = useState(null);
//   const [Remarks, setRemarks] = useState('')

//   const [isSubmitting, setIsSubmitting] = useState(false);

  

//     const handleEdit = (index) => {
//     const item = billAmount[index];

//     if (item.Billpay_method === "Advance") {
//       let Remove = billAmount.filter((ele) => ele.Billpay_method !== "Advance");
//       setBillAmount(Remove);
//     } else {
//       setIsEdit(index);
//       const item = billAmount[index];
//       setFormAmount({
//         ...item,
//       });
//     }
//   };

//   const handleSaveSubmit = (
//     isSummary = false,
//     isReimb = false,
//     isNon_Reimb = false
//   ) => {
//     // If already submitting, cancel the current request
//     if (isSubmitting) {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//       // Reset submitting state immediately
//       setIsSubmitting(false);
//       return;
//     }
  
//     // Cancel any ongoing request if it exists
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
  
//     // Create a new AbortController for this request
//     abortControllerRef.current = new AbortController();
//     const signal = abortControllerRef.current.signal;
  
//     let requiredfields1 = ["PatientId", "PatientName", "PhoneNo", "AgeGender"];
//     let missingFields = requiredfields1.filter((field) => !RegisterData[field]);
//     let errorMessages = [];
  
//     // Check for missing required fields
//     if (missingFields.length > 0) {
//       errorMessages.push(
//         `Please fill the required fields: ${missingFields.join(", ")}`
//       );
//     }
  
//     // Check if Item Details are empty
//     if (SelectDatalist.length === 0) {
//       errorMessages.push("Please fill the Item Details.");
//     }
  
//     if (formAmount.Billpay_method !== "") {
//       alert("Please fill the Payment Details");
//       return;
//     }
  
//     // Check if Payment Details are missing
//     if (billAmount.length === 0) {
//       errorMessages.push("Please fill the Payment Details.");
//     }
  
//     // If there are any errors, show them all in one alert
//     if (errorMessages.length > 0) {
//       alert(errorMessages.join("\n"));
//       return; // Exit the function to avoid proceeding further
//     }
  
//     // Set submitting state to true
//     setIsSubmitting(true);
  
//     let senddata = {
//       billAmount: billAmount,
//       SelectedPatient_list: SelectedPatient_list,
//       NetAmount_CDmethod: NetAmount_CDmethod,
//       SelectDatalist: SelectDatalist,
//       BillingData: BillingData,
//       initialState: initialState,
//       Created_by: UserData?.username,
//       Location: UserData?.location,
//       selectedOption: selectedOption,
//       ServiceProcedureForm: ServiceProcedureForm,
//       EditId: IP_BillingData?.id
//         ? IP_BillingData?.Type === "IPEstimated"
//           ? IP_BillingData?.id
//           : ""
//         : "",
//       EditDue:
//         IP_BillingData?.id && IP_BillingData?.Type === "OPDue"
//           ? IP_BillingData?.id
//           : "",
//       Paytype:
//         Paytype.isCash === "Yes"
//           ? "Cash"
//           : Paytype.isCredit === "Yes"
//             ? "Credit"
//             : "Refund",
//       Request_Id: IP_BillingData.Request_Id,
//       RefundAmount: RemainingCredit,
//       AdvanceTotal: AdvanceTotal,
//       ReceivableAmount: IP_BillingData.ReceivableAmount,
//       Remarks: Remarks
//     };
  
//     console.log(senddata, 'senddataaaa')
  
//     if (Object.keys(IP_BillingData).length !== 0) {
//       axios
//         .post(`${UrlLink}Frontoffice/IPBillingFinal_Link`, senddata, { signal })
//         .then((res) => {
//           // Clear the abort controller on successful completion
//           abortControllerRef.current = null;
//           setIsSubmitting(true);
          
//           console.log(res.data);
//           setPostInvoice(res.data.InvoiceNo);
//           setRecieptInvoice(res.data.ReceiptNo);
//           setPostInvoiceDate(res.data.InvoiceDate);
//           setSubmitBut(true);
  
//           const messageType = res.data.status;
//           const messageContent = res.data.message;
  
//           dispatchvalue({
//             type: "toast",
//             value: { message: messageContent, type: messageType },
//           });
//           // setIsPrintButtonVisible(false);
  
//           // // Handle print options
//           // if (isSummary) {
//           //   setisPrintSummary(true);
//           // } else if (isReimb) {
//           //   setprintoption("PrintReimbursable");
//           // } else if (isNon_Reimb) {
//           //   setprintoption("PrintNon-Reimbursable");
//           // }
//         })
//         .catch((err) => {
//           // Clear the abort controller on error (unless it's an abort error)
//           abortControllerRef.current = null;
//           setIsSubmitting(false);
          
//           if (axios.isCancel(err)) {
//             console.log('Request canceled:', err.message);
//             // Optional: Show cancellation message
//             // dispatchvalue({
//             //   type: "toast",
//             //   value: { message: "Request was cancelled", type: "info" }
//             // });
//           } else {
//             console.log(err);
//             // Handle other errors
//             dispatchvalue({
//               type: "toast",
//               value: { message: "An error occurred while submitting", type: "error" }
//             });
//           }
//         });
//     } else {
//       // Reset state if no data to submit
//       setIsSubmitting(false);
//     }
//   };


//     const handleSubmit = (
//       isDetail = false,
//       isSummary = false,
//       isReimb = false,
//       isNon_Reimb = false,
//       isConsolidate = false
//     ) => {
//       setIsPrintButtonVisible(false);
  
//       if (isDetail) {
//         setprintoption("PrintDetailed");
//       } else if (isConsolidate) {
//         setprintoption("PrintConsolidated");
//       } else if (isSummary) {
//         setprintoption("PrintSummary");
//       } else if (isReimb) {
//         setprintoption("PrintReimbursable");
//       } else if (isNon_Reimb) {
//         setprintoption("PrintNon-Reimbursable");
//       }
//     };

//       const [showPrint, setShowPrint] = useState(false);
//       const [selectedOption, setSelectedOption] = useState("IPDServices");
//         const [ServiceProcedureForm, setServiceProcedureForm] =
//           useState("Consultation");

//     const [Reimbursable, setReimbursable] = useState(false);
//   const handleSaveClose = () => {
//       navigate("/Home/CashierFolder");
//       dispatchvalue({ type: "HrFolder", value: "OutStandingCreditList" });
//       dispatchvalue({ type: "setPreviousFolder", value: null });
//       dispatchvalue({ type: "showMenu", value: true });
//     };

//     const handleCreditSubmit = () => {
//       // If already submitting, cancel the current request
//       if (isSubmitting) {
//         if (abortControllerRef.current) {
//           abortControllerRef.current.abort();
//         }
//         // Reset submitting state immediately
//         setIsSubmitting(false);
//         return;
//       }
    
//       // Cancel any ongoing request if it exists
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
    
//       // Create a new AbortController for this request
//       abortControllerRef.current = new AbortController();
//       const signal = abortControllerRef.current.signal;
    
//       let requiredfields1 = ["PatientId", "PatientName", "PhoneNo", "AgeGender"];
//       let missingFields = requiredfields1.filter((field) => !RegisterData[field]);
//       let errorMessages = [];
    
//       // Check for missing required fields
//       if (missingFields.length > 0) {
//         errorMessages.push(
//           `Please fill the required fields: ${missingFields.join(", ")}`
//         );
//       }
    
//       // Check if Item Details are empty
//       if (SelectDatalist.length === 0) {
//         errorMessages.push("Please fill the Item Details.");
//       }
    
//       // If there are any errors, show them all in one alert
//       if (errorMessages.length > 0) {
//         alert(errorMessages.join("\n"));
//         return; // Exit the function
//       }
      
//       if (billAmount.length === 0 && Paytype.isCash === "Yes") {
//         alert("Please fill the Payment Details");
//         return;
//       }
    
//       if (billAmount.length === 0 && Paytype.isCredit === "Yes") {
//         const userConfirmed = window.confirm(
//           "Do you want to make this bill Due?"
//         );
    
//         if (!userConfirmed) {
//           return; // Stop execution if the user clicks "No"
//         }
//       }
    
//       // Set submitting state to true
//       setIsSubmitting(true);
    
//       let senddata = {
//         billAmount: billAmount,
//         SelectedPatient_list: SelectedPatient_list,
//         NetAmount_CDmethod: NetAmount_CDmethod,
//         SelectDatalist: SelectDatalist,
//         BillingData: BillingData,
//         initialState: initialState,
//         Created_by: UserData?.username,
//         Location: UserData?.location,
//         selectedOption: selectedOption,
//         ServiceProcedureForm: IP_BillingData?.BillingType,
//         Request_Id: IP_BillingData?.Request_Id,
//         EditId: IP_BillingData?.id
//           ? IP_BillingData?.Type === "IPEstimated"
//             ? IP_BillingData?.id
//             : ""
//           : "",
//         EditDue:
//           IP_BillingData?.id && IP_BillingData?.Type === "OPDue"
//             ? IP_BillingData?.id
//             : "",
//         Paytype:
//           Paytype.isCash === "Yes"
//             ? "Cash"
//             : Paytype.isCredit === "Yes"
//               ? "Credit"
//               : "Refund",
//         Remarks: Remarks
//       };
    
//       if (Object.keys(IP_BillingData).length !== 0) {
//         axios
//           .post(`${UrlLink}Frontoffice/IPBillingFinal_Link`, senddata, { signal })
//           .then((res) => {
//             // Clear the abort controller on successful completion
//             abortControllerRef.current = null;
//             setIsSubmitting(true);
            
//             setPostInvoice(res.data.InvoiceNo);
//             let typp = Object.keys(res.data)[0];
//             let mess = Object.values(res.data)[0];
//             // Correct way to extract the message and type
//             const tdata = {
//               message: res.data.message || "Successful", // Ensure message exists
//               type: "success", // Explicitly setting type since API returns multiple keys
//             };
//             dispatchvalue({ type: "toast", value: tdata });
//             // navigate("/Home/CashierFolder");
//             // dispatchvalue({ type: "HrFolder", value: "IPBillingList" });
//             // dispatchvalue({ type: "setPreviousFolder", value: null });
//             // dispatchvalue({ type: "showMenu", value: true });
//           })
//           .catch((err) => {
//             // Clear the abort controller on error (unless it's an abort error)
//             abortControllerRef.current = null;
//             setIsSubmitting(false);
            
//             if (axios.isCancel(err)) {
//               console.log('Request canceled:', err.message);
//               // Optional: Show a message that the request was cancelled
//               // dispatchvalue({ 
//               //   type: "toast", 
//               //   value: { message: "Request was cancelled", type: "info" } 
//               // });
//             } else {
//               console.log(err);
//               // Handle other errors here
//               dispatchvalue({
//                 type: "toast",
//                 value: { message: "An error occurred while submitting", type: "error" }
//               });
//             }
//           });
//       } else {
//         // Reset state if no data to submit
//         setIsSubmitting(false);
//       }
//     };

//       const [Pharmadetails, setPharmadetails] = useState([]);
//         const [grandTotal, setGrandTotal] = useState(0);
//         const [loading, setLoading] = useState(false);
//         const [error, setError] = useState("");
//         const [Pharmarefunddetails,setPharmarefunddetails] = useState([]);
//         const [grandrefundTotal, setGrandrefundTotal] = useState(0);
          
      
//         useEffect(() => {
//           if (!IP_BillingData.Registration_Id || !IP_BillingData.PatientId) return; // Skip if IDs are missing
      
//           const fetchPharmacyDetails = async () => {
//             setLoading(true);
//             try {
//               const response = await axios.get(
//                 `${UrlLink}Frontoffice/IPBilling_Pharmacy_credit_get_details`,
//                 {
//                   params: {
//                     Registration_Id: IP_BillingData.Registration_Id,
//                     PatientId: IP_BillingData.PatientId,
//                   },
//                 }
//               );
      
//               setPharmadetails(response.data.pharmacy_list || []);
//               setGrandTotal(response.data.grand_total || 0);
//               setPharmarefunddetails(response.data.refund_list || []);
//               setGrandrefundTotal(response.data.total_refunded || 0);
//               setError("");
//             } catch (err) {
//               setError(err.response?.data?.error || "Something went wrong");
//               setPharmadetails([]);
//               setGrandTotal(0);
//             } finally {
//               setLoading(false);
//             }
//           };
      
//           fetchPharmacyDetails();
//         }, [IP_BillingData.Registration_Id, IP_BillingData.PatientId]);

//      const [SelectedPatient_list, setSelectedPatient_list] = useState({
//         PatientId: "",
//         PatientName: "",
//         PhoneNumber: "",
//         PatientCategory: "General",
//         PatientCategoryType: "",
//         InsuranceName: "",
//         Gender: "",
//         City: "",
//         State: "",
//         PatientAddress: "",
//         Pincode: "",
//         VisitId: "",
//         WardBedNo: "",
//         DischargeDate: "",
//       });


//       console.log(SelectedPatient_list,'SelectedPatient_list')

//        useEffect(() => {
//   if (!IP_BillingData.IPNo || !IP_BillingData.Patientid) return; // Skip if IDs are missing

//   const fetchPharmacyDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${UrlLink}Frontoffice/IP_Outstanding_Billing_Service_List`,
//         {
//           params: {
//             QueueList_ID: IP_BillingData.IPNo,
//             PatientId: IP_BillingData.Patientid,
//           },
//         }
//       );

//       const billing = response.data?.Billing_data || {};

//       setSelectedPatient_list({
//         id: billing.id || "",
//         Billing_Type: billing.Billing_Type || "",
//         Status: billing.Status || "",
//         Date: billing.Date || "",
//         Registration_Id: billing.Registration_Id || "",
//         PatientId: billing.PatientId || "",
//         PhoneNo: billing.PhoneNo || "",
//         Patient_Name: billing.Patient_Name || "",
//         Gender: billing.Gender || "",
//         DoorNo: billing.DoorNo || "",
//         Age: billing.Age || "",
//         Street: billing.Street || "",
//         Area: billing.Area || "",
//         City: billing.City || "",
//         State: billing.State || "",
//         Country: billing.Country || "",
//         Pincode: billing.Pincode || "",
//         PatientType: billing.PatientType || "",
//         PatientCategory: billing.PatientCategory || "",
//         Doctor_ID: billing.Doctor_ID || "",
//         Doctor_ShortName: billing.Doctor_ShortName || "",
//         WardName: billing.WardName || "",
//         ROOMNo: billing.ROOMNo || "",
//         BedNo: billing.BedNo || "",
//       });

//     } catch (err) {
//       console.error("Error fetching IP Billing details:", err);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchPharmacyDetails();
// }, [IP_BillingData.Registration_Id, IP_BillingData.PatientId]);


//       const [PostInvoice, setPostInvoice] = useState(null);
//         const [RecieptInvoice, setRecieptInvoice] = useState(null);
//         const [PostInvoicedate, setPostInvoiceDate] = useState(null);
//         const [submitBut, setSubmitBut] = useState(false);
//         const [BillingData, setBillingData] = useState({
//           InvoiceNo: "",
//           InvoiceDate: Formdate,
//           InvoiceTime: FormTime,
//           DoctorName: "",
//           DoctorId: "",
//           Billedby: UserData?.username || "",
//         });
//         const [SelectDatalist, setSelectDatalist] = useState([]);

//     const [initialState, setinitialState] = useState({
//         totalItems: 0,
//         totalTaxable: 0,
//         totalAmount: 0,
//         totalDiscount: 0,
//         totalGstamount: 0,
//         totalUnits: 0,
//         totalNetAmount: 0,
//         PaidAmount: 0,
//         BalanceAmount: 0,
//         Roundoff: 0,
//         ReimbursableAmount: 0,
//         totalAmountt: 0,
//         Finalnetamt: 0
//       });


//     const [billAmount, setBillAmount] = useState([]);
//       const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);

//     const [NetAmount_CDmethod, setNetAmount_CDmethod] = useState({
//         Method: "",
//         Amount: "",
//       });

//      const [formAmount, setFormAmount] = useState({
//         Billpay_method: "",
//         CardType: "",
//         CardNo: "",
//         upiid: "",
//         TransactionId: "",
//         ChequeNo: "",
//         BankName: "",
//         paidamount: "",
//         Additionalamount: "",
//         transactionFee: "",
//       });

//     const [AdvanceAmount, setAdvanceAmount] = useState({
//         isAdvance: "No",
//         AdvanceAmount: "",
//       });
//       const [Paytype, setPaytype] = useState({
//         isCash: "Yes",
//         isCredit: "No",
//         isRefund: "No",
//       });

//       console.log(Paytype,'Paytypeeeee')



//     const [PaymentMode, setPaymentMode] = useState("");
    
//       const [AdvanceAmountGet, setAdvanceAmountGet] = useState([]);
//       const [AdvanceTotal, setAdvanceTotal] = useState([]);
//       const [RemainingCredit, setRemainingCredit] = useState([]);
//         const [totalPaidAmount, settotalPaidAmount] = useState(0);
      

//     const [printoption, setprintoption] = useState("PrintSummary");
    
//       const [RegisterData, setRegisterData] = useState({
//         PatientId: "",
//         ABHA: "",
//         PatientName: "",
//         AgeGender: "",
//         PhoneNo: "",
//         PatientCategory: "",
//         PatientCategoryName: "",
//         WardName: "",
//         Address: "",
//       });

//     // useEffect(() => {
//     //     console.log("effect----------705");
    
//     //     const totalPaidAmount = billAmount
//     //       .filter((_, indx) => indx !== isEdit)
//     //       .reduce((total, ele) => +total + +ele.paidamount, 0);
//     //     settotalPaidAmount(totalPaidAmount);
    
//     //     const totalPaidAddAmount = billAmount
//     //       .filter((_, indx) => indx !== isEdit)
//     //       .reduce(
//     //         (total, ele) => +total + +ele.paidamount + (+ele.Additionalamount || 0),
//     //         0
//     //       );
    
//     //     const totalAdditionalAmount = billAmount
//     //       .filter((_, indx) => indx !== isEdit)
//     //       .reduce((total, ele) => +total + +ele.Additionalamount, 0);
    
//     //     const totalTransactionFee = billAmount
//     //       .filter((_, indx) => indx !== isEdit)
//     //       .reduce((total, ele) => +total + +ele.transactionFee || 0, 0); // Use `|| 0` to handle empty or undefined values.
//     //     // Calculate the total transaction fee (as an absolute amount, not percentage)
//     //     const totalTransactionAmount = billAmount
//     //       .filter((_, indx) => indx !== isEdit)
//     //       .reduce(
//     //         (total, ele) =>
//     //           total +
//     //           ((+ele.paidamount + +ele.Additionalamount) *
//     //             (+ele.transactionFee || 0)) /
//     //           100, // Apply transaction fee proportionally
//     //         0
//     //       );
    
//     //     const totalAmmm = totalPaidAddAmount + totalTransactionAmount;
    
//     //     settotalPaidAmount(totalPaidAmount);
//     //     setinitialState((prev) => ({
//     //       ...prev,
//     //       totalAmountt: totalAmmm.toFixed(2),
//     //       BalanceAmount: prev.BalanceAmount - totalPaidAddAmount,
//     //       PaidAmount: totalPaidAmount.toFixed(2),
//     //       Additionalamount: totalAdditionalAmount.toFixed(2),
//     //       transactionfee: `${totalTransactionFee}%`,
//     //     }));
//     //   }, [billAmount, billAmount.length, isEdit]);

//     useEffect(() => {
//         axios
//           .get(
//             `${UrlLink}Frontoffice/IP_AdvanceAmount_collection?RegistrationId=${IP_BillingData?.Registration_Id
//             }&Type=${"IP"}`
//           )
//           .then((ress) => {
//             const res = ress?.data;
//             console.log("advvvvv", res);
//             setAdvanceAmountGet(res?.AdvanceDetails);
//             setAdvanceTotal(res?.TotalAdvanceAmount);
//             setRemainingCredit(res?.RemainingCredit);
//           })
//           .catch((e) => console.log(e));
//       }, [UrlLink, AdvanceAmount.isAdvance, IP_BillingData]);

//     const handlePayType = (e) => {
//     const { name } = e.target;
 
//     setPaytype((prev) => {
//       if (name === "isCash" && Math.abs(initialState.Finalnetamt) > 0) {
//         return { isCash: "Yes", isCredit: "No", isRefund: "No" };
//       } else if (name === "isRefund" && initialState.FinalRefundamt > 0) {
//         return { isCash: "No", isCredit: "No", isRefund: "Yes" };
//       } else if (name === "isCredit") {
//         return { isCash: "No", isCredit: "Yes", isRefund: "No" };
//       }
 
//       return prev;
//     });
 
//     setFormAmount({
//       Billpay_method: "",
//       CardType: "",
//       CardNo: "",
//       upiid: "",
//       TransactionId: "",
//       ChequeNo: "",
//       BankName: "",
//       paidamount: "",
//       Additionalamount: "",
//       transactionFee: "",
//     });
 
//     setBillAmount([]);
//   };


//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // ✅ Allow free typing for all fields (including paidamount)
//     if (name === "TransactionId") {
//       setFormAmount((prevState) => ({
//         ...prevState,
//         [name]: value.toUpperCase(),
//       }));
//     } else {
//       setFormAmount((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     }
//   };


//   const handleAdd = () => {
//     let req = [];
//     // if (formAmount.Billpay_method === "Card") {
//     //   req = ["Billpay_method", "CardType", "paidamount"];
//     // } else if (formAmount.Billpay_method === "Cheque") {
//     //   req = ["Billpay_method", "ChequeNo", "BankName", "paidamount"];
//     // } else if (formAmount.Billpay_method === "OnlinePayment") {
//     //   req = ["Billpay_method", "paidamount"];
//     // } else {
//     req = ["Billpay_method", "paidamount"];
//     // }
//     const missing = req.filter((row) => !formAmount[row]);
//     if (missing.length === 0) {
//       const exist = billAmount.find(
//         (p) => p.Billpay_method === formAmount.Billpay_method
//       );
//       if (!exist) {
//         setBillAmount((prev) => [...prev, formAmount]);
//         setFormAmount({
//           Billpay_method: "",
//           CardType: "",
//           ChequeNo: "",
//           BankName: "",
//           paidamount: "",
//           Additionalamount: "",
//           transactionFee: "",
//         });
//       } else {
//         alert("The Payment Method already exist");
//       }
//     } else {
//       alert(`enter the required fields : ${missing.join(",")}`);
//     }
//   };

//   const handleUpdate = () => {
//     let req = [];
//     // if (formAmount.Billpay_method === "Card") {
//     //   req = ["Billpay_method", "CardType", "paidamount"];
//     // } else if (formAmount.Billpay_method === "Cheque") {
//     //   req = ["Billpay_method", "ChequeNo", "BankName", "paidamount"];
//     // } else if (formAmount.Billpay_method === "OnlinePayment") {
//     //   req = ["Billpay_method", "paidamount"];
//     // } else {
//     req = ["Billpay_method", "paidamount"];
//     // }
//     const missing = req.filter((row) => !formAmount[row]);
//     if (missing.length === 0) {
//       const data = [...billAmount];

//       setBillAmount(data);
//       setFormAmount({
//         Billpay_method: "",
//         CardType: "",
//         ChequeNo: "",
//         BankName: "",
//         paidamount: "",
//         Additionalamount: "",
//         transactionFee: "",
//       });
//     } else {
//       alert(`enter the required fields : ${missing.join(",")}`);
//     }
//   };


//   useEffect(() => {
//       axios
//         .get(`${UrlLink}Masters/PaymentMode_Master_link`)
//         .then((res) => {
//           const ress = res.data;
  
//           setPaymentMode(ress);
//         })
//         .catch((e) => {
//           console.log(e);
//         });
//     }, [UrlLink]);

//     const ForPrintData = () => {
//         const hasCard = billAmount.some((p) => p.Billpay_method === "Card");
//         const hasCheque = billAmount.some((p) => p.Billpay_method === "Cheque");
//         const hasBank = billAmount.some((p) => p.Billpay_method === "Bank");
    
//         // Function to convert time to AM/PM format
//         const formatTimeToAMPM = (timeString) => {
//           if (!timeString) return "-";
    
//           try {
//             const [hours, minutes] = timeString.split(":");
//             const h = parseInt(hours, 10);
//             const period = h >= 12 ? "PM" : "AM";
//             const h12 = h % 12 || 12;
//             return `${h12}:${minutes} ${period}`;
//           } catch (error) {
//             return timeString;
//           }
//         };
    
//         return (
//           <div ref={componentRef}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 minHeight: "100vh",
//               }}
//               id="reactprintcontent"
//             >
//               <table className="print-table33">
//                 <thead
//                   className="print_header"
//                   style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     height: "150px",
//                   }}
//                 >
//                   <tr>
//                     <td colSpan="8" style={{ border: "none" }}>
//                       <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
//                         <div className="new_billing_logo_con">
//                           <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
//                         </div>
//                         <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
//                           <span>{ClinicDetails?.Cname}</span>
//                           <div>
//                             <span>
//                               {[ClinicDetials?.ClinicAddress]
//                                 .filter((detail) => detail)
//                                 .join(", ")}
//                               ,
//                               {[
//                                 ClinicDetials?.ClinicCity,
//                                 ClinicDetials?.ClinicState,
//                                 ClinicDetials?.ClinicCode,
//                               ]
//                                 .filter((detail) => detail)
//                                 .join(", ")}
//                             </span>
//                           </div>
//                           <div>
//                             {[
//                               ClinicDetials?.ClinicMobileNo,
//                               ClinicDetials?.ClinicLandLineNo,
//                               ClinicDetials?.ClinicMailID,
//                             ]
//                               .filter((detail) => detail)
//                               .join(" , ")}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       colSpan="8"
//                       style={{
//                         textAlign: "center",
//                         fontWeight: "600",
//                         color: "black",
//                         fontSize: "18px",
//                       }}
//                     >
//                       Detailed Invoice
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="8">
//                       <div className="new_billing_address new_addn_p037">
//                         <div className="new_billing_address_2 new_billing_address_2_new_up">
//                           <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                             <label>
//                               Patient Name <span>:</span>
//                             </label>
//                             <h4>{SelectedPatient_list.Patient_Name}</h4>
//                           </div>
//                           <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                             <label>
//                               Patient ID <span>:</span>
//                             </label>
//                             <h4>{SelectedPatient_list.PatientId}</h4>
//                           </div>
//                           <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                             <label>
//                               Age / Gender <span>:</span>
//                             </label>
//                             <h4>{IP_BillingData.Age}/{IP_BillingData.Gender}</h4>
//                           </div>
//                           <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                             <label>
//                               D.O.A <span>:</span>
//                             </label>
//                             <h4>{IP_BillingData.AdmittionDate}</h4>
//                           </div>
//                           <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                             <label>
//                               Address <span>:</span>
//                             </label>
//                             <h4>{IP_BillingData.Address}</h4>
//                           </div>
//                           <div className="new_billing_div phrmy_newbilg  wdwdwswdw">
//                             <label>
//                               Mobile No <span>:</span>
//                             </label>
//                             <h4>{SelectedPatient_list.PhoneNo}</h4>
//                           </div>
    
//                           <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                             <label>Consultant <span>:</span></label>
//                             <h4>Dr.{IP_BillingData.Doctor_ShortName}</h4>
//                           </div>
//                         </div>
//                         <div className="new_billing_address_2 new_billing_address_2_new_up">
//                           <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                             <label>
//                               IP NO <span>:</span>
//                             </label>
//                             <h4>{SelectedPatient_list.Registration_Id}</h4>
//                           </div>
//                           <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                             <label>
//                               Ward - Bed No <span>:</span>
//                             </label>
//                             <h4>{SelectedPatient_list.WardName}</h4>
//                           </div>
    
//                           <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                             <label>
//                               Invoice No<span>:</span>
//                             </label>
//                             <h4>{PostInvoice}</h4>
//                           </div>
//                           <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                             <label>
//                               Invoice Date <span>:</span>
//                             </label>
//                             <h4>{PostInvoicedate}</h4>
//                           </div>
//                           <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                             <label>
//                               Payer Type <span>:</span>
//                             </label>
//                             <h4>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
//                           </div>
//                           {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                                                 <label>Invoice No<span>:</span></label>
//                                                 <h4>{PostInvoice}</h4>
//                                             </div>
//                                             <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                                                 <label>Invoice Date<span>:</span></label>
//                                                 <h4>{PostInvoicedate}</h4>
//                                             </div> */}
//                           <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                             <label>
//                               Discharge Date <span>:</span>
//                             </label>
//                             <h4>{PostInvoicedate}</h4>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 </thead>
    
//                 {/* <tbody>
//                   <tr>
//                     <td colSpan="8" className="prin_nnrmll_table">
//                       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                         <thead>
//                           <tr
//                             style={{
//                               borderTop: "1.5px solid black",
//                               borderBottom: "1.5px solid black",
//                               backgroundColor: "#f5f5f5",
//                             }}
//                           >
//                             <th
//                               style={{ padding: "8px", border: "1px solid #ddd" }}
//                             >
//                               S.No
//                             </th>
//                             <th
//                               style={{ padding: "8px", border: "1px solid #ddd" }}
//                             >
//                               Service Name
//                             </th>
//                             <th
//                               style={{ padding: "8px", border: "1px solid #ddd" }}
//                             >
//                               Credit No
//                             </th>
//                             <th
//                               style={{ padding: "8px", border: "1px solid #ddd" }}
//                             >
//                               Charge
//                             </th>
//                             <th
//                               style={{ padding: "8px", border: "1px solid #ddd" }}
//                             >
//                               Qty
//                             </th>
    
//                             <th
//                               style={{ padding: "8px", border: "1px solid #ddd" }}
//                             >
//                               Amount
//                             </th>
//                             <th
//                               style={{ padding: "8px", border: "1px solid #ddd" }}
//                             >
//                               Discount
//                             </th>
//                             <th
//                               style={{ padding: "8px", border: "1px solid #ddd" }}
//                             >
//                               Net Amount
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody style={{ borderBottom: "1.5px solid black" }}>
//                           {SelectDatalist.map((row, index) => (
//                             <tr key={index}>
//                               <td
//                                 style={{
//                                   padding: "8px",
//                                   border: "1px solid #ddd",
//                                   textAlign: "center",
//                                 }}
//                               >
//                                 {index + 1}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "8px",
//                                   border: "1px solid #ddd",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {row.SelectItemName || "-"}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "8px",
//                                   border: "1px solid #ddd",
//                                   textAlign: "center",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {row.VoucherNo || "-"}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "8px",
//                                   border: "1px solid #ddd",
//                                   textAlign: "right",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {row.Charges || "0.00"}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "8px",
//                                   border: "1px solid #ddd",
//                                   textAlign: "center",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {row.Quantity || "1"}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "8px",
//                                   border: "1px solid #ddd",
//                                   textAlign: "right",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {row.Amount || "0.00"}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "8px",
//                                   border: "1px solid #ddd",
//                                   textAlign: "right",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {row.Discount || "0.00"}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "8px",
//                                   border: "1px solid #ddd",
//                                   textAlign: "right",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {row.NetAmount}
//                               </td>
//                             </tr>
//                           ))}
//                           <tr
//                             style={{
//                               borderTop: "1px solid grey",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             <td
//                               colSpan="5"
//                               style={{
//                                 padding: "8px",
//                                 border: "1px solid #ddd",
//                                 textAlign: "right",
//                               }}
//                             >
//                               Total
//                             </td>
//                             <td
//                               style={{
//                                 padding: "8px",
//                                 border: "1px solid #ddd",
//                                 textAlign: "right",
//                               }}
//                             >
//                               {SelectDatalist.reduce(
//                                 (sum, row) => sum + parseFloat(row.Amount || 0),
//                                 0
//                               ).toFixed(2)}
//                             </td>
//                             <td
//                               style={{
//                                 padding: "8px",
//                                 border: "1px solid #ddd",
//                                 textAlign: "right",
//                               }}
//                             >
//                               {SelectDatalist.reduce(
//                                 (sum, row) => sum + parseFloat(row.Discount || 0),
//                                 0
//                               ).toFixed(2)}
//                             </td>
//                             <td
//                               style={{
//                                 padding: "8px",
//                                 border: "1px solid #ddd",
//                                 textAlign: "right",
//                               }}
//                             >
//                               {SelectDatalist.reduce(
//                                 (sum, row) => sum + parseFloat(row.NetAmount || 0),
//                                 0
//                               ).toFixed(2)}
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 </tbody> */}
    
//                 <tr>
//                   <td colSpan="8">
//                     <div className="new_billing_invoice_detials">
//                       <div
//                         className="invoice_detials_total_1"
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           marginTop: "20px",
//                         }}
//                       >
//                         <div style={{ width: "55%" }}>
    
//    {/* {Pharmadetails.length > 0 && (
//       <div style={{ marginBottom: "20px" }}>
        
//         <h4 style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
//           Pharmacy Items
//         </h4>
//         <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f5f5f5" }}>
//               <th style={{ padding: "8px", border: "1px solid #ddd" }}>S.No</th>
//               <th style={{ padding: "8px", border: "1px solid #ddd" }}>INV.No</th>
//               <th style={{ padding: "8px", border: "1px solid #ddd" }}>Date</th>
//               <th style={{ padding: "8px", border: "1px solid #ddd" }}>Item Name</th>
//               <th style={{ padding: "8px", border: "1px solid #ddd" }}>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Pharmadetails.map((item, index) => (
//               <tr key={index}>
//                 <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
//                 <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{item.Billing_Invoice_No || "-"}</td>
//                 <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Billing_Date || "-"}</td>
//                 <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Billing_Type || "-"}</td>
//                 <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
//                   ₹{(parseFloat(item.Net_Amount) || 0).toFixed(2)}
//                 </td>
//               </tr>
//             ))}
            
//             <tr style={{ fontWeight: "bold", borderTop: "1px solid grey" }}>
//               <td colSpan={4} style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
//                 Total Medicines
//               </td>
//               <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
//                 ₹{(parseFloat(grandTotal) || 0).toFixed(2)}
//               </td>
//             </tr>
//           </tbody>
//         </table>
    
        
//         {Pharmarefunddetails.length > 0 && (
//           <div style={{ marginTop: "20px", marginBottom: "20px" }}>
//             <h4 style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
//               Refund Details
//             </h4>
//             <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#f5f5f5" }}>
//                   <th style={{ padding: "8px", border: "1px solid #ddd" }}>S.No</th>
//                   <th style={{ padding: "8px", border: "1px solid #ddd" }}>Voucher No</th>
//                   <th style={{ padding: "8px", border: "1px solid #ddd" }}>Date</th>
//                   <th style={{ padding: "8px", border: "1px solid #ddd" }}>Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {Pharmarefunddetails.map((item, index) => (
//                   <tr key={index}>
//                     <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{item.Voucher_Number || "-"}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Billing_Date || "-"}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
//                       ₹{(parseFloat(item.PaidAmount) || 0).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//                 <tr style={{ fontWeight: "bold", borderTop: "1px solid grey" }}>
//                   <td colSpan={3} style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
//                     Refund Medicines
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
//                     ₹{(parseFloat(grandrefundTotal) || 0).toFixed(2)}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         )}
    
       
//         <div style={{ marginTop: "20px", fontWeight: "bold", textAlign: "right" }}>
//           <div style={{ marginBottom: "5px" }}>
//             Total Medicines: ₹{(parseFloat(grandTotal) || 0).toFixed(2)}
//           </div>
//           <div style={{ marginBottom: "5px" }}>
//             Refund Medicines: ₹{(parseFloat(grandrefundTotal) || 0).toFixed(2)}
//           </div>
//           <div style={{ borderTop: "1px solid #ddd", paddingTop: "5px" }}>
//             Final Amount: ₹{(parseFloat(grandTotal - grandrefundTotal) || 0).toFixed(2)}
//           </div>
//         </div>
//       </div>
//     )} */}
    
    
//                           {/* {AdvanceAmountGet.length > 0 && (
//                             <div>
//                               <h4
//                                 style={{
//                                   marginBottom: "10px",
//                                   borderBottom: "1px solid #ddd",
//                                   paddingBottom: "5px",
//                                 }}
//                               >
//                                 Advance Amount
//                               </h4>
//                               <table
//                                 className="print-table33"
//                                 style={{
//                                   width: "100%",
//                                   borderCollapse: "collapse",
//                                 }}
//                               >
//                                 <thead>
//                                   <tr style={{ backgroundColor: "#f5f5f5" }}>
//                                     <th
//                                       style={{
//                                         padding: "8px",
//                                         border: "1px solid #ddd",
//                                       }}
//                                     >
//                                       S.No
//                                     </th>
//                                     <th
//                                       style={{
//                                         padding: "8px",
//                                         border: "1px solid #ddd",
//                                       }}
//                                     >
//                                       Date
//                                     </th>
//                                     <th
//                                       style={{
//                                         padding: "8px",
//                                         border: "1px solid #ddd",
//                                       }}
//                                     >
//                                       Time
//                                     </th>
//                                     <th
//                                       style={{
//                                         padding: "8px",
//                                         border: "1px solid #ddd",
//                                       }}
//                                     >
//                                       Amount
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {AdvanceAmountGet.map((row, index) => (
//                                     <tr key={index}>
//                                       <td
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                           textAlign: "center",
//                                         }}
//                                       >
//                                         {index + 1}
//                                       </td>
//                                       <td
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                         }}
//                                       >
//                                         {row.Date || "-"}
//                                       </td>
//                                       <td
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                           textAlign: "center",
//                                         }}
//                                       >
//                                         {formatTimeToAMPM(row.Time) || "-"}
//                                       </td>
//                                       <td
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                           textAlign: "right",
//                                         }}
//                                       >
//                                         {row.AdvanceAmount || "-"}
//                                       </td>
//                                     </tr>
//                                   ))}
//                                   <tr style={{ fontWeight: "bold" }}>
//                                     <td
//                                       colSpan="3"
//                                       style={{
//                                         padding: "8px",
//                                         border: "1px solid #ddd",
//                                         textAlign: "right",
//                                       }}
//                                     >
//                                       Total Advance
//                                     </td>
//                                     <td
//                                       style={{
//                                         padding: "8px",
//                                         border: "1px solid #ddd",
//                                         textAlign: "right",
//                                       }}
//                                     >
//                                       {AdvanceAmountGet.reduce(
//                                         (sum, row) =>
//                                           sum + parseFloat(row.AdvanceAmount || 0),
//                                         0
//                                       ).toFixed(2)}
//                                     </td>
//                                   </tr>
//                                 </tbody>
//                               </table>
//                             </div>
//                           )} */}
    
//                           {billAmount.length > 0 && (
//                             <div style={{ marginBottom: "20px" }}>
//                               <h4
//                                 style={{
//                                   marginBottom: "10px",
//                                   borderBottom: "1px solid #ddd",
//                                   paddingBottom: "5px",
//                                 }}
//                               >
//                                 Payment Details
//                               </h4>
//                               <table
//                                 className="print-table33"
//                                 style={{
//                                   width: "100%",
//                                   borderCollapse: "collapse",
//                                 }}
//                               >
//                                 <thead>
//                                   <tr style={{ backgroundColor: "#f5f5f5" }}>
//                                     <th
//                                       style={{
//                                         padding: "8px",
//                                         border: "1px solid #ddd",
//                                       }}
//                                     >
//                                       S.No
//                                     </th>
//                                     <th
//                                       style={{
//                                         padding: "8px",
//                                         border: "1px solid #ddd",
//                                       }}
//                                     >
//                                       Payment Type
//                                     </th>
//                                     {hasCard && (
//                                       <th
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                         }}
//                                       >
//                                         Card Type
//                                       </th>
//                                     )}
//                                     {hasCheque && (
//                                       <th
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                         }}
//                                       >
//                                         Cheque No
//                                       </th>
//                                     )}
//                                     {hasBank && (
//                                       <th
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                         }}
//                                       >
//                                         Bank Name
//                                       </th>
//                                     )}
//                                     <th
//                                       style={{
//                                         padding: "8px",
//                                         border: "1px solid #ddd",
//                                       }}
//                                     >
//                                       Amount
//                                     </th>
//                                     {hasCard && (
//                                       <th
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                         }}
//                                       >
//                                         Transaction Fee
//                                       </th>
//                                     )}
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {billAmount.map((row, index) => (
//                                     <tr key={index}>
//                                       <td
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                           textAlign: "center",
//                                         }}
//                                       >
//                                         {index + 1}
//                                       </td>
//                                       <td
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                         }}
//                                       >
//                                         {row.Billpay_method || "-"}
//                                       </td>
//                                       {hasCard && (
//                                         <td
//                                           style={{
//                                             padding: "8px",
//                                             border: "1px solid #ddd",
//                                           }}
//                                         >
//                                           {row.Billpay_method === "Card"
//                                             ? row.CardType || "-"
//                                             : "-"}
//                                         </td>
//                                       )}
//                                       {hasCheque && (
//                                         <td
//                                           style={{
//                                             padding: "8px",
//                                             border: "1px solid #ddd",
//                                             textAlign: "center",
//                                           }}
//                                         >
//                                           {row.Billpay_method === "Cheque"
//                                             ? row.ChequeNo || "-"
//                                             : "-"}
//                                         </td>
//                                       )}
//                                       {hasBank && (
//                                         <td
//                                           style={{
//                                             padding: "8px",
//                                             border: "1px solid #ddd",
//                                           }}
//                                         >
//                                           {row.Billpay_method === "Bank"
//                                             ? row.BankName || "-"
//                                             : "-"}
//                                         </td>
//                                       )}
//                                       <td
//                                         style={{
//                                           padding: "8px",
//                                           border: "1px solid #ddd",
//                                           textAlign: "right",
//                                         }}
//                                       >
//                                         {row.paidamount || "-"}
//                                       </td>
//                                       {hasCard && (
//                                         <td
//                                           style={{
//                                             padding: "8px",
//                                             border: "1px solid #ddd",
//                                             textAlign: "center",
//                                           }}
//                                         >
//                                           {row.Billpay_method === "Card" &&
//                                             row.transactionFee
//                                             ? `${parseInt(row.transactionFee)}%`
//                                             : "-"}
//                                         </td>
//                                       )}
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                           )}
    
    
    
//                           <div style={{ marginTop: "20px" }}>
//                             <div style={{ marginBottom: "10px", display: "flex", gap: "3px" }}>
//                               <label style={{ fontWeight: "bold" }}>
//                                 Amount In Words:{" "}
//                               </label>
//                               <span>
//                                 {NumberToWords(+initialState.totalNetAmount)}
//                               </span>
//                             </div>
//                             <div style={{ display: "flex", gap: "5px" }}>
//                               <label style={{ fontWeight: "bold" }}>
//                                 Billed By:{" "}
//                               </label>
//                               <span>{BillingData.Billedby}</span>
//                             </div>
//                           </div>
//                         </div>
    
//                         <div
//                           style={{
//                             width: "40%",
//                             border: "1px solid #ddd",
//                             padding: "15px",
//                             borderRadius: "5px",
//                           }}
//                         >
//                           <h4
//                             style={{
//                               marginBottom: "15px",
//                               borderBottom: "1px solid #ddd",
//                               paddingBottom: "5px",
//                             }}
//                           >
//                             Summary
//                           </h4>
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               marginBottom: "8px",
//                             }}
//                           >
//                             <span style={{ fontWeight: "bold" }}>Total Net Amount:</span>
//                             <span style={{ fontWeight: 900, fontSize: "15px" }}>
//                               {IP_BillingData.Net_Amount}
//                             </span>
//                           </div>
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               marginBottom: "2px", borderBottom: "1px solid black ",
//                             }}
//                           >
//                             <span style={{ fontWeight: "bold" }}>
//                               Credit Amount:
//                             </span>
//                             <span style={{ fontWeight: 900, fontSize: "15px" }}>
//                               {IP_BillingData.Balance_Amount}
//                             </span>
//                           </div>
//                           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", borderBottom: "1px solid black ", }}>
//                             <span style={{ fontWeight: "bold" }}>Paid Amount:</span>
//                             <span style={{ fontWeight: 900, fontSize: "15px" }}>{IP_BillingData.Balance_Amount}</span>
//                           </div>
         
    
    
//                           {/* <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               marginBottom: "8px",
//                             }}
//                           >
//                             <span style={{ fontWeight: "bold" }}>
//                               {Math.abs(IP_BillingData.ReceivableAmount) > 0 &&
//                               Paytype.isCash === "Yes"
//                                 ? "Paid Amount:"
//                                 : "Refund Amount:"}
//                             </span>
//                             <span style={{ fontWeight: 900, fontSize: "15px" }}>
//                               {initialState.totalAmountt}
//                             </span>
//                           </div> */}
    
//                           {/* <div
//                             style={{
//                               marginTop: "15px",
//                               borderTop: "1px solid #ddd",
//                               paddingTop: "10px",
//                             }}
//                           >
                            
//                             <div
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 marginBottom: "8px",
//                               }}
//                             >
//                               <span style={{ fontWeight: "bold" }}>
//                                 Total Bill:
//                               </span>
//                               <span style={{ fontWeight: 900, fontSize: "15px" }}>
//                                 {initialState.totalNetAmount}
//                               </span>
//                             </div>
//                             <div
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 marginBottom: "8px",
//                                 borderTop: "1px solid #ddd",
//                                 paddingTop: "8px",
//                                 fontWeight: "bold",
//                               }}
//                             >
//                               <span>
//                                 {Math.abs(IP_BillingData.ReceivableAmount) > 0 &&
//                                 Paytype.isCash === "Yes"
//                                   ? "Paid Amount"
//                                   : "Refund Amount"}
//                               </span>
//                               <span>{initialState.PaidAmount}</span>
//                             </div>
//                           </div> */}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
    
//                 <tfoot className="print_footerr">
//                   <tr>
//                     <td
//                       colSpan="8"
//                       style={{ padding: "20px 0", textAlign: "center" }}
//                     >
//                       <p style={{ fontStyle: "italic", marginTop: "30px" }}>
//                         This page is created automatically without a signature.
//                       </p>
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
    
//             <div className="Register_btn_con added_Register_btn_con">
//               <button
//                 className="RegisterForm_1_btns jwedu6_99"
//                 // onClick={handlePrint2}
//               >
//                 Print
//               </button>
//               <button
//                 className="RegisterForm_1_btns jwedu6_99"
//                 // onClick={handlePrintClose}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         );
//       };


//     const   handleSave = () =>{


//       const Payload = {
//         billAmount : billAmount,
//         IP_BillingData : IP_BillingData,
//         initialState: initialState,
//         BillingData : BillingData,
//         Created_by: UserData?.username,


//       }

//       console.log(Payload,'Payloadddddd')



//       axios.post(`${UrlLink}Frontoffice/Outstanding_Credit_Details_Link`, Payload)
//                   .then((res) => {
//                       const response = res.data;
//                       setPostInvoice(res.data.InvoiceNo);
//                       const messageType = Object.keys(response)[0];
//                       const messageContent = Object.values(response)[0];
//                       dispatchvalue({
//                           type: 'toast',
//                           value: { message: messageContent, type: messageType },
//                       });
                      
//                   })
//                   .catch((err) => {
//                       console.log(err);
//                       dispatchvalue({
//                           type: 'toast',
//                           value: { message: 'An error occurred while saving the discount.', type: 'error' },
//                       });
//                   });

//     }

//      const handleCreditPrintSubmit = () => {
//     setShowPrint(true);
//     setIsPrintButtonVisible(false);
//   };



//  return (
//   <>
//     {isPrintButtonVisible ? (
//       <>
//         <div className="Main_container_app">
//           <h3>Credit Billing</h3>
//           <br />

//           {/* Patient Info Section */}
//           <div className="RegisFormcon_1">
//             <div className="RegisForm_1">
//               <label>Bill Date<span>:</span></label>
//               <input
//                 type="text"
//                 name="DiscountName"
//                 value={IP_BillingData.FBilldate}
//               />
//             </div>

//             <div className="RegisForm_1">
//               <label>Patient Id<span>:</span></label>
//               <input
//                 type="text"
//                 name="DiscountName"
//                 value={IP_BillingData.Patientid}
//               />
//             </div>

//             <div className="RegisForm_1">
//               <label>Patient Name<span>:</span></label>
//               <input
//                 type="text"
//                 name="DiscountName"
//                 value={IP_BillingData.Patientname}
//               />
//             </div>

//             <div className="RegisForm_1">
//               <label>IP No<span>:</span></label>
//               <input
//                 type="text"
//                 name="DiscountName"
//                 value={IP_BillingData.IPNo}
//               />
//             </div>

//             <div className="RegisForm_1">
//               <label>Remarks<span>:</span></label>
//               <input
//                 type="text"
//                 name="DiscountName"
//                 value={IP_BillingData.Remarks}
//               />
//             </div>
//           </div>

//           <br />
//           <h3>Billing Details</h3>

//           <div className="RegisFormcon_1">
//             <div className="RegisForm_1">
//               <label>Total Net Amount<span>:</span></label>
//               <input
//                 type="text"
//                 name="DiscountName"
//                 value={IP_BillingData.Net_Amount}
//               />
//             </div>

//             <div className="RegisForm_1">
//               <label>Credit Amount<span>:</span></label>
//               <input
//                 type="text"
//                 name="DiscountName"
//                 value={IP_BillingData.Balance_Amount}
//               />
//             </div>
//           </div>

//           <br />
//           <h3>Payment Details</h3>

//           {Paytype.isCash === "Yes" && (
//   <>
//       {/* Payment Method */}
//       <div className="RegisFormcon_1">
//         <div className="RegisForm_1">
//           <label>Payment Method<span>:</span></label>
//           <select
//             name="Billpay_method"
//             value={formAmount.Billpay_method}
//             onChange={handleChange}
//           >
//             <option value="">Select</option>
//             {Array.isArray(PaymentMode) &&
//               PaymentMode.filter((p) => p.status === "Active").map((row, ind) => (
//                 <option key={ind} value={row.GradeName}>
//                   {row.GradeName}
//                 </option>
//               ))}
//           </select>
//         </div>
//       </div>

//       {/* Card Payment Fields */}
//       {formAmount.Billpay_method === "Card" && (
//         <div className="RegisFormcon_1">
//           <div className="RegisForm_1">
//             <label>Card Type<span>:</span></label>
//             <select
//               name="CardType"
//               value={formAmount.CardType}
//               onChange={handleChange}
//             >
//               <option value="">Select</option>
//               {["Debit", "Credit"].map((p, indx) => (
//                 <option key={indx} value={p}>
//                   {p}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="RegisForm_1">
//             <label>Card No<span>:</span></label>
//             <input
//               type="number"
//               onKeyDown={blockInvalidChar}
//               name="CardNo"
//               value={formAmount.CardNo}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>Transaction Id<span>:</span></label>
//             <input
//               type="text"
//               onKeyDown={blockInvalidChar}
//               name="TransactionId"
//               value={formAmount.TransactionId}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>Transaction Fee<span>:</span></label>
//             <input
//               type="number"
//               name="transactionFee"
//               value={formAmount.transactionFee || ""}
//               onChange={handleChange}
//               onKeyDown={blockInvalidChar}
//             />
//           </div>
//         </div>
//       )}

//       {/* Cheque Payment Fields */}
//       {formAmount.Billpay_method === "Cheque" && (
//         <div className="RegisFormcon_1">
//           <div className="RegisForm_1">
//             <label>Cheque No<span>:</span></label>
//             <input
//               type="number"
//               onKeyDown={blockInvalidChar}
//               name="ChequeNo"
//               value={formAmount.ChequeNo}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>Bank Name<span>:</span></label>
//             <input
//               type="text"
//               name="BankName"
//               value={formAmount.BankName}
//               onChange={handleChange}
//             />
//           </div>
//         </div>
//       )}

//       {/* Online Payment Fields */}
//       {formAmount.Billpay_method === "OnlinePayment" && (
//         <div className="RegisFormcon_1">
//           <div className="RegisForm_1">
//             <label>UPI Id<span>:</span></label>
//             <input
//               type="text"
//               onKeyDown={blockInvalidChar}
//               name="upiid"
//               value={formAmount.upiid}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>Transaction Id<span>:</span></label>
//             <input
//               type="text"
//               onKeyDown={blockInvalidChar}
//               name="TransactionId"
//               value={formAmount.TransactionId}
//               onChange={handleChange}
//             />
//           </div>
//         </div>
//       )}

//       {/* Common Amount Fields */}
//       <div className="RegisFormcon_1">
//         <div className="RegisForm_1">
//           <label>Amount<span>:</span></label>
//           <input
//             onKeyDown={blockInvalidChar}
//             type="number"
//             name="paidamount"
//             value={formAmount.paidamount}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="RegisForm_1">
//           <label>Additional Amount<span>:</span></label>
//           <input
//             onKeyDown={blockInvalidChar}
//             type="number"
//             name="Additionalamount"
//             value={formAmount.Additionalamount}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       {/* Add/Update Button */}
//       <div className="Register_btn_con added_Register_btn_con">
//         <button
//           className="RegisterForm_1_btns added_RegisterForm_1_btns"
//           onClick={isEdit !== null ? handleUpdate : handleAdd}
//         >
//           {isEdit !== null ? "Update" : "Add"}
//         </button>
//       </div>

//       {/* Amount in Words */}
//       <div className="edwqw_c2">
//         <label>Amount in Words : </label>
//         <span
//           style={{
//             color: "#808080b5",
//             padding: "0px 0px 0px 5px",
//           }}
//         >
//           {NumberToWords(+IP_BillingData.Balance_Amount)}
//         </span>
//       </div>

//       <br />

//       {/* Remarks */}
//       <div className="edwqw_c2">
//         <label>Remarks</label>
//         <textarea
//           id="Remarks"
//           name="Remarks"
//           rows="2"
//           value={Remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//         ></textarea>
//       </div>
    
//   </>
//             )}


//             <br/>
//              <br />
//                               <div>
//                                 {billAmount.length !== 0 && (
//                                   <div className="Selected-table-container444 DEWSDXWED">
//                                     <table className="selected-medicine-table222 EDWEDE">
//                                       <thead>
//                                         <tr>
//                                           <th>S.No</th>
//                                           <th>Payment Type</th>
//                                           <th>Card Type</th>
            
//                                           <th>Cheque No</th>
//                                           <th>Bank Name</th>
            
//                                           <th>Amount</th>
//                                           <th>Additional Amount</th>
//                                           <th>Transaction Fee</th>
//                                           <th>Action </th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {billAmount.map((row, index) => (
//                                           <tr key={index}>
//                                             <td>{index + 1}</td>
//                                             <td>{row.Billpay_method}</td>
//                                             <td>{row.CardType || "-"}</td>
//                                             <td>{row.ChequeNo || "-"}</td>
//                                             <td>{row.BankName || "-"}</td>
//                                             <td>{row.paidamount}</td>
//                                             <td>{row.Additionalamount}</td>
//                                             <td>{row.transactionFee}</td>
//                                             <td>
//                                               <button onClick={() => handleEdit(index)}>
//                                                 <EditNoteIcon />
//                                               </button>
//                                             </td>
//                                           </tr>
//                                         ))}
//                                       </tbody>
//                                     </table>
//                                   </div>
//                                 )}
//                               </div>

//             <br />
//  <div className="Register_btn_con added_Register_btn_con">

//           <button
//                       className="RegisterForm_1_btns added_RegisterForm_1_btns"
//                       onClick={() => handleSave()}
//                       disabled={submitBut || isSubmitting} // Pass a second parameter for "PrintReimbuseable"
//                     >
//                       Save
//           </button>


//           <button
//                       className="RegisterForm_1_btns added_RegisterForm_1_btns"
//                       onClick={() => handleCreditPrintSubmit()} // Pass a second parameter for "PrintReimbuseable"
//                     >
//                       Print
//         </button>
//  </div>
                    




//         </div>
//       </>
//     ) : (
//       <ForPrintData />
//     )}
//   </>
// );};

// export default IPCreditBilling





import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "../../App.css";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";

import EditNoteIcon from "@mui/icons-material/EditNote";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useReactToPrint } from "react-to-print";


const IPCreditBilling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  const componentRef = useRef();

  // Redux selectors
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const IP_BillingData = useSelector((state) => state.Frontoffice?.IPBillingData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();

  
  

  // State management
  const [ClinicDetials, setClinicDetials] = useState({
    ClinicAddress: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    ClinicLandLineNo: "",
    ClinicMailID: "",
  });

  const [isEdit, setIsEdit] = useState(null);
  const [Remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [billAmount, setBillAmount] = useState([]);
  const [PostInvoice, setPostInvoice] = useState(null);
  const [PostInvoicedate, setPostInvoiceDate] = useState(null);
  const [submitBut, setSubmitBut] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);

  const [formAmount, setFormAmount] = useState({
    Billpay_method: "",
    CardType: "",
    CardNo: "",
    upiid: "",
    TransactionId: "",
    ChequeNo: "",
    BankName: "",
    paidamount: "",
    Additionalamount: "",
    transactionFee: "",
  });

  const [Paytype, setPaytype] = useState({
    isCash: "Yes",
    isCredit: "No",
    isRefund: "No",
  });


  
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  // Current date and time
  const currentDate = new Date();
  const Formdate = format(currentDate, "yyyy-MM-dd");
  const FormTime = format(currentDate, "hh:mm:ss a");

  // Fetch clinic details
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(
            (component) => component
          );

          setClinicDetials(prev => ({
            ...prev,
            ClinicAddress: addressComponents.join(", "),
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicState: clinicData.State || prev.ClinicState,
            ClinicCode: clinicData.Pincode || prev.ClinicCode,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            ClinicLandLineNo: clinicData.LandlineNo || prev.ClinicLandLineNo,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
          }));
        }
      })
      .catch(console.error);
  }, [UrlLink]);

  // Fetch payment modes
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/PaymentMode_Master_link`)
      .then((res) => setPaymentMode(res.data))
      .catch(console.error);
  }, [UrlLink]);

  // Payment handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormAmount(prevState => ({
      ...prevState,
      [name]: name === "TransactionId" ? value.toUpperCase() : value,
    }));
  };

  const handleEdit = (index) => {
    const item = billAmount[index];
    if (item.Billpay_method === "Advance") {
      setBillAmount(billAmount.filter(ele => ele.Billpay_method !== "Advance"));
    } else {
      setIsEdit(index);
      setFormAmount({ ...item });
    }
  };

  const handleAdd = () => {
    const requiredFields = ["Billpay_method", "paidamount"];
    const missingFields = requiredFields.filter(field => !formAmount[field]);

    if (missingFields.length > 0) {
      alert(`Please fill the required fields: ${missingFields.join(", ")}`);
      return;
    }

    const exists = billAmount.some(p => p.Billpay_method === formAmount.Billpay_method);
    if (exists) {
      alert("This Payment Method already exists");
      return;
    }

    setBillAmount(prev => [...prev, formAmount]);
    setFormAmount({
      Billpay_method: "",
      CardType: "",
      CardNo: "",
      upiid: "",
      TransactionId: "",
      ChequeNo: "",
      BankName: "",
      paidamount: "",
      Additionalamount: "",
      transactionFee: "",
    });
  };

  const handleUpdate = () => {
    const requiredFields = ["Billpay_method", "paidamount"];
    const missingFields = requiredFields.filter(field => !formAmount[field]);

    if (missingFields.length === 0) {
      const updatedBillAmount = [...billAmount];
      if (isEdit !== null) {
        updatedBillAmount[isEdit] = formAmount;
        setBillAmount(updatedBillAmount);
        setIsEdit(null);
        setFormAmount({
          Billpay_method: "",
          CardType: "",
          CardNo: "",
          upiid: "",
          TransactionId: "",
          ChequeNo: "",
          BankName: "",
          paidamount: "",
          Additionalamount: "",
          transactionFee: "",
        });
      }
    } else {
      alert(`Please fill the required fields: ${missingFields.join(", ")}`);
    }
  };

  const handlePayType = (e) => {
    const { name } = e.target;
    setPaytype(prev => {
      if (name === "isCash") {
        return { isCash: "Yes", isCredit: "No", isRefund: "No" };
      } else if (name === "isCredit") {
        return { isCash: "No", isCredit: "Yes", isRefund: "No" };
      } else if (name === "isRefund") {
        return { isCash: "No", isCredit: "No", isRefund: "Yes" };
      }
      return prev;
    });

    setFormAmount({
      Billpay_method: "",
      CardType: "",
      CardNo: "",
      upiid: "",
      TransactionId: "",
      ChequeNo: "",
      BankName: "",
      paidamount: "",
      Additionalamount: "",
      transactionFee: "",
    });
    setBillAmount([]);
  };

  const handleSave = () => {
    if (isSubmitting) return;

    const Payload = {
      billAmount,
      IP_BillingData,
      BillingData: {
        InvoiceNo: "",
        InvoiceDate: Formdate,
        InvoiceTime: FormTime,
        Billedby: UserData?.username || "",
      },
      Created_by: UserData?.username,
    };

    setIsSubmitting(true);

    axios.post(`${UrlLink}Frontoffice/Outstanding_Credit_Details_Link`, Payload)
      .then((res) => {
        setPostInvoice(res.data.InvoiceNo);
        setSubmitBut(true);
        dispatch({
          type: 'toast',
          value: { message: 'Credit billing saved successfully', type: 'success' },
        });
      })
      .catch((err) => {
        console.error(err);
        dispatch({
          type: 'toast',
          value: { message: 'Error saving credit billing', type: 'error' },
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleCreditPrintSubmit = () => {
    setShowPrint(true);
    setIsPrintButtonVisible(false);
  };

  const handleClose = () => {
    navigate("/Home/CashierFolder");
    dispatch({ type: "HrFolder", value: "OutStandingCreditList" });
  };

       const [SelectedPatient_list, setSelectedPatient_list] = useState({
        PatientId: "",
        PatientName: "",
        PhoneNumber: "",
        PatientCategory: "General",
        PatientCategoryType: "",
        InsuranceName: "",
        Gender: "",
        City: "",
        State: "",
        PatientAddress: "",
        Pincode: "",
        VisitId: "",
        WardBedNo: "",
        DischargeDate: "",
        AgeGender : "",
        Address:"",
        AdmittionDate : ""

      });

      const [BillingData, setBillingData] = useState({
          InvoiceNo: "",
          InvoiceDate: Formdate,
          InvoiceTime: FormTime,
          DoctorName: "",
          DoctorId: "",
          Billedby: UserData?.username || "",
        });

      const [initialState, setinitialState] = useState({
          totalItems: 0,
          totalTaxable: 0,
          totalAmount: 0,
          totalDiscount: 0,
          totalGstamount: 0,
          totalUnits: 0,
          totalNetAmount: 0,
          PaidAmount: 0,
          BalanceAmount: 0,
          Roundoff: 0,
          ReimbursableAmount: 0,
          totalAmountt: 0,
          Finalnetamt: 0
        });

          const [loading, setLoading] = useState(false);
        


      console.log(SelectedPatient_list,'SelectedPatient_list')


   useEffect(() => {
  if (!IP_BillingData.IPNo || !IP_BillingData.Patientid) return; // Skip if IDs are missing

  const fetchPharmacyDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${UrlLink}Frontoffice/IP_Outstanding_Billing_Service_List`,
        {
          params: {
            QueueList_ID: IP_BillingData.IPNo,
            PatientId: IP_BillingData.Patientid,
          },
        }
      );

      const billing = response.data?.Billing_data || {};

      setSelectedPatient_list({
        id: billing.id || "",
        Billing_Type: billing.Billing_Type || "",
        Status: billing.Status || "",
        Date: billing.Date || "",
        Registration_Id: billing.Registration_Id || "",
        PatientId: billing.PatientId || "",
        PhoneNo: billing.PhoneNo || "",
        Patient_Name: billing.Patient_Name || "",
        Gender: billing.Gender || "",
        DoorNo: billing.DoorNo || "",
        Age: billing.Age || "",
        Street: billing.Street || "",
        Area: billing.Area || "",
        City: billing.City || "",
        State: billing.State || "",
        Country: billing.Country || "",
        Pincode: billing.Pincode || "",
        PatientType: billing.PatientType || "",
        PatientCategory: billing.PatientCategory || "",
        Doctor_ID: billing.Doctor_ID || "",
        Doctor_ShortName: billing.Doctor_ShortName || "",
        WardName: billing.WardName || "",
        ROOMNo: billing.ROOMNo || "",
        BedNo: billing.BedNo || "",
        AgeGender : billing.AgeGender || "",
        Address : billing.Address || '',
        AdmittionDate : billing.AdmittionDate || "",
      });

    } catch (err) {
      console.error("Error fetching IP Billing details:", err);
      
    } finally {
      setLoading(false);
    }
  };

  fetchPharmacyDetails();
}, [IP_BillingData.Registration_Id, IP_BillingData.PatientId]);

const handlePrintClose = () => {
    // navigate("/Home/CashierFolder");
    // dispatchvalue({ type: "HrFolder", value: "IPBillingFinalList" });
    // dispatchvalue({ type: "setPreviousFolder", value: null });
    // dispatchvalue({ type: "showMenu", value: true });
    setIsPrintButtonVisible(true);
  };

const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: async () => {
      // Additional action after printing, if needed
      navigate("/Home/CashierFolder");
      dispatchvalue({ type: "HrFolder", value: "OutStandingCreditList" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });

 const ForPrintData = () => {
        const hasCard = billAmount.some((p) => p.Billpay_method === "Card");
        const hasCheque = billAmount.some((p) => p.Billpay_method === "Cheque");
        const hasBank = billAmount.some((p) => p.Billpay_method === "Bank");
    
        // Function to convert time to AM/PM format
        const formatTimeToAMPM = (timeString) => {
          if (!timeString) return "-";
    
          try {
            const [hours, minutes] = timeString.split(":");
            const h = parseInt(hours, 10);
            const period = h >= 12 ? "PM" : "AM";
            const h12 = h % 12 || 12;
            return `${h12}:${minutes} ${period}`;
          } catch (error) {
            return timeString;
          }
        };
    
        return (
          <div ref={componentRef}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
              id="reactprintcontent"
            >
              <table className="print-table33">
                <thead
                  className="print_header"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    height: "150px",
                  }}
                >
                  <tr>
                    <td colSpan="8" style={{ border: "none" }}>
                      <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                        <div className="new_billing_logo_con">
                          <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                        </div>
                        <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                          <span>{ClinicDetails?.Cname}</span>
                          <div>
                            <span>
                              {[ClinicDetials?.ClinicAddress]
                                .filter((detail) => detail)
                                .join(", ")}
                              ,
                              {[
                                ClinicDetials?.ClinicCity,
                                ClinicDetials?.ClinicState,
                                ClinicDetials?.ClinicCode,
                              ]
                                .filter((detail) => detail)
                                .join(", ")}
                            </span>
                          </div>
                          <div>
                            {[
                              ClinicDetials?.ClinicMobileNo,
                              ClinicDetials?.ClinicLandLineNo,
                              ClinicDetials?.ClinicMailID,
                            ]
                              .filter((detail) => detail)
                              .join(" , ")}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        color: "black",
                        fontSize: "18px",
                      }}
                    >
                      Detailed Invoice
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="8">
                      <div className="new_billing_address new_addn_p037">
                        <div className="new_billing_address_2 new_billing_address_2_new_up">
                          <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                            <label>
                              Patient Name <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list.Patient_Name}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                            <label>
                              Patient ID <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list.PatientId}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                            <label>
                              Age / Gender <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list.AgeGender}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                            <label>
                              D.O.A <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list.AdmittionDate}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                            <label>
                              Address <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list.Address}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg  wdwdwswdw">
                            <label>
                              Mobile No <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list.PhoneNo}</h4>
                          </div>
    
                          <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                            <label>Consultant <span>:</span></label>
                            <h4>{SelectedPatient_list.Doctor_ShortName}</h4>
                          </div>
                        </div>
                        <div className="new_billing_address_2 new_billing_address_2_new_up">
                          <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                            <label>
                              IP NO <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list.Registration_Id}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                            <label>
                              Ward - Bed No <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list.WardName}</h4>
                          </div>
    
                          <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                            <label>
                              Invoice No<span>:</span>
                            </label>
                            <h4>{PostInvoice}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                            <label>
                              Invoice Date <span>:</span>
                            </label>
                            <h4>{BillingData.InvoiceDate}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                            <label>
                              Payer Type <span>:</span>
                            </label>
                            <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                          </div>
                          {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                                <label>Invoice No<span>:</span></label>
                                                <h4>{PostInvoice}</h4>
                                            </div>
                                            <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                                <label>Invoice Date<span>:</span></label>
                                                <h4>{PostInvoicedate}</h4>
                                            </div> */}
                          {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                            <label>
                              Discharge Date <span>:</span>
                            </label>
                            <h4>{PostInvoicedate}</h4>
                          </div> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                </thead>
    
                {/* <tbody>
                  <tr>
                    <td colSpan="8" className="prin_nnrmll_table">
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr
                            style={{
                              borderTop: "1.5px solid black",
                              borderBottom: "1.5px solid black",
                              backgroundColor: "#f5f5f5",
                            }}
                          >
                            <th
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              S.No
                            </th>
                            <th
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              Service Name
                            </th>
                            <th
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              Credit No
                            </th>
                            <th
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              Charge
                            </th>
                            <th
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              Qty
                            </th>
    
                            <th
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              Amount
                            </th>
                            <th
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              Discount
                            </th>
                            <th
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              Net Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody style={{ borderBottom: "1.5px solid black" }}>
                          {SelectDatalist.map((row, index) => (
                            <tr key={index}>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  textAlign: "center",
                                }}
                              >
                                {index + 1}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.SelectItemName || "-"}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.VoucherNo || "-"}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Charges || "0.00"}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Quantity || "1"}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Amount || "0.00"}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Discount || "0.00"}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.NetAmount}
                              </td>
                            </tr>
                          ))}
                          <tr
                            style={{
                              borderTop: "1px solid grey",
                              fontWeight: "bold",
                            }}
                          >
                            <td
                              colSpan="5"
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                                textAlign: "right",
                              }}
                            >
                              Total
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                                textAlign: "right",
                              }}
                            >
                              {SelectDatalist.reduce(
                                (sum, row) => sum + parseFloat(row.Amount || 0),
                                0
                              ).toFixed(2)}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                                textAlign: "right",
                              }}
                            >
                              {SelectDatalist.reduce(
                                (sum, row) => sum + parseFloat(row.Discount || 0),
                                0
                              ).toFixed(2)}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                                textAlign: "right",
                              }}
                            >
                              {SelectDatalist.reduce(
                                (sum, row) => sum + parseFloat(row.NetAmount || 0),
                                0
                              ).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody> */}
    
                <tr>
                  <td colSpan="8">
                    <div className="new_billing_invoice_detials">
                      <div
                        className="invoice_detials_total_1"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "20px",
                        }}
                      >
                        <div style={{ width: "55%" }}>
    
   {/* {Pharmadetails.length > 0 && (
      <div style={{ marginBottom: "20px" }}>
        
        <h4 style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
          Pharmacy Items
        </h4>
        <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>S.No</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>INV.No</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Date</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Item Name</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {Pharmadetails.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{item.Billing_Invoice_No || "-"}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Billing_Date || "-"}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Billing_Type || "-"}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                  ₹{(parseFloat(item.Net_Amount) || 0).toFixed(2)}
                </td>
              </tr>
            ))}
            
            <tr style={{ fontWeight: "bold", borderTop: "1px solid grey" }}>
              <td colSpan={4} style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                Total Medicines
              </td>
              <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                ₹{(parseFloat(grandTotal) || 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
    
        
        {Pharmarefunddetails.length > 0 && (
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <h4 style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
              Refund Details
            </h4>
            <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>S.No</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>Voucher No</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>Date</th>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Pharmarefunddetails.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{item.Voucher_Number || "-"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Billing_Date || "-"}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                      ₹{(parseFloat(item.PaidAmount) || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold", borderTop: "1px solid grey" }}>
                  <td colSpan={3} style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                    Refund Medicines
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                    ₹{(parseFloat(grandrefundTotal) || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
    
       
        <div style={{ marginTop: "20px", fontWeight: "bold", textAlign: "right" }}>
          <div style={{ marginBottom: "5px" }}>
            Total Medicines: ₹{(parseFloat(grandTotal) || 0).toFixed(2)}
          </div>
          <div style={{ marginBottom: "5px" }}>
            Refund Medicines: ₹{(parseFloat(grandrefundTotal) || 0).toFixed(2)}
          </div>
          <div style={{ borderTop: "1px solid #ddd", paddingTop: "5px" }}>
            Final Amount: ₹{(parseFloat(grandTotal - grandrefundTotal) || 0).toFixed(2)}
          </div>
        </div>
      </div>
    )} */}
    
    
                          {/* {AdvanceAmountGet.length > 0 && (
                            <div>
                              <h4
                                style={{
                                  marginBottom: "10px",
                                  borderBottom: "1px solid #ddd",
                                  paddingBottom: "5px",
                                }}
                              >
                                Advance Amount
                              </h4>
                              <table
                                className="print-table33"
                                style={{
                                  width: "100%",
                                  borderCollapse: "collapse",
                                }}
                              >
                                <thead>
                                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                                    <th
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      S.No
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      Date
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      Time
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {AdvanceAmountGet.map((row, index) => (
                                    <tr key={index}>
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "center",
                                        }}
                                      >
                                        {index + 1}
                                      </td>
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        {row.Date || "-"}
                                      </td>
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "center",
                                        }}
                                      >
                                        {formatTimeToAMPM(row.Time) || "-"}
                                      </td>
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "right",
                                        }}
                                      >
                                        {row.AdvanceAmount || "-"}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr style={{ fontWeight: "bold" }}>
                                    <td
                                      colSpan="3"
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                      }}
                                    >
                                      Total Advance
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                      }}
                                    >
                                      {AdvanceAmountGet.reduce(
                                        (sum, row) =>
                                          sum + parseFloat(row.AdvanceAmount || 0),
                                        0
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )} */}
    
                          {billAmount.length > 0 && (
                            <div style={{ marginBottom: "20px" }}>
                              <h4
                                style={{
                                  marginBottom: "10px",
                                  borderBottom: "1px solid #ddd",
                                  paddingBottom: "5px",
                                }}
                              >
                                Payment Details
                              </h4>
                              <table
                                className="print-table33"
                                style={{
                                  width: "100%",
                                  borderCollapse: "collapse",
                                }}
                              >
                                <thead>
                                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                                    <th
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      S.No
                                    </th>
                                    <th
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      Payment Type
                                    </th>
                                    {hasCard && (
                                      <th
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        Card Type
                                      </th>
                                    )}
                                    {hasCheque && (
                                      <th
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        Cheque No
                                      </th>
                                    )}
                                    {hasBank && (
                                      <th
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        Bank Name
                                      </th>
                                    )}
                                    <th
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      Amount
                                    </th>
                                    {hasCard && (
                                      <th
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        Transaction Fee
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {billAmount.map((row, index) => (
                                    <tr key={index}>
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "center",
                                        }}
                                      >
                                        {index + 1}
                                      </td>
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        {row.Billpay_method || "-"}
                                      </td>
                                      {hasCard && (
                                        <td
                                          style={{
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                          }}
                                        >
                                          {row.Billpay_method === "Card"
                                            ? row.CardType || "-"
                                            : "-"}
                                        </td>
                                      )}
                                      {hasCheque && (
                                        <td
                                          style={{
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                            textAlign: "center",
                                          }}
                                        >
                                          {row.Billpay_method === "Cheque"
                                            ? row.ChequeNo || "-"
                                            : "-"}
                                        </td>
                                      )}
                                      {hasBank && (
                                        <td
                                          style={{
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                          }}
                                        >
                                          {row.Billpay_method === "Bank"
                                            ? row.BankName || "-"
                                            : "-"}
                                        </td>
                                      )}
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "right",
                                        }}
                                      >
                                        {row.paidamount || "-"}
                                      </td>
                                      {hasCard && (
                                        <td
                                          style={{
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                            textAlign: "center",
                                          }}
                                        >
                                          {row.Billpay_method === "Card" &&
                                            row.transactionFee
                                            ? `${parseInt(row.transactionFee)}%`
                                            : "-"}
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
    
    
    
                          <div style={{ marginTop: "20px" }}>
                            <div style={{ marginBottom: "10px", display: "flex", gap: "3px" }}>
                              <label style={{ fontWeight: "bold" }}>
                                Amount In Words:{" "}
                              </label>
                              <span>
                                {NumberToWords(+initialState.totalNetAmount)}
                              </span>
                            </div>
                            <div style={{ display: "flex", gap: "5px" }}>
                              <label style={{ fontWeight: "bold" }}>
                                Billed By:{" "}
                              </label>
                              <span>{BillingData.Billedby}</span>
                            </div>
                          </div>
                        </div>
    
                        <div
                          style={{
                            width: "40%",
                            border: "1px solid #ddd",
                            padding: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <h4
                            style={{
                              marginBottom: "15px",
                              borderBottom: "1px solid #ddd",
                              paddingBottom: "5px",
                            }}
                          >
                            Summary
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ fontWeight: "bold" }}>Total Net Amount:</span>
                            <span style={{ fontWeight: 900, fontSize: "15px" }}>
                              {IP_BillingData.Net_Amount}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "2px", borderBottom: "1px solid black ",
                            }}
                          >
                            <span style={{ fontWeight: "bold" }}>
                              Credit Amount:
                            </span>
                            <span style={{ fontWeight: 900, fontSize: "15px" }}>
                              {IP_BillingData.Balance_Amount}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", borderBottom: "1px solid black ", }}>
                            <span style={{ fontWeight: "bold" }}>Paid Amount:</span>
                            <span style={{ fontWeight: 900, fontSize: "15px" }}>{IP_BillingData.Balance_Amount}</span>
                          </div>
         
    
    
                          {/* <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ fontWeight: "bold" }}>
                              {Math.abs(IP_BillingData.ReceivableAmount) > 0 &&
                              Paytype.isCash === "Yes"
                                ? "Paid Amount:"
                                : "Refund Amount:"}
                            </span>
                            <span style={{ fontWeight: 900, fontSize: "15px" }}>
                              {initialState.totalAmountt}
                            </span>
                          </div> */}
    
                          {/* <div
                            style={{
                              marginTop: "15px",
                              borderTop: "1px solid #ddd",
                              paddingTop: "10px",
                            }}
                          >
                            
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "8px",
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>
                                Total Bill:
                              </span>
                              <span style={{ fontWeight: 900, fontSize: "15px" }}>
                                {initialState.totalNetAmount}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "8px",
                                borderTop: "1px solid #ddd",
                                paddingTop: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              <span>
                                {Math.abs(IP_BillingData.ReceivableAmount) > 0 &&
                                Paytype.isCash === "Yes"
                                  ? "Paid Amount"
                                  : "Refund Amount"}
                              </span>
                              <span>{initialState.PaidAmount}</span>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
    
                <tfoot className="print_footerr">
                  <tr>
                    <td
                      colSpan="8"
                      style={{ padding: "20px 0", textAlign: "center" }}
                    >
                      <p style={{ fontStyle: "italic", marginTop: "30px" }}>
                        This page is created automatically without a signature.
                      </p>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
    
            <div className="Register_btn_con added_Register_btn_con">
              <button
                className="RegisterForm_1_btns jwedu6_99"
                onClick={handlePrint2}
              >
                Print
              </button>
              <button
                className="RegisterForm_1_btns jwedu6_99"
                onClick={handlePrintClose}
              >
                Close
              </button>
            </div>
          </div>
        );
      };





  if (!isPrintButtonVisible) {
    return <ForPrintData />;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", background: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "2px solid #e9ecef" }}>
        <h1 style={{ color: "#2c3e50", fontSize: "28px", fontWeight: "600", margin: 0 }}>Credit Billing</h1>
        <button
          style={{ 
            padding: "10px 20px", 
            background: "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            fontSize: "14px", 
            fontWeight: "500", 
            cursor: "pointer",
            minWidth: "120px"
          }}
          onClick={handleClose}
        >
          Close
        </button>
      </div>

      {/* Patient Information Card */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", border: "1px solid #e9ecef" }}>
        <h3 style={{ color: "#2c3e50", fontSize: "18px", fontWeight: "600", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #3498db" }}>
          Patient Information
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Bill Date</label>
            <input
              type="text"
              value={IP_BillingData.FBilldate}
              readOnly
              style={{ 
                padding: "10px 12px", 
                border: "1px solid #ddd", 
                borderRadius: "6px", 
                fontSize: "14px", 
                backgroundColor: "#f8f9fa",
                color: "#6c757d"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Patient ID</label>
            <input
              type="text"
              value={IP_BillingData.Patientid}
              readOnly
              style={{ 
                padding: "10px 12px", 
                border: "1px solid #ddd", 
                borderRadius: "6px", 
                fontSize: "14px", 
                backgroundColor: "#f8f9fa",
                color: "#6c757d"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Patient Name</label>
            <input
              type="text"
              value={IP_BillingData.Patientname}
              readOnly
              style={{ 
                padding: "10px 12px", 
                border: "1px solid #ddd", 
                borderRadius: "6px", 
                fontSize: "14px", 
                backgroundColor: "#f8f9fa",
                color: "#6c757d"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>IP No</label>
            <input
              type="text"
              value={IP_BillingData.IPNo}
              readOnly
              style={{ 
                padding: "10px 12px", 
                border: "1px solid #ddd", 
                borderRadius: "6px", 
                fontSize: "14px", 
                backgroundColor: "#f8f9fa",
                color: "#6c757d"
              }}
            />
          </div>
        </div>
      </div>

      {/* Billing Details Card */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", border: "1px solid #e9ecef" }}>
        <h3 style={{ color: "#2c3e50", fontSize: "18px", fontWeight: "600", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #3498db" }}>
          Billing Details
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Total Net Amount</label>
            <input
              type="text"
              value={IP_BillingData.Net_Amount}
              readOnly
              style={{ 
                padding: "10px 12px", 
                border: "1px solid #ddd", 
                borderRadius: "6px", 
                fontSize: "16px", 
                fontWeight: "600",
                backgroundColor: "#f8f9fa",
                color: "#2c3e50"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Credit Amount</label>
            <input
              type="text"
              value={IP_BillingData.Balance_Amount}
              readOnly
              style={{ 
                padding: "10px 12px", 
                border: "1px solid #ddd", 
                borderRadius: "6px", 
                fontSize: "16px", 
                fontWeight: "600",
                backgroundColor: "#f8f9fa",
                color: "#2c3e50"
              }}
            />
          </div>
        </div>
      </div>

      {/* Payment Details Card */}
      {Paytype.isCash === "Yes" && (
        <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", border: "1px solid #e9ecef" }}>
          <h3 style={{ color: "#2c3e50", fontSize: "18px", fontWeight: "600", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #3498db" }}>
            Payment Details
          </h3>
          
          {/* Payment Method Selection */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
            <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "12px" }}>Payment Method *</label>
            <select
              name="Billpay_method"
              value={formAmount.Billpay_method}
              onChange={handleChange}
              style={{ 
                padding: "4px 12px", 
                border: "1px solid #ddd", 
                borderRadius: "6px", 
                fontSize: "14px",
                transition: "all 0.2s ease"
              }}
            >
              <option value="">Select Payment Method</option>
              {PaymentMode
                ?.filter(p => p.status === "Active")
                .map((row, ind) => (
                  <option key={ind} value={row.GradeName}>
                    {row.GradeName}
                  </option>
                ))}
            </select>
          </div>

          {/* Card Payment Fields */}
          {formAmount.Billpay_method === "Card" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Card Type</label>
                <select
                  name="CardType"
                  value={formAmount.CardType}
                  onChange={handleChange}
                  style={{ 
                    padding: "10px 12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "6px", 
                    fontSize: "14px" 
                  }}
                >
                  <option value="">Select Card Type</option>
                  <option value="Debit">Debit Card</option>
                  <option value="Credit">Credit Card</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Card Number</label>
                <input
                  type="number"
                  onKeyDown={blockInvalidChar}
                  name="CardNo"
                  value={formAmount.CardNo}
                  onChange={handleChange}
                  style={{ 
                    padding: "10px 12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "6px", 
                    fontSize: "14px" 
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Transaction ID</label>
                <input
                  type="text"
                  name="TransactionId"
                  value={formAmount.TransactionId}
                  onChange={handleChange}
                  style={{ 
                    padding: "10px 12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "6px", 
                    fontSize: "14px" 
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Transaction Fee (%)</label>
                <input
                  type="number"
                  name="transactionFee"
                  value={formAmount.transactionFee}
                  onChange={handleChange}
                  onKeyDown={blockInvalidChar}
                  style={{ 
                    padding: "10px 12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "6px", 
                    fontSize: "14px" 
                  }}
                />
              </div>
            </div>
          )}

          {/* Cheque Payment Fields */}
          {formAmount.Billpay_method === "Cheque" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Cheque Number</label>
                <input
                  type="number"
                  onKeyDown={blockInvalidChar}
                  name="ChequeNo"
                  value={formAmount.ChequeNo}
                  onChange={handleChange}
                  style={{ 
                    padding: "10px 12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "6px", 
                    fontSize: "14px" 
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Bank Name</label>
                <input
                  type="text"
                  name="BankName"
                  value={formAmount.BankName}
                  onChange={handleChange}
                  style={{ 
                    padding: "10px 12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "6px", 
                    fontSize: "14px" 
                  }}
                />
              </div>
            </div>
          )}

          {/* Online Payment Fields */}
          {formAmount.Billpay_method === "OnlinePayment" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>UPI ID</label>
                <input
                  type="text"
                  name="upiid"
                  value={formAmount.upiid}
                  onChange={handleChange}
                  style={{ 
                    padding: "10px 12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "6px", 
                    fontSize: "14px" 
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Transaction ID</label>
                <input
                  type="text"
                  name="TransactionId"
                  value={formAmount.TransactionId}
                  onChange={handleChange}
                  style={{ 
                    padding: "10px 12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "6px", 
                    fontSize: "14px" 
                  }}
                />
              </div>
            </div>
          )}

          {/* Amount Fields */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Amount *</label>
              <input
                type="number"
                name="paidamount"
                value={formAmount.paidamount}
                onChange={handleChange}
                onKeyDown={blockInvalidChar}
                style={{ 
                  padding: "10px 12px", 
                  border: "1px solid #ddd", 
                  borderRadius: "6px", 
                  fontSize: "14px" 
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Additional Amount</label>
              <input
                type="number"
                name="Additionalamount"
                value={formAmount.Additionalamount}
                onChange={handleChange}
                onKeyDown={blockInvalidChar}
                style={{ 
                  padding: "10px 12px", 
                  border: "1px solid #ddd", 
                  borderRadius: "6px", 
                  fontSize: "14px" 
                }}
              />
            </div>
          </div>

          {/* Add/Update Button */}
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #e9ecef" }}>
            <button
              style={{ 
                padding: "10px 20px", 
                background: isEdit !== null ? "#f39c12" : "#3498db", 
                color: "white", 
                border: "none", 
                borderRadius: "6px", 
                fontSize: "14px", 
                fontWeight: "500", 
                cursor: "pointer",
                minWidth: "140px"
              }}
              onClick={isEdit !== null ? handleUpdate : handleAdd}
            >
              {isEdit !== null ? 'Update Payment' : 'Add Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Payment Methods Table */}
      {billAmount.length > 0 && (
        <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", border: "1px solid #e9ecef" }}>
          <h3 style={{ color: "#2c3e50", fontSize: "18px", fontWeight: "600", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #3498db" }}>
            Payment Methods
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr>
                  <th style={{ background: "#34495e", color: "white", fontWeight: "500", padding: "12px", textAlign: "left", fontSize: "13px" }}>S.No</th>
                  <th style={{ background: "#34495e", color: "white", fontWeight: "500", padding: "12px", textAlign: "left", fontSize: "13px" }}>Payment Type</th>
                  <th style={{ background: "#34495e", color: "white", fontWeight: "500", padding: "12px", textAlign: "left", fontSize: "13px" }}>Card Type</th>
                  <th style={{ background: "#34495e", color: "white", fontWeight: "500", padding: "12px", textAlign: "left", fontSize: "13px" }}>Cheque No</th>
                  <th style={{ background: "#34495e", color: "white", fontWeight: "500", padding: "12px", textAlign: "left", fontSize: "13px" }}>Bank Name</th>
                  <th style={{ background: "#34495e", color: "white", fontWeight: "500", padding: "12px", textAlign: "left", fontSize: "13px" }}>Amount</th>
                  <th style={{ background: "#34495e", color: "white", fontWeight: "500", padding: "12px", textAlign: "left", fontSize: "13px" }}>Additional Amount</th>
                  <th style={{ background: "#34495e", color: "white", fontWeight: "500", padding: "12px", textAlign: "left", fontSize: "13px" }}>Transaction Fee</th>
                  <th style={{ background: "#34495e", color: "white", fontWeight: "500", padding: "12px", textAlign: "left", fontSize: "13px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {billAmount.map((row, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #e9ecef" }}>
                    <td style={{ padding: "12px", fontSize: "13px" }}>{index + 1}</td>
                    <td style={{ padding: "12px", fontSize: "13px" }}>{row.Billpay_method}</td>
                    <td style={{ padding: "12px", fontSize: "13px" }}>{row.CardType || "-"}</td>
                    <td style={{ padding: "12px", fontSize: "13px" }}>{row.ChequeNo || "-"}</td>
                    <td style={{ padding: "12px", fontSize: "13px" }}>{row.BankName || "-"}</td>
                    <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600", color: "#2c3e50", textAlign: "right" }}>₹{row.paidamount}</td>
                    <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600", color: "#2c3e50", textAlign: "right" }}>₹{row.Additionalamount || "0.00"}</td>
                    <td style={{ padding: "12px", fontSize: "13px" }}>{row.transactionFee ? `${row.transactionFee}%` : "-"}</td>
                    <td style={{ padding: "12px" }}>
                      <button 
                        style={{ background: "none", border: "none", color: "#3498db", cursor: "pointer", padding: "4px", borderRadius: "4px" }}
                        onClick={() => handleEdit(index)}
                        title="Edit payment"
                      >
                        <EditNoteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Amount in Words and Remarks */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", border: "1px solid #e9ecef" }}>
        <div style={{ marginBottom: "20px", padding: "16px", background: "#f8f9fa", borderRadius: "6px", borderLeft: "4px solid #3498db" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontWeight: "600", color: "#2c3e50" }}>Amount in Words:</span>
            <span style={{ color: "#7f8c8d", fontStyle: "italic" }}>
              {NumberToWords(+IP_BillingData.Balance_Amount)}
            </span>
          </div>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "500", color: "#495057", marginBottom: "6px", fontSize: "14px" }}>Remarks</label>
          <textarea
            rows="3"
            value={Remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={{ 
              padding: "10px 12px", 
              border: "1px solid #ddd", 
              borderRadius: "6px", 
              fontSize: "14px",
              resize: "vertical"
            }}
            placeholder="Add any remarks here..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px", paddingTop: "20px", borderTop: "2px solid #e9ecef" }}>
        <button
          style={{ 
            padding: "10px 20px", 
            background: submitBut || isSubmitting ? "#95a5a6" : "#27ae60", 
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            fontSize: "14px", 
            fontWeight: "500", 
            cursor: submitBut || isSubmitting ? "not-allowed" : "pointer",
            minWidth: "160px"
          }}
          onClick={handleSave}
          disabled={submitBut || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Credit Billing'}
        </button>
        <button
          style={{ 
            padding: "10px 20px", 
            background: "#17a2b8", 
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            fontSize: "14px", 
            fontWeight: "500", 
            cursor: "pointer",
            minWidth: "140px"
          }}
          onClick={handleCreditPrintSubmit}
        >
          Print Invoice
        </button>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
      
    </div>
  );
};

export default IPCreditBilling;
