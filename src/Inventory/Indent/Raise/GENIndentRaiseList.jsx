import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ModelContainer from '../../../OtherComponent/ModelContainer/ModelContainer';
import ToastAlert from '../../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ListIcon from '@mui/icons-material/List';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import LoupeIcon from "@mui/icons-material/Loupe";
import { formatunderscoreLabel, formatLabel } from '../../../OtherComponent/OtherFunctions';



const GENIndentRaiseList = () => {


    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const [ShowItems, setShowItems] = useState(false)
    const [getstate, setgetstate] = useState(false)
    const [ItemsData, setItemsData] = useState([])
    const [IndentData, setIndentData] = useState([])

    const [summaArray1, setsummaArray1] = useState([])
    const [summaArray2, setsummaArray2] = useState([])
    const [summaArray3, setsummaArray3] = useState([])

    const currentDate = new Date();

     const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

      const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
    

    const [searchQuery, setsearchQuery] = useState({
        Invoice_No: '',
        RaisedFromLocation: '',
        RaisedFromNurseStation: false,
        RaisedFromStore: '',
        RaisedToLocation: '',
        RaisedToNurseStation: false,
        RaisedToStore: '',
        Status: '',
        DateType: 'Current',
        CurrentDate: TodayDate,
        FromDate: '',
        ToDate: '',
        ActivePharmacyStoreId : userRecord?.ActivePharmacyStoreId || "",

    })


    const handleonchange = (e) => {
        const { name, value } = e.target
        if (name === 'RaisedFromNurseStation') {
            setsearchQuery((prev) => ({
                ...prev,
                [name]: value === 'Yes',
                RaisedFromStore: ''
            }))
        } else if (name === 'RaisedToNurseStation') {
            setsearchQuery((prev) => ({
                ...prev,
                [name]: value === 'Yes',
                RaisedToStore: ''
            }))
        } else {
            setsearchQuery((prev) => ({
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

    }, [UrlLink])


    useEffect(() => {
        if (searchQuery.RaisedFromLocation) {
            axios.get(`${UrlLink}Inventory/get_ward_depart_detials_by_loc?Location=${searchQuery.RaisedFromLocation}&IsFromWardStore=${searchQuery.RaisedFromNurseStation}`)
                .then((res) => {
                    const ress = res.data
                    setsummaArray2(ress)

                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            setsummaArray2([])
        }
    }, [UrlLink, searchQuery.RaisedFromLocation, searchQuery.RaisedFromNurseStation])

    useEffect(() => {
        if (searchQuery.RaisedToLocation) {
            axios.get(`${UrlLink}Inventory/GEN_get_ward_store_detials_by_loc?Location=${searchQuery.RaisedToLocation}&IsFromWardStore=${searchQuery.RaisedToNurseStation}`)
                .then((res) => {
                    const ress = res.data.filter(f => searchQuery.RaisedFromLocation === searchQuery.RaisedToLocation && searchQuery.RaisedFromNurseStation === searchQuery.RaisedToNurseStation ? f.id !== +searchQuery.RaisedFromStore : f)
                    setsummaArray3(ress)
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            setsummaArray3([])
        }
    }, [
        UrlLink,
        searchQuery.RaisedToLocation,
        searchQuery.RaisedToNurseStation,
        searchQuery.RaisedFromLocation,
        searchQuery.RaisedFromNurseStation,
        searchQuery.RaisedFromStore
    ])


    useEffect(() => {
        axios.get(`${UrlLink}Inventory/GEN_post_indent_raise_details`, { params: searchQuery, timeout: 10000 })
            .then((res) => {

                console.log('000', res.data);

                setIndentData(Array.isArray(res.data) ? res.data : [])
            })
            .catch((err) => {
                console.error(err);
            })
    }, [UrlLink, getstate, searchQuery])



    const ItemView = (row) => {
        if (row?.Item_Detials && row?.Item_Detials.length !== 0) {
            setShowItems(true)
            setItemsData(row?.Item_Detials)
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
        dispatchvalue({ type: 'IndentEditData', value: {} });

        if (row.Raise_Status === 'Raised') {
            dispatchvalue({ type: 'IndentEditData', value: row });
            // navigate('/Home/IndentRaise');
            navigate("/Home/InventoryMaster");
            dispatchvalue({ type: "HrFolder", value: "GENIndentRaise" });
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });
        }
    }

    const HandelApprovedata = (params) => {
        const confirm = window.confirm('Are you sure want to approve the Indent. Please double check the Indent detials, because it cannot be updated')
        if (confirm) {
            axios.post(`${UrlLink}Inventory/GEN_Indent_Raise_Details_Approve_link`, {
                InvoiceNo: params?.pk,
                Status: 'Approved',
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


    const Handelcanceldata = (params) => {
        const confirm = window.confirm('Are you sure want to Cancel the Indent. Please double check the Indent detials, because it cannot be updated')
        if (confirm) {
            axios.post(`${UrlLink}Inventory/GEN_Indent_Raise_Details_Approve_link`, {
                InvoiceNo: params?.pk,
                Status: 'Cancelled',
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


    const IndentColumn = [

        {
            key: 'id',
            name: 'S.No',
        },
        {
            key: 'pk',
            name: 'Indent Invoice No',
        },
        {
            key: 'RaisedDate',
            name: 'Request Date',
            width: 200
        },

        {
            key: 'RaisedFrom',
            name: 'Raised From',
            width: 200,
            renderCell: (params) => (
                `${params.row.RaisedFromLocation} - ${params.row.RaisedFromNurseStation ? 'NurseStation' : 'store'} - ${params.row.RaisedFromNurseStation ? params.row.RaisedFromStoreNurseStation : params.row.RaisedFromStore}`
            )
        },

        {
            key: 'RaisedTo',
            name: 'Raised To',
            width: 200,
            renderCell: (params) => (
                `${params.row.RaisedToLocation} - ${params.row.RaisedToNurseStation ? 'NurseStation' : 'store'} - ${params.row.RaisedToNurseStation ? params.row.RaisedToStoreNurseStation : params.row.RaisedToStore}`
            )
        },

        {
            key: 'Item_Detials',
            name: 'Indent Items List',
            width: 170,
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
            key: 'RaisedReason',
            name: 'Reason',
        },

        {
            key: 'Raised_by',
            name: 'Raised By',
        },
        {
            key: 'Raise_Status',
            name: 'Status',
        },
        {
            key: 'Edit',
            name: 'Edit',
            renderCell: (params) => (
                <>
                    {params.row.Raise_Status === 'Raised' ?
                        <Button className="cell_btn"
                            onClick={() => HandelEditdata(params.row)}
                        >
                            <EditIcon className="check_box_clrr_cancell" />
                        </Button> :
                        <>No Action</>
                    }
                </>
            )
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                <>
                    {params.row.Raise_Status === 'Raised' ?
                        <>
                            <Button className="cell_btn"
                                onClick={() => HandelApprovedata(params.row)}
                            >
                                <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
                            </Button>
                            <Button className="cell_btn"
                                onClick={() => Handelcanceldata(params.row)}
                            >
                                <DeleteIcon className="check_box_clrr_cancell" />
                            </Button>
                        </>
                        :
                        <Button className="cell_btn">
                            No Action
                        </Button>
                    }
                </>
            )
        },

    ]
    const IndentItemColumn = [
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
            key: 'ProductCategory',
            name: 'Product Category',
        },
        {
            key: 'SubCategory',
            name: 'Sub Category',
        },
        {
            key: 'PackType',
            name: 'Pack Type',
        },
        {
            key: 'PackQuantity',
            name: 'Pack Quantity',
        },
        {
            key: 'RaisedQuantity',
            name: 'Raised Quantity',
        },
        {
            key: 'Raise_Status',
            name: 'Status',
        }
    ]
    const handleNewMaster = () => {
        dispatchvalue({ type: 'IndentEditData', value: {} });
        // navigate('/Home/IndentRaise')
        navigate("/Home/InventoryMaster");
        dispatchvalue({ type: "HrFolder", value: "GENIndentRaise" });
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });

    }
    return (

        <>
            <div className="Main_container_app">
                <h3>GEN Indent Raise List</h3>
                <br />
                <div className="RegisFormcon_1">
                    {
                        Object.keys(searchQuery).filter(ele => {
                            if (searchQuery.DateType === 'Current' && (ele === 'FromDate' || ele === 'ToDate')) {
                                return false
                            } else if (searchQuery.DateType !== 'Current' && ele === 'CurrentDate') {
                                return false
                            } else {
                                return true
                            }
                        }).map((field, indx) => (
                            <div className="RegisForm_1" key={indx}>
                                <label>{field.includes(['_']) ? formatunderscoreLabel(field) : formatLabel(field)}<span>:</span></label>

                                {
                                    ['DateType', 'RaisedFromLocation', 'RaisedFromStore', 'RaisedToLocation', 'RaisedToStore', 'Status'].includes(field) ? (
                                        <select
                                            name={field}
                                            value={searchQuery[field]}
                                            onChange={handleonchange}
                                        >
                                            {field !== 'DateType' && <option value=''>Select</option>}

                                            {field === 'DateType' && (
                                                ['Current', 'Customize'].map((ele, indx) => (
                                                    <option key={indx} value={ele}>{ele}</option>
                                                ))
                                            )}
                                            {field === 'Status' && (
                                                ['Raised', 'Approved', 'Cancelled'].map((ele, indx) => (
                                                    <option key={indx} value={ele}>{ele}</option>
                                                ))
                                            )}
                                            {['RaisedFromLocation', 'RaisedToLocation'].includes(field) &&
                                                summaArray1.map((ele, ind) => (
                                                    <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
                                                ))
                                            }
                                            {['RaisedFromStore'].includes(field) &&
                                                summaArray2.map((ele, ind) => (
                                                    <option key={ind + 'key'} value={ele.id} >{searchQuery.RaisedFromNurseStation ? ele.NurseStation : ele.StoreName}</option>
                                                ))
                                            }

                                            {['RaisedToStore'].includes(field) &&
                                                summaArray3.map((ele, ind) => (
                                                    <option key={ind + 'key'} value={ele.id} >{searchQuery?.RaisedToNurseStation ? ele.NurseStation : ele.StoreName}</option>
                                                ))
                                            }
                                        </select>
                                    ) : ['RaisedFromNurseStation', 'RaisedToNurseStation'].includes(field) ? (
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', width: '150px' }}>
                                            <label style={{ width: 'auto' }} htmlFor={`${field}_yes`}>
                                                <input
                                                    required
                                                    id={`${field}_yes`}
                                                    type="radio"
                                                    name={field}
                                                    style={{ width: '15px' }}
                                                    value='Yes'
                                                    onChange={handleonchange}
                                                    checked={searchQuery[field]}

                                                />
                                                Yes
                                            </label>
                                            <label style={{ width: 'auto' }} htmlFor={`${field}_No`}>
                                                <input
                                                    required
                                                    id={`${field}_No`}
                                                    type="radio"
                                                    name={field}
                                                    style={{ width: '15px' }}
                                                    value='No'
                                                    onChange={handleonchange}
                                                    checked={!searchQuery[field]}

                                                />
                                                No
                                            </label>
                                        </div>
                                    ) :
                                        (
                                            <input
                                                type={['CurrentDate', 'FromDate', 'ToDate'].includes(field) ? 'date' : 'text'}
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

                <div className="Main_container_Btn">
                    <button onClick={handleNewMaster}>
                        <LoupeIcon />
                    </button>
                </div>
                <br />
                <div className='RegisFormcon_1 jjxjx_'>
                    <ReactGrid columns={IndentColumn} RowData={IndentData} />
                </div>

            </div>
            {ShowItems && ItemsData.length !== 0 && (
                <div className="loader" onClick={() => setShowItems(false)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />
                        <div className="common_center_tag">
                            <span>Item Details</span>
                        </div>
                        <br />
                        <div className='RegisFormcon_1 jjxjx_'>
                            <ReactGrid columns={IndentItemColumn} RowData={ItemsData} />
                        </div>
                    </div>
                </div>
            )}
            <ToastAlert Message={toast.message} Type={toast.type} />
            <ModelContainer />
        </>
    )
}

export default GENIndentRaiseList