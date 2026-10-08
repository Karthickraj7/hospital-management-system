import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import axios from "axios";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";


const VaccinationMaster = () => {
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [load, setLoad] = useState(false);
  const [vaccinList, setVaccinList] = useState([]);
  const [vaccinData, setVaccinData] = useState({
    vaccinName: "",
    VaccineCategory: "",
    Age: "",
    AgeType: "years",
    DoseNo: "",
    Route: "",
    Remark: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVaccinData({
      ...vaccinData,
      [name]: value
    });
  };

  const handleClear = () => {
    setVaccinData({
      vaccinName: "",
      VaccineCategory: "",
      Age: "",
      AgeType: "years",
      DoseNo: "",
      Route: "",
      Remark: ""
    })
  }

  const handleGet = useCallback(() => {
    setLoad(true);
    axios.get(`${UrlLink}Masters/createVaccinationMaster`)
      .then((res) => {
        setVaccinList(res.data || []);
        setLoad(false)
      })
      .catch((err) => {
        console.log(err);
        setLoad(false)
      })
  }, [UrlLink])

  useEffect(() => {
    handleGet();
  }, [handleGet])

  const handleSubmit = () => {
    if (vaccinData.vaccinName === "" && vaccinData.VaccineCategory === "" && vaccinData.Age === "") {
      const tdata = {
        message: "Some details are missing...",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }
    else {
      setVaccinData({
        ...vaccinData,
        created_by: userRecord?.username || ""
      });
      axios.post(`${UrlLink}Masters/createVaccinationMaster`, vaccinData)
        .then((res) => {
          const data = res.data;
          handleClear();
          handleGet();
          const type = Object.keys(data)[0];
          const message = Object.values(data)[0];
          const tdata = {
            message: message,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }


  const handleDelete = (row) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) {
      return;
    }
    
    const finalPayload = {
      ...row,
      created_by: userRecord?.username || "",
      action: "delete"
    };

    axios.post(`${UrlLink}Masters/createVaccinationMaster`, finalPayload)
      .then((res) => {
        const data = res.data;
        handleClear();
        handleGet();
        const type = Object.keys(data)[0];
        const message = Object.values(data)[0];
        const tdata = {
          message: message,
          type: type,
        };
        dispatchvalue({ type: "toast", value: tdata });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const columns = [
    { key: "id", name: "S.No" },
    { key: "Vaccine_Name", name: "Vaccine Name" },
    { key: "VaccineCategory", name: "Vaccine Category" },
    { key: "Age", name: "Age" },
    { key: "AgeType", name: "Age Type" },
    { key: "DoseCount", name: "Dose Count" },
    { key: "Route", name: "Route" },
    { key: "Remarks", name: "Remarks" },
    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row)}>
          <DeleteIcon />
        </Button>
      ),
    },
  ]



  console.log("vaccinData", vaccinData);
  return (
    <div classsName="Main_container_app">
      <ToastAlert Message={toast.message} Type={toast.type} />

      <div className="h_head">
        <h3>Vaccination Master</h3>
      </div>
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Vaccine Name <span className="mandatory"></span>
            :
          </label>
          <input
            type="text"
            id="vaccinName"
            name="vaccinName"
            value={vaccinData.vaccinName}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Vaccine Category <span className="mandatory"></span>
            :
          </label>
          <input
            type="text"
            id="VaccineCategory"
            name="VaccineCategory"
            value={vaccinData.VaccineCategory}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Age <span className="mandatory"></span>
            :
          </label>
          <input
            type="number"
            id="Age"
            name="Age"
            value={vaccinData.Age}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Age Type <span className="mandatory"></span>
            :
          </label>
          <select
            type="text"
            id="AgeType"
            name="AgeType"
            value={vaccinData.AgeType}
            onChange={handleInputChange}>
            <option value="years">Years</option>
            <option value="months">Months</option>
            <option value="days">Days</option>
            <option value="atBirth">At Birth</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Dose Count <span className="mandatory"></span>
            :
          </label>
          <input
            type="number"
            id="DoseNo"
            name="DoseNo"
            value={vaccinData.DoseNo}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Route <span className="mandatory"></span>
            :
          </label>
          <input
            type="text"
            id="Route"
            name="Route"
            value={vaccinData.Route}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Remark <span className="mandatory"></span>
            :
          </label>
          <textarea
            type="text"
            id="Remark"
            name="Remark"
            value={vaccinData.Remark}
            onChange={handleInputChange}
          />
        </div>

      </div>
      <div className="Register_btn_con">
        <button
          className="RegisterForm_1_btns"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>


      <div className="grid">
        <ReactGrid columns={columns} RowData={vaccinList} load={load} />
      </div>
    </div>
  )
}

export default VaccinationMaster
