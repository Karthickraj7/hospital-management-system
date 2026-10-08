import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import ListIcon from '@mui/icons-material/List';

const InventoryLocation = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord-----",userRecord);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const [LocationData, setLocationData] = useState([]);
  const [IsBuildingGet, setIsBuildingGet] = useState(false);
  const [StoreData, setStoreData] = useState([]);
  const [Store_Building_by__loc, setStore_Building_by__loc] = useState([]);
  const [Store_block_by_Building, setStore_block_by_Building] = useState([]);
  const [Store_Floor_by_Block, setStore_Floor_by_Block] = useState([]);
  const [ViewSelectoption, setViewSelectoption] = useState([]);
  const [selectRoom, setselectRoom] = useState(false);

  const [StoreName, setStoreName] = useState({
    Location: '',
    BuildingName: '',
    BlockName: '',
    FloorName: '',
    StoreType: '',
    IsPointOfSale: false,
    SelectedDepartmentIDs: [],
    StoreName: '',
    StoreId: '',
  });

  console.log('StoreName', StoreName);

  const [approvalConditions, setApprovalConditions] = useState([
    {
      id: 'PurchaseOrder',
      label: 'Purchase Order',
      exists: false,
      additionalOptions: [
        {
          id: 'PurchaseOrderApprove',
          label: 'Purchase Order Approve',
          checked: false,
        },
      ],
    },
    {
      id: 'GoodsReceivedNote',
      label: 'Goods Received Note',
      exists: false,
      additionalOptions: [
        {
          id: 'GoodsReceivedNoteApprove',
          label: 'Goods Received Note Approve',
          checked: false,
        },
      ],
    },
    {
      id: 'QuickGoodsReceivedNote',
      label: 'Quick Goods Received Note',
      exists: false,
      additionalOptions: [
        {
          id: 'QuickGoodsReceivedNoteApprove',
          label: 'Quick Goods Received Note Approve',
          checked: false,
        },
      ],
    },
    {
      id: 'PurchaseReturn',
      label: 'Purchase Return',
      exists: false,
      additionalOptions: [
        {
          id: 'PurchaseReturnApprove',
          label: 'Purchase Return Approve',
          checked: false,
        },
      ],
    },
    {
      id: 'Indent',
      label: 'Indent',
      exists: false,
      additionalOptions: [
        { id: 'raiseApprove', label: 'Raise Approve', checked: false },
        { id: 'issueApprove', label: 'Issue Approve', checked: false },
        { id: 'receiveApprove', label: 'Receive Approve', checked: false },
       
      ],
    },
  ]);



  const Clearstate = () => {
    setStoreName({
      Location: '',
      BuildingName: '',
      BlockName: '',
      FloorName: '',
      StoreType: '',
      IsPointOfSale: false,
      SelectedDepartmentIDs: [],
      StoreName: '',
      StoreId: '',
    });
  };

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

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
    if (StoreName.Location) {
      axios
        .get(
          `${UrlLink}Masters/get_building_Data_by_location?Location=${StoreName.Location}`
        )
        .then((res) => {
          if (Array.isArray(res.data)) {
            setStore_Building_by__loc(res.data);
          } else {
            setStore_Building_by__loc([]);
          }
        })
        .catch((err) => {
          setStore_Building_by__loc([]);
          console.log(err);
        });
    }
  }, [StoreName.Location, UrlLink]);

  useEffect(() => {
    if (StoreName.BuildingName) {
      const data = {
        Building: StoreName.BuildingName,
      };
      axios
        .get(`${UrlLink}Masters/get_block_Data_by_Building`, { params: data })
        .then((res) => {
          if (Array.isArray(res.data)) {
            setStore_block_by_Building(res.data);
          } else {
            setStore_block_by_Building([]);
          }
        })
        .catch((err) => {
          setStore_block_by_Building([]);
          console.log(err);
        });
    }
  }, [StoreName.BuildingName, UrlLink]);

  useEffect(() => {
    if (StoreName.BlockName) {
      const data = {
        Block: StoreName.BlockName,
      };
      axios
        .get(`${UrlLink}Masters/get_Floor_Data_by_Building_block_loc`, {
          params: data,
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            setStore_Floor_by_Block(res.data);
          } else {
            setStore_Floor_by_Block([]);
          }
        })
        .catch((err) => {
          setStore_Floor_by_Block([]);
          console.log(err);
        });
    }
  }, [StoreName.BlockName, UrlLink]);

  const handleWardCheckboxChange = (e, id) => {
    const { checked } = e.target;

    setStoreName((prev) => {
      let updatedSelectedDepartmentIDs = [...prev.SelectedDepartmentIDs];

      if (checked) {
        updatedSelectedDepartmentIDs = [...updatedSelectedDepartmentIDs, id];
      } else {
        updatedSelectedDepartmentIDs = updatedSelectedDepartmentIDs.filter(
          (wardId) => wardId !== id
        );
      }

      return {
        ...prev,
        SelectedDepartmentIDs: updatedSelectedDepartmentIDs,
      };
    });
  };

  const handlechangeStore = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'Location') {
      setStoreName((prev) => ({
        ...prev,
        [name]: value,
        BuildingName: '',
        BlockName: '',
        FloorName: '',
        StoreType: '',
        StoreName: '',
      }));
    } else if (name === 'BuildingName') {
      setStoreName((prev) => ({
        ...prev,
        [name]: value,
        BlockName: '',
        FloorName: '',
        StoreType: '',
        StoreName: '',
      }));
    } else if (name === 'BlockName') {
      setStoreName((prev) => ({
        ...prev,
        [name]: value,
        FloorName: '',
        StoreType: '',
        StoreName: '',
      }));
    } else if (name === 'FloorName') {
      setStoreName((prev) => ({
        ...prev,
        [name]: value,
        StoreType: '',
        StoreName: '',
      }));
    } else if (name === 'StoreType') {
      setStoreName((prev) => ({
        ...prev,
        [name]: value,
        StoreName: '',
      }));
    } else if (name === 'IsPointOfSale') {
      setStoreName((prev) => ({
        ...prev,
        [name]: value === 'Yes',
        SelectedDepartmentIDs: [],
      }));
    } else {
      setStoreName((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const depItemView = (row) => {
    console.log('row', row.Departmentslist);

    let select = row?.Departmentslist;

    if (select && select.length !== 0) {
      setViewSelectoption(select);
      setselectRoom(true);
    } else {
      const tdata = {
        message: 'There is no select List to view.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  const ItemView = (row) => {
    console.log('row', row.getSingledata);

    let select = row?.getSingledata;

    if (select && select.length !== 0) {
      setViewSelectoption(select);
      setselectRoom(true);
    } else {
      const tdata = {
        message: 'There is no select List to view.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  const StoreColumns = [
    {
      key: 'id',
      name: 'Store Id',
      frozen: true,
    },
    {
      key: 'Location_Name',
      name: 'Location',
      frozen: true,
    },
    {
      key: 'BuildingName',
      name: 'Building Name',
    },
    {
      key: 'BlockName',
      name: 'Block Name',
    },
    {
      key: 'FloorName',
      name: 'Floor Name',
    },

    {
      key: 'StoreType',
      name: 'Store Type',
    },
    {
      key: 'IsPointOfSale',
      name: 'IsPointOfSale',
    },
    
    {
      key: 'StoreName',
      name: 'Store Name',
    },
    {
      key: 'Inventory Access',
      name: 'Inventory Access',
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => ItemView(params.row)}
            title="Add new Products"
          >
            <ListIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },

    {
      key: 'Status',
      name: 'Status',
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => HandleEditStoreStatus(params.row)}
          >
            {params.row.Status}
          </Button>
        </>
      ),
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => HandleEditStore(params.row)}
          >
            <EditIcon className="check_box_clrr_cancell" />
          </Button>
        </>
      ),
    },
  ];

  const HandleEditStoreStatus = (params) => {
    const data = {
      StoreId: params.id,
      Statusedit: true,
    };
    const confirmation = window.confirm(
      'Are you sure you want to update the status? '
    );
    if (confirmation) {
      axios
        .post(`${UrlLink}Masters/Inventory_Master_Detials_link`, data)
        .then((res) => {
          const resres = res.data;
          let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };

          dispatchvalue({ type: 'toast', value: tdata });
          setIsBuildingGet((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const HandleEditStore = (params) => {
    const {
      id,
      BuildingId,
      BlockId,
      FloorId,
      Location_Id,
      StoreType,
      StoreName,
      IsPointOfSale,
      approvalConditions
    } = params;
    setStoreName({
      Location: Location_Id,
      BuildingName: BuildingId,
      BlockName: BlockId,
      FloorName: FloorId,
      StoreType: StoreType,
      IsPointOfSale: IsPointOfSale === 'Yes' || false,
      StoreName: StoreName,
      StoreId: id,
    });

    setApprovalConditions(approvalConditions);
  };

  const HandleSaveStore = () => {
    const exist = Object.keys(StoreName)
      .filter((p) => !['StoreId', 'IsPointOfSale'].includes(p))
      .filter((field) => !StoreName[field]);

    const OPtionscheck = approvalConditions.some((ele) => ele.exists === true);

    console.log('StoreName-----', StoreName);

    if (exist.length === 0 && OPtionscheck) {
      const data = {
        ...StoreName,
        StoreName: StoreName.StoreName.toUpperCase(),
        created_by: userRecord?.username || '',
        approvalConditions: approvalConditions,
      };
      axios
        .post(`${UrlLink}Masters/Inventory_Master_Detials_link`, data)
        .then((res) => {
          const resres = res.data;
          let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };

          dispatchvalue({ type: 'toast', value: tdata });
          setIsBuildingGet((prev) => !prev);
          if (typp === 'success') {
            Clearstate();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (!OPtionscheck) {
      const tdata = {
        message: `Please Select The Inventory Access Options`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else {
      const tdata = {
        message: `Please provide ${exist.join(' and ')}`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Inventory_Master_Detials_link`)
      .then((res) => {
        const ress = res.data;
        console.log(res.data, '234567');

        setStoreData(ress); 
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsBuildingGet, UrlLink]);

  // --------------------------------------------------------------

  const handleCheckboxChange = (index) => {
    const updatedConditions = approvalConditions.map((item, idx) => {
      if (idx === index) {
        const newExistsState = !item.exists;

        if (item.id === 'PurchaseOrder') {
          const goodsReceivedNote = approvalConditions.find(
            (cond) => cond.id === 'GoodsReceivedNote'
          );
          if (goodsReceivedNote) {
            goodsReceivedNote.exists = newExistsState;
            goodsReceivedNote.additionalOptions =
              goodsReceivedNote.additionalOptions.map((option) => ({
                ...option,
                checked: newExistsState,
              }));
          }
        }
        if (item.id === 'GoodsReceivedNote') {
          const goodsReceivedNote = approvalConditions.find(
            (cond) => cond.id === 'PurchaseOrder'
          );
          if (goodsReceivedNote) {
            goodsReceivedNote.exists = newExistsState;
            goodsReceivedNote.additionalOptions =
              goodsReceivedNote.additionalOptions.map((option) => ({
                ...option,
                checked: newExistsState,
              }));
          }
        }

        return {
          ...item,
          exists: newExistsState,
          additionalOptions: item.additionalOptions.map((option) => ({
            ...option,
            checked: newExistsState, // Set to true if exists is checked
          })),
        };
      }

      return item;
    });

    setApprovalConditions(updatedConditions);
  };

  // Handle nested checkbox toggle for additional options
  const handleNestedCheckboxChange = (index, nestedIndex) => {
    const updatedConditions = approvalConditions.map((item, idx) => {
      if (idx === index) {
        const updatedOptions = item.additionalOptions.map((opt, nIdx) =>
          nIdx === nestedIndex ? { ...opt, checked: !opt.checked } : opt
        );
        return { ...item, additionalOptions: updatedOptions };
      }
      return item;
    });
    setApprovalConditions(updatedConditions);
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Inventory Location</h3>
        <br />
        <div className="RegisFormcon_1">
          {Object.keys(StoreName)
            .filter(
              (p) =>
                ![
                  'StoreId',
                  'SelectedDepartmentIDs',
                ].includes(p)
            )
            .map((field, indx) => (
              <div className="RegisForm_1" key={indx}>
                <label>
                  {formatLabel(field)} <span>:</span>
                </label>
                {field === 'IsPointOfSale' ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      gap: '5px',
                      width: '130px',
                    }}
                  >
                    <label style={{ width: 'auto' }} htmlFor={`${field}_yes`}>
                      <input
                        required
                        id={`${field}_yes`}
                        type="radio"
                        name={field}
                        value="Yes"
                        style={{ width: 'auto' }}
                        checked={StoreName[field]}
                        onChange={handlechangeStore}
                        disabled={StoreName.StoreType === ''}
                      />
                      Yes
                    </label>
                    <label style={{ width: 'auto' }} htmlFor={`${field}_No`}>
                      <input
                        required
                        id={`${field}_No`}
                        type="radio"
                        name={field}
                        value="No"
                        style={{ width: 'auto' }}
                        checked={!StoreName[field]}
                        onChange={handlechangeStore}
                      />
                      No
                    </label>
                  </div>
                ) : field === 'StoreName' ? (
                  <input
                    type="text"
                    name={field}
                    autoComplete="off"
                    required
                    value={StoreName[field]}
                    onChange={handlechangeStore}
                    disabled={StoreName.StoreType === ''}
                  />
                ) : (
                  <select
                    name={field}
                    required
                    disabled={
                      StoreName.FloorName === '' && field === 'StoreType'
                    }
                    value={StoreName[field]}
                    onChange={handlechangeStore}
                  >
                    <option value="">Select</option>
                    {field === 'BuildingName' &&
                      Store_Building_by__loc.map((p, index) => (
                        <option key={index} value={p.id}>
                          {p.BuildingName}
                        </option>
                      ))}
                    {field === 'BlockName' &&
                      Store_block_by_Building.map((p, index) => (
                        <option key={index} value={p.id}>
                          {p.BlockName}
                        </option>
                      ))}
                    {field === 'FloorName' &&
                      Store_Floor_by_Block.map((p, index) => (
                        <option key={index} value={p.id}>
                          {p.FloorName}
                        </option>
                      ))}
                    {field === 'Location' &&
                      LocationData.map((p, index) => (
                        <option key={index} value={p.id}>
                          {p.locationName}
                        </option>
                      ))}
                    {field === 'StoreType' && (
                      <>
                        <option value="CENTRALSTORE">CENTRAL STORE</option>
                        <option value="SUBCENTRALSTORE">
                          SUB CENTRAL STORE
                        </option>
                        <option value="SUBSTORE">SUB STORE</option>
                        <option value="PHARMACY">PHARMACY</option>
                      </>
                    )}
                  </select>
                )}
              </div>
            ))}

         
        </div>
        <br />
        {StoreName.StoreType !== '' && (
          <>
            <div className="DivCenter_container">Inventory Access</div>
            <br />
            <div className="displayuseraccess">
              {approvalConditions.map((condition, index) => (
                <div key={condition.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={condition.exists}
                      onChange={() => handleCheckboxChange(index)}
                      disabled={StoreName.StoreName === ''}
                    />
                    {condition.label}
                  </label>

                  {condition.exists &&
                    condition.additionalOptions.length > 0 && (
                      <div style={{ marginLeft: '5px', marginTop: '5px' }}>
                        {condition.additionalOptions.map(
                          (option, nestedIndex) => (
                            <div
                              key={option.id}
                              style={{ marginLeft: '10px', marginTop: '5px' }}
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  checked={option.checked}
                                  onChange={() =>
                                    handleNestedCheckboxChange(
                                      index,
                                      nestedIndex
                                    )
                                  }
                                />
                                {option.label}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  <br />
                </div>
              ))}
            </div>
          </>
        )}

        <br />

        <div className="Main_container_Btn">
          <button onClick={HandleSaveStore}>
            {StoreName.StoreId ? 'Update' : 'Add'}
          </button>
        </div>

        <br />

        <ReactGrid columns={StoreColumns} RowData={StoreData} />
      </div>

      <ToastAlert Message={toast.message} Type={toast.type} />

      {selectRoom && ViewSelectoption.length !== 0 && (
        <div className="loader" onClick={() => setselectRoom(false)}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <br />

            <div className="common_center_tag">
              <span>Inventory Access</span>
            </div>
            <br />
            <div className="displayuseraccess">
              {ViewSelectoption.map((keys, indx) => (
                <div style={{ marginLeft: '20px' }} key={indx}>
                  <label htmlFor={`${indx}_${keys}`} className="par_acc_lab">
                    {`${indx + 1}. ${keys}`}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryLocation;
