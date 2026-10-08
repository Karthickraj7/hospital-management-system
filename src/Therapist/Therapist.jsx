import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Therapist = () =>  {

 const navigate = useNavigate()   
 const TherapyWorkbenchNavigation = useSelector(state => state.Frontoffice?.TherapistWorkbenchNavigation);
 console.log('therapy',TherapyWorkbenchNavigation);
 const UrlLink = useSelector(state => state.userRecord?.UrlLink);
 const therapy_page = TherapyWorkbenchNavigation.Therapy_Type_Name
  const [formData, setFormData] = useState({
    RegisterationId : TherapyWorkbenchNavigation?.Registration_Id,
    Register_type : TherapyWorkbenchNavigation?.RegisterType,
    Therapy_Type_Id : TherapyWorkbenchNavigation?.Therapy_Type_Id,
    Remarks: '',
    Status: '',
    Next_Seesion_Date: '',
    request_id:TherapyWorkbenchNavigation.Request_Id,
    Sessions:TherapyWorkbenchNavigation.Sessions

  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${UrlLink}OP/therapy_Updation_from_therapist`, formData);
      console.log('Saved successfully:', response.data);
      alert("Saved successfully");
      navigate(`/Home/${therapy_page}`)
      
    } catch (error) {
      console.error('Error saving:', error);
      alert("Error while saving");
    }
  };

  return (
    <>
      <br /><br /><br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>Remarks <span>:</span></label>
          <textarea
            name="Remarks"
            value={formData.Remarks}
            onChange={handleChange}
          />
        </div>

        <br /><br />

        <div className="RegisForm_1">
          <label>Status <span>:</span></label>
          <select
            name="Status"
            id="Status"
            value={formData.Status}
            onChange={handleChange}
          >
            <option value="">select</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <br /><br />

        <div className="RegisForm_1">
          <label>Next Session Date <span>:</span></label>
          <input
            type="date"
            name="Next_Seesion_Date"
            value={formData.Next_Seesion_Date}
            onChange={handleChange}
          />
        </div>

        <br /><br />

        <div className="Main_container_Btn">
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </>
  );
};

export default Therapist;
