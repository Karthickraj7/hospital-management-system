
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { 
  Button, TextField, Typography, FormControl, Autocomplete, 
  Checkbox, FormControlLabel, Box, Alert, Chip,
  Menu, MenuItem, Tooltip, IconButton, CircularProgress,
  Paper, InputAdornment, Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import FilterListIcon from '@mui/icons-material/FilterList';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdvanceStockEdit = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  // Check if user is host or admin
  const isHost = userRecord?.username === 'host';
  const isAdmin = userRecord?.is_admin;

  // Get active store details
  const activeStoreId = userRecord?.ActivePharmacyStoreId || '';
  const activeStoreName = userRecord?.ActivePharmacyStoreName || '';

  // States
  const [stockData, setStockData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [isEditAll, setIsEditAll] = useState(false);
  const [editedRows, setEditedRows] = useState({});
  const [selectedStore, setSelectedStore] = useState({
    id: activeStoreId,
    name: activeStoreName
  });
  const [filters, setFilters] = useState({ 
    ItemName: '', 
    Batch_No: '', 
    Store_Name: activeStoreName,
    Store_Id: activeStoreId,
    BoxName: '',
    searchText: '' // General search text
  });
  const [batchLocked, setBatchLocked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  
  // References for grid position preservation
  const gridRef = useRef(null);
  const scrollPosRef = useRef(0);
  const currentPageRef = useRef(1); // Track current grid page
  const gridStateRef = useRef({
    scrollTop: 0,
    currentPage: 1,
    selectedRowIndex: -1
  });

  // Add Product State - Initialize with active store
  const [newProduct, setNewProduct] = useState({
    Product_Id: '',
    ItemName: '',
    Store_Id: selectedStore.id,
    Batch_No: '',
    AvailableQuantity: 0,
    Current_Price: '',
    Sellable_qty_price: '',
    BoxName: '',
    Expiry_Date: ''
  });

  // Format date for display
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

// Also update the formatDateForExport function to handle empty dates better:
const formatDateForExport = (dateString) => {
  if (!dateString || dateString === '') return '';
  try {
    // Check if it's already a Date object
    if (dateString instanceof Date) {
      return dateString.toLocaleDateString('en-GB');
    }
    
    // Check if it's in ISO format or already formatted
    if (typeof dateString === 'string') {
      // If it's already in dd/mm/yyyy format, return as is
      if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return dateString;
      }
      
      // If it's in yyyy-mm-dd format
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      }
      
      // Try to parse as date
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    }
    
    return dateString.toString();
  } catch (error) {
    console.warn('Error formatting date for export:', dateString, error);
    return dateString || '';
  }
};
  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(`${UrlLink}Inventory/Store_Data_list`);
        setStoreData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setStoreData([]);
      }
    };
    fetchStores();
  }, [UrlLink]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${UrlLink}Inventory/Product_Data_list`);
        setProductData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProductData([]);
      }
    };
    fetchProducts();
  }, [UrlLink]);

  // Update selected store when active store changes
  useEffect(() => {
    if (activeStoreId && activeStoreName) {
      setSelectedStore({
        id: activeStoreId,
        name: activeStoreName
      });
    }
  }, [activeStoreId, activeStoreName]);

  // Update newProduct when selected store changes
  useEffect(() => {
    setNewProduct(prev => ({
      ...prev,
      Store_Id: selectedStore.id
    }));
  }, [selectedStore.id]);

  // Update filters when selected store changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      Store_Name: selectedStore.name,
      Store_Id: selectedStore.id
    }));
  }, [selectedStore.name, selectedStore.id]);

  // Initial fetch - load data based on user permissions
  useEffect(() => { 
    fetchStockData(); 
  }, [selectedStore.id]);

  // Fetch stock data with grid position preservation
  const fetchStockData = useCallback(async (searchFilters = null, preservePosition = true) => {
    try {
      // ✅ SAVE CURRENT GRID POSITION BEFORE FETCH
      if (preservePosition && gridRef.current) {
        gridStateRef.current = {
          scrollTop: gridRef.current.scrollTop,
          currentPage: currentPageRef.current,
          // You might want to save selected row ID if your grid supports selection
          selectedRowId: null
        };
      }

      setLoading(true);

      const filterParams = searchFilters || filters;
      const queryParams = {};

      if ((isHost || isAdmin) && selectedStore.id) {
        queryParams.Store_Id = selectedStore.id;
      } else if (!isHost && !isAdmin) {
        queryParams.Store_Id = activeStoreId;
      }

      if (filterParams.ItemName) queryParams.ItemName = filterParams.ItemName;
      if (filterParams.Batch_No) queryParams.Batch_No = filterParams.Batch_No;
      if (filterParams.BoxName) queryParams.BoxName = filterParams.BoxName;
      if (filterParams.searchText) queryParams.search = filterParams.searchText;

      if (!queryParams.Store_Id) return;

      const params = new URLSearchParams(queryParams).toString();
      const res = await axios.get(`${UrlLink}Inventory/list_stocks1?${params}`);

      if (res.data.success) {
        const formattedData = res.data.data.map(item => ({
          ...item,
          Expiry_Date: formatDateForInput(item.Expiry_Date),
          Created_at: formatDateForInput(item.Created_at),
          Update_at: formatDateForInput(item.Update_at)
        }));

        setStockData(formattedData);
      } else {
        setStockData([]);
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setStockData([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);

      // ✅ RESTORE GRID POSITION AFTER DATA LOADS
      if (preservePosition) {
        setTimeout(() => {
          if (gridRef.current) {
            // Restore scroll position
            gridRef.current.scrollTop = gridStateRef.current.scrollTop;
            
            // If your ReactGrid component supports pagination control,
            // you would need to pass the current page back to it
            currentPageRef.current = gridStateRef.current.currentPage;
            
            // You might need to trigger grid's internal page change
            // This depends on your ReactGrid implementation
          }
        }, 100); // Small delay to ensure grid is rendered
      }
    }
  }, [UrlLink, filters, selectedStore, isHost, isAdmin, activeStoreId]);

  // Inline edit handler
  const handleRowChange = (id, field, value) => {
    setEditedRows(prev => ({
      ...prev,
      [id]: { 
        ...prev[id], 
        [field]: value, 
        editedby: userRecord?.username || 'unknown' 
      }
    }));
  };

  // SILENT SAVE FUNCTION - No loading, no alerts, stays on same grid page
  const handleSaveAll = async () => {
    if (Object.keys(editedRows).length === 0) {
      return; // No changes, just return silently
    }

    try {
      const updates = Object.entries(editedRows).map(([id, changes]) => ({ 
        id, 
        ...changes 
      }));
      
      // Silent save - no loading state
      const res = await axios.post(`${UrlLink}Inventory/bulk_edit_stock`, { updates });
      
      if (res.data.success) {
        // Clear edited rows immediately
        setEditedRows({});
        setIsEditAll(false);
        
        // Set last save time for minimal feedback
        setLastSaveTime(new Date());
        
        // ✅ Refresh data SILENTLY and PRESERVE GRID POSITION
        // Pass preservePosition = true to keep current grid page/scroll
        fetchStockData(null, true);
      } else {
        // Silent error handling - just log to console
        console.error("Save error:", res.data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      // Don't show alert - just log error
    }
  };

  // Handle grid page change (if your ReactGrid supports this)
  const handleGridPageChange = (page) => {
    currentPageRef.current = page;
    gridStateRef.current.currentPage = page;
  };

  // Handle grid scroll (if you need to track it)
  const handleGridScroll = (scrollTop) => {
    gridStateRef.current.scrollTop = scrollTop;
  };

  // Apply filters with search - reset to page 1 for new searches
  const applyFilters = () => {
    // For new searches, reset to page 1
    currentPageRef.current = 1;
    fetchStockData(null, false); // Don't preserve position for new search
  };

  // Handle search by item details
  const handleSearch = () => {
    setSearchLoading(true);
    currentPageRef.current = 1; // Reset to page 1 for search
    fetchStockData(null, false);
  };

  // Clear search - reset to page 1
  const handleClearSearch = () => {
    setFilters({
      ItemName: '',
      Batch_No: '',
      Store_Name: selectedStore.name,
      Store_Id: selectedStore.id,
      BoxName: '',
      searchText: ''
    });
    currentPageRef.current = 1; // Reset to page 1
    setTimeout(() => fetchStockData(null, false), 100);
  };

  // Handle quick search (item details)
  const handleQuickSearch = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, searchText: value }));
    
    // Debounce the search
    if (searchLoading) return;
    
    setSearchLoading(true);
    currentPageRef.current = 1; // Reset to page 1 for search
    
    setTimeout(() => {
      fetchStockData({ ...filters, searchText: value }, false);
    }, 500);
  };

  // Export Menu Handlers
  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };
// Replace the exportToExcel function with this corrected version:
const exportToExcel = () => {
  try {
    if (stockData.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare data for export - use consistent formatting
    const exportData = stockData.map(item => {
      // Get the original row data (unedited values take priority)
      const originalRow = stockData.find(s => s.id === item.id);
      const editedRow = editedRows[item.id];
      
      // Combine with edited values if they exist
      const rowData = originalRow ? {
        ...originalRow,
        ...(editedRow || {})
      } : item;

      return {
        'ID': rowData.id || '',
        'Item Name': rowData.ItemName || '',
        'Batch No': rowData.Batch_No || '',
        'Available Qty': parseFloat(rowData.AvailableQuantity) || 0,
        'Sellable Price': parseFloat(rowData.Sellable_qty_price) || 0,
        'Current Price': parseFloat(rowData.Current_Price) || 0,
        'Current Qty Price': parseFloat(rowData.Current_Qunatity_Price) || 0,
        'MRP Qty Price': parseFloat(rowData.MRP_Qunatity_Price) || 0,
        'Expiry Date': formatDateForExport(rowData.Expiry_Date),
        'Box Name': rowData.BoxName || '',
        'Created by': rowData.Created_by || '',
        'Created at': formatDateForExport(rowData.Created_at),
        'Updated by': rowData.Updated_by || '',
        'Updated at': formatDateForExport(rowData.Update_at),
        'Store Name': rowData.Store_Name || ''
      };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Auto-size columns
    const maxWidth = exportData.reduce((w, r) => Math.max(w, Object.values(r).map(v => v?.toString().length || 0).reduce((a, b) => Math.max(a, b), 0)), 10);
    worksheet['!cols'] = Array(Object.keys(exportData[0] || {}).length).fill({ wch: Math.min(maxWidth + 2, 50) });
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Data');
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
    const filename = `Stock_Data_${selectedStore.name || 'All'}_${timestamp}.xlsx`;
    
    // Export to Excel
    XLSX.writeFile(workbook, filename);
    
    handleExportMenuClose();
    alert('Excel file downloaded successfully!');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Error exporting to Excel. Please check console for details.');
  }
};

// Replace the exportToPDF function with this corrected version:
const exportToPDF = () => {
  try {
    if (stockData.length === 0) {
      alert('No data to export');
      return;
    }

    // Create PDF document
    const doc = new jsPDF('landscape');
    
    // Add title
    const title = 'Stock Data Report';
    const subtitle = `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    const storeInfo = `Store: ${selectedStore.name || 'All Stores'}`;
    const searchInfo = filters.searchText ? `Search: ${filters.searchText}` : '';
    const editedInfo = Object.keys(editedRows).length > 0 ? 
      `(${Object.keys(editedRows).length} unsaved changes included)` : '';
    
    doc.setFontSize(16);
    doc.text(title, doc.internal.pageSize.width / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(subtitle, doc.internal.pageSize.width / 2, 22, { align: 'center' });
    doc.text(storeInfo, doc.internal.pageSize.width / 2, 28, { align: 'center' });
    
    if (searchInfo || editedInfo) {
      let infoY = 34;
      if (searchInfo) {
        doc.text(searchInfo, doc.internal.pageSize.width / 2, infoY, { align: 'center' });
        infoY += 6;
      }
      if (editedInfo) {
        doc.text(editedInfo, doc.internal.pageSize.width / 2, infoY, { align: 'center' });
      }
    }
    
    // Prepare table data - ensure we use consistent data
    const tableData = stockData.map(item => {
      const originalRow = stockData.find(s => s.id === item.id);
      const editedRow = editedRows[item.id];
      const rowData = originalRow ? {
        ...originalRow,
        ...(editedRow || {})
      } : item;

      return [
        rowData.id || '',
        rowData.ItemName || '',
        rowData.Batch_No || '',
        parseFloat(rowData.AvailableQuantity) || 0,
        parseFloat(rowData.Sellable_qty_price) || 0,
        parseFloat(rowData.Current_Price) || 0,
        parseFloat(rowData.Current_Qunatity_Price) || 0,
        parseFloat(rowData.MRP_Qunatity_Price) || 0,
        formatDateForExport(rowData.Expiry_Date),
        rowData.BoxName || '',
        rowData.Store_Name || '',
        rowData.Created_by || '',
        formatDateForExport(rowData.Created_at)
      ];
    });

    // Define table columns
    const tableColumns = [
      'ID',
      'Item Name',
      'Batch No',
      'Avail Qty',
      'Sell Price',
      'Curr Price',
      'Curr Qty Price',
      'MRP Qty Price',
      'Expiry Date',
      'Box Name',
      'Store Name',
      'Created By',
      'Created At'
    ];

    // Calculate startY position based on number of lines
    let startY = 35;
    if (searchInfo) startY += 6;
    if (editedInfo) startY += 6;

    // Add table to PDF
    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      startY: startY,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 20 }, // ID
        1: { cellWidth: 40 }, // Item Name
        2: { cellWidth: 30 }, // Batch No
        3: { cellWidth: 25 }, // Avail Qty
        4: { cellWidth: 25 }, // Sell Price
        5: { cellWidth: 25 }, // Curr Price
        6: { cellWidth: 30 }, // Curr Qty Price
        7: { cellWidth: 30 }, // MRP Qty Price
        8: { cellWidth: 25 }, // Expiry Date
        9: { cellWidth: 25 }, // Box Name
        10: { cellWidth: 35 }, // Store Name
        11: { cellWidth: 30 }, // Created By
        12: { cellWidth: 25 }  // Created At
      }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount} | Total Records: ${stockData.length}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
    const filename = `Stock_Report_${selectedStore.name || 'All'}_${timestamp}.pdf`;
    doc.save(filename);
    
    handleExportMenuClose();
    alert('PDF file downloaded successfully!');
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Error exporting to PDF. Please check console for details.');
  }
};

  // Export all data (bypass filters)
  const exportAllData = async (format) => {
    try {
      setLoading(true);
      // Fetch all data without filters
      const res = await axios.get(`${UrlLink}Inventory/list_stocks1`);
      
      if (res.data.success) {
        const allData = res.data.data;
        
        if (format === 'excel') {
          // Prepare data for export
          const exportData = allData.map(item => ({
            'ID': item.id,
            'Item Name': item.ItemName,
            'Batch No': item.Batch_No,
            'Available Qty': item.AvailableQuantity,
            'Sellable Price': item.Sellable_qty_price,
            'Current Price': item.Current_Price,
            'Current Qty Price': item.Current_Qunatity_Price,
            'MRP Qty Price': item.MRP_Qunatity_Price,
            'Expiry Date': formatDateForExport(item.Expiry_Date),
            'Box Name': item.BoxName,
            'Created by': item.Created_by,
            'Created at': formatDateForExport(item.Created_at),
            'Updated by': item.Updated_by,
            'Updated at': formatDateForExport(item.Update_at),
            'Store Name': item.Store_Name
          }));

          // Create worksheet
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          
          // Create workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'All Stock Data');
          
          // Generate filename
          const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
          const filename = `All_Stock_Data_${timestamp}.xlsx`;
          
          // Export to Excel
          XLSX.writeFile(workbook, filename);
          
          alert('All stock data exported to Excel successfully!');
        } else if (format === 'pdf') {
          const doc = new jsPDF('landscape');
          
          doc.setFontSize(16);
          doc.text('All Stock Data Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });
          
          doc.setFontSize(10);
          doc.text(`Generated on: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width / 2, 22, { align: 'center' });
          doc.text('All Stores', doc.internal.pageSize.width / 2, 28, { align: 'center' });
          
          const tableData = allData.map(item => [
            item.id,
            item.ItemName || '',
            item.Batch_No || '',
            item.AvailableQuantity,
            item.Sellable_qty_price,
            item.Current_Price,
            item.Current_Qunatity_Price,
            item.MRP_Qunatity_Price,
            formatDateForExport(item.Expiry_Date),
            item.BoxName || '',
            item.Store_Name || ''
          ]);

          const tableColumns = [
            'ID',
            'Item Name',
            'Batch No',
            'Available Qty',
            'Sellable Price',
            'Current Price',
            'Current Qty Price',
            'MRP Qty Price',
            'Expiry Date',
            'Box Name',
            'Store Name'
          ];

          doc.autoTable({
            head: [tableColumns],
            body: tableData,
            startY: 35,
            theme: 'grid',
            styles: { fontSize: 8 }
          });

          const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
          doc.save(`All_Stock_Report_${timestamp}.pdf`);
          
          alert('All stock data exported to PDF successfully!');
        }
      }
    } catch (error) {
      console.error('Error exporting all data:', error);
      alert('Error exporting all data');
    } finally {
      setLoading(false);
      handleExportMenuClose();
    }
  };

  // Add Product handler
  const handleAddProduct = async () => {
    // Validation
    if (!newProduct.ItemName) {
      alert("Product is required!");
      return;
    }
    
    if (!newProduct.Sellable_qty_price) {
      alert("Sellable Price is required!");
      return;
    }

    if (!newProduct.Store_Id) {
      alert("Store is required! Please select a store.");
      return;
    }

    if (newProduct.AvailableQuantity < 0) {
      alert("Available quantity cannot be negative!");
      return;
    }

    try {
      setAddingProduct(true);
      
      // Prepare data for API
      const productDataToSend = {
        ...newProduct,
        Store_Id: newProduct.Store_Id || selectedStore.id,
        AvailableQuantity: parseFloat(newProduct.AvailableQuantity) || 0,
        Current_Price: parseFloat(newProduct.Current_Price) || 0,
        Sellable_qty_price: parseFloat(newProduct.Sellable_qty_price) || 0
      };

      const res = await axios.post(`${UrlLink}Inventory/Add_Stock_Item`, productDataToSend);
      
      if (res.data.success) {
        alert(res.data.message);

        // Reset form but keep store id
        setNewProduct({
          Product_Id: '',
          ItemName: '',
          Store_Id: selectedStore.id,
          Batch_No: '',
          AvailableQuantity: 0,
          Current_Price: '',
          Sellable_qty_price: '',
          BoxName: '',
          Expiry_Date: ''
        });

        // ✅ Preserve grid position after adding product
        fetchStockData(null, true);
      } else {
        alert(res.data.error || "Failed to add product");
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert("Error adding product. Please try again.");
    } finally {
      setAddingProduct(false);
    }
  };

  // Handle store selection change
  const handleStoreChange = (event, newValue) => {
    if (newValue) {
      setSelectedStore({
        id: newValue.Store_Id,
        name: newValue.Store_Name
      });
    } else {
      // If cleared, use active store
      setSelectedStore({
        id: activeStoreId,
        name: activeStoreName
      });
    }
  };

  // Grid columns
  const columns = [
    { key: 'id', name: 'ID', width: 60 },
    { key: 'ItemName', name: 'Item Name', width: 150 },
    {
      key: 'Batch_No', 
      name: 'Batch No', 
      width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField 
          size="small" 
          style={{ width: '150px'}}
          disabled={batchLocked}
          value={editedRows[row.id]?.Batch_No ?? row.Batch_No} 
          onChange={e => handleRowChange(row.id, "Batch_No", e.target.value)} 
        />
      ) : row.Batch_No
    },
    {
      key: 'AvailableQuantity', 
      name: 'Available Qty', 
      width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField 
          type="number" 
          size="small" 
          value={editedRows[row.id]?.AvailableQuantity ?? row.AvailableQuantity} 
          onChange={e => handleRowChange(row.id, "AvailableQuantity", parseFloat(e.target.value) || 0)} 
        />
      ) : row.AvailableQuantity
    },
    {
      key: 'Sellable_qty_price', 
      name: 'Sellable Price', 
      width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField 
          type="number" 
          size="small" 
          value={editedRows[row.id]?.Sellable_qty_price ?? row.Sellable_qty_price} 
          onChange={e => handleRowChange(row.id, "Sellable_qty_price", parseFloat(e.target.value) || 0)} 
        />
      ) : row.Sellable_qty_price
    },
    {
      key: 'Current_Price', 
      name: 'Current Price', 
      width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField 
          type="number" 
          size="small" 
          value={editedRows[row.id]?.Current_Price ?? row.Current_Price} 
          onChange={e => handleRowChange(row.id, "Current_Price", parseFloat(e.target.value) || 0)} 
        />
      ) : row.Current_Price
    },
    { 
      key: 'Current_Qunatity_Price', 
      name: 'Current Qty Price', 
      width: 140, 
      renderCell: ({ row }) => row.Current_Qunatity_Price 
    },
    { 
      key: 'MRP_Qunatity_Price', 
      name: 'MRP Qty Price', 
      width: 140, 
      renderCell: ({ row }) => row.MRP_Qunatity_Price 
    },
    {
      key: 'Expiry_Date', 
      name: 'Expiry Date', 
      width: 140,
      renderCell: ({ row }) => isEditAll ? (
        <TextField 
          type="date" 
          size="small" 
          value={editedRows[row.id]?.Expiry_Date ?? row.Expiry_Date} 
          onChange={e => handleRowChange(row.id, "Expiry_Date", e.target.value)} 
          InputLabelProps={{ shrink: true }} 
        />
      ) : row.Expiry_Date
    },
    {
      key: 'BoxName', 
      name: 'Box Name', 
      width: 120,
      renderCell: ({ row }) => isEditAll ? (
        <TextField 
          size="small" 
          value={editedRows[row.id]?.BoxName ?? row.BoxName} 
          onChange={e => handleRowChange(row.id, "BoxName", e.target.value)} 
        />
      ) : row.BoxName
    },
    { key: 'Created_by', name: 'Created by', width: 150 },
    { key: 'Created_at', name: 'Created at', width: 150 },
    { key: 'Updated_by', name: 'Updated by', width: 150 },
    { key: 'Update_at', name: 'Updated at', width: 150 },
    { key: 'Store_Name', name: 'Store Name', width: 150 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Stock Management</Typography>
        
        {/* Export Button */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Export Options">
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportMenuOpen}
              disabled={stockData.length === 0}
            >
              Export
            </Button>
          </Tooltip>
          
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={handleExportMenuClose}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
              Export Current View ({stockData.length} rows)
            </Typography>
            <MenuItem onClick={exportToExcel}>
              <FileDownloadIcon sx={{ mr: 1 }} fontSize="small" />
              Export to Excel (Current View)
            </MenuItem>
            <MenuItem onClick={exportToPDF}>
              <PictureAsPdfIcon sx={{ mr: 1 }} fontSize="small" />
              Export to PDF (Current View)
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
              Export All Data
            </Typography>
            <MenuItem onClick={() => exportAllData('excel')}>
              <FileDownloadIcon sx={{ mr: 1 }} fontSize="small" />
              Export All to Excel
            </MenuItem>
            <MenuItem onClick={() => exportAllData('pdf')}>
              <PictureAsPdfIcon sx={{ mr: 1 }} fontSize="small" />
              Export All to PDF
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Store Selection Section (for host/admin) */}
      {(isHost || isAdmin) && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <StoreIcon color="primary" />
            <Typography variant="h6">Select Store Location</Typography>
            
            <Autocomplete
              size="small"
              options={storeData}
              getOptionLabel={(option) => `${option.Store_Name} (${option.Store_Type})`}
              value={storeData.find(s => s.Store_Id === selectedStore.id) || null}
              onChange={handleStoreChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Choose Store" 
                  sx={{ minWidth: 300 }}
                />
              )}
            />
            
            {selectedStore.name && (
              <Chip 
                label={`Current: ${selectedStore.name}`} 
                color="primary" 
                variant="outlined"
              />
            )}
          </Box>
        </Paper>
      )}

      {/* Active Store Info */}
      {selectedStore.name && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Chip 
              label={selectedStore.name} 
              color="primary" 
              size="small"
            />
          }
        >
          {isHost || isAdmin ? 'Selected Store:' : 'Active Store:'} {selectedStore.name}
        </Alert>
      )}

      {/* Add Product Section */}
      <Paper sx={{ 
        mb: 3, 
        p: 2,
        elevation: 2
      }}>
        <Typography variant="h6" gutterBottom>
          <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Add New Stock Item
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap', 
          alignItems: 'center',
          mt: 2 
        }}>
          {/* Product Autocomplete */}
          <Autocomplete
            size="small"
            options={productData}
            getOptionLabel={(option) => option.ItemName || ''}
            value={productData.find(p => p.Product_Id === newProduct.Product_Id) || null}
            onChange={(e, newValue) => setNewProduct({
              ...newProduct,
              Product_Id: newValue?.Product_Id || '',
              ItemName: newValue?.ItemName || ''
            })}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Product *" 
                error={!newProduct.ItemName}
              />
            )}
            sx={{ width: 220 }}
          />

          <TextField 
            label="Batch No" 
            size="small" 
            value={newProduct.Batch_No} 
            onChange={e => setNewProduct({ ...newProduct, Batch_No: e.target.value })} 
            sx={{ width: 150 }}
          />
          
          <TextField 
            label="Available Qty" 
            type="number" 
            size="small" 
            value={newProduct.AvailableQuantity} 
            onChange={e => setNewProduct({ 
              ...newProduct, 
              AvailableQuantity: parseFloat(e.target.value) || 0 
            })} 
            sx={{ width: 150 }}
          />
          
          <TextField 
            label="Current Price" 
            type="number" 
            size="small" 
            value={newProduct.Current_Price} 
            onChange={e => setNewProduct({ 
              ...newProduct, 
              Current_Price: parseFloat(e.target.value) || 0 
            })} 
            sx={{ width: 150 }}
          />
          
          <TextField 
            label="Sellable Price *" 
            type="number" 
            size="small" 
            value={newProduct.Sellable_qty_price} 
            onChange={e => setNewProduct({ 
              ...newProduct, 
              Sellable_qty_price: parseFloat(e.target.value) || 0 
            })} 
            error={!newProduct.Sellable_qty_price}
            sx={{ width: 150 }}
          />
          
          <TextField 
            type="date" 
            size="small" 
            label="Expiry Date"
            InputLabelProps={{ shrink: true }}
            value={newProduct.Expiry_Date} 
            onChange={e => setNewProduct({ ...newProduct, Expiry_Date: e.target.value })} 
            sx={{ width: 180 }}
          />
          
          <TextField 
            label="Box Name" 
            size="small" 
            value={newProduct.BoxName} 
            onChange={e => setNewProduct({ ...newProduct, BoxName: e.target.value })} 
            sx={{ width: 150 }}
          />
        
          {/* Store Autocomplete - Only editable for admin/host */}
          {(isHost || isAdmin) ? (
            <Autocomplete
              size="small"
              options={storeData}
              getOptionLabel={(option) => `${option.Store_Name} (${option.Store_Type})`}
              value={storeData.find(s => s.Store_Id === newProduct.Store_Id) || null}
              onChange={(e, newValue) => setNewProduct({ 
                ...newProduct, 
                Store_Id: newValue?.Store_Id || selectedStore.id 
              })}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Store *" 
                  error={!newProduct.Store_Id}
                />
              )}
              sx={{ width: 220 }}
            />
          ) : (
            // Display only for non-admin users
            <TextField
              size="small"
              label="Store"
              value={selectedStore.name || 'No store selected'}
              disabled
              sx={{ width: 220 }}
              helperText="Active store"
            />
          )}

          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddProduct}
            disabled={addingProduct || !newProduct.ItemName || !newProduct.Sellable_qty_price || !newProduct.Store_Id}
          >
            {addingProduct ? 'Adding...' : 'Add Product'}
          </Button>
        </Box>
        
        {/* Store Info Display */}
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Store ID: 
          </Typography>
          <Chip 
            label={newProduct.Store_Id || 'Not set'} 
            size="small" 
            variant="outlined"
          />
          {selectedStore.name && newProduct.Store_Id === selectedStore.id && (
            <Typography variant="caption" color="primary">
              (Selected Store)
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Search and Filters Section */}
      <Paper sx={{ 
        mb: 3, 
        p: 2,
        elevation: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Search & Filters
          </Typography>
          
          <Button 
            size="small" 
            onClick={() => setAdvancedSearch(!advancedSearch)}
            startIcon={<SearchIcon />}
          >
            {advancedSearch ? 'Simple Search' : 'Advanced Search'}
          </Button>
        </Box>

        {/* Quick Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by Item Name, Batch No, Box Name..."
            value={filters.searchText}
            onChange={handleQuickSearch}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchLoading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              )
            }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, ml: 1 }}>
            Search across item details while data loads
          </Typography>
        </Box>

        {/* Advanced Filters (Collapsible) */}
        {advancedSearch && (
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            border: '1px solid #e0e0e0', 
            borderRadius: 1,
            backgroundColor: '#f9f9f9'
          }}>
            <Typography variant="subtitle1" gutterBottom>Advanced Filters</Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap', 
              alignItems: 'center',
              mt: 2 
            }}>
              <TextField 
                label="Item Name" 
                value={filters.ItemName} 
                onChange={e => setFilters({ ...filters, ItemName: e.target.value })} 
                size="small" 
                sx={{ width: 200 }}
              />
              
              <TextField 
                label="Batch No" 
                value={filters.Batch_No} 
                onChange={e => setFilters({ ...filters, Batch_No: e.target.value })} 
                size="small" 
                sx={{ width: 200 }}
              />
              
              <TextField 
                label="Box Name" 
                value={filters.BoxName} 
                onChange={e => setFilters({ ...filters, BoxName: e.target.value })} 
                size="small" 
                sx={{ width: 200 }}
              />
              
              <Button variant="contained" onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? <CircularProgress size={20} /> : 'Apply Filters'}
              </Button>
              
              <Button variant="outlined" onClick={handleClearSearch}>
                Clear All
              </Button>
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap', 
          alignItems: 'center',
          mt: 3,
          pt: 2,
          borderTop: '1px solid #e0e0e0'
        }}>
          {!isEditAll ? (
            <Button variant="contained" color="secondary" onClick={() => setIsEditAll(true)}>
              Edit All Rows
            </Button>
          ) : (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSaveAll}
                disabled={Object.keys(editedRows).length === 0}
              >
                Save All Changes ({Object.keys(editedRows).length})
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => {
                  setEditedRows({});
                  setIsEditAll(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={batchLocked}
                onChange={(e) => setBatchLocked(e.target.checked)}
                name="batch-lock"
              />
            }
            label="Lock Batch No Editing"
          />

          {/* Minimal save feedback */}
          {lastSaveTime && (
            <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
              Last saved: {lastSaveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />
          
          <Typography variant="body2" color="textSecondary">
            Showing data for: <strong>{selectedStore.name || 'All Stores'}</strong>
          </Typography>
        </Box>
      </Paper>

      {/* Stock Table */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading stock data for {selectedStore.name || 'selected store'}...</Typography>
        </Box>
      ) : stockData.length === 0 ? (
        <Paper sx={{ textAlign: 'center', py: 4 }}>
          <InventoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography color="textSecondary">
            No stock data found for {selectedStore.name || 'selected store'}
          </Typography>
          {filters.searchText && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Try adjusting your search: "{filters.searchText}"
            </Typography>
          )}
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={handleClearSearch}
          >
            Clear Search & Show All
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Found {stockData.length} items {filters.searchText && `matching "${filters.searchText}"`}
              {Object.keys(editedRows).length > 0 && 
                ` | ${Object.keys(editedRows).length} unsaved changes`}
            </Typography>
            
        
            
            <Typography variant="caption" color="textSecondary">
              Store: {selectedStore.name}
            </Typography>
          </Box>
          
          <div
            ref={gridRef}
            style={{
              maxHeight: '550px',
              overflowY: 'auto'
            }}
            onScroll={(e) => handleGridScroll(e.target.scrollTop)}
          >
            <ReactGrid 
              columns={columns} 
              RowData={stockData}
            
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdvanceStockEdit;