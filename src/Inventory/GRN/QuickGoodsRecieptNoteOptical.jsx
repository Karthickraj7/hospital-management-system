// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { addDays, format } from "date-fns";
// import axios from "axios";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
// import { BlockInvalidcharecternumber } from "../../OtherComponent/OtherFunctions";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import Button from "@mui/material/Button";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
// import ManageSearchIcon from "@mui/icons-material/ManageSearch";

// const QuickGoodsRecieptNote = () => {
//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const GoodsReceiptNoteEdit = useSelector(
//     (state) => state.Inventorydata?.GoodsReceiptNoteEdit
//   );
//   const [SubCategory, setSubCategory] = useState([]);
//   const [GenericNameData, setGenericNameData] = useState([])
//   const [ManufactureData, setManufactureData] = useState([])
//   const [ProductPackType, setProductPackType] = useState([])
//   const UserData = useSelector((state) => state.userRecord?.UserData);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   console.log('userRecord', userRecord?.username
//   )

//   const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
//   const [GrnSupplierDetials, setGrnSupplierDetials] = useState({
//     IsOldGRN: false,
//     GRNDate: "",
//     SupplierCode: "",
//     SupplierName: "",
//     ContactNumber: "",
//     SupplierBillNumber: "",
//     SupplierBillDate: "",
//     SupplierBillDueDate: "",
//     SupplierBillAmount: "",
//     StoreLocation: allowedStoreId || "",
//     ReceivingPersonName: userRecord?.username || "",
//     IsFOCAvailable: false,
//     FileAttachment: null,
//     Status: "Recieved",
//     pk: null,
//     TotalTaxableAmount: "",
//     TotalTaxAmount: "",
//     TotalAmount: "",
//     TotalDiscountMethod: "",
//     TotalDiscountType: "",
//     TotalDiscount: "",
//     TPD :'',
//     FinalTotalTaxableAmount: "",
//     FinalTotalTaxAmount: "",
//     FinalTotalAmount: "",
//     RoundOffAmount: "",
//     NetAmount: "",
//   });


//   const [GrnItemDetials, setGrnItemDetials] = useState({
//     id: null,
//     pk: null,
//     ItemCode: "",
//     ItemName: "",
//     // ----
//     IsOnlyFOCQty: false,
//     PurchaseRateTaxable: "",
//     TaxPercentage: "Nill",
//     PurchaseRateWithTax: "",
//     MRP: "",
//     TaxType: "GST",
//     ReceivedQty: "",
//     FOCQuantity: "",
//     TotalReceivedQty: "",
//     TotalPackQuantity: "",
//     IsMRPAsSellablePrice: true,
//     SellablePrice: "",
//     SellableQtyPrice: "",
//     TotalPackTaxableAmount: "",
//     TotalTaxAmount: "",
//     TotalPackAmount: "",
//     BatchNo: "",
//     IsManufactureDateAvailable: false,
//     ManufactureDate: "",
//     IsExpiryDateAvailable: false,
//     ExpiryDate: "",
//     DiscountMethod: "",
//     DiscountType: "",
//     Discount: "",
//     FinalTotalPackTaxableAmount: "",
//     FinalTotalTaxAmount: "",
//     FinalTotalPackAmount: "",
//     Status: "Recieved",
//       Reason: '', // Add Reason field
//   });

//   console.log('GrnItemDetials---', GrnItemDetials);

//   const [ProductListFormOne, setProductListFormOne] = useState([]);

//   const [ProductListFormTwo, setProductListFormTwo] = useState([]);

//   const [SupplierData, setSupplierData] = useState([]);
//   const [SupplierProductListData, setSupplierProductListData] = useState([]);
//   console.log('SupplierProductListData---', SupplierProductListData)
//   const [FocSupplierProductListData, setFocSupplierProductListData] = useState([]);
//   const [StoreLocationData, setStoreLocationData] = useState([]);
//   const [GrnProductListDatas, setGrnProductListDatas] = useState([]);
//   const clearGrnItemsList = () => {
//     setGrnItemDetials({
//       id: null,
//       pk: null,
//       ItemCode: "",
//       ItemName: "",
//       // ----
//       IsOnlyFOCQty: false,
//       PurchaseRateTaxable: "",
//       TaxPercentage: "Nill",
//       PurchaseRateWithTax: "",
//       MRP: "",
//       TaxType: "GST",
//       ReceivedQty: "",
//       FOCQuantity: "",
//       TotalReceivedQty: "",
//       TotalPackQuantity: "",
//       IsMRPAsSellablePrice: true,
//       SellablePrice: "",
//       SellableQtyPrice: "",
//       TotalPackTaxableAmount: "",
//       TotalTaxAmount: "",
//       TotalPackAmount: "",
//       BatchNo: "",
//       IsManufactureDateAvailable: false,
//       ManufactureDate: "",
//       IsExpiryDateAvailable: false,
//       ExpiryDate: "",
//       DiscountMethod: "",
//       DiscountType: "",
//       Discount: "",
//       FinalTotalPackTaxableAmount: "",
//       FinalTotalTaxAmount: "",
//       FinalTotalPackAmount: "",
//       Status: "Recieved",
//          Reason: '', // Add Reason field  
//     });
//   };

//   const currentDate = format(new Date(), "yyyy-MM-dd");

//   useEffect(() => {
//     setGrnSupplierDetials((prev) => ({
//       ...prev,
//       GRNDate: currentDate,
//       SupplierBillDate: currentDate,
//     }));
//   }, [GrnSupplierDetials.IsOldGRN, currentDate]);

//   useEffect(() => {
//     if (userRecord?.location) {
//       axios
//         .get(
//           `${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${userRecord?.location
//           }&forquickgrn=${false}`
//         )
//         .then((res) => {
//           const data = res.data;
//           setStoreLocationData(Array.isArray(data) ? data : []);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [UrlLink, userRecord?.location]);





// // useEffect(() => {
// //   const fetchItemData = async () => {
// //     if (!GrnItemDetials.ProductCategory_pk) return;

// //     const hasSubCategory = GrnItemDetials.SubCategory_pk !== "";
// //     const baseParams =
// //       `ProductCategory=${GrnItemDetials.ProductCategory_pk}` +
// //       (hasSubCategory ? `&SubProductCategory=${GrnItemDetials.SubCategory_pk}` : "");

// //     try {
// //       // Fetch the three URLs in parallel
// //       const [genericRes, manufacturerRes, packTypeRes] = await Promise.all([
// //         axios.get(`${UrlLink}Masters/GenericName_by_Product_SubProduct?${baseParams}&ItemCode=${GrnItemDetials.ItemCode}`),
// //         axios.get(`${UrlLink}Masters/CompanyName_by_Product_SubProduct?${baseParams}&ItemCode=${GrnItemDetials.ItemCode}`),
// //         axios.get(`${UrlLink}Masters/PackType_by_Product_SubProduct?${baseParams}&ItemCode=${GrnItemDetials.ItemCode}`),
// //       ]);

// //       // Prepare payload for this item
  

    
// //     } catch (error) {
// //       console.error("Error fetching item data:", error);
// //     }
// //   };

// //   fetchItemData();
// // }, [UrlLink, GrnItemDetials]);

// // Send all items in one POST


// useEffect(() => {
//   const fetchSubCategory = async () => {
//     if (GrnItemDetials?.ProductCategory_pk) {
//       try {
//         const params = {
//           ProductCategory: GrnItemDetials?.ProductCategory_pk,
//           ItemCode: GrnItemDetials?.ItemCode,  // <- fixed key
//         };

//         const { data } = await axios.get(
//           `${UrlLink}Masters/SubCategory_Master_link1`,
//           { params }   // <- GET uses params
//         );

//         setSubCategory(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setSubCategory([]);
//       }
//     }
//   };

//   fetchSubCategory();
// }, [UrlLink, GrnItemDetials]);


//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Inventory/Supplier_Data_Get?ForQuickGrn=${true}`, {
//         params: {
//           SupplierCode: GrnSupplierDetials.SupplierCode,
//           SupplierName: GrnSupplierDetials.SupplierName,
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
//   }, [
//     UrlLink,
//     GrnSupplierDetials.SupplierCode,
//     GrnSupplierDetials.SupplierName,
//   ]);

//   const formatLabel = (label) => {
//     if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
//       return label
//         .replace(/([a-z])([A-Z])/g, "$1 $2")
//         .replace(/^./, (str) => str.toUpperCase());
//     } else {
//       return label;
//     }
//   };

//   useEffect(() => {
//     const findsupdata = SupplierData.find(
//       (p) => p.id === GrnSupplierDetials.SupplierCode
//     );
//     if (findsupdata) {
//       axios
//         .get(`${UrlLink}Inventory/Supplier_product_Mapping_link`, {
//           params: {
//             SupplierId: findsupdata.id,
//             forquickgrn: true,
//             ItemCode: GrnItemDetials.ItemCode,
//             ItemName: GrnItemDetials.ItemName,
//           },
//         })
//         .then((res) => {
//           const resdata = res.data;
//           setSupplierProductListData(Array.isArray(resdata) ? resdata : []);
//         })
//         .catch((err) => {
//           console.log(err);
//           setSupplierProductListData([]);
//         });
//     } else {
//       setSupplierProductListData([]);
//     }
//   }, [
//     UrlLink,
//     SupplierData,
//     GrnSupplierDetials.SupplierCode,
//     GrnItemDetials.ItemCode,
//     GrnItemDetials.ItemName,
//   ]);

//   useEffect(() => {
//     const findsupdata = SupplierData.find(
//       (p) => p.id === GrnSupplierDetials.SupplierCode
//     );
//     if (findsupdata) {
//       axios
//         .get(`${UrlLink}Inventory/Supplier_product_Mapping_link`, {
//           params: {
//             SupplierId: findsupdata.id,
//             forquickgrn: true,
//           },
//         })
//         .then((res) => {
//           // const resdata = res.data.filter(
//           //   (f) => '' + f.ItemCode !== '' + GrnItemDetials.ItemCode
//           // );
//           const resdata = res.data;

//           setFocSupplierProductListData(Array.isArray(resdata) ? resdata : []);
//         })
//         .catch((err) => {
//           console.log(err);
//           setFocSupplierProductListData([]);
//         });
//     } else {
//       setFocSupplierProductListData([]);
//     }
//   }, [
//     SupplierData,
//     UrlLink,
//     GrnSupplierDetials.SupplierCode,
//     GrnItemDetials.ItemCode,
//   ]);

//   const fetchSupplierData = async (code) => {
//     try {
//       const response = await axios.get(
//         `${UrlLink}Inventory/Supplier_Data_Get?SupplierCode=${code}`
//       );
//       return response.data; // This assumes data is the correct field you want to return
//     } catch (error) {
//       console.error("Error fetching supplier data:", error);
//       // You can throw the error or return a default value
//       return {};
//     }
//   };

//   useEffect(() => {
//     if (Object.keys(GoodsReceiptNoteEdit).length) {
//       setGrnSupplierDetials({
//         // IsQuickGRN: GoodsReceiptNoteEdit?.IsQuickGRN,
//         IsOldGRN: GoodsReceiptNoteEdit?.IsOldGRN,
//         GRNDate: GoodsReceiptNoteEdit?.GrnDate,
//         SupplierCode: GoodsReceiptNoteEdit?.SupplierCode,
//         SupplierName: GoodsReceiptNoteEdit?.SupplierName,
//         ContactNumber: GoodsReceiptNoteEdit?.ContactNumber,
//         SupplierBillNumber: GoodsReceiptNoteEdit?.Supplier_Bill_Number,
//         SupplierBillDate: GoodsReceiptNoteEdit?.Supplier_Bill_Date,
//         SupplierBillDueDate: GoodsReceiptNoteEdit?.Supplier_Bill_Due_Date,
//         SupplierBillAmount: GoodsReceiptNoteEdit?.Supplier_Bill_Amount,
//         StoreLocation: GoodsReceiptNoteEdit?.Store_location_pk,
//         ReceivingPersonName: GoodsReceiptNoteEdit?.Received_person,
//         IsFOCAvailable: GoodsReceiptNoteEdit?.Is_Foc_Available,
//         FileAttachment: GoodsReceiptNoteEdit?.FileAttachment,
//         Status: GoodsReceiptNoteEdit?.Status,
//         pk: GoodsReceiptNoteEdit?.pk,
//         TotalTaxableAmount: GoodsReceiptNoteEdit?.Taxable_Amount,
//         TotalTaxAmount: GoodsReceiptNoteEdit?.Tax_Amount,
//         TotalAmount: GoodsReceiptNoteEdit?.Total_Amount,
//         TotalDiscountMethod: GoodsReceiptNoteEdit?.Total_Discount_Method,
//         TotalDiscountType: GoodsReceiptNoteEdit?.Total_Discount_Type,
//         TotalDiscount: GoodsReceiptNoteEdit?.Discount_Amount,
//         TPD: GoodsReceiptNoteEdit?.TPD,
//         FinalTotalTaxableAmount: GoodsReceiptNoteEdit?.Final_Taxable_Amount,
//         FinalTotalTaxAmount: GoodsReceiptNoteEdit?.Final_Tax_Amount,
//         FinalTotalAmount: GoodsReceiptNoteEdit?.Final_Total_Amount,
//         RoundOffAmount: GoodsReceiptNoteEdit?.Round_off_Amount,
//         NetAmount: GoodsReceiptNoteEdit?.Net_Amount,
//       });
//       if (GoodsReceiptNoteEdit?.GRN_Items) {
//         setGrnProductListDatas(GoodsReceiptNoteEdit?.GRN_Items);
//       }
//     }
//   }, [GoodsReceiptNoteEdit]);

//   const HandeleOnchange = (e) => {
//     const { name, value } = e.target;

//     if (name === "IsOldGRN") {
//       setGrnSupplierDetials((prev) => ({
//         ...prev,
//         [name]: value === "Yes",
//         GRNDate: "",
//         SupplierCode: "",
//         SupplierName: "",
//         ContactNumber: "",
//         SupplierBillNumber: "",
//         SupplierBillDate: "",
//         SupplierBillDueDate: "",
//         SupplierBillAmount: "",
//         StoreLocation: allowedStoreId || "",
//         ReceivingPersonName: userRecord?.username || "",
//         IsFOCAvailable: false,
//         FileAttachment: null,
//         Status: "Recieved",
//         pk: null,
//         TotalTaxableAmount: "",
//         TotalTaxAmount: "",
//         TotalAmount: "",
//         TotalDiscountMethod: "",
//         TotalDiscountType: "",
//         TotalDiscount: "",
//         TPD: "",
//         FinalTotalTaxableAmount: "",
//         FinalTotalTaxAmount: "",
//         FinalTotalAmount: "",
//         RoundOffAmount: "",
//         NetAmount: "",
//       }));
//       clearGrnItemsList();
//       setGrnProductListDatas([]);
//     } else if (name === "SupplierCode") {
//       setGrnSupplierDetials((prev) => ({
//         IsOldGRN: prev.IsOldGRN,
//         GRNDate: prev.GRNDate,
//         [name]: value,
//         SupplierName: "",
//         ContactNumber: "",
//         SupplierBillNumber: "",
//         SupplierBillDate: prev.SupplierBillDate,
//         SupplierBillDueDate: "",
//         SupplierBillAmount: "",
//         StoreLocation: allowedStoreId || "",
//         ReceivingPersonName: userRecord?.username || "",
//         IsFOCAvailable: false,
//         FileAttachment: null,
//         Status: "Recieved",
//         pk: null,
//         TotalTaxableAmount: "",
//         TotalTaxAmount: "",
//         TotalAmount: "",
//         TotalDiscountMethod: "",
//         TotalDiscountType: "",
//         TotalDiscount: "",
//         TPD: "",
//         FinalTotalTaxableAmount: "",
//         FinalTotalTaxAmount: "",
//         FinalTotalAmount: "",
//         RoundOffAmount: "",
//         NetAmount: "",
//       }));
//       clearGrnItemsList();
//       setGrnProductListDatas([]);
//     } else if (name === "SupplierName") {
//       setGrnSupplierDetials((prev) => ({
//         IsOldGRN: prev.IsOldGRN,
//         GRNDate: prev.GRNDate,
//         SupplierCode: "",
//         [name]: value,
//         ContactNumber: "",
//         SupplierBillNumber: "",
//         SupplierBillDate: prev.SupplierBillDate,
//         SupplierBillDueDate: "",
//         SupplierBillAmount: "",
//         StoreLocation: allowedStoreId || "",
//         ReceivingPersonName: userRecord?.username || "",
//         IsFOCAvailable: false,
//         FileAttachment: null,
//         Status: "Recieved",
//         pk: null,

//         TotalTaxableAmount: "",
//         TotalTaxAmount: "",
//         TotalAmount: "",
//         TotalDiscountMethod: "",
//         TotalDiscountType: "",
//         TotalDiscount: "",
//         TPD: "",
//         FinalTotalTaxableAmount: "",
//         FinalTotalTaxAmount: "",
//         FinalTotalAmount: "",
//         RoundOffAmount: "",
//         NetAmount: "",
//       }));
//       clearGrnItemsList();
//       setGrnProductListDatas([]);
//     } else if (name === "IsFOCAvailable") {
//       setGrnSupplierDetials((prev) => ({
//         ...prev,
//         [name]: value === "Yes",
//       }));
//     } else if (name === "TotalDiscountMethod") {
//       setGrnSupplierDetials((prev) => ({
//         ...prev,
//         [name]: value,
//         TotalDiscountType: "",
//         TotalDiscount: "",
//       }));
//     } else if (name === "TotalDiscountType") {
//       setGrnSupplierDetials((prev) => ({
//         ...prev,
//         [name]: value,
//         TotalDiscount: "",
//       }));
//     } else {
//       setGrnSupplierDetials((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };



//   const handlesearchsupplierlist = async (field) => {
//     let findsupdata;
//     if (field === "SupplierCode") {
//       findsupdata = SupplierData.find(
//         (p) => p.id === GrnSupplierDetials.SupplierCode
//       );
//     } else {
//       findsupdata = SupplierData.find(
//         (p) => p.SupplierName === GrnSupplierDetials.SupplierName
//       );
//     }
//     if (findsupdata) {
//       const data = await fetchSupplierData(findsupdata.id);
//       const initialDate = new Date(GrnSupplierDetials.SupplierBillDate);
//       const newDate = addDays(initialDate, 45);
//       const supplierbillduedate = format(newDate, "yyyy-MM-dd");
//       setGrnSupplierDetials((prev) => ({
//         IsOldGRN: prev.IsOldGRN,
//         GRNDate: prev.GRNDate,
//         SupplierCode: findsupdata?.id,
//         SupplierName: findsupdata?.SupplierName,
//         ContactNumber: data?.ContactNumber,
//         SupplierBillNumber: "",
//         SupplierBillDate: prev.SupplierBillDate,
//         SupplierBillDueDate: supplierbillduedate,
//         SupplierBillAmount: "",
//         StoreLocation: allowedStoreId || "",
//         ReceivingPersonName: userRecord?.username || "",
//         IsFOCAvailable: false,
//         FileAttachment: null,
//         Status: "Recieved",
//         pk: null,

//         TotalTaxableAmount: "",
//         TotalTaxAmount: "",
//         TotalAmount: "",
//         TotalDiscountMethod: "",
//         TotalDiscountType: "",
//         TotalDiscount: "",
//         FinalTotalTaxableAmount: "",
//         FinalTotalTaxAmount: "",
//         FinalTotalAmount: "",
//         RoundOffAmount: "",
//         NetAmount: "",
//       }));
//     } else {
//       setGrnSupplierDetials((prev) => ({
//         IsOldGRN: prev.IsOldGRN,
//         GRNDate: prev.GRNDate,
//         SupplierCode: "",
//         SupplierName: "",
//         ContactNumber: "",
//         SupplierBillNumber: "",
//         SupplierBillDate: prev.SupplierBillDate,
//         SupplierBillDueDate: "",
//         SupplierBillAmount: "",
//         StoreLocation: allowedStoreId || "",
//         ReceivingPersonName: userRecord?.username || "",
//         IsFOCAvailable: false,
//         FileAttachment: null,
//         Status: "Recieved",
//         pk: null,

//         TotalTaxableAmount: "",
//         TotalTaxAmount: "",
//         TotalAmount: "",
//         TotalDiscountMethod: "",
//         TotalDiscountType: "",
//         TotalDiscount: "",
//         FinalTotalTaxableAmount: "",
//         FinalTotalTaxAmount: "",
//         FinalTotalAmount: "",
//         RoundOffAmount: "",
//         NetAmount: "",
//       }));
//       setGrnProductListDatas([]);
//     }
//   };
//   const HandeleOnchangeItemDetials = (e) => {
//     const { name, value } = e.target;

//     if (
//       [
//         "IsOnlyFOCQty",
//         "IsMRPAsSellablePrice",
//         "IsManufactureDateAvailable",
//         "IsExpiryDateAvailable",
//       ].includes(name)
//     ) {
//       if (name === "IsOnlyFOCQty") {
//         if (value === "Yes") {
//           setGrnItemDetials((prev) => ({
//             ...prev,
//             [name]: value === "Yes",
//             PurchaseRateTaxable: "",
//             TaxPercentage: "",
//             PurchaseRateWithTax: "",
//             MRP: GrnItemDetials?.PreviousMRP,
//             TaxType: "",
//             ReceivedQty: "",
//           }));
//         } else {
//           setGrnItemDetials((prev) => ({
//             ...prev,
//             [name]: value === "Yes",
//             PurchaseRateTaxable: GrnItemDetials?.PreviousPurchaseRateBeforeGST,
//             TaxPercentage: GrnItemDetials?.PreviousGST,
//             PurchaseRateWithTax: GrnItemDetials?.PreviousPurchaseRateAfterGST,
//             MRP: GrnItemDetials?.PreviousMRP,
//             TaxType: "GST",
//             ReceivedQty: "",
//           }));
//         }
//       } else {
//         setGrnItemDetials((prev) => ({
//           ...prev,
//           [name]: value === "Yes",
//         }));
//       }
//     } else if (name === "ItemCode") {
//       setGrnItemDetials((prev) => ({
//         id: null,
//         pk: null,
//         [name]: value,
//         ItemName: "",
//         IsOnlyFOCQty: false,
//         PurchaseRateTaxable: "",
//         TaxPercentage: "Nill",
//         PurchaseRateWithTax: "",
//         MRP: "",
//         TaxType: "GST",
//         ReceivedQty: "",
//         FOCQuantity: "",
//         TotalReceivedQty: "",
//         TotalPackQuantity: "",
//         IsMRPAsSellablePrice: true,
//         SellablePrice: "",
//         SellableQtyPrice: "",
//         TotalPackTaxableAmount: "",
//         TotalTaxAmount: "",
//         TotalPackAmount: "",
//         BatchNo: "",
//         IsManufactureDateAvailable: false,
//         ManufactureDate: "",
//         IsExpiryDateAvailable: false,
//         ExpiryDate: "",
//         DiscountMethod: "",
//         DiscountType: "",
//         Discount: "",
//         FinalTotalPackTaxableAmount: "",
//         FinalTotalTaxAmount: "",
//         FinalTotalPackAmount: "",
//         Status: "Recieved",
//       }));
//     } else if (name === "ItemName") {
//       setGrnItemDetials((prev) => ({
//         id: null,
//         pk: null,
//         ItemCode: "",
//         [name]: value,
//         IsOnlyFOCQty: false,
//         PurchaseRateTaxable: "",
//         TaxPercentage: "Nill",
//         PurchaseRateWithTax: "",
//         MRP: "",
//         TaxType: "GST",
//         ReceivedQty: "",
//         FOCQuantity: "",
//         TotalReceivedQty: "",
//         TotalPackQuantity: "",
//         IsMRPAsSellablePrice: true,
//         SellablePrice: "",
//         SellableQtyPrice: "",
//         TotalPackTaxableAmount: "",
//         TotalTaxAmount: "",
//         TotalPackAmount: "",
//         BatchNo: "",
//         IsManufactureDateAvailable: false,
//         ManufactureDate: "",
//         IsExpiryDateAvailable: false,
//         ExpiryDate: "",
//         DiscountMethod: "",
//         DiscountType: "",
//         Discount: "",
//         FinalTotalPackTaxableAmount: "",
//         FinalTotalTaxAmount: "",
//         FinalTotalPackAmount: "",
//         Status: "Recieved",
//       }));
//     } else if (name === "MRP") {
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: value,
//         IsMRPAsSellablePrice: true,
//         SellablePrice: value,
//         SellableQtyPrice: "",
//       }));
//     } else if (name === "SellablePrice") {
//       if (parseFloat(value) <= parseFloat(GrnItemDetials.MRP)) {
//         setGrnItemDetials((prev) => ({
//           ...prev,
//           [name]: value,
//         }));
//       } else {
//         setGrnItemDetials((prev) => ({
//           ...prev,
//           [name]: GrnItemDetials.MRP,
//           IsMRPAsSellablePrice: true,
//           SellableQtyPrice: "",
//         }));
//         const tdata = {
//           message: `The selling Price must be less than or equal to MRP of ${GrnItemDetials.MRP}.`,
//           type: "warn",
//         };
//         dispatchvalue({ type: "toast", value: tdata });
//       }
//     } else if (name === "IsManufactureDateAvailable") {
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: value,
//         ManufactureDate: "",
//       }));
//     } else if (name === "IsExpiryDateAvailable") {
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: value,
//         ExpiryDate: "",
//       }));
//     } else if (name === "DiscountMethod") {
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: value,
//         DiscountType: "",
//         Discount: "",
//       }));
//     }
//     else if (name === "DiscountType") {
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: value,
//         Discount: "",
//       }));
//     }
//     else if (name === "PackType") {
//       const packname = ProductPackType.find(ele => ele.id === value);
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: packname?.PackTypeName || "",
//         PackType_pk: value
//       }));
//     }
//     else if (name === "SubCategory") {
//       const subcate = SubCategory.find(ele => ele.id === value);
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: subcate?.SubCategoryName || "",
//         SubCategory_pk: value
//       }));
//     }
//     else if (name === "GenericName") {
//       const generic = GenericNameData.find(ele => ele.id === value);
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: generic?.GenericName || "",
//         GenericName_pk: value
//       }));
//     }
//     else if (name === "ManufacturerName") {
//       const manufact = ManufactureData.find(ele => ele.id === value);
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: manufact?.CompanyName || "",
//         ManufacturerName_pk: value
//       }));
//     }

//     else {
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };
// const handlesearchitemslist = (type = "normal", fieldtype = "id") => {
//   if (type === "normal") {
//     if (GrnItemDetials.ItemCode || GrnItemDetials.ItemName) {
//       let findadata = SupplierProductListData.find(
//         (p) => "" + p.ItemCode === GrnItemDetials.ItemCode
//       );
//       if (fieldtype !== "id") {
//         findadata = SupplierProductListData.find(
//           (p) => "" + p.ItemName === GrnItemDetials.ItemName
//         );
//       }
//       if (findadata) {
//         const {
//           id,
//           SupplierPoductId,
//           ItemCode,
//           ItemName,
//           Status,
//           Is_Manufacture_Date_Available,
//           Is_Expiry_Date_Available,
//           ...rest
//         } = findadata;
        
//         setGrnItemDetials((prev) => ({
//           id: null,
//           pk: null,
          
//           // Basic Item Info
//           ItemCode: ItemCode,
//           ItemName: ItemName,
          
//           // Product Details from API
//           ProductCategory: rest?.ProductCategory || "",
//           ProductCategory_pk: rest?.ProductCategory_pk || "",
//           SubCategory: rest?.SubCategory || "",
//           SubCategory_pk: rest?.SubCategory_pk || "",
//           ManufacturerName: rest?.ManufacturerName || "",
//           ManufacturerName_pk: rest?.ManufacturerName_pk || "",
//           GenericName: rest?.GenericName || "",
//           GenericName_pk: rest?.GenericName_pk || "",
//           HSNCode: rest?.HSNCode || "",
//           PackType: rest?.PackType || "",
//           PackType_pk: rest?.PackType_pk || "",
//           PackQuantity: rest?.PackQuantity || "",
//           LeastSellableUnit: rest?.LeastSellableUnit || "",
          
//           // Pricing Information from API
//           PreviousMRP: rest?.PreviousMRP || "",
//           PreviousPurchaseRateBeforeGST: rest?.PreviousPurchaseRateBeforeGST || "",
//           PreviousGST: rest?.PreviousGST || "",
//           PreviousPurchaseRateAfterGST: rest?.PreviousPurchaseRateAfterGST || "",
          
//           // Current Entry Fields (initialize with API data or defaults)
//           IsOnlyFOCQty: false,
//           PurchaseRateTaxable: rest?.PreviousPurchaseRateBeforeGST || "",
//           TaxPercentage: rest?.PreviousGST || "Nill",
//           PurchaseRateWithTax: rest?.PreviousPurchaseRateAfterGST || "",
//           MRP: rest?.PreviousMRP || "",
//           TaxType: "GST",
//           ReceivedQty: "",
//           FOCQuantity: "",
//           TotalReceivedQty: "",
//           TotalPackQuantity: "",
//           IsMRPAsSellablePrice: true,
//           SellablePrice: rest?.PreviousMRP || "",
//           SellableQtyPrice: "",
//           TotalPackTaxableAmount: "",
//           TotalTaxAmount: "",
//           TotalPackAmount: "",
//           BatchNo: "",
//           IsManufactureDateAvailable: Is_Manufacture_Date_Available || false,
//           ManufactureDate: "",
//           IsExpiryDateAvailable: Is_Expiry_Date_Available || false,
//           ExpiryDate: "",
//           DiscountMethod: "",
//           DiscountType: "",
//           Discount: "",
//           FinalTotalPackTaxableAmount: "",
//           FinalTotalTaxAmount: "",
//           FinalTotalPackAmount: "",
//           Status: "Recieved",
//           Reason: '',
//         }));

//       } else {
//         const tdata = {
//           message: `Please enter valid Item Code or Item Name to search.`,
//           type: "warn",
//         };
//         dispatchvalue({ type: "toast", value: tdata });
//         // Clear only the product detail fields, keep search terms
//         setGrnItemDetials((prev) => ({
//           ...prev,
//           id: null,
//           pk: null,
//           // Keep the search terms but clear product details
//           ProductCategory: "",
//           ProductCategory_pk: "",
//           SubCategory: "",
//           SubCategory_pk: "",
//           ManufacturerName: "",
//           ManufacturerName_pk: "",
//           GenericName: "",
//           GenericName_pk: "",
//           HSNCode: "",
//           PackType: "",
//           PackType_pk: "",
//           PackQuantity: "",
//           LeastSellableUnit: "",
//           PreviousMRP: "",
//           PreviousPurchaseRateBeforeGST: "",
//           PreviousGST: "",
//           PreviousPurchaseRateAfterGST: "",
//           PurchaseRateTaxable: "",
//           TaxPercentage: "Nill",
//           PurchaseRateWithTax: "",
//           MRP: "",
//           SellablePrice: "",
//         }));
//       }
//     } else {
//       const tdata = {
//         message: `Please fill atleast any one of the Item Code or Item Name to search.`,
//         type: "warn",
//       };
//       dispatchvalue({ type: "toast", value: tdata });
//     }
//   }
// };
// // Helper function to clear item details
// const clearGrnItemDetails = () => {
//   setGrnItemDetials((prev) => ({
//     ...prev,
//     id: null,
//     pk: null,
//     ItemCode: "",
//     ItemName: "",
//     ProductCategory: "",
//     ProductCategory_pk: "",
//     SubCategory: "",
//     SubCategory_pk: "",
//     ManufacturerName: "",
//     ManufacturerName_pk: "",
//     GenericName: "",
//     GenericName_pk: "",
//     HSNCode: "",
//     PackType: "",
//     PackType_pk: "",
//     PackQuantity: "",
//     LeastSellableUnit: "",
//     PreviousMRP: "",
//     PreviousPurchaseRateBeforeGST: "",
//     PreviousGST: "",
//     PreviousPurchaseRateAfterGST: "",
//     IsOnlyFOCQty: false,
//     PurchaseRateTaxable: "",
//     TaxPercentage: "Nill",
//     PurchaseRateWithTax: "",
//     MRP: "",
//     TaxType: "GST",
//     ReceivedQty: "",
//     FOCQuantity: "",
//     TotalReceivedQty: "",
//     TotalPackQuantity: "",
//     IsMRPAsSellablePrice: true,
//     SellablePrice: "",
//     SellableQtyPrice: "",
//     TotalPackTaxableAmount: "",
//     TotalTaxAmount: "",
//     TotalPackAmount: "",
//     BatchNo: "",
//     IsManufactureDateAvailable: false,
//     ManufactureDate: "",
//     IsExpiryDateAvailable: false,
//     ExpiryDate: "",
//     DiscountMethod: "",
//     DiscountType: "",
//     Discount: "",
//     FinalTotalPackTaxableAmount: "",
//     FinalTotalTaxAmount: "",
//     FinalTotalPackAmount: "",
//     Status: "Recieved",
//     Reason: '',
//   }));
// };



// const fetchDependentData = async (productCategoryPk) => {
//   if (!productCategoryPk) return;

//   try {
//     // Fetch SubCategory
//     const subCategoryRes = await axios.get(
//       `${UrlLink}Masters/SubCategory_Master_link1`,
//       {
//         params: {
//           ProductCategory: productCategoryPk,
//           ItemCode: GrnItemDetials?.ItemCode,
//         },
//       }
//     );
//     setSubCategory(subCategoryRes.data);

//     // Fetch other dependent data in parallel
//     const baseParams = `ProductCategory=${productCategoryPk}`;
    
//     const [genericRes, manufacturerRes, packTypeRes] = await Promise.all([
//       axios.get(`${UrlLink}Masters/GenericName_by_Product_SubProduct?${baseParams}&ItemCode=${GrnItemDetials.ItemCode}`),
//       axios.get(`${UrlLink}Masters/CompanyName_by_Product_SubProduct?${baseParams}&ItemCode=${GrnItemDetials.ItemCode}`),
//       axios.get(`${UrlLink}Masters/PackType_by_Product_SubProduct?${baseParams}&ItemCode=${GrnItemDetials.ItemCode}`),
//     ]);

//     setGenericNameData(genericRes.data);
//     setManufactureData(manufacturerRes.data);
//     setProductPackType(packTypeRes.data);

//   } catch (error) {
//     console.error("Error fetching dependent data:", error);
//   }
// };
//   const calculatePreviousPurchaseRate = useCallback(() => {
//     const gst = parseFloat(GrnItemDetials.PreviousGST || "0");
//     const baseRate = parseFloat(GrnItemDetials.PreviousPurchaseRateBeforeGST || "0");

//     const gstAmount = (gst / 100) * baseRate;
//     const previousRateAfterGST = (baseRate + gstAmount).toFixed(2);

//     setGrnItemDetials(prev => ({
//       ...prev,
//       PreviousPurchaseRateAfterGST: previousRateAfterGST,
//     }));
//   }, [
//     GrnItemDetials.PreviousPurchaseRateBeforeGST,
//     GrnItemDetials.PreviousGST
//   ]);

//   useEffect(() => {
//     calculatePreviousPurchaseRate();
//   }, [calculatePreviousPurchaseRate]);


//   useEffect(() => {
//     let Filtered_with_out_dis_FinalTotalTaxableAmount = 0;
//     let Filtered_with_out_dis_FinalTotalTaxAmount = 0;
//     let Filtered_with_out_dis_FinalTotalAmount = 0;
//     let Filtered_with_dis_FinalTotalTaxableAmount = 0;
//     let Filtered_with_dis_FinalTotalTaxAmount = 0;
//     let Filtered_with_dis_FinalTotalAmount = 0;
//     let TotalTaxableAmount = 0;
//     let TotalTaxAmount = 0;
//     let TotalAmount = 0;

//     let FinalTotalTaxableAmount = 0;
//     let FinalTotalTaxAmount = 0;
//     let FinalTotalAmount = 0;
//     let RoundOffAmount = 0;
//     let NetAmount = 0;
//     if (GrnProductListDatas.length !== 0) {
//       GrnProductListDatas.forEach((item) => {
//         TotalTaxableAmount += +item?.TotalPackTaxableAmount;
//         TotalTaxAmount += +item?.TotalTaxAmount;
//         TotalAmount += +item?.TotalPackAmount;
//       });
//       GrnProductListDatas.filter((f) => f.DiscountMethod === "").forEach(
//         (item) => {
//           Filtered_with_out_dis_FinalTotalTaxableAmount +=
//             +item?.FinalTotalPackTaxableAmount;
//           Filtered_with_out_dis_FinalTotalTaxAmount +=
//             +item?.FinalTotalTaxAmount;
//           Filtered_with_out_dis_FinalTotalAmount += +item?.FinalTotalPackAmount;
//         }
//       );
//       GrnProductListDatas.filter((f) => f.DiscountMethod !== "").forEach(
//         (item) => {
//           Filtered_with_dis_FinalTotalTaxableAmount +=
//             +item?.FinalTotalPackTaxableAmount;
//           Filtered_with_dis_FinalTotalTaxAmount += +item?.FinalTotalTaxAmount;
//           Filtered_with_dis_FinalTotalAmount += +item?.FinalTotalPackAmount;
//         }
//       );
//     }

//     if (
//       Filtered_with_out_dis_FinalTotalTaxableAmount &&
//       Filtered_with_out_dis_FinalTotalTaxAmount &&
//       Filtered_with_out_dis_FinalTotalAmount &&
//       GrnSupplierDetials.TotalDiscountMethod &&
//       GrnSupplierDetials.TotalDiscountType &&
//       GrnSupplierDetials.TotalDiscount
//     ) {
//       if (GrnSupplierDetials.TotalDiscountMethod === "BeforeTax") {
//         const fixed_taxable_val = Filtered_with_out_dis_FinalTotalTaxableAmount;
//         const fixed_taxvale = Filtered_with_out_dis_FinalTotalTaxAmount;
//         if (GrnSupplierDetials.TotalDiscountType === "Percentage") {
//           Filtered_with_out_dis_FinalTotalTaxableAmount -=
//             Filtered_with_out_dis_FinalTotalTaxableAmount *
//             (+GrnSupplierDetials.TotalDiscount / 100);
//         } else {
//           Filtered_with_out_dis_FinalTotalTaxableAmount -=
//             +GrnSupplierDetials.TotalDiscount;
//         }
//         Filtered_with_out_dis_FinalTotalTaxAmount =
//           (Filtered_with_out_dis_FinalTotalTaxableAmount * +fixed_taxvale) /
//           fixed_taxable_val;
//         Filtered_with_out_dis_FinalTotalAmount =
//           Filtered_with_out_dis_FinalTotalTaxableAmount +
//           Filtered_with_out_dis_FinalTotalTaxAmount;
//       } else if (GrnSupplierDetials.TotalDiscountMethod === "AfterTax") {
//         if (GrnSupplierDetials.TotalDiscountType === "Percentage") {
//           Filtered_with_out_dis_FinalTotalAmount -=
//             Filtered_with_out_dis_FinalTotalAmount *
//             (+GrnSupplierDetials.TotalDiscount / 100);
//         } else {
//           Filtered_with_out_dis_FinalTotalAmount -=
//             +GrnSupplierDetials.TotalDiscount;
//         }
//       }
//     }
//     FinalTotalTaxableAmount =
//       Filtered_with_out_dis_FinalTotalTaxableAmount +
//       Filtered_with_dis_FinalTotalTaxableAmount;
//     FinalTotalTaxAmount =
//       Filtered_with_out_dis_FinalTotalTaxAmount +
//       Filtered_with_dis_FinalTotalTaxAmount;
//     FinalTotalAmount =
//       Filtered_with_out_dis_FinalTotalAmount +
//       Filtered_with_dis_FinalTotalAmount;

//     RoundOffAmount = Math.round(FinalTotalAmount) - FinalTotalAmount;
//     NetAmount = Math.round(FinalTotalAmount);

//     setGrnSupplierDetials((prev) => ({
//       ...prev,

//       TotalTaxableAmount: TotalTaxableAmount.toFixed(2),
//       TotalTaxAmount: TotalTaxAmount.toFixed(2),
//       TotalAmount: TotalAmount.toFixed(2),
//       FinalTotalTaxableAmount: FinalTotalTaxableAmount.toFixed(2),
//       FinalTotalTaxAmount: FinalTotalTaxAmount.toFixed(2),
//       FinalTotalAmount: FinalTotalAmount.toFixed(2),
//       RoundOffAmount: RoundOffAmount.toFixed(2),
//       NetAmount: NetAmount.toFixed(2),
//     }));
//   }, [
//     GrnProductListDatas,
//     GrnSupplierDetials.TotalDiscountMethod,
//     GrnSupplierDetials.TotalDiscountType,
//     GrnSupplierDetials.TotalDiscount,
//   ]);

//   useEffect(() => {
//     let purchaserate = parseFloat(GrnItemDetials.PurchaseRateTaxable, 0) || 0;
//     let totalAmount;
//     if (GrnItemDetials.TaxPercentage !== "") {
//       if (GrnItemDetials.TaxPercentage === "Nill") {
//         totalAmount = purchaserate;
//       } else {
//         let GSTValue = +GrnItemDetials.TaxPercentage;
//         totalAmount = purchaserate + (purchaserate * GSTValue) / 100;
//       }
//     }

//     let recieved_qty = parseInt(GrnItemDetials.ReceivedQty || 0, 0);
//     let total_recieved_qty =
//       recieved_qty + parseInt(GrnItemDetials.FOCQuantity || 0, 0);

//     if (GrnItemDetials.TaxPercentage !== "" && GrnItemDetials.MRP !== "") {
//       if (parseFloat(GrnItemDetials.MRP) >= totalAmount) {
//         const discount_amount = parseFloat(GrnItemDetials.Discount) || 0;
//         let mrp_for_leastsellablequantity = 0;
//         let total_rate_taxable = purchaserate * recieved_qty;
//         let total_gst =
//           GrnItemDetials.TaxPercentage === "Nill"
//             ? 0
//             : (total_rate_taxable * parseInt(GrnItemDetials.TaxPercentage)) /
//             100;
//         let total_rate_with_gst = total_rate_taxable + total_gst;
//         let grant_total_rate_taxable = 0;
//         let grant_gst = 0;
//         let grant_total_rate_with_gst = 0;

//         if (GrnItemDetials?.PackQuantity && GrnItemDetials?.LeastSellableUnit) {
//           if (parseInt(GrnItemDetials?.PackQuantity || 1) === 1) {
//             mrp_for_leastsellablequantity = parseFloat(
//               GrnItemDetials.SellablePrice
//             );
//           } else {
//             if (parseInt(GrnItemDetials?.LeastSellableUnit || 1) === 1) {
//               mrp_for_leastsellablequantity =
//                 parseFloat(GrnItemDetials.SellablePrice) /
//                 parseInt(GrnItemDetials?.PackQuantity || 1);
//             } else if (GrnItemDetials.LeastSellableUnit === "Not Sellable") {
//               mrp_for_leastsellablequantity =
//                 parseFloat(GrnItemDetials.SellablePrice) /
//                 parseInt(GrnItemDetials?.PackQuantity || 1);
//             } else {
//               mrp_for_leastsellablequantity = parseFloat(
//                 GrnItemDetials.SellablePrice
//               );
//             }
//           }
//         }

//         if (GrnItemDetials?.DiscountMethod === "BeforeTax") {
//           if (GrnItemDetials.DiscountType === "Percentage") {
//             grant_total_rate_taxable =
//               total_rate_taxable - total_rate_taxable * (discount_amount / 100);
//           } else {
//             grant_total_rate_taxable = total_rate_taxable - discount_amount;
//           }
//           grant_gst =
//             GrnItemDetials.TaxPercentage === "Nill"
//               ? 0
//               : (grant_total_rate_taxable *
//                 parseInt(GrnItemDetials.TaxPercentage)) /
//               100;
//           grant_total_rate_with_gst = grant_total_rate_taxable + grant_gst;
//         } else if (GrnItemDetials?.DiscountMethod === "AfterTax") {
//           if (GrnItemDetials.DiscountType === "Percentage") {
//             grant_total_rate_with_gst =
//               total_rate_with_gst -
//               total_rate_with_gst * (discount_amount / 100);
//           } else {
//             grant_total_rate_with_gst = total_rate_with_gst - discount_amount;
//           }
//           grant_total_rate_taxable = total_rate_taxable;
//           grant_gst =
//             GrnItemDetials.TaxPercentage === "Nill"
//               ? 0
//               : (grant_total_rate_taxable *
//                 parseInt(GrnItemDetials.TaxPercentage)) /
//               100;
//         } else {
//           grant_total_rate_taxable = total_rate_taxable;
//           grant_gst = total_gst;
//           grant_total_rate_with_gst = total_rate_taxable + total_gst;
//         }

//         setGrnItemDetials((prev) => ({
//           ...prev,
//           PurchaseRateWithTax: totalAmount.toFixed(3),
//           TotalReceivedQty: total_recieved_qty,
//           TotalPackQuantity: GrnItemDetials?.PackQuantity * total_recieved_qty,
//           SellableQtyPrice: mrp_for_leastsellablequantity.toFixed(3),
//           TotalPackTaxableAmount: total_rate_taxable.toFixed(3),
//           TotalTaxAmount: total_gst.toFixed(3),
//           TotalPackAmount: total_rate_with_gst.toFixed(3),
//           FinalTotalPackTaxableAmount: grant_total_rate_taxable.toFixed(3),
//           FinalTotalTaxAmount: grant_gst.toFixed(3),
//           FinalTotalPackAmount: grant_total_rate_with_gst.toFixed(3),
//         }));
//       } else {
//         const tdata = {
//           message: `The purchase rate after GST must be smaller than the MRP ${GrnItemDetials.MRP}.`,
//           type: "warn",
//         };
//         dispatchvalue({ type: "toast", value: tdata });
//         setGrnItemDetials((prev) => ({
//           ...prev,
//           PurchaseRateTaxable: "",
//           PurchaseRateWithTax: "",
//         }));
//       }
//     } else {
//       setGrnItemDetials((prev) => ({
//         ...prev,
//         PurchaseRateTaxable: "",
//         PurchaseRateWithTax: "",
//         TotalReceivedQty: total_recieved_qty,
//         TotalPackQuantity: GrnItemDetials?.PackQuantity * total_recieved_qty,
//       }));
//     }
//   }, [
//     GrnItemDetials.TaxPercentage,
//     GrnItemDetials.PurchaseRateTaxable,
//     GrnItemDetials.MRP,
//     GrnItemDetials.SellablePrice,
//     GrnItemDetials.ReceivedQty,
//     GrnItemDetials.FOCQuantity,
//     GrnItemDetials?.PackQuantity,
//     GrnItemDetials?.LeastSellableUnit,
//     GrnItemDetials.DiscountMethod,
//     GrnItemDetials.DiscountType,
//     GrnItemDetials.Discount,
//     dispatchvalue,
//   ]);

//   useEffect(() => {
//     let fdata = Object.keys(GrnItemDetials).filter((f) =>
//       [
//         "ItemCode",
//         "ItemName",
//         "ProductCategory",
//         "ProductCategory_pk",
//         "SubCategory",
//         "SubCategory_pk",
//         "ManufacturerName",
//         "ManufacturerName_pk",
//         "GenericName",
//         "GenericName_pk",
//         "PackType",
//         "PackType_pk",
//         "PackQuantity",
//         "PreviousMRP",
//         "PreviousPurchaseRateBeforeGST",
//         "PreviousGST",
//         "PreviousPurchaseRateAfterGST",
//         "LeastSellableUnit",
//       ].includes(f)
//     );
//     setProductListFormOne(fdata);

//     let fdata2 = Object.keys(GrnItemDetials).filter(
//       (f) =>
//         ![
//           "ItemCode",
//           "ItemName",
//           "ProductCategory_pk",
//           "ProductCategory",
//           "SubCategory",
//           "SubCategory_pk",
//           "ManufacturerName",
//           "ManufacturerName_pk",
//           "GenericName",
//           "GenericName_pk",
//           "PackType",
//           "PackType_pk",
//           "PackQuantity",
//           "PreviousMRP",
//           "PreviousPurchaseRateBeforeGST",
//           "PreviousGST",
//           "PreviousPurchaseRateAfterGST",
//           "LeastSellableUnit",
//           "id",
//           "pk",
//           "Status",
//         ].includes(f)
//     );

//     if (!GrnSupplierDetials.IsFOCAvailable) {
//       fdata2 = fdata2.filter(
//         (f) => !["IsOnlyFOCQty", "FOCQuantity"].includes(f)
//       );
//     }
//     if (!GrnItemDetials.IsManufactureDateAvailable) {
//       fdata2 = fdata2.filter((f) => !["ManufactureDate"].includes(f));
//     }
//     if (!GrnItemDetials.IsExpiryDateAvailable) {
//       fdata2 = fdata2.filter((f) => !["ExpiryDate"].includes(f));
//     }
//     if (GrnItemDetials?.LeastSellableUnit === "Not Sellable") {
//       fdata2 = fdata2.filter(
//         (f) =>
//           ![
//             "IsMRPAsSellablePrice",
//             "SellablePrice",
//             "SellableQtyPrice",
//           ].includes(f)
//       );
//     }

//     if (GrnItemDetials.IsOnlyFOCQty) {
//       fdata2 = fdata2.filter(
//         (f) =>
//           ![
//             "PurchaseRateTaxable",
//             "TaxPercentage",
//             "PurchaseRateWithTax",
//             "MRP",
//             "TaxType",
//             "ReceivedQty",
//             "IsMRPAsSellablePrice",
//             "TotalPackTaxableAmount",
//             "TotalTaxAmount",
//             "TotalPackAmount",
//             "DiscountMethod",
//             "DiscountType",
//             "Discount",
//             "FinalTotalPackTaxableAmount",
//             "FinalTotalTaxAmount",
//             "FinalTotalPackAmount",
//           ].includes(f)
//       );
//     }

//     setProductListFormTwo(fdata2);
//   }, [GrnItemDetials, GrnSupplierDetials.IsFOCAvailable]);

//   const handlefileOnchange = (e) => {
//     const { files } = e.target;

//     if (files && files.length > 0) {
//       let formattedValue = files[0];

//       const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//       const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
//       if (
//         !allowedTypes.includes(formattedValue.type) ||
//         formattedValue.type === ""
//       ) {
//         const tdata = {
//           message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
//           type: "warn",
//         };
//         dispatchvalue({ type: "toast", value: tdata });
//       } else {
//         if (formattedValue.size > maxSize) {
//           const tdata = {
//             message: "File size exceeds the limit of 5MB.",
//             type: "warn",
//           };
//           dispatchvalue({ type: "toast", value: tdata });
//         } else {
//           const reader = new FileReader();
//           reader.onload = () => {
//             setGrnSupplierDetials((prev) => ({
//               ...prev,
//               FileAttachment: reader.result,
//             }));
//           };
//           reader.readAsDataURL(formattedValue);
//         }
//       }
//     } else {
//       const tdata = {
//         message: "No file selected. Please choose a file to upload.",
//         type: "warn",
//       };
//       dispatchvalue({ type: "toast", value: tdata });
//     }
//   };

//   const Selectedfileview = (fileval) => {
//     if (fileval) {
//       let tdata = {
//         Isopen: false,
//         content: null,
//         type: "image/jpg",
//       };
//       if (
//         ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
//           fileval?.split(",")[0]
//         )
//       ) {
//         tdata = {
//           Isopen: true,
//           content: fileval,
//           type: "image/jpeg",
//         };
//       } else if (fileval?.split(",")[0] === "data:image/png;base64") {
//         tdata = {
//           Isopen: true,
//           content: fileval,
//           type: "image/png",
//         };
//       } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
//         tdata = {
//           Isopen: true,
//           content: fileval,
//           type: "application/pdf",
//         };
//       }

//       dispatchvalue({ type: "modelcon", value: tdata });
//     } else {
//       const tdata = {
//         message: "There is no file to view.",
//         type: "warn",
//       };
//       dispatchvalue({ type: "toast", value: tdata });
//     }
//   };

//   const handelEditGrnProductList = async (params) => {
//     try {
//       const findsupdata = SupplierData.find(
//         (p) => p.id === GrnSupplierDetials.SupplierCode
//       );

//       const findadata = await axios.get(
//         `${UrlLink}Inventory/Supplier_product_Mapping_link`,
//         {
//           params: {
//             SupplierId: findsupdata.id,
//             forquickgrn: true,
//             ItemCode: params.ItemCode,
//             ItemName: params.ItemName,
//           },
//         }
//       );
//       const summadata = findadata.data[0];
//       const {
//         id,
//         SupplierPoductId,
//         ItemCode,
//         ItemName,
//         Status,
//         Is_Manufacture_Date_Available,
//         Is_Expiry_Date_Available,
//         ...rest
//       } = summadata;
//       setGrnItemDetials({
//         id: params.id,
//         ItemCode: ItemCode,
//         ItemName: ItemName,
//         ...rest,
//         IsOnlyFOCQty: params?.IsFOCProduct,
//         PurchaseRateTaxable: params?.PurchaseRateTaxable,
//         TaxPercentage: params?.TaxPercentage,
//         PurchaseRateWithTax: params?.PurchaseRateWithTax,
//         MRP: params?.MRP,
//         TaxType: params?.TaxType,
//         ReceivedQty: params?.ReceivedQty,
//         FOCQuantity: params?.FOCQuantity,
//         TotalReceivedQty: params?.TotalReceivedQty,
//         TotalPackQuantity: params?.TotalPackQuantity,
//         IsMRPAsSellablePrice: params?.IsMRPAsSellablePrice,
//         SellablePrice: params?.SellablePrice,
//         SellableQtyPrice: params?.SellableQtyPrice,
//         TotalPackTaxableAmount: params?.TotalPackTaxableAmount,
//         TotalTaxAmount: params?.TotalTaxAmount,
//         TotalPackAmount: params?.TotalPackAmount,
//         BatchNo: params?.BatchNo,
//         IsManufactureDateAvailable: Is_Manufacture_Date_Available,
//         ManufactureDate: params?.ManufactureDate,
//         IsExpiryDateAvailable: Is_Expiry_Date_Available,
//         ExpiryDate: params?.ExpiryDate,
//         DiscountMethod: params?.DiscountMethod,
//         DiscountType: params?.DiscountType,
//         Discount: params?.Discount,
//         FinalTotalPackTaxableAmount: params?.FinalTotalPackTaxableAmount,
//         FinalTotalTaxAmount: params?.FinalTotalTaxAmount,
//         FinalTotalPackAmount: params?.FinalTotalPackAmount,
//         Status: "Recieved",
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handelDeleteGrnProductList = (params) => {
//     setGrnProductListDatas((prev) => prev.filter((p) => p.id !== params.id));
//   };

//   const GrnProductColumns = [
//     ...[
//       "id",
//       "Action",
//       "Reason",
//       // "ItemCode",
//       "ItemName",
//       "IsOnlyFOCQty",
//       "PurchaseRateTaxable",
//       "TaxPercentage",
//       "PurchaseRateWithTax",
//       "MRP",
//       "TaxType",
//       "ReceivedQty",
//       "FOCQuantity",
//       "TotalReceivedQty",
//       "TotalPackQuantity",
//       "SellableQtyPrice",
//       "TotalPackTaxableAmount",
//       "TotalTaxAmount",
//       "TotalPackAmount",
//       "BatchNo",
//       // "ManufactureDate",
//       "ExpiryDate",
//       "DiscountMethod",
//       "DiscountType",
//       "Discount",
//       "FinalTotalPackTaxableAmount",
//       "FinalTotalTaxAmount",
//       "FinalTotalPackAmount",
//     ].map((field) => ({
//       key: field,
//       name:
//         field === "id"
//           ? "S.No"
//           : field === "IsOnlyFOCQty"
//             ? "Is Only FOC Qty"
//             : field === "FOCQuantity"
//               ? "FOC Quantity"
//               : formatLabel(field),
//       width:
//         [
//           "PurchaseRateTaxable",
//           "TaxPercentage",
//           "PurchaseRateWithTax",
//           "TotalPackTaxableAmount",
//           "FinalTotalPackTaxableAmount",
//           "FinalTotalTaxAmount",
//           "FinalTotalPackAmount",
//           "Action",
//         ].includes(field) && 200,
//       renderCell: (params) =>
//         field === "Action" ? (
//           <>
//             <Button
//               className="cell_btn"
//               onClick={() => handelEditGrnProductList(params.row)}
//             >
//               <EditIcon className="check_box_clrr_cancell" />
//             </Button>

//             <Button
//               className="cell_btn"
//               onClick={() => handelDeleteGrnProductList(params.row)}
//             >
//               <DeleteIcon className="check_box_clrr_cancell" />
//             </Button>
//           </>
//         ) : field === "IsOnlyFOCQty" ? (
//           params.row[field] ? (
//             "Yes"
//           ) : (
//             "No"
//           )
//         ) : params.row[field] ? (
//           params.row[field]
//         ) : (
//           "-"
//         ),
//     })),
//   ];

//   const handleAddGrnProductList = () => {
//     let requiredFields = Object.keys(GrnItemDetials).filter(
//       (p) =>
//         ![
//           "id",
//           "pk",
//           "FOCQuantity",
//           "ProductCategory",
//           "SubCategory",
//           "CompanyName",
//           "GenericName",
//           "PackType",
//           "PackQuantity",
//           "PreviousMRP",
//           "PreviousPurchaseRateBeforeGST",
//           "PreviousGST",
//           "PreviousPurchaseRateAfterGST",
//           "LeastSellableUnit",
//           "IsOnlyFOCQty",
//           "DiscountMethod",
//           "IsManufactureDateAvailable",
//           "IsExpiryDateAvailable",
//           "PackType_pk",
//           "HSNCode",
//           "SubCategory_pk",
//           "ManufacturerName_pk",
//           "GenericName_pk"
//         ].includes(p)
//     );
//     if (!GrnItemDetials.IsManufactureDateAvailable) {
//       requiredFields = requiredFields.filter((f) => f !== "ManufactureDate");
//     }
//     if (!GrnItemDetials.IsExpiryDateAvailable) {
//       requiredFields = requiredFields.filter((f) => f !== "ExpiryDate");
//     }
//     if (GrnItemDetials.IsOnlyFOCQty) {
//       requiredFields = requiredFields.filter(
//         (f) =>
//           ![
//             "PurchaseRateTaxable",
//             "TaxPercentage",
//             "PurchaseRateWithTax",
//             "TaxType",
//             "ReceivedQty",
//           ].includes(f)
//       );
//     }
//     if (GrnItemDetials.TaxPercentage === "Nill") {
//       requiredFields = requiredFields.filter(
//         (f) => !["TotalTaxAmount", "FinalTotalTaxAmount"].includes(f)
//       );
//     }
//     if (!GrnItemDetials.DiscountMethod) {
//       requiredFields = requiredFields.filter(
//         (f) => !["Discount", "DiscountType"].includes(f)
//       );
//     }
//     const missingFields = requiredFields.filter((f) => !GrnItemDetials[f]);
//     if (missingFields.length !== 0) {
//       const tdata = {
//         message: `Please fill out all required fields: ${missingFields.join(
//           ", "
//         )}`,
//         type: "warn",
//       };
//       dispatchvalue({ type: "toast", value: tdata });
//     } else {
//       const CheckDublicate = GrnProductListDatas.some(
//         (ele) =>
//           ele.ItemCode === GrnItemDetials.ItemCode &&
//           ele.BatchNo === GrnItemDetials.BatchNo &&
//           +ele.id !== +GrnItemDetials.id
//       );
//       if (CheckDublicate) {
//         dispatchvalue({
//           type: "toast",
//           value: {
//             message: `This item with the same batch number has already been entered.`,
//             type: "warn",
//           },
//         });
//       } else {
//         if (GrnItemDetials.id) {
//           setGrnProductListDatas((prev) =>
//             prev.map((product) =>
//               +product.id === +GrnItemDetials.id
//                 ? { ...GrnItemDetials }
//                 : product
//             )
//           );
//           clearGrnItemsList();
//         } else {
//           setGrnProductListDatas((prev) => [
//             ...prev,
//             {
//               ...GrnItemDetials,
//               id: prev.length + 1,
//             },
//           ]);

//           clearGrnItemsList();
//         }
//         setGrnSupplierDetials((prev) => ({
//           ...prev,
//           TotalDiscountMethod: "",
//           TotalDiscountType: "",
//           TotalDiscount: "",
//         }));
//       }
//     }
//   };

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
//           console.log("ress", ress);
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

//   const handlesaveQuickGrn = () => {
//     console.log(
//       '3242342343534534534534'
//     );
//     let requiredFields = Object.keys(GrnSupplierDetials).filter(
//       (f) =>
//         ![
//           "IsOldGRN",
//           "IsFOCAvailable",
//           "pk",
//           "TotalDiscountMethod",
//           "FileAttachment",
//           "ContactNumber",
//           "SupplierBillDueDate",
//           "ReceivingPersonName",
//           "ReceivingPersonName"
//         ].includes(f)
//     );

//     console.log('requiredFields', requiredFields);
//     if (!GrnSupplierDetials.TotalDiscountMethod) {
//       requiredFields = requiredFields.filter(
//         (f) => !["TotalDiscountType", "TotalDiscount"].includes(f)
//       );
//     }
//     const missingFields = requiredFields.filter((f) => !GrnSupplierDetials[f]);
//     if (missingFields.length === 0) {
//       if (
//         +GrnSupplierDetials.SupplierBillAmount === +GrnSupplierDetials.NetAmount
//       ) {
//         const senddata = {
//           IsQuickGRN: true,
//           ...GrnSupplierDetials,
//           Created_by: userRecord?.username,
//           GrnItemList: GrnProductListDatas,
//           IS_Quick_GRN_Approve: pageAccess.IS_Quick_GRN_Approve,
//         };
//         console.log("senddata---", senddata);

//         axios
//           .post(`${UrlLink}Inventory/Goods_Reciept_Note_Details_link`, senddata)
//           .then((res) => {
//             console.log(res);
//             let data = res.data;

//             let type = Object.keys(data)[0];
//             let mess = Object.values(data)[0];
//             const tdata = {
//               message: mess,
//               type: type,
//             };
//             dispatchvalue({ type: "toast", value: tdata });
//             navigate("/Home/GoodsReceiptNoteList");
//           })
//           .catch((err) => {
//             console.error(err);
//           });
//       } else {
//         const tdata = {
//           message: ` Supplier Bill Amount doesnot match with the Net Amount ,cross check the product detials and verify it properly.`,
//           type: "warn",
//         };
//         dispatchvalue({ type: "toast", value: tdata });
//       }
//     } else {
//       const tdata = {
//         message: `Please fill out all required fields: ${missingFields.join(
//           ", "
//         )}`,
//         type: "warn",
//       };
//       dispatchvalue({ type: "toast", value: tdata });
//     }
//   };


//   const ChangeMasterdata = () => {
//     if (GrnItemDetials.ItemCode === '') {
//       const tdata = {
//         message: 'ItemName is mandatory',
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     }
//     else {
//       const mysenddata = {
//         SupplierCode: GrnSupplierDetials?.SupplierCode,
//         ItemCode: GrnItemDetials?.ItemCode,
//         Created_by: userRecord?.username,
//         ProductCategory_pk: GrnItemDetials?.ProductCategory_pk,
//         SubCategory_pk: GrnItemDetials?.SubCategory_pk,
//         ManufacturerName_pk: GrnItemDetials?.ManufacturerName_pk,
//         GenericName_pk: GrnItemDetials?.GenericName_pk,
//         PackType_pk: GrnItemDetials?.PackType_pk,
//         PreviousGST: GrnItemDetials?.PreviousGST,
//         PreviousPurchaseRateBeforeGST: GrnItemDetials?.PreviousPurchaseRateBeforeGST,
//         PackQuantity: GrnItemDetials?.PackQuantity,
//         PreviousMRP: GrnItemDetials?.PreviousMRP,
//         PreviousPurchaseRateAfterGST: GrnItemDetials?.PreviousPurchaseRateAfterGST
//       }
//       const senddata = Object.entries(mysenddata).reduce((acc, [key, value]) => {
//         const fieldsToConvert = [
//           'SubCategory_pk',
//           'ProductCategory_pk',
//           'ManufacturerName_pk',
//           'ItemCode',
//           'ManufacturerName',
//           'GenericName_pk',
//           'PackType_pk',
//           'PreviousGST',
//           'PreviousPurchaseRateBeforeGST',
//           'PackQuantity',
//           'PreviousMRP',
//           'PreviousPurchaseRateAfterGST'
//         ]

//         if (fieldsToConvert.includes(key)) {
//           acc[key] = value ? parseInt(value) : null
//         } else {
//           acc[key] = value
//         }

//         return acc
//       }, {})
//       console.log('send data----', senddata);

//       axios.post(`${UrlLink}Inventory/UpdateMasterDataQuickGrn`, senddata)
//         .then((res) => {
//           console.log('11', res.data);
//           let resdata = res.data;
//           let type = Object.keys(resdata)[0];
//           console.log('type----', type)
//           let mess = Object.values(resdata)[0];
//           console.log('mess', mess)
//           const tdata = {
//             message: mess,
//             type: type,

//           };

//           dispatchvalue({ type: 'toast', value: tdata });

//           if (type === "success") {
//             setGrnItemDetials((prev) => ({
//               ...prev,
//               PurchaseRateWithTax: prev.PreviousPurchaseRateAfterGST,
//               MRP: prev.PreviousMRP,
//               SellablePrice: prev.PreviousMRP,
//               SellableQtyPrice: prev.SellableQtyPrice,
//               PurchaseRateTaxable: prev.PreviousPurchaseRateBeforeGST,
//               TaxPercentage: prev.PreviousGST
//             }));

//           }

//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     }
//   };
//   const allowedCategoryIds = userRecord.ProductCategory_list.map(item =>
//     Number(item.ProductCategoryAccessId)
//   );
//   console.log('allowedCategoryIds', allowedCategoryIds);

//   const filterDataProduct = SupplierProductListData.filter(item =>
//     allowedCategoryIds.includes(Number(item.ProductCategory_pk))
//   );
//   console.log('filterDataProduct', filterDataProduct)

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Quick Goods Receipt Note</h3>
//         <br />
//         <div className="RegisFormcon_1">
//           {Object.keys(GrnSupplierDetials)
//             .filter(
//               (p) =>
//                 ![
//                   "Status",
//                   "pk",
//                   "TotalTaxableAmount",
//                   "TotalTaxAmount",
//                   "TotalAmount",
//                   "TotalDiscountMethod",
//                   "TotalDiscountType",
//                   "TotalDiscount",
//                   "FinalTotalTaxableAmount",
//                   "FinalTotalTaxAmount",
//                   "FinalTotalAmount",
//                   "RoundOffAmount",
//                   "NetAmount",
//                 ].includes(p)
//             )
//             .map((field, Index) => {
//               return (
//                 <div className="RegisForm_1" key={Index + "key"}>
//                   <label htmlFor={field}>
//                     {field === "GRNDate"
//                       ? "GRN Date"
//                       : field === "IsFOCAvailable"
//                         ? "Is FOC Available"
//                         : formatLabel(field)}
//                     <span>:</span>
//                   </label>

//                   {field === "StoreLocation" ? (
//                     <select
//                       id={field}
//                       name={field}
//                       value={GrnSupplierDetials[field]}
//                       onChange={HandeleOnchange}
//                       autoComplete="off"
//                     >
//                       <option value="">Select</option>
//                       {field === "StoreLocation" &&
//                         StoreLocationData.map((ele, ind) => (
//                           <option key={ind + "key"} value={ele.id}>
//                             {ele.StoreName}
//                           </option>
//                         ))}
//                     </select>
//                   ) : field === "IsOldGRN" || field === "IsFOCAvailable" ? (
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "flex-start",
//                         gap: "10px",
//                         width: "150px",
//                       }}
//                     >
//                       <label style={{ width: "auto" }} htmlFor={`${field}_yes`}>
//                         <input
//                           required
//                           id={`${field}_yes`}
//                           type="radio"
//                           name={field}
//                           value="Yes"
//                           style={{ width: "15px" }}
//                           checked={GrnSupplierDetials[field]}
//                           onChange={HandeleOnchange}
//                           autoComplete="off"
//                         />
//                         Yes
//                       </label>
//                       <label style={{ width: "auto" }} htmlFor={`${field}_No`}>
//                         <input
//                           required
//                           id={`${field}_No`}
//                           type="radio"
//                           name={field}
//                           value="No"
//                           style={{ width: "15px" }}
//                           checked={!GrnSupplierDetials[field]}
//                           onChange={HandeleOnchange}
//                           autoComplete="off"
//                         />
//                         No
//                       </label>
//                     </div>
//                   ) : field === "FileAttachment" ? (
//                     <>
//                       <input
//                         type="file"
//                         name={field}
//                         accept="image/jpeg,image/png,application/pdf"
//                         required
//                         id={`${field}_Grn`}
//                         autoComplete="off"
//                         onChange={handlefileOnchange}
//                         style={{ display: "none" }}
//                       />
//                       <div
//                         style={{
//                           width: "150px",
//                           display: "flex",
//                           justifyContent: "space-around",
//                         }}
//                       >
//                         <label
//                           htmlFor={`${field}_Grn`}
//                           className="RegisterForm_1_btns choose_file_update"
//                         >
//                           <PhotoCameraBackIcon />
//                         </label>
//                         <button
//                           className="fileviewbtn"
//                           onClick={() =>
//                             Selectedfileview(GrnSupplierDetials.FileAttachment)
//                           }
//                         >
//                           view
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="Search_patient_icons">
//                         <input
//                           type={
//                             [
//                               "GRNDate",
//                               "SupplierBillDate",
//                               "SupplierBillDueDate",
//                             ].includes(field)
//                               ? "date"
//                               : "text"
//                           }
//                           id={field}
//                           list={
//                             ["SupplierCode", "SupplierName"].includes(field)
//                               ? field + "grn_supplier_list"
//                               : null
//                           }
//                           name={field}
//                           autoComplete='off'
//                           value={GrnSupplierDetials[field]}
//                           onChange={HandeleOnchange}
//                           min={
//                             field === "SupplierBillDueDate"
//                               ? GrnSupplierDetials.SupplierBillDate
//                               : ""
//                           }
//                           max={
//                             ["SupplierBillDate", "GRNDate"].includes(field)
//                               ? currentDate
//                               : ""
//                           }
//                           disabled={[
//                             "SupplierBillDueDate",
//                             "GRNDate",
//                             "ContactNumber",
//                           ]
//                             .filter((f) =>
//                               GrnSupplierDetials.IsOldGRN
//                                 ? !["GRNDate", "SupplierBillDueDate"].includes(
//                                   f
//                                 )
//                                 : f
//                             )
//                             .includes(field)}
//                         />
//                         {["SupplierCode", "SupplierName"].includes(field) && (
//                           <>
//                             <datalist id={field + "grn_supplier_list"}>
//                               {field === "SupplierCode" &&
//                                 SupplierData.map((ele, ind) => (
//                                   <option
//                                     key={ind + "key"}
//                                     value={ele.id}
//                                   >{`${ele.SupplierName} | ${ele.ContactNo}`}</option>
//                                 ))}
//                               {field === "SupplierName" &&
//                                 SupplierData.map((ele, ind) => (
//                                   <option
//                                     key={ind + "key"}
//                                     value={ele.SupplierName}
//                                   >{`${ele.id} | ${ele.ContactNo}`}</option>
//                                 ))}
//                             </datalist>
//                             <span
//                               onClick={(e) => handlesearchsupplierlist(field)}
//                             >
//                               <ManageSearchIcon />
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               );
//             })}
//         </div>
// <br />
// <div className="common_center_tag">
//   <span>Product Details</span>
// </div>
// <br />

// <div className="RegisFormcon_1">
//   {ProductListFormOne
//     .filter(field => !['ProductCategory_pk', 'ManufacturerName_pk', 'SubCategory_pk', 'GenericName_pk', 'PackType_pk', 'HSNCode'].includes(field))
//     .map((field, Index) => (
//       <div className="RegisForm_1" key={Index + "key"}>
//         <label htmlFor={field}>
//           {formatLabel(field)}
//           <span>:</span>
//         </label>

//         <div className="Search_patient_icons">
//           {['ItemCode', 'ItemName'].includes(field) ? (
//             <>
//               <input
//                 type="text"
//                 id={field}
//                 list={field + "grn_supplier_Product_list"}
//                 name={field}
//                 autoComplete="off"
//                 value={GrnItemDetials[field]}
//                 onChange={HandeleOnchangeItemDetials}
//               />
//               <datalist id={field + "grn_supplier_Product_list"}>
//                 {field === "ItemCode" ? (
//                   (filterDataProduct && filterDataProduct.length > 0
//                     ? filterDataProduct
//                     : SupplierProductListData
//                   ).map((ele, ind) => (
//                     <option key={ind} value={ele.ItemCode}>
//                       {ele.ItemName}
//                     </option>
//                   ))
//                 ) : null}

//                 {field === "ItemName" ? (
//                   (filterDataProduct && filterDataProduct.length > 0
//                     ? filterDataProduct
//                     : SupplierProductListData
//                   ).map((ele, ind) => (
//                     <option key={ind} value={ele.ItemName}>
//                       {ele.ItemCode}
//                     </option>
//                   ))
//                 ) : null}
//               </datalist>
//               <span
//                 onClick={() =>
//                   handlesearchitemslist(
//                     "normal",
//                     field === "ItemCode" ? "id" : "name"
//                   )
//                 }
//               >
//                 <ManageSearchIcon />
//               </span>
//             </>
//           ) : (
//             <input
//               type="text"
//               id={field}
//               name={field}
//               disabled={true}
//               autoComplete="off"
//               value={GrnItemDetials[field]}
//               className="disabled-field"
//             />
//           )}
//         </div>
//       </div>
//     ))}
//   <div className="Main_container_Btn">
//     <button onClick={ChangeMasterdata}>
//       Update
//     </button>
//   </div>
// </div>

//         <br />
//         {GrnItemDetials.ItemCode && GrnItemDetials.ItemName && (
//           <>
//             <div className="common_center_tag">
//               <span>Product Entry Details</span>
//             </div>
//             <br />
//             <div className="RegisFormcon_1">
//               {ProductListFormTwo.filter(field => !["HSNCode"].includes(field)).map((field, indx) => (
//                 <div className="RegisForm_1" key={indx + "key"}>
//                   <label htmlFor={field}>
//                     {field === "IsOnlyFOCQty"
//                       ? "Is Only FOC Qty"
//                       : field === "FOCQuantity"
//                         ? "FOC Quantity"
//                         : field === "IsMRPAsSellablePrice"
//                           ? "Is MRP As Sellable Price"
//                           : formatLabel(field)}
//                     <span>:</span>
//                   </label>
//                   {[
//                     "IsOnlyFOCQty",
//                     "IsMRPAsSellablePrice",
//                     "IsManufactureDateAvailable",
//                     "IsExpiryDateAvailable",
//                   ].includes(field) ? (
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "flex-start",
//                         gap: "10px",
//                         width: "150px",
//                       }}
//                     >
//                       <label style={{ width: "auto" }} htmlFor={`${field}_yes`}>
//                         <input
//                           required
//                           id={`${field}_yes`}
//                           type="radio"
//                           name={field}
//                           value="Yes"
//                           style={{ width: "15px" }}
//                           checked={GrnItemDetials[field]}
//                           autoComplete="off"
//                           onChange={HandeleOnchangeItemDetials}
//                           disabled={[
//                             "IsManufactureDateAvailable",
//                             "IsExpiryDateAvailable",
//                           ].includes(field)}
//                         />
//                         Yes
//                       </label>
//                       <label style={{ width: "auto" }} htmlFor={`${field}_No`}>
//                         <input
//                           required
//                           id={`${field}_No`}
//                           type="radio"
//                           name={field}
//                           value="No"
//                           style={{ width: "15px" }}
//                           checked={!GrnItemDetials[field]}
//                           onChange={HandeleOnchangeItemDetials}
//                           autoComplete="off"
//                           disabled={[
//                             "IsManufactureDateAvailable",
//                             "IsExpiryDateAvailable",
//                           ].includes(field)}
//                         />
//                         No
//                       </label>
//                     </div>
//                   ) : [
//                     "TaxType",
//                     "TaxPercentage",
//                     "DiscountMethod",
//                     "DiscountType",
//                   ].includes(field) ? (
//                     <select
//                       id={field}
//                       name={field}
//                       value={GrnItemDetials[field]}
//                       disabled={
//                         !GrnItemDetials.DiscountMethod &&
//                         field === "DiscountType"
//                       }
//                       autoComplete="off"
//                       onChange={HandeleOnchangeItemDetials}
//                     >
//                       {["DiscountMethod", "DiscountType"] && (
//                         <option value="">Not Applicable</option>
//                       )}
//                       {field === "TaxType" &&
//                         ["GST", "IGST"].map((ele, ind) => (
//                           <option key={ind + "key"} value={ele}>
//                             {ele}
//                           </option>
//                         ))}
//                       {field === "TaxPercentage" &&
//                         ["Nill", "5", "12", "18", "28"].map((ele, ind) => (
//                           <option key={ind + "key"} value={ele}>
//                             {ele}
//                           </option>
//                         ))}
//                       {field === "DiscountMethod" &&
//                         ["BeforeTax", "AfterTax"].map((ele, ind) => (
//                           <option key={ind + "key"} value={ele}>
//                             {ele}
//                           </option>
//                         ))}
//                       {field === "DiscountType" &&
//                         ["Percentage", "Cash"].map((ele, ind) => (
//                           <option key={ind + "key"} value={ele}>
//                             {ele}
//                           </option>
//                         ))}
                   
//                     </select>
//                   ) : (
//                     <div className="Search_patient_icons">
//                       <input
//                         type={
//                           ["ManufactureDate", "ExpiryDate"].includes(field)
//                             ? "date"
//                             : [
//                               "PurchaseRateTaxable",
//                               "MRP",
//                               "ReceivedQty",
//                               "FOCQuantity",
//                               "Discount",
//                             ].includes(field)
//                               ? "number"
//                               : "text"
//                         }
//                         id={field}
//                         name={field}
//                         autoComplete="off"
//                         min={field === "ExpiryDate" ? currentDate : ""}
//                         max={field === "ManufactureDate" ? currentDate : ""}
//                         disabled={
//                           [
//                             "PurchaseRateWithTax",
//                             "TotalReceivedQty",
//                             "TotalPackQuantity",
//                             "SellableQtyPrice",
//                             "TotalPackTaxableAmount",
//                             "TotalTaxAmount",
//                             "TotalPackAmount",
//                             "Discount",
//                             "FinalTotalPackTaxableAmount",
//                             "FinalTotalTaxAmount",
//                             "FinalTotalPackAmount",
//                           ]
//                             .filter((f) =>
//                               GrnItemDetials.DiscountMethod
//                                 ? f !== "Discount"
//                                 : f
//                             )
//                             .includes(field)
//                             ? true
//                             : GrnItemDetials.IsMRPAsSellablePrice &&
//                             field === "SellablePrice" &&
//                             true
//                         }
//                         onKeyDown={
//                           [
//                             "MRP",
//                             "ReceivedQty",
//                             "FOCQuantity",
//                             "Discount",
//                           ].includes(field)
//                             ? BlockInvalidcharecternumber
//                             : null
//                         }
//                         value={GrnItemDetials[field]}
//                         onChange={HandeleOnchangeItemDetials}
//                       />
//                     </div>
                    
//                   )}

                
//                 </div>
               
//               ))}
//                  <>                <div className="RegisForm_1" >
//   <label htmlFor="Reason">
//     Reason <span>:</span>
//   </label>
//   <select
//     id="Reason"
//     name="Reason"
//     value={GrnItemDetials.Reason || ""} // product-wise Reason
//     onChange={HandeleOnchangeItemDetials} // should update current product
//   >
//     <option value="">Select Reason</option>
//     {["IPPHARMACY", "OPPHARMACY", "KARUNAPHARMACY"].map((ele, ind) => (
//       <option key={ind} value={ele}>{ele}</option>
//     ))}
//   </select>
// </div>
// </>
//             </div>
            
//             <br />
//             <div className="Main_container_Btn">
//               <button onClick={handleAddGrnProductList}>
//                 {GrnItemDetials.id ? "Update" : "Add"}
//               </button>
//             </div>
//           </>
//         )}
//         <br />
//         {GrnProductListDatas.length !== 0 && (
//           <>
//             <ReactGrid
//               columns={GrnProductColumns}
//               RowData={GrnProductListDatas}
//             />
//             <br />

//             <div className="RegisFormcon_1">
//               {Object.keys(GrnSupplierDetials)
//                 .filter((p) =>
//                   [
//                     "TotalTaxableAmount",
//                     "TotalTaxAmount",
//                     "TotalAmount",
//                     "TotalDiscountMethod",
//                     "TotalDiscountType",
//                     "TotalDiscount",
//                     "FinalTotalTaxableAmount",
//                     "FinalTotalTaxAmount",
//                     "FinalTotalAmount",
//                     "RoundOffAmount",
//                     "NetAmount",
//                   ].includes(p)
//                 )
//                 .map((field, index) => (
//                   <div className="RegisForm_1" key={index + "key"}>
//                     <label htmlFor={field}>
//                       {formatLabel(field)}
//                       <span>:</span>
//                     </label>
//                     {["TotalDiscountMethod", "TotalDiscountType"].includes(
//                       field
//                     ) ? (
//                       <select
//                         name={field}
//                         id={field}
//                         value={GrnSupplierDetials[field]}
//                         onChange={HandeleOnchange}
//                         disabled={
//                           field === "TotalDiscountMethod"
//                             ? !GrnProductListDatas.some(
//                               (f) => f.DiscountMethod === ""
//                             )
//                             : !GrnSupplierDetials["TotalDiscountMethod"]
//                         }
//                       >
//                         <option value="">Not Applicable</option>
//                         {field === "TotalDiscountMethod" &&
//                           ["BeforeTax", "AfterTax"].map((ele, ind) => (
//                             <option key={ind + "key"} value={ele}>
//                               {ele}
//                             </option>
//                           ))}
//                         {field === "TotalDiscountType" &&
//                           ["Percentage", "Cash"].map((ele, ind) => (
//                             <option key={ind + "key"} value={ele}>
//                               {ele}
//                             </option>
//                           ))}
//                       </select>
//                     ) : (
//                       <input
//                         type={field === "TotalDiscount" ? "number" : "text"}
//                         name={field}
//                         id={field}
//                         disabled={
//                           field !== "TotalDiscount"
//                             ? true
//                             : !GrnSupplierDetials["TotalDiscountType"]
//                         }
//                         onKeyDown={
//                           ["TotalDiscount"].includes(field)
//                             ? BlockInvalidcharecternumber
//                             : null
//                         }
//                         value={GrnSupplierDetials[field]}
//                         onChange={HandeleOnchange}
//                       />
//                     )}
//                   </div>
//                 ))}
//             </div>
//             <br />
//             <div className="Main_container_Btn">
//               <button onClick={handlesaveQuickGrn}>
//                 {GrnSupplierDetials.pk ? "Update GRN" : "Save GRN"}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//       <ToastAlert Message={toast.message} Type={toast.type} />

//       <ModelContainer />
//     </>
//   );
// };

// export default QuickGoodsRecieptNote;


import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addDays, format } from "date-fns";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import { BlockInvalidcharecternumber } from "../../OtherComponent/OtherFunctions";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

const QuickGoodsRecieptNoteOptical = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const GoodsReceiptNoteEdit = useSelector(
    (state) => state.Inventorydata?.GoodsReceiptNoteEdit
  );
  const [SubCategory, setSubCategory] = useState([]);
  const [GenericNameData, setGenericNameData] = useState([])
  const [ManufactureData, setManufactureData] = useState([])
  const [ProductPackType, setProductPackType] = useState([])
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log('userRecord', userRecord?.username
  )

  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
  const [GrnSupplierDetials, setGrnSupplierDetials] = useState({
    IsOldGRN: false,
    GRNDate: "",
    SupplierCode: "",
    SupplierName: "",
    ContactNumber: "",
    SupplierBillNumber: "",
    SupplierBillDate: "",
    SupplierBillDueDate: "",
    SupplierBillAmount: "",
    StoreLocation: allowedStoreId || "",
    ReceivingPersonName: userRecord?.username || "",
    IsFOCAvailable: false,
    FileAttachment: null,
    Status: "Recieved",
    pk: null,
    TotalTaxableAmount: "",
    TotalTaxAmount: "",
    TotalAmount: "",
    TotalDiscountMethod: "",
    TotalDiscountType: "",
    TotalDiscount: "",
    TPD: '',
    FinalTotalTaxableAmount: "",
    FinalTotalTaxAmount: "",
    FinalTotalAmount: "",
    RoundOffAmount: "",
    NetAmount: "",
  });


  const [GrnItemDetials, setGrnItemDetials] = useState({
    id: null,
    pk: null,
    ItemCode: "",
    ItemName: "",
    // ----
    IsOnlyFOCQty: false,
    PurchaseRateTaxable: "",
    TaxPercentage: "Nill",
    PurchaseRateWithTax: "",
    MRP: "",
    TaxType: "GST",
    ReceivedQty: "",
    FOCQuantity: "",
    TotalReceivedQty: "",
    TotalPackQuantity: "",
    IsMRPAsSellablePrice: true,
    SellablePrice: "",
    SellableQtyPrice: "",
    TotalPackTaxableAmount: "",
    TotalTaxAmount: "",
    TotalPackAmount: "",
    BatchNo: "",
    IsManufactureDateAvailable: false,
    ManufactureDate: "",
    IsExpiryDateAvailable: false,
    ExpiryDate: "",
    DiscountMethod: "",
    DiscountType: "",
    Discount: "",
    FinalTotalPackTaxableAmount: "",
    FinalTotalTaxAmount: "",
    FinalTotalPackAmount: "",
    Status: "Recieved",
    Reason: 'OPTICAL', // Add Reason field
  });

  console.log('GrnItemDetials---', GrnItemDetials);

  const [ProductListFormOne, setProductListFormOne] = useState([]);

  const [ProductListFormTwo, setProductListFormTwo] = useState([]);

  const [SupplierData, setSupplierData] = useState([]);
  const [SupplierProductListData, setSupplierProductListData] = useState([]);
  console.log('SupplierProductListData---', SupplierProductListData)
  const [FocSupplierProductListData, setFocSupplierProductListData] = useState([]);
  const [StoreLocationData, setStoreLocationData] = useState([]);
  const [GrnProductListDatas, setGrnProductListDatas] = useState([]);

  // Calculate total product discount amount
  

// const calculateTotalProductDiscount = useCallback(() => {
//   if (!GrnProductListDatas || GrnProductListDatas.length === 0) return 0;
//   let totalDiscount = 0;
//   GrnProductListDatas.forEach(item => {
//     if (!item.IsOnlyFOCQty) {
//       if (item.Discount && item.DiscountMethod && item.DiscountType) {
//         const individualDiscount = parseFloat(item.Discount) || 0;
//         if (item.DiscountType === "Percentage") {
//           // Calculate percentage discount on the appropriate base
//           const itemAmount = parseFloat(item.PurchaseRateWithTax) * parseFloat(item.ReceivedQty) || 0;
//           totalDiscount += (itemAmount * individualDiscount) / 100;
//         } else {
//           // Cash discount - add the exact amount
//           totalDiscount += individualDiscount;
//         }
//       }
//     }
//   });
//   return totalDiscount.toFixed(2);
// }, [GrnProductListDatas]);


const calculateTotalProductDiscount = useCallback(() => {
  if (!GrnProductListDatas || GrnProductListDatas.length === 0) return 0;

  let totalDiscount = 0;

  GrnProductListDatas.forEach(item => {
    if (!item.IsOnlyFOCQty) {
      if (item.Discount && item.DiscountMethod && item.DiscountType) {
        const individualDiscount = parseFloat(item.Discount) || 0;

        if (item.DiscountType === "Percentage") {
          // Calculate percentage discount based on DiscountMethod
          let baseAmount = 0;

          if (item.DiscountMethod === "BeforeTax") {
            baseAmount = parseFloat(item.TotalPackTaxableAmount) || 0;
          } else if (item.DiscountMethod === "AfterTax") {
            baseAmount = parseFloat(item.TotalPackAmount) || 0;
          }

          totalDiscount += (baseAmount * individualDiscount) / 100;
        } else {
          // Cash discount - add the exact amount
          totalDiscount += individualDiscount;
        }
      }
    }
  });

  return totalDiscount.toFixed(2);
}, [GrnProductListDatas]);

const clearGrnItemsList = () => {
    setGrnItemDetials({
      id: null,
      pk: null,
      ItemCode: "",
      ItemName: "",
      // ----
      IsOnlyFOCQty: false,
      PurchaseRateTaxable: "",
      TaxPercentage: "Nill",
      PurchaseRateWithTax: "",
      MRP: "",
      TaxType: "GST",
      ReceivedQty: "",
      FOCQuantity: "",
      TotalReceivedQty: "",
      TotalPackQuantity: "",
      IsMRPAsSellablePrice: true,
      SellablePrice: "",
      SellableQtyPrice: "",
      TotalPackTaxableAmount: "",
      TotalTaxAmount: "",
      TotalPackAmount: "",
      BatchNo: "",
      IsManufactureDateAvailable: false,
      ManufactureDate: "",
      IsExpiryDateAvailable: false,
      ExpiryDate: "",
      DiscountMethod: "",
      DiscountType: "",
      Discount: "",
      FinalTotalPackTaxableAmount: "",
      FinalTotalTaxAmount: "",
      FinalTotalPackAmount: "",
      Status: "Recieved",
      Reason: '', // Add Reason field  
    });
  };

  const currentDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    setGrnSupplierDetials((prev) => ({
      ...prev,
      GRNDate: currentDate,
      SupplierBillDate: currentDate,
    }));
  }, [GrnSupplierDetials.IsOldGRN, currentDate]);

  useEffect(() => {
    if (userRecord?.location) {
      axios
        .get(
          `${UrlLink}Masters/Inventory_Master_Detials_link_optical?SearchLocation=${userRecord?.location
          }&forquickgrn=${false}`
        )
        .then((res) => {
          const data = res.data;
          setStoreLocationData(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, userRecord?.location]);

  useEffect(() => {
    const fetchSubCategory = async () => {
      if (GrnItemDetials?.ProductCategory_pk) {
        try {
          const params = {
            ProductCategory: GrnItemDetials?.ProductCategory_pk,
            ItemCode: GrnItemDetials?.ItemCode,  // <- fixed key
          };

          const { data } = await axios.get(
            `${UrlLink}Masters/SubCategory_Master_link1`,
            { params }   // <- GET uses params
          );

          setSubCategory(data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setSubCategory([]);
        }
      }
    };

    fetchSubCategory();
  }, [UrlLink, GrnItemDetials]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/Supplier_Data_Get_Optical?ForQuickGrn=${true}`, {
        params: {
          SupplierCode: GrnSupplierDetials.SupplierCode,
          SupplierName: GrnSupplierDetials.SupplierName,
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
  }, [
    UrlLink,
    GrnSupplierDetials.SupplierCode,
    GrnSupplierDetials.SupplierName,
  ]);

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  useEffect(() => {
    const findsupdata = SupplierData.find(
      (p) => p.id === GrnSupplierDetials.SupplierCode
    );
    if (findsupdata) {
      axios
        .get(`${UrlLink}Inventory/Supplier_product_Mapping_link`, {
          params: {
            SupplierId: findsupdata.id,
            forquickgrn: true,
            ItemCode: GrnItemDetials.ItemCode,
            ItemName: GrnItemDetials.ItemName,
          },
        })
        .then((res) => {
          const resdata = res.data;
          setSupplierProductListData(Array.isArray(resdata) ? resdata : []);
        })
        .catch((err) => {
          console.log(err);
          setSupplierProductListData([]);
        });
    } else {
      setSupplierProductListData([]);
    }
  }, [
    UrlLink,
    SupplierData,
    GrnSupplierDetials.SupplierCode,
    GrnItemDetials.ItemCode,
    GrnItemDetials.ItemName,
  ]);

  useEffect(() => {
    const findsupdata = SupplierData.find(
      (p) => p.id === GrnSupplierDetials.SupplierCode
    );
    if (findsupdata) {
      axios
        .get(`${UrlLink}Inventory/Supplier_product_Mapping_link`, {
          params: {
            SupplierId: findsupdata.id,
            forquickgrn: true,
          },
        })
        .then((res) => {
          const resdata = res.data;
          setFocSupplierProductListData(Array.isArray(resdata) ? resdata : []);
        })
        .catch((err) => {
          console.log(err);
          setFocSupplierProductListData([]);
        });
    } else {
      setFocSupplierProductListData([]);
    }
  }, [
    SupplierData,
    UrlLink,
    GrnSupplierDetials.SupplierCode,
    GrnItemDetials.ItemCode,
  ]);

  const fetchSupplierData = async (code) => {
    try {
      const response = await axios.get(
        `${UrlLink}Inventory/Supplier_Data_Get_Optical?SupplierCode=${code}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      return {};
    }
  };

  useEffect(() => {
    if (Object.keys(GoodsReceiptNoteEdit).length) {
      setGrnSupplierDetials({
        IsOldGRN: GoodsReceiptNoteEdit?.IsOldGRN,
        GRNDate: GoodsReceiptNoteEdit?.GrnDate,
        SupplierCode: GoodsReceiptNoteEdit?.SupplierCode,
        SupplierName: GoodsReceiptNoteEdit?.SupplierName,
        ContactNumber: GoodsReceiptNoteEdit?.ContactNumber,
        SupplierBillNumber: GoodsReceiptNoteEdit?.Supplier_Bill_Number,
        SupplierBillDate: GoodsReceiptNoteEdit?.Supplier_Bill_Date,
        SupplierBillDueDate: GoodsReceiptNoteEdit?.Supplier_Bill_Due_Date,
        SupplierBillAmount: GoodsReceiptNoteEdit?.Supplier_Bill_Amount,
        StoreLocation: GoodsReceiptNoteEdit?.Store_location_pk,
        ReceivingPersonName: GoodsReceiptNoteEdit?.Received_person,
        IsFOCAvailable: GoodsReceiptNoteEdit?.Is_Foc_Available,
        FileAttachment: GoodsReceiptNoteEdit?.FileAttachment,
        Status: GoodsReceiptNoteEdit?.Status,
        pk: GoodsReceiptNoteEdit?.pk,
        TotalTaxableAmount: GoodsReceiptNoteEdit?.Taxable_Amount,
        TotalTaxAmount: GoodsReceiptNoteEdit?.Tax_Amount,
        TotalAmount: GoodsReceiptNoteEdit?.Total_Amount,
        TotalDiscountMethod: GoodsReceiptNoteEdit?.Total_Discount_Method,
        TotalDiscountType: GoodsReceiptNoteEdit?.Total_Discount_Type,
        TotalDiscount: GoodsReceiptNoteEdit?.Discount_Amount,
        TPD: GoodsReceiptNoteEdit?.TPD,
        FinalTotalTaxableAmount: GoodsReceiptNoteEdit?.Final_Taxable_Amount,
        FinalTotalTaxAmount: GoodsReceiptNoteEdit?.Final_Tax_Amount,
        FinalTotalAmount: GoodsReceiptNoteEdit?.Final_Total_Amount,
        RoundOffAmount: GoodsReceiptNoteEdit?.Round_off_Amount,
        NetAmount: GoodsReceiptNoteEdit?.Net_Amount,
      });
      if (GoodsReceiptNoteEdit?.GRN_Items) {
        setGrnProductListDatas(GoodsReceiptNoteEdit?.GRN_Items);
      }
    }
  }, [GoodsReceiptNoteEdit]);

  const HandeleOnchange = (e) => {
    const { name, value } = e.target;

    if (name === "IsOldGRN") {
      setGrnSupplierDetials((prev) => ({
        ...prev,
        [name]: value === "Yes",
        GRNDate: "",
        SupplierCode: "",
        SupplierName: "",
        ContactNumber: "",
        SupplierBillNumber: "",
        SupplierBillDate: "",
        SupplierBillDueDate: "",
        SupplierBillAmount: "",
        StoreLocation: allowedStoreId || "",
        ReceivingPersonName: userRecord?.username || "",
        IsFOCAvailable: false,
        FileAttachment: null,
        Status: "Recieved",
        pk: null,
        TotalTaxableAmount: "",
        TotalTaxAmount: "",
        TotalAmount: "",
        TotalDiscountMethod: "",
        TotalDiscountType: "",
        TotalDiscount: "",
        TPD: "",
        FinalTotalTaxableAmount: "",
        FinalTotalTaxAmount: "",
        FinalTotalAmount: "",
        RoundOffAmount: "",
        NetAmount: "",
      }));
      clearGrnItemsList();
      setGrnProductListDatas([]);
    } else if (name === "SupplierCode") {
      setGrnSupplierDetials((prev) => ({
        IsOldGRN: prev.IsOldGRN,
        GRNDate: prev.GRNDate,
        [name]: value,
        SupplierName: "",
        ContactNumber: "",
        SupplierBillNumber: "",
        SupplierBillDate: prev.SupplierBillDate,
        SupplierBillDueDate: "",
        SupplierBillAmount: "",
        StoreLocation: allowedStoreId || "",
        ReceivingPersonName: userRecord?.username || "",
        IsFOCAvailable: false,
        FileAttachment: null,
        Status: "Recieved",
        pk: null,
        TotalTaxableAmount: "",
        TotalTaxAmount: "",
        TotalAmount: "",
        TotalDiscountMethod: "",
        TotalDiscountType: "",
        TotalDiscount: "",
        TPD: "",
        FinalTotalTaxableAmount: "",
        FinalTotalTaxAmount: "",
        FinalTotalAmount: "",
        RoundOffAmount: "",
        NetAmount: "",
      }));
      clearGrnItemsList();
      setGrnProductListDatas([]);
    } else if (name === "SupplierName") {
      setGrnSupplierDetials((prev) => ({
        IsOldGRN: prev.IsOldGRN,
        GRNDate: prev.GRNDate,
        SupplierCode: "",
        [name]: value,
        ContactNumber: "",
        SupplierBillNumber: "",
        SupplierBillDate: prev.SupplierBillDate,
        SupplierBillDueDate: "",
        SupplierBillAmount: "",
        StoreLocation: allowedStoreId || "",
        ReceivingPersonName: userRecord?.username || "",
        IsFOCAvailable: false,
        FileAttachment: null,
        Status: "Recieved",
        pk: null,
        TotalTaxableAmount: "",
        TotalTaxAmount: "",
        TotalAmount: "",
        TotalDiscountMethod: "",
        TotalDiscountType: "",
        TotalDiscount: "",
        TPD: "",
        FinalTotalTaxableAmount: "",
        FinalTotalTaxAmount: "",
        FinalTotalAmount: "",
        RoundOffAmount: "",
        NetAmount: "",
      }));
      clearGrnItemsList();
      setGrnProductListDatas([]);
    } else if (name === "IsFOCAvailable") {
      setGrnSupplierDetials((prev) => ({
        ...prev,
        [name]: value === "Yes",
      }));
    } else if (name === "TotalDiscountMethod") {
      setGrnSupplierDetials((prev) => ({
        ...prev,
        [name]: value,
        TotalDiscountType: "",
        TotalDiscount: "",
      }));
    } else if (name === "TotalDiscountType") {
      setGrnSupplierDetials((prev) => ({
        ...prev,
        [name]: value,
        TotalDiscount: "",
      }));
    } else {
      setGrnSupplierDetials((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlesearchsupplierlist = async (field) => {
    let findsupdata;
    if (field === "SupplierCode") {
      findsupdata = SupplierData.find(
        (p) => p.id === GrnSupplierDetials.SupplierCode
      );
    } else {
      findsupdata = SupplierData.find(
        (p) => p.SupplierName === GrnSupplierDetials.SupplierName
      );
    }
    if (findsupdata) {
      const data = await fetchSupplierData(findsupdata.id);
      const initialDate = new Date(GrnSupplierDetials.SupplierBillDate);
      const newDate = addDays(initialDate, 45);
      const supplierbillduedate = format(newDate, "yyyy-MM-dd");
      setGrnSupplierDetials((prev) => ({
        IsOldGRN: prev.IsOldGRN,
        GRNDate: prev.GRNDate,
        SupplierCode: findsupdata?.id,
        SupplierName: findsupdata?.SupplierName,
        ContactNumber: data?.ContactNumber,
        SupplierBillNumber: "",
        SupplierBillDate: prev.SupplierBillDate,
        SupplierBillDueDate: supplierbillduedate,
        SupplierBillAmount: "",
        StoreLocation: allowedStoreId || "",
        ReceivingPersonName: userRecord?.username || "",
        IsFOCAvailable: false,
        FileAttachment: null,
        Status: "Recieved",
        pk: null,
        TotalTaxableAmount: "",
        TotalTaxAmount: "",
        TotalAmount: "",
        TotalDiscountMethod: "",
        TotalDiscountType: "",
        TotalDiscount: "",
        TPD: "",
        FinalTotalTaxableAmount: "",
        FinalTotalTaxAmount: "",
        FinalTotalAmount: "",
        RoundOffAmount: "",
        NetAmount: "",
      }));
    } else {
      setGrnSupplierDetials((prev) => ({
        IsOldGRN: prev.IsOldGRN,
        GRNDate: prev.GRNDate,
        SupplierCode: "",
        SupplierName: "",
        ContactNumber: "",
        SupplierBillNumber: "",
        SupplierBillDate: prev.SupplierBillDate,
        SupplierBillDueDate: "",
        SupplierBillAmount: "",
        StoreLocation: allowedStoreId || "",
        ReceivingPersonName: userRecord?.username || "",
        IsFOCAvailable: false,
        FileAttachment: null,
        Status: "Recieved",
        pk: null,
        TotalTaxableAmount: "",
        TotalTaxAmount: "",
        TotalAmount: "",
        TotalDiscountMethod: "",
        TotalDiscountType: "",
        TotalDiscount: "",
        TPD: "",
        FinalTotalTaxableAmount: "",
        FinalTotalTaxAmount: "",
        FinalTotalAmount: "",
        RoundOffAmount: "",
        NetAmount: "",
      }));
      setGrnProductListDatas([]);
    }
  };

  const HandeleOnchangeItemDetials = (e) => {
    const { name, value } = e.target;

    if (
      [
        "IsOnlyFOCQty",
        "IsMRPAsSellablePrice",
        "IsManufactureDateAvailable",
        "IsExpiryDateAvailable",
      ].includes(name)
    ) {
      if (name === "IsOnlyFOCQty") {
        if (value === "Yes") {
          setGrnItemDetials((prev) => ({
            ...prev,
            [name]: value === "Yes",
            PurchaseRateTaxable: "",
            TaxPercentage: "",
            PurchaseRateWithTax: "",
            MRP: GrnItemDetials?.PreviousMRP,
            TaxType: "",
            ReceivedQty: "",
          }));
        } else {
          setGrnItemDetials((prev) => ({
            ...prev,
            [name]: value === "Yes",
            PurchaseRateTaxable: GrnItemDetials?.PreviousPurchaseRateBeforeGST,
            TaxPercentage: GrnItemDetials?.PreviousGST,
            PurchaseRateWithTax: GrnItemDetials?.PreviousPurchaseRateAfterGST,
            MRP: GrnItemDetials?.PreviousMRP,
            TaxType: "GST",
            ReceivedQty: "",
          }));
        }
      } else {
        setGrnItemDetials((prev) => ({
          ...prev,
          [name]: value === "Yes",
        }));
      }
    } else if (name === "ItemCode") {
      setGrnItemDetials((prev) => ({
        id: null,
        pk: null,
        [name]: value,
        ItemName: "",
        IsOnlyFOCQty: false,
        PurchaseRateTaxable: "",
        TaxPercentage: "Nill",
        PurchaseRateWithTax: "",
        MRP: "",
        TaxType: "GST",
        ReceivedQty: "",
        FOCQuantity: "",
        TotalReceivedQty: "",
        TotalPackQuantity: "",
        IsMRPAsSellablePrice: true,
        SellablePrice: "",
        SellableQtyPrice: "",
        TotalPackTaxableAmount: "",
        TotalTaxAmount: "",
        TotalPackAmount: "",
        BatchNo: "",
        IsManufactureDateAvailable: false,
        ManufactureDate: "",
        IsExpiryDateAvailable: false,
        ExpiryDate: "",
        DiscountMethod: "",
        DiscountType: "",
        Discount: "",
        FinalTotalPackTaxableAmount: "",
        FinalTotalTaxAmount: "",
        FinalTotalPackAmount: "",
        Status: "Recieved",
      }));
    } else if (name === "ItemName") {
      setGrnItemDetials((prev) => ({
        id: null,
        pk: null,
        ItemCode: "",
        [name]: value,
        IsOnlyFOCQty: false,
        PurchaseRateTaxable: "",
        TaxPercentage: "Nill",
        PurchaseRateWithTax: "",
        MRP: "",
        TaxType: "GST",
        ReceivedQty: "",
        FOCQuantity: "",
        TotalReceivedQty: "",
        TotalPackQuantity: "",
        IsMRPAsSellablePrice: true,
        SellablePrice: "",
        SellableQtyPrice: "",
        TotalPackTaxableAmount: "",
        TotalTaxAmount: "",
        TotalPackAmount: "",
        BatchNo: "",
        IsManufactureDateAvailable: false,
        ManufactureDate: "",
        IsExpiryDateAvailable: false,
        ExpiryDate: "",
        DiscountMethod: "",
        DiscountType: "",
        Discount: "",
        FinalTotalPackTaxableAmount: "",
        FinalTotalTaxAmount: "",
        FinalTotalPackAmount: "",
        Status: "Recieved",
      }));
    } else if (name === "MRP") {
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: value,
        IsMRPAsSellablePrice: true,
        SellablePrice: value,
        SellableQtyPrice: "",
      }));
    } else if (name === "SellablePrice") {
      if (parseFloat(value) <= parseFloat(GrnItemDetials.MRP)) {
        setGrnItemDetials((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else {
        setGrnItemDetials((prev) => ({
          ...prev,
          [name]: GrnItemDetials.MRP,
          IsMRPAsSellablePrice: true,
          SellableQtyPrice: "",
        }));
        const tdata = {
          message: `The selling Price must be less than or equal to MRP of ${GrnItemDetials.MRP}.`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else if (name === "IsManufactureDateAvailable") {
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: value,
        ManufactureDate: "",
      }));
    } else if (name === "IsExpiryDateAvailable") {
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: value,
        ExpiryDate: "",
      }));
    } else if (name === "DiscountMethod") {
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: value,
        DiscountType: "",
        Discount: "",
      }));
    }
    else if (name === "DiscountType") {
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: value,
        Discount: "",
      }));
    }
    else if (name === "PackType") {
      const packname = ProductPackType.find(ele => ele.id === value);
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: packname?.PackTypeName || "",
        PackType_pk: value
      }));
    }
    else if (name === "SubCategory") {
      const subcate = SubCategory.find(ele => ele.id === value);
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: subcate?.SubCategoryName || "",
        SubCategory_pk: value
      }));
    }
    else if (name === "GenericName") {
      const generic = GenericNameData.find(ele => ele.id === value);
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: generic?.GenericName || "",
        GenericName_pk: value
      }));
    }
    else if (name === "ManufacturerName") {
      const manufact = ManufactureData.find(ele => ele.id === value);
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: manufact?.CompanyName || "",
        ManufacturerName_pk: value
      }));
    }
    else {
      setGrnItemDetials((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlesearchitemslist = (type = "normal", fieldtype = "id") => {
    if (type === "normal") {
      if (GrnItemDetials.ItemCode || GrnItemDetials.ItemName) {
        let findadata = SupplierProductListData.find(
          (p) => "" + p.ItemCode === GrnItemDetials.ItemCode
        );
        if (fieldtype !== "id") {
          findadata = SupplierProductListData.find(
            (p) => "" + p.ItemName === GrnItemDetials.ItemName
          );
        }
        if (findadata) {
          const {
            id,
            SupplierPoductId,
            ItemCode,
            ItemName,
            Status,
            Is_Manufacture_Date_Available,
            Is_Expiry_Date_Available,
            ...rest
          } = findadata;
          
          setGrnItemDetials((prev) => ({
            id: null,
            pk: null,
            
            // Basic Item Info
            ItemCode: ItemCode,
            ItemName: ItemName,
            
            // Product Details from API
            ProductCategory: rest?.ProductCategory || "",
            ProductCategory_pk: rest?.ProductCategory_pk || "",
            SubCategory: rest?.SubCategory || "",
            SubCategory_pk: rest?.SubCategory_pk || "",
            ManufacturerName: rest?.ManufacturerName || "",
            ManufacturerName_pk: rest?.ManufacturerName_pk || "",
            GenericName: rest?.GenericName || "",
            GenericName_pk: rest?.GenericName_pk || "",
            HSNCode: rest?.HSNCode || "",
            PackType: rest?.PackType || "",
            PackType_pk: rest?.PackType_pk || "",
            PackQuantity: rest?.PackQuantity || "",
            LeastSellableUnit: rest?.LeastSellableUnit || "",
            
            // Pricing Information from API
            PreviousMRP: rest?.PreviousMRP || "",
            PreviousPurchaseRateBeforeGST: rest?.PreviousPurchaseRateBeforeGST || "",
            PreviousGST: rest?.PreviousGST || "",
            PreviousPurchaseRateAfterGST: rest?.PreviousPurchaseRateAfterGST || "",
            
            // Current Entry Fields (initialize with API data or defaults)
            IsOnlyFOCQty: false,
            PurchaseRateTaxable: rest?.PreviousPurchaseRateBeforeGST || "",
            TaxPercentage: rest?.PreviousGST || "Nill",
            PurchaseRateWithTax: rest?.PreviousPurchaseRateAfterGST || "",
            MRP: rest?.PreviousMRP || "",
            TaxType: "GST",
            ReceivedQty: "",
            FOCQuantity: "",
            TotalReceivedQty: "",
            TotalPackQuantity: "",
            IsMRPAsSellablePrice: true,
            SellablePrice: rest?.PreviousMRP || "",
            SellableQtyPrice: "",
            TotalPackTaxableAmount: "",
            TotalTaxAmount: "",
            TotalPackAmount: "",
            BatchNo: "",
            IsManufactureDateAvailable: Is_Manufacture_Date_Available || false,
            ManufactureDate: "",
            IsExpiryDateAvailable: Is_Expiry_Date_Available || false,
            ExpiryDate: "",
            DiscountMethod: "",
            DiscountType: "",
            Discount: "",
            FinalTotalPackTaxableAmount: "",
            FinalTotalTaxAmount: "",
            FinalTotalPackAmount: "",
            Status: "Recieved",
            Reason: 'OPTICAL',
          }));

        } else {
          const tdata = {
            message: `Please enter valid Item Code or Item Name to search.`,
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: tdata });
          setGrnItemDetials((prev) => ({
            ...prev,
            id: null,
            pk: null,
            ProductCategory: "",
            ProductCategory_pk: "",
            SubCategory: "",
            SubCategory_pk: "",
            ManufacturerName: "",
            ManufacturerName_pk: "",
            GenericName: "",
            GenericName_pk: "",
            HSNCode: "",
            PackType: "",
            PackType_pk: "",
            PackQuantity: "",
            LeastSellableUnit: "",
            PreviousMRP: "",
            PreviousPurchaseRateBeforeGST: "",
            PreviousGST: "",
            PreviousPurchaseRateAfterGST: "",
            PurchaseRateTaxable: "",
            TaxPercentage: "Nill",
            PurchaseRateWithTax: "",
            MRP: "",
            SellablePrice: "",
          }));
        }
      } else {
        const tdata = {
          message: `Please fill atleast any one of the Item Code or Item Name to search.`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    }
  };

  const fetchDependentData = async (productCategoryPk) => {
    if (!productCategoryPk) return;

    try {
      const subCategoryRes = await axios.get(
        `${UrlLink}Masters/SubCategory_Master_link1`,
        {
          params: {
            ProductCategory: productCategoryPk,
            ItemCode: GrnItemDetials?.ItemCode,
          },
        }
      );
      setSubCategory(subCategoryRes.data);

      const baseParams = `ProductCategory=${productCategoryPk}`;
      
      const [genericRes, manufacturerRes, packTypeRes] = await Promise.all([
        axios.get(`${UrlLink}Masters/GenericName_by_Product_SubProduct?${baseParams}&ItemCode=${GrnItemDetials.ItemCode}`),
        axios.get(`${UrlLink}Masters/CompanyName_by_Product_SubProduct?${baseParams}&ItemCode=${GrnItemDetials.ItemCode}`),
        axios.get(`${UrlLink}Masters/PackType_by_Product_SubProduct?${baseParams}&ItemCode=${GrnItemDetials.ItemCode}`),
      ]);

      setGenericNameData(genericRes.data);
      setManufactureData(manufacturerRes.data);
      setProductPackType(packTypeRes.data);

    } catch (error) {
      console.error("Error fetching dependent data:", error);
    }
  };

  const calculatePreviousPurchaseRate = useCallback(() => {
    const gst = parseFloat(GrnItemDetials.PreviousGST || "0");
    const baseRate = parseFloat(GrnItemDetials.PreviousPurchaseRateBeforeGST || "0");

    const gstAmount = (gst / 100) * baseRate;
    const previousRateAfterGST = (baseRate + gstAmount).toFixed(2);

    setGrnItemDetials(prev => ({
      ...prev,
      PreviousPurchaseRateAfterGST: previousRateAfterGST,
    }));
  }, [
    GrnItemDetials.PreviousPurchaseRateBeforeGST,
    GrnItemDetials.PreviousGST
  ]);

  useEffect(() => {
    calculatePreviousPurchaseRate();
  }, [calculatePreviousPurchaseRate]);

  useEffect(() => {
    let Filtered_with_out_dis_FinalTotalTaxableAmount = 0;
    let Filtered_with_out_dis_FinalTotalTaxAmount = 0;
    let Filtered_with_out_dis_FinalTotalAmount = 0;
    let Filtered_with_dis_FinalTotalTaxableAmount = 0;
    let Filtered_with_dis_FinalTotalTaxAmount = 0;
    let Filtered_with_dis_FinalTotalAmount = 0;
    let TotalTaxableAmount = 0;
    let TotalTaxAmount = 0;
    let TotalAmount = 0;

    let FinalTotalTaxableAmount = 0;
    let FinalTotalTaxAmount = 0;
    let FinalTotalAmount = 0;
    let RoundOffAmount = 0;
    let NetAmount = 0;
    
    // Calculate total product discount
    const totalProductDiscount = calculateTotalProductDiscount();

    if (GrnProductListDatas.length !== 0) {
      GrnProductListDatas.forEach((item) => {
        TotalTaxableAmount += +item?.TotalPackTaxableAmount;
        TotalTaxAmount += +item?.TotalTaxAmount;
        TotalAmount += +item?.TotalPackAmount;
      });
      GrnProductListDatas.filter((f) => f.DiscountMethod === "").forEach(
        (item) => {
          Filtered_with_out_dis_FinalTotalTaxableAmount +=
            +item?.FinalTotalPackTaxableAmount;
          Filtered_with_out_dis_FinalTotalTaxAmount +=
            +item?.FinalTotalTaxAmount;
          Filtered_with_out_dis_FinalTotalAmount += +item?.FinalTotalPackAmount;
        }
      );
      GrnProductListDatas.filter((f) => f.DiscountMethod !== "").forEach(
        (item) => {
          Filtered_with_dis_FinalTotalTaxableAmount +=
            +item?.FinalTotalPackTaxableAmount;
          Filtered_with_dis_FinalTotalTaxAmount += +item?.FinalTotalTaxAmount;
          Filtered_with_dis_FinalTotalAmount += +item?.FinalTotalPackAmount;
        }
      );
    }

    if (
      Filtered_with_out_dis_FinalTotalTaxableAmount &&
      Filtered_with_out_dis_FinalTotalTaxAmount &&
      Filtered_with_out_dis_FinalTotalAmount &&
      GrnSupplierDetials.TotalDiscountMethod &&
      GrnSupplierDetials.TotalDiscountType &&
      GrnSupplierDetials.TotalDiscount
    ) {
      if (GrnSupplierDetials.TotalDiscountMethod === "BeforeTax") {
        const fixed_taxable_val = Filtered_with_out_dis_FinalTotalTaxableAmount;
        const fixed_taxvale = Filtered_with_out_dis_FinalTotalTaxAmount;
        if (GrnSupplierDetials.TotalDiscountType === "Percentage") {
          Filtered_with_out_dis_FinalTotalTaxableAmount -=
            Filtered_with_out_dis_FinalTotalTaxableAmount *
            (+GrnSupplierDetials.TotalDiscount / 100);
        } else {
          Filtered_with_out_dis_FinalTotalTaxableAmount -=
            +GrnSupplierDetials.TotalDiscount;
        }
        Filtered_with_out_dis_FinalTotalTaxAmount =
          (Filtered_with_out_dis_FinalTotalTaxableAmount * +fixed_taxvale) /
          fixed_taxable_val;
        Filtered_with_out_dis_FinalTotalAmount =
          Filtered_with_out_dis_FinalTotalTaxableAmount +
          Filtered_with_out_dis_FinalTotalTaxAmount;
      } else if (GrnSupplierDetials.TotalDiscountMethod === "AfterTax") {
        if (GrnSupplierDetials.TotalDiscountType === "Percentage") {
          Filtered_with_out_dis_FinalTotalAmount -=
            Filtered_with_out_dis_FinalTotalAmount *
            (+GrnSupplierDetials.TotalDiscount / 100);
        } else {
          Filtered_with_out_dis_FinalTotalAmount -=
            +GrnSupplierDetials.TotalDiscount;
        }
      }
    }
    FinalTotalTaxableAmount =
      Filtered_with_out_dis_FinalTotalTaxableAmount +
      Filtered_with_dis_FinalTotalTaxableAmount;
    FinalTotalTaxAmount =
      Filtered_with_out_dis_FinalTotalTaxAmount +
      Filtered_with_dis_FinalTotalTaxAmount;
    FinalTotalAmount =
      Filtered_with_out_dis_FinalTotalAmount +
      Filtered_with_dis_FinalTotalAmount;

    RoundOffAmount = Math.round(FinalTotalAmount) - FinalTotalAmount;
    NetAmount = Math.round(FinalTotalAmount);

    setGrnSupplierDetials((prev) => ({
      ...prev,
      TotalTaxableAmount: TotalTaxableAmount.toFixed(2),
      TotalTaxAmount: TotalTaxAmount.toFixed(2),
      TotalAmount: TotalAmount.toFixed(2),
      TPD: totalProductDiscount,
      FinalTotalTaxableAmount: FinalTotalTaxableAmount.toFixed(2),
      FinalTotalTaxAmount: FinalTotalTaxAmount.toFixed(2),
      FinalTotalAmount: FinalTotalAmount.toFixed(2),
      RoundOffAmount: RoundOffAmount.toFixed(2),
      NetAmount: NetAmount.toFixed(2),
    }));
  }, [
    GrnProductListDatas,
    GrnSupplierDetials.TotalDiscountMethod,
    GrnSupplierDetials.TotalDiscountType,
    GrnSupplierDetials.TotalDiscount,
    calculateTotalProductDiscount
  ]);

  useEffect(() => {
    let purchaserate = parseFloat(GrnItemDetials.PurchaseRateTaxable, 0) || 0;
    let totalAmount;
    if (GrnItemDetials.TaxPercentage !== "") {
      if (GrnItemDetials.TaxPercentage === "Nill") {
        totalAmount = purchaserate;
      } else {
        let GSTValue = +GrnItemDetials.TaxPercentage;
        totalAmount = purchaserate + (purchaserate * GSTValue) / 100;
      }
    }

    let recieved_qty = parseInt(GrnItemDetials.ReceivedQty || 0, 0);
    let total_recieved_qty =
      recieved_qty + parseInt(GrnItemDetials.FOCQuantity || 0, 0);

    if (GrnItemDetials.TaxPercentage !== "" && GrnItemDetials.MRP !== "") {
      if (parseFloat(GrnItemDetials.MRP) >= totalAmount) {
        const discount_amount = parseFloat(GrnItemDetials.Discount) || 0;
        let mrp_for_leastsellablequantity = 0;
        let total_rate_taxable = purchaserate * recieved_qty;
        let total_gst =
          GrnItemDetials.TaxPercentage === "Nill"
            ? 0
            : (total_rate_taxable * parseInt(GrnItemDetials.TaxPercentage)) /
            100;
        let total_rate_with_gst = total_rate_taxable + total_gst;
        let grant_total_rate_taxable = 0;
        let grant_gst = 0;
        let grant_total_rate_with_gst = 0;

        if (GrnItemDetials?.PackQuantity && GrnItemDetials?.LeastSellableUnit) {
          if (parseInt(GrnItemDetials?.PackQuantity || 1) === 1) {
            mrp_for_leastsellablequantity = parseFloat(
              GrnItemDetials.SellablePrice
            );
          } else {
            if (parseInt(GrnItemDetials?.LeastSellableUnit || 1) === 1) {
              mrp_for_leastsellablequantity =
                parseFloat(GrnItemDetials.SellablePrice) /
                parseInt(GrnItemDetials?.PackQuantity || 1);
            } else if (GrnItemDetials.LeastSellableUnit === "Not Sellable") {
              mrp_for_leastsellablequantity =
                parseFloat(GrnItemDetials.SellablePrice) /
                parseInt(GrnItemDetials?.PackQuantity || 1);
            } else {
              mrp_for_leastsellablequantity = parseFloat(
                GrnItemDetials.SellablePrice
              );
            }
          }
        }

        if (GrnItemDetials?.DiscountMethod === "BeforeTax") {
          if (GrnItemDetials.DiscountType === "Percentage") {
            grant_total_rate_taxable =
              total_rate_taxable - total_rate_taxable * (discount_amount / 100);
          } else {
            grant_total_rate_taxable = total_rate_taxable - discount_amount;
          }
          grant_gst =
            GrnItemDetials.TaxPercentage === "Nill"
              ? 0
              : (grant_total_rate_taxable *
                parseInt(GrnItemDetials.TaxPercentage)) /
              100;
          grant_total_rate_with_gst = grant_total_rate_taxable + grant_gst;
        } else if (GrnItemDetials?.DiscountMethod === "AfterTax") {
          if (GrnItemDetials.DiscountType === "Percentage") {
            grant_total_rate_with_gst =
              total_rate_with_gst -
              total_rate_with_gst * (discount_amount / 100);
          } else {
            grant_total_rate_with_gst = total_rate_with_gst - discount_amount;
          }
          grant_total_rate_taxable = total_rate_taxable;
          grant_gst =
            GrnItemDetials.TaxPercentage === "Nill"
              ? 0
              : (grant_total_rate_taxable *
                parseInt(GrnItemDetials.TaxPercentage)) /
              100;
        } else {
          grant_total_rate_taxable = total_rate_taxable;
          grant_gst = total_gst;
          grant_total_rate_with_gst = total_rate_taxable + total_gst;
        }

        setGrnItemDetials((prev) => ({
          ...prev,
          PurchaseRateWithTax: totalAmount.toFixed(3),
          TotalReceivedQty: total_recieved_qty,
          TotalPackQuantity: GrnItemDetials?.PackQuantity * total_recieved_qty,
          SellableQtyPrice: mrp_for_leastsellablequantity.toFixed(3),
          TotalPackTaxableAmount: total_rate_taxable.toFixed(3),
          TotalTaxAmount: total_gst.toFixed(3),
          TotalPackAmount: total_rate_with_gst.toFixed(3),
          FinalTotalPackTaxableAmount: grant_total_rate_taxable.toFixed(3),
          FinalTotalTaxAmount: grant_gst.toFixed(3),
          FinalTotalPackAmount: grant_total_rate_with_gst.toFixed(3),
        }));
      } else {
        const tdata = {
          message: `The purchase rate after GST must be smaller than the MRP ${GrnItemDetials.MRP}.`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        setGrnItemDetials((prev) => ({
          ...prev,
          PurchaseRateTaxable: "",
          PurchaseRateWithTax: "",
        }));
      }
    } else {
      setGrnItemDetials((prev) => ({
        ...prev,
        PurchaseRateTaxable: "",
        PurchaseRateWithTax: "",
        TotalReceivedQty: total_recieved_qty,
        TotalPackQuantity: GrnItemDetials?.PackQuantity * total_recieved_qty,
      }));
    }
  }, [
    GrnItemDetials.TaxPercentage,
    GrnItemDetials.PurchaseRateTaxable,
    GrnItemDetials.MRP,
    GrnItemDetials.SellablePrice,
    GrnItemDetials.ReceivedQty,
    GrnItemDetials.FOCQuantity,
    GrnItemDetials?.PackQuantity,
    GrnItemDetials?.LeastSellableUnit,
    GrnItemDetials.DiscountMethod,
    GrnItemDetials.DiscountType,
    GrnItemDetials.Discount,
    dispatchvalue,
  ]);

  useEffect(() => {
    let fdata = Object.keys(GrnItemDetials).filter((f) =>
      [
        "ItemCode",
        "ItemName",
        "ProductCategory",
        "ProductCategory_pk",
        "SubCategory",
        "SubCategory_pk",
        "ManufacturerName",
        "ManufacturerName_pk",
        "GenericName",
        "GenericName_pk",
        "PackType",
        "PackType_pk",
        "PackQuantity",
        "PreviousMRP",
        "PreviousPurchaseRateBeforeGST",
        "PreviousGST",
        "PreviousPurchaseRateAfterGST",
        "LeastSellableUnit",
      ].includes(f)
    );
    setProductListFormOne(fdata);

    let fdata2 = Object.keys(GrnItemDetials).filter(
      (f) =>
        ![
          "ItemCode",
          "ItemName",
          "ProductCategory_pk",
          "ProductCategory",
          "SubCategory",
          "SubCategory_pk",
          "ManufacturerName",
          "ManufacturerName_pk",
          "GenericName",
          "GenericName_pk",
          "PackType",
          "PackType_pk",
          "PackQuantity",
          "PreviousMRP",
          "PreviousPurchaseRateBeforeGST",
          "PreviousGST",
          "PreviousPurchaseRateAfterGST",
          "LeastSellableUnit",
          "id",
          "pk",
          "Status",
        ].includes(f)
    );

    if (!GrnSupplierDetials.IsFOCAvailable) {
      fdata2 = fdata2.filter(
        (f) => !["IsOnlyFOCQty", "FOCQuantity"].includes(f)
      );
    }
    if (!GrnItemDetials.IsManufactureDateAvailable) {
      fdata2 = fdata2.filter((f) => !["ManufactureDate"].includes(f));
    }
    if (!GrnItemDetials.IsExpiryDateAvailable) {
      fdata2 = fdata2.filter((f) => !["ExpiryDate"].includes(f));
    }
    if (GrnItemDetials?.LeastSellableUnit === "Not Sellable") {
      fdata2 = fdata2.filter(
        (f) =>
          ![
            "IsMRPAsSellablePrice",
            "SellablePrice",
            "SellableQtyPrice",
          ].includes(f)
      );
    }

    if (GrnItemDetials.IsOnlyFOCQty) {
      fdata2 = fdata2.filter(
        (f) =>
          ![
            "PurchaseRateTaxable",
            "TaxPercentage",
            "PurchaseRateWithTax",
            "MRP",
            "TaxType",
            "ReceivedQty",
            "IsMRPAsSellablePrice",
            "TotalPackTaxableAmount",
            "TotalTaxAmount",
            "TotalPackAmount",
            "DiscountMethod",
            "DiscountType",
            "Discount",
            "FinalTotalPackTaxableAmount",
            "FinalTotalTaxAmount",
            "FinalTotalPackAmount",
          ].includes(f)
      );
    }

    setProductListFormTwo(fdata2);
  }, [GrnItemDetials, GrnSupplierDetials.IsFOCAvailable]);

  const handlefileOnchange = (e) => {
    const { files } = e.target;

    if (files && files.length > 0) {
      let formattedValue = files[0];

      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ""
      ) {
        const tdata = {
          message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        if (formattedValue.size > maxSize) {
          const tdata = {
            message: "File size exceeds the limit of 5MB.",
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: tdata });
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setGrnSupplierDetials((prev) => ({
              ...prev,
              FileAttachment: reader.result,
            }));
          };
          reader.readAsDataURL(formattedValue);
        }
      }
    } else {
      const tdata = {
        message: "No file selected. Please choose a file to upload.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const Selectedfileview = (fileval) => {
    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: "image/jpg",
      };
      if (
        ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
          fileval?.split(",")[0]
        )
      ) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/jpeg",
        };
      } else if (fileval?.split(",")[0] === "data:image/png;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/png",
        };
      } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "application/pdf",
        };
      }

      dispatchvalue({ type: "modelcon", value: tdata });
    } else {
      const tdata = {
        message: "There is no file to view.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const handelEditGrnProductList = async (params) => {
    try {
      const findsupdata = SupplierData.find(
        (p) => p.id === GrnSupplierDetials.SupplierCode
      );

      const findadata = await axios.get(
        `${UrlLink}Inventory/Supplier_product_Mapping_link`,
        {
          params: {
            SupplierId: findsupdata.id,
            forquickgrn: true,
            ItemCode: params.ItemCode,
            ItemName: params.ItemName,
          },
        }
      );
      const summadata = findadata.data[0];
      const {
        id,
        SupplierPoductId,
        ItemCode,
        ItemName,
        Status,
        Is_Manufacture_Date_Available,
        Is_Expiry_Date_Available,
        ...rest
      } = summadata;
      setGrnItemDetials({
        id: params.id,
        ItemCode: ItemCode,
        ItemName: ItemName,
        ...rest,
        IsOnlyFOCQty: params?.IsFOCProduct,
        PurchaseRateTaxable: params?.PurchaseRateTaxable,
        TaxPercentage: params?.TaxPercentage,
        PurchaseRateWithTax: params?.PurchaseRateWithTax,
        MRP: params?.MRP,
        TaxType: params?.TaxType,
        ReceivedQty: params?.ReceivedQty,
        FOCQuantity: params?.FOCQuantity,
        TotalReceivedQty: params?.TotalReceivedQty,
        TotalPackQuantity: params?.TotalPackQuantity,
        IsMRPAsSellablePrice: params?.IsMRPAsSellablePrice,
        SellablePrice: params?.SellablePrice,
        SellableQtyPrice: params?.SellableQtyPrice,
        TotalPackTaxableAmount: params?.TotalPackTaxableAmount,
        TotalTaxAmount: params?.TotalTaxAmount,
        TotalPackAmount: params?.TotalPackAmount,
        BatchNo: params?.BatchNo,
        IsManufactureDateAvailable: Is_Manufacture_Date_Available,
        ManufactureDate: params?.ManufactureDate,
        IsExpiryDateAvailable: Is_Expiry_Date_Available,
        ExpiryDate: params?.ExpiryDate,
        DiscountMethod: params?.DiscountMethod,
        DiscountType: params?.DiscountType,
        Discount: params?.Discount,
        FinalTotalPackTaxableAmount: params?.FinalTotalPackTaxableAmount,
        FinalTotalTaxAmount: params?.FinalTotalTaxAmount,
        FinalTotalPackAmount: params?.FinalTotalPackAmount,
        Status: "Recieved",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handelDeleteGrnProductList = (params) => {
    setGrnProductListDatas((prev) => prev.filter((p) => p.id !== params.id));
  };

  const GrnProductColumns = [
    ...[
      "id",
      "Action",
      "Reason",
      // "ItemCode",
      "ItemName",
      "IsOnlyFOCQty",
      "PurchaseRateTaxable",
      "TaxPercentage",
      "PurchaseRateWithTax",
      "MRP",
      "TaxType",
      "ReceivedQty",
      "FOCQuantity",
      "TotalReceivedQty",
      "TotalPackQuantity",
      "SellableQtyPrice",
      "TotalPackTaxableAmount",
      "TotalTaxAmount",
      "TotalPackAmount",
      "BatchNo",
      // "ManufactureDate",
      "ExpiryDate",
      "DiscountMethod",
      "DiscountType",
      "Discount",
      "FinalTotalPackTaxableAmount",
      "FinalTotalTaxAmount",
      "FinalTotalPackAmount",
    ].map((field) => ({
      key: field,
      name:
        field === "id"
          ? "S.No"
          : field === "IsOnlyFOCQty"
            ? "Is Only FOC Qty"
            : field === "FOCQuantity"
              ? "FOC Quantity"
              : formatLabel(field),
      width:
        [
          "PurchaseRateTaxable",
          "TaxPercentage",
          "PurchaseRateWithTax",
          "TotalPackTaxableAmount",
          "FinalTotalPackTaxableAmount",
          "FinalTotalTaxAmount",
          "FinalTotalPackAmount",
          "Action",
        ].includes(field) && 200,
      renderCell: (params) =>
        field === "Action" ? (
          <>
            <Button
              className="cell_btn"
              onClick={() => handelEditGrnProductList(params.row)}
            >
              <EditIcon className="check_box_clrr_cancell" />
            </Button>

            <Button
              className="cell_btn"
              onClick={() => handelDeleteGrnProductList(params.row)}
            >
              <DeleteIcon className="check_box_clrr_cancell" />
            </Button>
          </>
        ) : field === "IsOnlyFOCQty" ? (
          params.row[field] ? (
            "Yes"
          ) : (
            "No"
          )
        ) : params.row[field] ? (
          params.row[field]
        ) : (
          "-"
        ),
    })),
  ];

  const handleAddGrnProductList = () => {
    let requiredFields = Object.keys(GrnItemDetials).filter(
      (p) =>
        ![
        
        ].includes(p)
    );
  
    if (GrnItemDetials.IsOnlyFOCQty) {
      requiredFields = requiredFields.filter(
        (f) =>
          ![
            "PurchaseRateTaxable",
            "TaxPercentage",
            "PurchaseRateWithTax",
            "TaxType",
            "ReceivedQty",
          ].includes(f)
      );
    }
    if (GrnItemDetials.TaxPercentage === "Nill") {
      requiredFields = requiredFields.filter(
        (f) => !["TotalTaxAmount", "FinalTotalTaxAmount"].includes(f)
      );
    }
    if (!GrnItemDetials.DiscountMethod) {
      requiredFields = requiredFields.filter(
        (f) => !["Discount", "DiscountType"].includes(f)
      );
    }
    const missingFields = requiredFields.filter((f) => !GrnItemDetials[f]);
   
      const CheckDublicate = GrnProductListDatas.some(
        (ele) =>
          ele.ItemCode === GrnItemDetials.ItemCode &&
          ele.BatchNo === GrnItemDetials.BatchNo &&
          +ele.id !== +GrnItemDetials.id
      );
      if (CheckDublicate) {
        dispatchvalue({
          type: "toast",
          value: {
            message: `This item with the same batch number has already been entered.`,
            type: "warn",
          },
        });
      } else {
        if (GrnItemDetials.id) {
          setGrnProductListDatas((prev) =>
            prev.map((product) =>
              +product.id === +GrnItemDetials.id
                ? { ...GrnItemDetials }
                : product
            )
          );
          clearGrnItemsList();
        } else {
          setGrnProductListDatas((prev) => [
            ...prev,
            {
              ...GrnItemDetials,
              id: prev.length + 1,
            },
          ]);

          clearGrnItemsList();
        }
        setGrnSupplierDetials((prev) => ({
          ...prev,
          TotalDiscountMethod: "",
          TotalDiscountType: "",
          TotalDiscount: "",
        }));
      }
    }


  const [pageAccess, setPageAccess] = useState([]);

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
          console.log("ress", ress);
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

  const handlesaveQuickGrn = () => {
    let requiredFields = Object.keys(GrnSupplierDetials).filter(
      (f) =>
        ![
          "IsOldGRN",
          "IsFOCAvailable",
          "pk",
          "TotalDiscountMethod",
          "FileAttachment",
          "ContactNumber",
          "SupplierBillDueDate",
          "ReceivingPersonName",
          "ReceivingPersonName",
          "TPD"
        ].includes(f)
    );

    if (!GrnSupplierDetials.TotalDiscountMethod) {
      requiredFields = requiredFields.filter(
        (f) => !["TotalDiscountType", "TotalDiscount"].includes(f)
      );
    }
    const missingFields = requiredFields.filter((f) => !GrnSupplierDetials[f]);
    if (missingFields.length === 0) {
      if (
        +GrnSupplierDetials.SupplierBillAmount === +GrnSupplierDetials.NetAmount
      ) {
        const senddata = {
          IsQuickGRN: true,
          ...GrnSupplierDetials,
          Created_by: userRecord?.username,
          GrnItemList: GrnProductListDatas,
          IS_Quick_GRN_Approve: pageAccess.IS_Quick_GRN_Approve,
        };
        console.log("senddata---", senddata);

        axios
          .post(`${UrlLink}Inventory/Goods_Reciept_Note_Details_link_Optical`, senddata)
          .then((res) => {
            console.log(res);
            let data = res.data;

            let type = Object.keys(data)[0];
            let mess = Object.values(data)[0];
            const tdata = {
              message: mess,
              type: type,
            };
            dispatchvalue({ type: "toast", value: tdata });
            navigate("/Home/GoodsReceiptNoteOpticalList");
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        const tdata = {
          message: ` Supplier Bill Amount doesnot match with the Net Amount ,cross check the product detials and verify it properly.`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else {
      const tdata = {
        message: `Please fill out all required fields: ${missingFields.join(
          ", "
        )}`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const ChangeMasterdata = () => {
    if (GrnItemDetials.ItemCode === '') {
      const tdata = {
        message: 'ItemName is mandatory',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
    else {
      const mysenddata = {
        SupplierCode: GrnSupplierDetials?.SupplierCode,
        ItemCode: GrnItemDetials?.ItemCode,
        Created_by: userRecord?.username,
        ProductCategory_pk: GrnItemDetials?.ProductCategory_pk,
        SubCategory_pk: GrnItemDetials?.SubCategory_pk,
        ManufacturerName_pk: GrnItemDetials?.ManufacturerName_pk,
        GenericName_pk: GrnItemDetials?.GenericName_pk,
        PackType_pk: GrnItemDetials?.PackType_pk,
        PreviousGST: GrnItemDetials?.PreviousGST,
        PreviousPurchaseRateBeforeGST: GrnItemDetials?.PreviousPurchaseRateBeforeGST,
        PackQuantity: GrnItemDetials?.PackQuantity,
        PreviousMRP: GrnItemDetials?.PreviousMRP,
        PreviousPurchaseRateAfterGST: GrnItemDetials?.PreviousPurchaseRateAfterGST
      }
      const senddata = Object.entries(mysenddata).reduce((acc, [key, value]) => {
        const fieldsToConvert = [
          'SubCategory_pk',
          'ProductCategory_pk',
          'ManufacturerName_pk',
          'ItemCode',
          'ManufacturerName',
          'GenericName_pk',
          'PackType_pk',
          'PreviousGST',
          'PreviousPurchaseRateBeforeGST',
          'PackQuantity',
          'PreviousMRP',
          'PreviousPurchaseRateAfterGST'
        ]

        if (fieldsToConvert.includes(key)) {
          acc[key] = value ? parseInt(value) : null
        } else {
          acc[key] = value
        }

        return acc
      }, {})
      console.log('send data----', senddata);

      axios.post(`${UrlLink}Inventory/UpdateMasterDataQuickGrn`, senddata)
        .then((res) => {
          console.log('11', res.data);
          let resdata = res.data;
          let type = Object.keys(resdata)[0];
          console.log('type----', type)
          let mess = Object.values(resdata)[0];
          console.log('mess', mess)
          const tdata = {
            message: mess,
            type: type,

          };

          dispatchvalue({ type: 'toast', value: tdata });

          if (type === "success") {
            setGrnItemDetials((prev) => ({
              ...prev,
              PurchaseRateWithTax: prev.PreviousPurchaseRateAfterGST,
              MRP: prev.PreviousMRP,
              SellablePrice: prev.PreviousMRP,
              SellableQtyPrice: prev.SellableQtyPrice,
              PurchaseRateTaxable: prev.PreviousPurchaseRateBeforeGST,
              TaxPercentage: prev.PreviousGST
            }));

          }

        })
        .catch((err) => {
          console.log(err);
        })
    }
  };
  const allowedCategoryIds = userRecord.ProductCategory_list.map(item =>
    Number(item.ProductCategoryAccessId)
  );
  console.log('allowedCategoryIds', allowedCategoryIds);

  const filterDataProduct = SupplierProductListData.filter(item =>
    allowedCategoryIds.includes(Number(item.ProductCategory_pk))
  );
  console.log('filterDataProduct', filterDataProduct)

  useEffect(() => {
  setGrnSupplierDetials((pre) => ({
    ...pre,
    SupplierBillAmount: pre.NetAmount // or GrnSupplierDetials.NetAmount
  }));
}, [GrnSupplierDetials.NetAmount]);

useEffect(() => {
  const bill = GrnSupplierDetials.SupplierBillNumber;
  if (!bill) return;

  axios
    .get(
      `${UrlLink}Inventory/SupplierBillNumberCheck?BillNumber=${bill}`,
      { validateStatus: () => true }
    )
    .then((res) => {

      console.log("STATUS:", res.status);
      console.log("DATA:", res.data);

      if (res.data?.warn === true) {
        const ok = window.confirm(res.data.msg);

        if (!ok) {
          setGrnSupplierDetials((prev) => ({
            ...prev,
            SupplierBillNumber: "",
          }));
        }
      }
    });
}, [GrnSupplierDetials.SupplierBillNumber]);

  return (
    <>
      <div className="Main_container_app">
        <h3>Quick Goods Receipt Note</h3>
        
       
        
        <br />
        <div className="RegisFormcon_1">
          {Object.keys(GrnSupplierDetials)
            .filter(
              (p) =>
                ![
                  "Status",
                  "pk",
                  "TotalTaxableAmount",
                  "TotalTaxAmount",
                  "TotalAmount",
                  "TotalDiscountMethod",
                  "TotalDiscountType",
                  "TotalDiscount",
                  "TPD",
                  "FinalTotalTaxableAmount",
                  "FinalTotalTaxAmount",
                  "FinalTotalAmount",
                  "RoundOffAmount",
                  "NetAmount",
                ].includes(p)
            )
            .map((field, Index) => {
              return (
                <div className="RegisForm_1" key={Index + "key"}>
                  <label htmlFor={field}>
                    {field === "GRNDate"
                      ? "GRN Date"
                      : field === "IsFOCAvailable"
                        ? "Is FOC Available"
                        : formatLabel(field)}
                    <span>:</span>
                  </label>

                  {field === "StoreLocation" ? (
                    <select
                      id={field}
                      name={field}
                      value={GrnSupplierDetials[field]}
                      onChange={HandeleOnchange}
                      autoComplete="off"
                    >
                      <option value="">Select</option>
                      {field === "StoreLocation" &&
                        StoreLocationData.map((ele, ind) => (
                          <option key={ind + "key"} value={ele.id}>
                            {ele.StoreName}
                          </option>
                        ))}
                    </select>
                  ) : field === "IsOldGRN" || field === "IsFOCAvailable" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "10px",
                        width: "150px",
                      }}
                    >
                      <label style={{ width: "auto" }} htmlFor={`${field}_yes`}>
                        <input
                          required
                          id={`${field}_yes`}
                          type="radio"
                          name={field}
                          value="Yes"
                          style={{ width: "15px" }}
                          checked={GrnSupplierDetials[field]}
                          onChange={HandeleOnchange}
                          autoComplete="off"
                        />
                        Yes
                      </label>
                      <label style={{ width: "auto" }} htmlFor={`${field}_No`}>
                        <input
                          required
                          id={`${field}_No`}
                          type="radio"
                          name={field}
                          value="No"
                          style={{ width: "15px" }}
                          checked={!GrnSupplierDetials[field]}
                          onChange={HandeleOnchange}
                          autoComplete="off"
                        />
                        No
                      </label>
                    </div>
                  ) : field === "FileAttachment" ? (
                    <>
                      <input
                        type="file"
                        name={field}
                        accept="image/jpeg,image/png,application/pdf"
                        required
                        id={`${field}_Grn`}
                        autoComplete="off"
                        onChange={handlefileOnchange}
                        style={{ display: "none" }}
                      />
                      <div
                        style={{
                          width: "150px",
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <label
                          htmlFor={`${field}_Grn`}
                          className="RegisterForm_1_btns choose_file_update"
                        >
                          <PhotoCameraBackIcon />
                        </label>
                        <button
                          className="fileviewbtn"
                          onClick={() =>
                            Selectedfileview(GrnSupplierDetials.FileAttachment)
                          }
                        >
                          view
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="Search_patient_icons">
                        <input
                          type={
                            [
                              "GRNDate",
                              "SupplierBillDate",
                              "SupplierBillDueDate",
                            ].includes(field)
                              ? "date"
                              : "text"
                          }
                          id={field}
                          list={
                            ["SupplierCode", "SupplierName"].includes(field)
                              ? field + "grn_supplier_list"
                              : null
                          }
                          name={field}
                          autoComplete='off'
                          value={GrnSupplierDetials[field]}
                          onChange={HandeleOnchange}
                          min={
                            field === "SupplierBillDueDate"
                              ? GrnSupplierDetials.SupplierBillDate
                              : ""
                          }
                          max={
                            ["SupplierBillDate", "GRNDate"].includes(field)
                              ? currentDate
                              : ""
                          }
                          disabled={[
                            "SupplierBillDueDate",
                            "GRNDate",
                            "ContactNumber",
                          ]
                            .filter((f) =>
                              GrnSupplierDetials.IsOldGRN
                                ? !["GRNDate", "SupplierBillDueDate"].includes(
                                  f
                                )
                                : f
                            )
                            .includes(field)}
                        />
                        {["SupplierCode", "SupplierName"].includes(field) && (
                          <>
                            <datalist id={field + "grn_supplier_list"}>
                              {field === "SupplierCode" &&
                                SupplierData.map((ele, ind) => (
                                  <option
                                    key={ind + "key"}
                                    value={ele.id}
                                  >{`${ele.SupplierName} | ${ele.ContactNo}`}</option>
                                ))}
                              {field === "SupplierName" &&
                                SupplierData.map((ele, ind) => (
                                  <option
                                    key={ind + "key"}
                                    value={ele.SupplierName}
                                  >{`${ele.id} | ${ele.ContactNo}`}</option>
                                ))}
                            </datalist>
                            <span
                              onClick={(e) => handlesearchsupplierlist(field)}
                            >
                              <ManageSearchIcon />
                            </span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
<br />
<div className="common_center_tag">
  <span>Product Details</span>
</div>
<br />

<div className="RegisFormcon_1">
  {ProductListFormOne
    .filter(field => !['ProductCategory_pk', 'ManufacturerName_pk', 'SubCategory_pk', 'GenericName_pk', 'PackType_pk', 'HSNCode'].includes(field))
    .map((field, Index) => (
      <div className="RegisForm_1" key={Index + "key"}>
        <label htmlFor={field}>
          {formatLabel(field)}
          <span>:</span>
        </label>

        <div className="Search_patient_icons">
          {['ItemCode', 'ItemName'].includes(field) ? (
            <>
              <input
                type="text"
                id={field}
                list={field + "grn_supplier_Product_list"}
                name={field}
                autoComplete="off"
                value={GrnItemDetials[field]}
                onChange={HandeleOnchangeItemDetials}
              />
              <datalist id={field + "grn_supplier_Product_list"}>
                {field === "ItemCode" ? (
                  (filterDataProduct && filterDataProduct.length > 0
                    ? filterDataProduct
                    : SupplierProductListData
                  ).map((ele, ind) => (
                    <option key={ind} value={ele.ItemCode}>
                      {ele.ItemName}
                    </option>
                  ))
                ) : null}

                {field === "ItemName" ? (
                  (filterDataProduct && filterDataProduct.length > 0
                    ? filterDataProduct
                    : SupplierProductListData
                  ).map((ele, ind) => (
                    <option key={ind} value={ele.ItemName}>
                      {ele.ItemCode}
                    </option>
                  ))
                ) : null}
              </datalist>
              <span
                onClick={() =>
                  handlesearchitemslist(
                    "normal",
                    field === "ItemCode" ? "id" : "name"
                  )
                }
              >
                <ManageSearchIcon />
              </span>
            </>
          ) : (
            <input
              type="text"
              id={field}
              name={field}
              disabled={true}
              autoComplete="off"
              value={GrnItemDetials[field]}
              className="disabled-field"
            />
          )}
        </div>
      </div>
    ))}
  <div className="Main_container_Btn">
    <button onClick={ChangeMasterdata}>
      Update
    </button>
  </div>
</div>

        <br />
        {GrnItemDetials.ItemCode && GrnItemDetials.ItemName && (
          <>
            <div className="common_center_tag">
              <span>Product Entry Details</span>
            </div>
            <br />
            <div className="RegisFormcon_1">
              {ProductListFormTwo.filter(field => !["HSNCode"].includes(field)).map((field, indx) => (
                <div className="RegisForm_1" key={indx + "key"}>
                  <label htmlFor={field}>
                    {field === "IsOnlyFOCQty"
                      ? "Is Only FOC Qty"
                      : field === "FOCQuantity"
                        ? "FOC Quantity"
                        : field === "IsMRPAsSellablePrice"
                          ? "Is MRP As Sellable Price"
                          : formatLabel(field)}
                    <span>:</span>
                  </label>
                  {[
                    "IsOnlyFOCQty",
                    "IsMRPAsSellablePrice",
                    "IsManufactureDateAvailable",
                    "IsExpiryDateAvailable",
                  ].includes(field) ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "10px",
                        width: "150px",
                      }}
                    >
                      <label style={{ width: "auto" }} htmlFor={`${field}_yes`}>
                        <input
                          required
                          id={`${field}_yes`}
                          type="radio"
                          name={field}
                          value="Yes"
                          style={{ width: "15px" }}
                          checked={GrnItemDetials[field]}
                          autoComplete="off"
                          onChange={HandeleOnchangeItemDetials}
                          disabled={[
                            "IsManufactureDateAvailable",
                            "IsExpiryDateAvailable",
                          ].includes(field)}
                        />
                        Yes
                      </label>
                      <label style={{ width: "auto" }} htmlFor={`${field}_No`}>
                        <input
                          required
                          id={`${field}_No`}
                          type="radio"
                          name={field}
                          value="No"
                          style={{ width: "15px" }}
                          checked={!GrnItemDetials[field]}
                          onChange={HandeleOnchangeItemDetials}
                          autoComplete="off"
                          disabled={[
                            "IsManufactureDateAvailable",
                            "IsExpiryDateAvailable",
                          ].includes(field)}
                        />
                        No
                      </label>
                    </div>
                  ) : [
                    "TaxType",
                    "TaxPercentage",
                    "DiscountMethod",
                    "DiscountType",
                  ].includes(field) ? (
                    <select
                      id={field}
                      name={field}
                      value={GrnItemDetials[field]}
                      disabled={
                        !GrnItemDetials.DiscountMethod &&
                        field === "DiscountType"
                      }
                      autoComplete="off"
                      onChange={HandeleOnchangeItemDetials}
                    >
                      {["DiscountMethod", "DiscountType"] && (
                        <option value="">Not Applicable</option>
                      )}
                      {field === "TaxType" &&
                        ["GST", "IGST"].map((ele, ind) => (
                          <option key={ind + "key"} value={ele}>
                            {ele}
                          </option>
                        ))}
                      {field === "TaxPercentage" &&
                        ["Nill", "5", "12", "18", "28"].map((ele, ind) => (
                          <option key={ind + "key"} value={ele}>
                            {ele}
                          </option>
                        ))}
                      {field === "DiscountMethod" &&
                        ["BeforeTax", "AfterTax"].map((ele, ind) => (
                          <option key={ind + "key"} value={ele}>
                            {ele}
                          </option>
                        ))}
                      {field === "DiscountType" &&
                        ["Percentage", "Cash"].map((ele, ind) => (
                          <option key={ind + "key"} value={ele}>
                            {ele}
                          </option>
                        ))}
                   
                    </select>
                  ) : (
                    <div className="Search_patient_icons">
                      <input
                        type={
                          ["ManufactureDate", "ExpiryDate"].includes(field)
                            ? "date"
                            : [
                              "PurchaseRateTaxable",
                              "MRP",
                              "ReceivedQty",
                              "FOCQuantity",
                              "Discount",
                            ].includes(field)
                              ? "number"
                              : "text"
                        }
                        id={field}
                        name={field}
                        autoComplete="off"
                        min={field === "ExpiryDate" ? currentDate : ""}
                        max={field === "ManufactureDate" ? currentDate : ""}
                        disabled={
                          [
                            "PurchaseRateWithTax",
                            "TotalReceivedQty",
                            "TotalPackQuantity",
                            "SellableQtyPrice",
                            "TotalPackTaxableAmount",
                            "TotalTaxAmount",
                            "TotalPackAmount",
                            "Discount",
                            "FinalTotalPackTaxableAmount",
                            "FinalTotalTaxAmount",
                            "FinalTotalPackAmount",
                          ]
                            .filter((f) =>
                              GrnItemDetials.DiscountMethod
                                ? f !== "Discount"
                                : f
                            )
                            .includes(field)
                            ? true
                            : GrnItemDetials.IsMRPAsSellablePrice &&
                            field === "SellablePrice" &&
                            true
                        }
                        onKeyDown={
                          [
                            "MRP",
                            "ReceivedQty",
                            "FOCQuantity",
                            "Discount",
                          ].includes(field)
                            ? BlockInvalidcharecternumber
                            : null
                        }
                        value={GrnItemDetials[field]}
                        onChange={HandeleOnchangeItemDetials}
                      />
                    </div>
                    
                  )}

                
                </div>
               
              ))}
                 <>                <div className="RegisForm_1" >
  <label htmlFor="Reason">
    Reason <span>:</span>
  </label>
  <select
    id="Reason"
    name="Reason"
    value={GrnItemDetials.Reason || "OPTICAL"} // product-wise Reason
    onChange={HandeleOnchangeItemDetials} // should update current product
  >
    <option value="">Select Reason</option>
    {["IPPHARMACY", "OPPHARMACY", "KARUNAPHARMACY","OPTICAL"].map((ele, ind) => (
      <option key={ind} value={ele}>{ele}</option>
    ))}
  </select>
</div>
</>
            </div>
            
            <br />
            <div className="Main_container_Btn">
              <button onClick={handleAddGrnProductList}>
                {GrnItemDetials.id ? "Update" : "Add"}
              </button>
            </div>
          </>
        )}
        <br />
        {GrnProductListDatas.length !== 0 && (
          <>
            <ReactGrid
              columns={GrnProductColumns}
              RowData={GrnProductListDatas}
            />
            <br />

        <div className="RegisFormcon_1">
  {Object.keys(GrnSupplierDetials)
    .filter((p) =>
      [
        "TotalTaxableAmount",
        "TotalTaxAmount",
        "TotalAmount",
        "TPD",
        "TotalDiscountMethod",
        "TotalDiscountType",
        "TotalDiscount",
        "FinalTotalTaxableAmount",
        "FinalTotalTaxAmount",
        "FinalTotalAmount",
        "RoundOffAmount", // keep included
        "NetAmount",
      ].includes(p)
    )
    .map((field, index) => (
      <div className="RegisForm_1" key={index + "key"}>
        <label htmlFor={field}>
          {formatLabel(field)}
          <span>:</span>
        </label>

        {["TotalDiscountMethod", "TotalDiscountType"].includes(field) ? (
          <select
            name={field}
            id={field}
            value={GrnSupplierDetials[field]}
            onChange={HandeleOnchange}
            disabled={
              field === "TotalDiscountMethod"
                ? !GrnProductListDatas.some((f) => f.DiscountMethod === "")
                : !GrnSupplierDetials["TotalDiscountMethod"]
            }
          >
            <option value="">Not Applicable</option>
            {field === "TotalDiscountMethod" &&
              ["BeforeTax", "AfterTax"].map((ele, ind) => (
                <option key={ind + "key"} value={ele}>
                  {ele}
                </option>
              ))}
            {field === "TotalDiscountType" &&
              ["Percentage", "Cash"].map((ele, ind) => (
                <option key={ind + "key"} value={ele}>
                  {ele}
                </option>
              ))}
          </select>
        ) : (
          <div style={{ paddingRight: "30px" }}>
            <input
              type={field === "TotalDiscount" ? "number" : "text"}
              name={field}
              id={field}
              disabled={
                field === "RoundOffAmount"
                  ? false // ✅ RoundOffAmount is always editable
                  : field !== "TotalDiscount" && field !== "TPD"
                  ? true
                  : !GrnSupplierDetials["TotalDiscountType"] &&
                    field === "TotalDiscount"
              }
              onKeyDown={
                ["TotalDiscount"].includes(field)
                  ? BlockInvalidcharecternumber
                  : null
              }
              value={GrnSupplierDetials[field]}
              onChange={HandeleOnchange}
            />
          </div>
        )}
      </div>
    ))}
</div>
            <br />
            <div className="Main_container_Btn">
              <button onClick={handlesaveQuickGrn}>
                {GrnSupplierDetials.pk ? "Update GRN" : "Save GRN"}
              </button>
            </div>
          </>
        )}
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />

      <ModelContainer />
    </>
  );
};

export default QuickGoodsRecieptNoteOptical;