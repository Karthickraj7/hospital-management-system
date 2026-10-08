// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { BlockInvalidcharecternumberSupplier } from '../../OtherComponent/OtherFunctions';
// import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// import axios from 'axios';
// import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// const SupplierMaster = () => {
//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const SupplierMasterStore = useSelector(
//     (state) => state.Inventorydata?.SupplierMasterStore
//   );

//   const [SupplierMaster, setSupplierMaster] = useState({
//     SupplierId: '',
//     SupplierName: '',
//     SupplierType: '',
//     ContactPerson: '',
//     ContactNumber: '',
//     EmailAddress: '',
//     Address: '',
//     StateLocation: '',
//     RegistrationNumber: '',
//     GSTNumber: '',
//     PANNumber: '',
//     DruglicenseNoOne: '',
//     DruglicenseNoTwo: '',
//     PaymentTerms: '',
//     CreditLimit: '',
//     LeadTime: '',
//     Notes: '',
//     FileAttachment: null,
//     BankName: '',
//     AccountNumber: '',
//     IFSCCode: '',
//     BankBranch: '',
//   });
//   console.log('SupplierMaster----------------', SupplierMaster);

//   const indian_states_gst = [
//     { state: 'Andhra Pradesh' },
//     { state: 'Arunachal Pradesh' },
//     { state: 'Assam' },
//     { state: 'Bihar' },
//     { state: 'Chhattisgarh' },
//     { state: 'Goa' },
//     { state: 'Gujarat' },
//     { state: 'Haryana' },
//     { state: 'Himachal Pradesh' },
//     { state: 'Jharkhand' },
//     { state: 'Karnataka' },
//     { state: 'Kerala' },
//     { state: 'Madhya Pradesh' },
//     { state: 'Maharashtra' },
//     { state: 'Manipur' },
//     { state: 'Meghalaya' },
//     { state: 'Mizoram' },
//     { state: 'Nagaland' },
//     { state: 'Odisha' },
//     { state: 'Punjab' },
//     { state: 'Rajasthan' },
//     { state: 'Sikkim' },
//     { state: 'Tamil Nadu' },
//     { state: 'Telangana' },
//     { state: 'Tripura' },
//     { state: 'Uttar Pradesh' },
//     { state: 'Uttarakhand' },
//     { state: 'West Bengal' },
//   ];

//   const formatLabel = (label) => {
//     if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
//       return label
//         .replace(/([a-z])([A-Z])/g, '$1 $2')
//         .replace(/^./, (str) => str.toUpperCase());
//     } else {
//       return label;
//     }
//   };

//   const getInputType = (name) => {
//     if (
//       [
//         'ContactNumber',
//         'CreditLimit',
//         'AccountNumber',
//         'PaymentTerms',
//         'LeadTime',
//       ].includes(name)
//     )
//       return 'number';
//     return 'text';
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === 'ContactNumber') {
//       if (value.length > 50) {
//         const tdata = {
//           message: 'ContactNumber only  5 numbers allowed',
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       } else {
//         setSupplierMaster((prev) => ({
//           ...prev,
//           [name]: value,
//         }));
//       }
//     } else if (
//       [
//         'SupplierName',
//         'RegistrationNumber',
//         'GSTNumber',
//         'PANNumber',
//         'DruglicenseNoOne',
//         'DruglicenseNoTwo'
//       ].includes(name)
//     ) {
//       setSupplierMaster((prev) => ({
//         ...prev,
//         [name]: value.toUpperCase(),
//       }));
//     } else {
//       setSupplierMaster((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//       }));
//     }
//   };

//   const handlefileOnchange = (e) => {
//     const { files } = e.target;

//     if (files && files.length > 0) {
//       let formattedValue = files[0];

//       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
//       const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
//       if (
//         !allowedTypes.includes(formattedValue.type) ||
//         formattedValue.type === ''
//       ) {
//         const tdata = {
//           message: 'Invalid file type. Please upload a PDF, JPEG, or PNG file.',
//           type: 'warn',
//         };
//         dispatchvalue({ type: 'toast', value: tdata });
//       } else {
//         if (formattedValue.size > maxSize) {
//           const tdata = {
//             message: 'File size exceeds the limit of 5MB.',
//             type: 'warn',
//           };
//           dispatchvalue({ type: 'toast', value: tdata });
//         } else {
//           const reader = new FileReader();
//           reader.onload = () => {
//             setSupplierMaster((prev) => ({
//               ...prev,
//               FileAttachment: reader.result,
//             }));
//           };
//           reader.readAsDataURL(formattedValue);
//         }
//       }
//     } else {
//       const tdata = {
//         message: 'No file selected. Please choose a file to upload.',
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     }
//   };

//   const Selectedfileview = (fileval) => {
//     if (fileval) {
//       let tdata = {
//         Isopen: false,
//         content: null,
//         type: 'image/jpg',
//       };
//       if (
//         ['data:image/jpeg;base64', 'data:image/jpg;base64'].includes(
//           fileval?.split(',')[0]
//         )
//       ) {
//         tdata = {
//           Isopen: true,
//           content: fileval,
//           type: 'image/jpeg',
//         };
//       } else if (fileval?.split(',')[0] === 'data:image/png;base64') {
//         tdata = {
//           Isopen: true,
//           content: fileval,
//           type: 'image/png',
//         };
//       } else if (fileval?.split(',')[0] === 'data:application/pdf;base64') {
//         tdata = {
//           Isopen: true,
//           content: fileval,
//           type: 'application/pdf',
//         };
//       }

//       dispatchvalue({ type: 'modelcon', value: tdata });
//     } else {
//       const tdata = {
//         message: 'There is no file to view.',
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     }
//   };

//   useEffect(() => {
//     if (SupplierMasterStore && Object.keys(SupplierMasterStore).length !== 0) {
//       console.log('SupplierMasterStore', SupplierMasterStore);

//       const { id, ...rest } = SupplierMasterStore;

//       setSupplierMaster((prev) => ({
//         ...prev,
//         ...rest,
//       }));
//     }
//   }, [SupplierMasterStore]);

//   const saveSupplierdata = () => {
//     let requiredfields = Object.keys(SupplierMaster).filter(
//       (f) =>
//         ![
//           'SupplierId',
//           'Notes',
//           'FileAttachment',
//           'SupplierType',
//           'ContactPerson',
//           'CreditLimit',
//           'DruglicenseNoOne',
//           'DruglicenseNoTwo',
//           'StateLocation',
//           'EmailAddress',
//           'RegistrationNumber',
//           'GSTNumber',
//           'PANNumber',
//           'PaymentTerms',
//           'CreditLimit',
//           'LeadTime',
//           'Notes',
//           'BankName',
//           'AccountNumber',
//           'IFSCCode',
//           'BankBranch'


//         ].includes(f)
//     );
//     console.log('requiredfields', requiredfields);

//     let missingfield = requiredfields.filter((field) => !SupplierMaster[field]);
//     console.log('missingfield', missingfield);
//     if (missingfield.length !== 0) {
//       const tdata = {
//         message: `Please fill out all required fields: ${missingfield.join(', ')}`,
//         type: 'warn',
//       };
//       dispatchvalue({ type: 'toast', value: tdata });
//     } else {
//       const senddataaaa = {
//         ...SupplierMaster,
//         created_by: userRecord?.username,
//       };
//       console.log(senddataaaa);

//       axios
//         .post(`${UrlLink}Inventory/Supplier_Master_Link`, senddataaaa)
//         .then((res) => {
//           console.log(res.data);
//           let resdata = res.data;
//           let type = Object.keys(resdata)[0];
//           let mess = Object.values(resdata)[0];
//           const tdata = {
//             message: mess,
//             type: type,
//           };
//           dispatchvalue({ type: 'toast', value: tdata });
//           if (type === 'success') {
//             navigate('/Home/InventoryMaster');
//             dispatchvalue({ type: 'HrFolder', value: 'SupplierMasterList' });
//             dispatchvalue({ type: 'setPreviousFolder', value: null });
//             dispatchvalue({ type: 'showMenu', value: true });
//             // navigate('/Home/SupplierMasterList');
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   };

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Supplier Master</h3>

//         <div className="common_center_tag">
//           <span>Supplier Details</span>
//         </div>

//         <br />

//         <div className="RegisFormcon_1">
//           {Object.keys(SupplierMaster)
//             .filter(
//               (f) =>
//                 ![
//                   'SupplierId',
//                   'BankName',
//                   'AccountNumber',
//                   'IFSCCode',
//                   'BankBranch',
//                 ].includes(f)
//             )
//             .map((StateName, Index) => (
//               <div className="RegisForm_1" key={Index + 'key'}>
//                 <label htmlFor={StateName}>
//                   <div className="imp_v_star">
//                     {[
//                       'SupplierName',
//                       'ContactNumber',
//                       'EmailAddress',
//                       'Address',
//                       'RegistrationNumber',
//                       'GSTNumber',
//                       'PANNumber',
//                       'PaymentTerms',
//                       'LeadTime',
//                       'BankName',
//                       'AccountNumber',
//                       'IFSCCode',
//                       'BankBranch',
//                       'StateLocation',
//                     ].includes(StateName) ? (
//                       <>
//                         {formatLabel(StateName)}
//                         <span className="requirreg12">*</span>
//                       </>
//                     ) : (
//                       formatLabel(StateName)
//                     )}
//                   </div>
//                   {StateName === 'LeadTime'
//                     ? '(days)'
//                     : StateName === 'PaymentTerms'
//                       ? '(Due days)'
//                       : ''}
//                   <span>:</span>
//                 </label>

//                 {StateName === 'Address' || StateName === 'Notes' ? (
//                   <textarea
//                     id={StateName}
//                     name={StateName}
//                     value={SupplierMaster[StateName]}
//                     onChange={handleInputChange}
//                     autoComplete="off"
//                   />
//                 ) : StateName === 'SupplierType' ? (
//                   <select
//                     id={StateName}
//                     name={StateName}
//                     value={SupplierMaster[StateName]}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select</option>
//                     <option value="Manufacturer">Manufacturer</option>
//                     <option value="Distributor">Distributor</option>
//                     <option value="Wholesaler">Wholesaler</option>
//                     <option value="Retailer">Retailer</option>
//                     <option value="OEM">
//                       OEM (Original Equipment Manufacturer)
//                     </option>
//                     <option value="Vendor">Vendor</option>
//                   </select>
//                 ) : StateName === 'StateLocation' ? (
//                   <>
//                     <input
//                       list="stateList"
//                       id={StateName}
//                       name={StateName}
//                       value={SupplierMaster[StateName]}
//                       onChange={handleInputChange}
//                       autoComplete="off"
                      
//                     />
//                     <datalist id="stateList">
//                       {indian_states_gst.map((stateObj, idx) => (
//                         <option key={idx} value={stateObj.state} />
//                       ))}
//                     </datalist>
//                   </>
//                 ) : StateName === 'FileAttachment' ? (
//                   <>
//                     <input
//                       type="file"
//                       name={StateName}
//                       accept="image/jpeg,image/png,application/pdf"
//                       required
//                       id={`${StateName}_supplier`}
//                       autoComplete="off"
//                       onChange={handlefileOnchange}
//                       style={{ display: 'none' }}
//                     />
//                     <div
//                       style={{
//                         width: '87px',
//                         display: 'flex',
//                         justifyContent: 'flex-start',
//                         gap: '10px',
//                       }}
//                     >
//                       <label
//                         htmlFor={`${StateName}_supplier`}
//                         className="RegisterForm_1_btns choose_file_update"
//                       >
//                         <PhotoCameraBackIcon />
//                       </label>
//                       <button
//                         type="button"
//                         className="RegisterForm_1_btns choose_file_update"
//                         onClick={() =>
//                           Selectedfileview(SupplierMaster.FileAttachment)
//                         }
//                       >
//                         <VisibilityIcon />
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <input
//                     type="text" // Don't use 'number' if you want to allow commas
//                     onKeyDown={
//                       getInputType(StateName) === 'number'
//                         ? BlockInvalidcharecternumberSupplier
//                         : null
//                     }
//                     id={StateName}
//                     name={StateName}
//                     value={SupplierMaster[StateName]}
//                     onChange={handleInputChange}
//                     autoComplete="off"
//                   />
//                   // <input
//                   //   type={getInputType(StateName)}
//                   //   onKeyDown={
//                   //     getInputType(StateName) === 'number'
//                   //       ? BlockInvalidcharecternumberSupplier
//                   //       : null
//                   //   }
//                   //   id={StateName}
//                   //   name={StateName}
//                   //   value={SupplierMaster[StateName]}
//                   //   onChange={handleInputChange}
//                   // />
//                 )}
//               </div>
//             ))}
//         </div>

//         <br />
//         <div className="common_center_tag">
//           <span>Bank Details</span>
//         </div>
//         <br />
//         <div className="RegisFormcon_1">
//           {['BankName', 'AccountNumber', 'IFSCCode', 'BankBranch'].map(
//             (StateName2, Index) => (
//               <div className="RegisForm_1" key={Index + 'key'}>
//                 <label htmlFor={StateName2}>
//                   <div className="imp_v_star">
//                     {formatLabel(StateName2)}
//                     <span className="requirreg12">*</span>{' '}
//                     {/* Adds the required asterisk */}
//                   </div>
//                   <span>:</span>
//                 </label>
//                 <input
//                   type={getInputType(StateName2)}
//                   id={StateName2}
//                   name={StateName2}
//                   value={SupplierMaster[StateName2]}
//                   onChange={handleInputChange}
//                   autoComplete="off"
//                 />
//               </div>
//             )
//           )}
//         </div>

//         <br />

//         <div className="Main_container_Btn">
//           <button onClick={saveSupplierdata}>
//             {SupplierMaster.SupplierId ? 'Update' : 'Save'}
//           </button>
//         </div>
//       </div>
//       <ToastAlert Message={toast.message} Type={toast.type} />
//       <ModelContainer />
//     </>
//   );
// };

// export default SupplierMaster;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BlockInvalidcharecternumberSupplier } from '../../OtherComponent/OtherFunctions';
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SupplierMaster = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const toast = useSelector((state) => state.userRecord?.toast);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const SupplierMasterStore = useSelector(
    (state) => state.Inventorydata?.SupplierMasterStore
  );

  const [SupplierMaster, setSupplierMaster] = useState({
    SupplierId: '',
    SupplierName: '',
    SupplierType: '',
    ContactPerson: '',
    ContactNumber: '',
    EmailAddress: '',
    Address: '',
    StateLocation: '',
    RegistrationNumber: '',
    GSTNumber: '',
    PANNumber: '',
    DruglicenseNoOne: '',
    DruglicenseNoTwo: '',
    PaymentTerms: '',
    CreditLimit: '',
    LeadTime: '',
    Notes: '',
    FileAttachment: null,
    BankName: '',
    AccountNumber: '',
    IFSCCode: '',
    BankBranch: '',
  });
  console.log('SupplierMaster----------------', SupplierMaster);

  const indian_states_gst = [
    { state: 'Andhra Pradesh' },
    { state: 'Arunachal Pradesh' },
    { state: 'Assam' },
    { state: 'Bihar' },
    { state: 'Chhattisgarh' },
    { state: 'Goa' },
    { state: 'Gujarat' },
    { state: 'Haryana' },
    { state: 'Himachal Pradesh' },
    { state: 'Jharkhand' },
    { state: 'Karnataka' },
    { state: 'Kerala' },
    { state: 'Madhya Pradesh' },
    { state: 'Maharashtra' },
    { state: 'Manipur' },
    { state: 'Meghalaya' },
    { state: 'Mizoram' },
    { state: 'Nagaland' },
    { state: 'Odisha' },
    { state: 'Punjab' },
    { state: 'Rajasthan' },
    { state: 'Sikkim' },
    { state: 'Tamil Nadu' },
    { state: 'Telangana' },
    { state: 'Tripura' },
    { state: 'Uttar Pradesh' },
    { state: 'Uttarakhand' },
    { state: 'West Bengal' },
  ];

  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'ContactNumber') {
      if (value.length > 50) {
        const tdata = {
          message: 'ContactNumber only 5 numbers allowed',
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      } else {
        setSupplierMaster((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (
      [
        'SupplierName',
        'RegistrationNumber',
        'GSTNumber',
        'PANNumber',
        'DruglicenseNoOne',
        'DruglicenseNoTwo'
      ].includes(name)
    ) {
      setSupplierMaster((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    } else {
      setSupplierMaster((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handlefileOnchange = (e) => {
    const { files } = e.target;

    if (files && files.length > 0) {
      let formattedValue = files[0];

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ''
      ) {
        const tdata = {
          message: 'Invalid file type. Please upload a PDF, JPEG, or PNG file.',
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      } else {
        if (formattedValue.size > maxSize) {
          const tdata = {
            message: 'File size exceeds the limit of 5MB.',
            type: 'warn',
          };
          dispatchvalue({ type: 'toast', value: tdata });
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setSupplierMaster((prev) => ({
              ...prev,
              FileAttachment: reader.result,
            }));
          };
          reader.readAsDataURL(formattedValue);
        }
      }
    } else {
      const tdata = {
        message: 'No file selected. Please choose a file to upload.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  const Selectedfileview = (fileval) => {
    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: 'image/jpg',
      };
      if (
        ['data:image/jpeg;base64', 'data:image/jpg;base64'].includes(
          fileval?.split(',')[0]
        )
      ) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: 'image/jpeg',
        };
      } else if (fileval?.split(',')[0] === 'data:image/png;base64') {
        tdata = {
          Isopen: true,
          content: fileval,
          type: 'image/png',
        };
      } else if (fileval?.split(',')[0] === 'data:application/pdf;base64') {
        tdata = {
          Isopen: true,
          content: fileval,
          type: 'application/pdf',
        };
      }

      dispatchvalue({ type: 'modelcon', value: tdata });
    } else {
      const tdata = {
        message: 'There is no file to view.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    }
  };

  useEffect(() => {
    if (SupplierMasterStore && Object.keys(SupplierMasterStore).length !== 0) {
      console.log('SupplierMasterStore', SupplierMasterStore);

      const { id, ...rest } = SupplierMasterStore;

      setSupplierMaster((prev) => ({
        ...prev,
        ...rest,
      }));
    }
  }, [SupplierMasterStore]);

  const saveSupplierdata = () => {
    let requiredfields = Object.keys(SupplierMaster).filter(
      (f) =>
        ![
          'SupplierId',
          'Notes',
          'FileAttachment',
          'SupplierType',
          'ContactPerson',
          'CreditLimit',
          'DruglicenseNoOne',
          'DruglicenseNoTwo',
          'StateLocation',
          'EmailAddress',
          'RegistrationNumber',
          'GSTNumber',
          'PANNumber',
          'PaymentTerms',
          'CreditLimit',
          'LeadTime',
          'Notes',
          'BankName',
          'AccountNumber',
          'IFSCCode',
          'BankBranch'
        ].includes(f)
    );
    console.log('requiredfields', requiredfields);

    let missingfield = requiredfields.filter((field) => !SupplierMaster[field]);
    console.log('missingfield', missingfield);
    if (missingfield.length !== 0) {
      const tdata = {
        message: `Please fill out all required fields: ${missingfield.join(', ')}`,
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else {
      const senddataaaa = {
        ...SupplierMaster,
        created_by: userRecord?.username,
      };
      console.log(senddataaaa);

      axios
        .post(`${UrlLink}Inventory/Supplier_Master_Link`, senddataaaa)
        .then((res) => {
          console.log(res.data);
          let resdata = res.data;
          let type = Object.keys(resdata)[0];
          let mess = Object.values(resdata)[0];
          const tdata = {
            message: mess,
            type: type,
          };
          dispatchvalue({ type: 'toast', value: tdata });
          if (type === 'success') {
            navigate('/Home/InventoryMaster');
            dispatchvalue({ type: 'HrFolder', value: 'SupplierMasterList' });
            dispatchvalue({ type: 'setPreviousFolder', value: null });
            dispatchvalue({ type: 'showMenu', value: true });
            // navigate('/Home/SupplierMasterList');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Supplier Master</h3>

        <div className="common_center_tag">
          <span>Supplier Details</span>
        </div>

        <br />

        <div className="RegisFormcon_1">
          {/* SupplierName */}
          <div className="RegisForm_1">
            <label htmlFor="SupplierName">
              <div className="imp_v_star">
                Supplier Name
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="SupplierName"
              name="SupplierName"
              value={SupplierMaster.SupplierName}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* SupplierType */}
          <div className="RegisForm_1">
            <label htmlFor="SupplierType">
              <div className="imp_v_star">
                Supplier Type
              </div>
              <span>:</span>
            </label>
            <select
              id="SupplierType"
              name="SupplierType"
              value={SupplierMaster.SupplierType}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Distributor">Distributor</option>
              <option value="Wholesaler">Wholesaler</option>
              <option value="Retailer">Retailer</option>
              <option value="OEM">OEM (Original Equipment Manufacturer)</option>
              <option value="Vendor">Vendor</option>
            </select>
          </div>

          {/* ContactPerson */}
          <div className="RegisForm_1">
            <label htmlFor="ContactPerson">
              <div className="imp_v_star">
                Contact Person
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="ContactPerson"
              name="ContactPerson"
              value={SupplierMaster.ContactPerson}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* ContactNumber */}
          <div className="RegisForm_1">
            <label htmlFor="ContactNumber">
              <div className="imp_v_star">
                Contact Number
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <textarea
              type="text"
              onKeyDown={BlockInvalidcharecternumberSupplier}
              id="ContactNumber"
              name="ContactNumber"
              value={SupplierMaster.ContactNumber}
              style={{height:'50px',fontSize:'12px'}}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* EmailAddress */}
          <div className="RegisForm_1">
            <label htmlFor="EmailAddress">
              <div className="imp_v_star">
                Email Address
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <textarea
              type="text"
              id="EmailAddress"
              name="EmailAddress"
              value={SupplierMaster.EmailAddress}
              style={{height:'50px',fontSize:'12px'}}

              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* Address */}
          <div className="RegisForm_1">
            <label htmlFor="Address">
              <div className="imp_v_star">
                Address
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <textarea
              id="Address"
              name="Address"
              value={SupplierMaster.Address}
              onChange={handleInputChange}
              style={{height:'50px',fontSize:'12px'}}

              autoComplete="off"
            />
          </div>

          {/* StateLocation */}
          <div className="RegisForm_1">
            <label htmlFor="StateLocation">
              <div className="imp_v_star">
                State Location
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <input
              list="stateList"
              id="StateLocation"
              name="StateLocation"
              value={SupplierMaster.StateLocation}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <datalist id="stateList">
              {indian_states_gst.map((stateObj, idx) => (
                <option key={idx} value={stateObj.state} />
              ))}
            </datalist>
          </div>

          {/* RegistrationNumber */}
          <div className="RegisForm_1">
            <label htmlFor="RegistrationNumber">
              <div className="imp_v_star">
                Registration Number
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="RegistrationNumber"
              name="RegistrationNumber"
              value={SupplierMaster.RegistrationNumber}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* GSTNumber */}
          <div className="RegisForm_1">
            <label htmlFor="GSTNumber">
              <div className="imp_v_star">
                GST Number
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="GSTNumber"
              name="GSTNumber"
              value={SupplierMaster.GSTNumber}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* PANNumber */}
          <div className="RegisForm_1">
            <label htmlFor="PANNumber">
              <div className="imp_v_star">
                PAN Number
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="PANNumber"
              name="PANNumber"
              value={SupplierMaster.PANNumber}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* DruglicenseNoOne */}
          <div className="RegisForm_1">
            <label htmlFor="DruglicenseNoOne">
              <div className="imp_v_star">
                Drug License No One
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="DruglicenseNoOne"
              name="DruglicenseNoOne"
              value={SupplierMaster.DruglicenseNoOne}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* DruglicenseNoTwo */}
          <div className="RegisForm_1">
            <label htmlFor="DruglicenseNoTwo">
              <div className="imp_v_star">
                Drug License No Two
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="DruglicenseNoTwo"
              name="DruglicenseNoTwo"
              value={SupplierMaster.DruglicenseNoTwo}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* PaymentTerms */}
          <div className="RegisForm_1">
            <label htmlFor="PaymentTerms">
              <div className="imp_v_star">
                Payment Terms
                <span className="requirreg12">*</span>
              </div>
              (Due days)
              <span>:</span>
            </label>
            <input
              type="text"
              onKeyDown={BlockInvalidcharecternumberSupplier}
              id="PaymentTerms"
              name="PaymentTerms"
              value={SupplierMaster.PaymentTerms}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* CreditLimit */}
          <div className="RegisForm_1">
            <label htmlFor="CreditLimit">
              <div className="imp_v_star">
                Credit Limit
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              onKeyDown={BlockInvalidcharecternumberSupplier}
              id="CreditLimit"
              name="CreditLimit"
              value={SupplierMaster.CreditLimit}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* LeadTime */}
          <div className="RegisForm_1">
            <label htmlFor="LeadTime">
              <div className="imp_v_star">
                Lead Time
                <span className="requirreg12">*</span>
              </div>
              (days)
              <span>:</span>
            </label>
            <input
              type="text"
              onKeyDown={BlockInvalidcharecternumberSupplier}
              id="LeadTime"
              name="LeadTime"
              value={SupplierMaster.LeadTime}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* Notes */}
          <div className="RegisForm_1">
            <label htmlFor="Notes">
              <div className="imp_v_star">
                Notes
              </div>
              <span>:</span>
            </label>
            <textarea
              id="Notes"
              name="Notes"
              value={SupplierMaster.Notes}
              onChange={handleInputChange}
              style={{height:'50px',fontSize:'12px'}}

              autoComplete="off"
            />
          </div>

          {/* FileAttachment */}
          <div className="RegisForm_1">
            <label htmlFor="FileAttachment_supplier">
              <div className="imp_v_star">
                File Attachment
              </div>
              <span>:</span>
            </label>
            <div>
              <input
                type="file"
                name="FileAttachment"
                accept="image/jpeg,image/png,application/pdf"
                required
                id="FileAttachment_supplier"
                autoComplete="off"
                onChange={handlefileOnchange}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '87px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: '10px',
                }}
              >
                <label
                  htmlFor="FileAttachment_supplier"
                  className="RegisterForm_1_btns choose_file_update"
                >
                  <PhotoCameraBackIcon />
                </label>
                <button
                  type="button"
                  className="RegisterForm_1_btns choose_file_update"
                  onClick={() =>
                    Selectedfileview(SupplierMaster.FileAttachment)
                  }
                >
                  <VisibilityIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        <br />
        <div className="common_center_tag">
          <span>Bank Details</span>
        </div>
        <br />
        <div className="RegisFormcon_1">
          {/* BankName */}
          <div className="RegisForm_1">
            <label htmlFor="BankName">
              <div className="imp_v_star">
                Bank Name
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="BankName"
              name="BankName"
              value={SupplierMaster.BankName}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* AccountNumber */}
          <div className="RegisForm_1">
            <label htmlFor="AccountNumber">
              <div className="imp_v_star">
                Account Number
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              onKeyDown={BlockInvalidcharecternumberSupplier}
              id="AccountNumber"
              name="AccountNumber"
              value={SupplierMaster.AccountNumber}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* IFSCCode */}
          <div className="RegisForm_1">
            <label htmlFor="IFSCCode">
              <div className="imp_v_star">
                IFSC Code
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="IFSCCode"
              name="IFSCCode"
              value={SupplierMaster.IFSCCode}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>

          {/* BankBranch */}
          <div className="RegisForm_1">
            <label htmlFor="BankBranch">
              <div className="imp_v_star">
                Bank Branch
                <span className="requirreg12">*</span>
              </div>
              <span>:</span>
            </label>
            <input
              type="text"
              id="BankBranch"
              name="BankBranch"
              value={SupplierMaster.BankBranch}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>
        </div>

        <br />

        <div className="Main_container_Btn">
          <button onClick={saveSupplierdata}>
            {SupplierMaster.SupplierId ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
      <ModelContainer />
    </>
  );
};

export default SupplierMaster;
