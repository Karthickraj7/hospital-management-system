import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import LoupeIcon from "@mui/icons-material/Loupe";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrintIcon from "@mui/icons-material/Print";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";

import { useReactToPrint } from "react-to-print";

const AdvanceReprintList = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();

  const [FilterData, setFilterData] = useState([]);
  const [AdvanceData, setAdvanceData] = useState([]);
  const [PrintView, setPrintView] = useState(false);
  const [PrintData, setPrintData] = useState(null);

  console.log(PrintData,'PrintDataaaaa')
  const [SelectAdvance, setSelectAdvance] = useState(false);
  const [SelectedPatient, setSelectedPatient] = useState({});

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [ClinicDetailsState, setClinicDetailsState] = useState({
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

  const [SearchOptions, setSearchOptions] = useState({
    AdvanceType: "OP",
    DateType: "All",
    CurrentDate: formatDate(new Date()),
    FromDate: "",
    ToDate: "",
    SearchbyFirstName: "",
    SearchbyPhoneNumber: "",
    SearchbyPatientId: "",
    SearchbyRegistrationId: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "",
  });

  

  // Fetch Clinic Details
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [clinicData.Area].filter(Boolean).join(", ");
          setClinicDetailsState({
            ClinicAddress: addressComponents,
            ClinicGST: clinicData.GSTNo || "",
            ClinicCity: clinicData.City || "",
            ClinicState: clinicData.State || "",
            ClinicCode: clinicData.Pincode || "",
            ClinicMobileNo: clinicData.PhoneNo || "",
            ClinicLandLineNo: clinicData.LandlineNo || "",
            ClinicMailID: clinicData.Mail || "",
            ClinicName: clinicData.ClinicName || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching clinic details:", error);
        dispatch({
          type: "toast",
          value: { message: "Failed to fetch clinic details", type: "error" },
        });
      });
  }, [UrlLink, dispatch]);

  // Fetch Patient Details
   useEffect(() => {
  // Create a cancel token source
  const source = axios.CancelToken.source();
    const cancelTokenRef = { current: source };
 
  // Debounce timer reference
  const delayDebounce = setTimeout(() => {
    axios
      .get(`${UrlLink}Frontoffice/get_overall_patient_details_for_discharged`, {
        params: SearchOptions,
        cancelToken: cancelTokenRef.current.token, // Attach cancel token to request
      })
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : [];
        setFilterData(data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error("Error fetching patient details:", err);
          setFilterData([]);
          dispatch({
            type: "toast",
            value: { message: "Failed to fetch patient data", type: "error" },
          });
        }
      });
  }, 500);
  return () => {
    clearTimeout(delayDebounce);
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Operation canceled during cleanup.");
    }
  };
}, [UrlLink, SearchOptions, dispatch]);
 

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;

    if (name === "SearchbyPhoneNumber") {
      if (value.length <= 10) {
        setSearchOptions((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "DateType") {
      setSearchOptions((prev) => ({
        ...prev,
        DateType: value,
        CurrentDate: value === "Current" ? formatDate(new Date()) : "",
        FromDate: value !== "Customize" ? "" : prev.FromDate,
        ToDate: value !== "Customize" ? "" : prev.ToDate,
      }));
    } else {
      setSearchOptions((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNewDocRegister = () => {
    dispatch({ type: "Registeredit", value: {} });
    navigate("/Home/CashierFolder");
    dispatch({ type: "HrFolder", value: "AdvanceCollection" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });
  };

  const PatientIPRegisterColumns = useMemo(() => {
    const baseColumns = [
      { key: "id", name: "S.No" },
      { key: "PatientId", name: "Patient Id" },
      {
        key: "RegistrationId",
        name: SearchOptions.AdvanceType === "IP" ? "IP No" : "OP No",
      },
      { key: "PatientName", name: "Patient Name" },
      { key: "PhoneNo", name: "Phone No" },
      { key: "isRefferal", name: "isRefferal" },
      { key: "Specilization", name: "Specialization" },
      { key: "DoctorName", name: "Doctor Name" },
      {
        key: "Action",
        name: "Action",
        renderCell: (params) => (
          <Button
            className="cell_btn"
            onClick={() => UserData?.Edit && handleAdvanceView(params.row)}
          >
            <VisibilityIcon className="check_box_clrr_cancell" />
          </Button>
        ),
      },
      {
        key: "NewAdvance",
        name: "New Advance",
        renderCell: (params) => (
          <Button
            className="cell_btn"
            onClick={() => UserData?.Edit && handleNewAdvanceCollection(params.row)}
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        ),
      },
    ];

    if (SearchOptions.AdvanceType === "IP") {
      baseColumns.splice(3, 0, { key: "RoomDetails", name: "Room No" });
    }

    return baseColumns;
  }, [SearchOptions.AdvanceType, UserData]);

  const AdvanceColumns = [
    { key: "id", name: "S.No" },
    { key: "PatientId", name: "Patient Id" },
    { key: "PatientName", name: "Patient Name" },
    { key: "RegistrationId", name: "Registration Id" },
    { key: "PhoneNo", name: "PhoneNo" },
    { key: "AdvanceAmount", name: "Advance Amount" },
    { key: "Date", name: "Date" },
    { key: "Time", name: "Time" },
    { key: "ReceivedBy", name: "Received By" },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => UserData?.Edit && handlePrintView(params.row)}
        >
          <PrintIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const handleAdvanceView = (row) => {
    setSelectedPatient(row);
    setSelectAdvance(true);
    if (row?.RegistrationId && row?.type) {
      axios
        .get(
          `${UrlLink}Frontoffice/get_overall_advance_details?RegistrationId=${row.RegistrationId}&Type=${row.type}`
        )
        .then((res) => {
          const data = Array.isArray(res?.data?.AdvanceDetails)
            ? res.data.AdvanceDetails
            : [];
          setAdvanceData(data);
        })
        .catch((err) => {
          console.error("Error fetching advance details:", err);
          setAdvanceData([]);
          dispatch({
            type: "toast",
            value: { message: "Failed to fetch advance details", type: "error" },
          });
        });
    }
  };

  const handlePrintView = (row) => {

    console.log('rowwwwwwwww',row)
    if (!row?.PaymentDetails || !row?.TotalAmount) {
      dispatch({
        type: "toast",
        value: { message: "Invalid data for printing", type: "error" },
      });
      return;
    }

    const selectedPatient = {
      PatientName: row.PatientName || "N/A",
      PatientId: row.PatientId || "N/A",
      IPno: row.RegistrationId || "N/A",
      AgeGender: row.AgeGender || "N/A", // Replace with actual data if available
      WardName: row.RoomDetails || "N/A",
      PatientCategory: row.AdvancePurpose || "General",
      PhoneNumber: row.PhoneNo || "N/A",
      AdmissionDate: row.Date || "N/A",
      Billedby : row.ReceivedBy || "",
      Receiptno : row.Receiptno || "",
      AdvanceTime : row.AdvanceTime || ""

    };

    const selectDataList = row.PaymentDetails.map((payment, index) => ({
      ServiceType: "Advance",
      AdvancePurpose: row.AdvancePurpose || "N/A",
      Amount: payment.Amount || 0,
      Billpay_method: payment.PaymentType || "N/A",
      CardType: payment.CardType || "N/A", // Fixed typo
      ChequeNo: payment.ChequeNo || "N/A",
      BankName: payment.BankName || "N/A",
      transactionFee: payment.transactionFee || "0",
    }));

    setPrintData({
      SelectedPatient_list: selectedPatient,
      SelectDatalist: selectDataList,
      totalAmount: row.TotalAmount,
    });
    setPrintView(true);
  };

  const handleNewAdvanceCollection = (row) => {
    dispatch({ type: "Registeredit", value: row });
    navigate("/Home/CashierFolder");
    dispatch({ type: "HrFolder", value: "AdvanceCollectionQueue" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });
  };

   const handlePrint2 = useReactToPrint({
      content: () => componentRef.current,
  
      onAfterPrint: async () => {
        navigate("/Home/AdvanceCollectionList");
      },
    });
  
    const handleClose = () => {
      setPrintView(false);
      navigate("/Home/CashierFolder");
      dispatch({ type: "HrFolder", value: "AdvanceCollectionList" });
      dispatch({ type: "setPreviousFolder", value: null });
      dispatch({ type: "showMenu", value: true });
    }

  const ForPrintData = () => {
    if (!PrintData) return null;

    const { SelectedPatient_list, SelectDatalist, totalAmount } = PrintData;

    console.log(SelectedPatient_list,'SelectedPatient_list');
    console.log(SelectDatalist,'SelectDatalist');

    const hasCard = SelectDatalist.some((p) => p.Billpay_method === "Card");
    const hasCheque = SelectDatalist.some((p) => p.Billpay_method === "Cheque");
    const hasBank = SelectDatalist.some((p) => p.Billpay_method === "Bank");

    

    return (
      <div ref={componentRef} className="print-container">
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} id="reactprintcontent">
          <table className="print-table33">
            <thead className="print_header" style={{ width: "100%", borderCollapse: "collapse", height: "150px" }}>
              <tr>
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetailsState?.ClinicLogo || ClinicDetails?.Clogo} alt="Clinic Logo" />
                    </div>
                    <div className="new_billing_address_1">
                      <span style={{ fontWeight: "bold" }}>{ClinicDetailsState?.ClinicName || ClinicDetails?.Cname}</span>
                      <div>
                        <span>
                          {[
                            ClinicDetailsState.ClinicAddress,
                            ClinicDetailsState.ClinicCity,
                            ClinicDetailsState.ClinicState,
                            ClinicDetailsState.ClinicCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                      <div>
                        {[
                          ClinicDetailsState.ClinicMobileNo,
                          ClinicDetailsState.ClinicLandLineNo,
                          ClinicDetailsState.ClinicMailID,
                        ]
                          .filter(Boolean)
                          .join(" , ")}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="7" style={{ textAlign: "center", fontWeight: "600", color: "black", fontSize: "20px" }}>
                  Billing Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg">
                        <label>Patient Name <span>:</span></label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg">
                        <label>Patient ID <span>:</span></label>
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg">
                        <label>Age / Gender <span>:</span></label>
                        <h4>{SelectedPatient_list.AgeGender}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg">
                        <label>InvoiceDate <span>:</span></label>
                        <h4>{SelectedPatient_list.AdvanceTime}</h4>
                      </div>
                      {SearchOptions?.AdvanceType === "IP" && (
                        <div className="new_billing_div phrmy_newbilg">
                          <label>WardName/Bed No <span>:</span></label>
                          <h4>{SelectedPatient_list?.WardName || "N/A"}</h4>
                        </div>
                      )}
                    </div>
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg">
                        <label>{SearchOptions?.AdvanceType === "IP" ? "IP NO" : "OP NO"} <span>:</span></label>
                        <h4>{SelectedPatient_list.IPno}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg">
                        <label>Receipt No<span>:</span></label>
                        <h4>{SelectedPatient_list.Receiptno}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg">
                        <label>Payer Type <span>:</span></label>
                        <h4>{SelectedPatient_list.PatientCategory}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg">
                        <label>Mobile No <span>:</span></label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg">
                        <label>D.O.A <span>:</span></label>
                        <h4>{SelectedPatient_list.AdmissionDate}</h4>
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
                      <tr style={{ borderTop: "1.5px solid black", borderBottom: "1.5px solid black" }}>
                        <th style={{ borderTop: "1px solid black" }}>Service Type / Name</th>
                        <th style={{ border: "none" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderBottom: "1.5px solid black", padding: "2px" }}>
                      {SelectDatalist.map((row, index) => (
                        <React.Fragment key={index}>
                          {index === 0 || SelectDatalist[index - 1].ServiceType !== row.ServiceType ? (
                            <tr style={{ borderTop: "1px solid grey", marginBottom: "10px" }}>
                              <td style={{ fontWeight: "bold", textAlign: "left", border: "none" }}>
                                {SearchOptions?.AdvanceType === "IP" ? "IPADVANCE" : "OPADVANCE"}
                              </td>
                              <td colSpan="3" style={{ border: "none" }}></td>
                            </tr>
                          ) : null}
                          <tr>
                            <td style={{ paddingLeft: "20px", border: "none" }}>{row.AdvancePurpose}</td>
                            <td style={{ border: "none" }}>{row.Amount}</td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
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
                                {hasCard && <th>Card Type</th>}
                                {hasCheque && <th>Cheque No</th>}
                                {hasBank && <th>Bank Name</th>}
                                <th>Amount</th>
                                {hasCard && <th>Transaction Fee</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {SelectDatalist.map((row, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{row.Billpay_method || "-"}</td>
                                  {hasCard && <td>{row.Billpay_method === "Card" ? row.CardType || "-" : "-"}</td>}
                                  {hasCheque && (
                                    <td>{row.Billpay_method === "Cheque" ? row.ChequeNo || "-" : "-"}</td>
                                  )}
                                  {hasBank && <td>{row.Billpay_method === "Bank" ? row.BankName || "-" : "-"}</td>}
                                  <td>{row.Amount || "-"}</td>
                                  {hasCard && <td>{`${parseInt(row.transactionFee)}%` || "-"}</td>}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <br />
                        <div className="bill_body_new_phar">
                          <label>Amount In Words <span>:</span></label>
                          <span>{NumberToWords(+totalAmount)}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>Billed By <span>:</span></label>
                          <span>{SelectedPatient_list.Billedby || "N/A"}</span>
                        </div>
                      </div>
                      <div>
                        <div className="bill_body_new_phar">
                          <label>Gross Amount <span>:</span></label>
                          <span>{totalAmount}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>Paid Amount <span>:</span></label>
                          <span>{totalAmount}</span>
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
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrint2}
          >
            Print
          </button>
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {PrintView ? (
        <ForPrintData />
      ) : (
       <div className="Main_container_app">
          <h3>Advance Collection List</h3>
          <div className="RegisFormcon_1" style={{ marginBottom: '10px' }}>
            <div className="RegisForm_1">
              <label>
                Advance Type<span>:</span>
              </label>
              <select
                name="AdvanceType"
                value={SearchOptions.AdvanceType}
                onChange={HandleOnchangeSearch}
                aria-label="Advance Type"
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
                value={SearchOptions.DateType}
                onChange={HandleOnchangeSearch}
                aria-label="Date Type"
              >
                <option value="All">All</option>
                <option value="Current">Current Date</option>
                <option value="Customize">Customize</option>
              </select>
            </div>
            {SearchOptions.DateType === 'Current' && (
              <div className="RegisForm_1">
                <label>
                  Current Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="CurrentDate"
                  value={SearchOptions.CurrentDate}
                  onChange={HandleOnchangeSearch}
                  readOnly
                  aria-label="Current Date"
                />
              </div>
            )}
            {SearchOptions.DateType === 'Customize' && (
              <>
                <div className="RegisForm_1">
                  <label>
                    From Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="FromDate"
                    value={SearchOptions.FromDate}
                    onChange={HandleOnchangeSearch}
                    aria-label="From Date"
                  />
                </div>
                <div className="RegisForm_1">
                  <label>
                    To Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="ToDate"
                    value={SearchOptions.ToDate}
                    onChange={HandleOnchangeSearch}
                    min={SearchOptions.FromDate}
                    aria-label="To Date"
                  />
                </div>
              </>
            )}
            <div className="RegisForm_1">
              <label>
                Patient ID<span>:</span>
              </label>
              <input
                type="text"
                name="SearchbyPatientId"
                value={SearchOptions.SearchbyPatientId}
                onChange={HandleOnchangeSearch}
                aria-label="Patient ID"
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Registration ID<span>:</span>
              </label>
              <input
                type="text"
                name="SearchbyRegistrationId"
                value={SearchOptions.SearchbyRegistrationId}
                onChange={HandleOnchangeSearch}
                aria-label="Registration ID"
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Patient Name<span>:</span>
              </label>
              <input
                type="text"
                name="SearchbyFirstName"
                value={SearchOptions.SearchbyFirstName}
                onChange={HandleOnchangeSearch}
                aria-label="Patient Name"
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Phone No<span>:</span>
              </label>
              <input
                type="text"
                name="SearchbyPhoneNumber"
                value={SearchOptions.SearchbyPhoneNumber}
                onChange={HandleOnchangeSearch}
                aria-label="Phone Number"
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Status<span>:</span>
              </label>
              <select
                name="SearchStatus"
                value={SearchOptions.SearchStatus}
                onChange={HandleOnchangeSearch}
                aria-label="Status"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Due">Due</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
          </div>
          <ReactGrid columns={PatientIPRegisterColumns} RowData={FilterData} />
        </div>
      )}

      
    
      {!PrintView && SelectAdvance && (
        <div className="loader" onClick={() => setSelectAdvance(false)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Advance Collection Modal"
          >
            <div className="DivCenter_container">Advance Collection</div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Patient Id <span>:</span>
                </label>
                <span>{SelectedPatient?.PatientId || 'N/A'}</span>
              </div>
              <div className="RegisForm_1">
                <label>
                  {SelectedPatient?.type === 'OP' ? 'OP No' : 'IP No'} <span>:</span>
                </label>
                <span>{SelectedPatient?.RegistrationId || 'N/A'}</span>
              </div>
              <div className="RegisForm_1">
                <label>
                  Patient Name <span>:</span>
                </label>
                <span>{SelectedPatient?.PatientName || 'N/A'}</span>
              </div>
            </div>
            <ReactGrid columns={AdvanceColumns} RowData={AdvanceData} />
            <button
              className="close-modal-btn"
              onClick={() => setSelectAdvance(false)}
              aria-label="Close Modal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      

        
     
      <ToastAlert Message={toast.message} Type={toast.type} />
      
      <ModelContainer />
    </>
  );
};

export default AdvanceReprintList;

