import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ListIcon from '@mui/icons-material/List';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const SupplierMasterList = () => {


    const dispatchvalue = useDispatch();

    const toast = useSelector(state => state.userRecord?.toast);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const navigate = useNavigate();


    const [SearchQuery, setSearchQuery] = useState({
        FilterBy: 'Supplier',
        SupplierId: '',
        SupplierName: '',
        SupplierType: '',
        ContactNumber: '',
    });
    const [supplierArray, setsupplierArray] = useState([])

    const [getdata, setgetdata] = useState(false);
    const [selectRoom, setselectRoom] = useState(false);

    const [selectRoom2, setselectRoom2] = useState(false);



    const [ProductListColumn, setProductListColumn] = useState({})
    const [ProductList, setProductList] = useState({})

    const [Banklist, setBanklist] = useState([])




    const handleNewMaster = () => {
        dispatchvalue({ type: 'SupplierMasterStore', value: {} });


        navigate('/Home/SupplierMaster');
    };

    useEffect(() => {
        dispatchvalue({ type: 'SupplierMasterStore', value: {} });
    }, [dispatchvalue])

    useEffect(() => {

        axios.get(`${UrlLink}Inventory/Supplier_Master_Link`, { params: { ...SearchQuery, forfilter: true } })
            .then((res) => {
                let Rdata = res.data
                if (Array.isArray(Rdata) && Rdata.length !== 0) {
                    setsupplierArray(Rdata)
                } else {
                    setsupplierArray([])
                }
            })
            .catch((err) => {
                console.log(err);
                setsupplierArray([])
            })


    }, [UrlLink, getdata, SearchQuery])


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

    const formatLabel = (label) => {

        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };

    const ItemView = (params) => {

        axios.get(`${UrlLink}Inventory/Supplier_product_list_link?SupplierId=${params?.SupplierId}`)
            .then((res) => {
                const resdata = res.data
                setProductList(resdata)
                if (!Object.values(resdata).every(field => field.length === 0)) {
                    let columns = {};
                    Object.keys(resdata).forEach((keys) => {
                        const ddd = resdata[keys][0]
                        const coll = [

                            ...Object.keys(ddd ?? {}).filter(f => !['ProductCategory', 'SupplierPoductId', 'SupplierPoductId', 'SubCategoryId'].includes(f)).map((field) => {
                                // If the field is 'Status', define custom renderCell
                                const column = {
                                    key: field,
                                    name: field === 'id' ? 'S.No' : formatLabel(field),
                                };
                                return column;
                            }),

                        ];

                        columns[keys] = coll;
                    });
                    setProductListColumn(columns);
                    setselectRoom(true)

                } else {
                    const tdata = {
                        message: 'There is no Product List to view.',
                        type: 'warn'
                    };
                    dispatchvalue({ type: 'toast', value: tdata });

                }

            })
            .catch((err) => {
                console.log(err);
                setProductList({})
            })

    }

    const AddProductsList = (params) => {
        if (params.Status === 'Inactive') {
            const tdata = {
                message: `${params.SupplierId} - ${params.SupplierName} is currently inactive. You need to activate it before editing.`,
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        } else {
            const {
                Bank_Details,
                Status,
                id,
                ...rest
            } = params;
            dispatchvalue({ type: 'SupplierMasterStore', value: { ...rest, ...Bank_Details[0] } });
            navigate('/Home/SupplierProductMap');
        }
    }

    const BankView = (row) => {

        let Item = row.Bank_Details

        if (Item && Item.length !== 0) {
            setselectRoom2(true)
            setBanklist(Item)
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
        if (row.Status === 'Inactive') {
            const tdata = {
                message: `${row.SupplierId} - ${row.SupplierName} is currently inactive. You need to activate it before editing.`,
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        } else {
            const {
                Bank_Details,
                Status,
                id,
                ...rest
            } = row;
            dispatchvalue({ type: 'SupplierMasterStore', value: { ...rest, ...Bank_Details[0] } });
            navigate('/Home/SupplierMaster');
        }
    }

    const handlestatuschange = (datas) => {
        axios.post(`${UrlLink}Inventory/Supplier_Master_Link`, { SupplierId: datas.SupplierId, StatusEdit: true })
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
                setgetdata(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const SupplierColumn = [
        {
            key: 'id',
            name: 'S.No',
            frozen: true
        },
        {
            key: 'SupplierId',
            name: 'Supplier Id',
            frozen: true
        },
        {
            key: 'SupplierName',
            name: 'Supplier Name',
            frozen: true
        },
        {
            key: 'SupplierType',
            name: 'Supplier Type',
            frozen: true
        },
        {
            key: 'ContactPerson',
            name: 'Contact Person',
        }, {
            key: 'ContactNumber',
            name: 'Contact Number',
        }, {
            key: 'EmailAddress',
            name: ' Email',
        }, {
            key: 'Address',
            name: 'Address',
        }, {
            key: 'RegistrationNumber',
            name: 'Registr No',
        }, {
            key: 'GSTNumber',
            name: 'GST Number',
        }, {
            key: 'PANNumber',
            name: 'PAN Number',
        }, {
            key: 'PaymentTerms',
            name: 'Payment Terms',
        }, {
            key: 'CreditLimit',
            name: 'Credit Limit',
        }, {
            key: 'LeadTime',
            name: 'Lead Time',
        }, {
            key: 'PreferredSupplier',
            name: 'Preferred Supplier',
            renderCell: (params) => (
                <>
                    {params.row.PreferredSupplier ? "Yes" : "No"}
                </>
            )
        }, {
            key: 'Status',
            name: 'Status',
            renderCell: (params) => (
                <Button className="cell_btn"
                    onClick={() => handlestatuschange(params.row)}
                >
                    {params.row.Status}
                </Button>
            )
        }, {
            key: 'Notes',
            name: 'Notes',
        }, {
            key: 'PaymentMode',
            name: 'PaymentMode',
        }, {
            key: 'FileAttachment',
            name: 'Document',
            renderCell: (params) => (
                <>
                    <Button className="cell_btn"
                        onClick={() => HandelViewdata(params.row.FileAttachment)}
                    >
                        <VisibilityIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }, {
            key: 'Item_details',
            name: 'Item List',
            renderCell: (params) => (
                <>
                    <Button className="cell_btn"
                        onClick={() => ItemView(params.row)}
                        title='View Products'

                    >
                        <ListIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn"
                        onClick={() => AddProductsList(params.row)}
                        title='Add new Products'
                    >
                        <PlaylistAddIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }, {
            key: 'Bank_Details',
            name: 'Bank Details',
            renderCell: (params) => (
                <>
                    <Button className="cell_btn"
                        onClick={() => BankView(params.row)}
                    >
                        <ListIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }, {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                <>
                    <Button className="cell_btn"
                        onClick={() => HandelEditdata(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            )
        }

    ]


    const BankColumn = [
        {
            key: 'id',
            name: 'Id',
        }, {
            key: 'BankName',
            name: 'Bank Name',
        }, {
            key: 'AccountNumber',
            name: 'AccountNumber',
        }, {
            key: 'IFSCCode',
            name: 'IFSC Code',
        }, {
            key: 'BankBranch',
            name: 'Bank Branch',
        },

    ]

    return (
        <>
            <div className="Main_container_app">
                <h3>Supplier Master List</h3>
                <br />

                <div className="RegisFormcon_1">
                    {
                        Object.keys(SearchQuery).map((field, indx) => (
                            <div className="RegisForm_1" key={indx + 'key'}>
                                <label htmlFor={field}>
                                    {formatLabel(field)}
                                    <span>:</span>
                                </label>
                                {
                                    ['SupplierType', 'FilterBy'].includes(field) ?
                                        <select
                                            id={field}
                                            name={field}
                                            value={SearchQuery[field]}
                                            onChange={(e) => setSearchQuery(prev => ({ ...prev, [field]: e.target.value }))}

                                        >
                                            {field !== 'FilterBy' && <option value="">Select</option>}
                                            {field === 'SupplierType' &&
                                                ['Manufacturer', 'Distributor', 'Wholesaler', 'Retailer', 'OEM', 'Vendor'].map((ele, ind) => (
                                                    <option key={ind} value={ele}>{ele === 'OEM' ? 'Original Equipment Manufacturer' : ele}</option>
                                                ))
                                            }
                                            {field === 'FilterBy' &&
                                                ['Supplier', 'Item'].map((ele, ind) => (
                                                    <option key={ind} value={ele}>{ele} wise</option>
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
                <div className="Main_container_Btn">
                    <button onClick={handleNewMaster}>
                        <LoupeIcon />
                    </button>
                </div>
                <br />
                <ReactGrid columns={SupplierColumn} RowData={supplierArray} />



            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
            <ModelContainer />


            {selectRoom && Object.keys(ProductList).length !== 0 && (
                <div className="loader" onClick={() => setselectRoom(false)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />

                        <div className="common_center_tag">
                            <span>Item Details</span>
                        </div>
                        <br />
                        {
                            Object.keys(ProductList).map((keys, indx) => (
                                ProductList[keys].length !== 0 &&
                                <React.Fragment key={indx}>
                                    <div className="common_center_tag">
                                        <span> {keys} </span>
                                    </div>
                                    <br />
                                    <ReactGrid columns={ProductListColumn[keys]} RowData={ProductList[keys]} />
                                    <br />
                                </React.Fragment>
                            ))
                        }

                    </div>
                </div>
            )}

            {selectRoom2 && Banklist.length !== 0 && (
                <div className="loader" onClick={() => setselectRoom2(false)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />

                        <div className="common_center_tag">
                            <span>Bank Details</span>
                        </div>
                        <br />
                        <br />


                        <ReactGrid columns={BankColumn} RowData={Banklist} />
                    </div>
                </div>
            )}

        </>
    )
}

export default SupplierMasterList;
