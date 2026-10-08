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

const OpticalBilling = () => {


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
const dispatchvalue = useDispatch();
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

  const [searchOptions, setSearchOptions] = useState({
    DateType: "Current",
    CurrentDate: TodayDate,
    FromDate: "",
    ToDate: "",
    SearchbyFirstName: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "Pending",
  });

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


  useEffect(() => {
  const controller = new AbortController();   // <-- Create AbortController
  const signal = controller.signal;

  setIsLoading(true);
  setError(null);

  const endpoint =
    searchOptions.SearchStatus === "Paid"
      ? `${UrlLink}DrugAdminstrations/fetch_pharmacy_billing_optical`
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
    } else if (name === "SearchbyFirstName" || name === "SearchbyPhoneNumber") {
      setSearchOptions((prev) => ({ ...prev, [name]: value }));
    } else {
      setSearchOptions((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRequestEdit1 = (params) => {
    if (!params) {
      console.error("Invalid params:", params);
      return;
    }

    console.log("params", params);

    const { PatientId, VisitId, PatientName, DoctorName, Doctorid } = params;

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

    navigate("/Home/InventoryMaster");
    dispatch({ type: "HrFolder", value: "OpticalBill" });
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
    navigate("/Home/InventoryMaster");
    dispatch({ type: "HrFolder", value: "OpticalBill" });
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



  // const handlePrint2 = async () => {
  //   try {
  //     console.log("Clinic++++++", ClinicDetials);
  //     const Sdata = {
  //       ...BillData,
  //       Hospital_Name: "KARUNA MEDICAL COLLEGE HOSPITAL",
  //       Clinic_DoorNo: ClinicDetials?.Clinic_DoorNo,
  //       Clinic_Street: ClinicDetials?.Clinic_Street,
  //       Clinic_Area: ClinicDetials?.Clinic_Area,
  //       Clinic_City: ClinicDetials?.Clinic_City,
  //       Clinic_State: ClinicDetials?.Clinic_State,
  //       Clinic_LandlineNo: ClinicDetials?.Clinic_LandlineNo,
  //       Clinic_PhoneNo: ClinicDetials?.Clinic_PhoneNo,
  //       DrugLicenseNoOne: ClinicDetials?.DrugLicenseNoOne,
  //       print: "Bill_Reprint"
  //     }
  //     console.log("Clinic++++++", Sdata);

  //     const response = await fetch("http://localhost:5000/print-job", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(Sdata),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       console.log("Print job sent successfully:", data);
  //       return { success: true, data };
  //     } else {
  //       console.error("Print job failed:", data);
  //       return { success: false, error: data.message || "Unknown error" };
  //     }
  //   } catch (error) {
  //     console.error("Error sending print job:", error);
  //     return { success: false, error: error.message };
  //   }
  // };



  const handlePrint2 = async () => {
  try {
    console.log("Clinic++++++", ClinicDetials);
    
    // Optional: Still send to server if needed
    const Sdata = {
      ...BillData,
      Hospital_Name: "KG MEDICAL CENTRE",
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
    
    // Send to server in background (non-blocking)
    fetch("http://localhost:5000/print-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Sdata),
    }).catch(err => console.log("Server print failed:", err));
    
    // ✅ IMMEDIATELY open Chrome print dialog
    setTimeout(() => {
      window.print();
    }, 300); // Small delay to ensure UI is ready
    
  } catch (error) {
    console.error("Error:", error);
    // Still try to print even if there's an error
    setTimeout(() => {
      window.print();
    }, 300);
  }
 }; 


  const handlePrintClose = () => {
    setPrintView(null);
    setBillData(null);
    setError(null);
      navigate("/Home/InventoryMaster");
          dispatchvalue({ type: "HrFolder", value: "OpticalBilling" });
          dispatchvalue({ type: "setPreviousFolder", value: null });
          dispatchvalue({ type: "showMenu", value: true });
  };

  const UserRegisterColumns = [
    { key: "id", name: "S No", frozen: true },
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
  if (!BillData || !BillData.Items || BillData.Items.length === 0) {
    return (
      <div className="dotmatrix-container">
        <p>{error || "No bill data available."}</p>
        <button onClick={handlePrintClose}>Close</button>
      </div>
    );
  }

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

  // ✅ Add this line (no need of state or useEffect)

  console.log('guhsn',BillData?.Items);
  
 const totalGST = BillData?.Items?.reduce(
  (acc, item) => acc + (parseFloat(item?.GST_value) || 0),
  0
);


  return (
    <div className="dotmatrix-container">
        <div ref={componentRef} className="dotmatrix-wrapper">
          <table className="dotmatrix-table">
            <thead>
              {/* Header */}
              <tr>
                <td colSpan="10" className="dotmatrix-header">
                  <div className="dotmatrix-header-content">
                    <div className="dotmatrix-clinic-info">
                      <span>{ClinicDetials?.ClinicName || "KARUNA MEDICAL COLLEGE HOSPITAL"}</span>
                      <br />
                      <br />
                      <div>
                        {[ClinicDetials?.ClinicAddress].filter(Boolean).join(", ")} ,{" "}
                        {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      {/* <div>
                      {[ClinicDetials?.ClinicMobileNo, ClinicDetials?.ClinicLandLineNo, ClinicDetials?.ClinicMailID]
                        .filter(Boolean)
                        .join(" , ")}
                    </div> */}
                    </div>
                  </div>
                </td>
              </tr>

              {/* Title */}
              <tr>
                <td colSpan="10" className="dotmatrix-bill-title">
                 Optical Billing
                </td>
              </tr>

              {/* Patient Info */}
              <tr>
                <td colSpan="10">
                  <div className="dotmatrix-separator" />
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td className="label">Patient Name</td>
                        <td className="value">: {BillData.PatientName}</td>
                        <td className="label">Invoice No</td>
                        <td className="value">: {BillData?.id}</td>
                      </tr>
                      <tr>
                        <td className="label">Patient ID</td>
                        <td className="value">: {BillData.PatientId}</td>
                        <td className="label">GSTIN No</td>
                        <td className="value">: {ClinicDetials.ClinicGST}</td>
                      </tr>
                      <tr>
                        <td className="label">Register Id</td>
                        <td className="value">
                          : {BillData?.RegisterId}
                        </td>
                        <td className="label">Drug Lisence No</td>
                        <td className="value" >: KLK-PKD-09/055 | KL-PKD-09/056</td>
                      </tr>
                      <tr>
                        <td className="label">Age / Gender</td>
                        <td className="value">
                          : {BillData.Age} / {BillData.Gender}
                        </td>
                        <td className="label">Date</td>
                        <td className="value">: {BillData?.CreatedAt}</td>
                      </tr>
                      <tr>
                        <td className="label">Doctor Name</td>
                        <td className="value">: {BillData.Doctor_name}</td>
                        <td className="label">Patient Ph No</td>
                        <td className="value">: {BillData.PatientPhoneNo}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </thead>

            {/* Medicines */}
            <tbody>
              <tr>
                <td colSpan="10">
                  <div className="dotmatrix-separator" />
                  <table className="dotmatrix-inner-table">
                    <thead>
                      <tr className="item-header">
                        <th>S.No</th>
                        <tr className="item-header-left">
                          <th>Item</th>
                        </tr>
                        <th>Batch</th>
                        <th>BoxName</th>
                        {/* <th>Exp</th> */}
                        <th>Qty</th>
                        {/* <th>GST</th> */}
                        <th style={{ textAlign: "center" }}>MRP</th>
                        <th style={{ textAlign: "center" }}>Rate</th>
                        <th style={{ textAlign: "center" }}>GST</th>
                        {/* <th>Disc</th>
                      <th>GST</th> */}
                        <th style={{ textAlign: "center" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BillData?.Items?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <tr className="item-header-left">
                            <td>{item.ItemName}</td>
                          </tr>
                          <td>{item.BatchNo}</td>
                          <td>{item.BoxName}</td>
                          {/* <td>{item.ExpDate}</td> */}
                          <td>{item.Quantity}</td>
                          <td style={{ textAlign: "right" }}>{item.UnitPrice}</td>
                          <td style={{ textAlign: "right" }}>{item.Total}</td>
                          {/* <td>
                          {item.CD_Method === "Percentage"
                            ? `${item.Cash_Discount}%`
                            : item.CD_Method === "Cash"
                            ? `Rs. ${item.Cash_Discount}`
                            : "No"}
                        </td>*/}
                        <td>{item.GST_value || 0}%</td> 
                          <td className="dotmatrix-align-right" style={{ textAlign: "right" }}>
                            {item.Total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="dotmatrix-separator" />
                </td>
              </tr>
            </tbody>

            {/* Totals */}
            <tfoot>
              <tr>
                <td colSpan="10">
                  <table className="totals-table">
                    <tbody>
                      <tr>
                        <td className="pharm-label">Amount In Words</td>
                        <td className="pharm-value">: {numberToWords(+summary.totalAmountt)}</td>
                        <td className="pharm-label-right"></td>
                        <td className="pharm-value-right"> </td>
                      </tr>
                      <tr>
                        <td className="pharm-label">Billed By</td>
                        <td className="pharm-value">: {BillData?.Receipt?.BilledBy}</td>
                        <td className="pharm-label-right">Gross Amount</td>
                        <td className="pharm-value-right">: {summary.totalAmount}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="pharm-label-right">Net Amount</td>
                        {/* <td className="pharm-value-right">: {Math.round(parseFloat(summary.totalAmount))}</td> */}
                        <td className="pharm-value-right">: {Math.round(parseFloat(summary.totalAmount))}</td>

                      </tr>
                    </tbody>
                  </table>

                  <div className="dotmatrix-separator" />
                  <div className="dotmatrix-footer-note">
                    Medicine refund is possible within 7 days of its original bill.
                  </div>
                  <div className="dotmatrix-footer-note">
                    Medicines/injections needs cold storage, once sold cannot be taken back.
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="dotmatrix-buttons">
          <button style={{padding:'10px',backgroundColor:'black',borderRadius:'5px',color:'white'}} onClick={handlePrint2}>Print</button>
          <button style={{padding:'10px',backgroundColor:'black',borderRadius:'5px',color:'white'}} onClick={handlePrintClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <>
    

<style>
        {`
          /* Print Styles - Hide everything except the bill */
          @media print {
            /* Hide everything */
            body * {
              visibility: hidden;
            }
            
            /* Show only the bill container and its children */
            .dotmatrix-container,
            .dotmatrix-container * {
              visibility: visible;
            }
            
            /* Position the bill at the top-left */
            .dotmatrix-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }
            
            /* Hide the print and close buttons */
            .dotmatrix-buttons {
              display: none !important;
            }
            
            /* Ensure tables don't break across pages */
            .dotmatrix-table {
              page-break-inside: avoid;
            }
          }
        `}
      </style>
      {printView === null ? (
        <div className="Main_container_app">
          <h3>Optical Billing List</h3>
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
                title="New Optical Billing"
              >
                <TiPlus />
              </Button>
            </div>
            <ReactGrid columns={UserRegisterColumns} RowData={Filterdata} />
          </div>
          <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
      ) : printView === "bill" ? (
        <ForPrintBill />
      ) : null}
    </>
  );
};

export default OpticalBilling;
