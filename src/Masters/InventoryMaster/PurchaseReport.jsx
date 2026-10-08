// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import * as XLSX from 'xlsx';
// import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

// const PurchaseReport = () => {
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
//   console.log('allowedStoreId',allowedStoreId)
//   const [searchQuery, setSearchQuery] = useState({
//     StoreLocation:allowedStoreId || '',
//     SupplierName: '',
//     GrnFromDate: '',
//     GrnToDate: '',
//     GrnInvoiceno: '',
//   });
//   console.log('searchQuery', searchQuery);
//   const [grninvoice, setGrninvoice] = useState([]);
//   const [SupplierData, setSupplierData] = useState([]);
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const dispatchvalue = useDispatch();

//   const [fetchalldata, setFetchalldata] = useState([]);
//   const today = new Date();
//   const currentDate = today.toISOString().split('T')[0];

//   const [StoreLocationData, setStoreLocationData] = useState([]);

//   useEffect(()=>{
//   if (userRecord?.location) {
//       axios.get(`${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${userRecord?.location}&forquickgrn=${false}`)
//         .then((res) => {
//           const data = res.data;
//           setStoreLocationData(Array.isArray(data) ? data : [])
//         })
//         .catch((err) => {
//           console.log(err);
//         })

//     }
//   },[UrlLink, userRecord?.location])

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Inventory/Supplier_Data_Get?ForQuickGrn=${true}`, {
//         params: {
//           SupplierName: searchQuery.SupplierName,
//         },
//       })
//       .then((res) => {
//         const data = res.data;
//         setSupplierData(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => {
//         console.log(err);
//         setSupplierData([]);
//       });
//   }, [UrlLink, searchQuery.SupplierName]);
//   // Grn_Invoice_link
//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Inventory/Grn_Invoice_link`)
//       .then((res) => {
//         setGrninvoice(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch((err) => {
//         console.log(err);
//         setGrninvoice([]);
//       });
//   }, [UrlLink]);

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     if(name==="SupplierName"){
//       setSearchQuery((prev) => ({
//         ...prev,
//         [name]: value,
//         GrnInvoiceno:''
//       }));
//     }
//     else if(name==="GrnInvoiceno"){
//       setSearchQuery((prev) => ({
//         ...prev,
//         [name]: value,
//         SupplierName:''
//       }));
//     }
//     else{
//       setSearchQuery((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
   
//   };

//   const fetchAllData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `${UrlLink}Inventory/get_Purchase_Order_Report`,
//         {
//           params: searchQuery,
//         }
//       ); 
//       const data = response.data;
//       if (Array.isArray(data)) {
//         console.log('alldata', data);
//         setFetchalldata(data);
//       } else {
//         setFetchalldata([]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }, [UrlLink, searchQuery]);

//   useEffect(() => {
//     fetchAllData();
//   }, [fetchAllData]);

// const AllItemColumn = [
//   {
//     key: 'id',
//     name: 'S.NO',
//     frozen: true,
//   },
//   {
//     key:'InvoiceDate',
//     name:'Invoice Date',
//   },
//   {
//     key:'ReceiveDate',
//     name:'Receive Date',
//   },
//   {
//     key:'Grn',
//     name:'Grn',
//   },
//   {
//     key:'Supplier',
//     name:'Supplier',
//   },
//   {
//     key:'GSTIN',
//     name:'GSTIN',
//   },
//   {
//     key:'State',
//     name:'Supplier State',
//   },
//   {
//     key:'Product',
//     name:'Product',
//   },
//   {
//     key:'HSN',
//     name:'HSN',
//   },
//   {
//     key:'Quantity',
//     name:'Quantity',
//   },
//   {
//     key:'Free',
//     name:'Free',
//   },
//   {
//     key:'ProductValueBeforeDiscount',
//     name:'ProductValueBeforeDiscount',
//   },
//   {
//     key:'Discount',
//     name:'Discount',
//   },
//   {
//     key:'ProductValue',
//     name:'Product Value',
//   },
//   {
//     key:'GST',
//     name:'GST',
//   },
//   {
//     key:'CGSTRate',
//     name:'CGSTRate',
//   },
//   {
//     key:'CGSTAmount',
//     name:'CGSTAmount',
//   },
//   {
//     key:'SGST',
//     name:'SGST',
//   },
//   {
//     key:'SGSTAmount',
//     name:'SGST Amount',
//   },
//   {
//     key:'PurchasePrice',
//     name:'Purchase Price',
//   },
//   {
//     key:'MRP',
//     name:'MRP',
//   }
  
// ]


// const fetchAndExportData = async() =>{
//   if(Array.isArray(fetchalldata) && fetchalldata.length > 0){
//     const formattedData = fetchalldata.map((item)=> ({
//       SNO:item.id,
//       InvoiceDate:item.InvoiceDate,
//       ReceiveDate:item.ReceiveDate,
//       Grn:item.Grn,
//       Supplier:item.Supplier,
//       GSTIN:item.GSTIN,
//       State:item.State,
//       Product:item.Product,
//       HSN:item.HSN,
//       Quantity:item.Quantity,
//       Free:item.Free,
//       ProductValueBeforeDiscount:item.ProductValueBeforeDiscount,
//       Discount:item.Discount,
//       ProductValue:item.ProductValue,
//       GST:item.GST,
//       CGSTRate:item.CGSTRate,
//       CGSTAmount:item.CGSTAmount,
//       SGST:item.SGST,
//       SGSTAmount:item.SGSTAmount,
//       PurchasePrice:item.PurchasePrice,
//       MRP:item.MRP


//     }));

//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(formattedData);

//     XLSX.utils.book_append_sheet(
//       workbook,
//       worksheet,
//       'Purchase GST Report'
//     );
//     XLSX.writeFile(workbook, `PurchaseGSTReport${currentDate}.xlsx`);

//   }else{
//     alert('No data available to export.');
//   }
// }
// const clearSearchdata = () =>{
//   setSearchQuery({
//     SupplierName:'',
//     GrnFromDate:'',
//     GrnToDate:'',
//     GrnInvoiceno:'',
//     StoreLocation:''
//   });
// }



//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Purchase GST Report</h3>
//         <div className="RegisFormcon_1">
//         <div className="RegisForm_1">
//             <label htmlFor="StoreLocation">Store Location<span>:</span></label>

//             <select
//               name='StoreLocation'
//               value={searchQuery.StoreLocation}
//               onChange={handleOnChange}
//             >
//               <option value=''>Select</option>
//               {StoreLocationData && StoreLocationData.length > 0 &&
//                 StoreLocationData.map((ele, ind) => (
//                   <option key={ind + 'key'} value={ele.id} >{ele.StoreName}</option>
//                 ))
//               }
//             </select>
//           </div>

//           <div className="RegisForm_1">
//             <label htmlFor="SupplierName">
//               Supplier Name<span>:</span>
//             </label>
//             <input
//               type="text"
//               name="SupplierName"
//               value={searchQuery.SupplierName}
//               list="SupplierName-options"
//               autoComplete="off"
//               onChange={handleOnChange}
//             />
//             <datalist id="SupplierName-options">
//               {SupplierData.map((ele, ind) => (
//                 <option key={ind + 'key'} value={ele.SupplierName}>
//                   {ele.SupplierName}
//                 </option>
//               ))}
//             </datalist>
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="BatchNumber">
//               Grn Invoice No<span>:</span>
//             </label>

//             <input
//               type="text"
//               name="GrnInvoiceno"
//               value={searchQuery?.GrnInvoiceno || ''}
//               list="GrnInvoiceno-options"
//               onChange={handleOnChange}
//               autoComplete="off"
//             />

//             <datalist id="GrnInvoiceno-options">
//               {(grninvoice || []).map((item) => (
//                 <option key={item.id} value={item.id}>
//                   {item.id}
//                 </option>
//               ))}
//             </datalist>
//           </div>

//           <div className="RegisForm_1">
//             <label htmlFor="GrnFromDate">
//               Grn Date From <span>:</span>
//             </label>

//             <input
//               type="date"
//               name="GrnFromDate"
//               value={searchQuery.GrnFromDate}
//               onChange={handleOnChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label htmlFor="GrnDateTo">
//               GrnDate To<span>:</span>
//             </label>
//             <input
//               type="date"
//               name="GrnToDate"
//               value={searchQuery.GrnToDate}
//               onChange={handleOnChange}
//             />
//           </div>
//           <div
//             className="RegisForm_1"
//             style={{ marginLeft: '15px', width: '100px' }}
//           >
//             <button
//               className="RegisterForm_1_btns"
//               onClick={fetchAndExportData}
//               title="File Download"
//             >
//               <BrowserUpdatedIcon />
//             </button>

//             <button
//               onClick={clearSearchdata}
//               style={{
//                 padding: '2px 8px',
//                 cursor: 'pointer',
//                 borderRadius: '5px',
//                 backgroundColor: 'black',
//                 color: 'white',
//               }}
//             >
//               Clear
//             </button>
//           </div>
//         </div>

//         {/* grid */}
//         {fetchalldata.length !== 0 && searchQuery.StoreLocation !== '' && (
//           <>
//             <div className="RegisFormcon_1 jjxjx_">
//               <ReactGrid columns={AllItemColumn} RowData={fetchalldata} />
//             </div>
//           </>
//         )}
//         <ToastAlert Message={toast.message} Type={toast.type} />
//       </div>
//     </>
//   );
// };

// export default PurchaseReport;


import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import PrintIcon from '@mui/icons-material/Print';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const PurchaseReport = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
  const [searchQuery, setSearchQuery] = useState({
    StoreLocation: allowedStoreId || '',
    SupplierName: '',
    GrnFromDate: '',
    GrnToDate: '',
    GrnInvoiceno: '',
  });
  const [grninvoice, setGrninvoice] = useState([]);
  const [SupplierData, setSupplierData] = useState([]);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();

  const [fetchalldata, setFetchalldata] = useState([]);
  const [gstTotal, setGstTotal] = useState(0);
  const [mrpTotal, setMrpTotal] = useState(0);
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  const [StoreLocationData, setStoreLocationData] = useState([]);

  useEffect(() => {
    if (userRecord?.location) {
      axios.get(`${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${userRecord?.location}&forquickgrn=${false}`)
        .then((res) => {
          const data = res.data;
          setStoreLocationData(Array.isArray(data) ? data : [])
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [UrlLink, userRecord?.location])

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/Supplier_Data_Get?ForQuickGrn=${true}`, {
        params: {
          SupplierName: searchQuery.SupplierName,
        },
      })
      .then((res) => {
        const data = res.data;
        setSupplierData(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
        setSupplierData([]);
      });
  }, [UrlLink, searchQuery.SupplierName]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/Grn_Invoice_link`)
      .then((res) => {
        setGrninvoice(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
        setGrninvoice([]);
      });
  }, [UrlLink]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "SupplierName") {
      setSearchQuery((prev) => ({
        ...prev,
        [name]: value,
        GrnInvoiceno: ''
      }));
    }
    else if (name === "GrnInvoiceno") {
      setSearchQuery((prev) => ({
        ...prev,
        [name]: value,
        SupplierName: ''
      }));
    }
    else {
      setSearchQuery((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${UrlLink}Inventory/get_Purchase_Order_Report`,
        {
          params: searchQuery,
        }
      );
      const data = response.data;
      if (Array.isArray(data)) {
        setFetchalldata(data);
        // Calculate totals
        const gstSum = data.reduce((sum, item) => sum + (parseFloat(item.CGSTAmount || 0) + parseFloat(item.SGSTAmount || 0)), 0);
        const mrpSum = data.reduce((sum, item) => sum + (parseFloat(item.MRP || 0) * parseFloat(item.Quantity || 0)), 0);
        setGstTotal(gstSum.toFixed(2));
        setMrpTotal(mrpSum.toFixed(2));
      } else {
        setFetchalldata([]);
        setGstTotal(0);
        setMrpTotal(0);
      }
    } catch (error) {
      console.log(error);
      setFetchalldata([]);
      setGstTotal(0);
      setMrpTotal(0);
    }
  }, [UrlLink, searchQuery]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const AllItemColumn = [
    {
      key: 'id',
      name: 'S.NO',
      frozen: true,
    },
    {
      key: 'InvoiceDate',
      name: 'Invoice Date',
    },
    {
      key: 'ReceiveDate',
      name: 'Receive Date',
    },
    {
      key: 'Grn',
      name: 'Grn',
    },
    {
      key: 'Supplier',
      name: 'Supplier',
    },
    {
      key: 'GSTIN',
      name: 'GSTIN',
    },
    {
      key: 'State',
      name: 'Supplier State',
    },
    {
      key: 'Product',
      name: 'Product',
    },
    {
      key: 'HSN',
      name: 'HSN',
    },
    {
      key: 'Quantity',
      name: 'Quantity',
    },
    {
      key: 'Free',
      name: 'Free',
    },
    {
      key: 'ProductValueBeforeDiscount',
      name: 'ProductValueBeforeDiscount',
    },
    {
      key: 'Discount',
      name: 'Discount',
    },
    {
      key: 'ProductValue',
      name: 'Product Value',
    },
    {
      key: 'GST',
      name: 'GST',
    },
    {
      key: 'CGSTRate',
      name: 'CGSTRate',
    },
    {
      key: 'CGSTAmount',
      name: 'CGSTAmount',
    },
    {
      key: 'SGST',
      name: 'SGST',
    },
    {
      key: 'SGSTAmount',
      name: 'SGST Amount',
    },
    {
      key: 'PurchasePrice',
      name: 'Purchase Price',
    },
    {
      key: 'MRP',
      name: 'MRP',
    }
  ]

  const fetchAndExportData = async () => {
    if (Array.isArray(fetchalldata) && fetchalldata.length > 0) {
      const formattedData = fetchalldata.map((item) => ({
        SNO: item.id,
        InvoiceDate: item.InvoiceDate,
        ReceiveDate: item.ReceiveDate,
        Grn: item.Grn,
        Supplier: item.Supplier,
        GSTIN: item.GSTIN,
        State: item.State,
        Product: item.Product,
        HSN: item.HSN,
        Quantity: item.Quantity,
        Free: item.Free,
        ProductValueBeforeDiscount: item.ProductValueBeforeDiscount,
        Discount: item.Discount,
        ProductValue: item.ProductValue,
        GST: item.GST,
        CGSTRate: item.CGSTRate,
        CGSTAmount: item.CGSTAmount,
        SGST: item.SGST,
        SGSTAmount: item.SGSTAmount,
        PurchasePrice: item.PurchasePrice,
        MRP: item.MRP
      }));

      // Add totals row to export
      formattedData.push({
        SNO: 'Total',
        CGSTAmount: '',
        SGSTAmount: '',
        MRP: `Total GST: ${gstTotal} | Total MRP: ${mrpTotal}`
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Purchase GST Report'
      );
      XLSX.writeFile(workbook, `PurchaseGSTReport${currentDate}.xlsx`);
    } else {
      alert('No data available to export.');
    }
  }

  const handlePrint = () => {
    if (!fetchalldata || fetchalldata.length === 0) {
        alert('No data to print.');
        return;
    }

    const printContent = `
        <html>
            <head>
                <title>Purchase GST Report</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 11px; }
                    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    h2 { text-align: center; }
                    .totals-container { 
                        margin-top: 20px; 
                        padding-top: 10px;
                        border-top: 2px solid #333;
                        float: right; 
                        text-align: right;
                        font-size: 14px;
                    }
                    .totals-container p { margin: 5px 0; }
                </style>
            </head>
            <body>
                <h2>Purchase GST Report</h2>
                <table>
                    <thead>
                        <tr>${AllItemColumn.map(col => `<th>${col.name}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${fetchalldata.map(item => `
                            <tr>${AllItemColumn.map(col => `<td>${item[col.key] || ''}</td>`).join('')}</tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="totals-container">
                    <p><strong>Total GST (CGST + SGST):</strong> ${gstTotal}</p>
                    <p><strong>Total MRP Value:</strong> ${mrpTotal}</p>
                </div>
            </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 500);
  }

  const clearSearchdata = () => {
    setSearchQuery({
      SupplierName: '',
      GrnFromDate: '',
      GrnToDate: '',
      GrnInvoiceno: '',
      StoreLocation: ''
    });
    setGstTotal(0);
    setMrpTotal(0);
  }

  return (
    <>
      <div className="Main_container_app">
        <h3>Purchase GST Report</h3>
        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label htmlFor="StoreLocation">Store Location<span>:</span></label>
            <select
              name='StoreLocation'
              value={searchQuery.StoreLocation}
              onChange={handleOnChange}
            >
              <option value=''>Select</option>
              {StoreLocationData && StoreLocationData.length > 0 &&
                StoreLocationData.map((ele, ind) => (
                  <option key={ind + 'key'} value={ele.id}>{ele.StoreName}</option>
                ))
              }
            </select>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="SupplierName">
              Supplier Name<span>:</span>
            </label>
            <input
              type="text"
              name="SupplierName"
              value={searchQuery.SupplierName}
              list="SupplierName-options"
              autoComplete="off"
              onChange={handleOnChange}
            />
            <datalist id="SupplierName-options">
              {SupplierData.map((ele, ind) => (
                <option key={ind + 'key'} value={ele.SupplierName}>
                  {ele.SupplierName}
                </option>
              ))}
            </datalist>
          </div>
          <div className="RegisForm_1">
            <label htmlFor="BatchNumber">
              Grn Invoice No<span>:</span>
            </label>
            <input
              type="text"
              name="GrnInvoiceno"
              value={searchQuery?.GrnInvoiceno || ''}
              list="GrnInvoiceno-options"
              onChange={handleOnChange}
              autoComplete="off"
            />
            <datalist id="GrnInvoiceno-options">
              {(grninvoice || []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}
                </option>
              ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="GrnFromDate">
              Grn Date From <span>:</span>
            </label>
            <input
              type="date"
              name="GrnFromDate"
              value={searchQuery.GrnFromDate}
              onChange={handleOnChange}
            />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="GrnDateTo">
              GrnDate To<span>:</span>
            </label>
            <input
              type="date"
              name="GrnToDate"
              value={searchQuery.GrnToDate}
              onChange={handleOnChange}
            />
          </div>
          <div
            className="RegisForm_1"
            style={{ marginLeft: '15px', width: '150px' }}
          >
            <button
              className="RegisterForm_1_btns"
              onClick={fetchAndExportData}
              title="File Download"
            >
              <BrowserUpdatedIcon />
            </button>
            <button
              className="RegisterForm_1_btns"
              onClick={handlePrint}
              title="Print Report"
              style={{ marginLeft: '10px' }}
            >
              <PrintIcon />
            </button>
            <button
              onClick={clearSearchdata}
              style={{
                padding: '2px 8px',
                cursor: 'pointer',
                borderRadius: '5px',
                backgroundColor: 'black',
                color: 'white',
                marginLeft: '10px'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {fetchalldata.length !== 0 && searchQuery.StoreLocation !== '' && (
          <>
            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid columns={AllItemColumn} RowData={fetchalldata} />
              <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                Total GST: {gstTotal} | Total MRP: {mrpTotal}
              </div>
            </div>
          </>
        )}
        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default PurchaseReport;

