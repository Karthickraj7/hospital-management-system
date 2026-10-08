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

const IPBillingEstimatedApproveList = () => {
  const componentRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [Filterdata, setFilterdata] = useState([]);

  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);

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
    SearchStatus: "Estimated",
  });

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
  // Create an AbortController
  const controller = new AbortController();

  const apiUrl =
    searchOptions.SearchStatus === "Estimated"
      ? `${UrlLink}Frontoffice/IPBillingEstimated_Link`
      : `${UrlLink}Frontoffice/Get_IP_Final_Billing_Details`;

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

  // Cleanup function: abort request if still pending
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
            ClinicAddress: `No.${ress[0]?.DoorNo || ""}, ${ress[0]?.Street || ""
              }, ${ress[0]?.Area || ""}, ${ress[0]?.City || ""} ,${ress[0]?.State || ""
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

  const PatientOPRegisterColumns = useMemo(() => [
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
        return (
          <Button
            className="cell_btn"
            onClick={() => HandleMovedatatobill(params.row)}
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        )
      }
    },
  ], [searchOptions.SearchStatus, printOptions, TodayDate]);

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
        `${UrlLink}Frontoffice/IP_AdvanceAmount_collection?RegistrationId=${SelectedPatient_list?.RegisterId
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

  const HandlePrintBill = (params) => {
    console.log("IPBillingData", params);

    dispatchvalue({ type: "IPBillingData", value: params });
    dispatchvalue({ type: "OPBillingData", value: {} });

    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "IPEstimatedApprovalBilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
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
    console.log(params, 'params12345')
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


  const HandleMovedatatobill = (params) => {
    console.log("IPBillingData", params);

    const updatedParams = { ...params, billpage: 'Finalbill' };

    dispatchvalue({ type: "IPBillingData", value: updatedParams });
    dispatchvalue({ type: "OPBillingData", value: {} });

    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "IPEstimatedApproveBilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>IP Estimated Billing Approve Queue List</h3>
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

          {/* <div className="RegisForm_1">
            <label htmlFor="input">
              Status<span>:</span>
            </label>
            <select
              name="SearchStatus"
              value={searchOptions.SearchStatus}
              onChange={HandleOnchangeSearch}
            >
              <option value="Pending">Pending</option>
              <option value="Estimated">Estimated</option>
            </select>
          </div> */}

          {/* <button
              className="search_div_bar_btn_1"
              onClick={handlenewDocRegister}
              title="New Doctor Register"
            >
              <LoupeIcon />
            </button> */}
        </div>

        <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata} />
        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default IPBillingEstimatedApproveList;
