import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";


const TherapyRequest = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const DoctorWorkbenchNavigation = useSelector(
      (state) => state.Frontoffice?.DoctorWorkbenchNavigation
    );
  const userData = useSelector((state) => state.userRecord?.UserData);
 const [formData, setFormData] = useState({
  RegisterType: "OP",
  RegisterId: DoctorWorkbenchNavigation?.RegistrationId || DoctorWorkbenchNavigation?.pk,
  Therapy_Type: "", // This will store selected TherapyType_Id
  Therapy_Name: "",  // This will store selected Therapy_Name
  starting_date: "",  
  Remarks: "",
  sessions: 1,
  created_by: userData?.username || "",
  location: userData?.location || "",
});

  const [therapyData, setTherapyData] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  
const therapyTypes = [...new Map(
  therapyData.map((item) => [item.TherapyType_Name.TherapyType_Id, item.TherapyType_Name])
)].map(([_, value]) => value);


const filteredTherapies = therapyData.filter(
  (t) => t.TherapyType_Name.TherapyType_Id === parseInt(formData.Therapy_Type)
);

  useEffect(() => {
    // getTherapyTypes();
    getTherapyRequests();
    fetchTherapies();
  }, []);


  console.log('therapy requests',requestList)
  
      const fetchTherapies = () => {
          axios.get(`${UrlLink}Masters/therapy-type-details/`)
              .then(res => setTherapyData(res.data || []))
              .catch(err => console.error('Error fetching therapy master', err));
      };
 

  

  const getTherapyRequests = async () => {
    try {
       const params = {
  RegisterType: formData.RegisterType,
  OP_Register_Id: formData.RegisterId
};

console.log("Sending params:", params);
      const res = await axios.get(`${UrlLink}OP/get_therapy_requests`,{params});
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];

      setRequestList(data);
    } catch (err) {
    //   alert("Error loading requests", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        [`${formData.RegisterType}_Register_Id`]: formData.RegisterId,
      };
      delete payload.RegisterId;

      const res = await axios.post(`${UrlLink}OP/create_therapy_request`, payload);
      alert("Request created successfully", "success");
      setFormData({
  RegisterType: "OP",
  RegisterId: DoctorWorkbenchNavigation?.RegistrationId || DoctorWorkbenchNavigation?.pk,
  Therapy_Type: "", // This will store selected TherapyType_Id
  Therapy_Name: "",  // This will store selected Therapy_Name
  starting_date: "",  
  Remarks: "",
  sessions: 1,
  created_by: userData?.username || "",
  location: userData?.location || "",
})
      getTherapyRequests();
    } catch (err) {
      alert("Error creating request", "error");
    }
  };

  const columns = [
    { key: "Request_Id", name: "Request ID", width: 80 },
    { key: "RegisterType", name: "Type", width: 100 },
    { key: "Therapy_Type", name: "Therapy", width: 200 },
    { key: "Therapy_Name", name: "Therapy_Name", width: 200 },
    // { key: "Sessions", name: "Sessions", width: 200 },
    { key: "Status", name: "Status", width: 120 },
    { key: "created_by", name: "Created By", width: 150 },
  ];

  return (
    <div className="Main_container_app">
      <h2 className="text-xl font-bold mb-4">Therapy Request</h2>

      <div className="RegisFormcon">
       

        

      <div className="RegisForm_1">
  <label>Therapy Type</label>
  <select name="Therapy_Type" value={formData.Therapy_Type} onChange={handleInputChange}>
    <option value="">Select Therapy Type</option>
    {therapyTypes.map((tt) => (
      <option key={tt.TherapyType_Id} value={tt.TherapyType_Id}>
        {tt.TherapyType_Name}
      </option>
    ))}
  </select>
</div>

<div className="RegisForm_1">
  <label>Therapy Name</label>
  <select name="Therapy_Name" value={formData.Therapy_Name} onChange={handleInputChange}>
    <option value="">Select Therapy</option>
    {filteredTherapies.map((t) => (
      <option key={t.Therapy_Id} value={t.Therapy_Name}>
        {t.Therapy_Name}
      </option>
    ))}
  </select>
</div>


          <div className="RegisForm_1">
          <label>sessions </label>
          <input
            type="number"
            name="sessions"
            value={formData.sessions}
            onChange={handleInputChange}
            
          />
        </div>

        <div className="RegisForm_1">
          <label>Remarks</label>
          <input
            type="text"
            name="Remarks"
            value={formData.Remarks}
            onChange={handleInputChange}
            
          />
        </div>
<div className="RegisForm_1">
  <label>Starting Date</label>
  <input
    type="date"
    name="starting_date"
    value={formData.starting_date}
    onChange={handleInputChange}
  />
</div>

        <div className="Main_container_Btn">
          <button onClick={handleSubmit} >
            Save
          </button>
        </div>
      </div>

      <ReactGrid RowData={requestList || []} columns={columns} />
    </div>
  );
};

export default TherapyRequest;
