import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";

import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { handleKeyDownPhoneNo } from "../../OtherComponent/OtherFunctions";

import { handleKeyDownTextRegistration } from "../../OtherComponent/OtherFunctions";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { useReactToPrint } from "react-to-print";
import DeleteIcon from "@mui/icons-material/Delete";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";


const AdvanceCollection = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  console.log("Registeredit", Registeredit);
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);

  const [PaymentMode, setPaymentMode] = useState([])
  const toast = useSelector((state) => state.userRecord?.toast);
  const [errors, setErrors] = useState({});

  const componentRef = useRef();
  const currentDate = new Date();
  const Formdate = format(currentDate, "yyyy-MM-dd");

  // For Lab

  const [Billing_date, setBilling_date] = useState(new Date());
  useEffect(() => {
    axios.get(`${UrlLink}Masters/PaymentMode_Master_link`)
      .then((res) => {
        const ress = res.data
        console.log('1111111', ress);

        setPaymentMode(Array.isArray(ress) ? ress : []);
      })
      .catch((e) => {
        console.log(e);
      })

  }, [UrlLink,])





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
    PatientId: "",
    PatientName: "",
    PhoneNumber: "",
    PatientCategory: "General",
    PatientCategoryType: "",
    InsuranceName: "",
    Gender: "",
    Age: "",
    City: "",
    State: "",
    PatientAddress: "",
    Pincode: "",
    VisitId: "",
    WardName: "",
    AdmissionDate: "",
    IPno: ""
  });


  const [PostInvoice, setPostInvoice] = useState(null);

  const [SelectDatalist, setSelectDatalist] = useState([]);
  console.log("SelectDatalist", SelectDatalist)

  const totalAmount = SelectDatalist.reduce((sum, item) => sum + (item.Amount || 0), 0);

  const [billAmount, setBillAmount] = useState([]);
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);

  const [Uptateitem, setUptateitem] = useState(false);


  const [formAmount, setFormAmount] = useState({
    Billpay_method: "",
    CardType: "",
    CardNo: "",
    upiid: "",
    TransactionId: "",
    ChequeNo: "",
    BankName: "",
    transactionFee: "",
  });


  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  const [isEdit, setIsEdit] = useState(null);

  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);

  // const [patientsearchoption, setpatientsearchoption] = useState("PatientID");
  const [patientsearch, setpatientsearch] = useState({
    Search: "",
  });

  const [Patientdept, setPatientdept] = useState("");

  console.log(Patientdept, 'Patientdept')



  useEffect(() => {
    const registertype = FilterbyPatientId.find((e) => e.RegistrationId === patientsearch.Search);

    if (registertype) {
      setPatientdept(registertype);
    } else {
      setPatientdept(null);
    }
  }, [patientsearch.Search]);







  console.log("patientsearch", patientsearch)
  const [SmartCard, setSmartCard] = useState({
    SmartCardNo: "",
  });
  const [isClient, setisClient] = useState({
    isClient: "No",
    CoPaymentType: "Percentage",
    CoPaymentTypeinp: "",
    CoPaymentLogic: "PreAuth",
    CoPaymentdeducted: "PreAuth",
    PreAuthType: "Percentage",
    PreAuthTypeinp: "",
    PreAuthAmount: "",
    PreAuthApprovalNo: "",
    PolicyNo: "",
    PolicyStartDate: "",
    PolicyEndDate: "",
  });

  const [AdvanceAmount, setAdvanceAmount] = useState({
    isAdvance: "No",
    AdvanceAmount: "",
    AdvancePurpose: "",
    AdvanceServiceRemark: ""
  });
  const [AdvanceAmountGet, setAdvanceAmountGet] = useState([]);
  const [AdvanceTotal, setAdvanceTotal] = useState([]);
  const [AdvanceRegistrationId, setAdvanceRegistrationId] = useState([]);
  const [RemainingCredit, setRemainingCredit] = useState([]);
  console.log("Advancetotallll", AdvanceTotal);
  console.log("RemainingCredittt", RemainingCredit);


  const [ServiceProcedureForm, setServiceProcedureForm] =
    useState("Consultation");
  const [ServiceProcedureData, setServiceProcedureData] = useState([]);
  const [ServiceProcedureDataGet, setServiceProcedureDataGet] = useState([]);
  const [Consultation, setConsultation] = useState({
    PhysicianType: "",
    Physician: "",
    Service: "",
    Procedure: "",
    DrugName: "",
    LabTest: "",
    RadiologyDept: "",
    RadiologyTest: "",
    SubTestName: "",
    Rate: "",
    Quantity: "",
    Charges: "",
    Amount: "",
    DiscountType: "",
    Discount: "",
    GST: "",
    GSTamount: "",
    Total: "",
    DiscountAmount: "",
  });


  const [printoption, setprintoption] = useState("PrintDetailed");
  const [RegisterData, setRegisterData] = useState({
    PatientId: "",
    ABHA: "",
    PatientName: "",
    AgeGender: "",
    PhoneNo: "",
    PatientCategory: "",
    Address: "",
  });
  console.log("RegisterData", RegisterData);
  const [SelectItemState, setSelectItemState] = useState({

    SelectItemName: "",


  });
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        console.log('clinccccc', clinicData);

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
          // if (clinicData.Clinic_Logo) {
          //   setClinic_Logo(`data:image/png;base64,${clinicData.Clinic_Logo}`);
          // }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [UserData?.location, UrlLink]);

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };



  useEffect(() => {
    if (Object.keys(Registeredit).length === 0) {
      const postdata = {
        PatientId: RegisterData.PatientId,
        PhoneNo: RegisterData.PhoneNo,
        FirstName: RegisterData.FirstName,
        DoctorId: RegisterData.DoctorName,
      };
      console.log("PosttttDDDD", postdata);

      axios
        .get(`${UrlLink}Frontoffice/Filter_IP_Patient_by_Multiple_Criteria_Advance`, {
          params: postdata,
        })
        .then((res) => {
          const data = res.data;
          console.log(" ", data);

          setFilterbyPatientId(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink]);

  ;







  const HandlesearchPatient = (value) => {
    console.log("Searching for:", value);

    // Find matching patient by RegistrationId, PatientId, PhoneNo, or FirstName
    const matchedPatient =
      FilterbyPatientId.find((f) => f.RegistrationId == value) ||
      FilterbyPatientId.find((f) => f.PatientId === value) ||
      FilterbyPatientId.find((f) => f.PhoneNo === value) ||
      FilterbyPatientId.find((f) => f.FirstName.toLowerCase() === value.toLowerCase());

    console.log("Matched Patient:", matchedPatient);

    // If no match, show a warning
    if (!matchedPatient) {
      const tdata = {
        message: `Please enter a valid Patient ID, Phone Number, or Name`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return; // Stop further execution if no valid patient is found
    }

    // Extract the correct RegistrationId from the matched patient
    const { RegistrationId } = matchedPatient;
    console.log("RegistrationId", RegistrationId)

    // Fetch patient details using the correct RegistrationId
    axios
      .get(`${UrlLink}Frontoffice/get_IP_Patient_Details_by_patientId_Advance?Registerid=${RegistrationId}`)
      .then((res) => {
        console.log("Patient Details:", res.data);

        // Extract response data
        const {
          PatientId,
          PatientName,
          PhoneNo,
          AgeGender,
          Address,
          PatientCategory,
          WardName,
          AdmissionDate,
          Ipno,
          ...otherDetails
        } = res.data;

        // Update state with patient details
        setRegisterData((prev) => ({
          ...prev,
          PatientId: PatientId || "",
          PatientName: PatientName || "",
          AgeGender: AgeGender || "",
          PhoneNo: PhoneNo || "",
          PatientCategory: PatientCategory || "",
          Address: Address || "",
        }));

        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: PatientId || "",
          PatientName: PatientName || "",
          AgeGender: AgeGender || "",
          PhoneNumber: PhoneNo || "",
          PatientCategory: PatientCategory || "",
          Address: Address || "",
          WardName: WardName || "",
          AdmissionDate: AdmissionDate || "",
          IPno: Ipno || "",
        }));

        setAdvanceRegistrationId((prev) => ({
          ...prev,
          RegistrationId: RegistrationId || "",
        }));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (patientsearch.Search !== "") {
      const requestUrl = `${UrlLink}Frontoffice/get_IP_Patient_Details_by_patientId_Advance?Registerid=${patientsearch.Search}`;
      console.log("API Request:", requestUrl);

      axios
        .get(requestUrl)
        .then((res) => {
          console.log("API Response:", res.data);

          if (!res.data) {
            console.error("Error: API response is empty or undefined!");
            return;
          }

          const {
            PatientProfile,
            PatientId,
            ABHA,
            AliasName,
            PatientName,
            PhoneNo,
            Address,
            AgeGender,
            PatientCategory,
            RegistrationId,
            WardName,
            AdmissionDate,
            Ipno,
            ...resss
          } = res.data;

          setRegisterData((prev) => ({
            ...prev,
            PatientId: PatientId || "",
            ABHA: "64-9456-6541-8451",
            PatientName: PatientName || "",
            AgeGender: AgeGender || "",
            PhoneNo: PhoneNo || "",
            PatientCategory: PatientCategory || "",
            Address: Address || "",

          }));

          setSelectedPatient_list((prev) => ({
            ...prev,
            PatientId: PatientId || "",
            ABHA: "64-9456-6541-8451",
            PatientName: PatientName || "",
            Gender: resss.Gender || "",
            Age: resss.Age || "",
            AgeGender: AgeGender || "",
            PhoneNumber: PhoneNo || "",
            PatientCategory: PatientCategory || "",
            Address: Address || "",
            WardName: WardName || "",
            AdmissionDate: AdmissionDate || "",
            IPno: Ipno || "",

          }));

          setSmartCard((prev) => ({
            ...prev,
            SmartCardNo: PatientId || "",
          }));

          setAdvanceRegistrationId((prev) => ({
            ...prev,
            RegistrationId: RegistrationId || "",
          }));
        })
        .catch((err) => console.error("API Error:", err));
    }
    else {
      setRegisterData((prev) => ({
        ...prev,
        PatientId: "",
        ABHA: "",
        PatientName: "",
        AgeGender: "",
        PhoneNo: "",
        PatientCategory: "",
        Address: "",

      }));
    }
  }, [UrlLink, patientsearch.Search]);



  const HandleSearchchange = (e) => {
    const { name, value } = e.target;
    setpatientsearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${UrlLink}Frontoffice/IP_AdvanceAmount_collection?RegistrationId=${AdvanceRegistrationId.RegistrationId}`
  //     )
  //     .then((ress) => {
  //       const res = ress?.data;
  //       console.log("advvvvv", res);
  //       setAdvanceAmountGet(res?.AdvanceDetails);
  //       setAdvanceTotal(res?.TotalAdvanceAmount);
  //       setRemainingCredit(res?.RemainingCredit);
  //     })
  //     .catch((e) => console.log(e));
  // }, [UrlLink, AdvanceAmount.isAdvance, AdvanceRegistrationId]);

  const Advancecolumns = [
    {
      key: "AdvanceAmount",
      name: "Amount",
    },
    {
      key: "AdvancePurpose",
      name: "AdvancePurpose",
    },
    {
      key: "Date",
      name: "Date",
    },
    {
      key: "Time",
      name: "Time",
    },
    {
      key: "ReceivedBy",
      name: "Recieved By",
    },
  ];







  const gridRef = useRef(null);

  const cleardata = () => {
    setRegisterData({
      PatientId: "",
      Title: "",
      FirstName: "",
      MiddleName: "",
      SurName: "",
      Gender: "",
      DOB: "",
      Age: "",
      Email: "",
      PhoneNo: "",
      BloodGroup: "",
      Occupation: "",
      Religion: "",
      Nationality: "",
      UniqueIdType: "",
      UniqueIdNo: "",
      CaseSheetNo: "",

      VisitPurpose: "",

      Complaint: "",
      PatientType: "General",
      PatientCategory: "General",

      DoorNo: "",
      Street: "",
      Area: "",
      City: "",
      State: "",
      Country: "",
      Pincode: "",
    });
    setpatientsearch({
      Search: "",
    });
    setisClient({
      isClient: "No",
      CoPaymentType: "Percentage",
      CoPaymentTypeinp: "",
      CoPaymentLogic: "PreAuth",
      CoPaymentdeducted: "PreAuth",
      PreAuthType: "Percentage",
      PreAuthTypeinp: "",
      PreAuthAmount: "",
      PreAuthApprovalNo: "",
      PolicyNo: "",
      PolicyStartDate: "",
      PolicyEndDate: "",
    });
    setSmartCard({
      SmartCardNo: "",
    });
    setConsultation({
      PhysicianType: "",
      Physician: "",
      Service: "",
      Procedure: "",
      DrugName: "",
      LabTest: "",
      RadiologyDept: "",
      RadiologyTest: "",
      SubTestName: "",
      Rate: "",
      Quantity: "",
      Charges: "",
      Amount: "",
      DiscountType: "",
      Discount: "",
      GST: "",
      GSTamount: "",
      Total: "",
      DiscountAmount: "",
    });
    setServiceProcedureForm("Consultation");
    setErrors({});
  };




  const Additemstobillfun = () => {
    if (
      AdvanceAmount.AdvanceAmount !== 0 &&
      AdvanceAmount.AdvancePurpose !== ""
    ) {
      // Prepare the item data to add to the bill
      const listdata = {
        Amount: parseFloat(AdvanceAmount.AdvanceAmount) || 0,
        AdvancePurpose: AdvanceAmount.AdvancePurpose,
        AdvanceServiceRemark:
          AdvanceAmount.AdvancePurpose === "Services"
            ? AdvanceAmount.AdvanceServiceRemark
            : "",
      };

      console.log("Adding item:", listdata);

      // Check for required fields for the payment method
      let req = [];
      if (formAmount.Billpay_method.toLocaleLowerCase() === "card") {
        req = ["Billpay_method", "CardType"];
      } else if (formAmount.Billpay_method.toLowerCase() === "cheque") {
        req = ["Billpay_method", "ChequeNo", "BankName"];
      } else if (formAmount.Billpay_method.toLocaleLowerCase() === "onlinepayment") {
        req = ["Billpay_method"];
      } else {
        req = ["Billpay_method"];
      }

      // Validate missing fields
      const missing = req.filter((row) => !formAmount[row]);

      if (missing.length === 0) {
        // Check if the payment method already exists in the list
        const exist = SelectDatalist.find(
          (p) => p.Billpay_method === formAmount.Billpay_method
        );


        // Merge both advance details and payment details into one array
        const combinedData = {
          S_No: SelectDatalist.length + 1,
          ...listdata,
          ...formAmount
        };

        // Update the SelectDatalist with the combined data
        setSelectDatalist((prev) => [...prev, combinedData]);

        // Clear input fields after adding
        setAdvanceAmount({
          AdvanceAmount: "",
          AdvancePurpose: "",
          AdvanceServiceRemark: "",
        });

        setFormAmount({
          Billpay_method: "",
          CardType: "",
          ChequeNo: "",
          BankName: "",
          paidamount: "",
          Additionalamount: "",
          transactionFee: "",
        });

      } else {
        // Show alert for missing required fields
        alert(`Enter the required fields: ${missing.join(", ")}`);
      }
    } else {
      // Show toast message if required fields are missing
      const tdata = {
        message: "Please fill Advance Amount and Advance Purpose",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const Updateitems = () => {
    if (AdvanceAmount.AdvanceAmount !== 0 && AdvanceAmount.AdvancePurpose) {
      // Check if the same Advance Purpose already exists in the list
      const Checktest = SelectDatalist.some(
        (ele) =>
          ele.AdvancePurpose === AdvanceAmount.AdvancePurpose &&
          ele.S_No !== SelectItemState.S_No // Ensure it's not the same item
      );

      if (Checktest) {
        const tdata = {
          message: "Advance Amount for this purpose already exists",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        // Prepare the updated item object
        const updatedItem = {
          ServiceType: "AdvanceAmount",
          SelectItemName: "Advance Amount",
          Amount: parseFloat(AdvanceAmount.AdvanceAmount) || 0,
          AdvancePurpose: AdvanceAmount.AdvancePurpose,
          AdvanceServiceRemark:
            AdvanceAmount.AdvancePurpose === "Services"
              ? AdvanceAmount.AdvanceServiceRemark
              : "", // Include remark only for "Services"
        };

        // Update the SelectDatalist by replacing the relevant item
        setSelectDatalist((prev) =>
          prev.map((item) =>
            item.S_No === SelectItemState.S_No ? { ...item, ...updatedItem } : item
          )
        );

        // Clear the form and reset update state
        cleardata();
        setUptateitem(false);
      }
    } else {
      const tdata = {
        message: "Please fill Advance Amount and Advance Purpose",
        type: "error",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };




  const deletebillingitem = (row) => {
    const S_No = row.S_No;

    let Temp_delarr = SelectDatalist.filter((ele) => ele.S_No !== S_No);
    setSelectDatalist(
      Temp_delarr.map((item, index) => ({ ...item, S_No: index + 1 }))
    );
  };


  const handleChange = (e) => {
    const { name, value } = e.target;



    if (name === "Billpay_method") {
      setFormAmount((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      return; // Stop further execution
    }

    const billMethod = formAmount.Billpay_method.toLowerCase();

    if (billMethod === "card") {
      if (name === "CardNo" && value.length < 5) {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value,
          upiid: "",
          TransactionId: "",
          ChequeNo: "",
          BankName: "",
        }));
      } else if (["CardType", "transactionFee"].includes(name)) {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value,
          upiid: "",
          TransactionId: "",
          ChequeNo: "",
          BankName: "",
        }));
      }
    } else if (billMethod === "onlinepayment") {
      if (["upiid", "TransactionId"].includes(name)) {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value,
          ChequeNo: "",
          BankName: "",
          CardType: "",
          CardNo: "",
          transactionFee: "",
        }));
      }
    } else if (billMethod === "cheque") {
      if (["ChequeNo", "BankName"].includes(name)) {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value,
          CardType: "",
          CardNo: "",
          transactionFee: "",
          upiid: "",
          TransactionId: "",
        }));
      }
    } else if (billMethod === "cash") {
      setFormAmount((prevState) => ({
        ...prevState,
        [name]: value,
        ChequeNo: "",
        BankName: "",
        CardType: "",
        CardNo: "",
        transactionFee: "",
        upiid: "",
        TransactionId: "",
      }));
    } else {
      setFormAmount((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };






  // Automatically update ServiceProcedureForm when AppointmentRegisType changes
  useEffect(() => {
    if (
      RegisterData.PatientCategory === "Insurance" ||
      RegisterData.PatientCategory === "Client"
    ) {
      axios
        .get(
          `${UrlLink}Frontoffice/get_client_insurance_details?PatientId=${patientsearch.Search}`
        )
        .then((response) => {
          const res = response.data;
          console.log("ccccllliii", res);
          // Destructure the response data
          const {
            isClient,
            CoPaymentType,
            CoPaymentTypeinp,
            CoPaymentLogic,
            CoPaymentdeducted,
            PreAuthType,
            PreAuthTypeinp,
            PreAuthAmount,
            PreAuthApprovalNo,
            PolicyNo,
            PolicyStartDate,
            PolicyEndDate,
          } = res;

          // Update the state for isClient
          setisClient((prev) => ({
            ...prev,
            isClient: isClient,
            CoPaymentType,
            CoPaymentTypeinp,
            CoPaymentLogic,
            CoPaymentdeducted,
            PreAuthType,
            PreAuthTypeinp,
            PreAuthAmount,
            PreAuthApprovalNo,
            PolicyNo,
            PolicyStartDate,
            PolicyEndDate,
          }));
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setisClient((prev) => ({
        ...prev,
        isClient: "No",
        CoPaymentType: "Percentage",
        CoPaymentTypeinp: "",
        CoPaymentLogic: "PreAuth",
        CoPaymentdeducted: "PreAuth",
        PreAuthType: "Percentage",
        PreAuthTypeinp: "",
        PreAuthAmount: "",
        PreAuthApprovalNo: "",
        PolicyNo: "",
        PolicyStartDate: "",
        PolicyEndDate: "",
      }));
    }
  }, [UrlLink, patientsearch.Search, RegisterData.PatientCategory]);






  const handleSubmit = () => {
    let requiredfields1 = ["PatientId", "PatientName", "PhoneNo", "AgeGender"];
    let missingFields = requiredfields1.filter((field) => !RegisterData[field]);
    let errorMessages = [];

    // Check for missing required fields
    if (missingFields.length > 0) {
      errorMessages.push(
        `Please fill the required fields: ${missingFields.join(", ")}`
      );
    }

    // Check if Item Details are empty
    if (SelectDatalist.length === 0) {
      errorMessages.push("Please fill the Advance Details.");
    }


    // If there are any errors, show them all in one alert
    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return; // Exit the function to avoid proceeding further
    }

    const postdata = {
      RegistrationId: AdvanceRegistrationId.RegistrationId,
      Created_by: UserData?.username,
      SelectDatalist: SelectDatalist || [],
      Location: UserData?.location,
      Patientdept: Patientdept,
      totalAmount: totalAmount,
    };
    console.log("postdata", postdata);
    axios
      .post(`${UrlLink}Frontoffice/IP_AdvanceAmount_collection`, postdata)
      .then((resp) => {
        const res = resp.data;
        console.log(res);
        setPostInvoice(res.InvoiceNo);
        // setSelectDatalist([]);
        setIsPrintButtonVisible(false);
        setAdvanceAmount({
          isAdvance: "No",
          AdvanceAmount: "",
          AdvancePurpose: "",
          AdvanceServiceRemark: ""
        });

      })
      .catch((e) => console.log(e));

  };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: async () => {
      navigate("/Home/AdvanceCollectionList");
    },
  });

  const handleClose = () => {
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "AdvanceCollectionList" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  }

  const ForPrintData = () => {
    const hasCard = SelectDatalist.some((p) => p.Billpay_method === 'Card');
    const hasCheque = SelectDatalist.some((p) => p.Billpay_method === 'Cheque');
    const hasBank = SelectDatalist.some((p) => p.Billpay_method === 'Bank');

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
                      <span style={{ fontWeight: "bold" }}>{ClinicDetails?.Cname}</span>
                      <div>
                        <span>{[ClinicDetials.ClinicAddress].filter((detail) => detail).join(", ")}{[ClinicDetials.ClinicCity, ClinicDetials.ClinicState, ClinicDetials.ClinicCode].filter((detail) => detail).join(", ")}</span>
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
                  Billing Invoice
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
                          WardName/Bed No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.WardName}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.IPno}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          GST No <span>:</span>
                        </label>
                        <h4>{ClinicDetials.ClinicGST}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          payer Type <span>:</span>
                        </label>

                        <h4>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
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

                        <th style={{ border: "none" }}>Amount</th>

                      </tr>
                    </thead>
                    <tbody
                      style={{
                        borderBottom: "1.5px solid black",
                        padding: "2px",
                      }}
                    >
                      {SelectDatalist.map((row, index) => (
                        <React.Fragment key={index}>
                          {/* Render the Service Type in a single row */}
                          {index === 0 ||
                            SelectDatalist[index - 1].ServiceType !==
                            row.ServiceType ? (
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
                                {row.ServiceType}
                              </td>
                              <td colSpan="3" style={{ border: "none" }}></td>
                            </tr>
                          ) : null}

                          {/* Render the Service Name and details in the next row */}
                          <tr>
                            <td style={{ paddingLeft: "20px", border: "none" }}>
                              {row.AdvancePurpose}
                            </td>

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
                                  <td>{row.Amount || '-'}</td>
                                  {/* <td>{row.AdditionalAmount || '-'}</td> */}
                                  {hasCard && <td>{`${parseInt(row.transactionFee)}%` || '-'}</td>}
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
                          <span>{UserData?.Employeename}</span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>Signature <span>:</span></label>
                          <span></span>
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


            {/* <tfoot className="print_footerr">
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
            </tfoot> */}
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
      {isPrintButtonVisible ? (
        <>
          <div className="Main_container_app">
            <h3>Patient Details</h3>
            <br />


            <div className="csdcedw_kl88">
              <div className="RegisBillSearchForm_1 RegisBillSearchForm_1_mmmm">
                <label>
                  Search <span>:</span>
                </label>
                <div className="Search_patient_icons">
                  <input
                    type="text"
                    onChange={(e) => HandleSearchchange(e)}
                    list="Search_iddd"
                    autoComplete="off"
                    name="Search"
                    pattern="[\dA-Za-z\s]+" // Allow numbers, letters, and spaces
                    className={
                      errors["Search"] === "Invalid"
                        ? "invalid"
                        : errors["Search"] === "Valid"
                          ? "valid"
                          : ""
                    }
                    value={patientsearch.Search}
                  />

                  {/* Datalist for autocomplete */}
                  <datalist id="Search_iddd">
                    {FilterbyPatientId &&
                      FilterbyPatientId.length > 0 &&
                      FilterbyPatientId.map((row, indx) => (
                        <option key={indx} value={row.RegistrationId}>
                          {`${row.RegistrationId} | ${row.PatientId} | ${row.FirstName} | ${row.PhoneNo} | ${row.Department}`}
                        </option>
                      ))}
                  </datalist>

                  {/* Search Icon with onClick event */}
                  {patientsearch.Search && (
                    <span onClick={() => HandlesearchPatient(patientsearch.Search)}>
                      <PersonSearchIcon />
                    </span>
                  )}
                </div>
              </div>
            </div>



            <div className="RegisBillFormcon" ref={gridRef}>
              {RegisterData &&
                Object.keys(RegisterData).map((field, index) => (
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

                      />
                    ) : (
                      field === "Address" && (
                        <textarea name="Address" value={RegisterData[field]} />
                      )
                    )}
                  </div>
                ))}
            </div>

            <h3>Advance Details</h3>
            <br />

            <div className="new-patient-registration-form">
              <div className="RegisBillFormcon">
                <div className="Service_bill">

                  <div className="RegisBillForm_1">
                    <label htmlFor="Amount">
                      Advance Amount<span>:</span>
                    </label>
                    <input
                      type="number"
                      name="Amount"
                      value={AdvanceAmount.AdvanceAmount}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                      }
                      autoComplete="off"
                      onChange={(e) => {
                        setAdvanceAmount((prev) => ({
                          ...prev,
                          AdvanceAmount: e.target.value,
                          AdvancePurpose: "",
                          AdvanceServiceRemark: "",

                        }));
                      }}
                    />
                  </div>

                  <div className="RegisBillForm_1">
                    <label htmlFor="AdvancePurpose">
                      Advance Purpose<span>:</span>
                    </label>
                    <select
                      name="AdvancePurpose"
                      value={AdvanceAmount.AdvancePurpose}
                      onChange={(e) => {
                        setAdvanceAmount((prev) => ({
                          ...prev,
                          AdvancePurpose: e.target.value,
                        }));
                      }}
                    >
                      <option value="">Select</option>
                      <option value="General">General</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Lab">Lab</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Services">Services</option>
                    </select>
                  </div>
                  {AdvanceAmount.AdvancePurpose === "Services" && (
                    <div className="RegisBillForm_1">
                      <label htmlFor="AdvanceRemark">
                        Services Remark<span>:</span>
                      </label>
                      <input
                        type="text"
                        name="AdvanceServiceRemark"
                        value={AdvanceAmount.AdvanceServiceRemark}
                        onChange={(e) =>
                          setAdvanceAmount((prev) => ({
                            ...prev,
                            AdvanceServiceRemark: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="RegisBillForm_1">
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

                  {formAmount.Billpay_method.toLowerCase() === "card" && (
                    <>
                      <div className="RegisBillForm_1">
                        <label>
                          Card Type <span>:</span>
                        </label>
                        <select name="CardType" value={formAmount.CardType || ""} onChange={handleChange}>
                          <option value="">Select</option>
                          {["Debit", "Credit"].map((p, indx) => (
                            <option key={indx} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="RegisBillForm_1">
                        <label>
                          Card No <span>:</span>
                        </label>
                        <input
                          type="number"
                          onKeyDown={blockInvalidChar}
                          name="CardNo"
                          value={formAmount.CardNo || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="RegisBillForm_1">
                        <label>
                          Transaction Fee <span>:</span>
                        </label>
                        <input
                          type="number"
                          onKeyDown={blockInvalidChar}
                          name="transactionFee"
                          value={formAmount.transactionFee || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  {formAmount.Billpay_method.toLowerCase() === "cheque" && (
                    <>
                      <div className="RegisBillForm_1">
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
                      <div className="RegisBillForm_1">
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

                  {formAmount.Billpay_method.toLowerCase() === "onlinepayment" && (
                    <>
                      <div className="RegisBillForm_1">
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
                      <div className="RegisBillForm_1">
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



                </div>
                <div className="Register_btn_con">
                  <button
                    className="RegisterForm_1_btns"
                    onClick={Uptateitem ? Updateitems : Additemstobillfun}
                  >
                    {Uptateitem ? "Update" : "Add"}
                  </button>
                </div>
              </div>


              {Array.isArray(AdvanceAmountGet) && AdvanceAmountGet.length !== 0 && (
                <ReactGrid
                  columns={Advancecolumns}
                  RowData={AdvanceAmountGet}
                />
              )}
            </div>

            <div className="new-patient-registration-form">
              <div className="Selected-table-container444 DEWSDXWED">
                {SelectDatalist.length > 0 && (
                  <table className="selected-medicine-table222 EDWEDE">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Advance Purpose</th>
                        <th>Advance Remark</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SelectDatalist.map((row, index) => {
                        return (
                          <tr key={index}>
                            <td>{row.S_No}</td>
                            <td>{row.AdvancePurpose}</td>
                            <td>{row.AdvanceServiceRemark || "No Remark"}</td>
                            <td>{row.Amount || "-"}</td>
                            <td>
                              <button
                                className="delnamebtn"
                                onClick={() => {
                                  deletebillingitem(row);
                                }}
                              >
                                <DeleteIcon />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>)}
              </div>

              <div className="">
                <br />


                <br />

                {isPrintButtonVisible && (
                  <div className="Register_btn_con added_Register_btn_con">
                    <button
                      className="RegisterForm_1_btns added_RegisterForm_1_btns"
                      onClick={() => handleSubmit()}
                    >
                      Print
                    </button>
                  </div>
                )}
              </div>
            </div>

            <ToastAlert Message={toast.message} Type={toast.type} />
          </div>
        </>
      ) : (
        <ForPrintData />
      )}
    </>
  );
};

export default AdvanceCollection;
