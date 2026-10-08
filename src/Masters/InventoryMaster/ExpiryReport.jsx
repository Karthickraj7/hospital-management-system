import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";

const ExpiryReport = () => {
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];
  const [StoreLocationData, setStoreLocationData] = useState([]);
  console.log('StoreLocationData---', StoreLocationData);

  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
  const [searchQuery, setSearchQuery] = useState({
    StoreLocation:allowedStoreId || '',
    Status: 'All',
    ItemCode: '',
    ItemName: '',
    BatchNumber: '',
    SupplierName: '',
    ExpiryDateFrom: '',
    ExpiryDateTo: '',
  });

  const [itemnames, setItemnames] = useState([]);

  const [itemnbatchNo, setitemnbatchNo] = useState([]);

  const [fetchalldata, setFetchalldata] = useState([]);

  const [SupplierData, setSupplierData] = useState([]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/Supplier_Data_Get?ForQuickGrn=${true}`, {
        params: {
          SupplierName: searchQuery.SupplierName,
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
  }, [UrlLink, searchQuery.SupplierName]);

  const fetchAndExportData = async () => {
    if (Array.isArray(fetchalldata) && fetchalldata.length > 0) {
      // Prepare Excel data
      const formattedData = fetchalldata.map((item) => ({
        SNo: item.id,
        ProductCategory: item.ProductCategory,
        SubCategory: item.SubCategory,
        SupplierName: item.SupplierName,
        GRNNumber: item.GRNNumber,
        GRNDate: item.GRNDate,
        ItemCode: item.ItemCode,
        ItemName: item.ItemName,
        ProductType: item.ProductType,
        BatchNo: item.BatchNo,
        DaysToExpiry: item.DaysToExpiry,
        ExpiryDate: item.ExpiryDate,
        AvailableQuantity: item.AvailableQuantity,
        Status: item.Status,
      }));

      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Batchwise ExpiryReport'
      );

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `BatchwiseExpiryReport${currentDate}.xlsx`);
    } else {
      alert('No data available to export.');
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === 'ItemName') {
      if (value.includes('-')) {
        const [ItemCode, ItemName] = value.split('-');

        setSearchQuery((prev) => ({
          ...prev,
          [name]: ItemName,
          ItemCode: ItemCode,
        }));
      } else {
        setSearchQuery((prev) => ({
          ...prev,
          [name]: value,
          ItemCode: '',
          BatchNumber: '',
        }));
      }
    } else {
      setSearchQuery((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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
    const fetchitems = async () => {
      try {
        const itemresponse = await axios.get(
          `${UrlLink}Inventory/Product_Master_data_link`
        );
        const data = itemresponse.data;
        console.log('item', data);
        if (Array.isArray(data)) {
          setItemnames(data);
        } else {
          setItemnames([]);
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };
    fetchitems();
  }, [UrlLink]);

  useEffect(() => {
    const fetchBatchNumber = async () => {
      try {
        const itemresponse = await axios.get(
          `${UrlLink}Inventory/Get_BatchNumber_From_Stock_data_link`,
          {
            params: { ItemCode: searchQuery.ItemCode },
          }
        );
        const data = itemresponse.data;
        console.log('item', data);
        setitemnbatchNo(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    if (searchQuery.ItemCode !== '') {
      fetchBatchNumber();
    }
  }, [UrlLink, searchQuery.ItemCode]);

  const fetchAllData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${UrlLink}Inventory/get_item_details_batchwiseExpiryStatus`,
        {
          params: searchQuery,
        }
      );
      const data = response.data;
      if (Array.isArray(data)) {
        console.log('alldata', data);
        setFetchalldata(data);
      } else {
        setFetchalldata([]);
      }
    } catch (error) {
      console.error('Failed to fetch nurse station:', error);
    }
  }, [UrlLink, searchQuery]);



 


  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const HandelGoToPurchaseReturn = (row) => {
    console.log('row------------', row);
    dispatchvalue({ type: 'PurchaseReturnList', value: row });
    navigate('/Home/InventoryMaster');
    dispatchvalue({ type: 'HrFolder', value: 'PurchaseReturn' });
    dispatchvalue({ type: 'setPreviousFolder', value: null });
    dispatchvalue({ type: 'showMenu', value: true });
  };

  const AllItemColumn = [
    {
      key: 'id',
      name: 'S.NO',
      frozen: true,
    },
    {
      key: 'ProductCategory',
      name: 'Product Category',
      frozen: true,
    },
    {
      key: 'SupplierName',
      name: 'Supplier Name',
    },
    {
      key: 'GRNNumber',
      name: 'GRN Number',
    },
    {
      key: 'GRNDate',
      name: 'GRN Date',
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
      key: 'BatchNo',
      name: 'Batch Number',
    },
    {
      key: 'AvailableQuantity',
      name: 'Available Quantity',
    },
    {
      key: 'DaysToExpiry',
      name: 'Days To Expiry',
    },
    {
      key: 'ExpiryDate',
      name: 'Expiry Date',
    },
    {
      key: 'Status',
      name: 'Expiry Status',
      renderCell: (params) => {
        let bgColor, textColor;
        switch (params.row.Status) {
          case '90 Days Expiry':
            bgColor = 'yellow';
            textColor = 'black';
            break;
          case '60 Days Expiry':
            bgColor = '#fc7f03';
            textColor = 'black';
            break;
          case '30 Days Expiry':
            bgColor = 'red';
            textColor = 'black';
            break;
          default:
            textColor = 'black';
            break;
        }

        return (
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}
          >
            {params.row.Status}
          </div>
        );
      },
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => HandelGoToPurchaseReturn(params.row)}
        >
          <span style={{ color: 'blue' }}>Purchase Return</span>
        </Button>
      ),
    },
  ];

  const clearSearchdata = () => {
    setSearchQuery({
      StoreLocation:allowedStoreId || '',
      Status: 'All',
      ItemCode: '',
      ItemName: '',
      BatchNumber: '',
      SupplierName: '',
      ExpiryDateFrom: '',
      ExpiryDateTo: '',
    });
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Expiry Report Batch Wise</h3>
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
            <label htmlFor="Status">
              Expiry Status<span>:</span>
            </label>

            <select
              name="Status"
              value={searchQuery.Status}
              onChange={handleOnChange}
            >
              <option value="All">All</option>
              <option value="90 Days Expiry">90 Days Expiry</option>
              <option value="60 Days Expiry">60 Days Expiry</option>
              <option value="30 Days Expiry">30 Days Expiry</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="ItemName">
              Item Name <span>:</span>
            </label>
            <input
              id="ItemName"
              name="ItemName"
              value={searchQuery.ItemName}
              list="ItemName-options"
              onChange={handleOnChange}
              autoComplete="off"
            />
            <datalist id="ItemName-options">
              {itemnames.map((item, index) => (
                <option
                  key={`${index}-code`}
                  value={`${item.ItemCode}-${item.ItemName}`}
                >
                  {item.ItemName}
                </option>
              ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="BatchNumber">
              Batch Number<span>:</span>
            </label>

            <input
              type="text"
              name="BatchNumber"
              value={searchQuery.BatchNumber}
              list="BatchNumber-options"
              onChange={handleOnChange}
              autoComplete="off"
              disabled={searchQuery.ItemName === ''}
            />
            <datalist id="BatchNumber-options">
              {itemnbatchNo.map((item, index) => (
                <option key={`${index}-code`} value={`${item.Batch_No}`}>
                  {item.Batch_No}
                </option>
              ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="SupplierName">
              Supplier Name<span>:</span>
            </label>

            <input
              type="text"
              name="SupplierName"
              value={searchQuery.SupplierName}
              list="SupplierName-options"
              onChange={handleOnChange}
              autoComplete="off"
            />
            <datalist id="SupplierName-options">
              {SupplierData.map((ele, ind) => (
                <option
                  key={ind + 'key'}
                  value={ele.SupplierName}
                >{`${ele.SupplierName} | ${ele.ContactNo}`}</option>
              ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="BatchNumber">
              ExpiryDate From<span>:</span>
            </label>

            <input
              type="date"
              name="ExpiryDateFrom"
              value={searchQuery.ExpiryDateFrom}
              onChange={handleOnChange}
            />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="BatchNumber">
              ExpiryDate To<span>:</span>
            </label>

            <input
              type="date"
              name="ExpiryDateTo"
              value={searchQuery.ExpiryDateTo}
              onChange={handleOnChange}
            />
          </div>

          <div
            className="RegisForm_1"
            style={{ marginLeft: '15px', width: '100px' }}
          >
            <button
              className="RegisterForm_1_btns"
              onClick={fetchAndExportData}
              title="File Download"
            >
              <BrowserUpdatedIcon />
            </button>

            <button
              onClick={clearSearchdata}
              style={{
                padding: '2px 8px',
                cursor: 'pointer',
                borderRadius: '5px',
                backgroundColor: 'black',
                color: 'white',
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <br></br>

        {/* grid */}
        {fetchalldata.length !== 0 && searchQuery.StoreLocation !== '' && (
          <>
            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid columns={AllItemColumn} RowData={fetchalldata} />
            </div>
          </>
        )}


        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default ExpiryReport;

