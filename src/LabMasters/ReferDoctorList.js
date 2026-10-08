import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
// import "./Neww.css";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ToastContainer, toast } from "react-toastify";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditNoteIcon from '@mui/icons-material/EditNote';



const ReferDoctorList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [summa, setsumma] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [refresh, setrefersh] = useState(false);

  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const dispatchValue = useDispatch();

  const fetch_externallab_list = useCallback(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=ReferDoctorMaster`)
      .then((response) => {
        console.log(response);
        const data = response.data.map((row) => ({
          id: row.S_No,
          ...row,
        }));
        setsumma(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [urllink, refresh]);

  useEffect(() => {
    fetch_externallab_list();
  }, [fetch_externallab_list, refresh]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredData = summa.filter((row) => {
      const lowerCaseSupplierName = row.DoctorName
        ? row.DoctorName.toLowerCase()
        : "";
      return lowerCaseSupplierName.includes(lowerCaseQuery);
    });
    setFilteredRows(filteredData);
  }, [searchQuery, summa]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlenavigate = () => {
    dispatchValue({ type: "ReferDoctorEditData", value: {} });
    navigate("/Home/Referdoctormaster");
  };

  const handleEditClick = (params) => {
    console.log(params);

    dispatchValue({ type: "ReferDoctorEditData", value: params });
    navigate("/Home/Referdoctormaster");
  };

  const hadleeditstatus = (params) => {
    console.log(params);

    let newstatus;
    if (params.Status === "Active") {
      newstatus = "Inactive";
    } else if (params.Status === "Inactive") {
      newstatus = "Active";
    }

    axios
      .post(
        `${urllink}Masters/Update_All_Masters_Status_update?DoctorID=${params.DoctorID}&newstatus=${newstatus}&Type=ReferDoctorMaster`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success === true) {
          successMsg(res.data.message);
        } else {
          userwarn(res.data.message);
        }

        setrefersh((prv) => !prv);
        fetch_externallab_list();
      })

      .catch((err) => {
        console.error();
      });
  };

  const userwarn = (warningMessage) => {
    toast.warn(`${warningMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };
  const successMsg = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  const referdoccolumn = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
      width: 300,
      frozen: true,
    },

    {
      key: "Qualification_name",
      name: "Qualification",
    },

    {
      key: "DoctorType",
      name: "Doctor Type",
    },
    {
      key: "PhoneNo",
      name: "Phone",
    },
    {
      key: "Commission_per",
      name: "Commission (%)",
    },
    {
      key: "EditAction",
      name: "Status",
      width: 90,
      renderCell: (params) => (
        <Button onClick={() => hadleeditstatus(params.row)}>
          <span style={{ color: "black" }}>{params.row.Status}</span>
        </Button>
      ),
    },
    {
      key: "EditAction1",
      name: "Action",
      width: 90,
      renderCell: (params) => (
        <Button
          onClick={() => handleEditClick(params.row)}
        
        >
          <EditNoteIcon />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h4>Doctor List</h4>
        </div>
        <br />

        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Lab Name <span>:</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter Lab Name"
            />
          </div>
          <button
            className="RegisterForm_1_btns"
            type="submit"
            onClick={handlenavigate}
          >
            <AddCircleOutlineIcon />
          </button>
        </div>
        <div className="Main_container_app">
          <ReactGrid columns={referdoccolumn} RowData={filteredRows} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ReferDoctorList;

