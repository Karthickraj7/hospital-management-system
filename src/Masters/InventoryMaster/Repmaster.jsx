import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const Repmaster = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
  const toast = useSelector((state) => state.userRecord?.toast);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const dispatch = useDispatch();

  const [RepMaster, setRepMaster] = useState({
    RepId: '',
    RepName: '',
    RepCompanyName: '',
    RepPhonenumber: '',
    RepDoorno: '',
    RepStreet: '',
    RepArea: '',
    RepCity: '',
    RepDistrict: '',
    RepState: '',
    RepCountry: '',
    RepPincode: '',
    CompanyName: '',
    GenericName: '',
    CompanyId: '',
    GenericId: '',
    ProductCategoryName: '',
    SubProductCategoryName: '',
    SupplierName: '',
    SupllierId: '',
    Rate:'',
  });

  const [ProductCategoryData, setProductCategoryData] = useState([]);
  const [SubCategoryData, setSubCategoryData] = useState([]);
  const [ManfacturerData, setManfacturerData] = useState([]);
  const [ProductNameData, setProductNameData] = useState([]);
  const [SelectedDataList, setSelectedDataList] = useState([]);
  const [IsRepGet, setIsRepGet] = useState(false);
  const [MedicalRepArray, setMedicalRepArray] = useState([]);
  const [ViewArray, setViewArray] = useState([]);
  const [selectedrow, setselectedrow] = useState(false);
  const [Supplierdata, setSupplierdata] = useState([]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/Product_Category_Product_Details_link`)
      .then((response) =>
        setProductCategoryData(
          Array.isArray(response.data) ? response.data : []
        )
      )
      .catch((err) => console.error('Error fetching Product category', err));
  }, [UrlLink]);

  useEffect(() => {
    if (!RepMaster.ProductCategoryName) {
      setSubCategoryData([]);
      return;
    }
    axios
      .get(
        `${UrlLink}Inventory/Sub_Product_Category_Details_by_Product?ProductCategory=${RepMaster.ProductCategoryName}`
      )
      .then((response) =>
        setSubCategoryData(Array.isArray(response.data) ? response.data : [])
      )
      .catch((err) => console.error('Error fetching Subcategory', err));
  }, [UrlLink, RepMaster.ProductCategoryName]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/all_supplier_details_link`)
      .then((res) => {
        setSupplierdata(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'RepName') {
      setRepMaster((prev) => ({
        ...prev,
        [name]:
          name === 'RepName'
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : value,
      }));
    } else if (name === 'RepCompanyName') {
      setRepMaster((prev) => ({
        ...prev,
        [name]:
          name === 'RepCompanyName'
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : value,
      }));
    } else if (name === 'RepPhonenumber' && value.length > 10) {
      dispatch({
        type: 'toast',
        value: { message: 'ContactNumber only 10 digits number', type: 'warn' },
      });
    } else if (name === 'RepStreet') {
      setRepMaster((prev) => ({
        ...prev,
        [name]:
          name === 'RepStreet'
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : value,
      }));
    } else if (name === 'RepArea') {
      setRepMaster((prev) => ({
        ...prev,
        [name]:
          name === 'RepArea'
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : value,
      }));
    } else if (name === 'RepCity') {
      setRepMaster((prev) => ({
        ...prev,
        [name]:
          name === 'RepCity'
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : value,
      }));
    } else if (name === 'RepDistrict') {
      setRepMaster((prev) => ({
        ...prev,
        [name]:
          name === 'RepDistrict'
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : value,
      }));
    } else if (name === 'RepState') {
      setRepMaster((prev) => ({
        ...prev,
        [name]:
          name === 'RepState'
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : value,
      }));
    } else if (name === 'RepCountry') {
      setRepMaster((prev) => ({
        ...prev,
        [name]:
          name === 'RepCountry'
            ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
            : value,
      }));
    } else if (name === 'ProductCategoryName') {
      setRepMaster((prev) => ({
        ...prev,
        ProductCategoryName: value,
        SubProductCategoryName: '',
        CompanyName: '',
        GenericName: '',
        GenericId: '',
        CompanyId: '',
        SupplierName: '',
        SupllierId: '',
        Rate:'',
      }));
    } else if (name === 'SubProductCategoryName') {
      setRepMaster((prev) => ({
        ...prev,

        SubProductCategoryName: value,
        CompanyName: '',
        CompanyId: '',
        GenericName: '',
        GenericId: '',
        SupplierName: '',
        SupllierId: '',
        Rate:'',
      }));
    } else if (name === 'CompanyName') {
      const selectedCompany = ManfacturerData.find(
        (item) => item.CompanyName === value
      );
      setRepMaster((prev) => ({
        ...prev,
        CompanyName:
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
        CompanyId: selectedCompany ? selectedCompany.id : '', // Store Company ID
      }));
    } else if (name === 'GenericName') {
      const selectedItem = ProductNameData.find(
        (item) => item.ItemName === value
      );
      setRepMaster((prev) => ({
        ...prev,
        GenericName:
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
        GenericId: selectedItem ? selectedItem.id : '',
      }));
    } else if (name === 'SupplierName') {
      const selectedsupplier = Supplierdata.find(
        (item) => item.Supplier_Name === value
      );
      setRepMaster((prev) => ({
        ...prev,
        SupplierName:
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
        SupllierId: selectedsupplier ? selectedsupplier.id : '',
      }));
    } else {
      setRepMaster((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchManufacturerName = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Inventory/Manufacturer_Names_link?Productname=${RepMaster.ProductCategoryName}&Subcategory=${RepMaster.SubProductCategoryName}&CompanyName=${RepMaster.CompanyName}`
        );
        console.log('companyname', response.data);

        setManfacturerData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching company names:', err);
      }
    };

    if (
      RepMaster.ProductCategoryName &&
      RepMaster.SubProductCategoryName &&
      RepMaster.CompanyName
    ) {
      fetchManufacturerName();
    }
  }, [UrlLink, RepMaster]);

  useEffect(() => {
    const fetchBrandName = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Inventory/ItemNames_for_RepMaster?Productname=${RepMaster.ProductCategoryName}&Subcategory=${RepMaster.SubProductCategoryName}&ItemName=${RepMaster.GenericName}`
        );

        setProductNameData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching company names:', err);
      }
    };

    if (
      RepMaster.ProductCategoryName &&
      RepMaster.SubProductCategoryName &&
      RepMaster.GenericName
    ) {
      fetchBrandName();
    }
  }, [UrlLink, RepMaster]);

  const handlePlusItemname = () => {
    if (
      !RepMaster.ProductCategoryName &&
      !RepMaster.SubProductCategoryName &&
      !RepMaster.CompanyName &&
      !RepMaster.GenericName &&
      !RepMaster.SupplierName && 
      !RepMaster.Rate
    ) {
      dispatch({
        type: 'toast',
        value: {
          message: 'Please fill all fields before adding.',
          type: 'warn',
        },
      });
      return;
    }

    // Assigning an index based on the existing list length
    const newIndex = SelectedDataList.length + 1;
    const selectedSubCategory = SubCategoryData.find(
      (sub) => sub.id == RepMaster.SubProductCategoryName
    );

    // Prepare the new entry
    const newItem = {
      id: newIndex, // Assign an index for tracking
      ProductCategoryName: RepMaster.ProductCategoryName,
      SubProductCategoryName: RepMaster.SubProductCategoryName,
      SubProductCategoryDisplayName: selectedSubCategory
        ? selectedSubCategory.SubCategoryName
        : 'N/A',
      CompanyId: RepMaster.CompanyId || '',
      CompanyName: RepMaster.CompanyName,
      GenericId: RepMaster.GenericId || '',
      GenericName: RepMaster.GenericName,
      SupplierName: RepMaster.SupplierName,
      SupllierId: RepMaster.SupllierId || '',
      Rate:RepMaster.Rate || 0,
    };

    // Avoid duplicate entries
    const exists = SelectedDataList.some(
      (item) =>
        item.ProductCategoryName === newItem.ProductCategoryName &&
        item.SubProductCategoryName === newItem.SubProductCategoryName &&
        item.CompanyName === newItem.CompanyName &&
        item.GenericName === newItem.GenericName &&
        item.SupplierName === newItem.SupplierName 
        
    );

    if (exists) {
      dispatch({
        type: 'toast',
        value: { message: 'This entry already exists.', type: 'warn' },
      });
      return;
    }

    // Add the new item to the list with an index
    setSelectedDataList((prev) => [...prev, newItem]);

    // Clear the form fields
    setRepMaster((prev) => ({
      ...prev,
      ProductCategoryName: '',
      SubProductCategoryName: '',
      CompanyName: '',
      CompanyId: '',
      GenericName: '',
      GenericId: '',
      SupplierName: '',
      SupllierId: '',
      Rate:''
    }));

    dispatch({
      type: 'toast',
      value: { message: `Item added successfully `, type: 'success' },
    });
  };
  const handleRemoveItems = (item) => {
    setSelectedDataList((prev) => prev.filter((i) => i.id !== item.id));

    dispatch({
      type: 'toast',
      value: { message: 'Item removed successfully!', type: 'success' },
    });
  };

  const ItemnameColumns = [
    {
      key: 'id',
      name: 'S.No',
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: 'ProductCategoryName',
      name: 'Product Category',
      renderCell: (params) => {
        const category = ProductCategoryData.find(
          (cat) => cat.id == params.row.ProductCategoryName
        );
        return category ? category.ProductCategory : 'N/A';
      },
    },
    {
      key: 'SubProductCategoryDisplayName',
      name: 'Sub Category',
    },
    {
      key: 'CompanyName',
      name: 'Company Name',
    },
    {
      key: 'GenericName',
      name: 'Brand Name',
    },
    {
      key: 'SupplierName',
      name: 'Supplier Name',
    },
    {
        key:'Rate',
        name:'Rate',

    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <Button
          className="cell_btn"
          onClick={() => handleRemoveItems(params.row)}
        >
          <FaTrash className="check_box_clrr_cancell" />
        </Button>
      ),
    },
  ];

  const handleSubmit = () => {
    if (
      RepMaster.RepName &&
      RepMaster.RepCompanyName &&
      RepMaster.RepDoorno &&
      RepMaster.RepStreet &&
      RepMaster.RepArea &&
      RepMaster.RepCity &&
      RepMaster.RepDistrict &&
      RepMaster.RepState &&
      RepMaster.RepCountry &&
      RepMaster.RepPincode
    ) {
      if (SelectedDataList.length === 0) {
        dispatch({
          type: 'toast',
          value: { message: 'Add the company and Brand Name.', type: 'warn' },
        });
        return;
      }

      const postdata = {
        ...RepMaster,
        SelectedDataList: SelectedDataList || [],
        created_by: userRecord.username || '',
        location: userRecord.location || '',
      };
      console.log('postdata', postdata);
      axios
        .post(`${UrlLink}Inventory/MedicalRep_Details_Link`, postdata)
        .then((res) => {
          const reste = res.data;
          const typp = Object.keys(reste)[0];
          const mess = Object.values(reste)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          dispatchvalue({ type: 'toast', value: tdata });
          setIsRepGet((pre) => !pre);
          setRepMaster({
            RepId: '',
            RepName: '',
            RepCompanyName: '',
            RepPhonenumber: '',
            RepDoorno: '',
            RepStreet: '',
            RepArea: '',
            RepCity: '',
            RepDistrict: '',
            RepState: '',
            RepCountry: '',
            RepPincode: '',
            CompanyName: '',
            GenericName: '',
            CompanyId: '',
            GenericId: '',
            ProductCategoryName: '',
            SubProductCategoryName: '',
            SupllierId: '',
            SupplierName: '',
            Rate:'',
          });
          setSelectedDataList([]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatch({
        type: 'toast',
        value: { message: 'Please Fill All Fields.', type: 'warn' },
      });
    }
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/Medical_Rep`)
      .then((response) => {
        setMedicalRepArray(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsRepGet, UrlLink]);

  const handleView = (row) => {
    if (MedicalRepArray.length > 0 && row?.SelectedDatalist.length > 0) {
      setViewArray(row?.SelectedDatalist);
      setselectedrow(true);
    } else {
      const tdata = {
        message: 'There is no data to view.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  const MedicalRepColumns = [
    {
      key: 'id',
      name: 'S.No',
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: 'MedicalRep_Name',
      name: 'Medical RepName',
    },
    {
      key: 'MedicalRep_PhoneNumber',
      name: 'Rep PhoneNumber',
    },
    {
      key: 'MedicalRep_CompanyName',
      name: 'Rep CompanyName',
    },
    {
      key: 'View',
      name: 'View',
      renderCell: (params) =>
        params?.row ? (
          <Button className="cell_btn" onClick={() => handleView(params?.row)}>
            <VisibilityIcon className="check_box_clrr_cancell" />
          </Button>
        ) : (
          'No View'
        ),
    },
  ];

  const viewColumns = [
    {
      key: 'id',
      name: 'S.No',
      frozen: pagewidth > 500 ? true : false,
    },
    {
      key: 'ProductCategoryCompanyName',
      name: 'Product CategoryName',
    },
    {
      key: 'SubProductCategoryCompanyName',
      name: 'Sub CategoryName',
    },
    {
      key: 'BrandName',
      name: 'BrandName',
    },
    {
      key: 'CompanyName',
      name: 'CompanyName',
    },
    {
      key: 'SupplierName',
      name: 'Supplier Name',
    },
    {
        key:'Rate',
        name:'Rate',
    }
  ];

  const [SelectedFile, setSelectedFile] = useState(null);
  const handleFileChangeRepMaster = (event) => {
    setSelectedFile(null);
    setSelectedFile(event.target.files[0]);
  };
  const handleCsvuploadRepMaster = () => {
    const formData = new FormData();
    formData.append('file', SelectedFile);
    formData.append('created_by', userRecord?.username);
    formData.append('loaction', userRecord?.location);

    if (SelectedFile) {
      axios
        .post(`${UrlLink}Inventory/Medical_RepMaster_File_Upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          setSelectedFile(null);
          let data = response.data;
          let type = Object.keys(data)[0];
          let mess = Object.values(data)[0];
          const tdata = {
            mess: mess,
            type: type,
          };
          dispatchvalue({ type: 'toast', value: tdata });
          setIsRepGet((pre) => !pre);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    }
  };
 
  return (
    <>
      <div className="Main_container_app">
        <h3>Medicl Rep Masters</h3>
        <br></br>
        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>
              Medical Rep Name <span>:</span>{' '}
            </label>
            <input
              type="text"
              name="RepName"
              autoComplete="off"
              required
              value={RepMaster.RepName}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Rep Phone Number <span>:</span>{' '}
            </label>
            <input
              type="number"
              name="RepPhonenumber"
              autoComplete="off"
              required
              value={RepMaster.RepPhonenumber}
              onChange={handleChange}
              onKeyDown={(e) =>
                ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
              }
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Rep Company Name <span>:</span>{' '}
            </label>
            <input
              type="text"
              name="RepCompanyName"
              autoComplete="off"
              required
              value={RepMaster.RepCompanyName}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Door no <span>:</span>
            </label>
            <input
              type="number"
              name="RepDoorno"
              autoComplete="off"
              required
              onKeyDown={(e) =>
                ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
              }
              value={RepMaster.RepDoorno}
              onChange={handleChange}
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Street<span>:</span>{' '}
            </label>
            <input
              type="text"
              name="RepStreet"
              autoComplete="off"
              required
              value={RepMaster.RepStreet}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Area <span>:</span>
            </label>
            <input
              type="text"
              name="RepArea"
              autoComplete="off"
              required
              value={RepMaster.RepArea}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              City<span>:</span>
            </label>
            <input
              type="text"
              name="RepCity"
              autoComplete="off"
              required
              value={RepMaster.RepCity}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              District<span>:</span>{' '}
            </label>
            <input
              type="text"
              name="RepDistrict"
              autoComplete="off"
              required
              value={RepMaster.RepDistrict}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              State<span>:</span>
            </label>
            <input
              type="text"
              name="RepState"
              autoComplete="off"
              required
              value={RepMaster.RepState}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Pincode<span>:</span>{' '}
            </label>
            <input
              type="number"
              name="RepPincode"
              autoComplete="off"
              required
              value={RepMaster.RepPincode}
              onChange={handleChange}
              onKeyDown={(e) =>
                ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
              }
            />
          </div>
          <div className="RegisForm_1">
            <label>
              Country<span>:</span>
            </label>
            <input
              type="text"
              name="RepCountry"
              autoComplete="off"
              required
              value={RepMaster.RepCountry}
              onChange={handleChange}
            />
          </div>
        </div>
        <br />
        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>
              Product Category <span>:</span>
            </label>
            <select
              name="ProductCategoryName"
              value={RepMaster.ProductCategoryName}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {Array.isArray(ProductCategoryData) &&
                ProductCategoryData.filter((p) => p.Status === 'Active') // Filters only active categories
                  .map((Prod, indx) => (
                    <option key={indx} value={Prod.id}>
                      {Prod.ProductCategory}
                    </option>
                  ))}
            </select>
          </div>
          <div className="RegisForm_1">
            <label>
              SubProduct Category <span>:</span>
            </label>
            <select
              name="SubProductCategoryName"
              value={RepMaster.SubProductCategoryName}
              onChange={handleChange} // Corrected from onchange to onChange
            >
              <option value="">Select</option>
              {Array.isArray(SubCategoryData) &&
                SubCategoryData.filter((p) => p.Status === 'Active') // Filters only active categories
                  .map((subProd, indx) => (
                    <option key={indx} value={subProd.id}>
                      {subProd.SubCategoryName}
                    </option>
                  ))}
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              Company Name<span>:</span>
            </label>
            <input
              type="text"
              name="CompanyName"
              autoComplete="off"
              list="packagenameOptions"
              required
              value={RepMaster.CompanyName}
              onChange={handleChange}
            />
            <datalist id="packagenameOptions">
              {ManfacturerData &&
                ManfacturerData.length > 0 &&
                ManfacturerData.map((pack, index) => (
                  <option key={`${index}_index`} value={pack.CompanyName} />
                ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label>
              Item Name<span>:</span>{' '}
            </label>
            <input
              type="text"
              name="GenericName"
              autoComplete="off"
              list="genericOptions"
              required
              value={RepMaster.GenericName}
              onChange={handleChange}
            />
            <datalist id="genericOptions">
              {ProductNameData &&
                ProductNameData.length > 0 &&
                ProductNameData.map((pack, index) => (
                  <option key={`${index}_index`} value={pack.ItemName} />
                ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label>
              Supplier Name<span>:</span>
            </label>
            <input
              type="text"
              name="SupplierName"
              autoComplete="off"
              list="supplieroptions"
              required
              value={RepMaster.SupplierName}
              onChange={handleChange}
            />
            <datalist id="supplieroptions">
              {Supplierdata &&
                Supplierdata.length > 0 &&
                Supplierdata.map((supplier, index) => (
                  <option
                    key={`${index}_index`}
                    value={supplier.Supplier_Name}
                  />
                ))}
            </datalist>
          </div>
          <div className="RegisForm_1">
            <label>
              Rate<span>:</span>
            </label>
            <input
            type="number"
            name="Rate"
            onKeyDown={(e)=>
            ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            value={RepMaster.Rate}
            autoComplete='off'
            onChange={handleChange}
             />

          </div>

          <div className="Search_patient_icons">
            <AddBoxIcon onClick={handlePlusItemname} />
          </div>
        </div>

        {SelectedDataList && SelectedDataList.length > 0 && (
          <div>
            <div className="common_center_tag">
              <span>BrandName And CompanyName</span>
            </div>
            <br />
            <div className="Main_container_app">
              <ReactGrid columns={ItemnameColumns} RowData={SelectedDataList} />
            </div>

            <br></br>
          </div>
        )}

        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>
              {' '}
              Rep Master Excel FileUpload<span>:</span>{' '}
            </label>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              id="Servicechoose"
              required
              style={{ display: 'none' }}
              onChange={handleFileChangeRepMaster}
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
              onClick={handleCsvuploadRepMaster}
              title="File Upload"
            >
              <DriveFolderUploadIcon />
            </button>
          </div>
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleSubmit}>
            {RepMaster.RepId ? 'Update' : 'Save'}
          </button>
        </div>
        <br />
        {MedicalRepArray && MedicalRepArray.length > 0 && (
          <ReactGrid columns={MedicalRepColumns} RowData={MedicalRepArray} />
        )}

        {selectedrow && (
          <div className="loader" onClick={() => setselectedrow(false)}>
            <div
              className="loader_register_roomshow"
              onClick={(e) => e.stopPropagation()}
            >
              {ViewArray && ViewArray.length > 0 && (
                <div>
                  <div className="common_center_tag">
                    <span> BrandName and CompanyName</span>
                  </div>
                  <br />
                  <br />
                  <div className="Main_container_app">
                    <ReactGrid columns={viewColumns} RowData={ViewArray} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ModelContainer />
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default Repmaster;
