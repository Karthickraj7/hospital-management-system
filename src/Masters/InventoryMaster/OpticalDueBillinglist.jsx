import * as React from "react";
import { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LoupeIcon from "@mui/icons-material/Loupe";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import PrintIcon from '@mui/icons-material/Print';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useReactToPrint } from "react-to-print";

const OpticalDueBillinglist = () => {
  const componentRef = useRef();
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const navigate = useNavigate();

  const [SearchQuery, setSearchQuery] = useState({
    searchBy: "",
    Status: "Pending"
  });
  const toast = useSelector(state => state.userRecord?.toast);
  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  const [Prescription_Patient_list, setPrescription_Patient_list] = useState(
    []
  );
  console.log('todayy', TodayDate);

  const [searchOptions, setSearchOptions] = useState({
    DateType: 'Current',
    CurrentDate: TodayDate,
    FromDate: '',
    ToDate: '',
    SearchbyFirstName: '',
    SearchbySpeciality: '',
    SearchbyDoctor: '',
    SearchTimeOrderby: '',
    SearchStatus: 'Due'
  })
  const [printView, setPrintView] = useState(null);


  const [Filterdata, setFilterdata] = useState([])

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
    }
    else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRequestEdit1 = (params) => {
    if (!params) {
      console.error("Invalid params:", params);
      return;
    }

    console.log("params", params);

    // Extracting values from params
    const { PatientId, VisitID, PatientName, DoctorName, Doctorid } = params;

    dispatchvalue({
      type: "Selected_Patient_Pharmacy",
      value: {
        PatientID: PatientId,
        VisitID: VisitID,
        Patient_Name: PatientName,
        Doctor_name: DoctorName,
        Doctorid: Doctorid,
        type: "OP",
        Department: 2,
        Edit: true,
        ...params, // Spread all other params to keep additional values
      },
    });

    navigate("/Home/InventoryMaster");
    dispatchvalue({ type: "HrFolder", value: "OpticalDueBilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}DrugAdminstrations/Optical_Pharmacy_Due_Billing_link`, {
        params: { ...searchOptions, location: userRecord?.location }
      })
      .then((response) => {
        console.log('232332323', response.data);

        const Datas = Array.isArray(response.data) ? response.data : [];
        setFilterdata(Datas);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [userRecord, UrlLink, searchOptions]);



  const handlePharmacybilling = () => {
    dispatchvalue({
      type: "Selected_Patient_Pharmacy",
      value: {

        type: "OP",
        Department: 2,
      },
    });

    navigate('/Home/Pharmacy')
    dispatchvalue({ type: 'HrFolder', value: 'OPPharmacyBillingnew' });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const UserRegisterColumns = [
    {
      key: "id",
      name: "S No",
      filter: true,
      frozen: true,
    },
    {
      key: "Patient_Name",
      name: "Patient Name",
      filter: true,
      frozen: true,
    },
    {
      key: "PhoneNo",
      name: "Contact Number",
      frozen: true,
    },
    {
      key: "Doctor_Name",
      name: "Doctor Name",
      frozen: true,
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
          <Button
            className="cell_btn"
            onClick={() => handleRequestEdit1(params.row)}
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        )
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
      navigate("/Home/Pharmacy");
      dispatchvalue({ type: "HrFolder", value: "PharmacyBillingLIst" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });


  const handlePrintClose = () => {
    setPrintView(null);
    navigate("/Home/Pharmacy");
    dispatchvalue({ type: "HrFolder", value: "PharmacyBillingLIst" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  }

  return (
    <>
      {printView === null ? (
        <div className="Main_container_app">
          <h3>Optical Due Billing List</h3>
          <div className="search_div_bar">
            <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
              <div className="RegisForm_1">
                <label>Date Type<span>:</span></label>
                <select
                  name="DateType"
                  value={searchOptions.DateType}
                  onChange={HandleOnchangeSearch}
                >
                  <option value="Current">Current Date</option>
                  <option value="Customize">Customize</option>
                </select>
              </div>

              {searchOptions.DateType === "Current" ? (
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
              ) : (
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
                <label htmlFor="input">Name/PhoneNo/Billno<span>:</span></label>
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
                  <option value="Due">Due</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* <button
                className="search_div_bar_btn_1"
                onClick={handlePharmacybilling}
                title="New Doctor Register"
              >
                <LoupeIcon />
              </button> */}
            </div>

            {/* Table with Patient Data */}
            <ReactGrid columns={UserRegisterColumns}
              RowData={Filterdata} />
          </div>

          {/* Toast Notification */}
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
export default OpticalDueBillinglist;