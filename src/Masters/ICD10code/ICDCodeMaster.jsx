
// import axios from 'axios';
// import React, { useCallback, useLayoutEffect,useEffect, useRef, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// import debounce from "lodash.debounce";
// import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import UploadIcon from '@mui/icons-material/Upload';
// import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";


// const ICDCodeMaster = () => {

//     const dispatch = useDispatch();

//     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//     const toast = useSelector(state => state.userRecord?.toast);

//     const [loading, setLoading] = useState(false);

//     const [selectedFile, setSelectedFile] = useState(null);

//     const [Stockdata,setStockdata]=useState([])

//     const[SearchICDCode,setSearchICDCode]=useState('')
//     const[SearchDescription,setSearchDescription]=useState('')
//     const[SearchDiagnosis,setSearchDiagnosis]=useState('')


//     const dispatchvalue = useDispatch();
    
//     const gridRef = useRef(null);


//   //  useEffect(()=>{

//   //  },[SearchICDCode,SearchDescription,SearchDiagnosis])



//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file && file.type === 'text/csv') {
//             setSelectedFile(file);
//             console.log('Selected file:', file);
//         } else {
//             setSelectedFile(null);
//             dispatchvalue({ 
//                 type: 'toast', 
//                 value: { message: "Please Choose Correct file", type: "error" } 
//             });
//         }
//     };

    


//     const GetMedicalStock =useCallback(()=>{

//         // setLoading(true)

//         axios.get(`${UrlLink}Masters/ICDCode_Master_DoctorGetLink`,{
//           params:{
//             SearchICDCode:SearchICDCode,
//             SearchDescription:SearchDescription,
//             SearchDiagnosis:SearchDiagnosis,
//           }
//         })
//         .then((res)=>{
//             console.log(res.data);
      
//             let data =res?.data
      
//             if(data && Array.isArray(data) && data.length !==0){
//                 setStockdata(data)
               
//             }
//             else{
//                 setStockdata([])
//             }
//         })
//         .catch((err)=>{
//             console.log(err);
//         })
//     },[SearchICDCode,SearchDescription,SearchDiagnosis])

//     useEffect(()=>{

//       GetMedicalStock()
    
    
//     },[GetMedicalStock])
    
// const ClearIcdcode =()=>{
//   setSearchICDCode('')
//   setSearchDescription('')
//   setSearchDiagnosis('')
// }

// const GetSingleIcdcode = () => {
//   if (!SearchICDCode && !SearchDescription && !SearchDiagnosis) {
//     dispatch({
//       type: "toast",
//       value: {
//         message: "Please enter a search criteria to view results.",
//         type: "warn",
//       },
//     });
//     return;
//   }

//   const finddata =
//     Stockdata.find(ele => ele.ICDCode === SearchICDCode) ||
//     Stockdata.find(ele => ele.ICDCode_Description === SearchDescription) ||
//     Stockdata.find(ele => ele.Diagnosis === SearchDiagnosis);

//   if (finddata) {
//     setSearchICDCode(finddata.ICDCode);
//     setSearchDescription(finddata.ICDCode_Description);
//     setSearchDiagnosis(finddata.Diagnosis);
//   }
// };



//     useLayoutEffect(() => {
//         const handleResize = debounce(() => {
//           if (gridRef.current) {
//             const { clientWidth } = gridRef.current;
//             const updatedclientWidth = clientWidth - 20;
    
//             const items = document.querySelectorAll(".RegisForm_1");
//             let totalWidth = 0;
//             let currentRowItemsCount = 0;
    
//             items.forEach((item) => {
//               const itemStyles = getComputedStyle(item);
//               const itemWidth =
//                 item.offsetWidth +
//                 parseFloat(itemStyles.marginLeft) +
//                 parseFloat(itemStyles.marginRight);
    
//               if (totalWidth + itemWidth <= updatedclientWidth) {
//                 totalWidth += itemWidth;
//                 currentRowItemsCount++;
//               }
//             });
//             const remainingGap = updatedclientWidth - totalWidth;
//             const gapBetweenItems = Math.floor(remainingGap / currentRowItemsCount);
//             const container = document.getElementById("ICDcode_ID");
    
//             if (updatedclientWidth > 800) {
//               container.style.justifyContent = "flex-start";
//               container.style.columnGap = `${
//                 gapBetweenItems === 0 ? 5 : gapBetweenItems
//               }px`;
//             } else {
//               container.style.justifyContent = "center";
//               container.style.columnGap = `10px`;
//             }
//           }
//         }, 100);
    
//         const currentGridRef = gridRef.current;
//         const resizeObserver = new ResizeObserver(handleResize);
//         if (currentGridRef) {
//           resizeObserver.observe(currentGridRef);
//         }
//         return () => {
//           if (currentGridRef) {
//             resizeObserver.unobserve(currentGridRef);
//           }
//           resizeObserver.disconnect();
//         };
//       }, []);

//     const handleStopEvent = (event) => {
//         document.body.style.pointerEvents = "auto";
//         event.preventDefault();
//         event.stopPropagation();
//       };

//     const scrollToElement = (elementId) => {
//         const element = document.getElementById(elementId);
//         if (element) {
//           document.body.style.pointerEvents = "none";
//           element.scrollIntoView({ behavior: "auto", block: "start" });
//           window.addEventListener("scroll", handleStopEvent);
//           window.addEventListener("click", handleStopEvent);
//         }
//       };

//     const Fileuploadfunc =()=>{

//         if (selectedFile) {
//             setLoading(true);
//             scrollToElement("ICDcode_ID");
            
//             const formData = new FormData();
//             formData.append('file', selectedFile);

//             axios.post(`${UrlLink}Masters/ICDCode_Master_InsetLink`, formData)
//                 .then((res) => {
//                     console.log('compleate',res.data);

//                     let data = res.data
  
//                     let type = Object.keys(data)[0]
//                     let mess = Object.values(data)[0]
//                     const tdata = {
//                         message: mess,
//                         type: type,
//                     }
                    
//                     if (type === 'success'){
//                      dispatchvalue({ type: 'toast', value: tdata }); 
//                      setLoading(false);
//                     }

//                     GetMedicalStock()
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                     setLoading(false);
//                     const tdata = {
//                         message: "Please Choose Correct file",
//                         type: "warn",
//                       };
//                       dispatchvalue({ type: "toast", value: tdata });
//                 });
//         } else {
//             console.error('No file selected for upload');
//         }

//     }


//     useEffect(()=>{
//         GetMedicalStock()
//     },[UrlLink,GetMedicalStock])



//     const StockColumn =[
//         {
//             key:'id',
//             name:'S.No',
//         },
//         {
//             key:'ICDCode',
//             name:'ICD 10 Code',
//         },
//         {
//             key:'ICDCode_Description',
//             name:'ICD 10 Code Description',
//         },
//         {
//             key:'Diagnosis',
//             name:'Diagnosis',
//         },
//     ]


//   return (
//     <>
//       <div className="Main_container_app">
//                 <h3>ICD 10 Code Master</h3>
                
//                 <div  className="RegisFormcon_1" id='ICDcode_ID' ref={gridRef}>
//                     <div className="RegisForm_1">
//                     <div className='Search_patient_icons'>
//                         <label>ICD 10 Code<span>:</span></label>
//                         <input
//                             type="text"
//                             value={SearchICDCode}
//                             placeholder='Search ICD 10 Code'
//                             onChange={(e) => setSearchICDCode(e.target.value)}
//                              list='SearchICDCodelist'
//                         />
//                         <datalist id='SearchICDCodelist'>
//                           {Stockdata.map((ele, ind) => (
//                             <option key={`${ind}-ind`} value={ele.ICDCode}></option>
//                           ))}
//                         </datalist>
//                     <span onClick={GetSingleIcdcode} >
//                         <ManageSearchIcon />
//                     </span>
//                     </div>
                        
//                     </div>

//                     <div className="RegisForm_1">
//                     <div className='Search_patient_icons'>

//                         <label>Code Description<span>:</span></label>
//                         <input
//                             type="text"
//                             value={SearchDescription}
//                             placeholder='Search Description'
//                             onChange={(e) => setSearchDescription(e.target.value)}
//                             list='SearchDescriptionlist'
//                         />
//                           <datalist id='SearchDescriptionlist'>
//                           {Stockdata.map((ele, ind) => (
//                             <option key={`${ind}-ind`} value={ele.ICDCode_Description}></option>
//                           ))}
//                         </datalist>
//                       <span onClick={GetSingleIcdcode} >
//                         <ManageSearchIcon />
//                     </span>
//                     </div> 
//                     </div>

//                     <div className="RegisForm_1">
//                     {/* <div className='Search_patient_icons'> */}

//                         <label>Diagnosis<span>:</span></label>
//                         <input
//                             type="text"
//                             value={SearchDiagnosis}
//                             // placeholder='Search Diagnosis'
//                             onChange={(e) => setSearchDiagnosis(e.target.value)}
//                             readOnly
                           
//                         />
                    
//                     {/* <span onClick={()=>{GetMedicalStock('SearchDiagnosis',SearchDiagnosis)}} >
//                     <ManageSearchIcon />
//                     </span> */}
//                     {/* </div>   */}
//                     </div>

//                     <div className="RegisForm_1">
//                         <input
//                             id="fileInput"
//                             type="file"
//                             accept=".csv"
//                             required
//                             autoComplete="off"
//                             style={{ display: 'none' }}
//                             onChange={handleFileChange}
                            
//                         />
//                         <div style={{    width: "87px",
//                       display: "flex",
//                       justifyContent: "flex-start",
//                       gap: "10px", }}>
//                             <label title='Choose File'
//                                 htmlFor="fileInput"
//                                 className="RegisterForm_1_btns choose_file_update"
//                                 style={{ cursor: 'pointer' }} 
//                             >
//                               <PhotoCameraBackIcon />
//                             </label>
//                             </div>

                            
//                             <button title='Upload' className="fileviewbtn"
//                             onClick={Fileuploadfunc}><UploadIcon /></button>
                       

//                         <button 
//                           className="fileviewbtn"
//                           onClick={ClearIcdcode}
//                         >
//                           Clear ICD code
//                         </button>
//                     </div>
//                 </div>

//                 {loading && (
//                 <div className="loader">
//                     <div className="Loading">
//                     <div className="spinner-border"></div>
//                     <div>Loading...</div>
//                     </div>
//                 </div>
//                 )}

//                 <ReactGrid columns={StockColumn} RowData={Stockdata} />
                
//                 <ToastAlert Message={toast.message} Type={toast.type} />

//             </div>
//     </>
//   )
// }

// export default ICDCodeMaster;


import axios from "axios";
import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import debounce from "lodash.debounce";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import UploadIcon from "@mui/icons-material/Upload";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
 
const ICDCodeMaster = () => {
  const dispatch = useDispatch();
 
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
 
  const [loading, setLoading] = useState(false);
 
  const [selectedFile, setSelectedFile] = useState(null);
 
  const [Stockdata, setStockdata] = useState([]);
 
  console.log(Stockdata,'asdfsdf')
 
  const [SearchICDCode, setSearchICDCode] = useState("");
  const [SearchDescription, setSearchDescription] = useState("");
  const [SearchDiagnosis, setSearchDiagnosis] = useState("");
 
  const dispatchvalue = useDispatch();
 
  const gridRef = useRef(null);
 
  //  useEffect(()=>{
 
  //  },[SearchICDCode,SearchDescription,SearchDiagnosis])
 
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = [
      "text/csv",
      // "application/vnd.ms-excel",
      // "application/octet-stream",
      // "text/plain",
    ];
 
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    } else {
      setSelectedFile(null);
      dispatchvalue({
        type: "toast",
        value: { message: "Please Choose Correct file", type: "error" },
      });
    }
  };
 
  const GetMedicalStock = useCallback(() => {
    // setLoading(true)
 
    axios
      .get(`${UrlLink}Masters/ICDCode_Master_DoctorGetLink`, {
        params: {
          SearchICDCode: SearchICDCode,
          SearchDescription: SearchDescription,
          SearchDiagnosis: SearchDiagnosis,
        },
      })
      .then((res) => {
        console.log(res.data);
 
        let data = res?.data;
 
        if (data && Array.isArray(data) && data.length !== 0) {
          setStockdata(data);
        } else {
          setStockdata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [SearchICDCode, SearchDescription, SearchDiagnosis]);
 
  useEffect(() => {
    GetMedicalStock();
  }, [GetMedicalStock]);
 
  const ClearIcdcode = () => {
    setSearchICDCode("");
    setSearchDescription("");
    setSearchDiagnosis("");
  };
 
  const GetSingleIcdcode = () => {
    if (!SearchICDCode && !SearchDescription && !SearchDiagnosis) {
      dispatch({
        type: "toast",
        value: {
          message: "Please enter a search criteria to view results.",
          type: "warn",
        },
      });
      return;
    }
 
    const finddata =
      Stockdata.find((ele) => ele.ICDCode === SearchICDCode) ||
      Stockdata.find((ele) => ele.ICDCode_Description === SearchDescription) ||
      Stockdata.find((ele) => ele.Diagnosis === SearchDiagnosis);
 
    if (finddata) {
      setSearchICDCode(finddata.ICDCode);
      setSearchDescription(finddata.ICDCode_Description);
      setSearchDiagnosis(finddata.Diagnosis);
    }
  };
 
  useLayoutEffect(() => {
    const handleResize = debounce(() => {
      if (gridRef.current) {
        const { clientWidth } = gridRef.current;
        const updatedclientWidth = clientWidth - 20;
 
        const items = document.querySelectorAll(".RegisForm_1");
        let totalWidth = 0;
        let currentRowItemsCount = 0;
 
        items.forEach((item) => {
          const itemStyles = getComputedStyle(item);
          const itemWidth =
            item.offsetWidth +
            parseFloat(itemStyles.marginLeft) +
            parseFloat(itemStyles.marginRight);
 
          if (totalWidth + itemWidth <= updatedclientWidth) {
            totalWidth += itemWidth;
            currentRowItemsCount++;
          }
        });
        const remainingGap = updatedclientWidth - totalWidth;
        const gapBetweenItems = Math.floor(remainingGap / currentRowItemsCount);
        const container = document.getElementById("ICDcode_ID");
 
        if (updatedclientWidth > 800) {
          container.style.justifyContent = "flex-start";
          container.style.columnGap = `${
            gapBetweenItems === 0 ? 5 : gapBetweenItems
          }px`;
        } else {
          container.style.justifyContent = "center";
          container.style.columnGap = `10px`;
        }
      }
    }, 100);
 
    const currentGridRef = gridRef.current;
    const resizeObserver = new ResizeObserver(handleResize);
    if (currentGridRef) {
      resizeObserver.observe(currentGridRef);
    }
    return () => {
      if (currentGridRef) {
        resizeObserver.unobserve(currentGridRef);
      }
      resizeObserver.disconnect();
    };
  }, []);
 
  const handleStopEvent = (event) => {
    document.body.style.pointerEvents = "auto";
    event.preventDefault();
    event.stopPropagation();
  };
 
  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      document.body.style.pointerEvents = "none";
      element.scrollIntoView({ behavior: "auto", block: "start" });
      window.addEventListener("scroll", handleStopEvent);
      window.addEventListener("click", handleStopEvent);
    }
  };
 
  const Fileuploadfunc = () => {
    if (selectedFile) {
      setLoading(true);
      scrollToElement("ICDcode_ID");
 
      const formData = new FormData();
      formData.append("file", selectedFile);
 
      axios
        .post(`${UrlLink}Masters/ICDCode_Master_InsetLink`, formData)
        .then((res) => {
          console.log("compleate", res.data);
 
          let data = res.data;
 
          let type = Object.keys(data)[0];
          let mess = Object.values(data)[0];
          const tdata = {
            message: mess,
            type: type,
          };
 
          if (type === "success") {
            dispatchvalue({ type: "toast", value: tdata });
            setLoading(false);
          }
 
          GetMedicalStock();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          const tdata = {
            message: "Please Choose Correct file",
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: tdata });
        });
    } else {
      console.error("No file selected for upload");
    }
  };
 
  useEffect(() => {
    GetMedicalStock();
  }, [UrlLink, GetMedicalStock]);
 
  const StockColumn = [
    {
      key: "id",
      name: "S.No",
    },
    {
      key: "ICDCode",
      name: "ICD 10 Code",
    },
    {
      key: "ICDCode_Description",
      name: "ICD 10 Code Description",
    },
    {
      key: "Diagnosis",
      name: "Diagnosis",
    },
  ];
 
  return (
    <>
      <div className="Main_container_app">
        <h3>ICD 10 Code Master</h3>
 
        <div className="RegisFormcon_1" id="ICDcode_ID" ref={gridRef}>
          <div className="RegisForm_1">
            <div className="Search_patient_icons">
              <label>
                ICD 10 Code<span>:</span>
              </label>
              <input
                type="text"
                value={SearchICDCode}
                placeholder="Search ICD 10 Code"
                onChange={(e) => setSearchICDCode(e.target.value)}
                list="SearchICDCodelist"
              />
              <datalist id="SearchICDCodelist">
                {Stockdata.map((ele, ind) => (
                  <option key={`${ind}-ind`} value={ele.ICDCode}></option>
                ))}
              </datalist>
              <span onClick={GetSingleIcdcode}>
                <ManageSearchIcon />
              </span>
            </div>
          </div>
 
          <div className="RegisForm_1">
            <div className="Search_patient_icons">
              <label>
                Code Description<span>:</span>
              </label>
              <input
                type="text"
                value={SearchDescription}
                placeholder="Search Description"
                onChange={(e) => setSearchDescription(e.target.value)}
                list="SearchDescriptionlist"
              />
              <datalist id="SearchDescriptionlist">
                {Stockdata.map((ele, ind) => (
                  <option
                    key={`${ind}-ind`}
                    value={ele.ICDCode_Description}
                  ></option>
                ))}
              </datalist>
              <span onClick={GetSingleIcdcode}>
                <ManageSearchIcon />
              </span>
            </div>
          </div>
 
          <div className="RegisForm_1">
            {/* <div className='Search_patient_icons'> */}
 
            <label>
              Diagnosis<span>:</span>
            </label>
            <input
              type="text"
              value={SearchDiagnosis}
              // placeholder='Search Diagnosis'
              onChange={(e) => setSearchDiagnosis(e.target.value)}
              readOnly
            />
 
            {/* <span onClick={()=>{GetMedicalStock('SearchDiagnosis',SearchDiagnosis)}} >
                    <ManageSearchIcon />
                    </span> */}
            {/* </div>   */}
          </div>
 
          <div className="RegisForm_1">
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              required
              autoComplete="off"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div
              style={{
                width: "87px",
                display: "flex",
                justifyContent: "flex-start",
                gap: "10px",
              }}
            >
              <label
                title="Choose File"
                htmlFor="fileInput"
                className="RegisterForm_1_btns choose_file_update"
                style={{ cursor: "pointer" }}
              >
                <PhotoCameraBackIcon />
              </label>
            </div>
 
            <button
              title="Upload"
              className="fileviewbtn"
              onClick={Fileuploadfunc}
            >
              <UploadIcon />
            </button>
 
            <button className="fileviewbtn" onClick={ClearIcdcode}>
              Clear ICD code
            </button>
            {selectedFile && (
              <div
                style={{ marginTop: "5px", color: "#444", fontSize: "14px" }}
              >
                <strong>Selected File:</strong> {selectedFile.name}
              </div>
            )}
          </div>
        </div>
 
        {loading && (
          <div className="loader">
            <div className="Loading">
              <div className="spinner-border"></div>
              <div>Loading...</div>
            </div>
          </div>
        )}
 
        <ReactGrid columns={StockColumn} RowData={Stockdata} />
 
        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};
 
export default ICDCodeMaster;