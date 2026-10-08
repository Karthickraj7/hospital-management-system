import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import { IconButton } from '@mui/material';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import VisibilityIcon from '@mui/icons-material/Visibility';
const RadiologyVitals = () => {

  const dispatch = useDispatch();
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);
  const RadiologyWorkbenchNavigation = useSelector(state => state.Frontoffice?.RadiologyWorkbenchNavigation);
  console.log(RadiologyWorkbenchNavigation, 'RadiologyWorkbenchNavigation');
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  const [VitalFormData, setVitalFormData] = useState({
    Bp: '',
    HeartRate: '',
    RespiratoryRate: '',
    Temperature: '',
    SPO2: '',
    Weight: '',
    Height: '',
  });
  const [gridData, setGridData] = useState([]);
  const [IsGetData, setIsGetData] = useState(false);

  // const [IsViewMode, setIsViewMode] = useState(false)

  
  const VitalsFormColumns = [
    {
      key: 'id',
      name: 'S.No',
      frozen: true
    },
    { key: 'Bp', name: 'Bp' },
    { key: 'HeartRate', name: 'HeartRate' },
    { key: 'RespiratoryRate', name: 'RespiratoryRate', width:"150px" },
    { key: 'Temperature', name: 'Temperature' },
    { key: 'SPO2', name: 'SPO2' },
    { key: 'Weight', name: 'Weight' },
    { key: 'Height', name: 'Height' },

    {
      key: 'Date',
      name: 'Date',
    },
    {
      key: 'Time',
      name: 'Time',
    },



    // {
    //   key: 'view',
    //   frozen: true,
    //   name: 'View',
    //   renderCell: (params) => (
    //     <IconButton onClick={() => handleView(params.row)}>
    //       <VisibilityIcon />
    //     </IconButton>
    //   ),
    // },

  ]
  // Handle setting the form data when viewing
  // const handleView = (data) => {
  //   setVitalFormData({
  //     Bp:data.Bp || '',
  //     HeartRate: data.HeartRate || '',
  //     RespiratoryRate: data.RespiratoryRate || '',
  //     Temperature: data.Temperature || '',
  //     SPO2: data.SPO2 || '',
  //     Weight: data.Weight || '',
  //     Height: data.Height || '',
  //   });
  //   setIsViewMode(true);
  // };
  const handleClear = () => {
    setVitalFormData({
      Bp: '',
      HeartRate: '',
      RespiratoryRate: '',
      Temperature: '',
      SPO2: '',
      Height: '',
      Weight: '',
    });
    // setIsViewMode(false);
  };
  useEffect(() => {
    const RegistrationId = RadiologyWorkbenchNavigation?.params.RegistrationId;
    const RegisterType = RadiologyWorkbenchNavigation?.params.RegisterType;

    if (RegistrationId) {
      axios.get(`${UrlLink}OP/RadiologyVitals_Form_Details_Link`, {
        params: {
          RegistrationId: RegistrationId,
          Registertype: RegisterType,
        },
      })
        .then((res) => {
          const data = res.data;
          console.log('API Data:', data);


          if (Array.isArray(data)) {
            setGridData(data);
          } else {
            console.error('Expected array but got:', data);
          }
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
        });
    }
  }, [UrlLink, RadiologyWorkbenchNavigation, IsGetData]);



  const HandleOnChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = value.trim();
    setVitalFormData((prevFormData) => ({
      ...prevFormData,
      [name]: formattedValue,
    }));
  };


  const handleVitalFormSubmit = () => {


    // Initialize registrationId with a default value
    let registrationId = null;

    // Check if RadiologyWorkbenchNavigation and its params exist
    if (RadiologyWorkbenchNavigation && RadiologyWorkbenchNavigation.params) {
      registrationId = RadiologyWorkbenchNavigation.params.RegistrationId;
    }
  if (!VitalFormData.Height || !VitalFormData.Weight) {
    const tdata = {
      message:"Please Fill Height and Weight.",
      type:"warn",
    };
    dispatch({type:"toast", value:tdata});
  }
    
    const senddata = {
      ...VitalFormData,
      RegistrationId: registrationId,  // Use the registrationId here
      Registertype: RadiologyWorkbenchNavigation?.params?.RegisterType,  // Safely access RegisterType
      Createdby: userRecord?.username,
    }

    console.log(senddata, 'senddata');

    // Make API request using axios
    axios.post(`${UrlLink}OP/RadiologyVitals_Form_Details_Link`, senddata)
      .then((res) => {
        const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
        dispatch({ type: 'toast', value: { message, type } });
        setIsGetData(prev => !prev);  // Trigger data refresh or re-fetch
        handleClear();  // Clear form or reset states
      })
      .catch((err) => console.log(err));  // Handle any errors
  }

  const handleBpChange = (e) => {
    const { name, value } = e.target;
  
    // Remove any non-numeric characters except the `/`
    let cleanedValue = value.replace(/[^\d/]/g, '');
  
    // If there's no `/` yet and the length is greater than 3, insert `/`
    if (!cleanedValue.includes('/') && cleanedValue.length > 3) {
      cleanedValue = `${cleanedValue.slice(0, 3)}/${cleanedValue.slice(3)}`;
    } else if (cleanedValue.includes('/')) {
      // Split into systolic and diastolic parts if `/` is already present
      const parts = cleanedValue.split('/');
      const systolic = parts[0].slice(0, 3); // Only allow up to 3 digits for systolic
      const diastolic = parts[1] ? parts[1].slice(0, 3) : ''; // Only allow up to 3 digits for diastolic
      cleanedValue = `${systolic}/${diastolic}`;
    }
  
    // Update the state with the formatted value
    setVitalFormData((prevState) => ({
      ...prevState,
      [name]: cleanedValue,
    }));
  };
  
  
  


  return (
    <>
      <div className="RegisFormcon_1">
        {Object.keys(VitalFormData).map((p, index) => (
          <div className="RegisForm_1" key={p}>
            <label htmlFor={`${p}_${index}`}>
              {formatLabel(p)} <span>:</span>
            </label>
  
            <input
              id={`${p}_${index}`}
              autoComplete="off"
              type="text"
              name={p}
              value={VitalFormData[p]}
              // readOnly={IsViewMode}
              // // Custom onChange for Bp field
              onChange={p === "Bp" ? handleBpChange : HandleOnChange}
            />
          </div>
        ))}
  
        <br />
  
        <div className="Main_container_Btn">
          {/* {IsViewMode && <button onClick={handleClear}>Clear</button>} */}
         <button onClick={handleVitalFormSubmit}>Submit</button>
        </div>
  
        {gridData.length > 0 && (
          <>
            <ReactGrid columns={VitalsFormColumns} RowData={gridData} />
          </>
        )}
  
        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
  
  
}

export default RadiologyVitals

