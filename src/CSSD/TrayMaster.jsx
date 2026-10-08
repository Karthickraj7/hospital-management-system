import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
// import CheckIcon from "@mui/icons-material/Check";


const TrayMaster = () => {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const [edit, setedit] = useState(false)
    const [add, setadd] = useState(false)
    const [page, setpage] = useState(false)
    // const [remove, setremove] = useState("")
    // const [deletes, setdelete] = useState('')

    const [trayData, setTrayData] = useState([])
    const [product, setProudct] = useState([])
    const [batch, setbatch] = useState([])
    const [masterData, setmasterData] = useState([])
    const [trayproduct, setTrayproduct] = useState([])

    const [tray, setTray] = useState({
        tray: "",
        trayName: "",
        trayCategory: "",
        trayCreate: new Date().toISOString().split('T')[0],
        trayExpire: "",
        trayStatus: ""
    })

    const [products, setProduct] = useState({
        store:"CSSD",
        tray: "",
        product: "",
        batch: "",
        productStatus: ""
    })

    const [update, setupdate] = useState({
        tray: "",
        trayName: "",
        trayCategory: "",
        trayCreate: new Date().toISOString().split('T')[0],
        trayExpire: "",
        trayStatus: ""
    })

    const [showTray, setshowTray] = useState({
        trayId: "",
        trayName: ""
    })

    const [move, setMove] = useState({
        product: "",
        action: "",
        tray: "",
        reason: "",
        incharge:""
    })


    const loadTray = (e) => {
        const { name, value } = e.target;
        setTray({ ...tray, [name]: value });
    }

    const loadProduct = (e) => {
        const { name, value } = e.target;
        setProduct({ ...products, [name]: value });
    }

    const loadUpdate = (e) => {
        const { name, value } = e.target;
        setupdate({ ...update, [name]: value });
    }

    const loadMove = (e) => {
        const { name, value } = e.target;
        setMove({ ...move, [name]: value })
    }

    const clearTray = () => {
        setTray({
            tray: "",
            trayName: "",
            trayCategory: "",
            trayCreate: "",
            trayExpire: "",
            trayStatus: ""
        })
    }

    const clearProduct = () => {
        setProduct({
            tray: "",
            product: "",
            batch: "",
            productStatus: ""
        })
    }

    const clearUpdate = () => {
        setupdate({
            tray: "",
            product: "",
            batch: "",
            trayName: "",
            trayCategory: "",
            trayCreate: new Date().toISOString().split('T')[0],
            trayExpire: "",
            trayStatus: ""
        })
    }

    const clearMove = useCallback(() => {
        setMove({
            product: "",
            action: "",
            tray: "",
            reason: ""
        })
    },[setMove])

    const addProduct = useCallback((tray, id) => {
        setadd(true)
        setProduct(prevUpdate => ({ ...prevUpdate, tray: tray }));
        setProduct(prevUpdate => ({ ...prevUpdate, trayId: id }));

    }, [])


    const showProducts = useCallback((id, name) => {
        setpage(true)
        setshowTray(prevUpdate => ({ ...prevUpdate, trayId: id, trayName: name }));

    }, [setpage, setshowTray])

    const chooseMove = useCallback((id) => {
        setMove(prevUpdate =>({...prevUpdate,product: id}))
        setshowTray(prevUpdate => ({ ...prevUpdate, trayId: showTray.trayId}));

    }, [setMove,showTray])

    const offTray = (id,name,command)=>{
        showProducts(id ,command)
        setMove(prevUpdate => ({ ...prevUpdate, trayId: id, trayName: name, Status: false }));
    }



    const chooseEdit = useCallback((Id) => {
        setedit(true);
        setupdate(prevUpdate => ({ ...prevUpdate, Id: Id }));

        console.log(update);
    }, [update]);

    const isValidObject = (obj) => Object.values(obj).every(value => value !== "");


    const getTrayData = useCallback(() => {
        axios.get(`${UrlLink}cssd/create_tray_sterilize`)
            .then(response => {
                // console.log(response.data)
                if (response.data.tray) {
                    setTrayData(response.data.tray)
                }
            })
            .catch(error => console.error("Error fetching data:", error))

        axios.get(`${UrlLink}cssd/createtraymaster`)
            .then(response => {
                // console.log("P---", response.data)
                setmasterData(response.data)
            })
            .catch(error => console.error("Error fetching data:", error))

        axios.put(`${UrlLink}cssd/createproductmaster`, { data: products })
            .then(response => {
                // console.log("P---", response.data)
                if (response.data.product) {
                    setProudct(response.data.product)
                }
                if (response.data.Batch) {
                    setbatch(response.data.Batch)
                }

            })
            .catch(error => console.error("Error fetching data:", error))

        if (edit) {
            axios.put(`${UrlLink}cssd/createtraymaster`, { data: update })
                .then(response => {
                    // console.log("P---", response.data)
                    if (response.data.product) {
                        setProudct(response.data.product)
                    }
                    if (response.data.Batch) {
                        setbatch(response.data.Batch)
                    }

                })
                .catch(error => console.error("Error fetching data:", error))
        }

        if (showTray.trayId !== "") {
            axios.put(`${UrlLink}cssd/getproducts`, { data: showTray })
                .then(response => {
                    console.log(response.data)
                    setTrayproduct(response.data)
                    // setshowTray({
                    //     trayId:"",
                    //     trayName:""
                    // })
                })
                .catch(error => console.error("Error fetching data:", error))
        }

    }, [UrlLink, setTrayData, setProudct, edit, update, products, showTray])


    const submitData = useCallback(() => {
        if (isValidObject(tray)) {
            axios.post(`${UrlLink}cssd/createtraymaster`, { data: tray })
                .then(response => {
                    console.log("P---", response.data)
                    clearTray()
                    getTrayData()
                })
                .catch(error => console.error("Error fetching data:", error))
        }
    }, [UrlLink, getTrayData, tray])

    const submitProduct = useCallback(() => {
        if (products.product !== "" && products.batch !== "") {
            axios.post(`${UrlLink}cssd/createproductmaster`, { data: products })
                .then(response => {
                    console.log("P---", response.data)
                    clearProduct()
                    getTrayData()
                    setadd(false)
                })
                .catch(error => console.error("Error fetching data:", error))
        } else {
            console.log("Enter Data...")
        }
    }, [UrlLink, getTrayData, products])

    const updateData = useCallback(() => {
        axios.put(`${UrlLink}cssd/createtraymaster`, { data: update })
            .then(response => {
                console.log("P---", response.data)
                clearUpdate()
                getTrayData()
                setedit(false);
            })
            .catch(error => console.error("Error fetching data:", error))

    }, [UrlLink, getTrayData, update])

    const moveProduct = useCallback(() => {
        if (move.product !== "") {
            axios.post(`${UrlLink}cssd/getproducts`, { data: move })
                .then(response => {
                    console.log("P---", response.data)
                    clearMove()
                    getTrayData()
                    setpage(false);
                })
                .catch(error => console.error("Error fetching data:", error))
        }
    }, [UrlLink, getTrayData,clearMove,setpage, move])

    // const deleteData = useCallback((D) => {
    //     if (deletes !== "") {
    //         axios.put(`${UrlLink}cssd/createproductmaster`, { data: D })
    //             .then(response => {
    //                 console.log("P---", response.data)
    //                 setdelete("")
    //                 getTrayData()
    //             })
    //             .catch(error => console.error("Error fetching data:", error))
    //     }
    // }, [UrlLink, getTrayData, deletes])


    useEffect(() => {
        getTrayData();
    }, [getTrayData])



    console.log("Data---", move)
    return (
        <div className="Main_container_app">
            <h4>Tray Master</h4>
            <div className="RegisFormcon_1" >
                <div className="RegisForm_1" style={{ margin: "20px", }}>
                    <label>
                        Tray Master Name <span>:</span>{" "}
                    </label>
                    <select name="tray" value={tray.tray} onChange={loadTray} >
                        <option value="">Select</option>
                        {trayData.length > 0 ? trayData.map((item, index) => (
                            <option key={index} value={item.trayId} >{item.trayName}</option>
                        )) : <option> Data Loading</option>}
                    </select>
                </div>
                <div className="RegisForm_1" style={{ margin: "20px", }} >
                    <label>
                        Tray Name <span>:</span>{" "}
                    </label>
                    <input type="text" name="trayName" value={tray.trayName} onChange={loadTray} required />
                </div>

                <div className="RegisForm_1" style={{ margin: "20px", }} >
                    <label>
                        Tray Category <span>:</span>{" "}
                    </label>
                    <input type="checkbox" name="trayCategory" value={"A"} onChange={loadTray} checked={tray.trayCategory.includes("A")}
                        style={{ width: '20px', height: '20px' }} />
                    <label>A</label>
                    <input type="checkbox" name="trayCategory" value={"B"} onChange={loadTray} checked={tray.trayCategory.includes("B")}
                        style={{ width: '20px', height: '20px' }} />
                    <label>B</label>
                    <input type="checkbox" name="trayCategory" value={"C"} onChange={loadTray} checked={tray.trayCategory.includes("C")}
                        style={{ width: '20px', height: '20px' }} />
                    <label>C</label>
                </div>
                <div className="RegisForm_1" style={{ margin: "20px", }} >
                    <label>
                        Tray Creation Date <span>:</span>{" "}
                    </label>
                    <input
                        type="date"
                        name="trayCreate"
                        value={tray.trayCreate}
                        onChange={loadTray}
                    />
                </div>
                <div className="RegisForm_1" style={{ margin: "20px", }} >
                    <label>
                        Tray Expire Date <span>:</span>{" "}
                    </label>
                    <input
                        type="date"
                        name="trayExpire"
                        value={tray.trayExpire}
                        onChange={loadTray}
                    />
                </div>
                <div className="RegisForm_1" style={{ marginLeft: '20px' }}>
                    <label>
                        Tray Status <span>:</span>{" "}
                    </label>
                    <input type="radio" name="trayStatus" value={true} onChange={loadTray} checked={tray.trayStatus === "true"} />
                    <label>Active</label>
                    <input type="radio" name="trayStatus" value={false} onChange={loadTray} checked={tray.trayStatus === "false"} />
                    <label>Inactive</label>
                </div>
            </div>
            <div className="Main_container_Btn" style={{ margin: '20px' }}>
                <button onClick={submitData}>Save</button>

                <button onClick={clearTray}>Clear</button>

            </div>

            <div className="ReactGridWrapper" style={{ marginTop: '20px', }}>
                <table border="1" className="responsive-table-M007">
                    <thead>
                        <tr>
                            <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>S.No</th>
                            <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Tray</th>
                            <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Tray Name</th>
                            <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Category</th>
                            <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Create On</th>
                            <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Expire On</th>
                            <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Status</th>
                            <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {masterData.length > 0 ? masterData.map((item, index) => (

                            <tr key={item.index}>
                                <td>{index + 1}</td>
                                <td>{item.tray_name}</td>
                                <td>{item.TrayName}</td>
                                <td>{item.Category}</td>
                                <td>{item.CreateOn}</td>
                                <td>{item.ExpireOn}</td>
                                <td>{item.Status ? "Active" : "Inactive"}</td>

                                <td>
                                    <div className="actions-button">
                                        < AddCircleIcon className="add-icon" onClick={() => { addProduct(item.tray_id, item.trayId) }} />
                                        < VisibilityIcon className="view-icon" onClick={() => { showProducts(item.trayId, item.TrayName); }} />
                                        < EditIcon className="edit-icon" onClick={() => { chooseEdit(item.trayId) }} />
                                        < CancelIcon className="cancel-icon" onClick={()=>{offTray(item.trayId, item.TrayName,`Remove All Products To Inactive ${item.TrayName} Tray`)}} />
                                        {/* < DeleteForeverIcon className="delete-icon" name="delete" onClick={() => { setdelete(item.trayId); deleteData(item.trayId); }} /> */}
                                    </div>
                                </td>
                            </tr>

                        )) : (<tbody><tr><td className="no-data">Data Not Available</td></tr></tbody>)}
                    </tbody>
                </table>


            </div>

            {
                page ? < div
                    style={{
                        position: "absolute",
                        backgroundColor: 'white',
                        width: '90%',
                        height: 'fit-content',
                        margin: 'auto',
                        marginTop: '10%',
                        border: '1px solid black',
                        borderRadius: '10px'
                    }}
                >
                    <h4 style={{ justifyContent: "center", }}>{showTray.trayName}</h4>

                    <table border="1" className="responsive-table-M007" style={{ width: "500px", margin: "auto", }} >
                        <thead>
                            <tr>
                                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>S.No</th>
                                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Id</th>
                                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Product Name</th>
                                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Serial No</th>
                                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {trayproduct.length > 0 ? trayproduct.map((item, index) => (

                                <tr key={item.index}>
                                    <td>{index + 1}</td>
                                    <td>{item.Id}</td>
                                    <td>{item.ProductName}</td>
                                    <td>{item.BatchNo}</td>

                                    <td>
                                        <div className="actions-button">
                                            < CancelIcon className="cancel-icon" onClick={() => { chooseMove(item.Id) }} />
                                            {/* < DeleteForeverIcon className="delete-icon" name="delete" onClick={() => { setdelete(item.trayId); deleteData(item.trayId); }} /> */}
                                        </div>
                                    </td>
                                </tr>

                            )) : (<tbody><tr><td className="no-data">Data Loading...</td></tr></tbody>)}
                        </tbody>
                    </table>

                    <div>
                        <div className="RegisFormcon_1" >
                            <div className="RegisForm_1" style={{ margin: "20px", }}>
                                <label>
                                    Product <span>:</span>{" "}
                                </label>
                                <select name="product" value={move.product} onChange={loadMove} >
                                    <option value="">Select</option>
                                    {trayproduct.length > 0 ? trayproduct.map((item, index) => (
                                        <option key={index} value={item.Id} >{item.ProductName}</option>
                                    )) : <option> Data Loading</option>}
                                </select>
                            </div>
                            <div className="RegisForm_1" style={{ margin: "20px", }}>
                                <label>
                                    Action <span>:</span>{" "}
                                </label>
                                <select name="action" value={move.action} onChange={loadMove} >
                                    <option value="">Select</option>
                                    <option value="Trash">Trash</option>
                                    <option value="Move">Move</option>
                                </select>
                            </div>

                            {move.action === "Move" ?
                                <div className="RegisForm_1" style={{ margin: "20px", }}>
                                    <label>
                                        Tray <span>:</span>{" "}
                                    </label>
                                    <select name="tray" value={move.tray} onChange={loadMove} >
                                        <option value="">Select</option>
                                        {masterData.length > 0 ? masterData.map((item, index) => (
                                            <option key={index} value={item.trayId} >{item.TrayName}</option>
                                        )) : <option> Data Loading</option>}
                                    </select>
                                </div> : <></>}

                        </div>
                    </div>
                    <div className="RegisFormcon_1" >
                        <div className="RegisForm_1" style={{ margin: "20px", }}>
                            <label>
                                Reason <span>:</span>{" "}
                            </label>
                            <input type="text" name="reason" value={move.reason} onChange={loadMove} />
                        </div>
                        <div className="RegisForm_1" style={{ margin: "20px", }}>
                            <label>
                                Incharge <span>:</span>{" "}
                            </label>
                            <input type="text" name="incharge" value={move.incharge} onChange={loadMove} />
                        </div>

                    </div>

                    <div className="Main_container_Btn" style={{ margin: '20px' }}>
                        <button onClick={moveProduct}>Move</button>
                        <button onClick={() => { setpage(false); clearMove() }}>Close</button>
                    </div>


                </div> : <></>
            }

            {edit ? <div className="Main_container_app"
                style={{
                    position: "absolute",
                    backgroundColor: 'white',
                    width: '90%',
                    height: 'Fit-Content',
                    margin: 'auto',
                    marginTop: '10%',
                    border: '1px solid black'
                }}>
                <h3>Update</h3>
                <div className="RegisFormcon_1" >
                    <div className="RegisForm_1" style={{ margin: "20px", }}>
                        <label>
                            Tray Master Name <span>:</span>{" "}
                        </label>
                        <select name="tray" value={update.tray} onChange={loadUpdate} >
                            <option value="">Select</option>
                            {trayData.length > 0 ? trayData.map((item, index) => (
                                <option key={index} value={item.trayId} >{item.trayName}</option>
                            )) : <option> Data Loading</option>}
                        </select>
                    </div>
                    <div className="RegisForm_1" style={{ margin: "20px", }} >
                        <label>
                            Tray Name <span>:</span>{" "}
                        </label>
                        <input type="text" name="trayName" value={update.trayName} onChange={loadUpdate} required />
                    </div>
                    <div className="RegisForm_1" style={{ margin: "20px", }} >
                        <label>
                            Tray Category <span>:</span>{" "}
                        </label>
                        <input type="checkbox" name="trayCategory" value={"A"} onChange={loadUpdate} checked={update.trayCategory.includes("A")}
                            style={{ width: '20px', height: '20px' }} />
                        <label>A</label>
                        <input type="checkbox" name="trayCategory" value={"B"} onChange={loadUpdate} checked={update.trayCategory.includes("B")}
                            style={{ width: '20px', height: '20px' }} />
                        <label>B</label>
                        <input type="checkbox" name="trayCategory" value={"C"} onChange={loadUpdate} checked={update.trayCategory.includes("C")}
                            style={{ width: '20px', height: '20px' }} />
                        <label>C</label>
                    </div>


                    <div className="RegisForm_1" style={{ margin: "20px", }} >
                        <label>
                            Tray Creation Date <span>:</span>{" "}
                        </label>
                        <input
                            type="date"
                            name="trayCreate"
                            value={update.trayCreate}
                            onChange={loadUpdate}
                        />
                    </div>
                    <div className="RegisForm_1" style={{ margin: "20px", }} >
                        <label>
                            Tray Expire Date <span>:</span>{" "}
                        </label>
                        <input
                            type="date"
                            name="trayExpire"
                            value={update.trayExpire}
                            onChange={loadUpdate}
                        />
                    </div>
                    <div className="RegisForm_1" style={{ marginLeft: '20px' }}>
                        <label>
                            Status <span>:</span>{" "}
                        </label>
                        <input type="radio" name="trayStatus" value={true} onChange={loadUpdate} checked={update.trayStatus === "true"} />
                        <label>Active</label>
                        <input type="radio" name="trayStatus" value={false} onChange={loadUpdate} checked={update.trayStatus === "false"} />
                        <label>Inactive</label>
                    </div>
                </div>
                <div className="Main_container_Btn" style={{ margin: '20px' }}>
                    <button onClick={updateData}>Save</button>
                    <button onClick={() => { setedit(false); clearUpdate() }}>Close</button>
                </div>
            </div> : add ? <div className="Main_container_app"
                style={{
                    position: "absolute",
                    backgroundColor: 'white',
                    width: 'fit-content',
                    height: 'Fit-Content',
                    margin: 'auto',
                    marginTop: '10%',
                    border: '1px solid black'
                }}>
                <h4>Product Master</h4>
                <div className="RegisFormcon_1" >
                    <div className="RegisForm_1" style={{ margin: "20px", }}>
                        <label>
                            Products <span>:</span>{" "}
                        </label>
                        <select name="product" value={products.product} onChange={loadProduct} required>
                            <option value="">Select</option>
                            {product.length > 0 ? product.map((item, index) => (
                                <option key={index} value={item.productName}>{item.productName}</option>
                            )) : <option> Data Loading</option>}
                        </select>
                    </div>
                    <div className="RegisForm_1" style={{ margin: "20px", }}>
                        <label>
                            Product Batch No <span>:</span>{" "}
                        </label>
                        <select name="batch" value={products.batch} onChange={loadProduct} required>
                            <option value="">Select</option>
                            {batch.length > 0 ? batch.map((item, index) => (
                                <option key={index} value={item.batch}>{item.batch}</option>
                            )) : <option> Data Loading</option>}
                        </select>
                    </div>
                </div>
                <div className="Main_container_Btn" style={{ margin: '20px' }}>
                    <button onClick={submitProduct}>Save</button>

                    <button onClick={() => { setadd(false); clearProduct() }}>Close</button>

                </div>
            </div> : <></>}

        </div>
    )
}

export default TrayMaster
