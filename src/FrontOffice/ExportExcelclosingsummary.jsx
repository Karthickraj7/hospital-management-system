import * as XLSX from 'xlsx';

const exportClosingSummaryReport = (wb, {
  OPServicesclosing,
  IPServicesclosing,
  OPDiscountclosing,
  IPDiscountclosing,
  Advanceclosing,
  AdvanceRefundclosing,
  FinalBillDetails,
  Refundclosing,
  searchOptions
}) => {
  // Calculate comprehensive summary (same logic as in ForPrintClosingSummary)
  const calculateComprehensiveSummary = () => {
    const summary = {
      opServices: 0,
      ipServices: 0,
      advances: 0,
      finalBillCash: 0,
      opDiscounts: 0,
      ipDiscounts: 0,
      finalBillRefunds: 0,
      billingRefunds: 0,
      advanceRefunds: 0,
    };

    // OP Services
    if (OPServicesclosing?.services) {
      summary.opServices = OPServicesclosing.services
        .filter(item => item.Itemstatus === 'Paid' || item.Itemstatus === 'Refunded')
        .reduce((sum, item) => sum + parseFloat(item.PaidAmount || 0), 0);
    }

    // IP Services
    if (IPServicesclosing?.services) {
      summary.ipServices = IPServicesclosing.services
        .filter(item => item.Itemstatus === 'Paid')
        .reduce((sum, item) => sum + parseFloat(item.PaidAmount || 0), 0);
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

    return summary;
  };

  // Calculate department totals
  const calculateDepartmentTotals = () => {
    const departmentTotals = {};
    const radiologyGroups = {};
    const cardiologyServices = {};
    
    const processServices = (services) => {
      services.forEach(service => {
        const serviceType = service.Service_Type || 'UNKNOWN';
        const serviceName = service.ServiceName || 'UNKNOWN';
        const amount = parseFloat(service.PaidAmount || 0);
        
        // Initialize department total
        if (!departmentTotals[serviceType]) {
          departmentTotals[serviceType] = 0;
        }
        departmentTotals[serviceType] += amount;
        
        // Radiology - group by RadiologyDept
        if (serviceType === 'RADIOLOGY') {
          const radiologyDept = service.RadiologyDept || 'OTHER RADIOLOGY';
          if (!radiologyGroups[radiologyDept]) {
            radiologyGroups[radiologyDept] = 0;
          }
          radiologyGroups[radiologyDept] += amount;
        }
        
        // Cardiology - group by ServiceName
        if (serviceType === 'CARDIOLOGY') {
          if (!cardiologyServices[serviceName]) {
            cardiologyServices[serviceName] = 0;
          }
          cardiologyServices[serviceName] += amount;
        }
      });
    };
    
    // Process OP Services
    if (OPServicesclosing?.services) {
      processServices(OPServicesclosing.services.filter(item => 
        item.Itemstatus === 'Paid' || item.Itemstatus === 'Refunded'
      ));
    }
    
    // Process IP Services
    if (IPServicesclosing?.services) {
      processServices(IPServicesclosing.services.filter(item => 
        item.Itemstatus === 'Paid'
      ));
    }

    return { departmentTotals, radiologyGroups, cardiologyServices };
  };

  const comprehensiveSummary = calculateComprehensiveSummary();
  const { departmentTotals, radiologyGroups, cardiologyServices } = calculateDepartmentTotals();

  // Calculate net amount
  const totalRevenue = comprehensiveSummary.opServices + 
                      comprehensiveSummary.ipServices + 
                      comprehensiveSummary.advances + 
                      comprehensiveSummary.finalBillCash;
  
  const totalDiscounts = comprehensiveSummary.opDiscounts + comprehensiveSummary.ipDiscounts;
  
  const totalDeductions = comprehensiveSummary.finalBillRefunds + 
                         comprehensiveSummary.billingRefunds + 
                         comprehensiveSummary.advanceRefunds;
  
  const netAmount = (totalRevenue - totalDiscounts) - totalDeductions;

  // Check if we have data to export
  const hasData = comprehensiveSummary.opServices > 0 || 
                  comprehensiveSummary.ipServices > 0 || 
                  comprehensiveSummary.advances > 0 ||
                  comprehensiveSummary.finalBillCash > 0;

  if (!hasData) {
    alert("No data to export");
    return;
  }

  // Format date range
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }
    return dateString;
  };

  const reportDateRange =
    searchOptions?.DateType === "Current" && searchOptions?.CurrentDate
      ? `Report Date: ${formatDate(searchOptions.CurrentDate)}`
      : searchOptions?.DateType === "Customize" && searchOptions?.FromDate && searchOptions?.ToDate
      ? `Report From: ${formatDate(searchOptions.FromDate)} To: ${formatDate(searchOptions.ToDate)}`
      : "Date range not specified";

  const rows = [];

  // Add header information
  rows.push({ "Category": "KARUNA MEDICAL COLLEGE HOSPITAL" });
  rows.push({ "Category": "Vilayodi, Chittur, Palakkad" });
  rows.push({ "Category": reportDateRange });
  rows.push({}); // Empty row for spacing

  // Comprehensive Financial Summary Section
  rows.push({ "Category": "COMPREHENSIVE FINANCIAL SUMMARY" });
  rows.push({
    "Category": "Category",
    "Amount": "Amount"
  });

  // Revenue Section
  rows.push({ "Category": "REVENUE" });
  rows.push({
    "Category": "  OP Services",
    "Amount": comprehensiveSummary.opServices?.toFixed(2) || '0.00'
  });
  rows.push({
    "Category": "  IP Services",
    "Amount": comprehensiveSummary.ipServices?.toFixed(2) || '0.00'
  });
  rows.push({
    "Category": "  Advances Collected",
    "Amount": comprehensiveSummary.advances?.toFixed(2) || '0.00'
  });
  rows.push({
    "Category": "  IP Final Bill Cash",
    "Amount": comprehensiveSummary.finalBillCash?.toFixed(2) || '0.00'
  });
  rows.push({
    "Category": "Total Revenue",
    "Amount": totalRevenue.toFixed(2)
  });
  rows.push({}); // Empty row

  // Discounts Section
  rows.push({ "Category": "DISCOUNTS" });
  rows.push({
    "Category": "  OP Discounts",
    "Amount": (comprehensiveSummary.opDiscounts * -1).toFixed(2) || '0.00'
  });
  rows.push({
    "Category": "  IP Discounts",
    "Amount": (comprehensiveSummary.ipDiscounts * -1).toFixed(2) || '0.00'
  });
  rows.push({
    "Category": "Total Discounts",
    "Amount": (totalDiscounts * -1).toFixed(2)
  });
  rows.push({}); // Empty row

  // Net Revenue
  rows.push({
    "Category": "NET REVENUE (After Discounts)",
    "Amount": (totalRevenue - totalDiscounts).toFixed(2)
  });
  rows.push({}); // Empty row

  // Deductions Section
  rows.push({ "Category": "DEDUCTIONS" });
  rows.push({
    "Category": "  IP Final Bill Refunds",
    "Amount": (comprehensiveSummary.finalBillRefunds * -1).toFixed(2) || '0.00'
  });
  rows.push({
    "Category": "  Billing Refunds",
    "Amount": (comprehensiveSummary.billingRefunds * -1).toFixed(2) || '0.00'
  });
  rows.push({
    "Category": "  Advance Refunds",
    "Amount": (comprehensiveSummary.advanceRefunds * -1).toFixed(2) || '0.00'
  });
  rows.push({
    "Category": "Total Deductions",
    "Amount": (totalDeductions * -1).toFixed(2)
  });
  rows.push({}); // Empty row

  // Final Net Amount
  rows.push({
    "Category": "FINAL NET AMOUNT",
    "Amount": netAmount.toFixed(2)
  });

  rows.push({}); // Empty row for spacing
  rows.push({}); // Empty row for spacing

  // Department Wise Summary Section
  if (Object.keys(departmentTotals).length > 0) {
    rows.push({ "Category": "DEPARTMENT WISE SUMMARY" });
    rows.push({
      "Category": "Department",
      "Amount": "Total Amount"
    });

    let deptGrandTotal = 0;

    // Cardiology Section
    if (departmentTotals['CARDIOLOGY'] > 0) {
      rows.push({ "Category": "CARDIOLOGY" });
      Object.keys(cardiologyServices)
        .sort()
        .forEach(serviceName => {
          rows.push({
            "Category": `  ${serviceName}`,
            "Amount": cardiologyServices[serviceName].toFixed(2)
          });
          deptGrandTotal += cardiologyServices[serviceName];
        });
      rows.push({
        "Category": "CARDIOLOGY Total:",
        "Amount": departmentTotals['CARDIOLOGY'].toFixed(2)
      });
      rows.push({}); // Empty row
    }

    // Radiology Section
    if (departmentTotals['RADIOLOGY'] > 0) {
      rows.push({ "Category": "RADIOLOGY" });
      Object.keys(radiologyGroups)
        .sort()
        .forEach(radiologyDept => {
          rows.push({
            "Category": `  ${radiologyDept}`,
            "Amount": radiologyGroups[radiologyDept].toFixed(2)
          });
          deptGrandTotal += radiologyGroups[radiologyDept];
        });
      rows.push({
        "Category": "RADIOLOGY Total:",
        "Amount": departmentTotals['RADIOLOGY'].toFixed(2)
      });
      rows.push({}); // Empty row
    }

    // Other Departments
    const otherDepartments = Object.keys(departmentTotals)
      .filter(dept => dept !== 'CARDIOLOGY' && dept !== 'RADIOLOGY')
      .sort();

    if (otherDepartments.length > 0) {
      otherDepartments.forEach(dept => {
        if (departmentTotals[dept] > 0) {
          rows.push({
            "Category": dept,
            "Amount": departmentTotals[dept].toFixed(2)
          });
          deptGrandTotal += departmentTotals[dept];
        }
      });
      rows.push({}); // Empty row
    }

    // Department Grand Total
    rows.push({
      "Category": "DEPARTMENT GRAND TOTAL",
      "Amount": deptGrandTotal.toFixed(2)
    });
  }

  // Create worksheet and add to workbook
  const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });
  
  // Set column widths for better formatting
  const colWidths = [
    { wch: 40 }, // Category column
    { wch: 15 }  // Amount column
  ];
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Closing Summary Report");
};

export default exportClosingSummaryReport;