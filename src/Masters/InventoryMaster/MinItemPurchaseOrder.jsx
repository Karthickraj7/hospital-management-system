import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';

const MinItemPurchaseOrder = () => {
  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [MinItemArray, setMinItemArray] = useState([]);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [ItemWiseSupplierData, setItemWiseSupplierData] = useState(null);
  const [itemwisePo, setItemwisePO] = useState({
    SupplierCode: '',
    itemCode: '',
    id: '',
  });
  console.log('MinItemArray', MinItemArray);
  const [IsRepGet, setIsRepGet] = useState(false);


  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/check_minimum_qty_lessthan_available_qty`)
      .then((response) => {
        console.log('response---------', response.data);
        setMinItemArray(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.log('Error fetching data:', err);
        setMinItemArray([]);
      });
  }, [UrlLink, IsRepGet]);

  // Fetch Supplier Data When Item is Selected
  useEffect(() => {
    if (itemwisePo.itemCode) {
      axios
        .get(
          `${UrlLink}Inventory/Item_wise_supplier_getdata?ItemCode=${itemwisePo?.itemCode}`
        )
        .then((res) => {
          const { data, Suppliers } = res.data || {};

          if (Array.isArray(Suppliers) && Suppliers.length > 0) {
            const suppcolumn = [
              { key: 'id', name: 'S.No' },
              { key: 'AmountType', name: 'Amount Type' },
              ...Suppliers.map((field) => ({
                key: field.id,
                name: (
                  <Button onClick={() => Getsinglesupp(field?.id)}>
                    {field.Name}
                  </Button>
                ),
              })),
            ];

            setItemWiseSupplierData({ data, column: suppcolumn });
          } else {
            setItemWiseSupplierData(null);
            dispatch({
              type: 'toast',
              value: {
                message: 'There is no Supplier Mapped on this Item.',
                type: 'warn',
              },
            });
          }
        })
        .catch((err) => {
          console.error('Error fetching supplier data', err);
          setItemWiseSupplierData(null);
          dispatch({
            type: 'toast',
            value: {
              message: 'Failed to load supplier data. Please try again later.',
              type: 'warn',
            },
          });
        });
    } else {
      setItemWiseSupplierData(null);
    }
  }, [UrlLink, itemwisePo.itemCode, dispatch]);

  // Fetch Single Supplier Data When Supplier is Selected
  useEffect(() => {
    if (itemwisePo.SupplierCode && itemwisePo.itemCode && itemwisePo.id) {
      axios
        .get(
          `${UrlLink}Inventory/check_minimum_qty_lessthan_available_qty_withid?Supplierid=${itemwisePo.SupplierCode}&&itemCode=${itemwisePo.itemCode}`
        )
        .then((res) => {
          console.log('dict:', res.data);

          if (
            res.data &&
            typeof res.data === 'object' &&
            Object.keys(res.data).length > 0
          ) {
            setMinItemArray((prevArray) =>
              prevArray.map((item) =>
                item.id === itemwisePo.id
                  ? { ...item, ...res.data } // Merge new response data into matching item
                  : item
              )
            );
          }
        })
        .catch((err) => {
          console.log('Error fetching supplier-specific data:', err);
        });
    }
  }, [UrlLink, itemwisePo.SupplierCode, itemwisePo.itemCode, itemwisePo.id]);

  const handleRemoveItems = (row) => {
    if (row) {
      setItemwisePO({
        SupplierCode: '',
        itemCode: row.ItemCode,
        id: row.id,
      });
    }
  };

  // Function to Fetch a Single Supplier's Data
  const Getsinglesupp = (Supplierid) => {
    console.log('Fetching Single Supplier:', Supplierid);
    setItemwisePO((prev) => ({
      ...prev,
      SupplierCode: Supplierid,
    }));
  };
  const handleCheckboxChange = (id) => {
    setMinItemArray((prevArray) =>
      prevArray && Array.isArray(prevArray) // Ensure prevArray is an array
        ? prevArray.map((item) => {
            if (item.id === id) {
              const updatedItem = {
                ...item,
                LowStockAlert: !item.LowStockAlert,
              };

              // If unchecked, update itemwisePo
              if (!updatedItem.LowStockAlert) {
                setItemwisePO((prev) => ({
                  ...prev,
                  itemCode: '',
                  SupplierCode: '',
                }));
              }

              return updatedItem;
            }
            return item;
          })
        : []
    );
  };

  const MinimiumQtyColumns = [
    {
      key: 'id',
      name: 'S.No',
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: 'ItemName',
      name: 'Product Name',
    },
    {
      key: 'AvailableQuantity',
      name: 'Available Quantity',
    },
    {
      key: 'MinimumQuantity',
      name: 'Min Quantity',
    },
    {
      key: 'ReorderLevel',
      name: 'Reorder Level',
      renderCell: (params) => (
        <input
          type="text"
          value={params.row.ReorderLevel}
          onChange={(e) => handleReorderLevelChange(e, params.row.id)}
          disabled={!params.row.LowStockAlert}
        />
      ),
    },
    {
      key: 'StoreLocation',
      name: 'Store Location',
    },
    {
      key: 'SupplierName',
      name: 'Supplier Name',
    },
    {
      key: 'PurchaseRateAfterGST',
      name: 'Purchase Rate',
    },
    {
      key: 'MRP',
      name: 'MRP',
    },
    { key: 'TotalAmount', name: 'Total' },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleRemoveItems(params.row)}
        >
          <EditIcon className="check_box_clrr_cancell" />
        </Button>
      ),
    },
    {
      key: 'ActionCheck',
      name: 'Action',
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.row.LowStockAlert} // If false, checkbox checked
          onChange={() => handleCheckboxChange(params.row.id)}
        />
      ),
    },
  ];

  // Function to handle Reorder Level change
  const handleReorderLevelChange = (e, id) => {
    const newValue = e.target.value;

    setMinItemArray((prevArray) =>
      prevArray.map((item) => {
        if (item.id === id) {
          const total = (
            parseFloat(newValue) * parseFloat(item.PurchaseRateAfterGST)
          ).toFixed(2);
          return { ...item, ReorderLevel: newValue, TotalAmount: total };
        }
        return item;
      })
    );
  };
  const SubmitAllPurchaseOrder = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const suppliersMap = {};

    MinItemArray.forEach((item) => {
      if (item.LowStockAlert) {
        // Only add items where LowStockAlert is true
        const supplierId = item.Supplierid;

        if (!suppliersMap[supplierId]) {
          suppliersMap[supplierId] = {
            BillingLocation: '1',
            OrderDate: currentDate,
            ShippingLocation: '1',
            SupplierId: supplierId,
            TotalOrderValue: 0,
            MinItemArray: [], // Correct key
          };
        }

        // Prepare the item format
        const formattedItem = {
          AvailableQuantity: item.AvailableQuantity || 0,
          ItemCode: item.ItemCode,
          MRP: item.MRP,
          MinimumQuantity: item.MinimumQuantity,
          PurchaseRateAfterGST: item.PurchaseRateAfterGST,
          ReorderLevel: item.ReorderLevel || 0,
          StoreId: item.StoreId,
          StoreLocation: item.StoreLocation,
          TotalAmount: parseFloat(item.TotalAmount),
          id: suppliersMap[supplierId].MinItemArray.length + 1, // Use correct key
        };

        suppliersMap[supplierId].MinItemArray.push(formattedItem);
        suppliersMap[supplierId].TotalOrderValue += formattedItem.TotalAmount;
      }
    });

    const PurchaseOrders = Object.values(suppliersMap);

    console.log('111111111111------------', PurchaseOrders);

    let Senddata = {
      PurchaseOrders, // Updated key to match required format
      Create_by: userRecord?.username,
    };
    console.log('Senddata', Senddata);

    axios
      .post(`${UrlLink}Inventory/PurchaseOrder_Itemwise_Link`, Senddata)
      .then((res) => {
        console.log('submit response', res.data);
        let resdata = res.data;
        let type = Object.keys(resdata)[0];
        let mess = Object.values(resdata)[0];
        const tdata = {
          message: mess,
          type: type,
        };
        dispatch({ type: 'toast', value: tdata });

        if (type === 'success') {
          setIsRepGet((pre) => !pre);
          navigate('/Home/InventoryMaster');
          dispatch({ type: 'HrFolder', value: 'PurchaseOrderList' });
          dispatch({ type: 'setPreviousFolder', value: null });
          dispatch({ type: 'showMenu', value: true });
          dispatch({ type: 'PurchaseOrderList', value: {} });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
  console.log('allowedStoreId',allowedStoreId)

  const filterStore = Array.isArray(MinItemArray)
  ? MinItemArray.filter(item => item.StoreId === allowedStoreId)
  : [];

  console.log('filterStore',filterStore);


  return (
    <div className="Main_container_app">
      <h3>Minimum Qty Purchase Order</h3>

      {MinItemArray && MinItemArray.length > 0 && (
        <div>
          <div className="common_center_tag">
            <span>Product List</span>
          </div>
          <br />
          <div className="Main_container_app">

            <ReactGrid columns={MinimiumQtyColumns} RowData={Array.isArray(filterStore) && filterStore.length > 0? filterStore : MinItemArray}/>
          </div>
          <br />
        </div>
      )}
      <br />

      {ItemWiseSupplierData && (
        <div>
          <div className="common_center_tag">
            <span>Supplier Wise Item Rate</span>
          </div>

          <ReactGrid
            columns={ItemWiseSupplierData?.column}
            RowData={ItemWiseSupplierData?.data}
          />
        </div>
      )}

      <br></br>
      {MinItemArray && MinItemArray.length > 0 ? (
  <div className="Main_container_Btn">
    <button onClick={SubmitAllPurchaseOrder}>Save</button>
  </div>
) : (
  <p style={{ fontWeight: "bold", fontSize: "20px", textAlign: "center" }}>No Minimum Qty Purchase Order List </p>
)}

      <ToastAlert Message={toast?.message} Type={toast?.type} />
    </div>
  );
};

export default MinItemPurchaseOrder;
