import React, { useState, useEffect, useCallback,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import WeekendIcon from '@mui/icons-material/Weekend';

import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { formatunderscoreLabel } from "../OtherComponent/OtherFunctions";


const NSAssets = () => {


  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();

  const NurstationAssets = useSelector((state) => state.Frontoffice?.NurstationAssets);

  console.log('NurstationAssets',NurstationAssets)
  

  const [viewType, setViewType] = useState("Equipment");

  const [EquipmentDatas,setEquipmentDatas] = useState({
    NSEId : "",
    EquipmentsName: "",
    Stock:"",
    Remarks : "",
    NurseStationid: userRecord?.NurseStationid || ""

  })

      const [SelectedFileEquipment, setSelectedFileEquipment] = useState(null);
      const [getdataEquipment, setgetdataEquipment] = useState(false);

          const handleFileChangeEquipment = (event) => {
                    setSelectedFileEquipment(null);
                    setSelectedFileEquipment(event.target.files[0]);
            };
          
          
          const handleCsvuploadEquipment = () => {
                  console.log(SelectedFileEquipment,'SelectedFileEquipment');
                  const formData = new FormData();
                  formData.append("file", SelectedFileEquipment);
                  formData.append("created_by", userRecord?.username);
          
                  if (SelectedFileEquipment) {
                      axios
                          .post(`${UrlLink}Masters/upload_nsequipments_excel`, formData, {
                              headers: { "Content-Type": "multipart/form-data" },
                          })
                          .then((response) => {
                              console.log(response);
                              setSelectedFileEquipment(null);
          
                              let data = response.data;
          
                              let type = Object.keys(data)[0]
                              let mess = Object.values(data)[0]
                              const tdata = {
                                  message: mess,
                                  type: type
                              }
                              dispatchvalue({ type: 'toast', value: tdata })
                              setIsEquipmentDatas(prev => !prev)
                          })
                          .catch((error) => {
                              console.log(error);
                              alert(error);
                          });
                  } else {
                      // userwarn("Choose File");
                  }
              };

  const [EquipmentsList,setEquipmentsList] = useState([]);
  const [FurnitureList,setFurnitureList] = useState([]);
  const [InstrumentsList,setInstrumentsList] = useState([]);
  const [ConsumablesList,setConsumablesList] = useState([]);

console.log(EquipmentsList,'EquipmentsList')

  const [ConsumableDatas,setConsumableDatas] = useState({

    ConsumableName: "",
    Stock:"",
    Remarks : "",
    ExpiryDate: "",
    NSCId: "",
    NurseStationid: userRecord?.NurseStationid || ""    

  })

      const [SelectedFileConsumable, setSelectedFileConsumable] = useState(null);
      const [getdataConsumable, setgetdataConsumable] = useState(false);

      const handleFileChangeConsumable = (event) => {
                    setSelectedFileConsumable(null);
                    setSelectedFileConsumable(event.target.files[0]);
            }; 
      const handleCsvuploadConsumable = () => {
                  console.log(SelectedFileConsumable,'SelectedFileConsumable');
                  const formData = new FormData();
                  formData.append("file", SelectedFileConsumable);
                  formData.append("created_by", userRecord?.username);
          
                  if (SelectedFileConsumable) {
                      axios
                          .post(`${UrlLink}Masters/upload_nsconsumables_excel`, formData, {
                              headers: { "Content-Type": "multipart/form-data" },
                          })
                          .then((response) => {
                              console.log(response);
                              setSelectedFileConsumable(null);
          
                              let data = response.data;
          
                              let type = Object.keys(data)[0]
                              let mess = Object.values(data)[0]
                              const tdata = {
                                  message: mess,
                                  type: type
                              }
                              dispatchvalue({ type: 'toast', value: tdata })
                              setIsConsumableDatas(prev => !prev)
                          })
                          .catch((error) => {
                              console.log(error);
                              alert(error);
                          });
                  } else {
                      // userwarn("Choose File");
                  }
              };

  const [FurnitureDatas,setFurnitureDatas] = useState({

    FurnituresName: "",
    Stock:"",
    Remarks : "",
    NSFId : "",
    NurseStationid: userRecord?.NurseStationid || ""


  })


        const [SelectedFileFurniture, setSelectedFileFurniture] = useState(null);
      const [getdataFurniture, setgetdataFurniture] = useState(false);

      const handleFileChangeFurniture = (event) => {
                    setSelectedFileFurniture(null);
                    setSelectedFileFurniture(event.target.files[0]);
            }; 
      const handleCsvuploadFurniture = () => {
                  console.log(SelectedFileFurniture,'SelectedFileConsumable');
                  const formData = new FormData();
                  formData.append("file", SelectedFileFurniture);
                  formData.append("created_by", userRecord?.username);
          
                  if (SelectedFileFurniture) {
                      axios
                          .post(`${UrlLink}Masters/upload_nsfurniture_excel`, formData, {
                              headers: { "Content-Type": "multipart/form-data" },
                          })
                          .then((response) => {
                              console.log(response);
                              setSelectedFileFurniture(null);
          
                              let data = response.data;
          
                              let type = Object.keys(data)[0]
                              let mess = Object.values(data)[0]
                              const tdata = {
                                  message: mess,
                                  type: type
                              }
                              dispatchvalue({ type: 'toast', value: tdata })
                              setIsFurnitureDatas(prev => !prev)
                          })
                          .catch((error) => {
                              console.log(error);
                              alert(error);
                          });
                  } else {
                      // userwarn("Choose File");
                  }
              };

  const [InstrumentDatas,setInstrumentDatas] = useState({

    InstrumentName: "",
    Stock:"",
    Remarks : "",
    NSIId : "",
    NurseStationid: userRecord?.NurseStationid || ""


  })

        const [SelectedFileInstrument, setSelectedFileInstrument] = useState(null);
      const [getdataInstrument, setgetdataInstrument] = useState(false);

      const handleFileChangeInstrument = (event) => {
        console.log(event,'SelectedFileInstrument')
        console.log(event.target.files[0],'SelectedFileInstrument')
                    setSelectedFileInstrument(null);
                    setSelectedFileInstrument(event.target.files[0]);
            }; 
      const handleCsvuploadInstrument = () => {
                  console.log(SelectedFileInstrument,'SelectedFileInstrument');
                  const formData = new FormData();
                  formData.append("file", SelectedFileInstrument);
                  formData.append("created_by", userRecord?.username);
          
                  if (SelectedFileInstrument) {
                      axios
                          .post(`${UrlLink}Masters/upload_nsinstruments_excel`, formData, {
                              headers: { "Content-Type": "multipart/form-data" },
                          })
                          .then((response) => {
                              console.log(response);
                              setSelectedFileInstrument(null);
          
                              let data = response.data;
          
                              let type = Object.keys(data)[0]
                              let mess = Object.values(data)[0]
                              const tdata = {
                                  message: mess,
                                  type: type
                              }
                              dispatchvalue({ type: 'toast', value: tdata })
                              setIsInstrumentsDatas(prev => !prev)
                          })
                          .catch((error) => {
                              console.log(error);
                              alert(error);
                          });
                  } else {
                      // userwarn("Choose File");
                  }
              };


  const HandleEquipchange = (e) => {

    const { name, value } = e.target;

    setEquipmentDatas((prev)=>({
        ...prev,
        [name]:value.toUpperCase()
    }))

  }

  const HandleInstrumentchange = (e) => {

    const { name, value } = e.target;

    setInstrumentDatas((prev)=>({
        ...prev,
        [name]:value.toUpperCase()
    }))

  }

  const HandleFurniturechange = (e) => {

    const { name, value } = e.target;

    console.log(name,'name',value,'value');

    setFurnitureDatas((prev)=>({
        ...prev,
        [name]:value.toUpperCase()
    }))

  }

    const HandleConsumablechange = (e) => {

    const { name, value } = e.target;

    setConsumableDatas((prev)=>({
        ...prev,
        [name]:value.toUpperCase()
    }))

  }

  const HandleSaveEquipment = () => {

    const payload = {
        ...EquipmentDatas,
        createdby:userRecord?.username
    }

    console.log(payload,'payload')

    axios.post(`${UrlLink}Masters/NurseStation_Equipment_Link`, payload)
                .then((res) => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];
                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
                    setIsEquipmentDatas((prev) => !prev);

                    setEquipmentDatas((prev)=>({
                        ...prev,
                        NSEId : "",
                        EquipmentsName: "",
                        Stock:"",
                        Remarks : "",
                    }))
                    
                })
                .catch((err) => {
                    console.log(err);
                    dispatchvalue({
                        type: 'toast',
                        value: { message: 'An error occurred while saving the discount.', type: 'error' },
                    });
                });






  }

  const HandleSaveInstrument = () => {

    const payload = {
        ...InstrumentDatas,
        createdby:userRecord?.username
    }

    console.log(payload,'payload')

    axios.post(`${UrlLink}Masters/NurseStation_Instrument_Link`, payload)
                .then((res) => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];
                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
                    setIsInstrumentsDatas((prev) => !prev);

                    setInstrumentDatas((prev)=>({
                        ...prev,
                        NSIId : "",
                        InstrumentName: "",
                        Stock:"",
                        Remarks : "",
                    }))
                    
                })
                .catch((err) => {
                    console.log(err);
                    dispatchvalue({
                        type: 'toast',
                        value: { message: 'An error occurred while saving the discount.', type: 'error' },
                    });
                });

  }

  const HandleSaveFurniture = () => {

    const payload = {
        ...FurnitureDatas,
        createdby:userRecord?.username
    }

    console.log(payload,'payload')

    axios.post(`${UrlLink}Masters/NurseStation_Furniture_Link`, payload)
                .then((res) => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];
                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
                    setIsFurnitureDatas((prev) => !prev);

                    setFurnitureDatas((prev)=>({
                        ...prev,
                        NSFId : "",
                        FurnituresName: "",
                        Stock:"",
                        Remarks : "",
                    }))
                    
                })
                .catch((err) => {
                    console.log(err);
                    dispatchvalue({
                        type: 'toast',
                        value: { message: 'An error occurred while saving the discount.', type: 'error' },
                    });
                });

  }

  const HandleSaveConsumable = () => {

    const payload = {
        ...ConsumableDatas,
        createdby:userRecord?.username
    }

    console.log(payload,'payload')

    axios.post(`${UrlLink}Masters/NurseStation_Consumable_Link`, payload)
                .then((res) => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];
                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
                    setIsConsumableDatas((prev) => !prev);

                    setConsumableDatas((prev)=>({
                        ...prev,
                        NSCId : "",
                        ConsumableName: "",
                        Stock:"",
                        Remarks : "",
                        ExpiryDate : "",
                        
                    }))
                    
                })
                .catch((err) => {
                    console.log(err);
                    dispatchvalue({
                        type: 'toast',
                        value: { message: 'An error occurred while saving the discount.', type: 'error' },
                    });
                });

  }


  const handleFEdit = (params) => {

    setFurnitureDatas({
        NSFId:params?.NSFId,
        FurnituresName : params?.FurnitureName,
        Stock : params?.Stock,
        Remarks : params?.Remarks,
        NurseStationid: userRecord?.NurseStationid
      })

  }

    const handleIEdit = (params) => {

      setInstrumentDatas({
        NSIId:params?.NSIId,
        InstrumentName : params?.InstrumentName,
        Stock : params?.Stock,
        Remarks : params?.Remarks,
        NurseStationid: userRecord?.NurseStationid
      })


    
  }

    const handleEEdit = (params) => {

      setEquipmentDatas({
        NSEId:params?.NSEId,
        EquipmentsName : params?.EquipmentsName,
        Stock : params?.Stock,
        Remarks : params?.Remarks,
        NurseStationid: userRecord?.NurseStationid
      })
    
  }

  const handleCEdit = (params) => {

      setConsumableDatas({
        NSCId:params?.NSCId,
        ConsumableName : params?.ConsumablesName,
        Stock : params?.Stock,
        Remarks : params?.Remarks,
        ExpiryDate : params?.ExpiryDate,
        NurseStationid: userRecord?.NurseStationid
      })
    
  }

  const [isEquipmentDatas, setIsEquipmentDatas] = useState(false);
  const [isFurnitureDatas, setIsFurnitureDatas] = useState(false);
  const [isInstrumentsDatas, setIsInstrumentsDatas] = useState(false);
  const [isConsumableDatas, setIsConsumableDatas] = useState(false);
  const [isPharmacyDatas, setIsPharmacyDatas] = useState(false);


      useEffect(() => {
          axios.get(`${UrlLink}Masters/NurseStation_Equipment_Link?NurseStationid=${EquipmentDatas?.NurseStationid}`)
              .then((res) => {
                  if (Array.isArray(res.data)) {
                      setEquipmentsList(res.data);
                  }
              })
              .catch((err) => console.log(err));
      }, [UrlLink, isEquipmentDatas,EquipmentDatas?.NurseStationid]);

      useEffect(() => {
          axios.get(`${UrlLink}Masters/NurseStation_Furniture_Link?NurseStationid=${FurnitureDatas?.NurseStationid}`)
              .then((res) => {
                  if (Array.isArray(res.data)) {
                      setFurnitureList(res.data);
                  }
              })
              .catch((err) => console.log(err));
      }, [UrlLink, isFurnitureDatas,FurnitureDatas?.NurseStationid]);

            useEffect(() => {
          axios.get(`${UrlLink}Masters/NurseStation_Instrument_Link?NurseStationid=${InstrumentDatas?.NurseStationid}`)
              .then((res) => {
                  if (Array.isArray(res.data)) {
                      setInstrumentsList(res.data);
                  }
              })
              .catch((err) => console.log(err));
      }, [UrlLink, isInstrumentsDatas,InstrumentDatas?.NurseStationid]);

     useEffect(() => {
          axios.get(`${UrlLink}Masters/NurseStation_Consumable_Link?NurseStationid=${ConsumableDatas?.NurseStationid}`)
              .then((res) => {
                  if (Array.isArray(res.data)) {
                      setConsumablesList(res.data);
                  }
              })
              .catch((err) => console.log(err));
      }, [UrlLink, isConsumableDatas,ConsumableDatas?.NurseStationid]);

       const EquipmentColumns = [
    {
      key: "Sno",
      name: "Sno",
    },
    {
      key: "EquipmentsName",
      name: "Equipment Name",
    },
    {
      key: "Stock",
      name: "Stock",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={()=> handleEEdit(params.row)}>
            <EditIcon />
        </Button>
      )
    },

  ];

         const InstrumentColumns = [
    {
      key: "Sno",
      name: "Sno",
    },
    {
      key: "InstrumentName",
      name: "Instrument Name",
    },
    {
      key: "Stock",
      name: "Stock",
    },
            {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={()=> handleIEdit(params.row)}>
            <EditIcon />
        </Button>
      )
    },

  ];

         const FurnitureColumns = [
    {
      key: "Sno",
      name: "Sno",
    },
    {
      key: "FurnitureName",
      name: "Furniture Name",
    },
    {
      key: "Stock",
      name: "Stock",
    },
        {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={()=> handleFEdit(params.row)}>
            <EditIcon />
        </Button>
      )
    },

  ];

       const ConsumableColumns = [
    {
      key: "Sno",
      name: "Sno",
    },
    {
      key: "ConsumablesName",
      name: "Consumable Name",
    },
    {
      key: "ExpiryDate",
      name: "Expiry Date",
    },
    {
      key: "Stock",
      name: "Stock",
    },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={()=> handleCEdit(params.row)}>
            <EditIcon />
        </Button>
      )
    },

  ];

  

   const [searchQuery, setsearchQuery] = useState({
      NurseStation: userRecord?.NurseStationid || "",
      Location: "",
      ItemCode: "",
      ItemName: "",
      ProductCategory: "",
      SubCategory: "",
    });

        const [NSItems,setNSItems] = useState([]);
        const [NurseStationData, setNurseStationData] = useState([]);

          const [summaArray1, setsummaArray1] = useState([]);
          const [summaArray2, setsummaArray2] = useState([]);
          const [summaArray3, setsummaArray3] = useState([]);
          const [summaArray4, setsummaArray4] = useState([]);
          const [summaArray5, setsummaArray5] = useState([]);
          const [NurseStockData, setNurseStockData] = useState([]);
          const [filteredData, setFilteredData] = useState([]);
        
        

    const handleonchange = (e) => {
    const { name, value } = e.target;
    if (name === "ProductCategory") {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
        SubCategory: "",
      }));
    } else if (name === "Location") {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
      }));
    }else if (name === "NurseStation") {
      setsearchQuery((prev) => ({
        ...prev,
        [name]: value,
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
        .get(`${UrlLink}Masters/NurseStationData`)
        .then((hash) => {
          setNurseStationData(hash.data);
        })
        .catch((err) => {
          console.log(err);
        });
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
        axios
          .get(`${UrlLink}NurseStation/get_stockDetails_for_nursestation`, { params: searchQuery })
          .then((response) => {
            const dataWithState = response.data.map((item) => ({
              ...item,
              checked: false, // Initial state for checkbox
              remarks: "", // Initial state for remarks
            }));
            setNurseStockData(dataWithState);
            setFilteredData(dataWithState);
           const items = response.data.map((item) => ({
              ItemName: item.ItemName,
              ItemCode: item.ItemCode
            }));
    
            setNSItems(items)
    
    
          })
          .catch((err) => console.log(err));
      }, [UrlLink, searchQuery,isPharmacyDatas]);

    const NursestationColumns = [
    { key: "Sno", name: "S.No", frozen: true },
    {
      key: "ItemName",
      name: "Item Name",
      filter: true,
      type: "input-text",
      frozen: true,
    },
    {
      key: "ProductCategory",
      name: "Product Category",
      filter: true,
      frozen: true,
    },
    { key: "SubCategory", name: "Sub Category", frozen: true },
    { key: "GenericName", name: "Generic Name", frozen: true },
    { key: "Batch_No", name: "Batch No ", frozen: true },
    { key: "Expiry_Date", name: "Expiry Date", frozen: true },
    { key: "AvailableQuantity", name: "Available Quantity", frozen: true },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={()=> handlePEdit(params.row)}>
            <EditIcon />
        </Button>
      )
    },

    // {
    //   key: "Checklist",
    //   name: "Checklist",
    //   renderCell: ({ row }) => (
    //     <FormControlLabel
    //       control={
    //         <Checkbox
    //           checked={row.checked}
    //           onChange={() => handleCheckboxChange(row.id)}
    //         />
    //       }
    //       label="Checked"
    //     />
    //   ),
    //   frozen: true,
    // },
    // {
    //   key: "Remarks",
    //   name: "Remarks",
    //   renderCell: ({ row }) => (
    //     <TextField
    //       variant="outlined"
    //       size="small"
    //       fullWidth
    //       value={row.remarks}
    //       onChange={(event) => handleRemarksChange(row.id, event)}
    //     />
    //   ),
    //   frozen: true,
    // },
  ];

  const [PharmacyData,setPharmacyData] = useState({

    Stockid : '',
    ItemCode : '',
    Batch_No : '',
    Expiry_Date :'',
    AvailableQuantity : '',
    IssuedQuantity : '',
    ReplacedQuantity : '',
    ItemName : '',
    NurseStationid: userRecord?.NurseStationid || searchQuery.NurseStation || ""    


  })

  const [paramssearch,setparamssearch] =useState({

        NurseStationid : userRecord?.NurseStationid || "",
        Stockid : '',
        ItemCode : ''

  }) 

  const [stocksummary,setstocksummary] = useState([]);

  const handlePEdit = (params) => {

    setPharmacyData((prev)=>({
        ...prev,
        Stockid : params?.Stockid,
        ItemCode : params?.ItemCode,
        Batch_No : params?.Batch_No,
        Expiry_Date : params?.Expiry_Date,
        AvailableQuantity : params?.AvailableQuantity,
        ItemName : params?.ItemName,
        NurseStationid: userRecord?.NurseStationid || searchQuery.NurseStation   


    }));

    setparamssearch({

        NurseStationid : userRecord?.NurseStationid || PharmacyData?.NurseStationid || searchQuery.NurseStation,
        Stockid :  params?.Stockid,
        ItemCode : params?.ItemCode
        
    })

        
  }

  const HandlePharmacychange = (e) => {

    const {value,name} = e.target;

    setPharmacyData((prev)=>({
        ...prev,
        [name]:value
    }))

  }

  const HandleSavePharmacy = () => {
    if (!PharmacyData?.IssuedQuantity && !PharmacyData?.ReplacedQuantity) {
        dispatchvalue({
            type: 'toast',
            value: { message: 'You have to enter IssuedQuantity or ReplacedQuantity', type: 'warn' },
        });
        return;
    }

    const payload = {
        ...PharmacyData,
        createdby: userRecord?.username
    };

    console.log(payload, 'payload');

    axios.post(`${UrlLink}Masters/NurseStation_Pharmacy_Link`, payload)
        .then((res) => {
            const response = res.data;
            const messageType = Object.keys(response)[0];
            const messageContent = Object.values(response)[0];

            dispatchvalue({
                type: 'toast',
                value: { message: messageContent, type: messageType },
            });

            setIsPharmacyDatas((prev) => !prev);

            setPharmacyData((prev) => ({
                ...prev,
                Stockid: '',
                ItemCode: '',
                Batch_No: '',
                Expiry_Date: '',
                AvailableQuantity: '',
                IssuedQuantity: '',
                ReplacedQuantity: '',
                ItemName: '',
            }));
        })
        .catch((err) => {
            console.log(err);
            dispatchvalue({
                type: 'toast',
                value: { message: 'An error occurred while saving the pharmacy data.', type: 'error' },
            });
        });
};

const PharmacyStockColumns = [
  { key: "Sno", name: "S.No", frozen: true },
  {
    key: "ItemName",
    name: "Item Name",
  },
  { key: "Batch_No", name: "Batch No ", frozen: true },
  { key: "Expiry_Date", name: "Expiry Date", frozen: true },
  { key: "AvailableQuantity", name: "Available Quantity", frozen: true },
  { key: "IssuedQuantity", name: "Issued Quantity", frozen: true },
  { key: "ReplacedQuantity", name: "Replaced Quantity", frozen: true },
  { key: "FinalQuantity", name: "Final Quantity", frozen: true },

  {
    key: "issued_by",
    name: "Issued By",
    renderCell: (params) => {
      return params.row.IssuedQuantity == 0 ? "" : params.row.issued_by;
    },
  },
  {
    key: "Replaced_by",
    name: "Replaced by",
    renderCell: (params) => {
      return params.row.ReplacedQuantity == 0 ? "" : params.row.issued_by;
    },
  },
];






useEffect(() => {

    
        axios
          .get(`${UrlLink}NurseStation/get_stocksummary_for_product`, { params: paramssearch })
          .then((response) => {
           
            if (Array.isArray(response.data)) {
            setstocksummary(response.data);
            } else {
            console.warn("Expected an array but got:", response.data);
            setstocksummary([]); 
            }

          })
          .catch((err) => console.log(err));
      }, [paramssearch,isPharmacyDatas]);


    

  return (
    <div className="Main_container_app">
            <h3>NurseStation Name: {userRecord?.NsName}</h3> 
            <div className="RegisterTypecon">
                <div className="RegisterType">
                    {["Equipment","Instrument","Consumable","Furniture","Pharmacy"].map((p, ind) => (
                    <div className="registertypeval" key={ind + 'key'}>
                        <input
                        type="radio"
                        id={p}
                        name="view_type"
                        checked={viewType === p}
                        onChange={() => setViewType(p)}
                        value={p}
                        />
                        <label htmlFor={p}>
                        {p}
                        </label>
                    </div>
                    ))}
                </div>
                </div>
            <br />


            <div className="search_div_bar" style={{ width: '100%' }}>

                    {viewType === "Equipment" && (
                        <>

                        <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
                       
                       <div className="RegisForm_1">
                          <label>Nursestation Name<span>:</span></label>

                             <select
                                name='NurseStationid'
                                value={EquipmentDatas.NurseStationid}
                                onChange={HandleEquipchange}
                                
                            >
                                <option value="">Select</option>
                             
                                {NurseStationData.map((ele, indx) => (
                                    <option value={ele.NurseStationid} key={indx + "key"}>
                                    {ele.NurseStationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="RegisForm_1">
                          <label>Equipment Name<span>:</span></label>
                          <input
                            type='text'
                            name='EquipmentsName'
                            value={EquipmentDatas.EquipmentsName}
                            onChange={HandleEquipchange}

                            />
                        </div>

                        <div className="RegisForm_1">
                          <label>Stock<span>:</span></label>
                          <input
                            type='text'
                            name='Stock'
                            value={EquipmentDatas.Stock}
                            onChange={HandleEquipchange}
                            />
                        </div>

                        <br></br>


                      </div>
 
                         <div className="RegisFormcon extend_textarea_new">
                             <div className="RegisForm_1 extend_textarea_new"

        >
                                <label>Remarks<span>:</span></label>
                                <textarea
                                
                                name='Remarks'
                                value={EquipmentDatas.Remarks}
                                onChange={HandleEquipchange}
                                />
                            </div>

                        </div>

                         <div style={{ display: "flex", alignItems: "center", }}>
                              <label>
                                  {" "}
                                  NS Equipment Master Excel File<span>:</span>{" "}
                              </label>
                              <input
                                  type="file"
                                  accept=".xlsx, .xls, .csv"
                                  id="Equipmentchoose"
                                  required
                                  style={{ display: "none" }}
                                  onChange={handleFileChangeEquipment}
                              />
                                            
                              <label
                                  htmlFor="Equipmentchoose"
                                  title='Choose File'
                                  className="RegisterForm_1_btns choose_file_update"
                              >
                                  <PhotoCameraBackIcon />
                              </label>
                              <button
                                  className="RegisterForm_1_btns choose_file_update"
                                  onClick={handleCsvuploadEquipment}
                                  title='File Upload'
                              >
          
                                  <DriveFolderUploadIcon />
          
                              </button>
                          </div>

                        <div className="Main_container_Btn">
                            <button onClick={HandleSaveEquipment}> {EquipmentDatas.NSEId? 'Update' : 'Save'}
                            </button>
                        </div>

                    <ReactGrid columns={EquipmentColumns} RowData={EquipmentsList} />




                        </>

                    )
                    }

                    {viewType === "Instrument" && (
                        <>

                        <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
                       

                       <div className="RegisForm_1">
                          <label>Nursestation Name<span>:</span></label>

                             <select
                                name='NurseStationid'
                                value={InstrumentDatas.NurseStationid}
                                onChange={HandleInstrumentchange}
                                
                            >
                                <option value="">Select</option>
                             
                                {NurseStationData.map((ele, indx) => (
                                    <option value={ele.NurseStationid} key={indx + "key"}>
                                    {ele.NurseStationName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="RegisForm_1">
                          <label>Instrument Name<span>:</span></label>
                          <input
                            type='text'
                            name='InstrumentName'
                            value={InstrumentDatas.InstrumentName}
                            onChange={HandleInstrumentchange}

                            />
                        </div>

                        <div className="RegisForm_1">
                          <label>Stock<span>:</span></label>
                          <input
                            type='text'
                            name='Stock'
                            value={InstrumentDatas.Stock}
                            onChange={HandleInstrumentchange}
                            />
                        </div>

                        <br></br>

                      </div>
 
                         <div className="RegisFormcon extend_textarea_new">
                             <div className="RegisForm_1 extend_textarea_new"

        >
                                <label>Remarks<span>:</span></label>
                                <textarea
                                
                                name='Remarks'
                                value={InstrumentDatas.Remarks}
                                onChange={HandleInstrumentchange}
                                />
                            </div>

                        </div>

                         <div style={{ display: "flex", alignItems: "center", }}>
                              <label>
                                  {" "}
                                  NS Instrument Master Excel File<span>:</span>{" "}
                              </label>
                              <input
                                  type="file"
                                  accept=".xlsx, .xls, .csv"
                                  id="Instrumentchoose"
                                  required
                                  style={{ display: "none" }}
                                  onChange={handleFileChangeInstrument}
                              />
                                            
                              <label
                                  htmlFor="Instrumentchoose"
                                  title='Choose File'
                                  className="RegisterForm_1_btns choose_file_update"
                              >
                                  <PhotoCameraBackIcon />
                              </label>
                              <button
                                  className="RegisterForm_1_btns choose_file_update"
                                  onClick={handleCsvuploadInstrument}
                                  title='File Upload'
                              >
          
                                  <DriveFolderUploadIcon />
          
                              </button>
                          </div>

                        <div className="Main_container_Btn">
                            <button onClick={HandleSaveInstrument}>{InstrumentDatas.NSIId? 'Update' : 'Save'}
                            </button>
                        </div>

                        <ReactGrid columns={InstrumentColumns} RowData={InstrumentsList} />




                        </>

                    )
                    }

                    {viewType === "Furniture" && (
                        <>

                        <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
                       
                       <div className="RegisForm_1">
                          <label>Nursestation Name<span>:</span></label>

                             <select
                                name='NurseStationid'
                                value={FurnitureDatas.NurseStationid}
                                onChange={HandleFurniturechange}
                               
                            >
                                <option value="">Select</option>
                             
                                {NurseStationData.map((ele, indx) => (
                                    <option value={ele.NurseStationid} key={indx + "key"}>
                                    {ele.NurseStationName}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="RegisForm_1">
                          <label>Furniture Name<span>:</span></label>
                          <input
                            type='text'
                            name='FurnituresName'
                            value={FurnitureDatas.FurnituresName}
                            onChange={HandleFurniturechange}

                            />
                        </div>

                        <div className="RegisForm_1">
                          <label>Stock<span>:</span></label>
                          <input
                            type='text'
                            name='Stock'
                            value={FurnitureDatas.Stock}
                            onChange={HandleFurniturechange}
                            />
                        </div>

                        <br></br>

                      </div>
 
                         <div className="RegisFormcon extend_textarea_new">
                             <div className="RegisForm_1 extend_textarea_new"

        >
                                <label>Remarks<span>:</span></label>
                                <textarea
                                
                                name='Remarks'
                                value={FurnitureDatas.Remarks}
                                onChange={HandleFurniturechange}
                                />
                            </div>

                        </div>

                         <div style={{ display: "flex", alignItems: "center", }}>
                              <label>
                                  {" "}
                                  NS Furniture Master Excel File<span>:</span>{" "}
                              </label>
                              <input
                                  type="file"
                                  accept=".xlsx, .xls, .csv"
                                  id="Furniturechoose"
                                  required
                                  style={{ display: "none" }}
                                  onChange={handleFileChangeFurniture}
                              />
                                            
                              <label
                                  htmlFor="Furniturechoose"
                                  title='Choose File'
                                  className="RegisterForm_1_btns choose_file_update"
                              >
                                  <PhotoCameraBackIcon />
                              </label>
                              <button
                                  className="RegisterForm_1_btns choose_file_update"
                                  onClick={handleCsvuploadFurniture}
                                  title='File Upload'
                              >
          
                                  <DriveFolderUploadIcon />
          
                              </button>
                          </div>

                        <div className="Main_container_Btn">
                            <button onClick={HandleSaveFurniture}>{FurnitureDatas.NSFId? 'Update' : 'Save'}
                            </button>
                        </div>

                    <ReactGrid columns={FurnitureColumns} RowData={FurnitureList} />
                        



                        </>

                    )
                    }

                    {viewType === "Consumable" && (
                        <>

                        <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>

                        <div className="RegisForm_1">
                          <label>Nursestation Name<span>:</span></label>

                             <select
                                name='NurseStationid'
                                value={ConsumableDatas.NurseStationid}
                                onChange={HandleConsumablechange}
                                
                            >
                                <option value="">Select</option>
                             
                                {NurseStationData.map((ele, indx) => (
                                    <option value={ele.NurseStationid} key={indx + "key"}>
                                    {ele.NurseStationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                       
                        <div className="RegisForm_1">
                          <label>Consumable Name<span>:</span></label>
                          <input
                            type='text'
                            name='ConsumableName'
                            value={ConsumableDatas.ConsumableName}
                            onChange={HandleConsumablechange}

                            />
                        </div>

                        <div className="RegisForm_1">
                          <label>Stock<span>:</span></label>
                          <input
                            type='text'
                            name='Stock'
                            value={ConsumableDatas.Stock}
                            onChange={HandleConsumablechange}
                            />
                        </div>
                      
                        <div className="RegisForm_1">
                          <label>Expiry Date<span>:</span></label>
                          <input
                            type='date'
                            name='ExpiryDate'
                            value={ConsumableDatas.ExpiryDate}
                            onChange={HandleConsumablechange}
                            />
                        </div>

                        <br></br>

                      </div>
 
                         <div className="RegisFormcon extend_textarea_new">
                             <div className="RegisForm_1 extend_textarea_new"

        >
                                <label>Remarks<span>:</span></label>
                                <textarea
                                
                                name='Remarks'
                                value={ConsumableDatas.Remarks}
                                onChange={HandleConsumablechange}
                                />
                            </div>

                        </div>

                         <div style={{ display: "flex", alignItems: "center", }}>
                              <label>
                                  {" "}
                                  NS Consumable Master Excel File<span>:</span>{" "}
                              </label>
                              <input
                                  type="file"
                                  accept=".xlsx, .xls, .csv"
                                  id="Consumablechoose"
                                  required
                                  style={{ display: "none" }}
                                  onChange={handleFileChangeConsumable}
                              />
                                            
                              <label
                                  htmlFor="Consumablechoose"
                                  title='Choose File'
                                  className="RegisterForm_1_btns choose_file_update"
                              >
                                  <PhotoCameraBackIcon />
                              </label>
                              <button
                                  className="RegisterForm_1_btns choose_file_update"
                                  onClick={handleCsvuploadConsumable}
                                  title='File Upload'
                              >
          
                                  <DriveFolderUploadIcon />
          
                              </button>
                          </div>

                        <div className="Main_container_Btn">
                            <button onClick={HandleSaveConsumable}>{ConsumableDatas.NSCId? 'Update' : 'Save'}
                            </button>
                        </div>

                    <ReactGrid columns={ConsumableColumns} RowData={ConsumablesList} />
                        



                        </>

                    )
                    }

                    {
                        viewType === "Pharmacy" && (
                            <>
                            <div className="RegisFormcon_1">
                                    {Object.keys(searchQuery).map((field, indx) => (
                                      <div className="RegisForm_1" key={indx}>
                                        <label>
                                          {formatunderscoreLabel(field)}
                                          <span>:</span>
                                        </label>
                                        {[
                                          "NurseStation",
                                          "Location",
                                          "ProductCategory",
                                          "SubCategory",
                                        ].includes(field) ? (
                                          <select
                                            name={field}
                                            value={searchQuery[field]}
                                            onChange={handleonchange}
                                            disabled={
                                              field === "SubCategory" ? !searchQuery.ProductCategory : false
                                            }
                                          >
                                            <option value="">Select</option>
                            
                                            {field === "NurseStation" &&
                                              NurseStationData.map((ele, indx) => (
                                                <option value={ele.NurseStationid} key={indx + "key"}>
                                                  {ele.NurseStationName}
                                                </option>
                                              ))}
                                            {field === "Location" &&
                                              summaArray1.map((ele, ind) => (
                                                <option key={ind + "key"} value={ele.id}>
                                                  {ele.locationName}
                                                </option>
                                              ))}
                                            {console.log(summaArray3)}
                                            {field === "ProductCategory" &&
                                              summaArray3.map((ele, ind) => (
                                                <option key={ind + "key"} value={ele.id}>
                                                  {ele.ProductCategory}
                                                </option>
                                              ))}
                                            {field === "SubCategory" &&
                                              summaArray4.map((ele, ind) => (
                                                <option key={ind + "key"} value={ele.id}>
                                                  {ele.SubCategoryName}
                                                </option>
                                              ))}
                                          </select>
                                        ) : field === "ItemName" ? (
                                            <>
                                              <input
                                                type="text"
                                                list="item-names"
                                                name="ItemName"
                                                value={searchQuery[field]}
                                                onChange={handleonchange}
                                              />
                                              <datalist id="item-names">
                                                {NSItems.map((item, idx) => (
                                                  <option key={idx} value={item.ItemName} />
                                                ))}
                                              </datalist>
                                            </>
                                          ) : (
                                          <input
                                            type="text"
                                            name={field}
                                            value={searchQuery[field]}
                                            onChange={handleonchange}
                                          />
                                        )}
                                      </div>
                                    ))}
                            </div>
                                  <ReactGrid columns={NursestationColumns} RowData={filteredData} />

                             <br />

                            <div className="RegisFormcon_1" style={{ marginTop: '10px' }}>
                       
                     
                        <div className="RegisForm_1">
                          <label>Item Name<span>:</span></label>
                          <input
                            type='text'
                            name='ItemName'
                            value={PharmacyData.ItemName}
                            onChange={HandlePharmacychange}
                            disabled


                            />
                        </div>

                        <div className="RegisForm_1">
                          <label>Batch_No<span>:</span></label>
                          <input
                            type='text'
                            name='Batch_No'
                            value={PharmacyData.Batch_No}
                            onChange={HandlePharmacychange}
                            disabled
                            />
                        </div>


                    <div className="RegisForm_1">
                          <label>Expiry_Date<span>:</span></label>
                          <input
                            type='date'
                            name='Expiry_Date'
                            value={PharmacyData.Expiry_Date}
                            onChange={HandlePharmacychange}
                            disabled
                            />
                        </div>

                        <div className="RegisForm_1">
                          <label>AvailableQuantity<span>:</span></label>
                          <input
                            type='text'
                            name='AvailableQuantity'
                            value={PharmacyData.AvailableQuantity}
                            onChange={HandlePharmacychange}
                            />
                        </div>

                        <div className="RegisForm_1">
                          <label>IssuedQuantity<span>:</span></label>
                          <input
                            type='text'
                            name='IssuedQuantity'
                            value={PharmacyData.IssuedQuantity}
                            onChange={HandlePharmacychange}
                            />
                        </div>

                        <div className="RegisForm_1">
                          <label>ReplacedQuantity<span>:</span></label>
                          <input
                            type='text'
                            name='ReplacedQuantity'
                            value={PharmacyData.ReplacedQuantity}
                            onChange={HandlePharmacychange}
                            />
                        </div>

                        <div className="Main_container_Btn">
                            <button onClick={HandleSavePharmacy}>Save
                            </button>
                        </div>

                        <br></br>


                      </div>

                        <ReactGrid columns={PharmacyStockColumns} RowData={stocksummary} />


                            </>

                                  
                        )
                    }

                    
                      
            
                      <br />
                    
            </div>
    
    
    
             <ToastAlert Message={toast.message} Type={toast.type} />
         
        </div>
  )
}

export default NSAssets
