import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';


const NurseStationStock = () => {
    const dispatch = useDispatch();
    const toast = useSelector((state) => state.userRecord?.toast);
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

    const [searchQuery, setSearchQuery] = useState({
        ItemCode: '',
        ItemName: '',
        ProductCategoryname: '',
        ProductCategoryid: '',
        SubCategoryname: '',
        SubCategoryid: '',
        NurseStationName: '',
    });
    console.log("searchQuery", searchQuery)

    const [nurseStationArray, setNurseStationArray] = useState([]);
    const [productCategory, setProductCategory] = useState([]);
    const [subproductCategory, setSubproductCategory] = useState([]);
    const [itemnames, setItemnames] = useState([]);

    const [Nursedata, setNursedata] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await axios.get(`${UrlLink}Inventory/get_NurseStationall_Details_list`, {
                    params: searchQuery
                });
                const data = response.data;
                if (Array.isArray(data)) {
                    console.log("alldata", data);
                    setNursedata(data);
                } else {
                    setNursedata([]);
                }
            } catch (error) {
                console.error('Failed to fetch nurse stations:', error);
            }
        };

        fetchAllData();
    }, [UrlLink, searchQuery]);


    useEffect(() => {
        const fetchNurseStations = async () => {
            try {
                const response = await axios.get(`${UrlLink}Inventory/get_NurseStation_Details_list`);
                const data = response.data;
                if (Array.isArray(data)) {
                    setNurseStationArray(data);
                } else {
                    setNurseStationArray([]);
                }
            } catch (error) {
                console.error('Failed to fetch nurse stations:', error);
            }
        };
        fetchNurseStations();
    }, [UrlLink]);

    useEffect(() => {
        if (!searchQuery.NurseStationName) {
            setItemnames([]);
            return;
        }
        const fetchitemnames = async () => {
            try {
                const response = await axios.get(
                    `${UrlLink}Inventory/get_Item_Details_byNurseStation?NurseStationid=${searchQuery.NurseStationName}`
                );
                const data = response.data;
                console.log("itemnames", data)
                if (Array.isArray(data)) {
                    setItemnames(data);
                } else {
                    setItemnames([]);
                }
            }
            catch (error) {
                console.error('Error fetching product categories:', error);
            }

        };
        fetchitemnames();

    }, [UrlLink, searchQuery.NurseStationName])



    useEffect(() => {
        if (!searchQuery.NurseStationName) {
            setProductCategory([]);
            return;
        }
        const fetchProductCategories = async () => {
            try {
                const response = await axios.get(
                    `${UrlLink}Inventory/get_Product_Category_byNurseStation?NurseStationid=${searchQuery.NurseStationName}`
                );
                const data = response.data;
                if (Array.isArray(data)) {
                    setProductCategory(data);
                } else {
                    setProductCategory([]);
                }
            } catch (error) {
                console.error('Error fetching product categories:', error);
            }
        };
        fetchProductCategories();
    }, [UrlLink, searchQuery.NurseStationName]);

    useEffect(() => {
        if (!searchQuery.ProductCategoryid) {
            setSubproductCategory([]);
            return;
        }
        const fetchSubProductCategories = async () => {
            try {
                const response = await axios.get(
                    `${UrlLink}Inventory/get_SubProductCategory_byProductCategory?ProductCategoryid=${searchQuery.ProductCategoryid}`
                );
                const data = response.data;
                console.log("subproduct", data)
                if (Array.isArray(data)) {
                    setSubproductCategory(data);
                } else {
                    setSubproductCategory([]);
                }


            }
            catch (error) {
                console.error('Error fetching product categories:', error);
            }
        };

        fetchSubProductCategories();
    }, [UrlLink, searchQuery.ProductCategoryid])



    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery((prev) => {
            if (name === 'NurseStationName') {
                return {
                    ...prev,
                    [name]: value,
                    ProductCategoryname: '',
                    ProductCategoryid: '',
                    SubCategoryname: '',
                    SubCategoryid: '',
                    ItemName: '',
                    ItemCode: ''
                };
            } else if (name === 'ProductCategoryid') {
                const [productid, productcategoryname] = value.split('-');
                return {
                    ...prev,
                    ProductCategoryid: productid || '',
                    ProductCategoryname: productcategoryname || '',
                    SubCategoryname: '',
                    SubCategoryid: '',
                    ItemName: '',
                    ItemCode: ''
                };
            }
            else if (name === 'SubCategoryid') {
                const [subproductid, SubproductCategoryname] = value.split('-');
                return {
                    ...prev,
                    SubCategoryid: subproductid || '',
                    SubCategoryname: SubproductCategoryname || '',
                    ItemName: '',
                    ItemCode: ''
                }
            }
            else if (name === 'ItemCode' || name === 'ItemName') {
                const [ItemCode, ItemName] = value.split('-');
                return {
                    ...prev,
                    SubCategoryid: '',
                    SubCategoryname: '',
                    ProductCategoryid: '',
                    ProductCategoryname: '',
                    ItemName: ItemName || '',
                    ItemCode: ItemCode || '',
                }
            }
            else {
                return {
                    ...prev,
                    [name]: value
                };
            }
        });
    };

    const NurseStationColumn = [
        {
            key: "id",
            name: "S.NO",
            frozen: true
        },
        {
            key: "itemcode",
            name: "ItemCode",
            frozen: true
        },
        {
            key: "itemname",
            name: "ItemName",
            frozen: true
        },
        {
            key: "productcategoryname",
            name: "Product CategoryName",
        },
        {
            key: "subproductcategoryname",
            name: "Sub Product CategoryName",
        },
        {
            key: "availablequantity",
            name: "Available Quantity"
        }


    ]

    return (
        <div className="Main_container_app">
            
            <h4>NurseStation StockList
            <div style={{ display:'flex', justifyContent:'center', gap:'10px' }}>
            <label style={{ fontSize: '105px !important' }}>NurseStation Name</label>
                    <select
                        name="NurseStationName"
                        value={searchQuery.NurseStationName}
                        onChange={handleOnChange}
                        autoComplete="off"
                    >
                        <option value="">Select</option>
                        {nurseStationArray.map((station) => (
                            <option key={station.id} value={station.id}>
                                {station.NurseStationName}
                            </option>
                        ))}
                    </select>
        
            </div>
            </h4>
            <br />
            <div className="RegisFormcon_1">
                
                <div className="RegisForm_1">
                    <label> Product Category <span>:</span> </label>
                    <input
                        list="productCategory-options"
                        name="ProductCategoryid"
                        value={
                            searchQuery.ProductCategoryid
                                ? `${searchQuery.ProductCategoryid} - ${searchQuery.ProductCategoryname}`
                                : ''
                        }
                        onChange={handleOnChange}
                        autoComplete="off"
                    />
                    <datalist id="productCategory-options">
                        {productCategory.map((category, index) => (
                            <option key={index} value={`${category.productid}-${category.productcategoryname}`}>
                                {`${category.productcategoryname}`}
                            </option>
                        ))}
                    </datalist>
                </div>

                <div className="RegisForm_1">
                    <label> SubProduct Category <span>:</span> </label>
                    <input
                        list="subproductCategory-options"
                        name="SubCategoryid"
                        value={searchQuery.SubCategoryid
                            ? `${searchQuery.SubCategoryid} - ${searchQuery.SubCategoryname}`
                            : ''
                        }
                        onChange={handleOnChange}
                        autoComplete="off"

                    />
                    <datalist id="subproductCategory-options">
                        {subproductCategory.map((category, index) => (
                            <option key={index} value={`${category.subproductid}-${category.SubproductCategoryname}`}>
                                {`${category.SubproductCategoryname}`}
                            </option>
                        ))}
                    </datalist>

                </div>
                <div className="RegisForm_1">
                    <label htmlFor="itemCode">Item Code <span>:</span></label>
                    <input
                        id="ItemCode"
                        name='ItemCode'
                        value={searchQuery.ItemCode}
                        list="itemCode-options"
                        onChange={handleOnChange}
                        autoComplete="off"
                    />
                    <datalist id="itemCode-options">
                        {itemnames.map((item, index) => (
                            <option key={`${index}-code`} value={`${item.ItemCode}-${item.ItemName}`}>
                                {item.ItemCode}
                            </option>
                        ))}
                    </datalist>

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




            </div>


            {/* react grid */}


            {
                Nursedata.length !== 0 &&
                <>
                    <div className='RegisFormcon_1 jjxjx_'>
                        < ReactGrid columns={NurseStationColumn} RowData={Nursedata} />
                    </div>
                </>
            }


        </div>
    );
};

export default NurseStationStock;
