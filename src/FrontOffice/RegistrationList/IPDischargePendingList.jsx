import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CancelIcon from "@mui/icons-material/Cancel";

const IPDischargePendingList = () => {


    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

    const [searchOPParams, setsearchOPParams] = useState({
        query: "",
        status: "Pending",
      });

    const [PatientRegisterData, setPatientRegisterData] = useState([]);
    


    const RegisterColumn = [
    {
      key: "SerialNo",
      name: "S.No",
    },
    {
      key:"Registration_Id",
      name:"IPno"
    },
    {
      key: "PatientId",
      name: "Patient Id",
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
    },
    {
      key: "Department",
      name: "Department",
    },
    {
      key: "UpdatedAt",
      name: "checked at",
    },
    {
      key: "BillingStatusCheckedBy",
      name: "BillingCheckedBy",
    },

  ];

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setsearchOPParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


   useEffect(() => {
      axios
        .get(
          `${UrlLink}Ip_Workbench/get_ippatient_discharge_pending_list`,
          { params: searchOPParams }
        )
        .then((res) => {
          const ress = res.data;

          console.log(ress.data,'ressssssssss')
          if (Array.isArray(ress.data)) {
            setPatientRegisterData(ress.data);
          } else {
            setPatientRegisterData([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, [UrlLink, searchOPParams]);




  return (
    <>

        <div className="Main_container_app">
        <h3>IP Discharge Pending List</h3>
        <br />
        <div className="search_div_bar">
          <div className=" search_div_bar_inp_1">
            <label htmlFor="">
              Search by
              <span>:</span>
            </label>
            <input
              type="text"
              name="query"
              value={searchOPParams.query}
              placeholder="Patient ID or Name or PhoneNo "
              onChange={handleSearchChange}
            />
          </div>
          <div className=" RegisForm_1">
            <label htmlFor="">
              Status
              <span>:</span>
            </label>
            <select
              name="status"
              value={searchOPParams.status}
              onChange={handleSearchChange}
            >
              <option value="">Select</option>
              <option value="Pending">Pending</option>
              <option value="Admitted">Admitted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <br />

        <ReactGrid columns={RegisterColumn} RowData={PatientRegisterData} />
      </div>


    </>
  )
}

export default IPDischargePendingList
