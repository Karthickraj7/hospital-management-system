
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Clinic_Logo from "../../Assets/kmc.jpeg";
import { TiPlus } from "react-icons/ti";
import "./OPpharmacy.css";
import Tooltip from '@mui/material/Tooltip';

const PharmacyBillingLIst = () => {


  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const numberToWords = (num) => {
    if (!num || isNaN(num)) return "Zero";
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
      return "";
    };
    if (num.toString().length > 9) return "Overflow";
    const n = ("000000000" + num).substr(-9).match(/(\d{2})(\d{2})(\d{2})(\d{3})/);
    if (!n) return "";
    let str = "";
    str += n[1] != 0 ? inWords(Number(n[1])) + " Crore " : "";
    str += n[2] != 0 ? inWords(Number(n[2])) + " Lakh " : "";
    str += n[3] != 0 ? inWords(Number(n[3])) + " Thousand " : "";
    str += n[4] != 0 ? inWords(Number(n[4])) : "";
    return str.trim();
  };
  const componentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);

  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  const [Filterdata, setFilterdata] = useState([]);
  const [BillData, setBillData] = useState(null);
  const [printView, setPrintView] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // const [searchOptions, setSearchOptions] = useState({
  //   DateType: "Current",
  //   CurrentDate: TodayDate,
  //   FromDate: "",
  //   ToDate: "",
  //   SearchbyFirstName: "",
  //   SearchbySpeciality: "",
  //   SearchbyDoctor: "",
  //   SearchTimeOrderby: "",
  //   SearchStatus: "Pending",
  //   RegisterId :"",
  
  // });

  const getDefaultFilters = (today) => ({
    DateType: "Current",
    CurrentDate: TodayDate,
    FromDate: "",
    ToDate: "",
    SearchbyFirstName: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "Pending",
    RegisterId :"",
  });
  const savedFilters = useSelector(state => state.userRecord?.opPharmacybillFilters);
  
  const initialFilters = savedFilters ? savedFilters : getDefaultFilters(TodayDate);
  
  const [searchOptions, setSearchOptions] = useState(initialFilters);
  
  
  const firstRender = useRef(true);
  
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // skip saving on first render
    }
  
    dispatch({
      type: "SAVE_OP_PHARMACY_FILTERS",
      value: searchOptions,
    });
  }, [searchOptions, dispatch]);
  
  
  
  const resetFilters = () => {
    setSearchOptions(getDefaultFilters(TodayDate));
  };
  

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(Boolean);
          setClinicDetials({
            ClinicName: clinicData.Clinic_Name || "",
            ClinicAddress: addressComponents.join(", "),
            ClinicGST: clinicData.GSTNo || "",
            ClinicCity: clinicData.City || "",
            ClinicState: clinicData.State || "",
            ClinicCode: clinicData.Pincode || "",
            ClinicMobileNo: clinicData.PhoneNo || "",
            ClinicLandLineNo: clinicData.LandlineNo || "",
            ClinicMailID: clinicData.Mail || "",
            Clinic_DoorNo: clinicData?.DoorNo|| "",
            Clinic_Street: clinicData?.Street|| "",
            Clinic_Area: clinicData?.Area|| "",
            Clinic_City: clinicData?.City|| "",
            Clinic_State: clinicData?.State|| "",
            Clinic_LandlineNo: clinicData?.LandlineNo|| "",
            Clinic_PhoneNo: clinicData?.PhoneNo|| "",
            DrugLicenseNoOne: clinicData?.DrugLicenseNoOne|| "",

          });
        }
      })
      .catch((error) => {
        setError("Failed to fetch clinic details");
        console.error("Error fetching clinic details:", error);
      })
      .finally(() => setIsLoading(false));
  }, [UrlLink]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   setError(null);
  //   const endpoint =
  //     searchOptions.SearchStatus === "Paid"
  //       ? `${UrlLink}DrugAdminstrations/op_pharmacy_queue_list_paid_new`
  //       : `${UrlLink}Frontoffice/op_pharmacy_queue_list_prescrib_new`;

  //   axios
  //     .get(endpoint, { params: { ...searchOptions, location: userRecord?.location } })
  //     .then((response) => {
  //       console.log("API Response:", response.data);
  //       const data = response.data.pharmacy_bills
  //         ? response.data.pharmacy_bills.map((bill, index) => ({
  //           ...bill,
  //           id: bill.id || index + 1,
  //           Date: formatDate(bill.BillingDate || bill.billing_date || new Date()),
  //           PatientId: bill.PatientId || bill.patient_id || "",
  //           Items: bill.Items || [],
  //           Receipt: bill.Receipt || {},
  //           VisitId: bill.VisitId || bill.visit_id || "",
  //           Age: bill.Age || bill.age || "",
  //           Gender: bill.Gender || bill.gender || "",
  //           DrugLicenseNo: bill.DrugLicenseNo || bill.drug_license_no || "",
  //           GSTnumber: bill.GSTnumber || bill.gst_number || "",
  //           PatientType: bill.PatientType || bill.patient_type || "",
  //           TotalAmount: bill.TotalAmount || bill.total_amount || 0,
  //           PaidAmount: bill.PaidAmount || bill.paid_amount || 0,
  //           BalanceAmount: bill.BalanceAmount || bill.balance_amount || 0,
  //           NetAmount: bill.NetAmount || bill.net_amount || 0,
  //           Status: bill.BillStatus || bill.Status || "",
  //           Doctorid: bill.Doctorid || bill.doctor_id || "",
  //         }))
  //         : [];
  //       setFilterdata(data);
  //     })
  //     .catch((error) => {
  //       setError("Failed to fetch patient data");
  //       console.error("Error fetching patient data:", error);
  //     })
  //     .finally(() => setIsLoading(false));
  // }, [userRecord, UrlLink, searchOptions, TodayDate]);

  useEffect(() => {
  const controller = new AbortController();   // <-- Create AbortController
  const signal = controller.signal;

  setIsLoading(true);
  setError(null);

  const endpoint =
    searchOptions.SearchStatus === "Paid"
      ? `${UrlLink}DrugAdminstrations/op_pharmacy_queue_list_paid_new`
      : `${UrlLink}Frontoffice/op_pharmacy_queue_list_prescrib_new`;

  axios
    .get(endpoint, {
      params: { ...searchOptions, location: userRecord?.location },
      signal: signal,                        // <-- Attach signal to axios
    })
    .then((response) => {

      console.log("API Response:", response.data);

      const data = response.data.pharmacy_bills
        ? response.data.pharmacy_bills.map((bill, index) => ({
            ...bill,
            id: bill.id || index + 1,
            Date: formatDate(
              bill.BillingDate || bill.billing_date || new Date()
            ),
            PatientId: bill.PatientId || bill.patient_id || "",
            Items: bill.Items || [],
            Receipt: bill.Receipt || {},
            VisitId: bill.VisitId || bill.visit_id || "",
            Age: bill.Age || bill.age || "",
            Gender: bill.Gender || bill.gender || "",
            DrugLicenseNo: bill.DrugLicenseNo || bill.drug_license_no || "",
            GSTnumber: bill.GSTnumber || bill.gst_number || "",
            PatientType: bill.PatientType || bill.patient_type || "",
            TotalAmount: bill.TotalAmount || bill.total_amount || 0,
            PaidAmount: bill.PaidAmount || bill.paid_amount || 0,
            BalanceAmount: bill.BalanceAmount || bill.balance_amount || 0,
            NetAmount: bill.NetAmount || bill.net_amount || 0,
            Status: bill.BillStatus || bill.Status || "",
            Doctorid: bill.Doctorid || bill.doctor_id || "",
            // ----------------------------------------------------
            RegisterId : bill.RegisterId || bill.register_id || "",
            PaidAmount :bill.PaidAmount || bill.PaidAmount || "",
            PatientId : bill.PatientId || bill.patientid || "",

          }))
        : [];

      setFilterdata(data);
    })
    .catch((error) => {
      if (axios.isCancel(error)) {
        console.log("Request cancelled:", error.message);
      } else {
        console.error("Error fetching patient data:", error);
        setError("Failed to fetch patient data");
      }
    })
    .finally(() => setIsLoading(false));

  return () => {
    controller.abort();     // <-- Cancel on unmount or dependency change
  };
 }, [userRecord, UrlLink, searchOptions, TodayDate]);



  // const HandleOnchangeSearch = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "DateType") {
  //     if (value === "Current") {
  //       setSearchOptions((prev) => ({
  //         ...prev,
  //         DateType: value,
  //         CurrentDate: TodayDate,
  //         FromDate: "",
  //         ToDate: "",
  //       }));
  //     } else {
  //       setSearchOptions((prev) => ({ ...prev, DateType: value, CurrentDate: "" }));
  //     }
  //   } else if (name === "SearchbyFirstName" || name === "SearchbyPhoneNumber") {
  //     setSearchOptions((prev) => ({ ...prev, [name]: value }));
  //   } else {
  //     setSearchOptions((prev) => ({ ...prev, [name]: value }));
  //   }
  // };

  const HandleOnchangeSearch = (e) => {
  const { name, value } = e.target;

  if (name === "DateType") {
    if (value === "Current") {
      setSearchOptions((prev) => ({
        ...prev,
        DateType: value,
        CurrentDate: TodayDate,
        FromDate: "",
        ToDate: "",
      }));
    } else {
      setSearchOptions((prev) => ({ ...prev, DateType: value, CurrentDate: "" }));
    }
  } else if (
    name ==="id" ||
    name === "SearchbyFirstName" ||
    name === "SearchbyPhoneNumber" ||
    name === "PatientId" ||
    name === "RegisterId"

    
  ) {
    setSearchOptions((prev) => ({ ...prev, [name]: value }));
  }
   else {
    setSearchOptions((prev) => ({ ...prev, [name]: value }));
  }
};




  const handleRequestEdit1 = (params) => {
    if (!params) {
      console.error("Invalid params:", params);
      return;
    }

    console.log("params", params);

    const { PatientId, VisitId, PatientName, DoctorName, Doctorid,RegisterId } = params;

    dispatch({
      type: "Selected_Patient_Pharmacy",
      value: {
        PatientID: PatientId,
        VisitID: VisitId,
        Patient_Name: PatientName,
        Doctor_name: DoctorName,
        Doctorid: Doctorid,
        type: "OP",
        Department: 2,
        Edit: true,
        ...params,
      },
    });

    navigate("/Home/Pharmacy");
    dispatch({ type: "HrFolder", value: "NewOPpharmacy" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });
  };

  const handleBillView = (bill) => {
    if (!bill || !bill.Items || bill.Items.length === 0) {
      setError("No bill found for this patient or no items available.");
      setPrintView(null);
      setBillData(null);
      return;
    }
    setBillData(bill);
    setPrintView("bill");
    setError(null);
  };

  const handlePharmacybilling = () => {
    dispatch({ type: "Selected_Patient_Pharmacy", value: { type: "OP", Department: 2 } });
    navigate("/Home/Pharmacy");
    dispatch({ type: "HrFolder", value: "NewOPpharmacy" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });
  };

  // const handlePrint2 = useReactToPrint({
  //   content: () => componentRef.current,
  //   onAfterPrint: () => {
  //     navigate("/Home/Pharmacy");
  //     dispatch({ type: "HrFolder", value: "PharmacyBillingLIst" });
  //     dispatch({ type: "setPreviousFolder", value: null });
  //     dispatch({ type: "showMenu", value: true });
  //   },
  // });



  const handlePrint2 = async () => {
    try {
      console.log("Clinic++++++", ClinicDetials);
      const Sdata = {
        ...BillData,
        Hospital_Name: "KARUNA MEDICAL COLLEGE HOSPITAL",
        Clinic_DoorNo: ClinicDetials?.Clinic_DoorNo,
        Clinic_Street: ClinicDetials?.Clinic_Street,
        Clinic_Area: ClinicDetials?.Clinic_Area,
        Clinic_City: ClinicDetials?.Clinic_City,
        Clinic_State: ClinicDetials?.Clinic_State,
        Clinic_LandlineNo: ClinicDetials?.Clinic_LandlineNo,
        Clinic_PhoneNo: ClinicDetials?.Clinic_PhoneNo,
        DrugLicenseNoOne: ClinicDetials?.DrugLicenseNoOne,
        print: "Bill_Reprint"
      }
      console.log("Clinic++++++", Sdata);

      const response = await fetch("http://localhost:5000/print-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Sdata),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Print job sent successfully:", data);
        return { success: true, data };
      } else {
        console.error("Print job failed:", data);
        return { success: false, error: data.message || "Unknown error" };
      }
    } catch (error) {
      console.error("Error sending print job:", error);
      return { success: false, error: error.message };
    }
  };




  const handlePrintClose = () => {
    setPrintView(null);
    setBillData(null);
    setError(null);
    navigate("/Home/OPPharmachyBillingList");
    dispatch({ type: "HrFolder", value: "PharmacyBillingLIst" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });
  };

  const UserRegisterColumns = [
    { key: "id", name: "S No", frozen: true },
    { key: "RegisterId", name: "RegisterId", frozen: true },
    { key: "PatientId", name: "PatientId", frozen: true },
    {
      key: "PatientName",
      name: "Patient Name",
      frozen: true,
      renderCell: (params) => (
        <Tooltip
          title={
            Array.isArray(params.row.Items) && params.row.Items.length > 0 ? (
              <div>
                {params.row.Items.map((item, idx) => (
                  <div key={idx}>{item.ItemName}</div>
                ))}
              </div>
            ) : "No items"
          }
          placement="top"
          arrow
        >
          <span>{params.row.PatientName}</span>
        </Tooltip>
      )
    },
    { key: "PatientPhoneNo", name: "Contact Number", frozen: true },
    {

      key: "DoctorName", name: "Doctor Name", frozen: true

    },
    {key :"PaidAmount",name :"PaidAmount"},
    // { key: "PatientCategory", name: "Patient Category" },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          {(params.row.Status === "Pending" || params.row.Status === "Request") && params.row.Date === TodayDate ? (
            <Button
              className="cell_btn"
              onClick={() => handleRequestEdit1(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>
          ) : null}
          {(params.row.Status === "Paid" || params.row.Status === "Request") && params.row.Date === TodayDate ? (
            <Button
              className="cell_btn"
              onClick={() => handleRequestEdit1(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>
          ) : null}
          {params.row.Status === "Paid" ? (
            <Button
              className="cell_btn"
              onClick={() => handleBillView(params.row)}
            >
              <PrintIcon className="check_box_clrr_cancell" />
            </Button>
          ) : null}
          {params.row.Status !== "Pending" && params.row.Status !== "Request" && params.row.Status !== "Paid" ? (
            "No Action"
          ) : null}
        </>
      ),
    },
  ];




const ForPrintBill = () => {
  // Formatting functions
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(2, 10).replace(/-/g, "-"); // YY-MM-DD format
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const formatNumber = (value, defaultValue = "0.00") => {
    if (value === null || value === undefined || value === "") return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num.toFixed(2);
  };

  const safeParseFloat = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  if (!BillData || !BillData.Items || BillData.Items.length === 0) {
    return (
      <div className="dotmatrix-container">
        <p>{error || "No bill data available."}</p>
        <button onClick={handlePrintClose}>Close</button>
      </div>
    );
  }

  // Calculate totals
  const grossAmount = BillData.Items.reduce(
    (sum, item) => sum + (item.Quantity * item.UnitPrice || item.Total || 0),
    0
  );
  const gstAmount = BillData.Items.reduce(
    (sum, item) => sum + (item.GSTAmount || 0),
    0
  );
  const discount = BillData.Items.reduce(
    (sum, item) => sum + (item.Cash_Discount || 0),
    0
  );
  const netAmount = BillData.NetAmount || grossAmount - discount + gstAmount;

  const summary = {
    Amount: grossAmount.toFixed(2),
    GST: gstAmount.toFixed(2),
    Discount: discount.toFixed(2),
    totalAmount: netAmount.toFixed(2),
    totalAmountt: Math.round(netAmount),
  };

  // Calculate GST breakdown
  const calculateGSTBreakdown = () => {
    let taxable = 0;
    let totalGST = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let grossAmount = 0;

    BillData.Items.forEach(item => {
      const total = safeParseFloat(item.Total || item.Quantity * item.UnitPrice || 0);
      const gstPercent = safeParseFloat(item.GST_value || 0);
      
      const itemTaxable = gstPercent > 0 ? total / (1 + gstPercent / 100) : total;
      const itemGST = total - itemTaxable;
      
      taxable += itemTaxable;
      totalGST += itemGST;
      totalCGST += itemGST / 2;
      totalSGST += itemGST / 2;
      grossAmount += total;
    });

    return {
      taxable: formatNumber(taxable),
      totalGST: formatNumber(totalGST),
      totalCGST: formatNumber(totalCGST),
      totalSGST: formatNumber(totalSGST),
      grossAmount: formatNumber(grossAmount)
    };
  };

  const gstTotals = calculateGSTBreakdown();

  return (
    <div className="dotmatrix-container">
      <style>
        {`
        /* DOT MATRIX PRINTER OPTIMIZATION */
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            font-size: 10pt !important;
            font-family: 'Courier New', monospace !important;
            line-height: 1.1 !important;
            width: 210mm !important; /* 21cm paper width */
            height: auto !important;
          }
          
          html, body {
            height: auto !important;
            min-height: auto !important;
          }
          
          .dotmatrix-container {
            width: 210mm !important; /* 21cm paper width */
            min-height: auto !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-inside: avoid !important;
          }
          
          .dotmatrix-wrapper {
            position: relative !important;
            width: 200mm !important; /* 20cm content width */
            max-width: 200mm !important;
            margin: 0 auto !important;
            padding: 2mm 5mm !important; /* 0.5cm left/right margins */
            background: white !important;
            page-break-inside: avoid !important;
            border: none !important;
            box-shadow: none !important;
            height: auto !important;
            min-height: 297mm !important; /* Fixed A4 height */
          }
          
          /* Main bill box container */
          .bill-box-container {
            border: 1.5pt solid #000 !important;
            min-height: 280mm !important;
            height: auto !important;
            padding: 3mm !important;
            position: relative !important;
            margin: 0 !important;
            background: white !important;
          }
          
          .main-content {
            min-height: calc(280mm - 65mm) !important; /* Total box height minus footer */
            margin-bottom: 1mm !important;
          }
          
          .fixed-footer {
            position: absolute !important;
            bottom: 3mm !important;
            left: 3mm !important;
            right: 3mm !important;
            width: calc(100% - 6mm) !important;
            background: white !important;
            page-break-inside: avoid !important;
          }
          
          .dotmatrix-buttons {
            display: none !important;
          }
          
          /* Remove any page breaks */
          * {
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          
          /* Ensure all text prints */
          * {
            color: black !important;
            -webkit-text-stroke: 0.1px black !important;
            text-shadow: 0.1px 0 black !important;
          }
          
          /* Thin borders for tables */
          table, tr, td, th {
            border-color: black !important;
            border-width: 0.3pt !important;
          }
          
          /* Prevent text from being cut off */
          td, th {
            overflow: visible !important;
            white-space: normal !important;
          }
        }
        
        /* Screen display - 21cm width */
        .dotmatrix-container {
          font-family: 'Courier New', monospace;
          font-size: 9pt;
          line-height: 1.1;
          width: 210mm; /* 21cm paper width */
          height: auto;
          min-height: auto;
          margin: 0 auto;
          background: white;
          color: black;
          padding: 0;
          position: relative;
        }
        
        .dotmatrix-wrapper {
          width: 200mm; /* 20cm content width */
          padding: 2mm 5mm; /* 0.5cm left/right margins */
          box-sizing: border-box;
          height: auto;
          min-height: 297mm; /* A4 height */
          margin: 0 auto;
          position: relative;
        }
        
        /* Main bill box container */
        .bill-box-container {
          border: 1.5pt solid #000;
          min-height: 280mm;
          height: auto;
          padding: 3mm;
          position: relative;
          margin: 0;
          background: white;
        }
        
        .main-content {
          min-height: calc(280mm - 65mm); /* Total box height minus footer */
          margin-bottom: 1mm;
        }
        
        .fixed-footer {
          position: absolute;
          bottom: 3mm;
          left: 3mm;
          right: 3mm;
          width: calc(100% - 6mm);
          background: white;
        }
        
        /* Clinic Header */
        .clinic-header {
          text-align: center;
          margin-bottom: 1mm;
          line-height: 1.1;
        }
        
        .clinic-name {
          font-weight: bold;
          font-size: 10pt;
          margin-bottom: 0.2mm;
          padding: 0.2mm 0;
          letter-spacing: 0.05em;
        }
        
        .clinic-address {
          font-size: 7pt;
          margin-bottom: 0.2mm;
          line-height: 1.1;
          padding: 0.2mm 0;
        }
        
        .clinic-contact {
          font-size: 7pt;
          margin-bottom: 0.3mm;
          line-height: 1.1;
          padding: 0.2mm 0;
        }
        
        /* Bill Title */
        .bill-title {
          text-align: center;
          font-weight: bold;
          font-size: 9pt;
          padding: 0.4mm 0;
          border-bottom: 0.5pt solid #000;
          border-top: 0.5pt solid #000;
          margin: 1mm 0;
        }
        
        /* Patient Info Table */
        .patient-info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1mm;
          font-size: 7pt;
        }
        
        .patient-info-table td {
          padding: 0.3mm 0.5mm;
          vertical-align: baseline;
          line-height: 1.1;
        }
        
        .label-left {
          width: 14%;
          text-align: left;
          white-space: nowrap;
          font-weight: bold;
        }
        
        .value-left {
          width: 36%;
          text-align: left;
          padding-right: 0.5mm;
        }
        
        .label-right {
          width: 14%;
          text-align: left;
          white-space: nowrap;
          font-weight: bold;
        }
        
        .value-right {
          width: 36%;
          text-align: right;
        }
        
        /* Items Table - THIN BORDERS */
        .items-table-container {
          margin: 1mm 0;
          overflow: visible;
          max-height: calc(190mm - 50mm); /* Limit height for scrolling */
          overflow-y: auto;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          border: 0.3pt solid #000;
          font-size: 7pt;
          table-layout: fixed;
        }
        
        .items-table th {
          text-align: left;
          padding: 0.5mm;
          font-weight: bold;
          border: 0.3pt solid #000;
          background-color: #f8f8f8;
          white-space: nowrap;
        }
        
        .items-table td {
          padding: 0.5mm;
          border: 0.3pt solid #000;
          vertical-align: top;
          word-wrap: break-word;
          overflow: visible;
        }
        
        /* Optimized column widths for 20cm width */
        .col-sno { width: 3%; }
        .col-item { width: 27%; }
        .col-batch { width: 9%; }
        .col-box { width: 4%; }
        .col-exp { width: 5%; }
        .col-qty { width: 4%; }
        .col-rate { width: 7%; }
        .col-mrp { width: 7%; }
        .col-gst { width: 5%; }
        .col-total { width: 7%; }
        
        .align-right {
          text-align: right;
          padding-right: 0.5mm !important;
        }
        
        .align-center {
          text-align: center;
        }
        
        /* Amount in Words */
        .amount-words-section {
          margin: 1mm 0;
          padding: 0.5mm;
          border: 0.3pt solid #000;
          font-size: 7pt;
          line-height: 1.1;
          background-color: #fafafa;
          word-break: break-word;
        }
        
        .amount-words-label {
          font-weight: bold;
          display: inline;
          margin-right: 0.5mm;
          white-space: nowrap;
        }
        
        .amount-words-value {
          font-style: italic;
          display: inline;
        }
        
        /* Summary Table - THIN BORDERS */
        .summary-table-container {
          margin: 1mm 0;
        }
        
        .summary-table {
          width: 100%;
          border-collapse: collapse;
          border: 0.3pt solid #000;
          font-size: 7pt;
          table-layout: fixed;
        }
        
        .summary-table th {
          text-align: left;
          padding: 0.5mm;
          font-weight: bold;
          border: 0.3pt solid #000;
          background-color: #f8f8f8;
        }
        
        .summary-table td {
          padding: 0.5mm;
          border: 0.3pt solid #000;
          vertical-align: top;
        }
        
        .summary-col-label { width: 28%; }
        .summary-col-value { width: 22%; }
        .summary-col-label-right { width: 28%; }
        .summary-col-value-right { width: 22%; text-align: right; padding-right: 0.5mm !important; }
        
        /* Grand Total */
        .grand-total-container {
          margin: 1mm 0;
          text-align: center;
          padding: 0.5mm;
          border: 0.3pt solid #000;
          font-weight: bold;
          font-size: 9pt;
          background-color: #f0f0f0;
        }
        
        /* Footer Notes */
        .footer-notes {
          margin-top: 1mm;
          font-size: 6pt;
          text-align: center;
          padding-top: 0.5mm;
          border-top: 0.3pt solid #000;
          line-height: 1.1;
        }
        
        /* Buttons - Screen only */
        .dotmatrix-buttons {
          margin-top: 5mm;
          display: flex;
          gap: 5mm;
          justify-content: center;
        }
        
        .dotmatrix-buttons button {
          padding: 2mm 4mm;
          background: black;
          color: white;
          border: none;
          border-radius: 1mm;
          cursor: pointer;
          font-family: inherit;
          font-size: 9pt;
          min-width: 20mm;
        }
        
        /* Text visibility enhancements */
        * {
          -webkit-text-stroke: 0.1px;
          text-rendering: optimizeLegibility;
        }
        
        /* Ensure text doesn't get cut off */
        td, th {
          overflow: visible !important;
          max-height: none !important;
        }
        
        /* Screen preview */
        @media screen {
          .dotmatrix-container {
            border: 0.3pt solid #ccc;
            box-shadow: 0 0 2mm rgba(0,0,0,0.1);
            margin-bottom: 10mm;
          }
          
          .bill-box-container {
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
          }
        }
        `}
      </style>

      <div ref={componentRef} style={{padding:'180px'}} className="dotmatrix-wrapper">
        {/* Main Bill Box Container - This creates the box border */}
        <div className="bill-box-container">
          {/* Main Content Area - This will expand with items */}
          <div className="main-content">
            {/* Clinic Header */}
            <div className="clinic-header">
              <div className="clinic-name">
                {ClinicDetials?.ClinicName || "KARUNA MEDICAL COLLEGE HOSPITAL"}
              </div>
              <div className="clinic-address">
                {[ClinicDetials?.ClinicAddress].filter(Boolean).join(", ")} ,{" "}
                {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode]
                  .filter(Boolean)
                  .join(", ")}
              </div>
              <div className="clinic-contact">
                {ClinicDetials?.ClinicMobileNo || ""} | {ClinicDetials?.ClinicLandLineNo || ""} | 9496972555
              </div>
            </div>

            {/* Bill Title */}
            <div className="bill-title">
              OP PHARMACY BILL
            </div>

            {/* Patient Information */}
            <table className="patient-info-table">
              <tbody>
                <tr>
                  <td className="label-left">PATIENT:</td>
                  <td className="value-left" style={{fontWeight: 'bold'}}>
                    {BillData.PatientName || ""}
                  </td>
                  <td className="label-right">INVOICE:</td>
                  <td className="value-right" style={{fontWeight: 'bold'}}>
                    {BillData?.id || ""}
                  </td>
                </tr>
                <tr>
                  <td className="label-left">ID:</td>
                  <td className="value-left">{BillData.PatientId || ""}</td>
                  <td className="label-right">RECEIPT:</td>
                  <td className="value-right">{BillData?.Receipt?.VoucherNo || ""}</td>
                </tr>
                <tr>
                  <td className="label-left">AGE/GENDER:</td>
                  <td className="value-left">
                    {BillData.Age || ""}/{BillData.Gender || ""}
                  </td>
                  <td className="label-right">DATE/TIME:</td>
                  <td className="value-right">{formatDate(BillData?.CreatedAt)} {formatTime(BillData?.CreatedAt)}</td>
                </tr>
                <tr>
                  <td className="label-left">DOCTOR:</td>
                  <td className="value-left">{BillData.Doctor_name || ""}</td>
                  <td className="label-right">PHONE:</td>
                  <td className="value-right">{BillData.PatientPhoneNo || ""}</td>
                </tr>
                <tr>
                  <td className="label-left">DRUG LIC:</td>
                  <td className="value-left" style={{fontSize: '6.5pt'}}>
                    KLK-PKD-09/055 | KL-PKD-09/056
                  </td>
                  <td className="label-right">GST NO:</td>
                  <td className="value-right" style={{fontSize: '6.5pt'}}>
                    {ClinicDetials?.ClinicGST || "32AABTS4963R2ZT"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Items Table */}
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th className="col-sno align-center">SN</th>
                    <th className="col-item" style={{textAlign: "center"}}>ITEMS</th>
                    <th className="col-batch" style={{textAlign: "center"}}>MFD</th>
                    <th className="col-batch" style={{textAlign: "center"}}>BATCH</th>
                    <th className="col-box align-center" style={{textAlign: "center"}}>BOX</th>
                    <th className="col-batch" style={{textAlign: "center"}}>EXP</th>
                    <th className="col-qty align-center" style={{textAlign: "center"}}>QTY</th>
                    <th className="col-rate align-right" style={{textAlign: "center"}}>RATE</th>
                    <th className="col-mrp align-right" style={{textAlign: "center"}}>MRP</th>
                    <th className="col-gst align-center" style={{textAlign: "center"}}>GST%</th>
                    <th className="col-total align-right" style={{textAlign: "center"}}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {BillData?.Items?.map((item, index) => {
                    // Format expiry date
                    const expDate = item.ExpDate || "";
                    const formattedExp = expDate && expDate.length >= 7 
                      ? `${expDate.slice(2, 4)}/${expDate.slice(5, 7)}` 
                      : "";
                    
                    return (
                      <tr key={index}>
                        <td className="align-center">{index + 1}</td>
                        <td style={{lineHeight: '1.1', wordBreak: 'break-word'}}>
                          {item.ItemName || ""}
                        </td>
                        <td>{item.CompanyName || ""}</td>
                        <td>{item.BatchNo || ""}</td> 
                        <td>{item.BoxName || ""}</td>
                        <td className="align-center">{formattedExp}</td>
                        <td className="align-center">{item.Quantity || 0}</td>
                        <td className="align-right">
                          {formatNumber(item.UnitPrice)}
                        </td>
                        <td className="align-right">
                          {formatNumber(item.UnitPrice)}
                        </td>
                        <td className="align-center">{parseInt(item.GST_value) || 0}%</td>
                        <td className="align-right">
                          {formatNumber(item.Total || item.Quantity * item.UnitPrice || 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fixed Footer - Always at bottom of the box */}
          <div className="fixed-footer">
            {/* Amount in Words */}
            <div className="amount-words-section">
              <span className="amount-words-label">AMOUNT IN WORDS:</span>
              <span className="amount-words-value">
                {numberToWords ? numberToWords(+summary.totalAmountt) : "Zero Rupees Only"}
              </span>
            </div>

            {/* Summary Table */}
            <div className="summary-table-container">
              <table className="summary-table">
                <thead>
                  <tr>
                    <th colSpan="4" style={{ textAlign: 'center', fontSize: '8pt' }}>
                       AMOUNT SUMMARY
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="summary-col-label">TAXABLE AMOUNT</td>
                    <td className="summary-col-value">{gstTotals.taxable}</td>
                    <td className="summary-col-label-right">TOTAL GST</td>
                    <td className="summary-col-value-right">{gstTotals.totalGST}</td>
                  </tr>
                  <tr>
                    <td className="summary-col-label">CGST AMOUNT</td>
                    <td className="summary-col-value">{gstTotals.totalCGST}</td>
                    <td className="summary-col-label-right">GROSS AMOUNT</td>
                    <td className="summary-col-value-right">{summary.Amount}</td>
                  </tr>
                  <tr>
                    <td className="summary-col-label">SGST AMOUNT</td>
                    <td className="summary-col-value">{gstTotals.totalSGST}</td>
                    <td className="summary-col-label-right">NET AMOUNT</td>
                    <td className="summary-col-value-right">{BillData?.PaidAmount}.00</td>
                  </tr>
                  <tr>
                    <td className="summary-col-label">BILLED BY</td>
                    <td className="summary-col-value">{BillData?.Receipt?.BilledBy || ""}</td>
                    <td className="summary-col-label-right">DISCOUNT</td>
                    <td className="summary-col-value-right">{summary.Discount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Grand Total */}
            <div className="grand-total-container">
              GRAND TOTAL : {BillData?.PaidAmount}.00
            </div>

            {/* Footer Notes */}
            <div className="footer-notes" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ textAlign: "left", fontSize: "6pt" }}>
                <div>MEDICINE REFUND POSSIBLE WITHIN 7 DAYS OF ORIGINAL BILL</div>
                <div>COLD STORAGE MEDICINES CANNOT BE RETURNED</div>
              </div>

              <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "6pt" }}>
                PHARMACIST SIGNATURE: _________________________
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dotmatrix-buttons">
        <button onClick={handlePrint2}>PRINT</button>
        <button onClick={handlePrintClose}>CLOSE</button>
      </div>
    </div>
  );
};
// const ForPrintBill = () => {
//   // Create a ref for the component to print
//   const componentRef = useRef(null);
  
//   // Formatting functions
//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return d.toISOString().slice(2, 10).replace(/-/g, "-"); // YY-MM-DD format
//   };

//   const formatTime = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return d.toLocaleTimeString('en-IN', { 
//       hour: '2-digit', 
//       minute: '2-digit', 
//       hour12: false 
//     });
//   };

//   const formatNumber = (value, defaultValue = "0.00") => {
//     if (value === null || value === undefined || value === "") return defaultValue;
//     const num = parseFloat(value);
//     return isNaN(num) ? defaultValue : num.toFixed(2);
//   };

//   const safeParseFloat = (value) => {
//     if (value === null || value === undefined || value === "") return 0;
//     const num = parseFloat(value);
//     return isNaN(num) ? 0 : num;
//   };

//   // Handle print function
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     onAfterPrint: () => {
//       // Close the component after printing
//       if (handlePrintClose) handlePrintClose();
//     },
//     documentTitle: `Pharmacy_Bill_${BillData?.id || Date.now()}`,
//     removeAfterPrint: true
//   });

//   // Auto print when component mounts
//   useEffect(() => {
//     // Small delay to ensure DOM is ready
//     const timer = setTimeout(() => {
//       handlePrint();
//     }, 100);
    
//     return () => clearTimeout(timer);
//   }, []);

//   if (!BillData || !BillData.Items || BillData.Items.length === 0) {
//     return (
//       <div className="dotmatrix-container">
//         <p>{error || "No bill data available."}</p>
//         <button onClick={handlePrintClose}>Close</button>
//       </div>
//     );
//   }

//   // Calculate totals
//   const grossAmount = BillData.Items.reduce(
//     (sum, item) => sum + (item.Quantity * item.UnitPrice || item.Total || 0),
//     0
//   );
//   const gstAmount = BillData.Items.reduce(
//     (sum, item) => sum + (item.GSTAmount || 0),
//     0
//   );
//   const discount = BillData.Items.reduce(
//     (sum, item) => sum + (item.Cash_Discount || 0),
//     0
//   );
//   const netAmount = BillData.NetAmount || grossAmount - discount + gstAmount;

//   const summary = {
//     Amount: grossAmount.toFixed(2),
//     GST: gstAmount.toFixed(2),
//     Discount: discount.toFixed(2),
//     totalAmount: netAmount.toFixed(2),
//     totalAmountt: Math.round(netAmount),
//   };

//   // Calculate GST breakdown
//   const calculateGSTBreakdown = () => {
//     let taxable = 0;
//     let totalGST = 0;
//     let totalCGST = 0;
//     let totalSGST = 0;
//     let grossAmount = 0;

//     BillData.Items.forEach(item => {
//       const total = safeParseFloat(item.Total || item.Quantity * item.UnitPrice || 0);
//       const gstPercent = safeParseFloat(item.GST_value || 0);
      
//       const itemTaxable = gstPercent > 0 ? total / (1 + gstPercent / 100) : total;
//       const itemGST = total - itemTaxable;
      
//       taxable += itemTaxable;
//       totalGST += itemGST;
//       totalCGST += itemGST / 2;
//       totalSGST += itemGST / 2;
//       grossAmount += total;
//     });

//     return {
//       taxable: formatNumber(taxable),
//       totalGST: formatNumber(totalGST),
//       totalCGST: formatNumber(totalCGST),
//       totalSGST: formatNumber(totalSGST),
//       grossAmount: formatNumber(grossAmount)
//     };
//   };

//   const gstTotals = calculateGSTBreakdown();

//   return (
//     <div className="dotmatrix-container" style={{ display: 'none' }}>
//       <style>
//         {`
//         /* DOT MATRIX PRINTER OPTIMIZATION */
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }
          
//           body {
//             margin: 0 !important;
//             padding: 0 !important;
//             background: white !important;
//             font-size: 10pt !important;
//             font-family: 'Courier New', monospace !important;
//             line-height: 1.1 !important;
//             width: 210mm !important; /* 21cm paper width */
//             height: auto !important;
//           }
          
//           html, body {
//             height: auto !important;
//             min-height: auto !important;
//           }
          
//           .dotmatrix-container {
//             width: 210mm !important; /* 21cm paper width */
//             min-height: auto !important;
//             height: auto !important;
//             margin: 0 !important;
//             padding: 0 !important;
//             page-break-inside: avoid !important;
//             display: block !important;
//           }
          
//           .dotmatrix-wrapper {
//             position: relative !important;
//             width: 200mm !important; /* 20cm content width */
//             max-width: 200mm !important;
//             margin: 0 auto !important;
//             padding: 2mm 5mm !important; /* 0.5cm left/right margins */
//             background: white !important;
//             page-break-inside: avoid !important;
//             border: none !important;
//             box-shadow: none !important;
//             height: auto !important;
//             min-height: 297mm !important; /* Fixed A4 height */
//           }
          
//           /* Main bill box container */
//           .bill-box-container {
//             border: 1.5pt solid #000 !important;
//             min-height: 280mm !important;
//             height: auto !important;
//             padding: 3mm !important;
//             position: relative !important;
//             margin: 0 !important;
//             background: white !important;
//           }
          
//           .main-content {
//             min-height: calc(280mm - 65mm) !important; /* Total box height minus footer */
//             margin-bottom: 1mm !important;
//           }
          
//           .fixed-footer {
//             position: absolute !important;
//             bottom: 3mm !important;
//             left: 3mm !important;
//             right: 3mm !important;
//             width: calc(100% - 6mm) !important;
//             background: white !important;
//             page-break-inside: avoid !important;
//           }
          
//           .dotmatrix-buttons {
//             display: none !important;
//           }
          
//           /* Remove any page breaks */
//           * {
//             page-break-before: avoid !important;
//             page-break-after: avoid !important;
//             page-break-inside: avoid !important;
//           }
          
//           /* Ensure all text prints */
//           * {
//             color: black !important;
//             -webkit-text-stroke: 0.1px black !important;
//             text-shadow: 0.1px 0 black !important;
//           }
          
//           /* Thin borders for tables */
//           table, tr, td, th {
//             border-color: black !important;
//             border-width: 0.3pt !important;
//           }
          
//           /* Prevent text from being cut off */
//           td, th {
//             overflow: visible !important;
//             white-space: normal !important;
//           }
//         }
        
//         /* Screen display - 21cm width */
//         .dotmatrix-container {
//           font-family: 'Courier New', monospace;
//           font-size: 9pt;
//           line-height: 1.1;
//           width: 210mm; /* 21cm paper width */
//           height: auto;
//           min-height: auto;
//           margin: 0 auto;
//           background: white;
//           color: black;
//           padding: 0;
//           position: relative;
//         }
        
//         .dotmatrix-wrapper {
//           width: 200mm; /* 20cm content width */
//           padding: 2mm 5mm; /* 0.5cm left/right margins */
//           box-sizing: border-box;
//           height: auto;
//           min-height: 297mm; /* A4 height */
//           margin: 0 auto;
//           position: relative;
//         }
        
//         /* Main bill box container */
//         .bill-box-container {
//           border: 1.5pt solid #000;
//           min-height: 280mm;
//           height: auto;
//           padding: 3mm;
//           position: relative;
//           margin: 0;
//           background: white;
//         }
        
//         .main-content {
//           min-height: calc(280mm - 65mm); /* Total box height minus footer */
//           margin-bottom: 1mm;
//         }
        
//         .fixed-footer {
//           position: absolute;
//           bottom: 3mm;
//           left: 3mm;
//           right: 3mm;
//           width: calc(100% - 6mm);
//           background: white;
//         }
        
//         /* Clinic Header */
//         .clinic-header {
//           text-align: center;
//           margin-bottom: 1mm;
//           line-height: 1.1;
//         }
        
//         .clinic-name {
//           font-weight: bold;
//           font-size: 10pt;
//           margin-bottom: 0.2mm;
//           padding: 0.2mm 0;
//           letter-spacing: 0.05em;
//         }
        
//         .clinic-address {
//           font-size: 7pt;
//           margin-bottom: 0.2mm;
//           line-height: 1.1;
//           padding: 0.2mm 0;
//         }
        
//         .clinic-contact {
//           font-size: 7pt;
//           margin-bottom: 0.3mm;
//           line-height: 1.1;
//           padding: 0.2mm 0;
//         }
        
//         /* Bill Title */
//         .bill-title {
//           text-align: center;
//           font-weight: bold;
//           font-size: 9pt;
//           padding: 0.4mm 0;
//           border-bottom: 0.5pt solid #000;
//           border-top: 0.5pt solid #000;
//           margin: 1mm 0;
//         }
        
//         /* Patient Info Table */
//         .patient-info-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-bottom: 1mm;
//           font-size: 7pt;
//         }
        
//         .patient-info-table td {
//           padding: 0.3mm 0.5mm;
//           vertical-align: baseline;
//           line-height: 1.1;
//         }
        
//         .label-left {
//           width: 14%;
//           text-align: left;
//           white-space: nowrap;
//           font-weight: bold;
//         }
        
//         .value-left {
//           width: 36%;
//           text-align: left;
//           padding-right: 0.5mm;
//         }
        
//         .label-right {
//           width: 14%;
//           text-align: left;
//           white-space: nowrap;
//           font-weight: bold;
//         }
        
//         .value-right {
//           width: 36%;
//           text-align: right;
//         }
        
//         /* Items Table - THIN BORDERS */
//         .items-table-container {
//           margin: 1mm 0;
//           overflow: visible;
//           max-height: calc(190mm - 50mm); /* Limit height for scrolling */
//           overflow-y: auto;
//         }
        
//         .items-table {
//           width: 100%;
//           border-collapse: collapse;
//           border: 0.3pt solid #000;
//           font-size: 7pt;
//           table-layout: fixed;
//         }
        
//         .items-table th {
//           text-align: left;
//           padding: 0.5mm;
//           font-weight: bold;
//           border: 0.3pt solid #000;
//           background-color: #f8f8f8;
//           white-space: nowrap;
//         }
        
//         .items-table td {
//           padding: 0.5mm;
//           border: 0.3pt solid #000;
//           vertical-align: top;
//           word-wrap: break-word;
//           overflow: visible;
//         }
        
//         /* Optimized column widths for 20cm width */
//         .col-sno { width: 3%; }
//         .col-item { width: 27%; }
//         .col-batch { width: 9%; }
//         .col-box { width: 4%; }
//         .col-exp { width: 5%; }
//         .col-qty { width: 4%; }
//         .col-rate { width: 7%; }
//         .col-mrp { width: 7%; }
//         .col-gst { width: 5%; }
//         .col-total { width: 7%; }
        
//         .align-right {
//           text-align: right;
//           padding-right: 0.5mm !important;
//         }
        
//         .align-center {
//           text-align: center;
//         }
        
//         /* Amount in Words */
//         .amount-words-section {
//           margin: 1mm 0;
//           padding: 0.5mm;
//           border: 0.3pt solid #000;
//           font-size: 7pt;
//           line-height: 1.1;
//           background-color: #fafafa;
//           word-break: break-word;
//         }
        
//         .amount-words-label {
//           font-weight: bold;
//           display: inline;
//           margin-right: 0.5mm;
//           white-space: nowrap;
//         }
        
//         .amount-words-value {
//           font-style: italic;
//           display: inline;
//         }
        
//         /* Summary Table - THIN BORDERS */
//         .summary-table-container {
//           margin: 1mm 0;
//         }
        
//         .summary-table {
//           width: 100%;
//           border-collapse: collapse;
//           border: 0.3pt solid #000;
//           font-size: 7pt;
//           table-layout: fixed;
//         }
        
//         .summary-table th {
//           text-align: left;
//           padding: 0.5mm;
//           font-weight: bold;
//           border: 0.3pt solid #000;
//           background-color: #f8f8f8;
//         }
        
//         .summary-table td {
//           padding: 0.5mm;
//           border: 0.3pt solid #000;
//           vertical-align: top;
//         }
        
//         .summary-col-label { width: 28%; }
//         .summary-col-value { width: 22%; }
//         .summary-col-label-right { width: 28%; }
//         .summary-col-value-right { width: 22%; text-align: right; padding-right: 0.5mm !important; }
        
//         /* Grand Total */
//         .grand-total-container {
//           margin: 1mm 0;
//           text-align: center;
//           padding: 0.5mm;
//           border: 0.3pt solid #000;
//           font-weight: bold;
//           font-size: 9pt;
//           background-color: #f0f0f0;
//         }
        
//         /* Footer Notes */
//         .footer-notes {
//           margin-top: 1mm;
//           font-size: 6pt;
//           text-align: center;
//           padding-top: 0.5mm;
//           border-top: 0.3pt solid #000;
//           line-height: 1.1;
//         }
        
//         /* Hide buttons completely since we auto-print */
//         .dotmatrix-buttons {
//           display: none !important;
//         }
        
//         /* Text visibility enhancements */
//         * {
//           -webkit-text-stroke: 0.1px;
//           text-rendering: optimizeLegibility;
//         }
        
//         /* Ensure text doesn't get cut off */
//         td, th {
//           overflow: visible !important;
//           max-height: none !important;
//         }
//         `}
//       </style>

//       <div ref={componentRef} className="dotmatrix-wrapper">
//         {/* Main Bill Box Container - This creates the box border */}
//         <div className="bill-box-container">
//           {/* Main Content Area - This will expand with items */}
//           <div className="main-content">
//             {/* Clinic Header */}
//             <div className="clinic-header">
//               <div className="clinic-name">
//                 {ClinicDetials?.ClinicName || "KARUNA MEDICAL COLLEGE HOSPITAL"}
//               </div>
//               <div className="clinic-address">
//                 {[ClinicDetials?.ClinicAddress].filter(Boolean).join(", ")} ,{" "}
//                 {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode]
//                   .filter(Boolean)
//                   .join(", ")}
//               </div>
//               <div className="clinic-contact">
//                 {ClinicDetials?.ClinicMobileNo || ""} | {ClinicDetials?.ClinicLandLineNo || ""} | 9496972555
//               </div>
//             </div>

//             {/* Bill Title */}
//             <div className="bill-title">
//               OP PHARMACY BILL
//             </div>

//             {/* Patient Information */}
//             <table className="patient-info-table">
//               <tbody>
//                 <tr>
//                   <td className="label-left">PATIENT:</td>
//                   <td className="value-left" style={{fontWeight: 'bold'}}>
//                     {BillData.PatientName || ""}
//                   </td>
//                   <td className="label-right">INVOICE:</td>
//                   <td className="value-right" style={{fontWeight: 'bold'}}>
//                     {BillData?.id || ""}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="label-left">ID:</td>
//                   <td className="value-left">{BillData.PatientId || ""}</td>
//                   <td className="label-right">RECEIPT:</td>
//                   <td className="value-right">{BillData?.Receipt?.VoucherNo || ""}</td>
//                 </tr>
//                 <tr>
//                   <td className="label-left">AGE/GENDER:</td>
//                   <td className="value-left">
//                     {BillData.Age || ""}/{BillData.Gender || ""}
//                   </td>
//                   <td className="label-right">DATE/TIME:</td>
//                   <td className="value-right">{formatDate(BillData?.CreatedAt)} {formatTime(BillData?.CreatedAt)}</td>
//                 </tr>
//                 <tr>
//                   <td className="label-left">DOCTOR:</td>
//                   <td className="value-left">{BillData.Doctor_name || ""}</td>
//                   <td className="label-right">PHONE:</td>
//                   <td className="value-right">{BillData.PatientPhoneNo || ""}</td>
//                 </tr>
//                 <tr>
//                   <td className="label-left">DRUG LIC:</td>
//                   <td className="value-left" style={{fontSize: '6.5pt'}}>
//                     KLK-PKD-09/055 | KL-PKD-09/056
//                   </td>
//                   <td className="label-right">GST NO:</td>
//                   <td className="value-right" style={{fontSize: '6.5pt'}}>
//                     {ClinicDetials?.ClinicGST || "32AABTS4963R2ZT"}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Items Table */}
//             <div className="items-table-container">
//               <table className="items-table">
//                 <thead>
//                   <tr>
//                     <th className="col-sno align-center">SN</th>
//                     <th className="col-item" style={{textAlign: "center"}}>ITEMS</th>
//                     <th className="col-batch" style={{textAlign: "center"}}>MFD</th>
//                     <th className="col-batch" style={{textAlign: "center"}}>BATCH</th>
//                     <th className="col-box align-center" style={{textAlign: "center"}}>BOX</th>
//                     <th className="col-batch" style={{textAlign: "center"}}>EXP</th>
//                     <th className="col-qty align-center" style={{textAlign: "center"}}>QTY</th>
//                     <th className="col-rate align-right" style={{textAlign: "center"}}>RATE</th>
//                     <th className="col-mrp align-right" style={{textAlign: "center"}}>MRP</th>
//                     <th className="col-gst align-center" style={{textAlign: "center"}}>GST%</th>
//                     <th className="col-total align-right" style={{textAlign: "center"}}>TOTAL</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {BillData?.Items?.map((item, index) => {
//                     // Format expiry date
//                     const expDate = item.ExpDate || "";
//                     const formattedExp = expDate && expDate.length >= 7 
//                       ? `${expDate.slice(2, 4)}/${expDate.slice(5, 7)}` 
//                       : "";
                    
//                     return (
//                       <tr key={index}>
//                         <td className="align-center">{index + 1}</td>
//                         <td style={{lineHeight: '1.1', wordBreak: 'break-word'}}>
//                           {item.ItemName || ""}
//                         </td>
//                         <td>{item.CompanyName || ""}</td>
//                         <td>{item.BatchNo || ""}</td> 
//                         <td>{item.BoxName || ""}</td>
//                         <td className="align-center">{formattedExp}</td>
//                         <td className="align-center">{item.Quantity || 0}</td>
//                         <td className="align-right">
//                           {formatNumber(item.UnitPrice)}
//                         </td>
//                         <td className="align-right">
//                           {formatNumber(item.UnitPrice)}
//                         </td>
//                         <td className="align-center">{parseInt(item.GST_value) || 0}%</td>
//                         <td className="align-right">
//                           {formatNumber(item.Total || item.Quantity * item.UnitPrice || 0)}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Fixed Footer - Always at bottom of the box */}
//           <div className="fixed-footer">
//             {/* Amount in Words */}
//             <div className="amount-words-section">
//               <span className="amount-words-label">AMOUNT IN WORDS:</span>
//               <span className="amount-words-value">
//                 {numberToWords ? numberToWords(+summary.totalAmountt) : "Zero Rupees Only"}
//               </span>
//             </div>

//             {/* Summary Table */}
//             <div className="summary-table-container">
//               <table className="summary-table">
//                 <thead>
//                   <tr>
//                     <th colSpan="4" style={{ textAlign: 'center', fontSize: '8pt' }}>
//                        AMOUNT SUMMARY
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="summary-col-label">TAXABLE AMOUNT</td>
//                     <td className="summary-col-value">{gstTotals.taxable}</td>
//                     <td className="summary-col-label-right">TOTAL GST</td>
//                     <td className="summary-col-value-right">{gstTotals.totalGST}</td>
//                   </tr>
//                   <tr>
//                     <td className="summary-col-label">CGST AMOUNT</td>
//                     <td className="summary-col-value">{gstTotals.totalCGST}</td>
//                     <td className="summary-col-label-right">GROSS AMOUNT</td>
//                     <td className="summary-col-value-right">{summary.Amount}</td>
//                   </tr>
//                   <tr>
//                     <td className="summary-col-label">SGST AMOUNT</td>
//                     <td className="summary-col-value">{gstTotals.totalSGST}</td>
//                     <td className="summary-col-label-right">NET AMOUNT</td>
//                     <td className="summary-col-value-right">{BillData?.PaidAmount}</td>
//                   </tr>
//                   <tr>
//                     <td className="summary-col-label">BILLED BY</td>
//                     <td className="summary-col-value">{BillData?.Receipt?.BilledBy || ""}</td>
//                     <td className="summary-col-label-right">DISCOUNT</td>
//                     <td className="summary-col-value-right">{summary.Discount}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             {/* Grand Total */}
//             <div className="grand-total-container">
//               GRAND TOTAL : {BillData?.PaidAmount}
//             </div>

//             {/* Footer Notes */}
//             <div className="footer-notes" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
//               <div style={{ textAlign: "left", fontSize: "6pt" }}>
//                 <div>MEDICINE REFUND POSSIBLE WITHIN 7 DAYS OF ORIGINAL BILL</div>
//                 <div>COLD STORAGE MEDICINES CANNOT BE RETURNED</div>
//               </div>

//               <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "6pt" }}>
//                 PHARMACIST SIGNATURE: _________________________
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Remove buttons since we auto-print */}
//       <div className="dotmatrix-buttons" style={{ display: 'none' }}>
//         <button onClick={handlePrint2}>PRINT</button>
//         <button onClick={handlePrintClose}>CLOSE</button>
//       </div>
//     </div>
//   );
// };

  return (
    <>
      {printView === null ? (
        <div className="Main_container_app">
          <h3>OP Pharmacy Billing List</h3>
          {isLoading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="search_div_bar">
            <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
              <div className="RegisForm_1">
                <label>Date Type:</label>
                <select name="DateType" value={searchOptions.DateType} onChange={HandleOnchangeSearch}>
                  <option value="Current">Current Date</option>
                  <option value="Customize">Customize</option>
                </select>
              </div>
              {searchOptions.DateType === "Current" ? (
                <div className="RegisForm_1">
                  <label>Current Date:</label>
                  <input type="date" name="CurrentDate" value={searchOptions.CurrentDate} readOnly />
                </div>
              ) : (
                <>
                  <div className="RegisForm_1">
                    <label>From Date:</label>
                    <input type="date" name="FromDate" value={searchOptions.FromDate} onChange={HandleOnchangeSearch} />
                  </div>
                  <div className="RegisForm_1">
                    <label>To Date:</label>
                    <input type="date" name="ToDate" value={searchOptions.ToDate} onChange={HandleOnchangeSearch} />
                  </div>
                </>
              )}
              <div className="RegisForm_1">
                <label>Name/Billno/Phn:</label>
                <input
                  type="text"
                  name="SearchbyFirstName"
                  value={searchOptions.SearchbyFirstName}
                  onChange={HandleOnchangeSearch}
                />
              </div>
              <div className="RegisForm_1">
                <label>Registeration No:</label>
                <input
                  type="text"
                  name="RegisterId"
                  value={searchOptions.RegisterId}
                  onChange={HandleOnchangeSearch}
                />
              </div>
              {/* <div className="RegisForm_1">
                <label>/Billno/Phn:</label>
                <input
                  type="text"
                  name="SearchbyFirstName"
                  value={searchOptions.SearchbyFirstName}
                  onChange={HandleOnchangeSearch}
                />
              </div> */}
              <div className="RegisForm_1">
                <label>Status:</label>
                <select name="SearchStatus" value={searchOptions.SearchStatus} onChange={HandleOnchangeSearch}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Due">Due</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <br />
              <Button
                className="search_div_bar_btn_1"
                style={{ backgroundColor: 'grey', borderRadius: '15px', color: 'white' }}
                onClick={handlePharmacybilling}
                title="New Pharmacy Billing"
              >
                <TiPlus />
              </Button>
               <button
                className="search_div_bar_btn_1"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
            <ReactGrid columns={UserRegisterColumns} RowData={Filterdata} />
          </div>
{toast.message && (
  <ToastAlert Message={toast.message} Type={toast.type} />
)}
        </div>
      ) : printView === "bill" ? (
        <ForPrintBill />
      ) : null}
    </>
  );
};

export default PharmacyBillingLIst;
