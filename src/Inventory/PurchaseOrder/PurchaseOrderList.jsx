// import React, { useCallback, useEffect, useState } from 'react'
// import LoupeIcon from "@mui/icons-material/Loupe";
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
// import ListIcon from '@mui/icons-material/List';
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// import EditIcon from "@mui/icons-material/Edit";
// import Button from "@mui/material/Button";
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
// import * as XLSX from "xlsx";
// import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';



// const PurchaseOrderList = () => {



//   const navigate = useNavigate();

//   const dispatchvalue = useDispatch();

//   const today = new Date();
//   const currentDate = today.toISOString().split('T')[0];
//   const UserData = useSelector((state) => state.userRecord?.UserData);
//   const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//   const toast = useSelector(state => state.userRecord?.toast);

//   const [PurchaseOrderList, setPurchaseOrderList] = useState([])

//   const [supplierArray, setsupplierArray] = useState([])

//   const [LocationData, setLocationData] = useState([]);

//   const [Itemlist, setItemlist] = useState([])

//   const [selectRoom, setselectRoom] = useState(false);

   
//   const [SerchOptions, setSerchOptions] = useState({
//     StatusCheck: '',
//     DateType: '',
//     CurrentDate: currentDate,
//     FromDate: '',
//     ToDate: '',
//     SupplierId: '',
//     SupplierName: '',
//     BillingLocation: '',
//     ShippingLocation: '',
//   })



//   const getPOdata = useCallback(() => {

//     axios.get(`${UrlLink}Inventory/PurchaseOrder_Report_Details`, { params: SerchOptions })
//       .then((res) => {
//         console.log('--ooo---', res.data);
//         let Rdata = res.data
//         if (Array.isArray(Rdata) && Rdata.length !== 0) {
//           setPurchaseOrderList(Rdata)
//         }
//         else {
//           setPurchaseOrderList([])
//         }

//       })
//       .catch((err) => {
//         console.log(err);

//       })

//   }, [UrlLink, SerchOptions])


// const accessList = UserData.AccessTwo?.split(',') || [];


//   useEffect(() => {

//     axios.get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
//       .then((res) => {
//         console.log('pppp----', res.data);
//         let Rdata = res.data
//         if (Array.isArray(Rdata)) {
//           setsupplierArray(Rdata)

//         }
//       })
//       .catch((err) => {
//         console.log(err);

//       })


//     axios.get(`${UrlLink}Masters/Location_Detials_link`)
//       .then((res) => {
//         const ress = res.data
//         setLocationData(ress)
//       })
//       .catch((err) => {
//         console.log(err);
//       })


//   }, [UrlLink])



//   useEffect(() => {
//     getPOdata()
//   }, [getPOdata])







//   const handleNewMaster = () => {
//     dispatchvalue({ type: 'PurchaseOrderList', value: {} });
//     navigate("/Home/InventoryMaster");
//     dispatchvalue({ type: "HrFolder", value: "PurchaseOrder" });
//     dispatchvalue({ type: "setPreviousFolder", value: null }); 
//     dispatchvalue({ type: "showMenu", value: true });
//     // navigate('/Home/PurchaseOrder');
//   };



//   const ItemView = (row) => {

//     let Item = row.Item_Details

//     if (Item && Item.length !== 0) {
//       setselectRoom(true)
//       setItemlist(Item)
//     }
//     else {

//       const tdata = {
//         message: 'There is no data to view.',
//         type: 'warn'
//       };
//       dispatchvalue({ type: 'toast', value: tdata });

//     }

//   }


//   const HandelEditdata = (row) => {

//     dispatchvalue({ type: 'PurchaseOrderList', value: row });
//     // navigate('/Home/PurchaseOrder');
//     navigate("/Home/InventoryMaster");
//     dispatchvalue({ type: "HrFolder", value: "PurchaseOrder" });
//     dispatchvalue({ type: "setPreviousFolder", value: null }); 
//     dispatchvalue({ type: "showMenu", value: true });

//   }


//   const HandelApprovedata = (row) => {

//     const POconfirm = window.confirm('Are You Sure You Want to Approve the Purchase Order?');

//     if (POconfirm) {

//       let Senddata = {
//         EditStatus: 'Waiting For GRN',
//         PurchaseOrderNumber: row.id,
//       }

//       axios.post(`${UrlLink}Inventory/PurchaseOrder_Link`, Senddata)
//         .then((res) => {
//           console.log(res.data);

//           let resdata = res.data
//           let type = Object.keys(resdata)[0]
//           let mess = Object.values(resdata)[0]
//           const tdata = {
//             message: mess,
//             type: type,
//           }
//           dispatchvalue({ type: 'toast', value: tdata });
//           getPOdata()
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     }

//   }



//   const HandelRemovedata = (row) => {


//     const POconfirm = window.confirm('Are You Sure You Want to Cancel the Purchase Order?');

//     if (POconfirm) {

//       let Senddata = {
//         EditStatus: 'Cancelled',
//         PurchaseOrderNumber: row.id,
//       }

//       axios.post(`${UrlLink}Inventory/PurchaseOrder_Link`, Senddata)
//         .then((res) => {
//           console.log(res.data);

//           let resdata = res.data
//           let type = Object.keys(resdata)[0]
//           let mess = Object.values(resdata)[0]
//           const tdata = {
//             message: mess,
//             type: type,
//           }
//           dispatchvalue({ type: 'toast', value: tdata });
//           getPOdata()
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     }

//   }





//   const HandelGoToGrn = (row) => {
//     dispatchvalue({ type: 'GoodsReceiptNoteList', value: row });
//     // navigate('/Home/GoodsReceiptNote');
//     navigate("/Home/InventoryMaster");
//     dispatchvalue({ type: "HrFolder", value: "GoodsReceiptNote" });
//     dispatchvalue({ type: "setPreviousFolder", value: null }); 
//     dispatchvalue({ type: "showMenu", value: true });



//   }

//   const PurchaseOrderColumn = [
//     {
//       key: 'id',
//       name: 'P.O.Number',
//       frozen: true
//     },{
//       key: 'SupplierName',
//       name: 'Supplier Name',
//       frozen: true
//     }, {
//       key: 'OrderDate',
//       name: 'Order Date',
//       frozen: true,
//       renderCell: (params) => {
//         const date = new Date(params.row.OrderDate);
//         const formattedDate = date.toLocaleDateString('en-GB');
//         return <>{formattedDate}</>;
//       }
//     },
//     {
//       key: 'DeliveryExpectedDate',
//       name: 'Delivery Date',
//       frozen: true,
//       renderCell: (params) => {
//         const date = new Date(params.row.DeliveryExpectedDate);
//         const formattedDate = date.toLocaleDateString('en-GB');
//         return <>{formattedDate}</>;
//       }
//     }, {
//       key: 'Item_Details',
//       name: 'Item Details',
//       renderCell: (params) => (
//         <>
//           <Button className="cell_btn"
//             onClick={() => ItemView(params.row)}
//           >
//             <ListIcon className="check_box_clrr_cancell" />
//           </Button>
//         </>
//       )
//     }, {
//       key: 'SupplierMailId',
//       name: 'Supplier MailId',

//     }, {
//       key: 'SupplierContactNumber',
//       name: 'Contact Number',

//     }, 

//     // {
//     //   key: 'Use_BillingLocation',
//     //   name: 'Billing Location',
//     // },
//     //  {
//     //   key: 'Use_ShippingLocation',
//     //   name: 'Shipping Location',
//     // }, 
//     {
//       key: 'TotalOrderValue',
//       name: 'Total Order Value',
//     },
//     {
//       key: 'PO_Status',
//       name: 'Status',
//     },
//     {
//       key: 'Edit',
//       name: 'Edit',
//       renderCell: (params) => (
//         <>
//           {params.row.PO_Status === 'Waiting For Approve' ?
//             <Button className="cell_btn"
//               onClick={() => HandelEditdata(params.row)}
//             >
//               <EditIcon className="check_box_clrr_cancell" />
//             </Button> :
//             <>No Action</>}
//         </>
//       )
//     },

//     {
//       key: 'Action',
//       name: 'Action',
//       renderCell: (params) => (
//         <>
//           {params.row.PO_Status === 'Waiting For Approve' ? (
//             <>
//               <Button
//                 className="cell_btn"
//                 onClick={() => HandelApprovedata(params.row)}
//                 disabled={!accessList.includes('P16-37')}
//               >
//                 <CheckCircleOutlineIcon
//                   className={
//                     accessList.includes('P16-37')
//                       ? 'check_box_clrr_cancell'
//                       : 'check_box_disabled'
//                   }
//                 />
//               </Button>
//               <Button
//                 className="cell_btn"
//                 onClick={() => HandelRemovedata(params.row)}
//               >
//                 <DeleteSweepIcon className="check_box_clrr_cancell" />
//               </Button>
//             </>
//           ) : params.row.PO_Status === 'Waiting For GRN' ? (
//             <Button className="cell_btn" onClick={() => HandelGoToGrn(params.row)}>
//               <span style={{ color: 'blue' }}>Go To GRN</span>
//             </Button>
//           ) : (
//             <Button className="cell_btn">No Action</Button>
//           )}
//         </>
//       )
//     },
//     {
//   key: 'Export',
//   name: 'Export',
//   renderCell: (params) => (
//     <Button
//       className="cell_btn"
//       onClick={() => exportPOToExcel(params.row)}
//     >
//     <BrowserUpdatedIcon/>
//     </Button>
//   )
// }

    
//     // {
//     //   key: 'Action',
//     //   name: 'Action',
//     //   renderCell: (params) => (
//     //     <>
//     //       {params.row.PO_Status === 'Waiting For Approve' ?
//     //         <>
//     //           <Button className="cell_btn"
//     //             onClick={() => HandelApprovedata(params.row)}
//     //           >
//     //             <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
//     //           </Button>
//     //           <Button className="cell_btn"
//     //             onClick={() => HandelRemovedata(params.row)}
//     //           >
//     //             <DeleteSweepIcon className="check_box_clrr_cancell" />
//     //           </Button>
//     //         </> :
//     //         params.row.PO_Status === 'Waiting For GRN' ?
//     //           <Button className="cell_btn"
//     //             onClick={() => HandelGoToGrn(params.row)}
//     //           >
//     //             <span style={{ color: 'blue' }}>Go To GRN</span>
//     //           </Button>
//     //           :
//     //           <Button className="cell_btn">
//     //             No Action
//     //           </Button>}
//     //     </>
//     //   )
//     // }
//   ]


//   const ItemColumn = [
//     {
//       key: 'id',
//       name: 'S.No',
//       frozen: true
//     },
   
//     {
//       key: 'ItemName',
//       name: 'Item Name',
//       frozen: true
//     },
//     {
//       key: 'ProductCategory',
//       name: 'Product Category',
//       frozen: true
//     },
//     {
//       key: 'GenericName',
//       name: 'Generic Name'
//     },
//     {
//       key: 'ManufacturerName',
//       name: 'Manufacturer Name'
//     },
//     // {
//     //   key: 'HSNCode',
//     //   name: 'HSN Code'
//     // },
//     // {
//     //   key: 'Strength',
//     //   name: 'Strength'
//     // },
//     // {
//     //   key: 'StrengthType',
//     //   name: 'StrengthType'
//     // },
//     // {
//     //   key: 'Volume',
//     //   name: 'Volume',
//     // },
//     // {
//     //   key: 'VolumeType',
//     //   name: 'Volume Type',
//     // },
//     {
//       key: 'PackType',
//       name: 'Pack Type',
//     },
//     {
//       key: 'PackQty',
//       name: 'Pack Qty',
//     },
//     {
//       key: 'MRP',
//       name: 'MRP'
//     },
//     {
//       key: 'PurchaseRateBeforeGST',
//       name: 'Purchase Rate Before GST'
//     },
//     {
//       key: 'GST',
//       name: 'GST'
//     },
//     {
//       key: 'PurchaseRateAfterGST',
//       name: 'Purchase Rate After GST'
//     },
//     {
//       key: 'PurchaseQty',
//       name: 'Purchase Qty'
//     },
//     {
//       key: 'TotalAmount',
//       name: 'Total Amount'
//     },
//     {
//       key: 'Received_Qty',
//       name: 'Received Qty'
//     },
//     {
//       key: 'Balance_Qty',
//       name: 'Balance Qty'
//     },
//     {
//       key: 'Reason',
//       name: 'Reason'
//     },
//     {
//       key: 'Item_Status',
//       name: 'Status',
//     }
//   ]

//   const Handeleonchange = (e) => {

//     const { name, value } = e.target

//     if (name === 'SupplierId') {

//       let Finddata = supplierArray.find((ele) => ele.id === value)
//       if (Finddata) {
//         setSerchOptions((prev) => ({
//           ...prev,
//           [name]: value,
//           SupplierName: Finddata.SupplierName,
//         }))
//       }
//       else {
//         setSerchOptions((prev) => ({
//           ...prev,
//           [name]: value,
//           SupplierName: '',

//         }))
//       }
//     }
//     if (name === 'SupplierName') {

//       let Finddata = supplierArray.find((ele) => ele.SupplierName === value)
//       if (Finddata) {
//         setSerchOptions((prev) => ({
//           ...prev,
//           [name]: value,
//           SupplierId: Finddata.id,
//         }))
//       }
//       else {
//         setSerchOptions((prev) => ({
//           ...prev,
//           [name]: value,
//           SupplierId: '',

//         }))
//       }
//     }
//     else {
//       setSerchOptions((prev) => ({
//         ...prev,
//         [name]: value

//       }))
//     }


//   }



//   // Export PO to Excel (Items + Quantity + Supplier)
// const exportPOToExcel = (row) => {
//   if (!row.Item_Details || row.Item_Details.length === 0) {
//     const tdata = { message: "No items to export", type: "warn" };
//     dispatchvalue({ type: "toast", value: tdata });
//     return;
//   }

//   // Map only the fields you need
//   const exportData = row.Item_Details.map((item) => ({
//     Product: item.ItemName,
//     Quantity: item.PurchaseQty,
//     Supplier: row.SupplierName,
//   }));

//   // Convert JSON to worksheet
//   const worksheet = XLSX.utils.json_to_sheet(exportData);

//   // Create workbook and append sheet
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "PO_Items");

//   // Download file
//   XLSX.writeFile(workbook, `PO_${row.id}.xlsx`);
// };

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Purchase Order List</h3>
//         <br />
//         <div className="RegisFormcon_1">
//           <div className="RegisForm_1">
//             <label>Status<span>:</span></label>

//             <select
//               name='StatusCheck'
//               value={SerchOptions.StatusCheck}
//               onChange={Handeleonchange}
//             >
//               <option value=''>Select</option>
//               <option value='Waiting For Approve'>Waiting For Approve</option>
//               <option value='Waiting For GRN'>Waiting For GRN</option>
//               <option value='GRN Compleated'>GRN Compleated</option>
//               <option value='Cancelled'>Cancelled</option>

//             </select>
//           </div>

//           <div className="RegisForm_1">
//             <label>Date Type<span>:</span></label>
//             <select
//               name='DateType'
//               value={SerchOptions.DateType}
//               onChange={Handeleonchange}
//             >
//               <option value=''>Select</option>
//               <option value='CurrentDate'>Current Date</option>
//               <option value='Customize'>Customize</option>
//             </select>
//           </div>

//           {SerchOptions.DateType === 'CurrentDate' ?
//             <div className="RegisForm_1">
//               <label>Current Date<span>:</span></label>
//               <input
//                 type='date'
//                 name='CurrentDate'
//                 value={SerchOptions.CurrentDate}
//                 onChange={Handeleonchange}
//                 readOnly
//               />

//             </div>
//             :
//             <>
//               <div className="RegisForm_1">
//                 <label>From Date<span>:</span></label>
//                 <input
//                   type='date'
//                   name='FromDate'
//                   value={SerchOptions.FromDate}
//                   onChange={Handeleonchange}
//                 />

//               </div>


//               <div className="RegisForm_1">
//                 <label>To Date<span>:</span></label>
//                 <input
//                   type='date'
//                   name='ToDate'
//                   value={SerchOptions.ToDate}
//                   onChange={Handeleonchange}
//                   min={SerchOptions.FromDate}
//                 />

//               </div>
//             </>}

//           <div className="RegisForm_1">
//             <label>Supplier Id<span>:</span></label>
//             <input
//               type='text'
//               name='SupplierId'
//               value={SerchOptions.SupplierId}
//               onChange={Handeleonchange}
//               list='SupplierIdList'
//             />
//             <datalist id='SupplierIdList'>
//               {
//                 supplierArray.map((ele, ind) => (
//                   <option key={ind + 'key'} value={ele.id} ></option>
//                 ))

//               }
//             </datalist>

//           </div>


//           <div className="RegisForm_1">
//             <label>Supplier Name<span>:</span></label>
//             <input
//               type='text'
//               name='SupplierName'
//               value={SerchOptions.SupplierName}
//               onChange={Handeleonchange}
//               list='SupplierNameList'
//             />
//             <datalist id='SupplierNameList'>
//               {
//                 supplierArray.map((ele, ind) => (
//                   <option key={ind + 'key'} value={ele.SupplierName} ></option>
//                 ))
//               }
//             </datalist>

//           </div>

//           <div className="RegisForm_1">
//             <label>Billing Location<span>:</span></label>
//             <select
//               id='BillingLocation'
//               name='BillingLocation'
//               value={SerchOptions.BillingLocation}
//               onChange={Handeleonchange}
//             >
//               <option value=''>Select</option>
//               {

//                 LocationData.map((ele, ind) => (
//                   <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
//                 ))

//               }
//             </select>
//           </div>

//           <div className="RegisForm_1">
//             <label>Shipping Location<span>:</span></label>
//             <select
//               id='ShippingLocation'
//               name='ShippingLocation'
//               value={SerchOptions.ShippingLocation}
//               onChange={Handeleonchange}
//             >
//               <option value=''>Select</option>
//               {
//                 LocationData.map((ele, ind) => (
//                   <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
//                 ))

//               }
//             </select>
//           </div>

//           <button
//             className="search_div_bar_btn_1"
//             onClick={handleNewMaster}
//             title="New Doctor Register"
//           >
//             <LoupeIcon />
//           </button>
//         </div>

//         <br />

//         <ReactGrid columns={PurchaseOrderColumn} RowData={PurchaseOrderList} />


//       </div>
//       <ToastAlert Message={toast.message} Type={toast.type} />


//       {selectRoom && Itemlist.length !== 0 && (
//         <div className="loader" onClick={() => setselectRoom(false)}>
//           <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
//             <br />

//             <div className="common_center_tag">
//               <span>Item Details</span>
//             </div>
//             <br />
//             <br />

//             <ReactGrid columns={ItemColumn} RowData={Itemlist} />
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default PurchaseOrderList;


import React, { useCallback, useEffect, useState } from "react";
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ListIcon from "@mui/icons-material/List";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import PrintIcon from "@mui/icons-material/Print";
import * as XLSX from "xlsx";
import DescriptionIcon from "@mui/icons-material/Description";

const PurchaseOrderList = () => {
  const navigate = useNavigate();

  const dispatchvalue = useDispatch();

  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);

  const [PurchaseOrderList, setPurchaseOrderList] = useState([]);

  const [supplierArray, setsupplierArray] = useState([]);

  const [LocationData, setLocationData] = useState([]);

  const [Itemlist, setItemlist] = useState([]);

  const [selectRoom, setselectRoom] = useState(false);
  const [SerchOptions, setSerchOptions] = useState({
    StatusCheck: "",
    DateType: "",
    CurrentDate: currentDate,
    FromDate: "",
    ToDate: "",
    SupplierId: "",
    SupplierName: "",
    BillingLocation: "",
    ShippingLocation: "",
  });

  const [isPrinting, setIsPrinting] = useState(false);
  const getPOdata = useCallback(() => {
    axios
      .get(`${UrlLink}Inventory/PurchaseOrder_Report_Details`, {
        params: SerchOptions,
      })
      .then((res) => {
        console.log("--ooo---", res.data);
        let Rdata = res.data;
        if (Array.isArray(Rdata) && Rdata.length !== 0) {
          setPurchaseOrderList(Rdata);
        } else {
          setPurchaseOrderList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, SerchOptions]);

  const accessList = UserData.AccessTwo?.split(",") || [];

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
      .then((res) => {
        console.log("pppp----", res.data);
        let Rdata = res.data;
        if (Array.isArray(Rdata)) {
          setsupplierArray(Rdata);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data;
        setLocationData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    getPOdata();
  }, [getPOdata]);

  const handleNewMaster = () => {
    dispatchvalue({ type: "PurchaseOrderList", value: {} });
    navigate("/Home/InventoryMaster");
    dispatchvalue({ type: "HrFolder", value: "PurchaseOrder" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
    // navigate('/Home/PurchaseOrder');
  };

  const ItemView = (row) => {
    let Item = row.Item_Details;

    if (Item && Item.length !== 0) {
      setselectRoom(true);
      setItemlist(Item);
    } else {
      const tdata = {
        message: "There is no data to view.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const HandelEditdata = (row) => {
    dispatchvalue({ type: "PurchaseOrderList", value: row });
    // navigate('/Home/PurchaseOrder');
    navigate("/Home/InventoryMaster");
    dispatchvalue({ type: "HrFolder", value: "PurchaseOrder" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const HandelApprovedata = (row) => {
    const POconfirm = window.confirm(
      "Are You Sure You Want to Approve the Purchase Order?"
    );

    if (POconfirm) {
      let Senddata = {
        EditStatus: "Waiting For GRN",
        PurchaseOrderNumber: row.id,
      };

      axios
        .post(`${UrlLink}Inventory/PurchaseOrder_Link`, Senddata)
        .then((res) => {
          console.log(res.data);

          let resdata = res.data;
          let type = Object.keys(resdata)[0];
          let mess = Object.values(resdata)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          getPOdata();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const HandelRemovedata = (row) => {
    const POconfirm = window.confirm(
      "Are You Sure You Want to Cancel the Purchase Order?"
    );

    if (POconfirm) {
      let Senddata = {
        EditStatus: "Cancelled",
        PurchaseOrderNumber: row.id,
      };

      axios
        .post(`${UrlLink}Inventory/PurchaseOrder_Link`, Senddata)
        .then((res) => {
          console.log(res.data);

          let resdata = res.data;
          let type = Object.keys(resdata)[0];
          let mess = Object.values(resdata)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          getPOdata();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const HandelGoToGrn = (row) => {
    dispatchvalue({ type: "GoodsReceiptNoteList", value: row });
    // navigate('/Home/GoodsReceiptNote');
    navigate("/Home/InventoryMaster");
    dispatchvalue({ type: "HrFolder", value: "GoodsReceiptNote" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  const PurchaseOrderColumn = [
    {
      key: "id",
      name: "P.O.Number",
      frozen: true,
    },
    {
      key: "SupplierName",
      name: "Supplier Name",
      frozen: true,
    },
    {
      key: "OrderDate",
      name: "Order Date",
      frozen: true,
      renderCell: (params) => {
        const date = new Date(params.row.OrderDate);
        const formattedDate = date.toLocaleDateString("en-GB");
        return <>{formattedDate}</>;
      },
    },
    {
      key: "DeliveryExpectedDate",
      name: "Delivery Date",
      frozen: true,
      renderCell: (params) => {
        const date = new Date(params.row.DeliveryExpectedDate);
        const formattedDate = date.toLocaleDateString("en-GB");
        return <>{formattedDate}</>;
      },
    },
    {
      key: "Item_Details",
      name: "Item Details",
      renderCell: (params) => (
        <>
          <Button className="cell_btn" onClick={() => ItemView(params.row)}>
            <ListIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
    {
      key: "SupplierMailId",
      name: "Supplier MailId",
    },
    {
      key: "SupplierContactNumber",
      name: "Contact Number",
    },

    // {
    //   key: 'Use_BillingLocation',
    //   name: 'Billing Location',
    // },
    //  {
    //   key: 'Use_ShippingLocation',
    //   name: 'Shipping Location',
    // },
    {
      key: "TotalOrderValue",
      name: "Total Order Value",
    },
    {
      key: "PO_Status",
      name: "Status",
    },
    {
      key: "Edit",
      name: "Edit",
      renderCell: (params) => (
        <>
          {params.row.PO_Status === "Waiting For Approve" ? (
            <Button
              className="cell_btn"
              onClick={() => HandelEditdata(params.row)}
            >
              <EditIcon className="check_box_clrr_cancell" />
            </Button>
          ) : (
            <>No Action</>
          )}
        </>
      ),
    },

    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          {params.row.PO_Status === "Waiting For Approve" ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => HandelApprovedata(params.row)}
                disabled={!accessList.includes("P16-37")}
              >
                <CheckCircleOutlineIcon
                  className={
                    accessList.includes("P16-37")
                      ? "check_box_clrr_cancell"
                      : "check_box_disabled"
                  }
                />
              </Button>
              <Button
                className="cell_btn"
                onClick={() => HandelRemovedata(params.row)}
              >
                <DeleteSweepIcon className="check_box_clrr_cancell" />
              </Button>
            </>
          ) : params.row.PO_Status === "Waiting For GRN" ? (
            <Button
              className="cell_btn"
              onClick={() => HandelGoToGrn(params.row)}
            >
              <span style={{ color: "blue" }}>Go To GRN</span>
            </Button>
          ) : (
            <Button className="cell_btn">No Action</Button>
          )}
        </>
      ),
    },

    // {
    //   key: 'Action',
    //   name: 'Action',
    //   renderCell: (params) => (
    //     <>
    //       {params.row.PO_Status === 'Waiting For Approve' ?
    //         <>
    //           <Button className="cell_btn"
    //             onClick={() => HandelApprovedata(params.row)}
    //           >
    //             <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
    //           </Button>
    //           <Button className="cell_btn"
    //             onClick={() => HandelRemovedata(params.row)}
    //           >
    //             <DeleteSweepIcon className="check_box_clrr_cancell" />
    //           </Button>
    //         </> :
    //         params.row.PO_Status === 'Waiting For GRN' ?
    //           <Button className="cell_btn"
    //             onClick={() => HandelGoToGrn(params.row)}
    //           >
    //             <span style={{ color: 'blue' }}>Go To GRN</span>
    //           </Button>
    //           :
    //           <Button className="cell_btn">
    //             No Action
    //           </Button>}
    //     </>
    //   )
    // }
  ];

  const ItemColumn = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },

    {
      key: "ItemName",
      name: "Item Name",
      frozen: true,
    },
    {
      key: "ProductCategory",
      name: "Product Category",
      frozen: true,
    },
    {
      key: "GenericName",
      name: "Generic Name",
    },
    {
      key: "ManufacturerName",
      name: "Manufacturer Name",
    },
    // {
    //   key: 'HSNCode',
    //   name: 'HSN Code'
    // },
    // {
    //   key: 'Strength',
    //   name: 'Strength'
    // },
    // {
    //   key: 'StrengthType',
    //   name: 'StrengthType'
    // },
    // {
    //   key: 'Volume',
    //   name: 'Volume',
    // },
    // {
    //   key: 'VolumeType',
    //   name: 'Volume Type',
    // },
    {
      key: "PackType",
      name: "Pack Type",
    },
    {
      key: "PackQty",
      name: "Pack Qty",
    },
    {
      key: "MRP",
      name: "MRP",
    },
    {
      key: "PurchaseRateBeforeGST",
      name: "Purchase Rate Before GST",
    },
    {
      key: "GST",
      name: "GST",
    },
    {
      key: "PurchaseRateAfterGST",
      name: "Purchase Rate After GST",
    },
    {
      key: "PurchaseQty",
      name: "Purchase Qty",
    },
    {
      key: "TotalAmount",
      name: "Total Amount",
    },
    {
      key: "Received_Qty",
      name: "Received Qty",
    },
    {
      key: "Balance_Qty",
      name: "Balance Qty",
    },
    // {
    //   key: 'Reason',
    //   name: 'Reason'
    // },
    {
      key: "Item_Status",
      name: "Status",
    },
  ];

  const Handeleonchange = (e) => {
    const { name, value } = e.target;

    if (name === "SupplierId") {
      let Finddata = supplierArray.find((ele) => ele.id === value);
      if (Finddata) {
        setSerchOptions((prev) => ({
          ...prev,
          [name]: value,
          SupplierName: Finddata.SupplierName,
        }));
      } else {
        setSerchOptions((prev) => ({
          ...prev,
          [name]: value,
          SupplierName: "",
        }));
      }
    }
    if (name === "SupplierName") {
      let Finddata = supplierArray.find((ele) => ele.SupplierName === value);
      if (Finddata) {
        setSerchOptions((prev) => ({
          ...prev,
          [name]: value,
          SupplierId: Finddata.id,
        }));
      } else {
        setSerchOptions((prev) => ({
          ...prev,
          [name]: value,
          SupplierId: "",
        }));
      }
    } else {
      setSerchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePrintAllPOs = () => {
    if (!PurchaseOrderList || PurchaseOrderList.length === 0) {
      dispatchvalue({
        type: "toast",
        value: { message: "No Purchase Orders to print.", type: "warn" },
      });
      return;
    }

    setIsPrinting(true);

    let reportHTML = ""; // No main heading

    PurchaseOrderList.forEach((po) => {
      reportHTML += `
            <div class="po-section">
                <h2>PO Number: ${po.id}</h2>
                <p>
                    <strong>Supplier:</strong> ${po.SupplierName || "N/A"} | 
                    <strong>Order Date:</strong> ${new Date(
                      po.OrderDate
                    ).toLocaleDateString("en-GB")} | 
                    <strong>Delivery Date:</strong> ${new Date(
                      po.DeliveryDate
                    ).toLocaleDateString("en-GB")} |
                    <strong>Status:</strong> ${po.PO_Status}
                </p>
                
                <h3>Item Details</h3>
                ${
                  po.Item_Details && po.Item_Details.length > 0
                    ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Pack</th>
                                <th>MRP</th>
                                <th>Rate</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${po.Item_Details.map(
                              (item) => `
                                <tr>
                                    <td>${item.ItemCode || ""}</td>
                                    <td>${item.ItemName || ""}</td>
                                    <td>${item.PurchasePack || ""}</td>
                                    <td>${item.MRP || "0.00"}</td>
                                    <td>${
                                      item.PurchaseRateAfterGST || "0.00"
                                    }</td>
                                    <td>${item.PurchaseQty || 0}</td>
                                    <td>${item.TotalAmount || "0.00"}</td>
                                </tr>
                            `
                            ).join("")}
                        </tbody>
                    </table>
                    <p style="text-align: right; font-weight: bold; margin-top: 10px;">
                        Total Order Value: ${po.TotalOrderValue || "0.00"}
                    </p>
                `
                    : "<p>No items found for this order.</p>"
                }
            </div>
        `;
    });

    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Purchase Order Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width:100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2, h3, p { margin: 8px 0; }
            .po-section { 
                page-break-inside: avoid; 
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 15px;
                margin-bottom: 20px;
            }
          </style>
        </head>
        <body>${reportHTML}</body>
      </html>`);
    newWin.document.close();
    setTimeout(() => {
      newWin.focus();
      newWin.print();
      newWin.close();
      setIsPrinting(false);
    }, 500);
  };

  const handleExportExcel = () => {
    if (!PurchaseOrderList || PurchaseOrderList.length === 0) {
      dispatchvalue({
        type: "toast",
        value: { message: "No data to export.", type: "warn" },
      });
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // Define headers for the item table
    const itemHeaders = [
      "S.No",
      "Item Name",
      "Generic Name",
      "Manufacturer",
      "Pack Type",
      "Pack Qty",
      "MRP",
      "Rate (After GST)",
      "Purchase Qty",
      "Total Amount",
      "Received Qty",
      "Balance Qty",
    ];

    PurchaseOrderList.forEach((po) => {
      // Add space before each new PO section
      ws_data.push([]);

      // Add PO Header information in a structured way
      ws_data.push(["PO Number:", po.id, "", "Supplier:", po.SupplierName]);
      ws_data.push([
        "Order Date:",
        new Date(po.OrderDate).toLocaleDateString("en-GB"),
        "",
        "Delivery Date:",
        new Date(po.DeliveryExpectedDate).toLocaleDateString("en-GB"),
      ]);
      ws_data.push([
        "Status:",
        po.PO_Status,
        "",
        "Total Order Value:",
        po.TotalOrderValue,
      ]);

      // Add space before the item table
      ws_data.push([]);

      // Add the item table headers
      ws_data.push(itemHeaders);

      // Add item data rows
      if (po.Item_Details && po.Item_Details.length > 0) {
        po.Item_Details.forEach((item, index) => {
          ws_data.push([
            index + 1,
            item.ItemName || "",
            item.GenericName || "",
            item.ManufacturerName || "",
            item.PackType || "",
            item.PackQty || 0,
            item.MRP || 0,
            item.PurchaseRateAfterGST || 0,
            item.PurchaseQty || 0,
            item.TotalAmount || 0,
            item.Received_Qty || 0,
            item.Balance_Qty || 0,
          ]);
        });
      } else {
        ws_data.push(["No items found for this order."]); // This will be merged later
      }
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Optional: Auto-fit column widths for better readability
    const columnWidths = [
      { wch: 8 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    ws["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Purchase Orders");
    XLSX.writeFile(wb, "PurchaseOrders_Report.xlsx");
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Purchase Order List</h3>
        <br />
        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>
              Status<span>:</span>
            </label>

            <select
              name="StatusCheck"
              value={SerchOptions.StatusCheck}
              onChange={Handeleonchange}
            >
              <option value="">Select</option>
              <option value="Waiting For Approve">Waiting For Approve</option>
              <option value="Waiting For GRN">Waiting For GRN</option>
              <option value="GRN Compleated">GRN Compleated</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              Date Type<span>:</span>
            </label>
            <select
              name="DateType"
              value={SerchOptions.DateType}
              onChange={Handeleonchange}
            >
              <option value="">Select</option>
              <option value="CurrentDate">Current Date</option>
              <option value="Customize">Customize</option>
            </select>
          </div>

          {SerchOptions.DateType === "CurrentDate" ? (
            <div className="RegisForm_1">
              <label>
                Current Date<span>:</span>
              </label>
              <input
                type="date"
                name="CurrentDate"
                value={SerchOptions.CurrentDate}
                onChange={Handeleonchange}
                readOnly
              />
            </div>
          ) : (
            <>
              <div className="RegisForm_1">
                <label>
                  From Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="FromDate"
                  value={SerchOptions.FromDate}
                  onChange={Handeleonchange}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  To Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="ToDate"
                  value={SerchOptions.ToDate}
                  onChange={Handeleonchange}
                  min={SerchOptions.FromDate}
                />
              </div>
            </>
          )}

          <div className="RegisForm_1">
            <label>
              Supplier Id<span>:</span>
            </label>
            <input
              type="text"
              name="SupplierId"
              value={SerchOptions.SupplierId}
              onChange={Handeleonchange}
              list="SupplierIdList"
            />
            <datalist id="SupplierIdList">
              {supplierArray.map((ele, ind) => (
                <option key={ind + "key"} value={ele.id}></option>
              ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label>
              Supplier Name<span>:</span>
            </label>
            <input
              type="text"
              name="SupplierName"
              value={SerchOptions.SupplierName}
              onChange={Handeleonchange}
              list="SupplierNameList"
            />
            <datalist id="SupplierNameList">
              {supplierArray.map((ele, ind) => (
                <option key={ind + "key"} value={ele.SupplierName}></option>
              ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label>
              Billing Location<span>:</span>
            </label>
            <select
              id="BillingLocation"
              name="BillingLocation"
              value={SerchOptions.BillingLocation}
              onChange={Handeleonchange}
            >
              <option value="">Select</option>
              {LocationData.map((ele, ind) => (
                <option key={ind + "key"} value={ele.id}>
                  {ele.locationName}
                </option>
              ))}
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              Shipping Location<span>:</span>
            </label>
            <select
              id="ShippingLocation"
              name="ShippingLocation"
              value={SerchOptions.ShippingLocation}
              onChange={Handeleonchange}
            >
              <option value="">Select</option>
              {LocationData.map((ele, ind) => (
                <option key={ind + "key"} value={ele.id}>
                  {ele.locationName}
                </option>
              ))}
            </select>
          </div>

          <button
            className="search_div_bar_btn_1"
            onClick={handleNewMaster}
            title="New Doctor Register"
          >
            <LoupeIcon />
          </button>
        </div>

        <br />
        <div className="Main_container_Btn" style={{ marginBottom: "1rem" }}>
          {/* Your existing Print Button */}
          <button
            onClick={handlePrintAllPOs}
            disabled={isPrinting}
            style={{ marginRight: "10px" }}
          >
            {isPrinting ? "Preparing..." : <PrintIcon />}
          </button>

          {/* New Excel Export Button */}
          <button onClick={handleExportExcel}>
            <DescriptionIcon />
          </button>
        </div>

        <ReactGrid columns={PurchaseOrderColumn} RowData={PurchaseOrderList} />
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />

      {selectRoom && Itemlist.length !== 0 && (
        <div className="loader" onClick={() => setselectRoom(false)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <br />

            <div className="common_center_tag">
              <span>Item Details</span>
            </div>
            <br />
            <br />

            <ReactGrid columns={ItemColumn} RowData={Itemlist} />
          </div>
        </div>
      )}
    </>
  );
};

export default PurchaseOrderList;
