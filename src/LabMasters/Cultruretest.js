import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AddIcon from "@mui/icons-material/Add";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";

const Cultruretest = () => {
  const [subDep , setSetDep] = useState([])
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectantibiotic, setselectantibiotic] = useState('')
  const [selectedtest, setselectedtest] = useState([])
  const [editMode, setEditMode] = useState(false);
  const [SelectedFile, setSelectedFile] = useState(null);
  const [Antibiotic , setantibiotic] = useState([]);
  const [specimendata , setSpecimenData] = useState([])
  const [formData, setFormData] = useState({
    CultureName: "",
    CultureCode: "",
    Department: "",
    displayName: "",
    billingCode: "",
    Specimen :'',
    billingName: "",
    gender: "",
    testCategory: "",
    lonicCode: "",
    CultureCost: "",
    InterpretationHead: "",
    Interpretation: ""
  });
  const urllink = useSelector(state => state.userRecord?.UrlLink)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  useEffect(()=>{
    axios.get(`${urllink}usercontrol/getantibioticdata`)
    .then((response) => {
      const data = response.data;
      console.log("data", data);
      setantibiotic(data);
    })
    .catch((error) => {
      console.error('Error fetching antibioticgroup data:', error);
      // setAntibioticData([]); // Reset data in case of an error
    });
  },[urllink])


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
      style: { marginTop: "50px" },
    });
  };
  const successMsg = (msg) => {
    toast.success(`${msg}`, {
      position: "top-center",
      autoClose: 100,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  const warnmessage = (wmsg) => {
    toast.warn(`${wmsg}`, {
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
  };


  const handleInsertGroupMasterTestList = () => {
    // console.log(selecttest);
  
    if (formData.CultureCode!== '' && formData.CultureName!== '' && selectantibiotic!== '') {
      const newvalues = {
        CultureCode: formData.groupCode,
        CultureName: formData.groupName,
        AntibioticName: selectantibiotic
      };
      console.log(newvalues);
      setselectedtest(prev => [
        ...prev,
        newvalues
      ]);
    } else {
      alert('Please Enter Required Values');
    }
  };

  useEffect(()=>{
    axios
    .get(`${urllink}mainddepartment/getsubdepartment`)
    .then((response) => {
      const data = response.data;
      console.log("data", data);

      setSetDep(data);
    })
    .catch((error) => {
      console.error("Error fetching SubDepartment data:", error);
    });
    axios
    .get(`${urllink}mainddepartment/getspecimen`)
    .then((response) => {
      const data = response.data;
      console.log("data", data);

      setSpecimenData(data);
    })
    .catch((error) => {
      console.error("Error fetching unit data:", error);
    });
  },[urllink])

  const handleFileChange = (event) => {
    setSelectedFile(null);
    const { name } = event.target;
    setSelectedFile(event.target.files[0]);
    console.log("Service file selected:", event.target.files[0]);
    // Additional handling based on the name attribute
     if (name === "Documents") {
      // Handle Insurance file
      console.log("Insurance file selected:", event.target.files[0]);
    }
  };

  const handleCsvupload = (type) => {
    console.log(SelectedFile);
    const formData = new FormData();
    formData.append("file", SelectedFile);

    if (SelectedFile) {
     if (type === "Documents") {
        axios
          .post(
            `${urllink}usercontrol/post_groupmaster_csvfile`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then((response) => {
            console.log(response);
            successMsg("File Processed Successfully");

            setSelectedFile(null);
          })
          .catch((error) => {
            console.log(error);
            errmsg(error);
          });
      }
    }
  };


  const handleDelete = (index) => {
    // Create a copy of the selectedtest array
    const updatedTests = [...selectedtest];

    // Remove the row at the specified index
    updatedTests.splice(index, 1);

    // Update the state with the modified data
    setselectedtest(updatedTests);
  };

  return (
    <>
    <div className="appointment">
      <div className="h_head">
        <h4>Culture Test Master</h4>
      </div>
      <div className="RegisFormcon">
        
            <div className="RegisForm_1">
              <label className="" htmlFor="Equipmentnam">
                Culture name<span>:</span>
              </label>
              <input
                type="text"
                id="Culture"
                name="CultureName"
                value={formData.CultureName}
                onChange={handleInputChange}
                required
               
              />
            </div>

        
            <div className="RegisForm_1">
              <label className="" htmlFor="Equipmenttype">
                Culture Test Code <span>:</span>
              </label>
              <input
                type="text"
                id="CultureCode"
                name="CultureCode"
                value={formData.CultureCode}
                onChange={handleInputChange}
                required
                
              />
            </div>
            <div className="RegisForm_1">
              <label className="Department" htmlFor="Equipmentcate">
                Department<span>:</span>
              </label>
              <select
            id="Department"
            name="Department"
            value={formData.Department}
            onChange={handleInputChange}
            
          >
            <option value="">Select</option>
            {subDep?.map((role, index) => (
              <option key={index} value={role.subdepartment_name}>
                {role.subdepartment_name}
              </option>
            ))}
          </select>
            </div>
 
            <div className="RegisForm_1">
              <label htmlFor="displayName" className="">
                Display Name<span>:</span>
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                pattern="[A-Za-z ]+"
                title="Only letters and spaces are allowed"
                
                required
                onChange={handleInputChange}
                value={formData.displayName}
              />
            </div>

            <div className="RegisForm_1">
            <label htmlFor="departmentName" className="">
              Specimen Name<span>:</span>
            </label>
            <select
            id="Specimen"
            value={formData.Specimen}
            onChange={handleInputChange}
            name="Specimen"
          >
            <option value="">Select</option>
            {specimendata?.map((row, index) => (
              <option key={index} value={row.specimen_name}>
                {row.specimen_name}
              </option>
            ))}
          </select>
          </div>
            <div className="RegisForm_1">
              <label htmlFor="billingCode" className="">
                Billing Code<span>:</span>
              </label>

              <input
                type="text"
                id="billingCode"
                name="billingCode"
                pattern="[A-Za-z ]+"
                title="Only letters and spaces are allowed"
                // className="new_clinic_form_inp111"
                // placeholder="Enter your Billing Code"
                required
                onChange={handleInputChange}
                value={formData.billingCode}
              />
            </div>
   
            <div className="RegisForm_1">
            <label htmlFor="billingName" className="">
              Billing Name<span>:</span>
            </label>
            <input
              type="text"
              id="billingName"
              name="billingName"
              pattern="[A-Za-z ]+"
              title="Only letters and spaces are allowed"
              // className="new_clinic_form_inp111"
              // placeholder="Enter your Billing Name"
              required
              onChange={handleInputChange}
              value={formData.billingName}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="gender" >
              Gender<span>:</span>
            </label>
            <select
              id="gender"
              name="gender"
              required
              // className="new_clinic_form_inp111"
              onChange={handleInputChange}
              value={formData.gender}
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
        
          <div className="RegisForm_1">
            <label htmlFor="testcategory" className="">
              Test Category<span>:</span>
            </label>

            <select
              id="testCategory"
              name="testCategory"
              // className="new_clinic_form_inp111"
              onChange={handleInputChange}
              value={formData.testCategory}
            >
              <option value="">Select</option>
              <option value="INPATIENT">Inpatient</option>
              <option value="OUTPATIENT">Outpatient</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>
       

      <div className="RegisForm_1">
            <label htmlFor="loniccode" className="">
              Lonic Code<span>:</span>
            </label>

            <input
              type="text"
              id="loincCode"
              name="lonicCode"
              // className="new_clinic_form_inp111"
              pattern="[A-Za-z ]+"
              title="Only letters and spaces are allowed"
              // placeholder="Enter your Lonic Code"
              required
              onChange={handleInputChange}
              value={formData.lonicCode}
            />
          </div>


          <div className="RegisForm_1">
            <label htmlFor="autoauthorizeduser" className="">
              Interpretation Head<span>:</span>
            </label>

            <textarea
              type="text"
              id="InterpretationHead"
              name="InterpretationHead"
              // className="new_clinic_form_inp111"
              pattern="[A-Za-z ]+"
              title="Only letters and spaces are allowed"
              // placeholder="Enter Head"
              required
              onChange={handleInputChange}
              value={formData.InterpretationHead}
            />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="loniccode" className="">
              Interpretation<span>:</span>
            </label>

            <textarea
              type="text"
              id="Interpretation"
              name="Interpretation"
              // className="new_clinic_form_inp111"
              pattern="[A-Za-z ]+"
              title="Only letters and spaces are allowed"
              // placeholder="Enter Interpretation"
              required
              onChange={handleInputChange}
              value={formData.Interpretation}
            />
          </div>

          {!isEditMode && (
 <>
            <div className="RegisForm_1">
              <label htmlFor="groupcost" className="">
                Culture Cost<span>:</span>
              </label>

              <input
                type="number"
                id="CultureCost"
                name="CultureCost"
                // className="new_clinic_form_inp111"
                pattern="[A-Za-z ]+"
                title="Only numbers and spaces are allowed"
                // placeholder="Enter your Group Cost"
                required
                onChange={handleInputChange}
                value={formData.groupCost}
              />
            </div>

            <div className="RegisForm_1">
              <label className="" htmlFor="test names">
                Antibiotic Name <span>:</span>
              </label>
              {/* <span style={{ display: "flex", gap: "2rem" }}> */}
                {/* <Autocomplete
                  freeSolo
                  id="test-name-autocomplete"
                  disableClearable
                  // style={{ width: "180px" }}
                  className="auto_completed_solo"
                  name="testname"
                  onChange={(e) => { setselecttest(e.target.textContent) }}
                  value={selecttest}

                  options={testname.map((option) => option)} // Map your testName array to the options prop
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                        className: "Supplier_Master_form_Con_div_Row_input_autocomplete",
                  style:{border: 'none'}

                      }}
                    />
                  )}
                /> */}
                 <input
                          id="testname"
                          name="testname"
                          list="browsers1"
                          onChange={(e) => { setselectantibiotic(e.target.value)}}
                          value={selectantibiotic}
                          required
                        />
                        <datalist id="browsers1">
                          {Antibiotic?.map((item, index) => (
                            <option
                              key={index}
                              value={item}
                            >
                              {item}
                            </option>
                          ))}
                        </datalist>

              {/* </span> */}
            </div>
            <div className="RegisForm_1">
                  <label>
                    {" "}
                    Upload CSV File <span>:</span>{" "}
                  </label>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    id="Servicechoose"
                    required
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="Servicechoose"
                    className="RegisterForm_1_btns choose_file_update"
                  >
                    Choose File
                  </label>
                  <button
                    className="RegisterForm_1_btns choose_file_update"
                    onClick={() => handleCsvupload("Documents")}
                  >
                    Upload
                  </button>
                </div>

            </>  )}

                  </div>
            {!isEditMode && <div className="Register_btn_con">
          <button
            className="btn_1"
            onClick={handleInsertGroupMasterTestList}
          // onClick={handleSubmit}
          >
            <AddIcon />
          </button>
        </div>}
        {!isEditMode && <div>

{/* <h4>Table</h4> */}

{/* Inside your render function */}

<div className="Selected-table-container ">
  <table className="selected-medicine-table2 ">
    <thead>
      <tr>
        <th>S.No</th>
        <th>Culture Code</th>
        <th>Culture Name</th>
        <th>Antibiotic Name</th>

        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      {selectedtest.map((row, index) => (

        <tr key={index}>
          <td>{index + 1}</td>
          <td>{row.groupCode}</td>
          <td>{row.groupName}</td>

          <td>{row.TestName}</td>
          <td>
            <button onClick={() => handleDelete(index)}>

              <DeleteIcon />
            </button>
          </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>}

<div className="Register_btn_con">
         
          <button className="RegisterForm_1_btns"
          //  onClick={isEditMode ? handleTestdata : handleSubmit}
           >
            {isEditMode ? 'Update' : 'Submit'}
          </button>

        </div>

        <ToastContainer />
    </div>
    
    
    </>
  )
}

export default Cultruretest