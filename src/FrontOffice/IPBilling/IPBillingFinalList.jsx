import axios from "axios";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import LoupeIcon from "@mui/icons-material/Loupe";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrintIcon from "@mui/icons-material/Print";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useReactToPrint } from "react-to-print";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";
import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";
import "../../FrontOffice/Billing/GeneralBilling.css";
import "../../FrontOffice/OPPharmacy/GeneralBilling.css";

const IPBillingFinalList = () => {
  const componentRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [Filterdata, setFilterdata] = useState([]);

  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);

  console.log(ClinicDetails,'ClinicDetails cggggggg')

  const currentDate = new Date();
  const Formdate = format(currentDate, "yyyy-MM-dd");

  console.log(Filterdata, "Filterdata");
  const [SearchQuery, setSearchQuery] = useState({
    searchBy: "",
    Status: "Pending",
  });

  // Function to format date as MM/DD/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));

  const [searchOptions, setSearchOptions] = useState({
    DateType: "Customize",
    CurrentDate: TodayDate,
    FromDate: "",
    ToDate: "",
    // Paymentmode:'',
    SearchbyFirstName: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "Approved",
  });

    const [Pharmadetails, setPharmadetails] = useState([]);
       const [Pharmarefunddetails,setPharmarefunddetails] = useState([]);
       const [grandrefundTotal, setGrandrefundTotal] = useState(0);
    
      const [grandTotal, setGrandTotal] = useState(0);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");

      console.log(Pharmarefunddetails,'Pharmarefunddetails new oneeeeeeee')


      console.log(Pharmarefunddetails,grandrefundTotal,grandTotal,'PharmarefunddetailsPharmarefunddetails')
    
      // useEffect(() => {
      //   if (!IP_BillingData.Registration_Id || !IP_BillingData.PatientId) return; // Skip if IDs are missing
    
      //   const fetchPharmacyDetails = async () => {
      //     setLoading(true);
      //     try {
      //       const response = await axios.get(
      //         `${UrlLink}Frontoffice/IPBilling_Pharmacy_credit_get_details`,
      //         {
      //           params: {
      //             Registration_Id: IP_BillingData.Registration_Id,
      //             PatientId: IP_BillingData.PatientId,
      //           },
      //         }
      //       );
    
      //       setPharmadetails(response.data.pharmacy_list || []);
      //       setGrandTotal(response.data.grand_total || 0);
      //       setError("");
      //     } catch (err) {
      //       setError(err.response?.data?.error || "Something went wrong");
      //       setPharmadetails([]);
      //       setGrandTotal(0);
      //     } finally {
      //       setLoading(false);
      //     }
      //   };
    
      //   fetchPharmacyDetails();
      // }, [IP_BillingData.Registration_Id, IP_BillingData.PatientId]);

  const [printView, setPrintView] = useState(null); // 'bill' | 'receipt' | null

  const [printOptions, setPrintOptions] = useState({});

  console.log(printOptions, "printOptions");
  console.log(printView, "printView");

  const [AdvanceAmountGet, setAdvanceAmountGet] = useState([]);
  const [AdvanceTotal, setAdvanceTotal] = useState([]);
  const [RemainingCredit, setRemainingCredit] = useState([]);

  const [AdvanceAmount, setAdvanceAmount] = useState({
    isAdvance: "No",
    AdvanceAmount: "",
  });

  useEffect(() => {
  const controller = new AbortController();

  const apiUrl =
    searchOptions.SearchStatus === "Cash" ||
    searchOptions.SearchStatus === "Credit" ||
    searchOptions.SearchStatus === "Refund"
      ? `${UrlLink}Frontoffice/IPBillingFinal_Reprint_Link`
      : `${UrlLink}Frontoffice/IPBillingEstimatedEditLink`;

  axios
    .get(apiUrl, {
      params: { ...searchOptions, location: UserData?.location },
      signal: controller.signal, // attach abort signal
    })
    .then((res) => {
      const ress = res.data;
      setFilterdata(Array.isArray(ress) ? ress : []);
    })
    .catch((err) => {
      if (err.name === "CanceledError") {
        console.log("Request aborted:", err.message);
      } else {
        console.log("Error:", err);
      }
    });

  // Cleanup cancels the request
  return () => {
    controller.abort();
  };
}, [UrlLink, searchOptions, UserData?.location]);



  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: "",
    ClinicGST: "",
    ClinicAddress: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    ClinicLandLineNo: "",
    ClinicMailID: "",
  });


  console.log(ClinicDetials,'ClinicDetials')
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((res) => {
        const ress = res.data;
        console.log("ressclinic address", ress);

        // If the response is an array, set the clinic details
        if (Array.isArray(ress) && ress.length > 0) {
          console.log("123");
          setClinicDetials({
            ClinicLandLineNo: ress[0]?.LandlineNo || "",
            ClinicMailID: ress[0]?.Mail || "",
            ClinicMobileNo: ress[0]?.PhoneNo || "",
            ClinicCity: ress[0]?.City || "",
            ClinicState: ress[0]?.State || "",
            ClinicGST: ress[0]?.GSTNo || "",
            ClinicCode: ress[0]?.Pincode || "",
            ClinicAddress: `No.${ress[0]?.DoorNo || ""}, ${
              ress[0]?.Street || ""
            }, ${ress[0]?.Area || ""}, ${ress[0]?.City || ""} ,${
              ress[0]?.State || ""
            } - ${ress[0]?.Pincode || ""}`,
          });
        } else {
          // Handle the case where the response is not an array or is empty
          console.log("Response is not an array or empty:", ress);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

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
    AgeGender: "",
    AdmissionDate: "",
    Date: "",
    RegisterId: "",
  });

  const [PostInvoice, setPostInvoice] = useState(null);
  const [RecieptInvoice, setRecieptInvoice] = useState(null);
  const [PostInvoicedate, setPostInvoiceDate] = useState(null);

  const [BillingData, setBillingData] = useState({
    InvoiceNo: "",
    InvoiceDate: Formdate,
    DoctorName: "",
    DoctorId: "",
  });

  const [SelectDatalist, setSelectDatalist] = useState([]);
  console.log("SelectDatalist111", SelectDatalist);
  const [Reimbursable, setReimbursable] = useState(false);
  const [SelectDatalist1, setSelectDatalist1] = useState([]);
  console.log("SelectDatalist1", SelectDatalist1);
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
  });
   const [Amountdetails, setAmountDetails] = useState({
    Grandtotal : 0,
    SchemeDiscount:0,
    Totalamount : 0,
    FinalDiscount:0,
    Finalnetamt : 0,
    Paidamt: 0,
    Refundamt : 0,
    Creditamt : 0
  });


  console.log(Amountdetails,'Amountdetails')
  const [billAmount, setBillAmount] = useState([]);
  const [Condition, setCondition] = useState({
    hasCard: "",
    hasCheque: "",
    hasBank: "",
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;

    console.log(`Updating ${name} with value:`, value);

    if (name === "SearchbyPhoneNumber") {
      if (value.length <= 10) {
        setSearchOptions((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "DateType") {
      if (value === "Current") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: TodayDate, // Ensure TodayDate is properly defined
          FromDate: "",
          ToDate: "",
        }));
      } else if (value === "Customize") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
        }));
      }
      else if (value === 'All') {
        setSearchOptions((prev) => ({
            ...prev,
            DateType: value,
            CurrentDate: '', 
            FromDate: '',
            ToDate: '',
        }));
      }
    } else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlenewDocRegister = () => {
    dispatchvalue({ type: "IPBillingData", value: { type: "IP" } });
    dispatchvalue({ type: "OPBillingData", value: {} });

    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "IPQuickbilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  //

//   const PatientOPRegisterColumns = useMemo(() => {
//   if (
//     searchOptions.SearchStatus === "Cash" ||
//     searchOptions.SearchStatus === "Credit" || 
//     searchOptions.SearchStatus === "Refund"
//   ) {
//     return [
//       {
//         key: "id",
//         name: "ID",
//       },
//       {
//         key: "Billing_Date",
//         name: "Date",
//       },
//       {
//         key: "PatientId",
//         name: "Patient Id",
//       },
//       {
//         key: "Patient_Name",
//         name: "Patient Name",
//       },
//       {
//         key: "PhoneNo",
//         name: "PhoneNo",
//       },
//       {
//         key: "ward",
//         name: "Ward/Room",
//       },
//       {
//         key: "Doctor_Name",
//         name: "Doctor Name",
//       },
//       {
//         key: "PatientCategory",
//         name: "Patient Category",
//       },
//       {
//         key: "Net_Amount",
//         name: "Net Amount",
//       },
//       {
//         key: "PaidAmount",
//         name: "Paid Amount",
//       },
//       {
//         key: "BalanceAmount",
//         name: "Balance Amount",
//       },
//       {
//         key: "Action",
//         name: "Action",
//         renderCell: (params) => {
//           const patientCategory = params.row.PatientCategory?.replace(
//             /"/g,
//             ""
//           );

//           const rowId = params.row.id;
//           if (!rowId) {
//             console.warn("Missing row id:", params.row);
//             return <span>Invalid Row</span>;
//           }

//           const selectedOption = printOptions[rowId]?.main || "Bill";
//           const selectedSubOption =
//             printOptions[rowId]?.sub || "Print Detailed";

//           const handleChangeMain = (e) => {
//             const value = e.target.value;
//             setPrintOptions((prev) => ({
//               ...prev,
//               [rowId]: { ...prev[rowId], main: value },
//             }));
//           };

//           const handleChangeSub = (e) => {
//             const value = e.target.value;
//             setPrintOptions((prev) => ({
//               ...prev,
//               [rowId]: { ...prev[rowId], sub: value },
//             }));
//           };

//           const handlePrint = () => {
//             if (!selectedOption || selectedOption === "Select") {
//               alert("Please select a valid main print option.");
//               return;
//             }

//             if (!selectedSubOption || selectedSubOption === "Select") {
//               alert("Please select a valid sub print option.");
//               return;
//             }

//             // Logic based on both selectedOption and selectedSubOption
//             if (selectedOption === "Bill") {
//               switch (selectedSubOption) {
//                 case "Print summary":
//                   HandleBillPrintSummary(params.row);
//                   break;
//                 case "Print Detailed":
//                   HandleBillPrintDetailed(params.row);
//                   break;
//                 case "PrintReimbursable":
//                   HandlePrintReimbursable(params.row);
//                   break;
//                 case "PrintNon-Reimbursable":
//                   HandlePrintNonReimbursable(params.row);
//                   break;
//                 default:
//                   alert("Invalid sub option for Bill.");
//               }
//             } else if (selectedOption === "Bill+Receipt") {
//               switch (selectedSubOption) {
//                 case "Print summary":
//                   HandleBillReceiptPrintSummary(params.row);
//                   break;
//                 case "Print Detailed":
//                   HandleBillReceiptPrintDetailed(params.row);
//                   break;
//                 default:
//                   alert("Invalid sub option for Bill+Receipt.");
//               }
//             } else {
//               alert("Invalid main print option selected.");
//             }
//           };

//           if (params.row.Bill_Status !== "Cash"  || params.row.Bill_Status !== "Refund"  || params.row.Bill_Status !== "Credit" ) return "No Action";

//           const mainOptions =
//             patientCategory === "General"
//               ? ["Select", "Bill+Receipt", "Bill"]
//               : patientCategory === "Insurance" ||
//                 patientCategory === "Client"
//               ? ["Select", "Bill"]
//               : [];

//           const subOptions =
//             patientCategory === "General"
//               ? ["Select", "Print summary", "Print Detailed"]
//               : patientCategory === "Insurance" ||
//                 patientCategory === "Client"
//               ? [
//                   "Select",
//                   "Print summary",
//                   "Print Detailed",
//                   "PrintReimbursable",
//                   "PrintNon-Reimbursable",
//                 ]
//               : [];

//           return (
//             <div
//               className="Register_btn_con added_Register_btn_con"
//               style={{ display: "flex", gap: "8px", alignItems: "center" }}
//             >
//               <select
//                 className="print_option_bill"
//                 style={{ width: "160px" }}
//                 value={selectedOption}
//                 onChange={handleChangeMain}
//               >
//                 {mainOptions.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 className="print_option_bill"
//                 style={{ width: "160px" }}
//                 value={selectedSubOption}
//                 onChange={handleChangeSub}
//               >
//                 {subOptions.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>

//               <button
//                 className="RegisterForm_1_btns added_RegisterForm_1_btns"
//                 onClick={handlePrint}
//                 disabled={selectedOption === "Select"}
//               >
//                 <PrintIcon className="check_box_clrr_cancell" />
//               </button>
//             </div>
//           );
//         },
//       },
//     ];
//   } else {
//     return [
//       {
//         key: "id",
//         name: "ID",
//       },
//       {
//         key: "Date",
//         name: "Date",
//       },
//       {
//         key: "PatientId",
//         name: "Patient Id",
//       },
//       {
//         key: "Patient_Name",
//         name: "Patient Name",
//       },
//       {
//         key: "PhoneNo",
//         name: "PhoneNo",
//       },
//       {
//         key: "ward",
//         name: "Ward/Room",
//       },
//       {
//         key: "Doctor_ShortName",
//         name: "Doctor Name",
//       },
//       {
//         key: "PatientCategory",
//         name: "Patient Category",
//       },
//       {
//         key: "Action",
//         name: "Action",
//         renderCell: (params) => {
//           return params.row.Status === "Approved" ? (
//             <Button
//               className="cell_btn"
//               onClick={() => HandleMovedatatobill(params.row)}
//             >
//               <ArrowForwardIcon className="check_box_clrr_cancell" />
//             </Button>
//           ) : params.row.Status === "Paid" ? (
//             <>
//               <Button
//                 className="cell_btn"
//                 onClick={() => HandlePrintBill(params.row)}
//               >
//                 <PrintIcon className="check_box_clrr_cancell" />
//               </Button>
//               <Button
//                 className="cell_btn"
//                 onClick={() => HandlePrintBillReceipt(params.row)}
//               >
//                 <ReceiptIcon className="check_box_clrr_cancell" />
//               </Button>
//             </>
//           ) : (
//             "No Action"
//           );
//         },
//       },
//     ];
//   }
// }, [searchOptions.SearchStatus, printOptions, TodayDate]);



  const PatientOPRegisterColumns = useMemo(() => {
 
    return [
      {
        key: "id",
        name: "ID",
      },
      {
        key: "Date",
        name: "Date",
      },
      {
        key: "PatientId",
        name: "Patient Id",
      },
       {
      key: "Registration_Id",
      name: "IPNo",
    },
      {
        key: "Patient_Name",
        name: "Patient Name",
      },
      {
        key: "PhoneNo",
        name: "PhoneNo",
      },
      {
        key: "ward",
        name: "Ward/Room",
      },
      {
        key: "Doctor_ShortName",
        name: "Doctor Name",
      },
      {
        key: "PatientCategory",
        name: "Patient Category",
      },
      {
        key: "Action",
        name: "Action",
        renderCell: (params) => {
          return params.row.Status === "Approved" ? (
            <Button
              className="cell_btn"
              onClick={() => HandleMovedatatobill(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>
          ) : params.row.Status === "Paid" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintBill(params.row)}
              >
                <PrintIcon className="check_box_clrr_cancell" />
              </Button>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintBillReceipt(params.row)}
              >
                <ReceiptIcon className="check_box_clrr_cancell" />
              </Button>
            </>
          ) : (
            "No Action"
          );
        },
      },
    ];
  
}, [searchOptions.SearchStatus, printOptions, TodayDate]);


  const IPPatientBillcolumns = [

    {
        key: "id",
        name: "ID",
      },
      {
        key: "Billing_Date",
        name: "Date",
      },
      {
        key: "PatientId",
        name: "Patient Id",
      },
       {
      key: "Registration_Id",
      name: "IPNo",
    },
      {
        key: "Patient_Name",
        name: "Patient Name",
      },
      {
        key: "PhoneNo",
        name: "PhoneNo",
      },
      {
        key: "ward",
        name: "Ward/Room",
      },
      {
        key: "Doctor_Name",
        name: "Doctor Name",
      },
      {
        key: "PatientCategory",
        name: "Patient Category",
      },
      {
        key: "Net_Amount",
        name: "Net Amount",
      },
      {
        key: "PaidAmount",
        name: "Paid Amount",
      },
      {
        key: "BalanceAmount",
        name: "Balance Amount",
      },
      {
        key: "Action",
        name: "Bill",
        renderCell: (params) => {
          return params.row.Bill_Status === "Approved" ? (
            <Button
              className="cell_btn"
              onClick={() => HandleMovedatatobill(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>
          ) : params.row.Bill_Status === "Cash" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintBill(params.row)}
              >
                <PrintIcon className="check_box_clrr_cancell" />
              </Button>
              
            </>
          ) : params.row.Bill_Status === "Refund" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintBill(params.row)}
              >
                <PrintIcon className="check_box_clrr_cancell" />
              </Button>
              
            </>
          ): params.row.Bill_Status === "Credit" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintBill(params.row)}
              >
                <PrintIcon className="check_box_clrr_cancell" />
              </Button>
              
            </>
          ): (
            "No Action"
          );
        },
      },
      {
        key: "Action",
        name: "Receipt",
        renderCell: (params) => {
          return params.row.Bill_Status === "Approved" ? (
            <Button
              className="cell_btn"
              onClick={() => HandleMovedatatobill(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>
          ) : params.row.Bill_Status === "Cash" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintBillReceiptReprint(params.row)}
              >
                <ReceiptIcon className="check_box_clrr_cancell" />
              </Button>
              
            </>
          ) : params.row.Bill_Status === "Refund" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintBillReceiptReprint(params.row)}
              >
                <ReceiptIcon className="check_box_clrr_cancell" />
              </Button>
              
            </>
          ): params.row.Bill_Status === "Credit" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintBillReceiptReprint(params.row)}
              >
                <ReceiptIcon className="check_box_clrr_cancell" />
              </Button>
              
            </>
          ): (
            "No Action"
          );
        },
      },
       {
        key: "CGHS",
        name: "CGHS",
        renderCell: (params) => {
          return params.row.Bill_Status === "Approved" ? (
            <Button
              className="cell_btn"
              onClick={() => HandleMovedatatobill(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>
          ) : params.row.Bill_Status === "Cash" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintCGHSBillReprint(params.row)}
              >
                <PrintIcon className="check_box_clrr_cancell" />
              </Button>
              
            </>
          ) : params.row.Bill_Status === "Refund" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintCGHSBillReprint(params.row)}
              >
                <PrintIcon className="check_box_clrr_cancell" />
              </Button>
              
            </>
          ): params.row.Bill_Status === "Credit" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandlePrintCGHSBillReprint(params.row)}
              >
                <PrintIcon className="check_box_clrr_cancell" />
              </Button>
              
            </>
          ): (
            "No Action"
          );
        },
      },

  ]

// Create a dynamic component for printing based on search status
// const DynamicPrintComponent = useMemo(() => {
//   if (searchOptions.SearchStatus === "Credit") {
//     return ForPrintCreditData;
//   } else if (
//     searchOptions.SearchStatus === "Cash" ||
//     searchOptions.SearchStatus === "Refund"
//   ) {
//     return ForPrintData;
//   }
//   return null; // or a default component if needed
// }, [searchOptions.SearchStatus]);

  useEffect(() => {
    const aggregatedData = SelectDatalist.reduce((acc, curr) => {
      const existing = acc.find(
        (item) => item.Service_Type === curr.Service_Type
      );

      const quantity = parseFloat(curr.Quantity) || 0;
      const amount = parseFloat(curr.Amount) || 0;
      const totalAmount = parseFloat(curr.Total_Amount) || 0;

      if (existing) {
        existing.Quantity += quantity;
        existing.Amount += amount;
        existing.Total_Amount += totalAmount;
      } else {
        acc.push({
          Service_Type: curr.Service_Type,
          Quantity: quantity,
          Amount: amount,
          Total_Amount: totalAmount,
        });
      }

      return acc;
    }, []);

    console.log("Aggregated Data:", aggregatedData);
    setSelectDatalist1(aggregatedData);
  }, [SelectDatalist]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Frontoffice/IP_AdvanceAmount_collection?RegistrationId=${
          SelectedPatient_list?.RegisterId
        }&Type=${"IP"}`
      )
      .then((ress) => {
        const res = ress?.data;
        console.log("advvvvv", res);
        setAdvanceAmountGet(res?.AdvanceDetails);
        setAdvanceTotal(res?.TotalAdvanceAmount);
        setRemainingCredit(res?.RemainingCredit);
      })
      .catch((e) => console.log(e));
  }, [UrlLink, SelectedPatient_list.RegisterId]);



 useEffect(() => {
    axios
      .get(
        `${UrlLink}Frontoffice/IPBilling_Pharmacy_credit_get_details?Registration_Id=${
          SelectedPatient_list?.RegisterId
        }&PatientId=${SelectedPatient_list?.PatientId}`
      )
      .then((ress) => {
        const res = ress?.data;
        console.log("advvvvv", res);
        setPharmadetails(res.pharmacy_list || []);
        setGrandTotal(res.grand_total || 0);
        setPharmarefunddetails(res.refund_list || []);
        setGrandrefundTotal(res.total_refunded || 0);
      })
      .catch((e) => console.log(e));
  }, [UrlLink, SelectedPatient_list.RegisterId]);




  const HandlePrintBill = (params) => {
    console.log(params, "parmassssss");

    if(params.Bill_Status === 'Cash'){
          setPrintView("Cash");
    }
    if(params.Bill_Status === 'Credit'){
          setPrintView("Credit");
    }
    if(params.Bill_Status === 'Refund'){
          setPrintView("Refund");
    }

    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate,
      DischargeDate : params?.DischargeDate,
            Doctor_Name : params?.Doctor_Name,

        
      WardBedNo: params?.ward,
      Billedby: params?.Billedby
    });

    setPostInvoice(params?.id);
    setPostInvoiceDate(params?.DischargeDate,)

    setSelectDatalist(params?.Billing_Items);

    setAmountDetails({
      Grandtotal : params?.TotalAmount,
      SchemeDiscount : params?.SchemeDiscount,
      Totalamount : params?.Net_Amount,
      FinalDiscount: params?.Discount_Value,
      Finalnetamt:params?.PaidNetAmount,
      Paidamt : params?.PaidAmount,
      Refundamt : params?.Refund_Amount,
      Creditamt : params?.Balance_Amount

    })

    setBillAmount(params?.Payment_Details);

  };

   const HandlePrintBillReceiptReprint = (params) => {
    console.log(params, "parmassssss");

    if(params.Bill_Status === 'Cash'){
          setPrintView("CashReceipt");
    }
    if(params.Bill_Status === 'Credit'){
          setPrintView("CreditReceipt");
    }
    if(params.Bill_Status === 'Refund'){
          setPrintView("RefundReceipt");
    }

    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate,
      DischargeDate : params?.DischargeDate,
            Doctor_Name : params?.Doctor_Name,

        
      WardBedNo: params?.ward,
      Billedby: params?.Billedby
    });

    setPostInvoice(params?.id);
    setPostInvoiceDate(params?.DischargeDate,)

    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);


    setAmountDetails({
      Grandtotal : params?.TotalAmount,
      SchemeDiscount : params?.SchemeDiscount,
      Totalamount : params?.Net_Amount,
      FinalDiscount: params?.Discount_Value,
      Finalnetamt:params?.PaidNetAmount,
      Paidamt : params?.PaidAmount,
      Refundamt : params?.Refund_Amount,
      Creditamt : params?.Balance_Amount

    })

  };


  


  const HandlePrintCGHSBillReprint = (params) => {
    console.log(params?.Doctor_Name, "CGHSSSSSSSSSSSSSs");

    if(params.Bill_Status === 'Cash'){
          setPrintView("CGHSCash");
    }
    if(params.Bill_Status === 'Credit'){
          setPrintView("CGHSCredit");
    }
    if(params.Bill_Status === 'Refund'){
          setPrintView("CGHSRefund");
    }

    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate,
      DischargeDate : params?.DischargeDate,
      Doctor_Name : params?.Doctor_Name,

      refNo : params?.refNo,
      refDate : params?.refDate,
      employeeId : params?.employeeId,
      employeeName : params?.employeeName,
      crNo : params?.crNo,
      designation : params?.designation,
      Relation : params?.Relation,
      UMIDNO : params?.UMIDNO,
      no_of_days : params?.no_of_days,

        
      WardBedNo: params?.ward,
      Billedby: params?.Billedby
    });

    setPostInvoice(params?.id);
    setPostInvoiceDate(params?.DischargeDate,)

    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);


    setAmountDetails({
      Grandtotal : params?.TotalAmount,
      SchemeDiscount : params?.SchemeDiscount,
      Totalamount : params?.Net_Amount,
      FinalDiscount: params?.Discount_Value,
      Finalnetamt:params?.PaidNetAmount,
      Paidamt : params?.PaidAmount,
      Refundamt : params?.Refund_Amount,
      Creditamt : params?.Balance_Amount

    })

  };

  const HandlePrintBillReceipt = (params) => {
    console.log(params, "params");

    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate
        ? new Date(params.AdmissionDate).toLocaleDateString()
        : "",
      WardBedNo: params?.ward,
    });

    setPostInvoice(params?.id);

    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);

    setinitialState({
      totalItems: params?.TotalItems,
      totalTaxable: 0,
      totalAmount: params?.TotalAmount,
      totalDiscount: 0,
      totalGstamount: 0,
      totalUnits: 0,
      totalNetAmount: params?.Net_Amount,
      PaidAmount: params?.PaidAmount,
      BalanceAmount: params?.BalanceAmount,
      Roundoff: params?.RoundOff,
      ReimbursableAmount: 0,
      totalAmountt: 0,
    });

    setPrintView("billreceipt");
  };

  const HandlePrintReceipt = (params) => {
    console.log(params, "HandlePrintReceipt");
    setPrintView("PrintReceipt");
  };

  const HandleBillPrintSummary = (params) => {
    console.log(params, "HandlePrintSummary");

    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate,
    
      WardBedNo: params?.ward,
    });

    setPostInvoice(params?.id);
    setPostInvoiceDate(params?.Billing_Date);

    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);

    setinitialState({
      totalItems: params?.TotalItems,
      totalTaxable: 0,
      totalAmount: params?.TotalAmount,
      totalDiscount: 0,
      totalGstamount: 0,
      totalUnits: 0,
      totalNetAmount: params?.Net_Amount,
      PaidAmount: params?.PaidAmount,
      BalanceAmount: params?.BalanceAmount,
      Roundoff: params?.RoundOff,
      ReimbursableAmount: 0,
      totalAmountt: 0,
    });

    setPrintView("Bill+Summary");
  };

  const HandleBillReceiptPrintSummary = (params) => {
    console.log(params, "HandlePrintSummary");

    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate,
      
      WardBedNo: params?.ward,
    });

    setPostInvoice(params?.id);
    setPostInvoiceDate(params?.Billing_Date);
    setRecieptInvoice(params?.reciept_no);
    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);

    setinitialState({
      totalItems: params?.TotalItems,
      totalTaxable: 0,
      totalAmount: params?.TotalAmount,
      totalDiscount: 0,
      totalGstamount: 0,
      totalUnits: 0,
      totalNetAmount: params?.Net_Amount,
      PaidAmount: params?.PaidAmount,
      BalanceAmount: params?.BalanceAmount,
      Roundoff: params?.RoundOff,
      ReimbursableAmount: 0,
      totalAmountt: 0,
    });

    setPrintView("Bill+Receipt+Summary");
  };

  const HandleBillPrintDetailed = (params) => {
    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate,
      
      WardBedNo: params?.ward,
    });

    setPostInvoice(params?.id);
    setPostInvoiceDate(params?.Billing_Date);

    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);

    setinitialState({
      totalItems: params?.TotalItems,
      totalTaxable: 0,
      totalAmount: params?.TotalAmount,
      totalDiscount: 0,
      totalGstamount: 0,
      totalUnits: 0,
      totalNetAmount: params?.Net_Amount,
      PaidAmount: params?.PaidAmount,
      BalanceAmount: params?.BalanceAmount,
      Roundoff: params?.RoundOff,
      ReimbursableAmount: 0,
      totalAmountt: 0,
    });

    setPrintView("Bill+Detailed");
  };

  const HandleBillReceiptPrintDetailed = (params) => {
    console.log(params,'params12345')
    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate,
       
      WardBedNo: params?.ward,
    });

    setPostInvoice(params?.id);

     setPostInvoiceDate(params?.Billing_Date);
      setRecieptInvoice(params?.reciept_no);

    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);

    setinitialState({
      totalItems: params?.TotalItems,
      totalTaxable: 0,
      totalAmount: params?.TotalAmount,
      totalDiscount: 0,
      totalGstamount: 0,
      totalUnits: 0,
      totalNetAmount: params?.Net_Amount,
      PaidAmount: params?.PaidAmount,
      BalanceAmount: params?.BalanceAmount,
      Roundoff: params?.RoundOff,
      ReimbursableAmount: 0,
      totalAmountt: 0,
    });

    setPrintView("Bill+Receipt+Detailed");
  };

  const HandlePrintDetailed = (params) => {
    console.log(params, "HandlePrintSummary");

    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate
        ? new Date(params.AdmissionDate).toLocaleDateString()
        : "",
      WardBedNo: params?.ward,
    });

    setPostInvoice(params?.id);

    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);

    setinitialState({
      totalItems: params?.TotalItems,
      totalTaxable: 0,
      totalAmount: params?.TotalAmount,
      totalDiscount: 0,
      totalGstamount: 0,
      totalUnits: 0,
      totalNetAmount: params?.Net_Amount,
      PaidAmount: params?.PaidAmount,
      BalanceAmount: params?.BalanceAmount,
      Roundoff: params?.RoundOff,
      ReimbursableAmount: 0,
      totalAmountt: 0,
    });

    setPrintView("Detailed");
  };

  const HandlePrintReimbursable = (params) => {
    console.log(params, "HandlePrintSummary");

    const reimbursableItems = params?.Billing_Items.filter(
      (item) => item.IsReimbursable === "Yes"
    );

    if (reimbursableItems.length === 0) {
      const tdata = {
        message: "No Print available For Reimbursable Items",
        type: "Warn",
      };

      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    if (
      params?.PatientCategory === "Insurance" ||
      params?.PatientCategory === "Client"
    ) {
      let updatedTotals = {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalGstamount: 0,
        totalNetAmount: 0,
      };

      let reimbursableTotals = {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalGstamount: 0,
        totalNetAmount: 0,
      };

      let nonReimbursableTotals = {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalGstamount: 0,
        totalNetAmount: 0,
      };

      const reimbursableItems = params?.Billing_Items.filter(
        (item) => item.IsReimbursable === "Yes"
      );
      const nonReimbursableItems = params?.Billing_Items.filter(
        (item) => item.IsReimbursable !== "Yes"
      );

      const calculateTotals = (items) => {
        return items.reduce(
          (totals, item) => {
            totals.totalUnits += +item.Quantity || 0;
            totals.totalAmount += parseFloat(item.Charges) || 0;
            totals.totalDiscount += parseFloat(item.Discount) || 0;
            totals.totalGstamount += parseFloat(item.GST) || 0;
            totals.totalNetAmount += parseFloat(item.NetAmount) || 0;
            return totals;
          },
          {
            totalUnits: 0,
            totalAmount: 0,
            totalDiscount: 0,
            totalGstamount: 0,
            totalNetAmount: 0,
          }
        );
      };

      reimbursableTotals = calculateTotals(reimbursableItems);
      nonReimbursableTotals = calculateTotals(nonReimbursableItems);

      updatedTotals = {
        totalUnits:
          reimbursableTotals.totalUnits + nonReimbursableTotals.totalUnits,
        totalAmount:
          reimbursableTotals.totalAmount + nonReimbursableTotals.totalAmount,
        totalDiscount:
          reimbursableTotals.totalDiscount +
          nonReimbursableTotals.totalDiscount,
        totalGstamount:
          reimbursableTotals.totalGstamount +
          nonReimbursableTotals.totalGstamount,
        totalNetAmount:
          reimbursableTotals.totalNetAmount +
          nonReimbursableTotals.totalNetAmount,
      };

      let additionalDiscount = 0;

      let finalDiscount = Math.min(
        updatedTotals.totalNetAmount,
        updatedTotals.totalDiscount + additionalDiscount
      );

      let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;

      let updatedGst =
        totalTaxableAmount *
          (updatedTotals.totalGstamount / updatedTotals.totalNetAmount) || 0;

      let finalNetAmount = totalTaxableAmount + updatedGst;

      setinitialState((prevState) => ({
        ...prevState,
        totalItems: SelectDatalist.length,
        totalTaxable: updatedTotals.totalAmount.toFixed(2),
        totalUnits: updatedTotals.totalUnits,
        totalDiscount: finalDiscount.toFixed(2),
        totalGstamount: updatedGst.toFixed(2),
        totalNetAmount: finalNetAmount.toFixed(2),
        totalAmount: finalNetAmount.toFixed(2),
        BalanceAmount: (finalNetAmount - prevState.PaidAmount).toFixed(2),
        Roundoff: (Math.round(finalNetAmount) - finalNetAmount).toFixed(2),

        reimbursableTotal: reimbursableTotals.totalNetAmount.toFixed(2),
        nonReimbursableTotal: nonReimbursableTotals.totalNetAmount.toFixed(2),
      }));
    } else {
      setinitialState({
        totalItems: params?.TotalItems,
        totalTaxable: 0,
        totalAmount: params?.TotalAmount,
        totalDiscount: 0,
        totalGstamount: 0,
        totalUnits: 0,
        totalNetAmount: params?.Net_Amount,
        PaidAmount: params?.PaidAmount,
        BalanceAmount: params?.BalanceAmount,
        Roundoff: params?.RoundOff,
        ReimbursableAmount: 0,
        totalAmountt: 0,
      });
    }

    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate,
      
      WardBedNo: params?.ward,
    });

    setPostInvoice(params?.id);
      setPostInvoiceDate(params?.Billing_Date);

    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);

    setPrintView("Reimbursable");
  };

  const HandlePrintNonReimbursable = (params) => {
    console.log(params, "HandlePrintSummary");

    const nonReimbursableItems = params?.Billing_Items.filter(
      (item) => item.IsReimbursable !== "Yes"
    );
    console.log(nonReimbursableItems, "nonReimbursableItems");
    console.log(nonReimbursableItems.length, "nonReimbursableItems");

    if (nonReimbursableItems.length === 0) {
      console.log("nonReimbursableItems");
      const tdata = {
        message: "No Print available For Non-Reimbursable Items",
        type: "warn",
      };

      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    if (
      params?.PatientCategory === "Insurance" ||
      params?.PatientCategory === "Client"
    ) {
      let updatedTotals = {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalGstamount: 0,
        totalNetAmount: 0,
      };

      let reimbursableTotals = {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalGstamount: 0,
        totalNetAmount: 0,
      };

      let nonReimbursableTotals = {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalGstamount: 0,
        totalNetAmount: 0,
      };

      const reimbursableItems = params?.Billing_Items.filter(
        (item) => item.IsReimbursable === "Yes"
      );
      const nonReimbursableItems = params?.Billing_Items.filter(
        (item) => item.IsReimbursable !== "Yes"
      );

      const calculateTotals = (items) => {
        return items.reduce(
          (totals, item) => {
            totals.totalUnits += +item.Quantity || 0;
            totals.totalAmount += parseFloat(item.Charges) || 0;
            totals.totalDiscount += parseFloat(item.Discount) || 0;
            totals.totalGstamount += parseFloat(item.GST) || 0;
            totals.totalNetAmount += parseFloat(item.NetAmount) || 0;
            return totals;
          },
          {
            totalUnits: 0,
            totalAmount: 0,
            totalDiscount: 0,
            totalGstamount: 0,
            totalNetAmount: 0,
          }
        );
      };

      reimbursableTotals = calculateTotals(reimbursableItems);
      nonReimbursableTotals = calculateTotals(nonReimbursableItems);

      updatedTotals = {
        totalUnits:
          reimbursableTotals.totalUnits + nonReimbursableTotals.totalUnits,
        totalAmount:
          reimbursableTotals.totalAmount + nonReimbursableTotals.totalAmount,
        totalDiscount:
          reimbursableTotals.totalDiscount +
          nonReimbursableTotals.totalDiscount,
        totalGstamount:
          reimbursableTotals.totalGstamount +
          nonReimbursableTotals.totalGstamount,
        totalNetAmount:
          reimbursableTotals.totalNetAmount +
          nonReimbursableTotals.totalNetAmount,
      };

      let additionalDiscount = 0;

      let finalDiscount = Math.min(
        updatedTotals.totalNetAmount,
        updatedTotals.totalDiscount + additionalDiscount
      );

      let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;

      let updatedGst =
        totalTaxableAmount *
          (updatedTotals.totalGstamount / updatedTotals.totalNetAmount) || 0;

      let finalNetAmount = totalTaxableAmount + updatedGst;

      setinitialState((prevState) => ({
        ...prevState,
        totalItems: SelectDatalist.length,
        totalTaxable: updatedTotals.totalAmount.toFixed(2),
        totalUnits: updatedTotals.totalUnits,
        totalDiscount: finalDiscount.toFixed(2),
        totalGstamount: updatedGst.toFixed(2),
        totalNetAmount: finalNetAmount.toFixed(2),
        totalAmount: finalNetAmount.toFixed(2),
        BalanceAmount: (finalNetAmount - prevState.PaidAmount).toFixed(2),
        Roundoff: (Math.round(finalNetAmount) - finalNetAmount).toFixed(2),

        reimbursableTotal: reimbursableTotals.totalNetAmount.toFixed(2),
        nonReimbursableTotal: nonReimbursableTotals.totalNetAmount.toFixed(2),
      }));
    } else {
      setinitialState({
        totalItems: params?.TotalItems,
        totalTaxable: 0,
        totalAmount: params?.TotalAmount,
        totalDiscount: 0,
        totalGstamount: 0,
        totalUnits: 0,
        totalNetAmount: params?.Net_Amount,
        PaidAmount: params?.PaidAmount,
        BalanceAmount: params?.BalanceAmount,
        Roundoff: params?.RoundOff,
        ReimbursableAmount: 0,
        totalAmountt: 0,
      });
    }

    setSelectedPatient_list({
      PatientId: params?.PatientId,
      PatientName: params?.Patient_Name,
      PhoneNumber: params?.PhoneNo,
      PatientCategory: params?.PatientCategory,
      PatientCategoryType: params?.PatientCategoryName,
      Date: params?.Billing_Date,
      VisitId: params?.Visit_Id,
      City: params?.City,
      State: params?.State,
      Pincode: params?.Pincode,
      PatientAddress: params?.Address,
      RegisterId: params?.Register_Id,
      AgeGender: params?.AgeGender,
      AdmissionDate: params?.AdmissionDate,
      
      WardBedNo: params?.ward,
    });

    setPostInvoice(params?.id);
    setPostInvoiceDate(params?.Billing_Date);

    setSelectDatalist(params?.Billing_Items);

    setBillAmount(params?.Payment_Details);

    setPrintView("NonReimbursable");
  };

  useEffect(() => {
    const Card = billAmount.some((p) => p.Payment_Type === "Card");
    const Cheque = billAmount.some((p) => p.Payment_Type === "Cheque");
    const Bank = billAmount.some((p) => p.Payment_Type === "Bank");
    setCondition((prev) => ({
      ...prev,
      hasCard: Card,
      hasBank: Bank,
      hasCheque: Cheque,
    }));
  }, [UrlLink, billAmount]);

  const ForPrintBill = () => {
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
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        {console.log("1234", ClinicDetials)}
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div className="billaddress">
                        <span>PH :</span>{" "}
                        <span>{ClinicDetials.ClinicMobileNo}</span> ,{" "}
                        <span>Landline No :</span>{" "}
                        <span>{ClinicDetials.ClinicLandLineNo}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_billing_address_890">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          D.O.A <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.AdmissionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice No<span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Receipt No<span>:</span>
                        </label>
                        <h4>{RecieptInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Date<span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <br />
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr
                        style={{
                          borderTop: "1.5px solid black",
                          borderBottom: "1.5px solid black",
                        }}
                      >
                        <th style={{ borderTop: "1px solid black" }}>
                          Service Type / Name
                        </th>
                        <th style={{ border: "none" }}>Unit</th>
                        <th style={{ border: "none" }}>Amount</th>
                        <th style={{ border: "none" }}>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        borderBottom: "1.5px solid black",
                        padding: "2px",
                      }}
                    >
                      {console.log("SelectDatalist", SelectDatalist)}

                      {/* Group entries by ServiceType */}
                      {Object.keys(
                        SelectDatalist.reduce((acc, row) => {
                          if (!acc[row.Service_Type]) {
                            acc[row.Service_Type] = [];
                          }
                          acc[row.Service_Type].push(row);
                          return acc;
                        }, {})
                      ).map((Service_Type, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) => row.Service_Type === Service_Type
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.Total_Amount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            {/* Render each ServiceType */}
                            <tr
                              style={{
                                borderTop: "1px solid grey",
                                marginBottom: "10px",
                              }}
                            >
                              <td
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "left",
                                  border: "none",
                                }}
                              >
                                {Service_Type}
                              </td>
                              <td colSpan="3" style={{ border: "none" }}></td>
                            </tr>

                            {/* Render rows for each item under this ServiceType */}
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td
                                  style={{
                                    paddingLeft: "20px",
                                    border: "none",
                                  }}
                                >
                                  {row.Service_Name}
                                </td>
                                <td style={{ border: "none" }}>
                                  {row.Quantity}
                                </td>
                                <td style={{ border: "none" }}>{row.Amount}</td>
                                <td style={{ border: "none" }}>
                                  {row.Total_Amount}
                                </td>
                              </tr>
                            ))}

                            {/* Subtotal row for this ServiceType */}
                            <tr
                              style={{
                                borderTop: "1px solid grey",
                                marginBottom: "10px",
                              }}
                            >
                              <td
                                colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                Sub Total <span>:</span>
                              </td>
                              <td style={{ border: "none" }}>
                                {subtotal.toFixed(2)}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
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
        <br />
      </div>
    );
  };

  const ForPrintBillReceipt = () => {
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
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        {console.log("1234", ClinicDetials)}
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div className="billaddress">
                        <span>PH :</span>{" "}
                        <span>{ClinicDetials.ClinicMobileNo}</span> ,{" "}
                        <span>Landline No :</span>{" "}
                        <span>{ClinicDetials.ClinicLandLineNo}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_billing_address_890">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          D.O.A <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.AdmissionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice No<span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Receipt No<span>:</span>
                        </label>
                        <h4>{RecieptInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Date<span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <br />
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr
                        style={{
                          borderTop: "1.5px solid black",
                          borderBottom: "1.5px solid black",
                        }}
                      >
                        <th style={{ borderTop: "1px solid black" }}>
                          Service Type / Name
                        </th>
                        <th style={{ border: "none" }}>Unit</th>
                        <th style={{ border: "none" }}>Amount</th>
                        <th style={{ border: "none" }}>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        borderBottom: "1.5px solid black",
                        padding: "2px",
                      }}
                    >
                      {console.log("SelectDatalist", SelectDatalist)}

                      {/* Group entries by ServiceType */}
                      {Object.keys(
                        SelectDatalist.reduce((acc, row) => {
                          if (!acc[row.Service_Type]) {
                            acc[row.Service_Type] = [];
                          }
                          acc[row.Service_Type].push(row);
                          return acc;
                        }, {})
                      ).map((Service_Type, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) => row.Service_Type === Service_Type
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.Total_Amount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            {/* Render each ServiceType */}
                            <tr
                              style={{
                                borderTop: "1px solid grey",
                                marginBottom: "10px",
                              }}
                            >
                              <td
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "left",
                                  border: "none",
                                }}
                              >
                                {Service_Type}
                              </td>
                              <td colSpan="3" style={{ border: "none" }}></td>
                            </tr>

                            {/* Render rows for each item under this ServiceType */}
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td
                                  style={{
                                    paddingLeft: "20px",
                                    border: "none",
                                  }}
                                >
                                  {row.Service_Name}
                                </td>
                                <td style={{ border: "none" }}>
                                  {row.Quantity}
                                </td>
                                <td style={{ border: "none" }}>{row.Amount}</td>
                                <td style={{ border: "none" }}>
                                  {row.Total_Amount}
                                </td>
                              </tr>
                            ))}

                            {/* Subtotal row for this ServiceType */}
                            <tr
                              style={{
                                borderTop: "1px solid grey",
                                marginBottom: "10px",
                              }}
                            >
                              <td
                                colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                Sub Total <span>:</span>
                              </td>
                              <td style={{ border: "none" }}>
                                {subtotal.toFixed(2)}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>

                    <tr>
                      <td colSpan="7">
                        <div className="new_billing_invoice_detials">
                          <div className="invoice_detials_total_1">
                            <div className="total_con_bill">
                              <div className="bill_body_new_phar">
                                <table className="selected-medicine-table222 EDWEDE">
                                  <thead>
                                    <tr>
                                      <th>S.No</th>
                                      <th>Payment Type</th>
                                      {Condition.hasCard && <th>Card Type</th>}
                                      {Condition.hasCheque && (
                                        <th>Cheque No</th>
                                      )}
                                      {Condition.hasBank && <th>Bank Name</th>}
                                      <th>Amount</th>
                                      <th>Additional Amount</th>
                                      <th>Transaction Fee</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {billAmount.map((row, index) => (
                                      <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{row.Payment_Type || "-"}</td>
                                        {Condition.hasCard && (
                                          <td>
                                            {row.Payment_Type === "Card"
                                              ? row.Card_Type || "-"
                                              : "-"}
                                          </td>
                                        )}
                                        {Condition.hasCheque && (
                                          <td>
                                            {row.Payment_Type === "Cheque"
                                              ? row.Cheque_No || "-"
                                              : "-"}
                                          </td>
                                        )}
                                        {Condition.hasBank && (
                                          <td>
                                            {row.Payment_Type === "Bank"
                                              ? row.Bank_Name || "-"
                                              : "-"}
                                          </td>
                                        )}
                                        <td>{row.Amount || "-"}</td>
                                        <td>{row.AdditionalAmount || "-"}</td>
                                        <td>
                                          {`${parseInt(
                                            row.Transaction_Amount
                                          )}%` || "-"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {SelectedPatient_list.PatientCategory ===
                                "General" &&
                                Array.isArray(AdvanceAmountGet) &&
                                AdvanceAmountGet.map((row, ind) => (
                                  <div className="bill_body_new_phar">
                                    <label key={ind}>
                                      Advance on {`${row.Date} ${row.Time}`}
                                      <span>:</span>
                                    </label>
                                    <span key={ind}>{row?.AdvanceAmount}</span>
                                  </div>
                                ))}
                              <div className="bill_body_new_phar">
                                <label>
                                  Amount In Words <span>:</span>
                                </label>
                                <span>
                                  {NumberToWords(+initialState.totalNetAmount)}
                                </span>
                              </div>
                              <div className="bill_body_new_phar">
                                <label>
                                  Billed By <span>:</span>
                                </label>
                                <span>{UserData?.Employeename}</span>
                              </div>
                            </div>

                            <div>
                              <div className="bill_body_new_phar">
                                <label>
                                  Gross Amount <span>:</span>
                                </label>
                                <span>{initialState.totalAmount}</span>
                              </div>
                              <div className="bill_body_new_phar">
                                <label>
                                  Net Amount <span>:</span>
                                </label>
                                <span>{initialState.totalNetAmount}</span>
                              </div>

                              <div className="bill_body_new_phar">
                                <label>
                                  Paid Amount <span>:</span>
                                </label>
                                <span>{initialState.PaidAmount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
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
        <br />
      </div>
    );
  };

  const ForPrintReceipt = () => {};

  const ForPrintSumData = () => {
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
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(" ")}{" "}
                          {/* Removed extra commas here */}
                        </span>
                      </div>
                      <div className="billaddress">
                        <span>PH :</span>{" "}
                        <span>{ClinicDetials.ClinicMobileNo}</span> ,{" "}
                        <span>Landline No :</span>{" "}
                        <span>{ClinicDetials.ClinicLandLineNo}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Summary Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_billing_address_890">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          HIS No<span>:</span>
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
                        <h4>{SelectedPatient_list.AdmissionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Address}</h4>
                      </div>
                      {/* Address */}
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr>
                        <th>Service Type / Name</th>
                        <th>Unit</th>
                        <th>Amount</th>
                        <th>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(
                        SelectDatalist1.reduce((acc, row) => {
                          if (!acc[row.Service_Type]) {
                            acc[row.Service_Type] = [];
                          }
                          acc[row.Service_Type].push(row);
                          return acc;
                        }, {})
                      ).map((Service_Type, index) => {
                        const serviceRows = SelectDatalist1.filter(
                          (row) => row.Service_Type === Service_Type
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.Total_Amount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td colSpan="4" style={{ fontWeight: "bold" }}>
                                {Service_Type}
                              </td>
                            </tr>
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td>{row.Service_Name}</td>
                                <td>{row.Quantity}</td>
                                <td>{row.Amount}</td>
                                <td>{row.Total_Amount}</td>
                              </tr>
                            ))}
                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                Sub Total:
                              </td>
                              <td>{subtotal.toFixed(2)}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
            <div>
              <div colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <table className="selected-medicine-table222 EDWEDE">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Payment Type</th>
                              {Condition.hasCard && <th>Card Type</th>}
                              {Condition.hasCheque && <th>Cheque No</th>}
                              {Condition.hasBank && <th>Bank Name</th>}
                              <th>Amount</th>
                              <th>Additional Amount</th>
                              <th>Transaction Fee</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billAmount.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Payment_Type || "-"}</td>
                                {Condition.hasCard && (
                                  <td>
                                    {row.Payment_Type === "Card"
                                      ? row.Card_Type || "-"
                                      : "-"}
                                  </td>
                                )}
                                {Condition.hasCheque && (
                                  <td>
                                    {row.Payment_Type === "Cheque"
                                      ? row.Cheque_No || "-"
                                      : "-"}
                                  </td>
                                )}
                                {Condition.hasBank && (
                                  <td>
                                    {row.Payment_Type === "Bank"
                                      ? row.Bank_Name || "-"
                                      : "-"}
                                  </td>
                                )}
                                <td>{row.Amount || "-"}</td>
                                <td>{row.AdditionalAmount || "-"}</td>
                                <td>
                                  {`${parseInt(row.Transaction_Amount)}%` ||
                                    "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {SelectedPatient_list.PatientCategory === "General" &&
                        AdvanceAmountGet.map((row, ind) => (
                          <div className="bill_body_new_phar">
                            <label key={ind}>
                              Advance on {`${row.Date} ${row.Time}`}{" "}
                              <span>:</span>
                            </label>
                            <span key={ind}>{row?.AdvanceAmount}</span>
                          </div>
                        ))}
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>
                          {NumberToWords(+initialState.totalNetAmount)}
                        </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{UserData?.Employeename}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Gross Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Net Amount <span>:</span>
                        </label>
                        <span>{initialState.totalNetAmount}</span>
                      </div>

                      <div className="bill_body_new_phar">
                        <label>
                          Paid Amount <span>:</span>
                        </label>
                        <span>{initialState.PaidAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <br />
            <td
              colSpan="7"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                color: "black",
                fontSize: "20px",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  fontWeight: "bolder",
                  color: "black",
                  fontSize: "18px",
                  marginTop: "10px",
                }}
              >
                Duplicate Copy Of Original Bill
              </h4>
            </td>
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
        <br />
      </div>
    );
  };

  const ForPrintDataCash = () => {
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
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientAddress}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg  wdwdwswdw">
                        <label>
                          Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>

                      {/* <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Consultant <span>:</span></label>
                                            <h4>{IP_BillingData.Doctor_ShortName}</h4>
                      </div> */}
                    </div>
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
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
                        <h4>{PostInvoicedate}</h4>
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
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
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
                            {row.Service_Name || "-"}
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
                            {row.Charge || "0.00"}
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
                            {row.Discount_Amount || "0.00"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            {row.Total_Amount}
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
                            (sum, row) => sum + parseFloat(row.Discount_Amount || 0),
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
                            (sum, row) => sum + parseFloat(row.Total_Amount || 0),
                            0
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>

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

  {Pharmadetails.length > 0 && (
      <div style={{ marginBottom: "20px" }}>
    {/* Pharmacy Items Table */}
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
        {/* Total Medicines Row */}
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
                {/* Total Refund Medicines Row */}
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
      

            {/* Summary Section */}
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
    )}


                      {AdvanceAmountGet.length > 0 && (
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
                      )}

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
                                      {row.Payment_Type || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        {row.Payment_Type === "Card"
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
                                        {row.Payment_Type === "Cheque"
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
                                        {row.Payment_Type === "Bank"
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
                                      {row.Amount || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.Payment_Type === "Card" &&
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
                        <div style={{ marginBottom: "10px", display:"flex", gap: "3px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            Amount In Words:{" "}
                          </label>
                          <span>
                            {NumberToWords(+initialState.totalNetAmount)}
                          </span>
                        </div>
                        <div style={{ display:"flex", gap: "5px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            Billed By:{" "}
                          </label>
                          <span>{SelectedPatient_list.Billedby}</span>
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
                        <span style={{ fontWeight: "bold" }}>Grand Total:</span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.Grandtotal}
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
                          Trust Discount:
                        </span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.SchemeDiscount}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", borderBottom: "1px solid black ", }}>
                                            <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                                            <span style={{ fontWeight: 900 ,fontSize:"15px" }}>{Amountdetails.Totalamount}</span>
                                        </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          Final Discount:
                        </span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.FinalDiscount}
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
                            Total Advance:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {AdvanceTotal}
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
                            Final NetAmt:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Finalnetamt}
                          </span>
                        </div>
                     
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}> Paid Amount:</span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.Paidamt}
                        </span>
                      </div>
                      
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


  const ForPrintDataCashReceipt = () => {
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
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientAddress}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg  wdwdwswdw">
                        <label>
                          Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>

                      {/* <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Consultant <span>:</span></label>
                                            <h4>{IP_BillingData.Doctor_ShortName}</h4>
                      </div> */}
                    </div>
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
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
                        <h4>{PostInvoicedate}</h4>
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
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
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
                            {row.Service_Name || "-"}
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
                            {row.Charge || "0.00"}
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
                            {row.Discount_Value || "0.00"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            {row.Total_Amount}
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
                            (sum, row) => sum + parseFloat(row.Total_Amount || 0),
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
                                      {row.Payment_Type || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        {row.Payment_Type === "Card"
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
                                        {row.Payment_Type === "Cheque"
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
                                        {row.Payment_Type === "Bank"
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
                                      {row.Amount || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.Payment_Type === "Card" &&
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
                        <div style={{ marginBottom: "10px", display:"flex", gap: "3px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            Amount In Words:{" "}
                          </label>
                          <span>
                            {NumberToWords(+initialState.totalNetAmount)}
                          </span>
                        </div>
                        <div style={{ display:"flex", gap: "5px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            Billed By:{" "}
                          </label>
                          <span>{SelectedPatient_list.Billedby}</span>
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
                        <span style={{ fontWeight: "bold" }}>Grand Total:</span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.Grandtotal}
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
                          Trust Discount:
                        </span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.SchemeDiscount}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", borderBottom: "1px solid black ", }}>
                                            <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                                            <span style={{ fontWeight: 900 ,fontSize:"15px" }}>{Amountdetails.Totalamount}</span>
                                        </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          Final Discount:
                        </span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.FinalDiscount}
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
                            Total Advance:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {AdvanceTotal}
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
                            Final NetAmt:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Finalnetamt}
                          </span>
                        </div>
                     
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}> Paid Amount:</span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.Paidamt}
                        </span>
                      </div>
                      
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




  
  const ForPrintDataRefund = () => {
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
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientAddress}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg  wdwdwswdw">
                        <label>
                          Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>

                      {/* <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Consultant <span>:</span></label>
                                            <h4>{IP_BillingData.Doctor_ShortName}</h4>
                      </div> */}
                    </div>
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
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
                        <h4>{PostInvoicedate}</h4>
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
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
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
                            {row.Service_Name || "-"}
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
                            {row.Charge || "0.00"}
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
                            {row.Discount_Amount || "0.00"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            {row.Total_Amount}
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
                            (sum, row) => sum + parseFloat(row.Discount_Amount || 0),
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
                            (sum, row) => sum + parseFloat(row.Total_Amount || 0),
                            0
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>

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

                       {Pharmadetails.length > 0 && (
      <div style={{ marginBottom: "20px" }}>
    {/* Pharmacy Items Table */}
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
        {/* Total Medicines Row */}
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
                {/* Total Refund Medicines Row */}
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
      

            {/* Summary Section */}
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
    )}


                      {AdvanceAmountGet.length > 0 && (
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
                      )}

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
                                      {row.Payment_Type || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        {row.Payment_Type === "Card"
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
                                        {row.Payment_Type === "Cheque"
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
                                        {row.Payment_Type === "Bank"
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
                                      {row.Amount || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.Payment_Type === "Card" &&
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
                        <div style={{ marginBottom: "10px", display:"flex", gap: "3px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            Amount In Words:{" "}
                          </label>
                          <span>
                            {NumberToWords(+initialState.totalNetAmount)}
                          </span>
                        </div>
                        <div style={{ display:"flex", gap: "5px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            Billed By:{" "}
                          </label>
                          <span>{SelectedPatient_list.Billedby}</span>
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
                        <span style={{ fontWeight: "bold" }}>Grand Total:</span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.Grandtotal}
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
                          Trust Discount:
                        </span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.SchemeDiscount}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", borderBottom: "1px solid black ", }}>
                                            <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                                            <span style={{ fontWeight: 900 ,fontSize:"15px" }}>{Amountdetails.Totalamount}</span>
                                        </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          Final Discount:
                        </span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.totalDiscount}
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
                            Total Advance:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {AdvanceTotal}
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
                            Final NetAmt:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Finalnetamt}
                          </span>
                        </div>
                       
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}> Refund Amount:</span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.Refundamt}
                        </span>
                      </div>
                      
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


  const ForPrintDataRefundReceipt = () => {
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
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientAddress}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg  wdwdwswdw">
                        <label>
                          Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>

                      {/* <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Consultant <span>:</span></label>
                                            <h4>{IP_BillingData.Doctor_ShortName}</h4>
                      </div> */}
                    </div>
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
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
                        <h4>{PostInvoicedate}</h4>
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
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
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
                            {row.Service_Name || "-"}
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
                            {row.Charge || "0.00"}
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
                            {row.Discount_Value || "0.00"}
                          </td>
                          <td
                            style={{
                              padding: "8px",
                              border: "1px solid #ddd",
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            {row.Total_Amount}
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
                            (sum, row) => sum + parseFloat(row.Discount_Value || 0),
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
                            (sum, row) => sum + parseFloat(row.Total_Amount || 0),
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
                                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Item Name</th>
                                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Qty</th>
                                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Rate</th>
                                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Amount</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {Pharmadetails.map((item, index) => (
                                                <tr key={index}>
                                                  <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
                                                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Billing_Type || "-"}</td>
                                                  <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>1</td> 
                                                  <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>{item.Net_Amount || '0.00'}</td>
                                                  <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>{item.Net_Amount || '0.00'}</td>
                                                </tr>
                                              ))}
                                              <tr style={{ fontWeight: "bold", borderTop: "1px solid grey" }}>
                                                <td colSpan="4" style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>Total Medicines</td>
                                                <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                                                  {Pharmadetails.reduce((sum, item) => sum + parseFloat(item.Net_Amount || 0), 0).toFixed(2)}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
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
                                      {row.Payment_Type || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        {row.Payment_Type === "Card"
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
                                        {row.Payment_Type === "Cheque"
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
                                        {row.Payment_Type === "Bank"
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
                                      {row.Amount || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.Payment_Type === "Card" &&
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
                        <div style={{ marginBottom: "10px", display:"flex", gap: "3px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            Amount In Words:{" "}
                          </label>
                          <span>
                            {NumberToWords(+initialState.totalNetAmount)}
                          </span>
                        </div>
                        <div style={{ display:"flex", gap: "5px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            Billed By:{" "}
                          </label>
                          <span>{SelectedPatient_list.Billedby}</span>
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
                        <span style={{ fontWeight: "bold" }}>Grand Total:</span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.Grandtotal}
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
                          Trust Discount:
                        </span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.SchemeDiscount}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", borderBottom: "1px solid black ", }}>
                                            <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                                            <span style={{ fontWeight: 900 ,fontSize:"15px" }}>{Amountdetails.Totalamount}</span>
                                        </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          Final Discount:
                        </span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.totalDiscount}
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
                            Total Advance:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {AdvanceTotal}
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
                            Final NetAmt:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Finalnetamt}
                          </span>
                        </div>
                       
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}> Refund Amount:</span>
                        <span style={{ fontWeight: 900, fontSize: "15px" }}>
                          {Amountdetails.Refundamt}
                        </span>
                      </div>
                      
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

  const ForPrintData = () => {

  }

  
  const ForPrintCreditData = () => {
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
                            {[ClinicDetails?.ClinicAddress]
                              .filter((detail) => detail)
                              .join(", ")}
                            ,
                            {[
                              ClinicDetials?.ClinicCity,
                              ClinicDetials?.ClinicState,
                              ClinicDetails?.ClinicCode,
                            ]
                              .filter((detail) => detail)
                              .join(", ")}
                          </span>
                        </div>
                        <div>
                          {[
                            ClinicDetails?.ClinicMobileNo,
                            ClinicDetails?.ClinicLandLineNo,
                            ClinicDetails?.ClinicMailID,
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
                          <h4>{SelectedPatient_list.PatientName}</h4>
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
                          <h4>{SelectedPatient_list.AdmissionDate}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                          <label>
                            Address <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.PatientAddress}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                          <label>
                            Mobile No <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.PhoneNumber}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                          <label>
                            Consultant <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.Doctor_Name}</h4>
                        </div>
                      </div>
                      <div className="new_billing_address_2 new_billing_address_2_new_up">
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                          <label>
                            IP NO <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.RegisterId}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                          <label>
                            Ward - Bed No <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.WardBedNo}</h4>
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
                          <h4>{PostInvoicedate}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                          <label>
                            Payer Type <span>:</span>
                          </label>
                          <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                          <label>
                            Discharge Date <span>:</span>
                          </label>
                           <h4>{PostInvoicedate}</h4>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </thead>
  
              <tbody>
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
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            S.No
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Service Name
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Credit No
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Charge
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Qty
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Amount
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Discount
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
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
                              {row.Service_Name || "-"}
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
                              {row.Charge || "0.00"}
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
                              {row.Discount_Amount || "0.00"}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {row.Total_Amount}
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
                              (sum, row) => sum + parseFloat(row.Discount_Amount || 0),
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
                              (sum, row) => sum + parseFloat(row.Total_Amount || 0),
                              0
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
  
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
                        {Pharmadetails.length > 0 && (
                          <div style={{ marginBottom: "20px" }}>
                            <h4
                              style={{
                                marginBottom: "10px",
                                borderBottom: "1px solid #ddd",
                                paddingBottom: "5px",
                              }}
                            >
                              Pharmacy Items
                            </h4>
                            <table
                              className="print-table33"
                              style={{ width: "100%", borderCollapse: "collapse" }}
                            >
                              <thead>
                                <tr style={{ backgroundColor: "#f5f5f5" }}>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    S.No
                                  </th>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    Item Name
                                  </th>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    Qty
                                  </th>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    Rate
                                  </th>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {Pharmadetails.map((item, index) => (
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
                                      {item.Billing_Type || "-"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        textAlign: "center",
                                      }}
                                    >
                                      1
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                      }}
                                    >
                                      {item.Net_Amount || "0.00"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                      }}
                                    >
                                      {item.Net_Amount || "0.00"}
                                    </td>
                                  </tr>
                                ))}
                                <tr
                                  style={{ fontWeight: "bold", borderTop: "1px solid grey" }}
                                >
                                  <td
                                    colSpan="4"
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #ddd",
                                      textAlign: "right",
                                    }}
                                  >
                                    Total Medicines
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #ddd",
                                      textAlign: "right",
                                    }}
                                  >
                                    {Pharmadetails.reduce(
                                      (sum, item) => sum + parseFloat(item.Net_Amount || 0),
                                      0
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

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
                {/* Total Refund Medicines Row */}
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

            {/* Summary Section */}
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
  
                        {AdvanceAmountGet.length > 0 && (
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
                        )}
  
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
                                      {row.Payment_Type || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        {row.Payment_Type === "Card"
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
                                        {row.Payment_Type === "Cheque"
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
                                        {row.Payment_Type === "Bank"
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
                                      {row.Amount || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.Payment_Type === "Card" &&
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
                            <span>{NumberToWords(+initialState.totalNetAmount)}</span>
                          </div>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <label style={{ fontWeight: "bold" }}>Billed By: </label>
                            <span>{SelectedPatient_list.Billedby}</span>
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
                          <span style={{ fontWeight: "bold" }}>Grand Total:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Grandtotal}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "2px",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Trust Discount:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.SchemeDiscount}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Totalamount}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Final Discount:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.FinalDiscount}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "2px",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Total Advance:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {AdvanceTotal}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "2px",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Final NetAmt:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Finalnetamt}
                          </span>
                        </div>
                        
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            Paid Amount:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Paidamt}
                          </span>
                        </div>
  
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            Credit amount
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Creditamt}
                          </span>
                        </div>
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




  const ForPrintCreditDataCGHS = () => {
  // State for the reference form fields
  const [formData, setFormData] = useState({
    refNo: SelectedPatient_list?.refNo || "",
    refDate: SelectedPatient_list?.refDate || "",
    employeeId: SelectedPatient_list?.employeeId|| "",
    employeeName: SelectedPatient_list?.employeeName || "",
    crNo: SelectedPatient_list?.crNo || "",
    designation: SelectedPatient_list?.designation || "",
    Relation: SelectedPatient_list?.Relation || "",
    UMIDNO : SelectedPatient_list?.UMIDNO || ""
  });

  const handlecghsSubmit = () => {
    const data = {
      ...formData,
      PostInvoice : PostInvoice
    };

    console.log(data,'data')

    axios.post(`${UrlLink}Frontoffice/CGHS_Link`, data)
      .then((res) => {
        const response = res.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        dispatchvalue({
          type: 'toast',
          value: { message: messageContent, type: messageType },
        });
      })
      .catch((err) => {
        console.log(err);
        dispatchvalue({
          type: 'toast',
          value: { message: 'An error occurred while saving the datas.', type: 'error' },
        });
      });
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  // Group SelectDatalist by VoucherNo for consolidated view
  const groupByVoucherNo = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const voucherNo = item.VoucherNo || 'No Voucher';
      if (!grouped[voucherNo]) {
        grouped[voucherNo] = [];
      }
      grouped[voucherNo].push(item);
    });
    return grouped;
  };

  const groupedData = groupByVoucherNo(SelectDatalist);
  const voucherNos = Object.keys(groupedData);

  // Calculate totals for each voucher group
  const voucherTotals = {};
  voucherNos.forEach(voucherNo => {
    const items = groupedData[voucherNo];
    voucherTotals[voucherNo] = {
      amount: items.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0),
      discount: items.reduce((sum, row) => sum + parseFloat(row.Discount_Value || row.Discount || 0), 0),
      netAmount: items.reduce((sum, row) => sum + parseFloat(row.Total_Amount || row.NetAmount || 0), 0)
    };
  });

  // Calculate grand totals
  const grandTotalAmount = SelectDatalist.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0);
  const grandTotalDiscount = SelectDatalist.reduce((sum, row) => sum + parseFloat(row.Discount_Value || row.Discount || 0), 0);
  const grandTotalNetAmount = SelectDatalist.reduce((sum, row) => sum + parseFloat(row.Total_Amount || row.NetAmount || 0), 0);

  let serialNumber = 0;

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
        {/* Add print styles */}
        <style>
          {`
            /* This will hide the form only during printing */
            @media print {
              .hide-on-print {
                display: none !important;
              }
            }
            
            /* This ensures the form is visible on screen */
            .hide-on-print {
              display: block;
            }
          `}
        </style>
        
        {/* Editable Form - Visible on screen, hidden during print */}
        <div className="hide-on-print" style={{ 
          marginBottom: "20px", 
          padding: "15px", 
          border: "1px solid #ddd", 
          borderRadius: "5px", 
          backgroundColor: "#f9f9f9" 
        }}>
          <h3 style={{ 
            marginBottom: "15px", 
            fontSize: "16px", 
            color: "#333" 
          }}>
            Reference Information (Editable)
          </h3>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "15px" 
          }}>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontSize: "12px", 
                fontWeight: "bold" 
              }}>
                Ref No:
              </label>
              <input
                type="text"
                value={formData.refNo}
                onChange={(e) => handleInputChange('refNo', e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "3px", 
                  fontSize: "12px" 
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontSize: "12px", 
                fontWeight: "bold" 
              }}>
                Ref Date:
              </label>
              <input
                type="date"
                value={formData.refDate}
                onChange={(e) => handleInputChange('refDate', e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "3px", 
                  fontSize: "12px" 
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontSize: "12px", 
                fontWeight: "bold" 
              }}>
                Employee ID:
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "3px", 
                  fontSize: "12px" 
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontSize: "12px", 
                fontWeight: "bold" 
              }}>
                Employee Name:
              </label>
              <input
                type="text"
                value={formData.employeeName}
                onChange={(e) => handleInputChange('employeeName', e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "3px", 
                  fontSize: "12px" 
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontSize: "12px", 
                fontWeight: "bold" 
              }}>
                CR No:
              </label>
              <input
                type="text"
                value={formData.crNo}
                onChange={(e) => handleInputChange('crNo', e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "3px", 
                  fontSize: "12px" 
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontSize: "12px", 
                fontWeight: "bold" 
              }}>
                Relation:
              </label>
              <input
                type="text"
                value={formData.Relation}
                onChange={(e) => handleInputChange('Relation', e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "3px", 
                  fontSize: "12px" 
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontSize: "12px", 
                fontWeight: "bold" 
              }}>
                Designation:
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "3px", 
                  fontSize: "12px" 
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontSize: "12px", 
                fontWeight: "bold" 
              }}>
                UMIDNO:
              </label>
              <input
                type="text"
                value={formData.UMIDNO}
                onChange={(e) => handleInputChange('UMIDNO', e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "3px", 
                  fontSize: "12px" 
                }}
              />
            </div>
          </div>
          
          <div style={{ 
            marginTop: "20px", 
            textAlign: "right" 
          }}>
            <button
              onClick={handlecghsSubmit}
              style={{
                padding: "8px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
            >
              Save Reference Data
            </button>
          </div>
        </div>

        {/* Printable Content - This will always show, even in print */}
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
              <td colSpan="9" style={{ border: "none" }}>
                <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                  <div className="new_billing_logo_con">
                    <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                  </div>
                  <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                    <span>{ClinicDetails?.Cname}</span>
                    <div>
                      <span>
                        {[ClinicDetails?.ClinicAddress]
                          .filter((detail) => detail)
                          .join(", ")}
                        
                      </span>
                    </div>
                    
                    <div>
                      {[
                        ClinicDetails?.ClinicMobileNo,
                        ClinicDetails?.ClinicLandLineNo,
                        ClinicDetails?.ClinicMailID,
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
                colSpan="9"
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  color: "black",
                  fontSize: "18px",
                }}
              >
                CONSOLIDATED DISCHARGE BILL
              </td>
            </tr>
            <tr>
              <td colSpan="9">
                <div className="new_billing_address new_addn_p037">
                  <div className="new_billing_address_2 new_billing_address_2_new_up">
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Ref No <span>:</span>
                      </label>
                      <h4>{formData.refNo}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Ref Date <span>:</span>
                      </label>
                      <h4>{formData.refDate}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Employee ID <span>:</span>
                      </label>
                      <h4>{formData.employeeId}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Employee Name <span>:</span>
                      </label>
                      <h4>{formData.employeeName}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        CR No <span>:</span>
                      </label>
                      <h4>{formData.crNo}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Relation <span>:</span>
                      </label>
                      <h4>{formData.Relation}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Designation <span>:</span>
                      </label>
                      <h4>{formData.designation}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        UMIDNO <span>:</span>
                      </label>
                      <h4>{formData.UMIDNO}</h4>
                    </div>
                  </div>
                  <div className="new_billing_address_2 new_billing_address_2_new_up">
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Patient Name <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.PatientName}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Patient ID <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.PatientId}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Age / Gender <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.AgeGender}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        IP NO <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.RegisterId}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Invoice No<span>:</span>
                      </label>
                      <h4>{PostInvoice}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Consultant <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.Doctor_Name}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        D.O.A <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.AdmissionDate}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Discharge Date <span>:</span>
                      </label>
                      <h4>{PostInvoicedate}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        No.Of.Days <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.no_of_days}</h4>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="9" className="prin_nnrmll_table">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                  <thead>
                    <tr
                      style={{
                        borderTop: "1.5px solid black",
                        borderBottom: "1.5px solid black",
                        backgroundColor: "#f5f5f5",
                        lineHeight: "1.2"
                      }}
                    >
                      <th style={{ padding: "4px", border: "1px solid #ddd" }}>
                        S.No
                      </th>
                      <th style={{ padding: "4px", border: "1px solid #ddd" }}>
                        CGHS Code
                      </th>
                      <th style={{ padding: "4px", border: "1px solid #ddd" }}>
                        Service Name
                      </th>
                      <th style={{ padding: "4px", border: "1px solid #ddd" }}>
                        Credit No
                      </th>
                      <th style={{ padding: "4px", border: "1px solid #ddd" }}>
                        Charge
                      </th>
                      <th style={{ padding: "4px", border: "1px solid #ddd" }}>
                        Qty
                      </th>
                      <th style={{ padding: "4px", border: "1px solid #ddd" }}>
                        Amount
                      </th>
                      <th style={{ padding: "4px", border: "1px solid #ddd" }}>
                        Discount
                      </th>
                      <th style={{ padding: "4px", border: "1px solid #ddd" }}>
                        Net Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ borderBottom: "1.5px solid black" }}>
                    {voucherNos.map((voucherNo) => (
                      <>
                        {groupedData[voucherNo].map((row, index) => {
                          serialNumber++;
                          return (
                            <tr key={`${voucherNo}-${index}`} style={{ lineHeight: "1.1" }}>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid #ddd",
                                  textAlign: "center",
                                }}
                              >
                                {serialNumber}
                              </td>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid #ddd",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.CGHSCode || '-'}
                              </td>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid #ddd",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Service_Name || row.SelectItemName || "-"}
                              </td>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid #ddd",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.VoucherNo || "-"}
                              </td>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Charge || row.Charges || "0.00"}
                              </td>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid #ddd",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Quantity || "1"}
                              </td>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Amount || "0.00"}
                              </td>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Discount_Amount || row.Discount || "0.00"}
                              </td>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                {row.Total_Amount || row.NetAmount || "0.00"}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Subtotal for each voucher group */}
                        <tr style={{ backgroundColor: '#f0f0f0', fontWeight: "bold", lineHeight: "1.2" }}>
                          <td colSpan="6" style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right", fontStyle: 'italic' }}>
                            Sub Total
                          </td>
                          <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right", fontStyle: 'italic' }}>
                            {voucherTotals[voucherNo].amount.toFixed(2)}
                          </td>
                          <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right", fontStyle: 'italic' }}>
                            {voucherTotals[voucherNo].Discount_Amount.toFixed(2)}
                          </td>
                          <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right", fontStyle: 'italic' }}>
                            {voucherTotals[voucherNo].netAmount.toFixed(2)}
                          </td>
                        </tr>
                      </>
                    ))}
                    
                    {/* Grand Total */}
                    <tr
                      style={{
                        borderTop: "1px solid grey",
                        fontWeight: "bold",
                        lineHeight: "1.2"
                      }}
                    >
                      <td
                        colSpan="6"
                        style={{
                          padding: "4px",
                          border: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        Grand Total
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          border: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {grandTotalAmount.toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          border: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {grandTotalDiscount.toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: "4px",
                          border: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {grandTotalNetAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>

          <tr>
            <td colSpan="9">
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
                    {Pharmadetails.length > 0 && (
                      <div style={{ marginBottom: "20px" }}>
                        <h4
                          style={{
                            marginBottom: "10px",
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "5px",
                          }}
                        >
                          Pharmacy Items
                        </h4>
                        <table
                          className="print-table33"
                          style={{ width: "100%", borderCollapse: "collapse" }}
                        >
                          <thead>
                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                              <th
                                style={{ padding: "8px", border: "1px solid #ddd" }}
                              >
                                S.No
                              </th>
                              <th
                                style={{ padding: "8px", border: "1px solid #ddd" }}
                              >
                                Item Name
                              </th>
                              <th
                                style={{ padding: "8px", border: "1px solid #ddd" }}
                              >
                                Qty
                              </th>
                              <th
                                style={{ padding: "8px", border: "1px solid #ddd" }}
                              >
                                Rate
                              </th>
                              <th
                                style={{ padding: "8px", border: "1px solid #ddd" }}
                              >
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Pharmadetails.map((item, index) => (
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
                                  {item.Billing_Type || "-"}
                                </td>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                  }}
                                >
                                  1
                                </td>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    textAlign: "right",
                                  }}
                                >
                                  {item.Net_Amount || "0.00"}
                                </td>
                                <td
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #ddd",
                                    textAlign: "right",
                                  }}
                                >
                                  {item.Net_Amount || "0.00"}
                                </td>
                              </tr>
                            ))}
                            <tr
                              style={{ fontWeight: "bold", borderTop: "1px solid grey" }}
                            >
                              <td
                                colSpan="4"
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                }}
                              >
                                Total Medicines
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  textAlign: "right",
                                }}
                              >
                                {Pharmadetails.reduce(
                                  (sum, item) => sum + parseFloat(item.Net_Amount || 0),
                                  0
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

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
                            {/* Total Refund Medicines Row */}
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

                    {/* Summary Section */}
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

                    {AdvanceAmountGet.length > 0 && (
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
                    )}

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
                                  {row.Payment_Type || "-"}
                                </td>
                                {hasCard && (
                                  <td
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    {row.Payment_Type === "Card"
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
                                    {row.Payment_Type === "Cheque"
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
                                    {row.Payment_Type === "Bank"
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
                                  {row.Amount || "-"}
                                </td>
                                {hasCard && (
                                  <td
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #ddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    {row.Payment_Type === "Card" &&
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
                        <span>{NumberToWords(+grandTotalNetAmount)}</span>
                      </div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <label style={{ fontWeight: "bold" }}>Billed By: </label>
                        <span>{SelectedPatient_list.Billedby}</span>
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
                      <span style={{ fontWeight: "bold" }}>Grand Total:</span>
                      <span style={{ fontWeight: 900, fontSize: "15px" }}>
                        {grandTotalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2px",
                        borderBottom: "1px solid black",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Trust Discount:</span>
                      <span style={{ fontWeight: 900, fontSize: "15px" }}>
                        {grandTotalDiscount.toFixed(2)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                        borderBottom: "1px solid black",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                      <span style={{ fontWeight: 900, fontSize: "15px" }}>
                        {grandTotalNetAmount.toFixed(2)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Final Discount:</span>
                      <span style={{ fontWeight: 900, fontSize: "15px" }}>
                        {(grandTotalDiscount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2px",
                        borderBottom: "1px solid black",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Total Advance:</span>
                      <span style={{ fontWeight: 900, fontSize: "15px" }}>
                        {AdvanceTotal}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2px",
                        borderBottom: "1px solid black",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Final NetAmt:</span>
                      <span style={{ fontWeight: 900, fontSize: "15px" }}>
                        {grandTotalNetAmount.toFixed(2)}
                      </span>
                    </div>
                    
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        Paid Amount:
                      </span>
                      <span style={{ fontWeight: 900, fontSize: "15px" }}>
                        {Amountdetails?.Paidamt || "0.00"}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        Credit amount
                      </span>
                      <span style={{ fontWeight: 900, fontSize: "15px" }}>
                        {Amountdetails?.Creditamt || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tfoot className="print_footerr">
            <tr>
              <td
                colSpan="9"
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

      {/* Print and Close buttons - Also hidden during print */}
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



  const ForPrintCreditReceipt = () => {
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
                            {[ClinicDetails?.ClinicAddress]
                              .filter((detail) => detail)
                              .join(", ")}
                            ,
                            {[
                              ClinicDetials?.ClinicCity,
                              ClinicDetials?.ClinicState,
                              ClinicDetails?.ClinicCode,
                            ]
                              .filter((detail) => detail)
                              .join(", ")}
                          </span>
                        </div>
                        <div>
                          {[
                            ClinicDetails?.ClinicMobileNo,
                            ClinicDetails?.ClinicLandLineNo,
                            ClinicDetails?.ClinicMailID,
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
                          <h4>{SelectedPatient_list.PatientName}</h4>
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
                          <h4>{SelectedPatient_list.AdmissionDate}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                          <label>
                            Address <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.PatientAddress}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                          <label>
                            Mobile No <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.PhoneNumber}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                          <label>
                            Consultant <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.Doctor_ShortName}</h4>
                        </div>
                      </div>
                      <div className="new_billing_address_2 new_billing_address_2_new_up">
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                          <label>
                            IP NO <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.RegisterId}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                          <label>
                            Ward - Bed No <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.WardBedNo}</h4>
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
                          <h4>{PostInvoicedate}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                          <label>
                            Payer Type <span>:</span>
                          </label>
                          <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                        </div>
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                          <label>
                            Discharge Date <span>:</span>
                          </label>
                           <h4>{PostInvoicedate}</h4>
                        </div>
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
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            S.No
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Service Name
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Credit No
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Charge
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Qty
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Amount
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                            Discount
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
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
                              {row.Service_Name || "-"}
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
                              {row.Charge || "0.00"}
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
                              {row.Discount_Value || "0.00"}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {row.Total_Amount}
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
                              (sum, row) => sum + parseFloat(row.Discount_Value || 0),
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
                              (sum, row) => sum + parseFloat(row.Total_Amount || 0),
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
                        {Pharmadetails.length > 0 && (
                          <div style={{ marginBottom: "20px" }}>
                            <h4
                              style={{
                                marginBottom: "10px",
                                borderBottom: "1px solid #ddd",
                                paddingBottom: "5px",
                              }}
                            >
                              Pharmacy Items
                            </h4>
                            <table
                              className="print-table33"
                              style={{ width: "100%", borderCollapse: "collapse" }}
                            >
                              <thead>
                                <tr style={{ backgroundColor: "#f5f5f5" }}>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    S.No
                                  </th>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    Item Name
                                  </th>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    Qty
                                  </th>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    Rate
                                  </th>
                                  <th
                                    style={{ padding: "8px", border: "1px solid #ddd" }}
                                  >
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {Pharmadetails.map((item, index) => (
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
                                      {item.Billing_Type || "-"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        textAlign: "center",
                                      }}
                                    >
                                      1
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                      }}
                                    >
                                      {item.Net_Amount || "0.00"}
                                    </td>
                                    <td
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                      }}
                                    >
                                      {item.Net_Amount || "0.00"}
                                    </td>
                                  </tr>
                                ))}
                                <tr
                                  style={{ fontWeight: "bold", borderTop: "1px solid grey" }}
                                >
                                  <td
                                    colSpan="4"
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #ddd",
                                      textAlign: "right",
                                    }}
                                  >
                                    Total Medicines
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #ddd",
                                      textAlign: "right",
                                    }}
                                  >
                                    {Pharmadetails.reduce(
                                      (sum, item) => sum + parseFloat(item.Net_Amount || 0),
                                      0
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

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
                {/* Total Refund Medicines Row */}
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

            {/* Summary Section */}
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
  
                        {AdvanceAmountGet.length > 0 && (
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
                        )}
  
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
                                      {row.Payment_Type || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        {row.Payment_Type === "Card"
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
                                        {row.Payment_Type === "Cheque"
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
                                        {row.Payment_Type === "Bank"
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
                                      {row.Amount || "-"}
                                    </td>
                                    {hasCard && (
                                      <td
                                        style={{
                                          padding: "8px",
                                          border: "1px solid #ddd",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.Payment_Type === "Card" &&
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
                            <span>{NumberToWords(+initialState.totalNetAmount)}</span>
                          </div>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <label style={{ fontWeight: "bold" }}>Billed By: </label>
                            <span>{SelectedPatient_list.Billedby}</span>
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
                          <span style={{ fontWeight: "bold" }}>Grand Total:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Grandtotal}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "2px",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Trust Discount:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.SchemeDiscount}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Totalamount}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Final Discount:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.FinalDiscount}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "2px",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Total Advance:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {AdvanceTotal}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "2px",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Final NetAmt:</span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Finalnetamt}
                          </span>
                        </div>
                        
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            Paid Amount:
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Paidamt}
                          </span>
                        </div>
  
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            Credit amount
                          </span>
                          <span style={{ fontWeight: 900, fontSize: "15px" }}>
                            {Amountdetails.Creditamt}
                          </span>
                        </div>
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

  const ForPrintReimbData = () => {
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
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div className="billaddress">
                        <span>PH :</span>{" "}
                        <span>{ClinicDetials.ClinicMobileNo}</span> ,{" "}
                        <span>Landline No :</span>{" "}
                        <span>{ClinicDetials.ClinicLandLineNo}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_billing_address_890">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate.split(" ")[0]}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Address}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr>
                        <th>Service Type / Name</th>
                        <th>Unit</th>
                        <th>Amount</th>
                        <th>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(
                        SelectDatalist.filter(
                          (f) => f.IsReimbursable === "Yes"
                        ).reduce((acc, row) => {
                          if (!acc[row.Service_Type]) {
                            acc[row.Service_Type] = [];
                          }
                          acc[row.Service_Type].push(row);
                          return acc;
                        }, {})
                      ).map((Service_Type, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) =>
                            row.Service_Type === Service_Type &&
                            row.IsReimbursable === "Yes"
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.Total_Amount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td colSpan="4" style={{ fontWeight: "bold" }}>
                                {Service_Type}
                              </td>
                            </tr>
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td>{row.Service_Name}</td>
                                <td>{row.Quantity}</td>
                                <td>{row.Amount}</td>
                                <td>{row.Total_Amount}</td>
                              </tr>
                            ))}
                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                Sub Total:
                              </td>
                              <td>{subtotal.toFixed(2)}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
            <tr>
              <td colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      {SelectedPatient_list.PatientCategory === "General" && (
                        <div className="bill_body_new_phar">
                          <table className="selected-medicine-table222 EDWEDE">
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Payment Type</th>
                                {Condition.hasCard && <th>Card Type</th>}
                                {Condition.hasCheque && <th>Cheque No</th>}
                                {Condition.hasBank && <th>Bank Name</th>}
                                <th>Amount</th>
                                <th>Additional Amount</th>
                                <th>Transaction Fee</th>
                              </tr>
                            </thead>
                            <tbody>
                              {billAmount.map((row, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{row.Payment_Type || "-"}</td>
                                  {Condition.hasCard && (
                                    <td>
                                      {row.Payment_Type === "Card"
                                        ? row.Card_Type || "-"
                                        : "-"}
                                    </td>
                                  )}
                                  {Condition.hasCheque && (
                                    <td>
                                      {row.Payment_Type === "Cheque"
                                        ? row.Cheque_No || "-"
                                        : "-"}
                                    </td>
                                  )}
                                  {Condition.hasBank && (
                                    <td>
                                      {row.Payment_Type === "Bank"
                                        ? row.Bank_Name || "-"
                                        : "-"}
                                    </td>
                                  )}
                                  <td>{row.Amount || "-"}</td>
                                  <td>{row.AdditionalAmount || "-"}</td>
                                  <td>
                                    {`${parseInt(row.Transaction_Amount)}%` ||
                                      "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {SelectedPatient_list.PatientCategory === "General" &&
                        AdvanceAmountGet.map((row, ind) => (
                          <div className="bill_body_new_phar">
                            <label key={ind}>
                              Advance on {`${row.Date} ${row.Time}`}{" "}
                              <span>:</span>
                            </label>
                            <span key={ind}>{row?.AdvanceAmount}</span>
                          </div>
                        ))}
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>
                          {NumberToWords(+initialState.reimbursableTotal)}
                        </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{UserData?.Employeename}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Total Amount <span>:</span>
                        </label>
                        <span>{initialState.reimbursableTotal}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Amount Receivable <span>:</span>
                        </label>
                        <span>{initialState.reimbursableTotal}</span>
                      </div>
                      {/* <div className="bill_body_new_phar">
                          <label>
                            Paid Amount <span>:</span>
                          </label>
                          <span>{initialState.totalAmountt}</span>
                        </div> */}
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <br />
            <td
              colSpan="7"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                color: "black",
                fontSize: "20px",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  fontWeight: "bolder",
                  color: "black",
                  fontSize: "18px",
                  marginTop: "10px",
                }}
              >
                Duplicate Copy Of Original Bill
              </h4>
            </td>
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
        <br />
      </div>
    );
  };

  const ForPrintNon_ReimbData = () => {
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
          <table
            className="print-table33"
            // style={{ flexGrow: 1, }}
          >
            <thead
              className="print_header"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                height: "150px",
              }}
            >
              <tr>
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div className="billaddress">
                        <span>PH :</span>{" "}
                        <span>{ClinicDetials.ClinicMobileNo}</span> ,{" "}
                        <span>Landline No :</span>{" "}
                        <span>{ClinicDetials.ClinicLandLineNo}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_billing_address_890">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate.split(" ")[0]}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Address}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr>
                        <th>Service Type / Name</th>
                        <th>Unit</th>
                        <th>Amount</th>
                        <th>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(
                        SelectDatalist.filter(
                          (f) => f.IsReimbursable === "No"
                        ).reduce((acc, row) => {
                          if (!acc[row.Service_Type]) {
                            acc[row.Service_Type] = [];
                          }
                          acc[row.Service_Type].push(row);
                          return acc;
                        }, {})
                      ).map((Service_Type, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) =>
                            row.Service_Type === Service_Type &&
                            row.IsReimbursable === "No"
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.Total_Amount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td colSpan="4" style={{ fontWeight: "bold" }}>
                                {Service_Type}
                              </td>
                            </tr>
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td>{row.Service_Name}</td>
                                <td>{row.Quantity}</td>
                                <td>{row.Amount}</td>
                                <td>{row.Total_Amount}</td>
                              </tr>
                            ))}
                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                Sub Total:
                              </td>
                              <td>{subtotal.toFixed(2)}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
            <tr>
              <td colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <table className="selected-medicine-table222 EDWEDE">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Payment Type</th>
                              {Condition.hasCard && <th>Card Type</th>}
                              {Condition.hasCheque && <th>Cheque No</th>}
                              {Condition.hasBank && <th>Bank Name</th>}
                              <th>Amount</th>
                              <th>Additional Amount</th>
                              <th>Transaction Fee</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billAmount.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Payment_Type || "-"}</td>
                                {Condition.hasCard && (
                                  <td>
                                    {row.Payment_Type === "Card"
                                      ? row.Card_Type || "-"
                                      : "-"}
                                  </td>
                                )}
                                {Condition.hasCheque && (
                                  <td>
                                    {row.Payment_Type === "Cheque"
                                      ? row.Cheque_No || "-"
                                      : "-"}
                                  </td>
                                )}
                                {Condition.hasBank && (
                                  <td>
                                    {row.Payment_Type === "Bank"
                                      ? row.Bank_Name || "-"
                                      : "-"}
                                  </td>
                                )}
                                <td>{row.Amount || "-"}</td>
                                <td>{row.AdditionalAmount || "-"}</td>
                                <td>
                                  {`${parseInt(row.Transaction_Amount)}%` ||
                                    "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {SelectedPatient_list.PatientCategory === "General" &&
                        AdvanceAmountGet.map((row, ind) => (
                          <div className="bill_body_new_phar">
                            <label key={ind}>
                              Advance on {`${row.Date} ${row.Time}`}{" "}
                              <span>:</span>
                            </label>
                            <span key={ind}>{row?.AdvanceAmount}</span>
                          </div>
                        ))}
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>
                          {NumberToWords(+initialState.totalNetAmount)}
                        </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{UserData?.Employeename}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Total Amount <span>:</span>
                        </label>
                        <span>{initialState.reimbursableTotal}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Amount Receivable <span>:</span>
                        </label>
                        <span>{initialState.reimbursableTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <br />
            <td
              colSpan="7"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                color: "black",
                fontSize: "20px",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  fontWeight: "bolder",
                  color: "black",
                  fontSize: "18px",
                  marginTop: "10px",
                }}
              >
                Duplicate Copy Of Original Bill
              </h4>
            </td>
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
        <br />
      </div>
    );
  };

  const ForBill_Summary = () => {
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
          <table
            className="print-table33"
            // style={{ flexGrow: 1, }}
          >
            <thead
              className="print_header"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                height: "150px",
              }}
            >
              <tr>
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div className="billaddress">
                        <span>PH :</span>{" "}
                        <span>{ClinicDetials.ClinicMobileNo}</span> ,{" "}
                        <span>Landline No :</span>{" "}
                        <span>{ClinicDetials.ClinicLandLineNo}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_billing_address_890">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Address}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr>
                        <th>Service Type / Name</th>
                        <th>Unit</th>
                        <th>Amount</th>
                        <th>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(
                        SelectDatalist.reduce((acc, row) => {
                          if (!acc[row.Service_Type]) {
                            acc[row.Service_Type] = [];
                          }
                          acc[row.Service_Type].push(row);
                          return acc;
                        }, {})
                      ).map((Service_Type, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) => row.Service_Type === Service_Type
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.Total_Amount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td colSpan="4" style={{ fontWeight: "bold" }}>
                                {Service_Type}
                              </td>
                            </tr>
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td>{row.Service_Name}</td>
                                <td>{row.Quantity}</td>
                                <td>{row.Amount}</td>
                                <td>{row.Total_Amount}</td>
                              </tr>
                            ))}
                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                Sub Total:
                              </td>
                              <td>{subtotal.toFixed(2)}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>

            <br />
            <td
              colSpan="7"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                color: "black",
                fontSize: "20px",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  fontWeight: "bolder",
                  color: "black",
                  fontSize: "18px",
                  marginTop: "10px",
                }}
              >
                Duplicate Copy Of Original Bill
              </h4>
            </td>
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
        <br />
      </div>
    );
  };

  const ForBill_Receipt_Summary = () => {
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
          <table
            className="print-table33"
            // style={{ flexGrow: 1, }}
          >
            <thead
              className="print_header"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                height: "150px",
              }}
            >
              <tr>
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div className="billaddress">
                        <span>PH :</span>{" "}
                        <span>{ClinicDetials.ClinicMobileNo}</span> ,{" "}
                        <span>Landline No :</span>{" "}
                        <span>{ClinicDetials.ClinicLandLineNo}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_billing_address_890">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate.split(" ")[0]}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Address}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Receipt No<span>:</span>
                        </label>
                        <h4>{RecieptInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr>
                        <th>Service Type / Name</th>
                        <th>Unit</th>
                        <th>Amount</th>
                        <th>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(
                        SelectDatalist.reduce((acc, row) => {
                          if (!acc[row.Service_Type]) {
                            acc[row.Service_Type] = [];
                          }
                          acc[row.Service_Type].push(row);
                          return acc;
                        }, {})
                      ).map((Service_Type, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) => row.Service_Type === Service_Type
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.Total_Amount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td colSpan="4" style={{ fontWeight: "bold" }}>
                                {Service_Type}
                              </td>
                            </tr>
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td>{row.Service_Name}</td>
                                <td>{row.Quantity}</td>
                                <td>{row.Amount}</td>
                                <td>{row.Total_Amount}</td>
                              </tr>
                            ))}
                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                Sub Total:
                              </td>
                              <td>{subtotal.toFixed(2)}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
            <tr>
              <td colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <table className="selected-medicine-table222 EDWEDE">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Payment Type</th>
                              {Condition.hasCard && <th>Card Type</th>}
                              {Condition.hasCheque && <th>Cheque No</th>}
                              {Condition.hasBank && <th>Bank Name</th>}
                              <th>Amount</th>
                              <th>Additional Amount</th>
                              <th>Transaction Fee</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billAmount.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Payment_Type || "-"}</td>
                                {Condition.hasCard && (
                                  <td>
                                    {row.Payment_Type === "Card"
                                      ? row.Card_Type || "-"
                                      : "-"}
                                  </td>
                                )}
                                {Condition.hasCheque && (
                                  <td>
                                    {row.Payment_Type === "Cheque"
                                      ? row.Cheque_No || "-"
                                      : "-"}
                                  </td>
                                )}
                                {Condition.hasBank && (
                                  <td>
                                    {row.Payment_Type === "Bank"
                                      ? row.Bank_Name || "-"
                                      : "-"}
                                  </td>
                                )}
                                <td>{row.Amount || "-"}</td>
                                <td>{row.AdditionalAmount || "-"}</td>
                                <td>
                                  {`${parseInt(row.Transaction_Amount)}%` ||
                                    "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {SelectedPatient_list.PatientCategory === "General" &&
                        AdvanceAmountGet.map((row, ind) => (
                          <div className="bill_body_new_phar">
                            <label key={ind}>
                              Advance on {`${row.Date} ${row.Time}`}{" "}
                              <span>:</span>
                            </label>
                            <span key={ind}>{row?.AdvanceAmount}</span>
                          </div>
                        ))}
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>
                          {NumberToWords(+initialState.totalNetAmount)}
                        </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{UserData?.Employeename}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Gross Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Net Amount <span>:</span>
                        </label>
                        <span>{initialState.totalNetAmount}</span>
                      </div>

                      <div className="bill_body_new_phar">
                        <label>
                          Paid Amount <span>:</span>
                        </label>
                        <span>{initialState.PaidAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <br />
            <td
              colSpan="7"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                color: "black",
                fontSize: "20px",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  fontWeight: "bolder",
                  color: "black",
                  fontSize: "18px",
                  marginTop: "10px",
                }}
              >
                Duplicate Copy Of Original Bill
              </h4>
            </td>
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
        <br />
      </div>
    );
  };

  const ForBill_Detailed = () => {
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
          <table
            className="print-table33"
            // style={{ flexGrow: 1, }}
          >
            <thead
              className="print_header"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                height: "150px",
              }}
            >
              <tr>
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        {console.log("1234", ClinicDetials)}
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div className="billaddress">
                        <span>PH :</span>{" "}
                        <span>{ClinicDetials.ClinicMobileNo}</span> ,{" "}
                        <span>Landline No :</span>{" "}
                        <span>{ClinicDetials.ClinicLandLineNo}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_billing_address_890">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate.split(" ")[0]}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Address}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice No<span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Receipt No<span>:</span>
                        </label>
                        <h4>{RecieptInvoice}</h4>
                      </div> */}
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Date<span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <br />
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr
                        style={{
                          borderTop: "1.5px solid black",
                          borderBottom: "1.5px solid black",
                        }}
                      >
                        <th style={{ borderTop: "1px solid black" }}>
                          Service Type / Name
                        </th>
                        <th style={{ border: "none" }}>Unit</th>
                        <th style={{ border: "none" }}>Amount</th>
                        <th style={{ border: "none" }}>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        borderBottom: "1.5px solid black",
                        padding: "2px",
                      }}
                    >
                      {console.log("SelectDatalist", SelectDatalist)}

                      {/* Group entries by ServiceType */}
                      {Object.keys(
                        SelectDatalist.reduce((acc, row) => {
                          if (!acc[row.Service_Type]) {
                            acc[row.Service_Type] = [];
                          }
                          acc[row.Service_Type].push(row);
                          return acc;
                        }, {})
                      ).map((Service_Type, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) => row.Service_Type === Service_Type
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.Total_Amount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            {/* Render each ServiceType */}
                            <tr
                              style={{
                                borderTop: "1px solid grey",
                                marginBottom: "10px",
                              }}
                            >
                              <td
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "left",
                                  border: "none",
                                }}
                              >
                                {Service_Type}
                              </td>
                              <td colSpan="3" style={{ border: "none" }}></td>
                            </tr>

                            {/* Render rows for each item under this ServiceType */}
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td
                                  style={{
                                    paddingLeft: "20px",
                                    border: "none",
                                  }}
                                >
                                  {row.Service_Name}
                                </td>
                                <td style={{ border: "none" }}>
                                  {row.Quantity}
                                </td>
                                <td style={{ border: "none" }}>{row.Amount}</td>
                                <td style={{ border: "none" }}>
                                  {row.Total_Amount}
                                </td>
                              </tr>
                            ))}

                            {/* Subtotal row for this ServiceType */}
                            <tr
                              style={{
                                borderTop: "1px solid grey",
                                marginBottom: "10px",
                              }}
                            >
                              <td
                                colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                Sub Total <span>:</span>
                              </td>
                              <td style={{ border: "none" }}>
                                {subtotal.toFixed(2)}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>

            <br />
            <td
              colSpan="7"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                color: "black",
                fontSize: "20px",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  fontWeight: "bolder",
                  color: "black",
                  fontSize: "18px",
                  marginTop: "10px",
                }}
              >
                Duplicate Copy Of Original Bill
              </h4>
            </td>
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
        <br />
      </div>
    );
  };

  const ForBill_Receipt_Detailed = () => {
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
          <table
            className="print-table33"
            // style={{ flexGrow: 1, }}
          >
            <thead
              className="print_header"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                height: "150px",
              }}
            >
              <tr>
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        {console.log("1234", ClinicDetials)}
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div className="billaddress">
                        <span>PH :</span>{" "}
                        <span>{ClinicDetials.ClinicMobileNo}</span> ,{" "}
                        <span>Landline No :</span>{" "}
                        <span>{ClinicDetials.ClinicLandLineNo}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_billing_address_890">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
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
                        <h4>{SelectedPatient_list.AdmissionDate.split(" ")[0]}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Address}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice No<span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Receipt No<span>:</span>
                        </label>
                        <h4>{RecieptInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Date<span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <br />
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr
                        style={{
                          borderTop: "1.5px solid black",
                          borderBottom: "1.5px solid black",
                        }}
                      >
                        <th style={{ borderTop: "1px solid black" }}>
                          Service Type / Name
                        </th>
                        <th style={{ border: "none" }}>Unit</th>
                        <th style={{ border: "none" }}>Amount</th>
                        <th style={{ border: "none" }}>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        borderBottom: "1.5px solid black",
                        padding: "2px",
                      }}
                    >
                      {console.log("SelectDatalist", SelectDatalist)}

                      {/* Group entries by ServiceType */}
                      {Object.keys(
                        SelectDatalist.reduce((acc, row) => {
                          if (!acc[row.Service_Type]) {
                            acc[row.Service_Type] = [];
                          }
                          acc[row.Service_Type].push(row);
                          return acc;
                        }, {})
                      ).map((Service_Type, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) => row.Service_Type === Service_Type
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.Total_Amount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            {/* Render each ServiceType */}
                            <tr
                              style={{
                                borderTop: "1px solid grey",
                                marginBottom: "10px",
                              }}
                            >
                              <td
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "left",
                                  border: "none",
                                }}
                              >
                                {Service_Type}
                              </td>
                              <td colSpan="3" style={{ border: "none" }}></td>
                            </tr>

                            {/* Render rows for each item under this ServiceType */}
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td
                                  style={{
                                    paddingLeft: "20px",
                                    border: "none",
                                  }}
                                >
                                  {row.Service_Name}
                                </td>
                                <td style={{ border: "none" }}>
                                  {row.Quantity}
                                </td>
                                <td style={{ border: "none" }}>{row.Amount}</td>
                                <td style={{ border: "none" }}>
                                  {row.Total_Amount}
                                </td>
                              </tr>
                            ))}

                            {/* Subtotal row for this ServiceType */}
                            <tr
                              style={{
                                borderTop: "1px solid grey",
                                marginBottom: "10px",
                              }}
                            >
                              <td
                                colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}
                              >
                                Sub Total <span>:</span>
                              </td>
                              <td style={{ border: "none" }}>
                                {subtotal.toFixed(2)}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>

            <tr>
              <td colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <table className="print-table33">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Payment Type</th>
                              {Condition.hasCard && <th>Card Type</th>}
                              {Condition.hasCheque && <th>Cheque No</th>}
                              {Condition.hasBank && <th>Bank Name</th>}
                              <th>Amount</th>
                              <th>Additional Amount</th>
                              <th>Transaction Fee</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billAmount.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Payment_Type || "-"}</td>
                                {Condition.hasCard && (
                                  <td>
                                    {row.Payment_Type === "Card"
                                      ? row.Card_Type || "-"
                                      : "-"}
                                  </td>
                                )}
                                {Condition.hasCheque && (
                                  <td>
                                    {row.Payment_Type === "Cheque"
                                      ? row.Cheque_No || "-"
                                      : "-"}
                                  </td>
                                )}
                                {Condition.hasBank && (
                                  <td>
                                    {row.Payment_Type === "Bank"
                                      ? row.Bank_Name || "-"
                                      : "-"}
                                  </td>
                                )}
                                <td>{row.Amount || "-"}</td>
                                <td>{row.AdditionalAmount || "-"}</td>
                                <td>
                                  {`${parseInt(row.Transaction_Amount)}%` ||
                                    "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <br />
                      {SelectedPatient_list.PatientCategory === "General" &&
                        Array.isArray(AdvanceAmountGet) &&
                        AdvanceAmountGet.map((row, ind) => (
                          <div className="bill_body_new_phar">
                            <label key={ind}>
                              Advance on {`${row.Date} ${row.Time}`}
                              <span>:</span>
                            </label>
                            <span key={ind}>{row?.AdvanceAmount}</span>
                          </div>
                        ))}
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>
                          {NumberToWords(+initialState.totalNetAmount)}
                        </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{UserData?.Employeename}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Gross Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Net Amount <span>:</span>
                        </label>
                        <span>{initialState.totalNetAmount}</span>
                      </div>

                      <div className="bill_body_new_phar">
                        <label>
                          Paid Amount <span>:</span>
                        </label>
                        <span>{initialState.PaidAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <br />
            <td
              colSpan="7"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
                color: "black",
                fontSize: "20px",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  fontWeight: "bolder",
                  color: "black",
                  fontSize: "18px",
                  marginTop: "10px",
                }}
              >
                Duplicate Copy Of Original Bill
              </h4>
            </td>
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
        <br />
      </div>
    );
  };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: async () => {
      navigate("/Home/CashierFolder");
      // dispatchvalue({ type: "HrFolder", value: "IPBillingList" });
      // dispatchvalue({ type: "setPreviousFolder", value: null });
      // dispatchvalue({ type: "showMenu", value: true });
    },
  });

  const handlePrintClose = () => {
    setPrintView(null);
    // navigate("/Home/CashierFolder");
    // dispatchvalue({ type: "HrFolder", value: "IPBillingList" });
    // dispatchvalue({ type: "setPreviousFolder", value: null });
    // dispatchvalue({ type: "showMenu", value: true });
  };

  const HandleMovedatatobill = (params) => {
    console.log("IPBillingData", params);

    const updatedParams = { ...params, billpage: 'Finalbill' };

    dispatchvalue({ type: "IPBillingData", value: updatedParams });
    dispatchvalue({ type: "OPBillingData", value: {} });

    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "IPBilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  console.log("return------------",IPPatientBillcolumns);
  console.log("return-1-----------",PatientOPRegisterColumns);

  return (
    <>
      {printView === null ? (
        <div className="Main_container_app">
          <h3>IP Final Billing Queue List</h3>
          <div className="RegisFormcon_1" style={{ marginBottom: "10px" }}>
            <div className="RegisForm_1">
              <label>
                Date Type<span>:</span>
              </label>
              <select
                name="DateType"
                value={searchOptions.DateType}
                onChange={HandleOnchangeSearch}
              >
                <option value='All'>All</option>
                <option value="Current">Current Date</option>
                <option value="Customize">Customize</option>
              </select>
            </div>

            {searchOptions.DateType === 'Current' && (
              <div className="RegisForm_1">
                  <label>Current Date<span>:</span></label>
                  <input
                      type='date'
                      name='CurrentDate'
                      value={searchOptions.CurrentDate}
                      onChange={HandleOnchangeSearch}
                      readOnly
                  />

              </div>
            )}
                                
            {searchOptions.DateType === 'Customize' && (
                <>
                    <div className="RegisForm_1">
                        <label>From Date<span>:</span></label>
                        <input
                            type='date'
                            name='FromDate'
                            value={searchOptions.FromDate}
                            onChange={HandleOnchangeSearch}
                        />

                    </div>

                    <div className="RegisForm_1">
                        <label>To Date<span>:</span></label>
                        <input
                            type='date'
                            name='ToDate'
                            value={searchOptions.ToDate}
                            onChange={HandleOnchangeSearch}
                            min={searchOptions.FromDate}
                        />

                    </div>
                </>
            )} 

            <div className="RegisForm_1">
              <label htmlFor="input">
                Name/PhoneNo<span>:</span>
              </label>
              <input
                type="text"
                name="SearchbyFirstName"
                value={searchOptions.SearchbyFirstName}
                onChange={HandleOnchangeSearch}
              />
            </div>

            <div className="RegisForm_1">
              <label htmlFor="input">
                Status<span>:</span>
              </label>
              <select
                name="SearchStatus"
                value={searchOptions.SearchStatus}
                onChange={HandleOnchangeSearch}
              >
                <option value="Approved">Pending</option>
                <option value="Cash">Paid</option>
                <option value="Credit">Credit</option>
                <option value="Refund">Refund</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

          </div>

         {searchOptions.SearchStatus === "Approved" && (
          <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata} />
        )}

        {["Cash", "Credit", "Refund"].includes(searchOptions.SearchStatus) && (
          <ReactGrid columns={IPPatientBillcolumns} RowData={Filterdata} />
        )}

          



          <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
      ) : printView === "bill" ? (
        <ForPrintBill onClose={() => setPrintView(null)} />
      ) : printView === "billreceipt" ? (
        <ForPrintBillReceipt onClose={() => setPrintView(null)} />
      ) : printView === "receipt" ? (
        <ForPrintReceipt onClose={() => setPrintView(null)} />
      ) : printView === "Detailed" ? (
        <ForPrintData onClose={() => setPrintView(null)} />
      ) : printView === "Summary" ? (
        <ForPrintSumData onClose={() => setPrintView(null)} />
      ) : printView === "Reimbursable" ? (
        <ForPrintReimbData onClose={() => setPrintView(null)} />
      ) : printView === "NonReimbursable" ? (
        <ForPrintNon_ReimbData onClose={() => setPrintView(null)} />
      ) : printView === "Bill+Summary" ? (
        <ForBill_Summary onClose={() => setPrintView(null)} />
      ) : printView === "Bill+Receipt+Summary" ? (
        <ForBill_Receipt_Summary onClose={() => setPrintView(null)} />
      ) : printView === "Bill+Detailed" ? (
        <ForBill_Detailed onClose={() => setPrintView(null)} />
      ) : printView === "Bill+Receipt+Detailed" ? (
        <ForBill_Receipt_Detailed onClose={() => setPrintView(null)} />
      ): printView === "Cash" ? (
        <ForPrintDataCash onClose={() => setPrintView(null)} />
      ) : printView === "Credit" ? (
        <ForPrintCreditData onClose={() => setPrintView(null)} />
      ): printView === "Refund" ? (
        <ForPrintDataRefund onClose={() => setPrintView(null)} />
      ): printView === "CashReceipt" ? (
        <ForPrintDataCashReceipt onClose={() => setPrintView(null)} />
      ): printView === "RefundReceipt" ? (
        <ForPrintDataRefundReceipt onClose={() => setPrintView(null)} />
      ): printView === "CreditReceipt" ? (
        <ForPrintCreditReceipt onClose={() => setPrintView(null)} />
      )
      : printView === "CGHSCredit" ? (
        <ForPrintCreditDataCGHS onClose={() => setPrintView(null)} />
      )
      : null}
    </>
  );
};

export default IPBillingFinalList;
