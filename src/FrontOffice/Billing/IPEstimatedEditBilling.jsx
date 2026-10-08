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



const IPEstimatedEditBilling = () => {
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

  const [Pharmadetails, setPharmadetails] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
       const [Pharmarefunddetails,setPharmarefunddetails] = useState([]);
       const [grandrefundTotal, setGrandrefundTotal] = useState(0);
    
  
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

  console.log(SelectedPatient_list,'SelectedPatient_list')

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
  const [NewSelectDatalist, setNewSelectDatalist] = useState([]);
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
    // ServiceDate:Formdate,
    ServiceCategory: '',
    Categoryid: '',
    ServiceSubCategory: '',
    ServiceSubCatId: '',
    Subcategorypk: '',
    Rate: '',
    Quantity: 1,
    Total: '',
    type: '',
    CGHScode : "",
    ISWardConsession : "",
    ISWardPercentage : "",
  });



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
      //  additionalDiscount
      // );

      // // Adjust net amount after applying discount
      // let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;

      // // Corrected GST calculation based on the updated taxable amount
      // // let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;

      // let SchemeDiscount = updatedTotals.totalDiscount;
      // let aftersdis = (parseFloat(updatedTotals.totalAmount || 0) - SchemeDiscount).toFixed(2)
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
      //   schemediscount : SchemeDiscount,
      //   afterschemedistotal: aftersdis || 0,
      // }));
      // // Update previous totals reference
      // prevTotalsRef.current = { ...updatedTotals };
    
    
    
    
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

      console.log(updatedTotals,'updatedTotalssss')

      // Ensure the discount does not exceed the total amount
      let finalDiscount = Math.min(updatedTotals.totalNetAmount,additionalDiscount);
      let ItemGrandTotal = updatedTotals.totalAmount;
      // Adjust net amount after applying discount
      let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;

      // Corrected GST calculation based on the updated taxable amount
      // let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;

      // Correct total net amount after discount and GST

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
        totalTaxableAmount = totalTaxableAmount + Pharmacyfinalamt;

   
      let SchemeDiscount = updatedTotals.totalDiscount;
      let aftersdis = (parseFloat(Itempharmacygrandtotal|| 0) - SchemeDiscount).toFixed(2)

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


      console.log('General calculationnnnnnnnnnnnnn')

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

      console.log(updatedTotals,'updatedTotalssss')

      // Ensure the discount does not exceed the total amount
      let finalDiscount = Math.min(updatedTotals.totalNetAmount,additionalDiscount);

      let ItemGrandTotal = updatedTotals.totalAmount;

      console.log(ItemGrandTotal,'ItemGrandTotal')

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


            totalTaxableAmount = totalTaxableAmount + Pharmacyfinalamt;


      console.log(totalTaxableAmount,'totalTaxableAmount')
      // Corrected GST calculation based on the updated taxable amount
      // let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;

      // Correct total net amount after discount and GST
   
      let SchemeDiscount = updatedTotals.totalDiscount;
      let aftersdis = (parseFloat(Itempharmacygrandtotal|| 0) - SchemeDiscount).toFixed(2)

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

  const handlesubmitclient = (e) => {
    
  }
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
    } else if (name === "ServiceSubCategory") {
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
    } else {
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
      RegisterId: IP_BillingData.Registration_Id,
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
  //         parseFloat(final_rate) || "",
  //       isReimbursable: "No",
  //       Date: Formdate,
  //       ...ServiceProcedure,
  //       Discount : Discountamt
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
  // Delete billing item

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
  if (IP_BillingData.id && IP_BillingData.Type === 'IPEstimated' && Object.keys(IP_BillingData).length !== 0) {
    // Update state from IP_BillingData
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
      DoctorName: IP_BillingData.Doctor_Name || '',
      DoctorId: IP_BillingData.Doctor_Id || '',
    }));

    setRegisterData((prev) => ({
      ...prev,
      ABHA: '64-9456-6541-8451',
      PatientName: IP_BillingData.Patient_Name || '',
      AgeGender: IP_BillingData.AgeGender || '',
      PhoneNo: IP_BillingData.PhoneNo || '',
      PatientCategory: IP_BillingData.PatientCategory || '',
      PatientCategoryName: IP_BillingData.PatientCategoryName || '',
      Address: IP_BillingData.Address || '',
      PatientId: IP_BillingData.PatientId || '',
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

    setRemainingCredit(IP_BillingData.RefundedAmount || 0);
    setNetAmount_CDmethod({
      Method: IP_BillingData.DiscountType || '',
      Amount: IP_BillingData.DiscountValue || 0,
    });

    // Map Estimated_Items
    const Itemlist = IP_BillingData.Estimated_Items || [];
    let mappedItemlist = Itemlist.map((service, index) => ({
      S_No: index + 1, // Temporary S_No
      ServiceType: service.Service_Type,
      SelectItemName: service.Service_Name,
      Charges: parseFloat(service.Charge || 0),
      Amount: parseFloat(service.Amount || 0),
      DiscountType:service.Discount_Type || '',
      Discountmethod: service.DiscountType || '',
      Discount: service.Discount_Amount || '',
      Discountval : service.Discount_Value || 0,
      Discount : service.Discount_Amount || 0,
      GST_per: parseFloat(service.Tax_Percentage || 0),
      GST: parseFloat(service.Tax_Amount || 0),
      NetAmount: parseFloat(service.Total_Amount || 0),
      Quantity: parseFloat(service.Quantity || 1),
      isReimbursable: service.IsReimbursable || 'No',
      VoucherNo: service.VoucherNo || '',
      Date: service.Date || new Date().toISOString().split('T')[0],
      CGHScode : service.CGHScode
    }));

    console.log(Itemlist,'Itemlisttttt')

    // Fetch API data
    axios
      .get(`${UrlLink}Frontoffice/IP_Billing_Service_List_after_estimated`, {
        params: {
          QueueList_ID: IP_BillingData?.Registration_Id,
        },
      })
      .then((res) => {
        let GetIPBillingdata = res.data.Billing_data || {};
        let GetIPBillingdataService = res.data.services || [];
        let GetLab = res.data.Lab_list || [];
        let GetRad = res.data.Rad_list || [];
        let GetInterim = res.data.InterimList || [];

        if (Object.values(GetIPBillingdata).length > 0) {
          // Map API-fetched service data
          let mappedServiceData = GetIPBillingdataService.map((service, index) => ({
            S_No: index + 1, // Temporary S_No
            ServiceType: service.category,
            VoucherNo: service.VoucherNo || '',
            SelectItemName: service.service_subcategory,
            Charges: parseFloat(service.rate || 0),
            Amount: parseFloat(service.rate || 0),
            DiscountType: '',
            Discount: '',
            GST_per: parseFloat(service.GST_per || 0),
            GST: parseFloat(service.GST_Charge || 0),
            NetAmount: parseFloat(service.rate || 0),
            Quantity: parseFloat(service.Units || 1),
            isReimbursable: service.isReimbursable || 'No',
            Date: service.Date || new Date().toISOString().split('T')[0],
          }));

          let serviceCount = mappedServiceData.length;

          let mappedLABData = GetLab.map((service, index) => ({
            S_No: serviceCount + index + 1,
            VoucherNo: service.VoucherNo || '',
            ServiceType: service.category,
            SelectItemName: service.service_subcategory,
            servicecode: service.servicecode,
            Charges: parseFloat(service.rate || 0),
            Amount: parseFloat(service.rate || 0),
            DiscountType : service.DiscountType || 0,
            Discountmethod: service.Discountmethod || '',
            Discountval : service.Discountval || 0,  
            Discount: service.Discountamt || '',
            GST_per: parseFloat(service.GST_per || 0),
            GST: parseFloat(service.GST_Charge || 0),
            NetAmount: parseFloat(service.Finalrate || 0),
            Quantity: parseFloat(service.Units || 1),
            isReimbursable: service.isReimbursable || 'No',
            Date: service.Date || new Date().toISOString().split('T')[0],
            Requestid: service.Requestid,
            Discountmethod: service.Discountmethod || '',
            Discountval: parseFloat(service.Discountval || 0),
                                                CGHScode: service.CGHScode

          }));

          let mappedRadata = GetRad.map((service, index) => ({
            S_No: serviceCount + index + 1,
            VoucherNo: service.VoucherNo || '',
            ServiceType: service.category,
            SelectItemName: service.service_subcategory,
            servicecode: service.servicecode,
            Charges: parseFloat(service.rate || 0),
            Amount: parseFloat(service.rate || 0),
            DiscountType : service.DiscountType || 0,
            Discountmethod: service.Discountmethod || '',
            Discountval : service.Discountval || 0,  
            Discount: service.Discountamt || '',
            GST_per: parseFloat(service.GST_per || 0),
            GST: parseFloat(service.GST_Charge || 0),
            NetAmount: parseFloat(service.Finalrate || 0),
            Quantity: parseFloat(service.Units || 1),
            isReimbursable: service.isReimbursable || 'No',
            Date: service.Date || new Date().toISOString().split('T')[0],
            Requestid: service.Requestid,
            Discountmethod: service.Discountmethod || '',
            Discountval: parseFloat(service.Discountval || 0),
                                                CGHScode: service.CGHScode

          }));

          let mappedInterimData = GetInterim.map((service, index) => ({
            S_No: serviceCount + index + 1,
            VoucherNo: service.VoucherNo || '',
            ServiceType: service.category,
            SelectItemName: service.service_subcategory,
            Charges: parseFloat(service.rate || 0),
            Amount: parseFloat(service.rate || 0),
            DiscountType: '',
            Discount: '',
            GST_per: 0.0,
            GST: 0.0,
            NetAmount: parseFloat(service.rate || 0),
            Quantity: parseFloat(service.Units || 1),
            isReimbursable: service.isReimbursable || 'No',
            Date: service.Date || new Date().toISOString().split('T')[0],
                                                CGHScode: service.CGHScode

          }));

          // Add Adddata if valid
          let Adddata = {
            ServiceType: GetIPBillingdata.category || '',
            SelectItemName: GetIPBillingdata.service_subcategory || '',
            Charges: parseFloat(GetIPBillingdata.Service_Fee || 0),
            Amount: parseFloat(GetIPBillingdata.Service_Fee || 0),
            DiscountType: '',
            Discount: '',
            GST_per: '',
            GST: '',
            NetAmount: parseFloat(GetIPBillingdata.Service_Fee || 0),
            Quantity: 1,
            isReimbursable: 'No',
            VoucherNo: GetIPBillingdata.VoucherNo || '',
            Date: GetIPBillingdata.Date || new Date().toISOString().split('T')[0],
          };

          // Combine all data, prioritizing API data (services, lab, radiology, interim) over Estimated_Items
          let combinedData = [];
          if (Adddata.SelectItemName && Adddata.ServiceType && Adddata.Charges) {
            combinedData.push(Adddata);
          }
          combinedData = [
            ...combinedData,
            ...mappedServiceData,
            ...mappedLABData,
            ...mappedRadata,
            ...mappedInterimData,
          ];

          // Deduplicate items with VoucherNo based on VoucherNo and SelectItemName
          const seenKeys = new Set();
          const deduplicatedApiData = combinedData.filter((item) => {
            if (!item.VoucherNo) {
              // Items without VoucherNo are considered unique and included
              return true;
            }
            const key = `${item.VoucherNo}-${item.SelectItemName}`;
            if (seenKeys.has(key)) {
              console.warn(`Duplicate API item found for VoucherNo: ${item.VoucherNo}, SelectItemName: ${item.SelectItemName}`);
              return false;
            }
            seenKeys.add(key);
            return true;
          });

          // Add Estimated_Items, but only include items whose VoucherNo and SelectItemName haven't been seen
          const finalData = [
            ...deduplicatedApiData,
            ...mappedItemlist.filter((item) => {
              if (!item.VoucherNo) {
                // Include Estimated_Items without VoucherNo
                return true;
              }
              const key = `${item.VoucherNo}-${item.SelectItemName}`;
              if (seenKeys.has(key)) {
                console.warn(`Skipping Estimated_Items duplicate for VoucherNo: ${item.VoucherNo}, SelectItemName: ${item.SelectItemName}`);
                return false;
              }
              seenKeys.add(key);
              return true;
            }),
          ];

          // Reassign S_No for sequential numbering
          const numberedData = finalData.map((item, index) => ({
            ...item,
            S_No: index + 1,
          }));

          // Set combined, deduplicated data to NewSelectDatalist
          setSelectDatalist(numberedData);
          console.log('NewSelectDatalist', numberedData); // For debugging
        }
      })
      .catch((err) => {
        console.error('API Error:', err);
      });
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
        ? IP_BillingData?.Type === "IPEstimated"
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
        .post(`${UrlLink}Frontoffice/IPBillingEstimatedEditLink`, senddata)
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


  // Create a ref to hold the abort controller
const abortControllerRef = useRef(null);

const handleSaveSubmit = () => {
  // Cancel any ongoing request if it exists
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  // Create a new AbortController for this request
  abortControllerRef.current = new AbortController();
  const signal = abortControllerRef.current.signal;

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
      ? IP_BillingData?.Type === "IPEstimated"
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
    Deleteditem: Deleteditem
  };

  console.log("senddata", senddata);
  
  if (Object.keys(IP_BillingData).length !== 0) {
    axios
      .post(`${UrlLink}Frontoffice/IPBillingEstimatedEditLink`, senddata, { signal })
      .then((res) => {
        // Clear the abort controller on successful completion
        abortControllerRef.current = null;
        
        console.log(res.data);
        setPostInvoice(res.data.InvoiceNo);
        setRecieptInvoice(res.data.ReceiptNo);
        setPostInvoiceDate(res.data.InvoiceDate);
        
        if (res?.data?.status === 'success') {
          const messageType = res.data.status;
          const messageContent = res.data.message;  

          console.log(messageType,'messageType',messageContent);

          dispatchvalue({
            type: 'toast',
            value: { message: messageContent, type: messageType },
          });
          // navigate("/Home/CashierFolder");
          // dispatchvalue({ type: "HrFolder", value: "IPBillingEstimatedList" });
          // dispatchvalue({ type: "setPreviousFolder", value: null });
          // dispatchvalue({ type: "showMenu", value: true })
        }
      })
      .catch((err) => {
        // Clear the abort controller on error (unless it's an abort error)
        abortControllerRef.current = null;
        
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
          // Optional: Show cancellation message to user
          // dispatchvalue({
          //   type: 'toast',
          //   value: { message: "Request was cancelled", type: "info" }
          // });
        } else {
          console.log(err);
          // Handle other errors
          dispatchvalue({
            type: 'toast',
            value: { message: "An error occurred while saving", type: "error" }
          });
        }
      });
  }
};

// Cleanup effect for component unmount
useEffect(() => {
  return () => {
    // Cancel any ongoing request when component unmounts
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, []);

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
    // navigate("/Home/CashierFolder");
    // dispatchvalue({ type: "HrFolder", value: "IPBillingEstimatedList" });
    // dispatchvalue({ type: "setPreviousFolder", value: null });
    // dispatchvalue({ type: "showMenu", value: true });
  }

  

  const ForPrintSumData = () => {}


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
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{IP_BillingData.Registration_Id}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                                            <label>Ward - Bed No <span>:</span></label>
                                            <h4 style={{ margin: "0", fontSize: "12px" }}>{IP_BillingData.ward}</h4>
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

  const ForPrintReimbData = () => { }

  const ForPrintNon_ReimbData = () => {}

const [OTDetails,setOTDetails] = useState({
 
      Type : '',
      Procedurename : '',
      Procedureid : '',
      FeeType : '',
      Rate : ''
    
    })

    
    const [OTFeedatas,setOTFeedatas] = useState([]);

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
  } else if (name === "FeeType") {
    const value1 = value.split("|");
    const value2 = value1[0]?.trim() || ""; // Trimmed ID
    const value3 = value1.length > 1 ? value1[1].trim() : "";
 
    console.log(value2, 'selectedFeeeeeeee vallllll');
   
    // Fix: Look for matching fee based on the procedure and fee type
    const selectedFee = OTFeedatas.find((item) => {
      // Check if the fee belongs to the selected procedure and matches the selected fee type
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
 
  
  //     const Addotitemforbill = () => {
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
  //     Discountmethod : selectedFee.discount_method
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

  return (
    <>
      {isPrintButtonVisible ? (
        <>
          <div className="Main_container_app">
            <h3>IP Estimated Billing</h3>

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
                       p !== "Total" &&
                      p !== "final_rate" &&
                      p !== "DiscountType" &&
                      p !== "Discount" &&
                      p !== "Discountamt" &&
                      p !== "Discountmethod" &&
                       p !== "ISWardConsession" &&
                        p !== "ISWardPercentage" &&
                      p !== "Discountval"
                      
                  )
                  .map((field, indx) => (
                    <div className="vpkRegisForm_1" key={indx}>
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
                            ref={field === "ServiceSubCategory" ? serviceSubCategoryRef : null}
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
                    style={{ width: "60px", height: "30px" }}
                    className="RegisterForm_1_btns added_RegisterForm_1_btns"
                    onClick={() => handleSaveSubmit(false, false, true)} // Pass a second parameter for "PrintReimbuseable"
                  >
                    Save
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

export default IPEstimatedEditBilling;
