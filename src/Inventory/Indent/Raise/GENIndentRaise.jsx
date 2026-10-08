import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BlockInvalidcharecternumber,
  formatLabel,
} from '../../../OtherComponent/OtherFunctions';
import axios from 'axios';
import { format } from 'date-fns';
import ReactGrid from '../../../OtherComponent/ReactGrid/ReactGrid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ToastAlert from '../../../OtherComponent/ToastContainer/ToastAlert';

const GENIndentRaise = () => {
  const dispatchvalue = useDispatch();

  const navigate = useNavigate();

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const toast = useSelector((state) => state.userRecord?.toast);
  const IndentEditData = useSelector(
    (state) => state.Inventorydata?.IndentEditData
  );

  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const [summa1, setsumma1] = useState({
    pk: null,
    RequestFromLocation: '',
    RequestFromNurseStation: false,
    RequestFromStore: UserData?.ActivePharmacyStoreId || '',
    RequestToLocation: '',
    RequestToNurseStation: false,
    RequestToStore: '1',
    RequestDate: '',
    Reason: '',
  });
  const [summa2, setsumma2] = useState({
    id: null,
    pk: null,
    ItemCode: '',
    ItemName: '',
    RaisedQuantity: '',
    Reason: '',
    Status: 'Pending',
  });

  console.log('summa2', summa2);
  const [summaArray1, setsummaArray1] = useState([]);
  const [summaArray2, setsummaArray2] = useState([]);
  const [summaArray3, setsummaArray3] = useState([]);
  const [summaArray4, setsummaArray4] = useState([]);
  console.log('summaArray4---',summaArray4)
  const [summaArray5, setsummaArray5] = useState([]);

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

    setsumma1((prev) => ({
      ...prev,
      RequestDate: format(new Date(), 'yyyy-MM-dd'),
    }));
  }, [UrlLink]);

  useEffect(() => {
    if (summa1.RequestFromLocation) {
      axios
        .get(
          `${UrlLink}Inventory/get_ward_depart_detials_by_loc?Location=${summa1.RequestFromLocation}&IsFromWardStore=${summa1.RequestFromNurseStation}`
        )
        .then((res) => {
          const ress = res.data;
          setsummaArray2(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setsummaArray2([]);
    }
  }, [UrlLink, summa1.RequestFromLocation, summa1.RequestFromNurseStation]);

  useEffect(() => {
    if (summa1.RequestToLocation) {
      axios
        .get(
          `${UrlLink}Inventory/GEN_get_ward_store_detials_by_loc?Location=${summa1.RequestToLocation}&IsFromWardStore=${summa1.RequestToNurseStation}`
        )
        .then((res) => {
          const ress = res.data.filter((f) =>
            summa1.RequestFromLocation === summa1.RequestToLocation &&
            summa1.RequestFromNurseStation === summa1.RequestToNurseStation
              ? f.id !== +summa1.RequestFromStore
              : f
          );
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
    summa1.RequestToLocation,
    summa1.RequestToNurseStation,
    summa1.RequestFromLocation,
    summa1.RequestFromNurseStation,
    summa1.RequestFromStore,
  ]);

  useEffect(() => {
    setsumma1((prev) => ({
      ...prev,
      RequestFromLocation: userRecord?.location,
      RequestToLocation: userRecord?.location,
    }));
  }, [userRecord?.location]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Inventory/Gen_get_item_detials_for_indent?ItemCode=${summa2.ItemCode}&ItemName=${summa2.ItemName}&loc=${summa1.RequestFromStore}`
      )
      .then((res) => {
        const ress = res.data;
        setsummaArray4(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, summa2.ItemCode, summa2.ItemName]);

  useEffect(() => {
    if (Object.keys(IndentEditData).length) {
      setsumma1({
        pk: IndentEditData?.pk,
        RequestFromLocation: IndentEditData?.RaisedFromLocation_pk,
        RequestFromNurseStation: IndentEditData?.RaisedFromNurseStation,
        RequestFromStore: IndentEditData?.RaisedFromNurseStation
          ? IndentEditData?.RaisedFromNurseStation_pk
          : IndentEditData?.RaisedFromStore_pk,
        RequestToLocation: IndentEditData?.RaisedToLocation_pk,
        RequestToNurseStation: IndentEditData?.RequestToNurseStation,
        RequestToStore: IndentEditData?.RequestToNurseStation
          ? IndentEditData?.RaisedToStoreNurseStation_pk
          : IndentEditData?.RaisedToStore_pk,
        RequestDate: IndentEditData?.RaisedDate,
        Reason: IndentEditData?.RaisedReason,
      });
      if (IndentEditData?.Item_Detials) {
        setsummaArray5(IndentEditData?.Item_Detials);
      }
    }
  }, [IndentEditData]);

  const handleonchangesumma1 = (e) => {
    const { name, value } = e.target;
    if (name === 'RequestFromNurseStation') {
      setsumma1((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        RequestFromStore: '',
      }));
    } else if (name === 'RequestToNurseStation') {
      setsumma1((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        RequestToStore: '',
      }));
    } else {
      setsumma1((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleonchangesumma2 = (e) => {
    const { name, value } = e.target;

    if (name === 'ItemCode') {
      setsumma2((prev) => ({
        id: prev.id,
        pk: prev.pk,
        [name]: value,
        ItemName: '',
        RaisedQuantity: '',
        Reason: '',
        Status: 'Pending',
      }));
    } else if (name === 'ItemName') {
      setsumma2((prev) => ({
        id: prev.id,
        pk: prev.pk,
        ItemCode: '',
        [name]: value,
        RaisedQuantity: '',
        Reason: '',
        Status: 'Pending',
      }));
    } else {
      setsumma2((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlesearchItems = (type = 'id') => {
    if (summa2.ItemCode || summa2.ItemName) {
      let find = summaArray4.find((ele) => '' + ele.id === summa2.ItemCode);
      if (type !== 'id') {
        find = summaArray4.find((ele) => '' + ele.ItemName === summa2.ItemName);
      }
      if (find) {
        const { id, ItemName, ...rest } = find;
        setsumma2((prev) => ({
          id: prev.id,
          pk: prev.pk,
          ItemCode: id,
          ItemName: ItemName,
          ...rest,
          RaisedQuantity: '',
          Reason: '',
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
        pk: prev.pk,
        ItemCode: type === 'id' ? prev.ItemCode : '',
        ItemName: type !== 'id' ? prev.ItemName : '',
        RaisedQuantity: '',
        Reason: '',
        Status: prev?.Status,
      }));
      const tdata = {
        message: `Please fill atleast any one of the Item Code or Item Name to search.`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  const handleAddsumma2 = () => {
    const missingFields = Object.keys(summa2)
      .filter((f) => !['id', 'pk', 'Status', 'Reason','HSNCode','PackQuantity','PackType','SubCategory','GenericName'].includes(f))
      .filter((f) => !summa2[f]);
    if (missingFields.length !== 0) {
      const tdata = {
        message: `Please fill out all required fields: ${missingFields.join(', ')}`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else {
      const CheckDublicate = summaArray5.some(
        (ele) => ele.ItemCode === summa2.ItemCode && +ele.id !== +summa2.id
      );
      if (CheckDublicate) {
        dispatchvalue({
          type: 'toast',
          value: {
            message: `This item has already been entered.`,
            type: 'warn',
          },
        });
      } else {
        if (summa2.id) {
          setsummaArray5((prev) =>
            prev.map((product) =>
              +product.id === summa2.id ? { ...summa2 } : product
            )
          );
          setsumma2({
            id: null,
            pk: null,
            ItemCode: '',
            ItemName: '',
            RaisedQuantity: '',
            Reason: '',
            Status: 'Pending',
          });
        } else {
          setsummaArray5((prev) => [
            ...prev,
            {
              ...summa2,
              id: prev.length + 1,
            },
          ]);
          setsumma2({
            id: null,
            pk: null,
            ItemCode: '',
            ItemName: '',
            RaisedQuantity: '',
            Reason: '',
            Status: 'Pending',
          });
        }
      }
    }
  };

  const handelDeletesumma2 = (params) => {
    if (params.pk) {
      setsummaArray5((prev) =>
        prev.map((product) =>
          +product.pk === +params.pk
            ? { ...product, Status: 'Cancelled' }
            : product
        )
      );
    } else {
      setsummaArray5((prev) => prev.filter((p) => +p.id !== +params.id));
    }
  };

  const handelEditsumma2 = async (params) => {
    try {
      const findadata = await axios.get(
        `${UrlLink}Inventory/Gen_get_item_detials_for_indent`,
        {
          params: {
            ItemCode: params.ItemCode,
            ItemName: params.ItemName,
          },
        }
      );
      const summadata = findadata.data[0];
      const { id, ItemName, Status, ...rest } = summadata;
      console.log(summadata);

      setsumma2({
        id: params.id,
        pk: params.pk,
        ItemCode: id,
        ItemName: ItemName,
        ...rest,
        RaisedQuantity: params?.RaisedQuantity,
        Status: params?.Status,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const summa2Columns = [
    ...[
      'id',
      'Action',
      'ItemCode',
      'ItemName',
      'ProductCategory',
      'SubCategory',
      'PackType',
      'PackQuantity',
      'RaisedQuantity',
    ].map((field) => ({
      key: field,
      name: field === 'id' ? 'S.No' : formatLabel(field),

      renderCell: (params) =>
        field === 'Action' ? (
          params.row.Status !== 'Cancelled' ? (
            <>
              <Button
                className="cell_btn"
                onClick={() => handelEditsumma2(params.row)}
              >
                <EditIcon className="check_box_clrr_cancell" />
              </Button>

              <Button
                className="cell_btn"
                onClick={() => handelDeletesumma2(params.row)}
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
        //   console.log('ress-------------',ress);
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

  const handlesubmit = () => {
    const missingFields = Object.keys(summa1)
      .filter(
        (f) =>
          ![
            'pk',
            'Reason',
            'RequestFromNurseStation',
            'RequestToNurseStation',
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
      let Senddata = {
        ...summa1,
        IndentItemsList: summaArray5,
        Created_by: userRecord?.username,
        IS_Indent_Raise_Approve:pageAccess.IS_Indent_Raise_Approve,
      };

      axios
        .post(`${UrlLink}Inventory/GEN_post_indent_raise_details`, Senddata)
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
          // navigate('/Home/IndentRaiseList');
          navigate('/Home/InventoryMaster');
          dispatchvalue({ type: 'HrFolder', value: 'GENIndentRaiseList' });
          dispatchvalue({ type: 'setPreviousFolder', value: null });
          dispatchvalue({ type: 'showMenu', value: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      <div className="Main_container_app">
        <h3>GEN Indent Raise</h3>
        <br />
        <div className="RegisFormcon_1">
          {Object.keys(summa1)
            .filter((f) => f !== 'pk')
            .map((field, index) => (
              <div className="RegisForm_1" key={index + 'Indent_raise_key'}>
                <label htmlFor={field + 'ind_raise'}>
                  {formatLabel(field)}
                </label>
                {field === 'Reason' ? (
                  <textarea
                    name={field}
                    id={field + 'ind_raise'}
                    value={summa1[field]}
                    onChange={handleonchangesumma1}
                  />
                ) : [
                    'RequestFromNurseStation',
                    'RequestToNurseStation',
                  ].includes(field) ? (
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
                        onChange={handleonchangesumma1}
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
                        value="No"
                        onChange={handleonchangesumma1}
                        checked={!summa1[field]}
                      />
                      No
                    </label>
                  </div>
                ) : field === 'RequestDate' ? (
                  <input
                    required
                    id={field + 'ind_raise'}
                    type="date"
                    name={field}
                    value={summa1[field]}
                    disabled
                    // onChange={handleonchangesumma1}
                  />
                ) : (
                  <select
                    name={field}
                    id={field + 'ind_raise'}
                    value={summa1[field]}
                    onChange={handleonchangesumma1}
                    disabled={field === 'RequestFromLocation'}
                  >
                    <option value="">Select</option>
                    {['RequestFromLocation', 'RequestToLocation'].includes(
                      field
                    ) &&
                      summaArray1.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {ele.locationName}
                        </option>
                      ))}
                    {['RequestFromStore'].includes(field) &&
                      summaArray2.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {summa1.RequestFromNurseStation
                            ? ele.NurseStation
                            : ele.StoreName}
                        </option>
                      ))}
                    {['RequestToStore'].includes(field) &&
                      summaArray3.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {summa1?.RequestToNurseStation
                            ? ele.NurseStation
                            : ele.StoreName}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            ))}
        </div>
        <br />
        <div className="common_center_tag">
          <span>Item Details</span>
        </div>
        <br />
       <div className="RegisFormcon_1">
  {Object.keys(summa2)
    .filter((f) => !['id', 'pk', 'Status'].includes(f))
    .map((field, index) => (
      <div className="RegisForm_1" key={index + 'ind_raise_key'}>
        <label htmlFor={field}>
          {formatLabel(field)}
          <span>:</span>
        </label>

        {['ItemCode', 'ItemName'].includes(field) ? (
          <div className="Search_patient_icons">
            <input
              type="text"
              id={field}
              name={field}
              list={`${field}_indent_list`}
              value={summa2[field]}
              onChange={handleonchangesumma2}
              autoComplete="off"
            />

            <datalist id={`${field}_indent_list`}>
              {/* ✅ When user types ItemCode */}
              {field === 'ItemCode' &&
                summaArray4.map((itm, indx) => (
                  <option key={indx} value={itm.id}>
                    {`${itm.id} | ${itm.ItemName} | Qty: ${
                      itm.Batches?.[0]?.AvailableQuantity ?? 0
                    }`}
                  </option>
                ))}

              {/* ✅ When user types ItemName */}
              {field === 'ItemName' &&
                summaArray4.map((itm, indx) => (
                  <option key={indx} value={itm.ItemName}>
                    {`${itm.ItemName} | ${itm.id} | Qty: ${
                      itm.Batches?.[0]?.AvailableQuantity ?? 0 
                    } |  Batch: ${
                      itm.Batches?.[0]?.Batch_No ?? 0 
                    } `}
                  </option>
                ))}
            </datalist>

            <span
              onClick={() =>
                handlesearchItems(field === 'ItemCode' ? 'id' : 'name')
              }
            >
              <ManageSearchIcon />
            </span>
          </div>
        ) : field === 'Reason' ? (
          <textarea
            name={field}
            value={summa2[field]}
            onChange={handleonchangesumma2}
          />
        ) : (
          <input
            type={['RaisedQuantity'].includes(field) ? 'number' : 'text'}
            id={field}
            name={field}
            value={summa2[field]}
            onChange={handleonchangesumma2}
            onKeyDown={BlockInvalidcharecternumber}
            disabled={!['RaisedQuantity'].includes(field)}
          />
        )}
      </div>
    ))}
</div>

        <br />
        <div className="Main_container_Btn">
          <button onClick={handleAddsumma2}>
            {summa2.id ? 'Update' : 'Add'}
          </button>
        </div>
        <br />
        {summaArray5.length !== 0 && (
          <>
            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid columns={summa2Columns} RowData={summaArray5} />
            </div>

            <br />
            <div className="Main_container_Btn">
              <button onClick={handlesubmit}>
                {summa1.pk ? 'Update Indent' : 'Save Indent'}
              </button>
            </div>
          </>
        )}
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default GENIndentRaise;
