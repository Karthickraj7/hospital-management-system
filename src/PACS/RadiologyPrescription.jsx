
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { IconButton } from '@mui/material';

const RadiologyPrescription = () => {
  const dispatch = useDispatch();
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);
  const RadiologyWorkbenchNavigation = useSelector(state => state.Frontoffice?.RadiologyWorkbenchNavigation);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord",userRecord);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  console.log("selectedMedicines",selectedMedicines);
  const [PrescriptionData, setPrescriptionData] = useState({
    ContrastType: '',
    PreTestMedications: '',
    MedicationName: '',
    Allergic: false,
    Dosage: '',
    Route: '',
    CurrentTime: '',
    CurrentDate:'',
    TechniciansRemarks:'',
    PatientConsult:'',
  });
  // const [IsViewMode, setIsViewMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const dispatchvalue = useDispatch();
  const [IsGetData,setIsGetData] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [gridData, setGridData] = useState([]);
  // Function to get the current time
  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toTimeString().slice(0, 5); // Extracting HH:MM
    const formattedDate = now.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    setPrescriptionData(prevState => ({
      ...prevState,
      CurrentTime: formattedTime,
      CurrentDate: formattedDate,
    }));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData({
      ...PrescriptionData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setPrescriptionData({
      ...PrescriptionData,
      Allergic: e.target.checked,
    });
  };
  const handleCheckboxChangeone = (e) => {
    setPrescriptionData({
      ...PrescriptionData,
     PatientConsult: e.target.checked,
    });
  };

  const updateMedicine = () => {
    setIsButtonVisible(false);
    const updatedMedicines = [...selectedMedicines];
  
    // Update the selected medicine with the current PrescriptionData
    updatedMedicines[editIndex] = {
      id: selectedMedicines[editIndex].id,
      ...PrescriptionData,
    };
  
    // Update the selected medicines state and reset the edit index
    setSelectedMedicines(updatedMedicines);
    setEditIndex(null);
  
    // Get the current date and time
    const now = new Date();
  
    // Format the date as "yyyy-MM-dd" for input type="date"
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const day = String(now.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const formattedDate = `${year}-${month}-${day}`; // Format for input type="date"
  
    // Format the time as "HH:MM"
    const formattedTime = now.toTimeString().slice(0, 5); // Get time in HH:MM format
  
    // Clear form data after updating, keeping the correct date/time formats
    setPrescriptionData((prevState) => ({
      ...prevState,
      ContrastType: '',
      PreTestMedications: '',
      MedicationName: '',
      Allergic: false,
      Dosage: '',
      Route: '',
      CurrentTime: formattedTime, // Set time in "HH:MM" format
      CurrentDate: formattedDate, // Set date in "yyyy-MM-dd" format
      TechniciansRemarks: '',
      PatientConsult: prevState.PatientConsult || false, // Clear PatientConsult
    }));
  };
  

  
  const addMedicine = () => {
    setIsButtonVisible(false);
    // setIsButtonDisabled(true);
    const medicineData = {
      id: selectedMedicines.length + 1,
      ...PrescriptionData, // Spreads all PrescriptionData fields into medicineData
    };
  
    // Checking for duplicates based on MedicationName (assuming ItemName refers to MedicationName)
    const isDuplicate = selectedMedicines.some(
      (medicine) => medicine.MedicationName === medicineData.MedicationName
    );
  
    if (isDuplicate) {
      const tdata = {
        message: 'Medicine with the same Item Name is already added',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
    } else {
      setSelectedMedicines([...selectedMedicines, medicineData]); // Add new medicine to the list
    }
  
    // Reset PrescriptionData after adding a medicine
    const now1 = new Date();

    // Convert the current date to "yyyy-MM-dd" format for the input field
    const year = now1.getFullYear();
    const month = String(now1.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(now1.getDate()).padStart(2, '0'); // Add leading zero if needed
    
    const formattedDate1 = `${year}-${month}-${day}`; // "yyyy-MM-dd" format for input type="date"
    
    // Optional: You can display the date as "dd-MM-yyyy" elsewhere if needed
    const displayDate = `${day}-${month}-${year}`;
    setPrescriptionData((prevState) => ({
      ...prevState,
      ContrastType: '',
      PreTestMedications: '',
      MedicationName: '',
      Allergic: false,
      Dosage: '',
      Route: '',
      CurrentDate: formattedDate1, // Use "yyyy-MM-dd" format for the input field
    CurrentTime: now.toTimeString().slice(0, 5), 
      TechniciansRemarks: '',
      // Keep the PatientConsult value from the previous state
      PatientConsult: prevState.PatientConsult || false,
    }));
  
    // Optional: If you need the current time to be updated immediately again after reset
    const now = new Date();
    const formattedTime = now.toTimeString().slice(0, 5); // HH:MM format
    setPrescriptionData(prevState => ({
      ...prevState,
      CurrentDate:formattedDate1,
      CurrentTime: formattedTime,
    }));
  };

  const handleEditMedicine = (index)=>{
    setIsButtonVisible(true);
    const selectedMedicine = selectedMedicines[index];
    setPrescriptionData({ ...selectedMedicine });
    setEditIndex(index);
  }

  const handleDeleteMedicine = (index) =>{
    setIsButtonVisible(true);
    const updatedMedicines = selectedMedicines.filter((_, i) => i !== index);
    setSelectedMedicines(updatedMedicines);
    setEditIndex(null);
  }
  
const handleSubmitButtonClick = () =>{
  let registrationId = null;
  if (selectedMedicines.length > 0) {
    // Check if PatientConsult is false for the first medicine
    if (selectedMedicines[0].PatientConsult === false || selectedMedicines[0].PatientConsult === "") {
      const tdata = {
        message: 'Please fill in the Patient Concern correctly.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
      return; // Exit early if there's a warning
    }
  }
  
  // Check if RadiologyWorkbenchNavigation and its params exist
  if (RadiologyWorkbenchNavigation && RadiologyWorkbenchNavigation.params) {
    registrationId = RadiologyWorkbenchNavigation.params.RegistrationId;
  }
  const senddata = {
    ...PrescriptionData,
    SelectedMedicine:selectedMedicines || [],
    RegistrationId: registrationId,  // Use the registrationId here
    Registertype: RadiologyWorkbenchNavigation?.params?.RegisterType,  // Safely access RegisterType
    Createdby: userRecord?.username,
  }
  console.log(senddata, 'senddata');
  axios.post(`${UrlLink}OP/Radiology_MedicalSection_Details_Link`, senddata)
  .then((res)=>{
    const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
    dispatchvalue({ type: 'toast', value: { message, type } });
    setIsGetData(prev => !prev); 
   handleClear();
  })
  .catch((err) =>console.log(err));
}




const handleClear = () => {
  // Get current date and time for resetting
  const nows = new Date();

  // Convert the current date to "yyyy-MM-dd" format for the input field
  const year = nows.getFullYear();
  const month = String(nows.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
  const day = String(nows.getDate()).padStart(2, '0'); // Add leading zero if needed
  
  const formattedDates = `${year}-${month}-${day}`; // "yyyy-MM-dd" format for input type="date"
  
  // Optional: You can display the date as "dd-MM-yyyy" elsewhere if needed
  const displayDate = `${day}-${month}-${year}`;
  setPrescriptionData((prevState) => ({
    ...prevState, // Retain other fields that should not be reset
    ContrastType: '',
    PreTestMedications: '',
    MedicationName: '',
    Allergic: false,
    Dosage: '',
    Route: '',
    CurrentDate: formattedDates,
    CurrentTime: nows.toTimeString().slice(0, 5), 
    TechniciansRemarks: '',
    PatientConsult: '',
  }));
  setIsButtonVisible(false);
  setSelectedMedicines([]);
};

useEffect(() =>{
  const RegistrationId = RadiologyWorkbenchNavigation?.params.RegistrationId;
  const RegisterType = RadiologyWorkbenchNavigation?.params.RegisterType;

  if(RegistrationId){
    axios.get(`${UrlLink}OP/Radiology_MedicalSection_Details_Link`, {
      params: {
        RegistrationId: RegistrationId,
        Registertype: RegisterType,
      },
    })
      .then((res) => {
        const data = res.data;
        console.log('medication Data:', data);


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

  

},[UrlLink, RadiologyWorkbenchNavigation, IsGetData]);

const MedicationSectionColumns = [
  {
    key: 'id',
    name: 'S.No',
    frozen: true
  },
 { key: 'ContrastType', name: 'ContrastType', width:"180px",},
 {
  key: 'PreTestMedications',
  name: 'PreTestMedications',
  width:"160px",
},
{
  key: 'Medication_Name',
  name: 'MedicationName',
  width:"160px",
},
{
  key: 'Allergic',
  name: 'Allergic',

},
{
  key: 'Dosage',
  name: 'Dosage',
},
{
  key: 'Route',
  name: 'Route',
},
{
  key: 'TechniciansRemarks',
  name: 'TechniciansRemarks',
  width:"180px",
},
{
  key: 'PatientConcern',
  name: 'PatientConcern',
},
  {
    key: 'AdministrationDate',
    name: 'Administration Date',
    width:"180px",
  },
  {
    key: 'AdministrationTime',
    name: 'Administration Time',
    width:"180px",
  },

]



  return (
    <>
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label htmlFor="ContrastType">
            Contrast Type<span>:</span>
          </label>
          <select
            id="ContrastType"
            name="ContrastType"
            value={PrescriptionData.ContrastType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="IodineBased">IodineBased</option>
            <option value="GadoliniumBased">GadoliniumBased</option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="PreTestMedications">
            PreTest Medications<span>:</span>
          </label>
          <input
            id="PreTestMedications"
            name="PreTestMedications"
            value={PrescriptionData.PreTestMedications}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="llpo05qaqwe">
          <div className="nmllkio84">
            <label>
              <input
                type="checkbox"
                checked={PrescriptionData.Allergic}
                onChange={handleCheckboxChange}
              />
              Allergic
            </label>
          </div>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="MedicationName">
            Medication Name<span>:</span>
          </label>
          <input
            id="MedicationName"
            name="MedicationName"
            value={PrescriptionData.MedicationName}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="Dosage">
            Dosage<span>:</span>
          </label>
          <input
            id="Dosage"
            name="Dosage"
            value={PrescriptionData.Dosage}
            onChange={handleChange}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="Route">
            Route<span>:</span>
          </label>
          <select
            id="Route"
            name="Route"
            value={PrescriptionData.Route}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Oral">Oral</option>
            <option value="IV">IV</option>
            <option value="Intramuscular">Intramuscular</option>
          </select>
        </div>
     
     
     
        <div className="RegisForm_1">
          <label htmlFor="CurrentTime">
           Administration Date &Time<span>:</span>
          </label>
          <input
        type="date"
        id="CurrentDate"
        name="CurrentDate"
        value={PrescriptionData.CurrentDate}
        onChange={handleChange}
            readOnly
          />
          <input
        type="time"
        id="CurrentTime"
        name="CurrentTime"
        value={PrescriptionData.CurrentTime}
        onChange={handleChange}
            readOnly
          />
        </div>
        <div className="RegisForm_1">
                  <label htmlFor="TechniciansRemarks">
                    Technician's Remarks<span>:</span>
                  </label>
                  <textarea
                    id="TechniciansRemarks"
                    name="TechniciansRemarks"
                    rows="5"
                    value={PrescriptionData.TechniciansRemarks}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="RegisForm_1">
            <label>
              <input
              name="PatientConsult"
                type="checkbox"
                checked={PrescriptionData.PatientConsult}
                onChange={handleCheckboxChangeone}
              />
            PatinetConsern
            </label>
          </div>
      </div>
      <div className="Main_container_Btn">
      {isButtonVisible && (
        <button
          className="RegisterForm_1_btns"
          type="button"
          onClick={editIndex !== null ? updateMedicine : addMedicine}
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      )}
    </div>
                
              {selectedMedicines.length > 0 && (
                <div className="for">
                  <div className="Add_items_Purchase_Master">
                    <span>Selected Medicine</span>
                  </div>
                  <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th id="slectbill_ins">ContrastType</th>
                          <th id="slectbill_ins">PreTestMedications</th>
                          <th id="slectbill_ins">MedicationName</th>
                          {/* <th id="slectbill_ins">Allergic</th> */}
                          <th id="slectbill_ins">Dosage</th>
                          <th id="slectbill_ins">Route</th>
                          <th id="slectbill_ins">AdminisrationDate</th>
                          <th id="slectbill_ins">AdminisrationTime</th>
                          <th id="slectbill_ins"> TechniciansRemarks</th>
                          <th id="slectbill_ins">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMedicines.map((medicineInfo, index) => (
                          <tr key={index}>
                            <td>{medicineInfo.ContrastType}</td>
                            <td>{medicineInfo.PreTestMedications}</td>
                            <td>{medicineInfo.MedicationName}</td>
                            {/* <td>{medicineInfo.Allergic}</td> */}
                            <td>{medicineInfo.Dosage}</td>
                            <td>{medicineInfo.Route}</td>
                            <td>
                            {new Date(medicineInfo.CurrentDate).toLocaleDateString('en-GB')}
                            </td>
                            <td>
                              {medicineInfo.CurrentTime}
                            </td>
                            <td>{medicineInfo.TechniciansRemarks}</td>

                            <td>
                              <button
                                className="delnamebtn"
                                onClick={() => handleEditMedicine(index)}
                              >
                                <EditIcon />
                              </button>
                              <button
                                className="delnamebtn"
                                onClick={() => handleDeleteMedicine(index)}
                              >
                                <DeleteIcon />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
             
              <div className="Main_container_Btn">
            
           
        
              <button onClick={handleSubmitButtonClick}>Submit</button>
      


                  <ToastAlert Message={toast.message} Type={toast.type} />
          </div>
          {gridData.length > 0 && (
          <>
            <ReactGrid columns={MedicationSectionColumns} RowData={gridData} />
          </>
        )}
    </>
  );
}

export default RadiologyPrescription;

