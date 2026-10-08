import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";

// import Chirayuulogo from "../../Assets/Chirayuulogo.png";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { handleKeyDownPhoneNo } from "../../OtherComponent/OtherFunctions";
import { handleKeyDownTextRegistration } from "../../OtherComponent/OtherFunctions";
import { useReactToPrint } from "react-to-print";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";


const IPEditBilling = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );

  const toast = useSelector((state) => state.userRecord?.toast);
  const [errors, setErrors] = useState({});

  const IP_BillingData = useSelector(
    (state) => state.Frontoffice?.IPBillingData
  );

  console.log('Ippppp', IP_BillingData)


  const componentRef = useRef();
  const currentDate = new Date();
  const Formdate = format(currentDate, "yyyy-MM-dd");

  // For Lab
  const [franchaisename, setFranchaisename] = useState("Basic");
  const [franchaise, setfranchaises] = useState([]);
  const [franchaisecolumnname, setfranchaisecolumnname] = useState("Basic");
  const [Department, setDepartment] = useState([]);
  const [overallRateCard, setoverallRateCard] = useState([]);
  const [testType, setTestType] = useState("Individual");

  const [formData, setFormData] = useState({
    SubDepartment_Code: "",
    SubDepartment_Name: "",
    testType: testType,
  });

  const [newitemslist, setnewitemslist] = useState([]);
  const [removeditemslist, setremoveditemslist] = useState([]);
  const [BilledItems, setBilledItems] = useState([]);



  const [pharmacyDue, setPharmacyDue] = useState();
  const handleInputChange1234 = (e) => {
    const { name, value } = e.target;
    let SubDepartment_Code;

    if (name === "SubDepartment_Name") {
      const selectedDepartment = Department?.find(
        (item) => item.SubDepartment_Name === value
      );
      SubDepartment_Code = selectedDepartment?.SubDepartment_Code;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      SubDepartment_Code: SubDepartment_Code || prevData.SubDepartment_Code,
    }));
  };

  const handleRateCardLims = (e) => {
    setFranchaisename(e.target.value);
    const selectfranchaise = franchaise.find(
      (row) => row.displayNames === e.target.value
    );
    if (selectfranchaise) {
      setfranchaisecolumnname(selectfranchaise.columname);
    }
  };
  const [ClinicDetials, setClinicDetials] = useState({
    Clogo: ClinicDetails?.Clogo,
    Cname: ClinicDetails?.Cname,
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


  console.log("ClinicDetials", ClinicDetials);

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
  });

  const [RadiologyNames, setRadiologyNames] = useState([]);
  const [RadioNames, setRadioNames] = useState([]);
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
    AmountStatus: "",
  });

  console.log(initialState, 'initialState');
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
    Quantity: 1,
    Total: '',
    type: '',
  });

  const [ServiceCategoryData, setServiceCategoryData] = useState([]);
  const [ServiceSubCategoryData, setServiceSubCategoryData] = useState([]);

  const [InsuranceAmount, setInsuranceAmount] = useState([]);
  const [ClientAmount, setClientAmount] = useState([]);

  const [InsuranceBalance, setInsuranceBalance] = useState("");

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
  const [AppointmentRegisType, setAppointmentRegisType] = useState("IP");
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
  });
  const [Paytype, setPaytype] = useState({
    isCash: "Yes",
    isCredit: "No",
  });

  const [PaymentMode, setPaymentMode] = useState('')

  const [AdvanceAmountGet, setAdvanceAmountGet] = useState([]);
  const [AdvanceTotal, setAdvanceTotal] = useState("");
  const [RemainingCredit, setRemainingCredit] = useState([]);
  console.log("Advancetotallll", AdvanceTotal);
  console.log("RemainingCredittt", RemainingCredit);

  const [register, setregister] = useState({
    isregister: "No",
    registerAmount: "",
  });
  const [ServiceProcedureForm, setServiceProcedureForm] =
    useState("Consultation");
  const [ServiceProcedureData, setServiceProcedureData] = useState([]);
  const [ServiceProcedureDataGet, setServiceProcedureDataGet] = useState([]);

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

  const [printoption, setprintoption] = useState("PrintDetailed");
  const [RegisterData, setRegisterData] = useState({
    PatientId: "",
    ABHA: "",
    PatientName: "",
    AgeGender: "",
    PhoneNo: "",
    PatientCategory: "",
    PatientCategoryName: "",
    WardName: "",
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
    if (IP_BillingData.PatientCategory === 'Insurance' || IP_BillingData.PatientCategory === 'Client') {

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

      // Corrected filtering logic based on isReimbursable === "Yes"
      const reimbursableItems = SelectDatalist.filter((item) => item.isReimbursable === "Yes");
      const nonReimbursableItems = SelectDatalist.filter((item) => item.isReimbursable !== "Yes");

      // Function to calculate totals for a given list of items
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

      // Calculate totals separately for reimbursable and non-reimbursable items
      reimbursableTotals = calculateTotals(reimbursableItems);
      nonReimbursableTotals = calculateTotals(nonReimbursableItems);

      // Sum up both categories for the overall total
      updatedTotals = {
        totalUnits: reimbursableTotals.totalUnits + nonReimbursableTotals.totalUnits,
        totalAmount: reimbursableTotals.totalAmount + nonReimbursableTotals.totalAmount,
        totalDiscount: reimbursableTotals.totalDiscount + nonReimbursableTotals.totalDiscount,
        totalGstamount: reimbursableTotals.totalGstamount + nonReimbursableTotals.totalGstamount,
        totalNetAmount: reimbursableTotals.totalNetAmount + nonReimbursableTotals.totalNetAmount,
      };

      // Apply Discount Logic
      let additionalDiscount = 0;
      if (NetAmount_CDmethod.Amount !== "" && NetAmount_CDmethod.Method !== "") {
        if (NetAmount_CDmethod.Method === "Percentage") {
          additionalDiscount = (updatedTotals.totalAmount * NetAmount_CDmethod.Amount) / 100;
        } else if (NetAmount_CDmethod.Method === "Cash") {
          additionalDiscount = parseFloat(NetAmount_CDmethod.Amount) || 0;
        }
      }

      // Ensure the discount does not exceed the total amount
      let finalDiscount = Math.min(
        updatedTotals.totalNetAmount,
        updatedTotals.totalDiscount + additionalDiscount
      );

      // Adjust net amount after applying discount
      let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;

      // Corrected GST calculation based on the updated taxable amount
      let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;

      // Correct total net amount after discount and GST
      let finalNetAmount = totalTaxableAmount + updatedGst;

      let AmountStatus = RemainingCredit > 0 ? 'Refund' : 'Pay'
      // Preserve PaidAmount and calculate BalanceAmount correctly
      setinitialState((prevState) => ({
        ...prevState,
        totalItems: SelectDatalist.length,
        totalTaxable: updatedTotals.totalAmount.toFixed(2),
        totalUnits: updatedTotals.totalUnits,
        totalDiscount: finalDiscount.toFixed(2),
        totalGstamount: updatedGst.toFixed(2),
        totalNetAmount: (Math.round(finalNetAmount)).toFixed(2),
        totalAmount: finalNetAmount.toFixed(2),
        BalanceAmount: (Math.round(finalNetAmount - prevState.PaidAmount) - finalNetAmount).toFixed(2),
        Roundoff: (Math.round(finalNetAmount) - finalNetAmount).toFixed(2),

        // Add separate reimbursable and non-reimbursable totals
        reimbursableTotal: reimbursableTotals.totalNetAmount.toFixed(2),
        nonReimbursableTotal: nonReimbursableTotals.totalNetAmount.toFixed(2),
        AmountStatus: AmountStatus,
      }));
      // Update previous totals reference
      prevTotalsRef.current = { ...updatedTotals };
    }
    else {
      let updatedTotals = {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalGstamount: 0,
        totalNetAmount: 0,
      };

      // Iterate through SelectDatalist and sum up values
      SelectDatalist.forEach((item) => {
        updatedTotals.totalUnits += +item.Quantity || 0;
        updatedTotals.totalAmount += parseFloat(item.Charges) || 0;
        updatedTotals.totalDiscount += parseFloat(item.Discount) || 0;
        updatedTotals.totalGstamount += parseFloat(item.GST) || 0;
        updatedTotals.totalNetAmount += parseFloat(item.NetAmount) || 0;
      });

      // Apply Discount Logic
      let additionalDiscount = 0;

      if (NetAmount_CDmethod.Amount !== "" && NetAmount_CDmethod.Method !== "") {
        if (NetAmount_CDmethod.Method === "Percentage") {
          additionalDiscount = (updatedTotals.totalAmount * NetAmount_CDmethod.Amount) / 100;
        } else if (NetAmount_CDmethod.Method === "Cash") {
          additionalDiscount = parseFloat(NetAmount_CDmethod.Amount) || 0;
        }
      }

      // Ensure the discount does not exceed the total amount
      let finalDiscount = Math.min(updatedTotals.totalNetAmount, updatedTotals.totalDiscount + additionalDiscount);

      // Adjust net amount after applying discount
      let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;

      // Corrected GST calculation based on the updated taxable amount
      let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;

      // Correct total net amount after discount and GST
      let finalNetAmount = totalTaxableAmount + updatedGst;
      let AmountStatus = RemainingCredit > 0 ? 'Refund' : 'Pay'

      // Preserve PaidAmount and calculate BalanceAmount correctly
      setinitialState((prevState) => ({
        ...prevState,
        totalItems: SelectDatalist.length,
        totalTaxable: (updatedTotals.totalAmount).toFixed(2),
        totalUnits: updatedTotals.totalUnits,
        totalDiscount: finalDiscount.toFixed(2),
        totalGstamount: updatedGst.toFixed(2),
        totalNetAmount: (Math.round(finalNetAmount)).toFixed(2),
        totalAmount: finalNetAmount.toFixed(2),
        BalanceAmount: (Math.round(finalNetAmount - prevState.PaidAmount)).toFixed(2),
        Roundoff: (Math.round(finalNetAmount) - finalNetAmount).toFixed(2),
        AmountStatus: AmountStatus,
      }));

      // Update previous totals reference
      prevTotalsRef.current = { ...updatedTotals };
    }
  }, [SelectDatalist, NetAmount_CDmethod, RemainingCredit]);

  console.log('initttttttt:', initialState);
  console.log('SelectDatalist:', SelectDatalist);


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
          const {
            PatientProfile,
            PatientId,
            ABHA,
            AliasName,
            PatientName,
            PhoneNo,
            Address,
            AgeGender,
            ...resss
          } = res.data;
          console.log("paaatttttttttt", res.data);

          setRegisterData((prev) => ({
            ...prev,
            PatientId: PatientId || "",
            ABHA: "64-9456-6541-8451",
            PatientName: PatientName || "",
            AgeGender: AgeGender || "",
            PhoneNo: PhoneNo || "",
            PatientCategory: "General",
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

  const HandleAdvance = () => {
    if (RegisterData.PatientId !== "") {
      if (Object.keys(IP_BillingData).length !== 0) {
        setAdvanceAmount((prev) => ({
          ...prev,
          isAdvance: "Yes",
        }));
      } else {
        setAdvanceAmount((prev) => ({
          ...prev,
          isAdvance: prev?.isAdvance === "No" ? "Yes" : "No",
        }));
      }
    } else {
      const tdata = {
        message: "Please enter valid PatientId details.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Frontoffice/IP_AdvanceAmount_collection?RegistrationId=${IP_BillingData?.Registration_Id}&Type=${'IP'}`
      )
      .then((ress) => {
        const res = ress?.data;
        console.log("advvvvv", res);
        setAdvanceAmountGet(res?.AdvanceDetails);
        setAdvanceTotal(res?.TotalAdvanceAmount);
        // setRemainingCredit(res?.TotalAdvanceAmount)
      })
      .catch((e) => console.log(e));
  }, [UrlLink, AdvanceAmount.isAdvance, IP_BillingData, SelectDatalist]);



  useEffect(() => {
    if (!initialState || !initialState.BalanceAmount) return;
    console.log(RemainingCredit, 'remainingamountGeneral');
    console.log(initialState.BalanceAmount, 'remainingamountGeneral');

    const remainingAmount = AdvanceTotal - parseFloat(initialState.totalNetAmount);
    console.log(remainingAmount, 'remainingamountGeneral');
    const remainingAmount1 = remainingAmount.toFixed(2);

    setRemainingCredit(remainingAmount1);
  }, [UrlLink, initialState]);

  // useEffect(() => {
  //   if (AdvanceTotal !== ""){
  //     setinitialState((prev)=>({
  //       ...prev,
  //       BalanceAmount: AdvanceTotal - parseFloat((prev.totalAmountt).toFixed(2))
  //     }))
  //   }
  // }, [UrlLink, initialState]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/services_Group_list_details`)
      .then((res) => {
        const ress = res.data;
        console.log(ress, "ddhdhdhdhdhdhdh");

        setServiceCategoryData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const Advancecolumns = [
    {
      key: "AdvanceAmount",
      name: "Amount",
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

  const handleAdvanceSubmit = () => {
    if (AdvanceAmount.AdvanceAmount !== "") {
      const postdata = {
        RegistrationId: IP_BillingData?.Registration_Id,
        Created_by: UserData?.username,
        ...AdvanceAmount,
      };
      axios
        .post(`${UrlLink}Frontoffice/IP_AdvanceAmount_collection`, postdata)
        .then((resp) => {
          const res = resp.data;
          console.log(res);
          let typp = Object.keys(res)[0]; // Get response type (success, error)
          let mess = Object.values(res)[0]; // Get response message
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
          setAdvanceAmount({
            isAdvance: "No",
            AdvanceAmount: "",
          });
        })
        .catch((e) => console.log(e));
    }
  };

  const HandleClientCheck = (e) => {
    if (RegisterData.PatientId !== "" && RegisterData.InsuranceName !== "") {
      if (
        RegisterData.PatientCategory === "Insurance" ||
        RegisterData.PatientCategory === "Client"
      ) {
        setisClient((prevState) => ({
          ...prevState,
          isClient: prevState.isClient === "No" ? "Yes" : "No",
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
      } else {
        const tdata = {
          message: "Please Select the Client/Insurance/TPA Patient Category",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setisClient((prev) => ({
          ...prev,
          isClient: "No",
        }));
      }
    } else {
      const tdata = {
        message: "Please enter valid PatientId details.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };
  const HandleOnClient = (e) => {
    const { name, value } = e.target;

    // Check if the input field is for CoPaymentTypeinp or PreAuthTypeinp
    if (name === "CoPaymentTypeinp" || name === "PreAuthTypeinp") {
      setisClient((prevState) => ({
        ...prevState,
        [name]: value, // Update the respective input field state
      }));
    } else {
      setisClient((prevState) => ({
        ...prevState,
        [name]: value, // Update other fields
      }));
    }
  };
  const handledispatch = () => {
    const tdata = {
      message: "Please enter search details.",
      type: "error",
    };
    dispatchvalue({ type: "toast", value: tdata });
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
    if (name === "ServiceCategory") {
      if (value.includes("-")) {
        const value1 = value.split("-");
        const value2 = value1[0];
        const value3 = value1[1];
        console.log("serrrrrr", value1, value2, value3);
        setServiceProcedure((prev) => ({
          ...prev,
          Categoryid: value2,
          [name]: value3,
        }));

        if (value2) {
          axios
            .get(
              `${UrlLink}Masters/services_Subcategory_details_by_category?ServiceCategory=${value2}`
            )
            .then((res) => {
              const ress = res.data;
              console.log(ress, "ddhdhdhdhdhdhdhdhdhdhdhdhdhdh");

              setServiceSubCategoryData(ress);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        setServiceProcedure((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "ServiceSubCategory") {
      const value1 = value.split("-");
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
    } else {
      setServiceProcedure((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const postdata = {
      ServiceCategory: ServiceProcedure.Categoryid,
      ServicesubCategory: ServiceProcedure.Subcategorypk,
      // Quantity: ServiceProcedure.Quantity,
      Patientcategory: IP_BillingData.PatientCategory || RegisterData.PatientCategory,
      PatientcategoryId: IP_BillingData.PatientCategoryId || "",
      // patientid: IP_BillingData.PatientId || SelectedPatient_list.PatientId,
      RegisterId: SelectedPatient_list.RegisterId,

      VisitType: "IP",
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
          ServiceSubCatId: res?.[0]?.ServiceId,
          Rate: res?.[0]?.amt,
          type: res?.[0]?.type,
          // Total: res?.[0]?.total,
          // Quantity: 1,
        }))
      });
  }, [UrlLink, ServiceProcedure.Categoryid, ServiceProcedure.Subcategorypk, ServiceProcedure.ServiceSubCatId]);

  const HandleSmartCard = () => { };
  const handleRegisterChange = (event, isInputChange = false) => {
    if (!isInputChange) {
      // Handle checkbox toggle
      if (patientsearch !== "" && RegisterData.PatientId !== "") {
        setregister((prev) => ({
          ...prev,
          isregister: prev.isregister === "No" ? "Yes" : "No",
        }));

        if (register.isregister === "No") {
          // Add registration row if it doesn't exist
          const alreadyExists = SelectDatalist.some(
            (item) => item.SelectItemName === "Registration"
          );

          if (!alreadyExists) {
            const listdata = {
              ServiceType: AppointmentRegisType,
              SelectItemName: "Registration",
              Rate: 300 || "",
              Quantity: 1 || "",
              Charges: 300 || "",
              Amount: 300 || "",
              DiscountType: "-",
              Discount: "-",
              GST_per: "-",
              GST: "-",
              NetAmount: 300 || "",
            };
            setSelectDatalist((prev) => [
              ...prev,
              { S_No: prev.length + 1, ...listdata },
            ]);
          }
        }
      } else {
        // Handle validation error
        const tdata = {
          message: "Please enter valid PatientId details.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else {
      // Handle input field change
      const { value } = event.target;
      setregister((prev) => ({
        ...prev,
        registerAmount: value,
      }));

      // Update the existing "Registration" row if present
      setSelectDatalist((prev) =>
        prev.map((item) =>
          item.SelectItemName === "Registration"
            ? {
              ...item,
              Rate: value || "0",
              Charges: value || "0",
              Amount: value || "0",
              NetAmount: value || "0",
            }
            : item
        )
      );
    }
  };

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
    setServiceProcedureForm("Consultation");
    setErrors({});
  };

  const handleChangeBillingData = (e) => {
    const { name, value } = e.target;
    console.log("value", value);

    const finddata = Doctorsnames.find((ele) => ele.ShortName === value);

    if (finddata) {
      setBillingData((prev) => ({
        ...prev,
        [name]: value,
        DoctorId: finddata.Doctor_ID,
      }));
    } else {
      setBillingData((prev) => ({
        ...prev,
        [name]: value,
        DoctorId: "",
      }));
    }
  };

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


  const handleReimbursableChange = (event, index) => {
    const updatedList = SelectDatalist.map((item, i) =>
      i === index
        ? { ...item, isReimbursable: event.target.checked ? "Yes" : "No" }
        : item
    );

    // Check if any item in the updated list has isReimbursable as "Yes"
    const anyReimbursable = updatedList.some(
      (item) => item.isReimbursable === "Yes"
    );

    // Update states
    setSelectDatalist(updatedList); // Update state with the modified data
    setReimbursable(anyReimbursable); // Set true if any checkbox is "Yes", otherwise false

    console.log("Updated List:", updatedList);
    console.log("Is any item reimbursable?", anyReimbursable);
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;

    setSelectedOption("IPDServices");

    if (name === "PatientId") {
      const Getdata = Patient_list.find((ele) => ele.PatientId === value);

      if (Getdata) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: Getdata?.PatientId,
          PatientName: Getdata?.FirstName,
          PhoneNumber: Getdata?.PhoneNo,
          Gender: Getdata.Gender,
          City: Getdata.City,
          State: Getdata.State,
          PatientAddress: Getdata?.Area,
          Pincode: Getdata.Pincode,
        }));
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          [name]: value,
          PatientName: "",
          PhoneNumber: "",
          PatientCategory: "General",
          InsuranceName: "",
          Gender: "",
          City: "",
          State: "",
          PatientAddress: "",
          Pincode: "",
          VisitId: "",
        }));
      }
    }
    if (name === "PatientName") {
      const Getdata = Patient_list.find((ele) => ele.FirstName === value);

      if (Getdata) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: Getdata?.PatientId,
          PatientName: Getdata?.FirstName,
          PhoneNumber: Getdata?.PhoneNo,
          Gender: Getdata.Gender,
          City: Getdata.City,
          State: Getdata.State,
          PatientAddress: Getdata?.Area,
          Pincode: Getdata.Pincode,
        }));
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          [name]: value,
          PatientId: "",
          PhoneNumber: "",
          PatientCategory: "General",
          InsuranceName: "",
          Gender: "",
          City: "",
          State: "",
          PatientAddress: "",
          Pincode: "",
          VisitId: "",
        }));
      }
    } else if (name === "PhoneNumber") {
      const Getdata = Patient_list.find((ele) => ele.PhoneNo === value);

      if (Getdata) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: Getdata?.PatientId,
          PatientName: Getdata?.FirstName,
          PhoneNumber: Getdata?.PhoneNo,
          Gender: Getdata.Gender,
          City: Getdata.City,
          State: Getdata.State,
          PatientAddress: Getdata?.Area,
          Pincode: Getdata.Pincode,
        }));
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          [name]: value,
          PatientId: "",
          PatientName: "",
          PatientCategory: "General",
          InsuranceName: "",
          Gender: "",
          City: "",
          State: "",
          PatientAddress: "",
          Pincode: "",
          VisitId: "",
        }));
      }
    }
    if (name === "PatientCategory") {
      setSelectedPatient_list((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setSelectedPatient_list((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const Additemstobillfun = () => {
    const requiredfields = ["ServiceCategory", "ServiceSubCategory"];
    const existing = requiredfields.filter((field) => !ServiceProcedure[field]);
    if (existing.length !== 0) {
      alert(`Please fill the required fields: ${existing.join(", ")}`);
    } else {
      console.log("selectedOption (before adding):", ServiceProcedure);
      const rate = parseFloat(ServiceProcedure.Rate);
      const quantity = parseFloat(ServiceProcedure.Quantity);
      if (isNaN(rate) || isNaN(quantity)) {
        alert("Please enter valid Rate and Quantity");
        return;
      }
      const listdata = {
        ServiceType: ServiceProcedure.ServiceCategory,
        SelectItemName: ServiceProcedure.ServiceSubCategory,
        Service_Code: ServiceProcedure.ServiceSubCatId,
        Rate: "0.00",
        Charges: rate,
        Quantity: quantity.toString(),
        Amount: rate,
        Discount_Type: "",
        Discount_Value: "0.00",
        Discount_Amount: "0.00",
        Taxable_Amount: rate,
        Tax_Percentage: 0,
        Tax_Amount: "0.00",
        NetAmount: (rate * quantity),
        isReimbursable: "Yes",
      };
      console.log("Adding item:", listdata);

      // Add to newitemslist
      setnewitemslist((prev) => [...prev, { S_No: SelectDatalist.length + 1, ...listdata }]);

      // Update BilledItems
      setSelectDatalist((prev) => [
        ...prev,
        { S_No: prev.length + 1, ...listdata },
      ]);

      // Reset form
      setServiceProcedure((prev) => ({
        ...prev,
        ServiceSubCategory: '',
        ServiceSubCatId: '',
        Subcategorypk: '',
        Rate: '',
        Quantity: 1,
        Total: '',
      }));
    }
  };

  const deletebillingitem = (row) => {
    console.log('Row to delete:', row);
    console.log('BilledItems before deletion:', SelectDatalist);

    // Validate required identifiers
    if (!row.ServiceType || !row.SelectItemName) {
      console.error('Service_Type or Service_Name missing in row:', row);
      alert('Cannot delete item: Missing service type or name');
      return;
    }

    // Add to removeditemslist
    setremoveditemslist((prev) => {
      console.log('Adding to removeditemslist:', row);
      return [...prev, row];
    });

    // Filter out the deleted item using Service_Type and Service_Name
    const Temp_delarr = SelectDatalist.filter(
      (ele) =>
        !(
          ele.ServiceType === row.ServiceType &&
          ele.SelectItemName === row.SelectItemName
        )
    );

    console.log('Filtered BilledItems (Temp_delarr):', Temp_delarr);

    // Prevent updating if Temp_delarr is empty (to avoid clearing all items)
    if (Temp_delarr.length === 0 && SelectDatalist.length > 0) {
      console.error('Filter removed all items, aborting update. Row:', row);
      alert('Cannot delete item: Filter error');
      return;
    }

    // Update BilledItems with reindexed S_No
    setSelectDatalist(
      Temp_delarr.map((item, index) => ({
        ...item,
        S_No: index + 1, // Reindex S_No
      }))
    );

    console.log('Updated BilledItems:', Temp_delarr);
  };




  useEffect(() => {
    if (IP_BillingData.id && IP_BillingData.Type === "IPEdit") {
      const Itemlist = IP_BillingData.Billing_Items;
      const PaymentDetails = IP_BillingData.Payment_Details;

      setpatientsearch((prev) => ({
        ...prev,
        Search: IP_BillingData?.PatientId,
      }));

      setSmartCard((prev) => ({
        ...prev,
        SmartCardNo: IP_BillingData.PatientId,
      }));

      setBillingData((prev) => ({
        ...prev,
        DoctorName: IP_BillingData.Doctor_Name || "",
        DoctorId: IP_BillingData.Doctor_Id || "",
      }));

      setRegisterData((prev) => ({
        ...prev,
        ABHA: "64-9456-6541-8451",
        PatientName: IP_BillingData.Patient_Name || "",
        AgeGender: IP_BillingData.AgeGender || "",
        PhoneNo: IP_BillingData.PhoneNo || "",
        PatientCategory: IP_BillingData.PatientCategory || "",
        PatientCategoryName: IP_BillingData.PatientCategoryName || "",
        Address: IP_BillingData.Address || "",
        PatientId: IP_BillingData.PatientId || "",
      }));
      setSelectedPatient_list((prev) => ({
        ...prev,
        PatientId: IP_BillingData.PatientId,
        PatientName: IP_BillingData.Patient_Name,
        PhoneNumber: IP_BillingData.PhoneNo,
        PatientCategory: IP_BillingData.PatientCategory,
        PatientCategoryType: IP_BillingData.PatientCategoryName,
        Gender: IP_BillingData.Gender,
        City: IP_BillingData.City,
        State: IP_BillingData.State,
        PatientAddress: IP_BillingData.Area,
        Pincode: IP_BillingData.Pincode,
        RegisterId: IP_BillingData.Registration_Id,
      }));
      // setinitialState((prev)=>({
      //   ...prev,
      //   totalItems: IP_BillingData.totalItems,
      //   totalTaxable: 0,
      //   totalAmount: IP_BillingData.TotalAmount,
      //   totalDiscount: 0,
      //   totalGstamount: 0,
      //   totalUnits: IP_BillingData.TotalQty,
      //   totalNetAmount: IP_BillingData.Net_Amount,
      //   PaidAmount: IP_BillingData.PaidAmount,
      //   BalanceAmount: IP_BillingData.BalanceAmount,
      //   Roundoff: IP_BillingData.RoundOff,
      //   ReimbursableAmount: 0,
      //   totalAmountt: IP_BillingData,
      // }))

      const Items = Itemlist.map((service, index) => {
        return {
          S_No: index + 1, // Add serial number based on index
          ServiceType: service.Service_Type,
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
          isReimbursable: "Yes",
        };
      });
      setSelectDatalist(Items);
      // const Payment = PaymentDetails.map((item, ind) => ({
      //   Billpay_method: item.Payment_Type,
      //   CardType: item.Card_Type,
      //   CardNo: item.Card_No,
      //   upiid: item.upiid,
      //   TransactionId: item.TransactionId,
      //   ChequeNo: item.Cheque_No,
      //   BankName: item.Bank_Name,
      //   paidamount: item.Amount,
      //   Additionalamount: item.AdditionalAmount,
      //   transactionFee: item.Transaction_Amount,
      // }));
      // setBillAmount(Payment);
    }
  }, [UrlLink, IP_BillingData]);

  useEffect(() => {


    // Aggregate data by ServiceType and calculate cumulative quantity, amount, and net amount
    const aggregatedData = SelectDatalist.reduce((acc, curr) => {
      const existing = acc.find(
        (item) => item.ServiceType === curr.ServiceType
      );
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
        if (IP_BillingData.PatientCategory === "General") {
          if (billAmount.length > 0) {
            const amttt = parseFloat(total_netamount) - totalPaidAmount;
            if (+amttt >= +value) {
              setFormAmount((prevState) => ({
                ...prevState,
                [name]: value,
              }));
            } else {
              alert(`enter the Correct value below the Net Amount ${amttt}`);
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
          setFormAmount((prevState) => ({
            ...prevState,
            [name]: value,
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

  const handlesubmitpatient = () => {
    let requiredfields1 = [
      "Title",
      "FirstName",
      "MiddleName",
      "SurName",
      "Gender",
      "DOB",
      "Age",
      "Email",
      "PhoneNo",
      "BloodGroup",
      "Occupation",
      "Religion",
      "Nationality",
      "UniqueIdType",
      "UniqueIdNo",
      "CaseSheetNo",
      "DoorNo",
      "Street",
      "Area",
      "City",
      "State",
      "Country",
      "Pincode",
    ];

    const existing = requiredfields1.filter((field) => !RegisterData[field]);
    if (existing.length !== 0) {
      alert(`Please fill the required fields ${existing.join(",")}`);
    } else {
      const postdata = {
        RegisterData,
        Created_by: UserData?.username,
      };
      console.log("PatientData", postdata);

      axios
        .post(`${UrlLink}Frontoffice/Patient_details_register`, postdata)
        .then((response) => {
          const res = response.data;
          let typp = Object.keys(res)[0]; // Get response type (success, error)
          let mess = Object.values(res)[0]; // Get response message
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
          cleardata();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };


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


  const handlesubmitclient = () => {
    let requiredfields1 = [
      "CoPaymentTypeinp",
      "PreAuthTypeinp",
      "PreAuthAmount",
      "PreAuthApprovalNo",
      "PolicyNo",
      "PolicyStartDate",
      "PolicyEndDate",
    ];

    const existing = requiredfields1.filter((field) => !isClient[field]);
    if (existing.length !== 0) {
      alert(`Please fill the required fields ${existing.join(",")}`);
    } else {
      const postdata = {
        isClient: isClient.isClient, // isClient status
        CoPaymentType: isClient.CoPaymentType, // Ensure CoPaymentType is passed
        CoPaymentTypeinp: isClient.CoPaymentTypeinp,
        CoPaymentLogic: isClient.CoPaymentLogic,
        CoPaymentdeducted: isClient.CoPaymentdeducted,
        PreAuthType: isClient.PreAuthType, // Ensure PreAuthType is passed
        PreAuthTypeinp: isClient.PreAuthTypeinp,
        PreAuthAmount: isClient.PreAuthAmount,
        PreAuthApprovalNo: isClient.PreAuthApprovalNo,
        PolicyNo: isClient.PolicyNo,
        PolicyStartDate: isClient.PolicyStartDate,
        PolicyEndDate: isClient.PolicyEndDate,
        PatientId: patientsearch.Search, // Assuming patientsearch contains PatientId
        Created_by: UserData?.username,
        Location: UserData?.location,
      };

      console.log("cliiiiieeeee", postdata);
      axios
        .post(`${UrlLink}Frontoffice/get_client_insurance_details`, postdata)
        .then((response) => {
          console.log("submitdata", response.data);
          setisClient({
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

          let typp = Object.keys(response.data)[0]; // Get response type (success, error)
          let mess = Object.values(response.data)[0]; // Get response message
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: "toast", value: tdata });
        })
        .catch((e) => {
          console.log(e);
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
        0,
        0,
        0,
        0 // 12:00 AM
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

    // Check if Item Details are empty
    if (SelectDatalist.length === 0) {
      errorMessages.push("Please fill the Item Details.");
    }

    // Check if Payment Details are missing
    if (billAmount.length === 0 && initialState.ReimbursableAmount !== 0) {
      errorMessages.push("Please fill the Payment Details.");
    }

    // If there are any errors, show them all in one alert
    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return; // Exit the function to avoid proceeding further
    }

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
      ServiceProcedureForm: ServiceProcedureForm,
      EditId: IP_BillingData?.id
        ? IP_BillingData?.Type === "IPEdit"
          ? IP_BillingData?.id
          : ""
        : "",
      EditDue:
        IP_BillingData?.id && IP_BillingData?.Type === "OPDue"
          ? IP_BillingData?.id
          : "",
      Paytype: Paytype.isCash === 'Yes' ? 'Cash' : 'Credit',
      AmountStatus: RemainingCredit > 0 ? 'Refund' : 'Pay',
      newitemslist: newitemslist,
      removeditemslist: removeditemslist,
      RefundAmount: RemainingCredit,
      AdvanceTotal: AdvanceTotal,
      // BilledItems: BilledItems,
    };

    console.log("senddata", senddata);
    if (Object.keys(IP_BillingData).length !== 0) {
      axios
        .post(`${UrlLink}Frontoffice/IPBillingEdit_Link`, senddata)
        .then((res) => {
          console.log(res.data);
          setPostInvoice(res.data.InvoiceNo);
          setRecieptInvoice(res.data.ReceiptNo);
          setPostInvoiceDate(res.data.InvoiceDate);
          setIsPrintButtonVisible(false);

          // Handle print options
          if (isSummary) {
            setisPrintSummary(true);
          } else if (isReimb) {
            setprintoption("PrintReimbursable");
          } else if (isNon_Reimb) {
            setprintoption("PrintNon-Reimbursable");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };


  // const handleSaveSubmit = () => {
  //   let requiredfields1 = ["PatientId", "PatientName", "PhoneNo", "AgeGender"];
  //   let missingFields = requiredfields1.filter((field) => !RegisterData[field]);
  //   let errorMessages = [];

  //   // Check for missing required fields
  //   if (missingFields.length > 0) {
  //     errorMessages.push(
  //       `Please fill the required fields: ${missingFields.join(", ")}`
  //     );
  //   }

  //   // Check if Item Details are empty
  //   if (SelectDatalist.length === 0) {
  //     errorMessages.push("Please fill the Item Details.");
  //   }

  //   // Check if Payment Details are missing
  //   if (billAmount.length === 0 && initialState.ReimbursableAmount !== 0) {
  //     errorMessages.push("Please fill the Payment Details.");
  //   }

  //   // If there are any errors, show them all in one alert
  //   if (errorMessages.length > 0) {
  //     alert(errorMessages.join("\n"));
  //     return; // Exit the function to avoid proceeding further
  //   }

  //   let senddata = {
  //     billAmount: billAmount,
  //     SelectedPatient_list: SelectedPatient_list,
  //     NetAmount_CDmethod: NetAmount_CDmethod,
  //     SelectDatalist: SelectDatalist,
  //     BillingData: BillingData,
  //     initialState: initialState,
  //     Created_by: UserData?.username,
  //     Location: UserData?.location,
  //     selectedOption: selectedOption,
  //     ServiceProcedureForm: ServiceProcedureForm,
  //     EditId: IP_BillingData?.id
  //       ? IP_BillingData?.Type === "IPEdit"
  //         ? IP_BillingData?.id
  //         : ""
  //       : "",
  //     EditDue:
  //       IP_BillingData?.id && IP_BillingData?.Type === "OPDue"
  //         ? IP_BillingData?.id
  //         : "",
  //     // Paytype: Paytype.isCash === 'Yes' ? 'Cash' : 'Credit',
  //     Status: 'Estimated',
  //     RefundAmount: RemainingCredit,
  //     Request_Id: IP_BillingData.Request_Id,
  //     AdvanceTotal: AdvanceTotal,
  //   };

  //   console.log("senddata", senddata);
  //   if (Object.keys(IP_BillingData).length !== 0) {
  //     axios
  //       .post(`${UrlLink}Frontoffice/IPBillingEstimated_Link`, senddata)
  //       .then((res) => {
  //         console.log(res.data);
  //         setPostInvoice(res.data.InvoiceNo);
  //         setRecieptInvoice(res.data.ReceiptNo);
  //         setPostInvoiceDate(res.data.InvoiceDate);
  //         if (res?.data?.status === 'success') {
  //           navigate("/Home/CashierFolder");
  //           dispatchvalue({ type: "HrFolder", value: "IPBillingEstimatedList" });
  //           dispatchvalue({ type: "setPreviousFolder", value: null });
  //           dispatchvalue({ type: "showMenu", value: true })
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  useEffect(() => {
    if (IP_BillingData?.PatientCategory === "Insurance") {
      axios
        .get(
          `${UrlLink}Frontoffice/get_Insurance_amount?RegistrationId=${IP_BillingData.Registration_Id || IP_BillingData.Register_Id
          }&PatientCategory=${IP_BillingData.PatientCategory}`
        )
        .then((res) => {
          const ress = res.data;
          console.log("inssinsss", ress);
          setInsuranceAmount(ress);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [UrlLink, IP_BillingData.Registration_Id]);

  useEffect(() => {
    if (IP_BillingData.PatientCategory === "Insurance" && InsuranceAmount) {
      const updatedIns =
        InsuranceAmount.FinalSettlementAmount - initialState.totalAmountt;
      console.log("updatedIns", updatedIns);
      setInsuranceBalance(updatedIns);
    }
  }, [UrlLink, InsuranceAmount, IP_BillingData, initialState.totalAmountt]);

  useEffect(() => {
    if (IP_BillingData?.PatientCategory === "Client") {
      axios
        .get(
          `${UrlLink}Frontoffice/get_Insurance_amount?RegistrationId=${IP_BillingData.Registration_Id}&PatientCategory=${IP_BillingData.PatientCategory}`
        )
        .then((res) => {
          const ress = res.data;
          console.log("clieeentttt", ress);
          setClientAmount(ress);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [UrlLink, IP_BillingData.Registration_Id]);

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
      ServiceProcedureForm: IP_BillingData?.BillingType,
      Request_Id: IP_BillingData?.Request_Id,
      EditId:
        IP_BillingData?.id && IP_BillingData?.Type === "OPEdit"
          ? IP_BillingData?.id
          : "",
      EditDue:
        IP_BillingData?.id && IP_BillingData?.Type === "OPDue"
          ? IP_BillingData?.id
          : "",
      Paytype: Paytype.isCash === 'Yes' ? 'Cash' : 'Credit'
    };

    console.log("senddata", senddata);
    if (
      Object.keys(IP_BillingData).length !== 0
    ) {
      axios
        .post(`${UrlLink}Frontoffice/IPBilling_Link`, senddata)
        .then((res) => {
          console.log("OPpppppPosttt", res.data);
          setPostInvoice(res.data.InvoiceNo);
          let typp = Object.keys(res.data)[0];
          let mess = Object.values(res.data)[0];
          // Correct way to extract the message and type
          const tdata = {
            message: res.data.message || "Successful", // Ensure message exists
            type: "success", // Explicitly setting type since API returns multiple keys
          };
          dispatchvalue({ type: "toast", value: tdata })
          navigate("/Home/CashierFolder");
          dispatchvalue({ type: "HrFolder", value: "IPBillingList" });
          dispatchvalue({ type: "setPreviousFolder", value: null });
          dispatchvalue({ type: "showMenu", value: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: async () => {
      // Additional action after printing, if needed
      navigate("/Home/CashierFolder");
      dispatchvalue({ type: "HrFolder", value: "IPBillingEstimatedList" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });

  const handlePrintClose = () => {
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "IPBillingEstimatedList" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  }

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
                    fontSize: "18px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_addn_p037">
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
                        <h4>{IP_BillingData.AgeGender}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          D.O.A <span>:</span>
                        </label>
                        <h4>{IP_BillingData.AdmittionDate.split(" ")[0]}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{IP_BillingData.Address}</h4>
                      </div>
                      {/* Address */}
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{IP_BillingData.Registration_Id}</h4>
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
                        SelectDatalist1.reduce((acc, row) => {
                          if (!acc[row.ServiceType]) {
                            acc[row.ServiceType] = [];
                          }
                          acc[row.ServiceType].push(row);
                          return acc;
                        }, {})
                      ).map((serviceType, index) => {
                        const serviceRows = SelectDatalist1.filter(
                          (row) => row.ServiceType === serviceType
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.NetAmount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td colSpan="4" style={{ fontWeight: "bold" }}>
                                {serviceType}
                              </td>
                            </tr>
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td>{row.SelectItemName}</td>
                                <td>{row.Quantity}</td>
                                <td>{row.Amount}</td>
                                <td>{row.NetAmount}</td>
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
                            <>{row.Billpay_method}</>
                          ))}
                        </span>
                      </div>
                      {IP_BillingData.PatientCategory === "General" &&
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
                        <span>{initialState.totalAmountt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    fontSize: "18px",
                  }}
                >
                  Detailed Invoice
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
                        <h4>{IP_BillingData.AgeGender}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          D.O.A <span>:</span>
                        </label>
                        <h4>{IP_BillingData.AdmittionDate.split(" ")[0]}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{IP_BillingData.Address}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Consultant <span>:</span>
                        </label>
                        <h4>{IP_BillingData.Doctor_ShortName}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Mobile No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2 new_billing_address_2_new_up">
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
                        <h4>{IP_BillingData.ward}</h4>
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
                        <h4>{IP_BillingData.Date}</h4>


                      </div>
                      {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Invoice Time<span>:</span>
                        </label>
                          <h4>{PostInvoicedate}</h4>
                        <h4>19.09.2025</h4>                      </div> */}
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Discharge Date <span>:</span>
                        </label>
                        <h4>{IP_BillingData.Discharge_Date}</h4>
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
                          if (!acc[row.ServiceType]) {
                            acc[row.ServiceType] = [];
                          }
                          acc[row.ServiceType].push(row);
                          return acc;
                        }, {})
                      ).map((serviceType, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) => row.ServiceType === serviceType
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.NetAmount),
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
                                {serviceType}
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
                                  {row.SelectItemName}
                                </td>
                                <td style={{ border: "none" }}>
                                  {row.Quantity}
                                </td>
                                <td style={{ border: "none" }}>{row.Amount}</td>
                                <td style={{ border: "none" }}>
                                  {row.NetAmount}
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
                      {/* <div className="bill_body_new_phar">
                        <label>
                          Payment mode <span>:</span>
                        </label>
                        <span>
                          {billAmount.map((row, index) => (
                            <>{row.Billpay_method},</>
                          ))}
                        </span>
                      </div> */}
                      {IP_BillingData.PatientCategory === "General" &&
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
                        <span>{UserData?.Employeename}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Total Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      {/* <div className="bill_body_new_phar">
                        <label>
                          Gross Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmount}</span>
                      </div> */}
                      <div className="bill_body_new_phar">
                        <label>
                          Net Amount <span>:</span>
                        </label>
                        <span>{initialState.totalNetAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Advance Amount <span>:</span>
                        </label>
                        <span>{AdvanceTotal}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          {RemainingCredit > 0 ? "Refund Amount" : "Receivable Amount"} <span>:</span>
                        </label>
                        <span>{RemainingCredit}</span>
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
                    fontSize: "18px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_addn_p037">
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
                        <h4>{IP_BillingData.AgeGender}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          D.O.A <span>:</span>
                        </label>
                        <h4>{IP_BillingData.AdmittionDate.split(" ")[0]}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{IP_BillingData.Address}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{IP_BillingData.Registration_Id}</h4>
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
                          (f) => f.isReimbursable === "Yes"
                        ).reduce((acc, row) => {
                          if (!acc[row.ServiceType]) {
                            acc[row.ServiceType] = [];
                          }
                          acc[row.ServiceType].push(row);
                          return acc;
                        }, {})
                      ).map((serviceType, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) =>
                            row.ServiceType === serviceType &&
                            row.isReimbursable === "Yes"
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.NetAmount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td colSpan="4" style={{ fontWeight: "bold" }}>
                                {serviceType}
                              </td>
                            </tr>
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td>{row.SelectItemName}</td>
                                <td>{row.Quantity}</td>
                                <td>{row.Amount}</td>
                                <td>{row.NetAmount}</td>
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
                      {IP_BillingData.PatientCategory === "General" && <div className="bill_body_new_phar">
                        <label>
                          Payment mode <span>:</span>
                        </label>
                        <span>
                          {billAmount.map((row, index) => (
                            <>{row.Billpay_method},</>
                          ))}
                        </span>
                      </div>}
                      {IP_BillingData.PatientCategory === "General" &&
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
                    fontSize: "18px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_addn_p037">
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
                        <h4>{IP_BillingData.AgeGender}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          D.O.A <span>:</span>
                        </label>
                        <h4>{IP_BillingData.AdmittionDate.split(" ")[0]}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{IP_BillingData.Address}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{IP_BillingData.Registration_Id}</h4>
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
                          (f) => f.isReimbursable === "No"
                        ).reduce((acc, row) => {
                          if (!acc[row.ServiceType]) {
                            acc[row.ServiceType] = [];
                          }
                          acc[row.ServiceType].push(row);
                          return acc;
                        }, {})
                      ).map((serviceType, index) => {
                        const serviceRows = SelectDatalist.filter(
                          (row) =>
                            row.ServiceType === serviceType &&
                            row.isReimbursable === "No"
                        );
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.NetAmount),
                          0
                        );

                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td colSpan="4" style={{ fontWeight: "bold" }}>
                                {serviceType}
                              </td>
                            </tr>
                            {serviceRows.map((row, idx) => (
                              <tr key={idx}>
                                <td>{row.SelectItemName}</td>
                                <td>{row.Quantity}</td>
                                <td>{row.Amount}</td>
                                <td>{row.NetAmount}</td>
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
                            <>{row.Billpay_method},</>
                          ))}
                        </span>
                      </div>
                      {IP_BillingData.PatientCategory === "General" &&
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
                        <span>{initialState.totalAmountt}</span>
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
            <h3>IP Billing Edit</h3>

            <div className="csdcedw_kl88">
              <div className="RegisBillSearchForm_1 RegisBillSearchForm_1_mmmm">
                <label>
                  Search <span>:</span>
                </label>
                <div className="Search_patient_icons">
                  <input
                    type="text"
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
                    disabled={Object.values(IP_BillingData).length !== 0}
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
                Object.keys(RegisterData)
                  .filter((p) => {
                    // If the PatientCategory is 'General', exclude 'PatientCategoryName'
                    if (
                      IP_BillingData.PatientCategory === "General" &&
                      p === "PatientCategoryName"
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map((field, index) => (
                    <div
                      className="RegisBillForm_1 RegisBillForm_1_M "
                      key={index}
                    >
                      <label htmlFor={`${field}_${index}`}>
                        {field === "AgeGender"
                          ? "Age/Gender"
                          : field === "PatientCategoryName"
                            ? IP_BillingData.PatientCategory === "Insurance"
                              ? "Insurance Name"
                              : "Client Name"
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
                        "WardName",
                      ].includes(field) ? (
                        <input
                          style={{ width: "100px" }}
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
                      ) : (
                        field === "Address" && (
                          <textarea
                            name="Address"
                            value={RegisterData[field]}
                          />
                        )
                      )}
                    </div>
                  ))}
            </div>

            <div className="RegisBillFormcon">
              <div className="sjhdcys6">
                <label>
                  <input
                    type="checkbox"
                    checked={isClient.isClient === "Yes"}
                    onChange={HandleClientCheck}
                  />
                  Client/Insurance/TPA
                </label>
              </div>
            </div>
            {isClient.isClient === "Yes" ? (
              <>
                <div className="RegisBillFormcon">
                  {Object.keys(isClient)
                    .filter(
                      (f) =>
                        f !== "isClient" &&
                        f !== "CoPaymentTypeinp" &&
                        f !== "PreAuthTypeinp"
                    )
                    .map((field, ind) => (
                      <div className="RegisBillForm_1" key={ind}>
                        <label htmlFor={`${ind}_${field}`}>
                          {field === "CoPaymentdeducted"
                            ? "Co-Payment deducted"
                            : formatLabel(field)}
                          <span>:</span>
                        </label>
                        {[
                          "CoPaymentType",
                          "CoPaymentLogic",
                          "CoPaymentdeducted",
                          "PreAuthType",
                        ].includes(field) ? (
                          <div className="input-select-container">
                            <select
                              id={`${ind}_${field}`}
                              name={field}
                              value={isClient[field]}
                              onChange={HandleOnClient}
                            >
                              {["CoPaymentType", "PreAuthType"].includes(
                                field
                              ) &&
                                ["Percentage", "Value"].map((p, index) => (
                                  <option key={index} value={p}>
                                    {p}
                                  </option>
                                ))}
                              {field === "CoPaymentLogic" &&
                                ["PreAuth", "Final"].map((row, index) => (
                                  <option key={index} value={row}>
                                    {row}
                                  </option>
                                ))}
                              {field === "CoPaymentdeducted" &&
                                ["PreAuth", "Final"].map((row, index) => (
                                  <option key={index} value={row}>
                                    {row}
                                  </option>
                                ))}
                            </select>
                            {/* Input field next to select for CoPaymentType and PreAuthType */}
                            {field === "CoPaymentType" && (
                              <input
                                type="text"
                                name="CoPaymentTypeinp" // Unique name for input fields
                                value={isClient.CoPaymentTypeinp || ""} // Accessing the state for input field
                                onChange={HandleOnClient}
                                placeholder="Enter value"
                              />
                            )}
                            {field === "PreAuthType" && (
                              <input
                                type="text"
                                name="PreAuthTypeinp" // Unique name for input fields
                                value={isClient.PreAuthTypeinp || ""} // Accessing the state for input field
                                onChange={HandleOnClient}
                                placeholder="Enter value"
                              />
                            )}
                          </div>
                        ) : [
                          "PreAuthAmount",
                          "PreAuthApprovalNo",
                          "PolicyNo",
                        ].includes(field) ? (
                          <input
                            type="text"
                            name={field}
                            value={isClient[field]}
                            onChange={HandleOnClient}
                            placeholder={
                              field === "PreAuthAmount" ? "0.00" : ""
                            }
                          />
                        ) : (
                          <input
                            type="date"
                            name={field}
                            value={isClient[field]}
                            onChange={HandleOnClient}
                          />
                        )}
                      </div>
                    ))}
                </div>

                <div className="Bill_Btn">
                  <button onClick={handlesubmitclient}>Submit</button>
                </div>
              </>
            ) : null}

            {/* {
              AppointmentRegisType === "IP" && (
                <div className="RegisBillFormcon">
                  <div className="sjhdcys6">
                    <label>
                      <input
                        type="checkbox"
                        checked={AdvanceAmount?.isAdvance === "Yes"}
                        onChange={HandleAdvance}
                      />
                      Advance Amount
                    </label>
                  </div>
                </div>
              )
            } */}
            {/* {
              AdvanceAmount.isAdvance === 'Yes' && (
                <>
                  <div className="RegisBillFormcon">
                    <div className="sjhdcys6">
                      <label>Advance Amount</label>
                      <input
                        type="text"
                        value={AdvanceAmount.AdvanceAmount}
                        onChange={(e) => {
                          setAdvanceAmount((prev) => ({
                            ...prev,
                            AdvanceAmount: e.target.value,
                          }))
                        }}
                      />
                    </div>
                  </div>
                  <div className="Bill_Btn">
                    <button onClick={handleAdvanceSubmit}>Submit</button>
                  </div>

                  {
                    AdvanceAmountGet.length !== 0 && (
                      <ReactGrid columns={Advancecolumns} RowData={AdvanceAmountGet} />
                    )
                  }
                </>
              )
            } */}

            <h3>Services</h3>

            <div className="RegisBillFormcon">
              <div className="Service_bill">
                {Object.keys(ServiceProcedure)
                  .filter(
                    (p) =>
                      p !== "ServiceSubCatId" &&
                      p !== "Subcategorypk" &&
                      p !== "Categoryid" &&
                      p !== "type" &&
                      p !== "Total"
                  )
                  .map((field, indx) => (
                    <div className="RegisForm_1" key={indx}>
                      <label htmlFor={`${field}_${indx}`}>
                        {formatLabel(field)}
                        <span>:</span>
                      </label>
                      {[
                        "ServiceCategory",
                        "ServiceSubCategory",
                        "Rate",
                        "Quantity",
                      ].includes(field) && (
                          <input
                            type="text"
                            name={field} // Add the name attribute here
                            value={ServiceProcedure[field]}
                            list={`${field}_ServiceCategory`}
                            onChange={HandleOnchangeService}
                            autoComplete="off"
                          // onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                          />
                        )}
                      {
                        <datalist id={`${field}_ServiceCategory`}>
                          {field === "ServiceCategory" &&
                            ServiceCategoryData?.map((row, indx) => (
                              <option
                                key={indx}
                                value={`${row.service_category_id}-${row.service_name}`}
                              >
                                {row.service_name}
                              </option>
                            ))}
                          {field === "ServiceSubCategory" &&
                            Array.isArray(ServiceSubCategoryData) &&
                            ServiceSubCategoryData.map((row, indx) => (
                              <option
                                key={indx}
                                value={`${row.pk}-${row.service_subcategory}`}
                              >
                                {row.service_subcategory}
                              </option>
                            ))}
                        </datalist>
                      }
                    </div>
                  ))}
              </div>
              <div className="Register_btn_con added_Register_btn_con">
                <button
                  className="RegisterForm_1_btns added_RegisterForm_1_btns"
                  onClick={Additemstobillfun}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="new-patient-registration-form">
              <div className="Selected-table-container444 DEWSDXWED">
                <table className="selected-medicine-table222 EDWEDE">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th style={{ width: "5px" }}>isReimbursable</th>
                      <th>Voucher No</th>
                      <th>Date</th>
                      <th>Service Type</th>
                      <th>Service Name</th>
                      <th>Charge</th>
                      <th>Quantity</th>
                      <th>Amount </th>
                      <th>Discount Type</th>
                      <th>Discount</th>
                      {/* <th>GST %</th>
                      <th>GST Charge</th> */}
                      <th>Net Amount</th>
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
                              checked={row.isReimbursable === "Yes"}
                              onChange={(e) =>
                                handleReimbursableChange(e, index)
                              }
                            />
                          </td>
                          <td>{row.VoucherNo}</td>
                          <td>{row.Date}</td>
                          <td>{row.ServiceType}</td>
                          <td>{row.SelectItemName}</td>
                          <td>{row.Charges || "-"}</td>
                          <td>{row.Quantity || "-"}</td>
                          <td>{row.Amount || "-"}</td>
                          <td>{row.DiscountType || "-"}</td>
                          <td>{row.Discount || "-"}</td>

                          <td>{row.NetAmount || "-"}</td>

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
                </div>

                <div className="summary-container addded_sumry_contre">
                  <div className="WDWDWD_OO">
                    <div className="edcwjkediu87_mmmm">
                      <div>
                        {/* <div className="sriii_shvdjsd">
                          <label>
                            <input
                              type="checkbox"
                              name="isCash"
                              checked={Paytype.isCash === "Yes"}
                              onChange={handlePayType}
                            />
                            Cash
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="isCredit"
                              checked={Paytype.isCredit === "Yes"}
                              onChange={handlePayType}
                            />
                            Credit
                          </label>
                        </div> */}

                        {/* {Paytype.isCash === "Yes" && (
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
                            </div> */}
                        <br />
                        {AppointmentRegisType === "IP" &&
                          IP_BillingData.PatientCategory === "General" && (
                            <div className="edwqw_c2">
                              <label>
                                Total Advance <span>:</span>
                              </label>
                              <input value={AdvanceTotal} readOnly />
                            </div>
                          )}
                        {AppointmentRegisType === "IP" &&
                          IP_BillingData.PatientCategory === "General" && (
                            <div className="edwqw_c2">
                              <label>
                                Remaining Credit <span>:</span>
                              </label>
                              <input
                                style={
                                  RemainingCredit < 50000
                                    ? { backgroundColor: "Red" }
                                    : {}
                                }
                                value={RemainingCredit}
                                readOnly
                              />
                            </div>
                          )}

                        {AppointmentRegisType === "IP" &&
                          IP_BillingData.PatientCategory === "Insurance" && (
                            <div className="edwqw_c2">
                              <label>
                                Pre-Auth Amount on{" "}
                                {InsuranceAmount?.PreAuthDate}
                              </label>
                              <input
                                value={InsuranceAmount?.PreAuthAmount}
                                readOnly
                              />
                            </div>
                          )}
                        {AppointmentRegisType === "IP" &&
                          IP_BillingData.PatientCategory === "Insurance" && (
                            <div className="edwqw_c2">
                              <label>Final Settltement Amount</label>
                              <input
                                value={InsuranceAmount?.FinalSettlementAmount}
                                readOnly
                              />
                            </div>
                          )}
                        {AppointmentRegisType === "IP" &&
                          IP_BillingData.PatientCategory === "Insurance" && (
                            <div className="edwqw_c2">
                              <label>Total Balance Amount</label>
                              <input value={InsuranceBalance} readOnly />
                            </div>
                          )}

                        {AppointmentRegisType === "IP" &&
                          IP_BillingData.PatientCategory === "Client" && (
                            <div className="edwqw_c2">
                              <label>Pre-Auth Amount</label>
                              <input
                                value={ClientAmount?.FinalSettlementAmount}
                                readOnly
                              />
                            </div>
                          )}
                        <br />
                        {/* </>)
                        } */}
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
                        <label>Advance Amount :</label>
                        <input style={{ backgroundColor: "yellow" }} value={AdvanceTotal} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Total Amount:</label>
                        <input value={initialState.totalAmount} readOnly />
                      </div>
                      {/* <div className="clm-itm-stl">
                        <label>Item Amount :</label>
                        <input
                          style={{ backgroundColor: "yellow" }}
                          value={initialState.totalNetAmount}
                          readOnly
                        />
                      </div> */}
                      <div className="clm-itm-stl">
                        <label>{RemainingCredit > 0 ? "Refund Amount" : "Receivable Amount"}:</label>
                        <input value={Math.abs(RemainingCredit).toFixed(2)} readOnly />
                      </div>
                    </div>
                  </div>

                  <br />
                </div>

                <div className="Register_btn_con added_Register_btn_con">
                  {/* <button
                    style={{width: "60px",height:"30px"}}
                    className="RegisterForm_1_btns added_RegisterForm_1_btns"
                    onClick={() => handleSaveSubmit(false, false, true)} // Pass a second parameter for "PrintReimbuseable"
                  >
                    Save
                  </button> */}
                  <select
                    className="print_option_bill"
                    name="printoption"
                    value={printoption}
                    onChange={(e) => setprintoption(e.target.value)} // Update state with selected value
                  >
                    {[
                      "PrintDetailed",
                      "PrintSummary",
                      "PrintNon-Reimbursable",
                      "PrintReimbursable",
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
                  ) : printoption === "PrintSummary" ? (
                    <button
                      className="RegisterForm_1_btns added_RegisterForm_1_btns"
                      onClick={() => handleSubmit(true)}
                    >
                      Print
                    </button>
                  ) : printoption === "PrintReimbursable" ? (
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
              </div>
            </div>

            <ToastAlert Message={toast.message} Type={toast.type} />
          </div>
        </>
      ) : isPrintSummary ? (
        <ForPrintSumData />
      ) : printoption === "PrintReimbursable" ? (
        <ForPrintReimbData />
      ) : printoption === "PrintNon-Reimbursable" ? (
        <ForPrintNon_ReimbData />
      ) : (
        <ForPrintData />
      )}
    </>
  );
};


export default IPEditBilling
