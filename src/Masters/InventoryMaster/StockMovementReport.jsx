import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';



const StockMovementReport = () => {

    const navigate = useNavigate();

    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const formattedFirstDay = firstDay.toLocaleDateString('en-CA');

    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const formattedLastDay = lastDay.toLocaleDateString('en-CA');

    const [StoreLocationData, setStoreLocationData] = useState([]);

    const [searchQuery, setSearchQuery] = useState({
        StoreLocation: allowedStoreId || '',
        FromDate: formattedFirstDay,
        ToDate: formattedLastDay,
        ItemName: '',
        MovementCategory: ''
    });

    const [itemnames, setItemnames] = useState([]);

    const [fetchalldata, setFetchalldata] = useState([]);









    const fetchAndExportData = async () => {


        if (Array.isArray(fetchalldata) && fetchalldata.length > 0) {
            // Prepare Excel data
            const formattedData = fetchalldata.map((item) => ({
                SNo: item.id,
                ProductCategory: item.ProductCategory,
                ItemName: item.ItemName,
                SoldQuantity: item.SoldQuantity,
                AvailableQuantity: item.AvailableQuantity,
                PurchaseRate: item.PurchaseRate,
                StockValue: item.StockValue,
                SalesRate: item.SalesRate,
                MovementCategory: item.MovementCategory,
            }));

            // Create a new workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);

            // Append worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Movement Report');

            // Generate Excel file and trigger download
            XLSX.writeFile(workbook, `StockMovementReport${currentDate}.xlsx`);

        } else {
            alert('No data available to export.');
        }



    };


    const handleOnChange = (e) => {
        const { name, value } = e.target;

        if (name === 'ItemName') {
            if (value.includes('-')) {
                const [ItemCode, ItemName] = value.split('-');


                setSearchQuery((prev) => ({
                    ...prev,
                    [name]: ItemName,
                    ItemCode: ItemCode,
                }))
            }
            else {
                setSearchQuery((prev) => ({
                    ...prev,
                    [name]: value,
                    ItemCode: '',
                }))

            }
        }
        else {
            setSearchQuery((prev) => ({
                ...prev,
                [name]: value,
            }))

        }

    };



    useEffect(() => {
        if (userRecord?.location) {
            axios.get(`${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${userRecord?.location}&forquickgrn=${false}`)
                .then((res) => {
                    const data = res.data
                    setStoreLocationData(Array.isArray(data) ? data : [])
                })
                .catch((err) => {
                    console.log(err);

                })

        }
    }, [UrlLink, userRecord?.location])


    useEffect(() => {
        const fetchitems = async () => {
            try {
                const itemresponse = await axios.get(`${UrlLink}Inventory/Product_Master_data_link`);
                const data = itemresponse.data;
                console.log("item", data)
                if (Array.isArray(data)) {
                    setItemnames(data);
                } else {
                    setItemnames([]);
                }

            }
            catch (error) {
                console.error('Error fetching item details:', error);
            }

        };
        fetchitems();

    }, [UrlLink])




    const fetchAllData = useCallback(async () => {
        try {
            const response = await axios.get(`${UrlLink}Inventory/get_items_details_StockMovementReport`, {
                params: searchQuery,
            });
            console.log('Veeeeeeeee11111', response.data);

            const data = response.data;
            if (Array.isArray(data)) {
                console.log("alldata---vvvvv", data);
                setFetchalldata(data);
            } else {
                setFetchalldata([]);
            }
        } catch (error) {
            console.error('Failed to fetch nurse station:', error);
        }
    }, [UrlLink, searchQuery]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);


    const AllItemColumn = [
        {
            key: "id",
            name: "S.NO",
            frozen: true
        },
        {
            key: "ProductCategory",
            name: "Product Category",
            frozen: true
        },
        {
            key: "ItemName",
            name: "Item Name",
        },
        {
            key: "SoldQuantity",
            name: "Sold Quantity",
        },
        {
            key: "AvailableQuantity",
            name: "Available Quantity",
        },
        {
            key: "PurchaseRate",
            name: "Purchase Rate",
        },
        {
            key: "StockValue",
            name: "Stock Value",
        },
        {
            key: "SalesRate",
            name: "Sales Rate",
        },
        {
            key: "MovementCategory",
            name: "Movement Category",
            renderCell: (params) => {
                let bgColor, textColor;
                switch (params.row.MovementCategory) {
                    case "Fast Moving":
                        bgColor = "yellow";
                        textColor = "black";
                        break;
                    case "Slow Moving":
                        bgColor = "orange";
                        textColor = "black";
                        break;
                    case "Non-Moving":
                        bgColor = "red";
                        textColor = "black";
                        break;
                    default:
                        textColor = "black";
                        break;
                }

                return (
                    <div
                        style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                            borderRadius: "4px",
                            fontWeight: "bold"
                        }}
                    >
                        {params.row.MovementCategory}
                    </div>
                );
            }
        }

    ]


    const clearSearchdata = () => {

        setSearchQuery({
            StoreLocation: allowedStoreId || '',
            FromDate: formattedFirstDay,
            ToDate: formattedLastDay,
            ItemName: '',
            MovementCategory: ''
        })
    }



    return (
        <>
            <div className="Main_container_app">
                <h3>Stock Moment Report</h3>
                <br />

                <div className="RegisFormcon_1">

                    <div className="RegisForm_1">
                        <label htmlFor="StoreLocation">Store Location<span>:</span></label>

                        <select
                            name='StoreLocation'
                            value={searchQuery.StoreLocation}
                            onChange={handleOnChange}
                        >
                            <option value=''>Select</option>
                            {StoreLocationData && StoreLocationData.length > 0 &&
                                StoreLocationData.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.id} >{ele.StoreName}</option>
                                ))
                            }
                        </select>
                    </div>



                    <div className="RegisForm_1">
                        <label htmlFor="BatchNumber">From Date<span>:</span></label>

                        <input
                            type='date'
                            name='FromDate'
                            value={searchQuery.FromDate}
                            onChange={handleOnChange}
                        />

                    </div>

                    <div className="RegisForm_1">
                        <label htmlFor="BatchNumber">To Date<span>:</span></label>

                        <input
                            type='date'
                            name='ToDate'
                            value={searchQuery.ToDate}
                            onChange={handleOnChange}
                        />

                    </div>

                    <div className="RegisForm_1">
                        <label htmlFor="ItemName">Item Name <span>:</span></label>
                        <input
                            id="ItemName"
                            name='ItemName'
                            value={searchQuery.ItemName}
                            list="ItemName-options"
                            onChange={handleOnChange}
                            autoComplete="off"
                        />
                        <datalist id="ItemName-options">
                            {itemnames.map((item, index) => (
                                <option key={`${index}-code`} value={`${item.ItemCode}-${item.ItemName}`}>
                                    {item.ItemName}
                                </option>
                            ))}
                        </datalist>

                    </div>

                    <div className="RegisForm_1">
                        <label htmlFor="MovementCategory">Category<span>:</span></label>

                        <select
                            name='MovementCategory'
                            value={searchQuery.MovementCategory}
                            onChange={handleOnChange}
                        >
                            <option value=''>Select</option>
                            <option value='Fast Moving'>Fast Moving</option>
                            <option value='Slow Moving'>Slow Moving</option>
                            <option value='Non-Moving'>Non-Moving</option>
                        </select>
                    </div>


                    <div className="RegisForm_1" style={{ marginLeft: '15px', width: '100px' }}>

                        <button className="RegisterForm_1_btns"
                            onClick={fetchAndExportData}
                            title='File Download'
                        >
                            <BrowserUpdatedIcon />
                        </button>

                        <button onClick={clearSearchdata} style={{ padding: '2px 8px', cursor: 'pointer', borderRadius: '5px', backgroundColor: 'black', color: 'white' }}>
                            Clear
                        </button>

                    </div>




                </div>



                <br></br>

                {/* grid */}
                {fetchalldata.length !== 0 && searchQuery.StoreLocation !== '' && (
                    <>
                        <div className='RegisFormcon_1 jjxjx_'>
                            <ReactGrid columns={AllItemColumn} RowData={fetchalldata} />
                        </div>
                    </>
                )}

                <ToastAlert Message={toast.message} Type={toast.type} />
            </div>

        </>
    )
}
export default StockMovementReport;
