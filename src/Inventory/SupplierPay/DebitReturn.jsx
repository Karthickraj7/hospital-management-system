// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import EditIcon from '@mui/icons-material/Edit';
// import Button from '@mui/material/Button';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

// const DebitReturn = () => {
//   const dispatchvalue = useDispatch();

//   const navigate = useNavigate();

//   const today = new Date();
//   const currentDate = today.toISOString().split('T')[0];

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);

//   const EdittData = useSelector(
//     (state) => state.Inventorydata?.PurchaseReturnList
//   );
// const suplierdata = useSelector((state) => state.Inventorydata?.Supplierpaydata
// );

// console.log('Supplierpaydata',suplierdata);

//   const [supplierArray, setsupplierArray] = useState([]);

//   const [LocationData, setLocationData] = useState([]);

//   const [StoreData, setStoreData] = useState([]);

//   const [GRNDetailState, setGRNDetailState] = useState([]);

//   const [GRNItemState, setGRNItemState] = useState([]);

//   const [ReturnItemList, setReturnItemList] = useState([]);

//   // console.log('ReturnItemList',ReturnItemList);
//   const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";

//   const [SupplierDetailes, setSupplierDetailes] = useState({
//     ReturnDate: currentDate,
//     SupplierCode: '',
//     SupplierName: '',
//     SupplierMailId: '',
//     SupplierContactNumber: '',
//     SupplierContactPerson: '',
//     Location:'1' || '',
//     StoreLocation: allowedStoreId || '',
//   });
//   console.log('SupplierDetailes----------------',SupplierDetailes)

//   const [ReturnItemState, setReturnItemState] = useState({
//     GRNInvoiceNo: '',
//     GRN_No: '',
//     GRNDate: '',
//     SupplierBillNo: '',
//     SupplierBillDate: '',
//     Reason: '',
//     ItemCode: '',
//     ItemName: '',
//   });
//   console.log('ReturnItemState-------------', ReturnItemState);

//   const [ReturnQtyState, setReturnQtyState] = useState({
//     PurchaseAmount: '',
//     AvailablePackQuantity: '',
//     ReturnQuantity: '',
//     ReturnPackQuantity: '',
//     ReturnQuantityAmount: '',
//     Remarks: '',
//   });

//   const [FinalState, setFinalState] = useState({
//     ReturnTotalItem: '',
//     ReturnTotalQuantity: '',
//     ReturnTotalAmount: '',
//   });

//   const Clear_setReturnItemState = () => {
//     setReturnItemState({
//       GRNInvoiceNo: '',
//        GRN_No: '',
//       GRNDate: '',
//       SupplierBillNo: '',
//       SupplierBillDate: '',
//       Reason: '',
//       ItemCode: '',
//       ItemName: '',
//     });
//   };

//   const Clear_setReturnQtyState = () => {
//     setReturnQtyState({
//       PurchaseAmount: '',
//       AvailablePackQuantity: '',
//       ReturnQuantity: '',
//       ReturnPackQuantity: '',
//       ReturnQuantityAmount: '',
//       Remarks: '',
//     });
//   };

//   const clear_finalstate = () => {
//     setReturnItemList([]);
//     setFinalState({
//       ReturnTotalItem: '',
//       ReturnTotalQuantity: '',
//       ReturnTotalAmount: '',
//     });
//   };

//   const formatLabel = (label) => {
//     if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
//       return label
//         .replace(/([a-z])([A-Z])/g, '$1 $2')
//         .replace(/^./, (str) => str.toUpperCase());
//     } else {
//       return label;
//     }
//   };

//   useEffect(() => {
//     if (ReturnItemList && ReturnItemList.length !== 0) {
//       let TotalQty = ReturnItemList.reduce(
//         (acc, item) => acc + (+item.ReturnQuantity || 0),
//         0
//       );

//       let TotalNetAmount = ReturnItemList.reduce(
//         (acc, item) => acc + (+item.ReturnQuantityAmount || 0),
//         0
//       );

//       setFinalState({
//         ReturnTotalItem: ReturnItemList.length,
//         ReturnTotalQuantity: TotalQty,
//         ReturnTotalAmount: TotalNetAmount,
//       });
//     } else {
//       setFinalState({
//         ReturnTotalItem: '',
//         ReturnTotalQuantity: '',
//         ReturnTotalAmount: '',
//       });
//     }
//   }, [ReturnItemList]);

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
//       .then((res) => {
//         console.log('pppp----', res.data);
//         let Rdata = res.data;
//         if (Array.isArray(Rdata)) {
//           setsupplierArray(Rdata);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     axios
//       .get(`${UrlLink}Masters/Location_Detials_link`)
//       .then((res) => {
//         const ress = res.data;
//         setLocationData(ress);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink]);

//   useEffect(() => {
//     if (SupplierDetailes.Location && SupplierDetailes.Location !== '') {
//       axios
//         .get(
//           `${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${SupplierDetailes.Location}&IsFromWardStore=${false}`
//         )
//         .then((res) => {
//           const ress = res.data || [];
//           setStoreData(ress);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [SupplierDetailes.Location]);

//   useEffect(() => {
//     if (
//       SupplierDetailes?.SupplierCode !== '' &&
//       SupplierDetailes?.StoreLocation !== ''
//     ) {
//       axios
//         .get(
//           `${UrlLink}Inventory/GRN_Details_GET_For_PurchseReturn?SupplierCode=${SupplierDetailes.SupplierCode}&StoreLocation=${SupplierDetailes.StoreLocation}`
//         )
//         .then((res) => {
//           console.log(res.data);
//           let data = res.data;
//           setGRNDetailState(data && Array.isArray(data) ? data : []);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [SupplierDetailes.SupplierCode]);

//   useEffect(() => {
//     if (
//       SupplierDetailes?.SupplierCode !== '' &&
//       SupplierDetailes?.StoreLocation !== ''
//     ) {
//       axios
//         .get(
//           `${UrlLink}Inventory/GRN_Details_GET_For_PurchseReturn?SupplierCode=${SupplierDetailes.SupplierCode}&StoreLocation=${SupplierDetailes.StoreLocation}`
//         )
//         .then((res) => {
//           console.log(res.data);
//           let data = res.data;
//           setGRNDetailState(data && Array.isArray(data) ? data : []);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [SupplierDetailes.SupplierCode]);

//   useEffect(() => {
//     if (ReturnItemState.GRNInvoiceNo !== '' && ReturnItemState.Reason !== '') {
//       axios
//         .get(
//           `${UrlLink}Inventory/GRN_Details_GET_For_PurchseReturn?GRNInvoiceNo=${ReturnItemState.GRNInvoiceNo}&Reason=${ReturnItemState.Reason}`
//         )
//         .then((res) => {
//           console.log(res.data);
//           let data = res.data;
//           setGRNItemState(data && Array.isArray(data) ? data : []);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [ReturnItemState.GRNInvoiceNo, ReturnItemState.Reason]);

//   //   ------------

//   useEffect(() => {
//     if (EdittData && Object.keys(EdittData).length !== 0) {
//       // Update Supplier Details
//       setSupplierDetailes({
//         ReturnDate: currentDate,
//         SupplierCode: EdittData?.SupplierCode,
//         SupplierName: EdittData?.SupplierName,
//         SupplierMailId: EdittData?.SupplierMailId || '',
//         SupplierContactNumber: EdittData?.SupplierContactNumber || '',
//         SupplierContactPerson: EdittData?.SupplierContactPerson || '',
//         Location: EdittData?.Location || '',
//         StoreLocation: EdittData?.StoreLocation || '',
//       });
//       setReturnItemState({
//         Reason: EdittData.Reason,
//       });
    
//       // Find GRN Details
//       let grnFind = GRNDetailState.find(
//         (ele) => '' + ele.GRNNumber === '' + EdittData?.GRNNumber
//       );
//       console.log('grnFind----------', grnFind);
//       if (grnFind) {
//         console.log('GRN Details Found');
//         setReturnItemState((prevState) => ({
//           ...prevState,
//           GRNInvoiceNo: grnFind.GRNNumber,
//            GRN_No: grnFind.GRN_No,
//           GRNDate: grnFind.GrnDate,
//           SupplierBillNo: grnFind.SupplierBillNumber,
//           SupplierBillDate: grnFind.SupplierBillDate,
//         }));
//       }

//       // Find Item Details
//       let itemFind = GRNItemState.find(
//         (ele) => '' + ele.ItemCode === '' + EdittData?.ItemCode
//       );
//       if (itemFind) {
//         console.log('0000000000000000000', itemFind);
//         const {
//           ItemCode,
//           ItemName,
//           AvailableQuantity,
//           SingleProductPurchaseAmount,
//           ...restData
//         } = itemFind;

//         setReturnItemState((prev) => ({
//           ...prev, // Preserve existing values
//           ItemCode: ItemCode,
//           ItemName: ItemName,
//           ...restData, // Merge other properties
//         }));

//         if (AvailableQuantity) {
//           setReturnQtyState((prev) => ({
//             ...prev,
//             PurchaseAmount: SingleProductPurchaseAmount,
//             AvailablePackQuantity: AvailableQuantity,
//           }));

//         }  
//         setReturnQtyState((prev) => {
//           const returnQuantity = EdittData?.AvailableQuantity || '';
//           const returnPackQuantity =
//             +returnQuantity * +ReturnItemState?.PackQuantity || 0;
//           const returnQuantityAmount = (
//             +returnQuantity * +prev?.PurchaseAmount || 0
//           ).toFixed(2);
  
//           console.log('returnQuantityAmount----',returnQuantityAmount)
  
//           return {
//             ...prev,
//             ReturnQuantity: returnQuantity,
//             ReturnPackQuantity: returnQuantity,
//             ReturnQuantityAmount: returnQuantityAmount,
//             Remarks: '',
//           };
//         });
  
//       }
//     }
//   }, [EdittData, GRNDetailState, GRNItemState]);

//   const Getsinglesupp = async (SupplierId) => {
//     try {
//       const res = await axios.get(
//         `${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierId=${SupplierId}`
//       );
//       const result = res.data;
//       if (result && Object.values(result).length !== 0) {
//         // console.log('result-----', result);
//         return result;
//       }
//     } catch (err) {
//       console.log(err);
//       return '';
//     }
//   };



//   const HandleonchangeSupplierState = async (e) => {
//     const { name, value } = e.target;

//     // Clear_setReturnItemState();
//     // Clear_setReturnQtyState();
//     // clear_finalstate();

//     if (name === 'SupplierCode') {
//       setSupplierDetailes((prev) => ({
//         ...prev,
//         [name]: value,
//         SupplierName: '',
//         SupplierMailId: '',
//         SupplierContactNumber: '',
//         SupplierContactPerson: '',
//         Location: '1' || '',
//         StoreLocation: allowedStoreId || '',
//       }));
//     } else if (name === 'SupplierName') {
//       setSupplierDetailes((prev) => ({
//         ...prev,
//         [name]: value,
//         SupplierCode: '',
//         SupplierMailId: '',
//         SupplierContactNumber: '',
//         SupplierContactPerson: '',
//         Location: '1' || '',
//         StoreLocation: allowedStoreId || '',
//       }));
//     } else if (name === 'Location') {
//       setSupplierDetailes((prev) => ({
//         ...prev,
//         [name]: value,
//         StoreLocation: allowedStoreId || '',
//       }));
//     } else {
//       setSupplierDetailes((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };





//   const HandelOnchaneItemState = (e) => {
//     const { name, value } = e.target;
//     Clear_setReturnQtyState();

//     if (name === 'Reason') {
//       setReturnItemState((prev) => ({
//         GRNInvoiceNo: prev.GRNInvoiceNo,
//         GRN_No: prev.GRN_No,
//         GRNDate: prev.GRNDate,
//         SupplierBillNo: prev.SupplierBillNo,
//         SupplierBillDate: prev.SupplierBillDate,
//         [name]: value,
//         ItemCode: '',
//         ItemName: '',
//       }));
//     } else if (name === 'GRNInvoiceNo') {
//       setReturnItemState({
//         GRNInvoiceNo: value,
//         GRN_No: '',
//         GRNDate: '',
//         SupplierBillNo: '',
//         SupplierBillDate: '',
//         Reason: '',
//         ItemCode: '',
//         ItemName: '',
//       });
//     } else if (name === 'ItemCode') {
//       setReturnItemState((prev) => ({
//         GRNInvoiceNo: prev.GRNInvoiceNo,
//         GRN_No: prev.GRN_No,
//         GRNDate: prev.GRNDate,
//         SupplierBillNo: prev.SupplierBillNo,
//         SupplierBillDate: prev.SupplierBillDate,
//         Reason: prev.Reason,
//         [name]: value,
//         ItemName: '',
//       }));
//     } else if (name === 'ItemName') {
//       setReturnItemState((prev) => ({
//         GRNInvoiceNo: prev.GRNInvoiceNo,
//         GRN_No: prev.GRN_No,
//         GRNDate: prev.GRNDate,
//         SupplierBillNo: prev.SupplierBillNo,
//         SupplierBillDate: prev.SupplierBillDate,
//         Reason: prev.Reason,
//         ItemCode: '',
//         [name]: value,
//       }));
//     } else {
//       setReturnItemState((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const HandelOnchaneReturnQty = (e) => {
//     const { name, value } = e.target;

//     if (name === 'ReturnQuantity') {
//       if (
//         +value * +ReturnItemState?.PackQuantity >
//         ReturnQtyState.AvailablePackQuantity
//       ) {
//         const tdata = {
//           message: `Return Quantity Greater than Available Quantity`,
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       } else {
//         setReturnQtyState((prev) => ({
//           ...prev,
//           [name]: value,
//           ReturnPackQuantity: +value * +ReturnItemState?.PackQuantity,
//           ReturnQuantityAmount: (
//             +value * +ReturnQtyState?.PurchaseAmount
//           ).toFixed(2),
//         }));
//       }
//     } else {
//       setReturnQtyState((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSearchSupplierlist = async (conditions) => {
//     if (conditions === 'SupplierCode') {
//       let find = supplierArray.find(
//         (ele) => ele.id === SupplierDetailes.SupplierCode
//       );

//       if (find) {
//         let getobj = await Getsinglesupp(SupplierDetailes.SupplierCode);

//         setSupplierDetailes((prev) => ({
//           ...prev,
//           SupplierName: find.SupplierName,
//           SupplierMailId: getobj?.EmailAddress || '',
//           SupplierContactNumber: getobj?.ContactNumber || '',
//           SupplierContactPerson: getobj?.ContactPerson || '',
//           Location: '1' || '',
//           StoreLocation: allowedStoreId || '',
//         }));
//       } else {
//         const tdata = {
//           message: `Supplier Was Not Found`,
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       }
//     } else if (conditions === 'SupplierName') {
//       let find = supplierArray.find(
//         (ele) => ele.SupplierName === SupplierDetailes.SupplierName
//       );

//       if (find) {
//         let getobj = await Getsinglesupp(find?.id);

//         setSupplierDetailes((prev) => ({
//           ...prev,
//           SupplierCode: find.id,
//           SupplierMailId: getobj?.EmailAddress || '',
//           SupplierContactNumber: getobj?.ContactNumber || '',
//           SupplierContactPerson: getobj?.ContactPerson || '',
//           Location: '1' || '',
//           StoreLocation: allowedStoreId || '',
//         }));
//       } else {
//         const tdata = {
//           message: `Supplier Was Not Found`,
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       }
//     }
//   };

//   const handleSearchGRNdetailes = () => {
//     let find = GRNDetailState.find(
//       (ele) => '' + ele.GRNNumber === '' + ReturnItemState.GRNInvoiceNo
//     );

//     if (find) {
//       setReturnItemState({
//         GRNInvoiceNo: find.GRNNumber,
//         GRN_No: find.GRN_No,
//         GRNDate: find.GrnDate,
//         SupplierBillNo: find.SupplierBillNumber,
//         SupplierBillDate: find.SupplierBillDate,
//         Reason: '',
//         ItemCode: '',
//         ItemName: '',
//       });
//     } else {
//       const tdata = {
//         message: `GRN Was Not Found`,
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     }
//   };

//   const handleSearchItemDetails = (condition) => {
//     if (condition === 'ItemCode') {
//       let find = GRNItemState.find(
//         (ele) => '' + ele.ItemCode === '' + ReturnItemState.ItemCode
//       );
// console.log('find------',find);

//       if (find) {
//         const {
//           ItemCode,
//           ItemName,
//           AvailableQuantity,
//           SingleProductPurchaseAmount,
//           ...prevlist
//         } = find;

//         setReturnItemState((prev) => ({
//           GRNInvoiceNo: prev.GRNInvoiceNo,
//           GRN_No: prev.GRN_No,
//           GRNDate: prev.GRNDate,
//           SupplierBillNo: prev.SupplierBillNo,
//           SupplierBillDate: prev.SupplierBillDate,
//           Reason: prev.Reason,
//           ItemCode: ItemCode,
//           ItemName: ItemName,
//           ...prevlist,
//         }));

//         if (AvailableQuantity) {
//           setReturnQtyState((prev) => ({
//             ...prev,
//             PurchaseAmount: SingleProductPurchaseAmount,
//             AvailablePackQuantity: AvailableQuantity,
//           }));
//         }
//       } else {
//         const tdata = {
//           message: `GRN Item Was Not Found`,
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       }
//     } else if (condition === 'ItemName') {
//       let find = GRNItemState.find(
//         (ele) => ele.ItemName === ReturnItemState.ItemName
//       );

//       if (find) {
//         const {
//           ItemCode,
//           ItemName,
//           AvailableQuantity,
//           SingleProductPurchaseAmount,
//           ...prevlist
//         } = find;

//         setReturnItemState((prev) => ({
//           GRNInvoiceNo: prev.GRNInvoiceNo,
//           GRN_No: prev.GRN_No,
//           GRNDate: prev.GRNDate,
//           SupplierBillNo: prev.SupplierBillNo,
//           SupplierBillDate: prev.SupplierBillDate,
//           Reason: prev.Reason,
//           ItemCode: ItemCode,
//           ItemName: ItemName,
//           ...prevlist,
//         }));

//         if (AvailableQuantity) {
//           setReturnQtyState((prev) => ({
//             ...prev,
//             PurchaseAmount: SingleProductPurchaseAmount,
//             AvailablePackQuantity: AvailableQuantity,
//           }));
//         }
//       } else {
//         const tdata = {
//           message: `GRN Item Was Not Found`,
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       }
//     }
//   };

//   const SavePurchaseReturnItem = () => {
//     let requiredFields = [
//       'PurchaseAmount',
//       'AvailablePackQuantity',
//       'ReturnQuantity',
//       'ReturnPackQuantity',
//       'ReturnQuantityAmount',
      
//     ];
//     let missingFields = requiredFields.filter(
//       (field) => !ReturnQtyState[field]
//     );

//     const CheckDub = ReturnItemList.some(
//       (product) =>
//         '' + product.ItemCode === '' + ReturnItemState.ItemCode &&
//         product?.id !== ReturnItemState?.id &&
//         product?.GRNInvoiceNo === ReturnItemState.GRNInvoiceNo &&
//         product.BatchNo === ReturnItemState?.BatchNo
//     );

//     if (missingFields.length !== 0) {
//       const tdata = {
//         message: `Please fill out all required fields: ${missingFields.join(', ')}`,
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     } else if (CheckDub) {
//       const tdata = {
//         message: `This Item Already Entered GRNInvoiceNo :${ReturnItemState.GRNInvoiceNo},ItemName :${ReturnItemState.ItemName} and BatchNo:${ReturnItemState.BatchNo}`,
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     } else {
//       if (ReturnItemState.id) {
//         setReturnItemList((prev) =>
//           prev.map((product) =>
//             product.id === ReturnItemState.id
//               ? { ...ReturnItemState, ...ReturnQtyState }
//               : product
//           )
//         );

//         Clear_setReturnItemState();
//         Clear_setReturnQtyState();
//       } else {
//         setReturnItemList((prev) => [
//           ...prev,
//           { ...ReturnItemState, ...ReturnQtyState, id: prev.length + 1 },
//         ]);

//         Clear_setReturnItemState();
//         Clear_setReturnQtyState();
//       }
//     }
//   };

//   const handleDeleteItem = (row) => {
//     Clear_setReturnItemState();
//     Clear_setReturnQtyState();

//     const updatedArray = ReturnItemList.filter((ele) => ele.id !== row.id);

//     const reindexedArray = updatedArray.map((item, index) => ({
//       ...item,
//       id: index + 1,
//     }));

//     setReturnItemList(reindexedArray);

//     const tdata = {
//       message: `${row.ItemName} has been deleted successfully.`,
//       type: 'success',
//     };
//     dispatchvalue({ type: 'toast', value: tdata });
//   };

//   const HandelEditdata = (row) => {
//     const {
//       id,
//       PurchaseAmount,
//       AvailablePackQuantity,
//       ReturnQuantity,
//       ReturnPackQuantity,
//       ReturnQuantityAmount,
//       Remarks,
//       ...rest
//     } = row;

//     setReturnItemState({
//       id: id,
//       ...rest,
//     });

//     setReturnQtyState({
//       PurchaseAmount: PurchaseAmount,
//       AvailablePackQuantity: AvailablePackQuantity,
//       ReturnQuantity: ReturnQuantity,
//       ReturnPackQuantity: ReturnPackQuantity,
//       ReturnQuantityAmount: ReturnQuantityAmount,
//       Remarks: Remarks,
//     });
//   };

//   const ProductListColumn = [
//     {
//       key: 'id',
//       name: 'S.No',
//       frozen: true,
//     },
//     {
//       key: 'GRNInvoiceNo',
//       name: 'GRNInvoiceNo',
//       frozen: true,
//     },
//     {
//       key: 'ItemCode',
//       name: 'Item Code',
//       frozen: true,
//     },
//     {
//       key: 'ItemName',
//       name: 'Item Name',
//       frozen: true,
//     },
//     {
//       key: 'GenericName',
//       name: 'Generic Name',
//     },
//     {
//       key: 'CompanyName',
//       name: 'Manufacturer Name',
//     },
//     {
//       key: 'HSNCode',
//       name: 'HSN Code',
//     },
//     {
//       key: 'Strength',
//       name: 'Strength',
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
//       key: 'PurchaseRateWithTax',
//       name: 'Purchase Rate With Tax',
//     },
//     {
//       key: 'PurchaseQuantity',
//       name: 'Purchase Quantity',
//     },
//     {
//       key: 'TotalAmount',
//       name: 'Total Amount',
//     },
//     {
//       key: 'PurchaseAmount',
//       name: 'PurchaseAmount',
//     },
//     {
//       key: 'ReturnQuantity',
//       name: 'Return Quantity',
//     },
//     {
//       key: 'ReturnQuantityAmount',
//       name: 'ReturnQuantityAmount',
//     },
//     {
//       key: 'Action',
//       name: 'Action',
//       renderCell: (Params) => (
//         <>
//           <Button
//             className="cell_btn"
//             onClick={() => HandelEditdata(Params.row)}
//           >
//             <EditIcon className="check_box_clrr_cancell" />
//           </Button>
//           <Button
//             className="cell_btn"
//             onClick={() => handleDeleteItem(Params.row)}
//           >
//             <DeleteOutlineIcon className="check_box_clrr_cancell" />
//           </Button>
//         </>
//       ),
//     },
//   ];

//   const SavePurchaseReturn = () => {
//     console.log('ReturnItemList', ReturnItemList);

//     let requiredFields = ['ReturnDate', 'SupplierCode', 'StoreLocation'];

//     const missingFields = requiredFields.filter(
//       (field) => !SupplierDetailes[field]
//     );

//     let requiredFields2 = [
//       'ReturnTotalItem',
//       'ReturnTotalQuantity',
//       'ReturnTotalAmount',
//     ];

//     const missingFields2 = requiredFields2.filter(
//       (field) => !FinalState[field]
//     );

//     if (missingFields.length > 0 || missingFields2.length > 0) {
//       let allmissingFields = [...missingFields, ...missingFields2];

//       const tdata = {
//         message: `Please fill out all required fields: ${allmissingFields.join(', ')}`,
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     } else if (ReturnItemList.length === 0) {
//       const tdata = {
//         message: `Please Entry Return Items`,
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     } else {
//       let SendItems;

//       if (EdittData && Object.keys(EdittData).length !== 0) {
//         SendItems = {
//           SupplierDetailes: {
//             ...SupplierDetailes,
//             ...FinalState,
//             PurchaseReturnNumber: "",
//           },
//           ReturnItemList: ReturnItemList,
//           Create_by: userRecord?.username,
//         };
//       } else {
//         SendItems = {
//           SupplierDetailes: { ...SupplierDetailes, ...FinalState },
//           ReturnItemList: ReturnItemList,
//           Create_by: userRecord?.username,
//         };
//       }

//       console.log('SendItems', SendItems);

//       axios
//         .post(`${UrlLink}Inventory/PurcchaseReturn_Link`, SendItems)
//         .then((res) => {
//           console.log(res.data);

//           let resdata = res.data;
//           let type = Object.keys(resdata)[0];
//           let mess = Object.values(resdata)[0];
//           const tdata = {
//             message: mess,
//             type: type,
//           };
//           dispatchvalue({ type: 'toast', value: tdata });
//           if (type === 'success') {
//             navigate('/Home/PurchaseReturnList');
//             // navigate('/Home/InventoryMaster');
//             dispatchvalue({ type: 'HrFolder', value: 'SupplierPay' });
//             dispatchvalue({ type: 'setPreviousFolder', value: null });
//             dispatchvalue({ type: 'showMenu', value: true });
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   };


// useEffect(() => {
//   if (suplierdata) {
//     setSupplierDetailes(prev => ({
//       ...prev,
//       SupplierCode: suplierdata.SupplierCode || '',
//       SupplierName: suplierdata.SupplierName || '',
//       // Keep other supplier fields if needed
//     }));

//     setReturnItemState(prev => ({
//       ...prev,
//       GRNInvoiceNo: suplierdata.GRN_Invoice || '',
//       GRN_No: suplierdata.GRN_No || '',
//       GRNDate: suplierdata.GRN_Date || '',
//       SupplierBillNo: suplierdata.GRN_Invoice || '', // if needed
//       SupplierBillDate: suplierdata.Supplier_Bill_Date || '',
//     }));

//     setReturnQtyState(prev => ({
//       ...prev,
//       PurchaseAmount: suplierdata.GRN_Invoice_Amount || '',
//       ReturnQuantityAmount: suplierdata.GRN_Balance_Amount || '',
//       ReturnPackQuantity: suplierdata.GRN_Balance_Amount || '',
//       // Other fields if needed
//     }));
//   }
// }, [suplierdata]);

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Debit Return</h3>

//         <br />

//         <div className="RegisFormcon_1">
//           {Object.entries(SupplierDetailes).map(([StateName, value], index) => (
//             <div className="RegisForm_1" key={index + 'key'}>
//               <label htmlFor={StateName}>
//                 {formatLabel(StateName)} <span>:</span>
//               </label>

//               {['Location', 'StoreLocation'].includes(StateName) ? (
//                 <select
//                   id={StateName}
//                   name={StateName}
//                   value={SupplierDetailes[StateName]}
//                   onChange={HandleonchangeSupplierState}
//                   disabled={
//                     (SupplierDetailes.SupplierCode === '' &&
//                       StateName === 'Location') ||
//                     (SupplierDetailes.Location === '' &&
//                       StateName === 'StoreLocation')
//                   }
//                 >
//                   <option value="">Select</option>
//                   {StateName === 'Location'
//                     ? LocationData.map((ele, ind) => (
//                         <option key={ind + 'key'} value={ele.id}>
//                           {ele.locationName}
//                         </option>
//                       ))
//                     : StoreData.map((ele, ind) => (
//                         <option key={ind + 'key'} value={ele.id}>
//                           {ele.StoreName}
//                         </option>
//                       ))}
//                 </select>
//               ) : (
//                 <div className="Search_patient_icons">
//                   <input
//                     type={StateName === 'ReturnDate' ? 'date' : 'text'}
//                     id={StateName}
//                     name={StateName}
//                     value={SupplierDetailes[StateName]}
//                     list={StateName + 'list'}
//                     onChange={HandleonchangeSupplierState}
//                     disabled={[
//                       'SupplierMailId',
//                       'SupplierContactNumber',
//                       'SupplierContactPerson',
//                     ].includes(StateName)}
//                   />
//                   {['SupplierCode', 'SupplierName'].includes(StateName) ? (
//                     <>
//                       <datalist id={StateName + 'list'}>
//                         {supplierArray.map((ele, ind) => (
//                           <option
//                             key={ind + 'key'}
//                             value={
//                               StateName === 'SupplierCode'
//                                 ? ele.id 
//                                 : ele.SupplierName
//                             }
//                           ></option>
//                         ))}
//                       </datalist>
//                       <span
//                         onClick={(e) =>
//                           handleSearchSupplierlist(
//                             StateName === 'SupplierCode'
//                               ? 'SupplierCode'
//                               : 'SupplierName'
//                           )
//                         }
//                       >
//                         <ManageSearchIcon />
//                       </span>
//                     </>
//                   ) : (
//                     <></>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         <br />

//         <div className="common_center_tag">
//           <span>ITEM DETAILES</span>
//         </div>
//         <br />

//         <div className="RegisFormcon_1">
//           {Object.keys(ReturnItemState)
//             .filter((ele) => ele !== 'id')
//             .map((StateName, index) => (
//               <div className="RegisForm_1" key={index + 'key'}>
//                 <label htmlFor={StateName}>
//                   {formatLabel(StateName)} <span>:</span>
//                 </label>

//                 {StateName === 'Reason' ? (
//                   <select
//                     id={StateName}
//                     name={StateName}
//                     value={ReturnItemState[StateName]}
//                     onChange={HandelOnchaneItemState}
//                     disabled={
//                       ReturnItemState.SupplierBillNo === '' &&
//                       StateName === 'Reason'
//                     }
//                   >
//                     <option value="">Select</option>
//                     <option value="QualityIssue">Quality Issue</option>
//                     <option value="ExcessItems">Excess Items</option>
//                     <option value="Damage">Damage</option>
//                     <option value="ExpiredReturn">Expired Return</option>
//                   </select>
//                 ) : (
//                   <div className="Search_patient_icons">
//                     <input
//                       type={
//                         ['GRNDate', 'SupplierBillDate'].includes(StateName)
//                           ? 'date'
//                           : 'text'
//                       }
//                       id={StateName}
//                       name={StateName}
//                       value={ReturnItemState[StateName]}
//                       disabled={
//                         !['GRN_No','GRNInvoiceNo', 'ItemCode', 'ItemName'].includes(
//                           StateName
//                         ) ||
//                         (SupplierDetailes.StoreLocation === '' &&
//                           StateName === 'GRNInvoiceNo') ||
//                         (ReturnItemState.Reason === '' &&
//                           ['ItemCode', 'ItemName'].includes(StateName))
//                       }
//                       onChange={HandelOnchaneItemState}
//                       list={`${StateName}list`}
//                       autoComplete="off"
//                     />

//                     {StateName === 'GRNInvoiceNo' ? (
//                       <>
//                         <datalist id={`${StateName}list`}>
//                           {GRNDetailState.map((ele, ind) => (
//                             <option
//                               key={`${ind}key`}
//                               value={`${ele.GRNNumber}`}
//                             >
//                               {`GRN Date: ${ele.GrnDate} | GRN_No : ${ele.GRN_No} | S.Bill No: ${ele.SupplierBillNumber} | S.Bill Date: ${ele.SupplierBillDate}`}
//                             </option>
//                           ))}
//                         </datalist>
//                         <span onClick={handleSearchGRNdetailes}>
//                           <ManageSearchIcon />
//                         </span>
//                       </>
//                     ) : ['ItemCode', 'ItemName'].includes(StateName) ? (
//                       <>
//                         <datalist id={`${StateName}list`}>
//                           {GRNItemState.map((ele, ind) => (
//                             <option
//                               key={`${ind}key`}
//                               value={
//                                 StateName === 'ItemCode'
//                                   ? ele.ItemCode
//                                   : ele.ItemName
//                               }
//                             >
//                               {StateName === 'ItemCode'
//                                 ? `Item Name: ${ele.ItemName} | BatchNo: ${ele.BatchNo} | Received Quantity: ${ele.PurchaseQuantity}`
//                                 : `Item Code: ${ele.ItemCode} | BatchNo: ${ele.BatchNo} | Received Quantity: ${ele.PurchaseQuantity}`}
//                             </option>
//                           ))}
//                         </datalist>
//                         <span
//                           onClick={(e) => {
//                             handleSearchItemDetails(
//                               StateName === 'ItemCode' ? 'ItemCode' : 'ItemName'
//                             );
//                           }}
//                         >
//                           <ManageSearchIcon />
//                         </span>
//                       </>
//                     ) : null}
//                   </div>
//                 )}
//               </div>
//             ))}
//         </div>

//         <br />

//         {ReturnQtyState.AvailablePackQuantity !== '' && (
//           <div className="RegisFormcon_1">
//             {Object.entries(ReturnQtyState).map(([StateName, value], index) => (
//               <div className="RegisForm_1" key={index + 'key'}>
//                 <label htmlFor={StateName}>
//                   {formatLabel(StateName)} <span>:</span>
//                 </label>

//                 {StateName === 'Remarks' ? (
//                   <textarea
//                     id={StateName}
//                     name={StateName}
//                     value={ReturnQtyState[StateName]}
//                     onChange={HandelOnchaneReturnQty}
//                   ></textarea>
//                 ) : (
//                   <>
//                     <input
//                       type="number"
//                       id={StateName}
//                       name={StateName}
//                       value={ReturnQtyState[StateName]}
//                       onChange={HandelOnchaneReturnQty}
//                       disabled={!['ReturnQuantity'].includes(StateName)}
//                     />
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         <br />
//         {ReturnQtyState.AvailablePackQuantity && (
//           <div className="Main_container_Btn">
//             <button onClick={SavePurchaseReturnItem}>
//               {ReturnItemState.id ? 'Update' : 'Add'}
//             </button>
//           </div>
//         )}
//         <br />

//         {ReturnItemList.length !== 0 && (
//           <div className="RegisFormcon_1 jjxjx_">
//             <ReactGrid columns={ProductListColumn} RowData={ReturnItemList} />
//           </div>
//         )}

//         <br />

//         {ReturnItemList.length !== 0 && (
//           <div className="RegisFormcon_1">
//             {Object.keys(FinalState).map((StateName, index) => (
//               <div className="RegisForm_1" key={index + 'key'}>
//                 <label htmlFor={StateName}>
//                   {formatLabel(StateName)} <span>:</span>
//                 </label>
//                 <input
//                   type="number"
//                   id={StateName}
//                   name={StateName}
//                   value={FinalState[StateName]}
//                   disabled
//                 />
//               </div>
//             ))}
//           </div>
//         )}

//         <br />

//         {ReturnItemList.length !== 0 && (
//           <div className="Main_container_Btn">
//             <button onClick={SavePurchaseReturn}>
//               Save
//               {/* {Object.keys(EdittData).length !==0 ? 'Update' :'Save' } */}
//             </button>
//           </div>
//         )}
//       </div>
//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </>
//   );
// };

// export default DebitReturn;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const DebitReturn = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const EdittData = useSelector((state) => state.Inventorydata?.PurchaseReturnList);
  const suplierdata = useSelector((state) => state.Inventorydata?.Supplierpaydata);

  console.log('Supplierpaydata', suplierdata);

  const [supplierArray, setsupplierArray] = useState([]);
  const [LocationData, setLocationData] = useState([]);
  const [StoreData, setStoreData] = useState([]);
  const [GRNDetailState, setGRNDetailState] = useState([]);
  const [GRNItemState, setGRNItemState] = useState([]);
  const [ReturnItemList, setReturnItemList] = useState([]);
  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";

  const [SupplierDetailes, setSupplierDetailes] = useState({
    ReturnDate: currentDate,
    SupplierCode: '',
    SupplierName: '',
    SupplierMailId: '',
    SupplierContactNumber: '',
    SupplierContactPerson: '',
    Location: '1' || '',
    StoreLocation: allowedStoreId || '',
  });

  const [ReturnItemState, setReturnItemState] = useState({
    GRNInvoiceNo: '',
    GRN_No: '',
    GRNDate: '',
    SupplierBillNo: '',
    SupplierBillDate: '',
    Reason: '',
    ItemCode: '',
    ItemName: '',
    BatchNo: '', // Add BatchNo to state
  });

  const [ReturnQtyState, setReturnQtyState] = useState({
    PurchaseAmount: '',
    AvailablePackQuantity: '',
    ReturnQuantity: '',
    ReturnPackQuantity: '',
    ReturnQuantityAmount: '',
    Remarks: '',
  });

  const [FinalState, setFinalState] = useState({
    ReturnTotalItem: '',
    ReturnTotalQuantity: '',
    ReturnTotalAmount: '',
  });

  // Add new state for search
  const [searchItem, setSearchItem] = useState({
    ItemCode: '',
    ItemName: '',
    BatchNo: ''
  });

  const Clear_setReturnItemState = () => {
    setReturnItemState({
      GRNInvoiceNo: '',
      GRN_No: '',
      GRNDate: '',
      SupplierBillNo: '',
      SupplierBillDate: '',
      Reason: '',
      ItemCode: '',
      ItemName: '',
      BatchNo: '',
    });
  };

  const Clear_setReturnQtyState = () => {
    setReturnQtyState({
      PurchaseAmount: '',
      AvailablePackQuantity: '',
      ReturnQuantity: '',
      ReturnPackQuantity: '',
      ReturnQuantityAmount: '',
      Remarks: '',
    });
  };

  const clear_finalstate = () => {
    setReturnItemList([]);
    setFinalState({
      ReturnTotalItem: '',
      ReturnTotalQuantity: '',
      ReturnTotalAmount: '',
    });
  };

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  useEffect(() => {
    if (ReturnItemList && ReturnItemList.length !== 0) {
      let TotalQty = ReturnItemList.reduce(
        (acc, item) => acc + (+item.ReturnQuantity || 0),
        0
      );

      let TotalNetAmount = ReturnItemList.reduce(
        (acc, item) => acc + (+item.ReturnQuantityAmount || 0),
        0
      );

      setFinalState({
        ReturnTotalItem: ReturnItemList.length,
        ReturnTotalQuantity: TotalQty,
        ReturnTotalAmount: TotalNetAmount,
      });
    } else {
      setFinalState({
        ReturnTotalItem: '',
        ReturnTotalQuantity: '',
        ReturnTotalAmount: '',
      });
    }
  }, [ReturnItemList]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
      .then((res) => {
        console.log('pppp----', res.data);
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
    if (SupplierDetailes.Location && SupplierDetailes.Location !== '') {
      axios
        .get(
          `${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${SupplierDetailes.Location}&IsFromWardStore=${false}`
        )
        .then((res) => {
          const ress = res.data || [];
          setStoreData(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [SupplierDetailes.Location]);

  useEffect(() => {
    if (
      SupplierDetailes?.SupplierCode !== '' &&
      SupplierDetailes?.StoreLocation !== ''
    ) {
      axios
        .get(
          `${UrlLink}Inventory/GRN_Details_GET_For_PurchseReturn?SupplierCode=${SupplierDetailes.SupplierCode}&StoreLocation=${SupplierDetailes.StoreLocation}`
        )
        .then((res) => {
          console.log(res.data);
          let data = res.data;
          setGRNDetailState(data && Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [SupplierDetailes.SupplierCode, SupplierDetailes.StoreLocation]);

  useEffect(() => {
    if (ReturnItemState.GRNInvoiceNo !== '' && ReturnItemState.Reason !== '') {
      axios
        .get(
          `${UrlLink}Inventory/GRN_Details_GET_For_PurchseReturn?GRNInvoiceNo=${ReturnItemState.GRNInvoiceNo}&Reason=${ReturnItemState.Reason}`
        )
        .then((res) => {
          console.log('GRN Item Data:', res.data);
          let data = res.data;
          setGRNItemState(data && Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [ReturnItemState.GRNInvoiceNo, ReturnItemState.Reason]);

  useEffect(() => {
    if (EdittData && Object.keys(EdittData).length !== 0) {
      // Update Supplier Details
      setSupplierDetailes({
        ReturnDate: currentDate,
        SupplierCode: EdittData?.SupplierCode,
        SupplierName: EdittData?.SupplierName,
        SupplierMailId: EdittData?.SupplierMailId || '',
        SupplierContactNumber: EdittData?.SupplierContactNumber || '',
        SupplierContactPerson: EdittData?.SupplierContactPerson || '',
        Location: EdittData?.Location || '',
        StoreLocation: EdittData?.StoreLocation || '',
      });
      setReturnItemState({
        Reason: EdittData.Reason,
      });
    
      // Find GRN Details
      let grnFind = GRNDetailState.find(
        (ele) => '' + ele.GRNNumber === '' + EdittData?.GRNNumber
      );
      console.log('grnFind----------', grnFind);
      if (grnFind) {
        console.log('GRN Details Found');
        setReturnItemState((prevState) => ({
          ...prevState,
          GRNInvoiceNo: grnFind.GRNNumber,
          GRN_No: grnFind.GRN_No,
          GRNDate: grnFind.GrnDate,
          SupplierBillNo: grnFind.SupplierBillNumber,
          SupplierBillDate: grnFind.SupplierBillDate,
        }));
      }

      // Find Item Details
      let itemFind = GRNItemState.find(
        (ele) => '' + ele.ItemCode === '' + EdittData?.ItemCode && ele.BatchNo === EdittData?.BatchNo
      );
      if (itemFind) {
        console.log('0000000000000000000', itemFind);
        const {
          ItemCode,
          ItemName,
          AvailableQuantity,
          SingleProductPurchaseAmount,
          BatchNo,
          ...restData
        } = itemFind;

        setReturnItemState((prev) => ({
          ...prev, // Preserve existing values
          ItemCode: ItemCode,
          ItemName: ItemName,
          BatchNo: BatchNo,
          ...restData, // Merge other properties
        }));

        if (AvailableQuantity) {
          setReturnQtyState((prev) => ({
            ...prev,
            PurchaseAmount: SingleProductPurchaseAmount,
            AvailablePackQuantity: AvailableQuantity,
          }));

        }  
        setReturnQtyState((prev) => {
          const returnQuantity = EdittData?.AvailableQuantity || '';
          const returnPackQuantity =
            +returnQuantity * +ReturnItemState?.PackQuantity || 0;
          const returnQuantityAmount = (
            +returnQuantity * +prev?.PurchaseAmount || 0
          ).toFixed(2);
  
          console.log('returnQuantityAmount----',returnQuantityAmount)
  
          return {
            ...prev,
            ReturnQuantity: returnQuantity,
            ReturnPackQuantity: returnQuantity,
            ReturnQuantityAmount: returnQuantityAmount,
            Remarks: '',
          };
        });
  
      }
    }
  }, [EdittData, GRNDetailState, GRNItemState]);

  const Getsinglesupp = async (SupplierId) => {
    try {
      const res = await axios.get(
        `${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierId=${SupplierId}`
      );
      const result = res.data;
      if (result && Object.values(result).length !== 0) {
        // console.log('result-----', result);
        return result;
      }
    } catch (err) {
      console.log(err);
      return '';
    }
  };

  // FIXED: Correct function name - HandleonchangeSupplierState
  const HandleonchangeSupplierState = async (e) => {
    const { name, value } = e.target;

    // Clear_setReturnItemState();
    // Clear_setReturnQtyState();
    // clear_finalstate();

    if (name === 'SupplierCode') {
      setSupplierDetailes((prev) => ({
        ...prev,
        [name]: value,
        SupplierName: '',
        SupplierMailId: '',
        SupplierContactNumber: '',
        SupplierContactPerson: '',
        Location: '1' || '',
        StoreLocation: allowedStoreId || '',
      }));
    } else if (name === 'SupplierName') {
      setSupplierDetailes((prev) => ({
        ...prev,
        [name]: value,
        SupplierCode: '',
        SupplierMailId: '',
        SupplierContactNumber: '',
        SupplierContactPerson: '',
        Location: '1' || '',
        StoreLocation: allowedStoreId || '',
      }));
    } else if (name === 'Location') {
      setSupplierDetailes((prev) => ({
        ...prev,
        [name]: value,
        StoreLocation: allowedStoreId || '',
      }));
    } else {
      setSupplierDetailes((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const HandelOnchaneItemState = (e) => {
    const { name, value } = e.target;
    Clear_setReturnQtyState();

    if (name === 'Reason') {
      setReturnItemState((prev) => ({
        GRNInvoiceNo: prev.GRNInvoiceNo,
        GRN_No: prev.GRN_No,
        GRNDate: prev.GRNDate,
        SupplierBillNo: prev.SupplierBillNo,
        SupplierBillDate: prev.SupplierBillDate,
        [name]: value,
        ItemCode: '',
        ItemName: '',
        BatchNo: '',
      }));
    } else if (name === 'GRNInvoiceNo') {
      setReturnItemState({
        GRNInvoiceNo: value,
        GRN_No: '',
        GRNDate: '',
        SupplierBillNo: '',
        SupplierBillDate: '',
        Reason: '',
        ItemCode: '',
        ItemName: '',
        BatchNo: '',
      });
    } else if (name === 'ItemCode') {
      setReturnItemState((prev) => ({
        GRNInvoiceNo: prev.GRNInvoiceNo,
        GRN_No: prev.GRN_No,
        GRNDate: prev.GRNDate,
        SupplierBillNo: prev.SupplierBillNo,
        SupplierBillDate: prev.SupplierBillDate,
        Reason: prev.Reason,
        [name]: value,
        ItemName: '',
        BatchNo: '',
      }));
    } else if (name === 'ItemName') {
      setReturnItemState((prev) => ({
        GRNInvoiceNo: prev.GRNInvoiceNo,
        GRN_No: prev.GRN_No,
        GRNDate: prev.GRNDate,
        SupplierBillNo: prev.SupplierBillNo,
        SupplierBillDate: prev.SupplierBillDate,
        Reason: prev.Reason,
        ItemCode: '',
        [name]: value,
        BatchNo: '',
      }));
    } else {
      setReturnItemState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const HandelOnchaneReturnQty = (e) => {
    const { name, value } = e.target;

    if (name === 'ReturnQuantity') {
      if (
        +value * +ReturnItemState?.PackQuantity >
        ReturnQtyState.AvailablePackQuantity
      ) {
        const tdata = {
          message: `Return Quantity Greater than Available Quantity`,
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      } else {
        setReturnQtyState((prev) => ({
          ...prev,
          [name]: value,
          ReturnPackQuantity: +value * +ReturnItemState?.PackQuantity,
          ReturnQuantityAmount: (
            +value * +ReturnQtyState?.PurchaseAmount
          ).toFixed(2),
        }));
      }
    } else {
      setReturnQtyState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSearchSupplierlist = async (conditions) => {
    if (conditions === 'SupplierCode') {
      let find = supplierArray.find(
        (ele) => ele.id === SupplierDetailes.SupplierCode
      );

      if (find) {
        let getobj = await Getsinglesupp(SupplierDetailes.SupplierCode);

        setSupplierDetailes((prev) => ({
          ...prev,
          SupplierName: find.SupplierName,
          SupplierMailId: getobj?.EmailAddress || '',
          SupplierContactNumber: getobj?.ContactNumber || '',
          SupplierContactPerson: getobj?.ContactPerson || '',
          Location: '1' || '',
          StoreLocation: allowedStoreId || '',
        }));
      } else {
        const tdata = {
          message: `Supplier Was Not Found`,
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      }
    } else if (conditions === 'SupplierName') {
      let find = supplierArray.find(
        (ele) => ele.SupplierName === SupplierDetailes.SupplierName
      );

      if (find) {
        let getobj = await Getsinglesupp(find?.id);

        setSupplierDetailes((prev) => ({
          ...prev,
          SupplierCode: find.id,
          SupplierMailId: getobj?.EmailAddress || '',
          SupplierContactNumber: getobj?.ContactNumber || '',
          SupplierContactPerson: getobj?.ContactPerson || '',
          Location: '1' || '',
          StoreLocation: allowedStoreId || '',
        }));
      } else {
        const tdata = {
          message: `Supplier Was Not Found`,
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      }
    }
  };

  const handleSearchGRNdetailes = () => {
    let find = GRNDetailState.find(
      (ele) => '' + ele.GRNNumber === '' + ReturnItemState.GRNInvoiceNo
    );

    if (find) {
      setReturnItemState({
        GRNInvoiceNo: find.GRNNumber,
        GRN_No: find.GRN_No,
        GRNDate: find.GrnDate,
        SupplierBillNo: find.SupplierBillNumber,
        SupplierBillDate: find.SupplierBillDate,
        Reason: '',
        ItemCode: '',
        ItemName: '',
        BatchNo: '',
      });
    } else {
      const tdata = {
        message: `GRN Was Not Found`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  // Fix the search function to find by ItemCode AND BatchNo
  const handleSearchItemDetails = () => {
    console.log('Searching for:', searchItem);
    console.log('Available items:', GRNItemState);

    // First filter by ItemCode if provided
    let filteredItems = GRNItemState;
    
    if (searchItem.ItemCode) {
      filteredItems = filteredItems.filter(
        (ele) => '' + ele.ItemCode === '' + searchItem.ItemCode
      );
    }
    
    // Then filter by ItemName if provided
    if (searchItem.ItemName && !searchItem.ItemCode) {
      filteredItems = filteredItems.filter(
        (ele) => ele.ItemName === searchItem.ItemName
      );
    }
    
    // Then filter by BatchNo if provided
    if (searchItem.BatchNo) {
      filteredItems = filteredItems.filter(
        (ele) => ele.BatchNo === searchItem.BatchNo
      );
    }

    console.log('Filtered items:', filteredItems);

    if (filteredItems.length === 0) {
      const tdata = {
        message: `Item not found with the given criteria`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
      return;
    }

    if (filteredItems.length === 1) {
      // If only one item found, use it
      const find = filteredItems[0];
      setReturnItemFromData(find);
    } else {
      // If multiple items found, show message or handle selection
      const tdata = {
        message: `Found ${filteredItems.length} items. Please select a specific BatchNo`,
        type: 'info',
      };
      dispatchvalue({ type: 'toast', value: tdata });
      
      // You could show a modal or dropdown to select the specific batch
      // For now, let's use the first one but warn about batch selection
      const find = filteredItems[0];
      setReturnItemFromData(find);
      
      // Also show batch options in the search field
      const batchOptions = filteredItems.map(item => item.BatchNo).join(', ');
      console.log('Available BatchNos:', batchOptions);
    }
  };

  // Helper function to set item data
  const setReturnItemFromData = (find) => {
    const {
      ItemCode,
      ItemName,
      AvailableQuantity,
      SingleProductPurchaseAmount,
      BatchNo,
      ...prevlist
    } = find;

    setReturnItemState((prev) => ({
      ...prev,
      ItemCode: ItemCode,
      ItemName: ItemName,
      BatchNo: BatchNo,
      ...prevlist,
    }));

    setSearchItem({
      ItemCode: '',
      ItemName: '',
      BatchNo: ''
    });

    if (AvailableQuantity) {
      setReturnQtyState((prev) => ({
        ...prev,
        PurchaseAmount: SingleProductPurchaseAmount,
        AvailablePackQuantity: AvailableQuantity,
      }));
    }
  };

  // Add handler for search fields
  const handleSearchItemChange = (e) => {
    const { name, value } = e.target;
    setSearchItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const SavePurchaseReturnItem = () => {
    let requiredFields = [
      'PurchaseAmount',
      'AvailablePackQuantity',
      'ReturnQuantity',
      'ReturnPackQuantity',
      'ReturnQuantityAmount',
    ];
    
    let missingFields = requiredFields.filter(
      (field) => !ReturnQtyState[field]
    );

    // IMPORTANT: Include BatchNo in duplicate check
    const CheckDub = ReturnItemList.some(
      (product) =>
        '' + product.ItemCode === '' + ReturnItemState.ItemCode &&
        product?.id !== ReturnItemState?.id &&
        product?.GRNInvoiceNo === ReturnItemState.GRNInvoiceNo &&
        product?.BatchNo === ReturnItemState?.BatchNo
    );

    if (missingFields.length !== 0) {
      const tdata = {
        message: `Please fill out all required fields: ${missingFields.join(', ')}`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else if (!ReturnItemState.BatchNo) {
      const tdata = {
        message: `Please select a BatchNo for the item`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else if (CheckDub) {
      const tdata = {
        message: `This Item Already Entered GRNInvoiceNo: ${ReturnItemState.GRNInvoiceNo}, ItemName: ${ReturnItemState.ItemName} and BatchNo: ${ReturnItemState.BatchNo}`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else {
      if (ReturnItemState.id) {
        setReturnItemList((prev) =>
          prev.map((product) =>
            product.id === ReturnItemState.id
              ? { ...ReturnItemState, ...ReturnQtyState }
              : product
          )
        );

        Clear_setReturnItemState();
        Clear_setReturnQtyState();
      } else {
        setReturnItemList((prev) => [
          ...prev,
          { ...ReturnItemState, ...ReturnQtyState, id: prev.length + 1 },
        ]);

        Clear_setReturnItemState();
        Clear_setReturnQtyState();
      }
    }
  };

  const handleDeleteItem = (row) => {
    Clear_setReturnItemState();
    Clear_setReturnQtyState();

    const updatedArray = ReturnItemList.filter((ele) => ele.id !== row.id);

    const reindexedArray = updatedArray.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setReturnItemList(reindexedArray);

    const tdata = {
      message: `${row.ItemName} has been deleted successfully.`,
      type: 'success',
    };
    dispatchvalue({ type: 'toast', value: tdata });
  };

  const HandelEditdata = (row) => {
    const {
      id,
      PurchaseAmount,
      AvailablePackQuantity,
      ReturnQuantity,
      ReturnPackQuantity,
      ReturnQuantityAmount,
      Remarks,
      ...rest
    } = row;

    setReturnItemState({
      id: id,
      ...rest,
    });

    setReturnQtyState({
      PurchaseAmount: PurchaseAmount,
      AvailablePackQuantity: AvailablePackQuantity,
      ReturnQuantity: ReturnQuantity,
      ReturnPackQuantity: ReturnPackQuantity,
      ReturnQuantityAmount: ReturnQuantityAmount,
      Remarks: Remarks,
    });
  };

  const ProductListColumn = [
    {
      key: 'id',
      name: 'S.No',
      frozen: true,
    },
    {
      key: 'GRNInvoiceNo',
      name: 'GRNInvoiceNo',
      frozen: true,
    },
    {
      key: 'ItemCode',
      name: 'Item Code',
      frozen: true,
    },
    {
      key: 'ItemName',
      name: 'Item Name',
      frozen: true,
    },
    {
      key: 'BatchNo',
      name: 'Batch No',
      frozen: true,
    },
    {
      key: 'GenericName',
      name: 'Generic Name',
    },
    {
      key: 'CompanyName',
      name: 'Manufacturer Name',
    },
    {
      key: 'HSNCode',
      name: 'HSN Code',
    },
    {
      key: 'Strength',
      name: 'Strength',
    },
    {
      key: 'Volume',
      name: 'Volume',
    },
    {
      key: 'PackType',
      name: 'Pack Type',
    },
    {
      key: 'PackQuantity',
      name: 'Pack Quantity',
    },
    {
      key: 'PurchaseRateWithTax',
      name: 'Purchase Rate With Tax',
    },
    {
      key: 'PurchaseQuantity',
      name: 'Purchase Quantity',
    },
    {
      key: 'TotalAmount',
      name: 'Total Amount',
    },
    {
      key: 'PurchaseAmount',
      name: 'PurchaseAmount',
    },
    {
      key: 'ReturnQuantity',
      name: 'Return Quantity',
    },
    {
      key: 'ReturnQuantityAmount',
      name: 'ReturnQuantityAmount',
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (Params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => HandelEditdata(Params.row)}
          >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>
          <Button
            className="cell_btn"
            onClick={() => handleDeleteItem(Params.row)}
          >
            <DeleteOutlineIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
  ];

  const SavePurchaseReturn = () => {
    console.log('ReturnItemList', ReturnItemList);

    let requiredFields = ['ReturnDate', 'SupplierCode', 'StoreLocation'];

    const missingFields = requiredFields.filter(
      (field) => !SupplierDetailes[field]
    );

    let requiredFields2 = [
      'ReturnTotalItem',
      'ReturnTotalQuantity',
      'ReturnTotalAmount',
    ];

    const missingFields2 = requiredFields2.filter(
      (field) => !FinalState[field]
    );

    if (missingFields.length > 0 || missingFields2.length > 0) {
      let allmissingFields = [...missingFields, ...missingFields2];

      const tdata = {
        message: `Please fill out all required fields: ${allmissingFields.join(', ')}`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else if (ReturnItemList.length === 0) {
      const tdata = {
        message: `Please Entry Return Items`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else {
      let SendItems;

      if (EdittData && Object.keys(EdittData).length !== 0) {
        SendItems = {
          SupplierDetailes: {
            ...SupplierDetailes,
            ...FinalState,
            PurchaseReturnNumber: "",
          },
          ReturnItemList: ReturnItemList,
          Create_by: userRecord?.username,
        };
      } else {
        SendItems = {
          SupplierDetailes: { ...SupplierDetailes, ...FinalState },
          ReturnItemList: ReturnItemList,
          Create_by: userRecord?.username,
        };
      }

      console.log('SendItems', SendItems);

      axios
        .post(`${UrlLink}Inventory/PurcchaseReturn_Link`, SendItems)
        .then((res) => {
          console.log(res.data);

          let resdata = res.data;
          let type = Object.keys(resdata)[0];
          let mess = Object.values(resdata)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: 'toast', value: tdata });
          if (type === 'success') {
            navigate('/Home/PurchaseReturnList');
            // navigate('/Home/InventoryMaster');
            dispatchvalue({ type: 'HrFolder', value: 'SupplierPay' });
            dispatchvalue({ type: 'setPreviousFolder', value: null });
            dispatchvalue({ type: 'showMenu', value: true });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (suplierdata) {
      setSupplierDetailes(prev => ({
        ...prev,
        SupplierCode: suplierdata.SupplierCode || '',
        SupplierName: suplierdata.SupplierName || '',
        // Keep other supplier fields if needed
      }));

      setReturnItemState(prev => ({
        ...prev,
        GRNInvoiceNo: suplierdata.GRN_Invoice || '',
        GRN_No: suplierdata.GRN_No || '',
        GRNDate: suplierdata.GRN_Date || '',
        SupplierBillNo: suplierdata.GRN_Invoice || '', // if needed
        SupplierBillDate: suplierdata.Supplier_Bill_Date || '',
      }));

      setReturnQtyState(prev => ({
        ...prev,
        PurchaseAmount: suplierdata.GRN_Invoice_Amount || '',
        ReturnQuantityAmount: suplierdata.GRN_Balance_Amount || '',
        ReturnPackQuantity: suplierdata.GRN_Balance_Amount || '',
        // Other fields if needed
      }));
    }
  }, [suplierdata]);

  return (
    <>
      <div className="Main_container_app">
        <h3>Debit Return</h3>

        <br />

        <div className="RegisFormcon_1">
          {Object.entries(SupplierDetailes).map(([StateName, value], index) => (
            <div className="RegisForm_1" key={index + 'key'}>
              <label htmlFor={StateName}>
                {formatLabel(StateName)} <span>:</span>
              </label>

              {['Location', 'StoreLocation'].includes(StateName) ? (
                <select
                  id={StateName}
                  name={StateName}
                  value={SupplierDetailes[StateName]}
                  onChange={HandleonchangeSupplierState} // FIXED: Correct function name
                  disabled={
                    (SupplierDetailes.SupplierCode === '' &&
                      StateName === 'Location') ||
                    (SupplierDetailes.Location === '' &&
                      StateName === 'StoreLocation')
                  }
                >
                  <option value="">Select</option>
                  {StateName === 'Location'
                    ? LocationData.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {ele.locationName}
                        </option>
                      ))
                    : StoreData.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {ele.StoreName}
                        </option>
                      ))}
                </select>
              ) : (
                <div className="Search_patient_icons">
                  <input
                    type={StateName === 'ReturnDate' ? 'date' : 'text'}
                    id={StateName}
                    name={StateName}
                    value={SupplierDetailes[StateName]}
                    list={StateName + 'list'}
                    onChange={HandleonchangeSupplierState} // FIXED: Correct function name
                    disabled={[
                      'SupplierMailId',
                      'SupplierContactNumber',
                      'SupplierContactPerson',
                    ].includes(StateName)}
                  />
                  {['SupplierCode', 'SupplierName'].includes(StateName) ? (
                    <>
                      <datalist id={StateName + 'list'}>
                        {supplierArray.map((ele, ind) => (
                          <option
                            key={ind + 'key'}
                            value={
                              StateName === 'SupplierCode'
                                ? ele.id 
                                : ele.SupplierName
                            }
                          ></option>
                        ))}
                      </datalist>
                      <span
                        onClick={(e) =>
                          handleSearchSupplierlist(
                            StateName === 'SupplierCode'
                              ? 'SupplierCode'
                              : 'SupplierName'
                          )
                        }
                      >
                        <ManageSearchIcon />
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <br />

        <div className="common_center_tag">
          <span>ITEM DETAILES</span>
        </div>
        <br />

        <div className="RegisFormcon_1">
          {Object.keys(ReturnItemState)
            .filter((ele) => ele !== 'id' && ele !== 'BatchNo')
            .map((StateName, index) => (
              <div className="RegisForm_1" key={index + 'key'}>
                <label htmlFor={StateName}>
                  {formatLabel(StateName)} <span>:</span>
                </label>

                {StateName === 'Reason' ? (
                  <select
                    id={StateName}
                    name={StateName}
                    value={ReturnItemState[StateName]}
                    onChange={HandelOnchaneItemState}
                    disabled={
                      ReturnItemState.SupplierBillNo === '' &&
                      StateName === 'Reason'
                    }
                  >
                    <option value="">Select</option>
                    <option value="QualityIssue">Quality Issue</option>
                    <option value="ExcessItems">Excess Items</option>
                    <option value="Damage">Damage</option>
                    <option value="ExpiredReturn">Expired Return</option>
                  </select>
                ) : (
                  <div className="Search_patient_icons">
                    <input
                      type={
                        ['GRNDate', 'SupplierBillDate'].includes(StateName)
                          ? 'date'
                          : 'text'
                      }
                      id={StateName}
                      name={StateName}
                      value={ReturnItemState[StateName]}
                      disabled={
                        !['GRN_No','GRNInvoiceNo', 'ItemCode', 'ItemName'].includes(
                          StateName
                        ) ||
                        (SupplierDetailes.StoreLocation === '' &&
                          StateName === 'GRNInvoiceNo') ||
                        (ReturnItemState.Reason === '' &&
                          ['ItemCode', 'ItemName'].includes(StateName))
                      }
                      onChange={HandelOnchaneItemState}
                      list={`${StateName}list`}
                      autoComplete="off"
                    />

                    {StateName === 'GRNInvoiceNo' ? (
                      <>
                        <datalist id={`${StateName}list`}>
                          {GRNDetailState.map((ele, ind) => (
                            <option
                              key={`${ind}key`}
                              value={`${ele.GRNNumber}`}
                            >
                              {`GRN Date: ${ele.GrnDate} | GRN_No : ${ele.GRN_No} | S.Bill No: ${ele.SupplierBillNumber} | S.Bill Date: ${ele.SupplierBillDate}`}
                            </option>
                          ))}
                        </datalist>
                        <span onClick={handleSearchGRNdetailes}>
                          <ManageSearchIcon />
                        </span>
                      </>
                    ) : ['ItemCode', 'ItemName'].includes(StateName) ? (
                      <>
                        <datalist id={`${StateName}list`}>
                          {GRNItemState.map((ele, ind) => (
                            <option
                              key={`${ind}key`}
                              value={
                                StateName === 'ItemCode'
                                  ? ele.ItemCode
                                  : ele.ItemName
                              }
                            >
                              {StateName === 'ItemCode'
                                ? `Item Name: ${ele.ItemName} | BatchNo: ${ele.BatchNo} | Received Quantity: ${ele.PurchaseQuantity}`
                                : `Item Code: ${ele.ItemCode} | BatchNo: ${ele.BatchNo} | Received Quantity: ${ele.PurchaseQuantity}`}
                            </option>
                          ))}
                        </datalist>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* ADD SEARCH SECTION FOR ITEMS WITH BATCH NO */}
        <br />
        <div className="common_center_tag">
          <span>SEARCH ITEM WITH BATCH NO</span>
        </div>
        <br />

        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label htmlFor="searchItemCode">Item Code <span>:</span></label>
            <div className="Search_patient_icons">
              <input
                type="text"
                id="searchItemCode"
                name="ItemCode"
                value={searchItem.ItemCode}
                onChange={handleSearchItemChange}
                list="searchItemCodelist"
                autoComplete="off"
              />
              <datalist id="searchItemCodelist">
                {Array.from(new Set(GRNItemState.map(item => item.ItemCode))).map((itemCode, index) => (
                  <option key={`itemcode-${index}`} value={itemCode}>
                    {GRNItemState.find(item => '' + item.ItemCode === '' + itemCode)?.ItemName || ''}
                  </option>
                ))}
              </datalist>
          </div>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="searchItemName">Item Name <span>:</span></label>
            <div className="Search_patient_icons">
              <input
                type="text"
                id="searchItemName"
                name="ItemName"
                value={searchItem.ItemName}
                onChange={handleSearchItemChange}
                list="searchItemNamelist"
                autoComplete="off"
              />
              <datalist id="searchItemNamelist">
                {Array.from(new Set(GRNItemState.map(item => item.ItemName))).map((itemName, index) => (
                  <option key={`itemname-${index}`} value={itemName}>
                    Item
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="searchBatchNo">Batch No <span>:</span></label>
            <div className="Search_patient_icons">
              <input
                type="text"
                id="searchBatchNo"
                name="BatchNo"
                value={searchItem.BatchNo}
                onChange={handleSearchItemChange}
                list="searchBatchNolist"
                autoComplete="off"
              />
              <datalist id="searchBatchNolist">
                {GRNItemState
                  .filter(item => 
                    (!searchItem.ItemCode || '' + item.ItemCode === '' + searchItem.ItemCode) &&
                    (!searchItem.ItemName || item.ItemName === searchItem.ItemName)
                  )
                  .map((item, index) => (
                    <option key={`batch-${index}`} value={item.BatchNo}>
                      {`Item: ${item.ItemName} | Qty: ${item.AvailableQuantity}`}
                    </option>
                  ))}
              </datalist>
            </div>
          </div>

          <div className="RegisForm_1">
            <label>&nbsp;</label>
            <div className="Main_container_Btn">
              <button onClick={handleSearchItemDetails} style={{marginTop: '8px'}}>
                Search Item
              </button>
            </div>
          </div>
        </div>

        {/* Show selected BatchNo if available */}
        {ReturnItemState.BatchNo && (
          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label htmlFor="BatchNo">Selected Batch No <span>:</span></label>
              <input
                type="text"
                id="BatchNo"
                value={ReturnItemState.BatchNo}
                disabled
              />
            </div>
            <div className="RegisForm_1">
              <label htmlFor="ExpiryDate">Expiry Date <span>:</span></label>
              <input
                type="text"
                id="ExpiryDate"
                value={ReturnItemState.ExpiryDate || ''}
                disabled
              />
            </div>
          </div>
        )}

        <br />

        {ReturnQtyState.AvailablePackQuantity !== '' && (
          <div className="RegisFormcon_1">
            {Object.entries(ReturnQtyState).map(([StateName, value], index) => (
              <div className="RegisForm_1" key={index + 'key'}>
                <label htmlFor={StateName}>
                  {formatLabel(StateName)} <span>:</span>
                </label>

                {StateName === 'Remarks' ? (
                  <textarea
                    id={StateName}
                    name={StateName}
                    value={ReturnQtyState[StateName]}
                    onChange={HandelOnchaneReturnQty}
                  ></textarea>
                ) : (
                  <>
                    <input
                      type="number"
                      id={StateName}
                      name={StateName}
                      value={ReturnQtyState[StateName]}
                      onChange={HandelOnchaneReturnQty}
                      disabled={!['ReturnQuantity'].includes(StateName)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <br />
        {ReturnQtyState.AvailablePackQuantity && (
          <div className="Main_container_Btn">
            <button onClick={SavePurchaseReturnItem}>
              {ReturnItemState.id ? 'Update' : 'Add'}
            </button>
          </div>
        )}
        <br />

        {ReturnItemList.length !== 0 && (
          <div className="RegisFormcon_1 jjxjx_">
            <ReactGrid columns={ProductListColumn} RowData={ReturnItemList} />
          </div>
        )}

        <br />

        {ReturnItemList.length !== 0 && (
          <div className="RegisFormcon_1">
            {Object.keys(FinalState).map((StateName, index) => (
              <div className="RegisForm_1" key={index + 'key'}>
                <label htmlFor={StateName}>
                  {formatLabel(StateName)} <span>:</span>
                </label>
                <input
                  type="number"
                  id={StateName}
                  name={StateName}
                  value={FinalState[StateName]}
                  disabled
                />
              </div>
            ))}
          </div>
        )}

        <br />

        {ReturnItemList.length !== 0 && (
          <div className="Main_container_Btn">
            <button onClick={SavePurchaseReturn}>
              Save
              {/* {Object.keys(EdittData).length !==0 ? 'Update' :'Save' } */}
            </button>
          </div>
        )}
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default DebitReturn;