import React, { useState } from "react";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import axios from "axios";
import { useSelector } from "react-redux";

const DonorConscentForm = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [donorId, setDonorId] = useState("");
  const [donorPersonalData, setDonorPersonalData] = useState(null);

  const fetchDonorPersonalData = async () => {
    if (!donorId.trim()) {
      return alert("Enter Donor ID");
    }
  
    try {
      const res = await axios.get(`${UrlLink}BloodBank/Donor/master/by/id/${donorId}/`);
  
      if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
        setDonorPersonalData(res.data[0]); // ✅ fix here
        console.log("Donor Data:", res.data[0]);
      } else {
        alert("Donor not found.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Something went wrong fetching Donor data");
    }
  };
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonorPersonalData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="Main_container_app">
      <h3>Donor Consent Form</h3>
      <br />
      <div className="RegisFormcon">
        <div className="Search_patient_icons" style={{ alignContent: "center" }}>
          <div className="RegisForm_1" style={{ alignItems: "center" }}>
            <label>DONOR ID :</label>
            <input
              type="text"
              value={donorId}
              onChange={(e) => setDonorId(e.target.value)}
            />
            <PersonSearchIcon
              onClick={fetchDonorPersonalData}
              className="Main_container_BtnQA"
              style={{ cursor: "pointer", marginLeft: "10px" }}
            />
          </div>
        </div>
      </div>

      {donorPersonalData && (
        <>
          <h3> Personal Data </h3>
          <br />
          <div className="RegisFormcon">
            <div className="RegisForm_1">
              <label>Name  <span>:</span></label>
              <input
                type="text"
                name="name"
                value={donorPersonalData.name || ""}
                onChange={handleChange}
                required
              />

            </div>
            <div className="RegisForm_1">

            <label>Blood Group <span>:</span></label>
              <input
                type="text"
                name="name"
                value={donorPersonalData.blood_group.BloodGroup_Name || ""}
                onChange={handleChange}
                required
              />

           
              </div>
            <br /><br />  
            <div className="RegisForm_text">
                        <label>Address <span>:</span></label>
                        <textarea name="address" value={donorPersonalData.address || ""} onChange={handleChange} />
                    </div>
            <div className="RegisForm_1">
              <label>Contact No:</label>
              <input
                type="text"
                name="contact_number"
                value={donorPersonalData.contact_number || ""}
                onChange={handleChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={donorPersonalData.email || ""}
                onChange={handleChange}
              />
            </div>
           
            <div className="RegisForm_1">
              <label>Status:</label>
              <input
                type="checkbox"
                name="status"
                checked={donorPersonalData.status || true}
                onChange={handleChange}
              />
            </div>
            <br />
            <br />
            <br />
          </div>
        </>
      )}
    </div>
  );
};

export default DonorConscentForm;
