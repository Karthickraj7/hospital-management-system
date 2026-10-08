// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { BlockInvalidcharecternumber, formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// import axios from 'axios';

// const SupplierPay = () => {
//     const dispatchvalue = useDispatch();
//     const toast = useSelector(state => state.userRecord?.toast);
//     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//     const Supplierpaydata = useSelector(state => state.Inventorydata?.Supplierpaydata);
//     const userRecord = useSelector((state) => state.userRecord?.UserData);
//     const navigate = useNavigate();

//     const [Summa1, setSumma1] = useState({
//         pk: null,
//         SupplierCode: '',
//         SupplierName: '',
//         Supplier_Bill_Date: '',
//         GRN_Invoice: '',
//         GRN_Date: '',
//         GRN_Due_Date: '',
//         GRN_Invoice_Amount: '',
//         GRN_Paid_Amount: '',
//         GRN_Balance_Amount: '',
//         Payable_Amount: '',
//         Balance_Amount: '',
//         PaidDate: '',
//         PaymentMethod: '',
//         PaymentDetials: ''
//     })

//     useEffect(() => {

//         console.log(Supplierpaydata);

//         if (Supplierpaydata && Object.keys(Supplierpaydata).length !== 0) {
//             setSumma1((prev) => ({
//                 ...prev,
//                 Balance_Amount: Supplierpaydata?.GRN_Balance_Amount,
//                 ...Supplierpaydata,
//             }));
//         } else {
//             navigate('/Home/SupplierPayList')
//         }
//     }, [Supplierpaydata]);


//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'Payable_Amount') {
//             const parsedValue = parseFloat(value) || 0;
//             const grnBalanceAmount = parseFloat(Summa1.GRN_Balance_Amount);

//             if (!isNaN(parsedValue) && !isNaN(grnBalanceAmount) && parsedValue <= grnBalanceAmount) {
//                 setSumma1((prev) => ({
//                     ...prev,
//                     [name]: parsedValue,
//                     Balance_Amount: (grnBalanceAmount - parsedValue).toFixed(3),
//                 }));
//             } else {
//                 alert(`Please enter a valid number below or equal to the GRN Balance Amount ${Summa1.GRN_Balance_Amount}`);
//             }
//         } else if (name === 'PaymentMethod') {
//             if (value === 'Cash') {
//                 setSumma1((prev) => ({
//                     ...prev,
//                     [name]: value,
//                     PaymentDetials: 'Nill'
//                 }));
//             } else {
//                 setSumma1((prev) => ({
//                     ...prev,
//                     [name]: value,
//                     PaymentDetials: ''
//                 }));
//             }
//         } else if (name === 'PaymentDetials') {
//             if (Summa1.PaymentMethod === '') {
//                 alert('please select the payment method')
//             } else {
//                 setSumma1((prev) => ({
//                     ...prev,
//                     [name]: value,
//                 }));
//             }
//         }
//     };


//     const handleSubmit = () => {
//         let requiredfields = [
//             'Payable_Amount',
//             'PaidDate',
//             'PaymentMethod'
//         ]
//         if (Summa1.PaymentMethod !== '') {
//             requiredfields.push('PaymentDetials');
//         }
//         const missingFields = requiredfields.filter((field) => !Summa1[field]);
//         if (missingFields.length !== 0) {
//             const tdata = {
//                 message: `Please fill out all required fields: ${missingFields.map(p => formatunderscoreLabel(p)).join(', ')}`,
//                 type: 'warn',
//             }
//             dispatchvalue({ type: 'toast', value: tdata });
//         } else {
//             const data = {
//                 ...Summa1,
//                 Created_by: userRecord?.username
//             }
//             axios.post(`${UrlLink}Inventory/supplier_payment_day_by_date`, data)
//                 .then((res) => {
//                     let resdata = res.data
//                     let type = Object.keys(resdata)[0]
//                     let mess = Object.values(resdata)[0]
//                     const tdata = {
//                         message: mess,
//                         type: type,
//                     }
//                     dispatchvalue({ type: 'toast', value: tdata });
//                     navigate('/Home/SupplierPayList')
//                 })
//                 .catch((error) => {
//                     console.log(error)
//                 })
//         }

//     }
//     return (
//         <>
//             <div className="Main_container_app">
//                 <h3>Supplier Pay Que List</h3>
//                 <br />
//                 <div className="RegisFormcon_1">
//                     {
//                         Object.keys(Summa1).filter(f => f !== 'pk').map((field, index) => (
//                             <div className="RegisForm_1" key={index}>
//                                 <label>{formatunderscoreLabel(field)}<span>:</span></label>
//                                 {field === 'PaymentMethod' ?
//                                     <select
//                                         name={field}
//                                         value={Summa1[field]}
//                                         onChange={handleInputChange}
//                                     >
//                                         <option value=''>Select</option>
//                                         <option value="Cash">Cash</option>
//                                         <option value="Card">Card</option>
//                                         <option value="OnlinePayment">Online Payment</option>
//                                         <option value="Cheque">Cheque</option>
//                                     </select>
//                                     :
//                                     <input
//                                         type={field === 'Payable_Amount' ? 'number' : 'text'}
//                                         name={field}
//                                         onKeyDown={field === 'Payable_Amount' ? BlockInvalidcharecternumber : null}
//                                         value={Summa1[field]}
//                                         disabled={field === 'PaymentDetials' ? ['', 'Cash'].includes(Summa1.PaymentMethod) : field !== 'Payable_Amount'}
//                                         onChange={handleInputChange}

//                                     />
//                                 }
//                             </div>
//                         ))
//                     }

//                 </div>
//                 <div className="Main_container_Btn">
//                     <button onClick={handleSubmit}>
//                         submit
//                     </button>
//                 </div>
//             </div>
//             <ToastAlert Message={toast.message} Type={toast.type} />

//         </>
//     )
// }

// export default SupplierPay;

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BlockInvalidcharecternumber, formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';

const SupplierPay = () => {
    const dispatchvalue = useDispatch();
    const toast = useSelector(state => state.userRecord?.toast);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const Supplierpaydata = useSelector(state => state.Inventorydata?.Supplierpaydata);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const navigate = useNavigate();

    const [Summa1, setSumma1] = useState({
        pk: null,
        SupplierCode: '',
        SupplierName: '',
        Supplier_Bill_Date: '',
        GRN_Invoice: '',
        GRN_Date: '',
        GRN_Due_Date: '',
        GRN_Invoice_Amount: '',
        GRN_Paid_Amount: '',
        GRN_Balance_Amount: '',
        Payable_Amount: '',
        Balance_Amount: '',
        PaidDate: '',
        PaymentMethod: '',
        PaymentDetials: ''
    })

    useEffect(() => {

        console.log(Supplierpaydata);

        if (Supplierpaydata && Object.keys(Supplierpaydata).length !== 0) {
            setSumma1((prev) => ({
                ...prev,
                Balance_Amount: Supplierpaydata?.GRN_Balance_Amount,
                ...Supplierpaydata,
            }));
        } else {
            navigate('/Home/SupplierPayList')
        }
    }, [Supplierpaydata]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'Payable_Amount') {
            const parsedValue = parseFloat(value) || 0;
            const grnBalanceAmount = parseFloat(Summa1.GRN_Balance_Amount);

            if (!isNaN(parsedValue) && !isNaN(grnBalanceAmount) && parsedValue <= grnBalanceAmount) {
                setSumma1((prev) => ({
                    ...prev,
                    [name]: parsedValue,
                    Balance_Amount: (grnBalanceAmount - parsedValue).toFixed(3),
                }));
            } else {
                alert(`Please enter a valid number below or equal to the GRN Balance Amount ${Summa1.GRN_Balance_Amount}`);
            }
        } else if (name === 'PaymentMethod') {
            if (value === 'Cash') {
                setSumma1((prev) => ({
                    ...prev,
                    [name]: value,
                    PaymentDetials: 'Nill'
                }));
            } else {
                setSumma1((prev) => ({
                    ...prev,
                    [name]: value,
                    PaymentDetials: ''
                }));
            }
        } else if (name === 'PaymentDetials') {
            if (Summa1.PaymentMethod === '') {
                alert('please select the payment method')
            } else {
                setSumma1((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
    };


    const handleSubmit = () => {
        let requiredfields = [
            'Payable_Amount',
            'PaidDate',
            'PaymentMethod'
        ]
        if (Summa1.PaymentMethod !== '') {
            requiredfields.push('PaymentDetials');
        }
        const missingFields = requiredfields.filter((field) => !Summa1[field]);
        if (missingFields.length !== 0) {
            const tdata = {
                message: `Please fill out all required fields: ${missingFields.map(p => formatunderscoreLabel(p)).join(', ')}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        } else {
            const data = {
                ...Summa1,
                Created_by: userRecord?.username
            }
            axios.post(`${UrlLink}Inventory/save-supplier-payment/`, data)
                .then((res) => {
                    let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                    dispatchvalue({ type: 'toast', value: tdata });
                    navigate('/Home/VendorScheduled')
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
    return (
        <>
            <div className="Main_container_app">
                <h3>Supplier Pay Que List</h3>
                <br />
                <div className="RegisFormcon_1">
                    {
                        Object.keys(Summa1).filter(f => f !== 'pk').map((field, index) => (
                            <div className="RegisForm_1" key={index}>
                                <label>{formatunderscoreLabel(field)}<span>:</span></label>
                                {field === 'PaymentMethod' ?
                                    <select
                                        name={field}
                                        value={Summa1[field]}
                                        onChange={handleInputChange}
                                    >
                                        <option value=''>Select</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="OnlinePayment">Online Payment</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                    :
                                    <input
                                        type={field === 'Payable_Amount' ? 'number' : 'text'}
                                        name={field}
                                        onKeyDown={field === 'Payable_Amount' ? BlockInvalidcharecternumber : null}
                                        value={Summa1[field]}
                                        disabled={field === 'PaymentDetials' ? ['', 'Cash'].includes(Summa1.PaymentMethod) : field !== 'Payable_Amount'}
                                        onChange={handleInputChange}

                                    />
                                }
                            </div>
                        ))
                    }

                </div>
                <div className="Main_container_Btn">
                    <button onClick={handleSubmit}>
                        submit
                    </button>
                </div>
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />

        </>
    )
}

export default SupplierPay;