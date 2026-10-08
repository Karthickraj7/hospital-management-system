// import React, { useEffect, useState } from 'react'
// import { formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';
// import axios from "axios";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import Button from '@mui/material/Button';
// import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { format } from 'date-fns';
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// const SupplierPayList = () => {
//     const dispatchvalue = useDispatch();
//     const toast = useSelector(state => state.userRecord?.toast);
//     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//     const navigate = useNavigate();

//     const [Summa1, setsumma1] = useState({
//         supplierCode: '',
//         supplierName: '',
//         status: 'Pending',
//     });
//     const [summa2, setsumma2] = useState({
//         supplierCode: '',
//         invoiceNo: '',
//         status: 'Pending'
//     })
//     const [summa3, setsumma3] = useState(false)
//     const [summaArray1, setsummaArray1] = useState([])
//     const [summaArray2, setsummaArray2] = useState([])


//     useEffect(() => {
//         axios.get(`${UrlLink}/Inventory/get_supplier_payment_detials`, { params: Summa1 })
//             .then((res) => {
//                 setsummaArray1(Array.isArray(res.data) ? res.data : [])
//             })
//             .catch((err) => {
//                 setsummaArray1([])
//                 console.error(err);
//             })
//     }, [UrlLink, Summa1])

//     useEffect(() => {
//         if (summa2.supplierCode) {
//             axios.get(`${UrlLink}Inventory/get_supplier_payment_by_invoice_detials`, { params: summa2 })
//                 .then((res) => {
//                     setsummaArray2(Array.isArray(res.data) ? res.data : [])
//                 })
//                 .catch((err) => {
//                     setsummaArray2([])
//                     console.error(err);
//                 })
//         } else {
//             setsummaArray2([])
//         }

//     }, [UrlLink, summa2])


//     const handleonchangesumma1 = (e) => {
//         const { name, value } = e.target
//         setsumma1(prev => ({
//             ...prev,
//             [name]: value
//         }))
//     }
//     const handleonchangesumma2 = (e) => {
//         const { name, value } = e.target
//         setsumma2(prev => ({
//             ...prev,
//             [name]: value
//         }))
//     }
//     const handleviewsumma1 = (params) => {
//         setsumma2(prev => ({
//             ...prev,
//             supplierCode: params?.SupplierCode
//         }))
//         setsumma3(prev => !prev)
//     }
//     const handleproceedsumma2 = (params) => {
//         const currentdate = format(new Date(), 'yyyy-MM-dd')
//         const datas = {
//             pk: params.pk,
//             SupplierCode: params.SupplierCode,
//             SupplierName: params.SupplierName,
//             Supplier_Bill_Date: params.Supplier_Bill_Date,
//             GRN_Invoice: params.GRN_Invoice_No,
//             GRN_Date: params.GRN_Invoice_Date,
//             GRN_Due_Date: params.GRN_Due_Date,
//             GRN_Invoice_Amount: params.GRN_Invoice_Amount,
//             GRN_Paid_Amount: params.GRN_Paid_Amount,
//             GRN_Balance_Amount: params.GRN_Balance_Amount,
//             PaidDate: currentdate,
//         }
//         dispatchvalue({ type: 'Supplierpaydata', value: (datas) })
//         navigate('/Home/SupplierPay')
//     }




//     const handlePurchaseReturn = (params) => {

//          const currentdate = format(new Date(), 'yyyy-MM-dd')
//         const datas = {
//             pk: params.pk,
//             SupplierCode: params.SupplierCode,
//             SupplierName: params.SupplierName,
//             Supplier_Bill_Date: params.Supplier_Bill_Date,
//             GRN_Invoice: params.GRN_Invoice_No,
//             GRN_Date: params.GRN_Invoice_Date,
//             GRN_Due_Date: params.GRN_Due_Date,
//             GRN_Invoice_Amount: params.GRN_Invoice_Amount,
//             GRN_Paid_Amount: params.GRN_Paid_Amount,
//             GRN_Balance_Amount: params.GRN_Balance_Amount,
//             PaidDate: currentdate,
//         }
//         dispatchvalue({ type: 'Supplierpaydata', value: (datas) })

// navigate('/Home/DebitReturn')

//     }

//     const summa1column = [
//         ...['id', 'SupplierCode', 'SupplierName',
//             'TotalAmount', 'PaidAmount', 'BalanceAmount',
//         ].map(f => (
//             {
//                 key: f,
//                 name: f === 'id' ? 'S.No' : formatunderscoreLabel(f)
//             }

//         )),
//         {
//             key: 'View',
//             name: 'View',
//             renderCell: (params) => (
//                 <Button className="cell_btn" onClick={() => handleviewsumma1(params.row)}>
//                     <VisibilityIcon className="check_box_clrr_cancell" />
//                 </Button>
//             )
//         }
//     ]
//     const summa2column = [
//         ...['id', 'SupplierCode', 'SupplierName', 'GRN_Invoice_No', 'GRN_Invoice_Date',
//             'Supplier_Bill_Date', 'GRN_Due_Date', 'GRN_Invoice_Amount', 'GRN_Paid_Amount', 'GRN_Balance_Amount'
//         ].map(f => (
//             {
//                 key: f,
//                 name: f === 'id' ? 'S.No' : formatunderscoreLabel(f)
//             }

//         )),
//         {
//             key: 'Action',
//             name: 'Action',
//             renderCell: (params) => (
//                 params.row.Status ?
//                     'Completed'
//                     :params.row.OldGrn && !params.row.OldGrnUpdateStatus ?
//                     'Old Grn Update Pending'
//                     :
//                     <Button className="cell_btn" style={{backgroundColor:'grey'}} onClick={() => handleproceedsumma2(params.row)}>
//                         <ArrowForwardIcon className="check_box_clrr_cancell" />
//                     </Button>
//             )
//         },
//         {
//             key: 'PurchaseReturn',
//             name: 'Purchase Return',
//             renderCell: (params) => (
               
//                     <Button style={{backgroundColor:'red'}} className="cell_btn" onClick={() => handlePurchaseReturn(params.row)}>
//                         <ArrowForwardIcon className="check_box_clrr_cancell" />
//                     </Button>
//             )
//         }
//     ]



//     return (
//         <>
//             <div className="Main_container_app">
//                 <h3>Supplier Pay Que List</h3>
//                 <br />
//                 <div className="RegisFormcon_1">
//                     {
//                         Object.keys(Summa1).map((field, index) => (
//                             <div className="RegisForm_1" key={index}>
//                                 <label>{formatunderscoreLabel(field)}<span>:</span></label>
//                                 {field === 'status' ?
//                                     <select
//                                         name={field}
//                                         value={Summa1[field]}
//                                         onChange={handleonchangesumma1}
//                                     >
//                                         <option value=''>Select</option>
//                                         <option value='Pending'> Pending </option>
//                                         <option value='Completed'> Completed </option>
//                                     </select>
//                                     :
//                                     <input
//                                         type='text'
//                                         name={field}
//                                         value={Summa1[field]}
//                                         onChange={handleonchangesumma1}

//                                     />
//                                 }
//                             </div>
//                         ))
//                     }

//                 </div>
//                 <br />
//                 <ReactGrid columns={summa1column} RowData={summaArray1} />
//             </div>
//             {summa3 && (
//                 <div className="loader" onClick={() => setsumma3(false)}>
//                     <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
//                         <br />

//                         <div className="common_center_tag">
//                             <span>Supplier Payment Details</span>
//                         </div>

//                         <br />
//                         <div className="RegisFormcon_1">
//                             {
//                                 Object.keys(summa2).filter(f => f !== 'supplierCode').map((field, index) => (
//                                     <div className="RegisForm_1" key={index}>
//                                         <label>{formatunderscoreLabel(field)}<span>:</span></label>
//                                         {field === 'status' ?
//                                             <select
//                                                 name={field}
//                                                 value={summa2[field]}
//                                                 onChange={handleonchangesumma2}
//                                             >
//                                                 <option value=''>Select</option>
//                                                 <option value='Pending'> Pending </option>
//                                                 <option value='Completed'> Completed </option>
//                                             </select>
//                                             :
//                                             <input
//                                                 type='text'
//                                                 name={field}
//                                                 value={summa2[field]}
//                                                 onChange={handleonchangesumma2}

//                                             />
//                                         }
//                                     </div>
//                                 ))
//                             }
//                         </div>
//                         <br />
//                         <ReactGrid columns={summa2column} RowData={summaArray2} />
//                     </div>
//                 </div>
//             )}
//             <ToastAlert Message={toast.message} Type={toast.type} />

//         </>
//     )
// }

// export default SupplierPayList;

import React, { useEffect, useState } from 'react'
import { formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
const SupplierPayList = () => {
    const dispatchvalue = useDispatch();
    const toast = useSelector(state => state.userRecord?.toast);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const navigate = useNavigate();

    const [Summa1, setsumma1] = useState({
        supplierCode: '',
        supplierName: '',
        status: 'Pending',
    });
    const [summa2, setsumma2] = useState({
        supplierCode: '',
        invoiceNo: '',
        GRN_No: '',
        status: 'Pending'
    })
    const [summa3, setsumma3] = useState(false)
    const [summaArray1, setsummaArray1] = useState([])
    const [summaArray2, setsummaArray2] = useState([])


    useEffect(() => {
        axios.get(`${UrlLink}/Inventory/get_supplier_payment_detials`, { params: Summa1 })
            .then((res) => {
                setsummaArray1(Array.isArray(res.data) ? res.data : [])
            })
            .catch((err) => {
                setsummaArray1([])
                console.error(err);
            })
    }, [UrlLink, Summa1])

    useEffect(() => {
        if (summa2.supplierCode) {
            axios.get(`${UrlLink}Inventory/get_supplier_payment_by_invoice_detials`, { params: summa2 })
                .then((res) => {
                    setsummaArray2(Array.isArray(res.data) ? res.data : [])
                })
                .catch((err) => {
                    setsummaArray2([])
                    console.error(err);
                })
        } else {
            setsummaArray2([])
        }

    }, [UrlLink, summa2])


    const handleonchangesumma1 = (e) => {
        const { name, value } = e.target
        setsumma1(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleonchangesumma2 = (e) => {
        const { name, value } = e.target
        setsumma2(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleviewsumma1 = (params) => {
        setsumma2(prev => ({
            ...prev,
            supplierCode: params?.SupplierCode
        }))
        setsumma3(prev => !prev)
    }
    const handleproceedsumma2 = (params) => {
        const currentdate = format(new Date(), 'yyyy-MM-dd')
        const datas = {
            pk: params.pk,
            SupplierCode: params.SupplierCode,
            SupplierName: params.SupplierName,
            Supplier_Bill_Date: params.Supplier_Bill_Date,
            GRN_Invoice: params.GRN_Invoice_No,
            GRN_Date: params.GRN_Invoice_Date,
            GRN_Due_Date: params.GRN_Due_Date,
            GRN_Invoice_Amount: params.GRN_Invoice_Amount,
            GRN_Paid_Amount: params.GRN_Paid_Amount,
            GRN_Balance_Amount: params.GRN_Balance_Amount,
            PaidDate: currentdate,
        }
        dispatchvalue({ type: 'Supplierpaydata', value: (datas) })
        navigate('/Home/SupplierPay')
    }




    const handlePurchaseReturn = (params) => {

         const currentdate = format(new Date(), 'yyyy-MM-dd')
        const datas = {
            pk: params.pk,
            SupplierCode: params.SupplierCode,
            SupplierName: params.SupplierName,
            Supplier_Bill_Date: params.Supplier_Bill_Date,
            GRN_Invoice: params.GRN_Invoice_No,
            GRN_No: params.GRN_No,
            GRN_Date: params.GRN_Invoice_Date,
            GRN_Due_Date: params.GRN_Due_Date,
            GRN_Invoice_Amount: params.GRN_Invoice_Amount,
            GRN_Paid_Amount: params.GRN_Paid_Amount,
            GRN_Balance_Amount: params.GRN_Balance_Amount,
            PaidDate: currentdate,
        }
        dispatchvalue({ type: 'Supplierpaydata', value: (datas) })

navigate('/Home/DebitReturn')

    }

    const summa1column = [
        ...['id', 'SupplierCode', 'SupplierName',
            'TotalAmount', 'PaidAmount', 'BalanceAmount',
        ].map(f => (
            {
                key: f,
                name: f === 'id' ? 'S.No' : formatunderscoreLabel(f)
            }

        )),
        {
            key: 'View',
            name: 'View',
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => handleviewsumma1(params.row)}>
                    <VisibilityIcon className="check_box_clrr_cancell" />
                </Button>
            )
        }
    ]
    const summa2column = [
        ...['id', 'SupplierCode', 'SupplierName', 'GRN_Invoice_No','GRN_No', 'GRN_Invoice_Date',
            'Supplier_Bill_Date', 'GRN_Due_Date', 'GRN_Invoice_Amount', 'GRN_Paid_Amount', 'GRN_Balance_Amount'
        ].map(f => (
            {
                key: f,
                name: f === 'id' ? 'S.No' : formatunderscoreLabel(f)
            }

        )),
        {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                params.row.Status ?
                    'Completed'
                    :params.row.OldGrn && !params.row.OldGrnUpdateStatus ?
                    'Old Grn Update Pending'
                    :
                    <Button className="cell_btn" style={{backgroundColor:'grey'}} onClick={() => handleproceedsumma2(params.row)}>
                        <ArrowForwardIcon className="check_box_clrr_cancell" />
                    </Button>
            )
        },
        {
            key: 'PurchaseReturn',
            name: 'Purchase Return',
            renderCell: (params) => (
               
                    <Button style={{backgroundColor:'red'}} className="cell_btn" onClick={() => handlePurchaseReturn(params.row)}>
                        <ArrowForwardIcon className="check_box_clrr_cancell" />
                    </Button>
            )
        }
    ]



    return (
        <>
            <div className="Main_container_app">
                <h3>Supplier Pay Que List</h3>
                <br />
                <div className="RegisFormcon_1">
                    {
                        Object.keys(Summa1).map((field, index) => (
                            <div className="RegisForm_1" key={index}>
                                <label>{formatunderscoreLabel(field)}<span>:</span></label>
                                {field === 'status' ?
                                    <select
                                        name={field}
                                        value={Summa1[field]}
                                        onChange={handleonchangesumma1}
                                    >
                                        <option value=''>Select</option>
                                        <option value='Pending'> Pending </option>
                                        <option value='Completed'> Completed </option>
                                    </select>
                                    :
                                    <input
                                        type='text'
                                        name={field}
                                        value={Summa1[field]}
                                        onChange={handleonchangesumma1}

                                    />
                                }
                            </div>
                        ))
                    }

                </div>
                <br />
                <ReactGrid columns={summa1column} RowData={summaArray1} />
            </div>
            {summa3 && (
                <div className="loader" onClick={() => setsumma3(false)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />

                        <div className="common_center_tag">
                            <span>Supplier Payment Details</span>
                        </div>

                        <br />
                        <div className="RegisFormcon_1">
                            {
                                Object.keys(summa2).filter(f => f !== 'supplierCode').map((field, index) => (
                                    <div className="RegisForm_1" key={index}>
                                        <label>{formatunderscoreLabel(field)}<span>:</span></label>
                                        {field === 'status' ?
                                            <select
                                                name={field}
                                                value={summa2[field]}
                                                onChange={handleonchangesumma2}
                                            >
                                                <option value=''>Select</option>
                                                <option value='Pending'> Pending </option>
                                                <option value='Completed'> Completed </option>
                                            </select>
                                            :
                                            <input
                                                type='text'
                                                name={field}
                                                value={summa2[field]}
                                                onChange={handleonchangesumma2}

                                            />
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        <br />
                        <ReactGrid columns={summa2column} RowData={summaArray2} />
                    </div>
                </div>
            )}
            <ToastAlert Message={toast.message} Type={toast.type} />

        </>
    )
}

export default SupplierPayList;