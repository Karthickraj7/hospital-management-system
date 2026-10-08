import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';

const ForPrintClosingReport = ({
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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Closing_Report',
  });

  // Calculate department totals
  useEffect(() => {
    const calculateDepartmentTotals = () => {
      const totals = {};
      
      // Process OP Services
      if (OPServicesclosing?.services) {
        OPServicesclosing.services
          .filter(item => item.Itemstatus === 'Paid' || item.Itemstatus === 'Refunded')
          .forEach(item => {
            const serviceType = item.Service_Type || 'UNKNOWN';
            const amount = parseFloat(item.PaidAmount || 0);
            
            if (serviceType === 'RADIOLOGY') {
              // For radiology, break down by sub-department
              const radiologyDept = item.RadiologyDept || 'Other Radiology';
              const deptKey = `RADIOLOGY - ${radiologyDept}`;
              totals[deptKey] = (totals[deptKey] || 0) + amount;
            } else {
              totals[serviceType] = (totals[serviceType] || 0) + amount;
            }
          });
      }
      
      // Process IP Services
      if (IPServicesclosing?.services) {
        IPServicesclosing.services
          .filter(item => item.Itemstatus === 'Paid')
          .forEach(item => {
            const serviceType = item.Service_Type || 'UNKNOWN';
            const amount = parseFloat(item.PaidAmount || 0);
            
            if (serviceType === 'RADIOLOGY') {
              // For radiology, break down by sub-department
              const radiologyDept = item.RadiologyDept || 'Other Radiology';
              const deptKey = `RADIOLOGY - ${radiologyDept}`;
              totals[deptKey] = (totals[deptKey] || 0) + amount;
            } else {
              totals[serviceType] = (totals[serviceType] || 0) + amount;
            }
          });
      }
      
      setDepartmentTotals(totals);
    };
    
    calculateDepartmentTotals();
  }, [OPServicesclosing, IPServicesclosing]);

  // Calculate net amount with discounts properly subtracted and Outstanding Collection as revenue
  useEffect(() => {
    const calculateNetAmount = () => {
      // OP Services Total (only Paid items)
      const opServicesTotal = OPServicesclosing?.services
        ? OPServicesclosing.services
            .reduce((sum, item) => sum + parseFloat(item.PaidAmount || 0), 0)
        : 0;
      // OP Discounts Total
      const opDiscountsTotal = OPDiscountclosing?.grand_total_discount
        ? parseFloat(OPDiscountclosing.grand_total_discount) || 0
        : 0;
      // IP Services Total
      const ipServicesTotal = IPServicesclosing?.services
        ? IPServicesclosing.services
            .reduce((sum, item) => sum + parseFloat(item.PaidAmount || 0), 0)
        : 0;
      // IP Discounts Total
      const ipDiscountsTotal = IPDiscountclosing?.grand_total_discount
        ? parseFloat(IPDiscountclosing.grand_total_discount) || 0
        : 0;
      // Advances Total
      const advancesTotal = Advanceclosing && Array.isArray(Advanceclosing)
        ? Advanceclosing.reduce((sum, advance) => sum + parseFloat(advance.AdvanceAmount || 0), 0)
        : 0;
      // IP Final Bill Cash
      const ipFinalBillCash = FinalBillDetails && Array.isArray(FinalBillDetails)
        ? FinalBillDetails
            .filter(bill => bill.BillStatus === "Cash")
            .reduce((sum, bill) => sum + parseFloat(bill.Paidamt || 0), 0)
        : 0;
      // IP Final Bill Refund
      const ipFinalBillRefund = FinalBillDetails && Array.isArray(FinalBillDetails)
        ? FinalBillDetails
            .filter(bill => bill.BillStatus === "Refund")
            .reduce((sum, bill) => sum + parseFloat(bill.Refundamt || 0), 0)
        : 0;
      // Billing Refunds
      const billingRefunds = Refundclosing?.grand_total
        ? parseFloat(Refundclosing.grand_total) || 0
        : 0;
      // Advance Refunds
      const advanceRefunds = AdvanceRefundclosing && Array.isArray(AdvanceRefundclosing)
        ? AdvanceRefundclosing.reduce((sum, refund) => sum + parseFloat(refund.Refundamt || 0), 0)
        : 0;
      // Outstanding Collection Total (added as revenue)
      const outstandingCollectionTotal = Outstandingcollectiondatas && Array.isArray(Outstandingcollectiondatas)
        ? Outstandingcollectiondatas.reduce((sum, item) => sum + parseFloat(item.Paid_Amount || 0), 0)
        : 0;
      
      // Calculate total revenue before discounts (including Outstanding Collection)
      const totalRevenue = opServicesTotal + ipServicesTotal + advancesTotal + ipFinalBillCash + outstandingCollectionTotal;
      
      // Calculate total discounts
      const totalDiscounts = opDiscountsTotal + ipDiscountsTotal;
      
      // Calculate net amount using the corrected formula
      const net = (totalRevenue - totalDiscounts) - 
                 (ipFinalBillRefund + billingRefunds + advanceRefunds);
      
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
    calculateNetAmount();
  }, [
    OPServicesclosing,
    OPDiscountclosing,
    IPServicesclosing,
    IPDiscountclosing,
    Advanceclosing,
    AdvanceRefundclosing,
    FinalBillDetails,
    Refundclosing,
    Outstandingcollectiondatas
  ]);

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
          .payment-summary-table { width: 100%; border-collapse: collapse; }
          .payment-summary-table th { background-color: #f0f0f0; font-weight: bold; border: 1px solid #000; padding: 4px; }
          .payment-summary-table td { border: 1px solid #ddd; padding: 4px; }
          .department-summary-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .department-summary-table th { background-color: #f0f0f0; font-weight: bold; border: 1px solid #000; padding: 4px; }
          .department-summary-table td { border: 1px solid #ddd; padding: 4px; }
          .summary-row { font-weight: bold; background-color: #f5f5f5; }
          .total-row { font-weight: bold; background-color: #e0e0e0; }
          .section-header { background-color: #e0e0e0; font-weight: bold; }
          .negative-amount { color: red; }
        `}</style>
        
        <div className="report-header">
          <h2>KARUNA MEDICAL COLLEGE HOSPITAL</h2>
          <h3>Vilayodi, Chittur, Palakkad</h3>
          <p>{getDateRangeText()}</p>
        </div>
        
        {/* OP Services Section */}
        {(OPServicesclosing?.services && OPServicesclosing.services.length > 0) && (
          <>
            <h3>OP Services</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Patient Name</th>
                  <th>Service Name</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {OPServicesclosing.services
                  .filter(item => item.Itemstatus === 'Paid' || item.Itemstatus === 'Refunded')
                  .map((item, index) => (
                    <tr key={`op-${index}`}>
                      <td>{index + 1}</td>
                      <td>{item.PatientId}</td>
                      <td>{item.OPDate}</td>
                      <td>{item.Invoiveno}</td>
                      <td>{item.Patient_Name}</td>
                      <td>{item.ServiceName}</td>
                      <td style={{ textAlign: 'right' }}>{parseFloat(item.PaidAmount || 0).toFixed(2)}</td>
                      <td>{item.PaymentMethod}</td>
                    </tr>
                  ))}
                <tr className="summary-row">
                  <td colSpan="6" style={{ textAlign: 'right' }}>OP Services Total:</td>
                  <td style={{ textAlign: 'right' }}>{OPServicesclosing.grand_total?.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        
        {/* OP Discounts Section */}
        {(OPDiscountclosing?.discounts && OPDiscountclosing.discounts.length > 0) && (
          <>
            <h3>OP Discounts</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Patient Name</th>
                  <th>Discount Amount</th>
                </tr>
              </thead>
              <tbody>
                {OPDiscountclosing.discounts.map((discount, index) => (
                  <tr key={`op-discount-${index}`}>
                    <td>{index + 1}</td>
                    <td>{discount.PatientId}</td>
                    <td>{discount.BillDate}</td>
                    <td>{discount.InvoiceNo}</td>
                    <td>{discount.Patient_Name}</td>
                    <td style={{ textAlign: 'right', color: 'red' }}>{parseFloat(discount.Discount_Amount || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td colSpan="5" style={{ textAlign: 'right' }}>OP Discounts Total:</td>
                  <td style={{ textAlign: 'right', color: 'red' }}>{OPDiscountclosing.grand_total_discount?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        
        {/* IP Services Section */}
        {(IPServicesclosing?.services && IPServicesclosing.services.length > 0) && (
          <>
            <h3>IP Services</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Patient Name</th>
                  <th>Service Name</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {IPServicesclosing.services
                  .filter(item => item.Itemstatus === 'Paid')
                  .map((item, index) => (
                    <tr key={`ip-${index}`}>
                      <td>{index + 1}</td>
                      <td>{item.PatientId}</td>
                      <td>{item.IPDate}</td>
                      <td>{item.Invoiveno}</td>
                      <td>{item.Patient_Name}</td>
                      <td>{item.ServiceName}</td>
                      <td style={{ textAlign: 'right' }}>{parseFloat(item.PaidAmount || 0).toFixed(2)}</td>
                      <td>{item.PaymentMethod}</td>
                    </tr>
                  ))}
                <tr className="summary-row">
                  <td colSpan="6" style={{ textAlign: 'right' }}>IP Services Total:</td>
                  <td style={{ textAlign: 'right' }}>{IPServicesclosing.grand_total?.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        
        {/* IP Discounts Section */}
        {(IPDiscountclosing?.discounts && IPDiscountclosing.discounts.length > 0) && (
          <>
            <h3>IP Discounts</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Patient Name</th>
                  <th>Discount Amount</th>
                </tr>
              </thead>
              <tbody>
                {IPDiscountclosing.discounts.map((discount, index) => (
                  <tr key={`ip-discount-${index}`}>
                    <td>{index + 1}</td>
                    <td>{discount.PatientId}</td>
                    <td>{discount.BillDate}</td>
                    <td>{discount.InvoiceNo}</td>
                    <td>{discount.Patient_Name}</td>
                    <td style={{ textAlign: 'right', color: 'red' }}>{parseFloat(discount.Discount_Amount || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td colSpan="5" style={{ textAlign: 'right' }}>IP Discounts Total:</td>
                  <td style={{ textAlign: 'right', color: 'red' }}>{IPDiscountclosing.grand_total_discount?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        
        {/* Advances Section */}
        {(Advanceclosing && Advanceclosing.length > 0) && (
          <>
            <h3>Advances Collected</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Voucher No</th>
                  <th>Patient Name</th>
                  <th>Advance Amount</th>
                </tr>
              </thead>
              <tbody>
                {Advanceclosing.map((advance, index) => (
                  <tr key={`advance-${index}`}>
                    <td>{index + 1}</td>
                    <td>{advance.PatientId}</td>
                    <td>{advance.AdvDate}</td>
                    <td>{advance.Voucher_Number}</td>
                    <td>{advance.PatientName}</td>
                    <td style={{ textAlign: 'right' }}>{parseFloat(advance.AdvanceAmount || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td colSpan="5" style={{ textAlign: 'right' }}>Advances Total:</td>
                  <td style={{ textAlign: 'right' }}>
                    {Advanceclosing.reduce((sum, item) => sum + parseFloat(item.AdvanceAmount || 0), 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        
        {/* IP Final Bill Section */}
        {(FinalBillDetails && FinalBillDetails.length > 0) && (
          <>
            <h3>IP Final Bill Details</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Patient Name</th>
                  <th>Paid Amount</th>
                  <th>Refund Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {FinalBillDetails.map((bill, index) => (
                  <tr key={`final-bill-${index}`}>
                    <td>{index + 1}</td>
                    <td>{bill.Patientid}</td>
                    <td>{bill.FBilldate}</td>
                    <td>{bill.FBillNo}</td>
                    <td>{bill.Patientname}</td>
                    <td style={{ textAlign: 'right' }}>{parseFloat(bill.Paidamt || 0).toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: bill.BillStatus === 'Refund' ? 'red' : 'inherit' }}>
                      {parseFloat(bill.Refundamt || 0).toFixed(2)}
                    </td>
                    <td>{bill.BillStatus}</td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td colSpan="5" style={{ textAlign: 'right' }}>IP Final Bill Cash Total:</td>
                  <td style={{ textAlign: 'right' }}>
                    {FinalBillDetails
                      .filter(bill => bill.BillStatus === "Cash")
                      .reduce((sum, bill) => sum + parseFloat(bill.Paidamt || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td colSpan="2"></td>
                </tr>
                <tr className="summary-row">
                  <td colSpan="5" style={{ textAlign: 'right' }}>IP Final Bill Refund Total:</td>
                  <td style={{ textAlign: 'right', color: 'red' }}>
                    {FinalBillDetails
                      .filter(bill => bill.BillStatus === "Refund")
                      .reduce((sum, bill) => sum + parseFloat(bill.Refundamt || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {/* Outstanding Collection Section - Added after IP Final Bill */}
        {(Outstandingcollectiondatas && Outstandingcollectiondatas.length > 0) && (
          <>
            <h3>Outstanding Collections</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Patient Name</th>
                  <th>Paid Amount</th>
                  {/* <th>Payment Method</th> */}
                </tr>
              </thead>
              <tbody>
                {Outstandingcollectiondatas.map((item, index) => (
                  <tr key={`outstanding-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.Patient_Id}</td>
                    <td>{item.Billing_Date}</td>
                    <td>{item.Billing_Invoice_No}</td>
                    <td>{item.Patient_Name}</td>
                    <td style={{ textAlign: 'right' }}>{parseFloat(item.Paid_Amount || 0).toFixed(2)}</td>
                    {/* <td>{item.PaymentMethod}</td> */}
                  </tr>
                ))}
                <tr className="summary-row">
                  <td colSpan="5" style={{ textAlign: 'right' }}>Outstanding Collections Total:</td>
                  <td style={{ textAlign: 'right' }}>
                    {Outstandingcollectiondatas.reduce((sum, item) => sum + parseFloat(item.Paid_Amount || 0), 0).toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        
        {/* Billing Refunds Section */}
        {(Refundclosing?.refunds && Refundclosing.refunds.length > 0) && (
          <>
            <h3>Billing Refunds</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Voucher No</th>
                  <th>Patient Name</th>
                  <th>Refund Amount</th>
                </tr>
              </thead>
              <tbody>
                {Refundclosing.refunds.map((refund, index) => (
                  <tr key={`refund-${index}`}>
                    <td>{index + 1}</td>
                    <td>{refund.PatientId}</td>
                    <td>{refund.BillDate}</td>
                    <td>{refund.VoucherNumber}</td>
                    <td>{refund.Patient_Name}</td>
                    <td style={{ textAlign: 'right', color: 'red' }}>{parseFloat(refund.PaidAmount || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td colSpan="5" style={{ textAlign: 'right' }}>Billing Refunds Total:</td>
                  <td style={{ textAlign: 'right', color: 'red' }}>{Refundclosing.grand_total?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        
        {/* Advance Refunds Section */}
        {(AdvanceRefundclosing && AdvanceRefundclosing.length > 0) && (
          <>
            <h3>Advance Refunds</h3>
            <table className="services-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient ID</th>
                  <th>Date</th>
                  <th>Refund Voucher</th>
                  <th>Patient Name</th>
                  <th>Refund Amount</th>
                </tr>
              </thead>
              <tbody>
                {AdvanceRefundclosing.map((refund, index) => (
                  <tr key={`advance-refund-${index}`}>
                    <td>{index + 1}</td>
                    <td>{refund.PatientId}</td>
                    <td>{refund.AdvDate}</td>
                    <td>{refund.Refundvoucher}</td>
                    <td>{refund.PatientName}</td>
                    <td style={{ textAlign: 'right', color: 'red' }}>{parseFloat(refund.Refundamt || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td colSpan="5" style={{ textAlign: 'right' }}>Advance Refunds Total:</td>
                  <td style={{ textAlign: 'right', color: 'red' }}>
                    {AdvanceRefundclosing.reduce((sum, item) => sum + parseFloat(item.Refundamt || 0), 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {/* Department Wise Summary */}
        {Object.keys(departmentTotals).length > 0 && (
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
                              textAlign: 'left',
                              fontWeight: dept.includes('RADIOLOGY -') ? 'normal' : 'bold',
                              paddingLeft: dept.includes('RADIOLOGY -') ? '30px' : '8px'
                            }}>
                              {dept}
                            </td>
                            <td style={{ 
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

        {/* Calculation Summary - Updated to include Outstanding Collection */}
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #000' }}>
          <h3>Calculation Summary</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>OP Services Total:</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  {OPServicesclosing?.grand_total?.toFixed(2) || '0.00'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>IP Services Total:</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  {IPServicesclosing?.grand_total?.toFixed(2) || '0.00'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Advances Total:</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  {Advanceclosing && Array.isArray(Advanceclosing)
                    ? Advanceclosing.reduce((sum, item) => sum + parseFloat(item.AdvanceAmount || 0), 0).toFixed(2)
                    : '0.00'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>IP Final Bill Cash:</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  {FinalBillDetails && Array.isArray(FinalBillDetails)
                    ? FinalBillDetails
                        .filter(bill => bill.BillStatus === "Cash")
                        .reduce((sum, bill) => sum + parseFloat(bill.Paidamt || 0), 0)
                        .toFixed(2)
                    : '0.00'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Outstanding Collections:</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>
                  {Outstandingcollectiondatas && Array.isArray(Outstandingcollectiondatas)
                    ? Outstandingcollectiondatas.reduce((sum, item) => sum + parseFloat(item.Paid_Amount || 0), 0).toFixed(2)
                    : '0.00'}
                </td>
              </tr>
              
              {/* Discount Information - Added Section */}
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>OP Discounts:</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'red' }}>
                  {OPDiscountclosing.grand_total_discount?.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>IP Discounts:</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'red' }}>
                  {IPDiscountclosing.grand_total_discount?.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>IP Final Bill Discounts:</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'red' }}>
                  {FinalBillDetails && Array.isArray(FinalBillDetails)
                    ? FinalBillDetails
                        .filter(bill => bill.BillStatus === "Cash")
                        .reduce((sum, bill) => sum + parseFloat(bill.Discount || 0), 0)
                        .toFixed(2)
                    : '0.00'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Total Discounts:</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'red', borderBottom: '1px solid #ccc' }}>
                  {(parseFloat(OPDiscountclosing?.grand_total_discount || 0) + 
                   parseFloat(IPDiscountclosing?.grand_total_discount || 0) +
                  (FinalBillDetails && Array.isArray(FinalBillDetails)
                    ? FinalBillDetails
                        .filter(bill => bill.BillStatus === "Cash")
                        .reduce((sum, bill) => sum + parseFloat(bill.Discount || 0), 0)
                    : 0)).toFixed(2)}
                </td>
              </tr>
              
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Subtotal (Revenue):</td>
                <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #000' }}>
                  {(parseFloat(OPServicesclosing?.grand_total || 0) + 
                   parseFloat(IPServicesclosing?.grand_total || 0) +
                  (Advanceclosing && Array.isArray(Advanceclosing)
                    ? Advanceclosing.reduce((sum, item) => sum + parseFloat(item.AdvanceAmount || 0), 0)
                    : 0) +
                  (FinalBillDetails && Array.isArray(FinalBillDetails)
                    ? FinalBillDetails
                        .filter(bill => bill.BillStatus === "Cash")
                        .reduce((sum, bill) => sum + parseFloat(bill.Paidamt || 0), 0)
                    : 0) +
                  (Outstandingcollectiondatas && Array.isArray(Outstandingcollectiondatas)
                    ? Outstandingcollectiondatas.reduce((sum, item) => sum + parseFloat(item.Paid_Amount || 0), 0)
                    : 0) -
                  (parseFloat(OPDiscountclosing?.grand_total_discount || 0) + 
                   parseFloat(IPDiscountclosing?.grand_total_discount || 0) +
                  (FinalBillDetails && Array.isArray(FinalBillDetails)
                    ? FinalBillDetails
                        .filter(bill => bill.BillStatus === "Cash")
                        .reduce((sum, bill) => sum + parseFloat(bill.Discount || 0), 0)
                    : 0))).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>IP Final Bill Refunds:</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'red' }}>
                  {FinalBillDetails && Array.isArray(FinalBillDetails)
                    ? FinalBillDetails
                        .filter(bill => bill.BillStatus === "Refund")
                        .reduce((sum, bill) => sum + parseFloat(bill.Refundamt || 0), 0)
                        .toFixed(2)
                    : '0.00'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Billing Refunds:</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'red' }}>
                  {Refundclosing?.grand_total?.toFixed(2) || '0.00'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Advance Refunds:</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'red' }}>
                  {AdvanceRefundclosing && Array.isArray(AdvanceRefundclosing)
                    ? AdvanceRefundclosing.reduce((sum, refund) => sum + parseFloat(refund.Refundamt || 0), 0).toFixed(2)
                    : '0.00'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Subtotal (Deductions):</td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'red', borderBottom: '1px solid #000' }}>
                  {((FinalBillDetails && Array.isArray(FinalBillDetails)
                    ? FinalBillDetails
                        .filter(bill => bill.BillStatus === "Refund")
                        .reduce((sum, bill) => sum + parseFloat(bill.Refundamt || 0), 0)
                    : 0) + 
                  parseFloat(Refundclosing?.grand_total || 0) +
                  (AdvanceRefundclosing && Array.isArray(AdvanceRefundclosing)
                    ? AdvanceRefundclosing.reduce((sum, refund) => sum + parseFloat(refund.Refundamt || 0), 0)
                    : 0)).toFixed(2)}
                </td>
              </tr>
              <tr style={{ fontSize: '16px', fontWeight: 'bold' }}>
                <td style={{ padding: '12px' }}>NET AMOUNT:</td>
                <td style={{ padding: '12px', textAlign: 'right', borderTop: '2px solid #000' }}>
                  {netAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Summary Section (added to display calculated values) */}
        <div className="payment-summary">
          <h3 style={{ marginTop: '10px' }}>Net Amount: {netAmount.toFixed(2)}</h3>
        </div>

      </div>
    </div>
  );
};

export default ForPrintClosingReport;





