import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ModelContainer from '../../../OtherComponent/ModelContainer/ModelContainer';
import ToastAlert from '../../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ListIcon from '@mui/icons-material/List';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import LoupeIcon from "@mui/icons-material/Loupe";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { formatunderscoreLabel,formatLabel } from '../../../OtherComponent/OtherFunctions';


const GENIndentIssueList = () => {

    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const [ShowItems, setShowItems] = useState(false)
    const [getstate, setgetstate] = useState(false)
    const [ItemsData, setItemsData] = useState([])
    const [IndentData, setIndentData] = useState([])
    const [summashow, setsummashow] = useState(null)

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
        Indent_Type: 'raise',
        Raise_Invoice_No: '',
        Issue_Invoice_No: '',
        RaisedFromLocation: '',
        RaisedFromNurseStation: false,
        RaisedFromStore: '',
        RaisedToLocation: '',
        RaisedToNurseStation: false,
        RaisedToStore: '',
        Status: 'Waiting',
        DateType: 'Current',
        CurrentDate: TodayDate,
        FromDate: '',
        ToDate: '',
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
        setsearchQuery(prev => ({
            ...prev,
            Status: searchQuery.Indent_Type === 'raise' ? 'Waiting' : 'Issued'
        }))
    }, [searchQuery.Indent_Type])
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
            axios.get(`${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${searchQuery.RaisedFromLocation}&IsFromWardStore=${searchQuery.RaisedFromNurseStation}`)
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
            axios.get(`${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${searchQuery.RaisedToLocation}&IsFromWardStore=${searchQuery.RaisedToNurseStation}`)
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
        axios.get(`${UrlLink}Inventory/GEN_post_indent_issue_details`, { params: { ...searchQuery }, timeout: 10000 })
            .then((res) => {
                setIndentData(Array.isArray(res.data) ? res.data : [])
            })
            .catch((err) => {
                console.error(err);
            })
    }, [UrlLink, getstate, searchQuery])



    const ItemView = (row) => {
        console.log("rowviewitemdetails",row);
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

    const handleNewMaster = () => {
        // navigate('/Home/IndentIssue')
        navigate("/Home/InventoryMaster");
        dispatchvalue({ type: "HrFolder", value: "GENIndentIssue" });
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });
        dispatchvalue({ type: 'IndentEditData', value: {} });
    }
    const HandelEditdata = (params) => {
        console.log(params);

        // navigate('/Home/IndentIssue')
        navigate("/Home/InventoryMaster");
        dispatchvalue({ type: "HrFolder", value: "GENIndentIssue" });
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });

        dispatchvalue({ type: 'IndentEditData', value: { editMode: true, ...params } });
    }

    const HandelStatusdata = (params, Status = 'Approved') => {
        const confirm = window.confirm(`Are you sure want to ${Status} the Indent. Please double check the Indent detials, because it cannot be updated`)
        if (confirm) {
            axios.post(`${UrlLink}Inventory/GEN_Indent_Issue_Details_Approve_link`, {
                IndentType: searchQuery.Indent_Type,
                InvoiceNo: searchQuery.Indent_Type === 'raise' ? params?.Raised_pk : params?.Issued_pk,
                Status: Status,
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

    const HandelProceeddata = (params) => {
        // navigate('/Home/IndentIssue')
        navigate("/Home/InventoryMaster");
        dispatchvalue({ type: "HrFolder", value: "GENIndentIssue" });
        dispatchvalue({ type: "setPreviousFolder", value: null }); 
        dispatchvalue({ type: "showMenu", value: true });
        dispatchvalue({ type: 'IndentEditData', value: { ...params } });
    }




    const IndentColumn = [

        {
            key: 'id',
            name: 'S.No',
        },
        {
            key: 'Indent_Type',
            name: 'Indent Type',
        },
        {
            key: 'Raised_pk',
            name: 'Indent Raise Invoice No',
            renderCell: (params) => (
                params.row.Raised_pk ?? '-'
            ),
            width: 200
        },
        {
            key: 'Issued_pk',
            name: 'Indent Issue Invoice No',
            width: 200
        },
        {
            key: 'RaisedDate',
            name: 'Raised Date',
            renderCell: (params) => (
                params.row.RaisedDate ?? '-'
            ),
            width: 200
        },
        {
            key: 'IssuedDate',
            name: 'Issued Date',
            renderCell: (params) => (
                params.row.IssuedDate ?? '-'
            ),
            width: 200
        },

        {
            key: 'RaisedFrom',
            name: 'Raised From',
            width: 200,
            renderCell: (params) => (
                params.row.Raised_pk ?
                    `${params.row.RaisedFromLocation} - ${params.row.RaisedFromNurseStation ? 'NurseStation' : 'store'} - ${params.row.RaisedFromNurseStation ? params.row.RaisedFromNurseStationWard : params.row.RaisedFromStore}`
                    : '-'
            )
        },

        {
            key: 'RaisedTo',
            name: 'Raised To',
            width: 200,
            renderCell: (params) => (
                params.row.Raised_pk ?
                    `${params.row.RaisedToLocation} - ${params.row.RaisedToNurseStation ? 'NurseStation' : 'store'} - ${params.row.RaisedToNurseStation ? params.row.RaisedToNurseStationWard : params.row.RaisedToStore}`
                    : '-'
            )
        },
        {
            key: 'IssuedFrom',
            name: 'Issued From',
            width: 200,
            renderCell: (params) => (
                params.row.Issued_pk ?
                    `${params.row.IssuedFromLocation} - ${params.row.IssuedFromNurseStation ? 'NurseStation' : 'store'} - ${params.row.IssuedFromNurseStation ? params.row.IssuedFromNurseStationWard : params.row.IssuedFromStore}`
                    : '-'
            )
        },

        {
            key: 'IssuedTo',
            name: 'Issued To',
            width: 200,
            renderCell: (params) => (
                params.row.Issued_pk ?
                    `${params.row.IssuedToLocation} - ${params.row.IssuedToNurseStation ? 'NurseStation' : 'store'} - ${params.row.IssuedToNurseStation ? params.row.IssuedToNurseStationWard : params.row.IssuedToStore}`
                    : '-'
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
            name: 'Raised Reason',
            renderCell: (params) => (
                params.row.RaisedReason ?? '-'
            ),
        },

        {
            key: 'RaisedApproved_by',
            name: 'Raised By',
            renderCell: (params) => (
                params.row.RaisedApproved_by ?? '-'
            ),
        },
        {
            key: 'Issued_by',
            name: 'Issued By',
            renderCell: (params) => (
                params.row.Issued_by ?? '-'
            ),
        },

        {
            key: 'Action',
            name: 'Action',
            width: 200,
            renderCell: (params) => (
                <>
                    {
                        searchQuery.Indent_Type === 'raise' ? (
                            params.row.Raise_Status === 'Approved' ?
                                <>
                                    {params.row.Issue_Status === 'Waiting' ?
                                        <>
                                            <Button className="cell_btn"
                                                title='Cancel the Indent'
                                                onClick={() => HandelStatusdata(params.row, 'Cancelled')}
                                            >
                                                <DeleteIcon className="check_box_clrr_cancell" />
                                            </Button>
                                            <Button className="cell_btn"
                                                title='Proceed the Indent'
                                                onClick={() => HandelProceeddata(params.row)}
                                            >
                                                <ArrowForwardIcon className="check_box_clrr_cancell" />
                                            </Button>
                                        </>
                                        :
                                        ['Pending'].includes(params.row.Issue_Status) ?
                                            <Button className="cell_btn"
                                                title='Proceed the Indent'
                                                onClick={() => HandelProceeddata(params.row)}
                                            >
                                                <ArrowForwardIcon className="check_box_clrr_cancell" />
                                            </Button>
                                            :
                                            <Button className="cell_btn">
                                                No Action
                                            </Button>
                                    }


                                </>
                                :
                                <Button className="cell_btn">
                                    No Action
                                </Button>
                        ) : (
                            params.row.Status === 'Issued' ?
                                <>
                                    <Button className="cell_btn"
                                        title='Cancel the Indent'
                                        onClick={() => HandelStatusdata(params.row, 'Cancelled')}
                                    >
                                        <DeleteIcon className="check_box_clrr_cancell" />
                                    </Button>
                                    <Button className="cell_btn"
                                        title='Edit the Indent'
                                        onClick={() => HandelEditdata(params.row)}
                                    >
                                        <EditIcon className="check_box_clrr_cancell" />
                                    </Button>
                                    <Button className="cell_btn"
                                        title='Approve the Indent'
                                        onClick={() => HandelStatusdata(params.row, 'Approved')}
                                    >
                                        <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
                                    </Button>
                                </>
                                :
                                <Button className="cell_btn">
                                    No Action
                                </Button>
                        )


                    }
                </>
            )
        },

    ].filter((f) => {
        if (searchQuery.Indent_Type === 'raise' && ['Issued_pk', 'Indent_Type', 'IssuedFrom', 'IssuedTo'].includes(f.key)) {
            return false
        } else {
            if (searchQuery.Indent_Type === 'issue' && ['RaisedReason'].includes(f.key)) {
                return false
            }
            return true
        }
        return true
    })

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
            renderCell: (params) => (
                params.row.RaisedQuantity ?? '-'
            )
        },
        {
            key: 'IssuedQuantity',
            name: 'Issued Quantity',
            renderCell: (params) => (
                params.row.IssuedQuantity ?? '-'
            )
        },
        {
            key: 'PendingQuantity',
            name: 'Pending Quantity',
            renderCell: (params) => (
                params.row.PendingQuantity ?? '-'
            )
        },

        {
            key: 'SerialNo',
            name: 'Serial No',
            renderCell: (params) => {
                const row = params.row
                return (
                    <>
                        {
                            row.SerialNoAvailable ? (
                                row.SerialNo_status ? (
                                    <Button onClick={() => setsummashow(row)}>
                                        view serial No
                                    </Button>
                                ) :
                                    'selected serial no not vaild, please select other serial no'
                            ) :
                                'serial no not available'
                        }
                    </>
                )
            }
        },
        {
            key: 'Issue_Status',
            name: 'Status',
        }
    ]

    return (

        <>
            <div className="Main_container_app">
                <h3>GEN Indent Issue List</h3>
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
                                <label>{field.includes(['_']) ? formatunderscoreLabel(field) : formatLabel(field) }<span>:</span></label>

                                {
                                    ['Indent_Type', 'DateType', 'RaisedFromLocation', 'RaisedFromStore', 'RaisedToLocation', 'RaisedToStore', 'Status',].includes(field) ? (
                                        <select
                                            name={field}
                                            value={searchQuery[field]}
                                            onChange={handleonchange}
                                        >
                                            {!['DateType', 'Indent_Type'].includes(field) && <option value=''>Select</option>}

                                            {field === 'Indent_Type' && (
                                                ['raise', 'issue'].map((ele, indx) => (
                                                    <option key={indx} value={ele}>{ele}</option>
                                                ))
                                            )}
                                            {field === 'DateType' && (
                                                ['Current', 'Customize'].map((ele, indx) => (
                                                    <option key={indx} value={ele}>{ele}</option>
                                                ))
                                            )}
                                            {field === 'Status' && (
                                                ['Waiting', 'Completed', 'Issued', 'Approved', 'Cancelled'].filter(f => searchQuery.Indent_Type === 'raise' ? ['Waiting', 'Completed', 'Cancelled'].includes(f) : !['Waiting', 'Pending', 'Completed'].includes(f)).map((ele, indx) => (
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
                <ReactGrid columns={IndentColumn} RowData={IndentData} />

            </div>
            {ShowItems && ItemsData.length !== 0 && (
                <div className="loader" onClick={() => {
                    setShowItems(false);
                    setsummashow(null)
                }}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        <br />
                        <div className="common_center_tag">
                            <span>Item Details</span>
                        </div>
                        <br />
                        <ReactGrid columns={IndentItemColumn} RowData={ItemsData} />

                        {
                            summashow && (
                                <>
                                    <br />
                                    <center>Serial No for {summashow?.ItemCode}-{summashow?.ItemName}</center>
                                    <center>Batch No: {summashow?.BatchNo}, IssueQuantity: {summashow?.IssueQuantity}</center>
                                    <br />
                                    <div className='inventory-serial-numbers-container'>
                                        {Array.isArray(summashow?.SerialNo) && summashow?.SerialNo.map(field => (
                                            <div
                                                key={field.pk}
                                                className={`inventory-serial-number`}
                                                style={{ color: 'black' }}
                                            >
                                                {field.Serial_Number}

                                            </div>
                                        ))}
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            )}
            <ToastAlert Message={toast.message} Type={toast.type} />
            <ModelContainer />
        </>
    )
}

export default GENIndentIssueList;
