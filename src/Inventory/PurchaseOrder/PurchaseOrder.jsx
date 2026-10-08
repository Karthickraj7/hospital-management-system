
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';

const PurchaseOrder = () => {
    const dispatchvalue = useDispatch();
    const UserData = useSelector((state) => state.userRecord?.UserData);
    console.log('UserData', UserData)

    const navigate = useNavigate();

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const toast = useSelector(state => state.userRecord?.toast);

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const EdittData = useSelector(state => state.Inventorydata?.PurchaseOrderList);

    console.log('EdittData__', EdittData)

    const [LocationData, setLocationData] = useState([]);
    const [ProductArray, setProductArray] = useState([]);
    console.log('ProductArray', ProductArray);
    const [supplierArray, setsupplierArray] = useState([])
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
const [remarksOptions, setRemarksOptions] = useState([
  "Box",
  "Packet",
  "Pouch",
  "Bottle",
  "Tin / Can",
  "Jar",
  "Sachet",
  "Piece / Unit",
  "Bundle / Set",
  "Loose / Open Sale",
  "Carton",
  "Bag"
]);


    const [PurchaseOrder, setPurchaseOrder] = useState({
        SupplierId: '',
        SupplierName: '',
        // SupplierMailId: '',
        // SupplierContactNumber: '',
        // SupplierContactPerson: '',
        OrderDate: currentDate,
        DeliveryExpectedDate: '',
        BillingLocation: '',
        BillingAddress: '',
        ShippingLocation: '',
        ShippingAddress: '',
        TotalOrderValue: '',
    })

    const allowedCategoryIds = UserData.ProductCategory_list.map(item => item.ProductCategoryAccessId);

    const filteredProductCategoryData = ProductArray.filter(
        item => allowedCategoryIds.includes(item.ProductCategory_pk)
    );
    console.log('filteredProductCategoryData', filteredProductCategoryData)

    const [ItemDetails, SetItemDetails] = useState({
        ItemCode: '',
        ItemName: '',
        PurchaseQty: '',
        Remarks:'',
        TotalAmount: '',
    })

    console.log('ItemDetails--', ItemDetails);

    const [POItemArrays, setPOItemArrays] = useState([]);
    console.log("POItemArrays", POItemArrays);


    // console.log('000------0000009999', POItemArrays);


    const ClearPurchaseOrder = () => {

        setPurchaseOrder({
            SupplierId: '',
            SupplierName: '',
            // SupplierMailId: '',
            // SupplierContactNumber: '',
            // SupplierContactPerson: '',
            OrderDate: currentDate,
            DeliveryExpectedDate: '',
            BillingLocation: '',
            BillingAddress: '',
            ShippingLocation: '',
            ShippingAddress: '',
            TotalOrderValue: '',
        })
    }

    const ClearItemState = () => {
        SetItemDetails({
            ItemCode: '',
            ItemName: '',
            PurchaseQty: '',
            TotalAmount: '',
            Remarks:'',
        })
    }

    const formatLabel = (label) => {

        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };

    const getInputType = (name) => {
        if (['SupplierMailId'].includes(name)) return 'email';
        if (['OrderDate', 'DeliveryExpectedDate'].includes(name)) return 'date';
        if (['SupplierContactNumber', 'TotalOrderValue', 'PurchaseQty', 'TotalAmount'].includes(name)) return 'number';
        if (['Remarks'].includes(name)) return 'text';
        return 'text';
    };



    const GetAddressbylocation = async (location) => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Clinic_Detials_link?location=${+location}`);
            const result = res.data;

            if (result && Object.values(result).length !== 0) {
                // console.log('result-----', result.merged_address);
                return result.merged_address;
            }
            return '';
        } catch (err) {
            console.log(err);
            return '';
        }
    }


    // -------------------------------Edit data ----------------------------------------------


    useEffect(() => {
        const updatePurchaseOrder = async () => {
            if (EdittData && Object.keys(EdittData).length !== 0) {
                const {
                    id,
                    Use_BillingLocation,
                    Use_ShippingLocation,
                    Item_Details,
                    BillingLocation,
                    ShippingLocation,
                    PO_Status,
                    ...rest
                } = EdittData;

                const Adddata = await GetAddressbylocation(BillingLocation);
                const Adddata2 = await GetAddressbylocation(ShippingLocation);

                // Set the PurchaseOrder state
                setPurchaseOrder((prev) => ({
                    PurchaseOrderNumber: id,
                    ...prev,
                    ...rest,
                    BillingLocation: BillingLocation,
                    BillingAddress: Adddata,
                    ShippingLocation: ShippingLocation,
                    ShippingAddress: Adddata2,
                }));

                if (Item_Details && Item_Details.length !== 0) {
                    const Clearedetail = Item_Details.map((item) => {
                        const {
                            Item_Status,
                            Reason,
                            Received_Qty,
                            Balance_Qty,
                            ...rest
                        } = item;
                        return rest;
                    });

                    setPOItemArrays(Clearedetail);
                }
            }
        };

        updatePurchaseOrder();
    }, [EdittData]);

    // ------------------------------------------------------------------------------------------------------


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data
                setLocationData(ress)
            })
            .catch((err) => {
                console.log(err);
            })


    }, [UrlLink])

    // -----------------------------------



    // -------------------------------------

    useEffect(() => {

        axios.get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
            .then((res) => {
                // console.log('pppp----', res.data);
                let Rdata = res.data
                if (Array.isArray(Rdata)) {
                    setsupplierArray(Rdata)

                }
            })
            .catch((err) => {
                console.log(err);

            })

    }, [UrlLink])




    useEffect(() => {
        if (PurchaseOrder.SupplierId !== '' || POItemArrays.length !== 0) {

            // console.log('POItemArrays?????',POItemArrays);

            const POitems = POItemArrays?.map(ele => +ele.ItemCode)

            // console.log('POitems?????',POitems);


            axios.get(`${UrlLink}Inventory/PO_SupplierWise_product_Get?SupplierId=${PurchaseOrder.SupplierId}&POitems=${POitems}`)
                .then((res) => {
                    let data = res.data;

                    if (Array.isArray(data) && POItemArrays.length === 0 && data.length === 0) {
                        alert('Products were not mapped for supplier, so unable to create purchase order')
                        ClearPurchaseOrder()
                        setProductArray([])
                    }
                    else if (Array.isArray(data) && data.length !== 0) {
                        setProductArray(data)
                        console.log("setProductArray", data);
                    }

                })
                .catch((err) => {
                    console.log(err)
                })

        }




    }, [UrlLink, PurchaseOrder.SupplierId, POItemArrays])



    useEffect(() => {

        if (POItemArrays && POItemArrays.length !== 0) {

            const TotalNetAmount = POItemArrays.reduce((accumulator, item) => accumulator + (+item.TotalAmount || 0), 0);
            // console.log('TotalNetAmount---',TotalNetAmount);

            setPurchaseOrder((prev) => ({
                ...prev,
                TotalOrderValue: TotalNetAmount,
            }))
        }
        else {

            setPurchaseOrder((prev) => ({
                ...prev,
                TotalOrderValue: '',
            }))

        }

    }, [POItemArrays])






    const calculateDeliveryDate = (orderDate, leadTime) => {
        // Ensure orderDate is properly converted to a Date object
        const orderDateObj = new window.Date(orderDate);

        // Create a new Date object for deliveryDate
        const deliveryDate = new window.Date(orderDateObj);

        // Add the leadTime to the orderDate
        deliveryDate.setDate(orderDateObj.getDate() + leadTime);

        // Format the new DeliveryDate to "yyyy-MM-dd"
        const formattedDeliveryDate = deliveryDate.toISOString().split('T')[0];

        return formattedDeliveryDate;
    }


    const Getsinglesupp = async (SupplierId) => {

        try {
            const res = await axios.get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierId=${SupplierId}`);
            const result = res.data;
            if (result && Object.values(result).length !== 0) {
                return result;
            }

        }
        catch (err) {
            console.log(err);
            return '';
        }

    }




    const HadelonchageSupplier = async (e) => {

        const { name, value } = e.target

        if (name === 'SupplierId') {

            let find = supplierArray.find((ele) => ele.id === value)

            if (find) {

                let getobj = await Getsinglesupp(value)

                const dateCalulation = calculateDeliveryDate(currentDate, getobj?.LeadTime)


                setPurchaseOrder((prev) => ({
                    ...prev,
                    [name]: value,
                    SupplierName: find.SupplierName,
                    // SupplierMailId: getobj?.EmailAddress || '',
                    // SupplierContactNumber: getobj?.ContactNumber || '',
                    // SupplierContactPerson: getobj?.ContactPerson || '',
                    DeliveryExpectedDate: dateCalulation || '',
                    BillingLocation: '',
                    BillingAddress: '',
                    ShippingLocation: '',
                    ShippingAddress: '',
                    TotalOrderValue: '',
                }))


            }
            else {
                setPurchaseOrder((prev) => ({
                    ...prev,
                    [name]: value,
                    SupplierName: '',
                    // SupplierMailId: '',
                    // SupplierContactNumber: '',
                    // SupplierContactPerson: '',
                    DeliveryExpectedDate: '',
                    BillingLocation: '',
                    BillingAddress: '',
                    ShippingLocation: '',
                    ShippingAddress: '',
                    TotalOrderValue: '',
                }))
            }


        }
        else if (name === 'SupplierName') {


            let find = supplierArray.find((ele) => ele.SupplierName === value)

            if (find) {

                let getobj = await Getsinglesupp(find?.id)

                const dateCalulation = calculateDeliveryDate(currentDate, getobj?.LeadTime)


                setPurchaseOrder((prev) => ({
                    ...prev,
                    [name]: value,
                    SupplierId: find.id,
                    SupplierName: find.SupplierName,
                    // SupplierMailId: getobj?.EmailAddress || '',
                    // SupplierContactNumber: getobj?.ContactNumber || '',
                    // SupplierContactPerson: getobj?.ContactPerson || '',
                    DeliveryExpectedDate: dateCalulation || '',
                    BillingLocation: '',
                    BillingAddress: '',
                    ShippingLocation: '',
                    ShippingAddress: '',
                    TotalOrderValue: '',
                }))


            }
            else {
                setPurchaseOrder((prev) => ({
                    ...prev,
                    [name]: value,
                    SupplierId: '',
                    // SupplierMailId: '',
                    // SupplierContactNumber: '',
                    // SupplierContactPerson: '',
                    DeliveryExpectedDate: '',
                    BillingLocation: '',
                    BillingAddress: '',
                    ShippingLocation: '',
                    ShippingAddress: '',
                    TotalOrderValue: '',
                }))
            }



        }
        else if (name === 'BillingLocation') {

            const Adddata = await GetAddressbylocation(value);

            if (Adddata) {

                setPurchaseOrder((prev) => ({
                    ...prev,
                    [name]: value,
                    BillingAddress: Adddata,
                }))

            }
            else {
                setPurchaseOrder((prev) => ({
                    ...prev,
                    [name]: value,
                    BillingAddress: '',
                }))
            }


        }
        else if (name === 'ShippingLocation') {

            const Adddata = await GetAddressbylocation(value);

            if (Adddata) {

                setPurchaseOrder((prev) => ({
                    ...prev,
                    [name]: value,
                    ShippingAddress: Adddata,
                }))

            }
            else {
                setPurchaseOrder((prev) => ({
                    ...prev,
                    [name]: value,
                    ShippingAddress: '',
                }))
            }


        }
        else {
            setPurchaseOrder((prev) => ({
                ...prev,
                [name]: value
            }))
        }


    }

  const HandleItemChange = (e) => {
    const { name, value } = e.target;

    if (name === 'ItemCode') {
        let find = ProductArray.find((ele) => +ele.ItemCode === +value);
        if (find) {
            let { ProductCategory_pk, SubCategory_pk, ItemCode, ItemName, Is_Manufacture_Date_Available,
                Is_Expiry_Date_Available, GenericName_pk, ManufacturerName_pk, PackType_pk, ...rest } = find;

            SetItemDetails({
                [name]: value,
                ItemName: ItemName,
                ...rest,
                PurchaseQty: '',
                TotalAmount: '',
                Remarks: '' // Reset remarks when item changes
            })
        } else {
            SetItemDetails({
                [name]: value,
                ItemName: '',
                PurchaseQty: '',
                TotalAmount: '',
                Remarks: ''
            })
        }
    }
    else if (name === 'ItemName') {
        let find = ProductArray.find((ele) => ele.ItemName === value);
        if (find) {
            let { ProductCategory_pk, SubCategory_pk, ItemCode, ItemName, Is_Manufacture_Date_Available,
                Is_Expiry_Date_Available, GenericName_pk, ManufacturerName_pk, PackType_pk, ...rest } = find;

            SetItemDetails({
                ItemCode: ItemCode,
                [name]: value,
                ...rest,
                PurchaseQty: '',
                TotalAmount: '',
                Remarks: '' // Reset remarks when item changes
            })
        } else {
            SetItemDetails({
                ItemCode: '',
                [name]: value,
                PurchaseQty: '',
                TotalAmount: '',
                Remarks: ''
            })
        }
    }
    else if (name === 'PurchaseQty') {
        let Total = +ItemDetails?.PurchaseRateAfterGST * +value;
        SetItemDetails((prev) => ({
            ...prev,
            [name]: value,
            TotalAmount: Total.toFixed(2) || '',
        }))
    }
    else {
        // For Remarks and other fields
        SetItemDetails((prev) => ({
            ...prev,
            [name]: value
        }))
    }
}



    const HandleAddProduct = () => {

        let requiredFields = [
            'ItemCode',
            'ItemName',
            'PurchaseQty',
            'TotalAmount',
            'Remarks'
        ]

        const missingFields = requiredFields.filter(
            (field) => !ItemDetails[field]
        )

        const CheckDub = POItemArrays.some(
            (product) => +product.ItemCode === +ItemDetails.ItemCode
                && product?.id !== ItemDetails?.id)

        if (missingFields.length !== 0) {

            const tdata = {
                message: `Please fill out all required fields: ${missingFields.join(", ")}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
        else if (CheckDub) {

            const tdata = {
                message: `This Item Already Entered`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
        else {
            if (ItemDetails.id) {

                setPOItemArrays((prev) =>
                    prev.map((Product) =>
                        Product.id === ItemDetails.id ? { ...ItemDetails } : Product)
                )
                ClearItemState();
            }
            else {
                setPOItemArrays((prev) => [
                    ...prev,
                    {
                        ...ItemDetails,
                        id: prev.length + 1,
                    }
                ])
                ClearItemState();
            }
        }

    }




    const HandelEditdata = (row) => {
        // console.log('row',row)

        SetItemDetails({
            ...row
        })


    }


    const handleDeleteItem = (row) => {

        ClearItemState()

        const updatedArray = POItemArrays.filter((ele) => ele.id !== row.id);

        const reindexedArray = updatedArray.map((item, index) => ({
            ...item,
            id: index + 1,
        }));

        setPOItemArrays(reindexedArray)

        const tdata = {
            message: `${row.ItemName} has been deleted successfully.`,
            type: 'success'
        };
        dispatchvalue({ type: 'toast', value: tdata });

    }


    const ProductListColumn = [
        {
            key: 'id',
            name: 'S.No',
            frozen: true
        },
        {
            key: 'ItemCode',
            name: 'Item Code',
            frozen: true
        },
        {
            key: 'ItemName',
            name: 'Item Name',
            frozen: true
        },
        {
            key: 'ProductCategory',
            name: 'Product Category',
            frozen: true
        },
        {
            key: 'SubCategory',
            name: 'Sub Category'
        },
        {
            key: 'GenericName',
            name: 'Generic Name'
        },
        {
            key: 'ManufacturerName',
            name: 'Manufacturer Name'
        },

        {
            key: 'Strength',
            name: 'Strength'
        },
        {
            key: 'StrengthType',
            name: 'StrengthType'
        },
        {
            key: 'Volume',
            name: 'Volume',
        },
        {
            key: 'VolumeType',
            name: 'Volume Type',
        },
        {
            key: 'PackType',
            name: 'Pack Type',
        },
        {
            key: 'PackQty',
            name: 'Pack Qty',
        },
        {
            key: 'MRP',
            name: 'MRP'
        },
        {
            key: 'PurchaseRateBeforeGST',
            name: 'Purchase Rate Before GST'
        },
        {
            key: 'GST',
            name: 'GST'
        },
        {
            key: 'PurchaseRateAfterGST',
            name: 'Purchase Rate After GST'
        },
        {
            key: 'PurchaseQty',
            name: 'Purchase Qty'
        },
        {
            key: 'Remarks',
            name: 'Remarks'
        },
        {
            key: 'TotalAmount',
            name: 'Total Amount'
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (Params) => (
                <>
                    <Button className="cell_btn"
                        onClick={() => HandelEditdata(Params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn"
                        onClick={() => handleDeleteItem(Params.row)}
                    >
                        <DeleteOutlineIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }
    ]


    const [pageAccess, setPageAccess] = useState([]);

    useEffect(() => {
        if (UserData?.inventory_access[0]?.Store_Id || 1) {
            console.log('store', UserData?.inventory_access[0]?.Store_Id || 1)
            const fetchData = async () => {
                try {
                    const response = await axios.get(
                        `${UrlLink}Masters/inventory_page_access_by_storeid`,
                        {
                            params: { Storeid: UserData.inventory_access[0].Store_Id || 1 },
                        }
                    );
                    const ress = response.data;
                    console.log('ress', ress)
                    if (ress.length > 0 && ress[0].page_access) {
                        setPageAccess(ress[0].page_access[0]);
                    }
                } catch (err) {
                    console.error("Error fetching page access:", err);
                }
            };
            fetchData();
        }
    }, [UrlLink, UserData]);

    const SavePurchaseOrder = () => {

        let requiredFields = [
            'SupplierName',
            // 'SupplierMailId',
            // 'SupplierContactNumber',
            // 'SupplierContactPerson',
            'OrderDate',
            // 'DeliveryExpectedDate',
            // 'BillingLocation',
            // 'BillingAddress',
            // 'ShippingLocation',
            // 'ShippingAddress',
            // 'TotalOrderValue'
        ]

        let missingFields = requiredFields.filter(
            (field) => !PurchaseOrder[field]
        )
        if (missingFields.length !== 0) {

            const tdata = {
                message: `Please fill out all required fields: ${missingFields.join(", ")}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });

        }
        else {

            let Senddata = {
                ...PurchaseOrder,
                IS_PurchaseOrder_Approve: pageAccess.IS_PurchaseOrder_Approve || true,
                POItemArrays: POItemArrays,
                Create_by: userRecord?.username,

            }

            console.log('Senddata---', Senddata);


            axios.post(`${UrlLink}Inventory/PurchaseOrder_Link`, Senddata)
                .then((res) => {
                    console.log(res.data);

                    let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                    dispatchvalue({ type: 'toast', value: tdata });
                    if (type === 'success') {
                        navigate('/Home/PurchaseOrderList');
                        dispatchvalue({ type: 'PurchaseOrderList', value: {} })
                    }
                })
                .catch((err) => {
                    console.log(err);
                })


        }

    }

    const excludedFields = [
        'id',
        'PackType_pk',
        'ProductCategory_pk',
        'SubCategory_pk',
        'ManufacturerName_pk',
        'GenericName_pk',
        'Is_Expiry_Date_Available'
    ];

  return (
    <>
        <div className="Main_container_app">
            <h3>Purchase Order</h3>

            <br />

            <div className="RegisFormcon_1">
                {
                    Object.keys(PurchaseOrder).map((StateName, Index) => {
                        return (
                            <div className="RegisForm_1" key={Index + 'key'}>
                                <label htmlFor={StateName}>{formatLabel(StateName)} <span>:</span></label>

                                {['BillingLocation', 'ShippingLocation'].includes(StateName) ?
                                    <select
                                        type={getInputType(StateName)}
                                        id={StateName}
                                        name={StateName}
                                        value={PurchaseOrder[StateName]}
                                        onChange={HadelonchageSupplier}
                                    >
                                        <option value=''>Select</option>
                                        {
                                            LocationData.map((ele, ind) => (
                                                <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
                                            ))
                                        }
                                    </select>
                                    :
                                    ['BillingAddress', 'ShippingAddress'].includes(StateName) ?
                                        <textarea
                                            type={getInputType(StateName)}
                                            id={StateName}
                                            name={StateName}
                                            value={PurchaseOrder[StateName]}
                                            onChange={HadelonchageSupplier}
                                            disabled
                                        >
                                        </textarea>
                                        :
                                        <input
                                            type={getInputType(StateName)}
                                            id={StateName}
                                            name={StateName}
                                            value={PurchaseOrder[StateName]}
                                            onChange={HadelonchageSupplier}
                                            autoComplete='off'
                                            list={['SupplierId', 'SupplierName'].includes(StateName) ? StateName + 'List' : undefined}
                                            min={StateName === 'DeliveryExpectedDate' ? currentDate : ''}
                                            disabled={!['DeliveryExpectedDate', 'SupplierId', 'SupplierName', 'ShippingLocation'].includes(StateName)}
                                        />
                                }
                                {['SupplierId', 'SupplierName'].includes(StateName) && (
                                    <datalist id={StateName + 'List'}>
                                        {supplierArray.map((option, index) => (
                                            <option key={index + 'key'} value={StateName === 'SupplierId' ? option.id : option.SupplierName} />
                                        ))}
                                    </datalist>
                                )}
                            </div>
                        )
                    })
                }
            </div>

            <br />

            <div className="common_center_tag">
                <span>Item Details</span>
            </div>

            <br />

            {/* ADD THIS SECTION - Item Details Form with Remarks Dropdown */}
            <div className="RegisFormcon_1">
                {Object.keys(ItemDetails)
                    .filter((key) => !excludedFields.includes(key))
                    .map((StateName2, Index) => (
                        <div className="RegisForm_1" key={Index + 'key'}>
                            <label htmlFor={StateName2}>
                                {formatLabel(StateName2)} <span>:</span>
                            </label>

                            {StateName2 === 'Remarks' ? (
                                // Select dropdown for Remarks
                                <select
                                    id={StateName2}
                                    name={StateName2}
                                    value={ItemDetails[StateName2]}
                                    onChange={HandleItemChange}
                                    disabled={!['PurchaseQty', 'ItemCode', 'ItemName', 'Remarks'].includes(StateName2)}
                                >
                                    <option value="">Select Remark</option>
                                    {remarksOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                // Existing input fields for other items
                                <>
                                    <input
                                        type={getInputType(StateName2)}
                                        id={StateName2}
                                        name={StateName2}
                                        value={ItemDetails[StateName2]}
                                        list={StateName2 + 'List'}
                                        autoComplete="off"
                                        disabled={!['PurchaseQty', 'ItemCode', 'ItemName', 'Remarks'].includes(StateName2)}
                                        onChange={HandleItemChange}
                                    />

                                    {['ItemCode', 'ItemName'].includes(StateName2) && (
                                        <datalist id={StateName2 + 'List'}>
                                            {(filteredProductCategoryData?.length ? filteredProductCategoryData : ProductArray).map(
                                                (option, index) => (
                                                    <option
                                                        key={index + 'key'}
                                                        value={StateName2 === 'ItemCode' ? option.ItemCode : option.ItemName}
                                                    />
                                                )
                                            )}
                                        </datalist>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
            </div>

            <br />
            <div className="Main_container_Btn">
                <button onClick={HandleAddProduct}>
                    {ItemDetails.id ? 'Update' : 'Add'}
                </button>
            </div>

            <div className='RegisFormcon_1 jjxjx_'>
                <ReactGrid columns={ProductListColumn} RowData={POItemArrays} />
            </div>

            {Object.keys(POItemArrays).length !== 0 &&
                <div className="Main_container_Btn">
                    <button onClick={SavePurchaseOrder}>
                        {PurchaseOrder.PurchaseOrderNumber ? 'Update' : 'Save'}
                    </button>
                </div>
            }
            <br />

        </div>

        <ToastAlert Message={toast.message} Type={toast.type} />
    </>
)
}

export default PurchaseOrder;















