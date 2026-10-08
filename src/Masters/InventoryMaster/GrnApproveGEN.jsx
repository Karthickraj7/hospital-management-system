
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import Button from "@mui/material/Button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';
import ListIcon from '@mui/icons-material/List';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from 'react-router-dom';
import { setSeconds } from 'date-fns';


const GrnApproveGEN = () => {

    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const [ShowItems, setShowItems] = useState(false)
    const [getstate, setgetstate] = useState(false)
    const [ItemsData, setItemsData] = useState([])
    const [GrnData, setGrnData] = useState([])
    const [supplierArray, setsupplierArray] = useState([])

    const [LocationData, setLocationData] = useState([]);
    const [StoreData, setStoreData] = useState([]);

    useEffect(() => {
        if (userRecord?.location) {
            axios
                .get(
                    `${UrlLink}Masters/Inventory_Master_Detials_link_GEN?SearchLocation=${userRecord?.location}&forquickgrn=${false}`
                )
                .then((res) => {
                    const data = res.data;
                    setStoreData(Array.isArray(data) ? data : []);
                })
                .catch((err) => {
                    console.log(err);
                });

        }

    }, [UrlLink, userRecord?.location])



    const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";

    console.log('allowedStoreId', allowedStoreId)

    const [searchQuery, setsearchQuery] = useState({
        GRNType: '',
        StatusCheck: '',
        DateType: '',
        CurrentDate: '',
        FromDate: '',
        ToDate: '',
        SupplierId: '',
        SupplierName: '',
        GRNLocation: '',
        StoreId:'',
    })

    console.log('searchQuery', searchQuery);


    useEffect(() => {
        if (searchQuery.DateType === 'Current') {
            const today = new Date();
            const currentDate = today.toISOString().split('T')[0];

            setsearchQuery((prev) => ({
                ...prev,
                CurrentDate: currentDate
            }))
        } else {
            setsearchQuery((prev) => ({
                ...prev,
                CurrentDate: ''
            }))
        }

    }, [searchQuery.DateType])



    useEffect(() => {

        axios.get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
            .then((res) => {
                console.log('pppp----', res.data);
                let Rdata = res.data
                if (Array.isArray(Rdata)) {
                    setsupplierArray(Rdata)

                }
            })
            .catch((err) => {
                console.log(err);

            })


        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data
                setLocationData(ress)
            })
            .catch((err) => {
                console.log(err);
            })


    }, [UrlLink])

    const handleonchange = (e) => {
        const { name, value } = e.target


        if (name === 'SupplierId') {

            let Finddata = supplierArray.find((ele) => ele.id === value)
            if (Finddata) {
                setsearchQuery((prev) => ({
                    ...prev,
                    [name]: value,
                    SupplierName: '',
                }))
            }
            else {
                setsearchQuery((prev) => ({
                    ...prev,
                    [name]: value,
                    SupplierName: '',

                }))
            }
        }
        if (name === 'SupplierName') {

            let Finddata = supplierArray.find((ele) => ele.SupplierName === value)
            if (Finddata) {
                setsearchQuery((prev) => ({
                    ...prev,
                    [name]: value,
                    SupplierId: '',
                }))
            }
            else {
                setsearchQuery((prev) => ({
                    ...prev,
                    [name]: value,
                    SupplierId: '',

                }))
            }
        }
        else {
            setsearchQuery((prev) => ({
                ...prev,
                [name]: value
            }))
        }

    }


    useEffect(() => {
        axios.get(`${UrlLink}Inventory/Goods_Reciept_Note_Details_link_GEN?`, {
            params: searchQuery
        })
            .then((res) => {
                setGrnData(Array.isArray(res.data) ? res.data : [])
            })
            .catch((err) => {
                console.error(err);
            })
    }, [UrlLink, getstate, searchQuery])


    const HandelViewdata = useCallback((fileval) => {

        // console.log('uuu',fileval);

        if (fileval) {
            let tdata = {
                Isopen: false,
                content: null,
                type: 'image/jpg'
            };
            if (['data:image/jpeg;base64', 'data:image/jpg;base64'].includes(fileval?.split(',')[0])) {
                tdata = {
                    Isopen: true,
                    content: fileval,
                    type: 'image/jpeg'
                };
            } else if (fileval?.split(',')[0] === 'data:image/png;base64') {
                tdata = {
                    Isopen: true,
                    content: fileval,
                    type: 'image/png'
                };
            } else if (fileval?.split(',')[0] === 'data:application/pdf;base64') {
                tdata = {
                    Isopen: true,
                    content: fileval,
                    type: 'application/pdf'
                };
            }

            console.log('tdata', tdata);

            dispatchvalue({ type: 'modelcon', value: tdata });
        } else {
            const tdata = {
                message: 'There is no file to view.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }


    }, [dispatchvalue])


    const ItemView = (row) => {



        if (row?.GRN_Items && row?.GRN_Items.length !== 0) {
            setShowItems(true)
            setItemsData(row?.GRN_Items)
        }
        else {

            const tdata = {
                message: 'There is no data to view.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });

        }

    }


    const HandelEditdata = (row) => {
        dispatchvalue({ type: 'GoodsReceiptNoteList', value: {} });
        dispatchvalue({ type: 'GoodsReceiptNoteEdit', value: {} });

        console.log('00123', row);


        if (row.Status === 'Recieved' && row.IsQuickGRN) {
            dispatchvalue({ type: 'GoodsReceiptNoteEdit', value: row });
            // navigate('/Home/QuickGoodsRecieptNote');
            navigate("/Home/InventoryMaster");
            dispatchvalue({ type: "HrFolder", value: "QuickGoodsRecieptNote" });
            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });
        }
        else {
            dispatchvalue({ type: 'GoodsReceiptNoteEdit', value: { 'GRN_Number': row.pk } });
            // navigate('/Home/GoodsReceiptNote');
            navigate("/Home/InventoryMaster");
            dispatchvalue({ type: "HrFolder", value: "GoodsReceiptNote" });
            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });
        }

    }



    const HandelApprovedata = (params) => {
        const confirm = window.confirm('Are you sure want to approve the GRN. Please double check the GRN detials, because it cannot be updated')
        if (confirm) {
            axios.post(`${UrlLink}Inventory/Goods_Reciept_Note_Details_Approve_link`, {
                InvoiceNo: params?.pk,
                Approved_by: userRecord?.username
            })
                .then((res) => {
                    let data = res.data
                    setgetstate(prev => !prev)
                    let type = Object.keys(data)[0]
                    let mess = Object.values(data)[0]
                    const tdata = {
                        message: mess,
                        type: type
                    }
                    dispatchvalue({ type: 'toast', value: tdata })
                })
                .catch((err) => {
                    console.error(err);

                })
        }
    }


    const GRNOrderListColumn = [

        {
            key: 'id',
            name: 'S.No',
        },
        {
            key: 'pk',
            name: 'GRN Invoice No',
        },
        {
            key: 'GRN_No',
            name: 'GRN No',
        },
        {
            key: 'IsQuickGRN',
            name: 'Is Quick GRN',
            renderCell: (params) => (
                params.row.IsQuickGRN ? 'Yes' : 'No'
            )
        },
        {
            key: 'GrnDate',
            name: 'GRN Date',
        },
        {
            key: 'Purchase_order_Detials',
            name: 'PO Number',
            renderCell: (params) => (
                params.row.Purchase_order_Detials ? params.row.Purchase_order_Detials : "Nill"
            )
        },
        // {
        //     key: 'SupplierCode',
        //     name: 'Supplier Code',
        // },
        {
            key: 'SupplierName',
            name: 'SupplierName',
        },
        {
            key: 'FileAttachment',
            name: 'Supplier Bill file',
            renderCell: (params) => (
                <>
                    <Button className="cell_btn"
                        onClick={() => HandelViewdata(params.row.FileAttachment)}
                    >
                        <VisibilityIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        },
        {
            key: 'GRN_Items',
            name: 'GRN Items List',
            renderCell: (params) => (
                <>
                    <Button className="cell_btn"
                        onClick={() => ItemView(params.row)}
                    >
                        <ListIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        },
        {
            key: 'Supplier_Bill_Number',
            name: 'Supplier Bill Number',
        },
        {
            key: 'Supplier_Bill_Date',
            name: 'Supplier Bill Date',

        },
        // {
        //     key: 'Supplier_Bill_Due_Date',
        //     name: 'Supplier Bill Due Date',

        // },
        {
            key: 'Supplier_Bill_Amount',
            name: 'Supplier Bill Amount',
        },
        // {
        //     key: 'Use_BillingLocation',
        //     name: 'Billing Location',
        //     renderCell: (params) => (
        //         params.row.Use_BillingLocation ? params.row.Use_BillingLocation : "Nill"
        //     )
        // },
        // {
        //     key: 'Store_location',
        //     name: 'Shipping Location',
        // },
        {
            key: 'Received_person',
            name: 'Receiving Person',
        },
        {
            key: 'Is_Foc_Available',
            name: 'Is Foc Available',
            renderCell: (params) => (
                params.row.Is_Foc_Available ? 'Yes' : 'No'
            )
        },
        {
            key: 'Foc_Method',
            name: 'Foc Method',
        },
        {
            key: 'Taxable_Amount',
            name: 'Taxable Amount',
        },
        {
            key: 'Tax_Amount',
            name: 'Tax Amount',
        },
        {
            key: 'Total_Amount',
            name: 'Total Amount',
        },
        {
            key: 'Total_Discount_Method',
            name: 'Total Discount Method',
            renderCell: (params) => (
                params.row.Total_Discount_Method ? params.row.Total_Discount_Method : "Nill"
            )
        },
        {
            key: 'Total_Discount_Type',
            name: 'Total Discount Type',
            renderCell: (params) => (
                params.row.Total_Discount_Method ? params.row.Total_Discount_Type : "Nill"
            )
        },
        {
            key: 'Discount_Amount',
            name: 'Total Discount',
            renderCell: (params) => (
                params.row.Total_Discount_Method ? params.row.Discount_Amount : "Nill"
            )
        },
        {
            key: 'Final_Taxable_Amount',
            name: 'Final Taxable Total',
        },
        {
            key: 'Final_Tax_Amount',
            name: 'Final Tax Total',
        },
        {
            key: 'Final_Total_Amount',
            name: 'Final Total Amount',
        },
        {
            key: 'Round_off_Amount',
            name: 'RoundOff',
        },
        {
            key: 'Net_Amount',
            name: 'NetAmount',
        },
        {
            key: 'Status',
            name: 'Status',
        },
        {
            key: 'Edit',
            name: 'Edit',
            renderCell: (params) => (
                <>
                    {params.row.Status === 'Recieved' ?
                        <Button className="cell_btn"
                            onClick={() => HandelEditdata(params.row)}
                        >
                            <EditIcon className="check_box_clrr_cancell" />
                        </Button> :
                        <>No Action</>}
                </>
            )
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                <>
                    {params.row.Status === 'Recieved' ?
                        <Button className="cell_btn"
                            onClick={() => HandelApprovedata(params.row)}
                        >
                            <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
                        </Button> :
                        <Button className="cell_btn">
                            Approved
                        </Button>
                    }
                </>
            )
        },

    ]


    const ItemColumn = [
        {
            key: 'id',
            name: 'S.No',
        },
        {
            key: 'ItemCode',
            name: 'Item Code',
        },
        {
            key: 'ItemName',
            name: 'Item Name',
        },
        {
            key: 'IsFOCProduct',
            name: 'Is Foc Product',
            renderCell: (params) => (
                params.row.Is_Foc_Product ? 'Yes' : 'No'
            )
        },
        {
            key: 'FOCItemCode',
            name: 'FOC Item Code',
            renderCell: (params) => (
                params.row.FOCItemCode ? params.row.FOCItemCode : "Nill"
            )
        },
        {
            key: 'FOCItemName',
            name: 'FOC Item Name',
            renderCell: (params) => (
                params.row.FOCItemName ? params.row.FOCItemName : "Nill"
            )
        },
        {
            key: 'TaxType',
            name: 'Tax Type',
        },
        {
            key: 'PurchaseRateTaxable',
            name: 'Purchase rate taxable',
        },
        {
            key: 'TaxPercentage',
            name: 'Tax Percentage',
        },
        {
            key: 'PurchaseRateWithTax',
            name: 'Purchase rate with tax',
        },
        {
            key: 'MRP',
            name: 'Purchase MRP',
        },
        {
            key: 'ReceivedQty',
            name: 'Received Quantity',
        },
        {
            key: 'FOCQuantity',
            name: 'FOC Quantity',
            renderCell: (params) => (
                params.row.FOCQuantity ? params.row.FOCQuantity : "Nill"
            )
        },
        {
            key: 'TotalReceivedQty',
            name: 'Total Received Quantity',
        },
        {
            key: 'TotalPackQuantity',
            name: 'Total Pack Quantity',
        },
        {
            key: 'IsMRPAsSellablePrice',
            name: 'Is MRP as sellable price',
            renderCell: (params) => (
                params.row.IsMRPAsSellablePrice ? 'Yes' : 'No'
            )
        },
        {
            key: 'SellablePrice',
            name: 'Sellable price',
        },
        {
            key: 'SellableQtyPrice',
            name: 'Sellable qty price',
        },
        {
            key: 'TotalPackTaxableAmount',
            name: 'Total Pack Taxable Amount',
        },
        {
            key: 'TotalTaxAmount',
            name: 'Total Pack Tax Amount',
        },
        {
            key: 'TotalPackAmount',
            name: 'Total Packi Amount with tax',
        },
        {
            key: 'BatchNo',
            name: 'Batch_No',
        },
        {
            key: 'ManufactureDate',
            name: 'Manufacture Date',
        },
        {
            key: 'ExpiryDate',
            name: 'Expiry Date',
        },
        {
            key: 'DiscountMethod',
            name: 'Discount Method',
            renderCell: (params) => (
                params.row.DiscountMethod ? params.row.DiscountMethod : "Nill"
            )
        },
        {
            key: 'DiscountType',
            name: 'Discount Type',
            renderCell: (params) => (
                params.row.DiscountMethod ? params.row.DiscountType : "Nill"
            )
        },
        {
            key: 'Discount',
            name: 'Discount Amount',
            renderCell: (params) => (
                params.row.DiscountMethod ? params.row.Discount : "Nill"
            )
        },
        {
            key: 'FinalTotalPackTaxableAmount',
            name: 'Final Total Pack Taxable Amount',
        },
        {
            key: 'FinalTotalTaxAmount',
            name: 'Final Total Pack Tax Amount',
        },
        {
            key: 'FinalTotalPackAmount',
            name: 'Final Total Pack Amount with tax',
        },

        {
            key: 'Status',
            name: 'Status',

        },

    ]


    return (
        <>

            <div className="Main_container_app">
                <h3>Goods Receipt Note Approve List</h3>
                <br />
                <div className="RegisFormcon_1">

                    <div className="RegisForm_1">
                        <label>GRN Type<span>:</span></label>

                        <select
                            name='GRNType'
                            value={searchQuery.GRNType}
                            onChange={handleonchange}
                        >
                            <option value=''>Select</option>
                            <option value='OldGRN'> Old GRN </option>
                            <option value='QuickGRN'> Quick GRN </option>
                            <option value='GRN'> GRN </option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Status<span>:</span></label>

                        <select
                            name='StatusCheck'
                            value={searchQuery.StatusCheck}
                            onChange={handleonchange}
                        >
                            <option value=''>Select</option>
                            <option value='Recieved'> Waiting For Approve </option>
                            <option value='Approved'> Approved </option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Date Type<span>:</span></label>
                        <select
                            name='DateType'
                            value={searchQuery.DateType}
                            onChange={handleonchange}
                        >
                            <option value=''>Select</option>
                            <option value='Current'>Current Date</option>
                            <option value='Customize'>Customize</option>
                        </select>
                    </div>

                    {searchQuery.DateType === 'Current' ?
                        <div className="RegisForm_1">
                            <label>Current Date<span>:</span></label>
                            <input
                                type='date'
                                name='CurrentDate'
                                value={searchQuery.CurrentDate}
                                onChange={handleonchange}
                                readOnly
                            />

                        </div>
                        :
                        <>
                            <div className="RegisForm_1">
                                <label>From Date<span>:</span></label>
                                <input
                                    type='date'
                                    name='FromDate'
                                    value={searchQuery.FromDate}
                                    onChange={handleonchange}
                                />

                            </div>


                            <div className="RegisForm_1">
                                <label>To Date<span>:</span></label>
                                <input
                                    type='date'
                                    name='ToDate'
                                    value={searchQuery.ToDate}
                                    onChange={handleonchange}
                                    min={searchQuery.FromDate}
                                />

                            </div>
                        </>}

                    <div className="RegisForm_1">
                        <label>Supplier Id<span>:</span></label>
                        <input
                            type='text'
                            name='SupplierId'
                            value={searchQuery.SupplierId}
                            onChange={handleonchange}
                            list='SupplierIdList'
                        />
                        <datalist id='SupplierIdList'>
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
                            value={searchQuery.SupplierName}
                            onChange={handleonchange}
                            list='SupplierNameList'
                        />
                        <datalist id='SupplierNameList'>
                            {
                                supplierArray.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.SupplierName} ></option>
                                ))
                            }
                        </datalist>

                    </div>


                    <div className="RegisForm_1">
                        <label>GRN Location<span>:</span></label>
                        <select
                            id='GRNLocation'
                            name='GRNLocation'
                            value={searchQuery.GRNLocation}
                            onChange={handleonchange}
                        >
                            <option value=''>Select</option>
                            {
                                LocationData.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
                                ))

                            }
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Store Name<span>:</span></label>
                        <select
                            id='StoreId'
                            name='StoreId'
                            value={searchQuery.StoreId}
                            onChange={handleonchange}
                            autoComplete="off"
                        >
                            <option value=''>Select</option>
                            {
                                StoreData.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.id} >{ele.StoreName}</option>
                                ))

                            }
                        </select>
                    </div>

                </div>

                <br />
                <div className="RegisFormcon_1 jjxjx_">
                    <ReactGrid columns={GRNOrderListColumn} RowData={GrnData} />
                </div>
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
            <ModelContainer />

            {ShowItems && ItemsData.length !== 0 && (
                <div className="loader" onClick={() => setShowItems(false)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />

                        <div className="common_center_tag">
                            <span>Item Details</span>
                        </div>
                        <br />
                        <br />

                        <ReactGrid columns={ItemColumn} RowData={ItemsData} />
                    </div>
                </div>
            )}
        </>

    )
}

export default GrnApproveGEN;