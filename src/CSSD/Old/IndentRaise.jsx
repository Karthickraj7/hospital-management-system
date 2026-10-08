import React, { useCallback, useEffect, useState} from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import LoupeIcon from "@mui/icons-material/Loupe";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid.jsx';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
// import { BlockInvalidcharecternumber, formatLabel } from '../OtherComponent/OtherFunctions';
import { useNavigate } from 'react-router-dom';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert.jsx';



const IndentRaise = () => {
    const dispatchvalue = useDispatch();

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const IndentEditData = useSelector(state => state.Inventorydata?.IndentEditData);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const navigate = useNavigate()


    const [location, setloction] = useState([])
    const [Fstore, setFstore] = useState([])
    const [Tstore, setTstore] = useState([])
    const [product, setProduct] = useState([])
    const [indentEdit,setIndentEdit] = useState([])

    const [raiseForm, setRaiseForm] = useState({
        RaisedFromLocation: '',
        RaisedFromStore: '',
        RaisedToLocation: '',
        RaisedToStore: '',
        Status: '',
        DateType: 'Current',
        CurrentDate: new Date().toISOString().split('T')[0],
        FromDate: '',
        ToDate: '',
        Reason:''
    })

const [requestForm, setRequestForm] = useState({
        pk: null,
        RequestFromLocation: '',
        RequestFromNurseStation: false,
        RequestFromStore: '',
        RequestToLocation: '',
        RequestToNurseStation: false,
        RequestToStore: '',
        RequestDate: '',
        Reason: ''
    });

    const [itemDetail, setItemDetail] = useState({
        id: null,
        pk: null,
        ItemCode: '',
        ItemName: '',
        RaisedQuantity: '',
        Reason: "",
        Status: 'Pending'
    })

    const loadForm = (e) => {
        const { name, value } = e.target;
        setRaiseForm({ ...raiseForm, [name]: value });
        setRaiseForm(prevUpdate => ({ ...prevUpdate, Created_by: userRecord?.username}));

    }
    // const loadItem = (e) => {
    //     const { name, value } = e.target;
    //     setItemDetail({ ...itemDetail, [name]: value });
    // }

    const clearForm = () => {
        setRaiseForm({
            RaisedFromLocation: '',
            RaisedFromStore: '',
            RaisedToLocation: '',
            RaisedToStore: '',
            Status: '',
            DateType: 'Current',
            CurrentDate: new Date().toISOString().split('T')[0],
            FromDate: '',
            ToDate: '',
        })
        setItemDetail({
            id: null,
            pk: null,
            ItemCode: '',
            ItemName: '',
            RaisedQuantity: '',
            Reason: "",
            Status: 'Pending'
        })
        setIndentEdit([])
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

    const handleonchangeitemDetail = (e) => {
        const { name, value } = e.target


        if (name === 'ItemCode') {
            setItemDetail((prev) => ({
                id: prev.id,
                pk: prev.pk,
                [name]: value,
                ItemName: '',
                RaisedQuantity: '',
                Reason: "",
                Status: 'Pending'
            }))
        } else if (name === 'ItemName') {
            setItemDetail((prev) => ({
                id: prev.id,
                pk: prev.pk,
                ItemCode: '',
                [name]: value,
                RaisedQuantity: '',
                Reason: "",
                Status: 'Pending'
            }))
        } else {
            setItemDetail((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handlesearchItems = (type = 'id') => {
        if (itemDetail.ItemCode || itemDetail.ItemName) {
            let find = product.find((ele) => "" + ele.id === itemDetail.ItemCode)
            if (type !== 'id') {
                find = product.find((ele) => "" + ele.ItemName === itemDetail.ItemName)
            }
            if (find) {
                const { id, ItemName, ...rest } = find
                setItemDetail((prev) => ({
                    id: prev.id,
                    pk: prev.pk,
                    ItemCode: id,
                    ItemName: ItemName,
                    ...rest,
                    RaisedQuantity: '',
                    Reason: "",
                    Status: prev?.Status
                }))
            } else {
                const tdata = {
                    message: `Please enter valid Item Code or Item Name to search.`,
                    type: 'warn',
                }
                dispatchvalue({ type: 'toast', value: tdata });
            }
        } else {

            setItemDetail((prev) => ({
                id: prev.id,
                pk: prev.pk,
                ItemCode: type === 'id' ? prev.ItemCode : '',
                ItemName: type !== 'id' ? prev.ItemName : '',
                RaisedQuantity: '',
                Reason: "",
                Status: prev?.Status

            }))
            const tdata = {
                message: `Please fill atleast any one of the Item Code or Item Name to search.`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    const BlockInvalidcharecternumber = (e) => {
        if (['e', 'E', '+', '-', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault()
        }
    }


    const handleAdditemDetail= () => {
        const missingFields = Object.keys(itemDetail).filter(f => !['id', 'pk', 'Status'].includes(f)).filter(f => !itemDetail[f])
        if (missingFields.length !== 0) {
            const tdata = {
                message: `Please fill out all required fields: ${missingFields.join(', ')}`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata })
        } else {
            const CheckDublicate = indentEdit.some((ele) => ele.ItemCode === itemDetail.ItemCode && +ele.id !== +itemDetail.id)
            if (CheckDublicate) {

                dispatchvalue({
                    type: 'toast',
                    value: {
                        message: `This item has already been entered.`,
                        type: 'warn',
                    },
                });

            } else {
                if (itemDetail.id) {
                    setIndentEdit((prev) =>
                        prev.map((product) => +product.id === itemDetail.id ? { ...itemDetail} : product)
                    )
                    setItemDetail({
                        id: null,
                        pk: null,
                        ItemCode: '',
                        ItemName: '',
                        RaisedQuantity: '',
                        Reason: "",
                        Status: 'Pending'
                    })
                } else {
                    setIndentEdit((prev) => ([
                        ...prev,
                        {
                            ...itemDetail,
                            id: prev.length + 1
                        }
                    ]))
                    setItemDetail({
                        id: null,
                        pk: null,
                        ItemCode: '',
                        ItemName: '',
                        RaisedQuantity: '',
                        Reason: "",
                        Status: 'Pending'
                    })
                }
            }
        }
    }


    const handelEdititemDetail = async (params) => {
        try {
            const findadata = await axios.get(`${UrlLink}Inventory/get_item_detials_for_indent`, {
                params: {
                    ItemCode: params.ItemCode,
                    ItemName: params.ItemName,
                }
            })
            const summadata = findadata.data[0]
            const { id, ItemName, Status, ...rest } = summadata
            console.log(summadata);

            setItemDetail({
                id: params.id,
                pk: params.pk,
                ItemCode: id,
                ItemName: ItemName,
                ...rest,
                RaisedQuantity: params?.RaisedQuantity,
                Status: params?.Status
            })
        } catch (error) {
            console.error(error);

        }
    }

    const handelDeleteitenDetail = (params) => {

        if (params.pk) {
            setIndentEdit((prev) =>
                prev.map((product) => +product.pk === +params.pk ? { ...product, Status: 'Cancelled' } : product)
            )
        } else {
            setIndentEdit((prev) =>
                prev.filter(p => +p.id !== +params.id)
            )
        }
    }


    const itemDetailColumns = [
        ...[
            'id', 'Action', 'ItemCode', 'ItemName',
            'ProductCategory', 'SubCategory', 'PackType', 'PackQuantity',
            'RaisedQuantity'
        ].map((field) => ({

            key: field,
            name: field === 'id' ?
                'S.No' : formatLabel(field),

            renderCell: (params) => (
                field === "Action" ? (
                    params.row.Status !== 'Cancelled' ?
                        <>
                            <Button className="cell_btn" onClick={() => handelEdititemDetail(params.row)}>
                                <EditIcon className="check_box_clrr_cancell" />
                            </Button>

                            <Button className="cell_btn" onClick={() => handelDeleteitenDetail(params.row)}>
                                <DeleteIcon className="check_box_clrr_cancell" />
                            </Button>

                        </>
                        :
                        'Cancelled'

                ) :
                    params.row[field] ?
                        params.row[field] :
                        '-'
            )

        }))
    ]

  useEffect(() => {
        setRequestForm((prev) => ({
            ...prev,
            RequestFromLocation: userRecord?.location,
            RequestToLocation: userRecord?.location
        }))
    }, [userRecord?.location])
    useEffect(() => {
        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data
                setloction(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink])

 useEffect(() => {

        if (Object.keys(IndentEditData).length) {
            setRequestForm({
                pk: IndentEditData?.pk,
                RequestFromLocation: IndentEditData?.RaisedFromLocation_pk,
                RequestFromNurseStation: IndentEditData?.RaisedFromNurseStation,
                RequestFromStore: IndentEditData?.RaisedFromNurseStation ? IndentEditData?.RaisedFromNurseStation_pk : IndentEditData?.RaisedFromStore_pk,
                RequestToLocation: IndentEditData?.RaisedToLocation_pk,
                RequestToNurseStation: IndentEditData?.RequestToNurseStation,
                RequestToStore: IndentEditData?.RequestToNurseStation ? IndentEditData?.RaisedToStoreNurseStation_pk : IndentEditData?.RaisedToStore_pk,
                RequestDate: IndentEditData?.RaisedDate,
                Reason: IndentEditData?.RaisedReason
            })
            if (IndentEditData?.Item_Detials) {
                setIndentEdit(IndentEditData?.Item_Detials)
            }
        }

    }, [IndentEditData])


    useEffect(() => {
        if (raiseForm.RaisedFromLocation !== "") {
            axios.get(`${UrlLink}cssd/getstorelocation?Location=${raiseForm.RaisedFromLocation}&store=${'CSSD'}`)
                .then((res) => {
                    const ress = res.data
                    setFstore(ress)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [UrlLink, raiseForm.RaisedFromLocation])

    useEffect(() => {
        if (raiseForm.RaisedToLocation !== "") {
            axios.get(`${UrlLink}cssd/getstorelocation?Location=${raiseForm.RaisedToLocation}&store=${'To'}`)
                .then((res) => {
                    const ress = res.data
                    setTstore(ress)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [UrlLink, raiseForm.RaisedToLocation])


    useEffect(() => {
        axios.get(`${UrlLink}Inventory/get_item_detials_for_indent?ItemCode=${itemDetail.ItemCode}&ItemName=${itemDetail.ItemName}`)
            .then((res) => {
                const ress = res.data
                setProduct(ress)

            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink, itemDetail.ItemCode, itemDetail.ItemName])


    const submitForm = () => {
        const data = {raiseForm, indentEdit}
        axios.post(`${UrlLink}cssd/getstorelocation`, { data })
            .then((res) => {
                console.log(res.data)
                let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                dispatchvalue({ type: 'toast', value: tdata });
                // navigate("/Home/CSSDManage");
                // dispatchvalue({ type: "HrFolder", value: "IndentRaiseList" });
                // dispatchvalue({ type: "setPreviousFolder", value: null }); 
                // dispatchvalue({ type: "showMenu", value: true });
                clearForm()
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handlesubmit = () => {
        const missingFields = Object.keys(requestForm).filter(f => !['pk', 'Reason', 'RequestFromNurseStation', 'RequestToNurseStation'].includes(f)).filter(f => !requestForm[f])
        if (missingFields.length !== 0) {
            dispatchvalue({
                type: 'toast',
                value: {
                    message: `Please fill out all required fields: ${missingFields.join(", ")}`,
                    type: 'warn',
                },
            });
        } else {
            let Senddata = {
                ...requestForm,
                IndentItemsList: indentEdit,
                Created_by: userRecord?.username
            }

            axios.post(`${UrlLink}Inventory/post_indent_raise_details`, Senddata)
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
                    // navigate('/Home/IndentRaiseList');
                    navigate("/Home/InventoryMaster");
                    dispatchvalue({ type: "HrFolder", value: "IndentRaiseList" });
                    dispatchvalue({ type: "setPreviousFolder", value: null }); 
                    dispatchvalue({ type: "showMenu", value: true });

                })
                .catch((err) => {
                    console.log(err);

                })
        }}


    console.log("Data--------",userRecord?.username)
    return (
        <>
        <div className="Main_container_app">
            <h3>Indent Raise List</h3>
            <div className='RegisFormcon_1'  >
                <div className='RegisForm_1' >
                    <label>
                        Raised From Location<span>:</span>{" "}
                    </label>
                    <select name="RaisedFromLocation" value={raiseForm.RaisedFromLocation} onChange={loadForm} >
                        <option value="">Select</option>
                        {location.length > 0 && location.map((item, index) => (
                            <option key={index} value={item.id} >{item.locationName}</option>
                        ))}
                    </select>
                </div>

                <div className='RegisForm_1' >
                    <label>
                        Raised From Store<span>:</span>{" "}
                    </label>
                    <select name="RaisedFromStore" value={raiseForm.RaisedFromStore} onChange={loadForm}>
                        <option value="">Select</option>
                        {Fstore.length > 0 && Fstore.map((item, index) => (
                            <option key={index} value={item.Store_Id} >{item.Store_Name}</option>
                        ))}
                    </select>
                </div>

                <div className='RegisForm_1' >
                    <label>
                        Raised To Location<span>:</span>{" "}
                    </label>
                    <select name="RaisedToLocation" value={raiseForm.RaisedToLocation} onChange={loadForm} >
                        <option value="">Select</option>
                        {location.length > 0 && location.map((item, index) => (
                            <option key={index} value={item.id} >{item.locationName}</option>
                        ))}
                    </select>
                </div>

                <div className='RegisForm_1' >
                    <label>
                        Raised To Store<span>:</span>{" "}
                    </label>
                    <select name="RaisedToStore" value={raiseForm.RaisedToStore} onChange={loadForm}>
                        <option value="">Select</option>
                        {Tstore.length > 0 && Tstore.map((item, index) => (
                            <option key={index} value={item.Store_Id} >{item.Store_Name}</option>
                        ))}
                    </select>
                </div>

                <div className='RegisForm_1' >
                    <label>
                        Status<span>:</span>{" "}
                    </label>
                    <select name="Status" value={raiseForm.Status} onChange={loadForm}>
                        <option value="">Select</option>
                        <option value="Raised">Raised</option>
                        <option value="Approved">Approved</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                </div>
                <div className='RegisForm_1' >
                    <label>
                        Date Type<span>:</span>{" "}
                    </label>
                    <select name="DateType" value={raiseForm.DateType} onChange={loadForm}>
                        <option value="Current">Current</option>
                        <option value="Customize">Customize</option>
                    </select>
                </div>

                {raiseForm.DateType === "Current" ? <div className='RegisForm_1' >
                    <label>
                        Current Date<span>:</span>{" "}
                    </label>
                    <input
                        type="date"
                        name="CurrentDate"
                        value={raiseForm.CurrentDate}
                        onChange={loadForm}
                    />
                </div> :
                    <>
                        <div className='RegisForm_1' >
                            <label>
                                From Date<span>:</span>{" "}
                            </label>
                            <input
                                type="date"
                                name="FromDate"
                                value={raiseForm.FromDate}
                                onChange={loadForm}
                            />
                        </div>
                        <div className='RegisForm_1' >
                            <label>
                                To Date<span>:</span>{" "}
                            </label>
                            <input
                                type="date"
                                name="ToDate"
                                value={raiseForm.ToDate}
                                onChange={loadForm}
                            />
                        </div>
                    </>
                }
                <div className='RegisForm_1' >
                            <label>
                                Reason<span>:</span>{" "}
                            </label>
                            <textarea
                                type="text"
                                name="Reason"
                                value={raiseForm.Reason}
                                onChange={loadForm}
                            />
                        </div>
            </div>


            <h3>Item Details</h3>

            <div className="RegisFormcon_1" >
                {
                    Object.keys(itemDetail).filter(f => !['id', 'pk', 'Status'].includes(f)).map((field, index) => (
                        <div className="RegisForm_1" key={index + 'ind_raise_key'} >
                            <label htmlFor={field}>
                                {formatLabel(field)}
                                <span>:</span>
                            </label>
                            {
                                ['ItemCode', 'ItemName'].includes(field) ?
                                    <div className='Search_patient_icons'>
                                        <input
                                            type={'text'}
                                            id={field}
                                            name={field}
                                            list={`${field}_indent_list`}
                                            value={itemDetail[field]}
                                            onChange={handleonchangeitemDetail}
                                        />

                                        <datalist id={`${field}_indent_list`}>
                                            {field === 'ItemCode' &&
                                                product.map((field, indx) => (
                                                    <option key={indx} value={field.id}>
                                                        {`${field.id} | ${field.ItemName}`}
                                                    </option>
                                                ))
                                            }
                                            {field === 'ItemName' &&
                                                product.map((field, indx) => (
                                                    <option key={indx} value={field.ItemName}>
                                                        {`${field.id} | ${field.ItemName}`}
                                                    </option>
                                                ))
                                            }
                                        </datalist>

                                        <span onClick={(e) => handlesearchItems(field === 'ItemCode' ? 'id' : 'name')}>
                                            <ManageSearchIcon />
                                        </span>

                                    </div>
                                    : field === 'Reason' ?
                                        <textarea
                                            name={field}
                                            value={itemDetail[field]}
                                            onChange={handleonchangeitemDetail}
                                        />
                                        :
                                        <input
                                            type={['RaisedQuantity'].includes(field) ? 'number' : 'text'}
                                            id={field}
                                            name={field}
                                            value={itemDetail[field]}
                                            onChange={handleonchangeitemDetail}
                                            onKeyDown={BlockInvalidcharecternumber}
                                            disabled={!['RaisedQuantity'].includes(field)}
                                        />
                            }
                        </div>
                    ))}
            </div>
            <div className="Main_container_Btn">
                <button onClick={handleAdditemDetail}>
                    {itemDetail.id ? 'Update' : 'Add'}
                </button>
            </div>
            {
                indentEdit.length !== 0 &&

                <>
                    <div className='RegisFormcon_1 jjxjx_'>
                        < ReactGrid columns={itemDetailColumns} RowData={indentEdit} />
                    </div>

                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={submitForm}>
                            {/* {requestForm.pk ? 'Update Indent' : 'Save'} */}Save
                        </button>
                    </div>
                </>
            }

        </div>
        <ToastAlert Message={toast.message} Type={toast.type} />

        </>
    )
}

export default IndentRaise
