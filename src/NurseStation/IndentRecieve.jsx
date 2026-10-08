import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'
import { BlockInvalidcharecternumber, formatLabel,formatunderscoreLabel } from '../OtherComponent/OtherFunctions';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { MdOutlineGppBad, MdGppGood } from "react-icons/md";
import axios from 'axios';

const IndentRecieve = () => {

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);
  const IndentEditData = useSelector(state => state.Inventorydata?.IndentEditData);
  console.log("IndentEditData",IndentEditData)

  const userRecord = useSelector((state) => state.userRecord?.UserData);


  console.log('0000----',IndentEditData);
  

  const [summa1, setsumma1] = useState({

    Received_pk: '',
    ReceivedReason: '',
  })
  const [summa2, setsumma2] = useState([])
  const [summa3, setsumma3] = useState({
    id: null,
    Receivedpk: '',
    Issuedpk: '',
    ItemCode: '',
    ItemName: '',
    ProductCategory: '',
    SubCategory: '',
    PackType: '',
    PackQuantity: '',
    RaisedQuantity: 0,
    BatchNo: '',
    SerialNoAvailable: false,
    IssuedReason: '',
    IssuedQuantity: 0,
    ReceivedQuantity: 0,
    DamagedQuantity: 0,
    PendingQuantity: 0,
    SerialNo: [],
    ReceivedSerialNo: [],
    DamagedSerialNo: [],
    PendingSerialNo: [],
    Remarks: '',
  })
  const [summa4, setsumma4] = useState(null)
  const [summa5, setsumma5] = useState([])



  useEffect(() => {
    if (Object.keys(IndentEditData).length !== 0) {
      const { Item_Detials, ...rest } = IndentEditData
      console.log("IndentEditData",IndentEditData)

      setsumma1({
        Received_pk: rest?.Received_pk,
        Issued_pk: rest?.Issued_pk,
        Raised_pk: rest?.Raised_pk,
        RaisedFromLocation: rest?.RaisedFromLocation,
        RaisedFromStore: `${rest?.RaisedFromNurseStation ? 'NurseStation' : 'Store'} - ${rest?.RaisedFromNurseStation ? rest?.RaisedFromNurseStationWard : rest?.RaisedFromStore}`,
        IssuedFromLocation: rest?.IssuedFromLocation,
        IssuedFromStore: `${rest?.IssuedFromNurseStation ? 'NurseStation' : 'Store'} - ${rest?.IssuedFromNurseStation ? rest?.IssuedFromNurseStationWard : rest?.IssuedFromStore}`,
        ReceivedFromLocation: rest?.IssuedToLocation,
        ReceiveFromStore: `${rest?.IssuedToNurseStation ? 'NurseStation' : 'Store'} - ${rest?.IssuedToNurseStation ? rest?.IssuedToNurseStationWard : rest?.IssuedToStore}`,
        RaisedDate: rest?.RaisedDate,
        IssuedDate: rest?.IssuedDate,
        ReceivedDate: format(new Date(), 'yyyy-MM-dd'),
        RaisedReason: rest?.RaisedReason,
        ReceivedReason: '',
      })
      setsumma2(Item_Detials)
      setsumma5(rest?.Received_pk ? Item_Detials :[])
    } else {
             navigate("/Home/NurseStationFolder");
            dispatchvalue({ type: "HrFolder", value: "IndentRecieveList" });
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });
      // navigate('/Home/IndentRecieveList')
    }
  }, [IndentEditData])



  const handleeditsumma2 = (params) => {

    const issuedserialno = params?.SerialNoAvailable ? params?.SerialNo.map((ele, indx) => {

      return {
        pk: ele.pk,
        Serial_Number: ele.Serial_Number,
        Status: params?.ReceivedQuantity > indx,  // Simplified to just the condition
        Item_Status: ele.Item_Status,
        Product_Status: (params?.ReceivedQuantity > indx && params?.DamagedQuantity > indx) ? 'damaged' : 'good',
      }
    }) : [];


    const receivedserialno = issuedserialno.filter(ele => ele.Status)
    const pendingserialno = issuedserialno.filter(ele => !ele.Status)
    const damagedserialno = issuedserialno.filter(ele => ele.Status && ele.Product_Status === 'damaged')

    setsumma3({
      id: null,
      Receivedpk: params?.Receivedpk || null,
      Issuedpk: params?.Issuedpk || null,
      ItemCode: params?.ItemCode,
      ItemName: params?.ItemName,
      ProductCategory: params?.ProductCategory,
      SubCategory: params?.SubCategory,
      PackType: params?.PackType,
      PackQuantity: params?.PackQuantity,
      RaisedQuantity: params?.RaisedQuantity,
      BatchNo: params?.BatchNo,
      SerialNoAvailable: params?.SerialNoAvailable,
      IssuedReason: params?.Reason,
      IssuedQuantity: params?.IssueQuantity,
      ReceivedQuantity: params?.ReceivedQuantity,
      DamagedQuantity: params?.DamagedQuantity,
      PendingQuantity: 0,
      SerialNo: issuedserialno,
      ReceivedSerialNo: receivedserialno,
      DamagedSerialNo: damagedserialno,
      PendingSerialNo: pendingserialno,
      Remarks: '',
    })
  }
  console.log(summa3);


  const handleselectSerialNo = (params, serialedit = false) => {
    if (summa3[params].length === 0) {
      const tdata = {
        message: `There is no serial number for ${formatLabel(params)}.`,
        type: 'warn',
      }
      dispatchvalue({ type: 'toast', value: tdata });
    } else {
      setsumma4({
        ...summa3,
        serialNoViewtype: params,
        serialedit,
      })
    }

  }
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

    {
      key: 'SerialNo',
      name: 'SerialNo',
      renderCell: (params) => {
        const row = params.row
        return (
          <>
            {
              row.SerialNoAvailable ? (
                row?.SerialNo && row?.SerialNo.length !== 0 ? (
                  <Button onClick={() => setsumma4({
                    ...row,
                    serialNoViewtype: 'SerialNo',
                    serialedit: false,
                  })}>
                    view serial No
                  </Button>
                ) :
                  'No Serial no Selected'
              ) :
                'serial no not available'
            }
          </>
        )
      }
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        params.row.Receive_Status === 'Waiting' ?

          <>
            <Button className="cell_btn" onClick={() => handleeditsumma2(params.row)} >
              <EditIcon className="check_box_clrr_cancell" />
            </Button>

          </>
          : 'No Action'
      )
    },
  ]


  const handlesaveserialno = () => {
    const receivedserialno = summa4?.SerialNo.filter(ele => ele.Status)
    const pendingserialno = summa4?.SerialNo.filter(ele => !ele.Status)
    const damagedserialno = summa4?.SerialNo.filter(ele => ele.Status && ele.Product_Status === 'damaged')

    // Check if the ReceivedQuantity matches the length of received serials and DamagedQuantity matches damaged serials
    if (summa4.ReceivedQuantity === receivedserialno.length && summa4?.DamagedQuantity === damagedserialno.length) {
      const { SerialNo, ReceivedQuantity, DamagedQuantity, serialNoViewtype, serialedit, ...rest } = summa4;  // Proper object destructuring
      setsumma3(prev => ({
        ...prev,
        SerialNo: SerialNo, // spreading the SerialNo
        ReceivedSerialNo: receivedserialno,
        DamagedSerialNo: damagedserialno,
        PendingSerialNo: pendingserialno,
      }));
      setsumma4(null)
    } else {
      const tdata = {
        message: 'The number of received or damaged serial numbers does not match the expected quantities.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  }

  const handleeditsumma5 = (params) => {
    setsumma3(params)
  }

  const summacolumn5 = [
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
      key: 'BatchNo',
      name: 'Batch No',
    },
    {
      key: 'IssuedQuantity',
      name: 'Issued Quantity',
      renderCell: (params) => (
        params.row.IssuedQuantity ?? '-'
      )
    },
    {
      key: 'ReceivedQuantity',
      name: 'Received Quantity',
      renderCell: (params) => (
        params.row.ReceivedQuantity ?? '-'
      )
    },
    {
      key: 'DamagedQuantity',
      name: 'Damaged Quantity',
      renderCell: (params) => (
        params.row.DamagedQuantity ?? '-'
      )
    },
    {
      key: 'PendingQuantity',
      name: 'Pending Quantity',
      renderCell: (params) => (
        params.row.PendingQuantity ?? '-'
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
                    <Button onClick={() => setsumma4({
                      ...row,
                      serialNoViewtype: ele,
                      serialedit: false,
                    })}>
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
      key: 'Remarks',
      name: 'Remarks',
      renderCell: (params) => (
        params.row.Remarks ?? '-'
      )
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (

        <>
          <Button className="cell_btn" onClick={() => handleeditsumma5(params.row)} >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>

        </>

      )
    },
  ]
  const handlesubmitsumma3 = () => {
    const receivedserialno = summa3?.SerialNo.filter(ele => ele.Status)
    const damagedserialno = summa3?.SerialNo.filter(ele => ele.Status && ele.Product_Status === 'damaged')

    // Check if the ReceivedQuantity matches the length of received serials and DamagedQuantity matches damaged serials
    if (summa3?.SerialNoAvailable ? summa3?.ReceivedQuantity === receivedserialno.length && summa3?.DamagedQuantity === damagedserialno.length : true) {
      if (summa3.id) {
        setsumma5((prev) =>
          prev.map((product) => +product.id === summa3.id ? { ...summa3 } : product)
        )

      } else {
        setsumma5((prev) => ([
          ...prev,
          {
            ...summa3,
            id: prev.length + 1
          }
        ]))

      }



      setsumma3({
        id: null,
        Receivedpk: '',
        Issuedpk: '',
        ItemCode: '',
        ItemName: '',
        ProductCategory: '',
        SubCategory: '',
        PackType: '',
        PackQuantity: '',
        RaisedQuantity: 0,
        BatchNo: '',
        SerialNoAvailable: false,
        IssuedReason: '',
        IssuedQuantity: 0,
        ReceivedQuantity: 0,
        DamagedQuantity: 0,
        PendingQuantity: 0,
        SerialNo: [],
        ReceivedSerialNo: [],
        DamagedSerialNo: [],
        PendingSerialNo: [],
        Remarks: '',
      })
    } else {
      const tdata = {
        message: 'The number of received or damaged serial numbers does not match the expected quantities.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }

  }

  useEffect(() => {
    setsumma2(prev => {
      return prev.map(ele => {
        const matchingItem = summa5.find(item =>
          "" + item.Issuedpk === "" + ele.Issuedpk &&
          "" + item.ItemCode === "" + ele.ItemCode &&
          "" + item.BatchNo === "" + ele.BatchNo &&
          "" + item.IssuedReason === "" + ele.Reason
        );

        if (matchingItem) {
          return { ...ele, Receive_Status: 'Completed' };
        }

        return ele;
      });
    });
  }, [summa5]);


  const handlesubmitsumma1 = () => {
    if (summa2.length === summa5.length) {
      const data = {
        ...summa1,
        createdBy:userRecord?.username,
        Items_Data: summa5
      }
      axios.post(`${UrlLink}Inventory/Post_Indent_Receive_Details_link`, data)
        .then(response => {
          console.log('Submission successful:', response);
          let data = response.data
          let type = data?.status
          let mess = data?.message
          const tdata = {
            message: mess,
            type: type
          }
          dispatchvalue({ type: 'toast', value: tdata })
          if (type === 'success') {
            // navigate('/Home/IndentRecieveList')
            navigate("/Home/NurseStationFolder");
            dispatchvalue({ type: "HrFolder", value: "IndentRecieveList" });
            dispatchvalue({ type: "setPreviousFolder", value: null }); 
            dispatchvalue({ type: "showMenu", value: true });
          }
        })
        .catch(error => {
          console.error('Error during submission:', error);
        });
    } else {
      const tdata = {
        message: 'The list of issued items does not match the list of received items.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  }




  return (
    <>
      <div className="Main_container_app">
        <h3> Indent Recieve </h3>
        <br />
        <div className="RegisFormcon_1">
          {
            Object.keys(summa1).filter(f => {
              if (f === 'Received_pk' && !summa1[f]) {
                return false
              }
              return true
            }).map((field, indx) => (
              <div className="RegisForm_1" key={indx + 'Indent_receive_key'}>
                <label htmlFor={field + 'ind_issue'}>
                {field.includes(['_']) ? formatunderscoreLabel(field) : formatLabel(field) }
                </label>
                {
                  field === 'ReceivedReason' ? (
                    <textarea
                      required
                      id={field + 'ind_receive'}
                      name={field}
                      value={summa1[field]}
                      onChange={(e) => {
                        setsumma1(prev => ({
                          ...prev,
                          ReceivedReason: e.target.value
                        }))
                      }}

                    />
                  ) : (
                    <input
                      required
                      id={field + 'ind_receive'}
                      type='text'
                      name={field}
                      value={summa1[field]}
                      disabled
                    />
                  )
                }
              </div>
            ))
          }
        </div>
        <div className='RegisFormcon_1 jjxjx_'>
        < ReactGrid columns={summacolumn2} RowData={summa2} />
        </div>
        {['ItemCode', 'BatchNo'].every(ele => summa3[ele]) &&
          <>
            <div className="RegisFormcon_1">
              {
                Object.keys(summa3).filter(f => {
                  if (['SerialNoAvailable', 'id', 'Receivedpk'].includes(f)) {
                    return false;
                  }

                  if (['SerialNo', 'ReceivedSerialNo', 'DamagedSerialNo', 'PendingSerialNo'].includes(f) && !summa3['SerialNoAvailable']) {
                    return false;
                  }

                  return true;
                }).map((field, index) => (
                  <div className="RegisForm_1" key={index + 'ind_receive_key'}>
                    <label htmlFor={field}>
                      {formatLabel(field)}
                      <span>:</span>
                    </label>
                    {
                      ['SerialNo', 'ReceivedSerialNo', 'DamagedSerialNo', 'PendingSerialNo'].includes(field) ? (
                        <div style={{ width: '150px', display: 'flex', justifyContent: 'space-around' }}>
                          <button className='fileviewbtn'
                            onClick={() => handleselectSerialNo(field, field === 'SerialNo')}
                          >
                            {`${field === 'SerialNo' ? 'Select' : 'View'} Serial No`}
                          </button>
                        </div>
                      ) : field === 'Remarks' ? (
                        <textarea
                          name={field}
                          value={summa3[field]}
                          onChange={(e) => setsumma3(prev => ({ ...prev, [field]: e.target.value }))}
                        />
                      ) : (
                        <input
                          required
                          id={field + 'ind_receive'}
                          type={['ReceivedQuantity', 'DamagedQuantity'].includes(field) ? 'number' : 'text'}
                          onKeyDown={['ReceivedQuantity', 'DamagedQuantity'].includes(field) ? BlockInvalidcharecternumber : null}
                          name={field}
                          value={summa3[field]}
                          onChange={(e) => setsumma3(prev => {
                            const value = parseInt(e.target.value || 0)
                            if (field === 'ReceivedQuantity') {
                              if (value <= prev.IssuedQuantity) {
                                return {
                                  ...prev,
                                  [field]: value,
                                  PendingQuantity: prev.IssuedQuantity - value
                                };
                              } else {
                                return {
                                  ...prev,
                                  [field]: 0,
                                  PendingQuantity: prev.IssuedQuantity
                                };
                              }
                            } else if (field === 'DamagedQuantity') {
                              if (value <= prev.ReceivedQuantity) {
                                return {
                                  ...prev,
                                  [field]: value
                                };
                              } else {
                                return {
                                  ...prev,
                                  [field]: 0
                                };
                              }
                            }
                          })}
                          disabled={['ReceivedQuantity', 'DamagedQuantity'].filter(ele => summa3.IssuedReason === 'DamagedProducts' ? ele !== 'DamagedQuantity' : ele).includes(field) ? false : true}
                        />
                      )

                    }

                  </div>
                ))
              }
            </div>
            <div className="Main_container_Btn">
              <button onClick={handlesubmitsumma3}>
                {summa3?.id ? 'Update' : 'Add'}
              </button>
            </div>
          </>
        }
        <br />
        {summa5.length !== 0 && (
          <>
          <div className='RegisFormcon_1 jjxjx_'>
            < ReactGrid columns={summacolumn5} RowData={summa5} />
          </div>
            <div className="Main_container_Btn">
              <button onClick={handlesubmitsumma1}>
                {summa1?.Received_pk ? 'Update Indent' : 'Save Indent'}
              </button>
            </div>
          </>
        )}

      </div >


      {
        summa4 && (
          <div className="loader" onClick={() => setsumma4(null)}>
            <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
              <div className="common_center_tag">
                <span>Selected Serial No for {summa4?.ItemName} Batch No {summa4?.BatchNo}</span>
                <br />

                <div className='inventory-serial-numbers-container'>
                  <span>
                    Issued Quantity : {summa4?.IssuedQuantity}
                  </span>
                  {/* <br /> */}
                  <span>
                    Received Quantity : {summa4?.ReceivedQuantity}
                  </span>
                  {/* <br /> */}
                  <span>
                    Damaged Quantity : {summa4?.DamagedQuantity}
                  </span>
                  {/* <br /> */}
                  <span>
                    Pending Quantity : {summa4?.PendingQuantity}
                  </span>
                </div>

              </div>
              <br />
              <div className='inventory-serial-numbers-container'>
                {Array.isArray(summa4[summa4?.serialNoViewtype]) && summa4[summa4?.serialNoViewtype].map(field => (
                  <div
                    key={field.pk}
                    className={`inventory-serial-number ${summa4?.serialedit ? field.Status ? field.Product_Status === 'damaged' ? 'damaged' : 'active' : 'inactive' : ''}`}
                    style={{ color: 'black' }}
                  >
                    {field.Serial_Number}
                    {
                      summa4?.serialedit && (
                        <span className="inventory-icon-container">
                          <span

                            onClick={() => {
                              setsumma4(prev => {
                                const selectedCount = prev.SerialNo.filter((item) => item.Status).length;
                                return {
                                  ...prev,
                                  SerialNo: prev.SerialNo.map(item =>
                                    item.pk === field.pk ?
                                      {
                                        ...item,
                                        Status: item.Status || selectedCount < summa3.ReceivedQuantity ? !item.Status : item.Status,
                                        Product_Status: 'good'
                                      }
                                      :
                                      item
                                  )
                                }
                              })
                            }}
                          >
                            {field.Status ? <FaTimes /> : <FaPlus />}
                          </span>
                          {
                            summa3.DamagedQuantity !== 0 && field.Status &&
                            <span
                              onClick={() => {
                                setsumma4(prev => {
                                  const selectedCount = prev.SerialNo.filter((item) => item.Status && item.Product_Status === 'damaged').length;
                                  return {
                                    ...prev,
                                    SerialNo: prev.SerialNo.map(item =>
                                      item.pk === field.pk ?
                                        {
                                          ...item,
                                          Product_Status: selectedCount < summa3.DamagedQuantity ? item.Product_Status === 'good' ? 'damaged' : 'good' : item.Product_Status
                                        }
                                        :
                                        item
                                    )
                                  }
                                })
                              }}
                            >
                              {field.Product_Status === 'good' ? <MdOutlineGppBad /> : <MdGppGood />}
                            </span>
                          }
                        </span>
                      )
                    }
                  </div>
                ))}
              </div>
              <br />
              {summa4?.serialedit &&
                <Button
                  style={{ backgroundColor: '#94b2bb' }}
                  onClick={handlesaveserialno}
                >
                  Save SerialNo
                </Button>}
            </div>


          </div>
        )
      }
      <ToastAlert Message={toast.message} Type={toast.type} />

    </>
  )
}

export default IndentRecieve