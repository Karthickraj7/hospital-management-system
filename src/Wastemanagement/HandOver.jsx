import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';


const HandOver = () => {

  const UrlLink = useSelector(state => state.userRecord?.UrlLink);


  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(currentDate.getDate()).padStart(2, '0');



  const [totalWst, settotal] = useState({})
  const [hand, sethand] = useState({
    Collector: '',
    CollectorContact: '',
    Incharge: '',
  })
  const [errors, setErrors] = useState({});


  // console.log('hand-------', Company);

  const [data, setdata] = useState({})

  const clearhandstate = () => {
    sethand({
      
      Collector: '',
      CollectorContact: '',
      Incharge: '',
    })
  }

  


  const validateForm = useCallback(() => {
    let isValid = true;
    let newErrors = {};

    // if (!hand.Category || hand.Category === "Select") {
    //   newErrors.category = "Please select a waste category.";
    //   isValid = false;
    // }
    // if (!hand.Color || hand.Color === "Select") {
    //   newErrors.color = "Please select a waste color.";
    //   isValid = false;
    // }
    // if (!hand.BagCount || hand.BagCount <= 0) {
    //   newErrors.weight = "Please enter a valid Bag Count.";
    //   isValid = false;
    // }
    // if (!hand.Weight || hand.Weight <= 0) {
    //   newErrors.weight = "Please enter a valid weight.";
    //   isValid = false;
    // }
    if (!hand.Collector.trim()) {
      newErrors.collector = "Collector name is required.";
      isValid = false;
    }
    if (!hand.CollectorContact.match(/^\d{10}$/)) {
      newErrors.collectorContact = "Enter a valid 10-digit contact number.";
      isValid = false;
    }
    if (!hand.Incharge.trim()) {
      newErrors.incharge = "Incharge name is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [hand.Collector, hand.CollectorContact,hand.Incharge])

  

  const fetchdata = useCallback(() => {

    axios.get(`${UrlLink}WasteManagement/handoverlist`)
      .then(response => { setdata(response.data) })
      .catch(error => console.error("Error fetching data:", error))

    axios.get(`${UrlLink}WasteManagement/totalWaste`)
      .then(response => { settotal(response.data) })
      .catch(error => console.error("Error fetching data:", error))

    // axios.get(`${UrlLink}WasteManagement/wastecollectingcompany`)
    //   .then(response => { setCompanyData(response.data) })
    //   .catch(error => console.error("Error fetching data:", error))

  }, [settotal, setdata, UrlLink])



  useEffect(() => {


    fetchdata()

  }, [fetchdata, UrlLink])

  useEffect(() => {
    fetchdata()
  }, [fetchdata])

  const loadhandover = (e) => {
    const { name, value } = e.target;
    sethand({ ...hand, [name]: value });
  };


  // console.log(totalWst)

  const submit = useCallback(() => {

    
    if (validateForm()) {
      axios.post(`${UrlLink}WasteManagement/handover`, { data: hand })
        .then((response) => {
          console.log(response.data)
          fetchdata()
          clearhandstate()
        })
        .catch(error => console.error("Error fetching data:", error))
    } else {
      console.log("Validation Failed", errors);
    }

  }, [UrlLink, hand, fetchdata, errors, validateForm])

  // const submitCompany = useCallback(() => {
  //   if (validateCompany()) {
  //     axios.post(`${UrlLink}WasteManagement/wastecollectingcompany`, { data: Company })
  //       .then((response) => {
  //         console.log(response.data)
  //         fetchdata()
  //         setinfo(false);
  //         // clearCompany();
  //       })
  //       .catch(error => console.error("Error fetching data:", error))
  //   } else {
  //     console.log("Validation Failed", errors);
  //   }
  // }, [UrlLink, Company, fetchdata])
  // console.log(companyData)
  return (
    <div className='Main_container_app'>
      {/* <div className="Main_container_app">
        <h3>Waste Collecting Company Info</h3>
        <div className="Main_container_app">
        {companyData.length > 0 ? companyData.map((item, index) => <div key={item.id}>
        
        
        <div className='RegisFormcon' style={{ margin: "20px" }}>
            <div className='RegisForm_1'>
              <label>Name</label><span>:</span><label>{item.companyName}</label>
            </div>
            <div className='RegisForm_1'>
              <label>Adress</label><span>:</span><label>{item.companyAddress}</label>
            </div>
            <div className='RegisForm_1'>
              <label>Phone</label><span>:</span><label>{item.companyPhone}</label>
            </div>
          </div>
          <div className='RegisFormcon' style={{ margin: "20px" }}>
            <div className='RegisForm_1'>
              <label>Price Per Kg</label><span>:</span><label>{item.pricePerKg}</label>
            </div>
            <div className='RegisForm_1'>
              <label>Adress</label><span>:</span><label>{item.contract_start}</label>
            </div>
            <div className='RegisForm_1'>
              <label>Phone</label><span>:</span><label>{item.contract_end}</label>
            </div>
          </div>
        
        </div>):<></>}
          

          <div className="Main_container_Btn" style={{ margin: '20px' }}>
            <button onClick={() => { setinfo(true); }}>
              Add
            </button></div>

        </div>
      </div> */}


      <h3>{`${day}-${month}-${year}`}-Available Waste </h3>

      <div className='Main_container_app'>
        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label>Waste Category</label>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label>Bag Count</label>{/* <span>:</span><input type='number' name='BagCount' value={Red.BagCount} onChange={RedBio} required></input> */}

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label>Weight</label>
            {/* <span>:</span><input type='number' name='Weight'  value={Red.Weight} onChange={RedBio} required></input> */}

          </div>
        </div>
        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "red", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px',  }}>Bio Red Waste</label>
          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.red ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.red.bagcount}</label>) : (<label>Loading...</label>)}

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.red ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.red.weight}Kg</label>) : (<label>Loading...</label>)}
          </div>

        </div>

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "blue", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px',  }}>Bio Blue Waste</label>
          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.blue ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.blue.bagcount}</label>) : (<label>Loading...</label>)}

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.blue ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.blue.weight}Kg</label>) : (<label>Loading...</label>)}
          </div>

        </div>

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "yellow", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px',  }}>Bio Yellow Waste</label>
          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.yellow ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.yellow.bagcount}</label>) : (<label>Loading...</label>)}

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.yellow ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.yellow.weight}Kg</label>) : (<label>Loading...</label>)}
          </div>

        </div>

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "green", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px',  }}>Genrel Waste</label>
          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.green ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.green.bagcount}</label>) : (<label>Loading...</label>)}

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.green ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.green.weight}Kg</label>) : (<label>Loading...</label>)}
          </div>

        </div>

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "black", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px',  }}>E Waste</label>
          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.black ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.black.bagcount}</label>) : (<label>Loading...</label>)}

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.black ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.black.weight}Kg</label>) : (<label>Loading...</label>)}
          </div>

        </div>

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>Total Waste</label>
          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.green ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.red.bagcount + totalWst.blue.bagcount + totalWst.yellow.bagcount + totalWst.green.bagcount + totalWst.black.bagcount}</label>) : (<label>Loading...</label>)}
          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {totalWst.green ? (<label style={{ border: "2px solid var(--ProjectColor)",borderRadius:'5px', }}>{totalWst.red.weight + totalWst.blue.weight + totalWst.yellow.weight + totalWst.green.weight + totalWst.black.weight}Kg</label>) : (<label>Loading...</label>)}
          </div>

        </div>







        <div className="Main_container_app">
          <h3>HandOver Waste</h3>


          <div className='RegisFormcon' style={{ margin: "20px" }}>
            {/* <div className='RegisForm_1'>
              <label>Waste Category</label><span>:</span>
              <select name="Category" value={hand.Category} onChange={loadhandover}>
                <option >select</option>
                <option value="Bio Waste">Bio Waste</option>
                <option value="Generel Waste">Genrel Waste</option>
                <option value="E Waste">E Waste</option>
              </select>
            </div>


            {hand.Category === "Bio Waste" ? <div className='RegisForm_1'>
              <label>Waste Color</label><span>:</span>
              <select name="Color" value={hand.Color} onChange={loadhandover}>
                <option value='' >select</option>
                <option value="Red">Red</option>
                <option value="Yellow">Yellow</option>
                <option value="Blue">Blue</option>
              </select>
            </div> :
              //  (<div className='RegisForm_1'>
              //   <label>Waste Color</label><span>:</span>
              //   <select name="Color" value={hand.Color} onChange={loadhandover}>
              //    <option value='' >select</option>
              //    <option value="Green">Green</option>
              //    <option value="Black">Black</option>
              //   </select>
              //   </div>)
              <></>
            }
            <div className='RegisForm_1'>
              <label>Bag Count</label> <span>:</span><input type='number' name='BagCount' value={hand.BagCount} onChange={loadhandover} required></input>

            </div>
            <div className='RegisForm_1'>
              <label>Waste Weight</label><span>:</span>
              <input type="number" name="Weight" value={hand.Weight} onChange={loadhandover} />

            </div> */}
            <div className='RegisForm_1'>
              <label>Waste Collecting Person</label><span>:</span>
              <input type="text" name="Collector" value={hand.Collector} onChange={loadhandover} style={{border:'2px solid var(--ProjectColor)',borderRadius:'5px', }}/>

            </div>

            <div className='RegisForm_1'>
              <label>Collecting Person Contact</label><span>:</span>
              <input type="number" name="CollectorContact" value={hand.CollectorContact} onChange={loadhandover} style={{border:'2px solid var(--ProjectColor)',borderRadius:'5px', }} />

            </div>

            <div className='RegisForm_1'>
              <label>Waste Incharge Person</label><span>:</span>
              <input type="text" name="Incharge" value={hand.Incharge} onChange={loadhandover} style={{border:'2px solid var(--ProjectColor)',borderRadius:'5px', }} />

            </div>

          </div>


          <div className='Main_container_Btn'><button type='submit' onClick={submit}>Save</button></div>


        </div>

        <div className="ReactGridWrapper">
          <table border="1" className="responsive-table-M007">
            <thead>
              <tr>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>S.No</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Date</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Waste Category</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Waste Color</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Bag Count</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Weight</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Waste Collecting Person</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Collecting Person Contact</th>
                <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Waste Incharge Person</th>

              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.date}</td>
                  <td>{item.wasteCategory}</td>
                  <td><label style={{ backgroundColor: `${item.wasteColor}`, color: "white", width: "100px", border:'2px solid var(--ProjectColor)',borderRadius:'5px', }}>{item.wasteColor}</label></td>
                  <td>{item.bagcount}</td>
                  <td>{item.weight}Kg</td>
                  <td>{item.collecter}</td>
                  <td>{item.collecterCnt}</td>

                  <td>{item.incharge}</td>
                </tr>

              )) : (<tbody><tr><td className="no-data">Data Loading...</td></tr></tbody>)}
            </tbody>
          </table>

        </div>
      </div>


      
    </div>
  )
}

export default HandOver
