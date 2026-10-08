import axios from 'axios'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert'
import { useDispatch, useSelector } from 'react-redux'
import {differenceInYears, startOfYear,subYears,isBefore,format} from "date-fns";
import { useNavigate } from "react-router-dom";
// import '../../IP_Workbench/Nurse/jeeva.css';
import './Register.css';

const PatientFamilyDetails = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink)
    const Registeredit = useSelector(state => state.Frontoffice?.Registeredit)
    const UserData = useSelector(state => state.userRecord?.UserData)
    const toast = useSelector(state => state.userRecord?.toast)  
    const dispatchvalue = useDispatch()
    const userRecord = useSelector((state) => state.userRecord?.UserData);
   const dispatch = useDispatch();
   const navigate = useNavigate();


    const [FamilyDetails, setFamilyDetails] = useState({
        Name: '',
        DOB: '',
        Age: '',
        Gender: '',
        BloodGroup: '',
        Relation: '',
        Depend: '',
        Occupation: '',
        AliveDeath: '',
        Alive: '',
        Death: '',
        Reason: '',
        
    })

    const relationships = [
        'Spouse',
        'Father',
        'Mother',
        'Brother',
        'Sister',
        'Father-in-law',
        'Mother-in-law',
        'Grandfather',
        'Grandmother',
        'Son',
        'Daughter',
        'Grandson',
        'Granddaughter',
        'Son-in-law',
        'Daughter-in-law',
        'Uncle',
        'Aunt',
        'Nephew',
        'Niece',
        'Cousin',
        'Step-father',
        'Step-mother',
        'Step-son',
        'Step-daughter'
    ]

    const [BloodGroupData, setBloodGroupData] = useState([]);
      


    const formatLabel = (label) => {
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
          return label
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/^./, (str) => str.toUpperCase());
        } else {
          return label;
        }
    };


    const handleInputChange = (e) => {
        
      const { name, value, type, checked } = e.target;
        let formattedValue = type === "checkbox" ? checked : value.trim();
    
        // Capitalize the first letter for specific fields
        if (name === "Name" && type !== "checkbox") {
            formattedValue = `${formattedValue.charAt(0).toUpperCase()}${formattedValue.slice(1)}`;
        }
    
        if (name === "DOB") {
          const selectedDate = new Date(value);
          const age = differenceInYears(new Date(), selectedDate);
          setFamilyDetails((prev) => ({
            ...prev,
            DOB: value,
            Age: age >= 0 && age <= 100 ? age : "",
          }));
          return; // Exit after handling dob
        }
    
        if (name === "Age") {
          const intAge = parseInt(value, 10);
          if (!isNaN(intAge) && intAge >= 0 && intAge <= 100) {
            const dobDate = subYears(new Date(), intAge);
            setFamilyDetails((prev) => ({
              ...prev,
              Age: intAge,
              DOB: format(dobDate, "yyyy-MM-dd"),
            }));
          } else {
            setFamilyDetails((prev) => ({
              ...prev,
              Age: value,
              DOB: "",
            }));
          }
          return; // Exit after handling Age
        }
    
      
    
    
        setFamilyDetails((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
    };

    useEffect(() => {
        axios
          .get(`${UrlLink}Masters/BloodGroup_Master_link`)
          .then((res) => setBloodGroupData(res.data))
          .catch((err) => console.log(err));
    
      }, [UrlLink]);
    


    const handleSubmit = async () => {
        // Combine EmployeeformData and other necessary data
        const Data = {
          ...FamilyDetails,
          Createdby: userRecord?.username,
          Location: userRecord?.location,
        //   Employee_Id: EmployeeListId?.Employee_Id || "",
          
        };
    
        console.log(Data, "Data");
    
        // List of required fields
        const requiredFields = [
          "Name",
          "Relation",
        ];
    
        const emptyFields = requiredFields.filter(
          (field) => !FamilyDetails[field]
        );
    
        if (emptyFields.length > 0) {
          alert(`The following fields are required: ${emptyFields.join(", ")}`);
          return;
        }
    
        try {
          // Send a POST request with the JSON payload
          const response = await axios.post(
            `${UrlLink}Frontoffice/Patient_FamilyDetails`,
            Data // Send plain JSON object
          );
    
          // Handle response
          const [type, message] = [
            Object.keys(response.data)[0],
            Object.values(response.data)[0],
          ];
          dispatch({ type: "toast", value: { message, type } });
          navigate("/Home/FrontOfficeFolder");
        //   dispatchvalue({ type: "EmployeeListId", value: "" });
          dispatchvalue({ type: "FrontOfficeFolder", value: "EmployeeRegistrationList" });
        } catch (error) {
          console.error("Error during submission:", error);
        }
      };



  return (
    <>
      <div className="Main_container_app">
          {/* <h3>Family Details</h3> */}
          <br/>
          <div className="RegisFormcon">
              
            <div className="RegisForm_1">
                <label>
                    Name <span>:</span>
                </label>
                <input
                    type="text"
                    name="Name"
                    value={FamilyDetails.Name}
                    onChange={handleInputChange}
                />
            </div>

            <div className="RegisForm_1">
                <label>
                    DOB <span>:</span>
                </label>
                <input
                    type="date"
                    name="DOB"
                    value={FamilyDetails.DOB}
                    onChange={handleInputChange}
                />
            </div>

            <div className="RegisForm_1">
            <label>
                Age <span>:</span>
            </label>
            <input
                type="number"
                name="Age"
                onKeyDown={(e) =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                value={FamilyDetails.Age}
                onChange={handleInputChange}
            />
            </div>


            <div className="RegisForm_1">
                <label>
                    Gender <span>:</span>
                </label>
                <select
                    name="Gender"
                    value={FamilyDetails.Gender}
                    onChange={handleInputChange}
                >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">TransGender</option>
                </select>
            </div>

            <div className="RegisForm_1">
                <label>
                    Blood Group <span>:</span>
                </label>
                <select
                    name="BloodGroup"
                    id="BloodGroup"
                    value={FamilyDetails.BloodGroup}
                    onChange={handleInputChange}
                >
                    <option value="">Select</option>
                    {BloodGroupData.map((row, indx) => (
                    <option key={indx} value={row.id}>
                        {row.BloodGroup}
                    </option>
                    ))}
                </select>
            </div>

            <div className="RegisForm_1">
                <label>
                Relation <span>:</span>
                </label>
                <select
                    name="Relation"
                    id="Relation"
                    value={FamilyDetails.Relation}
                    onChange={handleInputChange}
                >
                    <option value="">Select</option>
                    {relationships?.map((row, indx) => (
                    <option key={indx} value={row}>
                        {row}
                    </option>
                    ))}
                </select>
            </div>

            <div className="RegisForm_1">
              <label>
              Occupation<span>:</span>
              </label>
              <input
                type="text"
                name="Occupation"
                value={FamilyDetails.Occupation}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>Reason<span>:</span></label>
              <textarea
                  type="text"
                  name="Reason"
                  value={FamilyDetails.Reason}
                  onChange={handleInputChange}
              />
            </div>
            <div className='RegisFormcon'>

              <div className="div_ckkck_box alcho_tac_drg11">
                <div className="flx_cjk_labl3">
                  <label className="checkbox-label_ooo">
                    <input
                      type="checkbox"
                      name="Depend"
                      className="checkbox-input ddsfe"
                      checked={FamilyDetails.Depend}
                      value={FamilyDetails.Depend}
                      onChange={handleInputChange}
                      required
                    />
                    Depend
                  </label>
                </div>
              </div>

              <div className="div_ckkck_box alcho_tac_drg11">
                <div className="flx_cjk_labl3">
                  <label className="checkbox-label_ooo">
                    <input
                      type="checkbox"
                      name="Alive"
                      className="checkbox-input ddsfe"
                      checked={FamilyDetails.Alive}
                      value={FamilyDetails.Alive}
                      onChange={handleInputChange}
                      required
                    />
                    Alive
                  </label>
                </div>
              </div>

              <div className="div_ckkck_box alcho_tac_drg11">
                <div className="flx_cjk_labl3">
                  <label className="checkbox-label_ooo">
                    <input
                      type="checkbox"
                      name="Death"
                      className="checkbox-input ddsfe"
                      checked={FamilyDetails.Death}
                      value={FamilyDetails.Death}
                      onChange={handleInputChange}
                      required
                    />
                    Death
                  </label>
                </div>
              </div>

            </div>
            

            {/* <div className="RegisForm_1">
              <label>
              Alive / Death<span>:</span>
              </label>
              <input
                type="checkbox"
                name="AliveDeath"
                value={FamilyDetails.AliveDeath}
                onChange={handleInputChange}
                required
              />
            </div> */}
            

          </div>
          
          {/* <div className="Main_container_Btn">
          <button onClick={handleSubmit}>Add</button>
          </div> */}

          {/* {RegData.length > 0 &&
              <ReactGrid columns={EmgRegisterColumns} RowData={RegData} />
          } */}

          <ToastAlert Message={toast.message} Type={toast.type} />
      </div>

    
    </>
  )
}

export default PatientFamilyDetails;




