import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';

const ForPrintClosingSummary = ({
  OPServicesclosing,
  IPServicesclosing,
  OPDiscountclosing,
  IPDiscountclosing,
  Advanceclosing,
  AdvanceRefundclosing,
  FinalBillDetails,
  Refundclosing,
  searchOptions,
  Outstandingcollectiondatas,
  onClose
}) => {
  const componentRef = useRef();
  const [netAmount, setNetAmount] = useState(0);
  const [paymentSummary, setPaymentSummary] = useState({
    cash: 0,
    upi: 0,
    card: 0,
    total: 0
  });
  const [departmentTotals, setDepartmentTotals] = useState({});
  const [comprehensiveSummary, setComprehensiveSummary] = useState({});

  console.log(comprehensiveSummary,'comprehensiveSummary')

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Closing_Report',
  });

  // Calculate comprehensive summary including all sections
  useEffect(() => {
    const calculateComprehensiveSummary = () => {
      const summary = {
        // Revenue Sections
        opServices: 0,
        ipServices: 0,
        advances: 0,
        finalBillCash: 0,
        outstandingCollections: 0, // Added Outstanding Collections
        
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

      // Outstanding Collections - Added this section
      if (Outstandingcollectiondatas && Array.isArray(Outstandingcollectiondatas)) {
        summary.outstandingCollections = Outstandingcollectiondatas.reduce((sum, item) => 
          sum + parseFloat(item.Paid_Amount || 0), 0);
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
    Refundclosing,
    Outstandingcollectiondatas // Added to dependencies
  ]);

  // Calculate net amount with discounts properly subtracted
  useEffect(() => {
    const calculateNetAmount = () => {
      const totalRevenue = comprehensiveSummary.opServices + 
                          comprehensiveSummary.ipServices + 
                          comprehensiveSummary.advances + 
                          comprehensiveSummary.finalBillCash +
                          comprehensiveSummary.outstandingCollections; // Added Outstanding Collections
      
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }
    return dateString;
  };

  // Get date range text
  const getDateRangeText = () => {
    if (searchOptions.DateType === "Current" && searchOptions.CurrentDate) {
      return `Report Date: ${formatDate(searchOptions.CurrentDate)}`;
    } else if (searchOptions.DateType === "Customize" && searchOptions.FromDate && searchOptions.ToDate) {
      return `Report From: ${formatDate(searchOptions.FromDate)} To: ${formatDate(searchOptions.ToDate)}`;
    }
    return "Date range not specified";
  };

  return (
    <div className="closing-report-container">
      {/* Print and Close Buttons */}
      <div style={{ marginBottom: '15px', textAlign: 'right' }}>
        <button 
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '10px'
          }}
        >
          Print Report
        </button>
        <button 
          onClick={onClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Close
        </button>
      </div>
      
      <div ref={componentRef} style={{ fontFamily: 'Arial, sans-serif', padding: '10px', fontSize: '11px' }}>
        <style>{`
          @media print {
            body { margin: 0; padding: 0; }
            table { page-break-inside: auto; font-size: 10px; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            .payment-summary { page-break-before: avoid; page-break-inside: avoid; margin-top: 15px; }
            .comprehensive-summary { page-break-inside: avoid; margin-top: 15px; }
            .department-summary { page-break-inside: avoid; margin-top: 15px; }
            .no-print { display: none; }
            .report-header { margin-bottom: 10px; padding-bottom: 5px; }
            .report-header h2 { font-size: 18px; }
            .report-header h3 { font-size: 14px; }
            .services-table { margin-bottom: 10px; }
            .services-table th, .services-table td { padding: 3px; }
            h3 { margin: 8px 0 5px 0; font-size: 12px; }
          }
          .closing-report-container { max-width: 100%; overflow-x: auto; }
          .report-header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .report-header h2 { margin: 0; font-size: 20px; font-weight: bold; }
          .report-header h3 { margin: 5px 0; font-size: 16px; font-weight: 600; }
          .report-header p { margin: 5px 0; font-size: 14px; }
          .services-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
          .services-table th { background-color: #f0f0f0; font-weight: bold; border: 1px solid #000; padding: 4px; }
          .services-table td { border: 1px solid #ddd; padding: 4px; }
          .comprehensive-summary-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .comprehensive-summary-table th { background-color: #f0f0f0; font-weight: bold; border: 1px solid #000; padding: 4px; }
          .comprehensive-summary-table td { border: 1px solid #ddd; padding: 4px; }
          .department-summary-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .department-summary-table th { background-color: #f0f0f0; font-weight: bold; border: 1px solid #000; padding: 4px; }
          .department-summary-table td { border: 1px solid #ddd; padding: 4px; }
          .summary-row { font-weight: bold; background-color: #f5f5f5; }
          .total-row { font-weight: bold; background-color: #e0e0e0; }
          .section-header { background-color: #e0e0e0; font-weight: bold; }
          .revenue-amount { color: green; }
          .deduction-amount { color: red; }
          .main-total { font-size: 14px; background-color: #d4edda; }
        `}</style>
        
        <div className="report-header">
          <h2>KARUNA MEDICAL COLLEGE HOSPITAL</h2>
          <h3>Vilayodi, Chittur, Palakkad</h3>
          <p>{getDateRangeText()}</p>
        </div>

        {/* Department Wise Summary */}
        {comprehensiveSummary.departments && Object.keys(comprehensiveSummary.departments).length > 0 && (
          <div className="department-summary">
            <h3>Department Wise Summary</h3>
            <table className="department-summary-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', width: '70%' }}>Department</th>
                  <th style={{ textAlign: 'right', width: '30%' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Group all services with special handling for specific departments
                  const departmentGroups = {};
                  let grandTotal = 0;
                  
                  // Process all services
                  const processServices = (services) => {
                    services.forEach(service => {
                      const serviceType = service.Service_Type || 'UNKNOWN';
                      const serviceName = service.ServiceName || 'UNKNOWN';
                      const amount = parseFloat(service.PaidAmount || 0);
                      
                      // Initialize department group if not exists
                      if (!departmentGroups[serviceType]) {
                        departmentGroups[serviceType] = {
                          total: 0,
                          subGroups: {}
                        };
                      }
                      
                      // Add to department total
                      departmentGroups[serviceType].total += amount;
                      
                      // Special grouping logic for specific departments
                      let subGroupKey;
                      
                      if (serviceType === 'RADIOLOGY') {
                        // Radiology: group by RadiologyDept
                        subGroupKey = service.RadiologyDept || 'OTHER RADIOLOGY';
                      } else if (serviceType === 'LABORATORY') {
                        // Laboratory: group by LabCategory or ServiceName
                        subGroupKey = service.LabCategory || serviceName;
                      } else {
                        // Default: group by ServiceName
                        subGroupKey = serviceName;
                      }
                      
                      // Add to sub-group
                      if (!departmentGroups[serviceType].subGroups[subGroupKey]) {
                        departmentGroups[serviceType].subGroups[subGroupKey] = 0;
                      }
                      departmentGroups[serviceType].subGroups[subGroupKey] += amount;
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
                      item.Itemstatus === 'Paid' || item.Itemstatus === 'Refunded'
                    ));
                  }
                  
                  // Sort departments alphabetically
                  const sortedDepartments = Object.keys(departmentGroups).sort();
                  
                  return (
                    <>
                      {sortedDepartments.map(dept => {
                        const deptData = departmentGroups[dept];
                        if (deptData.total > 0) {
                          grandTotal += deptData.total;
                          
                          // Sort sub-groups alphabetically
                          const sortedSubGroups = Object.keys(deptData.subGroups).sort();
                          
                          return (
                            <React.Fragment key={dept}>
                              {/* Department Header */}
                              <tr className="section-header">
                                <td colSpan="2" style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                  {dept}
                                </td>
                              </tr>
                              
                              {/* Individual Sub-groups */}
                              {sortedSubGroups.map(subGroup => (
                                <tr key={`${dept}-${subGroup}`}>
                                  <td style={{ 
                                    textAlign: 'left',
                                    paddingLeft: '30px',
                                    fontStyle: 'italic',
                                    fontSize: '12px'
                                  }}>
                                    {subGroup}
                                  </td>
                                  <td style={{ textAlign: 'right', fontSize: '12px' }}>
                                    {deptData.subGroups[subGroup].toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                              
                              {/* Department Total */}
                              <tr className="summary-row" style={{ backgroundColor: '#e9e9e9' }}>
                                <td style={{ 
                                  textAlign: 'right', 
                                  paddingRight: '20px',
                                  fontWeight: 'bold',
                                  fontSize: '13px'
                                }}>
                                  {dept} Total:
                                </td>
                                <td style={{ 
                                  textAlign: 'right', 
                                  fontWeight: 'bold',
                                  fontSize: '13px'
                                }}>
                                  {deptData.total.toFixed(2)}
                                </td>
                              </tr>
                              
                              {/* Spacer row between departments */}
                              <tr style={{ height: '8px' }}>
                                <td colSpan="2" style={{ backgroundColor: 'transparent' }}></td>
                              </tr>
                            </React.Fragment>
                          );
                        }
                        return null;
                      })}
                      
                      {/* Grand Total Row */}
                      <tr style={{ 
                        borderTop: '2px solid #000', 
                        fontWeight: 'bold', 
                        backgroundColor: '#d4d4d4',
                        fontSize: '14px'
                      }}>
                        <td style={{ textAlign: 'left' }}>
                          GRAND TOTAL
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {grandTotal.toFixed(2)}
                        </td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
        )}




        {/* Comprehensive Financial Summary - Updated to include Outstanding Collections */}
        <div className="comprehensive-summary">
          <h3>Comprehensive Financial Summary</h3>
          <table className="comprehensive-summary-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '60%' }}>Category</th>
                <th style={{ textAlign: 'right', width: '40%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue Section */}
              <tr className="section-header">
                <td colSpan="2">REVENUE</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px' }}>OP Services</td>
                <td style={{ textAlign: 'right' }}>{comprehensiveSummary.opServices?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px' }}>IP Services</td>
                <td style={{ textAlign: 'right' }}>{comprehensiveSummary.ipServices?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px' }}>Advances Collected</td>
                <td style={{ textAlign: 'right' }}>{comprehensiveSummary.advances?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px' }}>IP Final Bill Cash</td>
                <td style={{ textAlign: 'right' }}>{comprehensiveSummary.finalBillCash?.toFixed(2) || '0.00'}</td>
              </tr>
              {/* Outstanding Collections - Added this row */}
              <tr>
                <td style={{ paddingLeft: '20px' }}>Outstanding Collections</td>
                <td style={{ textAlign: 'right' }}>{comprehensiveSummary.outstandingCollections?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr className="summary-row">
                <td>Total Revenue</td>
                <td style={{ textAlign: 'right' }}>
                  {(comprehensiveSummary.opServices + 
                    comprehensiveSummary.ipServices + 
                    comprehensiveSummary.advances + 
                    comprehensiveSummary.finalBillCash +
                    comprehensiveSummary.outstandingCollections).toFixed(2)} {/* Added Outstanding Collections */}
                </td>
              </tr>

              {/* Discounts Section */}
              <tr className="section-header">
                <td colSpan="2">DISCOUNTS</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px' }}>OP Discounts</td>
                <td style={{ textAlign: 'right', color: 'red' }}>{comprehensiveSummary.opDiscounts?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px' }}>IP Discounts</td>
                <td style={{ textAlign: 'right', color: 'red' }}>{comprehensiveSummary.ipDiscounts?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr className="summary-row">
                <td>Total Discounts</td>
                <td style={{ textAlign: 'right', color: 'red' }}>
                  {(comprehensiveSummary.opDiscounts + comprehensiveSummary.ipDiscounts).toFixed(2)}
                </td>
              </tr>

              {/* Net Revenue */}
              <tr className="main-total">
                <td>NET REVENUE (After Discounts)</td>
                <td style={{ textAlign: 'right' }}>
                  {((comprehensiveSummary.opServices + 
                    comprehensiveSummary.ipServices + 
                    comprehensiveSummary.advances + 
                    comprehensiveSummary.finalBillCash +
                    comprehensiveSummary.outstandingCollections) - // Added Outstanding Collections
                   (comprehensiveSummary.opDiscounts + comprehensiveSummary.ipDiscounts)).toFixed(2)}
                </td>
              </tr>

              {/* Deductions Section */}
              <tr className="section-header">
                <td colSpan="2">DEDUCTIONS</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px' }}>IP Final Bill Refunds</td>
                <td style={{ textAlign: 'right', color: 'red' }}>{comprehensiveSummary.finalBillRefunds?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px' }}>Billing Refunds</td>
                <td style={{ textAlign: 'right', color: 'red' }}>{comprehensiveSummary.billingRefunds?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px' }}>Advance Refunds</td>
                <td style={{ textAlign: 'right', color: 'red' }}>{comprehensiveSummary.advanceRefunds?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr className="summary-row">
                <td>Total Deductions</td>
                <td style={{ textAlign: 'right', color: 'red' }}>
                  {(comprehensiveSummary.finalBillRefunds + 
                    comprehensiveSummary.billingRefunds + 
                    comprehensiveSummary.advanceRefunds).toFixed(2)}
                </td>
              </tr>

              {/* Final Net Amount */}
              <tr className="main-total">
                <td>FINAL NET AMOUNT</td>
                <td style={{ textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>
                  {netAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Summary Section */}
        <div className="payment-summary">
          <h3 style={{ marginTop: '10px' }}>Final Net Amount: {netAmount.toFixed(2)}</h3>
        </div>

      </div>
    </div>
  );
};

export default ForPrintClosingSummary;