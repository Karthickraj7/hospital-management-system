import React, { useState } from 'react';
// import '../Pettycash/Pettycash.css';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from 'react-redux';

function PatientGroupName() {
  const[patientGroupData,setPatientGroupData]=useState([])
  const [patientType,setPatientType]=useState('');
  const [patientCode,setPatientCode] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
const [selectedMethodId, setSelectedMethodId] = useState(null);
const urllink=useSelector(state=>state.userRecord?.UrlLink)
  
const handleSubmitPatient = async () => {
  if (!patientType.trim() || !patientCode.trim()) {
    alert('Both patientType Name and patient Code are required.');
    return; // Exit the function early if validation fails
  }
  try {
    // Make a POST request to your Django backend endpoint
     const response = await axios.post(`${urllink}mainddepartment/insertpatient`, {
      patientType,
      patientCode,
    });

    // Handle the response as needed
    console.log(response.data);
    
    // Optionally, you can reset the state after a successful submission
    setPatientType('');
    setPatientCode('');
    fetchPatientData();
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle error scenarios
  }
};
React.useEffect(() => {
  fetchPatientData();
 
  
 
}, []);
const fetchPatientData = () => {
  axios.get(`${urllink}mainddepartment/getpatient`)
    .then((response) => {
      const data = response.data;
      console.log("data",data)

      setPatientGroupData(data)
    })
    .catch((error) => {
      console.error('Error fetching patientgroup data:', error);
    });
};
const handleEdit = (row) => {
  // setMethod(row.method_name);
  // setMethodCode(row.method_code);
   setPatientType(row.patient_type);
    setPatientCode(row.patient_code);
  setIsEditMode(true);
  setSelectedMethodId(row.patient_id); // Assuming `method_id` is the identifier
};

const handleUpdateMethod = async () => {
  try {
    const response = await axios.post(`${urllink}mainddepartment/updatepatient`, {
      method_id: selectedMethodId,
      method_name:  patientType,
      method_code: patientCode,
    });
    console.log(response.data);
    // setMethod('');
    // setMethodCode('');
    setPatientType('');
    setPatientCode('');
    setIsEditMode(false);
    setSelectedMethodId(null);
    fetchPatientData();
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
  return (
    <div className="appointment">
      <div className="h_head">
        <h4 >Patient Group </h4>
      </div>
   
      <div className="ShiftClosing_Container">
        <div className='FirstpartOFExpensesMaster'>
          <h2 style={{ textAlign: 'center' }}></h2> 


              <div className="con_1 ">
              <div className="inp_1">
                  <label htmlFor="input" style={{ whiteSpace: "nowrap" }}>Patient Type :</label>
                  <input
                    type="text"
                    id="FirstName"
                    name="roleName"
                    value={patientType}
                    onChange={(e) =>setPatientType(e.target.value)}      
                    placeholder="Enter Patient Type"
                    style={{ width: "150px" }}
                  />

                </div>
                <div className="inp_1">
                  <label htmlFor="input" style={{ whiteSpace: "nowrap" }}>Patient Code :</label>
                  <input
                    type="text"
                    id="FirstName"
                    name="roleName"
                    value={patientCode}
                    onChange={(e) =>setPatientCode(e.target.value)}        
                    placeholder="Enter Designation Name"
                    style={{ width: "150px" }}
                  />
                </div>
                {/* <div className="inp_1">
                  <label htmlFor="input" style={{ whiteSpace: "nowrap" }}> Discount :</label>
                  <input
                    type="text"
                    id="FirstName"
                    name="roleName"
      
                    placeholder="Enter Designation Name"
                    style={{ width: "150px" }}
                  />
                </div> */}
                {/* <button className="btn_1" onClick={handleSubmitPatient }>
                  <AddIcon />
                </button> */}
                                          <button className="btn_1" onClick={isEditMode ? handleUpdateMethod : handleSubmitPatient}>
  {isEditMode ? 'Update' : <AddIcon />}
</button>
              </div>


              <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
                <h4>Table</h4>

                <div className="Selected-table-container ">
                  <table className="selected-medicine-table2 ">
                    <thead>
                      <tr>
                        <th >S.No</th>
                        <th>Patient Type</th>
                        <th >Patient Code </th>
                        <th>Edit</th>
                        {/* <th >Status</th> */}
                      </tr>
                    </thead>
                    <tbody>
                    {patientGroupData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.patient_id}</td>
                          <td>{row.patient_type}</td>
                          <td>

                            {row.patient_code}
                          </td>
                          <td><button onClick={() => handleEdit(row)}><EditIcon/></button></td>

                        </tr>
                      ))}
                     
                    </tbody>
                  </table>

                </div>

              </div>

            </div>  
        </div>
    </div>
  );
}

export default PatientGroupName;

