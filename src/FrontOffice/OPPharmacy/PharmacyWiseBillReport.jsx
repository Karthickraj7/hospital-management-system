import React, { useEffect, useRef, useState,useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupIcon from "@mui/icons-material/Group";
import * as XLSX from "xlsx";


const PharmacyWiseBillReport = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [Filterdata, setFilterdata] = useState({
    OPNew: [],
    OPOld: [],
    OPRef: [],
  });
  const [FilterOveralldata, setFilterOveralldata] = useState({
    OPNew: [],
    OPOld: [],
    OPRef: [],
  });
  const [Filterservicesdata, setFilterservicesdata] = useState({});
  const [IPServicesdata,setIPServicesdata] = useState({});
  const [FilterRefundUser, setFilterRefundUser] = useState({});
  const [FilterDiscountUser, setFilterDiscountUser] = useState({});
  const [IPDiscount, setIPDiscount] = useState({});
  const [FilterRefunddata, setFilterRefunddata] = useState({});


  const [FinalBillDetails,setFinalBillDetails] = useState([]);
  const [Advanceclosing,setAdvanceclosing] = useState([]);
  const [AdvanceRefundclosing,setAdvanceRefundclosing] = useState([]);
  const [OPServicesclosing,setOPServicesclosing] = useState([]);
  const [IPServicesclosing,setIPServicesclosing] = useState([]);
  const [OPDiscountclosing,setOPDiscountclosing] = useState([]);
  const [IPDiscountclosing,setIPDiscountclosing] = useState([]);
  const [Refundclosing,setRefundclosing] = useState([]);


  const [FinalSummary,setFinalSummary] = useState([]);

  const [FinalBillCredit,setFinalBillCredit] = useState([]);

  const [IPPharmacy,setIPPharmacy] = useState([]);
  const [FreePharmacy,setFreePharmacy] = useState([]);
  const [AllPharmacy,setAllPharmacy] = useState([]);

  console.log(AllPharmacy, "FilterRefunddata");
  const [Filterconsultationdata, setFilterconsultationdata] = useState({
    newpatients: [],
    newbillcount: 0,
    new_grand_total: 0,
    oldpatients: [],
    oldbillcount: 0,
    old_grand_total: 0,
  });


  const [AdvanceData,setAdvanceData] = useState([]);
  const [AdvanceRefundData,setAdvanceRefundData] = useState([]);
  const [SummaryData,setSummaryData] = useState([]);

  const [FinalBillData,setFinalBillData] = useState([]);

  console.log(AdvanceData,'AdvanceData',AdvanceRefundData,'AdvanceRefundData')


  const [SpecialityData, setSpecialityData] = useState([]);
  const [SelectedSpecialities, setSelectedSpecialities] = useState([]);
  const [printBySpeciality, setPrintBySpeciality] = useState(false);
  const [SelectedUsers, setSelectedUsers] = useState([]);

  const [openModal2, setOpenModal2] = useState(false);
  const [openModalService2, setOpenModalService2] = useState(false);
  const [openModalService3, setOpenModalService3] = useState(false);
  const [Openmodalprint, setOpenModaloverall] = useState(false);
  const [OpenmodalDepprint, setOpenModalDepoverall] = useState(false);
  const [OpenmodalConsultprint, setOpenModalConsultoverall] = useState(false);
  const [OpenmodalConsultOverallprint, setOpenModalConsultOverallprint] =
    useState(false);
  const [OpenmodalRefundUserprint, setOpenmodalRefundUserprint] =
    useState(false);
  console.log(OpenmodalRefundUserprint, "OpenmodalRefundUserprint");

  const [OpenmodalAdvanceprint, setOpenmodalAdvanceprint] = useState(false);
  const [OpenmodalFinalBillprint, setOpenmodalFinalBillprint] = useState(false);
    const [OpenmodalFinalCreditBillprint, setOpenmodalFinalCreditBillprint] = useState(false);

  const [OpenmodalSummaryprint, setOpenmodalSummaryprint] = useState(false);
  const [OpenmodalClosingprint, setOpenmodalClosingprint] = useState(false);
  const [viewType, setViewType] = useState("Pharmacy");
  const [searchQuery, setsearchQuery] = useState("");
  const [searchUserQuery, setsearchUserQuery] = useState("");
  const [filteredTestList, setFilteredTestList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [UserList, setUserList] = useState([]);
  const [TestNameList, setTestNameList] = useState([]);
  const [ServicesList, setServicesList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]); // New states for table filters
  const [patientNameFilter, setPatientNameFilter] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("");
  const [doctorNameFilter, setDoctorNameFilter] = useState("");

  console.log(selectedServices, "selectedServices");

  const handleExportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Generate filename with timestamp
    const fileName = `Billing_Reports_${formatDate(new Date())}.xlsx`;

    // Export based on current viewType
    switch (viewType) {
      case "UserWise":
        exportUserWiseReport(wb);
        break;
      case "Overall":
        exportOverallReport(wb);
        break;
      case "ServiceWise":
        exportServiceWiseReport(wb);
        break;
      case "Consultationuserwise":
      case "Consultationoverall":
        exportConsultationReport(wb);
        break;
      case "Refund":
        exportRefundReport(wb);
        break;
      case "FinalBill":
        exportFinalBillReport(wb);
        break;
      case "Advance":
        exportAdvanceReport(wb);
        break;
      case "Pharmacy":
        exportPharmacyReport(wb);
        break;
      case "OPAmountCollection":
        exportOPAmountCollectionReport(wb);
        break;
      case "IPAmountCollection":
        exportIPAmountCollectionReport(wb);
        break;
      
    //   case "ClosingSummary":
    //     handleExportClosingSummary(wb);
    //     break;
      default:
        alert("No data to export");
        return;
    }

    // Download the file
    XLSX.writeFile(wb, fileName);
  };

  // Individual export functions
  const exportUserWiseReport = (wb) => {
    const allData = [
      ...Filterdata.OPNew.map((item) => ({ ...item, Type: "OP New" })),
      ...Filterdata.OPOld.map((item) => ({ ...item, Type: "OP Old" })),
      ...Filterdata.OPRef.map((item) => ({ ...item, Type: "OP Ref" })),
    ];

    if (allData.length === 0) {
      alert("No data to export");
      return;
    }

    const excelData = allData.map((row, index) => ({
      "S.No": index + 1,
      "OP No": row.PatientId || "-",
      Date: row.OPDate || "-",
      "Patient Name": row.Patient_Name || "-",
      Doctor: row.Doctor_Name || "-",
      Department: row.DeptName || "-",
      Fees: parseFloat(row.PaidAmount || 0).toFixed(2),
      Category: row.PatientCategory || "-",
      Type: row.Type,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "User Wise Report");
  };

  const exportOverallReport = (wb) => {
    const allData = [
      ...FilterOveralldata.OPNew.map((item) => ({ ...item, Type: "OP New" })),
      ...FilterOveralldata.OPOld.map((item) => ({ ...item, Type: "OP Old" })),
      ...FilterOveralldata.OPRef.map((item) => ({ ...item, Type: "OP Ref" })),
    ];

    if (allData.length === 0) {
      alert("No data to export");
      return;
    }

    const excelData = allData.map((row, index) => ({
      "S.No": index + 1,
      "OP No": row.PatientId || "-",
      Date: row.OPDate || "-",
      "Patient Name": row.Patient_Name || "-",
      Doctor: row.Doctor_Name || "-",
      Department: row.DeptName || "-",
      Fees: parseFloat(row.PaidAmount || 0).toFixed(2),
      Category: row.PatientCategory || "-",
      Prepared: row.created_by || "-",
      Type: row.Type,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Overall Report");
  };


  const exportServiceWiseReport = (wb) => {
    const servicesData = Filterservicesdata?.services || [];
    const refundData = FilterRefundUser?.refunds || [];
    const discountData = FilterDiscountUser?.discounts || [];

    if (servicesData.length === 0 && refundData.length === 0) {
      alert("No data to export");
      return;
    }

    // Group services by Service_Type (similar to print function)
    const groupByServiceType = (data) => {
      return data.reduce((groups, item) => {
        const serviceType = item.Service_Type || "UNKNOWN";
        if (!groups[serviceType]) {
          groups[serviceType] = [];
        }
        groups[serviceType].push(item);
        return groups;
      }, {});
    };

    // Create discount map for quick lookup
    const discountMap = {};
    discountData.forEach((discount) => {
      discount.DiscountedItems?.forEach((item) => {
        const key =
          `${discount.PatientId}-${discount.InvoiceNo}-${item.Service_Name}`.toLowerCase();
        discountMap[key] = parseFloat(item.Apportioned_Discount || 0);
      });
    });

    // Augment services data with gross, discount, and net
    const augmentedServices = servicesData.map((row) => {
      const key =
        `${row.PatientId}-${row.Invoiveno}-${row.ServiceName}`.toLowerCase();
      const discount = discountMap[key] || 0;
      const gross = parseFloat(row.PaidAmount || 0);
      const net = gross - discount;
      return { ...row, gross, discount, net };
    });

    // Group augmented services
    const groupedServices = groupByServiceType(augmentedServices);

    // Prepare data for Excel export
    const excelData = [];

    // Add header row
    excelData.push([
      "S.No",
      "Patient ID",
      "Bill Date",
      "Time",
      "Bill No",
      "Patient Name",
      "Service Name",
      "Gross Amount",
      "Discount",
      "Net Amount",
      "Category",
      "Prepared",
    ]);

    // Add services data
    Object.keys(groupedServices).forEach((serviceType) => {
      // Add service type header
      excelData.push([serviceType.toUpperCase()]);

      // Add service items
      groupedServices[serviceType].forEach((row, index) => {
        excelData.push([
          index + 1,
          row.PatientId || "-",
          row.OPDate || "-",
          row.billtime || "-",
          row.Invoiveno || "-",
          row.Patient_Name || "-",
          row.ServiceName || "-",
          row.gross.toFixed(2),
          row.discount.toFixed(2),
          row.net.toFixed(2),
          row.PatientCategory || "-",
          row.created_by || "-",
        ]);
      });

      // Add subtotal for this service type
      const subtotalGross = groupedServices[serviceType].reduce(
        (sum, row) => sum + row.gross,
        0
      );
      const subtotalDiscount = groupedServices[serviceType].reduce(
        (sum, row) => sum + row.discount,
        0
      );
      const subtotalNet = groupedServices[serviceType].reduce(
        (sum, row) => sum + row.net,
        0
      );

      excelData.push([
        "",
        "",
        "",
        "",
        "",
        "",
        "Subtotal",
        subtotalGross.toFixed(2),
        subtotalDiscount.toFixed(2),
        subtotalNet.toFixed(2),
        "",
        "",
      ]);

      // Add empty row for separation
      excelData.push([]);
    });

    // Add refunds section if exists
    if (refundData.length > 0) {
      excelData.push(["REFUNDS"]);

      // Add refund header
      excelData.push([
        "S.No",
        "Patient ID",
        "Bill Date",
        "Patient Name",
        "Refund Amount",
        "Voucher Number",
        "Invoice No",
        "Billed By",
      ]);

      // Add refund items
      refundData.forEach((row, index) => {
        excelData.push([
          index + 1,
          row.PatientId || "-",
          row.BillDate || "-",
          row.Patient_Name || "-",
          parseFloat(row.PaidAmount || 0).toFixed(2),
          row.VoucherNumber || "-",
          row.InvoiceNo || "-",
          row.Billedby || "-",
        ]);
      });

      // Add refund subtotal
      const refundSubtotal = refundData
        .reduce((sum, row) => sum + parseFloat(row.PaidAmount || 0), 0)
        .toFixed(2);

      excelData.push([
        "",
        "",
        "",
        "",
        "Refund Subtotal",
        refundSubtotal,
        "",
        "",
      ]);
    }

    // Add payment method summary
    excelData.push([]);
    excelData.push(["PAYMENT METHOD SUMMARY"]);

    // Payment summary headers
    excelData.push([
      "Payment Method",
      "Service Amount",
      "Discount Amount",
      "Refund Amount",
      "Final Amount",
    ]);

    // Calculate payment method totals (same logic as in your print function)
    const serviceTotals = { Cash: 0, UPI: 0, Card: 0 };
    const discountTotals = { Cash: 0, UPI: 0, Card: 0 };
    const refundTotals = { Cash: 0, UPI: 0, Card: 0 };
    const finalTotals = { Cash: 0, UPI: 0, Card: 0 };

    // Sum service and discount amounts by payment method
    augmentedServices.forEach((row) => {
      const gross = row.gross;
      const discount = row.discount;
      const net = row.net;
      if (row.PaymentMethod === "Cash") {
        serviceTotals.Cash += gross;
        discountTotals.Cash += discount;
        finalTotals.Cash += net;
      } else if (row.PaymentMethod === "UPI") {
        serviceTotals.UPI += gross;
        discountTotals.UPI += discount;
        finalTotals.UPI += net;
      } else if (row.PaymentMethod === "Card") {
        serviceTotals.Card += gross;
        discountTotals.Card += discount;
        finalTotals.Card += net;
      }
    });

    // Sum refunds
    refundData.forEach((row) => {
      (row.PaymentMethods || []).forEach((method) => {
        const amount = parseFloat(method.Transaction_Amount || 0);
        if (method.Payment_Type === "Cash") refundTotals.Cash += amount;
        else if (method.Payment_Type === "UPI") refundTotals.UPI += amount;
        else if (method.Payment_Type === "Card") refundTotals.Card += amount;
      });
    });

    // Adjust final totals by subtracting refunds
    finalTotals.Cash = Math.max(0, finalTotals.Cash - refundTotals.Cash);
    finalTotals.UPI = Math.max(0, finalTotals.UPI - refundTotals.UPI);
    finalTotals.Card = Math.max(0, finalTotals.Card - refundTotals.Card);

    // Add payment method rows
    excelData.push([
      "Cash",
      serviceTotals.Cash.toFixed(2),
      discountTotals.Cash.toFixed(2),
      refundTotals.Cash.toFixed(2),
      finalTotals.Cash.toFixed(2),
    ]);

    excelData.push([
      "UPI",
      serviceTotals.UPI.toFixed(2),
      discountTotals.UPI.toFixed(2),
      refundTotals.UPI.toFixed(2),
      finalTotals.UPI.toFixed(2),
    ]);

    excelData.push([
      "Card",
      serviceTotals.Card.toFixed(2),
      discountTotals.Card.toFixed(2),
      refundTotals.Card.toFixed(2),
      finalTotals.Card.toFixed(2),
    ]);

    // Add total row
    const totalServiceAmount = (
      serviceTotals.Cash +
      serviceTotals.UPI +
      serviceTotals.Card
    ).toFixed(2);
    const totalDiscountAmount = (
      discountTotals.Cash +
      discountTotals.UPI +
      discountTotals.Card
    ).toFixed(2);
    const totalRefundAmount = (
      refundTotals.Cash +
      refundTotals.UPI +
      refundTotals.Card
    ).toFixed(2);
    const totalFinalAmount = (
      finalTotals.Cash +
      finalTotals.UPI +
      finalTotals.Card
    ).toFixed(2);

    excelData.push([
      "Total",
      totalServiceAmount,
      totalDiscountAmount,
      totalRefundAmount,
      totalFinalAmount,
    ]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Apply styling through cell properties
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);

        if (!ws[cell_ref]) continue;

        // Style headers and section titles
        if (
          R === 0 ||
          excelData[R][0] === "RADIOLOGY" ||
          excelData[R][0] === "LABORATORY" ||
          excelData[R][0] === "REFUNDS"
        ) {
          ws[cell_ref].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "D3D3D3" } },
          };
        }

        // Style subtotals
        if (
          excelData[R][6] === "Subtotal" ||
          excelData[R][4] === "Refund Subtotal"
        ) {
          ws[cell_ref].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "F0F0F0" } },
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Service Wise Report");
  };

  
  const exportConsultationReport = (wb) => {
  const allPatients = [
    ...Filterconsultationdata.newpatients.map((p) => ({ ...p, Type: "New" })),
    ...Filterconsultationdata.oldpatients.map((p) => ({ ...p, Type: "Follow Up" })),
  ];

  if (allPatients.length === 0) {
    alert("No data to export");
    return;
  }

  // Group by speciality (DeptName)
  const specialityGroups = allPatients.reduce((groups, patient) => {
    const speciality = patient.DeptName || "Unknown";
    if (!groups[speciality]) {
      groups[speciality] = [];
    }
    groups[speciality].push(patient);
    return groups;
  }, {});

  // Prepare data for Excel
  const excelData = [];

  // Add headers
  excelData.push([
    "S.No",
    "Patient ID",
    "Date",
    "Patient Name",
    "Department",
    "OP Type",
    "Category",
    "Fees",
    "Prepared"
  ]);

  // Add patient data grouped by speciality
  Object.entries(specialityGroups).forEach(([speciality, patients]) => {
    // Add speciality header
    excelData.push([`Speciality: ${speciality}`]);
    
    // Add patients for this speciality
    patients.forEach((patient, index) => {
      excelData.push([
        index + 1,
        patient.PatientId || "-",
        patient.BillDate || "-",
        patient.Patient_Name || "-",
        patient.DeptName || "-",
        patient.Type || "-",
        patient.PatientCategory || "-",
        parseFloat(patient.PaidAmount || 0).toFixed(2),
        patient.Billedby || "-"
      ]);
    });
    
    // Calculate speciality totals
    const newPatients = patients.filter(p => p.Type === "New");
    const followUpPatients = patients.filter(p => p.Type === "Follow Up");
    
    const newTotal = newPatients.reduce((sum, p) => sum + parseFloat(p.PaidAmount || 0), 0);
    const followUpTotal = followUpPatients.reduce((sum, p) => sum + parseFloat(p.PaidAmount || 0), 0);
    const specialityTotal = newTotal + followUpTotal;
    
    // Add speciality summary
    excelData.push([
      "", "", "", "", "", "", "",
      `Speciality Total - New: ₹${newTotal.toFixed(2)} | Follow Up: ₹${followUpTotal.toFixed(2)}`
    ]);
    
    // Add empty row for separation
    excelData.push([]);
  });

  // Calculate grand totals
  const allNewPatients = allPatients.filter(p => p.Type === "New");
  const allFollowUpPatients = allPatients.filter(p => p.Type === "Follow Up");
  
  const grandNewTotal = allNewPatients.reduce((sum, p) => sum + parseFloat(p.PaidAmount || 0), 0);
  const grandFollowUpTotal = allFollowUpPatients.reduce((sum, p) => sum + parseFloat(p.PaidAmount || 0), 0);
  const grandTotal = grandNewTotal + grandFollowUpTotal;

  // Add grand total row
  excelData.push([
    "", "", "", "", "", "", "",
    `GRAND TOTAL - New: ₹${grandNewTotal.toFixed(2)} | Follow Up: ₹${grandFollowUpTotal.toFixed(2)}`
  ]);

  // Add note
  excelData.push([]);
  excelData.push(["Note: This report includes OP registration fee details with separate calculations for New and Follow Up patients."]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  // Apply styling through cell properties
  const range = XLSX.utils.decode_range(ws['!ref']);
  for(let R = range.s.r; R <= range.e.r; ++R) {
    for(let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = {c:C, r:R};
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      
      if(!ws[cell_ref]) continue;
      
      // Style headers
      if(R === 0) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center" }
        };
      }
      
      // Style speciality headers
      if(ws[cell_ref].v && typeof ws[cell_ref].v === 'string' && ws[cell_ref].v.startsWith('Speciality:')) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "000000" } },
          fill: { fgColor: { rgb: "DCE6F1" } }
        };
      }
      
      // Style total rows
      if(ws[cell_ref].v && typeof ws[cell_ref].v === 'string' && 
         (ws[cell_ref].v.includes('Speciality Total') || ws[cell_ref].v.includes('GRAND TOTAL'))) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "000000" } },
          fill: { fgColor: { rgb: "F2DCDB" } }
        };
      }
      
      // Style note
      if(ws[cell_ref].v && typeof ws[cell_ref].v === 'string' && 
         ws[cell_ref].v.startsWith('Note:')) {
        ws[cell_ref].s = {
          font: { italic: true, color: { rgb: "7F7F7F" } }
        };
      }
      
      // Right align numeric columns
      if(C === 7) { // Fees column
        ws[cell_ref].s = {
          ...(ws[cell_ref].s || {}),
          alignment: { horizontal: "right" }
        };
      }
    }
  }
  
  // Set column widths for better readability
  const colWidths = [
    {wch: 6},  // S.No
    {wch: 12}, // Patient ID
    {wch: 10}, // Date
    {wch: 25}, // Patient Name
    {wch: 20}, // Department
    {wch: 10}, // OP Type
    {wch: 12}, // Category
    {wch: 15}, // Fees
    {wch: 15}  // Prepared
  ];
  
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Consultation Report");
};


  const exportRefundReport = (wb) => {
    const refundData = FilterRefunddata?.refunds || [];

    if (refundData.length === 0) {
      alert("No data to export");
      return;
    }

    const refundRows = [];
    refundData.forEach((refund, index) => {
      // Main refund row
      refundRows.push({
        "S.No": refundRows.length + 1,
        "Patient ID": refund.PatientId || "-",
        "Bill Date": refund.BillDate || "-",
        "Patient Name": refund.Patient_Name || "-",
        "Refund Amount": parseFloat(refund.PaidAmount || 0).toFixed(2),
        "Voucher Number": refund.VoucherNumber || "-",
        "Invoice No": refund.InvoiceNo || "-",
        "Billed By": refund.Billedby || "-",
        "Item Type": "REFUND",
      });

      // Refunded items as sub-rows
      refund.RefundedItems?.forEach((item, itemIndex) => {
        refundRows.push({
          "S.No": "",
          "Patient ID": "",
          "Bill Date": "",
          "Patient Name": "",
          "Refund Amount": "",
          "Voucher Number": "",
          "Invoice No": "",
          "Billed By": "",
          "Item Type": "ITEM",
          "Service Type": item.Service_Type || "-",
          "Service Name": item.Service_Name || "-",
          Quantity: item.Quantity || "-",
          Amount: parseFloat(item.Amount || 0).toFixed(2),
          "Total Amount": parseFloat(item.Total_Amount || 0).toFixed(2),
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(refundRows);
    XLSX.utils.book_append_sheet(wb, ws, "Refund Report");
  };

  const exportFinalBillReport = (wb) => {
  const finalBillData = FinalBillData || [];

  if (finalBillData.length === 0) {
    alert("No data to export");
    return;
  }

  // Calculate totals
  const totals = finalBillData.reduce(
    (acc, row) => ({
      Net_Amount: acc.Net_Amount + parseFloat(row.Net_Amount || 0),
      Discount: acc.Discount + parseFloat(row.Discount || 0),
      Advanceamt: acc.Advanceamt + parseFloat(row.Advanceamt || 0),
      Paidamt: acc.Paidamt + parseFloat(row.Paidamt || 0),
      Refundamt: acc.Refundamt + parseFloat(row.Refundamt || 0),
    }),
    {
      Net_Amount: 0,
      Discount: 0,
      Advanceamt: 0,
      Paidamt: 0,
      Refundamt: 0,
    }
  );

  const rows = [];
  finalBillData.forEach((row, index) => {
    rows.push({
      "S.No": index + 1,
      "Bill No": row.FBillNo || "-",
      "Bill Date": row.FBilldate || "-",
      "Patient ID": row.Patientid || "-",
      "IP No": row.IPNo || "-",
      "Patient Name": row.Patientname || "-",
      "Grand Total": parseFloat(row.Net_Amount || 0).toFixed(2),
      "Creditamt": parseFloat(row.Creditamt || 0).toFixed(2),
      "Discount": parseFloat(row.Discount || 0).toFixed(2),
      "Advance Amount": parseFloat(row.Advanceamt || 0).toFixed(2),
      "Paid Amount": parseFloat(row.Paidamt || 0).toFixed(2),
      "Refund Amount": parseFloat(row.Refundamt || 0).toFixed(2),
      "Remarks": row.Remarks || "-",
    });
  });

  // Add grand total row
  rows.push({
    "S.No": "",
    "Bill No": "",
    "Bill Date": "",
    "Patient ID": "",
    "IP No": "",
    "Patient Name": "Grand Total",
    "Grand Total": totals.Net_Amount.toFixed(2),
    "Discount": totals.Discount.toFixed(2),
    "Advance Amount": totals.Advanceamt.toFixed(2),
    "Paid Amount": totals.Paidamt.toFixed(2),
    "Refund Amount": totals.Refundamt.toFixed(2),
    "Remarks": "",
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Final Bill Report");
  };

const exportAdvanceReport = (wb) => {
  const advanceData = AdvanceData || [];
  const advanceRefundData = AdvanceRefundData || [];

  if (advanceData.length === 0 && advanceRefundData.length === 0) {
    alert("No data to export");
    return;
  }

  // Group advances by RegisterType
  const groupByRegisterType = (data) => {
    return data.reduce((groups, item) => {
      const registerType = item.RegisterType || "UNKNOWN";
      if (!groups[registerType]) {
        groups[registerType] = [];
      }
      groups[registerType].push(item);
      return groups;
    }, {});
  };

  // Augment advance data with gross (AdvanceAmount)
  const augmentedAdvances = advanceData.map((row) => ({
    ...row,
    gross: parseFloat(row.AdvanceAmount || 0),
  }));

  // Group augmented advances
  const groupedAdvances = groupByRegisterType(augmentedAdvances);

  // Calculate overall advance totals
  const advanceGross = augmentedAdvances.reduce((sum, item) => sum + item.gross, 0);
  const refundTotal = advanceRefundData.reduce((sum, row) => sum + parseFloat(row.Refundamt || 0), 0);
  const netTotal = Math.max(0, advanceGross - refundTotal);

  // Format date range for sheet name
  const reportDateRange = searchOptions.DateType === "Current"
    ? new Date(searchOptions.CurrentDate || new Date())
        .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
        .replace(/\//g, "-")
    : `From ${new Date(searchOptions.FromDate || new Date())
        .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
        .replace(/\//g, "-")} To ${new Date(searchOptions.ToDate || new Date())
        .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
        .replace(/\//g, "-")}`;

  const rows = [];

  // Add header row
  rows.push({
    "S.No": "S.No",
    "PatientNo": "PatientNo",
    "BillDate": "BillDate",
    "BillNo": "BillNo",
    "Patient Name": "Patient Name",
    "Advance Purpose": "Advance Purpose",
    "Amount": "Amount",
    "Gender": "Gender",
    "Age": "Age",
    "Prepared": "Prepared",
    "Type": "Type"
  });

  let serialNumber = 1;

  // Process advance data by register type
  Object.keys(groupedAdvances).forEach((registerType) => {
    const advanceGroup = groupedAdvances[registerType];
    
    if (advanceGroup.length > 0) {
      // Add section header
      rows.push({
        "S.No": "",
        "PatientNo": registerType,
        "BillDate": "",
        "BillNo": "",
        "Patient Name": "",
        "Advance Purpose": "",
        "Amount": "",
        "Gender": "",
        "Age": "",
        "Prepared": "",
        "Type": "SECTION_HEADER"
      });

      // Add advance rows
      advanceGroup.forEach((row) => {
        rows.push({
          "S.No": serialNumber++,
          "PatientNo": row.PatientId || "-",
          "BillDate": row.AdvDate || "-",
          "BillNo": row.Voucher_Number || row.AdvanceVoucher || "-",
          "Patient Name": row.PatientName || "-",
          "Advance Purpose": row.AdvancePurpose || "-",
          "Amount": parseFloat(row.gross || 0), // Store as number
          "Gender": row.Gender || "-",
          "Age": row.Age || "-",
          "Prepared": row.created_by || row.Billedby || "-",
          "Type": "ADVANCE"
        });
      });

      // Add subtotal for this register type
      const subtotalGross = advanceGroup.reduce((sum, row) => sum + row.gross, 0);
      rows.push({
        "S.No": "",
        "PatientNo": "",
        "BillDate": "",
        "BillNo": "",
        "Patient Name": "Subtotal",
        "Advance Purpose": "",
        "Amount": subtotalGross, // Store as number
        "Gender": "",
        "Age": "",
        "Prepared": "",
        "Type": "SUBTOTAL"
      });
    }
  });

  // Add advance grand total
  rows.push({
    "S.No": "",
    "PatientNo": "",
    "BillDate": "",
    "BillNo": "",
    "Patient Name": "Advance Grand Total",
    "Advance Purpose": "",
    "Amount": advanceGross, // Store as number
    "Gender": "",
    "Age": "",
    "Prepared": "",
    "Type": "GRAND_TOTAL"
  });

  // Process refund data
  if (advanceRefundData.length > 0) {
    // Add refund section header
    rows.push({
      "S.No": "",
      "PatientNo": "Refunds",
      "BillDate": "",
      "BillNo": "",
      "Patient Name": "",
      "Advance Purpose": "",
      "Amount": "",
      "Gender": "",
      "Age": "",
      "Prepared": "",
      "Type": "SECTION_HEADER"
    });

    // Add refund rows
    advanceRefundData.forEach((row) => {
      rows.push({
        "S.No": serialNumber++,
        "PatientNo": row.PatientId || "-",
        "BillDate": row.AdvDate || "-",
        "BillNo": row.Refundvoucher || "-",
        "Patient Name": row.PatientName || "-",
        "Advance Purpose": `Refund (Advance Voucher: ${row.AdvanceVoucher || "-"})`,
        "Amount": parseFloat(row.Refundamt || 0), // Store as number
        "Gender": row.Gender || "-",
        "Age": row.Age || "-",
        "Prepared": row.Billedby || "-",
        "Type": "REFUND"
      });
    });

    // Add refund subtotal
    const refundSubtotal = advanceRefundData.reduce((sum, row) => sum + parseFloat(row.Refundamt || 0), 0);
    rows.push({
      "S.No": "",
      "PatientNo": "",
      "BillDate": "",
      "BillNo": "",
      "Patient Name": "Refund Subtotal",
      "Advance Purpose": "",
      "Amount": refundSubtotal, // Store as number
      "Gender": "",
      "Age": "",
      "Prepared": "",
      "Type": "SUBTOTAL"
    });
  }

  // Add final net total
  rows.push({
    "S.No": "",
    "PatientNo": "",
    "BillDate": "",
    "BillNo": "",
    "Patient Name": "Final Net Total",
    "Advance Purpose": "",
    "Amount": netTotal, // Store as number
    "Gender": "",
    "Age": "",
    "Prepared": "",
    "Type": "FINAL_TOTAL"
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Apply styling and number formatting
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      
      if (!ws[cell_ref]) continue;

      // Style section headers
      if (ws[cell_ref].v && typeof ws[cell_ref].v === 'string' && 
          (ws[cell_ref].v.includes("UNKNOWN") || ws[cell_ref].v === "Refunds")) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "2E7D32" } },
          fill: { fgColor: { rgb: "E8F5E9" } }
        };
      }

      // Style totals
      if (ws[cell_ref].v && typeof ws[cell_ref].v === 'string' && 
          (ws[cell_ref].v.includes("Subtotal") || 
           ws[cell_ref].v.includes("Grand Total") || 
           ws[cell_ref].v.includes("Final Net Total"))) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "00796B" } },
          fill: { fgColor: { rgb: "C8E6C9" } }
        };
      }

      // Style header row
      if (R === 0) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "00796B" } },
          border: {
            top: { style: "thin", color: { rgb: "004D40" } },
            left: { style: "thin", color: { rgb: "004D40" } },
            right: { style: "thin", color: { rgb: "004D40" } },
            bottom: { style: "thin", color: { rgb: "004D40" } }
          }
        };
      }

      // Apply number format to Amount column (column index 6)
      if (C === 6 && R > 0 && ws[cell_ref].t !== 's') { // Ensure it's not a string (e.g., header or empty)
        ws[cell_ref].z = '0.00'; // Format as number with 2 decimal places
        ws[cell_ref].t = 'n'; // Explicitly set type to number
      }
    }
  }

  // Set column widths
  if (!ws['!cols']) ws['!cols'] = [];
  const colWidths = [6, 12, 12, 15, 25, 25, 12, 8, 6, 15, 0]; // Last column (Type) hidden
  colWidths.forEach((width, index) => {
    ws['!cols'][index] = { width };
  });

  const sheetName = `Advance Report ${reportDateRange}`.substring(0, 31); // Excel sheet name limit
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
};

const exportPharmacyReport = (wb) => {
  // Extract data arrays
  const pharmacyDataArray = Array.isArray(AllPharmacy?.data) ? AllPharmacy.data : [];
  const walkinPharmacyArray = Array.isArray(walkinPharmacy?.data) ? walkinPharmacy.data : [];
  const refundDataArray = Array.isArray(PharmacyRefund?.data) ? PharmacyRefund.data : [];
  const walkinRefundDataArray = Array.isArray(Walkinpharmacyrefund?.data) ? Walkinpharmacyrefund.data : [];

  // Process walk-in pharmacy data
  const processWalkinPharmacyData = () => {
    return walkinPharmacyArray.map(item => {
      const processedItem = { ...item };
      if (item.BillType === 'Credit') {
        processedItem.Creditamt = item.Paid_Amount || 0;
        processedItem.Paid_Amount = 0;
      } else if (item.BillType === 'Cash') {
        processedItem.Creditamt = 0;
        processedItem.Paid_Amount = item.Paid_Amount || 0;
      }
      return processedItem;
    });
  };

  const processedWalkinPharmacyArray = processWalkinPharmacyData();
  const combinedPharmacyData = [...pharmacyDataArray, ...processedWalkinPharmacyArray];
  const allRefundData = [...refundDataArray, ...walkinRefundDataArray];

  // Check if there is any data to export
  if (combinedPharmacyData.length === 0 && allRefundData.length === 0) {
    alert("No data to export");
    return;
  }

  // Assume filter states (you may need to pass these as parameters or manage state differently)
  const searchTerm = ''; // Default or pass from component
  const showOnlyDuplicates = false; // Default or pass from component
  const pharmacyTypeFilter = 'All'; // Default or pass from component
  const statusFilter = 'All'; // Default or pass from component
  const fromBillNo = ''; // Default or pass from component
  const toBillNo = ''; // Default or pass from component

  // Duplicate detection functions
  const detectDuplicates = (pharmacyData) => {
    const duplicateMap = {};
    const duplicates = [];
    pharmacyData.forEach(item => {
      const key = `${item.PatientId}-${item.InvoiceNo}-${item.Total_Amount || (parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0))}`;
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    return duplicates;
  };

  const detectRefundDuplicates = (refundData) => {
    const duplicateMap = {};
    const duplicates = [];
    refundData.forEach(item => {
      const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}`;
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    return duplicates;
  };

  const isDuplicatePharmacyItem = (item, allItems) => {
    const key = `${item.PatientId}-${item.InvoiceNo}-${item.Total_Amount || (parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0))}`;
    const matchingItems = allItems.filter(i => 
      `${i.PatientId}-${i.InvoiceNo}-${i.Total_Amount || (parseFloat(i.Creditamt || 0) + parseFloat(i.Paid_Amount || 0))}` === key
    );
    return matchingItems.length > 1;
  };

  const isDuplicateRefundItem = (item, allRefunds) => {
    const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}`;
    const matchingRefunds = allRefunds.filter(r => 
      `${r.PatientID}-${r.Billinvoice || r.Invoice_NO}-${r.TotalAmount}` === key
    );
    return matchingRefunds.length > 1;
  };

  // Get pharmacy type
  const getPharmacyType = (item) => {
    if (item.Pharmacy_Type === 'IPWALKING') return 'IPwalking';
    if (item.BillType === 'IP PHARMACY') return 'IPPharmacy';
    if (item.BillType === 'FREE PHARMACY') return 'Freepharmacy';
    if (item.BillType === 'OP Pharmacy') return 'OPPharmacy';
    return 'Other';
  };

  // Get status
  const getStatus = (item) => {
    if (item.NewPayment === 'RefundPayment') return 'Refund';
    const credit = parseFloat(item.Creditamt || 0);
    const paid = parseFloat(item.Paid_Amount || 0);
    if (credit > 0) return 'Credit';
    if (paid > 0) return 'Paid';
    return 'Other';
  };

  // Get bill number
  const getBillNumber = (item) => {
    if (item.InvoiceNo) return item.InvoiceNo;
    if (item.Billinvoice) return item.Billinvoice;
    if (item.Voucher_Number) return item.Voucher_Number;
    return '';
  };

  // Filter data
  const filterData = (data, isRefund = false) => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const pharmacyType = isRefund ? item.Pharmacy_Type : getPharmacyType(item);
      const matchesPharmacyType = pharmacyTypeFilter === 'All' || 
        (pharmacyTypeFilter === 'IPPharmacy' && pharmacyType === 'IPPharmacy') ||
        (pharmacyTypeFilter === 'Freepharmacy' && pharmacyType === 'Freepharmacy') ||
        (pharmacyTypeFilter === 'IPwalking' && pharmacyType === 'IPwalking');
      
      const status = getStatus(item);
      const matchesStatus = statusFilter === 'All' || 
        (statusFilter === 'Paid' && status === 'Paid') ||
        (statusFilter === 'Credit' && status === 'Credit');
      
      const billNo = getBillNumber(item);
      let matchesBillNoRange = true;
      if (fromBillNo && toBillNo) {
        const billNumberOptions = [...new Set([...combinedPharmacyData, ...allRefundData]
          .map(item => getBillNumber(item))
          .filter(billNo => billNo && billNo.trim() !== '')
          .sort())];
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex && currentIndex <= toIndex;
      } else if (fromBillNo) {
        const billNumberOptions = [...new Set([...combinedPharmacyData, ...allRefundData]
          .map(item => getBillNumber(item))
          .filter(billNo => billNo && billNo.trim() !== '')
          .sort())];
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex;
      } else if (toBillNo) {
        const billNumberOptions = [...new Set([...combinedPharmacyData, ...allRefundData]
          .map(item => getBillNumber(item))
          .filter(billNo => billNo && billNo.trim() !== '')
          .sort())];
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex <= toIndex;
      }
      
      return matchesSearch && matchesPharmacyType && matchesStatus && matchesBillNoRange;
    });
  };

  // Apply filters
  const filteredBilledData = filterData(combinedPharmacyData);
  const filteredRefundData = filterData(allRefundData, true);

  // Apply duplicate filter
  const displayBilledData = showOnlyDuplicates 
    ? filteredBilledData.filter(item => isDuplicatePharmacyItem(item, combinedPharmacyData))
    : filteredBilledData;
  const displayRefundData = showOnlyDuplicates 
    ? filteredRefundData.filter(item => isDuplicateRefundItem(item, allRefundData))
    : filteredRefundData;

  // Group filtered data by BillType
  const groupedData = displayBilledData.reduce((acc, row) => {
    if (!row) return acc;
    let groupKey = row.BillType || 'Unknown';
    if (row.Pharmacy_Type === 'IPWALKING') {
      groupKey = 'IP WALKING';
    }
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(row);
    return acc;
  }, {});

  // Calculate totals
  const calculateTotals = (data, isRefund = false) => {
    if (!Array.isArray(data)) {
      return { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 };
    }
    return data.reduce(
      (acc, row) => {
        if (isRefund) {
          const refundAmount = parseFloat(row?.TotalAmount || 0);
          let credit = 0;
          let paid = 0;
          if (row?.paytype === 'Credit') {
            credit = refundAmount;
          } else if (row?.paytype === 'Cash') {
            paid = refundAmount;
          } else {
            credit = refundAmount;
          }
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + refundAmount
          };
        } else {
          const credit = parseFloat(row?.Creditamt || 0);
          const paid = parseFloat(row?.Paid_Amount || 0);
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + (credit + paid)
          };
        }
      },
      { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 }
    );
  };

  const grandTotals = calculateTotals(displayBilledData);
  const refundTotals = calculateTotals(displayRefundData, true);

  // Format date range
  const reportDateRange = searchOptions?.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions?.CurrentDate || new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions?.FromDate || new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-')} To: ${new Date(searchOptions?.ToDate || new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-')}`;

  const rows = [];

  // Add header information
  rows.push({ "S.No": "KARUNA MEDICAL COLLEGE HOSPITAL" });
  rows.push({ "S.No": "Vilayodi, Chittur, Palakkad" });
  rows.push({ "S.No": reportDateRange });
  if (searchTerm) {
    rows.push({ "S.No": `Filtered results for: "${searchTerm}"` });
  }
  if (pharmacyTypeFilter !== 'All' || statusFilter !== 'All' || fromBillNo || toBillNo) {
    const filters = [
      pharmacyTypeFilter !== 'All' ? `Type: ${pharmacyTypeFilter}` : '',
      statusFilter !== 'All' ? `Status: ${statusFilter}` : '',
      fromBillNo || toBillNo ? `Bill No: ${fromBillNo || 'Start'} to ${toBillNo || 'End'}` : ''
    ].filter(f => f).join(' ');
    rows.push({ "S.No": `Filters: ${filters}` });
  }
  if (showOnlyDuplicates) {
    rows.push({ "S.No": "Showing Duplicate Entries Only" });
  }

  // Add data for each group
  ['IP PHARMACY', 'OP Pharmacy', 'FREE PHARMACY', 'IP WALKING'].forEach((billType) => {
    const groupData = groupedData[billType] || [];
    if (!Array.isArray(groupData) || groupData.length === 0) return;

    const groupTotals = calculateTotals(groupData);

    // Add group header
    rows.push({ "S.No": `${billType} (${groupData.length} records)` });

    // Add column headers
    rows.push({
      "S.No": "S.No",
      "Invoice No": "Invoice No",
      "Billing Date": "Billing Date",
      "Patient ID": "Patient ID",
      "Patient Name": "Patient Name",
      "Patient Category": "Patient Category",
      "Remarks": "Remarks",
      "Credit Amt": "Credit Amt",
      "Paid Amount": "Paid Amount",
      "Total Amount": "Total Amount",
      "Bill Status": "Bill Status",
      "Created By": "Created By"
    });

    // Add group data
    groupData.forEach((row, index) => {
      const isDuplicate = isDuplicatePharmacyItem(row, combinedPharmacyData);
      rows.push({
        "S.No": index + 1,
        "Invoice No": row?.InvoiceNo || "-",
        "Billing Date": row?.BillingDate || "-",
        "Patient ID": row?.PatientId || "-",
        "Patient Name": row?.Patient_Name || "-",
        "Patient Category": row?.PatCategory || "-",
        "Remarks": row?.Remarks || "-",
        "Credit Amt": parseFloat(row?.Creditamt || 0), // Store as number
        "Paid Amount": parseFloat(row?.Paid_Amount || 0), // Store as number
        "Total Amount": parseFloat(row?.Total_Amount || (parseFloat(row?.Creditamt || 0) + parseFloat(row?.Paid_Amount || 0))), // Store as number
        "Bill Status": row?.Bill_Status || "-",
        "Created By": row?.created_by || "-",
        "Duplicate": isDuplicate ? "⚠️ Duplicate" : ""
      });
    });

    // Add group subtotal
    rows.push({
      "S.No": "",
      "Invoice No": "",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "Subtotal",
      "Patient Category": "",
      "Remarks": "",
      "Credit Amt": groupTotals.Creditamt, // Store as number
      "Paid Amount": groupTotals.Paid_Amount, // Store as number
      "Total Amount": groupTotals.Total_Amount, // Store as number
      "Bill Status": "",
      "Created By": "",
      "Duplicate": ""
    });

    rows.push({}); // Empty row for spacing
  });

  // Add refund data
  if (displayRefundData.length > 0) {
    const refundTotals = calculateTotals(displayRefundData, true);

    // Add refund section header
    rows.push({ "S.No": `REFUNDED ITEMS (${displayRefundData.length} records)` });

    // Add column headers
    rows.push({
      "S.No": "S.No",
      "Invoice No": "Invoice No",
      "Billing Date": "Billing Date",
      "Patient ID": "Patient ID",
      "Patient Name": "Patient Name",
      "Patient Category": "Patient Category",
      "Remarks": "Remarks",
      "Credit Amt": "Credit Amt",
      "Paid Amount": "Paid Amount",
      "Total Amount": "Total Amount",
      "Bill Status": "Bill Status",
      "Created By": "Created By"
    });

    // Add refund data
    displayRefundData.forEach((row, index) => {
      const isDuplicate = isDuplicateRefundItem(row, allRefundData);
      const refundAmount = parseFloat(row?.TotalAmount || 0);
      let credit = 0;
      let paid = 0;
      if (row?.paytype === 'Credit') {
        credit = refundAmount;
      } else if (row?.paytype === 'Cash') {
        paid = refundAmount;
      } else {
        credit = refundAmount;
      }
      rows.push({
        "S.No": index + 1,
        "Invoice No": row?.Voucher_Number || row?.Billinvoice || "-",
        "Billing Date": row?.Billing_Date || "-",
        "Patient ID": row?.PatientID || "-",
        "Patient Name": row?.Patient_Name || "-",
        "Patient Category": row?.PatCategory || "-",
        "Remarks": row?.Remarks || "-",
        "Credit Amt": credit, // Store as number
        "Paid Amount": paid, // Store as number
        "Total Amount": refundAmount, // Store as number
        "Bill Status": "Refunded",
        "Created By": row?.Billedby || "-",
        "Duplicate": isDuplicate ? "⚠️ Duplicate" : ""
      });
    });

    // Add refund subtotal
    rows.push({
      "S.No": "",
      "Invoice No": "",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "Subtotal",
      "Patient Category": "",
      "Remarks": "",
      "Credit Amt": refundTotals.Creditamt, // Store as number
      "Paid Amount": refundTotals.Paid_Amount, // Store as number
      "Total Amount": refundTotals.Total_Amount, // Store as number
      "Bill Status": "",
      "Created By": "",
      "Duplicate": ""
    });

    rows.push({}); // Empty row for spacing
  }

  // Add grand total
  if (displayBilledData.length > 0) {
    rows.push({
      "S.No": "",
      "Invoice No": "",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": `Grand Total (Pharmacy: ${displayBilledData.length} records)`,
      "Patient Category": "",
      "Remarks": "",
      "Credit Amt": grandTotals.Creditamt, // Store as number
      "Paid Amount": grandTotals.Paid_Amount, // Store as number
      "Total Amount": grandTotals.Total_Amount, // Store as number
      "Bill Status": "",
      "Created By": "",
      "Duplicate": ""
    });
  }

  // Add refund grand total
  if (displayRefundData.length > 0) {
    rows.push({
      "S.No": "",
      "Invoice No": "",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": `Grand Total (Refunds: ${displayRefundData.length} records)`,
      "Patient Category": "",
      "Remarks": "",
      "Credit Amt": refundTotals.Creditamt, // Store as number
      "Paid Amount": refundTotals.Paid_Amount, // Store as number
      "Total Amount": refundTotals.Total_Amount, // Store as number
      "Bill Status": "",
      "Created By": "",
      "Duplicate": ""
    });
  }

  const ws = XLSX.utils.json_to_sheet(rows);

  // Apply styling and number formatting
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      
      if (!ws[cell_ref]) continue;

      // Style header rows
      if (R < 3 || (ws[cell_ref].v && typeof ws[cell_ref].v === 'string' && 
          (ws[cell_ref].v.includes("records)") || ws[cell_ref].v.includes("Filtered results") || 
           ws[cell_ref].v.includes("Filters:") || ws[cell_ref].v.includes("Duplicate Entries")))) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: R === 0 ? "1F2937" : R === 1 ? "374151" : "4B5563" } },
          alignment: { horizontal: "center" }
        };
      }

      // Style column headers
      if (ws[cell_ref].v && ['S.No', 'Invoice No', 'Billing Date', 'Patient ID', 'Patient Name', 
          'Patient Category', 'Remarks', 'Credit Amt', 'Paid Amount', 'Total Amount', 
          'Bill Status', 'Created By'].includes(ws[cell_ref].v)) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "00796B" } },
          border: {
            top: { style: "thin", color: { rgb: "004D40" } },
            left: { style: "thin", color: { rgb: "004D40" } },
            right: { style: "thin", color: { rgb: "004D40" } },
            bottom: { style: "thin", color: { rgb: "004D40" } }
          }
        };
      }

      // Style subtotals and grand totals
      if (ws[cell_ref].v && typeof ws[cell_ref].v === 'string' && 
          (ws[cell_ref].v.includes("Subtotal") || ws[cell_ref].v.includes("Grand Total"))) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: ws[cell_ref].v.includes("Refunds") ? "856404" : "00796B" } },
          fill: { fgColor: { rgb: ws[cell_ref].v.includes("Refunds") ? "FFF3CD" : "C8E6C9" } }
        };
      }

      // Style duplicate rows
      if (ws[cell_ref].v === "⚠️ Duplicate") {
        const row = ws[XLSX.utils.encode_cell({ c: 0, r: R })];
        if (row) {
          for (let c = 0; c < 12; c++) {
            const cell = ws[XLSX.utils.encode_cell({ c: c, r: R })];
            if (cell) {
              cell.s = {
                ...cell.s,
                font: { ...cell.s?.font, bold: true, color: { rgb: "D32F2F" } },
                fill: { fgColor: { rgb: "FFEBEE" } }
              };
            }
          }
        }
      }

      // Apply number format to Credit Amt, Paid Amount, Total Amount (columns 7, 8, 9)
      if ([7, 8, 9].includes(C) && R > 0 && ws[cell_ref].t !== 's') {
        ws[cell_ref].z = '0.00'; // Format as number with 2 decimal places
        ws[cell_ref].t = 'n'; // Explicitly set type to number
      }
    }
  }

  // Set column widths
  if (!ws['!cols']) ws['!cols'] = [];
  const colWidths = [6, 15, 12, 12, 25, 15, 20, 12, 12, 12, 12, 15, 10];
  colWidths.forEach((width, index) => {
    ws['!cols'][index] = { width };
  });

  const sheetName = `Pharmacy Report ${reportDateRange}`.substring(0, 31); // Excel sheet name limit
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
};


const exportOPAmountCollectionReport = (wb) => {
  const pharmacyDataArray = Array.isArray(OPAmountCollectiondata) ? OPAmountCollectiondata : [];
  const refundDataArray = Array.isArray(OPAmountCollectionRefunddata) ? OPAmountCollectionRefunddata : [];

  if (pharmacyDataArray.length === 0 && refundDataArray.length === 0) {
    alert("No data to export");
    return;
  }

  // Apply the same filtering logic as in the component
  const applyFilters = (data, isRefund = false) => {
    // This would need to replicate the filtering logic from ForOPAmountCollectionPrint
    // For simplicity, we'll export all data, but you can integrate the filter states
    return data;
  };

  const filteredPharmacyData = applyFilters(pharmacyDataArray);
  const filteredRefundData = applyFilters(refundDataArray, true);

  // Calculate totals
  const calculateTotals = (data, isRefund = false) => {
    if (!Array.isArray(data)) {
      return { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 };
    }
    return data.reduce(
      (acc, row) => {
        if (isRefund) {
          const refundAmount = parseFloat(row?.PaidAmount || 0);
          return {
            Creditamt: acc.Creditamt + refundAmount,
            Paid_Amount: acc.Paid_Amount,
            Total_Amount: acc.Total_Amount + refundAmount,
          };
        } else {
          const credit = parseFloat(row?.Creditamt || 0);
          const paid = parseFloat(row?.Paid_Amount || 0);
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + (credit + paid),
          };
        }
      },
      { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 }
    );
  };

  const pharmacyTotals = calculateTotals(filteredPharmacyData);
  const refundTotals = calculateTotals(filteredRefundData, true);
  const grandTotal = {
    Creditamt: pharmacyTotals.Creditamt + refundTotals.Creditamt,
    Paid_Amount: pharmacyTotals.Paid_Amount,
    Total_Amount: pharmacyTotals.Total_Amount + refundTotals.Total_Amount
  };

  // Format date range for sheet name
  const reportDateRange = searchOptions?.DateType === "Current"
    ? new Date(searchOptions?.CurrentDate || new Date())
        .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
        .replace(/\//g, "-")
    : `From ${new Date(searchOptions?.FromDate || new Date())
        .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
        .replace(/\//g, "-")} To ${new Date(searchOptions?.ToDate || new Date())
        .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
        .replace(/\//g, "-")}`;

  const rows = [];

  // Add header row
  rows.push({
    "S.No": "S.No",
    "Invoice No": "Invoice No",
    "Billing Date": "Billing Date",
    "Patient ID": "Patient ID",
    "Patient Name": "Patient Name",
    "Patient Category": "Patient Category",
    "Remarks": "Remarks",
    "Payment Method": "Payment Method",
    "Credit Amt": "Credit Amt",
    "Paid Amount": "Paid Amount",
    "Total Amount": "Total Amount",
    "Prepared by": "Prepared by",
    "Type": "Type" // Hidden column for internal use
  });

  let serialNumber = 1;

  // Process pharmacy data
  if (filteredPharmacyData.length > 0) {
    // Add pharmacy section header
    rows.push({
      "S.No": "",
      "Invoice No": "PHARMACY COLLECTIONS",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "",
      "Patient Category": "",
      "Remarks": "",
      "Payment Method": "",
      "Credit Amt": "",
      "Paid Amount": "",
      "Total Amount": "",
      "Prepared by": "",
      "Type": "SECTION_HEADER"
    });

    // Add pharmacy rows
    filteredPharmacyData.forEach((row) => {
      const credit = parseFloat(row?.Creditamt || 0);
      const paid = parseFloat(row?.Paid_Amount || 0);
      const total = credit + paid;

      rows.push({
        "S.No": serialNumber++,
        "Invoice No": row.InvoiceNo || "-",
        "Billing Date": row.BillingDate || "-",
        "Patient ID": row.PatientId || "-",
        "Patient Name": row.Patient_Name || "-",
        "Patient Category": row.PatCategory || "-",
        "Remarks": row.Remarks || "-",
        "Payment Method": row.CollectedType || "Unknown",
        "Credit Amt": credit,
        "Paid Amount": paid,
        "Total Amount": total,
        "Prepared by": row.created_by || "-",
        "Type": "PHARMACY"
      });
    });

    // Add pharmacy subtotal
    rows.push({
      "S.No": "",
      "Invoice No": "",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "Pharmacy Subtotal",
      "Patient Category": "",
      "Remarks": "",
      "Payment Method": "",
      "Credit Amt": pharmacyTotals.Creditamt,
      "Paid Amount": pharmacyTotals.Paid_Amount,
      "Total Amount": pharmacyTotals.Total_Amount,
      "Prepared by": "",
      "Type": "SUBTOTAL"
    });
  }

  // Process refund data
  if (filteredRefundData.length > 0) {
    // Add refund section header
    rows.push({
      "S.No": "",
      "Invoice No": "REFUNDS",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "",
      "Patient Category": "",
      "Remarks": "",
      "Payment Method": "",
      "Credit Amt": "",
      "Paid Amount": "",
      "Total Amount": "",
      "Prepared by": "",
      "Type": "SECTION_HEADER"
    });

    // Add refund rows
    filteredRefundData.forEach((row) => {
      const refundAmount = parseFloat(row?.PaidAmount || 0);

      rows.push({
        "S.No": serialNumber++,
        "Invoice No": row.Billinvoice || row.Invoice_NO || "-",
        "Billing Date": row.Billing_Date || "-",
        "Patient ID": row.PatientID || "-",
        "Patient Name": row.Patient_Name || "-",
        "Patient Category": row.PatCategory || "-",
        "Remarks": row.Remarks || "-",
        "Payment Method": row.paytype || "Unknown",
        "Credit Amt": refundAmount,
        "Paid Amount": 0,
        "Total Amount": refundAmount,
        "Prepared by": row.Billedby || "-",
        "Type": "REFUND"
      });
    });

    // Add refund subtotal
    rows.push({
      "S.No": "",
      "Invoice No": "",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "Refund Subtotal",
      "Patient Category": "",
      "Remarks": "",
      "Payment Method": "",
      "Credit Amt": refundTotals.Creditamt,
      "Paid Amount": refundTotals.Paid_Amount,
      "Total Amount": refundTotals.Total_Amount,
      "Prepared by": "",
      "Type": "SUBTOTAL"
    });
  }

  // Add grand total
  rows.push({
    "S.No": "",
    "Invoice No": "",
    "Billing Date": "",
    "Patient ID": "",
    "Patient Name": "GRAND TOTAL",
    "Patient Category": "",
    "Remarks": "",
    "Payment Method": "",
    "Credit Amt": grandTotal.Creditamt,
    "Paid Amount": grandTotal.Paid_Amount,
    "Total Amount": grandTotal.Total_Amount,
    "Prepared by": "",
    "Type": "GRAND_TOTAL"
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Apply styling and number formatting
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      
      if (!ws[cell_ref]) continue;

      // Style section headers
      if (ws[cell_ref].v && typeof ws[cell_ref].v === 'string' && 
          (ws[cell_ref].v === "PHARMACY COLLECTIONS" || ws[cell_ref].v === "REFUNDS")) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "2E7D32" }, sz: 12 },
          fill: { fgColor: { rgb: "E8F5E9" } },
          alignment: { horizontal: "center" }
        };
      }

      // Style totals
      if (ws[cell_ref].v && typeof ws[cell_ref].v === 'string' && 
          (ws[cell_ref].v.includes("Subtotal") || ws[cell_ref].v === "GRAND TOTAL")) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
          fill: { fgColor: { rgb: "1976D2" } }
        };
      }

      // Style header row
      if (R === 0) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
          fill: { fgColor: { rgb: "1976D2" } },
          border: {
            top: { style: "thin", color: { rgb: "0D47A1" } },
            left: { style: "thin", color: { rgb: "0D47A1" } },
            right: { style: "thin", color: { rgb: "0D47A1" } },
            bottom: { style: "thin", color: { rgb: "0D47A1" } }
          }
        };
      }

      // Apply number format to amount columns (Credit Amt: col 8, Paid Amount: col 9, Total Amount: col 10)
      if ([8, 9, 10].includes(C) && R > 0 && ws[cell_ref].t !== 's') {
        ws[cell_ref].z = '0.00';
        ws[cell_ref].t = 'n';
      }

      // Hide Type column (last column)
      if (C === 12) {
        ws[cell_ref].s = { ...ws[cell_ref].s, hidden: true };
      }
    }
  }

  // Set column widths
  if (!ws['!cols']) ws['!cols'] = [];
  const colWidths = [
    6,    // S.No
    15,   // Invoice No
    12,   // Billing Date
    12,   // Patient ID
    25,   // Patient Name
    15,   // Patient Category
    20,   // Remarks
    12,   // Payment Method
    12,   // Credit Amt
    12,   // Paid Amount
    12,   // Total Amount
    15,   // Prepared by
    0     // Type (hidden)
  ];
  
  colWidths.forEach((width, index) => {
    ws['!cols'][index] = { width };
  });

  // Auto-filter for data rows
  const dataStartRow = 2; // Skip header and first section header
  const dataEndRow = rows.length - 1;
  if (dataStartRow <= dataEndRow) {
    ws['!autofilter'] = {
      ref: `A${dataStartRow}:L${dataEndRow}`
    };
  }

  const sheetName = `OP Amount Collection ${reportDateRange}`.substring(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
};


const exportIPAmountCollectionReport = (wb, filters = {}) => {
  const {
    searchTerm = "",
    showOnlyDuplicates = false,
    pharmacyTypeFilter = "All",
    statusFilter = "All",
    paymentMethodFilter = "All",
    fromBillNo = "",
    toBillNo = "",
    pharmacyDataArray = Array.isArray(IPAmountCollectiondata) ? IPAmountCollectiondata : [],
    refundDataArray = Array.isArray(IPAmountCollectionRefunddata) ? IPAmountCollectionRefunddata : []
  } = filters;

  if (pharmacyDataArray.length === 0 && refundDataArray.length === 0) {
    alert("No data to export");
    return;
  }

  // Helper functions (adapted for IP - adjust BillType if IP has different types)
  const getPharmacyType = (item) => {
    if (item.BillType === "IPPharmacy") return "IPPharmacy"; // Adjust if IP has specific types
    if (item.BillType === "WalkinPharmacy") return "WalkinPharmacy";
    return "Other";
  };

  const getStatus = (item) => {
    return item.Bill_Status || "Other";
  };

  const getBillNumber = (item) => {
    return item.InvoiceNo || "";
  };

  const getPaymentMethod = (item) => {
    return item.CollectedType || item.paytype || "Unknown";
  };

  // Duplicate detection functions (same as OP)
  const detectDuplicates = (pharmacyData) => {
    const duplicateMap = {};
    const duplicates = [];

    pharmacyData.forEach((item) => {
      const key = `${item.PatientId}-${item.InvoiceNo}-${parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0)}-${item.CollectedType}`;
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });

    Object.keys(duplicateMap).forEach((key) => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });

    return duplicates;
  };

  const detectRefundDuplicates = (refundData) => {
    const duplicateMap = {};
    const duplicates = [];
    
    refundData.forEach(item => {
      const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.paytype}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  const isDuplicatePharmacyItem = (item, allItems) => {
    const key = `${item.PatientId}-${item.InvoiceNo}-${parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0)}-${item.CollectedType}`;
    const matchingItems = allItems.filter(
      (i) => `${i.PatientId}-${i.InvoiceNo}-${parseFloat(i.Creditamt || 0) + parseFloat(i.Paid_Amount || 0)}-${i.CollectedType}` === key
    );
    return matchingItems.length > 1;
  };

  const isDuplicateRefundItem = (item, allRefunds) => {
    const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.paytype}`;
    const matchingRefunds = allRefunds.filter(r => 
      `${r.PatientID}-${r.Billinvoice || r.Invoice_NO}-${r.TotalAmount}-${r.paytype}` === key
    );
    return matchingRefunds.length > 1;
  };

  // Filter functions (update pharmacyTypeFilter options if IP has different types)
  const filterDataWithoutBillRange = (data, isRefund = false) => {
    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const pharmacyType = isRefund ? "Refund" : getPharmacyType(item);
      const matchesPharmacyType =
        pharmacyTypeFilter === "All" ||
        (pharmacyTypeFilter === "IPPharmacy" && pharmacyType === "IPPharmacy") || // Adjusted for IP
        (pharmacyTypeFilter === "WalkinPharmacy" && pharmacyType === "WalkinPharmacy") ||
        (pharmacyTypeFilter === "Refund" && isRefund);

      const status = isRefund ? "Refunded" : getStatus(item);
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Paid" && status === "Paid") ||
        (statusFilter === "Credit" && status === "Credit") ||
        (statusFilter === "Refunded" && isRefund);

      const paymentMethod = getPaymentMethod(item);
      const matchesPaymentMethod =
        paymentMethodFilter === "All" ||
        paymentMethod === paymentMethodFilter;

      return matchesSearch && matchesPharmacyType && matchesStatus && matchesPaymentMethod;
    });
  };

  const getDynamicBillNumbers = () => {
    const intermediateBilledData = filterDataWithoutBillRange(pharmacyDataArray);
    const intermediateRefundData = filterDataWithoutBillRange(refundDataArray, true);
    const allIntermediateItems = [...intermediateBilledData, ...intermediateRefundData];
    const billNumbers = allIntermediateItems
      .map((item) => getBillNumber(item))
      .filter((billNo) => billNo && billNo.trim() !== "")
      .sort();
    return [...new Set(billNumbers)];
  };

  const billNumberOptions = getDynamicBillNumbers();

  const filterData = (data, isRefund = false) => {
    let intermediateData = filterDataWithoutBillRange(data, isRefund);
    return intermediateData.filter((item) => {
      const billNo = getBillNumber(item);
      let matchesBillNoRange = true;
      if (fromBillNo && toBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex && currentIndex <= toIndex;
      } else if (fromBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex;
      } else if (toBillNo && billNumberOptions.length > 0) {
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex <= toIndex;
      }
      return matchesBillNoRange;
    });
  };

  // Apply filters
  const filteredBilledData = filterData(pharmacyDataArray);
  const filteredRefundData = filterData(refundDataArray, true);

  const displayBilledData = showOnlyDuplicates
    ? filteredBilledData.filter((item) => isDuplicatePharmacyItem(item, pharmacyDataArray))
    : filteredBilledData;

  const displayRefundData = showOnlyDuplicates
    ? filteredRefundData.filter((item) => isDuplicateRefundItem(item, refundDataArray))
    : filteredRefundData;

  // Calculate totals (same as OP)
  const calculateTotals = (data, isRefund = false) => {
    if (!Array.isArray(data)) {
      return { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 };
    }
    return data.reduce(
      (acc, row) => {
        if (isRefund) {
          const refundAmount = parseFloat(row?.PaidAmount || 0);
          return {
            Creditamt: acc.Creditamt + refundAmount,
            Paid_Amount: acc.Paid_Amount,
            Total_Amount: acc.Total_Amount + refundAmount,
          };
        } else {
          const credit = parseFloat(row?.Creditamt || 0);
          const paid = parseFloat(row?.Paid_Amount || 0);
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + (credit + paid),
          };
        }
      },
      { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 }
    );
  };

  const grandTotals = calculateTotals(displayBilledData);
  const refundTotals = calculateTotals(displayRefundData, true);

  // Format date range for filename (same as OP)
  const getReportDateRangeForFile = () => {
    return searchOptions?.DateType === "Current"
      ? new Date(searchOptions?.CurrentDate || new Date())
          .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
          .replace(/\//g, "-")
      : `From${new Date(searchOptions?.FromDate || new Date())
          .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
          .replace(/\//g, "-")}To${new Date(searchOptions?.ToDate || new Date())
          .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
          .replace(/\//g, "-")}`;
  };

  const reportDateRangeForFile = getReportDateRangeForFile();
  const rows = [];

  // Add header row (same columns as OP)
  rows.push({
    "S.No": "S.No",
    "Invoice No": "Invoice No",
    "Billing Date": "Billing Date",
    "Patient ID": "Patient ID",
    "Patient Name": "Patient Name",
    "Patient Category": "Patient Category",
    "Remarks": "Remarks",
    "Payment Method": "Payment Method",
    "Credit Amt": "Credit Amt",
    "Paid Amount": "Paid Amount",
    "Total Amount": "Total Amount",
    "Prepared by": "Prepared by",
    "Is Duplicate": "Is Duplicate", // Hidden
    "Type": "Type" // Hidden
  });

  let serialNumber = 1;

  // Add filter information
  const filterInfo = [];
  if (searchTerm) filterInfo.push(`Search: "${searchTerm}"`);
  if (pharmacyTypeFilter !== "All") filterInfo.push(`Type: ${pharmacyTypeFilter}`);
  if (statusFilter !== "All") filterInfo.push(`Status: ${statusFilter}`);
  if (paymentMethodFilter !== "All") filterInfo.push(`Payment: ${paymentMethodFilter}`);
  if (fromBillNo || toBillNo) filterInfo.push(`Bill Range: ${fromBillNo || "Start"}-${toBillNo || "End"}`);
  if (showOnlyDuplicates) filterInfo.push("Duplicates Only");

  if (filterInfo.length > 0) {
    rows.push({
      "S.No": "",
      "Invoice No": `FILTERS APPLIED: ${filterInfo.join(", ")}`,
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "",
      "Patient Category": "",
      "Remarks": "",
      "Payment Method": "",
      "Credit Amt": "",
      "Paid Amount": "",
      "Total Amount": "",
      "Prepared by": "",
      "Is Duplicate": "",
      "Type": "FILTER_INFO"
    });
  }

  // Process pharmacy data (labeled as IP Pharmacy Collections)
  if (displayBilledData.length > 0) {
    rows.push({
      "S.No": "",
      "Invoice No": `IP PHARMACY COLLECTIONS (${displayBilledData.length} records)`,
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "",
      "Patient Category": "",
      "Remarks": "",
      "Payment Method": "",
      "Credit Amt": "",
      "Paid Amount": "",
      "Total Amount": "",
      "Prepared by": "",
      "Is Duplicate": "",
      "Type": "SECTION_HEADER"
    });

    displayBilledData.forEach((row) => {
      const isDuplicate = isDuplicatePharmacyItem(row, pharmacyDataArray);
      const credit = parseFloat(row?.Creditamt || 0);
      const paid = parseFloat(row?.Paid_Amount || 0);
      const total = credit + paid;

      rows.push({
        "S.No": serialNumber++,
        "Invoice No": row.InvoiceNo || "-",
        "Billing Date": row.BillingDate || "-",
        "Patient ID": row.PatientId || "-",
        "Patient Name": row.Patient_Name || "-",
        "Patient Category": row.PatCategory || "-",
        "Remarks": row.Remarks || "-",
        "Payment Method": getPaymentMethod(row),
        "Credit Amt": credit,
        "Paid Amount": paid,
        "Total Amount": total,
        "Prepared by": row.created_by || "-",
        "Is Duplicate": isDuplicate ? "DUPLICATE" : "",
        "Type": "PHARMACY"
      });
    });

    rows.push({
      "S.No": "",
      "Invoice No": "",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "IP Pharmacy Subtotal",
      "Patient Category": "",
      "Remarks": "",
      "Payment Method": "",
      "Credit Amt": grandTotals.Creditamt,
      "Paid Amount": grandTotals.Paid_Amount,
      "Total Amount": grandTotals.Total_Amount,
      "Prepared by": "",
      "Is Duplicate": "",
      "Type": "SUBTOTAL"
    });
  }

  // Process refund data
  if (displayRefundData.length > 0) {
    rows.push({
      "S.No": "",
      "Invoice No": `REFUNDS (${displayRefundData.length} records)`,
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "",
      "Patient Category": "",
      "Remarks": "",
      "Payment Method": "",
      "Credit Amt": "",
      "Paid Amount": "",
      "Total Amount": "",
      "Prepared by": "",
      "Is Duplicate": "",
      "Type": "SECTION_HEADER"
    });

    displayRefundData.forEach((row) => {
      const isDuplicate = isDuplicateRefundItem(row, refundDataArray);
      const refundAmount = parseFloat(row?.PaidAmount || 0);

      rows.push({
        "S.No": serialNumber++,
        "Invoice No": row.Billinvoice || row.Invoice_NO || "-",
        "Billing Date": row.Billing_Date || "-",
        "Patient ID": row.PatientID || "-",
        "Patient Name": row.Patient_Name || "-",
        "Patient Category": row.PatCategory || "-",
        "Remarks": row.Remarks || "-",
        "Payment Method": getPaymentMethod(row),
        "Credit Amt": refundAmount,
        "Paid Amount": 0,
        "Total Amount": refundAmount,
        "Prepared by": row.Billedby || "-",
        "Is Duplicate": isDuplicate ? "DUPLICATE" : "",
        "Type": "REFUND"
      });
    });

    rows.push({
      "S.No": "",
      "Invoice No": "",
      "Billing Date": "",
      "Patient ID": "",
      "Patient Name": "Refund Subtotal",
      "Patient Category": "",
      "Remarks": "",
      "Payment Method": "",
      "Credit Amt": refundTotals.Creditamt,
      "Paid Amount": refundTotals.Paid_Amount,
      "Total Amount": refundTotals.Total_Amount,
      "Prepared by": "",
      "Is Duplicate": "",
      "Type": "SUBTOTAL"
    });
  }

  // Grand total
  const overallTotal = {
    Creditamt: grandTotals.Creditamt + refundTotals.Creditamt,
    Paid_Amount: grandTotals.Paid_Amount,
    Total_Amount: grandTotals.Total_Amount + refundTotals.Total_Amount
  };

  rows.push({
    "S.No": "",
    "Invoice No": "",
    "Billing Date": "",
    "Patient ID": "",
    "Patient Name": "GRAND TOTAL",
    "Patient Category": "",
    "Remarks": "",
    "Payment Method": "",
    "Credit Amt": overallTotal.Creditamt,
    "Paid Amount": overallTotal.Paid_Amount,
    "Total Amount": overallTotal.Total_Amount,
    "Prepared by": "",
    "Is Duplicate": "",
    "Type": "GRAND_TOTAL"
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Styling (same as OP)
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      
      if (!ws[cell_ref]) continue;

      const cellValue = ws[cell_ref].v;

      if (R === 0) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
          fill: { fgColor: { rgb: "1976D2" } },
          border: {
            top: { style: "thin", color: { rgb: "0D47A1" } },
            left: { style: "thin", color: { rgb: "0D47A1" } },
            right: { style: "thin", color: { rgb: "0D47A1" } },
            bottom: { style: "thin", color: { rgb: "0D47A1" } }
          }
        };
      }

      if (cellValue && typeof cellValue === 'string' && 
          (cellValue.includes("IP PHARMACY COLLECTIONS") || cellValue.includes("REFUNDS"))) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "2E7D32" }, sz: 12 },
          fill: { fgColor: { rgb: "E8F5E9" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }

      if (cellValue && typeof cellValue === 'string' && cellValue.includes("FILTERS APPLIED")) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "FF5722" }, sz: 10, italic: true },
          fill: { fgColor: { rgb: "FFF3E0" } },
          alignment: { horizontal: "left", wrapText: true }
        };
      }

      if (cellValue && typeof cellValue === 'string' && 
          (cellValue.includes("Subtotal") || cellValue === "GRAND TOTAL")) {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
          fill: { fgColor: { rgb: "1976D2" } }
        };
      }

      if (cellValue === "DUPLICATE") {
        ws[cell_ref].s = {
          font: { bold: true, color: { rgb: "D32F2F" }, sz: 9 },
          fill: { fgColor: { rgb: "FFEBEE" } }
        };
      }

      if ([8, 9, 10].includes(C) && R > 0 && typeof cellValue === 'number') {
        ws[cell_ref].z = '0.00';
        ws[cell_ref].t = 'n';
        ws[cell_ref].s = {
          ...ws[cell_ref].s,
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" }
          },
          alignment: { horizontal: "right" }
        };
      }

      if ([12, 13].includes(C)) {
        ws[cell_ref].s = { ...ws[cell_ref].s, hidden: true };
      }
    }
  }

  // Column widths (same)
  if (!ws['!cols']) ws['!cols'] = [];
  const colWidths = [
    6, 15, 12, 12, 30, 15, 25, 12, 12, 12, 12, 15, 0, 0
  ];
  colWidths.forEach((width, index) => {
    ws['!cols'][index] = { width };
  });

  // Auto-filter
  const dataStartRow = filterInfo.length > 0 ? 3 : 2;
  const dataEndRow = rows.length;
  if (dataStartRow < dataEndRow) {
    ws['!autofilter'] = { ref: `A${dataStartRow}:L${dataEndRow}` };
  }

  const baseSheetName = `IP Amount Collection ${reportDateRangeForFile}`;
  const sheetName = baseSheetName.substring(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Summary sheet
  if ((grandTotals.Paid_Amount > 0 || refundTotals.Creditamt > 0)) {
    const summaryRows = [];
    summaryRows.push({
      "Category": "SUMMARY",
      "Records": displayBilledData.length + displayRefundData.length,
      "Credit Amount": overallTotal.Creditamt,
      "Paid Amount": overallTotal.Paid_Amount,
      "Total Amount": overallTotal.Total_Amount,
      "Date Range": reportDateRangeForFile
    });

    summaryRows.push({});

    summaryRows.push({
      "Category": "IP Pharmacy Collections",
      "Records": displayBilledData.length,
      "Credit Amount": grandTotals.Creditamt,
      "Paid Amount": grandTotals.Paid_Amount,
      "Total Amount": grandTotals.Total_Amount,
      "Date Range": ""
    });

    if (displayRefundData.length > 0) {
      summaryRows.push({
        "Category": "Refunds",
        "Records": displayRefundData.length,
        "Credit Amount": refundTotals.Creditamt,
        "Paid Amount": refundTotals.Paid_Amount,
        "Total Amount": refundTotals.Total_Amount,
        "Date Range": ""
      });
    }

    const summaryWS = XLSX.utils.json_to_sheet(summaryRows);
    
    const summaryRange = XLSX.utils.decode_range(summaryWS['!ref']);
    for (let R = 0; R <= summaryRange.e.r; ++R) {
      for (let C = 0; C <= summaryRange.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        if (summaryWS[cellRef]) {
          if (R === 0) {
            summaryWS[cellRef].s = {
              font: { bold: true, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "1976D2" } }
            };
          }
          if ([2, 3, 4].includes(C) && R > 0 && typeof summaryWS[cellRef].v === 'number') {
            summaryWS[cellRef].z = '0.00';
            summaryWS[cellRef].t = 'n';
          }
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, summaryWS, "Summary");
  }
};




  const [comprehensiveSummary, setComprehensiveSummary] = useState({});
    const [netAmount, setNetAmount] = useState(0);

    const [paymentSummary, setPaymentSummary] = useState({
        cash: 0,
        upi: 0,
        card: 0,
        total: 0
      });
      const [departmentTotals, setDepartmentTotals] = useState({});
  

 useEffect(() => {
    const calculateComprehensiveSummary = () => {
      const summary = {
        // Revenue Sections
        opServices: 0,
        ipServices: 0,
        advances: 0,
        finalBillCash: 0,
        
        // Deduction Sections
        opDiscounts: 0,
        ipDiscounts: 0,
        finalBillRefunds: 0,
        billingRefunds: 0,
        advanceRefunds: 0,
        
        // Department-wise totals
        departments: {}
      };

      // OP Services
      if (OPServicesclosing?.services) {
        OPServicesclosing.services
          .filter(item => item.Itemstatus === 'Paid' || item.Itemstatus === 'Refunded')
          .forEach(item => {
            const amount = parseFloat(item.PaidAmount || 0);
            summary.opServices += amount;
            
            // Department breakdown
            const serviceType = item.Service_Type || 'UNKNOWN';
            if (serviceType === 'RADIOLOGY') {
              const radiologyDept = item.RadiologyDept || 'Other Radiology';
              const deptKey = `RADIOLOGY - ${radiologyDept}`;
              summary.departments[deptKey] = (summary.departments[deptKey] || 0) + amount;
            } else {
              summary.departments[serviceType] = (summary.departments[serviceType] || 0) + amount;
            }
          });
      }

      // IP Services
      if (IPServicesclosing?.services) {
        IPServicesclosing.services
          .filter(item => item.Itemstatus === 'Paid')
          .forEach(item => {
            const amount = parseFloat(item.PaidAmount || 0);
            summary.ipServices += amount;
            
            // Department breakdown
            const serviceType = item.Service_Type || 'UNKNOWN';
            if (serviceType === 'RADIOLOGY') {
              const radiologyDept = item.RadiologyDept || 'Other Radiology';
              const deptKey = `RADIOLOGY - ${radiologyDept}`;
              summary.departments[deptKey] = (summary.departments[deptKey] || 0) + amount;
            } else {
              summary.departments[serviceType] = (summary.departments[serviceType] || 0) + amount;
            }
          });
      }

      // Advances
      if (Advanceclosing && Array.isArray(Advanceclosing)) {
        summary.advances = Advanceclosing.reduce((sum, advance) => 
          sum + parseFloat(advance.AdvanceAmount || 0), 0);
      }

      // Final Bill Cash
      if (FinalBillDetails && Array.isArray(FinalBillDetails)) {
        summary.finalBillCash = FinalBillDetails
          .filter(bill => bill.BillStatus === "Cash")
          .reduce((sum, bill) => sum + parseFloat(bill.Paidamt || 0), 0);
        
        // Final Bill Refunds
        summary.finalBillRefunds = FinalBillDetails
          .filter(bill => bill.BillStatus === "Refund")
          .reduce((sum, bill) => sum + parseFloat(bill.Refundamt || 0), 0);
      }

      // Discounts
      summary.opDiscounts = OPDiscountclosing?.grand_total_discount 
        ? parseFloat(OPDiscountclosing.grand_total_discount) || 0 
        : 0;
      
      summary.ipDiscounts = IPDiscountclosing?.grand_total_discount 
        ? parseFloat(IPDiscountclosing.grand_total_discount) || 0 
        : 0;

      // Billing Refunds
      summary.billingRefunds = Refundclosing?.grand_total 
        ? parseFloat(Refundclosing.grand_total) || 0 
        : 0;

      // Advance Refunds
      if (AdvanceRefundclosing && Array.isArray(AdvanceRefundclosing)) {
        summary.advanceRefunds = AdvanceRefundclosing.reduce((sum, refund) => 
          sum + parseFloat(refund.Refundamt || 0), 0);
      }

      setComprehensiveSummary(summary);
    };
    
    calculateComprehensiveSummary();
  }, [
    OPServicesclosing,
    IPServicesclosing,
    OPDiscountclosing,
    IPDiscountclosing,
    Advanceclosing,
    AdvanceRefundclosing,
    FinalBillDetails,
    Refundclosing
  ]);

  useEffect(() => {
    const calculateNetAmount = () => {
      const totalRevenue = comprehensiveSummary.opServices + 
                          comprehensiveSummary.ipServices + 
                          comprehensiveSummary.advances + 
                          comprehensiveSummary.finalBillCash;
      
      const totalDiscounts = comprehensiveSummary.opDiscounts + comprehensiveSummary.ipDiscounts;
      
      const totalDeductions = comprehensiveSummary.finalBillRefunds + 
                             comprehensiveSummary.billingRefunds + 
                             comprehensiveSummary.advanceRefunds;
      
      const net = (totalRevenue - totalDiscounts) - totalDeductions;
      
      setNetAmount(net);
      
      // Calculate payment summary
      const cashTotal = totalRevenue - totalDiscounts;
      setPaymentSummary({
        cash: cashTotal,
        upi: 0,
        card: 0,
        total: cashTotal
      });
    };
    
    if (Object.keys(comprehensiveSummary).length > 0) {
      calculateNetAmount();
    }
  }, [comprehensiveSummary]);


//   const handleExportClosingSummary = () => {
//   const wb = XLSX.utils.book_new();
  
//   exportClosingSummaryReport(wb, {
//     OPServicesclosing,
//     IPServicesclosing,
//     OPDiscountclosing,
//     IPDiscountclosing,
//     Advanceclosing,
//     AdvanceRefundclosing,
//     FinalBillDetails,
//     Refundclosing,
//     searchOptions
//   });
  
//   XLSX.writeFile(wb, `Closing_Summary_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
// };


  useEffect(() => {
    setPrintBySpeciality(SelectedSpecialities.length > 0);
  }, [SelectedSpecialities]);

  const isSpecialityChecked = (speciality) => {
    return SelectedSpecialities.some(
      (item) =>
        `${item.SpecialityName} | ${item.Speciality_Id}` ===
        `${speciality.SpecialityName} | ${speciality.Speciality_Id}`
    );
  };

  const isServicesChecked = (service) => {
    return selectedServices.some(
      (item) =>
        `${item.ServiceCategory} | ${item.Serviceid}` ===
        `${service.ServiceCategory} | ${service.Serviceid}`
    );
  };

  const isUserChecked = (user) => {
    return SelectedUsers.some(
      (item) =>
        `${item.username} | ${item.Employee_Id}` ===
        `${user.username} | ${user.Employee_Id}`
    );
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => {
        const ress = res.data;
        setSpecialityData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const handleCheckboxChangeSpeciality = (event, speciality) => {
    const { checked, value } = event.target;

    setSelectedSpecialities((prev) => {
      if (checked) {
        return [
          ...prev,
          {
            SpecialityName: speciality.SpecialityName,
            Speciality_Id: speciality.Speciality_Id,
          },
        ];
      } else {
        return prev.filter(
          (item) => `${item.SpecialityName} | ${item.Speciality_Id}` !== value
        );
      }
    });
  };

  const handleCheckboxChangeService = (event, service) => {
    const { checked, value } = event.target;

    setSelectedServices((prev) => {
      if (checked) {
        return [
          ...prev,
          {
            ServiceCategory: service.ServiceCategory,
            Serviceid: service.Serviceid,
          },
        ];
      } else {
        return prev.filter(
          (item) => `${item.ServiceCategory} | ${item.Serviceid}` !== value
        );
      }
    });
  };

  const handleSelectAllSpecialities = (event) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedSpecialities(
        SpecialityData.map((speciality) => ({
          SpecialityName: speciality.SpecialityName,
          Speciality_Id: speciality.Speciality_Id,
        }))
      );
    } else {
      setSelectedSpecialities([]);
    }
  };

  const handleSelectAllServices = (event) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedServices(
        ServicesList.map((service) => ({
          ServiceCategory: service.ServiceCategory,
          Serviceid: service.Serviceid,
        }))
      );
    } else {
      setSelectedServices([]);
    }
  };

  const handleCheckboxChangeUser = (event, user) => {
    const { checked, value } = event.target;

    setSelectedUsers((prev) => {
      if (checked) {
        return [
          ...prev,
          {
            username: user.username,
            Employee_Id: user.Employee_Id,
          },
        ];
      } else {
        return prev.filter(
          (item) => `${item.username} | ${item.Employee_Id}` !== value
        );
      }
    });
  };

  const [DueFilterdata, setdueFilterdata] = useState([]);
  const [TotalAmount, setTotalAmount] = useState("");
  const [PaymentType, setPaymentType] = useState([]);
  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  const [SearchQuery, setSearchQuery] = useState({
    searchBy: "",
    Status: "Pending",
  });
  const [searchOptions, setSearchOptions] = useState({
    DateType: "Current",
    CurrentDate: formatDate(new Date()),
    FromDate: "",
    ToDate: "",
    SearchbyFirstName: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    SearchStatus: "Paid",
    BillType: "",
    userid: UserData?.username,
  });

  console.log(searchOptions, "searchOptions");

  console.log(ServicesList, "ServicesList");

  const openModal = () => {
    setOpenModal2(true);
  };

  const handleCloseModal1 = () => {
    setOpenModal2(false);
    setOpenModalService2(false);
    setOpenModalService3(false);
  };

  const openModaloverall = () => {
    setOpenModaloverall(true);
  };

  const handleCloseModaloverall = () => {
    setOpenModaloverall(false);
  };

  const openModalDepoverall = () => {
    setOpenModalDepoverall(true);
  };

  const handleCloseDepModaloverall = () => {
    setOpenModalDepoverall(false);
  };

  const openModalConsultoverall = () => {
    setOpenModalConsultoverall(true);
  };

  const handleCloseConsultModaloverall = () => {
    setOpenModalConsultoverall(false);
  };

  const openModalConsultOverallprint = () => {
    setOpenModalConsultOverallprint(true);
  };

  const openModalRefundPrint = () => {
    setOpenmodalRefundUserprint(true);
  };

  const openModalAdvancePrint = () => {
    setOpenmodalAdvanceprint(true);
  };

  const openModalFinalBillPrint = () => {
    setOpenmodalFinalBillprint(true);
  };

  const closeModalFinalBillPrint = () => {
    setOpenmodalFinalBillprint(false);
  };

  const openModalFinalCreditBillPrint = () => {
    setOpenmodalFinalCreditBillprint(true);
  };

  const closeModalFinalCreditBillPrint = () => {
    setOpenmodalFinalCreditBillprint(false);
  };


  const openModalSummaryPrint = () => {
    setOpenmodalSummaryprint(true);
  };

  const closeModalSummaryPrint = () => {
    setOpenmodalSummaryprint(false);
  };

  const openModalClosingPrint = () => {
    setOpenmodalClosingprint(true);
  };

  const closeModalClosingPrint = () => {
    setOpenmodalClosingprint(false);
  };

  const [OpenmodalIPPharmacyprint,setOpenmodalIPPharmacyprint] = useState(false)
  const [OpenmodalOPPharmacyprint,setOpenmodalOPPharmacyprint] = useState(false)
  const [OpenmodalAllPharmacyprint,setOpenmodalAllPharmacyprint] = useState(false)
  const [OpenmodalClosingSummaryprint,setOpenmodalClosingSummaryprint] = useState(false)
  const [OpenmodalIPAmountCollectionprint,setOpenmodalIPAmountCollectionprint] = useState(false)
  const [OpenmodalOPAmountCollectionprint,setOpenmodalOPAmountCollectionprint] = useState(false)

  const openModalIPPharmacyPrint = () => {
    setOpenmodalIPPharmacyprint(true);
  };

  const closeModalIPPharmacyPrint = () => {
    setOpenmodalIPPharmacyprint(false);
  };

  const openModalOPPharmacyPrint = () => {
    setOpenmodalOPPharmacyprint(true);
  };

  const closeModalOPPharmacyPrint = () => {
    setOpenmodalOPPharmacyprint(false);
  };

  const openModalAllPharmacyPrint = () => {
    setOpenmodalAllPharmacyprint(true);
  };

  const closeModalAllPharmacyPrint = () => {
    setOpenmodalAllPharmacyprint(false);
  };


  const openModalIPAmountCollectionPrint = () => {
    setOpenmodalIPAmountCollectionprint(true);
  };

  const closeModalIPAmountCollectionPrint = () => {
    setOpenmodalIPAmountCollectionprint(false);
  };


  const openModalOPAmountCollectionPrint = () => {
    setOpenmodalOPAmountCollectionprint(true);
  };

  const closeModalOPAmountCollectionPrint = () => {
    setOpenmodalOPAmountCollectionprint(false);
  };


  const openModalClosingSummaryPrint = () => {

    console.log('trueeeeeeeeeeee')
    setOpenmodalClosingSummaryprint(true);
  };

  const closeModalClosingSummaryPrint = () => {
    setOpenmodalClosingSummaryprint(false);
  };



  const handleCloseConsultOverallModal = () => {
    setOpenModalConsultOverallprint(false);
  };

  const handleCloseRefundPrint = () => {
    setOpenmodalRefundUserprint(false);
  };


  const handleCloseAdvancePrint = () => {
    setOpenmodalAdvanceprint(false);
  };

  // First useEffect
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

      try {
        let url = "";
        let setter = null;
        let params = {
          ...searchOptions,
          SelectedSpecialityIds: SelectedSpecialities.map(
            (s) => s.Speciality_Id
          ),
          SelectedUsers: SelectedUsers.map((s) => s.username),
          selectedServices: selectedServices.map((s) => s.ServiceCategory),
        };

        switch (viewType) {
          case "UserWise":
            url = `${UrlLink}Frontoffice/userwise_OP_Patient_Report`;
            setter = setFilterdata;
            break;
          case "Overall":
            url = `${UrlLink}Frontoffice/userwise_OP_Patient_Report_Overall`;
            setter = setFilterOveralldata;
            break;
          case "ServiceWise":
            url = `${UrlLink}Frontoffice/Services_Paid_Wise_Report`;
            setter = setFilterservicesdata;
            break;
          case "Consultationuserwise":
            url = `${UrlLink}Frontoffice/Consultation_Paid_userwiseReport`;
            setter = setFilterconsultationdata;
            delete params.SelectedUsers;
            break;
          case "Consultationoverall":
            url = `${UrlLink}Frontoffice/Consultation_Paid_userwiseReport`;
            setter = setFilterconsultationdata;
            delete params.userid;
            break;
          case "Refund":
            url = `${UrlLink}Frontoffice/Refund_Report`;
            setter = setFilterRefunddata;
            delete params.userid;
            break;

          case "Advance":
            url = `${UrlLink}Frontoffice/Advance_Report`;
            setter = setAdvanceData;
            delete params.userid;
            break;
          
          case "Summary":
            url = `${UrlLink}Frontoffice/Combined_Financial_Report`;
            setter = setSummaryData;
            delete params.userid;
            break;

          case "FinalBill":
            url = `${UrlLink}Frontoffice/IPFinalBill_Details_Link`;
            setter = setFinalBillData;
            delete params.userid;
            break;     
            
          case "OutstandingCredits":
            url = `${UrlLink}Frontoffice/IPFinalBill_Details_Link_Credit`;
            setter = setFinalBillCredit;
            delete params.userid;
            break; 

          case "IPPharmacy":
            url = `${UrlLink}Frontoffice/IPPharmacy_Paid_Wise_Report`;
            setter = setIPPharmacy;
            delete params.userid;
            break; 

          case "FreePharmacy":
            url = `${UrlLink}Frontoffice/FreePharmacy_Paid_Wise_Report`;
            setter = setFreePharmacy;
            delete params.userid;
            break;

          case "Pharmacy":
            url = `${UrlLink}Frontoffice/Pharmacy_Paid_Wise_Report`;
            setter = setAllPharmacy;
            delete params.userid;
            break;

          default:
            return;
        }

        const res = await axios.get(url, {
          params,
          cancelToken: newSource.token,
        });
        const responseData = res.data;

        if (viewType === "ServiceWise") {
          setter(responseData || {});
        } else if (viewType === "Refund") {
          setter(responseData || {});
        } else if (viewType === "Advance") {
          setter(responseData || {});
        }
        else if (viewType === "Summary") {
          setter(responseData || {});
        }
        else if (viewType === "FinalBill") {
          setter(responseData || {});
        }
        else if (viewType === "OutstandingCredits") {
          setter(responseData || {});
        }
        else if(viewType === "IPPharmacy"){
          setter(responseData || {});
        }
         else if(viewType === "FreePharmacy"){
          setter(responseData || {});
        }
        else if(viewType === "Pharmacy"){
          setter(responseData || {});
        }
        else if (
          viewType === "Consultationuserwise" ||
          viewType === "Consultationoverall"
        ) {
          setter({
            newpatients: Array.isArray(responseData.newpatients)
              ? responseData.newpatients
              : [],
            newbillcount: responseData.newbillcount || 0,
            new_grand_total: responseData.new_grand_total || 0,
            oldpatients: Array.isArray(responseData.oldpatients)
              ? responseData.oldpatients
              : [],
            oldbillcount: responseData.oldbillcount || 0,
            old_grand_total: responseData.old_grand_total || 0,
          });
        } else {
          setter({
            OPNew: Array.isArray(responseData.OPNew) ? responseData.OPNew : [],
            OPOld: Array.isArray(responseData.OPOld) ? responseData.OPOld : [],
            OPRef: Array.isArray(responseData.OPRef) ? responseData.OPRef : [],
          });
        }
        setTotalAmount(
          parseFloat(responseData.total_paid_amount || 0).toFixed(2)
        );
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching report data:", err);
        if (viewType === "ServiceWise") {
          setFilterservicesdata({});
        } else if (viewType === "Overall") {
          setFilterOveralldata({ OPNew: [], OPOld: [], OPRef: [] });
        } else if (viewType === "UserWise") {
          setFilterdata({ OPNew: [], OPOld: [], OPRef: [] });
        } 
        else if (viewType === "Advance") {
          setAdvanceData({});
        } 
        
        else if (
          viewType === "Consultationuserwise" ||
          viewType === "Consultationoverall"
        ) {
          setFilterconsultationdata({
            newpatients: [],
            newbillcount: 0,
            new_grand_total: 0,
            oldpatients: [],
            oldbillcount: 0,
            old_grand_total: 0,
          });
        }
        setTotalAmount("0.00");
      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);

  useEffect(() => {
    if (viewType !== "ServiceWise") return;

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
        SelectedSpecialityIds: SelectedSpecialities.map((s) => s.Speciality_Id),
        SelectedUsers: SelectedUsers.map((s) => s.username),
        selectedServices: selectedServices.map((s) => s.ServiceCategory),
      };
      delete params.userid;

      try {
        // Fetch Refund Data
        const refundRes = await axios.get(
          `${UrlLink}Frontoffice/Refund_userwiseReport`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setFilterRefundUser(refundRes.data);

        // Fetch Discount Data
        const discountRes = await axios.get(
          `${UrlLink}Frontoffice/Discount_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setFilterDiscountUser(discountRes.data);

        const ipadvanceRes = await axios.get(
          `${UrlLink}Frontoffice/IPDiscount_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setIPDiscount(ipadvanceRes.data);

        const ipservicesRes = await axios.get(
          `${UrlLink}Frontoffice/IPServices_Paid_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setIPServicesdata(ipservicesRes.data);

        






        
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching data:", err);
        setFilterRefundUser({});
        setFilterDiscountUser({});
      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);


  useEffect(() => {
    if (viewType !== "ClosingReport") return;

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
        SelectedSpecialityIds: SelectedSpecialities.map((s) => s.Speciality_Id),
        SelectedUsers: SelectedUsers.map((s) => s.username),
        selectedServices: selectedServices.map((s) => s.ServiceCategory),
      };
      delete params.userid;

      try {
        // Fetch Refund Data
        const opservicesRes = await axios.get(
          `${UrlLink}Frontoffice/Services_Paid_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setOPServicesclosing(opservicesRes.data);

        // Fetch Discount Data
        const discountRes = await axios.get(
          `${UrlLink}Frontoffice/Discount_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setOPDiscountclosing(discountRes.data);

        const ipdisRes = await axios.get(
          `${UrlLink}Frontoffice/IPDiscount_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setIPDiscountclosing(ipdisRes.data);

        const ipservicesRes = await axios.get(
          `${UrlLink}Frontoffice/IPServices_Paid_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setIPServicesclosing(ipservicesRes.data);

        const advanceRes = await axios.get(
          `${UrlLink}Frontoffice/Advance_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setAdvanceclosing(advanceRes.data);


        const advancerefundRes = await axios.get(
          `${UrlLink}Frontoffice/Advance_Refund_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setAdvanceRefundclosing(advancerefundRes.data);

        const FinalBillDetailsRes = await axios.get(
          `${UrlLink}Frontoffice/IPFinalBill_Details_Link_RefundCash`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setFinalBillDetails(FinalBillDetailsRes.data);

        const RefundclosingRes = await axios.get(
          `${UrlLink}Frontoffice/Refund_userwiseReport`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setRefundclosing(RefundclosingRes.data);






        
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching data:", err);
        setFinalBillDetails({});
        setAdvanceclosing({});
        setAdvanceRefundclosing({});
        setOPServicesclosing({});
        setIPServicesclosing({});
        setOPDiscountclosing({});
        setIPDiscountclosing({});

      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);

  useEffect(() => {
    if (viewType !== "ClosingSummary") return;

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
        SelectedSpecialityIds: SelectedSpecialities.map((s) => s.Speciality_Id),
        SelectedUsers: SelectedUsers.map((s) => s.username),
        selectedServices: selectedServices.map((s) => s.ServiceCategory),
      };
      delete params.userid;

      try {
        // Fetch Refund Data
        const opservicesRes = await axios.get(
          `${UrlLink}Frontoffice/Services_Paid_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setOPServicesclosing(opservicesRes.data);

        // Fetch Discount Data
        const discountRes = await axios.get(
          `${UrlLink}Frontoffice/Discount_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setOPDiscountclosing(discountRes.data);

        const ipdisRes = await axios.get(
          `${UrlLink}Frontoffice/IPDiscount_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setIPDiscountclosing(ipdisRes.data);

        const ipservicesRes = await axios.get(
          `${UrlLink}Frontoffice/IPServices_Paid_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setIPServicesclosing(ipservicesRes.data);

        const advanceRes = await axios.get(
          `${UrlLink}Frontoffice/Advance_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setAdvanceclosing(advanceRes.data);


        const advancerefundRes = await axios.get(
          `${UrlLink}Frontoffice/Advance_Refund_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setAdvanceRefundclosing(advancerefundRes.data);

        const FinalBillDetailsRes = await axios.get(
          `${UrlLink}Frontoffice/IPFinalBill_Details_Link_RefundCash`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setFinalBillDetails(FinalBillDetailsRes.data);

        const RefundclosingRes = await axios.get(
          `${UrlLink}Frontoffice/Refund_userwiseReport`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setRefundclosing(RefundclosingRes.data);






        
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching data:", err);
        setFinalBillDetails({});
        setAdvanceclosing({});
        setAdvanceRefundclosing({});
        setOPServicesclosing({});
        setIPServicesclosing({});
        setOPDiscountclosing({});
        setIPDiscountclosing({});

      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);

   useEffect(() => {
    if (viewType !== "Advance") return;

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
        SelectedSpecialityIds: SelectedSpecialities.map((s) => s.Speciality_Id),
        SelectedUsers: SelectedUsers.map((s) => s.username),
        selectedServices: selectedServices.map((s) => s.ServiceCategory),
      };
      delete params.userid;

      try {
        

        const advanceRes = await axios.get(
          `${UrlLink}Frontoffice/Advance_Refund_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setAdvanceRefundData(advanceRes.data);


        
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching data:", err);
        setAdvanceRefundData({});
      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);


  useEffect(() => {
    if (viewType !== "Summary") return;

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
        SelectedSpecialityIds: SelectedSpecialities.map((s) => s.Speciality_Id),
        SelectedUsers: SelectedUsers.map((s) => s.username),
        selectedServices: selectedServices.map((s) => s.ServiceCategory),
      };
      delete params.userid;

      try {
        

        const summaryRes = await axios.get(
          `${UrlLink}Frontoffice/Combined_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setFinalSummary(summaryRes.data);


        
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching data:", err);
        setAdvanceRefundData({});
      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);


  const [PharmacyRefund,setPharmacyRefund] = useState([]);
  const [walkinPharmacyRefund,setwalkinPharmacyRefund] = useState([]);
  const [walkinPharmacy,setwalkinPharmacy] = useState([]);
  const [Walkinpharmacyrefund,setWalkinpharmacyrefund] = useState([]);

  const [OPPharmacydata,setOPPharmacydata] = useState([])
  const [OPPharmacyRefunddata,setOPPharmacyRefunddata] = useState([])


  useEffect(() => {
    if (viewType !== "Pharmacy") return;

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
        SelectedUsers: SelectedUsers.map((s) => s.username),
      };
      delete params.userid;

      try {
        

        const pharmacyRes = await axios.get(
          `${UrlLink}Frontoffice/Pharmacy_Refund_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setPharmacyRefund(pharmacyRes.data);

        const walkinpharmacyRes = await axios.get(
          `${UrlLink}Frontoffice/Walk_in_Pharmacy_Paid_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setwalkinPharmacy(walkinpharmacyRes.data);

        const walkinpharmacyrefundRes = await axios.get(
          `${UrlLink}Frontoffice/WalkinPharmacy_Refund_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setWalkinpharmacyrefund(walkinpharmacyrefundRes.data);

     


        
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching data:", err);
        setPharmacyRefund({});
      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);


  useEffect(() => {
    if (viewType !== "OPPharmacy") return;

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
        SelectedUsers: SelectedUsers.map((s) => s.username),
      };
      delete params.userid;

      try {
        

        

       


        const oppharmacyRes = await axios.get(
          `${UrlLink}Frontoffice/OP_Pharmacy_Paid_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setOPPharmacydata(oppharmacyRes.data.data);

        const oppharmacyrefundRes = await axios.get(
          `${UrlLink}Frontoffice/OP_Pharmacy_Refund_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setOPPharmacyRefunddata(oppharmacyrefundRes.data.data);


        
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching data:", err);
        setPharmacyRefund({});
      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);


  const [IPAmountCollectiondata,setIPAmountCollectiondata] = useState([]);
  const [IPAmountCollectionRefunddata,setIPAmountCollectionRefunddata] = useState([]);

   useEffect(() => {
    if (viewType !== "IPAmountCollection") return;

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
        SelectedUsers: SelectedUsers.map((s) => s.username),
      };
      delete params.userid;

      try {
        

        

       


        const oppharmacyRes = await axios.get(
          `${UrlLink}Frontoffice/Pharmacy_Accept_Paid_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setIPAmountCollectiondata(oppharmacyRes.data.data);

        const oppharmacyrefundRes = await axios.get(
          `${UrlLink}Frontoffice/Pharmacy_Accept_Refund_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setIPAmountCollectionRefunddata(oppharmacyrefundRes.data.data);


        
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching data:", err);
        setPharmacyRefund({});
      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);




  const [OPAmountCollectiondata,setOPAmountCollectiondata] = useState([]);
  const [OPAmountCollectionRefunddata,setOPAmountCollectionRefunddata] = useState([]);

   useEffect(() => {
    if (viewType !== "OPAmountCollection") return;

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
        SelectedUsers: SelectedUsers.map((s) => s.username),
      };
      delete params.userid;

      try {
        
        const oppharmacyRes = await axios.get(
          `${UrlLink}Frontoffice/OPPharmacy_Accept_Paid_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setOPAmountCollectiondata(oppharmacyRes.data.data);

        const oppharmacyrefundRes = await axios.get(
          `${UrlLink}Frontoffice/OPPharmacy_Accept_Refund_Wise_Report`,
          {
            params,
            cancelToken: newSource.token,
          }
        );
        setOPAmountCollectionRefunddata(oppharmacyrefundRes.data.data);


        
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        console.error("Error fetching data:", err);
        setPharmacyRefund({});
      }
    };

    // Add debounce
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    // Cleanup
    return () => {
      clearTimeout(delayDebounce);
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled during cleanup.");
      }
    };
  }, [
    searchOptions,
    viewType,
    UrlLink,
    SelectedSpecialities,
    SelectedUsers,
    selectedServices,
  ]);




  


  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Insert_service_category_master`)
      .then((res) => {
        const responseData = res.data;

        if (responseData) {
          setServicesList(responseData);
        } else {
          setServicesList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching OP report data:", err);
        setServicesList([]);
      });
  }, [UrlLink]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlenewDocRegister = () => {
    dispatchvalue({ type: "OPBillingData", value: { type: "OP" } });
    dispatchvalue({ type: "IPBillingData", value: {} });
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "OverAllQuickBilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const HandleMovedatatobill = (params) => {
    dispatchvalue({ type: "OPBillingData", value: params });
    dispatchvalue({ type: "IPBillingData", value: {} });
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "QuickBilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const openModalService = () => {
    setOpenModalService2(true);
  };
  const openModalServiceUser = () => {
    setOpenModalService3(true);
  };

  useEffect(() => {
    const params = {
      deptid: ["8", "18"],
    };
    axios
      .get(`${UrlLink}Frontoffice/Employee_User_Get_Details`, { params })
      .then((response) => {
        const res = response.data;
        console.log(res, "lennnnnn");

        setFilteredUserList(res);
        setUserList(res);
      })
      .catch((e) => console.log(e));
  }, [UrlLink]);

  const handleCheckboxChange = (e, test) => {
    const { checked } = e.target;
    const selectedValue = {
      Serviceid: test.Serviceid,
      ServiceCategory: test.ServiceCategory,
    };

    setSearchOptions((prev) => {
      const existing = prev.selectedServices || [];

      const updatedServices = checked
        ? [...existing, selectedValue] // Add
        : existing.filter((item) => item.Serviceid !== test.Serviceid); // Remove

      return {
        ...prev,
        selectedServices: updatedServices,
      };
    });
  };
  const handleCheckboxUserChange = (e, test) => {
    const { checked } = e.target;
    const selectedValue = {
      Employee_Id: test.Employee_Id,
      UserName: test.username,
    };

    setSearchOptions((prev) => {
      const existing = prev.selectedUser || [];

      const updatedServices = checked
        ? [...existing, selectedValue] // Add
        : existing.filter((item) => item.Employee_Id !== test.Employee_Id); // Remove

      return {
        ...prev,
        selectedUser: updatedServices,
      };
    });
  };

  const handleSearchlabChange = (e) => {
    const query = e.target.value.toLowerCase();
    setsearchQuery(query);

    if (!query) {
      setFilteredTestList(TestNameList); // Reset to full list if empty
      return;
    }

    const filteredList = TestNameList.filter((test) =>
      test.ServiceCategory.toLowerCase().includes(query)
    );

    setFilteredTestList(filteredList);
  };

  const handleSearchUserChange = (e) => {
    const query = e.target.value.toLowerCase();
    console.log("queryyyy");

    setsearchUserQuery(query);

    if (!query) {
      setFilteredUserList(UserList); // Reset to full list if empty
      return;
    }
    console.log("fillll", filteredUserList);

    const filteredList = filteredUserList.filter(
      (test) => test.username && test.username.toLowerCase().includes(query)
    );

    setFilteredUserList(filteredList);
  };

  const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === "SearchbyPhoneNumber") {
      if (value.length <= 10) {
        setSearchOptions((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "DateType") {
      if (value === "Current") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: TodayDate,
          FromDate: "",
          ToDate: "",
        }));
      } else if (value === "Customize") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
        }));
      } else if (value === "All") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
          FromDate: "",
          ToDate: "",
        }));
      }
    } else if (name === "Service") {
      const matcheddata = ServicesList.find(
        (s) => String(s.Serviceid) === String(value)
      );

      console.log(matcheddata, "matcheddata");
      console.log(matcheddata?.ServiceCategory, "matcheddata");

      setSearchOptions((prev) => ({
        ...prev,
        Serviceid: value,
        Servicename: matcheddata?.ServiceCategory || "",
      }));
    } else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: async () => {
      navigate("/Home/CashierFolder");
      dispatchvalue({ type: "HrFolder", value: "UserWiseBillReport" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });

  const handlePrintClose = () => {
    setOpenModal2(false);
    setOpenModaloverall(false);
    setOpenModalDepoverall(false);
    setOpenModalConsultoverall(false);
    setOpenModalConsultOverallprint(false);
  };

  const ForPrintBillData = () => {
    const renderTableSection = (data, title) => {
      if (data.length === 0) return null;

      const subtotal = data
        .reduce((sum, row) => sum + parseFloat(row.PaidAmount || 0), 0)
        .toFixed(2);

      return (
        <>
          <tr>
            <td
              colSpan="8"
              style={{
                border: "none",
                padding: "10px 0",
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              {title}
            </td>
          </tr>
          {data.map((row, index) => (
            <tr key={`${title}-${index}`} style={{ fontSize: "10px" }}>
              <td style={{ padding: "6px", textAlign: "center" }}>
                {index + 1}
              </td>
              <td style={{ padding: "6px", textAlign: "center" }}>
                {row.PatientId || "-"}
              </td>
              <td style={{ padding: "6px", textAlign: "center" }}>
                {row.OPDate || "-"}
              </td>
              <td style={{ padding: "6px" }}>{row.Patient_Name || "-"}</td>
              <td style={{ padding: "6px" }}>{row.Doctor_Name || "-"}</td>
              <td style={{ padding: "6px" }}>{row.DeptName || "-"}</td>
              <td style={{ padding: "6px", textAlign: "right" }}>
                {parseFloat(row.PaidAmount || 0).toFixed(2)}
              </td>
              <td style={{ padding: "6px" }}>{row.PatientCategory || "-"}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", fontSize: "12px" }}>
            <td
              colSpan="6"
              style={{
                borderTop: "1px solid #000",
                padding: "6px",
                textAlign: "right",
              }}
            >
              Subtotal
            </td>
            <td
              style={{
                borderTop: "1px solid #000",
                padding: "6px",
                textAlign: "right",
              }}
            >
              {subtotal}
            </td>
            <td style={{ borderTop: "1px solid #000", padding: "6px" }}></td>
          </tr>
        </>
      );
    };

    return (
      <div
        ref={componentRef}
        style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}
      >
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <td colSpan="8" style={{ border: "none", textAlign: "center" }}>
                  <div>
                    <h2
                      style={{
                        margin: "0",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      KARUNA MEDICAL COLLEGE HOSPITAL
                    </h2>
                    <h1
                      style={{
                        margin: " 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Vilayodi, Chittur , Palakkad
                    </h1>
                    <p style={{ margin: "5px 0", fontSize: "14px" }}>
                      {searchOptions.DateType === "Current" ? (
                        <>
                          Report Date:{" "}
                          {new Date(searchOptions.CurrentDate)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "-")}
                        </>
                      ) : (
                        <>
                          Report From:{" "}
                          {new Date(searchOptions.FromDate)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "-")}{" "}
                          To:{" "}
                          {new Date(searchOptions.ToDate)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "-")}
                        </>
                      )}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="8" style={{ border: "none", textAlign: "left" }}>
                  <div style={{ fontSize: "14px", marginBottom: "10px" }}>
                    <span>User: </span>
                    <span style={{ fontWeight: "bold" }}>
                      {UserData?.username}
                    </span>
                  </div>
                </td>
              </tr>
              <tr
                style={{
                  backgroundColor: "#f0f0f0",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  S.No
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  OP No
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Date
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Patient Name
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Doctor
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Department
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Fees
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {renderTableSection(Filterdata.OPNew, "OP New")}
              {renderTableSection(Filterdata.OPOld, "OP Old")}
              {renderTableSection(Filterdata.OPRef, "OP Ref")}
              <tr style={{ fontWeight: "bold", fontSize: "12px" }}>
                <td
                  colSpan="6"
                  style={{
                    borderTop: "1px solid #000",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  Grand Total
                </td>
                <td
                  style={{
                    borderTop: "1px solid #000",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  {parseFloat(TotalAmount || 0).toFixed(2)}
                </td>
                <td
                  style={{ borderTop: "1px solid #000", padding: "6px" }}
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ForPrintBillDataOverall = () => {
    const renderTableSection = (data, title) => {
      if (data.length === 0) return null;

      const subtotal = data
        .reduce((sum, row) => sum + parseFloat(row.PaidAmount || 0), 0)
        .toFixed(2);

      return (
        <>
          <tr>
            <td
              colSpan="8"
              style={{
                border: "none",
                padding: "10px 0",
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              {title}
            </td>
          </tr>
          {data.map((row, index) => (
            <tr key={`${title}-${index}`} style={{ fontSize: "10px" }}>
              <td style={{ padding: "6px", textAlign: "center" }}>
                {index + 1}
              </td>
              <td style={{ padding: "6px", textAlign: "center" }}>
                {row.PatientId || "-"}
              </td>
              <td style={{ padding: "6px", textAlign: "center" }}>
                {row.OPDate || "-"}
              </td>
              <td style={{ padding: "6px" }}>{row.Patient_Name || "-"}</td>
              <td style={{ padding: "6px" }}>{row.Doctor_Name || "-"}</td>
              <td style={{ padding: "6px" }}>{row.DeptName || "-"}</td>
              <td style={{ padding: "6px", textAlign: "right" }}>
                {parseFloat(row.PaidAmount || 0).toFixed(2)}
              </td>
              <td style={{ padding: "6px" }}>{row.PatientCategory || "-"}</td>
              <td style={{ padding: "6px" }}>{row.created_by || "-"}</td>
            </tr>
          ))}
          <tr
            style={{
              borderTop: "1px solid #000",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            <td colSpan="6" style={{ padding: "6px", textAlign: "right" }}>
              Subtotal
            </td>
            <td
              style={{
                borderTop: "1px solid #000",
                padding: "6px",
                textAlign: "right",
              }}
            >
              {subtotal}
            </td>
            <td style={{ borderTop: "1px solid #000", padding: "6px" }}></td>
          </tr>
        </>
      );
    };

    return (
      <div
        ref={componentRef}
        style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}
      >
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <td colSpan="8" style={{ border: "none", textAlign: "center" }}>
                  <div>
                    <h2
                      style={{
                        margin: "0",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      KARUNA MEDICAL COLLEGE HOSPITAL
                    </h2>
                    <h1
                      style={{
                        margin: " 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Vilayodi, Chittur , Palakkad
                    </h1>
                    <p style={{ margin: "5px 0", fontSize: "14px" }}>
                      {searchOptions.DateType === "Current" ? (
                        <>
                          Report Date:{" "}
                          {new Date(searchOptions.CurrentDate)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "-")}
                        </>
                      ) : (
                        <>
                          Report From:{" "}
                          {new Date(searchOptions.FromDate)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "-")}{" "}
                          To:{" "}
                          {new Date(searchOptions.ToDate)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })
                            .replace(/\//g, "-")}
                        </>
                      )}
                    </p>
                  </div>
                </td>
              </tr>
              <tr
                style={{
                  backgroundColor: "#f0f0f0",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  S.No
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  OP No
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  OPDate
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Patient Name
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Doctor
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Dept Name
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Cash
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Category
                </th>
                <th style={{ border: "1px solid #000", padding: "6px" }}>
                  Prepared
                </th>
              </tr>
            </thead>
            <tbody>
              {renderTableSection(FilterOveralldata.OPNew, "OP New")}
              {renderTableSection(FilterOveralldata.OPOld, "OP Old")}
              {renderTableSection(FilterOveralldata.OPRef, "OP Ref")}
              <tr
                style={{
                  borderTop: "1px solid #000",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                <td colSpan="6" style={{ padding: "6px", textAlign: "right" }}>
                  Grand Total
                </td>
                <td
                  style={{
                    borderTop: "1px solid #000",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  {parseFloat(TotalAmount || 0).toFixed(2)}
                </td>
                <td
                  style={{ borderTop: "1px solid #000", padding: "6px" }}
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  const ForPrintBillDataConsultation = () => {
  const componentRef = React.useRef();

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Consultation_Report_User_Specific',
  });

  const renderTableSection = (data, title) => {
    if (data.length === 0) return null;

    const subtotal = data
      .reduce((sum, row) => sum + parseFloat(row.PaidAmount || 0), 0)
      .toFixed(2);

    return (
      <>
        <tr>
          <td
            colSpan="9"
            style={{
              border: "none",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "left",
              paddingLeft: "20px",
              paddingTop: "8px",
              paddingBottom: "4px",
              backgroundColor: "#f0f0f0",
              color: "#333",
            }}
          >
            {title}
          </td>
        </tr>
        {data.map((row, index) => (
          <tr key={`${title}-${index}`} style={{ fontSize: "10px" }}>
            <td style={{ border: '1px solid #ddd', padding: "6px", textAlign: "center", fontWeight: 'bold' }}>
              {index + 1}
            </td>
            <td style={{ border: '1px solid #ddd', padding: "6px", textAlign: "center", fontWeight: 'bold' }}>
              {row.PatientId || "-"}
            </td>
            <td style={{ border: '1px solid #ddd', padding: "6px", textAlign: "center", fontWeight: 'bold' }}>
              {row.BillDate || "-"}
            </td>
            <td style={{ border: '1px solid #ddd', padding: "6px", textAlign: "left", fontWeight: 'bold' }}>
              {row.Patient_Name || "-"}
            </td>
            <td style={{ border: '1px solid #ddd', padding: "6px", textAlign: "center", fontWeight: 'bold' }}>
              {row.Age || "-"}
            </td>
            <td style={{ border: '1px solid #ddd', padding: "6px", textAlign: "left", fontWeight: 'bold' }}>
              {row.Doctor_Name || "-"}
            </td>
            <td style={{ border: '1px solid #ddd', padding: "6px", textAlign: "left", fontWeight: 'bold' }}>
              {row.DeptName || "-"}
            </td>
            <td style={{ border: '1px solid #ddd', padding: "6px", textAlign: "right", fontWeight: 'bold' }}>
              {parseFloat(row.PaidAmount || 0).toFixed(2)}
            </td>
            <td style={{ border: '1px solid #ddd', padding: "6px", textAlign: "left" }}>
              {row.PatientCategory || "-"}
            </td>
          </tr>
        ))}
        <tr
          style={{
            fontWeight: "bold",
            fontSize: "11px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <td colSpan="7" style={{ 
            border: '1px solid #999',
            borderRight: 'none',
            padding: '8px',
            textAlign: 'right',
            fontStyle: 'italic'
          }}>
            {title} Subtotal:
          </td>
          <td style={{ 
            border: '1px solid #999',
            borderLeft: 'none',
            borderRight: 'none',
            padding: '8px',
            textAlign: 'right',
            backgroundColor: '#fff8dc',
            fontWeight: 'bold'
          }}>
            {subtotal}
          </td>
          <td style={{ 
            border: '1px solid #999',
            borderLeft: 'none',
            padding: '8px'
          }}></td>
        </tr>
      </>
    );
  };

  const grandTotal = (
    Filterconsultationdata.new_grand_total +
    Filterconsultationdata.old_grand_total
  ).toFixed(2);

  // Calculate payment method totals
  const paymentTotals = {
    Cash: 0,
    UPI: 0,
    Card: 0,
  };

  [
    ...Filterconsultationdata.newpatients,
    ...Filterconsultationdata.oldpatients,
  ].forEach((row) => {
    const amount = parseFloat(row.PaidAmount || 0);
    if (row.PaymentMethod === "Cash") paymentTotals.Cash += amount;
    else if (row.PaymentMethod === "UPI") paymentTotals.UPI += amount;
    else if (row.PaymentMethod === "Card") paymentTotals.Card += amount;
  });

  const totalFinalAmount = (paymentTotals.Cash + paymentTotals.UPI + paymentTotals.Card).toFixed(2);

  // Format date range
  const reportDateRange =
    searchOptions.DateType === "Current"
      ? `Report Date: ${new Date(searchOptions.CurrentDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`
      : `Report From: ${new Date(searchOptions.FromDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")} To: ${new Date(searchOptions.ToDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`;

  return (
    <div ref={componentRef} style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <style>
        {`
          @media print {
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .payment-summary {
              page-break-before: avoid;
              page-break-inside: avoid;
              margin-top: 30px;
            }
            .Register_btn_con {
              display: none;
            }
          }
          
          @media screen {
            .billing-table {
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
          }
        `}
      </style>

      <div className="Register_btn_con added_Register_btn_con" style={{ marginBottom: '20px' }}>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrint2}
          style={{
            padding: '10px 25px',
            marginRight: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Print
        </button>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrintClose}
          style={{
            padding: '10px 25px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Close
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <table className="billing-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <td colSpan="9" style={{ border: "none", textAlign: "center", padding: "20px" }}>
                <div>
                  <h2 style={{ margin: "0", fontSize: "26px", fontWeight: "bold", color: "#1976d2" }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: "5px 0", fontSize: "16px", fontWeight: "500", color: "#666" }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <p style={{ 
                    margin: "10px 0",
                    fontSize: "14px",
                    backgroundColor: "#e3f2fd",
                    display: "inline-block",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    color: "#1565c0"
                  }}>
                    {reportDateRange}
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="9" style={{ border: "none", textAlign: "left", padding: "0 20px 10px 20px" }}>
                <div style={{ 
                  fontSize: "14px", 
                  backgroundColor: "#fff3e0",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  border: "1px solid #ffb74d"
                }}>
                  <span style={{ color: "#e65100" }}>User: </span>
                  <span style={{ fontWeight: "bold", color: "#bf360c" }}>
                    {UserData?.username}
                  </span>
                </div>
              </td>
            </tr>
            <tr style={{ backgroundColor: "#2c3e50", color: "white", fontWeight: "bold", fontSize: "11px" }}>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>S.No</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>OP No</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>Date</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "left" }}>Patient Name</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>Age</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "left" }}>Doctor</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "left" }}>Department</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>Fees</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>Category</th>
            </tr>
          </thead>
          <tbody>
            {renderTableSection(Filterconsultationdata.newpatients, "New Consultation")}
            {renderTableSection(Filterconsultationdata.oldpatients, "Follow Up Consultation")}
            
            <tr
              style={{
                fontWeight: "bold",
                fontSize: "13px",
                backgroundColor: "#fff3e0",
              }}
            >
              <td colSpan="7" style={{ 
                border: '2px solid #ff6f00',
                borderRight: 'none',
                padding: '12px',
                textAlign: 'right',
                fontWeight: 'bold'
              }}>
                CONSULTATION GRAND TOTAL:
              </td>
              <td style={{ 
                border: '2px solid #ff6f00',
                borderLeft: 'none',
                borderRight: 'none',
                padding: '12px',
                textAlign: 'right',
                backgroundColor: '#ffe0b2',
                fontWeight: 'bold'
              }}>
                {grandTotal}
              </td>
              <td style={{ 
                border: '2px solid #ff6f00',
                borderLeft: 'none',
                padding: '12px'
              }}></td>
            </tr>
          </tbody>
          <tfoot>
            <tr
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: "#263238",
                color: "white"
              }}
            >
              <td colSpan="7" style={{ 
                border: '3px solid #000',
                borderRight: 'none',
                padding: '15px',
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: '15px'
              }}>
                FINAL NET TOTAL:
              </td>
              <td style={{ 
                border: '3px solid #000',
                borderLeft: 'none',
                borderRight: 'none',
                padding: '15px',
                textAlign: 'right',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: 'white'
              }}>
                ₹ {totalFinalAmount}
              </td>
              <td style={{ 
                border: '3px solid #000',
                borderLeft: 'none',
                padding: '15px'
              }}></td>
            </tr>
          </tfoot>
        </table>

        <div className="payment-summary" style={{ marginTop: "40px" }}>
          <h3 style={{ 
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "20px 0",
            padding: "10px",
            backgroundColor: "#eceff1",
            borderRadius: "5px",
            color: "#37474f"
          }}>
            PAYMENT METHOD SUMMARY
          </h3>
          <table style={{ 
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ 
                fontWeight: "bold",
                fontSize: "12px",
                backgroundColor: "#455a64",
                color: "white"
              }}>
                <th style={{ 
                  border: "1px solid #37474f",
                  padding: "12px",
                  textAlign: "left",
                  width: "50%"
                }}>
                  Payment Method
                </th>
                <th style={{ 
                  border: "1px solid #37474f",
                  padding: "12px",
                  textAlign: "right"
                }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ fontSize: "12px" }}>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "left",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}>
                  💵 Cash
                </td>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "right",
                  backgroundColor: "#e8f5e9",
                  fontWeight: "bold"
                }}>
                  {paymentTotals.Cash.toFixed(2)}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "left",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}>
                  📱 UPI
                </td>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "right",
                  backgroundColor: "#e8f5e9",
                  fontWeight: "bold"
                }}>
                  {paymentTotals.UPI.toFixed(2)}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "left",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}>
                  💳 Card
                </td>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "right",
                  backgroundColor: "#e8f5e9",
                  fontWeight: "bold"
                }}>
                  {paymentTotals.Card.toFixed(2)}
                </td>
              </tr>
              <tr
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  backgroundColor: "#37474f",
                  color: "white"
                }}
              >
                <td style={{ 
                  border: "2px solid #263238",
                  padding: "12px",
                  textAlign: "left"
                }}>
                  TOTAL
                </td>
                <td style={{ 
                  border: "2px solid #263238",
                  padding: "12px",
                  textAlign: "right",
                  backgroundColor: "#2e7d32",
                  fontSize: "14px"
                }}>
                  ₹ {totalFinalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#fafafa",
          borderTop: "2px solid #e0e0e0",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "11px", color: "#757575", margin: "0" }}>
            Generated on: {new Date().toLocaleString("en-IN")}
          </p>
          <p style={{ fontSize: "11px", color: "#757575", margin: "5px 0 0 0" }}>
            This is a computer-generated document. No signature required.
          </p>
        </div>
      </div>
    </div>
  );
  };


const ForPrintBillDataConsultationOverall = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);
  const [filteredNewPatients, setFilteredNewPatients] = useState([]);
  const [filteredOldPatients, setFilteredOldPatients] = useState([]);

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Consultation_Report',
  });

  // Function to detect duplicate entries
  const detectDuplicates = (patients) => {
    const duplicateMap = {};
    const duplicates = [];
    
    // Create a map to track occurrences
    patients.forEach(patient => {
      // Create a unique key based on patient, doctor, date, and amount
      const key = `${patient.PatientId}-${patient.Doctor_Name}-${patient.BillDate}-${patient.PaidAmount}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(patient);
    });
    
    // Find entries that have duplicates
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to check if a specific patient is a duplicate
  const isDuplicatePatient = (patient, allPatients) => {
    const key = `${patient.PatientId}-${patient.Doctor_Name}-${patient.BillDate}-${patient.PaidAmount}`;
    const matchingPatients = allPatients.filter(p => 
      `${p.PatientId}-${p.Doctor_Name}-${p.BillDate}-${p.PaidAmount}` === key
    );
    return matchingPatients.length > 1;
  };

  // More strict duplicate detection for summary
  const detectStrictDuplicates = (patients) => {
    const duplicateMap = {};
    
    patients.forEach(patient => {
      // Include more fields for stricter matching
      const key = `${patient.PatientId}-${patient.Patient_Name}-${patient.Doctor_Name}-${patient.BillDate}-${patient.PaidAmount}-${patient.PaymentMethod}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(patient);
    });
    
    const duplicates = [];
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key: key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key]
        });
      }
    });
    
    return duplicates;
  };

  // Combine all patients for duplicate detection
  const allPatients = [
    ...(Filterconsultationdata.newpatients || []),
    ...(Filterconsultationdata.oldpatients || [])
  ];

  // Detect duplicates
  const duplicatePatients = detectDuplicates(allPatients);
  const hasDuplicates = duplicatePatients.length > 0;
  const duplicateSummary = detectStrictDuplicates(allPatients);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNewPatients(Filterconsultationdata.newpatients || []);
      setFilteredOldPatients(Filterconsultationdata.oldpatients || []);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      // Filter new patients
      const filteredNew = (Filterconsultationdata.newpatients || []).filter(patient =>
        Object.values(patient).some(value =>
          value?.toString().toLowerCase().includes(lowerSearchTerm)
        )
      );
      
      // Filter old patients
      const filteredOld = (Filterconsultationdata.oldpatients || []).filter(patient =>
        Object.values(patient).some(value =>
          value?.toString().toLowerCase().includes(lowerSearchTerm)
        )
      );
      
      setFilteredNewPatients(filteredNew);
      setFilteredOldPatients(filteredOld);
    }
  }, [searchTerm, Filterconsultationdata]);

  // Apply duplicate filter if enabled
  const displayNewPatients = showOnlyDuplicates 
    ? filteredNewPatients.filter(patient => isDuplicatePatient(patient, allPatients))
    : filteredNewPatients;

  const displayOldPatients = showOnlyDuplicates 
    ? filteredOldPatients.filter(patient => isDuplicatePatient(patient, allPatients))
    : filteredOldPatients;

  const renderTableSection = (data, title) => {
    if (data.length === 0) return null;

    const subtotal = data
      .reduce((sum, row) => sum + parseFloat(row.PaidAmount || 0), 0)
      .toFixed(2);

    return (
      <>
        <tr>
          <td
            colSpan="11"
            style={{
              border: "none",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "left",
              paddingLeft: "20px",
              paddingTop: "8px",
              paddingBottom: "4px",
              backgroundColor: "#f0f0f0",
              color: "#333",
            }}
          >
            {title}
          </td>
        </tr>
        {data.map((row, index) => {
          const isDuplicate = isDuplicatePatient(row, allPatients);
          return (
            <tr 
              key={`${title}-${index}`} 
              style={{ 
                fontSize: "10px",
                backgroundColor: isDuplicate ? '#ffebee' : 'transparent',
                borderLeft: isDuplicate ? '4px solid #f44336' : 'none'
              }}
            >
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "center", 
                fontWeight: 'bold',
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {index + 1}
                {isDuplicate && ' ⚠️'}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "center", 
                fontWeight: 'bold',
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {row.PatientId || "-"}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "center", 
                fontWeight: 'bold',
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {row.BillDate || "-"}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "left", 
                fontWeight: 'bold',
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {row.Patient_Name || "-"}
                {isDuplicate && (
                  <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                    Duplicate
                  </div>
                )}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "center", 
                fontWeight: 'bold',
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {row.Age || "-"}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "left", 
                fontWeight: 'bold',
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {row.Doctor_Name || "-"}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "left", 
                fontWeight: 'bold',
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {row.DeptName || "-"}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "right", 
                fontWeight: 'bold',
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {parseFloat(row.PaidAmount || 0).toFixed(2)}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "center", 
                fontWeight: 'bold',
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {row.PaymentMethod}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "left",
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {row.PatientCategory || "-"}
              </td>
              <td style={{ 
                border: '1px solid #ddd', 
                padding: "6px", 
                textAlign: "left",
                color: isDuplicate ? '#d32f2f' : 'inherit'
              }}>
                {row.Billedby || "-"}
              </td>
            </tr>
          );
        })}
        <tr
          style={{
            fontWeight: "bold",
            fontSize: "11px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <td colSpan="7" style={{ 
            border: '1px solid #999',
            borderRight: 'none',
            padding: '8px',
            textAlign: 'right',
            fontStyle: 'italic'
          }}>
            {title} Subtotal:
          </td>
          <td style={{ 
            border: '1px solid #999',
            borderLeft: 'none',
            borderRight: 'none',
            padding: '8px',
            textAlign: 'right',
            backgroundColor: '#fff8dc',
            fontWeight: 'bold'
          }}>
            {subtotal}
          </td>
          <td colSpan="3" style={{ 
            border: '1px solid #999',
            borderLeft: 'none',
            padding: '8px'
          }}></td>
        </tr>
      </>
    );
  };

  const grandTotal = (
    (Filterconsultationdata.new_grand_total || 0) +
    (Filterconsultationdata.old_grand_total || 0)
  ).toFixed(2);

  // Calculate payment method totals based on filtered data
  const paymentTotals = {
    Cash: 0,
    UPI: 0,
    Card: 0,
  };

  const patientstotals = {
    New: 0,
    Old: 0,
  };

  [
    ...displayNewPatients,
    ...displayOldPatients,
  ].forEach((row) => {
    const amount = parseFloat(row.PaidAmount || 0);
    if (row.PaymentMethod === "Cash") paymentTotals.Cash += amount;
    else if (row.PaymentMethod === "UPI") paymentTotals.UPI += amount;
    else if (row.PaymentMethod === "Card") paymentTotals.Card += amount;
  });

  displayNewPatients.forEach((row) => {
    const amount = parseFloat(row.PaidAmount || 0);
    patientstotals.New += amount;
  });

  displayOldPatients.forEach((row) => {
    const amount = parseFloat(row.PaidAmount || 0);
    patientstotals.Old += amount;
  });

  const totalFinalAmount = (paymentTotals.Cash + paymentTotals.UPI + paymentTotals.Card).toFixed(2);

  // Format date range
  const reportDateRange =
    searchOptions.DateType === "Current"
      ? `Report Date: ${new Date(searchOptions.CurrentDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`
      : `Report From: ${new Date(searchOptions.FromDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")} To: ${new Date(searchOptions.ToDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <style>
        {`
          @media print {
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            .payment-summary, .final-total {
              page-break-inside: avoid;
              page-break-before: avoid;
            }
            .header-section {
              page-break-after: avoid;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .duplicate-alert {
              display: none;
            }
            .duplicate-summary {
              display: none;
            }
          }
          
          @media screen {
            .billing-table {
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
          }

          .search-container {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }
          .search-input {
            padding: 10px 15px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 14px;
            min-width: 300px;
            transition: all 0.3s ease;
          }
          .search-input:focus {
            outline: none;
            border-color: #4dabf7;
            box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6c757d;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          }
          .clear-search:hover {
            background-color: #5a6268;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="consultationSearch" style={{ fontWeight: '600', color: '#495057' }}>
            Search Consultations:
          </label>
          <input
            id="consultationSearch"
            type="text"
            className="search-input"
            placeholder="Search by patient name, OP number, doctor, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
       
        <div className="results-info">
          Showing {displayNewPatients.length + displayOldPatients.length} consultations
          {showOnlyDuplicates && ` (Duplicate entries only)`}
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>
       
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Duplicate Alert */}
      {hasDuplicates && (
        <div className="duplicate-alert" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#856404', 
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              ⚠️ DUPLICATE CONSULTATION ENTRIES DETECTED
            </span>
            <span style={{ color: '#856404' }}>
              Found {duplicatePatients.length} duplicate consultation entries
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: '6px 12px',
              backgroundColor: showOnlyDuplicates ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOnlyDuplicates ? 'Show All Consultations' : 'Show Only Duplicates'}
          </button>
        </div>
      )}

      {/* Duplicate Summary */}
      {hasDuplicates && (
        <div className="duplicate-summary" style={{ 
          marginBottom: '20px', 
          border: '1px solid #ffcdd2', 
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Duplicate Consultation Entries Summary</h4>
          {duplicateSummary.map((group, index) => (
            <div key={index} style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {group.entries[0].Patient_Name} - {group.entries[0].Doctor_Name} 
                (₹{group.entries[0].PaidAmount}) - {group.count} times
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Date: {group.entries[0].BillDate} | Patient ID: {group.entries[0].PatientId}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="Register_btn_con added_Register_btn_con" style={{ marginBottom: '20px' }}>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrint2}
          style={{
            padding: '10px 25px',
            marginRight: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Print
        </button>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrintClose}
          style={{
            padding: '10px 25px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Close
        </button>
      </div>

      <div ref={componentRef} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Patients Summary - Before the table */}
        <div className="payment-summary" style={{ marginTop: "40px" }}>
          <h3 style={{ 
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "20px 0",
            padding: "10px",
            backgroundColor: "#eceff1",
            borderRadius: "5px",
            color: "#37474f"
          }}>
            SUMMARY
          </h3>
          <table style={{ 
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ 
                fontWeight: "bold",
                fontSize: "12px",
                backgroundColor: "#455a64",
                color: "white"
              }}>
                <th style={{ 
                  border: "1px solid #37474f",
                  padding: "12px",
                  textAlign: "left",
                  width: "50%"
                }}>
                  Patients
                </th>
                <th style={{ 
                  border: "1px solid #37474f",
                  padding: "12px",
                  textAlign: "right"
                }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ fontSize: "12px" }}>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "left",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}>
                  New
                </td>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "right",
                  backgroundColor: "#e8f5e9",
                  fontWeight: "bold"
                }}>
                  {patientstotals.New.toFixed(2)}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "left",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}>
                  OLD
                </td>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "right",
                  backgroundColor: "#e8f5e9",
                  fontWeight: "bold"
                }}>
                  {patientstotals.Old.toFixed(2)}
                </td>
              </tr>
              <tr
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  backgroundColor: "#37474f",
                  color: "white"
                }}
              >
                <td style={{ 
                  border: "2px solid #263238",
                  padding: "12px",
                  textAlign: "left"
                }}>
                  TOTAL
                </td>
                <td style={{ 
                  border: "2px solid #263238",
                  padding: "12px",
                  textAlign: "right",
                  backgroundColor: "#2e7d32",
                  fontSize: "14px"
                }}>
                  ₹ {totalFinalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hospital Header */}
        <div className="header-section" style={{ textAlign: "center", padding: "20px", marginBottom: "10px" }}>
          <h2 style={{ margin: "0", fontSize: "26px", fontWeight: "bold", color: "#1976d2" }}>
            KARUNA MEDICAL COLLEGE HOSPITAL
          </h2>
          <h3 style={{ margin: "5px 0", fontSize: "16px", fontWeight: "500", color: "#666" }}>
            Vilayodi, Chittur, Palakkad
          </h3>
          <p style={{ 
            margin: "10px 0",
            fontSize: "14px",
            backgroundColor: "#e3f2fd",
            display: "inline-block",
            padding: "5px 15px",
            borderRadius: "20px",
            color: "#1565c0"
          }}>
            {reportDateRange}
          </p>
          {searchTerm && (
            <p style={{ 
              margin: "5px 0",
              fontSize: "14px",
              color: "#ef4444",
              fontStyle: "italic"
            }}>
              Filtered results for: "{searchTerm}"
            </p>
          )}
          {showOnlyDuplicates && (
            <p style={{ 
              margin: "5px 0",
              fontSize: "14px",
              color: "#d32f2f",
              fontStyle: "italic",
              fontWeight: "bold"
            }}>
              ⚠️ Showing Duplicate Entries Only
            </p>
          )}
        </div>

        {/* Main Table */}
        <table className="billing-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#2c3e50", color: "white", fontWeight: "bold", fontSize: "11px" }}>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>S.No</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>OP No</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>Date</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "left" }}>Patient Name</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>Age</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "left" }}>Doctor</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "left" }}>Department</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>Fees</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>PayType</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>Category</th>
              <th style={{ border: "1px solid #34495e", padding: "10px", textAlign: "center" }}>Prepared By</th>
            </tr>
          </thead>
          <tbody>
            {displayNewPatients.length > 0 || displayOldPatients.length > 0 ? (
              <>
                {renderTableSection(displayNewPatients, "New Consultation")}
                {renderTableSection(displayOldPatients, "Follow Up Consultation")}
                
                {/* Grand Total */}
                <tr
                  style={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    backgroundColor: "#fff3e0",
                  }}
                >
                  <td colSpan="7" style={{ 
                    border: '2px solid #ff6f00',
                    borderRight: 'none',
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: 'bold'
                  }}>
                    CONSULTATION GRAND TOTAL:
                  </td>
                  <td style={{ 
                    border: '2px solid #ff6f00',
                    borderLeft: 'none',
                    borderRight: 'none',
                    padding: '12px',
                    textAlign: 'right',
                    backgroundColor: '#ffe0b2',
                    fontWeight: 'bold'
                  }}>
                    {grandTotal}
                  </td>
                  <td colSpan="3" style={{ 
                    border: '2px solid #ff6f00',
                    borderLeft: 'none',
                    padding: '12px'
                  }}></td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="11" style={{ 
                  border: "1px solid #ddd", 
                  padding: "20px", 
                  textAlign: "center", 
                  color: "#6b7280" 
                }}>
                  {showOnlyDuplicates 
                    ? "No duplicate consultation entries found matching your criteria" 
                    : `No consultation records found for "${searchTerm}"`
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Final Net Total */}
        <div className="final-total" style={{ marginTop: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tr
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: "#263238",
                color: "white"
              }}
            >
              <td colSpan="7" style={{ 
                border: '3px solid #000',
                borderRight: 'none',
                padding: '15px',
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: '15px'
              }}>
                FINAL NET TOTAL:
              </td>
              <td style={{ 
                border: '3px solid #000',
                borderLeft: 'none',
                borderRight: 'none',
                padding: '15px',
                textAlign: 'right',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: 'white'
              }}>
                ₹ {totalFinalAmount}
              </td>
              <td colSpan="3" style={{ 
                border: '3px solid #000',
                borderLeft: 'none',
                padding: '15px'
              }}></td>
            </tr>
          </table>
        </div>

        <div style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#fafafa",
          borderTop: "2px solid #e0e0e0",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "11px", color: "#757575", margin: "0" }}>
            Generated on: {new Date().toLocaleString("en-IN")}
          </p>
          <p style={{ fontSize: "11px", color: "#757575", margin: "5px 0 0 0" }}>
            This is a computer-generated document. No signature required.
          </p>
        </div>

        {/* Payment Method Summary */}
        <div className="payment-summary" style={{ marginTop: "40px" }}>
          <h3 style={{ 
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "20px 0",
            padding: "10px",
            backgroundColor: "#eceff1",
            borderRadius: "5px",
            color: "#37474f"
          }}>
            PAYMENT METHOD SUMMARY
          </h3>
          <table style={{ 
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ 
                fontWeight: "bold",
                fontSize: "12px",
                backgroundColor: "#455a64",
                color: "white"
              }}>
                <th style={{ 
                  border: "1px solid #37474f",
                  padding: "12px",
                  textAlign: "left",
                  width: "50%"
                }}>
                  Payment Method
                </th>
                <th style={{ 
                  border: "1px solid #37474f",
                  padding: "12px",
                  textAlign: "right"
                }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ fontSize: "12px" }}>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "left",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}>
                  💵 Cash
                </td>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "right",
                  backgroundColor: "#e8f5e9",
                  fontWeight: "bold"
                }}>
                  {paymentTotals.Cash.toFixed(2)}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "left",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}>
                  📱 UPI
                </td>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "right",
                  backgroundColor: "#e8f5e9",
                  fontWeight: "bold"
                }}>
                  {paymentTotals.UPI.toFixed(2)}
                </td>
              </tr>
              <tr style={{ fontSize: "12px" }}>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "left",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5"
                }}>
                  💳 Card
                </td>
                <td style={{ 
                  border: "1px solid #cfd8dc",
                  padding: "10px",
                  textAlign: "right",
                  backgroundColor: "#e8f5e9",
                  fontWeight: "bold"
                }}>
                  {paymentTotals.Card.toFixed(2)}
                </td>
              </tr>
              <tr
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  backgroundColor: "#37474f",
                  color: "white"
                }}
              >
                <td style={{ 
                  border: "2px solid #263238",
                  padding: "12px",
                  textAlign: "left"
                }}>
                  TOTAL
                </td>
                <td style={{ 
                  border: "2px solid #263238",
                  padding: "12px",
                  textAlign: "right",
                  backgroundColor: "#2e7d32",
                  fontSize: "14px"
                }}>
                  ₹ {totalFinalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



const ForPrintRefundData = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Refund_Report',
  });

  // Function to detect duplicate refund entries
  const detectDuplicates = (refunds) => {
    const duplicateMap = {};
    const duplicates = [];
    
    // Create a map to track occurrences
    refunds.forEach(refund => {
      // Create a unique key based on patient, amount, date, and voucher/invoice
      const key = `${refund.PatientId}-${refund.PaidAmount}-${refund.BillDate}-${refund.VoucherNumber || refund.InvoiceNo}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(refund);
    });
    
    // Find entries that have duplicates
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to check if a specific refund is a duplicate
  const isDuplicateRefund = (refund, allRefunds) => {
    const key = `${refund.PatientId}-${refund.PaidAmount}-${refund.BillDate}-${refund.VoucherNumber || refund.InvoiceNo}`;
    const matchingRefunds = allRefunds.filter(r => 
      `${r.PatientId}-${r.PaidAmount}-${r.BillDate}-${r.VoucherNumber || r.InvoiceNo}` === key
    );
    return matchingRefunds.length > 1;
  };

  // More strict duplicate detection for summary
  const detectStrictDuplicates = (refunds) => {
    const duplicateMap = {};
    
    refunds.forEach(refund => {
      // Include more fields for stricter matching
      const key = `${refund.PatientId}-${refund.Patient_Name}-${refund.PaidAmount}-${refund.BillDate}-${refund.VoucherNumber || refund.InvoiceNo}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(refund);
    });
    
    const duplicates = [];
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key: key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key]
        });
      }
    });
    
    return duplicates;
  };

  // All refunds for duplicate detection
  const allRefunds = FilterRefunddata.refunds || [];

  // Detect duplicates
  const duplicateRefunds = detectDuplicates(allRefunds);
  const hasDuplicates = duplicateRefunds.length > 0;
  const duplicateSummary = detectStrictDuplicates(allRefunds);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRefunds(allRefunds);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      const filteredData = allRefunds.filter(row => {
        // Search in main row fields
        const mainRowMatch = Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(lowerSearchTerm)
        );
        
        // Search in refunded items if they exist
        const refundedItemsMatch = row.RefundedItems && row.RefundedItems.some(item =>
          Object.values(item).some(value =>
            value?.toString().toLowerCase().includes(lowerSearchTerm)
          )
        );
        
        return mainRowMatch || refundedItemsMatch;
      });
      
      setFilteredRefunds(filteredData);
    }
  }, [searchTerm, FilterRefunddata]);

  // Apply duplicate filter if enabled
  const displayRefunds = showOnlyDuplicates 
    ? filteredRefunds.filter(refund => isDuplicateRefund(refund, allRefunds))
    : filteredRefunds;

  const renderTableSection = (data, title) => {
    if (!data || data.length === 0) return null;

    const subtotal = data
      .reduce((sum, row) => sum + parseFloat(row.PaidAmount || 0), 0)
      .toFixed(2);

    return (
      <>
        <tr>
          <td
            colSpan="8"
            style={{
              border: "none",
              fontSize: "13px",
              fontWeight: "bold",
              textAlign: "left",
              backgroundColor: "#e8f5e9",
              padding: "10px 20px",
              borderTop: "2px solid #4caf50",
              color: "#2e7d32",
            }}
          >
            {title}
          </td>
        </tr>
        {data.map((row, index) => {
          const isDuplicate = isDuplicateRefund(row, allRefunds);
          return (
            <React.Fragment key={`${title}-${index}`}>
              <tr style={{ 
                fontSize: "10px", 
                backgroundColor: isDuplicate ? "#ffebee" : "#fff",
                borderLeft: isDuplicate ? "4px solid #f44336" : "none"
              }}>
                <td style={{ 
                  border: '1px solid #ddd', 
                  padding: "6px", 
                  textAlign: "center", 
                  fontWeight: 'bold',
                  color: isDuplicate ? '#d32f2f' : 'inherit'
                }}>
                  {index + 1}
                  {isDuplicate && ' ⚠️'}
                </td>
                <td style={{ 
                  border: '1px solid #ddd', 
                  padding: "6px", 
                  textAlign: "center", 
                  fontWeight: 'bold',
                  color: isDuplicate ? '#d32f2f' : 'inherit'
                }}>
                  {row.PatientId || "-"}
                </td>
                <td style={{ 
                  border: '1px solid #ddd', 
                  padding: "6px", 
                  textAlign: "center", 
                  fontWeight: 'bold',
                  color: isDuplicate ? '#d32f2f' : 'inherit'
                }}>
                  {row.BillDate || "-"}
                </td>
                <td style={{ 
                  border: '1px solid #ddd', 
                  padding: "6px", 
                  textAlign: "left", 
                  fontWeight: 'bold',
                  color: isDuplicate ? '#d32f2f' : 'inherit'
                }}>
                  {row.Patient_Name || "-"}
                  {isDuplicate && (
                    <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                      Duplicate
                    </div>
                  )}
                </td>
                <td style={{ 
                  border: '1px solid #ddd', 
                  padding: "6px", 
                  textAlign: "right", 
                  fontWeight: 'bold', 
                  color: isDuplicate ? '#d32f2f' : '#00796b'
                }}>
                  ({parseFloat(row.PaidAmount || 0).toFixed(2)})
                </td>
                <td style={{ 
                  border: '1px solid #ddd', 
                  padding: "6px", 
                  textAlign: "center", 
                  fontWeight: 'bold',
                  color: isDuplicate ? '#d32f2f' : 'inherit'
                }}>
                  {row.VoucherNumber || "-"}
                </td>
                <td style={{ 
                  border: '1px solid #ddd', 
                  padding: "6px", 
                  textAlign: "center", 
                  fontWeight: 'bold',
                  color: isDuplicate ? '#d32f2f' : 'inherit'
                }}>
                  {row.InvoiceNo || "-"}
                </td>
                <td style={{ 
                  border: '1px solid #ddd', 
                  padding: "6px", 
                  textAlign: "left",
                  color: isDuplicate ? '#d32f2f' : 'inherit'
                }}>
                  {row.Billedby || "-"}
                </td>
              </tr>
              {/* Render refunded items as sub-rows */}
              {row.RefundedItems && row.RefundedItems.length > 0 && (
                <>
                  <tr
                    style={{
                      fontSize: "9px",
                      fontStyle: "italic",
                      backgroundColor: isDuplicate ? "#fce4ec" : "#f5f5f5",
                    }}
                  >
                    <td
                      colSpan="8"
                      style={{
                        border: '1px solid #ddd',
                        padding: "4px 6px",
                        textAlign: "left",
                        fontWeight: "bold",
                        color: isDuplicate ? "#d32f2f" : "#666",
                      }}
                    >
                      🔍 Refunded Items:
                    </td>
                  </tr>
                  {row.RefundedItems.map((item, itemIndex) => (
                    <tr
                      key={`${title}-${index}-item-${itemIndex}`}
                      style={{ 
                        fontSize: "9px", 
                        backgroundColor: isDuplicate ? "#fce4ec" : "#fafafa" 
                      }}
                    >
                      <td style={{ border: '1px solid #ddd', padding: "4px 6px", textAlign: "center" }}></td>
                      <td colSpan="2" style={{ border: '1px solid #ddd', padding: "4px 6px", fontStyle: "italic" }}>
                        {item.Service_Type || "-"}
                      </td>
                      <td colSpan="2" style={{ border: '1px solid #ddd', padding: "4px 6px", fontStyle: "italic" }}>
                        {item.Service_Name || "-"}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: "4px 6px", textAlign: "right", fontStyle: "italic" }}>
                        {item.Quantity || "-"}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: "4px 6px", textAlign: "right", fontStyle: "italic" }}>
                        {(item.Amount || 0).toFixed(2)}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: "4px 6px", textAlign: "right", fontStyle: "italic", color: '#00796b' }}>
                        ({(item.Total_Amount || 0).toFixed(2)})
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </React.Fragment>
          );
        })}
        <tr
          style={{
            fontWeight: "bold",
            fontSize: "11px",
            backgroundColor: "#c8e6c9",
          }}
        >
          <td colSpan="4" style={{ 
            border: '1px solid #4caf50',
            borderRight: 'none',
            padding: '8px',
            textAlign: 'right'
          }}>
            Refund Subtotal:
          </td>
          <td style={{ 
            border: '1px solid #4caf50',
            borderLeft: 'none',
            borderRight: 'none',
            padding: '8px',
            textAlign: 'right',
            color: '#00796b',
            fontWeight: 'bold'
          }}>
            ({subtotal})
          </td>
          <td colSpan="3" style={{ 
            border: '1px solid #4caf50',
            borderLeft: 'none',
            padding: '8px'
          }}></td>
        </tr>
      </>
    );
  };

  // Calculate grand total based on filtered data
  const grandTotal = displayRefunds
    .reduce((sum, row) => sum + parseFloat(row.PaidAmount || 0), 0)
    .toFixed(2);

  // Format date range
  const reportDateRange =
    searchOptions.DateType === "Current"
      ? `Report Date: ${new Date(searchOptions.CurrentDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`
      : `Report From: ${new Date(searchOptions.FromDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")} To: ${new Date(searchOptions.ToDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <style>
        {`
          @media print {
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .duplicate-alert {
              display: none;
            }
            .duplicate-summary {
              display: none;
            }
          }
          
          @media screen {
            .billing-table {
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
          }

          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }
          .search-input {
            padding: 10px 15px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            font-size: 14px;
            min-width: 300px;
            transition: all 0.3s ease;
          }
          .search-input:focus {
            outline: none;
            border-color: #4dabf7;
            box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6c757d;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6c757d;
            padding: 8px 16px;
            margin: 5px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          .clear-search:hover {
            background-color: #5a6268;
          }
        `}
      </style>

      {/* Duplicate Alert */}
      {hasDuplicates && (
        <div className="duplicate-alert" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#856404', 
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              ⚠️ DUPLICATE REFUND ENTRIES DETECTED
            </span>
            <span style={{ color: '#856404' }}>
              Found {duplicateRefunds.length} duplicate refund entries
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: '6px 12px',
              backgroundColor: showOnlyDuplicates ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOnlyDuplicates ? 'Show All Refunds' : 'Show Only Duplicates'}
          </button>
        </div>
      )}

      {/* Duplicate Summary */}
      {hasDuplicates && (
        <div className="duplicate-summary" style={{ 
          marginBottom: '20px', 
          border: '1px solid #ffcdd2', 
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Duplicate Refund Entries Summary</h4>
          {duplicateSummary.map((group, index) => (
            <div key={index} style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {group.entries[0].Patient_Name} - ₹{group.entries[0].PaidAmount} - {group.count} times
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Voucher: {group.entries[0].VoucherNumber || 'N/A'} | Invoice: {group.entries[0].InvoiceNo || 'N/A'} | Date: {group.entries[0].BillDate}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="refundSearch" style={{ fontWeight: '600', color: '#495057' }}>
            Search Refunds:
          </label>
          <input
            id="refundSearch"
            type="text"
            className="search-input"
            placeholder="Search by patient name, ID, voucher no, invoice no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
       
        <div className="results-info">
          Showing {displayRefunds.length} refund records
          {showOnlyDuplicates && ` (Duplicate entries only)`}
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>
       
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}
      </div>

      <div className="Register_btn_con added_Register_btn_con" style={{ marginBottom: '20px' }}>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrint2}
          style={{
            padding: '10px 25px',
            marginRight: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Print
        </button>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handleCloseRefundPrint}
          style={{
            padding: '10px 25px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Close
        </button>
      </div>

      <div ref={componentRef} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <table className="billing-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <td colSpan="8" style={{ border: "none", textAlign: "center", padding: "20px" }}>
                <div>
                  <h2 style={{ margin: "0", fontSize: "26px", fontWeight: "bold", color: "#1976d2" }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: "5px 0", fontSize: "16px", fontWeight: "500", color: "#666" }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <p style={{ 
                    margin: "10px 0",
                    fontSize: "14px",
                    backgroundColor: "#e8f5e9",
                    display: "inline-block",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    color: "#2e7d32",
                    border: "1px solid #c8e6c9"
                  }}>
                    📋 REFUND REPORT - {reportDateRange}
                  </p>
                  {searchTerm && (
                    <p style={{ 
                      margin: "5px 0",
                      fontSize: "14px",
                      color: "#ef4444",
                      fontStyle: "italic"
                    }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {showOnlyDuplicates && (
                    <p style={{ 
                      margin: "5px 0",
                      fontSize: "14px",
                      color: "#d32f2f",
                      fontStyle: "italic",
                      fontWeight: "bold"
                    }}>
                      ⚠️ Showing Duplicate Entries Only
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr style={{ backgroundColor: "#00796b", color: "white", fontWeight: "bold", fontSize: "11px" }}>
              <th style={{ border: "1px solid #004d40", padding: "10px", textAlign: "center" }}>S.No</th>
              <th style={{ border: "1px solid #004d40", padding: "10px", textAlign: "center" }}>Patient ID</th>
              <th style={{ border: "1px solid #004d40", padding: "10px", textAlign: "center" }}>Bill Date</th>
              <th style={{ border: "1px solid #004d40", padding: "10px", textAlign: "left" }}>Patient Name</th>
              <th style={{ border: "1px solid #004d40", padding: "10px", textAlign: "center" }}>Refund Amount</th>
              <th style={{ border: "1px solid #004d40", padding: "10px", textAlign: "center" }}>Voucher No</th>
              <th style={{ border: "1px solid #004d40", padding: "10px", textAlign: "center" }}>Invoice No</th>
              <th style={{ border: "1px solid #004d40", padding: "10px", textAlign: "center" }}>Billed By</th>
            </tr>
          </thead>
          <tbody>
            {displayRefunds.length > 0 ? (
              renderTableSection(displayRefunds, "🔄 REFUND DETAILS")
            ) : (
              <tr>
                <td colSpan="8" style={{ 
                  border: "1px solid #ddd", 
                  padding: "40px", 
                  textAlign: "center", 
                  color: "#666",
                  fontSize: "14px"
                }}>
                  {showOnlyDuplicates 
                    ? "No duplicate refund records found matching your criteria" 
                    : searchTerm 
                    ? `No refund records found for "${searchTerm}"` 
                    : "No refund records available"
                  }
                </td>
              </tr>
            )}
            
            {displayRefunds.length > 0 && (
              <tr
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  backgroundColor: "#e8f5e9",
                }}
              >
                <td colSpan="4" style={{ 
                  border: '2px solid #4caf50',
                  borderRight: 'none',
                  padding: '12px',
                  textAlign: 'right',
                  fontWeight: 'bold'
                }}>
                  REFUND GRAND TOTAL ({displayRefunds.length} records):
                </td>
                <td style={{ 
                  border: '2px solid #4caf50',
                  borderLeft: 'none',
                  borderRight: 'none',
                  padding: '12px',
                  textAlign: 'right',
                  backgroundColor: '#c8e6c9',
                  fontWeight: 'bold',
                  color: '#00796b',
                  fontSize: '14px'
                }}>
                  (₹ {grandTotal})
                </td>
                <td colSpan="3" style={{ 
                  border: '2px solid #4caf50',
                  borderLeft: 'none',
                  padding: '12px'
                }}></td>
              </tr>
            )}
          </tbody>
          <tfoot>
            {displayRefunds.length > 0 && (
              <tr
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  backgroundColor: "#00796b",
                  color: "white"
                }}
              >
                <td colSpan="4" style={{ 
                  border: '3px solid #004d40',
                  borderRight: 'none',
                  padding: '15px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '15px'
                }}>
                  TOTAL REFUNDED AMOUNT:
                </td>
                <td style={{ 
                  border: '3px solid #004d40',
                  borderLeft: 'none',
                  borderRight: 'none',
                  padding: '15px',
                  textAlign: 'right',
                  fontSize: '16px',
                  backgroundColor: '#009688',
                  color: 'white'
                }}>
                  (₹ {grandTotal})
                </td>
                <td colSpan="3" style={{ 
                  border: '3px solid #004d40',
                  borderLeft: 'none',
                  padding: '15px'
                }}></td>
              </tr>
            )}
          </tfoot>
        </table>
        
        <div style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#fafafa",
          borderTop: "2px solid #e0e0e0",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "11px", color: "#757575", margin: "0" }}>
            Generated on: {new Date().toLocaleString("en-IN")}
          </p>
          <p style={{ fontSize: "11px", color: "#757575", margin: "5px 0 0 0" }}>
            This is a computer-generated document. No signature required.
          </p>
        </div>
      </div>
    </div>
  );
};


  const SpecialityPrint = () => {
    // Combine new and old patients
    const allPatients = [
      ...Filterconsultationdata.newpatients,
      ...Filterconsultationdata.oldpatients,
    ];

    // Group by DeptName (speciality)
    const SpecialityFee = allPatients.reduce((acc, patient) => {
      const speciality = patient.DeptName || "Unknown";
      if (!acc[speciality]) {
        acc[speciality] = [];
      }
      acc[speciality].push({
        sno: acc[speciality].length + 1,
        PatientId: patient.PatientId,
        OPDate: patient.BillDate,
        PatientName: patient.Patient_Name,
        Dept: patient.DeptName,
        OPType:
          patient.type ||
          (Filterconsultationdata.newpatients.includes(patient)
            ? "New"
            : "Follow Up"),
        Category: patient.PatientCategory,
        Fees: patient.PaidAmount,
        Prepared: patient.Billedby,
      });
      return acc;
    }, {});

    const renderTableSection = (specialityData, specialityName) => {
      if (!specialityData || specialityData.length === 0) return null;

      const specialityTotal = specialityData
        .reduce((sum, record) => sum + parseFloat(record.Fees), 0)
        .toFixed(2);

      // Count NEW and FOLLOWUP patients
      const newCount = specialityData.filter(
        (record) => record.OPType === "New"
      ).length;
      const followUpCount = specialityData.filter(
        (record) => record.OPType === "Follow Up"
      ).length;

      // Calculate NEW and FOLLOWUP amounts
      const newAmount = specialityData
        .filter((record) => record.OPType === "New")
        .reduce((sum, record) => sum + parseFloat(record.Fees), 0)
        .toFixed(2);

      const followUpAmount = specialityData
        .filter((record) => record.OPType === "Follow Up")
        .reduce((sum, record) => sum + parseFloat(record.Fees), 0)
        .toFixed(2);

      return (
        <>
          <tr>
            <td
              colSpan="9"
              style={{
                padding: "10px",
                textAlign: "left",
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: "#e9ecef",
                border: "1px solid #dee2e6",
              }}
            >
              Speciality: {specialityName} | New: {newCount} (₹{newAmount}) |
              Follow Up: {followUpCount} (₹{followUpAmount}) | Total:{" "}
              {specialityData.length} (₹{specialityTotal})
            </td>
          </tr>
          {specialityData.map((record, index) => (
            <tr
              key={`record-${specialityName}-${index}`}
              style={{
                fontSize: "11px",
                backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
              }}
            >
              <td
                style={{
                  padding: "6px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {record.sno}
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {record.PatientId}
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {record.OPDate}
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "left",
                  border: "1px solid #dee2e6",
                }}
              >
                {record.PatientName}
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {record.Dept || "N/A"}
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {record.OPType}
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {record.Category}
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {parseFloat(record.Fees).toFixed(2)}
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {record.Prepared}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan="7"
              style={{
                padding: "8px",
                textAlign: "right",
                fontWeight: "bold",
                border: "1px solid #dee2e6",
                backgroundColor: "#f1f3f5",
              }}
            >
              Speciality Total - New: ₹{newAmount} | Follow Up: ₹
              {followUpAmount}
            </td>
            <td
              style={{
                padding: "8px",
                textAlign: "center",
                fontWeight: "bold",
                border: "1px solid #dee2e6",
                backgroundColor: "#f1f3f5",
              }}
            >
              {specialityTotal}
            </td>
            <td style={{ border: "1px solid #dee2e6" }}></td>
          </tr>
        </>
      );
    };

    const grandTotal = Object.values(SpecialityFee)
      .reduce(
        (sum, records) =>
          sum +
          records.reduce(
            (subSum, record) => subSum + parseFloat(record.Fees),
            0
          ),
        0
      )
      .toFixed(2);

    // Calculate overall NEW and FOLLOWUP counts and amounts
    const overallNewCount = Object.values(SpecialityFee).reduce(
      (total, records) =>
        total + records.filter((record) => record.OPType === "New").length,
      0
    );

    const overallFollowUpCount = Object.values(SpecialityFee).reduce(
      (total, records) =>
        total +
        records.filter((record) => record.OPType === "Follow Up").length,
      0
    );

    const overallNewAmount = Object.values(SpecialityFee)
      .reduce(
        (total, records) =>
          total +
          records
            .filter((record) => record.OPType === "New")
            .reduce((sum, record) => sum + parseFloat(record.Fees), 0),
        0
      )
      .toFixed(2);

    const overallFollowUpAmount = Object.values(SpecialityFee)
      .reduce(
        (total, records) =>
          total +
          records
            .filter((record) => record.OPType === "Follow Up")
            .reduce((sum, record) => sum + parseFloat(record.Fees), 0),
        0
      )
      .toFixed(2);

    const totalPatients = overallNewCount + overallFollowUpCount;

    return (
      <div
        style={{
          fontFamily: "sans-serif",
          padding: "1.25rem",
          maxWidth: "72rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Buttons Container */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handlePrint2}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background-color 0.3s",
            }}
          >
            Print Report
          </button>
          <button
            onClick={handlePrintClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background-color 0.3s",
            }}
          >
            Close
          </button>
        </div>

        {/* Print Container */}
        <div ref={componentRef}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #d1d5db",
              marginBottom: "1.25rem",
            }}
          >
            <thead>
              <tr>
                <td
                  colSpan="9"
                  style={{
                    border: "none",
                    textAlign: "center",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    backgroundColor: "#f3f4f6",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#1f2937",
                        letterSpacing: "0.025em",
                      }}
                    >
                      KARUNA MEDICAL COLLEGE HOSPITAL
                    </h2>
                    <h1
                      style={{
                        marginTop: "0.25rem",
                        fontSize: "1.125rem",
                        fontWeight: 500,
                        color: "#6b7280",
                        letterSpacing: "-0.025em",
                      }}
                    >
                      Vilayodi, Chittur, Palakkad
                    </h1>
                    <p
                      style={{
                        marginTop: "0.625rem",
                        fontSize: "0.875rem",
                        color: "#4b5563",
                        fontWeight: 500,
                      }}
                    >
                      {/* Date display logic remains same */}
                    </p>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#1f2937",
                        fontWeight: "bold",
                        padding: "0.5rem",
                        backgroundColor: "#e5f3ff",
                        borderRadius: "0.25rem",
                        border: "1px solid #3b82f6",
                      }}
                    >
                      Total: {totalPatients} patients (₹{grandTotal}) | New:{" "}
                      {overallNewCount} (₹{overallNewAmount}) | Follow Up:{" "}
                      {overallFollowUpCount} (₹{overallFollowUpAmount})
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                style={{
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                }}
              >
                <th
                  style={{
                    padding: "0.625rem",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                  }}
                >
                  S.No
                </th>
                <th
                  style={{
                    padding: "0.625rem",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                  }}
                >
                  Patient ID
                </th>
                <th
                  style={{
                    padding: "0.625rem",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                  }}
                >
                  OP Date
                </th>
                <th
                  style={{
                    padding: "0.625rem",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                  }}
                >
                  Patient Name
                </th>
                <th
                  style={{
                    padding: "0.625rem",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                  }}
                >
                  Department
                </th>
                <th
                  style={{
                    padding: "0.625rem",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                  }}
                >
                  OP Type
                </th>
                <th
                  style={{
                    padding: "0.625rem",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    padding: "0.625rem",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                  }}
                >
                  Fees
                </th>
                <th
                  style={{
                    padding: "0.625rem",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    fontWeight: 600,
                  }}
                >
                  Prepared
                </th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(SpecialityFee).map(([specialityName, records]) =>
                renderTableSection(records, specialityName)
              )}
            </tbody>

            <tfoot>
              <tr
                style={{
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  backgroundColor: "#1f2937",
                  color: "white",
                }}
              >
                <td
                  colSpan="7"
                  style={{
                    padding: "0.625rem",
                    border: "1px solid #d1d5db",
                    borderTop: "2px solid #3b82f6",
                    textAlign: "right",
                  }}
                >
                  GRAND TOTAL - New: ₹{overallNewAmount} | Follow Up: ₹
                  {overallFollowUpAmount}
                </td>
                <td
                  style={{
                    padding: "0.625rem",
                    border: "1px solid #d1d5db",
                    borderTop: "2px solid #3b82f6",
                    textAlign: "center",
                    backgroundColor: "#3b82f6",
                    fontSize: "0.875rem",
                  }}
                >
                  {grandTotal}
                </td>
                <td
                  style={{
                    border: "1px solid #d1d5db",
                    borderTop: "2px solid #3b82f6",
                  }}
                ></td>
              </tr>
            </tfoot>
          </table>

          <div
            style={{
              marginTop: "1.25rem",
              padding: "1rem",
              backgroundColor: "#f3f4f6",
              borderLeft: "4px solid #3b82f6",
              borderRadius: "0.25rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                color: "#6b7280",
                lineHeight: 1.625,
              }}
            >
              <strong>Note:</strong> This report includes OP registration fee
              details with separate calculations for New and Follow Up patients.
            </p>
          </div>
        </div>
      </div>
    );
  };



const ForPrintAdvance = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAdvances, setFilteredAdvances] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Advance_Report',
  });

  // Function to detect duplicate advance entries
  const detectDuplicateAdvances = (advances) => {
    const duplicateMap = {};
    const duplicates = [];
    
    advances.forEach(advance => {
      // Create a unique key based on patient, amount, date, and voucher
      const key = `${advance.PatientId}-${advance.AdvanceAmount}-${advance.AdvDate}-${advance.Voucher_Number || advance.AdvanceVoucher}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(advance);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to detect duplicate refund entries
  const detectDuplicateRefunds = (refunds) => {
    const duplicateMap = {};
    const duplicates = [];
    
    refunds.forEach(refund => {
      const key = `${refund.PatientId}-${refund.Refundamt}-${refund.AdvDate}-${refund.Refundvoucher}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(refund);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to check if a specific advance is a duplicate
  const isDuplicateAdvance = (advance, allAdvances) => {
    const key = `${advance.PatientId}-${advance.AdvanceAmount}-${advance.AdvDate}-${advance.Voucher_Number || advance.AdvanceVoucher}`;
    const matchingAdvances = allAdvances.filter(a => 
      `${a.PatientId}-${a.AdvanceAmount}-${a.AdvDate}-${a.Voucher_Number || a.AdvanceVoucher}` === key
    );
    return matchingAdvances.length > 1;
  };

  // Function to check if a specific refund is a duplicate
  const isDuplicateRefund = (refund, allRefunds) => {
    const key = `${refund.PatientId}-${refund.Refundamt}-${refund.AdvDate}-${refund.Refundvoucher}`;
    const matchingRefunds = allRefunds.filter(r => 
      `${r.PatientId}-${r.Refundamt}-${r.AdvDate}-${r.Refundvoucher}` === key
    );
    return matchingRefunds.length > 1;
  };

  // More strict duplicate detection for summary
  const detectStrictDuplicates = (data, type) => {
    const duplicateMap = {};
    
    data.forEach(item => {
      const key = type === 'advance' 
        ? `${item.PatientId}-${item.PatientName}-${item.AdvanceAmount}-${item.AdvDate}-${item.Voucher_Number || item.AdvanceVoucher}`
        : `${item.PatientId}-${item.PatientName}-${item.Refundamt}-${item.AdvDate}-${item.Refundvoucher}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    
    const duplicates = [];
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key: key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key],
          type: type
        });
      }
    });
    
    return duplicates;
  };

  // All data for duplicate detection
  const allAdvances = AdvanceData || [];
  const allRefunds = AdvanceRefundData || [];

  // Detect duplicates
  const duplicateAdvances = detectDuplicateAdvances(allAdvances);
  const duplicateRefunds = detectDuplicateRefunds(allRefunds);
  const hasDuplicates = duplicateAdvances.length > 0 || duplicateRefunds.length > 0;
  
  const duplicateAdvanceSummary = detectStrictDuplicates(allAdvances, 'advance');
  const duplicateRefundSummary = detectStrictDuplicates(allRefunds, 'refund');
  const allDuplicateSummary = [...duplicateAdvanceSummary, ...duplicateRefundSummary];

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAdvances(allAdvances);
      setFilteredRefunds(allRefunds);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      // Filter advances
      const filteredAdvanceData = allAdvances.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(lowerSearchTerm)
        )
      );
      
      // Filter refunds
      const filteredRefundData = allRefunds.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(lowerSearchTerm)
        )
      );
      
      setFilteredAdvances(filteredAdvanceData);
      setFilteredRefunds(filteredRefundData);
    }
  }, [searchTerm, AdvanceData, AdvanceRefundData]);

  // Group advances by RegisterType
  const groupByRegisterType = (data) => {
    return data.reduce((groups, item) => {
      const registerType = item.RegisterType || "UNKNOWN";
      if (!groups[registerType]) {
        groups[registerType] = [];
      }
      groups[registerType].push(item);
      return groups;
    }, {});
  };

  // Apply duplicate filter if enabled
  const displayAdvances = showOnlyDuplicates 
    ? filteredAdvances.filter(advance => isDuplicateAdvance(advance, allAdvances))
    : filteredAdvances;

  const displayRefunds = showOnlyDuplicates 
    ? filteredRefunds.filter(refund => isDuplicateRefund(refund, allRefunds))
    : filteredRefunds;

  // Augment advance data with gross (AdvanceAmount) and duplicate flag
  const augmentedAdvances = displayAdvances.map((row) => ({
    ...row,
    gross: parseFloat(row.AdvanceAmount || 0),
    isDuplicate: isDuplicateAdvance(row, allAdvances)
  }));

  // Augment refund data with duplicate flag
  const augmentedRefunds = displayRefunds.map((row) => ({
    ...row,
    isDuplicate: isDuplicateRefund(row, allRefunds)
  }));

  // Group augmented advances
  const groupedAdvances = groupByRegisterType(augmentedAdvances);

  // Calculate overall advance totals based on filtered data
  const advanceGross = augmentedAdvances.reduce((sum, item) => sum + item.gross, 0);
  const refundTotal = augmentedRefunds.reduce((sum, row) => sum + parseFloat(row.Refundamt || 0), 0);
  const netTotal = Math.max(0, advanceGross - refundTotal).toFixed(2);

  // Render advance sections
  const renderAdvanceSection = (data, title) => {
    if (!data || data.length === 0) return null;

    const subtotalGross = data.reduce((sum, row) => sum + row.gross, 0);

    return (
      <>
        <tr>
          <td
            colSpan="10"
            style={{
              border: "none",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "left",
              backgroundColor: "#e8f5e9",
              padding: "10px 20px",
              borderTop: "2px solid #4caf50",
              color: "#2e7d32",
            }}
          >
            {title}
          </td>
        </tr>
        {data.map((row, index) => (
          <tr 
            key={`${title}-${index}`} 
            style={{ 
              fontSize: "10px",
              backgroundColor: row.isDuplicate ? '#ffebee' : '#fff',
              borderLeft: row.isDuplicate ? '4px solid #f44336' : 'none'
            }}
          >
            <td style={{ 
              padding: "6px", 
              textAlign: "center",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {index + 1}
              {row.isDuplicate && ' ⚠️'}
            </td>
            <td style={{ 
              padding: "6px", 
              textAlign: "center",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {row.PatientId || "-"}
            </td>
            <td style={{ 
              padding: "6px", 
              textAlign: "center",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {row.AdvDate || "-"}
            </td>
            <td style={{ 
              padding: "6px", 
              textAlign: "center",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {row.Voucher_Number || row.AdvanceVoucher || "-"}
              {row.isDuplicate && (
                <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                  Duplicate
                </div>
              )}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {row.PatientName || "-"}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {row.AdvancePurpose || "-"}
            </td>
            <td style={{ 
              padding: "6px", 
              textAlign: "right", 
              color: row.isDuplicate ? '#d32f2f' : "#00796b",
              fontWeight: 'bold'
            }}>
              {row.gross.toFixed(2)}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.Gender || "-"}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.Age || "-"}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.created_by || row.Billedby || "-"}
            </td>
          </tr>
        ))}
        <tr
          style={{
            borderTop: "1px solid #4caf50",
            fontWeight: "bold",
            fontSize: "12px",
            backgroundColor: "#c8e6c9",
          }}
        >
          <td colSpan="6" style={{ padding: "6px", textAlign: "right" }}>
            Subtotal
          </td>
          <td style={{ padding: "6px", textAlign: "right", color: "#00796b" }}>{subtotalGross.toFixed(2)}</td>
          <td colSpan="3" style={{ padding: "6px" }}></td>
        </tr>
      </>
    );
  };

  // Render refund section
  const renderRefundSection = (data, title) => {
    if (!data || data.length === 0) return null;

    const subtotal = data.reduce((sum, row) => sum + parseFloat(row.Refundamt || 0), 0).toFixed(2);

    return (
      <>
        <tr>
          <td
            colSpan="10"
            style={{
              border: "none",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "left",
              backgroundColor: "#e8f5e9",
              padding: "10px 20px",
              borderTop: "2px solid #4caf50",
              color: "#2e7d32",
            }}
          >
            {title}
          </td>
        </tr>
        {data.map((row, index) => (
          <tr 
            key={`${title}-${index}`} 
            style={{ 
              fontSize: "10px",
              backgroundColor: row.isDuplicate ? '#ffebee' : '#fff',
              borderLeft: row.isDuplicate ? '4px solid #f44336' : 'none'
            }}
          >
            <td style={{ 
              padding: "6px", 
              textAlign: "center",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {index + 1}
              {row.isDuplicate && ' ⚠️'}
            </td>
            <td style={{ 
              padding: "6px", 
              textAlign: "center",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {row.PatientId || "-"}
            </td>
            <td style={{ 
              padding: "6px", 
              textAlign: "center",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {row.AdvDate || "-"}
            </td>
            <td style={{ 
              padding: "6px", 
              textAlign: "center",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {row.Refundvoucher || "-"}
              {row.isDuplicate && (
                <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                  Duplicate
                </div>
              )}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              {row.PatientName || "-"}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: 'bold'
            }}>
              Refund (Advance Voucher: {row.AdvanceVoucher || "-"})
            </td>
            <td style={{ 
              padding: "6px", 
              textAlign: "right", 
              color: row.isDuplicate ? '#d32f2f' : "#00796b",
              fontWeight: 'bold'
            }}>
              {parseFloat(row.Refundamt || 0).toFixed(2)}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.Gender || "-"}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.Age || "-"}
            </td>
            <td style={{ 
              padding: "6px",
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.Billedby || "-"}
            </td>
          </tr>
        ))}
        <tr
          style={{
            borderTop: "1px solid #4caf50",
            fontWeight: "bold",
            fontSize: "12px",
            backgroundColor: "#c8e6c9",
          }}
        >
          <td colSpan="6" style={{ padding: "6px", textAlign: "right" }}>
            Refund Subtotal
          </td>
          <td style={{ padding: "6px", textAlign: "right", color: "#00796b" }}>{subtotal}</td>
          <td colSpan="3" style={{ padding: "6px" }}></td>
        </tr>
      </>
    );
  };

  // Format date range
  const reportDateRange =
    searchOptions.DateType === "Current"
      ? `Report Date: ${new Date(searchOptions.CurrentDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`
      : `Report From: ${new Date(searchOptions.FromDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")} To: ${new Date(searchOptions.ToDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .duplicate-alert {
              display: none;
            }
            .duplicate-summary {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
        `}
      </style>

      {/* Duplicate Alert */}
      {hasDuplicates && (
        <div className="duplicate-alert" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#856404', 
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              ⚠️ DUPLICATE ADVANCE/REFUND ENTRIES DETECTED
            </span>
            <span style={{ color: '#856404' }}>
              Found {duplicateAdvances.length} duplicate advances, {duplicateRefunds.length} duplicate refunds
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: '6px 12px',
              backgroundColor: showOnlyDuplicates ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOnlyDuplicates ? 'Show All Records' : 'Show Only Duplicates'}
          </button>
        </div>
      )}

      {/* Duplicate Summary */}
      {hasDuplicates && (
        <div className="duplicate-summary" style={{ 
          marginBottom: '20px', 
          border: '1px solid #ffcdd2', 
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Duplicate Advance/Refund Entries Summary</h4>
          {allDuplicateSummary.map((group, index) => (
            <div key={index} style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {group.entries[0].PatientName} - 
                {group.type === 'advance' ? ` Advance: ₹${group.entries[0].AdvanceAmount}` : ` Refund: ₹${group.entries[0].Refundamt}`} 
                - {group.count} times
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {group.type === 'advance' ? 'Voucher' : 'Refund Voucher'}: {group.entries[0].Voucher_Number || group.entries[0].Refundvoucher} | 
                Date: {group.entries[0].AdvDate} | 
                Patient ID: {group.entries[0].PatientId}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="advanceSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Advances:
          </label>
          <input
            id="advanceSearch"
            type="text"
            className="search-input"
            placeholder="Search by patient name, ID, voucher no, purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
       
        <div className="results-info">
          Showing {augmentedAdvances.length} advances, {augmentedRefunds.length} refunds
          {showOnlyDuplicates && ` (Duplicate entries only)`}
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>
       
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}
      </div>

      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlePrint2}>
          Print
        </button>
        <button className="RegisterForm_1_btns" onClick={handleCloseAdvancePrint}>
          Close
        </button>
      </div>

      <div ref={componentRef} className="report-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <td
                colSpan="10"
                style={{ border: "none", textAlign: "center", padding: "20px" }}
              >
                <div>
                  <h2
                    style={{
                      margin: "0",
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#1976d2"
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3
                    style={{
                      margin: "5px 0",
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#666"
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <p style={{ 
                    margin: "10px 0",
                    fontSize: "14px",
                    backgroundColor: "#e8f5e9",
                    display: "inline-block",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    color: "#2e7d32",
                    border: "1px solid #c8e6c9"
                  }}>
                    📋 ADVANCE REPORT - {reportDateRange}
                  </p>
                  {searchTerm && (
                    <p style={{ 
                      margin: "5px 0",
                      fontSize: "14px",
                      color: "#ef4444",
                      fontStyle: "italic"
                    }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {showOnlyDuplicates && (
                    <p style={{ 
                      margin: "5px 0",
                      fontSize: "14px",
                      color: "#d32f2f",
                      fontStyle: "italic",
                      fontWeight: "bold"
                    }}>
                      ⚠️ Showing Duplicate Entries Only
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                backgroundColor: "#00796b",
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>S.No</th>
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>PatientNo</th>
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>BillDate</th>
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>BillNo</th>
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>Patient Name</th>
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>Advance Purpose</th>
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>Amount</th>
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>Gender</th>
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>Age</th>
              <th style={{ border: "1px solid #004d40", padding: "10px" }}>Prepared</th>
            </tr>
          </thead>
          <tbody>
            {augmentedAdvances.length > 0 ? (
              Object.keys(groupedAdvances).map((registerType) =>
                renderAdvanceSection(groupedAdvances[registerType], registerType)
              )
            ) : (
              <tr>
                <td colSpan="10" style={{ border: "1px solid #d1d5db", padding: "20px", textAlign: "center", color: "#6b7280" }}>
                  {showOnlyDuplicates 
                    ? "No duplicate advance records found matching your criteria" 
                    : `No advance records found for "${searchTerm}"`
                  }
                </td>
              </tr>
            )}
            
            {augmentedAdvances.length > 0 && (
              <tr
                style={{
                  borderTop: "2px solid #4caf50",
                  fontWeight: "bold",
                  fontSize: "12px",
                  backgroundColor: "#c8e6c9",
                }}
              >
                <td colSpan="6" style={{ padding: "8px", textAlign: "right" }}>
                  Advance Grand Total ({augmentedAdvances.length} records)
                </td>
                <td style={{ padding: "8px", textAlign: "right", color: "#00796b" }}>{advanceGross.toFixed(2)}</td>
                <td colSpan="3" style={{ padding: "8px" }}></td>
              </tr>
            )}
            
            {renderRefundSection(augmentedRefunds, "Refunds")}
          </tbody>
          <tfoot>
            <tr
              style={{
                borderTop: "3px solid #004d40",
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: "#00796b",
                color: "white"
              }}
            >
              <td colSpan="6" style={{ padding: "12px", textAlign: "right" }}>
                Final Net Total
              </td>
              <td style={{ padding: "12px", textAlign: "right", fontSize: "15px" }}>{netTotal}</td>
              <td colSpan="3" style={{ padding: "12px" }}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};





const ForPrintSummary = () => {
  // 🔹 Add print function here
  const handlePrint2 = () => {
    window.print();
  };

  // Format date range
  const reportDateRange =
    searchOptions.DateType === "Current"
      ? `Report Date: ${new Date(searchOptions.CurrentDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`
      : `Report From: ${new Date(searchOptions.FromDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")} To: ${new Date(searchOptions.ToDate)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          .replace(/\//g, "-")}`;

  // Prepare summary data for rendering
  const summaryData = [
    {
      title: "Services",
      data: FinalSummary.services || { Grandtotal: 0, Discount: 0, Refund: 0, Final: 0 },
    },
    {
      title: "Advance",
      data: FinalSummary.Advance || { Grandtotal: 0, Discount: 0, Refund: 0, Final: 0 },
    },
    {
      title: "Final Bill",
      data: FinalSummary.Finalbill || { Grandtotal: 0, Discount: 0, Refund: 0, Final: 0 },
    },
    {
      title: "Final Total",
      data: FinalSummary.Finaltotal || { Total: 0, Discount: 0, Refund: 0 },
    },
  ];

  // Render each summary section
  const renderSummarySection = (section, index) => {
    const { title, data } = section;
    const netAmount = Math.max(
      0,
      (data.Final || (data.Grandtotal || data.Total || 0) - (data.Discount || 0) - (data.Refund || 0))
    ).toFixed(2);
    return (
      <>
        <tr>
          <td
            colSpan="5"
            style={{
              border: "none",
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "left",
              backgroundColor: "#f8f9fa",
              padding: "12px 20px",
              borderTop: "1px solid #dee2e6",
              color: "#2c3e50",
              borderLeft: "4px solid #3498db",
            }}
          >
            {title}
          </td>
        </tr>
        <tr style={{ fontSize: "13px" }}>
          <td style={{ padding: "10px", textAlign: "center", color: "#6c757d", border: "1px solid #dee2e6" }}>{index + 1}</td>
          <td style={{ padding: "10px", textAlign: "right", color: "#2c3e50", fontWeight: "500", border: "1px solid #dee2e6" }}>
            {(data.Grandtotal || data.Total || 0).toFixed(2)}
          </td>
          <td style={{ padding: "10px", textAlign: "right", color: "#e74c3c", fontWeight: "500", border: "1px solid #dee2e6" }}>
            {(data.Discount || 0).toFixed(2)}
          </td>
          <td style={{ padding: "10px", textAlign: "right", color: "#f39c12", fontWeight: "500", border: "1px solid #dee2e6" }}>
            {(data.Refund || 0).toFixed(2)}
          </td>
          <td
            style={{
              padding: "10px",
              textAlign: "right",
              color: "#27ae60",
              fontWeight: "600",
              backgroundColor: "#f8fff9",
              border: "1px solid #dee2e6",
            }}
          >
            {netAmount}
          </td>
        </tr>
      </>
    );
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "30px",
        backgroundColor: "#ffffff",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <style>
        {`
          @media print {
            table { 
              page-break-inside: auto;
            }
            tr { 
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead { 
              display: table-header-group;
            }
            tfoot { 
              display: table-footer-group;
            }
            .payment-summary { 
              page-break-before: avoid;
              page-break-inside: avoid;
              margin-top: 20px;
            }
            .Register_btn_con { display: none; }
            body { 
              margin: 0;
              padding: 15mm;
            }
          }
        `}
      </style>

      <div className="Register_btn_con added_Register_btn_con" style={{ marginBottom: "20px", textAlign: "right" }}>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrint2} // 🔹 This works now
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            marginRight: "10px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.2s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={closeModalSummaryPrint}
          style={{
            backgroundColor: "#95a5a6",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.2s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#7f8c8d")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#95a5a6")}
        >
          Close
        </button>
      </div>

      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#ffffff" }}>
          <thead>
            <tr>
              <td
                colSpan="5"
                style={{
                  border: "none",
                  textAlign: "center",
                  padding: "30px 20px",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: "0 0 5px 0",
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#2c3e50",
                      letterSpacing: "0.5px",
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3
                    style={{
                      margin: "0 0 15px 0",
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#7f8c8d",
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 16px",
                      backgroundColor: "#e8f4fc",
                      borderRadius: "4px",
                      color: "#3498db",
                      fontWeight: "500",
                      fontSize: "14px",
                      border: "1px solid #d6eaf8",
                    }}
                  >
                    FINANCIAL SUMMARY REPORT - {reportDateRange}
                  </div>
                </div>
              </td>
            </tr>
            <tr
              style={{
                backgroundColor: "#2c3e50",
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              <th style={{ border: "1px solid #1a2530", padding: "12px 15px", textAlign: "center" }}>S.No</th>
              <th style={{ border: "1px solid #1a2530", padding: "12px 15px", textAlign: "right" }}>Gross Amount</th>
              <th style={{ border: "1px solid #1a2530", padding: "12px 15px", textAlign: "right" }}>Discount</th>
              <th style={{ border: "1px solid #1a2530", padding: "12px 15px", textAlign: "right" }}>Refund</th>
              <th style={{ border: "1px solid #1a2530", padding: "12px 15px", textAlign: "right" }}>Net Amount</th>
            </tr>
          </thead>
          <tbody>{summaryData.map((section, index) => renderSummarySection(section, index))}</tbody>
          <tfoot>
            <tr
              style={{
                borderTop: "2px solid #3498db",
                fontWeight: "bold",
                fontSize: "15px",
                backgroundColor: "#2c3e50",
                color: "white",
              }}
            >
              <td colSpan="4" style={{ padding: "15px", textAlign: "right", border: "1px solid #1a2530" }}>
                FINAL NET AMOUNT
              </td>
              <td
                style={{
                  padding: "15px",
                  textAlign: "right",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "1px solid #1a2530",
                  backgroundColor: "#27ae60",
                }}
              >
                ₹{FinalSummary.Finalnetamount ? FinalSummary.Finalnetamount.toFixed(2) : "0.00"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          fontSize: "12px",
          color: "#7f8c8d",
          textAlign: "center",
          borderTop: "1px solid #f1f1f1",
        }}
      >
        Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};






const ForPrintBillDataServices = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Combined_Billing_Report',
  });

  // Function to detect duplicate entries
  const detectDuplicates = (services) => {
    const duplicateMap = {};
    const duplicates = [];
    
    // Create a map to track occurrences
    services.forEach(service => {
      // Create a unique key based on patient, service, date, amount, and time
      const key = `${service.PatientId}-${service.ServiceName}-${service.OPDate}-${service.PaidAmount}-${service.billtime}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(service);
    });
    
    // Find entries that have duplicates
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to check if a specific service is a duplicate
  const isDuplicateService = (service, allServices) => {
    const key = `${service.PatientId}-${service.ServiceName}-${service.OPDate}-${service.PaidAmount}-${service.billtime}`;
    const matchingServices = allServices.filter(s => 
      `${s.PatientId}-${s.ServiceName}-${s.OPDate}-${s.PaidAmount}-${s.billtime}` === key
    );
    return matchingServices.length > 1;
  };

  // More strict duplicate detection for summary
  const detectStrictDuplicates = (services) => {
    const duplicateMap = {};
    
    services.forEach(service => {
      // Include more fields for stricter matching
      const key = `${service.PatientId}-${service.Patient_Name}-${service.ServiceName}-${service.OPDate}-${service.PaidAmount}-${service.billtime}-${service.created_by}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(service);
    });
    
    const duplicates = [];
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key: key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key]
        });
      }
    });
    
    return duplicates;
  };

  // Normalize and merge OP and IP service data
  const normalizedOPServices = (Filterservicesdata?.services || []).map(row => ({
    ...row,
    BillDate: row.OPDate,
    CashType: row.CashType || 'OPCash',
  }));

  const normalizedIPServices = (IPServicesdata?.services || []).map(row => ({
    ...row,
    BillDate: row.OPDate,
    CashType: row.CashType || 'IPCash',
  }));

  const allServices = [...normalizedOPServices, ...normalizedIPServices];
  const allRefunds = [...(FilterRefundUser?.refunds || [])];

  // Detect duplicates
  const duplicateServices = detectDuplicates(allServices);
  const hasDuplicates = duplicateServices.length > 0;
  const duplicateSummary = detectStrictDuplicates(allServices);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredServices(allServices);
      setFilteredRefunds(allRefunds);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      // Filter services
      const filteredServicesData = allServices.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(lowerSearchTerm)
        )
      );
      
      // Filter refunds
      const filteredRefundsData = allRefunds.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(lowerSearchTerm)
        )
      );
      
      setFilteredServices(filteredServicesData);
      setFilteredRefunds(filteredRefundsData);
    }
  }, [searchTerm, allServices, allRefunds]);

  // Create unified discount map
  const discountMap = {};
  [FilterDiscountUser?.discounts || [], IPDiscount?.discounts || []].flat().forEach(discount => {
    discount.DiscountedItems.forEach(item => {
      const key = `${discount.PatientId}-${discount.InvoiceNo}-${item.Service_Name}`.toLowerCase();
      discountMap[key] = parseFloat(item.Apportioned_Discount || 0);
    });
  });

  // Augment services with gross, discount, net amounts and duplicate flag
  const augmentedServices = filteredServices
    .filter(service => !showOnlyDuplicates || isDuplicateService(service, allServices))
    .map(row => {
      const key = `${row.PatientId}-${row.Invoiveno}-${row.ServiceName}`.toLowerCase();
      const discount = discountMap[key] || 0;
      const gross = parseFloat(row.PaidAmount || 0);
      const net = gross - discount;
      const isDuplicate = isDuplicateService(row, allServices);
      
      return { 
        ...row, 
        gross, 
        discount, 
        net,
        isDuplicate 
      };
    });

  // Group services by Service_Type and CashType
  const groupByServiceAndCashType = (data) => {
    return data.reduce((groups, item) => {
      const serviceType = item.Service_Type || 'UNKNOWN';
      const cashType = item.CashType || 'UNKNOWN';
      if (!groups[serviceType]) {
        groups[serviceType] = { OPCash: [], IPCash: [] };
      }
      if (cashType === 'OPCash') {
        groups[serviceType].OPCash.push(item);
      } else if (cashType === 'IPCash') {
        groups[serviceType].IPCash.push(item);
      }
      return groups;
    }, {});
  };

  // Group radiology services by RadiologyDept (e.g., Xray, CT)
  const groupRadiologyByDept = (data) => {
    return data.reduce((groups, item) => {
      const dept = item.RadiologyDept || 'UNKNOWN';
      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(item);
      return groups;
    }, {});
  };

  const groupedServices = groupByServiceAndCashType(augmentedServices);

  // Calculate overall totals based on filtered data
  const servicesGross = augmentedServices.reduce((sum, item) => sum + item.gross, 0);
  const servicesDiscount = augmentedServices.reduce((sum, item) => sum + item.discount, 0);
  const servicesNet = augmentedServices.reduce((sum, item) => sum + item.net, 0);

  // Render service section for OPCash/IPCash
  const renderTableSection = (data, title, indent = false) => {
    if (!data || data.length === 0) return null;

    const subtotalGross = data.reduce((sum, row) => sum + row.gross, 0);
    const subtotalDiscount = data.reduce((sum, row) => sum + row.discount, 0);
    const subtotalNet = data.reduce((sum, row) => sum + row.net, 0);

    return (
      <>
        <tr>
          <td
            colSpan="12"
            style={{
              border: 'none',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'start',
              backgroundColor: indent ? '#f9f9f9' : 'transparent',
              fontStyle: indent ? 'italic' : 'normal',
            }}
          >
            {title}
          </td>
        </tr>
        {data.map((row, index) => (
          <tr 
            key={`${title}-${index}`} 
            style={{ 
              fontSize: '10px',
              backgroundColor: row.isDuplicate ? '#ffebee' : 'transparent',
              borderLeft: row.isDuplicate ? '4px solid #f44336' : 'none'
            }}
          >
            <td style={{ 
              padding: '6px', 
              textAlign: 'center', 
              paddingLeft: indent ? '30px' : '6px',
              color: row.isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: row.isDuplicate ? 'bold' : 'bold'
            }}>
              {index + 1}
              {row.isDuplicate && ' ⚠️'}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.PatientId || '-'}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.BillDate || '-'}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.Invoiveno || '-'}
              {row.isDuplicate && (
                <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                  Duplicate
                </div>
              )}
            </td>
            <td style={{ 
              padding: '6px',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.Patient_Name || '-'}
            </td>
            <td style={{ 
              padding: '6px',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.ServiceName || '-'}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'right',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.gross.toFixed(2)}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'right',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.discount.toFixed(2)}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'right',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.net.toFixed(2)}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.PaymentMethod}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.CashType === 'IPCash' ? (row.Ward || '-') : (row.PatientCategory || '-')}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center',
              fontWeight: row.isDuplicate ? 'bold' : 'bold',
              color: row.isDuplicate ? '#d32f2f' : 'inherit'
            }}>
              {row.created_by || '-'}
            </td>
          </tr>
        ))}
        <tr
          style={{
            fontWeight: 'bold',
            fontSize: '12px',
            backgroundColor: '#f5f5f5',
          }}
        >
          <td colSpan="6" style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #ccc' }}>
            {title} Subtotal
          </td>
          <td style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #ccc' }}>
            {subtotalGross.toFixed(2)}
          </td>
          <td style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #ccc' }}>
            {subtotalDiscount.toFixed(2)}
          </td>
          <td style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #ccc' }}>
            {subtotalNet.toFixed(2)}
          </td>
          <td colSpan="3" style={{ borderTop: '1px solid #ccc' }}></td>
        </tr>
      </>
    );
  };

  const renderRadiologySection = (data, title) => {
    if (!data || (data.OPCash.length === 0 && data.IPCash.length === 0)) return null;

    const totalGross = data.OPCash.reduce((sum, row) => sum + row.gross, 0) +
                      data.IPCash.reduce((sum, row) => sum + row.gross, 0);
    const totalDiscount = data.OPCash.reduce((sum, row) => sum + row.discount, 0) +
                         data.IPCash.reduce((sum, row) => sum + row.discount, 0);
    const totalNet = data.OPCash.reduce((sum, row) => sum + row.net, 0) +
                    data.IPCash.reduce((sum, row) => sum + row.net, 0);

    const cashTypes = ['OPCash', 'IPCash'];

    return (
      <>
        {cashTypes.map(cashType => {
          const cashTypeData = data[cashType] || [];
          if (cashTypeData.length === 0) return null;

          const groupedByDept = groupRadiologyByDept(cashTypeData);
          return (
            <React.Fragment key={`${title}-${cashType}`}>
              {Object.keys(groupedByDept).map(deptName => {
                const deptData = groupedByDept[deptName];
                if (deptData.length === 0) return null;
                const subheading = `${deptName}${cashType === 'OPCash' ? 'OPcash' : 'IPcash'}`;
                return renderTableSection(deptData, subheading, true);
              })}
            </React.Fragment>
          );
        })}
        <tr
          style={{
            fontWeight: 'bold',
            fontSize: '12px',
            backgroundColor: '#e9e9e9',
          }}
        >
          <td colSpan="6" style={{ padding: '6px', textAlign: 'right', borderTop: '2px solid #000' }}>
             Total
          </td>
          <td style={{ padding: '6px', textAlign: 'right', borderTop: '2px solid #000' }}>
            {totalGross.toFixed(2)}
          </td>
          <td style={{ padding: '6px', textAlign: 'right', borderTop: '2px solid #000' }}>
            {totalDiscount.toFixed(2)}
          </td>
          <td style={{ padding: '6px', textAlign: 'right', borderTop: '2px solid #000' }}>
            {totalNet.toFixed(2)}
          </td>
          <td colSpan="3" style={{ borderTop: '2px solid #000' }}></td>
        </tr>
      </>
    );
  };

  const renderRefundSection = (data, title) => {
    if (!data || data.length === 0) return null;

    const subtotal = data.reduce((sum, row) => sum + parseFloat(row.PaidAmount || 0), 0).toFixed(2);

    return (
      <>
        <tr>
          <td
            colSpan="13"
            style={{
              border: 'none',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'left',
              backgroundColor: '#ffebee',
              padding: '6px'
            }}
          >
            {title}
          </td>
        </tr>
        {data.map((row, index) => (
          <tr key={`${title}-${index}`} style={{ fontSize: '10px' }}>
            <td style={{ padding: '6px', textAlign: 'center',fontWeight:'bold' }}>{index + 1}</td>
            <td style={{ padding: '6px', textAlign: 'center',fontWeight:'bold' }}>{row.PatientId || '-'}</td>
            <td style={{ padding: '6px', textAlign: 'center',fontWeight:'bold' }}>{row.BillDate || '-'}</td>
            <td style={{ padding: '6px', textAlign: 'center',fontWeight:'bold' }}>{row.billtime || '-'}</td>
            <td style={{ padding: '6px', textAlign: 'center',fontWeight:'bold' }}>{row.InvoiceNo || '-'}</td>
            <td style={{ padding: '6px',fontWeight:'bold' }}>{row.Patient_Name || '-'}</td>
            <td style={{ padding: '6px',fontWeight:'bold' }}>
               (Voucher: {row.VoucherNumber || '-'})
            </td>
            <td style={{ padding: '6px', textAlign: 'right' }}></td>
            <td style={{ padding: '6px', textAlign: 'right' }}></td>
            <td style={{ padding: '6px', textAlign: 'right' }}>
              {parseFloat(row.PaidAmount || 0).toFixed(2)}
            </td>
            <td style={{ padding: '6px', textAlign: 'center',fontWeight:'bold' }}>{row.PhoneNumber || '-'}</td>
            <td style={{ padding: '6px', textAlign: 'center',fontWeight:'bold' }}>{row.Billedby || '-'}</td>
            <td style={{ padding: '6px', textAlign: 'center' }}></td>
          </tr>
        ))}
        <tr
          style={{
            fontWeight: 'bold',
            fontSize: '12px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <td colSpan="7" style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #000' }}>
            Refund Subtotal
          </td>
          <td style={{ borderTop: '1px solid #000' }}></td>
          <td style={{ borderTop: '1px solid #000' }}></td>
          <td style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #000' }}>
            {subtotal}
          </td>
          <td colSpan="3" style={{ borderTop: '1px solid #000' }}></td>
        </tr>
      </>
    );
  };

  // Calculate payment method totals based on filtered data
  const serviceTotals = { Cash: 0, UPI: 0, Card: 0 };
  const discountTotals = { Cash: 0, UPI: 0, Card: 0 };
  const refundTotals = { Cash: 0, UPI: 0, Card: 0 };
  const finalTotals = { Cash: 0, UPI: 0, Card: 0 };

  augmentedServices.forEach(row => {
    const gross = row.gross;
    const discount = row.discount;
    const net = row.net;
    if (row.PaymentMethod.includes('Cash')) {
      serviceTotals.Cash += gross;
      discountTotals.Cash += discount;
      finalTotals.Cash += net;
    }
    if (row.PaymentMethod.includes('UPI')) {
      serviceTotals.UPI += gross;
      discountTotals.UPI += discount;
      finalTotals.UPI += net;
    }
    if (row.PaymentMethod.includes('Card')) {
      serviceTotals.Card += gross;
      discountTotals.Card += discount;
      finalTotals.Card += net;
    }
  });

  filteredRefunds.forEach(row => {
    (row.PaymentMethods || []).forEach(method => {
      const amount = parseFloat(method.Transaction_Amount || 0);
      if (method.Payment_Type === 'Cash') refundTotals.Cash += amount;
      else if (method.Payment_Type === 'UPI') refundTotals.UPI += amount;
      else if (method.Payment_Type === 'Card') refundTotals.Card += amount;
    });
  });

  finalTotals.Cash = Math.max(0, finalTotals.Cash - refundTotals.Cash).toFixed(2);
  finalTotals.UPI = Math.max(0, finalTotals.UPI - refundTotals.UPI).toFixed(2);
  finalTotals.Card = Math.max(0, finalTotals.Card - refundTotals.Card).toFixed(2);

  const totalServiceAmount = (serviceTotals.Cash + serviceTotals.UPI + serviceTotals.Card).toFixed(2);
  const totalDiscountAmount = (discountTotals.Cash + discountTotals.UPI + discountTotals.Card).toFixed(2);
  const totalRefundAmount = (refundTotals.Cash + refundTotals.UPI + refundTotals.Card).toFixed(2);
  const totalFinalAmount = (
    parseFloat(finalTotals.Cash) +
    parseFloat(finalTotals.UPI) +
    parseFloat(finalTotals.Card)
  ).toFixed(2);

  // Format date range
  const reportDateRange =
    searchOptions.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions.FromDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')} To: ${new Date(searchOptions.ToDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`;

  const netTotal = Math.max(0, servicesNet - filteredRefunds.reduce((sum, row) => sum + parseFloat(row.PaidAmount || 0), 0)).toFixed(2);

  // Calculate department totals for the summary
  const calculateDepartmentTotals = () => {
    const departmentTotals = {};
    
    // Process all augmented services to calculate department totals
    augmentedServices.forEach(service => {
      const serviceType = service.Service_Type || 'UNKNOWN';
      
      if (serviceType === 'RADIOLOGY') {
        // For radiology, break down by sub-department
        const radiologyDept = service.RadiologyDept || 'Other Radiology';
        const deptKey = `RADIOLOGY - ${radiologyDept}`;
        departmentTotals[deptKey] = (departmentTotals[deptKey] || 0) + service.net;
        
        // Also keep track of total radiology
        departmentTotals['RADIOLOGY'] = (departmentTotals['RADIOLOGY'] || 0) + service.net;
      } else {
        // For other departments
        departmentTotals[serviceType] = (departmentTotals[serviceType] || 0) + service.net;
      }
    });

    // Remove radiology total if we have sub-departments to avoid duplication
    if (departmentTotals['RADIOLOGY']) {
      delete departmentTotals['RADIOLOGY'];
    }

    return departmentTotals;
  };

  const departmentTotals = calculateDepartmentTotals();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .duplicate-alert {
              display: none;
            }
            .duplicate-summary {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
            .department-summary table {
              page-break-inside: avoid;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .payment-summary-table, .department-summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .payment-summary-table th, 
          .payment-summary-table td,
          .department-summary-table th,
          .department-summary-table td {
            border: 1px solid #d1d5db;
            padding: 6px;
            font-size: 11px;
          }
          .payment-summary-table th,
          .department-summary-table th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
        `}
      </style>

      {/* Duplicate Alert */}
      {hasDuplicates && (
        <div className="duplicate-alert" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#856404', 
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              ⚠️ DUPLICATE ENTRIES DETECTED
            </span>
            <span style={{ color: '#856404' }}>
              Found {duplicateServices.length} duplicate bill entries
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: '6px 12px',
              backgroundColor: showOnlyDuplicates ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOnlyDuplicates ? 'Show All Bills' : 'Show Only Duplicates'}
          </button>
        </div>
      )}

      {/* Duplicate Summary */}
      {hasDuplicates && (
        <div className="duplicate-summary" style={{ 
          marginBottom: '20px', 
          border: '1px solid #ffcdd2', 
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Duplicate Entries Summary</h4>
          {duplicateSummary.map((group, index) => (
            <div key={index} style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {group.entries[0].Patient_Name} - {group.entries[0].ServiceName} 
                (₹{group.entries[0].PaidAmount}) - {group.count} times
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Bills: {group.entries.map(e => e.Invoiveno).join(', ')} | 
                Receipts: {group.entries.map(e => e.ReceiptNumber).join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="serviceSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Services:
          </label>
          <input
            id="serviceSearch"
            type="text"
            className="search-input"
            placeholder="Search by patient name, ID, service name, bill no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
       
        <div className="results-info">
          Showing {augmentedServices.length} services, {filteredRefunds.length} refunds
          {showOnlyDuplicates && ` (Duplicate entries only)`}
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>
       
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}
      </div>

      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlePrint2}>
          Print
        </button>
        <button className="RegisterForm_1_btns" onClick={handlePrintClose}>
          Close
        </button>
      </div>

      <div ref={componentRef} className="report-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td colSpan="12" style={{ border: 'none', textAlign: 'center', padding: '10px' }}>
                <div>
                  <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '700', color: '#1f2937' }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: '5px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#4b5563' }}>
                    {reportDateRange}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {showOnlyDuplicates && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#d32f2f', fontStyle: 'italic', fontWeight: 'bold' }}>
                      ⚠️ Showing Duplicate Entries Only
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6', fontWeight: '600', fontSize: '13px' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>S.No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>PatientNo</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>BillDate</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>BillNo</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>Patient Name</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>Service Name</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Gross Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Discount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Net Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>PayType</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Category/Ward</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Prepared</th>
            </tr>
          </thead>
          <tbody>
            {augmentedServices.length > 0 ? (
              Object.keys(groupedServices).map(serviceType => (
                <React.Fragment key={serviceType}>
                  <tr>
                    <td
                      colSpan="12"
                      style={{
                        backgroundColor: '#e0e0e0',
                        fontWeight: 'bold',
                        padding: '6px',
                        textAlign: "start"
                      }}
                    >
                      {serviceType}
                    </td>
                  </tr>
                  {serviceType === 'RADIOLOGY'
                    ? renderRadiologySection(groupedServices[serviceType], serviceType)
                    : (
                      <>
                        {renderTableSection(groupedServices[serviceType].OPCash, 'OPCash', true)}
                        {renderTableSection(groupedServices[serviceType].IPCash, 'IPCash', true)}
                        <tr style={{ fontWeight: 'bold', backgroundColor: '#e9e9e9' }}>
                          <td colSpan="6" style={{ padding: '6px', textAlign: 'right', borderTop: '2px solid #000' }}>
                             Total
                          </td>
                          <td style={{ padding: '6px', textAlign: 'right', borderTop: '2px solid #000' }}>
                            {(groupedServices[serviceType].OPCash.reduce((sum, row) => sum + row.gross, 0) +
                              groupedServices[serviceType].IPCash.reduce((sum, row) => sum + row.gross, 0)).toFixed(2)}
                          </td>
                          <td style={{ padding: '6px', textAlign: 'right', borderTop: '2px solid #000' }}>
                            {(groupedServices[serviceType].OPCash.reduce((sum, row) => sum + row.discount, 0) +
                              groupedServices[serviceType].IPCash.reduce((sum, row) => sum + row.discount, 0)).toFixed(2)}
                          </td>
                          <td style={{ padding: '6px', textAlign: 'right', borderTop: '2px solid #000' }}>
                            {(groupedServices[serviceType].OPCash.reduce((sum, row) => sum + row.net, 0) +
                              groupedServices[serviceType].IPCash.reduce((sum, row) => sum + row.net, 0)).toFixed(2)}
                          </td>
                          <td colSpan="3" style={{ borderTop: '2px solid #000' }}></td>
                        </tr>
                      </>
                    )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="12" style={{ border: '1px solid #d1d5db', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  {showOnlyDuplicates 
                    ? "No duplicate entries found matching your criteria" 
                    : `No service records found for "${searchTerm}"`
                  }
                </td>
              </tr>
            )}
            
            {/* Services Grand Total */}
            {augmentedServices.length > 0 && (
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                <td colSpan="6" style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #000' }}>
                  Services Grand Total
                </td>
                <td style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #000' }}>
                  {servicesGross.toFixed(2)}
                </td>
                <td style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #000' }}>
                  {servicesDiscount.toFixed(2)}
                </td>
                <td style={{ padding: '6px', textAlign: 'right', borderTop: '1px solid #000' }}>
                  {servicesNet.toFixed(2)}
                </td>
                <td colSpan="3" style={{ borderTop: '1px solid #000' }}></td>
              </tr>
            )}
            
            {/* Refunds Section */}
            {renderRefundSection(filteredRefunds, 'Refunds')}
          </tbody>
          
          {/* Final Net Total */}
          <tfoot>
            <tr style={{ fontWeight: 'bold', backgroundColor: '#e9e9e9' }}>
              <td colSpan="7" style={{ padding: '8px', textAlign: 'right', borderTop: '2px solid #000' }}>
                Final Net Total
              </td>
              <td style={{ borderTop: '2px solid #000' }}></td>
              <td style={{ borderTop: '2px solid #000' }}></td>
              <td style={{ padding: '8px', textAlign: 'right', borderTop: '2px solid #000' }}>
                {netTotal}
              </td>
              <td colSpan="3" style={{ borderTop: '2px solid #000' }}></td>
            </tr>
          </tfoot>
        </table>

        {/* Payment Summary Table */}
        <div className="payment-summary">
          <p style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'left', margin: '10px 0' }}>
            Payment Method Summary
          </p>
          <table className="payment-summary-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '25%' }}>Payment Method</th>
                <th style={{ textAlign: 'right', width: '18%' }}>Service Amount</th>
                <th style={{ textAlign: 'right', width: '18%' }}>Discount Amount</th>
                <th style={{ textAlign: 'right', width: '18%' }}>Refund Amount</th>
                <th style={{ textAlign: 'right', width: '18%' }}>Final Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cash</td>
                <td style={{ textAlign: 'right' }}>{serviceTotals.Cash.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{discountTotals.Cash.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{refundTotals.Cash.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{finalTotals.Cash}</td>
              </tr>
              <tr>
                <td>UPI</td>
                <td style={{ textAlign: 'right' }}>{serviceTotals.UPI.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{discountTotals.UPI.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{refundTotals.UPI.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{finalTotals.UPI}</td>
              </tr>
              <tr>
                <td>Card</td>
                <td style={{ textAlign: 'right' }}>{serviceTotals.Card.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{discountTotals.Card.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{refundTotals.Card.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{finalTotals.Card}</td>
              </tr>
              <tr style={{ borderTop: '2px solid #000', fontWeight: 'bold', backgroundColor: '#e9e9e9' }}>
                <td>Total</td>
                <td style={{ textAlign: 'right' }}>{totalServiceAmount}</td>
                <td style={{ textAlign: 'right' }}>{totalDiscountAmount}</td>
                <td style={{ textAlign: 'right' }}>{totalRefundAmount}</td>
                <td style={{ textAlign: 'right' }}>{totalFinalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Department Wise Summary */}
        <div className="department-summary" style={{ marginTop: '20px', pageBreakInside: 'avoid' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'left', margin: '10px 0' }}>
            Department Wise Summary
          </p>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            fontSize: '12px',
            border: '1px solid #d1d5db'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ 
                  border: '1px solid #d1d5db', 
                  padding: '8px', 
                  textAlign: 'left', 
                  width: '60%',
                  fontWeight: 'bold'
                }}>Department</th>
                <th style={{ 
                  border: '1px solid #d1d5db', 
                  padding: '8px', 
                  textAlign: 'right', 
                  width: '40%',
                  fontWeight: 'bold'
                }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Sort departments alphabetically
                const sortedDepartments = Object.keys(departmentTotals).sort();

                let grandTotal = 0;

                return (
                  <>
                    {sortedDepartments.map(dept => {
                      const amount = departmentTotals[dept];
                      grandTotal += amount;
                      
                      return (
                        <tr key={dept}>
                          <td style={{ 
                            border: '1px solid #d1d5db', 
                            padding: '8px', 
                            textAlign: 'left',
                            fontWeight: dept.includes('RADIOLOGY -') ? 'normal' : 'bold',
                            paddingLeft: dept.includes('RADIOLOGY -') ? '30px' : '8px'
                          }}>
                            {dept}
                          </td>
                          <td style={{ 
                            border: '1px solid #d1d5db', 
                            padding: '8px', 
                            textAlign: 'right',
                            fontWeight: dept.includes('RADIOLOGY -') ? 'normal' : 'bold'
                          }}>
                            {amount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Grand Total Row */}
                    <tr style={{ 
                      borderTop: '2px solid #000', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e9e9e9' 
                    }}>
                      <td style={{ 
                        border: '1px solid #d1d5db', 
                        padding: '8px', 
                        textAlign: 'left' 
                      }}>
                        GRAND TOTAL
                      </td>
                      <td style={{ 
                        border: '1px solid #d1d5db', 
                        padding: '8px', 
                        textAlign: 'right' 
                      }}>
                        {grandTotal.toFixed(2)}
                      </td>
                    </tr>
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



const ForIPPharmacyPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Pharmacy_Billing_Report',
  });

  useEffect(() => {
    // Ensure IPPharmacy is an array, fallback to empty array
    const sourceData = Array.isArray(IPPharmacy) ? IPPharmacy : [];
    
    if (searchTerm.trim() === '') {
      setFilteredData(sourceData);
    } else {
      const filtered = sourceData.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, IPPharmacy]);

  // Safely calculate totals - ensure filteredData is an array
  const totals = (Array.isArray(filteredData) ? filteredData : []).reduce(
    (acc, row) => ({
      TotalAmount: acc.TotalAmount + (parseFloat(row?.TotalAmount) || 0),
      Quantity: acc.Quantity + (parseFloat(row?.Quantity) || 0),
    }),
    { TotalAmount: 0, Quantity: 0 }
  );

  // Rest of your component remains the same...
  const reportDateRange = 
    searchOptions?.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions?.CurrentDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions?.FromDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')} To: ${new Date(searchOptions?.ToDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Search container and buttons remain the same */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by medicine name, bill no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')}>Clear Search</button>
        )}
      </div>

      <div className="Register_btn_con">
        <button onClick={handlePrint}>Print</button>
        <button onClick={closeModalIPPharmacyPrint}>Close</button>
      </div>

      {/* Report container */}
      <div ref={componentRef} className="report-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>
                <h2>KARUNA MEDICAL COLLEGE HOSPITAL</h2>
                <h3>Vilayodi, Chittur, Palakkad</h3>
                <p>{reportDateRange}</p>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6', fontWeight: '600' }}>
              <th scope="col">S.No</th>
              <th scope="col">Bill No</th>
              <th scope="col">Medicine Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={`pharmacy-bill-${index}`}>
                  <td>{index + 1}</td>
                  <td>{row.BillNo || '-'}</td>
                  <td>{row.MedicineName || '-'}</td>
                  <td>{row.Quantity || '-'}</td>
                  <td>{parseFloat(row.UnitPrice || 0).toFixed(2)}</td>
                  <td>{parseFloat(row.TotalAmount || 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No records found
                </td>
              </tr>
            )}
            {Array.isArray(filteredData) && filteredData.length > 0 && (
              <tr style={{ fontWeight: '700', backgroundColor: '#d1d5db' }}>
                <td colSpan="3">Grand Total ({filteredData.length} records)</td>
                <td>{totals.Quantity}</td>
                <td></td>
                <td>{totals.TotalAmount.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const ForFreePharmacyPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Pharmacy_Billing_Report',
  });

  useEffect(() => {
    // Ensure IPPharmacy is an array, fallback to empty array
    const sourceData = Array.isArray(FreePharmacy.pharmacy_items) ? FreePharmacy.pharmacy_items : [];
    
    if (searchTerm.trim() === '') {
      setFilteredData(sourceData);
    } else {
      const filtered = sourceData.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, FreePharmacy]);

  // Safely calculate totals - ensure filteredData is an array
  const totals = (Array.isArray(filteredData) ? filteredData : []).reduce(
    (acc, row) => ({
      TotalAmount: acc.TotalAmount + (parseFloat(row?.TotalAmount) || 0),
      Quantity: acc.Quantity + (parseFloat(row?.Quantity) || 0),
    }),
    { TotalAmount: 0, Quantity: 0 }
  );

  // Rest of your component remains the same...
  const reportDateRange = 
    searchOptions?.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions?.CurrentDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions?.FromDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')} To: ${new Date(searchOptions?.ToDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Search container and buttons remain the same */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by medicine name, bill no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')}>Clear Search</button>
        )}
      </div>

      <div className="Register_btn_con">
        <button onClick={handlePrint}>Print</button>
        <button onClick={closeModalOPPharmacyPrint}>Close</button>
      </div>

      {/* Report container */}
      <div ref={componentRef} className="report-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>
                <h2>KARUNA MEDICAL COLLEGE HOSPITAL</h2>
                <h3>Vilayodi, Chittur, Palakkad</h3>
                <p>{reportDateRange}</p>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6', fontWeight: '600' }}>
              <th scope="col">S.No</th>
              <th scope="col">Bill No</th>
              <th scope="col">Medicine Name</th>
              <th scope="col">Quantity</th>
              {/* <th scope="col">Unit Price</th> */}
              <th scope="col">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={`pharmacy-bill-${index}`}>
                  <td>{index + 1}</td>
                  <td>{row.InvoiceNo || '-'}</td>
                  <td>{row.ItemName || '-'}</td>
                  <td>{row.Quantity || '-'}</td>
                  {/* <td>{parseFloat(row.UnitPrice || 0).toFixed(2)}</td> */}
                  <td>{parseFloat(row.PaidAmount || 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No records found
                </td>
              </tr>
            )}
            {Array.isArray(filteredData) && filteredData.length > 0 && (
              <tr style={{ fontWeight: '700', backgroundColor: '#d1d5db' }}>
                <td colSpan="3">Grand Total ({filteredData.length} records)</td>
                <td>{totals.Quantity}</td>
                <td></td>
                <td>{totals.TotalAmount.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};



const ForAllPharmacyPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showOnlyDuplicates, setShowOnlyDuplicates] = React.useState(false);
  
  // New search states
  const [pharmacyTypeFilter, setPharmacyTypeFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [fromBillNo, setFromBillNo] = React.useState('');
  const [toBillNo, setToBillNo] = React.useState('');
  
  // Extract the data array from AllPharmacy object
  const pharmacyDataArray = Array.isArray(AllPharmacy?.data) ? AllPharmacy.data : [];
  
  // Get walkin pharmacy data and process it according to BillType
  const processWalkinPharmacyData = () => {
    const rawWalkinData = Array.isArray(walkinPharmacy?.data) ? walkinPharmacy.data : [];
    
    return rawWalkinData.map(item => {
      // Create a copy of the item to avoid mutation
      const processedItem = { ...item };
      
      if (item.BillType === 'Credit') {
        // For Credit BillType: paid amount becomes Credit amount, Paid amount becomes 0
        processedItem.Creditamt = item.Paid_Amount || 0;
        processedItem.Paid_Amount = 0;
      } else if (item.BillType === 'Cash') {
        // For Cash BillType: Credit amount becomes 0, Paid amount remains as is
        processedItem.Creditamt = 0;
        processedItem.Paid_Amount = item.Paid_Amount || 0;
      }
      // For other BillTypes, keep the original values
      
      return processedItem;
    });
  };
  
  const walkinPharmacyArray = processWalkinPharmacyData();
  
  // Combine both pharmacy data arrays
  const combinedPharmacyData = [...pharmacyDataArray, ...walkinPharmacyArray];

  // Get refund data from the actual data source
  const refundDataArray = Array.isArray(PharmacyRefund?.data) ? PharmacyRefund.data : [];
  
  // Get walkin pharmacy refund data
  const walkinRefundDataArray = Array.isArray(Walkinpharmacyrefund?.data) ? Walkinpharmacyrefund.data : [];

  // Combine all refund data
  const allRefundData = [...refundDataArray, ...walkinRefundDataArray];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Pharmacy_Paid_Wise_Report',
  });

  // Function to detect duplicate pharmacy entries
  const detectDuplicates = (pharmacyData) => {
    const duplicateMap = {};
    const duplicates = [];
    
    pharmacyData.forEach(item => {
      // Create a unique key based on patient, invoice, and amount
      const key = `${item.PatientId}-${item.InvoiceNo}-${item.Total_Amount || (parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0))}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to detect duplicate refund entries
  const detectRefundDuplicates = (refundData) => {
    const duplicateMap = {};
    const duplicates = [];
    
    refundData.forEach(item => {
      const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to check if a specific pharmacy item is a duplicate
  const isDuplicatePharmacyItem = (item, allItems) => {
    const key = `${item.PatientId}-${item.InvoiceNo}-${item.Total_Amount || (parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0))}`;
    const matchingItems = allItems.filter(i => 
      `${i.PatientId}-${i.InvoiceNo}-${i.Total_Amount || (parseFloat(i.Creditamt || 0) + parseFloat(i.Paid_Amount || 0))}` === key
    );
    return matchingItems.length > 1;
  };

  // Function to check if a specific refund is a duplicate
  const isDuplicateRefundItem = (item, allRefunds) => {
    const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}`;
    const matchingRefunds = allRefunds.filter(r => 
      `${r.PatientID}-${r.Billinvoice || r.Invoice_NO}-${r.TotalAmount}` === key
    );
    return matchingRefunds.length > 1;
  };

  // More strict duplicate detection for summary
  const detectStrictDuplicates = (data, isRefund = false) => {
    const duplicateMap = {};
    
    data.forEach(item => {
      const key = isRefund 
        ? `${item.PatientID}-${item.Patient_Name}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.Billing_Date}`
        : `${item.PatientId}-${item.Patient_Name}-${item.InvoiceNo}-${item.Total_Amount || (parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0))}-${item.BillingDate}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    
    const duplicates = [];
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key: key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key],
          type: isRefund ? 'refund' : 'pharmacy'
        });
      }
    });
    
    return duplicates;
  };

  // Detect duplicates
  const duplicatePharmacyItems = detectDuplicates(combinedPharmacyData);
  const duplicateRefundItems = detectRefundDuplicates(allRefundData);
  const hasDuplicates = duplicatePharmacyItems.length > 0 || duplicateRefundItems.length > 0;
  
  const duplicatePharmacySummary = detectStrictDuplicates(combinedPharmacyData, false);
  const duplicateRefundSummary = detectStrictDuplicates(allRefundData, true);
  const allDuplicateSummary = [...duplicatePharmacySummary, ...duplicateRefundSummary];

  // Function to get pharmacy type from data
  const getPharmacyType = (item) => {
    if (item.Pharmacy_Type === 'IPWALKING') return 'IPwalking';
    if (item.BillType === 'IP PHARMACY') return 'IPPharmacy';
    if (item.BillType === 'FREE PHARMACY') return 'Freepharmacy';
    if (item.BillType === 'OP Pharmacy') return 'OPPharmacy';
    return 'Other';
  };

  // Updated function to get status from data - now checks amounts for Paid/Credit instead of just BillType
  const getStatus = (item) => {
    if (item.NewPayment === 'RefundPayment') return 'Refund';
    
    const credit = parseFloat(item.Creditamt || 0);
    const paid = parseFloat(item.Paid_Amount || 0);
    const total = parseFloat(item.Total_Amount || (credit + paid));
    
    if (credit > 0) return 'Credit'; // Due/Credit if there's outstanding credit
    if (paid > 0 || (total > 0 && credit === 0)) return 'Paid'; // Paid if no credit and has payment or total
    return 'Other';
  };

  // Function to extract bill number for filtering
  const getBillNumber = (item) => {
    if (item.InvoiceNo) return item.InvoiceNo;
    if (item.Billinvoice) return item.Billinvoice;
    if (item.Voucher_Number) return item.Voucher_Number;
    return '';
  };

  // Filter data WITHOUT bill number range - for generating dynamic bill number options
  const filterDataWithoutBillRange = (data, isRefund = false) => {
    return data.filter(item => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Pharmacy type filter
      const pharmacyType = isRefund ? item.Pharmacy_Type : getPharmacyType(item);
      const matchesPharmacyType = pharmacyTypeFilter === 'All' || 
        (pharmacyTypeFilter === 'IPPharmacy' && pharmacyType === 'IPPharmacy') ||
        (pharmacyTypeFilter === 'Freepharmacy' && pharmacyType === 'Freepharmacy') ||
        (pharmacyTypeFilter === 'IPwalking' && pharmacyType === 'IPwalking');
      
      // Status filter - only apply to non-refund data for Paid/Credit; refunds always pass if All or ignore for specific
      let matchesStatus = true;
      if (!isRefund) {
        const status = getStatus(item);
        matchesStatus = statusFilter === 'All' || 
          (statusFilter === 'Paid' && status === 'Paid') ||
          (statusFilter === 'Credit' && status === 'Credit');
      } else if (statusFilter !== 'All') {
        // For refunds, only show if status is All; otherwise hide to avoid filtering refunds with Paid/Credit
        matchesStatus = false;
      }
      
      return matchesSearch && matchesPharmacyType && matchesStatus;
    });
  };

  // Get dynamic bill numbers based on current search, type, and status filters
  const getDynamicBillNumbers = () => {
    const intermediateBilledData = filterDataWithoutBillRange(combinedPharmacyData);
    const intermediateRefundData = filterDataWithoutBillRange(allRefundData, true);
    const allIntermediateItems = [...intermediateBilledData, ...intermediateRefundData];
    const billNumbers = allIntermediateItems
      .map(item => getBillNumber(item))
      .filter(billNo => billNo && billNo.trim() !== '')
      .sort();
    
    return [...new Set(billNumbers)];
  };

  const billNumberOptions = getDynamicBillNumbers();

  // Full filter data function - applies bill number range on top of the intermediate filters
  const filterData = (data, isRefund = false) => {
    // First, get intermediate filtered data (without billNo range)
    let intermediateData = filterDataWithoutBillRange(data, isRefund);
    
    // Then apply bill number range filter
    return intermediateData.filter(item => {
      const billNo = getBillNumber(item);
      let matchesBillNoRange = true;
      if (fromBillNo && toBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex && currentIndex <= toIndex;
      } else if (fromBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex;
      } else if (toBillNo && billNumberOptions.length > 0) {
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex <= toIndex;
      }
      
      return matchesBillNoRange;
    });
  };

  // Apply filters to data
  const filteredBilledData = filterData(combinedPharmacyData);
  const filteredRefundData = filterData(allRefundData, true);

  // Apply duplicate filter if enabled
  const displayBilledData = showOnlyDuplicates 
    ? filteredBilledData.filter(item => isDuplicatePharmacyItem(item, combinedPharmacyData))
    : filteredBilledData;

  const displayRefundData = showOnlyDuplicates 
    ? filteredRefundData.filter(item => isDuplicateRefundItem(item, allRefundData))
    : filteredRefundData;

  // Group filtered data by BillType for billed items - Updated to include IP WALKING
  const groupedData = React.useMemo(() => {
    if (!Array.isArray(displayBilledData)) return {};
    
    return displayBilledData.reduce((acc, row) => {
      if (!row) return acc;
      
      // Determine group based on BillType and Pharmacy_Type
      let groupKey = row.BillType || 'Unknown';
      
      // Check for IP WALKING type
      if (row.Pharmacy_Type === 'IPWALKING') {
        groupKey = 'IP WALKING';
      }
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(row);
      return acc;
    }, {});
  }, [displayBilledData]);

  // Updated calculate totals for refunds to categorize by paytype
  const calculateTotals = (data, isRefund = false) => {
    if (!Array.isArray(data)) {
      return { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 };
    }
    
    return data.reduce(
      (acc, row) => {
        if (isRefund) {
          // For refunds, categorize by paytype
          const refundAmount = parseFloat(row?.TotalAmount || 0);
          let credit = 0;
          let paid = 0;
          
          if (row?.paytype === 'Credit') {
            credit = refundAmount;
          } else if (row?.paytype === 'Cash') {
            paid = refundAmount;
          } else {
            // Default: treat as credit if unclear
            credit = refundAmount;
          }
          
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + refundAmount
          };
        } else {
          const credit = parseFloat(row?.Creditamt || 0);
          const paid = parseFloat(row?.Paid_Amount || 0);
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + (credit + paid)
          };
        }
      },
      { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 }
    );
  };

  const grandTotals = calculateTotals(displayBilledData);
  const refundTotals = calculateTotals(displayRefundData, true);

  // Format date range
  const reportDateRange =
    searchOptions?.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions?.CurrentDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions?.FromDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')} To: ${new Date(searchOptions?.ToDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`;

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setPharmacyTypeFilter('All');
    setStatusFilter('All');
    setFromBillNo('');
    setToBillNo('');
  };

  // Helper function to get refund amounts by paytype
  const getRefundAmounts = (row) => {
    const refundAmount = parseFloat(row?.PaidAmount || 0);
    let credit = 0;
    let paid = 0;
    
    if (row?.paytype === 'Credit') {
      credit = refundAmount;
    } else if (row?.paytype === 'Cash') {
      paid = refundAmount;
    } else {
      // Default: treat as credit if paytype is missing or unknown
      credit = refundAmount;
    }
    
    return { credit, paid, total: refundAmount };
  };

  const renderGroupSection = (groupData, groupTitle, isRefund = false) => {
    if (!Array.isArray(groupData) || groupData.length === 0) return null;

    const groupTotals = calculateTotals(groupData, isRefund);

    return (
      <>
        <tr>
          <td colSpan="12" style={{ 
            padding: '10px', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            backgroundColor: isRefund ? '#fff3cd' : '#e9ecef', 
            border: '1px solid #d1d5db',
            color: isRefund ? '#856404' : 'inherit'
          }}>
            {groupTitle} ({groupData.length} records)
          </td>
        </tr>
        {groupData.map((row, index) => {
          const isDuplicate = isRefund 
            ? isDuplicateRefundItem(row, allRefundData)
            : isDuplicatePharmacyItem(row, combinedPharmacyData);
          
          // Get amounts for refund based on paytype
          const { credit, paid, total } = isRefund ? getRefundAmounts(row) : {
            credit: parseFloat(row?.Creditamt || 0),
            paid: parseFloat(row?.Paid_Amount || 0),
            total: parseFloat(row?.Total_Amount || (parseFloat(row?.Creditamt || 0) + parseFloat(row?.Paid_Amount || 0)))
          };
            
          return (
          <tr
            key={`${groupTitle}-${index}`}
            style={{ 
              fontSize: '12px', 
              backgroundColor: isDuplicate ? '#ffebee' : (index % 2 === 0 ? '#ffffff' : '#f9fafb'),
              borderLeft: isDuplicate ? '4px solid #f44336' : 'none'
            }}
          >
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {index + 1}
              {isDuplicate && ' ⚠️'}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Voucher_Number || row?.Billinvoice || '-') : (row?.InvoiceNo || '-')}{isDuplicate && (
                <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                  Duplicate
                </div>
              )}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Billing_Date || '-') : (row?.BillingDate || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.PatientID || '-') : (row?.PatientId || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'left',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Patient_Name || '-') : (row?.Patient_Name || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.PatCategory || '-') : (row?.PatCategory || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Remarks || '-') : (row?.Remarks || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'right',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {credit.toFixed(2)}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'right',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {paid.toFixed(2)}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'right',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {total.toFixed(2)}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? 'Refunded' : (row?.Bill_Status || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Billedby || '-') : (row?.created_by || '-')}
            </td>
          </tr>
        )})}
        <tr style={{ 
          fontWeight: '700', 
          fontSize: '14px', 
          backgroundColor: isRefund ? '#fff3cd' : '#d1d5db' 
        }}>
          <td colSpan="7" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            Subtotal
          </td>
          <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            {groupTotals.Creditamt.toFixed(2)}
          </td>
          <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            {groupTotals.Paid_Amount.toFixed(2)}
          </td>
          <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            {groupTotals.Total_Amount.toFixed(2)}
          </td>
          <td colSpan="2" style={{ border: '1px solid #d1d5db' }}></td>
        </tr>
      </>
    );
  };

  // Get record counts
  const billedRecordCount = Array.isArray(displayBilledData) ? displayBilledData.length : 0;
  const refundRecordCount = Array.isArray(displayRefundData) ? displayRefundData.length : 0;
  const totalRecords = Array.isArray(combinedPharmacyData) ? combinedPharmacyData.length : 0;
  const totalRefunds = Array.isArray(allRefundData) ? allRefundData.length : 0;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            table { page-break-inside: auto; width: 100%; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            .Register_btn_con { display: none; }
            .search-container { display: none; }
            .duplicate-alert { display: none; }
            .duplicate-summary { display: none; }
            .report-container { font-size: 12px; }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover { background-color: #1e40af; }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input, .search-select {
            padding: 4px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 150px;
          }
          .search-input:focus, .search-select:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover { background-color: #4b5563; }
          .filter-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            flex-wrap: wrap;
            align-items: center;
          }
          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .filter-label {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
          }
          .billno-range {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .billno-info {
            font-size: 12px;
            color: #6b7280;
            font-style: italic;
          }
        `}
      </style>

      {/* Duplicate Alert */}
      {hasDuplicates && (
        <div className="duplicate-alert" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#856404', 
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              ⚠️ DUPLICATE PHARMACY ENTRIES DETECTED
            </span>
            <span style={{ color: '#856404' }}>
              Found {duplicatePharmacyItems.length} duplicate pharmacy entries, {duplicateRefundItems.length} duplicate refund entries
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: '6px 12px',
              backgroundColor: showOnlyDuplicates ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOnlyDuplicates ? 'Show All Records' : 'Show Only Duplicates'}
          </button>
        </div>
      )}

      {/* Duplicate Summary */}
      {hasDuplicates && (
        <div className="duplicate-summary" style={{ 
          marginBottom: '20px', 
          border: '1px solid #ffcdd2', 
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Duplicate Pharmacy/Refund Entries Summary</h4>
          {allDuplicateSummary.map((group, index) => (
            <div key={index} style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {group.entries[0].Patient_Name} - 
                {group.type === 'refund' ? ` Refund: ₹${group.entries[0].TotalAmount}` : ` Pharmacy: ₹${group.entries[0].Total_Amount || (parseFloat(group.entries[0].Creditamt || 0) + parseFloat(group.entries[0].Paid_Amount || 0))}`} 
                - {group.count} times
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Invoice: {group.type === 'refund' ? (group.entries[0].Billinvoice || group.entries[0].Invoice_NO) : group.entries[0].InvoiceNo} | 
                Date: {group.type === 'refund' ? group.entries[0].Billing_Date : group.entries[0].BillingDate} | 
                Patient ID: {group.type === 'refund' ? group.entries[0].PatientID : group.entries[0].PatientId}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          
          {/* First Row - Basic Search */}
          <div className="filter-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
                Search Pharmacy:
              </label>
              <input
                id="patientSearch"
                type="text"
                className="search-input"
                placeholder="Search by patient name, ID, invoice no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: '250px' }}
              />
            </div>
            <div className="results-info">
              Showing {billedRecordCount} pharmacy, {refundRecordCount} refund records
              {showOnlyDuplicates && ` (Duplicate entries only)`}
              {searchTerm && <span> for "<strong>{searchTerm}</strong>"</span>}
            </div>
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>Clear Search</button>
            )}
          </div>

          {/* Second Row - Advanced Filters */}
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Pharmacy Type</label>
              <select 
                className="search-select"
                value={pharmacyTypeFilter}
                onChange={(e) => {
                  setPharmacyTypeFilter(e.target.value);
                  setFromBillNo(''); // Reset bill no when type changes
                  setToBillNo('');
                }}
              >
                <option value="All">All Types</option>
                <option value="IPPharmacy">IP Pharmacy</option>
                <option value="Freepharmacy">Free Pharmacy</option>
                <option value="IPwalking">IP Walking</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select 
                className="search-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setFromBillNo(''); // Reset bill no when status changes
                  setToBillNo('');
                }}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Credit">Credit</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Bill No Range ({billNumberOptions.length} available)</label>
              <div className="billno-range">
                <select 
                  className="search-select"
                  value={fromBillNo}
                  onChange={(e) => setFromBillNo(e.target.value)}
                  style={{ minWidth: '120px' }}
                >
                  <option value="">From Bill No</option>
                  {billNumberOptions.map(billNo => (
                    <option key={billNo} value={billNo}>{billNo}</option>
                  ))}
                </select>
                <span>to</span>
                <select 
                  className="search-select"
                  value={toBillNo}
                  onChange={(e) => setToBillNo(e.target.value)}
                  style={{ minWidth: '120px' }}
                >
                  <option value="">To Bill No</option>
                  {billNumberOptions.map(billNo => (
                    <option key={billNo} value={billNo}>{billNo}</option>
                  ))}
                </select>
              </div>
              {fromBillNo && toBillNo && (
                <div className="billno-info">
                  Range: {fromBillNo} to {toBillNo} ({billNumberOptions.slice(billNumberOptions.indexOf(fromBillNo), billNumberOptions.indexOf(toBillNo) + 1).length} bills)
                </div>
              )}
            </div>

            <button 
              className="clear-search" 
              onClick={clearAllFilters}
              style={{ alignSelf: 'flex-end', marginBottom: '5px' }}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlePrint}>Print</button>
        <button className="RegisterForm_1_btns" onClick={closeModalAllPharmacyPrint}>Close</button>
      </div>

      <div ref={componentRef} className="report-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td colSpan="12" style={{ border: 'none', textAlign: 'center', padding: '10px' }}>
                <div>
                  <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '700', color: '#1f2937' }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: '5px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#4b5563' }}>
                    {reportDateRange}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {(pharmacyTypeFilter !== 'All' || statusFilter !== 'All' || fromBillNo || toBillNo) && (
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                      Filters: {pharmacyTypeFilter !== 'All' ? `Type: ${pharmacyTypeFilter} ` : ''}
                      {statusFilter !== 'All' ? `Status: ${statusFilter} ` : ''}
                      {fromBillNo || toBillNo ? `Bill No: ${fromBillNo || 'Start'} to ${toBillNo || 'End'}` : ''}
                    </p>
                  )}
                  {showOnlyDuplicates && (
                    <p style={{ 
                      margin: '5px 0',
                      fontSize: '14px',
                      color: '#d32f2f',
                      fontStyle: 'italic',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ Showing Duplicate Entries Only
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6', fontWeight: '600', fontSize: '13px' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>S.No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Invoice No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Billing Date</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Patient ID</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>Patient Name</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Patient Category</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Remarks</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Credit Amt</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Paid Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Total Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Bill Status</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Created By</th>
            </tr>
          </thead>
          <tbody>
            {/* Render billed groups - Updated to include IP WALKING */}
            {['IP PHARMACY', 'OP Pharmacy', 'FREE PHARMACY', 'IP WALKING'].map(billType => {
              const groupData = groupedData[billType] || [];
              if (!Array.isArray(groupData) || groupData.length === 0) return null;
              return renderGroupSection(groupData, billType);
            })}
            
            {/* Show message if no pharmacy records */}
            {billedRecordCount === 0 && refundRecordCount === 0 && (
              <tr>
                <td colSpan="12" style={{ border: '1px solid #d1d5db', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  {showOnlyDuplicates 
                    ? "No duplicate pharmacy records found matching your criteria" 
                    : `No pharmacy records found matching your filters`
                  }
                </td>
              </tr>
            )}

            {billedRecordCount > 0 && (
              <tr
                style={{
                  borderTop: '2px solid #4b5563',
                  fontWeight: '700',
                  fontSize: '14px',
                  backgroundColor: '#d1d5db',
                }}
              >
                <td colSpan="7" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  Grand Total (Pharmacy: {billedRecordCount} records)
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {grandTotals.Creditamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {grandTotals.Paid_Amount.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {grandTotals.Total_Amount.toFixed(2)}
                </td>
                <td colSpan="2" style={{ border: '1px solid #d1d5db' }}></td>
              </tr>
            )}

            {/* Render refund section after billed items */}
            {renderGroupSection(displayRefundData, 'REFUNDED ITEMS', true)}
            
            {refundRecordCount > 0 && (
              <tr
                style={{
                  borderTop: '2px solid #4b5563',
                  fontWeight: '700',
                  fontSize: '14px',
                  backgroundColor: '#fff3cd',
                }}
              >
                <td colSpan="7" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  Grand Total (Refunds: {refundRecordCount} records)
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {refundTotals.Creditamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {refundTotals.Paid_Amount.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {refundTotals.Total_Amount.toFixed(2)}
                </td>
                <td colSpan="2" style={{ border: '1px solid #d1d5db' }}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const ForIPAmountCollectionPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showOnlyDuplicates, setShowOnlyDuplicates] = React.useState(false);
  
  // New search states
  const [pharmacyTypeFilter, setPharmacyTypeFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [fromBillNo, setFromBillNo] = React.useState('');
  const [toBillNo, setToBillNo] = React.useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState('All');
  
  // Use IPAmountCollectiondata for pharmacy data
  const pharmacyDataArray = Array.isArray(IPAmountCollectiondata) ? IPAmountCollectiondata : [];
  
  // Use IPAmountCollectionRefunddata for refund data
  const refundDataArray = Array.isArray(IPAmountCollectionRefunddata) ? IPAmountCollectionRefunddata : [];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'IP_Amount_Collection_Report',
  });

  // Function to get payment method from CollectedType - FIXED
  const getPaymentMethod = (item) => {
    // For pharmacy data with CollectedType
    if (item.CollectedType && Array.isArray(item.CollectedType)) {
      const methods = [];
      item.CollectedType.forEach(collection => {
        if (collection.method && Array.isArray(collection.method)) {
          collection.method.forEach(method => {
            if (method.method) {
              methods.push(`${method.method}: ${method.amount || 0}`);
            }
          });
        } else if (collection.method && typeof collection.method === 'string') {
          // Handle case where method might be a string instead of array
          methods.push(`${collection.method}: ${collection.amount || 0}`);
        }
      });
      return methods.join(", ") || "Unknown";
    }
    
    // For refund data with paytype
    if (item.paytype) {
      return item.paytype;
    }
    
    // For other cases
    return item.PaymentMethod || "Unknown";
  };

  // Function to get payment amount for summary calculations
  const getPaymentAmount = (item, isRefund = false) => {
    if (isRefund) {
      return parseFloat(item?.TotalAmount || 0);
    }
    
    // For pharmacy data with CollectedType
    if (item.CollectedType && Array.isArray(item.CollectedType)) {
      let total = 0;
      item.CollectedType.forEach(collection => {
        if (collection.method && Array.isArray(collection.method)) {
          collection.method.forEach(method => {
            total += parseFloat(method.amount || 0);
          });
        } else if (collection.amount) {
          total += parseFloat(collection.amount || 0);
        }
      });
      return total;
    }
    
    // Fallback to Paid_Amount if CollectedType is not available
    return parseFloat(item?.Paid_Amount || 0);
  };

  // Function to detect duplicate pharmacy entries - UPDATED
  const detectDuplicates = (pharmacyData) => {
    const duplicateMap = {};
    const duplicates = [];
    
    pharmacyData.forEach(item => {
      // Create a string representation of CollectedType for key
      const collectedTypeStr = item.CollectedType 
        ? JSON.stringify(item.CollectedType)
        : "null";
      
      const key = `${item.PatientId}-${item.InvoiceNo}-${parseFloat(item.Creditamt || 0) + getPaymentAmount(item)}-${collectedTypeStr}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to detect duplicate refund entries
  const detectRefundDuplicates = (refundData) => {
    const duplicateMap = {};
    const duplicates = [];
    
    refundData.forEach(item => {
      const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.paytype}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to check if a specific pharmacy item is a duplicate - UPDATED
  const isDuplicatePharmacyItem = (item, allItems) => {
    const collectedTypeStr = item.CollectedType 
      ? JSON.stringify(item.CollectedType)
      : "null";
    
    const key = `${item.PatientId}-${item.InvoiceNo}-${parseFloat(item.Creditamt || 0) + getPaymentAmount(item)}-${collectedTypeStr}`;
    
    const matchingItems = allItems.filter(i => {
      const iCollectedTypeStr = i.CollectedType 
        ? JSON.stringify(i.CollectedType)
        : "null";
      return `${i.PatientId}-${i.InvoiceNo}-${parseFloat(i.Creditamt || 0) + getPaymentAmount(i)}-${iCollectedTypeStr}` === key;
    });
    return matchingItems.length > 1;
  };

  // Function to check if a specific refund is a duplicate
  const isDuplicateRefundItem = (item, allRefunds) => {
    const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.paytype}`;
    const matchingRefunds = allRefunds.filter(r => 
      `${r.PatientID}-${r.Billinvoice || r.Invoice_NO}-${r.TotalAmount}-${r.paytype}` === key
    );
    return matchingRefunds.length > 1;
  };

  // More strict duplicate detection for summary - UPDATED
  const detectStrictDuplicates = (data, isRefund = false) => {
    const duplicateMap = {};
    
    data.forEach(item => {
      if (isRefund) {
        const key = `${item.PatientID}-${item.Patient_Name}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.Billing_Date}-${item.paytype}`;
        
        if (!duplicateMap[key]) {
          duplicateMap[key] = [];
        }
        duplicateMap[key].push(item);
      } else {
        const collectedTypeStr = item.CollectedType 
          ? JSON.stringify(item.CollectedType)
          : "null";
        
        const key = `${item.PatientId}-${item.Patient_Name}-${item.InvoiceNo}-${parseFloat(item.Creditamt || 0) + getPaymentAmount(item)}-${item.BillingDate}-${collectedTypeStr}`;
        
        if (!duplicateMap[key]) {
          duplicateMap[key] = [];
        }
        duplicateMap[key].push(item);
      }
    });
    
    const duplicates = [];
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key: key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key],
          type: isRefund ? 'refund' : 'pharmacy'
        });
      }
    });
    
    return duplicates;
  };

  // Detect duplicates
  const duplicatePharmacyItems = detectDuplicates(pharmacyDataArray);
  const duplicateRefundItems = detectRefundDuplicates(refundDataArray);
  const hasDuplicates = duplicatePharmacyItems.length > 0 || duplicateRefundItems.length > 0;
  
  const duplicatePharmacySummary = detectStrictDuplicates(pharmacyDataArray, false);
  const duplicateRefundSummary = detectStrictDuplicates(refundDataArray, true);
  const allDuplicateSummary = [...duplicatePharmacySummary, ...duplicateRefundSummary];

  // Function to get pharmacy type from data
  const getPharmacyType = (item) => {
    if (item.Pharmacy_Type === 'IPWALKING') return 'IPwalking';
    if (item.BillType === 'IP PHARMACY') return 'IPPharmacy';
    if (item.BillType === 'FREE PHARMACY') return 'Freepharmacy';
    if (item.BillType === 'OP Pharmacy') return 'OPPharmacy';
    return 'Other';
  };

  // Updated function to get status from data - now checks amounts for Paid/Credit instead of just BillType
  const getStatus = (item) => {
    if (item.NewPayment === 'RefundPayment') return 'Refund';
    
    const credit = parseFloat(item.Creditamt || 0);
    const paid = getPaymentAmount(item);
    const total = parseFloat(item.Total_Amount || (credit + paid));
    
    if (credit > 0) return 'Credit'; // Due/Credit if there's outstanding credit
    if (paid > 0 || (total > 0 && credit === 0)) return 'Paid'; // Paid if no credit and has payment or total
    return 'Other';
  };

  // Function to extract bill number for filtering
  const getBillNumber = (item) => {
    if (item.InvoiceNo) return item.InvoiceNo;
    if (item.Billinvoice) return item.Billinvoice;
    if (item.Voucher_Number) return item.Voucher_Number;
    return '';
  };

  // Filter data WITHOUT bill number range - for generating dynamic bill number options
  const filterDataWithoutBillRange = (data, isRefund = false) => {
    return data.filter(item => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Pharmacy type filter
      const pharmacyType = isRefund ? item.Pharmacy_Type : getPharmacyType(item);
      const matchesPharmacyType = pharmacyTypeFilter === 'All' || 
        (pharmacyTypeFilter === 'IPPharmacy' && pharmacyType === 'IPPharmacy') ||
        (pharmacyTypeFilter === 'Freepharmacy' && pharmacyType === 'Freepharmacy') ||
        (pharmacyTypeFilter === 'IPwalking' && pharmacyType === 'IPwalking');
      
      // Status filter - only apply to non-refund data for Paid/Credit; refunds always pass if All or ignore for specific
      let matchesStatus = true;
      if (!isRefund) {
        const status = getStatus(item);
        matchesStatus = statusFilter === 'All' || 
          (statusFilter === 'Paid' && status === 'Paid') ||
          (statusFilter === 'Credit' && status === 'Credit');
      } else if (statusFilter !== 'All') {
        // For refunds, only show if status is All; otherwise hide to avoid filtering refunds with Paid/Credit
        matchesStatus = false;
      }

      // Payment method filter
      const paymentMethod = getPaymentMethod(item);
      const matchesPaymentMethod =
        paymentMethodFilter === "All" ||
        paymentMethod.toLowerCase().includes(paymentMethodFilter.toLowerCase()) ||
        (paymentMethodFilter === "Cash" && paymentMethod.toLowerCase().includes("cash")) ||
        (paymentMethodFilter === "Card" && paymentMethod.toLowerCase().includes("card")) ||
        (paymentMethodFilter === "UPI" && paymentMethod.toLowerCase().includes("upi")) ||
        (paymentMethodFilter === "Online" && paymentMethod.toLowerCase().includes("online"));
      
      return matchesSearch && matchesPharmacyType && matchesStatus && matchesPaymentMethod;
    });
  };

  // Get dynamic bill numbers based on current search, type, and status filters
  const getDynamicBillNumbers = () => {
    const intermediateBilledData = filterDataWithoutBillRange(pharmacyDataArray);
    const intermediateRefundData = filterDataWithoutBillRange(refundDataArray, true);
    const allIntermediateItems = [...intermediateBilledData, ...intermediateRefundData];
    const billNumbers = allIntermediateItems
      .map(item => getBillNumber(item))
      .filter(billNo => billNo && billNo.trim() !== '')
      .sort();
    
    return [...new Set(billNumbers)];
  };

  const billNumberOptions = getDynamicBillNumbers();

  // Full filter data function - applies bill number range on top of the intermediate filters
  const filterData = (data, isRefund = false) => {
    // First, get intermediate filtered data (without billNo range)
    let intermediateData = filterDataWithoutBillRange(data, isRefund);
    
    // Then apply bill number range filter
    return intermediateData.filter(item => {
      const billNo = getBillNumber(item);
      let matchesBillNoRange = true;
      if (fromBillNo && toBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex && currentIndex <= toIndex;
      } else if (fromBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex;
      } else if (toBillNo && billNumberOptions.length > 0) {
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex <= toIndex;
      }
      
      return matchesBillNoRange;
    });
  };

  // Apply filters to data
  const filteredBilledData = filterData(pharmacyDataArray);
  const filteredRefundData = filterData(refundDataArray, true);

  // Apply duplicate filter if enabled
  const displayBilledData = showOnlyDuplicates 
    ? filteredBilledData.filter(item => isDuplicatePharmacyItem(item, pharmacyDataArray))
    : filteredBilledData;

  const displayRefundData = showOnlyDuplicates 
    ? filteredRefundData.filter(item => isDuplicateRefundItem(item, refundDataArray))
    : filteredRefundData;

  // Group filtered data by BillType for billed items - Updated to include IP WALKING
  const groupedData = React.useMemo(() => {
    if (!Array.isArray(displayBilledData)) return {};
    
    return displayBilledData.reduce((acc, row) => {
      if (!row) return acc;
      
      // Determine group based on BillType and Pharmacy_Type
      let groupKey = row.BillType || 'Unknown';
      
      // Check for IP WALKING type
      if (row.Pharmacy_Type === 'IPWALKING') {
        groupKey = 'IP WALKING';
      }
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(row);
      return acc;
    }, {});
  }, [displayBilledData]);

  // Updated calculate totals for refunds to categorize by paytype
  const calculateTotals = (data, isRefund = false) => {
    if (!Array.isArray(data)) {
      return { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 };
    }
    
    return data.reduce(
      (acc, row) => {
        if (isRefund) {
          // For refunds, categorize by paytype
          const refundAmount = parseFloat(row?.TotalAmount || 0);
          let credit = 0;
          let paid = 0;
          
          if (row?.paytype === 'Credit') {
            credit = refundAmount;
          } else if (row?.paytype === 'Cash') {
            paid = refundAmount;
          } else {
            // Default: treat as credit if unclear
            credit = refundAmount;
          }
          
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + refundAmount
          };
        } else {
          const credit = parseFloat(row?.Creditamt || 0);
          const paid = getPaymentAmount(row); // Use getPaymentAmount function
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + (credit + paid)
          };
        }
      },
      { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 }
    );
  };

  // Calculate payment summary by CollectedType - UPDATED
  const calculatePaymentSummary = (data, isRefund = false) => {
    const summary = {
      Cash: 0,
      Card: 0,
      UPI: 0,
      Online: 0,
      Unknown: 0
    };

    if (!Array.isArray(data)) return summary;

    data.forEach((item) => {
      if (isRefund) {
        const amount = parseFloat(item?.TotalAmount || 0);
        const method = item.paytype || "Unknown";
        const methodKey = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
        if (summary.hasOwnProperty(methodKey)) {
          summary[methodKey] += amount;
        } else {
          summary[methodKey] = amount;
        }
      } else {
        // Handle pharmacy data with nested CollectedType
        if (item.CollectedType && Array.isArray(item.CollectedType)) {
          item.CollectedType.forEach(collection => {
            if (collection.method && Array.isArray(collection.method)) {
              collection.method.forEach(method => {
                const amount = parseFloat(method.amount || 0);
                const methodName = method.method || "Unknown";
                const methodKey = methodName.charAt(0).toUpperCase() + methodName.slice(1).toLowerCase();
                if (summary.hasOwnProperty(methodKey)) {
                  summary[methodKey] += amount;
                } else {
                  summary[methodKey] = amount;
                }
              });
            } else if (collection.method && typeof collection.method === 'string') {
              // Handle single method case
              const amount = parseFloat(collection.amount || 0);
              const methodName = collection.method || "Unknown";
              const methodKey = methodName.charAt(0).toUpperCase() + methodName.slice(1).toLowerCase();
              if (summary.hasOwnProperty(methodKey)) {
                summary[methodKey] += amount;
              } else {
                summary[methodKey] = amount;
              }
            }
          });
        } else {
          // Fallback for simple payment structure
          const amount = parseFloat(item?.Paid_Amount || 0);
          const method = item.PaymentMethod || "Unknown";
          const methodKey = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
          if (summary.hasOwnProperty(methodKey)) {
            summary[methodKey] += amount;
          } else {
            summary[methodKey] = amount;
          }
        }
      }
    });

    return summary;
  };

  const grandTotals = calculateTotals(displayBilledData);
  const refundTotals = calculateTotals(displayRefundData, true);
  
  const paymentSummary = calculatePaymentSummary(displayBilledData);
  const refundPaymentSummary = calculatePaymentSummary(displayRefundData, true);

  // Format date range
  const reportDateRange =
    searchOptions?.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions?.CurrentDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions?.FromDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')} To: ${new Date(searchOptions?.ToDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`;

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setPharmacyTypeFilter('All');
    setStatusFilter('All');
    setPaymentMethodFilter('All');
    setFromBillNo('');
    setToBillNo('');
  };

  // Helper function to get refund amounts by paytype
  const getRefundAmounts = (row) => {
    const refundAmount = parseFloat(row?.TotalAmount || 0);
    let credit = 0;
    let paid = 0;
    
    if (row?.paytype === 'Credit') {
      credit = refundAmount;
    } else if (row?.paytype === 'Cash') {
      paid = refundAmount;
    } else {
      // Default: treat as credit if paytype is missing or unknown
      credit = refundAmount;
    }
    
    return { credit, paid, total: refundAmount };
  };

  // Render payment summary section
  const renderPaymentSummary = () => {
    const totalCollections = Object.values(paymentSummary).reduce((sum, amount) => sum + amount, 0);
    const totalRefunds = Object.values(refundPaymentSummary).reduce((sum, amount) => sum + amount, 0);
    const netAmount = totalCollections - totalRefunds;

    return (
      <div style={{ 
        marginBottom: '20px', 
        border: '1px solid #d1d5db', 
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#f8fafc'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '18px' }}>
          Payment Summary
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {/* Collections Summary */}
          <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '12px', backgroundColor: 'white' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#059669', fontSize: '14px' }}>Collections</h4>
            {Object.entries(paymentSummary).map(([method, amount]) => (
              amount > 0 && (
                <div key={method} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                  <span>{method}:</span>
                  <span style={{ fontWeight: '600' }}>₹{amount.toFixed(2)}</span>
                </div>
              )
            ))}
            <div style={{ borderTop: '1px solid #d1d5db', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Collections:</span>
                <span style={{ color: '#059669' }}>₹{totalCollections.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Refunds Summary */}
          <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '12px', backgroundColor: 'white' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#dc2626', fontSize: '14px' }}>Refunds</h4>
            {Object.entries(refundPaymentSummary).map(([method, amount]) => (
              amount > 0 && (
                <div key={method} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                  <span>{method}:</span>
                  <span style={{ fontWeight: '600' }}>₹{amount.toFixed(2)}</span>
                </div>
              )
            ))}
            <div style={{ borderTop: '1px solid #d1d5db', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Refunds:</span>
                <span style={{ color: '#dc2626' }}>₹{totalRefunds.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Net Amount */}
          <div style={{ 
            border: '1px solid #d1d5db', 
            borderRadius: '6px', 
            padding: '12px', 
            backgroundColor: netAmount >= 0 ? '#f0fdf4' : '#fef2f2'
          }}>
            <h4 style={{ 
              margin: '0 0 10px 0', 
              color: netAmount >= 0 ? '#059669' : '#dc2626', 
              fontSize: '14px' 
            }}>
              Net Amount
            </h4>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: netAmount >= 0 ? '#059669' : '#dc2626' 
              }}>
                ₹{netAmount.toFixed(2)}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                marginTop: '5px'
              }}>
                {netAmount >= 0 ? 'Net Collections' : 'Net Refunds'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGroupSection = (groupData, groupTitle, isRefund = false) => {
    if (!Array.isArray(groupData) || groupData.length === 0) return null;

    const groupTotals = calculateTotals(groupData, isRefund);

    return (
      <>
        <tr>
          <td colSpan="13" style={{ 
            padding: '10px', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            backgroundColor: isRefund ? '#fff3cd' : '#e9ecef', 
            border: '1px solid #d1d5db',
            color: isRefund ? '#856404' : 'inherit'
          }}>
            {groupTitle} ({groupData.length} records)
          </td>
        </tr>
        {groupData.map((row, index) => {
          const isDuplicate = isRefund 
            ? isDuplicateRefundItem(row, refundDataArray)
            : isDuplicatePharmacyItem(row, pharmacyDataArray);
          
          // Get amounts for refund based on paytype
          const { credit, paid, total } = isRefund ? getRefundAmounts(row) : {
            credit: parseFloat(row?.Creditamt || 0),
            paid: getPaymentAmount(row), // Use getPaymentAmount for pharmacy data
            total: parseFloat(row?.Total_Amount || (parseFloat(row?.Creditamt || 0) + getPaymentAmount(row)))
          };
            
          return (
          <tr
            key={`${groupTitle}-${index}`}
            style={{ 
              fontSize: '12px', 
              backgroundColor: isDuplicate ? '#ffebee' : (index % 2 === 0 ? '#ffffff' : '#f9fafb'),
              borderLeft: isDuplicate ? '4px solid #f44336' : 'none'
            }}
          >
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {index + 1}
              {isDuplicate && ' ⚠️'}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Voucher_Number || row?.Billinvoice || '-') : (row?.InvoiceNo || '-')}
              {isDuplicate && (
                <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                  Duplicate
                </div>
              )}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Billing_Date || '-') : (row?.BillingDate || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.PatientID || '-') : (row?.PatientId || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'left',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Patient_Name || '-') : (row?.Patient_Name || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.PatCategory || '-') : (row?.PatCategory || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Remarks || '-') : (row?.Remarks || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {getPaymentMethod(row)}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'right',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {credit.toFixed(2)}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'right',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {paid.toFixed(2)}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'right',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {total.toFixed(2)}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? 'Refunded' : (row?.Bill_Status || '-')}
            </td>
            <td style={{ 
              border: '1px solid #d1d5db', 
              padding: '8px', 
              textAlign: 'center',
              color: isDuplicate ? '#d32f2f' : 'inherit',
              fontWeight: isDuplicate ? 'bold' : 'normal'
            }}>
              {isRefund ? (row?.Billedby || '-') : (row?.created_by || '-')}
            </td>
          </tr>
        )})}
        <tr style={{ 
          fontWeight: '700', 
          fontSize: '14px', 
          backgroundColor: isRefund ? '#fff3cd' : '#d1d5db' 
        }}>
          <td colSpan="8" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            Subtotal
          </td>
          <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            {groupTotals.Creditamt.toFixed(2)}
          </td>
          <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            {groupTotals.Paid_Amount.toFixed(2)}
          </td>
          <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            {groupTotals.Total_Amount.toFixed(2)}
          </td>
          <td colSpan="2" style={{ border: '1px solid #d1d5db' }}></td>
        </tr>
      </>
    );
  };

  // Get record counts
  const billedRecordCount = Array.isArray(displayBilledData) ? displayBilledData.length : 0;
  const refundRecordCount = Array.isArray(displayRefundData) ? displayRefundData.length : 0;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            table { page-break-inside: auto; width: 100%; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            .Register_btn_con { display: none; }
            .search-container { display: none; }
            .duplicate-alert { display: none; }
            .duplicate-summary { display: none; }
            .payment-summary { display: none; }
            .report-container { font-size: 12px; }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover { background-color: #1e40af; }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input, .search-select {
            padding: 4px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 150px;
          }
          .search-input:focus, .search-select:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover { background-color: #4b5563; }
          .filter-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            flex-wrap: wrap;
            align-items: center;
          }
          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .filter-label {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
          }
          .billno-range {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .billno-info {
            font-size: 12px;
            color: #6b7280;
            font-style: italic;
          }
        `}
      </style>

      {/* Duplicate Alert */}
      {hasDuplicates && (
        <div className="duplicate-alert" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#856404', 
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              ⚠️ DUPLICATE PHARMACY ENTRIES DETECTED
            </span>
            <span style={{ color: '#856404' }}>
              Found {duplicatePharmacyItems.length} duplicate pharmacy entries, {duplicateRefundItems.length} duplicate refund entries
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: '6px 12px',
              backgroundColor: showOnlyDuplicates ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOnlyDuplicates ? 'Show All Records' : 'Show Only Duplicates'}
          </button>
        </div>
      )}

      {/* Duplicate Summary */}
      {hasDuplicates && (
        <div className="duplicate-summary" style={{ 
          marginBottom: '20px', 
          border: '1px solid #ffcdd2', 
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Duplicate Pharmacy/Refund Entries Summary</h4>
          {allDuplicateSummary.map((group, index) => (
            <div key={index} style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {group.entries[0].Patient_Name} - 
                {group.type === 'refund' ? ` Refund: ₹${group.entries[0].TotalAmount}` : ` Pharmacy: ₹${parseFloat(group.entries[0].Creditamt || 0) + getPaymentAmount(group.entries[0])}`} 
                - {group.count} times (Payment Method: {getPaymentMethod(group.entries[0])})
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Invoice: {group.type === 'refund' ? (group.entries[0].Billinvoice || group.entries[0].Invoice_NO) : group.entries[0].InvoiceNo} | 
                Date: {group.type === 'refund' ? group.entries[0].Billing_Date : group.entries[0].BillingDate} | 
                Patient ID: {group.type === 'refund' ? group.entries[0].PatientID : group.entries[0].PatientId}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Summary */}
      <div className="payment-summary">
        {renderPaymentSummary()}
      </div>

      {/* Enhanced Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          
          {/* First Row - Basic Search */}
          <div className="filter-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
                Search Pharmacy:
              </label>
              <input
                id="patientSearch"
                type="text"
                className="search-input"
                placeholder="Search by patient name, ID, invoice no, payment method..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: '250px' }}
              />
            </div>
            <div className="results-info">
              Showing {billedRecordCount} pharmacy, {refundRecordCount} refund records
              {showOnlyDuplicates && ` (Duplicate entries only)`}
              {searchTerm && <span> for "<strong>{searchTerm}</strong>"</span>}
            </div>
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>Clear Search</button>
            )}
          </div>

          {/* Second Row - Advanced Filters */}
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Pharmacy Type</label>
              <select 
                className="search-select"
                value={pharmacyTypeFilter}
                onChange={(e) => {
                  setPharmacyTypeFilter(e.target.value);
                  setFromBillNo(''); // Reset bill no when type changes
                  setToBillNo('');
                }}
              >
                <option value="All">All Types</option>
                <option value="IPPharmacy">IP Pharmacy</option>
                <option value="Freepharmacy">Free Pharmacy</option>
                <option value="IPwalking">IP Walking</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select 
                className="search-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setFromBillNo(''); // Reset bill no when status changes
                  setToBillNo('');
                }}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Credit">Credit</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Payment Method</label>
              <select
                className="search-select"
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
              >
                <option value="All">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Bill No Range ({billNumberOptions.length} available)</label>
              <div className="billno-range">
                <select 
                  className="search-select"
                  value={fromBillNo}
                  onChange={(e) => setFromBillNo(e.target.value)}
                  style={{ minWidth: '120px' }}
                >
                  <option value="">From Bill No</option>
                  {billNumberOptions.map(billNo => (
                    <option key={billNo} value={billNo}>{billNo}</option>
                  ))}
                </select>
                <span>to</span>
                <select 
                  className="search-select"
                  value={toBillNo}
                  onChange={(e) => setToBillNo(e.target.value)}
                  style={{ minWidth: '120px' }}
                >
                  <option value="">To Bill No</option>
                  {billNumberOptions.map(billNo => (
                    <option key={billNo} value={billNo}>{billNo}</option>
                  ))}
                </select>
              </div>
              {fromBillNo && toBillNo && (
                <div className="billno-info">
                  Range: {fromBillNo} to {toBillNo} ({billNumberOptions.slice(billNumberOptions.indexOf(fromBillNo), billNumberOptions.indexOf(toBillNo) + 1).length} bills)
                </div>
              )}
            </div>

            <button 
              className="clear-search" 
              onClick={clearAllFilters}
              style={{ alignSelf: 'flex-end', marginBottom: '5px' }}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlePrint}>Print</button>
        <button className="RegisterForm_1_btns" onClick={closeModalIPAmountCollectionPrint}>Close</button>
      </div>

      <div ref={componentRef} className="report-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td colSpan="13" style={{ border: 'none', textAlign: 'center', padding: '10px' }}>
                <div>
                  <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '700', color: '#1f2937' }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: '5px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#4b5563' }}>
                    {reportDateRange}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {(pharmacyTypeFilter !== 'All' || statusFilter !== 'All' || paymentMethodFilter !== 'All' || fromBillNo || toBillNo) && (
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                      Filters: {pharmacyTypeFilter !== 'All' ? `Type: ${pharmacyTypeFilter} ` : ''}
                      {statusFilter !== 'All' ? `Status: ${statusFilter} ` : ''}
                      {paymentMethodFilter !== 'All' ? `Payment: ${paymentMethodFilter} ` : ''}
                      {fromBillNo || toBillNo ? `Bill No: ${fromBillNo || 'Start'} to ${toBillNo || 'End'}` : ''}
                    </p>
                  )}
                  {showOnlyDuplicates && (
                    <p style={{ 
                      margin: '5px 0',
                      fontSize: '14px',
                      color: '#d32f2f',
                      fontStyle: 'italic',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ Showing Duplicate Entries Only
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6', fontWeight: '600', fontSize: '13px' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>S.No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Invoice No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Billing Date</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Patient ID</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>Patient Name</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Patient Category</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Remarks</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Payment Method</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Credit Amt</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Paid Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Total Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Bill Status</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Created By</th>
            </tr>
          </thead>
          <tbody>
            {/* Render billed groups - Updated to include IP WALKING */}
            {['IP PHARMACY', 'OP Pharmacy', 'FREE PHARMACY', 'IP WALKING'].map(billType => {
              const groupData = groupedData[billType] || [];
              if (!Array.isArray(groupData) || groupData.length === 0) return null;
              return renderGroupSection(groupData, billType);
            })}
            
            {/* Show message if no pharmacy records */}
            {billedRecordCount === 0 && refundRecordCount === 0 && (
              <tr>
                <td colSpan="13" style={{ border: '1px solid #d1d5db', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  {showOnlyDuplicates 
                    ? "No duplicate pharmacy records found matching your criteria" 
                    : `No pharmacy records found matching your filters`
                  }
                </td>
              </tr>
            )}

            {billedRecordCount > 0 && (
              <tr
                style={{
                  borderTop: '2px solid #4b5563',
                  fontWeight: '700',
                  fontSize: '14px',
                  backgroundColor: '#d1d5db',
                }}
              >
                <td colSpan="8" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  Grand Total (Pharmacy: {billedRecordCount} records)
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {grandTotals.Creditamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {grandTotals.Paid_Amount.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {grandTotals.Total_Amount.toFixed(2)}
                </td>
                <td colSpan="2" style={{ border: '1px solid #d1d5db' }}></td>
              </tr>
            )}

            {/* Render refund section after billed items */}
            {renderGroupSection(displayRefundData, 'REFUNDED ITEMS', true)}
            
            {refundRecordCount > 0 && (
              <tr
                style={{
                  borderTop: '2px solid #4b5563',
                  fontWeight: '700',
                  fontSize: '14px',
                  backgroundColor: '#fff3cd',
                }}
              >
                <td colSpan="8" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  Grand Total (Refunds: {refundRecordCount} records)
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {refundTotals.Creditamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {refundTotals.Paid_Amount.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {refundTotals.Total_Amount.toFixed(2)}
                </td>
                <td colSpan="2" style={{ border: '1px solid #d1d5db' }}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const ForOPAmountCollectionPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showOnlyDuplicates, setShowOnlyDuplicates] = React.useState(false);
  const [pharmacyTypeFilter, setPharmacyTypeFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [fromBillNo, setFromBillNo] = React.useState("");
  const [toBillNo, setToBillNo] = React.useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState("All");

  // Ensure pharmacy data is an array
  const pharmacyDataArray = Array.isArray(OPAmountCollectiondata) ? OPAmountCollectiondata : [];
  const refundDataArray = Array.isArray(OPAmountCollectionRefunddata) ? OPAmountCollectionRefunddata : [];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "OP_Amount_Collection_Report",
  });

  // Function to get payment method from CollectedType - FIXED
  const getPaymentMethod = (item) => {
    // For pharmacy data with CollectedType
    if (item.CollectedType && Array.isArray(item.CollectedType)) {
      const methods = [];
      item.CollectedType.forEach(collection => {
        if (collection.method && Array.isArray(collection.method)) {
          collection.method.forEach(method => {
            if (method.method) {
              methods.push(`${method.method}: ${method.amount || 0}`);
            }
          });
        } else if (collection.method && typeof collection.method === 'string') {
          // Handle case where method might be a string instead of array
          methods.push(`${collection.method}: ${collection.amount || 0}`);
        }
      });
      return methods.join(", ") || "Unknown";
    }
    
    // For refund data with paytype
    if (item.paytype) {
      return item.paytype;
    }
    
    // For other cases
    return item.PaymentMethod || "Unknown";
  };

  // Function to get payment amount for summary calculations
  const getPaymentAmount = (item, isRefund = false) => {
    if (isRefund) {
      return parseFloat(item?.PaidAmount || 0);
    }
    
    // For pharmacy data with CollectedType
    if (item.CollectedType && Array.isArray(item.CollectedType)) {
      let total = 0;
      item.CollectedType.forEach(collection => {
        if (collection.method && Array.isArray(collection.method)) {
          collection.method.forEach(method => {
            total += parseFloat(method.amount || 0);
          });
        } else if (collection.amount) {
          total += parseFloat(collection.amount || 0);
        }
      });
      return total;
    }
    
    // Fallback to Paid_Amount if CollectedType is not available
    return parseFloat(item?.Paid_Amount || 0);
  };

  // Function to detect duplicate pharmacy entries - UPDATED
  const detectDuplicates = (pharmacyData) => {
    const duplicateMap = {};
    const duplicates = [];

    pharmacyData.forEach((item) => {
      // Create a string representation of CollectedType for key
      const collectedTypeStr = item.CollectedType 
        ? JSON.stringify(item.CollectedType)
        : "null";
      
      const key = `${item.PatientId}-${item.InvoiceNo}-${parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0)}-${collectedTypeStr}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });

    Object.keys(duplicateMap).forEach((key) => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });

    return duplicates;
  };

  // Function to detect duplicate refund entries
  const detectRefundDuplicates = (refundData) => {
    const duplicateMap = {};
    const duplicates = [];
    
    refundData.forEach(item => {
      const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.paytype}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to check if a specific pharmacy item is a duplicate - UPDATED
  const isDuplicatePharmacyItem = (item, allItems) => {
    const collectedTypeStr = item.CollectedType 
      ? JSON.stringify(item.CollectedType)
      : "null";
    
    const key = `${item.PatientId}-${item.InvoiceNo}-${parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0)}-${collectedTypeStr}`;
    
    const matchingItems = allItems.filter(
      (i) => {
        const iCollectedTypeStr = i.CollectedType 
          ? JSON.stringify(i.CollectedType)
          : "null";
        return `${i.PatientId}-${i.InvoiceNo}-${parseFloat(i.Creditamt || 0) + parseFloat(i.Paid_Amount || 0)}-${iCollectedTypeStr}` === key;
      }
    );
    return matchingItems.length > 1;
  };

  // Function to check if a specific refund is a duplicate
  const isDuplicateRefundItem = (item, allRefunds) => {
    const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.paytype}`;
    const matchingRefunds = allRefunds.filter(r => 
      `${r.PatientID}-${r.Billinvoice || r.Invoice_NO}-${r.TotalAmount}-${r.paytype}` === key
    );
    return matchingRefunds.length > 1;
  };

  // Strict duplicate detection for summary - UPDATED
  const detectStrictDuplicates = (data, isRefund = false) => {
    const duplicateMap = {};

    data.forEach((item) => {
      if (isRefund) {
        const key = `${item.PatientID}-${item.Patient_Name}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.Billing_Date}-${item.paytype}`;
        
        if (!duplicateMap[key]) {
          duplicateMap[key] = [];
        }
        duplicateMap[key].push(item);
      } else {
        const collectedTypeStr = item.CollectedType 
          ? JSON.stringify(item.CollectedType)
          : "null";
        
        const key = `${item.PatientId}-${item.Patient_Name}-${item.InvoiceNo}-${parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0)}-${item.BillingDate}-${collectedTypeStr}`;
        
        if (!duplicateMap[key]) {
          duplicateMap[key] = [];
        }
        duplicateMap[key].push(item);
      }
    });

    const duplicates = [];
    Object.keys(duplicateMap).forEach((key) => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key],
          type: isRefund ? "refund" : "pharmacy",
        });
      }
    });

    return duplicates;
  };

  // Detect duplicates
  const duplicatePharmacyItems = detectDuplicates(pharmacyDataArray);
  const duplicateRefundItems = detectRefundDuplicates(refundDataArray);
  const hasDuplicates = duplicatePharmacyItems.length > 0 || duplicateRefundItems.length > 0;
  
  const duplicatePharmacySummary = detectStrictDuplicates(pharmacyDataArray, false);
  const duplicateRefundSummary = detectStrictDuplicates(refundDataArray, true);
  const allDuplicateSummary = [...duplicatePharmacySummary, ...duplicateRefundSummary];

  // Function to get pharmacy type from data
  const getPharmacyType = (item) => {
    if (item.BillType === "OPPharmacy") return "OPPharmacy";
    if (item.BillType === "WalkinPharmacy") return "WalkinPharmacy";
    return "Other";
  };

  // Function to get status from data
  const getStatus = (item) => {
    return item.Bill_Status || "Other";
  };

  // Function to extract bill number
  const getBillNumber = (item) => {
    return item.InvoiceNo || "";
  };

  // Filter data without bill number range
  const filterDataWithoutBillRange = (data, isRefund = false) => {
    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const pharmacyType = isRefund ? "Refund" : getPharmacyType(item);
      const matchesPharmacyType =
        pharmacyTypeFilter === "All" ||
        (pharmacyTypeFilter === "OPPharmacy" && pharmacyType === "OPPharmacy") ||
        (pharmacyTypeFilter === "WalkinPharmacy" && pharmacyType === "WalkinPharmacy") ||
        (pharmacyTypeFilter === "Refund" && isRefund);

      const status = isRefund ? "Refunded" : getStatus(item);
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Paid" && status === "Paid") ||
        (statusFilter === "Credit" && status === "Credit") ||
        (statusFilter === "Refunded" && isRefund);

      const paymentMethod = getPaymentMethod(item);
      const matchesPaymentMethod =
        paymentMethodFilter === "All" ||
        paymentMethod.toLowerCase().includes(paymentMethodFilter.toLowerCase()) ||
        (paymentMethodFilter === "Cash" && paymentMethod.toLowerCase().includes("cash")) ||
        (paymentMethodFilter === "Card" && paymentMethod.toLowerCase().includes("card")) ||
        (paymentMethodFilter === "UPI" && paymentMethod.toLowerCase().includes("upi")) ||
        (paymentMethodFilter === "Online" && paymentMethod.toLowerCase().includes("online"));

      return matchesSearch && matchesPharmacyType && matchesStatus && matchesPaymentMethod;
    });
  };

  // Get dynamic bill numbers
  const getDynamicBillNumbers = () => {
    const intermediateBilledData = filterDataWithoutBillRange(pharmacyDataArray);
    const intermediateRefundData = filterDataWithoutBillRange(refundDataArray, true);
    const allIntermediateItems = [...intermediateBilledData, ...intermediateRefundData];
    const billNumbers = allIntermediateItems
      .map((item) => getBillNumber(item))
      .filter((billNo) => billNo && billNo.trim() !== "")
      .sort();
    return [...new Set(billNumbers)];
  };

  const billNumberOptions = getDynamicBillNumbers();

  // Full filter data function
  const filterData = (data, isRefund = false) => {
    let intermediateData = filterDataWithoutBillRange(data, isRefund);
    return intermediateData.filter((item) => {
      const billNo = getBillNumber(item);
      let matchesBillNoRange = true;
      if (fromBillNo && toBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex && currentIndex <= toIndex;
      } else if (fromBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex;
      } else if (toBillNo && billNumberOptions.length > 0) {
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex <= toIndex;
      }
      return matchesBillNoRange;
    });
  };

  // Apply filters
  const filteredBilledData = filterData(pharmacyDataArray);
  const filteredRefundData = filterData(refundDataArray, true);

  const displayBilledData = showOnlyDuplicates
    ? filteredBilledData.filter((item) => isDuplicatePharmacyItem(item, pharmacyDataArray))
    : filteredBilledData;

  const displayRefundData = showOnlyDuplicates
    ? filteredRefundData.filter((item) => isDuplicateRefundItem(item, refundDataArray))
    : filteredRefundData;

  // Calculate totals
  const calculateTotals = (data, isRefund = false) => {
    if (!Array.isArray(data)) {
      return { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 };
    }
    return data.reduce(
      (acc, row) => {
        if (isRefund) {
          const refundAmount = parseFloat(row?.PaidAmount || 0);
          return {
            Creditamt: acc.Creditamt + refundAmount,
            Paid_Amount: acc.Paid_Amount,
            Total_Amount: acc.Total_Amount + refundAmount,
          };
        } else {
          const credit = parseFloat(row?.Creditamt || 0);
          const paid = getPaymentAmount(row); // Use getPaymentAmount function
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + (credit + paid),
          };
        }
      },
      { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 }
    );
  };

  // Calculate payment summary by CollectedType - UPDATED
  const calculatePaymentSummary = (data, isRefund = false) => {
    const summary = {
      Cash: 0,
      Card: 0,
      UPI: 0,
      Online: 0,
      Unknown: 0
    };

    if (!Array.isArray(data)) return summary;

    data.forEach((item) => {
      if (isRefund) {
        const amount = parseFloat(item?.PaidAmount || 0);
        const method = item.paytype || "Unknown";
        const methodKey = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
        if (summary.hasOwnProperty(methodKey)) {
          summary[methodKey] += amount;
        } else {
          summary[methodKey] = amount;
        }
      } else {
        // Handle pharmacy data with nested CollectedType
        if (item.CollectedType && Array.isArray(item.CollectedType)) {
          item.CollectedType.forEach(collection => {
            if (collection.method && Array.isArray(collection.method)) {
              collection.method.forEach(method => {
                const amount = parseFloat(method.amount || 0);
                const methodName = method.method || "Unknown";
                const methodKey = methodName.charAt(0).toUpperCase() + methodName.slice(1).toLowerCase();
                if (summary.hasOwnProperty(methodKey)) {
                  summary[methodKey] += amount;
                } else {
                  summary[methodKey] = amount;
                }
              });
            } else if (collection.method && typeof collection.method === 'string') {
              // Handle single method case
              const amount = parseFloat(collection.amount || 0);
              const methodName = collection.method || "Unknown";
              const methodKey = methodName.charAt(0).toUpperCase() + methodName.slice(1).toLowerCase();
              if (summary.hasOwnProperty(methodKey)) {
                summary[methodKey] += amount;
              } else {
                summary[methodKey] = amount;
              }
            }
          });
        } else {
          // Fallback for simple payment structure
          const amount = parseFloat(item?.Paid_Amount || 0);
          const method = item.PaymentMethod || "Unknown";
          const methodKey = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
          if (summary.hasOwnProperty(methodKey)) {
            summary[methodKey] += amount;
          } else {
            summary[methodKey] = amount;
          }
        }
      }
    });

    return summary;
  };

  const grandTotals = calculateTotals(displayBilledData);
  const refundTotals = calculateTotals(displayRefundData, true);
  
  const paymentSummary = calculatePaymentSummary(displayBilledData);
  const refundPaymentSummary = calculatePaymentSummary(displayRefundData, true);

  const billedRecordCount = Array.isArray(displayBilledData) ? displayBilledData.length : 0;
  const refundRecordCount = Array.isArray(displayRefundData) ? displayRefundData.length : 0;

  // Format date range
  const reportDateRange =
    searchOptions?.DateType === "Current"
      ? `Report Date: ${new Date(searchOptions?.CurrentDate || new Date()).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).replace(/\//g, "-")}`
      : `Report From: ${new Date(searchOptions?.FromDate || new Date()).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).replace(/\//g, "-")} To: ${new Date(searchOptions?.ToDate || new Date()).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).replace(/\//g, "-")}`;

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setPharmacyTypeFilter("All");
    setStatusFilter("All");
    setPaymentMethodFilter("All");
    setFromBillNo("");
    setToBillNo("");
  };

  // Function to render billing data continuously (without OPPharmacy/WalkinPharmacy separation)
  const renderBillingData = (data, isRefund = false) => {
    if (!Array.isArray(data) || data.length === 0) return null;

    return data.map((row, index) => {
      const isDuplicate = isRefund 
        ? isDuplicateRefundItem(row, refundDataArray)
        : isDuplicatePharmacyItem(row, pharmacyDataArray);
      
      const credit = isRefund ? parseFloat(row?.PaidAmount || 0) : parseFloat(row?.Creditamt || 0);
      const paid = isRefund ? 0 : getPaymentAmount(row);
      const total = isRefund ? credit : credit + paid;

      return (
        <tr
          key={`${isRefund ? 'refund' : 'billing'}-${index}`}
          style={{
            fontSize: "12px",
            backgroundColor: isDuplicate ? "#ffebee" : index % 2 === 0 ? "#ffffff" : "#f9fafb",
            borderLeft: isDuplicate ? "4px solid #f44336" : "none",
          }}
        >
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "center",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {index + 1}
            {isDuplicate && " ⚠️"}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "center",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {isRefund ? (row.Billinvoice || row.Invoice_NO || "-") : (row.InvoiceNo || "-")}
            {isDuplicate && (
              <div style={{ fontSize: "8px", color: "#f44336", fontStyle: "italic" }}>Duplicate</div>
            )}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "center",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {isRefund ? (row.Billing_Date || "-") : (row.BillingDate || "-")}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "center",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {isRefund ? (row.PatientID || "-") : (row.PatientId || "-")}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "left",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {isRefund ? (row.Patient_Name || "-") : (row.Patient_Name || "-")}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "center",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {isRefund ? (row.PatCategory || "-") : (row.PatCategory || "-")}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "center",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {isRefund ? (row.Remarks || "-") : (row.Remarks || "-")}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "center",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {getPaymentMethod(row)}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "right",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {credit.toFixed(2)}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "right",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {paid.toFixed(2)}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "right",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {total.toFixed(2)}
          </td>
          <td
            style={{
              border: "1px solid #d1d5db",
              padding: "8px",
              textAlign: "center",
              color: isDuplicate ? "#d32f2f" : "inherit",
              fontWeight: isDuplicate ? "bold" : "normal",
            }}
          >
            {isRefund ? (row.Billedby || "-") : (row.created_by || "-")}
          </td>
        </tr>
      );
    });
  };

  // Function to render refund section with header (keeping refund separation)
  const renderRefundSection = (refundData) => {
    if (!Array.isArray(refundData) || refundData.length === 0) return null;

    const refundTotals = calculateTotals(refundData, true);

    return (
      <>
        <tr>
          <td
            colSpan="12"
            style={{
              padding: "10px",
              fontWeight: "bold",
              fontSize: "16px",
              backgroundColor: "#fff3cd",
              border: "1px solid #d1d5db",
              color: "#856404"
            }}
          >
            REFUNDS ({refundData.length} records)
          </td>
        </tr>
        {renderBillingData(refundData, true)}
        <tr
          style={{
            fontWeight: "700",
            fontSize: "14px",
            backgroundColor: "#fff3cd",
          }}
        >
          <td colSpan="8" style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>
            Subtotal (Refunds)
          </td>
          <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>
            {refundTotals.Creditamt.toFixed(2)}
          </td>
          <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>
            {refundTotals.Paid_Amount.toFixed(2)}
          </td>
          <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>
            {refundTotals.Total_Amount.toFixed(2)}
          </td>
          <td style={{ border: "1px solid #d1d5db", padding: "8px" }}></td>
        </tr>
      </>
    );
  };

  // Render payment summary section
  const renderPaymentSummary = () => {
    const totalCollections = Object.values(paymentSummary).reduce((sum, amount) => sum + amount, 0);
    const totalRefunds = Object.values(refundPaymentSummary).reduce((sum, amount) => sum + amount, 0);
    const netAmount = totalCollections - totalRefunds;

    return (
      <div style={{ 
        marginBottom: '20px', 
        border: '1px solid #d1d5db', 
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#f8fafc'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '18px' }}>
          Payment Summary
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {/* Collections Summary */}
          <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '12px', backgroundColor: 'white' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#059669', fontSize: '14px' }}>Collections</h4>
            {Object.entries(paymentSummary).map(([method, amount]) => (
              amount > 0 && (
                <div key={method} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                  <span>{method}:</span>
                  <span style={{ fontWeight: '600' }}>₹{amount.toFixed(2)}</span>
                </div>
              )
            ))}
            <div style={{ borderTop: '1px solid #d1d5db', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Collections:</span>
                <span style={{ color: '#059669' }}>₹{totalCollections.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Refunds Summary */}
          <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '12px', backgroundColor: 'white' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#dc2626', fontSize: '14px' }}>Refunds</h4>
            {Object.entries(refundPaymentSummary).map(([method, amount]) => (
              amount > 0 && (
                <div key={method} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                  <span>{method}:</span>
                  <span style={{ fontWeight: '600' }}>₹{amount.toFixed(2)}</span>
                </div>
              )
            ))}
            <div style={{ borderTop: '1px solid #d1d5db', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Refunds:</span>
                <span style={{ color: '#dc2626' }}>₹{totalRefunds.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Net Amount */}
          <div style={{ 
            border: '1px solid #d1d5db', 
            borderRadius: '6px', 
            padding: '12px', 
            backgroundColor: netAmount >= 0 ? '#f0fdf4' : '#fef2f2'
          }}>
            <h4 style={{ 
              margin: '0 0 10px 0', 
              color: netAmount >= 0 ? '#059669' : '#dc2626', 
              fontSize: '14px' 
            }}>
              Net Amount
            </h4>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: netAmount >= 0 ? '#059669' : '#dc2626' 
              }}>
                ₹{netAmount.toFixed(2)}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                marginTop: '5px'
              }}>
                {netAmount >= 0 ? 'Net Collections' : 'Net Refunds'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            table { page-break-inside: auto; width: 100%; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            .Register_btn_con { display: none; }
            .search-container { display: none; }
            .duplicate-alert { display: none; }
            .duplicate-summary { display: none; }
            .payment-summary { display: none; }
            .report-container { font-size: 12px; }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover { background-color: #1e40af; }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input, .search-select {
            padding: 4px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 150px;
          }
          .search-input:focus, .search-select:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover { background-color: #4b5563; }
          .filter-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            flex-wrap: wrap;
            align-items: center;
          }
          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .filter-label {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
          }
          .billno-range {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .billno-info {
            font-size: 12px;
            color: #6b7280;
            font-style: italic;
          }
        `}
      </style>

      {/* Duplicate Alert */}
      {hasDuplicates && (
        <div
          className="duplicate-alert"
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "4px",
            padding: "12px",
            marginBottom: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "#856404", fontWeight: "bold", marginRight: "10px" }}>
              ⚠️ DUPLICATE ENTRIES DETECTED
            </span>
            <span style={{ color: "#856404" }}>
              Found {duplicatePharmacyItems.length} duplicate pharmacy entries, {duplicateRefundItems.length} duplicate refund entries
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: "6px 12px",
              backgroundColor: showOnlyDuplicates ? "#dc3545" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {showOnlyDuplicates ? "Show All Records" : "Show Only Duplicates"}
          </button>
        </div>
      )}

      {/* Duplicate Summary */}
      {hasDuplicates && (
        <div
          className="duplicate-summary"
          style={{
            marginBottom: "20px",
            border: "1px solid #ffcdd2",
            borderRadius: "4px",
            padding: "10px",
            backgroundColor: "#ffebee",
          }}
        >
          <h4 style={{ color: "#d32f2f", margin: "0 0 10px 0" }}>Duplicate Pharmacy/Refund Entries Summary</h4>
          {allDuplicateSummary.map((group, index) => (
            <div
              key={index}
              style={{
                marginBottom: "8px",
                padding: "8px",
                backgroundColor: "white",
                borderRadius: "4px",
                border: "1px solid #ffcdd2",
              }}
            >
              <div style={{ fontWeight: "bold", color: "#d32f2f" }}>
                {group.entries[0].Patient_Name} - 
                {group.type === "refund" ? ` Refund: ₹${group.entries[0].TotalAmount}` : ` Pharmacy: ₹${parseFloat(group.entries[0].Creditamt || 0) + getPaymentAmount(group.entries[0])}`} 
                - {group.count} times (Payment Method: {getPaymentMethod(group.entries[0])})
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Invoice: {group.type === "refund" ? (group.entries[0].Billinvoice || group.entries[0].Invoice_NO) : group.entries[0].InvoiceNo} | 
                Date: {group.type === "refund" ? group.entries[0].Billing_Date : group.entries[0].BillingDate} | 
                Patient ID: {group.type === "refund" ? group.entries[0].PatientID : group.entries[0].PatientId}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Summary */}
      <div className="payment-summary">
        {renderPaymentSummary()}
      </div>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          <div className="filter-row">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="patientSearch" style={{ fontWeight: "600", color: "#374151" }}>
                Search Pharmacy:
              </label>
              <input
                id="patientSearch"
                type="text"
                className="search-input"
                placeholder="Search by patient name, ID, invoice no, payment method..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: "250px" }}
              />
            </div>
            <div className="results-info">
              Showing {billedRecordCount} pharmacy records, {refundRecordCount} refund records
              {showOnlyDuplicates && ` (Duplicate entries only)`}
              {searchTerm && (
                <span>
                  {" "}
                  for "<strong>{searchTerm}</strong>"
                </span>
              )}
            </div>
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                Clear Search
              </button>
            )}
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Pharmacy Type</label>
              <select
                className="search-select"
                value={pharmacyTypeFilter}
                onChange={(e) => {
                  setPharmacyTypeFilter(e.target.value);
                  setFromBillNo("");
                  setToBillNo("");
                }}
              >
                <option value="All">All Types</option>
                <option value="OPPharmacy">OP Pharmacy</option>
                <option value="WalkinPharmacy">Walkin Pharmacy</option>
                <option value="Refund">Refunds</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="search-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setFromBillNo("");
                  setToBillNo("");
                }}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Credit">Credit</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Payment Method</label>
              <select
                className="search-select"
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
              >
                <option value="All">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Bill No Range ({billNumberOptions.length} available)</label>
              <div className="billno-range">
                <select
                  className="search-select"
                  value={fromBillNo}
                  onChange={(e) => setFromBillNo(e.target.value)}
                  style={{ minWidth: "120px" }}
                >
                  <option value="">From Bill No</option>
                  {billNumberOptions.map((billNo) => (
                    <option key={billNo} value={billNo}>
                      {billNo}
                    </option>
                  ))}
                </select>
                <span>to</span>
                <select
                  className="search-select"
                  value={toBillNo}
                  onChange={(e) => setToBillNo(e.target.value)}
                  style={{ minWidth: "120px" }}
                >
                  <option value="">To Bill No</option>
                  {billNumberOptions.map((billNo) => (
                    <option key={billNo} value={billNo}>
                      {billNo}
                    </option>
                  ))}
                </select>
              </div>
              {fromBillNo && toBillNo && (
                <div className="billno-info">
                  Range: {fromBillNo} to {toBillNo} (
                  {billNumberOptions.slice(billNumberOptions.indexOf(fromBillNo), billNumberOptions.indexOf(toBillNo) + 1).length} bills)
                </div>
              )}
            </div>

            <button className="clear-search" onClick={clearAllFilters} style={{ alignSelf: "flex-end", marginBottom: "5px" }}>
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlePrint}>
          Print
        </button>
        <button className="RegisterForm_1_btns" onClick={closeModalOPAmountCollectionPrint}>
          Close
        </button>
      </div>

      <div ref={componentRef} className="report-container">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <td colSpan="12" style={{ border: "none", textAlign: "center", padding: "10px" }}>
                <div>
                  <h2 style={{ margin: "0", fontSize: "26px", fontWeight: "700", color: "#1f2937" }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: "5px 0", fontSize: "18px", fontWeight: "600", color: "#374151" }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <p style={{ margin: "5px 0", fontSize: "14px", color: "#4b5563" }}>{reportDateRange}</p>
                  {searchTerm && (
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "#ef4444", fontStyle: "italic" }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {(pharmacyTypeFilter !== "All" || statusFilter !== "All" || paymentMethodFilter !== "All" || fromBillNo || toBillNo) && (
                    <p style={{ margin: "5px 0", fontSize: "12px", color: "#6b7280", fontStyle: "italic" }}>
                      Filters: {pharmacyTypeFilter !== "All" ? `Type: ${pharmacyTypeFilter} ` : ""}
                      {statusFilter !== "All" ? `Status: ${statusFilter} ` : ""}
                      {paymentMethodFilter !== "All" ? `Payment: ${paymentMethodFilter} ` : ""}
                      {fromBillNo || toBillNo ? `Bill No: ${fromBillNo || "Start"} to ${toBillNo || "End"}` : ""}
                    </p>
                  )}
                  {showOnlyDuplicates && (
                    <p
                      style={{
                        margin: "5px 0",
                        fontSize: "14px",
                        color: "#d32f2f",
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                    >
                      ⚠️ Showing Duplicate Entries Only
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr style={{ backgroundColor: "#f3f4f6", fontWeight: "600", fontSize: "13px" }}>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>S.No</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>Invoice No</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>Billing Date</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>Patient ID</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "left" }}>Patient Name</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>Patient Category</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>Remarks</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>Payment Method</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>Credit Amt</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>Paid Amount</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>Total Amount</th>
              <th style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "center" }}>Prepared by</th>
            </tr>
          </thead>
          <tbody>
            {/* Billing Data - Continuous (No OPPharmacy/WalkinPharmacy separation) */}
            {renderBillingData(displayBilledData, false)}
            
            {/* Refund Data - With separation (keeping the old refund separation) */}
            {renderRefundSection(displayRefundData)}

            {billedRecordCount === 0 && refundRecordCount === 0 && (
              <tr>
                <td
                  colSpan="12"
                  style={{ border: "1px solid #d1d5db", padding: "20px", textAlign: "center", color: "#6b7280" }}
                >
                  {showOnlyDuplicates
                    ? "No duplicate records found matching your criteria"
                    : "No records found matching your filters"}
                </td>
              </tr>
            )}

            {/* Grand Total for Pharmacy */}
            {billedRecordCount > 0 && (
              <tr
                style={{
                  borderTop: "2px solid #4b5563",
                  fontWeight: "700",
                  fontSize: "14px",
                  backgroundColor: "#d1d5db",
                }}
              >
                <td colSpan="8" style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>
                  Grand Total (Pharmacy: {billedRecordCount} records)
                </td>
                <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>
                  {grandTotals.Creditamt.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>
                  {grandTotals.Paid_Amount.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #d1d5db", padding: "8px", textAlign: "right" }}>
                  {grandTotals.Total_Amount.toFixed(2)}
                </td>
                <td style={{ border: "1px solid #d1d5db", padding: "8px" }}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ForOPPharmacyPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showOnlyDuplicates, setShowOnlyDuplicates] = React.useState(false);
  const [pharmacyTypeFilter, setPharmacyTypeFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [fromBillNo, setFromBillNo] = React.useState('');
  const [toBillNo, setToBillNo] = React.useState('');

  // Process OPPharmacydata according to BillType
  const processPharmacyData = () => {
    const rawData = Array.isArray(OPPharmacydata) ? OPPharmacydata : [];
    return rawData.map(item => {
      const processedItem = { ...item };
      if (item.BillType === 'Credit') {
        processedItem.Creditamt = item.Paid_Amount || 0;
        processedItem.Paid_Amount = 0;
      } else if (item.BillType === 'Cash') {
        processedItem.Creditamt = 0;
        processedItem.Paid_Amount = item.Paid_Amount || 0;
      }
      return processedItem;
    });
  };

  const pharmacyDataArray = processPharmacyData();
  const refundDataArray = Array.isArray(OPPharmacyRefunddata) ? OPPharmacyRefunddata : [];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Pharmacy_Paid_Wise_Report',
  });

  // Function to detect duplicate pharmacy entries
  const detectDuplicates = (pharmacyData) => {
    const duplicateMap = {};
    const duplicates = [];
    pharmacyData.forEach(item => {
      const key = `${item.PatientId}-${item.InvoiceNo}-${item.Total_Amount || (parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0))}`;
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    return duplicates;
  };

  // Function to detect duplicate refund entries
  const detectRefundDuplicates = (refundData) => {
    const duplicateMap = {};
    const duplicates = [];
    refundData.forEach(item => {
      const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}`;
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    return duplicates;
  };

  // Function to check if a specific pharmacy item is a duplicate
  const isDuplicatePharmacyItem = (item, allItems) => {
    const key = `${item.PatientId}-${item.InvoiceNo}-${item.Total_Amount || (parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0))}`;
    const matchingItems = allItems.filter(i =>
      `${i.PatientId}-${i.InvoiceNo}-${i.Total_Amount || (parseFloat(i.Creditamt || 0) + parseFloat(i.Paid_Amount || 0))}` === key
    );
    return matchingItems.length > 1;
  };

  // Function to check if a specific refund is a duplicate
  const isDuplicateRefundItem = (item, allRefunds) => {
    const key = `${item.PatientID}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}`;
    const matchingRefunds = allRefunds.filter(r =>
      `${r.PatientID}-${r.Billinvoice || r.Invoice_NO}-${r.TotalAmount}` === key
    );
    return matchingRefunds.length > 1;
  };

  // More strict duplicate detection for summary
  const detectStrictDuplicates = (data, isRefund = false) => {
    const duplicateMap = {};
    data.forEach(item => {
      const key = isRefund
        ? `${item.PatientID}-${item.Patient_Name}-${item.Billinvoice || item.Invoice_NO}-${item.TotalAmount}-${item.Billing_Date}`
        : `${item.PatientId}-${item.Patient_Name}-${item.InvoiceNo}-${item.Total_Amount || (parseFloat(item.Creditamt || 0) + parseFloat(item.Paid_Amount || 0))}-${item.BillingDate}`;
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(item);
    });
    const duplicates = [];
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key: key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key],
          type: isRefund ? 'refund' : 'pharmacy'
        });
      }
    });
    return duplicates;
  };

  // Detect duplicates
  const duplicatePharmacyItems = detectDuplicates(pharmacyDataArray);
  const duplicateRefundItems = detectRefundDuplicates(refundDataArray);
  const hasDuplicates = duplicatePharmacyItems.length > 0 || duplicateRefundItems.length > 0;
  const duplicatePharmacySummary = detectStrictDuplicates(pharmacyDataArray, false);
  const duplicateRefundSummary = detectStrictDuplicates(refundDataArray, true);
  const allDuplicateSummary = [...duplicatePharmacySummary, ...duplicateRefundSummary];

  // Function to get pharmacy type from data - UPDATED FOR OP PHARMACY ONLY
  const getPharmacyType = (item) => {
    if (item.BillType === 'OPPharmacy') return 'OPPharmacy';
    if (item.BillType === 'WalkinPharmacy') return 'WalkinPharmacy';
    return 'Other';
  };

  // Function to get status from data
  const getStatus = (item) => {
    if (item.NewPayment === 'RefundPayment') return 'Refund';
    const credit = parseFloat(item.Creditamt || 0);
    const paid = parseFloat(item.Paid_Amount || 0);
    const total = parseFloat(item.Total_Amount || (credit + paid));
    if (credit > 0) return 'Credit';
    if (paid > 0 || (total > 0 && credit === 0)) return 'Paid';
    return 'Other';
  };

  // Function to extract bill number for filtering
  const getBillNumber = (item) => {
    if (item.InvoiceNo) return item.InvoiceNo;
    if (item.Billinvoice) return item.Billinvoice;
    if (item.Voucher_Number) return item.Voucher_Number;
    return '';
  };

  // Filter data without bill number range - UPDATED FILTER LOGIC
  const filterDataWithoutBillRange = (data, isRefund = false) => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' ||
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Only show OPPharmacy and WalkinPharmacy
      const pharmacyType = isRefund ? item.Pharmacy_Type : getPharmacyType(item);
      const matchesPharmacyType = pharmacyTypeFilter === 'All' ||
        (pharmacyTypeFilter === 'OPPharmacy' && pharmacyType === 'OPPharmacy') ||
        (pharmacyTypeFilter === 'WalkinPharmacy' && pharmacyType === 'WalkinPharmacy');
      
      let matchesStatus = true;
      if (!isRefund) {
        const status = getStatus(item);
        matchesStatus = statusFilter === 'All' ||
          (statusFilter === 'Paid' && status === 'Paid') ||
          (statusFilter === 'Credit' && status === 'Credit');
      } else if (statusFilter !== 'All') {
        matchesStatus = false;
      }
      return matchesSearch && matchesPharmacyType && matchesStatus;
    });
  };

  // Get dynamic bill numbers
  const getDynamicBillNumbers = () => {
    const intermediateBilledData = filterDataWithoutBillRange(pharmacyDataArray);
    const intermediateRefundData = filterDataWithoutBillRange(refundDataArray, true);
    const allIntermediateItems = [...intermediateBilledData, ...intermediateRefundData];
    const billNumbers = allIntermediateItems
      .map(item => getBillNumber(item))
      .filter(billNo => billNo && billNo.trim() !== '')
      .sort();
    return [...new Set(billNumbers)];
  };

  const billNumberOptions = getDynamicBillNumbers();

  // Full filter data function
  const filterData = (data, isRefund = false) => {
    let intermediateData = filterDataWithoutBillRange(data, isRefund);
    return intermediateData.filter(item => {
      const billNo = getBillNumber(item);
      let matchesBillNoRange = true;
      if (fromBillNo && toBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex && currentIndex <= toIndex;
      } else if (fromBillNo && billNumberOptions.length > 0) {
        const fromIndex = billNumberOptions.indexOf(fromBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex >= fromIndex;
      } else if (toBillNo && billNumberOptions.length > 0) {
        const toIndex = billNumberOptions.indexOf(toBillNo);
        const currentIndex = billNumberOptions.indexOf(billNo);
        matchesBillNoRange = currentIndex <= toIndex;
      }
      return matchesBillNoRange;
    });
  };

  // Apply filters
  const filteredBilledData = filterData(pharmacyDataArray);
  const filteredRefundData = filterData(refundDataArray, true);
  const displayBilledData = showOnlyDuplicates
    ? filteredBilledData.filter(item => isDuplicatePharmacyItem(item, pharmacyDataArray))
    : filteredBilledData;
  const displayRefundData = showOnlyDuplicates
    ? filteredRefundData.filter(item => isDuplicateRefundItem(item, refundDataArray))
    : filteredRefundData;

  // Group filtered data by BillType - UPDATED FOR OP PHARMACY ONLY
  const groupedData = React.useMemo(() => {
    if (!Array.isArray(displayBilledData)) return {};
    return displayBilledData.reduce((acc, row) => {
      if (!row) return acc;
      let groupKey = row.BillType || 'Unknown';
      
      // Only include OPPharmacy and WalkinPharmacy
      if (groupKey === 'OPPharmacy' || groupKey === 'WalkinPharmacy') {
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(row);
      }
      return acc;
    }, {});
  }, [displayBilledData]);

  // Calculate totals
  const calculateTotals = (data, isRefund = false) => {
    if (!Array.isArray(data)) {
      return { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 };
    }
    return data.reduce(
      (acc, row) => {
        if (isRefund) {
          const refundAmount = parseFloat(row?.TotalAmount || 0);
          let credit = 0;
          let paid = 0;
          if (row?.paytype === 'Credit') {
            credit = refundAmount;
          } else if (row?.paytype === 'Cash') {
            paid = refundAmount;
          } else {
            credit = refundAmount;
          }
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + refundAmount
          };
        } else {
          const credit = parseFloat(row?.Creditamt || 0);
          const paid = parseFloat(row?.Paid_Amount || 0);
          return {
            Creditamt: acc.Creditamt + credit,
            Paid_Amount: acc.Paid_Amount + paid,
            Total_Amount: acc.Total_Amount + (credit + paid)
          };
        }
      },
      { Creditamt: 0, Paid_Amount: 0, Total_Amount: 0 }
    );
  };

  const grandTotals = calculateTotals(displayBilledData);
  const refundTotals = calculateTotals(displayRefundData, true);

  // Format date range
  const reportDateRange =
    searchOptions?.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions?.CurrentDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions?.FromDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')} To: ${new Date(searchOptions?.ToDate || new Date()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`;

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setPharmacyTypeFilter('All');
    setStatusFilter('All');
    setFromBillNo('');
    setToBillNo('');
  };

  // Helper function to get refund amounts by paytype
  const getRefundAmounts = (row) => {
    const refundAmount = parseFloat(row?.PaidAmount || 0);
    let credit = 0;
    let paid = 0;
    if (row?.paytype === 'Credit') {
      credit = refundAmount;
    } else if (row?.paytype === 'Cash') {
      paid = refundAmount;
    } else {
      credit = refundAmount;
    }
    return { credit, paid, total: refundAmount };
  };

  const renderGroupSection = (groupData, groupTitle, isRefund = false) => {
    if (!Array.isArray(groupData) || groupData.length === 0) return null;
    const groupTotals = calculateTotals(groupData, isRefund);
    return (
      <>
        <tr>
          <td colSpan="12" style={{
            padding: '10px',
            fontWeight: 'bold',
            fontSize: '16px',
            backgroundColor: isRefund ? '#fff3cd' : '#e9ecef',
            border: '1px solid #d1d5db',
            color: isRefund ? '#856404' : 'inherit'
          }}>
            {groupTitle} ({groupData.length} records)
          </td>
        </tr>
        {groupData.map((row, index) => {
          const isDuplicate = isRefund
            ? isDuplicateRefundItem(row, refundDataArray)
            : isDuplicatePharmacyItem(row, pharmacyDataArray);
          const { credit, paid, total } = isRefund ? getRefundAmounts(row) : {
            credit: parseFloat(row?.Creditamt || 0),
            paid: parseFloat(row?.Paid_Amount || 0),
            total: parseFloat(row?.Total_Amount || (parseFloat(row?.Creditamt || 0) + parseFloat(row?.Paid_Amount || 0)))
          };
          return (
            <tr
              key={`${groupTitle}-${index}`}
              style={{
                fontSize: '12px',
                backgroundColor: isDuplicate ? '#ffebee' : (index % 2 === 0 ? '#ffffff' : '#f9fafb'),
                borderLeft: isDuplicate ? '4px solid #f44336' : 'none'
              }}
            >
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'center',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {index + 1}
                {isDuplicate && ' ⚠️'}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'center',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {isRefund ? (row?.Voucher_Number || row?.Billinvoice || '-') : (row?.InvoiceNo || '-')}{isDuplicate && (
                  <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                    Duplicate
                  </div>
                )}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'center',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {isRefund ? (row?.Billing_Date || '-') : (row?.BillingDate || '-')}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'center',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {isRefund ? (row?.PatientID || '-') : (row?.PatientId || '-')}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'left',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {isRefund ? (row?.Patient_Name || '-') : (row?.Patient_Name || '-')}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'center',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {isRefund ? (row?.PatCategory || '-') : (row?.PatCategory || '-')}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'center',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {isRefund ? (row?.Remarks || '-') : (row?.Remarks || '-')}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'right',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {credit.toFixed(2)}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'right',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {paid.toFixed(2)}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'right',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {total.toFixed(2)}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'center',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {isRefund ? 'Refunded' : (row?.Bill_Status || '-')}
              </td>
              <td style={{
                border: '1px solid #d1d5db',
                padding: '8px',
                textAlign: 'center',
                color: isDuplicate ? '#d32f2f' : 'inherit',
                fontWeight: isDuplicate ? 'bold' : 'normal'
              }}>
                {isRefund ? (row?.Billedby || '-') : (row?.created_by || '-')}
              </td>
            </tr>
          );
        })}
        <tr style={{
          fontWeight: '700',
          fontSize: '14px',
          backgroundColor: isRefund ? '#fff3cd' : '#d1d5db'
        }}>
          <td colSpan="7" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            Subtotal
          </td>
          <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            {groupTotals.Creditamt.toFixed(2)}
          </td>
          <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            {groupTotals.Paid_Amount.toFixed(2)}
          </td>
          <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
            {groupTotals.Total_Amount.toFixed(2)}
          </td>
          <td colSpan="2" style={{ border: '1px solid #d1d5db' }}></td>
        </tr>
      </>
    );
  };

  // Get record counts
  const billedRecordCount = Array.isArray(displayBilledData) ? displayBilledData.length : 0;
  const refundRecordCount = Array.isArray(displayRefundData) ? displayRefundData.length : 0;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            table { page-break-inside: auto; width: 100%; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            .Register_btn_con { display: none; }
            .search-container { display: none; }
            .duplicate-alert { display: none; }
            .duplicate-summary { display: none; }
            .report-container { font-size: 12px; }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover { background-color: #1e40af; }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input, .search-select {
            padding: 4px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 150px;
          }
          .search-input:focus, .search-select:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover { background-color: #4b5563; }
          .filter-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            flex-wrap: wrap;
            align-items: center;
          }
          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .filter-label {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
          }
          .billno-range {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .billno-info {
            font-size: 12px;
            color: #6b7280;
            font-style: italic;
          }
        `}
      </style>
      {hasDuplicates && (
        <div className="duplicate-alert" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              color: '#856404',
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              ⚠️ DUPLICATE PHARMACY ENTRIES DETECTED
            </span>
            <span style={{ color: '#856404' }}>
              Found {duplicatePharmacyItems.length} duplicate pharmacy entries, {duplicateRefundItems.length} duplicate refund entries
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: '6px 12px',
              backgroundColor: showOnlyDuplicates ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOnlyDuplicates ? 'Show All Records' : 'Show Only Duplicates'}
          </button>
        </div>
      )}
      {hasDuplicates && (
        <div className="duplicate-summary" style={{
          marginBottom: '20px',
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Duplicate Pharmacy/Refund Entries Summary</h4>
          {allDuplicateSummary.map((group, index) => (
            <div key={index} style={{
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {group.entries[0].Patient_Name} -
                {group.type === 'refund' ? ` Refund: ₹${group.entries[0].PaidAmount}` : ` Pharmacy: ₹${group.entries[0].Total_Amount || (parseFloat(group.entries[0].Creditamt || 0) + parseFloat(group.entries[0].Paid_Amount || 0))}`}
                - {group.count} times
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Invoice: {group.type === 'refund' ? (group.entries[0].Billinvoice || group.entries[0].Invoice_NO) : group.entries[0].InvoiceNo} |
                Date: {group.type === 'refund' ? group.entries[0].Billing_Date : group.entries[0].BillingDate} |
                Patient ID: {group.type === 'refund' ? group.entries[0].PatientID : group.entries[0].PatientId}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="search-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <div className="filter-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
                Search Pharmacy:
              </label>
              <input
                id="patientSearch"
                type="text"
                className="search-input"
                placeholder="Search by patient name, ID, invoice no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: '250px' }}
              />
            </div>
            <div className="results-info">
              Showing {billedRecordCount} pharmacy, {refundRecordCount} refund records
              {showOnlyDuplicates && ` (Duplicate entries only)`}
              {searchTerm && <span> for "<strong>{searchTerm}</strong>"</span>}
            </div>
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>Clear Search</button>
            )}
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Pharmacy Type</label>
              <select
                className="search-select"
                value={pharmacyTypeFilter}
                onChange={(e) => {
                  setPharmacyTypeFilter(e.target.value);
                  setFromBillNo('');
                  setToBillNo('');
                }}
              >
                <option value="All">All Types</option>
                <option value="OPPharmacy">OP Pharmacy</option>
                <option value="WalkinPharmacy">Walk-in Pharmacy</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="search-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setFromBillNo('');
                  setToBillNo('');
                }}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Bill No Range ({billNumberOptions.length} available)</label>
              <div className="billno-range">
                <select
                  className="search-select"
                  value={fromBillNo}
                  onChange={(e) => setFromBillNo(e.target.value)}
                  style={{ minWidth: '120px' }}
                >
                  <option value="">From Bill No</option>
                  {billNumberOptions.map(billNo => (
                    <option key={billNo} value={billNo}>{billNo}</option>
                  ))}
                </select>
                <span>to</span>
                <select
                  className="search-select"
                  value={toBillNo}
                  onChange={(e) => setToBillNo(e.target.value)}
                  style={{ minWidth: '120px' }}
                >
                  <option value="">To Bill No</option>
                  {billNumberOptions.map(billNo => (
                    <option key={billNo} value={billNo}>{billNo}</option>
                  ))}
                </select>
              </div>
              {fromBillNo && toBillNo && (
                <div className="billno-info">
                  Range: {fromBillNo} to {toBillNo} ({billNumberOptions.slice(billNumberOptions.indexOf(fromBillNo), billNumberOptions.indexOf(toBillNo) + 1).length} bills)
                </div>
              )}
            </div>
            <button
              className="clear-search"
              onClick={clearAllFilters}
              style={{ alignSelf: 'flex-end', marginBottom: '5px' }}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlePrint}>Print</button>
        <button className="RegisterForm_1_btns" onClick={closeModalOPPharmacyPrint}>Close</button>
      </div>
      <div ref={componentRef} className="report-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td colSpan="12" style={{ border: 'none', textAlign: 'center', padding: '10px' }}>
                <div>
                  <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '700', color: '#1f2937' }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: '5px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#4b5563' }}>
                    {reportDateRange}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {(pharmacyTypeFilter !== 'All' || statusFilter !== 'All' || fromBillNo || toBillNo) && (
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                      Filters: {pharmacyTypeFilter !== 'All' ? `Type: ${pharmacyTypeFilter} ` : ''}
                      {statusFilter !== 'All' ? `Status: ${statusFilter} ` : ''}
                      {fromBillNo || toBillNo ? `Bill No: ${fromBillNo || 'Start'} to ${toBillNo || 'End'}` : ''}
                    </p>
                  )}
                  {showOnlyDuplicates && (
                    <p style={{
                      margin: '5px 0',
                      fontSize: '14px',
                      color: '#d32f2f',
                      fontStyle: 'italic',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ Showing Duplicate Entries Only
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6', fontWeight: '600', fontSize: '13px' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>S.No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Invoice No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Billing Date</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Patient ID</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>Patient Name</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Patient Category</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Remarks</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Credit Amt</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Paid Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Total Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Bill Status</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Created By</th>
            </tr>
          </thead>
          <tbody>
            {/* Only show OPPharmacy and WalkinPharmacy */}
            {['OPPharmacy', 'WalkinPharmacy'].map(billType => {
              const groupData = groupedData[billType] || [];
              if (!Array.isArray(groupData) || groupData.length === 0) return null;
              return renderGroupSection(groupData, billType);
            })}
            {billedRecordCount === 0 && refundRecordCount === 0 && (
              <tr>
                <td colSpan="12" style={{ border: '1px solid #d1d5db', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  {showOnlyDuplicates
                    ? "No duplicate pharmacy records found matching your criteria"
                    : `No pharmacy records found matching your filters`
                  }
                </td>
              </tr>
            )}
            {billedRecordCount > 0 && (
              <tr
                style={{
                  borderTop: '2px solid #4b5563',
                  fontWeight: '700',
                  fontSize: '14px',
                  backgroundColor: '#d1d5db',
                }}
              >
                <td colSpan="7" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  Grand Total (Pharmacy: {billedRecordCount} records)
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {grandTotals.Creditamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {grandTotals.Paid_Amount.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {grandTotals.Total_Amount.toFixed(2)}
                </td>
                <td colSpan="2" style={{ border: '1px solid #d1d5db' }}></td>
              </tr>
            )}
            {renderGroupSection(displayRefundData, 'REFUNDED ITEMS', true)}
            {refundRecordCount > 0 && (
              <tr
                style={{
                  borderTop: '2px solid #4b5563',
                  fontWeight: '700',
                  fontSize: '14px',
                  backgroundColor: '#fff3cd',
                }}
              >
                <td colSpan="7" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  Grand Total (Refunds: {refundRecordCount} records)
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {refundTotals.Creditamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {refundTotals.Paid_Amount.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {refundTotals.Total_Amount.toFixed(2)}
                </td>
                <td colSpan="2" style={{ border: '1px solid #d1d5db' }}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const ForPrintFinalCreditBill = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(FinalBillCredit);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Final_Credit_Bill_Report',
    onAfterPrint: () => console.log('Printed successfully')
  });

  // Function to detect duplicate credit bill entries
  const detectDuplicates = (creditBills) => {
    const duplicateMap = {};
    const duplicates = [];
    
    creditBills.forEach(bill => {
      // Create a unique key based on patient, bill number, and amount
      const key = `${bill.Patientid}-${bill.FBillNo}-${bill.Net_Amount}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(bill);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to check if a specific credit bill is a duplicate
  const isDuplicateCreditBill = (bill, allBills) => {
    const key = `${bill.Patientid}-${bill.FBillNo}-${bill.Net_Amount}`;
    const matchingBills = allBills.filter(b => 
      `${b.Patientid}-${b.FBillNo}-${b.Net_Amount}` === key
    );
    return matchingBills.length > 1;
  };

  // More strict duplicate detection for summary
  const detectStrictDuplicates = (creditBills) => {
    const duplicateMap = {};
    
    creditBills.forEach(bill => {
      // Include more fields for stricter matching
      const key = `${bill.Patientid}-${bill.Patientname}-${bill.FBillNo}-${bill.Net_Amount}-${bill.FBilldate}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(bill);
    });
    
    const duplicates = [];
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key: key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key]
        });
      }
    });
    
    return duplicates;
  };

  // All credit bills for duplicate detection
  const allCreditBills = FinalBillCredit || [];

  // Detect duplicates
  const duplicateCreditBills = detectDuplicates(allCreditBills);
  const hasDuplicates = duplicateCreditBills.length > 0;
  const duplicateSummary = detectStrictDuplicates(allCreditBills);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(allCreditBills);
    } else {
      const filtered = allCreditBills.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, FinalBillCredit]);

  // Apply duplicate filter if enabled
  const displayData = showOnlyDuplicates 
    ? filteredData.filter(bill => isDuplicateCreditBill(bill, allCreditBills))
    : filteredData;

  // Calculate totals based on filtered data
  const totals = displayData.reduce(
    (acc, row) => ({
      Net_Amount: acc.Net_Amount + parseFloat(row.Net_Amount || 0),
      Balance_Amount: acc.Balance_Amount + parseFloat(row.Balance_Amount || 0),
    }),
    {
      Net_Amount: 0,
      Balance_Amount: 0,
    }
  );

  // Format date range
  const reportDateRange =
    searchOptions.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions.FromDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')} To: ${new Date(searchOptions.ToDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .duplicate-alert {
              display: none;
            }
            .duplicate-summary {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
        `}
      </style>

      {/* Duplicate Alert */}
      {hasDuplicates && (
        <div className="duplicate-alert" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#856404', 
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              ⚠️ DUPLICATE CREDIT BILL ENTRIES DETECTED
            </span>
            <span style={{ color: '#856404' }}>
              Found {duplicateCreditBills.length} duplicate credit bill entries
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: '6px 12px',
              backgroundColor: showOnlyDuplicates ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOnlyDuplicates ? 'Show All Credit Bills' : 'Show Only Duplicates'}
          </button>
        </div>
      )}

      {/* Duplicate Summary */}
      {hasDuplicates && (
        <div className="duplicate-summary" style={{ 
          marginBottom: '20px', 
          border: '1px solid #ffcdd2', 
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Duplicate Credit Bill Entries Summary</h4>
          {duplicateSummary.map((group, index) => (
            <div key={index} style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {group.entries[0].Patientname} - Bill No: {group.entries[0].FBillNo} - ₹{group.entries[0].Net_Amount} - {group.count} times
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Patient ID: {group.entries[0].Patientid} | IP No: {group.entries[0].IPNo || 'N/A'} | Date: {group.entries[0].FBilldate ? new Date(group.entries[0].FBilldate).toLocaleDateString('en-GB') : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="creditBillSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Credit Bills:
          </label>
          <input
            id="creditBillSearch"
            type="text"
            className="search-input"
            placeholder="Search by patient name, ID, IP number, bill no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
       
        <div className="results-info">
          Showing {displayData.length} of {FinalBillCredit.length} records
          {showOnlyDuplicates && ` (Duplicate entries only)`}
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>
       
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Print buttons - hidden during printing */}
      <div className="Register_btn_con added_Register_btn_con" style={{ marginBottom: '20px' }}>
        <button className="RegisterForm_1_btns" onClick={handlePrint}>
          Print
        </button>
        <button className="RegisterForm_1_btns" onClick={closeModalFinalCreditBillPrint}>
          Close
        </button>
      </div>

      {/* Report content */}
      <div ref={componentRef} className="report-container" style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '700', color: '#1f2937' }}>
            KARUNA MEDICAL COLLEGE HOSPITAL
          </h2>
          <h3 style={{ margin: '5px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
            Vilayodi, Chittur, Palakkad
          </h3>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#4b5563' }}>
            {reportDateRange}
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold', color: '#4b5563' }}>
            Final Credit Bill Report
          </p>
          {searchTerm && (
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
              Filtered results for: "{searchTerm}"
            </p>
          )}
          {showOnlyDuplicates && (
            <p style={{ 
              margin: '5px 0',
              fontSize: '14px',
              color: '#d32f2f',
              fontStyle: 'italic',
              fontWeight: 'bold'
            }}>
              ⚠️ Showing Duplicate Entries Only
            </p>
          )}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', fontWeight: '600' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>S.No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Bill No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Bill Date</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Patient ID</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>IP No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>Patient Name</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Total Amt</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Bal Amt</th>
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((row, index) => {
                const isDuplicate = isDuplicateCreditBill(row, allCreditBills);
                return (
                  <tr
                    key={`final-bill-${index}`}
                    style={{ 
                      backgroundColor: isDuplicate ? '#ffebee' : (index % 2 === 0 ? '#ffffff' : '#f9fafb'),
                      fontSize: '11px',
                      borderLeft: isDuplicate ? '4px solid #f44336' : 'none'
                    }}
                  >
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {index + 1}
                      {isDuplicate && ' ⚠️'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.FBillNo || '-'}
                      {isDuplicate && (
                        <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                          Duplicate
                        </div>
                      )}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.FBilldate ? new Date(row.FBilldate).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.Patientid || '-'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.IPNo || '-'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'left',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.Patientname || '-'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'right', 
                      fontWeight: '500',
                      color: isDuplicate ? '#d32f2f' : 'inherit'
                    }}>
                      {parseFloat(row.Net_Amount || 0).toFixed(2)}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      color: isDuplicate ? '#d32f2f' : (parseFloat(row.Balance_Amount || 0) > 0 ? '#dc2626' : '#16a34a')
                    }}>
                      {parseFloat(row.Balance_Amount || 0).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={{ border: '1px solid #d1d5db', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  {showOnlyDuplicates 
                    ? "No duplicate credit bill records found matching your criteria" 
                    : `No credit bill records found for "${searchTerm}"`
                  }
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            {displayData.length > 0 && (
              <tr style={{ 
                fontWeight: '700', 
                backgroundColor: '#e5e7eb',
                borderTop: '2px solid #9ca3af'
              }}>
                <td colSpan="6" style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right' }}>
                  Grand Total ({displayData.length} records)
                </td>
                <td style={{ 
                  border: '1px solid #d1d5db', 
                  padding: '10px', 
                  textAlign: 'right',
                  backgroundColor: '#d1d5db'
                }}>
                  {totals.Net_Amount.toFixed(2)}
                </td>
                <td style={{ 
                  border: '1px solid #d1d5db', 
                  padding: '10px', 
                  textAlign: 'right',
                  backgroundColor: '#d1d5db',
                  color: totals.Balance_Amount > 0 ? '#dc2626' : '#16a34a'
                }}>
                  {totals.Balance_Amount.toFixed(2)}
                </td>
              </tr>
            )}
          </tfoot>
        </table>
        
        {/* Summary Statistics */}
        {displayData.length > 0 && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong>Total Bills:</strong> {displayData.length}
              </div>
              <div>
                <strong>Total Amount:</strong> ₹{totals.Net_Amount.toFixed(2)}
              </div>
              <div>
                <strong>Total Balance:</strong> 
                <span style={{ color: totals.Balance_Amount > 0 ? '#dc2626' : '#16a34a', fontWeight: '600' }}>
                  ₹{totals.Balance_Amount.toFixed(2)}
                </span>
              </div>
              <div>
                <strong>Average Balance per Bill:</strong> 
                <span style={{ color: (totals.Balance_Amount / displayData.length) > 0 ? '#dc2626' : '#16a34a' }}>
                  ₹{(totals.Balance_Amount / displayData.length).toFixed(2)}
                </span>
              </div>
              {hasDuplicates && (
                <div>
                  <strong>Duplicate Bills:</strong> 
                  <span style={{ color: '#d32f2f', fontWeight: '600' }}>
                    {duplicateCreditBills.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Footer with printed date and time */}
        <div style={{ 
          marginTop: '30px', 
          fontSize: '11px', 
          textAlign: 'center', 
          color: '#6b7280',
          paddingTop: '10px',
          borderTop: '1px solid #e5e7eb'
        }}>
          Printed on: {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>
    </div>
  );
};

const ForPrintFinalBill = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(FinalBillData);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Final_Billing_Report',
  });

  // Function to detect duplicate final bill entries
  const detectDuplicates = (finalBills) => {
    const duplicateMap = {};
    const duplicates = [];
    
    finalBills.forEach(bill => {
      // Create a unique key based on patient, bill number, and amounts
      const key = `${bill.Patientid}-${bill.FBillNo}-${bill.TotalAmount}-${bill.Net_Amount}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(bill);
    });
    
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push(...duplicateMap[key]);
      }
    });
    
    return duplicates;
  };

  // Function to check if a specific final bill is a duplicate
  const isDuplicateFinalBill = (bill, allBills) => {
    const key = `${bill.Patientid}-${bill.FBillNo}-${bill.TotalAmount}-${bill.Net_Amount}`;
    const matchingBills = allBills.filter(b => 
      `${b.Patientid}-${b.FBillNo}-${b.TotalAmount}-${b.Net_Amount}` === key
    );
    return matchingBills.length > 1;
  };

  // More strict duplicate detection for summary
  const detectStrictDuplicates = (finalBills) => {
    const duplicateMap = {};
    
    finalBills.forEach(bill => {
      // Include more fields for stricter matching
      const key = `${bill.Patientid}-${bill.Patientname}-${bill.FBillNo}-${bill.TotalAmount}-${bill.Net_Amount}-${bill.FBilldate}`;
      
      if (!duplicateMap[key]) {
        duplicateMap[key] = [];
      }
      duplicateMap[key].push(bill);
    });
    
    const duplicates = [];
    Object.keys(duplicateMap).forEach(key => {
      if (duplicateMap[key].length > 1) {
        duplicates.push({
          key: key,
          count: duplicateMap[key].length,
          entries: duplicateMap[key]
        });
      }
    });
    
    return duplicates;
  };

  // All final bills for duplicate detection
  const allFinalBills = FinalBillData || [];

  // Detect duplicates
  const duplicateFinalBills = detectDuplicates(allFinalBills);
  const hasDuplicates = duplicateFinalBills.length > 0;
  const duplicateSummary = detectStrictDuplicates(allFinalBills);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(allFinalBills);
    } else {
      const filtered = allFinalBills.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, FinalBillData]);

  // Apply duplicate filter if enabled
  const displayData = showOnlyDuplicates 
    ? filteredData.filter(bill => isDuplicateFinalBill(bill, allFinalBills))
    : filteredData;

  // Calculate totals based on filtered data
  const totals = displayData.reduce(
    (acc, row) => ({
      Creditamt: acc.Creditamt + parseFloat(row.Creditamt || 0),
      TotalAmount: acc.TotalAmount + parseFloat(row.TotalAmount || 0),
      Net_Amount: acc.Net_Amount + parseFloat(row.Net_Amount || 0),
      Discount: acc.Discount + parseFloat(row.Discount || 0),
      Advanceamt: acc.Advanceamt + parseFloat(row.Advanceamt || 0),
      Paidamt: acc.Paidamt + parseFloat(row.Paidamt || 0),
      Refundamt: acc.Refundamt + parseFloat(row.Refundamt || 0),
      Receivable_Amount: acc.Receivable_Amount + parseFloat(row.Receivable_Amount || 0),
    }),
    {
      Creditamt: 0,
      TotalAmount: 0,
      Net_Amount: 0,
      Discount: 0,
      Advanceamt: 0,
      Paidamt: 0,
      Refundamt: 0,
      Receivable_Amount: 0,
    }
  );

  // Format date range
  const reportDateRange =
    searchOptions.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions.FromDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')} To: ${new Date(searchOptions.ToDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')}`;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .duplicate-alert {
              display: none;
            }
            .duplicate-summary {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
        `}
      </style>

      {/* Duplicate Alert */}
      {hasDuplicates && (
        <div className="duplicate-alert" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#856404', 
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              ⚠️ DUPLICATE FINAL BILL ENTRIES DETECTED
            </span>
            <span style={{ color: '#856404' }}>
              Found {duplicateFinalBills.length} duplicate final bill entries
            </span>
          </div>
          <button
            onClick={() => setShowOnlyDuplicates(!showOnlyDuplicates)}
            style={{
              padding: '6px 12px',
              backgroundColor: showOnlyDuplicates ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOnlyDuplicates ? 'Show All Final Bills' : 'Show Only Duplicates'}
          </button>
        </div>
      )}

      {/* Duplicate Summary */}
      {hasDuplicates && (
        <div className="duplicate-summary" style={{ 
          marginBottom: '20px', 
          border: '1px solid #ffcdd2', 
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          <h4 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>Duplicate Final Bill Entries Summary</h4>
          {duplicateSummary.map((group, index) => (
            <div key={index} style={{ 
              marginBottom: '8px', 
              padding: '8px', 
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {group.entries[0].Patientname} - Bill No: {group.entries[0].FBillNo} - Total: ₹{group.entries[0].TotalAmount} - {group.count} times
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Patient ID: {group.entries[0].Patientid} | IP No: {group.entries[0].IPNo || 'N/A'} | Date: {group.entries[0].FBilldate || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Patient:
          </label>
          <input
            id="patientSearch"
            type="text"
            className="search-input"
            placeholder="Search by patient name, ID, IP number, bill no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      
        <div className="results-info">
          Showing {displayData.length} of {FinalBillData.length} records
          {showOnlyDuplicates && ` (Duplicate entries only)`}
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>
      
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}
      </div>

      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handlePrint}>
          Print
        </button>
        <button className="RegisterForm_1_btns" onClick={closeModalFinalBillPrint}>
          Close
        </button>
      </div>

      <div ref={componentRef} className="report-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td colSpan="13" style={{ border: 'none', textAlign: 'center', padding: '10px' }}>
                <div>
                  <h2 style={{ margin: '0', fontSize: '26px', fontWeight: '700', color: '#1f2937' }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: '5px 0', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#4b5563' }}>
                    {reportDateRange}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {showOnlyDuplicates && (
                    <p style={{ 
                      margin: '5px 0',
                      fontSize: '14px',
                      color: '#d32f2f',
                      fontStyle: 'italic',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ Showing Duplicate Entries Only
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6', fontWeight: '600', fontSize: '13px' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>S.No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Bill No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Bill Date</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>Patient ID</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'center' }}>IP No</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>Patient Name</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Grand Total</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Credit Amt</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Discount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Advance Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Paid Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Refund Amount</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((row, index) => {
                const isDuplicate = isDuplicateFinalBill(row, allFinalBills);
                return (
                  <tr
                    key={`final-bill-${index}`}
                    style={{ 
                      fontSize: '12px', 
                      backgroundColor: isDuplicate ? '#ffebee' : (index % 2 === 0 ? '#ffffff' : '#f9fafb'),
                      borderLeft: isDuplicate ? '4px solid #f44336' : 'none'
                    }}
                  >
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {index + 1}
                      {isDuplicate && ' ⚠️'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.FBillNo || '-'}
                      {isDuplicate && (
                        <div style={{ fontSize: '8px', color: '#f44336', fontStyle: 'italic' }}>
                          Duplicate
                        </div>
                      )}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.FBilldate || '-'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.Patientid || '-'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'center',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.IPNo || '-'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'left',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.Patientname || '-'}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'right',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {parseFloat(row.TotalAmount || 0).toFixed(2)}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'right',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {parseFloat(row.Creditamt || 0).toFixed(2)}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'right',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {parseFloat(row.Discount || 0).toFixed(2)}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'right',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {parseFloat(row.Advanceamt || 0).toFixed(2)}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'right',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {parseFloat(row.Paidamt || 0).toFixed(2)}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'right',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {parseFloat(row.Refundamt || 0).toFixed(2)}
                    </td>
                    <td style={{ 
                      border: '1px solid #d1d5db', 
                      padding: '8px', 
                      textAlign: 'right',
                      color: isDuplicate ? '#d32f2f' : 'inherit',
                      fontWeight: isDuplicate ? 'bold' : 'normal'
                    }}>
                      {row.Remarks}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="13" style={{ border: '1px solid #d1d5db', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  {showOnlyDuplicates 
                    ? "No duplicate final bill records found matching your criteria" 
                    : `No records found for "${searchTerm}"`
                  }
                </td>
              </tr>
            )}
          
            {displayData.length > 0 && (
              <tr
                style={{
                  borderTop: '2px solid #4b5563',
                  fontWeight: '700',
                  fontSize: '14px',
                  backgroundColor: '#d1d5db',
                }}
              >
                <td colSpan="6" style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  Grand Total ({displayData.length} records)
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {totals.Net_Amount.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {totals.Creditamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {totals.Discount.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {totals.Advanceamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {totals.Paidamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  {totals.Refundamt.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right' }}>
                  -
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Summary Statistics */}
        {displayData.length > 0 && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong>Total Bills:</strong> {displayData.length}
              </div>
              <div>
                <strong>Total Amount:</strong> ₹{totals.Net_Amount.toFixed(2)}
              </div>
              <div>
                <strong>Total Credit:</strong> ₹{totals.Creditamt.toFixed(2)}
              </div>
              <div>
                <strong>Total Discount:</strong> ₹{totals.Discount.toFixed(2)}
              </div>
              <div>
                <strong>Total Advance:</strong> ₹{totals.Advanceamt.toFixed(2)}
              </div>
              <div>
                <strong>Total Paid:</strong> ₹{totals.Paidamt.toFixed(2)}
              </div>
              {hasDuplicates && (
                <div>
                  <strong>Duplicate Bills:</strong> 
                  <span style={{ color: '#d32f2f', fontWeight: '600' }}>
                    {duplicateFinalBills.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Footer with printed date and time */}
        <div style={{ 
          marginTop: '30px', 
          fontSize: '11px', 
          textAlign: 'center', 
          color: '#6b7280',
          paddingTop: '10px',
          borderTop: '1px solid #e5e7eb'
        }}>
          Printed on: {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>
    </div>
  );
};



  const allPatients = [
    ...Filterconsultationdata.newpatients.map((p) => ({ ...p, type: "New" })),
    ...Filterconsultationdata.oldpatients.map((p) => ({
      ...p,
      type: "Follow Up",
    })),
  ];

  // Filter patients based on search inputs
  const filteredPatients = allPatients.filter((patient) => {
    const matchesName = patient.Patient_Name.toLowerCase().includes(
      patientNameFilter.toLowerCase()
    );
    const matchesSpeciality = patient.DeptName.toLowerCase().includes(
      specialityFilter.toLowerCase()
    );
    const matchesDoctor = patient.Doctor_Name.toLowerCase().includes(
      doctorNameFilter.toLowerCase()
    );
    return matchesName && matchesSpeciality && matchesDoctor;
  });

  const handleSelectAllUsers = (event) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedUsers(
        filteredUserList.map((user) => ({
          username: user.username,
          Employee_Id: user.Employee_Id,
        }))
      );
    } else {
      setSelectedUsers([]);
    }
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Billing Report</h3>
        <div className="RegisterTypecon">
          <div className="RegisterType">
            {[
              
              
              "OPPharmacy",
              "Pharmacy",
              "IPAmountCollection",
              "OPAmountCollection"
            ].map((p, ind) => (
              <div className="registertypeval" key={ind + "key"}>
                <input
                  type="radio"
                  id={p}
                  name="view_type"
                  checked={viewType === p}
                  onChange={() => setViewType(p)}
                  value={p}
                />
                <label htmlFor={p}>
                  {
                    {
                      IPAmountCollection : "IPAmountCollection",
                      OPPharmacy : "OPPharmacy",
                      Pharmacy : "Pharmacy",
                      OPAmountCollection : "OPAmountCollection",
                      
                    }[p] || p // Fallback to p if no match is found
                  }
                </label>
              </div>
            ))}
          </div>
        </div>
        <br />
        <div className="search_div_bar" style={{ width: "100%" }}>
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

            {/* {viewType === 'ServiceWise' && (
              <>
                <div className="RegisForm_1">
                  <label>Service Category<span>:</span></label>

                  <Button onClick={() => openModalService()}>
                    <VisibilityIcon style={{ marginRight: '50px' }} />
                  </Button>
                </div>
                <div className="RegisForm_1">
                  <label>User<span>:</span></label>

                  <Button onClick={() => openModalServiceUser()}>
                    <GroupIcon style={{ marginRight: '50px' }} />
                  </Button>
                </div>
              </>
            )} */}

            
            



            {viewType === "Overall" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  Overall<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModaloverall()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "ServiceWise" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  ServiceWise<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalDepoverall()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "Consultationuserwise" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  Consultation User Wise<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalConsultoverall()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "Consultationoverall" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  Consultation Overall<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalConsultOverallprint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "Refund" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  Refund User Wise<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalRefundPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "Advance" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  Advance Wise<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalAdvancePrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "FinalBill" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  FinalBill Wise<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalFinalBillPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "OutstandingCredits" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  OutStanding credit<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalFinalCreditBillPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "Summary" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  Summary<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalSummaryPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "ClosingReport" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  ClosingReport<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalClosingPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "IPPharmacy" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  IPPharmacy Report<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalIPPharmacyPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}

            {viewType === "OPPharmacy" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  OPPharmacy Report<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalOPPharmacyPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}


            {viewType === "Pharmacy" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  Pharmacy Report<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalAllPharmacyPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}


            {viewType === "IPAmountCollection" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  IPAmountCollection Report<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalIPAmountCollectionPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}


            {viewType === "OPAmountCollection" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  OPAmountCollection Report<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* Print Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalOPAmountCollectionPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  {/* Excel Export Button */}
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportToExcel}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )}


            


            {/* {viewType === "ClosingSummary" && (
              <div
                className="RegisForm_1"
                style={{ justifyContent: "space-evenly" }}
              >
                <label htmlFor="input">
                  Summary Report<span>:</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={() => openModalClosingSummaryPrint()}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #28a745",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleExportClosingSummary}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Excel
                    </span>
                  </button>
                </div>
              </div>
            )} */}




            {/* ForPrintAdvance */}
          </div>

          <br />

          {openModal2 && viewType === "UserWise" && (
            <div className="loader" onClick={handleCloseModal1}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>
                <>
                  <ForPrintBillData />
                </>
              </div>
            </div>
          )}

          {Openmodalprint && viewType === "Overall" && (
            <div className="loader" onClick={handleCloseModaloverall}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>
                <>
                  <ForPrintBillDataOverall />
                </>
              </div>
            </div>
          )}

          {OpenmodalDepprint && viewType === "ServiceWise" && (
            <div className="loader" onClick={handleCloseDepModaloverall}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>
                <>
                  <ForPrintBillDataServices />
                </>
              </div>
            </div>
          )}

          {OpenmodalConsultprint && viewType === "Consultationuserwise" && (
            <div className="loader" onClick={handleCloseConsultModaloverall}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>
                {printBySpeciality ? (
                  <SpecialityPrint />
                ) : (
                  <ForPrintBillDataConsultation />
                )}
              </div>
            </div>
          )}

          {OpenmodalConsultOverallprint &&
            viewType === "Consultationoverall" && (
              <div className="loader" onClick={handleCloseConsultOverallModal}>
                <div className="cardModel" onClick={(e) => e.stopPropagation()}>
                  {printBySpeciality ? (
                    <SpecialityPrint />
                  ) : (
                    <ForPrintBillDataConsultationOverall />
                  )}
                </div>
              </div>
            )}

          {OpenmodalRefundUserprint && viewType === "Refund" && (
            <div className="loader" onClick={handleCloseRefundPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>
                {printBySpeciality ? (
                  <SpecialityPrint />
                ) : (
                  <ForPrintRefundData />
                )}
              </div>
            </div>
          )}

          
          {OpenmodalAdvanceprint && viewType === "Advance" && (
            <div className="loader" onClick={handleCloseAdvancePrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForPrintAdvance />          
              </div>
            </div>
          )}

          {OpenmodalFinalBillprint && viewType === "FinalBill" && (
            <div className="loader" onClick={closeModalFinalBillPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForPrintFinalBill />          
              </div>
            </div>
          )}

          {OpenmodalFinalCreditBillprint && viewType === "OutstandingCredits" && (
            <div className="loader" onClick={closeModalFinalCreditBillPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForPrintFinalCreditBill />          
              </div>
            </div>
          )}

          

          {OpenmodalSummaryprint && viewType === "Summary" && (
            <div className="loader" onClick={closeModalSummaryPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForPrintSummary />          
              </div>
            </div>
          )}
{/* 
          {OpenmodalClosingprint && viewType === "ClosingReport" && (
            <div className="loader" onClick={closeModalClosingPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForPrintClosingReport
                    OPServicesclosing={OPServicesclosing}
                    IPServicesclosing={IPServicesclosing}
                    OPDiscountclosing={OPDiscountclosing}
                    IPDiscountclosing={IPDiscountclosing}
                    Advanceclosing={Advanceclosing}
                    AdvanceRefundclosing={AdvanceRefundclosing}
                    FinalBillDetails={FinalBillDetails}
                    Refundclosing={Refundclosing}
                    searchOptions={searchOptions}
                  />          
              </div>
            </div>
          )} */}

           {/* {OpenmodalClosingSummaryprint && viewType === "ClosingSummary" && (
            <div className="loader" onClick={closeModalClosingSummaryPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForPrintClosingSummary
                    OPServicesclosing={OPServicesclosing}
                    IPServicesclosing={IPServicesclosing}
                    OPDiscountclosing={OPDiscountclosing}
                    IPDiscountclosing={IPDiscountclosing}
                    Advanceclosing={Advanceclosing}
                    AdvanceRefundclosing={AdvanceRefundclosing}
                    FinalBillDetails={FinalBillDetails}
                    Refundclosing={Refundclosing}
                    searchOptions={searchOptions}
                  />          
              </div>
            </div>
          )} */}

          {OpenmodalIPPharmacyprint && viewType === "IPPharmacy" && (
            <div className="loader" onClick={closeModalIPPharmacyPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForIPPharmacyPrint />          
              </div>
            </div>
          )}

          {OpenmodalOPPharmacyprint && viewType === "OPPharmacy" && (
            <div className="loader" onClick={closeModalOPPharmacyPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForOPPharmacyPrint />          
              </div>
            </div>
          )}

          {OpenmodalAllPharmacyprint && viewType === "Pharmacy" && (
            <div className="loader" onClick={closeModalAllPharmacyPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForAllPharmacyPrint />          
              </div>
            </div>
          )}


          {OpenmodalIPAmountCollectionprint && viewType === "IPAmountCollection" && (
            <div className="loader" onClick={closeModalIPAmountCollectionPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForIPAmountCollectionPrint />          
              </div>
            </div>
          )}


          {OpenmodalOPAmountCollectionprint && viewType === "OPAmountCollection" && (
            <div className="loader" onClick={closeModalOPAmountCollectionPrint}>
              <div className="cardModel" onClick={(e) => e.stopPropagation()}>    
                  <ForOPAmountCollectionPrint />          
              </div>
            </div>
          )}




          
        </div>
      </div>

      {/* Patient List Table with Filters */}
      {(viewType === "Consultationuserwise" ||
        viewType === "Consultationoverall") && (
        <>
          <div className="Main_container_app">
            <h3>Department</h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                placeItems: "center",
                gap: "15px",
                padding: "0px 15px",
              }}
            >
              <div>
                <label
                  style={{
                    gap: "15px",
                    padding: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="select-all-specialities"
                    checked={
                      Array.isArray(SpecialityData) &&
                      SpecialityData.length > 0 &&
                      SelectedSpecialities.length === SpecialityData.length
                    }
                    onChange={handleSelectAllSpecialities}
                  />
                  Select All
                </label>
              </div>
              {Array.isArray(SpecialityData) && SpecialityData.length > 0 ? (
                SpecialityData.map((speciality, index) => (
                  <div key={index}>
                    <label
                      htmlFor={`speciality-${index}`}
                      style={{
                        gap: "15px",
                        padding: "10px",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="specialityArray"
                        id={`speciality-${index}`}
                        value={`${speciality.SpecialityName} | ${speciality.Speciality_Id}`}
                        checked={isSpecialityChecked(speciality)}
                        onChange={(e) =>
                          handleCheckboxChangeSpeciality(e, speciality)
                        }
                      />
                      {speciality.SpecialityName}
                    </label>
                  </div>
                ))
              ) : (
                <div className="Add_items_Purchase_Master">
                  <span>No Department Found</span>
                </div>
              )}
            </div>
          </div>

          <div className="Main_container_app">
            <h3>User</h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                placeItems: "center",
                gap: "15px",
                padding: "0px 15px",
              }}
            >
              <div>
                <label
                  style={{
                    gap: "15px",
                    padding: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="select-all-users"
                    checked={
                      Array.isArray(filteredUserList) &&
                      filteredUserList.length > 0 &&
                      SelectedUsers.length === filteredUserList.length
                    }
                    onChange={handleSelectAllUsers}
                  />
                  Select All
                </label>
              </div>
              {Array.isArray(filteredUserList) &&
              filteredUserList.length > 0 ? (
                filteredUserList.map((user, index) => (
                  <div key={index}>
                    <label
                      htmlFor={`user-${index}`}
                      style={{
                        gap: "15px",
                        padding: "10px",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="userArray"
                        id={`user-${index}`}
                        value={`${user.username} | ${user.Employee_Id}`}
                        checked={isUserChecked(user)}
                        onChange={(e) => handleCheckboxChangeUser(e, user)}
                      />
                      {user.username}
                    </label>
                  </div>
                ))
              ) : (
                <div className="Add_items_Purchase_Master">
                  <span>No Employee Found</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Patient List</h3>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>
                  Patient Name<span>:</span>
                </label>
                <input
                  type="text"
                  value={patientNameFilter}
                  onChange={(e) => setPatientNameFilter(e.target.value)}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Speciality<span>:</span>
                </label>
                <input
                  type="text"
                  value={specialityFilter}
                  onChange={(e) => setSpecialityFilter(e.target.value)}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Doctor Name<span>:</span>
                </label>
                <input
                  type="text"
                  value={doctorNameFilter}
                  onChange={(e) => setDoctorNameFilter(e.target.value)}
                />
              </div>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Type
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Patient ID
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Bill Date
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Patient Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Doctor Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Department
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Paid Amount
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {patient.type}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {patient.PatientId}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {patient.BillDate}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {patient.Patient_Name}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {patient.Doctor_Name}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {patient.DeptName}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {patient.PaidAmount}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {patient.PatientCategory}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(viewType === "ServiceWise" || viewType === "Refund" || viewType === "Advance" || viewType === "FinalBill" || viewType === 'ClosingReport' || viewType ==="Summary" || viewType ==="OutstandingCredits" || viewType === "ClosingSummary" || viewType === "Pharmacy" || viewType === 'OPPharmacy' || viewType === 'IPAmountCollection' || viewType === 'OPAmountCollection') && (
        <>
          {(viewType === "ServiceWise" || viewType === 'ClosingReport' || viewType === "ClosingSummary")  && (
            <div className="Main_container_app">
              <h3>Department</h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  placeItems: "center",
                  gap: "15px",
                  padding: "0px 15px",
                }}
              >
                <div>
                  <label
                    style={{
                      gap: "15px",
                      padding: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="select-all-specialities"
                      checked={
                        Array.isArray(ServicesList) &&
                        ServicesList.length > 0 &&
                        selectedServices.length === ServicesList.length
                      }
                      onChange={handleSelectAllServices}
                    />
                    Select All
                  </label>
                </div>
                {Array.isArray(ServicesList) && ServicesList.length > 0 ? (
                  ServicesList.map((service, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`service-${index}`}
                        style={{
                          gap: "15px",
                          padding: "10px",
                        }}
                      >
                        <input
                          type="checkbox"
                          name="serviceArray"
                          id={`service-${index}`}
                          value={`${service.ServiceCategory} | ${service.Serviceid}`}
                          checked={isServicesChecked(service)}
                          onChange={(e) =>
                            handleCheckboxChangeService(e, service)
                          }
                        />
                        {service.ServiceCategory}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="Add_items_Purchase_Master">
                    <span>No Department Found</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="Main_container_app">
            <h3>User</h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                placeItems: "center",
                gap: "15px",
                padding: "0px 15px",
              }}
            >
              <div>
                <label
                  style={{
                    gap: "15px",
                    padding: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="select-all-users"
                    checked={
                      Array.isArray(filteredUserList) &&
                      filteredUserList.length > 0 &&
                      SelectedUsers.length === filteredUserList.length
                    }
                    onChange={handleSelectAllUsers}
                  />
                  Select All
                </label>
              </div>
              {Array.isArray(filteredUserList) &&
              filteredUserList.length > 0 ? (
                filteredUserList.map((user, index) => (
                  <div key={index}>
                    <label
                      htmlFor={`user-${index}`}
                      style={{
                        gap: "15px",
                        padding: "10px",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="userArray"
                        id={`user-${index}`}
                        value={`${user.username} | ${user.Employee_Id}`}
                        checked={isUserChecked(user)}
                        onChange={(e) => handleCheckboxChangeUser(e, user)}
                      />
                      {user.username}
                    </label>
                  </div>
                ))
              ) : (
                <div className="Add_items_Purchase_Master">
                  <span>No Employee Found</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div style={{ marginLeft: "55%" }}>
        {Object.entries(PaymentType).map(([key, value], ind) => (
          <div className="RegisForm_1" key={ind}>
            <label>
              {key}
              <span>:</span>
            </label>
            <span>{parseFloat(value).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default PharmacyWiseBillReport
