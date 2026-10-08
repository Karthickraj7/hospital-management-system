import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';




const IndentTray = () => {
    // const dispatchvalue = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const [pop, setPop] = useState(false)
    const [pop2, setPop2] = useState(false)
    const [pop3, setPop3] = useState(false)
    const [pop4, setPop4] = useState(false)
    const [page, setPage] = useState("raise")
    const [location, setloction] = useState([])
    const [from, setFrom] = useState([])
    const [trayType, setTrayType] = useState([])
    const [trayData, setTrayData] = useState([])
    const [product, setProduct] = useState([])
    const [selectTray, setSelectTray] = useState({})
    const [raiseData, setRaiseData] = useState([])
    const [issueTray, setIssueTray] = useState({
        TrayId: "",
        TrayName: "",
        Status: ""
    })
    const [issueData, setIssueData] = useState([])
    const [recived, setRecived] = useState([])
    const [recivedTray, setRecivedTray] = useState({
        TrayId: "",
        TrayName: "",
        Status: "",
        Reason: "",
    })
    const [reciveData, setReciveDate] = useState([])

    const [raise, setRaise] = useState({
        raiseFromLocation: "",
        raiseFrom: "",
        raiseFromPlace: "",
        raiseToLocation: "",
        raiseToCssd: "CSSD",
        status: "Raised",
        raiseDate: new Date().toISOString().split('T')[0],
        TrayType: "",
        Tray: [],
        Created_by: userRecord?.username,
    })

    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setRaise({ ...raise, [name]: value });
        setRaise(prevUpdate => ({ ...prevUpdate, Created_by: userRecord?.username }));

    }

    const handleClear = () => {
        setRaise({
            raiseFromLocation: "",
            raiseFrom: "",
            raiseFromPlace: "",
            raiseToLocation: "",
            raiseToCssd: "CSSD",
            status: "Raised",
            raiseDate: new Date().toISOString().split('T')[0],
            TrayType: "",
            Tray: [],
            Created_by: userRecord?.username,
        })
        setIssueData([])
        setIssueTray([])
        setRecived([])
        setRecivedTray([])
    }
    // Issue Tray
    const handleIssueTray = (issueTray, issueData) => {

        setIssueTray(issueTray);
        setIssueData(issueData)
        setPop3(true);
    };

    // Recive Tray
    const handleReciveTray = (reciveTray, reciveData) => {

        setRecivedTray(reciveTray);
        setRecived(reciveData)
        setPop4(true);
    };


    //  HandleCheckIssue
    const handleCheckboxChange = (trayId, newStatus) => {
        setIssueTray(prevTrays =>
            prevTrays.map(tray =>
                tray.TrayId === trayId ? { ...tray, Status: newStatus } : tray
            )
        );
    };

    // HandleCheckRecive
    const handleReciveCheckboxChange = (trayId, newStatus) => {
        setRecivedTray(prevTrays =>
            prevTrays.map(tray =>
                tray.TrayId === trayId ? { ...tray, Status: newStatus } : tray
            )
        );
    };


    //  HandleIssuedSubmit
    const handleIssueSubmit = () => {

        if (issueData.raiseId !== "") {
            const Data = { issueData, issueTray }
            try {
                axios.put(`${UrlLink}cssd/indentTray`, { data: Data });
                alert("Status updated successfully!");
                setPop3(false);
                getData();
                getFinalData();
                handleClear();
            } catch (error) {
                console.error("Error updating status:", error);
                alert("Failed to update status.");
            }
        } else {
            alert("Some values are missing!...");
        }
    };

    // HandleReciveSubmit
    const handleReciveSubmit = () => {

        if (recived.raiseId !== "") {
            const Data = { recived, recivedTray }
            try {
                axios.post(`${UrlLink}cssd/indentRecive`, { data: Data });
                alert("Status updated successfully!");
                setPop4(false);
                getFinalData()
                handleClear();
                // console.log(Data)
            } catch (error) {
                console.error("Error updating status:", error);
                alert("Failed to update status.");
            }
        } else {
            alert("Some values are missing!...");
        }
    };


    const addItem = useCallback(() => {
        if (Object.keys(selectTray).length !== 0) {
            const newItem = {
                TrayId: selectTray.trayId,
                TrayName: selectTray.TrayName,
                TrayCategory: selectTray.TrayCategory,
                TrayCreate: selectTray.TrayCreateOn,
                TrayExpire: selectTray.TrayExpireOn,
                Product: selectTray.productDetails,
                Status: 'Pending'
            };
            setRaise(prevRaise => ({
                ...prevRaise,
                Tray: [...prevRaise.Tray, newItem]
            }));
            setSelectTray({});
        }
    }, [selectTray]);

    const deleteItem = (id) => {
        setRaise(prevRaise => ({
            ...prevRaise,
            Tray: prevRaise.Tray.filter(item => item.TrayId !== id)
        }));
    };

    const getData = useCallback(() => {
        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data
                setloction(ress)
            })
            .catch((err) => {
                console.log(err);
            })

        axios.get(`${UrlLink}cssd/create_tray_sterilize`)
            .then((response) => {
                if (response.data.tray) {
                    setTrayType(response.data.tray)
                }
                else {
                    setTrayType([])
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink, setTrayType])

   const getFinalData= useCallback(() => {
        axios.get(`${UrlLink}cssd/indentTrayy?Location=${raise.raiseFromLocation}&From=${raise.raiseFrom}&trayType=${raise.TrayType}&TrayID=${selectTray.trayId || 0}`)
            .then((response) => {
                // console.log(response.data)
                if (response.data.FromData) {
                    setFrom(response.data.FromData)
                } if (response.data.TrayData) {
                    setTrayData(response.data.TrayData)
                } if (response.data.Product) {
                    setSelectTray(prevTray => ({
                        ...prevTray,
                        productDetails: response.data.Product
                    }));
                } if (response.data.RaiseData) {
                    setRaiseData(response.data.RaiseData)
                } if (response.data.ReciveData) {
                    setReciveDate(response.data.ReciveData)
                }
            })
            .catch((err) => {
                console.log(err);
            })


    }, [UrlLink, raise.raiseFromLocation, raise.raiseFrom, raise.TrayType, selectTray.trayId, setRaiseData, setSelectTray, setTrayData, setFrom, setReciveDate])

    useEffect(() => {
        getData();
        getFinalData();
    }, [getData, getFinalData])


    const handleSubmit = () => {

        if (raise.raiseFromLocation !== "" && raise.raiseFromPlace !== "" && raise.raiseToLocation !== "" && raise.Tray.length > 0) {
            try {
                const response = axios.post(`${UrlLink}cssd/indentTray`, { data: raise });
                console.log("Response:", response.data);
                alert("Status updated successfully!");
                setPop(false);
                getData();
                handleClear();
            } catch (error) {
                console.error("Error updating status:", error);
                alert("Failed to update status.");
            }
        } else {
            alert("Some values are missing!...");
        }
    };




    console.log("data--------", recivedTray)
    return (
        <>
            <div className="Main_container_app">

                <div className="RegisterTypecon" style={{ margin: '20px' }}>
                    <div className="RegisterTypecon navchange">

                        <div className="registertypeval">
                            <input type="radio" name="page" value={'raise'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'raise'} />
                            <label>
                                Indent Raise
                            </label>
                        </div>

                        <div className="registertypeval" style={{ marginLeft: "30px", }}>
                            <input type="radio" name="page" value={'issue'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'issue'} />
                            <label>
                                Indent Issue
                            </label>
                        </div>

                        <div className="registertypeval" style={{ marginLeft: "30px", }}>
                            <input type="radio" name="page" value={'request'} onChange={(e) => { setPage(e.target.value) }} checked={page === 'request'} />
                            <label>
                                Indent Recived
                            </label>
                        </div>

                    </div>
                </div>

                {
                    page === "raise" ? <div className="Main_container_app">
                        <h3>Tray Indent Raise</h3>
                        <div className='RegisFormcon_1'  >
                            <div className='RegisForm_1' >
                                <label>
                                    Raised From Location<span>:</span>{" "}
                                </label>
                                <select name="raiseFromLocation" value={raise.raiseFromLocation} onChange={handleOnchange} >
                                    <option value="">Select</option>
                                    {location.length > 0 && location.map((item, index) => (
                                        <option key={index} value={item.id} >{item.locationName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='RegisForm_1' >
                                <label>
                                    Raised Area Category<span>:</span>{" "}
                                </label>
                                <select name="raiseFrom" value={raise.raiseFrom} onChange={handleOnchange}>
                                    <option value="">Select</option>
                                    <option value="nurseStation">Nurse Station</option>
                                    <option value="OT">Opration Theaters</option>
                                </select>
                            </div>
                            <div className='RegisForm_1' >
                                <label>
                                    Raised From Area<span>:</span>{" "}
                                </label>
                                <select name="raiseFromPlace" value={raise.raiseFromPlace} onChange={handleOnchange} >
                                    <option value="">Select</option>
                                    {from.length > 0 && from.map((item, index) => (
                                        <option key={index} value={item.Id} >{item.Name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='RegisForm_1' >
                                <label>
                                    Raised To Location<span>:</span>{" "}
                                </label>
                                <select name="raiseToLocation" value={raise.raiseToLocation} onChange={handleOnchange} >
                                    <option value="">Select</option>
                                    {location.length > 0 && location.map((item, index) => (
                                        <option key={index} value={item.id} >{item.locationName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='RegisForm_1' >
                                <label>
                                    Raised To Cssd<span>:</span>{" "}
                                </label>
                                <input type="text" name="raiseToCssd" value={raise.raiseToCssd} onChange={handleOnchange} readOnly />
                            </div>
                            <div className='RegisForm_1' >
                                <label>
                                    Status<span>:</span>{" "}
                                </label>
                                <input type="text" name="status" value={raise.status} onChange={handleOnchange} readOnly />
                            </div>
                            <div className='RegisForm_1' >
                                <label>
                                    Raise Date<span>:</span>{" "}
                                </label>
                                <input type="date" name="raiseDate" value={raise.raiseDate} onChange={handleOnchange} />
                            </div>
                            <div className='RegisForm_1' >
                                <label>
                                    Tray Type<span>:</span>{" "}
                                </label>
                                <select name="TrayType" value={raise.TrayType} onChange={handleOnchange} >
                                    <option value="">Select</option>
                                    {trayType.length > 0 && trayType.map((item, index) => (
                                        <option key={index} value={item.trayId} >{item.trayName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='RegisForm_1'>
                                <label>
                                    Raise Tray <span>:</span>{" "}
                                </label>
                                {/* <select name="Tray" value={raise.TrayType} onChange={handleOnchange} >
                                    <option value="">Select</option>
                                    {trayData.length > 0 && trayData.map((item, index) => (
                                        <option key={index} value={item.trayId} >{item.TrayName}</option>
                                    ))}
                                </select> */}
                                <select
                                    name="Tray"
                                    value={JSON.stringify(selectTray)}
                                    onChange={(e) => setSelectTray(JSON.parse(e.target.value))}
                                >
                                    <option value={[]}>Select</option>
                                    {trayData.length > 0 && trayData.map((item, index) => (
                                        <option key={index} value={JSON.stringify(item)}>
                                            {item.TrayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {Object.keys(selectTray).length > 0 && (
                            <div className="RegisFormcon_1" style={{ marginTop: "20px" }}>
                                <div className="RegisForm_1">
                                    <label>Tray Id<span>:</span> </label>
                                    <input type="text" value={selectTray?.trayId || ""} readOnly />
                                </div>
                                <div className="RegisForm_1">
                                    <label>Tray Name<span>:</span> </label>
                                    <input type="text" value={selectTray?.TrayName || ""} readOnly />
                                </div>
                                <div className="RegisForm_1">
                                    <label>Tray Category<span>:</span> </label>
                                    <input type="text" value={selectTray?.TrayCategory || ""} readOnly />
                                </div>
                                <div className="RegisForm_1">
                                    <label>Tray Created Date<span>:</span> </label>
                                    <input type="text" value={selectTray?.TrayCreateOn || ""} readOnly />
                                </div>
                                <div className="RegisForm_1">
                                    <label>Tray Expire Date<span>:</span> </label>
                                    <input type="text" value={selectTray?.TrayExpireOn || ""} readOnly />
                                </div>
                                <div className="RegisForm_1">
                                    <label>Tray Products<span>:</span> </label>
                                    <label><ListIcon onClick={() => { setPop(true) }} /></label>
                                </div>
                            </div>
                        )}

                        {pop && selectTray?.productDetails?.length > 0 && (
                            <div className="Main_container_app"
                                style={{
                                    position: "absolute",
                                    backgroundColor: 'white',
                                    width: '90%',
                                    height: 'fit-content',
                                    margin: 'auto',
                                    marginTop: '10%',
                                    border: '1px solid black'
                                }}
                            >
                                <h3>Product Details</h3>
                                <div className="Selected-table-container">
                                    <table className="selected-medicine-table2">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Product Name</th>
                                                <th>Product Batch</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectTray.productDetails.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.ProductName || "N/A"}</td>
                                                    <td>{item?.BatchNo || "N/A"}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="Main_container_Btn">
                                    <button onClick={() => { setPop(false) }}>
                                        Close
                                    </button>
                                </div>

                            </div>

                        )}


                        <div className="Main_container_Btn">
                            <button onClick={addItem}>
                                Add
                            </button>
                            <button onClick={handleClear}>
                                Clear
                            </button>
                        </div>

                        {raise.Tray.length > 0 && <div className="RegisFormcon_1+jjxjx_">
                            <div className="Selected-table-container">
                                <table className="selected-medicine-table2">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Action</th>
                                            <th>Tray Code</th>
                                            <th>Tray Name</th>
                                            <th>Tray Category</th>
                                            <th>Tray Products</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {raise.Tray.map((item, index) => (

                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <DeleteIcon
                                                        onClick={() => deleteItem(item.TrayId)}
                                                        style={{ cursor: "pointer", color: "red" }}
                                                    /></td>
                                                <td>{item.TrayId}</td>
                                                <td>{item.TrayName}</td>
                                                <td>{item.TrayCategory}</td>
                                                <td><ListIcon onClick={() => { setPop2(true); setProduct(item.Product) }} /></td>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>

                            </div>
                            <div className="Main_container_Btn">
                                <button onClick={handleSubmit}>
                                    Save
                                </button>
                                <button onClick={handleClear}>
                                    Clear
                                </button>
                            </div>
                        </div>}
                        {pop2 && product.length > 0 && (
                            <div className="Main_container_app"
                                style={{
                                    position: "absolute",
                                    backgroundColor: 'white',
                                    width: '90%',
                                    height: 'fit-content',
                                    margin: 'auto',
                                    marginTop: '10%',
                                    border: '1px solid black'
                                }}
                            >
                                <h3>Product Details</h3>
                                <div className="Selected-table-container">
                                    <table className="selected-medicine-table2">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Product Name</th>
                                                <th>Product Batch</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.ProductName || "N/A"}</td>
                                                    <td>{item?.BatchNo || "N/A"}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="Main_container_Btn">
                                    <button onClick={() => { setPop2(false) }}>
                                        Close
                                    </button>
                                </div>

                            </div>
                        )}
                        <div className="Selected-table-container">
                            <table className="selected-medicine-table2">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Raise Invoice</th>
                                        <th>Status</th>
                                        <th>Raise Date</th>
                                        <th>Raise From</th>
                                        <th>Raise To</th>
                                        <th>Raised Trays</th>
                                        <th>Raise By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {raiseData.length > 0 ? raiseData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item?.raiseId || "N/A"}</td>
                                            <td>{item?.Status || "N/A"}</td>
                                            <td>{item?.Raise_Date || "N/A"}</td>
                                            <td>{item?.Raise_From_Location_Name || "N/A"} - {item?.Raise_From_NurseStation_Location_Name || item.Raise_From_OT_Location_Name}</td>
                                            <td>{item?.Raise_To_Location_Name || "N/A"} - {item?.Raise_To_Department}</td>
                                            <td>{item?.Raise_Tray_Name || "N/A"}</td>
                                            <td>{item?.created_by || "N/A"}</td>
                                        </tr>
                                    )) : (<tbody><tr><td className="no-data">Data Not Available</td></tr></tbody>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                        : page === "issue" ? <div className="Main_container_app">
                            <h3>Tray Indent Issue</h3>
                            <div className="Selected-table-container">
                                <table className="selected-medicine-table2">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Raise Invoice</th>
                                            <th>Status</th>
                                            <th>Issue Date</th>
                                            <th>Issue From</th>
                                            <th>Issue To</th>
                                            <th>Issued Trays</th>
                                            <th>Issued By</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {raiseData.length > 0 ? raiseData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item?.raiseId || "N/A"}</td>
                                                <td>{item?.Status || "N/A"}</td>
                                                <td>{item?.Raise_Date || "N/A"}</td>
                                                <td>{item?.Raise_To_Location_Name || "N/A"} - {item?.Raise_To_Department}</td>
                                                <td>{item?.Raise_From_Location_Name || "N/A"} - {item?.Raise_From_NurseStation_Location_Name || item.Raise_From_OT_Location_Name}</td>
                                                <td>{item?.Raise_Tray_Name || "N/A"}</td>
                                                <td>{item?.created_by || "N/A"}</td>
                                                <td><CheckCircleOutlineIcon onClick={() => { handleIssueTray(item?.Raise_Tray_Id, item) }} /></td>
                                            </tr>
                                        )) : (<tbody><tr><td className="no-data">Data Not Available</td></tr></tbody>)}
                                    </tbody>
                                </table>
                            </div>

                            {pop3 && issueTray.length > 0 && (
                                <div className="Main_container_app"
                                    style={{
                                        position: "absolute",
                                        backgroundColor: 'white',
                                        width: '90%',
                                        height: 'fit-content',
                                        margin: 'auto',
                                        marginTop: '10%',
                                        border: '1px solid black'
                                    }}
                                >
                                    <h3>Product Details</h3>
                                    <div className="Selected-table-container">
                                        <table className="selected-medicine-table2">
                                            <thead>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Tray Code</th>
                                                    <th>Tray Name</th>
                                                    <th>Issue</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {issueTray.map((tray, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{tray.TrayId || "N/A"}</td>
                                                        <td>{tray.TrayName || "N/A"}</td>
                                                        <td style={{ display: "flex", margin: "5px", }}>
                                                            <input
                                                                type="radio"
                                                                value="Issued"
                                                                checked={tray.Status === "Issued"}
                                                                onChange={() => handleCheckboxChange(tray.TrayId, "Issued")}
                                                            />
                                                            <label>Issued</label>
                                                            <input
                                                                type="radio"
                                                                value="Raised"
                                                                checked={tray.Status === "Raised"}
                                                                onChange={() => handleCheckboxChange(tray.TrayId, "Raised")}
                                                            />
                                                            <label>Raised</label>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="Main_container_Btn">
                                        <button onClick={handleIssueSubmit}>Submit</button>
                                        <button onClick={() => { setPop3(false) }}>
                                            Close
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>
                            : <div className="Main_container_app">
                                <h3>Tray Indent Recive</h3>
                                <div className="Selected-table-container">
                                    <table className="selected-medicine-table2">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Raise Invoice</th>
                                                <th>Status</th>
                                                <th>Raise Date</th>
                                                <th>Raise From</th>
                                                <th>Raise To</th>
                                                <th>Raised Trays</th>
                                                <th>Raise By</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reciveData.length > 0 ? reciveData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.raiseId || "N/A"}</td>
                                                    <td>{item?.Status || "N/A"}</td>
                                                    <td>{item?.Raise_Date || "N/A"}</td>
                                                    <td>{item?.Raise_From_Location_Name || "N/A"} - {item?.Raise_From_NurseStation_Location_Name || item.Raise_From_OT_Location_Name}</td>
                                                    <td>{item?.Raise_To_Location_Name || "N/A"} - {item?.Raise_To_Department}</td>
                                                    <td>{item?.Raise_Tray_Name || "N/A"}</td>
                                                    <td>{item?.created_by || "N/A"}</td>
                                                    <td><CheckCircleOutlineIcon onClick={() => { handleReciveTray(item?.Raise_Tray_Id, item) }} /></td>
                                                </tr>
                                            )) : (<tbody><tr><td className="no-data">Data Not Available</td></tr></tbody>)}
                                        </tbody>
                                    </table>
                                </div>

                                {pop4 && recivedTray.length > 0 && (
                                    <div className="Main_container_app"
                                        style={{
                                            position: "absolute",
                                            backgroundColor: 'white',
                                            width: '90%',
                                            height: 'fit-content',
                                            margin: 'auto',
                                            marginTop: '10%',
                                            border: '1px solid black'
                                        }}
                                    >
                                        <h3>Product Details</h3>
                                        <div className="Selected-table-container">
                                            <table className="selected-medicine-table2">
                                                <thead>
                                                    <tr>
                                                        <th>S.No</th>
                                                        <th>Tray Code</th>
                                                        <th>Tray Name</th>
                                                        <th>Issue</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recivedTray.map((tray, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{tray.TrayId || "N/A"}</td>
                                                            <td>{tray.TrayName || "N/A"}</td>
                                                            <td style={{ display: "flex", margin: "5px" }}>
                                                                <input
                                                                    type="radio"
                                                                    value="Recived"
                                                                    checked={tray.Status === "Recived"}
                                                                    onChange={() => handleReciveCheckboxChange(tray.TrayId, "Recived")}
                                                                />
                                                                <label>Recived</label>
                                                                <input
                                                                    type="radio"
                                                                    value="Returned"
                                                                    checked={tray.Status === "Returned"}
                                                                    onChange={() => handleReciveCheckboxChange(tray.TrayId, "Returned")}
                                                                />
                                                                <label>Returned</label>
                                                            </td>
                                                            {tray.Status === "Returned" && (
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        name="Reason"
                                                                        value={tray.Reason || ""}
                                                                        onChange={(e) => {
                                                                            const { value } = e.target;
                                                                            setRecivedTray(prevTrays =>
                                                                                Array.isArray(prevTrays) ? prevTrays.map(t =>
                                                                                    t.TrayId === tray.TrayId ? { ...t, Reason: value } : t
                                                                                ) : []
                                                                            );
                                                                        }}
                                                                        placeholder="Enter reason..."
                                                                    />
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="Main_container_Btn">
                                            <button onClick={handleReciveSubmit}>Submit</button>
                                            <button onClick={() => { setPop4(false) }}>
                                                Close
                                            </button>
                                        </div>

                                    </div>
                                )}
                            </div>
                }


            </div>
        </>)
}

export default IndentTray;
