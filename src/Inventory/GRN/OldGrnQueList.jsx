import axios from 'axios';
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ListIcon from '@mui/icons-material/List';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from "@mui/material/Button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';



const OldGrnQueList = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [ShowItems, setShowItems] = useState({ type: false, datas: null, showtype: 'items' })
  const [getstate, setgetstate] = useState(false)
  const [ItemsData, setItemsData] = useState([])
  const [GrnData, setGrnData] = useState([]);
  const [StoreData, setStoreData] = useState([]);

  useEffect(() => {
    if (userRecord?.location) {
      axios
        .get(`${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${userRecord?.location}&forquickgrn=${false}`)
        .then((res) => {
          const data = res.data;
          setStoreData(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log(err);
        })
    }

  }, [UrlLink, userRecord?.location]);

  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
  const [searchQuery, setsearchQuery] = useState({
    DateType: 'Current',
    CurrentDate: '',
    FromDate: '',
    ToDate: '',
    SupplierCode: '',
    SupplierName: '',
    InvoiceNo: '',
    BillingLocation: '',
    Status: 'Pending',
    StoreId: allowedStoreId || ''
  })
  const [supplierArray, setsupplierArray] = useState([])
  const [LocationData, setLocationData] = useState([]);

  useEffect(() => {
    if (searchQuery.DateType === 'Current') {
      const today = new Date();
      const currentDate = today.toISOString().split('T')[0];

      setsearchQuery((prev) => ({
        ...prev,
        CurrentDate: currentDate
      }))
    } else {
      setsearchQuery((prev) => ({
        ...prev,
        CurrentDate: ''
      }))
    }

  }, [searchQuery.DateType])
  useEffect(() => {

    axios.get(`${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=${true}`)
      .then((res) => {
        let Rdata = res.data
        if (Array.isArray(Rdata)) {
          setsupplierArray(Rdata)

        }
      })
      .catch((err) => {
        console.log(err);

      })
    axios.get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data
        setLocationData(ress)
      })
      .catch((err) => {
        console.log(err);
      })

  }, [UrlLink])


  useEffect(() => {
    axios.get(`${UrlLink}Inventory/Old_Goods_Reciept_Note_stock_supplier_link`, { params: searchQuery })
      .then((res) => {
        setGrnData(Array.isArray(res.data) ? res.data : [])
      })
      .catch((err) => {
        console.error(err);
      })
  }, [UrlLink, getstate, searchQuery])


  const handleonchange = (e) => {
    const { name, value } = e.target

    setsearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }))


  }


  const HandelViewdata = (fileval) => {

    // console.log('uuu',fileval);

    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: 'image/jpg'
      };
      if (['data:image/jpeg;base64', 'data:image/jpg;base64'].includes(fileval?.split(',')[0])) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: 'image/jpeg'
        };
      } else if (fileval?.split(',')[0] === 'data:image/png;base64') {
        tdata = {
          Isopen: true,
          content: fileval,
          type: 'image/png'
        };
      } else if (fileval?.split(',')[0] === 'data:application/pdf;base64') {
        tdata = {
          Isopen: true,
          content: fileval,
          type: 'application/pdf'
        };
      }

      console.log('tdata', tdata);

      dispatchvalue({ type: 'modelcon', value: tdata });
    } else {
      const tdata = {
        message: 'There is no file to view.',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }


  }


  const HandelProceeddata = (params) => {
    dispatchvalue({ type: 'OldGoodsReceiptNote', value: {} })
    navigate('/Home/OldGrnRecieptPage')
    dispatchvalue({ type: 'OldGoodsReceiptNote', value: params })
  }
  const GRNOrderListColumn = [

    {
      key: 'id',
      name: 'S.No',
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <>
          {!params.row.OldGRN_Updated ?
            <Button className="cell_btn"
              onClick={() => HandelProceeddata(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button> :
            <Button className="cell_btn">
              Approved
            </Button>
          }
        </>
      )
    },
    {
      key: 'pk',
      name: 'GRN Invoice No',
    },

    {
      key: 'GrnDate',
      name: 'GRN Date',
    },

    {
      key: 'SupplierCode',
      name: 'Supplier Code',
    },
    {
      key: 'SupplierName',
      name: 'SupplierName',
    },
    {
      key: 'FileAttachment',
      name: 'Supplier Bill file',
      renderCell: (params) => (
        <>
          <Button className="cell_btn"
            onClick={() => HandelViewdata(params.row.FileAttachment)}
          >
            <VisibilityIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      )
    },
    {
      key: 'Supplier_Payment',
      name: 'Supplier Payment',
      renderCell: (params) => (
        <>
          <Button className="cell_btn"
            onClick={() => ItemView(params.row, 'payment')}
          >
            <ListIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      )
    },
    {
      key: 'GRN_Items',
      name: 'GRN Items List',
      renderCell: (params) => (
        <>
          <Button className="cell_btn"
            onClick={() => ItemView(params.row, 'items')}
          >
            <ListIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      )
    },
    {
      key: 'Supplier_Bill_Number',
      name: 'Supplier Bill Number',
    },
    {
      key: 'Supplier_Bill_Date',
      name: 'Supplier Bill Date',

    },
    {
      key: 'Supplier_Bill_Due_Date',
      name: 'Supplier Bill Due Date',

    },
    {
      key: 'Supplier_Bill_Amount',
      name: 'Supplier Bill Amount',
    },
    {
      key: 'Use_BillingLocation',
      name: 'Billing Location',
      renderCell: (params) => (
        params.row.Use_BillingLocation ? params.row.Use_BillingLocation : "Nill"
      )
    },
    {
      key: 'Store_location',
      name: 'Shipping Location',
    },
    {
      key: 'Received_person',
      name: 'Receiving Person',
    },
    {
      key: 'Is_Foc_Available',
      name: 'Is Foc Available',
      renderCell: (params) => (
        params.row.Is_Foc_Available ? 'Yes' : 'No'
      )
    },
    {
      key: 'Foc_Method',
      name: 'Foc Method',
    },
    {
      key: 'Taxable_Amount',
      name: 'Taxable Amount',
    },
    {
      key: 'Tax_Amount',
      name: 'Tax Amount',
    },
    {
      key: 'Total_Amount',
      name: 'Total Amount',
    },
    {
      key: 'Total_Discount_Method',
      name: 'Total Discount Method',
      renderCell: (params) => (
        params.row.Total_Discount_Method ? params.row.Total_Discount_Method : "Nill"
      )
    },
    {
      key: 'Total_Discount_Type',
      name: 'Total Discount Type',
      renderCell: (params) => (
        params.row.Total_Discount_Method ? params.row.Total_Discount_Type : "Nill"
      )
    },
    {
      key: 'Discount_Amount',
      name: 'Total Discount',
      renderCell: (params) => (
        params.row.Total_Discount_Method ? params.row.Discount_Amount : "Nill"
      )
    },
    {
      key: 'Final_Taxable_Amount',
      name: 'Final Taxable Total',
    },
    {
      key: 'Final_Tax_Amount',
      name: 'Final Tax Total',
    },
    {
      key: 'Final_Total_Amount',
      name: 'Final Total Amount',
    },
    {
      key: 'Round_off_Amount',
      name: 'RoundOff',
    },
    {
      key: 'Net_Amount',
      name: 'NetAmount',
    },



  ]
  const SupplierPaymentcolumn = [
    ...[
      'id', 'SupplierCode', 'SupplierName', 'GRN_Invoice_No', 'GRN_Invoice_Date',
      'Supplier_Bill_Date', 'GRN_Due_Date', 'GRN_Invoice_Amount', 'GRN_Paid_Amount',
      'GRN_Balance_Amount', 'Paid_Amount', 'Balance_Amount', 'Bill_Paid_Date',
      'Payment_Method', 'Payment_Detials', 'Payment_By'
    ].map(f => ({
      key: f,
      name: f === 'id' ? 'S.No' : formatunderscoreLabel(f)
    })),
  ];
  const ItemColumn = [
    {
      key: 'id',
      name: 'S.No',
    },
    {
      key: 'ItemCode',
      name: 'Item Code',
    },
    {
      key: 'ItemName',
      name: 'Item Name',
    },
    {
      key: 'ProductCategory',
      name: 'Product Category',

    },
    {
      key: 'SubCategory',
      name: 'Sub Category',

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
      key: 'BatchNo',
      name: 'Batch No',
    },
    {
      key: 'TotalReceivedQty',
      name: 'GRN Quantity',
    },
    {
      key: 'TotalPackQuantity',
      name: 'GRN Pack Quantity',
    },

    {
      key: 'Location',
      name: 'Location',
    },
    {
      key: 'IsWardStore',
      name: 'Store Type',
      renderCell: (params) => (
        params.row.IsWardStore ? 'Ward' : 'Store'
      )
    },
    {
      key: 'Store_location',
      name: 'Store Location',
    },
    {
      key: 'Store_Stock',
      name: 'Stock Updated Quantity',
    },

  ].filter((f => {
    if (!ShowItems.datas) {
      return !['location', 'IsWardStore', 'Store_location', 'Store_Stock'].includes(f.key)
    } else {
      return f
    }
  }))
  const ItemView = (row, type = 'items') => {

    if (type === 'items') {
      if (row?.GRN_Items && row?.GRN_Items.length !== 0) {
        setShowItems({
          type: true,
          datas: row?.OldGRN_Updated,
          showtype: 'items'
        })
        setItemsData(row?.GRN_Items)
      }
      else {

        const tdata = {
          message: 'There is no data to view.',
          type: 'warn'
        };
        dispatchvalue({ type: 'toast', value: tdata });

      }
    } else {
      if (row?.Supplier_Payment && row?.Supplier_Payment.length !== 0) {
        setShowItems({
          type: true,
          datas: row?.OldGRN_Updated,
          showtype: 'Payment'
        })
        setItemsData(row?.Supplier_Payment)
      }
      else {

        const tdata = {
          message: 'There is no data to view.',
          type: 'warn'
        };
        dispatchvalue({ type: 'toast', value: tdata });

      }
    }



  }


  return (
    <>
      <div className="Main_container_app">
        <h3>Old Goods Receipt Note Stock Update Que List</h3>
        <br />
        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>Status<span>:</span></label>

            <select
              name='Status'
              value={searchQuery.Status}
              onChange={handleonchange}
            >
              <option value=''>Select</option>
              <option value='Pending'> Pending </option>
              <option value='Approved'> Approved </option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>Date Type<span>:</span></label>
            <select
              name='DateType'
              value={searchQuery.DateType}
              onChange={handleonchange}
            >
              <option value=''>Select</option>
              <option value='Current'>Current Date</option>
              <option value='Customize'>Customize</option>
            </select>
          </div>

          {searchQuery.DateType === 'Current' ?
            <div className="RegisForm_1">
              <label>Current Date<span>:</span></label>
              <input
                type='date'
                name='CurrentDate'
                value={searchQuery.CurrentDate}
                onChange={handleonchange}
                readOnly
              />

            </div>
            :
            <>
              <div className="RegisForm_1">
                <label>From Date<span>:</span></label>
                <input
                  type='date'
                  name='FromDate'
                  value={searchQuery.FromDate}
                  onChange={handleonchange}
                />

              </div>


              <div className="RegisForm_1">
                <label>To Date<span>:</span></label>
                <input
                  type='date'
                  name='ToDate'
                  value={searchQuery.ToDate}
                  onChange={handleonchange}
                  min={searchQuery.FromDate}
                />

              </div>
            </>}

          <div className="RegisForm_1">
            <label>Supplier Id<span>:</span></label>
            <input
              type='text'
              name='SupplierCode'
              value={searchQuery.SupplierCode}
              onChange={handleonchange}
              list='SupplierCodeList'
            />
            <datalist id='SupplierCodeList'>
              {
                supplierArray.map((ele, ind) => (
                  <option key={ind + 'key'} value={ele.id} ></option>
                ))

              }
            </datalist>

          </div>


          <div className="RegisForm_1">
            <label>Supplier Name<span>:</span></label>
            <input
              type='text'
              name='SupplierName'
              value={searchQuery.SupplierName}
              onChange={handleonchange}
              list='SupplierNameList'
            />
            <datalist id='SupplierNameList'>
              {
                supplierArray.map((ele, ind) => (
                  <option key={ind + 'key'} value={ele.SupplierName} ></option>
                ))
              }
            </datalist>

          </div>

          <div className="RegisForm_1">
            <label>Billing Location<span>:</span></label>
            <select
              id='BillingLocation'
              name='BillingLocation'
              value={searchQuery.BillingLocation}
              onChange={handleonchange}
            >
              <option value=''>Select</option>
              {

                LocationData.map((ele, ind) => (
                  <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
                ))

              }
            </select>
          </div>

          <div className="RegisForm_1">
            <label>Store Name<span>:</span></label>
            <select
              id='StoreId'
              name='StoreId'
              value={searchQuery.StoreId}
              onChange={handleonchange}
            >
              <option value=''>Select</option>
              {
                StoreData.map((ele, ind) => (
                  <option key={ind + 'key'} value={ele.id} >{ele.StoreName}</option>
                ))

              }
            </select>
          </div>


        </div>

        <br />

        <ReactGrid columns={GRNOrderListColumn} RowData={GrnData} />
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
      <ModelContainer />

      {ShowItems.type && ItemsData.length !== 0 && (
        <div className="loader" onClick={() => setShowItems({ type: false, datas: null, showtype: 'items' })}>
          <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
            <br />

            <div className="common_center_tag">
              <span>{ShowItems.showtype === 'items' ? 'Item Details' : 'Supplier Payment detials'}</span>
            </div>
            <br />
            <br />

            <ReactGrid columns={ShowItems.showtype === 'items' ? ItemColumn : SupplierPaymentcolumn} RowData={ItemsData} />
          </div>
        </div>
      )}
    </>
  )
}

export default OldGrnQueList;