import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import LoupeIcon from "@mui/icons-material/Loupe";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";

const AdvanceRefundList = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();
  
  const [Filterdataaaaa, setFilterdataaaaa] = useState([]);
  const [RefundDetails, setRefundDetails] = useState([]);
  const [AdvanceData, setAdvanceData] = useState([]);
  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));

  const [searchOptions, setSearchOptions] = useState({
    AdvanceType: "OP",
    DateType: "All",
    CurrentDate: TodayDate,
    FromDate: "",
    ToDate: "",
    SearchbyFirstName: "",
    SearchbyPhoneNumber: "",
    SearchbyPatientId: "",
    SearchbyRegistrationId: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "Paid",
  });
  const [selectAdvance, setSelectAdvance] = useState(false);
  const [showRefundDetails, setShowRefundDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [selectedRefund, setSelectedRefund] = useState({});
  const [Load,setLoad] = useState(false);
  const [printView, setPrintView] = useState(false);
  const [printData, setPrintData] = useState({});

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
    axios.get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [clinicData.Area].filter(
            (component) => component
          );

          setClinicDetials((prev) => ({
            ...prev,
            ClinicAddress: addressComponents.join(", "),
            ClinicGST: clinicData.GSTNo || prev.ClinicGST,
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicState: clinicData.State || prev.ClinicState,
            ClinicCode: clinicData.Pincode || prev.ClinicCode,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            ClinicLandLineNo: clinicData.LandlineNo || prev.ClinicLandLineNo,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
          }));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [UrlLink]);

  useEffect(() => {
  const abortController = new AbortController();
  const { signal } = abortController;

  if (searchOptions.SearchStatus === "Refunded") {
    // Fetch refund details when status is "Refunded"
    axios.get(`${UrlLink}Frontoffice/Advance_Refund_Billing`, {
      params: { ...searchOptions },
      signal // Pass the signal to axios
    })
    .then((res) => {
      const refunds = res?.data?.refunds || [];
      setRefundDetails(Array.isArray(refunds) ? refunds : []);
      setFilterdataaaaa([]); // Clear advance data
    })
    .catch((err) => {
      // Only handle errors that aren't abort errors
      if (!axios.isCancel(err)) {
        console.log("Refund fetch error:", err);
        setRefundDetails([]);
      }
    });
  } else {
    // Fetch advance data for other statuses
    axios.get(`${UrlLink}Frontoffice/IP_Advance_Refund`, {
      params: { ...searchOptions },
      signal // Pass the signal to axios
    })
    .then((res) => {
      const ress = res?.data;
      setFilterdataaaaa(Array.isArray(ress) ? ress : []);
      setRefundDetails([]); // Clear refund data
    })
    .catch((err) => {
      // Only handle errors that aren't abort errors
      if (!axios.isCancel(err)) {
        console.log("Advance fetch error:", err);
        setFilterdataaaaa([]);
      }
    });
  }

  // Cleanup function - aborts the request when component unmounts or dependency changes
  return () => {
    abortController.abort();
  };
}, [UrlLink, searchOptions, Load]);

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;

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
          CurrentDate: TodayDate,
          FromDate: "",
          ToDate: "",
        }));
      } else if (value === "Customize") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
        }));
      } else if (value === 'All') {
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
    dispatchvalue({ type: "Registeredit", value: {} });
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "AdvanceCollection" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const PatientIPRegisterColumns = useMemo(() => {
    if (searchOptions.SearchStatus === "Refunded") {
      // Columns for Refunded status (refund details)
      return [
        { key: "RefundId", name: "Refund Receipt No" },
        { key: "RefundDate", name: "Refund Date" },
        { key: "PatientId", name: "Patient Id" },
        { key: "PatientName", name: "Patient Name" },
        { key: "PhoneNumber", name: "Phone No" },
        { key: "TotalRefundAmount", name: "Refund Amount" },
        { key: "BilledBy", name: "Billed By" },
        { key: "ReceiptNumber", name: "Original Receipt No" },
        {
          key: "Reprint",
          name: "Reprint",
          renderCell: (params) => (
            <Button
              className="cell_btn"
              onClick={() => handleReprint(params.row)}
              title="Reprint Refund Receipt"
            >
              <PrintIcon className="check_box_clrr_cancell" />
            </Button>
          ),
        }
      ];
    } else {
      // Columns for other statuses (advance details)
      const baseColumns = [
        { key: "Receipt_No", name: "Receipt No" },
        { key: "PatientId", name: "Patient Id" },
        { key: "RegistrationId", name: searchOptions.AdvanceType === 'IP' ? "IP No" : "OP No" },
        { key: "PatientName", name: "Patient Name" },
        { key: "PhoneNo", name: "Phone No" },
        { key: "Date", name: "Date / Time" },
        { key: "Amount", name: "Amount" },
        {
          key: "Refund Advance",
          name: "Refund Advance",
          renderCell: (params) => {
            if (params.row.Status === "Approved") {
              return (
                <Button
                  className="cell_btn"
                  onClick={() => {
                    if (UserData?.Edit) {
                      handleNewAdvanceCollection(params.row);
                    }
                  }}
                >
                  <ArrowForwardIcon className="check_box_clrr_cancell" />
                </Button>
              );
            }

            return (
              <Button
                className="cell_btn"
                onClick={() => {
                  if (UserData?.Edit) {
                    handleAdvanceView(params.row);
                  }
                }}
              >
                <VisibilityIcon className="check_box_clrr_cancell" />
              </Button>
            );
          },
        }
      ];

      if (searchOptions.AdvanceType === 'IP') {
        baseColumns.splice(3, 0, {
          key: "RoomDetails",
          name: "Room No"
        });
      }

      return baseColumns;
    }
  }, [searchOptions.AdvanceType, searchOptions.SearchStatus, UserData]);

  const handleAdvanceView = (row) => {
    setSelectedPatient(row)
    setSelectAdvance(true);
    if (row) {
      axios.get(`${UrlLink}Frontoffice/get_overall_advance_details?RegistrationId=${row.RegistrationId}&Type=${row.type}`)
        .then((res) => {
          const ress = res?.data?.AdvanceDetails
          setAdvanceData(Array.isArray(ress) ? ress : []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const handleNewAdvanceCollection = (row) => {
    dispatchvalue({ type: "AdvanceDetails", value: row });
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "AdvanceRefundPage" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  }

  const handleReprint = (refund) => {
    setSelectedRefund(refund);
    
    // Fetch detailed refund data for printing
    axios.get(`${UrlLink}Frontoffice/Advance_Refund_Billing?RefundId=${refund.RefundId}`)
      .then((res) => {
        const refundDetails = res?.data?.refunds?.[0];
        if (refundDetails) {
          setPrintData(refundDetails);
          setPrintView(true);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatchvalue({
          type: 'toast',
          value: { message: "Error loading refund details", type: "error" },
        });
      });
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setPrintView(false);
    },
  });

  const handleClosePrint = () => {
    setPrintView(false);
  };

  const handleAdvanceRequest = () => {
    const submitdata = {
      ...searchOptions,
      selectAdvance: selectAdvance,
      selectedPatient: selectedPatient,
      Status: 'RefundRequest',
      createdby : UserData?.username
    }

    axios
      .post(`${UrlLink}Frontoffice/IP_Advance_Refund_Request`, submitdata)
      .then((resp) => {
        const response = resp.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        setSelectAdvance(false);
        setLoad((prev) => !prev);

        dispatchvalue({
          type: 'toast',
          value: { message: messageContent, type: messageType },
        });
      })
      .catch((e) => console.log(e));
  }

  const handleAdvanceApproved = () => {
    const submitdata = {
      ...searchOptions,
      selectAdvance: selectAdvance,
      selectedPatient: selectedPatient,
      Status: 'Approved',
      createdby : UserData?.username

    }

    axios
      .post(`${UrlLink}Frontoffice/IP_Advance_Refund_Request`, submitdata)
      .then((resp) => {
        const response = resp.data;
        const messageType = Object.keys(response)[0];
        const messageContent = Object.values(response)[0];
        setSelectAdvance(false);
        setLoad((prev) => !prev);

        dispatchvalue({
          type: 'toast',
          value: { message: messageContent, type: messageType },
        });
      })
      .catch((e) => console.log(e));
  }

  // Function to get the data for the grid based on status
  const getGridData = () => {
    if (searchOptions.SearchStatus === "Refunded") {
      return RefundDetails;
    } else {
      return Filterdataaaaa;
    }
  }

  const IPForPrintData = () => {
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
                      <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span style={{ fontWeight: "bold" }}>
                        {ClinicDetails?.Cname}
                      </span>
                      <div>
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                          {[ClinicDetials.ClinicCity,
                          ClinicDetials.ClinicState,
                          ClinicDetials.ClinicCode]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div>
                        {[ClinicDetials.ClinicMobileNo,
                        ClinicDetials.ClinicLandLineNo,
                        ClinicDetials.ClinicMailID]
                          .filter((detail) => detail)
                          .join(" , ")}
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
                  Advance Refund Receipt
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_addn_p037">
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{printData.PatientName}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient ID <span>:</span>
                        </label>
                        <h4>{printData.PatientId}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Age / Gender <span>:</span>
                        </label>
                        <h4>
                          {printData.AgeGender}
                        </h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{printData.RegistrationId || 'N/A'}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Receipt NO <span>:</span>
                        </label>
                        <h4>{printData.RefundId}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{printData.PatientCategory || 'N/A'}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Mobile No <span>:</span>
                        </label>
                        <h4>{printData.PhoneNumber}</h4>
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
                      <tr
                        style={{
                          borderTop: "1.5px solid black",
                          borderBottom: "1.5px solid black",
                        }}
                      >
                        <th style={{ borderTop: "1px solid black" }}>
                          Service Type / Name
                        </th>
                        <th style={{ border: "none" }}>Original Amount</th>
                        <th style={{ border: "none" }}>Refund Amount</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        borderBottom: "1.5px solid black",
                        padding: "2px",
                      }}
                    >
                      <tr>
                        <td style={{ paddingLeft: "20px", border: "none" }}>
                          {printData.AdvancePurpose || 'Advance Refund'}
                        </td>
                        <td style={{ border: "none" }}>
                          {printData.OriginalAdvanceAmount?.toFixed(2)}
                        </td>
                        <td style={{ border: "none" }}>
                          {printData.TotalRefundAmount?.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: "1.5px solid black" }}>
                        <td style={{ fontWeight: "bold", border: "none" }}>Total</td>
                        <td style={{ fontWeight: "bold", border: "none" }}>
                          {printData.OriginalAdvanceAmount?.toFixed(2)}
                        </td>
                        <td style={{ fontWeight: "bold", border: "none" }}>
                          {printData.TotalRefundAmount?.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </td>
              </tr>

              <tr>
                <td colSpan="7">
                  <div className="new_billing_invoice_detials">
                    <div className="invoice_detials_total_1">
                      <div className="total_con_bill">
                        <div className="bill_body_new_phar">
                          <label>
                            Amount In Words <span>:</span>
                          </label>
                          <span>{NumberToWords(+printData.TotalRefundAmount)}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Billed By <span>:</span>
                          </label>
                          <span>{printData.BilledBy}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Receipt No <span>:</span>
                          </label>
                          <span>{printData.RefundId}</span>
                        </div>
                      </div>

                      <div>
                        <div className="bill_body_new_phar">
                          <label>
                            Total Advance Amount <span>:</span>
                          </label>
                          <span>{printData.OriginalAdvanceAmount?.toFixed(2)}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Refund Amount <span>:</span>
                          </label>
                          <span>{printData.TotalRefundAmount?.toFixed(2)}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Refund Date <span>:</span>
                          </label>
                          <span>{printData.RefundDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="Register_btn_con added_Register_btn_con">
          <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint}>
            Print
          </button>
          <button className="RegisterForm_1_btns jwedu6_99" onClick={handleClosePrint}>
            Close
          </button>
        </div>
      </div>
    );
  };

  const OPForPrintData = () => {
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
                      <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span style={{ fontWeight: "bold" }}>
                        {ClinicDetails?.Cname}
                      </span>
                      <div>
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                          {[ClinicDetials.ClinicCity,
                          ClinicDetials.ClinicState,
                          ClinicDetials.ClinicCode]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div>
                        {[ClinicDetials.ClinicMobileNo,
                        ClinicDetials.ClinicLandLineNo,
                        ClinicDetials.ClinicMailID]
                          .filter((detail) => detail)
                          .join(" , ")}
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
                  Advance Refund Receipt
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_addn_p037">
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{printData.PatientName}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient ID <span>:</span>
                        </label>
                        <h4>{printData.PatientId}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Age / Gender <span>:</span>
                        </label>
                        <h4>
                          {printData.Age || 'N/A'} / {printData.Gender || 'N/A'}
                        </h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          OP NO <span>:</span>
                        </label>
                        <h4>{printData.RegistrationId || 'N/A'}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Receipt NO <span>:</span>
                        </label>
                        <h4>{printData.RefundId}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{printData.PatientCategory || 'N/A'}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Mobile No <span>:</span>
                        </label>
                        <h4>{printData.PhoneNumber}</h4>
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
                      <tr
                        style={{
                          borderTop: "1.5px solid black",
                          borderBottom: "1.5px solid black",
                        }}
                      >
                        <th style={{ borderTop: "1px solid black" }}>
                          Service Type / Name
                        </th>
                        <th style={{ border: "none" }}>Original Amount</th>
                        <th style={{ border: "none" }}>Refund Amount</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        borderBottom: "1.5px solid black",
                        padding: "2px",
                      }}
                    >
                      <tr>
                        <td style={{ paddingLeft: "20px", border: "none" }}>
                          {printData.AdvancePurpose || 'Advance Refund'}
                        </td>
                        <td style={{ border: "none" }}>
                          {printData.OriginalAdvanceAmount?.toFixed(2)}
                        </td>
                        <td style={{ border: "none" }}>
                          {printData.TotalRefundAmount?.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: "1.5px solid black" }}>
                        <td style={{ fontWeight: "bold", border: "none" }}>Total</td>
                        <td style={{ fontWeight: "bold", border: "none" }}>
                          {printData.OriginalAdvanceAmount?.toFixed(2)}
                        </td>
                        <td style={{ fontWeight: "bold", border: "none" }}>
                          {printData.TotalRefundAmount?.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </td>
              </tr>

              <tr>
                <td colSpan="7">
                  <div className="new_billing_invoice_detials">
                    <div className="invoice_detials_total_1">
                      <div className="total_con_bill">
                        <div className="bill_body_new_phar">
                          <label>
                            Amount In Words <span>:</span>
                          </label>
                          <span>{NumberToWords(+printData.TotalRefundAmount)}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Billed By <span>:</span>
                          </label>
                          <span>{printData.BilledBy}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Receipt No <span>:</span>
                          </label>
                          <span>{printData.RefundId}</span>
                        </div>
                      </div>

                      <div>
                        <div className="bill_body_new_phar">
                          <label>
                            Total Advance Amount <span>:</span>
                          </label>
                          <span>{printData.OriginalAdvanceAmount?.toFixed(2)}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Refund Amount <span>:</span>
                          </label>
                          <span>{printData.TotalRefundAmount?.toFixed(2)}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Refund Date <span>:</span>
                          </label>
                          <span>{printData.RefundDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="Register_btn_con added_Register_btn_con">
          <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint}>
            Print
          </button>
          <button className="RegisterForm_1_btns jwedu6_99" onClick={handleClosePrint}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {printView ? (
        searchOptions.AdvanceType === 'IP' ? <IPForPrintData /> : <OPForPrintData />
      ) : (
        <>
           <div className="Main_container_app">
        <h3>Advance Refund {searchOptions.SearchStatus === "Refunded" ? "History" : "Request List"}</h3>

        <div className="RegisFormcon_1" style={{ marginBottom: "10px" }}>
          <div className="RegisForm_1">
            <label>
              Advance Type<span>:</span>
            </label>
            <select
              name="AdvanceType"
              value={searchOptions.AdvanceType}
              onChange={HandleOnchangeSearch}
            >
              <option value="OP">OP</option>
              <option value="IP">IP</option>
            </select>
          </div>
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
              Patient ID<span>:</span>
            </label>
            <input
              type="text"
              name="SearchbyPatientId"
              value={searchOptions.SearchbyPatientId}
              onChange={HandleOnchangeSearch}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="input">
              Registration ID<span>:</span>
            </label>
            <input
              type="text"
              name="SearchbyRegistrationId"
              value={searchOptions.SearchbyRegistrationId}
              onChange={HandleOnchangeSearch}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="input">
              Patient Name<span>:</span>
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
              Phone No<span>:</span>
            </label>
            <input
              type="text"
              name="SearchbyPhoneNumber"
              value={searchOptions.SearchbyPhoneNumber}
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
              <option value="Paid">Paid</option>
              <option value="RefundRequest">RefundRequest</option>
              <option value="Approved">Approved</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <button
            className="search_div_bar_btn_1"
            onClick={handlenewDocRegister}
            title="New Advance Billing"
          >
            <LoupeIcon />
          </button>
        </div>

        <ReactGrid columns={PatientIPRegisterColumns} RowData={getGridData()} />
      </div>
      
      {selectAdvance && (
        <div className="loader" onClick={() => setSelectAdvance(false)}>
          <div
            style={{width:'500px', height:'250px', backgroundColor:'whitesmoke'}}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{textAlign:'center', backgroundColor:'#9d9d9d', marginTop:'5px', borderRadius:'5px'}}>Advance Refund Request</div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label htmlFor="selectDepModal.SelectDepartment">
                  Patient Id <span>:</span>
                </label>
                <span>{selectedPatient?.PatientId}</span>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="selectDepModal.SelectDepartment">
                  {selectedPatient?.type === 'OP' ? "OP No" : "IP No"} <span>:</span>
                </label>
                <span>{selectedPatient?.RegistrationId}</span>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="selectDepModal.SelectDepartment">
                  Patient Name <span>:</span>
                </label>
                <span>{selectedPatient?.PatientName}</span>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="selectDepModal.SelectDepartment">
                  Advance Amount <span>:</span>
                </label>
                <span>{selectedPatient?.Amount}</span>
              </div>
            </div>
            <button style={{marginTop:'50px', cursor:'pointer', padding:'5px 5px'}} onClick={searchOptions.SearchStatus  === 'Paid'? handleAdvanceRequest : handleAdvanceApproved}>
              { searchOptions.SearchStatus  === 'Paid'? 'Refund Request' : 'Approved'} 
            </button>
          </div>
        </div>
      )}

      {showRefundDetails && (
        <div className="loader" onClick={() => setShowRefundDetails(false)}>
          <div
            style={{width:'600px', height:'300px', backgroundColor:'whitesmoke', padding: '20px'}}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{textAlign:'center', backgroundColor:'#9d9d9d', marginBottom:'15px', borderRadius:'5px', padding: '5px'}}>
              Refund Details - Receipt No: {selectedRefund.RefundId}
            </div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>Patient Name:</label>
                <span>{selectedRefund.PatientName}</span>
              </div>
              <div className="RegisForm_1">
                <label>Refund Date:</label>
                <span>{selectedRefund.RefundDate}</span>
              </div>
              <div className="RegisForm_1">
                <label>Refund Amount:</label>
                <span>{selectedRefund.TotalRefundAmount}</span>
              </div>
              <div className="RegisForm_1">
                <label>Billed By:</label>
                <span>{selectedRefund.BilledBy}</span>
              </div>
            </div>
            <div style={{marginTop: '20px', textAlign: 'center'}}>
              <button 
                style={{cursor:'pointer', padding:'8px 15px', marginRight: '10px'}}
                onClick={() => {
                  // Implement reprint functionality here
                  console.log("Reprint receipt:", selectedRefund.RefundId);
                }}
              >
                Reprint Receipt
              </button>
              <button 
                style={{cursor:'pointer', padding:'8px 15px'}}
                onClick={() => setShowRefundDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      <ToastAlert Message={toast.message} Type={toast.type} />
      <ModelContainer />
    </>
  );
};

export default AdvanceRefundList;