import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from '@mui/material/Button';

const StockEvaluationSingleItem = () => {
  const dispatchvalue = useDispatch();
  const toast = useSelector((state) => state.userRecord?.toast);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const StockEvaluationSingleItem = useSelector(
    (state) => state.Inventorydata?.StockEvaluationSingleItem
  );
  console.log('StockEvaluationSingleItem--------', StockEvaluationSingleItem);
  const navigate = useNavigate();
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [searchQuery, setSearchQuery] = useState({
    StoreLocation: StockEvaluationSingleItem?.StoreLocation || '',
    FromDate: '',
    ToDate: '',
    ItemName: '',
  });

  const [StoreLocationData, setStoreLocationData] = useState([]);

  const [Itemdata, setItemdata] = useState([]);

  useEffect(() => {
    if (userRecord?.location) {
      axios
        .get(
          `${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${userRecord?.location}&forquickgrn=${false}`
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
    if (
      StockEvaluationSingleItem &&
      Object.keys(StockEvaluationSingleItem).length > 0
    ) {
      let senddata = {
        ItemCode: StockEvaluationSingleItem.ItemCode,
        ...searchQuery,
      };

      axios
        .get(
          `${UrlLink}Inventory/get_items_details_StockEvaluationSingleItem`,
          {
            params: senddata,
          }
        )
        .then((res) => {
          const data = res.data;
          console.log('mmmmmTTTT---', data);

          setItemdata(
            data && Array.isArray(data) && data.length > 0 ? data : []
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      navigate('/Home/InventoryMaster');
      dispatchvalue({ type: 'HrFolder', value: 'StockEvaluationReport' });
      dispatchvalue({ type: 'setPreviousFolder', value: null });
      dispatchvalue({ type: 'showMenu', value: true });
    }
  }, [StockEvaluationSingleItem, searchQuery]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="Main_container_app">
      <h3>Stock Evaluation Report Batch Wise</h3>
      <br />
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label htmlFor="StoreLocation">
            Store Location<span>:</span>
          </label>

          <select
            name="StoreLocation"
            value={searchQuery.StoreLocation}
            onChange={handleOnChange}
            disabled
          >
            <option value="">Select</option>
            {StoreLocationData &&
              StoreLocationData.length > 0 &&
              StoreLocationData.map((ele, ind) => (
                <option key={ind + 'key'} value={ele.id}>
                  {ele.StoreName}
                </option>
              ))}
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Item Code <span>:</span>{' '}
          </label>
          <input
            name="suppliercode"
            value={StockEvaluationSingleItem.ItemCode}
            readOnly
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Item Name <span>:</span>{' '}
          </label>
          <input
            name="suppliername"
            value={StockEvaluationSingleItem.ItemName}
            readOnly
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="BatchNumber">
            From Date<span>:</span>
          </label>

          <input
            type="date"
            name="FromDate"
            value={searchQuery.FromDate}
            onChange={handleOnChange}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="BatchNumber">
            To Date<span>:</span>
          </label>

          <input
            type="date"
            name="ToDate"
            value={searchQuery.ToDate}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <br />

      {Itemdata && Itemdata.length !== 0 && (
        <div className="for">
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th
                    id="slectbill_ins"
                    style={{ width: '100px', height: '30px' }}
                  >
                    S.No
                  </th>
                  <th
                    id="slectbill_ins"
                    style={{ width: '130px', height: '30px' }}
                  >
                    Batch No
                  </th>
                  <th
                    id="slectbill_ins"
                    style={{ width: '130px', height: '30px' }}
                  >
                    Purchase Date
                  </th>
                  <th
                    id="slectbill_ins"
                    style={{ width: '300px', height: '30px' }}
                  >
                    Purchase Quantity
                  </th>
                  <th
                    id="slectbill_ins"
                    style={{ width: '130px', height: '30px' }}
                  >
                    Purchase Rate
                  </th>
                  <th
                    id="slectbill_ins"
                    style={{ width: '130px', height: '30px' }}
                  >
                    Sold Quantity
                  </th>
                  <th
                    id="slectbill_ins"
                    style={{ width: '130px', height: '30px' }}
                  >
                    Remaining Quantity
                  </th>
                  <th
                    id="slectbill_ins"
                    style={{ width: '130px', height: '30px' }}
                  >
                    Remaining Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {Itemdata.length !== 0 &&
                  Itemdata.map((item, index) => (
                    <tr key={index}>
                      <td style={{ width: '100px', height: '30px' }}>
                        {item.id}
                      </td>
                      <td
                        style={{ width: '130px', height: '30px' }}
                        className="cell_btn"
                      >
                        {item.BatchNo}
                      </td>
                      <td style={{ width: '130px', height: '30px' }}>
                        {item.PurchaseDate}
                      </td>
                      <td style={{ width: '300px', height: '30px' }}>
                        {item.GRNRecieveQuantity}
                      </td>
                      <td style={{ width: '130px', height: '30px' }}>
                        {item.PurchaseRate}
                      </td>
                      <td style={{ width: '130px', height: '30px' }}>
                        {item.SoldQuantity}
                      </td>
                      <td style={{ width: '130px', height: '30px' }}>
                        {item.AvailableQuantity}
                      </td>
                      <td style={{ width: '130px', height: '30px' }}>
                        {item.StockValue}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                  >
                    Total :
                  </td>
                  <td
                    style={{
                      width: '140px',
                      fontWeight: 'bold',
                      height: '30px',
                    }}
                  >
                    {Itemdata.reduce(
                      (acc, item) => acc + (+item.AvailableQuantity || 0),
                      0
                    ) || '0'}
                  </td>
                  <td
                    style={{
                      width: '140px',
                      fontWeight: 'bold',
                      height: '30px',
                    }}
                  >
                    {Itemdata.reduce(
                      (acc, item) => acc + (+item.StockValue || 0),
                      0
                    ).toFixed(2) || '0'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockEvaluationSingleItem;
