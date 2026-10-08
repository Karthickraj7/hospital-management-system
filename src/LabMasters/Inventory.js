

import React, { useState, useEffect } from 'react';


import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import "./Inventory.css";

function PurchaseForm({ addPurchase }) {
  const [vendor, setVendor] = useState('');
  const [purchaseNumber, setPurchaseNumber] = useState('');
  const [purchaseRemarks, setPurchaseRemarks] = useState('');
  const [quantity, setQuantity] = useState('');
  const [product, setProduct] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [codeSearch, setCodeSearch] = useState('');
  const [discountAmount, setDiscountAmount] = useState(''); // Add this line
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [ccCharges, setCcCharges] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [vendorOptions] = useState(['Vendor A', 'Vendor B', 'Vendor C']);
  const [productOptions] = useState(['Product 1', 'Product 2', 'Product 3']);
  const [deliveryToOptions] = useState(['Chennai', 'Chengalpatu', 'Karnataka']);
  const [departmentOptions] = useState(['Pharmacy', 'Dispensal']);
  const [billingInfo, setBillingInfo] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [crossAmount, setCrossAmount] = useState(0);
  const [deliveryTo, setDeliveryTo] = useState('');
  const [department, setDepartment] = useState('');
  const [supplierCode, setSupplierCode] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [currencyOptions] = useState(['Dollar', 'Rupees']);
  const [selectedPurchaseNo, setSelectedPurchaseNo] = useState('');
  const [purchaseNoOptions] = useState(['12345', '67890', '54321', '09876']);
  const [amendmentNo, setAmendmentNo] = useState('');
  const [code, setCode] = useState('');
  const [selectedUOM, setSelectedUOM] = useState('');
  const [uomOptions] = useState(['Piece', 'Kilogram', 'Liter', 'Box', 'Dozen']);
  const [pack, setPack] = useState('');
  const [free, setFree] = useState('');
  const [purchaseOrderRate, setPurchaseOrderRate] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [purchasedate, setPurchaseDate] = useState('');
  

  // Function to calculate the total amount
  const calculateTotalAmount = () => {
    const quantityValue = parseFloat(quantity);
    const freeValue = parseFloat(free);
    const purchaseOrderRateValue = parseFloat(purchaseOrderRate);
    const unitPriceValue = parseFloat(unitPrice);
    const discountPercentageValue = parseFloat(discountPercentage);
    const discountAmountValue = parseFloat(discountAmount);
    const ccChargesValue = parseFloat(ccCharges);

    const subtotal = (quantityValue - freeValue) * purchaseOrderRateValue;
    const totalBeforeDiscount = subtotal + ccChargesValue;
    const discount = (discountPercentageValue / 100) * totalBeforeDiscount;
    const total = totalBeforeDiscount - discount + discountAmountValue;

    setTotalAmount(total);
  };
  useEffect(() => {
    calculateTotalAmount();
  }, [quantity, free, purchaseOrderRate, unitPrice, discountPercentage, discountAmount, ccCharges]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    // Parse numerical fields as floats or integers
    const parsedQuantity = parseInt(quantity || 0);
    const parsedUnitPrice = parseFloat(unitPrice || 0);
    const parsedFree = parseInt(free || 0);
    const parsedDiscountAmount = parseFloat(discountAmount || 0);
    const parsedDiscountPercentage = parseFloat(discountPercentage || 0);
    const parsedCCCharges = parseFloat(ccCharges || 0);
    
    // Calculate the total cost of the item
    let totalCost = parsedQuantity * parsedUnitPrice;

    // Calculate the discount based on the user input
    if (parsedDiscountAmount !== 0) {
      totalCost -= parsedDiscountAmount;
    } else if (parsedDiscountPercentage !== 0) {
      totalCost -= (parsedDiscountPercentage / 100) * totalCost;
    }

    // Add credit card charges if provided
    if (!isNaN(parsedCCCharges)) {
      totalCost += parsedCCCharges;
    }

    const newCartItem = {
      vendor,
      purchaseNumber,
      purchaseRemarks,
      product,
      batchNumber,
      quantity: parsedQuantity,
      unitPrice: parsedUnitPrice,
      department,
      deliveryTo,
      supplierCode,
      uom: selectedUOM,
      pack, // Pack should be numeric
      free: parsedFree, // Free should be numeric
      discountAmount: parsedDiscountAmount,
      discountPercentage: parsedDiscountPercentage,
      purchasedate, // You should set this properly
      ccCharges: parsedCCCharges,
    };

    // Calculate the total amount for the new cart item
    newCartItem.totalAmount = totalCost;

    setCartItems([...cartItems, newCartItem]);

    // Update total items
    const newTotalItems = cartItems.reduce((total, item) => total + item.quantity, parsedQuantity);
    setTotalItems(newTotalItems);

    // Calculate the cross amount for the new cart items
    const newCrossAmount = calculateCrossAmount([...cartItems, newCartItem]);
    setCrossAmount(newCrossAmount);

    // Clear input fields
    setVendor('');
    setPurchaseNumber('');
    setPurchaseRemarks('');
    setProduct('');
    setBatchNumber('');
    setQuantity('');
    setUnitPrice('');
    setDepartment('');
    setDeliveryTo('');
    setSupplierCode('');
    setSelectedUOM('');
    setPack('');
    setFree('');
    setDiscountAmount('');
    setDiscountPercentage('');
    setItemSearch('');
    setPurchaseDate(''); // You should set this properly
  };

  const calculateCrossAmount = (items) => {
    return items.reduce((total, item) => total + (parseInt(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSearch = () => {
    console.log('Search clicked');
  };

  const handleEdit = () => {
    console.log('Edit clicked');
  };

  const handleEmail = () => {
    console.log('Email clicked');
  };

  const handleClose = () => {
    console.log('Close clicked');
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    setVendor('');
    setQuantity('');
    setPurchaseNumber('');
    setPurchaseRemarks('');
    setProduct('');
    setBatchNumber('');
    setUnitPrice('');
    setDeliveryTo('');
    setDepartment('');
    setSupplierCode('');
    setSelectedCurrency('');
    setSelectedPurchaseNo('');
    setAmendmentNo('');
  };

  const totalCost = cartItems.reduce((total, item) => {
    const itemCost = parseInt(item.quantity || 0) * parseFloat(item.unitPrice || 0);

    if (item.discountAmount !== '') {
      total += itemCost - parseFloat(item.discountAmount || 0);
    } else if (item.discountPercentage !== '') {
      const discount = (parseFloat(item.discountPercentage || 0) / 100) * itemCost;
      total += itemCost - discount;
    } else {
      total += itemCost;
    }

    if (!isNaN(item.ccCharges)) {
      total += parseFloat(item.ccCharges || 0);
    }
    const chargeAmount = parseFloat(item.ccCharges || 0); // Parse ccCharges as a float
    if (!isNaN(chargeAmount)) { // Check if it's a valid number
      // Calculate the charge based on 2%
      const charge = (2 / 100) * total;
      total += chargeAmount + charge;
    }

    return total;
  }, 0);


  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className='PurchaseForm_Inventory'>

          <h4> <ShoppingCartIcon /> Purchase Order</h4>

        </div>
        <div className="form-section">
          <div className="form-group">
            <label className='label_classname'>Vendor</label>
            <select value={vendor} onChange={(e) => setVendor(e.target.value)}className='Inventory-1'>
              <option value="">Select Vendor</option>
              {vendorOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
          <label className='label_classname'>Delivery To</label>
            <select value={deliveryTo} onChange={(e) => setDeliveryTo(e.target.value)} className='Inventory-1'>
              <option value="">Select Delivery To</option>
              {deliveryToOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
          <label className='label_classname'>Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className='Inventory-1'>
              <option value="">Select Department</option>
              {departmentOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
          <label className='label_classname'>Supplier Code</label>
            <input
              type="text"
              value={supplierCode}
              onChange={(e) => setSupplierCode(e.target.value)} 
              className='Inventory-1' />
          </div>
          <div className="form-group">
          <label className='label_classname'> Supplier search</label>
            <input
              type="text"
              value={supplierSearch}
              onChange={(e) => setSupplierSearch(e.target.value)} className='Inventory-1'
            />
           
          </div>
          <div className="form-group">
          <label className='label_classname' htmlFor="currencySelect">Select Currency:</label>
            <select
              id="currencySelect"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              required className='Inventory-1'
            >
              <option value="" disabled>
                Select
              </option>
              {currencyOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
          <label className='label_classname'>Purchase Date</label>
            <input
              type="date"
              value={purchasedate}
              onChange={(e) => setPurchaseDate(e.target.value)} className='Inventory-1'
            />
          </div>
          <div className="form-group">
          <label className='label_classname'>Purchase Number</label>
            <select value={purchaseNumber} onChange={(e) => setPurchaseNumber(e.target.value)} className='Inventory-1' >
              <option value="">Select Purchase Number</option>
              {purchaseNoOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
          <label className='label_classname' htmlFor="amendmentNo">Amendment No:</label>
            <input
              type="text"
              id="amendmentNo"
              placeholder="Enter Amendment No"
              value={amendmentNo}
              onChange={(e) => setAmendmentNo(e.target.value)}className='Inventory-1'
            />
          </div>
          <div className="form-group">
          <label className='label_classname'>Purchase Remarks</label>
            <textarea
              value={purchaseRemarks}
              onChange={(e) => setPurchaseRemarks(e.target.value)} className='Inventory-1'
            ></textarea>
          </div>

        </div>
        <div className='button_buton_class'>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        <div className='PurchaseForm_Inventory'>

          <h3> <AddBusinessIcon /> Billing Information</h3>

        </div>
        <div className="form-section">
          <div className="form-group">
          <label className='label_classname' htmlFor="item">Item:</label>
            <input
              type="text"
              id="item"
              placeholder="Enter Item"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required className='Inventory-1'
            />

          </div>
          <div className="form-group">
          <label className='label_classname' htmlFor="item">Item Search:</label>
            <input
              type="text"
              id="itemsearch"
              placeholder="ItemSearch"
             
             
              required className='Inventory-1'
            />

          </div>
          <div className="form-group">
          <label className='label_classname'>Product</label>
            <select value={product} onChange={(e) => setProduct(e.target.value)} className='Inventory-1'>
              <option value="">Select Product</option>
              {productOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
          <label className='label_classname'>Batch Number</label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)} className='Inventory-1'
            />
          </div>
          <div className="form-group">
          <label className='label_classname'>UOM</label>
            <select value={selectedUOM} onChange={(e) => setSelectedUOM(e.target.value)} className='Inventory-1'>
              <option value="">Select UOM</option>
              {uomOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
          <label className='label_classname'>Pack</label>
            <input
              type="number"
              value={pack}
              onChange={(e) => setPack(e.target.value)} className='Inventory-1'
            />
          </div>
          <div className="form-group">
          <label className='label_classname'htmlFor="purchaseDate">Req Date:</label>
            <div className="date-picker">
              <input type="date" id="purchaseDate" name="Purchase Date" className='Inventory-1'/>
            </div>
          </div>
          <div className="form-group">
          <label className='label_classname'>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)} className='Inventory-1'
            />
          </div>
          <div className="form-group">
          <label className='label_classname'>Free</label>
            <input
              type="number"
              value={free}
              onChange={(e) => setFree(e.target.value)} className='Inventory-1'
            />
          </div>
          <div className="form-group">
          <label className='label_classname'>POR</label>
            <input
              type="number"
              value={purchaseOrderRate}
              onChange={(e) => setPurchaseOrderRate(e.target.value)} className='Inventory-1'
            />
          </div>
        </div>
        <div className="form-section">

         
        
          <div className="form-group">
          <label className='label_classname'>Unit Price</label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)} className='Inventory-1'
            />
          </div>
          <div className="form-group">
          <label className='label_classname'>Discount (%)</label>
            <input
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)} className='Inventory-1'
            />
          </div>
          <div className="form-group">
          <label className='label_classname'>Discount Amount</label>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)} className='Inventory-1'
            />
          </div>

          <div className="form-group">
          <label className='label_classname'>CC Charges</label>
            <input
              type="number"
              value={ccCharges}
              onChange={(e) => setCcCharges(e.target.value)} className='Inventory-1'
            />
          </div>
          <div className="form-group">
          <label className='label_classname' htmlFor="totalAmount">Total Amount:</label>
            <input
              type="number"
              id="totalAmount"
              value={totalAmount}
              readOnly className='Inventory-1'
            />
          </div>
        </div>
        <div className='button_buton_class addtocart'>
        <button className="btn-add" onClick={handleAddToCart}>
          AddToCart
        </button>
        </div>
      </form>
      <div className="cart-container">
      <div className='PurchaseForm_Inventory'>
          <h4 ><ShoppingCartCheckoutIcon />Cart</h4>
        </div>
        <div className="table-container">
        <table>
          <thead >
            <tr>
            <th>Vendor</th>
            <th> Del</th>
            <th>Supplier</th>
        
            <th>Pur Date</th>
            <th>Pur NO</th>
       
            <th>Remarks</th>
        
            <th>Batch</th>
              <th>Product</th>
           <th>UOM</th>
           <th>Pack</th>
         
              <th>Quantity</th>
              <th>Free</th>
              
              <th>Unit Price</th>
              <th>Dis%</th>
              <th>Dis</th>
              <th>ccc</th>
              <th>Total Amount</th>
             
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td>{item.vendor}</td>
                <td>{item.deliveryTo}</td>
                <td>{item.supplierCode}</td>
              
                <td>{item.purchasedate}</td>
                <td>{item.purchaseNumber}</td>
               
                <td>{item.purchaseRemarks}</td>
         
                <td>{item.batchNumber}</td>
                <td>{item.product}</td>
                <td>{item.uom}</td>
                <td>{item.pack}</td>
              
                <td>{item.quantity}</td>
                <td>{item.free}</td>
             
                <td>{item.unitPrice}</td>
                <td>{item.discountPercentage}</td>
                <td>{item.discountAmount}</td>
                <td>{item.ccCharges}</td>
                <td>{item.totalAmount}</td>
             
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="total-cost">
          <p      className='label_classname'>Total Items: {totalItems}</p>
          <p className='label_classname'>Cross Amount: {crossAmount}</p>
        </div>
      </div>
    </div>
  );
}

function InventoryPurchase() {
  const [purchases, setPurchases] = useState([]);

  const addPurchase = (purchase) => {
    setPurchases([...purchases, purchase]);
  };

  return (
    <div className="container">
      <PurchaseForm addPurchase={addPurchase} />
    </div>
  );
}

export default InventoryPurchase;




