import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import './DummyBillingPrint.css';
import { useReactToPrint } from 'react-to-print';

function DummyBillingPrint() {
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const componentRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  // State for patient information
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    patientId: '',
    consultant: '',
  });

  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [otherPaymentMethod, setOtherPaymentMethod] = useState('');
  const [receiptDetails, setReceiptDetails] = useState({
    medicalName: '',
    gstNo: '',
    dlNo: '',
    billNo: '',
    billDate: new Date().toISOString().split('T')[0],
    transDetails: '',
    approvedBy: '',
    totalAmountDue: '0.00',
    amountReceived: '0.00',
  });

  // Add state for table rows
  const [tableRows, setTableRows] = useState([
    {
      id: 1,
      sno: 1,
      hsnCode: '',
      productName: '',
      batchNo: '',
      expiryDate: '',
      units: '',
      tax: '',
      mrp: '',
      qty: '',
      netAmount: '',
    },
  ]);

  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: '',
    ClinicGST: '',
    ClinicAddress: '',
    ClinicCity: '',
    ClinicState: '',
    ClinicCode: '',
    ClinicMobileNo: '',
    DrugLicenseNumber: '',
    ClinicMailID: '',
  });

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Hospital_Detials_link`)
      .then((response) => {
        if (response.data) {
          setClinicDetials((prev) => ({
            ...prev,
            ClinicName: response.data.hospitalName,
            ClinicLogo: response.data.hospitalLogo,
          }));
        }
      })
      .catch((error) => {
        console.error(error);
      });

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
            ClinicAddress: addressComponents.join(', '),
            ClinicGST: clinicData.GSTNo || prev.ClinicGST,
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicState: clinicData.State || prev.ClinicState,
            ClinicCode: clinicData.Pincode || prev.ClinicCode,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            DrugLicenseNumber:
              clinicData.DrugLicenseNumber || prev.DrugLicenseNumber,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
          }));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.location, UrlLink]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      console.log('Preparing to print...');
    },
    onAfterPrint: () => {
      console.log('Print complete.');
      setIsPrintButtonVisible(true);
    },
  });

  const triggerPrint = () => {
    setIsPrintButtonVisible(false);
    setTimeout(() => {
      if (componentRef.current) {
        handlePrint();
      } else {
        console.error('Print component reference not found');
        setIsPrintButtonVisible(true);
      }
    }, 500);
  };

  useEffect(() => {
    if (!isPrintButtonVisible) {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
  }, [isPrintButtonVisible]);

  // Handle patient info change
  const handlePatientInfoChange = (field, value) => {
    setPatientInfo({
      ...patientInfo,
      [field]: value,
    });
  };

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value !== 'Others') {
      setOtherPaymentMethod('');
    }
  };

  // Handle receipt details change
  const handleReceiptDetailChange = (field, value) => {
    setReceiptDetails({
      ...receiptDetails,
      [field]: value,
    });
  };

  const addRow = () => {
    const newId =
      tableRows.length > 0 ? tableRows[tableRows.length - 1].id + 1 : 1;
    const newRow = {
      id: newId,
      sno: tableRows.length + 1,
      hsnCode: '',
      productName: '',
      batchNo: '',
      expiryDate: '',
      units: '',
      tax: '',
      mrp: '',
      qty: '',
      netAmount: '',
    };
    setTableRows([...tableRows, newRow]);
  };

  // Delete a row
  const deleteRow = (id) => {
    if (tableRows.length > 1) {
      const updatedRows = tableRows.filter((row) => row.id !== id);
      // Renumber the sno field
      const renumberedRows = updatedRows.map((row, index) => ({
        ...row,
        sno: index + 1,
      }));
      setTableRows(renumberedRows);
    }
  };

  // Handle input changes
  const handleInputChange = (id, field, value) => {
    const updatedRows = tableRows.map((row) => {
      if (row.id === id) {
        let updatedRow = { ...row, [field]: value };

        // Auto-calculate netAmount if both mrp and qty are entered
        if (
          (field === 'mrp' || field === 'qty') &&
          updatedRow.mrp &&
          updatedRow.qty
        ) {
          updatedRow.netAmount = (
            parseFloat(updatedRow.mrp) * parseFloat(updatedRow.qty)
          ).toFixed(2);
        }

        return updatedRow;
      }
      return row;
    });
    setTableRows(updatedRows);
  };

  // Calculate totals
  const calculateTotals = () => {
    let grossTotal = 0;

    tableRows.forEach((row) => {
      if (row.netAmount) {
        grossTotal += parseFloat(row.netAmount);
      }
    });

    const gstAmount = grossTotal * 0.18; // Assuming 18% GST
    const grandTotal = grossTotal + gstAmount;

    return {
      grossTotal: grossTotal.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  };

  const totals = calculateTotals();

  const numberToWords = (number) => {
    let num = parseInt(number.toString().split('.')[0]);

    if (num === 0) {
      return 'Zero';
    }

    const units = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
    ];
    const teens = [
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];

    const convert = (num) => {
      // Check if num is NaN or not a valid number
      if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
        return 'Invalid input';
      }

      if (num === 0) return 'Zero';
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? ' ' + units[num % 10] : '')
        );
      if (num < 1000)
        return units[Math.floor(num / 100)] + ' Hundred ' + convert(num % 100);
      if (num < 1000000)
        return (
          convert(Math.floor(num / 1000)) + ' Thousand ' + convert(num % 1000)
        );
      return (
        convert(Math.floor(num / 1000000)) +
        ' Million ' +
        convert(num % 1000000)
      );
    };

    return convert(num);
  };

  const forPrintPurchaseData = () => {
    return (
      <div ref={componentRef}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <table className="print-table33">
            <thead
              className="print_header"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                height: '150px',
              }}
            >
              <tr>
                <td colSpan="7" style={{ border: 'none' }}>
                  <div
                    className="New_billlling_invoice_head"
                    style={{ alignItems: 'flex-end' }}
                  >
                    <div style={{ width: '50%', textAlign: 'start' }}>
                      <div
                        className="Hospital_name_print_Page_head"
                        style={{ textAlign: 'start' }}
                      ></div>
                      <div className="eifeuwv_plo">
                        {patientInfo.patientName && (
                          <div className="efcwyd_h21tv">
                            <label>
                              Name<span>:</span>
                            </label>
                            <span>{patientInfo.patientName}</span>
                          </div>
                        )}
                         {patientInfo.patientId && (
                          <div className="efcwyd_h21tv">
                            <label>
                            PID<span>:</span>
                            </label>
                            <span>{patientInfo.patientId}</span>
                          </div>
                        )}
                           {patientInfo.consultant && (
                          <div className="efcwyd_h21tv">
                            <label>
                            Consultant<span>:</span>
                            </label>
                            <span>{patientInfo.consultant}</span>
                          </div>
                        )}
                        {/* <div className="efcwyd_h21tv">
                          <label>
                            PID<span>:</span>
                          </label>
                          <span>{patientInfo.patientId}</span>
                        </div> */}
                        {/* <div className="efcwyd_h21tv">
                          <label>
                            Consultant<span>:</span>
                          </label>
                          <span>{patientInfo.consultant}</span>
                        </div> */}
                      </div>
                    </div>

                    <div
                      className="new_billing_logo_con"
                      style={{ width: '50%', textAlign: 'end' }}
                    >
                      <div
                        className="Hospital_name_print_Page_head"
                        style={{ textAlign: 'end' }}
                      >
                        <h2>{receiptDetails.medicalName || 'Medical Name'}</h2>
                        <div className="wedwdw_pl038">
                          <div className="edcksc_ml15">
                            <h5>GST No :</h5>
                            <input value={receiptDetails.gstNo}></input>
                          </div>

                          <div className="edcksc_ml15">
                            <h5>DL No :</h5>
                            <input value={receiptDetails.dlNo}></input>
                          </div>

                          <div className="edcksc_ml15">
                            <h5>Bill No :</h5>
                            <input value={receiptDetails.billNo}></input>
                          </div>

                          <div className="edcksc_ml15">
                            <h5>Bill Date :</h5>
                            <input value={receiptDetails.billDate}></input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <div className="ecfiewhd_dvue7">
                    <div>
                      <h4>CreditPay Receipt</h4>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>
            <br />
            <tbody>
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>HSN Code</th>
                        <th>Product Name</th>
                        <th>Batch No</th>
                        <th>Expiry Date</th>
                        <th>Units</th>
                        <th>Tax</th>

                        <th>MRP</th>
                        <th>Qty</th>
                        <th>Net Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tableRows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.sno}</td>
                          <td>{row.hsnCode}</td>
                          <td>{row.productName}</td>
                          <td>{row.batchNo}</td>
                          <td>{row.expiryDate}</td>
                          <td style={{ textAlign: 'center' }}>{row.units}</td>
                          <td style={{ textAlign: 'center' }}>{row.tax}%</td>

                          <td style={{ textAlign: 'center' }}>{row.mrp}</td>
                          <td style={{ textAlign: 'center' }}>{row.qty}</td>
                          <td style={{ textAlign: 'right' }}>
                            {row.netAmount}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="8"></td>
                        <td>Total Gross Amount</td>
                        <td style={{ textAlign: 'right' }}>
                          {totals.grossTotal}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="8"></td>
                        <td>Total GST Amount</td>
                        <td style={{ textAlign: 'right' }}>
                          {totals.gstAmount}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="8"></td>
                        <td>Grand Total</td>
                        <td style={{ textAlign: 'right' }}>
                          {totals.grandTotal}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="8"></td>
                        <td>Total Paid Amount</td>
                        <td style={{ textAlign: 'right' }}>
                          {receiptDetails.amountReceived}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>

            <div>
              <div colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <label>
                          Received Sum of <span>:</span>
                        </label>
                        <span>
                          {numberToWords(+receiptDetails.amountReceived)}{' '}
                        </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Payment Received in <span>:</span>
                        </label>
                        <span>
                          {paymentMethod === 'Others'
                            ? otherPaymentMethod
                            : paymentMethod}
                        </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Trans Details <span>:</span>
                        </label>
                        <span>{receiptDetails.transDetails}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Total Amount Due <span>:</span>
                        </label>
                        <span>{totals.grandTotal}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Amount Received <span>:</span>
                        </label>
                        <h4>{receiptDetails.amountReceived}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <tfoot className="print_footerr">
              <tr className="jjxcdsjjej_"></tr>

              <tr className="ehdhe_9ikw">
                <td className="shshxhxs_secfooter">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <p className="disclaimer23">
                      This page is created automatically without a signature.
                    </p>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      {isPrintButtonVisible ? (
        <div className="Main_container_app">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <table className="print-table33">
              <thead
                className="print_header"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  height: '150px',
                }}
              >
                <tr>
                  <td colSpan="7" style={{ border: 'none' }}>
                    <div
                      className="New_billlling_invoice_head"
                      style={{ alignItems: 'flex-end' }}
                    >
                      <div style={{ width: '50%', textAlign: 'start' }}>
                        <div
                          className="Hospital_name_print_Page_head"
                          style={{ textAlign: 'start' }}
                        ></div>
                        <div className="eifeuwv_plo">
                          <div className="efcwyd_h21tv">
                            <label>
                              Name<span>:</span>
                            </label>
                            <input
                              type="text"
                              value={patientInfo.patientName}
                              onChange={(e) =>
                                handlePatientInfoChange(
                                  'patientName',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="efcwyd_h21tv">
                            <label>
                              PID<span>:</span>
                            </label>
                            <input
                              type="text"
                              value={patientInfo.patientId}
                              onChange={(e) =>
                                handlePatientInfoChange(
                                  'patientId',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="efcwyd_h21tv">
                            <label>
                              Consultant<span>:</span>
                            </label>
                            <input
                              type="text"
                              value={patientInfo.consultant}
                              onChange={(e) =>
                                handlePatientInfoChange(
                                  'consultant',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className="new_billing_logo_con"
                        style={{ width: '50%', textAlign: 'end' }}
                      >
                        <div
                          className="Hospital_name_print_Page_head"
                          style={{ textAlign: 'end' }}
                        >
                          <div className="wedwdw_pl038">
                            <div className="edcksc_ml15">
                              <input
                                type="text"
                                placeholder="Medical Name"
                                value={receiptDetails.medicalName}
                                onChange={(e) =>
                                  handleReceiptDetailChange(
                                    'medicalName',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="edcksc_ml15">
                              <h5>GST No :</h5>
                              <input
                                type="text"
                                value={receiptDetails.gstNo}
                                onChange={(e) =>
                                  handleReceiptDetailChange(
                                    'gstNo',
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="edcksc_ml15">
                              <h5>DL No :</h5>
                              <input
                                type="text"
                                value={receiptDetails.dlNo}
                                onChange={(e) =>
                                  handleReceiptDetailChange(
                                    'dlNo',
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="edcksc_ml15">
                              <h5>Bill No :</h5>
                              <input
                                type="text"
                                value={receiptDetails.billNo}
                                onChange={(e) =>
                                  handleReceiptDetailChange(
                                    'billNo',
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="edcksc_ml15">
                              <h5>Bill Date : </h5>
                              <input
                                type="date"
                                value={receiptDetails.billDate}
                                onChange={(e) =>
                                  handleReceiptDetailChange(
                                    'billDate',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="ecfiewhd_dvue7">
                    <h4>CreditPay Receipt</h4>
                  </td>
                </tr>
              </thead>
              <br />
              <tbody>
                <tr>
                  <td colSpan="7" className="prin_nnrmll_table">
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>HSN Code</th>
                          <th>Product Name</th>
                          <th>Batch No</th>
                          <th>Expiry Date</th>
                          <th>Units</th>
                          <th>Tax</th>

                          <th>MRP</th>
                          <th>Qty</th>
                          <th>Net Amount</th>
                          <th>
                            <AddCircleIcon
                              style={{ cursor: 'pointer' }}
                              onClick={addRow}
                            />
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {tableRows.map((row) => (
                          <tr key={row.id} className="ewfjef_swcujwsuw">
                            <td>
                              <input value={row.sno} readOnly />
                            </td>
                            <td>
                              <input
                                value={row.hsnCode}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    'hsnCode',
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={row.productName}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    'productName',
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={row.batchNo}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    'batchNo',
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={row.expiryDate}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    'expiryDate',
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={row.units}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    'units',
                                    e.target.value
                                  )
                                }
                                style={{ textAlign: 'center' }}
                              />
                            </td>
                            <td>
                              <input
                                value={row.tax + '%'}
                                onChange={(e) => {
                                  const newValue = e.target.value.replace(
                                    '%',
                                    ''
                                  ); // Remove existing % to prevent duplicates
                                  handleInputChange(row.id, 'tax', newValue);
                                }}
                                style={{ textAlign: 'center' }}
                              />
                            </td>

                            <td>
                              <input
                                type="number"
                                value={row.mrp}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    'mrp',
                                    e.target.value
                                  )
                                }
                                style={{ textAlign: 'center' }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={row.qty}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    'qty',
                                    e.target.value
                                  )
                                }
                                style={{ textAlign: 'center' }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={row.netAmount}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    'netAmount',
                                    e.target.value
                                  )
                                }
                                style={{ textAlign: 'end' }}
                              />
                            </td>
                            <td>
                              <DeleteIcon
                                style={{ cursor: 'pointer' }}
                                onClick={() => deleteRow(row.id)}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="8"></td>
                          <td>Total Gross Amount</td>
                          <td colSpan="2" style={{ textAlign: 'center' }}>
                            {totals.grossTotal}
                          </td>
                        </tr>

                        <tr>
                          <td colSpan="8"></td>
                          <td>Total GST Amount</td>
                          <td colSpan="2" style={{ textAlign: 'center' }}>
                            {totals.gstAmount}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="8"></td>
                          <td>Grand Total</td>
                          <td colSpan="2" style={{ textAlign: 'center' }}>
                            {totals.grandTotal}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="8"></td>
                          <td>Total Paid Amount</td>
                          <td colSpan="2" style={{ textAlign: 'center' }}>
                            <input
                              type="number"
                              value={receiptDetails.amountReceived}
                              onChange={(e) =>
                                handleReceiptDetailChange(
                                  'amountReceived',
                                  e.target.value
                                )
                              }
                              style={{ textAlign: 'center' }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>

              <div>
                <div colSpan="7">
                  <div className="new_billing_invoice_detials">
                    <div className="invoice_detials_total_1">
                      <div className="total_con_bill">
                        <div className="bill_body_new_phar">
                          <label>
                            Received Sum of <span>:</span>
                          </label>
                          <span>
                            {numberToWords(+receiptDetails.amountReceived)}{' '}
                          </span>
                        </div>
                        <div className="bill_body_new_phar bill_body_new_phar_slect">
                          <label>
                            Payment Received in <span>:</span>
                          </label>
                          <select
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                          >
                            <option value="Cash">Cash</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                        {paymentMethod === 'Others' && (
                          <div className="bill_body_new_phar bill_body_new_phar_slect">
                            <label>
                              Others <span>:</span>
                            </label>
                            <input
                              type="text"
                              className="edwd_Isxx"
                              placeholder="Specify payment method"
                              value={otherPaymentMethod}
                              onChange={(e) =>
                                setOtherPaymentMethod(e.target.value)
                              }
                            />
                          </div>
                        )}

                        <div className="bill_body_new_phar">
                          <label>
                            Trans Details <span>:</span>
                          </label>
                          <input
                            type="text"
                            className="edwd_Isxx"
                            value={receiptDetails.transDetails}
                            onChange={(e) =>
                              handleReceiptDetailChange(
                                'transDetails',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <div className="bill_body_new_phar">
                          <label>
                            Total Amount Due <span>:</span>
                          </label>
                          <h4>{totals.grandTotal}</h4>
                        </div>
                        <div className="bill_body_new_phar">
                          <label>
                            Amount Received <span>:</span>
                          </label>
                          <h4>{receiptDetails.amountReceived}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <tfoot className="print_footerr">
                <tr className="jjxcdsjjej_"></tr>

                <tr className="ehdhe_9ikw">
                  <td className="shshxhxs_secfooter">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <p className="disclaimer23">
                        This page is created automatically without a signature.
                      </p>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="Main_container_Btn">
            <button onClick={triggerPrint}>Print</button>
          </div>
        </div>
      ) : (
        forPrintPurchaseData()
      )}
    </>
  );
}

export default DummyBillingPrint;
