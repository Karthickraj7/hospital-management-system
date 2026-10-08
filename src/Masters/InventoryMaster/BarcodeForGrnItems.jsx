import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from '@mui/material/Button';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { formatLabel } from '../../OtherComponent/OtherFunctions';
import ItemBarcodePrint from '../InventoryMaster/ItemBarcodePrint';

const BarcodeForGrnItems = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];
  const [StoreLocationData, setStoreLocationData] = useState([]);

  const [searchQuery, setSearchQuery] = useState({
    StoreLocation: allowedStoreId || '',
    GRNDate: '',
    GRNNumber: '',
    ItemCode: '',
    ItemName: '',
    BatchNumber: '',
    SupplierName: '',
  });

  const [itemnames, setItemnames] = useState([]);

  const [itemnbatchNo, setitemnbatchNo] = useState([]);

  const [fetchalldata, setFetchalldata] = useState([]);

  const [SupplierData, setSupplierData] = useState([]);

  const [GRNdata, setGRNdata] = useState([]);

  console.log('GRNdata------???', GRNdata);

  const [barcodeDetailes, setbarcodeDetailes] = useState({});

  const [selectedrow, setselectedrow] = useState(false);

  const [OpenBarcodepage, setOpenBarcodepage] = useState(true);

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

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/getgrnlistforsearch`, {
        params: {
          GRNDate: searchQuery.GRNDate,
        },
      })
      .then((res) => {
        const data = res.data;
        setGRNdata(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
        setGRNdata([]);
      });
  }, [UrlLink, searchQuery.GRNDate]);

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
        }));
      }
    } else if (name === 'GRNNumber') {
      let finddata = GRNdata.find((ele) => '' + ele.GRNNumber === '' + value);

      if (finddata) {
        setSearchQuery((prev) => ({
          ...prev,
          [name]: value,
          GRNDate: finddata.GrnDate,
          SupplierName: finddata.SupplierName,
        }));
      } else {
        setSearchQuery((prev) => ({
          ...prev,
          [name]: value,
          GRNDate: '',
          SupplierName: '',
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
        `${UrlLink}Inventory/get_item_details_ForBarcode`,
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

  const BarcodeView = (row) => {
    console.log('zzzzzzzzzz', row);

    if (row) {
      setselectedrow(true);
      setbarcodeDetailes({ ...row, PrintCount: '' });
    }
  };

  const handleOnChangeupdate = (e) => {
    const { name, value } = e.target;

    setbarcodeDetailes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closetab = () => {
    setselectedrow(false);
    setbarcodeDetailes({});
  };
  const [selectedRowData, setSelectedRowData] = useState(null);

  const Printbarcode = () => {
    if (!barcodeDetailes.PrintCount || barcodeDetailes.PrintCount <= 0) {
      alert('Please enter a valid Print Count.');
      return;
    }

    setSelectedRowData({
      ItemCode: barcodeDetailes.ItemCode,
      ItemName: barcodeDetailes.ItemName,
      BatchNo: barcodeDetailes.BatchNo,
      PrintCount: barcodeDetailes.PrintCount,
    });
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
      key: 'ProductType',
      name: 'Product Type',
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
      key: 'ExpiryDate',
      name: 'Expiry Date',
    },
    {
      key: 'Make Barcode',
      name: 'Make Barcode',
      renderCell: (params) => (
        <>
          <Button className="cell_btn" onClick={() => BarcodeView(params.row)}>
            <HorizontalSplitIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
  ];

  const clearSearchdata = () => {
    setSearchQuery({
      StoreLocation: allowedStoreId || '',
      GRNDate: '',
      GRNNumber: '',
      ItemCode: '',
      ItemName: '',
      BatchNumber: '',
      SupplierName: '',
    });
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>BarCode For Grn Items</h3>
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
            <label htmlFor="SupplierName">
              GRN Number<span>:</span>
            </label>

            <input
              type="text"
              name="GRNNumber"
              value={searchQuery.GRNNumber}
              list="GRNNumber-options"
              onChange={handleOnChange}
            />
            <datalist id="GRNNumber-options">
              {GRNdata &&
                GRNdata.map((ele, ind) => (
                  <option
                    key={ind + 'key'}
                    value={ele.GRNNumber}
                  >{`${ele.GRNNumber} | ${ele.GrnDate}`}</option>
                ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="SupplierName">
              GRN Date<span>:</span>
            </label>

            <input
              type="date"
              name="GRNDate"
              value={searchQuery.GRNDate}
              onChange={handleOnChange}
            />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="SupplierName">
              Suplier Name<span>:</span>
            </label>

            <input
              type="text"
              name="SupplierName"
              value={searchQuery.SupplierName}
              list="SupplierName-options"
              onChange={handleOnChange}
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

          <div
            className="RegisForm_1"
            style={{ marginLeft: '15px', width: '100px' }}
          >
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

        <ToastAlert Message={toast.message} Type={toast.type} />

        {/* {selectedrow && (
                <div className="loader" onClick={() => setselectedrow(false)}>
                    <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
                        
                            <div className="common_center_tag">
                                <span>Item Details</span>
                            </div>
                   
                        <br />
                    {barcodeDetailes && Object.values(barcodeDetailes).length !==0 && 
                        <div className="Main_container_app">
                        <div className="RegisFormcon_1">
                            {barcodeDetailes && Object.keys(barcodeDetailes).filter((ele)=> !['id','Pk'].includes(ele)).map((state,index)=>(
                                <div key={index} className="RegisForm_1">
                                     <label> {formatLabel(state)} <span>:</span> </label>
                                    
                                {                                     
                                <input
                                name={state}
                                type={state === 'PrintCount'?'number' :'text'}
                                value={barcodeDetailes[state]}
                                disabled={state !== 'PrintCount'}
                                onChange={handleOnChangeupdate}
                                />
                                }
                                </div>
                            ))

                            }                        
                        </div>


                        <div className="Main_container_Btn">
                        <button onClick={Printbarcode} > 
                            Print
                        </button>

                        <button onClick={closetab}>
                            Cancel
                        </button>
                        </div>
                        </div>}
                    </div>
                </div>
            )} */}
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
              {barcodeDetailes &&
                Object.values(barcodeDetailes).length !== 0 && (
                  <div className="Main_container_app">
                    <div className="RegisFormcon_1">
                      {Object.keys(barcodeDetailes)
                        .filter((ele) => !['id', 'Pk'].includes(ele))
                        .map((state, index) => (
                          <div key={index} className="RegisForm_1">
                            <label>
                              {formatLabel(state)} <span>:</span>
                            </label>
                            <input
                              name={state}
                              type={state === 'PrintCount' ? 'number' : 'text'}
                              value={barcodeDetailes[state]}
                              disabled={state !== 'PrintCount'}
                              onChange={handleOnChangeupdate}
                            />
                          </div>
                        ))}
                    </div>

                    {/* Render Barcode Print Component */}
                    <ItemBarcodePrint rowData={barcodeDetailes} />

                    <div className="Main_container_Btn">
                      {/* <button onClick={Printbarcode}>Print</button> */}
                      <button onClick={closetab}>Cancel</button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BarcodeForGrnItems;
