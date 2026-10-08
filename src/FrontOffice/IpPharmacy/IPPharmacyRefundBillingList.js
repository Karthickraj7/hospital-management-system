import * as React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrintIcon from '@mui/icons-material/Print';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { useReactToPrint } from "react-to-print";
import Tooltip from '@mui/material/Tooltip';
import { NumberToWords } from "../../OtherComponent/OtherFunctions";
import VisibilityIcon from "@mui/icons-material/Visibility";




const IPPharmacyRefundBillingList = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector(state => state.userRecord?.toast);




  

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };
  const [TodayDate] = useState(formatDate(new Date()));

  // const [searchOptions, setSearchOptions] = useState({
  //   DateType: 'Current',
  //   CurrentDate: TodayDate,
  //   FromDate: '',
  //   ToDate: '',
  //   SearchbyFirstName: '',
  //   SearchbySpeciality: '',
  //   SearchbyDoctor: '',
  //   SearchTimeOrderby: '',
  //   SearchStatus: '',
  //   Pharma_Type:'IP PHARMACY',
  //   SearchProd: '',
  //   PatientId :"",
  // });
  const savedFilters = useSelector(
    (state) => state.userRecord?.ipPharmacyRefundFilters
  );
  const [searchOptions, setSearchOptions] = useState(
    savedFilters || {
     DateType: 'Current',
    CurrentDate: TodayDate,
    FromDate: '',
    ToDate: '',
    SearchbyFirstName: '',
    SearchbySpeciality: '',
    SearchbyDoctor: '',
    SearchTimeOrderby: '',
    SearchStatus: '',
    Pharma_Type:'IP PHARMACY',
    SearchProd: '',
    PatientId :"",
    }
  );

  const defaultFilters = {
 DateType: 'Current',
    CurrentDate: TodayDate,
    FromDate: '',
    ToDate: '',
    SearchbyFirstName: '',
    SearchbySpeciality: '',
    SearchbyDoctor: '',
    SearchTimeOrderby: '',
    SearchStatus: '',
    Pharma_Type:'IP PHARMACY',
    SearchProd: '',
    PatientId :"",
};

  const handleClearFilters = () => {
  setSearchOptions(defaultFilters);
  dispatch({ type: "CLEAR_IP_REFUND_FILTERS" });
};


  const [Filterdata, setFilterdata] = useState([]);
  const [printView, setPrintView] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

 const HandleOnchangeSearch = (e) => {
  const { name, value } = e.target;

  setSearchOptions((prev) => {
    let updated;

    if (name === 'DateType') {
      if (value === 'Current') {
        updated = {
          ...prev,
          DateType: value,
          CurrentDate: TodayDate,
          FromDate: '',
          ToDate: '',
        };
      } else {
        updated = {
          ...prev,
          DateType: value,
          CurrentDate: '',
        };
      }
    } 
    else if (
      name === "id" ||
      name === "SearchbyFirstName" ||
      name === "SearchbyPhoneNumber" ||
      name === "PatientId" ||
      name === "RegisterId"
    ) {
      updated = {
        ...prev,
        [name]: value,
      };
    } 
    else {
      updated = {
        ...prev,
        [name]: value,
      };
    }

    // 🔹 Save updated filters to Redux
    dispatch({
      type: "SET_IP_REFUND_FILTERS",
      value: updated,
    });

    return updated;
  });
};

 
  // const HandleOnchangeSearch = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'DateType') {
  //     if (value === 'Current') {
  //       setSearchOptions(prev => ({ ...prev, DateType: value, CurrentDate: TodayDate, FromDate: '', ToDate: '' }));
  //     }
  //      else {
  //       setSearchOptions(prev => ({ ...prev, DateType: value, CurrentDate: '' }));
  //     } 
  //   }
  //   else if (
  //   name ==="id" ||
  //   name === "SearchbyFirstName" ||
  //   name === "SearchbyPhoneNumber" ||
  //   name === "PatientId" ||
  //   name === "RegisterId"

    
  // ) {
  //   setSearchOptions((prev) => ({ ...prev, [name]: value }));
  // } else {
  //     setSearchOptions(prev => ({ ...prev, [name]: value }));
  //   }
  
  //    dispatch({
  //     type: "SET_IP_REFUND_FILTERS",
  //     value: updated,
  //   });

  //   return updated;
    
  // };

  // Fetch bills
  useEffect(() => {

    if (searchOptions.SearchStatus == 'Refunded') {

      axios.get(`${UrlLink}DrugAdminstrations/fetch_ip_pharmacy_refund_billing`, {
        params: { ...searchOptions, location: userRecord?.location }
      })
        .then((res) => {
          let data = Array.isArray(res.data.ip_pharmacy_refund_bills) ? res.data.ip_pharmacy_refund_bills : []
          data = data.filter((item) => item.Billing_Type !== "FREE PHARMACY");
          data = data.map((item, idx) => {
            item.S_No = idx + 1;
            return item;
          });

          setFilterdata(data)
        })
        .catch(err => console.error(err));
    }

    else {
      axios.get(`${UrlLink}DrugAdminstrations/IP_Pharmacy_Refund_Billing_link`, {
        params: { ...searchOptions, location: userRecord?.location }
      })
        // .then((res) => setFilterdata(Array.isArray(res.data) ? res.data : []))
        .then((res) => {
          let data = Array.isArray(res.data) ? res.data : []
          data = data.filter((item) => item.Billing_Type !== "FREE PHARMACY");
          data = data.map((item, idx) => {
            item.S_No = idx + 1;
            return item;
          });

          setFilterdata(data)
        })
        .catch(err => console.error(err));
    }
  }, [searchOptions, UrlLink, userRecord]);

  const handleRequestEdit1 = (row) => {
    if (!row) return;

    console.log(row.PharmacyType,'row.PharmacyType')

    if(row.PharmacyType === 'IPPharmacy'){

      dispatch({
      type: "Selected_Patient_Pharmacy",
      value: {
        PatientID: row.PatientId,
        VisitID: row.VisitID,
        Patient_Name: row.PatientName,
        Doctor_name: row.Doctor_Name,
        Doctorid: row.Doctorid || "",
        type: "IP",
        Department: 1,
        Edit: true,
        ...row,
      }
    });
    navigate("/Home/Pharmacy");
    dispatch({ type: "HrFolder", value: "IPPharmacyRefundBilling" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });

    }

    else if(row.PharmacyType === 'WalkinPharmacy'){

      dispatch({
      type: "Selected_Patient_Pharmacy",
      value: {
        PatientID: row.PatientId,
        VisitID: row.VisitID,
        Patient_Name: row.PatientName,
        Doctor_name: row.Doctor_Name,
        Doctorid: row.Doctorid || "",
        type: "IP",
        Department: 1,
        Edit: true,
        ...row,
      }
    });
    navigate("/Home/Pharmacy");
    dispatch({ type: "HrFolder", value: "IPWalkinPharmacyRefundBilling" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });

    }

    
  };

  const handlePrintBill = (row) => { setSelectedRow(row); setPrintView("bill"); };
  const handlePrintReceipt = (row) => { setSelectedRow(row); setPrintView("receipt"); dispatch({ type: "setPreviousFolder", value: "PharmacyRefundBillingLIst" }); };
  const handlePrintClose = () => { setPrintView(null); setSelectedRow(null); };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => handlePrintClose()
  });


  const [Viewitemmodal,setViewitemmodal] = useState(false);
  
    const [ViewBilledItems,setViewBilledItems] = useState([]);
  

  const handleproductsviewfun =  (row) => {
    console.log('rowwwwwwwwww',row)
    setViewitemmodal(true)
    setViewBilledItems(row.Billing_Items)
  }

  const UserRegisterColumns = [
    { key: "S_No", name: "S No", frozen: true },
    { key: "Billing_Date", name: "Date", frozen: true },
    { key: "id", name: "Invoice", frozen: true },
    { key: "PatientId", name: "Patient Id", frozen: true },
    { key: "RegisterId", name: "Register Id", frozen: true },
    {
          key: "Patient_Name",
          name: "Patient Name",
          frozen: true,
          renderCell: (params) => (
            <Tooltip
              title={
                Array.isArray(params.row.Items) && params.row.Items.length > 0 ? (
                  <div>
                    {params.row.Items.map((item, idx) => (
                      <div key={idx}>{item.ItemName}</div>
                    ))}
                  </div>
                ) : "No items"
              }
              placement="top"
              arrow
            >
              <span>{params.row.Patient_Name}</span>
            </Tooltip>
          )
          },
 
    // { key: "id", name: "Invoice No", frozen: true },
    { key: "PhoneNo", name: "Contact Number", frozen: true },
    { key: "Doctor_Name", name: "Doctor Name", frozen: true },
    { key: 'Bill_Status', name: 'Status' },
    { key: 'PaidNetAmount', name: 'PaidNet_Amount' },
    
    {
      key:'View',name:'View',
      renderCell:(params) => {

        return <Button onClick={() => handleproductsviewfun(params.row)}><VisibilityIcon /></Button>;

      }

    },

    {
      key: "Action",
      name: "Action",
      renderCell: (params) => {
       if (params.row.Bill_Status === 'Paid' || params.row.Bill_Status === 'Due')  {
          return <Button onClick={() => handleRequestEdit1(params.row)}><ArrowForwardIcon /></Button>;
        } else {
          return (
            <>
              <Button onClick={() => handlePrintBill(params.row)}><PrintIcon /></Button>
              <Button onClick={() => handlePrintReceipt(params.row)}><ReceiptIcon /></Button>
            </>
          );
        }
      }
    }
  ];

  // Dot-matrix bill component
  const PrintViewContent = () => {
    if (!selectedRow) return null;

    const BillData = selectedRow;
    const ClinicDetials = {}; // replace with actual clinic details if available
    const summary = {
      totalAmountt: BillData.TotalAmount || 0,
      GST: BillData.GST || 0,
      totalAmount: BillData.PaidAmount || 0,
      Amount: BillData.TotalAmount || 0,
      PaidAmount : BillData.PaidAmount || 0
    };

    return (
      <div className="dotmatrix-container">
        <div ref={componentRef} className="dotmatrix-wrapper">
          <table className="dotmatrix-table">
            <thead>
              <tr>
                <td colSpan="10" className="dotmatrix-header">
                  <div className="dotmatrix-header-content">
                    <div className="dotmatrix-clinic-info">
                      <span>{ClinicDetials?.ClinicName || "KARUNA MEDICAL COLLEGE HOSPITAL"}</span>
                      <br /><br />
                      <div>
                        {[ClinicDetials?.ClinicAddress].filter(Boolean).join(", ")} ,{" "}
                        {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr><td colSpan="10" className="dotmatrix-bill-title">Refund Receipt</td></tr>
              <tr>
                <td colSpan="10">
                  <div className="dotmatrix-separator" />
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td className="label">Patient Name</td>
                        <td className="value">: {BillData.Patient_Name}</td>
                        <td className="label">Invoice No</td>
                        <td className="value">: {BillData?.id}</td>
                      </tr>
                      <tr>
                        <td className="label">Patient ID</td>
                        <td className="value">: {BillData.PatientId}</td>
                        <td className="label">GSTIN No</td>
                        <td className="value">: {ClinicDetials.ClinicGST || '32AABTS4963R2ZT'}</td>
                      </tr>
                      <tr>
                        <td className="label">Doctor Name</td>
                        <td className="value">: {BillData.Doctor_Name}</td>
                        <td className="label">Patient Ph No</td>
                        <td className="value">: {BillData.PhoneNo}</td>
                      </tr>
                      <tr>
                        <td className="label">Bill Status</td>
                        <td className="value">: {BillData?.Bill_Status}</td>
                        <td className="label">Patient Category</td>
                        <td className="value">: {BillData?.PatientCategory}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="10">
                  <div className="dotmatrix-separator" />
                  <table className="dotmatrix-inner-table">
                    <thead>
                      <tr className="item-header">
                        <th>S.No</th>
                        <th>Item</th>
                        <th>Batch</th>
                        <th>Exp</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BillData?.Items?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.ItemName}</td>
                          <td>{item.BatchNo}</td>
                          <td>{item.ExpDate}</td>
                          <td>{item.Quantity}</td>
                          <td style={{ textAlign: "right" }}>{item.UnitPrice}</td>
                          <td style={{ textAlign: "right" }}>{item.Total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="dotmatrix-separator" />
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="10">
                  <table className="totals-table">
                    <tbody>
                      <tr>
                        <td className="pharm-label">Amount In Words</td>
                        <td className="pharm-value">: {NumberToWords(summary.PaidAmount)}</td>
                        <td className="pharm-label-right">GST</td>
                        <td className="pharm-value-right">: {summary.GST}</td>
                      </tr>
                      <tr>
                        <td className="pharm-label">Billed By</td>
                        <td className="pharm-value">: {BillData?.BilledBy}</td>
                        <td className="pharm-label-right">Gross Amount</td>
                        <td className="pharm-value-right">: {summary.totalAmount}</td>

                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="pharm-label-right">Net Amount</td>
                        <td className="pharm-value-right">: {summary.totalAmount}</td>

                      </tr>

                      <tr>
                        <td></td>
                        <td></td>
                        <td className="pharm-label-right">Refund Amount</td>
                        <td className="pharm-value-right">: {summary.PaidAmount}</td>

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


  return (
    <>
      {printView === null  && Viewitemmodal === false ? (
        <div className="Main_container_app">
          <h3>IP Pharmacy Refund Billing List</h3>
          <div className="search_div_bar">
            <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
              <div className="RegisForm_1">
                <label>Date Type:</label>
                <select name="DateType" value={searchOptions.DateType} onChange={HandleOnchangeSearch}>
                  <option value="Current">Current Date</option>
                  <option value="Customize">Customize</option>
                </select>
              </div>

              {searchOptions.DateType === "Current" ? (
                <div className="RegisForm_1">
                  <label>Current Date:</label>
                  <input type="date" name="CurrentDate" value={searchOptions.CurrentDate} readOnly />
                </div>
              ) : (
                <>
                  <div className="RegisForm_1">
                    <label>From Date:</label>
                    <input type="date" name="FromDate" value={searchOptions.FromDate} onChange={HandleOnchangeSearch} />
                  </div>
                  <div className="RegisForm_1">
                    <label>To Date:</label>
                    <input type="date" name="ToDate" value={searchOptions.ToDate} onChange={HandleOnchangeSearch} min={searchOptions.FromDate} />
                  </div>
                </>
              )}

              <div className="RegisForm_1">
                <label>Patients/Billno :</label>
                <input type="text" name="SearchbyFirstName" value={searchOptions.SearchbyFirstName} onChange={HandleOnchangeSearch} />
              </div>
                
                <div className="RegisForm_1">
                <label>Registeration No:</label>
                <input
                  type="text"
                  name="RegisterId"
                  value={searchOptions.RegisterId}
                  onChange={HandleOnchangeSearch}
                />
              </div>


              <div className="RegisForm_1">
                <label>Product :</label>
                <input type="text" name="SearchProd" value={searchOptions.SearchProd} onChange={HandleOnchangeSearch} />
              </div>
              <div className="RegisForm_1">
                <label>Status:</label>
                <select name="SearchStatus" value={searchOptions.SearchStatus} onChange={HandleOnchangeSearch}>
                  <option value="">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
<div className="RegisForm_1">
                <label>Pharmacy Type:</label>
                <select name="Pharma_Type" value={searchOptions.Pharma_Type} onChange={HandleOnchangeSearch}>
                  <option value="">Type</option>
                  <option value="IP PHARMACY">IP PHARMACY</option>
                  <option value="FREE PHARMACY">FREE PHARMACY</option>
                 
                </select>
                <button
                  type="button"
                  className="RegisterForm_1_btns"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
            <ReactGrid columns={UserRegisterColumns} RowData={Filterdata} />
          </div>

          <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
      ) : (
        <PrintViewContent />
      )}


      {Viewitemmodal && (
    <div onClick={() => setViewitemmodal(false)}>
      <div
        className="newwProfiles newwPopupforreason uwagduaguleaveauto"
        onClick={(e) => e.stopPropagation()}
      >
        <br />
        <div className="appointment">
          <div className="h_head">
            <h4>Items</h4>
          </div>
          <div className="Main_container_app">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>S.No</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Item Name</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Batch No</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Expiry Date</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Unit Price</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantity</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(ViewBilledItems) &&
                  ViewBilledItems.map((item) => (
                    <tr key={item.itemid}>
                      <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                        {item.S_No}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {item.ItemName}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {item.BatchNo}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {new Date(item.Exp_Date).toLocaleDateString("en-GB")}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                        {item.Unit_Price.toFixed(2)}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                        {item.Billing_Quantity}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                        {item.Amount.toFixed(2)}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                        {item.Total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="Register_btn_con">
          <button className="RegisterForm_1_btns" onClick={() => setViewitemmodal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default IPPharmacyRefundBillingList;
