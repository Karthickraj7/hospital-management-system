import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";
// import Clinic_Logo from "../../Assets/logo.png";
import Chirayuulogo from "../../Assets/Chirayuulogo.png";

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

const QuickBillingApprovedRefundCashier = () => {

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
  console.log("Oppppppp", OP_BillingData);

  const componentRef = useRef();
  const currentDate = new Date();
  const Formdate = format(currentDate, "yyyy-MM-dd");


  // For Lab 
  const [franchaisename, setFranchaisename] = useState("Basic");
  const [franchaise, setfranchaises] = useState([]);
  const [franchaisecolumnname, setfranchaisecolumnname] = useState("Basic")
  const [Department, setDepartment] = useState([])
  const [testType, setTestType] = useState("Individual");

  useEffect(() => {
    console.log(OP_BillingData?.ServiceProcedureForm);

    if (OP_BillingData?.ServiceProcedureForm === 'Lab') {
      axios
        .get(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=RateCardMaster`)
        .then((response) => {
          console.log(response);
          setfranchaises(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .get(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`)
        .then((response) => {
          console.log(response);
          setDepartment(response.data);
        })
        .catch((error) => {
          console.error("Error fetching SubDepartment data:", error);
        });

      // Fetch updated rate card amounts only when ratecard changes
      if (franchaisecolumnname !== "Basic") {
        axios
          .get(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=RateCardMasterList&ratecard=${franchaisecolumnname}`)
          .then((response) => {
            const responseData = response.data;

            const updatedSelectDatalist = SelectDatalist.map((item) => {
              if (item.type === "individual") {
                const matchedTest = responseData.find((data) => data.Test_Code_id === item.Test_Code);
                return matchedTest
                  ? {
                    ...item, Amount: matchedTest.Schemecost, Charges: matchedTest.Schemecost,
                    NetAmount: matchedTest?.Schemecost, Quantity: 1,
                  }
                  : item;
              } else if (item.type === "group") {
                const matchedGroup = responseData.find((data) => data.Group_Code_id === item.Group_Code);
                return matchedGroup
                  ? {
                    ...item, Amount: matchedGroup.Schemecost, Charges: matchedGroup.Schemecost,
                    NetAmount: matchedGroup?.Schemecost, Quantity: 1,
                  }
                  : item;
              }
              return item;
            });

            console.log("Updated SelectDatalist:", updatedSelectDatalist);
            setSelectDatalist(updatedSelectDatalist); // Update state properly
          })
          .catch((error) => {
            console.error("Error fetching RateCardMasterList:", error);
          });
      } else {
        setSelectDatalist(OP_BillingData?.ItemDetails)
      }
    }
  }, [UrlLink, franchaisecolumnname]); // Include franchaisecolumnname in the dependency array




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
    City: "",
    State: "",
    PatientAddress: "",
    Pincode: "",
    VisitId: "",
    Date: "",
    ReferalDoctor: "",
  });


  const [RadiologyNames, setRadiologyNames] = useState([]);
  const [RadioNames, setRadioNames] = useState([]);
  const [PostInvoice, setPostInvoice] = useState(null);
  const [RecieptInvoice, setRecieptInvoice] = useState(null);
  const [BillingData, setBillingData] = useState({
    InvoiceNo: "",
    InvoiceDate: Formdate,
    DoctorName: "",
    DoctorId: "",
  });
  const [SelectDatalist, setSelectDatalist] = useState([]);
  const [Reimbursable, setReimbursable] = useState(true);
  const [SelectDatalist1, setSelectDatalist1] = useState([]);
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
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const [isPrintSummary, setisPrintSummary] = useState(false);
  const [Doctorsnames, setDoctorsnames] = useState([]);
  const [Patient_list, setPatient_list] = useState([]);
  const [selectedOption, setSelectedOption] = useState("IPDServices");
  const [Uptateitem, setUptateitem] = useState(false);
  const [SelectItemState, setSelectItemState] = useState({
    ServiceType: "",
    Servicecode: "",
    SelectItemName: "",
    Rate: "",
    Charges: "",
    Amount: "",
    DiscountType: "",
    Discount: "",
    GST: "",
    Total: "",
    GSTamount: "",
    Quantity: "",
    DiscountAmount: "",
  });
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
  const [ServiceProcedure, setServiceProcedure] = useState({
    ServiceCategory: '',
    Categoryid: '',
    ServiceSubCategory: '',
    ServiceSubCatId: '',
    Subcategorypk: '',
    Rate: '',
    Quantity: "",
  });

  const [ServiceCategoryData, setServiceCategoryData] = useState([])
  const [ServiceSubCategoryData, setServiceSubCategoryData] = useState([])

  const [ServiceData, setServiceData] = useState([]);
  const [LabData, setLabData] = useState([]);

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const [totalPaidAmount, settotalPaidAmount] = useState(0);
  const [isEdit, setIsEdit] = useState(null);

  const [FilterbyPatientId, setFilterbyPatientId] = useState([]);

  // const [patientsearchoption, setpatientsearchoption] = useState("PatientID");
  const [patientsearch, setpatientsearch] = useState({
    Search: "",
  });
  const [AppointmentRegisType, setAppointmentRegisType] = useState(Object.keys(OP_BillingData).length !== 0 ? "OP" : "IP");
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
    isAdvance: 'No',
    AdvanceAmount: '',
  })
  const [AdvanceAmountGet, setAdvanceAmountGet] = useState([])
  const [AdvanceTotal, setAdvanceTotal] = useState([])
  const [RemainingCredit, setRemainingCredit] = useState([])
  console.log('Advancetotallll', AdvanceTotal);
  console.log('RemainingCredittt', RemainingCredit);

  const [Paytype, setPaytype] = useState({
    isCash: "Yes",
    isCredit: "No",
  });
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
  const [PhysicianData, setPhysicianData] = useState([]);
  const [SpecializationData, setSpecializationData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [DoctorRateData, setDoctorRateData] = useState([]);
  const [ReferralDoctorData, setReferralDoctorData] = useState([]);
  const [EmployeeData, setEmployeeData] = useState([]);
  const [DoctorIdData, setDoctorIdData] = useState([]);
  const [FlaggData, setFlaggData] = useState([]);
  const [ReligionData, setReligionData] = useState([]);
  const [AllDoctorData, setAllDoctorData] = useState([]);
  const [InsuranceData, setInsuranceData] = useState([]);
  const [ClientData, setClientData] = useState([]);
  const [DonationData, setDonationData] = useState([]);

  const [PaymentMode, setPaymentMode] = useState('')

  const [printoption, setprintoption] = useState("PrintDetailed");
  const [RegisterData, setRegisterData] = useState({
    PatientId: "",
    ABHA: "",
    PatientName: "",
    AgeGender: "",
    PhoneNo: "",
    PatientCategory: "",
    PatientCategoryName: "",
    Address: "",
  });
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
    const fetchData = async () => {
      try {
        const [
          specializationResponse,
          referralDoctorResponse,
          EmployeeResponse,
          DoctorResponse,
          FlaggData,
          ReligionData,
          AllDoctorData,
          Insurancedata,
          ClientData,
          DonationData,
        ] = await Promise.all([
          axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
          axios.get(`${UrlLink}Masters/get_referral_doctor_Name_Detials`),
          axios.get(`${UrlLink}Frontoffice/get_Employee_by_PatientCategory`),
          axios.get(`${UrlLink}Frontoffice/get_DoctorId_by_PatientCategory`),
          axios.get(`${UrlLink}Masters/Flagg_color_Detials_link`),
          axios.get(`${UrlLink}Masters/Relegion_Master_link`),
          axios.get(`${UrlLink}Masters/get_All_doctor_Name_Detials`),
          axios.get(`${UrlLink}Masters/get_insurance_data_registration`),
          axios.get(`${UrlLink}Masters/get_client_data_registration`),
          axios.get(`${UrlLink}Masters/get_donation_data_registration`),
        ]);

        console.log("spppeeecccc", specializationResponse);

        setSpecializationData(
          Array.isArray(specializationResponse.data)
            ? specializationResponse.data
            : []
        );
        setReferralDoctorData(
          Array.isArray(referralDoctorResponse.data)
            ? referralDoctorResponse.data
            : []
        );
        setEmployeeData(
          Array.isArray(EmployeeResponse.data) ? EmployeeResponse.data : []
        );
        setDoctorIdData(
          Array.isArray(DoctorResponse.data) ? DoctorResponse.data : []
        );
        setFlaggData(Array.isArray(FlaggData.data) ? FlaggData.data : []);
        setReligionData(
          Array.isArray(ReligionData.data) ? ReligionData.data : []
        );
        setAllDoctorData(
          Array.isArray(AllDoctorData.data) ? AllDoctorData.data : []
        );
        setInsuranceData(
          Array.isArray(Insurancedata.data) ? Insurancedata.data : []
        );
        setClientData(Array.isArray(ClientData.data) ? ClientData.data : []);
        setDonationData(
          Array.isArray(DonationData.data) ? DonationData.data : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [UrlLink]);

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
        .get(`${UrlLink}Frontoffice/Filter_Patient_by_Multiple_Criteria`, {
          params: postdata,
        })
        .then((res) => {
          const data = res.data;
          console.log("1222222", data);

          setFilterbyPatientId(data);
          // axios
          //   .get(`${UrlLink}Frontoffice/get_patient_visit_details`, {
          //     params: postdata,
          //   })
          //   .then((res) => {
          //     const visit = res.data?.VisitPurpose;
          //     console.log("Vissssss", res.data);

          //     setRegisterData((prev) => ({
          //       ...prev,
          //       VisitPurpose: visit,
          //     }));
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, AppointmentRegisType]);

  // Track previous totals
  const prevTotalsRef = useRef({
    totalNetAmount: 0,
    totalUnits: 0,
    totalDiscount: 0,
    totalGstamount: 0,
    totalAmount: 0,
  });

  // Recalculate totals when SelectDatalist or NetAmount_CDmethod changes
  useEffect(() => {
    let updatedTotals = {
      totalUnits: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalGstamount: 0,
      totalNetAmount: 0,
    };

    // Filter and iterate through SelectDatalist for items where isRefundable is "Yes"
    const refundableItems = SelectDatalist.filter((row) => row.isRefundable === 'Yes');
    refundableItems.forEach((item) => {
      updatedTotals.totalUnits += Number(item.Quantity) || 0;
      updatedTotals.totalAmount += parseFloat(item.Charges) || 0;
      updatedTotals.totalDiscount += parseFloat(item.Discount) || 0;
      updatedTotals.totalGstamount += parseFloat(item.GST) || 0;
      updatedTotals.totalNetAmount += parseFloat(item.NetAmount) || 0;
    });

    // Update state with calculated values
    setinitialState((prevState) => ({
      ...prevState,
      totalItems: refundableItems.length, // Count only refundable items
      totalUnits: updatedTotals.totalUnits,
      totalNetAmount: updatedTotals.totalNetAmount.toFixed(2),
      totalAmount: updatedTotals.totalNetAmount.toFixed(2),
      BalanceAmount: (updatedTotals.totalNetAmount).toFixed(2),
      Roundoff: (Math.round(updatedTotals.totalNetAmount) - updatedTotals.totalNetAmount).toFixed(2),
    }));

    // Update previous totals reference
    prevTotalsRef.current = { ...updatedTotals };

    // Log refundable items for debugging
    console.log('Refundable Items:', refundableItems);
  }, [SelectDatalist, NetAmount_CDmethod]);


  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
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

  useEffect(() => {
    const totalPaidAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.paidamount, 0);
    settotalPaidAmount(totalPaidAmount);

    const totalPaidAddAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce(
        (total, ele) => +total + +ele.paidamount + (+ele.Additionalamount || 0),
        0
      );

    const totalAdditionalAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.Additionalamount, 0);

    const totalTransactionFee = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.transactionFee || 0, 0); // Use `|| 0` to handle empty or undefined values.
    // Calculate the total transaction fee (as an absolute amount, not percentage)
    const totalTransactionAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce(
        (total, ele) =>
          total +
          ((+ele.paidamount + +ele.Additionalamount) *
            (+ele.transactionFee || 0)) /
          100, // Apply transaction fee proportionally
        0
      );

    const totalAmmm = totalPaidAddAmount + totalTransactionAmount;

    console.log("totalPaidAddAmount", totalPaidAddAmount);
    console.log("totalAdditionalAmount", totalAdditionalAmount);
    console.log("totalTransactionFee", totalTransactionFee);
    console.log("totalAmmm", totalAmmm);

    settotalPaidAmount(totalPaidAmount);
    setinitialState((prev) => ({
      ...prev,
      totalAmountt: totalAmmm.toFixed(2),
      BalanceAmount: (
        parseFloat(Math.round(prev.totalNetAmount)) -
        parseFloat(totalPaidAmount)
      ).toFixed(2),
      PaidAmount: totalPaidAmount.toFixed(2),
      Additionalamount: totalAdditionalAmount.toFixed(2),
      transactionfee: `${totalTransactionFee}%`,
    }));
  }, [billAmount, billAmount.length, isEdit]);

  const HandlesearchPatient = (value) => {

  };

  useEffect(() => {
    axios.get(`${UrlLink}Masters/services_Group_list_details`)
      .then((res) => {
        const ress = res.data
        console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

        setServiceCategoryData(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink]);

  const HandleSearchchange = (e) => {
    const { name, value } = e.target;
    const exist = FilterbyPatientId.find((f) => f.PatientId === value);
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      axios
        .get(
          `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${value}`
        )
        .then((res) => {
          const { PatientProfile, PatientId, ABHA, AliasName, PatientName, PhoneNo, Address, AgeGender, ...resss } = res.data;
          console.log("paaatttttttttt", res.data);

          setRegisterData((prev) => ({
            ...prev,
            PatientId: PatientId || "",
            ABHA: '64-9456-6541-8451',
            PatientName: PatientName || "",
            AgeGender: AgeGender || "",
            PhoneNo: PhoneNo || "",
            PatientCategory: 'General',
            Address: Address || "",
          }));
          setSmartCard((prev) => ({
            ...prev,
            SmartCardNo: PatientId || "",
          }));
          setpatientsearch((prev) => ({
            ...prev,
            [name]: value,
          }));
        })
        .catch((err) => console.log(err));
    }
  };

  const HandleOnchange = async (e) => {
    const { name, value, pattern } = e.target;

    const formattedValue = [
      "FirstName",
      "MiddleName",
      "SurName",
      "Occupation",
      "NextToKinName",
      "FamilyHeadName",
      "Street",
      "Area",
      "City",
      "State",
      "Country",
    ].includes(name)
      ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      : value;

    // Check length for specific fields
    if (
      [
        "InsuranceName",
        "ClientName",
        "FirstName",
        "MiddleName",
        "SurName",
        "Occupation",
        "NextToKinName",
        "FamilyHeadName",
        "Street",
        "Area",
        "City",
        "State",
        "Country",
        "UniqueIdNo",
      ].includes(name) &&
      value.length > 30
    ) {
      const tdata = {
        message: `${name} should not exceed 30 characters.`,
        type: "warn", // Ensure 'warn' is a valid type for your toast system
      };
      dispatchvalue({ type: "toast", value: tdata });
      return; // Exit early to prevent state update
    }

    if (name === "PatientId") {
      setRegisterData((prev) => ({
        ...prev,
        IsConsciousness: "Yes",
        [name]: value,
        PhoneNo: "",
        Title: "",
        FirstName: "",
        MiddleName: "",
        SurName: "",
        Gender: "",
        DOB: "",
        Age: "",
        Email: "",
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
      }));
    } else if (name === "PhoneNo" || name === "RelativePhoneNo") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");
        console.log(convert);

        if (convert.length <= 10) {
          setRegisterData((prev) => ({
            ...prev,
            [name]: convert[2].trim(),
            PatientId: convert[0].trim(),
            FirstName: convert[1].trim(),
          }));
        }
      } else {
        if (formattedValue.length <= 10) {
          setRegisterData((prev) => ({
            ...prev,
            [name]: formattedValue,
          }));
        }
      }
    } else if (name === "FirstName") {
      if (formattedValue.includes("|")) {
        const convert = formattedValue.split(" | ");

        setRegisterData((prev) => ({
          ...prev,
          [name]: convert[1].trim(),
          PatientId: convert[0].trim(),
          PhoneNo: convert[2].trim(),
        }));
      } else {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      }
    } else if (name === "Title") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
        Gender: ["Miss", "Ms", "Mrs"].includes(value)
          ? "Female"
          : ["Mr", "Master", "Baby"].includes(value)
            ? "Male"
            : "TransGender",
      }));
    } else if (name === "DOB") {
      const currentdate = new Date();
      // Calculate the minimum allowed date (100 years before current date)
      const minAllowedDate = subYears(currentdate, 100);
      const selectedDate = new Date(value);

      if (
        isBefore(minAllowedDate, selectedDate) &&
        isBefore(selectedDate, currentdate)
      ) {
        const age = differenceInYears(currentdate, selectedDate);

        setRegisterData((prevFormData) => ({
          ...prevFormData,
          [name]: formattedValue,
          Age: age,
        }));
      } else {
        setRegisterData((prevFormData) => ({
          ...prevFormData,
          [name]: formattedValue,
          Age: "",
        }));
      }
    } else if (name === "Age") {
      if (formattedValue) {
        if (!isNaN(formattedValue) && formattedValue.length <= 3) {
          // Get the current date
          const currentDate = new Date();

          // Calculate the year to subtract
          const targetYear = subYears(currentDate, formattedValue);

          // Create a date for January 1st of the target year
          const dob = startOfYear(targetYear);

          // Format the DOB
          const formattedDOB = format(dob, "yyyy-MM-dd");
          setRegisterData((prev) => ({
            ...prev,
            [name]: formattedValue,
            DOB: format(formattedDOB, "yyyy-MM-dd"),
          }));
        }
      } else {
        setRegisterData((prev) => ({
          ...prev,
          [name]: formattedValue,
          DOB: "",
        }));
      }
    } else if (name === "ReferredBy") {
      try {
        const response = await axios.get(
          `${UrlLink}Masters/get_route_details?DoctorId=${value}`
        );
        const route = response.data;

        if (route) {
          setRegisterData((prevState) => ({
            ...prevState,
            [name]: formattedValue,
            RouteNo: route.RouteNo,
            RouteName: route.RouteName,
            TehsilName: route.TehsilName,
            VillageName: route.VillageName,
          }));
        } else {
          setRegisterData((prevState) => ({
            ...prevState,
            [name]: formattedValue,
            RouteNo: "",
            RouteName: "",
            TehsilName: "",
            VillageName: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching route details:", error);
        setRegisterData((prevState) => ({
          ...prevState,
          [name]: formattedValue,
          RouteNo: "",
          RouteName: "",
          TehsilName: "",
          VillageName: "",
        }));
      }
    } else if (name === "Specialization") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
        DoctorName: "",
      }));
    } else if (name === "DoctorName") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      // Filter for the selected doctor based on the doctor_id
      const doctor_list = DoctorData.find(
        (doc) => doc.doctor_id === formattedValue
      );

      // Check if the doctor was found
      if (doctor_list) {
        const doctor_schedule = doctor_list.schedule?.[0]; // Access the first schedule in the doctor's schedule list
        console.log("RequestedSchedule", doctor_schedule);

        if (doctor_schedule?.working === "yes") {
          const currentTime = new Date();

          // Single Shift
          if (doctor_schedule?.shift === "Single") {
            const startTime = doctor_schedule.starting_time;
            const endTime = doctor_schedule.ending_time;

            // Convert schedule times to Date objects
            const startTimeDate = new Date(`1970-01-01T${startTime}Z`);
            const endTimeDate = new Date(`1970-01-01T${endTime}Z`);

            // Check if the current time is within the available time
            if (currentTime >= startTimeDate && currentTime <= endTimeDate) {
              const tdata = {
                message: `The Doctor is currently Available`,
                type: "success",
              };
              dispatchvalue({ type: "toast", value: tdata });
            } else {
              const tdata = {
                message: `The Doctor is not Available at this time, Available from ${startTime} to ${endTime}`,
                type: "warn",
              };
              dispatchvalue({ type: "toast", value: tdata });
            }
          }

          // Double Shift
          else if (doctor_schedule?.shift === "Double") {
            const startTime_f = doctor_schedule.starting_time_f;
            const endTime_f = doctor_schedule.ending_time_f;
            const startTime_a = doctor_schedule.starting_time_a;
            const endTime_a = doctor_schedule.ending_time_a;

            // Convert schedule times to Date objects
            const startTimeDate_f = new Date(`1970-01-01T${startTime_f}Z`);
            const endTimeDate_f = new Date(`1970-01-01T${endTime_f}Z`);
            const startTimeDate_a = new Date(`1970-01-01T${startTime_a}Z`);
            const endTimeDate_a = new Date(`1970-01-01T${endTime_a}Z`);

            // Check if the current time falls within either shift (forenoon or afternoon)
            if (
              (currentTime >= startTimeDate_f &&
                currentTime <= endTimeDate_f) ||
              (currentTime >= startTimeDate_a && currentTime <= endTimeDate_a)
            ) {
              const tdata = {
                message: `The Doctor is currently Available`,
                type: "success",
              };
              dispatchvalue({ type: "toast", value: tdata });
            } else {
              const tdata = {
                message: `The Doctor is not Available at this time, Available in FN: ${startTime_f} to ${endTime_f} or AN: ${startTime_a} to ${endTime_a}`,
                type: "warn",
              };
              dispatchvalue({ type: "toast", value: tdata });
            }
          }
        }
      } else {
        const tdata = {
          message: "Doctor not found",
          type: "error",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else if (name === "UniqueIdNo") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      axios
        .get(
          `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
        )
        .then((reponse) => {
          let data = reponse.data;
          console.log("ressss", data);
          if (data && data.error) {
            // Show a toast if the unique ID already exists
            const tdata = {
              message: data.error,
              type: "warn", // Assuming you want to show a warning toast
            };
            dispatchvalue({ type: "toast", value: tdata });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (name === "Pincode") {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      axios
        .get(
          `${UrlLink}Frontoffice/get_location_by_pincode?pincode=${formattedValue}`
        )
        .then((reponse) => {
          let data = reponse.data;
          console.log("ressss", data);
          if (formattedValue.length > 5) {
            const { country, state, city } = data;
            setRegisterData((prev) => ({
              ...prev,
              Country: country,
              State: state,
              City: city,
            }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setRegisterData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
    const validateField = (value, pattern) => {
      if (!value) {
        return "Required";
      }
      if (pattern && !new RegExp(pattern).test(value)) {
        return "Invalid";
      } else {
        return "Valid";
      }
    };

    const error = validateField(value, pattern);
    console.log(error, "error");

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };


  const HandleOnchangeService = (e) => {
    const { name, value } = e.target;
    if (name === 'ServiceCategory') {
      if (value.includes('-')) {
        const value1 = value.split('-')
        const value2 = value1[0];
        const value3 = value1[1];
        console.log('serrrrrr', value1, value2, value3);
        setServiceProcedure((prev) => ({
          ...prev,
          Categoryid: value2,
          [name]: value3,
        }))

        if (value2) {
          axios.get(`${UrlLink}Masters/services_Subcategory_details_by_category?ServiceCategory=${value2}`)
            .then((res) => {
              const ress = res.data
              console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

              setServiceSubCategoryData(ress)
            })
            .catch((err) => {
              console.log(err);
            })
        }
      }
      else {
        setServiceProcedure((prev) => ({
          ...prev,
          [name]: value,
          Categoryid: '',
          ServiceSubCategory: '',
          ServiceSubCatId: '',
          Subcategorypk: '',
          Rate: '',
          Quantity: "",
        }))
      }
    } else if (name === 'ServiceSubCategory') {
      const value1 = value.split('-');
      if (value1.length === 3) {
        const subcategorypk = value1[0];
        const subCategoryid = value1[1];
        const subCategoryname = value1[2];
        setServiceProcedure((prev) => ({
          ...prev,
          ServiceSubCatId: subCategoryid,
          [name]: subCategoryname,
          Subcategorypk: subcategorypk,
        }));
      } else if (value1.length === 2) {
        const subcategorypk = value1[0];
        const subCategoryname = value1[1];
        setServiceProcedure((prev) => ({
          ...prev,
          Subcategorypk: subcategorypk,
          [name]: subCategoryname,
        }));
      } else if (value1.length === 4) {
        const subcategorypk = value1[0];
        const roomno = value1[1];
        const bedno = value1[2];
        const Wardname = value1[3];
        const subCategoryname = roomno + bedno + Wardname;
        setServiceProcedure((prev) => ({
          ...prev,
          Subcategorypk: subcategorypk,
          [name]: subCategoryname,
        }));
      } else {
        setServiceProcedure((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
    else {
      setServiceProcedure((prev) => ({
        ...prev,
        [name]: value,
        Categoryid: '',
        ServiceSubCatId: '',
        Subcategorypk: '',
      }));
    }
  }



  useEffect(() => {
    const postdata = {
      ServiceCategory: ServiceProcedure.Categoryid,
      ServicesubCategory: ServiceProcedure.Subcategorypk,
      Patientcategory: OP_BillingData.PatientCategory,
      PatientcategoryId: OP_BillingData.PatientCategoryId,
      patientid: OP_BillingData.PatientId,
    };

    console.log('possttt', postdata);

    axios
      .get(`${UrlLink}Masters/services_Subcategory_details_by_Patient_category`, {
        params: postdata, // Use params to send query parameters
      })
      .then((response) => {
        const res = response.data;
        console.log('ressssss', res);
        console.log('amttt', res?.[0]?.amt);
        setServiceProcedure((prev) => ({
          ...prev,
          Rate: res?.[0]?.amt,
          Quantity: 1,
        }))
      });
  }, [UrlLink, ServiceProcedure.Categoryid, ServiceProcedure.Subcategorypk]);


  const HandleSmartCard = () => { };


  const handleReimbursableChange = (event, index) => {
    const updatedList = SelectDatalist.map((item, i) =>
      i === index
        ? { ...item, isRefundable: event.target.checked ? "Yes" : "No" }
        : item
    );

    // Check if any item in the updated list has isReimbursable as "Yes"
    const anyReimbursable = updatedList.some(
      (item) => item.isRefundable === "Yes"
    );

    // Update states
    setSelectDatalist(updatedList); // Update state with the modified data
    setReimbursable(anyReimbursable); // Set true if any checkbox is "Yes", otherwise false

    console.log("Updated List:", updatedList);
    console.log("Is any item reimbursable?", anyReimbursable);
  };


  const gridRef = useRef(null);

  const clearservices = () => {
    setConsultation({
      PhysicianType: "",
      Physician: "",
      Service: "",
      Procedure: "",
      DrugName: "",
      LabTest: "",
      RadiologyDept: "",
      RadiologyTest: "",
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
  };

  useEffect(() => {
    if (patientsearch !== "" && ServiceProcedureForm !== "") {
      axios
        .get(`${UrlLink}Masters/Lab_Test_Name_link`)
        .then((response) => {
          const res = response?.data;
          console.log("ressssss", res);
          setLabData(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [UrlLink, ServiceProcedureForm, Consultation.LabTest]);


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



  const Additemstobillfun = () => {
    // Define required fields based on ServiceProcedureForm type
    const requiredfields = ['ServiceCategory', 'ServiceSubCategory'];
    const existing = requiredfields.filter((field) => !ServiceProcedure[field]);
    if (existing.length !== 0) {
      // Alert the user to fill in the missing required fields
      alert(`Please fill the required fields: ${existing.join(", ")}`);
    } else {
      // Check if the same ServiceType and the correct ItemName already exist in SelectDatalist
      const Checktest = SelectDatalist.some(
        (ele) =>
          ele.ServiceType === ServiceProcedure.ServiceCategory &&
          ele.SelectItemName === ServiceProcedure.ServiceSubCategory // Dynamically check the appropriate item name field
      );
      console.log("checkkkk", Checktest);
      if (Checktest) {
        alert(`${ServiceProcedure.ServiceSubCategory} already exists`);
      } else {
        // Create a new item with ServiceType and the available Consultation data
        const listdata = {
          ServiceType: ServiceProcedure.ServiceCategory,
          SelectItemName: ServiceProcedure.ServiceSubCategory,
          Quantity: parseFloat(ServiceProcedure.Quantity) || 1,
          Charges: parseFloat(ServiceProcedure.Rate) || 0,
          Amount: parseFloat(ServiceProcedure.Rate) || 0,
          NetAmount: parseFloat(ServiceProcedure.Rate * ServiceProcedure.Quantity) || 0,
          isReimbursable: "No",
        };

        console.log("Adding item:", listdata); // Log the data being added

        // Calculate the updated BalanceAmount based only on the newly added item
        const newBalanceAmount = parseFloat(listdata.NetAmount);

        // Update the SelectDatalist with the new item and recalculate the balance
        setSelectDatalist((prev) => [
          ...prev,
          { S_No: prev.length + 1, ...listdata },
        ]);

        setinitialState((prevState) => ({
          ...prevState,
          BalanceAmount: (
            parseFloat(prevState.BalanceAmount) + newBalanceAmount
          ).toFixed(2),
        }));

        // Reset the form after adding
        setServiceProcedure({
          ServiceCategory: '',
          Categoryid: '',
          ServiceSubCategory: '',
          ServiceSubCatId: '',
          Subcategorypk: '',
          Rate: '',
          Quantity: "",
        });
      }
    }
  };


  // Delete billing item
  const deletebillingitem = (row) => {
    const S_No = row.S_No;

    let Temp_delarr = SelectDatalist.filter((ele) => ele.S_No !== S_No);

    // Update state and trigger recalculation of totals
    setSelectDatalist(
      Temp_delarr.map((item, index) => ({ ...item, S_No: index + 1 }))
    );
  };


  // useEffect(() => {
  //   if (Object.keys(OPConsultDetails).length !== 0) {
  //     const registrationId = OPConsultDetails?.RegistrationId;
  //     console.log("Fetching data for:", registrationId);

  //     axios
  //       .get(`${UrlLink}Frontoffice/get_consultation_details`, {
  //         params: { RegistrationId: registrationId },
  //       })
  //       .then((res) => {
  //         console.log("Response Data:", res.data);
  //         const OP_BillingData = res?.data?.Billing_data?.[0]; // Ensure accessing the first object
  //         const serviceList = res?.data?.Service_lists || []; // Ensure it's an array

  //         setpatientsearch((prev) => ({
  //           ...prev,
  //           Search: OP_BillingData?.PatientId,
  //         }));

  //         setSmartCard((prev) => ({
  //           ...prev,
  //           SmartCardNo: OP_BillingData.PatientId,
  //         }));

  //         setBillingData((prev) => ({
  //           ...prev,
  //           DoctorName: OP_BillingData.Doctor_ShortName || "",
  //           DoctorId: OP_BillingData.Doctor_Id || "",
  //         }));

  //         setRegisterData((prev) => ({
  //           ...prev,
  //           ABHA: "64-9456-6541-8451",
  //           PatientName: OP_BillingData.Patient_Name || "",
  //           AgeGender: OP_BillingData.AgeGender || "",
  //           PhoneNo: OP_BillingData.PhoneNo || "",
  //           PatientCategory: OP_BillingData.PatientCategory || "",
  //           PatientCategoryName: OP_BillingData.PatientCategoryName || "",
  //           Address: OP_BillingData.Address || "",
  //           PatientId: OP_BillingData.PatientId || "",
  //         }));

  //         setSelectedPatient_list((prev) => ({
  //           ...prev,
  //           PatientId: OP_BillingData.PatientId,
  //           PatientName: OP_BillingData.Patient_Name,
  //           PhoneNumber: OP_BillingData.PhoneNo,
  //           PatientCategory: OP_BillingData.PatientCategory,
  //           Gender: OP_BillingData.Gender,
  //           City: OP_BillingData.City,
  //           State: OP_BillingData.State,
  //           PatientAddress: OP_BillingData.Area,
  //           Pincode: OP_BillingData.Pincode,
  //           RegisterId: OP_BillingData.Registration_Id,
  //           VisitId: OP_BillingData.Visit_Id,
  //           Date: OP_BillingData.Date,
  //           ReferalDoctor: OP_BillingData.ReferalDoctor,
  //         }));

  //         // ✅ Correctly map over `serviceList` array
  //         const Items = serviceList.map((service, index) => ({
  //           S_No: index + 1, // Serial number based on index
  //           ServiceType: service?.service_category,
  //           SelectItemName: service?.service_subcategory,
  //           Charges: parseFloat(service.amt),
  //           Amount: parseFloat(service.amt),
  //           DiscountType: "",
  //           Discount: "",
  //           // GST_per: service.GST_per,
  //           // GST: service.GST_Charge,
  //           // Status: service.Status,
  //           NetAmount: parseFloat(service.amt),
  //           Quantity: 1, // Directly set as 1
  //           isReimbursable: service?.insurancename ? "Yes" : "No", // Mark reimbursable if insurance exists
  //         }));

  //         setSelectDatalist(Items);

  //         setFormAmount((prev) => ({
  //           ...prev,
  //           paidamount: initialState.totalAmount,
  //         }));
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching consultation details:", error);
  //       });
  //   }
  // }, [UrlLink, OPConsultDetails, formAmount.paidamount]);

  // console.log("SelectedPatient_list", SelectedPatient_list);


  // useEffect(() => {
  //   if (OP_BillingData.id && OP_BillingData.Type === 'OPEdit') {
  //     const Itemlist = OP_BillingData.Billing_Items
  //     const PaymentDetails = OP_BillingData.Payment_Details

  //     setpatientsearch((prev) => ({
  //       ...prev,
  //       Search: OP_BillingData?.PatientId,
  //     }));

  //     setSmartCard((prev) => ({
  //       ...prev,
  //       SmartCardNo: OP_BillingData.PatientId,
  //     }));

  //     setBillingData((prev) => ({
  //       ...prev,
  //       DoctorName: OP_BillingData.Doctor_Name || "",
  //       DoctorId: OP_BillingData.Doctor_Id || "",
  //     }));
  //     setRegisterData((prev) => ({
  //       ...prev,
  //       ABHA: '64-9456-6541-8451',
  //       PatientName: OP_BillingData.Patient_Name || "",
  //       AgeGender: OP_BillingData.AgeGender || "",
  //       PhoneNo: OP_BillingData.PhoneNo || "",
  //       PatientCategory: OP_BillingData.PatientCategory || "",
  //       PatientCategoryName: OP_BillingData.PatientCategoryName || "",
  //       Address: OP_BillingData.Address || "",
  //       PatientId: OP_BillingData.PatientId || "",
  //     }));
  //     setSelectedPatient_list((prev) => ({
  //       ...prev,
  //       PatientId: OP_BillingData.PatientId,
  //       PatientName: OP_BillingData.Patient_Name,
  //       PhoneNumber: OP_BillingData.PhoneNo,
  //       PatientCategory: OP_BillingData.PatientCategory,
  //       Gender: OP_BillingData.Gender,
  //       City: OP_BillingData.City,
  //       State: OP_BillingData.State,
  //       PatientAddress: OP_BillingData.Area,
  //       Pincode: OP_BillingData.Pincode,
  //       RegisterId: OP_BillingData.Register_Id,
  //       VisitId: OP_BillingData.Visit_Id,
  //     }))
  //     // setinitialState((prev)=>({
  //     //   ...prev,
  //     //   totalItems: OP_BillingData.totalItems,
  //     //   totalTaxable: 0,
  //     //   totalAmount: OP_BillingData.TotalAmount,
  //     //   totalDiscount: 0,
  //     //   totalGstamount: 0,
  //     //   totalUnits: OP_BillingData.TotalQty,
  //     //   totalNetAmount: OP_BillingData.Net_Amount,
  //     //   PaidAmount: OP_BillingData.PaidAmount,
  //     //   BalanceAmount: OP_BillingData.BalanceAmount,
  //     //   Roundoff: OP_BillingData.RoundOff,
  //     //   ReimbursableAmount: 0,
  //     //   totalAmountt: OP_BillingData,
  //     // }))

  //     const Items = Itemlist.map(
  //       (service, index) => {
  //         return {
  //           S_No: index + 1, // Add serial number based on index
  //           ServiceType: service.Service_Type,
  //           SelectItemName: service.Service_Name,
  //           Charges: parseFloat(service.Charge),
  //           Amount: parseFloat(service.Amount),
  //           DiscountType: "",
  //           Discount: "",
  //           GST_per: service.GST_per,
  //           GST: service.GST_Charge,
  //           Status: service.Status,
  //           NetAmount: parseFloat(service.Total_Amount),
  //           Quantity: parseFloat(service.Quantity),
  //           isReimbursable: "No",
  //         };
  //       }
  //     );
  //     setSelectDatalist(Items)
  //     const Payment = PaymentDetails.map((item, ind) => ({
  //       Billpay_method: item.Payment_Type,
  //       CardType: item.Card_Type,
  //       CardNo: item.Card_No,
  //       upiid: item.upiid,
  //       TransactionId: item.TransactionId,
  //       ChequeNo: item.Cheque_No,
  //       BankName: item.Bank_Name,
  //       paidamount: item.Amount,
  //       Additionalamount: item.AdditionalAmount,
  //       transactionFee: item.Transaction_Amount,
  //     }))
  //     setBillAmount(Payment)
  //   }
  // }, [UrlLink, OP_BillingData])

  useEffect(() => {
    if (OP_BillingData.id && OP_BillingData.Type === "OPRefund") {
      const Itemlist = OP_BillingData.Billing_Items
      const PaymentDetails = OP_BillingData.Payment_Details

      setpatientsearch((prev) => ({
        ...prev,
        Search: OP_BillingData?.PatientId,
      }));

      setSmartCard((prev) => ({
        ...prev,
        SmartCardNo: OP_BillingData.PatientId,
      }));

      setBillingData((prev) => ({
        ...prev,
        DoctorName: OP_BillingData.Doctor_Name || "",
        DoctorId: OP_BillingData.Doctor_Id || "",
      }));
      setRegisterData((prev) => ({
        ...prev,
        ABHA: '64-9456-6541-8451',
        PatientName: OP_BillingData.Patient_Name || "",
        AgeGender: OP_BillingData.AgeGender || "",
        PhoneNo: OP_BillingData.PhoneNo || "",
        PatientCategory: OP_BillingData.PatientCategory || "",
        PatientCategoryName: OP_BillingData.PatientCategoryName || "",
        Address: OP_BillingData.Address || "",
        PatientId: OP_BillingData.PatientId || "",
      }));
      setSelectedPatient_list((prev) => ({
        ...prev,
        PatientId: OP_BillingData.PatientId,
        PatientName: OP_BillingData.Patient_Name,
        PhoneNumber: OP_BillingData.PhoneNo,
        PatientCategory: OP_BillingData.PatientCategory,
        Gender: OP_BillingData.Gender,
        City: OP_BillingData.City,
        State: OP_BillingData.State,
        PatientAddress: OP_BillingData.Area,
        Pincode: OP_BillingData.Pincode,
        RegisterId: OP_BillingData.Register_Id,
        VisitId: OP_BillingData.Visit_Id,
      }))
      // setinitialState((prev) => ({
      //   ...prev,
      //   totalItems: OP_BillingData.totalItems,
      //   totalTaxable: 0,
      //   totalAmount: OP_BillingData.TotalAmount,
      //   totalDiscount: 0,
      //   totalGstamount: 0,
      //   totalUnits: OP_BillingData.TotalQty,
      //   totalNetAmount: OP_BillingData.PaidAmount,
      //   // PaidAmount: OP_BillingData.PaidAmount,
      //   BalanceAmount: OP_BillingData.BalanceAmount,
      //   Roundoff: OP_BillingData.RoundOff,
      //   ReimbursableAmount: 0,
      //   // totalAmountt: OP_BillingData,
      // }))

      const Items = Itemlist.map(
        (service, index) => {
          return {
            S_No: index + 1, // Add serial number based on index
            ServiceType: service.Service_Type,
            SelectItemCode: service.SelectItemCode,
            SelectItemName: service.Service_Name,
            Charges: parseFloat(service.Charge),
            Amount: parseFloat(service.Amount),
            DiscountType: "",
            Discount: "",
            GST_per: service.GST_per,
            GST: service.GST_Charge,
            Status: service.Status,
            NetAmount: parseFloat(service.Total_Amount),
            Quantity: parseFloat(service.Quantity),
            isRefundable: "Yes",
          };
        }
      );
      setSelectDatalist(Items)
      const Payment = PaymentDetails.map((item, ind) => ({
        Billpay_method: item.Payment_Type,
        CardType: item.Card_Type,
        CardNo: item.Card_No,
        upiid: item.upiid,
        TransactionId: item.TransactionId,
        ChequeNo: item.Cheque_No,
        BankName: item.Bank_Name,
        paidamount: item.Amount,
        Additionalamount: item.AdditionalAmount,
        transactionFee: item.Transaction_Amount,
      }))
      // setBillAmount(Payment)
      // setinitialState({
      //   totalItems: OP_BillingData.TotalItems,
      //   totalTaxable: OP_BillingData.PaidAmount,
      //   totalAmount: OP_BillingData.PaidAmount,
      //   totalDiscount: OP_BillingData.TotalDiscount,
      //   totalGstamount: 0,
      //   totalUnits: OP_BillingData.TotalQty,
      //   totalNetAmount: OP_BillingData.PaidAmount,
      //   PaidAmount: OP_BillingData.PaidAmount,
      //   BalanceAmount: OP_BillingData.PaidAmount,
      //   Roundoff: OP_BillingData.RoundOff,
      //   totalAmountt: OP_BillingData.PaidNetAmount,
      // })
    }
  }, [UrlLink, OP_BillingData])

  useEffect(() => {
    // Aggregate data by ServiceType and calculate cumulative quantity, amount, and net amount
    const aggregatedData = SelectDatalist.reduce((acc, curr) => {
      const existing = acc.find((item) => item.ServiceType === curr.ServiceType);
      if (existing) {
        // If the ServiceType already exists, update the cumulative values
        existing.Quantity += curr.Quantity;
        existing.Amount += curr.Amount;
        existing.NetAmount += curr.NetAmount;
      } else {
        // If the ServiceType doesn't exist, create a new entry
        acc.push({
          ServiceType: curr.ServiceType,
          Quantity: curr.Quantity,
          Amount: curr.Amount,
          NetAmount: curr.NetAmount,
        });
      }
      return acc;
    }, []);

    console.log("Aggregated Data:", aggregatedData);

    // Set aggregated data to SelectDatalist1
    setSelectDatalist1(aggregatedData);
  }, [SelectDatalist]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const total_netamount = Math.round(initialState.totalNetAmount).toFixed(2);

    if (+totalPaidAmount !== +total_netamount) {
      if (name === "Billpay_method") {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
      else if (name === "CardNo") {
        if (value.length < 5) {
          setFormAmount((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        }
      }
      else if (name === "TransactionId") {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value.toUpperCase(),
        }));
      }
      else if (name === "paidamount") {
        if (billAmount.length > 0) {
          const amttt = parseFloat(total_netamount) - totalPaidAmount;
          if (+amttt >= +value) {
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: value,
            }));
          } else {
            alert(`enter the Correct value blow the Net Amount ${amttt}`);
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: "",
            }));
          }
        } else {
          if (+total_netamount >= +value) {
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: value,
            }));
          } else {
            alert(
              `enter the Correct value blow the Net Amount ${total_netamount}`
            );
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: "",
            }));
          }
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

  // Automatically update ServiceProcedureForm when AppointmentRegisType changes
  useEffect(() => {
    if (AppointmentRegisType === "Laboratory") {
      setServiceProcedureForm("Lab");
    } else if (AppointmentRegisType === "Pharmacy") {
      setServiceProcedureForm("Pharmacy");
    } else if (AppointmentRegisType === "Radiology") {
      setServiceProcedureForm("Radiology");
    }
  }, [UrlLink, AppointmentRegisType]);

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
    let missingFields = requiredfields1.filter((field) => !RegisterData[field]);
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

    // // Check if Payment Details are missing
    // if (billAmount.length === 0 && RegisterData.PatientCategory === "Insurance" && RegisterData.PatientCategory === 'Client') {
    //   const userConfirmed = window.confirm("Do you want to make this bill Due?");

    //   if (!userConfirmed) {
    //     return; // Stop execution if the user clicks "No"
    //   }
    // }

    let senddata = {
      billAmount: billAmount,
      SelectedPatient_list: SelectedPatient_list,
      NetAmount_CDmethod: NetAmount_CDmethod,
      SelectDatalist: SelectDatalist,
      BillingData: BillingData,
      initialState: initialState,
      Created_by: UserData?.username,
      Location: UserData?.location,
      selectedOption: selectedOption,
      ServiceProcedureForm: OP_BillingData?.BillingType,
      Request_Id: OP_BillingData?.Request_Id,
      // Due: OP_BillingData?.Type === "OPDue",
      EditId:
        OP_BillingData?.id && OP_BillingData?.Type === "OPEdit"
          ? OP_BillingData?.id
          : "",
      EditDue:
        OP_BillingData?.id && OP_BillingData?.Type === "OPRefund"
          ? OP_BillingData?.id
          : "",
      Paytype: Paytype.isCash === 'Yes' ? 'Cash' : 'Credit',
      PayOption: printoption,
    };

    console.log("senddata", senddata);
    if (
      Object.keys(OP_BillingData).length !== 0
    ) {
      axios
        .post(`${UrlLink}Frontoffice/GeneralBilling_Refund_Link`, senddata)
        .then((res) => {
          console.log("OPpppppPosttt", res.data);
          setPostInvoice(res.data.InvoiceNo);
          setRecieptInvoice(res.data.ReceiptNo);
          setIsPrintButtonVisible(false);
          // navigate("/Home/CashierFolder");
          // dispatchvalue({ type: "HrFolder", value: "GeneralBillingRefundList" });
          // dispatchvalue({ type: "setPreviousFolder", value: null });
          // dispatchvalue({ type: "showMenu", value: true });


        })
        .catch((err) => {
          console.log(err);
        });
    }
  };


  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: async () => {
      navigate("/Home/CashierFolder");
      dispatchvalue({ type: "HrFolder", value: "GeneralBillingList" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });

  const handleCreditSubmit = () => {
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
      errorMessages.push("Please fill the Item Details.");
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

    // // Check if Payment Details are missing
    // if (billAmount.length === 0 && RegisterData.PatientCategory === "Insurance" && RegisterData.PatientCategory === 'Client') {
    //   const userConfirmed = window.confirm("Do you want to make this bill Due?");

    //   if (!userConfirmed) {
    //     return; // Stop execution if the user clicks "No"
    //   }
    // }

    let senddata = {
      billAmount: billAmount,
      SelectedPatient_list: SelectedPatient_list,
      NetAmount_CDmethod: NetAmount_CDmethod,
      SelectDatalist: SelectDatalist,
      BillingData: BillingData,
      initialState: initialState,
      Created_by: UserData?.username,
      Location: UserData?.location,
      selectedOption: selectedOption,
      ServiceProcedureForm: OP_BillingData?.BillingType,
      Request_Id: OP_BillingData?.Request_Id,
      EditId:
        OP_BillingData?.id && OP_BillingData?.Type === "OPEdit"
          ? OP_BillingData?.id
          : "",
      EditDue:
        OP_BillingData?.id && OP_BillingData?.Type === "OPDue"
          ? OP_BillingData?.id
          : "",
      Paytype: Paytype.isCash === 'Yes' ? 'Cash' : 'Credit'
    };

    console.log("senddata", senddata);
    if (
      Object.keys(OP_BillingData).length !== 0
    ) {
      axios
        .post(`${UrlLink}Frontoffice/GeneralBilling_Link`, senddata)
        .then((res) => {
          console.log("OPpppppPosttt", res.data);
          setPostInvoice(res.data.InvoiceNo);
          let typp = Object.keys(res.data)[0];
          let mess = Object.values(res.data)[0];
          // Correct way to extract the message and type
          const tdata = {
            message: res.data.Success || "Operation Successful", // Ensure message exists
            type: "success", // Explicitly setting type since API returns multiple keys
          };
          dispatchvalue({ type: "toast", value: tdata })
          navigate("/Home/CashierFolder");
          dispatchvalue({ type: "HrFolder", value: "GeneralBillingList" });
          dispatchvalue({ type: "setPreviousFolder", value: null });
          dispatchvalue({ type: "showMenu", value: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const handlePrintClose = () => {
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "GeneralBillingList" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  }

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
                        <h4>{OP_BillingData.AgeGender || RegisterData.AgeGender}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>


                    </div>

                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          OP NO <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
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
                        <h4>{BillingData.InvoiceDate}</h4>
                      </div>
                      {SelectedPatient_list.ReferalDoctor !== "" &&
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                          <label>
                            Referal Doctor<span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.ReferalDoctor}</h4>
                        </div>}
                      {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Physician Name <span>:</span>
                        </label>
                        <h4>{`${BillingData.DoctorName}`}</h4>
                      </div> */}
                    </div>
                  </div>
                  <div >
                    <div className="physician_label_fixed" >
                      <label >Doctor Name <span>:</span></label>
                      <h4>{`${BillingData.DoctorName}`}</h4>
                    </div>
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
                      {SelectDatalist.filter(row => row.isRefundable === 'Yes').map((row, index, filteredArray) => (
                        <React.Fragment key={index}>
                          {index === 0 || filteredArray[index - 1].ServiceType !== row.ServiceType ? (
                            <tr style={{ borderTop: '1px solid grey', marginBottom: '10px' }}>
                              <td style={{ fontWeight: 'bold', textAlign: 'left', border: 'none' }}>
                                {row.ServiceType}
                              </td>
                              <td colSpan="3" style={{ border: 'none' }}></td>
                            </tr>
                          ) : null}
                          <tr>
                            <td style={{ paddingLeft: '20px', border: 'none' }}>{row.SelectItemName}</td>
                            <td style={{ border: 'none' }}>{row.Quantity}</td>
                            <td style={{ border: 'none' }}>{row.Amount}</td>
                            <td style={{ border: 'none' }}>{row.NetAmount}</td>
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
        </div>
      </div>
    );
  };


  return (
    <>
      {isPrintButtonVisible ? (
        <>
          <div className="Main_container_app">
            <h3>Refund Billing</h3>

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
                    disabled={
                      Object.values(OP_BillingData).length !== 0
                    }
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

            <div className="RegisBillFormcon" ref={gridRef}>
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
            </div>

            <div className="new-patient-registration-form">
              <div className="Selected-table-container444 DEWSDXWED">
                <table className="selected-medicine-table222 EDWEDE">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Refund Items</th>
                      <th>Service Type</th>
                      <th>Service Name</th>
                      <th>Charge</th>
                      <th>Quantity</th>
                      <th>Amount </th>
                      <th>Discount Type</th>
                      <th>Discount</th>
                      <th>Net Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SelectDatalist.map((row, index) => {
                      return (
                        <tr key={index}>
                          <td>{row.S_No}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={row.isRefundable === "Yes"}
                              onChange={(e) =>
                                handleReimbursableChange(e, index)
                              }
                              disabled
                            />
                          </td>
                          <td>{row.ServiceType}</td>
                          <td>{row.SelectItemName}</td>
                          <td>{row.Charges || "-"}</td>
                          <td>{row.Quantity || "-"}</td>
                          <td>{row.Amount || "-"}</td>
                          <td>{row.DiscountType || "-"}</td>
                          <td>{row.Discount || "-"}</td>
                          <td>{row.NetAmount || "-"}</td>
                          <td>{row.Status || "-"}</td>
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
                </table>
              </div>

              <div className="">
                <br />

                <div className="summary-container addded_sumry_contre">
                  <div className="WDWDWD_OO">
                    <div className="edcwjkediu87_mmmm">
                      <div>
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
                              {formAmount.Billpay_method === "OnlinePayment" && (
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
                                {NumberToWords(+initialState.totalNetAmount)}{" "}
                              </span>
                            </div>
                            <br />
                            {AppointmentRegisType === 'IP' && <div className="clm-itm-stl">
                              <label>
                                Remaining Credit <span>:</span>
                              </label>
                              <input
                                style={RemainingCredit < 50000 ? { backgroundColor: "Red" } : {}} value={RemainingCredit} readOnly
                              />
                            </div>}
                            <br />
                          </>)
                        }
                      </div>
                    </div>

                    <div className="EWDWDWDWDCC_0 wdwdxsxwsw3ed">
                      <div className="clm-itm-stl">
                        <label>Items:</label>
                        <input value={initialState.totalItems} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Unit:</label>
                        <input value={initialState.totalUnits} readOnly />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Taxable Amount:</label>
                        <input value={initialState.totalTaxable} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Cash Discount :</label>
                        <input value={initialState.totalDiscount} readOnly />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Total Amount:</label>
                        <input value={initialState.totalAmount} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Item Amount :</label>
                        <input
                          style={{ backgroundColor: "yellow" }}
                          value={initialState.totalNetAmount}
                          readOnly
                        />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Round Off :</label>
                        <input value={initialState.Roundoff} readOnly />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Paid Net Amount :</label>
                        <input
                          style={{ backgroundColor: "yellow" }}
                          value={initialState.totalAmountt}
                          readOnly
                        />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Paid Amount :</label>
                        <input value={initialState.PaidAmount} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Balance Amount :</label>
                        <input value={initialState.BalanceAmount} readOnly />
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

                {isPrintButtonVisible && Paytype.isCash === "Yes" ? (
                  <div className="Register_btn_con added_Register_btn_con">
                    <select
                      className="print_option_bill"
                      name="printoption"
                      value={printoption}
                      onChange={(e) => setprintoption(e.target.value)} // Update state with selected value
                    >
                      {[
                        // "Bill + Reciept",
                        // "Bill",
                        "Receipt",
                      ].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option> // Correctly return option elements
                      ))}
                    </select>
                    <button
                      className="RegisterForm_1_btns added_RegisterForm_1_btns"
                      onClick={() => handleSubmit(false, true)} // Pass a second parameter for "PrintReimbuseable"
                      style={{width: "80px", height: "30px"}}
                    >
                      Print Receipt
                    </button>
                  </div>
                ) :
                  Paytype.isCredit === "Yes" && (
                    <div className="Register_btn_con added_Register_btn_con">
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={handleCreditSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  )
                }

              </div>
            </div>

          </div>
        </>
      ) : (
        <ForPrintReceiptData />
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default QuickBillingApprovedRefundCashier;
