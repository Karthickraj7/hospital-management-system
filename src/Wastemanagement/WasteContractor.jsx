import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';

const WasteContractor = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);

  const [add, setadd] = useState(false)
  const [edit, setedit] = useState(false)
  const [Company, setCompany] = useState({
    ComName: '',
    ComAddress: '',
    ComPhone: '',
    contStart: '',
    contEnd: '',
    Status:'',  
    priceRed: '',
    priceYellow: '',
    priceBlue: '',
    priceGenrel: '',
    priceE: '',
  })

  // const [update, setupdate] = useState({
  //   ComId:'',
  //   ComName: '',
  //   ComAddress: '',
  //   ComPhone: '',
  //   contStart: '',
  //   contEnd: '',
  //   priceRed: '',
  //   priceYellow: '',
  //   priceBlue: '',
  //   priceGenrel: '',
  //   priceE: '',
  // })



  const [errors, setErrors] = useState({});
  const [companyData, setCompanyData] = useState({})
  const clearCompany = () => {
    setCompany({
      ComId:'',
      ComName: '',
      ComAddress: '',
      ComPhone: '',
      contStart: '',
      contEnd: '',
      Status:'',
      priceRed: '',
      priceYellow: '',
      priceBlue: '',
      priceGenrel: '',
      priceE: '',
    })
    console.log(Company)
  }

  const validateCompany = useCallback(() => {
    let isValid = true;
    let newErrors = {};

    if (!Company.ComName.trim()) {
      newErrors.ComName = "Please enter the company name.";
      isValid = false;
    }
    if (!Company.ComAddress.trim()) {
      newErrors.ComAddress = "Please enter the company address.";
      isValid = false;
    }
    if (!Company.ComPhone.match(/^\d{10}$/)) {
      newErrors.ComPhone = "Please enter a valid Phone Number.";
      isValid = false;
    }
   
    if (!Company.contStart.trim()) {
      newErrors.incharge = "Please enter contract start date.";
      newErrors.contStart = "";
      isValid = false;
    }

    if (!Company.contEnd.trim()) {
      newErrors.contEnd = "Please enter contract end date.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [Company.ComName, Company.ComAddress, Company.ComPhone, Company.contStart, Company.contEnd])

  const fetchdata = useCallback(() => {
    axios.get(`${UrlLink}WasteManagement/wastecollectingcompany`)
      .then(response => { setCompanyData(response.data) })
      .catch(error => console.error("Error fetching data:", error))
  }, [setCompanyData, UrlLink])


  useEffect(() => {


    fetchdata()

  }, [fetchdata, UrlLink])


  const loadCompany = (e) => {
    const { name, value } = e.target;
    setCompany({ ...Company, [name]: value });
  };
    const chooseId = useCallback((Id) => {
      setedit(true);
      setCompany(prevCompany => ({ ...prevCompany, ComId: Id }));
  
    }, [setCompany]);


  const submitCompany = useCallback(() => {
    if (validateCompany()) {
      axios.post(`${UrlLink}WasteManagement/wastecollectingcompany`, { data: Company })
        .then((response) => {
          console.log(response.data)
          fetchdata()
          setadd(false);
          // clearCompany();
        })
        .catch(error => console.error("Error fetching data:", error))
    } else {
      console.log("Validation Failed", errors);
    }
  }, [UrlLink, Company, fetchdata, errors, validateCompany])

  const editCompany = useCallback(() => {
    if(Company.ComId){
    if (validateCompany()) {
      axios.put(`${UrlLink}WasteManagement/wastecollectingcompany`, { data: Company })
        .then((response) => {
          console.log(response.data)
          fetchdata()
          setedit(false);
          // clearCompany();
        })
        .catch(error => console.error("Error fetching data:", error))
    } else {
      console.log("Validation Failed", errors);
    }}
  }, [UrlLink, Company, fetchdata, errors, validateCompany])


// console.log(add,edit)
// console.log(Company)
  return (
    <div className="Main_container_app" >
      <h3>Waste Collecting Companys</h3>
      <div className="Main_container_app">
        <div className="Main_container_Btn" style={{ margin: '20px' }}>
          <button onClick={() => { setadd(true); }}>
            Add
          </button>
        
        </div>
        {companyData.length > 0 ? companyData.map((item, index) => <div key={item.id}>

          <h3>Company Info</h3>
          <div className='RegisFormcon' style={{ margin: "20px" }}>
            <div className='RegisForm_1'>
              <label  >Company Name</label><span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>{item.companyName}</label>
            </div>
            <div className='RegisForm_1'>
              <label>Company Adress</label><span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>{item.companyAddress}</label>
            </div>
            <div className='RegisForm_1'>
              <label>Company Phone</label><span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>{item.companyPhone}</label>
            </div>
          </div>
          <div className='RegisFormcon' style={{ margin: "20px" }}>
            <div className='RegisForm_1'>
              <label>Contract Start</label><span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>{item.contract_start}</label>
            </div>
            <div className='RegisForm_1'>
              <label>Contract End</label><span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>{item.contract_end}</label>
            </div>
            <div className='RegisForm_1'>
              <label>Status</label><span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>{item.status ? "Active" : "Inactive"}</label>
            </div>
          </div>
          <h3>Price Details</h3>
          <div className="RegisterTypecon" style={{ margin: '10px' }}>
            <div className='RegisForm_1' style={{ margin: '10px' }}>
              <label>Bio Waste Red</label> <span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>₹{item.bioRed}</label>
            </div>
            <div className='RegisForm_1' style={{ margin: '10px' }}>
              <label>Bio Waste Yellow</label> <span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>₹{item.bioYellow}</label>
            </div>
            <div className='RegisForm_1' style={{ margin: '10px' }}>
              <label>Bio Waste Blue</label> <span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>₹{item.bioBlue}</label>
            </div>
          </div>
          <div className="RegisterTypecon" style={{ margin: '10px' }}>
            <div className='RegisForm_1' style={{ margin: '10px' }}>
              <label>Genrel Waste</label> <span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>₹{item.genrel}</label>
            </div>
            <div className='RegisForm_1' style={{ margin: '10px' }}>
              <label>E Waste</label> <span>:</span><label style={{ border:'2px solid var(--ProjectColor)',borderRadius:'5px',}}>₹{item.EWst}</label>
            </div>
          </div>

          <div className="Main_container_Btn" style={{ margin: '20px' }}>
          <button onClick={()=>{chooseId(item.companyId)}} >
            Edit
          </button>
        </div>
        </div>) : <></>}


        

      </div>

      {add || edit ? <div className="Main_container_app"
        style={{
          position: "absolute",
          backgroundColor: 'white',
          width: 'Fit-Content',
          height: 'Fit-Content',
          margin: 'auto',
          marginTop: '10%',
          border: '1px solid black'
        }}>
        <h3>Company Info</h3>


        <div className="RegisterTypecon" style={{ margin: '10px' }}>
          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>Company Name</label> <span>:</span><input type='text' name='ComName' value={Company.ComName} onChange={loadCompany} required></input>
          </div>

          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>Company Address</label> <span>:</span><input type='text' name='ComAddress' value={Company.ComAddress} onChange={loadCompany} required></input>
          </div>

          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>Company Phone</label> <span>:</span><input type='number' name='ComPhone' value={Company.ComPhone} onChange={loadCompany} required></input>
          </div>
        </div>


        {/* <div className="RegisterTypecon" style={{ margin: '10px' }}>
          

          <div className='RegisForm_1' style={{ margin: '20px' }}>
            <label>Price Per Kg</label> <span>:</span><input type='number' name='price' value={Company.price} onChange={loadCompany} required></input>
          </div>
        </div> */}

        <div className="RegisterTypecon" style={{ margin: '10px' }}>
          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>Contract Start</label> <span>:</span><input type='date' name='contStart' value={Company.contStart} onChange={loadCompany} required></input>
          </div>
          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>Contract End</label> <span>:</span><input type='date' name='contEnd' value={Company.contEnd} onChange={loadCompany} required></input>
          </div>
          <div className="RegisForm_1" style={{ marginLeft: '10px' }}>
              <label>
                Status <span>:</span>
              </label>
              <input type="radio" name="Status" value={true} onClick={loadCompany} checked={Company.Status === "true"} />
              <label>Active</label>
              <input type="radio" name="Status" value={false} onClick={loadCompany} checked={Company.Status === "false"} />
              <label>Inactive</label>
            </div>
        </div>
        <h3>Price Details</h3>
        <div className="RegisterTypecon" style={{ margin: '10px' }}>
          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>Bio Waste Red</label> <span>:</span><input type='number' name='priceRed' value={Company.priceRed} onChange={loadCompany} placeholder="Price Per Kg" required></input>
          </div>
          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>Bio Waste Yellow</label> <span>:</span><input type='number' name='priceYellow' value={Company.priceYellow} onChange={loadCompany} placeholder="Price Per Kg" required></input>
          </div>
          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>Bio Waste Blue</label> <span>:</span><input type='number' name='priceBlue' value={Company.priceBlue} onChange={loadCompany} placeholder="Price Per Kg" required></input>
          </div>
        </div>
        <div className="RegisterTypecon" style={{ margin: '10px' }}>
          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>Genrel Waste</label> <span>:</span><input type='number' name='priceGenrel' value={Company.priceGenrel} onChange={loadCompany} placeholder="Price Per Kg" required></input>
          </div>
          <div className='RegisForm_1' style={{ margin: '10px' }}>
            <label>E Waste</label> <span>:</span><input type='number' name='priceE' value={Company.priceE} onChange={loadCompany} placeholder="Price Per Kg" required></input>
          </div>
        </div>



        <div className="Main_container_Btn" style={{ margin: '10px' }}>
        {add ? <button onClick={() => { submitCompany(); clearCompany() }}>Save</button>
            : <button onClick={() => { editCompany(); clearCompany() }}>Update</button>}

          <button onClick={() => { setedit(false); setadd(false); clearCompany(); }}>Close</button>
        </div>
      </div>
        : <></>}

    </div>
  )
}

export default WasteContractor
