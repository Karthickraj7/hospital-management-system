// import React from 'react';
// import { NumberToWords } from "../../../OtherComponent/OtherFunctions";
// import "../GeneralBilling.css";

// const ForPrintData = ({ ClinicDetails, ClinicDetials, SelectedPatient_list, OP_BillingData, RegisterData, BillingData, PostInvoice, RecieptInvoice, SelectDatalist, billAmount, initialState, UserData, handlePrint2, handleClose, componentRef }) => {
//   // Check if specific payment methods exist in billAmount
//   const hasCard = billAmount.some((p) => p.Billpay_method === 'Card');
//   const hasCheque = billAmount.some((p) => p.Billpay_method === 'Cheque');
//   const hasBank = billAmount.some((p) => p.Billpay_method === 'Bank');

//   return (
//     <div ref={componentRef}>
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           minHeight: '100vh',
//         }}
//         id="reactprintcontent"
//       >
//         <table className="print-table33">
//           <thead
//             className="print_header"
//             style={{
//               width: '100%',
//               borderCollapse: 'collapse',
//               height: '150px',
//             }}
//           >
//             <tr>
//               <td colSpan="7" style={{ border: "none" }}>
//                 <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
//                   <div className="new_billing_logo_con">
//                     <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
//                   </div>
//                   <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
//                     <span>{ClinicDetails?.Cname}</span>
//                     <div>
//                       <span>{[ClinicDetials.ClinicAddress].filter((detail) => detail).join(", ")},{[ClinicDetials.ClinicCity, ClinicDetials.ClinicState, ClinicDetials.ClinicCode].filter((detail) => detail).join(", ")}</span>
//                     </div>
//                     <div>{[ClinicDetials.ClinicMobileNo, ClinicDetials.ClinicLandLineNo, ClinicDetials.ClinicMailID].filter((detail) => detail).join(" , ")}</div>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//             <tr>
//               <td
//                 colSpan="7"
//                 style={{
//                   textAlign: 'center',
//                   fontWeight: '600',
//                   color: 'black',
//                   fontSize: '16px',
//                 }}
//               >
//                 Billing Invoice
//               </td>
//             </tr>
//             <tr>
//               <td colSpan="7">
//                 <div className="new_billing_address new_addn_p037">
//                   <div className="new_billing_address_2 new_billing_address_2_new_up">
//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Patient Name <span>:</span>
//                       </label>
//                       <h4>{SelectedPatient_list?.PatientName}</h4>
//                     </div>
//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Patient ID <span>:</span>
//                       </label>
//                       <h4>{SelectedPatient_list?.PatientId}</h4>
//                     </div>
//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Age / Gender <span>:</span>
//                       </label>
//                       <h4>{OP_BillingData?.AgeGender || RegisterData?.AgeGender}</h4>
//                     </div>
//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Patient Mobile No <span>:</span>
//                       </label>
//                       <h4>{SelectedPatient_list?.PhoneNumber}</h4>
//                     </div>

//                   </div>
//                   <div className="new_billing_address_2 new_billing_address_2_new_up">
//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         OP NO <span>:</span>
//                       </label>
//                       <h4>{SelectedPatient_list?.RegisterId}</h4>
//                     </div>
//                     {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         Bill No <span>:</span>
//                       </label>
//                       <h4>{PostInvoice}</h4>
//                     </div> */}
//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         Receipt No <span>:</span>
//                       </label>
//                       <h4>{RecieptInvoice}</h4>
//                     </div>
//                     {SelectedPatient_list?.ReferalDoctor !== '' && (
//                       <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                         <label>
//                           Referal Doctor <span>:</span>
//                         </label>
//                         <h4>{SelectedPatient_list.ReferalDoctor}</h4>
//                       </div>
//                     )}
//                     {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         D.O.C <span>:</span>
//                       </label>
//                       <h4>{OP_BillingData?.Date || SelectedPatient_list?.Date}</h4>
//                     </div> */}

//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         InvoiceDate <span>:</span>
//                       </label>
//                       <h4>{BillingData?.InvoiceDate}</h4>
//                     </div>

//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         InvoiceTime <span>:</span>
//                       </label>
//                       <h4>{BillingData?.InvoiceTime}</h4>
//                     </div>

                    
                    
//                   </div>
//                 </div>
//                 <div>
//                   <div className="physician_label_fixed">
//                     <label>Doctor Name <span >:</span></label>
//                     <h4>{`${BillingData.DoctorName}`}</h4>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td colSpan="7" className="prin_nnrmll_table">
//                 <table style={{ width: '100%', border: 'none' }}>
//                   <thead>
//                     <tr style={{ borderTop: '1.5px solid black', borderBottom: '1.5px solid black' }}>
//                       <th style={{ borderTop: '1px solid black' }}>Service Type / Name</th>
//                       <th style={{ border: 'none' }}>Unit</th>
//                       <th style={{ border: 'none' }}>Amount</th>
//                       <th style={{ border: 'none' }}>Net Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody style={{ borderBottom: '1.5px solid black', padding: '2px' }}>
//                     {SelectDatalist.map((row, index) => (
//                       <React.Fragment key={index}>
//                         {index === 0 || SelectDatalist[index - 1].ServiceType !== row.ServiceType ? (
//                           <tr style={{ borderTop: '1px solid grey', marginBottom: '10px' }}>
//                             <td style={{ fontWeight: 'bold', textAlign: 'left', border: 'none' }}>
//                               {row.ServiceType}
//                             </td>
//                             <td colSpan="3" style={{ border: 'none' }}></td>
//                           </tr>
//                         ) : null}
//                         <tr>
//                           <td style={{ paddingLeft: '20px', border: 'none' }}>{row.SelectItemName}</td>
//                           <td style={{ border: 'none' }}>{row.Quantity}</td>
//                           <td style={{ border: 'none' }}>{row.Amount}</td>
//                           <td style={{ border: 'none' }}>{row.NetAmount}</td>
//                         </tr>
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </td>
//             </tr>
//             <tr>
//               <td colSpan="7">
//                 <div className="new_billing_invoice_detials">
//                   <div className="invoice_detials_total_1">
//                     <div className="total_con_bill">

//                       <div className="bill_body_new_phar">
//                         <table className="print-table33">
//                           <thead>
//                             <tr>
//                               <th>S.No</th>
//                               <th>Payment Type</th>
//                               {hasCard && <th>Card Type</th>}
//                               {hasCheque && <th>Cheque No</th>}
//                               {hasBank && <th>Bank Name</th>}
//                               <th>Amount</th>
//                               <th>Additional Amount</th>
//                               {hasCard && <th>Transaction Fee</th>}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {billAmount.map((row, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{row.Billpay_method || '-'}</td>
//                                 {hasCard && (
//                                   <td>{row.Billpay_method === 'Card' ? row.CardType || '-' : '-'}</td>
//                                 )}
//                                 {hasCheque && (
//                                   <td>{row.Billpay_method === 'Cheque' ? row.ChequeNo || '-' : '-'}</td>
//                                 )}
//                                 {hasBank && (
//                                   <td>{row.Billpay_method === 'Bank' ? row.BankName || '-' : '-'}</td>
//                                 )}
//                                 <td>{row.paidamount || '-'}</td>
//                                 <td>{row.Additionalamount || '-'}</td>
//                                 {hasCard && (
//                                   <td>{row.Billpay_method === 'Card' ? `${row.transactionFee}%` || '-' : '-'}</td>
//                                 )}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Amount In Words <span>:</span>
//                         </label>
//                         <span>{NumberToWords(+initialState.totalNetAmount)}</span>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Billed By <span>:</span>
//                         </label>
//                         <span>{BillingData?.Billedby}</span>
//                       </div>
//                     </div>

//                     <div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Gross Amount <span>:</span>
//                         </label>
//                         <span>{initialState.totalAmount}</span>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Discount Amount <span>:</span>
//                         </label>
//                         <span>{initialState.totalDiscount}</span>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Net Amount <span>:</span>
//                         </label>
//                         <span>{initialState.totalNetAmount}</span>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Paid Amount <span>:</span>
//                         </label>
//                         <span>{initialState.totalAmountt}</span>
//                       </div>
//                     </div>
//                   </div>


//                 </div>
//               </td>
//             </tr>
//           </tbody>
//           <tfoot className="print_footerr">
//             <tr className="jjxcdsjjej_"></tr>
//             <tr className="ehdhe_9ikw">
//               <td className="shshxhxs_secfooter">
//                 <div
//                   style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}
//                 >
//                   <p className="disclaimer23">
//                     This page is created automatically without a signature.
//                   </p>
//                 </div>
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//       <div className="Register_btn_con added_Register_btn_con">
//         <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
//           Print
//         </button>
//         <button className="RegisterForm_1_btns jwedu6_99" onClick={handleClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ForPrintData;

import React from 'react';
import { NumberToWords } from "../../../OtherComponent/OtherFunctions";
import "../GeneralBilling.css";

const ForPrintData = ({ ClinicDetails, ClinicDetials, SelectedPatient_list, OP_BillingData, RegisterData, BillingData, PostInvoice, RecieptInvoice, SelectDatalist, billAmount, initialState, UserData, handlePrint2, handleClose, componentRef }) => {
  // Check if specific payment methods exist in billAmount
  const hasCard = billAmount.some((p) => p.Billpay_method === 'Card');
  const hasCheque = billAmount.some((p) => p.Billpay_method === 'Cheque');
  const hasBank = billAmount.some((p) => p.Billpay_method === 'Bank');

  return (
    <div ref={componentRef}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'auto', // Changed from '100vh'
          height: 'auto',
          padding: '0',
          margin: '0',
        }}
        id="reactprintcontent"
      >
        <table className="print-table33" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead
            className="print_header"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              height: 'auto', // Changed from '150px'
            }}
          >
            <tr>
              <td colSpan="7" style={{ border: "none", padding: '10px 0' }}>
                <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                  <div className="new_billing_logo_con">
                    <img src={ClinicDetails?.Clogo} alt="Clinic Logo" style={{ maxHeight: '80px' }} />
                  </div>
                  <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{ClinicDetails?.Cname}</span>
                    <div style={{ fontSize: '12px' }}>
                      <span>{[ClinicDetials.ClinicAddress].filter((detail) => detail).join(", ")},{[ClinicDetials.ClinicCity, ClinicDetials.ClinicState, ClinicDetials.ClinicCode].filter((detail) => detail).join(", ")}</span>
                    </div>
                    <div style={{ fontSize: '12px' }}>{[ClinicDetials.ClinicMobileNo, ClinicDetials.ClinicLandLineNo, ClinicDetials.ClinicMailID].filter((detail) => detail).join(" , ")}</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: 'black',
                  fontSize: '16px',
                  padding: '10px 0',
                }}
              >
                Billing Invoice
              </td>
            </tr>
            <tr>
              <td colSpan="7" style={{ padding: '0' }}>
                <div className="new_billing_address new_addn_p037">
                  <div className="new_billing_address_2 new_billing_address_2_new_up">
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Patient Name <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list?.PatientName}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Patient ID <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list?.PatientId}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Age / Gender <span>:</span>
                      </label>
                      <h4>{OP_BillingData?.AgeGender || RegisterData?.AgeGender}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Patient Mobile No <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list?.PhoneNumber}</h4>
                    </div>
                  </div>
                  <div className="new_billing_address_2 new_billing_address_2_new_up">
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        OP NO <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list?.RegisterId}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        Receipt No <span>:</span>
                      </label>
                      <h4>{RecieptInvoice}</h4>
                    </div>
                    {SelectedPatient_list?.ReferalDoctor !== '' && (
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Referal Doctor <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.ReferalDoctor}</h4>
                      </div>
                    )}
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        InvoiceDate <span>:</span>
                      </label>
                      <h4>{BillingData?.InvoiceDate}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        InvoiceTime <span>:</span>
                      </label>
                      <h4>{BillingData?.InvoiceTime}</h4>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="physician_label_fixed">
                    <label>Doctor Name <span>:</span></label>
                    <h4>{`${BillingData.DoctorName}`}</h4>
                  </div>
                </div>
              </td>
            </tr>
          </thead>
          <tbody style={{ pageBreakInside: 'avoid' }}>
            <tr>
              <td colSpan="7" className="prin_nnrmll_table" style={{ padding: '10px 0' }}>
                <table style={{ width: '100%', border: 'none' }}>
                  <thead>
                    <tr style={{ borderTop: '1.5px solid black', borderBottom: '1.5px solid black' }}>
                      <th style={{ borderTop: '1px solid black', padding: '8px' }}>Service Type / Name</th>
                      <th style={{ border: 'none', padding: '8px' }}>Unit</th>
                      <th style={{ border: 'none', padding: '8px' }}>Amount</th>
                      <th style={{ border: 'none', padding: '8px' }}>Net Amount</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderBottom: '1.5px solid black' }}>
                    {SelectDatalist.map((row, index) => (
                      <React.Fragment key={index}>
                        {index === 0 || SelectDatalist[index - 1].ServiceType !== row.ServiceType ? (
                          <tr>
                            <td style={{ fontWeight: 'bold', textAlign: 'left', border: 'none', padding: '8px', backgroundColor: '#f5f5f5' }}>
                              {row.ServiceType}
                            </td>
                            <td colSpan="3" style={{ border: 'none', padding: '8px' }}></td>
                          </tr>
                        ) : null}
                        <tr>
                          <td style={{ paddingLeft: '20px', border: 'none', padding: '6px 8px' }}>{row.SelectItemName}</td>
                          <td style={{ border: 'none', padding: '6px 8px' }}>{row.Quantity}</td>
                          <td style={{ border: 'none', padding: '6px 8px' }}>{row.Amount}</td>
                          <td style={{ border: 'none', padding: '6px 8px' }}>{row.NetAmount}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td colSpan="7" style={{ padding: '10px 0' }}>
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <table className="print-table33" style={{ width: '100%', marginBottom: '15px' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: '6px' }}>S.No</th>
                              <th style={{ padding: '6px' }}>Payment Type</th>
                              {hasCard && <th style={{ padding: '6px' }}>Card Type</th>}
                              {hasCheque && <th style={{ padding: '6px' }}>Cheque No</th>}
                              {hasBank && <th style={{ padding: '6px' }}>Bank Name</th>}
                              <th style={{ padding: '6px' }}>Amount</th>
                              <th style={{ padding: '6px' }}>Additional Amount</th>
                              {hasCard && <th style={{ padding: '6px' }}>Transaction Fee</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {billAmount.map((row, index) => (
                              <tr key={index}>
                                <td style={{ padding: '6px' }}>{index + 1}</td>
                                <td style={{ padding: '6px' }}>{row.Billpay_method || '-'}</td>
                                {hasCard && (
                                  <td style={{ padding: '6px' }}>{row.Billpay_method === 'Card' ? row.CardType || '-' : '-'}</td>
                                )}
                                {hasCheque && (
                                  <td style={{ padding: '6px' }}>{row.Billpay_method === 'Cheque' ? row.ChequeNo || '-' : '-'}</td>
                                )}
                                {hasBank && (
                                  <td style={{ padding: '6px' }}>{row.Billpay_method === 'Bank' ? row.BankName || '-' : '-'}</td>
                                )}
                                <td style={{ padding: '6px' }}>{row.paidamount || '-'}</td>
                                <td style={{ padding: '6px' }}>{row.Additionalamount || '-'}</td>
                                {hasCard && (
                                  <td style={{ padding: '6px' }}>{row.Billpay_method === 'Card' ? `${row.transactionFee}%` || '-' : '-'}</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bill_body_new_phar" style={{ margin: '8px 0' }}>
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>{NumberToWords(+initialState.totalNetAmount)}</span>
                      </div>
                      <div className="bill_body_new_phar" style={{ margin: '8px 0' }}>
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{BillingData?.Billedby}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar" style={{ margin: '8px 0' }}>
                        <label>
                          Gross Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar" style={{ margin: '8px 0' }}>
                        <label>
                          Discount Amount <span>:</span>
                        </label>
                        <span>{initialState.totalDiscount}</span>
                      </div>
                      <div className="bill_body_new_phar" style={{ margin: '8px 0' }}>
                        <label>
                          Net Amount <span>:</span>
                        </label>
                        <span>{initialState.totalNetAmount}</span>
                      </div>
                      <div className="bill_body_new_phar" style={{ margin: '8px 0' }}>
                        <label>
                          Paid Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmountt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot className="print_footerr" style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <tr className="jjxcdsjjej_"></tr>
            <tr className="ehdhe_9ikw">
              <td className="shshxhxs_secfooter">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px 0',
                  }}
                >
                  <p className="disclaimer23" style={{ fontSize: '11px', color: '#666' }}>
                    This page is created automatically without a signature.
                  </p>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
          Print
        </button>
        <button className="RegisterForm_1_btns jwedu6_99" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ForPrintData;