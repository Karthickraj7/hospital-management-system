
import React, { useEffect, useState,useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";



const GoodsReceiptNote = () => {
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log('userRecord---', userRecord)
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const navigate = useNavigate();

  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  const [StoreData, setStoreData] = useState([]);


  const POdata = useSelector(
    (state) => state.Inventorydata?.GoodsReceiptNoteList
  );

  const Editdata = useSelector(
    (state) => state.Inventorydata?.GoodsReceiptNoteEdit
  );

  console.log('Editdata', Editdata);

  const [LocationData, setLocationData] = useState([]);

  const [selectRoom2, setselectRoom2] = useState(false);

  const [NewItemProductArray, setNewItemProductArray] = useState([]);
  console.log('NewItemProductArray', NewItemProductArray);

  const [POItemArrays, setPOItemArrays] = useState([]);

  const [GRNItemlist, setGRNItemlist] = useState([]);

  const [SupplierProductArray, setSupplierProductArray] = useState([]);

  const [GenericNameData, setGenericNameData] = useState([])
  const [ManufactureData, setManufactureData] = useState([])
  const [ProductPackType, setProductPackType] = useState([])


  console.log('master---Itemlist----', GenericNameData, ManufactureData, ProductPackType);
  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
  const [GRNState, setGRNState] = useState({
    GRNDate: currentDate,
    PONumber: '',
    SupplierCode: '',
    SupplierName: '',
    SupplierBillNumber: '',
    SupplierBillDate: '',
    SupplierBillDueDate: '',
    SupplierBillAmount: '',
    GRNLocation: 1,
    StorageLocation: allowedStoreId || '',
    ReceivingPersonName: '',
    IsFOCAvailable: false,
  });

  const [SupplierBillfile, setSupplierBillfile] = useState(null);

 // Add TPD to Amountstate
const [Amountstate, setAmountstate] = useState({
  TotalTaxableAmount: '',
  TotalTaxAmount: '',
  TotalAmount: '',
  TotalDiscountMethod: '',
  TotalDiscountType: '',
  TotalDiscount: '',
  TPD: '', // Add TPD here
  FinalTotalTaxableAmount: '',
  FinalTotalTaxAmount: '',
  FinalTotalAmount: '',
  RoundOff: '',
  NetAmount: '',
});

  const [ItemFulldetailes, setItemFulldetailes] = useState({
    AddNewProduct: false,
    ItemCode: '',
    ItemName: '',
    IsSellable: '',
  });


  const [GRNItemState, setGRNItemState] = useState({
    IsOnlyFOCQty: false,
    GRNMRP: '',
    PurchaseRateTaxable: '',
    TaxType: '',
    TaxPercentage: '',
    PurchaseRateWithTax: '',
    OrderQty: '',
    // BillQty not in edit
    BillQty: '',
    ReceivedQty: '',
    PendingQty: '',
    ExtraQty: '',
    IsFOCQtyAvailable: false,
    FOCQty: '',
    TotalPackQty: '',
    IsMRPAsSellablePrice: true,
    SellablePrice: '',
    SellableQtyPrice: '',
    TotalPackTaxableAmount: '',
    TotalTaxAmount: '',
    TotalPackAmount: '',
    BatchNo: '',
    IsManufactureDateAvailable: false,
    ManufactureDate: '',
    IsExpiryDateAvailable: false,
    ExpiryDate: '',
    DiscountMethod: '',
    DiscountType: '',
    Discount: '',
    FinalTotalPackTaxableAmount: '',
    FinalTotalTaxAmount: '',
    FinalTotalPackAmount: '',
    Reason: '', // Add Reason field
  });

  const [POItemChange, setPOItemChange] = useState({
    PONumber: '',
    SupplierName: '',
    POItemId: '',
    ItemCode: '',
    ItemName: '',
    PurchasePack: '',
    OrderQty: '',
    ReceivedQty: '',
    BalanceQty: '',
    CancelQty: '',
    ItemStatus: '',
    Reason: '',
  });

  // ---------------------------------clear fun

  const ClearGRNItemState = () => {
    setGRNItemState({
      IsOnlyFOCQty: false,
      GRNMRP: '',
      PurchaseRateTaxable: '',
      TaxType: '',
      TaxPercentage: '',
      PurchaseRateWithTax: '',
      OrderQty: '',
      BillQty: '',
      ReceivedQty: '',
      PendingQty: '',
      ExtraQty: '',
      IsFOCQtyAvailable: false,
      FOCQty: '',
      TotalPackQty: '',
      IsMRPAsSellablePrice: true,
      SellablePrice: '',
      SellableQtyPrice: '',
      TotalPackTaxableAmount: '',
      TotalTaxAmount: '',
      TotalPackAmount: '',
      BatchNo: '',
      IsManufactureDateAvailable: false,
      ManufactureDate: '',
      IsExpiryDateAvailable: false,
      ExpiryDate: '',
      DiscountMethod: '',
      DiscountType: '',
      Discount: '',
      FinalTotalPackTaxableAmount: '',
      FinalTotalTaxAmount: '',
      FinalTotalPackAmount: '',
        Reason: '', // Add Reason field
    });
  };

  const ClearItemFulldetailes = () => {
    setItemFulldetailes({
      AddNewProduct: false,
      ItemCode: '',
      ItemName: '',
      IsSellable: '',
    });
  };

  const clearRemovedata = () => {
    setPOItemChange({
      PONumber: '',
      SupplierName: '',
      POItemId: '',
      ItemCode: '',
      ItemName: '',
      PurchasePack: '',
      OrderQty: '',
      ReceivedQty: '',
      BalanceQty: '',
      CancelQty: '',
      ItemStatus: '',
      Reason: '',
    });
  };


 // Fix the TPD calculation function
const calculateTotalProductDiscount = useCallback(() => {
  if (!GRNItemlist || GRNItemlist.length === 0) return 0;
  let totalDiscount = 0;
  
  GRNItemlist.forEach(item => {
    if (!item.IsOnlyFOCQty) {
      if (item.Discount && item.DiscountMethod && item.DiscountType) {
        const individualDiscount = parseFloat(item.Discount) || 0;
        
        if (item.DiscountType === "Percentage") {
          // Calculate percentage discount on the appropriate base amount
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
}, [GRNItemlist]);

  useEffect(() => {
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
    const fetchData = async () => {
      if (!ItemFulldetailes?.ProductCategory_pk) return;

      const subCategoryValue = Number(ItemFulldetailes.SubCategory);
      const subCategoryParam = !isNaN(subCategoryValue)
        ? `&SubProductCategory=${subCategoryValue}`
        : (ItemFulldetailes.SubCategory_pk ? `&SubProductCategory=${ItemFulldetailes.SubCategory_pk}` : "");

      const baseParams = `ProductCategory=${ItemFulldetailes.ProductCategory_pk}${subCategoryParam}`;

      try {
        const [genericRes, manufacturerRes, packTypeRes] = await Promise.all([
          axios.get(`${UrlLink}Masters/GenericName_by_Product_SubProduct?${baseParams}`),
          axios.get(`${UrlLink}Masters/CompanyName_by_Product_SubProduct?${baseParams}`),
          axios.get(`${UrlLink}Masters/PackType_by_Product_SubProduct?${baseParams}`),
        ]);

        setGenericNameData(genericRes.data);
        setManufactureData(manufacturerRes.data);
        setProductPackType(packTypeRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setGenericNameData([]);
        setManufactureData([]);
        setProductPackType([]);
      }
    };

    fetchData();
  }, [UrlLink, ItemFulldetailes]);







  const [SubCategory, setSubCategory] = useState([])
  console.log('SubCategory', SubCategory);

  useEffect(() => {
    const fetchSubCategory = async () => {
      if (
        ItemFulldetailes?.ProductCategory_pk
      ) {
        try {
          const { data } = await axios.get(
            `${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${ItemFulldetailes.ProductCategory_pk}`
          );
          setSubCategory(data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setSubCategory([]);
        }
      }
    };

    fetchSubCategory();
  }, [UrlLink, ItemFulldetailes]);

  // ------------------------Total Amount-------------------

// Update the main amount calculation useEffect
useEffect(() => {
  if (GRNItemlist && GRNItemlist.length !== 0) {
    let STotalTaxableAmount = 0;
    let STotalTaxAmount = 0;
    let STotalAmount = 0;

    GRNItemlist.forEach((item) => {
      STotalTaxableAmount += +item.FinalTotalPackTaxableAmount;
      STotalTaxAmount += +item.FinalTotalTaxAmount;
      STotalAmount += +item.FinalTotalPackAmount;
    });

    // Calculate TPD
    const totalProductDiscount = calculateTotalProductDiscount();

    const OneConv1 = Math.round(STotalAmount).toFixed(2);
    const SecConv1 = OneConv1 - STotalAmount;

    setAmountstate((prev) => ({
      ...prev,
      TotalTaxableAmount: STotalTaxableAmount.toFixed(2),
      TotalTaxAmount: STotalTaxAmount.toFixed(2),
      TotalAmount: STotalAmount.toFixed(2),
      TPD: totalProductDiscount, // Add TPD here
      FinalTotalTaxableAmount: STotalTaxableAmount.toFixed(2),
      FinalTotalTaxAmount: STotalTaxAmount.toFixed(2),
      FinalTotalAmount: STotalAmount.toFixed(2),
      RoundOff: SecConv1.toFixed(2),
      NetAmount: OneConv1,
    }));
  } else {
    setAmountstate({
      TotalTaxableAmount: '',
      TotalTaxAmount: '',
      TotalAmount: '',
      TotalDiscountMethod: '',
      TotalDiscountType: '',
      TotalDiscount: '',
      TPD: '', // Reset TPD
      FinalTotalTaxableAmount: '',
      FinalTotalTaxAmount: '',
      FinalTotalAmount: '',
      RoundOff: '',
      NetAmount: '',
    });
  }
}, [GRNItemlist, calculateTotalProductDiscount]);

// Update the discount calculation useEffect to include TPD
useEffect(() => {
  if (GRNItemlist.length !== 0 && Amountstate.TotalAmount !== '') {
    // Calculate TPD for this effect too
    const totalProductDiscount = calculateTotalProductDiscount();
    
    let checkdis = GRNItemlist?.some((ele) => +ele.Discount !== 0);

    if (
      checkdis &&
      Amountstate.TotalDiscountMethod !== '' &&
      Amountstate.TotalDiscount !== ''
    ) {
      // ... existing discount calculation code remains the same ...
      
      // Make sure to include TPD in the final state update
      setAmountstate((prev) => ({
        ...prev,
        TPD: totalProductDiscount,
        // ... other fields
      }));
    } else {
      const OneConv1 = Math.round(+Amountstate.TotalAmount).toFixed(2);
      const SecConv1 = OneConv1 - +Amountstate.TotalAmount;

      setAmountstate((prev) => ({
        ...prev,
        TPD: totalProductDiscount, // Include TPD here too
        FinalTotalTaxableAmount: Amountstate.TotalTaxableAmount,
        FinalTotalTaxAmount: Amountstate.TotalTaxAmount,
        FinalTotalAmount: Amountstate.TotalAmount,
        RoundOff: SecConv1.toFixed(2),
        NetAmount: OneConv1,
      }));
    }
  }
}, [
  Amountstate.TotalDiscount,
  Amountstate.TotalDiscountMethod,
  Amountstate.TotalDiscountType,
  Amountstate.TotalAmount,
  GRNItemlist,
  calculateTotalProductDiscount
]);

  // ------------------------------------------------------

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const getInputType = (name) => {
    if (['GRNDate', 'SupplierBillDate', 'SupplierBillDueDate'].includes(name))
      return 'date';
    if (['SupplierBillAmount'].includes(name)) return 'number';
    return 'text';
  };

  // -------------------------useEffect LOcation datas

  useEffect(() => {
    if (GRNState.GRNLocation && GRNState.GRNLocation !== '') {
      console.log('----????', GRNState.GRNLocation);

      axios
        .get(
          `${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${GRNState.GRNLocation}`
        )
        .then((res) => {
          const ress = res.data;
          // console.log('vvvv',res.data);

          setStoreData(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [GRNState.GRNLocation]);

  useEffect(() => {
    if (
      ItemFulldetailes.AddNewProduct &&
      GRNState.SupplierCode !== '' &&
      POItemArrays.length !== 0
    ) {

      const POitems = []

      axios
        .get(
          `${UrlLink}Inventory/PO_SupplierWise_product_Get?SupplierId=${GRNState.SupplierCode}&POitems=${POitems}`
        )
        .then((res) => {
          let data = res.data;

          if (Array.isArray(data) && data.length !== 0) {
            // console.log(data,'---++---');

            setNewItemProductArray(data);
          } else {
            setNewItemProductArray([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, GRNState, POItemArrays, ItemFulldetailes]);

  useEffect(() => {
    if (GRNState.SupplierCode !== '') {
      axios
        .get(
          `${UrlLink}Inventory/PO_SupplierWise_product_Get?SupplierId=${GRNState.SupplierCode}&SupplierTwo=${true}`
        )
        .then((res) => {
          let data = res.data;

          // console.log('345098',data);

          if (Array.isArray(data) && data.length !== 0) {
            // console.log(data,'---QQQQQQ111---');

            setSupplierProductArray(data);
          } else {
            setSupplierProductArray([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, GRNState.SupplierCode]);

  // ----------------------------PO Item Data Grit AND  in useEffect

  const HandelEditdata = (row) => {
    console.log('1111-vvvvvv', row);

    const {
      id,
      Item_Status,
      Reason,
      Received_Qty,
      Balance_Qty,
      ItemCode,
      ItemName,
      Is_Manufacture_Date_Available,
      Is_Expiry_Date_Available,
      GenericName_pk,
      ManufacturerName_pk,
      SubCategory_pk,
      PackType_pk,
      ...rest
    } = row;

    setItemFulldetailes({
      AddNewProduct: false,
      ItemCode: ItemCode || '',
      ItemName: ItemName || '',
      ...rest,
      GenericName: GenericName_pk || '',
      ManufacturerName: ManufacturerName_pk || '',
      PackType: PackType_pk || '',
      SubCategory: SubCategory_pk || '',
    });

    setGRNItemState((prev) => ({
      ...prev,
      IsOnlyFOCQty: false,
      GRNMRP: rest.MRP || '',
      PurchaseRateTaxable: rest.PurchaseRateBeforeGST || '',
      TaxPercentage: rest.GST === 'Nill' ? 0 : rest.GST,
      PurchaseRateWithTax: rest.PurchaseRateAfterGST || '',
      OrderQty: rest.PurchaseQty || '',
      BillQty: Balance_Qty || '',
      IsManufactureDateAvailable: Is_Manufacture_Date_Available || false,
      IsExpiryDateAvailable: Is_Expiry_Date_Available || false,
    }));
  };

  const HandelDeletePOdata = (row) => {


    setselectRoom2(true);

    setPOItemChange((prev) => ({
      ...prev,
      PONumber: GRNState.PONumber,
      SupplierName: GRNState.SupplierName,
      POItemId: row.id,
      ItemCode: row.ItemCode,
      ItemName: row.ItemName,
      PurchasePack: row.PackType,
      OrderQty: row.PurchaseQty,
      BalanceQty: row.Balance_Qty,
      ReceivedQty: row.Received_Qty,
      CancelQty: row.Balance_Qty,
    }));
  };

  const PoItemcolumn = [
    {
      key: 'id',
      name: 'PO Item Id',
      frozen: true,
    },
    // {
    //   key: 'ItemCode',
    //   name: 'Item Code',
    //   frozen: true,
    // },
    {
      key: 'ItemName',
      name: 'Item Name',
      frozen: true,
    },
    {
      key: 'ProductCategory',
      name: 'Product Category',
      frozen: true,
    },
    {
      key: 'SubCategory',
      name: 'Sub Category',
      frozen: true,
    },
    {
      key: 'GenericName',
      name: 'Generic Name',
    },
    {
      key: 'ManufacturerName',
      name: 'Manufacturer Name',
    },
    // {
    //   key: 'HSNCode',
    //   name: 'HSN Code',
    // },
    {
      key: 'Strength',
      name: 'Strength',
    },
    {
      key: 'StrengthType',
      name: 'StrengthType',
    },
    {
      key: 'Volume',
      name: 'Volume',
    },
    {
      key: 'VolumeType',
      name: 'Volume Type',
    },
    {
      key: 'PackType',
      name: 'Pack Type',
    },
    {
      key: 'PackQty',
      name: 'Pack Qty',
    },
    {
      key: 'PurchaseQty',
      name: 'Purchase Qty',
    },
    {
      key: 'Received_Qty',
      name: 'Received Qty',
    },
    {
      key: 'Balance_Qty',
      name: 'Balance Qty',
    },
    {
      key: 'Reason',
      name: 'Reason',
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) =>
        +params.row.Balance_Qty === 0 ? (
          <>No Action</>
        ) : (
          <div style={{ display: 'flex' }}>
            <Button
              className="cell_btn"
              onClick={() => HandelEditdata(params.row)}
            >
              <EditIcon className="check_box_clrr_cancell" />
            </Button>

            <Button
              className="cell_btn"
              onClick={() => HandelDeletePOdata(params.row)}
            >
              <DeleteOutlineIcon className="check_box_clrr_cancell" />
            </Button>
          </div>
        ),
    },
  ];

  // -------------------File Onchange and viwe

  const handlefileOnchange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      let formattedValue = files[0];

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ''
      ) {
        const tdata = {
          message: 'Invalid file type. Please upload a PDF, JPEG, or PNG file.',
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      } else {
        if (formattedValue.size > maxSize) {
          const tdata = {
            message: 'File size exceeds the limit of 5MB.',
            type: 'warn',
          };
          dispatchvalue({ type: 'toast', value: tdata });
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setSupplierBillfile(reader.result);
          };
          reader.readAsDataURL(formattedValue);
        }
      }
    } else {
      const tdata = {
        message: 'No file selected. Please choose a file to upload.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  const Selectedfileview = (fileval) => {
    // console.log('fileval',fileval);

    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: 'image/jpg',
      };
      if (
        ['data:image/jpeg;base64', 'data:image/jpg;base64'].includes(
          fileval?.split(',')[0]
        )
      ) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: 'image/jpeg',
        };
      } else if (fileval?.split(',')[0] === 'data:image/png;base64') {
        tdata = {
          Isopen: true,
          content: fileval,
          type: 'image/png',
        };
      } else if (fileval?.split(',')[0] === 'data:application/pdf;base64') {
        tdata = {
          Isopen: true,
          content: fileval,
          type: 'application/pdf',
        };
      }

      dispatchvalue({ type: 'modelcon', value: tdata });
    } else {
      const tdata = {
        message: 'There is no file to view.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  // -----------------GRN Edit --------------------------------

 useEffect(() => {
  if (
    Editdata &&
    Object.keys(Editdata).length !== 0 &&
    Object.keys(POdata).length === 0
  ) {
    axios
      .get(
        `${UrlLink}Inventory/PO_Goods_Reciept_Note_GET_Details_link?GRN_Number=${Editdata.GRN_Number}`
      )
      .then((res) => {
        console.log(res.data, '{{{{{{{{');

        let getdata = res.data;

          setGRNState({
            GRNNumber: getdata?.id,
            GRNDate: getdata?.GrnDate,
            PONumber: getdata?.Purchase_order_Detials,
            SupplierCode: getdata?.SupplierCode,
            SupplierName: getdata?.SupplierName,
            SupplierBillNumber: getdata?.Supplier_Bill_Number,
            SupplierBillDate: getdata?.Supplier_Bill_Date,
            SupplierBillDueDate: getdata?.Supplier_Bill_Due_Date,
            SupplierBillAmount: getdata?.Supplier_Bill_Amount,
            GRNLocation: getdata?.GRNLocation || 1,
            StorageLocation: getdata?.Store_location_pk,
            ReceivingPersonName: getdata?.Received_person,
            IsFOCAvailable: getdata?.Is_Foc_Available,
          });

           setSupplierBillfile(getdata?.FileAttachment);

        setAmountstate({
          TotalTaxableAmount: +getdata?.Taxable_Amount,
          TotalTaxAmount: +getdata?.Tax_Amount,
          TotalAmount: +getdata?.Total_Amount,
          TotalDiscountMethod: getdata?.Total_Discount_Method,
          TotalDiscountType: getdata?.Total_Discount_Type,
          TotalDiscount: +getdata?.Discount_Amount,
          TPD: +getdata?.TPD || 0, // Add TPD from API if available
          FinalTotalTaxableAmount: +getdata?.Final_Taxable_Amount,
          FinalTotalTaxAmount: +getdata?.Final_Tax_Amount,
          FinalTotalAmount: +getdata?.Final_Total_Amount,
          RoundOff: +getdata?.Round_off_Amount,
          NetAmount: +getdata?.Net_Amount,
        });
          setGRNItemlist(getdata?.GRN_Items);

          console.log('PO_Items', getdata.PO_Items);

          setPOItemArrays(getdata?.PO_Items);
        })
        .catch((err) => {
          console.log(err);
        });

      //   console.log('??/',Editdata.Final_Tax_Amount);
    }
  }, [POdata, Editdata]);

  // -----------------------GRN Head Detailes----------------

  useEffect(() => {
    if (
      POdata &&
      Object.keys(POdata).length !== 0 &&
      Object.keys(Editdata).length === 0
    ) {
      console.log('POdata----', POdata);

      axios
        .get(
          `${UrlLink}Inventory/Supplier_Master_Link?SupplierId=${POdata.SupplierId}`
        )
        .then((res) => {
          // console.log('pppp',res.data);
          let Objdata = res.data;

          if (Objdata) {
            const paymentTermsDays = Objdata.PaymentTerms;
            const supplierBillDate = new Date(GRNState.GRNDate);
            const dueDate = new Date(supplierBillDate);
            dueDate.setDate(supplierBillDate.getDate() + paymentTermsDays);

            const formattedDueDate = dueDate.toISOString().split('T')[0];

            setGRNState((prev) => ({
              ...prev,
              PONumber: POdata.id,
              SupplierCode: POdata.SupplierId,
              SupplierName: POdata.SupplierName,
              SupplierBillDueDate: formattedDueDate,
              GRNLocation: POdata.ShippingLocation || 1,
            }));
          }
          // console.log(POdata.Item_Details,'oooo9999999');

          if (POdata.Item_Details.length !== 0) {
            setPOItemArrays(POdata.Item_Details);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [POdata, Editdata]);

  const HandeleOnchange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'SupplierBillNumber') {
      setGRNState((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    } else if (name === 'SupplierBillDate') {
      setGRNState((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === 'IsFOCAvailable') {
      setGRNState((prev) => ({
        ...prev,
        [name]: value === 'Yes',
      }));
    } else {
      setGRNState((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };


  const HandeleOnchangePOItem = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('name-------', name);

    const parseFloatOrZero = (val) => parseFloat(val || 0);
    if (name === 'AddNewProduct') {
      setItemFulldetailes({
        [name]: value === 'Yes',
        ItemCode: '',
        ItemName: '',
        IsSellable: '',
      });
    } else if (name === 'IsSellable') {
      setItemFulldetailes((prev) => ({
        ...prev,
        [name]: value === 'Yes',
      }));
    }

    else if (name === 'ItemCode' || name === 'ItemName') {
      let find = name === 'ItemCode'
        ? NewItemProductArray.find((ele) => '' + ele.ItemCode === '' + value)
        : NewItemProductArray.find((ele) => ele.ItemName === value);

      if (find) {
        let {
          ItemCode,
          ItemName,
          Is_Manufacture_Date_Available,
          Is_Expiry_Date_Available,
          GenericName_pk,
          ManufacturerName_pk,
          PackType_pk,
          ...rest
        } = find;

        setItemFulldetailes({
          AddNewProduct: true,
          ItemCode: ItemCode || '',
          ItemName: ItemName || '',
          [name]: value,
          ...rest,
          GenericName: GenericName_pk || '',
          ManufacturerName: ManufacturerName_pk || '',
          PackType: PackType_pk || '',
        });

        setGRNItemState((prev) => ({
          ...prev,
          GRNMRP: rest.MRP || '',
          PurchaseRateTaxable: rest.PurchaseRateBeforeGST || '',
          TaxPercentage: rest.GST || '',
          PurchaseRateWithTax: rest.PurchaseRateAfterGST || '',
          IsManufactureDateAvailable: Is_Manufacture_Date_Available || false,
          IsExpiryDateAvailable: Is_Expiry_Date_Available || false,
        }));
      } else {
        setItemFulldetailes({
          AddNewProduct: true,
          ItemCode: name === 'ItemCode' ? value : '',
          ItemName: name === 'ItemName' ? value : '',
        });
      }
    }

    // Step 3: GST, PackQty, PurchaseQty affect calculations
    else if (
      ['GST', 'PackQty', 'PurchaseQty', 'PurchaseRateBeforeGST'].includes(name)
    ) {
      setItemFulldetailes((prev) => {
        const updated = {
          ...prev,
          [name]: value,
        };

        const gst = parseFloatOrZero(updated.GST);
        const baseRate = parseFloatOrZero(updated.PurchaseRateBeforeGST);
        const purchaseQty = parseFloatOrZero(updated.PurchaseQty);

        const gstAmount = (gst / 100) * baseRate;
        const PurchaseRateAfterGST = +(baseRate + gstAmount).toFixed(2);
        const TotalAmount = +(PurchaseRateAfterGST * purchaseQty).toFixed(2);

        return {
          ...updated,
          PurchaseRateAfterGST,
          TotalAmount,
        };
      });
    }

    // Step 4: Manual override of MRP or PurchaseRateAfterGST
    else if (name === 'MRP' || name === 'PurchaseRateAfterGST') {
      setItemFulldetailes((prev) => {
        const updated = {
          ...prev,
          [name]: value,
        };

        const rate = name === 'PurchaseRateAfterGST'
          ? parseFloatOrZero(value)
          : parseFloatOrZero(prev.PurchaseRateAfterGST);

        const qty = parseFloatOrZero(prev.PurchaseQty);
        const TotalAmount = +(rate * qty).toFixed(2);

        return {
          ...updated,
          TotalAmount,
        };
      });
    }

    // Step 5: All other fields
    else {
      setItemFulldetailes((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };


  // ------------------------Item Entry Detailes

  const HandelItemstate = (e) => {
    const { name, value, type, checked } = e.target;


    if (name === 'Reason') {
    setGRNItemState((prev) => ({
      ...prev,
      [name]: value,
    }));
    return;
  }
    if (name === 'ReceivedQty') {
      if (
        !GRNItemState.ExtraQty &&
        +GRNItemState.BillQty < +value &&
        !ItemFulldetailes.AddNewProduct
      ) {
        const ExtraReciveQty = window.confirm(
          'Are you sure you want to receive a quantity greater than the ordered quantity? Confirm to proceed with this quantity.'
        );

        if (!ExtraReciveQty) {
          return;
        }
      }

      // console.log(+GRNItemState.BillQty < +value,+GRNItemState.BillQty,+value,'eeeee12345');

      const PendQty = !ItemFulldetailes.AddNewProduct
        ? +GRNItemState.BillQty < +value
          ? ''
          : +GRNItemState.BillQty - +value
        : '';

      const ExtQty = !ItemFulldetailes.AddNewProduct
        ? +GRNItemState.BillQty < +value
          ? +value - +GRNItemState.BillQty
          : ''
        : '';

      const TotalQty = +ItemFulldetailes.PackQty * +value;

      const MRP_condition =
        ItemFulldetailes.IsSellable === 'Yes'
          ? (+GRNItemState.GRNMRP).toFixed(2)
          : '';

      const TotaQtyMrp =
        +ItemFulldetailes.PackQty === +ItemFulldetailes.LeastSellableUnit
          ? +GRNItemState.GRNMRP
          : +GRNItemState.GRNMRP / +ItemFulldetailes.PackQty;

      const Total_Qty_MRP_condition =
        ItemFulldetailes.IsSellable === 'Yes' ? TotaQtyMrp.toFixed(2) : '';

      const TotalPackTaxableAmount = GRNItemState.PurchaseRateTaxable * +value;
      const TaxAmount =
        TotalPackTaxableAmount * (GRNItemState.TaxPercentage / 100);
      const TotalPackAmount = GRNItemState.PurchaseRateWithTax * +value;

      setGRNItemState((prev) => ({
        ...prev,
        [name]: value,
        PendingQty: value ? PendQty : '',
        ExtraQty: value ? ExtQty : '',
        IsFOCQtyAvailable: false,
        FOCQty: '',
        TotalPackQty: value ? TotalQty : '',
        SellablePrice: value ? MRP_condition : '',
        SellableQtyPrice: value ? Total_Qty_MRP_condition : '',
        TotalPackTaxableAmount: value ? TotalPackTaxableAmount.toFixed(2) : '',
        TotalTaxAmount: value ? TaxAmount.toFixed(2) : '',
        TotalPackAmount: value ? TotalPackAmount.toFixed(2) : '',
        FinalTotalPackTaxableAmount: value
          ? TotalPackTaxableAmount.toFixed(2)
          : '',
        FinalTotalTaxAmount: value ? TaxAmount.toFixed(2) : '',
        FinalTotalPackAmount: value ? TotalPackAmount.toFixed(2) : '',
      }));

      return;
    }

    if (name === 'GRNMRP') {
      const SellableQtyPrice =
        +ItemFulldetailes.PackQty === +ItemFulldetailes.LeastSellableUnit
          ? +value || ''
          : value
            ? (+value / +ItemFulldetailes.PackQty).toFixed(2)
            : '';

      const MRP_condition =
        ItemFulldetailes.IsSellable === 'Yes' ? +value.toFixed(2) : '';

      const Total_Qty_MRP_condition =
        ItemFulldetailes.IsSellable === 'Yes'
          ? SellableQtyPrice.toFixed(2)
          : '';

      setGRNItemState((prev) => ({
        ...prev,
        [name]: value,
        SellablePrice: MRP_condition,
        SellableQtyPrice: Total_Qty_MRP_condition,
      }));

      return;
    }

    if (name === 'PurchaseRateTaxable') {
      setGRNItemState((prev) => ({
        ...prev,
        [name]: value,
        TaxType: '',
        TaxPercentage: '',
        PurchaseRateWithTax: '',
        ReceivedQty: '',
        PendingQty: '',
        ExtraQty: '',
        TotalPackQty: '',
        TotalPackTaxableAmount: '',
        TotalTaxAmount: '',
        TotalPackAmount: '',
        DiscountMethod: '',
        DiscountType: '',
        Discount: '',
        FinalTotalPackTaxableAmount: '',
        FinalTotalTaxAmount: '',
        FinalTotalPackAmount: '',
      }));

      return;
    }

    if (name === 'TaxPercentage') {
      const TaxAmount = +GRNItemState.PurchaseRateTaxable * (+value / 100);
      const TotalPackAmount = +GRNItemState.PurchaseRateTaxable + TaxAmount;

      setGRNItemState((prev) => ({
        ...prev,
        [name]: value,
        PurchaseRateWithTax: TotalPackAmount.toFixed(2),
        ReceivedQty: '',
        PendingQty: '',
        ExtraQty: '',
        TotalPackQty: '',
        TotalPackTaxableAmount: '',
        TotalTaxAmount: '',
        TotalPackAmount: '',
        DiscountMethod: '',
        DiscountType: '',
        Discount: '',
        FinalTotalPackTaxableAmount: '',
        FinalTotalTaxAmount: '',
        FinalTotalPackAmount: '',
      }));

      return;
    }

    if (name === 'BatchNo') {
      setGRNItemState((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));

      return;
    }

    if (name === 'DiscountMethod') {
      setGRNItemState((prev) => ({
        ...prev,
        [name]: value,
        DiscountType: '',
        Discount: '',
        FinalTotalPackTaxableAmount: +GRNItemState.TotalPackTaxableAmount || '',
        FinalTotalTaxAmount: +GRNItemState.TotalTaxAmount || '',
        FinalTotalPackAmount: +GRNItemState.TotalPackAmount || '',
      }));

      return;
    }

    if (name === 'DiscountType') {
      setGRNItemState((prev) => ({
        ...prev,
        [name]: value,
        Discount: '',
        FinalTotalPackTaxableAmount: +GRNItemState.TotalPackTaxableAmount || '',
        FinalTotalTaxAmount: +GRNItemState.TotalTaxAmount || '',
        FinalTotalPackAmount: +GRNItemState.TotalPackAmount || '',
      }));

      return;
    }

    if (name === 'Discount') {
      if (GRNItemState.DiscountMethod === 'BeforeTax') {
        let TotalPackAm = +GRNItemState.TotalPackTaxableAmount;

        if (GRNItemState.DiscountType === 'Cash') {
          TotalPackAm -= +value;
        } else if (GRNItemState.DiscountType === 'Percentage') {
          TotalPackAm -= TotalPackAm * (+value / 100);
        }

        const TaxAmount = TotalPackAm * (GRNItemState.TaxPercentage / 100);
        const TotalPackAmount = TotalPackAm + TaxAmount;

        setGRNItemState((prev) => ({
          ...prev,
          [name]: value,
          FinalTotalPackTaxableAmount: TotalPackAm.toFixed(2) || '',
          FinalTotalTaxAmount: TaxAmount.toFixed(2) || '',
          FinalTotalPackAmount: TotalPackAmount.toFixed(2) || '',
        }));
      } else if (GRNItemState.DiscountMethod === 'AfterTax') {
        let TotalPackAm = +GRNItemState.TotalPackAmount;

        if (GRNItemState.DiscountType === 'Cash') {
          TotalPackAm -= +value;
        } else if (GRNItemState.DiscountType === 'Percentage') {
          TotalPackAm -= TotalPackAm * (+value / 100);
        }

        setGRNItemState((prev) => ({
          ...prev,
          [name]: value,
          FinalTotalPackTaxableAmount:
            +GRNItemState.TotalPackTaxableAmount || '',
          FinalTotalTaxAmount: +GRNItemState.TotalTaxAmount || '',
          FinalTotalPackAmount: TotalPackAm.toFixed(2) || '',
        }));
      }

      return;
    }

    if (name === 'IsOnlyFOCQty') {

      if (value === 'Yes') {

        setGRNItemState((prev) => ({
          ...prev,
          [name]: value === 'Yes',
          FOCQty: '',
          PurchaseRateTaxable: '',
          TaxType: '',
          TaxPercentage: '',
          PurchaseRateWithTax: '',
          OrderQty: '',
          BillQty: '',
          ReceivedQty: '',
        }));

      }
      else {

        setGRNItemState((prev) => ({
          ...prev,
          [name]: value === 'Yes',
          FOCQty: '',
          TaxType: '',
          OrderQty: '',
          BillQty: '',
          ReceivedQty: '',
          PurchaseRateTaxable: GRNItemState?.PurchaseRateBeforeGST,
          TaxPercentage: GRNItemState?.GST,
          PurchaseRateWithTax: GRNItemState?.PurchaseRateAfterGST,
          MRP: GRNItemState?.MRP,
        }));

      }



      return;
    }


    if (name === 'IsFOCQtyAvailable') {
      let TotalQty = +ItemFulldetailes.PackQty * +GRNItemState.ReceivedQty;

      setGRNItemState((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        FOCQty: '',
        TotalPackQty: TotalQty,
      }));

      return;
    }

    if (name === 'IsMRPAsSellablePrice') {
      const TotaQtyMrp =
        +ItemFulldetailes.PackQty === +ItemFulldetailes.LeastSellableUnit
          ? +GRNItemState.GRNMRP
          : +GRNItemState.GRNMRP / +ItemFulldetailes.PackQty;

      setGRNItemState((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        SellablePrice: (+GRNItemState.GRNMRP).toFixed(2) || '',
        SellableQtyPrice: TotaQtyMrp.toFixed(2),
      }));
      return;
    }

    if (name === 'FOCQty') {

      const SellableQtyPrice =
        +ItemFulldetailes.PackQty === +ItemFulldetailes.LeastSellableUnit
          ? +GRNItemState.GRNMRP || ''
          : GRNItemState.GRNMRP
            ? (+GRNItemState.GRNMRP / +ItemFulldetailes.PackQty)
            : '';

      const MRP_condition =
        ItemFulldetailes.IsSellable === 'Yes' ? +GRNItemState.GRNMRP : '';

      const Total_Qty_MRP_condition =
        ItemFulldetailes.IsSellable === 'Yes'
          ? +SellableQtyPrice
          : '';


      const TotalQty = value
        ? +ItemFulldetailes.PackQty * (+GRNItemState.ReceivedQty + +value)
        : +ItemFulldetailes.PackQty * +GRNItemState.ReceivedQty;

      setGRNItemState((prev) => ({
        ...prev,
        [name]: value,
        TotalPackQty: TotalQty,
        SellablePrice: +MRP_condition,
        SellableQtyPrice: +Total_Qty_MRP_condition,
      }));

      return;
    }

    if (name === 'SellablePrice') {
      const TotaQtyMrp =
        +ItemFulldetailes.PackQty === +ItemFulldetailes.LeastSellableUnit
          ? +value
          : +value / +ItemFulldetailes.PackQty;

      setGRNItemState((prev) => ({
        ...prev,
        [name]: value,
        SellableQtyPrice: TotaQtyMrp.toFixed(2),
      }));

      return;
    }

    setGRNItemState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // --------------------------------------------------------------

  const handelonAdd = () => {
    let requiredFields = [
      'GRNMRP',
      'PurchaseRateTaxable',
      'PurchaseRateWithTax',
      'ReceivedQty',
      'TotalPackQty',
      'TotalPackTaxableAmount',
      'TotalTaxAmount',
      'TotalPackAmount',
      'BatchNo',
    ];

    if (+GRNItemState.TaxPercentage !== 0) {
      requiredFields.push('TaxType', 'TaxPercentage');
    }

    if (
      GRNItemState.IsOnlyFOCQty
    ) {
      requiredFields = requiredFields.filter((ele) =>
        ['BatchNo', 'TotalPackQty'].includes(ele)
      );
    }

    if (GRNItemState.IsManufactureDateAvailable)
      requiredFields.push('ManufactureDate');

    if (GRNItemState.IsExpiryDateAvailable) requiredFields.push('ExpiryDate');

    if (GRNItemState.IsFOCQtyAvailable) requiredFields.push('FOCQty');

    if (!GRNItemState.IsOnlyFOCQty && ItemFulldetailes.IsSellable === 'Yes')
      requiredFields.push('SellableQtyPrice');

    let GRNItemStateFields = requiredFields.filter(
      (field) => !GRNItemState[field]
    );

    if (GRNItemStateFields.length !== 0) {
      dispatchvalue({
        type: 'toast',
        value: {
          message: `Please fill out all required fields: ${GRNItemStateFields.join(', ')}`,
          type: 'warn',
        },
      });
    } else {
      const CheckDublicate = GRNItemlist.some(
        (ele) =>
          ele.ItemCode === GRNItemState.ItemCode &&
          ele.BatchNo === GRNItemState.BatchNo &&
          +ele.id !== +GRNItemState.id
      );

      if (CheckDublicate) {
        dispatchvalue({
          type: 'toast',
          value: {
            message: `This item with the same batch number has already been entered.`,
            type: 'warn',
          },
        });
      } else {
        const AdditemFun = () => {
          // console.log('checking--log---',GRNItemState.ReceivedQty,GRNItemState.PendingQty,typeof(GRNItemState.PendingQty));
          let updatedPoItemlist = POItemArrays

          if (!GRNItemState.IsOnlyFOCQty) {
            updatedPoItemlist = POItemArrays.map((ele) => {
              if ('' + ele.ItemCode === '' + ItemFulldetailes.ItemCode) {
                // console.log(ele.ItemCode,ele.ItemName,'eeekkkkkkeee');
                if (+GRNItemState.BillQty < +GRNItemState.ReceivedQty) {
                  return {
                    ...ele,
                    Received_Qty: +ele.Received_Qty + +GRNItemState.ReceivedQty,
                    Balance_Qty: +GRNItemState.PendingQty,
                  };
                } else {
                  return {
                    ...ele,
                    Received_Qty: +ele.PurchaseQty - +GRNItemState.PendingQty,
                    Balance_Qty: +GRNItemState.PendingQty,
                  };
                }
              }
              return ele;
            });

          }

     

          if (GRNItemState.id) {
            setPOItemArrays(updatedPoItemlist);

            setGRNItemlist((prev) =>
              prev.map((product) =>
                +product.id === +GRNItemState.id
                  ? {
                    AddNewProduct: ItemFulldetailes.AddNewProduct,
                    ItemCode: ItemFulldetailes.ItemCode,
                    ItemName: ItemFulldetailes.ItemName,
                    ...GRNItemState,
                  }
                  : product
              )
            );
            ClearGRNItemState();
          } else {
          
            setPOItemArrays(updatedPoItemlist);

            setGRNItemlist((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                AddNewProduct: ItemFulldetailes.AddNewProduct,
                ItemCode: ItemFulldetailes.ItemCode,
                ItemName: ItemFulldetailes.ItemName,
                ...GRNItemState,
              },
            ]);

            ClearGRNItemState();

            ClearItemFulldetailes();
          }

          setAmountstate((prev) => ({
            ...prev,
            TotalDiscountMethod: '',
            TotalDiscountType: '',
            TotalDiscount: '',
          }));
        };

        // console.log('000---0000',GRNItemState.PendingQty,typeof(GRNItemState.PendingQty))

        if (GRNItemState.PendingQty) {
          let confirmCon = window.confirm(
            `Are you sure pending Qty is ${GRNItemState.PendingQty} Can I proceed to add the product?`
          );

          if (confirmCon) {
            AdditemFun();
          }
        } else {
          AdditemFun();
        }
      }
    }
  };

  // ----------------------------------------

  const HandelGrnItemDeletedata = (row) => {
   

    ClearGRNItemState();

    let ChangeQty = +row?.ReceivedQty;
    let ChangeItemCode = row?.ItemCode;

    let ExtraQty = row?.ExtraQty;

    let UpdatePoItemlist = POItemArrays.map((ele) => {
      // console.log(ele.ItemCode ,'pppppp',ExtraQty,typeof(ExtraQty));

      if ('' + ele.ItemCode === '' + ChangeItemCode) {
        ele.Balance_Qty =
          +ExtraQty !== 0
            ? +ele.Balance_Qty + (ChangeQty - +ExtraQty)
            : +ele.Balance_Qty + ChangeQty;
        ele.Received_Qty = +ele.Received_Qty - ChangeQty;
      }
      return ele;
    });

    setPOItemArrays(UpdatePoItemlist);

    let updatedGRNItemlist = GRNItemlist.filter((ele) => ele.id !== row.id);

    let reorderedGRNItemlist = updatedGRNItemlist.map((ele, index) => ({
      ...ele,
      id: index + 1,
    }));

    setGRNItemlist(reorderedGRNItemlist);
  };

  const GRNItemcolumn = [
    {
      key: 'id',
      name: 'S.No',
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
      key: 'IsOnlyFOCQty',
      name: 'Is Only FOC Qty',
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          {params.row.IsOnlyFOCQty ? 'Yes' : 'No'}
        </div>
      ),
    },
    {
      key: 'GRNMRP',
      name: 'GRN MRP',
    },
    {
      key: 'PurchaseRateTaxable',
      name: 'Purchase Rate Taxable',
    },
    {
      key: 'TaxType',
      name: 'Tax Type',
    },
    {
      key: 'TaxPercentage',
      name: 'Tax Percentage',
    },
    {
      key: 'PurchaseRateWithTax',
      name: 'Purchase Rate WithTax',
    },
    {
      key: 'OrderQty',
      name: 'Order Qty',
    },
    {
      key: 'Reason',
      name: 'Reason',
    },
    {
      key: 'ReceivedQty',
      name: 'Received Qty',
    },
    {
      key: 'PendingQty',
      name: 'Pending Qty',
    },
    {
      key: 'ExtraQty',
      name: 'Extra Qty',
    },
    {
      key: 'FOCQty',
      name: 'FOC Qty',
    },
    {
      key: 'TotalPackQty',
      name: 'Total Pack Qty',
    },
    {
      key: 'SellablePrice',
      name: 'Sellable Price',
    },
    {
      key: 'SellableQtyPrice',
      name: 'Sellable Qty Price',
    },
    {
      key: 'BatchNo',
      name: 'Batch No',
    },
    {
      key: 'ManufactureDate',
      name: 'Manufacture Date',
    },
    {
      key: 'ExpiryDate',
      name: 'Expiry Date',
    },
    {
      key: 'TotalPackTaxableAmount',
      name: 'Total Taxable Amount',
    },
    {
      key: 'TotalTaxAmount',
      name: 'Total TaxAmount',
    },
    {
      key: 'TotalPackAmount',
      name: 'Total Amount',
    },
    {
      key: 'DiscountMethod',
      name: 'Discount Method',
    },
    {
      key: 'DiscountType',
      name: 'Discount Type',
    },
    {
      key: 'Discount',
      name: 'Discount',
    },
    {
      key: 'FinalTotalPackTaxableAmount',
      name: 'FinalTotalPackTaxableAmount',
    },
    {
      key: 'FinalTotalTaxAmount',
      name: 'FinalTotalTaxAmount',
    },
    {
      key: 'FinalTotalPackAmount',
      name: 'FinalTotalPackAmount',
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          <Button
            className="cell_btn"
            onClick={() => HandelGrnItemDeletedata(params.row)}
          >
            <DeleteOutlineIcon className="check_box_clrr_cancell" />
          </Button>
        </div>
      ),
    },
  ];

  const HandelAmountState = (e) => {
    const { name, value } = e.target;

    if (name === 'TotalDiscountMethod') {
      setAmountstate((prev) => ({
        ...prev,
        [name]: value,
        TotalDiscountType: '',
        TotalDiscount: '',
      }));
    } else if (name === 'TotalDiscountType') {
      setAmountstate((prev) => ({
        ...prev,
        [name]: value,
        TotalDiscount: '',
      }));
    } else {
      setAmountstate((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const HandleOnchangePORemoveQty = (e) => {
    const { name, value } = e.target;

    if (name === 'CancelQty') {
      const CancelQty = +POItemChange.OrderQty - +value;

      setPOItemChange((prev) => ({
        ...prev,
        [name]: value,
        BalanceQty: value ? +CancelQty : '',
      }));
    } else {
      setPOItemChange((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const RemoveQtyFun = () => {
    console.log('hiii', POItemChange);

    let requiredFields = ['BalanceQty', 'CancelQty', 'ItemStatus'];

    let POItemChangeStateFields = requiredFields.filter(
      (field) => !POItemChange[field]
    );

    if (POItemChangeStateFields.length !== 0) {
      dispatchvalue({
        type: 'toast',
        value: {
          message: `Please fill out all required fields: ${POItemChangeStateFields.join(', ')}`,
          type: 'warn',
        },
      });
    } else {
      const RemovePoItemlist = POItemArrays.filter((ele, ind) => {
        if ('' + ele.ItemCode === '' + POItemChange.ItemCode) {

          +POItemChange.ReceivedQty > 0
            ? (ele.Balance_Qty = 0)
            : (ele.Balance_Qty = +ele.PurchaseQty - +POItemChange.CancelQty);
          ele.PurchaseQty = +ele.PurchaseQty - +POItemChange.CancelQty;
          ele.Item_Status = POItemChange.ItemStatus;
          ele.Reason = POItemChange.Reason;
        }
        return ele;
      });

      setPOItemArrays(RemovePoItemlist);

      setselectRoom2(false);

      clearRemovedata();
    }
  };

  const [pageAccess, setPageAccess] = useState([]);

  useEffect(() => {
    if (UserData?.inventory_access[0]?.Store_Id || 1) {
      console.log('store', UserData?.inventory_access[0]?.Store_Id)
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${UrlLink}Masters/inventory_page_access_by_storeid`,
            {
              params: { Storeid: UserData.inventory_access[0].Store_Id || 1},
            }
          );
          const ress = response.data;
          if (ress.length > 0 && ress[0].page_access) {
            setPageAccess(ress[0].page_access[0]);
          }
        } catch (err) {
          console.error("Error fetching page access:", err);
        }
      };
      fetchData();
    }
  }, [UrlLink, UserData]);

const SaveGRNfunc = () => {
  // Add the missing SuppRequiredFields variable (with capital R)
  let SuppRequiredFields = [
    'SupplierBillNumber',
    'SupplierBillDate',
    'SupplierBillAmount',
    'StorageLocation',
  ];

  // Remove the duplicate Senddata declaration from here
  // let Senddata = { ... }; // DELETE THIS DUPLICATE

  let SupplierField = SuppRequiredFields.filter((field) => !GRNState[field]); // Fixed variable name

  let PoItemlistcheck = POItemArrays.some((ele) => +ele.Balance_Qty > 0);

  if (SupplierField.length !== 0) {
    dispatchvalue({
      type: 'toast',
      value: {
        message: `Please fill out all required fields: ${SupplierField.join(', ')}`,
        type: 'warn',
      },
    });
  } else if (PoItemlistcheck) {
    dispatchvalue({
      type: 'toast',
      value: {
        message: `Please enter all quantities or cancel the items.`,
        type: 'warn',
      },
    });
  } else if (+GRNState.SupplierBillAmount !== +Amountstate.NetAmount) {
    dispatchvalue({
      type: 'toast',
      value: {
        message:
          'Supplier Bill Amount and GRN Net Amount need to be the same.',
        type: 'warn',
      },
    });
  } else {
    // Keep only one Senddata declaration here
    let Senddata = {
      GRNState: GRNState,
      POItemArrays: POItemArrays,
      SupplierBillfile: SupplierBillfile,
      GRNItemlist: GRNItemlist,
      Amountstate: Amountstate, // Now includes TPD
      Created_by: userRecord?.username,
      IS_GRN_Approve: pageAccess.IS_GRN_Approve,
    };

    console.log('Senddata-----', Senddata);

    axios
      .post(
        `${UrlLink}Inventory/PO_Goods_Reciept_Note_Details_link`,
        Senddata
      )
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
          navigate('/Home/GoodsReceiptNoteList');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};


  const ChangeMasterdata = () => {


    if (ItemFulldetailes.ItemCode === '') {
      const tdata = {
        message: 'ItemName is mandatory',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
    else {
      const mysenddata = {
        SupplierCode: GRNState.SupplierCode,
        Created_by: userRecord?.username,
        ...ItemFulldetailes
      }
      const senddata = Object.entries(mysenddata).reduce((acc, [key, value]) => {
        const fieldsToConvert = [
          'GST',
          'SubCategory',
          'GenericName',
          'ItemCode',
          'LeastSellableUnit',
          'ManufacturerName',
          'PackQty',
          'PackType',
          'PurchaseQty',
        ]

        if (fieldsToConvert.includes(key)) {
          acc[key] = value ? parseInt(value) : null
        } else {
          acc[key] = value
        }

        return acc
      }, {})
      console.log('2222-ppp', senddata)

      axios.post(`${UrlLink}Inventory/UpdateMasterDataInGrn`, senddata)
        .then((res) => {
          console.log(res.data);

          console.log(res.data);

          let resdata = res.data;
          let type = Object.keys(resdata)[0];
          let mess = Object.values(resdata)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: 'toast', value: tdata });
        })
        .catch((err) => {
          console.log(err);
        })
    }

  }






  return (
    <>
        <div className="Main_container_app">
      <h3>Goods Receipt Note</h3>

      <br />

      <div className="RegisFormcon_1">
        {Object.keys(GRNState).map((StateName, Index) => {
          return (
            <div className="RegisForm_1" key={Index + 'key'}>
              <label htmlFor={StateName}>
                {formatLabel(StateName)} <span>:</span>
              </label>

              {['GRNLocation', 'StorageLocation'].includes(StateName) ? (
                <select
                  id={StateName}
                  name={StateName}
                  value={GRNState[StateName]}
                  onChange={HandeleOnchange}
                  autoComplete='off'
                >
                  <option value="">Select</option>
                  {StateName === 'GRNLocation'
                    ? LocationData.map((ele, ind) => (
                      <option key={ind + 'key'} value={ele.id}>
                        {ele.locationName}
                      </option>
                    ))
                    : StateName === 'StorageLocation'
                      ? StoreData.map((ele, ind) => (
                        <option key={`${ind}-key`} value={ele.id}>
                          {ele.StoreName}
                        </option>
                      ))
                      : ['Invoice', 'Individual Item'].map((ele, ind) => (
                        <option key={ind + 'key'} value={ele}>
                          {'For ' + ele}
                        </option>
                      ))}
                </select>
              ) : StateName === 'IsFOCAvailable' ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    width: '150px',
                  }}
                >
                  <label style={{ width: 'auto' }} htmlFor={`${StateName}_yes`}>
                    <input
                      required
                      id={`${StateName}_yes`}
                      type="radio"
                      name={StateName}
                      value="Yes"
                      style={{ width: '15px' }}
                      checked={GRNState[StateName]}
                      onChange={HandeleOnchange}
                      autoComplete='off'
                    />
                    Yes
                  </label>
                  <label style={{ width: 'auto' }} htmlFor={`${StateName}_No`}>
                    <input
                      required
                      id={`${StateName}_No`}
                      type="radio"
                      name={StateName}
                      value="No"
                      style={{ width: '15px' }}
                      checked={!GRNState[StateName]}
                      onChange={HandeleOnchange}
                      autoComplete='off'
                    />
                    No
                  </label>
                </div>
              ) : (
                <input
                  type={getInputType(StateName)}
                  id={StateName}
                  name={StateName}
                  value={GRNState[StateName]}
                  onChange={HandeleOnchange}
                  autoComplete='off'
                  max={StateName === 'SupplierBillDate' ? currentDate : ''}
                  disabled={[
                    'SupplierBillDueDate',
                    'GRNDate',
                    'PONumber',
                    'SupplierCode',
                    'SupplierName',
                  ].includes(StateName)}
                />
              )}
            </div>
          );
        })}


          <>
            <div className="RegisForm_1">
              <label htmlFor="SupplierBillfile">File Attachment :</label>
              <input
                type="file"
                name="SupplierBillfile"
                accept="image/jpeg,image/png,application/pdf"
                required
                id="SupplierBillfile"
                autoComplete="off"
                onChange={handlefileOnchange}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '150px',
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <label
                  htmlFor="SupplierBillfile"
                  className="RegisterForm_1_btns choose_file_update"
                >
                  <PhotoCameraBackIcon />
                </label>
                <button
                  className="fileviewbtn"
                  onClick={() => Selectedfileview(SupplierBillfile)}
                >
                  view
                </button>
              </div>
            </div>
          </>
        </div>
        <br />
        <div className="common_center_tag">
          <span>PO PRODUCT LIST</span>
        </div>

        <div className="RegisFormcon_1 jjxjx_">
          <ReactGrid columns={PoItemcolumn} RowData={POItemArrays} />
        </div>

        <div className="common_center_tag">
          <span>PO ITEM DETAILES</span>
        </div>
        <br />
        <div className="RegisFormcon_1">
          {Object.keys(ItemFulldetailes).length !== 0 &&
            Object.keys(ItemFulldetailes).filter((ele) => !['ProductCategory_pk', 'SubCategory_pk'].includes(ele)).map((StateName, Index) => {
              return (
                <div className="RegisForm_1" key={Index + 'key'}>
                  <label htmlFor={StateName}>
                    {formatLabel(StateName)} <span>:</span>
                  </label>

                  {['SubCategory', 'GenericName', 'ManufacturerName', 'StrengthType', 'PackType', 'LeastSellableUnit'].includes(StateName) ?

                    (
                      <select
                        id={StateName}
                        name={StateName}
                        value={ItemFulldetailes[StateName]}
                        onChange={HandeleOnchangePOItem}
                      >
                        <option value=''>Select</option>
                        {StateName === 'SubCategory' &&
                          SubCategory.filter(ele => ele.Status).map((ele, ind) => (
                            <option key={ind} value={ele.id}>
                              {ele.SubCategoryName}
                            </option>
                          ))}

                        {StateName === 'GenericName' &&
                          GenericNameData.filter(ele => ele.Status).map(
                            (ele, ind) => (
                              <option key={ind} value={ele.id}>
                                {ele.GenericName}
                              </option>
                            )
                          )}
                        {StateName === 'ManufacturerName' &&
                          ManufactureData.filter(ele => ele.Status).map(
                            (ele, ind) => (
                              <option key={ind} value={ele.id}>
                                {ele.CompanyName}
                              </option>
                            )
                          )}
                        {StateName === 'PackType' &&
                          ProductPackType.filter(f => f.Status).map((ele, ind) => (
                            <option key={ind} value={ele.id}>
                              {ele.PackTypeName}
                            </option>
                          ))}
                        {StateName === 'StrengthType' &&
                          ['g', 'mg', 'moles'].map((ele, ind) => (
                            <option key={ind} value={ele}>
                              {ele}
                            </option>
                          ))}
                        {StateName === 'LeastSellableUnit' &&
                          [
                            1,
                            +ItemFulldetailes.PackQty !== 1
                              ? ItemFulldetailes.PackQty
                              : null
                          ]
                            .filter(f => f)
                            .map((ele, ind) => (
                              <option key={ind} value={ele}>
                                {ele}
                              </option>
                            ))}
                      </select>
                    )
                    :
                    ['AddNewProduct', 'IsSellable'].includes(StateName) ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          gap: '10px',
                          width: '150px',
                        }}
                      >
                        <label
                          style={{ width: 'auto' }}
                          htmlFor={`${StateName}_yes`}
                        >
                          <input
                            required
                            id={`${StateName}_yes`}
                            type="radio"
                            name={StateName}
                            value="Yes"
                            style={{ width: '15px' }}
                            checked={ItemFulldetailes[StateName]}
                            onChange={HandeleOnchangePOItem}
                            disabled={StateName === 'AddNewProduct' &&
                              POItemArrays.some(
                                (ele) =>
                                  '' + ele.ItemCode ===
                                  '' + ItemFulldetailes.ItemCode
                              )}
                          />
                          Yes
                        </label>
                        <label
                          style={{ width: 'auto' }}
                          htmlFor={`${StateName}_No`}
                        >
                          <input
                            required
                            id={`${StateName}_No`}
                            type="radio"
                            name={StateName}
                            value="No"
                            style={{ width: '15px' }}
                            checked={!ItemFulldetailes[StateName]}
                            onChange={HandeleOnchangePOItem}
                            disabled={StateName === 'AddNewProduct' &&
                              POItemArrays.some(
                                (ele) =>
                                  '' + ele.ItemCode ===
                                  '' + ItemFulldetailes.ItemCode
                              )}
                          />
                          No
                        </label>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          id={StateName}
                          name={StateName}
                          list={StateName + 'List'}
                          value={ItemFulldetailes[StateName]}
                          onChange={HandeleOnchangePOItem}
                          autoComplete='off'
                          disabled={
                            !ItemFulldetailes.AddNewProduct
                              ? ['ItemCode', 'ItemName', 'ProductCategory', 'PurchaseQty', 'TotalAmount', 'MRP', 'PurchaseRateAfterGST'].includes(StateName)
                              : !['ItemCode', 'ItemName'].includes(StateName)
                          }
                        />
                        {['ItemCode', 'ItemName'].includes(StateName) && (
                          <datalist id={StateName + 'List'}>
                            {NewItemProductArray.map((option, index) => (
                              <option
                                key={index + 'key'}
                                value={
                                  StateName === 'ItemCode'
                                    ? option.ItemCode
                                    : option.ItemName
                                }
                              ></option>
                            ))}
                          </datalist>
                        )}
                      </>
                    )}
                </div>
              );
            })}

          <div className="Main_container_Btn">
            <button onClick={ChangeMasterdata} >
              Update
            </button>
          </div>
        </div>

        <br />

        {ItemFulldetailes.ItemCode !== '' && (
          <>
            <div className="common_center_tag">
              <span>GRN ENTRY DETAILES</span>
            </div>
            <br />
            <div className="RegisFormcon_1">
              {Object.keys(ItemFulldetailes).length !== 0 &&
                (GRNItemState.IsOnlyFOCQty === false
                  ? ItemFulldetailes.IsSellable === 'No' ?
                    Object.keys(GRNItemState).filter(
                      (ele) =>
                        ![
                          'IsMRPAsSellablePrice',
                          'SellablePrice',
                          'SellableQtyPrice',
                        ].includes(ele)
                    )
                    : Object.keys(GRNItemState).filter(
                      (ele) => ele !== 'FOCItemCode' && ele !== 'FOCItemName'
                    )
                  : Object.keys(GRNItemState).filter((ele) =>
                    [
                      'IsOnlyFOCQty',
                      'FOCQty',
                      'TotalPackQty',
                      'BatchNo',
                      'IsManufactureDateAvailable',
                      'ManufactureDate',
                      'IsExpiryDateAvailable',
                      'ExpiryDate',
                    ].includes(ele)
                  )
                ).map((StateName, Index) => {
                  return (
                    <div className="RegisForm_1" key={Index + 'key'}>
                      <label htmlFor={StateName}>
                        {StateName === 'IsMRPAsSellablePrice'
                          ? 'Is MRP As Sellable Price'
                          : formatLabel(StateName)}{' '}
                        <span>:</span>
                      </label>
                      {[
                        'IsOnlyFOCQty',
                        'IsFOCQtyAvailable',
                        'IsMRPAsSellablePrice',
                        'IsManufactureDateAvailable',
                        'IsExpiryDateAvailable',
                      ].includes(StateName) ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            gap: '10px',
                            width: '150px',
                          }}
                        >
                          <label
                            style={{ width: 'auto' }}
                            htmlFor={`${StateName}_yes`}
                          >
                            <input
                              required
                              id={`${StateName}_yes`}
                              type="radio"
                              name={StateName}
                              value="Yes"
                              style={{ width: '15px' }}
                              checked={GRNItemState[StateName]}
                              onChange={HandelItemstate}
                              disabled={

                                ((!GRNState.IsFOCAvailable || !ItemFulldetailes.AddNewProduct) && StateName === 'IsOnlyFOCQty') ||

                                (!GRNState.IsFOCAvailable && StateName === 'IsFOCQtyAvailable') ||

                                [
                                  'IsManufactureDateAvailable',
                                  'IsExpiryDateAvailable',
                                ].includes(StateName)
                              }
                            />
                            Yes
                          </label>
                          <label
                            style={{ width: 'auto' }}
                            htmlFor={`${StateName}_No`}
                          >
                            <input
                              required
                              id={`${StateName}_No`}
                              type="radio"
                              name={StateName}
                              value="No"
                              style={{ width: '15px' }}
                              checked={!GRNItemState[StateName]}
                              onChange={HandelItemstate}
                              disabled={

                                [
                                  'IsManufactureDateAvailable',
                                  'IsExpiryDateAvailable',
                                ].includes(StateName)
                              }
                            />
                            No
                          </label>
                        </div>
                      ) : [
                        'TaxType',
                        'TaxPercentage',
                        'DiscountMethod',
                        'DiscountType',
                      ].includes(StateName) ? (
                        <select
                          id={StateName}
                          name={StateName}
                          value={GRNItemState[StateName]}
                          onChange={HandelItemstate}
                          disabled={
                            (GRNItemState.DiscountMethod === '' &&
                              StateName === 'DiscountType') ||
                            (GRNItemState.TotalPackTaxableAmount === '' &&
                              StateName === 'DiscountMethod') ||
                            (Amountstate.TotalDiscountMethod !== '' &&
                              StateName === 'DiscountMethod') ||
                            +GRNItemState.TaxPercentage === 0 ||
                            (GRNItemState.TaxPercentage === 'Nill' &&
                              StateName === 'TaxType')
                          }
                        >
                          <option value="">Select</option>
                          {StateName === 'TaxType' ? (
                            <>
                              <option value="GST">GST</option>
                              <option value="IGST">IGST</option>
                            </>
                          ) : StateName === 'TaxPercentage' ? (
                            <>
                              <option value="Nill">Nill</option>
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                              <option value="28">28%</option>
                            </>
                          ) : StateName === 'DiscountMethod' ? (
                            <>
                              <option value="BeforeTax">Before Tax</option>
                              <option value="AfterTax">After Tax</option>
                            </>
                          ) : (
                            <>
                              <option value="Cash">Cash</option>
                              <option value="Percentage">Percentage</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <>
                          <input
                            type={
                              ['ManufactureDate', 'ExpiryDate'].includes(
                                StateName
                              )
                                ? 'date'
                                : [
                                  'BatchNo',
                                ].includes(StateName)
                                  ? 'text'
                                  : 'number'
                            }
                            id={StateName}
                            name={StateName}
                            list={StateName + 'List'}
                            value={GRNItemState[StateName]}
                            onChange={HandelItemstate}
                            min={StateName === 'ExpiryDate' ? currentDate : ''}
                            max={
                              StateName === 'ManufactureDate' ? currentDate : ''
                            }
                            readOnly={
                              ![
                                'GRNMRP',
                                'PurchaseRateTaxable',
                                'TaxType',
                                'TaxPercentage',
                                'PurchaseRateWithTax',
                                'ReceivedQty',
                                'FOCQty',
                                'SellablePrice',
                                'BatchNo',
                                'ManufactureDate',
                                'ExpiryDate',
                                'DiscountMethod',
                                'DiscountType',
                                'Discount',
                              ].includes(StateName)
                            }
                            disabled={
                              (GRNItemState.DiscountType === '' &&
                                StateName === 'Discount') ||
                              (!GRNItemState.IsManufactureDateAvailable &&
                                StateName === 'ManufactureDate') ||
                              (!GRNItemState.IsExpiryDateAvailable &&
                                StateName === 'ExpiryDate') ||
                              (!GRNItemState.IsOnlyFOCQty &&
                                !GRNItemState.IsFOCQtyAvailable &&
                                StateName === 'FOCQty') ||
                              (GRNItemState.IsMRPAsSellablePrice &&
                                StateName === 'SellablePrice')
                            }
                          />

                        </>
                      )}
                    </div>
                  );
                })}
            </div>
            <div className="RegisForm_1">
  <label htmlFor="Reason">Reason <span>:</span></label>
  <select
    id="Reason"
    name="Reason"
    value={GRNItemState.Reason}
    onChange={HandelItemstate}
  >
    <option value="">Select Reason</option>
    <option value="IPPHARMACY">IPPHARMACY</option>
    <option value="OPPHARMACY">OPPHARMACY</option>
    <option value="KARUNAPHARMACY">KARUNAPHARMACY</option>
  </select>
</div>
          </>
        )}

       


        <br />

        <div className="Main_container_Btn">
          <button onClick={handelonAdd}>
            {GRNItemState.id ? 'Update' : 'Add'}
          </button>
        </div>

        <br />

        {GRNItemlist.length !== 0 && (
          <>
            <div className="common_center_tag">
              <span>GRN PRODUCT LIST</span>
            </div>

            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid columns={GRNItemcolumn} RowData={GRNItemlist} />
            </div>

            <div className="RegisFormcon_1">
              {Object.keys(Amountstate).map((StateName3, Index) => {
                return (
                  <div className="RegisForm_1" key={Index + 'key'}>
                    <label htmlFor={StateName3}>
                      {formatLabel(StateName3)} <span>:</span>
                    </label>

                    {['TotalDiscountMethod', 'TotalDiscountType'].includes(
                      StateName3
                    ) ? (
                      <select
                        type={getInputType(StateName3)}
                        id={StateName3}
                        name={StateName3}
                        value={Amountstate[StateName3]}
                        onChange={HandelAmountState}
                        disabled={
                          (StateName3 === 'TotalDiscountType' &&
                            Amountstate.TotalDiscountMethod === '') ||
                          (GRNItemlist.length === 0 &&
                            StateName3 === 'TotalDiscountMethod') ||
                          GRNItemlist.every((ele) =>
                            ['BeforeTax', 'AfterTax'].includes(
                              ele.DiscountMethod
                            )
                              ? StateName3 === 'TotalDiscountMethod'
                              : ''
                          )
                        }
                      >
                        <option value="">Select</option>
                        {StateName3 === 'TotalDiscountMethod' ? (
                          <>
                            <option value="BeforeTax">Before Tax</option>
                            <option value="AfterTax">After Tax</option>
                          </>
                        ) : (
                          <>
                            <option value="Cash">Cash</option>
                            <option value="Percentage">Percentage</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <input
                        type={getInputType(StateName3)}
                        id={StateName3}
                        name={StateName3}
                        value={Amountstate[StateName3]}
                        onChange={HandelAmountState}
                        readOnly={
                          StateName3 !== 'TotalDiscount' ||
                          (StateName3 === 'TotalDiscount' &&
                            Amountstate.TotalDiscountType === '')
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <br />
            <div className="Main_container_Btn">
              <button onClick={SaveGRNfunc}>
                {GRNState.GRNNumber ? 'Update' : 'Save'}
              </button>
            </div>
          </>
        )}
      </div>

      {selectRoom2 && POItemArrays.length !== 0 && (
        <div className="loader" onClick={() => setselectRoom2(false)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <br />

            <div className="Main_container_app">
              <div className="common_center_tag">
                <span>Purchase Order Item Quantity Edit</span>
              </div>
              <br />
              <br />

              <div className="RegisFormcon_1">
                {Object.keys(POItemChange).map((StateName, Index) => {
                  return (
                    <div className="RegisForm_1" key={Index + 'key'}>
                      <label htmlFor={StateName}>
                        {formatLabel(StateName)} :
                      </label>

                      {['ItemStatus'].includes(StateName) ? (
                        <select
                          type={getInputType(StateName)}
                          id={StateName}
                          name={StateName}
                          value={POItemChange[StateName]}
                          onChange={HandleOnchangePORemoveQty}
                          disabled={
                            POItemChange.CancelQty === ''
                              ? StateName === 'ItemStatus'
                              : ''
                          }
                        >
                          <option value="">Select</option>
                          {
                            <>
                              <option value="Waiting For GRN">
                                Waiting For GRN
                              </option>
                              <option value="Canceled">Cancel</option>
                            </>
                          }
                        </select>
                      ) : ['Reason'].includes(StateName) ? (
                        <textarea
                          type={getInputType(StateName)}
                          id={StateName}
                          name={StateName}
                          value={POItemChange[StateName]}
                          onChange={HandleOnchangePORemoveQty}
                        ></textarea>
                      ) : (
                        <input
                          type={getInputType(StateName)}
                          id={StateName}
                          name={StateName}
                          value={POItemChange[StateName]}
                          readOnly={
                            !['CancelQty'].includes(StateName) ||
                            (+POItemChange.ReceivedQty
                              ? StateName === 'CancelQty'
                              : '')
                          }
                          onChange={HandleOnchangePORemoveQty}
                        />
                      )}
                    </div>
                  );
                })}

                <div className="Main_container_Btn">
                  <button onClick={RemoveQtyFun}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastAlert Message={toast.message} Type={toast.type} />
      <ModelContainer />
    </>
  );
};

export default GoodsReceiptNote;

