
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



// const PurchaseReturnList = () => {

//   const navigate = useNavigate();

//   const dispatchvalue = useDispatch();

//   const today = new Date();
//   const currentDate = today.toISOString().split('T')[0];
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//   const toast = useSelector(state => state.userRecord?.toast);

//   const [supplierArray, setsupplierArray] = useState([])
//   const [LocationData, setLocationData] = useState([]);

//   const [PurchaseReturnList, setPurchaseReturnList] = useState([])


//   const [Itemlist, setItemlist] = useState([])

//   const [selectRoom, setselectRoom] = useState(false);
//   const [StoreData, setStoreData] = useState([]);


//   useEffect(()=>{
//     if(userRecord?.location){
//       axios
//       .get(
//         `${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${userRecord?.location}&&forquickgrn=${false}`
//       )
//       .then((res) =>{
//         const data = res.data;
//         setStoreData(Array.isArray(data) ? data : []);
//       })
//       .catch((err) =>{
//         console.log(err);
//       });
//     }

//   },[UrlLink, userRecord?.location])

//   const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";

//   const [SerchOptions, setSerchOptions] = useState({
//     StatusCheck: '',
//     DateType: '',
//     CurrentDate: currentDate,
//     FromDate: '',
//     ToDate: '',
//     SupplierId: '',
//     SupplierName: '',
//     Location: '',
//     StoreId:allowedStoreId || '',
//   })
//   console.log('SerchOptions--',SerchOptions);


//   useEffect(() => {

//     axios.get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
//       .then((res) => {
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


//   const PurchaseReturn_getFun = useCallback(() => {

//     axios.get(`${UrlLink}Inventory/PurchaseReturn_Report_Link`, {
//       params: SerchOptions,
//     })
//       .then((res) => {
//         console.log(res.data);
//         let data = res.data
//         if (data && Array.isArray(data) && data.length !== 0) { setPurchaseReturnList(data) }
//         else { setPurchaseReturnList([]) }

//       })
//       .catch((err) => {
//         console.log(err);
//       })
//   }, [SerchOptions])

//   useEffect(() => {
//     PurchaseReturn_getFun()
//   }, [PurchaseReturn_getFun])


//   const handleNewMaster = () => {
//     //  navigate('/Home/PurchaseReturn');
//     navigate("/Home/InventoryMaster");
//     dispatchvalue({ type: "HrFolder", value: "PurchaseReturn" });
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//     dispatchvalue({ type: 'PurchaseReturnList', value: {} });

//   };



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

//   const ItemView = (row) => {

//     let Item = row.Items

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

//     dispatchvalue({ type: 'PurchaseReturnList', value: row });
//     navigate("/Home/InventoryMaster");
//     dispatchvalue({ type: "HrFolder", value: "PurchaseReturn" });
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//     dispatchvalue({ type: 'PurchaseReturnList', value: {} });

//   }


//   const HandelApprovedata = (row, status) => {

//     const POconfirm = window.confirm(`Are You Sure You Want to ${status} the Purchase Return for P.R.Number ${row.id} ?`);

//     if (POconfirm) {

//       let Senddata = {
//         EditStatus: status,
//         PRreturnid: row.id
//       }

//       axios.post(`${UrlLink}Inventory/PurchaseReturn_StatusUpdate`, Senddata)
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
//           PurchaseReturn_getFun()
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     }

//   }

//   const PurchaseOrderColumn = [
//     {
//       key: 'id',
//       name: 'P.R.Number',
//       frozen: true
//     },
//     {
//       key: 'ReturnDate',
//       name: 'ReturnDate',
//       frozen: true
//     },
//     {
//       key: 'SupplierCode',
//       name: 'Supplier Code',
//       frozen: true
//     }, {
//       key: 'SupplierName',
//       name: 'Supplier Name',
//       frozen: true
//     },
//     {
//       key: 'Items',
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

//     }, {
//       key: 'SupplierContactPerson',
//       name: ' Contact Person',
//     },
//     {
//       key: 'Location',
//       name: 'Location',
//     }, {
//       key: 'StoreLocation',
//       name: 'Store Location',
//     },
//     {
//       key: 'ReturnTotalItem',
//       name: 'Return Total Item',
//     },
//     {
//       key: 'ReturnTotalQuantity',
//       name: 'Return Total Quantity',
//     },
//     {
//       key: 'ReturnTotalAmount',
//       name: 'Return Total Amount',
//     },
//     {
//       key: 'Status',
//       name: 'Status',
//     },
//     // {
//     //   key: 'Edit',
//     //   name: 'Edit',
//     //   renderCell: (params) => (
//     //     <>
//     //       {params.row.Status === 'Pending' ?
//     //         <Button className="cell_btn"
//     //           onClick={() => HandelEditdata(params.row)}
//     //         >
//     //           <EditIcon className="check_box_clrr_cancell" />
//     //         </Button> :
//     //         <>No Action</>}
//     //     </>
//     //   )
//     // },
//     // {
//     //   key: 'Action',
//     //   name: 'Action',
//     //   renderCell: (params) => (
//     //     <>
//     //       {params.row.Status === 'Pending' ?
//     //         <>
//     //           <Button className="cell_btn"
//     //             onClick={() => HandelApprovedata(params.row, 'Approved')}
//     //           >
//     //             <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
//     //           </Button>
//     //           <Button className="cell_btn"
//     //             onClick={() => HandelApprovedata(params.row, 'cancelled')}
//     //           >
//     //             <DeleteSweepIcon className="check_box_clrr_cancell" />
//     //           </Button>
//     //         </>
//     //         :
//     //         <Button className="cell_btn">
//     //           No Action
//     //         </Button>}
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
//       key: 'ItemCode',
//       name: 'Item Code',
//       frozen: true
//     },
//     {
//       key: 'ItemName',
//       name: 'Item Name',
//       frozen: true
//     },
//     {
//       key: 'GenericName',
//       name: 'Generic Name'
//     },
//     {
//       key: 'CompanyName',
//       name: 'Manufacturer Name'
//     },
//     {
//       key: 'HSNCode',
//       name: 'HSN Code'
//     },
//     {
//       key: 'ProductType',
//       name: 'Product Type',
//     },
//     {
//       key: 'Strength',
//       name: 'Strength'
//     },
//     {
//       key: 'Volume',
//       name: 'Volume',
//     },
//     {
//       key: 'PackType',
//       name: 'Pack Type',
//     },
//     {
//       key: 'PackQuantity',
//       name: 'Pack Quantity',
//     },
//     {
//       key: 'BatchNo',
//       name: 'Batch No'
//     },
//     {
//       key: 'PurchaseRateWithTax',
//       name: 'PurchaseRateWithTax'
//     },
//     {
//       key: 'PurchaseQuantity',
//       name: 'Purchase Quantity'
//     },
//     {
//       key: 'PurchaseAmount',
//       name: 'Purchase Amount'
//     },
//     {
//       key: 'ReturnPackQuantity',
//       name: 'Return Quantity'
//     },
//     {
//       key: 'ReturnQuantityAmount',
//       name: 'Return Quantity Amount'
//     },
//     {
//       key: 'Remarks',
//       name: 'Remarks'
//     }
//   ]


//   return (
//     <>

//       <div className="Main_container_app">
//         <h3>Purchase Return List</h3>
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
//               <option value='Pending'>Pending</option>
//               <option value='Approved'>Approved</option>
//               <option value='cancelled'>cancelled</option>
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
//             <label>Location<span>:</span></label>
//             <select
//               id='Location'
//               name='Location'
//               value={SerchOptions.Location}
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
//             <label>Store Name <span>:</span></label>
//             <select
//             id='StoreId'
//             name='StoreId'
//             value={SerchOptions.StoreId}
//             onChange={Handeleonchange}
//             autoComplete='off'
//             >
//               <option value=''>Select</option>
//               {
//                StoreData.map((ele, ind) => (
//                 <option key={ind+'key'} value={ele.id}>{ele.StoreName}</option>
//                ))

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
//         <ReactGrid columns={PurchaseOrderColumn} RowData={PurchaseReturnList} />

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

// export default PurchaseReturnList;


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
import DescriptionIcon from "@mui/icons-material/Description"; // For Excel icon
import * as XLSX from 'xlsx';

const PurchaseReturnList = () => {
  const navigate = useNavigate();

  const dispatchvalue = useDispatch();

  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);

  const [supplierArray, setsupplierArray] = useState([]);
  const [LocationData, setLocationData] = useState([]);

  const [PurchaseReturnList, setPurchaseReturnList] = useState([]);

  const [Itemlist, setItemlist] = useState([]);

  const [selectRoom, setselectRoom] = useState(false);
  const [StoreData, setStoreData] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (userRecord?.location) {
      axios
        .get(
          `${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${
            userRecord?.location
          }&&forquickgrn=${false}`
        )
        .then((res) => {
          const data = res.data;
          setStoreData(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, userRecord?.location]);

  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";

  const [SerchOptions, setSerchOptions] = useState({
    StatusCheck: "",
    DateType: "",
    CurrentDate: currentDate,
    FromDate: "",
    ToDate: "",
    SupplierId: "",
    SupplierName: "",
    Location: "",
    StoreId: allowedStoreId || "",
  });
  console.log("SerchOptions--", SerchOptions);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
      .then((res) => {
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

  const PurchaseReturn_getFun = useCallback(() => {
    axios
      .get(`${UrlLink}Inventory/PurchaseReturn_Report_Link`, {
        params: SerchOptions,
      })
      .then((res) => {
        console.log(res.data);
        let data = res.data;
        if (data && Array.isArray(data) && data.length !== 0) {
          setPurchaseReturnList(data);
        } else {
          setPurchaseReturnList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [SerchOptions]);

  useEffect(() => {
    PurchaseReturn_getFun();
  }, [PurchaseReturn_getFun]);

  const handleNewMaster = () => {
    //  navigate('/Home/PurchaseReturn');
    navigate("/Home/InventoryMaster");
    dispatchvalue({ type: "HrFolder", value: "PurchaseReturn" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
    dispatchvalue({ type: "PurchaseReturnList", value: {} });
  };

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

  const ItemView = (row) => {
    let Item = row.Items;

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
    dispatchvalue({ type: "PurchaseReturnList", value: row });
    navigate("/Home/InventoryMaster");
    dispatchvalue({ type: "HrFolder", value: "PurchaseReturn" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
    dispatchvalue({ type: "PurchaseReturnList", value: {} });
  };

  // --- COMPLETE EXCEL EXPORT HANDLER ---
  const handleExportExcel = () => {
    if (PurchaseReturnList.length === 0) {
      const tdata = { message: "No data available to export.", type: "warn" };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Flatten the data to include every detail in each row
    const flattenedData = PurchaseReturnList.flatMap((pr) =>
      (pr.Items && pr.Items.length > 0 ? pr.Items : [{}]).map((item) => ({
        // Main Purchase Return Details (repeated for each item)
        "P.R. Number": pr.id,
        "Return Date": pr.ReturnDate,
        Status: pr.Status,
        "Supplier Code": pr.SupplierCode,
        "Supplier Name": pr.SupplierName,
        "Supplier Mail": pr.SupplierMailId,
        "Supplier Contact Person": pr.SupplierContactPerson,
        "Supplier Contact Number": pr.SupplierContactNumber,
        Location: pr.Location,
        "Store Location": pr.StoreLocation,
        "Return Total Items": pr.ReturnTotalItem,
        "Return Total Quantity": pr.ReturnTotalQuantity,
        "Return Total Amount": pr.ReturnTotalAmount,

        // Individual Item Details
        "Item Code": item.ItemCode,
        "Item Name": item.ItemName,
        "Generic Name": item.GenericName,
        Manufacturer: item.CompanyName,
        "HSN Code": item.HSNCode,
        "Batch No": item.BatchNo,
        "Product Type": item.ProductType,
        Strength: item.Strength,
        Volume: item.Volume,
        "Pack Type": item.PackType,
        "Pack Quantity": item.PackQuantity,
        "Purchase Rate (With Tax)": item.PurchaseRateWithTax,
        "Return Quantity": item.ReturnPackQuantity,
        "Return Amount": item.ReturnQuantityAmount,
        Remarks: item.Remarks,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Returns");

    // Auto-adjust column widths for better readability
    const columnWidths = Object.keys(flattenedData[0] || {}).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...flattenedData.map((row) => (row[key] || "").toString().length)
        ) + 2,
    }));
    worksheet["!cols"] = columnWidths;

    XLSX.writeFile(workbook, "PurchaseReturnList_Detailed.xlsx");
  };

  const handlePrintAll = () => {
    if (isPrinting || !PurchaseReturnList || PurchaseReturnList.length === 0) {
      if (!isPrinting) {
        dispatchvalue({
          type: "toast",
          value: { message: "No Purchase Returns to print.", type: "warn" },
        });
      }
      return;
    }

    setIsPrinting(true);
    let reportHTML = "";

    PurchaseReturnList.forEach((pr) => {
      reportHTML += `
            <div class="pr-section">
                <div class="header">
                    <h2>Purchase Return Voucher: ${pr.id}</h2>
                </div>
                <div class="details-grid">
                     <div><span>Supplier:</span><span>${
                       pr.SupplierName || "N/A"
                     } (${pr.SupplierCode || "N/A"})</span></div>
                     <div><span>Return Date:</span><span>${new Date(
                       pr.ReturnDate
                     ).toLocaleDateString("en-GB")}</span></div>
                     <div><span>Contact Person:</span><span>${
                       pr.SupplierContactPerson || "N/A"
                     }</span></div>
                     <div><span>Contact Number:</span><span>${
                       pr.SupplierContactNumber || "N/A"
                     }</span></div>
                     <div><span>Location:</span><span>${
                       pr.Location || "N/A"
                     }</span></div>
                     <div><span>Store:</span><span>${
                       pr.StoreLocation || "N/A"
                     }</span></div>
                     <div><span>Status:</span><span>${
                       pr.Status || "N/A"
                     }</span></div>
                     <div><span>Supplier Mail:</span><span>${
                       pr.SupplierMailId || "N/A"
                     }</span></div>
                </div>
                
                <h3>Item Details</h3>
                ${
                  pr.Items && pr.Items.length > 0
                    ? `
                    <table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Item Details</th>
                                <th>Manufacturer</th>
                                <th>Batch No</th>
                                <th>HSN</th>
                                <th>Return Qty</th>
                                <th>Rate</th>
                                <th>Amount</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pr.Items.map(
                              (item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td><b>${item.ItemName || ""}</b><br>(${
                                item.ItemCode || ""
                              })<br><i>${item.GenericName || ""}</i></td>
                                    <td>${item.CompanyName || ""}</td>
                                    <td>${item.BatchNo || ""}</td>
                                    <td>${item.HSNCode || ""}</td>
                                    <td>${item.ReturnPackQuantity || 0}</td>
                                    <td>${parseFloat(
                                      item.PurchaseRateWithTax || 0
                                    ).toFixed(2)}</td>
                                    <td>${parseFloat(
                                      item.ReturnQuantityAmount || 0
                                    ).toFixed(2)}</td>
                                    <td>${item.Remarks || ""}</td>
                                </tr>
                            `
                            ).join("")}
                        </tbody>
                    </table>
                    <div class="totals-section">
                        <p><strong>Total Items:</strong> ${
                          pr.ReturnTotalItem
                        }</p>
                        <p><strong>Total Quantity:</strong> ${
                          pr.ReturnTotalQuantity
                        }</p>
                        <p><strong>Total Return Amount:</strong> ${parseFloat(
                          pr.ReturnTotalAmount || 0
                        ).toFixed(2)}</p>
                    </div>
                `
                    : "<p>No items found for this return.</p>"
                }
            </div>
        `;
    });

    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Purchase Return Report</title>
          <style>
            @page { size: A4 landscape; margin: 15mm; }
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            .pr-section { 
                page-break-inside: avoid; 
                border: 1px solid #666;
                padding: 15px;
                margin-bottom: 20px;
            }
            .header { text-align: center; }
            .details-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 5px 20px; 
                border: 1px solid #ccc; 
                padding: 10px; 
                margin: 10px 0;
                font-size: 11px;
            }
            .details-grid div span:first-child { font-weight: bold; width: 120px; display: inline-block; }
            table { width:100%; border-collapse: collapse; font-size: 10px; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; vertical-align: top; }
            th { background-color: #f2f2f2; }
            h2, h3 { margin: 5px 0; }
            .totals-section { 
                text-align: right; 
                margin-top: 10px; 
            }
            .totals-section p { margin: 3px 0; font-size: 12px; }
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

  const HandelApprovedata = (row, status) => {
    const POconfirm = window.confirm(
      `Are You Sure You Want to ${status} the Purchase Return for P.R.Number ${row.id} ?`
    );

    if (POconfirm) {
      let Senddata = {
        EditStatus: status,
        PRreturnid: row.id,
      };

      axios
        .post(`${UrlLink}Inventory/PurchaseReturn_StatusUpdate`, Senddata)
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
          PurchaseReturn_getFun();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const PurchaseOrderColumn = [
    {
      key: "id",
      name: "P.R.Number",
      frozen: true,
    },
    {
      key: "ReturnDate",
      name: "ReturnDate",
      frozen: true,
    },
    {
      key: "SupplierCode",
      name: "Supplier Code",
      frozen: true,
    },
    {
      key: "SupplierName",
      name: "Supplier Name",
      frozen: true,
    },
    {
      key: "Items",
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
    {
      key: "SupplierContactPerson",
      name: " Contact Person",
    },
    {
      key: "Location",
      name: "Location",
    },
    {
      key: "StoreLocation",
      name: "Store Location",
    },
    {
      key: "ReturnTotalItem",
      name: "Return Total Item",
    },
    {
      key: "ReturnTotalQuantity",
      name: "Return Total Quantity",
    },
    {
      key: "ReturnTotalAmount",
      name: "Return Total Amount",
    },
    {
      key: "Status",
      name: "Status",
    },
    // {
    //   key: 'Edit',
    //   name: 'Edit',
    //   renderCell: (params) => (
    //     <>
    //       {params.row.Status === 'Pending' ?
    //         <Button className="cell_btn"
    //           onClick={() => HandelEditdata(params.row)}
    //         >
    //           <EditIcon className="check_box_clrr_cancell" />
    //         </Button> :
    //         <>No Action</>}
    //     </>
    //   )
    // },
    // {
    //   key: 'Action',
    //   name: 'Action',
    //   renderCell: (params) => (
    //     <>
    //       {params.row.Status === 'Pending' ?
    //         <>
    //           <Button className="cell_btn"
    //             onClick={() => HandelApprovedata(params.row, 'Approved')}
    //           >
    //             <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
    //           </Button>
    //           <Button className="cell_btn"
    //             onClick={() => HandelApprovedata(params.row, 'cancelled')}
    //           >
    //             <DeleteSweepIcon className="check_box_clrr_cancell" />
    //           </Button>
    //         </>
    //         :
    //         <Button className="cell_btn">
    //           No Action
    //         </Button>}
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
      key: "ItemCode",
      name: "Item Code",
      frozen: true,
    },
    {
      key: "ItemName",
      name: "Item Name",
      frozen: true,
    },
    {
      key: "GenericName",
      name: "Generic Name",
    },
    {
      key: "CompanyName",
      name: "Manufacturer Name",
    },
    {
      key: "HSNCode",
      name: "HSN Code",
    },
    {
      key: "ProductType",
      name: "Product Type",
    },
    {
      key: "Strength",
      name: "Strength",
    },
    {
      key: "Volume",
      name: "Volume",
    },
    {
      key: "PackType",
      name: "Pack Type",
    },
    {
      key: "PackQuantity",
      name: "Pack Quantity",
    },
    {
      key: "BatchNo",
      name: "Batch No",
    },
    {
      key: "PurchaseRateWithTax",
      name: "PurchaseRateWithTax",
    },
    {
      key: "PurchaseQuantity",
      name: "Purchase Quantity",
    },
    {
      key: "PurchaseAmount",
      name: "Purchase Amount",
    },
    {
      key: "ReturnPackQuantity",
      name: "Return Quantity",
    },
    {
      key: "ReturnQuantityAmount",
      name: "Return Quantity Amount",
    },
    {
      key: "Remarks",
      name: "Remarks",
    },
  ];

  return (
    <>
      <div className="Main_container_app">
        <h3>Purchase Return List</h3>
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="cancelled">cancelled</option>
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
              Location<span>:</span>
            </label>
            <select
              id="Location"
              name="Location"
              value={SerchOptions.Location}
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
              Store Name <span>:</span>
            </label>
            <select
              id="StoreId"
              name="StoreId"
              value={SerchOptions.StoreId}
              onChange={Handeleonchange}
              autoComplete="off"
            >
              <option value="">Select</option>
              {StoreData.map((ele, ind) => (
                <option key={ind + "key"} value={ele.id}>
                  {ele.StoreName}
                </option>
              ))}
            </select>
          </div>

          <button
            className="search_div_bar_btn_1"
            onClick={handleExportExcel}
            title="Export to Excel"
          >
            <DescriptionIcon />
          </button>

          <button
            className="search_div_bar_btn_1"
            onClick={handlePrintAll}
            title="Print All Visible"
          >
            <PrintIcon />
          </button>

          <button
            className="search_div_bar_btn_1"
            onClick={handleNewMaster}
            title="New Doctor Register"
          >
            <LoupeIcon />
          </button>
        </div>

        <br />
        <ReactGrid columns={PurchaseOrderColumn} RowData={PurchaseReturnList} />
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

export default PurchaseReturnList;

