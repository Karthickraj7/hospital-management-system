// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//   BlockInvalidcharecternumber,
//   formatLabel,
//   formatunderscoreLabel,
// } from '../../../OtherComponent/OtherFunctions';
// import axios from 'axios';
// import ReactGrid from '../../../OtherComponent/ReactGrid/ReactGrid';
// import Button from '@mui/material/Button';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import ToastAlert from '../../../OtherComponent/ToastContainer/ToastAlert';
// import { FaTimes, FaPlus } from 'react-icons/fa';
// import '../../Inventory.css';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// const IndentIssue = () => {
//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const IndentEditData = useSelector(
//     (state) => state.Inventorydata?.IndentEditData
//   );
//   const userRecord = useSelector((state) => state.userRecord?.UserData);

//   const [summa1, setsumma1] = useState({
//     IndentIssueInvoice: null,
//     IssueFromLocation: '',
//     IssueFromNurseStation: false,
//     IssueFromStore: '',
//     IssueToLocation: '',
//     IssueToNurseStation: false,
//     IssueToStore: '',
//   });

//   console.log('summa1?????', summa1);

//   const [summa2, setsumma2] = useState({
//     id: null,
//     Raisedpk: null,
//     Issuedpk: null,
//     ItemCode: '',
//     ItemName: '',
//     Reason: 'IndentMovement',
//     BatchNo: '',
//     IssueQuantity: '',
//     Remarks: '',
//     Status: 'Pending',
//   });
//   const UserData = useSelector((state) => state.userRecord?.UserData);
//   const [summabool1, setsummabool1] = useState(false);
//   const [summaselectedSerialNo, setsummaselectedSerialNo] = useState(null);

//   const [summaArray1, setsummaArray1] = useState([]);
//   const [summaArray2, setsummaArray2] = useState([]);
//   const [summaArray3, setsummaArray3] = useState([]);
//   const [summaArray4, setsummaArray4] = useState([]);
//   console.log('summaArray4', summaArray4);
//   const [summaArray5, setsummaArray5] = useState([]);
//   const [summaArray6, setsummaArray6] = useState([]);
//   const [summaArray7, setsummaArray7] = useState([]);
//   const [summaArray8, setsummaArray8] = useState([]);
//   console.log('summaArray8', summaArray8);
//   const [pageAccess, setPageAccess] = useState([]);

//   useEffect(() => {
//     if (UserData?.Storeid || 1) {
//       const fetchData = async () => {
//         try {
//           const response = await axios.get(
//             `${UrlLink}Masters/inventory_page_access_by_storeid`,
//             {
//               params: { Storeid: UserData?.Storeid || 1 },
//             }
//           );
//           const ress = response.data;
//           if (ress.length > 0 && ress[0].page_access) {
//             setPageAccess(ress[0].page_access[0]);
//           }
//         } catch (err) {
//           console.log(err);
//         }
//       };
//       fetchData();
//     }
//   }, [UrlLink, UserData]);

//   const handlesumma1change = (e) => {
//     const { name, value } = e.target;
//     if (name === 'IssueFromNurseStation') {
//       setsumma1((prev) => ({
//         ...prev,
//         [name]: value === 'Yes',
//         IssueFromStore: '',
//       }));
//     } else if (name === 'IssueToNurseStation') {
//       setsumma1((prev) => ({
//         ...prev,
//         [name]: value === 'Yes',
//         IssueToStore: '',
//       }));
//     } else {
//       setsumma1((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   useEffect(() => {
//     if (Object.keys(IndentEditData).length !== 0) {
//       console.log('?????', IndentEditData);

//       const { Item_Detials, ...rest } = IndentEditData;

//       if (rest.Raised_pk) {
//         setsumma1((prev) => ({
//           IndentIssueInvoice: rest?.Issued_pk,
//           IndentRaiseInvoice: rest?.Raised_pk,
//           RequestFromLocation: rest?.RaisedFromLocation,
//           RequestFromStore: `${rest?.RaisedFromNurseStation ? 'NurseStation' : 'Store'}-${rest?.RaisedFromNurseStation ? rest?.RaisedFromNurseStationWard : rest?.RaisedFromStore}`,
//           RequestToLocation: rest?.RaisedToLocation,
//           RequestToStore: `${rest?.RaisedToNurseStation ? 'NurseStation' : 'Store'}-${rest?.RaisedToNurseStation ? rest?.RaisedToNurseStationWard : rest?.RaisedToStore}`,
//           RequestDate: rest?.RaisedDate,
//           Reason: rest?.RaisedReason,
//           IssueFromLocation: rest?.RaisedToLocation_pk,
//           IssueFromNurseStation: rest?.RaisedToNurseStation,
//           IssueFromStore: rest?.RaisedToNurseStation
//             ? rest?.RaisedToNurseStation_pk
//             : rest?.RaisedToStore_pk,
//           IssueToLocation: rest?.RaisedFromLocation_pk,
//           IssueToNurseStation: rest?.RaisedFromNurseStation,
//           IssueToStore: rest?.RaisedFromNurseStation
//             ? rest?.RaisedFromNurseStation_pk
//             : rest?.RaisedFromStore_pk,
//         }));
//       } else {
//         setsumma1((prev) => ({
//           IndentIssueInvoice: rest?.Issued_pk,
//           IssueFromLocation: rest?.IssuedFromLocation_pk,
//           IssueFromNurseStation: rest?.IssuedFromNurseStation,
//           IssueFromStore: rest?.IssuedFromNurseStation
//             ? rest?.IssuedFromNurseStation_pk
//             : rest?.IssuedFromStore_pk,
//           IssueToLocation: rest?.IssuedToLocation_pk,
//           IssueToNurseStation: rest?.IssuedToNurseStation,
//           IssueToStore: rest?.IssuedToNurseStation
//             ? rest?.IssuedToNurseStation_pk
//             : rest?.IssuedToStore_pk,
//         }));
//       }
//     } else {
//       setsumma1({
//         IndentIssueInvoice: null,
//         IssueFromLocation: userRecord?.location,
//         IssueFromNurseStation: false,
//         IssueFromStore: '',
//         IssueToLocation: userRecord?.location,
//         IssueToNurseStation: false,
//         IssueToStore: '',
//       });
//     }
//   }, [IndentEditData, userRecord?.location]);

//   useEffect(() => {
//     const fetchDataForItems = async () => {
//       if (
//         Object.keys(IndentEditData).length !== 0 &&
//         summa1.IssueFromLocation &&
//         summa1.IssueFromStore
//       ) {
//         const { Item_Detials, ...rest } = IndentEditData;
//         try {
//           const updated_Item_Detials = await Promise.all(
//             Item_Detials.map(async (field) => {
//               const sendata = {
//                 ItemCode: field.ItemCode,
//                 Location: summa1.IssueFromLocation,
//                 Isward: summa1.IssueFromNurseStation,
//                 StoreName: summa1.IssueFromStore,
//               };

//               try {
//                 const { data: datasss } = await axios.get(
//                   `${UrlLink}Inventory/get_item_detials_for_batch_indent_issue`,
//                   { params: sendata }
//                 );

//                 return {
//                   ...field,
//                   IssuedQuantity: 0,
//                   PendingQuantity: field?.RaisedQuantity,
//                   AvailableStatus:
//                     Array.isArray(datasss) &&
//                     datasss.every((f) => f.AvailableQuantity === 0)
//                       ? 'Not Available'
//                       : 'Available',
//                 };
//               } catch (error) {
//                 console.error('Error fetching data for item:', error);
//                 return field; // Return original field data if there's an error
//               }
//             })
//           );

//           // setUpdatedItemDetails(updated_Item_Detials); // Example state update
//           setsummaArray4(updated_Item_Detials);
//         } catch (error) {
//           console.error('Error processing items:', error);
//         }
//       }
//     };

//     if (IndentEditData?.editMode) {
//       setsummaArray8(IndentEditData?.Item_Detials || []);
//     } else {
//       fetchDataForItems();
//     }
//   }, [
//     IndentEditData,
//     UrlLink,
//     summa1.IssueFromLocation,
//     summa1.IssueFromNurseStation,
//     summa1.IssueFromStore,
//   ]);

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Masters/Location_Detials_link`)
//       .then((res) => {
//         const ress = res.data;
//         setsummaArray1(ress);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink]);

//   useEffect(() => {
//     if (summa1.IssueFromLocation) {
//       axios
//         .get(
//           `${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${summa1.IssueFromLocation}&IsFromWardStore=${summa1.IssueFromNurseStation}`
//         )
//         .then((res) => {
//           const ress = res.data.filter((f) => {
//             if (
//               Object.keys(IndentEditData).length !== 0 &&
//               summa1.IssueFromLocation ===
//                 IndentEditData.RaisedFromLocation_pk &&
//               summa1.IssueFromNurseStation ===
//                 IndentEditData.RaisedFromWardStore
//             ) {
//               return (
//                 f.id !==
//                 +(IndentEditData.RaisedFromWardStore
//                   ? IndentEditData.RaisedFromStoreWard_pk
//                   : IndentEditData.RaisedFromStore_pk)
//               );
//             } else {
//               return f;
//             }
//           });
//           setsummaArray2(ress);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } else {
//       setsummaArray2([]);
//     }
//   }, [
//     UrlLink,
//     summa1.IssueFromLocation,
//     summa1.IssueFromNurseStation,
//     IndentEditData?.RaisedFromLocation_pk,
//     IndentEditData?.RaisedFromWardStore,
//     IndentEditData?.RaisedFromStoreWard_pk,
//     IndentEditData?.RaisedFromStore_pk,
//     IndentEditData,
//   ]);

//   useEffect(() => {
//     if (summa1.IssueToLocation) {
//       axios
//         .get(
//           `${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${summa1.IssueToLocation}&IsFromWardStore=${summa1.IssueToNurseStation}`
//         )
//         .then((res) => {
//           const ress = res.data.filter((f) =>
//             summa1.IssueToLocation === summa1.IssueFromLocation &&
//             summa1.IssueToNurseStation === summa1.IssueFromNurseStation
//               ? f.id !== +summa1.IssueFromStore
//               : f
//           );
//           console.log('iiii???----', ress);

//           setsummaArray3(ress);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } else {
//       setsummaArray3([]);
//     }
//   }, [
//     UrlLink,
//     summa1.IssueToLocation,
//     summa1.IssueToNurseStation,
//     summa1.IssueFromLocation,
//     summa1.IssueFromNurseStation,
//     summa1.IssueFromStore,
//   ]);

//   const handlesumma2change = (e) => {
//     const { name, value } = e.target;
//     if (name === 'ItemCode') {
//       setsumma2((prev) => ({
//         id: prev.id,
//         Raisedpk: prev?.Raisedpk,
//         Issuedpk: prev?.Issuedpk,
//         [name]: value,
//         ItemName: '',
//         Reason: 'IndentMovement',
//         BatchNo: '',
//         IssueQuantity: '',
//         Remarks: '',
//         Status: 'Pending',
//       }));
//     } else if (name === 'ItemName') {
//       setsumma2((prev) => ({
//         id: prev.id,
//         Raisedpk: prev?.Raisedpk,
//         Issuedpk: prev?.Issuedpk,
//         ItemCode: '',
//         [name]: value,
//         Reason: 'IndentMovement',
//         BatchNo: '',
//         IssueQuantity: '',
//         Remarks: '',
//         Status: 'Pending',
//       }));
//     } else if (name === 'BatchNo') {
//       if (summa2?.Raisedpk) {
//         setsumma2((prev) => ({
//           id: prev?.id,
//           Raisedpk: prev?.Raisedpk,
//           Issuedpk: prev?.Issuedpk,
//           ItemCode: prev?.ItemCode,
//           ItemName: prev?.ItemName,
//           ProductCategory: prev?.ProductCategory,
//           SubCategory: prev?.SubCategory,
//           PackType: prev?.PackType,
//           PackQuantity: prev?.PackQuantity,
//           RaisedQuantity: prev?.RaisedQuantity,
//           Reason: prev?.Reason,
//           BatchNo: value,
//           IssueQuantity: '',
//           Remarks: '',
//           Status: 'Pending',
//         }));
//       } else {
//         setsumma2((prev) => ({
//           id: prev?.id,
//           Raisedpk: prev?.Raisedpk,
//           Issuedpk: prev?.Issuedpk,
//           ItemCode: prev?.ItemCode,
//           ItemName: prev?.ItemName,
//           ProductCategory: prev?.ProductCategory,
//           SubCategory: prev?.SubCategory,
//           PackType: prev?.PackType,
//           PackQuantity: prev?.PackQuantity,
//           Reason: prev?.Reason,
//           BatchNo: value,
//           IssueQuantity: '',
//           Remarks: '',
//           Status: 'Pending',
//         }));
//       }
//     } else if (name === 'IssueQuantity') {
//       if (summa2?.AvailableQuantity >= value) {
//         setsumma2((prev) => ({
//           ...prev,
//           [name]: value,
//         }));
//       } else {
//         setsumma2((prev) => ({
//           ...prev,
//           [name]: '',
//         }));
//         const tdata = {
//           message: `Please enter valid Quantity.`,
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       }
//     } else {
//       setsumma2((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   useEffect(() => {
//     axios
//       .get(
//         `${UrlLink}Inventory/get_item_detials_for_indent?ItemCode=${summa2.ItemCode}&ItemName=${summa2.ItemName}&IndentType=Issued`
//       )
//       .then((res) => {
//         const ress = res.data;
//         if (Object.keys(IndentEditData).length !== 0) {
//           const summadata = res.data.filter(
//             (f) =>
//               !IndentEditData.Item_Detials.some(
//                 (p) => '' + p.ItemCode === '' + f.id
//               )
//           );
//           setsummaArray5(summadata);
//         } else {
//           setsummaArray5(ress);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setsummaArray5([]);
//       });
//   }, [UrlLink, summa2.ItemCode, summa2.ItemName, IndentEditData]);

//   const handlesearchItems = (type = 'id') => {
//     if (summa2.ItemCode || summa2.ItemName) {
//       let find = summaArray5.find((ele) => '' + ele.id === summa2.ItemCode);
//       if (type !== 'id') {
//         find = summaArray5.find((ele) => '' + ele.ItemName === summa2.ItemName);
//       }
//       if (find) {
//         const { id, ItemName, ...rest } = find;
//         setsumma2((prev) => ({
//           id: prev.id,
//           Raisedpk: prev.Raisedpk,
//           Issuedpk: prev.Issuedpk,
//           ItemCode: id,
//           ItemName: ItemName,
//           ...rest,
//           Reason: 'IndentMovement',
//           BatchNo: '',
//           IssueQuantity: '',
//           Remarks: '',
//           Status: prev?.Status,
//         }));
//       } else {
//         const tdata = {
//           message: `Please enter valid Item Code or Item Name to search.`,
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       }
//     } else {
//       setsumma2((prev) => ({
//         id: prev.id,
//         Raisedpk: prev.Raisedpk,
//         Issuedpk: prev.Issuedpk,
//         ItemCode: type === 'id' ? prev.ItemCode : '',
//         ItemName: type !== 'id' ? prev.ItemName : '',
//         Reason: 'IndentMovement',
//         BatchNo: '',
//         IssueQuantity: '',
//         Remarks: '',
//         Status: prev?.Status,
//       }));
//       const tdata = {
//         message: `Please fill atleast any one of the Item Code or Item Name to search.`,
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     }
//   };

//   const handlesearchItemsBatchNo = () => {
//     if (summa2.BatchNo) {
//       const find = summaArray6.find((f) => f.BatchNo === summa2.BatchNo);
//       if (find) {
//         setsumma2((prev) => ({
//           id: prev?.id,
//           Raisedpk: prev?.Raisedpk,
//           Issuedpk: prev?.Issuedpk,
//           ItemCode: prev?.ItemCode,
//           ItemName: prev?.ItemName,
//           ProductCategory: prev?.ProductCategory,
//           SubCategory: prev?.SubCategory,
//           PackType: prev?.PackType,
//           PackQuantity: prev?.PackQuantity,
//           ...(prev.Raisedpk && { RaisedQuantity: prev?.RaisedQuantity }),
//           Reason: prev.Reason,
//           BatchNo: prev?.BatchNo,
//           AvailableQuantity: find?.AvailableQuantity,
//           IssueQuantity: '',
//           ...(find?.SerialNoAvailable && { SerialNo: [] }),
//           Remarks: '',
//           Status: 'Pending',
//         }));
//       } else {
//         const tdata = {
//           message: `Please enter valid Batch No to search.`,
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       }
//     } else {
//       const tdata = {
//         message: `Please fill atleast any one of the Batch No to search.`,
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     }
//   };
//   console.log(summa2);

//   const handelEditsumma2Array = (params) => {
//     console.log('paramsedit', params);

//     setsumma2((prev) => ({
//       id: null,
//       Raisedpk: params?.pk,
//       Issuedpk: null,
//       ItemCode: params?.ItemCode,
//       ItemName: params?.ItemName,
//       ProductCategory: params?.ProductCategory,
//       SubCategory: params?.SubCategory,
//       PackType: params?.PackType,
//       PackQuantity: params?.PackQuantity,
//       RaisedQuantity: params?.PendingQuantity,
//       Reason: 'IndentMovement',
//       BatchNo: '',
//       IssueQuantity: '',
//       Remarks: '',
//       Status: 'Pending',
//     }));
//   };

//   useEffect(() => {
//     if (
//       summa2.ItemCode &&
//       summa2.ItemName &&
//       summa1.IssueFromLocation &&
//       summa1.IssueFromStore
//     ) {
//       const sendata = {
//         ItemCode: summa2.ItemCode,
//         Location: summa1.IssueFromLocation,
//         Isward: summa1.IssueFromNurseStation,
//         StoreName: summa1.IssueFromStore,
//         ExpiredProducts: summa2.Reason === 'ExpiryProducts',
//       };
//       axios
//         .get(`${UrlLink}Inventory/get_item_detials_for_batch_indent_issue`, {
//           params: sendata,
//         })
//         .then((res) => {
//           console.log(res);
//           const datasss = Array.isArray(res.data) ? res.data : [];
//           if (datasss.length !== 0) {
//             setsummaArray6(datasss);
//           } else {
//             setsummaArray6([]);
//             const tdata = {
//               message: `The stock is not Available in selected location for select Product `,
//               type: 'warn',
//             };
//             dispatchvalue({ type: 'toast', value: tdata });
//           }
//         })
//         .catch((err) => {
//           console.error(err);
//           setsummaArray6([]);
//         });
//     }
//   }, [
//     UrlLink,
//     summa2.ItemCode,
//     summa2.Reason,
//     summa1.IssueFromLocation,
//     summa1.IssueFromNurseStation,
//     summa1.IssueFromStore,
//     dispatchvalue,
//   ]);

//   const summa2Columns = [
//     ...[
//       'id',
//       'ItemCode',
//       'ItemName',
//       'ProductCategory',
//       'SubCategory',
//       'PackType',
//       'PackQuantity',
//       'RaisedQuantity',
//       'IssuedQuantity',
//       'PendingQuantity',
//       'Action',
//     ].map((field) => ({
//       key: field,
//       name: field === 'id' ? 'S.No' : formatLabel(field),

//       renderCell: (params) =>
//         field === 'Action' ? (
//           params.row.AvailableStatus === 'Available' ? (
//             <>
//               {params.row.PendingQuantity !== 0 ? (
//                 <Button
//                   className="cell_btn"
//                   onClick={() => handelEditsumma2Array(params.row)}
//                 >
//                   <EditIcon className="check_box_clrr_cancell" />
//                 </Button>
//               ) : (
//                 <Button>No Action</Button>
//               )}
//             </>
//           ) : (
//             'Stock Not Available'
//           )
//         ) : params.row[field] ? (
//           params.row[field]
//         ) : ['IssuedQuantity', 'PendingQuantity'].includes(field) ? (
//           params.row[field]
//         ) : (
//           '-'
//         ),
//     })),
//   ];

//   const handleeditsumma8 = (params) => {
//     const { SerialNoAvailable, PendingQuantity, RaisedQuantity, ...rest } =
//       params;
//     setsumma2({
//       id: params?.id,
//       Raisedpk: params?.Raisedpk,
//       Issuedpk: params?.Issuedpk,
//       ItemCode: params?.ItemCode,
//       ItemName: params?.ItemName,
//       ProductCategory: params?.ProductCategory,
//       SubCategory: params?.SubCategory,
//       PackType: params?.PackType,
//       PackQuantity: params?.PackQuantity,
//       ...(params?.RaisedQuantity && { RaisedQuantity: params?.RaisedQuantity }),
//       Reason: params?.Reason,
//       BatchNo: params?.BatchNo,
//       AvailableQuantity: params?.AvailableQuantity,
//       IssueQuantity: params?.IssueQuantity,
//       ...(params?.SerialNoAvailable && { SerialNo: params?.SerialNo }),
//       Remarks: params?.Remarks,
//       Status: params?.Status,
//     });
//   };
//   const handledeletesumma8 = (params) => {
//     if (params.Issuedpk) {
//       setsummaArray8((prev) =>
//         prev.map((product) =>
//           '' + product.Issuedpk === '' + params.Issuedpk
//             ? { ...product, Status: 'Cancelled' }
//             : product
//         )
//       );
//     } else {
//       setsummaArray8((prev) => prev.filter((p) => +p.id !== +params.id));
//     }
//   };

//   const Summa8column = [
//     ...[
//       'id',
//       'ItemCode',
//       'ItemName',
//       'ProductCategory',
//       'SubCategory',
//       'PackType',
//       'PackQuantity',
//       'BatchNo',
//       'IssueQuantity',
//       'SerialNo',
//       'Sellable_qty_price',
//       'Action',
//     ].map((field) => ({
//       key: field,
//       name: field === 'id' ? 'S.No' : formatLabel(field),

//       renderCell: (params) =>
//         field === 'SerialNo' ? (
//           params.row[field] && Array.isArray(params.row.SerialNo) ? (
//             <Button
//               className="cell_btn"
//               onClick={() => setsummaselectedSerialNo(params.row)}
//             >
//               <VisibilityIcon className="check_box_clrr_cancell" />
//             </Button>
//           ) : (
//             'Serial No Not Available'
//           )
//         ) : field === 'Action' ? (
//           params.row.Status !== 'Cancelled' ? (
//             <>
//               <Button
//                 className="cell_btn"
//                 onClick={() => handleeditsumma8(params.row)}
//               >
//                 <EditIcon className="check_box_clrr_cancell" />
//               </Button>
//               <Button
//                 className="cell_btn"
//                 onClick={() => handledeletesumma8(params.row)}
//               >
//                 <DeleteIcon className="check_box_clrr_cancell" />
//               </Button>
//             </>
//           ) : (
//             'Cancelled'
//           )
//         ) : params.row[field] ? (
//           params.row[field]
//         ) : (
//           '-'
//         ),
//     })),
//   ];

//   const handleselectSerialNo = (params) => {
//     if (summa2.IssueQuantity && summa2?.BatchNo) {
//       const getserialdatafetch = async () => {
//         try {
//           const sendata = {
//             ItemCode: summa2.ItemCode,
//             Location: summa1.IssueFromLocation,
//             Isward: summa1.IssueFromNurseStation,
//             StoreName: summa1.IssueFromStore,
//             BatchNo: summa2.BatchNo,
//             IssueQuantity: summa2.IssueQuantity,
//           };
//           const response = await axios.get(
//             `${UrlLink}Inventory/get_serialno_detials_for_batch_indent_issue`,
//             { params: sendata }
//           );
//           const serialData = Array.isArray(response.data) ? response.data : [];
//           // Flatten existingSerialNumbers to get a single array of serial number `pk` values
//           const existingSerialNumbers = summaArray8
//             .filter(
//               (ele) =>
//                 '' + ele.ItemCode === '' + summa2.ItemCode &&
//                 ele.BatchNo === summa2.BatchNo
//             )
//             .flatMap((ele) => ele.SerialNo.map((e) => e.pk));

//           const filteredSerialData = serialData
//             .filter((item) =>
//               !summa2?.id ? !existingSerialNumbers.includes(item.pk) : item
//             )
//             .map((ele, indc) => ({
//               ...ele,
//               Status: indc < summa2.IssueQuantity,
//             }));

//           setsummaArray7(filteredSerialData);
//           setsummabool1(true);
//         } catch (error) {
//           console.error(error);
//         }
//       };
//       if (summaArray7.length === 0) {
//         getserialdatafetch();
//       } else if (
//         summaArray7.filter((f) => f.Status).length !== +summa2.IssueQuantity
//       ) {
//         getserialdatafetch();
//       } else {
//         setsummabool1(true);
//       }
//     } else {
//       setsummabool1(false);
//       const tdata = {
//         message: `Please fill both of the Batch No and Issue Quantity.`,
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     }
//   };

//   useEffect(() => {
//     setsumma2((prev) => ({
//       ...prev,
//       ...(prev?.SerialNo &&
//         Array.isArray(prev.SerialNo) && {
//           SerialNo: summaArray7.filter((f) => f.Status),
//         }),
//     }));
//   }, [summaArray7]);

//   console.log(summaArray4);
//   console.log(summaArray8);
//   console.log('summa2',summa2);

//   const handlesubmitsumma2 = () => {
  
//     const missingFields = Object.keys(summa2)
//       .filter((f) => !['id', 'Raisedpk', 'Issuedpk','Remarks','SubCategory','PackType','PackQuantity'].includes(f))
//       .filter((f) => !summa2[f]);
//     if (missingFields.length !== 0) {
//       dispatchvalue({
//         type: 'toast',
//         value: {
//           message: `Please fill out all required fields: ${missingFields.join(', ')}`,
//           type: 'warn',
//         },
//       });
//     } else {
//       const CheckDublicate = summaArray8.some(
//         (ele) =>
//           '' + ele.ItemCode === '' + summa2.ItemCode &&
//           +ele.id !== +summa2.id &&
//           ele.BatchNo === summa2.BatchNo &&
//           ele.Reason === summa2.Reason &&
//           ele.Status !== 'Cancelled'
//       );
//       if (CheckDublicate) {
//         dispatchvalue({
//           type: 'toast',
//           value: {
//             message: `This item has already exist in the name of same batch no and reason.`,
//             type: 'warn',
//           },
//         });
//       } else if (
//         summa2?.SerialNo &&
//         Array.isArray(summa2?.SerialNo) &&
//         summa2?.SerialNo.length === 0
//       ) {
//         dispatchvalue({
//           type: 'toast',
//           value: {
//             message: `Serial No Available for this Product and the Batch So please Choose the Serial No.`,
//             type: 'warn',
//           },
//         });
//       } else {
//         if (summa2.id) {
//           setsummaArray8((prev) =>
//             prev.map((product) =>
//               +product.id === summa2.id ? { ...summa2 } : product
//             )
//           );
//         } else {
//           setsummaArray8((prev) => [
//             ...prev,
//             {
//               ...summa2,
//               id: prev.length + 1,
//             },
//           ]);
//         }
//         setsumma2({
//           id: null,
//           Raisedpk: null,
//           Issuedpk: null,
//           ItemCode: '',
//           ItemName: '',
//           Reason: 'IndentMovement',
//           BatchNo: '',
//           IssueQuantity: '',
//           Remarks: '',
//           Status: 'Pending',
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     setsummaArray4((prev) => {
//       return prev.map((outerEle) => {
//         console.log('outerEle', outerEle);
//         // Calculate the cumulative IssuedQuantity for matching items in summaArray8
//         const totalIssuedQuantity = summaArray8
//           .filter((innerEle) => '' + innerEle.Raisedpk === '' + outerEle.pk)
//           .reduce((acc, curr) => acc + +curr.IssueQuantity, 0);
//         console.log('totalIssuedQuantity', totalIssuedQuantity);

//         return {
//           ...outerEle,
//           IssuedQuantity: totalIssuedQuantity,
//           PendingQuantity:
//             +outerEle.RaisedQuantity > totalIssuedQuantity
//               ? +outerEle.RaisedQuantity - totalIssuedQuantity
//               : 0,
//         };
//       });
//     });
//   }, [summaArray8]);

//   const handlesubmitIndentIssue = () => {
//     const missingFields = Object.keys(summa1)
//       .filter(
//         (f) =>
//           ![
//             'IndentIssueInvoice',
//             'IssueFromNurseStation',
//             'IssueToNurseStation',
//             'Reason',
//           ].includes(f)
//       )
//       .filter((f) => !summa1[f]);
//     if (missingFields.length !== 0) {
//       dispatchvalue({
//         type: 'toast',
//         value: {
//           message: `Please fill out all required fields: ${missingFields.join(', ')}`,
//           type: 'warn',
//         },
//       });
//     } else {
//       const errors = {
//         AvailabilityQuantity: [],
//         SerialNo: [],
//       };
//       summaArray8.forEach((element) => {
//         if (element?.IssueQuantity > element?.AvailableQuantity) {
//           errors['AvailabilityQuantity'].push(
//             `Insufficient stock for ${element.ItemName} (ItemCode: ${element?.ItemCode}). Available: ${element.AvailableQuantity}, Requested: ${element?.IssueQuantity}.`
//           );
//         }
//         if (element?.SerialNoAvailable && element?.SerialNo.length === 0) {
//           errors['SerialNo'].push(
//             `Please select vaild serial No for ${element.ItemName} (ItemCode: ${element?.ItemCode}). BatchNo: ${element.BatchNo}, Requested: ${element?.IssueQuantity} ,Selected SerialNo Quantity ${element?.SerialNo.length}.`
//           );
//         }
//       });

//       if (Object.values(errors).every((ele) => ele.length === 0)) {
//         const sendadata = {
//           ...summa1,
//           ItemsData: summaArray8,
//           createdBy: userRecord?.username,
//           IS_Indent_Issue_Approve:pageAccess.IS_Indent_Issue_Approve,
//         };

//         console.log('123send data', sendadata);
//         axios
//           .post(`${UrlLink}Inventory/post_indent_issue_details`, sendadata)
//           .then((res) => {
//             console.log(res);
//             navigate('/Home/InventoryMaster');
//             dispatchvalue({ type: 'HrFolder', value: 'IndentIssueList' });
//             dispatchvalue({ type: 'setPreviousFolder', value: null });
//             dispatchvalue({ type: 'showMenu', value: true });
//             // navigate('/Home/IndentIssueList')
//           })
//           .catch((err) => {
//             console.error(err);
//           });
//       } else {
//         let message_warn = '';
//         Object.keys(errors).map((ele) => {
//           if (errors[ele].length !== 0) {
//             message_warn += `${ele} warnings : \n`;
//             errors[ele].forEach((ele, indx) => {
//               message_warn += `${indx + 1}. ${ele}\n`;
//             });
//           }
//         });
//         dispatchvalue({
//           type: 'toast',
//           value: {
//             message: message_warn,
//             type: 'warn',
//           },
//         });
//       }
//     }
//   };

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3> Indent Issue </h3>
//         <br />
//         <div className="RegisFormcon_1">
//           {Object.keys(summa1)
//             .filter((ele) => {
//               if (ele === 'IndentIssueInvoice') {
//                 if (summa1['IndentIssueInvoice']) {
//                   return true;
//                 }
//                 return false;
//               }
//               return true;
//             })
//             .map((field, indx) => (
//               <div className="RegisForm_1" key={indx + 'Indent_issue_key'}>
//                 <label htmlFor={field + 'ind_issue'}>
//                   {formatLabel(field)}
//                 </label>
//                 {field === 'IssueFromNurseStation' ||
//                 field === 'IssueToNurseStation' ? (
//                   <div
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'flex-start',
//                       gap: '10px',
//                       width: '150px',
//                     }}
//                   >
//                     <label style={{ width: 'auto' }} htmlFor={`${field}_yes`}>
//                       <input
//                         required
//                         id={`${field}_yes`}
//                         type="radio"
//                         name={field}
//                         style={{ width: '15px' }}
//                         value="Yes"
//                         onChange={handlesumma1change}
//                         checked={summa1[field]}
//                         disabled={
//                           field === 'IssueToNurseStation' &&
//                           Object.keys(IndentEditData).length !== 0 &&
//                           IndentEditData.Raised_pk
//                         }
//                       />
//                       Yes
//                     </label>
//                     <label style={{ width: 'auto' }} htmlFor={`${field}_No`}>
//                       <input
//                         required
//                         id={`${field}_No`}
//                         type="radio"
//                         name={field}
//                         style={{ width: '15px' }}
//                         value="No"
//                         onChange={handlesumma1change}
//                         checked={!summa1[field]}
//                         disabled={
//                           field === 'IssueToNurseStation' &&
//                           Object.keys(IndentEditData).length !== 0 &&
//                           IndentEditData.Raised_pk
//                         }
//                       />
//                       No
//                     </label>
//                   </div>
//                 ) : [
//                     'IssueFromLocation',
//                     'IssueFromStore',
//                     'IssueToLocation',
//                     'IssueToStore',
//                   ].includes(field) ? (
//                   <select
//                     name={field}
//                     id={field + 'ind_issue'}
//                     value={summa1[field]}
//                     onChange={handlesumma1change}
//                     disabled={
//                       ['IssueToLocation', 'IssueToStore'].includes(field) &&
//                       Object.keys(IndentEditData).length !== 0 &&
//                       IndentEditData.Raised_pk
//                     }
//                   >
//                     <option value="">Select</option>
//                     {['IssueFromLocation', 'IssueToLocation'].includes(field) &&
//                       summaArray1.map((ele, ind) => (
//                         <option key={ind + 'key'} value={ele.id}>
//                           {ele.locationName}
//                         </option>
//                       ))}
//                     {['IssueFromStore'].includes(field) &&
//                       summaArray2.map((ele, ind) => (
//                         <option key={ind + 'key'} value={ele.id}>
//                           {summa1?.IssueFromNurseStation
//                             ? ele.NurseStation
//                             : ele.StoreName}
//                         </option>
//                       ))}
//                     {['IssueToStore'].includes(field) &&
//                       summaArray3.map((ele, ind) => (
//                         <option key={ind + 'key'} value={ele.id}>
//                           {summa1?.IssueToNurseStation
//                             ? ele.NurseStation
//                             : ele.StoreName}
//                         </option>
//                       ))}
//                   </select>
//                 ) : (
//                   <input
//                     required
//                     id={field + 'ind_raise'}
//                     type="text"
//                     name={field}
//                     value={summa1[field]}
//                     disabled
//                     onChange={handlesumma1change}
//                   />
//                 )}
//               </div>
//             ))}
//         </div>

//         {summaArray4.length !== 0 && (
//           <div className="RegisFormcon_1 jjxjx_">
//             <ReactGrid columns={summa2Columns} RowData={summaArray4} />
//           </div>
//         )}

//         <div className="RegisFormcon_1">
//           {Object.keys(summa2)
//             .filter(
//               (f) => !['id', 'Raisedpk', 'Issuedpk', 'Status'].includes(f)
//             )
//             .map((field, index) => (
//               <div className="RegisForm_1" key={index + 'ind_raise_key'}>
//                 <label htmlFor={field}>
//                   {formatLabel(field)}
//                   <span>:</span>
//                 </label>
//                 {['ItemCode', 'ItemName', 'BatchNo'].includes(field) ? (
//                   <div className="Search_patient_icons">
//                     <input
//                       type={'text'}
//                       id={field}
//                       name={field}
//                       list={`${field}_indent_issue_list`}
//                       value={summa2[field]}
//                       onChange={handlesumma2change}
//                       autoComplete='off'
//                       placeholder={
//                         field === 'BatchNo'
//                           ? summa2.ItemCode && summaArray6.length === 0
//                             ? ' Stock Not Available'
//                             : ''
//                           : ''
//                       }
//                       disabled={
//                         field === 'BatchNo'
//                           ? !summaArray6.length
//                           : summa2?.Raisedpk
//                       }
//                     />

//                     <datalist id={`${field}_indent_issue_list`}>
//                       {field === 'ItemCode' &&
//                         summaArray5.map((field, indx) => (
//                           <option key={indx} value={field.id}>
//                             {`${field.id} | ${field.ItemName}`}
//                           </option>
//                         ))}
//                       {field === 'ItemName' &&
//                         summaArray5.map((field, indx) => (
//                           <option key={indx} value={field.ItemName}>
//                             {`${field.id} | ${field.ItemName}`}
//                           </option>
//                         ))}
//                       {field === 'BatchNo' &&
//                         summaArray6.map((field, indx) => (
//                           <option key={indx} value={field.BatchNo}>
//                             {`
//                               B No : ${field.BatchNo} |
//                               A Qty : ${field.AvailableQuantity} |
//                               MRP : ${field.Sellable_qty_price}
                            
//                               `}
//                           </option>
//                         ))}
//                     </datalist>
//                     {field !== 'BatchNo' && !summa2?.Raisedpk && (
//                       <span
//                         onClick={(e) =>
//                           handlesearchItems(
//                             field === 'ItemCode' ? 'id' : 'name'
//                           )
//                         }
//                       >
//                         <ManageSearchIcon />
//                       </span>
//                     )}
//                     {field === 'BatchNo' && (
//                       <span
//                         onClick={(e) =>
//                           handlesearchItemsBatchNo(
//                             field === 'ItemCode' ? 'id' : 'name'
//                           )
//                         }
//                       >
//                         <ManageSearchIcon />
//                       </span>
//                     )}
//                   </div>
//                 ) : field === 'Remarks' ? (
//                   <textarea
//                     name={field}
//                     value={summa2[field]}
//                     onChange={handlesumma2change}
//                   />
//                 ) : field === 'SerialNo' ? (
//                   <div
//                     style={{
//                       width: '150px',
//                       display: 'flex',
//                       justifyContent: 'space-around',
//                     }}
//                   >
//                     <button
//                       className="fileviewbtn"
//                       onClick={() => handleselectSerialNo(summa2?.SerialNo)}
//                     >
//                       Select Serial No
//                     </button>
//                   </div>
//                 ) : field === 'Reason' ? (
//                   <select
//                     name="Reason"
//                     value={summa2['Reason']}
//                     onChange={handlesumma2change}
//                     disabled={summa2.Raisedpk}
//                   >
//                     {[
//                       '',
//                       'IndentMovement',
//                       'ExpiryProducts',
//                       'DamagedProducts',
//                     ].map((dd, indd) => (
//                       <option key={indd} value={dd}>
//                         {dd === '' ? 'Select' : formatunderscoreLabel(dd)}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   <input
//                     type={['IssueQuantity'].includes(field) ? 'number' : 'text'}
//                     id={field}
//                     name={field}
//                     value={summa2[field]}
//                     onChange={handlesumma2change}
//                     onKeyDown={BlockInvalidcharecternumber}
//                     disabled={!['IssueQuantity'].includes(field)}
//                   />
//                 )}
//               </div>
//             ))}
//         </div>
//         <br />
//         <div className="Main_container_Btn">
//           <button onClick={handlesubmitsumma2}>
//             {summa2.id ? 'Update' : 'Save'}
//           </button>
//         </div>
//         <br />
//         {summaArray8.length !== 0 && (
//           <>
//             <div className="RegisFormcon_1 jjxjx_">
//               <ReactGrid columns={Summa8column} RowData={summaArray8} />
//             </div>

//             <div className="Main_container_Btn">
//               <button onClick={handlesubmitIndentIssue}>
//                 {summa1.IndentIssueInvoice ? 'Update Indent' : 'Save Indent'}
//               </button>
//             </div>
//             <br />
//           </>
//         )}
//       </div>
//       <ToastAlert Message={toast.message} Type={toast.type} />
//       {summabool1 && (
//         <div className="loader" onClick={() => setsummabool1(false)}>
//           <div
//             className="loader_register_roomshow"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="common_center_tag">
//               <span>Select Serial No</span>
//             </div>
//             <div className="inventory-serial-numbers-container">
//               {Array.isArray(summaArray7) &&
//                 summaArray7.map((field) => (
//                   <div
//                     key={field.pk}
//                     className={`inventory-serial-number ${field.Status ? 'active' : 'inactive'}`}
//                   >
//                     {field.Serial_Number}
//                     <span
//                       className="inventory-icon-container"
//                       onClick={() => {
//                         setsummaArray7((prev) => {
//                           // Count the items with Status set to true
//                           const selectedCount = prev.filter(
//                             (item) => item.Status
//                           ).length;

//                           return prev.map((item) =>
//                             item.pk === field.pk
//                               ? {
//                                   ...item,
//                                   Status:
//                                     item.Status ||
//                                     selectedCount < summa2.IssueQuantity
//                                       ? !item.Status
//                                       : item.Status,
//                                 }
//                               : item
//                           );
//                         });
//                       }}
//                     >
//                       {field.Status ? <FaTimes /> : <FaPlus />}
//                     </span>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {summaselectedSerialNo && (
//         <div className="loader" onClick={() => setsummaselectedSerialNo(null)}>
//           <div
//             className="loader_register_roomshow"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="common_center_tag">
//               <span>
//                 Selected Serial No for {summaselectedSerialNo?.ItemName} Batch
//                 No {summaselectedSerialNo?.BatchNo}
//               </span>
//             </div>
//             <br />
//             <div className="inventory-serial-numbers-container">
//               {Array.isArray(summaselectedSerialNo?.SerialNo) &&
//                 summaselectedSerialNo?.SerialNo.map((field) => (
//                   <div
//                     key={field.pk}
//                     className={`inventory-serial-number`}
//                     style={{ color: 'black' }}
//                   >
//                     {field.Serial_Number}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default IndentIssue;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BlockInvalidcharecternumber,
  formatLabel,
  formatunderscoreLabel,
} from '../../../OtherComponent/OtherFunctions';
import axios from 'axios';
import ReactGrid from '../../../OtherComponent/ReactGrid/ReactGrid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ToastAlert from '../../../OtherComponent/ToastContainer/ToastAlert';
import { FaTimes, FaPlus } from 'react-icons/fa';
import '../../Inventory.css';
import VisibilityIcon from '@mui/icons-material/Visibility';

const IndentIssue = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const IndentEditData = useSelector(
    (state) => state.Inventorydata?.IndentEditData
  );
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [summa1, setsumma1] = useState({
    IndentIssueInvoice: null,
    IssueFromLocation: '',
    IssueFromNurseStation: false,
    IssueFromStore: '',
    IssueToLocation: '',
    IssueToNurseStation: false,
    IssueToStore: '',
  });

  console.log('summa1?????', summa1);

  const [summa2, setsumma2] = useState({
    id: null,
    Raisedpk: null,
    Issuedpk: null,
    ItemCode: '',
    ItemName: '',
    Reason: 'IndentMovement',
    BatchNo: '',
    IssueQuantity: '',
    Remarks: '',
    Status: 'Pending',
  });
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const [summabool1, setsummabool1] = useState(false);
  const [summaselectedSerialNo, setsummaselectedSerialNo] = useState(null);

  const [summaArray1, setsummaArray1] = useState([]);
  const [summaArray2, setsummaArray2] = useState([]);
  const [summaArray3, setsummaArray3] = useState([]);
  const [summaArray4, setsummaArray4] = useState([]);
  console.log('summaArray4', summaArray4);
  const [summaArray5, setsummaArray5] = useState([]);
  const [summaArray6, setsummaArray6] = useState([]);
  const [summaArray7, setsummaArray7] = useState([]);
  const [summaArray8, setsummaArray8] = useState([]);
  console.log('summaArray8', summaArray8);
  const [pageAccess, setPageAccess] = useState([]);

  // Currency formatting function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return summaArray8.reduce((total, item) => {
      if (item.Status !== 'Cancelled') {
        const itemTotal = parseFloat(item.IssueQuantity || 0) * parseFloat(item.Sellable_qty_price || 0);
        return total + itemTotal;
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    if (UserData?.Storeid || 1) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${UrlLink}Masters/inventory_page_access_by_storeid`,
            {
              params: { Storeid: UserData?.Storeid || 1 },
            }
          );
          const ress = response.data;
          if (ress.length > 0 && ress[0].page_access) {
            setPageAccess(ress[0].page_access[0]);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [UrlLink, UserData]);

  const handlesumma1change = (e) => {
    const { name, value } = e.target;
    if (name === 'IssueFromNurseStation') {
      setsumma1((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        IssueFromStore: '',
      }));
    } else if (name === 'IssueToNurseStation') {
      setsumma1((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        IssueToStore: '',
      }));
    } else {
      setsumma1((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (Object.keys(IndentEditData).length !== 0) {
      console.log('?????', IndentEditData);

      const { Item_Detials, ...rest } = IndentEditData;

      if (rest.Raised_pk) {
        setsumma1((prev) => ({
          IndentIssueInvoice: rest?.Issued_pk,
          IndentRaiseInvoice: rest?.Raised_pk,
          RequestFromLocation: rest?.RaisedFromLocation,
          RequestFromStore: `${rest?.RaisedFromNurseStation ? 'NurseStation' : 'Store'}-${rest?.RaisedFromNurseStation ? rest?.RaisedFromNurseStationWard : rest?.RaisedFromStore}`,
          RequestToLocation: rest?.RaisedToLocation,
          RequestToStore: `${rest?.RaisedToNurseStation ? 'NurseStation' : 'Store'}-${rest?.RaisedToNurseStation ? rest?.RaisedToNurseStationWard : rest?.RaisedToStore}`,
          RequestDate: rest?.RaisedDate,
          Reason: rest?.RaisedReason,
          IssueFromLocation: rest?.RaisedToLocation_pk,
          IssueFromNurseStation: rest?.RaisedToNurseStation,
          IssueFromStore: rest?.RaisedToNurseStation
            ? rest?.RaisedToNurseStation_pk
            : rest?.RaisedToStore_pk,
          IssueToLocation: rest?.RaisedFromLocation_pk,
          IssueToNurseStation: rest?.RaisedFromNurseStation,
          IssueToStore: rest?.RaisedFromNurseStation
            ? rest?.RaisedFromNurseStation_pk
            : rest?.RaisedFromStore_pk,
        }));
      } else {
        setsumma1((prev) => ({
          IndentIssueInvoice: rest?.Issued_pk,
          IssueFromLocation: rest?.IssuedFromLocation_pk,
          IssueFromNurseStation: rest?.IssuedFromNurseStation,
          IssueFromStore: rest?.IssuedFromNurseStation
            ? rest?.IssuedFromNurseStation_pk
            : rest?.IssuedFromStore_pk,
          IssueToLocation: rest?.IssuedToLocation_pk,
          IssueToNurseStation: rest?.IssuedToNurseStation,
          IssueToStore: rest?.IssuedToNurseStation
            ? rest?.IssuedToNurseStation_pk
            : rest?.IssuedToStore_pk,
        }));
      }
    } else {
      setsumma1({
        IndentIssueInvoice: null,
        IssueFromLocation: userRecord?.location,
        IssueFromNurseStation: false,
        IssueFromStore: '',
        IssueToLocation: userRecord?.location,
        IssueToNurseStation: false,
        IssueToStore: '',
      });
    }
  }, [IndentEditData, userRecord?.location]);

  useEffect(() => {
    const fetchDataForItems = async () => {
      if (
        Object.keys(IndentEditData).length !== 0 &&
        summa1.IssueFromLocation &&
        summa1.IssueFromStore
      ) {
        const { Item_Detials, ...rest } = IndentEditData;
        try {
          const updated_Item_Detials = await Promise.all(
            Item_Detials.map(async (field) => {
              const sendata = {
                ItemCode: field.ItemCode,
                Location: summa1.IssueFromLocation,
                Isward: summa1.IssueFromNurseStation,
                StoreName: summa1.IssueFromStore,
              };

              try {
                const { data: datasss } = await axios.get(
                  `${UrlLink}Inventory/get_item_detials_for_batch_indent_issue`,
                  { params: sendata }
                );

                return {
                  ...field,
                  IssuedQuantity: 0,
                  PendingQuantity: field?.RaisedQuantity,
                  AvailableStatus:
                    Array.isArray(datasss) &&
                    datasss.every((f) => f.AvailableQuantity === 0)
                      ? 'Not Available'
                      : 'Available',
                };
              } catch (error) {
                console.error('Error fetching data for item:', error);
                return field; // Return original field data if there's an error
              }
            })
          );

          // setUpdatedItemDetails(updated_Item_Detials); // Example state update
          setsummaArray4(updated_Item_Detials);
        } catch (error) {
          console.error('Error processing items:', error);
        }
      }
    };

    if (IndentEditData?.editMode) {
      setsummaArray8(IndentEditData?.Item_Detials || []);
    } else {
      fetchDataForItems();
    }
  }, [
    IndentEditData,
    UrlLink,
    summa1.IssueFromLocation,
    summa1.IssueFromNurseStation,
    summa1.IssueFromStore,
  ]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data;
        setsummaArray1(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    if (summa1.IssueFromLocation) {
      axios
        .get(
          `${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${summa1.IssueFromLocation}&IsFromWardStore=${summa1.IssueFromNurseStation}`
        )
        .then((res) => {
          const ress = res.data.filter((f) => {
            if (
              Object.keys(IndentEditData).length !== 0 &&
              summa1.IssueFromLocation ===
                IndentEditData.RaisedFromLocation_pk &&
              summa1.IssueFromNurseStation ===
                IndentEditData.RaisedFromWardStore
            ) {
              return (
                f.id !==
                +(IndentEditData.RaisedFromWardStore
                  ? IndentEditData.RaisedFromStoreWard_pk
                  : IndentEditData.RaisedFromStore_pk)
              );
            } else {
              return f;
            }
          });
          setsummaArray2(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setsummaArray2([]);
    }
  }, [
    UrlLink,
    summa1.IssueFromLocation,
    summa1.IssueFromNurseStation,
    IndentEditData?.RaisedFromLocation_pk,
    IndentEditData?.RaisedFromWardStore,
    IndentEditData?.RaisedFromStoreWard_pk,
    IndentEditData?.RaisedFromStore_pk,
    IndentEditData,
  ]);

  useEffect(() => {
    if (summa1.IssueToLocation) {
      axios
        .get(
          `${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${summa1.IssueToLocation}&IsFromWardStore=${summa1.IssueToNurseStation}`
        )
        .then((res) => {
          const ress = res.data.filter((f) =>
            summa1.IssueToLocation === summa1.IssueFromLocation &&
            summa1.IssueToNurseStation === summa1.IssueFromNurseStation
              ? f.id !== +summa1.IssueFromStore
              : f
          );
          console.log('iiii???----', ress);

          setsummaArray3(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setsummaArray3([]);
    }
  }, [
    UrlLink,
    summa1.IssueToLocation,
    summa1.IssueToNurseStation,
    summa1.IssueFromLocation,
    summa1.IssueFromNurseStation,
    summa1.IssueFromStore,
  ]);

  const handlesumma2change = (e) => {
    const { name, value } = e.target;
    if (name === 'ItemCode') {
      setsumma2((prev) => ({
        id: prev.id,
        Raisedpk: prev?.Raisedpk,
        Issuedpk: prev?.Issuedpk,
        [name]: value,
        ItemName: '',
        Reason: 'IndentMovement',
        BatchNo: '',
        IssueQuantity: '',
        Remarks: '',
        Status: 'Pending',
      }));
    } else if (name === 'ItemName') {
      setsumma2((prev) => ({
        id: prev.id,
        Raisedpk: prev?.Raisedpk,
        Issuedpk: prev?.Issuedpk,
        ItemCode: '',
        [name]: value,
        Reason: 'IndentMovement',
        BatchNo: '',
        IssueQuantity: '',
        Remarks: '',
        Status: 'Pending',
      }));
    } else if (name === 'BatchNo') {
      if (summa2?.Raisedpk) {
        setsumma2((prev) => ({
          id: prev?.id,
          Raisedpk: prev?.Raisedpk,
          Issuedpk: prev?.Issuedpk,
          ItemCode: prev?.ItemCode,
          ItemName: prev?.ItemName,
          ProductCategory: prev?.ProductCategory,
          SubCategory: prev?.SubCategory,
          PackType: prev?.PackType,
          PackQuantity: prev?.PackQuantity,
          RaisedQuantity: prev?.RaisedQuantity,
          Reason: prev?.Reason,
          BatchNo: value,
          IssueQuantity: '',
          Remarks: '',
          Status: 'Pending',
        }));
      } else {
        setsumma2((prev) => ({
          id: prev?.id,
          Raisedpk: prev?.Raisedpk,
          Issuedpk: prev?.Issuedpk,
          ItemCode: prev?.ItemCode,
          ItemName: prev?.ItemName,
          ProductCategory: prev?.ProductCategory,
          SubCategory: prev?.SubCategory,
          PackType: prev?.PackType,
          PackQuantity: prev?.PackQuantity,
          Reason: prev?.Reason,
          BatchNo: value,
          IssueQuantity: '',
          Remarks: '',
          Status: 'Pending',
        }));
      }
    } else if (name === 'IssueQuantity') {
      if (summa2?.AvailableQuantity >= value) {
        setsumma2((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else {
        setsumma2((prev) => ({
          ...prev,
          [name]: '',
        }));
        const tdata = {
          message: `Please enter valid Quantity.`,
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      }
    } else {
      setsumma2((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Inventory/get_item_detials_for_indent?ItemCode=${summa2.ItemCode}&ItemName=${summa2.ItemName}&IndentType=Issued`
      )
      .then((res) => {
        const ress = res.data;
        if (Object.keys(IndentEditData).length !== 0) {
          const summadata = res.data.filter(
            (f) =>
              !IndentEditData.Item_Detials.some(
                (p) => '' + p.ItemCode === '' + f.id
              )
          );
          setsummaArray5(summadata);
        } else {
          setsummaArray5(ress);
        }
      })
      .catch((err) => {
        console.log(err);
        setsummaArray5([]);
      });
  }, [UrlLink, summa2.ItemCode, summa2.ItemName, IndentEditData]);

  const handlesearchItems = (type = 'id') => {
    if (summa2.ItemCode || summa2.ItemName) {
      let find = summaArray5.find((ele) => '' + ele.id === summa2.ItemCode);
      if (type !== 'id') {
        find = summaArray5.find((ele) => '' + ele.ItemName === summa2.ItemName);
      }
      if (find) {
        const { id, ItemName, ...rest } = find;
        setsumma2((prev) => ({
          id: prev.id,
          Raisedpk: prev.Raisedpk,
          Issuedpk: prev.Issuedpk,
          ItemCode: id,
          ItemName: ItemName,
          ...rest,
          Reason: 'IndentMovement',
          BatchNo: '',
          IssueQuantity: '',
          Remarks: '',
          Status: prev?.Status,
        }));
      } else {
        const tdata = {
          message: `Please enter valid Item Code or Item Name to search.`,
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      }
    } else {
      setsumma2((prev) => ({
        id: prev.id,
        Raisedpk: prev.Raisedpk,
        Issuedpk: prev.Issuedpk,
        ItemCode: type === 'id' ? prev.ItemCode : '',
        ItemName: type !== 'id' ? prev.ItemName : '',
        Reason: 'IndentMovement',
        BatchNo: '',
        IssueQuantity: '',
        Remarks: '',
        Status: prev?.Status,
      }));
      const tdata = {
        message: `Please fill atleast any one of the Item Code or Item Name to search.`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  const handlesearchItemsBatchNo = () => {
    if (summa2.BatchNo) {
      const find = summaArray6.find((f) => f.BatchNo === summa2.BatchNo);
      if (find) {
        setsumma2((prev) => ({
          id: prev?.id,
          Raisedpk: prev?.Raisedpk,
          Issuedpk: prev?.Issuedpk,
          ItemCode: prev?.ItemCode,
          ItemName: prev?.ItemName,
          ProductCategory: prev?.ProductCategory,
          SubCategory: prev?.SubCategory,
          PackType: prev?.PackType,
          PackQuantity: prev?.PackQuantity,
          ...(prev.Raisedpk && { RaisedQuantity: prev?.RaisedQuantity }),
          Reason: prev.Reason,
          BatchNo: prev?.BatchNo,
          AvailableQuantity: find?.AvailableQuantity,
          Sellable_qty_price: find?.Sellable_qty_price, // Ensure selling price is included
          IssueQuantity: '',
          ...(find?.SerialNoAvailable && { SerialNo: [] }),
          Remarks: '',
          Status: 'Pending',
        }));
      } else {
        const tdata = {
          message: `Please enter valid Batch No to search.`,
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      }
    } else {
      const tdata = {
        message: `Please fill atleast any one of the Batch No to search.`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };
  console.log(summa2);

  const handelEditsumma2Array = (params) => {
    console.log('paramsedit', params);

    setsumma2((prev) => ({
      id: null,
      Raisedpk: params?.pk,
      Issuedpk: null,
      ItemCode: params?.ItemCode,
      ItemName: params?.ItemName,
      ProductCategory: params?.ProductCategory,
      SubCategory: params?.SubCategory,
      PackType: params?.PackType,
      PackQuantity: params?.PackQuantity,
      RaisedQuantity: params?.PendingQuantity,
      Reason: 'IndentMovement',
      BatchNo: '',
      IssueQuantity: '',
      Remarks: '',
      Status: 'Pending',
    }));
  };

  useEffect(() => {
    if (
      summa2.ItemCode &&
      summa2.ItemName &&
      summa1.IssueFromLocation &&
      summa1.IssueFromStore
    ) {
      const sendata = {
        ItemCode: summa2.ItemCode,
        Location: summa1.IssueFromLocation,
        Isward: summa1.IssueFromNurseStation,
        StoreName: summa1.IssueFromStore,
        ExpiredProducts: summa2.Reason === 'ExpiryProducts',
      };
      axios
        .get(`${UrlLink}Inventory/get_item_detials_for_batch_indent_issue`, {
          params: sendata,
        })
        .then((res) => {
          console.log(res);
          const datasss = Array.isArray(res.data) ? res.data : [];
          if (datasss.length !== 0) {
            setsummaArray6(datasss);
          } else {
            setsummaArray6([]);
            const tdata = {
              message: `The stock is not Available in selected location for select Product `,
              type: 'warn',
            };
            dispatchvalue({ type: 'toast', value: tdata });
          }
        })
        .catch((err) => {
          console.error(err);
          setsummaArray6([]);
        });
    }
  }, [
    UrlLink,
    summa2.ItemCode,
    summa2.Reason,
    summa1.IssueFromLocation,
    summa1.IssueFromNurseStation,
    summa1.IssueFromStore,
    dispatchvalue,
  ]);

  const summa2Columns = [
    ...[
      'id',
      'ItemCode',
      'ItemName',
      'ProductCategory',
      'SubCategory',
      'PackType',
      'PackQuantity',
      'total_available_qty',
      'pharma_available_qty',
      'op_available_qty',
      'ip_available_qty',
      'foc_available_qty',
      'RaisedQuantity',
      'IssuedQuantity',
      'PendingQuantity',
      'Action',
    ].map((field) => ({
      key: field,
      name: field === 'id' ? 'S.No' : formatLabel(field),

      renderCell: (params) =>
        field === 'Action' ? (
          params.row.AvailableStatus === 'Available' ? (
            <>
              {params.row.PendingQuantity !== 0 ? (
                <Button
                  className="cell_btn"
                  onClick={() => handelEditsumma2Array(params.row)}
                >
                  <EditIcon className="check_box_clrr_cancell" />
                </Button>
              ) : (
                <Button>No Action</Button>
              )}
            </>
          ) : (
            'Stock Not Available'
          )
        ) : params.row[field] ? (
          params.row[field]
        ) : ['IssuedQuantity', 'PendingQuantity'].includes(field) ? (
          params.row[field]
        ) : (
          '-'
        ),
    })),
  ];

  const handleeditsumma8 = (params) => {
    const { SerialNoAvailable, PendingQuantity, RaisedQuantity, ...rest } =
      params;
    setsumma2({
      id: params?.id,
      Raisedpk: params?.Raisedpk,
      Issuedpk: params?.Issuedpk,
      ItemCode: params?.ItemCode,
      ItemName: params?.ItemName,
      ProductCategory: params?.ProductCategory,
      SubCategory: params?.SubCategory,
      PackType: params?.PackType,
      PackQuantity: params?.PackQuantity,
      ...(params?.RaisedQuantity && { RaisedQuantity: params?.RaisedQuantity }),
      Reason: params?.Reason,
      BatchNo: params?.BatchNo,
      AvailableQuantity: params?.AvailableQuantity,
      Sellable_qty_price: params?.Sellable_qty_price, // Include selling price
      IssueQuantity: params?.IssueQuantity,
      ...(params?.SerialNoAvailable && { SerialNo: params?.SerialNo }),
      Remarks: params?.Remarks,
      Status: params?.Status,
    });
  };
  const handledeletesumma8 = (params) => {
    if (params.Issuedpk) {
      setsummaArray8((prev) =>
        prev.map((product) =>
          '' + product.Issuedpk === '' + params.Issuedpk
            ? { ...product, Status: 'Cancelled' }
            : product
        )
      );
    } else {
      setsummaArray8((prev) => prev.filter((p) => +p.id !== +params.id));
    }
  };

  const Summa8column = [
    ...[
      'id',
      'ItemCode',
      'ItemName',
      'ProductCategory',
      'SubCategory',
      'PackType',
      'PackQuantity',
      'BatchNo',
      'IssueQuantity',
      'SerialNo',
      'Sellable_qty_price',
      'TotalAmount',
      'Action',
    ].map((field) => ({
      key: field,
      name: field === 'id' ? 'S.No' : formatLabel(field),

      renderCell: (params) =>
        field === 'SerialNo' ? (
          params.row[field] && Array.isArray(params.row.SerialNo) ? (
            <Button
              className="cell_btn"
              onClick={() => setsummaselectedSerialNo(params.row)}
            >
              <VisibilityIcon className="check_box_clrr_cancell" />
            </Button>
          ) : (
            'Serial No Not Available'
          )
        ) : field === 'TotalAmount' ? (
          // Calculate Total Amount = IssueQuantity * Selling Price
          params.row.IssueQuantity && params.row.Sellable_qty_price ? 
            formatCurrency(parseFloat(params.row.IssueQuantity) * parseFloat(params.row.Sellable_qty_price))
          : formatCurrency(0)
        ) : field === 'Action' ? (
          params.row.Status !== 'Cancelled' ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => handleeditsumma8(params.row)}
              >
                <EditIcon className="check_box_clrr_cancell" />
              </Button>
              <Button
                className="cell_btn"
                onClick={() => handledeletesumma8(params.row)}
              >
                <DeleteIcon className="check_box_clrr_cancell" />
              </Button>
            </>
          ) : (
            'Cancelled'
          )
        ) : params.row[field] ? (
          params.row[field]
        ) : (
          '-'
        ),
    })),
  ];

  const handleselectSerialNo = (params) => {
    if (summa2.IssueQuantity && summa2?.BatchNo) {
      const getserialdatafetch = async () => {
        try {
          const sendata = {
            ItemCode: summa2.ItemCode,
            Location: summa1.IssueFromLocation,
            Isward: summa1.IssueFromNurseStation,
            StoreName: summa1.IssueFromStore,
            BatchNo: summa2.BatchNo,
            IssueQuantity: summa2.IssueQuantity,
          };
          const response = await axios.get(
            `${UrlLink}Inventory/get_serialno_detials_for_batch_indent_issue`,
            { params: sendata }
          );
          const serialData = Array.isArray(response.data) ? response.data : [];
          // Flatten existingSerialNumbers to get a single array of serial number `pk` values
          const existingSerialNumbers = summaArray8
            .filter(
              (ele) =>
                '' + ele.ItemCode === '' + summa2.ItemCode &&
                ele.BatchNo === summa2.BatchNo
            )
            .flatMap((ele) => ele.SerialNo.map((e) => e.pk));

          const filteredSerialData = serialData
            .filter((item) =>
              !summa2?.id ? !existingSerialNumbers.includes(item.pk) : item
            )
            .map((ele, indc) => ({
              ...ele,
              Status: indc < summa2.IssueQuantity,
            }));

          setsummaArray7(filteredSerialData);
          setsummabool1(true);
        } catch (error) {
          console.error(error);
        }
      };
      if (summaArray7.length === 0) {
        getserialdatafetch();
      } else if (
        summaArray7.filter((f) => f.Status).length !== +summa2.IssueQuantity
      ) {
        getserialdatafetch();
      } else {
        setsummabool1(true);
      }
    } else {
      setsummabool1(false);
      const tdata = {
        message: `Please fill both of the Batch No and Issue Quantity.`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  useEffect(() => {
    setsumma2((prev) => ({
      ...prev,
      ...(prev?.SerialNo &&
        Array.isArray(prev.SerialNo) && {
          SerialNo: summaArray7.filter((f) => f.Status),
        }),
    }));
  }, [summaArray7]);

  console.log(summaArray4);
  console.log(summaArray8);
  console.log('summa2',summa2);

//   useEffect(()=>{
//    if (summa2.IssueQuantity>summa2?.RaisedQuantity) {
// window.confirm(`Did You Want to Give More Than They ask ? 🚚`)
//    }
//   },[summa2.IssueQuantity])

useEffect(() => {
  if (
    Number(summa2?.IssueQuantity) >
    Number(summa2?.RaisedQuantity)
  ) {
    const allowMore = window.confirm(
      `Did You Want to Give More Than They Ask? 🚚`
    );

    // If user clicks "Cancel"
    if (!allowMore) {
      setsumma2((prev) => ({
        ...prev,
        IssueQuantity: prev.RaisedQuantity, // revert / cap
      }));
    }
  }
}, [summa2.IssueQuantity]);


  const handlesubmitsumma2 = () => {
  
    const missingFields = Object.keys(summa2)
      .filter((f) => !['id', 'Raisedpk', 'Issuedpk','Remarks','SubCategory','PackType','PackQuantity'].includes(f))
      .filter((f) => !summa2[f]);
    if (missingFields.length !== 0) {
      dispatchvalue({
        type: 'toast',
        value: {
          message: `Please fill out all required fields: ${missingFields.join(', ')}`,
          type: 'warn',
        },
      });
    } else {
      const CheckDublicate = summaArray8.some(
        (ele) =>
          '' + ele.ItemCode === '' + summa2.ItemCode &&
          +ele.id !== +summa2.id &&
          ele.BatchNo === summa2.BatchNo &&
          ele.Reason === summa2.Reason &&
          ele.Status !== 'Cancelled'
      );
      if (CheckDublicate) {
        dispatchvalue({
          type: 'toast',
          value: {
            message: `This item has already exist in the name of same batch no and reason.`,
            type: 'warn',
          },
        });
      } else if (
        summa2?.SerialNo &&
        Array.isArray(summa2?.SerialNo) &&
        summa2?.SerialNo.length === 0
      ) {
        dispatchvalue({
          type: 'toast',
          value: {
            message: `Serial No Available for this Product and the Batch So please Choose the Serial No.`,
            type: 'warn',
          },
        });
      } else {
        if (summa2.id) {
          setsummaArray8((prev) =>
            prev.map((product) =>
              +product.id === summa2.id ? { ...summa2 } : product
            )
          );
        } else {
          setsummaArray8((prev) => [
            ...prev,
            {
              ...summa2,
              id: prev.length + 1,
            },
          ]);
        }
        setsumma2({
          id: null,
          Raisedpk: null,
          Issuedpk: null,
          ItemCode: '',
          ItemName: '',
          Reason: 'IndentMovement',
          BatchNo: '',
          IssueQuantity: '',
          Remarks: '',
          Status: 'Pending',
        });
      }
    }
  };

  useEffect(() => {
    setsummaArray4((prev) => {
      return prev.map((outerEle) => {
        console.log('outerEle', outerEle);
        // Calculate the cumulative IssuedQuantity for matching items in summaArray8
        const totalIssuedQuantity = summaArray8
          .filter((innerEle) => '' + innerEle.Raisedpk === '' + outerEle.pk)
          .reduce((acc, curr) => acc + +curr.IssueQuantity, 0);
        console.log('totalIssuedQuantity', totalIssuedQuantity);

        return {
          ...outerEle,
          IssuedQuantity: totalIssuedQuantity,
          PendingQuantity:
            +outerEle.RaisedQuantity > totalIssuedQuantity
              ? +outerEle.RaisedQuantity - totalIssuedQuantity
              : 0,
        };
      });
    });
  }, [summaArray8]);

  const handlesubmitIndentIssue = () => {
    const missingFields = Object.keys(summa1)
      .filter(
        (f) =>
          ![
            'IndentIssueInvoice',
            'IssueFromNurseStation',
            'IssueToNurseStation',
            'Reason',
          ].includes(f)
      )
      .filter((f) => !summa1[f]);
    if (missingFields.length !== 0) {
      dispatchvalue({
        type: 'toast',
        value: {
          message: `Please fill out all required fields: ${missingFields.join(', ')}`,
          type: 'warn',
        },
      });
    } else {
      const errors = {
        AvailabilityQuantity: [],
        SerialNo: [],
      };
      summaArray8.forEach((element) => {
        if (element?.IssueQuantity > element?.AvailableQuantity) {
          errors['AvailabilityQuantity'].push(
            `Insufficient stock for ${element.ItemName} (ItemCode: ${element?.ItemCode}). Available: ${element.AvailableQuantity}, Requested: ${element?.IssueQuantity}.`
          );
        }
        if (element?.SerialNoAvailable && element?.SerialNo.length === 0) {
          errors['SerialNo'].push(
            `Please select vaild serial No for ${element.ItemName} (ItemCode: ${element?.ItemCode}). BatchNo: ${element.BatchNo}, Requested: ${element?.IssueQuantity} ,Selected SerialNo Quantity ${element?.SerialNo.length}.`
          );
        }
      });

      if (Object.values(errors).every((ele) => ele.length === 0)) {
        const sendadata = {
          ...summa1,
          ItemsData: summaArray8,
          createdBy: userRecord?.username,
          IS_Indent_Issue_Approve:pageAccess.IS_Indent_Issue_Approve,
        };

        console.log('123send data', sendadata);
        axios
          .post(`${UrlLink}Inventory/post_indent_issue_details`, sendadata)
          .then((res) => {
            console.log(res);
            navigate('/Home/InventoryMaster');
            dispatchvalue({ type: 'HrFolder', value: 'IndentIssueList' });
            dispatchvalue({ type: 'setPreviousFolder', value: null });
            dispatchvalue({ type: 'showMenu', value: true });
            // navigate('/Home/IndentIssueList')
          })
          .catch((err) => {
  console.error(err);

  const warnMsg =
    err?.response?.data?.warn?.[0] ||
    "Stock issue occurred";

  alert(warnMsg);
});

      } else {
        let message_warn = '';
        Object.keys(errors).map((ele) => {
          if (errors[ele].length !== 0) {
            message_warn += `${ele} warnings : \n`;
            errors[ele].forEach((ele, indx) => {
              message_warn += `${indx + 1}. ${ele}\n`;
            });
          }

        });
        alert(message_warn)
        dispatchvalue({
          type: 'toast',
          value: {
            message: message_warn,
            type: 'warn',
          },
        });
      }
    }
  };

  return (
    <>
      <div className="Main_container_app">
        <h3> Indent Issue </h3>
        <br />
        <div className="RegisFormcon_1">
          {Object.keys(summa1)
            .filter((ele) => {
              if (ele === 'IndentIssueInvoice') {
                if (summa1['IndentIssueInvoice']) {
                  return true;
                }
                return false;
              }
              return true;
            })
            .map((field, indx) => (
              <div className="RegisForm_1" key={indx + 'Indent_issue_key'}>
                <label htmlFor={field + 'ind_issue'}>
                  {formatLabel(field)}
                </label>
                {field === 'IssueFromNurseStation' ||
                field === 'IssueToNurseStation' ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      gap: '10px',
                      width: '150px',
                    }}
                  >
                    <label style={{ width: 'auto' }} htmlFor={`${field}_yes`}>
                      <input
                        required
                        id={`${field}_yes`}
                        type="radio"
                        name={field}
                        style={{ width: '15px' }}
                        value="Yes"
                        onChange={handlesumma1change}
                        checked={summa1[field]}
                        disabled={
                          field === 'IssueToNurseStation' &&
                          Object.keys(IndentEditData).length !== 0 &&
                          IndentEditData.Raised_pk
                        }
                      />
                      Yes
                    </label>
                    <label style={{ width: 'auto' }} htmlFor={`${field}_No`}>
                      <input
                        required
                        id={`${field}_No`}
                        type="radio"
                        name={field}
                        style={{ width: '15px' }}
                        value="No"
                        onChange={handlesumma1change}
                        checked={!summa1[field]}
                        disabled={
                          field === 'IssueToNurseStation' &&
                          Object.keys(IndentEditData).length !== 0 &&
                          IndentEditData.Raised_pk
                        }
                      />
                      No
                    </label>
                  </div>
                ) : [
                    'IssueFromLocation',
                    'IssueFromStore',
                    'IssueToLocation',
                    'IssueToStore',
                  ].includes(field) ? (
                  <select
                    name={field}
                    id={field + 'ind_issue'}
                    value={summa1[field]}
                    onChange={handlesumma1change}
                    disabled={
                      ['IssueToLocation', 'IssueToStore'].includes(field) &&
                      Object.keys(IndentEditData).length !== 0 &&
                      IndentEditData.Raised_pk
                    }
                  >
                    <option value="">Select</option>
                    {['IssueFromLocation', 'IssueToLocation'].includes(field) &&
                      summaArray1.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {ele.locationName}
                        </option>
                      ))}
                    {['IssueFromStore'].includes(field) &&
                      summaArray2.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {summa1?.IssueFromNurseStation
                            ? ele.NurseStation
                            : ele.StoreName}
                        </option>
                      ))}
                    {['IssueToStore'].includes(field) &&
                      summaArray3.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {summa1?.IssueToNurseStation
                            ? ele.NurseStation
                            : ele.StoreName}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    required
                    id={field + 'ind_raise'}
                    type="text"
                    name={field}
                    value={summa1[field]}
                    disabled
                    onChange={handlesumma1change}
                  />
                )}
              </div>
            ))}
        </div>

        {summaArray4.length !== 0 && (
          <div className="RegisFormcon_1 jjxjx_">
            <ReactGrid columns={summa2Columns} RowData={summaArray4} />
          </div>
        )}

        <div className="RegisFormcon_1">
          {Object.keys(summa2)
            .filter(
              (f) => !['id', 'Raisedpk', 'Issuedpk', 'Status'].includes(f)
            )
            .map((field, index) => (
              <div className="RegisForm_1" key={index + 'ind_raise_key'}>
                <label htmlFor={field}>
                  {formatLabel(field)}
                  <span>:</span>
                </label>
                {['ItemCode', 'ItemName', 'BatchNo'].includes(field) ? (
                  <div className="Search_patient_icons">
                    <input
                      type={'text'}
                      id={field}
                      name={field}
                      list={`${field}_indent_issue_list`}
                      value={summa2[field]}
                      onChange={handlesumma2change}
                      autoComplete='off'
                      placeholder={
                        field === 'BatchNo'
                          ? summa2.ItemCode && summaArray6.length === 0
                            ? ' Stock Not Available'
                            : ''
                          : ''
                      }
                      disabled={
                        field === 'BatchNo'
                          ? !summaArray6.length
                          : summa2?.Raisedpk
                      }
                    />

                    <datalist id={`${field}_indent_issue_list`}>
                      {field === 'ItemCode' &&
                        summaArray5.map((field, indx) => (
                          <option key={indx} value={field.id}>
                            {`${field.id} | ${field.ItemName}`}
                          </option>
                        ))}
                      {field === 'ItemName' &&
                        summaArray5.map((field, indx) => (
                          <option key={indx} value={field.ItemName}>
                            {`${field.id} | ${field.ItemName}`}
                          </option>
                        ))}
                      {field === 'BatchNo' &&
                        summaArray6.map((field, indx) => (
                          <option key={indx} value={field.BatchNo}>
                            {`
                              B No : ${field.BatchNo} |
                              A Qty : ${field.AvailableQuantity} |
                              MRP : ${field.Sellable_qty_price}
                            
                              `}
                          </option>
                        ))}
                    </datalist>
                    {field !== 'BatchNo' && !summa2?.Raisedpk && (
                      <span
                        onClick={(e) =>
                          handlesearchItems(
                            field === 'ItemCode' ? 'id' : 'name'
                          )
                        }
                      >
                        <ManageSearchIcon />
                      </span>
                    )}
                    {field === 'BatchNo' && (
                      <span
                        onClick={(e) =>
                          handlesearchItemsBatchNo(
                            field === 'ItemCode' ? 'id' : 'name'
                          )
                        }
                      >
                        <ManageSearchIcon />
                      </span>
                    )}
                  </div>
                ) : field === 'Remarks' ? (
                  <textarea
                    name={field}
                    value={summa2[field]}
                    onChange={handlesumma2change}
                  />
                ) : field === 'SerialNo' ? (
                  <div
                    style={{
                      width: '150px',
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <button
                      className="fileviewbtn"
                      onClick={() => handleselectSerialNo(summa2?.SerialNo)}
                    >
                      Select Serial No
                    </button>
                  </div>
                ) : field === 'Reason' ? (
                  <select
                    name="Reason"
                    value={summa2['Reason']}
                    onChange={handlesumma2change}
                    disabled={summa2.Raisedpk}
                  >
                    {[
                      '',
                      'IndentMovement',
                      'ExpiryProducts',
                      'DamagedProducts',
                    ].map((dd, indd) => (
                      <option key={indd} value={dd}>
                        {dd === '' ? 'Select' : formatunderscoreLabel(dd)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={['IssueQuantity'].includes(field) ? 'number' : 'text'}
                    id={field}
                    name={field}
                    value={summa2[field]}
                    onChange={handlesumma2change}
                    onKeyDown={BlockInvalidcharecternumber}
                    disabled={!['IssueQuantity'].includes(field)}
                  />
                )}
              </div>
            ))}
        </div>
        <br />
        <div className="Main_container_Btn">
          <button onClick={handlesubmitsumma2}>
            {summa2.id ? 'Update' : 'Save'}
          </button>
        </div>
        <br />
        {summaArray8.length !== 0 && (
          <>
            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid columns={Summa8column} RowData={summaArray8} />
            </div>

            {/* Grand Total Display */}
            <div className="grand-total-section" style={{ 
              textAlign: 'right', 
              margin: '20px 0',
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              <strong>Grand Total: {formatCurrency(calculateGrandTotal())}</strong>
            </div>

            <div className="Main_container_Btn">
              <button onClick={handlesubmitIndentIssue}>
                {summa1.IndentIssueInvoice ? 'Update Indent' : 'Save Indent'}
              </button>
            </div>
            <br />
          </>
        )}
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
      {summabool1 && (
        <div className="loader" onClick={() => setsummabool1(false)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="common_center_tag">
              <span>Select Serial No</span>
            </div>
            <div className="inventory-serial-numbers-container">
              {Array.isArray(summaArray7) &&
                summaArray7.map((field) => (
                  <div
                    key={field.pk}
                    className={`inventory-serial-number ${field.Status ? 'active' : 'inactive'}`}
                  >
                    {field.Serial_Number}
                    <span
                      className="inventory-icon-container"
                      onClick={() => {
                        setsummaArray7((prev) => {
                          // Count the items with Status set to true
                          const selectedCount = prev.filter(
                            (item) => item.Status
                          ).length;

                          return prev.map((item) =>
                            item.pk === field.pk
                              ? {
                                  ...item,
                                  Status:
                                    item.Status ||
                                    selectedCount < summa2.IssueQuantity
                                      ? !item.Status
                                      : item.Status,
                                }
                              : item
                          );
                        });
                      }}
                    >
                      {field.Status ? <FaTimes /> : <FaPlus />}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {summaselectedSerialNo && (
        <div className="loader" onClick={() => setsummaselectedSerialNo(null)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="common_center_tag">
              <span>
                Selected Serial No for {summaselectedSerialNo?.ItemName} Batch
                No {summaselectedSerialNo?.BatchNo}
              </span>
            </div>
            <br />
            <div className="inventory-serial-numbers-container">
              {Array.isArray(summaselectedSerialNo?.SerialNo) &&
                summaselectedSerialNo?.SerialNo.map((field) => (
                  <div
                    key={field.pk}
                    className={`inventory-serial-number`}
                    style={{ color: 'black' }}
                  >
                    {field.Serial_Number}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IndentIssue;