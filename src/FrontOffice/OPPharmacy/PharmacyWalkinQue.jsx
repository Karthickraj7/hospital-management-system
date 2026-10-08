import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PrintIcon from "@mui/icons-material/Print";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import Clinic_Logo from "../../Assets/kmc.jpeg";
import "./OPpharmacy.css";
import { useNavigate } from "react-router-dom";

const PharmacyWalkinQue = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const userRecord = useSelector((state) => state.userRecord?.UserData);
const navigate = useNavigate();
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [printRow, setPrintRow] = useState(null);
const [filters, setFilters] = useState({
  SearchbyDate: "",
  SearchbyFirstName: "",
  SearchbyPhoneNumber: "",
  SearchSpecialization: "",
  SearchDoctor: "",
  SearchStatus: "" // ✅ Already present
});


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

  // 🔹 Load Clinic Details
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(
            (c) => c
          );
          setClinicDetials((prev) => ({
            ...prev,
            ClinicName: clinicData.Clinic_Name || prev.ClinicName,
            ClinicAddress: addressComponents.join(", "),
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
  }, [UrlLink]);

  // 🔹 Printing
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
const back = ()=>{
  navigate('/Home/OPPharmachyWalkinBilling')
}
  // 🔹 Fetch Billing Data
 const fetchData = async () => {
  try {
    const query = new URLSearchParams(filters).toString();
const response = await axios.get(
  `${UrlLink}DrugAdminstrations/get_OP_Pharmacy_Billing_datas?${query}`
);

    setPatientRegisterData(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  useEffect(() => {
    fetchData();
  }, [UrlLink]);

  // ✅ Trigger Print
  const goToPrint = (row) => {
    setPrintRow(row);
    setTimeout(() => handlePrint(), 200);
  };

  // Table Columns
  const PatientOPRegisterColumns = [
    { key: "id", name: "S.No", frozen: pagewidth > 500 },
    { key: "Billing_Invoice_No", name: "Billing Invoice No" },
    { key: "PatientID", name: "Patient ID", width: 150 },
    { key: "PatientName", name: "Patient Name", width: 150 },
    { key: "Billing_Date", name: "Billing Date" },
    { key: "Total_Items", name: "Total Items" },
    { key: "Total_Qty", name: "Total Qty" },
    { key: "Total_Amount", name: "Total Amount" },
    { key: "Paid_Amount", name: "Paid Amount" },
    { key: "created_by", name: "Billed by" },
    { key: "status", name: "Status" },

    {
      key: "Action",
      name: "Action",
      width: 70,
    renderCell: (params) => (
  <button
    className="RegisterForm_1_btns added_RegisterForm_1_btns"
    onClick={() => goToPrint(params.row)}   // ✅ use params.row
    title="Print"
  >
    <PrintIcon className="check_box_clrr_cancell" />
  </button>
),

    },
  ];
useEffect(() => {
  fetchData();
}, [UrlLink, filters]);

  return (
    <>
      <div className="Main_container_app">
        <h3>Walkin Que List</h3>
        <div className="QuickStock_container_header">
          <button onClick={back}>Back <ShoppingCartIcon /></button>
          <br />
          <h3>
            
          </h3>
        </div>
<div className="RegisFormcon_1">
  <input
    type="date"

    style={{padding:'5px',borderRadius:'5px'}}
    value={filters.SearchbyDate}
    onChange={(e) => setFilters({ ...filters, SearchbyDate: e.target.value })}
    placeholder="Search by Date"
  />
  <input
  style={{padding:'5px',borderRadius:'5px'}}
    type="text"
    value={filters.SearchbyFirstName}
    onChange={(e) => setFilters({ ...filters, SearchbyFirstName: e.target.value })}
    placeholder="Search by Patient Name"
  />
  <input
  style={{padding:'5px',borderRadius:'5px'}}
    type="text"
    value={filters.SearchbyPhoneNumber}
    onChange={(e) => setFilters({ ...filters, SearchbyPhoneNumber: e.target.value })}
    placeholder="Search by Phone No"
  />
  <input style={{padding:'5px',borderRadius:'5px'}}
    type="text"
    value={filters.SearchSpecialization}
    onChange={(e) => setFilters({ ...filters, SearchSpecialization: e.target.value })}
    placeholder="Search by Specialization"
  />
  <input style={{padding:'5px',borderRadius:'5px'}}
    type="text"
    value={filters.SearchDoctor}
    onChange={(e) => setFilters({ ...filters, SearchDoctor: e.target.value })}
    placeholder="Search by Doctor"
  />
 <select
  style={{ padding: "5px", borderRadius: "5px" }}
  value={filters.SearchStatus}
  onChange={(e) => setFilters({ ...filters, SearchStatus: e.target.value })}
>
  <option value="">All Status</option>
  <option value="Paid">Paid</option>
  <option value="Pending">Pending</option>
  <option value="Credit">Credit</option>
</select>

  <button onClick={fetchData} style={{backgroundColor:'grey',padding:'5px',borderRadius:'5px'}}>Apply Filters</button>
</div>

        <ToastAlert Message={toast.message} Type={toast.type} />
        <br />
        <ReactGrid
          columns={PatientOPRegisterColumns}
          RowData={PatientRegisterData}
        />
      </div>

      {/* 🔹 Hidden Printable Section */}
      <div style={{ display: "none" }}>
  <style>
    {`
      @page {
        size: A5 portrait;
        margin: 5mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `}
  </style>

  

<div ref={componentRef}>
  {printRow && (
    <div className="dotmatrix-container">
      <div className="dotmatrix-wrapper">
        <table className="dotmatrix-table">
          <thead>
            {/* Header */}
            <tr>
              <td colSpan="10" className="dotmatrix-header">
                <div className="dotmatrix-header-content">
                  <div className="dotmatrix-clinic-info">
                    <div style={{ fontWeight: "bold", fontSize: "12pt" }}>
                      {ClinicDetials.ClinicName}
                    </div>
                    <div>
                      {ClinicDetials.ClinicAddress}, {ClinicDetials.ClinicCity},{" "}
                      {ClinicDetials.ClinicState} - {ClinicDetials.ClinicCode}
                    </div>
                    <div style={{ fontSize: "9pt" }}>
                      {[ClinicDetials.ClinicMobileNo, ClinicDetials.ClinicMailID]
                        .filter(Boolean)
                        .join(" , ")}
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            {/* Title */}
            <tr>
              <td colSpan="10" className="dotmatrix-bill-title">
                Pharmacy Walking Bill
              </td>
            </tr>

            {/* Patient Info */}
            <tr>
              <td colSpan="10">
                <div className="dotmatrix-separator" />
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td className="label">Patient</td>
                      <td className="value">: {printRow.PatientName}</td>
                      <td className="label"> Patient ID</td>
                      <td className="value">: {printRow.PatientID}</td>
                      <td className="label">Billing_Type</td>
                      <td className="value">: {printRow.Billing_Type}</td>
                    </tr>
                    <tr>
                      <td className="label">Invoice</td>
                      <td className="value">: {printRow.Billing_Invoice_No}</td>
                      <td className="label">Date</td>
                      <td className="value">: {printRow.Billing_Date}</td>
                    </tr>
                    <tr>
                      <td className="label">Patient_Category</td>
                      <td className="value">: {printRow.Patient_Category || "-"}</td>
                      <td className="label">Billed By</td>
                      <td className="value">: {printRow.created_by}</td>
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
                      <th>Item</th>
                      <th>Batch</th>
                      <th>Exp</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Amount</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printRow.Billing_Items?.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.ItemName}</td>
                        <td>{item.BatchNo}</td>
                        <td>{item.Exp_Date}</td>
                        <td className="dotmatrix-align-right">{item.Billing_Quantity}</td>
                        <td className="dotmatrix-align-right">{item.Unit_Price}</td>
                        <td className="dotmatrix-align-right">{item.Amount}</td>
                        <td className="dotmatrix-align-right">{item.Total}</td>
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
                      <td className="pharm-label">Gross</td>
                      <td className="pharm-value">: {printRow.Total_Amount}</td>
                      <td className="pharm-label">Discount</td>
                      <td className="pharm-value">: {printRow.Discount_Amount}</td>
                    </tr>
                    <tr>
                      <td className="pharm-label">GST</td>
                      <td className="pharm-value">: {printRow.Total_GSTAmount}</td>
                      <td className="pharm-label">Net</td>
                      <td className="pharm-value">: {printRow.Net_Amount}</td>
                    </tr>
                    <tr>
                      <td className="pharm-label">Paid Amount</td>
                      <td className="pharm-value">: {printRow.Paid_Amount}</td>
                      <td className="pharm-label">Balance</td>
                      <td className="pharm-value">: {printRow.Balance_Amount}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="dotmatrix-separator" />
                <div className="dotmatrix-footer-note">
                  This page is created automatically without a signature.
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )}
</div>


</div>

    </>
  );
};

export default PharmacyWalkinQue;
