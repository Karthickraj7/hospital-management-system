import React, { useState } from 'react';
import './Organization.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
function Products() {
  const urllink=useSelector(state=>state.userRecord?.UrlLink)

  const [productsData, setProductsData] = useState([]);
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productUnit, setProductUnit] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const userWarn = (warningMessage) => {
    toast.warn(`${warningMessage}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      style: { marginTop: '50px' },
    });
  };

  const handleSubmitProducts = async () => {
    const requiredFields = [
      'productName',
      'productCode',
      'productCategory',
      'productUnit',
      'productType',
      'productPrice',
    ];

    const missingFields = requiredFields.filter((field) => !eval(field));
    
    if (missingFields.length === 0) {
      try {
        // Make a POST request to your Django backend endpoint
        const response = await axios.post(`${urllink}mainddepartment/insertproducts`, {
          productName,
          productCode,
          productCategory,
          productUnit,
          productType,
          productPrice,
        });

        // Handle the response as needed
        console.log(response.data);
        setProductName('');
        setProductCode('');
        setProductType('');
        setProductCategory('');
        setProductUnit('');
        setProductPrice('');

        // Optionally, fetch updated data
        // fetchProductsData();
      } catch (error) {
        console.error('An error occurred:', error);
        // Handle error scenarios
      }
    } else {
      userWarn(`Please fill out all required fields: ${missingFields.join(', ')}`);
    }
  };

  React.useEffect(() => {
    fetchProductsData();
   
    
   
  }, []);
  const fetchProductsData = () => {
    axios.get(`${urllink}mainddepartment/getproducts`)
      .then((response) => {
        const data = response.data;
        console.log("data",data)
      
        setProductsData(data)
        console.log(setProductsData)
      })
      .catch((error) => {
        console.error('Error fetching expense data:', error);
      });
  };

  return (
    <div className="Clinic_det_new">
      <div className="clinic_head">
        <h4>Products</h4>
      </div>
      <div className="bill_table_invoice">
      <div className='new_user_items'>
      <div className="new_clinic_form">
        <div className="new_form_pack111">
          <label htmlFor="productName" className="new_form_first111">
            Product Name<span>:</span>
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            className="new_clinic_form_inp111"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter Product Name"
            required
          />
        </div>
        <div className="new_form_pack111">
          <label htmlFor="productType" className="new_form_first111">
            Product Type<span>:</span>
          </label>
          <select
            id="productType"
            name="productType"
            value={productType}
            className="new_clinic_form_inp111"
            onChange={(e) => setProductType(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="vensil">vensil</option>
            <option value="carryton">carryton</option>
          </select>
        </div>
      </div>

      <div className="new_clinic_form">
        <div className="new_form_pack111">
          <label htmlFor="productUnit" className="new_form_first111">
            Product Unit<span>:</span>
          </label>
          <input
            type="text"
            id="productUnit"
            name="productUnit"
            placeholder="Enter Product Unit"
            className="new_clinic_form_inp111"
            value={productUnit}
            onChange={(e) => setProductUnit(e.target.value)}
            required
          />
        </div>
        <div className="new_form_pack111">
          <label htmlFor="productCode" className="new_form_first111">
            Product Code<span>:</span>
          </label>
          <input
            type="text"
            id="productCode"
            name="productCode"
            className="new_clinic_form_inp111"
            placeholder="Enter Product Code"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="new_clinic_form">
        <div className="new_form_pack111">
          <label htmlFor="productCategory" className="new_form_first111">
            Product Category<span>:</span>
          </label>
          <input
            type="text"
            id="productCategory"
            name="productCategory"
            value={productCategory}
            className="new_clinic_form_inp111"
            onChange={(e) => setProductCategory(e.target.value)}
            placeholder="Enter Product Category"
            required
          />
        </div>
        <div className="new_form_pack111">
          <label htmlFor="productUnit" className="new_form_first111">
            ProductPrice/Unit<span>:</span>
          </label>
          <input
            type="number"
            id="productUnit"
            name="productUnit"
            value={productPrice}
            className="new_clinic_form_inp111"
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Enter Product Unit"
            required
            min="0"
          />
        </div>
      </div>

      <div className='Register_btn_con'>
        <button className='new_btn1_1' onClick={handleSubmitProducts}>Save</button>
      </div>
      </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Products;


