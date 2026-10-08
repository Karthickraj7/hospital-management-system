import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { 
  Button, TextField, Typography, FormControl, Autocomplete 
} from '@mui/material';
import { useSelector } from 'react-redux';
const getSystemName = () => localStorage.getItem("SYSTEM_NAME");

const StockEdit = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  // States
  const [stockData, setStockData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [isEditAll, setIsEditAll] = useState(false);
  const [editedRows, setEditedRows] = useState({});
  const [filters, setFilters] = useState({ ItemName: '', Batch_No: '', Store_Name: userRecord?.ActivePharmacyStoreName ,BoxName:''});
  const [batch,setbatch]= useState(true);
  // Add Product State
  const [newProduct, setNewProduct] = useState({
    Product_Id: '',
    ItemName: '',
    Store_Id: userRecord?.ActivePharmacyStoreId,
    Batch_No: '',
    AvailableQuantity: 0,
    Current_Price: '',
    Sellable_qty_price: '',
    BoxName:'',
    Expiry_Date:''
  });

  // Fetch stock data
  const fetchStockData = () => {
    const params = new URLSearchParams(filters).toString();
    axios.get(`${UrlLink}Inventory/list_stocks?${params}`)
      .then(res => {
        if (res.data.success) setStockData(res.data.data);
      })
      .catch(err => console.error(err));
  };

  // Fetch stores
  useEffect(() => {
    axios.get(`${UrlLink}Inventory/Store_Data_list`)
      .then(res => setStoreData(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));
  }, [UrlLink]);

  // Fetch products
  useEffect(() => {
    axios.get(`${UrlLink}Inventory/Product_Data_list`)
      .then(res => setProductData(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));
  }, [UrlLink]);

  useEffect(() => { fetchStockData(); }, []);

  // Inline edit handler
  const handleRowChange = (id, field, value) => {
    setEditedRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value, editedby: userRecord?.username }
    }));
  };
const handleSaveAll = () => {
  const system_name = getSystemName();

  const updates = Object.entries(editedRows).map(([id, changes]) => ({
    id,
    ...changes,
    system_name,                      // ✅ added
    editedby: userRecord?.username    // ✅ already useful
  }));

  axios.post(`${UrlLink}Inventory/bulk_edit_stock`, { updates })
    .then(res => {
      if (res.data.success) {
        alert(res.data.message);
        setIsEditAll(false);
        setEditedRows({});
        fetchStockData();
      } else {
        alert("Error: " + res.data.error);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error saving changes");
    });
};


  const applyFilters = () => fetchStockData();

  // Add Product handler
const handleAddProduct = () => {
  if (!newProduct.ItemName || !newProduct.Store_Id || !newProduct.Sellable_qty_price) {
    alert("Product, Store, and Sellable Price are required!");
    return;
  }

  const system_name = getSystemName();

  axios.post(`${UrlLink}Inventory/Add_Stock_Item`, {
    ...newProduct,
    system_name,                      // ✅ added
    createdby: userRecord?.username   // optional but recommended
  })
    .then(res => {
      if (res.data.success) {
        alert(res.data.message);

        setNewProduct({
          Product_Id: '',
          ItemName: '',
          Store_Id: userRecord?.ActivePharmacyStoreId,
          Batch_No: '',
          AvailableQuantity: 0,
          Current_Price: '',
          Sellable_qty_price: '',
          BoxName:'',
          Expiry_Date:''
        });

        fetchStockData();
      } else {
        alert(res.data.error);
      }
    })
    .catch(err => console.error(err));
};

  // Grid columns
  const columns = [
    { key: 'id', name: 'ID', width: 60 },
    { key: 'ItemName', name: 'Item Name', width: 150 },
    {
      key: 'Batch_No', name: 'Batch No', width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField size="small" style={{width:'180px'}} disabled={batch} value={editedRows[row.id]?.Batch_No ?? row.Batch_No} onChange={e => handleRowChange(row.id, "Batch_No", e.target.value)} />
      ) : row.Batch_No
    },
    {
      key: 'AvailableQuantity', name: 'Available Qty', width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField type="number" size="small" value={editedRows[row.id]?.AvailableQuantity ?? row.AvailableQuantity} onChange={e => handleRowChange(row.id, "AvailableQuantity", e.target.value)} />
      ) : row.AvailableQuantity
    },
    {
      key: 'Sellable_qty_price', name: 'Sellable_qty_price', width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField type="number" size="small" value={editedRows[row.id]?.Sellable_qty_price ?? row.Sellable_qty_price} onChange={e => handleRowChange(row.id, "Sellable_qty_price", e.target.value)} />
      ) : row.Sellable_qty_price
    },
    {
      key: 'Current_Price', name: 'Current Price', width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField type="number" size="small" value={editedRows[row.id]?.Current_Price ?? row.Current_Price} onChange={e => handleRowChange(row.id, "Current_Price", e.target.value)} />
      ) : row.Current_Price
    },
    { key: 'Current_Qunatity_Price', name: 'Current Qty Price', width: 140, renderCell: ({ row }) => row.Current_Qunatity_Price },
    { key: 'MRP_Qunatity_Price', name: 'MRP Qty Price', width: 140, renderCell: ({ row }) => row.MRP_Qunatity_Price },
    // {
    //   key: 'Tax_Type', name: 'Tax Type', width: 120,
    //   renderCell: ({ row }) => isEditAll ? (
    //     <TextField size="small" value={editedRows[row.id]?.Tax_Type ?? row.Tax_Type} onChange={e => handleRowChange(row.id, "Tax_Type", e.target.value)} />
    //   ) : row.Tax_Type
    // },
   
    // {
    //   key: 'Tax_Percentage', name: 'Tax %', width: 100,
    //   renderCell: ({ row }) => isEditAll ? (
    //     <TextField type="number" size="small" value={editedRows[row.id]?.Tax_Percentage ?? row.Tax_Percentage} onChange={e => handleRowChange(row.id, "Tax_Percentage", e.target.value)} />
    //   ) : row.Tax_Percentage
    // },
    // {
    //   key: 'Tax_Amount', name: 'Tax Amount', width: 120,
    //   renderCell: ({ row }) => isEditAll ? (
    //     <TextField type="number" size="small" value={editedRows[row.id]?.Tax_Amount ?? row.Tax_Amount} onChange={e => handleRowChange(row.id, "Tax_Amount", e.target.value)} />
    //   ) : row.Tax_Amount
    // },
    {
      key: 'Expiry_Date', name: 'Expiry Date', width: 140,
      renderCell: ({ row }) => isEditAll ? (
        <TextField type="date" size="small" value={editedRows[row.id]?.Expiry_Date ?? row.Expiry_Date} onChange={e => handleRowChange(row.id, "Expiry_Date", e.target.value)} InputLabelProps={{ shrink: true }} />
      ) : row.Expiry_Date
    },
     {
      key: 'BoxName', name: 'Box Name', width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField size="small" value={editedRows[row.id]?.BoxName ?? row.BoxName} onChange={e => handleRowChange(row.id, "BoxName", e.target.value)} />
      ) : row.BoxName
    },
    { key: 'Created_by', name: 'Created by', width: 150 },
    { key: 'Created_at', name: 'Created at', width: 150 },
    { key: 'Updated_by', name: 'Updated by', width: 150 },
    { key: 'Update_Reason', name: 'Updated Reason', width: 150 },
    { key: 'Update_at', name: 'Update at', width: 150 },
    { key: 'Store_Name', name: 'Store Name', width: 150 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Stock Edit</Typography>

      {/* Add Product Section */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <Typography variant="h6">Add New Product / Stock</Typography>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          {/* Product Autocomplete */}
          <Autocomplete
            size="small"
            options={productData}
            getOptionLabel={(option) => option.ItemName}
            value={productData.find(p => p.Product_Id === newProduct.Product_Id) || null}
            onChange={(e, newValue) => setNewProduct({
              ...newProduct,
              Product_Id: newValue?.Product_Id || '',
              ItemName: newValue?.ItemName || ''
            })}
            renderInput={(params) => <TextField {...params} label="Product" />}
            style={{ width: 200 }}
          />

          <TextField label="Batch No" size="small" value={newProduct.Batch_No} onChange={e => setNewProduct({ ...newProduct, Batch_No: e.target.value })} />
          <TextField label="Available Qty" type="number" size="small" value={newProduct.AvailableQuantity} onChange={e => setNewProduct({ ...newProduct, AvailableQuantity: e.target.value })} />
          <TextField label="Current Price" type="number" size="small" value={newProduct.Current_Price} onChange={e => setNewProduct({ ...newProduct, Current_Price: e.target.value })} />
          <TextField label="Sellable Qty Price" type="number" size="small" value={newProduct.Sellable_qty_price} onChange={e => setNewProduct({ ...newProduct, Sellable_qty_price: e.target.value })} />
          <TextField  type="date" size="small" value={newProduct.Expiry_Date} onChange={e => setNewProduct({ ...newProduct, Expiry_Date: e.target.value })} />
          <TextField label="Box Name"  size="small" value={newProduct.BoxName} onChange={e => setNewProduct({ ...newProduct, BoxName: e.target.value })} />
        
          {/* Store Autocomplete */}
          <Autocomplete
            size="small"
            //  disabled={userRecord?.username != 'host' || userRecord?.is_admin}
            options={storeData}
            getOptionLabel={(option) => `${option.Store_Name} (${option.Store_Type})`}
           value={storeData.find(s => s.Store_Name === filters.Store_Name) || null}
            onChange={(e, newValue) => setNewProduct({ ...newProduct, Store_Id: newValue?.Store_Id || '' })}
            renderInput={(params) => <TextField {...params} label="Store" />}
            style={{ width: 200 }}
          />

          <Button variant="contained" color="primary" onClick={handleAddProduct}>Add Product</Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <TextField label="Item Name" value={filters.ItemName} onChange={e => setFilters({ ...filters, ItemName: e.target.value })} size="small" />
        <TextField label="Batch No" value={filters.Batch_No} onChange={e => setFilters({ ...filters, Batch_No: e.target.value })} size="small" />
        <TextField label="Box Name" value={filters.BoxName} onChange={e => setFilters({ ...filters, BoxName: e.target.value })} size="small" />
        <Autocomplete
          size="small"
          options={storeData}
          disabled={userRecord?.username != 'host'}
          getOptionLabel={(option) => `${option.Store_Name} (${option.Store_Type})`}
          value={storeData.find(s => s.Store_Name === filters.Store_Name) || null}
          onChange={(e, newValue) => setFilters({ ...filters, Store_Name: newValue?.Store_Name || '' })}
          renderInput={(params) => <TextField {...params} label="Store" />}
          style={{ width: 200 }}
        />
      
        <Button variant="contained" onClick={applyFilters}>Search</Button>
        {!isEditAll ? (
          <Button variant="contained" color="secondary" onClick={() => setIsEditAll(true)}>Edit All</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSaveAll}>Save All</Button>
        )}

       <input
  type="checkbox"
  name="batch"
  value={batch}
  checked={batch}
  onChange={(e) => setbatch(e.target.checked)}
  id="batch"
/>

      </div>

      {/* Editable Stock Table */}
      <ReactGrid columns={columns} RowData={stockData} />
    </div>
  );
};

export default StockEdit;
