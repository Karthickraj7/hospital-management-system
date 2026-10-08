import React, { useState, useEffect,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bgImg2 from "../Assets/bgImg2.jpg";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from "react-to-print";
import { NumberToWords } from  "../OtherComponent/OtherFunctions";


const ClientMainpage = () => {

    const toast = useSelector((state) => state.userRecord?.toast);
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const componentRef = useRef();

    const ClientPatientDetailes = useSelector(state => state.Insurancedata?.ClientPatientDetailes)
    const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
    console.log("ClientPatientDetailes", ClientPatientDetailes)

    const [PatientDetails, setPatientDetails] = useState([]);

    const [ClientDetails, setClientDetails] = useState([]);
    const [billoption, setbilloption] = useState("PrintDetailed");

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
                  AgeGender : "",
                  AdmissionDate : "",
                  Date : "",
                  RegisterId : "",
                
            
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

      const [SelectDatalist, setSelectDatalist] = useState([]);

      const [Billingitems, setBillingitems] = useState([]);

      const HandlePrintReimbursable = (params) => {

        console.log(params,"HandlePrintSummary");
    
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
          axios.get(`${UrlLink}Frontoffice/IP_Billing_Items_Table_For_Insurance_Patient?Register_Id=${ClientPatientDetailes?.RegistrationId}`)
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
                AgeGender : ress[0]?.AgeGender,
                AdmissionDate : ress[0]?.AdmissionDate 
                ? new Date(ress[0]?.AdmissionDate).toLocaleDateString() 
                : "",
                Date : ress[0]?.Billing_Date,
                RegisterId : ress[0]?.Register_Id,
      
              });
      
              setPostInvoice(ress[0].id);
              setPostInvoiceDate(ress[0]?.Billing_Date);
              setSelectDatalist(ress[0].Billing_Items);
              setBillAmount(ress[0].Payment_Details);
              HandlePrintReimbursable(ress[0].Billing_Items);
      
            })
            .catch((err) => {
              console.log(err);
            })
        }, [ClientPatientDetailes?.RegistrationId]);
      
         useEffect(() => {
              axios
                .get(
                  `${UrlLink}Frontoffice/IP_AdvanceAmount_collection?RegistrationId=${ClientPatientDetailes?.RegistrationId}&Type=${'IP'}`
                )
                .then((ress) => {
                  const res = ress?.data;
                  console.log("advvvvv", res);
                  setAdvanceAmountGet(res?.AdvanceDetails);
                  setAdvanceTotal(res?.TotalAdvanceAmount);
                  setRemainingCredit(res?.RemainingCredit)
                })
                .catch((e) => console.log(e));
            }, [ClientPatientDetailes?.RegistrationId]);


    useEffect(() => {
        if (ClientPatientDetailes?.RegistrationId && ClientPatientDetailes?.PatientId && ClientPatientDetailes?.PatientServiesType) {
            axios.get(`${UrlLink}Insurance/Insurance_Patient_Details?RegistrationId=${ClientPatientDetailes.RegistrationId}&PatientId=${ClientPatientDetailes.PatientId}&PatientServiesType=${ClientPatientDetailes.PatientServiesType}`)
                .then((res) => {
                    if (Array.isArray(res?.data)) {
                        setPatientDetails(res.data);
                    }
                    else {
                        console.log("Unexpected response format: Expected an array", res.data);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching patient details:", err);
                })
        }

    }, [ClientPatientDetailes, UrlLink])





    useEffect(() => {
        if (ClientPatientDetailes?.ClientId) {
            axios.get(`${UrlLink}Insurance/Client_Details_get?ClientId=${ClientPatientDetailes?.ClientId}`)
                .then((res) => {

                    if (Array.isArray(res?.data)) {
                        console.log("res.dataclient", res.data)
                        setClientDetails(res.data); // Set data only if it is an array
                    } else {
                        console.log("Unexpected response format: Expected an array", res.data);
                    }

                })
                .catch((err) => {
                    console.error("Error fetching insurance details:", err);
                });
        }

    }, [ClientPatientDetailes, UrlLink])


    const [ClientMaindata, setClientMaindata] = useState({
        PreAuthDate: '',
        PreAuthAmount: '',
        DischargeDate: '',
        FinalBillAmount: '',
        RaisedAmount: '',
        ApprovedAmount: '',
        CourierDate: '',
        SettlementDateCount: '',
        TdsPercentage: 10,
        TdsAmount: '',
        FinalSettlementAmount: ''
    })

    const [AmountState, setAmountState] = useState({
        SettlementDate: '',
        SettlementAmount: '',
        UTRNumber: '',
    })
    const [AmountArray, setAmountArray] = useState([])

    const [CoPaymentCoverage, setCoPaymentCoverage] = useState("No");

    const [CoPaymentDetails, setCoPaymentDetails] = useState({
        CoPaymentType: '',
        CoPaymentTypeValue: '',
        CoPaymentBillAmount: '',
        CoPaymentFinalAmount: '',
    })

    // useEffect(() => {

    //     axios.get(`${UrlLink}Insurance/Post_Client_Patient_Detailes?GetId=${ClientPatientDetailes?.id}`)
    //         .then((res) => {
    //             console.log('8888800', res.data);

    //             let getdata = res.data

    //             if (getdata && Object.keys(getdata).length > 0) {

    //                 let { AmountArray, CoPaymentCoverage, CoPaymentType, CoPaymentTypeValue, CoPaymentBillAmount, CoPaymentFinalAmount, ...rest } = getdata;
    //                 setAmountArray(AmountArray || [])
    //                 setClientMaindata({ ...rest })
    //                 setCoPaymentCoverage(CoPaymentCoverage || 'No')
    //                 setCoPaymentDetails({
    //                     CoPaymentType: CoPaymentType || '',
    //                     CoPaymentTypeValue: CoPaymentTypeValue || '',
    //                     CoPaymentBillAmount: CoPaymentBillAmount || '',
    //                     CoPaymentFinalAmount: CoPaymentFinalAmount || ''
    //                 });

    //             }


    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })

    // }, [ClientPatientDetailes, UrlLink])

    useEffect(() => {
        const fetchClientPatientDetails = async () => {
            try {
                if (!ClientPatientDetailes?.id) return;

                const response = await axios.get(`${UrlLink}Insurance/Post_Client_Patient_Detailes?GetId=${ClientPatientDetailes.id}`);
                const data = response.data;
                console.log('Fetched client patient details:', data);

                if (data && Object.keys(data).length > 0) {
                    const {
                        AmountArray = [],
                        CoPaymentCoverage = 'No',
                        CoPaymentType = '',
                        CoPaymentTypeValue = '',
                        CoPaymentBillAmount = '',
                        CoPaymentFinalAmount = '',
                        ...rest
                    } = data;

                    setAmountArray(AmountArray);
                    setClientMaindata(rest);
                    setCoPaymentCoverage(CoPaymentCoverage || 'No');
                    setCoPaymentDetails({
                        CoPaymentType,
                        CoPaymentTypeValue,
                        CoPaymentBillAmount,
                        CoPaymentFinalAmount,
                    });
                }
            } catch (error) {
                console.log('Error fetching client patient details:');
            }
        };

        fetchClientPatientDetails();
    }, [ClientPatientDetailes?.id, UrlLink]);

    const clearAmountState = () => {

        setAmountState({
            SettlementDate: '',
            SettlementAmount: '',
            UTRNumber: '',
        })
    }

    const HandelOnchangeState = (event) => {
        const { name, value } = event.target
        if (name === 'ApprovedAmount') {
            if (value !== '') {
                setClientMaindata((prev) => ({
                    ...prev,
                    [name]: value,
                }))
            }
            else if (value === '') {
                setClientMaindata((prev) => ({
                    ...prev,
                    [name]: value,
                    TdsAmount: '',
                    FinalSettlementAmount: ''
                }))
            }
        }
        else if (name === 'TdsPercentage') {
            if (value !== '') {
                setClientMaindata((prev) => ({
                    ...prev,
                    [name]: value,
                }))
            }
            else if (value === '') {
                setClientMaindata((prev) => ({
                    ...prev,
                    [name]: value,
                    TdsAmount: '',
                    FinalSettlementAmount: ''
                }))
            }
        }
        else {
            setClientMaindata((prev) => ({
                ...prev,
                [name]: value,
            }))
        }


    }

    useEffect(() => {
        const { ApprovedAmount} = ClientMaindata;

        const approvedAmount = parseFloat(ApprovedAmount) || 0;
        const tdsPercentage = parseFloat(10) || 0;

        let tdsAmount = 0; // Initialize as a number
        let finalSettlementAmount = 0; // Initialize as a number

        if (approvedAmount > 0 && tdsPercentage > 0) {
            tdsAmount = (approvedAmount * tdsPercentage) / 100;
            finalSettlementAmount = approvedAmount - tdsAmount;
        }

        setClientMaindata((prev) => ({
            ...prev,
            TdsPercentage:tdsPercentage,
            TdsAmount: tdsAmount.toFixed(2),  // Format as string with two decimal places
            FinalSettlementAmount: finalSettlementAmount.toFixed(2),
        }));
    }, [ClientMaindata.ApprovedAmount]);


    const handelOnchageAmountState = (e) => {

        const { name, value } = e.target

        setAmountState((prev) => ({
            ...prev,
            [name]: value,
        }))

    }

    const HandeleSaveAmount = () => {

        const requiredFileds = [
            'SettlementDate',
            'SettlementAmount',
            'UTRNumber',
        ]

        const missingFields = requiredFileds.filter((ele) => !AmountState[ele])

        if (missingFields.length > 0) {
            const tdata = {
                message: `Please fill empty fields: ${missingFields.join(", ")}`,
                type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
        }
        else {

            setAmountArray((prev) => [
                ...prev,
                { 'id': prev.length + 1, ...AmountState }
            ])

        }

        clearAmountState()


    }

    const HandleCoPaymentDetails = (e) => {
        const { name, value } = e.target;

        if (name === 'CoPaymentBillAmount') {
            if (value !== '') {
                setCoPaymentDetails((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
            else if (value == '') {
                setCoPaymentDetails((prev) => ({
                    ...prev,
                    [name]: value,
                    CoPaymentTypeValue: '',
                    CoPaymentType: '',
                    CoPaymentFinalAmount: ''
                }));
            }

        }
        else if (name === 'CoPaymentType') {
            if (value !== '') {
                setCoPaymentDetails((prev) => ({
                    ...prev,
                    [name]: value
                }));
            } else if (value === '') {
                setCoPaymentDetails((prev) => ({
                    ...prev,
                    [name]: value,
                    CoPaymentTypeValue: '',
                    CoPaymentFinalAmount: ''
                }));
            }
        }
        else {
            setCoPaymentDetails((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCheckboxCoPayment = (event) => {
        const value = event.target.value;
        // Always update the state with the selected value
        if (value === 'No') {
            setCoPaymentCoverage(value);
            setCoPaymentDetails({
                CoPaymentType: '',
                CoPaymentTypeValue: '',
                CoPaymentBillAmount: '',
                CoPaymentFinalAmount: '',
            });
        }
        else {
            setCoPaymentCoverage(value);
        }
    };
    useEffect(() => {
        const { CoPaymentBillAmount, CoPaymentType, CoPaymentTypeValue } = CoPaymentDetails;

        const billAmount = parseFloat(CoPaymentBillAmount) || 0;
        const coPaymentValue = parseFloat(CoPaymentTypeValue) || 0;

        let finalAmount = '';
        if (CoPaymentType === 'Percentage' && billAmount > 0 && coPaymentValue > 0) {
            const percentageAmount = (billAmount * coPaymentValue) / 100;
            finalAmount = (billAmount - percentageAmount).toFixed(2);
        } else if (CoPaymentType === 'Value' && billAmount > 0 && coPaymentValue > 0) {
            finalAmount = (billAmount - coPaymentValue).toFixed(2);
        }

        setCoPaymentDetails((prev) => ({
            ...prev,
            CoPaymentFinalAmount: finalAmount,
        }));
    }, [CoPaymentDetails.CoPaymentBillAmount, CoPaymentDetails.CoPaymentType, CoPaymentDetails.CoPaymentTypeValue]);



    const HandelDeleteAmount = (id) => {

        let RemoveData = AmountArray.filter((ele) => ele.id !== id);

        RemoveData = RemoveData.map((ele, ind) => {
            return { ...ele, id: ind + 1 };
        })

        setAmountArray(RemoveData)

    };



    const SaveClientRais = (status) => {


        const SubPostFun = (status) => {
            if (CoPaymentCoverage === 'Yes') {
                if (!CoPaymentDetails.CoPaymentType || !CoPaymentDetails.CoPaymentBillAmount || !CoPaymentDetails.CoPaymentTypeValue) {
                    const tdata = {
                        message: "Please fill CoPaymentType, CoPaymentBillAmount, and CoPaymentTypeValue",
                        type: "warn"
                    };
                    dispatchvalue({ type: "toast", value: tdata });
                    return; // Stop execution if validation fails
                }
            }

            let params = {
                TableId: ClientPatientDetailes?.id,
                ...ClientMaindata,
                CoPaymentCoverage: CoPaymentCoverage,
                CoPaymentDetails: { ...CoPaymentDetails },
                AmountArray: AmountArray,
                Created_By: UserData?.username,
                Status: status || '',
            }

            console.log('Sending params:', params);

            axios.post(`${UrlLink}Insurance/Post_Client_Patient_Detailes`, params)
                .then((res) => {
                    console.log(res.data);

                    let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                    dispatchvalue({ type: 'toast', value: tdata });
                    if (type === 'success') {
                        navigate('/Home/ClientDashboard');
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }



        if (status) {
            let ConformStatus = window.confirm("Are you sure you want to change the status to 'Completed'? Once the status is 'Completed,' it cannot be edited.")
            if (ConformStatus) {
                SubPostFun(status)
            }

        } else {
            SubPostFun()
        }

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
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PatientName}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      HIS No<span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}
                                    >{SelectedPatient_list.PatientId}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Age / Gender <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.AgeGender}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      D.O.A <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.AdmissionDate}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Address <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.Address}</h4>
                                  </div>
                                  {/* Address */}
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Payer Type <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                                  </div>
                                </div>
            
                                <div className="new_billing_address_2">
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      IP NO <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.RegisterId}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Ward - Bed No <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.WardBedNo}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Invoice No <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{PostInvoice}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Invoice Date <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{PostInvoicedate}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Discharge Date <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.DischargeDate}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Patient Mobile No <span>:</span>
                                    </label>
                                    <h4
                                    style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PhoneNumber}</h4>
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
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PatientName}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Patient ID <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PatientId}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Age / Gender <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.AgeGender}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      D.O.A <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.AdmissionDate}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Address <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.Address}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Payer Type <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                                  </div>
                                </div>
            
                                <div className="new_billing_address_2">
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      IP NO <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.RegisterId}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Ward - Bed No <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.WardBedNo}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Invoice No<span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{PostInvoice}</h4>
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
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{PostInvoicedate}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Discharge Date <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.DischargeDate}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Patient Mobile No <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PhoneNumber}</h4>
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
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PatientName}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Patient ID <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PatientId}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Age / Gender <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.AgeGender}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      D.O.A <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.AdmissionDate}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Address <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.Address}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Payer Type <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                                  </div>
                                </div>
            
                                <div className="new_billing_address_2">
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      IP NO <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.RegisterId}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Ward - Bed No <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.WardBedNo}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Invoice No <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{PostInvoice}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Invoice Date <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{PostInvoicedate}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Discharge Date <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.DischargeDate}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Patient Mobile No <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PhoneNumber}</h4>
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
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PatientName}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Patient ID <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PatientId}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Age / Gender <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.AgeGender}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      D.O.A <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.AdmissionDate}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Address <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.Address}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                    <label>
                                      Payer Type <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{`${SelectedPatient_list.PatientCategory} [IP]`}</h4>
                                  </div>
                                </div>
            
                                <div className="new_billing_address_2">
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      IP NO <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.RegisterId}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Ward - Bed No <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.WardBedNo}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Invoice No <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{PostInvoice}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Invoice Date <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{PostInvoicedate}</h4>
                                  </div>
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Discharge Date <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.DischargeDate}</h4>
                                  </div>
            
                                  <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                    <label>
                                      Patient Mobile No <span>:</span>
                                    </label>
                                    <h4 style={{
                                      fontSize:'12px'
                                    }}>{SelectedPatient_list.PhoneNumber}</h4>
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
    
                const handlebilloptionchange  = (e) => {
    
                 const value = e.target.value;
    
                 console.log(value,'valuevaluevalue')
    
                  if(value === "PrintReimbursable") {
    
                    const reimbursableItems = SelectDatalist.filter((item) => item.IsReimbursable === "Yes");
    
                    if (reimbursableItems.length === 0) {
                      const tdata = {
                        message: "No Print available For Reimbursable Items",
                        type: "Warn",
                      };
                    
                      dispatchvalue({ type: "toast", value: tdata });
                      return;
                    }
    
                    else{
    
                      setbilloption(value);
    
                    }
    
                  }
    
                  else if(value === "PrintNon-Reimbursable"){
                
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
                  else{
    
                    setbilloption(value);
    
                  }
    
                  }
    
                  else{
                    setbilloption(value);
                  }
    
                }





    return (
        <>
            <div className='Main_container_app'>

                <div className="new-patient-registration-form" >
                    <br />
                    <div className="dctr_info_up_head">
                        <div className="RegisFormcon ">
                            <div className="dctr_info_up_head22">

                                <img src={bgImg2} alt="Default Patient Photo" />

                                <label>Profile</label>
                            </div>
                        </div>

                        <div className="RegisFormcon_1">
                            <div className="RegisForm_1 ">
                                <label htmlFor="PatientID">
                                    Patient ID <span>:</span>
                                </label>
                                <span className="dctr_wrbvh_pice" htmlFor="PatientID">
                                    {ClientPatientDetailes?.PatientId}
                                </span>
                            </div>
                            <div className="RegisForm_1 ">
                                <label htmlFor="PatientName">
                                    Patient Name <span>:</span>{" "}
                                </label>
                                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                                    {ClientPatientDetailes?.PatientName}

                                </span>
                            </div>

                            <div className="RegisForm_1">
                                <label htmlFor="AgeGender">
                                    Age / Gender<span>:</span>
                                </label>
                                <span className="dctr_wrbvh_pice" id="AgeGender">
                                    {Array.isArray(PatientDetails) && PatientDetails.length > 0
                                        ? `${PatientDetails[0]?.Age || ""} / ${PatientDetails[0]?.Gender || ""}`
                                        : ""}
                                </span>
                            </div>
                            <div className="RegisForm_1">
                                <label htmlFor="PhoneNo">
                                    Phone Number<span>:</span>
                                </label>
                                <span className="dctr_wrbvh_pice" id="PhoneNo">
                                    {Array.isArray(PatientDetails) && PatientDetails.length > 0
                                        ? `${PatientDetails[0]?.PhoneNo || ""}`
                                        : ""}
                                </span>
                            </div>
                            <div className="RegisForm_1">
                                <label htmlFor="DoctorName">
                                    Doctor Name<span>:</span>
                                </label>
                                <span className="dctr_wrbvh_pice" id="DoctorName">
                                    {Array.isArray(PatientDetails) && PatientDetails.length > 0
                                        ? `${PatientDetails[0]?.DoctorName || ""}`
                                        : ""}
                                </span>
                            </div>
                            {/* <div className="RegisForm_1">
                                <label htmlFor="PurposeofAdmission">
                                    Purpose of Admission<span>:</span>
                                </label>
                                <span className="dctr_wrbvh_pice" id="PurposeofAdmission">
                                    {Array.isArray(PatientDetails) && PatientDetails.length > 0
                                        ? `${PatientDetails[0]?.PurposeofAdmission || ""}`
                                        : ""}
                                </span>
                            </div>
                            <div className="RegisForm_1">
                                <label htmlFor="PurposeDateofAdmissionofAdmission">
                                    Date of Admission<span>:</span>
                                </label>
                                <span className="dctr_wrbvh_pice" id="DateofAdmission">
                                    {Array.isArray(PatientDetails) && PatientDetails.length > 0
                                        ? `${PatientDetails[0]?.DateofAdmission || ""}`
                                        : ""}
                                </span>
                            </div>
                            <div className="RegisForm_1">
                                <label htmlFor="isMlc">
                                    IsMLC<span>:</span>
                                </label>
                                <span className="dctr_wrbvh_pice" id="isMlc">
                                    {Array.isArray(PatientDetails) && PatientDetails.length > 0
                                        ? `${PatientDetails[0]?.isMlc || ""}`
                                        : ""}
                                </span>
                            </div> */}

 {(ClientPatientDetailes?.PatientServiesType === "IP" || ClientPatientDetailes?.PatientServiesType === "Casuality") && (
                <>
                  <div className="RegisForm_1">
                    <label htmlFor="PurposeofAdmission">
                      Purpose of Admission<span>:</span>
                    </label>
                    <span className="dctr_wrbvh_pice" id="PurposeofAdmission">
                      {Array.isArray(PatientDetails) && PatientDetails.length > 0
                        ? `${PatientDetails[0]?.PurposeofAdmission || ""}`
                        : ""}
                    </span>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="DateofAdmission">
                      Date of Admission<span>:</span>
                    </label>
                    <span className="dctr_wrbvh_pice" id="DateofAdmission">
                      {Array.isArray(PatientDetails) && PatientDetails.length > 0
                        ? `${PatientDetails[0]?.DateofAdmission || ""}`
                        : ""}
                    </span>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="isMlc">
                      IsMLC<span>:</span>
                    </label>
                    <span className="dctr_wrbvh_pice" id="isMlc">
                      {Array.isArray(PatientDetails) && PatientDetails.length > 0
                        ? `${PatientDetails[0]?.isMlc || ""}`
                        : ""}
                    </span>
                  </div>
                </>
              )}

              {ClientPatientDetailes?.PatientServiesType === "OP" && (
                <>
                  <div className="RegisForm_1">
                    <label htmlFor="VisitId">
                      Visit ID<span>:</span>
                    </label>
                    <span className="dctr_wrbvh_pice" id="VisitId">
                      {Array.isArray(PatientDetails) && PatientDetails.length > 0
                        ? `${PatientDetails[0]?.VisitId || ""}`
                        : ""}
                    </span>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="VisitPurpose">
                      Visit Purpose<span>:</span>
                    </label>
                    <span className="dctr_wrbvh_pice" id="VisitPurpose">
                      {Array.isArray(PatientDetails) && PatientDetails.length > 0
                        ? `${PatientDetails[0]?.VisitPurpose || ""}`
                        : ""}
                    </span>
                  </div>
                  <div className="RegisForm_1">
                    <label htmlFor="Date">
                      Date<span>:</span>
                    </label>
                    <span className="dctr_wrbvh_pice" id="Date">
                      {Array.isArray(PatientDetails) && PatientDetails.length > 0
                        ? `${PatientDetails[0]?.Date || ""}`
                        : ""}
                    </span>
                  </div>
                </>
              )}


                            <div className="RegisForm_1 ">
                                <label htmlFor="Age">
                                    Registration ID <span>:</span>{" "}
                                </label>
                                <span className="dctr_wrbvh_pice" htmlFor="Age">
                                    {ClientPatientDetailes?.RegistrationId}
                                </span>
                            </div>

                             <div className="RegisForm_1 " >
                                          <select
                                            style={{ backgroundColor: '#d8d7d7' }}
                                            value={billoption}
                                            onChange={handlebilloptionchange}>
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
                    </div>

                </div>
                <br />

                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label htmlFor="ClientName">
                            Client Name<span>:</span>
                        </label>
                        <span className="dctr_wrbvh_pice" id="InsuranceName">
                            {Array.isArray(ClientDetails) && ClientDetails.length > 0
                                ? `${ClientDetails[0]?.Client_Name || ""}`
                                : ""}
                        </span>
                    </div>
                    <div className="RegisForm_1">
                        <label htmlFor="ContactPerson">
                            Contact Person<span>:</span>
                        </label>
                        <span className="dctr_wrbvh_pice" id="InsuranceName">
                            {Array.isArray(ClientDetails) && ClientDetails.length > 0
                                ? `${ClientDetails[0]?.ContactPerson || ""}`
                                : ""}
                        </span>
                    </div>

                    <div className="RegisForm_1">
                        <label htmlFor="PhoneNumber">
                            Phone Number<span>:</span>
                        </label>
                        <span className="dctr_wrbvh_pice" id="InsuranceName">
                            {Array.isArray(ClientDetails) && ClientDetails.length > 0
                                ? `${ClientDetails[0]?.PhoneNumber || ""}`
                                : ""}
                        </span>
                    </div>
                    <div className="RegisForm_1">
                        <label htmlFor="MailId">
                            MailId<span>:</span>
                        </label>
                        <span className="dctr_wrbvh_pice" id="InsuranceName">
                            {Array.isArray(ClientDetails) && ClientDetails.length > 0
                                ? `${ClientDetails[0]?.MailId || ""}`
                                : ""}
                        </span>
                    </div>
                </div>

                <br />

                <div className="RegisForm_1">

                    <label>
                        CoPayment ? <span>:</span>
                    </label>

                    <div className="ewj_i87_head">
                        <div className="ewj_i87">
                            <input
                                type="radio"
                                id="CoPaymentYes"
                                name="CoPayment"
                                value="Yes"
                                checked={CoPaymentCoverage === "Yes"}
                                onChange={handleCheckboxCoPayment}
                            ></input>

                            <label htmlFor="CoPaymentYes">Yes</label>
                        </div>

                        <div className="ewj_i87">
                            <input
                                type="radio"
                                id="CoPaymentNo"
                                name="CoPayment"
                                value="No"
                                checked={CoPaymentCoverage === "No"}
                                onChange={handleCheckboxCoPayment}
                            ></input>
                            <label htmlFor="CoPaymentNo">No</label>
                        </div>
                    </div>
                </div>
                <br />
                {CoPaymentCoverage === "Yes" && (
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">

                            <label>Bill Amount<span>:</span></label>
                            <input
                                name='CoPaymentBillAmount'
                                value={CoPaymentDetails.CoPaymentBillAmount}
                                onChange={HandleCoPaymentDetails}
                                autoComplete="off"
                                onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                                }
                            />

                        </div>

                        <div className="RegisForm_1">

                            <label>Co-Payment Type<span>:</span></label>
                            <select
                                style={{ width: '100px' }}
                                name='CoPaymentType'
                                value={CoPaymentDetails.CoPaymentType}
                                onChange={HandleCoPaymentDetails}
                            >
                                <option value=''>Select</option>
                                <option value='Percentage'>Percentage</option>
                                <option value='Value'>Value</option>


                            </select>
                            <input
                                type='number'
                                style={{ width: '50px' }}
                                name='CoPaymentTypeValue'
                                value={CoPaymentDetails.CoPaymentTypeValue}
                                onChange={HandleCoPaymentDetails}
                                autoComplete="off"
                                onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                                }
                            />
                        </div>

                        <div className="RegisForm_1">

                            <label>CoPayment Amount<span>:</span></label>
                            <input
                                type='number'
                                style={{ width: '50px' }}
                                name='CoPaymentFinalAmount'
                                value={CoPaymentDetails.CoPaymentFinalAmount}
                                onChange={HandleCoPaymentDetails}
                                autoComplete="off"
                                onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                                }
                                disabled
                            />

                        </div>






                    </div>
                )}


                <br />

                <div className="RegisFormcon_1">

                    <div className="RegisForm_1">


                        <label>PreAuth Date<span>:</span></label>
                        <input
                            type='date'
                            name='PreAuthDate'
                            value={ClientMaindata.PreAuthDate}
                            onChange={HandelOnchangeState}
                        />

                    </div>


                    <div className="RegisForm_1">


                        <label>PreAuth Amount<span>:</span></label>
                        <input
                            type='number'
                            name='PreAuthAmount'
                            value={ClientMaindata.PreAuthAmount}
                            onChange={HandelOnchangeState}
                        />

                    </div>

                    <div className="RegisForm_1">


                        <label>Discharge Date<span>:</span></label>
                        <input
                            type='date'
                            name='DischargeDate'
                            value={ClientMaindata.DischargeDate}
                            onChange={HandelOnchangeState}
                        />

                    </div>

                    <div className="RegisForm_1">


                        <label>Final Bill Amount<span>:</span></label>
                        <input
                            type='number'
                            name='FinalBillAmount'
                            value={ClientMaindata.FinalBillAmount}
                            onChange={HandelOnchangeState}
                        />

                    </div>

                    <div className="RegisForm_1">


                        <label>Raised Amount<span>:</span></label>
                        <input
                            type='number'
                            name='RaisedAmount'
                            value={ClientMaindata.RaisedAmount}
                            onChange={HandelOnchangeState}
                        />

                    </div>

                    <div className="RegisForm_1">


                        <label>Approved Amount<span>:</span></label>
                        <input
                            type='number'
                            name='ApprovedAmount'
                            value={ClientMaindata.ApprovedAmount}
                            onChange={HandelOnchangeState}
                        />

                    </div>
                    <div className="RegisForm_1">
                        <label>TDS %<span>:</span></label>
                        <input
                            name='TdsPercentage'
                            value={ClientMaindata.TdsPercentage}
                            onChange={HandelOnchangeState}
                            autoComplete="off"
                            onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                            }
                            disabled
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>TDS Amount<span>:</span></label>
                        <input
                            name='TdsAmount'
                            value={ClientMaindata.TdsAmount}
                            onChange={HandelOnchangeState}
                            autoComplete="off"
                            onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                            }
                            disabled
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>Final Settlement Amount<span>:</span></label>
                        <input
                            name='FinalSettlementAmount'
                            value={ClientMaindata.FinalSettlementAmount}
                            onChange={HandelOnchangeState}
                            autoComplete="off"
                            onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                            }
                            disabled
                        />
                    </div>

                    <div className="RegisForm_1">


                        <label>Courier Date<span>:</span></label>
                        <input
                            type='date'
                            name='CourierDate'
                            value={ClientMaindata.CourierDate}
                            onChange={HandelOnchangeState}
                        />

                    </div>


                    <div className="RegisForm_1">


                        <label>Settlement Date Count<span>:</span></label>
                        <input
                            type='number'
                            name='SettlementDateCount'
                            value={ClientMaindata.SettlementDateCount}
                            onChange={HandelOnchangeState}
                        />

                    </div>

                </div>

                <br />
                <div className="RegisFormcon_1">

                    <div className="RegisForm_1">


                        <label>Settlement Date<span>:</span></label>
                        <input
                            type='date'
                            name='SettlementDate'
                            value={AmountState.SettlementDate}
                            onChange={handelOnchageAmountState}
                        />

                    </div>

                    <div className="RegisForm_1">


                        <label>Settlement Amount<span>:</span></label>
                        <input
                            type='number'
                            name='SettlementAmount'
                            value={AmountState.SettlementAmount}
                            onChange={handelOnchageAmountState}
                        />

                    </div>

                    <div className="RegisForm_1">

                        <label>UTR Number<span>:</span></label>
                        <input
                            type='text'
                            name='UTRNumber'
                            value={AmountState.UTRNumber}
                            onChange={handelOnchageAmountState}
                        />

                        <div onClick={HandeleSaveAmount} className="Search_patient_icons" style={{ cursor: 'pointer' }}>
                            <AddBoxIcon />
                        </div>

                    </div>

                </div>


                <br />

                {AmountArray.length !== 0 && <div className="for">
                    <div className="Selected-table-container">
                        <table className="selected-medicine-table2">
                            <thead>
                                <tr>
                                    <th id="slectbill_ins" style={{ width: "160px" }}>S.No</th>
                                    <th id="slectbill_ins" style={{ width: "260px" }}>Settlement Date</th>
                                    <th id="slectbill_ins" style={{ width: "160px" }}>Settlement Amount</th>
                                    <th id="slectbill_ins" style={{ width: "260px" }}>UTR Number</th>
                                    <th id="slectbill_ins" style={{ width: "160px" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {AmountArray.length !== 0 && AmountArray.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ width: "160px" }}>{item.id}</td>
                                        <td style={{ width: "260px" }}>{item.SettlementDate}</td>
                                        <td style={{ width: "160px" }}>{item.SettlementAmount}</td>
                                        <td style={{ width: "160px" }}>{item.UTRNumber}</td>
                                        <td style={{ width: "160px" }} >
                                            <DeleteIcon onClick={() => HandelDeleteAmount(item.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>}

                {openModal2 && (
  <div className="loader" onClick={handleCloseModal1}>
    <div className="cardModel" onClick={(e) => e.stopPropagation()}>
      <>
        {billoption === "Printsummary" && (
          <ForPrintSumData onClose={() => setbilloption(null)} />
        )}
        {billoption === "PrintDetailed" && (
          <ForPrintData onClose={() => setbilloption(null)} />
        )}
        {billoption === "PrintReimbursable" && (
          <ForPrintReimbData onClose={() => setbilloption(null)} />
        )}
        {billoption === "PrintNon-Reimbursable" && (
          <ForPrintNon_ReimbData onClose={() => setbilloption(null)} />
        )}
      </>
    </div>
  </div>
          )}

                <div style={{ display: 'flex', gap: '30px' }}>
                    <div className="Main_container_Btn">
                        <button onClick={() => SaveClientRais('')}>
                            Save
                        </button>
                    </div>


                    {AmountArray.length !== 0 && <div className="Main_container_Btn">
                        <button onClick={() => SaveClientRais('COMPLETED')}>
                            Compleate
                        </button>
                    </div>}

                </div>

            </div>

            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default ClientMainpage;


