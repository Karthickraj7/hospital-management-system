import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
const Medications = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.TherapistWorkbenchNavigation); 
  const[summaaa, setsummaaa] = useState(false)
  const [Medications, setMedications] = useState({
    GenericName: '', // Store Generic Name
    GenericId: '',   // Store Generic ID
    ItemName: '',     // Store Item Name
    ItemId: '',       // Store Item ID
    ItemType: '',
    Dose: '',
    Allergic: 'No', // Default value is 'No'
    AdministrationDate: '',
    TechniciansRemarks: '',
    BeforeMedications: '',
    AfterMedications: '',
  });

  const [genericName, setGenericName] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const [summa, setsumma] = useState([])
  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'GenericName') {
      const selectedItem = genericName.find((item) => item.Generic_Name === value);
      if (selectedItem) {
        setMedications((prev) => ({
          ...prev,
          GenericName: selectedItem.Generic_Name,  // Update GenericName state
          GenericId: selectedItem.id,  // Update GenericId state
        }));

        // Fetch Item Names based on selected GenericId
        axios
          .get(`${UrlLink}Workbench/Item_Names_Link`, {
            params: {
              Genericnameid: selectedItem.id,
              Location: userRecord.location,
            },
          })
          .then((response) => {
            setItemNames(response.data); // Update state with fetched item names
          })
          .catch((err) => {
            console.error('Error fetching item names:', err);
          });
      }
    }

    if (name === 'ItemName') {
      const selectedItem = itemNames.find((item) => item.ItemName === value);
      if (selectedItem) {
        setMedications((prev) => ({
          ...prev,
          ItemName: selectedItem.ItemName,    // Update ItemName state
          ItemId: selectedItem.ItemId,        // Update ItemId state
        }));
        
        // Optionally, fetch additional data about Item Types (if needed)
        axios
          .get(`${UrlLink}Workbench/Item_Types_Link`, {
            params: {
              Itemid: selectedItem.ItemId, // Pass the selected ItemId
            },
          })
          .then((response) => {
           setMedications((prev)=>({
            ...prev,
            Dose: response.data[0]?.Dose || value, // If response.data[0].Dose exists, use it; otherwise, use 'value'
            ItemType: response.data[0]?.ProductTypeName || value,
           }))
          })
          .catch((err) => {
            console.error('Error fetching item types:', err);
          });
      }
    }

    // Handle other input changes like Dose, Allergic, etc.
    setMedications((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Yes' : 'No') : value,
    }));
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Medical_Stock_InsetLink_for_Prescription`)
      .then((response) => {
        setGenericName(response.data); // Set the generic names when the component mounts
      })
      .catch((error) => {
        console.error('Error fetching generic names:', error);
      });
  }, [UrlLink]);



  console.log(Medications, 'hdgdhdghfgffhghghg');

  const handleSave = () =>{
    const postdata = {
      Patient_id : DoctorWorkbenchNavigation?.Patient_id,
    Registration_Id : DoctorWorkbenchNavigation?.Registration_id,
    createdBy : userRecord?.username,
    Location : userRecord?.location,
    ...Medications
    }
    axios.post(`${UrlLink}Ip_Workbench/Insert_Into_Medicstions_Table`, postdata)
    .then((response)=>{
      console.log(response);
      setsummaaa(prev=>(!prev))
      setMedications({
        GenericName: '',   
        GenericId: '',   
        ItemName: '',    
        ItemId: '',      
        ItemType: '',
        Dose: '',
        Allergic: 'No',
        AdministrationDate: '',
        TechniciansRemarks: '',
        BeforeMedications: '',
        AfterMedications: '',
      })
      
    })
    .catch((error)=>{
      console.log(error);
      
    })
  }

  useEffect(()=>{
    axios.get(`${UrlLink}Ip_Workbench/Insert_Into_Medicstions_Table?Patientid=${DoctorWorkbenchNavigation?.Patient_id}&Visitid=${DoctorWorkbenchNavigation?.Visit_id}`)
    .then((response)=>{
      console.log(response);
      setsumma(response.data)
    })
    .catch((error)=>{
      console.log(error);
      
    })
  },[UrlLink, summaaa])

    
  const TheropyTypeColumns = [
    {
        key: "Id",
        name: "S No",
        frozen: true
    },
    {
      key: "createdBy",
      name: "createdBy",

  },
    {
        key: "Patientname",
        name: "Patient Name",
        frozen: true
    },
    {
        key: "Visitid",
        name: "Visit Id",
        frozen: true
    },
    {
        key: "GenericName",
        name: "Generic Name",
  
    },
    {
        key: "ItemName",
        name: "Item Name",
  
    },
    {
        key: "ItemType",
        name: "Item Type",
  
    },
    {
        key: "Dose",
        name: "Dose",
  
    },
    {
        key: "Allergic",
        name: "Allergic",
  
    },
    {
        key: "Remarks",
        name: "Remarks",
  
    },
    {
      key: "BeforeCondition",
      name: "Before Condition",

  },
  {
    key: "AfterMedications",
    name: "After Condition",

},
]


  
  return (
    <div className="Main_container_app">
      <h3>Medications</h3>
      <br />
      <div className="RegisFormcon">
        {/* Generic Name */}
        <div className="RegisForm_1">
          <label htmlFor="GenericName">
            {formatLabel('GenericName')} <span>:</span>
          </label>
          <input
            type="text"
            name="GenericName"
            value={Medications.GenericName} // Bind GenericName to state
            list="genericNameList"
            onChange={handleChange}
          />
          <datalist id="genericNameList">
            <option value="">Select</option>
            {genericName.map((generic, index) => (
              <option key={index} value={generic.Generic_Name} />
            ))}
          </datalist>
        </div>

        {/* Item Name */}
        <div className="RegisForm_1">
          <label htmlFor="ItemName">
            {formatLabel('ItemName')} <span>:</span>
          </label>
          <input
            type="text"
            name="ItemName"
            value={Medications.ItemName} // Bind ItemName to state
            list="itemNameList"
            onChange={handleChange}
            disabled={!Medications.GenericName} // Disable if no GenericName selected
          />
          <datalist id="itemNameList">
            <option value="">Select</option>
            {itemNames.map((item, index) => (
              <option key={index} value={item.ItemName} />
            ))}
          </datalist>
        </div>

        {/* Dose */}
        <div className="RegisForm_1">
          <label htmlFor="Dose">
            {formatLabel('Dose')} <span>:</span>
          </label>
          <input
            type="text"
            name="Dose"
            value={Medications.Dose}
            onChange={handleChange}
          />
        </div>

        {/* Allergic */}
        <div className="RegisForm_1">
          <label htmlFor="Allergic">
            {formatLabel('Allergic')} <span>:</span>
          </label>
          <input
            type="checkbox"
            name="Allergic"
            checked={Medications.Allergic === 'Yes'}
            onChange={handleChange}
          />
        </div>

        {/* Administration Date */}
        <div className="RegisForm_1">
          <label htmlFor="AdministrationDate">
            {formatLabel('AdministrationDate')} <span>:</span>
          </label>
          <input
            type="date"
            name="AdministrationDate"
            value={Medications.AdministrationDate}
            onChange={handleChange}
          />
        </div>

        {/* Technicians Remarks */}
        <div className="RegisForm_1">
          <label htmlFor="TechniciansRemarks">
            {formatLabel('TechniciansRemarks')} <span>:</span>
          </label>
          <textarea
            name="TechniciansRemarks"
            value={Medications.TechniciansRemarks}
            onChange={handleChange}
          />
        </div>

        {/* Before Medications */}
        <div className="RegisForm_1">
          <label htmlFor="BeforeMedications">
            {formatLabel('BeforeMedications')} <span>:</span>
          </label>
          <textarea
            name="BeforeMedications"
            value={Medications.BeforeMedications}
            onChange={handleChange}
          />
        </div>

        {/* After Medications */}
        <div className="RegisForm_1">
          <label htmlFor="AfterMedications">
            {formatLabel('AfterMedications')} <span>:</span>
          </label>
          <textarea
            name="AfterMedications"
            value={Medications.AfterMedications}
            onChange={handleChange}
          />
        </div>


      </div>

      <div className="Register_btn_con">
            <button className="RegisterForm_1_btns" onClick={handleSave}>
              Save
            </button>
            
          </div>


          {<ReactGrid columns={TheropyTypeColumns} RowData={summa} />}
    </div>
  );
};

export default Medications;
