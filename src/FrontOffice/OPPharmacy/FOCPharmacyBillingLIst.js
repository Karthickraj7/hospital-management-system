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
const FOCPharmacyBillingLIst = () => {
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
  const [searchOptions, setSearchOptions] = useState({
    DateType: 'Current',
    CurrentDate: TodayDate,
    FromDate: '',
    ToDate: '',
    SearchbyFirstName: '',
    SearchbySpeciality: '',
    SearchbyDoctor: '',
    SearchTimeOrderby: '',
    SearchStatus: 'Pending'
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
        type: "FOC",
        Department: 2,
        Edit: true,
        ...params, // Spread all other params to keep additional values
      },
    });
  
    navigate("/Home/Pharmacy");
    dispatchvalue({ type: "HrFolder", value: "OPPharmacyBillingnew" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };


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

      const [isLoading, setIsLoading] = useState(false);
    


   useEffect(() => {
      setIsLoading(true);
      axios.get(`${UrlLink}Masters/Clinic_Detials_link`)
        .then((res) => {
          const clinic = res.data[0];
          if (clinic) {
            const address = [clinic.DoorNo, clinic.Area].filter(Boolean).join(", ");
            setClinicDetials({
              ClinicName: clinic.Clinic_Name || "",
              ClinicAddress: address,
              ClinicGST: clinic.GSTNo || "",
              ClinicCity: clinic.City || "",
              ClinicState: clinic.State || "",
              ClinicCode: clinic.Pincode || "",
              ClinicMobileNo: clinic.PhoneNo || "",
              ClinicLandLineNo: clinic.LandlineNo || "",
              ClinicMailID: clinic.Mail || "",
            });
          }
        })
        .catch((err) => {
          console.error("Clinic fetch error:", err);
          setError("Failed to fetch clinic details");
        })
        .finally(() => setIsLoading(false));
    }, [UrlLink]);

    const [BillData, setBillData] = useState(null);
      const [error, setError] = useState(null);

      const numberToWords = (num) => {
    if (!num || isNaN(num)) return "Zero";
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
      return "";
    };
    if (num.toString().length > 9) return "Overflow";
    const n = ("000000000" + num).substr(-9).match(/(\d{2})(\d{2})(\d{2})(\d{3})/);
    if (!n) return "";
    let str = "";
    str += n[1] != 0 ? inWords(Number(n[1])) + " Crore " : "";
    str += n[2] != 0 ? inWords(Number(n[2])) + " Lakh " : "";
    str += n[3] != 0 ? inWords(Number(n[3])) + " Thousand " : "";
    str += n[4] != 0 ? inWords(Number(n[4])) : "";
    return str.trim();
  };
    
  
  
  // useEffect(() => {
  //   axios
  //     .get(`${UrlLink}DrugAdminstrations/inhouse_pharmacy_queue_list_prescrib`, {
  //       params: { ...searchOptions, location: userRecord?.location, type:'FOC' }
  //     })
  //     .then((response) => {
  //       console.log('232332323', response.data);

  //       const Datas = Array.isArray(response.data) ? response.data : [];
  //       setFilterdata(Datas);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, [userRecord, UrlLink, searchOptions]);

  useEffect(() => {
    const endpoint =
  searchOptions.SearchStatus === "Paid"
    ? `${UrlLink}DrugAdminstrations/fetch_ip_pharmacy_billing`
    : searchOptions.SearchStatus === "Due"
    ? `${UrlLink}DrugAdminstrations/fetch_due_ip_pharmacy_billing_for_FOC`
    : `${UrlLink}DrugAdminstrations/inhouse_pharmacy_queue_list_prescrib`;


    axios.get(endpoint, { params: { ...searchOptions, location: userRecord?.location, type: "IP" } })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const mappedData = data.map((bill, index) => ({
          ...bill,
          id: bill.id || index + 1,
          Date: formatDate(bill.BillingDate || new Date()),
          PatientId: bill.PatientId || "",
          VisitId: bill.VisitId || "",
          Items: bill.Items || [],
          Status: bill.Status || "Pending",
          Doctor_name: bill.DoctorName || "",
          PatientName: bill.PatientName || "",
          PatientPhoneNo: bill.PatientPhoneNo || "",
          NetAmount: bill.NetAmount || 0,
          Receipt: bill.Receipt || {},
        }));
        const fdata = mappedData.filter((i)=> i.BillingType === "FREE PHARMACY")
        setFilterdata(fdata);
      })
      .catch((err) => {
        console.error("IP Billing fetch error:", err);
      })
  }, [UrlLink, userRecord, searchOptions]);


  const handlePharmacybilling = () => {
    dispatchvalue({
      type: "Selected_Patient_Pharmacy",
      value: {

        type: "FOC",
        Department: 4,
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
      key: "Date",
      name: "Date",
      filter: true,
      frozen: true,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      filter: true,
      frozen: true,
    },
    {
      key: "PatientPhoneNo",
      name: "Contact Number",
      frozen: true,
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
      frozen: true,
    },
    {
      key: 'PatientCategory',
      name: 'Patient Category',
    },
    {
  key: "Action",
  name: "Action",
  renderCell: (params) => {
    if ((params.row.Status === "Pending" || params.row.Status === "Request") && params.row.Date === TodayDate) {
      return (
        <Button className="cell_btn" onClick={() => handleRequestEdit1(params.row)}>
          <ArrowForwardIcon className="check_box_clrr_cancell" />
        </Button>
      );
    } else if (params.row.Status === "Paid") {
      return (
        <>
          <Button className="cell_btn" onClick={() => HandlePrintBill(params.row)}>
            <PrintIcon className="check_box_clrr_cancell" />
          </Button>
          <Button className="cell_btn" onClick={() => HandlePrintReceipt(params.row)}>
            <ReceiptIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      );
    } else if (params.row.Status === "Due") {
      return (
        <Button className="cell_btn" onClick={() => handleBillView(params.row)}>
          <PrintIcon />
        </Button>
      );
    } else {
      return "No Action";
    }
  },
}

   
  ];

  const HandlePrintBill = () => {
    setPrintView("bill"); // Show Bill Print View
  };

  const HandlePrintReceipt = () => {
    setPrintView("receipt"); // Show Receipt Print View
  };


   const handleBillView = (bill) => {
    if (!bill || !bill.Items || bill.Items.length === 0) {
      setError("No bill found for this patient or no items available.");
      setPrintView(null);
      setBillData(null);
      return;
    }
    setBillData(bill);
    setPrintView("bill");
    setError(null);
  };

  const ForPrintBill = () => {
    if (!BillData || !BillData.Items || BillData.Items.length === 0) {
      return (
        <div className="dotmatrix-container">
          <p>{error || "No bill data available."}</p>
          <button onClick={handlePrintClose}>Close</button>
        </div>
      );
    }

    const grossAmount = BillData.Items.reduce(
      (sum, item) => sum + (item.Quantity * item.UnitPrice || item.Total || 0),
      0
    );
    const gstAmount = BillData.Items.reduce(
      (sum, item) => sum + (item.GSTAmount || 0),
      0
    );
    const discount = BillData.Items.reduce(
      (sum, item) => sum + (item.Cash_Discount || 0),
      0
    );
    const netAmount = BillData.NetAmount || grossAmount - discount + gstAmount;

    const summary = {
      Amount: grossAmount.toFixed(2),
      GST: gstAmount.toFixed(2),
      Discount: discount.toFixed(2),
      totalAmount: netAmount.toFixed(2),
      totalAmountt: Math.round(netAmount),
    };

    return (
      <div className="dotmatrix-container">
        <div ref={componentRef} className="dotmatrix-wrapper">
          <table className="dotmatrix-table">
            <thead>
              {/* Header */}
              <tr>
                <td colSpan="10" className="dotmatrix-header">
                  <div className="dotmatrix-header-content">
                    <div className="dotmatrix-clinic-info">
                      <span>{ClinicDetials?.ClinicName || "KARUNA MEDICAL COLLEGE HOSPITAL"}</span>
                      <br />
                      <br />
                      <div>
                        {[ClinicDetials?.ClinicAddress].filter(Boolean).join(", ")} ,{" "}
                        {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                      {/* <div>
                      {[ClinicDetials?.ClinicMobileNo, ClinicDetials?.ClinicLandLineNo, ClinicDetials?.ClinicMailID]
                        .filter(Boolean)
                        .join(" , ")}
                    </div> */}
                    </div>
                  </div>
                </td>
              </tr>

              {/* Title */}
              <tr>
                <td colSpan="10" className="dotmatrix-bill-title">
                  Foc Pharmacy Billing
                </td>
              </tr>

              {/* Patient Info */}
              <tr>
                <td colSpan="10">
                  <div className="dotmatrix-separator" />
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td className="label">Patient Name</td>
                        <td className="value">: {BillData.PatientName}</td>
                        <td className="label">Invoice No</td>
                        <td className="value">: {BillData?.id}</td>

                      </tr>
                      <tr>
                        <td className="label">Patient ID</td>
                        <td className="value">: {BillData.PatientId}</td>
                        <td className="label">GSTIN No</td>
                        <td className="value">: {ClinicDetials.ClinicGST}</td>
                      </tr>
                      <tr>
                        <td className="label">Register Id</td>
                        <td className="value">
                          : {BillData?.RegisterId}
                        </td>
                        <td className="label">Drug Lisence No</td>
                        <td className="value" >: KLK-PKD-09/055 | KL-PKD-09/056</td>
                      </tr>

                      <tr>
                        <td className="label">Age / Gender</td>
                        <td className="value">
                          : {BillData.Age} / {BillData.Gender}
                        </td>
                        <td className="label">Date</td>
                        <td className="value">: {BillData?.CreatedAt || BillData.BillingDate}</td>
                      </tr>
                      <tr>
                        <td className="label">Doctor Name</td>
                        <td className="value">: {BillData.Doctor_name || BillData.DoctorName}</td>
                        <td className="label">Patient Ph No</td>
                        <td className="value">: {BillData.PatientPhoneNo}</td>
                      </tr>

                      <tr>

                        <td className="label">Bill Status</td>
                        <td className="value">: {BillData?.Status}</td>
                        <td className="label">Patient Category</td>
                        <td className="value">: {BillData?.PatientCategory}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </thead>

            {/* Medicines */}
            <tbody>
              <tr>
                <td colSpan="10">
                  <div className="dotmatrix-separator" />
                  <table className="dotmatrix-inner-table">
                    <thead>
                      <tr className="item-header">
                        <th>S.No</th>
                        <tr className="item-header-left">
                          <th>Item</th>
                        </tr>
                        <th>Batch</th>
                        <th>Exp</th>
                        <th>Qty</th>
                        <th style={{ textAlign: "center" }}>Rate</th>
                        <th style={{ textAlign: "center" }}>MRP</th>
                        {/* <th>Disc</th>
                      <th>GST</th> */}
                        <th style={{ textAlign: "center" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BillData?.Items?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <tr className="item-header-left">
                            <td>{item.ItemName}</td>
                          </tr>
                          <td>{item.BatchNo}</td>
                          <td>{item.ExpDate}</td>
                          <td>{item.Quantity}</td>
                          <td style={{ textAlign: "right" }}>{item.UnitPrice}</td>
                          <td style={{ textAlign: "right" }}>{item.Total}</td>
                          {/* <td>
                          {item.CD_Method === "Percentage"
                            ? `${item.Cash_Discount}%`
                            : item.CD_Method === "Cash"
                            ? `Rs. ${item.Cash_Discount}`
                            : "No"}
                        </td>
                        <td>{item.GSTAmount || 0}</td> */}
                          <td className="dotmatrix-align-right" style={{ textAlign: "right" }}>
                            {item.Total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="dotmatrix-separator" />
                </td>
              </tr>
            </tbody>

            {/* Totals */}
            <tfoot>
              <tr>
                <td colSpan="10">
                  <table className="totals-table">
                    <tbody>
                      <tr>
                        <td className="pharm-label">Amount In Words</td>
                        <td className="pharm-value">: {numberToWords(+summary.totalAmountt)}</td>
                        <td className="pharm-label-right">GST</td>
                        <td className="pharm-value-right">: {summary.GST}</td>
                      </tr>
                      <tr>
                        <td className="pharm-label">Billed By</td>
                        <td className="pharm-value">: {BillData?.Billed_By}</td>
                       <td className="pharm-label-right">Gross Amount</td>
                        <td className="pharm-value-right">: {summary.Amount}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                         <td className="pharm-label-right">Net Amount</td>
                        <td className="pharm-value-right">: {summary.totalAmount}</td>
                        
                      </tr>
                    </tbody>
                  </table>

                  <div className="dotmatrix-separator" />
                  <div className="dotmatrix-footer-note">
                    Medicine refund is possible within 7 days of its original bill.
                  </div>
                  <div className="dotmatrix-footer-note">
                    Medicines/injections needs cold storage, once sold cannot be taken back.
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="dotmatrix-buttons">
          <button onClick={handlePrint2}>Print</button>
          <button onClick={handlePrintClose}>Close</button>
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
    // navigate("/Home/Pharmacy");
    // dispatchvalue({ type: "HrFolder", value: "PharmacyBillingLIst" });
    // dispatchvalue({ type: "setPreviousFolder", value: null });
    // dispatchvalue({ type: "showMenu", value: true });
  }

  return (
    <>
      {/* <div className="Main_container_app">
        <h3>OP Pharmacy Billing List</h3>
        <br />
        <div className="search_div_bar ">
          <div className="search_div_bar_inp_1">
            <label htmlFor="input">
              Patient Name <span>:</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter the Patient Name"
            />
          </div>
          <button className="search_div_bar_btn_1" type="submit">
            <SearchIcon />
          </button>
          <button
            type="submit"
            onClick={() => handlePharmacybilling()}
            title="Manual Billing"
            className="search_div_bar_btn_1"
          >
            <LoupeIcon />
          </button>
        </div>
        <ReactGrid
          columns={UserRegisterColumns}
          RowData={Prescription_Patient_list}
        />
      </div> */}

      {printView === null ? (
        <div className="Main_container_app">
          <h3>FOC Pharmacy Billing List</h3>
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
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Due">Due</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <button
                className="search_div_bar_btn_1"
                onClick={handlePharmacybilling}
                title="New Doctor Register"  style={{backgroundColor:'grey',color:'white',maxWidth:'200px'}}
              >
                <LoupeIcon />
              </button>
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
export default FOCPharmacyBillingLIst;
