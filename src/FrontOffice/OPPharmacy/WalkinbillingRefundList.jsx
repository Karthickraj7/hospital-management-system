import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../../FrontOffice/Billing/GeneralBilling.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import Clinic_Logo from "../../Assets/kmc.jpeg";
import "./OPpharmacy.css";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrintIcon from '@mui/icons-material/Print';
import { NumberToWords } from "../../OtherComponent/OtherFunctions";



const WalkinbillingRefundList = () => {

    const componentRef = useRef();
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
      const userRecord = useSelector((state) => state.userRecord?.UserData);
      const toast = useSelector(state => state.userRecord?.toast);

        const ClinicDetails = useSelector(state => state.userRecord?.ClinicDetails);
      


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
      .then((response) => {
        const clinicData = response.data[0];
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
  }, [userRecord?.location, UrlLink]);

    
      const formatDate = (date) => {
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${d.getFullYear()}-${month}-${day}`;
      };
      const [TodayDate] = useState(formatDate(new Date()));
    
      const [searchOptions, setSearchOptions] = useState({
        DateType: 'Current',
        CurrentDate: TodayDate,
        FromDate: '',
        ToDate: '',
        SearchbyFirstName: '',
        SearchbySpeciality: '',
        SearchbyDoctor: '',
        SearchTimeOrderby: '',
        SearchStatus: '',
        Pharma_Type:'',
        SearchProd: '',
      });
    
      const [Filterdata, setFilterdata] = useState([]);

      console.log('Filterdata',Filterdata)
      const [printView, setPrintView] = useState(null);
      const [selectedRow, setSelectedRow] = useState(null);

      const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === 'DateType') {
      if (value === 'Current') {
        setSearchOptions(prev => ({ ...prev, DateType: value, CurrentDate: TodayDate, FromDate: '', ToDate: '' }));
      } else {
        setSearchOptions(prev => ({ ...prev, DateType: value, CurrentDate: '' }));
      }
    } else {
      setSearchOptions(prev => ({ ...prev, [name]: value }));
    }
  };


  const handletorefundpage = (row) =>{


    console.log(row,'rowwwwwwwwwww')

    dispatch({
      type: "Selected_Patient_Pharmacy",
      value: {
        ...row,
      }
    });
    navigate("/Home/Pharmacy");
    dispatch({ type: "HrFolder", value: "RefundBillingwalkinpharmacy" });
    dispatch({ type: "setPreviousFolder", value: null });
    dispatch({ type: "showMenu", value: true });

  }

  const handletorefundprint = (row) => {

        console.log(row,'rowwwwwwwwwww')
        setPrintView(true);
        setPrintpaidView(false);
        setSelectedRow(row);


  }

  const [Paidbilldatas,setPaidbilldatas] = useState([]);
  const [PrintpaidView,setPrintpaidView] = useState(false);


  const handletopaidprint = (row) =>{

     console.log(row,'rowwwwwwwwwww')
     setPrintView(false);
        setPrintpaidView(true);
        setPaidbilldatas(row);

  }

  const UserRegisterColumns = [
      { key: "S_No", name: "S No", frozen: true },
      { key: "Billing_Date", name: "Date", frozen: true },
      { key: "Billing_Invoice_No", name: "Invoice", frozen: true },
      { key: "PatientId", name: "Patient Id", frozen: true },
      {
            key: "PatientName",
            name: "Patient Name",
            frozen: true,
            
            },
         { key: 'Bill_Status', name: 'Status' },
         {key:"Paid_Amount",name:'Paid_Amount'},
      {
        key: "Action",
        name: "Action",
        renderCell: (params) => {
          if (params.row.Bill_Status === 'Cash') {
            return <Button onClick={() => handletorefundpage(params.row)}><ArrowForwardIcon /></Button>;
          }
        }
      },
      {
        key: "Action",
        name: "Action",
        renderCell: (params) => {
           
            return <Button onClick={() => handletopaidprint(params.row)}><PrintIcon /></Button>;
          
        }
      }
    ];

   const RefundDataColumns = [
      { key: "billing_date", name: "Date", frozen: true },
      { key: "billinvoice", name: "Invoice", frozen: true },
      { key: "patient_id", name: "Patient Id", frozen: true },
      {
            key: "patient_name",
            name: "Patient Name",
            frozen: true,
            
            },
         {key:"paid_amount",name:'Paid_Amount'},
      {
        key: "Action",
        name: "Action",
        renderCell: (params) => {
           
            return <Button onClick={() => handletorefundprint(params.row)}><PrintIcon /></Button>;
          
        }
      }
    ];

   useEffect(() => {
  // Create cancel token source
  const source = axios.CancelToken.source();
  const cancelTokenRef = { current: source };

  const fetchData = async () => {
    // Cancel previous request if still pending
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Operation canceled due to new request.");
    }

    const newSource = axios.CancelToken.source();
    cancelTokenRef.current = newSource;

    let params = {
      ...searchOptions,
    };

    try {
      let response;

      if (searchOptions.SearchStatus === "Refunded") {
        response = await axios.get(
          `${UrlLink}Frontoffice/WalkinPharmacy_Refund_Reprint_get`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        if (Array.isArray(response.data.data)) {
        setFilterdata(response.data.data);
      } else {
        setFilterdata([]);
      }
      } else {
        // Default API call
        response = await axios.get(
          `${UrlLink}Frontoffice/waliking_bill_pay_ip_refund`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        if (Array.isArray(response.data)) {
        setFilterdata(response.data);
      } else {
        setFilterdata([]);
      }
      }
      

      console.log(response, "API Response");

      
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
        return;
      }
      console.error("Error fetching data:", err);
      setFilterdata([]);
    }
  };

  const delayDebounce = setTimeout(() => {
    fetchData();
  }, 400);

  return () => {
    clearTimeout(delayDebounce);
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Operation canceled during cleanup.");
    }
  };
}, [searchOptions, UrlLink]);

const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => handlePrintClose()
  });

    const handlePrintClose = () => { setPrintView(null); setSelectedRow(null); };



  const PrintViewContent = () => {
    if (!selectedRow) return null;

    console.log(selectedRow,'selectedRow')

    const BillData = selectedRow;
    const ClinicDetials = {}; // replace with actual clinic details if available
    const summary = {
      totalAmountt: BillData.total_amount || 0,
      GST: BillData.GST || 0,
      totalAmount: BillData.total_paid_amount || 0,
      Amount: BillData.total_paid_amount || 0,
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
              <tr><td colSpan="10" className="dotmatrix-bill-title">{printView === "bill" ? "IP Pharmacy Bill" : "Refund Receipt"}</td></tr>
              <tr>
                <td colSpan="10">
                  <div className="dotmatrix-separator" />
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td className="label">Patient Name</td>
                        <td className="value">: {BillData.patient_name}</td>
                        <td className="label">Invoice No</td>
                        <td className="value">: {BillData?.billinvoice}</td>
                      </tr>
                      <tr>
                        <td className="label">Patient ID</td>
                        <td className="value">: {BillData.patient_id}</td>
                        <td className="label">GSTIN No</td>
                        <td className="value">: {ClinicDetials.ClinicGST || '32AABTS4963R2ZT'}</td>
                      </tr>
                      <tr>
                        <td className="label">Doctor Name</td>
                        <td className="value">: {BillData.Doctor_Name}</td>
                        <td className="label">ReceiptNo</td>
                        <td className="value">: {BillData.voucher_number}</td>
                      </tr>
                      <tr>
                        <td className="label">BillDate</td>
                        <td className="value">: {BillData?.billing_date}</td>
                        <td className="label">Patient Category</td>
                        <td className="value">: {BillData?.Patient_Category}</td>
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

                      {BillData?.refund_items?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.item_name}</td>
                          <td>{item.batch_no}</td>
                          <td>{item.expiry_date}</td>
                          <td>{item.refund_quantity}</td>
                          <td style={{ textAlign: "right" }}>{item.unit_price}</td>
                          <td style={{ textAlign: "right" }}>{item.total}</td>
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
                        <td className="pharm-value">:{NumberToWords(+summary.totalAmount)}
                        </td>
                        <td className="pharm-label-right">GST</td>
                        <td className="pharm-value-right">: {summary.GST}</td>
                      </tr>
                      <tr>
                        <td className="pharm-label">Billed By</td>
                        <td className="pharm-value">: {BillData?.billed_by}</td>
                        <td className="pharm-label-right">Gross Amount</td>
                        <td className="pharm-value-right">: {summary.totalAmount}</td>

                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="pharm-label-right">Paid Amount</td>
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

  const PaidPrintViewContent = () => {
    if (!Paidbilldatas) return null;

    console.log(Paidbilldatas,'Paidbilldatas')

    const BillData = Paidbilldatas;
    const ClinicDetials = {}; // replace with actual clinic details if available
    const summary = {
      totalAmountt: BillData.Paid_Amount || 0,
      GST: BillData.GST || 0,
      totalAmount: BillData.Total_Amount || 0,
      Amount: BillData.Paid_Amount || 0,
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
              <tr><td colSpan="10" className="dotmatrix-bill-title">{BillData.Pharmacy_Type === "IPWALKING" ? "IP WALKING Bill" : "OP WALKING Bill"}</td></tr>
              <tr>
                <td colSpan="10">
                  <div className="dotmatrix-separator" />
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td className="label">Patient Name</td>
                        <td className="value">: {BillData.PatientName}</td>
                        <td className="label">Invoice No</td>
                        <td className="value">: {BillData?.Billing_Invoice_No}</td>
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
                         <td className="label">BillDate</td>
                        <td className="value">: {BillData.Billing_Date} {BillData?.Billing_Time}</td> 
                      </tr>
                      <tr>
                        {/* <td className="label">Bill Status</td>
                        <td className="value">: {BillData?.Bill_Status}</td> */}
                        <td className="label">Patient Category</td>
                        <td className="value">: {BillData?.Patient_Category}</td>
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
                      {BillData?.items?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.ItemName}</td>
                          <td>{item.BatchNo}</td>
                          <td>{item.Exp_Date}</td>
                          <td>{item.Billing_Quantity}</td>
                          <td style={{ textAlign: "right" }}>{item.Unit_Price}</td>
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
                        <td className="pharm-value">:{NumberToWords(+summary.Amount)}
                        </td>
                        <td className="pharm-label-right">GST</td>
                        <td className="pharm-value-right">: {summary.GST}</td>
                      </tr>
                      <tr>
                        <td className="pharm-label">Billed By</td>
                        <td className="pharm-value">: {BillData?.created_by}</td>
                        <td className="pharm-label-right">Gross Amount</td>
                        <td className="pharm-value-right">: {summary.totalAmount}</td>

                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="pharm-label-right">Paid Amount</td>
                        <td className="pharm-value-right">: {summary.Amount}</td>

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
  {printView === null ? (
    <div className="Main_container_app">
      <h3>Walk in Refund Billing List</h3>
      <div className="search_div_bar">
        <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
          {/* Date Type */}
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
            <label>Patients :</label>
            <input type="text" name="SearchbyFirstName" value={searchOptions.SearchbyFirstName} onChange={HandleOnchangeSearch} />
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
        </div>

        {/* Render Grid */}
        {Filterdata && Filterdata.length > 0 && (
          <ReactGrid
            columns={
              searchOptions.SearchStatus === 'Refunded'
                ? RefundDataColumns
                : UserRegisterColumns
            }
            RowData={Filterdata}
          />
        )}
      </div>

      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  ) : PrintpaidView ? (
    <PaidPrintViewContent />
  ) : (
    <PrintViewContent />
  )}
</>

  );
    
}

export default WalkinbillingRefundList
