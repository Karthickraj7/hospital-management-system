import axios from 'axios'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid'
import { useSelector } from 'react-redux'
import { formatunderscoreLabel } from '../../OtherComponent/OtherFunctions'

const SupplierPaidList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [summa1, setsumma1] = useState({
        SupplierCode: '',
        SupplierName: '',
        InvoiceNo: '',
        DateType: '',
        CurrentDate: format(new Date(), 'yyyy-MM-dd'),
        FromDate: '',
        ToDate: '',
    });
    const [summaArray1, setsummaArray1] = useState([]);
    const [supplierArray, setsupplierArray] = useState([])

    useEffect(() => {

        axios.get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
            .then((res) => {
                let Rdata = res.data
                if (Array.isArray(Rdata)) {
                    setsupplierArray(Rdata)

                }
            })
            .catch((err) => {
                console.log(err);

            })
    }, [])
    const handleonchange = (e) => {
        const { name, value } = e.target;
        setsumma1(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle DateType change to set or clear CurrentDate
    useEffect(() => {
        if (summa1.DateType === 'Current') {
            setsumma1(prev => ({
                ...prev,
                CurrentDate: format(new Date(), 'yyyy-MM-dd'),
                FromDate: '',
                ToDate: ''
            }));
        } else {
            setsumma1(prev => ({
                ...prev,
                CurrentDate: ''
            }));
        }
    }, [summa1.DateType]);

    // Fetch supplier payment details
    useEffect(() => {
        const fetchSupplierPayments = async () => {
            try {


                const res = await axios.get(`${UrlLink}Inventory/supplier_payment_day_by_date`, { params: summa1 });
                setsummaArray1(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setsummaArray1([]);
                console.error(err);
            }
        };

        fetchSupplierPayments();
    }, [UrlLink, summa1]); // Re-fetch when UrlLink or filter criteria (summa1) change

    const summa1column = [
        ...[
            'id', 'SupplierCode', 'SupplierName', 'GRN_Invoice_No', 'GRN_Invoice_Date',
            'Supplier_Bill_Date', 'GRN_Due_Date', 'GRN_Invoice_Amount', 'GRN_Paid_Amount',
            'GRN_Balance_Amount', 'Paid_Amount', 'Balance_Amount', 'Bill_Paid_Date',
            'Payment_Method', 'Payment_Detials', 'PaymentMode', 'Payment_by'
        ].map(f => ({
            key: f,
            name: f === 'id' ? 'S.No' : formatunderscoreLabel(f)
        })),
    ];

    return (
        <>
            <div className="Main_container_app">
                <h3>Supplier Paid List</h3>
                <br />
                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>Supplier Code<span>:</span></label>
                        <input
                            type='text'
                            name='SupplierCode'
                            value={summa1.SupplierCode}
                            onChange={handleonchange}
                            list='SupplierCodeList_payment'
                        />
                        <datalist id='SupplierCodeList_payment'>
                            {
                                supplierArray.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.id} ></option>
                                ))

                            }
                        </datalist>
                    </div>
                    <div className="RegisForm_1">
                        <label>Supplier Name<span>:</span></label>
                        <input
                            type='text'
                            name='SupplierName'
                            value={summa1.SupplierName}
                            onChange={handleonchange}
                            list='SupplierNameList_payment'
                        />
                        <datalist id='SupplierNameList_payment'>
                            {
                                supplierArray.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.SupplierName} ></option>
                                ))
                            }
                        </datalist>
                    </div>

                    <div className="RegisForm_1">
                        <label>Invoice No<span>:</span></label>
                        <input
                            type='text'
                            name='InvoiceNo'
                            value={summa1.InvoiceNo}
                            onChange={handleonchange}
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>Date Type<span>:</span></label>
                        <select
                            name='DateType'
                            value={summa1.DateType}
                            onChange={handleonchange}
                        >
                            <option value=''>Select</option>
                            <option value='Current'>Current Date</option>
                            <option value='Customize'>Customize</option>
                        </select>
                    </div>
                    {summa1.DateType === 'Current' ? (
                        <div className="RegisForm_1">
                            <label>Current Date<span>:</span></label>
                            <input
                                type='date'
                                name='CurrentDate'
                                value={summa1.CurrentDate}
                                readOnly
                            />
                        </div>
                    ) : (
                        <>
                            <div className="RegisForm_1">
                                <label>From Date<span>:</span></label>
                                <input
                                    type='date'
                                    name='FromDate'
                                    value={summa1.FromDate}
                                    onChange={handleonchange}
                                />
                            </div>
                            <div className="RegisForm_1">
                                <label>To Date<span>:</span></label>
                                <input
                                    type='date'
                                    name='ToDate'
                                    value={summa1.ToDate}
                                    onChange={handleonchange}
                                    min={summa1.FromDate}
                                />
                            </div>
                        </>
                    )}
                </div>
                <br />
                <ReactGrid columns={summa1column} RowData={summaArray1} />

            </div>
        </>
    );
};

export default SupplierPaidList;
