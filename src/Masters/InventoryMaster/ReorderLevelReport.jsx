import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import Button from "@mui/material/Button";
const ReorderLevelReport = () => {
    const toast = useSelector(state => state.userRecord?.toast);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [searchQuery, setsearchQuery] = useState({
        FilterType: 'OverAll',
        ViewType: 'AvailableQuantity',
        Location: '',
        ItemCode: '',
        ItemName: '',
        ProductCategory: '',
        SubCategory: '',
    })

    const [summa1, setsumma1] = useState([]);

    console.log("summa1", summa1);
    const [summa1column, setsumma1column] = useState([]);
    const [summaArray1, setsummaArray1] = useState([]);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const [summaArray3, setsummaArray3] = useState([]);


    const [summaArray4, setsummaArray4] = useState([]);


    const handleonchange = (e) => {
        const { name, value } = e.target
        if (name === 'ProductCategory') {
            setsearchQuery(prev => ({
                ...prev,
                [name]: value,
                SubCategory: ''
            }))
        } else if (name === 'Location') {
            setsearchQuery(prev => ({
                ...prev,
                [name]: value,
            }))
        } else {
            setsearchQuery(prev => ({
                ...prev,
                [name]: value
            }))
        }

    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data
                setsummaArray1(ress)
            })
            .catch((err) => {
                console.log(err);
            })
        axios.get(`${UrlLink}Inventory/Product_Category_Product_Details_link`)
            .then((res) => {
                const ress = res.data
                setsummaArray3(ress)
            })
            .catch((err) => {
                console.log(err);
            })

    }, [UrlLink])


    useEffect(() => {
        if (searchQuery.ProductCategory) {
            axios.get(`${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${searchQuery.ProductCategory}`)
                .then((res) => {
                    const ress = res.data
                    setsummaArray4(ress)
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            setsummaArray4([])
        }

    }, [UrlLink, searchQuery.ProductCategory])



    useEffect(() => {
        setsumma1column([]);

        if (searchQuery.FilterType === 'OverAll') {
            axios.get(`${UrlLink}Inventory/get_overall_stock_list_table_column_details`)
                .then(res => {
                    console.log(res);

                    const table_struc = res.data;
                    console.log('')

                    const predefinedColumns = [
                        { key: "ItemCode", name: "Item Code" },
                        { key: "ItemName", name: "Item Name" },
                        { key: "ProductCategory", name: "Product Category" },
                        { key: "SubCategory", name: "Sub Category" }
                    ];

                    const coll = Object.keys(table_struc).map(ele => ({
                        key: ele,
                        name: ele.split('_')[1],
                        children: [
                            ...Object.keys(table_struc[ele]).map(ele_c1 => ({
                                key: ele_c1,
                                name: ele_c1 === 'inv' ? 'Inventory Store' : 'NurseStation Store',
                                children: [
                                    ...table_struc[ele][ele_c1].map(ele_c2 => ({
                                        key: `${ele.split('_')[0]}_${ele_c1}_${ele_c2.split('_')[0]}_ReorderLevel`,
                                        name: ele_c2.split('_')[1],
                                        renderCell: (params) => {
                                            const datasss = params.row;

                                            return (
                                                <Button>
                                                    <div style={{
                                                        display: 'flex',
                                                        marginLeft: '20px',
                                                        backgroundColor: 'var(--ProjectColor)',
                                                        padding: '10px',
                                                        width: '70px',
                                                        borderRadius: '10px',
                                                        cursor: 'default'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '100%',
                                                            color: 'black',
                                                            fontWeight: 'bold',
                                                            cursor: 'default'

                                                        }}>
                                                            {datasss[`${ele.split('_')[0]}_${ele_c1}_${ele_c2.split('_')[0]}_ReorderLevel`]}
                                                        </div>
                                                    </div>
                                                </Button>
                                            );
                                        }
                                    }))
                                ]
                            }))
                        ]
                    }));

                    const mergedcol = [...predefinedColumns, ...coll];
                    setsumma1column(mergedcol);
                })
                .catch(err => {
                    console.error("Error fetching stock details: ", err);
                });
        }

    }, [UrlLink, searchQuery.ViewType, searchQuery.FilterType]);


    useEffect(() => {
        axios.get(`${UrlLink}Inventory/get_Reorder_Level_Report`, { params: searchQuery })
            .then(res => {
                const Stock_Detials = res.data;
                setsumma1(Stock_Detials);
            })
            .catch(err => {
                console.error("Error fetching stock details: ", err);
            });
    }, [UrlLink, searchQuery]);

    // const allowedCategoryIds = summaArray3.filter(item =>allowedCategoryIds.includes() )
    const allowedCategoryIds = userRecord.ProductCategory_list.map(item => item.ProductCategoryAccessId);

    const filteredProductCategoryData = summaArray3.filter(
        item => allowedCategoryIds.includes(item.id)
    );

    return (
        <>
            <div className="Main_container_app">

                <h3>Reorder Level Report</h3>
                <br />

                <div className="RegisFormcon_1">
                    {
                        Object.keys(searchQuery).filter(ele => {
                            if (searchQuery.FilterType === 'OverAll') {
                                return !['Location', 'ViewType', 'FilterType'].includes(ele);
                            }
                            return !['ViewType', 'FilterType'].includes(ele);
                        }).map((field, indx) => (
                            <div className="RegisForm_1" key={indx}>
                                <label>{formatunderscoreLabel(field)}<span>:</span></label>
                                {
                                    ['ViewType', 'Location', 'ProductCategory', 'SubCategory'].includes(field) ? (
                                        <select
                                            name={field}
                                            value={searchQuery[field]}
                                            onChange={handleonchange}
                                            disabled={
                                                field === 'SubCategory' ? !searchQuery.ProductCategory :

                                                    false
                                            }
                                        >
                                            {!['ViewType'].includes(field) &&
                                                <option value=''>Select</option>
                                            }


                                            {field === 'Location' &&
                                                summaArray1.map((ele, ind) => (
                                                    <option key={ind + 'key'} value={ele.id}>{ele.locationName}</option>
                                                ))
                                            }




                                            {/* {field === 'ProductCategory' &&
                                                summaArray3.map((ele, ind) => (
                                                    <option key={ind + 'key'} value={ele.id}>{ele.ProductCategory}</option>
                                                ))
                                            } */}
                                            {field === 'ProductCategory' && (
                                                (filteredProductCategoryData && filteredProductCategoryData.length > 0
                                                    ? filteredProductCategoryData
                                                    : summaArray3
                                                ).map((ele, ind) => (
                                                    <option key={ind + 'key'} value={ele.id}>
                                                        {ele.ProductCategory}
                                                    </option>
                                                ))
                                            )}

                                            {field === 'SubCategory' &&
                                                summaArray4.map((ele, ind) => (
                                                    <option key={ind + 'key'} value={ele.id}>{ele.SubCategoryName}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            name={field}
                                            value={searchQuery[field]}
                                            onChange={handleonchange}
                                        />
                                    )
                                }
                            </div>
                        ))
                    }
                </div>

                <br />
                {
                    Array.isArray(summa1column) && summa1column.length !== 0 && (
                        <ReactGrid columns={summa1column} RowData={summa1} />
                    )
                }
            </div>


            <ToastAlert Message={toast.message} Type={toast.type} />

        </>

    );
}

export default ReorderLevelReport