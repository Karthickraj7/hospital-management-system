import React, { useEffect, useState, useRef,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useReactToPrint } from "react-to-print";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { TiPlus } from "react-icons/ti";
import "../OPPharmacy/OPpharmacy.css";
import LoupeIcon from "@mui/icons-material/Loupe";
import Tooltip from "@mui/material/Tooltip";
import CancelIcon from "@mui/icons-material/Cancel";


const IPAmountCollectionList = () => {
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
      "Seventeen", "Eighteen", "Nineteen"
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
  const [TodayDate] = useState(formatDate(new Date()));
  const [Filterdata, setFilterdata] = useState([]);
  const [Refunddatas, setRefunddatas] = useState([]);

  console.log(Refunddatas,'Refunddatasssss')
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
  const [Load, setLoad] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    DateType: "Current",
    CurrentDate: TodayDate,
    FromDate: "",
    ToDate: "",
    SearchbyFirstName: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "Paid",
    Pharma_Type: "IP PHARMACY",
    pharma: "3",
  });

  // Fetch clinic details


  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((res) => {
        const clinic = res.data[0];
        if (clinic) {
          const address = [clinic.DoorNo, clinic.Area].filter(Boolean).join(", ");
          setClinicDetials({
            ClinicName: clinic.Clinic_Name || "",
            ClinicAddress: address,
            ClinicGST: clinic.GSTNo || "",
            ClinicCity: clinic.City || "",
            ClinicState: clinic.State || "",
            ClinicCode: clinic.Pincode || "",
            ClinicMobileNo: clinic.PhoneNo || "",
            ClinicLandLineNo: clinic.LandlineNo || "",
            ClinicMailID: clinic.Mail || "",
          });
        }
      })
      .catch((err) => {
        console.error("Clinic fetch error:", err);
        setError("Failed to fetch clinic details");
      })
      .finally(() => setIsLoading(false));
  }, [UrlLink]);

  // Fetch patient bills

const idleTimer = useRef(null);

const fetchIPBillingData = useCallback(() => {
  setIsLoading(true);
  setError(null);

  if (searchOptions.SearchStatus === "Paid") {
    axios
      .get(`${UrlLink}DrugAdminstrations/fetch_ip_pharmacy_billing_for_Acceptance`, {
        params: { ...searchOptions, location: 1, type: "IP" },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const mappedData = data.map((bill, index) => ({
          ...bill,
          id: bill.id || index + 1,
          Date: formatDate(bill.BillingDate || new Date()),
          PatientId: bill.PatientId || "",
          VisitId: bill.VisitId || "",
          Items: bill.Items || [],
          Status: bill.Status || "Pending",
          Doctor_name: bill.DoctorName || "",
          PatientName: bill.PatientName || "",
          PatientPhoneNo: bill.PatientPhoneNo || "",
          NetAmount: bill.NetAmount || 0,
          Receipt: bill.Receipt || {},
        }));
        setFilterdata(mappedData);
      })
      .catch((err) => {
        console.error("IP Billing fetch error:", err);
        setError("Failed to fetch patient bills");
      })
      .finally(() => setIsLoading(false));
  } 
  
  else if (searchOptions.SearchStatus === "Refunded") {
    axios
      .get(`${UrlLink}DrugAdminstrations/fetch_ip_pharmacy_refund_billing_for_Acceptance`, {
        params: { ...searchOptions, location: 1, type: "IP" },
      })
      .then((res) => {
        const data = Array.isArray(res.data.ip_pharmacy_refund_bills)
          ? res.data.ip_pharmacy_refund_bills
          : [];
        setRefunddatas(data);
      })
      .catch((err) => {
        console.error("Refund Billing fetch error:", err);
        setError("Failed to fetch refunded bills");
      })
      .finally(() => setIsLoading(false));
  }
}, [UrlLink, searchOptions, Load]);

// 🔹 Setup idle detection + auto reload (same as OP)
useEffect(() => {
  const resetTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      console.log("No activity detected → Reloading IP data...");
      fetchIPBillingData();
    }, 1000); // ⏱ 1 second idle → reload (change to 30000 for 30s)
  };

  // Run immediately
  fetchIPBillingData();

  // Detect mouse/keyboard activity
  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);

  resetTimer(); // start timer

  // Cleanup
  return () => {
    window.removeEventListener("mousemove", resetTimer);
    window.removeEventListener("keydown", resetTimer);
    if (idleTimer.current) clearTimeout(idleTimer.current);
  };
}, [fetchIPBillingData]);


  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === "DateType") {
      if (value === "Current") {
        setSearchOptions((prev) => ({ ...prev, DateType: value, CurrentDate: TodayDate, FromDate: "", ToDate: "" }));
      } else {
        setSearchOptions((prev) => ({ ...prev, DateType: value, CurrentDate: "" }));
      }
    } else {
      setSearchOptions((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRequestEdit = (params) => {
    if (!params) return;
    dispatch({
      type: "Selected_Patient_Pharmacy",
      value: {
        PatientID: params.PatientId,
        VisitID: params.VisitId,
        Patient_Name: params.PatientName,
        Doctor_name: params.Doctor_name,
        Doctorid: params.Doctorid || "",
        type: "IP",
        Department: 2,
        Edit: true,
        ...params,
      },
    });
    navigate("/Home/Pharmacy");
    dispatch({ type: "HrFolder", value: "OPPharmacyBillingnew" });
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

  const handleCollection = (bill) => {
    const senddata = {
      collectedby: userRecord.username,
      InvoiceNo: bill.id,
       paymentMethods : paymentMethods
    };
    axios
      .post(`${UrlLink}Frontoffice/IPPharmacy_amount_collection`, senddata)
      .then((res) => {
        const response = res.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        dispatch({
          type: "toast",
          value: { message: messageContent, type: messageType },
        });
        setLoad((prev) => !prev);
        setPaymentMethods({});
      })
      .catch((err) => {
        console.error(err);
        dispatch({
          type: "toast",
          value: { message: "An error occurred while processing the collection.", type: "error" },
        });
      });
  };

  const handleCollectionCancel = (bill) => {
    const senddata = {
      collectedby: userRecord.username,
      InvoiceNo: bill.id,
    };
    axios
      .post(`${UrlLink}Frontoffice/IPPharmacy_amount_collection_Cancel`, senddata)
      .then((res) => {
        const response = res.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        dispatch({
          type: "toast",
          value: { message: messageContent, type: messageType },
        });
        setLoad((prev) => !prev);
        setPaymentMethods({});
      })
      .catch((err) => {
        console.error(err);
        dispatch({
          type: "toast",
          value: { message: "An error occurred while processing the collection.", type: "error" },
        });
      });
  };

  const handleRefundaccept = (bill) => {

    console.log(bill,'bill')

    const senddata = {
      collectedby: userRecord.username,
      InvoiceNo: bill.id,
    };

    axios
      .post(`${UrlLink}Frontoffice/IPPharmacy_Refund_amount_collection`, senddata)
      .then((res) => {
        const response = res.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        dispatch({
          type: "toast",
          value: { message: messageContent, type: messageType },
        });
        setLoad((prev) => !prev);
        setPaymentMethods({});
      })
      .catch((err) => {
        console.error(err);
        dispatch({
          type: "toast",
          value: { message: "An error occurred while processing the collection.", type: "error" },
        });
      });

  }

  const handleRefundcancel = (bill) => {

    console.log(bill,'bill')

    const senddata = {
      collectedby: userRecord.username,
      InvoiceNo: bill.id,
    };

    axios
      .post(`${UrlLink}Frontoffice/IPPharmacy_Refund_amount_collection_Cancel`, senddata)
      .then((res) => {
        const response = res.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        dispatch({
          type: "toast",
          value: { message: messageContent, type: messageType },
        });
        setLoad((prev) => !prev);
        setPaymentMethods({});
      })
      .catch((err) => {
        console.error(err);
        dispatch({
          type: "toast",
          value: { message: "An error occurred while processing the collection.", type: "error" },
        });
      });

  }

  const handlePharmacybilling = () => {
    dispatch({ type: "Selected_Patient_Pharmacy", value: { type: "IP", Department: 3 } });
    navigate("/Home/Pharmacy");
    dispatch({ type: "HrFolder", value: "NewIPPharmacyBilling" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      navigate("/Home/Pharmacy");
      dispatch({ type: "HrFolder", value: "IPPharmacyBillingList" });
      dispatch({ type: "setPreviousFolder", value: null });
      dispatch({ type: "showMenu", value: true });
    },
  });

  const handlePrintClose = () => {
    setPrintView(null);
    setBillData(null);
    setError(null);
    navigate("/Home/Pharmacy");
    dispatch({ type: "HrFolder", value: "IPPharmacyBillingList" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });
  };

  const [paymentMethods, setPaymentMethods] = useState({});
  
     const handlePaymentMethodChange = (rowId, value) => {
      setPaymentMethods((prev) => ({
        ...prev,
        [rowId]: value || "", // Default to "Cash" if value is empty
      }));
      console.log(`Payment method for row ${rowId}: ${value || ""}`);
    };

     const PaymentCollectionCell = ({
      row,
      collections,
      handleAddPayment,
      handleRemovePayment,
      handleFinalizeCollection,
    }) => {
      const rowId = row.id;
      const payments = collections[rowId] || [];
      const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
      const billAmount = row.PaidAmount || 0;
      const remaining = billAmount - totalCollected;
    
      const [tempMethod, setTempMethod] = React.useState("");
      const [tempAmount, setTempAmount] = React.useState("");
    
      const addPayment = () => {
        const amt = Number(tempAmount);
        if (!tempMethod || isNaN(amt) || amt <= 0) return;
    
        if (amt > remaining) {
          alert("Amount exceeds bill!");
          return;
        }
    
        handleAddPayment(rowId, tempMethod, amt);
        setTempMethod("");
        setTempAmount("");
      };
    
      return (
        <div style={{ minWidth: "280px", fontSize: "13px" }}>
          
          {/* Existing Payments */}
          {payments.length > 0 ? (
            <>
              {payments.map((p, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span>{p.method}: ₹{p.amount}</span>
                  <Button size="small" onClick={() => handleRemovePayment(rowId, idx)}>
                    <CancelIcon fontSize="small" />
                  </Button>
                </div>
              ))}
    
              <strong>Total: ₹{totalCollected}</strong>
              <div style={{ color: remaining > 0 ? "red" : "green" }}>
                Remaining: ₹{remaining}
              </div>
            </>
          ) : (
            <span style={{ color: "#888" }}>No payments added</span>
          )}
    
          {/* Add Payment */}
          {remaining > 0 && (
            <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
              <select
                value={tempMethod}
                onChange={(e) => setTempMethod(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
    
              <input
                type="number"
                placeholder="Amount"
                value={tempAmount}
                onChange={(e) => setTempAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPayment()}
                min="1"
                max={remaining}
                style={{ width: "90px" }}
              />
    
              <Button size="small" variant="outlined" onClick={addPayment}>
                Add
              </Button>
            </div>
          )}
    
          {/* Confirm */}
          {totalCollected === billAmount && billAmount > 0 && (
            <Button
              variant="contained"
              color="success"
              size="small"
              style={{ marginTop: "10px" }}
              onClick={() => handleFinalizeCollection(row)}
              startIcon={<CheckCircleOutlineIcon />}
            >
              Confirm
            </Button>
          )}
        </div>
      );
    };

     const [collections, setCollections] = useState({}); 
      // { rowId: [{ method: "Cash", amount: 100 }, { method: "UPI", amount: 100 }] }
    
      // Handlers for Multiple Payments
      const handleAddPayment = (rowId, method, amountStr) => {
        const amount = Number(amountStr);
        if (!method || isNaN(amount) || amount <= 0) return;
    
        const currentPayments = collections[rowId] || [];
        const totalSoFar = currentPayments.reduce((sum, p) => sum + p.amount, 0);
        const billAmount = Filterdata.find(r => r.id === rowId)?.PaidAmount || 0;
    
        if (totalSoFar + amount > billAmount) {
          alert("Amount exceeds remaining bill!");
          return;
        }
    
        setCollections(prev => ({
          ...prev,
          [rowId]: [...(prev[rowId] || []), { method, amount }]
        }));
      };
    
      const handleRemovePayment = (rowId, index) => {
        setCollections(prev => ({
          ...prev,
          [rowId]: (prev[rowId] || []).filter((_, i) => i !== index)
        }));
      };
    
      const handleFinalizeCollection = (row) => {
        const payments = collections[row.id] || [];
        const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
        const billAmount = row.PaidAmount || 0;
    
        if (totalCollected < billAmount) {
          alert("Full amount not collected!");
          return;
        }
    
        const senddata = {
          collectedby: userRecord.username,
          InvoiceNo: row.id,
          paymentMethods: payments, // Array of { method, amount }
        };
    
        axios
          .post(`${UrlLink}Frontoffice/IPPharmacy_amount_collection`, senddata)
          .then((res) => {
            const response = res.data;
            const messageType = Object.keys(response)[0];
            const messageContent = Object.values(response)[0];
            dispatch({
              type: "toast",
              value: { message: messageContent, type: messageType },
            });
            setLoad(prev => !prev);
            setCollections(prev => {
              const newState = { ...prev };
              delete newState[row.id];
              return newState;
            });
          })
          .catch((err) => {
            console.error(err);
            dispatch({
              type: "toast",
              value: { message: "Error processing payment", type: "error" },
            });
          });
      };

  const UserRegisterColumns = [
      { key: "id", name: "S No", frozen: true },
      { key: "BillingDate", name: "Date", frozen: true },
      {
        key: "PatientName",
        name: "Patient Name",
        frozen: true,
        renderCell: (params) => (
          <Tooltip
            title={
              Array.isArray(params.row.Items) && params.row.Items.length > 0 ? (
                <div>{params.row.Items.map((item, idx) => <div key={idx}>{item.ItemName}</div>)}</div>
              ) : "No items"
            }
            placement="top"
            arrow
          >
            <span>{params.row.PatientName}</span>
          </Tooltip>
        ),
      },
      { key: "PatientPhoneNo", name: "Contact Number", frozen: true },
      { key: "Doctor_name", name: "Doctor Name", frozen: true },
      { key: "PaidAmount", name: "Paid Amount", frozen: true },
  
      {
        key: "PaymentCollection",
        name: "Payment Collection",
        renderCell: (params) => (
          <PaymentCollectionCell
            row={params.row}
            collections={collections}
            handleAddPayment={handleAddPayment}
            handleRemovePayment={handleRemovePayment}
            handleFinalizeCollection={handleFinalizeCollection}
          />
        ),
      },
      {
        key: "Action",
        name: "Action",
        renderCell: (params) => (
          <>
            {(params.row.Status === "Pending" || params.row.Status === "Request") && params.row.Date === TodayDate && (
              <Button className="cell_btn" onClick={() => handleRequestEdit(params.row)}>
                <ArrowForwardIcon />
              </Button>
            )}
            {(params.row.Status === "Paid" || params.row.Status === "Due") && (
              <Button className="cell_btn" onClick={() => handleBillView(params.row)}>
                <PrintIcon />
              </Button>
            )}
            {!(["Pending", "Request", "Paid", "Due"].includes(params.row.Status)) && (
              <span>No Action</span>
            )}
          </>
        ),
      },
    ];

  const RefundColumns = [
    { key: "S_No", name: "S No", frozen: true },
    { key: "Billing_Date", name: "Date", frozen: true },
    { key: "id", name: "Invoice", frozen: true },
    { key: "PatientId", name: "Patient Id", frozen: true },
    {
      key: "Patient_Name",
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
          <span>{params.row.Patient_Name}</span>
        </Tooltip>
      ),
    },
    { key: "PhoneNo", name: "Contact Number", frozen: true },
    { key: "Doctor_Name", name: "Doctor Name", frozen: true },
    { key: "Bill_Status", name: "Status" },
    { key: "PaidAmount", name: "Refund Amount" },
    
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          {params.row.Bill_Status !== "RefundPayment" ? (
            <Button onClick={() => handleRequestEdit(params.row)}>
              <ArrowForwardIcon />
            </Button>
          ) : (
            <Button onClick={() => handleBillView(params.row)}>
              <PrintIcon />
            </Button>
          )}
        </>
      ),
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          {params.row.Bill_Status !== "RefundPayment" ? (
            <Button onClick={() => handleRequestEdit(params.row)}>
              <ArrowForwardIcon />
            </Button>
          ) : (
            <Button onClick={() => handleRefundaccept(params.row)}>
              <CheckCircleOutlineIcon />
            </Button>
          )}
        </>
      ),
    },
    // {
    //   key: "Action",
    //   name: "Action",
    //   renderCell: (params) => (
    //     <>
    //       {params.row.Bill_Status !== "RefundPayment" ? (
    //         <Button onClick={() => handleRequestEdit(params.row)}>
    //           <ArrowForwardIcon />
    //         </Button>
    //       ) : (
    //         <Button onClick={() => handleRefundcancel(params.row)}>
    //           <CancelIcon />
    //         </Button>
    //       )}
    //     </>
    //   ),
    // },
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

    return (
      <div className="dotmatrix-container">
        <div ref={componentRef} className="dotmatrix-wrapper">
          <table className="dotmatrix-table">
            <thead>
              <tr>
                <td colSpan="8" className="dotmatrix-header">
                  <div className="dotmatrix-header-content">
                    <div className="dotmatrix-clinic-info">
                      <span>{ClinicDetials?.ClinicName || "KARUNA MEDICAL COLLEGE HOSPITAL"}</span>
                      <br />
                      <div>
                        {[ClinicDetials?.ClinicAddress, ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="8" className="dotmatrix-bill-title">
                  IP Pharmacy Billing
                </td>
              </tr>
              <tr>
                <td colSpan="8">
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
                        <td className="value">: {BillData?.RegisterId}</td>
                        <td className="label">Drug License No</td>
                        <td className="value">: KLK-PKD-09/055 | KL-PKD-09/056</td>
                      </tr>
                      <tr>
                        <td className="label">Age / Gender</td>
                        <td className="value">: {BillData.Age} / {BillData.Gender}</td>
                        <td className="label">Date</td>
                        <td className="value">: {BillData?.CreatedAt || BillData.BillingDate}</td>
                      </tr>
                      <tr>
                        <td className="label">Doctor Name</td>
                        <td className="value">: {BillData.Doctor_name || BillData.DoctorName}</td>
                        <td className="label">Patient Ph No</td>
                        <td className="value">: {BillData.PatientPhoneNo}</td>
                      </tr>
                      <tr>
                        <td className="label">Bill Status</td>
                        <td className="value">: {BillData?.Status}</td>
                        <td className="label">Patient Category</td>
                        <td className="value">: {BillData?.PatientCategory}</td>
                      </tr>
                      <tr>
                        <td className="label">Receipt No</td>
                        <td className="value">: {BillData?.Receipt?.VoucherNo || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8">
                  <div className="dotmatrix-separator" />
                  <table className="dotmatrix-inner-table">
                    <thead>
                      <tr className="item-header">
                        <th>S.No</th>
                        <th>Item</th>
                        <th>Batch</th>
                        <th>Exp</th>
                        <th>Qty</th>
                        <th style={{ textAlign: "center" }}>Rate</th>
                        <th style={{ textAlign: "center" }}>MRP</th>
                        <th style={{ textAlign: "center" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BillData?.Items?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.ItemName}</td>
                          <td>{item.BatchNo}</td>
                          <td>{item.ExpDate}</td>
                          <td>{item.Quantity}</td>
                          <td style={{ textAlign: "right" }}>{item.UnitPrice}</td>
                          <td style={{ textAlign: "right" }}>{item.Total}</td>
                          <td style={{ textAlign: "right" }}>{item.Total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="dotmatrix-separator" />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8">
                  <table className="totals-table">
                    <tbody>
                      <tr>
                        <td className="pharm-label">Amount In Words</td>
                        <td className="pharm-value">: {numberToWords(+summary.totalAmountt)}</td>
                        <td className="pharm-label-right">GST</td>
                        <td className="pharm-value-right">: {summary.GST}</td>
                      </tr>
                      <tr>
                        <td className="pharm-label">Billed By</td>
                        <td className="pharm-value">: {BillData?.Billed_By || "N/A"}</td>
                        <td className="pharm-label-right">Gross Amount</td>
                        <td className="pharm-value-right">: {summary.Amount}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="pharm-label-right">Net Amount</td>
                        <td className="pharm-value-right">: {summary.totalAmount}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="dotmatrix-separator" />
                  <div className="dotmatrix-footer-note">
                    Medicine refund is possible within 7 days of its original bill.
                  </div>
                  <div className="dotmatrix-footer-note">
                    Medicines/injections need cold storage, once sold cannot be taken back.
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="dotmatrix-buttons">
          <button onClick={handlePrint}>Print</button>
          <button onClick={handlePrintClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <>
      {printView === null ? (
        <div className="Main_container_app">
          <h3>IP Pharmacy Billing List</h3>
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
                <label>Name/PhoneNo:</label>
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
                  <option value="Refunded">Refund</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="RegisForm_1">
                <label>Pharmacy Type:</label>
                <select name="Pharma_Type" value={searchOptions.Pharma_Type} onChange={HandleOnchangeSearch}>
                  <option value="">Type</option>
                  <option value="IP PHARMACY">IP PHARMACY</option>
                  <option value="FREE PHARMACY">FREE PHARMACY</option>
                </select>
              </div>
              <Button
                className="search_div_bar_btn_1"
                onClick={handlePharmacybilling}
                title="New Pharmacy Billing"
                style={{ backgroundColor: "grey", color: "white", maxWidth: "200px" }}
              >
                <LoupeIcon />
              </Button>
            </div>
            {searchOptions.SearchStatus === "Paid" && <ReactGrid columns={UserRegisterColumns} RowData={Filterdata} />}
            {searchOptions.SearchStatus === "Refunded" && <ReactGrid columns={RefundColumns} RowData={Refunddatas} />}
          </div>
          <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
      ) : printView === "bill" ? (
        <ForPrintBill />
      ) : null}
    </>
  );
};

export default IPAmountCollectionList;