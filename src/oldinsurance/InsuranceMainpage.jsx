import React, { useState, useEffect, useRef } from 'react';
// import './Navigation.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import './Insurance.css';
import Tooltip from '@mui/material/Tooltip';
import { addDays, format } from 'date-fns';
import BasicTabs from './InsuranseTabs';
import axios from 'axios';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from "react-to-print";
import { NumberToWords } from "../OtherComponent/OtherFunctions";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

import bgImg2 from '../Assets/bgImg2.jpg';

function InsuranceMainpage() {
  const dispatchvalue = useDispatch();
  const componentRef = useRef();

  const navigate = useNavigate();
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);

  const cu_date = format(new Date(), 'yyyy-MM-dd');
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);

  const InsurancePatientDetailes = useSelector(
    (state) => state.Insurancedata?.InsurancePatientDetailes
  );


  const [emailForm, setEmailForm] = useState({
    recipient: '',
    subject: '',
    body: '',
    attachment: null,
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailResponse, setEmailResponse] = useState(null);
  const [showResponse, setShowResponse] = useState(false);

  const [expanded, setExpanded] = useState('MainPage1');

  const [nestedExpanded, setNestedExpanded] = useState('PatientInfo');

  const [open, setOpen] = React.useState(false);
  const [ViewStatus, setViewStatus] = useState('');

  const [billoption, setbilloption] = useState("PrintDetailed");

  console.log(billoption, 'billoption');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleNestedChange = (panel) => (event, isExpanded) => {
    setNestedExpanded(isExpanded ? panel : false);
  };

  const [openModal2, setOpenModal2] = useState(false);

  const openModal = () => {
    setOpenModal2(true);
  };

  const handleCloseModal1 = () => {
    setOpenModal2(false);

  };

  const [AdvanceAmountGet, setAdvanceAmountGet] = useState([]);
  const [AdvanceTotal, setAdvanceTotal] = useState([]);
  const [RemainingCredit, setRemainingCredit] = useState([]);

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


  const [InsuranceMaindata, setInsuranceMaindata] = useState({
    ScreenStatus: '',
    Papersstatus: 'DRAFT',
    Papersstatustype: 'ORIGINAL',
    PatientPhoto: '',
    PatientName: '',
    MRN: '',
    ALNumber: '',
    CINumber: '',
    InwardNumber: '',
    Requested: '',
    Approved: '',
    PageCompleted: 'PatientInfo',
    PatientResponsibility: '',
    PatientPayable: '',
    SentToClaim: '',
    PatientDiscount: '',
    PreAuthApproved: '',
    TPAApproved: '',
    SettledAmount: '',
  });

  const [SelectDatalist, setSelectDatalist] = useState([]);

  const [EnhanceAmount, setEnhanceAmount] = useState('');

  const [Billingitems, setBillingitems] = useState([]);

  console.log(Billingitems, 'Billingitems');

  // -------------

  const [DischargerState, setDischargerState] = useState({
    RequestedAmount: '',
    BillNumber: '',
  });

  const [ClimeRequest, setClimeRequest] = useState({
    BillNumber: '',
    PatientResponsibility: '',
    PatientDiscount: '',
    PatientPayable: '',
  });

  const [AllAmountdata, setAllAmountdata] = useState([]);
  const [PatientDetails, setPatientDetails] = useState([]);

  const handleEmailFormChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (
      InsurancePatientDetailes?.RegistrationId &&
      InsurancePatientDetailes?.PatientId &&
      InsurancePatientDetailes?.PatientServiesType
    ) {
      axios
        .get(
          `${UrlLink}Insurance/Insurance_Patient_Details?RegistrationId=${InsurancePatientDetailes.RegistrationId}&PatientId=${InsurancePatientDetailes.PatientId}&PatientServiesType=${InsurancePatientDetailes.PatientServiesType}`
        )
        .then((res) => {
          if (Array.isArray(res?.data)) {
            setPatientDetails(res.data); // Set data only if it is an array
          } else {
            console.log(
              'Unexpected response format: Expected an array',
              res.data
            );
          }
        })
        .catch((err) => {
          console.error('Error fetching patient details:', err);
        });
    }
  }, [InsurancePatientDetailes, UrlLink]);

  useEffect(() => {
    if (
      InsurancePatientDetailes &&
      Object.values(InsurancePatientDetailes).length !== 0
    ) {
      setInsuranceMaindata((prev) => ({
        ...prev,
        PatientName: InsurancePatientDetailes?.PatientName,
        MRN: InsurancePatientDetailes?.RegistrationId,
      }));
    }
  }, [InsurancePatientDetailes]);


  const HandlePrintReimbursable = (params) => {

    console.log(params, "HandlePrintSummary");

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


    const reimbursableItems = params?.Billing_Items.filter((item) => item.IsReimbursable === "Yes");
    const nonReimbursableItems = params?.Billing_Items.filter((item) => item.IsReimbursable !== "Yes");


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
        { totalUnits: 0, totalAmount: 0, totalDiscount: 0, totalGstamount: 0, totalNetAmount: 0 }
      );
    };

    reimbursableTotals = calculateTotals(reimbursableItems);
    nonReimbursableTotals = calculateTotals(nonReimbursableItems);


    updatedTotals = {
      totalUnits: reimbursableTotals.totalUnits + nonReimbursableTotals.totalUnits,
      totalAmount: reimbursableTotals.totalAmount + nonReimbursableTotals.totalAmount,
      totalDiscount: reimbursableTotals.totalDiscount + nonReimbursableTotals.totalDiscount,
      totalGstamount: reimbursableTotals.totalGstamount + nonReimbursableTotals.totalGstamount,
      totalNetAmount: reimbursableTotals.totalNetAmount + nonReimbursableTotals.totalNetAmount,
    };


    let additionalDiscount = 0;


    let finalDiscount = Math.min(
      updatedTotals.totalNetAmount,
      updatedTotals.totalDiscount + additionalDiscount
    );


    let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;


    let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;


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
  };

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Frontoffice/IP_Billing_Items_Table_For_Insurance_Patient?Register_Id=${InsurancePatientDetailes?.RegistrationId}&PatientServiesType=IP`
      )
      .then((res) => {
        const ress = res.data;
        console.log(ress[0].Billing_Items, 'Billingitems');

        setSelectedPatient_list({
          PatientId: ress[0]?.PatientId,
          PatientName: ress[0]?.Patient_Name,
          PhoneNumber: ress[0]?.PhoneNo,
          PatientCategory: ress[0]?.PatientCategory,
          PatientCategoryType: ress[0]?.PatientCategoryName,
          InsuranceName: ress[0]?.PatientCategoryName,
          Gender: "",
          City: ress[0]?.City,
          State: ress[0]?.State,
          PatientAddress: ress[0]?.Address,
          Pincode: ress[0]?.Pincode,
          VisitId: "",
          WardBedNo: ress[0]?.ward,
          DischargeDate: "",
          AgeGender: ress[0]?.AgeGender,
          AdmissionDate: ress[0]?.AdmissionDate
            ? new Date(ress[0]?.AdmissionDate).toLocaleDateString()
            : "",
          Date: ress[0]?.Billing_Date,
          RegisterId: ress[0]?.Register_Id,
        });

        setPostInvoice(ress[0].id);
        setPostInvoiceDate(ress[0]?.Billing_Date);
        setSelectDatalist(ress[0].Billing_Items);
        setBillAmount(ress[0].Payment_Details);
        HandlePrintReimbursable(ress[0].Billing_Items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [InsurancePatientDetailes?.RegistrationId]);


  useEffect(() => {
    axios
      .get(
        `${UrlLink}Frontoffice/IP_AdvanceAmount_collection?RegistrationId=${InsurancePatientDetailes?.RegistrationId}&Type=${'IP'}`
      )
      .then((ress) => {
        const res = ress?.data;
        console.log("advvvvv", res);
        setAdvanceAmountGet(res?.AdvanceDetails);
        setAdvanceTotal(res?.TotalAdvanceAmount);
        setRemainingCredit(res?.RemainingCredit)
      })
      .catch((e) => console.log(e));
  }, [InsurancePatientDetailes?.RegistrationId, UrlLink]);
  // -----------------------------------------------------------------------

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!emailForm.recipient || !emailForm.subject || !emailForm.body) {
      dispatchvalue({
        type: 'toast',
        value: { message: 'Please fill all email fields', type: 'warn' },
      });
      return;
    }

    setEmailLoading(true);
    try {
      const response = await axios.post(`${UrlLink}api/send-email`, {
        to: emailForm.recipient,
        subject: emailForm.subject,
        text: emailForm.body,
      });

      // Store the response and show it
      setEmailResponse(response.data);
      setShowResponse(true);

      dispatchvalue({
        type: 'toast',
        value: { message: response.data.message || 'Email sent successfully', type: 'success' },
      });
      setEmailForm({ recipient: '', subject: '', body: '', attachment: null });
    } catch (error) {
      dispatchvalue({
        type: 'toast',
        value: { message: error.response?.data?.message || 'Failed to send email', type: 'error' },
      });
      setEmailResponse({ error: error.response?.data?.message || 'Error sending email' });
      setShowResponse(true);
    } finally {
      setEmailLoading(false);
    }
  };


  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.post(`${UrlLink}api/update-insurance-status`, {
        registrationId: InsurancePatientDetailes?.RegistrationId,
        status: newStatus,
        updatedBy: UserData?.username,
      });

      // Update local state
      setInsuranceMaindata((prev) => ({
        ...prev,
        ScreenStatus: newStatus,
      }));

      dispatchvalue({
        type: 'toast',
        value: { message: `Status updated to ${newStatus}`, type: 'success' },
      });
    } catch (error) {
      dispatchvalue({
        type: 'toast',
        value: { message: 'Failed to update status', type: 'error' },
      });
    }
  };
  // -----------------------------------------------------------------------------------

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
          <table
            className="print-table33"

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
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address">
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
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
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
                              <td colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}>
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
                        <label>
                          Payment mode <span>:</span>
                        </label>
                        <span>
                          {billAmount.map((row, index) => (
                            <React.Fragment key={index}>
                              <span>{row.Payment_Type}</span>
                              {index < billAmount.length - 1 && <span>, </span>}
                            </React.Fragment>
                          ))}
                        </span>
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
                        <span>{UserData?.username}</span>
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
              </div>
            </div>

            <br />
            <td
              colSpan="7"
              style={{
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
                  position: "relative",
                  right: "120%",
                  top: "150px",
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
                      <div className="billaddress"

                      >
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
                  <div className="new_billing_address">
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
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice No<span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                <label>
                                  Receipt No<span>:</span>
                                </label>
                                <h4>{RecieptInvoice}</h4>
                              </div> */}
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice Date<span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
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
                        <label>
                          Payment mode <span>:</span>
                        </label>
                        <span>
                          <span>
                            {billAmount.map((row, index) => (
                              <React.Fragment key={index}>
                                <span>{row.Payment_Type}</span>
                                {index < billAmount.length - 1 && <span>, </span>}
                              </React.Fragment>
                            ))}
                          </span>
                        </span>
                      </div>
                      {SelectedPatient_list.PatientCategory === "General" &&
                        Array.isArray(AdvanceAmountGet) && AdvanceAmountGet.map((row, ind) => (
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
                        <span>{UserData?.username}</span>
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
                  position: "relative",
                  right: "50%",
                  top: "50px",
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
                      <div
                        className="billaddress"
                      >
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
                  <div className="new_billing_address">
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
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
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
                              <td colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}>
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
                      {SelectedPatient_list.PatientCategory === "General" && <div className="bill_body_new_phar">
                        <label>
                          Payment mode <span>:</span>
                        </label>
                        <span>
                          {billAmount.map((row, index) => (
                            <React.Fragment key={index}>
                              <span>{row.Payment_Type}</span>
                              {index < billAmount.length - 1 && <span>, </span>}
                            </React.Fragment>
                          ))}
                        </span>
                      </div>}
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
                        <span>{UserData?.username}</span>
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
                  position: "relative",
                  right: "50%",
                  top: "50px",
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
                      <div
                        className="billaddress"
                      >
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
                  <div className="new_billing_address">
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
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice Date <span>:</span>
                        </label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
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
                              <td colSpan="3"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "right",
                                  border: "none",
                                }}>
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
                        <label>
                          Payment mode <span>:</span>
                        </label>
                        <span>
                          {billAmount.map((row, index) => (
                            <React.Fragment key={index}>
                              <span>{row.Payment_Type}</span>
                              {index < billAmount.length - 1 && <span>, </span>}
                            </React.Fragment>
                          ))}
                        </span>
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
                        <span>{UserData?.username}</span>
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
                  position: "relative",
                  right: "50%",
                  top: "50px",
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
      </div>
    );
  };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: async () => {
      navigate("/Home/Insurance");
      dispatchvalue({ type: "HrFolder", value: "InsuranceMainpage" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });

  const handlePrintClose = () => {
    setOpenModal2(false)
  }

  const handlebilloptionchange = (e) => {

    const value = e.target.value;

    console.log(value, 'valuevaluevalue')

    if (value === "PrintReimbursable") {

      const reimbursableItems = SelectDatalist.filter((item) => item.IsReimbursable === "Yes");

      if (reimbursableItems.length === 0) {
        const tdata = {
          message: "No Print available For Reimbursable Items",
          type: "Warn",
        };

        dispatchvalue({ type: "toast", value: tdata });
        return;
      }

      else {

        setbilloption(value);

      }

    }

    else if (value === "PrintNon-Reimbursable") {

      const nonReimbursableItems = SelectDatalist.filter((item) => item.IsReimbursable !== "Yes");


      if (nonReimbursableItems.length === 0) {

        console.log('nonReimbursableItems');
        const tdata = {
          message: "No Print available For Non-Reimbursable Items",
          type: "warn",
        };

        dispatchvalue({ type: "toast", value: tdata });
        setbilloption("");
        return;
      }
      else {

        setbilloption(value);
      }
    }
    else {
      setbilloption(value);
    }

  }

  return (
    <>
      <div className="new-patient-registration-form_info">
        {/* Left Container: Patient Data */}
        <div className="mugesh_Data_Continer_Ins">
          <div
            className="dctr_info_up_head"
            style={{
              backgroundColor: 'var(--selectbackgroundcolor)',
              padding: '15px 10px',
              borderRadius: '5px',
            }}
          >
            <div className="RegisFormcon">
              <div className="dctr_info_up_head22">
                {InsuranceMaindata.PatientPhoto ? (
                  <img src={InsuranceMaindata.PatientPhoto} alt="Patient Photo" />
                ) : (
                  <img src={bgImg2} alt="Default Patient Photo" />
                )}
                <label>
                  {InsuranceMaindata?.Papersstatus}
                  <br />
                  {InsuranceMaindata?.ScreenStatus === 'Claim'
                    ? ''
                    : InsuranceMaindata?.Papersstatustype}
                </label>
              </div>
            </div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label htmlFor="PatientID">
                  Patient<span>:</span>
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientID">
                  {InsurancePatientDetailes?.PatientId}
                </span>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="PatientName">
                  Patient Name <span>:</span>{' '}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {InsurancePatientDetailes?.PatientName}
                </span>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="AgeGender">
                  Age / Gender<span>:</span>
                </label>
                <span className="dctr_wrbvh_pice" id="AgeGender">
                  {Array.isArray(PatientDetails) && PatientDetails.length > 0
                    ? `${PatientDetails[0]?.Age || ''} / ${PatientDetails[0]?.Gender || ''}`
                    : ''}
                </span>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="PhoneNo">
                  Phone Number<span>:</span>
                </label>
                <span className="dctr_wrbvh_pice" id="PhoneNo">
                  {Array.isArray(PatientDetails) && PatientDetails.length > 0
                    ? `${PatientDetails[0]?.PhoneNo || ''}`
                    : ''}
                </span>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="DoctorName">
                  Doctor Name<span>:</span>
                </label>
                <span className="dctr_wrbvh_pice" id="DoctorName">
                  {Array.isArray(PatientDetails) && PatientDetails.length > 0
                    ? `${PatientDetails[0]?.DoctorName || ''}`
                    : ''}
                </span>
              </div>

              {(InsurancePatientDetailes?.PatientServiesType === 'IP' ||
                InsurancePatientDetailes?.PatientServiesType === 'Casuality') && (
                  <>
                    <div className="RegisForm_1">
                      <label htmlFor="PurposeofAdmission">
                        Purpose of Admission<span>:</span>
                      </label>
                      <span className="dctr_wrbvh_pice" id="PurposeofAdmission">
                        {Array.isArray(PatientDetails) && PatientDetails.length > 0
                          ? `${PatientDetails[0]?.PurposeofAdmission || ''}`
                          : ''}
                      </span>
                    </div>
                    <div className="RegisForm_1">
                      <label htmlFor="DateofAdmission">
                        Date of Admission<span>:</span>
                      </label>
                      <span className="dctr_wrbvh_pice" id="DateofAdmission">
                        {Array.isArray(PatientDetails) && PatientDetails.length > 0
                          ? `${PatientDetails[0]?.DateofAdmission || ''}`
                          : ''}
                      </span>
                    </div>
                    <div className="RegisForm_1">
                      <label htmlFor="isMlc">
                        IsMLC<span>:</span>
                      </label>
                      <span className="dctr_wrbvh_pice" id="isMlc">
                        {Array.isArray(PatientDetails) && PatientDetails.length > 0
                          ? `${PatientDetails[0]?.isMlc || ''}`
                          : ''}
                      </span>
                    </div>
                  </>
                )}
              {InsurancePatientDetailes?.PatientServiesType === 'OP' && (
                <>
                  <div className="RegisForm_1">
                    <label htmlFor="VisitId">
                      Visit ID<span>:</span>
                    </label>
                    <span className="dctr_wrbvh_pice" id="VisitId">
                      {Array.isArray(PatientDetails) && PatientDetails.length > 0
                        ? `${PatientDetails[0]?.VisitId || ''}`
                        : ''}
                    </span>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="VisitPurpose">
                      Visit Purpose<span>:</span>
                    </label>
                    <span className="dctr_wrbvh_pice" id="VisitPurpose">
                      {Array.isArray(PatientDetails) && PatientDetails.length > 0
                        ? `${PatientDetails[0]?.VisitPurpose || ''}`
                        : ''}
                    </span>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="Date">
                      Date<span>:</span>
                    </label>
                    <span className="dctr_wrbvh_pice" id="Date">
                      {Array.isArray(PatientDetails) && PatientDetails.length > 0
                        ? `${PatientDetails[0]?.Date || ''}`
                        : ''}
                    </span>
                  </div>
                </>
              )}
              <div className="RegisForm_1">
                <label htmlFor="Age">
                  Registration ID <span>:</span>{' '}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="Age">
                  {InsurancePatientDetailes?.RegistrationId}
                </span>
              </div>

              <div className="RegisForm_1">
                <select
                  style={{ backgroundColor: 'white' }}
                  value={billoption}
                  onChange={handlebilloptionchange}
                >
                  <option value="Printsummary">Print summary</option>
                  <option value="PrintDetailed">Print Detailed</option>
                  <option value="PrintReimbursable">PrintReimbursable</option>
                  <option value="PrintNon-Reimbursable">PrintNon-Reimbursable</option>
                </select>
              </div>

              <div className="RegisForm_1">
                <button
                  style={{
                    width: '60px',
                    height: '60px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                  onClick={() => openModal()}
                >
                  <PrintIcon style={{ fontSize: '32px', color: '#333' }} />
                </button>
              </div>
            </div>

            {openModal2 && (
              <div className="loader" onClick={handleCloseModal1}>
                <div className="cardModel" onClick={(e) => e.stopPropagation()}>
                  <>
                    {billoption === 'Printsummary' && (
                      <ForPrintSumData onClose={() => setbilloption(null)} />
                    )}
                    {billoption === 'PrintDetailed' && (
                      <ForPrintData onClose={() => setbilloption(null)} />
                    )}
                    {billoption === 'PrintReimbursable' && (
                      <ForPrintReimbData onClose={() => setbilloption(null)} />
                    )}
                    {billoption === 'PrintNon-Reimbursable' && (
                      <ForPrintNon_ReimbData onClose={() => setbilloption(null)} />
                    )}
                  </>
                </div>
              </div>
            )}

            {InsuranceMaindata.ScreenStatus === 'Claim' ? (
              <div>
                <h3
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  Amount
                </h3>
                <br />
                <div className="RegisFormcon">
                  <div className="RegisForm_1">
                    <label htmlFor="FirstName">
                      <h3> Preauth Approved</h3> <span>:</span>{' '}
                    </label>
                    <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                      {InsuranceMaindata.PreAuthApproved}{' '}
                    </span>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="FirstName">
                      <h3>TPA Approved</h3> <span>:</span>{' '}
                    </label>
                    <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                      {InsuranceMaindata.TPAApproved}{' '}
                    </span>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="FirstName">
                      <h3>Settled Amount</h3> <span>:</span>{' '}
                    </label>
                    <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                      {InsuranceMaindata.SettledAmount}{' '}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  Amount
                  <Tooltip title="Show History">
                    <span
                      style={{
                        backgroundColor: 'var(--ProjectColor)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '2px 5px',
                        marginLeft: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      <HistoryIcon />
                    </span>
                  </Tooltip>
                </h3>
                <br />
                <div className="RegisFormcon">
                  <div className="RegisForm_1">
                    <label htmlFor="FirstName">
                      <h3> Requested</h3> <span>:</span>{' '}
                    </label>
                    <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                      {InsuranceMaindata.Requested}{' '}
                    </span>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="FirstName">
                      <h3>Approved</h3> <span>:</span>{' '}
                    </label>
                    <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                      {InsuranceMaindata.Approved}{' '}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ToastAlert Message={toast.message} Type={toast.type} />
          <br />
          <BasicTabs />
        </div>

        {/* Right Container: Mail Container */}
        <div className="Mugesh_mail_Continer">
          <h3>Mail Section</h3>
          <form className="mail-form" onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label htmlFor="recipient">Recipient Email:</label>
              <input
                type="email"
                id="recipient"
                name="recipient"
                value={emailForm.recipient}
                onChange={handleEmailFormChange}
                placeholder="Enter recipient email"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={emailForm.subject}
                onChange={handleEmailFormChange}
                placeholder="Enter email subject"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label htmlFor="body">Message:</label>
              <textarea
                id="body"
                name="body"
                value={emailForm.body}
                onChange={handleEmailFormChange}
                placeholder="Enter your message"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={emailLoading}
              style={{
                padding: '10px',
                backgroundColor: emailLoading ? '#ccc' : 'var(--ProjectColor)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: emailLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {emailLoading ? 'Sending...' : 'Send Mail'}
            </button>
          </form>

          {/* Display Email Response */}
          {showResponse && emailResponse && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <h4>Email Response</h4>
              <p>
                <strong>Status:</strong> {emailResponse.message || emailResponse.error || 'N/A'}
              </p>
              {emailResponse.something && (
                <p>
                  <strong>Details:</strong> {JSON.stringify(emailResponse.something)}
                </p>
              )}
              <button
                onClick={() => setShowResponse(false)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: 'var(--ProjectColor)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          )}
          {/* Status Change Controls */}
          {showResponse && (
            <div style={{ marginTop: '20px' }}>
              <h4>Update Insurance Status</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleStatusChange('Approved')}
                  style={{
                    padding: '10px',
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange('Rejected')}
                  style={{
                    padding: '10px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default InsuranceMainpage;

 
