import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Tooltip from '@mui/material/Tooltip';
import { formatunderscoreLabel } from '../../OtherComponent/OtherFunctions';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const StockList = () => {
  const dispatchvalue = useDispatch();
  const toast = useSelector((state) => state.userRecord?.toast);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [searchQuery, setsearchQuery] = useState({
    FilterType: 'OverAll',
    ViewType: 'AvailableQuantity',
    Location: '',
    StoreType: '',
    StoreName: '',
    ItemCode: '',
    ItemName: '',
    ProductCategory: '',
    SubCategory: '',
  });
  const qtyType = useMemo(
    () => [
      'Total_Quantity',
      'Sold_Quantity',
      'AvailableQuantity',
      'Grn_Recieve_Quantity',
      'Indent_Send_Quantity',
      'Indent_Recieve_Quantity',
      'Indent_Return_Quantity',
      'Grn_Return_Quantity',
      'Scrab_Quantity',
      'Add_Adjust_Quantity',
      'Less_Adjust_Quantity'
    ],
    []
  );

  const [summa1, setsumma1] = useState([]);

  console.log('summa1', summa1);
  const [summa1column, setsumma1column] = useState([]);
  const [summaArray1, setsummaArray1] = useState([]);
  const [summaArray2, setsummaArray2] = useState([]);
  const [summaArray3, setsummaArray3] = useState([]);
  const [summaArray4, setsummaArray4] = useState([]);
  const [summaArray5, setsummaArray5] = useState([]);
  console.log('summaArray5', summaArray5);

  const handleonchange = (e) => {
    const { name, value } = e.target;
    if (name === 'ProductCategory') {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
        SubCategory: '',
      }));
    } else if (name === 'Location') {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
        StoreType: '',
        StoreName: '',
      }));
    } else if (name === 'StoreType') {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
        StoreName: '',
      }));
    } else {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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
    axios
      .get(`${UrlLink}Inventory/Product_Category_Product_Details_link`)
      .then((res) => {
        const ress = res.data;
        setsummaArray3(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    if (searchQuery.ProductCategory) {
      axios
        .get(
          `${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${searchQuery.ProductCategory}`
        )
        .then((res) => {
          const ress = res.data;
          setsummaArray4(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setsummaArray4([]);
    }
  }, [UrlLink, searchQuery.ProductCategory]);

  useEffect(() => {
    if (searchQuery.Location) {
      axios
        .get(
          `${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${searchQuery.Location}&IsFromWardStore=${searchQuery.StoreType === 'NurseStation'}`
        )
        .then((res) => {
          const ress = res.data;
          setsummaArray2(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, searchQuery.Location, searchQuery.StoreType]);

  const handleViewStockList = useCallback(
    (ItemCode, StoreType, StoreName, params) => {
      let senddata = {
        ItemCode,
        StoreType: StoreType.includes(' ')
          ? StoreType.split(' ')[0] === 'Inventory'
            ? 'inv'
            : 'NurseStation'
          : StoreName,
        StoreName,
      };

      axios
        .get(
          `${UrlLink}Inventory/get_overall_stock_list_By_batchwise_details`,
          { params: senddata }
        )
        .then((res) => {
          console.log(res);
          const resdatasss = res.data;
          if (Array.isArray(resdatasss) && resdatasss.length !== 0) {
            setsummaArray5(resdatasss);
          } else {
            setsummaArray5([]);
            const tdata = {
              message: `No stock available to view for ItemCode : ${ItemCode}.`,
              type: 'warn',
            };
            dispatchvalue({ type: 'toast', value: tdata });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [UrlLink, dispatchvalue]
  );

  useEffect(() => {
    setsumma1column([]);
    if (searchQuery.FilterType === 'OverAll') {
      axios
        .get(`${UrlLink}Inventory/get_overall_stock_list_table_column_details`)
        .then((res) => {
          console.log('111111111111111111111', res);

          const table_struc = res.data;
          console.log('table_struc---------', table_struc);

          const predefinedColumns = [
            { key: 'ItemCode', name: 'Item Code' },
            { key: 'ItemName', name: 'Item Name' },
            { key: 'ProductCategory', name: 'Product Category' },
            { key: 'SubCategory', name: 'Sub Category' },
          ];

          const coll = Object.keys(table_struc).map((ele) => ({
            key: ele,
            name: ele.split('_')[1],
            children: [
              ...Object.keys(table_struc[ele]).map((ele_c1) => ({
                key: ele_c1,
                name:
                  ele_c1 === 'inv' ? 'Inventory Store' : 'NurseStation Store',
                children: [
                  ...table_struc[ele][ele_c1].map((ele_c2) => ({
                    key: `${ele.split('_')[0]}_${ele_c1}_${ele_c2.split('_')[0]}_${searchQuery.ViewType}`,
                    name: ele_c2.split('_')[1],
                    renderCell: (params) => {
                      const datasss = params.row;
                      console.log('datasss', datasss);

                      const getTooltipContent = () => {
                        const statementdata = qtyType.map((element) => {
                          return (
                            <div style={{ display: 'flex' }} key={element}>
                              {formatunderscoreLabel(element)} :{' '}
                              {
                                datasss[
                                `${ele.split('_')[0]}_${ele_c1}_${ele_c2.split('_')[0]}_${element}`
                                ]
                              }
                              <br />
                            </div>
                          );
                        });

                        return (
                          <>
                            Double-click to view the stock details batch-wise.
                            <br />
                            {statementdata}
                          </>
                        );
                      };

                      return (
                        <Tooltip
                          title={getTooltipContent()}
                          placement="top"
                          arrow
                        >
                          <Button
                            onDoubleClick={() =>
                              handleViewStockList(
                                ele.split('_')[0],
                                ele_c1,
                                ele_c2.split('_')[0],
                                datasss
                              )
                            }
                          >
                            <div
                              style={{
                                display: 'flex',
                                marginLeft: '20px',
                                backgroundColor: 'var(--ProjectColor)',
                                padding: '10px',
                                width: '70px',
                                borderRadius: '10px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '100%',
                                  color: 'black',
                                  fontWeight: 'bold',
                                }}
                              >
                                {
                                  datasss[
                                  `${ele.split('_')[0]}_${ele_c1}_${ele_c2.split('_')[0]}_${searchQuery.ViewType}`
                                  ]
                                }
                              </div>
                            </div>
                          </Button>
                        </Tooltip>
                      );
                    },
                  })),
                ],
              })),
            ],
          }));

          const mergedcol = [...predefinedColumns, ...coll];
          setsumma1column(mergedcol);
        })
        .catch((err) => {
          console.error('Error fetching stock details: ', err);
        });
    } else {
      const predefinedColumns = [
        {
          key: 'Action',
          name: 'Action',
          renderCell: (params) => {
            const datass = params.row;
            return (
              <Button
                className="cell_btn"
                onClick={() =>
                  handleViewStockList(
                    datass?.ItemCode,
                    datass?.StoreType,
                    datass?.StoreId,
                    datass
                  )
                }
              >
                <VisibilityIcon className="check_box_clrr_cancell" />
              </Button>
            );
          },
        },
        { key: 'ItemCode', name: 'Item Code' },
        { key: 'ItemName', name: 'Item Name' },
        { key: 'ProductCategory', name: 'Product Category' },
        { key: 'SubCategory', name: 'Sub Category' },
        { key: 'Location', name: 'Location' },
        { key: 'StoreType', name: 'Store Type' },
        { key: 'StoreName', name: 'Store Name' },
        ...qtyType.map((ele) => ({
          key: ele,
          name: formatunderscoreLabel(ele),
          width: 180,
        })),
      ];
      setsumma1column(predefinedColumns);
    }
  }, [
    UrlLink,
    searchQuery.ViewType,
    searchQuery.FilterType,
    qtyType,
    handleViewStockList,
  ]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/get_overall_stock_list_details`, {
        params: searchQuery,
      })
      .then((res) => {
        const Stock_Detials = res.data;
        console.log('Stock_Detials', Stock_Detials);
        setsumma1(Stock_Detials);
      })
      .catch((err) => {
        console.error('Error fetching stock details: ', err);
      });
  }, [UrlLink, searchQuery]);

  const popupcolumn = [
    { key: 'ItemCode', name: 'Item Code' },
    { key: 'ItemName', name: 'Item Name' },
    { key: 'ProductCategory', name: 'Product Category' },
    { key: 'SubCategory', name: 'Sub Category' },
    { key: 'Batch_No', name: 'Batch No' },
    { key: 'Expiry_Date', name: 'Expiry Date' },
    ...qtyType.map((ele) => ({
      key: ele,
      name: formatunderscoreLabel(ele),
      width: 180,
    })),
    { key: 'Location', name: 'Location' },
    { key: 'StoreType', name: 'Store Type' },
    { key: 'StoreName', name: 'Store Name' },
  ];


  const [SelectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(null);
    setSelectedFile(event.target.files[0]);
  };
  const handleCsvupload = () => {
    console.log(SelectedFile);
    const formData = new FormData();
    formData.append("file", SelectedFile);
    formData.append("created_by", userRecord?.username);

    if (SelectedFile) {
      axios
        .post(`${UrlLink}Inventory/Stock_Excel_File_Upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(response);
          setSelectedFile(null);

          let data = response.data;

          let type = Object.keys(data)[0]
          let mess = Object.values(data)[0]
          const tdata = {
            message: mess,
            type: type
          }
          dispatchvalue({ type: 'toast', value: tdata })

          setsearchQuery({
            FilterType: 'OverAll',
            ViewType: 'AvailableQuantity',
            Location: '',
            StoreType: '',
            StoreName: '',
            ItemCode: '',
            ItemName: '',
            ProductCategory: '',
            SubCategory: '',
          })

        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } else {
      // userwarn("Choose File");
    }
  };


  return (
    <>
      <div className="Main_container_app">
        <h3>Stock Detail List</h3>
        <br />

        <div className="RegisFormcon_1">
          {Object.keys(searchQuery)
            .filter((ele) => {
              if (searchQuery.FilterType === 'OverAll') {
                return !['Location', 'StoreType', 'StoreName'].includes(ele);
              } else {
                return !['ViewType'].includes(ele);
              }
            })
            .map((field, indx) => (
              <div className="RegisForm_1" key={indx}>
                <label>
                  {formatunderscoreLabel(field)}
                  <span>:</span>
                </label>
                {[
                  'ViewType',
                  'FilterType',
                  'Location',
                  'StoreType',
                  'StoreName',
                  'ProductCategory',
                  'SubCategory',
                ].includes(field) ? (
                  <select
                    name={field}
                    value={searchQuery[field]}
                    onChange={handleonchange}
                    autoComplete='off'
                    disabled={
                      field === 'SubCategory'
                        ? !searchQuery.ProductCategory
                        : field === 'StoreType'
                          ? !searchQuery.Location
                          : field === 'StoreName'
                            ? !searchQuery.StoreType
                            : false
                    }
                  >
                    {!['ViewType', 'FilterType'].includes(field) && (
                      <option value="">Select</option>
                    )}
                    {field === 'ViewType' &&
                      qtyType.map((ele, indx) => (
                        <option value={ele} key={indx}>
                          {formatunderscoreLabel(ele)}
                        </option>
                      ))}
                    {field === 'FilterType' &&
                      ['OverAll', 'Location'].map((ele, indx) => (
                        <option value={ele} key={indx}>
                          {formatunderscoreLabel(ele) + ' View'}
                        </option>
                      ))}
                    {field === 'Location' &&
                      summaArray1.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {ele.locationName}
                        </option>
                      ))}
                    {field === 'StoreType' &&
                      ['NurseStation', 'Inventory'].map((ele, indx) => (
                        <option value={ele} key={indx}>
                          {formatunderscoreLabel(ele) + ' Store'}
                        </option>
                      ))}
                    {field === 'StoreName' &&
                      summaArray2.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {searchQuery.StoreType === 'NurseStation'
                            ? ele.NurseStation
                            : ele.StoreName}
                        </option>
                      ))}
                    {field === 'ProductCategory' &&
                      summaArray3.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {ele.ProductCategory}
                        </option>
                      ))}
                    {field === 'SubCategory' &&
                      summaArray4.map((ele, ind) => (
                        <option key={ind + 'key'} value={ele.id}>
                          {ele.SubCategoryName}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={searchQuery[field]}
                    onChange={handleonchange}
                    autoComplete='off'
                  />
                )}
              </div>
            ))}
        </div>


        <br />
        <div style={{ display: "flex", alignItems: "center", }}>
          <label>
            {" "}
            CurrentStock Excel File<span>:</span>{" "}
          </label>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            id="Servicechoose"
            required
            style={{ display: "none" }}
            onChange={handleFileChange}
            autoComplete='off'
          />



          <label
            htmlFor="Servicechoose"
            title='Choose File'
            className="RegisterForm_1_btns choose_file_update"
          >
            <PhotoCameraBackIcon />
          </label>
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={handleCsvupload}
            title='File Upload'
          >

            <DriveFolderUploadIcon />

          </button>
        </div>

        <br></br>
        {Array.isArray(summa1column) && summa1column.length !== 0 && (
          <ReactGrid columns={summa1column} RowData={summa1} />
        )}
      </div>
      {summaArray5.length !== 0 && (
        <div className="loader" onClick={() => setsummaArray5([])}>
          <div
            className="loader_register_roomshow"
            onClick={(e) => e.stopPropagation()}
          >
            <br />
            <div className="common_center_tag">
              <span>Stock List Details</span>
            </div>
            <br />

            <ReactGrid columns={popupcolumn} RowData={summaArray5} />
          </div>
        </div>
      )}

      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default StockList;
