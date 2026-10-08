import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
// import LoupeIcon from "@mui/icons-material/Loupe";
// import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid.jsx';
// import Button from "@mui/material/Button";
// import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
// import { BlockInvalidcharecternumber, formatLabel } from '../OtherComponent/OtherFunctions';
// import { useNavigate } from 'react-router-dom';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import ListIcon from '@mui/icons-material/List';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';





const Raise = () => {
    const dispatchvalue = useDispatch();

    const [page, setPage] = useState("Raise")
    const [pop, setPop] = useState(false)

    const [Pcategory, setPcategory] = useState([])
    const [Scategory, setScategory] = useState([])
    const [prolist, setprolist] = useState([])
    const [selectedIndentItems, setSelectedIndentItems] = useState([]);
    const [status, setStatus] = useState({});
    const [cancelReason, setCancelReason] = useState({});
    const [invoice, setInvoice] = useState("")
    const [request, setRequest] = useState([])

    const [category, setcategory] = useState("")
    const [subcategory, setsubcategory] = useState("")
    const [product, setproduct] = useState({})


    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    // const IndentEditData = useSelector(state => state.Inventorydata?.IndentEditData);
    const userRecord = useSelector((state) => state.userRecord?.UserData);


    const [location, setloction] = useState([])
    const [Fstore, setFstore] = useState([])
    const [Tstore, setTstore] = useState([])
    const [allItems, setallItems] = useState([])

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
        Reason: ''
    })


    const loadForm = (e) => {
        const { name, value } = e.target;
        setRaiseForm({ ...raiseForm, [name]: value });
        setRaiseForm(prevUpdate => ({ ...prevUpdate, Created_by: userRecord?.username }));

    }
    const loadItem = (e) => {
        const { name, value } = e.target;
        setproduct({ ...product, [name]: value });
    }

    const addItem = useCallback(() => {
        if (product.RaisedQuantity && product.Reason) {
            const newItem = {
                id: product.id,
                pk: null,
                ItemCode: product.id,
                ItemName: product.ItemName,
                RaisedQuantity: product.RaisedQuantity,
                Reason: product.Reason,
                Status: 'Pending'
            };
            setallItems(prevItems => [...prevItems, newItem]);
            setproduct({});
        } else {
            console.log("Enter Quantity Value...");
        }
    }, [product]);

    const deleteItem = (id) => {
        setallItems(allItems.filter((item) => item.id !== id));
    };

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
            Reason: ''
        })
        setallItems([])
        setproduct({})
    }

    const getTableData = useCallback(() => {

        axios.get(`${UrlLink}cssd/selectcategory`)
            .then(response => {
                // console.log(response.data)
                setPcategory(response.data)
            })
            .catch(error => console.error("Error fetching data:", error))

        if (category !== "") {
            axios.put(`${UrlLink}cssd/selectcategory`, { data: category })
                .then(response => {
                    // console.log(response.data)
                    setScategory(response.data)
                })
        }

    }, [UrlLink, setPcategory, category])


const getRequest=useCallback(()=>{
    axios.get(`${UrlLink}cssd/getrequest`)
            .then(response => {
                // console.log(response.data)
                setRequest(response.data)
            })
            .catch(error => console.error("Error fetching data:", error))
},[UrlLink,setRequest])

    const getproduct = useCallback(() => {
        if (category !== "" && subcategory !== "") {
            const data = { category, subcategory }
            axios.put(`${UrlLink}cssd/selectproduct`, { data: data })
                .then(response => {
                    // console.log(response.data)
                    setprolist(response.data)
                })
                .catch(error => console.error("Error fetching data:", error))
        }



    }, [UrlLink, category, subcategory, setprolist])


    useEffect(() => {
        getTableData()
        getproduct()
        getRequest()
    }, [getTableData, getproduct,getRequest])





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


    const submitForm = () => {
        const data = { raiseForm, allItems }
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
                clearForm()
            })
            .catch((err) => {
                console.log(err);
            })
    }



    const handleSubmit = async () => {
        const updateData = selectedIndentItems.map(item => ({
            itemCode:item.item_code,
            serial_no: item.serial_no,
            stock_id: item.stock_id,
            recive_status: status[item.stock_id] || "Waiting",
            reason: status[item.stock_id] === "Canceled" ? (cancelReason[item.stock_id] || "Not Provided") : null,
            raise_invoice: invoice,
            user: userRecord?.username,
        }));

        try {
            const response = await axios.post(`${UrlLink}cssd/getrequest`, { data: updateData });
            console.log("Response:", response.data);
            alert("Status updated successfully!");
            setPop(false);  
            getTableData();
            getRequest();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };



    console.log("Data--------", invoice)
    return (
        <>
            <div className="Main_container_app">

                <div className="RegisterTypecon" style={{ margin: '20px' }}>
                    <div className="RegisterTypecon navchange">

                        <div className="registertypeval">
                            <input type="radio" name="page" value={'Raise'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'Raise'} />
                            <label>
                                Indent Raise
                            </label>
                        </div>

                        {/* <div className="registertypeval" style={{ marginLeft: "30px", }}>
                            <input type="radio" name="page" value={'Issue'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'Issue'} />
                            <label>
                                Indent Issue
                            </label>
                        </div> */}

                        <div className="registertypeval" style={{ marginLeft: "30px", }}>
                            <input type="radio" name="page" value={'Request'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'Request'} />
                            <label>
                                Indent Recive
                            </label>
                        </div>

                    </div>
                </div>

                {page === "Raise" ? <>
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

                    <div className="RegisterTypecon" style={{ margin: "20px", }} >

                        <div className="RegisForm_1" >
                            <label>
                                Product Category<span>:</span>{" "}
                            </label>
                            <select name="category" value={category} onChange={(e) => { setcategory(e.target.value) }} >
                                <option value="">Select</option>
                                {Pcategory.length > 0 && Pcategory.map((item, index) => (
                                    <option key={index} value={item.id}>{item.ProductCategory_Name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="RegisForm_1" >
                            <label>
                                SubCategory<span>:</span>{" "}
                            </label>
                            <select name="subcategory" value={subcategory} onChange={(e) => { setsubcategory(e.target.value); getproduct(); }} >
                                <option value="">Select</option>
                                {Scategory.length > 0 && Scategory.map((item, index) => (
                                    <option key={index} value={item.SubCategory_Id}>{item.SubCategoryName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="RegisForm_1" >
                            <label>
                                Product<span>:</span>{" "}
                            </label>
                            <select
                                name="product"
                                value={JSON.stringify(product)}
                                onChange={(e) => setproduct(JSON.parse(e.target.value))}
                            >
                                <option value="">Select</option>
                                {prolist.length > 0 && prolist.map((item, index) => (
                                    <option key={index} value={JSON.stringify(item)}>
                                        {item.ItemName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {Object.keys(product).length > 0 && 
                        <div className="RegisFormcon_1" style={{ marginTop: "20px", }}>
                            <div className="RegisForm_1" >
                                <label>
                                    ItemCode<span>:</span>{" "}
                                </label>
                                <input type="text" value={product.id} readOnly />
                            </div>
                            <div className="RegisForm_1" >
                                <label>
                                    ItemName<span>:</span>{" "}
                                </label>
                                <input type="text" value={product.ItemName} readOnly />
                            </div>
                            {/* <div className="RegisForm_1" >
                            <label>
                                Generic Name<span>:</span>{" "}
                            </label>
                            <input type="text" value={product.GenericName} readOnly />
                        </div> */}
                            <div className="RegisForm_1" >
                                <label>
                                    HSN Code<span>:</span>{" "}
                                </label>
                                <input type="text" value={product.HSNCode} readOnly />
                            </div>
                            <div className="RegisForm_1" >
                                <label>
                                    Package Quantity<span>:</span>{" "}
                                </label>
                                <input type="text" value={product.PackQty} readOnly />
                            </div>
                            <div className="RegisForm_1" >
                                <label>
                                    Product Category<span>:</span>{" "}
                                </label>
                                <input type="text" value={category} readOnly />
                            </div>
                            <div className="RegisForm_1" >
                                <label>
                                    Product Subcategory<span>:</span>{" "}
                                </label>
                                <input type="text" value={subcategory} readOnly />
                            </div>
                            <div className="RegisForm_1" >
                                <label>
                                    Product Quantity<span>:</span>{" "}
                                </label>
                                <input type="number" name="RaisedQuantity" onChange={loadItem} />
                            </div>
                            <div className="RegisForm_1" >
                                <label>
                                    Reason<span>:</span>{" "}
                                </label>
                                <textarea type="text" name="Reason" onChange={loadItem} />
                            </div>
                        </div>
                    }

                    <div className="Main_container_Btn">
                        <button onClick={addItem}>
                            Add
                        </button>
                    </div>

                    {allItems.length > 0 && <div className="RegisFormcon_1+jjxjx_">
                        <table border="1" className="responsive-table-M007" style={{ width: "500px", margin: "auto", }} >
                            <thead>
                                <tr>
                                    <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>S.No</th>
                                    <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Action</th>
                                    <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Item Code</th>
                                    <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Item Name</th>
                                    <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Raised Quantity</th>

                                </tr>
                            </thead>
                            <tbody>
                                {allItems.map((item, index) => (

                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <DeleteIcon
                                                onClick={() => deleteItem(item.id)}
                                                style={{ cursor: "pointer", color: "red" }}
                                            /></td>
                                        <td>{item.id}</td>
                                        <td>{item.ItemName}</td>
                                        <td>{item.RaisedQuantity}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                        <div className="Main_container_Btn">
                            <button onClick={submitForm}>
                                Save
                            </button>
                            <button onClick={clearForm}>
                                Clear
                            </button>
                        </div>
                    </div>}
                </> :
                    page === "Request" ? <>
                        <h3>Indent Recive List</h3>
                        {/* <div className='RegisFormcon_1'  >
                            <div className='RegisForm_1' >
                                <label>
                                    Indent Type<span>:</span>{" "}
                                </label>
                                <select name="RaisedToLocation" value={raiseForm.RaisedToLocation} onChange={loadForm} >
                                    <option value="issue">Issued</option>
                                    <option value="Recive">Recived</option>
                                </select>

                            </div>
                            <div className='RegisForm_1' >
                                <label>
                                    Raised From Location<span>:</span>{" "}
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
                                    Raised From Store<span>:</span>{" "}
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
                                    Raised To Location<span>:</span>{" "}
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
                                    Raised To Store<span>:</span>{" "}
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
                                            From Date <span>:</span>{" "}
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
                            {/* <div className='RegisForm_1' >
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
                        </div> */}



                        <div className="Selected-table-container">
                            <table className="selected-medicine-table2">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Raise Invoice</th>
                                        <th>Issued Status</th>
                                        <th>Issue Date</th>
                                        <th>Issue From</th>
                                        <th>Issue To</th>
                                        <th>Indent Items</th>
                                        <th>Issued By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {request.length > 0 && request.map((item, index) => (

                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.raise_invoice}</td>
                                            <td>{item.issue_status}</td>
                                            <td>{new Date(item.issue_date).toISOString().split("T")[0]}</td>
                                            <td>{item.issue_from} Store {item.issue_from_store}</td>
                                            <td>{item.issue_to} Store {item.issue_to_store}</td>
                                            <td> <ListIcon onClick={() => {
                                                setSelectedIndentItems(item.indent_item);
                                                setInvoice(item.raise_invoice)
                                                setPop(true);
                                            }} /></td>
                                            <td>{item.issue_by}</td>
                                            <td><CheckCircleOutlineIcon onClick={() => {
                                                setSelectedIndentItems(item.indent_item);
                                                setInvoice(item.raise_invoice);
                                                setPop(true);
                                            }} /></td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>



                        {pop ? <div className="Main_container_app"
                            style={{
                                position: "absolute",
                                backgroundColor: 'white',
                                width: '90%',
                                height: 'fit-content',
                                margin: 'auto',
                                marginTop: '10%',
                                border: '1px solid black'
                            }}>
                            <h3>Indent Items</h3>
                            <div className="Selected-table-container">
                                <table className="selected-medicine-table2">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Item Code</th>
                                            <th>Item Name</th>
                                            <th>Product Category</th>
                                            <th>Sub Category</th>
                                            <th>Pack Type</th>
                                            <th>Pack Quantity</th>
                                            <th>Issued Quantity</th>
                                            <th>Serial No</th>
                                            <th>Receive Status</th>
                                            {/* <th>Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedIndentItems.length > 0 &&
                                            selectedIndentItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.item_code}</td>
                                                    <td>{item.item_name}</td>
                                                    <td>{item.category}</td>
                                                    <td>{item.subcategory}</td>
                                                    <td>{item.pack_type}</td>
                                                    <td>{item.pack_qty}</td>
                                                    <td>{item.issue_qty}</td>
                                                    <td>{item.serial_no}</td>
                                                    <td>
                                                        {/* Dropdown for Status */}
                                                        <select
                                                            value={status[item.stock_id] || "Waiting"}
                                                            onChange={(e) => {
                                                                const newStatus = e.target.value;
                                                                setStatus(prev => ({ ...prev, [item.stock_id]: newStatus }));
                                                                if (newStatus !== "Canceled") {
                                                                    setCancelReason(prev => ({ ...prev, [item.stock_id]: "" }));
                                                                }
                                                            }}
                                                        >
                                                            <option value="Waiting">Waiting</option>
                                                            <option value="Completed">Completed</option>
                                                            <option value="Canceled">Canceled</option>
                                                        </select>

                                                        {/* Dropdown for Cancel Reason (if Canceled is selected) */}
                                                        {status[item.stock_id] === "Canceled" && (
                                                            <select
                                                                value={cancelReason[item.stock_id] || ""}
                                                                onChange={(e) =>
                                                                    setCancelReason(prev => ({ ...prev, [item.stock_id]: e.target.value }))
                                                                }
                                                            >
                                                                <option value="">Select Reason</option>
                                                                <option value="Expire">Expire</option>
                                                                <option value="Damaged">Damaged</option>
                                                            </select>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="Main_container_Btn" style={{ margin: '20px' }}>
                                <button onClick={handleSubmit}>Submit</button>
                                <button onClick={() => { setPop(false); }}>Cancel</button>
                            </div>
                        </div> : <></>}

                    </> :

                        <></>
                }
            </div>


            <ToastAlert Message={toast.message} Type={toast.type} />

        </>
    )
}


export default Raise
