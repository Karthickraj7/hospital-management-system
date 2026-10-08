import React, { useCallback, useState } from "react";
import "./organizationold.css";
import axios from "axios";
import { useSelector } from "react-redux";

function Equipments() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const [equipmentData, setEquipmentData] = useState({
    equipmentName: "",
    equipmentType: "",
    equipmentCategory: "",
    assetType: "",
    equipmentAge: "",
    lastInspectionDate: "",
    nextInspectionDate: "",
  });
  const [productData, setProductData] = useState([]);

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipmentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchProductTypeData = useCallback(() => {
    axios
      .get(`${urllink}mainddepartment/getasset`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setProductData(data);
      })
      .catch((error) => {
        console.error("Error fetching producttype data:", error);
      });
  }, [urllink]);

  React.useEffect(() => {
    fetchProductTypeData();
  }, [fetchProductTypeData]);

  const handleequipmentsave = () => {
    axios
      .post(`${urllink}usercontrol/insertequipmentdata`, equipmentData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log("errors  :", error);
      });
  };

  return (
    <div className="appointment">
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label className="" htmlFor="Equipmentnam">
            Equipment name<span>:</span>
          </label>
          <input
            type="text"
            id="Equipmentnam"
            name="equipmentName"
            // placeholder="Enter Equipment Name"
            // className="new_clinic_form_inp111"
            required
            value={equipmentData.equipmentName}
            onChange={handleChange}
          />
        </div>

        <div className="RegisForm_1">
          <label className="" htmlFor="Equipmenttype">
            Equipment Type<span>:</span>
          </label>
          <input
            type="text"
            id="Equipmenttype"
            name="equipmentType"
            // placeholder="Enter Equipment Type"
            // className="new_clinic_form_inp111"
            required
            value={equipmentData.equipmentType}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label className="" htmlFor="Equipmentcate">
            Equipment Category <span>:</span>
          </label>
          <input
            type="text"
            id="Equipmentcate"
            name="equipmentCategory"
            // placeholder="Enter Equipment Category"
            // className="new_clinic_form_inp111"
            required
            value={equipmentData.equipmentCategory}
            onChange={handleChange}
          />
        </div>

        <div className="RegisForm_1">
          <label className="" htmlFor="assetType">
            Asset Type <span>:</span>
          </label>
          <select
            id="assetType"
            name="assetType"
            required
            // className="new_clinic_form_inp111"
            value={equipmentData.assetType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {productData.map((type, index) => (
              <option key={index} value={type.asset_type}>
                {type.asset_type}
              </option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label className="" htmlFor="Equipmentage">
            Equipment age<span>:</span>
          </label>
          <input
            type="number"
            id="Equipmentage"
            name="equipmentAge"
            // placeholder="Enter Equipment Age"
            // className="new_clinic_form_inp111"
            required
            value={equipmentData.equipmentAge}
            onChange={handleChange}
          />
        </div>

        <div className="RegisForm_1">
          <label className="" htmlFor="lastDate">
            Last Inspection Date <span>:</span>
          </label>
          <input
            type="date"
            id="lastDate"
            name="lastInspectionDate"
            // className="new_clinic_form_inp111"
            required
            value={equipmentData.lastInspectionDate}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label className="" htmlFor="nextDate">
            Next Inspection Date<span>:</span>
          </label>
          <input
            type="date"
            id="nextDate"
            name="nextInspectionDate"
            // className="new_clinic_form_inp111"
            required
            value={equipmentData.nextInspectionDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="Register_btn_con">
        <button className="new_btn1_1" onClick={handleequipmentsave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default Equipments;
