// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import {
//   BlockInvalidcharecternumber,
//   formatunderscoreLabel
// } from '../../OtherComponent/OtherFunctions'
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert'

// const Productmaster = () => {
//   const UrlLink = useSelector(state => state.userRecord?.UrlLink)
//   const toast = useSelector(state => state.userRecord?.toast)
//   const userRecord = useSelector(state => state.userRecord?.UserData)
//   const MedicalProductMaster = useSelector(
//     state => state.Inventorydata?.MedicalProductMaster
//   )



//   const navigate = useNavigate()
//   const dispatchvalue = useDispatch();
//   const [Doctorlist, setDoctorlist] = useState([]);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await axios.get(`${UrlLink}Masters/get_All_doctor_Names_Inventory`);
//         if (Array.isArray(response.data)) {
//           setDoctorlist(response.data);
//         } else {
//           setDoctorlist([]);

//         }
//       } catch (err) {
//         console.error("Error fetching doctor names:", err);
//       }
//     };

//     if (UrlLink) fetchDoctors(); // only run if UrlLink is valid
//   }, [UrlLink]);

//     const [genericInput, setGenericInput] = useState('');
//     const [manufacturerInput, setManufacturerInput] = useState('');


//   const [ProductMasterFields, setProductMasterFields] = useState({
//     Item_Code: null,
//     Item_Name: '',
//     Product_Category: '',
//     Sub_Category: '',
//     Generic_Name: genericInput || '',
//     Manufacturer_Name: '',
//     HSN_Code: '',
//     Product_Type: '',
//     Product_Group: '',
//     Strength: '',
//     Strength_Type: '',
//     Volume: '',
//     Volume_Type: '',
//     Pack_Type: '',
//     Pack_Quantity: 1,
//     Minimum_Quantity: '',
//     Maximum_Quantity: '',
//     Re_order_Level: '',
//     Is_Reusable: 'No',
//     Re_Usable_Times: '',
//     Is_Sellable: 'No',
//     Least_Sellable_Unit: 1,
//     Is_Partial_Use: 'No',
//     Is_Perishable: 'No',
//     Perishable_Duration: '',
//     Perishable_Duration_Type: '',
//     Is_Manufacture_Date_Available: 'No',
//     Is_Expiry_Date_Available: 'Yes',
//     Is_Serial_No_Available_for_each_quantity: 'No',
//     Drug_Segment: '',
//     Product_Description: '',
//     Department: '',
//     Doctorname: ''

//   })
//   console.table(ProductMasterFields)

//   const [ProductMasterFieldsShow, setProductMasterFieldsShow] = useState([]);

//   console.log('ProductMasterFieldsShow', ProductMasterFieldsShow);
//   const [ProductMasterFieldsShowFilter, setProductMasterFieldsShowFilter] =
//     useState([]);
//   console.log('ProductMasterFieldsShowFilter', ProductMasterFieldsShowFilter);
//   const [ProductCategoryData, setProductCategoryData] = useState([]);
//   console.log('ProductCategoryData', ProductCategoryData)

//   const [UnitOfMeasurement, setUnitOfMeasurement] = useState([]);
//   const [SubCategory, setSubCategory] = useState([]);
//   const [GenericNameData, setGenericNameData] = useState([]);
//   const [ManufactureData, setManufactureData] = useState([]);

//   const [ProductType, setProductType] = useState([]);

//   const [ProductGroup, setProductGroup] = useState([]);

//   const [ProductPackType, setProductPackType] = useState([])
//   const [ProductDrugSegment, setProductDrugSegment] = useState([])

//   useEffect(() => {
//     const fetchdata = async () => {
//       try {
//         const [data1, data2, data3] =
//           await Promise.all([
//             axios.get(
//               `${UrlLink}Inventory/get_Product_fields_for_productcategory?type=product`
//             ),
//             axios.get(`${UrlLink}Inventory/get_unit_of_measurements`),
//             axios.get(
//               `${UrlLink}Inventory/Product_Category_Product_Details_link`
//             ),
//             axios.get(`${UrlLink}Masters/ProductType_Master_lik`),

//           ])
//         setProductMasterFieldsShowFilter(data1.data)



//         setUnitOfMeasurement(data2.data)
//         const filtered = data3.data.filter(f => f.Status === 'Active')
//         setProductCategoryData(filtered)
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         setProductMasterFieldsShowFilter([])
//         setUnitOfMeasurement([])
//         setProductCategoryData([])

//       }
//     }
//     if (Object.keys(MedicalProductMaster).length === 0) {
//       fetchdata()
//     }
//   }, [UrlLink, MedicalProductMaster])


// useEffect(() => {
//   const fetchdatachange = async () => {
//     if (ProductMasterFields.Product_Category) {
//       try {
//         const [data9, data11, data12, data13, data14] = await Promise.all([
//           axios.get(
//             `${UrlLink}Masters/GenericName_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
//           ),
//           axios.get(
//             `${UrlLink}Masters/CompanyName_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
//           ),
//           axios.get(
//             `${UrlLink}Masters/Product_Group_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
//           ),
//           axios.get(
//             `${UrlLink}Masters/PackType_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
//           ),
//           axios.get(
//             `${UrlLink}Masters/ProductType_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
//           ),
//         ]);
        
//         setGenericNameData(data9.data)
//         setManufactureData(data11.data)
//         setProductGroup(data12.data)
//         setProductPackType(data13.data)
//         setProductType(data14.data)

//         // When editing, set the input values based on existing IDs
//         if (Object.keys(MedicalProductMaster).length !== 0) {
//           const genericItem = data9.data.find(g => g.id === ProductMasterFields.Generic_Name);
//           const manufacturerItem = data11.data.find(m => m.id === ProductMasterFields.Manufacturer_Name);
          
//           if (genericItem) setGenericInput(genericItem.GenericName);
//           if (manufacturerItem) setManufacturerInput(manufacturerItem.CompanyName);
//         }
//       }
//       catch (error) {
//         console.error('Error fetching data:', error);
//         setProductType([])
//         setProductGroup([])
//         setProductPackType([])
//         setGenericNameData([])
//         setManufactureData([])
//       }
//     }
//   };
//   fetchdatachange()
// }, [UrlLink, ProductMasterFields.Product_Category, ProductMasterFields.Sub_Category])
//   const fetchdatacategory = async value => {
//     try {
//       const [data1, data2, data3] = await Promise.all([
//         axios.get(
//           `${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${value}`
//         ),
//         axios.get(
//           `${UrlLink}Inventory/get_Product_fields_for_productcategory?type=product&Category=${value}`
//         ),
//         axios.get(`${UrlLink}Inventory/get_Drug_segments`)
//       ])

//       return { data1, data2, data3 }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//       return { data1: null, data2: null, data3: null } // Return null if error occurs to avoid breaking code
//     }
//   }

//   useEffect(() => {
//   if (Object.keys(MedicalProductMaster).length !== 0) {
//     const fetchdatacategory = async value => {
//       try {
//         const [data1, data2, data3, data4, data5] = await Promise.all([
//           axios.get(
//             `${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${value}`
//           ),
//           axios.get(
//             `${UrlLink}Inventory/get_Product_fields_for_productcategory?type=product&Category=${value}`
//           ),
//           axios.get(`${UrlLink}Inventory/get_Drug_segments`),
//           axios.get(`${UrlLink}Inventory/get_unit_of_measurements`),
//           axios.get(
//             `${UrlLink}Inventory/Product_Category_Product_Details_link`
//           ),
//         ])

//         setProductMasterFieldsShowFilter(data2?.data ?? [])
//         setSubCategory(data1?.data ?? [])
//         setUnitOfMeasurement(data4.data)
//         const filtered = data5.data.filter(f => f.Status === 'Active')
//         setProductCategoryData(filtered)

//         const updateddrugsegment =
//           Array.isArray(data3?.data) && data3?.data.length > 0
//             ? data3.data.map(field => {
//               if (MedicalProductMaster?.Drug_Segment_pk && +MedicalProductMaster.Drug_Segment_pk === +field.id) {
//                 return {
//                   ...field,
//                   checked: 'Yes'
//                 };
//               }
//               return field;
//             })
//             : [];
//         setProductDrugSegment(updateddrugsegment)

//         // Get the actual names for Generic and Manufacturer
//         let genericName = '';
//         let manufacturerName = '';

//         // Fetch the actual names for Generic and Manufacturer
//         if (MedicalProductMaster?.Generic_Name_pk) {
//           const genericRes = await axios.get(
//             `${UrlLink}Masters/GenericName_by_Product_SubProduct?ProductCategory=${MedicalProductMaster?.Product_Category_pk}`
//           );
//           const genericData = genericRes.data.find(g => g.id === MedicalProductMaster.Generic_Name_pk);
//           genericName = genericData?.GenericName || '';
//         }

//         if (MedicalProductMaster?.Manufacturer_pk) {
//           const manufacturerRes = await axios.get(
//             `${UrlLink}Masters/CompanyName_by_Product_SubProduct?ProductCategory=${MedicalProductMaster?.Product_Category_pk}`
//           );
//           const manufacturerData = manufacturerRes.data.find(m => m.id === MedicalProductMaster.Manufacturer_pk);
//           manufacturerName = manufacturerData?.CompanyName || '';
//         }

//         // Set the input values
//         setGenericInput(genericName);
//         setManufacturerInput(manufacturerName);

//         setProductMasterFields({
//           Item_Code: MedicalProductMaster?.Item_Code,
//           Item_Name: MedicalProductMaster?.Item_Name,
//           Product_Category: MedicalProductMaster?.Product_Category_pk,
//           Sub_Category: MedicalProductMaster?.Sub_Category_pk,
//           Generic_Name: MedicalProductMaster?.Generic_Name_pk,
//           Manufacturer_Name: MedicalProductMaster?.Manufacturer_pk,
//           HSN_Code: MedicalProductMaster?.HSN_Code,
//           Product_Type: MedicalProductMaster?.Product_Type_pk,
//           Product_Group: MedicalProductMaster?.Product_Group_pk,
//           Strength: MedicalProductMaster?.Strength,
//           Strength_Type: MedicalProductMaster?.Strength_Type,
//           Volume: MedicalProductMaster?.Volume,
//           Volume_Type: MedicalProductMaster?.Volume_Type_pk,
//           Pack_Type: MedicalProductMaster?.Pack_Type_pk,
//           Pack_Quantity: MedicalProductMaster?.Pack_Quantity,
//           Minimum_Quantity: MedicalProductMaster?.Minimum_Quantity,
//           Maximum_Quantity: MedicalProductMaster?.Maximum_Quantity,
//           Re_order_Level: MedicalProductMaster?.Re_order_Level,
//           Is_Reusable: MedicalProductMaster?.Is_Reusable,
//           Re_Usable_Times: MedicalProductMaster?.Re_Usable_Times,
//           Is_Sellable: MedicalProductMaster?.Is_Sellable,
//           Least_Sellable_Unit: MedicalProductMaster?.Least_Sellable_Unit,
//           Is_Partial_Use: MedicalProductMaster?.Is_Partial_Use,
//           Is_Perishable: MedicalProductMaster?.Is_Perishable,
//           Perishable_Duration: MedicalProductMaster?.Perishable_Duration,
//           Perishable_Duration_Type:
//             MedicalProductMaster?.Perishable_Duration_Type,
//           Is_Manufacture_Date_Available:
//             MedicalProductMaster?.Is_Manufacture_Date_Available,
//           Is_Expiry_Date_Available:
//             MedicalProductMaster?.Is_Expiry_Date_Available,
//           Is_Serial_No_Available_for_each_quantity:
//             MedicalProductMaster?.Is_Serial_No_Available_for_each_quantity,
//           Drug_Segment: MedicalProductMaster?.Drug_Segment_pk,
//           Product_Description: MedicalProductMaster?.Product_Description,
//           Department: MedicalProductMaster?.Department,
//           Doctorname: MedicalProductMaster?.Doctorname
//         })
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         setProductMasterFieldsShowFilter([])
//         setSubCategory([])
//         setProductDrugSegment([])
//         setUnitOfMeasurement([])
//         setProductCategoryData([])
//       }
//     }
//     fetchdatacategory(MedicalProductMaster?.Product_Category_pk)
//   }
// }, [MedicalProductMaster])
//   useEffect(() => {
//     if (ProductMasterFieldsShowFilter.length !== 0) {
//       let fdcsata = Object.keys(ProductMasterFields)

//       let fdata = ProductMasterFieldsShowFilter.filter(f => {
//         return fdcsata.includes(f)
//       })

//       fdata = fdata.filter(
//         f =>
//           ![
//             'Item_Code',
//             'Perishable_Duration_Type',
//             'Volume_Type',
//             'Strength_Type',
//             'Drug_Segment'
//           ].includes(f)
//       )


//       setProductMasterFieldsShow(fdata)
//       console.log(fdata, 'fdatattttttttt')
//     }
//   }, [ProductMasterFields, ProductMasterFieldsShowFilter])

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'Department') {
//       setProductMasterFields(prevFields => ({
//         ...prevFields,
//         [name]: value.toUpperCase()  // Corrected here
//       }));
//     } else if (name === 'Doctorname') {
//       setProductMasterFields(prevFields => ({
//         ...prevFields,
//         [name]: value
//       }));
//     }
//   };

//   const handleInputChange = async e => {
//     const { name, value } = e.target



//     if (name === 'Product_Category') {
//       // Fetch data for selected product category
//       const { data1, data2, data3 } = await fetchdatacategory(value)

//       if (data1 && data2 && data3) {
//         setProductMasterFieldsShowFilter(data2.data)

//         console.log('VVVkk-3333', data2.data);

//         setProductMasterFields(prev => ({
//           Item_Code: prev.Item_Code,
//           Item_Name: prev.Item_Name,
//           [name]: value,
//           Sub_Category: '',
//           Generic_Name: '',
//           Manufacturer_Name: '',
//           HSN_Code: '',
//           Product_Type: '',
//           Product_Group: '',
//           Strength: '',
//           Strength_Type: '',
//           Volume: '',
//           Volume_Type: '',
//           Pack_Type: '',
//           Pack_Quantity: 1,
//           Minimum_Quantity: '',
//           Maximum_Quantity: '',
//           Re_order_Level: '',
//           Is_Reusable: 'No',
//           Re_Usable_Times: '',
//           Is_Sellable: 'Yes',
//           Least_Sellable_Unit: 1,
//           Is_Partial_Use: 'No',
//           Is_Perishable: 'No',
//           Perishable_Duration: '',
//           Perishable_Duration_Type: '',
//           Is_Manufacture_Date_Available: 'No',
//           Is_Expiry_Date_Available: 'Yes',
//           Is_Serial_No_Available_for_each_quantity: 'No',
//           Drug_Segment: '',
//           Product_Description: '',
//           Department: '',
//           Doctorname: ''
//         }))
//         setSubCategory(data1.data)
//         setProductDrugSegment(data3.data)
//       }
//       else {
//         setProductMasterFieldsShowFilter([])
//         setSubCategory([])
//         setProductDrugSegment([])
//       }
//     } else {
//       setProductMasterFields(prev => ({
//         ...prev,
//         [name]: value
//       }))
//     }
//   }

//   const HandelSaveMasterData = () => {
//     let requiredFields = ProductMasterFieldsShow.filter(
//   f =>
//     ![
//       'Item_Code',
//       'Drug_Segment',
//       'Product_Description',
//       'Is_Reusable',
//       'Is_Sellable',
//       'Pack_Type',
//       'Is_Partial_Use',
//       'Is_Perishable',
//       'Strength_Type',
//       'Generic_Name',
//       'Manufacturer_Name',
//       'HSN_Code',
//       'Product_Group',
//       'Maximum_Quantity',
//       'Re_order_Level',
//       'Volume_Type',
//       'Is_Manufacture_Date_Available',
//       'Is_Expiry_Date_Available',
//       'Is_Serial_No_Available_for_each_quantity',
//       'Sub_Category',
//       'Department',
//       'Doctorname',
//       'Product_Type'
//     ].includes(f)
// )

// // Conditional removals
// if (!ProductMasterFields.Strength_Type) {
//   requiredFields = requiredFields.filter(f => f !== 'Strength')
// }
// if (!ProductMasterFields.Volume_Type) {
//   requiredFields = requiredFields.filter(f => f !== 'Volume')
// }
// if (ProductMasterFields.Is_Reusable === 'No') {
//   requiredFields = requiredFields.filter(f => f !== 'Re_Usable_Times')
// }
// if (ProductMasterFields.Is_Sellable === 'No') {
//   requiredFields = requiredFields.filter(f => f !== 'Least_Sellable_Unit')
// }

//     const existfield = requiredFields
//       .filter(f => !ProductMasterFields[f])
//       .map(f => formatunderscoreLabel(f))
//     if (existfield.length === 0) {
//       let dataassss = {
//         ...ProductMasterFields,
//         Created_by: userRecord?.username
//       }
//       const senddata = Object.entries(dataassss).reduce((acc, [key, value]) => {
//         const fieldsToConvert = [
//           'Product_Category',
//           'Sub_Category',
//           'Generic_Name',
//           'Manufacturer_Name',
//           'Product_Group',
//           'Pack_Type',
//           'Pack_Quantity',
//           'Product_Type',
//           'Strength',
//           'Volume',
//           'Volume_Type',
//           'Minimum_Quantity',
//           'Maximum_Quantity',
//           'Re_order_Level',
//           'Re_Usable_Times',
//           'Least_Sellable_Unit',
//           'Perishable_Duration'
//         ]

//         if (fieldsToConvert.includes(key)) {
//           acc[key] = value ? parseInt(value) : null // Convert to integer, or return null if value is empty/invalid
//         } else if (key === 'Drug_Segment') {
//           acc[key] = '' + value
//         } else {
//           acc[key] = value // Keep other values unchanged
//         }

//         return acc
//       }, {})
//       console.log(senddata)

//       axios
//         .post(`${UrlLink}Inventory/product_master_Detials_link`, senddata)
//         .then(res => {
//           // console.log(res.data);

//           let data = res.data

//           let type = Object.keys(data)[0]
//           let mess = Object.values(data)[0]
//           const tdata = {
//             message: mess,
//             type: type
//           }
//           dispatchvalue({ type: 'toast', value: tdata })
//           // navigate('/Home/ProductMasterList')
//           navigate("/Home/InventoryMaster");
//           dispatchvalue({ type: "HrFolder", value: "ProductMasterList" });
//           dispatchvalue({ type: "setPreviousFolder", value: null });
//           dispatchvalue({ type: "showMenu", value: true });
//           dispatchvalue({ type: 'MedicalProductMaster', value: {} })
//         })
//         .catch(err => {
//           console.log(err)
//         })
//     } else {
//       const tdata = {
//         message: `Please Fill the required Fields : ${existfield.join(', ')}`,
//         type: 'warn'
//       }
//       dispatchvalue({ type: 'toast', value: tdata })
//     }
//   };

//   const allowedCategoryIds = userRecord.ProductCategory_list.map(item => item.ProductCategoryAccessId);
//   const filteredProductCategoryData = ProductCategoryData.filter(
//     item => allowedCategoryIds.includes(item.id)
//   );


//   return (
//     <>
//       <div className='Main_container_app'>
//         <h3> Product Master</h3>
//         <br />
//           <div className='RegisFormcon_1'>
//             {ProductMasterFieldsShow.filter(f => {
//   if (f === 'Perishable_Duration' && ProductMasterFields?.Is_Perishable === 'No') return false
//   if (f === 'Least_Sellable_Unit' && ProductMasterFields?.Is_Sellable === 'No') return false
//   if (f === 'Re_Usable_Times' && ProductMasterFields?.Is_Reusable === 'No') return false
//   return true
// }).map((field, indx) => (
//   <div className='RegisForm_1' key={indx + 'key'}>
//     <label htmlFor={field}>
//       {formatunderscoreLabel(field)}
//       <span>:</span>
//     </label>

  
//   {field === 'Generic_Name' ? (
//   <>
//     <input
//       id="Generic_Name"
//       name="Generic_Name"
//       value={genericInput}
//       onChange={e => {
//         setGenericInput(e.target.value);
//         const selected = GenericNameData.find(
//           ele => ele.GenericName.toLowerCase() === e.target.value.toLowerCase()
//         );
//         setProductMasterFields(prev => ({
//           ...prev,
//           Generic_Name: selected ? selected.id : ''
//         }));
//       }}
//       list="GenericNameList"
//       autoComplete="off"
//     />
//     <datalist id="GenericNameList">
//       {GenericNameData.filter(ele => ele.Status).map((ele, ind) => (
//         <option key={ind} value={ele.GenericName} />
//       ))}
//     </datalist>
//   </>
// ) : field === 'Manufacturer_Name' ? (
//   <>
//     <input
//       id="Manufacturer_Name"
//       name="Manufacturer_Name"
//       value={manufacturerInput}
//       onChange={e => {
//         setManufacturerInput(e.target.value);
//         const selected = ManufactureData.find(
//           ele => ele.CompanyName.toLowerCase() === e.target.value.toLowerCase()
//         );
//         setProductMasterFields(prev => ({
//           ...prev,
//           Manufacturer_Name: selected ? selected.id : ''
//         }));
//       }}
//       type="text"
//       list="ManufacturerNameList"
//       autoComplete="off"
//     />
//     <datalist id="ManufacturerNameList">
//       {ManufactureData.filter(ele => ele.Status).map((ele, ind) => (
//         <option key={ind} value={ele.CompanyName} />
//       ))}
//     </datalist>
//   </>

// ): [
//       'Product_Category',
//       'Sub_Category',
     
//       'Product_Type',
//       'Product_Group',
//       'Pack_Type',
//       'Least_Sellable_Unit'
//     ].includes(field) ? (
//                   <select
//                     id={field}
//                     name={field}
//                     value={ProductMasterFields[field]}
//                     autoComplete='off'
//                     onChange={handleInputChange}
//                     disabled={
//                       Object.keys(ProductMasterFields).length !== 0 &&
//                       field !== 'Product_Category' &&
//                       !ProductMasterFields.Product_Category
//                     }
//                   >
//                     {field !== 'Least_Sellable_Unit' && (
//                       <option value=''>Select</option>
//                     )}
//                     {field === 'Product_Category' &&
//                       (filteredProductCategoryData && filteredProductCategoryData.length > 0
//                         ? filteredProductCategoryData.map((ele, ind) => (
//                           <option key={ind} value={ele.id}>
//                             {ele.ProductCategory}
//                           </option>
//                         ))
//                         : ProductCategoryData &&
//                         ProductCategoryData.map((ele, ind) => (
//                           <option key={ind} value={ele.id}>
//                             {ele.ProductCategory}
//                           </option>
//                         ))
//                       )
//                     }

//                     {field === 'Sub_Category' &&
//                       SubCategory.map((ele, ind) => (
//                         <option key={ind} value={ele.id}>
//                           {ele.SubCategoryName}
//                         </option>
//                       ))}

                   
                   
//                     {field === 'Product_Type' &&
//                       ProductType.filter(ele => ele.Status).map(
//                         (ele, ind) => (
//                           <option key={ind} value={ele.id}>
//                             {ele.ProductTypeName}
//                           </option>
//                         )
//                       )}
//                     {field === 'Product_Group' &&
//                       ProductGroup.filter(ele => ele.Status).map((ele, ind) => (
//                         <option key={ind} value={ele.id}>
//                           {ele.ProductGroupName}
//                         </option>
//                       ))}
//                     {field === 'Pack_Type' &&
//                       ProductPackType.filter(f => f.Status).map((ele, ind) => (
//                         <option key={ind} value={ele.id}>
//                           {ele.PackTypeName}
//                         </option>
//                       ))}
//                     {field === 'Least_Sellable_Unit' &&
//                       [
//                         1,
//                         +ProductMasterFields.Pack_Quantity !== 1
//                           ? ProductMasterFields.Pack_Quantity
//                           : null
//                       ]
//                         .filter(f => f)
//                         .map((ele, ind) => (
//                           <option key={ind} value={ele}>
//                             {ele}
//                           </option>
//                         ))}
//                   </select>
//                 ) : [
//                   'Is_Reusable',
//                   'Is_Sellable',
//                   'Is_Perishable',
//                   'Is_Partial_Use',
//                   'Is_Manufacture_Date_Available',
//                   'Is_Expiry_Date_Available',
//                   'Is_Serial_No_Available_for_each_quantity'
//                 ].includes(field) ? (
//                   <div
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'flex-start',
//                       gap: '10px',
//                       width: '150px'
//                     }}
//                   >
//                     <label style={{ width: 'auto' }} htmlFor={`${field}_yes`}>
//                       <input
//                         required
//                         id={`${field}_yes`}
//                         type='radio'
//                         name={field}
//                         style={{ width: '15px' }}
//                         autoComplete='off'
//                         disabled={
//                           Object.keys(ProductMasterFields).length !== 0 &&
//                           !ProductMasterFields.Product_Category
//                         }
//                         value='Yes'
//                         checked={ProductMasterFields[field] === 'Yes'}
//                         onChange={handleInputChange}
//                       />
//                       Yes
//                     </label>
//                     <label style={{ width: 'auto' }} htmlFor={`${field}_No`}>
//                       <input
//                         required
//                         id={`${field}_No`}
//                         type='radio'
//                         name={field}
//                         style={{ width: '15px' }}
//                         disabled={
//                           Object.keys(ProductMasterFields).length !== 0 &&
//                           !ProductMasterFields.Product_Category
//                         }
//                         value='No'
//                         checked={ProductMasterFields[field] === 'No'}
//                         onChange={handleInputChange}
//                       />
//                       No
//                     </label>
//                   </div>
//                 ) : field === 'Product_Description' ? (
//                   <textarea
//                     id={`${field}_${indx}`}
//                     autoComplete='off'
//                     name={field}
//                     required
//                     value={ProductMasterFields[field] ?? ''}
//                     disabled={
//                       Object.keys(ProductMasterFields).length !== 0 &&
//                       !ProductMasterFields.Product_Category
//                     }
//                     onChange={handleInputChange}
//                   />
//                 ) : ['Perishable_Duration', 'Volume', 'Strength'].includes(
//                   field
//                 ) ? (
//                   <>
//                     <select
//                       id={`${field}_Type`}
//                       name={`${field}_Type`}
//                       value={ProductMasterFields[`${field}_Type`]}
//                       disabled={
//                         Object.keys(ProductMasterFields).length !== 0 &&
//                         !ProductMasterFields.Product_Category
//                       }
//                       onChange={handleInputChange}
//                       style={{ width: '100px' }}
//                     >
//                       <option value=''>
//                         {['Volume', 'Strength'].includes(field)
//                           ? 'Not-Applicable'
//                           : 'Select'}
//                       </option>
//                       {field === 'Perishable_Duration' &&
//                         ['Hours', 'Days', 'Weeks', 'Months', 'Years'].map(
//                           (ele, ind) => (
//                             <option key={ind} value={ele}>
//                               {ele}
//                             </option>
//                           )
//                         )}
//                       {field === 'Strength' &&
//                         ['g', 'mg', 'moles'].map((ele, ind) => (
//                           <option key={ind} value={ele}>
//                             {ele}
//                           </option>
//                         ))}

//                       {field === 'Volume' &&
//                         UnitOfMeasurement.map((ele, ind) => (
//                           <option key={ind} value={ele.id}>
//                             {`${ele.Unit_Name}(${ele.Unit_Symbol}) - ${ele.Difference_Description}`}
//                           </option>
//                         ))}
//                     </select>
//                     <input
//                       type={'number'}
//                       onKeyDown={BlockInvalidcharecternumber}
//                       id={field}
//                       name={field}
//                       value={ProductMasterFields[field] ?? ''}
//                       disabled={
//                         ['Strength_Type', 'Volume_Type'].includes(
//                           `${field}_Type`
//                         ) && !ProductMasterFields[`${field}_Type`]
//                       }
//                       onChange={handleInputChange}
//                       style={{ width: '50px' }}
//                     />
//                   </>
//                 ) : (
//                   <input
//                     disabled={
//                       field !== 'Item_Name' &&
//                       Object.keys(ProductMasterFields).length !== 0 &&
//                       !ProductMasterFields.Product_Category
//                     }
//                     type={
//                       [
//                         'Pack_Quantity',
//                         'Minimum_Quantity',
//                         'Maximum_Quantity',
//                         'Re_order_Level',
//                         'Least_Sellable_Unit'
//                       ].includes(field)
//                         ? 'number'
//                         : 'text'
//                     }
//                     onKeyDown={
//                       [
//                         'Pack_Quantity',
//                         'Minimum_Quantity',
//                         'Maximum_Quantity',
//                         'Re_order_Level',
//                         'Least_Sellable_Unit'
//                       ].includes(field)
//                         ? BlockInvalidcharecternumber
//                         : null
//                     }
//                     id={field}
//                     name={field}
//                     value={ProductMasterFields[field] ?? ''}
//                     onChange={handleInputChange}
//                     autoComplete='off'
//                   />
//                 )}
//               </div>
//             ))}
//             {(ProductMasterFields.Product_Category == '1' || ProductMasterFields.Product_Category == '3') && (
//               <>
//                 <div className='RegisForm_1'>
//                   <label>
//                     Department<span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="Department"
//                     value={ProductMasterFields.Department}
//                     autoComplete="off"
//                     onChange={handleOnChange}
//                   />
//                 </div>

//                 <div className="RegisForm_1">
//                   <label>
//                     Refer DoctorName <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     list="doctorlist"
//                     id="doctorname"
//                     name="Doctorname"
//                     value={ProductMasterFields.Doctorname}
//                     onChange={handleOnChange}
//                     autoComplete="off"
//                   />
//                   <datalist id="doctorlist">
//                     {Doctorlist.map((pack, index) => (
//                       <option key={index} value={pack.name} />
//                     ))}
//                   </datalist>
//                 </div>
//               </>
//             )}


//           </div>
//         <br />
//         {Array.isArray(ProductMasterFieldsShowFilter) &&
//           ProductMasterFieldsShowFilter.length !== 0 &&
//           ProductMasterFieldsShowFilter.includes('Drug_Segment') && (
//             <>
//               <div className='common_center_tag'>
//                 <span>Drug Segment </span>
//               </div>
//               <br />
//               <div
//                 className='displayuseraccess'
//                 style={{
//                   width: '80%',
//                   boxShadow: ' 0px 0px 5px #ff6347',
//                   padding: '10px'
//                 }}
//               >
//                 {ProductDrugSegment.map((p, indx) => (
//                   <div className="displayuseraccess_child" key={indx}>
//                     <label
//                       htmlFor={`${indx}_${p?.Segment}`}
//                       className="par_acc_lab"
//                       title={p?.Description}
//                     >
//                       <input
//                         type="checkbox"
//                         id={`${indx}_${p?.Segment}`}
//                         checked={p?.checked}
//                         style={{ marginRight: "10px" }}
//                         onChange={e => {
//                           const { checked } = e.target;
//                           setProductDrugSegment(prev =>
//                             prev.map(field => ({
//                               ...field,
//                               checked: field.id === p.id ? checked : false // Allow only one selection
//                             }))
//                           );

//                           if (checked) {
//                             setProductMasterFields(prev => ({
//                               ...prev,
//                               Drug_Segment: p.id.toString() // Store only one selected ID
//                             }));
//                           } else {
//                             setProductMasterFields(prev => ({
//                               ...prev,
//                               Drug_Segment: "" // Clear the selection if unchecked
//                             }));
//                           }
//                         }}
//                       />
//                       {p?.Segment}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}



//         <br />
//         <div className='Main_container_Btn'>
//           <button onClick={HandelSaveMasterData}>
//             {Object.keys(ProductMasterFields).length !== 0 &&
//               ProductMasterFields?.Item_Code
//               ? 'Update'
//               : 'Save'}
//           </button>
//         </div>
//       </div>
//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </>
//   )
// }

// export default Productmaster;





import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BlockInvalidcharecternumber,
  formatunderscoreLabel,
} from "../../OtherComponent/OtherFunctions";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

const ProductmasterOptical = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const MedicalProductMaster = useSelector(
    (state) => state.Inventorydata?.MedicalProductMaster
  );

  const navigate = useNavigate();
  const dispatchvalue = useDispatch();
  const [Doctorlist, setDoctorlist] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Masters/get_All_doctor_Names_Inventory`
        );
        if (Array.isArray(response.data)) {
          setDoctorlist(response.data);
        } else {
          setDoctorlist([]);
        }
      } catch (err) {
        console.error("Error fetching doctor names:", err);
      }
    };

    if (UrlLink) fetchDoctors(); // only run if UrlLink is valid
  }, [UrlLink]);

  const [genericInput, setGenericInput] = useState("");
  const [manufacturerInput, setManufacturerInput] = useState("");

  const [ProductMasterFields, setProductMasterFields] = useState({
    Item_Code: null,
    Item_Name: "",
    Product_Category: "",
    Sub_Category: "",
    Generic_Name: genericInput || "",
    Manufacturer_Name: "",
    HSN_Code: "",
    Product_Type: "",
    Product_Group: "",
    Strength: "",
    Strength_Type: "",
    Volume: "",
    Volume_Type: "",
    Pack_Type: "",
    Pack_Quantity: 1,
    Minimum_Quantity: "",
    Maximum_Quantity: "",
    Re_order_Level: "",
    Is_Reusable: "No",
    Re_Usable_Times: "",
    Is_Sellable: "No",
    Least_Sellable_Unit: 1,
    Is_Partial_Use: "No",
    Is_Perishable: "No",
    Perishable_Duration: "",
    Perishable_Duration_Type: "",
    Is_Manufacture_Date_Available: "No",
    Is_Expiry_Date_Available: "Yes",
    Is_Serial_No_Available_for_each_quantity: "No",
    Drug_Segment: "",
    Product_Description: "",
    Department: "",
    Doctorname: "",
    // Add GST fields
    GST_Type: "", // 'Percentage' or 'Cash'
    GST_Value: "", // GST percentage or amount
  });
  console.table(ProductMasterFields);

  const [ProductMasterFieldsShow, setProductMasterFieldsShow] = useState([]);

  console.log("ProductMasterFieldsShow", ProductMasterFieldsShow);
  const [ProductMasterFieldsShowFilter, setProductMasterFieldsShowFilter] =
    useState([]);
  console.log("ProductMasterFieldsShowFilter", ProductMasterFieldsShowFilter);
  const [ProductCategoryData, setProductCategoryData] = useState([]);
  console.log("ProductCategoryData", ProductCategoryData);

  const [UnitOfMeasurement, setUnitOfMeasurement] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);
  const [GenericNameData, setGenericNameData] = useState([]);
  const [ManufactureData, setManufactureData] = useState([]);

  const [ProductType, setProductType] = useState([]);

  const [ProductGroup, setProductGroup] = useState([]);

  const [ProductPackType, setProductPackType] = useState([]);
  const [ProductDrugSegment, setProductDrugSegment] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const [data1, data2, data3] = await Promise.all([
          axios.get(
            `${UrlLink}Inventory/get_Product_fields_for_productcategory?type=product`
          ),
          axios.get(`${UrlLink}Inventory/get_unit_of_measurements`),
          axios.get(
            `${UrlLink}Inventory/Product_Category_Product_Details_link`
          ),
          axios.get(`${UrlLink}Masters/ProductType_Master_lik`),
        ]);
        setProductMasterFieldsShowFilter(data1.data);

        setUnitOfMeasurement(data2.data);
        const filtered = data3.data.filter((f) => f.Status === "Active");
        setProductCategoryData(filtered);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProductMasterFieldsShowFilter([]);
        setUnitOfMeasurement([]);
        setProductCategoryData([]);
      }
    };
    if (Object.keys(MedicalProductMaster).length === 0) {
      fetchdata();
    }
  }, [UrlLink, MedicalProductMaster]);

  useEffect(() => {
    const fetchdatachange = async () => {
      if (ProductMasterFields.Product_Category) {
        try {
          const [data9, data11, data12, data13, data14] = await Promise.all([
            axios.get(
              `${UrlLink}Masters/GenericName_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
            ),
            axios.get(
              `${UrlLink}Masters/CompanyName_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
            ),
            axios.get(
              `${UrlLink}Masters/Product_Group_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
            ),
            axios.get(
              `${UrlLink}Masters/PackType_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
            ),
            axios.get(
              `${UrlLink}Masters/ProductType_by_Product_SubProduct?ProductCategory=${ProductMasterFields.Product_Category}&SubProductCategory=${ProductMasterFields.Sub_Category}`
            ),
          ]);

          setGenericNameData(data9.data);
          setManufactureData(data11.data);
          setProductGroup(data12.data);
          setProductPackType(data13.data);
          setProductType(data14.data);

          // When editing, set the input values based on existing IDs
          if (Object.keys(MedicalProductMaster).length !== 0) {
            const genericItem = data9.data.find(
              (g) => g.id === ProductMasterFields.Generic_Name
            );
            const manufacturerItem = data11.data.find(
              (m) => m.id === ProductMasterFields.Manufacturer_Name
            );

            if (genericItem) setGenericInput(genericItem.GenericName);
            if (manufacturerItem)
              setManufacturerInput(manufacturerItem.CompanyName);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setProductType([]);
          setProductGroup([]);
          setProductPackType([]);
          setGenericNameData([]);
          setManufactureData([]);
        }
      }
    };
    fetchdatachange();
  }, [
    UrlLink,
    ProductMasterFields.Product_Category,
    ProductMasterFields.Sub_Category,
  ]);
  const fetchdatacategory = async (value) => {
    try {
      const [data1, data2, data3] = await Promise.all([
        axios.get(
          `${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${value}`
        ),
        axios.get(
          `${UrlLink}Inventory/get_Product_fields_for_productcategory?type=product&Category=${value}`
        ),
        axios.get(`${UrlLink}Inventory/get_Drug_segments`),
      ]);

      return { data1, data2, data3 };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data1: null, data2: null, data3: null }; // Return null if error occurs to avoid breaking code
    }
  };

  useEffect(() => {
    if (Object.keys(MedicalProductMaster).length !== 0) {
      const fetchdatacategory = async (value) => {
        try {
          const [data1, data2, data3, data4, data5] = await Promise.all([
            axios.get(
              `${UrlLink}Masters/SubCategory_Master_link?ProductCategory=${value}`
            ),
            axios.get(
              `${UrlLink}Inventory/get_Product_fields_for_productcategory?type=product&Category=${value}`
            ),
            axios.get(`${UrlLink}Inventory/get_Drug_segments`),
            axios.get(`${UrlLink}Inventory/get_unit_of_measurements`),
            axios.get(
              `${UrlLink}Inventory/Product_Category_Product_Details_link`
            ),
          ]);

          setProductMasterFieldsShowFilter(data2?.data ?? []);
          setSubCategory(data1?.data ?? []);
          setUnitOfMeasurement(data4.data);
          const filtered = data5.data.filter((f) => f.Status === "Active");
          setProductCategoryData(filtered);

          const updateddrugsegment =
            Array.isArray(data3?.data) && data3?.data.length > 0
              ? data3.data.map((field) => {
                  if (
                    MedicalProductMaster?.Drug_Segment_pk &&
                    +MedicalProductMaster.Drug_Segment_pk === +field.id
                  ) {
                    return {
                      ...field,
                      checked: "Yes",
                    };
                  }
                  return field;
                })
              : [];
          setProductDrugSegment(updateddrugsegment);

          // Get the actual names for Generic and Manufacturer
          let genericName = "";
          let manufacturerName = "";

          // Fetch the actual names for Generic and Manufacturer
          if (MedicalProductMaster?.Generic_Name_pk) {
            const genericRes = await axios.get(
              `${UrlLink}Masters/GenericName_by_Product_SubProduct?ProductCategory=${MedicalProductMaster?.Product_Category_pk}`
            );
            const genericData = genericRes.data.find(
              (g) => g.id === MedicalProductMaster.Generic_Name_pk
            );
            genericName = genericData?.GenericName || "";
          }

          if (MedicalProductMaster?.Manufacturer_pk) {
            const manufacturerRes = await axios.get(
              `${UrlLink}Masters/CompanyName_by_Product_SubProduct?ProductCategory=${MedicalProductMaster?.Product_Category_pk}`
            );
            const manufacturerData = manufacturerRes.data.find(
              (m) => m.id === MedicalProductMaster.Manufacturer_pk
            );
            manufacturerName = manufacturerData?.CompanyName || "";
          }

          // Set the input values
          setGenericInput(genericName);
          setManufacturerInput(manufacturerName);

          setProductMasterFields({
            Item_Code: MedicalProductMaster?.Item_Code,
            Item_Name: MedicalProductMaster?.Item_Name,
            Product_Category: MedicalProductMaster?.Product_Category_pk,
            Sub_Category: MedicalProductMaster?.Sub_Category_pk,
            Generic_Name: MedicalProductMaster?.Generic_Name_pk,
            Manufacturer_Name: MedicalProductMaster?.Manufacturer_pk,
            HSN_Code: MedicalProductMaster?.HSN_Code,
            Product_Type: MedicalProductMaster?.Product_Type_pk,
            Product_Group: MedicalProductMaster?.Product_Group_pk,
            Strength: MedicalProductMaster?.Strength,
            Strength_Type: MedicalProductMaster?.Strength_Type,
            Volume: MedicalProductMaster?.Volume,
            Volume_Type: MedicalProductMaster?.Volume_Type_pk,
            Pack_Type: MedicalProductMaster?.Pack_Type_pk,
            Pack_Quantity: MedicalProductMaster?.Pack_Quantity,
            Minimum_Quantity: MedicalProductMaster?.Minimum_Quantity,
            Maximum_Quantity: MedicalProductMaster?.Maximum_Quantity,
            Re_order_Level: MedicalProductMaster?.Re_order_Level,
            Is_Reusable: MedicalProductMaster?.Is_Reusable,
            Re_Usable_Times: MedicalProductMaster?.Re_Usable_Times,
            Is_Sellable: MedicalProductMaster?.Is_Sellable,
            Least_Sellable_Unit: MedicalProductMaster?.Least_Sellable_Unit,
            Is_Partial_Use: MedicalProductMaster?.Is_Partial_Use,
            Is_Perishable: MedicalProductMaster?.Is_Perishable,
            Perishable_Duration: MedicalProductMaster?.Perishable_Duration,
            Perishable_Duration_Type:
              MedicalProductMaster?.Perishable_Duration_Type,
            Is_Manufacture_Date_Available:
              MedicalProductMaster?.Is_Manufacture_Date_Available,
            Is_Expiry_Date_Available:
              MedicalProductMaster?.Is_Expiry_Date_Available,
            Is_Serial_No_Available_for_each_quantity:
              MedicalProductMaster?.Is_Serial_No_Available_for_each_quantity,
            Drug_Segment: MedicalProductMaster?.Drug_Segment_pk,
            Product_Description: MedicalProductMaster?.Product_Description,
            Department: MedicalProductMaster?.Department,
            Doctorname: MedicalProductMaster?.Doctorname,
            // Add GST fields for edit mode
            GST_Type: MedicalProductMaster?.GST_Type || "",
            GST_Value: MedicalProductMaster?.GST_Value || "",
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          setProductMasterFieldsShowFilter([]);
          setSubCategory([]);
          setProductDrugSegment([]);
          setUnitOfMeasurement([]);
          setProductCategoryData([]);
        }
      };
      fetchdatacategory(MedicalProductMaster?.Product_Category_pk);
    }
  }, [MedicalProductMaster]);
  useEffect(() => {
    if (ProductMasterFieldsShowFilter.length !== 0) {
      let fdcsata = Object.keys(ProductMasterFields);

      let fdata = ProductMasterFieldsShowFilter.filter((f) => {
        return fdcsata.includes(f);
      });

      fdata = fdata.filter(
        (f) =>
          ![
            "Item_Code",
            "Perishable_Duration_Type",
            "Volume_Type",
            "Strength_Type",
            "Drug_Segment",
            "GST_Type",
            "GST_Value",
          ].includes(f)
      );

      setProductMasterFieldsShow(fdata);
      console.log(fdata, "fdatattttttttt");
    }
  }, [ProductMasterFields, ProductMasterFieldsShowFilter]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "Department") {
      setProductMasterFields((prevFields) => ({
        ...prevFields,
        [name]: value.toUpperCase(), // Corrected here
      }));
    } else if (name === "Doctorname") {
      setProductMasterFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "Product_Category") {
      // Fetch data for selected product category
      const { data1, data2, data3 } = await fetchdatacategory(value);

      if (data1 && data2 && data3) {
        setProductMasterFieldsShowFilter(data2.data);

        console.log("VVVkk-3333", data2.data);

        setProductMasterFields((prev) => ({
          Item_Code: prev.Item_Code,
          Item_Name: prev.Item_Name,
          [name]: value,
          Sub_Category: "",
          Generic_Name: "",
          Manufacturer_Name: "",
          HSN_Code: "",
          Product_Type: "",
          Product_Group: "",
          Strength: "",
          Strength_Type: "",
          Volume: "",
          Volume_Type: "",
          Pack_Type: "",
          Pack_Quantity: 1,
          Minimum_Quantity: "",
          Maximum_Quantity: "",
          Re_order_Level: "",
          Is_Reusable: "No",
          Re_Usable_Times: "",
          Is_Sellable: "Yes",
          Least_Sellable_Unit: 1,
          Is_Partial_Use: "No",
          Is_Perishable: "No",
          Perishable_Duration: "",
          Perishable_Duration_Type: "",
          Is_Manufacture_Date_Available: "No",
          Is_Expiry_Date_Available: "Yes",
          Is_Serial_No_Available_for_each_quantity: "No",
          Drug_Segment: "",
          Product_Description: "",
          Department: "",
          Doctorname: "",
          GST_Type: "",
          GST_Value: "",
        }));
        setSubCategory(data1.data);
        setProductDrugSegment(data3.data);
      } else {
        setProductMasterFieldsShowFilter([]);
        setSubCategory([]);
        setProductDrugSegment([]);
      }
    } else {
      setProductMasterFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const HandelSaveMasterData = () => {
    let requiredFields = ProductMasterFieldsShow.filter(
      (f) =>
        ![
          "Item_Code",
          "Drug_Segment",
          "Product_Description",
          "Is_Reusable",
          "Is_Sellable",
          "Pack_Type",
          "Is_Partial_Use",
          "Is_Perishable",
          "Strength_Type",
          "Generic_Name",
          "Manufacturer_Name",
          "HSN_Code",
          "Product_Group",
          "Maximum_Quantity",
          "Re_order_Level",
          "Volume_Type",
          "Is_Manufacture_Date_Available",
          "Is_Expiry_Date_Available",
          "Is_Serial_No_Available_for_each_quantity",
          "Sub_Category",
          "Department",
          "Doctorname",
          "Product_Type",
          "GST_Type",
          "GST_Value",
        ].includes(f)
    );

    // Conditional removals
    if (!ProductMasterFields.Strength_Type) {
      requiredFields = requiredFields.filter((f) => f !== "Strength");
    }
    if (!ProductMasterFields.Volume_Type) {
      requiredFields = requiredFields.filter((f) => f !== "Volume");
    }
    if (ProductMasterFields.Is_Reusable === "No") {
      requiredFields = requiredFields.filter((f) => f !== "Re_Usable_Times");
    }
    if (ProductMasterFields.Is_Sellable === "No") {
      requiredFields = requiredFields.filter(
        (f) => f !== "Least_Sellable_Unit"
      );
    }

    const existfield = requiredFields
      .filter((f) => !ProductMasterFields[f])
      .map((f) => formatunderscoreLabel(f));
    if (existfield.length === 0) {
      let dataassss = {
        ...ProductMasterFields,
        Created_by: userRecord?.username,
      };
      const senddata = Object.entries(dataassss).reduce((acc, [key, value]) => {
        const fieldsToConvert = [
          "Product_Category",
          "Sub_Category",
          "Generic_Name",
          "Manufacturer_Name",
          "Product_Group",
          "Pack_Type",
          "Pack_Quantity",
          "Product_Type",
          "Strength",
          "Volume",
          "Volume_Type",
          "Minimum_Quantity",
          "Maximum_Quantity",
          "Re_order_Level",
          "Re_Usable_Times",
          "Least_Sellable_Unit",
          "Perishable_Duration",
          "GST_Value",
        ];

        if (fieldsToConvert.includes(key)) {
          acc[key] = value ? parseInt(value) : null; // Convert to integer, or return null if value is empty/invalid
        } else if (key === "Drug_Segment") {
          acc[key] = "" + value;
        } else {
          acc[key] = value; // Keep other values unchanged
        }

        return acc;
      }, {});
      console.log(senddata);

      axios
        .post(`${UrlLink}Inventory/product_master_Detials_link_Optical`, senddata)
        .then((res) => {
          // console.log(res.data);

          let data = res.data;

          let type = Object.keys(data)[0];
          let mess = Object.values(data)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
          // navigate('/Home/ProductMasterList')
          navigate("/Home/InventoryMaster");
          dispatchvalue({ type: "HrFolder", value: "ProductMasterListOptical" });
          dispatchvalue({ type: "setPreviousFolder", value: null });
          dispatchvalue({ type: "showMenu", value: true });
          dispatchvalue({ type: "MedicalProductMaster", value: {} });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const tdata = {
        message: `Please Fill the required Fields : ${existfield.join(", ")}`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const allowedCategoryIds = userRecord.ProductCategory_list.map(
    (item) => item.ProductCategoryAccessId
  );
  const filteredProductCategoryData = ProductCategoryData.filter((item) =>
    allowedCategoryIds.includes(item.id)
  );

  return (
    <>
      <div className="Main_container_app">
        <h3> Product Master</h3>
        <br />
        <div className="RegisFormcon_1">
          {ProductMasterFieldsShow.filter((f) => {
            if (
              f === "Perishable_Duration" &&
              ProductMasterFields?.Is_Perishable === "No"
            )
              return false;
            if (
              f === "Least_Sellable_Unit" &&
              ProductMasterFields?.Is_Sellable === "No"
            )
              return false;
            if (
              f === "Re_Usable_Times" &&
              ProductMasterFields?.Is_Reusable === "No"
            )
              return false;
            return true;
          }).map((field, indx) => (
            <div className="RegisForm_1" key={indx + "key"}>
              <label htmlFor={field}>
                {formatunderscoreLabel(field)}
                <span>:</span>
              </label>

              {field === "Generic_Name" ? (
                <>
                  <input
                    id="Generic_Name"
                    name="Generic_Name"
                    value={genericInput}
                    onChange={(e) => {
                      setGenericInput(e.target.value);
                      const selected = GenericNameData.find(
                        (ele) =>
                          ele.GenericName.toLowerCase() ===
                          e.target.value.toLowerCase()
                      );
                      setProductMasterFields((prev) => ({
                        ...prev,
                        Generic_Name: selected ? selected.id : "",
                      }));
                    }}
                    list="GenericNameList"
                    autoComplete="off"
                  />
                  <datalist id="GenericNameList">
                    {GenericNameData.filter((ele) => ele.Status).map(
                      (ele, ind) => (
                        <option key={ind} value={ele.GenericName} />
                      )
                    )}
                  </datalist>
                </>
              ) : field === "Manufacturer_Name" ? (
                <>
                  <input
                    id="Manufacturer_Name"
                    name="Manufacturer_Name"
                    value={manufacturerInput}
                    onChange={(e) => {
                      setManufacturerInput(e.target.value);
                      const selected = ManufactureData.find(
                        (ele) =>
                          ele.CompanyName.toLowerCase() ===
                          e.target.value.toLowerCase()
                      );
                      setProductMasterFields((prev) => ({
                        ...prev,
                        Manufacturer_Name: selected ? selected.id : "",
                      }));
                    }}
                    type="text"
                    list="ManufacturerNameList"
                    autoComplete="off"
                  />
                  <datalist id="ManufacturerNameList">
                    {ManufactureData.filter((ele) => ele.Status).map(
                      (ele, ind) => (
                        <option key={ind} value={ele.CompanyName} />
                      )
                    )}
                  </datalist>
                </>
              ) : [
                  "Product_Category",
                  "Sub_Category",

                  "Product_Type",
                  "Product_Group",
                  "Pack_Type",
                  "Least_Sellable_Unit",
                ].includes(field) ? (
                <select
                  id={field}
                  name={field}
                  value={ProductMasterFields[field]}
                  autoComplete="off"
                  onChange={handleInputChange}
                  disabled={
                    Object.keys(ProductMasterFields).length !== 0 &&
                    field !== "Product_Category" &&
                    !ProductMasterFields.Product_Category
                  }
                >
                  {field !== "Least_Sellable_Unit" && (
                    <option value="">Select</option>
                  )}
                  {field === "Product_Category" &&
                    (filteredProductCategoryData &&
                    filteredProductCategoryData.length > 0
                      ? filteredProductCategoryData.map((ele, ind) => (
                          <option key={ind} value={ele.id}>
                            {ele.ProductCategory}
                          </option>
                        ))
                      : ProductCategoryData &&
                        ProductCategoryData.map((ele, ind) => (
                          <option key={ind} value={ele.id}>
                            {ele.ProductCategory}
                          </option>
                        )))}

                  {field === "Sub_Category" &&
                    SubCategory.map((ele, ind) => (
                      <option key={ind} value={ele.id}>
                        {ele.SubCategoryName}
                      </option>
                    ))}

                  {field === "Product_Type" &&
                    ProductType.filter((ele) => ele.Status).map((ele, ind) => (
                      <option key={ind} value={ele.id}>
                        {ele.ProductTypeName}
                      </option>
                    ))}
                  {field === "Product_Group" &&
                    ProductGroup.filter((ele) => ele.Status).map((ele, ind) => (
                      <option key={ind} value={ele.id}>
                        {ele.ProductGroupName}
                      </option>
                    ))}
                  {field === "Pack_Type" &&
                    ProductPackType.filter((f) => f.Status).map((ele, ind) => (
                      <option key={ind} value={ele.id}>
                        {ele.PackTypeName}
                      </option>
                    ))}
                  {field === "Least_Sellable_Unit" &&
                    [
                      1,
                      +ProductMasterFields.Pack_Quantity !== 1
                        ? ProductMasterFields.Pack_Quantity
                        : null,
                    ]
                      .filter((f) => f)
                      .map((ele, ind) => (
                        <option key={ind} value={ele}>
                          {ele}
                        </option>
                      ))}
                </select>
              ) : [
                  "Is_Reusable",
                  "Is_Sellable",
                  "Is_Perishable",
                  "Is_Partial_Use",
                  "Is_Manufacture_Date_Available",
                  "Is_Expiry_Date_Available",
                  "Is_Serial_No_Available_for_each_quantity",
                ].includes(field) ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "10px",
                    width: "150px",
                  }}
                >
                  <label style={{ width: "auto" }} htmlFor={`${field}_yes`}>
                    <input
                      required
                      id={`${field}_yes`}
                      type="radio"
                      name={field}
                      style={{ width: "15px" }}
                      autoComplete="off"
                      disabled={
                        Object.keys(ProductMasterFields).length !== 0 &&
                        !ProductMasterFields.Product_Category
                      }
                      value="Yes"
                      checked={ProductMasterFields[field] === "Yes"}
                      onChange={handleInputChange}
                    />
                    Yes
                  </label>
                  <label style={{ width: "auto" }} htmlFor={`${field}_No`}>
                    <input
                      required
                      id={`${field}_No`}
                      type="radio"
                      name={field}
                      style={{ width: "15px" }}
                      disabled={
                        Object.keys(ProductMasterFields).length !== 0 &&
                        !ProductMasterFields.Product_Category
                      }
                      value="No"
                      checked={ProductMasterFields[field] === "No"}
                      onChange={handleInputChange}
                    />
                    No
                  </label>
                </div>
              ) : field === "Product_Description" ? (
                <textarea
                  id={`${field}_${indx}`}
                  autoComplete="off"
                  name={field}
                  required
                  value={ProductMasterFields[field] ?? ""}
                  disabled={
                    Object.keys(ProductMasterFields).length !== 0 &&
                    !ProductMasterFields.Product_Category
                  }
                  onChange={handleInputChange}
                />
              ) : ["Perishable_Duration", "Volume", "Strength"].includes(
                  field
                ) ? (
                <>
                  <select
                    id={`${field}_Type`}
                    name={`${field}_Type`}
                    value={ProductMasterFields[`${field}_Type`]}
                    disabled={
                      Object.keys(ProductMasterFields).length !== 0 &&
                      !ProductMasterFields.Product_Category
                    }
                    onChange={handleInputChange}
                    style={{ width: "100px" }}
                  >
                    <option value="">
                      {["Volume", "Strength"].includes(field)
                        ? "Not-Applicable"
                        : "Select"}
                    </option>
                    {field === "Perishable_Duration" &&
                      ["Hours", "Days", "Weeks", "Months", "Years"].map(
                        (ele, ind) => (
                          <option key={ind} value={ele}>
                            {ele}
                          </option>
                        )
                      )}
                    {field === "Strength" &&
                      ["g", "mg", "moles"].map((ele, ind) => (
                        <option key={ind} value={ele}>
                          {ele}
                        </option>
                      ))}

                    {field === "Volume" &&
                      UnitOfMeasurement.map((ele, ind) => (
                        <option key={ind} value={ele.id}>
                          {`${ele.Unit_Name}(${ele.Unit_Symbol}) - ${ele.Difference_Description}`}
                        </option>
                      ))}
                  </select>
                  <input
                    type={"number"}
                    onKeyDown={BlockInvalidcharecternumber}
                    id={field}
                    name={field}
                    value={ProductMasterFields[field] ?? ""}
                    disabled={
                      ["Strength_Type", "Volume_Type"].includes(
                        `${field}_Type`
                      ) && !ProductMasterFields[`${field}_Type`]
                    }
                    onChange={handleInputChange}
                    style={{ width: "50px" }}
                  />
                </>
              ) : (
                <input
                  disabled={
                    field !== "Item_Name" &&
                    Object.keys(ProductMasterFields).length !== 0 &&
                    !ProductMasterFields.Product_Category
                  }
                  type={
                    [
                      "Pack_Quantity",
                      "Minimum_Quantity",
                      "Maximum_Quantity",
                      "Re_order_Level",
                      "Least_Sellable_Unit",
                    ].includes(field)
                      ? "number"
                      : "text"
                  }
                  onKeyDown={
                    [
                      "Pack_Quantity",
                      "Minimum_Quantity",
                      "Maximum_Quantity",
                      "Re_order_Level",
                      "Least_Sellable_Unit",
                    ].includes(field)
                      ? BlockInvalidcharecternumber
                      : null
                  }
                  id={field}
                  name={field}
                  value={ProductMasterFields[field] ?? ""}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
              )}
            </div>
          ))}

          {/* GST Type Field */}
          <div className="RegisForm_1">
            <label htmlFor="GST_Type">
              GST Type<span>:</span>
            </label>
            <select
              id="GST_Type"
              name="GST_Type"
              value={ProductMasterFields.GST_Type}
              onChange={handleInputChange}
              autoComplete="off"
            >
              <option value="">Select</option>
              <option value="Percentage">Percentage</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* GST Value Field - conditionally shown based on GST Type selection */}
          {ProductMasterFields.GST_Type && (
            <div className="RegisForm_1">
              <label htmlFor="GST_Value">
                GST Value (
                {ProductMasterFields.GST_Type === "Percentage" ? "%" : "Amount"}
                )<span>:</span>
              </label>
              <input
                type="number"
                id="GST_Value"
                name="GST_Value"
                value={ProductMasterFields.GST_Value}
                onChange={handleInputChange}
                onKeyDown={BlockInvalidcharecternumber}
                autoComplete="off"
                placeholder={
                  ProductMasterFields.GST_Type === "Percentage"
                    ? "Enter percentage"
                    : "Enter amount"
                }
              />
            </div>
          )}

          {(ProductMasterFields.Product_Category == "1" ||
            ProductMasterFields.Product_Category == "3") && (
            <>
              <div className="RegisForm_1">
                <label>
                  Department<span>:</span>
                </label>
                <input
                  type="text"
                  name="Department"
                  value={ProductMasterFields.Department}
                  autoComplete="off"
                  onChange={handleOnChange}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Refer DoctorName <span>:</span>
                </label>
                <input
                  type="text"
                  list="doctorlist"
                  id="doctorname"
                  name="Doctorname"
                  value={ProductMasterFields.Doctorname}
                  onChange={handleOnChange}
                  autoComplete="off"
                />
                <datalist id="doctorlist">
                  {Doctorlist.map((pack, index) => (
                    <option key={index} value={pack.name} />
                  ))}
                </datalist>
              </div>
            </>
          )}
        </div>
        <br />
        {Array.isArray(ProductMasterFieldsShowFilter) &&
          ProductMasterFieldsShowFilter.length !== 0 &&
          ProductMasterFieldsShowFilter.includes("Drug_Segment") && (
            <>
              <div className="common_center_tag">
                <span>Drug Segment </span>
              </div>
              <br />
              <div
                className="displayuseraccess"
                style={{
                  width: "80%",
                  boxShadow: " 0px 0px 5px #ff6347",
                  padding: "10px",
                }}
              >
                {ProductDrugSegment.map((p, indx) => (
                  <div className="displayuseraccess_child" key={indx}>
                    <label
                      htmlFor={`${indx}_${p?.Segment}`}
                      className="par_acc_lab"
                      title={p?.Description}
                    >
                      <input
                        type="checkbox"
                        id={`${indx}_${p?.Segment}`}
                        checked={p?.checked}
                        style={{ marginRight: "10px" }}
                        onChange={(e) => {
                          const { checked } = e.target;
                          setProductDrugSegment((prev) =>
                            prev.map((field) => ({
                              ...field,
                              checked: field.id === p.id ? checked : false, // Allow only one selection
                            }))
                          );

                          if (checked) {
                            setProductMasterFields((prev) => ({
                              ...prev,
                              Drug_Segment: p.id.toString(), // Store only one selected ID
                            }));
                          } else {
                            setProductMasterFields((prev) => ({
                              ...prev,
                              Drug_Segment: "", // Clear the selection if unchecked
                            }));
                          }
                        }}
                      />
                      {p?.Segment}
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}

        <br />
        <div className="Main_container_Btn">
          <button onClick={HandelSaveMasterData}>
            {Object.keys(ProductMasterFields).length !== 0 &&
            ProductMasterFields?.Item_Code
              ? "Update"
              : "Save"}
          </button>
        </div>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default ProductmasterOptical;

