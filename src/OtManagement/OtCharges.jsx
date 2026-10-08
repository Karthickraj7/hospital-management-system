import {
  Button,
  Checkbox,
  debounce,
  FormControlLabel,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { useLocation } from "react-router-dom";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";


const OtCharges = () => {

  const dispatchvalue = useDispatch();
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);

  const [isConsumable, setIsConsumable] = useState(false);
  const [isConsignment, setIsConsignment] = useState(false);
  const [consumableText, setConsumableText] = useState("");
  const [consignmentText, setConsignmentText] = useState("");

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [consumableAmount, setConsumableAmount] = useState("");
  const [consumableData, setConsumableData] = useState([]);
  const [consignmentData, setConsignmentData] = useState([]);

  const [checkboxes, setCheckboxes] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [availableQuantity, setAvaibleQuantity] = useState(0);

  const [equipmentName, setequipmentName] = useState("");
  const [quantity1, setQuantity1] = useState("");
  const [amount1, setAmount1] = useState("");

  const [otconsumable, setotconsumable] = useState([]);
  const [otconsignment, setotconsignment] = useState([]);
  const [otequipment, setotequipment] = useState([]);
  const [Crewdata, setCrewdata] = useState([]);
 

  const [surgeon, setSurgeon] = useState([]);
  const [assistantSurgeon, setAssistantSurgeon] = useState([]);
  const [anaesthesiologist, setAnaesthesiologist] = useState([]);
  const [scrubNurse, setScrubNurse] = useState([]);
  const [circulatingNurse, setCirculatingNurse] = useState([]);
  const mergedNurses = [...scrubNurse, ...circulatingNurse];
  const mergedSurgeon = [...surgeon, ...assistantSurgeon];


  const [technician, setTechnician] = useState([]);
  const [others, setOthers] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [filteredData, setFilteredData] = useState([]);

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
     const [Storename,setStorename] = useState([]);
       const [productCategories, setProductCategories] = useState([]);
         const [productSubCategories, setProductSubCategories] = useState([]);
           const [itemData,setitemData] = useState([]);
             const [selectedCategory, setSelectedCategory] = useState("");
              const [selectedProduct, setSelectedProduct] = useState(null);

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


   const [openModal2, setOpenModal2] = useState(false);

    const openModal = () => {
       setOpenModal2(true);
     };
   
     const handleCloseModal1 = () => {
       setOpenModal2(false);
   
     };




  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const location = useLocation();
  // const { params } = location.state || {};

  const params = useSelector((state) => state.Frontoffice?.OTPatientdata);

  const [otCharges, setOtCharges] = useState([]);
  const [newCharge, setNewCharge] = useState({
    serviceName: "",
    units: "",
    perHourCost: "",
    amount: "",
    id: Date.now(),
    duration: params?.Duration,
    identify: "",
    quantity: "1"

  });

  const [otrent, setotrent] = useState(params.theatrerent);
  const [otname, setotname] = useState(params.TheatreName);
  const [selectedConsignment, setSelectedConsignment] = useState("");
  const [selectedequipment, setselectedequipment] = useState("");

  const [load,setload] = useState(false);


  console.log('received params', otCharges);

  const [consignmentNames, setConsignmentNames] = useState([]);
  const [consumables, setConsumables] = useState([]);

  const [equipmentNames, setequipmentNames] = useState([]);
  const [equipments, setequipmentss] = useState([]);


  useEffect(() => {

    const names = otconsignment.map(item => item.consignmentname);
    setConsignmentNames(names);
  }, [otconsignment]);

  useEffect(() => {

    const names = otequipment.map(item => item.equipmentname);
    setequipmentNames(names);
  }, [otequipment]);


  useEffect(() => {
    axios.get(`${UrlLink}OT/Consumable_details?RegistrationId=${params?.RegistrationId}&BookingType=${params?.BookingType}`)
      .then((res) => {

        setotconsumable(res.data)
      })
      .catch((err) => console.log(err));
  }, [UrlLink,load]);

  useEffect(() => {
    axios.get(`${UrlLink}OT/Consignment_details?RegistrationId=${params?.RegistrationId}&BookingType=${params?.BookingType}`)
      .then((res) => {

        setotconsignment(res.data)
      })
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios.get(`${UrlLink}OT/Equipment_details?RegistrationId=${params?.RegistrationId}&BookingType=${params?.BookingType}`)
      .then((res) => {

        setotequipment(res.data)
      })
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    axios.get(`${UrlLink}OT/Surgical_Team_details?RegistrationId=${params?.RegistrationId}&BookingType=${params?.BookingType}`)

      .then((res) => {
        const data = res.data;



        setCrewdata(res.data);
        // setEntries({

        //   id : data[0].id,
        //   surgeon: data[0].surgeonId.split(", ").map(id => id.trim()),
        //   surgeonname: data[0].surgeon.split(", ").map(id => id.trim()),
        //   assistantSurgeon: data[0].assistantSurgeonId.split(", ").map(id => id.trim()),
        //   assistantSurgeonname: data[0].assistantSurgeon.split(", ").map(id => id.trim()),
        //   anaesthesiologist: data[0].anaesthesiologistId.split(", ").map(id => id.trim()),
        //   anaesthesiologistname: data[0].anaesthesiologist.split(", ").map(id => id.trim()),
        //   scrubNurse: data[0].scrubNurseId.split(", ").map(id => id.trim()),
        //   scrubNursename: data[0].scrubNurse.split(", ").map(id => id.trim()),
        //   technician: data[0].technicianId.split(", ").map(id => id.trim()),
        //   technicianname: data[0].technician.split(", ").map(id => id.trim()),
        //   circulatingNurse: data[0].circulatingNurseId.split(", ").map(id => id.trim()),
        //   circulatingNursename: data[0].circulatingNurse.split(", ").map(id => id.trim()),
        //   othersname: data[0].others.split(", ").map(id => id.trim()),
        //   others: data[0].othersId.split(", ").map(id => id.trim()),

        // });}
      }
      )
      .catch((err) => console.log(err));


  }, [UrlLink]);


  useEffect(() => {
    if (Crewdata && Crewdata.length > 0) {

      let tempSurgeon = [];

      let tempAssistantSurgeon = [];

      let tempAnaesthesiologist = [];

      let tempScrubNurse = [];

      let tempCirculatingNurse = [];

      let tempTechnician = [];

      let tempOthers = [];

      // Loop through each object in the array
      Crewdata.forEach((data) => {
        // Split values and store them in temp arrays

        if (data.surgeon) tempSurgeon.push(...data.surgeon.split(", ").map(name => name.trim()));


        if (data.assistantSurgeon) tempAssistantSurgeon.push(...data.assistantSurgeon.split(", ").map(name => name.trim()));


        if (data.anaesthesiologist) tempAnaesthesiologist.push(data.anaesthesiologist);


        if (data.scrubNurse) tempScrubNurse.push(data.scrubNurse);


        if (data.circulatingNurse) tempCirculatingNurse.push(data.circulatingNurse);


        if (data.technician) tempTechnician.push(data.technician);


        if (data.others) tempOthers.push(...data.others.split(", ").map(name => name.trim()));
      });

      // Update state

      setSurgeon(tempSurgeon);

      setAssistantSurgeon(tempAssistantSurgeon);

      setAnaesthesiologist(tempAnaesthesiologist);

      setScrubNurse(tempScrubNurse);

      setCirculatingNurse(tempCirculatingNurse);

      setTechnician(tempTechnician);

      setOthers(tempOthers);
    }
  }, [Crewdata]);

  useEffect(() => {
    if (!otconsumable) return; // Exit early if otconsumable is not available

    const createNewotConsumables = (data) => {
      return data.map((consumableData) => ({
        category: consumableData.Categoryname,
        price: consumableData.price,
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
    console.log(otconsignment, 'otconsignment');

  }, [otconsumable]); // Dependency array ensures this runs when otconsumable changes

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


  const handleServiceChange = (event) => {
    const { name, value } = event.target;
    const selectedValue = value;
    setSelectedService(selectedValue);

    setNewCharge((prevState) => ({
      ...prevState,
      [name]: value,
    }));


    switch (selectedValue) {
      case "SURGEONFEE":
        setFilteredData(mergedSurgeon);
        break;
      // case "ASSISTING SURGEON":
      //   setFilteredData(assistantSurgeon);
      //   break;
      case "ANESTHESIANFEE":
        setFilteredData(anaesthesiologist);
        break;
      case 'OPERATION THEATER':

        setNewCharge((prevState) => ({
          ...prevState,
          units: otname,
          perHourCost: otrent,
        }));
        break;
      case 'OTNURSINGCHARGE':
        setFilteredData(mergedNurses);
        break;
      case 'TECHNICIAN':
        setFilteredData(technician);
        break;
      case 'CONSIGNMENT':

        setFilteredData(consignmentNames);
        break;
      case 'EQUIPMENT':

        setFilteredData(equipmentNames);

        break;

      default:
        setFilteredData([]);
        break;
    }
  };




  // Fetching the inventory items from the API
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Inventory_Master_Detials_link`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setInventoryItems(res.data);
        } else {
          console.error("API response is not an array", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching inventory data:", err);
      });
  }, [UrlLink]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value, name);



    if (name === "units" && selectedService !== 'OPERATION THEATER' && selectedService !== 'CONSIGNMENT' && selectedService !== 'EQUIPMENT') {

      if (!isNaN(value) && value.trim() !== "") {

        console.log('number');

        setNewCharge((prevState) => ({
          ...prevState,
          identify: 'number',
          [name]: value,
        }));

      }

      else {
        console.log('string');
        setNewCharge((prevState) => ({
          ...prevState,
          identify: 'string',
          [name]: value,
        }));

      }
    }

    else if (name === "units" && selectedService === 'CONSIGNMENT') {


      const selectedName = value;
      console.log(selectedName);
      console.log(value);
      setSelectedConsignment(selectedName);

      // Find corresponding quantity
      const selectedItem = otconsignment.find(item => item.consignmentname === selectedName);
      console.log(selectedItem);
      setNewCharge((prevState) => ({
        ...prevState,
        units: value,
        quantity: selectedItem.quantity,
        amount: value * selectedItem.quantity

      }));
    }

    else if (name === "units" && selectedService === 'EQUIPMENT') {


      const selectedName = value;
      console.log(selectedName);
      console.log(value);
      setselectedequipment(selectedName);

      // Find corresponding quantity
      const selectedItem = otequipment.find(item => item.equipmentname === selectedName);
      console.log(selectedItem);
      setNewCharge((prevState) => ({
        ...prevState,
        units: value,
        quantity: selectedItem.quantity,
        amount: value * selectedItem.quantity

      }));
    }

    else if (name === "units" && selectedService === 'OPERATION THEATER') {

      console.log('premkumar', selectedService);
      setNewCharge((prevState) => ({
        ...prevState,
        units: value,
        perHourCost: otrent,
        amount: otrent * prevState.duration
      }));
    }

    else if (name === "perHourCost" && selectedService !== 'OPERATION THEATER' && selectedService !== 'CONSIGNMENT' && selectedService !== 'EQUIPMENT') {

      console.log('vathi', selectedService);
      setNewCharge((prevState) => ({
        ...prevState,
        [name]: value,
        amount: value * (prevState.identify === 'string' ? prevState.duration : prevState.units),
      }));
    }

    else if (name === "quantity" && selectedService === 'OPERATION THEATER') {

      setNewCharge((prevState) => ({
        ...prevState,
        [name]: value,
        amount: value * prevState.perHourCost,
      }));

    }

    else if (name === "perHourCost" && selectedService === 'CONSIGNMENT') {

      setNewCharge((prevState) => ({
        ...prevState,
        [name]: value,
        amount: prevState.quantity * value,
      }));

    }

    else if (name === "perHourCost" && selectedService === 'EQUIPMENT') {

      console.log('EQUIPMENTEQUIPMENT');

      setNewCharge((prevState) => ({
        ...prevState,
        [name]: value,
        amount: prevState.quantity * value,
      }));

    }

    else if (name === "quantity" && selectedService === 'OXYGEN/OTHER GAS') {



      setNewCharge((prevState) => ({
        ...prevState,
        [name]: value,
        amount: value * prevState.perHourCost,
      }));

    }


    else if (name === "quantity" && selectedService === 'BLOOD') {



      setNewCharge((prevState) => ({
        ...prevState,
        [name]: value,
        amount: value * prevState.perHourCost,
      }));

    }

    else if (name === "quantity" && selectedService === 'SURGICAL APPLIANCE') {



      setNewCharge((prevState) => ({
        ...prevState,
        [name]: value,
        amount: value * prevState.perHourCost,
      }));

    }

    else {


      setNewCharge((prevState) => ({
        ...prevState,
        [name]: value,
      }));

    }

  };

  // const handleAddRow = () => {

  //   console.log(newCharge, 'Received Params');
  //   setOtCharges((prevState) => [
  //     ...prevState,
  //     {
  //       ...newCharge,
  //       isConsumable,
  //       isConsignment,
  //       consumableText,
  //       consignmentText,
  //       itemName,
  //       consumableAmount,
  //     },
  //   ]);

  //   setNewCharge({
  //     serviceName: selectedService,
  //     units: "",
  //     perHourCost: "",
  //     amount: "",
  //     id: Date.now(),
  //     isEditing: false,
  //     duration: params?.Duration,
  //     identify: "",
  //     quantity: "",

  //   });
  //   setIsConsumable(false);
  //   setIsConsignment(false);
  //   setConsumableText("");
  //   setConsignmentText("");
  //   setItemName("");
  //   setQuantity("");
  //   setConsumableAmount("");
  // };


  const handleAddRow = () => {
    console.log(newCharge, 'Received Params');
    
    // Check for duplicates based on serviceName and units
    const isDuplicate = otCharges.some(
      charge => 
        charge.serviceName === newCharge.serviceName && 
        charge.units === newCharge.units
    );
    
    if (isDuplicate) {
      const tdata = {
        message: `This service "${newCharge.serviceName}" with  "${newCharge.units}" is already added!`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return; // Exit function without adding the duplicate
    }
    
    // Proceed with adding the new row if not a duplicate
    setOtCharges((prevState) => [
      ...prevState,
      {
        ...newCharge,
        isConsumable,
        isConsignment,
        consumableText,
        consignmentText,
        itemName,
        consumableAmount,
      },
    ]);
  
    // Reset form fields after adding the row
    setNewCharge({
      serviceName: selectedService,
      units: "",
      perHourCost: "",
      amount: "",
      id: Date.now(),
      isEditing: false,
      duration: params?.Duration,
      identify: "",
      quantity: "1",
    });
    setIsConsumable(false);
    setIsConsignment(false);
    setConsumableText("");
    setConsignmentText("");
    setItemName("");
    setQuantity("");
    setConsumableAmount("");
  };


  const handleAddConsumable = () => {
    if (itemName && quantity && consumableAmount) {
      setConsumableData((prevData) => [
        ...prevData,
        { itemName, quantity, consumableAmount },
      ]);
      setItemName("");
      setQuantity("");
      setConsumableAmount("");
      setAvaibleQuantity(0);
    }
  };

  const handleAddConsignment = () => {
    if (equipmentName && quantity1 && amount1) {
      setConsignmentData((prevData) => [
        ...prevData,
        { equipmentName, quantity1, amount1 },
      ]);
      setequipmentName("");
      setQuantity1("");
      setAmount1("");
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 0;
    setQuantity(newQuantity);
    setCheckboxes(new Array(newQuantity).fill(false));
  };

  const handleProductSelect = (product) => {
    setItemName(product);
    setAvaibleQuantity(product);
  };

  const handleEditCharge = (rowId) => {
    setOtCharges((prevState) =>
      prevState.map((charge) =>
        charge.id === rowId ? { ...charge, isEditing: true } : charge
      )
    );
  };

  const handleSaveEdit = (index) => {
    setOtCharges((prevState) =>
      prevState.map((charge, i) =>
        i === index ? { ...charge, isEditing: false } : charge
      )
    );
  };

  const handleCancelEdit = (index) => {
    setOtCharges((prevState) =>
      prevState.map((charge, i) =>
        i === index ? { ...charge, isEditing: false } : charge
      )
    );
  };



  const handleconSubmit = async () => {

    console.log(consumables, 'consumables');

    const updatedConsumables = consumables.map((item) => ({
      ...item,
      uncheckedCount: item.checkboxes.filter((checked) => !checked).length,
    }));

    console.log(updatedConsumables,'updatedConsumables');

    updatedConsumables.forEach((item) => {
     
      const newCharge = {
        serviceName: "Consumables",
        units: item.name, 
        perHourCost: item.price, 
        amount: (parseFloat(item.price) * item.uncheckedCount).toFixed(2), 
        id: Date.now(),
        duration: item.uncheckedCount, 
        identify: item.category, 
        isConsumable,
        isConsignment,
        consumableText,
        consignmentText,
        itemName,
        quantity : item.uncheckedCount,
        consumableAmount,
      };

    
      setOtCharges((prevState) => [...prevState, newCharge]);

      setIsConsumable(false);
      setIsConsignment(false);
      setConsumableText("");
      setConsignmentText("");
      setItemName("");
      setQuantity("");
      setConsumableAmount("");
      setConsumables([]);
    });

  };

  const handlebillSubmit = async () => {
    const data = {
      ...otCharges,
      'RegistrationId': params?.RegistrationId,
      'BookingType': params?.BookingType,
      "Created_by": UserData?.username,
    };

    console.log(data, 'data');
    axios.post(`${UrlLink}OT/OT_Billing_details`, data)
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

        setload((prev) => !prev);
      })
      .catch((err) => console.log(err));


  };



  console.log(otCharges, 'otcharges');

  const handleCheckboxChange = (e, rowIndex, checkboxIndex) => {
    const checked = e.target.checked;
    setConsumables((prev) =>
      prev.map((item, i) =>
        i === rowIndex
          ? {
            ...item,
            checkboxes: item.checkboxes.map((cb, j) =>
              j === checkboxIndex ? checked : cb
            ),
          }
          : item
      )
    );
  };

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

     const handlesubmitConsumable = () => {
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
            'Patientid' : params.patientId,
            'created_by': userRecord?.username || '',
            RegistrationId : params?.RegistrationId,
            BookingType : params?.BookingType
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


  return (
    <div className="Main_container_app">
      <h4>OT Charges</h4>

      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>
            Service Name<span>:</span>
          </label>
          <select
            name="serviceName"
            value={selectedService}
            onChange={handleServiceChange}
            required
          >
            <option value="">Select Service</option>
            <option value="SURGEONFEE">SURGEON FEE</option>
            {/* <option value="ASSISTING SURGEON">ASSISTING SURGEN FEE</option> */}
            <option value="ANESTHESIANFEE">ANESTHESIAN FEE</option>
            <option value="PHYSICIAN">PHYSICIAN FEE</option>
            <option value="CONSUMABLE">CONSUMABLE FEE</option>
            <option value="CONSIGNMENT">CONSIGNMENT FEE</option>
            <option value="CONSULTANT">CONSULTANT FEE</option>
            <option value="OTNURSINGCHARGE">NURSE FEE</option>
            <option value="TECHNICIAN">TECHNICIAN FEE</option>
            <option value="OPERATION THEATER">OPERATION THEATER CHARGES</option>
            <option value="EQUIPMENT">EQUIPMENT CHARGES</option>
            <option value="BLOOD">BLOOD</option>
            <option value="OXYGEN/OTHER GAS">OXYGEN/OTHER GAS</option>
            <option value="SURGICAL APPLIANCE">
              SURGICAL APPLIANCE CHARGE
            </option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label>
            Name<span>:</span>
          </label>
          <input
            type="text"
            name="units"
            value={newCharge.units}
            onChange={handleInputChange}
            list='Surgeonlist'
            required

          />

          <datalist id="Surgeonlist">
            {Array.isArray(filteredData) &&
              filteredData.map((f, i) => (
                <option key={i} value={f}></option>
              ))}
          </datalist>
        </div>

        <div className="RegisForm_1">
          <label>
            Per Hour/Unit Cost<span>:</span>
          </label>
          <input
            type="number"
            name="perHourCost"
            value={newCharge.perHourCost}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Quantity/Duration<span>:</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={newCharge.quantity}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="RegisForm_1">
          <label>
            Amount<span>:</span>
          </label>
          <input
            type="number"
            name="amount"
            value={newCharge.amount}
            onChange={handleInputChange}
          // readOnly
          />
        </div>
      </div>

      <div className="Main_container_Btn">
        <Button onClick={handleAddRow}>
          <AddIcon />
        </Button>
      </div>

      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Service Name</th>
              <th>Name</th>
              <th>Per Hour/Unit Cost</th>
              <th>Duration/Quantity</th>
              <th>Amount</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {otCharges.map((charge, index) => (
              <tr key={charge.id}>
                <td>{index + 1}</td>
                <td>
                  {charge.isEditing ? (
                    <input
                      type="text"
                      name="serviceName"
                      value={charge.serviceName}
                      onChange={(e) => {
                        const updatedCharges = [...otCharges];
                        updatedCharges[index].serviceName = e.target.value;
                        setOtCharges(updatedCharges);
                      }}
                    />
                  ) : (
                    charge.serviceName
                  )}
                </td>
                <td>
                  {charge.isEditing ? (
                    <input
                      type="number"
                      name="units"
                      value={charge.units}
                      onChange={(e) => {
                        const updatedCharges = [...otCharges];
                        updatedCharges[index].units = e.target.value;
                        updatedCharges[index].amount =
                          updatedCharges[index].units *
                          updatedCharges[index].perHourCost;
                        setOtCharges(updatedCharges);
                      }}
                    />
                  ) : (
                    charge.units
                  )}
                </td>
                <td>
                  {charge.isEditing ? (
                    <input
                      type="number"
                      name="perHourCost"
                      value={charge.perHourCost}
                      onChange={(e) => {
                        const updatedCharges = [...otCharges];
                        updatedCharges[index].perHourCost = e.target.value;
                        updatedCharges[index].amount =
                          updatedCharges[index].units *
                          updatedCharges[index].perHourCost;
                        setOtCharges(updatedCharges);
                      }}
                    />
                  ) : (
                    charge.perHourCost ? charge.perHourCost : '-'
                  )}
                </td>
                <td>

                  {charge.isEditing ? (
                    <input
                      type="number"
                      name="quantity"
                      value={charge.quantity}
                      onChange={(e) => {
                        const updatedCharges = [...otCharges];
                        updatedCharges[index].quantity = e.target.value;
                        updatedCharges[index].amount =
                          updatedCharges[index].units *
                          updatedCharges[index].perHourCost;
                        setOtCharges(updatedCharges);
                      }}
                    />
                  ) : (
                    charge.quantity ? charge.quantity : '-'
                  )}

                </td>
                <td>
                  {charge.isEditing ? (
                    <input type="number" value={charge.amount} readOnly />
                  ) : (
                    charge.amount
                  )}
                </td>
                {/* <td>
                  {charge.isEditing ? (
                    <>
                      <Button onClick={() => handleSaveEdit(index)}>
                        <CheckIcon />
                      </Button>
                      <Button onClick={() => handleCancelEdit(index)}>
                        <CancelIcon />
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEditCharge(charge.id)}>
                      <EditIcon />
                    </Button>
                  )}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {consumables.length > 0 && (
        <>
          {renderConsumablesTable()}

          <div className="Main_container_Btn">
          <button style={{ width: 134 }} onClick={() => openModal()}>
              Add New Consumable
            </button>
          </div>

          <div className="Main_container_Btn">
            <button onClick={handleconSubmit}>Save</button>
          </div>   

        </>
      )}
 
{openModal2 && (
          <div className="loader" onClick={handleCloseModal1}>
            <div className="cardModel" onClick={(e) => e.stopPropagation()}>
              <div className="Main_container_app">
                
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
                      <Button onClick={handlesubmitConsumable}>
                        <AddIcon />
                      </Button>
          </div>

          {consumables.length > 0 && renderConsumablesTable()}

              </div>
            </div>
          </div>
        )} 

      <div className="Main_container_Btn">
        <button onClick={handlebillSubmit}>Proceed Billing</button>
      </div>

      <ToastAlert Message={toast.message} Type={toast.type} />

    </div>
  );
};

export default OtCharges;
