import React, { useState, useEffect } from 'react';
import Axios from 'axios';
// import './ClinicDetails.css';
import { ToastContainer, toast } from "react-toastify";
import './organizationold.css'
import { useSelector } from 'react-redux';
const Organization = () => {
    // console.log(userRecord)
    const urllink=useSelector(state=>state.userRecord?.UrlLink)

    const [concernName, setConcernName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [landline, setLandline] = useState('');
    const [gstno, setGstno] = useState('');
    const [doorNo, setDoorNo] = useState('');
    const [street, setStreet] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');

    const successMsg = (msg) => {
        toast.success(`${msg}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: { marginTop: "50px" },
        });
      };
    
      const errmsg = (errorMessage) => {
        toast.error(`${errorMessage}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: { marginTop: "50px" },
        });
      }
    

    useEffect(() => {
        // Make the POST request to fetch clinic details
        Axios.get(`${urllink}usercontrol/getoraganization`)
        .then(response => {
          const record = response.data[0]; // Access the first (and only) object in the array
          console.log(record);
          setConcernName(record.Organization);
          setEmail(record.Email);
          setPhoneNo(record.Phone_no);
          setLandline(record.Land_line);
          setGstno(record.Gst_No)
          setDoorNo(record.Door_no);
          setStreet(record.Street);
          setArea(record.Area);
          setCity(record.City);
          setPincode(record.Pincode);
          setState(record.State);
          setCountry(record.Country);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      
    }, );

    const handlesave = () => {
        // Create an object with the data to send to the backend
        const data = {
            concernName:concernName,
            email:email,
            phoneNo:phoneNo,
            landline_no:landline,
            Gst_no:gstno,
            doorNo:doorNo,
            street:street,
            area:area,
            city:city,
            pincode:pincode,
            state:state,
            country:country,
            // location: userRecord.location
        };

        // Send a POST request to your backend endpoint
       console.log(data)
       Axios.post(`${urllink}usercontrol/insertoraganization`,data)
       .then((response)=>{
        console.log(response)
        successMsg(response.data.message)
       })
       .catch((error)=>{
        console.log('error :',error)
       })
       
    };


    return (
        <>
            <div className="Clinic_det_new ">
                <div className="clinic_head">
                    <h3> Organization Details</h3>
                </div>
                <div className="bill_table_invoice ">
                    <div className="new_user_items">
                        <div className="new_clinic_form">
                            <div className="new_form_pack">
                                <label className="new_form_first new_first_1" htmlFor="concernName">Organization :</label>
                                <input
                                    type="text"
                                    id="concernName"
                                    name="concernName"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your Oraganization name"
                                    value={concernName}
                                    onChange={(e) => setConcernName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="new_clinic_form">
                            <div className="new_form_pack">
                                <label className="new_form_first" htmlFor="email">Email:</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="new_form_pack">
                                <label className="new_form_first" htmlFor="phoneNo">Phone no:</label>
                                <input
                                    type="text"
                                    id="phoneNo"
                                    name="phoneNo"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your Phone No"
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="new_clinic_form">
                            <div className="new_form_pack">
                                <label className="new_form_first" htmlFor="email">Landline No:</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your Landline No"
                                    value={landline}
                                    onChange={(e) => setLandline(e.target.value)}
                                />
                            </div>
                            <div className="new_form_pack">
                                <label className="new_form_first" htmlFor="phoneNo">GST No:</label>
                                <input
                                    type="text"
                                    id="phoneNo"
                                    name="phoneNo"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your GST No"
                                    value={gstno}
                                    onChange={(e) => setGstno(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="new_clinic_form">
                            <div className="new_form_pack">
                                <label className="new_form_first" htmlFor="doorNo">Door No:</label>
                                <input
                                    type="text"
                                    id="doorNo"
                                    name="doorNo"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your Door No"
                                    value={doorNo}
                                    onChange={(e) => setDoorNo(e.target.value)}
                                />
                            </div>
                            <div className="new_form_pack">
                                <label className="new_form_first" htmlFor="street">Street:</label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your first name"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                />
                            </div>
                           
                        </div>
                        <div className="new_clinic_form">
                        <div className="new_form_pack">
                                <label className="new_form_first" htmlFor="area">Area:</label>
                                <input
                                    type="text"
                                    id="area"
                                    name="area"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your Area"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                />
                            </div>
                            <div className="new_form_pack">
                                <label className="new_form_first" htmlFor="city">City:</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="new_packlog">
                                <label className="new_form_first" htmlFor="pincode">PinCode:</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your PinCode"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="new_clinic_form">
                            <div className="new_form_pack">
                                <label className="new_form_first" htmlFor="state">State:</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>

                            <div className="new_packlog">
                                <label className="new_form_first" htmlFor="country">Country:</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    className="new_clinic_form_inp"
                                    placeholder="Enter your Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </div>

                        </div>
                        <button className="new_btn1_1" onClick={handlesave} >
                            Save
                        </button>
                    </div>
                </div>
             
            </div>
            <ToastContainer />
        </>
    )
}

export default Organization;
