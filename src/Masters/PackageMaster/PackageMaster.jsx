// import React, { useState,useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';

// const PackageMaster = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const dispatchvalue = useDispatch();

//   const [packages, setPackages] = useState([]);
//   const [speciality,setspeciality] = useState([]);
//   const [load,setload] = useState(false);
//   const [currentPackage, setCurrentPackage] = useState({
//     id: null,
//     PackageName: "",
//     PackageType:"",
//     Price: "",
//     Status: "Active",
//     AllowDiscount: "Yes",    
//     Validity: "",
//     FromDate: "",
//     ToDate: "",
//     Specialist: "",
//     Specialistname:"",
//   });

//   console.log('currentPackage',currentPackage);

//   console.log(packages,'packages');

//   const [Category, setcategory] = useState([]);
//   const [Subcategory,setsubcategory] = useState([]);
//   const [services,setServices] = useState([]);

//   console.log(services,'services11111111')
//   const [currentService, setCurrentService] = useState({
//     id: null,
//     Categoryid: "",
//     Categoryname:"",
//     Subcategorypk:"",
//     SubCategoryid: "",
//     SubCategoryname: "",
//     Quantity: "",
//   });


//   console.log(Subcategory,'Subcategory')

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if(name === "Service"){
//         const value1 = value.split('-')
//         const Categoryid = value1[0];
//         const Categoryname = value1[1];
//         console.log('serrrrrr', value1, Categoryid, Categoryname);
//         setCurrentService((prev)=>({
//           ...prev,
//           Categoryid : Categoryid,
//           Categoryname : Categoryname,
//         }))

//     }
    
//     else if(name === "SubCategory"){

//         const value1 = value.split('-');
//         console.log(value1.length);
//         if(value1.length === 3){
//           const subcategorypk = value1[0];
//           const subCategoryid = value1[1];
//           const  subCategoryname= value1[2];
         
//           setCurrentService((prev)=>({
//             ...prev,
//             SubCategoryid : subCategoryid,
//             SubCategoryname : subCategoryname,
//             Subcategorypk : subcategorypk
//           }))
//         }

//         else if(value1.length === 2){
//           const subCategoryid = value1[0];
//           const subCategoryname = value1[1];
//           setCurrentService((prev)=>({
//             ...prev,
//             SubCategoryid : subCategoryid,
//             SubCategoryname : subCategoryname,
            
//           }))


//         }

//         else if(value1.length === 4){
//           const subcategorypk = value1[0];
//           const roomno = value1[1];
//           const bedno = value1[2];
//           const Wardname = value1[3];
//           const subCategoryname = roomno + bedno + Wardname;
//           console.log('serrrrrr', value1, subcategorypk, roomno,bedno,Wardname,subCategoryname);
//           setCurrentService((prev)=>({
//             ...prev,
//             Subcategorypk : subcategorypk,
//             SubCategoryname : subCategoryname,
            
//           }))


//         }


//         else{
//           setCurrentService((prev)=>({
//               ...prev,
//               SubCategoryid : '',
//               SubCategoryname : '',
//               Subcategorypk : ''
//             }));
//       }
       

//     }

//     else if(name === "Specialist"){

//       if(value){
//         axios.get(`${UrlLink}Masters/Speciality_Detials_link?id=${value}`)
//             .then((res) => {
//                 const ress = res.data
//                 console.log(ress[0].SpecialityName, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');
    
//                 setCurrentPackage((prev)=>({
//                   ...prev,
//                   Specialistname:ress[0].SpecialityName,
//              }));
//             })
//             .catch((err) => {
//                 console.log(err);
//             })
//           }
//  }  



//  console.log(services);









//     if ([ "Quantity"].includes(name)) {
//       setCurrentService({ ...currentService, [name]: value });
//     } else {
//       setCurrentPackage({ ...currentPackage, [name]: value });
//     }
//   };

//   const handleSave = () => {
//     // Validate required fields for Package
//     if (!currentPackage.PackageName || !currentPackage.Price) {
//       alert("Please fill in the required fields: Package Name and Price.");
//       return; // Don't proceed with adding the package
//     }
  
//     if (currentPackage.id !== null) {
//       setPackages(
//         packages.map((pkg) => (pkg.id === currentPackage.id ? currentPackage : pkg))
//       );
//     } else {
//       setPackages([...packages, { ...currentPackage, id: Date.now() }]);
//     }
  
//     // Reset currentPackage state after saving
//     setCurrentPackage({
//       id: null,
//       PackageName: "",
//       PackageType:'',
//       Price: "",
//       Status: "Active",
//       AllowDiscount: "Yes",
//       Validity: "",
//       FromDate: "",
//       ToDate: "",
//       Specialist: "",
//       Specialistname:""
//     });
//   };
  
//   const handleEdit = async(pkg) => {
//     console.log(pkg.Services_details);
  
//     setCurrentPackage(pkg);
//     setServices(pkg.Services_details);
//   };

//   console.log(currentPackage);

//   const handleSave2 = () => {
//     // Validate that Service is not empty
//     if (!currentService.Categoryname || !currentService.SubCategoryname || !currentService.Quantity) {
//      const  mess = "Please fill in the required fields: Service, Sub Category, and Quantity.";
//      const typp = 'warn';
//       const tdata = {
//         message: mess,
//         type: typp,
//     };
//       dispatchvalue({ type: "toast", value: tdata });
//       return; // Don't proceed with adding the service
//     }

//     setServices((prevData) => {

//       const newId = prevData.length + 1;
//       const serviceWithId = { ...currentService, id: newId };
//       return [...prevData, serviceWithId];
//     });

//    // setServices((prevData) => [...prevData, currentService]);

//     // if (currentService.id !== null) {
//     //   setServices(
//     //     services.map((svc) => (svc.id === currentService.id ? currentService : svc))
//     //   );
//     // } else {
//     //   setServices([...services, { ...currentService, id: Date.now() }]);
//     // }
  
//     // Reset currentService state after saving
//     setCurrentService({
//       id: null,
//       Categoryid: "",
//       Categoryname:"",
//       Subcategorypk:"",
//       SubCategoryid: "",
//       SubCategoryname: "",
//       Quantity: "",
//     });
//   };

//   console.log(services);
  

//   const handleEditService = (svc) => {
//     setCurrentService(svc);
//   };

//   const handleDeleteService = (id) => {
//     setServices(services.filter((svc) => svc.id !== id));
//     setload((prev)=>(!prev));
//   };

//   const handleFinalSubmit = async () => {
    
//     const packageMasterData = {
//       currentPackage,
//       services,
//     };
  
//     try {
//       const response = await axios.post(
//         `${UrlLink}Masters/package_master_details`,
//         packageMasterData
//       );

//       const resData = response.data;
//       console.log(resData);
//       const mess = Object.values(resData)[0];
//       const typp = Object.keys(resData)[0];
//       console.log(mess);
//       console.log(typp);
//       const tdata = {
//                 message: mess,
//                 type: typp,
//             };
//        dispatchvalue({ type: "toast", value: tdata });

      
//     } catch (error) {
//       console.error("An error occurred:", error);
//     }

//     console.log("Submitting PackageMaster Data:", packageMasterData);

//     // Dispatch or API call to save the data
//     //dispatch({ type: "SUBMIT_PACKAGE_MASTER", payload: packageMasterData });

//     // Reset states if needed
//     setPackages([]);
//     setServices([]);
//     setload((prev)=>(!prev));
//     setCurrentPackage({
//       id: null,
//       PackageName: "",
//       PackageType:"",
//       Price: "",
//       Status: "Active",
//       AllowDiscount: "Yes",
//       Validity: "",
//       FromDate: "",
//       ToDate: "",
//       Specialist: "",
//       Specialistname:""
//     });
//     setCurrentService({
//       id: null,
//       Categoryid: "",
//       Categoryname:"",
//       Subcategorypk:"",
//       SubCategoryid: "",
//       SubCategoryname: "",
//       Quantity: "",
//     });

//     // Optionally show a success toast or message
//     //alert("Package Master data submitted successfully!");
//   };

//   useEffect(() => {
//     axios.get(`${UrlLink}Masters/Insert_service_category_master`)
//         .then((res) => {
//             const ress = res.data
//             console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

//             setcategory(ress)
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// }, [UrlLink]);


// useEffect(() => {
//   axios.get(`${UrlLink}Masters/package_master_details`)
//       .then((res) => {
//           const ress = res.data
//           console.log(ress[0].Services_details, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

//           setPackages(ress);
         
//       })
//       .catch((err) => {
//           console.log(err);
//       })
// }, [UrlLink,load]);

// useEffect(() => {
//   axios.get(`${UrlLink}Masters/Services_List_by_servicecategory?servicecategory=${currentService.Categoryid}`)
//       .then((res) => {
//           const ress = res.data
//           console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

//           setsubcategory(ress)
//       })
//       .catch((err) => {
//           console.log(err);
//       })
// }, [currentService.Categoryid]);

// useEffect(() => {
//   axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
//       .then((res) => {
//           const ress = res.data
//           console.log(ress, 'ddhdhdhdhdhdhdhdhdhdhdhdhdhdh');

//           setspeciality(ress)
//       })
//       .catch((err) => {
//           console.log(err);
//       })
// }, [UrlLink]);


//   return (
//     <>
//       <div className="Main_container_app">
//         <div className="common_center_tag">
//           <span>Package Master</span>
//         </div>

//         <div className="RegisFormcon_1">
//           <div className="RegisForm_1">
//             <label>
//               Package Name <span>:</span>
//             </label>
//             <input
//               type="text"
//               name="PackageName"
//               value={currentPackage.PackageName}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>
//               Package Type <span>:</span>
//             </label>
//             <input
//               type="text"
//               name="PackageType"
//               value={currentPackage.PackageType}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>
//               Price <span>:</span>
//             </label>
//             <input
//               type="text"
//               name="Price"
//               value={currentPackage.Price}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>
//               Status <span>:</span>
//             </label>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 width: "120px",
//                 gap: "10px",
//               }}
//             >
//               <label style={{ width: "auto", gap: "2px" }}>
//                 <input
//                   type="radio"
//                   name="Status"
//                   value="Active"
//                   style={{ width: "15px" }}
//                   checked={currentPackage.Status === "Active"}
//                   onChange={handleChange}
//                 />
//                 Active
//               </label>
//               <label style={{ width: "auto", gap: "2px" }}>
//                 <input
//                   type="radio"
//                   name="Status"
//                   value="Inactive"
//                   style={{ width: "15px" }}
//                   checked={currentPackage.Status === "Inactive"}
//                   onChange={handleChange}
//                 />
//                 Inactive
//               </label>
//             </div>
//           </div>

//           <div className="RegisForm_1">
//             <label>
//               Allow Discount <span>:</span>
//             </label>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 width: "120px",
//                 gap: "10px",
//               }}
//             >
//               <label style={{ width: "auto" }}>
//                 <input
//                   type="radio"
//                   name="AllowDiscount"
//                   value="Yes"
//                   style={{ width: "15px" }}
//                   checked={currentPackage.AllowDiscount === "Yes"}
//                   onChange={handleChange}
//                 />
//                 Yes
//               </label>
//               <label style={{ width: "auto" }}>
//                 <input
//                   type="radio"
//                   name="AllowDiscount"
//                   value="No"
//                   style={{ width: "15px" }}
//                   checked={currentPackage.AllowDiscount === "No"}
//                   onChange={handleChange}
//                 />
//                 No
//               </label>
//             </div>
//           </div>
//           {/* 
//           <div className="RegisForm_1">
//             <label>
//               Validity <span>:</span>
//             </label>
//             <input
//               type="text"
//               name="Validity"
//               value={currentPackage.Validity}
//               onChange={handleChange}
//             />
//           </div> */}

//           <div className="RegisForm_1">
//             <label>
//               From Date <span>:</span>
//             </label>
//             <input
//               type="date"
//               name="FromDate"
//               value={currentPackage.FromDate}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>
//               To Date <span>:</span>
//             </label>
//             <input
//               type="date"
//               name="ToDate"
//               value={currentPackage.ToDate}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>
//               Specialist <span>:</span>
//             </label>
           
//                <select 
//                   name="Specialist"
//                   value={currentPackage.Specialist}
//                   onChange={handleChange}
//                 >

//                     <option value="">select</option>
//                     {Array.isArray(speciality) &&
//                     speciality.map((val,idx) =>(
//                       <option key={idx} value={val.Speciality_Id}>{val.SpecialityName}</option>
//                     ))}
                    
                    
//                 </select>
//           </div>
//         </div>

//         {/* <div className="Main_container_Btn">
//           <button onClick={handleSave}>
//             {currentPackage.id !== null ? "Update" : "Add"}
//           </button>
//         </div> */}

//         <div className="Selected-table-container">
//           <table className="selected-medicine-table2">
//             <thead>
//               <tr>
//                 <th>Package Name</th>
//                 <th>Package Type</th>
//                 <th>Price</th>
//                 <th>Status</th>
//                 <th>Allow Discount</th>
//                 {/* <th>Validity</th> */}
//                 <th>From Date</th>
//                 <th>To Date</th>
//                 <th>Specialist</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {packages.map((pkg) => (
//                 <tr key={pkg.id}>
//                   <td>{pkg.PackageName}</td>
//                   <td>{pkg.PackageType}</td>
//                   <td>{pkg.Price}</td>
//                   <td>{pkg.Status}</td>
//                   <td>{pkg.AllowDiscount}</td>
//                   {/* <td>{pkg.Validity}</td> */}
//                   <td>{pkg.FromDate}</td>
//                   <td>{pkg.ToDate}</td>
//                   <td>{pkg.Specialistname}</td>
//                   <td>
//                     <button
//                       className="delnamebtn"
//                       onClick={() => handleEdit(pkg)}
//                     >
//                       <EditIcon />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <br />

//         <div className="RegisFormcon_1">
//           <div className="RegisForm_1">
//             <label>
//               Service Category <span>:</span>
//             </label>
//             <input
//               type="text"
//               name="Service"
//               value={currentService.Categoryname}
//               onChange={handleChange}
//               list="CategoryNameList"
//             />
//             <datalist id="CategoryNameList">
//                         {Array.isArray(Category) &&
//                             Category.map((f, i) => (
//                                 <option key={i} value={`${f.Serviceid}-${f.ServiceCategory}`}></option>
//                             ))}
//             </datalist>
//           </div>

//           <div className="RegisForm_1">
//             <label>
//               Sub Category <span>:</span>
//             </label>
//             <input
//               type="text"
//               name="SubCategory"
//               value={currentService.SubCategoryname}
//               onChange={handleChange}
//               list="SubCategoryNameList"
//             />
//             <datalist id="SubCategoryNameList">
//                         {Array.isArray(Subcategory) &&
//                             Subcategory.map((f, i) => (
//                               <option key={i} value={`${f.pk}-${f.service_subcategory}`}></option>
                                
//                             ))}
//             </datalist>
//           </div>

//           <div className="RegisForm_1">
//             <label>
//               Quantity <span>:</span>
//             </label>
//             <input
//               type="text"
//               name="Quantity"
//               value={currentService.Quantity}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <div className="Main_container_Btn">
//           <button onClick={handleSave2}>
//             {currentService.id !== null ? "Update" : "Add"}
//           </button>
//         </div>

//         {/* Service Table */}
//         <div className="Selected-table-container">
//           <table className="selected-medicine-table2">
//             <thead>
//               <tr>
//                 <th>Service</th>
//                 <th>Sub Category</th>
//                 <th>Quantity</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {services.map((svc) => (
//                 <tr key={svc.id}>
//                   <td>{svc.Categoryname}</td>
//                   <td>{svc.SubCategoryname}</td>
//                   <td>{svc.Quantity}</td>
//                   <td>
//                     <button
//                       className="delnamebtn"
//                       onClick={() => handleEditService(svc)}
//                     >
//                       <EditIcon />
//                     </button>
//                     <button
//                       className="delnamebtn"
//                       onClick={() => handleDeleteService(svc.id)}
//                     >
//                       <DeleteIcon />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="Main_container_Btn">
//           <button onClick={handleFinalSubmit}>Submit</button>
//         </div>
//       </div>
//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </>
//   );
// };

// export default PackageMaster;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';

const PackageMaster = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();

  const [packages, setPackages] = useState([]);
  const [speciality, setspeciality] = useState([]);
  const [load, setload] = useState(false);
  const [currentPackage, setCurrentPackage] = useState({
    id: null,
    PackageName: "",
    PackageType: "",
    Price: "",
    Status: "Active",
    AllowDiscount: "Yes",
    Validity: "",
    FromDate: "",
    ToDate: "",
    Specialist: "",
    Specialistname: "",
  });

  const [Category, setcategory] = useState([]);
  const [Subcategory, setsubcategory] = useState([]);
  const [services, setServices] = useState([]);

  const [currentService, setCurrentService] = useState({
    id: null,
    Categoryid: "",
    Categoryname: "",
    Subcategorypk: "",
    SubCategoryid: "",
    SubCategoryname: "",
    Quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Service") {
      const value1 = value.split('|');
      const Categoryid = value1[0];
      const Categoryname = value1[1];
      setCurrentService((prev) => ({
        ...prev,
        Categoryid,
        Categoryname,
        SubCategoryid: "",
        SubCategoryname: "",
        Subcategorypk: "",
      }));
    } 


    else if (name === "SubCategory") {
  const value1 = value.split('|');
  
  if (value1.length === 2) {
    const subCategoryid = value1[0];
    const subCategoryname = value1[1];
    setCurrentService((prev) => ({
      ...prev,
      SubCategoryid: subCategoryid,
      SubCategoryname: subCategoryname,
      Subcategorypk: subCategoryid,
    }));
  } 
  else {
    // Just save typed text, don’t reset IDs
    setCurrentService((prev) => ({
      ...prev,
      SubCategoryname: value,
    }));
  }
}
    
    
    else if (name === "Specialist") {
      if (value) {
        axios.get(`${UrlLink}Masters/Speciality_Detials_link?id=${value}`)
          .then((res) => {
            const ress = res.data;
            setCurrentPackage((prev) => ({
              ...prev,
              Specialist: value,
              Specialistname: ress[0]?.SpecialityName || "",
            }));
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        setCurrentPackage((prev) => ({
          ...prev,
          Specialist: "",
          Specialistname: "",
        }));
      }
    } else if (["Quantity"].includes(name)) {
      setCurrentService((prev) => ({ ...prev, [name]: value }));
    } else {
      setCurrentPackage((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave2 = () => {
    if (!currentService.Categoryname || !currentService.SubCategoryname || !currentService.Quantity) {
      const mess = "Please fill in the required fields: Service, Sub Category, and Quantity.";
      const typp = 'warn';
      const tdata = { message: mess, type: typp };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    if (currentService.id !== null) {
      setServices((prev) =>
        prev.map((svc) =>
          svc.id === currentService.id ? { ...currentService } : svc
        )
      );
    } else {
      setServices((prev) => [
        ...prev,
        { ...currentService, id: Date.now() },
      ]);
    }

    setCurrentService((prev) => ({
      ...prev,
      id: null,
      Subcategorypk: "",
      SubCategoryid: "",
      SubCategoryname: "",
      Quantity: "",
      }));

  };

  const handleEdit = (pkg) => {
    setCurrentPackage({
      id: pkg.id,
      PackageName: pkg.PackageName || "",
      PackageType: pkg.PackageType || "",
      Price: pkg.Price || "",
      Status: pkg.Status || "Active",
      AllowDiscount: pkg.AllowDiscount || "Yes",
      Validity: pkg.Validity || "",
      FromDate: pkg.FromDate || "",
      ToDate: pkg.ToDate || "",
      Specialist: pkg.Specialist || "",
      Specialistname: pkg.Specialistname || "",
    });
    setServices(
      pkg.Services_details.map((svc) => ({
        id: svc.id || Date.now(),
        Categoryid: svc.service_category_id,
        Categoryname: svc.Categoryname,
        Subcategorypk: svc.service_sub_category_id,
        SubCategoryid: svc.service_sub_category_id,
        SubCategoryname: svc.SubCategoryname,
        Quantity: svc.Quantity,
      }))
    );
  };

  const handleEditService = (svc) => {
    setCurrentService({
      id: svc.id,
      Categoryid: svc.Categoryid,
      Categoryname: svc.Categoryname,
      Subcategorypk: svc.Subcategorypk,
      SubCategoryid: svc.SubCategoryid,
      SubCategoryname: svc.SubCategoryname,
      Quantity: svc.Quantity,
    });
  };

  const handleDeleteService = (id) => {
    setServices((prev) => prev.filter((svc) => svc.id !== id));
    setload((prev) => !prev);
  };

  const handleFinalSubmit = async () => {
    if (!currentPackage.PackageName || !currentPackage.Price || !currentPackage.Specialist) {
      const mess = "Please fill in the required fields: Package Name, Price, and Specialist.";
      const typp = 'warn';
      const tdata = { message: mess, type: typp };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    if (services.length === 0) {
      const mess = "Please add at least one service.";
      const typp = 'warn';
      const tdata = { message: mess, type: typp };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    const packageMasterData = {
      currentPackage: {
        id: currentPackage.id || undefined,
        PackageName: currentPackage.PackageName,
        PackageType: currentPackage.PackageType,
        Price: currentPackage.Price,
        Status: currentPackage.Status,
        AllowDiscount: currentPackage.AllowDiscount,
        Validity: currentPackage.Validity,
        FromDate: currentPackage.FromDate || null,
        ToDate: currentPackage.ToDate || null,
        Specialist: currentPackage.Specialist,
      },
      services: services.map((svc) => ({
        Categoryid: svc.Categoryid,
        SubCategoryid: svc.SubCategoryid,
        Subcategorypk: svc.Subcategorypk,
        Quantity: svc.Quantity,
        SubCategoryname: svc.SubCategoryname,
      })),
    };

    try {
      const response = await axios.post(
        `${UrlLink}Masters/package_master_details`,
        packageMasterData
      );
      const resData = response.data;
      const mess = resData.success || resData.error;
      const typp = resData.success ? 'success' : 'error';
      const tdata = { message: mess, type: typp };
      dispatchvalue({ type: "toast", value: tdata });

      setCurrentPackage({
        id: null,
        PackageName: "",
        PackageType: "",
        Price: "",
        Status: "Active",
        AllowDiscount: "Yes",
        Validity: "",
        FromDate: "",
        ToDate: "",
        Specialist: "",
        Specialistname: "",
      });
      setServices([]);
      setload((prev) => !prev);
    } catch (error) {
      console.error("An error occurred:", error);
      const tdata = { message: "Failed to submit package.", type: "error" };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Insert_service_category_master`)
      .then((res) => setcategory(res.data))
      .catch((err) => console.error(err));
  }, [UrlLink]);

  useEffect(() => {
    axios.get(`${UrlLink}Masters/package_master_details`)
      .then((res) => setPackages(res.data))
      .catch((err) => console.error(err));
  }, [UrlLink, load]);

  useEffect(() => {
    if (currentService.Categoryid) {
      axios.get(`${UrlLink}Masters/services_Subcategory_details_by_category?ServiceCategory=${currentService.Categoryid}`)
        .then((res) => setsubcategory(res.data))
        .catch((err) => console.error(err));
    } else {
      setsubcategory([]);
    }
  }, [UrlLink, currentService.Categoryid]);

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => setspeciality(res.data))
      .catch((err) => console.error(err));
  }, [UrlLink]);

  return (
    <>
      <div className="Main_container_app">
        <div className="common_center_tag">
          <span>Package Master</span>
        </div>

        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>
              Package Name <span>:</span>
            </label>
            <input
              type="text"
              name="PackageName"
              value={currentPackage.PackageName}
              onChange={handleChange}
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Package Type <span>:</span>
            </label>
            <input
              type="text"
              name="PackageType"
              value={currentPackage.PackageType}
              onChange={handleChange}
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Price <span>:</span>
            </label>
            <input
              type="text"
              name="Price"
              value={currentPackage.Price}
              onChange={handleChange}
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Status <span>:</span>
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                width: "120px",
                gap: "10px",
              }}
            >
              <label style={{ width: "auto", gap: "2px" }}>
                <input
                  type="radio"
                  name="Status"
                  value="Active"
                  style={{ width: "15px" }}
                  checked={currentPackage.Status === "Active"}
                  onChange={handleChange}
                />
                Active
              </label>
              <label style={{ width: "auto", gap: "2px" }}>
                <input
                  type="radio"
                  name="Status"
                  value="Inactive"
                  style={{ width: "15px" }}
                  checked={currentPackage.Status === "Inactive"}
                  onChange={handleChange}
                />
                Inactive
              </label>
            </div>
          </div>

          <div className="RegisForm_1">
            <label>
              Allow Discount <span>:</span>
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                width: "120px",
                gap: "10px",
              }}
            >
              <label style={{ width: "auto" }}>
                <input
                  type="radio"
                  name="AllowDiscount"
                  value="Yes"
                  style={{ width: "15px" }}
                  checked={currentPackage.AllowDiscount === "Yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label style={{ width: "auto" }}>
                <input
                  type="radio"
                  name="AllowDiscount"
                  value="No"
                  style={{ width: "15px" }}
                  checked={currentPackage.AllowDiscount === "No"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          <div className="RegisForm_1">
            <label>
              From Date <span>:</span>
            </label>
            <input
              type="date"
              name="FromDate"
              value={currentPackage.FromDate}
              onChange={handleChange}
            />
          </div>

          <div className="RegisForm_1">
            <label>
              To Date <span>:</span>
            </label>
            <input
              type="date"
              name="ToDate"
              value={currentPackage.ToDate}
              onChange={handleChange}
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Specialist <span>:</span>
            </label>
            <select
              name="Specialist"
              value={currentPackage.Specialist}
              onChange={handleChange}
            >
              <option value="">select</option>
              {Array.isArray(speciality) &&
                speciality.map((val, idx) => (
                  <option key={idx} value={val.Speciality_Id}>
                    {val.SpecialityName}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Package Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Allow Discount</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Specialist</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.PackageName}</td>
                  <td>{pkg.PackageType}</td>
                  <td>{pkg.Price}</td>
                  <td>{pkg.Status}</td>
                  <td>{pkg.AllowDiscount}</td>
                  <td>{pkg.FromDate}</td>
                  <td>{pkg.ToDate}</td>
                  <td>{pkg.Specialistname}</td>
                  <td>
                    <button
                      className="delnamebtn"
                      onClick={() => handleEdit(pkg)}
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <br />

        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>
              Service Category <span>:</span>
            </label>
            <input
              type="text"
              name="Service"
              value={currentService.Categoryname}
              onChange={handleChange}
              list="CategoryNameList"
            />
            <datalist id="CategoryNameList">
              {Array.isArray(Category) &&
                Category.map((f, i) => (
                  <option key={i} value={`${f.Serviceid}|${f.ServiceCategory}`}></option>
                ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label>
              Sub Category <span>:</span>
            </label>
            <input
              type="text"
              name="SubCategory"
              value={currentService.SubCategoryname}
              onChange={handleChange}
              list="SubCategoryNameList"
            />
            <datalist id="SubCategoryNameList">
              {Array.isArray(Subcategory) &&
                Subcategory.map((f, i) => (
                  <option key={i} value={`${f.pk}|${f.service_subcategory}`}></option>
                ))}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label>
              Quantity <span>:</span>
            </label>
            <input
              type="text"
              name="Quantity"
              value={currentService.Quantity}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleSave2}>
            {currentService.id !== null ? "Update" : "Add"}
          </button>
        </div>

        <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th>Service</th>
                <th>Sub Category</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc.id}>
                  <td>{svc.Categoryname}</td>
                  <td>{svc.SubCategoryname}</td>
                  <td>{svc.Quantity}</td>
                  <td>
                    <button
                      className="delnamebtn"
                      onClick={() => handleEditService(svc)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="delnamebtn"
                      onClick={() => handleDeleteService(svc.id)}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleFinalSubmit}>Submit</button>
        </div>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default PackageMaster;
