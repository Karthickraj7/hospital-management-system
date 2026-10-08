import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const Mrd_rack = () => {
  const [rackState, setRackState] = useState({
    RackId: "",
    RackName: "",
  });

  const [rackArray, setRackArray] = useState([]);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();


  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setRackState((prev) => ({
        ...prev,
        [name]: name === "RackName" ? value.toUpperCase() : value,
    }));
  }

  const handleSaveRack=()=>{
    if(!rackState.RackName.trim()){
        dispatchvalue({
            type:"toast",
            value:{message: "Rack name is required", type:"warn"},
        });
        return;
    }

  const sendData ={
    RackID : rackState.RackId,
    RackName : rackState.RackName,
    created_by : userRecord?.username ||"",
  }

  axios.post(`${UrlLink}MRD/MRD_Rack_Details_link`,sendData)
  .then((response) => {
    if (type==="success") {
        setRackState({RackId:"",RackName:""});
        // getRackData();
    }
  })
  .catch((error)=>{
    console.error(error);
    dispatchvalue({
        type:"toast",
        value:{message: "Failed to save rack",type:"error"},
    });
  });
 }

  return (
    <div className="Main_container_app">
      <h3>MRD Rack Master</h3>
      <div className="common_center_tag">
        <span>Rack Name</span>
      </div>
      <br />
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>
            Rack Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="RackName"
            autoComplete="off"
            required
            value={rackState.RackName}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <br />
      <div className="Main_container_Btn">
        <button onClick={handleSaveRack}>
            {rackState.RackId?"Update" :"Add"}
        </button>
      </div>
      <br />
      {/* <ReactGrid columns={rackColumns} RowData={rackArray} /> */}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );

};

export default Mrd_rack;

