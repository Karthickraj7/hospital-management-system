import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import LoupeIcon from "@mui/icons-material/Loupe";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrintIcon from '@mui/icons-material/Print';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useReactToPrint } from "react-to-print";

const IPBillingDueList = () => {
  const componentRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [Filterdata, setFilterdata] = useState([]);
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
    DateType: 'Current',
    CurrentDate: TodayDate,
    FromDate: '',
    ToDate: '',
    // Paymentmode:'',
    SearchbyFirstName: '',
    SearchbySpeciality: '',
    SearchbyDoctor: '',
    SearchTimeOrderby: '',
    SearchStatus: 'Due'
  })

  const [printView, setPrintView] = useState(null); // 'bill' | 'receipt' | null

  useEffect(() => {
    axios.get(`${UrlLink}Frontoffice/IPBilling_Due_Link`, { params: { ...searchOptions, location: UserData?.location } })
      .then((res) => {
        const ress = res.data;

        if (Array.isArray(ress)) {
          console.log('billllll', ress);

          setFilterdata(ress);
        } else {
          setFilterdata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchOptions, UserData?.location]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


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
    dispatchvalue({ type: "IPBillingData", value: { type: 'IP' } });
    dispatchvalue({ type: "OPBillingData", value: {} });

    navigate('/Home/CashierFolder');
    dispatchvalue({ type: 'HrFolder', value: 'OverAllQuickBilling' });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });


  };

  const PatientOPRegisterColumns = [
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
      key: "ward",
      name: "Ward/Room",
    },
    {
      key: "Doctor_Name",
      name: "Doctor Name",
    },
    {
      key: "PatientCategory",
      name: "Patient Category",
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
        return params.row.Bill_Status === "Due" ? (
          <Button
            className="cell_btn"
            onClick={() => HandleMovedatatobill(params.row)}
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        ) : params.row.Status === 'Paid' ? (
          <>
            <Button
              className="cell_btn"
              onClick={() => HandlePrintBill(params.row)}
            >
              <PrintIcon className="check_box_clrr_cancell" />
            </Button>
            <Button
              className="cell_btn"
              onClick={() => HandlePrintReceipt(params.row)}
            >
              <ReceiptIcon className="check_box_clrr_cancell" />
            </Button>
          </>
        ) : 'No Action'
      },
    },
  ];


  const HandlePrintBill = () => {
    setPrintView("bill"); // Show Bill Print View
  };

  const HandlePrintReceipt = () => {
    setPrintView("receipt"); // Show Receipt Print View
  };



  const ForPrintBill = () => {
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
          <h3>Billlll Summaaaa</h3>
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
  const ForPrintReceipt = () => {
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
          <h3>Receipt Summaaaa</h3>
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
      navigate("/Home/CashierFolder");
      dispatchvalue({ type: "HrFolder", value: "GeneralBillingList" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });

  const handlePrintClose = () => {
    setPrintView(null);
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "GeneralBillingListCashier" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  }


  const HandleMovedatatobill = (params) => {
    console.log('IPBillingData', params);

    dispatchvalue({ type: "IPBillingData", value: params });
    dispatchvalue({ type: "OPBillingData", value: {} });

    navigate('/Home/CashierFolder');
    dispatchvalue({ type: 'HrFolder', value: 'IPBillingDue' });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });

  };

  return (
    <>
      {printView === null ? (
        <div className="Main_container_app">
          <h3>IP Billing Due Queue List</h3>
          <div className="RegisFormcon_1" style={{ marginBottom: '10px' }}>
            <div className="RegisForm_1">
              <label>Date Type<span>:</span></label>
              <select
                name="DateType"
                value={searchOptions.DateType}
                onChange={HandleOnchangeSearch}
              >
                <option value='All'>All</option>
                <option value="Current">Current Date</option>
                <option value="Customize">Customize</option>
              </select>
            </div>

            {searchOptions.DateType === 'Current' && (
              <div className="RegisForm_1">
                  <label>Current Date<span>:</span></label>
                  <input
                      type='date'
                      name='CurrentDate'
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
                            type='date'
                            name='FromDate'
                            value={searchOptions.FromDate}
                            onChange={HandleOnchangeSearch}
                        />

                    </div>

                    <div className="RegisForm_1">
                        <label>To Date<span>:</span></label>
                        <input
                            type='date'
                            name='ToDate'
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
          <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
      ) : printView === "bill" ? (
        <ForPrintBill onClose={() => setPrintView(null)} />
      ) : (
        <ForPrintReceipt onClose={() => setPrintView(null)} />
      )}
    </>
  );
};

export default IPBillingDueList;
