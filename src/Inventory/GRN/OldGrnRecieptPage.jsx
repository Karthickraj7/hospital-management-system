import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BlockInvalidcharecternumber, formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
const OldGrnRecieptPage = () => {

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const OldGoodsReceiptNote = useSelector(state => state.Inventorydata?.OldGoodsReceiptNote);
  const [summa1, setsumma1] = useState({
    id: null,
    PaymentDate: '',
    PaymentAmount: '',
    PaymentMethod: '',
    PaymentDetials: '',
    PaymentBy: '',
  })
  const [Balance_Amount, setBalance_Amount] = useState(0)
  const [summaArray1, setsummaArray1] = useState([])

  const [summa2, setsumma2] = useState({
    id: null,
    pk: '',
    ItemCode: '',
    ItemName: '',
    ProductCategory: '',
    SubCategory: '',
    PackType: '',
    PackQuantity: '',
    BatchNo: '',
    Location: '',
    IsFromWardStore: false,
    StoreLocation: '',
    TotalPackQuantity: ''
  })

  const [summaArray2, setsummaArray2] = useState([])
  const [summaArray3, setsummaArray3] = useState([])
  const [summaArray4, setsummaArray4] = useState([])
  const [summaArray5, setsummaArray5] = useState([])

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data
        setsummaArray3(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])



  useEffect(() => {
    if (summa2.Location) {
      axios.get(`${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${summa2.Location}&IsFromWardStore=${summa2.IsFromWardStore}`)
        .then((res) => {
          const ress = res.data
          setsummaArray4(ress)

        })
        .catch((err) => {
          console.log(err);
        })
    }else{
      setsummaArray4([])
    }
  }, [UrlLink, summa2.Location, summa2.IsFromWardStore])

  useEffect(() => {
    if (!Object.keys(OldGoodsReceiptNote).length) {
      navigate('/Home/OldGrnQueList')
    } else {
      setBalance_Amount(OldGoodsReceiptNote?.Net_Amount)
      if (Array.isArray(OldGoodsReceiptNote?.GRN_Items)) {
        setsummaArray2(OldGoodsReceiptNote?.GRN_Items.map(datas => ({
          ...datas,
          BalancePackQuantity: datas?.TotalPackQuantity
        })))
      } else {
        setsummaArray2([])
      }

    }
  }, [OldGoodsReceiptNote])

  const handleonchangesumma1 = (e) => {
    const { name, value } = e.target

    if (name === 'PaymentAmount') {
      const parsedValue = parseFloat(value) || 0;
      const grnBalanceAmount = parseFloat(Balance_Amount);
      if (!isNaN(parsedValue) && !isNaN(grnBalanceAmount) && parsedValue <= grnBalanceAmount) {
        setsumma1((prev) => ({
          ...prev,
          [name]: parsedValue,

        }));
      } else {
        const tdata = {
          message: `Please enter a valid number below or equal to the  Balance Amount ${Balance_Amount}`,
          type: 'warn',
        }
        dispatchvalue({ type: 'toast', value: tdata });


      }

    } else if (name === 'PaymentMethod') {
      if (value === 'Cash') {
        setsumma1((prev) => ({
          ...prev,
          [name]: value,
          PaymentDetials: 'Nill'
        }));
      } else {
        setsumma1((prev) => ({
          ...prev,
          [name]: value,
          PaymentDetials: ''
        }));
      }
    } else {
      setsumma1(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleeditsumma1 = (params) => {
    setsumma1({
      ...params
    })
  }
  const handleaddsumma1 = () => {
    let requiredfields = [
      'PaymentAmount',
      'PaymentDate',
      'PaymentMethod'
    ]
    if (summa1.PaymentMethod !== '') {
      requiredfields.push('PaymentDetials');
    }
    const missingFields = requiredfields.filter((field) => !summa1[field]);
    if (missingFields.length !== 0) {
      const tdata = {
        message: `Please fill out all required fields: ${missingFields.map(p => formatunderscoreLabel(p)).join(', ')}`,
        type: 'warn',
      }
      dispatchvalue({ type: 'toast', value: tdata });
    } else {

      if (summa1.id) {
        setsummaArray1(prev => prev.map(datas => datas.id === summa1.id ? { ...summa1 } : datas))
      }
      else {
        setsummaArray1(prev => [
          ...prev,
          {
            ...summa1,
            id: prev.length + 1,
          }
        ])
      }
      setsumma1({
        id: null,
        PaymentDate: '',
        PaymentAmount: '',
        PaymentMethod: '',
        PaymentDetials: '',
        PaymentBy: '',
      })
    }
  }


  useEffect(() => {
    if (summaArray1.length !== 0) {
      let amount = 0
      summaArray1.filter(ele => ele.id !== summa1.id).forEach((ele) => {
        amount += ele.PaymentAmount
      })
      const updatedamount = OldGoodsReceiptNote?.Net_Amount - amount
      setBalance_Amount(updatedamount.toFixed(3))
    }
  }, [summaArray1, OldGoodsReceiptNote])

  const summa1column = [
    ...Object.keys(summa1).map(f => (
      {
        key: f,
        name: f === 'id' ? 'S.No' : formatunderscoreLabel(f)
      }

    )),
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => handleeditsumma1(params.row)}>
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      )
    }
  ]

  const handleonchangesumma2 = (e) => {
    const { name, value } = e.target
    if (name === 'TotalPackQuantity') {
      const findadata = summaArray2.find(f => f.ItemCode === +summa2.ItemCode && f.BatchNo === summa2.BatchNo)


      if (findadata) {
        const parsedValue = parseFloat(value) || 0;
        const convertedvalue = parseFloat(findadata?.BalancePackQuantity) || 0;
        if (!isNaN(parsedValue) && !isNaN(convertedvalue) && parsedValue <= convertedvalue) {
          setsumma2(prev => ({
            ...prev,
            [name]: value
          }))
        } else {
          const tdata = {
            message: `Please enter a valid Quantity below or equal to the  Balance Quantity ${convertedvalue}`,
            type: 'warn',
          }
          dispatchvalue({ type: 'toast', value: tdata });

        }
      }

    } else if (name === 'IsFromWardStore') {
      setsumma2(prev => ({
        ...prev,
        [name]: value === 'Yes'
      }))
    } else {
      setsumma2(prev => ({
        ...prev,
        [name]: value
      }))
    }

  }
  const handleeditsumma2 = (params) => {
    setsumma2(prev => ({
      ...prev,
      pk: params?.pk,
      ItemCode: params?.ItemCode,
      ItemName: params?.ItemName,
      ProductCategory: params?.ProductCategory,
      SubCategory: params?.SubCategory,
      PackType: params?.PackType,
      PackQuantity: params?.PackQuantity,
      BatchNo: params?.BatchNo,
      Location: '',
      IsFromWardStore: false,
      StoreLocation: '',
      TotalPackQuantity: params?.BalancePackQuantity
    }))
  }
  const handleaddsumma2 = () => {

    const missingFields = Object.keys(summa2).filter(f => !['id', 'IsFromWardStore'].includes(f)).filter((field) => !summa2[field]);
    if (missingFields.length !== 0) {
      const tdata = {
        message: `Please fill out all required fields: ${missingFields.map(p => formatunderscoreLabel(p)).join(', ')}`,
        type: 'warn',
      }
      dispatchvalue({ type: 'toast', value: tdata });
    } else {

      const existingdata = summaArray5.some(f =>
        f?.Location === summa2?.Location &&
        f?.ItemCode === +summa2?.ItemCode &&
        f?.BatchNo === summa2?.BatchNo &&
        f?.IsFromWardStore === summa2?.IsFromWardStore &&
        f?.StoreLocation === summa2?.StoreLocation &&
        f?.id !== summa2?.id
      );

      if (existingdata) {
        const tdata = {
          message: `The Item already exists with the same Batch No, Location, and Store Location`,
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      } else {
        const LocationName = summaArray3.find(ele => +ele.id === +summa2.Location)
        const StoreLocationName = summaArray4.find(ele => +ele.id === +summa2.StoreLocation)
        const summa2data = {
          ...summa2,
          LocationName: LocationName?.locationName,
          StoreLocationName: summa2.IsFromWardStore ? StoreLocationName.WardName : StoreLocationName.StoreName
        }


        if (summa2.id) {
          setsummaArray5(prev => prev.map(datas => datas.id === summa2data.id ? { ...summa2data } : datas))
        }
        else {
          setsummaArray5(prev => [
            ...prev,
            {
              ...summa2data,
              id: prev.length + 1,
            }
          ])
        }
        setsumma2({
          id: null,
          pk: '',
          ItemCode: '',
          ItemName: '',
          ProductCategory: '',
          SubCategory: '',
          PackType: '',
          PackQuantity: '',
          BatchNo: '',
          Location: '',
          IsFromWardStore: false,
          StoreLocation: '',
          TotalPackQuantity: ''
        })
      }
    }


  }


  useEffect(() => {
    if (summaArray5.length !== 0) {
      setsummaArray2(prev => {
        const datass = [...prev];

        // Create a Set of unique combinations of ItemCode and BatchNo from summaArray5
        const uniqueCombinations = Array.from(
          new Set(summaArray5.map(f => `${f.ItemCode}-${f.BatchNo}`))
        ).map(key => {
          const [ItemCode, BatchNo] = key.split('-');
          return { ItemCode, BatchNo };
        });
        console.log(uniqueCombinations);

        // For each unique combination of ItemCode and BatchNo
        uniqueCombinations.forEach(({ ItemCode, BatchNo }) => {
          // Find matching items in summaArray5 excluding the current summa2.id
          let filteredarray = summaArray5
          if (summa2?.id) {
            filteredarray = summaArray5.filter(f => f?.id !== summa2?.id)
          }
          const matchingItems = filteredarray.filter(f => f.ItemCode === +ItemCode && f.BatchNo === BatchNo);
          console.log('matchingItems', matchingItems);

          // Calculate the total quantity sum for the matching items
          const totalQuantitySum = matchingItems.reduce((sum, item) => sum + (+item.TotalPackQuantity || 0), 0);
          console.log('totalQuantitySum', totalQuantitySum);

          // Update the BalancePackQuantity for each matching item in setsummaArray2
          datass.forEach((item, index) => {
            if (item.ItemCode === +ItemCode && item.BatchNo === BatchNo) {
              datass[index] = {
                ...item,
                BalancePackQuantity: item.TotalPackQuantity - totalQuantitySum // Update BalancePackQuantity based on the sum
              };
            }
          });
        });

        return datass; // Return updated array
      });
    }
  }, [summaArray5, summa2.id]);


  const summa2column = [
    ...['id', 'ItemCode', 'ItemName', 'ProductCategory', 'SubCategory',
      'PackType', 'PackQuantity', 'BatchNo', 'TotalReceivedQty', 'TotalPackQuantity', 'BalancePackQuantity'
    ].map(f => (
      {
        key: f,
        name: f === 'id' ? 'S.No' : formatunderscoreLabel(f)
      }

    )),
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => handleeditsumma2(params.row)}>
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      )
    }
  ]


  const handleeditsumma5 = (params) => {
    setsumma2(prev => ({
      id: params?.id,
      pk: params?.pk,
      ItemCode: params?.ItemCode,
      ItemName: params?.ItemName,
      ProductCategory: params?.ProductCategory,
      SubCategory: params?.SubCategory,
      PackType: params?.PackType,
      PackQuantity: params?.PackQuantity,
      BatchNo: params?.BatchNo,
      Location: params?.Location,
      IsFromWardStore: params?.IsFromWardStore,
      StoreLocation: params?.StoreLocation,
      TotalPackQuantity: params?.TotalPackQuantity
    }))
  }
  const summa5column = [
    ...Object.keys(summa2).map(f => (
      {
        key: ['Location', 'StoreLocation'].includes(f) ? f + 'Name' : f,
        name: f === 'id' ? 'S.No' : formatunderscoreLabel(f),
        renderCell: (params) => (
          f === 'IsFromWardStore' ?
            params.row[f] ? 'Yes' : 'No' :
            params.row[['Location', 'StoreLocation'].includes(f) ? f + 'Name' : f]
        )
      }

    )),
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <Button className="cell_btn" onClick={() => handleeditsumma5(params.row)}>
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      )
    }
  ]
  const handleSubmitAll = () => {
    if (summaArray1.length === 0 && summaArray5.length === 0) {
      const tdata = {
        message: `Please fill in either the Supplier payment details or the Stock details.`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else {
      let statements = '';

      // Case: Supplier payment exists
      if (summaArray1.length === 0) {
        statements += `No payment made for the supplier in this GRN. The net amount is ${OldGoodsReceiptNote?.Net_Amount}.\n`;
      } else {
        const totalBillAmount = OldGoodsReceiptNote?.Net_Amount;
        const paidAmount = totalBillAmount - Balance_Amount; // Adjust as needed for the correct array object
        const remainingAmount = Balance_Amount;

        statements += `Supplier payment is available.\nThe total bill amount is ${totalBillAmount}. Paid amount is ${paidAmount}, and the remaining amount is ${remainingAmount}.\n`;
      }

      // Case: Stock details exists
      if (summaArray5.length === 0) {
        statements += `No stock available for this GRN.\n`;
      } else {
        statements += `Stock details are available.\n`;
      }
      statements += 'Please review both the stock details and the supplier payment details, as there is no recent update for these. Please double-check the invoice and confirm.\n'

      // Display confirmation dialog
      const confirmation = window.confirm(statements);
      if (confirmation) {
        const data={
          pk:OldGoodsReceiptNote?.pk,
          supplierdata:summaArray1,
          stockdata:summaArray5,
          Created_by:userRecord?.username
        }
        axios.post(`${UrlLink}Inventory/Old_Goods_Reciept_Note_stock_supplier_link`,data)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.error(err);
          })
      }
    }
  }


  return (
    <>
      <div className="Main_container_app">
        <h3>Old Goods Receipt Note Stock Update</h3>
        <br />
        <div className="RegisFormcon_1">
          {
            [...Object.keys(OldGoodsReceiptNote), 'Balance_Amount'].filter(p => [
              'pk', 'SupplierCode', 'SupplierName', 'GrnDate', 'Store_location', 'Received_person', 'Supplier_Bill_Number',
              'Supplier_Bill_Date', 'Supplier_Bill_Due_Date', 'Net_Amount', 'Balance_Amount'

            ].includes(p)).filter(p => !OldGoodsReceiptNote.IsFOCAvailable ? p !== 'FOCMethod' : p).map((field, Index) => {
              return (
                <div className="RegisForm_1" key={Index + 'key'}>

                  <label htmlFor={field}>
                    {
                      field === 'GRNDate' ?
                        'GRN Date' :
                        field === 'pk' ?
                          "GRN Invoice No" :
                          formatunderscoreLabel(field)
                    }
                    <span>:</span>
                  </label>

                  <input
                    type='text'
                    id={field}
                    name={field}
                    value={Object.keys(OldGoodsReceiptNote).length && field === 'Balance_Amount' ? Balance_Amount : OldGoodsReceiptNote[field]}
                    disabled
                  />

                </div>

              )
            })
          }
        </div>
        <br />
        <div className="common_center_tag">
          <span>Supplier Pay Details</span>
        </div>
        <br />
        <div className="RegisFormcon_1">
          {Object.keys(summa1).filter(f => f !== 'id').map((field, index) => (
            <div className="RegisForm_1" key={index + 'key'}>
              <label htmlFor={field}>
                {
                  formatunderscoreLabel(field)
                }
                <span>:</span>
              </label>
              {field === 'PaymentMethod' ?
                <select
                  name={field}
                  value={summa1[field]}
                  onChange={handleonchangesumma1}
                >
                  <option value=''>Select</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="OnlinePayment">Online Payment</option>
                  <option value="Cheque">Cheque</option>
                </select>
                :
                <input
                  name={field}
                  type={field === 'PaymentDate' ? 'date' : field === 'PaymentAmount' ? 'number' : 'text'}
                  value={summa1[field]}
                  onKeyDown={field === 'PaymentAmount' ? BlockInvalidcharecternumber : null}
                  min={field === 'PaymentDate' ? Object.keys(OldGoodsReceiptNote).length && OldGoodsReceiptNote?.Supplier_Bill_Date : ''}
                  onChange={handleonchangesumma1}
                  disabled={field === 'PaymentDetials' && ['', 'Cash'].includes(summa1.PaymentMethod)}
                />
              }
            </div>

          ))}
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleaddsumma1}>
            {summa1.id ? 'Update' : 'Add'}
          </button>
        </div>

        <br />
        <ReactGrid columns={summa1column} RowData={summaArray1} />

        <br />
        <div className="common_center_tag">
          <span>Item Stock Details</span>
        </div>
        <ReactGrid columns={summa2column} RowData={summaArray2} />

        <br />

        <div className="RegisFormcon_1">
          {
            Object.keys(summa2).filter(f => !['id', 'pk'].includes(f)).map((field, index) => (
              <div className="RegisForm_1" key={index + 'key'}>
                <label htmlFor={field}>
                  {
                    formatunderscoreLabel(field)
                  }
                  <span>:</span>
                </label>
                {
                  field === 'IsFromWardStore' ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', width: '150px' }}>
                      <label style={{ width: 'auto' }} htmlFor={`${field}_yes`}>
                        <input
                          required
                          id={`${field}_yes`}
                          type="radio"
                          name={field}
                          style={{ width: '15px' }}
                          value='Yes'
                          onChange={handleonchangesumma2}

                          checked={summa2[field]}

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
                          value='No'
                          onChange={handleonchangesumma2}
                          checked={!summa2[field]}

                        />
                        No
                      </label>
                    </div>
                  ) : ['Location', 'StoreLocation'].includes(field) ? (
                    <select
                      name={field}
                      id={field + 'ind_raise'}
                      value={summa2[field]}
                      onChange={handleonchangesumma2}
                    // disabled={field === 'RequestFromLocation'}
                    >
                      <option value=''>Select</option>
                      {field === 'Location' &&
                        summaArray3.map((ele, ind) => (
                          <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
                        ))}
                      {field === 'StoreLocation' &&
                        summaArray4.map((ele, ind) => (
                          <option key={ind + 'key'} value={ele.id} >{summa2.IsFromWardStore ? ele.WardName : ele.StoreName}</option>
                        ))
                      }
                    </select>
                  )
                    :
                    <input
                      type={field === 'TotalPackQuantity' ? 'number' : 'text'}
                      name={field}
                      onKeyDown={field === 'TotalPackQuantity' ? BlockInvalidcharecternumber : null}
                      value={summa2[field]}
                      onChange={handleonchangesumma2}
                      disabled={field !== 'TotalPackQuantity'}
                    />
                }
              </div>
            ))
          }
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleaddsumma2}>
            {summa2.id ? 'Update' : 'Add'}
          </button>
        </div>
        <br />
        {
          summaArray5.length !== 0 &&
          <ReactGrid columns={summa5column} RowData={summaArray5} />
        }
        <br />
        {summaArray1.length !== 0 && summaArray5.length !== 0 && <div className="Main_container_Btn">
          <button onClick={handleSubmitAll}>
            Submit
          </button>
        </div>}
      </div >
      <ToastAlert Message={toast.message} Type={toast.type} />

    </>
  )
}

export default OldGrnRecieptPage;