import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import EditIcon from "@mui/icons-material/Edit";

const TrayCreation = () => {

  const [create, setCreate] = useState("")
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);

  const [trayData, setTrayData] = useState([])
  const [sterilizeData, setSterilizeData] = useState([])

  const [edit, setedit] = useState(false)



  const [tray, setTray] = useState({
    create: 'Tray',
    trayName: '',
    sterilize: [],
    Status: null
  })
  const [sterilize, setsterilize] = useState({
    create: 'Sterilize',
    sterilizeName: '',
    Status: null
  })
  const [update, setupdate] = useState({
    create: '',
    Id: '',
    Name: '',
    sterilize: [],
    Status: null
  })

  const [Pcategory, setPcategory] = useState([])
  const [Scategory, setScategory] = useState([])
  const [prolist, setprolist] = useState([])
  const [trayprd, settrayprd] = useState([])

  const [category, setcategory] = useState("")
  const [subcategory, setsubcategory] = useState("")
  const [product, setproduct] = useState('')
  const [Ptray, setPtray] = useState("")
  const [Pcount, setPcount] = useState("")

  const clearProduct = () => {
    setsubcategory('')
    setPtray('')
    setproduct('')
    setcategory('')
  }

  const clearTray = () => {
    setTray({
      create: 'Tray',
      sterilize: [],
      trayName: '',
      Status: null
    })
  }

  const clearSerilize = () => {
    setsterilize({
      create: 'Sterilize',
      sterilizeName: '',
      Status: null
    })
  }

  const clearUpdate = () => {
    setupdate({
      create: '',
      Id: '',
      Name: '',
      sterilize: [],
      Status: null
    })
  }


  const loadTray = (e) => {
    const { name, value } = e.target;
    setTray({ ...tray, [name]: value });
  }

  const loadSterilize = (e) => {
    const { name, value } = e.target;
    setsterilize({ ...sterilize, [name]: value });
  }

  const loadUpdate = (e) => {
    const { name, value } = e.target;
    setupdate({ ...update, [name]: value });
  }

  const chooseTray = useCallback((Id) => {
    setedit(true);
    setupdate(prevUpdate => ({ ...prevUpdate, create: "Tray" }));
    setupdate(prevUpdate => ({ ...prevUpdate, Id: Id }));

    console.log(update);
  }, [update]);

  const chooseSterilize = useCallback((Id) => {
    setedit(true);
    setupdate(prevUpdate => ({ ...prevUpdate, create: "Sterilize" }));
    setupdate(prevUpdate => ({ ...prevUpdate, Id: Id }));

    console.log(update);
  }, [update]);

  const getTableData = useCallback(() => {
    axios.get(`${UrlLink}cssd/create_tray_sterilize`)
      .then(response => {
        // console.log(response.data)
        if (response.data.sterilize) {
          setSterilizeData(response.data.sterilize)
        }
        if (response.data.tray) {
          setTrayData(response.data.tray)
        }
      })
      .catch(error => console.error("Error fetching data:", error))

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

    axios.get(`${UrlLink}cssd/selectproduct`)
      .then(response => {
        // console.log(response.data)
        settrayprd(response.data)
      })
      .catch(error => console.error("Error fetching data:", error))




  }, [UrlLink, setTrayData, setSterilizeData, setPcategory, category])


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
  }, [getTableData, getproduct])

  const submitTray = useCallback(() => {
    if (tray.trayName !== '' && tray.Status !== null) {

      axios.post(`${UrlLink}cssd/create_tray_sterilize`, { data: tray })
        .then((response) => {
          console.log(response.data)
          console.log(tray)
          clearTray()
          getTableData()
        })
        .catch(error => console.error("Error fetching data:", error))

    } else {
      alert('Please All Enter Data...')
    }
  }, [UrlLink, tray, getTableData])

  const submitSterilize = useCallback(() => {
    if (sterilize.sterilizeName !== '' && sterilize.Status !== null) {
      axios.post(`${UrlLink}cssd/create_tray_sterilize`, { data: sterilize })
        .then((response) => {
          console.log(response.data)
          console.log(sterilize)
          clearSerilize()
          getTableData()
        })
        .catch(error => console.error("Error fetching data:", error))
    } else {
      alert('Please All Enter Data...')
    }
  }, [UrlLink, sterilize, getTableData])


  const submitUpdate = useCallback(() => {
    if (update.Name !== '' && update.Status !== null) {
      axios.put(`${UrlLink}cssd/create_tray_sterilize`, { data: update })
        .then((response) => {
          console.log(response.data)
          console.log(update)
          clearUpdate()
          getTableData()
          setedit(false)
        })
        .catch(error => console.error("Error fetching data:", error))
    } else {
      alert('Please All Enter Data...')
    }
  }, [UrlLink, update, getTableData])


  const submitproduct = useCallback(() => {
    if (Ptray !== "" && product !== "") {
      const data = {
        Ptray,
        category,
        subcategory,
        product,
        Pcount,
      }

      axios.post(`${UrlLink}cssd/selectproduct`, { data: data })
        .then(response => {
          console.log(response.data)
          clearProduct()
        })
        .catch(error => console.error("Error fetching data:", error))
    } else {
      console.log("Enter All Data...")
    }
  }, [UrlLink, Ptray, category, subcategory, product, Pcount])


  // console.log('Update----------',update)
  // console.log('category------', Pcategory)

  // console.log(category, subcategory, prolist)
  // console.log("Product-------", Ptray, category, subcategory, product)
  return (

    <div className="Main_container_app">
      <h3>Central Sterile Services Department</h3>

      <div className="RegisterTypecon" style={{ margin: '20px',width:"100%", }}>
        <div className="RegisterTypecon navchange">

          <div className="registertypeval">
            <input type="radio" name="create" value="Sterilizing" onChange={(e) => { setCreate(e.target.value) }} checked={create === 'Sterilizing'} />
            <label>
              STERILIZATION MASTER
            </label>
          </div>

          <div className="registertypeval" style={{ marginLeft: "30px", }}>
            <input type="radio" name="create" value="Tray" onChange={(e) => { setCreate(e.target.value) }} checked={create === 'Tray'} />
            <label>
              CSSD TRAY
            </label>
          </div>

          <div className="registertypeval" style={{ marginLeft: "30px", }}>
            <input type="radio" name="create" value="Assign Products" onChange={(e) => { setCreate(e.target.value) }} checked={create === 'Assign Products'} />
            <label>
              TRAY VS PRODUCTS MASTER
            </label>
          </div>

        </div>
      </div>

      {create === "Tray" ? <div className="Tray">
        <h3>Tray Creations</h3>
        <div className="RegisterTypecon" style={{ margin: '20px' }}>
          <div className="RegisForm_1">
            <label>
              Tray Name <span>:</span>{" "}
            </label>
            <input type="text" name="trayName" value={tray.trayName} onChange={loadTray} />
          </div>

          <div className="RegisForm_1" style={{ marginLeft: '20px', width: 'Fit-Content' }}>
            <label>
              Sterilizing Method <span>:</span>{" "}
            </label>
            <div>

              {sterilizeData.length > 0 ? (
                sterilizeData.map((item) => (
                  <div key={item.Id} style={{ display: 'flex' }}>
                    <input
                      type="checkbox"
                      id={item.Id}
                      value={item.SterilizeId}
                      checked={tray.sterilize.includes(item.SterilizeId)}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setTray((prevUpdate) => ({
                          ...prevUpdate,
                          sterilize: prevUpdate.sterilize.includes(value)
                            ? prevUpdate.sterilize.filter((name) => name !== value)
                            : [...prevUpdate.sterilize, value],
                        }));
                      }}
                      style={{ width: '15px', height: '15px' }}
                    />
                    <label style={{ marginLeft: '10px', width: 'Fit-Content' }}>{item.SterilizeName}</label>
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>

          </div>

          <div className="RegisForm_1" style={{ marginLeft: '20px' }}>
            <label>
              Status <span>:</span>{" "}
            </label>
            <input type="radio" name="Status" value={true} onChange={loadTray} checked={tray.Status === "true"} />
            <label>Active</label>
            <input type="radio" name="Status" value={false} onChange={loadTray} checked={tray.Status === "false"} />
            <label>Inactive</label>
          </div>
        </div>

        <div className="Main_container_Btn">
          <button onClick={submitTray}>Save</button>
          <button onClick={clearTray}>Close</button>
        </div>

        <div className="ReactGridWrapper" style={{ marginTop: '20px', }}>
          <table border="1" className="responsive-table-M007">
            <thead>
              <tr>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>S.No</th>
                {/* <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Date</th> */}
                {/* <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Tray Id</th> */}
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Tray Name</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Sterilize Methods</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Tray Status</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {trayData.length > 0 ? trayData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {/* <td>{item.createdDate}</td>
                  <td>{item.trayId}</td> */}
                  <td>{item.trayName}</td>
                  <td>{item.sterilizeMethod}</td>
                  <td>{item.Status ? "Active" : "Inactive"}</td>
                  {/* <input type="hidden" name="Id" value={item.trayId} onChange={loadUpdate} /> */}

                  <td>
                    <div className="actions-button">
                      < EditIcon className="edit-icon" onClick={() => { chooseTray(item.trayId) }} />
                    </div>
                  </td>
                </tr>

              )) : (<tbody><tr><td className="no-data">Data Loading...</td></tr></tbody>)}
            </tbody>
          </table>

        </div>

      </div> : create === "Sterilizing" ? <div className="Sterilizing">
        <h3>Sterilizing Method Creation</h3>
        <div className="RegisterTypecon" style={{ margin: '20px' }}>
          <div className="RegisForm_1">
            <label>
              Sterilizing Methods<span>:</span>{" "}
            </label>
            <input type="text" name="sterilizeName" value={sterilize.sterilizeName} onChange={loadSterilize} />
          </div>
          <div className="RegisForm_1" style={{ marginLeft: '20px' }}>
            <label>
              Status <span>:</span>{" "}
            </label>
            <input type="radio" name="Status" value={true} onChange={loadSterilize} checked={sterilize.Status === "true"} />
            <label>Active</label>
            <input type="radio" name="Status" value={false} onChange={loadSterilize} checked={sterilize.Status === "false"} />
            <label>Inactive</label>
          </div>
        </div>

        <div className="Main_container_Btn">
          <button onClick={submitSterilize}>Save</button>
        </div>

        <div className="ReactGridWrapper" style={{ marginTop: '20px' }}>
          <table border="1" className="responsive-table-M007">
            <thead>
              <tr>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>S.No</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Date</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Sterilize Method Id</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Sterilize Method Name</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Sterilize Method Status</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Action</th>

              </tr>
            </thead>
            <tbody>
              {sterilizeData.length > 0 ? sterilizeData.map((item, index) => (
                <>
                <tr key={item.SterilizeId || index}>
                  <td>{index + 1}</td>
                  <td>{item.createdDate}</td>
                  <td>{item.SterilizeId}</td>
                  <td>{item.SterilizeName}</td>
                  <td>{item.Status ? "Active" : "Inactive"}</td>

                  <td>
                    <div className="actions-button">
                      < EditIcon className="edit-icon" onClick={() => { chooseSterilize(item.trayId) }} />
                    </div>
                  </td>
                </tr>
                </>

              )) : (<tbody><tr><td className="no-data">Data Loading...</td></tr></tbody>)}
            </tbody>
          </table>

        </div>

      </div>
        : <div className="products">
          <h3>Add Products</h3>

          <div className="RegisterTypecon">
            <div className="RegisForm_1">
              <label>
                Tray<span>:</span>{" "}
              </label>
              <select name="Ptray" value={Ptray} onChange={(e) => { setPtray(e.target.value) }} >
                <option value="">Select</option>
                {trayData.length > 0 ? trayData.map((item, index) => (
                  <option key={index} value={item.trayId}>{item.trayName}</option>
                )) : <option> Data Loading</option>}
              </select>
            </div>
          </div>
          <div className="RegisterTypecon" style={{ margin: '20px' }}>

            <div className="RegisForm_1" style={{ margin: '20px' }}>
              <label>
                Product Category<span>:</span>{" "}
              </label>
              <select name="category" value={category} onChange={(e) => { setcategory(e.target.value) }} >
                <option value="">Select</option>
                {Pcategory.length > 0 ? Pcategory.map((item, index) => (
                  <option key={index} value={item.id}>{item.ProductCategory_Name}</option>
                )) : <option> Data Loading</option>}
              </select>
            </div>

            <div className="RegisForm_1" style={{ margin: '20px' }}>
              <label>
                SubCategory<span>:</span>{" "}
              </label>
              <select name="subcategory" value={subcategory} onChange={(e) => { setsubcategory(e.target.value); getproduct(); }} >
                <option value="">Select</option>
                {Scategory.length > 0 ? Scategory.map((item, index) => (
                  <option key={index} value={item.SubCategory_Id}>{item.SubCategoryName}</option>
                )) : <option> Data Loading</option>}
              </select>
            </div>

            <div className="RegisForm_1" style={{ margin: '20px' }}>
              <label>
                Product<span>:</span>{" "}
              </label>
              <select name="product" value={product} onChange={(e) => { setproduct(e.target.value) }} >
                <option value="">Select</option>
                {prolist.length > 0 ? prolist.map((item, index) => (
                  <option key={index} value={item.id}>{item.ItemName}</option>
                )) : <option> Products Not Availbale</option>}
              </select>

            </div>
          </div>
          <div className="RegisterTypecon">
            <div className="RegisForm_1">
              <label>
                Product Count<span>:</span>{" "}
              </label>
              <input type="number" name="count" onChange={(e) => { setPcount(e.target.value) }} />
            </div>
          </div>
          <div className="Main_container_Btn">
            <button onClick={submitproduct}>Save</button>
            <button onClick={clearProduct}>Clear</button>
          </div>

          <div className="ReactGridWrapper" style={{ marginTop: '20px' }}>
            <table border="1" className="responsive-table-M007">
              <thead>
                <tr>
                  <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Id</th>
                  <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Tray Name</th>
                  <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Products</th>
                  <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Product Count</th>
                  <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Tray Status</th>

                </tr>
              </thead>
              <tbody>
                {trayprd.length > 0 ? trayprd.map((item, index) => (
                  <tr key={index}>
                    <td>{item.trayId}</td>
                    <td>{item.trayName}</td>
                    <td>{item.productName}</td>
                    <td>{item.productCount}</td>

                    {/* <td>{item.productId.length > 0 ? item.productId.map((i) => i.ItemName).join(", ") : ""}</td> */}
                    <td>{item.Status ? "Active" : "Inactive"}</td>
                  </tr>

                )) : (<tbody><tr><td className="no-data">Data Loading...</td></tr></tbody>)}
              </tbody>
            </table>

          </div>

        </div>}

      {edit ? <div className="Main_container_app"
        style={{
          position: "absolute",
          backgroundColor: 'white',
          width: '500px',
          height: 'Fit-Content',
          margin: 'auto',
          marginTop: '10%',
          border: '1px solid black'
        }}>
        <h3>Update</h3>
        <div className="RegisterTypecon" style={{ margin: '30px' }}>
          <div className="RegisForm_1">
            <label>
              Update Name<span>:</span>{" "}
            </label>
            <input type="text" name="Name" value={update.Name} onChange={loadUpdate} />
          </div>
        </div>

        {update.create === "Tray" ?
          <div className="RegisterTypecon" style={{ margin: '30px' }}>
            <div className="RegisForm_1" style={{ marginLeft: '20px' }}>
              <label>
                Sterilizing Method <span>:</span>{" "}
              </label>
              <div>
                {sterilizeData.length > 0 ? (
                  sterilizeData.map((item) => (
                    <div key={item.Id} style={{ display: 'flex' }}>
                      <input
                        type="checkbox"
                        id={item.Id}
                        value={item.SterilizeId}
                        // checked={tray.sterilize.includes(item.SterilizeId)}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setupdate((prevUpdate) => ({
                            ...prevUpdate,
                            sterilize: prevUpdate.sterilize.includes(value)
                              ? prevUpdate.sterilize.filter((name) => name !== value)
                              : [...prevUpdate.sterilize, value],
                          }));
                        }}
                        style={{ width: '15px', height: '15px' }}
                      />
                      <label style={{ marginLeft: '10px', width: 'Fit-Content' }}>{item.SterilizeName}</label>
                    </div>
                  ))
                ) : (
                  <p>Loading...</p>
                )}</div>
            </div>
          </div> : <></>}


        <div className="RegisterTypecon" style={{ margin: '30px' }}>
          <div className="RegisForm_1" style={{ marginLeft: '30px' }}>
            <label>
              Status <span>:</span>{" "}
            </label>
            <input type="radio" name="Status" value={true} onChange={loadUpdate} checked={update.Status === "true"} />
            <label>Active</label>
            <input type="radio" name="Status" value={false} onChange={loadUpdate} checked={update.Status === "false"} />
            <label>Inactive</label>
          </div>



        </div>

        <div className="Main_container_Btn" style={{ margin: '20px' }}>
          <button onClick={submitUpdate}>Save</button> <button onClick={() => { setedit(false); clearUpdate(); }}>Cancel</button>
        </div>
      </div> : <></>}

    </div>
  )
}

export default TrayCreation
