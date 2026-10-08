import React, { useState } from 'react';
import './Organization.css';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from 'react-redux';
function ExpenseType() {
  const urllink=useSelector(state=>state.userRecord?.UrlLink)
 
  const [expenseMethod,setExpenseMethod]=useState('');
  // const [expenseType,setExpenseType] = useState('');
  const [expenseName,setExpenseName] = useState('');
  const[expenseData,setExpenseData]=useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  
const handleSubmitExpenseType = async () => {
  if (!expenseMethod.trim() || !expenseName.trim()) {
    alert('Both expense Name and expense Method are required.');
    return; // Exit the function early if validation fails
  }
  try {
    // Make a POST request to your Django backend endpoint
     const response = await axios.post(`${urllink}mainddepartment/insertexpense`, {
      expenseMethod,
      expenseName,
    });

    // Handle the response as needed
    console.log(response.data);
    
    // Optionally, you can reset the state after a successful submission
    setExpenseMethod('');
    setExpenseName('');
    fetchExpenseTypeData();
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle error scenarios
  }
};
React.useEffect(() => {
  fetchExpenseTypeData();
 
  
 
}, []);
const fetchExpenseTypeData = () => {
  axios.get(`${urllink}mainddepartment/getexpense`)
    .then((response) => {
      const data = response.data;
      console.log("data",data)

      setExpenseData(data)
    })
    .catch((error) => {
      console.error('Error fetching expense data:', error);
    });
};
const handleEdit = (row) => {
  
  setExpenseMethod(row.expense_methods);
  setExpenseName(row.expense_name);
  setIsEditMode(true);
  setSelectedMethodId(row.expense_id); // Assuming `method_id` is the identifier
};

const handleUpdateMethod = async () => {
  try {
    const response = await axios.post(`${urllink}mainddepartment/updateexpense`, {
      method_id: selectedMethodId,
      method_name:  expenseMethod,
      method_code: expenseName,
    });
    console.log(response.data);
    // setMethod('');
    // setMethodCode('');
    setExpenseMethod('');
    setExpenseName('');
    setIsEditMode(false);
    setSelectedMethodId(null);
    fetchExpenseTypeData ();
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
  
  return (
    <div className='ShiftClosing_over'>
      <div className="ShiftClosing_Container">
        <div className="ShiftClosing_header">
          <h3>Expenses Master</h3>
        </div>

       
          <h2 style={{ textAlign: 'center' }}>Add Expenses Types</h2>


              <div className="con_1 ">
              <div className="inp_1">
                  <label htmlFor="input" style={{ whiteSpace: "nowrap" }}>Expences Method :</label>
                  <select
                  name="department"
                  value={expenseMethod}
                  style={{width:"150px"}}
                  onChange={(e) => setExpenseMethod(e.target.value)}
                  // className='new_clinic_form_inp111'
                  required
                >
                  <option value="">Select Methods</option>
                  <option value='DIRECT METHOD'>Direct Method</option>
                  <option value='INDIRECT METHOD'>Indirect Method</option>
                  
                </select>

                </div>
                <div className="inp_1">
            <label htmlFor="input" style={{whiteSpace:"nowrap"}}>Expenses Name :</label>
            <input
              type="text"
              id="FirstName"
              value={expenseName}
              onChange={(e) => { setExpenseName(e.target.value) }}
              placeholder="Enter Expenses Name"
              style={{width:"150px"}}
              // className='new_clinic_form_inp111'
            />
          </div>
                {/* <button className="btn_1" onClick={Add_Expenses}>
                  <AddIcon />
                </button> */}
                                          <button className="btn_1" onClick={isEditMode ? handleUpdateMethod : handleSubmitExpenseType}>
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
                        <th>Expenses Method</th>
                        <th >Expences Type</th>
                        <th >Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.expense_id}</td>
                          <td>{row.expense_methods}</td>
                          <td>{row.expense_name}</td>
                          <td>

                            {/* <button onClick={() => handleEditExpensesClick(client)}
                              className='Addnamebtn_pt2'>{client.Status}</button> */}
                               <button onClick={() => handleEdit(row)}><EditIcon/></button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>

              </div>

            

      </div>
    </div>
  );
}

export default ExpenseType;

