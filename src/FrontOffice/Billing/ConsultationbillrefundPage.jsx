
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";
import Clinic_Logo from "../../Assets/logo.png";
// import Chirayuulogo from "../../Assets/Chirayuulogo.png";

import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoBedOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import { FaTrash } from "react-icons/fa";
import profile from "../../Assets/profileimg.jpeg";
import "../../App.css";
import { handleKeyDownText } from "../../OtherComponent/OtherFunctions";
import { handleKeyDownPhoneNo } from "../../OtherComponent/OtherFunctions";
// handleKeyDownTextRegistration
import { handleKeyDownTextRegistration } from "../../OtherComponent/OtherFunctions";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { useReactToPrint } from "react-to-print";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";


const ConsultationbillrefundPage = () => {

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const ClinicDetails = useSelector(state => state.userRecord?.ClinicDetails);


  const toast = useSelector((state) => state.userRecord?.toast);
  const [errors, setErrors] = useState({});

  const OP_BillingData = useSelector(
    (state) => state.Frontoffice?.OPBillingData
  );
  const OPConsultDetails = useSelector(
    (state) => state.Frontoffice?.OPConsultDetails
  );
  console.log("Oppppppp", OP_BillingData);
  console.log("Consultttt", OPConsultDetails);

  const [billing_details,setbilling_details] = useState([]);
  const [billing_items,setbilling_items] = useState([]);
  const [billing_receipt,setbilling_receipt] = useState({})
  const [PrevPaidAmount, setPrevPaidAmount] = useState('')

const [Refundedamt,setRefundedamt] = useState("")
const [CurrAmt, setCurrAmt] = useState(0);
const [BalanceAmt,setBalanceAmt] = useState(0);
const [Paidedamt,setPaidedamt] = useState(0);

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

useEffect(() => {
  const prev = parseFloat(PrevPaidAmount) || 0;
  const refunded = parseFloat(Refundedamt) || 0;
  console.log(prev - refunded,'currenamttttttttt')
  setCurrAmt(prev - refunded);
}, [PrevPaidAmount, Refundedamt]);

useEffect(() => {
  const refunded = parseFloat(Refundedamt) || 0;

  const totalPaid = billAmount.reduce((sum, item) => {
    return sum + (parseFloat(item.paidamount) || 0);
  }, 0);

  setPaidedamt(totalPaid);

  const balance = refunded - totalPaid;
  setBalanceAmt(balance);
}, [Refundedamt, billAmount]);




const [ReceiptDate,setReceiptDate] = useState('')
const Patient_Id = billing_details?.Patient_Id

  console.log(Patient_Id,'Patient_Id')
  console.log(billing_details,'billing_details')
  console.log(billing_items,'billing_items')
  console.log(Refundedamt,'Refundedamt')
  console.log(CurrAmt,'CurrAmt')
  console.log(BalanceAmt,'BalanceAmt')

   useEffect(() => {

    if(OP_BillingData !== ""){
       const params = {
          RegistrationId : OP_BillingData
  };

  axios
      .get(`${UrlLink}Frontoffice/get_edited_OP_doc_details`, { params })
      .then((res) => {
        const ress = res.data;
        console.log("567", ress);
        setbilling_details(ress.billing_details);
        setbilling_items(ress.billing_items);
        setRefundedamt(ress.billing_details.Refunded_Amount);
        setpatientsearch({
          Search : ress.billing_details.Patient_Id
        })
        setPrevPaidAmount(ress?.billing_details.Paid_Amount);
        // setCurrAmt(ress?.billing_items.Total_Amount);
        setbilling_receipt(ress.billing_receipt)
      })
      .catch((err) => {
        console.log(err);
      });

    }


  }, [OP_BillingData]);

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setPatientInfo((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const [patientInfo, setPatientInfo] = useState({
  PatientId: billing_details.Patient_Id || "",
  ABHA: '',
  PatientName: billing_details.Patient_Name || "",
  AgeGender: billing_details.AgeGender ||"",
  PhoneNo: billing_details.PhoneNo ||"",
  PatientCategory: billing_details.PatientCategory ||"",
  PatientCategoryName: '',
  Address: billing_details?.Address||"",
});


useEffect(() => {
setPatientInfo({

  PatientId: billing_details.Patient_Id,
  PatientName: billing_details.Patient_Name,
  AgeGender: billing_details.AgeGender,
  PhoneNo: billing_details.PhoneNo,
  PatientCategory: billing_details.PatientCategory,
  Address: billing_details?.Address

})

 
}, [billing_details]);

console.log(patientInfo,'patientInfo')



  // useEffect(()=>{
  //   if(OP_BillingData !==)
  // },[UrlLink])

  const componentRef = useRef();
  const currentDate = new Date();
  const Formdate = format(currentDate, "yyyy-MM-dd");



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

  const [SelectedPatient_list, setSelectedPatient_list] = useState({
    PatientId: billing_details.Patient_Id || "",
    PatientName:   billing_details.Patient_Name || "",
    PhoneNumber:  billing_details.PhoneNo ||"",
    PatientCategory: "General",
    PatientCategoryType: "",
    InsuranceName: "",
    Gender:  billing_details.AgeGender ||"",
    City: billing_details.Address ||"",
    State: "",
    PatientAddress:  billing_details?.Address||"",
    Pincode: "",
    VisitId:  billing_details?.Visit_Id ||"",
    Date: "",
    ReferalDoctor: "",
  });

  console.log('PrevPaidAmount', PrevPaidAmount);



  const [RecieptInvoice, setRecieptInvoice] = useState(null);


  console.log(billAmount,'billAmount',initialState,'initialState')
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);

  const [NetAmount_CDmethod, setNetAmount_CDmethod] = useState({
    Method: "",
    Amount: "",
  });
  const [formAmount, setFormAmount] = useState({
    Billpay_method: "",
    CardType: "",
    CardNo: "",
    upiid: "",
    TransactionId: "",
    ChequeNo: "",
    BankName: "",
    paidamount: "",
    Additionalamount: "",
    transactionFee: "",
  });


  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const [totalPaidAmount, settotalPaidAmount] = useState(0);
  const [isEdit, setIsEdit] = useState(null);

  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);

  // const [patientsearchoption, setpatientsearchoption] = useState("PatientID");
  const [patientsearch, setpatientsearch] = useState({
    Search: "",
  });
  const [SmartCard, setSmartCard] = useState({
    SmartCardNo: "",
  });


  const [Paytype, setPaytype] = useState({
    isCash: "Yes",
    isCredit: "No",
  });



  const [PaymentMode, setPaymentMode] = useState('')

  const [printoption, setprintoption] = useState("PrintDetailed");


  useEffect(() => {
    axios.get(`${UrlLink}Masters/Hospital_Detials_link`)
      .then((res) => {
        const ress = res.data
        console.log('hospitalllll', ress);
        setClinicDetials((prev) => ({
          ...prev,
          ClinicName: ress.hospitalName,
          ClinicLogo: ress.hospitalLogo,
        }))
      })
      .catch((e) =>
        console.log(e)
      )
  }, [UrlLink])

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        console.log('clinccccc', clinicData);

        if (clinicData) {
          const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(
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
          // if (clinicData.Clinic_Logo) {
          //   setClinic_Logo(`data:image/png;base64,${clinicData.Clinic_Logo}`);
          // }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [UserData?.location, UrlLink]);


  const HandlesearchPatient = (value) => {

  };


  const HandleSearchchange = (e) => {
    const { name, value } = e.target;



    console.log(value,'value')
    const exist = FilterbyPatientId.find((f) => f.PatientId === value);
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {}
    //   axios
    //     .get(
    //       `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${value}`
    //     )
    //     .then((res) => {
    //       const { PatientProfile, PatientId, ABHA, AliasName, PatientName, PhoneNo, Address, AgeGender, ...resss } = res.data;
    //       console.log("paaatttttttttt", res.data);

    //       setRegisterData((prev) => ({
    //         ...prev,
    //         PatientId: PatientId || "",
    //         ABHA: "",
    //         PatientName: PatientName || "",
    //         AgeGender: AgeGender || "",
    //         PhoneNo: PhoneNo || "",
    //         PatientCategory: 'General',
    //         Address: Address || "",
    //       }));
    //       setSmartCard((prev) => ({
    //         ...prev,
    //         SmartCardNo: PatientId || "",
    //       }));
    //       setpatientsearch((prev) => ({
    //         ...prev,
    //         [name]: value,
    //       }));
    //     })
    //     .catch((err) => console.log(err));
    // }
  };






  const HandleSmartCard = () => { };


  const gridRef = useRef(null);

 



  useEffect(() => {
    axios.get(`${UrlLink}Masters/PaymentMode_Master_link`)
      .then((res) => {
        const ress = res.data
        console.log('1111111', ress);

        setPaymentMode(ress)
      })
      .catch((e) => {
        console.log(e);
      })

  }, [UrlLink,])


  const handlePayType = (e) => {
    const { name } = e.target;

    setPaytype((prev) => {
      if (name === "isCash") {
        return { isCash: "Yes", isCredit: "No" };

      } else if (name === "isCredit") {
        return { isCash: "No", isCredit: "Yes" };
      }
      return prev;
    });

    setFormAmount({
      Billpay_method: "",
      CardType: "",
      CardNo: "",
      upiid: "",
      TransactionId: "",
      ChequeNo: "",
      BankName: "",
      paidamount: "",
      Additionalamount: "",
      transactionFee: "",
    });

    setBillAmount([]);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Calculate net amount based on condition
    let total_netamount;
  
    total_netamount = Math.round(BalanceAmt).toFixed(2);
      console.log('totalllll', total_netamount);
    
    console.log('totalllllpaiii', totalPaidAmount);

    const remainingBalance = Math.abs(parseFloat(Refundedamt) - +PrevPaidAmount);
    console.log('totalllllremmmm', remainingBalance);


    if (remainingBalance > 0) {
      if (name === "Billpay_method") {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else if (name === "CardNo") {
        if (value.length < 5) {
          setFormAmount((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        }
      } else if (name === "TransactionId") {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value.toUpperCase(),
        }));
      } else if (name === "paidamount") {
        const availableBalance = Math.abs(parseFloat(total_netamount) - totalPaidAmount);
        if (+availableBalance >= +value) {
          setFormAmount((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        } else {
          alert(`Enter a valid value below the Net Amount: ${availableBalance}`);
          setFormAmount((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
      } else {
        setFormAmount((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      alert("No Balance Amount");
    }
  };

  const handleAdd = () => {
    let req = [];
    if (formAmount.Billpay_method === "Card") {
      req = ["Billpay_method", "CardType", "paidamount"];
    } else if (formAmount.Billpay_method === "Cheque") {
      req = ["Billpay_method", "ChequeNo", "BankName", "paidamount"];
    } else if (formAmount.Billpay_method === "OnlinePayment") {
      req = ["Billpay_method", "paidamount"];
    } else {
      req = ["Billpay_method", "paidamount"];
    }
    const missing = req.filter((row) => !formAmount[row]);
    if (missing.length === 0) {
      const exist = billAmount.find(
        (p) => p.Billpay_method === formAmount.Billpay_method
      );
      if (!exist) {
        setBillAmount((prev) => [...prev, formAmount]);
        setFormAmount({
          Billpay_method: "",
          CardType: "",
          CardNo: "",
          upiid: "",
          TransactionId: "",
          ChequeNo: "",
          BankName: "",
          paidamount: "",
          Additionalamount: "",
          transactionFee: "",
        });
      } else {
        alert("The Payment Method already exist");
      }
    } else {
      alert(`enter the required fields : ${missing.join(",")}`);
    }
  };

  const handleUpdate = () => {
    let req = [];
    if (formAmount.Billpay_method === "Card") {
      req = ["Billpay_method", "CardType", "paidamount"];
    } else if (formAmount.Billpay_method === "Cheque") {
      req = ["Billpay_method", "ChequeNo", "BankName", "paidamount"];
    } else if (formAmount.Billpay_method === "OnlinePayment") {
      req = ["Billpay_method", "paidamount"];
    } else {
      req = ["Billpay_method", "paidamount"];
    }
    const missing = req.filter((row) => !formAmount[row]);
    if (missing.length === 0) {
      const data = [...billAmount];
      data[isEdit] = formAmount;

      setBillAmount(data);
      setFormAmount({
        Billpay_method: "",
        CardType: "",
        CardNo: "",
        upiid: "",
        TransactionId: "",
        ChequeNo: "",
        BankName: "",
        paidamount: "",
        Additionalamount: "",
        transactionFee: "",
      });
      setIsEdit(null);
    } else {
      alert(`enter the required fields : ${missing.join(",")}`);
    }
  };

  const handleEdit = (index) => {
    console.log(index, "---");

    const item = billAmount[index];

    if (item.Billpay_method === "Advance") {
      let Remove = billAmount.filter((ele) => ele.Billpay_method !== "Advance");
      setBillAmount(Remove);
    } else {
      setIsEdit(index);
      const item = billAmount[index];
      setFormAmount({
        ...item,
      });
    }
  };


  useEffect(() => {
    // Schedule the event for 12:00 AM
    const scheduleMidnightEvent = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // Schedule for the next day
        0, 0, 0, 0 // 12:00 AM
      );
      const timeUntilMidnight = midnight - now;

      // Schedule the first execution
      setTimeout(() => {
        handleSubmit(); // Call the function at midnight
        setInterval(handleSubmit, 24 * 60 * 60 * 1000); // Repeat every 24 hours
      }, timeUntilMidnight);
    };

    scheduleMidnightEvent();
  }, []);

  const handleSubmit = (
    isSummary = false,
    isReimb = false,
    isNon_Reimb = false
  ) => {
    let requiredfields1 = ["PatientId", "PatientName", "PhoneNo", "AgeGender"];
    let missingFields = requiredfields1.filter((field) => !patientInfo[field]);
    let errorMessages = [];

    // Check for missing required fields
    if (missingFields.length > 0) {
      errorMessages.push(
        `Please fill the required fields: ${missingFields.join(", ")}`
      );
    }

  

    // If there are any errors, show them all in one alert
    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return; // Exit the function
    }
    if (formAmount.Billpay_method !== "" && formAmount.paidamount !== "") {
      alert("Please fill the Payment Details")
      return;
    }
    if (billAmount.length === 0 && Paytype.isCash === 'Yes') {
      alert("Please fill the Payment Details")
      return;
    }

    if (billAmount.length === 0 && Paytype.isCredit === 'Yes') {
      const userConfirmed = window.confirm("Do you want to make this bill Due?");

      if (!userConfirmed) {
        return; // Stop execution if the user clicks "No"
      }
    }

    let senddata = {

     ...billing_details,
     billing_items : billing_items,
     billing_receipt : billing_receipt,
     Refundedamt : Refundedamt,
     CurrAmt : CurrAmt,
     Created_by : UserData.username,
     billAmount : billAmount,
     Paidedamt : Paidedamt
     
    };

    console.log("senddata", senddata);
    if (
      Object.keys(OP_BillingData).length !== 0 
    ) {
      axios
        .post(`${UrlLink}Frontoffice/GeneralBilling_Refund_Link_For_ConsultationEdit`, senddata)
        .then((res) => {
          console.log("OPpppppPosttt", res.data);
          setRecieptInvoice(res.data.ReceiptNo);
          setReceiptDate(res.data.ReceiptDate)
          setIsPrintButtonVisible(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

   const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: async () => {

        dispatchvalue({ type: "Registeredit", value: {} });
    dispatchvalue({ type: "OPBillingData", value: {} });
    dispatchvalue({ type: "OPConsultDetails", value: {} });
    dispatchvalue({ type: "Registeredit", value: {} });
      navigate("/Home/CashierFolder");
      dispatchvalue({ type: "HrFolder", value: "GeneralBillingList" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });


  const handlePrintClose = () => {


    dispatchvalue({ type: "Registeredit", value: {} });
    dispatchvalue({ type: "OPBillingData", value: {} });
    dispatchvalue({ type: "OPConsultDetails", value: {} });
    dispatchvalue({ type: "Registeredit", value: {} });

    navigate("/Home/FrontOfficeFolder");
    dispatchvalue({ type: "HrFolder", value: "PatientRegisterList" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  }

  console.log('ClinicDetailsss', ClinicDetails);

const ForPrintReceiptData = () => {
    const hasCard = billAmount.some((p) => p.Billpay_method === 'Card');
    const hasCheque = billAmount.some((p) => p.Billpay_method === 'Cheque');
    const hasBank = billAmount.some((p) => p.Billpay_method === 'Bank');

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
                      <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        <span>{[ClinicDetials.ClinicAddress].filter((detail) => detail).join(", ")},{[ClinicDetials.ClinicCity, ClinicDetials.ClinicState, ClinicDetials.ClinicCode].filter((detail) => detail).join(", ")}</span>
                      </div>
                      <div>{[ClinicDetials.ClinicMobileNo, ClinicDetials.ClinicLandLineNo, ClinicDetials.ClinicMailID].filter((detail) => detail).join(" , ")}</div>
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
                  Refund Receipt
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address">
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{billing_details.Patient_Name}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient ID <span>:</span>
                        </label>
                        <h4>{billing_details.Patient_Id}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Age / Gender <span>:</span>
                        </label>
                        <h4>{billing_details.AgeGender}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{billing_details.PhoneNo}</h4>
                      </div>


                    </div>

                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          OP NO <span>:</span>
                        </label>
                        <h4>{billing_details.Register_Id}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Receipt No <span>:</span>
                        </label>
                        <h4>{RecieptInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Receipt Date <span>:</span>
                        </label>
                        <h4>{ReceiptDate}</h4>
                      </div>
                      {/* {SelectedPatient_list.ReferalDoctor !== "" &&
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                          <label>
                            Referal Doctor<span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.ReferalDoctor}</h4>
                        </div>} */}
                      {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Physician Name <span>:</span>
                        </label>
                        <h4>{`${BillingData.DoctorName}`}</h4>
                      </div> */}
                    </div>
                  </div>
                  <div >
                    {/* <div className="physician_label_fixed" >
                      <label >Doctor Name <span>:</span></label>
                      <h4>{`${BillingData.DoctorName}`}</h4>
                    </div> */}
                  </div>
                </td>



              </tr>
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: '100%', border: 'none' }}>
                    <thead>
                      <tr style={{ borderTop: '1.5px solid black', borderBottom: '1.5px solid black' }}>
                        <th style={{ borderTop: '1px solid black' }}>Service Type / Name</th>
                        <th style={{ border: 'none' }}>Unit</th>
                        <th style={{ border: 'none' }}>Amount</th>
                        <th style={{ border: 'none' }}>Net Amount</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderBottom: '1.5px solid black', padding: '2px' }}>
                      {billing_items.map((row, index, filteredArray) => (
                        <React.Fragment key={index}>
                          {index === 0 || filteredArray[index - 1].Service_Type !== row.Service_Type ? (
                            <tr style={{ borderTop: '1px solid grey', marginBottom: '10px' }}>
                              <td style={{ fontWeight: 'bold', textAlign: 'left', border: 'none' }}>
                                {row.Service_Type}
                              </td>
                              <td colSpan="3" style={{ border: 'none' }}></td>
                            </tr>
                          ) : null}
                          <tr>
                            <td style={{ paddingLeft: '20px', border: 'none' }}>{row.Service_Name}</td>
                            <td style={{ border: 'none' }}>{row.Quantity}</td>
                            <td style={{ border: 'none' }}>{row.Amount}</td>
                            <td style={{ border: 'none' }}>{row.Total_Amount}</td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>

            </thead>
            <br />

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
                              <th>Additional Amount</th>
                              {hasCard && <th>Transaction Fee</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {billAmount.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Billpay_method || '-'}</td>
                                {hasCard && (
                                  <td>{row.Billpay_method === 'Card' ? row.CardType || '-' : '-'}</td>
                                )}
                                {hasCheque && (
                                  <td>{row.Billpay_method === 'Cheque' ? row.ChequeNo || '-' : '-'}</td>
                                )}
                                {hasBank && (
                                  <td>{row.Billpay_method === 'Bank' ? row.BankName || '-' : '-'}</td>
                                )}
                                <td>{row.paidamount || '-'}</td>
                                <td>{row.Additionalamount || '-'}</td>
                                {hasCard && (
                                  <td>{row.Billpay_method === 'Card' ? `${row.transactionFee}%` || '-' : '-'}</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>
                          {NumberToWords(Paidedamt)}
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
                          Previous Dr Paid Amount <span>:</span>
                        </label>
                        <span>{PrevPaidAmount}</span>
                      </div>

                      <div className="bill_body_new_phar">
                        <label>
                          Current Dr Amount <span>:</span>
                        </label>
                        <span>{CurrAmt}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Refunded Amount <span>:</span>
                        </label>
                        <span>{Paidedamt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>


            <tfoot className="print_footerr">
              <tr className="jjxcdsjjej_"></tr>

              <tr className="ehdhe_9ikw">
                <td className="shshxhxs_secfooter">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p className="disclaimer23">
                      This page is created automatically without a signature.
                    </p>
                  </div>
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
        <>
          <div className="Main_container_app">
            <h3>Billing Refund</h3>

            <div className="csdcedw_kl88">
              <div className="RegisBillSearchForm_1 RegisBillSearchForm_1_mmmm">
                <label>
                  Search <span>:</span>
                </label>
                <div className="Search_patient_icons">
                  <input
                    type="text"
                    onKeyDown={
                      patientsearch === "FirstName"
                        ? (e) => HandlesearchPatient(patientsearch.Search)
                        : null
                    }
                    list="Search_iddd"
                    autoComplete="off"
                    name="Search"
                    pattern={
                      patientsearch === "PhoneNumber" ? "\\d{10}" : "[A-Za-z]+"
                    }
                    className={
                      errors["Search"] === "Invalid"
                        ? "invalid"
                        : errors["Search"] === "Valid"
                          ? "valid"
                          : ""
                    }
                    value={patientsearch.Search}
                    onChange={HandleSearchchange}
                  // disabled={
                  //   Object.values(OP_BillingData).length !== 0 || Object.values(OPConsultDetails).length !== 0
                  // }
                  />
                  <datalist id="Search_iddd">
                    {FilterbyPatientId.map((row, indx) => (
                      <option key={indx} value={row.PatientId}>
                        {`${row.PhoneNo} | ${row.FirstName} | ${row.UniqueIdNo}`}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="ewdwdwd_u7j" ref={gridRef}>
                <div className="RegisBillSmart_2">
                  <label>
                    Smart Card No <span>:</span>
                  </label>
                  <input
                    type="text"
                    value={SmartCard.SmartCardNo}
                    id="SmartCardNo"
                    readOnly
                  // onChange={handleSmartCard}
                  />
                  <button
                    style={{
                      backgroundColor: "#646653",
                      width: "50px",
                      height: "20px",
                      color: "white",
                      cursor: "pointerEvents",
                    }}
                    onClick={HandleSmartCard}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>


            <br />

            {/* <div className="RegisBillFormcon" ref={gridRef}>
              {RegisterData &&
                Object.keys(RegisterData).filter((p) => {
                  // If the PatientCategory is 'General', exclude 'PatientCategoryName'
                  if (OP_BillingData.PatientCategory === 'General' && p === 'PatientCategoryName') {
                    return false;
                  }
                  return true;
                }).map((field, index) => (
                  <div
                    className="RegisBillForm_1 RegisBillForm_1_M "
                    key={index}
                  >
                    <label htmlFor={`${field}_${index}`}>
                      {field === "AgeGender"
                        ? "Age/Gender"
                        : formatLabel(field)}
                      <span>:</span>
                    </label>
                    {[
                      "PatientId",
                      "ABHA",
                      "PatientName",
                      "AgeGender",
                      "PhoneNo",
                      "PatientCategory",
                      "PatientCategoryName",
                    ].includes(field) ? (
                      <input
                        id={`${field}_${index}`}
                        autoComplete="off"
                        type={field === "DOB" ? "date" : "text"}
                        name={field}
                        pattern={
                          field === "Email"
                            ? "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[cC][oO][mM]$"
                            : field === "PhoneNo"
                              ? "\\d{10}"
                              : ["CaseSheetNo", "UniqueIdNo"].includes(field)
                                ? "[A-Za-z0-9]+"
                                : field === "Age"
                                  ? "\\d{1,3}"
                                  : field === "DOB"
                                    ? ""
                                    : field === "Pincode"
                                      ? "\\d{6}"
                                      : "[A-Za-z]+"
                        }
                        className={
                          errors[field] === "Invalid"
                            ? "invalid"
                            : errors[field] === "Valid"
                              ? "valid"
                              : ""
                        }
                        required
                        value={RegisterData[field]}
                        onKeyDown={
                          [
                            "MiddleName",
                            "SurName",
                            "Occupation",
                            "NextToKinName",
                            "FamilyHeadName",
                            "Street",
                            "Area",
                            "City",
                            "State",
                            "Complaint",
                            "Country",
                          ].includes(field)
                            ? handleKeyDownTextRegistration
                            : field === "PhoneNo"
                              ? handleKeyDownPhoneNo
                              : null
                        }
                        onChange={HandleOnchange}
                      />
                    ) : (field === 'Address' && (
                      <textarea
                        name="Address"
                        value={RegisterData[field]}
                      />
                    ))}
                  </div>
                ))}
            </div> */}


            <div className="RegisBillFormcon" ref={gridRef}>
              <div className="RegisBillForm_1 RegisBillForm_1_M">
                <label>Patient ID<span>:</span></label>
                <input
                  type="text"
                  name="PatientId"
                  value={patientInfo.PatientId}
                  onChange={handleInputChange}
                />
              </div>

              {/* <div className="RegisBillForm_1 RegisBillForm_1_M">
                <label>ABHA<span>:</span></label>
                <input
                  type="text"
                  name="ABHA"
                  value={patientInfo.ABHA}
                  onChange={handleInputChange}
                />
              </div> */}

              <div className="RegisBillForm_1 RegisBillForm_1_M">
                <label>Patient Name<span>:</span></label>
                <input
                  type="text"
                  name="PatientName"
                  value={patientInfo.PatientName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="RegisBillForm_1 RegisBillForm_1_M">
                <label>Age/Gender<span>:</span></label>
                <input
                  type="text"
                  name="AgeGender"
                  value={patientInfo.AgeGender}
                  onChange={handleInputChange}
                />
              </div>

              <div className="RegisBillForm_1 RegisBillForm_1_M">
                <label>Phone No<span>:</span></label>
                <input
                  type="text"
                  name="PhoneNo"
                  value={patientInfo.PhoneNo}
                  pattern="\d{10}"
                  onKeyDown={handleKeyDownPhoneNo}
                  onChange={handleInputChange}
                />
              </div>

              <div className="RegisBillForm_1 RegisBillForm_1_M">
                <label>Patient Category<span>:</span></label>
                <input
                  type="text"
                  name="PatientCategory"
                  value={patientInfo.PatientCategory}
                  onChange={handleInputChange}
                />
              </div>

              {/* Conditionally render PatientCategoryName if not "General" */}
              {patientInfo.PatientCategory !== 'General' && (
                <div className="RegisBillForm_1 RegisBillForm_1_M">
                  <label>Patient Category Name<span>:</span></label>
                  <input
                    type="text"
                    name="PatientCategoryName"
                    value={patientInfo.PatientCategoryName}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="RegisBillForm_1 RegisBillForm_1_M">
                <label>Address<span>:</span></label>
                <textarea
                  name="Address"
                  value={patientInfo.Address}
                  onChange={handleInputChange}
                />
              </div>
            </div>


            {/* <h3>Services</h3>

            <div className="RegisBillFormcon">
              <div className="Service_bill">
                {
                  Object.keys(ServiceProcedure).filter((p) => p !== 'ServiceSubCatId' && p !== 'Subcategorypk' && p !== 'Categoryid' && p !== 'ServiceId' && p !== 'Total' && p !== 'type').map((field, indx) => (
                    <div className="RegisForm_1" key={indx}>
                      <label htmlFor={`${field}_${indx}`}>
                        {formatLabel(field)}
                        <span>:</span>
                      </label>
                      {
                        ['ServiceCategory', 'ServiceSubCategory', 'Rate', 'Quantity'].includes(field) && (
                          <input
                            type='text'
                            name={field} // Add the name attribute here
                            value={ServiceProcedure[field]}
                            list={`${field}_ServiceCategory`}
                            onChange={HandleOnchangeService}
                            autoComplete="off"
                          // onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                          />

                        )
                      }
                      {
                        <datalist id={`${field}_ServiceCategory`}>
                          {field === 'ServiceCategory' && (
                            ServiceCategoryData?.map((row, indx) =>
                              <option key={indx} value={`${row.service_category_id}-${row.service_name}`}>
                                {row.service_name}
                              </option>
                            )
                          )}
                          {field === 'ServiceSubCategory' && (
                            Array.isArray(ServiceSubCategoryData) &&
                            ServiceSubCategoryData.map((row, indx) =>
                              <option key={indx} value={`${row.pk}-${row.service_subcategory}`}>
                                {row.service_subcategory}
                              </option>
                            )
                          )}
                        </datalist>
                      }

                    </div>

                  ))
                }

              </div>
              <div className="Register_btn_con added_Register_btn_con">

                <button
                  className="RegisterForm_1_btns added_RegisterForm_1_btns"
                  onClick={Additemstobillfun}
                >
                  Add
                </button>
              </div>
            </div> */}

            <h3>Items</h3>

            <div className="new-patient-registration-form">
              <div className="Selected-table-container444 DEWSDXWED">
                <table className="selected-medicine-table222 EDWEDE">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Service Type</th>
                      <th>Service Name</th>
                      <th>Charge</th>
                      <th>Quantity</th>
                      <th>Amount </th>
                      <th>Discount Type</th>
                      <th>Discount</th>
                      <th>Net Amount</th>
                      <th>Status</th>
                      {/* <th>isReimbursable</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {billing_items.map((row, index) => {
                      return (
                        <tr key={index+ 1}>
                          <td>{index+ 1}</td>
                          <td>{row.Service_Type}</td>
                          <td>{row.Service_Name}</td>
                          <td>{row.Charge || "-"}</td>
                          <td>{row.Quantity || "-"}</td>
                          <td>{row.Amount || "-"}</td>
                          <td>{row.Discount_Type || "-"}</td>
                          <td>{row.Discount_Amount || "-"}</td>
                          <td>{row.Total_Amount || "-"}</td>
                          <td>{row.Item_Status || "-"}</td>
                          {/* <td>
                            <button
                              className="delnamebtn"
                              onClick={() => {
                                deletebillingitem(row);
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="">
                <br />

                {/* <div className="summary-container addded_sumry_contre">
                  <div
                    className="RegisFormcon"
                    style={{ justifyContent: "center" }}
                  >
                    <div className="RegisBillSearchForm_1">
                      <label htmlFor="">
                        Total Discount<span>:</span>
                      </label>
                      <select
                        name="CDMethod"
                        value={NetAmount_CDmethod.Method}
                        onChange={(e) => {
                          setNetAmount_CDmethod((prev) => ({
                            ...prev,
                            Method: e.target.value,
                            Amount: "",
                          }));
                          setBillAmount([]);
                          setFormAmount({
                            Billpay_method: "",
                            CardType: "",
                            CardNo: "",
                            upiid: "",
                            TransactionId: "",
                            ChequeNo: "",
                            BankName: "",
                            paidamount: "",
                            Additionalamount: "",
                            transactionFee: "",
                          });
                        }}
                        disabled={SelectDatalist.length === 0}
                      >
                        <option value="">Select</option>
                        <option value="Cash">Cash</option>
                        <option value="Percentage">Percentage</option>
                      </select>
                    </div>
                    <div className="cah-d-wth RegisBillSearchForm_1">
                      <label htmlFor="">
                        Discount Value<span>:</span>
                      </label>
                      <input
                        type="number"
                        onKeyDown={blockInvalidChar}
                        name="CashDiscount"
                        value={NetAmount_CDmethod.Amount}
                        onChange={(e) => {
                          if (NetAmount_CDmethod.Method !== "") {
                            setNetAmount_CDmethod((prev) => ({
                              ...prev,
                              Amount: e.target.value,
                            }));
                            setBillAmount([]);
                            setFormAmount({
                              Billpay_method: "",
                              CardType: "",
                              CardNo: "",
                              upiid: "",
                              TransactionId: "",
                              ChequeNo: "",
                              BankName: "",
                              paidamount: "",
                              Additionalamount: "",
                              transactionFee: "",
                            });
                          } else {
                            alert("Please Choose an Discount Method");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div> */}

                <div className="summary-container addded_sumry_contre">
                  <div className="WDWDWD_OO">
                    <div className="edcwjkediu87_mmmm">
                      <div>

                        <h5 style={{ backgroundColor: "#d2cdd4", borderRadius: "5px", height: '20px' }}> Refund Payment </h5>
                        <div className="sriii_shvdjsd">
                          <label>
                            <input
                              type="checkbox"
                              name="isCash"
                              checked={Paytype.isCash === "Yes"}
                              onChange={handlePayType}
                            />
                            Cash
                          </label>
                          {/* <label>
                            <input
                              type="checkbox"
                              name="isCredit"
                              checked={Paytype.isCredit === "Yes"}
                              onChange={handlePayType}
                            />
                            Credit
                          </label> */}
                        </div>
                        {Paytype.isCash === "Yes" && (
                          <>
                            <div
                              className="EWDWDWDWDCC_0"
                              style={{
                                justifyContent: "center",
                                marginTop: "5px",
                              }}
                            >
                              <div className="clm-itm-stl">
                                <label>
                                  Payment Method <span>:</span>
                                </label>
                                <select
                                  name="Billpay_method"
                                  value={formAmount.Billpay_method}
                                  onChange={handleChange}
                                >
                                  <option value=''>Select</option>
                                  {Array.isArray(PaymentMode) && PaymentMode.filter((p) => p.status === 'Active').map((row, ind) => (
                                    <option key={ind} value={row.GradeName}>{row.GradeName}</option>
                                  ))}
                                </select>
                              </div>
                              {formAmount.Billpay_method === "Card" && (
                                <>
                                  <div className="clm-itm-stl">
                                    <label>
                                      Card Type <span>:</span>
                                    </label>
                                    <select
                                      name="CardType"
                                      value={formAmount.CardType}
                                      onChange={handleChange}
                                    >
                                      <option value="">Select</option>
                                      {["Debit", "Credit"].map((p, indx) => (
                                        <option key={indx} value={p}>
                                          {p}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="clm-itm-stl">
                                    <label>
                                      Card No <span>:</span>
                                    </label>
                                    <input
                                      type="number"
                                      onKeyDown={blockInvalidChar}
                                      name="CardNo"
                                      value={formAmount.CardNo}
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className="clm-itm-stl">
                                    <label>
                                      Transaction Id <span>:</span>
                                    </label>
                                    <input
                                      type="text"
                                      onKeyDown={blockInvalidChar}
                                      name="TransactionId"
                                      value={formAmount.TransactionId}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </>
                              )}
                              {formAmount.Billpay_method === "Cheque" && (
                                <>
                                  <div className="clm-itm-stl">
                                    <label>
                                      Cheque No <span>:</span>
                                    </label>
                                    <input
                                      type="number"
                                      onKeyDown={blockInvalidChar}
                                      name="ChequeNo"
                                      value={formAmount.ChequeNo}
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className="clm-itm-stl">
                                    <label>
                                      Bank Name <span>:</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="BankName"
                                      value={formAmount.BankName}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </>
                              )}
                              {formAmount.Billpay_method === "Card" && (
                                <>
                                  <div className="clm-itm-stl">
                                    <label>
                                      Transaction Fee <span>:</span>
                                    </label>
                                    <input
                                      type="number"
                                      name="transactionFee"
                                      value={formAmount.transactionFee || ""}
                                      onChange={handleChange}
                                      onKeyDown={blockInvalidChar}
                                    />
                                  </div>
                                </>
                              )}
                              {formAmount.Billpay_method === "UPI" && (
                                <>
                                  <div className="clm-itm-stl">
                                    <label>
                                      UPI Id <span>:</span>
                                    </label>
                                    <input
                                      type="text"
                                      onKeyDown={blockInvalidChar}
                                      name="upiid"
                                      value={formAmount.upiid}
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className="clm-itm-stl">
                                    <label>
                                      Transaction Id <span>:</span>
                                    </label>
                                    <input
                                      type="text"
                                      onKeyDown={blockInvalidChar}
                                      name="TransactionId"
                                      value={formAmount.TransactionId}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </>
                              )}
                              <div className="clm-itm-stl">
                                <label>
                                  Amount <span>:</span>
                                </label>
                                <input
                                  onKeyDown={blockInvalidChar}
                                  type="number"
                                  name="paidamount"
                                  value={formAmount.paidamount}
                                  onChange={handleChange}
                                // readOnly={Object.keys(OPConsultDetails).length !== 0}
                                />
                              </div>
                              <div className="clm-itm-stl">
                                <label>
                                  AdditionalAmount <span>:</span>
                                </label>
                                <input
                                  onKeyDown={blockInvalidChar}
                                  type="number"
                                  name="Additionalamount"
                                  value={formAmount.Additionalamount}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="Register_btn_con added_Register_btn_con">
                              <button
                                className="RegisterForm_1_btns added_RegisterForm_1_btns"
                                onClick={isEdit !== null ? handleUpdate : handleAdd}
                              >
                                {isEdit !== null ? "Update" : "Add"}
                              </button>
                            </div>

                            <div className="edwqw_c2">
                              <label>Amount in Words : </label>
                              <span
                                style={{
                                  color: "#808080b5",
                                  padding: "0px 0px 0px 5px",
                                }}
                              >
                                {NumberToWords(Paidedamt)}{" "}
                              </span>
                            </div>
                            <br />
                    
                            <br />
                          </>)
                        }
                      </div>
                    </div>

                    <div className="EWDWDWDWDCC_0 wdwdxsxwsw3ed">


                    


                      <br />
                      <br />
                      <div className="clm-itm-stl">
                        <label>Previous Dr Amount :</label>
                        <input value={PrevPaidAmount} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Current Dr Amount:</label>
                        <input value={CurrAmt} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Balance Amount:</label>
                        <input value={BalanceAmt} readOnly />
                      </div>



                      <div className="clm-itm-stl">
                        <label>Refund Amount :</label>
                        <input value={Refundedamt} readOnly />
                      </div>
                    </div>
                  </div>

                  <br />
                  <div>
                    {billAmount.length !== 0 && (
                      <div className="Selected-table-container444 DEWSDXWED">
                        <table className="selected-medicine-table222 EDWEDE">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Payment Type</th>
                              <th>Card Type</th>

                              <th>Cheque No</th>
                              <th>Bank Name</th>

                              <th>Amount</th>
                              <th>Additional Amount</th>
                              <th>Transaction Fee</th>
                              <th>Action </th>
                            </tr>
                          </thead>
                          <tbody>
                            {billAmount.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Billpay_method}</td>
                                <td>{row.CardType || "-"}</td>
                                <td>{row.ChequeNo || "-"}</td>
                                <td>{row.BankName || "-"}</td>
                                <td>{row.paidamount}</td>
                                <td>{row.Additionalamount}</td>
                                <td>{row.transactionFee}</td>
                                <td>
                                  <button onClick={() => handleEdit(index)}>
                                    <EditNoteIcon />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {isPrintButtonVisible && (
                  <div className="Register_btn_con added_Register_btn_con">
                    <select
                      className="print_option_bill"
                      name="printoption"
                      value={printoption}
                      onChange={(e) => setprintoption(e.target.value)} // Update state with selected value
                    >
                      {[
                        "Bill + Reciept",
                        "Bill",
                        "Reciept",
                      ].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option> // Correctly return option elements
                      ))}
                    </select>
                    {printoption === "PrintDetailed" ? (
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={() => handleSubmit()}
                      >
                        Print
                      </button>
                    ) : printoption === "Bill" ? (
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={() => handleSubmit(true)}
                      >
                        Print
                      </button>
                    ) : printoption === "PrintReimbuseable" ? (
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={() => handleSubmit(false, true)} // Pass a second parameter for "PrintReimbuseable"
                      >
                        Print
                      </button>
                    ) : (
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={() => handleSubmit(false, false, true)} // Pass a second parameter for "PrintReimbuseable"
                      >
                        Print
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        </>
      ) :  (
        <ForPrintReceiptData />
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default ConsultationbillrefundPage;



