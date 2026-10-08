import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import EditIcon from '@mui/icons-material/Edit';
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';
import { formatLabel } from '../../OtherComponent/OtherFunctions';
import * as XLSX from 'xlsx';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const StockAdjustment = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  const [searchQuery, setSearchQuery] = useState({
    StoreLocationNurseStation: false,
    StoreLocation: allowedStoreId || '',
    ItemCode: '',
    ItemName: '',
    BatchNumber: '',
    ExpiryDateFrom: '',
    ExpiryDateTo: '',
  });
  console.log('searchQuery', searchQuery);

  const [itemnames, setItemnames] = useState([]);
  const [storenames, setStorenames] = useState([]);
  const [nurseStationNames, setNurseStationNames] = useState([]);
  const [itemnbatchNo, setitemnbatchNo] = useState([]);

  const [fetchalldata, setFetchalldata] = useState([]);

  const [selectedrow, setselectedrow] = useState(false);

  const [itemrowedit, setItemrowedit] = useState({});
  const [SelectedFile, setSelectedFile] = useState(null);

  const [loading, setloading] = useState(false);

  console.log('-222222-', SelectedFile);

  console.log('itemrowedit?????', itemrowedit);

  const fetchAndExportData = async () => {
    if (Array.isArray(fetchalldata) && fetchalldata.length > 0) {
      // Prepare Excel data
      const formattedData = fetchalldata.map((item) => ({
        SNo: item.id,
        PK: item.Pk,
        ProductCategory: item.ProductCategory,
        SubCategory: item.SubCategory,
        ItemCode: item.ItemCode,
        ItemName: item.ItemName,
        BatchNo: item.BatchNo,
        ManufactureDate: item.ManufactureDate,
        ExpiryDate: item.ExpiryDate,
        AvailableQuantity: item.AvailableQuantity,
        AdjustDate: '',
        AdjustMode: '',
        AdjustQuantity: '',
        Reason: '',
      }));

      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Batchwise Items');

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, 'Batchwise_Items.xlsx');
    } else {
      alert('No data available to export.');
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === 'StoreLocationNurseStation') {
      setSearchQuery((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        StoreLocation: '',
      }));
    } else if (name === 'ItemName') {
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
        }));
      }
    } else {
      setSearchQuery((prev) => ({
        ...prev,
        [name]: value,
        ItemCode: '',
      }));
    }
  };

  const handleOnChangeupdate = (e) => {
    const { name, value } = e.target;

    setItemrowedit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    const fetchstorenames = async () => {
      try {
        const storeresponse = await axios.get(
          `${UrlLink}Inventory/get_all_store_locations`
        );
        const data = storeresponse.data;
        console.log('datastore', data);
        if (Array.isArray(data)) {
          setStorenames(data);
        } else {
          setStorenames([]);
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
      }
    };
    fetchstorenames();
  }, [UrlLink]);

  useEffect(() => {
    const fetchnursestorenames = async () => {
      try {
        const nursestoreresponse = await axios.get(
          `${UrlLink}Inventory/get_all_nurse_station_link`
        );
        const data = nursestoreresponse.data;
        console.log('datastore', data);
        if (Array.isArray(data)) {
          setNurseStationNames(data);
        } else {
            setNurseStationNames([]);
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
      }
    };
    fetchnursestorenames();
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
        `${UrlLink}Inventory/get_item_details_batchwise_for_stockadjusment`,
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

  const HandelEditdata = (row) => {
    if (row) {
      setselectedrow(true);
      setItemrowedit({
        AdjustDate: currentDate,
        ...row,
        AdjustMode: '',
        AdjustQuantity: '',
        Reason: '',
      });
    }
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
      key: 'SubCategory',
      name: 'Sub Category',
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
      key: 'ExpiryDate',
      name: 'Expiry Date',
    },
    {
      key: 'AvailableQuantity',
      name: 'Available Quantity',
      renderCell: ({ row }) => <Button>{row.AvailableQuantity}</Button>,
    },
    {
      key: 'MRP',
      name: 'MRP',
    
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <>
            <Button
              className="cell_btn"
              onClick={() => HandelEditdata(params.row)}
            >
              <EditIcon className="check_box_clrr_cancell" />
            </Button>
          
        </>
      ),
    },
  ];

  const closetab = () => {
    setselectedrow(false);
    setItemrowedit({});
  };

  const Savethechanges = () => {
    let required = ['AdjustMode', 'AdjustQuantity', 'Reason'];

    const missingFields = required.filter((field) => !itemrowedit[field]);

    if (missingFields.length !== 0) {
      const tdata = {
        message: `Please fill out all required fields: ${missingFields.join(', ')}`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else {
      let Senddata = {
        ...itemrowedit,
        Create_by: userRecord?.username,
      };

      console.log('Senddata', Senddata);

      axios
        .post(`${UrlLink}Inventory/changestockavailableqty`, Senddata)
        .then((res) => {
          console.log('oooopppiiuu', res.data);

          let resdata = res.data;
          let type = Object.keys(resdata)[0];
          let mess = Object.values(resdata)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: 'toast', value: tdata });
          if (type === 'success') {
            closetab();
            fetchAllData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('-11111-', file);
      setSelectedFile(file);

      // Reset the file input to allow selecting the same file again
      event.target.value = null;
    }
  };

  const handleCsvupload = () => {
    console.log(SelectedFile);
    const formData = new FormData();
    formData.append('file', SelectedFile);
    formData.append('created_by', userRecord?.username);

    if (SelectedFile) {
      setloading(true);
      axios
        .post(
          `${UrlLink}Inventory/All_Product_StockAdjust_File_Upload`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
        .then((response) => {
          console.log(response);
          // successMsg("File Processed Successfully");
          // fetch_testmasterdata();
          setSelectedFile(null);
          fetchAllData();

          let data = response.data;
          setloading(false);
          let type = Object.keys(data)[0];
          let mess = Object.values(data)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: 'toast', value: tdata });
        })
        .catch((error) => {
          setloading(false);
          console.log(error);
          alert(error);
        });
    } else {
      const tdata = {
        message: `Please Select file`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  const clearSearchdata = () => {
    setSearchQuery({
      StoreLocation: allowedStoreId || '',
      StoreLocationNurseStation:false,
      ItemCode: '',
      ItemName: '',
      BatchNumber: '',
      ExpiryDateFrom: '',
      ExpiryDateTo: '',
    });
  };

  return (
    <>
      <div
        className={
          loading ? 'Main_container_app loading-overlay' : 'Main_container_app'
        }
      >
        {loading && (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading....</span>
          </div>
        )}
        <h3>Stock Adjustment</h3>
        <br />

        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label htmlFor="StoreLocationNurseStation">
              IsNurseStation<span>:</span>
            </label>

            <input
              type="radio"
              name="StoreLocationNurseStation"
              value="Yes"
              onChange={handleOnChange}
              checked={searchQuery.StoreLocationNurseStation === true}
              style={{ width: '15px', marginLeft: '10px' }}
            />
            <label style={{ marginRight: '15px', marginLeft: '5px' }}>
              Yes
            </label>

            <input
              type="radio"
              name="StoreLocationNurseStation"
              value="No"
              onChange={handleOnChange}
              checked={searchQuery.StoreLocationNurseStation === false}
              style={{ width: '15px', marginLeft: '10px' }}
            />
            <label>No</label>
          </div>

          {searchQuery.StoreLocationNurseStation === true && (
            <div className="RegisForm_1">
              <label htmlFor="NurseStation">
                Nurse Station<span>:</span>
              </label>

              <select
                name="StoreLocation"
                value={searchQuery.StoreLocation}
                onChange={handleOnChange}
              >
                <option value="">Select</option>
                {nurseStationNames &&
                  nurseStationNames.length > 0 &&
                  nurseStationNames.map((ele, ind) => (
                    <option key={ind + 'nurse'} value={ele.NurseStationid}>
                      {ele.NurseStationName}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {searchQuery.StoreLocationNurseStation === false && (
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
                {storenames &&
                  storenames.length > 0 &&
                  storenames.map((ele, ind) => (
                    <option key={ind + 'key'} value={ele.Store_Id}>
                      {ele.Store_Name}
                    </option>
                  ))}
              </select>
            </div>
          )}

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

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label>
              {' '}
              Excel File<span>:</span>{' '}
            </label>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              id="Servicechoose"
              required
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <label
              htmlFor="Servicechoose"
              title="Choose File"
              className="RegisterForm_1_btns choose_file_update"
            >
              <PhotoCameraBackIcon />
            </label>
            <button
              className="RegisterForm_1_btns choose_file_update"
              onClick={handleCsvupload}
              title="File Upload"
            >
              <DriveFolderUploadIcon />
            </button>

            <button
              className="RegisterForm_1_btns choose_file_update"
              onClick={fetchAndExportData}
              title="File Download"
            >
              <BrowserUpdatedIcon />
            </button>
          </div>

          <div className="RegisForm_1" style={{ marginLeft: '15px' }}>
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

        {fetchalldata.length !== 0 && (
          <>
            <div className="RegisFormcon_1 jjxjx_">
              <ReactGrid columns={AllItemColumn} RowData={fetchalldata} />
            </div>
          </>
        )}

        {selectedrow && (
          <div className="loader" onClick={() => setselectedrow(false)}>
            <div
              className="loader_register_roomshow"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="common_center_tag">
                <span>Item Details</span>
              </div>

              <br />
              {itemrowedit && Object.values(itemrowedit).length !== 0 && (
                <div className="Main_container_app">
                  <div className="RegisFormcon_1">
                    {itemrowedit &&
                      Object.keys(itemrowedit)
                        .filter((ele) => !['id', 'Pk'].includes(ele))
                        .map((state, index) => (
                          <div key={index} className="RegisForm_1">
                            <label>
                              {' '}
                              {formatLabel(state)} <span>:</span>{' '}
                            </label>

                            {state === 'AdjustMode' ? (
                              <select
                                name={state}
                                value={itemrowedit[state]}
                                onChange={handleOnChangeupdate}
                              >
                                <option value="">Select</option>
                                <option value="Add">Add</option>
                                <option value="Less">Less</option>
                              </select>
                            ) : state === 'Reason' ? (
                              <textarea
                                name={state}
                                value={itemrowedit[state]}
                                onChange={handleOnChangeupdate}
                              />
                            ) : (
                              <input
                                name={state}
                                value={itemrowedit[state]}
                                disabled={state !== 'AdjustQuantity'}
                                onChange={handleOnChangeupdate}
                              />
                            )}
                          </div>
                        ))}
                  </div>

                  <div className="Main_container_Btn">
                    <button onClick={Savethechanges}>Save</button>

                    <button onClick={closetab}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <ToastAlert Message={toast.message} Type={toast.type} />
        <ModelContainer />
      </div>
    </>
  );
};

export default StockAdjustment;
