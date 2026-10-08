import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from '@mui/icons-material/List';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
const ProductMasterListOptical = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const navigate = useNavigate();
    const dispatchvalue = useDispatch();
    const [SearchQuery, setSearchQuery] = useState({
        ProductCategory: '',
        SubCategory: '',
        ItemId: '',
        ItemName: '',
        GenericName: '',
        CompanyName: '',
        GroupName: '',
        HSNCode: '',
    });
    const [ProductArray, setProductArray] = useState([]);
    console.log('ProductArray', ProductArray)
    const [CategoryArray, setCategoryArray] = useState([]);
    console.log('CategoryArray--', CategoryArray);
    const [SubCategoryArray, setSubCategoryArray] = useState([]);
    const [GenericNameData, setGenericNameData] = useState([]);
    const [ManufactureData, setManufactureData] = useState([]);
    const [GroupNameData, setGroupNameData] = useState([]);
    const [getdata, setgetdata] = useState(false)
    const [ProductColumn, setProductColumn] = useState([])
    const [ProductDrugSegment, setProductDrugSegment] = useState({})


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const [data1, data3, data4] = await Promise.all([
                    axios.get(`${UrlLink}Inventory/Product_Category_Product_Details_link`),
                    axios.get(`${UrlLink}Masters/CompanyName_Master_Link`),
                    axios.get(`${UrlLink}Masters/Product_Group_Link`),

                ])

                setCategoryArray(data1.data)
                console.log('data1', data1.data);
                setGroupNameData(data4.data);
                console.log('data4---', data4.data)
                setManufactureData(data3.data);
            } catch (error) {
                console.error(error);

            }
        }
        fetchdata()
    }, [UrlLink])



    useEffect(() => {
        const fetchdatachange = async () => {
            if (SearchQuery.ProductCategory) {
                try {
                    // Use Promise.all with proper syntax
                    const [data4, data5, data6] = await Promise.all([
                        axios.get(
                            `${UrlLink}Masters/GenericName_by_Product_SubProduct?ProductCategory=${SearchQuery.ProductCategory}&SubProductCategory=${SearchQuery.SubCategory}`
                        ),
                        axios.get(
                            `${UrlLink}Masters/CompanyName_by_Product_SubProduct?ProductCategory=${SearchQuery.ProductCategory}&SubProductCategory=${SearchQuery.SubCategory}`
                        ),
                        axios.get(
                            `${UrlLink}Masters/Product_Group_by_Product_SubProduct?ProductCategory=${SearchQuery.ProductCategory}&SubProductCategory=${SearchQuery.SubCategory}`
                        ),



                    ]);

                    // Set state with the fetched data
                    setGenericNameData(data4.data);

                    setManufactureData(data5.data);
                    setGroupNameData(data6.data);
                    console.log("data5.data", data5.data)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchdatachange();
    }, [UrlLink, SearchQuery.ProductCategory, SearchQuery.SubCategory]);




    useEffect(() => {
        if (SearchQuery.ProductCategory) {
            axios.get(`${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${SearchQuery.ProductCategory}`)
                .then((res) => {
                    let data = res.data

                    if (Array.isArray(data) && data.length !== 0) {
                        setSubCategoryArray(data)
                        console.log('datasubcategory', data);
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

        axios.get(`${UrlLink}Inventory/product_master_Detials_link_Optical`, { params: SearchQuery })
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

    }, [UrlLink, SearchQuery, getdata])



    const handelStatuseditdata = useCallback((params) => {
        axios.post(`${UrlLink}Inventory/Update_product_master_status`, {
            ItemCode: params.Item_Code
        })
            .then((ress) => {
                const data = ress.data

                let type = Object.keys(data)[0]
                let mess = Object.values(data)[0]
                const tdata = {
                    message: mess,
                    type: type,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                setgetdata(prev => !prev)
            })
            .catch((err) => {
                console.log(err);

            })
    }, [UrlLink, dispatchvalue])

    const handleviewDrugSegment = useCallback((params) => {
        if (params?.Drug_Segment.length === 0) {
            const tdata = {
                message: `${params.Item_Code} - ${params.Item_Name} is currently inactive. You need to activate it before editing.`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        } else {
            axios.get(`${UrlLink}Inventory/get_Drug_segments`)
                .then((ress) => {
                    const data = ress.data.filter(f => params?.Drug_Segment?.includes(f.id))
                    console.log(ress.data);
                    console.log(data);

                    setProductDrugSegment({
                        Item_Code: params.Item_Code,
                        Item_Name: params.Item_Name,
                        data
                    })
                })
                .catch((err) => {
                    console.log(err);

                })
        }
    }, [UrlLink, dispatchvalue])

    const handelEditdata = useCallback((params) => {
        console.log(params)

        dispatchvalue({ type: 'MedicalProductMaster', value: {} });


        if (params?.Status === 'Active') {

            dispatchvalue({ type: 'MedicalProductMaster', value: { ...params } });

            // navigate('/Home/Productmaster');
            navigate("/Home/InventoryMaster");
            dispatchvalue({ type: "HrFolder", value: "ProductmasterOptical" });
            dispatchvalue({ type: "setPreviousFolder", value: null });
            dispatchvalue({ type: "showMenu", value: true });
        } else {
            const tdata = {
                message: `${params.Item_Code} - ${params.Item_Name} is currently inactive. You need to activate it before editing.`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }

    }, [dispatchvalue, navigate])



    // useEffect(() => {
    //     const ProductMasterFields = [
           
    //         'Item_Name',
    //         'Product_Category',
    //         'Sub_Category',
    //         'Generic_Name',
    //         'Manufacturer_Name',
    //         'HSN_Code',
    //         'Product_Type',
    //         'Product_Group',
           
    //         'Pack_Type',
    //         'Pack_Quantity',
    //         'Minimum_Quantity',
           
    //         'Re_order_Level',
           
    //         'Department',
    //         'Doctorname',
    //         'Status',
    //         'Action',
    //     ]
    //     const colname = [
    //         { key: 'id', name: 'S.No' },
    //         ...ProductMasterFields.map(field => {
    //             if ([
                  
    //                 'Status',
    //                 'Action'].includes(field)) {
    //                 return {
    //                     key: field,
    //                     name: formatunderscoreLabel(field),
    //                     renderCell: (params) => {
    //                         if (field === 'Status') {
    //                             return (
    //                                 <Button className="cell_btn" onClick={() => handelStatuseditdata(params.row)}>
    //                                     {params.row.Status}
    //                                 </Button>
    //                             )

    //                         } else if (field === 'Action') {

    //                             return (
    //                                 <Button className="cell_btn" onClick={() => handelEditdata(params.row)}>
    //                                     <EditIcon className="check_box_clrr_cancell" />
    //                                 </Button>
    //                             )

    //                         } else {
    //                             return (
    //                                 params.row[field]
    //                             )
    //                         }

    //                     }
    //                 }
    //             } else {
    //                 return {
    //                     key: field,
    //                     name: formatunderscoreLabel(field)

    //                 }
    //             }
    //         })
    //     ]
    //     setProductColumn(colname)
    // }, [handelStatuseditdata, handleviewDrugSegment, handelEditdata])


useEffect(() => {
    const ProductMasterFields = [
        'Item_Name',
        'Product_Category',
        'Sub_Category',
        'Generic_Name',
        'Manufacturer_Name',
        'HSN_Code',
        'Product_Type',
        'Product_Group',
        'Pack_Type',
        'Pack_Quantity',
        'Minimum_Quantity',
        'Re_order_Level',
        'Department',
        'Doctorname',
        'Status',
        'Action',
    ]
    const colname = [
        { key: 'id', name: 'S.No' },
        ...ProductMasterFields.map(field => {
            if (['Status', 'Action'].includes(field)) {
                return {
                    key: field,
                    name: formatunderscoreLabel(field),
                    renderCell: (params) => {
                        if (field === 'Status') {
                            const status = params.row.Status;
                            const statusStyle = status === 'ACTIVE' 
                                ? { backgroundColor: 'green', color: 'white', padding: '5px 10px', borderRadius: '5px' } 
                                : status === 'INACTIVE' 
                                ? { backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px' }
                                : {};

                            return (
                                <Button 
                                    className="cell_btn" 
                                    onClick={() => handelStatuseditdata(params.row)}
                                    style={statusStyle}
                                >
                                    {status}
                                </Button>
                            );
                        } else if (field === 'Action') {
                            return (
                                <Button className="cell_btn" onClick={() => handelEditdata(params.row)}>
                                    <EditIcon className="check_box_clrr_cancell" />
                                </Button>
                            )
                        } else {
                            return (
                                params.row[field]
                            )
                        }
                    }
                }
            } else {
                return {
                    key: field,
                    name: formatunderscoreLabel(field)
                }
            }
        })
    ]
    setProductColumn(colname)
}, [handelStatuseditdata, handleviewDrugSegment, handelEditdata])


    const handleNewMaster = () => {

        dispatchvalue({ type: 'MedicalProductMaster', value: {} });
        navigate("/Home/InventoryMaster");
        dispatchvalue({ type: "HrFolder", value: "ProductmasterOptical" });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });
        // navigate('/Home/Productmaster');
    };



    const [SelectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(null);
        setSelectedFile(event.target.files[0]);
    };
    const handleCsvupload = () => {
        console.log(SelectedFile);
        const formData = new FormData();
        formData.append("file", SelectedFile);
        formData.append("created_by", userRecord?.username);

        if (SelectedFile) {
            axios
                .post(`${UrlLink}Inventory/Product_Master_File_Upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((response) => {
                    console.log(response);
                    setSelectedFile(null);

                    let data = response.data;

                    let type = Object.keys(data)[0]
                    let mess = Object.values(data)[0]
                    const tdata = {
                        message: mess,
                        type: type
                    }
                    dispatchvalue({ type: 'toast', value: tdata })
                    setgetdata(prev => !prev)
                })
                .catch((error) => {
                    console.log(error);
                    alert(error);
                });
        } else {
            // userwarn("Choose File");
        }
    };

    const allowedCategoryIds = userRecord.ProductCategory_list.map(item => item.ProductCategoryAccessId);

    const filteredProductCategoryData = CategoryArray.filter(
        item => allowedCategoryIds.includes(item.id)
    );
    const filterGrid = ProductArray.filter(item => allowedCategoryIds.includes(item.Product_Category_pk));
    console.log('filterGrid', filterGrid);

    return (
        <>
            <div className="Main_container_app">
                <h3> Product Master List</h3>

                <div className="RegisFormcon_1">
                    {
                        Object.keys(SearchQuery).map((field, indx) => (
                            <div className="RegisForm_1" key={indx + 'key'}>
                                <label htmlFor={field}>
                                    {field}
                                    <span>:</span>
                                </label>
                                {
                                    ['ProductCategory', 'SubCategory', 'GenericName', 'CompanyName', 'GroupName'].includes(field) ?
                                        <select
                                            id={field}
                                            name={field}
                                            value={SearchQuery[field]}
                                            onChange={(e) => setSearchQuery(prev => ({ ...prev, [field]: e.target.value }))}
                                        >
                                            <option value="">Select</option>
                                            {field === 'ProductCategory' && (
                                                (filteredProductCategoryData && filteredProductCategoryData.length > 0
                                                    ? filteredProductCategoryData
                                                    : CategoryArray
                                                ).map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>
                                                        {ele.ProductCategory}
                                                    </option>
                                                ))
                                            )}

                                            {field === 'SubCategory' &&
                                                SubCategoryArray.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.SubCategoryName}</option>
                                                ))
                                            }
                                            {field === 'GenericName' &&
                                                GenericNameData.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.GenericName}</option>
                                                ))
                                            }
                                            {field === 'CompanyName' &&
                                                ManufactureData.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.CompanyName}</option>
                                                ))
                                            }
                                            {field === 'GroupName' &&
                                                GroupNameData.map((ele, ind) => (
                                                    <option key={ind} value={ele.id}>{ele.ProductGroupName}</option>
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

                <br></br>
                {/* choose csv */}
                <div style={{ display: "flex", alignItems: "center", }}>
                    <label>
                        {" "}
                        Product Master Excel File<span>:</span>{" "}
                    </label>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        id="Servicechoose"
                        required
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />



                    <label
                        htmlFor="Servicechoose"
                        title='Choose File'
                        className="RegisterForm_1_btns choose_file_update"
                    >
                        <PhotoCameraBackIcon />
                    </label>
                    <button
                        className="RegisterForm_1_btns choose_file_update"
                        onClick={handleCsvupload}
                        title='File Upload'
                    >

                        <DriveFolderUploadIcon />

                    </button>
                </div>
                <br></br>

                <div className="Main_container_Btn">
                    <button onClick={handleNewMaster}>
                        <LoupeIcon />
                    </button>
                </div>
                <ReactGrid
                    columns={ProductColumn}
                    RowData={
                        Array.isArray(filterGrid) && filterGrid.length > 0
                            ? filterGrid
                            : ProductArray
                    }
                />


            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />

            {Object.keys(ProductDrugSegment).length !== 0 && (
                <div className='loader' onClick={() => setProductDrugSegment({})}>
                    <div
                        className='loader_register_roomshow'
                        onClick={e => e.stopPropagation()}
                    >
                        <br />

                        <div className='common_center_tag'>
                            <span>Selected Drug Segments for '{ProductDrugSegment?.Item_Code} - {ProductDrugSegment?.Item_Name} '</span>
                        </div>
                        <br />
                        <br />
                        <div className='displayuseraccess'>
                            {ProductDrugSegment?.data
                                .map((p, indx) => (
                                    <div className='displayuseraccess_child' key={indx}>
                                        <label
                                            htmlFor={`${indx}_${p?.Segment}`}
                                            className='par_acc_lab'
                                            title={p?.Description}
                                        >
                                            {`${indx + 1}. ${p?.Segment}`}
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductMasterListOptical;











































