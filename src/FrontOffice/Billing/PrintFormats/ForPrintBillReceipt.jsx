import React from 'react';
import { NumberToWords } from "../../../OtherComponent/OtherFunctions";
import "../GeneralBilling.css";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


// New Component for Print Bill and Receipt
const ForPrintBillReceipt = ({ ClinicDetails, ClinicDetials, SelectedPatient_list, OP_BillingData, RegisterData, PostInvoice, ReceiptInvoice, BillingData, billAmount, initialState, UserData, SelectDatalist, handleClose, componentRef,BillCopyType }) => {
    console.log('gvsdjbhd');
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()

    // Check if specific payment methods exist in billAmount
    const hasCard = billAmount.some((p) => p.Payment_Type === 'Card');
    const hasCheque = billAmount.some((p) => p.Payment_Type === 'Cheque');
    const hasBank = billAmount.some((p) => p.Payment_Type === 'Bank');
    console.log('hasssss', hasCard, hasBank, hasCheque, initialState?.PaidNetAmount);
    const handlePrint2 = useReactToPrint({
        content: () => componentRef.current,

        onAfterPrint: async () => {
            navigate("/Home/CashierFolder");
            dispatchvalue({ type: "HrFolder", value: "GeneralBillingList" });
            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });
        },
    });

    return (
        <div ref={componentRef}>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} id="reactprintcontent">
                <table className="print-table33">
                    <thead className="print_header" style={{ width: "100%", borderCollapse: "collapse", height: "150px" }}>
                        <tr>
                            <td colSpan="7" style={{ border: "none" }}>
                                <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                                    <div className="new_billing_logo_con">
                                        <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                                    </div>
                                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                                        <span>{ClinicDetails?.Cname}</span>
                                        <div>
                                            <span>{[ClinicDetials.ClinicAddress].filter((detail) => detail).join(", ")},{[ClinicDetials.ClinicCity, ClinicDetials.ClinicState, ClinicDetials.ClinicCode].filter((detail) => detail).join(", ")}</span>
                                        </div>
                                        <div>{[ClinicDetials.ClinicMobileNo, ClinicDetials.ClinicLandLineNo, ClinicDetials.ClinicMailID].filter((detail) => detail).join(" , ")}</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", fontWeight: "600", color: "black", fontSize: "16px" }}>
                                Billing Invoice
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="7">
                                <div className="new_billing_address new_addn_p037">
                                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Patient Name <span>:</span></label>
                                            <h4>{SelectedPatient_list.PatientName}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Patient ID <span>:</span></label>
                                            <h4>{SelectedPatient_list.PatientId}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Age / Gender <span>:</span></label>
                                            <h4>{OP_BillingData.AgeGender || RegisterData.AgeGender || SelectedPatient_list.AgeGender}</h4>
                                        </div>
                                        <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                                            <label>Patient Mobile No <span>:</span></label>
                                            <h4>{SelectedPatient_list.PhoneNumber}</h4>
                                        </div>

                                    </div>
                                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                            <label>OP NO <span>:</span></label>
                                            <h4>{SelectedPatient_list.RegisterId}</h4>
                                        </div>
                                        {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                            <label>Bill No <span>:</span></label>
                                            <h4>{PostInvoice}</h4>
                                        </div> */}
                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                            <label>Receipt No <span>:</span></label>
                                            <h4>{ReceiptInvoice}</h4>
                                        </div>
                                        {SelectedPatient_list.ReferalDoctor !== "" &&
                                            <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                                <label>Referal Doctor<span>:</span></label>
                                                <h4>{SelectedPatient_list.ReferalDoctor}</h4>
                                            </div>}
                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                            <label>D.O.C <span>:</span></label>
                                            <h4>{OP_BillingData.Date || SelectedPatient_list.Date}</h4>
                                        </div>

                                        <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                                            <label>InvoiceDate <span>:</span></label>
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
                                    <div className="physician_label_fixed" >
                                        <label>Doctor Name <span>:</span></label>
                                        <h4>{`${BillingData.DoctorName}`}</h4>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <br />
                        <tr>
                            <td colSpan="7" className="prin_nnrmll_table">
                                <table style={{ width: "100%", border: "none" }}>
                                    <thead>
                                        <tr style={{ borderTop: "1.5px solid black", borderBottom: "1.5px solid black" }}>
                                            <th style={{ borderTop: "1px solid black" }}>Service Type / Name</th>
                                            <th style={{ border: "none" }}>Unit</th>
                                            <th style={{ border: "none" }}>Amount</th>
                                            <th style={{ border: "none" }}>Net Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ borderBottom: "1.5px solid black", padding: "2px" }}>
                                        {SelectDatalist.map((row, index) => (
                                            <React.Fragment key={index}>
                                                {index === 0 || SelectDatalist[index - 1].Service_Type !== row.Service_Type ? (
                                                    <tr style={{ borderTop: "1px solid grey", marginBottom: "10px" }}>
                                                        <td style={{ fontWeight: "bold", textAlign: "left", border: "none" }}>
                                                            {row.Service_Type}
                                                        </td>
                                                        <td colSpan="3" style={{ border: "none" }}></td>
                                                    </tr>
                                                ) : null}
                                                <tr>
                                                    <td style={{ paddingLeft: "20px", border: "none" }}>{row.Service_Name}</td>
                                                    <td style={{ border: "none" }}>{row.Quantity}</td>
                                                    <td style={{ border: "none" }}>{row.Amount}</td>
                                                    <td style={{ border: "none" }}>{row.Total_Amount}</td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <br />
                        <tr>
                            <td colSpan="7">
                                <div className="new_billing_invoice_detials">
                                    <div className="invoice_detials_total_1">
                                        <div className="total_con_bill">
                                            <div className="bill_body_new_phar">
                                                <table className="print-table33">
                                                    <thead>
                                                        <tr>
                                                            <th>S.No</th>
                                                            <th>Payment Type</th>
                                                            {hasCard && <th>Card Type</th>}
                                                            {hasCheque && <th>Cheque No</th>}
                                                            {hasBank && <th>Bank Name</th>}
                                                            <th>Amount</th>
                                                            <th>Additional Amount</th>
                                                            <th>Transaction Fee</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {billAmount.map((row, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{row.Payment_Type || '-'}</td>
                                                                {hasCard && (
                                                                    <td>{row.Payment_Type === 'Card' ? row.Card_Type || '-' : '-'}</td>
                                                                )}
                                                                {hasCheque && (
                                                                    <td>{row.Payment_Type === 'Cheque' ? row.Cheque_No || '-' : '-'}</td>
                                                                )}
                                                                {hasBank && (
                                                                    <td>{row.Payment_Type === 'Bank' ? row.Bank_Name || '-' : '-'}</td>
                                                                )}
                                                                <td>{row.Amount || '-'}</td>
                                                                <td>{row.AdditionalAmount || '-'}</td>
                                                                <td>{`${parseInt(row.Transaction_Amount)}%` || '-'}</td>
                                                            </tr>

                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <br />


                                            <div className="bill_body_new_phar">
                                                <label>Amount In Words <span>:</span></label>
                                                <span>{NumberToWords(+initialState.totalNetAmount)}</span>
                                            </div>
                                            <div className="bill_body_new_phar">
                                                <label>Billed By <span>:</span></label>
                                                <span>{BillingData?.Billedby}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="bill_body_new_phar">
                                                <label>Gross Amount <span>:</span></label>
                                                <span>{initialState.totalAmount}</span>
                                            </div>
                                            <div className="bill_body_new_phar">
                                                <label>Discount Amount <span>:</span></label>
                                                <span>{initialState.totalDiscount}</span>
                                            </div>
                                            <div className="bill_body_new_phar">
                                                <label>Net Amount <span>:</span></label>
                                                <span>{initialState.totalNetAmount}</span>
                                            </div>
                                            <div className="bill_body_new_phar">
                                                <label>Paid Amount <span>:</span></label>
                                                <span>{initialState?.PaidNetAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <br />
                    { (BillCopyType === 'Duplicate') && (<>
                            <td colSpan="7" style={{ textAlign: "center", fontWeight: "600", color: "black", fontSize: "20px" }}>
                        <h4 style={{ textAlign: "center", fontWeight: "bolder", color: "black", fontSize: "18px", position: "relative", right: "50%", top: "50px" }}>
                            Duplicate Copy Of Original Bill
                        </h4>
                    </td>
                    </>)

                    }
                </table>
            </div>
            <div className="Register_btn_con added_Register_btn_con">
                <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>Print</button>
                <button className="RegisterForm_1_btns jwedu6_99" onClick={handleClose}>Close</button>
            </div>
        </div>
    );
};

export default ForPrintBillReceipt;