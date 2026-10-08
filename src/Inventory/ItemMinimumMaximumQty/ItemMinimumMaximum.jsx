import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';

const ItemMinimumMaximum = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const navigate = useNavigate();
    const dispatchvalue = useDispatch();

    const [SearchQuery, setSearchQuery] = useState({
        ProductCategory: '',
        SubCategory: '',
        ItemId: '',
        ItemName: '',
    });
    const [ProductArray, setProductArray] = useState([]);
    console.log('ProductArray',ProductArray)


    const [CategoryArray, setCategoryArray] = useState([]);

    const [SubCategoryArray, setSubCategoryArray] = useState([]);
    const userRecord = useSelector(state => state.userRecord?.UserData)
    const allowedCategoryIds = userRecord.ProductCategory_list.map(item => item.ProductCategoryAccessId);

    const filteredProductCategoryData = CategoryArray.filter(
        item => allowedCategoryIds.includes(item.id)
    );

   


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const [data1] = await Promise.all([
                    axios.get(`${UrlLink}Inventory/Product_Category_Product_Details_link`),
                ])

                setCategoryArray(Array.isArray(data1.data) ? data1.data : []);

            } catch (error) {
                console.error(error);

            }
        }
        fetchdata()
    }, [UrlLink])



    useEffect(() => {
        if (SearchQuery.ProductCategory) {
            axios.get(`${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${SearchQuery.ProductCategory}`)
                .then((res) => {
                    let data = res.data

                    if (Array.isArray(data) && data.length !== 0) {
                        setSubCategoryArray(data)
                    }
                    else {
                        setSubCategoryArray([])
                    }

                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            setSubCategoryArray([])
        }

    }, [UrlLink, SearchQuery.ProductCategory])

    useEffect(() => {

        axios.get(`${UrlLink}Inventory/Product_Get_For_MinimumMaximum`, { params: SearchQuery })
            .then((res) => {
                let data = res.data

                if (Array.isArray(data) && data.length !== 0) {
                    setProductArray(data)
                }
                else {
                    setProductArray([])
                }

            })
            .catch((err) => {
                console.log(err)
            })

    }, [UrlLink, SearchQuery])



    const handleQuantityview = useCallback((params) => {
        const data = {
            ItemCode: params.Item_Code,
            ItemName: params.Item_Name
        }
        dispatchvalue({ type: 'MinimumMaximumData', value: data })
        navigate('/Home/MinimumMaximumLocation')
    }, [dispatchvalue, navigate])

    const ProductColumn = [
        {
            key: 'Item_Code',
            name: 'Item Code',
            frozen: true
        },
        {
            key: 'Item_Name',
            name: 'Item Name',
            frozen: true
        },
        {
            key: 'Product_Category',
            name: 'Product Category',
            frozen: true
        },
        {
            key: 'Sub_Category',
            name: 'Sub Category',
            frozen: true
        },
        {
            key: 'Quantity View',
            name: 'Quantity View',
            renderCell: (params) => (
                <Button className='cell_btn' onClick={() => handleQuantityview(params.row)}>
                    <VisibilityIcon />
                </Button>
            ),
        },
        {
            key: 'Minimum_Quantity',
            name: 'Master Minimum Quantity',
        },
        {
            key: 'Maximum_Quantity',
            name: 'Master Maximum Quantity',
        },
        {
            key: 'Re_order_Level',
            name: 'Master Re Order Level',
        },

    ]
   const filterdatacolumn = ProductArray.filter(item =>allowedCategoryIds.includes(item.Product_Category_pk));
   console.log('filterdatacolumn',filterdatacolumn)

    return (
        <>
            <div className="Main_container_app">
                <h3> Product Minmum Maximum Quantity List</h3>
                <br />
                <div className="RegisFormcon_1">
                    {
                        Object.keys(SearchQuery).map((field, indx) => (
                            <div className="RegisForm_1" key={indx + 'key'}>
                                <label htmlFor={field}>
                                    {field}
                                    <span>:</span>
                                </label>
                                {
                                    ['ProductCategory', 'SubCategory'].includes(field) ?
                                        <select
                                            id={field}
                                            name={field}
                                            value={SearchQuery[field]}
                                            onChange={(e) => setSearchQuery(prev => ({ ...prev, [field]: e.target.value }))}
                                        >
                                            <option value="">Select</option>
                                            {field === 'ProductCategory' &&
                                                (filteredProductCategoryData && filteredProductCategoryData.length > 0
                                                    ? filteredProductCategoryData.map((ele, ind) => (
                                                        <option key={ind} value={ele.id}>
                                                            {ele.ProductCategory}
                                                        </option>
                                                    ))
                                                    : CategoryArray.map((ele, ind) => (
                                                        <option key={ind} value={ele.id}>
                                                            {ele.ProductCategory}
                                                        </option>
                                                    ))
                                                )
                                            }

                                            {field === 'SubCategory' &&
                                                SubCategoryArray.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.SubCategoryName}</option>
                                                ))
                                            }
                                        </select>
                                        :
                                        < input
                                            type={'text'}
                                            id={field}
                                            name={field}
                                            value={SearchQuery[field]}
                                            onChange={(e) => setSearchQuery(prev => ({ ...prev, [field]: e.target.value }))}
                                        />
                                }

                            </div>
                        ))
                    }
                </div>
                <br />
                <ReactGrid columns={ProductColumn} RowData={Array.isArray(filterdatacolumn) && filterdatacolumn.length > 0 ? filterdatacolumn:ProductArray} />

            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />


        </>
    )
}

export default ItemMinimumMaximum;
