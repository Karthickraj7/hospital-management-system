import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';


const Outsourceratecard = () => {

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const urllink = useSelector(state => state.userRecord?.UrlLink)

    const [testname, settestname] = useState([])
    const [labname, setlabname] = useState([])
    const [Outsourceratecard, setOutsourceratecard] = useState({
        Labname : '',
        Testname : '',
        Costpertest : ''
    })

    const handlechange = (event)=>{
        const { name, value } = event.target;
        setOutsourceratecard((preve)=>({
            ...preve,
            [name] : value,
        }))
    }

    useEffect(()=>{
      axios.get(`${urllink}usercontrol/get_all_test_name_without_gender`)
      .then((response)=>{
        console.log(response);
        settestname(response.data)
      })
      .catch((error)=>{
        console.log(error);
      });
      axios.get(`${urllink}mainddepartment/get_for_outsource_lab_name`)
      .then((response)=>{
        console.log(response);
        setlabname(response.data)
      })
      .catch((error)=>{
        console.log(error);
      });
    },[])

   const handlesubmit =() =>{
    console.log(Outsourceratecard)
   }

    return (
        <div className="appointment">
             <div className="h_head">
          <h4>Outsource Ratecard </h4>
        </div>
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="Labname">
                        External Lab<span>:</span>
                    </label>
                    <input
                        type="text"
                        id="Labname"
                        name="Labname"
                        list='labnames'
                        pattern="[A-Za-z ]+"
                        title="Only letters and spaces are allowed"
                        // placeholder="Enter Test Name"
                        onChange={handlechange}
                        value={Outsourceratecard.Labname}
                       
                    />
                     <datalist id="labnames">
                          {labname?.map((item, index) => (
                            <option
                              key={index}
                              value={item}
                            >
                              {item}
                            </option>
                          ))}
                        </datalist>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Testname">
                        Test Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        id="Testname"
                        name="Testname"
                        pattern="[A-Za-z ]+"
                        list='browsers1'
                        title="Only letters and spaces are allowed"
                        // placeholder="Enter Test Name"
                        onChange={handlechange}
                        value={Outsourceratecard.Testname}
                    />
                    <datalist id="browsers1">
                          {testname?.map((item, index) => (
                            <option
                              key={index}
                              value={item}
                            >
                              {item}
                            </option>
                          ))}
                        </datalist>
                </div>
                <div className="RegisForm_1">
                    <label htmlFor="Costpertest">
                      Test Cost <span>:</span>
                    </label>
                    <input
                        type="number"
                        id="Costpertest"
                        name="Costpertest"
                        pattern="[A-Za-z ]+"
                        title="Only letters and spaces are allowed"
                        // placeholder="Enter Test Name"
                        onChange={handlechange}
                        value={Outsourceratecard.Costpertest}
                    />
                </div>
                
            </div>
            <div className='Register_btn_con'>
            <button className='RegisterForm_1_btns' onClick={handlesubmit}>
                Submit
            </button>
          </div>
        </div>
    )
}

export default Outsourceratecard