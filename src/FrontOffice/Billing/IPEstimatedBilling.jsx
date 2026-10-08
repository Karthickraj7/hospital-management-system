import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  differenceInYears,
  format,
  startOfYear,
  subYears,
  isBefore,
  formatDate,
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
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";


const IPEstimatedBilling = () => {
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
  const FormTime = format(currentDate, "hh:mm:ss a");
  // For Lab
  const [franchaisename, setFranchaisename] = useState("Basic");
  const [franchaise, setfranchaises] = useState([]);
  const [franchaisecolumnname, setfranchaisecolumnname] = useState("Basic");
  const [Department, setDepartment] = useState([]);
  const [overallRateCard, setoverallRateCard] = useState([]);
  const [testType, setTestType] = useState("Individual");

    const [submitBut, setSubmitBut] = useState(false);
  

  const [formData, setFormData] = useState({
    SubDepartment_Code: "",
    SubDepartment_Name: "",
    testType: testType,
  });

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


  const [OTProceduredatas,setOTProceduredatas] = useState([]);


   useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Service_Procedure_Master_Detials_link?MasterType=Procedure&Type=&SearchBy=`)
      .then((response) => {
        const OTData = response.data;

        setOTProceduredatas(OTData);
        
      })
      .catch((error) => {
        console.error(error);
      });
  }, [UserData?.location, UrlLink]);

   const [Pharmadetails, setPharmadetails] = useState([]);
   const [Pharmarefunddetails,setPharmarefunddetails] = useState([]);
   const [grandTotal, setGrandTotal] = useState(0);
   const [grandrefundTotal, setGrandrefundTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!IP_BillingData.Registration_Id || !IP_BillingData.PatientId) return; // Skip if IDs are missing

    const fetchPharmacyDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${UrlLink}Frontoffice/IPBilling_Pharmacy_credit_get_details`,
          {
            params: {
              Registration_Id: IP_BillingData.Registration_Id,
              PatientId: IP_BillingData.PatientId,
            },
          }
        );

        setPharmadetails(response.data.pharmacy_list || []);
        setGrandTotal(response.data.grand_total || 0);
        setPharmarefunddetails(response.data.refund_list || []);
        setGrandrefundTotal(response.data.total_refunded || 0);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
        setPharmadetails([]);
        setGrandTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacyDetails();
  }, [IP_BillingData.Registration_Id, IP_BillingData.PatientId]);


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

  const [OTDetails,setOTDetails] = useState({
 
      Type : '',
      Procedurename : '',
      Procedureid : '',
      FeeType : '',
      Rate : ''
    
  })

  const [OTFeedatas,setOTFeedatas] = useState([]);

  console.log('OTFeedatas selectedFeeeeeeee', OTFeedatas)


  
  useEffect(() => {
    if (OTDetails.Procedureid && OTDetails.Type) {
      axios
        .get(`${UrlLink}OT/OTItem_List_For_IP_Estimated_Bill`, {
          params: {
            Procedureid: OTDetails.Procedureid,
            Type: OTDetails.Type,
            Registration_Id : IP_BillingData?.Registration_Id
          },
        })
        .then((response) => {
          const feedatas = Array.isArray(response.data) ? response.data : [];
          setOTFeedatas(feedatas);
          setOTDetails((prev) => ({
            ...prev,
            FeeType: "",
            Rate: "",
          }));
        })
        .catch((error) => {
          console.error("Error fetching OT fee data:", error);
          setOTFeedatas([]);
        });
    } else {
      setOTFeedatas([]);
      setOTDetails((prev) => ({
        ...prev,
        FeeType: "",
        Rate: "",
      }));
    }
  }, [OTDetails.Procedureid, OTDetails.Type]);
 
 

  const handleOTChange = (e) => {
  const { name, value } = e.target;
 
  if (name === "Procedurename") {
    const value1 = value.split("|");
    const value2 = value1[0]?.trim() || ""; // Trimmed ID
    const value3 = value1.length > 1 ? value1[1].trim() : ""; // Procedure name
 
    console.log(value2, "procedureiddddddd");
 
    const selectedProcedure = OTProceduredatas.find(
      (item) => item.id.toString() === value2 // Use strict equality and convert to string
    );
 
    console.log(selectedProcedure, "selectedProcedure");
 
    setOTDetails((prev) => ({
      ...prev,
      Procedurename: selectedProcedure ? selectedProcedure.ProcedureName : value3 || value2,
      Procedureid: selectedProcedure ? selectedProcedure.id : "",
      FeeType: "", // Clear FeeType when procedure changes
      Rate: "", // Clear Rate when procedure changes
    }));
  } 
  else if (name === "FeeType") {
    const value1 = value.split("|");
    const value2 = value1[0]?.trim() || ""; // Trimmed ID
    const value3 = value1.length > 1 ? value1[1].trim() : "";
 
    console.log(value2, 'selectedFeeeeeeee vallllll');
   
    // Fix: Look for matching fee based on the procedure and fee type
    const selectedFee = OTFeedatas.find((item) => {
      const matchesSno = item.sno.toString() === value2;
      const matchesSubcategory = item.service_subcategory.includes(value3) ||
                                value3.includes(item.service_subcategory);
      return matchesSno || matchesSubcategory;
    });
 
    console.log(selectedFee, 'selectedFeeeeeeee');
 
    setOTDetails((prev) => ({
      ...prev,
      FeeType: selectedFee ? selectedFee.service_subcategory : value3 || value2,
      Rate: selectedFee ? selectedFee.rate : ""
    }));
  } else {
    setOTDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};
 

  //  const Addotitemforbill = () => {
  //   if (!OTDetails.FeeType || !OTDetails.Rate) {
  //     console.warn("Please select a valid Fee Type and Rate");
  //     return;
  //   }
 
  //   // Find the selected fee data from OTFeedatas
  //   const selectedFee = OTFeedatas.find(
  //     (item) => item.service_subcategory === OTDetails.FeeType
  //   );
 
  //   console.log(selectedFee,'selectedFee')
 
  //   if (!selectedFee) {
  //     console.warn("Selected Fee Type not found in fee data");
  //     return;
  //   }
 
  //   // Construct the item to add
  //   const listdata = {
  //     ServiceType: selectedFee.category || "OT",
  //     SelectItemName: selectedFee.service_subcategory,
  //     Quantity: parseFloat(selectedFee.Units) || 1,
  //     Charges: parseFloat(selectedFee.rate) || 0,
  //     Amount: parseFloat(selectedFee.rate) || 0,
  //     NetAmount: (parseFloat(selectedFee.final_rate) || 0) * (parseFloat(selectedFee.Units) || 1),
  //     isReimbursable: selectedFee.isReimbursable || "Yes",
  //     Date: selectedFee.Date || new Date().toISOString().split("T")[0],
  //     DiscountType : selectedFee.discount_value_display,
  //     Discountamt: selectedFee.discount_amount,
  //     Discount : selectedFee.discount_amount,
  //     Discountmethod : selectedFee.discount_method,
     
  //   };
 
  //   // Check for duplicates
  //   const exists = SelectDatalist.find(
  //     (item) => item.SelectItemName === listdata.SelectItemName
  //   );
 
  //   if (exists) {
  //     // Optionally update existing item or skip adding
  //     console.log(`Item "${listdata.SelectItemName}" already exists, updating...`);
  //     const updatedItems = SelectDatalist.map((item) =>
  //       item.SelectItemName === listdata.SelectItemName ? { ...item, ...listdata } : item
  //     );
  //     setSelectDatalist(updatedItems);
  //   } else {
  //     // Add new item with S_No
  //     setSelectDatalist((prev) => [
  //       ...prev,
  //       { S_No: prev.length + 1, ...listdata },
  //     ]);
  //   }
 
  //   // Clear FeeType and Rate after adding
  //   setOTDetails((prev) => ({
  //     ...prev,
  //     FeeType: "",
  //     Rate: "",
  //   }));
  // };
 
 const Addotitemforbill = () => {
    if (!OTDetails.FeeType || !OTDetails.Rate || !OTDetails.Type) {
      console.warn("Please select valid Fee Type, Rate, and Type");
      return;
    }
 
    // Find the selected fee data from OTFeedatas
    const selectedFee = OTFeedatas.find(
      (item) => item.service_subcategory === OTDetails.FeeType
    );
 
    console.log(selectedFee,'selectedFee')
 
    if (!selectedFee) {
      console.warn("Selected Fee Type not found in fee data");
      return;
    }
 
    // Calculate rates based on Type (WARD/ROOM)
    const isWard = OTDetails.Type === 'WARD';
    const baseRate = parseFloat(selectedFee.rate) || 0;
    const units = parseFloat(selectedFee.Units) || 1;
    
    let finalRate, discountAmount, discountPercentage, discountValueDisplay, discountMethod;

    console.log('Base Rate:', baseRate, 'Units:', units, 'isWard:', isWard);
    
    if (isWard) {
      // Apply 20% discount for WARD type
      discountPercentage = 20;
      discountAmount = (baseRate * discountPercentage) / 100;
      finalRate = baseRate - discountAmount;
      discountValueDisplay = `${discountPercentage}%`;
      discountMethod = 'PERCENTAGE';
      
      // Check if backend already provided discount (for IsSeparateFee=true)
      if (selectedFee.has_discount && selectedFee.discount_amount > 0) {
        // Use backend calculated discount if available
        finalRate = parseFloat(selectedFee.final_rate) || finalRate;
        discountAmount = parseFloat(selectedFee.discount_amount) || discountAmount;
        discountValueDisplay = selectedFee.discount_value_display || discountValueDisplay;
        discountMethod = selectedFee.discount_method || discountMethod;
      }
    } else {
      // For ROOM type, no additional discount
      finalRate = baseRate;
      discountAmount = 0;
      discountValueDisplay = "-";
      discountMethod = "";
    }
 
    // Construct the item to add
    const listdata = {
      ServiceType: selectedFee.category || "OT",
      SelectItemName: selectedFee.service_subcategory,
      Quantity: units,
      Charges: baseRate,
      Amount: baseRate * units,
      NetAmount: finalRate * units,
      isReimbursable: selectedFee.isReimbursable || "Yes",
      Date: selectedFee.Date || new Date().toISOString().split("T")[0],
      DiscountType: discountValueDisplay,
      Discountamt: discountAmount,
      Discount: discountAmount,
      Discountmethod: discountMethod,
      BaseRate: baseRate,
      FinalRate: finalRate,
      RoomType: OTDetails.Type,
      OriginalDiscountFromBackend: selectedFee.discount_amount || 0,
      HasBackendDiscount: selectedFee.has_discount || false
    };
 
    // Check for duplicates
    const exists = SelectDatalist.find(
      (item) => item.SelectItemName === listdata.SelectItemName
    );
 
    if (exists) {
      // Update existing item
      console.log(`Item "${listdata.SelectItemName}" already exists, updating...`);
      const updatedItems = SelectDatalist.map((item) =>
        item.SelectItemName === listdata.SelectItemName ? { ...item, ...listdata } : item
      );
      setSelectDatalist(updatedItems);
    } else {
      // Add new item with S_No
      setSelectDatalist((prev) => [
        ...prev,
        { S_No: prev.length + 1, ...listdata },
      ]);
    }
 
    // Clear FeeType and Rate after adding
    setOTDetails((prev) => ({
      ...prev,
      FeeType: "",
      Rate: "",
    }));
  };

  const [RadiologyNames, setRadiologyNames] = useState([]);
  const [RadioNames, setRadioNames] = useState([]);
  const [PostInvoice, setPostInvoice] = useState(null);
  const [RecieptInvoice, setRecieptInvoice] = useState(null);
  const [PostInvoicedate, setPostInvoiceDate] = useState(null);
  const [BillingData, setBillingData] = useState({
    InvoiceNo: "",
    InvoiceDate: Formdate,
    InvoiceTime: FormTime,
    DoctorName: "",
    DoctorId: "",
    Billedby: UserData?.username || '',

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

const serviceSubCategoryRef = useRef(null);

  const [ServiceProcedure, setServiceProcedure] = useState({
    ServiceDate:Formdate,
    ServiceCategory: '',
    Categoryid: '',
    ServiceSubCategory: '',
    ServiceSubCatId: '',
    Subcategorypk: '',
    Rate: '',
    Quantity: 1,
    Total: '',
    type: '',
    DiscountType: "",
    Discount: "",
    Discountamt: "",
    Discountmethod: "",
    Discountval: "",
    CGHScode : "",
    ISWardConsession : "",
    ISWardPercentage : "",

  });

  


  console.log(ServiceProcedure,'ServiceProcedure')

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

  const [printoption, setprintoption] = useState("PrintSummary");
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
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [
  //         specializationResponse,
  //         referralDoctorResponse,
  //         EmployeeResponse,
  //         DoctorResponse,
  //         FlaggData,
  //         ReligionData,
  //         AllDoctorData,
  //         Insurancedata,
  //         ClientData,
  //         DonationData,
  //       ] = await Promise.all([
  //         axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
  //         axios.get(`${UrlLink}Masters/get_referral_doctor_Name_Detials`),
  //         axios.get(`${UrlLink}Frontoffice/get_Employee_by_PatientCategory`),
  //         axios.get(`${UrlLink}Frontoffice/get_DoctorId_by_PatientCategory`),
  //         axios.get(`${UrlLink}Masters/Flagg_color_Detials_link`),
  //         axios.get(`${UrlLink}Masters/Relegion_Master_link`),
  //         axios.get(`${UrlLink}Masters/get_All_doctor_Name_Detials`),
  //         axios.get(`${UrlLink}Masters/get_insurance_data_registration`),
  //         axios.get(`${UrlLink}Masters/get_client_data_registration`),
  //         axios.get(`${UrlLink}Masters/get_donation_data_registration`),
  //       ]);

  //       console.log("spppeeecccc", specializationResponse);

  //       setSpecializationData(
  //         Array.isArray(specializationResponse.data)
  //           ? specializationResponse.data
  //           : []
  //       );
  //       setReferralDoctorData(
  //         Array.isArray(referralDoctorResponse.data)
  //           ? referralDoctorResponse.data
  //           : []
  //       );
  //       setEmployeeData(
  //         Array.isArray(EmployeeResponse.data) ? EmployeeResponse.data : []
  //       );
  //       setDoctorIdData(
  //         Array.isArray(DoctorResponse.data) ? DoctorResponse.data : []
  //       );
  //       setFlaggData(Array.isArray(FlaggData.data) ? FlaggData.data : []);
  //       setReligionData(
  //         Array.isArray(ReligionData.data) ? ReligionData.data : []
  //       );
  //       setAllDoctorData(
  //         Array.isArray(AllDoctorData.data) ? AllDoctorData.data : []
  //       );
  //       setInsuranceData(
  //         Array.isArray(Insurancedata.data) ? Insurancedata.data : []
  //       );
  //       setClientData(Array.isArray(ClientData.data) ? ClientData.data : []);
  //       setDonationData(
  //         Array.isArray(DonationData.data) ? DonationData.data : []
  //       );
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [UrlLink]);

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

      // let updatedTotals = {
      //   totalUnits: 0,
      //   totalAmount: 0,
      //   totalDiscount: 0,
      //   totalGstamount: 0,
      //   totalNetAmount: 0,
      // };

      // let reimbursableTotals = {
      //   totalUnits: 0,
      //   totalAmount: 0,
      //   totalDiscount: 0,
      //   totalGstamount: 0,
      //   totalNetAmount: 0,
      // };

      // let nonReimbursableTotals = {
      //   totalUnits: 0,
      //   totalAmount: 0,
      //   totalDiscount: 0,
      //   totalGstamount: 0,
      //   totalNetAmount: 0,
      // };

      // // Corrected filtering logic based on isReimbursable === "Yes"
      // const reimbursableItems = SelectDatalist.filter((item) => item.isReimbursable === "Yes");
      // const nonReimbursableItems = SelectDatalist.filter((item) => item.isReimbursable !== "Yes");

      // // Function to calculate totals for a given list of items
      // const calculateTotals = (items) => {
      //   return items.reduce(
      //     (totals, item) => {
      //       totals.totalUnits += +item.Quantity || 0;
      //       totals.totalAmount += parseFloat(item.Charges) || 0;
      //       totals.totalDiscount += parseFloat(item.Discount) || 0;
      //       totals.totalGstamount += parseFloat(item.GST) || 0;
      //       totals.totalNetAmount += parseFloat(item.NetAmount) || 0;
      //       return totals;
      //     },
      //     { totalUnits: 0, totalAmount: 0, totalDiscount: 0, totalGstamount: 0, totalNetAmount: 0 }
      //   );
      // };

      // // Calculate totals separately for reimbursable and non-reimbursable items
      // reimbursableTotals = calculateTotals(reimbursableItems);
      // nonReimbursableTotals = calculateTotals(nonReimbursableItems);

      // // Sum up both categories for the overall total
      // updatedTotals = {
      //   totalUnits: reimbursableTotals.totalUnits + nonReimbursableTotals.totalUnits,
      //   totalAmount: reimbursableTotals.totalAmount + nonReimbursableTotals.totalAmount,
      //   totalDiscount: reimbursableTotals.totalDiscount + nonReimbursableTotals.totalDiscount,
      //   totalGstamount: reimbursableTotals.totalGstamount + nonReimbursableTotals.totalGstamount,
      //   totalNetAmount: reimbursableTotals.totalNetAmount + nonReimbursableTotals.totalNetAmount,
      // };

      // // Apply Discount Logic
      // let additionalDiscount = 0;
      // if (NetAmount_CDmethod.Amount !== "" && NetAmount_CDmethod.Method !== "") {
      //   if (NetAmount_CDmethod.Method === "Percentage") {
      //     additionalDiscount = (updatedTotals.totalAmount * NetAmount_CDmethod.Amount) / 100;
      //   } else if (NetAmount_CDmethod.Method === "Cash") {
      //     additionalDiscount = parseFloat(NetAmount_CDmethod.Amount) || 0;
      //   }
      // }

      // // Ensure the discount does not exceed the total amount
      // let finalDiscount = Math.min(
      //   updatedTotals.totalNetAmount,
      //   + additionalDiscount
      // );

      // // Adjust net amount after applying discount
      // let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;

      // // Corrected GST calculation based on the updated taxable amount
      // // let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;

      // // Correct total net amount after discount and GST
      // let finalNetAmount = totalTaxableAmount;

      // let AmountStatus = RemainingCredit > 0 ? 'Refund' : 'Pay'
      // // Preserve PaidAmount and calculate BalanceAmount correctly
      // setinitialState((prevState) => ({
      //   ...prevState,
      //   totalItems: SelectDatalist.length,
      //   totalTaxable: updatedTotals.totalAmount.toFixed(2),
      //   totalUnits: updatedTotals.totalUnits,
      //   totalDiscount: finalDiscount.toFixed(2),
      //   // totalGstamount: updatedGst.toFixed(2),
      //   totalNetAmount: (Math.round(finalNetAmount)).toFixed(2),
      //   totalAmount: finalNetAmount.toFixed(2),
      //   BalanceAmount: (Math.round(finalNetAmount - prevState.PaidAmount) - finalNetAmount).toFixed(2),
      //   Roundoff: (Math.round(finalNetAmount) - finalNetAmount).toFixed(2),

      //   // Add separate reimbursable and non-reimbursable totals
      //   reimbursableTotal: reimbursableTotals.totalNetAmount.toFixed(2),
      //   nonReimbursableTotal: nonReimbursableTotals.totalNetAmount.toFixed(2),
      //   AmountStatus: AmountStatus,
      // }));
      // // Update previous totals reference
      // prevTotalsRef.current = { ...updatedTotals };
    
    

      //
    
    // for kmccccccccccccccccccccccccccccccccccccc


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
        updatedTotals.totalAmount += parseFloat(item.Amount) || 0;
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
      let finalDiscount = Math.min(updatedTotals.totalNetAmount,additionalDiscount);
      let ItemGrandTotal = updatedTotals.totalAmount;
      // Adjust net amount after applying discount
      let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;

      const pharmacyGrandTotal = Pharmadetails.reduce(
        (sum, item) => sum + parseFloat(item.Net_Amount || 0),
        0
      );

      const pharmacyrefundTotal = Pharmarefunddetails.reduce(
        (sum, item) => sum + parseFloat(item.PaidAmount || 0),
        0
      );

      const Pharmacyfinalamt = pharmacyGrandTotal - pharmacyrefundTotal
      let Itempharmacygrandtotal = ItemGrandTotal + Pharmacyfinalamt;
      console.log(Pharmacyfinalamt,'pharmacyGrandTotal generalll')

      totalTaxableAmount = totalTaxableAmount + Pharmacyfinalamt;

      console.log(totalTaxableAmount,'totalTaxableAmount')


      let SchemeDiscount = updatedTotals.totalDiscount;

      let aftersdis = (parseFloat(Itempharmacygrandtotal|| 0) - SchemeDiscount).toFixed(2)


      console.log('inside SchemeDiscount',SchemeDiscount)

      // Corrected GST calculation based on the updated taxable amount
      // let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;

      // Correct total net amount after discount and GST
      let finalNetAmount = totalTaxableAmount;
      let AmountStatus = RemainingCredit > 0 ? 'Refund' : 'Pay'

      // Preserve PaidAmount and calculate BalanceAmount correctly
      setinitialState((prevState) => ({
        ...prevState,
        ItemGrandTotal : ItemGrandTotal,
        Itempharmacygrandtotal : Itempharmacygrandtotal,
        totalItems: SelectDatalist.length,
        totalTaxable: finalNetAmount.toFixed(2),
        totalUnits: updatedTotals.totalUnits,
        totalDiscount: finalDiscount.toFixed(2),
        // totalGstamount: updatedGst.toFixed(2),
        totalNetAmount: (Math.round(finalNetAmount)).toFixed(2),
        totalAmount: finalNetAmount.toFixed(2),
        BalanceAmount: (Math.round(finalNetAmount - prevState.PaidAmount)).toFixed(2),
        Roundoff: (Math.round(finalNetAmount) - finalNetAmount).toFixed(2),
        AmountStatus: AmountStatus,
        schemediscount : SchemeDiscount,
        afterschemedistotal: aftersdis || 0,
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
        updatedTotals.totalAmount += parseFloat(item.Amount) || 0;
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
      let finalDiscount = Math.min(updatedTotals.totalNetAmount,additionalDiscount);

      let ItemGrandTotal = updatedTotals.totalAmount;


      console.log(ItemGrandTotal,'ItemGrandTotal')

      // Adjust net amount after applying discount
      let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;

      const pharmacyGrandTotal = Pharmadetails.reduce(
        (sum, item) => sum + parseFloat(item.Net_Amount || 0),
        0
      );

      const pharmacyrefundTotal = Pharmarefunddetails.reduce(
        (sum, item) => sum + parseFloat(item.PaidAmount || 0),
        0
      );

      const Pharmacyfinalamt = pharmacyGrandTotal - pharmacyrefundTotal

      let Itempharmacygrandtotal = ItemGrandTotal + Pharmacyfinalamt;


      console.log(Pharmacyfinalamt,'pharmacyGrandTotal generalll')

      totalTaxableAmount = totalTaxableAmount + Pharmacyfinalamt;

      console.log(totalTaxableAmount,'totalTaxableAmount')


      let SchemeDiscount = updatedTotals.totalDiscount;

      let aftersdis = (parseFloat(Itempharmacygrandtotal || 0) - SchemeDiscount).toFixed(2)


      console.log('inside SchemeDiscount',SchemeDiscount)

      // Corrected GST calculation based on the updated taxable amount
      // let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;

      // Correct total net amount after discount and GST
      let finalNetAmount = totalTaxableAmount;
      let AmountStatus = RemainingCredit > 0 ? 'Refund' : 'Pay'

      // Preserve PaidAmount and calculate BalanceAmount correctly
      setinitialState((prevState) => ({
        ...prevState,
        ItemGrandTotal : ItemGrandTotal,
        Itempharmacygrandtotal : Itempharmacygrandtotal,
        totalItems: SelectDatalist.length,
        totalTaxable: finalNetAmount.toFixed(2),
        totalUnits: updatedTotals.totalUnits,
        totalDiscount: finalDiscount.toFixed(2),
        // totalGstamount: updatedGst.toFixed(2),
        totalNetAmount: (Math.round(finalNetAmount)).toFixed(2),
        totalAmount: finalNetAmount.toFixed(2),
        BalanceAmount: (Math.round(finalNetAmount - prevState.PaidAmount)).toFixed(2),
        Roundoff: (Math.round(finalNetAmount) - finalNetAmount).toFixed(2),
        AmountStatus: AmountStatus,
        schemediscount : SchemeDiscount,
        afterschemedistotal: aftersdis || 0,
      }));

      // Update previous totals reference
      prevTotalsRef.current = { ...updatedTotals };
    }
  }, [SelectDatalist, NetAmount_CDmethod, RemainingCredit,Pharmadetails]);

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
            ABHA: "",
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
      if (value.includes("|")) {
        const value1 = value.split("|");
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
    } 
    else if (name === "ServiceSubCategory") {
      const value1 = value.split("|");
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
      }));
    }
  };

  useEffect(() => {
    if (!IP_BillingData?.PatientId) {
      // Skip the request if PatientId is not available
      return;
    }
    axios
      .get(`${UrlLink}DrugAdminstrations/get_billing_details_due_patient?patient_id=${IP_BillingData?.PatientId}`)
      .then((response) => {
        // Check if payment_details is an array and update state
        if (Array.isArray(response.data.payment_details)) {
          setPharmacyDue(response.data.payment_details);  // Set the payment_details array
        } else {
          console.error('API response does not contain valid payment_details:', response.data);
          setPharmacyDue([]);  // Reset to empty array if response is not valid
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);  // Handle errors gracefully
        setPharmacyDue([]);  // Set pharmacyDue to empty array on error
      });
  }, [IP_BillingData?.PatientId]);  // Re-run effect when `PatientId` changes

  // Log pharmacyDue once it has changed
  useEffect(() => {
    console.log(pharmacyDue, 'pharmacy due updated');
  }, [pharmacyDue]);



  useEffect(() => {
    const postdata = {
      ServiceCategory: ServiceProcedure.Categoryid,
      ServicesubCategory: ServiceProcedure.Subcategorypk,
      // Quantity: ServiceProcedure.Quantity,
      Patientcategory: IP_BillingData.PatientCategory || RegisterData.PatientCategory,
      PatientcategoryId: IP_BillingData.PatientCategoryId || "",
      RegisterId: SelectedPatient_list.RegisterId,
      VisitType: "IP",
      Type: OTDetails.Type
    };


    console.log("possttt", postdata);

    axios
      .get(
        `${UrlLink}Masters/services_Subcategory_details_by_Patient_category_for_IP`,
        {
          params: postdata, // Use params to send query parameters
        }
      )
      .then((response) => {
        const res = response.data;
        console.log("ressssss", res);
        console.log("amttt", res?.[0]?.amt);
        setServiceProcedure((prev) => ({
          ...prev,
          ServiceSubCatId: res?.[0]?.ServiceId,
          Rate: res?.[0]?.amt,
          final_rate : res?.[0]?.final_rate,
          DiscountType : res?.[0]?.DiscountType,
          Discount : res?.[0]?.Discountamt,
          Discountamt : res?.[0]?.Discountamt,
          Discountmethod : res?.[0]?.Discountmethod,
          Discountval : res?.[0]?.Discountval,
          CGHScode : res?.[0]?.CGHScode,
          ISWardConsession : res?.[0]?.ISWardConsession,  
          ISWardPercentage : res?.[0]?.ISWardPercentage,
        }));
      });
  }, [UrlLink, ServiceProcedure.Categoryid, ServiceProcedure.Subcategorypk]);

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

  // const Additemstobillfun = () => {
  //   // Define required fields based on ServiceProcedureForm type
  //   const requiredfields = ["ServiceCategory", "ServiceSubCategory"];
  //   const existing = requiredfields.filter((field) => !ServiceProcedure[field]);
  //   if (existing.length !== 0) {
  //     // Alert the user to fill in the missing required fields
  //     alert(`Please fill the required fields: ${existing.join(", ")}`);
  //   } else {
  //     // Check if the same ServiceType and the correct ItemName already exist in SelectDatalist
  //     const Checktest = SelectDatalist.some(
  //       (ele) =>
  //         ele.ServiceType === ServiceProcedure.ServiceCategory &&
  //         ele.SelectItemName === ServiceProcedure.ServiceSubCategory // Dynamically check the appropriate item name field
  //     );
  //     console.log("checkkkk", Checktest);
  //     // Log selectedOption again just before adding
  //     console.log("selectedOption (before adding):", ServiceProcedure);

  //     let Quantityamt = parseFloat(ServiceProcedure.Rate) * parseFloat(ServiceProcedure.Quantity) || 0;
  //       let Discountamt = 0;
  //       let final_rate = Quantityamt;

  //       console.log('disco final_rate',final_rate)

  //       if (ServiceProcedure.Discountmethod) {
  //         if (ServiceProcedure.Discountmethod === "PERCENTAGE") {
  //           Discountamt = (Quantityamt * parseFloat(ServiceProcedure.Discountval || 0)) / 100;

  //           console.log('Discountamt coolieeeeeeeee', Discountamt)
  //         } else if (ServiceProcedure.Discountmethod === "AMOUNT") {
  //           Discountamt = parseFloat(ServiceProcedure.Discountval || 0);
  //         }

  //         // Round Discountamt to the nearest whole number
  //         Discountamt = Math.round(Discountamt);
  //         // Round final_rate to the nearest whole number
  //         final_rate = Math.round(Quantityamt - Discountamt);
  //       }

  //     // Create a new item with ServiceType and the available Consultation data
  //     const listdata = {
  //       ServiceType: ServiceProcedure.ServiceCategory,
  //       SelectItemName: ServiceProcedure.ServiceSubCategory,
  //       Quantity: parseFloat(ServiceProcedure.Quantity) || "",
  //       Charges: parseFloat(ServiceProcedure.Rate) || "",
  //       Amount: parseFloat(ServiceProcedure.Rate * ServiceProcedure.Quantity) || "",
  //       NetAmount:
  //         parseFloat(final_rate) || 0,
  //       isReimbursable: "No",
  //       Date: ServiceProcedure.ServiceDate,
  //       ...ServiceProcedure,
  //                 Discount : Discountamt,

  //     };

  //     console.log("Adding item:", listdata); // Log the data being added

  //     // Update SelectDatalist with the new item
  //     setSelectDatalist((prev) => [
  //       ...prev,
  //       { S_No: prev.length + 1, ...listdata },
  //     ]);
  //     setServiceProcedure((prev) => ({
  //       ...prev,
  //       ServiceSubCategory: "",
  //       ServiceSubCatId: "",
  //       Subcategorypk: "",
  //       Rate: "",
  //       Quantity: 1,
  //       CGHScode : ""
  //     }));

  //       setTimeout(() => {
  //   if (serviceSubCategoryRef.current) {
  //     serviceSubCategoryRef.current.focus();
  //   }
  // }, 0);
  //   }
  // };


  const Additemstobillfun = () => {
    // Define required fields based on ServiceProcedureForm type
    const requiredfields = ["ServiceCategory", "ServiceSubCategory"];
    const existing = requiredfields.filter((field) => !ServiceProcedure[field]);
    if (existing.length !== 0) {
      // Alert the user to fill in the missing required fields
      alert(`Please fill the required fields: ${existing.join(", ")}`);
    } else {
      // Check if the same ServiceType and the correct ItemName already exist in SelectDatalist
      const Checktest = SelectDatalist.some(
        (ele) =>
          ele.ServiceType === ServiceProcedure.ServiceCategory &&
          ele.SelectItemName === ServiceProcedure.ServiceSubCategory
      );
      console.log("checkkkk", Checktest);
      console.log("selectedOption (before adding):", ServiceProcedure);

      let Quantityamt = parseFloat(ServiceProcedure.Rate) * parseFloat(ServiceProcedure.Quantity) || 0;
      let Discountamt = 0;
      let final_rate = Quantityamt;
      let discountMethod = ServiceProcedure.Discountmethod || "";
      let discountValue = parseFloat(ServiceProcedure.Discountval || 0);
      let discountValueDisplay = ServiceProcedure.DiscountType || "-";
      let isWardDiscountApplied = false;
      let wardDiscountAmount = 0;

      console.log('disco final_rate', final_rate);

      // Check if Type is WARD and ISWardConsession is true
      const isWard = OTDetails.Type?.toUpperCase() === 'WARD';
      const hasWardConsession = ServiceProcedure.ISWardConsession === true;
      
      console.log('Ward check:', { 
        isWard, 
        hasWardConsession, 
        ISWardPercentage: ServiceProcedure.ISWardPercentage,
        type: ServiceProcedure.type 
      });

      // Apply WARD concession only if Type is WARD and ISWardConsession is true
      if (isWard && hasWardConsession) {
        const wardDiscountPercentage = parseFloat(ServiceProcedure.ISWardPercentage) || 20;
        
        // Calculate WARD discount amount
        wardDiscountAmount = (Quantityamt * wardDiscountPercentage) / 100;
        
        // If there's already a discount from Discountmethod, apply WARD discount on top
        if (ServiceProcedure.Discountmethod) {
          // First apply the existing discount
          let tempDiscount = 0;
          let tempFinalRate = Quantityamt;
          
          if (ServiceProcedure.Discountmethod === "PERCENTAGE") {
            tempDiscount = (Quantityamt * discountValue) / 100;
            tempFinalRate = Quantityamt - tempDiscount;
          } else if (ServiceProcedure.Discountmethod === "AMOUNT") {
            tempDiscount = discountValue;
            tempFinalRate = Quantityamt - tempDiscount;
          }
          
          // Now apply WARD discount on the discounted rate
          const wardDiscountOnDiscounted = (tempFinalRate * wardDiscountPercentage) / 100;
          Discountamt = tempDiscount + wardDiscountOnDiscounted;
          final_rate = tempFinalRate - wardDiscountOnDiscounted;
          
          // Update discount display
          if (ServiceProcedure.Discountmethod === "PERCENTAGE") {
            discountValueDisplay = `${discountValue}% + ${wardDiscountPercentage}`;
          } else {
            discountValueDisplay = `₹${discountValue} + ${wardDiscountPercentage}%`;
          }
        } else {
          // No existing discount, apply only WARD discount
          Discountamt = wardDiscountAmount;
          final_rate = Quantityamt - Discountamt;
          discountMethod = "PERCENTAGE";
          discountValue = wardDiscountPercentage;
          discountValueDisplay = `${wardDiscountPercentage}%`;
        }
        
        isWardDiscountApplied = true;
        console.log('WARD discount applied:', { wardDiscountAmount, wardDiscountPercentage });
      } else if (ServiceProcedure.Discountmethod) {
        // Apply only the regular discount (if any)
        if (ServiceProcedure.Discountmethod === "PERCENTAGE") {
          Discountamt = (Quantityamt * discountValue) / 100;
          final_rate = Quantityamt - Discountamt;
          discountValueDisplay = `${discountValue}%`;
        } else if (ServiceProcedure.Discountmethod === "AMOUNT") {
          Discountamt = discountValue;
          final_rate = Quantityamt - Discountamt;
          discountValueDisplay = `₹${discountValue}`;
        }
      }

      // Round Discountamt to the nearest whole number
      Discountamt = Math.round(Discountamt);
      // Round final_rate to the nearest whole number
      final_rate = Math.round(final_rate);

      // Create a new item with ServiceType and the available Consultation data
      const listdata = {
        ServiceType: ServiceProcedure.ServiceCategory,
        SelectItemName: ServiceProcedure.ServiceSubCategory,
        Quantity: parseFloat(ServiceProcedure.Quantity) || "",
        Charges: parseFloat(ServiceProcedure.Rate) || "",
        Amount: parseFloat(ServiceProcedure.Rate * ServiceProcedure.Quantity) || "",
        NetAmount: parseFloat(final_rate) || 0,
        isReimbursable: "No",
        Date: ServiceProcedure.ServiceDate,
        ...ServiceProcedure,
        Discount: Discountamt,
        DiscountType: discountValueDisplay,
        Discountmethod: discountMethod,
        Discountval: discountValue,
        WardDiscountApplied: isWardDiscountApplied,
        WardDiscountAmount: wardDiscountAmount,
        OriginalAmount: Quantityamt,
        FinalAmount: final_rate,
      };

      console.log("Adding item:", listdata);

      // Update SelectDatalist with the new item
      setSelectDatalist((prev) => [
        ...prev,
        { S_No: prev.length + 1, ...listdata },
      ]);
      
      // Reset form fields but keep type if it's a global setting
      setServiceProcedure((prev) => ({
        ...prev,
        ServiceSubCategory: "",
        ServiceSubCatId: "",
        Subcategorypk: "",
        Rate: "",
        Quantity: 1,
        CGHScode: "",
        DiscountType: "",
        Discount: "",
        Discountamt: "",
        Discountmethod: "",
        Discountval: "",
        ISWardConsession: "",
        ISWardPercentage: "",
        // Keep type if it's a form-level setting
        type: prev.type || "",
      }));

      setTimeout(() => {
        if (serviceSubCategoryRef.current) {
          serviceSubCategoryRef.current.focus();
        }
      }, 0);
    }
  };

  const [Deleteditem, setDeleteditem] = useState([]);
  
    console.log('Deleteditem',Deleteditem)
  
  const deletebillingitem = (row) => {
    const S_No = row.S_No;
  
    // Find the deleted item
    const deleted = SelectDatalist.find((ele) => ele.S_No === S_No);
  
    // Update Deleteditem array
    if (deleted) {
      setDeleteditem((prev) => [...prev, deleted]);
    }
  
    // Filter out the deleted item
    let Temp_delarr = SelectDatalist.filter((ele) => ele.S_No !== S_No);
  
    // Update SelectDatalist with reindexed items
    setSelectDatalist(
      Temp_delarr.map((item, index) => ({ ...item, S_No: index + 1 }))
    );
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
        ABHA: "",
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
        RegisterId: IP_BillingData.Register_Id,
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
          isReimbursable: "No",
        };
      });
      setSelectDatalist(Items);
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
      }));
      setBillAmount(Payment);
    }
  }, [UrlLink, IP_BillingData]);

  useEffect(() => {
    if (Object.keys(IP_BillingData).length !== 0 && IP_BillingData?.ServiceProcedureForm === 'IP') {
      // First axios call to fetch IP Billing Service List
      axios
        .get(`${UrlLink}Frontoffice/IP_Billing_Service_List`, {
          params: {
            QueueList_ID: IP_BillingData?.Registration_Id,
          },
        })
        .then((res) => {
          let GetIPBillingdata = res.data.Billing_data;
          let GetIPBillingdataService = res.data.services;
          let GetIPRoomServices = res.data.Room_data.RoomDatas;
          let GetIPPharmacy = res.data.pharmacy_list;
          let GetOT = res.data.OT_data;
          let GetLab = res.data.Lab_list;
          let GetRad = res.data.Rad_list;
          let GetInterim = res.data.InterimList;


          console.log("GetIPBillingdata", GetIPBillingdata);
          console.log("GetIPBillingdataService", GetIPBillingdataService);
          console.log("GetIPRoomServices", GetIPRoomServices);

          if (Object.values(GetIPBillingdata).length > 5) {
            // Setting Doctor and Patient details
            setBillingData((prev) => ({
              ...prev,
              DoctorName: GetIPBillingdata.Doctor_ShortName || "",
              DoctorId: GetIPBillingdata.Doctor_ID || "",
            }));
            setpatientsearch((prev) => ({
              ...prev,
              Search: IP_BillingData.PatientId,
            }));
            setSmartCard((prev) => ({
              ...prev,
              SmartCardNo: IP_BillingData.PatientId,
            }));

            setRegisterData((prev) => ({
              ...prev,
              ABHA: "",
              PatientName: IP_BillingData.Patient_Name || "",
              AgeGender: IP_BillingData.AgeGender || "",
              PhoneNo: IP_BillingData.PhoneNo || "",
              PatientCategory: IP_BillingData.PatientCategory || "",
              PatientCategoryName: IP_BillingData.PatientCategoryName || "",
              Address: IP_BillingData.Address || "",
              PatientId: IP_BillingData.PatientId || "",
              WardName: IP_BillingData.ward || "",
            }));
            setAppointmentRegisType(IP_BillingData.VisitType);
            const lastRoomService =
              GetIPRoomServices[GetIPRoomServices.length - 1];
            setSelectedPatient_list((prev) => ({
              ...prev,
              PatientId: GetIPBillingdata.PatientId,
              PatientName: GetIPBillingdata.Patient_Name,
              PhoneNumber: GetIPBillingdata.PhoneNo,
              PatientCategory: GetIPBillingdata.PatientCategory,
              Gender: GetIPBillingdata.Gender,
              City: GetIPBillingdata.City,
              State: GetIPBillingdata.State,
              PatientAddress: GetIPBillingdata.Area,
              Pincode: GetIPBillingdata.Pincode,
              RegisterId: GetIPBillingdata.Registration_Id,
              QueueList_ID: GetIPBillingdata.id,
              VisitId: GetIPBillingdata.VisitId,
              DischargeDate: lastRoomService?.Discharge_Date || "Not Available",
              WardBedNo: `${lastRoomService?.WardName}-${lastRoomService?.Bed_No}`,
            }));
            // Map over GetIPBillingdataService to get service data
            let mappedServiceData = GetIPBillingdataService.map(
              (service, index) => {
                return {
                  S_No: index + 1, // Add serial number based on index
                  ServiceType: service.category,
                  VoucherNo: service.VoucherNo,
                  SelectItemName: service.service_subcategory,
                  Charges: parseFloat(service.rate),
                  Amount: parseFloat(service.rate),
                  DiscountType: "",
                  Discount: "",
                  GST_per: service.GST_per,
                  GST: service.GST_Charge,
                  NetAmount: parseFloat(service.rate),
                  Quantity: parseFloat(service.Units),
                  isReimbursable: service.isReimbursable,
                  Date: service.Date,
                };
              }
            );
            let serviceCount = mappedServiceData.length;
            // Map over GetIPBillingdataService to get service data
            // Map over GetIPPharmacy to get pharmacy service data
            let mappedPharmacyServiceData = GetIPPharmacy.map((service, index) => {
              return {
                S_No: serviceCount + index + 1,
                VoucherNo: service.VoucherNo,
                ServiceType: service.category,
                SelectItemName: service.service_subcategory,
                Charges: parseFloat(service.rate),
                Amount: "",
                DiscountType: "",
                Discount: "",
                GST_per: 0.0,
                GST: 0.0,
                NetAmount: parseFloat(service.total),
                Quantity: service.Units,
                isReimbursable: service.isReimbursable,
                Date: service.Date,
              };
            });
            serviceCount += mappedPharmacyServiceData.length;

            let mappedRoomServiceData = GetIPRoomServices.map(
              (service, index) => {
                return {
                  S_No: serviceCount + index + 1, // Add serial number based on index
                  ServiceType: "ROOM CHARGES",
                  // SelectItemName: `${service.WardName}-${service.Room_No}-${service.Bed_No}`,
                  SelectItemName: service.SelectItemName,
                  Charges: parseFloat(service.Charge),
                  Amount: parseFloat(service.Total_Current_Charge),
                  DiscountType: service.DiscountType,
                  Discount: service.Discountamt,
                  GST_per: service.GST_per,
                  GST: service.GST,
                  NetAmount: parseFloat(service.Total_amount),
                  Quantity: service.Days,
                  isReimbursable: service.isReimbursable,
                  Date: service.DateRange,
                  Discountmethod : service.Discountmethod,
                  Discountval : service.Discountval
                };
              }
            );
            console.log("rooommmm", mappedRoomServiceData);
            serviceCount += mappedRoomServiceData.length;

            let mappedOTData = GetOT.map(
              (service, index) => {
                return {
                  S_No: serviceCount + index + 1, // Add serial number based on index
                  ServiceType: service.category,
                  SelectItemName: service.service_subcategory,
                  Charges: parseFloat(service.rate),
                  Amount: parseFloat(service.rate),
                  DiscountType: "",
                  Discount: "",
                  GST_per: service.GST_per,
                  GST: service.GST_Charge,
                  NetAmount: parseFloat(service.rate),
                  Quantity: parseFloat(service.Units),
                  isReimbursable: service.isReimbursable,
                  Date: service.Date,
                };
              }
            );
            console.log("ottttt", mappedOTData);

            let mappedLABData = GetLab.map(
              (service, index) => {
                return {
                  S_No: serviceCount + index + 1, // Add serial number based on index
                  VoucherNo: service.VoucherNo,
                  ServiceType: service.category,
                  SelectItemName: service.service_subcategory,
                  servicecode: service.servicecode,
                  Charges: parseFloat(service.rate),
                  Amount: parseFloat(service.rate),
                  DiscountType: service.DiscountType,
                  Discount: service.Discountamt,
                  GST_per: service.GST_per,
                  GST: service.GST_Charge,
                  NetAmount: parseFloat(service.Finalrate),
                  Quantity: parseFloat(service.Units),
                  isReimbursable: service.isReimbursable,
                  Date: service.Date,
                  Requestid: service.Requestid,
                  Discountmethod : service.Discountmethod,
                  Discountval : service.Discountval,
                  CGHScode: service.CGHScode
                };
              }
            );


            let mappedRadata = GetRad.map(
              (service, index) => {
                return {
                  S_No: serviceCount + index + 1, // Add serial number based on index
                  VoucherNo: service.VoucherNo,
                  ServiceType: service.category,
                  SelectItemName: service.service_subcategory,
                  servicecode: service.servicecode,
                  Charges: parseFloat(service.rate),
                  Amount: parseFloat(service.rate),
                  DiscountType: service.DiscountType,
                  Discount: service.Discountamt,
                  GST_per: service.GST_per,
                  GST: service.GST_Charge,
                  NetAmount: parseFloat(service.Finalrate),
                  Quantity: parseFloat(service.Units),
                  isReimbursable: service.isReimbursable,
                  Date: service.Date,
                  Requestid: service.Requestid,
                  Discountmethod : service.Discountmethod,
                  Discountval : service.Discountval,
                  CGHScode: service.CGHScode

                };
              }
            );
            
            let mappedInterimData = GetInterim.map((service, index) => {
              return {
                S_No: serviceCount + index + 1,
                VoucherNo: service.VoucherNo,
                ServiceType: service.category,
                SelectItemName: service.service_subcategory,
                Charges: parseFloat(service.rate),
                Amount: parseFloat(service.rate),
                DiscountType: "",
                Discount: "",
                GST_per: 0.0,
                GST: 0.0,
                NetAmount: parseFloat(service.rate),
                Quantity: service.Units,
                isReimbursable: service.isReimbursable,
                Date: service.Date,
                CGHScode: service.CGHScode

              };
            });

            // Only add Adddata if the necessary fields are not empty
            let Adddata = {
              ServiceType: GetIPBillingdata.category,
              SelectItemName: GetIPBillingdata.service_subcategory,
              Rate: GetIPBillingdata.Service_Fee,
              Charges: GetIPBillingdata.Service_Fee,
              Amount: GetIPBillingdata.Service_Fee,
              DiscountType: "",
              Discount: "",
              GST_per: "",
              Total: GetIPBillingdata.Service_Fee,
              GST: "",
              Quantity: 1,
              DiscountAmount: "",
              isReimbursable: "No",
            };

            // Conditionally add Adddata only if ServiceName and Service_Fee are present
            if (
              Adddata.SelectItemName &&
              Adddata.ServiceType &&
              Adddata.Service_Fee
            ) {
              mappedServiceData = [
                Adddata,
                ...mappedServiceData,
                ...mappedRoomServiceData,
                ...mappedPharmacyServiceData,
                ...mappedOTData,
                ...mappedLABData,
                ...mappedRadata,
                ...mappedInterimData
              ];
            } else {
              mappedServiceData = [
                ...mappedServiceData,
                ...mappedRoomServiceData,
                ...mappedPharmacyServiceData,
                ...mappedOTData,
                ...mappedLABData,
                ...mappedRadata,
                ...mappedInterimData
              ];
            }

            // Set the updated service data to SelectDatalist
            setSelectDatalist(mappedServiceData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else if (Object.keys(IP_BillingData).length !== 0 && IP_BillingData?.ServiceProcedureForm === 'Lab') {
      setBillingData((prev) => ({
        ...prev,
        DoctorName: IP_BillingData.Doctor_ShortName || "",
        DoctorId: IP_BillingData.DoctorID || "",
      }));
      setpatientsearch((prev) => ({
        ...prev,
        Search: IP_BillingData.PatientId,
      }));
      setSmartCard((prev) => ({
        ...prev,
        SmartCardNo: IP_BillingData.PatientId,
      }));

      setRegisterData((prev) => ({
        ...prev,
        ABHA: "",
        PatientName: IP_BillingData.Patient_Name || "",
        AgeGender: IP_BillingData.AgeGender || "",
        PhoneNo: IP_BillingData.PhoneNo || "",
        PatientCategory: IP_BillingData.PatientCategory || "",
        PatientCategoryName: IP_BillingData.PatientCategoryName || "",
        Address: IP_BillingData.Address || "",
        PatientId: IP_BillingData.PatientId || "",
        WardName: IP_BillingData.ward || "",
      }));
      setAppointmentRegisType(IP_BillingData.VisitType);
      setSelectedPatient_list((prev) => ({
        ...prev,
        PatientId: IP_BillingData.PatientId,
        PatientName: IP_BillingData.Patient_Name,
        PhoneNumber: IP_BillingData.PhoneNo,
        PatientCategory: IP_BillingData.PatientCategory,
        Gender: IP_BillingData.Gender,
        City: IP_BillingData.City,
        State: IP_BillingData.State,
        PatientAddress: IP_BillingData.Area,
        Pincode: IP_BillingData.Pincode,
        RegisterId: IP_BillingData.Registration_Id,
        QueueList_ID: IP_BillingData.id,
        // VisitId: IP_BillingData.VisitId,
      }));
      setSelectDatalist(IP_BillingData?.ItemDetails)
    }

    else if (Object.keys(IP_BillingData).length !== 0 && IP_BillingData?.ServiceProcedureForm === 'RADIOLOGY') {
      setBillingData((prev) => ({
        ...prev,
        DoctorName: IP_BillingData?.Doctor_ShortName || "",
        DoctorId: IP_BillingData?.DoctorId || "",
      }));
      setpatientsearch((prev) => ({
        ...prev,
        Search: IP_BillingData?.PatientId,
      }));
      setSmartCard((prev) => ({
        ...prev,
        SmartCardNo: IP_BillingData?.PatientId,
      }));

      setRegisterData((prev) => ({
        ...prev,
        ABHA: "",
        PatientName: IP_BillingData?.Patient_Name || "",
        AgeGender: IP_BillingData?.AgeGender || "",
        PhoneNo: IP_BillingData?.PhoneNo || "",
        PatientCategory: IP_BillingData?.PatientCategory || "",
        PatientCategoryName: IP_BillingData?.PatientCategoryName || "",
        Address: IP_BillingData?.Address || "",
        PatientId: IP_BillingData?.PatientId || "",
        WardName: IP_BillingData?.ward || "",
      }));
      setAppointmentRegisType(IP_BillingData.VisitType);
      setSelectedPatient_list((prev) => ({
        ...prev,
        PatientId: IP_BillingData?.PatientId,
        PatientName: IP_BillingData?.Patient_Name,
        PhoneNumber: IP_BillingData?.PhoneNo,
        PatientCategory: IP_BillingData?.PatientCategory,
        Gender: IP_BillingData?.gender,
        City: IP_BillingData?.City,
        State: IP_BillingData?.State,
        PatientAddress: IP_BillingData?.Area,
        Pincode: IP_BillingData?.Pincode,
        RegisterId: IP_BillingData?.RegistrationId,
        QueueList_ID: IP_BillingData?.id,
        // VisitId: IP_BillingData.VisitId,
      }));
      setSelectDatalist(IP_BillingData?.radiologytestlist)
    }
    // else {
    //   navigate("/Home/QuickBilling")
    // }
  }, [UrlLink, IP_BillingData.Registration_Id, IP_BillingData]);

  //  useEffect(() => {
  //   if (Object.keys(IP_BillingData).length !== 0) {
  //     axios
  //       .get(`${UrlLink}Frontoffice/IP_Billing_Service_List`, {
  //         params: {
  //           QueueList_ID: IP_BillingData?.Registration_Id,
  //         },
  //       })
  //       .then((res) => {
  //         const GetIPBillingdata = res.data.Billing_data;
  //         const GetIPBillingdataService = res.data.services;
  //         const GetIPRoomServices = res.data.Room_data.RoomDatas;

  //         if (Object.values(GetIPBillingdata).length > 5) {
  //           // Set basic patient and doctor details (as before)
  //           setBillingData((prev) => ({
  //             ...prev,
  //             DoctorName: GetIPBillingdata.Doctor_ShortName || "",
  //             DoctorId: GetIPBillingdata.Doctor_ID || "",
  //           }));

  //           setpatientsearch((prev) => ({
  //             ...prev,
  //             Search: IP_BillingData.PatientId,
  //           }));

  //           setSmartCard((prev) => ({
  //             ...prev,
  //             SmartCardNo: IP_BillingData.PatientId,
  //           }));

  //           setRegisterData((prev) => ({
  //             ...prev,
  //             ABHA: "64-9456-6541-8451",
  //             PatientName: IP_BillingData.Patient_Name || "",
  //             AgeGender: IP_BillingData.AgeGender || "",
  //             PhoneNo: IP_BillingData.PhoneNo || "",
  //             PatientCategory: IP_BillingData.PatientCategory || "",
  //             PatientCategoryName: IP_BillingData.PatientCategoryName || "",
  //             Address: IP_BillingData.Address || "",
  //             PatientId: IP_BillingData.PatientId || "",
  //           }));

  //           setAppointmentRegisType(IP_BillingData.VisitType);

  //           const lastRoomService = GetIPRoomServices[GetIPRoomServices.length - 1];
  //           setSelectedPatient_list((prev) => ({
  //             ...prev,
  //             PatientId: GetIPBillingdata.PatientId,
  //             PatientName: GetIPBillingdata.Patient_Name,
  //             PhoneNumber: GetIPBillingdata.PhoneNo,
  //             PatientCategory: GetIPBillingdata.PatientCategory,
  //             Gender: GetIPBillingdata.Gender,
  //             City: GetIPBillingdata.City,
  //             State: GetIPBillingdata.State,
  //             PatientAddress: GetIPBillingdata.Area,
  //             Pincode: GetIPBillingdata.Pincode,
  //             RegisterId: GetIPBillingdata.Registration_Id,
  //             QueueList_ID: GetIPBillingdata.id,
  //             VisitId: GetIPBillingdata.VisitId,
  //             DischargeDate: lastRoomService.Discharge_Date || "Not Available",
  //             WardBedNo: `${lastRoomService.WardName}-${lastRoomService.Bed_No}`,
  //           }));

  //           // 1. Process Room Services
  //           let mappedRoomServiceData = GetIPRoomServices.map((service, index) => ({
  //             S_No: index + 1,
  //             ServiceType: "ROOM CHARGES",
  //             SelectItemName: `${service.WardName}-${service.Room_No}-${service.Bed_No}`,
  //             Charges: parseFloat(service.Charge),
  //             Amount: parseFloat(service.Amount),
  //             DiscountType: "",
  //             Discount: "",
  //             GST_per: service.GST_per,
  //             GST: service.GST,
  //             NetAmount: parseFloat(service.Total_Current_Charge),
  //             Quantity: service.Days,
  //             isReimbursable:
  //               IP_BillingData?.PatientCategory === "Insurance" ? "Yes" : "No",
  //           }));

  //           // 2. Process Services by category
  //           const consultationServices = [];
  //           const generalServices = [];
  //           const labServices = [];
  //           const radiologyServices = [];

  //           GetIPBillingdataService.forEach((service, index) => {
  //             const serviceData = {
  //               S_No: mappedRoomServiceData.length + index + 1,
  //               ServiceType: service.category,
  //               SelectItemName: service.service_subcategory,
  //               Charges: parseFloat(service.rate),
  //               Amount: parseFloat(service.rate),
  //               DiscountType: "",
  //               Discount: "",
  //               GST_per: service.GST_per || "",
  //               GST: service.GST_Charge || "",
  //               NetAmount: parseFloat(service.rate),
  //               Quantity: parseFloat(service.Units),
  //               isReimbursable:
  //                 IP_BillingData?.PatientCategory === "Insurance" ? "Yes" : "No",
  //             };

  //             // Push the appropriate service data to its category array
  //             switch (service.category.toUpperCase()) {
  //               case "CONSULTATION":
  //                 consultationServices.push(serviceData);
  //                 break;
  //               case "LAB":
  //                 labServices.push(serviceData);
  //                 break;
  //               case "RADIOLOGY":
  //                 radiologyServices.push(serviceData);
  //                 break;
  //               case "GENERAL SERVICES":
  //                 generalServices.push(serviceData);
  //                 break;
  //               default:
  //                 break;
  //             }
  //           });

  //           // Extract cumulative values from the backend response
  //           const cumulativeConsultation = parseFloat(
  //             GetIPBillingdata.CumulativeConsultation || "0"
  //           ); // From backend response
  //           const cumulativeLab = parseFloat(GetIPBillingdata.CumulativeLab || "0"); // From backend response
  //           const cumulativeRadiology = parseFloat(
  //             GetIPBillingdata.CumulativeRadiology || "0"
  //           ); // From backend response
  //           const cumulativeGeneralServices = parseFloat(
  //             GetIPBillingdata.CumulativeGeneralServices || "0"
  //           ); // From backend response

  //           // Add subtotals at the correct places for each category
  //           const combinedServices = [
  //             ...mappedRoomServiceData, // Room services first
  //             {
  //               ServiceType: "ROOM CHARGES",
  //               subtotal: mappedRoomServiceData.reduce(
  //                 (acc, service) => acc + service.Amount,
  //                 0
  //               ), // Calculate room charges subtotal dynamically
  //             },
  //             ...consultationServices, // Then consultations
  //             {
  //               ServiceType: "CONSULTATION",
  //               subtotal: cumulativeConsultation, // Use dynamic value from backend
  //             },
  //             ...generalServices, // Then general services
  //             {
  //               ServiceType: "GENERAL SERVICES",
  //               subtotal: cumulativeGeneralServices, // Use dynamic value from backend
  //             },
  //             ...labServices, // Then lab services
  //             {
  //               ServiceType: "LAB",
  //               subtotal: cumulativeLab, // Use dynamic value from backend
  //             },
  //             ...radiologyServices, // Finally radiology services
  //             {
  //               ServiceType: "RADIOLOGY",
  //               subtotal: cumulativeRadiology, // Use dynamic value from backend
  //             },
  //           ];

  //           // Update S_No to be sequential in the final combined list
  //           const finalServicesList = combinedServices.map((service, index) => ({
  //             ...service,
  //             S_No: index + 1,
  //           }));

  //           setSelectDatalist(finalServicesList);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [UrlLink, IP_BillingData.Registration_Id, IP_BillingData]);

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
      // Paytype: Paytype.isCash === 'Yes' ? 'Cash' : 'Credit',
      Status: 'Estimated',
      RefundAmount: RemainingCredit,
      Request_Id: IP_BillingData.Request_Id,
      AdvanceTotal: AdvanceTotal,
    };

    console.log("senddata", senddata);
    if (Object.keys(IP_BillingData).length !== 0) {
      axios
        .post(`${UrlLink}Frontoffice/IPBillingEstimated_Link`, senddata)
        .then((res) => {
          console.log(res.data);
          setPostInvoice(res.data.InvoiceNo);
          setRecieptInvoice(res.data.ReceiptNo);
          setPostInvoiceDate(res.data.InvoiceDate);
          setSubmitBut(true)

          // setIsPrintButtonVisible(false);

          const messageType = res.data.status;
        const messageContent = res.data.message;  

        console.log(messageType,'messageType',messageContent)

        dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });

          // Handle print options
          // if (isSummary) {
          //   setisPrintSummary(true);
          // } else if (isReimb) {
          //   setprintoption("PrintReimbursable");
          // } else if (isNon_Reimb) {
          //   setprintoption("PrintNon-Reimbursable");
          // }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handlePrintSubmit = (
    isDetail = false,
    isSummary = false,
    isReimb = false,
    isNon_Reimb = false,
    isConsolidate = false,

  ) => {

    setIsPrintButtonVisible(false);

    if(isDetail){
      setprintoption("PrintDetailed");
    }
    else if (isConsolidate) {
      setprintoption("PrintConsolidated");
    }

    else if (isSummary) {
      setprintoption("PrintSummary");
    }
     else if (isReimb) {
      setprintoption("PrintReimbursable");
    } 
    else if (isNon_Reimb) {
      setprintoption("PrintNon-Reimbursable");
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
  //           Deleteditem : Deleteditem

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
  //         setSubmitBut(true)


  //       const messageType = res.data.status;
  //       const messageContent = res.data.message;  

  //       console.log(messageType,'messageType',messageContent)

  //       dispatchvalue({
  //                   type: 'toast',
  //                   value: { message: messageContent, type: messageType },
  //               });
  //         // if (res?.data?.status === 'success') {
  //         //   navigate("/Home/CashierFolder");
  //         //   dispatchvalue({ type: "HrFolder", value: "IPBillingEstimatedList" });
  //         //   dispatchvalue({ type: "setPreviousFolder", value: null });
  //         //   dispatchvalue({ type: "showMenu", value: true })
  //         // }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };


  // Create a ref to hold the abort controller
const abortControllerRef = useRef(null);
const [isSubmitting, setIsSubmitting] = useState(false);

const isSubmittingRef = useRef(false);

// const handleSaveSubmit = () => {
//   // Prevent multiple submissions - THIS IS CRUCIAL
//   if (isSubmittingRef.current) {
//     console.log('Submission blocked - already submitting');
//     return;
//   }

//   // Cancel any ongoing request if it exists
//   if (abortControllerRef.current) {
//     abortControllerRef.current.abort();
//     abortControllerRef.current = null;
//   }

//   isSubmittingRef.current = true;

//   setIsSubmitting(true);

//   // Create a new AbortController for this request
//   abortControllerRef.current = new AbortController();
//   const signal = abortControllerRef.current.signal;

//   let requiredfields1 = ["PatientId", "PatientName", "PhoneNo", "AgeGender"];
//   let missingFields = requiredfields1.filter((field) => !RegisterData[field]);
//   let errorMessages = [];

//   // Check for missing required fields
//   if (missingFields.length > 0) {
//     errorMessages.push(
//       `Please fill the required fields: ${missingFields.join(", ")}`
//     );
//   }


//   if (errorMessages.length > 0) {
//     alert(errorMessages.join("\n"));
//     isSubmittingRef.current = false;
//     setIsSubmitting(false);
//     return;
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
//     return;
//   }

//   // SET LOADING STATE HERE - This prevents multiple submissions
//   setIsSubmitting(true);

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
//     Status: 'Estimated',
//     RefundAmount: RemainingCredit,
//     Request_Id: IP_BillingData.Request_Id,
//     AdvanceTotal: AdvanceTotal,
//     Deleteditem: Deleteditem
//   };

//   console.log("senddata", senddata);
  
//   if (Object.keys(IP_BillingData).length !== 0) {
//     axios
//       .post(`${UrlLink}Frontoffice/IPBillingEstimated_Link`, senddata, { signal })
//       .then((res) => {
//         // Clear the abort controller on successful completion
//         isSubmittingRef.current = false;
//         setIsSubmitting(false);
//         abortControllerRef.current = null;
        
//         console.log(res.data);
//         setPostInvoice(res.data.InvoiceNo);
//         setRecieptInvoice(res.data.ReceiptNo);
//         setPostInvoiceDate(res.data.InvoiceDate);
//         setSubmitBut(true); // Keep this if you want to permanently disable after success

//         const messageType = res.data.status;
//         const messageContent = res.data.message;  

//         console.log(messageType,'messageType',messageContent);

//         dispatchvalue({
//           type: 'toast',
//           value: { message: messageContent, type: messageType },
//         });
//       })
//       .catch((err) => {
//         // Reset loading state on error
//         isSubmittingRef.current = false;
//         setIsSubmitting(false);
        
//         if (axios.isCancel(err)) {
//           console.log('Request canceled:', err.message);
//           // Don't clear abortControllerRef for cancel errors
//         } else {
//           console.log(err);
//           // Clear abort controller for actual errors
//           abortControllerRef.current = null;
          
//           // Handle other errors
//           dispatchvalue({
//             type: 'toast',
//             value: { message: "An error occurred while saving", type: "error" }
//           });
//         }
//       });
//   } else {
//     // Reset loading state if condition fails
    
//     setIsSubmitting(false);
//   }
// };

// Cleanup effect for component unmount

const handleSaveSubmit = () => {

  // ✅ Prevent multiple submissions
  if (isSubmittingRef.current) {
    console.log("Submission blocked - already submitting");
    return;
  }

  // ✅ Abort previous request if any
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
    abortControllerRef.current = null;
  }

  isSubmittingRef.current = true;
  setIsSubmitting(true);

  // ✅ New AbortController
  abortControllerRef.current = new AbortController();
  const signal = abortControllerRef.current.signal;

  let requiredfields1 = ["PatientId", "PatientName", "PhoneNo", "AgeGender"];
  let missingFields = requiredfields1.filter(
    field => !RegisterData[field]
  );
  let errorMessages = [];

  // ✅ Required fields validation
  if (missingFields.length > 0) {
    errorMessages.push(
      `Please fill the required fields: ${missingFields.join(", ")}`
    );
  }

  // ✅ Item details validation
  if (SelectDatalist.length === 0) {
    errorMessages.push("Please fill the Item Details.");
  }

  // ✅ Payment details validation
  if (billAmount.length === 0 && initialState.ReimbursableAmount !== 0) {
    errorMessages.push("Please fill the Payment Details.");
  }

  // ✅ Stop if validation fails
  if (errorMessages.length > 0) {
    alert(errorMessages.join("\n"));
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    return;
  }

  // ✅ Payload
  const senddata = {
    billAmount,
    SelectedPatient_list,
    NetAmount_CDmethod,
    SelectDatalist,
    BillingData,
    initialState,
    Created_by: UserData?.username,
    Location: UserData?.location,
    selectedOption,
    ServiceProcedureForm,
    EditId: IP_BillingData?.id
      ? IP_BillingData?.Type === "IPEdit"
        ? IP_BillingData?.id
        : ""
      : "",
    EditDue:
      IP_BillingData?.id && IP_BillingData?.Type === "OPDue"
        ? IP_BillingData?.id
        : "",
    Status: "Estimated",
    RefundAmount: RemainingCredit,
    Request_Id: IP_BillingData?.Request_Id,
    AdvanceTotal,
    Deleteditem
  };

  console.log("senddata", senddata);

  // ✅ Safety check
  if (Object.keys(IP_BillingData).length === 0) {
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    return;
  }

  // ✅ API call
  axios.post(
    `${UrlLink}Frontoffice/IPBillingEstimated_Link`,
    senddata,
    { signal }
  )
    .then((res) => {
      // ✅ Reset submit state
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      abortControllerRef.current = null;

      console.log(res.data);

      // ✅ Success values
      setPostInvoice(res.data.InvoiceNo);
      setRecieptInvoice(res.data.ReceiptNo);
      setPostInvoiceDate(res.data.InvoiceDate);
      setSubmitBut(true);

      // ✅ Toast
      dispatchvalue({
        type: "toast",
        value: {
          message: res.data.message || "Saved successfully",
          type: res.data.status || "success",
        },
      });
    })
    .catch((err) => {
      // ✅ Reset submit state
      isSubmittingRef.current = false;
      setIsSubmitting(false);

      // ✅ Abort case
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
        return;
      }

      abortControllerRef.current = null;

      console.log("API Error:", err.response);

      // ✅ Backend error message (409 / 400 / 500)
      if (err.response && err.response.data) {
        dispatchvalue({
          type: "toast",
          value: {
            message:
              err.response.data.message ||
              "An error occurred while saving",
            type: err.response.data.status || "error",
          },
        });
      } else {
        // ✅ Network / Unknown error
        dispatchvalue({
          type: "toast",
          value: {
            message: "An error occurred while saving",
            type: "error",
          },
        });
      }
    });
};




useEffect(() => {
  return () => {
    // Cancel any ongoing request when component unmounts
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, []);

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
      // dispatchvalue({ type: "HrFolder", value: "IPBillingEstimatedList" });
      // dispatchvalue({ type: "setPreviousFolder", value: null });
      // dispatchvalue({ type: "showMenu", value: true });
    },
  });

  const handlePrintClose = () => {
        setIsPrintButtonVisible(true)

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

 const ForPrintData11 = () => {
    const hasCard = billAmount.some((p) => p.Billpay_method === 'Card');
    const hasCheque = billAmount.some((p) => p.Billpay_method === 'Cheque');
    const hasBank = billAmount.some((p) => p.Billpay_method === 'Bank');

    return (
        <div ref={componentRef}>
            <style>
                {`
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: Arial, sans-serif;
                        }
                        .print-table33 {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 12px;
                            margin: 10px 0;
                        }
                        .print-table33 th, .print-table33 td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        .print-table33 th {
                            background-color: #f5f5f5;
                            font-weight: bold;
                            text-align: center;
                        }
                        .print_header {
                            background-color: #ffffff;
                        }
                        .New_billlling_invoice_head {
                            display: flex;
                            align-items: center;
                            padding: 10px;
                            margin-bottom: 10px;
                        }
                        .new_billing_logo_con img {
                            max-width: 100px;
                            max-height: 100px;
                            margin-right: 20px;
                        }
                        .new_billing_address_1 {
                            text-align: left;
                            font-size: 14px;
                        }
                        .new_billing_address_2 {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 10px;
                            margin: 10px 0;
                        }
                        .new_billing_div {
                            flex: 1;
                            min-width: 200px;
                            padding: 5px;
                        }
                        .new_billing_div label {
                            font-weight: bold;
                            margin-right: 5px;
                        }
                        .service-type-heading {
                            background-color: #e8ecef;
                            font-weight: bold;
                            font-size: 14px;
                            padding: 10px;
                        }
                        .subtotal-row {
                            background-color: #f8f9fa;
                            font-weight: bold;
                        }
                        .total-section {
                            border-top: 2px solid #000;
                            padding-top: 10px;
                            margin-top: 10px;
                        }
                        .total-section label {
                            font-weight: bold;
                            font-size: 14px;
                        }
                        .disclaimer23 {
                            text-align: center;
                            font-size: 10px;
                            color: #666;
                            margin-top: 20px;
                        }
                        .Register_btn_con {
                            display: none;
                        }
                    }
                `}
            </style>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} id="reactprintcontent">
                <table className="print-table33">
                    <thead className="print_header">
                        <tr>
                            <td colSpan="7" style={{ border: "none" }}>
                                <div className="New_billlling_invoice_head">
                                    <div className="new_billing_logo_con">
                                        <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                                    </div>
                                    <div className="new_billing_address_1">
                                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{ClinicDetails?.Cname}</span>
                                        <div>
                                            <span>{[ClinicDetails?.ClinicAddress].filter((detail) => detail).join(", ")}</span>
                                        </div>
                                        <div>
                                            <span>{[ClinicDetails?.ClinicCity, ClinicDetails?.ClinicState, ClinicDetails?.ClinicCode].filter((detail) => detail).join(", ")}</span>
                                        </div>
                                        <div>{[ClinicDetails?.ClinicMobileNo, ClinicDetails?.ClinicLandLineNo, ClinicDetails?.ClinicMailID].filter((detail) => detail).join(" , ")}</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", fontWeight: "bold", color: "black", fontSize: "20px", padding: "10px" }}>
                                Summary Invoice
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="7">
                                <div className="new_billing_address_2">
                                    <div className="new_billing_div">
                                        <label>Patient Name:</label>
                                        <span>{SelectedPatient_list?.PatientName}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Patient ID:</label>
                                        <span>{SelectedPatient_list?.PatientId}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Age / Gender:</label>
                                        <span>{IP_BillingData?.AgeGender}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>D.O.A:</label>
                                        <span>{IP_BillingData?.AdmittionDate}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Address:</label>
                                        <span>{IP_BillingData?.Address}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Payer Type:</label>
                                        <span>{`${IP_BillingData?.PatientCategory} [IP]`}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Consultant:</label>
                                        <span>{IP_BillingData?.Doctor_ShortName}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Mobile No:</label>
                                        <span>{SelectedPatient_list?.PhoneNumber}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>IP NO:</label>
                                        <span>{SelectedPatient_list?.RegisterId}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Ward - Bed No:</label>
                                        <span>{SelectedPatient_list?.WardBedNo}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Invoice No:</label>
                                        <span>{PostInvoice}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Receipt No:</label>
                                        <span>{RecieptInvoice}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Invoice Date:</label>
                                        <span>{PostInvoicedate}</span>
                                    </div>
                                    <div className="new_billing_div">
                                        <label>Discharge Date:</label>
                                        <span>{SelectedPatient_list?.DischargeDate}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="7">
                                <table className="print-table33">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "30%" }}>Service Type / Name</th>
                                            <th style={{ width: "15%" }}>Charge</th>
                                            <th style={{ width: "10%" }}>Unit</th>
                                            <th style={{ width: "15%" }}>Amount</th>
                                            <th style={{ width: "15%" }}>Discount</th>
                                            <th style={{ width: "15%" }}>Net Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
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
                                                (sum, row) => sum + parseFloat(row.NetAmount || 0),
                                                0
                                            );

                                            return (
                                                <React.Fragment key={index}>
                                                    <tr className="service-type-heading">
                                                        <td colSpan="6">{serviceType}</td>
                                                    </tr>
                                                    {serviceRows.map((row, idx) => (
                                                        <tr key={idx}>
                                                            <td style={{ paddingLeft: "20px" }}>{row.SelectItemName}</td>
                                                            <td>₹{row.Charges || "-"}</td>
                                                            <td>{row.Quantity || "-"}</td>
                                                            <td>₹{row.Amount || "-"}</td>
                                                            <td>₹{row.Discount || "-"}</td>
                                                            <td>₹{row.NetAmount || "-"}</td>
                                                        </tr>
                                                    ))}
                                                    <tr className="subtotal-row">
                                                        <td colSpan="5" style={{ textAlign: "right" }}>Sub Total:</td>
                                                        <td>₹{subtotal.toFixed(2)}</td>
                                                    </tr>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="7">
                                <div className="new_billing_invoice_detials">
                                    <div className="invoice_detials_total_1">
                                        {billAmount.length > 0 && (
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
                                                            <td>₹{row.paidamount || '-'}</td>
                                                            {hasCard && (
                                                                <td>
                                                                    {row.Billpay_method === 'Card' && row.transactionFee
                                                                        ? `${parseInt(row.transactionFee)}%`
                                                                        : '-'}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                        {AdvanceAmountGet.length > 0 && (
                                            <table className="print-table33">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="4" style={{ textAlign: 'center' }}>Advance Amount</th>
                                                    </tr>
                                                    <tr>
                                                        <th>S.No</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {AdvanceAmountGet.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{row.Date || '-'}</td>
                                                            <td>{row.Time || '-'}</td>
                                                            <td>₹{row.AdvanceAmount || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                        <div className="bill_body_new_phar">
                                            <label>Amount In Words:</label>
                                            <span>{NumberToWords(+initialState.totalNetAmount)}</span>
                                        </div>
                                        <div className="bill_body_new_phar">
                                            <label>Billed By:</label>
                                            <span>{UserData?.Employeename}</span>
                                        </div>
                                        <div className="total-section">
                                            <div className="bill_body_new_phar">
                                                <label>Total Amount:</label>
                                                <span>₹{initialState.totalAmount}</span>
                                            </div>
                                            <div className="bill_body_new_phar">
                                                <label>Gross Amount:</label>
                                                <span>₹{initialState.totalAmount}</span>
                                            </div>
                                            <div className="bill_body_new_phar">
                                                <label>Discount Amount:</label>
                                                <span>₹{initialState.totalDiscount}</span>
                                            </div>
                                            <div className="bill_body_new_phar">
                                                <label>Net Amount:</label>
                                                <span>₹{initialState.totalNetAmount}</span>
                                            </div>
                                            <div className="bill_body_new_phar">
                                                <label>
                                                    {Math.abs(IP_BillingData.ReceivableAmount) > 0 && Paytype.isCash === "Yes" ? "Paid Amount" : "Refund Amount"}:
                                                </label>
                                                <span>₹{initialState.totalAmountt}</span>
                                            </div>
                                            <table className="print-table33">
                                                <tbody>
                                                    <tr>
                                                        <td>Total Advance</td>
                                                        <td>₹{AdvanceTotal}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Bill</td>
                                                        <td>₹{initialState.totalNetAmount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {Math.abs(IP_BillingData.ReceivableAmount) > 0 && Paytype.isCash === "Yes" ? "Paid Amount" : "Refund Amount"}
                                                        </td>
                                                        <td>₹{initialState.PaidAmount}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot className="print_footerr">
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                <p className="disclaimer23">
                                    This page is created automatically without a signature.
                                </p>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div className="Register_btn_con">
                    <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
                        Print
                    </button>
                    <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrintClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

  const ForPrintReimbData = () => {
      const hasCard = billAmount.some((p) => p.Billpay_method === 'Card');
      const hasCheque = billAmount.some((p) => p.Billpay_method === 'Cheque');
      const hasBank = billAmount.some((p) => p.Billpay_method === 'Bank');
      
      // Filter only reimbursable items
      const reimbursableItems = SelectDatalist.filter(item => item.isReimbursable === true);
      const reimbursableTotal = reimbursableItems.reduce((total, item) => total + parseFloat(item.NetAmount || 0), 0);
      
  
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
                    Reimbursable Invoice
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
                      </div>
  
                      <div className="new_billing_address_2 new_billing_address_2_new_up">
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
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "14px",
                      }}
                      className="print-table33"
                    >
                      <thead>
                        <tr
                          style={{
                            borderTop: "1.5px solid black",
                            borderBottom: "1.5px solid black",
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          <th style={{ padding: "8px", textAlign: "left" }}>Service Type / Name</th>
                          <th style={{ padding: "8px", textAlign: "center" }}>Unit</th>
                          <th style={{ padding: "8px", textAlign: "right" }}>Amount</th>
                          <th style={{ padding: "8px", textAlign: "right" }}>Net Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SelectDatalist && SelectDatalist.length > 0 ? (
                          (() => {
                            // Filter reimbursable items once
                            const reimbursableItems = SelectDatalist.filter(
                              (f) => f.isReimbursable === true || f.isReimbursable === "Yes"
                            );
  
                            // Calculate total reimbursable amount
                            const totalReimbursableAmount = reimbursableItems.reduce(
                              (sum, item) => sum + parseFloat(item.NetAmount || 0),
                              0
                            );
  
                            // Group by ServiceType
                            const groupedByServiceType = reimbursableItems.reduce((acc, row) => {
                              if (!acc[row.ServiceType]) {
                                acc[row.ServiceType] = [];
                              }
                              acc[row.ServiceType].push(row);
                              return acc;
                            }, {});
  
                            // If no reimbursable items, show fallback
                            if (Object.keys(groupedByServiceType).length === 0) {
                              return (
                                <tr>
                                  <td colSpan="4" style={{ padding: "8px", textAlign: "center" }}>
                                    No reimbursable services available
                                  </td>
                                </tr>
                              );
                            }
  
                            // Render grouped items
                            return Object.keys(groupedByServiceType).map((serviceType, index) => {
                              const serviceRows = groupedByServiceType[serviceType];
                              const subtotal = serviceRows.reduce(
                                (sum, row) => sum + parseFloat(row.NetAmount || 0),
                                0
                              );
  
                              return (
                                <React.Fragment key={index}>
                                  <tr>
                                    <td
                                      colSpan="4"
                                      style={{
                                        fontWeight: "bold",
                                        padding: "8px",
                                        textAlign: "left",
                                        backgroundColor: "#f8f9fa",
                                        borderTop: "1px solid grey",
                                      }}
                                    >
                                      {serviceType}
                                    </td>
                                  </tr>
                                  {serviceRows.map((row, idx) => (
                                    <tr key={idx}>
                                      <td style={{ padding: "8px 8px 8px 20px", textAlign: "left" }}>
                                        {row.SelectItemName || "-"}
                                      </td>
                                      <td style={{ padding: "8px", textAlign: "center" }}>
                                        {row.Quantity || "-"}
                                      </td>
                                      <td style={{ padding: "8px", textAlign: "right" }}>
                                        {row.Amount || "-"}
                                      </td>
                                      <td style={{ padding: "8px", textAlign: "right" }}>
                                        {row.NetAmount || "-"}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td
                                      colSpan="3"
                                      style={{
                                        fontWeight: "bold",
                                        textAlign: "right",
                                        padding: "8px",
                                        borderTop: "1px solid grey",
                                      }}
                                    >
                                      Sub Total:
                                    </td>
                                    <td style={{ padding: "8px", textAlign: "right" }}>
                                      {subtotal.toFixed(2)}
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            });
                          })()
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ padding: "8px", textAlign: "center" }}>
                              No services available
                            </td>
                          </tr>
                        )}
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
                          {billAmount.length > 0 &&
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
                                    {hasCard && (
                                      <td>
                                        {row.Billpay_method === 'Card' && row.transactionFee
                                          ? `${parseInt(row.transactionFee)}%`
                                          : '-'}
                                      </td>
                                    )}
                                  </tr>
  
                                ))}
                              </tbody>
                            </table>
                          }
                        </div>
                        {AdvanceAmountGet.length > 0 && <table className="print-table33">
                          <thead>
                            <tr style={{
                              // borderTop: '1px solid #f5f5f5',
                              // borderBottom: '1px solid rgb(87, 72, 72)',
                              // borderLeft: "",
                              // borderRight: "",
                            }}><th colSpan={"4"}
                              style={{
                                textAlign: 'center',
                              }}
                            >Advance Amount</th></tr>
                            <tr style={{
                              textAlign: 'center',
                            }}>
                              <th>S.No</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {AdvanceAmountGet.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Date || '-'}</td>
                                <td>{row.Time || '-'}</td>
                                <td>{row.AdvanceAmount || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>}
                        <div className="bill_body_new_phar">
                          <label>
                            Amount In Words <span>:</span>
                          </label>
                          <span>
                            {NumberToWords(+initialState.ReimbursableAmount)}
                          </span>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Billed By <span>:</span>
                          </label>
                          <span>{UserData?.Employeename}</span>
                        </div>
                      </div>
  
                      <div style={{ width: "40%", justifyContent: "flex-end" }}>
                        <div className="bill_body_new_phar">
                          <label>
                            Total Amount <span>:</span>
                          </label>
                          <span>{initialState.ReimbursableAmount}</span>
                        </div>
                        {/* <div className="bill_body_new_phar">
                          <label>
                            Gross Amount <span>:</span>
                          </label>
                          <span>{initialState.totalAmount}</span>
                        </div> */}
                        <div className="bill_body_new_phar">
                        <label>Discount Amount<span>:</span></label>
                        <span>{initialState.totalDiscount}</span>
                      </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Net Amount <span>:</span>
                          </label>
                          <span>{initialState.ReimbursableAmount}</span>
                        </div>
                        {/* <div className="bill_body_new_phar">
                          <label>
                            {Math.abs(IP_BillingData.ReceivableAmount) > 0 && Paytype.isCash === "Yes" ? "Paid Amount" : "Refund Amount"}<span>:</span>
                          </label>
                          <span>{initialState.totalAmountt}</span>
                        </div> */}
                        {/* <br />
                        <div>
                          <table style={{ border: 'none', borderCollapse: 'collapse' }}>
                            <tr style={{ borderTop: '1px solid black' }}>
                              <td style={{ borderTop: '1px solid black' }}>Total Advance</td>
                              <td style={{ borderTop: '1px solid black' }}>{AdvanceTotal}</td>
                            </tr>
                            <tr>
                              <td>Total Bill</td>
                              <td>{initialState.totalNetAmount}</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                              <td style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                                {Math.abs(IP_BillingData.ReceivableAmount) > 0 && Paytype.isCash === "Yes" ? "Paid Amount" : "Refund Amount"}
                              </td>
                              <td style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                                {initialState.PaidAmount}
                              </td>
                            </tr>
                          </table>
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
                    Non-Reimbursable Invoice
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
                      </div>
  
                      <div className="new_billing_address_2 new_billing_address_2_new_up">
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
                          {billAmount.length > 0 &&
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
                                    {hasCard && (
                                      <td>
                                        {row.Billpay_method === 'Card' && row.transactionFee
                                          ? `${parseInt(row.transactionFee)}%`
                                          : '-'}
                                      </td>
                                    )}
                                  </tr>
  
                                ))}
                              </tbody>
                            </table>
                          }
                        </div>
                        {AdvanceAmountGet.length > 0 && <table className="print-table33">
                          <thead>
                            <tr style={{
                              // borderTop: '1px solid #f5f5f5',
                              // borderBottom: '1px solid rgb(87, 72, 72)',
                              // borderLeft: "",
                              // borderRight: "",
                            }}><th colSpan={"4"}
                              style={{
                                textAlign: 'center',
                              }}
                            >Advance Amount</th></tr>
                            <tr style={{
                              textAlign: 'center',
                            }}>
                              <th>S.No</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {AdvanceAmountGet.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Date || '-'}</td>
                                <td>{row.Time || '-'}</td>
                                <td>{row.AdvanceAmount || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>}
                        <div className="bill_body_new_phar">
                          <label>
                            Amount In Words <span>:</span>
                          </label>
                          <span>
                            {NumberToWords(+initialState.NonReimbursableAmount)}
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
                          <span>{initialState.NonReimbursableAmount}</span>
                        </div>  
                        <div className="bill_body_new_phar">
                        <label>Discount Amount<span>:</span></label>
                        <span>{initialState.totalDiscount}</span>
                      </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Net Amount <span>:</span>
                          </label>
                          <span>{initialState.NonReimbursableAmount}</span>
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

  const ForPrintDetailedBill = () => {
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
                        <span>
                          {[ClinicDetials?.ClinicAddress].filter((detail) => detail).join(", ")},
                          {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode].filter((detail) => detail).join(", ")}
                        </span>
                      </div>
                      <div>
                        {[ClinicDetials?.ClinicMobileNo, ClinicDetials?.ClinicLandLineNo, ClinicDetials?.ClinicMailID].filter((detail) => detail).join(" , ")}
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
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Patient Name <span>:</span></label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Patient ID <span>:</span></label>
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Age / Gender <span>:</span></label>
                        <h4>{IP_BillingData.AgeGender}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>D.O.A <span>:</span></label>
                        <h4>{IP_BillingData.AdmittionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Address <span>:</span></label>
                        <h4>{IP_BillingData.Address}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Payer Type <span>:</span></label>
                        <h4>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Consultant <span>:</span></label>
                        <h4>{IP_BillingData.Doctor_ShortName}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Mobile No <span>:</span></label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>IP NO <span>:</span></label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Ward - Bed No <span>:</span></label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Invoice No<span>:</span></label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Receipt No<span>:</span></label>
                        <h4>{RecieptInvoice}</h4>
                      </div> */}
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Invoice Date<span>:</span></label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Discharge Date <span>:</span></label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
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
                        <th style={{ borderTop: "1px solid black" }}>Date</th>
                        <th style={{ border: "none" }}>Service</th>
                        <th style={{ border: "none" }}>Item Name</th>
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
                        <tr key={index}>
                          <td style={{ border: "none" }}>{row.Date}</td>
                          <td style={{ border: "none" }}>{row.ServiceType}</td>
                          <td style={{ border: "none" }}>{row.SelectItemName}</td>
                          <td style={{ border: "none" }}>{row.NetAmount}</td>
                        </tr>
                      ))}
                      <tr
                        style={{
                          borderTop: "1px solid grey",
                          marginBottom: "10px",
                        }}
                      >
                        <td colSpan="3" style={{ border: "none", textAlign: "right", fontWeight: "bold" }}>
                          Total Amount <span>:</span>
                        </td>
                        <td style={{ border: "none" }}>
                          {SelectDatalist.reduce((sum, row) => sum + parseFloat(row.NetAmount), 0).toFixed(2)}
                        </td>
                      </tr>
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
                        {billAmount.length > 0 && (
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
                                  {hasCard && (
                                    <td>
                                      {row.Billpay_method === 'Card' && row.transactionFee
                                        ? `${parseInt(row.transactionFee)}%`
                                        : '-'}
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                      {AdvanceAmountGet.length > 0 && (
                        <table className="print-table33">
                          <thead>
                            <tr>
                              <th colSpan="4" style={{ textAlign: 'center' }}>
                                Advance Amount
                              </th>
                            </tr>
                            <tr style={{ textAlign: 'center' }}>
                              <th>S.No</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {AdvanceAmountGet.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Date || '-'}</td>
                                <td>{row.Time || '-'}</td>
                                <td>{row.AdvanceAmount || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      <div className="bill_body_new_phar">
                        <label>Amount In Words <span>:</span></label>
                        <span>{NumberToWords(+initialState.totalNetAmount)}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>Billed By <span>:</span></label>
                        <span>{BillingData.Billedby}</span>
                      </div>
                    </div>
                    <div style={{ width: "40%", justifyContent: "flex-end" }}>
                      <div className="bill_body_new_phar">
                        <label>Total Amount <span>:</span></label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>Gross Amount <span>:</span></label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>Discount Amount<span>:</span></label>
                        <span>{initialState.totalDiscount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>Net Amount <span>:</span></label>
                        <span>{initialState.totalNetAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          {Math.abs(IP_BillingData.ReceivableAmount) > 0 && Paytype.isCash === "Yes" ? "Paid Amount" : "Refund Amount"}<span>:</span>
                        </label>
                        <span>{initialState.totalAmountt}</span>
                      </div>
                      <br />
                      <div>
                        <table style={{ border: 'none', borderCollapse: 'collapse' }}>
                          <tr style={{ borderTop: '1px solid black' }}>
                            <td style={{ borderTop: '1px solid black' }}>Total Advance</td>
                            <td style={{ borderTop: '1px solid black' }}>{AdvanceTotal}</td>
                          </tr>
                          <tr>
                            <td>Total Bill</td>
                            <td>{initialState.totalNetAmount}</td>
                          </tr>
                          <tr style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                            <td style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                              {Math.abs(IP_BillingData.ReceivableAmount) > 0 && Paytype.isCash === "Yes" ? "Paid Amount" : "Refund Amount"}
                            </td>
                            <td style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                              {initialState.PaidAmount}
                            </td>
                          </tr>
                        </table>
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

//   const ForPrintData = () => {
//     const hasCard = billAmount.some((p) => p.Billpay_method === 'Card');
//     const hasCheque = billAmount.some((p) => p.Billpay_method === 'Cheque');
//     const hasBank = billAmount.some((p) => p.Billpay_method === 'Bank');

//     // Function to convert time to AM/PM format
//     const formatTimeToAMPM = (timeString) => {
//         if (!timeString) return '-';
        
//         try {
//             const [hours, minutes] = timeString.split(':');
//             const h = parseInt(hours, 10);
//             const period = h >= 12 ? 'PM' : 'AM';
//             const h12 = h % 12 || 12;
//             return `${h12}:${minutes} ${period}`;
//         } catch (error) {
//             return timeString;
//         }
//     };

//     return (
//         <div ref={componentRef}>
//             <div
//                 style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     minHeight: "100vh",
//                 }}
//                 id="reactprintcontent"
//             >
//                 <table className="print-table33" style={{ borderCollapse: "collapse", width: "100%" }}>
//                     <thead className="print_header" style={{ width: "100%", borderCollapse: "collapse" }}>
//                         <tr>
//                             <td colSpan="8" style={{ border: "none", padding: "0" }}>
//                                 <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg" style={{ padding: "5px 0", margin: 0 }}>
//                                     <div className="new_billing_logo_con">
//                                         <img src={ClinicDetails?.Clogo} alt="Clinic Logo" style={{ maxHeight: "60px" }} />
//                                     </div>
//                                     <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
//                                         <span style={{ fontSize: "16px", fontWeight: "bold" }}>{ClinicDetails?.Cname}</span>
//                                         <div style={{ fontSize: "12px", lineHeight: "1.2" }}>
//                                             <span>
//                                                 {[ClinicDetials?.ClinicAddress].filter((detail) => detail).join(", ")},
//                                                 {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode].filter((detail) => detail).join(", ")}
//                                             </span>
//                                         </div>
//                                         <div style={{ fontSize: "12px", lineHeight: "1.2" }}>
//                                             {[ClinicDetials?.ClinicMobileNo, ClinicDetials?.ClinicLandLineNo, ClinicDetials?.ClinicMailID].filter((detail) => detail).join(" , ")}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </td>
//                         </tr>
//                         <tr>
//                             <td colSpan="8" style={{ textAlign: "center", fontWeight: "600", color: "black", fontSize: "16px", padding: "2px 0" }}>
//                                 ESTIMATED BILL
//                             </td>
//                         </tr>
//                         <tr>
//                             <td colSpan="8" style={{ padding: "0" }}>
//                                 <div className="new_billing_address new_addn_p037" style={{ margin: "5px 0", padding: "0" }}>
//                                     <div className="new_billing_address_2 new_billing_address_2_new_up" style={{ lineHeight: "1.2", paddingLeft:"20px" }}>
//                                         <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                                             <label>Patient Name <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.PatientName}</h4>
//                                         </div>
//                                         <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                                             <label>Patient ID <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.PatientId}</h4>
//                                         </div>
//                                         <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                                             <label>Age / Gender <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{IP_BillingData.AgeGender}</h4>
//                                         </div>
//                                         <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                                             <label>D.O.A <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{IP_BillingData.AdmittionDate}</h4>
//                                         </div>
//                                         <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                                             <label>Address <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{IP_BillingData.Address}</h4>
//                                         </div>
//                                     </div>
//                                     <div className="new_billing_address_2 new_billing_address_2_new_up" style={{ lineHeight: "1.2" }}>
//                                         <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                                             <label>IP NO <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.RegisterId}</h4>
//                                         </div>
//                                         <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                                             <label>Ward - Bed No <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.WardBedNo}</h4>
//                                         </div>
//                                         <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                                             <label>Mobile No <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.PhoneNumber}</h4>
//                                         </div>
//                                         <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                                             <label>Payer Type <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
//                                         </div>
//                                         <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                                             <label>Discharge Date <span>:</span></label>
//                                             <h4 style={{ margin: "0", fontSize: "12px" }}>{`${BillingData.InvoiceDate} ${BillingData.InvoiceTime}`}</h4>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </td>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         <tr>
//                             <td colSpan="8" className="prin_nnrmll_table" style={{ padding: "0" }}>
//                                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
//                                     <thead>
//                                         <tr style={{ borderTop: "1.5px solid black", borderBottom: "1.5px solid black", backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
//                                             <th style={{ padding: "4px", border: "1px solid #ddd" }}>S.No</th>
//                                             <th style={{ padding: "4px", border: "1px solid #ddd" }}>Service Name</th>
//                                             <th style={{ padding: "4px", border: "1px solid #ddd" }}>Credit No</th>
//                                             <th style={{ padding: "4px", border: "1px solid #ddd" }}>Charge</th>
//                                             <th style={{ padding: "4px", border: "1px solid #ddd" }}>Qty</th>
//                                             <th style={{ padding: "4px", border: "1px solid #ddd" }}>Amount</th>
//                                             <th style={{ padding: "4px", border: "1px solid #ddd" }}>Discount</th>
//                                             <th style={{ padding: "4px", border: "1px solid #ddd" }}>Net Amount</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody style={{ borderBottom: "1.5px solid black" }}>
//                                         {SelectDatalist.map((row, index) => (
//                                             <tr key={index} style={{ lineHeight: "1.1" }}>
//                                                 <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
//                                                 <td style={{ padding: "3px", border: "1px solid #ddd", fontWeight: "bold" }}>{row.SelectItemName || '-'}</td>
//                                                 <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "center", fontWeight: "bold" }}>{row.VoucherNo || '-'}</td>
//                                                 <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>{row.Charges || '0.00'}</td>
//                                                 <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "center", fontWeight: "bold" }}>{row.Quantity || '1'}</td>
//                                                 <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>{row.Amount || '0.00'}</td>
//                                                 <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>{row.Discount || '0.00'}</td>
//                                                 <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>{row.NetAmount}</td>
//                                             </tr>
//                                         ))}
//                                         <tr style={{ borderTop: "1px solid grey", fontWeight: "bold", lineHeight: "1.2" }}>
//                                             <td colSpan="5" style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                 Total
//                                             </td>
//                                             <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                 {SelectDatalist.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0).toFixed(2)}
//                                             </td>
//                                             <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                 {SelectDatalist.reduce((sum, row) => sum + parseFloat(row.Discount || 0), 0).toFixed(2)}
//                                             </td>
//                                             <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                 {SelectDatalist.reduce((sum, row) => sum + parseFloat(row.NetAmount || 0), 0).toFixed(2)}
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </td>
//                         </tr>
//                     </tbody>

//                     <tr>
//                         <td colSpan="8" style={{ padding: "0" }}>
//                             <div className="new_billing_invoice_detials" style={{ margin: "10px 0 0 0" }}>
//                                 <div className="invoice_detials_total_1" style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
//                                     <div style={{ width: "55%" }}>

//                                       {/* Pharmacy Items Table */}
//                                       {Pharmadetails.length > 0 && (
//                                         <div style={{ marginBottom: "15px" }}>
//                                             <h4 style={{ marginBottom: "5px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>
//                                                 Pharmacy Items
//                                             </h4>
//                                             <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
//                                                 <thead>
//                                                     <tr style={{ backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>S.No</th>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>INV.No</th>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>Date</th>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>Item Name</th>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>Amount</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {Pharmadetails.map((item, index) => (
//                                                         <tr key={index} style={{ lineHeight: "1.1" }}>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{item.Billing_Invoice_No || "-"}</td>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd" }}>{item.Billing_Date || "-"}</td>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd" }}>{item.Billing_Type || "-"}</td>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                                 ₹{(parseFloat(item.Net_Amount) || 0).toFixed(2)}
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                     {/* Total Medicines Row */}
//                                                     <tr style={{ fontWeight: "bold", borderTop: "1px solid grey", lineHeight: "1.2" }}>
//                                                         <td colSpan={4} style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                             Total Medicines
//                                                         </td>
//                                                         <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                             ₹{(parseFloat(grandTotal) || 0).toFixed(2)}
//                                                         </td>
//                                                     </tr>
//                                                 </tbody>
//                                             </table>

//                                             {/* Refund Details Table */}
//                                             {Pharmarefunddetails.length > 0 && (
//                                                 <div style={{ marginTop: "10px", marginBottom: "10px" }}>
//                                                     <h4 style={{ marginBottom: "5px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>
//                                                         Refund Details
//                                                     </h4>
//                                                     <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
//                                                         <thead>
//                                                             <tr style={{ backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
//                                                                 <th style={{ padding: "3px", border: "1px solid #ddd" }}>S.No</th>
//                                                                 <th style={{ padding: "3px", border: "1px solid #ddd" }}>Voucher No</th>
//                                                                 <th style={{ padding: "3px", border: "1px solid #ddd" }}>Date</th>
//                                                                 <th style={{ padding: "3px", border: "1px solid #ddd" }}>Amount</th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {Pharmarefunddetails.map((item, index) => (
//                                                                 <tr key={index} style={{ lineHeight: "1.1" }}>
//                                                                     <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
//                                                                     <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{item.Voucher_Number || "-"}</td>
//                                                                     <td style={{ padding: "2px", border: "1px solid #ddd" }}>{item.Billing_Date || "-"}</td>
//                                                                     <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                                         ₹{(parseFloat(item.PaidAmount) || 0).toFixed(2)}
//                                                                     </td>
//                                                                 </tr>
//                                                             ))}
//                                                             {/* Total Refund Medicines Row */}
//                                                             <tr style={{ fontWeight: "bold", borderTop: "1px solid grey", lineHeight: "1.2" }}>
//                                                                 <td colSpan={3} style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                                     Refund Medicines
//                                                                 </td>
//                                                                 <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                                     ₹{(parseFloat(grandrefundTotal) || 0).toFixed(2)}
//                                                                 </td>
//                                                             </tr>
//                                                         </tbody>
//                                                     </table>
//                                                 </div>
//                                             )}

//                                             {/* Summary Section */}
//                                             <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right", fontSize: "11px", lineHeight: "1.2" }}>
//                                                 <div style={{ marginBottom: "3px" }}>
//                                                     Total Medicines: ₹{(parseFloat(grandTotal) || 0).toFixed(2)}
//                                                 </div>
//                                                 <div style={{ marginBottom: "3px" }}>
//                                                     Refund Medicines: ₹{(parseFloat(grandrefundTotal) || 0).toFixed(2)}
//                                                 </div>
//                                                 <div style={{ borderTop: "1px solid #ddd", paddingTop: "3px" }}>
//                                                     Final Amount: ₹{(parseFloat(grandTotal - grandrefundTotal) || 0).toFixed(2)}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                       )}

//                                       {AdvanceAmountGet.length > 0 && (
//                                         <div style={{ marginBottom: "15px" }}>
//                                             <h4 style={{ marginBottom: "5px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>Advance Amount</h4>
//                                             <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
//                                                 <thead>
//                                                     <tr style={{ backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>S.No</th>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>Date</th>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>Time</th>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>Amount</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {AdvanceAmountGet.map((row, index) => (
//                                                         <tr key={index} style={{ lineHeight: "1.1" }}>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd" }}>{row.Date || '-'}</td>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>
//                                                                 {formatTimeToAMPM(row.Time) || '-'}
//                                                             </td>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "right" }}>{row.AdvanceAmount || '-'}</td>
//                                                         </tr>
//                                                     ))}
//                                                     <tr style={{ fontWeight: "bold", lineHeight: "1.2" }}>
//                                                         <td colSpan="3" style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                             Total Advance
//                                                         </td>
//                                                         <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
//                                                             {AdvanceAmountGet.reduce((sum, row) => sum + parseFloat(row.AdvanceAmount || 0), 0).toFixed(2)}
//                                                         </td>
//                                                     </tr>
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                       )}

//                                       {billAmount.length > 0 && (
//                                         <div style={{ marginBottom: "15px" }}>
//                                             <h4 style={{ marginBottom: "5px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>Payment Details</h4>
//                                             <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
//                                                 <thead>
//                                                     <tr style={{ backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>S.No</th>
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>Payment Type</th>
//                                                         {hasCard && <th style={{ padding: "3px", border: "1px solid #ddd" }}>Card Type</th>}
//                                                         {hasCheque && <th style={{ padding: "3px", border: "1px solid #ddd" }}>Cheque No</th>}
//                                                         {hasBank && <th style={{ padding: "3px", border: "1px solid #ddd" }}>Bank Name</th>}
//                                                         <th style={{ padding: "3px", border: "1px solid #ddd" }}>Amount</th>
//                                                         {hasCard && <th style={{ padding: "3px", border: "1px solid #ddd" }}>Transaction Fee</th>}
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {billAmount.map((row, index) => (
//                                                         <tr key={index} style={{ lineHeight: "1.1" }}>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd" }}>{row.Billpay_method || '-'}</td>
//                                                             {hasCard && (
//                                                                 <td style={{ padding: "2px", border: "1px solid #ddd" }}>
//                                                                     {row.Billpay_method === 'Card' ? row.CardType || '-' : '-'}
//                                                                 </td>
//                                                             )}
//                                                             {hasCheque && (
//                                                                 <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>
//                                                                     {row.Billpay_method === 'Cheque' ? row.ChequeNo || '-' : '-'}
//                                                                 </td>
//                                                             )}
//                                                             {hasBank && (
//                                                                 <td style={{ padding: "2px", border: "1px solid #ddd" }}>
//                                                                     {row.Billpay_method === 'Bank' ? row.BankName || '-' : '-'}
//                                                                 </td>
//                                                             )}
//                                                             <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "right" }}>{row.paidamount || '-'}</td>
//                                                             {hasCard && (
//                                                                 <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>
//                                                                     {row.Billpay_method === 'Card' && row.transactionFee
//                                                                         ? `${parseInt(row.transactionFee)}%`
//                                                                         : '-'}
//                                                                 </td>
//                                                             )}
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                       )}

//                                       <div style={{ marginTop: "10px", fontSize: "11px", lineHeight: "1.2" }}>
//                                           <div style={{ marginBottom: "5px", display:"flex", gap: "3px" }}>
//                                               <label style={{ fontWeight: "bold" }}>Amount In Words: </label>
//                                               <span>{NumberToWords(+initialState.totalNetAmount)}</span>
//                                           </div>
//                                           <div style={{ display:"flex", gap: "5px" }}>
//                                               <label style={{ fontWeight: "bold" }}>Billed By: </label>
//                                               <span>{BillingData.Billedby}</span>
//                                           </div>
//                                       </div>
//                                     </div>

//                                     <div style={{ width: "40%", border: "1px solid #ddd", padding: "8px", borderRadius: "5px", fontSize: "11px" }}>
//                                         <h4 style={{ marginBottom: "8px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>Summary</h4>
//                                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", lineHeight: "1.2" }}>
//                                             <span style={{ fontWeight: "bold" }}>Grand Total:</span>
//                                             <span style={{ fontWeight: 900, fontSize: "12px" }}>{initialState.totalTaxable}</span>
//                                         </div>
//                                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px", borderBottom: "1px solid black", lineHeight: "1.2" }}>
//                                             <span style={{ fontWeight: "bold" }}>Scheme Discount:</span>
//                                             <span style={{ fontWeight: 900, fontSize: "12px" }}>{initialState.schemediscount}</span>
//                                         </div> 

//                                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", borderBottom: "1px solid black", lineHeight: "1.2" }}>
//                                             <span style={{ fontWeight: "bold" }}>Total Amount:</span>
//                                             <span style={{ fontWeight: 900, fontSize: "12px" }}>{initialState.afterschemedistotal}</span>
//                                         </div>
//                                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", lineHeight: "1.2" }}>
//                                             <span style={{ fontWeight: "bold" }}>Final Discount:</span>
//                                             <span style={{ fontWeight: 900, fontSize: "12px" }}>{initialState.totalDiscount}</span>                                
//                                         </div>
//                                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px", borderBottom: "1px solid black", lineHeight: "1.2" }}>
//                                             <span style={{ fontWeight: "bold" }}>Total Advance:</span>
//                                             <span style={{ fontWeight: 900, fontSize: "12px" }}>{AdvanceTotal}</span>                                
//                                         </div>
//                                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", borderBottom: "1px solid black", lineHeight: "1.2" }}>
//                                             <span style={{ fontWeight: "bold" }}>{RemainingCredit > 0 ? "Refund Amount" : "Net Amount"}:</span>
//                                         <span style={{ fontWeight: 900, fontSize: "12px" }}>
//                                           { RemainingCredit > 0 ? Math.abs(RemainingCredit).toFixed(2) :(
//                                             initialState.afterschemedistotal -
//                                             (parseFloat(initialState.totalDiscount || 0) +
//                                             parseFloat(AdvanceTotal || 0))
//                                           ).toFixed(2)}
//                                         </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </td>
//                     </tr>

//                     <tfoot className="print_footerr">
//                         <tr>
//                             <td colSpan="8" style={{ padding: "10px 0", textAlign: "center" }}>
//                                 <p style={{ fontStyle: "italic", marginTop: "15px", fontSize: "10px" }}>
//                                     This page is created automatically without a signature.
//                                 </p>
//                             </td>
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>

//             <div className="Register_btn_con added_Register_btn_con">
//                 <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
//                     Print
//                 </button>
//                 <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrintClose}>
//                     Close
//                 </button>
//             </div>
//         </div>
//     );
// };


  const ForPrintData = () => {
    const hasCard = billAmount.some((p) => p.Billpay_method === 'Card');
    const hasCheque = billAmount.some((p) => p.Billpay_method === 'Cheque');
    const hasBank = billAmount.some((p) => p.Billpay_method === 'Bank');

    // Function to convert time to AM/PM format
    const formatTimeToAMPM = (timeString) => {
        if (!timeString) return '-';
        
        try {
            const [hours, minutes] = timeString.split(':');
            const h = parseInt(hours, 10);
            const period = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${minutes} ${period}`;
        } catch (error) {
            return timeString;
        }
    };

    // Group SelectDatalist by VoucherNo
    const groupByVoucherNo = (data) => {
        const grouped = {};
        data.forEach((item) => {
            const voucherNo = item.VoucherNo || 'No Voucher';
            if (!grouped[voucherNo]) {
                grouped[voucherNo] = [];
            }
            grouped[voucherNo].push(item);
        });
        return grouped;
    };

    const groupedData = groupByVoucherNo(SelectDatalist);
    const voucherNos = Object.keys(groupedData);

    // Calculate totals for each voucher group
    const voucherTotals = {};
    voucherNos.forEach(voucherNo => {
        const items = groupedData[voucherNo];
        voucherTotals[voucherNo] = {
            amount: items.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0),
            discount: items.reduce((sum, row) => sum + parseFloat(row.Discount || 0), 0),
            netAmount: items.reduce((sum, row) => sum + parseFloat(row.NetAmount || 0), 0)
        };
    });

    // Calculate grand totals
    const grandTotalAmount = SelectDatalist.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0);
    const grandTotalDiscount = SelectDatalist.reduce((sum, row) => sum + parseFloat(row.Discount || 0), 0);
    const grandTotalNetAmount = SelectDatalist.reduce((sum, row) => sum + parseFloat(row.NetAmount || 0), 0);

    let serialNumber = 0;

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
                <table className="print-table33" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead className="print_header" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tr>
                            <td colSpan="8" style={{ border: "none", padding: "0" }}>
                                <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg" style={{ padding: "5px 0", margin: 0 }}>
                                    <div className="new_billing_logo_con">
                                        <img src={ClinicDetails?.Clogo} alt="Clinic Logo" style={{ maxHeight: "60px" }} />
                                    </div>
                                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>{ClinicDetails?.Cname}</span>
                                        <div style={{ fontSize: "12px", lineHeight: "1.2" }}>
                                            <span>
                                                {[ClinicDetials?.ClinicAddress].filter((detail) => detail).join(", ")},
                                                {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode].filter((detail) => detail).join(", ")}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "12px", lineHeight: "1.2" }}>
                                            {[ClinicDetials?.ClinicMobileNo, ClinicDetials?.ClinicLandLineNo, ClinicDetials?.ClinicMailID].filter((detail) => detail).join(" , ")}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", fontWeight: "600", color: "black", fontSize: "16px", padding: "2px 0" }}>
                                ESTIMATED BILL
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="8" style={{ padding: "0" }}>
                                <div className="new_billing_address new_addn_p037" style={{ margin: "5px 0", padding: "0" }}>
                                    <div className="new_billing_address_2 new_billing_address_2_new_up" style={{ lineHeight: "1.2", paddingLeft:"20px" }}>
                                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Patient Name <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.PatientName}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Patient ID <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.PatientId}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Age / Gender <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{IP_BillingData.AgeGender}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>D.O.A <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{IP_BillingData.AdmittionDate}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Address <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{IP_BillingData.Address}</h4>
                                        </div>
                                    </div>
                                    <div className="new_billing_address_2 new_billing_address_2_new_up" style={{ lineHeight: "1.2" }}>
                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                            <label>IP NO <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.RegisterId}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                            <label>Ward - Bed No <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.WardBedNo}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                            <label>Mobile No <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{SelectedPatient_list.PhoneNumber}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                            <label>Payer Type <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                            <label>Discharge Date <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{`${BillingData.InvoiceDate} ${BillingData.InvoiceTime}`}</h4>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td colSpan="8" className="prin_nnrmll_table" style={{ padding: "0" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                    <thead>
                                        <tr style={{ borderTop: "1.5px solid black", borderBottom: "1.5px solid black", backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
                                            <th style={{ padding: "4px", border: "1px solid #ddd" }}>S.No</th>
                                            <th style={{ padding: "4px", border: "1px solid #ddd" }}>Service Name</th>
                                            <th style={{ padding: "4px", border: "1px solid #ddd" }}>Credit No</th>
                                            <th style={{ padding: "4px", border: "1px solid #ddd" }}>Charge</th>
                                            <th style={{ padding: "4px", border: "1px solid #ddd" }}>Qty</th>
                                            <th style={{ padding: "4px", border: "1px solid #ddd" }}>Amount</th>
                                            <th style={{ padding: "4px", border: "1px solid #ddd" }}>Discount</th>
                                            <th style={{ padding: "4px", border: "1px solid #ddd" }}>Net Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ borderBottom: "1.5px solid black" }}>
                                        {voucherNos.map((voucherNo) => (
                                            <>
                                                {groupedData[voucherNo].map((row, index) => {
                                                    serialNumber++;
                                                    return (
                                                        <tr key={`${voucherNo}-${index}`} style={{ lineHeight: "1.1" }}>
                                                            <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "center" }}>{serialNumber}</td>
                                                            <td style={{ padding: "3px", border: "1px solid #ddd", fontWeight: "bold" }}>{row.SelectItemName || '-'}</td>
                                                            <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "center", fontWeight: "bold" }}>{row.VoucherNo || '-'}</td>
                                                            <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>{row.Charges || '0.00'}</td>
                                                            <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "center", fontWeight: "bold" }}>{row.Quantity || '1'}</td>
                                                            <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>{row.Amount || '0.00'}</td>
                                                            <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>{row.Discount || '0.00'}</td>
                                                            <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>{row.NetAmount}</td>
                                                        </tr>
                                                    );
                                                })}
                                                {/* Subtotal for each voucher group */}
                                                <tr style={{ backgroundColor: '#f0f0f0', fontWeight: "bold", lineHeight: "1.2" }}>
                                                    <td colSpan="5" style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right", fontStyle: 'italic' }}>
                                                        Sub Total
                                                    </td>
                                                    <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right", fontStyle: 'italic' }}>
                                                        {voucherTotals[voucherNo].amount.toFixed(2)}
                                                    </td>
                                                    <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right", fontStyle: 'italic' }}>
                                                        {voucherTotals[voucherNo].discount.toFixed(2)}
                                                    </td>
                                                    <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right", fontStyle: 'italic' }}>
                                                        {voucherTotals[voucherNo].netAmount.toFixed(2)}
                                                    </td>
                                                </tr>
                                            </>
                                        ))}
                                        
                                        {/* Grand Total */}
                                        <tr style={{ borderTop: "1px solid grey", fontWeight: "bold", lineHeight: "1.2" }}>
                                            <td colSpan="5" style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right" }}>
                                                Grand Total
                                            </td>
                                            <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right" }}>
                                                {grandTotalAmount.toFixed(2)}
                                            </td>
                                            <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right" }}>
                                                {grandTotalDiscount.toFixed(2)}
                                            </td>
                                            <td style={{ padding: "4px", border: "1px solid #ddd", textAlign: "right" }}>
                                                {grandTotalNetAmount.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="new_billing_invoice_detials" style={{ margin: "10px 0 0 0" }}>
                                <div className="invoice_detials_total_1" style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                                    <div style={{ width: "55%" }}>

                                      {/* Pharmacy Items Table */}
                                      {Pharmadetails.length > 0 && (
                                        <div style={{ marginBottom: "15px" }}>
                                            <h4 style={{ marginBottom: "5px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>
                                                Pharmacy Items
                                            </h4>
                                            <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>S.No</th>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>INV.No</th>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>Date</th>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>Item Name</th>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Pharmadetails.map((item, index) => (
                                                        <tr key={index} style={{ lineHeight: "1.1" }}>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{item.Billing_Invoice_No || "-"}</td>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd" }}>{item.Billing_Date || "-"}</td>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd" }}>{item.Billing_Type || "-"}</td>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "right" }}>
                                                                ₹{(parseFloat(item.Net_Amount) || 0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {/* Total Medicines Row */}
                                                    <tr style={{ fontWeight: "bold", borderTop: "1px solid grey", lineHeight: "1.2" }}>
                                                        <td colSpan={4} style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
                                                            Total Medicines
                                                        </td>
                                                        <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
                                                            ₹{(parseFloat(grandTotal) || 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            {/* Refund Details Table */}
                                            {Pharmarefunddetails.length > 0 && (
                                                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                                                    <h4 style={{ marginBottom: "5px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>
                                                        Refund Details
                                                    </h4>
                                                    <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
                                                                <th style={{ padding: "3px", border: "1px solid #ddd" }}>S.No</th>
                                                                <th style={{ padding: "3px", border: "1px solid #ddd" }}>Voucher No</th>
                                                                <th style={{ padding: "3px", border: "1px solid #ddd" }}>Date</th>
                                                                <th style={{ padding: "3px", border: "1px solid #ddd" }}>Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Pharmarefunddetails.map((item, index) => (
                                                                <tr key={index} style={{ lineHeight: "1.1" }}>
                                                                    <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
                                                                    <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{item.Voucher_Number || "-"}</td>
                                                                    <td style={{ padding: "2px", border: "1px solid #ddd" }}>{item.Billing_Date || "-"}</td>
                                                                    <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "right" }}>
                                                                        ₹{(parseFloat(item.PaidAmount) || 0).toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {/* Total Refund Medicines Row */}
                                                            <tr style={{ fontWeight: "bold", borderTop: "1px solid grey", lineHeight: "1.2" }}>
                                                                <td colSpan={3} style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
                                                                    Refund Medicines
                                                                </td>
                                                                <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
                                                                    ₹{(parseFloat(grandrefundTotal) || 0).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {/* Summary Section */}
                                            <div style={{ marginTop: "10px", fontWeight: "bold", textAlign: "right", fontSize: "11px", lineHeight: "1.2" }}>
                                                <div style={{ marginBottom: "3px" }}>
                                                    Total Medicines: ₹{(parseFloat(grandTotal) || 0).toFixed(2)}
                                                </div>
                                                <div style={{ marginBottom: "3px" }}>
                                                    Refund Medicines: ₹{(parseFloat(grandrefundTotal) || 0).toFixed(2)}
                                                </div>
                                                <div style={{ borderTop: "1px solid #ddd", paddingTop: "3px" }}>
                                                    Final Amount: ₹{(parseFloat(grandTotal - grandrefundTotal) || 0).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                      )}

                                      {AdvanceAmountGet.length > 0 && (
                                        <div style={{ marginBottom: "15px" }}>
                                            <h4 style={{ marginBottom: "5px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>Advance Amount</h4>
                                            <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>S.No</th>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>Date</th>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>Time</th>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {AdvanceAmountGet.map((row, index) => (
                                                        <tr key={index} style={{ lineHeight: "1.1" }}>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd" }}>{row.Date || '-'}</td>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>
                                                                {formatTimeToAMPM(row.Time) || '-'}
                                                            </td>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "right" }}>{row.AdvanceAmount || '-'}</td>
                                                        </tr>
                                                    ))}
                                                    <tr style={{ fontWeight: "bold", lineHeight: "1.2" }}>
                                                        <td colSpan="3" style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
                                                            Total Advance
                                                        </td>
                                                        <td style={{ padding: "3px", border: "1px solid #ddd", textAlign: "right" }}>
                                                            {AdvanceAmountGet.reduce((sum, row) => sum + parseFloat(row.AdvanceAmount || 0), 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                      )}

                                      {billAmount.length > 0 && (
                                        <div style={{ marginBottom: "15px" }}>
                                            <h4 style={{ marginBottom: "5px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>Payment Details</h4>
                                            <table className="print-table33" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: "#f5f5f5", lineHeight: "1.2" }}>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>S.No</th>
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>Payment Type</th>
                                                        {hasCard && <th style={{ padding: "3px", border: "1px solid #ddd" }}>Card Type</th>}
                                                        {hasCheque && <th style={{ padding: "3px", border: "1px solid #ddd" }}>Cheque No</th>}
                                                        {hasBank && <th style={{ padding: "3px", border: "1px solid #ddd" }}>Bank Name</th>}
                                                        <th style={{ padding: "3px", border: "1px solid #ddd" }}>Amount</th>
                                                        {hasCard && <th style={{ padding: "3px", border: "1px solid #ddd" }}>Transaction Fee</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {billAmount.map((row, index) => (
                                                        <tr key={index} style={{ lineHeight: "1.1" }}>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
                                                            <td style={{ padding: "2px", border: "1px solid #ddd" }}>{row.Billpay_method || '-'}</td>
                                                            {hasCard && (
                                                                <td style={{ padding: "2px", border: "1px solid #ddd" }}>
                                                                    {row.Billpay_method === 'Card' ? row.CardType || '-' : '-'}
                                                                </td>
                                                            )}
                                                            {hasCheque && (
                                                                <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>
                                                                    {row.Billpay_method === 'Cheque' ? row.ChequeNo || '-' : '-'}
                                                                </td>
                                                            )}
                                                            {hasBank && (
                                                                <td style={{ padding: "2px", border: "1px solid #ddd" }}>
                                                                    {row.Billpay_method === 'Bank' ? row.BankName || '-' : '-'}
                                                                </td>
                                                            )}
                                                            <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "right" }}>{row.paidamount || '-'}</td>
                                                            {hasCard && (
                                                                <td style={{ padding: "2px", border: "1px solid #ddd", textAlign: "center" }}>
                                                                    {row.Billpay_method === 'Card' && row.transactionFee
                                                                        ? `${parseInt(row.transactionFee)}%`
                                                                        : '-'}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                      )}

                                      <div style={{ marginTop: "10px", fontSize: "11px", lineHeight: "1.2" }}>
                                          <div style={{ marginBottom: "5px", display:"flex", gap: "3px" }}>
                                              <label style={{ fontWeight: "bold" }}>Amount In Words: </label>
                                              <span>{NumberToWords(+initialState.totalNetAmount)}</span>
                                          </div>
                                          <div style={{ display:"flex", gap: "5px" }}>
                                              <label style={{ fontWeight: "bold" }}>Billed By: </label>
                                              <span>{BillingData.Billedby}</span>
                                          </div>
                                      </div>
                                    </div>

                                    <div style={{ width: "40%", border: "1px solid #ddd", padding: "8px", borderRadius: "5px", fontSize: "11px" }}>
                                        <h4 style={{ marginBottom: "8px", borderBottom: "1px solid #ddd", paddingBottom: "3px", fontSize: "12px" }}>Summary</h4>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", lineHeight: "1.2" }}>
                                            <span style={{ fontWeight: "bold" }}>Grand Total:</span>
                                            <span style={{ fontWeight: 900, fontSize: "12px" }}>{initialState.Itempharmacygrandtotal}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px", borderBottom: "1px solid black", lineHeight: "1.2" }}>
                                            <span style={{ fontWeight: "bold" }}>Scheme Discount:</span>
                                            <span style={{ fontWeight: 900, fontSize: "12px" }}>{initialState.schemediscount}</span>
                                        </div> 

                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", borderBottom: "1px solid black", lineHeight: "1.2" }}>
                                            <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                                            <span style={{ fontWeight: 900, fontSize: "12px" }}>{initialState.afterschemedistotal}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", lineHeight: "1.2" }}>
                                            <span style={{ fontWeight: "bold" }}>Final Discount:</span>
                                            <span style={{ fontWeight: 900, fontSize: "12px" }}>{initialState.totalDiscount}</span>                                
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px", borderBottom: "1px solid black", lineHeight: "1.2" }}>
                                            <span style={{ fontWeight: "bold" }}>Total Advance:</span>
                                            <span style={{ fontWeight: 900, fontSize: "12px" }}>{AdvanceTotal}</span>                                
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", borderBottom: "1px solid black", lineHeight: "1.2" }}>
                                            <span style={{ fontWeight: "bold" }}>{RemainingCredit > 0 ? "Refund Amount" : "Net Amount"}:</span>
                                        <span style={{ fontWeight: 900, fontSize: "12px" }}>
                                          { RemainingCredit > 0 ? Math.abs(RemainingCredit).toFixed(2) :(
                                            initialState.afterschemedistotal -
                                            (parseFloat(initialState.totalDiscount || 0) +
                                            parseFloat(AdvanceTotal || 0))
                                          ).toFixed(2)}
                                        </span>
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
                <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
                    Print
                </button>
                <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrintClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

  const ForPrintConsolidatedBill = () => {
    const hasCard = billAmount.some((p) => p.Billpay_method === 'Card');
    const hasCheque = billAmount.some((p) => p.Billpay_method === 'Cheque');
    const hasBank = billAmount.some((p) => p.Billpay_method === 'Bank');
  
    // Group items by ServiceType
    const groupedByService = SelectDatalist.reduce((acc, row) => {
      if (!acc[row.ServiceType]) {
        acc[row.ServiceType] = [];
      }
      acc[row.ServiceType].push(row);
      return acc;
    }, {});
  
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
                      <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        <span>
                          {[ClinicDetails?.ClinicAddress].filter((detail) => detail).join(", ")},
                          {[ClinicDetails?.ClinicCity, ClinicDetails?.ClinicState, ClinicDetails?.ClinicCode].filter((detail) => detail).join(", ")}
                        </span>
                      </div>
                      <div>
                        {[ClinicDetails?.ClinicMobileNo, ClinicDetails?.ClinicLandLineNo, ClinicDetails?.ClinicMailID].filter((detail) => detail).join(" , ")}
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
                  Consolidated Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_addn_p037">
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Patient Name <span>:</span></label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Patient ID <span>:</span></label>
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Age / Gender <span>:</span></label>
                        <h4>{IP_BillingData.AgeGender}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>D.O.A <span>:</span></label>
                        <h4>{IP_BillingData.AdmittionDate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Address <span>:</span></label>
                        <h4>{IP_BillingData.Address}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Payer Type <span>:</span></label>
                        <h4>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Consultant <span>:</span></label>
                        <h4>{IP_BillingData.Doctor_ShortName}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>Mobile No <span>:</span></label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>IP NO <span>:</span></label>
                        <h4>{SelectedPatient_list.RegisterId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Ward - Bed No <span>:</span></label>
                        <h4>{SelectedPatient_list.WardBedNo}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Invoice No<span>:</span></label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Receipt No<span>:</span></label>
                        <h4>{RecieptInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Invoice Date<span>:</span></label>
                        <h4>{PostInvoicedate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>Discharge Date <span>:</span></label>
                        <h4>{SelectedPatient_list.DischargeDate}</h4>
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
                  <div style={{ width: "100%", border: "none", fontFamily: "monospace" }}>
                    <div
                      style={{
                        borderTop: "1.5px solid black",
                        borderBottom: "1.5px solid black",
                        padding: "5px 0",
                      }}
                    >
                      {Object.keys(groupedByService).map((serviceType, index) => {
                        const serviceRows = groupedByService[serviceType];
                        const subtotal = serviceRows.reduce(
                          (sum, row) => sum + parseFloat(row.NetAmount),
                          0
                        );
                        return (
                          <React.Fragment key={index}>
                            <div
                              style={{
                                fontWeight: "bold",
                                textAlign: "left",
                                padding: "10px 0",
                                borderTop: index > 0 ? "1px solid grey" : "none",
                              }}
                            >
                              {serviceType}
                            </div>
                            {serviceRows.map((row, rowIndex) => (
                              <div
                                key={rowIndex}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "100px 250px 80px",
                                  padding: "2px 0 2px 20px",
                                }}
                              >
                                <span>{row.Date}</span>
                                <span>{row.SelectItemName}</span>
                                <span style={{ textAlign: "right" }}>{row.NetAmount}</span>
                              </div>
                            ))}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "100px 250px 80px",
                                padding: "5px 0",
                                borderTop: "1px solid grey",
                                fontWeight: "bold",
                              }}
                            >
                              <span></span>
                              <span style={{ textAlign: "right" }}>Sub Total:</span>
                              <span style={{ textAlign: "right" }}>{subtotal.toFixed(2)}</span>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
  
            <tr>
              <td colSpan={7}>
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        {billAmount.length > 0 && (
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
                                  {hasCard && (
                                    <td>
                                      {row.Billpay_method === 'Card' && row.transactionFee
                                        ? `${parseInt(row.transactionFee)}%`
                                        : '-'}
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
  
                      {AdvanceAmountGet.length > 0 && (
                        <table className="print-table33">
                          <thead>
                            <tr>
                              <th colSpan={4} style={{ textAlign: 'center' }}>
                                Advance Amount
                              </th>
                            </tr>
                            <tr style={{ textAlign: 'center' }}>
                              <th>S.No</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {AdvanceAmountGet.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Date || '-'}</td>
                                <td>{row.Time || '-'}</td>
                                <td>{row.AdvanceAmount || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
  
                      <div className="bill_body_new_phar">
                        <label>Amount In Words <span>:</span></label>
                        <span>{NumberToWords(+initialState.totalNetAmount)}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>Billed By <span>:</span></label>
                        <span>{UserData?.Employeename}</span>
                      </div>
                    </div>
  
                    <div style={{ width: "40%", justifyContent: "flex-end" }}>
                      <div className="bill_body_new_phar">
                        <label>Total Amount <span>:</span></label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>Gross Amount <span>:</span></label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>Discount Amount<span>:</span></label>
                        <span>{initialState.totalDiscount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>Net Amount <span>:</span></label>
                        <span>{initialState.totalNetAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          {Math.abs(IP_BillingData.ReceivableAmount) > 0 && Paytype.isCash === "Yes"
                            ? "Paid Amount"
                            : "Refund Amount"}<span>:</span>
                        </label>
                        <span>{initialState.totalAmountt}</span>
                      </div>
                      <br />
                      <div>
                        <table style={{ border: 'none', borderCollapse: 'collapse' }}>
                          <tbody>
                            <tr style={{ borderTop: '1px solid black' }}>
                              <td style={{ borderTop: '1px solid black' }}>Total Advance</td>
                              <td style={{ borderTop: '1px solid black' }}>{AdvanceTotal}</td>
                            </tr>
                            <tr>
                              <td>Total Bill</td>
                              <td>{initialState.totalNetAmount}</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                              <td style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                                {Math.abs(IP_BillingData.ReceivableAmount) > 0 && Paytype.isCash === "Yes"
                                  ? "Paid Amount"
                                  : "Refund Amount"}
                              </td>
                              <td style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                                {initialState.PaidAmount}
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

    const [OTItem,setOTItem] = useState([]);
  console.log(OTItem,'OTItem')
  useEffect(() => {
   
      axios
        .get(
          `${UrlLink}OT/OTItem_List_For_IP?QueueList_ID=${IP_BillingData.Registration_Id}`
        )
        .then((res) => {
          const ress = res.data;
          setOTItem(ress);
        })
        .catch((error) => {
          console.log(error);
        });
   
  }, [UrlLink, IP_BillingData.Registration_Id]);

  const Addotitem = (params) => {
  console.log(params, 'paramsssssssss');
 
  const listdata = {
    ServiceType: params.category,
    SelectItemName: params.service_subcategory,
    Quantity: parseFloat(params.Units) || 0,
    Charges: parseFloat(params.rate) || 0,
    Amount: parseFloat(params.rate) || 0,
    NetAmount: parseFloat(params.rate) * parseFloat(params.Units) || 0,
    isReimbursable: params.isReimbursable,
    Date: params.Date,
  };
 
  const addeditem = OTItem.find(
    (i) => i.service_subcategory === params.service_subcategory
  );
 
  if (addeditem) {
    const updatedItems = OTItem.filter(
      (i) => i.service_subcategory !== params.service_subcategory
    );
    setOTItem(updatedItems);
  }
 
 
  setSelectDatalist((prev) => [
    ...prev,
    { S_No: prev.length + 1, ...listdata },
  ]);
};

const OTItemColumns = [
          // { key: "sno", name: "S.No", frozen: true },
          { key: "Date", name: "Date" },
          // { key:'isReimbursable',name:"isReimbursable"},
          { key: "category", name: "category", frozen: true },
          { key: "service_subcategory", name: "service_subcategory" },
          {
            key: "rate",
            name: "rate",
            renderCell: (params) => (
              <input
                type="number"
                className="test-amount-input"
                value={params.row.rate || ''}
                placeholder="Enter Amount"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  padding: '6px 12px',
                  outline: 'none'
                }}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value) || 0;
                  setOTItem((prev) =>
                    prev.map((item) =>
                      item.service_subcategory === params.row.service_subcategory
                        ? { ...item, rate: newValue }
                        : item
                    )
                  );
                }}
              />
            ),
          },
          { key: "Action", name: "Action",renderCell: (params) => (
            <button
                                  className="delnamebtn"
                                  style={{
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    padding: '6px 12px',
                                    outline: 'none',
                                    width:'100px',
                                    backgroundColor:'gray'
                                  }}
                                  onClick={() => Addotitem(params.row)}
                                >
                                  Add
                                </button>
          ), },
         
                 
      ];

  return (
    <>
      {isPrintButtonVisible ? (
        <>
          <div className="Main_container_app">
            <h3>IP Estimated Billing</h3>

            <div 
  className="csdcedw_kl88" 
  style={{
    padding: '20px',
    maxWidth: '100%',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  }}
>
  <div 
    className="RegisBillSearchForm_1 RegisBillSearchForm_1_mmmm"
    style={{
      marginBottom: '25px',
      display: 'flex',
      flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
      alignItems: window.innerWidth <= 768 ? 'stretch' : 'center',
      gap: '15px'
    }}
  >
    <label
      style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        minWidth: '120px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      Search <span style={{ color: '#e74c3c', marginLeft: '2px' }}>:</span>
    </label>
    
    <div 
      className="Search_patient_icons"
      style={{
        flex: '1',
        position: 'relative',
        minWidth: '250px'
      }}
    >
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
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '16px',
          border: `2px solid ${
            errors["Search"] === "Invalid" 
              ? '#e74c3c' 
              : errors["Search"] === "Valid" 
                ? '#27ae60' 
                : '#ddd'
          }`,
          borderRadius: '6px',
          outline: 'none',
          transition: 'all 0.3s ease',
          backgroundColor: Object.values(IP_BillingData).length !== 0 ? '#f8f9fa' : '#fff',
          cursor: Object.values(IP_BillingData).length !== 0 ? 'not-allowed' : 'text',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        value={patientsearch.Search}
        onChange={HandleSearchchange}
        disabled={Object.values(IP_BillingData).length !== 0}
        onFocus={(e) => {
          if (!e.target.disabled) {
            e.target.style.borderColor = '#3498db';
            e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = errors["Search"] === "Invalid" 
            ? '#e74c3c' 
            : errors["Search"] === "Valid" 
              ? '#27ae60' 
              : '#ddd';
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
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

  {/* <div 
    className="ewdwdwd_u7j" 
    ref={gridRef}
    style={{
      display: 'flex',
      flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
      alignItems: window.innerWidth <= 768 ? 'stretch' : 'center',
      gap: '15px'
    }}
  >
    <div 
      className="RegisBillSmart_2"
      style={{
        display: 'flex',
        flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
        alignItems: window.innerWidth <= 480 ? 'stretch' : 'center',
        gap: '15px',
        flex: '1'
      }}
    >
      <label
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          minWidth: '160px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        Smart Card No <span style={{ color: '#e74c3c', marginLeft: '2px' }}>:</span>
      </label>
      
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flex: '1'
        }}
      >
        <input
          type="text"
          value={SmartCard.SmartCardNo}
          id="SmartCardNo"
          readOnly
          style={{
            flex: '1',
            padding: '12px 16px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '6px',
            backgroundColor: '#f8f9fa',
            color: '#666',
            cursor: 'not-allowed',
            minWidth: '200px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        
        <button
          style={{
            backgroundColor: '#646653',
            padding: '12px 20px',
            minHeight: '48px',
            color: 'white',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            minWidth: '70px'
          }}
          onClick={HandleSmartCard}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#5a5d4a';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#646653';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(1px)';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'translateY(-1px)';
          }}
        >
          Go
        </button>
      </div>
    </div>
  </div> */}
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
                    className="VPKRegisBillForm_1 RegisBillForm_1_M"
                    key={index}
                    style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
                  >
                    <label 
                      htmlFor={`${field}_${index}`}
                      style={{ 
                        minWidth: "150px", 
                        marginRight: "10px",
                        fontWeight: "bold"
                      }}
                    >
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
                        style={{ 
                          width: "200px", // Increased width from 100px
                          padding: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          fontSize: "14px"
                        }}
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
                        value={RegisterData[field] || ""} // Added fallback for undefined values
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
                          value={RegisterData[field] || ""}
                          style={{
                            width: "200px",
                            height: "60px",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "14px"
                          }}
                          onChange={HandleOnchange}
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
          p !== "Total" &&
          p !== "final_rate" &&
          p !== "DiscountType" &&
          p !== "Discount" &&
          p !== "Discountamt" &&
          p !== "Discountmethod" &&
          p !== "Discountval" &&
          p !== "ISWardConsession" &&
          p !== "ISWardPercentage" 

      )
      .map((field, indx) => (
        <div className="vpkRegisForm_1" key={indx}>
          <label htmlFor={`${field}_${indx}`}>
            {formatLabel(field)}
            <span>:</span>
          </label>

          <input
            ref={field === "ServiceSubCategory" ? serviceSubCategoryRef : null}
            type={
              field === "ServiceDate"
                ? "date"
                : ["Rate", "Quantity"].includes(field)
                ? "number"
                : "text"
            }
            name={field}
            value={ServiceProcedure[field]}
            list={
              ["ServiceCategory", "ServiceSubCategory"].includes(field)
                ? `${field}_ServiceCategory`
                : undefined
            }
            onChange={HandleOnchangeService}
            autoComplete="off"
          />

          <datalist id={`${field}_ServiceCategory`}>
            {field === "ServiceCategory" &&
              ServiceCategoryData?.map((row, indx) => (
                <option
                  key={indx}
                  value={`${row.service_category_id}|${row.service_name}`}
                >
                  {row.service_name}
                </option>
              ))}
            {field === "ServiceSubCategory" &&
              Array.isArray(ServiceSubCategoryData) &&
              ServiceSubCategoryData.map((row, indx) => (
                <option
                  key={indx}
                  value={`${row.pk}|${row.service_subcategory}`}
                >
                  {row.service_subcategory}
                </option>
              ))}
          </datalist>
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


            <h3>OT Procedures</h3>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>Type<span>:</span></label>
                <select name="Type" value={OTDetails.Type} onChange={handleOTChange}>
                  <option value="">Select</option>
                  <option value="ROOM">ROOM</option>
                  <option value="WARD">WARD</option>
                </select>
              </div>
 
              <div className="vpkRegisForm_1">
                <label>Procedure Name<span>:</span></label>
                <input
                  type="text"
                  name="Procedurename"
                  value={OTDetails.Procedurename || ""}
                  onChange={handleOTChange}
                  autoComplete="off"
                  list="procedureOptions"
                />
                <datalist id="procedureOptions">
                  {OTProceduredatas.map((item) => (
                    <option
                      key={item.id}
                      value={`${item.id} | ${item.ProcedureName}`}
                    >
                      {item.id} | {item.ProcedureName}
                    </option>
                  ))}
                </datalist>
              </div>
 
              <div className="vpkRegisForm_1">
                <label>Fee Name<span>:</span></label>
                <input
                  type="text"
                  name="FeeType"
                  value={OTDetails.FeeType || ""}
                  onChange={handleOTChange}
                  autoComplete="off"
                  list="procedurefeeOptions"
                />
                <datalist id="procedurefeeOptions">
                  {OTFeedatas.map((item) => (
                    <option
                      key={item.sno}
                      value={`${item.sno} | ${item.service_subcategory}`}
                    >
                      {item.service_subcategory} (Rate: {item.rate})
                    </option>
                  ))}
                </datalist>
              </div>
 
              <div className="vpkRegisForm_1">
                <label>Rate<span>:</span></label>
                <input
                  type="text"
                  name="Rate"
                  value={OTDetails.Rate || ""}
                  onChange={handleOTChange}
                  autoComplete="off"
                />
              </div>
 
              <div className="Register_btn_con added_Register_btn_con">
                <button
                  className="RegisterForm_1_btns added_RegisterForm_1_btns"
                  onClick={Addotitemforbill}
                >
                  Add
                </button>
              </div>
            </div>
 

           
 

            {OTItem.length > 0 && (
                <ReactGrid columns={OTItemColumns} RowData={OTItem} />
            )}

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
                  {/* <tbody>
                    {SelectDatalist.map((row, index) => {
  const hasVoucher = row.VoucherNo && row.VoucherNo.trim() !== "";

  return (
    <tr
      key={index}
      style={
        hasVoucher
          ? { backgroundColor: "yellow", color: "black", fontWeight: "bold" }
          : {}
      }
    >
      <td>{row.S_No}</td>
      <td>
        <input
          type="checkbox"
          checked={row.isReimbursable === "Yes"}
          onChange={(e) => handleReimbursableChange(e, index)}
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

                  </tbody> */}

                  <tbody>
  {(() => {
    // Group rows by Date for rows without VoucherNo
    const groupedData = SelectDatalist.reduce((acc, row) => {
      const hasVoucher = row.VoucherNo && row.VoucherNo.trim() !== "";
      if (hasVoucher) {
        // Rows with VoucherNo are not grouped, added as-is
        acc.push({ type: "row", data: row });
      } else {
        // Group rows without VoucherNo by Date
        const dateKey = row.Date || "No Date";
        if (!acc.some((item) => item.type === "date" && item.date === dateKey)) {
          acc.push({ type: "date", date: dateKey });
        }
        acc.push({ type: "row", data: row });
      }
      return acc;
    }, []);

    // Render grouped data
    return groupedData.map((item, index) => {
      if (item.type === "date") {
        // Render a separator or header for the date
        return (
          <tr key={`date-${index}`} style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
            <td colSpan="13">{item.date}</td>
          </tr>
        );
      }

      const row = item.data;
      const hasVoucher = row.VoucherNo && row.VoucherNo.trim() !== "";

      return (
        <tr
          key={index}
          style={
            hasVoucher
              ? { backgroundColor: "yellow", color: "black", fontWeight: "bold" }
              : {}
          }
        >
          <td>{row.S_No}</td>
          <td>
            <input
              type="checkbox"
              checked={row.isReimbursable === "Yes"}
              onChange={(e) => handleReimbursableChange(e, index)}
            />
          </td>
          <td>{row.VoucherNo || "-"}</td>
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
    });
  })()}
</tbody>
                </table>
              </div>

              <br />
              <br />
<div className="Selected-table-container444 DEWSDXWED">
        <h3>Pharmacy Billing Details</h3>
        <table className="selected-medicine-table222 EDWEDE">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Billing Date</th>
              <th>Billing Type</th>
              <th>Net Amount</th>
            </tr>
          </thead>
          <tbody>
            {Pharmadetails.length > 0 ? (
              Pharmadetails.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.Billing_Date || "-"}</td>
                  <td>{item.Billing_Type || "-"}</td>
                  <td>₹{item.Net_Amount || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  No due bills found
                </td>
              </tr>
            )}
            {/* Grand Total Row */}
            <tr>
              <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                Grand Total
              </td>
              <td style={{ fontWeight: "bold" }}>₹{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Refund Details Table */}
      <div className="Selected-table-container444 DEWSDXWED" style={{ marginTop: "20px" }}>
        <h3>Refund Details</h3>
        <table className="selected-medicine-table222 EDWEDE">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Billing Date</th>
              <th>Voucher Number</th>
              <th>Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            {Pharmarefunddetails.length > 0 ? (
              Pharmarefunddetails.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.Billing_Date || "-"}</td>
                  <td>{item.Voucher_Number || "-"}</td>
                  <td>₹{item.PaidAmount || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  No refund details found
                </td>
              </tr>
            )}
            {/* Total Refunded Row */}
            <tr>
              <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                Total Refunded
              </td>
              <td style={{ fontWeight: "bold" }}>₹{grandrefundTotal}</td>
            </tr>
            {/* Net Due Row */}
            <tr>
              <td colSpan={3} style={{ textAlign: "right", fontWeight: "bold" }}>
                Net Due
              </td>
              <td style={{ fontWeight: "bold" }}>₹{grandTotal - grandrefundTotal}</td>
            </tr>
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
                  <button
                    style={{width: "60px", height: "30px"}}
                    className="RegisterForm_1_btns added_RegisterForm_1_btns"
                    onClick={() => handleSaveSubmit(false, false, true)} 
                    disabled={submitBut || isSubmitting} // Disable during submission AND after success
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <select
                    className="print_option_bill"
                    name="printoption"
                    value={printoption}
                    onChange={(e) => setprintoption(e.target.value)} // Update state with selected value
                  >
                    {[
                      "PrintDetailed",
                      "PrintConsolidated",
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
                      onClick={() => handlePrintSubmit(true,false,false,false,false)}
                    >
                      Print
                    </button>
                  ):  printoption === "PrintConsolidated" ? (
                      <button
                        className="RegisterForm_1_btns added_RegisterForm_1_btns"
                        onClick={() => handlePrintSubmit(false,false, false,false,true)} // Pass a second parameter for "PrintReimbuseable"
                      >
                        Print
                      </button>
                    ) : printoption === "PrintSummary" ? (
                    <button
                      className="RegisterForm_1_btns added_RegisterForm_1_btns"
                      onClick={() => handlePrintSubmit(false,true, false,false,false)}
                    >
                      Print
                    </button>
                  ) : printoption === "PrintReimbursable" ? (
                    <button
                      className="RegisterForm_1_btns added_RegisterForm_1_btns"
                      onClick={() => handlePrintSubmit(false,false, true,false,false)} // Pass a second parameter for "PrintReimbuseable"
                    >
                      Print
                    </button>
                  ) : (
                    <button
                      className="RegisterForm_1_btns added_RegisterForm_1_btns"
                      onClick={() => handlePrintSubmit(false,false, false,true,false)} // Pass a second parameter for "PrintReimbuseable"
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
      ) : printoption === "PrintReimbursable" ? (
        <ForPrintReimbData />
      ) : printoption === "PrintNon-Reimbursable" ? (
        <ForPrintNon_ReimbData />
      ) : printoption === "PrintDetailed" ? (
        <ForPrintDetailedBill />
      ) : printoption === "PrintConsolidated" ?  (
        <ForPrintConsolidatedBill />
      ) : (
        <ForPrintData />
      )}
    </>
  );
};

export default IPEstimatedBilling;


