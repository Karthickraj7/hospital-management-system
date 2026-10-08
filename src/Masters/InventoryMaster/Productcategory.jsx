import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import axios from 'axios'
import ListIcon from '@mui/icons-material/List'
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert'

const Productcategory = () => {
  const [RackMasterPage, setRackMasterPage] = useState('Productcategory')

  const UrlLink = useSelector(state => state.userRecord?.UrlLink)

  const toast = useSelector(state => state.userRecord?.toast)
  const userRecord = useSelector(state => state.userRecord?.UserData)
  const dispatchvalue = useDispatch()

  const [ProductFields, setProductFields] = useState([])

  const [ProductCategory, setproductCategory] = useState({
    Id: '',
    Name: ''
  })
  const [ProductCategoryData, setproductCategoryData] = useState([]);
  console.log('ProductCategoryData---',ProductCategoryData)
  const [ProductCategorygetstate, setProductCategorygetstate] = useState(false)
  const [CategorySelected, setCategorySelected] = useState(false)
  const [CategorySelectedData, setCategorySelectedData] = useState(null)

  // -----------------------sub cat

  const [SubCategorystate, setSubCategorystate] = useState({
    ProductCategoryId: '',
    SubCategoryName: '',
    SubCategoryId: ''
  })

  const [SubCategoryArray, setSubCategoryArray] = useState([]);


  // -------------------------------------------------------------

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const [data, data1] = await Promise.all([
          axios.get(
            `${UrlLink}Inventory/get_Product_fields_for_productcategory`
          ),
          axios.get(`${UrlLink}Inventory/Product_Category_Product_Details_link`)
        ])
        setProductFields(data.data)
        setproductCategoryData(data1.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchdata()
  }, [UrlLink, ProductCategorygetstate])

  const ProductCategoryColumns = [
    {
      key: 'id',
      name: 'Product Category Id',
      frozen: true
    },

    {
      key: 'ProductCategory',
      name: 'Product Category'
    },
    {
      key: 'ProductFields',
      name: 'Product Fields',
      renderCell: params => (
        <>
          <Button
            className='cell_btn'
            onClick={() => handleeditProductCategory(params.row, true)}
          >
            <ListIcon className='check_box_clrr_cancell' />
          </Button>
        </>
      )
    },
    {
      key: 'Status',
      name: 'Status',
      renderCell: params => (
        <>
          <Button
            className='cell_btn'
            onClick={() => handleeditProductCategorystatus(params.row)}
          >
            {params.row.Status}
          </Button>
        </>
      )
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: params => (
        <>
          <Button
            className='cell_btn'
            onClick={() => handleeditProductCategory(params.row)}
          >
            <EditIcon className='check_box_clrr_cancell' />
          </Button>
        </>
      )
    }
  ];

  const handleeditProductCategorystatus = params => {
    const data = {
      Id: params.id,
      Statusedit: true
    }
    axios
      .post(`${UrlLink}Inventory/Product_Category_Product_Details_link`, data)
      .then(res => {
        const resres = res.data
        let typp = Object.keys(resres)[0]
        let mess = Object.values(resres)[0]
        const tdata = {
          message: mess,
          type: typp
        }

        dispatchvalue({ type: 'toast', value: tdata })
        setProductCategorygetstate(prev => !prev)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleeditProductCategory = (params, type = false) => {
    const { id, ...rest } = params
    axios
      .get(`${UrlLink}Inventory/Product_Category_Product_Details_link?Id=${id}`)
      .then(res => {
        const { id, Name, fileds_data } = res.data
        if (type) {
          setCategorySelected(true)
          setCategorySelectedData(res.data)
        } else {
          setproductCategory({
            Id: id,
            Name: Name
          })
          setProductFields(fileds_data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handlesaveProductcategory = () => {
    if (ProductCategory.Name) {
      const filterfields = ProductFields.filter(f => f.checked).map(
        field => field.id
      )
      const senddata = {
        ...ProductCategory,
        field_Names: filterfields.join(','),
        created_by: userRecord?.username
      }
      axios
        .post(
          `${UrlLink}Inventory/Product_Category_Product_Details_link`,
          senddata
        )
        .then(res => {
          // console.log(res.data);

          let data = res.data

          let type = Object.keys(data)[0]
          let mess = Object.values(data)[0]
          const tdata = {
            message: mess,
            type: type
          }
          dispatchvalue({ type: 'toast', value: tdata })

          setproductCategory({
            Id: '',
            Name: ''
          })

          setProductCategorygetstate(prev => !prev)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      const tdata = {
        message: 'Please fill the Product Category Name',
        type: 'warn'
      }
      dispatchvalue({ type: 'toast', value: tdata })
    }
  }

  // ------------------------Sub Cat ------------------------------

  const GetSubCategorydata = useCallback(() => {
    axios
      .get(`${UrlLink}Masters/SubCategory_Master_link`)
      .then(res => {
        console.log(res.data)
        let data = res.data

        if (Array.isArray(data) && data.length !== 0) {
          setSubCategoryArray(data)
        } else {
          setSubCategoryArray([])
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [UrlLink])

  const HandleUpdateSubStatus = params => {
    let Editdata = {
      SubCategoryId: params.id,
      Statusedit: true
    }

    axios
      .post(`${UrlLink}Masters/SubCategory_Master_link`, Editdata)
      .then(res => {
        // console.log(res.data);
        let data = res.data

        let type = Object.keys(data)[0]
        let mess = Object.values(data)[0]
        const tdata = {
          message: mess,
          type: type
        }
        dispatchvalue({ type: 'toast', value: tdata })
        GetSubCategorydata()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const HandeleSubCatEditName = params => {
    let Editdata = params

    setSubCategorystate(prev => ({
      ...prev,
      ProductCategoryId: Editdata.ProductCategoryId,
      SubCategoryName: Editdata.SubCategoryName,
      SubCategoryId: Editdata.id
    }))
  }

  const SubCategoryColumn = [
    {
      key: 'id',
      name: 'SubCategory Id',
      frozen: true
    },
    {
      key: 'ProductCategory_Name',
      name: 'Category Name',
      frozen: true
    },
    {
      key: 'SubCategoryName',
      name: 'SubCategory Name',
      frozen: true
    },
    {
      key: 'Status',
      name: 'Status',
      renderCell: params => (
        <>
          <Button
            className='cell_btn'
            onClick={() => HandleUpdateSubStatus(params.row)}
          >
            {params.row.Status ? 'ACTIVE' : 'INACTIVE'}
          </Button>
        </>
      )
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: params => (
        <>
          <Button
            className='cell_btn'
            onClick={() => HandeleSubCatEditName(params.row)}
          >
            <EditIcon className='check_box_clrr_cancell' />
          </Button>
        </>
      )
    }
  ]

  useEffect(() => {
    GetSubCategorydata()
  }, [GetSubCategorydata])

  const HandleSaveCategory = () => {
    let Senddata = {
      ...SubCategorystate,
      created_by: userRecord?.username || ''
    }

    axios
      .post(`${UrlLink}Masters/SubCategory_Master_link`, Senddata)
      .then(res => {
        console.log(res.data)

        let data = res.data

        let type = Object.keys(data)[0]
        let mess = Object.values(data)[0]
        const tdata = {
          message: mess,
          type: type
        }
        dispatchvalue({ type: 'toast', value: tdata })

        setSubCategorystate({
          ProductCategoryId: '',
          SubCategoryName: '',
          SubCategoryId: ''
        })

        GetSubCategorydata()
      })
      .catch(err => {
        console.log(err)
      })
  }
  const allowedCategoryIds = userRecord.ProductCategory_list.map(item => item.ProductCategoryAccessId);

  const filteredProductCategoryData = ProductCategoryData.filter(item =>
    allowedCategoryIds.includes(item.id)
  );
  console.log('filteredProductCategoryData',filteredProductCategoryData)
  
  const filteredSubProductCategoryData = SubCategoryArray.filter(item =>
    allowedCategoryIds.includes(item.ProductCategoryId)
  );
  console.log('filteredSubProductCategoryData', filteredSubProductCategoryData)
  return (
    <>
      <div className='Main_container_app'>
        <h3> Product Master</h3>
        <br />
        <div className='RegisterTypecon'>
          <div className='RegisterType'>
            {['Productcategory', 'SubCategory'].map((p, ind) => (
              <div className='registertypeval' key={ind}>
                <input
                  type='radio'
                  id={p}
                  name='appointment_type'
                  checked={RackMasterPage === p}
                  onChange={e => {
                    setRackMasterPage(e.target.value)
                  }}
                  value={p}
                />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </div>
        </div>

        <br />

        {RackMasterPage === 'Productcategory' && (
          <>
            <div className='RegisFormcon_1'>
              <div className='RegisForm_1'>
                <label>
                  Product Category
                  <span>:</span>
                </label>
                <input
                  type={'text'}
                  name={'Name'}
                  value={ProductCategory.Name}
                  onChange={e => {
                    setproductCategory(prev => ({
                      ...prev,
                      Name: e.target.value
                    }))
                  }}
                />
              </div>
            </div>
            <br />
            <div className='common_center_tag'>
              <span>Select Product Fields </span>
            </div>
            <br />
            <div className='displayuseraccess'>
              {ProductFields.map((p, indx) => (
                <div className='displayuseraccess_child' key={indx}>
                  <label
                    htmlFor={`${indx}_${p?.field_Name}`}
                    className='par_acc_lab'
                  >
                    <input
                      type='checkbox'
                      id={`${indx}_${p?.field_Name}`}
                      checked={p?.checked}
                      style={{ marginRight: '10px' }}
                      disabled={[1,2,3,4,12,13,18,21,22,23].includes(p.id) }
                      onChange={e => {
                        const { checked } = e.target
                        setProductFields(prev => {
                          return prev.map(field => {
                            if (field.id === p.id) {
                              return { ...field, checked } // Update the checked status
                            }
                            return field // Return the field unchanged if it's not the one we want
                          })
                        })
                      }}
                    />
                    {p?.field_Name}
                  </label>
                </div>
              ))}
            </div>
            <div className='Main_container_Btn'>
              <button onClick={handlesaveProductcategory}>
                {ProductCategory.Id ? 'Update' : 'Save'}
              </button>
            </div>



     

    {(filteredProductCategoryData.length > 0 ? filteredProductCategoryData : ProductCategoryData).length > 0 && (
      <ReactGrid
        columns={ProductCategoryColumns}
        RowData={
          filteredProductCategoryData.length > 0
            ? filteredProductCategoryData
            : ProductCategoryData
        }
      />
    )}

{/* 
            <ReactGrid
              columns={ProductCategoryColumns}
              RowData={filteredProductCategoryData || ProductCategoryData}
            /> */}

            



          </>
        )}

        {RackMasterPage === 'SubCategory' && (
          <>
            <br />

            <div className='RegisFormcon_1'>
              <div className='RegisForm_1'>
                <label>
                  Product Category<span>:</span>{' '}
                </label>
                <select
                  name='ProductCategoryId'
                  required
                  value={SubCategorystate.ProductCategoryId}
                  disabled={SubCategorystate.SubCategoryId}
                  onChange={e =>
                    setSubCategorystate(prev => ({
                      ...prev,
                      ProductCategoryId: e.target.value
                    }))
                  }
                >
                  <option value=''>Select</option>
                  {ProductCategoryData.map((ele, ind) => (
                    <option key={ind + 'key'} value={ele.id}>
                      {ele.ProductCategory}
                    </option>
                  ))}
                </select>
              </div>

              <div className='RegisForm_1'>
                <label>
                  Sub Category<span>:</span>{' '}
                </label>
                <input
                  type='text'
                  name='SubCategoryName'
                  autoComplete='off'
                  required
                  value={SubCategorystate.SubCategoryName}
                  onChange={e =>
                    setSubCategorystate(prev => ({
                      ...prev,
                      SubCategoryName: e.target.value
                    }))
                  }
                />
              </div>
            </div>

            <div className='Main_container_Btn'>
              <button onClick={HandleSaveCategory}>
                {SubCategorystate.SubCategoryId ? 'Update' : 'Add'}
              </button>
            </div>


          
            {(filteredSubProductCategoryData.length > 0 ? filteredSubProductCategoryData : SubCategoryColumn).length > 0 && (
      <ReactGrid
        columns={SubCategoryColumn}
        RowData={
          filteredSubProductCategoryData.length > 0
            ? filteredSubProductCategoryData
            : SubCategoryArray
        }
      />
    )}


            {/* <ReactGrid columns={SubCategoryColumn} RowData={filteredSubProductCategoryData||SubCategoryArray} /> */}
          </>
        )}
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
      {CategorySelected && (
        <div className='loader' onClick={() => setCategorySelected(false)}>
          <div
            className='loader_register_roomshow'
            onClick={e => e.stopPropagation()}
          >
            <br />

            <div className='common_center_tag'>
              <span>Selected Fields for '{CategorySelectedData?.Name}'</span>
            </div>
            <br />
            <div className='displayuseraccess'>
              {CategorySelectedData?.fileds_data
                ?.filter(f => f.checked)
                .map((p, indx) => (
                  <div className='displayuseraccess_child' key={indx}>
                    <label
                      htmlFor={`${indx}_${p?.field_Name}`}
                      className='par_acc_lab'
                    >
                      {`${indx + 1}. ${p?.field_Name}`}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Productcategory
