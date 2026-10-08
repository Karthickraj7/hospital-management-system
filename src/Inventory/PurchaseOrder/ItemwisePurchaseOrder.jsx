import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { useNavigate } from 'react-router-dom';

const ItemwisePurchaseOrder = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editsupplier, setEditsupplier] = useState("");
    const [ItemWiseSupplierData, setItemWiseSupplierData] = useState(null);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const [ProductCategoryData, setProductCategoryData] = useState([]);
    console.log('ProductCategoryData', ProductCategoryData)

    const [ItemData, setItemData] = useState([]);
    const [ProductArray, setProductArray] = useState([]);
    const [openRow, setOpenRow] = useState(null);
    const [POItemArrays, setPOItemArrays] = useState([]);

    const toggleRow = (SupplierId) => {
        setOpenRow((prevOpenRow) =>
            prevOpenRow === SupplierId ? null : SupplierId
        );
    };


    const [itemwisePo, setItemwisePO] = useState({
        ProductCategoryName: '',
        itemCode: '',
        itemName: '',
        PurchaseQty: '',
        TotalAmount: '',
    });


    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    const [LocationData, setLocationData] = useState([]);

    const [PurchaseOrder, setPurchaseOrder] = useState({
        SupplierId: '',
        SupplierName: '',
        SupplierMailId: '',
        SupplierContactNumber: '',
        SupplierContactPerson: '',
        OrderDate: currentDate,
        DeliveryExpectedDate: '',
        BillingLocation: '',
        BillingAddress: '',
        ShippingLocation: '',
        ShippingAddress: '',
        TotalOrderValue: '',
    });
    console.log('PurchaseOrder', PurchaseOrder)

    const [Supplierid, setSupplierid] = useState(false);

    const [Itemget, setItemget] = useState(false);


    useEffect(() => {
        axios.get(`${UrlLink}Inventory/Product_Category_Product_Details_link`)
            .then(response => setProductCategoryData(response.data || []))
            .catch(err => {
                console.error("Error fetching Product category", err);
                dispatch({ type: 'toast', payload: { message: "Failed to load categories.", type: "warn" } });
            });
    }, [UrlLink, dispatch]);


    useEffect(() => {
        if (itemwisePo.ProductCategoryName) {
            axios.get(`${UrlLink}Inventory/Items_by_ProductCategory_Details?ProductCategory=${itemwisePo.ProductCategoryName}`)
                .then(response => setItemData(Array.isArray(response.data) ? response.data : []))
                .catch(err => {
                    console.error("Error fetching Items", err);
                    setItemData([]);
                });
        }
        else {
            setItemData([]);
        }
    }, [UrlLink, itemwisePo.ProductCategoryName]);





    useEffect(() => {
        if (itemwisePo.itemCode) {
            axios.get(`${UrlLink}Inventory/Item_wise_supplier_getdata?ItemCode=${itemwisePo?.itemCode}`)
                .then((res) => {
                    const { data, Suppliers } = res.data || {};

                    if (Array.isArray(Suppliers) && Suppliers.length > 0) {
                        const suppcolumn = [
                            { key: 'id', name: 'S.No' },
                            { key: 'AmountType', name: 'Amount Type' },
                            ...Suppliers.map((field) => ({
                                key: field.id,
                                name: (
                                    <Button onClick={() => Getsinglesupp(field?.id)}>
                                        {field.Name}
                                    </Button>
                                ),
                            })),
                        ];


                        // Set the supplier data
                        setItemWiseSupplierData({ data, column: suppcolumn });

                    } else {
                        // No suppliers found
                        setItemWiseSupplierData(null);

                        dispatch({
                            type: 'toast',
                            value: {
                                message: 'There is no Supplier Mapped on this Item .',
                                type: 'warn'
                            }
                        });
                    }
                })
                .catch((err) => {
                    console.error("Error fetching supplier data", err);
                    setItemWiseSupplierData(null); // Ensure the supplier data state is cleared
                    dispatch({
                        type: 'toast',
                        value: {
                            message: 'Failed to load supplier data. Please try again later.',
                            type: 'warn'
                        }
                    });
                });
        } else {
            // Clear supplier data when itemCode is empty
            setItemWiseSupplierData(null);

        }
    }, [UrlLink, itemwisePo.itemCode, dispatch]);


    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        if (name === 'ProductCategoryName') {
            setItemwisePO((prev) => ({
                ...prev,
                [name]: value,
                itemCode: '',
                itemName: '',
                PurchaseQty: '',
                TotalAmount: '',
            }));
            setProductArray([]);
            setItemget(false);
            setSupplierid(false);
            ClearPurchaseOrder();
            setItemWiseSupplierData(null);
        } else if (name === 'itemCode') {
            if (value === '') {
                setItemwisePO((prev) => ({
                    ...prev,
                    itemCode: '',
                    itemName: '',
                    PurchaseQty: '',
                    TotalAmount: '',
                }));
                setItemWiseSupplierData(null);
                setProductArray([]);
                setItemget(false);
                setSupplierid(false);
                ClearPurchaseOrder();

            } else {
                const [itemid, itemname] = value.split('-');
                setItemwisePO((prev) => ({
                    ...prev,
                    itemCode: itemid,
                    itemName: itemname,
                    PurchaseQty: '',
                    TotalAmount: '',
                }));

            }
        } else if (name === 'itemName') {
            if (value === '') {
                setItemwisePO((prev) => ({
                    ...prev,
                    itemCode: '',
                    itemName: '',
                    PurchaseQty: '',
                    TotalAmount: '',
                }));
                setProductArray([]);
                setItemget(false);
                setSupplierid(false);
                ClearPurchaseOrder();
                setItemWiseSupplierData(null);
            } else {
                const [itemid, itemname] = value.split('-');
                setItemwisePO((prev) => ({
                    ...prev,
                    itemCode: itemid,
                    itemName: itemname,
                    PurchaseQty: '',
                    TotalAmount: '',
                }));
            }
        } else {
            setItemwisePO((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    }, []);

    const ClearPurchaseOrder = () => {
        setPurchaseOrder({
            SupplierId: '',
            SupplierName: '',
            SupplierMailId: '',
            SupplierContactNumber: '',
            SupplierContactPerson: '',
            OrderDate: currentDate,
            DeliveryExpectedDate: '',
            BillingLocation: '',
            BillingAddress: '',
            ShippingLocation: '',
            ShippingAddress: '',
            TotalOrderValue: '',
        })
    }

    const ClearItemsPo = () => {
        setItemwisePO({
            ProductCategoryName: '',
            itemCode: '',
            itemName: '',
            PurchaseQty: '',
            TotalAmount: '',
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



    useEffect(() => {
        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data;

                setLocationData(ress)
            })
            .catch((err) => {
                console.log(err);
            })


    }, [UrlLink])


    const Getsinglesupp = (supplier) => {

        if (supplier !== '') {
            setSupplierid(true);
            setItemget(true);
            axios.get(`${UrlLink}Inventory/SupplierId_Supplier_Data_Get?SupplierId=${supplier}`)
                .then((res) => {
                    const result = res.data;
                    const dateCalulation = calculateDeliveryDate(currentDate, result?.LeadTime)
                    setPurchaseOrder((prev) => ({
                        ...prev,
                        SupplierId: result.id || '',
                        SupplierName: result.SupplierName || '',
                        SupplierMailId: result.EmailAddress || '',
                        SupplierContactNumber: result.ContactNumber || '',
                        SupplierContactPerson: result.ContactPerson || '',
                        DeliveryExpectedDate: dateCalulation || '',
                        BillingLocation: '',
                        BillingAddress: '',
                        ShippingLocation: '',
                        ShippingAddress: '',
                        TotalOrderValue: '',
                    }));
                    if (result && Object.values(result).length !== 0) {

                        return result;
                    }
                })
        }
        else {
            setSupplierid(false);
            setItemget(false);
            return '';
        }

    };

    useEffect(() => {
        if (itemwisePo.itemCode !== '' && PurchaseOrder.SupplierId !== '' && editsupplier === "") {
            axios.get(`${UrlLink}Inventory/PO_SupplierWise_Item_Get?SupplierId=${PurchaseOrder.SupplierId}&POitems=${itemwisePo.itemCode}`)
                .then((res) => {
                    let data = res.data;
                    if (Array.isArray(data) && data.length === 0) {
                        alert('Products were not mapped for supplier, so unable to create purchase order')
                        ClearPurchaseOrder()
                        setItemget(false);
                        setProductArray([])
                    }
                    else if (Array.isArray(data) && data.length !== 0) {
                        setProductArray(data);

                        let find = ProductArray.find((ele) => +ele.itemCode === +itemwisePo.itemCode)
                        console.log("find", find);
                        if (find) {
                            setItemget(true);
                            let { Is_Manufacture_Date_Available,
                                Is_Expiry_Date_Available, ...rest } = find;

                            setItemwisePO((prev) => ({

                                ...rest,
                                PurchaseQty: '',
                                TotalAmount: '',
                            }));
                        }
                        else {
                            setItemwisePO((prev) => ({
                                ...prev,
                                PurchaseQty: '',
                                TotalAmount: '',
                            }));
                            setItemget(false);
                        }
                    }

                })
                .catch((err) => {
                    console.log(err)
                })
        }

    }, [UrlLink, PurchaseOrder.SupplierId, itemwisePo.itemCode, Itemget, editsupplier]);



    const HadelonchageSupplier = async (e) => {
        const { name, value } = e.target;
        if (name === 'SupplierId') {
            setPurchaseOrder((prev) => ({
                ...prev,
                BillingLocation: '',
                BillingAddress: '',
                ShippingLocation: '',
                ShippingAddress: '',
                TotalOrderValue: '',
            }))
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
        const { name, value } = e.target
        if (name === 'PurchaseQty') {
            let Total = +itemwisePo?.PurchaseRateAfterGST * +value;
            setItemwisePO((prev) => ({
                ...prev,
                [name]: value,
                TotalAmount: Total.toFixed(2) || '',
            }))
        }
        else {
            setItemwisePO((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }



    const SavePurchaseOrder = () => {
        console.log('save--------------------')

        const requiredItemFields = ['PurchaseQty', 'itemCode']; // Ensure itemCode is validated

        const missingItemFields = requiredItemFields.filter((field) => !itemwisePo[field]);

        if (missingItemFields.length > 0) {

            const missingItemFieldsMessage = missingItemFields.length > 0
                ? `Item Details: ${missingItemFields.join(", ")}`
                : null;

            const combinedMessage = [missingItemFieldsMessage]
                .filter(Boolean)
                .join("; ");

            const tdata = {
                message: `Please fill out all required fields: ${combinedMessage}`,
                type: 'warn',
            };

            dispatch({ type: 'toast', value: tdata });
            return;
        }

        const newItemDetails = { ...itemwisePo };

        // Convert TotalAmount to a number
        newItemDetails.TotalAmount = parseFloat(newItemDetails.TotalAmount) || 0;

        const existingSupplierIndex = POItemArrays.findIndex(
            (supplier) => supplier.SupplierId === PurchaseOrder.SupplierId
        );

        if (existingSupplierIndex !== -1) {
            const existingItem = POItemArrays[existingSupplierIndex].items.find(
                (item) => +item.itemCode === +newItemDetails.itemCode
            );

            if (existingItem) {
                const warningMessage = {
                    message: `The item with code ${newItemDetails.itemName} is already added for this supplier.`,
                    type: 'warn',
                };

                dispatch({ type: 'toast', value: warningMessage });
                return;
            }

            // Update TotalOrderValue for the existing supplier
            POItemArrays[existingSupplierIndex].TotalOrderValue =
                parseFloat(POItemArrays[existingSupplierIndex].TotalOrderValue) +
                newItemDetails.TotalAmount;

            POItemArrays[existingSupplierIndex].items.push(newItemDetails);
        } else {
            // Add new supplier
            POItemArrays.push({
                SupplierId: PurchaseOrder.SupplierId,
                SupplierName: PurchaseOrder.SupplierName,
                BillingLocation: PurchaseOrder.BillingLocation || "",
                BillingAddress: PurchaseOrder.BillingLocation || "",
                ShippingLocation: PurchaseOrder.ShippingLocation || "",
                ShippingAddress: PurchaseOrder.ShippingLocation || "",
                OrderDate: PurchaseOrder.OrderDate,
                DeliveryExpectedDate: PurchaseOrder.DeliveryExpectedDate,
                ContactPerson: PurchaseOrder.SupplierContactPerson || "",
                ContactPersonNumber: PurchaseOrder.SupplierContactNumber,
                SupplierMailId: PurchaseOrder.SupplierMailId || "",
                TotalOrderValue: newItemDetails.TotalAmount, // Initialize with numeric TotalAmount
                items: [newItemDetails],
            });
        }

        const successMessage = {
            message: "Purchase Order saved successfully!",
            type: 'success',
        };

        dispatch({ type: 'toast', value: successMessage });

        ClearItemsPo();
        ClearPurchaseOrder();
        setProductArray([]);
        setItemget(false);
        setSupplierid(false);
        setItemWiseSupplierData(null);
    };

    const handleDeleteSupplier = (row) => {
        // console.log('DeleteSupplier', row);
        const updatedArray = POItemArrays.filter((supplier) => supplier.SupplierId !== row.SupplierId);
        setPOItemArrays(updatedArray);
    };



    const handleDeleteSupplierItem = (row, supplierId) => {
        const itemCode = row?.itemCode;

        setPOItemArrays((prevPOItemArrays) => {
            return prevPOItemArrays
                .map((supplier) => {
                    // Check if the supplier matches the given SupplierId
                    if (supplier.SupplierId === supplierId) {
                        // Filter out the item with the matching itemCode
                        const updatedItems = supplier.items.filter((item) => item.itemCode !== itemCode);
                        console.log("updatedItems", updatedItems);

                        if (updatedItems.length > 0) {
                            // Recalculate TotalOrderValue for the supplier
                            const newTotalOrderValue = updatedItems.reduce((total, currentItem) => {
                                return total + parseFloat(currentItem.TotalAmount || 0);
                            }, 0);

                            // Set TotalOrderValue directly to the new value
                            supplier.TotalOrderValue = newTotalOrderValue;

                            // Return the updated supplier
                            return { ...supplier, items: updatedItems, TotalOrderValue: newTotalOrderValue };
                        }
                        return null; // If no items left, remove the supplier
                    }
                    return supplier; // No changes for other suppliers
                })
                .filter(Boolean); // Remove null values (suppliers with no items)
        });
    };


    const [edit, setedit] = useState(true);

    const handleEditSupplierItem = (row, supplierId) => {
        console.log("rowedit", row); // Logs the current row being edited
        console.log("supplierIdedit", supplierId); // Logs the Supplier ID if provided

        if (supplierId) {
            setItemget(true);
            setedit(true);
            setPurchaseOrder({});
            setEditsupplier(supplierId); // Sets the supplier ID in state
            setItemwisePO({
                itemCode: row?.itemCode, // Captures the item code
                itemName: row?.itemName,
                ...row,// Captures the item name
                PurchaseQty: row?.PurchaseQty, // Captures the purchase quantity
                TotalAmount: row?.TotalAmount, // Captures the total amount
                // Merges the rest of the row's properties
            });
        } else {
            setItemwisePO((prev) => ({
                ...prev,
                PurchaseQty: '',
                TotalAmount: '',
            }));
            setEditsupplier("");
            setedit(false);
            setItemget(false);// Clears the supplier ID if none is provided
        }
    };




    const ProductListColumn = [
        {
            key: 'itemCode',
            name: 'Item Code',
            frozen: true
        },
        {
            key: 'itemName',
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
            key: 'HSNCode',
            name: 'HSN Code'
        },
        {
            key: 'Strength',
            name: 'Strength'
        },
        {
            key: 'StrengthType',
            name: 'Strength Type'
        },
        {
            key: 'Volume',
            name: 'Volume'
        },
        {
            key: 'VolumeType',
            name: 'Volume Type'
        },
        {
            key: 'PackType',
            name: 'Pack Type'
        },
        {
            key: 'PackQty',
            name: 'Pack Quantity'
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
            name: 'Purchase Quantity'
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
                    <Button className="cell_btn">
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn">
                        <DeleteOutlineIcon className="check_box_clrr_cancell" onClick={() =>
                            handleDeleteSupplierItem(Params.row, Params.row.SupplierId)
                        } />
                    </Button>
                </>
            )
        }
    ];





    const UpdatePurchaseOrder = () => {
        console.log("Updating Purchase Order");

        if (editsupplier) {
            const updatedPoItems = [...POItemArrays]; // Clone the array to avoid direct mutation

            const supplierIndex = updatedPoItems.findIndex(supplier => supplier.SupplierId === editsupplier);
            console.log("supplierIndex", supplierIndex);

            if (supplierIndex !== -1) {
                const supplier = updatedPoItems[supplierIndex];
                const itemIndex = supplier.items.findIndex(item => item.itemCode === itemwisePo.itemCode);
                console.log("supplier", supplier);
                console.log("itemIndex", itemIndex);

                if (itemIndex !== -1) {
                    const item = supplier.items[itemIndex];
                    const purchaseQty = parseFloat(itemwisePo.PurchaseQty || 0);
                    const purchaseRate = parseFloat(itemwisePo.PurchaseRateAfterGST || 0);
                    const newTotalAmount = parseFloat((purchaseQty * purchaseRate).toFixed(2));


                    // Update the specific item's PurchaseQty and TotalAmount
                    supplier.items[itemIndex] = {
                        ...item,
                        PurchaseQty: purchaseQty,
                        TotalAmount: newTotalAmount,
                    };

                    // Recalculate the TotalOrderValue based on all items
                    let newTotalOrderValue = supplier.items.reduce((total, currentItem) => {
                        return total + parseFloat(currentItem.TotalAmount || 0);
                    }, 0);

                    // Update TotalOrderValue
                    supplier.TotalOrderValue = newTotalOrderValue;

                    // Reflect the changes back to the updated list
                    updatedPoItems[supplierIndex] = supplier;

                    // Update the state with the new POItemArrays
                    setPOItemArrays(updatedPoItems);

                    // Reset the state for the form
                    setItemwisePO({});
                    setEditsupplier("");
                    setItemget(false);
                    setedit(true);

                    console.log("Purchase order updated successfully.");
                } else {
                    dispatch({
                        type: 'toast',
                        value: {
                            message: `Item with code ${itemwisePo.itemCode} not found for supplier ${editsupplier}.`,
                            type: 'warn'
                        }
                    });
                }
            } else {
                dispatch({
                    type: 'toast',
                    value: {
                        message: `Supplier with ID ${editsupplier} not found.`,
                        type: 'warn'
                    }
                });
            }
        }
    };



    const SubmitAllPurchaseOrder = () => {
        let Senddata = {
            POItemArrays: POItemArrays,
            Create_by: userRecord?.username,
        }
        console.log("Senddata", Senddata)
        axios.post(`${UrlLink}Inventory/PurchaseOrder_Itemwise_Link`, Senddata)
            .then((res) => {
                console.log("submit response", res.data);
                let resdata = res.data;
                let type = Object.keys(resdata)[0]
                let mess = Object.values(resdata)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatch({ type: 'toast', value: tdata });
                if (type === 'success') {
                    // navigate('/Home/PurchaseOrderList');
                    navigate("/Home/InventoryMaster");
                    dispatch({ type: "HrFolder", value: "PurchaseOrderList" });
                    dispatch({ type: "setPreviousFolder", value: null });
                    dispatch({ type: "showMenu", value: true });
                    dispatch({ type: 'PurchaseOrderList', value: {} })
                    setPOItemArrays([]);
                }

            })
            .catch((err) => {
                console.log(err);
            })


    };

    const allowedCategoryIds = userRecord.ProductCategory_list.map(item => item.ProductCategoryAccessId);


    const filterProductCategoryData = ProductCategoryData.filter(
        item => allowedCategoryIds.includes(item.id)
    );


    return (
        <div className="Main_container_app">
            <h3>Itemwise PurchaseOrder</h3>

            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label htmlFor="productCategorySelect">Product Category <span>:</span></label>
                    <select
                        id="productCategorySelect"
                        name="ProductCategoryName"
                        value={itemwisePo.ProductCategoryName}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        {(filterProductCategoryData && filterProductCategoryData.length > 0
                            ? filterProductCategoryData
                            : ProductCategoryData.filter(p => p.Status === 'Active')
                        ).map((prod, indx) => (
                            <option key={indx} value={prod.id}>
                                {prod.ProductCategory}
                            </option>
                        ))}

                    </select>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="itemCode">Item Code <span>:</span></label>
                    <input
                        id="itemCode"
                        name="itemCode"
                        value={itemwisePo.itemCode}
                        list="itemCode-options"
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <datalist id="itemCode-options">
                        {ItemData.filter(p => p.Status)
                            .map((ele, ind) => (
                                <option key={`${ind}-code`} value={`${ele.id}-${ele.ItemName}`}>{ele.ItemName}</option>
                            ))}
                    </datalist>
                </div>

                <div className="RegisForm_1">
                    <label htmlFor="itemName">Item Name <span>:</span></label>
                    <input
                        id="itemName"
                        name="itemName"
                        value={itemwisePo.itemName}
                        list="itemName-options"
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <datalist id="itemName-options">
                        {ItemData.filter(p => p.Status)
                            .map((ele, ind) => (
                                <option key={`${ind}-name`} value={`${ele.id}-${ele.ItemName}`}>{ele.ItemName}</option>
                            ))}
                    </datalist>
                </div>
            </div>


            {ItemWiseSupplierData && (
                <div>

                    <div className="common_center_tag">
                        <span>Supplier Wise Item Rate</span>
                    </div>


                    <ReactGrid columns={ItemWiseSupplierData?.column} RowData={ItemWiseSupplierData?.data} />
                </div>

            )}
            <br></br>
            {Supplierid && (


                <div className="RegisFormcon_1">

                    {
                        Object.keys(PurchaseOrder).map((StateName, Index) => {

                            return (
                                <div className="RegisForm_1" key={Index + 'key'}>

                                    <label htmlFor={StateName}>

                                        <div className="imp_v_star">
                                            {['ShippingLocation', 'BillingLocation'].includes(StateName) ? (
                                                <>
                                                    {formatLabel(StateName)}
                                                    <span className="requirreg12">*</span>
                                                </>
                                            )
                                                : (
                                                    formatLabel(StateName)
                                                )}
                                        </div>
                                        <span>:</span>

                                    </label>

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
                                                list={['SupplierId', 'SupplierName'].includes(StateName) ? StateName + 'List' : undefined}
                                                min={StateName === 'DeliveryExpectedDate' ? currentDate : ''}
                                                disabled={!['DeliveryExpectedDate', 'ShippingLocation', 'BillingLocation'].includes(StateName)}
                                            />
                                    }

                                </div>
                            )
                        })
                    }


                </div>
            )}
            <br></br>

            {Itemget && (
                <>
                    <div className="common_center_tag">
                        <span>Item Details</span>
                    </div>

                    <br />

                    <div className="RegisFormcon_1">
                        {Object.keys(itemwisePo || {})
                            .filter((field) => field !== 'id')
                            .map((field, index) => {
                                const isEditable = field === 'PurchaseQty'; // Only `PurchaseQty` is editable

                                return (
                                    <div className="RegisForm_1" key={`${index}_key`}>
                                        <label htmlFor={field}>
                                            <div className="imp_v_star">
                                                {isEditable ? (
                                                    <>
                                                        {formatLabel(field)}
                                                        <span className="requirreg12">*</span>
                                                    </>
                                                ) : (
                                                    formatLabel(field)
                                                )}
                                            </div>
                                            <span>:</span>
                                        </label>
                                        <input
                                            type={getInputType(field)}
                                            id={field}
                                            name={field}
                                            value={itemwisePo[field] || ''}
                                            disabled={!isEditable || !edit} // Only allow `PurchaseQty` when `edit` is true
                                            onChange={HandleItemChange}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                </>
            )}


            <br />

            <div className="Main_container_Btn">
                <button onClick={editsupplier ? UpdatePurchaseOrder : SavePurchaseOrder}>
                    {editsupplier ? "Update" : "Add"}
                </button>
            </div>



            <br></br>
            <div className="Main_container_app">

                {POItemArrays && POItemArrays.length > 0 && (
                    <div className="NewTest_Master_grid_M_head_M">
                        <TableContainer className="NewTest_Master_grid_M">
                            <Table className="dehduwhd_o8i">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={50}>SupplierId</TableCell>
                                        <TableCell width={150}>SupplierName</TableCell>
                                        <TableCell width={130}>OrderDate</TableCell>
                                        <TableCell width={130}>Delivery Date</TableCell>
                                        <TableCell width={100}>Supplier Email</TableCell>
                                        <TableCell width={100}>Contact Number</TableCell>

                                        <TableCell width={100}>Action</TableCell>
                                        <TableCell width={100}>ShowItems</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.isArray(POItemArrays) &&
                                        POItemArrays.map((row, index) => (
                                            <React.Fragment key={index}>
                                                <TableRow
                                                    style={{
                                                        backgroundColor:
                                                            index % 2 === 1
                                                                ? "var(--selectbackgroundcolor)"
                                                                : "white",
                                                    }}
                                                >
                                                    <TableCell>{row.SupplierId}</TableCell>
                                                    <TableCell>{row.SupplierName}</TableCell>
                                                    <TableCell>{row.OrderDate}  </TableCell>
                                                    <TableCell>{row.DeliveryExpectedDate}  </TableCell>
                                                    <TableCell>{row.SupplierMailId}  </TableCell>
                                                    <TableCell>{row.ContactPersonNumber}  </TableCell>

                                                    <TableCell>
                                                        <Button className="cell_btn">
                                                            <DeleteOutlineIcon className="check_box_clrr_cancell" onClick={() => handleDeleteSupplier(row)} />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.items && row.items.length > 0 && (
                                                            <span
                                                                aria-label="expand row"
                                                                onClick={() => toggleRow(row.SupplierId)}
                                                            >
                                                                {openRow === row.SupplierId ? (
                                                                    <ArrowDropUpOutlinedIcon />
                                                                ) : (
                                                                    <ArrowDropDownOutlinedIcon />
                                                                )}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                {row.items && row.items.length > 0 && (
                                                    <TableRow>
                                                        <TableCell
                                                            style={{ paddingBottom: 0, paddingTop: 0 }}
                                                            colSpan={6}
                                                        >
                                                            <Collapse
                                                                in={openRow === row.SupplierId}
                                                                timeout="auto"
                                                                unmountOnExit
                                                            >
                                                                <Box sx={{ margin: 1 }}>
                                                                    <div className="Main_container_app">
                                                                        <div
                                                                            style={{
                                                                                width: "100%",
                                                                                display: "grid",
                                                                                placeItems: "center",
                                                                            }}
                                                                        ></div>
                                                                        {/* <ReactGrid
                                                                            columns={ProductListColumn}
                                                                            RowData={row?.items}
                                                                        /> */}

                                                                        <ReactGrid
                                                                            columns={ProductListColumn.map((col) => ({
                                                                                ...col,
                                                                                renderCell: col.key === 'Action' ? (Params) => (
                                                                                    <>
                                                                                        <Button className="cell_btn">
                                                                                            <EditIcon className="check_box_clrr_cancell"
                                                                                                onClick={() => handleEditSupplierItem(Params.row, row.SupplierId)} />
                                                                                        </Button>
                                                                                        <Button className="cell_btn">
                                                                                            <DeleteOutlineIcon
                                                                                                className="check_box_clrr_cancell"
                                                                                                onClick={() => handleDeleteSupplierItem(Params.row, row.SupplierId)}
                                                                                            />
                                                                                        </Button>
                                                                                    </>
                                                                                ) : col.renderCell,
                                                                            }))}
                                                                            RowData={row?.items}
                                                                        />

                                                                    </div>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}



            </div>
            <br></br>
            <div className="Main_container_Btn">
                <button
                    onClick={SubmitAllPurchaseOrder}
                    disabled={!Array.isArray(POItemArrays) || (POItemArrays?.length === 0)}
                >
                    Save
                </button>
            </div>



            <ToastAlert Message={toast?.message} Type={toast?.type} />
        </div>
    );
};

export default ItemwisePurchaseOrder;
