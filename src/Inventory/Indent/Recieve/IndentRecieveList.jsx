import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../../OtherComponent/ReactGrid/ReactGrid';

import Button from "@mui/material/Button";
import ListIcon from '@mui/icons-material/List';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { formatunderscoreLabel,formatLabel } from '../../../OtherComponent/OtherFunctions';
import ToastAlert from '../../../OtherComponent/ToastContainer/ToastAlert';


const IndentRecieveList = () => {

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [getstate, setgetstate] = useState(false)

  const currentDate = new Date();
  
       const formatDate = (date) => {
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };
  
        const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  
  const [summa1, setsumma1] = useState({
    Indent_Type: 'issue',
    IssueInvoiceNo: '',
    ReceiveInvoiceNo: '',
    IssueFromLocation: '',
    IssueFromNurseStationStore: false,
    IssueFromStore: '',
    ReceiveFromLocation: '',
    ReceiveFromNurseStationStore: false,
    ReceiveFromStore: '',
    Status: 'Waiting',
    DateType: 'Current',
    CurrentDate: TodayDate,
    FromDate: '',
    ToDate: '',
    ActivePharmacyStoreId : userRecord?.ActivePharmacyStoreId || ""

  })
  const [summa2, setsumma2] = useState([])
  const [summa3, setsumma3] = useState([])
  const [summa4, setsumma4] = useState([])
  const [summa5, setsumma5] = useState([])
  const [summa6, setsumma6] = useState(null)
  const [summa7, setsumma7] = useState(null)


  const handleonchange = (e) => {
    const { name, value } = e.target
    if (name === 'IssueFromNurseStationStore') {
      setsumma1((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        IssueFromStore: ''
      }))
    } else if (name === 'ReceiveFromNurseStationStore') {
      setsumma1((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        ReceiveFromStore: ''
      }))
    } else {
      setsumma1((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  useEffect(() => {
    setsumma1(prev => ({
      ...prev,
      Status: summa1.Indent_Type === 'issue' ? 'Waiting' : 'Received'
    }))
  }, [summa1.Indent_Type])



  useEffect(() => {
    axios.get(`${UrlLink}Masters/Location_Detials_link`)
      .then((res) => {
        const ress = res.data
        setsumma2(ress)
      })
      .catch((err) => {
        console.log(err);
      })

  }, [UrlLink])


  useEffect(() => {
    if (summa1.IssueFromLocation) {
      axios.get(`${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${summa1.IssueFromLocation}&IsFromWardStore=${summa1.IssueFromNurseStationStore}`)
        .then((res) => {
          const ress = res.data
          setsumma3(ress)

        })
        .catch((err) => {
          console.log(err);
          setsumma3([])
        })
    } else {
      setsumma3([])
    }
  }, [UrlLink, summa1.IssueFromLocation, summa1.IssueFromNurseStationStore])

  useEffect(() => {
    if (summa1.ReceiveFromLocation) {
      axios.get(`${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${summa1.ReceiveFromLocation}&IsFromWardStore=${summa1.ReceiveFromNurseStationStore}`)
        .then((res) => {
          const ress = res.data.filter(f => summa1.IssueFromLocation === summa1.ReceiveFromLocation && summa1.IssueFromNurseStationStore === summa1.ReceiveFromNurseStationStore ? f.id !== +summa1.IssueFromStore : f)
          setsumma4(ress)
        })
        .catch((err) => {
          console.log(err);
          setsumma4([])
        })
    } else {
      setsumma4([])
    }
  }, [
    UrlLink,
    summa1.ReceiveFromLocation,
    summa1.ReceiveFromNurseStationStore,
    summa1.IssueFromLocation,
    summa1.IssueFromNurseStationStore,
    summa1.IssueFromStore
  ])

  useEffect(() => {
    axios.get(`${UrlLink}Inventory/Post_Indent_Receive_Details_link`, { params: summa1})
      .then(res => {
        const data = res.data
        // console.log('data????',data);
        
        setsumma5(Array.isArray(data) ? data : [])

      })
      .catch(err => console.error(err))
  }, [UrlLink, summa1,getstate])


  const ItemViewsummacol1 = (params) => {
    console.log("paramsitemrows",params);
    if (params?.Item_Detials && params?.Item_Detials.length !== 0) {
      setsumma6(params)
    }
    else {
      const tdata = {
        message: 'There is no data to view.',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  }

  const HandelStatusdata = (params,  Status = 'Approved') => {

    console.log('111----222',params,Status,summa1.Indent_Type === 'issue' ? params?.Issued_pk : params?.Received_pk);
    
    const confirm = window.confirm(`Are you sure want to ${Status} the Indent. Please double check the Indent detials, because it cannot be updated`)

    if (confirm) {
    axios.post(`${UrlLink}Inventory/Indent_Receive_Details_Approve_link`,{
      IndentType: summa1.Indent_Type,
      InvoiceNo: summa1.Indent_Type === 'Receive' && Status === 'Approved'  ? params?.Received_pk : params?.Issued_pk,
      Status: Status,
      Approved_by: userRecord?.username,
      CancelReceivepk:summa1.Indent_Type === 'Receive' && Status === 'Cancelled'  ? params?.Received_pk : '',
    })
    .then((res)=>{
      console.log(res.data);      
      let data = res.data
      setgetstate(prev => !prev)
      let type = Object.keys(data)[0]
      let mess = Object.values(data)[0]
      const tdata = {
          message: mess,
          type: type
      }
      dispatchvalue({ type: 'toast', value: tdata })

    })
    .catch((err)=>{
      console.log(err);
    })

   }
    

  }

  const HandelProceeddata = (params) => {
    // navigate('/Home/IndentRecieve')
    navigate("/Home/InventoryMaster");
    dispatchvalue({ type: "HrFolder", value: "IndentRecieve" });
    dispatchvalue({ type: "setPreviousFolder", value: null }); 
    dispatchvalue({ type: "showMenu", value: true });
    console.log("paramsedit",params)
    dispatchvalue({ type: 'IndentEditData', value: { ...params, Received_pk: null } });
  }


  const HandelEditdata = (params) => {

    navigate('/Home/IndentRecieve')
    dispatchvalue({ type: 'IndentEditData', value: { ...params } });
  }

  const summacolumn1 = [
    {
      key: 'id',
      name: 'S.No',
    },
    {
      key: 'issue_Indent_Type',
      name: 'Indent Issue Type',
      width: 180
    },
    {
      key: 'Raised_pk',
      name: 'Indent Raise Invoice No',
      renderCell: (params) => (
        params.row.Raised_pk ?? '-'
      ),
      width: 200
    },
    {
      key: 'Issued_pk',
      name: 'Indent Issue Invoice No',
      width: 200,
      renderCell: (params) => (
        params.row.Issued_pk ?? '-'
      ),
    },
    {
      key: 'Received_pk',
      name: 'Indent Receive Invoice No',
      width: 200, renderCell: (params) => (
        params.row.Received_pk ?? '-'
      ),
    },
    {
      key: 'IssuedApprovedDate',
      name: 'Issued Date',
      renderCell: (params) => (
        params.row.IssuedApprovedDate ?? '-'
      ),
    },
    {
      key: 'IssuedFrom',
      name: 'Issued From',
      width: 200,
      renderCell: (params) => (
        params.row.Issued_pk ?
            `${params.row.IssuedFromLocation} - ${params.row.IssuedFromNurseStation ? 'NurseStation' : 'store'} - ${params.row.IssuedFromNurseStation ? params.row.IssuedFromNurseStationWard : params.row.IssuedFromStore}`
            : '-'
    )
    },
    {
      key: 'ReceiveFrom',
      name: 'Receive From',
      width: 200,
      renderCell: (params) => (
        params.row.Issued_pk ?
            `${params.row.IssuedToLocation} - ${params.row.IssuedToNurseStation ? 'NurseStation' : 'store'} - ${params.row.IssuedToNurseStation ? params.row.IssuedToNurseStationWard : params.row.IssuedToStore}`
            : '-'
      )
    },
    {
      key: 'Item_Detials',
      name: 'Indent Items List',
      width: 170,
      renderCell: (params) => (
        <>
          <Button className="cell_btn"
            onClick={() => ItemViewsummacol1(params.row)}
          >
            <ListIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      )
    },

    {
      key: 'IssuedApproved_by',
      name: 'Issued By',
      renderCell: (params) => (
        params.row.IssuedApproved_by ?? '-'
      ),
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => {
        const rows = params.row
        return (
          summa1.Indent_Type === 'issue' && rows.issue_Receive_Status === 'Waiting' ?
            <>
              <Button className="cell_btn"
                title='Cancel the Indent'
                onClick={() => HandelStatusdata(rows, 'Cancelled')}
              >
                <DeleteIcon className="check_box_clrr_cancell" />
              </Button>
              <Button className="cell_btn"
                title='Proceed the Indent'
                onClick={() => HandelProceeddata(rows)}
              >
                <ArrowForwardIcon className="check_box_clrr_cancell" />
              </Button>
            </>
            :
            summa1.Indent_Type === 'Receive' && rows.Receive_Receive_Status === 'Received' ?
              <>
                <Button className="cell_btn"
                  title='Cancel the Indent'
                  onClick={() => HandelStatusdata(rows, 'Cancelled')}
                >
                  <DeleteIcon className="check_box_clrr_cancell" />
                </Button>
                <Button className="cell_btn"
                  title='Edit the Indent'
                  onClick={() => HandelEditdata(rows)}
                >
                  <EditIcon className="check_box_clrr_cancell" />
                </Button>
                <Button className="cell_btn"
                  title='Approve the Indent'
                  onClick={() => HandelStatusdata(rows, 'Approved')}
                >
                  <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
                </Button>
              </>
              :
              'No Action'
        )
      },
    },
  ]

  const summacolumn2 = [
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
      key: 'RaisedQuantity',
      name: 'Raised Quantity',
      renderCell: (params) => (
        params.row.RaisedQuantity ?? '-'
      )
    },
    {
      key: 'IssueQuantity',
      name: 'Issued Quantity',
      renderCell: (params) => (
        params.row.IssueQuantity ?? '-'
      )
    },
    ...(['SerialNo', 'ReceivedSerialNo', 'DamagedSerialNo', 'PendingSerialNo'].map(ele => {
      return {
        key: ele,
        name: formatLabel(ele),
        renderCell: (params) => {
          const row = params.row
          return (
            <>
              {
                row.SerialNoAvailable ? (
                  row[ele] && row[ele].length !== 0 ? (
                    <Button onClick={() => setsumma7({ ...row, Type: ele })}>
                      view
                    </Button>
                  ) :
                    'No Serial no Selected'
                ) :
                  'serial no not available'
              }
            </>
          )
        }
      }
    })),
    {
      key: 'Receive_Status',
      name: 'Receive Status',
      renderCell: (params) => (
        params.row.Receive_Status ?? '-'
      )
    },
  ]
  return (
    <>
      <div className="Main_container_app">
        <h3>Indent Receive List</h3>
        <br />
        <div className="RegisFormcon_1">
          {
            Object.keys(summa1).filter(ele => {
              if (summa1.DateType === 'Current' && (ele === 'FromDate' || ele === 'ToDate')) {
                return false
              } else if (summa1.DateType !== 'Current' && ele === 'CurrentDate') {
                return false
              } else {
                return true
              }
            }).map((field, indx) => (
              <div className="RegisForm_1" key={indx}>
                <label>{field.includes(['_']) ? formatunderscoreLabel(field) : formatLabel(field) }<span>:</span></label>

                {
                  ['Indent_Type', 'DateType', 'IssueFromLocation', 'IssueFromStore', 'ReceiveFromLocation', 'ReceiveFromStore', 'Status',].includes(field) ? (
                    <select
                      name={field}
                      value={summa1[field]}
                      onChange={handleonchange}
                    >
                      {!['DateType', 'Indent_Type'].includes(field) && <option value=''>Select</option>}

                      {field === 'Indent_Type' && (
                        ['issue', 'Receive'].map((ele, indx) => (
                          <option key={indx} value={ele}>{ele}</option>
                        ))
                      )}
                      {field === 'DateType' && (
                        ['Current', 'Customize'].map((ele, indx) => (
                          <option key={indx} value={ele}>{ele}</option>
                        ))
                      )}
                      {field === 'Status' && (
                        ['Waiting', 'Completed', 'Received', 'Approved', 'Cancelled'].filter(f => summa1.Indent_Type === 'issue' ? ['Waiting', 'Completed', 'Cancelled'].includes(f) : !['Waiting', 'Pending', 'Completed'].includes(f)).map((ele, indx) => (
                          <option key={indx} value={ele}>{ele}</option>
                        ))
                      )}
                      {['IssueFromLocation', 'ReceiveFromLocation'].includes(field) &&
                        summa2.map((ele, ind) => (
                          <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
                        ))
                      }
                      {['IssueFromStore'].includes(field) &&
                        summa3.map((ele, ind) => (
                          <option key={ind + 'key'} value={ele.id} >{summa1.IssueFromNurseStationStore ? ele.NurseStation : ele.StoreName}</option>
                        ))
                      }

                      {['ReceiveFromStore'].includes(field) &&
                        summa4.map((ele, ind) => (
                          <option key={ind + 'key'} value={ele.id} >{summa1?.ReceiveFromNurseStationStore ? ele.NurseStation : ele.StoreName}</option>
                        ))
                      }
                    </select>
                  ) : ['IssueFromNurseStationStore', 'ReceiveFromNurseStationStore'].includes(field) ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', width: '150px' }}>
                      <label style={{ width: 'auto' }} htmlFor={`${field}_yes`}>
                        <input
                          required
                          id={`${field}_yes`}
                          type="radio"
                          name={field}
                          style={{ width: '15px' }}
                          value='Yes'
                          onChange={handleonchange}
                          checked={summa1[field]}

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
                          onChange={handleonchange}
                          checked={!summa1[field]}

                        />
                        No
                      </label>
                    </div>
                  ) :
                    (
                      <input
                        type={['CurrentDate', 'FromDate', 'ToDate'].includes(field) ? 'date' : 'text'}
                        name={field}
                        value={summa1[field]}
                        onChange={handleonchange}

                      />
                    )
                }
              </div>
            ))
          }
        </div>
        <br />
        <ReactGrid columns={summacolumn1} RowData={summa5} />

      </div>

      {
        summa6 &&
        <div className="loader" onClick={() => {
          setsumma6(null)
          setsumma7(null)
        }}>
          <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
            <div className="common_center_tag">
              <span>Item Details</span>
            </div>
            <br />
            <ReactGrid columns={summacolumn2} RowData={summa6?.Item_Detials} />
            {
              summa7 && (
                <>
                  <br />
                  <center>{summa7?.Receivedpk? formatLabel(summa7?.Type) :' Serial No'} for {summa7?.ItemCode}-{summa7?.ItemName}</center>
                  <center>Batch No: {summa7?.BatchNo}, IssueQuantity: {summa7?.Receivedpk ? summa7?.IssuedQuantity : summa7?.IssueQuantity}</center>
                  <div className='inventory-serial-numbers-container'>

                    <span>
                      Received Quantity : {summa7?.ReceivedQuantity}
                    </span>
                    {/* <br /> */}
                    <span>
                      Damaged Quantity : {summa7?.DamagedQuantity}
                    </span>
                    {/* <br /> */}
                    <span>
                      Pending Quantity : {summa7?.PendingQuantity}
                    </span>
                  </div>
                  <br />
                  <div className='inventory-serial-numbers-container'>
                    {Array.isArray(summa7[summa7?.Type]) && summa7[summa7?.Type]?.map(field => (
                      <div
                        key={field.pk}
                        className={`inventory-serial-number`}
                        style={{ color: 'black' }}
                      >
                        {field.Serial_Number}

                      </div>
                    ))}
                  </div>
                </>
              )
            }
          </div>
        </div>
      }

      <ToastAlert Message={toast.message} Type={toast.type} />

    </>
  )
}

export default IndentRecieveList;