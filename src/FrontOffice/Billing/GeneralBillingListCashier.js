import axios from 'axios';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from '@mui/icons-material/Loupe';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import {
  format,
} from 'date-fns';
import ForPrintBill from './PrintFormats/ForPrintBill';
import ForPrintReceipt from './PrintFormats/ForPrintReceipt';
import ForPrintBillReceipt from './PrintFormats/ForPrintBillReceipt';

const GeneralBillingList = () => {
  const componentRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);

      const InvoiceNo = useSelector(state => state.Frontoffice?.InvoiceNo);

      console.log('InvoiceNo',InvoiceNo)

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [Filterdata, setFilterdata] = useState([]);
  const [OpdrNumbers, setOpdrNumbers] = useState([]); // State for OPDR numbers
  const [SearchQuery, setSearchQuery] = useState({
    searchBy: '',
    Status:  'Pending',
    OpdrNo:  '', // Add OPDR number to search query
  });

  useEffect(() => {
  setSearchQuery((prev) => ({
    ...prev,
    Status: "Paid"
  }));
}, [SearchQuery.OpdrNo]);




  const [printoption, setprintoption] = useState('PrintDetailed');
   const [printView, setPrintView] = useState(null);
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
  const OP_BillingData = useSelector((state) => state.Frontoffice?.OPBillingData);
  const currentDate = new Date();
  const Formdate = format(currentDate, 'yyyy-MM-dd');

  const [BillingData, setBillingData] = useState({
    InvoiceNo: '',
    InvoiceDate: '',
    InvoiceTime: '',
    DoctorName: '',
    DoctorId: '',
    Billedby: UserData?.username || '',
  });

  const [billAmount, setBillAmount] = useState([]);
  const [SelectDatalist, setSelectDatalist] = useState([]);
  const [PostInvoice, setPostInvoice] = useState(null);
  const [ReceiptInvoice, setReceiptInvoice] = useState(null);
  const [RegisterData, setRegisterData] = useState({
    PatientId: '',
    ABHA: '',
    PatientName: '',
    AgeGender: '',
    PhoneNo: '',
    PatientCategory: '',
    PatientCategoryName: '',
    Address: '',
  });

  const [printOptions, setPrintOptions] = useState({});
  const [BillCopyType, setBillCopyType] = useState('');

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));

  const [searchOptions, setSearchOptions] = useState({
    DateType: 'Current',
    CurrentDate: TodayDate,
    FromDate: '',
    ToDate: '',
    SearchbyFirstName: '',
    SearchbySpeciality: '',
    SearchbyDoctor: '',
    SearchTimeOrderby: '',
    SearchStatus: 'Pending',
  });

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

  // Fetch hospital and clinic details
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Hospital_Detials_link`)
      .then((res) => {
        const ress = res.data;
        setClinicDetials((prev) => ({
          ...prev,
          ClinicName: ress.hospitalName,
          ClinicLogo: ress.hospitalLogo,
        }));
      })
      .catch((e) => console.error(e));
  }, [UrlLink]);

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

  // Fetch billing data and extract OPDR numbers
 useEffect(() => {
    const controller = new AbortController(); // Create AbortController instance
    const signal = controller.signal; // Get the signal for the request

    const apiUrl =
      searchOptions.SearchStatus === 'Paid' || searchOptions.SearchStatus === 'Due'
        ? `${UrlLink}Frontoffice/GeneralBilling_Paid_Bill_Link`
        : `${UrlLink}Frontoffice/Get_OP_Billing_Details`;

    axios
      .get(apiUrl, { 
        params: { ...searchOptions, location: UserData?.location },
        signal // Pass the AbortController signal to axios
      })
      .then((res) => {
        let ress = res.data;
        if (Array.isArray(ress)) {
          // Extract OPDR numbers (id field) for datalist
          const opdrList = [...new Set(ress.map((item) => item.id))]; // Ensure unique OPDR numbers
          setOpdrNumbers(opdrList);
          // Apply OPDR number filter if selected
          if (SearchQuery.OpdrNo) {
            ress = ress.filter((item) => item.id === SearchQuery.OpdrNo);
          }
          setFilterdata(ress);
        } else {
          setFilterdata([]);
          setOpdrNumbers([]);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.log('Request canceled:', err.message);
        } else {
          console.error('Error:', err);
        }
        setFilterdata([]);
        setOpdrNumbers([]);
      });

    // Cleanup: Abort the request when the component unmounts or dependencies change
    return () => {
      controller.abort();
    };
}, [UrlLink, searchOptions, UserData?.location, SearchQuery.OpdrNo]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === 'SearchbyPhoneNumber') {
      if (value.length <= 10) {
        setSearchOptions((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === 'DateType') {
      if (value === 'Current') {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: TodayDate,
          FromDate: '',
          ToDate: '',
        }));
      } else if (value === 'Customize') {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: '',
        }));
      } else if (value === 'All') {
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

  const handlenewDocRegister = () => {
    dispatchvalue({ type: 'OPBillingData', value: { type: 'OP' } });
    dispatchvalue({ type: 'IPBillingData', value: {} });
    navigate('/Home/CashierFolder');
    dispatchvalue({ type: 'HrFolder', value: 'OverAllQuickBillingFront' });
    dispatchvalue({ type: 'setPreviousFolder', value: null });
    dispatchvalue({ type: 'showMenu', value: true });
  };

  const HandleMovedatatobill = (params) => {
    if (params.ServiceProcedureForm === 'OP') {
      dispatchvalue({ type: 'OPConsultDetails', value: params });
      dispatchvalue({ type: 'OPBillingData', value: {} });
    } else {
      dispatchvalue({ type: 'OPBillingData', value: params });
      dispatchvalue({ type: 'OPConsultDetails', value: {} });
    }
    dispatchvalue({ type: 'IPBillingData', value: {} });
    navigate('/Home/CashierFolder');
    dispatchvalue({ type: 'HrFolder', value: 'QuickBillingCashier' });
    dispatchvalue({ type: 'setPreviousFolder', value: null });
    dispatchvalue({ type: 'showMenu', value: true });
  };

  const PatientOPRegisterColumns = useMemo(() => {
    if (searchOptions.SearchStatus === 'Paid') {
      return [
        { key: 'id', name: 'ID' },
        { key: 'Billing_Date', name: 'Date' },
        { key: 'PatientId', name: 'Patient Id' },
        { key: 'Patient_Name', name: 'Patient Name' },
        { key: 'PhoneNo', name: 'PhoneNo' },
        { key: 'Doctor_Name', name: 'Doctor Name' },
        { key: 'PatientCategory', name: 'Patient Category' },
        { key: 'Net_Amount', name: 'Net Amount' },
        { key: 'PaidAmount', name: 'Paid Amount' },
        { key: 'BalanceAmount', name: 'Balance Amount' },
        {
          key: 'Action',
          name: 'Action',
          renderCell: (params) => {
            const rowId = params.row.id;
            if (!rowId) {
              console.warn('Missing row id:', params.row);
              return <span>Invalid Row</span>;
            }
            const selectedOption = printOptions[rowId]?.option || 'Bill+Receipt';
            const copyType = printOptions[rowId]?.copyType || 'Duplicate';
            const handleChange = (e) => {
              const value = e.target.value;
              setPrintOptions((prev) => ({
                ...prev,
                [rowId]: { ...prev[rowId], option: value },
              }));
            };
            const handleCopyTypeChange = (e) => {
              const value = e.target.value;
              setPrintOptions((prev) => ({
                ...prev,
                [rowId]: { ...prev[rowId], copyType: value },
              }));
            };
            const handlePrint = () => {
              const selected = printOptions[rowId]?.option;
              if (selected === 'Select') {
                alert('Please select a valid print option.');
                return;
              }
              switch (selectedOption) {
                case 'Bill':
                  HandlePrintBill(params.row, copyType);
                  break;
                case 'Receipt':
                  HandlePrintReceipt(params.row, copyType);
                  break;
                case 'Bill+Receipt':
                  HandleBillPrintReceipt(params.row, copyType);
                  break;
                default:
                  alert('Invalid print option selected.');
              }
            };
            if (params.row.Bill_Status !== 'Paid') return 'No Action';
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
                <select
                  className="print_option_bill"
                  value={selectedOption}
                  onChange={handleChange}
                >
                  {['Select', 'Bill', 'Receipt', 'Bill+Receipt'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  className="RegisterForm_1_btns added_RegisterForm_1_btns"
                  onClick={handlePrint}
                  disabled={selectedOption === 'Select'}
                >
                  <PrintIcon className="check_box_clrr_cancell" />
                </button>
              </div>
            );
          },
        },
      ];
    } else if (searchOptions.SearchStatus === 'Due') {
      return [
        { key: 'id', name: 'ID' },
        { key: 'Billing_Date', name: 'Date' },
        { key: 'PatientId', name: 'Patient Id' },
        { key: 'Patient_Name', name: 'Patient Name' },
        { key: 'PhoneNo', name: 'PhoneNo' },
        { key: 'Doctor_Name', name: 'Doctor Name' },
        { key: 'PatientCategory', name: 'Patient Category' },
        { key: 'Net_Amount', name: 'Net Amount' },
        { key: 'PaidAmount', name: 'Paid Amount' },
        { key: 'BalanceAmount', name: 'Balance Amount' },
        {
          key: 'Action',
          name: 'Action',
          renderCell: (params) => {
            const rowId = params.row.id;
            if (!rowId) {
              console.warn('Missing row id:', params.row);
              return <span>Invalid Row</span>;
            }
            const selectedOption = printOptions[rowId]?.option || 'Select';
            const copyType = printOptions[rowId]?.copyType || 'Original';
            const handleChange = (e) => {
              const value = e.target.value;
              setPrintOptions((prev) => ({
                ...prev,
                [rowId]: { ...prev[rowId], option: value },
              }));
            };
            const handleCopyTypeChange = (e) => {
              const value = e.target.value;
              setPrintOptions((prev) => ({
                ...prev,
                [rowId]: { ...prev[rowId], copyType: value },
              }));
            };
            const handlePrint = () => {
              const selected = printOptions[rowId]?.option;
              if (!selected || selected === 'Select') {
                alert('Please select a valid print option.');
                return;
              }
              switch (selected) {
                case 'Bill':
                  HandlePrintBill(params.row, copyType);
                  break;
                case 'Receipt':
                  HandlePrintReceipt(params.row, copyType);
                  break;
                case 'Bill+Receipt':
                  HandleBillPrintReceipt(params.row, copyType);
                  break;
                default:
                  alert('Invalid print option selected.');
              }
            };
            if (params.row.Bill_Status !== 'Due') return 'No Action';
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
                <select
                  className="print_option_bill"
                  value={selectedOption}
                  onChange={handleChange}
                >
                  {['Select', 'Bill'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  className="RegisterForm_1_btns added_RegisterForm_1_btns"
                  onClick={handlePrint}
                  disabled={selectedOption === 'Select'}
                >
                  <PrintIcon className="check_box_clrr_cancell" />
                </button>
              </div>
            );
          },
        },
      ];
    } else {
      return [
        { key: 'id', name: 'ID' },
        { key: 'Date', name: 'Date' },
        { key: 'PatientId', name: 'Patient Id' },
        { key: 'Patient_Name', name: 'Patient Name' },
        { key: 'PhoneNo', name: 'PhoneNo' },
        { key: 'Doctor_ShortName', name: 'Doctor Name' },
        { key: 'PatientCategory', name: 'Patient Category' },
        { key: 'VisitPurpose', name: 'Visit Purpose' },
        { key: 'BillingType', name: 'Service Type' },
        {
          key: 'Action',
          name: 'Action',
          renderCell: (params) => {
            const rowId = params.row.id;
            if (!rowId) {
              console.warn('Missing row id:', params.row);
              return <span>Invalid Row</span>;
            }
            const selectedOption = printOptions[rowId]?.option || 'Select';
            const copyType = printOptions[rowId]?.copyType || 'Original';
            const handleChange = (e) => {
              const value = e.target.value;
              setPrintOptions((prev) => ({
                ...prev,
                [rowId]: { ...prev[rowId], option: value },
              }));
            };
            const handleCopyTypeChange = (e) => {
              const value = e.target.value;
              setPrintOptions((prev) => ({
                ...prev,
                [rowId]: { ...prev[rowId], copyType: value },
              }));
            };
            const handlePrint = () => {
              const selected = printOptions[rowId]?.option;
              if (!selected || selected === 'Select') {
                alert('Please select a valid print option.');
                return;
              }
              switch (selected) {
                case 'Bill':
                  HandlePrintBill(params.row, copyType);
                  break;
                case 'Receipt':
                  HandlePrintReceipt(params.row, copyType);
                  break;
                default:
                  alert('Invalid print option selected.');
              }
            };
            return params.row.Status === 'Pending' ||
              (params.row.Status === 'Request' && params.row.Date === TodayDate) ? (
              <Button className="cell_btn" onClick={() => HandleMovedatatobill(params.row)}>
                <ArrowForwardIcon className="check_box_clrr_cancell" />
              </Button>
            ) : params.row.Status === 'Paid' ? (
              <div className="Register_btn_con added_Register_btn_con">
                <select
                  className="print_option_bill"
                  value={selectedOption}
                  onChange={handleChange}
                >
                  {['Select', 'Bill', 'Receipt'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
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
                  disabled={selectedOption === 'Select'}
                >
                  <PrintIcon className="check_box_clrr_cancell" />
                </button>
              </div>
            ) : (
              'No Action'
            );
          },
        },
      ];
    }
  }, [searchOptions.SearchStatus, printOptions, TodayDate]);

  const HandlePrintBill = (params, CopyType) => {

    const createdAt = params?.created_at || "";

    const dateObj = new Date(createdAt);

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const InvoiceDate = `${day}-${month}-${year}`;

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const InvoiceTime = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

      console.log("InvoiceDate:", InvoiceDate);
      console.log("InvoiceTime:", InvoiceTime);


    


    setBillCopyType(CopyType);
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
    });
    setPostInvoice(params?.id);
    setSelectDatalist(params?.Billing_Items);
    setBillingData({
      DoctorName: params?.Doctor_Name,
      DoctorId: params?.Doctor_Id,
      InvoiceNo: params?.id,
      InvoiceDate :InvoiceDate,
      InvoiceTime: InvoiceTime,
            Billedby : params?.Billedby

    });
    setPrintView('bill');
  };

  const HandlePrintReceipt = (params, CopyType) => {
 
    const createdAt = params?.created_at || "";

// Convert string to Date object
const dateObj = new Date(createdAt);

// Extract date in DD-MM-YYYY
const day = String(dateObj.getDate()).padStart(2, "0");
const month = String(dateObj.getMonth() + 1).padStart(2, "0");
const year = dateObj.getFullYear();
const InvoiceDate = `${day}-${month}-${year}`;

// Extract time in hh:mm:ss AM/PM
let hours = dateObj.getHours();
const minutes = String(dateObj.getMinutes()).padStart(2, "0");
const seconds = String(dateObj.getSeconds()).padStart(2, "0");
const ampm = hours >= 12 ? "PM" : "AM";
hours = hours % 12 || 12; // Convert to 12-hour format
const InvoiceTime = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

      console.log("InvoiceDate:", InvoiceDate);
      console.log("InvoiceTime:", InvoiceTime);


    setBillCopyType(CopyType);
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
    });
    setPostInvoice(params?.id);
    setReceiptInvoice(params?.reciept_no);
    setSelectDatalist(params?.Billing_Items);
    setBillingData({
      DoctorName: params?.Doctor_Name,
      DoctorId: params?.Doctor_Id,
      InvoiceNo: params?.id,
      InvoiceDate : InvoiceDate,
      InvoiceTime : InvoiceTime,
            Billedby : params?.Billedby


    });
    setBillAmount(params?.Payment_Details);
    setinitialState((prevState) => ({
      ...prevState,
      totalItems: SelectDatalist.length,
      totalUnits: params?.TotalItems,
      totalDiscount: params?.TotalDiscount,
      PaidAmount: params?.PaidAmount,
      PaidNetAmount: params?.PaidNetAmount,
      totalNetAmount: params?.Net_Amount,
      TotalAmount: params?.TotalAmount,
    }));
    setPrintView('receipt');
  };

  const HandleBillPrintReceipt = (params, CopyType) => {
    const createdAt = params?.created_at || "";

    const dateObj = new Date(createdAt);

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const InvoiceDate = `${day}-${month}-${year}`;

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const InvoiceTime = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

      console.log("InvoiceDate:", InvoiceDate);
      console.log("InvoiceTime:", InvoiceTime);


    setBillCopyType(CopyType);
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
    });
    setPostInvoice(params?.id);
    setReceiptInvoice(params?.reciept_no);
    setSelectDatalist(params?.Billing_Items);
    setBillingData({
      DoctorName: params?.Doctor_Name,
      DoctorId: params?.Doctor_Id,
      InvoiceNo: params?.id,
      InvoiceDate : InvoiceDate,
      InvoiceTime : InvoiceTime,
      Billedby : params?.Billedby

      
    });
    setBillAmount(params?.Payment_Details);
    setinitialState((prevState) => ({
      ...prevState,
      totalItems: SelectDatalist.length,
      totalUnits: params?.TotalItems,
      totalDiscount: params?.TotalDiscount,
      PaidAmount: params?.PaidAmount,
      PaidNetAmount: params?.PaidNetAmount,
      totalNetAmount: params?.Net_Amount,
      TotalAmount: params?.TotalAmount,
    }));
    setPrintView('Billreceipt');
  };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: async () => {
      navigate('/Home/CashierFolder');
      dispatchvalue({ type: 'HrFolder', value: 'GeneralBillingList' });
      dispatchvalue({ type: 'setPreviousFolder', value: null });
      dispatchvalue({ type: 'showMenu', value: true });
    },
  });

  const handlePrintClose = () => {
    setPrintView(null);
    navigate('/Home/CashierFolder');
    dispatchvalue({ type: 'HrFolder', value: 'GeneralBillingListCashier' });
    dispatchvalue({ type: 'setPreviousFolder', value: null });
    dispatchvalue({ type: 'showMenu', value: true });
  };

  return (
    <>
      {printView === null ? (
        <div className="Main_container_app">
          <h3>Billing Queue List</h3>
          <div className="search_div_bar" style={{ width: '100%' }}>
            <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
              <div className="RegisForm_1">
                <label>OPDR No<span>:</span></label>
                <input
                  type="text"
                  name="OpdrNo"
                  list="opdrNumbers"
                  value={SearchQuery.OpdrNo}
                  onChange={handleSearchChange}
                  placeholder="Select or type OPDR No"
                />
                <datalist id="opdrNumbers">
                  {OpdrNumbers.map((opdr, index) => (
                    <option key={index} value={opdr} />
                  ))}
                </datalist>
              </div>
              <div className="RegisForm_1">
                <label>Date Type<span>:</span></label>
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
              {searchOptions.DateType === 'Current' && (
                <div className="RegisForm_1">
                  <label>Current Date<span>:</span></label>
                  <input
                    type="date"
                    name="CurrentDate"
                    value={searchOptions.CurrentDate}
                    onChange={HandleOnchangeSearch}
                    readOnly
                  />
                </div>
              )}
              {searchOptions.DateType === 'Customize' && (
                <>
                  <div className="RegisForm_1">
                    <label>From Date<span>:</span></label>
                    <input
                      type="date"
                      name="FromDate"
                      value={searchOptions.FromDate}
                      onChange={HandleOnchangeSearch}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label>To Date<span>:</span></label>
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
                <label htmlFor="input">Name/PhoneNo<span>:</span></label>
                <input
                  type="text"
                  name="SearchbyFirstName"
                  value={searchOptions.SearchbyFirstName}
                  onChange={HandleOnchangeSearch}
                />
              </div>
              <div className="RegisForm_1">
                <label htmlFor="input">Status<span>:</span></label>
                <select
                  name="SearchStatus"
                  value={searchOptions.SearchStatus}
                  onChange={HandleOnchangeSearch}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Due">Due</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <button
                className="search_div_bar_btn_1"
                onClick={handlenewDocRegister}
                title="New Doctor Register"
              >
                <LoupeIcon />
              </button>
            </div>
            <ReactGrid columns={PatientOPRegisterColumns} RowData={Filterdata} />
          </div>
          <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
      ) : printView === 'bill' ? (
        <ForPrintBill
          ClinicDetails={ClinicDetails}
          ClinicDetials={ClinicDetials}
          SelectedPatient_list={SelectedPatient_list}
          OP_BillingData={OP_BillingData}
          RegisterData={RegisterData}
          PostInvoice={PostInvoice}
          BillingData={BillingData}
          SelectDatalist={SelectDatalist}
          handleClose={handlePrintClose}
          componentRef={componentRef}
          handlePrint2={handlePrint2}
          BillCopyType={BillCopyType}
        />
      ) : printView === 'receipt' ? (
        <ForPrintReceipt
          ClinicDetails={ClinicDetails}
          ClinicDetials={ClinicDetials}
          SelectedPatient_list={SelectedPatient_list}
          OP_BillingData={OP_BillingData}
          RegisterData={RegisterData}
          PostInvoice={PostInvoice}
          ReceiptInvoice={ReceiptInvoice}
          BillingData={BillingData}
          billAmount={billAmount}
          initialState={initialState}
          UserData={UserData}
          SelectDatalist={SelectDatalist}
          handleClose={handlePrintClose}
          componentRef={componentRef}
          BillCopyType={BillCopyType}
        />
      ) : printView === 'Billreceipt' ? (
        <ForPrintBillReceipt
          ClinicDetails={ClinicDetails}
          ClinicDetials={ClinicDetials}
          SelectedPatient_list={SelectedPatient_list}
          OP_BillingData={OP_BillingData}
          RegisterData={RegisterData}
          PostInvoice={PostInvoice}
          ReceiptInvoice={ReceiptInvoice}
          BillingData={BillingData}
          billAmount={billAmount}
          initialState={initialState}
          UserData={UserData}
          SelectDatalist={SelectDatalist}
          handlePrint={handlePrint2}
          handleClose={handlePrintClose}
          componentRef={componentRef}
          BillCopyType={BillCopyType}
        />
      ) : null}
    </>
  );
};

export default GeneralBillingList;