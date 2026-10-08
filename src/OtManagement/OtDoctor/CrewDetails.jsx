import React, { useState, useEffect } from "react";
import "./CrewDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { Button, Checkbox, styled, Tab, Tabs } from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OTGoogleStyleCalendar from "../OTCalendar/OTGoogleStyleCalendar";
import OTCrewCalendar from "../OTCalendar/OTCrewCalendar";



function CrewDetails(props) {

    console.log(props.SpecializationData);

  const userRecord = useSelector(state => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const toast = useSelector((state) => state.userRecord?.toast);
  const isSidebarOpen = useSelector((state) => state.userRecord?.SidebarToggle);

  const specializationData = useSelector((state) => state.SpecializationData);
  const location = useLocation();
  const { confirmData } = location.state || {};
  const { params } = location.state || {};

  console.log('Received params:', params);

  const OTPatientdata = useSelector((state) => state.Frontoffice?.OTPatientdata);
  console.log(OTPatientdata,'OTPatientdata')

  const [RegistrationId,setRegistrationId] = useState(OTPatientdata?.RegistrationId);
  const [BookingType,setBookingType] = useState(OTPatientdata?.BookingType);

  
  const handleCalenderView = () => {
    navigate("/Home/OT_Calender");
  };

  // Log the specialization data whenever it changes
  useEffect(() => {
    console.log("Specialization Data from Redux:", specializationData);
  }, [specializationData]); // Dependency array ensures it logs when the data change
  // Local state for selected specialization

  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [Surgeondata,setSurgeonData] = useState([]);
  const [AssistSurgeondata,setAssistSurgeonData] = useState([]);
  const [Anaesthesiologistdata,setAnaesthesiologistData] = useState([]);
  const [scrubNursedata,setscrubNurseData] = useState([]);
  const [CirculatingNursedata,setCirculatingNurseData] = useState([]);
  const [Techniciandata,setTechnicianData] = useState([]);
  const [Helperdata,setHelperData] = useState([]); 
  const [Crewdata,setCrewdata] = useState([]);
  const [load,setload] = useState([]);
  const [otconsignment,setotconsignment] = useState([]);
  const [otequipment,setotequipment] = useState([]);

  console.log(Crewdata,'Crewdata');

  const handleChangeu = (e) => {
    setSelectedSpecialization(e.target.value);
  };

  const CustomTab = styled(Tab)(({ theme }) => ({
    color: "grey", // Default color for unselected tabs
    "&.Mui-selected": {
      color: "black", // Selected tab color
    },
  }));

  const [specialization, setSpecialization] = useState("");
  //   const [selectedSpecialization, setSelectedSpecialization] = useState('');

  const [activeTab, setActiveTab] = useState("Surgical_Team");
  const [isToggled, setIsToggled] = useState(false);
   const [modalContent, setModalContent] = useState("");
   const [modalIsOpen, setModalIsOpen] = useState(false);
     const [openModal2, setOpenModal2] = useState(false);
  const toggle = () => setIsToggled(!isToggled);
  const closeToggle = () => {
    setIsToggled(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeToggle();
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
    setOpenModal2(true);
  };

  // State for Surgical Team
  const [formData, setFormData] = useState({
    surgeon: '',
    surgeonname: '',
    assistantSurgeon: '',
    assistantSurgeonname:'',
    anaesthesiologist: '',
    anaesthesiologistname:'',
    scrubNurse: '',
    scrubNursename:'',
    technician: '',
    technicianname:'',
    circulatingNurse: '',
    circulatingNursename:'',
    others: '',
    othersname:''
  });
  console.log(formData);

  const [entries, setEntries] = useState({
    id : '',
    surgeon: [],
    surgeonname:[],
    assistantSurgeon: [],
    assistantSurgeonname:[],
    anaesthesiologist: [],
    anaesthesiologistname:[],
    scrubNurse: [],
    scrubNursename:[],
    technician: [],
    technicianname:[],
    circulatingNurse: [],
    circulatingNursename:[],
    othersname:[],
    others: [],
  });

  console.log(entries);

  const [consumabledata,setConsumabledata] = useState({
    fromstorename : '',
    fromstoreid : '',
    category : '',
    categoryid : '',
    subcategory : '',
    subcategoryid : '',
    tostorename : '',
    tostoreid : '',
    itemname : '',
    itemid : '',
    
  });

  const [otconsumable,setotconsumable] = useState([]);

  console.log(consumabledata);

  // State for Consumable Tab
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productCategories, setProductCategories] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemData,setitemData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [consumableAmount, setConsumableAmount] = useState("");
  const [consumables, setConsumables] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [productSubCategories, setProductSubCategories] = useState([]);
  const [Storename,setStorename] = useState([]);
  const [selectedStorename,setSelectedStorename] = useState("");

  console.log(otequipment,'premkumar');

  // Fetch product categories from master/inventory
  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Inventory/Product_Category_Product_Details_link`
        );
          setProductCategories(response.data);
        
      } catch (error) {
        console.error("Error fetching product categories:", error);
      }
    };

    fetchProductCategories();
  }, [UrlLink]);

  useEffect(() => {
    const fetchProductSubCategories = async () => {
      try {
        const response = await axios.get(
          `${UrlLink}Inventory/Sub_Product_Category_Details_by_Product?ProductCategory=${consumabledata.categoryid}`
        );

        if (response.data) {
          console.log(response.data);
          setProductSubCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching product categories:", error);
      }
    };

    fetchProductSubCategories();
  }, [consumabledata.categoryid]);

  // Fetch product details based on selected category
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (selectedCategory) {
        try {
          const response = await axios.get(
            `Inventory/Sub_Product_Category_Details_by_Product?ProductCategory=${consumabledata.categoryid}`
          ); // endpoint

          console.log(response.data);
          if (response.data) {
            setSelectedProduct(response.data);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };

    fetchProductDetails();
  }, [consumabledata.categoryid]);

  const Theater_booking = () => {
    const Theater_booking = useSelector(
      (state) => state.OtManagement?.Theater_booking
    );
  };
  const [AllergyData, setAllergyData] = useState([]);
  const [ShowAllergyData, setShowAllergyData] = useState(false);

  useEffect(() => {
    const RegistrationId = Theater_booking?.RegistrationId;
    const departmentType = Theater_booking?.RequestType;

    if (RegistrationId) {
      axios
        .get(`${UrlLink}Ip_Workbench/IP_Allergy_Details_Link`, {
          params: {
            RegistrationId: RegistrationId,
            DepartmentType: departmentType,
          },
        })
        .then((res) => {
          setAllergyData(res.data);
          console.log(res.data);
          setShowAllergyData(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, Theater_booking, ShowAllergyData]);

  // State for Consignment Tab
  const [consignmentName, setconsignmentName] = useState("");
  const [quantity1, setQuantity1] = useState("");
  const [amount1, setAmount1] = useState("");
  const [consignmentItems, setConsignmentItems] = useState([]);

  const [equipmentName,setEquipmentName] = useState("");
  const [quantity2, setQuantity2] = useState("");
  const [equipmentItems, setequipmentItems] = useState([]);

  const [isChecked, setIsChecked] = useState(OTPatientdata?.DoctorConfirm ?? false);


  const handleConfirmationChange = (event) => {

    console.log(event.target.checked,'event.target.checked');  
    setIsChecked(event.target.checked);
    console.log("Checkbox Checked:", event.target.checked);

    const data = {
        isChecked : !isChecked,
        Booking_Id : OTPatientdata?.Booking_Id
    }

    console.log(data)

    axios.post(`${UrlLink}OT/Confirmation_by_doctor`, data)
    .then((res) => {
  
      const response = res.data;
                  const messageType = Object.keys(response)[0];
                  const messageContent = Object.values(response)[0];
                  console.log(messageType);
                  console.log(messageContent);
                  dispatchvalue({
                      type: 'toast',
                      value: { message: messageContent, type: messageType },
                  });      
    })
    .catch((err) => console.log(err));

  };

  const handleInputChange = (e, field) => {

    const { name, value } = e.target;

    // const value1 = value.split('-')
    //         const Surgeonid = value1[0];
    //         const Surgeonname = value1[1];
    //         console.log('serrrrrr', value1, Surgeonid, Surgeonname);

    

    if( field == 'surgeon'){
       const value1 = value.split('-')
       const surgeon = value1[0];
       const surgeonname = value1[1];
       setFormData({
        ...formData,
        surgeon : surgeon,
        surgeonname : surgeonname
      });
    }

    else if( field == 'assistantSurgeon'){
      const value1 = value.split('-')
      const assistantSurgeon = value1[0];
      const assistantSurgeonname = value1[1];
      setFormData({
       ...formData,
       assistantSurgeon : assistantSurgeon,
       assistantSurgeonname : assistantSurgeonname
     });
   }

    else if( field == 'anaesthesiologist'){
      const value1 = value.split('-')
      const anaesthesiologist = value1[0];
      const anaesthesiologistname = value1[1];
      setFormData({
      ...formData,
      anaesthesiologist : anaesthesiologist,
      anaesthesiologistname : anaesthesiologistname
    });
   }

  else if( field == 'scrubNurse'){
    const value1 = value.split('-')
    const scrubNurse = value1[0];
    const scrubNursename = value1[1];
    setFormData({
    ...formData,
    scrubNurse : scrubNurse,
    scrubNursename : scrubNursename
      });
    }

    else if( field == 'technician'){
      const value1 = value.split('-')
      const technician = value1[0];
      const technicianname = value1[1];
      setFormData({
      ...formData,
      technician : technician,
      technicianname : technicianname
        });
      }

      else if( field == 'circulatingNurse'){
        const value1 = value.split('-')
        const circulatingNurse = value1[0];
        const circulatingNursename = value1[1];
        setFormData({
        ...formData,
        circulatingNurse : circulatingNurse,
        circulatingNursename : circulatingNursename
          });
        }

        else if( field == 'others'){
          const value1 = value.split('-')
          const others = value1[0];
          const othersname = value1[1];
          setFormData({
          ...formData,
          others : others,
          othersname : othersname
            });
          }

    
  };


  const handleAdd = (role) => {

    console.log(role);

    if (role == 'surgeon'){

      setEntries({
        ...entries,
        surgeon : [...entries["surgeon"], formData['surgeon']], 
        surgeonname: [...entries['surgeonname'], formData['surgeonname']], 

      });

      setFormData({
        ...formData,
        surgeon:'',
        surgeonname : ''
      });


    }

    else if (role == 'assistantSurgeon'){

      setEntries({
        ...entries,
        assistantSurgeon : [...entries["assistantSurgeon"], formData['assistantSurgeon']], 
        assistantSurgeonname: [...entries['assistantSurgeonname'], formData['assistantSurgeonname']], 

      });

      setFormData({
        ...formData,
        assistantSurgeon:'',
        assistantSurgeonname : ''
      });


    }

    else if (role == 'anaesthesiologist'){

      setEntries({
        ...entries,
        anaesthesiologist : [...entries["anaesthesiologist"], formData['anaesthesiologist']], 
        anaesthesiologistname: [...entries['anaesthesiologistname'], formData['anaesthesiologistname']], 

      });

      setFormData({
        ...formData,
        anaesthesiologist:'',
        anaesthesiologistname : ''
      });


    }

    else if (role == 'scrubNurse'){

      setEntries({
        ...entries,
        scrubNurse : [...entries["scrubNurse"], formData['scrubNurse']], 
        scrubNursename: [...entries['scrubNursename'], formData['scrubNursename']], 

      });

      setFormData({
        ...formData,
        scrubNurse:'',
        scrubNursename : ''
      });


    }

    else if (role == 'technician'){

      setEntries({
        ...entries,
        technician : [...entries["technician"], formData['technician']], 
        technicianname: [...entries['technicianname'], formData['technicianname']], 

      });

      setFormData({
        ...formData,
        technician:'',
        technicianname : ''
      });


    }

    else if (role == 'circulatingNurse'){

      setEntries({
        ...entries,
        circulatingNurse : [...entries["circulatingNurse"], formData['circulatingNurse']], 
        circulatingNursename: [...entries['circulatingNursename'], formData['circulatingNursename']], 

      });

      setFormData({
        ...formData,
        circulatingNurse:'',
        circulatingNursename : ''
      });


    }

    else if (role == 'others'){

      setEntries({
        ...entries,
        others : [...entries["others"], formData['others']], 
        othersname: [...entries['othersname'], formData['othersname']], 

      });

      setFormData({
        ...formData,
        others:'',
        othersname : ''
      });


    }
  };

  useEffect(() => {
    axios.get(`${UrlLink}OT/Surgeon_list`)
        .then((res) => setSurgeonData(res.data))
        .catch((err) => console.log(err));
}, [UrlLink]);


useEffect(() => {
  axios.get(`${UrlLink}OT/Assistant_Surgeon_list`)
      .then((res) => setAssistSurgeonData(res.data))
      .catch((err) => console.log(err));
}, [UrlLink]);

useEffect(() => {
  axios.get(`${UrlLink}OT/Anaesthesiologist_list`)
      .then((res) => setAnaesthesiologistData(res.data))
      .catch((err) => console.log(err));
}, [UrlLink]);

useEffect(() => {
  axios.get(`${UrlLink}OT/Scrub_Nurse_list`)
      .then((res) => setscrubNurseData(res.data))
      .catch((err) => console.log(err));
}, [UrlLink]);

useEffect(() => {
  axios.get(`${UrlLink}OT/Circulating_Nurse_list`)
      .then((res) => setCirculatingNurseData(res.data))
      .catch((err) => console.log(err));
}, [UrlLink]);

useEffect(() => {
  axios.get(`${UrlLink}OT/Technician_list`)
      .then((res) => setTechnicianData(res.data))
      .catch((err) => console.log(err));
}, [UrlLink]);


useEffect(() => {
  axios.get(`${UrlLink}OT/Helper_list`)
      .then((res) => setHelperData(res.data))
      .catch((err) => console.log(err));
}, [UrlLink]);

useEffect(() => {
  axios.get(`${UrlLink}OT/get_store_name_for_OT`)
      .then((res) => setStorename(res.data))
      .catch((err) => console.log(err));
}, [UrlLink]);

useEffect(() => {
  axios.get(`${UrlLink}OT/get_item_details_for_consumables?location=${consumabledata.tostoreid}`)
      .then((res) => setitemData(res.data))
      .catch((err) => console.log(err));
}, [consumabledata.tostoreid]);

useEffect(() => {
  axios.get(`${UrlLink}OT/Consumable_details?RegistrationId=${RegistrationId}&BookingType=${BookingType}`)
      .then((res) => setotconsumable(res.data))
      .catch((err) => console.log(err));
}, [load]);

useEffect(() => {
  axios.get(`${UrlLink}OT/Consignment_details?RegistrationId=${RegistrationId}&BookingType=${BookingType}`)
      .then((res) => setotconsignment(res.data))
      .catch((err) => console.log(err));
}, [load]);

useEffect(() => {
  axios.get(`${UrlLink}OT/Equipment_details?RegistrationId=${RegistrationId}&BookingType=${BookingType}`)
      .then((res) => setotequipment(res.data))
      .catch((err) => console.log(err));
}, [load]);




useEffect(() => {
  axios.get(`${UrlLink}OT/Surgical_Team_details?RegistrationId=${RegistrationId}&BookingType=${BookingType}`)
    
      .then((res) => {
        const data = res.data;

        console.log(data,'res');
        console.log(data[0].surgeonId.split(", ").map(id => id.trim()),'premkumar');
        setCrewdata(res.data);
        setEntries({

          id : data[0].id,
          surgeon: data[0].surgeonId.split(", ").map(id => id.trim()),
          surgeonname: data[0].surgeon.split(", ").map(id => id.trim()),
          assistantSurgeon: data[0].assistantSurgeonId.split(", ").map(id => id.trim()),
          assistantSurgeonname: data[0].assistantSurgeon.split(", ").map(id => id.trim()),
          anaesthesiologist: data[0].anaesthesiologistId.split(", ").map(id => id.trim()),
          anaesthesiologistname: data[0].anaesthesiologist.split(", ").map(id => id.trim()),
          scrubNurse: data[0].scrubNurseId.split(", ").map(id => id.trim()),
          scrubNursename: data[0].scrubNurse.split(", ").map(id => id.trim()),
          technician: data[0].technicianId.split(", ").map(id => id.trim()),
          technicianname: data[0].technician.split(", ").map(id => id.trim()),
          circulatingNurse: data[0].circulatingNurseId.split(", ").map(id => id.trim()),
          circulatingNursename: data[0].circulatingNurse.split(", ").map(id => id.trim()),
          othersname: data[0].others.split(", ").map(id => id.trim()),
          others: data[0].othersId.split(", ").map(id => id.trim()),

        });}

      )
      .catch((err) => console.log(err));


}, [load]);


useEffect(() => {
  if (!otconsumable) return; // Exit early if otconsumable is not available

  const createNewotConsumables = (data) => {
    return data.map((consumableData) => ({
      category: consumableData.Categoryname,
      name: consumableData.Productname,
      quantity: parseInt(consumableData.Quantity),
      checkboxes: Array(parseInt(consumableData.Quantity)).fill(false),
      isEditing: false,
    }));
  };

  const newConsumables = createNewotConsumables(otconsumable);
  setConsumables(newConsumables);

  console.log(newConsumables, 'newConsumables');
  console.log(consumables, 'consumables'); 
  console.log(otconsignment,'otconsignment');

}, [otconsumable]); // Dependency array ensures this runs when otconsumable changes

useEffect(() => {
  if (!otconsignment) return; // Exit early if otconsumable is not available

  const createNewotConsignment= (data) => {
    return data.map((consignmentdata) => ({

        

        consignment: consignmentdata.consignmentname,
        quantity: consignmentdata.quantity,
        id : consignmentdata.id
      
    }));
  };

  const newConsignment = createNewotConsignment(otconsignment);

  console.log(newConsignment,'newConsignment');
  setConsignmentItems(newConsignment);

  

}, [otconsignment]);

useEffect(() => {
  if (!otequipment) return; // Exit early if otconsumable is not available

  const createNewotEquipment= (data) => {
    return data.map((equipmentdata) => ({

        equipment: equipmentdata.equipmentname,
        quantity: equipmentdata.quantity,
        id : equipmentdata.id
      
    }));
  };

  const newEquipment = createNewotEquipment(otequipment);

 
  setequipmentItems(newEquipment);

  

}, [otequipment]);

  const handleEdit = (role, index) => {
    const editingEntry = entries[role][index];

    setFormData({
      ...formData,
      [role]: editingEntry,
    });

    const updatedEntries = [...entries[role]];
    updatedEntries.splice(index, 1);

    setEntries({
      ...entries,
      [role]: updatedEntries,
    });
  };

  const handleDelete = (role, index) => {

    if( role == 'surgeon')
    {

      const updatedEntries = [...entries['surgeon']];
      const updatedEntriesname = [...entries['surgeonname']]
      updatedEntries.splice(index, 1);
      updatedEntriesname.splice(index,1);
  
      setEntries({
        ...entries,
        surgeon: updatedEntries,
        surgeonname : updatedEntriesname
      });
    }

    else if( role == 'assistantSurgeon')
      {
  
        const updatedEntries = [...entries['assistantSurgeon']];
        const updatedEntriesname = [...entries['assistantSurgeonname']]
        updatedEntries.splice(index, 1);
        updatedEntriesname.splice(index,1);
    
        setEntries({
          ...entries,
          assistantSurgeon: updatedEntries,
          assistantSurgeonname : updatedEntriesname
        });
      }

      else if( role == 'anaesthesiologist')
        {
    
          const updatedEntries = [...entries['anaesthesiologist']];
          const updatedEntriesname = [...entries['anaesthesiologistname']]
          updatedEntries.splice(index, 1);
          updatedEntriesname.splice(index,1);
      
          setEntries({
            ...entries,
            anaesthesiologist: updatedEntries,
            anaesthesiologistname : updatedEntriesname
          });
        }

        else if( role == 'scrubNurse')
          {
      
            const updatedEntries = [...entries['scrubNurse']];
            const updatedEntriesname = [...entries['scrubNursename']]
            updatedEntries.splice(index, 1);
            updatedEntriesname.splice(index,1);
        
            setEntries({
              ...entries,
              scrubNurse: updatedEntries,
              scrubNursename : updatedEntriesname
            });
          }

          else if( role == 'technician')
            {
        
              const updatedEntries = [...entries['technician']];
              const updatedEntriesname = [...entries['technicianname']]
              updatedEntries.splice(index, 1);
              updatedEntriesname.splice(index,1);
          
              setEntries({
                ...entries,
                technician: updatedEntries,
                technicianname : updatedEntriesname
              });
            }

            else if( role == 'circulatingNurse')
              {
          
                const updatedEntries = [...entries['circulatingNurse']];
                const updatedEntriesname = [...entries['circulatingNursename']]
                updatedEntries.splice(index, 1);
                updatedEntriesname.splice(index,1);
            
                setEntries({
                  ...entries,
                  circulatingNurse: updatedEntries,
                  circulatingNursename : updatedEntriesname
                });
              }

              else if( role == 'others')
                {
            
                  const updatedEntries = [...entries['others']];
                  const updatedEntriesname = [...entries['othersname']]
                  updatedEntries.splice(index, 1);
                  updatedEntriesname.splice(index,1);
              
                  setEntries({
                    ...entries,
                    others: updatedEntries,
                    othersname : updatedEntriesname
                  });
                }

    // console.log(role,index);
    // const updatedEntries = [...entries[role]];
    // updatedEntries.splice(index, 1);

    // setEntries({
    //   ...entries,
    //   [role]: updatedEntries,
    // });
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    console.log('Final Data Confirmed:', entries);

    const data = {
      ...entries,
      created_by: userRecord?.username || '',
      Patientid : OTPatientdata?.patientId,
      RegistrationId : OTPatientdata?.RegistrationId,
      BookingType : OTPatientdata?.BookingType,
      BookingDate : OTPatientdata?.BookingDate,
      BookingTime : OTPatientdata?.BookingTime,
      Booking_Id : OTPatientdata?.Booking_Id,
      Theatreid : OTPatientdata?.Theatreid



    };
    console.log(data,'data');
  
  axios.post(`${UrlLink}OT/Surgical_Team_details`, data)
  .then((res) => {

    const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                console.log(messageType);
                console.log(messageContent);
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });

                
    setEntries({
      surgeon: [],
      surgeonname:[],
      assistantSurgeon: [],
      assistantSurgeonname:[],
      anaesthesiologist: [],
      anaesthesiologistname:[],
      scrubNurse: [],
      scrubNursename:[],
      technician: [],
      technicianname:[],
      circulatingNurse: [],
      circulatingNursename:[],
      othersname:[],
      others: [],
      });
      setload((prev)=>!prev);
  })
  .catch((err) => console.log(err));
  };


  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (event, crewSet) => {
    setSelectedTab(crewSet);
  };

  const renderTable = () => {
    const roles = [
      "surgeon",
      "assistantSurgeon",
      "anaesthesiologist",
      "scrubNurse",
      "technician",
      "circulatingNurse",
      "others",
    ];

    return (
      <div className="Surgigal_v_table">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Role</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role}>
                <td>{role.charAt(0).toUpperCase() + role.slice(1)}</td>
                <td>
                  <input
                    type="text"
                    value={formData[role]}
                    onChange={(e) => handleInputChange(e, role)}
                  />
                </td>
                <td>
                  <button className="add-btn" onClick={() => handleAdd(role)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFinalList = () => {
    return (
      <div className="new-patient-registration-form">
        <h4>Final List:</h4>
        <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th>Surgeon</th>
                <th>Assistant Surgeon</th>
                <th>Anaesthesiologist</th>
                <th>Scrub Nurse</th>
                <th>Technician</th>
                <th>Circulating Nurse</th>
                <th>Others</th>
              </tr>
            </thead>
            <tbody>
              {/* Use the length of the longest role list for the row count */}
              {[
                ...Array(
                  Math.max(
                    entries.surgeon.length,
                    entries.assistantSurgeon.length,
                    entries.anaesthesiologist.length,
                    entries.scrubNurse.length,
                    entries.technician.length,
                    entries.circulatingNurse.length,
                    entries.others.length
                  )
                ),
              ].map((_, index) => {
                // Ensure 'hasData' is declared here
                const hasData =
                  entries.surgeon[index] ||
                  entries.assistantSurgeon[index] ||
                  entries.anaesthesiologist[index] ||
                  entries.scrubNurse[index] ||
                  entries.technician[index] ||
                  entries.circulatingNurse[index] ||
                  entries.others[index];

                return (
                  <tr key={index}>
                    <td>
                      <div className="table-cell">
                      <span className="entry-text">{entries.surgeonname[index] || ''}</span>
                      {entries.surgeonname[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete("surgeon", index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                      <span className="entry-text">{entries.assistantSurgeonname[index] || ''}</span>
                      {entries.assistantSurgeonname[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() =>
                                handleDelete("assistantSurgeon", index)
                              }
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                      <span className="entry-text">{entries.anaesthesiologistname[index] || ''}</span>
                      {entries.anaesthesiologistname[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() =>
                                handleDelete("anaesthesiologist", index)
                              }
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                      <span className="entry-text">{entries.scrubNursename[index] || ''}</span>
                      {entries.scrubNursename[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete("scrubNurse", index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                      <span className="entry-text">{entries.technicianname[index] || ''}</span>
                      {entries.technicianname[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete("technician", index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                       
                        <span className="entry-text">{entries.circulatingNursename[index] || ''}</span>
                        {entries.circulatingNursename[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() =>
                                handleDelete("circulatingNurse", index)
                              }
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell">
                      <span className="entry-text">{entries.othersname[index] || ''}</span>
                      {entries.othersname[index] && (
                          <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDelete("others", index)}
                              className="delete-icon"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };

  const [consumableData, setConsumableData] = useState([]);

  // const handleCheckboxChange = (e, index) => {
  //   const updatedData = [...consumableData];
  //   updatedData[index].quantity = e.target.value;
  //   updatedData[index].consumableAmount =
  //     updatedData[index].quantity * updatedData[index].consumableAmountPerUnit;

  //   updatedData[index].checkboxes = Array.from(
  //     { length: e.target.value },
  //     () => false
  //   );

  //   setConsumableData(updatedData);
  // };

  const handleQuantityChange = (e, index) => {
    const updatedConsumables = [...consumables];
    const newQuantity = parseInt(e.target.value);
    updatedConsumables[index].quantity = newQuantity;
    updatedConsumables[index].checkboxes = Array(newQuantity).fill(false); // Reset checkboxes when quantity changes

    setConsumables(updatedConsumables);
  };

  const handleCheckboxChange = (e, consumableIndex, checkboxIndex) => {
    const updatedConsumables = [...consumables];

    // Ensure the consumable exists
    if (updatedConsumables[consumableIndex]) {
      updatedConsumables[consumableIndex].checkboxes[checkboxIndex] =
        e.target.checked;
      setConsumables(updatedConsumables);
    }
  };

  const handleDeleteconsumable = (id) =>{

    console.log(id,'ididid');
    const data ={

      'id':id
    }

    axios.post(`${UrlLink}OT/delete_consignment`, data)
    .then((res) => {
  
      const response = res.data;
                  const messageType = Object.keys(response)[0];
                  const messageContent = Object.values(response)[0];
                  console.log(messageType);
                  console.log(messageContent);
                  dispatchvalue({
                      type: 'toast',
                      value: { message: messageContent, type: messageType },
                  });

                  setload((prev)=>!prev);
  
    
    })
    .catch((err) => console.log(err));



  };


  const handleDeleteequipment = (id) =>{

    console.log(id,'ididid');
    const data ={

      'id':id
    }

    axios.post(`${UrlLink}OT/delete_equipment`, data)
    .then((res) => {
  
      const response = res.data;
                  const messageType = Object.keys(response)[0];
                  const messageContent = Object.values(response)[0];
                  console.log(messageType);
                  console.log(messageContent);
                  dispatchvalue({
                      type: 'toast',
                      value: { message: messageContent, type: messageType },
                  });

                  setload((prev)=>!prev);
  
    
    })
    .catch((err) => console.log(err));



  };

  // Handle adding consumable
  const handleAddConsumable = () => {
    if (consumabledata.category && consumabledata.itemname && quantity) {
      // const newConsumable = {
      //   category: consumabledata.category,
      //   name: consumabledata.itemname,
      //   quantity: parseInt(quantity),
      //   checkboxes: Array(parseInt(quantity)).fill(false),
      //   isEditing: false,
      // };

      const data = {  
        ...consumabledata,
        'quantity' : quantity,
        'Patientid' : OTPatientdata.patientId,
        'created_by': userRecord?.username || '',
        RegistrationId : OTPatientdata?.RegistrationId,
        BookingType : OTPatientdata?.BookingType,
        Booking_Id : params?.Booking_Id,

      };

      console.log(data,'data123');

      
      



      axios.post(`${UrlLink}OT/Consumable_details`, data)
  .then((res) => {

    const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                console.log(messageType);
                console.log(messageContent);
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });

                
                setSelectedCategory("");
                setItemName("");
                setQuantity("");
                setConsumabledata({
                  category : '',
                  categoryid : '',
                  subcategory : '',
                  subcategoryid : '',
                  tostorename : '',
                  tostoreid : '',
                  itemname : '',
                  itemid : '',
                })
      setload((prev)=>!prev);
  })
  .catch((err) => console.log(err));

      

      

    } else {
      alert("Please fill in all fields");
    }
  };

  const handleconsumablechange = (e) =>{

    const { name, value } = e.target;
    console.log(name,value);
    const value1 = value.split('-');
    const value2 = value1[0];
    const value3 = value1[1];
    console.log(value1,value2,value3);

    if (name == 'category'){
      setConsumabledata((prev)=>({
        ...prev,
        category : value2,
        categoryid : value3
      }));
    }
    
    else if(name == 'subcategory'){
      setConsumabledata((prev)=>({
        ...prev,
        subcategory : value2,
        subcategoryid : value3
      }));

    }

    else if(name == 'fromstorename'){
      setConsumabledata((prev)=>({
        ...prev,
        fromstorename : value2,
        fromstoreid : value3
      }));

    }

    else if(name == 'tostorename'){
      setConsumabledata((prev)=>({
        ...prev,
        tostorename : value2,
        tostoreid : value3
      }));

    }

    else if(name == 'storename'){
      setConsumabledata((prev)=>({
        ...prev,
        storename : value2,
        storeid : value3
      }));

    }

    else if(name == 'itemname'){
      setConsumabledata((prev)=>({
        ...prev,
        itemname : value2,
        itemid : value3
      }));

    }


  };

  const renderConsumablesTable = () => {
    return (
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Category</th>
              <th>Product Name/Code</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {consumables.map((consumable, index) => (
              <tr key={index}>
                <td>{consumable.category}</td>
                <td>{consumable.name}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "5px",
                    }}
                  >
                    {consumable.isEditing ? (
                      <input
                        type="number"
                        value={consumable.quantity}
                        onChange={(e) => handleQuantityChange(e, index)}
                      />
                    ) : (
                      consumable.quantity
                    )}

                    <div style={{ display: "flex", flex: "warp" }}>
                      {Array.from(
                        { length: consumable.quantity },
                        (_, checkboxIndex) => (
                          <label key={checkboxIndex}>
                            <Checkbox
                              type="checkbox"
                              // name={`checkbox-${index}-${i}`}
                              checked={
                                consumable.checkboxes[checkboxIndex] || false
                              }
                              onChange={(e) =>
                                handleCheckboxChange(e, index, checkboxIndex)
                              }
                            />
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleAddConsignment = () => {
    if (consignmentName && quantity1) {
      const newConsignment = {
        consignment: consignmentName,
        quantity: quantity1,
        Patientid : OTPatientdata.patientId,
        created_by: userRecord?.username || '',
        RegistrationId : OTPatientdata?.RegistrationId,
        BookingType : OTPatientdata?.BookingType,
              Booking_Id : params?.Booking_Id,

      };

      axios.post(`${UrlLink}OT/Consignment_details`, newConsignment)
      .then((res) => {
    
        const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];
                    console.log(messageType);
                    console.log(messageContent);
                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
    
                    
        
          setload((prev)=>!prev);
      })
      .catch((err) => console.log(err));
      

      setconsignmentName("");
      setQuantity1("");
    }
  };

  const renderConsignmentTable = () => {
    return (
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Consignment Item</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {consignmentItems.map((consignment, index) => (
              <tr key={index}>    
                <td>{consignment.consignment}</td>
                <td>{consignment.quantity}</td>
                <td>
                  <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDeleteconsumable(consignment.id)}
                              className="delete-icon"
                            />
                          </div>
                          
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleAddEquipment = () => {
    if (equipmentName && quantity2) {
      const newEquipment = {
        equipment: equipmentName,
        quantity: quantity2,
        Patientid : OTPatientdata.patientId,
        created_by: userRecord?.username || '',
        RegistrationId : OTPatientdata?.RegistrationId,
        BookingType : OTPatientdata?.BookingType,
              Booking_Id : params?.Booking_Id,

      };

      axios.post(`${UrlLink}OT/Equipment_details`, newEquipment)
      .then((res) => {
    
        const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];
                    console.log(messageType);
                    console.log(messageContent);
                    dispatchvalue({
                        type: 'toast',
                        value: { message: messageContent, type: messageType },
                    });
    
                    
        
          setload((prev)=>!prev);
      })
      .catch((err) => console.log(err));
      

      setEquipmentName("");
      setQuantity2("");
    }
  };

  const renderEquipmentTable = () => {
    return (
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Equipment Name</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {equipmentItems.map((equipment, index) => (
              <tr key={index}>    
                <td>{equipment.equipment}</td>
                <td>{equipment.quantity}</td>
                <td>
                  <div className="actions-button">
                            <DeleteForeverIcon
                              onClick={() => handleDeleteequipment(equipment.id)}
                              className="delete-icon"
                            />
                          </div>
                          
                </td>
              </tr>   
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  return (
  <div className="Main_container_app">
    <div className="RegisFormcon_1">
      <div className="RegisForm_1">
        <label htmlFor="PatientId">
          Patient Id <span>:</span>{" "}
        </label>
        <span className="dctr_wrbvh_pice" htmlFor="PatientId">
          {OTPatientdata?.patientId}
        </span>
      </div>
      <div className="RegisForm_1">
        <label htmlFor="PatientName">
          Patient Name <span>:</span>{" "}
        </label>
        <span className="dctr_wrbvh_pice" htmlFor="PatientName">
          {OTPatientdata?.PatientName}
        </span>
      </div>
      <div className="RegisForm_1">
        <label htmlFor="AgeGender">
          Age / Gender <span>:</span>{" "}
        </label>
        <span className="dctr_wrbvh_pice" htmlFor="AgeGender">
          {OTPatientdata?.Age}/ {OTPatientdata?.Gender}
        </span>
      </div>
      <div className="RegisForm_1">
        <label htmlFor="Uhid">
          UHID NO <span>:</span>{" "}
        </label>
        <span className="dctr_wrbvh_pice" htmlFor="Uhid">
          {OTPatientdata?.UHIDNO}
        </span>
      </div>
    </div>
    <div className="RegisFormcon_1">
      <div className="RegisForm_1">
        <label htmlFor="SurgeryName">
          Surgery Name / Procedure Name<span>:</span>{" "}
        </label>
        <span className="dctr_wrbvh_pice" htmlFor="SurgeryName">
          {OTPatientdata?.SurgeryName || OTPatientdata?.ProcedureName}
        </span>
      </div>
      <div className="RegisForm_1">
        <label htmlFor="TheatreName">
          Theatre Name <span>:</span>{" "}
        </label>
        <span className="dctr_wrbvh_pice" htmlFor="TheatreName">
          {OTPatientdata?.TheatreName}
        </span>
      </div>
      <div className="RegisForm_1">
        <label htmlFor="BookingDateTime">
          Booking Date / Time <span>:</span>{" "}
        </label>
        <span className="dctr_wrbvh_pice" htmlFor="BookingDateTime">
          {OTPatientdata?.bookingdate}/ {OTPatientdata?.BookingTime}
        </span>
      </div>
      <div className="RegisForm_1">
        <label htmlFor="Duration">
          Duration <span>:</span>{" "}
        </label>
        <span className="dctr_wrbvh_pice" htmlFor="Duration">
          {OTPatientdata?.Duration}
        </span>
      </div>
      <div className="RegisForm_1">
        <label htmlFor="Priority">
          Priority <span>:</span>{" "}
        </label>
        <span className="dctr_wrbvh_pice" htmlFor="Priority">
          {OTPatientdata?.Priority}
        </span>
      </div>
    </div>
    <h4>
      <Tabs
        value={selectedTab}
        onChange={handleChangeTab}
        aria-label="Tab Navigation"
      >
        <CustomTab label="Surgical Team" />
        <CustomTab label="Consumable" />
        <CustomTab label="Consignment" />
        <CustomTab label="equipment" />
        <div style={{ display: "flex", alignItems: "center", padding: "0 16px" }}>
        <input
          type="checkbox"
          id="confirmation"
          checked={isChecked}
          onChange={handleConfirmationChange}
          style={{ width: "24px", height: "24px", cursor: "pointer" }}
        />
        <label
          htmlFor="confirmation"
          style={{ marginLeft: "12px", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}
        >
          Confirmation
        </label>
      </div>


      </Tabs>
      
      <div style={{ float: "right" }}>
        Doctor Available{" "}
        <FontAwesomeIcon icon={faCalendarDays} onClick={() => openModal("calendar")} className="cal_icon" />
      </div>
    </h4>
    {/* <div className="Main_container_app">
      <div className="new-navigation">
        <h2>
          <Button
            style={{
              color: activeTab === "Surgical_Team" ? "white" : "",
            }}
            onClick={() => handleTabChange("Surgical_Team")}
          >
            SurgicalTeam
          </Button>
          <Button
            style={{
              color: activeTab === "Consumable" ? "White" : "",
            }}
            onClick={() => handleTabChange("Consumable")}
          >
            Consumable
          </Button>
          <Button
            style={{
              color: activeTab === "Consignment" ? "white" : "",
            }}
            onClick={() => handleTabChange("Consignment")}
          >
            Consignment
          </Button>
          <div style={{ float: "right" }}>
            Doctor Available{" "}
            <FontAwesomeIcon icon={faCalendarDays} className="cal_icon" />
          </div>
        </h2>
      </div>
    </div> */}
    {/* <div className="RegisForm_1">
      <label>Specialization<span>:</span></label>
      <select
        value={selectedSpecialization}
        onChange={handleChangeu}
      >
        <option value="">Select a specialization</option>
        {specializationData && specializationData.length > 0 && specializationData.map((specialization) => (
          <option key={specialization.id} value={specialization.id}>
            {specialization.SpecialityName}
          </option>
        ))}
      </select>
    </div> */}

    {selectedTab === 0 && (
      <div className='Surgical_team'>
        {/* Surgical Team Section */}
        <div className="RegisForm_1">
        <label>Surgeon<span>:</span></label>
        <input
          type="text"
          value={formData.surgeonname}
          onChange={(e) => handleInputChange(e, "surgeon")}
          list='Surgeonlist'
        />

        <datalist id="Surgeonlist">
            {Array.isArray(Surgeondata) &&
                Surgeondata.map((f, i) => (
                    <option key={i} value={`${f.id}-${f.Doctorname}`}></option>
                ))}
        </datalist>
          <span style={{ display: 'flex', alignItems: 'center ' }}>
            <AddCircleIcon onClick={() => handleAdd("surgeon")} />
          </span>
        </div>

        <div className="RegisForm_1">
        <label>Assistant Surgeon<span>:</span></label>
        <input
          type="text"
          value={formData.assistantSurgeonname}
          onChange={(e) => handleInputChange(e, "assistantSurgeon")}
          list='AssistSurgeonlist'
        />
        <datalist id="AssistSurgeonlist">
            {Array.isArray(AssistSurgeondata) &&
                AssistSurgeondata.map((f, i) => (
                    <option key={i} value={`${f.id}-${f.Doctorname}`}></option>
                ))}
        </datalist>
          <span style={{ display: 'flex', alignItems: 'center ' }}>
            <AddCircleIcon onClick={() => handleAdd("assistantSurgeon")} />
          </span>
        </div>

        <div className="RegisForm_1">
        <label>Anaesthesiologist<span>:</span></label>
        <input
          type="text"
          value={formData.anaesthesiologistname}
          onChange={(e) => handleInputChange(e, "anaesthesiologist")}
          list='Anaesthesiologistlist'
        />
        <datalist id="Anaesthesiologistlist">
            {Array.isArray(Anaesthesiologistdata) &&
                Anaesthesiologistdata.map((f, i) => (
                    <option key={i} value={`${f.id}-${f.Doctorname}`}></option>
                ))}
        </datalist>
          <span style={{ display: 'flex', alignItems: 'center ' }}>
            <AddCircleIcon onClick={() => handleAdd("anaesthesiologist")} />
          </span>
        </div>
        
        {/* Nurse Team Section */}
        <div className="RegisForm_1">
        <label>ScrubNurse<span>:</span></label>
        <input
          type="text"
          value={formData.scrubNursename}
          onChange={(e) => handleInputChange(e, "scrubNurse")}
          list='scrubNurselist'
        />
        <datalist id="scrubNurselist">
            {Array.isArray(scrubNursedata) &&
                scrubNursedata.map((f, i) => (
                    <option key={i} value={`${f.id}-${f.Employeename}`}></option>
                ))}
        </datalist>
          <span style={{ display: 'flex', alignItems: 'center ' }}>
            <AddCircleIcon onClick={() => handleAdd("scrubNurse")} />
          </span>
        </div>

        <div className="RegisForm_1">
        <label>Circulating Nurse<span>:</span></label>
        <input
          type="text"
          value={formData.circulatingNursename}
          onChange={(e) => handleInputChange(e, "circulatingNurse")}
          list='CirculatingNurselist'
        />
        <datalist id="CirculatingNurselist">
            {Array.isArray(CirculatingNursedata) &&
                CirculatingNursedata.map((f, i) => (
                    <option key={i} value={`${f.id}-${f.Employeename}`}></option>
                ))}
        </datalist>
          <span style={{ display: 'flex', alignItems: 'center ' }}>
            <AddCircleIcon onClick={() => handleAdd("circulatingNurse")} />
          </span>
        </div>

        {/* Technician Section */}
        <div className="RegisForm_1">
        <label>Technician<span>:</span></label>
        <input
          type="text"
          value={formData.technicianname}
          onChange={(e) => handleInputChange(e, "technician")}
          list='Technicianlist'
        />
        <datalist id="Technicianlist">
            {Array.isArray(Techniciandata) &&
                Techniciandata.map((f, i) => (
                    <option key={i} value={`${f.id}-${f.Employeename}`}></option>
                ))}
        </datalist>
          <span style={{ display: 'flex', alignItems: 'center ' }}>
            <AddCircleIcon onClick={() => handleAdd("technician")} />
          </span>
        </div>

        {/* Helper Section */}
        <div className="RegisForm_1">
        <label>Helper<span>:</span></label>
        <input
          type="text"
          value={formData.othersname}
          onChange={(e) => handleInputChange(e, "others")}
          list='Helperlist'
        />
        <datalist id="Helperlist">
            {Array.isArray(Helperdata) &&
                Helperdata.map((f, i) => (
                    <option key={i} value={`${f.id}-${f.Employeename}`}></option>
                ))}
        </datalist>
          <span style={{ display: 'flex', alignItems: 'center ' }}>
            <AddCircleIcon onClick={() => handleAdd("others")} />
          </span>
        </div>

        {/* {entries.surgeon.length > 0 && renderTable()} Render table if data exists */}
        {entries.surgeon.length > 0 && renderFinalList()} {/* Render final list if data exists */}

        {/* Confirm Button */}
        {entries.surgeon.length > 0 && !isConfirmed && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleConfirm} className="confirm-btn">
              {entries.id ? 'Update' : 'Submit'}
            </button>
          </div>
        )}
        {isConfirmed && (
          <div style={{ marginTop: '20px', color: 'green' }}>
            <h4>Crew Set Completed!!</h4>
          </div>
        )}
      </div>
    )}

    {/* Tab 2 - Consumable */}
    {selectedTab === 1 && (
      <div className="RegisFormcon_1">

{/* <div className="RegisForm_1">
          <label htmlFor="subCategory"> Request From Store Name</label>
        
          <input
          type = 'text'
          name = 'fromstorename'
          value={consumabledata.fromstorename}
          onChange={handleconsumablechange}
          list='storelist'
        />

        <datalist id="storelist">
            {Array.isArray(Storename) &&
                Storename.map((f, i) => (
                    <option key={i} value={`${f.Storename}-${f.id}`}></option>
                ))}
        </datalist>
        </div> */}

        <div className="RegisForm_1">
          <label htmlFor="subCategory"> Request to Store Name</label>
        
          <input
          type = 'text'
          name = 'tostorename'
          value={consumabledata.tostorename}
          onChange={handleconsumablechange}
          list='storelist'
          
        />

        <datalist id="storelist">
            {Array.isArray(Storename) &&
                Storename.map((f, i) => (
                    <option key={i} value={`${f.Storename}-${f.id}`}></option>
                ))}
        </datalist>
        </div>



        <div className="RegisForm_1">
          <label>Product Category:</label>

          <input
          type="text"
          name="category"
          value={consumabledata.category}
          onChange={handleconsumablechange}
          list='categorylist'
        />

        <datalist id="categorylist">
            {Array.isArray(productCategories) &&
                productCategories.map((f, i) => (
                    <option key={i} value={`${f.ProductCategory}-${f.id}`}></option>
                ))}
        </datalist>
         
        </div>
        <div className="RegisForm_1">
          <label htmlFor="subCategory">Sub Category</label>
          

          <input
          type = 'text'
          name = 'subcategory'
          value={consumabledata.subcategory}
          onChange={handleconsumablechange}
          list='subcategorylist'
        />

        <datalist id="subcategorylist">
            {Array.isArray(productSubCategories) &&
                productSubCategories.map((f, i) => (
                    <option key={i} value={`${f.SubCategoryName}-${f.id}`}></option>
                ))}
        </datalist>
        </div>

        

        <div className="RegisForm_1">
          <label htmlFor="subCategory">Product Name</label>
          
          <input
          type = 'text'
          name="itemname"
          value={consumabledata.itemname}
          onChange= {handleconsumablechange}
          list='itemlist'
          
        />

        <datalist id="itemlist">
            {Array.isArray(itemData) &&
                itemData.map((f, i) => (
                    <option key={i} value={`${f.productname}-${f.id}`}></option>
                ))}
        </datalist>
        </div>

        {/* <div className="RegisForm_1">
          <label>
            Product Name/Code<span>:</span>
          </label>
          <input
            type="text"
            name="ItemNameCode"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter Item Name or Code"
          />
        </div> */}

        <div className="RegisForm_1">
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="Main_container_Btn">
          <Button onClick={handleAddConsumable}>
            <AddIcon />
          </Button>
        </div>

        {/* Consumable Table */}
        {consumables.length > 0 && renderConsumablesTable()}
      </div>
    )}

    {/* Tab 3 - Consignment */}
    {selectedTab === 2 && (
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>
            Consignment Item<span>:</span>
          </label>
          <input
            type="text"
            name="consignmentName"
            value={consignmentName}
            onChange={(e) => setconsignmentName(e.target.value)}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Quantity<span>:</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={quantity1}
            onChange={(e) => setQuantity1(e.target.value)}
          />
        </div>

        <div className="Main_container_Btn">
          <Button onClick={handleAddConsignment}>
            <AddIcon />
          </Button>
        </div>

        {/* Consignment Table */}
        {consignmentItems.length > 0 && renderConsignmentTable()}
      </div>
    )}

      {/* Tab 4 - equipment */}
      {selectedTab === 3 && (
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>
          Equipment Name <span>:</span>
          </label>
          <input
            type="text"
            name="equipmentName"
            value={equipmentName}
            onChange={(e) => setEquipmentName(e.target.value)}
          />
        </div>
        <div className="RegisForm_1">
          <label>
            Quantity<span>:</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={quantity2}
            onChange={(e) => setQuantity2(e.target.value)}
          />
        </div>

        <div className="Main_container_Btn">
          <Button onClick={handleAddEquipment}>
            <AddIcon />
          </Button>
        </div>

        {/* Consignment Table */}
        {equipmentItems.length > 0 && renderEquipmentTable()}
      </div>
    )}

  {/* Tab 5 - confirmation */}
    {selectedTab === 4 && (

        <div className="RegisForm_1">
        <label>
        Crew and <span>:</span>
        </label>
        <input
        type="number"
        name="quantity"
        value={quantity2}
        onChange={(e) => setQuantity2(e.target.value)}
        />
        </div>
      
      
    )}

    {openModal2 && (
      <div
        className={
          isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
        }
        onClick={() => {
          setOpenModal2(false);
        }}
      >
        <div
          className="newwProfiles newwPopupforreason"
          onClick={(e) => e.stopPropagation()}
        >
          <OTCrewCalendar/>
        </div>
      </div>
    )}

<ToastAlert Message={toast.message} Type={toast.type} />
  </div>
  )
}

export default CrewDetails