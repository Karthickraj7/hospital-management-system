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

const OutStandingCreditList = () => {



    const componentRef = useRef();
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector((state) => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const [Filterdata, setFilterdata] = useState([]);
      const [printView, setPrintView] = useState(null); 
        const [printOptions, setPrintOptions] = useState({});

    console.log('Filterdata',Filterdata)
      
    

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
        SearchStatus: "Credit",
      });


      const [SelectedPatient_list, setSelectedPatient_list] = useState({});

      console.log(SelectedPatient_list,'SelectedPatient_listttttt')
      
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

            const [billAmount, setBillAmount] = useState([]);

            console.log(billAmount,'billAmount')
          


      useEffect(() => {
        const controller = new AbortController();
      
        const apiUrl =
          
          searchOptions.SearchStatus === "Credit" 
          
            ? `${UrlLink}Frontoffice/IPFinalBill_Details_Link_Credit_for_Payment`
            : `${UrlLink}Frontoffice/Outstanding_Credit_Details_For_Reprint`;
      
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


  const HandleMovedatatobill = (params) => {
    console.log("IPBillingData", params);

    const updatedParams = { ...params, billpage: 'Finalbill' };

    dispatchvalue({ type: "IPBillingData", value: updatedParams });
    dispatchvalue({ type: "OPBillingData", value: {} });

    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "IPCreditBilling" });
    dispatchvalue({ type: "setPreviousFolder", value: "OutStandingCreditList" });
    dispatchvalue({ type: "showMenu", value: true });
  };


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


  const HandleCreditPrint = (params) => {

    console.log(params.Payment_Info,'paramsssssss')

    setSelectedPatient_list({
      ...params
    })

    setBillAmount(params.Payment_Info)
    setIsPrintButtonVisible(false)
  }


  const PatientOPRegisterColumns = useMemo(() => {
   
      return [
        {
          key: "FBillNo",
          name: "Bill No",
        },
        {
          key: "FBilldate",
          name: "Date",
        },
        {
          key: "Patientid",
          name: "Patient Id",
        },
         {
        key: "IPNo",
        name: "IPNo",
      },
        {
          key: "Patientname",
          name: "Patient Name",
        },
       
        {
          key: "Paidamt",
          name: "Paidamt",
        },
        {
          key: "Balance_Amount",
          name: "Balance Amount",
        },
        {
          key: "Remarks",
          name: "Remarks",
        },
        {
          key: "Billedby",
          name: "Billedby",
        },     
        {
          key: "Action",
          name: "Action",
          renderCell: (params) => {
            return params.row.BillStatus === "Credit" ? (
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
          key: "Billing_Date",
          name: "Date",
        },
        {
          key: "Patient_Id",
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
          key: "Mobileno",
          name: "PhoneNo",
        },
        {
          key: "Wardname",
          name: "Ward/Room",
        },
        {
          key: "Doctor_Name",
          name: "Doctor Name",
        },
        // {
        //   key: "PatientCategory",
        //   name: "Patient Category",
        // },
        {
          key: "Net_Amount",
          name: "Net Amount",
        },
        {
          key: "Paid_Amount",
          name: "Paid Amount",
        },
       
        {
          key: "Action",
          name: "Action",
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
            ): params.row.Bill_Status === "Paid" ? (
              <>
                <Button
                  className="cell_btn"
                  onClick={() => HandleCreditPrint(params.row)}
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


    const [ClinicDetials, setClinicDetials] = useState({
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

          const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);


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
                                <h4>{SelectedPatient_list.Patient_Id}</h4>
                              </div>
                              <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                <label>
                                  Age / Gender <span>:</span>
                                </label>
                                <h4>{SelectedPatient_list.Agegender}</h4>
                              </div>
                              <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                <label>
                                  D.O.A <span>:</span>
                                </label>
                                <h4>{SelectedPatient_list.Admissiondate}</h4>
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
                                <h4>{SelectedPatient_list.Mobileno}</h4>
                              </div>
        
                              <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                <label>Consultant <span>:</span></label>
                                <h4>{SelectedPatient_list.Doctor_Name}</h4>
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
                                  Ward <span>:</span>
                                </label>
                                <h4>{SelectedPatient_list.Wardname}</h4>
                              </div>
        
                              <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                <label>
                                  Invoice No<span>:</span>
                                </label>
                                <h4>{SelectedPatient_list.Billing_Invoice_No}</h4>
                              </div>
                              <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                <label>
                                  Invoice Date <span>:</span>
                                </label>
                                <h4>{SelectedPatient_list.Billing_Date}</h4>
                              </div>
                              <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                <label>
                                  Payer Type <span>:</span>
                                </label>
                                <h4>{`${SelectedPatient_list.Patientcategory} [IP]`}</h4>
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
                                            {row.payment_type || "-"}
                                          </td>
                                          {hasCard && (
                                            <td
                                              style={{
                                                padding: "8px",
                                                border: "1px solid #ddd",
                                              }}
                                            >
                                              {row.payment_type === "Card"
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
                                              {row.payment_type === "Cheque"
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
                                              {row.payment_type === "Bank"
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
                                            {row.amount || "-"}
                                          </td>
                                          {hasCard && (
                                            <td
                                              style={{
                                                padding: "8px",
                                                border: "1px solid #ddd",
                                                textAlign: "center",
                                              }}
                                            >
                                              {row.payment_type === "Card" &&
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
                                    {NumberToWords(+SelectedPatient_list.Paid_Amount)}
                                  </span>
                                </div>
                                <div style={{ display: "flex", gap: "5px" }}>
                                  <label style={{ fontWeight: "bold" }}>
                                    Billed By:{" "}
                                  </label>
                                  <span>{SelectedPatient_list.Created_By}</span>
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
                                  {SelectedPatient_list.Net_Amount}
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
                                  {SelectedPatient_list.Net_Paid_Amount}
                                </span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", borderBottom: "1px solid black ", }}>
                                <span style={{ fontWeight: "bold" }}>Paid Amount:</span>
                                <span style={{ fontWeight: 900, fontSize: "15px" }}>{SelectedPatient_list.Paid_Amount}</span>
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

        




  return (
  <>
    {isPrintButtonVisible ? (
      <div className="Main_container_app">
        <h3>IP Outstanding Credit Queue List</h3>
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
              <option value="All">All</option>
              <option value="Current">Current Date</option>
              <option value="Customize">Customize</option>
            </select>
          </div>

          {searchOptions.DateType === "Current" && (
            <div className="RegisForm_1">
              <label>
                Current Date<span>:</span>
              </label>
              <input
                type="date"
                name="CurrentDate"
                value={searchOptions.CurrentDate}
                onChange={HandleOnchangeSearch}
                readOnly
              />
            </div>
          )}

          {searchOptions.DateType === "Customize" && (
            <>
              <div className="RegisForm_1">
                <label>
                  From Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="FromDate"
                  value={searchOptions.FromDate}
                  onChange={HandleOnchangeSearch}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  To Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="ToDate"
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
              <option value="Paid">Paid</option>
              <option value="Credit">Credit</option>
            </select>
          </div>
        </div>

        {searchOptions.SearchStatus === "Credit" && (
          <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata} />
        )}

        {searchOptions.SearchStatus === "Paid" && (
          <ReactGrid columns={IPPatientBillcolumns} RowData={Filterdata} />
        )}

        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    ) : (
       <ForPrintData />
    )}
  </>
);
}

export default OutStandingCreditList
