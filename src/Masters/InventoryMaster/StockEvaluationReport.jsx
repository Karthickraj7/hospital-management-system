
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';



const StockEvaluationReport = () => {

    const navigate = useNavigate();
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const dispatchvalue = useDispatch();
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    const [StoreLocationData, setStoreLocationData] = useState([]);

    const [searchQuery, setSearchQuery] = useState({
        StoreLocation: allowedStoreId || '',
        FromDate: '',
        ToDate: '',
        ItemName: '',
    });

    const [itemnames, setItemnames] = useState([]);

    const [fetchalldata, setFetchalldata] = useState([]);









    const fetchAndExportData = async () => {


        if (Array.isArray(fetchalldata) && fetchalldata.length > 0) {
            // Prepare Excel data
            const formattedData = fetchalldata.map((item) => ({
                SNo: item.id,
                ProductCategory: item.ProductCategory,
                ItemCode: item.ItemCode,
                ItemName: item.ItemName,
                ItemCode: item.ItemCode,
                ItemName: item.ItemName,
                PurchaseQuantity: item.GRNRecieveQuantity,
                PurchaseRate: item.PurchaseRate,
                SoldQuantity: item.SoldQuantity,
                AvailableQuantity: item.AvailableQuantity,
                StockValue: item.StockValue,
            }));

            // Create a new workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData);

            // Append worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Evaluation Report');

            // Generate Excel file and trigger download
            XLSX.writeFile(workbook, `StockEvaluationReport${currentDate}.xlsx`);

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



    const handlegonext = (row) => {
        console.log("row----", row);


        if (row && row.ItemCode) {

            const datass = {
                pk: row.id,
                ItemCode: row.ItemCode,
                ItemName: row.ItemName,
                StoreLocation:row.StoreLocation

            }



            dispatchvalue({ type: 'StockEvaluationSingleItem', value: (datass) })
            navigate("/Home/InventoryMaster");
            dispatchvalue({ type: 'HrFolder', value: 'StockEvaluationSingleItem' });
            dispatchvalue({ type: 'setPreviousFolder', value: null });
            dispatchvalue({ type: 'showMenu', value: true });
        } else {
            // Dispatch warning toast message if SupplierCode is not found
            dispatchvalue({
                type: 'toast',
                value: {
                    message: 'Supplier Code not found.',
                    type: 'warn'
                }
            });
        }
    };

    const fetchAllData = useCallback(async () => {
        try {
            const response = await axios.get(`${UrlLink}Inventory/get_items_details_StockEvaluationReport`, {
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
            renderCell: ({ row }) => (
                <Button
                    className="cell_btn"
                    onClick={() => handlegonext(row)}
                >
                    {row.ItemName}
                </Button>
            ),
        },
        {
            key: "GRNRecieveQuantity",
            name: "Purchase Quantity",
        },
        {
            key: "PurchaseRate",
            name: "Purchase Rate",
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
            key: "StockValue",
            name: "Stock Value",
        },

    ]


    const clearSearchdata = () => {

        setSearchQuery({
            StoreLocation: allowedStoreId || '',
            FromDate: '',
            ToDate: '',
            ItemName: '',
        })
    }



    return (
        <>
            <div className="Main_container_app">
                <h3>Stock Evaluation Report</h3>
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

                {
                    fetchalldata.length !== 0 && searchQuery.StoreLocation !== '' && (
                        <>
                            <div className="RegisFormcon_1 jjxjx_">
                                <ReactGrid columns={AllItemColumn} RowData={fetchalldata} />
                            </div>
                        </>
                    )
                }


                <ToastAlert Message={toast.message} Type={toast.type} />
            </div>

        </>
    )
}
export default StockEvaluationReport;