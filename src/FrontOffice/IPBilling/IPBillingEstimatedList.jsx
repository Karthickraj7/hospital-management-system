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

const IPBillingEstimatedList = () => {
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
    DateType: "Current",
    CurrentDate: TodayDate,
    FromDate: "",
    ToDate: "",
    // Paymentmode:'',
    SearchbyFirstName: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "Pending",
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
  // Create AbortController
  const controller = new AbortController();

  const apiUrl =
    searchOptions.SearchStatus === "Estimated" || searchOptions.SearchStatus === "Approved"
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

  // Cleanup cancels the request if still pending
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
        return params.row.Status === "Pending" ? (
          <Button
            className="cell_btn"
            onClick={() => HandleMovedatatobill(params.row)}
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        ) : params.row.Status === "Estimated" ? (
            <Button
              className="cell_btn"
              onClick={() => HandlePrintBill(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>
        ) : (
          "No Action"
        );
      },
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
    dispatchvalue({ type: "HrFolder", value: "IPEstimatedEditBilling" });
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

  const ForPrintReceipt = () => { };

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

  const ForPrintData = () => {
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
      dispatchvalue({ type: "HrFolder", value: "IPBillingList" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });

  const handlePrintClose = () => {
    setPrintView(null);
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "IPBillingList" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const HandleMovedatatobill = (params) => {
    console.log("IPBillingData", params);

    const updatedParams = { ...params, billpage: 'Finalbill' };

    dispatchvalue({ type: "IPBillingData", value: updatedParams });
    dispatchvalue({ type: "OPBillingData", value: {} });

    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "IPBillingEstimated" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  return (
    <>
      {printView === null ? (
        <div className="Main_container_app">
          <h3>IP Estimated Billing Queue List</h3>
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
                <option value="Pending">Pending</option>
                <option value="Estimated">Estimated</option>
                <option value="Approved">Approved</option>
              </select>
            </div>

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
      ) : null}
    </>
  );
};

export default IPBillingEstimatedList;
