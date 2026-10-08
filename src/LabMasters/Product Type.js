import React, { useState } from 'react';
import './Organization.css';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from 'react-redux';

function ProductType() {
 const [productType,setProductType]=useState('');
const [productTypeCode,setProductTypeCode] = useState('');
const[productData,setProductData]=useState([]);
const [isEditMode, setIsEditMode] = useState(false); 
const [selectedMethodId, setSelectedMethodId] = useState(null);
const urllink=useSelector(state=>state.userRecord?.UrlLink)

const handleSubmitProductType = async () => {
  // Check if either input is empty
  if (!productType.trim() || !productTypeCode.trim()) {
    alert('Both Product Type and Product Type Code are required.');
    return; // Exit the function early if validation fails
  }

  try {
    // Proceed with the POST request since validation passed
    const response = await axios.post(`${urllink}maindepartment/insertproducttype`, {
      productType,
      productTypeCode,
    });

    // Handle the response as needed
    console.log(response.data);
    
    // Optionally, reset the state after a successful submission
    setProductType('');
    setProductTypeCode('');
    fetchProductTypeData();
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle error scenarios
  }
};

React.useEffect(() => {
  fetchProductTypeData();
 
  
 
}, []);
const fetchProductTypeData = () => {
  axios.get(`${urllink}mainddepartment/getproducttype`)
    .then((response) => {
      const data = response.data;
      console.log("data",data)

      setProductData(data)
    })
    .catch((error) => {
      console.error('Error fetching producttype data:', error);
    });
};
const handleEdit = (row) => {
  
  setProductType(row.product_type_name);
  setProductTypeCode(row.product_type_code);
  setIsEditMode(true);
  setSelectedMethodId(row.product_type_id); // Assuming `method_id` is the identifier
};

const handleUpdateMethod = async () => {
  try {
    const response = await axios.post(`${urllink}mainddepartment/updateproducttype`, {
      method_id: selectedMethodId,
      method_name:  productType,
      method_code: productTypeCode,
    });
    console.log(response.data);
    // setMethod('');
    // setMethodCode('');
    setProductType('');
    setProductTypeCode('');
    setIsEditMode(false);
    setSelectedMethodId(null);
    fetchProductTypeData ();
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
  return (
    <div className="ShiftClosing_over">
      <div className="ShiftClosing_Container">
      <div className='ShiftClosing_header'>
        <h4 >Product Type</h4>
      </div>
      </div>

        <div className="ShiftClosing_Container">
          <div className="FirstpartOFExpensesMaster">
          <h2 style={{ textAlign: 'center' }}>Products</h2>
        
          <div className='con_1'>
         <div className='inp_1'>
             <label htmlFor="input" style={{ whiteSpace: "nowrap" }}>Product Type:</label>
                <input
                  type="text"
                  id="productTypeName"
                  name="productTypeName"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="Enter Designation Name"
                  style={{ width: "150px" }}
                />
          </div>

         
            <div className="inp_1">
                <label htmlFor="input" style={{ whiteSpace: "nowrap" }}>Type Code :</label>
                <input
                  type="text"
                  id="typeCode"
                  name="typeCode"
                  value={productTypeCode}
                  onChange={(e) => setProductTypeCode(e.target.value)}
                  placeholder="Enter Designation Name"
                  style={{ width: "150px" }}
                />
              </div>
             
{/*             
            <button className="btn_1" onClick={handleSubmitProductType}>
                <AddIcon />
              </button> */}
                             <button className="btn_1" onClick={isEditMode ? handleUpdateMethod : handleSubmitProductType}>
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
                        <th>Product Type</th>
                        <th >Product Type Code</th>
                        <th>Edit</th>
                       
                      </tr>
                    </thead>
                    <tbody>
                    {productData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.product_type_id}</td>
                          <td>{row.product_type_name}</td>
                          <td>

                            {row.product_type_code}
                          </td>
                          <td>  
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
    </div>
  );
}

export default ProductType;

