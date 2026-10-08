import axios from 'axios'
import React, { useEffect, useState,useRef,useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Button from "@mui/material/Button";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from "@mui/icons-material/Loupe";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useReactToPrint } from 'react-to-print';
import { NumberToWords } from "../../OtherComponent/OtherFunctions";
import PrintIcon from '@mui/icons-material/Print';





const GeneralBillingRefundRequestList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
      const componentRef = useRef();
    
    const navigate = useNavigate()
    const [Filterdata, setFilterdata] = useState([])
    console.log('Filterdata',Filterdata)
    const [SearchQuery, setSearchQuery] = useState({
        searchBy: "",
        Status: "Pending"
    })
    // Function to format date as MM/DD/YYYY
    const formatDate = (date) => {
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const [printoption, setprintoption] = useState('PrintDetailed');
    const [printView, setPrintView] = useState(null);
    const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
    const [Refundamt,setRefundamt] = useState(0);

    const [searchOptions, setSearchOptions] = useState({
        DateType: 'Current',
        CurrentDate: TodayDate,
        FromDate: '',
        ToDate: '',
        // Paymentmode:'',
        SearchbyFirstName: '',
        SearchbySpeciality: '',
        SearchbyDoctor: '',
        SearchTimeOrderby: '',
        SearchStatus: 'Paid',
        ItemSearchStatus: 'Paid',
    })

    const [SelectedPatient_list, setSelectedPatient_list] = useState({
        PatientId: '',
        PatientName: '',
        PhoneNumber: '',
        PatientCategory: 'General',
        PatientCategoryType: '',
        InsuranceName: '',
        Gender: '',
        City: '',
        State: '',
        PatientAddress: '',
        Pincode: '',
        VisitId: '',
        Date: '',
        ReferalDoctor: '',
        AgeGender: '',
      });

      const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
    

    const [ClinicDetials, setClinicDetials] = useState({
        ClinicLogo: null,
        ClinicName: '',
        ClinicGST: '',
        ClinicAddress: '',
        ClinicCity: '',
        ClinicState: '',
        ClinicCode: '',
        ClinicMobileNo: '',
        ClinicLandLineNo: '',
        ClinicMailID: '',
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
              setClinicDetials((prev) => ({
                ...prev,
                ClinicAddress: addressComponents.join(', '),
                ClinicGST: clinicData.GSTNo || prev.ClinicGST,
                ClinicCity: clinicData.City || prev.ClinicCity,
                ClinicState: clinicData.State || prev.ClinicState,
                ClinicCode: clinicData.Pincode || prev.ClinicCode,
                ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
                ClinicLandLineNo: clinicData.LandlineNo || prev.ClinicLandLineNo,
                ClinicMailID: clinicData.Mail || prev.ClinicMailID,
              }));
            }
          })
          .catch((error) => console.error(error));
      }, [UserData?.location, UrlLink]);

    const [billAmount, setBillAmount] = useState([]);
    const [SelectDatalist, setSelectDatalist] = useState([]);
    const [PostInvoice, setPostInvoice] = useState(null);
    const [ReceiptInvoice, setReceiptInvoice] = useState(null);

    console.log(billAmount,'SelectDatalist')

    const [BillingData, setBillingData] = useState({
        InvoiceNo: '',
        InvoiceDate: '',
        InvoiceTime: '',
        DoctorName: '',
        DoctorId: '',
        Billedby: UserData?.username || '',
      });

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

    const [printOptions, setPrintOptions] = useState({});
    const [BillCopyType, setBillCopyType] = useState('');

    const handlePrint2 = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: async () => {
          navigate('/Home/CashierFolder');
          dispatchvalue({ type: 'HrFolder', value: 'GeneralBillingRefundRequestList' });
          dispatchvalue({ type: 'setPreviousFolder', value: null });
          dispatchvalue({ type: 'showMenu', value: true });
        },
      });
    
      const handlePrintClose = () => {
        setPrintView(null);
        navigate('/Home/CashierFolder');
        dispatchvalue({ type: 'HrFolder', value: 'GeneralBillingRefundRequestList' });
        dispatchvalue({ type: 'setPreviousFolder', value: null });
        dispatchvalue({ type: 'showMenu', value: true });
      };



    useEffect(() => {
    const controller = new AbortController(); // Create AbortController instance
    const signal = controller.signal; // Get the signal for the request

    const endpoint =
      searchOptions.ItemSearchStatus === "Refunded"
        ? "Frontoffice/get_refunded_bill"
        : "Frontoffice/GeneralBilling_Refund_Link";

    console.log(endpoint, 'endpoint');

    axios
      .get(`${UrlLink}${endpoint}`, {
        params: { ...searchOptions, location: UserData?.location },
        signal // Pass the AbortController signal to axios
      })
      .then((res) => {
        const ress = res.data;

        if (Array.isArray(ress)) {
          setFilterdata(ress);
        } else {
          setFilterdata([]);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.log('Request canceled:', err.message);
        } else {
          console.error('Error:', err);
        }
        setFilterdata([]);
      });

    // Cleanup: Abort the request when the component unmounts or dependencies change
    return () => {
      controller.abort();
    };
}, [UrlLink, searchOptions, UserData?.location]);



    const handleSearchChange = (e) => {
        const { name, value } = e.target
        setSearchQuery((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const HandleOnchangeSearch = (e) => {
        const { name, value } = e.target;

        console.log(`Updating ${name} with value:`, value);

        if (name === 'SearchbyPhoneNumber') {
            if (value.length <= 10) {
                setSearchOptions((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
        else if (name === 'DateType') {
            if (value === 'Current') {
                setSearchOptions((prev) => ({
                    ...prev,
                    DateType: value,
                    CurrentDate: TodayDate, // Ensure TodayDate is properly defined
                    FromDate: '',
                    ToDate: '',
                }));
            }
            else if (value === 'Customize') {
                setSearchOptions((prev) => ({
                    ...prev,
                    DateType: value,
                    CurrentDate: '',
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
        }
        else {
            setSearchOptions((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handlenewDocRegister = () => {
        dispatchvalue({ type: 'OPBillingData', value: { type: 'OP' } })
        dispatchvalue({ type: 'IPBillingData', value: {} })
        navigate('/Home/CashierFolder');
        dispatchvalue({ type: 'HrFolder', value: 'OverAllQuickBillingFront' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    }
    const HandleMovedatatobill = (params) => {
        dispatchvalue({ type: 'OPBillingData', value: params, status: 'Paid'})
        dispatchvalue({ type: 'IPBillingData', value: {} })
        navigate('/Home/CashierFolder');
        dispatchvalue({ type: 'HrFolder', value: 'QuickBillingRefundRequestCashier'});
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    }
    const HandleMovedatatoArrpoved = (params) => {
        dispatchvalue({ type: 'OPBillingData', value: params, status: 'Approved' })
        dispatchvalue({ type: 'IPBillingData', value: {} })
        navigate('/Home/CashierFolder');
        dispatchvalue({ type: 'HrFolder', value: 'QuickBillingApprovedRefundCashier'});
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
    }

    // const PatientOPRegisterColumns = [
    //     {
    //         key: "id",
    //         name: "ID",
    //     },
    //     {
    //         key: "Billing_Date",
    //         name: "Date",
    //     },
    //     {
    //         key: "PatientId",
    //         name: "Patient Id",
    //     },
    //     {
    //         key: "Patient_Name",
    //         name: "Patient Name",
    //     },
    //     {
    //         key: "PhoneNo",
    //         name: "PhoneNo",
    //     },
    //     {
    //         key: "Doctor_Name",
    //         name: "Doctor Name",

    //     },
    //     {
    //         key: 'PatientCategory',
    //         name: 'Patient Category',
    //     },
    //     {
    //         key: 'Net_Amount',
    //         name: 'Net Amount',
    //     },
    //     {
    //         key: 'PaidAmount',
    //         name: 'Paid Amount',
    //     },
    //     {
    //         key: 'BalanceAmount',
    //         name: 'Balance Amount',
    //     },
    //     {
    //         key: "Action",
    //         name: "Action",
    //         renderCell: (params) => {
    //             return (
    //                 searchOptions.ItemSearchStatus === 'Paid' || searchOptions.ItemSearchStatus === 'Refund'  ? <Button
    //                     className="cell_btn"
    //                     onClick={() => HandleMovedatatobill(params.row)}
    //                 >
    //                     <ArrowForwardIcon className="check_box_clrr_cancell" />
    //                 </Button> : searchOptions.ItemSearchStatus === 'Approved' ? <Button
    //                     className="cell_btn"
    //                     onClick={() => HandleMovedatatoArrpoved(params.row)}
    //                 >
    //                     <ArrowForwardIcon className="check_box_clrr_cancell" />
    //                 </Button> : ""

    //             )
    //         },
    //     },
    // ]

const PatientOPRegisterColumns = useMemo(() => {
    if (searchOptions.ItemSearchStatus === 'Refunded') {
        return [
            {
                key: "Voucher_Number",
                name: "Voucher Number",
            },
            {
                key: "Refund_Billing_Date",
                name: "Refund Date",
            },
            // {
            //     key: "Billing_Details.",
            //     name: "Patient Id",
            // },
            {
                key: "Refund_Patient_Name",
                name: "Patient Name",
            },
            // {
            //     key: "PhoneNo",
            //     name: "PhoneNo",
            // },
            // {
            //     key: "Doctor_Name",
            //     name: "Doctor Name",
            // },
            // {
            //     key: 'PatientCategory',
            //     name: 'Patient Category',
            // },
            {
                key: 'Net_Amount',
                name: 'Net Amount',
            },
            {
                key: 'Refund_PaidAmount',
                name: 'Refund Amount',
            },
            {
                key: 'Refund_BalanceAmount',
                name: 'Balance Amount',
            },
            {
                key: 'Refund_Billedby',
                name: 'Prepared',
            },
            {
                key: "Action",
                name: "Action",
                renderCell: (params) => {
                    const rowId = params.row.Voucher_Number;
                    if (!rowId) {
                        console.warn('Missing row id:', params.row);
                        return <span>Invalid Row</span>;
                    }
                    const copyType = printOptions[rowId]?.copyType || 'Duplicate';
                    const handleCopyTypeChange = (e) => {
                        const value = e.target.value;
                        setPrintOptions((prev) => ({
                            ...prev,
                            [rowId]: { ...prev[rowId], copyType: value },
                        }));
                    };
                    const handlePrint = () => {
                        HandlePrintReceipt(params.row, copyType);
                    };
                    return (
                        <div className="Register_btn_con added_Register_btn_con">
                            <select
                                className="copy_type_select"
                                value={copyType}
                                onChange={handleCopyTypeChange}
                            >
                                {['Original', 'Duplicate'].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="RegisterForm_1_btns added_RegisterForm_1_btns"
                                onClick={handlePrint}
                            >
                                <PrintIcon className="check_box_clrr_cancell" />
                            </button>
                        </div>
                    );
                },
            },
        ];
    }
    return [
        {
            key: "id",
            name: "ID",
        },
        {
            key: "Billing_Date",
            name: "Date",
        },
        {
            key: "PatientId",
            name: "Patient Id",
        },
        {
            key: "Patient_Name",
            name: "Patient Name",
        },
        {
            key: "PhoneNo",
            name: "PhoneNo",
        },
        {
            key: "Doctor_Name",
            name: "Doctor Name",
        },
        {
            key: 'PatientCategory',
            name: 'Patient Category',
        },
        {
            key: 'Net_Amount',
            name: 'Net Amount',
        },
        {
            key: 'PaidAmount',
            name: 'Paid Amount',
        },
        {
            key: 'BalanceAmount',
            name: 'Balance Amount',
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => {
                return (
                    searchOptions.ItemSearchStatus === 'Paid' || searchOptions.ItemSearchStatus === 'Refund' ? (
                        <Button
                            className="cell_btn"
                            onClick={() => HandleMovedatatobill(params.row)}
                        >
                            <ArrowForwardIcon className="check_box_clrr_cancell" />
                        </Button>
                    ) : searchOptions.ItemSearchStatus === 'Approved' ? (
                        <Button
                            className="cell_btn"
                            onClick={() => HandleMovedatatoArrpoved(params.row)}
                        >
                            <ArrowForwardIcon className="check_box_clrr_cancell" />
                        </Button>
                    ) : (
                        ""
                    )
                );
            },
        },
    ];
}, [searchOptions.SearchStatus, searchOptions.ItemSearchStatus, printOptions]);

    const HandlePrintReceipt  = (params, CopyType) => {

        console.log(params,'params')

        setBillCopyType(CopyType);
        setSelectedPatient_list({
            PatientId: params?.Billing_Details?.PatientId,
            PatientName: params?.Billing_Details?.Patient_Name,
            PhoneNumber: params?.Billing_Details?.PhoneNo,
            PatientCategory: params?.Billing_Details?.PatientCategory,
            PatientCategoryType: params?.Billing_Details?.PatientCategoryName,
            Date: params?.Billing_Details?.Billing_Date,
            VisitId: params?.Billing_Details?.Visit_Id,
            City: params?.Billing_Details?.City,
            State: params?.Billing_Details?.State,
            Pincode: params?.Billing_Details?.Pincode,
            PatientAddress: params?.Billing_Details?.Address,
            RegisterId: params?.Billing_Details?.Register_Id,
            AgeGender: params?.Billing_Details?.AgeGender,
        });

        setSelectDatalist(params?.Refunded_Items);
        setBillAmount(params?.Refund_Payment_Details);
        setPrintView('RefundReceipt');
        setRefundamt(params?.Refund_TotalPaidAmount);
        setReceiptInvoice(params?.Voucher_Number);
        setBillingData({
           InvoiceDate : params?. Refund_Billing_Date,
           Billedby : params?.Refund_Billedby,
           DoctorName : params?.Billing_Details?.Doctor_Name
        })



    };

    const ForPrintReceiptData = () => {
        const hasCard = billAmount.some((p) => p.Payment_Type === 'Card');
        const hasCheque = billAmount.some((p) => p.Payment_Type === 'Cheque');
        const hasBank = billAmount.some((p) => p.Payment_Type === 'Bank');
    
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
                            <h4>{SelectedPatient_list?.PatientName}</h4>
                          </div>
    
                          <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                            <label>
                              Patient ID <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list?.PatientId}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                            <label>
                              Age / Gender <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list?.AgeGender}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                            <label>
                              Patient Mobile No <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list?.PhoneNumber}</h4>
                          </div>
    
    
                        </div>
    
                        <div className="new_billing_address_2 new_billing_address_2_new_up">
                          <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                            <label>
                              OP NO <span>:</span>
                            </label>
                            <h4>{SelectedPatient_list?.RegisterId}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                            <label>
                              Receipt No <span>:</span>
                            </label>
                            <h4>{ReceiptInvoice}</h4>
                          </div>
                          <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                            <label>
                              Receipt Date <span>:</span>
                            </label>
                            <h4>{BillingData?.InvoiceDate}</h4>
                          </div>
                          {SelectedPatient_list?.ReferalDoctor&&
                            <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                              <label>
                                Referal Doctor<span>:</span>
                              </label>
                              <h4>{SelectedPatient_list?.ReferalDoctor}</h4>
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
                          <h4>{`${BillingData?.DoctorName}`}</h4>
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
                          {SelectDatalist.map((row, index, filteredArray) => (
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
                                    <td>{row.Payment_Type || '-'}</td>
                                    {hasCard && (
                                      <td>{row.Payment_Type === 'Card' ? row.Card_Type || '-' : '-'}</td>
                                    )}
                                    {hasCheque && (
                                      <td>{row.Payment_Type === 'Cheque' ? row.Cheque_No || '-' : '-'}</td>
                                    )}
                                    {hasBank && (
                                      <td>{row.Payment_Type === 'Bank' ? row.Bank_Name || '-' : '-'}</td>
                                    )}
                                    <td>{row.Amount || '-'}</td>
                                    <td>{row.Additionalamount || '-'}</td>
                                    {hasCard && (
                                      <td>{row.Payment_Type === 'Card' ? `${row.transactionFee}%` || '-' : '-'}</td>
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
                              {NumberToWords(+Refundamt

                              )}
                            </span>
                          </div>
                          <div className="bill_body_new_phar">
                            <label>
                              Billed By <span>:</span>
                            </label>
                            <span>{BillingData?.Billedby}</span>
                          </div>
                        </div>
    
    
    
                        <div>
                          {/* <div className="bill_body_new_phar">
                            <label>
                              Gross Amount <span>:</span>
                            </label>
                            <span>{initialState.totalAmount}</span>
                          </div> */}
    
                          {/* <div className="bill_body_new_phar">
                            <label>
                              Net Amount <span>:</span>
                            </label>
                            <span>{initialState.totalNetAmount}</span>
                          </div> */}
                          <div className="bill_body_new_phar">
                            <label>
                              Refund Amount <span>:</span>
                            </label>
                            <span>{Refundamt}</span>
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
            <>

            {printView === null ? (
            <div className="Main_container_app">
                <h3>Billing Refund Request Queue List</h3>
                <div className="search_div_bar">
                <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
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
                        name="ItemSearchStatus"
                        value={searchOptions.ItemSearchStatus}
                        onChange={HandleOnchangeSearch}
                    >
                        <option value="Paid">Paid</option>
                        <option value="Refund">Cancel Refund</option>
                        <option value="RefundRequest">Requested</option>
                        <option value="Approved">Approved</option>
                        <option value="Refunded">Refunded</option>
                    </select>
                    <button
                        className="search_div_bar_btn_1"
                        onClick={handlenewDocRegister}
                        title="New Doctor Register"
                    >
                        <LoupeIcon />
                    </button>
                    </div>
                </div>
                </div>

                <ReactGrid
                columns={PatientOPRegisterColumns}
                RowData={Filterdata}
                />
            </div>
            ) : printView === "RefundReceipt" ? (
            <>
                <ForPrintReceiptData />
            </>
            ) : null}



            <ToastAlert Message={toast.message} Type={toast.type} />
            </>
        </>
    )
}

export default GeneralBillingRefundRequestList;