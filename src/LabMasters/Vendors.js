import React, { useEffect, useState } from "react";
import axios from "axios";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import './SupplierMaster.css'
import { Form, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";

function SupplierMaster({ selectedSupplierIndex, setSelectedSupplierIndex}) {


  const successMsg = (message) => {
    toast.success(`${message}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      containerId: 'toast-container-over-header',
      style: { marginTop: '50px' },
    });
  };
  const userwarn = (warningMessage) => {
    toast.warn(`${warningMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: '50px' },
    });
  };
  const errmsg = (errormsg) => {
    toast.error(`${errormsg}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: '50px' },
    });
  };

  const urllink=useSelector(state=>state.userRecord?.UrlLink)



  const navigate = useNavigate();
  const [type, setType] = useState("CommunicationAddressCon");
  const [isInactive, setIsInactive] = useState(false);
  const [formDataSupplier, setFormDataSupplier] = useState({
    SupplierCode: "", // Initialize with an empty string
    SupplierName: "",
    SupplierGST: "",
    SupplierType: "",
    // createdby: userRecord.username,
    Status: "Active",
    country: "",
    state: "",
    city: "",
    place: "",
    street: "",
    email: "",
    phoneno: "",
    alternate_no: "",
    BankName: "",
    BranchName: "",
    AccountNo: "",
    IfscCode: "",
    PancardNo: "",
    ShortName: '',
    Website: '',
    Remarks: '',
    ConcernForm: '',
    Payment_Due_Days:''
  });

  console.log('formDataSupplier :',formDataSupplier)
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  useEffect(() => {
   
      axios
        .get(`${urllink}usercontrol/getsuppliercode`)
        .then((response) => {
          // Handle the successful response here
          console.log(response.data.nextSupplierCode);
          setFormDataSupplier((prevData) => ({
            ...prevData,
            SupplierCode: response.data.nextSupplierCode,
          }));
        })
        .catch((error) => {
          // Handle errors here
          console.error("Error fetching data:", error);
        });
    
  }, [selectedSupplierIndex]);

  console.log('gg', formDataSupplier)
  const handleToggleChange = (event) => {
    const newValue = event.target.value
    setType(newValue);
  };
  const handleInactiveChange = () => {
    setIsInactive(!isInactive);
    setFormDataSupplier(prevData => ({
      ...prevData,
      Status: !isInactive ? "Inactive" : "Active"
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'phoneno' || name === 'alternate_no') {
      const newval = value.length;
      if (newval <= 10) {
        setFormDataSupplier((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      } else {
        userwarn('Mobile No must contain 10 digits');
      }
    } else {
      setFormDataSupplier((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };





  const handleSaveOrUpdate = () => {
  
    // console.log(newData)
    const requiredFields = [
      "SupplierCode",
      "SupplierName",
      "SupplierGST",
      "SupplierType",
      "country",
      "state",
      "city",
      "place",
      "street",
      "email",
      "phoneno"
    ];

    const missingFields = requiredFields.filter((field) => !formDataSupplier[field]);

    if (missingFields.length === 0) {
       
      const newData = new FormData();
      console.log('123',formDataSupplier)
      Object.keys(formDataSupplier).forEach((key) => {
        newData.append(key, formDataSupplier[key]);
      });

        axios.post(`${urllink}usercontrol/insertsupplierdata`, newData,{
          headers: {
          "Content-Type": 'multipart/form-data'
        }
        })
          .then((response) => {
            console.log(response.data);
            clearFormInputs();
            // navigate('/Home/Supplier_List');
          })
          .catch((error) => {
            console.error('Error posting Supplier data:', error);
          });
      }

     else {
      userwarn(`Please fill out all required fields: ${missingFields.join(', ')}`);
    }

  };



  const clearFormInputs = () => {


    setFormDataSupplier({
      SupplierCode: "",
      SupplierName: "",
      SupplierGST: "",
      SupplierType: "",
      createdby: "admin",
      Status: "Active",
      country: "",
      state: "",
      city: "",
      place: "",
      street: "",
      email: "",
      phoneno: "",
      alternate_no: "",
      BankName: "",
      BranchName: "",
      AccountNo: "",
      IfscCode: "",
      PancardNo: "",
      ShortName: '',
      Website: '',
      Remarks: '',
      ConcernForm: null,
      Payment_Due_Days:''

    });

  };

  return (
    <div className="Supplier_Master_form_Container">
      <div className="Supplier_Master_form_Container_Header">
        <h3>Supplier Master</h3>
      </div>
      <div className="Supplier_Master_form_Con_1">

        <div className="Supplier_Master_form_Con_Row">
          <div className="Supplier_Master_form_Con_div_Row">
            <label htmlFor="supliercode" className="Supplier_Master_form_Con_div_Row_label">
              Supplier Code:
            </label>
            <input
              type="text"
              name="SupplierCode"
              placeholder="Enter supplier code"
              value={formDataSupplier.SupplierCode}
              required
              readOnly
              className='Supplier_Master_form_Con_div_Row_input'
            />
          </div>
          <div className="Supplier_Master_form_Con_div_Row">
            <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="Supplier">
              Supplier Name:
            </label>
            <input
              type="text"
              name="SupplierName"
              placeholder="Enter Supplier Name"
              value={formDataSupplier.SupplierName}
              onChange={handleInputChange}
              required
              className='Supplier_Master_form_Con_div_Row_input'

            />
          </div>
          <div className="Supplier_Master_form_Con_div_Row">
            <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="Supplier">
              Supplier GST Number:
            </label>
            <input
              type="text"
              name="SupplierGST"
              placeholder="Enter Supplier GST Number"
              value={formDataSupplier.SupplierGST}
              onChange={handleInputChange}
              required
              className='Supplier_Master_form_Con_div_Row_input'

            />
          </div>
          <div className="Supplier_Master_form_Con_div_Row">
            <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="Supplier">
              Supplier Type:
            </label>
            {/* <input
              type="text"
              name="SupplierType"
              placeholder="Enter Supplier Name"
              value={formDataSupplier.SupplierType}
              onChange={handleInputChange}
              readOnly={selectedSupplierIndex}
              required
              className='Supplier_Master_form_Con_div_Row_input'

            /> */}
            <select
              name="SupplierType"
              value={formDataSupplier.SupplierType}
              onChange={handleInputChange}

              required
              style={{ padding: '0px 10px', height: '25px' }}
              className='Supplier_Master_form_Con_div_Row_input'
            >
              <option value=''> select Type</option>
              <option value='Medical'>Medical</option>
              <option value='Non_Medical'>Non Medical</option>
              <option value='Assets'>Assets</option>
              <option value='Stationary'>Stationary</option>
              <option value='Non_Stationary'>Non Stationary</option>
            </select>
          </div>

        </div>

      </div>
      <div className="Supplier_Master_form_sub_con">
        <div className="Supplier_Master_form_sub_con_div">
          <div className="Supplier_Master_form_sub_con_div_1">
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={handleToggleChange}
              aria-label="Platform"
            >
              <ToggleButton
                value="CommunicationAddressCon" // Set the value prop here
                style={{
                  backgroundColor:
                    type === "CommunicationAddressCon" ? "var(--ProjectColor)" : "inherit",
                }}
                className="Supplier_Master_form_sub_con_div_1_toggle"
              >
                Communication Address
              </ToggleButton>
              <ToggleButton
                value="FactoryAddressCon" // Set the value prop here
                style={{
                  backgroundColor:
                    type === "FactoryAddressCon" ? "var(--ProjectColor)" : "inherit",
                }}
                className="Supplier_Master_form_sub_con_div_1_toggle"
              >
                Account Details
              </ToggleButton>
            </ToggleButtonGroup>

            {type === "CommunicationAddressCon" ?

              <div className="Supplier_Master_form_sub_con_div_1">
                <div className="Supplier_Master_form_Con_Row">
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="country">
                      Country:
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Enter country"
                      value={formDataSupplier.country}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="state">
                      State:
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      value={formDataSupplier.state}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                </div>
                <div className="Supplier_Master_form_Con_Row">
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="city">
                      City:
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={formDataSupplier.city}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="place">
                      Place:
                    </label>
                    <input
                      type="text"
                      name="place"
                      placeholder="Enter place"
                      value={formDataSupplier.place}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                </div>
                <div className="Supplier_Master_form_Con_Row">
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="street">
                      Street:
                    </label>
                    <input
                      type="text"
                      name="street"
                      placeholder="Enter street"
                      value={formDataSupplier.street}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="email">
                      Email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formDataSupplier.email}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                </div>
                <div className="Supplier_Master_form_Con_Row">
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="phone1">
                      Phone No:
                    </label>
                    <input
                      type="number"
                      name="phoneno"
                      placeholder="Enter Phone No"
                      value={formDataSupplier.phoneno}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="phone2">
                      Alternate Phone No:
                    </label>
                    <input
                      type="number"
                      name="alternate_no"
                      placeholder="Enter Alternate Phone No"
                      value={formDataSupplier.alternate_no}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                </div>

              </div>
              :
              <div className="Supplier_Master_form_sub_con_div_1">
                <div className="Supplier_Master_form_Con_Row">
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="country">
                      Bank Name :
                    </label>
                    <input
                      type="text"
                      name="BankName"
                      placeholder="Enter Bank Name"
                      value={formDataSupplier.BankName}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="state">
                      Branch Name :
                    </label>
                    <input
                      type="text"
                      name="BranchName"
                      placeholder="Enter Branch Name"
                      value={formDataSupplier.BranchName}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                </div>
                <div className="Supplier_Master_form_Con_Row">
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="city">
                      Account No :
                    </label>
                    <input
                      type="text"
                      name="AccountNo"
                      placeholder="Enter Account No"
                      value={formDataSupplier.AccountNo}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="place">
                      IFSC Code :
                    </label>
                    <input
                      type="text"
                      name="IfscCode"
                      placeholder="Enter IFSC Code"
                      value={formDataSupplier.IfscCode}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>
                </div>
                <div className="Supplier_Master_form_Con_Row">
                  <div className="Supplier_Master_form_Con_div_Row1">
                    <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="street">
                      Pan Card No :
                    </label>
                    <input
                      type="text"
                      name="PancardNo"
                      placeholder="Enter Pan Card No"
                      value={formDataSupplier.PancardNo}
                      onChange={handleInputChange}
                      required
                      className="Supplier_Master_form_Con_div_Row_input"
                    />
                  </div>


                </div>

              </div>
            }
          </div>
        </div>
        <div className="Supplier_Master_form_sub_con_div">
          <div className="Supplier_Master_form_sub_con_div_1">
            <ToggleButton
              value='Others'
              style={{
                color: "black",
                background: "var(--ProjectColor)",
                font: "14px",
              }}
              className="Supplier_Master_form_sub_con_div_1_toggle"
            >
              Other Details
            </ToggleButton>

            <div className="Supplier_Master_form_sub_con_div_1">
              <div className="Supplier_Master_form_Con_Row">
                <div className="Supplier_Master_form_Con_div_Row1">
                  <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="shortName">
                    Short Name:
                  </label>
                  <input
                    type="text"
                    name="ShortName"
                    placeholder="Enter shortName"
                    value={formDataSupplier.ShortName}
                    readOnly={selectedSupplierIndex}
                    onChange={handleInputChange}
                    required
                    className="Supplier_Master_form_Con_div_Row_input"
                  />
                </div>
                
                <div className="Supplier_Master_form_Con_div_Row1">
                  <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="webSite">
                    WebSite:
                  </label>
                  <input
                    type="text"
                    name="Website"
                    placeholder="Enter webSite"
                    value={formDataSupplier.Website}
                    readOnly={selectedSupplierIndex}
                    onChange={handleInputChange}
                    required
                    className="Supplier_Master_form_Con_div_Row_input"
                  />
                </div>
              </div>

              <div className="Supplier_Master_form_Con_Row">

              <div className="Supplier_Master_form_Con_div_Row1">
                  <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="remarks">
                   Payment Due Days:
                  </label>
                  <input
                    type="number"
                    name="Payment_Due_Days"
                    placeholder="Enter Payment Due Days "
                    value={formDataSupplier.Payment_Due_Days}
                    onChange={handleInputChange}
                    className="Supplier_Master_form_Con_div_Row_input"
                  />
                </div>              

                <div className="Supplier_Master_form_Con_div_Row1">
                  <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="remarks">
                    Remarks:
                  </label>
                  <textarea
                    type="text"
                    name="Remarks"
                    placeholder="Enter remarks"
                    value={formDataSupplier.Remarks}
                    onChange={handleInputChange}
                    readOnly={selectedSupplierIndex}
                    required
                    className="Supplier_Master_form_Con_div_Row_input"
                  />
                </div>  

              </div>


              <div className="Supplier_Master_form_Con_Row">

              <div className="Supplier_Master_form_Con_div_Row1">
                  <label className="Supplier_Master_form_Con_div_Row_label" htmlFor="street">
                    Concern Form :
                  </label>
                  <input
                    type="file"
                    name="ConcernForm"
                    accept="image/*,.pdf"
                    id="Supplier_Concern_form"
                    onChange={(e) => {
                      console.log(e.target.files[0]);
                      setFormDataSupplier((prev) => ({
                        ...prev,
                        ConcernForm: e.target.files[0],
                      }));
                    }}
                    required
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="Supplier_Concern_form" className="Supplier_Concern_form_choose">
                    Choose File
                  </label>
                </div>

                <div className="Supplier_Master_form_Con_div_Row">
            <label htmlFor="inactive" className="Supplier_Master_form_Con_div_Row_label">
              Inactive:
              <input
                type="checkbox"
                id="inactive"
                checked={isInactive}
                onChange={handleInactiveChange}
                className="Supplier_Master_form_Con_div_Row_input"
              />
              </label>
               </div>


              </div>
              
              
                
            </div>
          </div>
        </div>
      </div>
      <div className="Supplier_Master_form_Save">
        <button className="Supplier_Master_form_Save_button" onClick={handleSaveOrUpdate}>
          save
        </button>
      </div>
    </div>
  );
}

export default SupplierMaster;
